from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


class EstimationInputs(BaseModel):
    """Optional user-provided ranges used for scenario-based estimates.

    These values should be *ranges/labels* (e.g., "10-50", "<5%", "$500-2k") rather than
    exact figures. The engine/LLM uses them only to tailor scenario outputs for report sections
    8-10 when `estimationMode` is enabled.
    """

    monthlyAdSpendRange: Optional[str] = None
    toolsStackEstimate: Optional[str] = None
    teamSizeRange: Optional[str] = None
    idealCustomer: Optional[str] = None
    primaryRegion: Optional[str] = None
    avgDealValueRange: Optional[str] = None
    leadsPerMonthRange: Optional[str] = None
    closeRateRange: Optional[str] = None
    currentTrafficPerMonthRange: Optional[str] = None


class AnalyzeRequest(BaseModel):
    companyName: str = Field(..., min_length=1)
    website: str = Field(..., min_length=3)
    industry: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    location: Optional[str] = None
    companyCountryCode: Optional[str] = None
    targetMarketCountries: Optional[List[str]] = None
    targetMarket: Optional[str] = None
    primaryTargetMarket: Optional[str] = None
    businessGoal: Optional[str] = None
    reportType: str = Field(default="full")
    criteria: Dict[str, Any] = Field(default_factory=dict)
    estimationMode: bool = True
    estimationInputs: Optional[EstimationInputs] = None
    includeSections8to10: bool = True
    forceNewAnalysis: bool = False


class AnalyzeResponse(BaseModel):
    ok: bool
    token: str
    reportId: str
    reportJson: Dict[str, Any]
    meta: Dict[str, Any]
    report: Optional[Dict[str, Any]] = None
    structuredReport: Optional[Dict[str, Any]] = None
    pdfUrl: Optional[str] = None
    website: Optional[str] = None
    company: Optional[str] = None
