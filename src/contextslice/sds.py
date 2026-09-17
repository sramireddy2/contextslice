"""Readers for the vendored ``figma/sds`` repository (git submodule at ``vendor/sds``).

The SDS repo gives us, for free and offline, the two things Figma's API gates behind paid plans:

* ``scripts/tokens/tokens.json``: every Figma variable with its alias chain and per-mode values
  (the Variables REST API is Enterprise-only).
* ``figma.config.json``: Code Connect placeholders mapped to the Figma node id of each component
  (publishing Code Connect needs an Organization plan).
"""

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

_TOKENS_PATH = Path("scripts/tokens/tokens.json")
_CONFIG_PATH = Path("figma.config.json")
_SDS_EXTENSION = "com.figma.sds"


@dataclass(frozen=True)
class SdsToken:
    path: str  # e.g. "@color/background/brand/default"
    figma_id: str  # e.g. "VariableID:9:11199"
    type: str
    modes: dict[str, Any]  # mode name -> literal value, or "{@collection.path}" alias reference

    @property
    def is_alias(self) -> bool:
        return any(isinstance(v, str) and v.startswith("{") for v in self.modes.values())


def load_tokens(sds_root: Path) -> list[SdsToken]:
    """Flatten the nested W3C design-token tree into a list of leaves."""
    tree = json.loads((sds_root / _TOKENS_PATH).read_text(encoding="utf-8"))
    tokens: list[SdsToken] = []

    # Explicit stack instead of recursion: same traversal, no recursion-depth limit.
    stack: list[tuple[tuple[str, ...], Any]] = [((), tree)]
    while stack:
        path, node = stack.pop()
        if not isinstance(node, dict):
            continue
        if "$value" in node:  # a leaf token
            extension = node.get("$extensions", {}).get(_SDS_EXTENSION, {})
            if "figmaId" in extension:
                tokens.append(
                    SdsToken(
                        path="/".join(path),
                        figma_id=extension["figmaId"],
                        type=str(node.get("$type", "")),
                        modes=dict(extension.get("modes", {})),
                    )
                )
            continue
        stack.extend((path + (key,), child) for key, child in node.items())

    return sorted(tokens, key=lambda t: t.path)


def load_code_connect_node_ids(sds_root: Path) -> dict[str, str]:
    """Map each Code Connect placeholder (``<FIGMA_BUTTONS_BUTTON>``) to a Figma node id."""
    config = json.loads((sds_root / _CONFIG_PATH).read_text(encoding="utf-8"))
    substitutions = config.get("codeConnect", {}).get("documentUrlSubstitutions", {})

    node_ids: dict[str, str] = {}
    for placeholder, url in substitutions.items():
        node_id = node_id_from_url(url)
        if node_id is not None:  # entries without ?node-id= are file-level bases, not components
            node_ids[placeholder] = node_id
    return node_ids


def node_id_from_url(url: str) -> str | None:
    """Extract ``node-id`` from a Figma URL in the API's form (``4185-3778`` -> ``4185:3778``)."""
    values = parse_qs(urlparse(url).query).get("node-id")
    if not values:
        return None
    return values[0].replace("-", ":")


def normalize_variable_id(variable_id: str) -> str:
    """Strip the library-key prefix some variable ids carry.

    A variable consumed from a published library appears as ``VariableID:<libraryKey>/9:11199``;
    the local form is ``VariableID:9:11199``. Normalising lets the two be joined.
    """
    prefix, _, rest = variable_id.partition(":")
    return f"{prefix}:{rest.rsplit('/', 1)[-1]}"
