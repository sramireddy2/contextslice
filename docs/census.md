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

# First compile: the token ledger (Day 3)

`contextslice compile --node <id>` with the exact Qwen2.5-Coder tokenizer. Each column is what
the context would cost if the compiler stopped after that stage.

| Target | Raw Figma JSON | P0 normalized JSON | Outline format | + P4 Code Connect substitution |
|---|---|---|---|---|
| Examples/About > Desktop (301 nodes) | 1,327,910 | 53,152 | 6,998 | **3,254** (0.25% of raw) |
| Dialog frame | 261,911 | 34,596 | 6,357 | **2,273** |
| Examples/Shop (desktop + mobile) | 556,979 | 94,638 | 13,003 | **3,581** |
| Examples/Product Detail (both) | 746,885 | 91,894 | 13,855 | **4,305** |
| Sections/Page Product Results | 252,181 | 58,341 | 7,754 | **2,375** |

## What this tells us

1. **Format matters as much as selection.** Going from normalized JSON to a one-line-per-node
   outline is a further ~7x, before any graph algorithm: quotes, braces and repeated keys are
   expensive, and the rule of thumb "4 characters per token" badly underestimates raw JSON
   (the raw About page is 1.33M real tokens, not the ~598k that chars/4 predicted).
2. **Code Connect substitution halves what is left** (and drops 301 -> 114 nodes) while keeping
   component props, nested components and slot content.
3. **With full mapping coverage, a whole page fits in 8k without any selection.** That is an
   honest result, not a problem to hide: it means budgeted selection earns its keep in three
   regimes, which is where the evaluation will focus:
   - tight budgets (1k-2k), realistic for small local models where prompt tokens are latency;
   - designs with little or no Code Connect coverage (the common case in industry):
     with P4 off, the same pages are 7k-14k tokens, so an 8k budget binds;
   - multi-screen targets.
4. The remaining redundancy is visible in the output: the About page emits the same `Card`
   block nine times. That is the job of structural dedupe (P5).
5. Component detail is a budget knob: imports only / + JSX example / + prop logic costs
   259 / 771 / 1,486 tokens for the About page's 12 components.

# Dedupe and dominators (Day 4)

## Structural dedupe (P5)

Every context-tree node gets a Merkle digest (its own content + its children's digests, no
ids). Runs of identical siblings fold into the first occurrence with an `xN` suffix.

| Target | after P4 | after P5 | repeats folded | nodes |
|---|---|---|---|---|
| Examples/About > Desktop | 3,278 | **2,146** (0.16% of raw) | 5 | 114 -> 76 |

Non-adjacent repeats (a named template defined once and referenced later) were measured
before deciding: they would save a further 0% (About), 3% (Dialog), 7.8% (Product Detail set)
and 16.3% (Shop set). The large numbers come only from sets holding both a desktop and a
mobile variant that share sub-blocks; evaluation targets are single screens, so templates
went to the stretch list with these numbers attached.

## Dominators (P3) and `contextslice explain`

On the dependency slice (virtual root -> target), `nx.immediate_dominators` gives each vertex
its immediate dominator; *retained tokens* = own tokens + everything it dominates = what
dropping it would actually free. For the About screen (2,146 tokens):

- All 7 variables are **shared**: each is used from independent subtrees, so no single subtree
  can free its TOKENS line. Dropping a Card to save tokens never recovers
  `color-text-default-default` (the question from Day 3).
- 3 of 16 code components are shared (203 tokens); 13 are **private** to one subtree
  (564 tokens) and are priced into it.
- The top owner after the root is the Footer: 7 own tokens, 622 retained, because its slot
  content carries four private code mappings.

Fact checked along the way: in NetworkX 3.6 `immediate_dominators` does not include the root
in its result; and an immediate dominator that is not itself emitted (e.g. a main component
vertex shared by many instances) must not be mistaken for an owner, so "private" means
"dominated by some emitted, non-root subtree" (walk up the dominator tree to find it).
