import pytest

from contextslice.config import ConfigError, Settings, parse_file_key


def test_token_never_appears_in_repr() -> None:
    settings = Settings(figma_file_key="abc123", figma_token="figd_secret")

    assert "figd_secret" not in repr(settings)
    assert "abc123" in repr(settings)


def test_file_key_is_extracted_from_a_full_url() -> None:
    url = "https://www.figma.com/design/AbC123xyz/Simple-Design-System?node-id=1-2"

    assert parse_file_key(url) == "AbC123xyz"
    assert parse_file_key("  AbC123xyz  ") == "AbC123xyz"


@pytest.mark.parametrize("bad", ["", "   ", "../../etc/passwd", "abc/def", "abc def"])
def test_malformed_file_keys_are_rejected(bad: str) -> None:
    with pytest.raises(ConfigError):
        parse_file_key(bad)


def test_missing_token_is_a_config_error(monkeypatch, tmp_path) -> None:
    monkeypatch.delenv("FIGMA_TOKEN", raising=False)
    monkeypatch.setenv("FIGMA_FILE_KEY", "abc123")

    with pytest.raises(ConfigError, match="FIGMA_TOKEN"):
        Settings.from_env(env_file=tmp_path / "does-not-exist.env")
