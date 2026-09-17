"""The intermediate representation (IR): ContextSlice's own model of a design file.

Every compiler pass works on these types and never on Figma's raw JSON. That buys three things:

* one place (the adapter) knows Figma's quirks, so a schema change touches one module;
* other sources (a plugin export, a synthetic generator) can target the same IR;
* the types document exactly which facts the compiler is allowed to rely on.

All types are frozen: passes produce new values instead of mutating shared state, which keeps
passes independent and output deterministic.
"""

from collections.abc import Mapping
from dataclasses import dataclass, field
from enum import StrEnum
from typing import Any


class NodeKind(StrEnum):
    DOCUMENT = "DOCUMENT"
    PAGE = "PAGE"
    SECTION = "SECTION"
    FRAME = "FRAME"
    GROUP = "GROUP"
    TEXT = "TEXT"
    SHAPE = "SHAPE"
    VECTOR = "VECTOR"
    INSTANCE = "INSTANCE"
    COMPONENT = "COMPONENT"
    COMPONENT_SET = "COMPONENT_SET"
    SLOT = "SLOT"
    OTHER = "OTHER"


@dataclass(frozen=True, slots=True)
class Binding:
    """A design property bound to a variable, e.g. ``fills -> VariableID:9:11199``."""

    field: str
    variable_id: str


@dataclass(frozen=True, slots=True)
class DesignNode:
    id: str
    kind: NodeKind
    name: str
    parent_id: str | None
    child_ids: tuple[str, ...]
    visible: bool
    # True for the resolved copies Figma inlines under every INSTANCE (ids like "I5:1;1:3").
    inlined: bool
    # For inlined nodes: the node inside the main component that this copy mirrors.
    source_id: str | None
    # For INSTANCE nodes: the main component.
    component_id: str | None
    bindings: tuple[Binding, ...]
    style_refs: tuple[tuple[str, str], ...]  # (style type, style id), e.g. ("fill", "125:20")
    # Normalized, emit-relevant properties (see normalize.py).
    props: Mapping[str, Any] = field(compare=False)
    # Size of the node's own raw JSON, kept so the pass ledger can report what P0 saved.
    raw_chars: int = field(compare=False, default=0)


@dataclass(frozen=True, slots=True)
class Component:
    id: str
    key: str
    name: str
    set_id: str | None
    remote: bool


@dataclass(frozen=True, slots=True)
class Variable:
    id: str
    path: str  # e.g. "@color/background/brand/default"; "" when unresolved
    type: str
    # mode name -> literal value, or {"alias": "<variable id>"}
    modes: Mapping[str, Any] = field(compare=False)
    alias_targets: tuple[str, ...] = ()
    # False when a node binds a variable we have no definition for (other library / newer file).
    resolved: bool = True


@dataclass(frozen=True, slots=True)
class CodeMapping:
    """A Code Connect mapping: this Figma component is implemented by that code component."""

    node_id: str  # the COMPONENT or COMPONENT_SET it describes
    component_name: str
    source: str
    template_path: str  # path of the Code Connect file, relative to the SDS repo


@dataclass(frozen=True)
class DesignFile:
    name: str
    version: str
    root_id: str
    nodes: Mapping[str, DesignNode]
    components: Mapping[str, Component]
    variables: Mapping[str, Variable]
    styles: Mapping[str, Mapping[str, Any]]
    mappings: tuple[CodeMapping, ...]

    def path_of(self, node_id: str) -> str:
        """Human-readable location, e.g. ``Examples / Examples/About / Platform=Desktop``."""
        parts: list[str] = []
        current: str | None = node_id
        while current is not None:
            node = self.nodes[current]
            if node.kind is not NodeKind.DOCUMENT and node.name.strip():  # sections can be unnamed
                parts.append(node.name)
            current = node.parent_id
        return " / ".join(reversed(parts))
