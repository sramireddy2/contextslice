# ContextSlice

**Compile a massive Figma design into the smallest useful context for a coding agent.**

A real design file can hold tens of thousands of nodes, hundreds of components and hundreds of
variables. When a developer asks an agent to *"implement this modal"*, dumping the whole tree into
the prompt is slow, expensive, and often simply does not fit. Figma's own MCP docs quote a
`get_design_context` response of 351,378 tokens against a 25,000-token client cap.

ContextSlice treats this as a **compiler optimization problem**, not a retrieval problem:

```
maximize    ContextUtility(S)
subject to  Tokens(S) <= B          (a hard token budget)
            S is dependency-closed  (no dangling component / variable references)
```

It builds a typed dependency graph of the design and runs a pipeline of analysis passes over it:

| Pass | Technique | Compiler analogy |
|---|---|---|
| Backward slice from the target frame | graph reachability over component + variable edges | program slicing |
| Alias-chain collapse | `button/bg -> brand/500 -> #2c2c2c` becomes one line | copy propagation |
| Code Connect substitution | mapped instance subtree -> import + snippet + props | "signature, not body" |
| Prop lowering | `Variant=Primary` -> `variant="primary"` through the template's own `getEnum` table; unread props dropped | lowering through an ABI |
| Structural dedupe | Merkle + shape hashing of subtrees | value numbering / hash-consing |
| Dominator analysis | "retained tokens": what dropping a node would actually free | heap-profiler retained size |
| Relevance | personalized PageRank restarted at the target | - |
| Budgeted selection | lazy cost-benefit greedy with dependency-aware cost | knapsack with precedence |

There are deliberately **no embeddings and no vector database** anywhere in the selection path.

## Results in one table

Real data: Figma's Simple Design System (18,911 nodes). Target: the `Examples/About` desktop
screen (301 nodes). Exact tokens under the Qwen2.5-Coder tokenizer.

| Stage | Tokens | vs raw |
|---|---|---|
| Raw Figma JSON of the screen | 1,327,910 | 100% |
| P0 normalize (allowlist, drop editor-only fields) | 53,152 | 4.0% |
| Outline format (one line per node) | 7,022 | 0.53% |
| P4 Code Connect substitution + prop lowering | 2,967 | 0.22% |
| P5 structural dedupe | 1,935 | 0.15% |
| P7 budgeted selection, B = 1,000 | 948 | 0.07% |

Generated implementations (8 screens, local 7B model, same prompt, same budget; run
`lower-r1`, October 2026):

| Context given to the model | Component reuse recall | Precision | Figma-vocabulary props | Type errors / file |
|---|---|---|---|---|
| none | 0.11 | 0.26 | 0 | 1.8 |
| flat simplified outline, truncated to 1,000 tokens | 0.13 | 0.32 | 0 | 3.3 |
| **ContextSlice, 1,000 tokens** | **0.53** | **1.00** | **0** | **1.3** |
| ContextSlice, 2,000 tokens | 0.71 | 1.00 | 0 | 0.6 |
| ContextSlice, unbudgeted (1,984 tokens) | 0.75 | 1.00 | 0 | 1.4 |

ContextSlice beat the flat outline on all 8 screens at both budgets (+0.39 recall, 95% CI
[+0.31, +0.50]). Against the September run of the same compiler *before* prop lowering
(re-scored under the same metric), type errors per file fell from 5.9 to 1.3 at B=1000 and from
11.5 to 0.6 at B=2000 (0/7 and 0/8 screens got worse), Figma-vocabulary props went from up to
9.6 per file to zero, precision rose to 1.00 everywhere, and two screens type-check clean at
B=1000, the first ever. PageRank relevance still does *not* measurably beat plain depth-decay at
these budgets. What remains is the model using listed components without importing them and
turning structure words (`Slot`, `Frame`) into tags. Full tables, the pre-registered comparisons
and the limitations are in [docs/eval.md](docs/eval.md).

