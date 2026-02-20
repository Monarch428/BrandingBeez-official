
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

@dataclass
class CrawlIntentHints:
    business_type: str
    offering_url_hints: List[str]
    booking_url_hints: List[str]
    location_url_hints: List[str]
    notes: str = ""

def _norm(s: Optional[str]) -> str:
    return (s or "").strip().lower()

def infer_business_type(primary_service_industry: Optional[str], homepage_text: Optional[str] = None) -> str:
    """Infer a coarse business type to guide crawling.

    We intentionally keep this *rule-based* to avoid JSON parsing failures and
    prevent LLM from becoming a single point of failure.
    """
    psi = _norm(primary_service_industry)
    home = _norm(homepage_text)

    # Bakery / Cafe / Restaurant
    if any(k in psi for k in ["bakery", "cafe", "coffee", "restaurant", "food", "pizza", "bar", "catering"]) or        any(k in home for k in ["menu", "order online", "catering", "reserve a table", "book a table", "hours", "our menu"]):
        return "local_food"

    # Medical / Dental / Ortho / Clinic
    if any(k in psi for k in ["orthodont", "dental", "dentist", "clinic", "hospital", "doctor", "medical", "dermat", "physio", "therapy"]) or        any(k in home for k in ["book an appointment", "patient", "treatments", "insurance", "schedule a visit"]):
        return "local_health"

    # Salon / Spa / Beauty
    if any(k in psi for k in ["salon", "spa", "beauty", "barber", "hair", "nail", "makeup"]) or        any(k in home for k in ["book now", "services & pricing", "stylists"]):
        return "local_beauty"

    # Ecommerce / Shop
    if any(k in psi for k in ["ecommerce", "shop", "store", "retail"]) or        any(k in home for k in ["add to cart", "cart", "checkout", "collections", "shipping", "returns"]):
        return "ecommerce"

    # SaaS / Software
    if any(k in psi for k in ["saas", "software", "app", "platform", "cloud", "automation"]) or        any(k in home for k in ["pricing", "book a demo", "request a demo", "features", "integrations"]):
        return "saas"

    # Default: agency/professional services
    return "agency_services"

def get_intent_hints(business_type: str) -> CrawlIntentHints:
    bt = (business_type or "agency_services").strip().lower()

    if bt == "local_food":
        return CrawlIntentHints(
            business_type=bt,
            offering_url_hints=[
                "menu", "menus", "order", "order-online", "online-order", "takeout", "delivery",
                "products", "product", "cakes", "pastries", "bread", "shop", "store", "catering"
            ],
            booking_url_hints=["order", "reservation", "reserve", "book", "table", "pickup"],
            location_url_hints=["location", "locations", "hours", "visit", "find-us", "contact"],
            notes="Local food business: prioritize menu/products, ordering, hours/location; services page may not exist.",
        )

    if bt == "local_health":
        return CrawlIntentHints(
            business_type=bt,
            offering_url_hints=[
                "services", "treatments", "treatment", "procedures", "specialties", "orthodont",
                "braces", "invisalign", "patients"
            ],
            booking_url_hints=["appointment", "book", "schedule", "request", "new-patient", "contact"],
            location_url_hints=["location", "locations", "hours", "contact", "visit", "find-us"],
            notes="Healthcare: prioritize treatments/procedures and appointment booking pages.",
        )

    if bt == "local_beauty":
        return CrawlIntentHints(
            business_type=bt,
            offering_url_hints=["services", "pricing", "treatments", "packages", "hair", "nails", "spa"],
            booking_url_hints=["book", "booking", "appointment", "schedule", "reserve"],
            location_url_hints=["location", "hours", "contact", "visit", "find-us"],
            notes="Beauty: prioritize service menu/pricing and booking.",
        )

    if bt == "ecommerce":
        return CrawlIntentHints(
            business_type=bt,
            offering_url_hints=["shop", "store", "products", "product", "collections", "category", "catalog"],
            booking_url_hints=["cart", "checkout", "order", "shipping", "returns"],
            location_url_hints=["contact", "about", "shipping", "returns"],
            notes="Ecommerce: prioritize catalog/collections/products and checkout policy pages.",
        )

    if bt == "saas":
        return CrawlIntentHints(
            business_type=bt,
            offering_url_hints=["features", "solutions", "product", "platform", "use-cases", "integrations"],
            booking_url_hints=["pricing", "demo", "book", "contact", "get-started"],
            location_url_hints=["contact", "about", "security", "docs"],
            notes="SaaS: prioritize features/solutions, pricing and demo/contact pages.",
        )

    # agency_services (default)
    return CrawlIntentHints(
        business_type=bt,
        offering_url_hints=["services", "service", "solutions", "capabilities", "what-we-do", "offerings"],
        booking_url_hints=["contact", "get-started", "quote", "pricing", "book"],
        location_url_hints=["contact", "about"],
        notes="Agency: prioritize services/solutions pages and case studies/portfolio when present.",
    )
