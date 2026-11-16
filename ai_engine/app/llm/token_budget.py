"""Central, provider-agnostic token budgeting for report-generation stages.

The engine deliberately uses a conservative text estimator so it works without
an optional provider tokenizer.  It is a guardrail, not a billing estimator;
providers remain the source of truth through the usage telemetry we record.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

from app.core.config import settings


@dataclass(frozen=True)
class TokenBudget:
    stage: str
    profile: str
    estimated_input_tokens: int
    max_input_tokens: int
    requested_output_tokens: int
    max_output_tokens: int
    compact_required: bool


_PROFILE_OUTPUTS = {
    "brief": 900,
    "standard": 1800,
    "detailed": 3200,
}


def estimate_tokens(text: str) -> int:
    """Cheap multilingual-ish token estimate, intentionally pessimistic for JSON."""
    text = text or ""
    if not text:
        return 0
    # Words tend to be ~0.75 tokens each; punctuation-heavy JSON is costlier.
    words = len(re.findall(r"\w+", text, flags=re.UNICODE))
    punctuation = len(re.findall(r'[{}\[\],:\"]', text))
    chars = len(text)
    return max(1, int(max(chars / 3.5, words * 1.15 + punctuation * 0.45)))


def build_budget(stage: str, system_prompt: str, user_prompt: str, requested_output_tokens: int) -> TokenBudget:
    profile = str(getattr(settings, "LLM_REPORT_PROFILE", "standard") or "standard").lower()
    profile = profile if profile in _PROFILE_OUTPUTS else "standard"
    context_limit = max(4096, int(getattr(settings, "LLM_CONTEXT_WINDOW_TOKENS", 16384) or 16384))
    safety = max(256, int(getattr(settings, "LLM_CONTEXT_SAFETY_TOKENS", 768) or 768))
    configured_cap = max(256, int(getattr(settings, "LLM_MAX_OUTPUT_TOKENS", 3200) or 3200))
    output = min(max(256, int(requested_output_tokens or _PROFILE_OUTPUTS[profile])), configured_cap)
    max_input = max(512, context_limit - output - safety)
    estimated = estimate_tokens(system_prompt) + estimate_tokens(user_prompt)
    return TokenBudget(
        stage=stage,
        profile=profile,
        estimated_input_tokens=estimated,
        max_input_tokens=max_input,
        requested_output_tokens=output,
        max_output_tokens=output,
        compact_required=estimated > max_input,
    )
