from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from app.core.utils import normalize_url, domain_of

def extract_links(home_url: str, html: str, max_links: int = 60) -> dict:
    home_url = normalize_url(home_url)
    base_domain = domain_of(home_url)
    soup = BeautifulSoup(html, "html.parser")

    internal = []
    external = []
    seen = set()

    def push(lst, u):
        if u in seen:
            return
        seen.add(u)
        lst.append(u)

    for a in soup.find_all("a", href=True):
        href = (a.get("href") or "").strip()
        if not href:
            continue
        if href.startswith("mailto:") or href.startswith("tel:") or href.startswith("javascript:"):
            continue

        full = normalize_url(urljoin(home_url + "/", href))
        if not full:
            continue

        parsed = urlparse(full)
        if parsed.scheme not in ("http", "https"):
            continue

        if domain_of(full) == base_domain:
            push(internal, full)
        else:
            push(external, full)

        if len(internal) >= max_links and len(external) >= max_links:
            break

    return {
        "company_website": home_url,
        "internal_links": internal[:max_links],
        "external_links": external[:max_links],
        "total_internal_links": len(internal),
        "total_external_links": len(external),
    }
