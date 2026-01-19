from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from pymongo.collection import Collection

from app.core.config import settings
from app.db.mongo import get_db


def get_analysis_cache_collection() -> Collection:
    db = get_db()
    return db[settings.MONGO_COLLECTION_ANALYSIS_CACHE]


def _now() -> datetime:
    return datetime.utcnow()


def _is_fresh(ts: Any, ttl_days: int) -> bool:
    if not ts or not ttl_days:
        return False
    try:
        if isinstance(ts, str):
            # ISO string
            ts_dt = datetime.fromisoformat(ts.replace("Z", "+00:00")).replace(tzinfo=None)
        elif isinstance(ts, datetime):
            ts_dt = ts.replace(tzinfo=None)
        else:
            return False
        return ts_dt >= (_now() - timedelta(days=int(ttl_days)))
    except Exception:
        return False


class AnalysisCacheRepository:
    """Small per-website cache to speed up repeat analyses.

    Stores raw outputs for expensive steps:
    - crawl/pages
    - pagespeed
    - dataforseo
    - places
    - screenshots
    """

    def __init__(self):
        self.col = get_analysis_cache_collection()
        # create an index (best effort)
        try:
            self.col.create_index([("cacheKey", 1)], unique=True)
        except Exception:
            pass

    @staticmethod
    def make_cache_key(website: str) -> str:
        # versioning allows safe invalidation
        return f"{settings.CACHE_VERSION}:{(website or '').strip().lower()}"

    def get(self, cache_key: str) -> Optional[Dict[str, Any]]:
        if not cache_key:
            return None
        return self.col.find_one({"cacheKey": cache_key})

    def upsert_section(self, cache_key: str, section: str, value: Any) -> None:
        if not cache_key or not section:
            return
        self.col.update_one(
            {"cacheKey": cache_key},
            {"$set": {f"sections.{section}.value": value, f"sections.{section}.ts": _now(), "updatedAt": _now()}},
            upsert=True,
        )

    def get_section_if_fresh(self, cache_key: str, section: str, ttl_days: int) -> Optional[Any]:
        doc = self.get(cache_key)
        if not doc:
            return None
        sec = ((doc.get("sections") or {}).get(section) or {})
        ts = sec.get("ts")
        if _is_fresh(ts, ttl_days=ttl_days):
            return sec.get("value")
        return None
