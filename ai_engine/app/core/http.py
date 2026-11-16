import ipaddress
import socket
from urllib.parse import urljoin, urlparse

import requests
from app.core.config import settings

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; BrandingBeezAI/1.0; +https://brandingbeez.co.uk)"
}

def _validate_public_url(url: str) -> None:
    """Reject local/private targets before every request and redirect hop."""
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Only public http(s) URLs are allowed")
    try:
        addresses = {item[4][0] for item in socket.getaddrinfo(parsed.hostname, parsed.port or 443, type=socket.SOCK_STREAM)}
    except socket.gaierror as exc:
        raise ValueError("Website host could not be resolved") from exc
    for raw in addresses:
        address = ipaddress.ip_address(raw)
        if not address.is_global:
            raise ValueError("Private, loopback, link-local, and reserved targets are not allowed")


def _request_public(method: str, url: str, timeout: int | None = None) -> requests.Response:
    current = url
    for _ in range(6):
        _validate_public_url(current)
        response = requests.request(method, current, headers=DEFAULT_HEADERS, timeout=timeout or settings.HTTP_TIMEOUT_SEC, allow_redirects=False)
        if response.is_redirect:
            location = response.headers.get("location")
            if not location:
                return response
            current = urljoin(current, location)
            continue
        return response
    raise ValueError("Too many redirects")


def http_get(url: str, timeout: int | None = None) -> requests.Response:
    return _request_public("GET", url, timeout)

def http_head(url: str, timeout: int | None = None) -> requests.Response:
    return _request_public("HEAD", url, timeout)
