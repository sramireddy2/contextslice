"""Read Code Connect template files as *text* and pull out what a code generator needs.

A template (``Button.figma.ts``) is a small JavaScript program, but we never run it: executing
third-party code just to read a string would be a needless risk (ADR-0004). Everything here is
slicing and pattern matching, which is tractable because templates are written in a tiny DSL:
an instance can only be read through a handful of helpers (``getEnum``, ``getString``,
``getBoolean``, ``getInstanceSwap``), and a value can only reach the JSX in a few shapes.

Three levels of detail can be emitted for a component, cheapest first:

* ``imports``: the import statement(s): enough to *use* the right component;
* ``example``: the JSX usage snippet, which shows the real prop names;
* ``logic``: how Figma properties map onto prop values (``Primary`` -> ``"primary"``).

The template also yields the **prop rules** that the lowering pass (lower.py) applies: for each
Figma property the template reads, which React prop (or child) it becomes and how its values
translate. The template is, in effect, the component's ABI between design and code.
"""

import re
from dataclasses import dataclass, replace
from functools import cache
from pathlib import Path
from typing import Literal

from contextslice.ir import CodeMapping

_IMPORTS_ARRAY = re.compile(r"imports:\s*\[(.*?)\]", re.DOTALL)
_STRING_LITERAL = re.compile(r"""(['"`])(.*?)\1""", re.DOTALL)
_WHITESPACE = re.compile(r"\s+")
_BATCH_COMPONENT = "${component}"  # placeholder used by batch templates (one file, many icons)
_INSTANCE_BOILERPLATE = "constinstance=figma.selectedInstance"  # present in every template

# `const variant = instance.getEnum("Variant", {...})`, also through `figma.selectedInstance`
# and inside a ternary (`figma.batch.hasSizeVariants ? figma.selectedInstance.getEnum(...)`).
# The tempered `(?!\bconst\b)` stops a statement without a semicolon from swallowing the next.
_READ = re.compile(
    r"const\s+(?P<var>\w+)\s*=(?:(?!\bconst\b)[^;])*?"
    r"\b(?:selectedInstance|instance)\.get(?P<kind>Enum|String|Boolean|InstanceSwap)\("
    r'\s*"(?P<prop>[^"]+)"'
)
_NAMED_IMPORT = re.compile(r"""^\s*import\s*\{([^}]*)\}\s*from\s*(["'])([^"']+)\2\s*;?\s*$""")
_DEFAULT_IMPORT = re.compile(r"""^\s*import\s+(?:\*\s+as\s+)?(\w+)\s+from\s*["']""")
_QUOTED = re.compile(r"""^(?:"[^"]*"|'[^']*')$""")
_OPEN_TAG = re.compile(r"<(\$\{component\}|[A-Za-z][\w.]*)")

Kind = Literal["enum", "string", "boolean", "swap"]
Role = Literal["prop", "child", "drop"]
_KINDS: dict[str, Kind] = {
    "Enum": "enum",
    "String": "string",
    "Boolean": "boolean",
    "InstanceSwap": "swap",
}


@dataclass(frozen=True, slots=True)
class Expr:
    """A template expression we do not evaluate, kept as text for lower.py to pattern-match."""

    text: str


Value = str | bool | None | Expr  # None is JavaScript's undefined: the prop is omitted


@dataclass(frozen=True, slots=True)
class PropRule:
    """One ``getX("Figma prop", {...})`` read and where its result ends up in the JSX."""

    figma_prop: str
    kind: Kind
    variable: str
    role: Role
    target: str | None = None  # React prop name when role is "prop"
    values: tuple[tuple[str, Value], ...] = ()  # Figma value -> code value, in template order
    # The JSX element the prop is written on, when it can be told. A template's example may
    # wrap the component (`<Section padding="${padding}"><Panel gap="${gap}">`): `padding`
    # is Section's prop, not Panel's. None means "the component itself" or unknown.
    element: str | None = None


