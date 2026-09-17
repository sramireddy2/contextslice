# ADR-0004: The MVP never executes model-generated code

**Status:** accepted (2026-09-17)

## Context

LLM-generated code is untrusted input. Measuring *visual similarity* requires rendering it in a
browser, i.e. executing it. Doing that safely needs a sandbox (a no-network Docker container with
resource limits), which costs days of setup on Windows. The MVP has one week.

## Decision

- MVP metrics are all computed **without running** generated code:
  - compile success = `esbuild` bundle + `tsc --noEmit` against the real SDS types;
  - design-token adherence and component reuse = static analysis of the TSX source.
- The generation contract is exactly one TSX file. An import allowlist (react, the SDS package,
  the tokens stylesheet) is enforced on the AST before anything else touches the file.
  Packages named by the model are never installed.
- Visual similarity is stretch item #1, and only behind a Docker sandbox
  (`--network none`, memory/CPU/pids limits, non-root user, wall-clock kill).
- Text from the design file (layer names, text content) is third-party data that ends up inside
  an LLM prompt. The emitter delimits it as data and caps its length, to reduce prompt injection risk.

## Consequences

- (+) No sandbox needed for the MVP; the security boundary is simple to state and verify.
- (+) The type checker is the most context-sensitive signal anyway: hallucinated components or
  props caused by missing context show up as `tsc` errors.
- (-) One of the six target metrics (visual similarity) is deferred.
