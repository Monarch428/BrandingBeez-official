# services/lag_detector.py

def detect_lags(technology_analysis: dict) -> list:
    """
    Detect lag across all technology categories
    """
    lag_report = []

    for category, data in technology_analysis.items():
        if not isinstance(data, dict):
            continue

        result = detect_lag(category, data)

        if result.get("lag"):
            lag_report.append({
                "category": category,
                **result
            })

    return lag_report


def detect_lag(category: str, data: dict) -> dict:
    """
    Routes lag detection to category-specific functions
    """
    detectors = {
        "CMS": cms_lag,
        "Frontend": frontend_lag,
        "Backend": backend_lag,
        "Server": server_lag,
        "Database": database_lag,
        "CDN": cdn_lag,
        "Security": security_lag,
        "Analytics": analytics_lag,
        "Marketing": marketing_lag,
        "Ecommerce": ecommerce_lag,
    }

    detector = detectors.get(category, default_lag)
    return detector(data)


# ---------------- CATEGORY RULES ---------------- #

def cms_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "CMS not detectable or intentionally hidden",
            "impact": "Content scalability and maintainability are unclear"
        }
    return {"lag": False}


def frontend_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "No modern frontend framework detected",
            "impact": "Reduced interactivity and slower UI updates"
        }
    return {"lag": False}


def backend_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "Backend stack not exposed via headers or responses",
            "impact": "Scalability, performance, and API robustness unclear",
            "note": "Often hidden for security hardening"
        }
    return {"lag": False}


def server_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "Web server information not disclosed",
            "impact": "Server tuning and request handling cannot be assessed"
        }
    return {"lag": False}


def database_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "Database engine not inferable from public signals",
            "impact": "Data throughput and reliability cannot be verified"
        }
    return {"lag": False}


def cdn_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "No CDN detected in headers or asset delivery",
            "impact": "Higher latency for geographically distributed users"
        }
    return {"lag": False}


def security_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "Critical security headers missing or misconfigured",
            "impact": "Higher exposure to XSS, clickjacking, and MITM attacks"
        }
    return {"lag": False}


def analytics_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "Analytics or telemetry tools not detected",
            "impact": "No visibility into user behavior or performance metrics"
        }
    return {"lag": False}


def marketing_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": True,
            "reason": "Marketing automation or CRM tools not identified",
            "impact": "Limited conversion tracking and campaign optimization"
        }
    return {"lag": False}


def ecommerce_lag(data: dict):
    if not data.get("detected"):
        return {
            "lag": False,
            "reason": "E-commerce functionality not applicable or not present"
        }
    return {"lag": False}


def default_lag(data: dict):
    return {
        "lag": False,
        "reason": "No lag detected"
    }
