"""Smoke test: proves the package installs and the CLI entry point is wired up."""

from typer.testing import CliRunner

from contextslice import __version__
from contextslice.cli import app


def test_version_command_prints_package_version() -> None:
    result = CliRunner().invoke(app, ["version"])

    assert result.exit_code == 0
    assert result.stdout.strip() == f"contextslice {__version__}"
