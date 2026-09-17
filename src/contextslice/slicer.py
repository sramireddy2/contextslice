"""Pass P2: slice the design graph from a target.

In compiler terms this is a *backward program slice* (Weiser, 1981): everything the slicing
criterion (the target frame) may depend on. On a dependence graph a slice is plain reachability,
so the whole pass is a breadth-first search that only follows dependency edges: O(V + E).

The slice is the *candidate universe* for the rest of the compiler: nothing outside it can ever
be selected, and everything inside it is something the target genuinely references.
"""

from collections import Counter, deque
from collections.abc import Collection, Iterable
from dataclasses import dataclass

import networkx as nx

from contextslice.figma_json import compact_json
from contextslice.graph import DEPENDENCY_EDGES, EdgeKind
from contextslice.ir import DesignFile, NodeKind


def dependency_slice(
    graph: nx.MultiDiGraph,
    roots: Iterable[str],
    *,
    edge_kinds: Collection[EdgeKind] = DEPENDENCY_EDGES,
    include_hidden: bool = False,
) -> set[str]:
    """Every vertex reachable from ``roots`` along edges whose kind is in ``edge_kinds``.

    Hidden design nodes (``visible: false``) are not entered unless ``include_hidden`` is set:
    they never render, so neither they nor anything only they reference belongs in the context.
    """
    seen: set[str] = set()
    queue = deque(root for root in roots if root in graph)
    seen.update(queue)

    while queue:
        current = queue.popleft()
        for _, successor, data in graph.out_edges(current, data=True):
            if data["kind"] not in edge_kinds or successor in seen:
                continue
            if not include_hidden and graph.nodes[successor].get("visible") is False:
                continue
            seen.add(successor)
            queue.append(successor)
    return seen


def slice_roots(design: DesignFile, target_id: str) -> tuple[str, ...]:
    """A component set has no content of its own, so targeting one means targeting its variants."""
    target = design.nodes[target_id]
    if target.kind is NodeKind.COMPONENT_SET:
        return (target_id, *target.child_ids)
    return (target_id,)


@dataclass(frozen=True)
class SliceSummary:
    target_id: str
    design_nodes: int
    inlined_nodes: int
    nodes_by_kind: Counter[NodeKind]
    components: int
    component_sets: int
    missing_components: int
    variables: int
    variables_via_alias_only: int
    unresolved_variables: int
    styles: int
    mappings: int
    instances: int
    instances_with_mapping: int
    raw_chars: int
    normalized_chars: int


def summarize(
    design: DesignFile, graph: nx.MultiDiGraph, target_id: str, members: set[str]
) -> SliceSummary:
    kinds = Counter(graph.nodes[m]["kind"] for m in members)
    design_nodes = [design.nodes[m] for m in members if m in design.nodes]
    variables = [design.variables[m] for m in members if m in design.variables]

    directly_bound = {binding.variable_id for node in design_nodes for binding in node.bindings}
    mapped_nodes = {mapping.node_id for mapping in design.mappings}

    instances = [node for node in design_nodes if node.kind is NodeKind.INSTANCE]

    def has_mapping(component_id: str | None) -> bool:
        component = design.components.get(component_id or "")
        return component_id in mapped_nodes or bool(component and component.set_id in mapped_nodes)

    return SliceSummary(
        target_id=target_id,
        design_nodes=len(design_nodes),
        inlined_nodes=sum(node.inlined for node in design_nodes),
        nodes_by_kind=Counter(node.kind for node in design_nodes),
        components=sum(node.kind is NodeKind.COMPONENT for node in design_nodes),
        component_sets=sum(node.kind is NodeKind.COMPONENT_SET for node in design_nodes),
        missing_components=kinds["missing_component"],
        variables=len(variables),
        variables_via_alias_only=sum(v.id not in directly_bound for v in variables),
        unresolved_variables=sum(not v.resolved for v in variables),
        styles=kinds["style"],
        mappings=kinds["mapping"],
        instances=len(instances),
        instances_with_mapping=sum(has_mapping(node.component_id) for node in instances),
        raw_chars=sum(node.raw_chars for node in design_nodes),
        normalized_chars=sum(len(compact_json(node.props)) for node in design_nodes),
    )
