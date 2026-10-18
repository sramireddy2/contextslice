from conftest import TOY_SDS
from contextslice.ir import CodeMapping
from contextslice.templates import Expr, consolidate_imports, import_names, load_template

BUTTON = CodeMapping("1:1", "Button", "", "src/figma/primitives/Button.figma.ts")


def test_template_is_split_into_imports_example_and_logic() -> None:
    template = load_template(TOY_SDS, BUTTON)

    assert template.imports == ('import { Button } from "primitives";',)
    assert template.example == (
        '<Button ${rp("variant", variant)} ${rp("isDisabled", isDisabled)} icon={${icon}}>'
        "${label}</Button>"
    )
    assert template.logic.startswith("const rp = figma.helpers.react.renderProp;")  # no boilerplate
    assert 'getString("Label")' in template.logic
    assert template.exports == {"Button"}
    assert template.code_name == "Button" and not template.pattern


def test_prop_rules_say_where_each_figma_property_ends_up() -> None:
    rules = {rule.figma_prop: rule for rule in load_template(TOY_SDS, BUTTON).rules}

    assert (rules["Variant"].kind, rules["Variant"].role, rules["Variant"].target) == (
        "enum",
        "prop",
        "variant",
    )
    assert dict(rules["Variant"].values) == {"Primary": "primary", "Secondary": "secondary"}
    assert (rules["Label"].kind, rules["Label"].role, rules["Label"].target) == (
        "string",
        "child",
        None,
    )
    assert (rules["Icon"].kind, rules["Icon"].target) == ("swap", "icon")
    assert dict(rules["State"].values) == {"Disabled": True}


def test_batch_templates_are_specialised_per_component() -> None:
    mapping = CodeMapping("9:9", "IconStar", "", "src/figma/icons/Icons.figma.batch.ts")

    template = load_template(TOY_SDS, mapping)

    assert template.imports == ('import { IconStar } from "icons";',)
    assert template.example == '<IconStar size="24" />'
    assert template.exports == {"IconStar"} and not template.pattern


def test_value_tables_and_expressions_are_read_without_executing_anything(tmp_path) -> None:
    path = tmp_path / "Field.figma.ts"
    path.write_text(
        "// url=<X>\n"
        "import figma from 'figma';\n"
        "const instance = figma.selectedInstance;\n"
        "const rp = figma.helpers.react.renderProp;\n"
        'const description = instance.getBoolean("Has Description", {\n'
        '  true: instance.getString("Description"),\n'
        "  false: undefined,\n"
        "});\n"
        'const iconSwap = instance.getInstanceSwap("Icon");\n'
        'const icon = instance.getBoolean("Has Icon", {\n'
        "  true: iconSwap?.executeTemplate().example,\n"
        "});\n"
        'const align = instance.getEnum("Align", { Center: "center", "2": "two" })\n'
        'const title = instance.getString("Title")\n'
        "export default {\n"
        "  imports: ['import { Field } from \"primitives\";'],\n"
        '  example: figma.code`<Field ${rp("description", description)}\n'
        '      ${align ? figma.code`align="${align}"` : ""}>\n'
        "      <Heading>${figma.helpers.react.renderChildren(title)}</Heading>${icon}</Field>`,\n"
        "};\n",
        encoding="utf-8",
    )

    template = load_template(tmp_path, CodeMapping("1", "Field", "", path.name))
    rules = {rule.figma_prop: rule for rule in template.rules}

    assert dict(rules["Has Description"].values) == {
        "true": Expr('instance.getString("Description")'),
        "false": None,
    }
    assert rules["Has Description"].role == "prop"
    assert rules["Has Description"].target == "description"
    assert rules["Icon"].role == "drop"  # only feeds another value
    assert rules["Has Icon"].role == "child"
    assert (rules["Align"].role, rules["Align"].target) == ("prop", "align")  # via the conditional
    assert dict(rules["Align"].values) == {"Center": "center", "2": "two"}
    assert rules["Title"].role == "child"  # renderChildren(title)


