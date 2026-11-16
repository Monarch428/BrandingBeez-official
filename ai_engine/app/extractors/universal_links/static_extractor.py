from bs4 import BeautifulSoup
from urllib.parse import urljoin
from app.core.config import settings
from app.core.http import http_get

def extract_static_links(url: str) -> set[str]:
    res = http_get(url, timeout=int(getattr(settings, "LINK_REQUEST_TIMEOUT_SEC", 5)))
    soup = BeautifulSoup(res.text or "", "html.parser")

    links = set()
    for tag in soup.find_all("a", href=True):
        links.add(urljoin(url, tag["href"]))
    return links
