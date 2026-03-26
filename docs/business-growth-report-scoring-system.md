# Business Growth Report Scoring System

## 1. Purpose

This document defines an implementation-ready scoring model for the AI Business Growth Report.

The design replaces simple score averaging with a structured model that:

- converts raw audit inputs into normalized `0-100` scores
- calculates weighted scores inside each report section
- rolls detailed section scores into the existing `reportMetadata.subScores` structure
- derives a final `overallScore` from all scored sections
- handles missing data without unfairly penalizing the business
- provides a confidence and coverage trail for debugging and reporting

## 2. Design Principles

The scoring system should follow these rules:

- `0-100` is the universal score scale for every metric, section, sub-score, and final score.
- Scores must be evidence-based. No score should be created without a raw input or explicit rule.
- Missing data should reduce confidence, not automatically create a low score.
- Each score must be traceable back to raw inputs, normalization rules, and weights.
- The final score must reward commercial performance, not only technical hygiene.

## 3. Scoring Architecture

The scoring model has five layers.

### Layer 1: Raw Inputs

Raw inputs are collected from crawl data, PageSpeed, review data, service extraction, lead-gen signals, market data, and optional integrations.

Examples:

- mobile performance score
- LCP in milliseconds
- review rating
- review count
- referring domains
- number of service pages
- presence of CTA
- presence of case studies
- number of missing high-intent channels

### Layer 2: Metric Normalization

Each raw input is converted into a normalized `0-100` score using a defined normalization method.

### Layer 3: Section Scores

Normalized metric scores are combined into a weighted score for each report section.

### Layer 4: Roll-up Sub-Scores

Detailed section scores are mapped into the existing display-level sub-scores:

- `website`
- `seo`
- `reputation`
- `leadGen`
- `services`
- `costEfficiency`

### Layer 5: Final Overall Score

The final overall score is a weighted aggregate of all scorable section scores.

## 4. Score Objects

Implementation should produce these objects internally:

```ts
type NormalizedMetric = {
  id: string;
  sectionId: string;
  rawValue: number | string | boolean | null;
  normalizedScore: number | null;
  weight: number;
  available: boolean;
  normalizationType: string;
};

type SectionScore = {
  sectionId: string;
  score: number | null;
  coverage: number;   // 0.00 to 1.00
  confidence: "high" | "medium" | "low";
};

type ScoreOutput = {
  sectionScores: Record<string, SectionScore>;
  subScores: {
    website: number | null;
    seo: number | null;
    reputation: number | null;
    leadGen: number | null;
    services: number | null;
    costEfficiency: number | null;
  };
  overallScore: number | null;
  overallCoverage: number; // 0.00 to 1.00
};
```

## 5. Section Weight Model

The final report score should be based on the following section weights.

| Section | Weight in Overall Score |
|---|---:|
| Website Digital Presence | 15% |
| SEO Visibility | 18% |
| Reputation | 10% |
| Services Positioning | 10% |
| Lead Generation | 15% |
| Competitive Analysis | 8% |
| Cost Optimization | 8% |
| Target Market & ICP | 6% |
| Financial Impact | 6% |
| Risk & Execution Readiness | 4% |
| **Total** | **100%** |

## 6. Metric Weights Inside Each Section

### 6.1 Website Digital Presence

| Factor | Weight |
|---|---:|
| Technical health | 35% |
| Content quality and coverage | 25% |
| UX and conversion clarity | 25% |
| Performance and mobile experience | 15% |

### 6.2 SEO Visibility

| Factor | Weight |
|---|---:|
| Keyword footprint | 35% |
| Non-brand intent share | 20% |
| Backlink quality | 25% |
| Authority and competitive gap | 20% |

### 6.3 Reputation

| Factor | Weight |
|---|---:|
| Average rating | 40% |
| Review volume vs benchmark | 25% |
| Sentiment and trust themes | 20% |
| Review response management | 15% |

### 6.4 Services Positioning

| Factor | Weight |
|---|---:|
| Service clarity and productization | 35% |
| Differentiation | 25% |
| Proof alignment | 20% |
| Buyer-fit clarity | 20% |

### 6.5 Lead Generation

| Factor | Weight |
|---|---:|
| CTA coverage and intent | 25% |
| Conversion path friction | 25% |
| Lead capture infrastructure | 25% |
| Funnel asset coverage | 25% |

