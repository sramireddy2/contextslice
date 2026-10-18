"""The compiler as a tool a coding agent can call: an MCP server over stdio.

Why MCP: it is the protocol coding agents (Claude Code, Cursor, and others) already speak to
discover and call local tools. The agent sees two tools with JSON schemas, calls them with
JSON, gets JSON back. Underneath it is JSON-RPC 2.0, and the official SDK handles the handshake,
schema generation from type hints, and argument validation.

Why stdio: the agent starts this process and talks to it over its standard input and output.
No port, no network, nothing to secure. The consequence is that **stdout is the wire**: a single
stray ``print`` corrupts the protocol stream, so every human-readable message goes to stderr
(the CLI's ``serve`` command uses an stderr console, and logging is configured for stderr).

Design rules of this module:

* **Load once, serve many.** The snapshot, IR and graph take a few seconds to build; a
  ``Workspace`` holds them for the life of the process. Each tool call is then a 2-3 s compile.
* **Expected failures are results, not exceptions.** "Nothing matches that name", "the budget
  cannot hold the target line" and "that query is ambiguous" are normal outcomes an agent must be
  able to read and act on, so they come back as ``ok=False`` with an ``error`` string and, where
  useful, the candidates to choose from. Exceptions are reserved for bugs; the SDK masks their
  messages ("Error executing tool"), which is the right behaviour for the unexpected.
* **Validate at the boundary.** Budgets are bounded, node ids must look like node ids, free-text
  arguments are length-capped. The verifier's bound (``tokens <= max_tokens``) is what the agent
  relies on, and it is reported explicitly rather than assumed.
* **The server only reads.** Tools are annotated read-only and open-world=false: nothing is
  written, nothing leaves the machine.

This module imports the optional ``mcp`` extra; install it with ``uv sync --extra mcp``.
"""

import logging
import re
import sys
import time
from dataclasses import dataclass, field
from importlib import metadata
from pathlib import Path
from typing import Literal

import networkx as nx
from mcp.server.mcpserver import MCPServer
from mcp.types import ToolAnnotations

from contextslice.build_ir import build_design_file
from contextslice.compile import compile_context as _compile
from contextslice.graph import build_graph
from contextslice.ingest.snapshot import SnapshotStore
from contextslice.ir import DesignFile
from contextslice.resolve import find_targets as _find_targets
from contextslice.select import BudgetError
from contextslice.tokens import TokenCounter, default_counter

MIN_BUDGET = 100
MAX_BUDGET = 1_000_000
MAX_QUERY_CHARS = 200
MAX_REQUEST_CHARS = 2_000
MAX_CANDIDATES = 50

_NODE_ID = re.compile(r"^\d+[:-]\d+$")
_READ_ONLY = ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False)

INSTRUCTIONS = """ContextSlice compiles a Figma design snapshot into the smallest useful context for
implementing a screen, under a hard token budget.

Typical flow:
1. find_targets(query) to turn words like "about desktop" into a node id and path.
2. compile_context(target, max_tokens, request) to get the context bundle for that node.
   `target` is a node id ("175:4995") or a name query that matches exactly one node.
3. Paste the returned `context` into the implementation prompt as-is. Its header explains its
   own notation: <Name ...> lines are existing code components with their real React props,
   IMPORTS is a block to copy verbatim, Frame/Text/Slot/Pattern lines are design structure.

With Code Connect mappings a whole screen fits in about 2,000 tokens; 1,000 keeps most of the
value. `ok=false` results carry an `error` you can act on (and `candidates` when a name was
ambiguous). The token count is verified against the budget before it is returned."""

log = logging.getLogger("contextslice.mcp")


@dataclass(frozen=True)
class Workspace:
    """Everything the tools need, built once per process."""

    design: DesignFile
    graph: nx.MultiDiGraph
    sds_root: Path | None
    counter: TokenCounter

    @classmethod
    def load(
        cls,
        snapshots_dir: Path,
        sds_dir: Path | None,
        counter: TokenCounter | None = None,
    ) -> "Workspace":
        store = SnapshotStore(snapshots_dir)
        manifest = store.latest()
        if manifest is None:
            raise FileNotFoundError(
                f"no snapshot under {snapshots_dir}: run `contextslice ingest` first"
            )
        sds_root = sds_dir if sds_dir is not None and sds_dir.exists() else None
        design = build_design_file(store.load_document(manifest), sds_root)
        return cls(design, build_graph(design), sds_root, counter or default_counter())


# -- tool results (dataclasses: the SDK derives the output schema from them) --------------------


@dataclass
class Target:
    node_id: str
    kind: str
    name: str
    path: str


@dataclass
class FindTargetsResult:
    query: str
    targets: list[Target]


@dataclass
class LedgerEntry:
    stage: str
    tokens: int
    nodes: int


@dataclass
class ContextResponse:
    ok: bool
    error: str | None = None
    candidates: list[Target] = field(default_factory=list)
    target_id: str | None = None
    target_path: str | None = None
    context: str | None = None  # the bundle text, ready to paste into a prompt
    tokens: int = 0
    budget: int | None = None
    verified: bool = False
    problems: list[str] = field(default_factory=list)
    ledger: list[LedgerEntry] = field(default_factory=list)
    sections: dict[str, int] = field(default_factory=dict)
    tokenizer: str = ""
    seconds: float = 0.0


