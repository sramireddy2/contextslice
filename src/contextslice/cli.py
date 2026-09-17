"""Command-line entry point.

Each compiler stage gets its own subcommand as we build it
(ingest -> stats -> slice -> compile -> explain -> eval), so every step of the
project ends with something you can run from a terminal.

This module only parses arguments and renders output; all logic lives in importable,
unit-tested modules.
"""

from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.table import Table

from contextslice import __version__, sds
from contextslice.config import ConfigError, Settings
from contextslice.ingest.figma_client import FigmaClient, FigmaError, FigmaRateLimitedError
from contextslice.ingest.snapshot import SnapshotStore, ingest_file
from contextslice.stats import Census, take_census

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
