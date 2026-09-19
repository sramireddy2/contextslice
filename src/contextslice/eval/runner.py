"""Run the experiment: contexts -> prompts -> generations (cached) -> static metrics -> tsc.

Everything the analysis needs is written to the run directory: the exact context each arm saw,
every generated file, and one JSON record per sample in ``results.jsonl``.
"""

import json
import time
from collections.abc import Callable
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

import networkx as nx

from contextslice.eval.arms import ARMS, BUDGETED_ARMS, Context, Expectations, build_contexts
from contextslice.eval.metrics import (
    component_reuse,
    extract_tsx,
    import_usage,
    token_adherence,
)
from contextslice.eval.ollama_client import OllamaClient, ResponseCache, generate
from contextslice.eval.prompt import build_prompt
from contextslice.eval.tasks import Task
from contextslice.eval.typecheck import baseline_errors, type_check
from contextslice.ir import DesignFile
from contextslice.tokens import TokenCounter


@dataclass
class Sample:
    id: str
    task_id: str
    arm: str
    budget: int | None
    rep: int
    context_tokens: int
    compile_seconds: float
    prompt_tokens_estimate: int
    # filled after generation
    generated: bool = False
    cached: bool = False
    prompt_tokens: int = 0
    output_tokens: int = 0
    load_seconds: float = 0.0
    prompt_seconds: float = 0.0
    output_seconds: float = 0.0
    truncated: bool = False
    extracted: bool = False
    reuse_expected: int = 0
    reuse_used: int = 0
    reuse_matched: int = 0
    raw_elements: int = 0
    disallowed_modules: list[str] = field(default_factory=list)
    variable_refs: int = 0
    hardcoded_hex: int = 0
    hardcoded_px: int = 0
    missed_tokens: int = 0
    tsc_checked: bool = False
    tsc_pass: bool = False
    tsc_errors: dict[str, int] = field(default_factory=dict)
    note: str = ""


@dataclass(frozen=True)
class RunConfig:
    model: str
    budgets: list[int]
    reps: int
    arms: tuple[str, ...]
    task_ids: list[str]
    dry_run: bool
    typecheck: bool


def run(
    design: DesignFile,
    graph: nx.MultiDiGraph,
    tasks: list[Task],
    config: RunConfig,
    out_dir: Path,
    counter: TokenCounter,
    sds_root: Path,
    client: OllamaClient,
    cache: ResponseCache,
    log: Callable[[str], None] = print,
) -> list[Sample]:
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "contexts").mkdir(exist_ok=True)
    (out_dir / "generations").mkdir(exist_ok=True)
    (out_dir / "config.json").write_text(
        json.dumps(asdict(config), indent=2) + "\n", encoding="utf-8", newline="\n"
    )

    samples: list[Sample] = []
    sources: dict[str, str] = {}
    expectations: dict[str, Expectations] = {}
    durations: list[float] = []

    plan = [
        (task, arm, budget, rep)
        for task in tasks
        for arm in config.arms
        for budget in (config.budgets if arm in BUDGETED_ARMS else [None])
        for rep in range(config.reps)
    ]
    log(
        f"{len(plan)} samples planned ({len(tasks)} tasks x arms {config.arms} x budgets "
        f"{config.budgets} x {config.reps} rep(s))"
    )

    contexts_by_task: dict[str, dict[tuple[str, int | None], Context]] = {}
    for task in tasks:
        contexts, expectations[task.id] = build_contexts(
            design, graph, task, config.budgets, counter, sds_root, config.arms
        )
        contexts_by_task[task.id] = {(c.arm, c.budget): c for c in contexts}
        for context in contexts:
            if context.text is not None:
                name = f"{task.id}_{context.arm}{context.budget or ''}.txt"
                (out_dir / "contexts" / name).write_text(
                    context.text, encoding="utf-8", newline="\n"
                )

    for index, (task, arm, budget, rep) in enumerate(plan, start=1):
        context = contexts_by_task[task.id][(arm, budget)]
        prompt = build_prompt(task, context.text)
        sample = Sample(
            id=f"{task.id}_{arm}{budget or ''}_r{rep}",
            task_id=task.id,
            arm=arm,
            budget=budget,
            rep=rep,
            context_tokens=context.tokens,
            compile_seconds=context.compile_seconds,
            prompt_tokens_estimate=counter.count(prompt.system + prompt.user),
            note=context.note,
        )
        samples.append(sample)
        if config.dry_run or (context.text is None and arm != "N"):
            continue

        started = time.perf_counter()
        generation = generate(client, cache, config.model, prompt, rep)
        elapsed = time.perf_counter() - started
        if not generation.cached:
            durations.append(elapsed)
        sample.generated = True
        sample.cached = generation.cached
        sample.prompt_tokens = generation.prompt_tokens
        sample.output_tokens = generation.output_tokens
        sample.load_seconds = generation.load_seconds
        sample.prompt_seconds = generation.prompt_seconds
        sample.output_seconds = generation.output_seconds
        sample.truncated = generation.done_reason == "length"

        code = extract_tsx(generation.text)
        sample.extracted = code is not None
        if code is not None:
            (out_dir / "generations" / f"{sample.id}.tsx").write_text(
                code, encoding="utf-8", newline="\n"
            )
            sources[sample.id] = code
            _score(sample, code, expectations[task.id])

        remaining = len(plan) - index
        average = sum(durations) / len(durations) if durations else 0.0
        eta = (
            f", ~{remaining * average / 60:.0f} min left at {average:.0f}s/generation"
            if average
            else ""
        )
        state = "cache" if generation.cached else f"{elapsed:.0f}s"
        log(
            f"[{index}/{len(plan)}] {sample.id}: {generation.output_tokens} tokens out "
            f"({state}){eta}"
        )

    if config.typecheck and sources and not config.dry_run:
        baseline = baseline_errors(sds_root)
        log(
            f"type-checking {len(sources)} generated files against the SDS project "
            f"(baseline: {len(baseline)} pre-existing errors in SDS itself, ignored)..."
        )
        (out_dir / "tsc_baseline.json").write_text(
            json.dumps([asdict(e) for e in baseline], indent=1) + "\n",
            encoding="utf-8",
            newline="\n",
        )
        results = type_check(sds_root, sources)
        for sample in samples:
            if sample.id in results:
                summary = results[sample.id]
                sample.tsc_checked = True
                sample.tsc_pass = summary.passes
                sample.tsc_errors = dict(summary.by_kind)

    with (out_dir / "results.jsonl").open("w", encoding="utf-8", newline="\n") as fh:
        for sample in samples:
            fh.write(json.dumps(asdict(sample), ensure_ascii=False) + "\n")
    return samples


def _score(sample: Sample, code: str, expected: Expectations) -> None:
    usage = import_usage(code)
    reuse = component_reuse(usage, set(expected.components))
    adherence = token_adherence(code, expected.token_values)
    sample.reuse_expected = reuse.expected
    sample.reuse_used = reuse.used
    sample.reuse_matched = reuse.matched
    sample.raw_elements = usage.raw_elements
    sample.disallowed_modules = list(usage.disallowed_modules)
    sample.variable_refs = adherence.variable_refs
    sample.hardcoded_hex = adherence.hardcoded_hex
    sample.hardcoded_px = adherence.hardcoded_px
    sample.missed_tokens = adherence.missed_tokens


def load_results(out_dir: Path) -> list[dict[str, Any]]:
    with (out_dir / "results.jsonl").open(encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]


__all__ = ["ARMS", "RunConfig", "Sample", "load_results", "run"]
