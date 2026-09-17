"""Adapter ("front end"): raw Figma REST JSON + the SDS repo -> IR.

This is the only module that knows what Figma's JSON looks like.
"""

import re
from pathlib import Path
from typing import Any

from contextslice import sds
from contextslice.figma_json import Raw, compact_json, own_properties, variable_alias_ids
from contextslice.ir import (
    Binding,
    CodeMapping,
    Component,
    DesignFile,
    DesignNode,
    NodeKind,
    Variable,
)
from contextslice.normalize import normalize_props

_KIND_BY_TYPE: dict[str, NodeKind] = {
    "DOCUMENT": NodeKind.DOCUMENT,
    "CANVAS": NodeKind.PAGE,
    "SECTION": NodeKind.SECTION,
    "FRAME": NodeKind.FRAME,
    "GROUP": NodeKind.GROUP,
    "TEXT": NodeKind.TEXT,
    "INSTANCE": NodeKind.INSTANCE,
    "COMPONENT": NodeKind.COMPONENT,
    "COMPONENT_SET": NodeKind.COMPONENT_SET,
    "SLOT": NodeKind.SLOT,
    "RECTANGLE": NodeKind.SHAPE,
    "ELLIPSE": NodeKind.SHAPE,
    "LINE": NodeKind.SHAPE,
    "STAR": NodeKind.SHAPE,
    "REGULAR_POLYGON": NodeKind.SHAPE,
    "VECTOR": NodeKind.VECTOR,
    "BOOLEAN_OPERATION": NodeKind.VECTOR,
}

# Raw keys that never contribute bindings of their own:
# `background` is a legacy duplicate of `fills`; the other two are handled explicitly.
_NO_NESTED_BINDINGS = frozenset({"children", "boundVariables", "background"})


def build_design_file(document: Raw, sds_root: Path | None = None) -> DesignFile:
    nodes = _nodes(document["document"])
    variables = _variables(sds_root) if sds_root else {}
    mappings: tuple[CodeMapping, ...] = tuple(sds.load_code_mappings(sds_root)) if sds_root else ()

    # A node may bind a variable we have no definition for (another library, or newer than the
    # pinned tokens.json). Represent it explicitly so the graph never has a dangling edge.
    bound_ids = {binding.variable_id for node in nodes.values() for binding in node.bindings}
    for variable_id in sorted(bound_ids - variables.keys()):
        variables[variable_id] = Variable(
            id=variable_id, path="", type="", modes={}, resolved=False
        )

    return DesignFile(
        name=str(document.get("name", "")),
        version=str(document.get("version", "")),
        root_id=document["document"]["id"],
        nodes=nodes,
        components={
            component_id: Component(
                id=component_id,
                key=str(meta.get("key", "")),
                name=str(meta.get("name", "")),
                set_id=meta.get("componentSetId"),
                remote=bool(meta.get("remote", False)),
            )
            for component_id, meta in document.get("components", {}).items()
        },
        variables=variables,
        styles=document.get("styles", {}),
        mappings=mappings,
    )


def _nodes(root: Raw) -> dict[str, DesignNode]:
    nodes: dict[str, DesignNode] = {}
    stack: list[tuple[Raw, str | None]] = [(root, None)]
    while stack:
        raw, parent_id = stack.pop()
        node_id: str = raw["id"]
        children: list[Raw] = raw.get("children", [])
        inlined = node_id.startswith("I")
        own = own_properties(raw)

        nodes[node_id] = DesignNode(
            id=node_id,
            kind=_KIND_BY_TYPE.get(raw.get("type", ""), NodeKind.OTHER),
            name=str(raw.get("name", "")),
            parent_id=parent_id,
            child_ids=tuple(child["id"] for child in children),
            visible=raw.get("visible", True) is not False,
            inlined=inlined,
            # "I5:1;1:3" is instance 5:1's copy of node 1:3: the suffix is a free
            # correspondence edge back to the main component.
            source_id=node_id.rsplit(";", 1)[-1] if inlined else None,
            component_id=raw.get("componentId"),
            bindings=_bindings(own),
            style_refs=tuple(sorted(raw.get("styles", {}).items())),
            props=normalize_props(own),
            raw_chars=len(compact_json(own)),
        )
        stack.extend((child, node_id) for child in reversed(children))
    return nodes


def _bindings(own: Raw) -> tuple[Binding, ...]:
    """Collect (field, variable) pairs, de-duplicated.

    Figma reports most bindings twice: once in the node-level ``boundVariables`` summary (with
    precise field names) and again nested inside the paint/effect it applies to. The node-level
    entry is canonical; nested ones are only added when they name a variable not seen there.
    """
    found: dict[tuple[str, str], None] = {}  # dict as an insertion-ordered set

    for field_name, value in own.get("boundVariables", {}).items():
        for variable_id in variable_alias_ids(value):
            found[(field_name, sds.normalize_variable_id(variable_id))] = None

    canonical_ids = {variable_id for _, variable_id in found}
    for key, value in own.items():
        if key in _NO_NESTED_BINDINGS:
            continue
        for variable_id in variable_alias_ids(value):
            normalized = sds.normalize_variable_id(variable_id)
            if normalized not in canonical_ids:
                found[(key, normalized)] = None

    return tuple(Binding(field=f, variable_id=v) for f, v in found)


def _variables(sds_root: Path) -> dict[str, Variable]:
    tokens = sds.load_tokens(sds_root)
    # Aliases are written "{@collection.Group.Name}", but token paths are "@collection/group/name":
    # the two spellings differ in case and spacing, so both sides go through one canonical form.
    by_reference = {_canonical_reference(token.path.replace("/", ".")): token for token in tokens}

    variables: dict[str, Variable] = {}
    for token in tokens:
        modes: dict[str, Any] = {}
        targets: dict[str, None] = {}
        for mode, value in token.modes.items():
            target = (
                by_reference.get(_canonical_reference(value[1:-1])) if _is_alias(value) else None
            )
            if target is None:
                modes[mode] = value
            else:
                target_id = sds.normalize_variable_id(target.figma_id)
                modes[mode] = {"alias": target_id}
                targets[target_id] = None

        variable_id = sds.normalize_variable_id(token.figma_id)
        variables[variable_id] = Variable(
            id=variable_id,
            path=token.path,
            type=token.type,
            modes=modes,
            alias_targets=tuple(targets),
        )
    return variables


def _canonical_reference(reference: str) -> str:
    """``@color_primitives.Brand B.800`` and ``@color_primitives.brand-b.800`` compare equal."""
    return re.sub(r"[\s_-]+", "", reference.lower())


def _is_alias(value: Any) -> bool:
    return isinstance(value, str) and value.startswith("{") and value.endswith("}")
