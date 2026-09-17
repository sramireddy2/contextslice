from contextslice.resolve import find_targets


def ids(nodes) -> list[str]:
    return [node.id for node in nodes]


def test_unique_match(toy_design) -> None:
    assert ids(find_targets(toy_design, "checkout")) == ["5:0"]


def test_all_words_must_match_somewhere_in_the_path(toy_design) -> None:
    assert ids(find_targets(toy_design, "button primary")) == ["1:2"]
    assert find_targets(toy_design, "checkout primary") == []


def test_ambiguous_queries_return_every_candidate_with_exact_name_first(toy_design) -> None:
    # "Pay button" (5:1) is NOT a candidate: it is nested inside a frame, not a top-level target.
    assert ids(find_targets(toy_design, "button")) == ["1:1", "1:2", "1:5"]


def test_empty_query_matches_nothing(toy_design) -> None:
    assert find_targets(toy_design, "   ") == []
