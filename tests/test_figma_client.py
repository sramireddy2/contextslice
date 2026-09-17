"""The client is tested against httpx.MockTransport: real request/response objects, no network."""

import httpx
import pytest

from contextslice.ingest.figma_client import (
    FigmaAuthError,
    FigmaClient,
    FigmaNotFoundError,
    FigmaRateLimitedError,
)

SECRET = "figd_super-secret-token"


def client_with(handler) -> FigmaClient:
    return FigmaClient(SECRET, transport=httpx.MockTransport(handler))


def test_download_streams_body_into_sink_and_sends_token_header() -> None:
    seen: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, content=b'{"name": "x"}')

    chunks: list[bytes] = []
    with client_with(handler) as client:
        total = client.download_file_json("abc123", chunks.append)

    assert b"".join(chunks) == b'{"name": "x"}'
    assert total == len(b'{"name": "x"}')
    assert seen[0].url.path == "/v1/files/abc123"
    assert seen[0].headers["X-Figma-Token"] == SECRET
    assert SECRET not in str(seen[0].url)  # secrets never go in URLs


def test_rate_limit_raises_with_diagnostics_and_never_retries() -> None:
    calls = 0

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal calls
        calls += 1
        return httpx.Response(
            429,
            headers={
                "Retry-After": "396749",
                "X-Figma-Plan-Tier": "starter",
                "X-Figma-Rate-Limit-Type": "low",
            },
            json={"status": 429, "err": "Rate limit exceeded"},
        )

    with client_with(handler) as client, pytest.raises(FigmaRateLimitedError) as raised:
        client.download_file_json("abc123", lambda chunk: None)

    assert calls == 1  # the whole point: a retry would only burn scarce quota
    assert raised.value.retry_after_seconds == 396749
    assert raised.value.plan_tier == "starter"
    assert "4.6 days" in str(raised.value)


@pytest.mark.parametrize(("status", "expected"), [(403, FigmaAuthError), (404, FigmaNotFoundError)])
def test_http_errors_map_to_typed_exceptions_without_leaking_the_token(status, expected) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(status, json={"status": status, "err": "nope"})

    with client_with(handler) as client, pytest.raises(expected) as raised:
        client.download_file_json("abc123", lambda chunk: None)

    assert "nope" in str(raised.value)
    assert SECRET not in str(raised.value)
