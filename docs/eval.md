# Evaluation design

Goal: measure what generated implementations gain from the context compiler, with and without
it, under identical conditions. Everything here runs offline against the committed snapshot,
a local model, and a cached set of responses (ADR-0003); no generated code is ever executed
(ADR-0004).

## Tasks

Eight real SDS screens (the `Platform=Desktop` variant of each `Examples/*` component set),
listed in [`eval/tasks.json`](../eval/tasks.json) with a one-line request each: About, Landing
Page, Pricing, Product Detail, Contact Us, Waitlist, Article, Home Page.

Ground truth per task comes from the **unbudgeted** bundle: the set of code components it
references (expected component reuse) and the CSS variables it defines (expected tokens). It is
not derived from any budgeted arm, so budgeted arms cannot grade themselves.

## Arms

All arms share one prompt scaffold ([`prompt.py`](../src/contextslice/eval/prompt.py)); only
the design-context block differs.

| Arm | Context | What it isolates |
|---|---|---|
| **N** null | none | what the model already knows about SDS (contamination floor) |
| **F** flat | normalized outline, no substitution/dedupe/selection, truncated in tree order to B | a plain "simplify the JSON" tool |
| **S** slice+BFS | full compiler, breadth-first-decay selector at B | the closure + format, with naive ranking |
| **C** ContextSlice | full compiler, PageRank selector at B | the full pipeline |
| **U** unbudgeted | full compiler, no budget | the upper bound on context |

Budgets B = 1,000 and 2,000 tokens (the unbudgeted About screen is 2,146). Comparisons of
interest: C vs F (does the compiler beat a simplifier at equal budget?), C vs S (does the
relevance ranking matter?), C@1000 vs U (how much does the budget cost?).

## Model and reproducibility

`qwen2.5-coder:7b` through Ollama's local API on a CPU-only laptop (measured: ~22 prompt
tokens/s, ~9 output tokens/s). Options are sent explicitly: `num_ctx` 8192, temperature 0.2,
`num_predict` 2000, `seed` = 1000 + repetition. Every response is cached under a hash of
(model, options, prompt, repetition) in `eval/cache/` and committed, so scoring can be re-run
by anyone without the model.

## Metrics (all static)

| Metric | Source |
|---|---|
| Token usage | Ollama's `prompt_eval_count` (exact) and the bundle's own count |
| Latency | compiler seconds; Ollama `prompt_eval_duration` and `eval_duration` |
| Compile success | one `tsc --noEmit` run over all generated files placed in `vendor/sds/src/generated/`, errors attributed per file and classified: *missing* (hallucinated module/member), *type* (wrong props), *syntax*, *unused* (ignored for pass/fail: lint noise) |
| Component reuse | design-system components imported from the SDS modules **and** used as JSX tags, vs the expected set: recall and precision; plus count of raw `<button>/<input>/...` elements |
| Design-token adherence | `var(--sds-…)` references vs hardcoded hex/px literals; *missed tokens* = a hardcoded value equal to a token the context defined |
| Visual similarity | not in the MVP (would require executing generated code; see ADR-0004 and the roadmap's stretch list) |

The untouched SDS project has 7 pre-existing type errors of its own (a `react-aria-components`
typing drift); they are outside `src/generated/`, never attributed to a sample, and recorded
in each run's `tsc_baseline.json`.

## Run sizes

A generation takes 2–5 minutes on this machine, so: a pilot (1 task, arms N/C/U) to validate
the pipeline end to end, then the full matrix of 8 tasks x (N, F@2, S@2, C@2, U) = 64
generations per repetition, run overnight.
