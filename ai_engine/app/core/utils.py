import secrets
from urllib.parse import urlparse, urlunparse

def make_token(prefix: str = "bbai") -> str:
    return f"{prefix}_{secrets.token_urlsafe(18)}"

def normalize_url(url: str) -> str:
    u = (url or "").strip()
    if not u:
        return ""
    if not u.startswith("http://") and not u.startswith("https://"):
        u = "https://" + u
    parsed = urlparse(u)
    parsed = parsed._replace(fragment="")
    # Normalize: remove trailing slash (except root)
    normalized = urlunparse(parsed)
    if normalized.endswith("/") and len(normalized) > len(parsed.scheme + "://" + parsed.netloc + "/"):
        normalized = normalized.rstrip("/")
    return normalized

def domain_of(url: str) -> str:
    try:
        return urlparse(url).netloc.replace("www.", "")
    except Exception:
        return ""
