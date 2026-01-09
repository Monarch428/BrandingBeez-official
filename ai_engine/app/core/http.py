import requests
from app.core.config import settings

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; BrandingBeezAI/1.0; +https://brandingbeez.co.uk)"
}

def http_get(url: str, timeout: int | None = None) -> requests.Response:
    return requests.get(url, headers=DEFAULT_HEADERS, timeout=timeout or settings.HTTP_TIMEOUT_SEC)

def http_head(url: str, timeout: int | None = None) -> requests.Response:
    return requests.head(url, headers=DEFAULT_HEADERS, timeout=timeout or settings.HTTP_TIMEOUT_SEC, allow_redirects=True)
