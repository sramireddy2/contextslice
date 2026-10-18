"""Rendering helpers for text that ends up inside a prompt.

Shared by the emitter and the lowering pass so that design text is quoted exactly one way.
"""

import json
import re

MAX_TEXT = 200  # longest design string we will put on one line
MAX_NAME = 60

_SIMPLE = re.compile(r"[\w./#-]+")


def quote(text: str, limit: int = MAX_TEXT) -> str:
    """JSON-quote on one line (newlines become ``\\n``) and cap the length.

    Design text is third-party data that lands inside an LLM prompt: quoting keeps it on one
    line so it cannot imitate the bundle's own structure (ADR-0004).
    """
    if len(text) > limit:
        text = text[: limit - 1] + "…"
    return json.dumps(text, ensure_ascii=False)


def bare(text: str) -> str:
    """Leave simple words unquoted (cheaper); quote anything with spaces or punctuation."""
    return text if _SIMPLE.fullmatch(text) else json.dumps(text, ensure_ascii=False)
