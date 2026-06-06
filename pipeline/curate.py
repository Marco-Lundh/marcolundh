"""Daily AI news curation pipeline.

Fetches articles from RSS feeds, deduplicates, ranks and categorizes
via Claude Haiku, writes news.json, and sends the top 10 via MailerLite.
"""

import json
import logging
import os
import sys
from datetime import UTC, date, datetime, timedelta
from html import escape
from pathlib import Path
from typing import TypedDict

import anthropic
import feedparser
import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger(__name__)

PIPELINE_DIR = Path(__file__).parent
DATA_DIR = PIPELINE_DIR.parent / "app" / "data"
CONFIG_PATH = PIPELINE_DIR / "news-config.json"
SEEN_PATH = PIPELINE_DIR / "seen.json"
NEWS_PATH = DATA_DIR / "news.json"

ARTICLES_TO_KEEP = 50
EMAIL_ARTICLES = 10
MAX_ARTICLES_TO_CLAUDE = 150
MAX_ENTRIES_PER_FEED = 20
MAX_SUMMARY_CHARS = 500
CLAUDE_MAX_TOKENS = 8192
SEEN_WINDOW_DAYS = 7
FETCH_TIMEOUT_SECONDS = 10
MAILERLITE_API = "https://connect.mailerlite.com/api"
FROM_EMAIL = "newsletter@marco-tech.se"

CATEGORIES = [
    "LLMs & Models",
    "AI Agents & Automation",
    "Open Source AI",
    "AI Tools & Frameworks",
    "MLOps & Infrastructure",
    "Research & Papers",
    "AI in Industry",
    "Ethics & Policy",
    "Generative Media",
    "Funding & Business",
]


class Article(TypedDict):
    title: str
    url: str
    source: str
    summary: str
    category: str
    reading_time_minutes: int
    published: str


def load_config() -> dict:
    """Load pipeline configuration from news-config.json."""
    with open(CONFIG_PATH) as f:
        return json.load(f)


def load_seen() -> list[dict]:
    """Load the deduplication state from seen.json."""
    if not SEEN_PATH.exists():
        return []
    with open(SEEN_PATH) as f:
        return json.load(f)


def save_seen(seen: list[dict]) -> None:
    """Persist updated deduplication state, pruned to SEEN_WINDOW_DAYS."""
    cutoff = (date.today() - timedelta(days=SEEN_WINDOW_DAYS)).isoformat()
    pruned = [entry for entry in seen if entry["seen_at"] >= cutoff]
    with open(SEEN_PATH, "w") as f:
        json.dump(pruned, f, indent=2)


def fetch_feed(url: str) -> list[dict]:
    """Fetch and parse a single RSS feed. Returns empty list on any error."""
    try:
        feed = feedparser.parse(
            url, request_headers={"User-Agent": "marco-tech-bot/1.0"}
        )
        articles = []
        for entry in feed.entries[:MAX_ENTRIES_PER_FEED]:
            title = getattr(entry, "title", "").strip()
            link = getattr(entry, "link", "").strip()
            summary = getattr(entry, "summary", "").strip()
            published = getattr(entry, "published", "").strip()
            if title and link:
                articles.append(
                    {
                        "title": title,
                        "url": link,
                        "summary": summary[:MAX_SUMMARY_CHARS],
                        "published": published,
                        "source": getattr(feed.feed, "title", url),
                    }
                )
        log.info("Fetched %d articles from %s", len(articles), url)
        return articles
    except Exception as exc:
        log.warning("Failed to fetch feed %s: %s", url, exc)
        return []


def fetch_all_articles(sources: list[str]) -> list[dict]:
    """Fetch articles from all configured RSS sources."""
    all_articles: list[dict] = []
    for url in sources:
        all_articles.extend(fetch_feed(url))
    log.info("Total fetched: %d articles", len(all_articles))
    return all_articles


def deduplicate(
    articles: list[dict],
    seen: list[dict],
) -> list[dict]:
    """Remove articles whose URLs have been seen within SEEN_WINDOW_DAYS."""
    seen_urls = {entry["url"] for entry in seen}
    fresh = [a for a in articles if a["url"] not in seen_urls]
    log.info(
        "%d fresh articles after deduplication (removed %d)",
        len(fresh),
        len(articles) - len(fresh),
    )
    return fresh


