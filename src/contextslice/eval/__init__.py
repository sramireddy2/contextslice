"""Evaluation harness: generate implementations with and without the compiler, then measure.

Nothing in this package executes model-generated code (ADR-0004). Every metric is computed
from the generated source text, from the type checker's output, or from the model runtime's
own usage counters.
"""
