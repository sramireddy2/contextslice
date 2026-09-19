"""Turn ``results.jsonl`` into per-arm summaries and paired comparisons.

Statistics are deliberately modest for the sample size (8 tasks):

* repetitions are averaged *within* a task first, so the unit of analysis is the task;
* comparisons are **paired** by task (the same screen under two arms), which removes the large
  task-to-task variance from the difference;
* uncertainty is a percentile bootstrap over tasks. With n=8 the intervals are wide; they are
  reported as such rather than hidden behind a p-value.
"""

from collections.abc import Callable
from dataclasses import dataclass
from statistics import mean
from typing import Any

import numpy as np

Row = dict[str, Any]
Metric = Callable[[Row], float | None]


def reuse_recall(row: Row) -> float | None:
    return row["reuse_matched"] / row["reuse_expected"] if row.get("reuse_expected") else None


def reuse_precision(row: Row) -> float | None:
    return row["reuse_matched"] / row["reuse_used"] if row.get("reuse_used") else None


def token_rate(row: Row) -> float | None:
    total = row["variable_refs"] + row["hardcoded_hex"] + row["hardcoded_px"]
    return row["variable_refs"] / total if total else None


def tsc_pass(row: Row) -> float | None:
    return float(row["tsc_pass"]) if row.get("tsc_checked") else None


def prompt_tokens(row: Row) -> float | None:
    return float(row["prompt_tokens"]) if row.get("generated") else None


def total_seconds(row: Row) -> float | None:
    if not row.get("generated"):
        return None
    return row["compile_seconds"] + row["prompt_seconds"] + row["output_seconds"]


def missed_tokens(row: Row) -> float | None:
    return float(row["missed_tokens"]) if row.get("extracted") else None


def raw_elements(row: Row) -> float | None:
    return float(row["raw_elements"]) if row.get("extracted") else None


def tsc_missing(row: Row) -> float | None:
    """Hallucinated or un-imported names: the most context-sensitive type error."""
    return float(row["tsc_errors"].get("missing", 0)) if row.get("tsc_checked") else None


def tsc_type(row: Row) -> float | None:
    """Wrong props/values on real components."""
    return float(row["tsc_errors"].get("type", 0)) if row.get("tsc_checked") else None


def output_tokens(row: Row) -> float | None:
    return float(row["output_tokens"]) if row.get("generated") else None


def truncated(row: Row) -> float | None:
    return float(row["truncated"]) if row.get("generated") else None


METRICS: dict[str, Metric] = {
    "reuse_recall": reuse_recall,
    "reuse_precision": reuse_precision,
    "token_rate": token_rate,
    "missed_tokens": missed_tokens,
    "raw_elements": raw_elements,
    "tsc_pass": tsc_pass,
    "tsc_missing": tsc_missing,
    "tsc_type": tsc_type,
    "prompt_tokens": prompt_tokens,
    "output_tokens": output_tokens,
    "truncated": truncated,
    "total_seconds": total_seconds,
}
PAIRED_METRICS = (
    "reuse_recall",
    "reuse_precision",
    "tsc_missing",
    "tsc_type",
    "token_rate",
    "prompt_tokens",
    "total_seconds",
)

ArmKey = tuple[str, int | None]


def arm_key(row: Row) -> ArmKey:
    return (row["arm"], row.get("budget"))


def task_level(rows: list[Row], metric: Metric) -> dict[ArmKey, dict[str, float]]:
    """arm -> task -> metric averaged over that task's repetitions (samples lacking it skipped)."""
    buckets: dict[ArmKey, dict[str, list[float]]] = {}
    for row in rows:
        value = metric(row)
        if value is None:
            continue
        buckets.setdefault(arm_key(row), {}).setdefault(row["task_id"], []).append(value)
    return {
        arm: {task: mean(values) for task, values in tasks.items()}
        for arm, tasks in buckets.items()
    }


@dataclass(frozen=True)
class ArmSummary:
    arm: str
    budget: int | None
    samples: int
    extracted: int
    means: dict[str, float | None]


