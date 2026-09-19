from contextslice.eval.metrics import (
    CompileResultSummary,
    component_reuse,
    extract_tsx,
    import_usage,
    parse_tsc_output,
    token_adherence,
)

CODE = """import { Button, Card } from "primitives";
import { Header } from "compositions";
import { useState } from "react";
import axios from "axios";

export default function Screen() {
  const [n] = useState(0);
  return (
    <div style={{ gap: "var(--sds-size-space-400)", color: "#1e1e1e", padding: "16px" }}>
      <Header />
      <Card><Button>Go</Button></Card>
      <button className="raw">Not a design-system button</button>
    </div>
  );
}
"""


def test_extract_prefers_the_first_fenced_block() -> None:
    reply = "Sure!\n```tsx\nexport default function Screen() { return null }\n```\nNotes..."

    assert extract_tsx(reply) == "export default function Screen() { return null }\n"
    assert extract_tsx("no code here") is None
    assert extract_tsx("export default function Screen() {}") is not None


def test_import_usage_separates_design_system_imports_from_the_rest() -> None:
    usage = import_usage(CODE)

    assert usage.imported["primitives"] == ("Button", "Card")
    assert usage.imported["compositions"] == ("Header",)
    assert usage.disallowed_modules == ("axios",)
    assert {"Button", "Card", "Header"} <= usage.used_tags
    assert usage.raw_elements == 1  # the plain <button>


def test_component_reuse_counts_imported_and_used_components_against_expectations() -> None:
    reuse = component_reuse(import_usage(CODE), expected={"Button", "Card", "Footer"})

    assert (reuse.expected, reuse.used, reuse.matched) == (3, 3, 2)
    assert reuse.recall == 2 / 3
    assert reuse.precision == 2 / 3


def test_token_adherence_counts_variables_hardcodes_and_missed_tokens() -> None:
    adherence = token_adherence(CODE, {"color-text-default-default": "#1e1e1e"})

    assert adherence.variable_refs == 1
    assert adherence.hardcoded_hex == 1
    assert adherence.hardcoded_px == 1
    assert adherence.missed_tokens == 1  # #1e1e1e had a token and was hardcoded anyway
    assert adherence.rate == 1 / 3


def test_tsc_output_is_parsed_and_classified() -> None:
    output = (
        "src/generated/about_C1000_r0.tsx(2,10): error TS2305: "
        "Module '\"primitives\"' has no exported member 'Foo'.\n"
        "src\\generated\\about_C1000_r0.tsx(7,9): error TS6133: "
        "'n' is declared but its value is never read.\n"
        "src/generated/home_N_r0.tsx(12,7): error TS2322: "
        "Type 'string' is not assignable to type 'number'.\n"
        "not an error line\n"
    )

    errors = parse_tsc_output(output)

    assert [e.file for e in errors] == ["src/generated/about_C1000_r0.tsx"] * 2 + [
        "src/generated/home_N_r0.tsx"
    ]
    assert [e.kind for e in errors] == ["missing", "unused", "type"]
    only_unused = CompileResultSummary(errors=[errors[1]])
    assert only_unused.passes is True
    assert CompileResultSummary(errors=errors[:2]).passes is False
