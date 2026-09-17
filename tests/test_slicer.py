import networkx as nx
from hypothesis import given
from hypothesis import strategies as st

from contextslice.graph import DEPENDENCY_EDGES, EdgeKind
from contextslice.slicer import dependency_slice, slice_roots, summarize

CHECKOUT_SLICE = {
    # the target's own visible subtree
    "5:0",
    "5:1",
    "I5:1;1:3",
    "5:2",
    "5:3",
    # the component it instantiates, that component's content, and its set (for the mapping)
    "1:2",
    "1:3",
    "1:1",
    "code:Button@1:1",
    # components we cannot see into are still part of the closure, as stubs
    "component:9:9",
    "code:IconStar@9:9",
    "component:404:404",
    # variables: bound directly, plus the primitive reached through an alias
    "VariableID:1:10",
    "VariableID:1:11",
    "VariableID:1:20",
}


def test_slice_is_exactly_what_the_target_depends_on(toy_design, toy_graph) -> None:
    members = dependency_slice(toy_graph, slice_roots(toy_design, "5:0"))

    assert members == CHECKOUT_SLICE


def test_sibling_variants_do_not_leak_into_the_slice(toy_design, toy_graph) -> None:
    members = dependency_slice(toy_graph, slice_roots(toy_design, "5:0"))

    assert "1:1" in members  # the Button set is needed (it carries the code mapping) ...
    assert not {"1:5", "1:6", "VariableID:1:30"} & members  # ... but Variant=Secondary is not


def test_hidden_nodes_and_what_only_they_reference_are_skipped(toy_design, toy_graph) -> None:
    visible_only = dependency_slice(toy_graph, slice_roots(toy_design, "5:0"))
    everything = dependency_slice(toy_graph, slice_roots(toy_design, "5:0"), include_hidden=True)

    assert everything - visible_only == {"5:4", "VariableID:1:99"}


def test_targeting_a_component_set_means_targeting_all_its_variants(toy_design, toy_graph) -> None:
    members = dependency_slice(toy_graph, slice_roots(toy_design, "1:1"))

    assert {"1:2", "1:5", "VariableID:1:30"} <= members


def test_summary_counts(toy_design, toy_graph) -> None:
    members = dependency_slice(toy_graph, slice_roots(toy_design, "5:0"))
    summary = summarize(toy_design, toy_graph, "5:0", members)

    assert summary.design_nodes == 8
    assert summary.inlined_nodes == 1
    assert (summary.components, summary.component_sets, summary.missing_components) == (1, 1, 2)
    assert (summary.variables, summary.variables_via_alias_only) == (3, 1)
    assert summary.unresolved_variables == 0
    assert (summary.instances, summary.instances_with_mapping) == (3, 2)
    assert summary.mappings == 2
    assert 0 < summary.normalized_chars < summary.raw_chars


# --- property-based test -----------------------------------------------------------------------
# Instead of hand-picking examples, describe *any* small typed graph and let hypothesis hunt for
# one where the fast BFS disagrees with an obviously-correct (but slow) reference implementation.

KINDS = [EdgeKind.CONTAINS, EdgeKind.BINDS_VAR, EdgeKind.HAS_VARIANT, EdgeKind.CORRESPONDS_TO]
edges = st.lists(
    st.tuples(st.integers(0, 9), st.integers(0, 9), st.sampled_from(KINDS)), max_size=40
)


def naive_closure(edge_list, roots, kinds) -> set[str]:
    """Reference implementation: keep adding successors until nothing changes (fixed point)."""
    reached = set(roots)
    changed = True
    while changed:
        changed = False
        for source, target, kind in edge_list:
            if source in reached and kind in kinds and target not in reached:
                reached.add(target)
                changed = True
    return reached


@given(edge_list=edges, roots=st.sets(st.integers(0, 9), max_size=3))
def test_slice_matches_the_reference_closure_on_random_graphs(edge_list, roots) -> None:
    edge_list = [(str(s), str(t), k) for s, t, k in edge_list]
    roots = {str(r) for r in roots}
    graph = nx.MultiDiGraph()
    graph.add_nodes_from(str(i) for i in range(10))
    for source, target, kind in edge_list:
        graph.add_edge(source, target, kind=kind)

    members = dependency_slice(graph, roots)

    assert members == naive_closure(edge_list, roots, DEPENDENCY_EDGES)
    assert dependency_slice(graph, members) == members  # slicing a slice changes nothing
