# -*- coding: utf-8 -*-
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class SubScores(BaseModel):
    website: Optional[int] = None
    seo: Optional[int] = None
    reputation: Optional[int] = None
    leadGen: Optional[int] = None
    services: Optional[int] = None
    costEfficiency: Optional[int] = None

class ReportMetadata(BaseModel):
    reportId: str
    companyName: str
    website: str
    analysisDate: str
    overallScore: int
    subScores: SubScores = Field(default_factory=SubScores)

class QuickWin(BaseModel):
    title: str
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
    title: str
    description: Optional[str] = None

class SpeedStrategy(BaseModel):
    performanceScore: Optional[int] = None
    seoScore: Optional[int] = None
    lcpMs: Optional[int] = None
    cls: Optional[float] = None
    tbtMs: Optional[int] = None
    opportunities: List[SpeedOpportunity] = Field(default_factory=list)

class WebsiteSpeedTest(BaseModel):
    mobile: Optional[SpeedStrategy] = None
    desktop: Optional[SpeedStrategy] = None

class TechnicalSEO(BaseModel):
    score: int = 0
    strengths: List[str] = Field(default_factory=list)
    issues: List[str] = Field(default_factory=list)
    pageSpeed: Optional[WebsiteSpeedTest] = None

class ContentQuality(BaseModel):
    score: int = 0
    strengths: List[str] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

class UXConversion(BaseModel):
    score: int = 0
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
    score: int = 0
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
    name: str
    startingPrice: Optional[str] = None
    targetMarket: Optional[str] = None
    description: Optional[str] = None

class ServiceGapRow(BaseModel):
    service: str
    youOffer: Optional[str] = None
    competitorA: Optional[str] = None
    competitorB: Optional[str] = None
    marketDemand: Optional[str] = None

class HighValueIndustry(BaseModel):
    industry: str
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
    channel: str
    leadsPerMonth: Optional[str] = None
    quality: Optional[str] = None
    status: Optional[str] = None

class MissingChannel(BaseModel):
    channel: str
    estimatedLeads: Optional[str] = None
    setupTime: Optional[str] = None
    monthlyCost: Optional[str] = None
    priority: Optional[str] = None

class LeadMagnet(BaseModel):
    title: str
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
    keyword: str
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
    averageDemandScore: Optional[int] = None
    totalKeywordsAnalyzed: Optional[int] = None
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

class CostOptimization(BaseModel):
    notes: Optional[str] = None
    mentorNotes: Optional[str] = None
    opportunities: List[Dict[str, Any]] = Field(default_factory=list)
    # Estimation Mode (optional)
    estimationDisclaimer: Optional[str] = None
    confidenceScore: Optional[int] = None  # 0-100
    scenarios: List[Dict[str, Any]] = Field(default_factory=list)

class TargetMarket(BaseModel):
    notes: Optional[str] = None
    mentorNotes: Optional[str] = None
    segments: List[Dict[str, Any]] = Field(default_factory=list)
    estimationDisclaimer: Optional[str] = None
    confidenceScore: Optional[int] = None
    scenarios: List[Dict[str, Any]] = Field(default_factory=list)

class FinancialImpact(BaseModel):
    notes: Optional[str] = None
    mentorNotes: Optional[str] = None
    revenueTable: List[Dict[str, Any]] = Field(default_factory=list)
    estimationDisclaimer: Optional[str] = None
    confidenceScore: Optional[int] = None
    scenarios: List[Dict[str, Any]] = Field(default_factory=list)

class ActionPlanWeek(BaseModel):
    weekRange: str
    title: str
    actions: List[str] = Field(default_factory=list)
    expectedOutcome: Optional[str] = None
    kpis: List[Dict[str, Any]] = Field(default_factory=list)

class CompetitiveAdvantages(BaseModel):
    advantages: List[str] = Field(default_factory=list)
    mentorNotes: Optional[str] = None
    notes: Optional[str] = None

class RiskItem(BaseModel):
    risk: str
    severity: Optional[str] = None
    mitigation: Optional[str] = None

class RiskAssessment(BaseModel):
    risks: List[RiskItem] = Field(default_factory=list)
    mentorNotes: Optional[str] = None

class AppendixDataSource(BaseModel):
    source: str
    use: Optional[str] = None
    confidence: Optional[str] = None

class DataGap(BaseModel):
    area: str
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
    reportMetadata: ReportMetadata
    executiveSummary: ExecutiveSummary
    websiteDigitalPresence: WebsiteDigitalPresence
    seoVisibility: SeoVisibility
    reputation: Reputation
    servicesPositioning: ServicesPositioning
    leadGeneration: LeadGeneration
    competitiveAnalysis: CompetitiveAnalysis
    marketDemand: MarketDemand = Field(default_factory=MarketDemand)
    costOptimization: CostOptimization
    targetMarket: TargetMarket
    financialImpact: FinancialImpact
    actionPlan90Days: List[ActionPlanWeek] = Field(default_factory=list)
    competitiveAdvantages: CompetitiveAdvantages
    riskAssessment: RiskAssessment
    appendices: Appendices
