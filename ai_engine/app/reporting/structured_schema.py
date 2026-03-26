from __future__ import annotations

from typing import Any, Dict, List, Optional, Literal

from pydantic import BaseModel, Field


Severity = Literal["low", "medium", "high"]
Scope = Literal["homepage", "sitewide", "off_site", "competitive", "financial"]


class IssueInsight(BaseModel):
    finding: str
    why_it_matters: str
    business_impact: str
    recommended_action: str
    expected_outcome: str
    evidence: List[str] = Field(default_factory=list)
    severity: Severity = "medium"
    scope: Scope = "sitewide"


class StrategicAction(BaseModel):
    title: str
    rationale: str
    expected_outcome: str
    timeframe: str
    owner: Optional[str] = None


class ExecutiveSummarySection(BaseModel):
    overview: str
    biggest_opportunity: str
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    contradictions_resolved: List[str] = Field(default_factory=list)


class WebsiteAnalysisSection(BaseModel):
    homepage_findings: List[IssueInsight] = Field(default_factory=list)
    sitewide_findings: List[IssueInsight] = Field(default_factory=list)
    technical_seo: List[IssueInsight] = Field(default_factory=list)
    content_quality: List[IssueInsight] = Field(default_factory=list)
    ux_conversion: List[IssueInsight] = Field(default_factory=list)


class SEOAnalysisSection(BaseModel):
    authority_summary: str
    backlink_quality: str
    backlink_interpretation: Dict[str, Any] = Field(default_factory=dict)
    keyword_visibility: str
    competitor_comparison: List[Dict[str, Any]] = Field(default_factory=list)
    opportunities: List[IssueInsight] = Field(default_factory=list)
    estimated_traffic_potential: Dict[str, Any] = Field(default_factory=dict)
    estimated_lead_potential: Dict[str, Any] = Field(default_factory=dict)


class ReputationAnalysisSection(BaseModel):
    summary: str
    reviews: List[Dict[str, Any]] = Field(default_factory=list)
    industry_benchmarks: List[str] = Field(default_factory=list)
    trust_signals: List[str] = Field(default_factory=list)
    issues: List[IssueInsight] = Field(default_factory=list)


class ServiceOfferingsSection(BaseModel):
    summary: str
    services: List[Dict[str, Any]] = Field(default_factory=list)
    differentiation: str
    market_positioning: str
    issues: List[IssueInsight] = Field(default_factory=list)


class LeadGenerationSection(BaseModel):
    summary: str
    funnel_analysis: List[Dict[str, Any]] = Field(default_factory=list)
    cta_mapping: List[Dict[str, Any]] = Field(default_factory=list)
    current_lead_sources: List[Dict[str, Any]] = Field(default_factory=list)
    missing_channels: List[Dict[str, Any]] = Field(default_factory=list)
    lead_magnets: List[Dict[str, Any]] = Field(default_factory=list)
    conversion_gaps: List[Dict[str, Any]] = Field(default_factory=list)
    channel_strategy: List[Dict[str, Any]] = Field(default_factory=list)
    issues: List[IssueInsight] = Field(default_factory=list)


class CompetitiveAnalysisSection(BaseModel):
    summary: str
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    issues: List[IssueInsight] = Field(default_factory=list)


class CostOptimizationSection(BaseModel):
    summary: str
    tool_stack: List[Dict[str, Any]] = Field(default_factory=list)
    automation_opportunities: List[Dict[str, Any]] = Field(default_factory=list)
    pricing_positioning: List[Dict[str, Any]] = Field(default_factory=list)
    issues: List[IssueInsight] = Field(default_factory=list)
 

class TargetMarketSection(BaseModel):
    summary: str
    client_profile: List[str] = Field(default_factory=list)
    segments: List[Dict[str, Any]] = Field(default_factory=list)
    issues: List[IssueInsight] = Field(default_factory=list)


class FinancialImpactSection(BaseModel):
    summary: str                                                                                                                                                                                                                                                                      
    revenue_opportunities: List[Dict[str, Any]] = Field(default_factory=list)
    cost_savings: List[Dict[str, Any]] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    issues: List[IssueInsight] = Field(default_factory=list)


class ActionPlanSection(BaseModel):
    days_1_30: List[StrategicAction] = Field(default_factory=list)
    days_31_60: List[StrategicAction] = Field(default_factory=list)
    days_61_90: List[StrategicAction] = Field(default_factory=list)


class CompetitiveAdvantageSection(BaseModel):
    summary: str
    advantages: List[Dict[str, Any]] = Field(default_factory=list)


class RiskAssessmentSection(BaseModel):
    summary: str
    risks: List[Dict[str, Any]] = Field(default_factory=list)


class AppendicesSection(BaseModel):
    keyword_opportunities: List[Dict[str, Any]] = Field(default_factory=list)
    review_request_templates: List[Dict[str, Any]] = Field(default_factory=list)
    case_study_template: Dict[str, Any] = Field(default_factory=dict)
    evidence_sources: List[Dict[str, Any]] = Field(default_factory=list)


class ProfessionalBusinessReport(BaseModel):
    executive_summary: ExecutiveSummarySection
    top_actions: List[StrategicAction] = Field(default_factory=list)
    website_analysis: WebsiteAnalysisSection
    seo_analysis: SEOAnalysisSection
    reputation_analysis: ReputationAnalysisSection
    service_offerings_analysis: ServiceOfferingsSection
    lead_gen_analysis: LeadGenerationSection
    competitive_analysis: CompetitiveAnalysisSection
    cost_optimization: CostOptimizationSection
    target_market_client_intelligence: TargetMarketSection
    financial_impact: FinancialImpactSection
    action_plan_90_days: ActionPlanSection
    competitive_advantages: CompetitiveAdvantageSection
    risk_assessment: RiskAssessmentSection
    appendices: AppendicesSection
