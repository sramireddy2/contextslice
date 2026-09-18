"""Pass P9: verify the bundle before it leaves the compiler.

A compiler's last pass is the one that refuses to emit something broken. Three invariants:

1. the exact token count is within the budget (when one was given);
2. no dangling references: every ``$token`` used in the TREE is defined in TOKENS, and every
   ``<Component`` used in the TREE has an entry in COMPONENTS;
3. the output is deterministic (checked by the test suite: two compiles are byte-identical).
"""

import re
from dataclasses import dataclass

from contextslice.emit import Bundle
from contextslice.tokens import TokenCounter

_TOKEN_REF = re.compile(r"\$([a-z0-9-]+)")
_COMPONENT_REF = re.compile(r"^\s*<([A-Za-z0-9_]+)")


@dataclass(frozen=True)
class Verification:
    tokens: int
    budget: int | None
    problems: tuple[str, ...]

    @property
    def ok(self) -> bool:
        return not self.problems


def verify(bundle: Bundle, counter: TokenCounter, budget: int | None = None) -> Verification:
    problems: list[str] = []
    tokens = counter.count(bundle.text)
    if budget is not None and tokens > budget:
        problems.append(f"bundle is {tokens} tokens, over the budget of {budget}")

    defined_tokens = {line.split(":", 1)[0] for line in bundle.tokens.splitlines()[1:]}
    used_tokens = set(_TOKEN_REF.findall(bundle.tree))
    for name in sorted(used_tokens - defined_tokens):
        problems.append(f"dangling token reference ${name}")

    defined_components = {
        line.split(":", 1)[0]
        for line in bundle.components.splitlines()[1:]
        if not line.startswith(" ")
    }
    used_components = {
        match.group(1) for line in bundle.tree.splitlines() if (match := _COMPONENT_REF.match(line))
    }
    for name in sorted(used_components - defined_components):
        problems.append(f"dangling component reference <{name}>")

    return Verification(tokens=tokens, budget=budget, problems=tuple(problems))
