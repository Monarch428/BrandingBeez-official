from __future__ import annotations

from typing import Any, Dict, List, Tuple


# Keys that commonly carry huge blobs (HTML dumps, full-page text, screenshots, etc.)
_DROP_KEYS = {
    "html",
    "raw_html",
    "rawHtml",
    "raw",
    "body",
    "document",
    "dom",
    "nodes",
    "screenshot",
    "screenshots",
    "screenshotBase64",
    "imageBase64",
    "base64",
    "fullText",
    "pageText",
    "innerText",
    "markdown",
    "contentHtml",
    "content_html",
    "renderedHtml",
    "rendered_html",
    "page_content",
    "pageContent",
}

# Keys that may be useful but should be heavily trimmed if present
_TRIM_TEXT_KEYS = {
    "text",
    "content",
    "excerpt",
    "summary",
    "description",
    "metaDescription",
    "meta_description",
    "h1",
    "title",
}


def _cap_list(items: Any, limit: int) -> Any:
    if isinstance(items, list):
        return items[:limit]
    return items


def _cap_str(s: Any, limit: int) -> Any:
    if isinstance(s, str) and len(s) > limit:
        return s[:limit] + " …(trimmed)"
    return s


def _shrink(
    obj: Any,
    *,
    max_str: int = 1200,
    max_list: int = 20,
    max_dict_keys: int = 60,
    depth: int = 0,
    max_depth: int = 6,
) -> Any:
    """Recursively shrink JSON-like structures to control token usage."""
    if depth > max_depth:
        # Stop recursion: keep a tiny representation
        if isinstance(obj, str):
            return _cap_str(obj, 300)
        if isinstance(obj, (int, float, bool)) or obj is None:
            return obj
        if isinstance(obj, list):
            return obj[:3]
        if isinstance(obj, dict):
            # keep a few keys only
            out = {}
            for i, (k, v) in enumerate(obj.items()):
                if i >= 8:
                    break
                out[k] = _shrink(v, max_str=max_str, max_list=max_list, max_dict_keys=max_dict_keys, depth=depth + 1)
            return out
        return str(obj)[:300]

    if isinstance(obj, str):
        return _cap_str(obj, max_str)

    if isinstance(obj, list):
        out_list = []
        for v in obj[:max_list]:
            out_list.append(_shrink(v, max_str=max_str, max_list=max_list, max_dict_keys=max_dict_keys, depth=depth + 1))
        return out_list

    if isinstance(obj, dict):
        out: Dict[str, Any] = {}
        # keep deterministic order for stability in caching
        for i, k in enumerate(list(obj.keys())[:max_dict_keys]):
            if k in _DROP_KEYS:
                continue
            v = obj.get(k)
            if k in _TRIM_TEXT_KEYS:
                v = _cap_str(v, min(max_str, 800))
            out[k] = _shrink(v, max_str=max_str, max_list=max_list, max_dict_keys=max_dict_keys, depth=depth + 1)
        return out

    return obj


def _summarize_homepage(home: Any) -> Any:
    if not isinstance(home, dict):
        return home
    keep = {}
    for k in ["url", "title", "metaDescription", "meta_description", "description", "h1", "h2", "headings", "summary"]:
        if k in home:
            keep[k] = home.get(k)
    # If headings list exists, cap it
    if isinstance(keep.get("headings"), list):
        keep["headings"] = keep["headings"][:12]
    return _shrink(keep, max_str=900, max_list=15)


def _summarize_reviews(rep: Any) -> Any:
    if not isinstance(rep, dict):
        return rep
    keep = {}
    for k in ["averageRating", "avgRating", "rating", "reviewCount", "totalReviews", "source", "sources", "platforms", "summary"]:
        if k in rep:
            keep[k] = rep.get(k)
    # Keep only a few short snippets if present
    snippets = rep.get("snippets") or rep.get("topReviews") or rep.get("reviews")
    if isinstance(snippets, list):
        keep["snippets"] = [_cap_str(x, 220) for x in snippets[:8]]
    return _shrink(keep, max_str=700, max_list=12)


