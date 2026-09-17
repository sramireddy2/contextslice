from contextslice.figma_json import compact_json
from contextslice.normalize import normalize_props


def test_colors_become_hex_and_floats_are_rounded() -> None:
    props = normalize_props(
        {
            "fills": [
                {"type": "SOLID", "color": {"r": 1.0, "g": 0.9450980424, "b": 0.76078, "a": 1}}
            ],
            "cornerRadius": 16.0,
            "itemSpacing": 12.3456,
        }
    )

    assert props["fills"] == [{"type": "SOLID", "color": "#fff1c2"}]
    assert props["cornerRadius"] == 16  # 16.0 -> 16: shorter, same meaning
    assert props["itemSpacing"] == 12.35


def test_translucent_colors_keep_an_alpha_channel() -> None:
    paint = {"type": "SOLID", "opacity": 0.5, "color": {"r": 0, "g": 0, "b": 0, "a": 1}}

    assert normalize_props({"fills": [paint]})["fills"][0]["color"] == "#00000080"


def test_editor_noise_and_defaults_are_dropped() -> None:
    props = normalize_props(
        {
            "scrollBehavior": "SCROLLS",
            "blendMode": "PASS_THROUGH",
            "absoluteRenderBounds": {"x": 1, "y": 2, "width": 3, "height": 4},
            "constraints": {"vertical": "TOP", "horizontal": "LEFT"},
            "opacity": 1,
            "itemSpacing": 0,
            "strokeWeight": 1.0,  # meaningless: there are no strokes
            "strokes": [],
            "fills": [{"type": "SOLID", "visible": False, "color": {"r": 1, "g": 0, "b": 0}}],
        }
    )

    assert props == {}


def test_size_is_kept_but_canvas_position_is_not() -> None:
    props = normalize_props(
        {"absoluteBoundingBox": {"x": 633.0, "y": 308.0, "width": 574.0, "height": 132.5}}
    )

    assert props == {"size": [574, 132.5]}


def test_component_properties_lose_preferred_values_and_id_suffixes() -> None:
    props = normalize_props(
        {
            "componentProperties": {
                "Icon#7:1": {
                    "type": "INSTANCE_SWAP",
                    "value": "9:9",
                    "preferredValues": [{"type": "COMPONENT", "key": "k"}] * 300,
                }
            }
        }
    )

    assert props["componentProperties"] == {"Icon": {"type": "INSTANCE_SWAP", "value": "9:9"}}
    assert "preferredValues" not in compact_json(props)


def test_text_keeps_characters_and_a_small_style_subset() -> None:
    props = normalize_props(
        {
            "characters": "Pay now",
            "style": {
                "fontFamily": "Inter",
                "fontPostScriptName": "Inter-Regular",
                "fontWeight": 400,
                "fontSize": 16.0,
                "letterSpacing": 0,
                "lineHeightPercent": 100,
            },
        }
    )

    assert props == {
        "characters": "Pay now",
        "textStyle": {"fontFamily": "Inter", "fontWeight": 400, "fontSize": 16},
    }