def summarize(rows: list[Row]) -> list[ArmSummary]:
    per_metric = {name: task_level(rows, metric) for name, metric in METRICS.items()}
    arms = sorted({arm_key(row) for row in rows}, key=lambda k: (k[0], k[1] or 0))
    summaries = []
    for arm, budget in arms:
        group = [row for row in rows if arm_key(row) == (arm, budget)]
        means = {}
        for name, by_arm in per_metric.items():
            values = list(by_arm.get((arm, budget), {}).values())
            means[name] = mean(values) if values else None
        summaries.append(
            ArmSummary(
                arm=arm,
                budget=budget,
                samples=len(group),
                extracted=sum(1 for row in group if row.get("extracted")),
                means=means,
            )
        )
    return summaries


@dataclass(frozen=True)
class PairedResult:
    metric: str
    arm_a: ArmKey
    arm_b: ArmKey
    tasks: int
    mean_difference: float  # a minus b
    ci_low: float
    ci_high: float
    wins: int  # tasks where a > b
    losses: int  # tasks where a < b


def paired(
    rows: list[Row],
    metric_name: str,
    arm_a: ArmKey,
    arm_b: ArmKey,
    *,
    resamples: int = 4000,
    seed: int = 0,
) -> PairedResult | None:
    """Paired (by task) difference a - b with a percentile bootstrap CI over tasks."""
    levels = task_level(rows, METRICS[metric_name])
    common = sorted(set(levels.get(arm_a, {})) & set(levels.get(arm_b, {})))
    if not common:
        return None
    differences = np.array([levels[arm_a][t] - levels[arm_b][t] for t in common])
    rng = np.random.default_rng(seed)
    indexes = rng.integers(0, len(differences), size=(resamples, len(differences)))
    boot = differences[indexes].mean(axis=1)
    return PairedResult(
        metric=metric_name,
        arm_a=arm_a,
        arm_b=arm_b,
        tasks=len(common),
        mean_difference=float(differences.mean()),
        ci_low=float(np.percentile(boot, 2.5)),
        ci_high=float(np.percentile(boot, 97.5)),
        wins=int((differences > 0).sum()),
        losses=int((differences < 0).sum()),
    )


def default_comparisons(rows: list[Row]) -> list[tuple[ArmKey, ArmKey]]:
    """The pre-registered comparisons: C vs F and C vs S at each budget, C vs N, U vs C."""
    budgets = sorted({row["budget"] for row in rows if row.get("budget") is not None})
    pairs: list[tuple[ArmKey, ArmKey]] = []
    for budget in budgets:
        pairs.append((("C", budget), ("F", budget)))
        pairs.append((("C", budget), ("S", budget)))
        pairs.append((("C", budget), ("N", None)))
        pairs.append((("U", None), ("C", budget)))
    return pairs


def format_label(key: ArmKey) -> str:
    arm, budget = key
    return f"{arm}@{budget}" if budget is not None else arm


def render_markdown(rows: list[Row], title: str) -> str:
    lines = [f"# {title}", ""]
    lines.append("## Per-arm means (task-level)")
    lines.append("")
    header = ["arm", "n", "extracted", *METRICS]
    lines.append("| " + " | ".join(header) + " |")
    lines.append("|" + "---|" * len(header))
    for summary in summarize(rows):
        cells = [
            format_label((summary.arm, summary.budget)),
            str(summary.samples),
            str(summary.extracted),
        ]
        cells += ["-" if summary.means[m] is None else f"{summary.means[m]:.2f}" for m in METRICS]
        lines.append("| " + " | ".join(cells) + " |")
    lines.append("")
    lines.append("## Paired comparisons (a - b, 95% bootstrap CI over tasks)")
    lines.append("")
    lines.append("| comparison | metric | tasks | mean diff | 95% CI | wins/losses |")
    lines.append("|---|---|---|---|---|---|")
    for arm_a, arm_b in default_comparisons(rows):
        for metric in PAIRED_METRICS:
            result = paired(rows, metric, arm_a, arm_b)
            if result is None:
                continue
            lines.append(
                f"| {format_label(arm_a)} vs {format_label(arm_b)} | {metric} | {result.tasks} | "
                f"{result.mean_difference:+.2f} | [{result.ci_low:+.2f}, {result.ci_high:+.2f}] | "
                f"{result.wins}/{result.losses} |"
            )
    lines.append("")
    return "\n".join(lines)
