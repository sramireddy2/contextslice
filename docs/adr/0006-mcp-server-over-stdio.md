# ADR-0006: Expose the compiler to coding agents as an MCP server over stdio

**Status:** accepted (2026-10-18)

## Context

The compiler was only reachable through the CLI. Its consumer is a coding agent, and coding
agents (Claude Code, Cursor, and others) discover and call local tools through the Model
Context Protocol: JSON-RPC 2.0, tools described by JSON schemas, a handshake, and one of a few
transports. Making the compiler a tool is what turns "a CLI a person runs" into "context the
agent fetches itself".

Options considered:

1. The official Python SDK (`mcp`) with its `MCPServer` class, stdio transport, as an optional
   extra of the package.
2. A hand-rolled JSON-RPC loop over stdio: no dependencies, but the handshake, capability
   negotiation and schema generation would be ours to get right and keep right.
3. An HTTP service: easy to poke with curl, but not what agents speak for local tools, and it
   opens a port for no reason.

## Decision

- **Option 1.** `contextslice serve` runs an `MCPServer` over stdio with two tools,
  `find_targets(query, limit)` and `compile_context(target, max_tokens, request, selector)`.
  The SDK (2.x; `FastMCP` was renamed `MCPServer` in 2.0) generates the input and output schemas
  from type hints and dataclasses and validates arguments before the tool runs.
- **Optional extra.** The SDK pulls in an HTTP stack (starlette, uvicorn) that the compiler
  does not need; `mcp` lives in `[project.optional-dependencies]` as `contextslice[mcp]` and in
  the dev group so the tests exercise it. `serve` explains how to install it when missing.
- **stdout is the wire.** Every human-readable message from `serve` goes to an stderr console,
  and `logging` is configured for stderr. This was the user's call when asked.
- **Load once, serve many.** A `Workspace` (snapshot, IR, graph, tokenizer) is built at startup
  (a few seconds) and shared by every call; a call is then one compile (2-3 s on the 18,911-node
  file).
- **Expected failures are results, not exceptions.** The SDK masks the message of an exception
  raised inside a tool ("Error executing tool"), which is right for bugs and wrong for "nothing
  matches that name", "the budget cannot hold the target line" or "that name is ambiguous". Those
  come back as `ok=false` with an `error` string and, for ambiguity, the candidate nodes, so the
  agent can act. A name query must match exactly one node; the tool never guesses.
- **Validate at the boundary.** `max_tokens` is bounded (100 to 1,000,000), node ids must look
  like node ids (`175:4995` or `175-4995`), free text is length-capped, `selector` is an enum.
  The verifier's result (`verified`, `problems`) is reported rather than assumed.
- **Read-only.** Both tools carry `readOnlyHint`, `destructiveHint=false`,
  `openWorldHint=false`: nothing is written and nothing leaves the machine.

## Consequences

- Registration is one command per agent (see README). The bundle's own header carries the
  notation the agent needs, so the server's instructions only describe the two-call flow.
- Tests call the tools in-process through `MCPServer.call_tool`, which is exactly what the
  transport does after decoding a request; an end-to-end stdio check is done by hand with the
  SDK's client against the real snapshot.
- Nothing in the server depends on the transport; `streamable-http` would be a one-word change
  if a remote deployment were ever wanted, at which point authentication becomes a requirement.
