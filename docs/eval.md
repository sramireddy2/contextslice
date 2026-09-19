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

## Results: full run r1 (8 screens x 5 arms x B in {1000, 2000}, 1 repetition; 2026-09-19)

Run directory: `eval/runs/full-r1/` (contexts, generations, `results.jsonl`, `report.md`).
Regenerate with `uv run contextslice report --run eval/runs/full-r1`.

### Per-arm means (unit = task; 8 tasks per arm)

| arm | reuse recall | reuse precision | tsc missing-name errors | tsc prop/type errors | prompt tokens | prompt-eval s |
|---|---|---|---|---|---|---|
| N (no context) | 0.07 | 0.16 | 6.5 | 1.8 | 243 | 11 |
| F @1000 (flat outline) | 0.11 | 0.23 | 7.6 | 3.2 | 1,234 | 57 |
| F @2000 | 0.16 | 0.28 | 8.5 | 4.4 | 2,210 | 193 |
| S @1000 (compiler, BFS selector) | 0.53 | 0.91 | 16.6 | 10.5 | 1,230 | 96 |
| S @2000 | 0.45 | 0.86 | 11.6 | 9.9 | 2,014 | 89 |
| **C @1000 (ContextSlice)** | **0.48** | **0.89** | 7.1 | 5.9 | 1,226 | 42 |
| **C @2000** | **0.53** | **0.92** | 7.2 | 11.5 | 2,024 | 83 |
| U (unbudgeted compiler) | 0.55 | 0.89 | 18.8 | 9.8 | 2,224 | 120 |

### Pre-registered paired comparisons (difference a - b, 95% bootstrap CI over the 8 tasks)

| comparison | component reuse recall | wins/losses |
|---|---|---|
| C@1000 vs F@1000 | **+0.37** [+0.26, +0.49] | 8/0 |
| C@2000 vs F@2000 | **+0.37** [+0.26, +0.50] | 8/0 |
| C@1000 vs N | +0.42 [+0.28, +0.54] | 8/0 |
| C@1000 vs S@1000 | -0.04 [-0.18, +0.10] | 3/5 |
| C@2000 vs S@2000 | +0.08 [+0.03, +0.14] | 4/0 |
| U vs C@1000 | +0.06 [-0.09, +0.22] | 5/3 |

### What the numbers say

1. **The compiler is what moves component reuse, and it is not subtle.** At the same token
   budget, the compiled context makes the model use 3-4x more of the screen's real design-system
   components than the flat outline (0.48-0.53 vs 0.11-0.16 recall), with precision near 0.9
   versus ~0.25: the flat-outline and no-context arms invent components (`Box`, `Heading`,
   `Icon`, `FaCheckCircle`) that do not exist in SDS. This held on every one of the 8 screens at
   both budgets.
2. **Half the tokens buy almost all of the benefit.** C@1000 reaches 0.48 recall versus 0.55
   unbudgeted, using 55% of the prompt tokens and about a third of the prompt-processing time
   (42 s vs 120 s on this CPU). The difference U - C@1000 is +0.06 with a CI that spans zero.
3. **PageRank versus depth-decay: no consistent difference.** C@1000 vs S@1000 is -0.04 (3/5),
   C@2000 vs S@2000 is +0.08 [+0.03, +0.14] (4/0). With 21-76 lines to choose from, the two
   selectors pick nearly the same lines; the ranking would have to be tested at tighter budgets
   or on larger targets to separate them. This was predicted in advance (see census.md, Day 5)
   and is reported as such rather than dressed up.
4. **Type-check pass rate is 0 in every arm, so it is a floor, not a comparison.** The error
   *kinds* are informative: more context means more real components used, which means more
   *prop/type* errors (1.8 with no context, 5.9-11.5 for the compiled arms), because the 7B model
   copies Figma property names (`Platform="Desktop"`, `HasSubtitle={true}`) onto React components
   instead of translating them through the JSX examples, and uses components it never imported.
   The compiler's context is the right one; the model does not read the COMPONENTS section
   carefully enough. Two concrete follow-ups: emit component lines in React prop vocabulary
   where the Code Connect template makes the mapping explicit, and evaluate with a stronger model.
5. **Design-token adherence was mostly undefined**: when the model composes real components it
   writes almost no style literals, so the metric's denominator is often zero (n = 1-6 tasks per
   comparison). Where defined it is high in all arms (0.6-0.97), and hardcoded values equal to a
   defined token were rare (0.12 per sample at most). The tasks that would exercise it, a
   component built from primitives and tokens, are not in this task set (see limitations).
6. **Latency**: prompt-processing time scales with prompt tokens exactly as expected on a CPU
   (11 s -> 42 s -> 120 s for 243 -> 1,226 -> 2,224 tokens). Total generation time is **not**
   trustworthy in this run: two samples (`product_F2000_r0`, `product_C2000_r0`) took over 25
   minutes for ~750 output tokens, an order of magnitude slower than the rest, which is the
   laptop throttling overnight, not the arm. Compile time itself is 2-3 s per target.

### Limitations (read before quoting any number)

- **n = 8 screens, 1 repetition.** Intervals are wide and sampling variance across seeds is not
  estimated. A second repetition is one command (`--reps 2`; ~3 h of machine time).
- **One small model (7B, CPU).** Absolute quality is low; the claims are about differences
  between arms under identical conditions, not about what a frontier model would do.
- **All screens come from one design system with full Code Connect coverage**, the best case
  for substitution; the "no mappings" regime (P4 off, where an 8k budget binds) was not run.
- **Ground truth for component reuse is the unbudgeted bundle's component set.** It is the
  set of real design-system components the screen is built from, so it is fair to every arm,
  but it rewards naming the right components, not using them with the right props.
- **No visual similarity** (would require executing generated code; ADR-0004), and no human
  judgement of the generated screens.
- The model may have seen `figma/sds` during training (it is public); the N arm's 0.07 recall
  suggests it has not memorised the component API, but this was not controlled.
