"""Pass P0, normalization: keep only the properties a code generator can use.

This is an **allowlist**, not a denylist. A denylist silently lets every new or unknown Figma
field through (that is how a 35 MB ``preferredValues`` payload ends up in a prompt); an allowlist
makes the IR a small, explicit language, and adding a property is a deliberate decision.

Also applied here:
* default elision: values an LLM would assume anyway (opacity 1, no strokes, ...) are dropped;
* colours become hex strings, floats are rounded, invisible paints are removed.
"""

from typing import Any

Raw = dict[str, Any]

_LAYOUT_KEYS = (
    "layoutMode",
    "layoutWrap",
    "itemSpacing",
    "counterAxisSpacing",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "primaryAxisAlignItems",
    "counterAxisAlignItems",
    "layoutSizingHorizontal",
    "layoutSizingVertical",
    "layoutPositioning",
    "minWidth",
    "maxWidth",
    "minHeight",
    "maxHeight",
    "clipsContent",
)
_PAINT_KEYS = ("cornerRadius", "rectangleCornerRadii", "opacity")
_TEXT_STYLE_KEYS = (
    "fontFamily",
    "fontWeight",
    "fontSize",
    "lineHeightPx",
    "letterSpacing",
    "textAlignHorizontal",
    "textCase",
    "textDecoration",
)

# Values that carry no information because they are what anyone would assume.
_DEFAULTS: dict[str, Any] = {
    "layoutWrap": "NO_WRAP",
    "layoutPositioning": "AUTO",
    "clipsContent": False,
    "opacity": 1,
    "cornerRadius": 0,
    "itemSpacing": 0,
    "counterAxisSpacing": 0,
    "paddingLeft": 0,
    "paddingRight": 0,
    "paddingTop": 0,
    "paddingBottom": 0,
    "letterSpacing": 0,
    "textCase": "ORIGINAL",
    "textDecoration": "NONE",
}


def normalize_props(raw: Raw) -> Raw:
    """Return the emit-relevant subset of a raw Figma node's properties."""
    props: Raw = {}

    for key in (*_LAYOUT_KEYS, *_PAINT_KEYS):
        if key in raw:
            _put(props, key, _round(raw[key]))

    box = raw.get("absoluteBoundingBox")
    if box:
        # Absolute x/y is canvas position: meaningless in code. Size is kept.
        props["size"] = [_round(box.get("width", 0)), _round(box.get("height", 0))]

    _put(props, "fills", _paints(raw.get("fills")))
    strokes = _paints(raw.get("strokes"))
    if strokes:  # strokeWeight without a stroke is noise
        props["strokes"] = strokes
        _put(props, "strokeWeight", _round(raw.get("strokeWeight")))
    _put(props, "effects", _effects(raw.get("effects")))

    if "characters" in raw:
        props["characters"] = raw["characters"]
        style = raw.get("style", {})
        _put(
            props,
            "textStyle",
            _defaults_removed({k: _round(style[k]) for k in _TEXT_STYLE_KEYS if k in style}),
        )

    _put(props, "componentProperties", _component_properties(raw.get("componentProperties")))
    _put(
        props, "propertyDefinitions", _property_definitions(raw.get("componentPropertyDefinitions"))
    )
    _put(props, "propertyReferences", raw.get("componentPropertyReferences"))

    return _defaults_removed(props)


def _component_properties(properties: Raw | None) -> Raw:
    """Keep each property's type and value; drop ``preferredValues`` (57% of the raw file).

    SLOT-typed properties are dropped too: their value is an opaque editor GUID, and the slot's
    real content is already visible as the SLOT node's children.
    """
    return {
        _property_name(name): {"type": prop.get("type"), "value": prop.get("value")}
        for name, prop in (properties or {}).items()
        if prop.get("type") != "SLOT"
    }


def _property_definitions(definitions: Raw | None) -> Raw:
    kept = ("type", "defaultValue", "variantOptions")
    return {
        _property_name(name): {k: definition[k] for k in kept if k in definition}
        for name, definition in (definitions or {}).items()
    }


def _property_name(name: str) -> str:
    """``Label#348:1`` -> ``Label``: the ``#id`` suffix only disambiguates inside Figma."""
    return name.split("#", 1)[0]


def _paints(paints: list[Raw] | None) -> list[Raw]:
    result = []
    for paint in paints or []:
        if paint.get("visible") is False:
            continue
        simple: Raw = {"type": paint.get("type")}
        if "color" in paint:
            simple["color"] = _hex(paint["color"], paint.get("opacity", 1))
        if "gradientStops" in paint:
            simple["stops"] = [
                [_round(stop.get("position")), _hex(stop["color"])]
                for stop in paint["gradientStops"]
            ]
        if paint.get("type") == "IMAGE":
            simple["scaleMode"] = paint.get("scaleMode")
        result.append(simple)
    return result


def _effects(effects: list[Raw] | None) -> list[Raw]:
    result = []
    for effect in effects or []:
        if effect.get("visible") is False:
            continue
        simple: Raw = {"type": effect.get("type"), "radius": _round(effect.get("radius"))}
        if "color" in effect:
            simple["color"] = _hex(effect["color"])
        if "offset" in effect:
            simple["offset"] = [
                _round(effect["offset"].get("x")),
                _round(effect["offset"].get("y")),
            ]
        _put(simple, "spread", _round(effect.get("spread")))
        result.append(simple)
    return result


def _hex(color: Raw, opacity: float = 1) -> str:
    """Figma's 0..1 float RGBA -> ``#rrggbb`` (or ``#rrggbbaa`` when translucent)."""
    channels = [round(color.get(c, 0) * 255) for c in ("r", "g", "b")]
    alpha = round(color.get("a", 1) * opacity * 255)
    text = "#" + "".join(f"{c:02x}" for c in channels)
    return text if alpha == 255 else f"{text}{alpha:02x}"


def _round(value: Any) -> Any:
    """2 decimals is below anything visible; it also turns 16.0 into 16."""
    if isinstance(value, bool) or not isinstance(value, float):
        return value
    rounded = round(value, 2)
    return int(rounded) if rounded == int(rounded) else rounded


def _put(target: Raw, key: str, value: Any) -> None:
    """Set ``key`` only when the value carries information (not None / empty)."""
    if value is None or value == [] or value == {}:
        return
    target[key] = value


def _defaults_removed(props: Raw) -> Raw:
    return {k: v for k, v in props.items() if not (k in _DEFAULTS and v == _DEFAULTS[k])}
