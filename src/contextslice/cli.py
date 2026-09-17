"""Command-line entry point.

Each compiler stage gets its own subcommand as we build it
(ingest -> stats -> slice -> compile -> explain -> eval), so every step of the
project ends with something you can run from a terminal.
"""

import typer

from contextslice import __version__

app = typer.Typer(
    help="Compile a large Figma design into the smallest useful agent context.",
    no_args_is_help=True,
)


@app.callback()
def main() -> None:
    """Root command group.

    Declaring a callback keeps Typer in "multi-command" mode even while
    `version` is the only subcommand.
    """


@app.command()
def version() -> None:
    """Print the installed ContextSlice version."""
    typer.echo(f"contextslice {__version__}")
