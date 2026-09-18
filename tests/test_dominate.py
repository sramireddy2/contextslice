from conftest import TOY_SDS
from contextslice.compile import compile_context
from contextslice.dominate import VIRTUAL_ROOT, analyze_ownership, definition_split, top_owners
from contextslice.tokens import ApproxTokenCounter


def ownership_for(toy_design, toy_graph, target: str, substitute: bool = True):
    counter = ApproxTokenCounter()
    result = compile_context(toy_design, target, counter, sds_root=TOY_SDS, substitute=substitute)
    return result, analyze_ownership(toy_design, toy_graph, target, result.bundle.rendered, counter)


def test_costs_add_up_to_the_emitted_sections(toy_design, toy_graph) -> None:
    result, ownership = ownership_for(toy_design, toy_graph, "5:0")
    counter = ApproxTokenCounter()

    tree_cost = sum(counter.count("  " * d + line) for _, d, line in result.bundle.rendered.lines)
    assert sum(ownership.cost[n.node_id] for n, _, _ in result.bundle.rendered.lines) == tree_cost
    # The root retains everything that was emitted (header excluded: it is not a graph vertex).
    assert ownership.retained[VIRTUAL_ROOT] == sum(ownership.cost.values())


def test_a_variable_used_by_one_subtree_is_private_to_it(toy_design, toy_graph) -> None:
    # With substitution off, "Pay button" (5:1) is the only emitted node binding the brand color.
    _, ownership = ownership_for(toy_design, toy_graph, "5:0", substitute=False)

    assert ownership.idom["VariableID:1:10"] == "5:1"
    assert not ownership.is_shared("VariableID:1:10")
    assert "VariableID:1:10" in ownership.dominated["5:1"]
    # ... so dropping the button would free the token line too: retained = own + dominated.
    assert ownership.retained["5:1"] == ownership.cost["5:1"] + sum(
        ownership.cost.get(v, 0) for v in ownership.dominated["5:1"]
    )
    assert ownership.retained["5:1"] > ownership.cost["5:1"]


def test_definitions_reached_from_the_root_are_shared(toy_design, toy_graph) -> None:
    _, ownership = ownership_for(toy_design, toy_graph, "5:0")

    # The Button mapping is reached only through 5:1 (5:1 -> 1:2 -> 1:1 -> mapping), so its
    # *immediate* dominator is the set 1:1, and 5:1 dominates it transitively: private, not shared.
    assert ownership.idom["code:Button@1:1"] == "1:1"
    assert "code:Button@1:1" in ownership.dominated["5:1"]
    assert not ownership.is_shared("code:Button@1:1")
    # ...while the target frame itself hangs off the virtual root.
    assert ownership.idom["5:0"] == VIRTUAL_ROOT
    assert ownership.is_shared("5:0")


def test_top_owners_ranks_by_retained_tokens(toy_design, toy_graph) -> None:
    result, ownership = ownership_for(toy_design, toy_graph, "5:0")
    rendered = result.bundle.rendered

    rows = top_owners(
        ownership,
        rendered,
        rendered.variable_lines.__contains__,
        rendered.component_entries.__contains__,
    )

    assert rows[0].node_id == "5:0"  # the root frame retains the whole tree
    assert rows[0].retained >= max(row.retained for row in rows)
    button = next(row for row in rows if row.node_id == "5:1")
    assert button.private_components == 1  # the Button mapping is priced into the button


def test_definition_split_counts_and_tokens(toy_design, toy_graph) -> None:
    result, ownership = ownership_for(toy_design, toy_graph, "5:0")
    keys = list(result.bundle.rendered.component_entries)

    shared_n, shared_t, private_n, private_t = definition_split(ownership, keys)

    assert shared_n + private_n == len(keys)
    assert shared_t + private_t == sum(ownership.cost[k] for k in keys)