def test_a_prop_remembers_which_element_it_is_written_on(tmp_path) -> None:
    (tmp_path / "Panel.figma.ts").write_text(
        "// component=Panel\n"
        'const padding = figma.selectedInstance.getEnum("Platform", { Desktop: "1600" });\n'
        'const gap = figma.selectedInstance.getEnum("Platform", { Desktop: "1200" });\n'
        "export default { imports: ['import { Panel } from \"compositions\";'],"
        ' example: figma.code`<Section padding="${padding}"><Panel gap="${gap}" /></Section>` };\n',
        encoding="utf-8",
    )

    template = load_template(tmp_path, CodeMapping("1", "Panel", "", "Panel.figma.ts"))

    assert [(r.target, r.element) for r in template.rules] == [
        ("padding", "Section"),
        ("gap", "Panel"),
    ]
    batch = load_template(
        TOY_SDS, CodeMapping("9:9", "IconStar", "", "src/figma/icons/Icons.figma.batch.ts")
    )
    assert all(rule.element is None for rule in batch.rules)  # `<${component}` is the component


def test_a_name_that_is_not_exported_is_a_rename_or_a_pattern(tmp_path) -> None:
    (tmp_path / "Danger.figma.ts").write_text(
        "// component=Button\nexport default { imports: ['import { ButtonDanger } from \"p\";'],"
        " example: figma.code`<ButtonDanger />` };\n",
        encoding="utf-8",
    )
    (tmp_path / "Grid.figma.ts").write_text(
        "// component=CardGrid\nexport default {"
        " imports: ['import { Flex, Section } from \"layout\";'],"
        " example: figma.code`<Section><Flex /></Section>` };\n",
        encoding="utf-8",
    )

    renamed = load_template(tmp_path, CodeMapping("1", "Button", "", "Danger.figma.ts"))
    pattern = load_template(tmp_path, CodeMapping("2", "CardGrid", "", "Grid.figma.ts"))

    assert (renamed.code_name, renamed.pattern) == ("ButtonDanger", False)
    assert (pattern.code_name, pattern.pattern) == ("CardGrid", True)


def test_imports_are_consolidated_per_module_deterministically() -> None:
    statements = [
        'import { Button } from "primitives";',
        'import { Footer } from "compositions";',
        'import { Accordion } from "primitives";',
        'import { Button } from "primitives";',
        'import React from "react";',
    ]

    assert consolidate_imports(statements) == (
        'import { Footer } from "compositions";',
        'import { Accordion, Button } from "primitives";',
        'import React from "react";',
    )
    assert import_names(statements) == {"Accordion", "Button", "Footer", "React"}
    assert import_names(['import { Text as T } from "x";']) == {"T"}


def test_conditional_imports_are_all_kept(tmp_path) -> None:
    (tmp_path / "Field.figma.ts").write_text(
        "// component=InputField\n"
        'import figma from "figma";\n'
        'const hasLabel = figma.selectedInstance.getBoolean("Has Label");\n'
        "const imports = hasLabel\n"
        "  ? ['import { InputField } from \"primitives\";']\n"
        "  : ['import { Input } from \"primitives\";'];\n"
        "export default { imports, example: figma.code`<InputField />` };\n",
        encoding="utf-8",
    )

    template = load_template(tmp_path, CodeMapping("1", "InputField", "", "Field.figma.ts"))

    assert template.imports == (
        'import { InputField } from "primitives";',
        'import { Input } from "primitives";',
    )
    assert template.exports == {"InputField", "Input"} and not template.pattern


def test_example_with_nested_template_literals_is_extracted_whole(tmp_path) -> None:
    # A regex cannot match nested delimiters; first-to-last backtick can (see templates._example).
    path = tmp_path / "Nested.figma.ts"
    path.write_text(
        "// url=<X>\n"
        'const icon = instance.getInstanceSwap("Icon")\n'
        "export default {\n"
        "  imports: ['import { Card } from \"compositions\";'],\n"
        "  example: figma.code`<Card\n"
        '      ${icon ? figma.code`icon={${icon}}` : ""}\n'
        "    />`,\n"
        "  metadata: { nestable: true },\n"
        "};\n",
        encoding="utf-8",
    )

    template = load_template(tmp_path, CodeMapping("1:1", "Card", "", "Nested.figma.ts"))

    assert template.example == '<Card ${icon ? figma.code`icon={${icon}}` : ""} />'
