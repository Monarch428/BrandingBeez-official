# -*- coding: utf-8 -*-
from pydantic import BaseModel, Field, BeforeValidator
from typing import Annotated, List, Optional, Any, Dict

def _coerce_safe_int(value: Any) -> int:
    if value in (None, "", "null", "None"):
        return 0
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        cleaned = value.strip().replace(",", "")
        if not cleaned:
            return 0
        try:
            return int(float(cleaned))
        except Exception:
            return 0
    return 0


def _coerce_safe_float(value: Any) -> float:
    if value in (None, "", "null", "None"):
        return 0.0
    if isinstance(value, bool):
        return float(int(value))
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        cleaned = value.strip().replace(",", "")
        if not cleaned:
            return 0.0
        try:
            return float(cleaned)
        except Exception:
            return 0.0
    return 0.0


SafeInt = Annotated[int, BeforeValidator(_coerce_safe_int)]
SafeFloat = Annotated[float, BeforeValidator(_coerce_safe_float)]

class SubScores(BaseModel):
    website: SafeInt = 0
    seo: SafeInt = 0
    reputation: SafeInt = 0
    leadGen: SafeInt = 0
    services: SafeInt = 0
    costEfficiency: SafeInt = 0

class ReportMetadata(BaseModel):
    reportId: str = ""
    companyName: str = ""
    website: str = ""
    analysisDate: str = ""
    overallScore: SafeInt = 0
    subScores: SubScores = Field(default_factory=SubScores)

class QuickWin(BaseModel):
    title: str = ""
    impact: Optional[str] = None
    time: Optional[str] = None
    cost: Optional[str] = None
    details: Optional[str] = None

class ExecutiveSummary(BaseModel):
    biggestOpportunity: Optional[str] = None
    # Mentor-style narrative snapshot generated during final synthesis.
    # Optional to remain schema-safe when LLM is skipped.
    mentorSnapshot: Optional[str] = None
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    quickWins: List[QuickWin] = Field(default_factory=list)
    highPriorityRecommendations: List[str] = Field(default_factory=list)

class SpeedOpportunity(BaseModel):
    title: str = ""
    description: Optional[str] = None

class SpeedStrategy(BaseModel):
    performanceScore: SafeInt = 0
    seoScore: SafeInt = 0
    lcpMs: SafeInt = 0
    cls: SafeFloat = 0.0
    tbtMs: SafeInt = 0
    opportunities: List[SpeedOpportunity] = Field(default_factory=list)

class WebsiteSpeedTest(BaseModel):
    mobile: Optional[SpeedStrategy] = None
    desktop: Optional[SpeedStrategy] = None

class TechnicalSEO(BaseModel):
    score: SafeInt = 0
    strengths: List[str] = Field(default_factory=list)
    issues: List[str] = Field(default_factory=list)
    pageSpeed: Optional[WebsiteSpeedTest] = None

class ContentQuality(BaseModel):
    score: SafeInt = 0
    strengths: List[str] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

class UXConversion(BaseModel):
    score: SafeInt = 0
    highlights: List[str] = Field(default_factory=list)
    issues: List[str] = Field(default_factory=list)
    estimatedUplift: Optional[str] = None
    # Optional richer UI/UX signals (from the lightweight uiux analyzer)
    details: Dict[str, Any] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)

class WebsiteDigitalPresence(BaseModel):
    technicalSEO: TechnicalSEO = Field(default_factory=TechnicalSEO)
    mentorNotes: Optional[str] = None
    contentQuality: ContentQuality = Field(default_factory=ContentQuality)
    uxConversion: UXConversion = Field(default_factory=UXConversion)
    contentGaps: List[str] = Field(default_factory=list)

class DomainAuthorityBenchmark(BaseModel):
    you: Optional[Any] = None
    competitorA: Optional[Any] = None
    competitorB: Optional[Any] = None
    competitorC: Optional[Any] = None
    industryAvg: Optional[Any] = None

