"""Command-line entry point.

Each compiler stage gets its own subcommand as we build it
(ingest -> stats -> slice -> compile -> explain -> eval), so every step of the
project ends with something you can run from a terminal.

This module only parses arguments and renders output; all logic lives in importable,
unit-tested modules.
"""

import time
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.table import Table

from contextslice import __version__, sds
from contextslice.build_ir import build_design_file
from contextslice.compile import CompileResult, compile_context
from contextslice.config import ConfigError, Settings
from contextslice.dominate import analyze_ownership, definition_split, top_owners
from contextslice.graph import build_graph
from contextslice.ingest.figma_client import FigmaClient, FigmaError, FigmaRateLimitedError
from contextslice.ingest.snapshot import SnapshotStore, ingest_file
from contextslice.ir import DesignFile, NodeKind
from contextslice.resolve import find_targets
from contextslice.slicer import SliceSummary, dependency_slice, slice_roots, summarize
from contextslice.stats import Census, take_census
from contextslice.tokens import default_counter

app = typer.Typer(
    help="Compile a large Figma design into the smallest useful agent context.",
    no_args_is_help=True,
)
console = Console()

SnapshotsDir = Annotated[Path, typer.Option(help="Directory that holds file snapshots.")]


@app.callback()
def main() -> None:
    """Root command group.

    Declaring a callback keeps Typer in "multi-command" mode even with one subcommand.
    """


@app.command()
def version() -> None:
    """Print the installed ContextSlice version."""
    typer.echo(f"contextslice {__version__}")


@app.command()
def ingest(
    snapshots_dir: SnapshotsDir = Path("snapshots"),
    force: Annotated[
        bool, typer.Option("--force", help="Fetch again even if a snapshot exists.")
    ] = False,
) -> None:
    """Fetch the Figma file ONCE and store it as a local snapshot (reads FIGMA_* from .env)."""
    try:
        settings = Settings.from_env()
    except ConfigError as error:
        console.print(f"[red]Configuration error:[/red] {error}")
        raise typer.Exit(code=1) from error

    store = SnapshotStore(snapshots_dir)
    try:
        with (
            FigmaClient(settings.figma_token) as client,
            console.status("Downloading file from Figma (large files can take a few minutes)..."),
        ):
            manifest, fetched = ingest_file(client, store, settings.figma_file_key, force=force)
    except FigmaRateLimitedError as error:
        console.print(f"[red]{error}[/red]")
        console.print("Not retrying: a retry would only spend more quota. Try again later.")
        if error.upgrade_link:
            console.print(f"Figma's info link: {error.upgrade_link}")
        raise typer.Exit(code=2) from error
    except FigmaError as error:
        console.print(f"[red]{error}[/red]")
        raise typer.Exit(code=2) from error

    if fetched:
        console.print(f"[green]Snapshot saved:[/green] {store.directory(manifest)}")
    else:
        console.print(
            f"Snapshot already exists (no network call made): {store.directory(manifest)}"
        )
        console.print("Pass --force to fetch again.")
    console.print(
        f"  file: {manifest.name}   version: {manifest.version}   "
        f"size: {manifest.raw_bytes / 1_000_000:.1f} MB   sha256: {manifest.sha256[:12]}..."
    )


@app.command()
def stats(
    snapshots_dir: SnapshotsDir = Path("snapshots"),
    sds_dir: Annotated[Path, typer.Option(help="Checkout of the figma/sds repo.")] = Path(
        "vendor/sds"
    ),
    top: Annotated[int, typer.Option(help="How many of the largest frames to list.")] = 25,
) -> None:
    """Census of the latest snapshot: sizes, dependency counts and join rates against SDS."""
    store = SnapshotStore(snapshots_dir)
    manifest = store.latest()
    if manifest is None:
        console.print("[red]No snapshot found.[/red] Run `contextslice ingest` first.")
        raise typer.Exit(code=1)

    with console.status("Loading snapshot..."):
        census = take_census(store.load_document(manifest))

    console.print(f"\n[bold]{manifest.name}[/bold]  (version {manifest.version})")
    _render_overview(census)
    _render_node_types(census)
    _render_bytes_by_property(census)
    if sds_dir.exists():
        _render_joins(census, sds_dir)
    else:
        console.print(f"[yellow]{sds_dir} not found: skipping join rates.[/yellow]")
    _render_frames(census, top)


