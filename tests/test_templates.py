from conftest import TOY_SDS
from contextslice.ir import CodeMapping
from contextslice.templates import load_template


def test_template_is_split_into_imports_example_and_logic() -> None:
    mapping = CodeMapping("1:1", "Button", "", "src/figma/primitives/Button.figma.ts")

    template = load_template(TOY_SDS, mapping)

    assert template.imports == ('import { Button } from "primitives";',)
    assert template.example == "<Button>${label}</Button>"
    assert template.logic == 'const label = instance.getString("Label");'  # boilerplate removed


def test_batch_templates_are_specialised_per_component() -> None:
    mapping = CodeMapping("9:9", "IconStar", "", "src/figma/icons/Icons.figma.batch.ts")

    template = load_template(TOY_SDS, mapping)

    assert template.imports == ('import { IconStar } from "icons";',)
    assert template.example == '<IconStar size="24" />'


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
