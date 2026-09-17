# ADR-0002: Ingest once, then run fully offline from committed snapshots

**Status:** accepted (2026-09-17)

## Context

- Figma's file and image endpoints are "Tier 1" rate-limited. Depending on plan and seat, that
  can mean a handful of calls per month, and users report multi-day `Retry-After` lockouts.
- The Variables REST API is Enterprise-only, and Code Connect publishing requires an
  Organization plan. A student account has neither.
- A benchmark that depends on a live API is not reproducible.

## Decision

- Corpus: Figma's Simple Design System (community file, CC BY 4.0) + the `figma/sds` React repo (MIT).
- Call Figma the minimum number of times: **one** full file fetch streamed to disk, and (later,
  if needed) **one** batched image export. No retry loops: on HTTP 429, print the headers and stop.
- No "preflight" request. The cheap metadata endpoint needs the `file_metadata:read` scope, but
  our token is deliberately least-privilege (`file_content:read` only), so the only call we are
  allowed to make is the one we actually want. Clear typed errors (403/404/429) replace the preflight.
- Variable definitions come from `scripts/tokens/tokens.json` in the SDS repo; component-to-code
  mappings are parsed offline from its `*.figma.ts` Code Connect files. Both are joined to the
  snapshot by Figma node/variable id.
- Storage is plain files: JSON snapshots plus a content-addressed cache of model responses.
  No database: the workload is batch, read-mostly, single-user.

## Consequences

- (+) Reproducible by anyone without a Figma token; immune to rate limits after day one.
- (+) Works without Enterprise/Organization features.
- (-) The snapshot can drift from the live community file; we pin the file `version` and the SDS commit.
- (-) The id join between snapshot and SDS repo files must be verified, not assumed
  (`contextslice stats` reports the join rate).
