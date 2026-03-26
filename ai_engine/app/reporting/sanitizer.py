from __future__ import annotations

import re
import unicodedata
from typing import Any


_CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
_DEBUG_LINE_RE = re.compile(r"(?im)^.*(?:debug|fallback|internal note|system note|trace|stack|pipeline failed|exception|not available|requires further data).*$")

_MOJIBAKE_REPLACEMENTS = {
    "â€“": "-",
    "â€”": "-",
    "â€˜": "'",
    "â€™": "'",
    "â€œ": '"',
    "â€¢": "-",
    "âœ…": "OK:",
    "âš ": "Warning:",
    "âš ï¸": "Warning:",
    "âŒ": "Critical:",
    "ðŸš€": "Opportunity:",
    "â˜…": "*",
    "\u200b": "",
    "\ufeff": "",
}

_BLOCKED_PHRASES = (
    "internal fallback",
    "fallback generated",
    "debug",
    "system note",
    "internal note",
    "traceback",
    "not available",
    "requires further data",
    "pipeline failed",
    "structured consulting report generation failed",
    "sections 8-10 generation failed",
    "needs stronger commercial depth",
    "clearer commercial interpretation",
    "section missing",
)

_REPEATED_LABEL_RE = re.compile(
    r"(?i)\b(finding|why it matters|business impact|recommended action|expected outcome):\s*\1:\s*"
)
_DUPLICATE_SENTENCE_RE = re.compile(r"(?is)\b([^.!?]+[.!?])\s+\1\b")
_WHITESPACE_COLON_RE = re.compile(r"\s+:\s*")


def contains_blocked_text(value: str) -> bool:
    text = (value or "").lower()
    return any(phrase in text for phrase in _BLOCKED_PHRASES)


def sanitize_text(value: str) -> str:
    if not isinstance(value, str):
        return value

    text = unicodedata.normalize("NFKC", value)
    for bad, good in _MOJIBAKE_REPLACEMENTS.items():
        text = text.replace(bad, good)

    text = _CONTROL_RE.sub("", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = _DEBUG_LINE_RE.sub("", text)
    text = _REPEATED_LABEL_RE.sub(lambda m: f"{m.group(1)}: ", text)
    for phrase in _BLOCKED_PHRASES:
        text = re.sub(re.escape(phrase), "", text, flags=re.IGNORECASE)
    text = _WHITESPACE_COLON_RE.sub(": ", text)
    while True:
        deduped = _DUPLICATE_SENTENCE_RE.sub(r"\1", text)
        if deduped == text:
            break
        text = deduped
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"(?i)\b(Expected outcome|Finding|Why it matters|Business impact|Recommended action):\s*$", "", text)
    return text.strip(" .\n\t")


def sanitize_for_pdf(value: Any) -> Any:
    if isinstance(value, str):
        return sanitize_text(value)
    if isinstance(value, list):
        return [sanitize_for_pdf(item) for item in value if sanitize_for_pdf(item) not in (None, "", [], {})]
    if isinstance(value, dict):
        cleaned = {key: sanitize_for_pdf(item) for key, item in value.items()}
        return {key: item for key, item in cleaned.items() if item not in (None, "", [], {})}
    return value