@app.command(name="slice")
def slice_command(
    node: Annotated[str | None, typer.Option(help="Target node id, e.g. 562:9044.")] = None,
    name: Annotated[
        str | None, typer.Option(help='Words to match against node paths, e.g. "about desktop".')
    ] = None,
    snapshots_dir: SnapshotsDir = Path("snapshots"),
    sds_dir: Annotated[Path, typer.Option(help="Checkout of the figma/sds repo.")] = Path(
        "vendor/sds"
    ),
) -> None:
    """Dependency slice of a target: everything it transitively references, and nothing else."""
    store = SnapshotStore(snapshots_dir)
    manifest = store.latest()
    if manifest is None:
        console.print("[red]No snapshot found.[/red] Run `contextslice ingest` first.")
        raise typer.Exit(code=1)

    with console.status("Building IR and dependency graph..."):
        started = time.perf_counter()
        design = build_design_file(store.load_document(manifest), sds_dir)
        graph = build_graph(design)
        build_seconds = time.perf_counter() - started

    target_id = _resolve_target(design, node, name)

    started = time.perf_counter()
    members = dependency_slice(graph, slice_roots(design, target_id))
    slice_ms = (time.perf_counter() - started) * 1000
    summary = summarize(design, graph, target_id, members)

    console.print(f"\n[bold]Target:[/bold] {design.path_of(target_id)}  [dim]({target_id})[/dim]")
    console.print(
        f"[dim]graph: {graph.number_of_nodes():,} vertices, {graph.number_of_edges():,} edges "
        f"(built in {build_seconds:.1f}s); slice computed in {slice_ms:.1f} ms[/dim]"
    )
    _render_slice(summary, design)


@app.command(name="compile")
def compile_command(
    node: Annotated[str | None, typer.Option(help="Target node id, e.g. 175:4995.")] = None,
    name: Annotated[
        str | None, typer.Option(help='Words to match against node paths, e.g. "about desktop".')
    ] = None,
    substitute: Annotated[
        bool, typer.Option(help="Pass P4: replace mapped instances with component references.")
    ] = True,
    dedupe: Annotated[
        bool, typer.Option(help="Pass P5: fold runs of identical siblings into one line (xN).")
    ] = True,
    components: Annotated[
        str, typer.Option(help="Detail per code component: imports | example | full.")
    ] = "example",
    budget: Annotated[
        int | None, typer.Option(help="Token budget B: run budgeted selection (P7).")
    ] = None,
    selector: Annotated[
        str, typer.Option(help="Relevance for selection: ppr (PageRank) | bfs (depth decay).")
    ] = "ppr",
    request: Annotated[
        str | None, typer.Option(help="The developer's request; mentioned names get priority.")
    ] = None,
    out: Annotated[Path | None, typer.Option(help="Write the context bundle to this file.")] = None,
    show: Annotated[bool, typer.Option("--show", help="Print the whole bundle.")] = False,
    snapshots_dir: SnapshotsDir = Path("snapshots"),
    sds_dir: Annotated[Path, typer.Option(help="Checkout of the figma/sds repo.")] = Path(
        "vendor/sds"
    ),
) -> None:
    """Compile a target into a context bundle and show the per-pass token ledger."""
    if components not in ("imports", "example", "full"):
        console.print("[red]--components must be one of: imports, example, full.[/red]")
        raise typer.Exit(code=1)
    if selector not in ("ppr", "bfs"):
        console.print("[red]--selector must be ppr or bfs.[/red]")
        raise typer.Exit(code=1)

    store = SnapshotStore(snapshots_dir)
    manifest = store.latest()
    if manifest is None:
        console.print("[red]No snapshot found.[/red] Run `contextslice ingest` first.")
        raise typer.Exit(code=1)

    with console.status("Building IR..."):
        document = store.load_document(manifest)
        design = build_design_file(document, sds_dir)
    target_id = _resolve_target(design, node, name)

    with console.status("Compiling..."):
        result = compile_context(
            design,
            target_id,
            default_counter(),
            sds_root=sds_dir,
            raw_document=document,
            substitute=substitute,
            dedupe=dedupe,
            component_detail=components,  # type: ignore[arg-type]  (validated above)
            budget=budget,
            selector=selector,
            request=request,
        )

    console.print(f"\n[bold]Target:[/bold] {design.path_of(target_id)}  [dim]({target_id})[/dim]")
    _render_ledger(result)
    if result.verification.ok:
        limit = f" <= {budget}" if budget is not None else ""
        console.print(
            f"[green]verified:[/green] {result.verification.tokens:,} tokens{limit}, "
            "no dangling references\n"
        )
    else:
        for problem in result.verification.problems:
            console.print(f"[red]verification failed:[/red] {problem}")
        raise typer.Exit(code=3)

    if out is not None:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(result.bundle.text, encoding="utf-8", newline="\n")
        console.print(f"Bundle written to {out}")
    if show:
        console.print(result.bundle.text, markup=False, highlight=False)
    else:
        preview = result.bundle.text.splitlines()
        console.print("\n".join(preview[:30]), markup=False, highlight=False)
        if len(preview) > 30:
            console.print(f"[dim]... {len(preview) - 30} more lines (use --show or --out)[/dim]")


