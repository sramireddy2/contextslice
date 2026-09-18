from conftest import TOY_SDS
from contextslice.compile import compile_context
from contextslice.tokens import ApproxTokenCounter


def test_ledger_has_one_row_per_stage_and_ends_at_the_bundle_size(toy_design, toy_document) -> None:
    counter = ApproxTokenCounter()

    result = compile_context(
        toy_design, "5:0", counter, sds_root=TOY_SDS, raw_document=toy_document
    )

    assert [row.stage for row in result.ledger] == [
        "raw Figma JSON",
        "P0 normalized JSON",
        "outline format",
        "P4 Code Connect substitution",
        "P5 structural dedupe (0 repeats folded)",
    ]
    assert result.tokens == counter.count(result.bundle.text)
    assert result.ledger[0].nodes == 6  # raw subtree, hidden node included
    assert result.ledger[2].nodes == 5  # the hidden node is gone
    assert result.ledger[3].nodes == 4  # root + <Button> + <IconStar> + the unmapped instance
    assert result.ledger[4].nodes == 4  # nothing repeats in the toy file
    assert set(result.section_tokens) == {"header", "COMPONENTS", "TOKENS", "TREE"}


def test_disabling_substitution_is_just_a_shorter_ledger(toy_design) -> None:
    result = compile_context(
        toy_design, "5:0", ApproxTokenCounter(), sds_root=TOY_SDS, substitute=False
    )

    assert [row.stage for row in result.ledger][:2] == ["P0 normalized JSON", "outline format"]
    assert "<Button" not in result.bundle.tree
