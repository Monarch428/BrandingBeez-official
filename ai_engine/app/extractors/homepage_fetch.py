from bs4 import BeautifulSoup
from app.core.http import http_get

def fetch_homepage_html(url: str) -> tuple[str | None, str | None]:
    try:
        r = http_get(url)
        if r.status_code >= 200 and r.status_code < 400:
            return r.text, r.url
        return None, None
    except Exception:
        return None, None

def parse_homepage(html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")

    title = (soup.title.get_text(strip=True) if soup.title else None)

    meta_desc = None
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        meta_desc = desc_tag.get("content").strip()

    has_ld_json = bool(soup.find("script", attrs={"type": "application/ld+json"}))

    # Heuristic: contact CTA exists?
    contact_cta = False
    for a in soup.find_all("a", href=True):
        txt = (a.get_text(" ", strip=True) or "").lower()
        href = (a.get("href") or "").lower()
        if "contact" in txt or "contact" in href or "book" in txt or "appointment" in txt:
            contact_cta = True
            break

    # crude: homepage text length
    text = soup.get_text(" ", strip=True)
    text_len = len(text)

    # H1 check
    h1_count = len(soup.find_all("h1"))

    return {
        "title": title,
        "metaDescription": meta_desc,
        "hasStructuredData": has_ld_json,
        "contactCTA": contact_cta,
        "homepageTextLength": text_len,
        "h1Count": h1_count,
    }
