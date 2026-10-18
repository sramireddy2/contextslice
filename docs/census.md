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

# Budgeted selection (Day 5)

`contextslice compile --node 175:4995 --budget B` on the About screen (2,146 tokens unbudgeted):

| Budget | Selector | Result | Lines kept | Repairs |
|---|---|---|---|---|
| 2,000 | PageRank | **1,978** tokens, verified | 72 of 76 | 0 |
| 2,000 | BFS decay | 1,974 tokens, verified | 75 of 76 | 0 |
| 1,000 | PageRank | **971** tokens, verified | 21 of 76 | 1 |

How it works: every context node is an item with levels (omitted / one-line stub / full line);
code components have two levels (imports / + JSX example). A lazy cost-benefit greedy applies
"upgrade one item by one level" moves ranked by gain per token. A move's cost includes any
definition it needs that nobody has paid for yet (the ancestor spine, `$token` lines, the
component entry), so shared definitions are paid once and an item's cost depends on what was
already chosen. When a definition is first paid, the moves that depended on it are re-pushed
with fresh keys: without that, lazy greedy would trust stale (too pessimistic) keys and pick
worse items first. Line costs are near-additive, not exact, so the bundle is rendered, counted
exactly and repaired (latest moves undone) until it fits; the verifier then asserts
`tokens <= B` and that no `$token` or `<Component>` reference is left dangling.

What the numbers say so far:

- At B=2,000 the two selectors agree almost completely: with only 76 lines to choose from, the
  budget removes the last few percent and ranking barely matters. The difference between
  PageRank and plain depth decay can only show up at tight budgets or on bigger targets, which
  is what the evaluation must test rather than assume.
- At B=1,000 half the budget went to COMPONENTS (489 tokens of JSX examples). Whether that is
  the right trade against tree lines is exactly the kind of constant (`EXAMPLE_SHARE`) the
  evaluation should ablate; it is a documented number, not a tuned one.
- SciPy became a dependency here: NetworkX's `pagerank` is implemented on top of it.

# Prop lowering (Day 8, 2026-10-18)

Diagnosis before building anything. `tsc` re-run on the 72 generations of `eval/runs/full-r1`,
messages read rather than counted:

| error in the ContextSlice arm (16 files) | count | cause |
|---|---|---|
| `platform`/`state` not assignable to `HeaderProps` | 133 | Figma-only props passed to a React component |
| `"Start"` is not assignable to `"start" \| "center"` | 12 | Figma enum casing |
| `Module "compositions" has no exported member CardGridContentList` | 9 | a layout pattern imported as a component |
| `Cannot find name TextContentTitle` | 105 | a listed component used without its import |

Vocabulary leakage, measured as Capitalised attributes on component tags in generated code:
87 in 3 of 16 ContextSlice files, 41 in 1 of 16 BFS files, 73 in 1 of 8 unbudgeted files, 0 in
the flat-outline and no-context arms (which never saw a `<Name ...>` line). On the TREE lines of
the ContextSlice contexts there were 898 instance-property occurrences (51 distinct names), of
which 733 are properties that some Code Connect template reads.

The templates themselves (97 files): five helper calls in total (`getEnum` 86 call sites,
`getString` 87, `getBoolean` 21, `getInstanceSwap` 12, `executeTemplate` 12) and four ways a
value reaches the JSX (`renderProp`/`rp`, `name="${v}"`, bare `${v}`, `renderChildren(v)`).
The static parser extracts 162 rules. Two templates name their component differently from
their one import (`FormBox` -> `Form`, `Button` -> `ButtonDanger`) and are renamed; 11 are
layout patterns (the six `CardGrid*`, the four `Page*`, `Dialog`). Four props sit on a wrapper
element (`<Section padding=...>` around `Panel`) and are no longer attributed to the component.

Effect on the About screen (`contextslice compile --name "about desktop"`):

| Stage | before | after |
|---|---|---|
| P4 substitution (+ lowering) | 3,278 | 2,967 |
| P5 dedupe, unbudgeted | 2,146 | 1,935 |
| B=2,000, PageRank | 1,978 (72 of 76 lines, 0 repairs) | 1,847 (75 of 76, 0 repairs) |
| B=1,000, PageRank | 971 (21 lines, 1 repair) | 948 (28 lines, 0 repairs) |
| B=1,000, BFS decay | - | 907 (58 lines, 0 repairs) |

