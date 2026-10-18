from hypothesis import given, settings
from hypothesis import strategies as st

from conftest import TOY_SDS
from contextslice.compile import relevance_scores, selection_budget
from contextslice.gap import measure_gap
from contextslice.ilp import optimal_selection
from contextslice.select import (
    EXAMPLE,
    FULL,
    OMIT,
    STUB,
    build_items,
    select,
    selection_value,
)
from contextslice.substitute import Role, build_context_tree, walk_context
from contextslice.tokens import ApproxTokenCounter
from test_select import RICH, budget_between, core_tokens

COUNTER = ApproxTokenCounter()


def prepared(design, budget: int):
    tree = build_context_tree(design, "20:0")
    scores = relevance_scores(design, None, tree, "20:0", "bfs", None)
    items = build_items(design, tree, COUNTER, scores, sds_root=TOY_SDS)
    model_budget = selection_budget(
        design, tree, items, COUNTER, budget, sds_root=TOY_SDS, component_detail=EXAMPLE
    )
    return tree, items, model_budget


def test_the_ilp_respects_precedence_definitions_and_the_budget() -> None:
    tree, items, model_budget = prepared(RICH, budget_between(RICH, 0.5))

    solution = optimal_selection(RICH, tree, items, COUNTER, model_budget, sds_root=TOY_SDS)
    levels = solution.selection.levels

    assert levels["20:0"] == FULL  # the mandatory core
    assert solution.estimated_tokens <= model_budget
    for node, _ in walk_context(tree):
        for child in node.children:
            if levels.get(child.node_id, OMIT) > OMIT:
                assert levels.get(node.node_id, OMIT) >= STUB
    for item in items.values():
        if levels.get(item.node_id, OMIT) == FULL:
            for key in item.mappings:  # a full component line has its definition listed
                assert solution.selection.component_detail.get(key) is not None
        if item.role is not Role.NODE:
            assert levels.get(item.node_id, OMIT) in (OMIT, FULL)  # no stub level exists


def test_a_generous_budget_selects_everything_like_the_greedy() -> None:
    tree, items, model_budget = prepared(RICH, 100_000)

    solution = optimal_selection(RICH, tree, items, COUNTER, model_budget, sds_root=TOY_SDS)
    greedy = select(RICH, tree, items, COUNTER, model_budget, sds_root=TOY_SDS)

    assert all(solution.selection.levels.get(n.node_id) == FULL for n, _ in walk_context(tree))
    assert solution.objective == selection_value(items, greedy)


@settings(max_examples=12, deadline=None)
@given(fraction=st.floats(min_value=0.05, max_value=0.95))
def test_the_optimum_is_never_below_the_greedy_on_the_shared_model(fraction: float) -> None:
    tree, items, model_budget = prepared(RICH, budget_between(RICH, fraction))

    greedy = select(RICH, tree, items, COUNTER, model_budget, sds_root=TOY_SDS)
    solution = optimal_selection(RICH, tree, items, COUNTER, model_budget, sds_root=TOY_SDS)

    assert solution.objective >= selection_value(items, greedy) - 1e-9


def test_measure_gap_compares_two_exactly_feasible_bundles(toy_graph) -> None:
    budget = core_tokens(RICH) + 120

    report = measure_gap(RICH, toy_graph, "20:0", COUNTER, budget, selector="bfs", sds_root=TOY_SDS)

    assert report.greedy_tokens <= budget and report.ilp_tokens <= budget
    assert 0.0 <= report.gap <= 1.0
    assert report.ilp_objective > 0 and report.variables > 0 and report.constraints > 0


def test_the_exact_optimizer_is_the_default_and_is_deterministic(toy_graph) -> None:
    from contextslice.compile import compile_context

    budget = core_tokens(RICH) + 120
    first = compile_context(RICH, "20:0", COUNTER, sds_root=TOY_SDS, graph=toy_graph, budget=budget)
    second = compile_context(
        RICH, "20:0", COUNTER, sds_root=TOY_SDS, graph=toy_graph, budget=budget
    )
    greedy = compile_context(
        RICH, "20:0", COUNTER, sds_root=TOY_SDS, graph=toy_graph, budget=budget, optimizer="greedy"
    )

    assert "exact ILP" in first.ledger[-1].stage and "greedy" in greedy.ledger[-1].stage
    assert first.bundle.text == second.bundle.text
    assert first.verification.ok and first.tokens <= budget
    assert greedy.verification.ok and greedy.tokens <= budget