@dataclass(frozen=True, slots=True)
class Template:
    imports: tuple[str, ...]
    example: str
    logic: str
    rules: tuple[PropRule, ...] = ()
    exports: frozenset[str] = frozenset()  # symbols the import statements bring into scope
    # The name to write in code. Usually the mapping's name; when the template's header names
    # the component differently from its one import (``component=Button`` but
    # ``import { ButtonDanger }``) the import wins, because that is what compiles.
    code_name: str = ""
    # A "pattern" template describes a layout recipe (Section/Flex...) under a name that is not
    # itself an exported component. Importing that name is the model's most common mistake.
    pattern: bool = False


def load_template(sds_root: Path, mapping: CodeMapping) -> Template:
    template = _parse(sds_root / mapping.template_path)
    name = mapping.component_name
    if _BATCH_COMPONENT in "".join(template.imports) + template.example:
        template = replace(
            template,
            imports=tuple(line.replace(_BATCH_COMPONENT, name) for line in template.imports),
            example=template.example.replace(_BATCH_COMPONENT, name),
        )
    exports = import_names(template.imports)
    code_name, pattern = name, False
    if exports and name not in exports:
        if len(exports) == 1:
            code_name = next(iter(exports))
        else:
            pattern = True
    return replace(template, exports=exports, code_name=code_name, pattern=pattern)


def import_names(statements) -> frozenset[str]:
    """The local names a list of import statements defines (``{ A, B as C }`` -> A, C)."""
    names: set[str] = set()
    for statement in statements:
        named = _NAMED_IMPORT.match(statement)
        if named:
            for item in named.group(1).split(","):
                if item.strip():
                    names.add(item.strip().split(" as ")[-1].strip())
            continue
        default = _DEFAULT_IMPORT.match(statement)
        if default:
            names.add(default.group(1))
    return frozenset(names)


def consolidate_imports(statements) -> tuple[str, ...]:
    """Merge named imports per module: one ``import { A, B } from "m";`` instead of one per use.

    Deterministic (modules and names sorted) so the bundle is byte-stable. Statements in any
    other form are kept verbatim, once.
    """
    by_module: dict[str, set[str]] = {}
    others: list[str] = []
    for statement in statements:
        named = _NAMED_IMPORT.match(statement)
        if named:
            names = {item.strip() for item in named.group(1).split(",") if item.strip()}
            by_module.setdefault(named.group(3), set()).update(names)
        elif statement not in others:
            others.append(statement)
    merged = [
        f'import {{ {", ".join(sorted(names))} }} from "{module}";'
        for module, names in sorted(by_module.items())
    ]
    return tuple(merged + others)


@cache
def _parse(path: Path) -> Template:
    source = path.read_text(encoding="utf-8")
    body, _, exported = source.partition("export default")

    imports_match = _IMPORTS_ARRAY.search(exported)
    if imports_match:
        literals = _STRING_LITERAL.finditer(imports_match.group(1))
    else:
        # `const imports = hasLabel ? ['import { InputField } ...'] : ['import { Input } ...']`
        # then `imports,` in the export: take every import-looking literal in the file. An
        # extra, unused import costs a lint note; a missing one costs a compile error.
        literals = (m for m in _STRING_LITERAL.finditer(source) if m.group(2).startswith("import "))
    imports = tuple(dict.fromkeys(literal.group(2).strip() for literal in literals))

    return Template(
        imports=imports,
        example=_example(exported),
        logic=_logic(body),
        rules=_rules(body, exported),
    )


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


# -- prop rules ------------------------------------------------------------------------------------


def _rules(body: str, exported: str) -> tuple[PropRule, ...]:
    rules = []
    for match in _READ.finditer(body):
        values = _value_table(body, match.end())
        role, target, element = _usage(match.group("var"), exported)
        rules.append(
            PropRule(
                figma_prop=match.group("prop"),
                kind=_KINDS[match.group("kind")],
                variable=match.group("var"),
                role=role,
                target=target,
                values=values,
                element=element,
            )
        )
    return tuple(rules)


