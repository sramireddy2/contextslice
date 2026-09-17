"""Shared pytest fixtures."""

import json
from pathlib import Path
from typing import Any

import networkx as nx
import pytest

from contextslice.build_ir import build_design_file
from contextslice.graph import build_graph
from contextslice.ir import DesignFile

FIXTURES = Path(__file__).parent / "fixtures"
TOY_SDS = FIXTURES / "sds"


@pytest.fixture
def toy_document() -> dict[str, Any]:
    """A tiny hand-written Figma file: small enough to verify every expected number by eye."""
    return json.loads((FIXTURES / "toy_file.json").read_text(encoding="utf-8"))


@pytest.fixture
def toy_design(toy_document) -> DesignFile:
    return build_design_file(toy_document, TOY_SDS)


@pytest.fixture
def toy_graph(toy_design) -> nx.MultiDiGraph:
    return build_graph(toy_design)
