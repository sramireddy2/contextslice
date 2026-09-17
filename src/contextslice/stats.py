"""Census of a Figma file snapshot: the measurements that drive every later design decision.

Pure functions over plain dicts (no I/O, no printing), so they are trivial to unit-test.
The CLI is responsible for rendering.
"""

from collections import Counter
from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import Any

from contextslice.figma_json import compact_json, own_properties, variable_alias_ids, walk

Node = dict[str, Any]

# Rough rule of thumb (~4 characters per token). Good enough to *rank* frames and pick a budget;
# the exact model tokenizer replaces it when the emitter lands.
_CHARS_PER_TOKEN = 4


@dataclass(frozen=True)
class FrameStat:
    page: str
    node_id: str
    name: str
    node_type: str
    node_count: int
    instance_count: int
    approx_tokens: int


@dataclass
class Census:
    total_nodes: int = 0
    by_type: Counter[str] = field(default_factory=Counter)
    max_depth: int = 0
    hidden_nodes: int = 0
    instances: int = 0
    instance_sublayers: int = 0  # nodes inlined under an instance (ids look like "I12:3;4:5")
    unresolved_instances: int = 0  # componentId missing from the file's `components` map
    components: int = 0
    component_sets: int = 0
    remote_components: int = 0  # main component lives in another (library) file
    variable_bindings: int = 0
    bound_variable_ids: set[str] = field(default_factory=set)
    # Serialized size of each property summed over all nodes: shows where the tokens really go.
    bytes_by_property: Counter[str] = field(default_factory=Counter)
    node_ids: set[str] = field(default_factory=set)
    frames: list[FrameStat] = field(default_factory=list)


def take_census(document: Node) -> Census:
    components: dict[str, Any] = document.get("components", {})
    census = Census(
        components=len(components),
        component_sets=len(document.get("componentSets", {})),
        remote_components=sum(1 for c in components.values() if c.get("remote")),
    )

    for node, depth in walk(document["document"]):
        census.total_nodes += 1
        census.by_type[node.get("type", "UNKNOWN")] += 1
        census.max_depth = max(census.max_depth, depth)
        census.node_ids.add(node["id"])

        if node.get("visible") is False:
            census.hidden_nodes += 1
        if node["id"].startswith("I"):
            census.instance_sublayers += 1
        if node.get("type") == "INSTANCE":
            census.instances += 1
            if node.get("componentId") not in components:
                census.unresolved_instances += 1

        own = own_properties(node)
        for variable_id in variable_alias_ids(own):
            census.variable_bindings += 1
            census.bound_variable_ids.add(variable_id)
        for key, value in own.items():
            census.bytes_by_property[key] += len(compact_json(value))

    for page in document["document"].get("children", []):
        for frame in _top_level_frames(page):
            census.frames.append(_frame_stat(page.get("name", ""), frame))

    return census


def _top_level_frames(page: Node) -> Iterator[Node]:
    """Children of a page, looking through SECTION containers (which only group frames)."""
    stack = list(reversed(page.get("children", [])))
    while stack:
        node = stack.pop()
        if node.get("type") == "SECTION":
            stack.extend(reversed(node.get("children", [])))
        else:
            yield node


def _frame_stat(page_name: str, frame: Node) -> FrameStat:
    node_count = 0
    instance_count = 0
    for node, _ in walk(frame):
        node_count += 1
        instance_count += node.get("type") == "INSTANCE"

    return FrameStat(
        page=page_name,
        node_id=frame["id"],
        name=frame.get("name", ""),
        node_type=frame.get("type", "UNKNOWN"),
        node_count=node_count,
        instance_count=instance_count,
        approx_tokens=len(compact_json(frame)) // _CHARS_PER_TOKEN,
    )
