import json

import httpx

from conftest import TOY_SDS
from contextslice.compile import compile_context
from contextslice.eval.arms import expectations_from, truncate_outline
from contextslice.eval.ollama_client import OllamaClient, ResponseCache, generate
from contextslice.eval.prompt import build_prompt
from contextslice.eval.tasks import Task
from contextslice.tokens import ApproxTokenCounter

TASK = Task(id="t", node_id="5:0", name="Checkout", request="Checkout flow.")


def test_prompt_is_identical_across_arms_except_for_the_context_block() -> None:
    with_context = build_prompt(TASK, "## TREE\nFrame")
    without = build_prompt(TASK, None)

    assert with_context.system == without.system
    assert with_context.user.split("Design context")[0] == without.user.split("Design context")[0]
    assert "none is available" in without.user
    assert "## TREE" in with_context.user


def test_generate_uses_the_cache_on_the_second_call(tmp_path) -> None:
    calls = 0

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal calls
        calls += 1
        body = json.loads(request.content)
        assert body["options"]["num_ctx"] == 8192  # always explicit (silent truncation otherwise)
        assert body["options"]["seed"] == 1003
        return httpx.Response(
            200,
            json={
                "model": "m",
                "message": {"role": "assistant", "content": "```tsx\nexport default 1\n```"},
                "prompt_eval_count": 40,
                "eval_count": 9,
                "prompt_eval_duration": 2_000_000_000,
                "eval_duration": 1_000_000_000,
                "load_duration": 0,
                "done_reason": "stop",
            },
        )

    client = OllamaClient(transport=httpx.MockTransport(handler))
    cache = ResponseCache(tmp_path)
    prompt = build_prompt(TASK, None)

    first = generate(client, cache, "m", prompt, rep=3)
    second = generate(client, cache, "m", prompt, rep=3)

    assert calls == 1
    assert first.cached is False and second.cached is True
    assert second.text == first.text and second.prompt_tokens == 40
    assert second.prompt_seconds == 2.0


def test_expectations_come_from_the_unbudgeted_bundle(toy_design) -> None:
    result = compile_context(toy_design, "5:0", ApproxTokenCounter(), sds_root=TOY_SDS)

    expected = expectations_from(result.bundle)

    assert expected.components == {"Button", "IconStar"}


def test_truncate_outline_keeps_whole_lines_and_only_referenced_tokens(toy_design) -> None:
    counter = ApproxTokenCounter()
    flat = compile_context(
        toy_design, "5:0", counter, sds_root=TOY_SDS, substitute=False, dedupe=False
    )
    full_tokens = counter.count(flat.bundle.text)

    small = truncate_outline(flat.bundle, counter, budget=full_tokens - 10)
    tiny = truncate_outline(flat.bundle, counter, budget=counter.count(flat.bundle.header) + 12)

    assert counter.count(small) <= full_tokens - 10
    assert small.splitlines()[-1] in flat.bundle.tree.splitlines()  # no half lines
    assert "## TOKENS" not in tiny or "$" in tiny  # tokens only when a kept line references one
