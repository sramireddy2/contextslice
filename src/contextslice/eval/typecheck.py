"""Batch type-check of generated files against the real SDS project.

Generated files are written under ``vendor/sds/src/generated/`` so the project's own
``tsconfig`` (path aliases such as ``"primitives"``, strict mode) applies, then ONE ``tsc``
run checks all of them and errors are attributed back per file. Files are removed afterwards.
``tsc`` only reads the files; nothing is executed.
"""

import shutil
import subprocess
from pathlib import Path

from contextslice.eval.metrics import CompileResultSummary, TsError, parse_tsc_output

GENERATED_DIR = Path("src/generated")


def type_check(sds_root: Path, sources: dict[str, str]) -> dict[str, CompileResultSummary]:
    """``sources`` maps sample id -> TSX text. Returns one summary per sample."""
    target = sds_root / GENERATED_DIR
    if target.exists():
        shutil.rmtree(target)
    target.mkdir(parents=True)
    try:
        for sample_id, code in sources.items():
            (target / f"{sample_id}.tsx").write_text(code, encoding="utf-8", newline="\n")
        output = _run_tsc(sds_root)
    finally:
        shutil.rmtree(target, ignore_errors=True)

    summaries = {sample_id: CompileResultSummary() for sample_id in sources}
    for error in parse_tsc_output(output):
        sample_id = _sample_of(error)
        if sample_id in summaries:
            summaries[sample_id].errors.append(error)
        # Errors outside src/generated would mean the SDS project itself is broken; see the
        # `baseline` check in the runner, which asserts there are none before scoring.
    return summaries


def baseline_errors(sds_root: Path) -> list[TsError]:
    """Type errors in the untouched SDS project.

    Measured on 2026-09-18 at the pinned commit: 7 errors, all inside SDS's own sources
    (a `react-aria-components` typing drift in Button.tsx / AnchorOrButton.tsx and one unused
    parameter in a Code Connect file). They are outside ``src/generated`` and therefore never
    attributed to a sample, but a run records the count so the baseline is not misrepresented.
    """
    return parse_tsc_output(_run_tsc(sds_root))


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
