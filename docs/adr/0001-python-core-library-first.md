# ADR-0001: Python core, NetworkX, library-first

**Status:** accepted (2026-09-17)

## Context

The heart of the project is graph algorithms (reachability, dominators, PageRank, hashing,
budgeted selection) plus an evaluation harness with statistics. The builder has about one week.
Candidate languages: Python, TypeScript (Figma's ecosystem language), Rust (speed).

## Decision

- Python 3.13 for the compiler, the eval orchestration and all scoring.
- NetworkX as the graph library. Use its implementations first (`descendants`,
  `immediate_dominators`, `pagerank`); hand-write an algorithm only after the pipeline works
  end to end, and property-test it against the library version.
- Node.js appears only where the JS ecosystem is unavoidable: type-checking and bundling the
  *generated* TSX during evaluation.

## Consequences

- (+) Every needed algorithm exists as a tested oracle, so correctness bugs are cheap to find.
- (+) One language for algorithms and statistics; fastest path to a first end-to-end result.
- (-) Cannot run inside a Figma plugin or merge into Figma's TypeScript tooling as-is.
- (-) Pure-Python graph code is slow at ~17k nodes. Mitigation: measure first; NetworkX calls can
  be swapped for rustworkx behind the same interface if latency demands it.
- TypeScript was rejected mainly because its main graph library (graphology) has no dominators or
  personalized PageRank, so everything would be hand-written on day one.
