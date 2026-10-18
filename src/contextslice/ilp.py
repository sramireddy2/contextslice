"""Exact solver for the budgeted selection (P7): an integer linear program over the selector's
own cost model, solved with HiGHS (shipped inside SciPy).

The production selector was a lazy cost-benefit greedy. Greedy is fast and usually good, but
"usually" is not a number, so this solver was first written as a *reference* to measure the
greedy's optimality gap (``contextslice gap``, docs/census.md). The measurement showed the
greedy optimal in most PageRank cases but off by 2-21% in others, while the exact solve takes
10-300 ms on a context tree of a few hundred items. At that price the exact answer is simply
the better engineering choice, so compile.py uses this solver by default and keeps the greedy
as a fallback (ADR-0007).

The model is the greedy's model: the same items, levels, precedence and dependency rules, the
same additive token costs and one-time section costs, and the same objective
(``select.selection_value``). Costs are estimates, so a solution can come out a few tokens over
the real budget once rendered and counted exactly; the driver then tightens the model budget by
the overshoot and re-solves (the greedy's equivalent is its LIFO repair).

Decision variables (all binary):

* ``s_i`` item i is shown at least as a stub, ``f_i`` item i is shown in full
  (components and slots have no stub level: ``s_i = f_i``);
* ``d_v`` variable definition v is emitted; ``m_k`` code component k is listed (imports level),
  ``e_k`` its JSX example is included (``e_k <= m_k``);
* ``g_imports``, ``g_components``, ``g_pattern``: the one-time header/section costs that appear
  with the first component, the first entry, the first pattern.

Constraints: ``f_i <= s_i``; ``s_child <= s_parent`` (precedence); ``f_i <= d_v`` and
``f_i <= m_k`` for the definitions a full line references; the one-time flags dominate what
triggers them; and one knapsack row for the budget. The root is fixed to full, as in the greedy.
HiGHS is deterministic for a given model, so bundles stay byte-stable.
"""

import time
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from scipy.optimize import Bounds, LinearConstraint, milp
from scipy.sparse import csr_matrix

from contextslice import emit
from contextslice.ir import DesignFile
from contextslice.select import (
    EXAMPLE,
    EXAMPLE_SHARE,
    FULL,
    IMPORTS,
    STUB,
    STUB_SHARE,
    Item,
    Selection,
    selection_value,
)
from contextslice.substitute import ContextNode, Role, walk_context
from contextslice.tokens import TokenCounter

TIME_LIMIT_SECONDS = 5.0  # far above the ~0.1 s a screen needs; a guard, not a budget


class IlpUnsolved(RuntimeError):
    """The solver returned no usable solution (time limit or an infeasible model)."""


@dataclass(frozen=True)
class IlpSolution:
    selection: Selection
    objective: float
    estimated_tokens: int  # cost under the selector's additive model
    variables: int
    constraints: int
    seconds: float
    status: str  # HiGHS status message