class DomainAuthority(BaseModel):
    score: SafeInt = 0
    benchmark: Optional[DomainAuthorityBenchmark] = None
    notes: Optional[str] = None

class Backlinks(BaseModel):
    totalBacklinks: Optional[Any] = None
    referringDomains: Optional[Any] = None
    linkQualityScore: Optional[Any] = None
    notes: Optional[str] = None

class SeoVisibility(BaseModel):
    domainAuthority: DomainAuthority = Field(default_factory=DomainAuthority)
    backlinks: Backlinks = Field(default_factory=Backlinks)

class SentimentThemes(BaseModel):
    positive: List[str] = Field(default_factory=list)
    negative: List[str] = Field(default_factory=list)
    responseRate: Optional[str] = None
    averageResponseTime: Optional[str] = None

class Reputation(BaseModel):
    reviewScore: Optional[Any] = None
    mentorNotes: Optional[str] = None
    totalReviews: Optional[Any] = None
    industryStandardRange: Optional[Any] = None
    yourGap: Optional[Any] = None
    summaryTable: List[Dict[str, Any]] = Field(default_factory=list)
    sentimentThemes: SentimentThemes = Field(default_factory=SentimentThemes)

class ServiceItem(BaseModel):
    name: str = ""
    startingPrice: Optional[str] = None
    targetMarket: Optional[str] = None
    description: Optional[str] = None

class ServiceGapRow(BaseModel):
    service: str = ""
    reason: Optional[str] = None
    impact: Optional[str] = None
    youOffer: Optional[str] = None
    competitorA: Optional[str] = None
    competitorB: Optional[str] = None
    marketDemand: Optional[str] = None

class HighValueIndustry(BaseModel):
    industry: str = ""
    whyHighValue: Optional[str] = None
    avgDealSize: Optional[str] = None
    readiness: Optional[str] = None

class IndustriesServed(BaseModel):
    current: List[str] = Field(default_factory=list)
    concentrationNote: Optional[str] = None
    highValueIndustries: List[HighValueIndustry] = Field(default_factory=list)

class Positioning(BaseModel):
    currentStatement: Optional[str] = None
    competitorComparison: Optional[str] = None
    differentiation: Optional[str] = None

class ServicesPositioning(BaseModel):
    services: List[ServiceItem] = Field(default_factory=list)
    mentorNotes: Optional[str] = None
    serviceGaps: List[ServiceGapRow] = Field(default_factory=list)
    industriesServed: IndustriesServed = Field(default_factory=IndustriesServed)
    positioning: Positioning = Field(default_factory=Positioning)

class LeadChannel(BaseModel):
    channel: str = ""
    leadsPerMonth: Optional[str] = None
    quality: Optional[str] = None
    status: Optional[str] = None

class MissingChannel(BaseModel):
    channel: str = ""
    estimatedLeads: Optional[str] = None
    setupTime: Optional[str] = None
    monthlyCost: Optional[str] = None
    priority: Optional[str] = None

class LeadMagnet(BaseModel):
    title: str = ""
    funnelStage: Optional[str] = None
    description: Optional[str] = None
    estimatedConversionRate: Optional[str] = None

class LeadGeneration(BaseModel):
    channels: List[LeadChannel] = Field(default_factory=list)
    mentorNotes: Optional[str] = None
    missingHighROIChannels: List[MissingChannel] = Field(default_factory=list)
    leadMagnets: List[LeadMagnet] = Field(default_factory=list)

class CompetitiveAnalysis(BaseModel):
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    mentorNotes: Optional[str] = None
    positioningMatrix: List[Dict[str, Any]] = Field(default_factory=list)
    notes: Optional[str] = None


# -------------------------
# Market Demand (Data-backed)
# -------------------------

