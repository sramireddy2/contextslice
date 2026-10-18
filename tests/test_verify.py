from contextslice.emit import Bundle, Rendered
from contextslice.tokens import ApproxTokenCounter
from contextslice.verify import verify

EMPTY = Rendered(lines=(), variable_lines={}, component_entries={})


def bundle(tree: str, tokens: str = "", components: str = "", imports: str = "") -> Bundle:
    return Bundle(
        header="# h",
        imports=imports,
        components=components,
        tokens=tokens,
        tree=tree,
        rendered=EMPTY,
    )


def test_clean_bundle_passes() -> None:
    result = verify(
        bundle(
            '## TREE\nFrame "A" fill=$color-x\n  <Button variant="primary"> "Go"\n  Pattern Grid',
            tokens="## TOKENS\ncolor-x: #fff",
            imports='## IMPORTS\nimport { Button } from "p";',
            components="## COMPONENTS\nGrid (layout pattern, not an import): <Section />",
        ),
        ApproxTokenCounter(),
        budget=1000,
    )

    assert result.ok
    assert result.tokens > 0


def test_dangling_token_and_component_are_reported() -> None:
    result = verify(
        bundle('## TREE\nFrame "A" fill=$color-missing\n  <Ghost>'), ApproxTokenCounter()
    )

    assert result.problems == (
        "dangling token reference $color-missing",
        "dangling component reference <Ghost>",
    )


def test_budget_overrun_is_reported() -> None:
    result = verify(bundle("## TREE\n" + "x" * 400), ApproxTokenCounter(), budget=10)

    assert not result.ok
    assert "over the budget" in result.problems[0]
