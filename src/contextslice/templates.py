"""Read Code Connect template files as *text* and pull out what a code generator needs.

A template (``Button.figma.ts``) is a small JavaScript program, but we never run it: executing
third-party code just to read a string would be a needless risk. Everything here is slicing.

Three levels of detail can be emitted for a component, cheapest first:

* ``imports``: the import statement(s): enough to *use* the right component;
* ``example``: the JSX usage snippet, which shows the real prop names;
* ``logic``: how Figma properties map onto prop values (``Primary`` -> ``"primary"``).
"""

import re
from dataclasses import dataclass
from functools import cache
from pathlib import Path

from contextslice.ir import CodeMapping

_IMPORTS_ARRAY = re.compile(r"imports:\s*\[(.*?)\]", re.DOTALL)
_STRING_LITERAL = re.compile(r"""(['"`])(.*?)\1""", re.DOTALL)
_WHITESPACE = re.compile(r"\s+")
_BATCH_COMPONENT = "${component}"  # placeholder used by batch templates (one file, many icons)
_INSTANCE_BOILERPLATE = "constinstance=figma.selectedInstance"  # present in every template


@dataclass(frozen=True, slots=True)
class Template:
    imports: tuple[str, ...]
    example: str
    logic: str


def load_template(sds_root: Path, mapping: CodeMapping) -> Template:
    template = _parse(sds_root / mapping.template_path)
    if _BATCH_COMPONENT not in "".join(template.imports) + template.example:
        return template
    name = mapping.component_name
    return Template(
        imports=tuple(line.replace(_BATCH_COMPONENT, name) for line in template.imports),
        example=template.example.replace(_BATCH_COMPONENT, name),
        logic=template.logic,
    )


@cache
def _parse(path: Path) -> Template:
    source = path.read_text(encoding="utf-8")
    body, _, exported = source.partition("export default")

    imports_match = _IMPORTS_ARRAY.search(exported)
    imports = tuple(
        literal.group(2).strip()
        for literal in _STRING_LITERAL.finditer(imports_match.group(1) if imports_match else "")
    )

    return Template(imports=imports, example=_example(exported), logic=_logic(body))


def _example(exported: str) -> str:
    """The template literal after ``example:``.

    The literal can contain *nested* template literals (``${cond ? figma.code`...` : ""}``), and a
    regular expression cannot match nested delimiters. But nothing after the example contains a
    backtick, so the outermost literal simply runs from the first backtick to the last one.
    """
    _, found, rest = exported.partition("example:")
    if not found:
        return ""
    start, end = rest.find("`"), rest.rfind("`")
    if start == -1 or end <= start:
        return ""
    return _squash(rest[start + 1 : end])


def _logic(body: str) -> str:
    """The property-extraction statements, minus header comments and boilerplate."""
    kept = [
        line
        for line in body.splitlines()
        if line.strip()
        and not line.lstrip().startswith(("//", "import "))
        and line.replace(" ", "").rstrip(";") != _INSTANCE_BOILERPLATE
    ]
    return _squash(" ".join(kept))


def _squash(text: str) -> str:
    """Collapse all whitespace runs: JSX does not care, and indentation is pure token cost."""
    return _WHITESPACE.sub(" ", text).strip()
