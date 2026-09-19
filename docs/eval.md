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

## Pilot (1 task, About screen; 2026-09-18)

| Arm | matched components (of 16) | precision | tsc errors |
|---|---|---|---|
| N | 2 | 2/9 | 8 missing |
| C @1000 | 6 | 6/7 | 11 missing |
| U | 7 | 7/7 | 17 missing, 6 type |

Two qualitative findings before any statistics:

1. Without context the model invents components (`Box`, `Heading`, `Grid`, `Logo`), all caught
   by the type checker as *missing*. With context it names real components with the right text.
2. With context, the 7B model copies **Figma** property names straight onto React components
   (`<Header Platform="Desktop">`, `HasSubtitle={true}`) instead of translating them through the
   JSX examples in COMPONENTS, and it uses components it never imported. Both show up as *missing*
   and *type* errors and grow with the amount of context. This is a real weakness of the bundle
   format for a small model, and a concrete direction for a next version of the emitter: render
   component lines in the mapped React prop vocabulary where the template makes the mapping
   explicit, and repeat the import line next to first use.