### 6.6 Competitive Analysis

| Factor | Weight |
|---|---:|
| Positioning strength | 35% |
| Offer parity and gap coverage | 30% |
| SERP competitiveness | 20% |
| Opportunity clarity | 15% |

### 6.7 Cost Optimization

| Factor | Weight |
|---|---:|
| Automation opportunity | 30% |
| Process efficiency | 25% |
| Tool and resource efficiency | 20% |
| Pricing and margin protection | 25% |

### 6.8 Target Market & ICP

| Factor | Weight |
|---|---:|
| ICP definition | 35% |
| Segment prioritization | 25% |
| Offer-to-segment fit | 20% |
| Geography and market realism | 20% |

### 6.9 Financial Impact

| Factor | Weight |
|---|---:|
| Revenue logic completeness | 35% |
| Conversion math realism | 25% |
| Scenario modeling quality | 20% |
| ROI clarity | 20% |

### 6.10 Risk & Execution Readiness

| Factor | Weight |
|---|---:|
| Feasibility | 35% |
| Measurement readiness | 25% |
| Dependency and compliance risk | 20% |
| Sequencing quality | 20% |

## 7. Normalization Methodology

All raw inputs must be converted into `0-100` scores using one of the following methods.

### 7.1 Direct Pass-Through

Use when the source already provides a `0-100` score.

Formula:

```text
normalized = clamp(raw, 0, 100)
```

Use for:

- PageSpeed performance score
- content score from content-quality analyzer
- UX analyzer score

### 7.2 Binary Rule

Use for yes/no signals.

Formula:

```text
normalized = 100 if condition_met else 0
```

Optional partial state:

```text
normalized = 50 if partially_met
```

Use for:

- robots.txt present
- sitemap.xml present
- case study page present
- contact CTA present

### 7.3 Linear Progress to Target

Use when higher is better and a target value exists.

Formula:

```text
normalized = clamp((raw / target) * 100, 0, 100)
```

Use for:

- number of service pages
- number of lead magnets
- number of competitors benchmarked

### 7.4 Square-Root Scaling

Use when higher is better but raw values vary widely and should not overpower the score.

Formula:

```text
normalized = clamp(sqrt(raw / target) * 100, 0, 100)
```

Use for:

- review count vs benchmark
- referring domains vs benchmark

### 7.5 Lower-Is-Better Piecewise Scaling

Use when smaller values are better.

Formula:

```text
if raw <= target: normalized = 100
elif raw >= fail: normalized = 0
else: normalized = ((fail - raw) / (fail - target)) * 100
```

Use for:

- LCP
- CLS
- TBT
- form friction time

### 7.6 Range-Optimal Piecewise Scaling

Use when performance is best inside a range.

Formula:

```text
if lower <= raw <= upper: normalized = 100
elif raw < lower: normalized = clamp((raw / lower) * 100, 0, 100)
else: normalized = clamp(((maxAllowed - raw) / (maxAllowed - upper)) * 100, 0, 100)
```

Use for:

- review rating
- keyword non-brand share
- close rate

## 8. Section Score Formula

For each section:

```text
section_score =
  sum(metric_score_i * metric_weight_i * availability_i)
  / sum(metric_weight_i * availability_i)
```

Where:

- `metric_score_i` is the normalized score for metric `i`
- `metric_weight_i` is the weight of metric `i` inside the section
- `availability_i` is `1` if the metric is available, otherwise `0`

### Section Coverage

Coverage shows how much of the section was actually measurable.

```text
section_coverage =
  sum(metric_weight_i * availability_i)
  / sum(metric_weight_i)
```

### Section Confidence

| Coverage | Confidence |
|---|---|
| `>= 0.85` | High |
| `0.65 - 0.84` | Medium |
| `< 0.65` | Low |

### Section Scorable Rule

A section is counted in the final overall score only if:

- `section_coverage >= 0.40`

If coverage is below `0.40`, the section is marked `N/A` and excluded from final weighted aggregation.

## 9. Roll-Up to Existing `subScores`

The current report schema exposes six roll-up sub-scores. These should be calculated as follows.

### 9.1 Website

```text
subScores.website = Website Digital Presence score
```

