import json

import httpx
import pytest

from contextslice.ingest.figma_client import FigmaClient
from contextslice.ingest.snapshot import SnapshotStore, ingest_file


class CountingTransport(httpx.MockTransport):
    """Serves a fixed body and counts how many requests were made."""

    def __init__(self, body: bytes) -> None:
        self.calls = 0

        def handler(request: httpx.Request) -> httpx.Response:
            self.calls += 1
            return httpx.Response(200, content=body)

        super().__init__(handler)


def test_ingest_writes_a_loadable_snapshot_with_provenance(tmp_path, toy_document) -> None:
    body = json.dumps(toy_document).encode()
    store = SnapshotStore(tmp_path)

    with FigmaClient("t", transport=CountingTransport(body)) as client:
        manifest, fetched = ingest_file(client, store, "abc123")

    assert fetched is True
    assert (manifest.name, manifest.version) == ("Toy Design System", "42")
    assert manifest.raw_bytes == len(body)
    assert store.load_document(manifest) == toy_document
    assert store.directory(manifest) == tmp_path / "abc123" / "42"


def test_second_ingest_reuses_the_snapshot_without_touching_the_network(
    tmp_path, toy_document
) -> None:
    transport = CountingTransport(json.dumps(toy_document).encode())
    store = SnapshotStore(tmp_path)

    with FigmaClient("t", transport=transport) as client:
        first, _ = ingest_file(client, store, "abc123")
        second, fetched = ingest_file(client, store, "abc123")

    assert transport.calls == 1
    assert fetched is False
    assert second == first


def test_force_fetches_again(tmp_path, toy_document) -> None:
    transport = CountingTransport(json.dumps(toy_document).encode())
    store = SnapshotStore(tmp_path)

    with FigmaClient("t", transport=transport) as client:
        ingest_file(client, store, "abc123")
        _, fetched = ingest_file(client, store, "abc123", force=True)

    assert transport.calls == 2
    assert fetched is True


def test_truncated_download_is_never_promoted_to_a_snapshot(tmp_path) -> None:
    store = SnapshotStore(tmp_path)
    truncated = b'{"name": "Toy", "version": "42", "docu'

    with (
        FigmaClient("t", transport=CountingTransport(truncated)) as client,
        pytest.raises(json.JSONDecodeError),
    ):
        ingest_file(client, store, "abc123")

    assert store.latest("abc123") is None
    assert not list(tmp_path.rglob("*.gz"))  # the temp file was cleaned up too


def test_identical_responses_produce_byte_identical_archives(tmp_path, toy_document) -> None:
    body = json.dumps(toy_document).encode()
    archives = []
    for run in ("a", "b"):
        store = SnapshotStore(tmp_path / run)
        with FigmaClient("t", transport=CountingTransport(body)) as client:
            manifest, _ = ingest_file(client, store, "abc123")
        archives.append((store.directory(manifest) / "file.json.gz").read_bytes())

    assert archives[0] == archives[1]
