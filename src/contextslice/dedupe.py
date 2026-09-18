"""Pass P5: structural dedupe of the context tree.

Every node gets a *structural digest*: a hash of its own emitted content plus the digests of its
children (a Merkle tree, the same idea as hash-consing or value numbering in a compiler). Two
subtrees with equal digests would render to identical text, so one bottom-up pass finds every
repeat in O(n) without ever comparing subtrees pairwise.

What we do with a repeat: consecutive identical siblings are folded into the first one with a
repeat count, which the emitter prints as ``xN``. A 3-card grid becomes one card and "x3".

The digest deliberately excludes node ids: two instances of the same component with the same
props are the same *content* even though Figma gives them different ids.
"""

import hashlib
from collections.abc import Iterator
from dataclasses import replace

from contextslice.figma_json import compact_json
from contextslice.ir import DesignFile
from contextslice.substitute import ContextNode


def collapse_repeats(design: DesignFile, root: ContextNode) -> ContextNode:
    """Return an equivalent tree in which runs of identical siblings carry a ``repeat`` count."""
    collapsed, _ = _collapse(design, root)
    return collapsed


def structural_digest(design: DesignFile, node: ContextNode) -> str:
    _, digest = _collapse(design, node)
    return digest


def _collapse(design: DesignFile, node: ContextNode) -> tuple[ContextNode, str]:
    kept: list[ContextNode] = []
    digests: list[str] = []
    for child in node.children:
        new_child, digest = _collapse(design, child)
        if kept and digests[-1] == digest:  # same content as the previous sibling: fold it in
            kept[-1] = replace(kept[-1], repeat=kept[-1].repeat + new_child.repeat)
        else:
            kept.append(new_child)
            digests.append(digest)

    # The digest covers the folded children *with* their counts, so "A x3" != "A x2".
    payload = compact_json(
        [_own_key(design, node), [[d, c.repeat] for d, c in zip(digests, kept, strict=True)]]
    )
    digest = hashlib.sha1(payload.encode("utf-8")).hexdigest()
    return replace(node, children=tuple(kept)), digest


def _own_key(design: DesignFile, node: ContextNode) -> list:
    """Everything about a node that affects its emitted line, and nothing else (no ids)."""
    design_node = design.nodes[node.node_id]
    return [
        node.role.value,
        node.mapping.component_name if node.mapping else None,
        design_node.kind.value,
        design_node.name,
        design_node.component_id,
        design_node.props,
        [[b.field, b.variable_id] for b in design_node.bindings],
        list(design_node.style_refs),
    ]


def folded_nodes(root: ContextNode) -> Iterator[ContextNode]:
    """Nodes whose repeat count folds siblings away (for reporting)."""
    stack = [root]
    while stack:
        node = stack.pop()
        if node.repeat > 1:
            yield node
        stack.extend(node.children)
