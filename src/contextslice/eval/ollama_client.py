"""A minimal client for Ollama's local chat API, with a content-addressed response cache.

Reproducibility comes from the cache, not from the sampler: every response is stored under a
hash of (model, options, prompt, repetition), so re-scoring never re-generates and anyone can
re-run the analysis without the model.

``num_ctx`` is always sent explicitly: Ollama's default context window is small and it
silently truncates prompts that exceed it, which would corrupt the unbudgeted arm without
any error.
"""

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import httpx

from contextslice.eval.prompt import Prompt

DEFAULT_BASE_URL = "http://localhost:11434"
DEFAULT_OPTIONS: dict[str, Any] = {
    "num_ctx": 8192,
    "temperature": 0.2,
    "num_predict": 2000,  # hard cap on output: bounds run time; truncation is recorded
}


@dataclass(frozen=True)
class Generation:
    model: str
    text: str
    prompt_tokens: int
    output_tokens: int
    load_seconds: float
    prompt_seconds: float
    output_seconds: float
    done_reason: str
    cached: bool


class OllamaClient:
    def __init__(
        self,
        base_url: str = DEFAULT_BASE_URL,
        *,
        transport: httpx.BaseTransport | None = None,
        timeout: float = 3600.0,  # a slow CPU generation can take many minutes
    ) -> None:
        self._http = httpx.Client(base_url=base_url, timeout=timeout, transport=transport)

    def chat(self, model: str, prompt: Prompt, options: dict[str, Any]) -> Generation:
        body = {
            "model": model,
            "stream": False,
            "messages": [
                {"role": "system", "content": prompt.system},
                {"role": "user", "content": prompt.user},
            ],
            "options": options,
        }
        response = self._http.post("/api/chat", json=body)
        response.raise_for_status()
        data = response.json()
        return Generation(
            model=str(data.get("model", model)),
            text=data["message"]["content"],
            prompt_tokens=int(data.get("prompt_eval_count", 0)),
            output_tokens=int(data.get("eval_count", 0)),
            load_seconds=data.get("load_duration", 0) / 1e9,
            prompt_seconds=data.get("prompt_eval_duration", 0) / 1e9,
            output_seconds=data.get("eval_duration", 0) / 1e9,
            done_reason=str(data.get("done_reason", "")),
            cached=False,
        )


class ResponseCache:
    """JSON file per response, keyed by a hash of everything that determines the output."""

    def __init__(self, root: Path) -> None:
        self.root = root

    @staticmethod
    def key(model: str, prompt: Prompt, options: dict[str, Any], rep: int) -> str:
        payload = json.dumps(
            {
                "model": model,
                "system": prompt.system,
                "user": prompt.user,
                "options": options,
                "rep": rep,
            },
            sort_keys=True,
            ensure_ascii=False,
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def get(self, key: str) -> Generation | None:
        path = self.root / f"{key}.json"
        if not path.exists():
            return None
        record = json.loads(path.read_text(encoding="utf-8"))
        return Generation(**{**record["generation"], "cached": True})

    def put(
        self, key: str, prompt: Prompt, options: dict[str, Any], generation: Generation
    ) -> None:
        self.root.mkdir(parents=True, exist_ok=True)
        record = {
            "stored_at": datetime.now(UTC).isoformat(timespec="seconds"),
            "options": options,
            "prompt": asdict(prompt),
            "generation": {**asdict(generation), "cached": False},
        }
        (self.root / f"{key}.json").write_text(
            json.dumps(record, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n"
        )


def generate(
    client: OllamaClient,
    cache: ResponseCache,
    model: str,
    prompt: Prompt,
    rep: int,
    options: dict[str, Any] | None = None,
) -> Generation:
    """Cache-first generation: the same (model, prompt, options, rep) is never generated twice."""
    options = {**DEFAULT_OPTIONS, **(options or {}), "seed": 1000 + rep}
    key = cache.key(model, prompt, options, rep)
    hit = cache.get(key)
    if hit is not None:
        return hit
    generation = client.chat(model, prompt, options)
    cache.put(key, prompt, options, generation)
    return generation
