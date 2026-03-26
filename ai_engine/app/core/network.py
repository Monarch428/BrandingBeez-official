from __future__ import annotations

import concurrent.futures
import logging
import socket
import threading
import time

from app.core.config import settings

logger = logging.getLogger(__name__)

_CACHE_LOCK = threading.Lock()
_DNS_CACHE: dict[tuple[str, int], tuple[float, bool]] = {}


def _resolve_host(host: str) -> bool:
    socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
    return True


def is_network_available(host: str = "api.openai.com", timeout_s: float | None = None) -> bool:
    timeout = float(timeout_s or getattr(settings, "NETWORK_CHECK_TIMEOUT_SEC", 3) or 3)
    cache_ttl = int(getattr(settings, "NETWORK_CHECK_CACHE_TTL_SEC", 30) or 30)
    key = (str(host or "").strip().lower(), int(timeout * 1000))
    if not key[0]:
        return False

    now = time.time()
    with _CACHE_LOCK:
        cached = _DNS_CACHE.get(key)
        if cached and (now - cached[0]) <= cache_ttl:
            return cached[1]

    ok = False
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_resolve_host, key[0])
            ok = bool(future.result(timeout=timeout))
    except Exception:
        ok = False

    with _CACHE_LOCK:
        _DNS_CACHE[key] = (now, ok)

    if not ok:
        logger.warning("[Network] host=%s available=false", key[0])
    return ok
