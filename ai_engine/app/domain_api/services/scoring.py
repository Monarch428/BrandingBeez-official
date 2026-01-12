def calculate_overall_score(technology_analysis: dict) -> float:
    total_score = 0
    count = 0

    for category in technology_analysis.values():
        if isinstance(category, dict) and "score" in category:
            total_score += category.get("score", 0)
            count += 1

    return round(total_score / count, 2) if count else 0.0


def grade_website(score: float) -> str:
    if score >= 8.5:
        return "A+"
    elif score >= 7.5:
        return "A"
    elif score >= 6.5:
        return "B"
    elif score >= 5.5:
        return "C"
    elif score >= 4.5:
        return "D"
    else:
        return "Poor"
