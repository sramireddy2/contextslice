import json

from contextslice import sds


def test_node_id_is_normalised_from_url_form_to_api_form() -> None:
    assert sds.node_id_from_url("https://figma.com/design/KEY?node-id=4185-3778") == "4185:3778"
    assert sds.node_id_from_url("https://figma.com/design/KEY?node-id=9762:1103") == "9762:1103"
    assert sds.node_id_from_url("https://figma.com/design/KEY") is None


def test_variable_id_normalisation_strips_library_prefix() -> None:
    assert sds.normalize_variable_id("VariableID:9:11199") == "VariableID:9:11199"
    assert sds.normalize_variable_id("VariableID:abc123def/9:11199") == "VariableID:9:11199"


def test_load_tokens_flattens_tree_and_detects_aliases(tmp_path) -> None:
    tokens_file = tmp_path / "scripts" / "tokens" / "tokens.json"
    tokens_file.parent.mkdir(parents=True)
    tokens_file.write_text(
        json.dumps(
            {
                "@color_primitives": {
                    "brand": {
                        "500": {
                            "$type": "color",
                            "$value": "#2c2c2c",
                            "$extensions": {
                                "com.figma.sds": {
                                    "figmaId": "VariableID:1:1",
                                    "modes": {"default": "#2c2c2c"},
                                }
                            },
                        }
                    }
                },
                "@color": {
                    "background": {
                        "$type": "color",
                        "$value": "{@color_primitives.brand.500}",
                        "$extensions": {
                            "com.figma.sds": {
                                "figmaId": "VariableID:1:2",
                                "modes": {
                                    "light": "{@color_primitives.brand.500}",
                                    "dark": "#ffffff",
                                },
                            }
                        },
                    }
                },
            }
        ),
        encoding="utf-8",
    )

    tokens = {token.path: token for token in sds.load_tokens(tmp_path)}

    assert set(tokens) == {"@color_primitives/brand/500", "@color/background"}
    assert tokens["@color/background"].is_alias is True
    assert tokens["@color_primitives/brand/500"].is_alias is False
    assert tokens["@color/background"].figma_id == "VariableID:1:2"


def test_load_code_connect_node_ids_skips_file_level_entries(tmp_path) -> None:
    (tmp_path / "figma.config.json").write_text(
        json.dumps(
            {
                "codeConnect": {
                    "documentUrlSubstitutions": {
                        "<FIGMA_BASE>": "https://figma.com/design/KEY",
                        "<FIGMA_BUTTON>": "https://figma.com/design/KEY?node-id=4185-3778",
                    }
                }
            }
        ),
        encoding="utf-8",
    )

    assert sds.load_code_connect_node_ids(tmp_path) == {"<FIGMA_BUTTON>": "4185:3778"}
