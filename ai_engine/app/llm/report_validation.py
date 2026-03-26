import copy
import logging
import math
import re
from typing import Any, Dict, List, Tuple, Type, TypeVar, get_args, get_origin

from pydantic import BaseModel, ValidationError

logger = logging.getLogger(__name__)

TModel = TypeVar("TModel", bound=BaseModel)
_NONE_TYPE = type(None)


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
    normalized_fallback, fallback_stats = _normalize_llm_output_internal(fallback_data) if isinstance(fallback_data, dict) else (None, {"serviceGaps_fixed": 0, "advantages_fixed": 0})
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
