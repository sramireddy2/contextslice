# ADR-0003: Evaluate with free local models (Ollama)

**Status:** accepted (2026-09-17)

## Context

The evaluation generates React code with and without the compiler. Options were a paid hosted
API (roughly $15-30 for the full matrix) or free local inference. The build machine has 32 GB RAM,
an Intel Core Ultra 7 258V and an integrated Arc GPU: no discrete NVIDIA card, so inference is
CPU/iGPU-bound.

## Decision

- Run generation through Ollama's local HTTP API. Model is chosen on eval day by a measured
  tokens/second benchmark on this machine. Candidates: a small-active-parameter mixture-of-experts
  coder model (fast on CPU for its quality) with a 7B dense coder model as the fallback.
- Always set the context window (`num_ctx`) explicitly. Ollama silently truncates prompts that
  exceed it, which would corrupt the unbudgeted and raw-dump arms without any error.
- Count tokens exactly and offline with the target model's own tokenizer (Hugging Face
  `tokenizers`), behind a `TokenCounter` interface. Cross-check against the `prompt_eval_count`
  that Ollama reports for each request.
- Cache every response on disk, keyed by a hash of (model, parameters, prompt, repetition index).

## Consequences

- (+) Zero cost, fully reproducible, no API key for reviewers.
- (+) On CPU, prompt tokens translate directly into seconds of prefill, so the latency metric
  shows the benefit of a smaller context very visibly.
- (+) Small local models have small practical context windows: the setting where a context
  compiler matters most.
- (-) Generations take minutes, not seconds. The eval matrix must stay small (about 8 tasks x
  4-5 arms x 2 repetitions) and run overnight; the response cache makes re-scoring free.
- (-) Weaker models than frontier APIs: absolute quality numbers will be lower. The claim is
  about the *difference between arms*, not absolute quality.
