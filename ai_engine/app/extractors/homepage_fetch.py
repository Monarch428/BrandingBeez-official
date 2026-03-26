from bs4 import BeautifulSoup
from app.core.http import http_get
from app.signals.detection_utils import detect_cta

CTA_TEXT_TOKENS = (
    "contact",
    "book",
    "schedule",
    "get started",
    "get quote",
    "request quote",
    "request proposal",
    "free audit",
    "audit",
    "consultation",
    "speak to",
    "talk to",
    "call now",
    "let's talk",
    "lets talk",
)

CTA_HREF_TOKENS = (
    "contact",
    "book",
    "schedule",
    "quote",
    "proposal",
    "audit",
    "consult",
    "demo",
    "call",
)


def fetch_homepage_html(url: str) -> tuple[str | None, str | None]:
    try:
        r = http_get(url)
        if r.status_code >= 200 and r.status_code < 400:
            return r.text, r.url
        return None, None
    except Exception:
        return None, None


def _detect_contact_cta(soup: BeautifulSoup) -> bool:
    signal_chunks = []
    for node in soup.find_all(["a", "button"]):
        text = (node.get_text(" ", strip=True) or "").lower()
        href = (node.get("href") or "").lower()
        aria = (node.get("aria-label") or "").lower()
        title = (node.get("title") or "").lower()
        combined = " ".join(part for part in (text, href, aria, title) if part)
        if combined:
            signal_chunks.append(combined)
        if any(token in combined for token in CTA_TEXT_TOKENS):
            return True
        if href and any(token in href for token in CTA_HREF_TOKENS):
            return True

    for form in soup.find_all("form"):
        if form.find(["input", "button", "textarea", "select"]):
            return True

    if detect_cta(" ".join(signal_chunks)):
        return True

    return False


def parse_homepage(html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")

    title = (soup.title.get_text(strip=True) if soup.title else None)

    meta_desc = None
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        meta_desc = desc_tag.get("content").strip()

    has_ld_json = bool(soup.find("script", attrs={"type": "application/ld+json"}))

    text = soup.get_text(" ", strip=True)
    text_len = len(text)
    h1_count = len(soup.find_all("h1"))

    return {
        "title": title,
        "metaDescription": meta_desc,
        "hasStructuredData": has_ld_json,
        "contactCTA": _detect_contact_cta(soup),
        "homepageTextLength": text_len,
        "h1Count": h1_count,
        "text": text,
    }
