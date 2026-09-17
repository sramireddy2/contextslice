"""Small helpers for walking Figma's raw REST JSON. Shared by the census and the IR adapter."""

import json
from collections.abc import Iterator
from typing import Any

Raw = dict[str, Any]


def walk(root: Raw) -> Iterator[tuple[Raw, int]]:
    """Depth-first traversal yielding ``(node, depth)``. Iterative: safe for very deep trees."""
    stack: list[tuple[Raw, int]] = [(root, 0)]
    while stack:
        node, depth = stack.pop()
        yield node, depth
        stack.extend((child, depth + 1) for child in reversed(node.get("children", [])))


def own_properties(node: Raw) -> Raw:
    """A node's properties without its children (children are visited by the tree walk itself)."""
    return {key: value for key, value in node.items() if key != "children"}


def variable_alias_ids(value: Any) -> Iterator[str]:
    """Yield the id of every ``{"type": "VARIABLE_ALIAS", "id": ...}`` found anywhere in ``value``.

    Bindings are not only in ``node.boundVariables``: they also nest inside paints, effects,
    text styles and component properties. One generic walker finds them all.
    """
    stack = [value]
    while stack:
        current = stack.pop()
        if isinstance(current, dict):
            if current.get("type") == "VARIABLE_ALIAS" and "id" in current:
                yield current["id"]
            else:
                stack.extend(current.values())
        elif isinstance(current, list):
            stack.extend(current)


def compact_json(value: Any) -> str:
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False)