def optimal_selection(
    design: DesignFile,
    root: ContextNode,
    items: dict[str, Item],
    counter: TokenCounter,
    budget: int,
    *,
    sds_root: Path | None = None,
    component_detail: str = EXAMPLE,
) -> IlpSolution:
    """Solve the selection problem exactly under the selector's cost model."""
    started = time.perf_counter()
    order = [node.node_id for node, _ in walk_context(root)]
    parents: dict[str, str] = {}
    for node, _ in walk_context(root):
        for child in node.children:
            parents[child.node_id] = node.node_id

    variable_ids = sorted({v for item in items.values() for v in item.variables})
    mapping_keys = sorted({m for item in items.values() for m in item.mappings})
    variable_cost = {
        v: counter.count(line) for v, line in emit.variable_lines_for(design, variable_ids).items()
    }
    mappings = emit.mappings_for(design, mapping_keys)
    entry_cost = {k: emit.entry_costs(m, sds_root, counter) for k, m in mappings.items()}
    flags = {k: emit.entry_flags(m, sds_root) for k, m in mappings.items()}
    overheads = emit.section_overheads(counter)

    # -- variable layout -------------------------------------------------------------------
    index: dict[tuple[str, str], int] = {}

    def var(kind: str, key: str) -> int:
        return index.setdefault((kind, key), len(index))

    for node_id in order:
        var("s", node_id)
        var("f", node_id)
    for v in variable_ids:
        var("d", v)
    for k in mapping_keys:
        var("m", k)
        var("e", k)
    g_imports, g_components, g_pattern = var("g", "imports"), var("g", "components"), var("g", "p")
    n = len(index)

    cost = np.zeros(n)
    gain = np.zeros(n)
    lower = np.zeros(n)
    upper = np.ones(n)
    users: dict[str, float] = {}
    for item in items.values():
        for key in item.mappings:
            users[key] = users.get(key, 0.0) + item.value

    for node_id in order:
        item = items[node_id]
        s, f = index[("s", node_id)], index[("f", node_id)]
        cost[s] = item.stub_cost
        cost[f] = item.full_cost - item.stub_cost
        gain[s] = item.value * STUB_SHARE
        gain[f] = item.value * (1 - STUB_SHARE)
    for v in variable_ids:
        cost[index[("d", v)]] = variable_cost[v]
    for k in mapping_keys:
        cost[index[("m", k)]] = entry_cost[k][IMPORTS]
        cost[index[("e", k)]] = entry_cost[k][EXAMPLE] - entry_cost[k][IMPORTS]
        gain[index[("e", k)]] = EXAMPLE_SHARE * users.get(k, 0.0)
        if component_detail == IMPORTS:
            upper[index[("e", k)]] = 0.0
    cost[g_imports] = overheads["imports"] + overheads["legend"]
    cost[g_components] = overheads["components"]
    cost[g_pattern] = overheads["pattern_legend"]
    root_s, root_f = index[("s", root.node_id)], index[("f", root.node_id)]
    lower[root_s] = lower[root_f] = 1.0  # the mandatory core

    # -- constraint rows: (coefficients, lower bound, upper bound) ---------------------------
    rows: list[dict[int, float]] = []
    lbs: list[float] = []
    ubs: list[float] = []

    def add(coefficients: dict[int, float], lb: float = -np.inf, ub: float = 0.0) -> None:
        rows.append(coefficients)
        lbs.append(lb)
        ubs.append(ub)

    for node_id in order:
        item = items[node_id]
        s, f = index[("s", node_id)], index[("f", node_id)]
        if item.role is Role.NODE:
            add({f: 1.0, s: -1.0})  # full implies stub
        else:
            add({f: 1.0, s: -1.0}, lb=0.0, ub=0.0)  # no stub level: s == f
        if node_id in parents:
            add({s: 1.0, index[("s", parents[node_id])]: -1.0})  # precedence
        for v in item.variables:
            add({f: 1.0, index[("d", v)]: -1.0})  # a full line pulls its definitions in
        for k in item.mappings:
            add({f: 1.0, index[("m", k)]: -1.0})
    for k in mapping_keys:
        m, e = index[("m", k)], index[("e", k)]
        add({e: 1.0, m: -1.0})
        add({m: 1.0, g_imports: -1.0})
        add({e: 1.0, g_components: -1.0})
        if flags[k].shows_entry:
            add({m: 1.0, g_components: -1.0})
        if flags[k].pattern:
            add({m: 1.0, g_pattern: -1.0})
    add({j: cost[j] for j in range(n) if cost[j]}, ub=float(budget))  # the knapsack

    data, row_index, col_index = [], [], []
    for r, coefficients in enumerate(rows):
        for j, coefficient in coefficients.items():
            data.append(coefficient)
            row_index.append(r)
            col_index.append(j)
    matrix = csr_matrix((data, (row_index, col_index)), shape=(len(rows), n))

    result = milp(
        c=-gain,  # milp minimises
        constraints=LinearConstraint(matrix, np.array(lbs), np.array(ubs)),
        integrality=np.ones(n),
        bounds=Bounds(lower, upper),
        options={"time_limit": TIME_LIMIT_SECONDS},
    )
    if result.x is None or not result.success:
        raise IlpUnsolved(str(result.message))
    x = np.rint(result.x)

    selection = Selection()
    for node_id in order:
        if x[index[("f", node_id)]]:
            selection.levels[node_id] = FULL
        elif x[index[("s", node_id)]]:
            selection.levels[node_id] = STUB
    for k in mapping_keys:
        if x[index[("e", k)]]:
            selection.component_detail[k] = EXAMPLE
        elif x[index[("m", k)]]:
            selection.component_detail[k] = IMPORTS
    selection.estimated_tokens = int(round(float(cost @ x)))
    return IlpSolution(
        selection=selection,
        objective=selection_value(items, selection),
        estimated_tokens=selection.estimated_tokens,
        variables=n,
        constraints=len(rows),
        seconds=time.perf_counter() - started,
        status=str(result.message),
    )
