from contextslice.ir import Binding, NodeKind


def test_every_raw_node_becomes_an_ir_node_with_tree_links(toy_design) -> None:
    assert len(toy_design.nodes) == 15
    checkout = toy_design.nodes["5:0"]
    assert checkout.kind is NodeKind.FRAME
    assert checkout.parent_id == "2:1"
    assert checkout.child_ids == ("5:1", "5:2", "5:3", "5:4")
    assert toy_design.nodes["0:1"].kind is NodeKind.PAGE  # Figma calls pages CANVAS
    assert toy_design.path_of("1:2") == "Components / Button / Variant=Primary"


def test_inlined_instance_copies_point_back_at_their_source(toy_design) -> None:
    copy = toy_design.nodes["I5:1;1:3"]

    assert copy.inlined is True
    assert copy.source_id == "1:3"
    assert toy_design.nodes["1:3"].inlined is False
    assert toy_design.nodes["5:1"].component_id == "1:2"


def test_bindings_are_deduplicated_and_variable_ids_normalised(toy_design) -> None:
    # Raw JSON lists this binding twice (node level + inside the paint), with a library prefix.
    assert toy_design.nodes["5:1"].bindings == (Binding("fills", "VariableID:1:10"),)
    assert toy_design.nodes["1:2"].bindings == (
        Binding("itemSpacing", "VariableID:1:20"),
        Binding("fills", "VariableID:1:10"),
    )


def test_hidden_nodes_are_kept_but_flagged(toy_design) -> None:
    assert toy_design.nodes["5:4"].visible is False


def test_props_are_normalised(toy_design) -> None:
    primary = toy_design.nodes["1:2"].props
    assert primary["layoutMode"] == "HORIZONTAL"
    assert primary["itemSpacing"] == 8
    assert primary["fills"] == [{"type": "SOLID", "color": "#2c2c2c"}]

    pay = toy_design.nodes["5:1"]
    assert pay.props["componentProperties"]["Label"] == {"type": "TEXT", "value": "Pay now"}
    assert pay.raw_chars > 0


def test_variables_resolve_alias_chains_per_mode(toy_design) -> None:
    brand = toy_design.variables["VariableID:1:10"]

    assert brand.path == "@color/background/brand"
    assert brand.modes == {
        # Real SDS data spells the reference "Brand.500" but the token path "brand/500":
        # resolution must be case-insensitive (this was a real bug the first fixture missed).
        "light": {"alias": "VariableID:1:11"},
        "dark": "#ffffff",
        # A reference to a token that was never exported stays as text instead of crashing.
        "brand_b": "{@color_primitives.Brand B.500}",
    }
    assert brand.alias_targets == ("VariableID:1:11",)
    assert toy_design.variables["VariableID:1:11"].alias_targets == ()


def test_unknown_bound_variables_become_unresolved_placeholders(toy_design) -> None:
    unresolved = {v.id for v in toy_design.variables.values() if not v.resolved}

    assert unresolved == {"VariableID:1:30", "VariableID:1:99"}


def test_code_mappings_are_read_from_both_code_connect_formats(toy_design) -> None:
    by_name = {mapping.component_name: mapping for mapping in toy_design.mappings}

    assert by_name["Button"].node_id == "1:1"
    assert by_name["Button"].template_path == "src/figma/primitives/Button.figma.ts"
    assert by_name["IconStar"].node_id == "9:9"  # from the batch JSON
