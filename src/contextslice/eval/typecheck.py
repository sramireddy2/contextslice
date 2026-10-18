"""Batch type-check of generated files against the real SDS project.

Generated files are written under ``vendor/sds/src/generated/`` so the project's own
``tsconfig`` (path aliases such as ``"primitives"``, strict mode) applies, then one ``tsc``
run checks all of them and errors are attributed back per file. Files are removed afterwards.
``tsc`` only reads the files; nothing is executed.

One ``tsc`` property shapes the design: a program with a *syntactic* error anywhere gets no
*semantic* diagnostics at all. Checked in a single batch, one generation with a stray ``>``
made every other generation look clean (it did, in the first lowered run). Telling syntactic
errors apart by code is unreliable (``TS2657`` "JSX expressions must have one parent element"
is a parser error with a checker-looking code), so the fix is empirical: after each run, every
file that reported anything is set aside and the rest is checked again, until a run is clean.
That is at most three runs: syntactic errors are always reported, so the second run has none
left and reports every semantic error, and the third finds nothing.
"""

import shutil
import subprocess
from collections.abc import Callable
from pathlib import Path

from contextslice.eval.metrics import CompileResultSummary, TsError, parse_tsc_output

GENERATED_DIR = Path("src/generated")

Runner = Callable[[Path], str]  # runs tsc in an SDS checkout and returns its combined output


def type_check(
    sds_root: Path, sources: dict[str, str], *, run: Runner | None = None
) -> dict[str, CompileResultSummary]:
    """``sources`` maps sample id -> TSX text. Returns one summary per sample."""
    run = run or _run_tsc
    summaries = {sample_id: CompileResultSummary() for sample_id in sources}
    remaining = dict(sources)
    while remaining:
        attributed: dict[str, list[TsError]] = {}
        for error in parse_tsc_output(_check_batch(sds_root, remaining, run)):
            sample_id = _sample_of(error)
            if sample_id in remaining:
                attributed.setdefault(sample_id, []).append(error)
            # Errors outside src/generated would mean the SDS project itself is broken; see
            # the `baseline` check in the runner, which records them rather than hiding them.
        if not attributed:
            break  # a clean run with nothing suppressed: the remaining files really pass
        for sample_id, errors in attributed.items():
            summaries[sample_id].errors.extend(errors)
            del remaining[sample_id]
    return summaries


def baseline_errors(sds_root: Path) -> list[TsError]:
    """Type errors in the untouched SDS project.

    Measured on 2026-09-18 at the pinned commit: 7 errors, all inside SDS's own sources
    (a `react-aria-components` typing drift in Button.tsx / AnchorOrButton.tsx and one unused
    parameter in a Code Connect file). They are outside ``src/generated`` and therefore never
    attributed to a sample, but a run records the count so the baseline is not misrepresented.
    """
    return parse_tsc_output(_run_tsc(sds_root))


def _check_batch(sds_root: Path, sources: dict[str, str], run: Runner) -> str:
    target = sds_root / GENERATED_DIR
    if target.exists():
        shutil.rmtree(target)
    target.mkdir(parents=True)
    try:
        for sample_id, code in sources.items():
            (target / f"{sample_id}.tsx").write_text(code, encoding="utf-8", newline="\n")
        return run(sds_root)
    finally:
        shutil.rmtree(target, ignore_errors=True)


def _run_tsc(sds_root: Path) -> str:
    tsc = (sds_root / "node_modules" / "typescript" / "bin" / "tsc").resolve()
    if not tsc.exists():
        raise FileNotFoundError(f"{tsc} not found: run `npm ci` in {sds_root} first")
    # Invoke through node rather than the .cmd shim so this works identically on Windows;
    # the path is absolute because `cwd` changes what a relative path would mean.
    completed = subprocess.run(
        ["node", str(tsc), "--noEmit", "--pretty", "false", "-p", "."],
        cwd=sds_root,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=900,
    )
    return completed.stdout + completed.stderr


def _sample_of(error: TsError) -> str | None:
    prefix = GENERATED_DIR.as_posix() + "/"
    if error.file.startswith(prefix) and error.file.endswith(".tsx"):
        return error.file[len(prefix) : -len(".tsx")]
    return None
