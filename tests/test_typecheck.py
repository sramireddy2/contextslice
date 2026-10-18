from pathlib import Path

from contextslice.eval.typecheck import GENERATED_DIR, type_check

# Markers in the fake sources: which diagnostics a file produces.
PARSER_ERRORS = {"SYNTAX": "TS1003: Identifier expected.", "PARENT": "TS2657: JSX expressions must"}


class FakeTsc:
    """Behaves like tsc: with any parser error in the program, no semantic errors at all."""

    def __init__(self) -> None:
        self.runs = 0

    def __call__(self, sds_root: Path) -> str:
        self.runs += 1
        files = sorted((sds_root / GENERATED_DIR).glob("*.tsx"))
        texts = {f.name: f.read_text(encoding="utf-8") for f in files}
        parser = {
            name: message
            for name, text in texts.items()
            for marker, message in PARSER_ERRORS.items()
            if marker in text
        }
        prefix = GENERATED_DIR.as_posix()
        if parser:
            return "".join(f"{prefix}/{n}(1,1): error {m}\n" for n, m in parser.items())
        return "".join(
            f"{prefix}/{name}(2,1): error TS2304: Cannot find name 'Box'.\n"
            for name, text in texts.items()
            if "MISSING" in text
        )


def test_a_parser_error_in_one_file_does_not_hide_the_others_errors(tmp_path) -> None:
    tsc = FakeTsc()
    sources = {"a": "ok", "b": "SYNTAX", "c": "MISSING", "d": "ok", "e": "PARENT"}

    results = type_check(tmp_path, sources, run=tsc)

    assert dict(results["b"].by_kind) == {"syntax": 1}
    assert dict(results["e"].by_kind) == {"syntax": 1}  # TS2657 counts as syntax
    assert dict(results["c"].by_kind) == {"missing": 1}  # found on the second run
    assert results["a"].passes and results["d"].passes
    assert tsc.runs == 3  # parser errors, then semantic errors, then a clean run
    assert not (tmp_path / GENERATED_DIR).exists()  # cleaned up


def test_a_clean_batch_needs_one_run_and_all_broken_terminates(tmp_path) -> None:
    clean = FakeTsc()
    assert all(r.passes for r in type_check(tmp_path, {"a": "ok", "b": "ok"}, run=clean).values())
    assert clean.runs == 1

    broken = FakeTsc()
    results = type_check(tmp_path, {"a": "SYNTAX", "b": "PARENT"}, run=broken)
    assert all(dict(r.by_kind) == {"syntax": 1} for r in results.values())
    assert broken.runs == 1
