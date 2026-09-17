"""Pass P4: Code Connect substitution. Builds the *context tree* the emitter renders.

An instance of a component that has a code mapping does not need its inlined subtree in the
prompt: the React component already knows how to draw itself. What the developer's code must
still supply is exactly what differs from one use to the next:

1. the instance's own property values (variant, labels, toggles): they stay on the node;
2. **slot content**: arbitrary nodes injected into the component, i.e. its React ``children``;
3. nested mapped instances: composition templates read *their* properties
   (``findInstance("Button").getString("Label")``), so the skeleton of nested components stays.

Everything else inside a mapped instance (frames, vectors, text layers that merely display a
property) is internal structure and is dropped. This is the compiler idea "emit the call, not
the callee's body".

The walk therefore has two modes. NORMAL keeps every visible node. COLLAPSED (inside a mapped
instance) keeps only nested mapped instances and slots; entering a slot switches back to NORMAL.
"""

from dataclasses import dataclass
from enum import StrEnum

from contextslice.ir import CodeMapping, DesignFile, DesignNode, NodeKind


class Role(StrEnum):
    NODE = "NODE"  # rendered from its design properties
    COMPONENT = "COMPONENT"  # rendered as a reference to a code component
    SLOT = "SLOT"  # content injected into the enclosing code component


@dataclass(frozen=True, slots=True)
class ContextNode:
    node_id: str
    role: Role
    mapping: CodeMapping | None
    children: tuple["ContextNode", ...]


def mapping_index(design: DesignFile) -> dict[str, CodeMapping]:
    """Figma node id (component or component set) -> its mapping; first definition wins."""
    index: dict[str, CodeMapping] = {}
    for mapping in design.mappings:
        index.setdefault(mapping.node_id, mapping)
    return index


def mapping_for(
    design: DesignFile, node: DesignNode, index: dict[str, CodeMapping]
) -> CodeMapping | None:
    """An instance is mapped if its component is, or if the component's *set* is."""
    if node.kind is not NodeKind.INSTANCE or node.component_id is None:
        return None
    if node.component_id in index:
        return index[node.component_id]
    component = design.components.get(node.component_id)
    return index.get(component.set_id) if component and component.set_id else None


def build_context_tree(
    design: DesignFile, target_id: str, *, substitute: bool = True
) -> ContextNode:
    """With ``substitute=False`` every node is kept: that is the "pass disabled" baseline."""
    index = mapping_index(design) if substitute else {}

    # Plain recursion is fine here: design trees are shallow (depth 15 in an 18,911-node file).
    def visit(node_id: str, collapsed: bool) -> list[ContextNode]:
        node = design.nodes[node_id]
        if not node.visible:
            return []

        mapping = mapping_for(design, node, index)
        if mapping is not None:
            return [ContextNode(node_id, Role.COMPONENT, mapping, children_of(node, True))]

        if collapsed:
            if node.kind is NodeKind.SLOT:
                content = children_of(node, False)
                return [ContextNode(node_id, Role.SLOT, None, content)] if content else []
            # Internal structure of a code component: drop the node, keep looking beneath it.
            return list(children_of(node, True))

        return [ContextNode(node_id, Role.NODE, None, children_of(node, False))]

    def children_of(node: DesignNode, collapsed: bool) -> tuple[ContextNode, ...]:
        return tuple(kept for child in node.child_ids for kept in visit(child, collapsed))

    target = design.nodes[target_id]
    roots = visit(target_id, False)
    if len(roots) == 1:
        return roots[0]
    # The target itself was invisible or dissolved: keep an explicit root so output is never empty.
    return ContextNode(target.id, Role.NODE, None, tuple(roots))


def walk_context(root: ContextNode):
    """Pre-order traversal yielding ``(node, depth)``."""
    stack: list[tuple[ContextNode, int]] = [(root, 0)]
    while stack:
        node, depth = stack.pop()
        yield node, depth
        stack.extend((child, depth + 1) for child in reversed(node.children))
