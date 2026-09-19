"""The experimental arms: what design context each condition puts in front of the model.

All arms share the prompt scaffold (prompt.py) and, where budgeted, the same budget B and the
same tokenizer. They differ only in how the context was produced:

* **N** (null): no design context at all. Measures what the model already knows about SDS.
* **F** (flat): the normalized outline with no substitution, dedupe or selection, truncated in
  tree order to B. Roughly what a plain "simplify the JSON" tool gives you.
* **S** (slice + BFS): the full compiler with the breadth-first-decay selector.
* **C** (ContextSlice): the full compiler with the PageRank selector.
* **U** (unbudgeted): the full compiler with no budget: the upper bound on context.
"""

import re
import time
from dataclasses import dataclass
from pathlib import Path

import networkx as nx

from contextslice.compile import compile_context
from contextslice.emit import Bundle
from contextslice.eval.tasks import Task
from contextslice.ir import DesignFile
from contextslice.select import BudgetError
from contextslice.tokens import TokenCounter

ARMS = ("N", "F", "S", "C", "U")
BUDGETED_ARMS = ("F", "S", "C")
_TOKEN_REF = re.compile(r"\$([a-z0-9-]+)")


@dataclass(frozen=True)
class Context:
    arm: str
    budget: int | None
    text: str | None
    tokens: int  # tokens of the context text under our counter (0 for N)
    compile_seconds: float
    note: str = ""


@dataclass(frozen=True)
class Expectations:
    """Ground truth for a task, taken from the unbudgeted bundle (not from any budgeted arm)."""

    components: frozenset[str]
    token_values: dict[str, str]  # css name (without --sds-) -> resolved value


def expectations_from(bundle: Bundle) -> Expectations:
    components = {
        line.split(":", 1)[0]
        for line in bundle.components.splitlines()[1:]
        if line and not line.startswith(" ")
    }
    token_values = {}
    for line in bundle.tokens.splitlines()[1:]:
        name, _, value = line.partition(": ")
        token_values[name] = value
    return Expectations(components=frozenset(components), token_values=token_values)


def build_contexts(
    design: DesignFile,
    graph: nx.MultiDiGraph,
    task: Task,
    budgets: list[int],
    counter: TokenCounter,
    sds_root: Path,
    arms: tuple[str, ...] = ARMS,
) -> tuple[list[Context], Expectations]:
    contexts: list[Context] = []

    started = time.perf_counter()
    unbudgeted = compile_context(design, task.node_id, counter, sds_root=sds_root, graph=graph)
    expectations = expectations_from(unbudgeted.bundle)
    if "U" in arms:
        contexts.append(
            Context("U", None, unbudgeted.bundle.text, unbudgeted.tokens, unbudgeted.seconds)
        )
    if "N" in arms:
        contexts.append(Context("N", None, None, 0, 0.0))

    if "F" in arms:
        flat = compile_context(
            design, task.node_id, counter, sds_root=sds_root, substitute=False, dedupe=False
        )
        for budget in budgets:
            text = truncate_outline(flat.bundle, counter, budget)
            contexts.append(Context("F", budget, text, counter.count(text), flat.seconds))

    for arm, selector in (("S", "bfs"), ("C", "ppr")):
        if arm not in arms:
            continue
        for budget in budgets:
            try:
                result = compile_context(
                    design,
                    task.node_id,
                    counter,
                    sds_root=sds_root,
                    graph=graph,
                    budget=budget,
                    selector=selector,
                    request=task.request,
                )
            except BudgetError as error:
                contexts.append(Context(arm, budget, None, 0, 0.0, note=str(error)))
                continue
            assert result.verification.ok, result.verification.problems
            contexts.append(Context(arm, budget, result.bundle.text, result.tokens, result.seconds))

    _ = time.perf_counter() - started
    return contexts, expectations


def truncate_outline(bundle: Bundle, counter: TokenCounter, budget: int) -> str:
    """Structure-aware truncation: keep TREE lines in order until the budget is spent, then
    keep only the TOKENS lines those kept lines still reference. Never cuts a line in half."""
    tree_lines = bundle.tree.splitlines()[1:]
    token_lines = {line.split(":", 1)[0]: line for line in bundle.tokens.splitlines()[1:]}

    def assemble(kept: list[str]) -> str:
        used = set(_TOKEN_REF.findall("\n".join(kept)))
        tokens = [token_lines[name] for name in sorted(used) if name in token_lines]
        sections = [
            bundle.header,
            "\n".join(["## TOKENS", *tokens]) if tokens else "",
            "\n".join(["## TREE", *kept]),
        ]
        return "\n\n".join(section for section in sections if section) + "\n"

    kept: list[str] = []
    for line in tree_lines:
        candidate = [*kept, line]
        if counter.count(assemble(candidate)) > budget:
            break
        kept = candidate
    return assemble(kept)
