import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import type { BusinessGrowthReport, WebsiteSpeedTest } from "./openai";

const BRAND_PURPLE = "#321a66";
const BRAND_CORAL = "#ee4962";
const BRAND_BLUE = "#2563eb";
const GRAY_900 = "#111827";
const GRAY_700 = "#374151";
const GRAY_500 = "#6b7280";
const GRAY_300 = "#d1d5db";
const GRAY_200 = "#e5e7eb";
const GRAY_100 = "#f3f4f6";
const GRAY_50 = "#f8fafc";

type Dict = Record<string, any>;
type Maybe<T> = T | null | undefined;
type ScoreLike = number | null | undefined;
type TableCell = string | number | null | undefined;
type TableRow = TableCell[];


type RecommendationDetail = {
  issue?: string | null;
  severity?: string | null;
  page?: string | null;
  pageLabel?: string | null;
  placement?: string | null;
  recommendation?: string | null;
  why?: string | null;
  suggestedVariants?: string[] | null;
  supportingBlocks?: string[] | null;
  expectedOutcome?: string | null;
};

type ActionCandidate = {
  title?: string | null;
  sourceSection?: string | null;
  impact?: string | null;
  effort?: string | null;
  urgency?: string | null;
  confidence?: number | string | null;
  pillar?: string | null;
  priorityScore?: number | string | null;
  kpis?: string[] | null;
  details?: Record<string, any> | null;
};

function escapeHtml(value: any): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeText(value: any, fallback = "N/A"): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const text = String(value).trim();
  return text ? text : fallback;
}

function isMeaningful(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some(isMeaningful);
  if (typeof value === "object") return Object.values(value).some(isMeaningful);
  const text = String(value).trim();
  return !!text && text !== "N/A" && text !== "-" && text !== "null" && text !== "undefined";
}

function scoreValue(value: ScoreLike): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "0";
  return String(Math.max(0, Math.min(100, Math.round(value))));
}

function formatDate(value: any): string {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return safeText(value, "N/A");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeStringList(value: any): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item === null || item === undefined) return "";
      if (typeof item === "object") {
        return String(item.label ?? item.title ?? item.name ?? item.value ?? item.text ?? "").trim();
      }
      return String(item).trim();
    })
    .filter(Boolean);
}

function truthyArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value.filter((item) => isMeaningful(item)) : [];
}

function firstNonEmptyArray<T = any>(...values: any[]): T[] {
  for (const value of values) {
    const arr = truthyArray<T>(value);
    if (arr.length) return arr;
  }
  return [];
}

function formatMs(value: any): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";
  return `${Math.round(value)} ms`;
}

function formatDecimal(value: any, digits = 3): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";
  return value.toFixed(digits);
}

function formatNumber(value: any): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";
  return new Intl.NumberFormat("en-US").format(value);
}

function dataUriFromBase64(b64: string, mimeHint?: string): string {
  const mime = mimeHint || "image/png";
  if (b64.startsWith("data:")) return b64;
  return `data:${mime};base64,${b64}`;
}

