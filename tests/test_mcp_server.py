import asyncio

import pytest

pytest.importorskip("mcp")

from conftest import TOY_SDS  # noqa: E402
from contextslice.mcp_server import Workspace, build_server  # noqa: E402
from contextslice.tokens import ApproxTokenCounter  # noqa: E402


@pytest.fixture
def server(toy_design, toy_graph):
    return build_server(Workspace(toy_design, toy_graph, TOY_SDS, ApproxTokenCounter()))


def call(server, name: str, arguments: dict) -> dict:
    """Invoke a tool in-process, the way the SDK would after decoding a JSON-RPC request."""
    result = asyncio.run(server.call_tool(name, arguments))
    assert not result.is_error, result.content
    return result.structured_content


def test_both_tools_are_listed_with_input_and_output_schemas(server) -> None:
    tools = {tool.name: tool for tool in asyncio.run(server.list_tools())}

    assert set(tools) == {"find_targets", "compile_context"}
    assert set(tools["compile_context"].input_schema["properties"]) == {
        "target",
        "max_tokens",
        "request",
        "selector",
    }
    assert tools["compile_context"].output_schema is not None
    assert all(tool.annotations.read_only_hint for tool in tools.values())


def test_find_targets_returns_ids_and_paths(server) -> None:
    found = call(server, "find_targets", {"query": "checkout"})

    assert found["query"] == "checkout"
    assert [t["node_id"] for t in found["targets"]] == ["5:0"]
    assert found["targets"][0]["path"].endswith("Checkout")


def test_compile_by_id_or_by_unique_name_is_verified_under_budget(server) -> None:
    by_id = call(server, "compile_context", {"target": "5-0", "max_tokens": 400})
    by_name = call(server, "compile_context", {"target": "checkout", "max_tokens": 400})

    assert by_id["ok"] and by_id["verified"] and by_id["problems"] == []
    assert by_id["target_id"] == "5:0" == by_name["target_id"]
    assert by_id["tokens"] <= 400 and by_id["budget"] == 400
    assert "## TREE" in by_id["context"] and "## IMPORTS" in by_id["context"]
    assert [row["stage"] for row in by_id["ledger"]][-1].startswith("P7 budgeted selection")
    assert by_id["sections"]["TREE"] > 0 and by_id["tokenizer"]


def test_unbudgeted_compile_has_no_budget_and_no_selection_row(server) -> None:
    result = call(server, "compile_context", {"target": "5:0"})

    assert result["ok"] and result["budget"] is None
    assert not any(row["stage"].startswith("P7") for row in result["ledger"])


def test_unknown_and_ambiguous_targets_are_errors_with_help_not_guesses(server) -> None:
    unknown = call(server, "compile_context", {"target": "nothing like this"})
    missing_id = call(server, "compile_context", {"target": "99:99"})
    ambiguous = call(server, "compile_context", {"target": "variant"})

    assert not unknown["ok"] and "find_targets" in unknown["error"]
    assert not missing_id["ok"] and "99:99" in missing_id["error"]
    assert not ambiguous["ok"] and len(ambiguous["candidates"]) == 2  # the two Button variants
    assert {c["node_id"] for c in ambiguous["candidates"]} == {"1:2", "1:5"}


def test_budgets_are_bounded_and_an_impossible_budget_is_a_structured_error(server) -> None:
    too_small = call(server, "compile_context", {"target": "5:0", "max_tokens": 5})
    impossible = call(server, "compile_context", {"target": "5:0", "max_tokens": 100})
    long_request = call(server, "compile_context", {"target": "5:0", "request": "x" * 5000})

    assert not too_small["ok"] and "between" in too_small["error"]
    assert not impossible["ok"] and "budget" in impossible["error"].lower()
    assert impossible["target_id"] == "5:0"  # the agent still learns what it asked about
    assert not long_request["ok"] and "longer than" in long_request["error"]


def test_schema_rejects_wrong_argument_types_before_the_tool_runs(server) -> None:
    with pytest.raises(Exception, match="validation error"):
        asyncio.run(server.call_tool("compile_context", {"target": 5, "selector": "random"}))
