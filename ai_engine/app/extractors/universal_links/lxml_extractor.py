import requests
from lxml import html
from urllib.parse import urljoin

def extract_lxml_links(url: str) -> set[str]:
    res = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
    tree = html.fromstring(res.content)

    return {urljoin(url, link) for link in tree.xpath("//a/@href")}
