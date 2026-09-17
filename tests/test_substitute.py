from dataclasses import replace

from contextslice.build_ir import build_design_file
from contextslice.ir import CodeMapping
from contextslice.substitute import ContextNode, build_context_tree, walk_context

# A Card instance (mapped) whose inlined subtree holds: internal chrome with a display-only text
# layer, a nested Button instance (mapped), a slot with injected content, and an empty slot.
SLOT_DOCUMENT = {
    "name": "Slots",
    "version": "1",
    "components": {
        "10:1": {"key": "k1", "name": "Card", "remote": False},
        "10:5": {"key": "k2", "name": "Button", "remote": False},
    },
    "componentSets": {},
    "styles": {},
    "document": {
        "id": "0:0",
        "type": "DOCUMENT",
        "name": "Doc",
        "children": [
            {
                "id": "0:1",
                "type": "CANVAS",
                "name": "Page",
                "children": [
                    {
                        "id": "20:0",
                        "type": "FRAME",
                        "name": "Screen",
                        "children": [
                            {
                                "id": "20:1",
                                "type": "INSTANCE",
                                "name": "Card",
                                "componentId": "10:1",
                                "children": [
                                    {
                                        "id": "I20:1;10:2",
                                        "type": "FRAME",
                                        "name": "Internal chrome",
                                        "children": [
                                            {
                                                "id": "I20:1;10:3",
                                                "type": "TEXT",
                                                "name": "Heading",
                                                "characters": "shown from a prop",
                                            },
                                            {
                                                "id": "I20:1;10:6",
                                                "type": "INSTANCE",
                                                "name": "CTA",
                                                "componentId": "10:5",
                                                "children": [
                                                    {
                                                        "id": "I20:1;10:6;10:7",
                                                        "type": "TEXT",
                                                        "name": "Label",
                                                        "characters": "Buy",
                                                    }
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        "id": "I20:1;10:4",
                                        "type": "SLOT",
                                        "name": "Body",
                                        "children": [
                                            {
                                                "id": "20:9",
                                                "type": "TEXT",
                                                "name": "Injected",
                                                "characters": "Injected copy",
                                            },
                                            {
                                                "id": "20:10",
                                                "type": "FRAME",
                                                "name": "Injected frame",
                                                "children": [],
                                            },
                                        ],
                                    },
                                    {
                                        "id": "I20:1;10:8",
                                        "type": "SLOT",
                                        "name": "Empty",
                                        "children": [],
                                    },
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
}


def shape(node: ContextNode):
    """Nested tuples are easier to read in an assertion than dataclass reprs."""
    return (node.role.value, node.node_id, [shape(child) for child in node.children])


def slot_design():
    design = build_design_file(SLOT_DOCUMENT)
    return replace(
        design,
        mappings=(
            CodeMapping("10:1", "Card", "", "Card.figma.ts"),
            CodeMapping("10:5", "Button", "", "Button.figma.ts"),
        ),
    )


def test_collapsing_keeps_nested_components_and_slot_content_only() -> None:
    tree = build_context_tree(slot_design(), "20:0")

    assert shape(tree) == (
        "NODE",
        "20:0",
        [
            (
                "COMPONENT",
                "20:1",
                [
                    # internal frame dissolved, display-only text dropped, nested component kept
                    ("COMPONENT", "I20:1;10:6", []),
                    # slot content is the component's children: kept in full, in NORMAL mode
                    (
                        "SLOT",
                        "I20:1;10:4",
                        [("NODE", "20:9", []), ("NODE", "20:10", [])],
                    ),
                    # the empty slot carries no information and is gone
                ],
            )
        ],
    )


def test_with_the_pass_disabled_every_visible_node_is_kept() -> None:
    tree = build_context_tree(slot_design(), "20:0", substitute=False)

    kept = [node.node_id for node, _ in walk_context(tree)]

    # Compare against the IR rather than a hand-counted number: every node here is visible.
    assert sorted(kept) == sorted(slot_design().nodes.keys() - {"0:0", "0:1"})
    assert all(node.role.value == "NODE" for node, _ in walk_context(tree))


def test_hidden_nodes_never_reach_the_context_tree(toy_design) -> None:
    tree = build_context_tree(toy_design, "5:0")

    assert "5:4" not in [child.node_id for child in tree.children]
    assert [child.role.value for child in tree.children] == ["COMPONENT", "COMPONENT", "NODE"]
