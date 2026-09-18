"""Passes P6 and P7: relevance scoring and budgeted selection.

The problem: choose a level of detail for every item of the context tree so that the bundle's
utility is as high as possible while its token count stays under the budget B. Two things make
it more than a knapsack:

* **precedence**: a node can only appear if its parent appears (at least as a stub), and a full
  line that references a variable or a code component pulls that definition in with it;
* **shared costs**: a definition is paid once. The first item that needs it pays; later items get
  it for free. So an item's marginal cost depends on what was already selected.

The production selector is a cost-benefit greedy over *upgrade moves* (raise one item by one
level), evaluated lazily with a heap. Plain lazy greedy assumes a popped key can only have got
worse; here a paid dependency makes dependents *cheaper*, so whenever a dependency is first
paid, every move that needed it is re-pushed with a fresh key. That keeps the lazy evaluation
exact instead of silently suboptimal.

Rendered token costs are close to additive (one item per line) but not exactly, so the caller
finishes with an exact count and a repair loop (see compile.py).
"""

import heapq
import re
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path

import networkx as nx

from contextslice import emit
from contextslice.graph import DEPENDENCY_EDGES
from contextslice.ir import DesignFile
from contextslice.slicer import dependency_slice, slice_roots
from contextslice.substitute import ContextNode, Role, walk_context
from contextslice.tokens import TokenCounter

# Documented constants (see docs/census.md for the ablations that should justify them).
STUB_SHARE = 0.35  # a one-line stub captures this share of an item's value; the full line the rest
EXAMPLE_SHARE = 0.5  # a component's JSX example is worth this share of the value of its users
BFS_DECAY = 0.7  # for the breadth-first baseline selector: value = BFS_DECAY ** depth
PAGERANK_ALPHA = 0.85

FULL, STUB, OMIT = 2, 1, 0
IMPORTS, EXAMPLE = "imports", "example"


class BudgetError(ValueError):
    """The mandatory core (header, target line, its definitions) does not fit the budget."""


@dataclass(frozen=True)
class Item:
    """A context node with its rendered texts, costs and dependencies."""

    node_id: str
    parent_id: str | None
    role: Role
    full: str
    stub: str
    full_cost: int
    stub_cost: int
    variables: tuple[str, ...]  # variable ids a full line references
    mappings: tuple[str, ...]  # mapping keys a full line references
    value: float


@dataclass
class Selection:
    levels: dict[str, int] = field(default_factory=dict)
    component_detail: dict[str, str] = field(default_factory=dict)
    applied: list[tuple[str, int]] = field(default_factory=list)  # (item id, new level) in order
    estimated_tokens: int = 0

    def undo_last(self) -> tuple[str, int] | None:
        """Revert the most recent move. LIFO order keeps precedence intact by construction."""
        if not self.applied:
            return None
        key, level = self.applied.pop()
        if key.startswith("code:"):
            self.component_detail[key] = IMPORTS
        else:
            self.levels[key] = level - 1
        return key, level


def relevance_pagerank(
    design: DesignFile, graph: nx.MultiDiGraph, target_id: str, request: str | None = None
) -> dict[str, float]:
    """Personalized PageRank restarted at the target (and at nodes the request mentions)."""
    roots = slice_roots(design, target_id)
    members = dependency_slice(graph, roots)
    dependencies = nx.DiGraph()
    dependencies.add_nodes_from(members)
    dependencies.add_edges_from(
        (s, t)
        for s, t, data in graph.edges(data=True)
        if s in members and t in members and data["kind"] in DEPENDENCY_EDGES
    )

    personalization = dict.fromkeys(roots, 1.0)
    for term in _terms(request):  # Aider's trick: names the developer mentioned get restart mass
        for member in members:
            node = design.nodes.get(member)
            if node is not None and term in node.name.lower():
                personalization[member] = personalization.get(member, 0.0) + 0.5
    return nx.pagerank(dependencies, alpha=PAGERANK_ALPHA, personalization=personalization)


def relevance_bfs(root: ContextNode) -> dict[str, float]:
    """Baseline: value decays with depth in the context tree. No graph algorithm at all."""
    return {node.node_id: BFS_DECAY**depth for node, depth in walk_context(root)}


def build_items(
    design: DesignFile,
    root: ContextNode,
    counter: TokenCounter,
    scores: dict[str, float],
) -> dict[str, Item]:
    items: dict[str, Item] = {}
    parents: dict[str, str | None] = {root.node_id: None}
    for node, depth in walk_context(root):
        for child in node.children:
            parents[child.node_id] = node.node_id
        texts = emit.describe(design, node)
        indent = "  " * depth
        items[node.node_id] = Item(
            node_id=node.node_id,
            parent_id=parents[node.node_id],
            role=node.role,
            full=texts.full,
            stub=texts.stub,
            full_cost=counter.count(indent + texts.full),
            stub_cost=counter.count(indent + texts.stub),
            variables=texts.variables,
            mappings=texts.mappings,
            value=scores.get(node.node_id, 0.0),
        )
    return items


