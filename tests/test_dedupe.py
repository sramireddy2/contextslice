from dataclasses import replace

from contextslice.build_ir import build_design_file
from contextslice.dedupe import collapse_repeats, folded_nodes, structural_digest
from contextslice.emit import emit
from contextslice.ir import CodeMapping
from contextslice.substitute import build_context_tree, walk_context


def card(instance_id: str, label: str) -> dict:
    """A mapped Card instance whose slot holds one text node."""
    return {
        "id": instance_id,
        "type": "INSTANCE",
        "name": "Card",
        "componentId": "10:1",
        "componentProperties": {"Heading#1:0": {"type": "TEXT", "value": label}},
        "children": [
            {
                "id": f"I{instance_id};10:4",
                "type": "SLOT",
                "name": "Body",
                "children": [
                    {
                        "id": f"I{instance_id};10:9",
                        "type": "TEXT",
                        "name": "Body",
                        "characters": "Body copy",
                    }
                ],
            }
        ],
    }


def grid_design(labels: list[str]):
    document = {
        "name": "Grid",
        "version": "1",
        "components": {"10:1": {"key": "k", "name": "Card", "remote": False}},
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
                            "name": "Grid",
                            "children": [
                                card(f"20:{i + 1}", label) for i, label in enumerate(labels)
                            ],
                        }
                    ],
                }
            ],
        },
    }
    design = build_design_file(document)
    return replace(design, mappings=(CodeMapping("10:1", "Card", "", "Card.figma.ts"),))


def test_identical_consecutive_siblings_fold_into_one_with_a_count() -> None:
    design = grid_design(["Title", "Title", "Title"])

    tree = collapse_repeats(design, build_context_tree(design, "20:0"))

    assert [child.repeat for child in tree.children] == [3]
    assert [node.node_id for node in folded_nodes(tree)] == ["20:1"]  # first occurrence survives


def test_a_different_prop_breaks_the_run() -> None:
    design = grid_design(["Title", "Title", "Other", "Title"])

    tree = collapse_repeats(design, build_context_tree(design, "20:0"))

    assert [child.repeat for child in tree.children] == [2, 1, 1]


def test_digests_ignore_ids_but_see_every_emitted_detail() -> None:
    same = grid_design(["Title", "Title"])
    tree = build_context_tree(same, "20:0")
    first, second = tree.children

    assert first.node_id != second.node_id
    assert structural_digest(same, first) == structural_digest(same, second)
    differ = grid_design(["Title", "Different"]).nodes
    assert structural_digest(same, first) != structural_digest(
        replace(same, nodes=differ),
        build_context_tree(replace(same, nodes=differ), "20:0").children[1],
    )


def test_folded_trees_emit_a_count_and_fewer_lines() -> None:
    design = grid_design(["Title"] * 3)
    full = build_context_tree(design, "20:0")
    folded = collapse_repeats(design, full)

    bundle = emit(design, folded)

    assert '  <Card Heading="Title"> x3' in bundle.tree.splitlines()
    assert sum(1 for _ in walk_context(folded)) < sum(1 for _ in walk_context(full))
    assert bundle.tree.count("Slot") == 1  # the folded siblings' subtrees are not printed


def test_collapsing_is_idempotent() -> None:
    design = grid_design(["Title"] * 4)
    once = collapse_repeats(design, build_context_tree(design, "20:0"))

    assert collapse_repeats(design, once) == once
