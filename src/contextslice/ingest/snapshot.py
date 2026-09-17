"""On-disk snapshots of a Figma file: fetch once, validate, then never call Figma again.

Layout::

    snapshots/<file_key>/<version>/file.json.gz    raw API response, gzip-compressed
    snapshots/<file_key>/<version>/manifest.json   provenance: what, when, size, sha256

Two properties matter here:

* **Idempotent.** If a snapshot already exists, ``ingest_file`` returns it without any network
  call. Re-running the command is always safe and never spends rate-limit quota.
* **Atomic.** The download streams into a temp file that is only *promoted* to its final name
  after it parses as complete JSON. A crash or dropped connection can never leave a half-written
  file that looks like a valid snapshot.
"""

import gzip
import hashlib
import json
import os
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from contextslice.ingest.figma_client import FigmaClient

_DATA_FILE = "file.json.gz"
_MANIFEST_FILE = "manifest.json"
_INCOMING_FILE = ".incoming.json.gz"


@dataclass(frozen=True)
class SnapshotManifest:
    file_key: str
    name: str
    version: str
    last_modified: str
    fetched_at: str
    raw_bytes: int
    sha256: str


class SnapshotStore:
    def __init__(self, root: Path) -> None:
        self.root = root

    def manifests(self, file_key: str | None = None) -> list[SnapshotManifest]:
        """All snapshots (optionally for one file), oldest first."""
        pattern = f"{file_key or '*'}/*/{_MANIFEST_FILE}"
        found = [
            SnapshotManifest(**json.loads(path.read_text(encoding="utf-8")))
            for path in self.root.glob(pattern)
        ]
        return sorted(found, key=lambda m: m.fetched_at)

    def latest(self, file_key: str | None = None) -> SnapshotManifest | None:
        found = self.manifests(file_key)
        return found[-1] if found else None

    def directory(self, manifest: SnapshotManifest) -> Path:
        return self.root / manifest.file_key / manifest.version

    def load_document(self, manifest: SnapshotManifest) -> dict[str, Any]:
        with gzip.open(self.directory(manifest) / _DATA_FILE, "rt", encoding="utf-8") as fh:
            return json.load(fh)


def ingest_file(
    client: FigmaClient, store: SnapshotStore, file_key: str, *, force: bool = False
) -> tuple[SnapshotManifest, bool]:
    """Return ``(manifest, fetched)``; ``fetched`` is False when an existing snapshot was reused."""
    existing = store.latest(file_key)
    if existing is not None and not force:
        return existing, False

    staging_dir = store.root / file_key
    staging_dir.mkdir(parents=True, exist_ok=True)
    incoming = staging_dir / _INCOMING_FILE

    try:
        digest = hashlib.sha256()
        with (
            open(incoming, "wb") as raw,
            # mtime=0 keeps the gzip header free of timestamps, so the same API response always
            # produces byte-identical output (deterministic artifacts are diffable + cacheable).
            gzip.GzipFile(filename="", mode="wb", fileobj=raw, mtime=0) as gz,
        ):

            def sink(chunk: bytes) -> None:
                digest.update(chunk)
                gz.write(chunk)

            raw_bytes = client.download_file_json(file_key, sink)

        # Validate BEFORE promoting: a truncated download fails to parse and is discarded.
        with gzip.open(incoming, "rt", encoding="utf-8") as fh:
            document = json.load(fh)

        manifest = SnapshotManifest(
            file_key=file_key,
            name=str(document["name"]),
            version=str(document["version"]),
            last_modified=str(document["lastModified"]),
            fetched_at=datetime.now(UTC).isoformat(timespec="seconds"),
            raw_bytes=raw_bytes,
            sha256=digest.hexdigest(),
        )

        final_dir = store.directory(manifest)
        final_dir.mkdir(parents=True, exist_ok=True)
        os.replace(incoming, final_dir / _DATA_FILE)  # atomic rename on the same volume
        (final_dir / _MANIFEST_FILE).write_text(
            json.dumps(asdict(manifest), indent=2) + "\n", encoding="utf-8"
        )
        return manifest, True
    finally:
        incoming.unlink(missing_ok=True)