def _summarize_dataforseo(dfs: Any) -> Any:
    if not isinstance(dfs, dict):
        return dfs
    keep = {}
    for k in ["domain", "visibility", "summary", "topKeywords", "keywords", "competitors", "topCompetitors"]:
        if k in dfs:
            keep[k] = dfs.get(k)
    # Cap keywords/competitors aggressively
    if isinstance(keep.get("topKeywords"), list):
        keep["topKeywords"] = keep["topKeywords"][:20]
    if isinstance(keep.get("keywords"), list):
        keep["keywords"] = keep["keywords"][:20]
    if isinstance(keep.get("competitors"), list):
        keep["competitors"] = keep["competitors"][:10]
    if isinstance(keep.get("topCompetitors"), list):
        keep["topCompetitors"] = keep["topCompetitors"][:10]
    return _shrink(keep, max_str=700, max_list=20, max_dict_keys=50)


def compact_llm_context(ctx: Dict[str, Any]) -> Dict[str, Any]:
    """Reduce prompt payload size while keeping high-signal evidence.

    Goal: Keep reconcile prompts under practical TPM limits (avoid 429 "Request too large")
    and stay within Gemini input token limits.
    """
    if not isinstance(ctx, dict):
        return {}

    out: Dict[str, Any] = {}

    # Always keep key mode flags
    for k in ["companyName", "website", "estimationMode", "estimationInputs", "userInputs"]:
        if k in ctx:
            out[k] = ctx.get(k)

    # Summarize heavy blocks instead of passing them raw
    if "homepage" in ctx:
        out["homepage"] = _summarize_homepage(ctx.get("homepage"))
    if "pagespeed" in ctx:
        out["pagespeed"] = _shrink(ctx.get("pagespeed"), max_str=700, max_list=15, max_dict_keys=50)
    if "services" in ctx:
        out["services"] = _shrink(ctx.get("services"), max_str=700, max_list=20, max_dict_keys=60)
    if "leadgen" in ctx:
        out["leadgen"] = _shrink(ctx.get("leadgen"), max_str=700, max_list=20, max_dict_keys=60)
    if "websiteSignals" in ctx:
        out["websiteSignals"] = _shrink(ctx.get("websiteSignals"), max_str=650, max_list=20, max_dict_keys=60)
    if "seoSignals" in ctx:
        out["seoSignals"] = _shrink(ctx.get("seoSignals"), max_str=650, max_list=20, max_dict_keys=60)
    if "reputationSignals" in ctx:
        out["reputationSignals"] = _summarize_reviews(ctx.get("reputationSignals"))
    if "dataforseo" in ctx:
        out["dataforseo"] = _summarize_dataforseo(ctx.get("dataforseo"))
    if "uiux" in ctx:
        out["uiux"] = _shrink(ctx.get("uiux"), max_str=650, max_list=15, max_dict_keys=50)
    if "robotsSitemap" in ctx:
        out["robotsSitemap"] = _shrink(ctx.get("robotsSitemap"), max_str=650, max_list=15, max_dict_keys=50)

    # pageRegistry can be huge; keep only summaries
    pr = ctx.get("pageRegistry")
    if isinstance(pr, dict):
        out["pageRegistry"] = {
            "summary": _cap_str(pr.get("summary"), 900),
            "byType": _cap_list(pr.get("byType"), 40),
            "keyPages": _cap_list(pr.get("keyPages"), 25),
        }
        out["pageRegistry"] = _shrink(out["pageRegistry"], max_str=650, max_list=40, max_dict_keys=40)

    # competitors can be large; cap + shrink
    comps = ctx.get("competitors")
    if isinstance(comps, list):
        out["competitors"] = _shrink(comps[:8], max_str=650, max_list=8, max_dict_keys=40)

    return out


def compact_base_report(report: Dict[str, Any]) -> Dict[str, Any]:
    """Trim base_report before sending to reconcile prompt."""
    if not isinstance(report, dict):
        return {}

    out = _shrink(report, max_str=700, max_list=20, max_dict_keys=80)

    # appendices can get huge; keep short (even after shrink)
    appx = out.get("appendices")
    if isinstance(appx, dict):
        out["appendices"] = {
            "dataSources": _cap_list(appx.get("dataSources"), 15),
            "dataGaps": _cap_list(appx.get("dataGaps"), 15),
            "evidence": _cap_list(appx.get("evidence"), 15),
        }

    return out