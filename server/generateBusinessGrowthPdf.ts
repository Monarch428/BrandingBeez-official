import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import type { BusinessGrowthReport, WebsiteSpeedTest } from "./openai";

type Nullable = string | number | boolean | null | undefined;
type TableCell = string | number | null | undefined;

type PdfLaunchOptions = {
  executablePath?: string;
  headless?: boolean;
};

const BRAND_PURPLE = "#321a66";
const BRAND_CORAL = "#ee4962";
const BRAND_BLUE = "#2563eb";
const GRAY_900 = "#111827";
const GRAY_700 = "#374151";
const GRAY_500 = "#6b7280";
const GRAY_300 = "#d1d5db";
const GRAY_200 = "#e5e7eb";
const GRAY_100 = "#f3f4f6";
const BG_LIGHT = "#f8fafc";

const FONT_DIR = path.resolve(process.cwd(), "assets", "fonts");
const REGULAR_FONT_FILE = process.env.PDF_FONT_REGULAR || "NotoSans-Regular.ttf";
const BOLD_FONT_FILE = process.env.PDF_FONT_BOLD || "NotoSans-Bold.ttf";

function escapeHtml(value: Nullable): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeText(value: Nullable, fallback = "N/A"): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
}

function optionalText(value: Nullable): string {
  const text = safeText(value, "");
  return text === "N/A" ? "" : text;
}

function clampScore(v: Nullable): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function formatDate(value: Nullable): string {
  if (!value) return "N/A";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return safeText(value);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatUrlForDisplay(url: Nullable, max = 80): string {
  const u = safeText(url, "");
  if (!u) return "";
  return u.length <= max ? u : `${u.slice(0, max - 1)}…`;
}

function formatList(items: Nullable[] | undefined | null): string[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => safeText(item, "")).filter(Boolean);
}

function yesNoChip(value: Nullable): string {
  const text = safeText(value, "").toLowerCase();
  const normalized = ["yes", "pass", "good", "true"].includes(text)
    ? "Yes"
    : ["no", "fail", "false"].includes(text)
      ? "No"
      : safeText(value);
  const klass = normalized === "Yes" ? "chip green" : normalized === "No" ? "chip red" : "chip";
  return `<span class="${klass}">${escapeHtml(normalized)}</span>`;
}