@app.command()
def explain(
    node: Annotated[str | None, typer.Option(help="Target node id, e.g. 175:4995.")] = None,
    name: Annotated[
        str | None, typer.Option(help='Words to match against node paths, e.g. "about desktop".')
    ] = None,
    top: Annotated[int, typer.Option(help="How many subtrees to list.")] = 15,
    snapshots_dir: SnapshotsDir = Path("snapshots"),
    sds_dir: Annotated[Path, typer.Option(help="Checkout of the figma/sds repo.")] = Path(
        "vendor/sds"
    ),
) -> None:
    """Where the tokens go: subtrees by *retained* tokens, and shared vs private definitions."""
    store = SnapshotStore(snapshots_dir)
    manifest = store.latest()
    if manifest is None:
        console.print("[red]No snapshot found.[/red] Run `contextslice ingest` first.")
        raise typer.Exit(code=1)

    with console.status("Building IR and graph..."):
        design = build_design_file(store.load_document(manifest), sds_dir)
        graph = build_graph(design)
    target_id = _resolve_target(design, node, name)

    counter = default_counter()
    with console.status("Compiling and analysing dominators..."):
        result = compile_context(design, target_id, counter, sds_root=sds_dir)
        ownership = analyze_ownership(design, graph, target_id, result.bundle.rendered, counter)

    rendered = result.bundle.rendered
    is_variable = rendered.variable_lines.__contains__
    is_mapping = rendered.component_entries.__contains__

    console.print(f"\n[bold]Target:[/bold] {design.path_of(target_id)}  [dim]({target_id})[/dim]")
    console.print(f"bundle: {result.tokens:,} tokens ({counter.name})\n")

    table = Table(title="Definitions: shared across subtrees vs private to one subtree")
    table.add_column("definitions")
    table.add_column("shared", justify="right")
    table.add_column("tokens", justify="right")
    table.add_column("private", justify="right")
    table.add_column("tokens", justify="right")
    for label, keys in (
        ("variables (TOKENS)", list(rendered.variable_lines)),
        ("code components (COMPONENTS)", list(rendered.component_entries)),
    ):
        shared_n, shared_t, private_n, private_t = definition_split(ownership, keys)
        table.add_row(label, str(shared_n), f"{shared_t:,}", str(private_n), f"{private_t:,}")
    console.print(table)
    console.print(
        "[dim]shared = no single subtree in the bundle dominates it (its uses come from "
        "independent subtrees), so dropping any one subtree never frees its tokens.[/dim]\n"
    )

    table = Table(title=f"Top {top} subtrees by retained tokens (what dropping each would free)")
    table.add_column("line")
    table.add_column("own", justify="right")
    table.add_column("retained", justify="right")
    table.add_column("private vars", justify="right")
    table.add_column("private comps", justify="right")
    for row in top_owners(ownership, rendered, is_variable, is_mapping, limit=top):
        table.add_row(
            row.line[:70] + ("…" if len(row.line) > 70 else ""),
            f"{row.own:,}",
            f"{row.retained:,}",
            str(row.private_variables),
            str(row.private_components),
        )
    console.print(table)


