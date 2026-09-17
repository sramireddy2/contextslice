"""Resolve a human query ("about desktop") to candidate target nodes.

Deliberately simple and deterministic: token-substring matching over node *paths*, no
embeddings, no LLM. An explicit node id always wins; when a name is ambiguous the caller gets
the candidates back and must choose, rather than the tool guessing.
"""

from contextslice.ir import DesignFile, DesignNode, NodeKind

# Things a developer would plausibly ask to implement: a frame-like node that sits directly
# under a page or section, or a variant inside a component set.
_TARGET_KINDS = frozenset(
    {NodeKind.FRAME, NodeKind.COMPONENT, NodeKind.COMPONENT_SET, NodeKind.INSTANCE}
)
_CONTAINER_KINDS = frozenset({NodeKind.PAGE, NodeKind.SECTION, NodeKind.COMPONENT_SET})


def find_targets(design: DesignFile, query: str, limit: int = 10) -> list[DesignNode]:
    terms = query.lower().split()
    if not terms:
        return []

    matches: list[tuple[tuple[bool, int, str], DesignNode]] = []
    for node in design.nodes.values():
        if node.kind not in _TARGET_KINDS or node.inlined or not node.visible:
            continue
        parent = design.nodes.get(node.parent_id or "")
        if parent is None or parent.kind not in _CONTAINER_KINDS:
            continue

        path = design.path_of(node.id)
        lowered = path.lower()
        if all(term in lowered for term in terms):
            exact = node.name.lower() == query.lower()
            matches.append(((not exact, len(path), node.id), node))  # exact first, then shortest

    return [node for _, node in sorted(matches, key=lambda match: match[0])[:limit]]
