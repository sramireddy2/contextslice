"""Pass P1: build the typed dependency graph.

One ``networkx.MultiDiGraph`` holds four kinds of vertex (design nodes, variables, styles, code
mappings). Every edge points from the thing that *depends* to the thing it depends *on*, and
carries a ``kind``. "Multi" because two vertices can be linked in more than one way.

The most important design decision is which edge kinds count as dependencies (see
``DEPENDENCY_EDGES``). Get that wrong and a slice either misses things or swallows the file.
"""

from enum import StrEnum

import networkx as nx

from contextslice.ir import DesignFile, NodeKind


class EdgeKind(StrEnum):
    CONTAINS = "CONTAINS"  # parent -> child
    HAS_VARIANT = "HAS_VARIANT"  # component set -> each of its variants
    INSTANCE_OF = "INSTANCE_OF"  # instance -> its main component
    VARIANT_OF = "VARIANT_OF"  # variant component -> its component set
    CORRESPONDS_TO = "CORRESPONDS_TO"  # inlined copy -> the source node it mirrors
    BINDS_VAR = "BINDS_VAR"  # node -> variable
    ALIASES = "ALIASES"  # variable -> variable it aliases (in any mode)
    USES_STYLE = "USES_STYLE"  # node -> shared style
    MAPS_TO_CODE = "MAPS_TO_CODE"  # component / set -> Code Connect mapping


# Edges a slice follows. Two kinds are deliberately excluded:
# * HAS_VARIANT: an instance of Button/Primary reaches the Button *set* through VARIANT_OF (we
#   want the set's code mapping). If the set then "contained" its variants, every sibling variant
#   (Secondary, Danger, ...) would be dragged in. Splitting set->variant into its own non-
#   dependency edge kind stops that leak.
# * CORRESPONDS_TO: useful for diffing a copy against its source later, but not a dependency;
#   the source node is already reachable through INSTANCE_OF + CONTAINS.
DEPENDENCY_EDGES = frozenset(
    {
        EdgeKind.CONTAINS,
        EdgeKind.INSTANCE_OF,
        EdgeKind.VARIANT_OF,
        EdgeKind.BINDS_VAR,
        EdgeKind.ALIASES,
        EdgeKind.USES_STYLE,
        EdgeKind.MAPS_TO_CODE,
    }
)


def style_key(style_id: str) -> str:
    """Style ids look like node ids ("125:20"), so they get a namespace to avoid collisions."""
    return f"style:{style_id}"


def mapping_key(node_id: str, component_name: str) -> str:
    return f"code:{component_name}@{node_id}"


def missing_component_key(component_id: str) -> str:
    return f"component:{component_id}"


def build_graph(design: DesignFile) -> nx.MultiDiGraph:
    graph = nx.MultiDiGraph()

    for node in design.nodes.values():
        graph.add_node(node.id, kind="node", node_kind=node.kind, visible=node.visible)
    for variable in design.variables.values():
        graph.add_node(variable.id, kind="variable", resolved=variable.resolved)

    for node in design.nodes.values():
        containment = (
            EdgeKind.HAS_VARIANT if node.kind is NodeKind.COMPONENT_SET else EdgeKind.CONTAINS
        )
        for child_id in node.child_ids:
            graph.add_edge(node.id, child_id, kind=containment)

        if node.kind is NodeKind.INSTANCE and node.component_id:
            target = node.component_id
            if target not in design.nodes:  # remote library component, or a stale reference
                target = missing_component_key(node.component_id)
                graph.add_node(target, kind="missing_component")
            graph.add_edge(node.id, target, kind=EdgeKind.INSTANCE_OF)

        if node.source_id and node.source_id in design.nodes:
            graph.add_edge(node.id, node.source_id, kind=EdgeKind.CORRESPONDS_TO)

        for binding in node.bindings:
            graph.add_edge(
                node.id, binding.variable_id, kind=EdgeKind.BINDS_VAR, field=binding.field
            )

        for style_type, style_id in node.style_refs:
            graph.add_node(style_key(style_id), kind="style")
            graph.add_edge(node.id, style_key(style_id), kind=EdgeKind.USES_STYLE, field=style_type)

    for component in design.components.values():
        if component.set_id and component.id in design.nodes and component.set_id in design.nodes:
            graph.add_edge(component.id, component.set_id, kind=EdgeKind.VARIANT_OF)

    for variable in design.variables.values():
        for target_id in variable.alias_targets:
            graph.add_edge(variable.id, target_id, kind=EdgeKind.ALIASES)

    for mapping in design.mappings:
        # Anchor on the design node, or on the stub when the component lives in another library
        # (we cannot see inside it, but we still know which code component implements it).
        anchors = (mapping.node_id, missing_component_key(mapping.node_id))
        anchor = next((a for a in anchors if a in graph), None)
        if anchor is not None:
            key = mapping_key(mapping.node_id, mapping.component_name)
            graph.add_node(key, kind="mapping")
            graph.add_edge(anchor, key, kind=EdgeKind.MAPS_TO_CODE)

    return graph