### 9.2 SEO

```text
subScores.seo =
  (SEO Visibility * 0.75) +
  (Competitive Analysis * 0.25)
```

If Competitive Analysis is unavailable, renormalize to SEO Visibility only.

### 9.3 Reputation

```text
subScores.reputation = Reputation score
```

### 9.4 Lead Generation

```text
subScores.leadGen = Lead Generation score
```

### 9.5 Services

```text
subScores.services =
  (Services Positioning * 0.70) +
  (Target Market & ICP * 0.30)
```

If Target Market is unavailable, renormalize to Services Positioning only.

### 9.6 Cost Efficiency

```text
subScores.costEfficiency =
  (Cost Optimization * 0.55) +
  (Financial Impact * 0.25) +
  (Risk & Execution Readiness * 0.20)
```

If one component is unavailable, renormalize the remaining component weights.

## 10. Final Overall Score Formula

The final overall score is the weighted average of all scorable section scores.

```text
overall_score =
  sum(section_score_s * section_weight_s * scorable_s)
  / sum(section_weight_s * scorable_s)
```

Where:

- `section_score_s` is the score of section `s`
- `section_weight_s` is the overall weight of section `s`
- `scorable_s` is `1` if section coverage is at least `0.40`, otherwise `0`

### Overall Coverage

```text
overall_coverage =
  sum(section_weight_s * section_coverage_s)
  / sum(section_weight_s)
```

This should be displayed separately from the overall score.

## 11. High, Medium, and Low Score Conditions

### 11.1 Universal Score Interpretation

| Score Range | Interpretation | Condition |
|---|---|---|
| `85 - 100` | High | Strong commercial foundation with only optimization gaps |
| `70 - 84` | Upper medium | Good foundation, several meaningful growth gaps remain |
| `55 - 69` | Medium | Functional but constrained; multiple weaknesses limit growth |
| `40 - 54` | Low | Weak growth system; important technical/commercial issues exist |
| `0 - 39` | Critical | Serious issues are blocking visibility, trust, or conversion |

### 11.2 Metric-Level Interpretation

| Metric Score | Label |
|---|---|
| `>= 80` | High |
| `60 - 79` | Medium |
| `< 60` | Low |

## 12. Example Normalization Calculations

### Example 1: Direct Pass-Through

Raw mobile performance score = `62`

```text
normalized = clamp(62, 0, 100) = 62
```

### Example 2: Lower-Is-Better LCP

Raw LCP = `3800ms`

Assumptions:

- target = `2500ms`
- fail = `6000ms`

```text
normalized = ((6000 - 3800) / (6000 - 2500)) * 100
normalized = (2200 / 3500) * 100
normalized = 62.86
normalized = 63
```

### Example 3: Referring Domains with Square-Root Scaling

Raw referring domains = `45`

Benchmark target = `100`

```text
normalized = sqrt(45 / 100) * 100
normalized = sqrt(0.45) * 100
normalized = 67.08
normalized = 67
```

### Example 4: Binary Conversion Signal

Contact CTA present = `true`

```text
normalized = 100
```

If CTA is absent:

```text
normalized = 0
```

## 13. Example Section Calculation

### Website Digital Presence Example

Assume the following normalized metrics:

- Technical health = `68`
- Content quality = `55`
- UX and conversion = `72`
- Performance/mobile = `62`

Section weights:

- Technical health = `35%`
- Content quality = `25%`
- UX and conversion = `25%`
- Performance/mobile = `15%`

Formula:

```text
website_score =
  (68 * 0.35) +
  (55 * 0.25) +
  (72 * 0.25) +
  (62 * 0.15)

website_score =
  23.80 + 13.75 + 18.00 + 9.30

website_score = 64.85
website_score = 65
```

## 14. Example Final Score Calculation

Assume the following section scores:

| Section | Score | Weight |
|---|---:|---:|
| Website Digital Presence | 65 | 15% |
| SEO Visibility | 58 | 18% |
| Reputation | 74 | 10% |
| Services Positioning | 69 | 10% |
| Lead Generation | 61 | 15% |
| Competitive Analysis | 54 | 8% |
| Cost Optimization | 63 | 8% |
| Target Market & ICP | 70 | 6% |
| Financial Impact | 57 | 6% |
| Risk & Execution Readiness | 80 | 4% |

