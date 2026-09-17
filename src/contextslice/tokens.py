"""Token counting behind an interface.

A budget of "8,000 tokens" only means something relative to a specific tokenizer: the same text
is a different number of tokens for different model families. So the compiler never counts
tokens itself; it asks a ``TokenCounter``, and the target model decides which one is plugged in.
"""

from pathlib import Path
from typing import Protocol

DEFAULT_TOKENIZER = Path("assets/tokenizers/qwen2.5-coder/tokenizer.json")


class TokenCounter(Protocol):
    """Structural interface (type-checked duck typing): anything with these members fits."""

    name: str

    def count(self, text: str) -> int: ...


class ApproxTokenCounter:
    """~4 characters per token. No dependencies; for unit tests and as a last-resort fallback."""

    name = "approx-chars/4"

    def count(self, text: str) -> int:
        return (len(text) + 3) // 4


class HfTokenCounter:
    """Exact counts using a model's own ``tokenizer.json`` (Hugging Face ``tokenizers`` library).

    Runs fully offline from a file on disk. The default file is Qwen2.5-Coder's tokenizer, the
    family of local models the evaluation uses.
    """

    def __init__(self, tokenizer_file: Path = DEFAULT_TOKENIZER) -> None:
        from tokenizers import Tokenizer  # imported lazily: the Rust extension is slow to load

        self._tokenizer = Tokenizer.from_file(str(tokenizer_file))
        self.name = f"hf:{tokenizer_file.parent.name}"

    def count(self, text: str) -> int:
        # No special tokens: we are measuring the text itself, not a chat-formatted prompt.
        return len(self._tokenizer.encode(text, add_special_tokens=False).ids)


def default_counter() -> TokenCounter:
    """The exact tokenizer when its file is available, otherwise the approximation."""
    if DEFAULT_TOKENIZER.exists():
        return HfTokenCounter(DEFAULT_TOKENIZER)
    return ApproxTokenCounter()