@app.command(name="eval")
def eval_command(
    budgets: Annotated[str, typer.Option(help="Comma-separated budgets for F/S/C.")] = "1000,2000",
    reps: Annotated[int, typer.Option(help="Repetitions per (task, arm, budget).")] = 1,
    tasks: Annotated[int, typer.Option(help="Use only the first N tasks (0 = all).")] = 0,
    arms: Annotated[str, typer.Option(help="Comma-separated subset of N,F,S,C,U.")] = "N,F,S,C,U",
    model: Annotated[str, typer.Option(help="Ollama model name.")] = "qwen2.5-coder:7b",
    out: Annotated[Path, typer.Option(help="Run directory.")] = Path("eval/runs/latest"),
    dry_run: Annotated[
        bool, typer.Option("--dry-run", help="Build contexts and prompts only; no generation.")
    ] = False,
    typecheck: Annotated[bool, typer.Option(help="Run tsc over the generated files.")] = True,
    snapshots_dir: SnapshotsDir = Path("snapshots"),
    sds_dir: Annotated[Path, typer.Option(help="Checkout of the figma/sds repo.")] = Path(
        "vendor/sds"
    ),
) -> None:
    """Generate implementations under each arm and score them (see docs/ROADMAP.md)."""
    from contextslice.eval.ollama_client import OllamaClient, ResponseCache
    from contextslice.eval.runner import RunConfig, run
    from contextslice.eval.tasks import load_tasks

    store = SnapshotStore(snapshots_dir)
    manifest = store.latest()
    if manifest is None:
        console.print("[red]No snapshot found.[/red] Run `contextslice ingest` first.")
        raise typer.Exit(code=1)

    with console.status("Building IR and graph..."):
        design = build_design_file(store.load_document(manifest), sds_dir)
        graph = build_graph(design)

    task_list = load_tasks()
    if tasks:
        task_list = task_list[:tasks]
    config = RunConfig(
        model=model,
        budgets=[int(b) for b in budgets.split(",") if b.strip()],
        reps=reps,
        arms=tuple(a.strip() for a in arms.split(",") if a.strip()),
        task_ids=[t.id for t in task_list],
        dry_run=dry_run,
        typecheck=typecheck,
    )
    samples = run(
        design,
        graph,
        task_list,
        config,
        out,
        default_counter(),
        sds_dir,
        OllamaClient(),
        ResponseCache(Path("eval/cache")),
        log=lambda message: console.print(message, markup=False, highlight=False),
    )
    _render_eval_summary(samples, dry_run)
    console.print(f"\nresults written to {out}")


@app.command()
def report(
    run: Annotated[Path, typer.Option(help="Run directory with results.jsonl.")] = Path(
        "eval/runs/latest"
    ),
) -> None:
    """Per-arm means and paired comparisons for a finished run; also writes report.md."""
    from contextslice.eval.report import render_markdown
    from contextslice.eval.runner import load_results

    rows = load_results(run)
    markdown = render_markdown(rows, f"ContextSlice evaluation: {run.name}")
    (run / "report.md").write_text(markdown, encoding="utf-8", newline="\n")
    console.print(markdown, markup=False, highlight=False)
    console.print(f"\nwritten to {run / 'report.md'}")


