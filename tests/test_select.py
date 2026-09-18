from dataclasses import replace

import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from conftest import TOY_SDS
from contextslice.build_ir import build_design_file
from contextslice.compile import compile_context
from contextslice.emit import emit
from contextslice.ir import CodeMapping
from contextslice.select import (
    FULL,
    OMIT,
    STUB,
    BudgetError,
    Selection,
    build_items,
    relevance_bfs,
    relevance_pagerank,
    select,
)
from contextslice.substitute import build_context_tree, walk_context
from contextslice.tokens import ApproxTokenCounter
from contextslice.verify import verify

COUNTER = ApproxTokenCounter()


def text(node_id: str, characters: str, variable: str | None = None) -> dict:
    node = {"id": node_id, "type": "TEXT", "name": "t", "characters": characters}
    if variable:
        node["boundVariables"] = {"fills": [{"type": "VARIABLE_ALIAS", "id": variable}]}
    return node


def screen_design(children: list[dict]):
    """A screen frame with arbitrary children; the toy SDS fixture supplies variables."""
    document = {
        "name": "Screen",
        "version": "1",
        "components": {"10:1": {"key": "k", "name": "Card", "remote": False}},
        "componentSets": {},
        "styles": {},
        "document": {
            "id": "0:0",
            "type": "DOCUMENT",
            "name": "Doc",
            "children": [
                {
                    "id": "0:1",
                    "type": "CANVAS",
                    "name": "Page",
                    "children": [
                        {"id": "20:0", "type": "FRAME", "name": "Screen", "children": children}
                    ],
                }
            ],
        },
    }
    design = build_design_file(document, TOY_SDS)
    return replace(
        design,
        mappings=(CodeMapping("10:1", "Card", "", "src/figma/compositions/Card.figma.ts"),),
    )


def section(node_id: str, name: str, children: list[dict]) -> dict:
    return {
        "id": node_id,
        "type": "FRAME",
        "name": name,
        "layoutMode": "VERTICAL",
        "children": children,
    }


RICH = screen_design(
    [
        section(
            "30:0",
            "Hero",
            [
                text("30:1", "Welcome to the product", "VariableID:1:10"),
                text("30:2", "A short subtitle", "VariableID:1:10"),
            ],
        ),
        section(
            "31:0",
            "Details",
            [
                text("31:1", "Spacing is set from a size token", "VariableID:1:20"),
                {
                    "id": "31:2",
                    "type": "INSTANCE",
                    "name": "Card",
                    "componentId": "10:1",
                    "children": [],
                },
                text("31:3", "Trailing note"),
            ],
        ),
        section("32:0", "Footer", [text("32:1", "Copyright")]),
    ]
)


def compile_with(design, budget, selector="bfs", **kwargs):
    return compile_context(
        design, "20:0", COUNTER, sds_root=TOY_SDS, budget=budget, selector=selector, **kwargs
    )


def core_tokens(design) -> int:
    """Tokens of the smallest legal bundle: header, section heading and the target line."""
    tree = build_context_tree(design, "20:0")
    core = emit(design, tree, sds_root=TOY_SDS, selection=Selection(levels={"20:0": FULL}))
    return COUNTER.count(core.text)


def budget_between(design, fraction: float) -> int:
    """A budget that is ``fraction`` of the way from the core bundle to the unbudgeted one."""
    floor = core_tokens(design) + 8  # + the selector's minimum safety margin
    full = compile_context(design, "20:0", COUNTER, sds_root=TOY_SDS).tokens
    return floor + int((full - floor) * fraction)


def test_a_generous_budget_selects_everything_in_full() -> None:
    unbudgeted = compile_context(RICH, "20:0", COUNTER, sds_root=TOY_SDS)
    budgeted = compile_with(RICH, budget=100_000)

    assert budgeted.selection is not None
    levels = budgeted.selection.levels
    assert all(levels[node.node_id] == FULL for node, _ in walk_context(budgeted.tree))
    assert budgeted.bundle.tree == unbudgeted.bundle.tree
    assert budgeted.bundle.tokens == unbudgeted.bundle.tokens
    assert budgeted.verification.ok


def test_the_smallest_budget_keeps_only_the_target_line() -> None:
    core = compile_with(RICH, budget=core_tokens(RICH) + 9)  # room for the margin, not a stub

    lines = core.bundle.tree.splitlines()
    assert len(lines) == 2  # "## TREE" + the target frame
    assert lines[1].endswith("(+3 elided)")  # the model is told three children were dropped
    assert core.verification.ok


def test_budget_below_the_core_is_an_error() -> None:
    with pytest.raises(BudgetError):
        compile_with(RICH, budget=5)


def test_a_full_line_never_appears_without_its_definitions() -> None:
    budget = budget_between(RICH, 0.66)
    mid = compile_with(RICH, budget=budget)

    assert mid.verification.ok  # no dangling $token or <Component>
    assert mid.verification.tokens <= budget
    assert len(mid.bundle.tree.splitlines()) > 2  # something beyond the target line was chosen


def test_children_never_appear_under_an_omitted_parent() -> None:
    mid = compile_with(RICH, budget=budget_between(RICH, 0.5))
    levels = mid.selection.levels

    for node, _ in walk_context(mid.tree):
        for child in node.children:
            if levels.get(child.node_id, OMIT) > OMIT:
                assert levels.get(node.node_id, OMIT) >= STUB


def test_a_shared_definition_is_paid_once() -> None:
    # Two texts share the brand color variable. If the second text were charged for the
    # variable again, this budget would only fit one of them.
    design = screen_design(
        [text("40:1", "one", "VariableID:1:10"), text("40:2", "two", "VariableID:1:10")]
    )
    tree = build_context_tree(design, "20:0")
    items = build_items(design, tree, COUNTER, relevance_bfs(tree))
    variable_line_cost = COUNTER.count("color-background-brand: #2c2c2c")
    exact = (
        items["20:0"].full_cost
        + items["40:1"].full_cost
        + items["40:2"].full_cost
        + variable_line_cost
    )

    selection = select(design, tree, items, COUNTER, exact, sds_root=TOY_SDS)

    assert selection.levels == {"20:0": FULL, "40:1": FULL, "40:2": FULL}
    assert selection.estimated_tokens == exact


def test_bfs_scores_decay_with_depth() -> None:
    tree = build_context_tree(RICH, "20:0")
    scores = relevance_bfs(tree)

    assert scores["20:0"] == 1.0
    assert scores["30:0"] > scores["30:1"]


def test_pagerank_gives_the_target_the_highest_score(toy_design, toy_graph) -> None:
    scores = relevance_pagerank(toy_design, toy_graph, "5:0")

    assert max(scores, key=scores.get) == "5:0"
    assert scores["5:1"] > 0


@settings(max_examples=25, deadline=None)
@given(fraction=st.floats(min_value=0.0, max_value=1.0), selector=st.sampled_from(["bfs", "ppr"]))
def test_any_budget_yields_a_verified_bundle_within_budget(fraction, selector) -> None:
    budget = budget_between(RICH, fraction)

    result = compile_with(RICH, budget=budget, selector=selector)

    assert result.verification.ok, result.verification.problems
    assert verify(result.bundle, COUNTER, budget).ok
    assert result.bundle.text == compile_with(RICH, budget=budget, selector=selector).bundle.text
