import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from app.core.config import settings

def extract_static_links(url: str) -> set[str]:
    res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=int(getattr(settings, "LINK_REQUEST_TIMEOUT_SEC", 5)))
    soup = BeautifulSoup(res.text or "", "html.parser")

    links = set()
    for tag in soup.find_all("a", href=True):
        links.add(urljoin(url, tag["href"]))
    return links
