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
      - Backlinks (summary/referring domains/backlinks/anchors/pages/history/intersections)
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


    def keywords_data_search_volume_live(
        self,
        keywords: List[str],
        location_code: Optional[int] = None,
        language_code: Optional[str] = None,
        include_serp_info: bool = False,
    ) -> Dict[str, Any]:
        """Google Ads Search Volume (LIVE).

        Provides search volume, CPC, competition, monthly trend etc. for up to 1000 keywords.
        Docs: https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live
        """
        task: Dict[str, Any] = {
            "keywords": [k for k in keywords if isinstance(k, str) and k.strip()],
            "include_serp_info": bool(include_serp_info),
        }
        if location_code is not None:
            task["location_code"] = int(location_code)
        if language_code:
            task["language_code"] = str(language_code)
        payload = [task]
        return self._post("/keywords_data/google_ads/search_volume/live", payload)

    # -------------------------
    # Locations / Languages (free GET endpoints)
    # -------------------------

    def serp_google_locations(self, country: Optional[str] = None) -> Dict[str, Any]:
        """Get supported Google SERP locations (free endpoint)."""
        c = (country or "").strip().lower()
        path = f"/serp/google/locations/{c}" if c else "/serp/google/locations"
        return self._get(path)

    def keywords_google_ads_locations(self) -> Dict[str, Any]:
        """Get supported Google Ads Keywords Data locations (free endpoint)."""
        return self._get("/keywords_data/google_ads/locations")

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

    # -------------------------
    # Backlinks endpoints (LIVE)
    # -------------------------

    def backlinks_referring_domains_live(
        self,
        target: str,
        limit: int = 100,
        internal_list_limit: int = 10,
        backlinks_status_type: str = "live",
        include_subdomains: bool = True,
        exclude_internal_backlinks: bool = True,
        include_indirect_links: bool = True,
        rank_scale: str = "one_hundred",
        mode: Optional[str] = None,
        filters: Optional[List[Any]] = None,
        order_by: Optional[List[Any]] = None,
    ) -> Dict[str, Any]:
        payload: List[Dict[str, Any]] = [
            {
                "target": target,
                "limit": int(limit),
                "internal_list_limit": int(internal_list_limit),
                "backlinks_status_type": backlinks_status_type,
                "include_subdomains": bool(include_subdomains),
                "exclude_internal_backlinks": bool(exclude_internal_backlinks),
                "include_indirect_links": bool(include_indirect_links),
                "rank_scale": rank_scale,
            }
        ]
        if mode:
            payload[0]["mode"] = mode
        if filters:
            payload[0]["filters"] = filters
        if order_by:
            payload[0]["order_by"] = order_by
        return self._post("/backlinks/referring_domains/live", payload)

    def backlinks_backlinks_live(
        self,
        target: str,
        limit: int = 100,
        internal_list_limit: int = 10,
        backlinks_status_type: str = "live",
        include_subdomains: bool = True,
        exclude_internal_backlinks: bool = True,
        include_indirect_links: bool = True,
        mode: str = "as_is",
        rank_scale: str = "one_hundred",
        filters: Optional[List[Any]] = None,
        order_by: Optional[List[Any]] = None,
    ) -> Dict[str, Any]:
        payload: List[Dict[str, Any]] = [
            {
                "target": target,
                "limit": int(limit),
                "internal_list_limit": int(internal_list_limit),
                "backlinks_status_type": backlinks_status_type,
                "include_subdomains": bool(include_subdomains),
                "exclude_internal_backlinks": bool(exclude_internal_backlinks),
                "include_indirect_links": bool(include_indirect_links),
                "mode": mode,
                "rank_scale": rank_scale,
            }
        ]
        if filters:
            payload[0]["filters"] = filters
        if order_by:
            payload[0]["order_by"] = order_by
        return self._post("/backlinks/backlinks/live", payload)

    def backlinks_anchors_live(
        self,
        target: str,
        limit: int = 100,
        internal_list_limit: int = 10,
        backlinks_status_type: str = "live",
        include_subdomains: bool = True,
        exclude_internal_backlinks: bool = True,
        include_indirect_links: bool = True,
        rank_scale: str = "one_hundred",
        filters: Optional[List[Any]] = None,
        order_by: Optional[List[Any]] = None,
    ) -> Dict[str, Any]:
        payload: List[Dict[str, Any]] = [
            {
                "target": target,
                "limit": int(limit),
                "internal_list_limit": int(internal_list_limit),
                "backlinks_status_type": backlinks_status_type,
                "include_subdomains": bool(include_subdomains),
                "exclude_internal_backlinks": bool(exclude_internal_backlinks),
                "include_indirect_links": bool(include_indirect_links),
                "rank_scale": rank_scale,
            }
        ]
        if filters:
            payload[0]["filters"] = filters
        if order_by:
            payload[0]["order_by"] = order_by
        return self._post("/backlinks/anchors/live", payload)

    def backlinks_domain_pages_live(
        self,
        target: str,
        limit: int = 100,
        internal_list_limit: int = 10,
        backlinks_status_type: str = "live",
        include_subdomains: bool = True,
        exclude_internal_backlinks: bool = True,
        include_indirect_links: bool = True,
        rank_scale: str = "one_hundred",
        filters: Optional[List[Any]] = None,
        order_by: Optional[List[Any]] = None,
    ) -> Dict[str, Any]:
        payload: List[Dict[str, Any]] = [
            {
                "target": target,
                "limit": int(limit),
                "internal_list_limit": int(internal_list_limit),
                "backlinks_status_type": backlinks_status_type,
                "include_subdomains": bool(include_subdomains),
                "exclude_internal_backlinks": bool(exclude_internal_backlinks),
                "include_indirect_links": bool(include_indirect_links),
                "rank_scale": rank_scale,
            }
        ]
        if filters:
            payload[0]["filters"] = filters
        if order_by:
            payload[0]["order_by"] = order_by
        return self._post("/backlinks/domain_pages/live", payload)

    def backlinks_history_live(self, target: str, rank_scale: str = "one_hundred") -> Dict[str, Any]:
        payload: List[Dict[str, Any]] = [{"target": target, "rank_scale": rank_scale}]
        return self._post("/backlinks/history/live", payload)

    def backlinks_domain_intersection_live(
        self,
        targets: Dict[str, str],
        limit: int = 100,
        internal_list_limit: int = 10,
        backlinks_status_type: str = "live",
        include_subdomains: bool = True,
        intersection_mode: str = "all",
        exclude_internal_backlinks: bool = True,
        include_indirect_links: bool = True,
        rank_scale: str = "one_hundred",
    ) -> Dict[str, Any]:
        payload = [
            {
                "targets": targets,
                "limit": int(limit),
                "internal_list_limit": int(internal_list_limit),
                "backlinks_status_type": backlinks_status_type,
                "include_subdomains": bool(include_subdomains),
                "intersection_mode": intersection_mode,
                "exclude_internal_backlinks": bool(exclude_internal_backlinks),
                "include_indirect_links": bool(include_indirect_links),
                "rank_scale": rank_scale,
            }
        ]
        return self._post("/backlinks/domain_intersection/live", payload)

    def backlinks_page_intersection_live(
        self,
        targets: Dict[str, str],
        limit: int = 100,
        internal_list_limit: int = 10,
        backlinks_status_type: str = "live",
        include_subdomains: bool = True,
        intersection_mode: str = "all",
        exclude_internal_backlinks: bool = True,
        include_indirect_links: bool = True,
        rank_scale: str = "one_hundred",
    ) -> Dict[str, Any]:
        payload = [
            {
                "targets": targets,
                "limit": int(limit),
                "internal_list_limit": int(internal_list_limit),
                "backlinks_status_type": backlinks_status_type,
                "include_subdomains": bool(include_subdomains),
                "intersection_mode": intersection_mode,
                "exclude_internal_backlinks": bool(exclude_internal_backlinks),
                "include_indirect_links": bool(include_indirect_links),
                "rank_scale": rank_scale,
            }
        ]
        return self._post("/backlinks/page_intersection/live", payload)


def wait_for_task(self, task_id: str, max_wait_s: int = 60, poll_s: int = 5) -> Dict[str, Any]:
        deadline = time.time() + max_wait_s
        last = None
        while time.time() < deadline:
            last = self.get_task(task_id)
            return last
        return {"ok": False, "error": "timeout", "task_id": task_id, "last": last}
