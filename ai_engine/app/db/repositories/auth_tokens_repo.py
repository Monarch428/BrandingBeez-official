from __future__ import annotations

from typing import Any, Dict, Optional

from bson import ObjectId
from pymongo.collection import Collection

from app.core.config import settings
from app.db.mongo import get_db


def get_auth_tokens_collection() -> Collection:
    db = get_db()
    return db[settings.MONGO_COLLECTION_AUTH_API_TOKENS]


def _best_time(doc: Dict[str, Any], key: str) -> Any:
    # Mongo may store ISO string, datetime, or number.
    v = doc.get(key)
    return v


def find_latest_google_tokens() -> Optional[Dict[str, Any]]:
    """Fetch the most recently updated Google OAuth token doc.

    We keep this intentionally flexible because your Node side might store different schemas.
    If you store a provider/service field, we try to match it; otherwise we fall back to latest doc.
    """
    col = get_auth_tokens_collection()

    # Try more specific matches first (common fields)
    queries = [
        {"provider": {"$in": ["google", "Google"]}},
        {"service": {"$in": ["search_console", "gsc", "SearchConsole", "search-console"]}},
        {"type": {"$in": ["google", "oauth_google", "oauth"]}},
        {},  # fallback: any
    ]

    for q in queries:
        doc = col.find_one(
            q,
            sort=[("updatedAt", -1), ("updated_at", -1), ("createdAt", -1), ("created_at", -1), ("_id", -1)],
        )
        if doc:
            return doc
    return None


def update_google_tokens(doc_id: Any, updates: Dict[str, Any]) -> None:
    """Update token doc in-place (best-effort)."""
    if not doc_id:
        return
    col = get_auth_tokens_collection()
    _id = doc_id
    if isinstance(doc_id, str):
        try:
            _id = ObjectId(doc_id)
        except Exception:
            _id = doc_id
    col.update_one({"_id": _id}, {"$set": updates}, upsert=False)