def curate_with_claude(
    articles: list[dict],
    api_key: str,
) -> list[Article]:
    """Use Claude Haiku to rank, categorize, and summarize the top articles."""
    if not articles:
        log.warning("No articles to curate")
        return []

    client = anthropic.Anthropic(api_key=api_key)
    categories_str = "\n".join(f"- {c}" for c in CATEGORIES)
    articles_json = json.dumps(
        articles[:MAX_ARTICLES_TO_CLAUDE], ensure_ascii=False
    )

    prompt = (
        "You are an expert AI news curator. "
        f"Given the following list of articles, select the {ARTICLES_TO_KEEP} "
        "most relevant and high-quality articles about AI developments.\n\n"
        "For each selected article, return a JSON array"
        " with objects containing:\n"
        "- title: the original article title\n"
        "- url: the original article URL\n"
        "- source: the original source name\n"
        "- summary: one sentence, max 15 words (write it yourself)\n"
        "- category: exactly one category from the list below\n"
        "- reading_time_minutes: estimated reading time as an integer (1-10)\n"
        "- published: the original published date string\n\n"
        f"Categories:\n{categories_str}\n\n"
        "Prioritize: significant technical developments,"
        " major product releases,\n"
        "important research, and industry-changing news.\n"
        "Deprioritize opinion pieces, listicles, and minor updates.\n\n"
        "Return ONLY a valid JSON array. No markdown, no explanation.\n\n"
        f"Articles:\n{articles_json}"
    )

    log.info(
        "Calling Claude Haiku to curate %d articles",
        len(articles[:MAX_ARTICLES_TO_CLAUDE]),
    )
    try:
        message = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=CLAUDE_MAX_TOKENS,
            messages=[{"role": "user", "content": prompt}],
        )
    except anthropic.APIError as exc:
        log.error("Claude API error: %s", exc)
        return []

    first_block = message.content[0]
    if not isinstance(first_block, anthropic.types.TextBlock):
        log.error(
            "Unexpected response block type from Claude: %s", type(first_block)
        )
        return []
    response_text = first_block.text.strip()
    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]
        response_text = response_text.strip()
    try:
        curated: list[Article] = json.loads(response_text)
    except json.JSONDecodeError as exc:
        log.error("Claude returned invalid JSON: %s", exc)
        return []

    log.info("Claude returned %d curated articles", len(curated))
    return curated[:ARTICLES_TO_KEEP]


