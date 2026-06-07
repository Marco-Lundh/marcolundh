"""Tests for the daily AI news curation pipeline."""

import json
from datetime import date, timedelta
from pathlib import Path
from unittest.mock import MagicMock, patch

import anthropic
import pytest

import curate

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture()
def sample_articles() -> list[dict]:
    return [
        {
            "title": "OpenAI releases GPT-5",
            "url": "https://openai.com/blog/gpt-5",
            "summary": "A new model with improved reasoning.",
            "published": "Thu, 05 Jun 2026 08:00:00 GMT",
            "source": "OpenAI",
        },
        {
            "title": "Meta releases Llama 4",
            "url": "https://ai.meta.com/blog/llama-4",
            "summary": "Open weights model for research.",
            "published": "Thu, 05 Jun 2026 09:00:00 GMT",
            "source": "Meta AI",
        },
        {
            "title": "Anthropic announces Claude 5",
            "url": "https://anthropic.com/news/claude-5",
            "summary": "Next generation model with agentic capabilities.",
            "published": "Thu, 05 Jun 2026 10:00:00 GMT",
            "source": "Anthropic",
        },
    ]


@pytest.fixture()
def sample_seen() -> list[dict]:
    return [
        {
            "url": "https://openai.com/blog/gpt-5",
            "seen_at": date.today().isoformat(),
        },
    ]


@pytest.fixture()
def sample_curated() -> list[curate.Article]:
    return [
        {
            "title": "Meta releases Llama 4",
            "url": "https://ai.meta.com/blog/llama-4",
            "source": "Meta AI",
            "summary": "Open weights model for research.",
            "category": "Open Source AI",
            "reading_time_minutes": 3,
            "published": "Thu, 05 Jun 2026 09:00:00 GMT",
        },
        {
            "title": "Anthropic announces Claude 5",
            "url": "https://anthropic.com/news/claude-5",
            "source": "Anthropic",
            "summary": "Next generation model with agentic capabilities.",
            "category": "LLMs & Models",
            "reading_time_minutes": 4,
            "published": "Thu, 05 Jun 2026 10:00:00 GMT",
        },
    ]


# ---------------------------------------------------------------------------
# deduplicate
# ---------------------------------------------------------------------------


def test_deduplicate_removes_seen_urls(
    sample_articles: list[dict],
    sample_seen: list[dict],
) -> None:
    result = curate.deduplicate(sample_articles, sample_seen)
    urls = [a["url"] for a in result]
    assert "https://openai.com/blog/gpt-5" not in urls


def test_deduplicate_keeps_unseen_urls(
    sample_articles: list[dict],
    sample_seen: list[dict],
) -> None:
    result = curate.deduplicate(sample_articles, sample_seen)
    urls = [a["url"] for a in result]
    assert "https://ai.meta.com/blog/llama-4" in urls
    assert "https://anthropic.com/news/claude-5" in urls


def test_deduplicate_empty_seen_keeps_all(
    sample_articles: list[dict],
) -> None:
    result = curate.deduplicate(sample_articles, [])
    assert len(result) == len(sample_articles)


def test_deduplicate_empty_articles_returns_empty(
    sample_seen: list[dict],
) -> None:
    assert curate.deduplicate([], sample_seen) == []


# ---------------------------------------------------------------------------
# update_seen
# ---------------------------------------------------------------------------


def test_update_seen_adds_article_urls(
    sample_seen: list[dict],
    sample_curated: list[curate.Article],
) -> None:
    updated = curate.update_seen(sample_seen, sample_curated)
    urls = [e["url"] for e in updated]
    assert "https://ai.meta.com/blog/llama-4" in urls
    assert "https://anthropic.com/news/claude-5" in urls


def test_update_seen_sets_today_as_seen_at(
    sample_curated: list[curate.Article],
) -> None:
    updated = curate.update_seen([], sample_curated)
    for entry in updated:
        assert entry["seen_at"] == date.today().isoformat()


def test_update_seen_mutates_seen_list_in_place(
    sample_curated: list[curate.Article],
) -> None:
    seen: list[dict] = []
    curate.update_seen(seen, sample_curated)
    assert len(seen) == len(sample_curated)


# ---------------------------------------------------------------------------
# save_seen / load_seen
# ---------------------------------------------------------------------------