def build_server(workspace: Workspace, log_level: str = "INFO") -> MCPServer:
    server = MCPServer(
        "contextslice",
        title="ContextSlice",
        instructions=INSTRUCTIONS,
        version=_package_version(),
        log_level=log_level,  # type: ignore[arg-type]
    )

    @server.tool(annotations=_READ_ONLY)
    def find_targets(query: str, limit: int = 10) -> FindTargetsResult:
        """Find screens or components whose path contains all the words in `query`.

        Returns node ids to pass to compile_context, best matches first (exact name, then
        shortest path). Deterministic substring matching over node paths: no guessing.
        """
        query = query.strip()[:MAX_QUERY_CHARS]
        limit = max(1, min(limit, MAX_CANDIDATES))
        hits = _find_targets(workspace.design, query, limit=limit)
        return FindTargetsResult(query=query, targets=[_target(workspace, n.id) for n in hits])

    @server.tool(annotations=_READ_ONLY)
    def compile_context(
        target: str,
        max_tokens: int | None = None,
        request: str | None = None,
        selector: Literal["ppr", "bfs"] = "ppr",
    ) -> ContextResponse:
        """Compile the design context for one target node under a token budget.

        `target`: a node id ("175:4995" or "175-4995") or a name query matching exactly one
        node (see find_targets). `max_tokens`: hard budget for the whole bundle, verified with
        the model tokenizer; omit for the unbudgeted bundle. `request`: what the developer asked
        for; its words raise the relevance of matching parts of the design. `selector`: "ppr"
        (personalized PageRank, default) or "bfs" (depth decay).
        """
        return _compile_tool(workspace, target, max_tokens, request, selector)

    return server


def _compile_tool(
    workspace: Workspace,
    target: str,
    max_tokens: int | None,
    request: str | None,
    selector: str,
) -> ContextResponse:
    if max_tokens is not None and not (MIN_BUDGET <= max_tokens <= MAX_BUDGET):
        return ContextResponse(
            ok=False, error=f"max_tokens must be between {MIN_BUDGET} and {MAX_BUDGET}"
        )
    if request is not None and len(request) > MAX_REQUEST_CHARS:
        return ContextResponse(
            ok=False, error=f"request is longer than {MAX_REQUEST_CHARS} characters"
        )

    resolved = _resolve(workspace, target)
    if isinstance(resolved, ContextResponse):
        return resolved
    node_id = resolved

    started = time.perf_counter()
    try:
        result = _compile(
            workspace.design,
            node_id,
            workspace.counter,
            sds_root=workspace.sds_root,
            graph=workspace.graph,
            budget=max_tokens,
            selector=selector,
            request=request,
        )
    except BudgetError as error:
        return ContextResponse(
            ok=False,
            error=str(error),
            target_id=node_id,
            target_path=workspace.design.path_of(node_id),
            budget=max_tokens,
        )
    verification = result.verification
    log.info(
        "compiled %s: %d tokens (budget %s, %s) in %.1fs",
        node_id,
        verification.tokens,
        max_tokens,
        "verified" if verification.ok else "NOT verified",
        time.perf_counter() - started,
    )
    return ContextResponse(
        ok=verification.ok,
        error=None
        if verification.ok
        else "verification failed: " + "; ".join(verification.problems),
        target_id=node_id,
        target_path=workspace.design.path_of(node_id),
        context=result.bundle.text,
        tokens=verification.tokens,
        budget=max_tokens,
        verified=verification.ok,
        problems=list(verification.problems),
        ledger=[LedgerEntry(row.stage, row.tokens, row.nodes) for row in result.ledger],
        sections=dict(result.section_tokens),
        tokenizer=result.counter_name,
        seconds=round(result.seconds, 3),
    )


def _resolve(workspace: Workspace, target: str) -> str | ContextResponse:
    """A node id, or a name that matches exactly one node; anything else is a readable error."""
    target = target.strip()
    if not target:
        return ContextResponse(ok=False, error="target is empty")
    if _NODE_ID.match(target):
        node_id = target.replace("-", ":")
        if node_id not in workspace.design.nodes:
            return ContextResponse(ok=False, error=f"no node with id {node_id!r} in this snapshot")
        return node_id
    hits = _find_targets(workspace.design, target[:MAX_QUERY_CHARS], limit=MAX_CANDIDATES)
    if len(hits) == 1:
        return hits[0].id
    if not hits:
        return ContextResponse(ok=False, error=f"nothing matches {target!r}; try find_targets")
    return ContextResponse(
        ok=False,
        error=f"{len(hits)} nodes match {target!r}: pass one of the candidate node ids",
        candidates=[_target(workspace, n.id) for n in hits],
    )


def _target(workspace: Workspace, node_id: str) -> Target:
    node = workspace.design.nodes[node_id]
    return Target(
        node_id=node.id,
        kind=node.kind.value,
        name=node.name,
        path=workspace.design.path_of(node_id),
    )


def _package_version() -> str:
    try:
        return metadata.version("contextslice")
    except metadata.PackageNotFoundError:  # running from a source tree that is not installed
        return "0.0.0+source"


def configure_logging(level: str = "INFO") -> None:
    """All diagnostics to stderr: stdout belongs to the protocol."""
    logging.basicConfig(
        level=level,
        stream=sys.stderr,
        format="%(asctime)s %(name)s %(levelname)s %(message)s",
        force=True,
    )
