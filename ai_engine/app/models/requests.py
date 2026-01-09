from pydantic import BaseModel, Field
from typing import Any, Dict, Optional

class AnalyzeRequest(BaseModel):
    companyName: str = Field(..., min_length=1)
    website: str = Field(..., min_length=3)
    industry: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None

    # extra knobs
    reportType: str = Field(default="full")  # "quick" | "full"
    criteria: Dict[str, Any] = Field(default_factory=dict)

class AnalyzeResponse(BaseModel):
    ok: bool
    token: str
    reportId: str
    reportJson: Dict[str, Any]
    meta: Dict[str, Any]
