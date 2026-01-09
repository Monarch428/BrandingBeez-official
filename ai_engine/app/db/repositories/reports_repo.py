from datetime import datetime
from typing import Any, Dict
from pymongo.errors import DuplicateKeyError
from app.db.mongo import get_reports_collection

class ReportsRepository:
    def __init__(self):
        self.col = get_reports_collection()

    def create_report(
        self,
        token: str,
        analysis: Dict[str, Any],
        website: str | None = None,
        company_name: str | None = None,
        industry: str | None = None,
        email: str | None = None,
        name: str | None = None,
        report_download_token: str | None = None,
    ) -> str:
        doc = {
            "token": token,
            "analysis": analysis,
            "website": website,
            "companyName": company_name,
            "industry": industry,
            "email": email,
            "name": name,
            "reportDownloadToken": report_download_token,
            "reportGeneratedAt": datetime.utcnow(),
            "createdAt": datetime.utcnow(),
        }

        try:
            res = self.col.insert_one(doc)
            return str(res.inserted_id)
        except DuplicateKeyError:
            # Extremely rare; regenerate token at caller if needed
            raise

    def get_by_token(self, token: str):
        return self.col.find_one({"token": token})
