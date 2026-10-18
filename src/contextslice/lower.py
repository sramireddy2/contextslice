"""Pass P4b: prop lowering. Translate a mapped instance's Figma properties into its React props.

Before this pass the bundle spoke two languages. The TREE said ``<PricingCard Device=Desktop
Variant=Stroke>`` (Figma's property names and values) while the COMPONENTS section, two inches
above, said ``variant="${variant}"``. Nothing connected the two, and the model copied the Figma
side: in the first evaluation run, 133 of the 139 type errors in the ContextSlice arm were props
like ``platform`` passed to a component that has no such prop, plus ``"Start"`` where the code
wanted ``"start"``.

The translation table already exists: every Code Connect template reads the instance through
``getEnum("Variant", { Primary: "primary" })``, ``getString("Label")`` and friends, then places
each value on a named prop or between the tags. templates.py extracts those reads as
``PropRule``s; this module applies them to one instance, in template order:

* ``enum``/``boolean`` with a value table: look the Figma value up. A string becomes
  ``prop="value"``, ``true`` becomes a bare ``prop``, ``undefined`` or a value missing from the
  table means the prop is omitted (``State=Default`` -> nothing);
* ``string``: the text, quoted as data, on its prop or as the element's children;
* ``swap``: the swapped-in component as ``prop={<Icon />}``;
* a table value that is an expression is resolved by shape (``getString("Initials")`` reads
  another property, ``executeTemplate()`` renders a swapped instance, ``jsxElement('<Image')``
  is a literal element); anything else is omitted rather than invented.

Everything the template does not read is **dropped**: if the template never looks at a
property, the code component has no prop for it (``Platform``, ``Has Subheading``, ``Link 3``).
This is lowering in the compiler sense: one vocabulary to another through an interface
description, with the design's own words never reaching the target language.
"""

import re
from collections.abc import Callable, Mapping
from dataclasses import dataclass
from typing import Any

from contextslice.templates import PropRule, Template, Value
from contextslice.text import quote

_GET_STRING = re.compile(r'getString\(\s*"([^"]+)"\s*\)')
_GET_SWAP = re.compile(r'getInstanceSwap\(\s*"([^"]+)"\s*\)')
_JSX_ELEMENT = re.compile(r"""jsxElement\(\s*["'`]\s*<(\w+)""")
_FIGMA_STRING = re.compile(r'figma\.string\(\s*"([^"]+)"\s*\)')

SwapLabel = Callable[[str], str]  # component id -> the name to print for a swapped-in instance
Properties = Mapping[str, Mapping[str, Any]]  # Figma componentProperties: name -> {type, value}


@dataclass(frozen=True, slots=True)
class Lowered:
    attrs: tuple[str, ...]  # ready to print: `variant="primary"`, `isDisabled`, `icon={<X />}`
    children: tuple[str, ...]  # quoted text that becomes the element's children


def lower_instance(props: Properties, template: Template, swap_label: SwapLabel) -> Lowered:
    attrs: dict[str, str] = {}  # React prop -> rendered attribute; the first rule to set it wins
    children: list[str] = []
    for rule in template.rules:
        if rule.role == "drop" or rule.figma_prop not in props:
            continue
        if rule.role == "prop" and not _belongs_to_component(rule, template):
            continue  # a wrapper element's prop (`<Section padding=...>` around the component)
        value = _code_value(rule, props[rule.figma_prop].get("value"), props, template, swap_label)
        if value is None:
            continue
        if rule.role == "child":
            if isinstance(value, str) and value.startswith('"'):  # text, not an element
                children.append(value)
        elif rule.target not in attrs:
            attrs[rule.target or ""] = rule.target if value is True else f"{rule.target}={value}"
    return Lowered(attrs=tuple(attrs.values()), children=tuple(children))


def _belongs_to_component(rule: PropRule, template: Template) -> bool:
    """A pattern's props all describe the recipe; otherwise only the component's own tag counts.

    A template whose code name is unknown (no ``load_template`` call, as in unit tests) keeps
    every prop: there is nothing to compare the element against.
    """
    if template.pattern or rule.element is None or not template.code_name:
        return True
    return rule.element == template.code_name


def _code_value(
    rule: PropRule, raw: Any, props: Properties, template: Template, swap_label: SwapLabel
) -> str | bool | None:
    """The attribute value in its printed form, ``True`` for a bare boolean prop, or None."""
    if rule.kind == "string":
        return quote(str(raw)) if raw not in (None, "") else None
    if rule.kind == "swap":
        return _element(swap_label(str(raw))) if raw else None

    table = dict(rule.values)
    if not table:  # getBoolean("Has Icon") / getEnum("Size") used as-is
        if isinstance(raw, bool):
            return True if raw else None
        return quote(str(raw)) if raw not in (None, "") else None
    key = ("true" if raw else "false") if isinstance(raw, bool) else str(raw)
    if key not in table:
        return None  # the template has no translation for this value: the prop is omitted
    return _resolve(table[key], props, template, swap_label)


def _resolve(
    value: Value, props: Properties, template: Template, swap_label: SwapLabel
) -> str | bool | None:
    if isinstance(value, bool):
        return True if value else None
    if value is None:
        return None
    if isinstance(value, str):
        return quote(value)
    text = value.text
    if (match := _GET_STRING.search(text)) is not None:
        other = props.get(match.group(1), {}).get("value")
        return quote(str(other)) if other not in (None, "") else None
    if (match := _GET_SWAP.search(text)) is not None:
        return _swapped(props.get(match.group(1), {}).get("value"), swap_label)
    for rule in template.rules:  # `iconStartSwap?.executeTemplate().example`
        if rule.kind == "swap" and re.search(r"\b" + re.escape(rule.variable) + r"\b", text):
            return _swapped(props.get(rule.figma_prop, {}).get("value"), swap_label)
    if (match := _JSX_ELEMENT.search(text)) is not None:
        tag = match.group(1)
        inner = _FIGMA_STRING.search(text)  # `<TextSmall>{figma.string("Body")}</TextSmall>`
        other = props.get(inner.group(1), {}).get("value") if inner else None
        if other not in (None, ""):
            return f"{{<{tag}>{quote(str(other))}</{tag}>}}"
        return _element(tag)
    return None  # an expression we cannot read statically: omit rather than invent


def _swapped(component_id: Any, swap_label: SwapLabel) -> str | None:
    return _element(swap_label(str(component_id))) if component_id else None


def _element(name: str) -> str:
    return f"{{<{name} />}}"
