"""Evaluation tasks: real SDS screens plus the one-line request a developer would type."""

import json
from dataclasses import asdict, dataclass
from pathlib import Path

DEFAULT_TASKS = Path("eval/tasks.json")


@dataclass(frozen=True)
class Task:
    id: str
    node_id: str
    name: str
    request: str


def load_tasks(path: Path = DEFAULT_TASKS) -> list[Task]:
    return [Task(**entry) for entry in json.loads(path.read_text(encoding="utf-8"))]


def save_tasks(tasks: list[Task], path: Path = DEFAULT_TASKS) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps([asdict(task) for task in tasks], indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