function fileToDataUri(filePath: string, mime = "font/ttf"): string | null {
  try {
    const buffer = fs.readFileSync(filePath);
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function resolveFonts() {
  const fontsDir = path.join(process.cwd(), "assets", "fonts");
  const regular = fileToDataUri(path.join(fontsDir, "NotoSans-Regular.ttf"));
  const bold = fileToDataUri(path.join(fontsDir, "NotoSans-Bold.ttf"));
  return { regular, bold, embedded: !!(regular && bold) };
}

function sectionHeading(number: string, title: string): string {
  return `<div class="section-heading"><span class="section-number">${escapeHtml(number)}.</span><span>${escapeHtml(title)}</span></div>`;
}

function subsectionHeading(title: string): string {
  return `<h3 class="subheading">${escapeHtml(title)}</h3>`;
}

function renderParagraph(text: any, empty = ""): string {
  const value = safeText(text, empty);
  if (!value) return "";
  if (value === "N/A" && !empty) return "";
  return `<p>${escapeHtml(value)}</p>`;
}

function renderBulletLines(items: any[], empty = "No data available."): string {
  const normalized = normalizeStringList(items);
  if (!normalized.length) return `<p class="muted">${escapeHtml(empty)}</p>`;
  return `<ul class="bullet-list">${normalized.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}




type SectionMeta = {
  relevance?: { level?: string | null; reason?: string | null } | null;
  evidenceStrength?: any;
  businessFit?: any;
  assumptions?: string[] | null;
  inputCoverage?: string[] | null;
  businessLens?: string | null;
};

function flattenMetaText(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return safeText(value, "");
  }
  if (Array.isArray(value)) return normalizeStringList(value).join("; ");
  if (typeof value === "object") {
    const preferred = [
      value.label,
      value.level,
      value.value,
      value.summary,
      value.reason,
      value.description,
      value.text,
      value.note,
      value.score,
    ]
      .map((item) => safeText(item, ""))
      .filter(Boolean);
    if (preferred.length) return preferred.join(" — ");
    return normalizeStringList(Object.values(value)).join("; ");
  }
  return safeText(value, "");
}

function normalizeSectionMeta(value: any): SectionMeta {
  const obj = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const relevance = obj.relevance && typeof obj.relevance === "object" ? obj.relevance : {};
  return {
    relevance,
    evidenceStrength: obj.evidenceStrength,
    businessFit: obj.businessFit,
    assumptions: normalizeStringList(obj.assumptions),
    inputCoverage: normalizeStringList(obj.inputCoverage),
    businessLens: safeText(obj.businessLens, ""),
  };
}

function renderSectionSignals(value: any): string {
  const meta = normalizeSectionMeta(value);
  const lines: string[] = [];
  if (isMeaningful(meta.relevance?.level)) {
    const label = safeText(meta.relevance?.level, "").replace(/^./, (s) => s.toUpperCase());
    const reason = safeText(meta.relevance?.reason, "");
    lines.push(`<strong>Relevance:</strong> ${escapeHtml(label)}${reason ? ` — ${escapeHtml(reason)}` : ""}`);
  }
  const businessFitText = flattenMetaText(meta.businessFit);
  const evidenceStrengthText = flattenMetaText(meta.evidenceStrength);
  if (isMeaningful(businessFitText)) lines.push(`<strong>Business fit:</strong> ${escapeHtml(businessFitText)}`);
  if (isMeaningful(evidenceStrengthText)) lines.push(`<strong>Evidence strength:</strong> ${escapeHtml(evidenceStrengthText)}`);
  if (isMeaningful(meta.businessLens)) lines.push(`<strong>Business lens:</strong> ${escapeHtml(safeText(meta.businessLens, ""))}`);
  if (!lines.length) return "";
  return `<div class="section-signals">${lines.map((line) => `<div>${line}</div>`).join("")}</div>`;
}

function extractSegmentBudget(item: any): string {
  if (!item || typeof item !== "object") return "-";
  const budget = item.expectedBudget || item.budget || item.avgBudget || item.budgetRange;
  if (!budget) return "-";
  if (typeof budget === "string") return safeText(budget, "-");
  if (typeof budget === "object") {
    const min = safeText(budget.min, "");
    const max = safeText(budget.max, "");
    const currency = safeText(budget.currency, "");
    const period = safeText(budget.period, "");
    const range = [currency, min && max ? `${min}-${max}` : (min || max)].filter(Boolean).join("");
    return [range || safeText(budget.notes, ""), period].filter(Boolean).join(" / ") || "-";
  }
  return safeText(budget, "-");
}

function collectTargetSegmentRows(target: Dict): TableRow[] {
  return truthyArray<any>(target?.segments || target?.currentTargetSegments || target?.detectedSegments).map((item) => [
    item?.segment ?? item?.name,
    normalizeStringList(item?.painPoints || item?.pains || item?.problems).join("; ") || safeText(item?.notes, "-"),
    extractSegmentBudget(item),
  ]);
}

function collectFinancialLeverRows(financial: Dict): TableRow[] {
  return truthyArray<any>(financial?.profitabilityLevers || financial?.revenueOpportunities).map((item) => [
    item?.lever ?? item?.opportunity,
    item?.impact ?? item?.monthlyImpact,
    item?.effort ?? item?.confidence,
    item?.notes ?? item?.annualImpact,
  ]);
}

function normalizeRecommendationDetails(value: any): RecommendationDetail[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      issue: safeText(item.issue, ""),
      severity: safeText(item.severity, ""),
      page: safeText(item.page, ""),
      pageLabel: safeText(item.pageLabel, ""),
      placement: safeText(item.placement, ""),
      recommendation: safeText(item.recommendation, ""),
      why: safeText(item.why, ""),
      suggestedVariants: normalizeStringList(item.suggestedVariants),
      supportingBlocks: normalizeStringList(item.supportingBlocks),
      expectedOutcome: safeText(item.expectedOutcome, ""),
    }))
    .filter((item) =>
      isMeaningful(item.recommendation) ||
      isMeaningful(item.page) ||
      isMeaningful(item.pageLabel) ||
      isMeaningful(item.suggestedVariants) ||
      isMeaningful(item.supportingBlocks),
    );
}

function normalizeActionCandidates(value: any): ActionCandidate[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      title: safeText(item.title, ""),
      sourceSection: safeText(item.sourceSection, ""),
      impact: safeText(item.impact, ""),
      effort: safeText(item.effort, ""),
      urgency: safeText(item.urgency, ""),
      confidence: item.confidence,
      pillar: safeText(item.pillar, ""),
      priorityScore: item.priorityScore,
      kpis: normalizeStringList(item.kpis),
      details: item.details && typeof item.details === "object" ? item.details : {},
    }))
    .filter((item) => isMeaningful(item.title));
}

function formatConfidence(value: any): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value <= 1) return `${Math.round(value * 100)}%`;
    return `${Math.round(value)}%`;
  }
  const text = safeText(value, "-");
  return text === "N/A" ? "-" : text;
}

function renderRecommendationDetails(details: any, empty = "No structured recommendations available."): string {
  const items = normalizeRecommendationDetails(details);
  if (!items.length) return `<p class="muted">${escapeHtml(empty)}</p>`;

  return `
    <div class="recommendation-grid">
      ${items
        .map(
          (item) => `
            <div class="recommendation-card">
              <div class="recommendation-title">${escapeHtml(safeText(item.recommendation || item.issue, "Recommendation"))}</div>
              ${isMeaningful(item.pageLabel || item.page || item.placement)
                ? `<div class="recommendation-meta"><strong>Where:</strong> ${escapeHtml([safeText(item.pageLabel, ""), safeText(item.page, ""), safeText(item.placement, "")].filter(Boolean).join(" • "))}</div>`
                : ""}
              ${isMeaningful(item.severity)
                ? `<div class="recommendation-meta"><strong>Priority:</strong> ${escapeHtml(safeText(item.severity, "-"))}</div>`
                : ""}
              ${isMeaningful(item.why)
                ? `<p><strong>Why:</strong> ${escapeHtml(safeText(item.why, ""))}</p>`
                : ""}
              ${item.suggestedVariants && item.suggestedVariants.length
                ? `<div class="recommendation-subtitle">Suggested variants</div>${renderBulletLines(item.suggestedVariants, "")}`
                : ""}
              ${item.supportingBlocks && item.supportingBlocks.length
                ? `<div class="recommendation-subtitle">Suggested supporting blocks</div>${renderBulletLines(item.supportingBlocks, "")}`
                : ""}
              ${isMeaningful(item.expectedOutcome)
                ? `<p><strong>Expected outcome:</strong> ${escapeHtml(safeText(item.expectedOutcome, ""))}</p>`
                : ""}
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderActionCandidates(value: any, empty = "No action candidates available."): string {
  const items = normalizeActionCandidates(value)
    .sort((a, b) => Number(b.priorityScore ?? -1) - Number(a.priorityScore ?? -1));
  const rows: TableRow[] = items.map((item) => [
    item.title,
    item.pillar,
    capitalize(item.impact || undefined),
    capitalize(item.effort || undefined),
    formatConfidence(item.confidence),
    item.kpis?.join(", ") || "-",
  ]);
  return renderTable(["Action", "Pillar", "Impact", "Effort", "Confidence", "KPIs"], rows, {
    compact: true,
    emptyText: empty,
  });
}

function renderActionCandidateCards(value: any, empty = "No action candidates available."): string {
  return renderActionCandidates(value, empty);
}

function collectCrossSectionActionCandidates(sections: any[]): ActionCandidate[] {
  return sections
    .flatMap((section) => normalizeActionCandidates(section?.actionCandidates))
    .sort((a, b) => Number(b.priorityScore ?? -1) - Number(a.priorityScore ?? -1));
}

function buildFallbackActionPlanRows(candidates: ActionCandidate[]): TableRow[] {
  const weekRanges = ["Weeks 1–2", "Weeks 3–4", "Weeks 5–6", "Weeks 7–8", "Weeks 9–10", "Weeks 11–12"];
  return candidates.slice(0, 6).map((item, index) => [
    weekRanges[index] || `Step ${index + 1}`,
    item.title || item.pillar || `Priority ${index + 1}`,
    [item.title, ...(item.kpis || []).slice(0, 2).map((kpi) => `Track KPI: ${kpi}`)].filter(Boolean).join("; "),
    item.details && typeof item.details === "object"
      ? safeText((item.details as Record<string, any>).expectedOutcome || (item.details as Record<string, any>).why || item.pillar, "-")
      : safeText(item.pillar, "-"),
  ]);
}

function renderMetricSummary(label: string, value: any): string {
  return `
    <div class="summary-metric">
      <div class="summary-metric-label">${escapeHtml(label)}</div>
      <div class="summary-metric-value">${escapeHtml(safeText(value, "0"))}</div>
    </div>
  `;
}

function capitalize(value?: string) {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderScoreStrip(items: Array<{ label: string; value: any }>): string {
  return `
    <div class="score-strip">
      ${items
        .map(
          (item) => `
            <div class="score-strip-item">
              <div class="score-strip-label">${escapeHtml(item.label)}</div>
              <div class="score-strip-value">${escapeHtml(safeText(item.value, "0"))}/100</div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCallout(title: string, body: any): string {
  if (!isMeaningful(body)) return "";
  const paragraphs = String(body)
    .split(/\n{2,}|\r\n\r\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${escapeHtml(part)}</p>`)
    .join("");
  return `
    <div class="callout">
      <div class="callout-title">${escapeHtml(title)}</div>
      ${paragraphs || `<p>${escapeHtml(String(body))}</p>`}
    </div>
  `;
}

function renderKeyValueRows(items: Array<{ label: string; value: any }>): string {
  const rows = items.filter((item) => isMeaningful(item.value));
  if (!rows.length) return "";
  return `
    <div class="key-value-list">
      ${rows
        .map(
          (item) => `
            <div class="key-value-row">
              <span class="key-value-label">${escapeHtml(item.label)}</span>
              <span class="key-value-value">${escapeHtml(safeText(item.value, "N/A"))}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTable(headers: string[], rows: TableRow[], options?: { compact?: boolean; emptyText?: string }): string {
  const usableRows = rows
    .filter((row) => Array.isArray(row) && row.some((cell) => isMeaningful(cell)))
    .map((row) => row.map((cell) => safeText(cell, "-")));

  if (!usableRows.length) {
    return `<p class="muted">${escapeHtml(options?.emptyText || "No data available.")}</p>`;
  }

  return `
    <table class="report-table ${options?.compact ? "compact" : ""}">
      <thead>
        <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${usableRows
          .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>
  `;
}

function speedTestRows(speed: WebsiteSpeedTest | undefined): TableRow[] {
  const rows: TableRow[] = [];
  const push = (label: string, input: any) => {
    if (!input) return;
    const metrics = input.metrics || {};
    rows.push([
      label,
      input.performanceScore ?? "N/A",
      input.seoScore ?? "N/A",
      formatMs(metrics.lcpMs ?? input.lcpMs),
      formatDecimal(metrics.cls ?? input.cls),
      formatMs(metrics.tbtMs ?? input.tbtMs),
      formatMs(metrics.speedIndexMs ?? input.speedIndexMs),
    ]);
  };
  push("Mobile", speed?.mobile);
  push("Desktop", speed?.desktop);
  return rows;
}

function extractSpeedOpportunities(speed: WebsiteSpeedTest | undefined): string[] {
  const mobile = Array.isArray(speed?.mobile?.opportunities) ? speed!.mobile.opportunities : [];
  const desktop = Array.isArray(speed?.desktop?.opportunities) ? speed!.desktop.opportunities : [];

  const entries: string[] = [];
  for (const item of mobile) {
    const title = safeText(item?.title, "");
    if (title) entries.push(`Mobile: ${title}`);
  }
  for (const item of desktop) {
    const title = safeText(item?.title, "");
    if (title) entries.push(`Desktop: ${title}`);
  }

  return Array.from(new Set(entries.map((s) => s.trim()))).filter(Boolean);
}

function buildAdvantageRows(advantages: Dict): TableRow[] {
  const rows: TableRow[] = truthyArray<any>(advantages?.advantages || advantages?.hiddenStrengths).map((item) => {
    if (typeof item === "string") return [item, "-", "-"];
    return [item?.advantage ?? item?.strength, item?.whyItMatters ?? item?.evidence, item?.howToLeverage];
  });

  const notes = safeText(advantages?.notes, "");
  if (!notes) return rows.filter((row) => row.some((cell) => isMeaningful(cell)));

  const lines = notes.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const parsed = new Map<string, { why?: string; how?: string }>();

  for (const line of lines) {
    const whyMatch = line.match(/^(.*?):\s*Why it matters:\s*(.*)$/i);
    if (whyMatch) {
      const item = parsed.get(whyMatch[1].trim()) || {};
      item.why = whyMatch[2].trim();
      parsed.set(whyMatch[1].trim(), item);
      continue;
    }
    const howMatch = line.match(/^(.*?):\s*How to leverage:\s*(.*)$/i);
    if (howMatch) {
      const item = parsed.get(howMatch[1].trim()) || {};
      item.how = howMatch[2].trim();
      parsed.set(howMatch[1].trim(), item);
    }
  }

  for (const [advantage, detail] of parsed.entries()) {
    const existing = rows.find((row) => safeText(row[0], "").toLowerCase() === advantage.toLowerCase());
    if (existing) {
      if (safeText(existing[1], "-") === "-" && detail.why) existing[1] = detail.why;
      if (safeText(existing[2], "-") === "-" && detail.how) existing[2] = detail.how;
    } else {
      rows.push([advantage, detail.why ?? "-", detail.how ?? "-"]);
    }
  }

  return rows.filter((row) => row.some((cell) => isMeaningful(cell)));
}

function renderDataSources(dataSources: any[]): string {
  const rows = truthyArray<any>(dataSources).map((item) => [
    item?.label,
    item?.source,
    item?.collectedAt ? formatDate(item.collectedAt) : "N/A",
    item?.notes,
  ]);
  return renderTable(["Label", "Source", "Collected At", "Notes"], rows, {
    compact: true,
    emptyText: "No data sources listed.",
  });
}

function renderDataGaps(dataGaps: any[]): string {
  const rows = truthyArray<any>(dataGaps).map((gap) => [
    gap?.area,
    normalizeStringList(gap?.missing).join("; ") || "-",
    normalizeStringList(gap?.howToEnable).join("; ") || "-",
  ]);
  return renderTable(["Area", "Missing", "How To Enable"], rows, {
    compact: true,
    emptyText: "No data gaps listed.",
  });
}

function renderAppendixKeywordGroups(keywordGroups: any[]): string {
  const groups = truthyArray<any>(keywordGroups);
  if (!groups.length) return `<p class="muted">No keyword groups available.</p>`;

  return groups
    .map((group) => {
      const rows = truthyArray<any>(group?.keywords).map((k) => [
        k?.keyword,
        k?.monthlySearches,
        k?.difficulty,
        k?.intent,
        k?.currentRank,
      ]);
      return `
        <div class="appendix-block">
          <div class="appendix-title">${escapeHtml(safeText(group?.tier, "Keyword Tier"))}</div>
          ${renderTable(["Keyword", "Monthly Searches", "Difficulty", "Intent", "Current Rank"], rows, { compact: true })}
          ${renderParagraph(group?.notes)}
        </div>
      `;
    })
    .join("");
}

function renderForecastTables(tables: any[]): string {
  const blocks = truthyArray<any>(tables);
  if (!blocks.length) return `<p class="muted">No forecast tables available.</p>`;

  return blocks
    .map((table) => {
      const headers = truthyArray<string>(table?.headers).map((h) => safeText(h, "-"));
      const rows = truthyArray<any[]>(table?.rows).map((row) => row.map((cell) => safeText(cell, "-")));
      return `
        <div class="appendix-block">
          <div class="appendix-title">${escapeHtml(safeText(table?.tableTitle, "Forecast Table"))}</div>
          ${headers.length ? renderTable(headers, rows, { compact: true }) : `<p class="muted">No table headers provided.</p>`}
          ${renderParagraph(table?.notes)}
        </div>
      `;
    })
    .join("");
}

function renderSerpOrBacklinks(blocks: any[], title: string): string {
  const items = truthyArray<any>(blocks);
  if (!items.length) return `<p class="muted">${escapeHtml(`No ${title.toLowerCase()} data available.`)}</p>`;

  return items
    .map((block) => {
      const rows = truthyArray<any>(block?.items).map((item) => {
        if (typeof item === "object" && item !== null) {
          const keys = Object.keys(item);
          const summary = keys
            .slice(0, 5)
            .map((k) => `${k}: ${safeText(item[k], "-")}`)
            .join(" | ");
          return [summary];
        }
        return [safeText(item, "-")];
      });

      return `
        <div class="appendix-block">
          <div class="appendix-title">${escapeHtml(title)} — ${escapeHtml(safeText(block?.tier, "General"))}</div>
          ${renderTable(["Details"], rows, { compact: true })}
          ${renderParagraph(block?.notes)}
        </div>
      `;
    })
    .join("");
}

function renderCompetitorCards(competitors: any[]): string {
  const list = truthyArray<any>(competitors);
  if (!list.length) return `<p class="muted">No competitor details available.</p>`;

  return list
    .map((competitor, index) => {
      const services = normalizeStringList(competitor?.services);
      const strengths = normalizeStringList(competitor?.strengthsVsYou || competitor?.strengths);
      const website = safeText(competitor?.website, "N/A");
      const team = safeText(competitor?.team, "");
      const marketOverlap = safeText(competitor?.marketOverlap, "N/A");

      return `
        <div class="competitor-block">
          <div class="competitor-name">${index + 1}. ${escapeHtml(safeText(competitor?.name, "Competitor"))}</div>
          <p><strong>Website:</strong> ${escapeHtml(website)}${team ? ` - <strong>Team:</strong> ${escapeHtml(team)}` : ""}</p>
          ${services.length ? `${subsectionHeading("Services")}${renderBulletLines(services)}` : ""}
          ${strengths.length ? `${subsectionHeading("Strengths vs You")}${renderBulletLines(strengths)}` : ""}
          <p><strong>Market Overlap:</strong> ${escapeHtml(marketOverlap)}</p>
          ${renderParagraph(competitor?.notes)}
        </div>
      `;
    })
    .join("");
}

function renderStandardPage(pageNumber: number, companyName: string, body: string): string {
  return `
    <section class="page">
      <div class="page-shell">
        <div class="running-header">
          <span>AI BUSINESS GROWTH ANALYZER ${escapeHtml(companyName)}</span>
        </div>
        <div class="page-content">
          ${body}
        </div>
        <div class="running-footer">
          <span>Page ${pageNumber}</span>
          <span>CONFIDENTIAL</span>
        </div>
      </div>
    </section>
  `;
}

function renderScreenshotPages(companyName: string, startingPage: number, shots: any[]): { html: string; pagesUsed: number } {
  const allShots = truthyArray<any>(shots);
  const items = allShots.filter((shot) => shot?.b64);
  if (!items.length) {
    const metaRows: TableRow[] = allShots.map((shot, index) => [
      safeText(shot?.label, `Screenshot ${index + 1}`),
      safeText(shot?.format, "png"),
      safeText(shot?.width, "-"),
      safeText(shot?.height, "-"),
    ]);
    return {
      html: renderStandardPage(
        startingPage,
        companyName,
        `
          ${sectionHeading("G", "Appendix G: Evidence Screenshots")}
          ${metaRows.length
            ? `<p class="muted">Screenshot captures were generated but image bytes were not embedded in the final report payload.</p>${renderTable(["Label", "Format", "Width", "Height"], metaRows, { compact: true, emptyText: "No screenshot metadata available." })}`
            : `<p class="muted">No screenshots available.</p>`}
        `,
      ),
      pagesUsed: 1,
    };
  }

  const pages = items.map((shot, index) => {
    const label = safeText(shot?.label, `Screenshot ${index + 1}`);
    const format = safeText(shot?.format, "png").toLowerCase();
    const mime = format === "jpeg" || format === "jpg" ? "image/jpeg" : "image/png";
    const src = dataUriFromBase64(String(shot?.b64 || ""), mime);

    return renderStandardPage(
      startingPage + index,
      companyName,
      `
        ${index === 0 ? sectionHeading("G", "Appendix G: Evidence Screenshots") : ""}
        <div class="screenshot-title">${escapeHtml(label)}</div>
        <img class="screenshot-full" src="${src}" alt="${escapeHtml(label)}" />
      `,
    );
  });

  return { html: pages.join(""), pagesUsed: pages.length };
}

function buildHtml(report: BusinessGrowthReport): string {
  const rep = report as BusinessGrowthReport & Dict;
  const metadata = (rep.reportMetadata ?? {}) as Dict;
  const executiveSummary = (rep.executiveSummary ?? {}) as Dict;
  const websiteDigitalPresence = (rep.websiteDigitalPresence ?? {}) as Dict;
  const appendicesData = (rep.appendices ?? {}) as Dict;
  const meta = (rep.meta ?? {}) as Dict;
  const scoreMeta = (metadata.scoreMeta ?? {}) as Dict;
  const guidance = (meta.businessModelPromptGuidance ?? scoreMeta.businessModelPromptGuidance ?? {}) as Dict;
  const businessProfile = ((meta.businessProfile ?? scoreMeta.businessProfile ?? {}) as Dict);
  // Normalise business model label: prefer the prompt guidance string (which
  // already contains the human-readable label like "white label agency partner"),
  // then fall back to businessProfile.businessModel but convert snake_case → spaces.
  const _rawBusinessModel =
    guidance?.businessModel ||
    guidance?.label ||
    businessProfile?.businessModel ||
    businessProfile?.offerType ||
    "";
  const effectiveBusinessModel = safeText(
    String(_rawBusinessModel).replace(/_/g, " ").trim(),
    ""
  );
  const effectiveTargetMarket = safeText(businessProfile?.targetMarket, safeText(guidance?.targetMarket, ""));
  const effectiveLocation = safeText(businessProfile?.location, "");
  const sectionContexts = (meta.sectionContexts ?? {}) as Dict;

  const reportId = safeText(metadata.reportId, "BB-AI-REPORT");
  const companyName = safeText(metadata.companyName, "Company");
  const website = safeText(metadata.website, "N/A");
  const analysisDate = formatDate(metadata.analysisDate);
  const overallScore = scoreValue(metadata.overallScore);
  const confidenceScore = scoreValue(metadata.confidenceScore ?? rep?.confidenceScore ?? 0);
  const opportunityScore = scoreValue(metadata.opportunityScore ?? rep?.opportunityScore ?? 0);
  const riskScore = scoreValue(metadata.riskScore ?? rep?.riskScore ?? 0);
  const fonts = resolveFonts();

  const technicalSeo = websiteDigitalPresence.technicalSEO as Dict;
  const uxConversion = websiteDigitalPresence.uxConversion as Dict;
  const contentQuality = websiteDigitalPresence.contentQuality as Dict;
  const websiteHealth = websiteDigitalPresence.websiteHealth as Dict;
  const seoVisibility = (rep.seoVisibility ?? {}) as Dict;
  const reputation = (rep.reputation ?? {}) as Dict;
  const services = (rep.servicesPositioning ?? {}) as Dict;
  const leadGen = (rep.leadGeneration ?? {}) as Dict;
  const comp = (rep.competitiveAnalysis ?? {}) as Dict;
  const cost = (rep.costOptimization ?? {}) as Dict;
  const financial = (rep.financialImpact ?? {}) as Dict;
  const target = (rep.targetMarket ?? {}) as Dict;
  const crossSectionActionCandidates = collectCrossSectionActionCandidates([
    websiteDigitalPresence?.websiteKeywordAnalysis,
    contentQuality,
    reputation,
    leadGen,
    cost,
    target,
    financial,
  ]);
  const marketDemand = rep.marketDemand as Dict | undefined;
  const risks = (rep.riskAssessment ?? {}) as Dict;
  const advantages = (rep.competitiveAdvantages ?? {}) as Dict;
  const actionPlanRaw = rep.actionPlan90Days as any;
  const actionPlan = Array.isArray(actionPlanRaw) ? null : (actionPlanRaw as Dict);
  const appendices = appendicesData as Dict;

  const mentorSnapshot = executiveSummary.mentorSnapshot || executiveSummary.summary || websiteDigitalPresence.summary || rep?.summary;
  const biggestOpportunity = executiveSummary.biggestOpportunity || executiveSummary.primaryOpportunity || executiveSummary.keyOpportunity;
  const bottomLine = executiveSummary.bottomLine;

  const pageSpeed = technicalSeo?.pageSpeed as Maybe<WebsiteSpeedTest>;
  const speedRows = speedTestRows(pageSpeed || undefined);
  const speedOpportunities = extractSpeedOpportunities(pageSpeed || undefined);

  const quickWinsRows: TableRow[] = truthyArray<any>(executiveSummary.quickWins).map((item) => [
    item?.title,
    item?.impact,
    item?.time,
    item?.cost,
    item?.details,
  ]);

  const scoreSummaryRows: TableRow[] = [
    ["Website", metadata?.subScores?.website, "Technical foundation, content clarity, and UX"],
    ["SEO", metadata?.subScores?.seo, "Visibility, authority, and demand capture"],
    ["Reputation", metadata?.subScores?.reputation, "Trust strength and proof packaging"],
    ["Lead Gen", metadata?.subScores?.leadGen, "Acquisition channels, CTAs, and funnel readiness"],
    ["Services", metadata?.subScores?.services, "Offer clarity, positioning, and proof support"],
  ];

  const platformSource = truthyArray<any>(reputation?.summaryTable || reputation?.platforms || reputation?.reviewPlatforms);
  const platformRows: TableRow[] = platformSource.map((platform) => {
    const platformName = platform?.platform ?? platform?.name;
    const platformKey = String(platformName ?? "").toLowerCase();
    // DB stores the rating as `currentRating` (from the Python schema).
    // The PDF was only checking `platform.rating` which is always undefined,
    // producing "N/A" for every row including Google.
    const platformRating =
      platform?.currentRating ??   // Python schema field
      platform?.rating ??           // legacy / LLM-generated field
      platform?.averageRating ??
      null;
    const fallbackRating = (platformKey === "google" || platformKey === "google business profile")
      ? (platformRating ?? reputation?.reviewScore ?? reputation?.overallScore ?? reputation?.averageRating ?? "N/A")
      : (platformRating ?? "N/A");
    const reviewCount =
      platform?.reviewCount ??      // Python schema field
      platform?.reviews ??
      platform?.count ??
      platform?.totalReviews ??
      null;
    return [
      platformName,
      fallbackRating,
      reviewCount,
    ];
  });
  const totalReviewScore = reputation?.reviewScore ?? reputation?.overallScore ?? reputation?.averageRating;
  const totalReviewCount =
    reputation?.totalReviews ??
    platformSource.reduce((sum, p) => sum + (Number(p?.reviews ?? p?.reviewCount ?? p?.count ?? p?.totalReviews) || 0), 0);

  const servicesRows: TableRow[] = truthyArray<any>(services?.services).map((service) => [
    service?.name,
    service?.startingPrice,
    service?.targetMarket,
    service?.description,
  ]);

  const serviceGapRows: TableRow[] = truthyArray<any>(services?.serviceGaps).map((gap) => [
    gap?.service,
    gap?.youOffer,
    gap?.competitorA,
    gap?.competitorB,
    gap?.marketDemand,
  ]);

  const channelRows: TableRow[] = truthyArray<any>(leadGen?.channels).map((channel) => [
    channel?.channel,
    channel?.leadsPerMonth,
    channel?.quality,
    channel?.status,
    channel?.notes,
  ]);

  const missingChannelRows: TableRow[] = truthyArray<any>(leadGen?.missingHighROIChannels).map((channel) => [
    channel?.channel,
    channel?.status,
    channel?.potentialLeads ?? channel?.estimatedLeads,
    channel?.setupTime,
    channel?.monthlyCost,
    channel?.priority,
  ]);

  const leadMagnetRows: TableRow[] = truthyArray<any>(leadGen?.leadMagnets).map((magnet) => [
    magnet?.title ?? magnet?.name,
    magnet?.funnelStage ?? magnet?.format,
    magnet?.estimatedConversionRate ?? magnet?.estimatedConversion,
    magnet?.description ?? magnet?.targetAudience,
  ]);

  const positioningMatrixRows: TableRow[] = truthyArray<any>(comp?.positioningMatrix || comp?.competitiveMatrix).map((row) => [
    row?.dimension ?? row?.factor,
    row?.you,
    row?.competitorA ?? row?.compA,
    row?.competitorB ?? row?.compB,
    row?.competitorC ?? row?.compC,
    row?.notes ?? row?.winner,
  ]);

  const wasteRows: TableRow[] = truthyArray<any>(cost?.opportunities || cost?.wasteAreas || cost?.costSavingOpportunities).map((item) => [
    item?.title ?? item?.area ?? item?.opportunity,
    item?.description ?? item?.currentCost ?? item?.costPerMonth,
    item?.impact ?? item?.estimatedSavings ?? item?.fix ?? item?.potentialSavings,
    item?.effort ?? item?.implementationDifficulty ?? item?.confidence,
  ]);

  const targetCurrentRows: TableRow[] = collectTargetSegmentRows(target);

  const financialLeverRows: TableRow[] = collectFinancialLeverRows(financial);

  const riskRows: TableRow[] = truthyArray<any>(risks?.risks).map((risk) => [
    risk?.risk ?? risk?.name,
    risk?.severity,
    risk?.likelihood,
    risk?.mitigation,
  ]);

  const advantageRows: TableRow[] = buildAdvantageRows(advantages);

  const actionPlanRows: TableRow[] = (() => {
    if (Array.isArray(actionPlanRaw)) {
      const directList = truthyArray<any>(actionPlanRaw).map((item) => [
        item?.weekRange || item?.week,
        item?.title || item?.focus,
        normalizeStringList(item?.actions || item?.tasks).join("; "),
        item?.expectedOutcome,
      ]);
      if (directList.length) return directList;
    }

    const direct = truthyArray<any>(actionPlan?.weekByWeek || actionPlan?.weeks).map((item) => [
      item?.weekRange || item?.week,
      item?.title || item?.focus,
      normalizeStringList(item?.actions || item?.tasks).join("; "),
      item?.expectedOutcome,
    ]);
    if (direct.length) return direct;

    const phased = truthyArray<any>(rep?.actionPlan90Days).flatMap((phase) =>
      truthyArray<any>(phase?.weeks).map((item) => [
        item?.weekRange || item?.week,
        item?.title || phase?.phase,
        normalizeStringList(item?.tasks || item?.actions).join("; "),
        truthyArray<any>(phase?.expectedImpact)
          .map((impact) => [safeText(impact?.metric, ""), safeText(impact?.improvement, "")].filter(Boolean).join(": "))
          .filter(Boolean)
          .join("; ") || phase?.notes || "-",
      ]),
    );
    if (phased.length) return phased;

    return buildFallbackActionPlanRows(crossSectionActionCandidates);
  })();

  const appendixScoreRows: TableRow[] = truthyArray<any>(appendices?.scoreSummary).map((item) => [item?.area, item?.score, item?.notes]);

  const appendixEvidence = (appendicesData.evidence ?? {}) as Dict;
  const extractionSnapshot = (appendicesData.extractionSnapshot ?? appendixEvidence.extraction ?? appendixEvidence.extractionSnapshot ?? {}) as Dict;
  const crawlRegistrySummary = (appendicesData.crawlRegistrySummary ?? appendixEvidence.pageRegistry ?? appendixEvidence.crawlRegistrySummary ?? {}) as Dict;
  const keyPagesDetected = truthyArray<any>(
    appendicesData.keyPagesDetected || appendicesData.keyPages || appendixEvidence.keyPagesDetected || appendixEvidence.keyPages || [],
  );

  const extractionSnapshotRows: TableRow[] = [
    ["Site Type", extractionSnapshot.siteType ?? websiteDigitalPresence.siteType],
    ["Playwright Enabled", extractionSnapshot.playwrightEnabled],
    ["Selenium Enabled", extractionSnapshot.seleniumEnabled],
    ["Content Pages Used", extractionSnapshot.contentPagesUsed],
    ["Pages Crawled (sample)", normalizeStringList(extractionSnapshot.pagesCrawled).join("; ")],
  ].filter((row) => isMeaningful(row[1])) as TableRow[];

  const keyPageRows: TableRow[] = (() => {
    if (Array.isArray(keyPagesDetected) && keyPagesDetected.length) {
      return keyPagesDetected.map((item) => [item?.page ?? item?.label, item?.present, item?.primaryUrl ?? item?.url ?? item?.primary]);
    }
    const pagesObj = appendicesData.keyPagesDetected && typeof appendicesData.keyPagesDetected === "object" && !Array.isArray(appendicesData.keyPagesDetected)
      ? appendicesData.keyPagesDetected
      : appendixEvidence.keyPagesDetected && typeof appendixEvidence.keyPagesDetected === "object" && !Array.isArray(appendixEvidence.keyPagesDetected)
      ? appendixEvidence.keyPagesDetected
      : {};
    return Object.entries(pagesObj as Record<string, any>).map(([page, item]) => {
      const row = item && typeof item === "object" ? item : {};
      const present = row.present ?? row.servicesPagePresent ?? row.primary ? "Yes" : "No";
      return [page, present, row.primaryUrl ?? row.url ?? row.primary ?? "-"];
    });
  })();

  const crawlSummaryRows: TableRow[] = isMeaningful(crawlRegistrySummary)
    ? [[
        crawlRegistrySummary.mergedLinks,
        crawlRegistrySummary.crawl,
        crawlRegistrySummary.sitemap,
        crawlRegistrySummary.serviceCandidates,
        crawlRegistrySummary.contentPages,
      ]]
    : [];

  const marketDemandRows: TableRow[] = truthyArray<any>(marketDemand?.keywords).map((item) => [
    item?.keyword,
    item?.searchVolume,
    item?.cpc,
    item?.competitionIntensity ?? item?.competition,
    item?.demandScore,
  ]);

  const currentServiceMenu = truthyArray<any>(services?.services).length
    ? renderTable(["Service", "Starting Price", "Target Market", "Description"], servicesRows, { compact: true })
    : renderParagraph(services?.currentServiceMenu || services?.notes, "No services were mapped.");

  const css = `
    ${fonts.regular ? `@font-face { font-family: 'NotoSansCustom'; src: url('${fonts.regular}') format('truetype'); font-weight: 400; font-style: normal; }` : ""}
    ${fonts.bold ? `@font-face { font-family: 'NotoSansCustom'; src: url('${fonts.bold}') format('truetype'); font-weight: 700; font-style: normal; }` : ""}
    :root {
      --brand-purple: ${BRAND_PURPLE};
      --brand-coral: ${BRAND_CORAL};
      --brand-blue: ${BRAND_BLUE};
      --gray-900: ${GRAY_900};
      --gray-700: ${GRAY_700};
      --gray-500: ${GRAY_500};
      --gray-300: ${GRAY_300};
      --gray-200: ${GRAY_200};
      --gray-100: ${GRAY_100};
      --gray-50: ${GRAY_50};
    }

    * { box-sizing: border-box; }
    @page { size: A4; margin: 0; }

    html, body {
      margin: 0;
      padding: 0;
      background: white;
      color: var(--gray-900);
      font-family: ${fonts.embedded ? `'NotoSansCustom',` : ""} Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-size: 10.3pt;
      line-height: 1.4;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
      background: white;
    }

    .page:last-child { page-break-after: auto; }

    .page-shell {
      padding: 12mm 14mm 13mm;
      min-height: 297mm;
      position: relative;
    }

    .cover-shell {
      padding: 22mm 18mm 18mm;
      min-height: 297mm;
      position: relative;
    }

    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--gray-700);
      font-size: 9pt;
      padding-bottom: 3mm;
      border-bottom: 1px solid var(--gray-200);
      margin-bottom: 5mm;
      font-weight: 700;
    }

    .running-footer {
      position: absolute;
      left: 14mm;
      right: 14mm;
      bottom: 10mm;
      display: flex;
      justify-content: space-between;
      color: var(--gray-700);
      font-size: 8.7pt;
      border-top: 1px solid var(--gray-200);
      padding-top: 2mm;
    }

    .page-content {
      padding-bottom: 13mm;
    }

    .cover-title {
      margin: 0;
      font-size: 23pt;
      line-height: 1.06;
      letter-spacing: 0.2px;
      font-weight: 700;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: 1fr 68mm;
      gap: 12mm;
      margin-top: 8mm;
      align-items: start;
    }

    .cover-company {
      font-size: 15pt;
      font-weight: 700;
      margin: 6mm 0 3mm;
    }

    .cover-link {
      color: var(--brand-blue);
      margin: 0 0 6mm;
      word-break: break-word;
    }

    .cover-meta p {
      margin: 1.5mm 0;
    }

    .cover-score-box {
      border: 1px solid var(--gray-300);
      padding: 7mm 6mm;
    }

    .cover-score-label {
      font-size: 9pt;
      font-weight: 700;
      margin-bottom: 3mm;
    }

    .cover-score-main {
      font-size: 30pt;
      line-height: 1;
      font-weight: 700;
      margin-bottom: 1.5mm;
    }

    .score-strip {
      margin-top: 10mm;
      width: 70mm;
    }

    .score-strip-item {
      display: flex;
      justify-content: space-between;
      gap: 4mm;
      padding: 2.2mm 0;
      border-bottom: 1px solid var(--gray-200);
    }

    .score-strip-item:first-child {
      border-top: 1px solid var(--gray-200);
    }

    .score-strip-label {
      font-weight: 700;
      color: var(--gray-900);
    }

    .score-strip-value {
      font-weight: 700;
      color: var(--gray-900);
      white-space: nowrap;
    }

    .section-heading {
      display: flex;
      align-items: baseline;
      gap: 2mm;
      margin: 0 0 3.2mm;
      font-size: 15.5pt;
      font-weight: 700;
      color: var(--gray-900);
      break-after: avoid;
      page-break-after: avoid;
    }

    .section-number {
      display: inline-block;
      min-width: 10mm;
    }

    .subheading {
      font-size: 11pt;
      font-weight: 700;
      margin: 4mm 0 2mm;
      color: var(--gray-900);
      break-after: avoid;
      page-break-after: avoid;
    }

    p { margin: 1.4mm 0; }
    .muted { color: var(--gray-500); }

    .bullet-list {
      margin: 1.5mm 0 3mm 5mm;
      padding: 0;
    }

    .bullet-list li {
      margin: 1mm 0;
    }

    .callout {
      margin: 2.5mm 0 4mm;
    }

    .callout-title {
      font-weight: 700;
      margin-bottom: 1.3mm;
    }

    .section-signals {
      margin: 1.2mm 0 3mm;
      padding: 2.2mm 2.6mm;
      border: 1px solid var(--gray-200);
      background: var(--gray-50);
      font-size: 8.9pt;
      color: var(--gray-700);
    }

    .section-signals div + div {
      margin-top: 0.7mm;
    }

    .summary-metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm 5mm;
      margin: 3mm 0 5mm;
    }

    .summary-metric {
      border-bottom: 1px solid var(--gray-200);
      padding-bottom: 2mm;
    }

    .summary-metric-label {
      color: var(--gray-700);
      font-size: 9pt;
      margin-bottom: 0.7mm;
    }

    .summary-metric-value {
      font-weight: 700;
      font-size: 12pt;
    }

    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.8mm 0 4mm;
      table-layout: fixed;
      font-size: 9pt;
      break-inside: auto;
      page-break-inside: auto;
    }

    .report-table.compact {
      font-size: 8.6pt;
    }

    .report-table thead {
      display: table-header-group;
    }

    .report-table tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .report-table th,
    .report-table td {
      border: 1px solid var(--gray-200);
      padding: 2mm 2.1mm;
      vertical-align: top;
      word-break: break-word;
    }

    .report-table th {
      background: #fafafa;
      color: var(--gray-900);
      font-weight: 700;
      text-align: left;
    }

    .key-value-list {
      margin: 2mm 0 4mm;
      border-top: 1px solid var(--gray-200);
      border-bottom: 1px solid var(--gray-200);
    }

    .key-value-row {
      display: flex;
      gap: 4mm;
      justify-content: space-between;
      padding: 1.8mm 0;
      border-bottom: 1px solid var(--gray-100);
    }

    .key-value-row:last-child {
      border-bottom: 0;
    }

    .key-value-label {
      color: var(--gray-700);
      font-weight: 700;
    }

    .key-value-value {
      text-align: right;
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
      align-items: start;
    }

    .three-col {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4mm;
    }

    .recommendation-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3mm;
      margin: 2mm 0 4mm;
    }

    .recommendation-card {
      border: 1px solid var(--gray-200);
      background: #fcfcfd;
      padding: 3mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .recommendation-title {
      font-weight: 700;
      margin-bottom: 1.2mm;
      color: var(--gray-900);
    }

    .recommendation-subtitle {
      font-weight: 700;
      font-size: 9pt;
      margin-top: 2mm;
      margin-bottom: 1mm;
      color: var(--gray-700);
    }

    .recommendation-meta {
      color: var(--gray-700);
      font-size: 8.8pt;
      margin: 0.8mm 0;
    }

    .competitor-block, .appendix-block {
      margin: 0 0 4mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .competitor-name, .appendix-title {
      font-weight: 700;
      font-size: 10.5pt;
      margin-bottom: 1.5mm;
    }

    .screenshot-title {
      font-size: 13pt;
      font-weight: 700;
      margin-bottom: 4mm;
    }

    .screenshot-full {
      width: 100%;
      max-height: 245mm;
      object-fit: contain;
      border: 1px solid var(--gray-200);
    }
  `;

  const pages: string[] = [];
  let pageNo = 1;

  pages.push(`
    <section class="page">
      <div class="cover-shell">
        <h1 class="cover-title">AI BUSINESS GROWTH</h1>
        <h1 class="cover-title">ANALYZER REPORT</h1>
        <div class="cover-grid">
          <div>
            <div class="cover-company">${escapeHtml(companyName)}</div>
            <div class="cover-link">${escapeHtml(website)}</div>
            <div class="cover-meta">
              <p><strong>Analysis Date:</strong> ${escapeHtml(analysisDate)}</p>
              <p><strong>Report ID:</strong> ${escapeHtml(reportId)}</p>
              ${isMeaningful(effectiveBusinessModel) ? `<p><strong>Business Model:</strong> ${escapeHtml(effectiveBusinessModel)}</p>` : ""}
              ${isMeaningful(effectiveTargetMarket || effectiveLocation) ? `<p><strong>Commercial Context:</strong> ${escapeHtml([safeText(effectiveTargetMarket, ""), safeText(effectiveLocation, "")].filter(Boolean).join(" • "))}</p>` : ""}
            </div>
            ${!fonts.embedded ? `<p class="muted" style="margin-top:6mm;">Embedded Unicode fonts were not found in assets/fonts. Add NotoSans-Regular.ttf and NotoSans-Bold.ttf for best ₹ and multi-viewer support.</p>` : ""}
          </div>
          <div>
            <div class="cover-score-box">
              <div class="cover-score-label">Overall Score</div>
              <div class="cover-score-main">${escapeHtml(overallScore)}/100</div>
            </div>
            ${renderScoreStrip([
              { label: "Confidence Score", value: confidenceScore },
              { label: "Opportunity Score", value: opportunityScore },
              { label: "Risk Score", value: riskScore },
            ])}
          </div>
        </div>
      </div>
    </section>
  `);

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("1", "Executive Summary")}
        ${renderCallout("Biggest Opportunity", biggestOpportunity)}
        ${subsectionHeading("Key Strengths")}
        ${renderBulletLines(rep.executiveSummary?.strengths, "No strengths were mapped.")}
        ${subsectionHeading("Critical Weaknesses")}
        ${renderBulletLines(rep.executiveSummary?.weaknesses, "No weaknesses were mapped.")}
        ${subsectionHeading("Category Score / 100")}
        ${renderTable(["Category", "Score", "What it means"], scoreSummaryRows, { compact: true })}
        ${renderKeyValueRows([
          { label: "Confidence Score", value: `${confidenceScore}/100` },
          { label: "Opportunity Score", value: `${opportunityScore}/100` },
          { label: "Risk Score", value: `${riskScore}/100` },
        ])}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("2", "Website & Digital Presence Analysis")}
        ${renderCallout("Mentor Notes", websiteDigitalPresence?.mentorNotes)}
        ${renderParagraph(websiteDigitalPresence.summary)}
        ${renderKeyValueRows([{ label: "Technical SEO Score", value: `${scoreValue(technicalSeo?.score)}/100` }])}
        ${renderBulletLines(technicalSeo?.highlights, "No technical SEO highlights available.")}
        ${subsectionHeading("Issues Found")}
        ${renderBulletLines(technicalSeo?.issues, "No technical SEO issues listed.")}
        ${subsectionHeading("Page Speed & Core Web Vitals (Real Test)")}
        ${renderTable(["Strategy", "Perf", "SEO", "LCP", "CLS", "TBT", "Speed Index"], speedRows, { compact: true, emptyText: "PageSpeed data not available." })}
        ${subsectionHeading("Highest-Impact Speed Opportunities")}
        ${renderBulletLines(speedOpportunities, "No PageSpeed opportunities were mapped.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("2.2", "Website Keyword Alignment")}
        ${renderKeyValueRows([{ label: "Website Keyword Score", value: `${scoreValue(websiteDigitalPresence?.websiteKeywordAnalysis?.score)}/100` }])}
        ${renderParagraph(websiteDigitalPresence?.websiteKeywordAnalysis?.meaning)}
        ${subsectionHeading("Strengths")}
        ${renderBulletLines(websiteDigitalPresence?.websiteKeywordAnalysis?.strengths, "No keyword strengths mapped.")}
        ${subsectionHeading("Keyword Gaps")}
        ${renderBulletLines(websiteDigitalPresence?.websiteKeywordAnalysis?.gaps, "No keyword gaps mapped.")}
        ${subsectionHeading("Keywords Breakdown")}
        ${renderTable(["Metric", "Score"],Object.entries((websiteDigitalPresence?.websiteKeywordAnalysis?.breakdown || {})as Record<string, number>).map(([key, value]) => [key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()),value]),{ compact: true })}
        ${subsectionHeading("Keyword Opportunities")}
        ${renderTable(["Keyword", "Intent", "Coverage", "Priority"],((websiteDigitalPresence?.websiteKeywordAnalysis?.opportunities || []) as Array<{keyword?: string;intent?: string;currentCoverage?: string;priority?: string;}>).map((op) => [op.keyword ?? "-",capitalize(op.intent),capitalize(op.currentCoverage),capitalize(op.priority),]),{ compact: true, emptyText: "No keyword opportunities identified." })}
        ${subsectionHeading("Recommended Fixes")}
        ${renderBulletLines(websiteDigitalPresence?.websiteKeywordAnalysis?.recommendations, "No keyword fixes mapped.")}
        ${subsectionHeading("Implementation-Ready Recommendations")}
        ${renderRecommendationDetails(websiteDigitalPresence?.websiteKeywordAnalysis?.recommendationDetails, "No structured keyword recommendations available.")}
        ${subsectionHeading("Priority Keyword Actions")}
        ${renderActionCandidates(websiteDigitalPresence?.websiteKeywordAnalysis?.actionCandidates, "No keyword action candidates available.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("2.3", "Content Quality Assessment")}
        ${renderKeyValueRows([{ label: "Content Quality Score", value: `${scoreValue(contentQuality?.score)}/100` }])}
        ${renderBulletLines(contentQuality?.strengths, "No content strengths listed.")}
        ${subsectionHeading("Gaps")}
        ${renderBulletLines(
          // Prefer seoVisibility keyword gaps > websiteDigitalPresence contentGaps
          // > contentQuality.weaknesses. The old code used contentQuality.weaknesses
          // first, which is usually empty, producing "No content gaps listed."
          // even when richer data existed elsewhere in the report.
          firstNonEmptyArray(
            websiteDigitalPresence?.websiteKeywordAnalysis?.keywordGaps,
            websiteDigitalPresence?.contentGaps,
            contentQuality?.weaknesses,
            contentQuality?.gaps,
          ),
          "No content gaps listed."
        )}
        ${subsectionHeading("Recommendations")}
        ${renderBulletLines(contentQuality?.recommendations || websiteDigitalPresence?.contentGaps, "No recommendations listed.")}
        ${subsectionHeading("Implementation-Ready Recommendations")}
        ${renderRecommendationDetails(contentQuality?.recommendationDetails, "No structured content recommendations available.")}
        ${subsectionHeading("Priority Content Actions")}
        ${renderActionCandidates(contentQuality?.actionCandidates, "No content action candidates available.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("2.4", "UX & Conversion Optimization")}
        ${renderKeyValueRows([{ label: "UX/Conversion Score", value: `${scoreValue(uxConversion?.score)}/100` }])}
        ${renderBulletLines(uxConversion?.highlights, "No UX highlights listed.")}
        ${subsectionHeading("Issues Holding Back Conversions")}
        ${renderBulletLines(uxConversion?.issues, "No UX issues listed.")}
        ${renderParagraph(uxConversion?.estimatedUplift ? `Estimated Uplift: ${uxConversion.estimatedUplift}` : "")}
        ${subsectionHeading("UI/UX Micro-Audit (Homepage)")}
        ${renderTable(
          ["Metric", "Value"],
          truthyArray<any>(Object.entries(uxConversion?.microAudit || websiteDigitalPresence.microAudit || {})).map(([k, v]) => [k, safeText(v, "-")]),
          { compact: true, emptyText: "Micro-audit data not available." },
        )}
        ${subsectionHeading("Top UX Fixes")}
        ${renderBulletLines(uxConversion?.recommendations || [], "No UX fixes listed.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("2.5", "Content Gaps")}
        ${renderBulletLines(
          firstNonEmptyArray(
            websiteDigitalPresence?.websiteKeywordAnalysis?.keywordGaps,
            websiteDigitalPresence?.contentGaps,
            contentQuality?.gaps,
            contentQuality?.weaknesses,
          ),
          "No content gaps available."
        )}
      `,
    ),
  );

  // pages.push(
  //   renderStandardPage(
  //     pageNo++,
  //     companyName,
  //     `
  //       ${sectionHeading("3", "SEO & Organic Visibility")}
  //       ${renderKeyValueRows([{ label: "Domain Authority Score", value: `${scoreValue((seoVisibility?.domainAuthority as Dict)?.score)}/100` }])}
  //       ${subsectionHeading("Backlinks")}
  //       ${renderTable(
  //         ["Metric", "Value"],
  //         [
  //           ["Total Backlinks", seoVisibility?.backlinks?.totalBacklinks],
  //           ["Referring Domains", seoVisibility?.backlinks?.referringDomains],
  //           ["Link Quality Score", seoVisibility?.backlinks?.linkQualityScore],
  //         ],
  //         { compact: true, emptyText: "No backlink summary available." },
  //       )}
  //     `,
  //   ),
  // );

//   pages.push(
//   renderStandardPage(
//     pageNo++,
//     companyName,
//     `
//       ${sectionHeading("3", "SEO & Organic Visibility")}
//       ${renderCallout("Mentor Notes", seoVisibility?.mentorNotes)}

//       ${renderKeyValueRows([
//         { label: "Domain Authority Score", value: `${scoreValue((seoVisibility?.domainAuthority as Dict)?.score)}/100` },
//         { label: "Industry Average", value: seoVisibility?.domainAuthority?.benchmark?.industryAvg },
//         { label: "Industry Range", value: seoVisibility?.domainAuthority?.benchmark?.industryAverageRange },
//       ])}

//       ${subsectionHeading("Domain Authority Benchmark")}
//       ${renderTable(
//         ["Benchmark", "Value"],
//         [
//           ["You", seoVisibility?.domainAuthority?.benchmark?.you],
//           ["Industry Avg", seoVisibility?.domainAuthority?.benchmark?.industryAvg],
//           ["Industry Range", seoVisibility?.domainAuthority?.benchmark?.industryAverageRange],
//         ],
//         { compact: true, emptyText: "No domain authority benchmark available." },
//       )}
//       ${renderParagraph(seoVisibility?.domainAuthority?.whyItMatters)}
//       ${renderParagraph(seoVisibility?.domainAuthority?.benchmarkSummary)}
//       ${renderParagraph(seoVisibility?.domainAuthority?.notes)}

//       ${subsectionHeading("Domain Authority Competitors")}
//       ${renderTable(
//         ["Competitor", "Score", "Note"],
//         truthyArray<any>(seoVisibility?.domainAuthority?.benchmark?.competitors).map((item) => [
//           item?.name,
//           item?.score,
//           item?.note,
//         ]),
//         { compact: true, emptyText: "No domain authority competitor data available." },
//       )}

//       ${subsectionHeading("Backlinks")}
//       ${renderTable(
//         ["Metric", "Value"],
//         [
//           ["Total Backlinks", seoVisibility?.backlinks?.totalBacklinks],
//           ["Referring Domains", seoVisibility?.backlinks?.referringDomains],
//           ["Link Quality Score", seoVisibility?.backlinks?.linkQualityScore],
//           ["Dofollow Ratio", seoVisibility?.backlinks?.dofollowRatio ? `${seoVisibility?.backlinks?.dofollowRatio}%` : "-"],
//           ["Quality Summary", seoVisibility?.backlinks?.qualitySummary],
//           ["Anchor Mix Summary", seoVisibility?.backlinks?.anchorMixSummary],
//         ],
//         { compact: true, emptyText: "No backlink summary available." },
//       )}
//       ${renderParagraph(seoVisibility?.backlinks?.profileCommentary)}
//       ${renderParagraph(seoVisibility?.backlinks?.recommendation)}
//       ${renderParagraph(seoVisibility?.backlinks?.notes)}

//       ${subsectionHeading("Backlink Competitor Comparison")}
//       ${renderTable(
//         ["Competitor", "Backlinks", "Referring Domains", "Note"],
//         truthyArray<any>(seoVisibility?.backlinks?.competitorComparison).map((item) => [
//           item?.name,
//           item?.backlinks,
//           item?.domains,
//           item?.note,
//         ]),
//         { compact: true, emptyText: "No backlink competitor comparison available." },
//       )}

//       ${subsectionHeading("Keyword Rankings")}
//       ${renderTable(
//         ["Metric", "Value"],
//         [
//           ["Total Ranking Keywords", seoVisibility?.keywordRankings?.totalRankingKeywords],
//           ["Top 3", seoVisibility?.keywordRankings?.top3],
//           ["Top 10", seoVisibility?.keywordRankings?.top10],
//           ["Top 100", seoVisibility?.keywordRankings?.top100],
//           ["Visible Keyword Count", seoVisibility?.keywordRankings?.competitorBenchmark?.visibleKeywordCount],
//           ["Competitor Owned Gaps", seoVisibility?.keywordRankings?.competitorBenchmark?.competitorOwnedGaps],
//           ["Strongest SEO Competitor", seoVisibility?.keywordRankings?.competitorBenchmark?.strongestSeoCompetitor],
//         ],
//         { compact: true, emptyText: "No keyword ranking summary available." },
//       )}
//       ${renderParagraph(seoVisibility?.keywordRankings?.competitorBenchmark?.gapSummary)}
//       ${renderParagraph(seoVisibility?.keywordRankings?.opportunitySummary)}
//       ${renderParagraph(seoVisibility?.keywordRankings?.notes)}

//       ${subsectionHeading("Top Ranking Keywords")}
//       ${renderTable(
//         ["Keyword", "Your Rank", "Intent", "Priority", "Monthly Searches", "Top Competitor"],
//         truthyArray<any>(seoVisibility?.keywordRankings?.topRankingKeywords).map((item) => [
//           item?.keyword,
//           item?.yourRank ?? item?.rank ?? item?.rankingStatus,
//           capitalize(item?.intent),
//           capitalize(item?.priority),
//           item?.monthlySearches,
//           item?.topCompetitor,
//         ]),
//         { compact: true, emptyText: "No top ranking keyword data available." },
//       )}

//       ${subsectionHeading("Missing High-Value Keywords")}
//       ${renderTable(
//         ["Keyword", "Intent", "Priority", "Your Rank", "Top Competitor", "Monthly Searches"],
//         truthyArray<any>(seoVisibility?.keywordRankings?.missingHighValueKeywords).map((item) => [
//           item?.keyword,
//           capitalize(item?.intent),
//           capitalize(item?.priority),
//           item?.yourRank,
//           item?.topCompetitor,
//           item?.monthlySearches,
//         ]),
//         { compact: true, emptyText: "No missing high-value keywords available." },
//       )}

//       ${subsectionHeading("Keyword Distribution")}
//       ${renderTable(
//         ["Category", "Keywords"],
//         [
//           ["High Priority", normalizeStringList(seoVisibility?.keywordRankings?.byPriority?.high).join(", ") || "-"],
//           ["Medium Priority", normalizeStringList(seoVisibility?.keywordRankings?.byPriority?.medium).join(", ") || "-"],
//           ["Low Priority", normalizeStringList(seoVisibility?.keywordRankings?.byPriority?.low).join(", ") || "-"],
//           ["Brand", normalizeStringList(seoVisibility?.keywordRankings?.byIntent?.brand).join(", ") || "-"],
//           ["Commercial", normalizeStringList(seoVisibility?.keywordRankings?.byIntent?.commercial).join(", ") || "-"],
//           ["Local", normalizeStringList(seoVisibility?.keywordRankings?.byIntent?.local).join(", ") || "-"],
//         ],
//         { compact: true, emptyText: "No keyword distribution data available." },
//       )}

//       ${subsectionHeading("Direct Competitor Comparison")}
//       ${renderTable(
//         ["Domain", "Overlap Score", "Type"],
//         truthyArray<any>(seoVisibility?.competitorComparison?.directCompetitors).map((item) => [
//           item?.domain,
//           item?.overlapScore,
//           item?.type,
//         ]),
//         { compact: true, emptyText: "No direct competitor comparison available." },
//       )}

//       ${subsectionHeading("Local SEO")}
//       ${renderTable(
//         ["Metric", "Value"],
//         [
//           ["Priority", seoVisibility?.localSeo?.priority],
//           ["Local SEO Score", seoVisibility?.localSeo?.score],
//           ["Primary Channel", seoVisibility?.localSeo?.isPrimaryChannel],
//           ["GBP Status", seoVisibility?.localSeo?.gbpStatus],
//           ["Reviews Summary", seoVisibility?.localSeo?.reviewsSummary],
//           ["Directory Gap Summary", seoVisibility?.localSeo?.directoryGapSummary],
//         ],
//         { compact: true, emptyText: "No local SEO summary available." },
//       )}

//       ${subsectionHeading("Current Listings")}
//       ${renderBulletLines(
//         truthyArray<any>(seoVisibility?.localSeo?.currentListings).map((item) => safeText(item)),
//         "No current listings available.",
//       )}

//       ${subsectionHeading("Missing Listings")}
//       ${renderBulletLines(
//         truthyArray<any>(seoVisibility?.localSeo?.missingListings).map((item) => safeText(item)),
//         "No missing listings available.",
//       )}

//       ${subsectionHeading("Local SEO Issues")}
//       ${renderBulletLines(seoVisibility?.localSeo?.issues, "No local SEO issues listed.")}
//       ${subsectionHeading("Local Ranking Gaps")}
//       ${renderBulletLines(seoVisibility?.localSeo?.localRankingGaps, "No local ranking gaps listed.")}
//       ${renderParagraph(seoVisibility?.localSeo?.businessImpact)}
//       ${renderParagraph(seoVisibility?.localSeo?.notes)}

//       ${subsectionHeading("Priority SEO Actions")}
//       ${renderBulletLines(seoVisibility?.priorityActions, "No SEO priority actions available.")}
//     `,
//   ),
// );

pages.push(
  renderStandardPage(
    pageNo++,
    companyName,
    `
      ${sectionHeading("3", "SEO & Organic Visibility")}
      ${renderSectionSignals(sectionContexts?.seoVisibility)}
      ${renderCallout("Mentor Notes", seoVisibility?.mentorNotes)}

      ${renderKeyValueRows([
        { label: "Domain Authority Score", value: `${scoreValue((seoVisibility?.domainAuthority as Dict)?.score)}/100` },
        { label: "Industry Average", value: seoVisibility?.domainAuthority?.benchmark?.industryAvg },
        { label: "Industry Range", value: seoVisibility?.domainAuthority?.benchmark?.industryAverageRange },
        { label: "Local SEO Score", value: scoreValue((seoVisibility?.localSeo || seoVisibility?.localSEO || {})?.score) },
      ])}

      ${subsectionHeading("Domain Authority Benchmark")}
      ${renderTable(
        ["Benchmark", "Value"],
        [
          ["You", seoVisibility?.domainAuthority?.benchmark?.you],
          ["Industry Avg", seoVisibility?.domainAuthority?.benchmark?.industryAvg],
          ["Industry Range", seoVisibility?.domainAuthority?.benchmark?.industryAverageRange],
        ],
        { compact: true, emptyText: "No domain authority benchmark available." },
      )}
      ${renderParagraph(seoVisibility?.domainAuthority?.whyItMatters)}
      ${renderParagraph(seoVisibility?.domainAuthority?.benchmarkSummary)}
      ${renderParagraph(seoVisibility?.domainAuthority?.notes)}

      ${subsectionHeading("Domain Authority Competitors")}
      ${renderTable(
        ["Competitor", "Score", "Note"],
        truthyArray<any>(seoVisibility?.domainAuthority?.benchmark?.competitors).map((item) => [
          item?.name,
          item?.score,
          item?.note,
        ]),
        { compact: true, emptyText: "No domain authority competitor data available." },
      )}

      ${subsectionHeading("Backlinks")}
      ${renderTable(
        ["Metric", "Value"],
        [
          ["Total Backlinks", (seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.totalBacklinks],
          ["Referring Domains", (seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.referringDomains],
          ["Link Quality Score", (seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.linkQualityScore],
          ["Dofollow Ratio", isMeaningful((seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.dofollowRatio) ? `${(seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.dofollowRatio}%` : "-"],
          ["Quality Summary", (seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.qualitySummary],
          ["Anchor Mix Summary", (seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.anchorMixSummary],
        ],
        { compact: true, emptyText: "No backlink summary available." },
      )}
      ${renderParagraph((seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.profileCommentary)}
      ${renderParagraph((seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.recommendation)}
      ${renderParagraph((seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.notes)}

      ${subsectionHeading("Backlink Competitor Comparison")}
      ${renderTable(
        ["Competitor", "Backlinks", "Referring Domains", "Note"],
        truthyArray<any>((seoVisibility?.backlinks || seoVisibility?.backlinkProfile)?.competitorComparison).map((item) => [
          item?.name,
          item?.backlinks,
          item?.domains,
          item?.note,
        ]),
        { compact: true, emptyText: "No backlink competitor comparison available." },
      )}

      ${subsectionHeading("Keyword Rankings")}
      ${renderTable(
        ["Metric", "Value"],
        [
          ["Total Ranking Keywords", seoVisibility?.keywordRankings?.totalRankingKeywords],
          ["Top 3", seoVisibility?.keywordRankings?.top3],
          ["Top 10", seoVisibility?.keywordRankings?.top10],
          ["Top 100", seoVisibility?.keywordRankings?.top100],
          ["Visible Keyword Count", seoVisibility?.keywordRankings?.competitorBenchmark?.visibleKeywordCount],
          ["Competitor Owned Gaps", seoVisibility?.keywordRankings?.competitorBenchmark?.competitorOwnedGaps],
          ["Strongest SEO Competitor", seoVisibility?.keywordRankings?.competitorBenchmark?.strongestSeoCompetitor],
        ],
        { compact: true, emptyText: "No keyword ranking summary available." },
      )}
      ${renderParagraph(seoVisibility?.keywordRankings?.competitorBenchmark?.gapSummary)}
      ${renderParagraph(seoVisibility?.keywordRankings?.opportunitySummary || seoVisibility?.opportunitySummary)}
      ${renderParagraph(seoVisibility?.keywordRankings?.notes)}

      ${subsectionHeading("Missing High-Value Keywords")}
      ${renderTable(
        ["Keyword", "Intent", "Priority", "Your Rank", "Top Competitor", "Monthly Searches"],
        truthyArray<any>(seoVisibility?.keywordRankings?.missingHighValueKeywords).map((item) => [
          item?.keyword,
          capitalize(item?.intent),
          capitalize(item?.priority),
          item?.yourRank,
          item?.topCompetitor,
          item?.monthlySearches,
        ]),
        { compact: true, emptyText: "No missing high-value keywords available." },
      )}

      ${subsectionHeading("Direct Competitor Comparison")}
      ${renderTable(
        ["Domain", "Overlap Score", "Type"],
        truthyArray<any>(seoVisibility?.competitorComparison?.directCompetitors).map((item) => [
          item?.domain,
          item?.overlapScore,
          item?.type,
        ]),
        { compact: true, emptyText: "No direct competitor comparison available." },
      )}

      ${subsectionHeading("Local SEO")}
      ${renderTable(
        ["Metric", "Value"],
        [
          ["Priority", (seoVisibility?.localSeo || seoVisibility?.localSEO)?.priority],
          ["Local SEO Score", (seoVisibility?.localSeo || seoVisibility?.localSEO)?.score],
          ["Primary Channel", (seoVisibility?.localSeo || seoVisibility?.localSEO)?.isPrimaryChannel],
          ["GBP Status", (seoVisibility?.localSeo || seoVisibility?.localSEO)?.gbpStatus],
          ["Reviews Summary", (seoVisibility?.localSeo || seoVisibility?.localSEO)?.reviewsSummary],
          ["Directory Gap Summary", (seoVisibility?.localSeo || seoVisibility?.localSEO)?.directoryGapSummary],
        ],
        { compact: true, emptyText: "No local SEO summary available." },
      )}

      ${subsectionHeading("Current Listings")}
      ${renderBulletLines(
        truthyArray<any>((seoVisibility?.localSeo || seoVisibility?.localSEO)?.currentListings).map((item) => safeText(item)),
        "No current listings available.",
      )}

      ${subsectionHeading("Missing Listings")}
      ${renderBulletLines(
        truthyArray<any>((seoVisibility?.localSeo || seoVisibility?.localSEO)?.missingListings).map((item) => safeText(item)),
        "No missing listings available.",
      )}

      ${subsectionHeading("Local SEO Issues")}
      ${renderBulletLines((seoVisibility?.localSeo || seoVisibility?.localSEO)?.issues, "No local SEO issues listed.")}

      ${subsectionHeading("Local Ranking Gaps")}
      ${renderBulletLines((seoVisibility?.localSeo || seoVisibility?.localSEO)?.localRankingGaps, "No local ranking gaps listed.")}
      ${renderParagraph((seoVisibility?.localSeo || seoVisibility?.localSEO)?.businessImpact || (seoVisibility?.localSeo || seoVisibility?.localSEO)?.impact)}
      ${renderParagraph((seoVisibility?.localSeo || seoVisibility?.localSEO)?.notes)}

      ${subsectionHeading("Priority SEO Actions")}
      ${renderBulletLines(seoVisibility?.priorityActions, "No SEO priority actions available.")}
    `,
  ),
);

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("4", "Reputation & Social Proof Audit")}
        ${renderKeyValueRows([
          { label: "Overall Review Score", value: isMeaningful(totalReviewScore) ? `${safeText(totalReviewScore)}/5` : "N/A" },
          { label: "Total Reviews Found", value: totalReviewCount },
        ])}
        ${renderParagraph(reputation?.notes || "Based on publicly available review platforms detected during analysis.")}
        ${subsectionHeading("Platform Reviews")}
        ${renderTable(["Platform", "Rating", "Reviews"], platformRows, { compact: true, emptyText: "No platform review data available." })}
        ${renderCallout("Industry Standard Benchmark", reputation?.industryStandardRange || reputation?.industryBenchmark || reputation?.benchmark)}
        ${renderCallout("Your Gap", reputation?.yourGap || reputation?.gap)}
        ${subsectionHeading("Positive Themes")}
        ${renderBulletLines(reputation?.sentimentThemes?.positive ?? reputation?.sentiment?.positives, "No positive themes detected.")}
        ${subsectionHeading("Negative Themes")}
        ${renderBulletLines(reputation?.sentimentThemes?.negative ?? reputation?.sentiment?.negatives, "No negative themes detected.")}
        ${renderParagraph(`Response Rate: ${safeText(reputation?.sentimentThemes?.responseRate ?? reputation?.sentiment?.responseRate, "N/A")} - Avg Response Time: ${safeText(reputation?.sentimentThemes?.averageResponseTime ?? reputation?.sentiment?.avgResponseTime, "N/A")}`)}
        ${subsectionHeading("Implementation-Ready Recommendations")}
        ${renderRecommendationDetails(reputation?.recommendationDetails, "No structured reputation recommendations available.")}
        ${subsectionHeading("Priority Reputation Actions")}
        ${renderActionCandidates(reputation?.actionCandidates, "No reputation action candidates available.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("5", "Service Offerings & Market Positioning")}
        ${renderCallout("Mentor Notes", services?.mentorNotes)}
        ${subsectionHeading("Current Service Menu")}
        ${currentServiceMenu}
        ${subsectionHeading("Industries Served")}
        ${renderBulletLines(services?.industriesServed?.current, "No industries detected.")}
        ${renderCallout("Positioning Snapshot", services?.positioning?.currentStatement || services?.notes)}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("6", "Lead Generation & Acquisition Channels")}
        ${renderCallout("Mentor Notes", leadGen?.mentorNotes)}
        ${subsectionHeading("Current Channels")}
        ${renderTable(["Channel", "Leads / Month", "Quality", "Status", "Notes"], channelRows, { compact: true, emptyText: "No channels available." })}
        ${subsectionHeading("Lead Magnets")}
        ${renderTable(["Title", "Funnel Stage", "Estimated Conversion", "Description"], leadMagnetRows, { compact: true, emptyText: "No lead magnets listed." })}
        ${subsectionHeading("Missing High-ROI Channels")}
        ${renderTable(["Channel", "Status", "Potential Leads", "Setup Time", "Monthly Cost", "Priority"], missingChannelRows, { compact: true, emptyText: "No missing high-ROI channels listed." })}
        ${subsectionHeading("Implementation-Ready Recommendations")}
        ${renderRecommendationDetails(leadGen?.recommendationDetails, "No structured lead-generation recommendations available.")}
        ${subsectionHeading("Priority Lead-Generation Actions")}
        ${renderActionCandidates(leadGen?.actionCandidates, "No lead-generation action candidates available.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("7", "Competitive Analysis")}
        ${renderSectionSignals(sectionContexts?.competitiveAnalysis)}
        ${renderCallout("Mentor Notes", comp?.mentorNotes || comp?.notes)}
        ${renderCompetitorCards(comp?.competitors)}
        ${subsectionHeading("Positioning Matrix")}
        ${renderTable(["Dimension", "You", "Competitor A", "Competitor B", "Competitor C", "Notes / Winner"], positioningMatrixRows, { compact: true, emptyText: "No positioning matrix available." })}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("8", "Cost Optimization & Profitability")}
        ${renderSectionSignals(sectionContexts?.costOptimization)}
        ${renderCallout("Mentor Notes", cost?.mentorNotes || cost?.notes)}
        ${renderParagraph(cost?.estimationDisclaimer)}
        ${renderKeyValueRows([{ label: "Confidence Score", value: `${scoreValue(cost?.confidenceScore)}/100` }])}
        ${subsectionHeading("Scenarios")}
        ${renderTable(
          ["Scenario", "Suggestion", "Modeled Outcomes"],
          truthyArray<any>(cost?.scenarios).map((item) => [
            item?.name,
            normalizeStringList(item?.assumptions).join("; "),
            truthyArray<any>(item?.modeledOutcomes || item?.outcomes)
              .map((outcome) => `${safeText(outcome?.label, "Metric")}: ${safeText(outcome?.value, "N/A")}`)
              .join("; "),
          ]),
          { compact: true, emptyText: "Cost scenarios not available." },
        )}
        ${subsectionHeading("Opportunities")}
        ${renderTable(["Opportunity", "Description", "Impact", "Effort"], wasteRows, { compact: true, emptyText: "No waste areas mapped." })}
        ${subsectionHeading("Priority Profitability Actions")}
        ${renderActionCandidates(cost?.actionCandidates, "No profitability action candidates available.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("9", "Target Market & Client Segmentation")}
        ${renderSectionSignals(sectionContexts?.targetMarket)}
        ${renderParagraph(target?.estimationDisclaimer)}
        ${renderKeyValueRows([{ label: "Confidence Score", value: `${scoreValue(target?.confidenceScore)}/100` }])}
        ${subsectionHeading("Scenarios")}
        ${renderTable(
          ["Scenario", "Suggestion", "Modeled Outcomes"],
          truthyArray<any>(target?.scenarios).map((item) => [
            item?.name,
            normalizeStringList(item?.assumptions).join("; "),
            truthyArray<any>(item?.modeledOutcomes || item?.outcomes)
              .map((outcome) => `${safeText(outcome?.label, "Metric")}: ${safeText(outcome?.value, "N/A")}`)
              .join("; "),
          ]),
          { compact: true, emptyText: "Target market scenarios not available." },
        )}
        ${subsectionHeading("Detected Segments")}
        ${renderTable(["Segment", "Pain Points", "Budget / Notes"], targetCurrentRows, { compact: true, emptyText: "No target segments were provided." })}
        ${subsectionHeading("Priority Target-Market Actions")}
        ${renderActionCandidates(target?.actionCandidates, "No target-market action candidates available.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("10", "Financial Impact")}
        ${renderSectionSignals(sectionContexts?.financialImpact)}
        ${renderCallout("Disclaimer", financial?.estimationDisclaimer)}
        ${renderKeyValueRows([
          { label: "Current Revenue Estimate", value: financial?.currentRevenueEstimate },
          { label: "Improvement Potential", value: financial?.improvementPotential },
          { label: "Projected Increase", value: financial?.projectedRevenueIncrease },
          { label: "Confidence Score", value: `${scoreValue(financial?.confidenceScore)}/100` },
        ])}
        ${subsectionHeading("Revenue & Profitability Summary")}
        ${renderParagraph(financial?.summary)}
        ${subsectionHeading("Financial Levers")}
        ${renderTable(["Lever", "Impact", "Effort / Confidence", "Notes"], financialLeverRows, { compact: true, emptyText: "No profitability levers available." })}
        ${subsectionHeading("Priority Financial Actions")}
        ${renderActionCandidates(financial?.actionCandidates, "No financial action candidates available.")}
        ${marketDemand ? `${subsectionHeading("Market Demand & Search Opportunity")}${renderTable(["Keyword", "Search Volume", "CPC", "Competition", "Demand Score"], marketDemandRows, { compact: true, emptyText: "No market demand keywords available." })}` : ""}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("11", "90-Day Action Plan")}
        ${renderTable(["Week", "Focus", "Actions", "Expected Outcome"], actionPlanRows, { compact: true, emptyText: "No 90-day action plan was generated for this report." })}
        ${subsectionHeading("Top Cross-Section Priorities")}
        ${renderActionCandidates(crossSectionActionCandidates, "No cross-section action candidates were generated.")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("12", "Competitive Advantages to Leverage")}
        ${renderTable(["Advantage", "Why It Matters", "How To Leverage"], advantageRows, { compact: true, emptyText: "No competitive advantages were mapped." })}
        ${sectionHeading("13", "Risk Assessment")}
        ${renderTable(["Risk", "Severity", "Likelihood", "Mitigation"], riskRows, { compact: true, emptyText: "No risks were listed." })}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("A", "Appendix A: Evidence & Crawl Snapshot")}
        ${subsectionHeading("PageSpeed Snapshot")}
        ${renderTable(["Strategy", "Performance", "SEO", "LCP", "CLS", "TBT", "Speed Index"], speedRows, { compact: true, emptyText: "No PageSpeed snapshot available." })}
        ${subsectionHeading("Crawl Registry Summary")}
        ${renderTable(["Merged Links", "Crawl", "Sitemap", "Service Candidates", "Content Pages"], crawlSummaryRows, { compact: true, emptyText: "No crawl registry summary available." })}
        ${subsectionHeading("Key Pages Detected")}
        ${renderTable(["Page", "Present", "Primary URL"], keyPageRows, { compact: true, emptyText: "No key pages detected." })}
        ${subsectionHeading("Extraction Snapshot")}
        ${renderTable(["Signal", "Value"], extractionSnapshotRows, { compact: true, emptyText: "No extraction snapshot available." })}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("B", "Appendix B: Score Summary & Forecast Tables")}
        ${renderTable(["Area", "Score", "Notes"], appendixScoreRows, { compact: true, emptyText: "No score summary available." })}
        ${renderForecastTables(appendices?.growthForecastTables)}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("C", "Appendix C: Keyword Opportunities")}
        ${renderAppendixKeywordGroups(appendices?.keywords)}
        ${sectionHeading("D", "Appendix D: SERP Evidence")}
        ${renderSerpOrBacklinks(appendices?.serp, "SERP")}
      `,
    ),
  );

  pages.push(
    renderStandardPage(
      pageNo++,
      companyName,
      `
        ${sectionHeading("E", "Appendix E: Backlink Evidence")}
        ${renderSerpOrBacklinks(appendices?.backlinks, "Backlinks")}
        ${sectionHeading("F", "Appendix F: Data Sources & Gaps")}
        ${subsectionHeading("Data Sources")}
        ${renderDataSources(appendices?.dataSources)}
        ${subsectionHeading("Data Gaps")}
        ${renderDataGaps(appendices?.dataGaps)}
      `,
    ),
  );

  const screenshotSource = truthyArray<any>(appendices?.evidenceScreenshots).length
    ? appendices?.evidenceScreenshots
    : truthyArray<any>(appendicesData?.evidence?.screenshots?.desktop?.slices).concat(
        truthyArray<any>(appendicesData?.evidence?.screenshots?.mobile?.slices),
      ).length
    ? [
        ...(truthyArray<any>(appendicesData?.evidence?.screenshots?.desktop?.slices).map((item) => ({ ...item, label: item?.label || "Desktop Screenshot" }))),
        ...(truthyArray<any>(appendicesData?.evidence?.screenshots?.mobile?.slices).map((item) => ({ ...item, label: item?.label || "Mobile Screenshot" }))),
      ]
    : [
        ...(appendicesData?.evidence?.screenshots?.desktop?.b64 ? [{ ...appendicesData.evidence.screenshots.desktop, label: "Desktop Screenshot" }] : []),
        ...(appendicesData?.evidence?.screenshots?.mobile?.b64 ? [{ ...appendicesData.evidence.screenshots.mobile, label: "Mobile Screenshot" }] : []),
      ];
  const screenshotPages = renderScreenshotPages(companyName, pageNo, screenshotSource);
  pages.push(screenshotPages.html);

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(companyName)} Business Growth Analysis</title>
        <style>${css}</style>
      </head>
      <body>
        ${pages.join("")}
      </body>
    </html>
  `;
}

export async function generateBusinessGrowthPdfBuffer(report: BusinessGrowthReport): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=medium"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 2200, deviceScaleFactor: 1 });

    const html = buildHtml(report);
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close().catch(() => undefined);
  }
}