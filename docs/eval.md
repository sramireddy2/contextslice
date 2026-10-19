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

## Results: prop-lowering run `lower-r1` (8 screens x 5 arms x B in {1000, 2000}; 2026-10-18)

Same tasks, model, prompt scaffold, seeds and budgets as `full-r1`; the only change is the
compiler (ADR-0005: component lines in React vocabulary, one IMPORTS block, pattern labels,
the selector fixes). The N and F arms do not contain component lines, so their prompts are
byte-identical to September's and their 24 generations came from the cache: they are the control
that the harness still measures the same thing. The September run was re-scored under the current
expected-component set (`contextslice rescore`) so that recall is compared with the same
denominator; its rows appear as `C:r1` etc.

Compare: `uv run contextslice report --run eval/runs/lower-r1 --baseline eval/runs/full-r1-rescored --baseline-label r1`.

### Per-arm means (unit = task; 8 tasks per arm)

| arm | reuse recall | precision | Figma-vocab props | tsc pass | missing / file | type / file | output tokens |
|---|---|---|---|---|---|---|---|
| N | 0.11 | 0.26 | 0 | 0 | 6.5 | 1.8 | 431 |
| F@1000 | 0.13 | 0.32 | 0 | 0 | 7.6 | 3.3 | 661 |
| F@2000 | 0.17 | 0.35 | 0 | 0 | 8.5 | 4.4 | 675 |
| S@1000 | 0.52 | 1.00 | 0 | 0.12 | 13.9 | 0.0 | 828 |
| S@2000 | 0.72 | 1.00 | 0 | 0.12 | 8.5 | 0.4 | 923 |
| **C@1000** | **0.53** | **1.00** | **0** | **0.25** | 10.6 | **1.3** | 475 |
| **C@2000** | **0.71** | **1.00** | **0** | 0.12 | 4.8 | **0.6** | 867 |
| U | 0.75 | 1.00 | 0 | 0 | 16.6 | 1.4 | 987 |
| C:r1@1000 (before) | 0.44 | 0.89 | 0.4 | 0 | 7.1 | 5.9 | 584 |
| C:r1@2000 (before) | 0.48 | 0.91 | 9.6 | 0 | 7.3 | 11.5 | 635 |
| S:r1@1000 (before) | 0.49 | 0.94 | 5.1 | 0 | 16.6 | 10.5 | 704 |
| U:r1 (before) | 0.46 | 0.87 | 9.1 | 0 | 18.8 | 9.8 | 724 |

### Before/after, paired by screen (a - b, 95% bootstrap CI over the 8 tasks)

| comparison | metric | mean diff | 95% CI | wins/losses |
|---|---|---|---|---|
| C@1000 vs C:r1@1000 | tsc_type | -4.62 | [-6.25, -3.00] | 0/7 |
| C@2000 vs C:r1@2000 | tsc_type | -10.88 | [-19.62, -3.50] | 0/8 |
| S@1000 vs S:r1@1000 | tsc_type | -10.50 | [-17.25, -4.88] | 0/8 |
| U vs U:r1 | tsc_type | -8.38 | [-18.75, +0.88] | 1/4 |
| C@1000 vs C:r1@1000 | reuse_recall | +0.09 | [-0.01, +0.20] | 5/2 |
| C@2000 vs C:r1@2000 | reuse_recall | +0.23 | [+0.09, +0.37] | 6/1 |
| U vs U:r1 | reuse_recall | +0.30 | [+0.16, +0.45] | 7/0 |
| C@1000 vs C:r1@1000 | reuse_precision | +0.11 | [+0.05, +0.18] | 5/0 |
| C@2000 vs C:r1@2000 | figma_props | -9.62 | [-21.25, +0.00] | 0/2 |
| C@1000 vs C:r1@1000 | tsc_missing | +3.50 | [-10.62, +17.50] | 6/2 |
| C@2000 vs C:r1@2000 | tsc_missing | -2.50 | [-11.75, +5.62] | 3/5 |

Pre-registered comparisons in this run: C@1000 vs F@1000 recall +0.39 [+0.31, +0.50] (8/0),
precision +0.68 [+0.59, +0.78] (8/0); C vs S recall +0.01 and -0.01 (no difference, as before);
U vs C@1000 recall +0.23 [+0.14, +0.32] (8/0) at 2.4x the generation time.

### What the numbers say

1. **The vocabulary leak is gone and the prop errors went with it.** Capitalised Figma
   properties on component tags: zero in all 40 compiled generations (up to 9.6 per file
   before). Type-class errors per file: 5.9 -> 1.3 at B=1000, 11.5 -> 0.6 at B=2000, 10.5 -> 0.0
   for the BFS arm; no screen got worse in any compiled arm. This is the direct effect of the
   compiler emitting `<Card direction="horizontal" variant="stroke">` instead of
   `<Card Direction=Horizontal Variant=Stroke>`.
