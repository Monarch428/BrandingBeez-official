from __future__ import annotations

from copy import deepcopy
from datetime import datetime
import secrets
from typing import Any, Dict

from bson import BSON
from pymongo.errors import DuplicateKeyError

from app.db.mongo import get_reports_collection


MAX_BSON_BYTES = 16 * 1024 * 1024
TARGET_SAFE_BYTES = 14 * 1024 * 1024
LARGE_TEXT_LIMIT = 200_000


def _estimate_bson_size(doc: Dict[str, Any]) -> int:
    try:
        return len(BSON.encode(doc))
    except Exception:
        return 0


def _truncate_large_strings(value: Any):
    LARGE_TEXT_LIMIT = 20000

    if isinstance(value, str) and len(value) > LARGE_TEXT_LIMIT:
        return value[:LARGE_TEXT_LIMIT] + "..."

    if isinstance(value, dict):
        return {k: _truncate_large_strings(v) for k, v in value.items()}

    if isinstance(value, list):
        return [_truncate_large_strings(v) for v in value]

    return value


def _strip_screenshot_payloads(analysis: Dict[str, Any]) -> None:
    appendices = analysis.get("appendices")
    if not isinstance(appendices, dict):
        return

    evidence_screenshots = appendices.get("evidenceScreenshots")
    if isinstance(evidence_screenshots, list):
        compact = []
        for item in evidence_screenshots:
            if not isinstance(item, dict):
                continue
            cleaned = {k: v for k, v in item.items() if k not in {"b64", "bytes", "raw", "image"}}
            slices = cleaned.get("slices")
            if isinstance(slices, list):
                new_slices = []
                for sl in slices:
                    if isinstance(sl, dict):
                        new_slices.append({k: v for k, v in sl.items() if k not in {"b64", "bytes", "raw", "image"}})
                cleaned["slices"] = new_slices
            compact.append(cleaned)
        appendices["evidenceScreenshots"] = compact

    evidence = appendices.get("evidence")
    if isinstance(evidence, dict):
        screenshots = evidence.get("screenshots")
        if isinstance(screenshots, dict):
            compact_screens = {}
            for key, value in screenshots.items():
                if isinstance(value, dict):
                    compact_screens[key] = {k: v for k, v in value.items() if k not in {"b64", "bytes", "raw", "image"}}
                else:
                    compact_screens[key] = value
            evidence["screenshots"] = compact_screens


def _drop_heaviest_appendix_blocks(analysis: Dict[str, Any]) -> None:
    appendices = analysis.get("appendices")
    if not isinstance(appendices, dict):
        return
    for key in ("serp", "backlinks"):
        if key in appendices and isinstance(appendices[key], list) and len(appendices[key]) > 20:
            appendices[key] = appendices[key][:20]


def _build_storage_safe_analysis(analysis: Dict[str, Any]) -> Dict[str, Any]:
    safe = deepcopy(analysis) if isinstance(analysis, dict) else {}
    safe = _truncate_large_strings(safe)
    _strip_screenshot_payloads(safe)

    doc = {"analysis": safe}
    size = _estimate_bson_size(doc)
    if size and size <= TARGET_SAFE_BYTES:
        return safe

    _drop_heaviest_appendix_blocks(safe)
    doc = {"analysis": safe}
    size = _estimate_bson_size(doc)
    if size and size <= TARGET_SAFE_BYTES:
        return safe

    appendices = safe.get("appendices")
    if isinstance(appendices, dict):
        appendices.pop("evidenceScreenshots", None)
        evidence = appendices.get("evidence")
        if isinstance(evidence, dict):
            evidence.pop("screenshots", None)
            evidence.pop("raw", None)

    doc = {"analysis": safe}
    size = _estimate_bson_size(doc)
    if size and size <= MAX_BSON_BYTES:
        return safe

    # Final protection: keep report content, but drop the heaviest appendix/evidence blocks entirely.
    if isinstance(appendices, dict):
        for key in ("serp", "backlinks", "pagesCrawled", "crawlRegistry", "rawEvidence"):
            appendices.pop(key, None)
    meta = safe.get("meta")
    if isinstance(meta, dict):
        for key in ("planningEvidence", "rawEvidence", "screenshots", "crawlPages"):
            meta.pop(key, None)

    return safe


class ReportsRepository:
    def __init__(self):
        self.col = get_reports_collection()

    def create_report(
        self,
        token: str,
        analysis: Dict[str, Any],
        website: str | None = None,
        company_name: str | None = None,
        industry: str | None = None,
        email: str | None = None,
        name: str | None = None,
        report_download_token: str | None = None,
    ) -> str:
        storage_safe_analysis = _build_storage_safe_analysis(analysis)
        doc = {
            "token": token,
            "analysis": storage_safe_analysis,
            "website": website,
            "companyName": company_name,
            "industry": industry,
            "email": email,
            "name": name,
            "reportDownloadToken": report_download_token,
            "reportGeneratedAt": datetime.utcnow(),
            "createdAt": datetime.utcnow(),
        }

        size = _estimate_bson_size(doc)
        if size and size > MAX_BSON_BYTES:
            raise ValueError(
                f"Storage-safe analysis is still too large for MongoDB ({size} bytes). Reduce appendix payloads before save."
            )

        try:
            res = self.col.insert_one(doc)
            return str(res.inserted_id)
        except DuplicateKeyError:
            raise

    def save(self, analysis: Dict[str, Any], website: str | None = None) -> tuple[str, str]:
        """Backwards-compatible wrapper used by orchestrator.py.

        Returns (report_id, token).
        """
        token = secrets.token_urlsafe(24)
        report_id = self.create_report(token=token, analysis=analysis, website=website)
        return report_id, token

    def get_by_token(self, token: str):
        return self.col.find_one({"token": token})
