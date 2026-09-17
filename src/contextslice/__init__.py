"""ContextSlice: compile a large Figma design into the smallest useful agent context."""

from importlib.metadata import version

# Single source of truth for the version is pyproject.toml; read it back at runtime.
__version__ = version("contextslice")
