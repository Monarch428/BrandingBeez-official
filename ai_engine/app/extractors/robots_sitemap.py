from app.core.http import http_get
from urllib.parse import urljoin

def check_endpoint(base_url: str, path: str) -> dict:
    url = urljoin(base_url.rstrip("/") + "/", path.lstrip("/"))
    try:
        r = http_get(url)
        ok = 200 <= r.status_code < 300
        return {"url": url, "ok": ok, "status": r.status_code}
    except Exception:
        return {"url": url, "ok": False, "status": None}

def check_robots_and_sitemap(base_url: str) -> dict:
    return {
        "robots": check_endpoint(base_url, "/robots.txt"),
        "sitemap": check_endpoint(base_url, "/sitemap.xml"),
    }