2. **Precision is 1.00 in every compiled arm.** When the model imports and uses a component,
   it is now always one the context named. Recall rose too: +0.09 at B=1000 (CI touching zero),
   +0.23 at B=2000, +0.30 unbudgeted. The unbudgeted arm reaches 0.75: the model uses three of
   every four components the screen is built from.
3. **Two screens type-check clean at B=1000 (About, Article), the first non-zero pass rate**;
   Waitlist passes at B=2000 under both selectors and Home under BFS at B=1000. Still a floor
   more than a comparison: the remaining errors are almost all *missing names*, not wrong props.
4. **What is left is the model not following the bundle's conventions.** The missing names fall
   in two classes: real components used without importing them although they are in the IMPORTS
   block (`NavigationPill` 36 occurrences in the C arm, `TextListItem` 36-42 in S and U), and
   structure words turned into tags (`Frame` 24, `Slot` 8-14, `Vector` 5-13). Three generations
   (two at B=2000) have syntax errors from pasting the elision marker into JSX:
   `<Slot name="Slot" (+7 elided) />`. Three `InputField`-family templates compute their imports
   conditionally and had no import line at all. All four are compiler-side fixes (legend wording,
   parsing conditional imports); they were applied after this run and measured as `lower-r2`
   below.
5. **A harness bug was found and fixed by the control arms.** `tsc` reports no semantic
   diagnostics for a program with a syntactic error anywhere, and all 64 files were checked in
   one batch. The first scoring of this run showed the cached N and F files with zero errors
   where the identical files had 6-8 in September. The checker now sets aside files that report
   anything and re-checks the rest (at most three runs). September's numbers were unaffected (no
   generation then had a syntax error), which the re-scored baseline confirms line for line.
6. **PageRank vs BFS: still no difference** (recall +0.01 / -0.01). BFS at B=1000 happens to have
   fewer type errors (0.0 vs 1.3, CI excludes zero) and more missing names; with 8 screens that
   is noise around two selectors that pick nearly the same lines.

Limitations are as for `full-r1`: n = 8, one repetition, one 7B model, one design system with
full Code Connect coverage. Two further caveats: the expected-component set changed between the
runs (it now counts every name the IMPORTS block provides, and excludes layout patterns), which
is why the baseline was re-scored rather than quoted; and the contexts in `eval/runs/lower-r1`
were produced by the compiler at commit `2c0a327`, before the legend and import-parsing changes
described in point 4.

## Results: follow-up run `lower-r2` (same matrix; legend and import fixes; 2026-10-18)

The three compiler-side fixes named in point 4 above (a legend line asking for the IMPORTS block
verbatim, naming Vector/Shape/Group among the structure words, parsing conditional imports) were
measured by re-running the matrix. Selections still use the greedy optimizer (`config.json`:
`"optimizer": "greedy"`); ADR-0007's exact optimizer landed after this run. Two samples were lost
to the laptop sleeping and regenerated by re-running the same command, which reused the other 62
from the cache.

Compare: `uv run contextslice report --run eval/runs/lower-r2 --baseline eval/runs/lower-r1 --baseline-label r1`.

| arm | reuse recall | precision | tsc pass | missing / file | type / file | vs lower-r1: missing, type |
|---|---|---|---|---|---|---|
| N | 0.12 | 0.30 | 0 | 6.5 | 1.8 | (cached, identical) |
| F@1000 | 0.14 | 0.33 | 0 | 7.6 | 3.3 | (cached, identical) |
| S@1000 | 0.48 | 1.00 | **0.62** | **3.6** | 0.1 | 13.9 -> 3.6, 0.0 -> 0.1 |
| S@2000 | 0.71 | 1.00 | 0.12 | 17.6 | 1.1 | 8.5 -> 17.6, 0.4 -> 1.1 |
| C@1000 | 0.50 | 1.00 | 0.12 | **2.4** | 0.8 | 10.6 -> 2.4 [-20.0, -0.25], 1.3 -> 0.8 |
| C@2000 | 0.70 | 1.00 | 0.12 | 15.5 | 0.8 | 4.8 -> 15.5 [-0.75, +28.1], 0.6 -> 0.8 |
| U | 0.75 | 1.00 | 0 | 9.1 | 1.6 | 16.6 -> 9.1, 1.4 -> 1.6 |

(N and F recall differ from `lower-r1` in the second decimal only because the expected-component
set now includes the conditionally imported names; their generations are identical.)

What the numbers say:

1. **At B=1000 the fixes worked.** Missing names per file fell by three quarters in the
   ContextSlice arm and the BFS arm; the BFS arm now type-checks clean on 5 of 8 screens, the
   best pass rate of any arm so far. Structure words turned into tags fell from 51 occurrences
   (`Frame` 24, `Slot` 14, `Vector` 13) to 11 in the ContextSlice arm. The pattern names still
   appear as tags twice each.
2. **At B=2000 the mean went up, and it is one screen.** Waitlist's unbudgeted bundle fits in
   2,000 tokens, so S@2000, C@2000 and U share one generation, and in it the model used
   `TextListItem` 42 times and `NavigationPill`/`TextLinkList`/`TextStrong` without importing any
   of them: 69 missing names in one file, out of 124 in the arm. The IMPORTS block listed every
   one. Means over 8 screens are fragile to a single file like this; the within-run wins/losses
   (4/2 and 2/3) say "no consistent change", which is the honest reading.
