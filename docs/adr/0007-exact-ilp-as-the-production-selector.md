# ADR-0007: Solve the budgeted selection exactly; keep the greedy as the fallback

**Status:** accepted (2026-10-18)

## Context

Pass P7 chooses a level of detail for every item of the context tree so that the bundle's
value is maximal under a token budget, with precedence (a child needs its parent) and shared
definition costs (a `$token` or component entry is paid once). The MVP solved it with a lazy
cost-benefit greedy (ADR-free until now; see `select.py`).

To know how good the greedy is, an exact integer linear program was written over the
*selector's own model* (`ilp.py`): same items, levels, precedence and dependency rules, same
additive costs and one-time section costs, same objective. HiGHS (inside SciPy, already a
dependency) solves a screen's model, 147-240 binary variables, in 11-315 ms.

Measured on the 8 evaluation screens at B in {1000, 2000} for both relevance scorers
(`contextslice gap --tasks`, both selections exactly feasible after rendering):

| selector | B | cases | gap (greedy below optimum) |
|---|---|---|---|
| PageRank | 1000 | 8 | 0.0-0.2% in 7, **21.5%** on the product screen |
| PageRank | 2000 | 8 | 0.0-0.1% |
| depth decay | 1000 | 8 | 2.2-15.3% |
| depth decay | 2000 | 8 | 0.0-0.2% |

Mean 2.4%, maximum 21.5%. The 21.5% case is precedence myopia: the product screen's price
block (`<TextPrice ... price="50">`, the single most valuable item) sits under three
near-worthless wrapper frames, and the greedy only considers an item once its parent is shown;
each wrapper's own stub looked like a bad deal, so the path never opened and the budget went to
a header button and an icon. The textbook remedy, pricing a move as the path through its
omitted ancestors, fixed that case (21.5% -> 9.7%) but made the average worse (2.4% -> 4.8%)
and created a new 21% case elsewhere. Neither greedy dominates, which is what the theory of
precedence-constrained knapsack predicts.

## Decision

- **The exact solver is the production optimizer** (`compile_context(optimizer="exact")`, the
  default). A compile takes 2-3 s; the solve adds about a tenth of that. Costs are estimates,
  so after solving the bundle is rendered and counted exactly; if it is over budget the model
  budget is tightened by the overshoot and solved again (at most 8 rounds; 0 were needed on the
  32 measured cases). The greedy's equivalent was its LIFO repair.
- **The greedy stays as the fallback** (`optimizer="greedy"`): used when the solver returns
  nothing usable within its 5 s guard or the tightened bundle still does not fit, and kept in
  its original form (the path-priced variant was not adopted). `contextslice gap` keeps
  measuring it against the optimum, so the fallback's quality is a number, not a belief.
- HiGHS is deterministic for a given model, so bundles remain byte-stable (checked).

## Consequences

- The evaluation runs `full-r1`, `lower-r1` and `lower-r2` were produced with the greedy
  (`config.json` records `optimizer`). Their selections were optimal in most PageRank cases,
  so the headline numbers stand; the next run will use the exact optimizer.
- The CS story improves rather than suffers: the greedy, its dependency-aware costs and the
  re-push trick are still the explanation of *what* is being optimised; the ILP is the proof
  of how well, and at this problem size exactness is cheap enough to ship.
- If targets ever grow to thousands of items (multi-screen targets, stretch work), the time
  guard turns the exact solver into a best-effort one and the greedy takes over.
