"""Measure the greedy selector's optimality gap against the exact solver (``contextslice gap``).

Both selections are compared as *exactly feasible bundles*: the greedy as shipped (after its
LIFO repair), the ILP after the same budget tightening the driver applies. The objective is the
shared model objective (``select.selection_value``), so the gap is a statement about the
algorithm, not about tokenizer noise.
"""

from dataclasses import dataclass
from pathlib import Path

import networkx as nx

from contextslice import emit
from contextslice.compile import (
    MAX_BUDGET_CUTS,
    compile_context,
    relevance_scores,
    selection_budget,
)
from contextslice.ilp import optimal_selection
from contextslice.ir import DesignFile
from contextslice.select import EXAMPLE, build_items, selection_value
from contextslice.tokens import TokenCounter


@dataclass(frozen=True)
class GapReport:
    target_id: str
    target_path: str
    budget: int
    selector: str
    greedy_objective: float
    ilp_objective: float
    greedy_tokens: int  # exact, rendered
    ilp_tokens: int  # exact, rendered, after tightening
    model_budget: int  # what both selectors were given before tightening
    budget_cuts: int  # how many times the ILP budget had to be tightened to fit exactly
    variables: int
    constraints: int
    solve_seconds: float

    @property
    def gap(self) -> float:
        """Share of the optimum the greedy forgoes (0 = optimal)."""
        if self.ilp_objective <= 0:
            return 0.0
        return max(0.0, 1.0 - self.greedy_objective / self.ilp_objective)


def measure_gap(
    design: DesignFile,
    graph: nx.MultiDiGraph,
    target_id: str,
    counter: TokenCounter,
    budget: int,
    *,
    selector: str = "ppr",
    request: str | None = None,
    sds_root: Path | None = None,
    component_detail: str = EXAMPLE,
) -> GapReport:
    greedy = compile_context(
        design,
        target_id,
        counter,
        sds_root=sds_root,
        graph=graph,
        budget=budget,
        selector=selector,
        request=request,
        component_detail=component_detail,  # type: ignore[arg-type]
        optimizer="greedy",
    )
    assert greedy.selection is not None
    tree = greedy.tree
    scores = relevance_scores(design, graph, tree, target_id, selector, request)
    items = build_items(design, tree, counter, scores, sds_root=sds_root)
    model_budget = selection_budget(
        design,
        tree,
        items,
        counter,
        budget,
        sds_root=sds_root,
        component_detail=component_detail,  # type: ignore[arg-type]
    )

    cuts, current, seconds = 0, model_budget, 0.0
    while True:
        solution = optimal_selection(
            design,
            tree,
            items,
            counter,
            current,
            sds_root=sds_root,
            component_detail=component_detail,
        )
        seconds += solution.seconds
        rendered = emit.emit(
            design,
            tree,
            sds_root=sds_root,
            component_detail=component_detail,  # type: ignore[arg-type]
            selection=solution.selection,
        )
        exact = counter.count(rendered.text)
        if exact <= budget or cuts >= MAX_BUDGET_CUTS:
            break
        current -= exact - budget
        cuts += 1

    return GapReport(
        target_id=target_id,
        target_path=design.path_of(target_id),
        budget=budget,
        selector=selector,
        greedy_objective=selection_value(items, greedy.selection),
        ilp_objective=solution.objective,
        greedy_tokens=greedy.tokens,
        ilp_tokens=exact,
        model_budget=model_budget,
        budget_cuts=cuts,
        variables=solution.variables,
        constraints=solution.constraints,
        solve_seconds=seconds,
    )