## Status

A 7-day MVP build, complete. See [docs/ROADMAP.md](docs/ROADMAP.md) for the plan and what is
left, [docs/adr/](docs/adr/) for the reasoning behind each major decision,
[docs/census.md](docs/census.md) for measurements of the corpus and of each pass, and
[docs/eval.md](docs/eval.md) for the evaluation.

- [x] Ingest: one-shot Figma snapshot, committed for offline reproducibility
- [x] `stats`: census of the file (18,911 nodes; one editor-only field is 57% of all bytes)
- [x] IR + typed dependency graph + `slice` (a 443-node page slices in ~2 ms)
- [x] `compile`: exact token counting, outline emitter, Code Connect substitution, pass ledger
      (a 1.33M-token page compiles to 2,967 tokens: 0.22% of raw)
- [x] Structural dedupe (Merkle digests, `xN` folding) + dominator analysis (`explain`:
      retained tokens per subtree, shared vs private definitions)
- [x] Relevance (personalized PageRank, BFS-decay ablation) + budgeted selection (lazy
      cost-benefit greedy with dependency-aware costs) + verifier (`compile --budget B`)
- [x] Evaluation with a local model: 5 arms x 8 screens x 2 budgets, cached and committed
- [x] Prop lowering (P4b): instance lines speak React, not Figma (`<NavigationPill isSelected>
      "Products"`), one consolidated IMPORTS block, layout patterns labelled so they are not
      imported ([ADR-0005](docs/adr/0005-prop-lowering-through-code-connect-templates.md))

## Demo (3 minutes, no Figma account or model needed)

```bash
uv run contextslice stats                              # the file: where the bytes go
uv run contextslice slice --name "about desktop"       # the dependency slice
uv run contextslice compile --name "about desktop"     # the pass ledger + bundle
uv run contextslice compile --name "about desktop" --budget 1000 --show
uv run contextslice explain --name "about desktop"     # retained tokens, shared vs private
uv run contextslice report --run eval/runs/full-r1     # the evaluation tables
```

Reproducing the generations themselves needs [Ollama](https://ollama.com) with
`qwen2.5-coder:7b` and `npm ci` inside `vendor/sds`; every response is cached under
`eval/cache/`, so `contextslice eval` re-scores without regenerating.

## Use it from a coding agent (MCP)

The compiler is also an [MCP](https://modelcontextprotocol.io) server over stdio with two tools,
`find_targets(query)` and `compile_context(target, max_tokens, request)`
([ADR-0006](docs/adr/0006-mcp-server-over-stdio.md)). It needs the optional extra:

```bash
uv sync --extra mcp
```

Register it with Claude Code from the project root (`--scope project` writes a shareable
`.mcp.json`; omit it for a private, per-project entry):

```bash
claude mcp add --scope project contextslice -- uv run --extra mcp contextslice serve
```

The same server for Cursor, in `.cursor/mcp.json` (or `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "contextslice": {
      "type": "stdio",
      "command": "uv",
      "args": ["run", "--extra", "mcp", "contextslice", "serve"]
    }
  }
}
```

Then ask the agent to implement a screen: it calls `find_targets("about desktop")`, then
`compile_context("175:4995", max_tokens=1000)`, and pastes the verified bundle into its own
prompt. Everything human-readable from `serve` goes to stderr; stdout is the protocol.

## Quickstart

Requires [uv](https://docs.astral.sh/uv/) (it manages Python, the virtualenv and the lockfile).

```bash
uv sync                      # create .venv and install locked dependencies
uv run contextslice --help   # CLI
uv run pytest                # tests
uv run ruff check .          # lint
```

## Data & attribution

The evaluation corpus is Figma's [Simple Design System](https://www.figma.com/community/file/1380235722331273046/simple-design-system)
(community file, CC BY 4.0) and its React implementation [figma/sds](https://github.com/figma/sds) (MIT).
Figma is called exactly once to take a snapshot; everything after that runs offline.