function renderList(items: string[], ordered = false, empty = "No items available."): string {
  if (!items.length) return `<div class="empty">${escapeHtml(empty)}</div>`;
  const tag = ordered ? "ol" : "ul";
  return `<${tag} class="list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function renderParagraphs(value: Nullable, empty = "Not available."): string {
  const text = optionalText(value);
  if (!text) return `<div class="empty">${escapeHtml(empty)}</div>`;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
  return paragraphs || `<div class="empty">${escapeHtml(empty)}</div>`;
}

function renderKeyValueGrid(items: Array<{ label: string; value: Nullable; type?: "score" | "text" | "chip" }>): string {
  return `
    <div class="stats-grid">
      ${items
        .map(({ label, value, type }) => {
          const content =
            type === "score"
              ? `<div class="score-pill">${escapeHtml(String(clampScore(value)))}</div>`
              : type === "chip"
                ? yesNoChip(value)
                : `<div class="stat-value">${escapeHtml(safeText(value))}</div>`;
          return `
            <div class="stat-card">
              <div class="stat-label">${escapeHtml(label)}</div>
              ${content}
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSimpleTable(headers: string[], rows: TableCell[][], title?: string): string {
  if (!rows.length) return `<div class="empty">No data available.</div>`;
  return `
    <div class="table-wrap">
      ${title ? `<div class="mini-title">${escapeHtml(title)}</div>` : ""}
      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `<tr>${row.map((cell) => `<td>${escapeHtml(safeText(cell, "-"))}</td>`).join("")}</tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSection(title: string, body: string, subtitle?: string, forceBreak = false): string {
  return `
    <section class="section ${forceBreak ? "page-break" : ""}">
      <div class="section-head">
        <h2>${escapeHtml(title)}</h2>
        ${subtitle ? `<div class="section-subtitle">${escapeHtml(subtitle)}</div>` : ""}
      </div>
      ${body}
    </section>
  `;
}

function renderCard(title: string, body: string): string {
  return `
    <div class="card">
      <div class="card-title">${escapeHtml(title)}</div>
      <div class="card-body">${body}</div>
    </div>
  `;
}

function encodeFontIfExists(filename: string): string | null {
  try {
    const filePath = path.join(FONT_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath).toString("base64");
  } catch {
    return null;
  }
}

function buildFontCss(): string {
  const regular = encodeFontIfExists(REGULAR_FONT_FILE);
  const bold = encodeFontIfExists(BOLD_FONT_FILE);
  if (!regular || !bold) {
    return `
      body { font-family: Arial, Helvetica, sans-serif; }
      .font-warning { display:block; }
    `;
  }

  return `
    @font-face {
      font-family: 'ReportSans';
      src: url(data:font/ttf;base64,${regular}) format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'ReportSans';
      src: url(data:font/ttf;base64,${bold}) format('truetype');
      font-weight: 700;
      font-style: normal;
    }
    body { font-family: 'ReportSans', Arial, Helvetica, sans-serif; }
    .font-warning { display:none; }
  `;
}

function renderSpeedTable(speed: WebsiteSpeedTest | undefined | null): string {
  if (!speed) return `<div class="empty">PageSpeed data not available.</div>`;
  return renderSimpleTable(
    ["Strategy", "Perf.", "SEO", "LCP", "TBT", "CLS", "Speed Index"],
    [
      [
        "Mobile",
        speed.mobile?.performanceScore ?? "-",
        speed.mobile?.seoScore ?? "-",
        speed.mobile?.metrics?.lcpMs ?? "-",
        speed.mobile?.metrics?.tbtMs ?? "-",
        speed.mobile?.metrics?.cls ?? "-",
        speed.mobile?.metrics?.speedIndexMs ?? "-",
      ],
      [
        "Desktop",
        speed.desktop?.performanceScore ?? "-",
        speed.desktop?.seoScore ?? "-",
        speed.desktop?.metrics?.lcpMs ?? "-",
        speed.desktop?.metrics?.tbtMs ?? "-",
        speed.desktop?.metrics?.cls ?? "-",
        speed.desktop?.metrics?.speedIndexMs ?? "-",
      ],
    ],
  );
}

function renderScenarioTable(scenarios: any[] | undefined, title: string): string {
  if (!Array.isArray(scenarios) || !scenarios.length) return `<div class="empty">${escapeHtml(title)} not available.</div>`;
  const blocks = scenarios
    .map((scenario) => {
      const assumptions = formatList(scenario?.assumptions);
      const outcomes = Array.isArray(scenario?.outcomes) ? scenario.outcomes : [];
      return `
        <div class="scenario-card">
          <div class="scenario-title">${escapeHtml(safeText(scenario?.name, "Scenario"))}</div>
          <div class="scenario-grid">
            <div>
              <div class="mini-title">Assumptions</div>
              ${renderList(assumptions, false, "No assumptions provided.")}
            </div>
            <div>
              <div class="mini-title">Outcomes</div>
              ${renderSimpleTable(
                ["Metric", "Value"],
                outcomes.map((o: any) => [safeText(o?.label, "-"), safeText(o?.value, "-")]),
              )}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
  return `<div class="scenario-wrap">${blocks}</div>`;
}

function renderEvidenceScreenshots(items: any[] | undefined): string {
  if (!Array.isArray(items) || !items.length) return "";
  return items
    .filter((item) => item?.b64)
    .map(
      (item) => `
        <section class="section page-break screenshot-section">
          <div class="section-head"><h2>${escapeHtml(safeText(item?.label, "Evidence Screenshot"))}</h2></div>
          <div class="screenshot-frame">
            <img src="data:image/${escapeHtml(safeText(item?.format, "png"))};base64,${item.b64}" alt="${escapeHtml(safeText(item?.label, "Screenshot"))}" />
          </div>
        </section>
      `,
    )
    .join("");
}

function buildHtml(report: BusinessGrowthReport): string {
  const meta = report.reportMetadata;
  const summary = report.executiveSummary;
  const web = report.websiteDigitalPresence;
  const seo = report.seoVisibility;
  const reputation = report.reputation;
  const comp = report.competitiveAnalysis;
  const services = report.servicesPositioning;
  const leads = report.leadGeneration;
  const cost = report.costOptimization;
  const financial = report.financialImpact;
  const market = report.targetMarket;
  const risk = report.riskAssessment;
  const advantage = report.competitiveAdvantages;
  const action = report.actionPlan90Days;
  const appendices = report.appendices;

  const styles = `
    ${buildFontCss()}
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: white; color: ${GRAY_900}; }
    body { font-size: 11px; line-height: 1.5; }
    @page {
      size: A4;
      margin: 18mm 14mm 18mm 14mm;
    }
    .page-break { break-before: page; page-break-before: always; }
    .report {
      width: 100%;
    }
    .cover {
      min-height: 260mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(180deg, ${BRAND_PURPLE} 0%, #1c0f3b 100%);
      color: white;
      padding: 22mm 18mm;
      border-radius: 14px;
    }
    .cover-top { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; }
    .cover-brand { font-size: 14px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .cover-url { color: rgba(255,255,255,.84); font-size: 10px; margin-top: 6px; }
    .cover-score {
      min-width: 92px; min-height: 92px; border-radius: 50%;
      background: rgba(255,255,255,.12); border: 2px solid rgba(255,255,255,.18);
      display:flex; align-items:center; justify-content:center; flex-direction:column;
    }
    .cover-score .num { font-size: 32px; font-weight: 700; line-height: 1; }
    .cover-score .lbl { font-size: 9px; text-transform: uppercase; letter-spacing: .08em; opacity:.8; }
    .cover-main h1 { font-size: 28px; line-height: 1.15; margin: 16mm 0 10px; }
    .cover-main p { font-size: 13px; color: rgba(255,255,255,.9); max-width: 70%; margin: 0; }
    .cover-grid {
      display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 18mm;
    }
    .cover-item {
      background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; padding: 12px;
    }
    .cover-item .k { font-size: 9px; opacity: .8; text-transform: uppercase; letter-spacing: .08em; }
    .cover-item .v { font-size: 12px; font-weight: 700; margin-top: 6px; }
    .font-warning {
      padding: 8px 10px; background: #fff5f5; border: 1px solid #fecaca; color: #991b1b; border-radius: 8px;
      margin: 14px 0 0;
    }
    .section { margin-top: 14px; }
    .section-head {
      border-bottom: 2px solid ${BRAND_CORAL};
      padding-bottom: 6px;
      margin: 0 0 10px;
    }
    .section-head h2 { margin:0; font-size: 18px; color: ${BRAND_PURPLE}; }
    .section-subtitle { color:${GRAY_500}; margin-top:3px; font-size:10px; }
    .grid-2, .grid-3, .grid-4 { display:grid; gap:10px; }
    .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .card {
      background: ${BG_LIGHT};
      border: 1px solid ${GRAY_200};
      border-radius: 12px;
      padding: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .card-title { font-weight: 700; color: ${BRAND_PURPLE}; margin-bottom: 8px; font-size: 12px; }
    .card-body p { margin: 0 0 8px; }
    .list { margin: 0; padding-left: 18px; }
    .list li { margin: 0 0 5px; }
    .empty { color: ${GRAY_500}; font-style: italic; }
    .stats-grid { display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:10px; }
    .stat-card { background:white; border:1px solid ${GRAY_200}; border-radius:12px; padding:12px; }
    .stat-label { color:${GRAY_500}; font-size:10px; text-transform: uppercase; letter-spacing: .05em; }
    .stat-value { margin-top:8px; font-size:16px; font-weight:700; color:${BRAND_PURPLE}; }
    .score-pill {
      margin-top:8px; width:54px; height:54px; border-radius:50%;
      background:${BRAND_PURPLE}; color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:20px;
    }
    .chip { display:inline-block; padding:4px 10px; border-radius:999px; border:1px solid ${GRAY_300}; font-size:10px; font-weight:700; }
    .chip.green { background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
    .chip.red { background:#fef2f2; color:#991b1b; border-color:#fecaca; }
    table { width:100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 1px solid ${GRAY_200}; padding: 7px 8px; text-align:left; vertical-align: top; word-break: break-word; }
    th { background:${BRAND_PURPLE}; color:white; font-size:10px; }
    td { background:white; }
    .table-wrap { overflow:hidden; border-radius: 10px; }
    .mini-title { font-weight:700; color:${BRAND_BLUE}; margin: 0 0 6px; }
    .scenario-wrap { display:grid; gap:10px; }
    .scenario-card { border:1px solid ${GRAY_200}; border-radius:12px; padding:12px; background:white; }
    .scenario-title { font-weight:700; color:${BRAND_PURPLE}; font-size:13px; margin-bottom:8px; }
    .scenario-grid { display:grid; grid-template-columns: 1fr 1.25fr; gap:10px; }
    .screenshot-frame {
      width: 100%; border:1px solid ${GRAY_200}; border-radius: 12px; padding: 10px; background: ${GRAY_100}; text-align:center;
    }
    .screenshot-frame img { width: 100%; height: auto; object-fit: contain; border-radius: 8px; }
    .kpi-row { display:grid; grid-template-columns: 130px 1fr 1fr; gap:8px; padding:8px 0; border-bottom:1px solid ${GRAY_200}; }
    .kpi-row:last-child { border-bottom:none; }
    .footer-note { color:${GRAY_500}; font-size:10px; margin-top:10px; }
  `;

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(meta.companyName)} - Business Growth Analysis</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="report">
          <section class="cover">
            <div>
              <div class="cover-top">
                <div>
                  <div class="cover-brand">BrandingBeez</div>
                  <div class="cover-url">${escapeHtml(formatUrlForDisplay(meta.website, 90))}</div>
                </div>
                <div class="cover-score">
                  <div class="num">${escapeHtml(String(clampScore(meta.overallScore)))}</div>
                  <div class="lbl">Overall Score</div>
                </div>
              </div>
              <div class="cover-main">
                <h1>Business Growth Analysis Report</h1>
                <p>A consulting-style audit of digital presence, SEO, lead generation, positioning, risk, and growth opportunities.</p>
              </div>
              <div class="cover-grid">
                <div class="cover-item"><div class="k">Company</div><div class="v">${escapeHtml(safeText(meta.companyName))}</div></div>
                <div class="cover-item"><div class="k">Report ID</div><div class="v">${escapeHtml(safeText(meta.reportId))}</div></div>
                <div class="cover-item"><div class="k">Analysis Date</div><div class="v">${escapeHtml(formatDate(meta.analysisDate))}</div></div>
              </div>
              <div class="font-warning">Embedded Unicode fonts were not found in assets/fonts. Add NotoSans-Regular.ttf and NotoSans-Bold.ttf for best ₹ and multi-viewer support.</div>
            </div>
            <div class="footer-note">Prepared for ${escapeHtml(safeText(meta.companyName))} • BrandingBeez AI Report Generator</div>
          </section>

          ${renderSection(
            "1. Executive Summary",
            `
              ${renderKeyValueGrid([
                { label: "Website", value: meta.subScores.website, type: "score" },
                { label: "SEO", value: meta.subScores.seo, type: "score" },
                { label: "Reputation", value: meta.subScores.reputation, type: "score" },
                { label: "Lead Gen", value: meta.subScores.leadGen, type: "score" },
              ])}
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard("Strengths", renderList(formatList(summary.strengths), false, "No strengths listed."))}
                ${renderCard("Weaknesses", renderList(formatList(summary.weaknesses), false, "No weaknesses listed."))}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">Quick Wins</div>
                ${renderSimpleTable(
                  ["Title", "Impact", "Time", "Cost", "Details"],
                  (summary.quickWins || []).map((item) => [item?.title, item?.impact, item?.time, item?.cost, item?.details]),
                )}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">High Priority Recommendations</div>
                ${renderList(formatList(summary.highPriorityRecommendations), true, "No recommendations listed.")}
              </div>
            `,
          )}

          ${renderSection(
            "2. Website & Digital Presence",
            `
              ${renderCard("Summary", renderParagraphs(web.summary))}
              ${renderKeyValueGrid([
                { label: "Website Health", value: web.websiteHealth?.score, type: "score" },
                { label: "UX / Conversion", value: web.uxConversion?.score, type: "score" },
                { label: "Technical SEO", value: web.technicalSEO?.score, type: "score" },
                { label: "Content Quality", value: web.contentQuality?.score, type: "score" },
              ])}
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard(
                  "Website Health",
                  `${renderList(formatList(web.websiteHealth?.highlights), false, "No highlights.")}
                   <div class="mini-title" style="margin-top:10px;">Issues</div>
                   ${renderList(formatList(web.websiteHealth?.issues), false, "No issues.")}
                   <div class="mini-title" style="margin-top:10px;">Estimated Impact</div>
                   ${renderParagraphs(web.websiteHealth?.estimatedImpact)}`,
                )}
                ${renderCard(
                  "UX & Conversion",
                  `${renderList(formatList(web.uxConversion?.highlights), false, "No highlights.")}
                   <div class="mini-title" style="margin-top:10px;">Issues</div>
                   ${renderList(formatList(web.uxConversion?.issues), false, "No issues.")}
                   <div class="mini-title" style="margin-top:10px;">Estimated Uplift</div>
                   ${renderParagraphs(web.uxConversion?.estimatedUplift)}`,
                )}
              </div>
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard("Content Gaps", renderList(formatList(web.contentGaps), false, "No content gaps listed."))}
                ${renderCard(
                  "Technical SEO Details",
                  `${renderList(formatList(web.technicalSEO?.issues), false, "No issues.")}
                   <div class="mini-title" style="margin-top:10px;">Opportunities</div>
                   ${renderList(formatList(web.technicalSEO?.opportunities), false, "No opportunities.")}`,
                )}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">PageSpeed Summary</div>
                ${renderSpeedTable(web.technicalSEO?.pageSpeed)}
              </div>
            `,
            undefined,
            true,
          )}

          ${renderSection(
            "3. SEO Visibility",
            `
              ${renderKeyValueGrid([
                { label: "Domain Authority", value: seo.domainAuthority?.score, type: "score" },
                { label: "Link Quality", value: seo.backlinks?.linkQualityScore, type: "score" },
                { label: "Technical SEO", value: seo.technicalSeo?.score, type: "score" },
                { label: "Local SEO", value: seo.localSeo?.score, type: "score" },
              ])}
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard(
                  "Backlinks & Keywords",
                  renderSimpleTable(
                    ["Metric", "Value"],
                    [
                      ["Total Backlinks", seo.backlinks?.totalBacklinks],
                      ["Referring Domains", seo.backlinks?.referringDomains],
                      ["Ranking Keywords", seo.keywordRankings?.totalRankingKeywords],
                      ["Top 3", seo.keywordRankings?.top3],
                      ["Top 10", seo.keywordRankings?.top10],
                      ["Top 100", seo.keywordRankings?.top100],
                    ],
                  ),
                )}
                ${renderCard(
                  "Technical SEO",
                  `${renderList(formatList(seo.technicalSeo?.issues), false, "No technical issues.")}
                   <div class="mini-title" style="margin-top:10px;">Opportunities</div>
                   ${renderList(formatList(seo.technicalSeo?.opportunities), false, "No opportunities.")}`,
                )}
              </div>
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard(
                  "Search Console Top Queries",
                  renderSimpleTable(
                    ["Query", "Clicks", "Impr.", "CTR", "Pos."],
                    (seo.searchConsole?.topQueries || []).map((q) => [q.query, q.clicks, q.impressions, q.ctr, q.position]),
                  ),
                )}
                ${renderCard(
                  "Search Console Top Pages",
                  renderSimpleTable(
                    ["Page", "Clicks", "Impr.", "CTR", "Pos."],
                    (seo.searchConsole?.topPages || []).map((p) => [p.page, p.clicks, p.impressions, p.ctr, p.position]),
                  ),
                )}
              </div>
            `,
            undefined,
            true,
          )}

          ${renderSection(
            "4. Reputation & Competitive Analysis",
            `
              <div class="grid-2">
                ${renderCard(
                  "Reputation Snapshot",
                  `${renderKeyValueGrid([{ label: "Overall", value: reputation.overallScore, type: "score" }])}
                   <div class="mini-title" style="margin-top:10px;">Platforms</div>
                   ${renderSimpleTable(
                     ["Platform", "Rating", "Reviews", "Status"],
                     (reputation.platforms || []).map((p) => [p.platform, p.currentRating, p.reviewCount, p.status]),
                   )}`,
                )}
                ${renderCard(
                  "Sentiment Summary",
                  `${renderList(formatList(reputation.sentiment?.positives), false, "No positives listed.")}
                   <div class="mini-title" style="margin-top:10px;">Negatives</div>
                   ${renderList(formatList(reputation.sentiment?.negatives), false, "No negatives listed.")}`,
                )}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">Competitors</div>
                ${renderSimpleTable(
                  ["Name", "Website", "Channel", "Rating", "Reviews"],
                  (comp.competitors || []).map((c) => [c.name, c.website, c.primaryChannel, c.rating, c.userRatingsTotal]),
                )}
              </div>
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard("Opportunities", renderList(formatList(comp.opportunities), false, "No opportunities listed."))}
                ${renderCard("Threats", renderList(formatList(comp.threats), false, "No threats listed."))}
              </div>
            `,
            undefined,
            true,
          )}

          ${renderSection(
            "5. Services, Positioning & Lead Generation",
            `
              <div class="card">
                <div class="card-title">Services</div>
                ${renderSimpleTable(
                  ["Service", "Starting Price", "Target Market", "Description"],
                  (services.services || []).map((s) => [s.name, s.startingPrice, s.targetMarket, s.description]),
                )}
              </div>
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard(
                  "Service Gaps",
                  renderSimpleTable(
                    ["Service", "You", "Competitor A", "Competitor B", "Demand"],
                    (services.serviceGaps || []).map((g) => [g.service, g.youOffer, g.competitorA, g.competitorB, g.marketDemand]),
                  ),
                )}
                ${renderCard(
                  "Lead Generation Channels",
                  renderSimpleTable(
                    ["Channel", "Leads / Month", "Quality", "Status"],
                    (leads.channels || []).map((c) => [c.channel, c.leadsPerMonth, c.quality, c.status]),
                  ),
                )}
              </div>
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard(
                  "Missing High-ROI Channels",
                  renderSimpleTable(
                    ["Channel", "Potential Leads", "Setup Time", "Monthly Cost", "Priority"],
                    (leads.missingHighROIChannels || []).map((c) => [c.channel, c.potentialLeads, c.setupTime, c.monthlyCost, c.priority]),
                  ),
                )}
                ${renderCard(
                  "Lead Magnets",
                  renderSimpleTable(
                    ["Title", "Funnel Stage", "Est. Conversion Rate", "Description"],
                    (leads.leadMagnets || []).map((l) => [l.title, l.funnelStage, l.estimatedConversionRate, l.description]),
                  ),
                )}
              </div>
            `,
            undefined,
            true,
          )}

          ${renderSection(
            "6. Cost Optimization, Financial Impact & Target Market",
            `
              <div class="grid-3">
                ${renderCard(
                  "Cost Optimization",
                  `${cost.estimationDisclaimer ? `<p><strong>Disclaimer:</strong> ${escapeHtml(cost.estimationDisclaimer)}</p>` : ""}
                   <p><strong>Confidence Score:</strong> ${escapeHtml(String(clampScore(cost.confidenceScore)))}</p>
                   ${renderSimpleTable(
                     ["Category", "Current", "Industry Avg"],
                     (cost.estimatedMonthlySpend || []).map((i) => [i.category, i.current, i.industryAvg]),
                   )}`,
                )}
                ${renderCard(
                  "Financial Impact",
                  `${financial.estimationDisclaimer ? `<p><strong>Disclaimer:</strong> ${escapeHtml(financial.estimationDisclaimer)}</p>` : ""}
                   <p><strong>Current Revenue Estimate:</strong> ${escapeHtml(safeText(financial.currentRevenueEstimate))}</p>
                   <p><strong>Improvement Potential:</strong> ${escapeHtml(safeText(financial.improvementPotential))}</p>
                   <p><strong>Projected Revenue Increase:</strong> ${escapeHtml(safeText(financial.projectedRevenueIncrease))}</p>`,
                )}
                ${renderCard(
                  "Target Market",
                  `${market.estimationDisclaimer ? `<p><strong>Disclaimer:</strong> ${escapeHtml(market.estimationDisclaimer)}</p>` : ""}
                   <p><strong>Positioning Advice:</strong> ${escapeHtml(safeText(market.positioningAdvice))}</p>
                   <p><strong>Confidence Score:</strong> ${escapeHtml(String(clampScore(market.confidenceScore)))}</p>`,
                )}
              </div>
              <div class="grid-3" style="margin-top:10px;">
                ${renderCard("Cost Scenarios", renderScenarioTable(cost.scenarios as any[], "Cost scenarios"))}
                ${renderCard("Financial Scenarios", renderScenarioTable(financial.scenarios as any[], "Financial scenarios"))}
                ${renderCard("Target Market Scenarios", renderScenarioTable(market.scenarios as any[], "Target market scenarios"))}
              </div>
            `,
            undefined,
            true,
          )}

          ${renderSection(
            "7. Risk, Advantages & 90-Day Action Plan",
            `
              <div class="grid-2">
                ${renderCard(
                  "Risks",
                  renderSimpleTable(
                    ["Risk", "Severity", "Likelihood", "Mitigation"],
                    (risk.risks || []).map((r) => [r.risk, r.severity, r.likelihood, r.mitigation]),
                  ),
                )}
                ${renderCard(
                  "Compliance",
                  renderSimpleTable(
                    ["Item", "Status", "Notes"],
                    (risk.compliance || []).map((c) => [c.item, c.status, c.notes]),
                  ),
                )}
              </div>
              <div class="grid-2" style="margin-top:10px;">
                ${renderCard(
                  "Competitive Advantages",
                  renderSimpleTable(
                    ["Advantage", "Why It Matters", "How To Leverage"],
                    (advantage.advantages || []).map((a) => [a.advantage, a.whyItMatters, a.howToLeverage]),
                  ),
                )}
                ${renderCard(
                  "Unique Angle",
                  renderParagraphs(advantage.uniqueAngle),
                )}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">90-Day Action Plan</div>
                ${renderSimpleTable(
                  ["Week", "Focus", "Actions", "Expected Outcome"],
                  (action.weekByWeek || []).map((w) => [w.week, w.focus, (w.actions || []).join("; "), w.expectedOutcome]),
                )}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">KPIs To Track</div>
                ${(action.kpisToTrack || [])
                  .map(
                    (kpi) => `
                      <div class="kpi-row">
                        <div><strong>${escapeHtml(safeText(kpi.kpi))}</strong></div>
                        <div>Current: ${escapeHtml(safeText(kpi.current))}</div>
                        <div>Target: ${escapeHtml(safeText(kpi.target))}</div>
                      </div>
                    `,
                  )
                  .join("") || `<div class="empty">No KPIs listed.</div>`}
              </div>
            `,
            undefined,
            true,
          )}

          ${renderSection(
            "8. Appendices",
            `
              <div class="grid-2">
                ${renderCard(
                  "Score Summary",
                  renderSimpleTable(
                    ["Area", "Score", "Notes"],
                    (appendices.scoreSummary || []).map((s) => [s.area, s.score, s.notes]),
                  ),
                )}
                ${renderCard(
                  "Data Sources",
                  renderSimpleTable(
                    ["Label", "Source", "Collected At", "Notes"],
                    (appendices.dataSources || []).map((d) => [d.label, d.source, formatDate(d.collectedAt), d.notes]),
                  ),
                )}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">Growth Forecast Tables</div>
                ${(appendices.growthForecastTables || [])
                  .map((table) => renderSimpleTable(table.headers || [], table.rows || [], table.tableTitle))
                  .join("") || `<div class="empty">No forecast tables available.</div>`}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">Keyword Tiers</div>
                ${(appendices.keywords || [])
                  .map((group) =>
                    renderSimpleTable(
                      ["Keyword", "Monthly Searches", "Difficulty", "Intent", "Current Rank"],
                      (group.keywords || []).map((k) => [k.keyword, k.monthlySearches, k.difficulty, k.intent, k.currentRank]),
                      group.tier,
                    ),
                  )
                  .join("") || `<div class="empty">No keyword groups available.</div>`}
              </div>
              <div class="card" style="margin-top:10px;">
                <div class="card-title">Data Gaps</div>
                ${renderSimpleTable(
                  ["Area", "Missing", "How To Enable"],
                  (appendices.dataGaps || []).map((gap) => [gap.area, (gap.missing || []).join("; "), (gap.howToEnable || []).join("; ")]),
                )}
              </div>
            `,
            undefined,
            true,
          )}

          ${renderEvidenceScreenshots(appendices.evidenceScreenshots as any[])}
        </div>
      </body>
    </html>
  `;
}

function getLaunchOptions(): PdfLaunchOptions {
  return {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    headless: process.env.PDF_HEADLESS === "false" ? false : true,
  };
}

export async function generateBusinessGrowthPdfBuffer(report: BusinessGrowthReport): Promise<Buffer> {
  const html = buildHtml(report);
  const launchOptions = getLaunchOptions();

  const browser = await puppeteer.launch({
    headless: launchOptions.headless,
    executablePath: launchOptions.executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--font-render-hinting=medium",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: ["load", "networkidle0"] });

    const headerTemplate = `
      <div style="
        width:100%; font-size:9px; color:${GRAY_500}; padding:0 14mm;
        display:flex; justify-content:space-between; align-items:center;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <span>${escapeHtml(safeText(report.reportMetadata.companyName))}</span>
        <span>Business Growth Analysis</span>
      </div>
    `;

    const footerTemplate = `
      <div style="
        width:100%; font-size:9px; color:${GRAY_500}; padding:0 14mm;
        display:flex; justify-content:space-between; align-items:center;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <span>Report ID: ${escapeHtml(safeText(report.reportMetadata.reportId))}</span>
        <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>
    `;

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: "18mm",
        right: "14mm",
        bottom: "18mm",
        left: "14mm",
      },
      preferCSSPageSize: false,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
