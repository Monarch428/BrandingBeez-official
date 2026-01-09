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

class WebsiteDigitalPresence(BaseModel):
    technicalSEO: TechnicalSEO = Field(default_factory=TechnicalSEO)
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
    missingHighROIChannels: List[MissingChannel] = Field(default_factory=list)
    leadMagnets: List[LeadMagnet] = Field(default_factory=list)

class CompetitiveAnalysis(BaseModel):
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    positioningMatrix: List[Dict[str, Any]] = Field(default_factory=list)
    notes: Optional[str] = None

class CostOptimization(BaseModel):
    notes: Optional[str] = None
    opportunities: List[Dict[str, Any]] = Field(default_factory=list)

class TargetMarket(BaseModel):
    notes: Optional[str] = None
    segments: List[Dict[str, Any]] = Field(default_factory=list)

class FinancialImpact(BaseModel):
    notes: Optional[str] = None
    revenueTable: List[Dict[str, Any]] = Field(default_factory=list)

class ActionPlanWeek(BaseModel):
    weekRange: str
    title: str
    actions: List[str] = Field(default_factory=list)
    expectedOutcome: Optional[str] = None
    kpis: List[Dict[str, Any]] = Field(default_factory=list)

class CompetitiveAdvantages(BaseModel):
    advantages: List[str] = Field(default_factory=list)
    notes: Optional[str] = None

class RiskItem(BaseModel):
    risk: str
    severity: Optional[str] = None
    mitigation: Optional[str] = None

class RiskAssessment(BaseModel):
    risks: List[RiskItem] = Field(default_factory=list)

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

class BusinessGrowthReport(BaseModel):
    reportMetadata: ReportMetadata
    executiveSummary: ExecutiveSummary
    websiteDigitalPresence: WebsiteDigitalPresence
    seoVisibility: SeoVisibility
    reputation: Reputation
    servicesPositioning: ServicesPositioning
    leadGeneration: LeadGeneration
    competitiveAnalysis: CompetitiveAnalysis
    costOptimization: CostOptimization
    targetMarket: TargetMarket
    financialImpact: FinancialImpact
    actionPlan90Days: List[ActionPlanWeek] = Field(default_factory=list)
    competitiveAdvantages: CompetitiveAdvantages
    riskAssessment: RiskAssessment
    appendices: Appendices
