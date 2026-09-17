import pytest

from contextslice.tokens import DEFAULT_TOKENIZER, ApproxTokenCounter, HfTokenCounter

needs_tokenizer = pytest.mark.skipif(
    not DEFAULT_TOKENIZER.exists(), reason="tokenizer asset not present"
)


def test_approx_counter_rounds_up() -> None:
    counter = ApproxTokenCounter()

    assert counter.count("") == 0
    assert counter.count("abcd") == 1
    assert counter.count("abcde") == 2


@needs_tokenizer
def test_real_tokenizer_is_deterministic_and_disagrees_with_the_rule_of_thumb() -> None:
    counter = HfTokenCounter()
    raw_json = '{"color":{"r":0.17254902,"g":0.17254902,"b":0.17254902,"a":1.0}}'

    assert counter.count(raw_json) == counter.count(raw_json)
    # Digits and punctuation tokenize badly: raw Figma JSON costs far more than chars/4 suggests.
    assert counter.count(raw_json) > 1.5 * ApproxTokenCounter().count(raw_json)
    assert counter.name == "hf:qwen2.5-coder"
