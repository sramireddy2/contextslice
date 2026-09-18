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
    request: str | None = None,
    graph: nx.MultiDiGraph | None = None,
) -> CompileResult:
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
        if selector == "bfs":
            scores = relevance_bfs(tree)
        else:
            scores = relevance_pagerank(design, graph or build_graph(design), target_id, request)
        items = build_items(design, tree, counter, scores)
        # Fixed overhead = header + section headings: everything that is not an item.
        core_only = Selection(levels={tree.node_id: FULL})
        core_bundle = emit(
            design, tree, sds_root=sds_root, component_detail=component_detail, selection=core_only
        )
        overhead = counter.count(core_bundle.text) - items[tree.node_id].full_cost
        margin = max(8, budget // 50)  # line costs are ~additive, not exactly: keep 2% back
        if budget - overhead - margin < items[tree.node_id].full_cost:
            raise BudgetError(
                f"budget {budget} cannot hold the fixed overhead ({overhead} tokens of header and "
                f"section headings + {margin} safety margin) plus the target line "
                f"({items[tree.node_id].full_cost} tokens)"
            )
        selection = select(
            design,
            tree,
            items,
            counter,
            budget - overhead - margin,
            sds_root=sds_root,
            component_detail=component_detail,
        )
        bundle = emit(
            design, tree, sds_root=sds_root, component_detail=component_detail, selection=selection
        )
        # Exact count, then repair: undo the latest (lowest-ratio) moves until it truly fits.
        undone = 0
        while counter.count(bundle.text) > budget and selection.undo_last() is not None:
            undone += 1
            bundle = emit(
                design,
                tree,
                sds_root=sds_root,
                component_detail=component_detail,
                selection=selection,
            )
        ledger.append(
            LedgerRow(
                f"P7 budgeted selection (B={budget}, {selector}, {undone} repaired)",
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
            "COMPONENTS": counter.count(bundle.components),
            "TOKENS": counter.count(bundle.tokens),
            "TREE": counter.count(bundle.tree),
        },
        counter_name=counter.name,
        seconds=time.perf_counter() - started,
    )


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
