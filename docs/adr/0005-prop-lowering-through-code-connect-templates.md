# ADR-0005: Lower instance props through Code Connect templates

**Status:** accepted (2026-10-18)

## Context

The first full evaluation (`eval/runs/full-r1`) showed the compiler's output speaking two
languages. The TREE section printed a mapped instance in Figma's vocabulary,
`<PricingCard Device=Desktop Variant=Stroke>`, while the COMPONENTS section above it showed the
React usage, `variant="${variant}"`. Nothing in the bundle connected the two.

Re-running `tsc` on the 16 ContextSlice-arm generations and reading the messages:

| error | count | cause |
|---|---|---|
| `platform`/`state` not assignable to `HeaderProps` | 133 | Figma-only props passed to a React component |
| `"Start"` is not assignable to `"start" \| "center"` | 12 | Figma enum casing |
| `Module "compositions" has no exported member CardGridContentList` | 9 | a layout *pattern* imported as a component |
| `Cannot find name TextContentTitle` | 105 | a listed component used without its import |

So 145 of the 155 type-class errors were the bundle's fault, not the model's. On the TREE lines
of that run, 733 of 898 instance-property occurrences were properties that *some* template reads.

## Decision

1. **The Code Connect template is the ABI.** Each template reads the instance through a tiny DSL
   (`getEnum("Variant", { Primary: "primary" })`, `getString("Label")`, `getBoolean`,
   `getInstanceSwap`) and places each value on a named prop (`renderProp("variant", variant)`,
   `align="${align}"`) or between the tags. `templates.py` extracts these as `PropRule`s by
   pattern matching over the text. Nothing is executed (ADR-0004 stands). All 97 SDS templates
   parse: 162 rules.
2. **Lowering is per template, not per name.** The same Figma property means different things
   on different components (`State=Disabled` is `isDisabled` on a Button, `State=Active` is
   `isSelected` on a NavigationPill, and `State` is nothing at all on a Header). A global table
   would be wrong; the rules are looked up on the instance's own template.
3. **What the template does not read is dropped.** If the template never looks at a property,
   the code component has no prop for it: `Platform`, `Device`, `Has Subheading`, `Link 3`.
   Enum values absent from the table (`State=Default`) are omitted too, which is exactly what
   the template's own `undefined` branch does.
4. **Names that are not exports.** When a template's header name is not among its imports and
   there is exactly one import, that import is the code name (`component=Button` with
   `import { ButtonDanger }`). With several imports the template is a *layout pattern*
   (`CardGridContentList` is a recipe of `Section`/`Flex`): it is rendered as
   `<pattern CardGridContentList ...>` and headed `(layout pattern, not an import)`.
5. **One IMPORTS block.** Import statements are consolidated per module and placed first, so
   the model can copy the block; the per-component entry then carries only the usage example.
   A normal component needs no COMPONENTS entry at the cheapest detail level.
6. **Header legend lines are conditional** on component lines being present, so the plain
   outline (arm F) and the no-context arm keep byte-identical prompts and their cached
   responses stay valid. The pre-existing legend line's wording ("see COMPONENTS") was kept
   verbatim for the same reason.
7. **Selector accounting.** The one-time costs that appear with the first component (the
   legend line, the `## IMPORTS` and `## COMPONENTS` headings) are charged to the move that
   first pays a mapping, so the estimate stays honest. While doing this a latent bug was fixed:
   undoing a move restored "one level down", which for items that jump from omitted straight
   to full left them at the stub level and could orphan a child under an omitted parent.

## Consequences

- **Measured** (run `lower-r1`, 8 screens, same model/prompt/seeds as September, details in
  `docs/eval.md`): Figma-vocabulary props on component tags went from up to 9.6 per file to
  zero in all 40 compiled generations; type-class errors per file fell 5.9 -> 1.3 at B=1000 and
  11.5 -> 0.6 at B=2000 with no screen getting worse; precision rose to 1.00 in every compiled
  arm; recall +0.09 / +0.23 / +0.30 (B=1000 / B=2000 / unbudgeted). What remains is the model
  omitting imports it was given and turning structure words into tags.
- About, unbudgeted: 2,146 -> 1,942 tokens (-9.5%) despite the extra legend lines. At B=1000
  the selector now fills 946 tokens with 0 repairs and 28 tree lines, where it previously
  reached 971 with 1 repair and 21 lines.
- The reuse metric's expected set now excludes pattern names, which can never be imported. The
  denominators in `full-r1` included them, so recall numbers across runs are compared only
  after re-scoring the old generations under the new expectations.
- A new metric, `figma_props`, counts Capitalised attributes on component tags in generated
  code: the direct measure of vocabulary leakage.
- Three SDS templates compute their imports conditionally (`const imports = hasLabel ? ... `)
  and yield no import statement; their components keep a COMPONENTS heading so no reference
  dangles.
- Alternative considered: the React component's TypeScript `Props` type is the ground truth
  for *which* props exist, and it is what `tsc` checks. It does not know how Figma's values map
  onto them, so it cannot replace the template; it would make a good validator later.