def _usage(variable: str, exported: str) -> tuple[Role, str | None, str | None]:
    """How the template's ``variable`` reaches the JSX: a named prop, the children, or not at all.

    ``renderProp("variant", variant)`` and ``variant="${variant}"`` (also ``={${variant}}`` and
    ``={variant}``) name a prop; a bare ``${variant}`` between tags or ``renderChildren(variant)``
    is children; anything else (a value only used to compute another one) is dropped. For a prop,
    the enclosing JSX element is reported too (see PropRule.element).
    """
    var = re.escape(variable)
    named = re.search(r'(?:\brp|renderProp)\(\s*"(\w+)"\s*,\s*' + var + r"\b", exported)
    if named is None:
        named = re.search(
            r"(\w+)=(?:\"\$\{" + var + r"\}\"|\{\$\{" + var + r"\}\}|\{" + var + r"\})",
            exported,
        )
    if named is not None:
        target = named.group(1)
        if target == "children":
            return ("child", None, None)
        return ("prop", target, _enclosing_element(exported, named.start()))
    if re.search(r"\$\{" + var + r"\}|renderChildren\(\s*" + var + r"\b", exported):
        return ("child", None, None)
    return ("drop", None, None)


def _enclosing_element(exported: str, position: int) -> str | None:
    """The nearest ``<Tag`` opened before ``position``; None for the batch ``<${component}``."""
    tags = _OPEN_TAG.findall(exported[:position])
    if not tags:
        return None
    return None if tags[-1] == _BATCH_COMPONENT else tags[-1]


def _value_table(text: str, start: int) -> tuple[tuple[str, Value], ...]:
    """The ``{ Primary: "primary", ... }`` object after a read's property name, if there is one."""
    i = _skip_space(text, start)
    if i >= len(text) or text[i] != ",":
        return ()
    i = _skip_space(text, i + 1)
    if i >= len(text) or text[i] != "{":
        return ()
    inner = _balanced(text, i)
    table = []
    for entry in _split_top_level(inner, ","):
        key, found, value = _partition_top_level(entry, ":")
        if not found or not key.strip():
            continue
        table.append((key.strip().strip("\"'"), _classify(value.strip())))
    return tuple(table)


def _classify(value: str) -> Value:
    if _QUOTED.match(value):
        return value[1:-1]
    if value == "true":
        return True
    if value == "false":
        return False
    if value in ("undefined", "null", ""):
        return None
    return Expr(_squash(value))


def _skip_space(text: str, i: int) -> int:
    while i < len(text) and text[i].isspace():
        i += 1
    return i


def _balanced(text: str, start: int) -> str:
    """The text inside the bracket at ``start``, honouring nesting and string literals."""
    opener = text[start]
    closer = {"{": "}", "(": ")", "[": "]"}[opener]
    depth, i, quote = 0, start, None
    while i < len(text):
        char = text[i]
        if quote:
            if char == "\\":
                i += 1
            elif char == quote:
                quote = None
        elif char in "\"'`":
            quote = char
        elif char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return text[start + 1 : i]
        i += 1
    return text[start + 1 :]  # unbalanced: take the rest rather than fail


def _split_top_level(text: str, separator: str) -> list[str]:
    parts, depth, quote, current = [], 0, None, []
    for char in text:
        if quote:
            if char == quote:
                quote = None
        elif char in "\"'`":
            quote = char
        elif char in "{([":
            depth += 1
        elif char in "})]":
            depth -= 1
        elif char == separator and depth == 0:
            parts.append("".join(current))
            current = []
            continue
        current.append(char)
    tail = "".join(current)
    if tail.strip():
        parts.append(tail)
    return parts


def _partition_top_level(text: str, separator: str) -> tuple[str, bool, str]:
    depth, quote = 0, None
    for i, char in enumerate(text):
        if quote:
            if char == quote:
                quote = None
        elif char in "\"'`":
            quote = char
        elif char in "{([":
            depth += 1
        elif char in "})]":
            depth -= 1
        elif char == separator and depth == 0:
            return text[:i], True, text[i + 1 :]
    return text, False, ""
