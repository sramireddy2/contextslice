"""The compiler driver: run the passes in order and keep a token ledger.

The ledger is the project's main instrument. After every stage it records how many tokens the
context would cost *if we stopped there*, so each pass has to justify itself with a number,
and an ablation ("what if we switch pass X off?") is just another row.
"""

import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import networkx as nx

from contextslice.dedupe import collapse_repeats, folded_nodes
from contextslice.emit import Bundle, ComponentDetail, emit
from contextslice.figma_json import Raw, compact_json, walk
from contextslice.graph import build_graph
from contextslice.ilp import IlpUnsolved, optimal_selection
from contextslice.ir import DesignFile
from contextslice.select import (
    FULL,
    BudgetError,
    Selection,
    build_items,
    relevance_bfs,
    relevance_pagerank,
    select,
)
from contextslice.substitute import ContextNode, build_context_tree, walk_context
from contextslice.tokens import TokenCounter
from contextslice.verify import Verification, verify

MAX_BUDGET_CUTS = 8  # how often the exact optimizer's budget is tightened before giving up


@dataclass(frozen=True)
class LedgerRow:
    stage: str
    tokens: int
    nodes: int


@dataclass(frozen=True)
class CompileResult:
    tree: ContextNode
    bundle: Bundle
    selection: Selection | None
    verification: Verification
    ledger: tuple[LedgerRow, ...]
    section_tokens: dict[str, int]
    counter_name: str
    seconds: float

    @property
    def tokens(self) -> int:
        return self.ledger[-1].tokens


def compile_context(
    design: DesignFile,
    target_id: str,
    counter: TokenCounter,
    *,
    sds_root: Path | None = None,
    raw_document: Raw | None = None,
    substitute: bool = True,
    dedupe: bool = True,
    component_detail: ComponentDetail = "example",
    budget: int | None = None,
    selector: str = "ppr",
    optimizer: str = "exact",
    request: str | None = None,
    graph: nx.MultiDiGraph | None = None,
) -> CompileResult:
    """Run the pipeline for one target.

    ``selector`` chooses how relevance is scored (``ppr``: personalized PageRank, ``bfs``: depth
    decay); ``optimizer`` chooses how the budgeted selection is solved (``exact``: integer
    program, the default; ``greedy``: the lazy cost-benefit greedy, also the fallback).
    """
    started = time.perf_counter()
    ledger: list[LedgerRow] = []

    if raw_document is not None:
        raw = _find_raw(raw_document["document"], target_id)
        if raw is not None:
            ledger.append(
                LedgerRow("raw Figma JSON", counter.count(compact_json(raw)), _count(raw))
            )

    normalized = _normalized_tree(design, target_id)
    ledger.append(
        LedgerRow("P0 normalized JSON", counter.count(compact_json(normalized)), _count(normalized))
    )

    plain_tree = build_context_tree(design, target_id, substitute=False)
    plain = emit(design, plain_tree, sds_root=sds_root, component_detail=component_detail)
    ledger.append(
        LedgerRow(
            "outline format", counter.count(plain.text), sum(1 for _ in walk_context(plain_tree))
        )
    )

    bundle, tree = plain, plain_tree
    if substitute:
        tree = build_context_tree(design, target_id, substitute=True)
        bundle = emit(design, tree, sds_root=sds_root, component_detail=component_detail)
        ledger.append(
            LedgerRow(
                "P4 Code Connect substitution",
                counter.count(bundle.text),
                sum(1 for _ in walk_context(tree)),
            )
        )

    if dedupe:
        tree = collapse_repeats(design, tree)
        bundle = emit(design, tree, sds_root=sds_root, component_detail=component_detail)
        folded = sum(node.repeat - 1 for node in folded_nodes(tree))
        ledger.append(
            LedgerRow(
                f"P5 structural dedupe ({folded} repeats folded)",
                counter.count(bundle.text),
                sum(1 for _ in walk_context(tree)),
            )
        )

    selection = None
    if budget is not None:
        scores = relevance_scores(design, graph, tree, target_id, selector, request)
        items = build_items(design, tree, counter, scores, sds_root=sds_root)
        model_budget = selection_budget(
            design,
            tree,
            items,
            counter,
            budget,
            sds_root=sds_root,
            component_detail=component_detail,
        )
        render = lambda chosen: emit(  # noqa: E731 - a local alias keeps the two paths readable
            design, tree, sds_root=sds_root, component_detail=component_detail, selection=chosen
        )

        outcome = None
        if optimizer == "exact":
            outcome = _exact_selection(
                design,
                tree,
                items,
                counter,
                budget,
                model_budget,
                render,
                sds_root=sds_root,
                component_detail=component_detail,
            )
        if outcome is not None:
            selection, bundle, cuts = outcome
            how = f"exact ILP, {cuts} budget cuts"
        else:  # the greedy: asked for, or the fallback when the exact solve gave nothing usable
            selection = select(
                design,
                tree,
                items,
                counter,
                model_budget,
                sds_root=sds_root,
                component_detail=component_detail,
            )
            bundle = render(selection)
            # Exact count, then repair: undo the latest (lowest-ratio) moves until it truly fits.
            undone = 0
            while counter.count(bundle.text) > budget and selection.undo_last() is not None:
                undone += 1
                bundle = render(selection)
            how = f"greedy{'' if optimizer == 'greedy' else ' fallback'}, {undone} repaired"
        ledger.append(
            LedgerRow(
                f"P7 budgeted selection (B={budget}, {selector}, {how})",
                counter.count(bundle.text),
                len(bundle.rendered.lines),
            )
        )

    return CompileResult(
        tree=tree,
        bundle=bundle,
        selection=selection,
        verification=verify(bundle, counter, budget),
        ledger=tuple(ledger),
        section_tokens={
            "header": counter.count(bundle.header),
            "IMPORTS": counter.count(bundle.imports),
            "COMPONENTS": counter.count(bundle.components),
            "TOKENS": counter.count(bundle.tokens),
            "TREE": counter.count(bundle.tree),
        },
        counter_name=counter.name,
        seconds=time.perf_counter() - started,
    )


