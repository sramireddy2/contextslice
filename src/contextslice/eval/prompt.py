"""The prompt scaffold shared by every arm. Only the design-context block differs between arms.

Keeping the scaffold identical is what makes the comparison fair: any difference in the
generated code is attributable to the context, not to the instructions.
"""

from dataclasses import dataclass

from contextslice.eval.tasks import Task

SYSTEM = (
    "You are a senior frontend engineer working in the Simple Design System (SDS) codebase: "
    "React 18 + TypeScript. You implement screens by composing the design system's existing "
    "components."
)

DESIGN_SYSTEM_MODULES = ("primitives", "compositions", "layout", "icons", "images")

_RULES = """Rules:
1. Reply with exactly one fenced ```tsx code block containing ONE complete file that ends with `export default function Screen()`.
2. Import design-system components only from these modules: "primitives", "compositions", "layout", "icons", "images". Import hooks from "react". No other imports.
3. Reuse the design-system components named in the design context instead of re-implementing them with plain HTML elements.
4. For colors, spacing and typography use the CSS variables from the design context, e.g. style={{ gap: "var(--sds-size-space-400)" }}. Do not hardcode a hex color or pixel value that has a token.
5. Text content must match the design context exactly."""


@dataclass(frozen=True)
class Prompt:
    system: str
    user: str


def build_prompt(task: Task, context: str | None) -> Prompt:
    block = (
        f"Design context (compiled from the Figma file):\n\n{context.rstrip()}"
        if context
        else "Design context: none is available. Implement a reasonable screen from its name."
    )
    user = f'Implement the "{task.name}" screen as a React component. {task.request}\n\n{_RULES}\n\n{block}\n'
    return Prompt(system=SYSTEM, user=user)