def save_news(articles: list[Article]) -> None:
    """Write the curated articles to news.json."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.now(UTC).isoformat(),
        "articles": articles,
    }
    with open(NEWS_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    log.info("Wrote %d articles to %s", len(articles), NEWS_PATH)


def update_seen(seen: list[dict], articles: list[Article]) -> list[dict]:
    """Add newly published article URLs to the seen list."""
    today = date.today().isoformat()
    for article in articles:
        seen.append({"url": article["url"], "seen_at": today})
    return seen


def _build_email_html(top: list[Article], subject: str) -> str:
    """Build the HTML body for the newsletter email."""
    items_html = ""
    for article in top:
        href = escape(article["url"], quote=True)
        title = escape(article["title"])
        summary = escape(article["summary"])
        mins = article["reading_time_minutes"]
        link_style = (
            "color:#1d6fd1;font-weight:600;"
            "text-decoration:none;font-size:16px;"
        )
        span_style = "color:#475569;font-size:13px;"
        p_style = "margin:0;color:#64748b;font-size:14px;line-height:1.6;"
        items_html += (
            '\n        <div style="margin-bottom:28px;">'
            '\n          <p style="margin:0 0 4px;">'
            f'\n            <a href="{href}" style="{link_style}">'
            f"\n              {title}"
            "\n            </a>"
            f'\n            <span style="{span_style}"> ({mins} min)</span>'
            "\n          </p>"
            f'\n          <p style="{p_style}">'
            f"\n            {summary}"
            "\n          </p>"
            "\n        </div>"
        )

    body_style = (
        "background:#0a0f1e;color:#e2e8f0;"
        "font-family:system-ui,sans-serif;"
        "max-width:620px;margin:0 auto;padding:40px 24px;"
    )
    label_style = (
        "font-family:monospace;color:#1d6fd1;font-size:12px;"
        "letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;"
    )
    h1_style = "font-size:22px;font-weight:700;color:#cbd5e1;margin:0 0 32px;"
    hr_style = (
        "border:none;"
        "border-top:1px solid rgba(255,255,255,0.07);"
        "margin:40px 0 24px;"
    )
    return (
        "<!DOCTYPE html>\n<html>\n"
        '<head><meta charset="utf-8"></head>\n'
        f'<body style="{body_style}">\n'
        f'  <p style="{label_style}">AI NEWS · marco-tech.se</p>\n'
        f'  <h1 style="{h1_style}">{escape(subject)}</h1>\n'
        f"  {items_html}\n"
        f'  <hr style="{hr_style}">\n'
        '  <p style="color:#334155;font-size:13px;'
        'line-height:1.7;margin:0 0 8px;">\n'
        f"    Browse and filter all {ARTICLES_TO_KEEP}"
        " of today&apos;s stories by category at\n"
        '    <a href="https://marco-tech.se/ai-news"\n'
        '       style="color:#1d6fd1;text-decoration:none;">'
        "marco-tech.se/ai-news →</a>\n"
        "  </p>\n"
        '  <p style="color:#1e293b;font-size:12px;margin:0;">\n'
        "    You&apos;re receiving this at {$email} &nbsp;&middot;&nbsp;\n"
        '    <a href="{$unsubscribe}" style="color:#1e293b;">Unsubscribe</a>\n'
        "  </p>\n"
        "</body>\n</html>"
    )


def send_newsletter(articles: list[Article], api_key: str) -> None:
    """Send the top EMAIL_ARTICLES articles via MailerLite campaigns API."""
    top = articles[:EMAIL_ARTICLES]
    now = datetime.now(UTC)
    day = str(now.day)
    today = now.strftime(f"%A {day} %B %Y")
    subject = f"AI News · {today}"
    html = _build_email_html(top, subject)

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    response = requests.post(
        f"{MAILERLITE_API}/campaigns",
        headers=headers,
        json={
            "name": subject,
            "type": "regular",
            "emails": [
                {
                    "subject": subject,
                    "from": FROM_EMAIL,
                    "from_name": "Marco Lundh",
                    "content": html,
                }
            ],
        },
        timeout=FETCH_TIMEOUT_SECONDS,
    )
    if not response.ok:
        log.error(
            "MailerLite campaign error %s: %s",
            response.status_code,
            response.text,
        )
    response.raise_for_status()
    campaign_id = response.json()["data"]["id"]
    log.info("Created MailerLite campaign %s", campaign_id)

    send_response = requests.post(
        f"{MAILERLITE_API}/campaigns/{campaign_id}/schedule",
        headers=headers,
        json={"delivery": "instant"},
        timeout=FETCH_TIMEOUT_SECONDS,
    )
    send_response.raise_for_status()
    log.info("Campaign %s scheduled for instant delivery", campaign_id)


def run() -> None:
    """Run the full curation pipeline."""
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    mailerlite_key = os.environ.get("MAILERLITE_API_KEY")

    if not anthropic_key:
        log.error("ANTHROPIC_API_KEY not set")
        sys.exit(1)
    if not mailerlite_key:
        log.error("MAILERLITE_API_KEY not set")
        sys.exit(1)

    config = load_config()
    seen = load_seen()

    raw_articles = fetch_all_articles(config["sources"])
    if not raw_articles:
        log.warning("No articles fetched from any source — skipping")
        sys.exit(0)

    fresh_articles = deduplicate(raw_articles, seen)
    if not fresh_articles:
        log.info("All articles already seen — nothing new to send")
        sys.exit(0)

    curated = curate_with_claude(fresh_articles, anthropic_key)
    if not curated:
        log.error("No articles curated — aborting")
        sys.exit(1)

    save_news(curated)
    send_newsletter(curated, mailerlite_key)

    seen = update_seen(seen, curated)
    save_seen(seen)
    log.info("Pipeline completed successfully")


if __name__ == "__main__":
    run()