def _exact_selection(
    design: DesignFile,
    tree: ContextNode,
    items: dict,
    counter: TokenCounter,
    budget: int,
    model_budget: int,
    render,
    *,
    sds_root: Path | None,
    component_detail: ComponentDetail,
) -> tuple[Selection, Bundle, int] | None:
    """Solve exactly, then tighten the model budget until the rendered bundle really fits.

    Returns None when the solver gives nothing usable or the bundle still does not fit after
    MAX_BUDGET_CUTS rounds; the caller then falls back to the greedy and its LIFO repair.
    """
    cuts, current = 0, model_budget
    while True:
        try:
            solution = optimal_selection(
                design,
                tree,
                items,
                counter,
                current,
                sds_root=sds_root,
                component_detail=component_detail,
            )
        except IlpUnsolved:
            return None
        bundle = render(solution.selection)
        exact = counter.count(bundle.text)
        if exact <= budget:
            return solution.selection, bundle, cuts
        if cuts >= MAX_BUDGET_CUTS or current - (exact - budget) < items[tree.node_id].full_cost:
            return None
        current -= exact - budget
        cuts += 1


def relevance_scores(
    design: DesignFile,
    graph: nx.MultiDiGraph | None,
    tree: ContextNode,
    target_id: str,
    selector: str,
    request: str | None,
) -> dict[str, float]:
    if selector == "bfs":
        return relevance_bfs(tree)
    return relevance_pagerank(design, graph or build_graph(design), target_id, request)


def selection_budget(
    design: DesignFile,
    tree: ContextNode,
    items: dict,
    counter: TokenCounter,
    budget: int,
    *,
    sds_root: Path | None,
    component_detail: ComponentDetail,
) -> int:
    """The budget handed to the selector: B minus the fixed overhead and a safety margin.

    The overhead is everything that is not an item (header, section headings), measured by
    rendering the mandatory core alone. Line costs are nearly additive, not exactly, so 2% is
    kept back; the driver recounts exactly afterwards and tightens or repairs if needed.
    """
    core_only = Selection(levels={tree.node_id: FULL})
    core_bundle = emit(
        design, tree, sds_root=sds_root, component_detail=component_detail, selection=core_only
    )
    overhead = counter.count(core_bundle.text) - items[tree.node_id].full_cost
    margin = max(8, budget // 50)
    if budget - overhead - margin < items[tree.node_id].full_cost:
        raise BudgetError(
            f"budget {budget} cannot hold the fixed overhead ({overhead} tokens of header and "
            f"section headings + {margin} safety margin) plus the target line "
            f"({items[tree.node_id].full_cost} tokens)"
        )
    return budget - overhead - margin


def _find_raw(root: Raw, node_id: str) -> Raw | None:
    return next((node for node, _ in walk(root) if node["id"] == node_id), None)


def _count(tree: dict[str, Any]) -> int:
    return sum(1 for _ in walk(tree))


def _normalized_tree(design: DesignFile, node_id: str) -> dict[str, Any]:
    """The target subtree as nested JSON built from IR props: what P0 alone would hand an LLM."""
    node = design.nodes[node_id]
    result: dict[str, Any] = {"id": node.id, "name": node.name, "type": node.kind.value}
    result.update(node.props)
    if node.bindings:
        result["bindings"] = {b.field: b.variable_id for b in node.bindings}
    if node.child_ids:
        result["children"] = [_normalized_tree(design, child) for child in node.child_ids]
    return result