3. **Recall and precision did not move** (differences within +-0.04, intervals spanning zero);
   the fixes were aimed at imports and structure words, and that is where the effect is.
4. The remaining failure mode is unchanged in kind: a 7B model that does not copy an import
   block it was told to copy verbatim. The compiler can shorten the distance further (for
   example by placing the import block immediately before the tree), but at some point the
   measurement is of the model, not the context.

Two caveats specific to this run: the laptop idled to sleep twice under it (36-minute and
60-minute stalls visible in Ollama's log), which is why the runner now records a failed sample
and continues; and two generations have syntax errors (`landing_C1000`, `product_C2000`),
which the type-checker now isolates before checking the rest (see `lower-r1`, point 5).

## Results: the no-Code-Connect regime `nosub-r1` (8 screens x N/F/S/C x B in {2000, 4000}; 2026-10-19)

The question: does the selector's value survive when the design system has **no** code
mappings, which is where most real design systems live? P4 (Code Connect substitution) is off
for S, C and U, so the compiled context is the design's own outline, budgeted by the selector;
F is the same outline truncated in tree order; N has nothing. Unbudgeted outlines are 3,716 to
6,368 tokens per screen, so both budgets bind; an unbudgeted arm would overflow the model's
8,192-token window on two screens and was left out. Ground truth for reuse is still the mapped
component set, so recall is comparable with the other runs. First run with the exact optimizer
(ADR-0007). 56 samples, no failures, four hours.

Run: `uv run contextslice eval --no-substitute --arms N,F,S,C --budgets 2000,4000 --out eval/runs/nosub-r1`.

| arm | reuse recall | precision | missing / file | type / file | output tokens | truncated | gen. seconds |
|---|---|---|---|---|---|---|---|
| N | 0.12 | 0.30 | 6.5 | 1.8 | 431 | 0 | 71 |
| F@2000 | 0.18 | 0.38 | 8.5 | 4.4 | 675 | 0 | 521 |
| F@4000 | 0.22 | 0.41 | 12.4 | 8.9 | 1,041 | 0.12 | 417 |
| S@2000 | 0.20 | 0.40 | 23.2 | 8.6 | 1,413 | 0.12 | 332 |
| S@4000 | 0.23 | 0.49 | 6.4 | 4.0 | 1,166 | 0.25 | 419 |
| C@2000 | 0.17 | 0.39 | 15.0 | 4.6 | 948 | 0 | 240 |
| C@4000 | 0.21 | 0.49 | 14.5 | 2.1 | 1,151 | 0.25 | 423 |

Pre-registered comparisons: C@2000 vs F@2000 recall -0.01 [-0.10, +0.08] (3/3); C@4000 vs
F@4000 recall -0.01 [-0.15, +0.11] (4/4), precision +0.08 [-0.08, +0.23], type errors -6.75
[-12.62, -0.12] (1/7); C vs S recall -0.03 and -0.02 (intervals spanning zero); C@4000 vs N
recall +0.09 [+0.03, +0.15], precision +0.20 [+0.03, +0.35].

What the numbers say:

1. **Without mappings, selection buys no component reuse.** The compiled outline and the flat
   truncation are indistinguishable at both budgets (differences of 0.01, wins and losses
   even), and both sit barely above the no-context arm. The selector cannot surface component
   names the context never contained; what little reuse there is comes from the design's own
   layer names and the model's prior.
2. **The load-bearing pass is Code Connect substitution.** In the mapped regime the same
   compiler reaches 0.50-0.75 recall at 1.00 precision; here 0.17-0.23 at 0.39-0.49. The
   selector's contribution, measured separately by the optimality gap (census), is fitting the
   *mapped* context into a budget, not conjuring names. ContextSlice's advantage therefore
   depends on design-to-code mappings existing; for an unmapped system the next lever is
   inferring them (matching Figma component names to code exports), not better selection.
3. **The compiled outline is still a better outline.** At B=4000 it produces fewer wrong-prop
   errors than the flat truncation (2.1 vs 8.9 per file, 1/7) and higher precision, which is
   consistent with it carrying the TOKENS definitions and whole subtrees rather than whatever
   the first 4,000 tokens happened to contain. It also costs more missing names, because the
   model turns more of the structure it sees into invented tags.
4. **Without components the model writes the screen by hand.** Output length is 1.5-2x the
   mapped regime, a quarter of the 4,000-token samples hit the 2,000-token output cap, and
   generation time per sample roughly doubles. Part of the token saving ContextSlice shows in
   the mapped regime is on the *output* side, which no prompt-side measure captures.

Limitations as before (n = 8, one repetition, one 7B model), plus: an unbudgeted outline arm
is missing, so "does more outline help?" is answered only between 2,000 and 4,000 (it does,
slightly: +0.04 recall for both selectors).
