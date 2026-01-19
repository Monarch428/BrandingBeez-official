from __future__ import annotations

import base64
import os
import time
from typing import Any, Dict, List, Optional

import requests

from app.core.config import settings

DATAFORSEO_BASE = "https://api.dataforseo.com/v3"


def _domain_from_url(url: str) -> str:
    u = (url or "").strip()
    u = u.replace("https://", "").replace("http://", "")
    return u.split("/")[0].strip().lower()


class DataForSEOClient:
    """Minimal DataForSEO REST client.

    Supports the endpoints used by the AI Engine:
      - DataForSEO Labs (domain rank overview, competitors domain, SERP competitors)
      - Keywords Data (keywords_for_site)
      - SERP (organic + local finder)
      - (legacy) Backlinks summary task endpoints (kept for compatibility)
    """

    def __init__(
        self,
        basic_b64: Optional[str] = None,
        login: Optional[str] = None,
        password: Optional[str] = None,
        timeout_s: Optional[int] = None,
    ):
        # Priority:
        # 1) explicit basic_b64
        # 2) env/settings basic b64
        # 3) login+password -> derived b64
        b64 = (basic_b64 or (settings.DATAFORSEO_BASIC_B64 or "") or os.getenv("DATAFORSEO_BASIC_B64", "")).strip()

        if not b64:
            l = (login or (settings.DATAFORSEO_LOGIN or "") or os.getenv("DATAFORSEO_LOGIN", "")).strip()
            p = (password or (settings.DATAFORSEO_PASSWORD or "") or os.getenv("DATAFORSEO_PASSWORD", "")).strip()
            if l and p:
                b64 = base64.b64encode(f"{l}:{p}".encode("utf-8")).decode("utf-8")

        self.basic_b64 = b64
        self.timeout_s = int(timeout_s or getattr(settings, "DATAFORSEO_TIMEOUT_SEC", 45) or 45)

        if not self.basic_b64:
            raise ValueError(
                "Missing DataForSEO credentials. Provide DATAFORSEO_BASIC_B64 or DATAFORSEO_LOGIN/DATAFORSEO_PASSWORD in .env"
            )

        self._session = requests.Session()
        self._session.headers.update(
            {
                "Authorization": f"Basic {self.basic_b64}",
                "Content-Type": "application/json",
            }
        )

    def _post(self, path: str, payload: Any) -> Dict[str, Any]:
        url = f"{DATAFORSEO_BASE}{path}"
        r = self._session.post(url, json=payload, timeout=self.timeout_s)
        return {"status_code": r.status_code, "json": r.json() if r.content else None, "text": r.text}

    def _get(self, path: str) -> Dict[str, Any]:
        url = f"{DATAFORSEO_BASE}{path}"
        r = self._session.get(url, timeout=self.timeout_s)
        return {"status_code": r.status_code, "json": r.json() if r.content else None, "text": r.text}

    # -------------------------
    # Labs (LIVE) endpoints
    # -------------------------

    def labs_domain_rank_overview_live(
        self,
        target: str,
        location_code: int,
        language_code: str,
        limit: int = 100,
        ignore_synonyms: bool = False,
    ) -> Dict[str, Any]:
        payload = [
            {
                "target": target,
                "location_code": int(location_code),
                "language_code": language_code,
                "ignore_synonyms": bool(ignore_synonyms),
                "limit": int(limit),
            }
        ]
        return self._post("/dataforseo_labs/google/domain_rank_overview/live", payload)

    def labs_competitors_domain_live(
        self,
        target: str,
        location_code: int,
        language_code: str,
        limit: int = 100,
        exclude_top_domains: bool = False,
        ignore_synonyms: bool = False,
        include_clickstream_data: bool = False,
    ) -> Dict[str, Any]:
        payload = [
            {
                "target": target,
                "location_code": int(location_code),
                "language_code": language_code,
                "exclude_top_domains": bool(exclude_top_domains),
                "ignore_synonyms": bool(ignore_synonyms),
                "include_clickstream_data": bool(include_clickstream_data),
                "limit": int(limit),
            }
        ]
        return self._post("/dataforseo_labs/google/competitors_domain/live", payload)

    def labs_serp_competitors_live(
        self,
        keywords: List[str],
        location_code: int,
        language_code: str,
        limit: int = 100,
        include_subdomains: bool = True,
    ) -> Dict[str, Any]:
        payload = [
            {
                "keywords": [k for k in keywords if isinstance(k, str) and k.strip()],
                "location_code": int(location_code),
                "language_code": language_code,
                "include_subdomains": bool(include_subdomains),
                "limit": int(limit),
            }
        ]
        return self._post("/dataforseo_labs/google/serp_competitors/live", payload)

    # -------------------------
    # Keywords data
    # -------------------------

    def keywords_for_site_live(self, target: str, sort_by: str = "relevance") -> Dict[str, Any]:
        payload = [{"target": target, "sort_by": sort_by}]
        return self._post("/keywords_data/google_ads/keywords_for_site/live", payload)

    # -------------------------
    # SERP endpoints (LIVE)
    # -------------------------

    def serp_google_organic_live_advanced(
        self,
        keyword: str,
        location_code: int,
        language_code: str,
        device: str = "desktop",
        os_name: str = "windows",
        depth: int = 10,
    ) -> Dict[str, Any]:
        payload = [
            {
                "keyword": keyword,
                "location_code": int(location_code),
                "language_code": language_code,
                "device": device,
                "os": os_name,
                "depth": int(depth),
            }
        ]
        return self._post("/serp/google/organic/live/advanced", payload)

    def serp_google_local_finder_live_advanced(
        self,
        keyword: str,
        location_code: int,
        language_code: str,
        device: str = "desktop",
        os_name: str = "windows",
        depth: int = 20,
    ) -> Dict[str, Any]:
        payload = [
            {
                "keyword": keyword,
                "location_code": int(location_code),
                "language_code": language_code,
                "device": device,
                "os": os_name,
                "depth": int(depth),
            }
        ]
        return self._post("/serp/google/local_finder/live/advanced", payload)

    # -------------------------
    # Legacy backlinks summary tasks (kept)
    # -------------------------

    def post_backlinks_task(self, target: str) -> Dict[str, Any]:
        payload = [{"target": target}]
        return self._post("/backlinks/summary/task_post", payload)

    def get_task(self, task_id: str) -> Dict[str, Any]:
        return self._get(f"/backlinks/summary/task_get/{task_id}")

    
    def create_backlinks_summary_task(self, target: str, include_subdomains: bool = True, limit: int = 100) -> Dict[str, Any]:
        """Backlinks Summary via LIVE endpoint.

        Returns DataForSEO response (status_code, tasks, result, etc.) directly.
        This avoids async task_post/task_get complexity and is best for synchronous API usage.
        """
        payload = [{
            "target": target,
            "include_subdomains": include_subdomains,
            "limit": limit,
        }]
        return self._post("/backlinks/summary/live", payload)


def wait_for_task(self, task_id: str, max_wait_s: int = 60, poll_s: int = 5) -> Dict[str, Any]:
        deadline = time.time() + max_wait_s
        last = None
        while time.time() < deadline:
            last = self.get_task(task_id)
            return last
        return {"ok": False, "error": "timeout", "task_id": task_id, "last": last}
