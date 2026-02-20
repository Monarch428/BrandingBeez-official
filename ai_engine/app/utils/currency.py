from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class CurrencyInfo:
    code: str
    symbol: str
    name: str


# Minimal, deterministic mapping (no web lookups; avoids hallucinated FX rates)
_CURRENCY_BY_REGION: Dict[str, CurrencyInfo] = {
    "IN": CurrencyInfo(code="INR", symbol="₹", name="Indian Rupee"),
    "INDIA": CurrencyInfo(code="INR", symbol="₹", name="Indian Rupee"),
    "UK": CurrencyInfo(code="GBP", symbol="£", name="British Pound"),
    "UNITED KINGDOM": CurrencyInfo(code="GBP", symbol="£", name="British Pound"),
    "ENGLAND": CurrencyInfo(code="GBP", symbol="£", name="British Pound"),
    "SCOTLAND": CurrencyInfo(code="GBP", symbol="£", name="British Pound"),
    "WALES": CurrencyInfo(code="GBP", symbol="£", name="British Pound"),
    "US": CurrencyInfo(code="USD", symbol="$", name="US Dollar"),
    "USA": CurrencyInfo(code="USD", symbol="$", name="US Dollar"),
    "UNITED STATES": CurrencyInfo(code="USD", symbol="$", name="US Dollar"),
    "U.S.": CurrencyInfo(code="USD", symbol="$", name="US Dollar"),
}


def infer_currency_from_text(text: Optional[str]) -> CurrencyInfo:
    """Infer currency from a free-text location/market string.

    Conservative mapping: only a few common regions.
    If nothing matches, default to USD.
    """
    if not text:
        return _CURRENCY_BY_REGION["US"]

    t = str(text).strip().upper()
    if not t:
        return _CURRENCY_BY_REGION["US"]

    for key, info in _CURRENCY_BY_REGION.items():
        if key in t:
            return info

    # Common city hints
    if any(k in t for k in ("LONDON", "MANCHESTER", "BIRMINGHAM", "GLASGOW")):
        return _CURRENCY_BY_REGION["UK"]
    if any(k in t for k in ("NEW YORK", "SAN FRANCISCO", "LOS ANGELES", "AUSTIN", "CHICAGO")):
        return _CURRENCY_BY_REGION["US"]
    if any(k in t for k in ("CHENNAI", "BENGALURU", "BANGALORE", "MUMBAI", "DELHI", "HYDERABAD")):
        return _CURRENCY_BY_REGION["IN"]

    return _CURRENCY_BY_REGION["US"]


def infer_currencies_from_market_text(text: Optional[str]) -> List[CurrencyInfo]:
    """Return a unique list of currencies implied by a market/target string."""
    if not text:
        return []

    t = str(text).upper()
    out: List[CurrencyInfo] = []
    seen: set[str] = set()

    def _add(info: CurrencyInfo) -> None:
        if info.code not in seen:
            out.append(info)
            seen.add(info.code)

    if re.search(r"\b(U\.?S\.?A?|UNITED STATES|AMERICA|US)\b", t):
        _add(_CURRENCY_BY_REGION["US"])
    if re.search(r"\b(UK|UNITED KINGDOM|BRITAIN|ENGLAND|LONDON)\b", t):
        _add(_CURRENCY_BY_REGION["UK"])
    if re.search(r"\b(INDIA|IN|CHENNAI|BENGALURU|BANGALORE|MUMBAI|DELHI)\b", t):
        _add(_CURRENCY_BY_REGION["IN"])
    return out


def build_currency_guidance(company_location: Optional[str], target_market: Optional[str]) -> Dict[str, object]:
    company = infer_currency_from_text(company_location)
    targets = infer_currencies_from_market_text(target_market)
    return {
        "companyCurrency": {"code": company.code, "symbol": company.symbol, "name": company.name},
        "targetCurrencies": [{"code": c.code, "symbol": c.symbol, "name": c.name} for c in targets],
        "rules": [
            "Do NOT convert amounts using exchange rates.",
            "Format currency based on what the amount refers to.",
            "Company/home operations → companyCurrency.",
            "Market/segment-specific amount (US/UK/India) → that market currency.",
            "If unclear → default to companyCurrency.",
        ],
        "examples": [
            "Company in India → operational spend shown as ₹…",
            "UK agencies opportunity → budget shown as £…",
            "US market opportunity → budget shown as $…",
        ],
    }
