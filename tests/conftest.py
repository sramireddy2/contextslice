"""Shared pytest fixtures."""

import json
from pathlib import Path
from typing import Any

import pytest

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture
def toy_document() -> dict[str, Any]:
    """A tiny hand-written Figma file: small enough to verify every expected number by eye."""
    return json.loads((FIXTURES / "toy_file.json").read_text(encoding="utf-8"))
