"""The compiler driver: run the passes in order and keep a token ledger.

The ledger is the project's main instrument. After every stage it records how many tokens the
context would cost *if we stopped there*, so each pass has to justify itself with a number,
and an ablation ("what if we switch pass X off?") is just another row.
"""

import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from contextslice.emit import Bundle, ComponentDetail, emit
from contextslice.figma_json import Raw, compact_json, walk
from contextslice.ir import DesignFile
from contextslice.substitute import build_context_tree, walk_context
from contextslice.tokens import TokenCounter


@dataclass(frozen=True)
class LedgerRow:
    stage: str
    tokens: int
    nodes: int


@dataclass(frozen=True)
class CompileResult:
    bundle: Bundle
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
    component_detail: ComponentDetail = "example",
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

    bundle = plain
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

    return CompileResult(
        bundle=bundle,
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
