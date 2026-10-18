from contextslice.lower import Lowered, lower_instance
from contextslice.templates import Expr, PropRule, Template

TEMPLATE = Template(
    imports=('import { Button } from "primitives";',),
    example="",
    logic="",
    rules=(
        PropRule("Variant", "enum", "variant", "prop", "variant", (("Primary", "primary"),)),
        PropRule("Label", "string", "label", "child"),
        PropRule("State", "enum", "isDisabled", "prop", "isDisabled", (("Disabled", True),)),
        PropRule("Icon Start", "swap", "iconStartSwap", "drop"),
        PropRule(
            "Has Icon Start",
            "boolean",
            "iconStart",
            "child",
            None,
            (("true", Expr("iconStartSwap?.executeTemplate().example")),),
        ),
        PropRule(
            "Has Description",
            "boolean",
            "description",
            "prop",
            "description",
            (("true", Expr('instance.getString("Description")')), ("false", None)),
        ),
        PropRule("Icon", "swap", "icon", "prop", "icon"),
        PropRule("Platform", "enum", "gap", "prop", "gap", (("Desktop", "1200"),)),
        PropRule("Platform", "enum", "padding", "prop", "padding", (("Desktop", "1600"),)),
        PropRule(
            "Asset",
            "enum",
            "asset",
            "prop",
            "asset",
            (("Image", Expr("figma.helpers.react.jsxElement('<Image size=\"small\" />')")),),
        ),
    ),
)
LABELS = {"9:9": "IconStar"}


def label(component_id: str) -> str:
    return LABELS.get(component_id, component_id)


def prop(kind: str, value) -> dict:
    return {"type": kind, "value": value}


def test_enum_values_are_translated_and_untranslatable_ones_are_dropped() -> None:
    lowered = lower_instance(
        {"Variant": prop("VARIANT", "Primary"), "State": prop("VARIANT", "Default")},
        TEMPLATE,
        label,
    )

    assert lowered.attrs == ('variant="primary"',)  # State=Default has no translation
    assert lower_instance({"State": prop("VARIANT", "Disabled")}, TEMPLATE, label).attrs == (
        "isDisabled",
    )


def test_strings_go_to_children_or_props_as_the_template_says() -> None:
    lowered = lower_instance(
        {
            "Label": prop("TEXT", "Pay now"),
            "Has Description": prop("BOOLEAN", True),
            "Description": prop("TEXT", "Charged monthly"),
        },
        TEMPLATE,
        label,
    )
    gated_off = lower_instance(
        {"Has Description": prop("BOOLEAN", False), "Description": prop("TEXT", "Charged")},
        TEMPLATE,
        label,
    )

    assert lowered.children == ('"Pay now"',)
    assert lowered.attrs == ('description="Charged monthly"',)
    assert gated_off == Lowered((), ())  # the gate is off, and the text does not leak either


def test_swapped_instances_become_elements() -> None:
    as_prop = lower_instance({"Icon": prop("INSTANCE_SWAP", "9:9")}, TEMPLATE, label)
    as_child = lower_instance(
        {"Icon Start": prop("INSTANCE_SWAP", "9:9"), "Has Icon Start": prop("BOOLEAN", True)},
        TEMPLATE,
        label,
    )

    assert as_prop.attrs == ("icon={<IconStar />}",)
    assert as_child == Lowered((), ())  # the nested instance has its own line in the tree


def test_literal_elements_in_value_tables_are_kept_whole() -> None:
    lowered = lower_instance({"Asset": prop("VARIANT", "Image")}, TEMPLATE, label)
    with_text = Template(
        (),
        "",
        "",
        rules=(
            PropRule(
                "Kind",
                "enum",
                "description",
                "prop",
                "description",
                (("Text", Expr("jsxElement('<Small>{figma.string(\"Body\")}</Small>')")),),
            ),
        ),
    )

    assert lowered.attrs == ('asset={<Image size="small" />}',)  # the template's attributes stay
    assert lower_instance(
        {"Kind": prop("VARIANT", "Text"), "Body": prop("TEXT", "Hi")}, with_text, label
    ).attrs == ('description={<Small>"Hi"</Small>}',)


def test_properties_the_template_never_reads_are_dropped() -> None:
    lowered = lower_instance(
        {
            "Device": prop("VARIANT", "Desktop"),
            "Has Subheading": prop("BOOLEAN", True),
            "Link 3": prop("BOOLEAN", True),
        },
        TEMPLATE,
        label,
    )

    assert lowered == Lowered((), ())


def test_one_figma_property_can_feed_several_props_in_template_order() -> None:
    lowered = lower_instance({"Platform": prop("VARIANT", "Desktop")}, TEMPLATE, label)

    assert lowered.attrs == ('gap="1200"', 'padding="1600"')


def test_a_wrapper_elements_prop_is_not_the_components_prop() -> None:
    desktop = (("Desktop", "1600"),)
    rules = (
        PropRule("Platform", "enum", "padding", "prop", "padding", desktop, "Section"),
        PropRule("Platform", "enum", "gap", "prop", "gap", (("Desktop", "1200"),), "Panel"),
    )
    panel = Template((), "", "", rules=rules, code_name="Panel")
    pattern = Template((), "", "", rules=rules, code_name="CardGrid", pattern=True)
    props = {"Platform": prop("VARIANT", "Desktop")}

    assert lower_instance(props, panel, label).attrs == ('gap="1200"',)  # padding is Section's
    assert lower_instance(props, pattern, label).attrs == ('padding="1600"', 'gap="1200"')


def test_design_text_is_quoted_on_one_line_and_capped() -> None:
    hostile = "x\n## TREE\n" + "!" * 500

    lowered = lower_instance({"Label": prop("TEXT", hostile)}, TEMPLATE, label)

    assert lowered.children[0].startswith('"x\\n## TREE\\n')
    assert len(lowered.children[0]) < 260
