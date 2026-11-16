from lxml import html
from urllib.parse import urljoin
from app.core.config import settings
from app.core.http import http_get

def extract_lxml_links(url: str) -> set[str]:
    res = http_get(url, timeout=int(getattr(settings, "LINK_REQUEST_TIMEOUT_SEC", 5)))
    tree = html.fromstring(res.content)

    return {urljoin(url, link) for link in tree.xpath("//a/@href")}
