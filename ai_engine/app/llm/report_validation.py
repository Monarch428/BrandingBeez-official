import copy
import logging
import math
import re
from typing import Any, Dict, List, Tuple, Type, TypeVar, get_args, get_origin

from pydantic import BaseModel, ValidationError

logger = logging.getLogger(__name__)

TModel = TypeVar("TModel", bound=BaseModel)
_NONE_TYPE = type(None)

# ---------------------------------------------------------------------------
# Placeholder junk detection
# ---------------------------------------------------------------------------
_JUNK_PATTERNS = re.compile(
    r"^(A\d+|O\d+|Seg\d+|Act\d+|V\d+|T\d+|W\d+|Pain\d+|Rec\d+|Item\d+|Step\d+|Key\d+|C\d+|S\d+|R\d+)$",
    re.IGNORECASE,
)

def _is_junk_string(value: Any) -> bool:
    """Return True when a string looks like an LLM placeholder (A1, O1, Seg1, etc.)."""
    if not isinstance(value, str):
        return False
    stripped = value.strip()
    if not stripped:
        return False
    return bool(_JUNK_PATTERNS.match(stripped))


def _scrub_junk_strings(obj: Any, replacement: str = "Not available") -> Any:
    """Recursively replace placeholder junk strings with a safe default."""
    if isinstance(obj, str):
        return replacement if _is_junk_string(obj) else obj
    if isinstance(obj, list):
        return [_scrub_junk_strings(item, replacement) for item in obj]
    if isinstance(obj, dict):
        return {k: _scrub_junk_strings(v, replacement) for k, v in obj.items()}
    return obj


def has_junk_output(data: Any, *, threshold: int = 3) -> bool:
    """Return True if data contains more than `threshold` placeholder junk strings."""
    count = 0

    def _walk(obj: Any) -> None:
        nonlocal count
        if count >= threshold:
            return
        if isinstance(obj, str) and _is_junk_string(obj):
            count += 1
        elif isinstance(obj, list):
            for item in obj:
                _walk(item)
        elif isinstance(obj, dict):
            for v in obj.values():
                _walk(v)

    _walk(data)
    return count >= threshold


def _is_model_type(annotation: Any) -> bool:
    return isinstance(annotation, type) and issubclass(annotation, BaseModel)


def _unwrap_optional(annotation: Any) -> Any:
    args = get_args(annotation)
    if args and any(arg is _NONE_TYPE for arg in args):
        non_none_args = [arg for arg in args if arg is not _NONE_TYPE]
        if len(non_none_args) == 1:
            return non_none_args[0]
    return annotation


def _coerce_int(value: Any, default: int = 0) -> int:
    if value is None:
        return default
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return default
        return int(value)
    if isinstance(value, str):
        text = value.strip().replace(",", "")
        if not text:
            return default
        match = re.search(r"-?\d+(?:\.\d+)?", text)
        if match:
            try:
                return int(float(match.group(0)))
            except Exception:
                return default
    return default


def _coerce_float(value: Any, default: float = 0.0) -> float:
    if value is None:
        return default
    if isinstance(value, bool):
        return float(int(value))
    if isinstance(value, (int, float)):
        if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
            return default
        return float(value)
    if isinstance(value, str):
        text = value.strip().replace(",", "")
        if not text:
            return default
        match = re.search(r"-?\d+(?:\.\d+)?", text)
        if match:
            try:
                return float(match.group(0))
            except Exception:
                return default
    return default


def _default_template(model_cls: Type[BaseModel]) -> Dict[str, Any]:
    try:
        return model_cls.model_validate({}).model_dump(mode="python")
    except Exception:
        return {}


