from __future__ import annotations

from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, ConfigDict, Field


class LLMStageBaseModel(BaseModel):
    model_config = ConfigDict(extra="allow")


class LLMServiceGapItem(LLMStageBaseModel):
    service: Optional[str] = None
    reason: Optional[str] = None
    impact: Optional[str] = None
    gap: Optional[str] = None
    title: Optional[str] = None
    name: Optional[str] = None
    serviceName: Optional[str] = None
    whyItMatters: Optional[str] = None
    businessImpact: Optional[str] = None
    expectedOutcome: Optional[str] = None


class LLMCompetitiveAdvantageItem(LLMStageBaseModel):
    advantage: Optional[str] = None
    whyItMatters: Optional[str] = None
    howToLeverage: Optional[str] = None
    title: Optional[str] = None
    text: Optional[str] = None
    name: Optional[str] = None


class LLMServicesPositioningPatch(LLMStageBaseModel):
    mentorNotes: Optional[str] = None
    services: List[Dict[str, Any]] = Field(default_factory=list)
    serviceGaps: List[Union[LLMServiceGapItem, str]] = Field(default_factory=list)
    industriesServed: Optional[Dict[str, Any]] = None
    positioning: Optional[Dict[str, Any]] = None


class LLMLeadGenerationPatch(LLMStageBaseModel):
    mentorNotes: Optional[str] = None
    channels: List[Dict[str, Any]] = Field(default_factory=list)
    missingHighROIChannels: Union[List[Union[Dict[str, Any], str]], Dict[str, Any], str, None] = None
    leadMagnets: List[Dict[str, Any]] = Field(default_factory=list)


class LLMCompetitiveAdvantagesPatch(LLMStageBaseModel):
    advantages: List[Union[str, LLMCompetitiveAdvantageItem]] = Field(default_factory=list)
    mentorNotes: Optional[str] = None
    notes: Optional[str] = None


class LLMReportMetadataPatch(LLMStageBaseModel):
    overallScore: Optional[int] = None
    subScores: Optional[Dict[str, Any]] = None


class LLMReconcileResponse(LLMStageBaseModel):
    reportMetadata: Optional[LLMReportMetadataPatch] = None
    executiveSummary: Optional[Dict[str, Any]] = None
    websiteDigitalPresence: Optional[Dict[str, Any]] = None
    seoVisibility: Optional[Dict[str, Any]] = None
    reputation: Optional[Dict[str, Any]] = None
    servicesPositioning: Optional[LLMServicesPositioningPatch] = None
    leadGeneration: Optional[LLMLeadGenerationPatch] = None
    competitiveAnalysis: Optional[Dict[str, Any]] = None
    competitiveAdvantages: Optional[LLMCompetitiveAdvantagesPatch] = None
    appendices: Optional[Dict[str, Any]] = None


class LLMEstimationSection(LLMStageBaseModel):
    notes: Optional[Union[str, List[str]]] = None
    mentorNotes: Optional[str] = None
    confidenceScore: Optional[int] = None
    estimationDisclaimer: Optional[str] = None
    opportunities: Union[List[Dict[str, Any]], Dict[str, Any], None] = None
    segments: Union[List[Dict[str, Any]], Dict[str, Any], None] = None
    revenueTable: Union[List[Dict[str, Any]], Dict[str, Any], None] = None
    scenarios: Union[List[Dict[str, Any]], Dict[str, Any], None] = None
    actionCandidates: Union[List[Dict[str, Any]], Dict[str, Any], None] = None
    currencyContext: Optional[Dict[str, Any]] = None


class LLMSections810Response(LLMStageBaseModel):
    costOptimization: Optional[LLMEstimationSection] = None
    targetMarket: Optional[LLMEstimationSection] = None
    financialImpact: Optional[LLMEstimationSection] = None


class LLMFinalSynthesisResponse(LLMStageBaseModel):
    reportMetadata: Optional[LLMReportMetadataPatch] = None
    executiveSummary: Optional[Dict[str, Any]] = None
    websiteDigitalPresence: Optional[Dict[str, Any]] = None
    seoVisibility: Optional[Dict[str, Any]] = None
    reputation: Optional[Dict[str, Any]] = None
    servicesPositioning: Optional[LLMServicesPositioningPatch] = None
    leadGeneration: Optional[LLMLeadGenerationPatch] = None
    competitiveAnalysis: Optional[Dict[str, Any]] = None
    costOptimization: Optional[Dict[str, Any]] = None
    targetMarket: Optional[Dict[str, Any]] = None
    financialImpact: Optional[Dict[str, Any]] = None
    actionPlan90Days: Optional[Union[List[Dict[str, Any]], Dict[str, Any]]] = None
    competitiveAdvantages: Optional[LLMCompetitiveAdvantagesPatch] = None
    appendices: Optional[Dict[str, Any]] = None
