from __future__ import annotations

import re
from typing import Any, Dict


def _clean_number(value: Any) -> float:
    if value is None or value == "":
        return 0.0

    if isinstance(value, bool):
        return 0.0

    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip().lower()
    if not text:
        return 0.0

    text = text.replace(",", "")
    text = text.replace("₹", "").replace("$", "").replace("£", "").replace("€", "")
    text = text.replace("rs.", "").replace("rs", "").replace("inr", "")
    text = text.replace("usd", "").replace("gbp", "").replace("eur", "")

    multiplier = 1.0

    if "lakh" in text or "lac" in text:
        multiplier = 100000.0
    elif "crore" in text or re.search(r"\bcr\b", text):
        multiplier = 10000000.0
    elif re.search(r"\d\s*k\b", text):
        multiplier = 1000.0
    elif re.search(r"\d\s*m\b", text):
        multiplier = 1000000.0

    match = re.search(r"-?\d+(?:\.\d+)?", text)
    if not match:
        return 0.0

    try:
        return float(match.group(0)) * multiplier
    except Exception:
        return 0.0


def normalize_money(value: Any) -> float:
    """
    Normalize money fields only.

    Examples:
    50000 -> 50000
    "50,000" -> 50000
    "1.5 lakh" -> 150000
    1.5 -> 150000

    Do not use this for monthlyLeads, traffic, teamSize, or any count field.
    """

    amount = _clean_number(value)

    # Historical frontend/backend payloads sometimes send money fields
    # as lakh-scaled values, for example 1.5, 5.0, 25.5.
    if 0 < amount < 100:
        return amount * 100000.0

    return amount


def normalize_count(value: Any) -> float:
    """
    Normalize count fields like monthlyLeads, traffic, and teamSize.

    Important:
    monthlyLeads=60 must stay 60, not become 60 lakh.
    """

    return _clean_number(value)


def normalize_rate(value: Any) -> float:
    """
    Normalize rate fields.

    Examples:
    0.15 -> 0.15
    15 -> 0.15
    "15%" -> 0.15
    """

    rate = _clean_number(value)

    if rate > 1:
        rate = rate / 100.0

    return max(0.0, min(rate, 1.0))


def compute_monthly_revenue(financials: Dict[str, Any]) -> int:
    """
    Source-of-truth monthly revenue calculation.

    Formula:
    monthlyRevenue = monthlyLeads * avgDealValue * closeRate
    """

    if not isinstance(financials, dict):
        return 0

    leads = normalize_count(
        financials.get("monthlyLeads")
        or financials.get("qualifiedLeads")
        or financials.get("leadsPerMonth")
        or 0
    )

    avg_deal = normalize_money(
        financials.get("avgDealValue")
        or financials.get("avgDealSize")
        or financials.get("averageDealValue")
        or 0
    )

    close_rate = normalize_rate(
        financials.get("closeRate")
        or financials.get("conversionRate")
        or 0
    )

    revenue = leads * avg_deal * close_rate

    if revenue < 1000:
        return 0

    return int(round(revenue))


def compute_monthly_cost(financials: Dict[str, Any]) -> int:
    if not isinstance(financials, dict):
        return 0

    payroll = normalize_money(financials.get("monthlyPayrollCost") or 0)
    tools = normalize_money(financials.get("monthlyToolsCost") or 0)
    overhead = normalize_money(financials.get("monthlyOverheadCost") or 0)
    ad_spend = normalize_money(
        financials.get("monthlyAdSpend")
        or financials.get("monthlyMarketingCost")
        or 0
    )

    total = payroll + tools + overhead + ad_spend

    if total < 1000:
        return 0

    return int(round(total))


def repair_financial_baseline(financials: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns a repaired financial object with deterministic revenue and cost fields.

    Use this before building Section 8, Section 9, and Section 10.
    LLM output and stale DB values should not be treated as source of truth.
    """

    repaired = dict(financials or {})

    monthly_revenue = compute_monthly_revenue(repaired)
    monthly_cost = compute_monthly_cost(repaired)

    if monthly_revenue >= 1000:
        repaired["monthlyRevenue"] = monthly_revenue
        repaired["currentMonthlyRevenue"] = monthly_revenue

    if monthly_cost >= 1000:
        repaired["monthlyCost"] = monthly_cost
        repaired["currentMonthlyCost"] = monthly_cost

    return repaired


def money_number_from_text(value: Any) -> float | None:
    if value is None:
        return None

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)

    text = str(value).strip().lower().replace(",", "")
    if not text:
        return None

    match = re.search(r"(-?\d+(?:\.\d+)?)\s*([kmb])?", text)
    if not match:
        return None

    try:
        amount = float(match.group(1))
    except Exception:
        return None

    suffix = match.group(2)

    if suffix == "k":
        amount *= 1000
    elif suffix == "m":
        amount *= 1000000
    elif suffix == "b":
        amount *= 1000000000

    return amount


def format_money(value: Any, symbol: str = "₹") -> str:
    amount = normalize_money(value)

    if amount >= 10000000:
        return f"{symbol}{amount / 10000000:.1f}Cr".replace(".0Cr", "Cr")

    if amount >= 100000:
        return f"{symbol}{amount / 100000:.1f}L".replace(".0L", "L")

    if amount >= 1000:
        return f"{symbol}{amount / 1000:.1f}K".replace(".0K", "K")

    return f"{symbol}{int(round(amount))}"
