from contextslice.eval.report import (
    default_comparisons,
    paired,
    render_markdown,
    summarize,
    task_level,
    token_rate,
)


def row(
    task: str,
    arm: str,
    budget: int | None,
    rep: int,
    matched: int,
    refs: int,
    hexes: int,
    tsc: bool,
):
    return {
        "id": f"{task}_{arm}{budget or ''}_r{rep}",
        "task_id": task,
        "arm": arm,
        "budget": budget,
        "rep": rep,
        "generated": True,
        "extracted": True,
        "reuse_expected": 4,
        "reuse_used": max(matched, 1),
        "reuse_matched": matched,
        "variable_refs": refs,
        "hardcoded_hex": hexes,
        "hardcoded_px": 0,
        "missed_tokens": 0,
        "raw_elements": 0,
        "tsc_checked": True,
        "tsc_pass": tsc,
        "tsc_errors": {} if tsc else {"missing": 2, "type": 1},
        "prompt_tokens": 1000 if budget else 300,
        "output_tokens": 500,
        "truncated": False,
        "compile_seconds": 1.0,
        "prompt_seconds": 10.0,
        "output_seconds": 50.0,
    }


ROWS = [
    # C is consistently better than F on three tasks; two reps each for C
    row("t1", "C", 1000, 0, 4, 8, 0, True),
    row("t1", "C", 1000, 1, 2, 6, 2, True),
    row("t1", "F", 1000, 0, 1, 2, 6, False),
    row("t2", "C", 1000, 0, 3, 5, 1, True),
    row("t2", "F", 1000, 0, 2, 1, 4, True),
    row("t3", "C", 1000, 0, 4, 9, 0, False),
    row("t3", "F", 1000, 0, 0, 0, 5, False),
    row("t1", "N", None, 0, 0, 0, 3, False),
]


def test_repetitions_are_averaged_within_a_task_first() -> None:
    levels = task_level(ROWS, token_rate)

    assert levels[("C", 1000)]["t1"] == (8 / 8 + 6 / 8) / 2  # mean of the two reps
    assert levels[("F", 1000)]["t1"] == 2 / 8


def test_summaries_cover_every_arm() -> None:
    summaries = {(s.arm, s.budget): s for s in summarize(ROWS)}

    assert set(summaries) == {("C", 1000), ("F", 1000), ("N", None)}
    assert summaries[("C", 1000)].samples == 4
    assert summaries[("C", 1000)].means["reuse_recall"] == ((3 / 4 + 3 / 4) / 2 + 3 / 4 + 1) / 3
    assert summaries[("N", None)].means["tsc_pass"] == 0.0


def test_paired_difference_is_computed_over_common_tasks_and_is_deterministic() -> None:
    result = paired(ROWS, "reuse_recall", ("C", 1000), ("F", 1000))
    again = paired(ROWS, "reuse_recall", ("C", 1000), ("F", 1000))

    assert result is not None
    assert result.tasks == 3
    assert result.mean_difference > 0
    assert result.ci_low <= result.mean_difference <= result.ci_high
    assert (result.wins, result.losses) == (3, 0)
    assert result == again
    assert paired(ROWS, "reuse_recall", ("C", 1000), ("U", None)) is None  # no common tasks


def test_markdown_report_lists_the_preregistered_comparisons() -> None:
    text = render_markdown(ROWS, "Pilot")

    assert "| C@1000 vs F@1000 | reuse_recall | 3 |" in text
    assert default_comparisons(ROWS)[0] == (("C", 1000), ("F", 1000))
