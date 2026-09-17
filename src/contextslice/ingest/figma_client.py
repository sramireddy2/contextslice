"""Minimal Figma REST client: one endpoint, streamed, and deliberately *no retries*.

Why no retries? Figma's file endpoint is "Tier 1" rate-limited, and depending on plan/seat the
quota can be tiny, with ``Retry-After`` values reported in the range of *days*. Exponential
backoff is the right reflex for transient failures; here a retry can only burn scarce quota or
sleep for days. So on HTTP 429 we surface the server's headers and stop (see ADR-0002).
"""

from collections.abc import Callable
from types import TracebackType

import httpx

FIGMA_API_BASE = "https://api.figma.com"

# Exporting a whole file can take minutes server-side, so the read timeout is generous;
# connect stays short so a dead network fails fast instead of hanging.
DEFAULT_TIMEOUT = httpx.Timeout(connect=10.0, read=300.0, write=30.0, pool=10.0)


class FigmaError(Exception):
    """Base class for every error this client raises."""


class FigmaAuthError(FigmaError):
    """HTTP 403: bad/expired token, missing scope, or no access to the file."""


class FigmaNotFoundError(FigmaError):
    """HTTP 404: the file key does not exist (or is not visible to this token)."""


class FigmaRateLimitedError(FigmaError):
    """HTTP 429. Carries the diagnostic headers Figma sends so the caller can show them."""

    def __init__(
        self,
        *,
        retry_after_seconds: int | None,
        plan_tier: str | None,
        rate_limit_type: str | None,
        upgrade_link: str | None,
    ) -> None:
        self.retry_after_seconds = retry_after_seconds
        self.plan_tier = plan_tier
        self.rate_limit_type = rate_limit_type
        self.upgrade_link = upgrade_link
        super().__init__(
            f"Rate limited by Figma (retry after {_humanize_seconds(retry_after_seconds)}; "
            f"plan tier: {plan_tier or 'unknown'}; limit type: {rate_limit_type or 'unknown'})."
        )


class FigmaClient:
    """Thin wrapper over ``httpx.Client``.

    ``transport`` is injectable so tests can substitute ``httpx.MockTransport`` and never touch
    the network (dependency injection).
    """

    def __init__(
        self,
        token: str,
        *,
        transport: httpx.BaseTransport | None = None,
        timeout: httpx.Timeout = DEFAULT_TIMEOUT,
    ) -> None:
        # The token travels in a header, never in the URL: URLs end up in logs and proxies.
        self._http = httpx.Client(
            base_url=FIGMA_API_BASE,
            headers={"X-Figma-Token": token},
            timeout=timeout,
            transport=transport,
        )

    def __enter__(self) -> "FigmaClient":
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        self.close()

    def close(self) -> None:
        self._http.close()

    def download_file_json(self, file_key: str, sink: Callable[[bytes], object]) -> int:
        """Stream ``GET /v1/files/:key`` into ``sink`` chunk by chunk; return total bytes.

        Streaming keeps memory flat no matter how big the file is: we never hold the whole
        response body in RAM. ``iter_bytes`` yields *decoded* content (gzip transfer encoding
        is already undone), i.e. the JSON text itself.
        """
        with self._http.stream("GET", f"/v1/files/{file_key}") as response:
            if response.status_code != 200:
                response.read()  # error bodies are small; needed to extract the message
                raise _error_for(response)

            total = 0
            for chunk in response.iter_bytes():
                sink(chunk)
                total += len(chunk)
            return total


def _error_for(response: httpx.Response) -> FigmaError:
    """Map an HTTP error response to a typed exception with an actionable message."""
    detail = _error_message(response)
    status = response.status_code

    if status == 429:
        headers = response.headers
        retry_after = headers.get("Retry-After")
        return FigmaRateLimitedError(
            retry_after_seconds=int(retry_after) if retry_after and retry_after.isdigit() else None,
            plan_tier=headers.get("X-Figma-Plan-Tier"),
            rate_limit_type=headers.get("X-Figma-Rate-Limit-Type"),
            upgrade_link=headers.get("X-Figma-Upgrade-Link"),
        )
    if status == 403:
        return FigmaAuthError(
            f"Figma rejected the token (403: {detail}). Check that it has not expired and has "
            "the 'File content: read' scope."
        )
    if status == 404:
        return FigmaNotFoundError(
            f"File not found (404: {detail}). Use the key of YOUR duplicated copy: community "
            "files cannot be read directly through the API."
        )
    if status == 400:
        return FigmaError(
            f"Bad request (400: {detail}). If this mentions a timeout, the file is too large "
            "for one request and must be fetched page by page."
        )
    return FigmaError(f"Unexpected response from Figma ({status}: {detail}).")


def _error_message(response: httpx.Response) -> str:
    try:
        body = response.json()
    except ValueError:
        return response.reason_phrase or "no details"
    if isinstance(body, dict):
        return str(body.get("err") or body.get("message") or "no details")
    return "no details"


def _humanize_seconds(seconds: int | None) -> str:
    if seconds is None:
        return "an unknown time"
    if seconds < 120:
        return f"{seconds}s"
    if seconds < 7200:
        return f"{seconds // 60} min"
    if seconds < 172800:
        return f"{seconds / 3600:.1f} h"
    return f"{seconds / 86400:.1f} days"