def select(
    design: DesignFile,
    root: ContextNode,
    items: dict[str, Item],
    counter: TokenCounter,
    budget: int,
    *,
    sds_root: Path | None = None,
    component_detail: str = EXAMPLE,
) -> Selection:
    """Lazy cost-benefit greedy over upgrade moves under an (additive) token budget."""
    variable_cost = {
        v: counter.count(line)
        for v, line in emit.variable_lines_for(design, _all_vars(items)).items()
    }
    entry_cost: dict[str, dict[str, int]] = {}
    for key, mapping in emit.mappings_for(design, _all_maps(items)).items():
        entry_cost[key] = {
            detail: counter.count(emit.component_entry(mapping, sds_root, detail))
            for detail in (IMPORTS, EXAMPLE)
        }
    users: dict[str, list[str]] = {}  # mapping key -> items that reference it
    for item in items.values():
        for key in item.mappings:
            users.setdefault(key, []).append(item.node_id)

    selection = Selection()
    paid_vars: set[str] = set()
    paid_maps: set[str] = set()
    spent = 0
    dependents: dict[str, list[str]] = {}  # definition key -> item ids whose cost includes it
    for item in items.values():
        for dep in (*item.variables, *item.mappings):
            dependents.setdefault(dep, []).append(item.node_id)

    def move_cost(item: Item, level: int) -> int:
        if level == STUB:
            return item.stub_cost
        cost = item.full_cost - (item.stub_cost if selection.levels.get(item.node_id) else 0)
        cost += sum(variable_cost[v] for v in item.variables if v not in paid_vars)
        cost += sum(entry_cost[m][IMPORTS] for m in item.mappings if m not in paid_maps)
        return cost

    def move_gain(item: Item, level: int) -> float:
        """Concave in detail: the stub captures most of the value, the full line the rest.

        An item that jumps straight from omitted to full (components, slots) gets the whole
        value; a NODE gets it in two instalments.
        """
        if level == STUB:
            return item.value * STUB_SHARE
        was_stub = selection.levels.get(item.node_id, OMIT) == STUB
        return item.value * ((1 - STUB_SHARE) if was_stub else 1.0)

    def example_gain(key: str) -> float:
        return EXAMPLE_SHARE * sum(items[u].value for u in users.get(key, ()))

    def example_cost(key: str) -> int:
        return entry_cost[key][EXAMPLE] - entry_cost[key][IMPORTS]

    def ratio(gain: float, cost: int) -> float:
        return gain / max(cost, 1)

    heap: list[tuple[float, str, str, int]] = []  # (-ratio, kind, key, level)

    def next_level(item: Item) -> int | None:
        """The one move an item can make right now, or None when it is already full."""
        current = selection.levels.get(item.node_id, OMIT)
        if current == FULL:
            return None
        # Component references and slots have no cheaper form than their full line.
        return FULL if item.role is not Role.NODE else current + 1

    def push_node_move(item: Item) -> None:
        level = next_level(item)
        if level is None:
            return
        key = -ratio(move_gain(item, level), move_cost(item, level))
        heapq.heappush(heap, (key, "node", item.node_id, level))

    def push_example_move(key: str) -> None:
        if selection.component_detail.get(key) == EXAMPLE or component_detail == IMPORTS:
            return
        heapq.heappush(heap, (-ratio(example_gain(key), example_cost(key)), "code", key, FULL))

    def apply_node(item: Item, level: int) -> None:
        nonlocal spent
        spent += move_cost(item, level)
        selection.levels[item.node_id] = level
        selection.applied.append((item.node_id, level))
        if level == FULL:
            newly_paid = [v for v in item.variables if v not in paid_vars]
            paid_vars.update(newly_paid)
            newly_paid_maps = [m for m in item.mappings if m not in paid_maps]
            for key in newly_paid_maps:
                paid_maps.add(key)
                selection.component_detail[key] = IMPORTS
                push_example_move(key)
            # Dependents just got cheaper: their stale heap keys are no longer upper bounds.
            for dep in (*newly_paid, *newly_paid_maps):
                for dependent in dependents.get(dep, ()):
                    if dependent != item.node_id and dependent in items:
                        push_node_move(items[dependent])
        push_node_move(item)  # its own next level, if any
        if level >= STUB:
            for child in children.get(item.node_id, ()):  # children are now allowed to appear
                if child not in selection.levels:
                    push_node_move(items[child])

    children: dict[str, list[str]] = {}
    for item in items.values():
        if item.parent_id is not None:
            children.setdefault(item.parent_id, []).append(item.node_id)

    # Mandatory core: the target line itself, at full detail.
    root_item = items[root.node_id]
    core = move_cost(root_item, FULL)
    if core > budget:
        raise BudgetError(f"the target line alone needs {core} tokens; budget is {budget}")
    apply_node(root_item, FULL)

    while heap:
        neg_ratio, kind, key, level = heapq.heappop(heap)
        if kind == "node":
            item = items[key]
            if level != next_level(item):
                continue  # stale: this move was already applied or superseded
            if item.parent_id is not None and selection.levels.get(item.parent_id, OMIT) == OMIT:
                continue
            cost = move_cost(item, level)
            fresh = -ratio(move_gain(item, level), cost)
            if fresh < neg_ratio - 1e-12:  # key is stale: re-evaluate before trusting it
                heapq.heappush(heap, (fresh, kind, key, level))
                continue
            if spent + cost <= budget:
                apply_node(item, level)
        else:
            if selection.component_detail.get(key) != IMPORTS:
                continue
            cost = example_cost(key)
            if spent + cost <= budget:
                spent += cost
                selection.component_detail[key] = EXAMPLE
                selection.applied.append((key, FULL))

    selection.estimated_tokens = spent
    return selection


def select_all(root: ContextNode, component_detail: str = EXAMPLE) -> Selection:
    """The unbudgeted selection: every item at full detail."""
    selection = Selection()
    for node, _ in walk_context(root):
        selection.levels[node.node_id] = FULL
    return selection


def _all_vars(items: dict[str, Item]) -> list[str]:
    return sorted({v for item in items.values() for v in item.variables})


def _all_maps(items: dict[str, Item]) -> list[str]:
    return sorted({m for item in items.values() for m in item.mappings})


def _terms(request: str | None) -> list[str]:
    if not request:
        return []
    return [t for t in re.findall(r"[a-z0-9]+", request.lower()) if len(t) > 2]


Scorer = Callable[[ContextNode], dict[str, float]]
