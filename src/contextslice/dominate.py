"""Pass P3: dominator analysis, i.e. "what does dropping this actually free?"

In the dependency slice rooted at the target, X *dominates* Y when every path from the root to
Y passes through X (Lengauer-Tarjan / Cooper-Harvey-Kennedy; here via NetworkX). A vertex's
*retained tokens* are its own cost plus the cost of everything it dominates: exactly the tokens
that disappear if it is removed, because nothing else could still reach them. Heap profilers
call the same quantity "retained size".

Two consequences drive the rest of the compiler:

* a definition (variable, code mapping) whose immediate dominator is the root is **shared** by
  independent subtrees, so dropping any one subtree never recovers its tokens;
* a definition dominated by a subtree is **private** to it and is priced into that subtree.
"""

from collections import defaultdict
from collections.abc import Callable
from dataclasses import dataclass

import networkx as nx

from contextslice.emit import Rendered
from contextslice.graph import DEPENDENCY_EDGES, EdgeKind
from contextslice.ir import DesignFile
from contextslice.slicer import dependency_slice, slice_roots
from contextslice.tokens import TokenCounter

VIRTUAL_ROOT = "<root>"


@dataclass(frozen=True)
class Ownership:
    root: str
    roots: frozenset[str]  # the target (or a component set's variants)
    idom: dict[str, str]  # vertex -> immediate dominator; the virtual root has none
    cost: dict[str, int]  # vertex -> tokens it contributes to the bundle (0 if not emitted)
    retained: dict[str, int]  # vertex -> cost of the vertex plus everything it dominates
    dominated: dict[str, frozenset[str]]  # vertex -> every vertex it dominates (excluding itself)
    emitted: frozenset[str]  # design nodes that have a line in the bundle

    def owner_of(self, vertex: str) -> str | None:
        """The deepest *emitted* subtree that dominates ``vertex``, or None if none does.

        The immediate dominator alone is not enough: a mapping used by cards in two grids has
        the Card *component* as its immediate dominator, and that vertex is not part of the
        bundle. Walking up the dominator tree to the nearest emitted node answers the question
        that matters: is there one line in the bundle whose removal would free this?
        """
        current = self.idom.get(vertex)
        while current is not None and current != self.root:
            if current in self.emitted and current not in self.roots:
                return current
            current = self.idom.get(current)
        return None

    def is_shared(self, vertex: str) -> bool:
        """True when no single subtree owns the vertex."""
        return self.owner_of(vertex) is None


def analyze_ownership(
    design: DesignFile,
    graph: nx.MultiDiGraph,
    target_id: str,
    rendered: Rendered,
    counter: TokenCounter,
) -> Ownership:
    roots = slice_roots(design, target_id)
    members = dependency_slice(graph, roots)

    # Dominators are defined on a plain digraph of *dependency* edges only. Following the
    # non-dependency kinds (HAS_VARIANT, CORRESPONDS_TO) would invent paths that do not exist.
    dependencies = nx.DiGraph()
    dependencies.add_nodes_from(members)
    dependencies.add_edges_from(
        (source, target)
        for source, target, data in graph.edges(data=True)
        if source in members and target in members and data["kind"] in DEPENDENCY_EDGES
    )
    dependencies.add_edges_from((VIRTUAL_ROOT, root) for root in roots)
    idom = nx.immediate_dominators(dependencies, VIRTUAL_ROOT)
    idom.pop(VIRTUAL_ROOT, None)  # some versions map the root to itself, others omit it

    cost = _costs(rendered, counter)
    retained, dominated = _accumulate(idom, cost)
    return Ownership(
        root=VIRTUAL_ROOT,
        roots=frozenset(roots),
        idom=idom,
        cost=cost,
        retained=retained,
        dominated=dominated,
        emitted=frozenset(node.node_id for node, _, _ in rendered.lines),
    )


def _costs(rendered: Rendered, counter: TokenCounter) -> dict[str, int]:
    cost: dict[str, int] = defaultdict(int)
    for node, depth, line in rendered.lines:
        cost[node.node_id] += counter.count("  " * depth + line)
    for variable_id, line in rendered.variable_lines.items():
        cost[variable_id] += counter.count(line)
    for mapping_key, entry in rendered.component_entries.items():
        cost[mapping_key] += counter.count(entry)
    return dict(cost)


def _accumulate(
    idom: dict[str, str], cost: dict[str, int]
) -> tuple[dict[str, int], dict[str, frozenset[str]]]:
    """Sum costs up the dominator tree (post-order), collecting the dominated set as we go."""
    children: dict[str, list[str]] = defaultdict(list)
    for vertex, dominator in idom.items():
        children[dominator].append(vertex)

    retained: dict[str, int] = {}
    dominated: dict[str, frozenset[str]] = {}

    def visit(vertex: str) -> None:
        owned: set[str] = set()
        total = cost.get(vertex, 0)
        for child in children.get(vertex, ()):
            visit(child)
            total += retained[child]
            owned.add(child)
            owned |= dominated[child]
        retained[vertex] = total
        dominated[vertex] = frozenset(owned)

    # Dominator trees are shallow enough for recursion (depth <= design depth + a few hops),
    # but raise the limit defensively for pathological files.
    import sys

    previous = sys.getrecursionlimit()
    sys.setrecursionlimit(max(previous, 10_000))
    try:
        visit(VIRTUAL_ROOT)
    finally:
        sys.setrecursionlimit(previous)
    return retained, dominated


@dataclass(frozen=True)
class OwnerRow:
    node_id: str
    line: str
    own: int
    retained: int
    private_variables: int
    private_components: int


def top_owners(
    ownership: Ownership,
    rendered: Rendered,
    is_variable: Callable[[str], bool],
    is_mapping: Callable[[str], bool],
    limit: int = 20,
) -> list[OwnerRow]:
    """Emitted design nodes ranked by retained tokens: the heap-profiler view."""
    rows = []
    for node, _, line in rendered.lines:
        owned = ownership.dominated.get(node.node_id, frozenset())
        rows.append(
            OwnerRow(
                node_id=node.node_id,
                line=line,
                own=ownership.cost.get(node.node_id, 0),
                retained=ownership.retained.get(node.node_id, 0),
                private_variables=sum(is_variable(v) for v in owned),
                private_components=sum(is_mapping(v) for v in owned),
            )
        )
    return sorted(rows, key=lambda row: row.retained, reverse=True)[:limit]


def definition_split(ownership: Ownership, keys: list[str]) -> tuple[int, int, int, int]:
    """(shared count, shared tokens, private count, private tokens) for the given definitions."""
    shared = [k for k in keys if ownership.is_shared(k)]
    private = [k for k in keys if not ownership.is_shared(k)]
    return (
        len(shared),
        sum(ownership.cost.get(k, 0) for k in shared),
        len(private),
        sum(ownership.cost.get(k, 0) for k in private),
    )


__all__ = [
    "EdgeKind",
    "Ownership",
    "OwnerRow",
    "analyze_ownership",
    "definition_split",
    "top_owners",
]