def _render_eval_summary(samples: list, dry_run: bool) -> None:
    from collections import defaultdict

    groups: dict[tuple[str, int | None], list] = defaultdict(list)
    for sample in samples:
        groups[(sample.arm, sample.budget)].append(sample)

    def mean(values: list[float | None]) -> str:
        real = [v for v in values if v is not None]
        return f"{sum(real) / len(real):.2f}" if real else "-"

    table = Table(title="Per-arm means" + (" (dry run: prompts only)" if dry_run else ""))
    for column in ("arm", "B", "n", "ctx tokens", "prompt tokens"):
        table.add_column(column, justify="right")
    if not dry_run:
        for column in ("reuse recall", "token rate", "tsc pass", "out tokens", "prompt s", "gen s"):
            table.add_column(column, justify="right")
    for (arm, budget), group in sorted(groups.items(), key=lambda kv: (kv[0][0], kv[0][1] or 0)):
        row = [
            arm,
            str(budget or "-"),
            str(len(group)),
            mean([s.context_tokens for s in group]),
            mean([s.prompt_tokens or s.prompt_tokens_estimate for s in group]),
        ]
        if not dry_run:
            scored = [s for s in group if s.extracted]
            row += [
                mean([s.reuse_matched / s.reuse_expected for s in scored if s.reuse_expected]),
                mean(
                    [
                        s.variable_refs / (s.variable_refs + s.hardcoded_hex + s.hardcoded_px)
                        for s in scored
                        if s.variable_refs + s.hardcoded_hex + s.hardcoded_px
                    ]
                ),
                mean([float(s.tsc_pass) for s in scored if s.tsc_checked]),
                mean([s.output_tokens for s in scored]),
                mean([s.prompt_seconds for s in scored]),
                mean([s.output_seconds for s in scored]),
            ]
        table.add_row(*row)
    console.print(table)


def _render_ledger(result: CompileResult) -> None:
    table = Table(title=f"Token ledger  (tokenizer: {result.counter_name})")
    table.add_column("after stage")
    table.add_column("nodes", justify="right")
    table.add_column("tokens", justify="right")
    table.add_column("vs previous", justify="right")
    table.add_column("vs raw", justify="right")

    first = result.ledger[0].tokens
    previous: int | None = None
    for row in result.ledger:
        step = f"{row.tokens / previous:.1%}" if previous else ""
        table.add_row(
            row.stage, f"{row.nodes:,}", f"{row.tokens:,}", step, f"{row.tokens / first:.2%}"
        )
        previous = row.tokens
    console.print(table)

    sections = "   ".join(f"{name}: {tokens:,}" for name, tokens in result.section_tokens.items())
    console.print(
        f"[dim]final bundle by section -> {sections}   (compiled in {result.seconds:.2f}s)[/dim]\n"
    )


def _resolve_target(design: DesignFile, node: str | None, name: str | None) -> str:
    if node is not None:
        if node not in design.nodes:
            console.print(f"[red]No node with id {node!r} in this snapshot.[/red]")
            raise typer.Exit(code=1)
        return node
    if name is None:
        console.print("[red]Pass --node <id> or --name <words>.[/red]")
        raise typer.Exit(code=1)

    candidates = find_targets(design, name)
    if len(candidates) == 1:
        return candidates[0].id

    if not candidates:
        console.print(f"[red]Nothing matches {name!r}.[/red]")
    else:  # ambiguous: show the options instead of guessing
        table = Table(title=f"{len(candidates)} candidates for {name!r}: re-run with --node <id>")
        table.add_column("id")
        table.add_column("kind")
        table.add_column("path")
        for candidate in candidates:
            table.add_row(candidate.id, candidate.kind, design.path_of(candidate.id))
        console.print(table)
    raise typer.Exit(code=1)


def _render_slice(summary: SliceSummary, design: DesignFile) -> None:
    total_components = sum(n.kind is NodeKind.COMPONENT for n in design.nodes.values())
    total_variables = len(design.variables)

    table = Table(title="Slice (the candidate universe for this target)", show_header=False)
    rows: dict[str, str] = {
        "design nodes": f"{summary.design_nodes:,} of {len(design.nodes):,}",
        "  inlined instance copies": f"{summary.inlined_nodes:,}",
        "instances": f"{summary.instances:,}",
        "  with a code mapping": f"{summary.instances_with_mapping:,}",
        "components": f"{summary.components:,} of {total_components:,}",
        "component sets": f"{summary.component_sets:,}",
        "missing (remote) components": f"{summary.missing_components:,}",
        "variables": f"{summary.variables:,} of {total_variables:,}",
        "  reached only through an alias": f"{summary.variables_via_alias_only:,}",
        "  unresolved": f"{summary.unresolved_variables:,}",
        "shared styles": f"{summary.styles:,}",
        "code mappings": f"{summary.mappings:,} of {len(design.mappings):,}",
        "raw JSON of sliced nodes": f"~{summary.raw_chars // 4:,} tokens",
        "after P0 normalization": f"~{summary.normalized_chars // 4:,} tokens",
    }
    for label, value in rows.items():
        table.add_row(label, value)
    console.print(table)


