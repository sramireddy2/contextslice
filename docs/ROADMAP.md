# Roadmap: 7-day MVP

Each step ends with something runnable from the CLI, a passing test suite, and a pushed commit.
**Status (2026-09-19): all seven days delivered.** What remains is listed under *Next* and
*Stretch* below.

## Next (cheap, in order of value)

1. A second repetition of the evaluation (`uv run contextslice eval --reps 2 --out eval/runs/full-r2`,
   ~3 h of machine time) to estimate seed variance.
2. The "no Code Connect" regime: the same matrix with substitution off (`compile --no-substitute`),
   where budgets of 4k-8k actually bind and where most real design systems live.
3. Emit component lines in React prop vocabulary where the Code Connect template's `getEnum` /
   `getString` calls make the mapping explicit, to stop the model copying Figma prop names.
4. Tighter budgets (500) and multi-screen targets to test whether PageRank ever beats depth decay.

| Day | Step | Deliverable | CS concept |
|---|---|---|---|
| 1 | **Setup** | repo, uv, lint/test tooling, ADRs | reproducible builds, lockfiles |
| 1 | **Ingest** | one-shot Figma snapshot to disk; `contextslice stats` census (node/component/variable counts, per-frame token sizes) | API rate limits, caching, offline-first |
| 2 | **IR + graph + slice** | source-agnostic IR; typed dependency multigraph; `contextslice slice --node` | intermediate representations, program slicing as reachability |
| 3 | **First compile** | token counter, emitter, Code Connect substitution, per-pass token ledger; `contextslice compile` | compiler passes, copy propagation |
| 4 | **Dedupe + dominators** | Merkle/shape hashing; retained-token analysis; `contextslice explain` | hash-consing, dominator trees |
| 5 | **Select under budget** | personalized PageRank relevance; lazy greedy selection; exact `Tokens <= B` verifier | PageRank, knapsack with dependencies, submodularity |
| 6 | **Eval harness** | local-model runner (Ollama) with a response cache; baseline arms; static metrics | experimental design, caching, AST analysis |
| 7 | **Results** | full eval run, results tables/plots, write-up, demo | paired comparisons, honest reporting |

## Evaluation arms (all at the same budget B, same prompt scaffold)

- **A - raw**: target subtree JSON, truncated to B
- **F - simplified**: rule-pruned subtree + only the variables/mappings it uses (roughly what existing tools give you)
- **S - slice+BFS**: our dependency closure with a naive breadth-first selector (isolates the optimizer's value)
- **C - ContextSlice**: the full compiler
- **U - unbudgeted**: upper bound

## Metrics

| Metric | MVP | How |
|---|---|---|
| Token usage | yes | exact prompt tokens reported by the model runtime |
| Compile success | yes | `esbuild` bundle + `tsc --noEmit` against the real SDS types (never executes generated code) |
| Design-token adherence | yes | static analysis: `var(--sds-*)` references vs hardcoded hex/px literals |
| Component reuse | yes | imports of SDS components vs re-implemented raw `<button>`/`<input>` markup |
| Latency | yes | compiler time per pass; prompt-eval time; generation time |
| Visual similarity | stretch | needs rendering generated code, which means a Docker sandbox (see ADR-0004) |

## Stretch (in order)

0. Named templates for *non-adjacent* repeated subtrees (`@T1` defined once, referenced
   later). Measured on Day 4: 0% / 3% extra savings on single-screen targets (About, Dialog),
   but 8-16% on two-variant sets that contain both desktop and mobile. Deferred because the
   evaluation targets are single screens.
1. Visual similarity via a no-network Docker + Playwright render worker
2. Synthetic scaler: replicate real SDS screens to ~72 screens / ~17k nodes for LLM-free latency + budget-guarantee stress tests
3. Exact ILP reference solver (`scipy.optimize.milp`) to measure the greedy selector's optimality gap
4. MCP server wrapper exposing `compile_context(target, maxTokens)`
5. Hand-written Cooper-Harvey-Kennedy dominators, property-tested against NetworkX
