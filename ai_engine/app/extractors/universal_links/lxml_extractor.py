import requests
from lxml import html
from urllib.parse import urljoin
from app.core.config import settings

def extract_lxml_links(url: str) -> set[str]:
    res = requests.get(url, timeout=int(getattr(settings, "LINK_REQUEST_TIMEOUT_SEC", 5)), headers={"User-Agent": "Mozilla/5.0"})
    tree = html.fromstring(res.content)

    return {urljoin(url, link) for link in tree.xpath("//a/@href")}