The saving comes from dropped properties and the consolidated import block, net of three new
legend lines. The repair count dropped because the selector now charges the one-time header and
section costs to the first component; before that fix the toy `RICH` screen at B=197 landed at
144 tokens after 9 repairs (and exposed an undo bug that left a component at the stub level
under an omitted parent); it now lands at 189 with 0 repairs.

A line now reads `<NavigationPill isSelected> "Products"` instead of
`<NavigationPill Label="Products" State=Active>`, and `<Header>` instead of
`<Header Platform=Desktop State=Default>`.

# Optimality gap of the greedy selector (Day 8, 2026-10-18)

`contextslice gap --tasks`: the shipped greedy against an exact integer program over the same
model (same items, levels, precedence, dependency and one-time section costs, same objective),
solved with HiGHS via SciPy. Both selections are compared as exactly feasible rendered bundles.
Objective values are the model objective (PageRank scores sum to 1, depth-decay scores do not).

| screen | B | selector | greedy | optimum | gap | tokens greedy/ILP | solve ms |
|---|---|---|---|---|---|---|---|
| About | 1000 | ppr | 0.194 | 0.194 | 0.2% | 955/964 | 68 |
| About | 1000 | bfs | 19.471 | 20.259 | 3.9% | 932/939 | 79 |
| Landing | 1000 | ppr | 0.423 | 0.423 | 0.0% | 930/927 | 33 |
| Landing | 1000 | bfs | 19.135 | 19.650 | 2.6% | 933/929 | 315 |
| Pricing | 1000 | ppr | 0.344 | 0.344 | 0.0% | 957/956 | 172 |
| Pricing | 1000 | bfs | 19.956 | 22.375 | 10.8% | 932/948 | 61 |
| Product | 1000 | ppr | 0.200 | 0.255 | **21.5%** | 932/968 | 62 |
| Product | 1000 | bfs | 18.435 | 20.306 | 9.2% | 914/897 | 83 |
| Contact | 1000 | ppr | 0.304 | 0.304 | 0.0% | 927/941 | 101 |
| Contact | 1000 | bfs | 16.981 | 20.043 | 15.3% | 914/911 | 51 |
| Waitlist | 1000 | ppr | 0.310 | 0.310 | 0.0% | 947/942 | 22 |
| Waitlist | 1000 | bfs | 18.037 | 19.834 | 9.1% | 917/931 | 167 |
| Article | 1000 | ppr | 0.157 | 0.157 | 0.1% | 951/937 | 20 |
| Article | 1000 | bfs | 19.331 | 19.762 | 2.2% | 928/926 | 42 |
| Home | 1000 | ppr | 0.444 | 0.444 | 0.0% | 966/974 | 43 |
| Home | 1000 | bfs | 19.400 | 19.991 | 3.0% | 924/924 | 285 |
| all eight | 2000 | ppr | | | 0.0-0.1% | | 11-52 |
| all eight | 2000 | bfs | | | 0.0-0.2% | | 11-71 |

Mean 2.4%, maximum 21.5%, over 32 cases; the ILP needed no budget tightening in any of them
(the 2% margin covers the model's inexactness). Models have 147-240 binary variables.

What the 21.5% is: on the product screen the single most valuable item, the price block
(`<TextPrice label="/ mo" currency="$" price="50">` and its `Frame "Price"`), sits under three
near-worthless wrapper frames (values 0.0001-0.0002). The greedy only considers an item once
its parent is shown, each wrapper's own stub is a terrible deal on its own, so the path never
opens and the budget goes to `<HeaderAuth>` (value 0.0003), an `<IconButton>` and an icon.
Precedence myopia, the textbook failure of greedy on tree knapsacks.

The textbook remedy, pricing each move as the path through its omitted ancestors (gain and
cost of the spine included), was implemented and measured: product/ppr improved to 9.7%, but
the mean rose to 4.8% and About/bfs became a new 21.4% case. Neither greedy dominates.

Decision (ADR-0007): since the exact solve costs about a tenth of a compile at this size,
`compile` now solves P7 exactly by default and keeps the original greedy as the fallback.
Whole-compile time on About at B=1000: greedy 0.48 s, exact 0.50 s (IR and graph already
built); the exact bundle is 927 tokens in 24 lines where the greedy's was 922 in 21. Five
consecutive solves of the same model return the identical selection.