def _normalize_generic(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return 0
    if isinstance(value, list):
        return [_normalize_generic(item) for item in value]
    if isinstance(value, dict):
        return {key: _normalize_generic(item) for key, item in value.items()}
    return value


def _merge_note_lines(existing: Any, additions: List[str]) -> str | None:
    merged: List[str] = []
    seen: set[str] = set()

    if isinstance(existing, str) and existing.strip():
        base = existing.strip()
        merged.append(base)
        seen.add(base.lower())

    for addition in additions:
        note = (addition or "").strip()
        if not note:
            continue
        key = note.lower()
        if key in seen:
            continue
        seen.add(key)
        merged.append(note)

    return "\n".join(merged) if merged else None


def _coerce_string_list_to_items(values: Any, key_name: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    raw_items = values if isinstance(values, list) else ([values] if values not in (None, "") else [])
    for item in raw_items:
        if isinstance(item, str) and item.strip():
            items.append({key_name: item.strip()})
        elif isinstance(item, dict):
            normalized = copy.deepcopy(item)
            if key_name not in normalized:
                for alias in ("title", "name", "label", "text", "item", "issue", "strength"):
                    alias_value = normalized.get(alias)
                    if isinstance(alias_value, str) and alias_value.strip():
                        normalized[key_name] = alias_value.strip()
                        break
            if isinstance(normalized.get(key_name), str) and normalized[key_name].strip():
                normalized[key_name] = normalized[key_name].strip()
                items.append(normalized)
    return items


def _coerce_website_digital_presence(value: Any) -> Dict[str, Any]:
    if isinstance(value, dict):
        normalized = copy.deepcopy(value)
    else:
        normalized = {}

    if isinstance(value, list):
        observations = [str(x).strip() for x in value if isinstance(x, str) and str(x).strip()]
        normalized.setdefault("strengths", [])
        normalized.setdefault("weaknesses", [])
        normalized.setdefault("observations", observations)
        normalized.setdefault("highPriorityFixes", [])
        return normalized

    normalized.setdefault("strengths", [])
    normalized.setdefault("weaknesses", [])
    normalized.setdefault("observations", [])
    normalized.setdefault("highPriorityFixes", [])
    return normalized


def _coerce_simple_object_from_list(value: Any, field_name: str = "recommendations") -> Dict[str, Any]:
    if isinstance(value, dict):
        return value
    if isinstance(value, list):
        rows = [str(x).strip() for x in value if isinstance(x, str) and str(x).strip()]
        return {field_name: rows}
    return {}


def _normalize_llm_output_internal(data: dict) -> Tuple[dict, Dict[str, int]]:
    if not isinstance(data, dict):
        return {}, {"serviceGaps_fixed": 0, "advantages_fixed": 0}

    normalized = copy.deepcopy(data)
    stats = {"serviceGaps_fixed": 0, "advantages_fixed": 0}

    services_positioning = normalized.get("servicesPositioning")
    if isinstance(services_positioning, dict):
        service_gaps = services_positioning.get("serviceGaps")
        if service_gaps is None:
            services_positioning["serviceGaps"] = []
        else:
            raw_items = service_gaps if isinstance(service_gaps, list) else [service_gaps]
            fixed_items = []
            for item in raw_items:
                if isinstance(item, str) and item.strip():
                    stats["serviceGaps_fixed"] += 1
                    fixed_items.append({"service": item.strip(), "reason": None, "impact": None})
                    continue
                if not isinstance(item, dict):
                    continue

                row = copy.deepcopy(item)
                service_name = row.get("service")
                if not isinstance(service_name, str) or not service_name.strip():
                    for alias in ("gap", "name", "title", "serviceName"):
                        alias_value = row.get(alias)
                        if isinstance(alias_value, str) and alias_value.strip():
                            row["service"] = alias_value.strip()
                            service_name = row["service"]
                            stats["serviceGaps_fixed"] += 1
                            break

                if isinstance(service_name, str) and service_name.strip():
                    row["service"] = service_name.strip()
                    row.setdefault("reason", row.get("whyItMatters"))
                    row.setdefault("impact", row.get("businessImpact") or row.get("expectedOutcome"))
                    row.setdefault("reason", None)
                    row.setdefault("impact", None)
                    fixed_items.append(row)
            services_positioning["serviceGaps"] = fixed_items

    competitive_advantages = normalized.get("competitiveAdvantages")
    if isinstance(competitive_advantages, dict):
        advantages = competitive_advantages.get("advantages")
        note_additions: List[str] = []
        if advantages is None:
            competitive_advantages["advantages"] = []
        else:
            raw_items = advantages if isinstance(advantages, list) else [advantages]
            fixed_items = []
            for item in raw_items:
                if isinstance(item, str):
                    text_value = item.strip()
                    if text_value:
                        fixed_items.append(text_value)
                    continue
                if isinstance(item, dict):
                    advantage_text = item.get("advantage") or item.get("title") or item.get("text") or item.get("name") or ""
                    if isinstance(advantage_text, str) and advantage_text.strip():
                        cleaned_advantage = advantage_text.strip()
                        stats["advantages_fixed"] += 1
                        fixed_items.append(cleaned_advantage)
                        why = item.get("whyItMatters")
                        how = item.get("howToLeverage")
                        if isinstance(why, str) and why.strip():
                            note_additions.append(f"{cleaned_advantage}: Why it matters: {why.strip()}")
                        if isinstance(how, str) and how.strip():
                            note_additions.append(f"{cleaned_advantage}: How to leverage: {how.strip()}")
            competitive_advantages["advantages"] = fixed_items
            if note_additions:
                competitive_advantages["notes"] = _merge_note_lines(competitive_advantages.get("notes"), note_additions)

    return normalized, stats


def _log_normalization_stats(stats: Dict[str, int], *, stage_name: str | None = None) -> None:
    total_fixed = int(stats.get("serviceGaps_fixed") or 0) + int(stats.get("advantages_fixed") or 0)
    if total_fixed > 0:
        suffix = f" stage={stage_name}" if stage_name else ""
        logger.info("[Normalization]%s fields_fixed=%s", suffix, total_fixed)
    if int(stats.get("serviceGaps_fixed") or 0) > 0:
        suffix = f" stage={stage_name}" if stage_name else ""
        logger.info("[Normalization]%s Fixed serviceGaps from string -> object count=%s", suffix, stats["serviceGaps_fixed"])
    if int(stats.get("advantages_fixed") or 0) > 0:
        suffix = f" stage={stage_name}" if stage_name else ""
        logger.info("[Normalization]%s Fixed advantages from object -> string count=%s", suffix, stats["advantages_fixed"])


def normalize_llm_output_with_stats(data: dict) -> Tuple[dict, Dict[str, int]]:
    normalized, stats = _normalize_llm_output_internal(data)
    _log_normalization_stats(stats)
    return normalized, stats


def normalize_llm_output(data: dict) -> dict:
    normalized, _ = normalize_llm_output_with_stats(data)
    return normalized


def _normalize_value(value: Any, annotation: Any, default: Any) -> Any:
    annotation = _unwrap_optional(annotation)
    origin = get_origin(annotation)

    if annotation is bool:
        return bool(default if value is None else value)
    if annotation is int:
        return _coerce_int(value, _coerce_int(default, 0))
    if annotation is float:
        return _coerce_float(value, _coerce_float(default, 0.0))
    if annotation is str:
        if value is None:
            return "" if default is None else str(default)
        if isinstance(value, (dict, list)):
            return ""
        return str(value)

    if _is_model_type(annotation):
        model_cls = annotation
        template = copy.deepcopy(default) if isinstance(default, dict) else _default_template(model_cls)
        source = value if isinstance(value, dict) else {}
        result: Dict[str, Any] = copy.deepcopy(template)

        for field_name, field in model_cls.model_fields.items():
            child_default = result.get(field_name)
            if field_name in source:
                result[field_name] = _normalize_value(source.get(field_name), field.annotation, child_default)
            else:
                result[field_name] = _normalize_value(None, field.annotation, child_default)

        for extra_key, extra_value in source.items():
            if extra_key not in model_cls.model_fields:
                result[extra_key] = _normalize_generic(extra_value)
        return result

    if origin in (list, List):
        item_annotation = get_args(annotation)[0] if get_args(annotation) else Any
        if value is None:
            items = copy.deepcopy(default) if isinstance(default, list) else []
        else:
            items = value if isinstance(value, list) else [value]
        return [_normalize_value(item, item_annotation, None) for item in items]

    if origin in (dict, Dict):
        value_annotation = get_args(annotation)[1] if len(get_args(annotation)) > 1 else Any
        if value is None:
            source_dict = copy.deepcopy(default) if isinstance(default, dict) else {}
        else:
            source_dict = value if isinstance(value, dict) else {}
        return {str(key): _normalize_value(item, value_annotation, None) for key, item in source_dict.items()}

    if value is None:
        return copy.deepcopy(default)
    return _normalize_generic(value)


def fix_missing_fields(data: Any, model_cls: Type[TModel]) -> Dict[str, Any]:
    source, _ = _normalize_llm_output_internal(data) if isinstance(data, dict) else ({}, {})
    template = _default_template(model_cls)
    fixed: Dict[str, Any] = copy.deepcopy(template)

    for field_name, field in model_cls.model_fields.items():
        field_default = template.get(field_name)
        fixed[field_name] = _normalize_value(source.get(field_name), field.annotation, field_default)

    for extra_key, extra_value in source.items():
        if extra_key not in model_cls.model_fields:
            fixed[extra_key] = _normalize_generic(extra_value)

    return fixed


def _deep_merge(base: Dict[str, Any], patch: Dict[str, Any]) -> Dict[str, Any]:
    merged: Dict[str, Any] = copy.deepcopy(base)
    for key, value in (patch or {}).items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def validate_stage_response_with_fallback(
    model_cls: Type[TModel],
    data: Any,
    *,
    stage_name: str,
) -> TModel:
    payload = data if isinstance(data, dict) else {}
    try:
        return model_cls.model_validate(payload)
    except ValidationError as first_error:
        logger.warning("[LLM] Stage schema validation failed for %s; attempting normalization. errors=%s", stage_name, first_error.errors())

    normalized_payload, stats = _normalize_llm_output_internal(payload)
    normalized_payload = _normalize_business_aware_shapes(normalized_payload)
    _log_normalization_stats(stats, stage_name=stage_name)

    try:
        return model_cls.model_validate(normalized_payload)
    except ValidationError as second_error:
        logger.warning("[LLM] Stage schema validation failed after normalization for %s; using empty response. errors=%s", stage_name, second_error.errors())
        return model_cls.model_validate({})


def validate_with_fallback(
    model_cls: Type[TModel],
    data: Any,
    *,
    fallback_data: Any | None = None,
    section_name: str = "payload",
) -> TModel:
    normalized_input, input_stats = _normalize_llm_output_internal(data) if isinstance(data, dict) else ({}, {"serviceGaps_fixed": 0, "advantages_fixed": 0})
    normalized_input = _normalize_business_aware_shapes(normalized_input)
    normalized_fallback, fallback_stats = _normalize_llm_output_internal(fallback_data) if isinstance(fallback_data, dict) else (None, {"serviceGaps_fixed": 0, "advantages_fixed": 0})
    if isinstance(normalized_fallback, dict):
        normalized_fallback = _normalize_business_aware_shapes(normalized_fallback)
    _log_normalization_stats(input_stats, stage_name=section_name)
    if isinstance(normalized_fallback, dict):
        _log_normalization_stats(fallback_stats, stage_name=f"{section_name}:fallback")

    try:
        return model_cls.model_validate(normalized_input or {})
    except ValidationError as first_error:
        logger.warning("[LLM] Validation failed for %s; attempting auto-fix. errors=%s", section_name, first_error.errors())

    fixed_payload = fix_missing_fields(normalized_input or {}, model_cls)
    if isinstance(normalized_fallback, dict):
        fixed_payload = _deep_merge(fix_missing_fields(normalized_fallback, model_cls), fixed_payload)

    try:
        return model_cls.model_validate(fixed_payload)
    except ValidationError as second_error:
        logger.warning("[LLM] Auto-fix validation failed for %s; falling back to defaults. errors=%s", section_name, second_error.errors())

    if isinstance(normalized_fallback, dict):
        fallback_payload = fix_missing_fields(normalized_fallback, model_cls)
        try:
            return model_cls.model_validate(fallback_payload)
        except ValidationError as fallback_error:
            logger.warning("[LLM] Fallback validation failed for %s; using empty template. errors=%s", section_name, fallback_error.errors())

    empty_payload = fix_missing_fields({}, model_cls)
    return model_cls.model_validate(empty_payload)


def _section_contexts_from_payload(data: dict) -> Dict[str, Any]:
    meta = data.get("meta") if isinstance(data.get("meta"), dict) else {}
    contexts = meta.get("sectionContexts")
    return contexts if isinstance(contexts, dict) else {}


def _business_profile_from_payload(data: dict) -> Dict[str, Any]:
    meta = data.get("meta") if isinstance(data.get("meta"), dict) else {}
    profile = meta.get("businessProfile")
    return profile if isinstance(profile, dict) else {}


def _normalize_business_aware_shapes(data: dict) -> dict:
    if not isinstance(data, dict):
        return data
    normalized = copy.deepcopy(data)
    contexts = _section_contexts_from_payload(normalized)
    profile = _business_profile_from_payload(normalized)

    # ── executiveSummary.quickWins: string → QuickWin object ───────────────────
    es = normalized.get("executiveSummary")
    if isinstance(es, dict):
        raw_qw = es.get("quickWins")
        if isinstance(raw_qw, list):
            fixed_qw = []
            for item in raw_qw:
                if isinstance(item, str) and item.strip():
                    fixed_qw.append({"title": item.strip(), "impact": None, "time": None})
                elif isinstance(item, dict):
                    row = copy.deepcopy(item)
                    # normalize alias keys → title
                    if not row.get("title"):
                        for alias in ("win", "action", "recommendation", "text", "name", "label"):
                            v = row.get(alias)
                            if isinstance(v, str) and v.strip():
                                row["title"] = v.strip()
                                break
                    if isinstance(row.get("title"), str) and row["title"].strip():
                        fixed_qw.append(row)
            es["quickWins"] = fixed_qw

        # highPriorityRecommendations: ensure list of strings
        hpr = es.get("highPriorityRecommendations")
        if isinstance(hpr, list):
            fixed_hpr = []
            for item in hpr:
                if isinstance(item, str) and item.strip():
                    fixed_hpr.append(item.strip())
                elif isinstance(item, dict):
                    for alias in ("recommendation", "title", "text", "action"):
                        v = item.get(alias)
                        if isinstance(v, str) and v.strip():
                            fixed_hpr.append(v.strip())
                            break
            es["highPriorityRecommendations"] = fixed_hpr

    # ── actionPlan90Days: normalize various shapes → List[ActionPlanWeek] ─────
    ap = normalized.get("actionPlan90Days")
    if isinstance(ap, dict):
        # {weekByWeek: [...]} or {weeks: [...]} or {actionPlan90Days: [...]}
        for alias in ("weekByWeek", "weeks", "actionPlan90Days", "blocks", "plan"):
            v = ap.get(alias)
            if isinstance(v, list):
                normalized["actionPlan90Days"] = v
                ap = v
                break
        else:
            normalized["actionPlan90Days"] = []
            ap = []

    if isinstance(normalized.get("actionPlan90Days"), list):
        fixed_weeks = []
        for i, w in enumerate(normalized["actionPlan90Days"]):
            if not isinstance(w, dict):
                continue
            row = copy.deepcopy(w)
            # Normalize weekRange
            if not row.get("weekRange"):
                for alias in ("week", "period", "range", "timeframe"):
                    v = row.get(alias)
                    if isinstance(v, str) and v.strip():
                        row["weekRange"] = v.strip()
                        break
                else:
                    row["weekRange"] = f"Week {i*2+1}-{i*2+2}"
            # Normalize title
            if not row.get("title"):
                for alias in ("focus", "theme", "name", "phase"):
                    v = row.get(alias)
                    if isinstance(v, str) and v.strip():
                        row["title"] = v.strip()
                        break
                else:
                    row["title"] = row["weekRange"]
            # Normalize actions → list of strings
            actions = row.get("actions")
            if isinstance(actions, str):
                row["actions"] = [actions]
            elif not isinstance(actions, list):
                row["actions"] = []
            else:
                row["actions"] = [
                    (a if isinstance(a, str) else str(a.get("action") or a.get("title") or ""))
                    for a in actions if a
                ]
            # Normalize kpis → list of dicts with {kpi, current, target}
            kpis = row.get("kpis")
            if isinstance(kpis, list):
                fixed_kpis = []
                for k in kpis:
                    if isinstance(k, str) and k.strip():
                        fixed_kpis.append({"kpi": k.strip(), "current": "N/A", "target": "N/A"})
                    elif isinstance(k, dict):
                        kpi_label = k.get("kpi") or k.get("name") or k.get("metric") or k.get("label") or str(k)
                        fixed_kpis.append({
                            "kpi": str(kpi_label),
                            "current": k.get("current", "N/A"),
                            "target": k.get("target", "N/A"),
                        })
                row["kpis"] = fixed_kpis
            else:
                row["kpis"] = []
            fixed_weeks.append(row)
        normalized["actionPlan90Days"] = fixed_weeks

    # ── missingHighROIChannels: coerce strings/dicts → {channel:...} objects ──
    lg = normalized.get("leadGeneration")
    if isinstance(lg, dict):
        mh = lg.get("missingHighROIChannels")
        if isinstance(mh, str) and mh.strip():
            lg["missingHighROIChannels"] = [{"channel": mh.strip()}]
        elif isinstance(mh, list):
            fixed_mh = []
            for item in mh:
                if isinstance(item, str) and item.strip():
                    fixed_mh.append({"channel": item.strip()})
                elif isinstance(item, dict):
                    row = copy.deepcopy(item)
                    if not row.get("channel"):
                        for alias in ("name", "title", "channelName"):
                            v = row.get(alias)
                            if isinstance(v, str) and v.strip():
                                row["channel"] = v.strip()
                                break
                    if isinstance(row.get("channel"), str) and row["channel"].strip():
                        fixed_mh.append(row)
            lg["missingHighROIChannels"] = fixed_mh

    # ── LeadChannel: coerce string channels list → [{channel:...}] ───────────
    if isinstance(lg, dict):
        channels = lg.get("channels")
        if isinstance(channels, list):
            fixed_ch = []
            for item in channels:
                if isinstance(item, str) and item.strip():
                    fixed_ch.append({"channel": item.strip()})
                elif isinstance(item, dict):
                    fixed_ch.append(item)
            lg["channels"] = fixed_ch

    # ── seoVisibility: coerce flat recommendation strings ────────────────────
    seo_vis = normalized.get("seoVisibility")
    if isinstance(seo_vis, dict):
        for key in ("priorityActions", "recommendations"):
            val = seo_vis.get(key)
            if isinstance(val, list):
                seo_vis[key] = [
                    (v if isinstance(v, str) else str(v.get("recommendation") or v.get("action") or v.get("title") or ""))
                    for v in val if v
                ]

    # ── websiteDigitalPresence: coerce recommendations strings ───────────────
    website_presence = normalized.get("websiteDigitalPresence")
    if website_presence is not None:
        normalized["websiteDigitalPresence"] = _coerce_website_digital_presence(website_presence)

    if isinstance(normalized.get("websiteDigitalPresence"), dict):
        wdp = normalized["websiteDigitalPresence"]
        for key in ("technicalSEO", "contentQuality", "uxConversion", "websiteKeywordAnalysis"):
            if key in wdp and isinstance(wdp.get(key), list):
                wdp[key] = _coerce_simple_object_from_list(wdp.get(key))
        # contentGaps: ensure list of strings
        cg = wdp.get("contentGaps")
        if isinstance(cg, list):
            wdp["contentGaps"] = [
                (v if isinstance(v, str) else str(v.get("gap") or v.get("title") or v.get("name") or ""))
                for v in cg if v
            ]

    if isinstance(normalized.get("seoVisibility"), dict):
        seo = normalized["seoVisibility"]
        for key in ("backlinks", "keywordRankings", "localSEO"):
            if key in seo and isinstance(seo.get(key), list):
                seo[key] = _coerce_simple_object_from_list(seo.get(key), field_name="notes")

    # keep target-market aliases synchronized
    target = normalized.get("targetMarket")
    if isinstance(target, dict):
        segs = target.get("segments") or target.get("currentTargetSegments") or target.get("detectedSegments") or []
        if isinstance(segs, list):
            # Coerce segment strings to TargetMarketSegment objects
            fixed_segs = []
            for seg in segs:
                if isinstance(seg, str) and seg.strip():
                    fixed_segs.append({"segment": seg.strip()})
                elif isinstance(seg, dict):
                    row = copy.deepcopy(seg)
                    if not row.get("segment"):
                        for alias in ("name", "title", "market", "segmentName"):
                            v = row.get(alias)
                            if isinstance(v, str) and v.strip():
                                row["segment"] = v.strip()
                                break
                    fixed_segs.append(row)
            segs = fixed_segs
            target["segments"] = segs
            target.setdefault("currentTargetSegments", copy.deepcopy(segs))
            target.setdefault("detectedSegments", copy.deepcopy(segs))

    impact = normalized.get("financialImpact")
    if isinstance(impact, dict):
        levers = impact.get("profitabilityLevers") or impact.get("revenueOpportunities") or []
        if isinstance(levers, list):
            impact.setdefault("profitabilityLevers", copy.deepcopy(levers))
            impact.setdefault("revenueOpportunities", copy.deepcopy(levers))

    cost = normalized.get("costOptimization")
    if isinstance(cost, dict):
        if cost.get("opportunities") is None:
            cost["opportunities"] = []
        elif isinstance(cost.get("opportunities"), list):
            fixed_opps = []
            for item in cost.get("opportunities") or []:
                if isinstance(item, str) and item.strip():
                    fixed_opps.append({"title": item.strip(), "description": None, "impact": None, "effort": None})
                elif isinstance(item, dict):
                    row = copy.deepcopy(item)
                    if "title" not in row:
                        for alias in ("name", "opportunity", "label"):
                            alias_value = row.get(alias)
                            if isinstance(alias_value, str) and alias_value.strip():
                                row["title"] = alias_value.strip()
                                break
                    if isinstance(row.get("title"), str) and row["title"].strip():
                        fixed_opps.append(row)
            cost["opportunities"] = fixed_opps

    if isinstance(impact, dict):
        for key in ("revenueTable", "profitabilityLevers", "revenueOpportunities", "modeledOutcomes"):
            if impact.get(key) is None:
                impact[key] = []
        if isinstance(impact.get("revenueTable"), list):
            fixed_rows = []
            for row in impact.get("revenueTable") or []:
                if isinstance(row, str) and row.strip():
                    fixed_rows.append({"metric": row.strip(), "value": "N/A"})
                elif isinstance(row, dict):
                    normalized_row = copy.deepcopy(row)
                    if "metric" not in normalized_row:
                        for alias in ("name", "label", "title"):
                            alias_value = normalized_row.get(alias)
                            if isinstance(alias_value, str) and alias_value.strip():
                                normalized_row["metric"] = alias_value.strip()
                                break
                    if "value" not in normalized_row:
                        normalized_row["value"] = str(normalized_row.get("amount") or normalized_row.get("current") or "N/A")
                    if isinstance(normalized_row.get("metric"), str) and normalized_row["metric"].strip():
                        fixed_rows.append(normalized_row)
            impact["revenueTable"] = fixed_rows

    # attach transparent directional notes when a section exists but evidence is weak
    section_map = {
        "costOptimization": normalized.get("costOptimization"),
        "targetMarket": normalized.get("targetMarket"),
        "financialImpact": normalized.get("financialImpact"),
        "competitiveAnalysis": normalized.get("competitiveAnalysis"),
    }
    for section_name, section_value in section_map.items():
        if not isinstance(section_value, dict):
            continue
        ctx = contexts.get(section_name) if isinstance(contexts, dict) else {}
        relevance = ctx.get("relevance") if isinstance(ctx, dict) else {}
        level = relevance.get("level") if isinstance(relevance, dict) else None
        reason = relevance.get("reason") if isinstance(relevance, dict) else None
        if level and not section_value.get("notes"):
            prefix = "Directional only." if level in {"medium", "low"} else ""
            note = " ".join([p for p in [prefix, reason] if isinstance(p, str) and p.strip()]).strip()
            if note:
                section_value["notes"] = note

    # preserve meta context if present
    if isinstance(normalized.get("meta"), dict):
        normalized["meta"].setdefault("businessProfile", profile or {})
        normalized["meta"].setdefault("sectionContexts", contexts or {})
    return normalized
