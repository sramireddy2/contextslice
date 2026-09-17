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
| Structural dedupe | Merkle + shape hashing of subtrees | value numbering / hash-consing |
| Dominator analysis | "retained tokens": what dropping a node would actually free | heap-profiler retained size |
| Relevance | personalized PageRank restarted at the target | - |
| Budgeted selection | lazy cost-benefit greedy with dependency-aware cost | knapsack with precedence |

There are deliberately **no embeddings and no vector database** anywhere in the selection path.

## Status

Day 1 of a 7-day MVP build. See [docs/ROADMAP.md](docs/ROADMAP.md) for the plan and
[docs/adr/](docs/adr/) for the reasoning behind each major decision.

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
