from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional, Union


class EstimationInputs(BaseModel):
    """User-provided financial inputs for scenario-based estimates in Sections 8–10.

    Accepts EITHER:
    - Numeric values (monthlyRevenue, monthlyLeads, etc.) — used directly in formulas
    - Range strings (monthlyAdSpendRange, avgDealValueRange, etc.) — parsed to midpoint
    Both styles are supported so the front-end can send whatever it has.
    """

    # ── Exact numeric inputs (highest priority) ──────────────────────────
    monthlyRevenue: Optional[Union[float, int]] = Field(None, description="Current monthly revenue")
    monthlyAdSpend: Optional[Union[float, int]] = Field(None, description="Monthly ad/marketing spend")
    monthlyLeads: Optional[Union[float, int]] = Field(None, description="Qualified leads per month")
    closeRate: Optional[Union[float, int]] = Field(None, description="Close rate as decimal (0.20) or percent (20)")
    avgDealValue: Optional[Union[float, int]] = Field(None, description="Average deal / contract value")
    currentTrafficPerMonth: Optional[Union[float, int]] = Field(None, description="Monthly website sessions")
    teamSize: Optional[Union[float, int]] = Field(None, description="Number of team members")
    monthlyPayrollCost: Optional[Union[float, int]] = Field(None, description="Monthly payroll / salary cost")
    monthlyToolsCost: Optional[Union[float, int]] = Field(None, description="Monthly software / tools cost")
    monthlyOverheadCost: Optional[Union[float, int]] = Field(None, description="Monthly overhead / office cost")
    qualifiedLeadsPerMonth: Optional[Union[float, int]] = Field(None, description="Qualified leads per month")
    teamSizeEstimate: Optional[Union[float, int]] = Field(None, description="Current team size estimate")
    monthlyRecurringRevenue: Optional[Union[float, int]] = Field(None, description="MRR / retainer revenue where relevant")
    grossMargin: Optional[Union[float, int]] = Field(None, description="Gross margin as decimal or percent")
    retentionRate: Optional[Union[float, int]] = Field(None, description="Retention rate as decimal or percent")
    churnRate: Optional[Union[float, int]] = Field(None, description="Churn rate as decimal or percent")
    salesCycleDays: Optional[Union[float, int]] = Field(None, description="Average sales cycle length in days")

    # ── Range strings (parsed to midpoint when numeric fields are absent) ──
    monthlyAdSpendRange: Optional[str] = Field(None, description="e.g. '500-1000' or '$1k-3k'")
    toolsStackEstimate: Optional[str] = Field(None, description="e.g. '200-500'")
    teamSizeRange: Optional[str] = Field(None, description="e.g. '3-8'")
    avgDealValueRange: Optional[str] = Field(None, description="e.g. '$1k-3k'")
    leadsPerMonthRange: Optional[str] = Field(None, description="e.g. '10-30'")
    closeRateRange: Optional[str] = Field(None, description="e.g. '15-25' (percent) or '0.15-0.25'")
    currentTrafficPerMonthRange: Optional[str] = Field(None, description="e.g. '500-2000'")
    monthlyRevenueRange: Optional[str] = Field(None, description="e.g. '3000-10000'")
    qualifiedLeadsPerMonthRange: Optional[str] = Field(None, description="e.g. '5-15'")
    monthlyPayrollCostRange: Optional[str] = Field(None, description="e.g. '2000-5000'")
    monthlyToolsCostRange: Optional[str] = Field(None, description="e.g. '100-500'")
    monthlyOverheadCostRange: Optional[str] = Field(None, description="e.g. '200-1000'")

    # ── Qualitative context ──────────────────────────────────────────────
    idealCustomer: Optional[str] = Field(None, description="Description of the ideal customer")
    primaryRegion: Optional[str] = Field(None, description="Primary operating region")
    currency: Optional[str] = Field(None, description="ISO 4217 code, e.g. GBP, USD, INR")

    class Config:
        extra = "allow"


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
    estimationMode: bool = False
    estimationInputs: Optional[EstimationInputs] = None
    optionalBusinessInputs: Optional[Dict[str, Any]] = None
    businessInputs: Optional[Dict[str, Any]] = None
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