def test_save_seen_prunes_old_entries(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(curate, "SEEN_PATH", tmp_path / "seen.json")
    old_date = (
        date.today() - timedelta(days=curate.SEEN_WINDOW_DAYS + 1)
    ).isoformat()
    seen = [
        {"url": "https://old.example.com/a", "seen_at": old_date},
        {
            "url": "https://new.example.com/b",
            "seen_at": date.today().isoformat(),
        },
    ]
    curate.save_seen(seen)
    loaded = curate.load_seen()
    urls = [e["url"] for e in loaded]
    assert "https://old.example.com/a" not in urls
    assert "https://new.example.com/b" in urls


def test_load_seen_empty_file_returns_empty_list(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    path = tmp_path / "seen.json"
    path.write_text("[]")
    monkeypatch.setattr(curate, "SEEN_PATH", path)
    assert curate.load_seen() == []


def test_load_seen_missing_file_returns_empty_list(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(curate, "SEEN_PATH", tmp_path / "nonexistent.json")
    assert curate.load_seen() == []


# ---------------------------------------------------------------------------
# fetch_feed
# ---------------------------------------------------------------------------


def test_fetch_feed_returns_empty_on_network_error() -> None:
    with patch("curate.feedparser.parse", side_effect=Exception("timeout")):
        result = curate.fetch_feed("https://bad.example.com/feed")
    assert result == []


def test_fetch_feed_skips_entries_without_title() -> None:
    mock_feed = MagicMock()
    mock_entry = MagicMock()
    mock_entry.title = ""
    mock_entry.link = "https://example.com/article"
    mock_feed.entries = [mock_entry]
    with patch("curate.feedparser.parse", return_value=mock_feed):
        result = curate.fetch_feed("https://example.com/feed")
    assert result == []


def test_fetch_feed_skips_entries_without_link() -> None:
    mock_feed = MagicMock()
    mock_entry = MagicMock()
    mock_entry.title = "Some Title"
    mock_entry.link = ""
    mock_feed.entries = [mock_entry]
    with patch("curate.feedparser.parse", return_value=mock_feed):
        result = curate.fetch_feed("https://example.com/feed")
    assert result == []


def test_fetch_feed_returns_valid_article() -> None:
    mock_feed = MagicMock()
    mock_feed.feed.title = "Test Source"
    mock_entry = MagicMock()
    mock_entry.title = "Valid Title"
    mock_entry.link = "https://example.com/article"
    mock_entry.summary = "A short summary."
    mock_entry.published = "Thu, 05 Jun 2026 08:00:00 GMT"
    mock_feed.entries = [mock_entry]
    with patch("curate.feedparser.parse", return_value=mock_feed):
        result = curate.fetch_feed("https://example.com/feed")
    assert len(result) == 1
    assert result[0]["title"] == "Valid Title"
    assert result[0]["url"] == "https://example.com/article"
    assert result[0]["source"] == "Test Source"


# ---------------------------------------------------------------------------
# fetch_all_articles
# ---------------------------------------------------------------------------


def test_fetch_all_articles_aggregates_from_all_sources(
    sample_articles: list[dict],
) -> None:
    with patch(
        "curate.fetch_feed",
        side_effect=[sample_articles[:1], sample_articles[1:]],
    ):
        result = curate.fetch_all_articles(
            ["https://a.example.com/feed", "https://b.example.com/feed"]
        )
    assert len(result) == len(sample_articles)


def test_fetch_all_articles_empty_sources_returns_empty() -> None:
    assert curate.fetch_all_articles([]) == []


# ---------------------------------------------------------------------------
# load_config
# ---------------------------------------------------------------------------


def test_load_config_returns_parsed_json(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    config_file = tmp_path / "news-config.json"
    config_file.write_text(
        json.dumps({"sources": ["https://example.com/feed"]})
    )
    monkeypatch.setattr(curate, "CONFIG_PATH", config_file)
    result = curate.load_config()
    assert result == {"sources": ["https://example.com/feed"]}


# ---------------------------------------------------------------------------
# save_news
# ---------------------------------------------------------------------------


def test_save_news_writes_json_with_articles(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    sample_curated: list[curate.Article],
) -> None:
    monkeypatch.setattr(curate, "DATA_DIR", tmp_path)
    monkeypatch.setattr(curate, "NEWS_PATH", tmp_path / "news.json")
    curate.save_news(sample_curated)
    data = json.loads((tmp_path / "news.json").read_text())
    assert len(data["articles"]) == len(sample_curated)
    assert "generated_at" in data


def test_save_news_creates_data_dir_if_missing(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    sample_curated: list[curate.Article],
) -> None:
    nested = tmp_path / "app" / "data"
    monkeypatch.setattr(curate, "DATA_DIR", nested)
    monkeypatch.setattr(curate, "NEWS_PATH", nested / "news.json")
    curate.save_news(sample_curated)
    assert (nested / "news.json").exists()


# ---------------------------------------------------------------------------
# curate_with_claude
# ---------------------------------------------------------------------------


def test_curate_with_claude_returns_empty_on_no_articles() -> None:
    assert curate.curate_with_claude([], "test-key") == []


def test_curate_with_claude_returns_curated_on_success(
    sample_articles: list[dict],
    sample_curated: list[curate.Article],
) -> None:
    mock_block = MagicMock(spec=anthropic.types.TextBlock)
    mock_block.text = json.dumps(sample_curated)
    mock_message = MagicMock()
    mock_message.content = [mock_block]
    mock_client = MagicMock()
    mock_client.messages.create.return_value = mock_message
    with patch("curate.anthropic.Anthropic", return_value=mock_client):
        result = curate.curate_with_claude(sample_articles, "test-key")
    assert result == sample_curated


def test_curate_with_claude_returns_empty_on_api_error(
    sample_articles: list[dict],
) -> None:
    mock_client = MagicMock()
    mock_client.messages.create.side_effect = anthropic.APIError(
        message="rate limit", request=MagicMock(), body=None
    )
    with patch("curate.anthropic.Anthropic", return_value=mock_client):
        result = curate.curate_with_claude(sample_articles, "test-key")
    assert result == []


def test_curate_with_claude_strips_markdown_code_block(
    sample_articles: list[dict],
    sample_curated: list[curate.Article],
) -> None:
    mock_block = MagicMock(spec=anthropic.types.TextBlock)
    mock_block.text = f"```json\n{json.dumps(sample_curated)}\n```"
    mock_message = MagicMock()
    mock_message.content = [mock_block]
    mock_client = MagicMock()
    mock_client.messages.create.return_value = mock_message
    with patch("curate.anthropic.Anthropic", return_value=mock_client):
        result = curate.curate_with_claude(sample_articles, "test-key")
    assert result == sample_curated


def test_curate_with_claude_returns_empty_on_invalid_json(
    sample_articles: list[dict],
) -> None:
    mock_block = MagicMock(spec=anthropic.types.TextBlock)
    mock_block.text = "not valid json {{"
    mock_message = MagicMock()
    mock_message.content = [mock_block]
    mock_client = MagicMock()
    mock_client.messages.create.return_value = mock_message
    with patch("curate.anthropic.Anthropic", return_value=mock_client):
        result = curate.curate_with_claude(sample_articles, "test-key")
    assert result == []


def test_curate_with_claude_returns_empty_on_unexpected_block_type(
    sample_articles: list[dict],
) -> None:
    mock_message = MagicMock()
    mock_message.content = [MagicMock(spec=anthropic.types.ToolUseBlock)]
    mock_client = MagicMock()
    mock_client.messages.create.return_value = mock_message
    with patch("curate.anthropic.Anthropic", return_value=mock_client):
        result = curate.curate_with_claude(sample_articles, "test-key")
    assert result == []


# ---------------------------------------------------------------------------
# fetch_active_subscribers / send_newsletter / _build_email_html
# ---------------------------------------------------------------------------


def _subscribers(count: int) -> list[dict]:
    return [
        {"email": f"user{i}@example.com", "unsubscribe_token": f"tok{i}"}
        for i in range(count)
    ]


def test_fetch_active_subscribers_queries_supabase() -> None:
    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = _subscribers(2)

    with patch("curate.requests.get", return_value=mock_response) as mock_get:
        result = curate.fetch_active_subscribers(
            "https://proj.supabase.co", "service-key"
        )

    assert result == _subscribers(2)
    params = mock_get.call_args.kwargs["params"]
    assert params["status"] == "eq.active"
    headers = mock_get.call_args.kwargs["headers"]
    assert headers["apikey"] == "service-key"


def test_send_newsletter_sends_batch_via_resend(
    sample_curated: list[curate.Article],
) -> None:
    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.raise_for_status = MagicMock()

    with patch(
        "curate.requests.post", return_value=mock_response
    ) as mock_post:
        curate.send_newsletter(sample_curated, "resend-key", _subscribers(2))

    assert mock_post.call_count == 1
    emails = mock_post.call_args.kwargs["json"]
    assert len(emails) == 2
    assert emails[0]["from"] == f"{curate.FROM_NAME} <{curate.FROM_EMAIL}>"
    assert emails[0]["to"] == ["user0@example.com"]
    assert "tok0" in emails[0]["headers"]["List-Unsubscribe"]
    assert (
        emails[0]["headers"]["List-Unsubscribe-Post"]
        == "List-Unsubscribe=One-Click"
    )


def test_send_newsletter_skips_when_no_subscribers(
    sample_curated: list[curate.Article],
) -> None:
    with patch("curate.requests.post") as mock_post:
        curate.send_newsletter(sample_curated, "resend-key", [])
    mock_post.assert_not_called()


def test_send_newsletter_batches_over_limit(
    sample_curated: list[curate.Article],
) -> None:
    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.raise_for_status = MagicMock()

    with patch(
        "curate.requests.post", return_value=mock_response
    ) as mock_post:
        curate.send_newsletter(sample_curated, "resend-key", _subscribers(150))

    assert mock_post.call_count == 2


def test_build_email_html_escapes_article_content() -> None:
    xss_article: curate.Article = {
        "title": '<script>alert("xss")</script>',
        "url": "https://example.com/safe",
        "source": "Test",
        "summary": "<b>bold</b> & more",
        "category": "LLMs & Models",
        "reading_time_minutes": 2,
        "published": "2026-06-05",
    }
    html = curate._build_email_html(
        [xss_article], "Test Subject", "https://marco-tech.se/unsubscribe"
    )
    assert "<script>" not in html
    assert "&lt;script&gt;" in html
    assert "&lt;b&gt;" in html


def test_build_email_html_contains_unsubscribe_link(
    sample_curated: list[curate.Article],
) -> None:
    url = "https://marco-tech.se/unsubscribe?token=abc123"
    html = curate._build_email_html(sample_curated, "Test Subject", url)
    assert url in html
    assert "{$unsubscribe}" not in html
    assert "{$email}" not in html


# ---------------------------------------------------------------------------
# run
# ---------------------------------------------------------------------------


def _set_send_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("RESEND_API_KEY", "test-resend")
    monkeypatch.setenv("SUPABASE_URL", "https://proj.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_KEY", "test-service")


def test_run_exits_without_anthropic_key(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    _set_send_env(monkeypatch)
    with pytest.raises(SystemExit) as exc_info:
        curate.run()
    assert exc_info.value.code == 1


def test_run_exits_without_resend_key(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test")
    monkeypatch.delenv("RESEND_API_KEY", raising=False)
    monkeypatch.setenv("SUPABASE_URL", "https://proj.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_KEY", "test-service")
    with pytest.raises(SystemExit) as exc_info:
        curate.run()
    assert exc_info.value.code == 1


def test_run_exits_without_supabase_config(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test")
    monkeypatch.setenv("RESEND_API_KEY", "test-resend")
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_SERVICE_KEY", raising=False)
    with pytest.raises(SystemExit) as exc_info:
        curate.run()
    assert exc_info.value.code == 1


def test_run_full_run_calls_all_stages(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    sample_curated: list[curate.Article],
) -> None:
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-anthropic")
    _set_send_env(monkeypatch)
    monkeypatch.setattr(curate, "DATA_DIR", tmp_path)
    monkeypatch.setattr(curate, "NEWS_PATH", tmp_path / "news.json")
    monkeypatch.setattr(curate, "SEEN_PATH", tmp_path / "seen.json")

    with (
        patch("curate.load_config", return_value={"sources": []}),
        patch("curate.fetch_all_articles", return_value=sample_curated),
        patch("curate.curate_with_claude", return_value=sample_curated),
        patch("curate.fetch_active_subscribers", return_value=[]),
        patch("curate.send_newsletter") as mock_send,
    ):
        curate.run()

    mock_send.assert_called_once()
    assert (tmp_path / "news.json").exists()


def test_run_exits_0_when_no_articles_fetched(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-anthropic")
    _set_send_env(monkeypatch)
    monkeypatch.setattr(curate, "SEEN_PATH", tmp_path / "seen.json")

    with (
        patch("curate.load_config", return_value={"sources": []}),
        patch("curate.fetch_all_articles", return_value=[]),
    ):
        with pytest.raises(SystemExit) as exc_info:
            curate.run()
    assert exc_info.value.code == 0


def test_run_exits_0_when_all_articles_already_seen(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    sample_articles: list[dict],
) -> None:
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-anthropic")
    _set_send_env(monkeypatch)
    monkeypatch.setattr(curate, "SEEN_PATH", tmp_path / "seen.json")

    with (
        patch("curate.load_config", return_value={"sources": []}),
        patch("curate.fetch_all_articles", return_value=sample_articles),
        patch("curate.deduplicate", return_value=[]),
    ):
        with pytest.raises(SystemExit) as exc_info:
            curate.run()
    assert exc_info.value.code == 0


def test_run_exits_1_when_curated_is_empty(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    sample_articles: list[dict],
) -> None:
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-anthropic")
    _set_send_env(monkeypatch)
    monkeypatch.setattr(curate, "SEEN_PATH", tmp_path / "seen.json")

    with (
        patch("curate.load_config", return_value={"sources": []}),
        patch("curate.fetch_all_articles", return_value=sample_articles),
        patch("curate.deduplicate", return_value=sample_articles),
        patch("curate.curate_with_claude", return_value=[]),
    ):
        with pytest.raises(SystemExit) as exc_info:
            curate.run()
    assert exc_info.value.code == 1