Weighted calculation:

```text
overall =
  (65 * 0.15) +
  (58 * 0.18) +
  (74 * 0.10) +
  (69 * 0.10) +
  (61 * 0.15) +
  (54 * 0.08) +
  (63 * 0.08) +
  (70 * 0.06) +
  (57 * 0.06) +
  (80 * 0.04)

overall =
  9.75 + 10.44 + 7.40 + 6.90 + 9.15 + 4.32 + 5.04 + 4.20 + 3.42 + 3.20

overall = 63.82
overallScore = 64
```

## 15. Example Roll-Up Sub-Scores

Using the same sample section scores:

### SEO roll-up

```text
subScores.seo =
  (58 * 0.75) + (54 * 0.25)

subScores.seo = 43.50 + 13.50 = 57.00
subScores.seo = 57
```

### Services roll-up

```text
subScores.services =
  (69 * 0.70) + (70 * 0.30)

subScores.services = 48.30 + 21.00 = 69.30
subScores.services = 69
```

### Cost efficiency roll-up

```text
subScores.costEfficiency =
  (63 * 0.55) + (57 * 0.25) + (80 * 0.20)

subScores.costEfficiency =
  34.65 + 14.25 + 16.00

subScores.costEfficiency = 64.90
subScores.costEfficiency = 65
```

## 16. Missing Data Handling Example

If `Financial Impact` is unavailable and `Target Market` has only `20%` coverage:

- `Financial Impact` is excluded from final overall scoring
- `Target Market` is excluded if its coverage is below `0.40`
- the overall denominator is renormalized to only the scorable section weights

Example:

```text
available_weight =
  100 - 6 - 6
  = 88

overall_score =
  weighted_sum_of_scorable_sections / 88
```

This prevents missing integrations from automatically lowering the score.

## 17. Implementation Guidance

### 17.1 Store Metric Definitions in Configuration

Each metric should be declared in a configuration object, not hard-coded in the aggregator.

```ts
type MetricDefinition = {
  id: string;
  sectionId: string;
  weight: number;
  normalizationType: "direct" | "binary" | "linear_target" | "sqrt_target" | "lower_better" | "range_optimal";
  target?: number;
  fail?: number;
  lower?: number;
  upper?: number;
  maxAllowed?: number;
};
```

### 17.2 Preserve the Audit Trail

Persist all of the following for debugging:

- raw value
- normalization rule
- normalized score
- metric weight
- section score
- section coverage
- overall coverage

### 17.3 Round Late

Do not round during intermediate metric math.

Recommended:

- metric score: keep as float internally
- section score: round to 1 decimal internally
- sub-score: round to nearest integer for display
- overall score: round to nearest integer for display

### 17.4 Separate Score from Confidence

Always expose:

- `overallScore`
- `overallCoverage`
- per-section `coverage`

A score of `78` with `92%` coverage is more reliable than a score of `78` with `48%` coverage.

### 17.5 Recommended Processing Order

1. Collect raw inputs from all analyzers and integrations.
2. Map raw inputs to metric definitions.
3. Normalize each raw input into `0-100`.
4. Compute section scores and section coverage.
5. Compute roll-up sub-scores.
6. Compute final overall score.
7. Store score explanations for PDF/UI rendering.

## 18. Recommended Output Fields

The report output should contain at least:

```json
{
  "reportMetadata": {
    "overallScore": 64,
    "subScores": {
      "website": 65,
      "seo": 57,
      "reputation": 74,
      "leadGen": 61,
      "services": 69,
      "costEfficiency": 65
    }
  },
  "scoreMeta": {
    "overallCoverage": 0.88,
    "sectionScores": {
      "websiteDigitalPresence": { "score": 65, "coverage": 1.0, "confidence": "high" },
      "seoVisibility": { "score": 58, "coverage": 0.9, "confidence": "high" }
    }
  }
}
```

## 19. Summary

This scoring system creates a clear and implementable structure:

- raw evidence becomes normalized metric scores
- metrics become weighted section scores
- section scores become roll-up sub-scores
- the final overall score is a weighted aggregate of all scorable sections

This model is stronger than simple averaging because it is:

- weighted
- normalization-based
- coverage-aware
- implementation-friendly
- commercially aligned
