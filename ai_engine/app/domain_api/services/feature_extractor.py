from bs4 import BeautifulSoup
from urllib.parse import urlparse

def extract_features(html: str, headers: dict, cookies):
    soup = BeautifulSoup(html or "<html></html>", "html.parser")

    scripts = [s.get("src") for s in soup.find_all("script") if s.get("src")]
    links = [l.get("href") for l in soup.find_all("link") if l.get("href")]
    metas = {m.get("name","").lower(): m.get("content","").lower() for m in soup.find_all("meta") if m.get("name")}

    cookie_names = []
    try:
        cookie_names = [c.name.lower() for c in cookies if hasattr(c,"name")]
    except Exception:
        cookie_names = []

    header_keys = list(headers.keys())
    server_header = headers.get("server","").lower() if headers else ""

    script_domains = list(set(urlparse(src).netloc for src in scripts if src and src.startswith("http")))

    return {
        "meta": metas,
        "scripts": scripts,
        "links": links,
        "script_domains": script_domains,
        "cookies": cookie_names,
        "headers": header_keys,
        "server_header": server_header,
        "raw_html": html[:2000]  # send truncated HTML to OpenAI
    }
