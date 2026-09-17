# Census of the corpus (Day 1 measurements)

Output of `contextslice stats` on our snapshot of Figma's Simple Design System (community file,
CC BY 4.0), taken 2026-09-17. These numbers drive the compiler's design, so they are recorded here.

| Measure | Value |
|---|---|
| Raw API response | 60.7 MB JSON (14.0 MB gzipped), fetched with **one** request in ~14 s |
| Nodes | 18,911 (max depth 15), across 30 pages and 2,280 top-level frames |
| Components / component sets | 2,083 / 80 (none remote) |
| Instances | 5,138 (all resolve to a component in the file) |
| Nodes that are inlined copies under an instance | 12,121 (**64%** of all nodes) |
| Hidden nodes | 1,501 (8%) |
| Variable bindings | 72,646, onto only 232 distinct variables |

## What this tells us

1. **The real file is already at the scale of the brief** (about 17k nodes), so no synthetic
   scaling is needed for the core story.
2. **Nothing fits raw.** A single example page (`Examples/About`, 593 nodes) is roughly
   1.1 million tokens of raw JSON; even a Dialog frame is ~137k. An 8k budget binds hard.
3. **One field is 57% of all bytes.** `componentProperties[*].preferredValues` totals 34.6 MB.
   It is an editor hint (the list of components Figma suggests when swapping an instance, e.g.
   all ~290 icons), repeated on every instance, and carries nothing a code generator needs.
   Dropping it in the normalization pass is the single cheapest win, before any graph
   algorithm runs. Lesson: measure before optimizing.
4. **64% of nodes are instance copies.** Every use of a component repeats its whole subtree.
   This is exactly what Code Connect substitution and structural dedupe are for.
5. **72,646 bindings onto 232 variables**: heavy sharing. Variables must be emitted once in a
   definitions section, never inline per use.
6. **The offline joins hold** (ADR-0002's assumption, now verified):
   - Code Connect node ids found in the snapshot: 96 / 96 (100%).
   - Bound variables found in `tokens.json`: 213 / 232 ids (91.8%), covering 98.5% of all
     bindings. The 19 misses are variables from other libraries (id carries a library-key
     prefix) or newer than the pinned `tokens.json`; they become flagged "unresolved" leaves.
7. The example screens are **component sets with variants** (`Platform=Desktop`, `Platform=Mobile`),
   so an evaluation target is a specific variant, e.g. `Examples/About` > `Platform=Desktop` (301 nodes).
8. The file uses the newer `SLOT` node type (490 nodes); the IR must treat it as a container.
