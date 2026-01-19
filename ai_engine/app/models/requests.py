from pydantic import BaseModel, Field
from typing import Any, Dict, Optional


class EstimationInputs(BaseModel):
    """Optional user-provided ranges used for scenario-based estimates.

    These values should be *ranges/labels* (e.g., "10–50", "<5%", "£500–2k") rather than
    exact figures. The engine/LLM uses them only to tailor scenario outputs for report sections
    8–10 when `estimationMode` is enabled.
    """

    # Section 8 inputs (cost/profitability)
    monthlyAdSpendRange: Optional[str] = None
    toolsStackEstimate: Optional[str] = None
    teamSizeRange: Optional[str] = None

    # Section 9 inputs (segmentation)
    idealCustomer: Optional[str] = None
    primaryRegion: Optional[str] = None

    # Section 10 inputs (financial impact)
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

    # extra knobs
    reportType: str = Field(default="full")  # "quick" | "full"
    criteria: Dict[str, Any] = Field(default_factory=dict)

    # When enabled, the LLM is permitted to provide *scenario-based estimates* for report
    # sections 8–10 using crawl signals + optional ranges above.
    estimationMode: bool = False
    estimationInputs: Optional[EstimationInputs] = None

    # When true, bypass any per-website cached sections and run a fresh crawl/scrape.
    # (Used when the UI shows "Start new analysis" even if a previous report exists.)
    forceNewAnalysis: bool = False

class AnalyzeResponse(BaseModel):
    ok: bool
    token: str
    reportId: str
    reportJson: Dict[str, Any]
    meta: Dict[str, Any]