class MarketDemandKeyword(BaseModel):
    keyword: str = ""
    searchVolume: Optional[int] = None
    cpc: Optional[float] = None
    competition: Optional[float] = None  # 0..1 (Google Ads competition)
    monthlySearches: List[Dict[str, Any]] = Field(default_factory=list)
    serpTopDomains: List[str] = Field(default_factory=list)
    competitionIntensity: Optional[int] = None  # 0..10 based on unique domains in top 10
    demandScore: Optional[int] = None  # 0..100
    label: Optional[str] = None  # High/Medium/Low
    notes: Optional[str] = None


class MarketDemandSummary(BaseModel):
    averageDemandScore: SafeInt = 0
    totalKeywordsAnalyzed: SafeInt = 0
    topOpportunities: List[str] = Field(default_factory=list)
    observations: List[str] = Field(default_factory=list)


class MarketDemand(BaseModel):
    location: Optional[str] = None
    locationCode: Optional[int] = None
    languageCode: Optional[str] = None
    services: List[str] = Field(default_factory=list)
    keywords: List[MarketDemandKeyword] = Field(default_factory=list)
    summary: MarketDemandSummary = Field(default_factory=MarketDemandSummary)
    dataSources: List[Dict[str, Any]] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)


# -------------------------
# Currency / Money primitives (for Sections 8–10)
# -------------------------

class CurrencyMeta(BaseModel):
    """ISO-4217 currency metadata used for formatting monetary values in the PDF."""
    code: str = Field(..., min_length=3, max_length=3, description="ISO 4217 currency code, e.g., INR, USD, GBP, EUR")
    symbol: Optional[str] = Field(None, description="Currency symbol, e.g., ₹, $, £, €")
    name: Optional[str] = None
    countryCode: Optional[str] = Field(None, description="ISO 3166-1 alpha-2 country code, e.g., IN, US, GB, DE")

class MoneyRange(BaseModel):
    """A numeric min/max range with explicit currency and period."""
    min: Optional[float] = None
    max: Optional[float] = None
    currency: Optional[str] = Field(None, description="ISO 4217 currency code")
    period: Optional[str] = Field(None, description="e.g., 'month', 'quarter', 'year', 'one-time'")
    note: Optional[str] = None

    class Config:
        extra = "allow"

class CostOpportunityEstimate(BaseModel):
    """Flexible opportunity row for Section 8. Allows legacy keys via extra='allow'."""
    title: Optional[str] = None
    description: Optional[str] = None
    estimatedSavings: Optional[MoneyRange] = None
    estimatedCost: Optional[MoneyRange] = None
    confidence: Optional[str] = None

    class Config:
        extra = "allow"

class ScenarioEstimate(BaseModel):
    """Scenario row used across Sections 8–10."""
    name: Optional[str] = Field(None, description="Conservative | Base | Aggressive")
    summary: Optional[str] = None
    estimatedSavings: Optional[MoneyRange] = None
    estimatedCost: Optional[MoneyRange] = None
    estimatedRevenue: Optional[MoneyRange] = None
    estimatedProfit: Optional[MoneyRange] = None
    notes: Optional[str] = None

    class Config:
        extra = "allow"

class TargetMarketSegment(BaseModel):
    """Segment row for Section 9."""
    segment: Optional[str] = None
    marketCountry: Optional[str] = Field(None, description="Country name or ISO code")
    currency: Optional[str] = Field(None, description="ISO 4217 currency code for this segment/market")
    expectedBudget: Optional[MoneyRange] = None
    notes: Optional[str] = None

    class Config:
        extra = "allow"

class FinancialImpactRow(BaseModel):
    """Row for Section 10 revenue/profit tables."""
    metric: Optional[str] = None
    value: Optional[str] = None
    amount: Optional[MoneyRange] = None

    class Config:
        extra = "allow"

