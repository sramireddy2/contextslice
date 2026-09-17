from contextslice.figma_json import variable_alias_ids
from contextslice.stats import take_census


def test_census_counts_nodes_and_types(toy_document) -> None:
    census = take_census(toy_document)

    assert census.total_nodes == 15
    assert census.by_type["INSTANCE"] == 3
    assert census.by_type["TEXT"] == 3
    assert census.by_type["CANVAS"] == 2
    assert census.max_depth == 5  # DOCUMENT > CANVAS > SECTION > FRAME > INSTANCE > TEXT
    assert census.hidden_nodes == 1


def test_census_classifies_component_references(toy_document) -> None:
    census = take_census(toy_document)

    assert census.components == 3
    assert census.component_sets == 1
    assert census.remote_components == 1
    assert census.instances == 3
    assert census.unresolved_instances == 1  # componentId "404:404" is not in the components map
    assert census.instance_sublayers == 1  # "I5:1;1:3"


def test_census_finds_variable_bindings_nested_inside_paints(toy_document) -> None:
    census = take_census(toy_document)

    # Raw occurrences: Figma reports 5:1's fill binding twice (node level + inside the paint).
    assert census.variable_bindings == 6
    assert census.bound_variable_ids == {
        "VariableID:1:10",
        "VariableID:1:20",
        "VariableID:1:30",
        "VariableID:1:99",
        "VariableID:abc123/1:10",
    }


def test_frames_look_through_sections(toy_document) -> None:
    census = take_census(toy_document)

    frames = {frame.name: frame for frame in census.frames}
    assert set(frames) == {"Button", "Checkout"}  # the SECTION itself is not a frame
    assert frames["Checkout"].page == "Examples"
    assert frames["Checkout"].node_count == 6
    assert frames["Checkout"].instance_count == 3
    assert frames["Checkout"].approx_tokens > 0


def test_bytes_by_property_excludes_children_and_ranks_heavy_properties(toy_document) -> None:
    census = take_census(toy_document)

    assert "children" not in census.bytes_by_property
    assert census.bytes_by_property["fills"] > census.bytes_by_property["visible"]


def test_variable_alias_walker_does_not_descend_into_an_alias() -> None:
    value = {"a": [{"type": "VARIABLE_ALIAS", "id": "V1"}], "b": {"c": {"type": "OTHER"}}}

    assert list(variable_alias_ids(value)) == ["V1"]
