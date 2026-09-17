"""Runtime settings, loaded from environment variables (optionally via a local .env file).

Security notes:
- The Figma token is a secret. It is excluded from ``repr`` so it cannot leak through logs,
  tracebacks or a debugger, and nothing in this package ever prints it.
- The file key becomes part of a URL *and* a directory name, so it is validated against a strict
  allowlist pattern before use (prevents path traversal such as ``../..``).
"""

import os
import re
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

_FILE_KEY_PATTERN = re.compile(r"[A-Za-z0-9]+")
_FILE_KEY_IN_URL = re.compile(r"figma\.com/(?:design|file)/([A-Za-z0-9]+)")


class ConfigError(Exception):
    """Raised when required settings are missing or malformed."""


@dataclass(frozen=True)
class Settings:
    figma_file_key: str
    figma_token: str = field(repr=False)

    @classmethod
    def from_env(cls, env_file: Path | None = None) -> "Settings":
        """Load settings from the process environment, falling back to a ``.env`` file.

        Real environment variables win over the file (``override=False``), which is the
        convention CI systems and containers rely on.
        """
        load_dotenv(env_file or Path.cwd() / ".env", override=False)

        token = os.environ.get("FIGMA_TOKEN", "").strip()
        if not token:
            raise ConfigError("FIGMA_TOKEN is not set. Copy .env.example to .env and fill it in.")

        return cls(
            figma_file_key=parse_file_key(os.environ.get("FIGMA_FILE_KEY", "")),
            figma_token=token,
        )


def parse_file_key(raw: str) -> str:
    """Accept either a bare file key or a full Figma URL, and return the validated key."""
    raw = raw.strip()
    if not raw:
        raise ConfigError("FIGMA_FILE_KEY is not set. Copy .env.example to .env and fill it in.")

    url_match = _FILE_KEY_IN_URL.search(raw)
    key = url_match.group(1) if url_match else raw

    if not _FILE_KEY_PATTERN.fullmatch(key):
        raise ConfigError(
            "FIGMA_FILE_KEY must be the alphanumeric id from your file's URL "
            "(the part after /design/)."
        )
    return key