def _render_overview(census: Census) -> None:
    table = Table(title="Overview", show_header=False)
    rows = {
        "nodes": census.total_nodes,
        "max depth": census.max_depth,
        "hidden nodes": census.hidden_nodes,
        "components": census.components,
        "  of which remote (library)": census.remote_components,
        "component sets": census.component_sets,
        "instances": census.instances,
        "  of which unresolved": census.unresolved_instances,
        "nodes inlined under instances": census.instance_sublayers,
        "variable bindings": census.variable_bindings,
        "distinct variables bound": len(census.bound_variable_ids),
        "top-level frames": len(census.frames),
    }
    for label, value in rows.items():
        table.add_row(label, f"{value:,}")
    console.print(table)


def _render_node_types(census: Census) -> None:
    table = Table(title="Nodes by type")
    table.add_column("type")
    table.add_column("count", justify="right")
    for node_type, count in census.by_type.most_common():
        table.add_row(node_type, f"{count:,}")
    console.print(table)


def _render_bytes_by_property(census: Census, top: int = 12) -> None:
    total = sum(census.bytes_by_property.values())
    table = Table(title=f"Where the bytes go (top {top} node properties)")
    table.add_column("property")
    table.add_column("MB", justify="right")
    table.add_column("share", justify="right")
    for name, size in census.bytes_by_property.most_common(top):
        table.add_row(name, f"{size / 1_000_000:.2f}", _percent(size, total))
    console.print(table)


def _render_joins(census: Census, sds_dir: Path) -> None:
    """How well do ids in the snapshot line up with ids in the SDS repo? (ADR-0002 assumption)"""
    token_ids = {sds.normalize_variable_id(t.figma_id) for t in sds.load_tokens(sds_dir)}
    bound_ids = {sds.normalize_variable_id(v) for v in census.bound_variable_ids}
    mapped_nodes = sds.load_code_connect_node_ids(sds_dir)
    mapped_found = sum(1 for node_id in mapped_nodes.values() if node_id in census.node_ids)

    table = Table(title="Join rates: snapshot <-> figma/sds repo")
    table.add_column("join")
    table.add_column("matched", justify="right")
    table.add_column("rate", justify="right")
    table.add_row(
        "variables bound in file that exist in tokens.json",
        f"{len(bound_ids & token_ids):,} / {len(bound_ids):,}",
        _percent(len(bound_ids & token_ids), len(bound_ids)),
    )
    table.add_row(
        "Code Connect node ids that exist in file",
        f"{mapped_found:,} / {len(mapped_nodes):,}",
        _percent(mapped_found, len(mapped_nodes)),
    )
    console.print(table)


def _render_frames(census: Census, top: int) -> None:
    table = Table(title=f"Largest top-level frames (top {top}; tokens are a chars/4 estimate)")
    for column in ("page", "frame", "id", "type"):
        table.add_column(column)
    for column in ("nodes", "instances", "~tokens (raw JSON)"):
        table.add_column(column, justify="right")

    largest = sorted(census.frames, key=lambda f: f.approx_tokens, reverse=True)[:top]
    for frame in largest:
        table.add_row(
            frame.page,
            frame.name,
            frame.node_id,
            frame.node_type,
            f"{frame.node_count:,}",
            f"{frame.instance_count:,}",
            f"{frame.approx_tokens:,}",
        )
    console.print(table)


def _percent(part: int, whole: int) -> str:
    return f"{100 * part / whole:.1f}%" if whole else "n/a"
