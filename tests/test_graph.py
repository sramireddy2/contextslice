from contextslice.graph import EdgeKind


def edge_kinds(graph, source: str, target: str) -> set[str]:
    return {data["kind"] for data in (graph.get_edge_data(source, target) or {}).values()}


def test_containment_and_component_references(toy_graph) -> None:
    assert edge_kinds(toy_graph, "5:0", "5:1") == {EdgeKind.CONTAINS}
    assert edge_kinds(toy_graph, "5:1", "1:2") == {EdgeKind.INSTANCE_OF}
    assert edge_kinds(toy_graph, "1:2", "1:1") == {EdgeKind.VARIANT_OF}
    assert edge_kinds(toy_graph, "I5:1;1:3", "1:3") == {EdgeKind.CORRESPONDS_TO}


def test_a_component_set_does_not_contain_its_variants(toy_graph) -> None:
    # The edge exists, but as HAS_VARIANT: a non-dependency kind (see graph.DEPENDENCY_EDGES).
    assert edge_kinds(toy_graph, "1:1", "1:2") == {EdgeKind.HAS_VARIANT}
    assert edge_kinds(toy_graph, "1:1", "1:5") == {EdgeKind.HAS_VARIANT}


def test_variable_edges_carry_the_bound_field(toy_graph) -> None:
    bindings = toy_graph.get_edge_data("1:2", "VariableID:1:20")

    assert [(d["kind"], d["field"]) for d in bindings.values()] == [
        (EdgeKind.BINDS_VAR, "itemSpacing")
    ]
    assert edge_kinds(toy_graph, "VariableID:1:10", "VariableID:1:11") == {EdgeKind.ALIASES}


def test_unknown_components_become_stub_vertices_so_no_edge_dangles(toy_graph) -> None:
    assert toy_graph.nodes["component:9:9"]["kind"] == "missing_component"
    assert edge_kinds(toy_graph, "5:3", "component:404:404") == {EdgeKind.INSTANCE_OF}


def test_code_mappings_attach_to_sets_and_to_remote_component_stubs(toy_graph) -> None:
    assert edge_kinds(toy_graph, "1:1", "code:Button@1:1") == {EdgeKind.MAPS_TO_CODE}
    assert edge_kinds(toy_graph, "component:9:9", "code:IconStar@9:9") == {EdgeKind.MAPS_TO_CODE}
