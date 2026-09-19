"""Static metrics over generated TSX source. No generated code is ever executed.

* component reuse: which design-system components the code imports *and* uses as JSX tags,
  against the set the design context said the screen is made of;
* design-token adherence: CSS-variable references versus hardcoded hex colours / px sizes,
  and "missed tokens" (a hardcoded value that exactly equals a token the context defined);
* type-check results parsed from ``tsc`` output, classified so that unused-import noise is not
  confused with hallucinated components or wrong props.
"""

import re
from collections import Counter
from dataclasses import dataclass, field

from contextslice.eval.prompt import DESIGN_SYSTEM_MODULES

_FENCE = re.compile(r"```(?:tsx|jsx|typescript|ts|javascript|js)?\s*\n(.*?)```", re.DOTALL)
_IMPORT = re.compile(r"import\s*\{([^}]*)\}\s*from\s*[\"']([^\"']+)[\"']")
# Default and namespace imports (`import axios from "axios"`, `import * as R from "react"`):
# they bring no design-system component names in, but the module still has to be allowed.
_OTHER_IMPORT = re.compile(
    r"import\s+(?:[A-Za-z_$][\w$]*|\*\s+as\s+\w+)\s+from\s*[\"']([^\"']+)[\"']"
)
_JSX_TAG = re.compile(r"<([A-Z][A-Za-z0-9_]*)\b")
_RAW_ELEMENT = re.compile(r"<(button|input|select|textarea|a|form|nav|header|footer)\b")
_CSS_VAR = re.compile(r"var\(--sds-[a-z0-9-]+\)")
_HEX = re.compile(r"#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
_PX = re.compile(r"\b\d+(?:\.\d+)?px\b")
_TSC_LINE = re.compile(
    r"^(?P<file>[^\s(]+)\((?P<line>\d+),(?P<col>\d+)\): error (?P<code>TS\d+): (?P<message>.*)$"
)

_ERROR_CLASSES = {
    "unused": {"TS6133", "TS6192", "TS6196", "TS6198"},
    "missing": {"TS2305", "TS2307", "TS2724", "TS2304", "TS2552"},
    "type": {"TS2322", "TS2339", "TS2741", "TS2353", "TS2559", "TS2769", "TS2345", "TS2554"},
}


def extract_tsx(text: str) -> str | None:
    """The first fenced code block; failing that, the whole reply if it looks like a file."""
    match = _FENCE.search(text)
    if match:
        return match.group(1).strip() + "\n"
    if "export default" in text:
        return text.strip() + "\n"
    return None


@dataclass(frozen=True)
class ImportUsage:
    imported: dict[str, tuple[str, ...]]  # module -> imported names
    used_tags: frozenset[str]
    raw_elements: int
    disallowed_modules: tuple[str, ...]


def import_usage(code: str) -> ImportUsage:
    imported: dict[str, list[str]] = {}
    disallowed = []
    for names, module in _IMPORT.findall(code):
        cleaned = [n.strip().split(" as ")[-1].strip() for n in names.split(",") if n.strip()]
        imported.setdefault(module, []).extend(cleaned)
    for module in _OTHER_IMPORT.findall(code):
        imported.setdefault(module, [])
    for module in imported:
        if module not in DESIGN_SYSTEM_MODULES and module != "react":
            disallowed.append(module)
    return ImportUsage(
        imported={m: tuple(n) for m, n in imported.items()},
        used_tags=frozenset(_JSX_TAG.findall(code)),
        raw_elements=len(_RAW_ELEMENT.findall(code)),
        disallowed_modules=tuple(sorted(set(disallowed))),
    )


@dataclass(frozen=True)
class ComponentReuse:
    expected: int
    used: int
    matched: int

    @property
    def recall(self) -> float | None:
        return self.matched / self.expected if self.expected else None

    @property
    def precision(self) -> float | None:
        return self.matched / self.used if self.used else None


def component_reuse(usage: ImportUsage, expected: set[str]) -> ComponentReuse:
    """A component counts as reused only if it is imported from a design-system module AND used."""
    ds_imports = {
        name
        for module, names in usage.imported.items()
        if module in DESIGN_SYSTEM_MODULES
        for name in names
    }
    used = ds_imports & usage.used_tags
    return ComponentReuse(expected=len(expected), used=len(used), matched=len(used & expected))


@dataclass(frozen=True)
class TokenAdherence:
    variable_refs: int
    hardcoded_hex: int
    hardcoded_px: int
    missed_tokens: int  # hardcoded values equal to a token the context defined

    @property
    def rate(self) -> float | None:
        total = self.variable_refs + self.hardcoded_hex + self.hardcoded_px
        return self.variable_refs / total if total else None


def token_adherence(code: str, token_values: dict[str, str]) -> TokenAdherence:
    hexes = [h.lower() for h in _HEX.findall(code)]
    known = {str(v).lower() for v in token_values.values()}
    return TokenAdherence(
        variable_refs=len(_CSS_VAR.findall(code)),
        hardcoded_hex=len(hexes),
        hardcoded_px=len(_PX.findall(code)),
        missed_tokens=sum(h in known for h in hexes),
    )


@dataclass(frozen=True)
class TsError:
    file: str
    line: int
    code: str
    message: str

    @property
    def kind(self) -> str:
        for kind, codes in _ERROR_CLASSES.items():
            if self.code in codes:
                return kind
        return "syntax" if self.code.startswith("TS1") else "other"


def parse_tsc_output(text: str) -> list[TsError]:
    errors = []
    for raw in text.splitlines():
        match = _TSC_LINE.match(raw.strip())
        if match:
            errors.append(
                TsError(
                    file=match["file"].replace("\\", "/"),
                    line=int(match["line"]),
                    code=match["code"],
                    message=match["message"],
                )
            )
    return errors


@dataclass
class CompileResultSummary:
    errors: list[TsError] = field(default_factory=list)

    @property
    def by_kind(self) -> Counter[str]:
        return Counter(error.kind for error in self.errors)

    @property
    def passes(self) -> bool:
        """Type-checks, ignoring unused-symbol noise (which is a lint concern, not correctness)."""
        return all(error.kind == "unused" for error in self.errors)