class CostOptimization(BaseModel):
    notes: Optional[str] = None
    mentorNotes: Optional[str] = None
    currencyContext: Optional[Dict[str, Any]] = None
    opportunities: List[CostOpportunityEstimate] = Field(default_factory=list)
    # Estimation Mode (optional)
    estimationDisclaimer: Optional[str] = None
    confidenceScore: SafeInt = 0  # 0-100
    scenarios: List[ScenarioEstimate] = Field(default_factory=list)

class TargetMarket(BaseModel):
    notes: Optional[str] = None
    mentorNotes: Optional[str] = None
    currencyContext: Optional[Dict[str, Any]] = None
    segments: List[TargetMarketSegment] = Field(default_factory=list)
    estimationDisclaimer: Optional[str] = None
    confidenceScore: SafeInt = 0
    scenarios: List[ScenarioEstimate] = Field(default_factory=list)

class FinancialImpact(BaseModel):
    notes: Optional[str] = None
    mentorNotes: Optional[str] = None
    revenueTable: List[FinancialImpactRow] = Field(default_factory=list)
    estimationDisclaimer: Optional[str] = None
    confidenceScore: SafeInt = 0
    scenarios: List[ScenarioEstimate] = Field(default_factory=list)

class ActionPlanWeek(BaseModel):
    weekRange: str = ""
    title: str = ""
    actions: List[str] = Field(default_factory=list)
    expectedOutcome: Optional[str] = None
    kpis: List[Dict[str, Any]] = Field(default_factory=list)

class CompetitiveAdvantages(BaseModel):
    advantages: List[str] = Field(default_factory=list)
    mentorNotes: Optional[str] = None
    notes: Optional[str] = None

class RiskItem(BaseModel):
    risk: str = ""
    severity: Optional[str] = None
    mitigation: Optional[str] = None

class RiskAssessment(BaseModel):
    risks: List[RiskItem] = Field(default_factory=list)
    mentorNotes: Optional[str] = None

class AppendixDataSource(BaseModel):
    source: str = ""
    use: Optional[str] = None
    confidence: Optional[str] = None

class DataGap(BaseModel):
    area: str = ""
    missing: List[str] = Field(default_factory=list)
    howToEnable: List[str] = Field(default_factory=list)

class Appendices(BaseModel):
    keywords: List[Dict[str, Any]] = Field(default_factory=list)
    dataSources: List[AppendixDataSource] = Field(default_factory=list)
    dataGaps: List[DataGap] = Field(default_factory=list)
    # Evidence helps the PDF feel "premium" and trustworthy
    pagesCrawled: List[str] = Field(default_factory=list)
    evidence: Optional[Dict[str, Any]] = None

class BusinessGrowthReport(BaseModel):
    reportMetadata: ReportMetadata = Field(default_factory=ReportMetadata)
    executiveSummary: ExecutiveSummary = Field(default_factory=ExecutiveSummary)
    websiteDigitalPresence: WebsiteDigitalPresence = Field(default_factory=WebsiteDigitalPresence)
    seoVisibility: SeoVisibility = Field(default_factory=SeoVisibility)
    reputation: Reputation = Field(default_factory=Reputation)
    servicesPositioning: ServicesPositioning = Field(default_factory=ServicesPositioning)
    leadGeneration: LeadGeneration = Field(default_factory=LeadGeneration)
    competitiveAnalysis: CompetitiveAnalysis = Field(default_factory=CompetitiveAnalysis)
    marketDemand: MarketDemand = Field(default_factory=MarketDemand)
    costOptimization: CostOptimization = Field(default_factory=CostOptimization)
    targetMarket: TargetMarket = Field(default_factory=TargetMarket)
    financialImpact: FinancialImpact = Field(default_factory=FinancialImpact)
    actionPlan90Days: List[ActionPlanWeek] = Field(default_factory=list)
    competitiveAdvantages: CompetitiveAdvantages = Field(default_factory=CompetitiveAdvantages)
    riskAssessment: RiskAssessment = Field(default_factory=RiskAssessment)
    appendices: Appendices = Field(default_factory=Appendices)
