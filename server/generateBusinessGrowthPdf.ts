// server/generateBusinessGrowthPdf.ts
import PDFDocument from "pdfkit";
import type { WebsiteSpeedTest, BusinessGrowthReport } from "./openai";

/**
 * BrandingBeez – Business Growth Analyzer PDF Generator
 * - A4, consistent margins
 * - Branded header/footer (except cover page)
 * - Tables with wrapped text and aligned columns
 */

type TableRow = (string | number | null | undefined)[];

const BRAND_PURPLE = "#321a66";
const BRAND_CORAL = "#ee4962";
const BRAND_BLUE = "#2563eb";
const GRAY_900 = "#111827";
const GRAY_700 = "#374151";
const GRAY_500 = "#6b7280";
const GRAY_200 = "#e5e7eb";
const BG_LIGHT = "#f8fafc";
const GRAY_50 = "#F8FAFC";
const GRAY_600 = "#e5e7eb";


const MARGINS = { top: 54, left: 54, right: 54, bottom: 54 };

const FOOTER_RESERVED_H = 44; // keep content clear of footer area

function contentBottom(doc: PDFKit.PDFDocument) {
  return doc.page.height - doc.page.margins.bottom - FOOTER_RESERVED_H;
}

function ensureSpace(doc: PDFKit.PDFDocument, neededHeight: number) {
  if (doc.y + neededHeight > contentBottom(doc)) {
    doc.addPage();
  }
}

function resetX(doc: PDFKit.PDFDocument) {
  doc.x = doc.page.margins.left;
}


// Avoid blank pages: only add a new page if current page already has content
function addPageIfNotAtTop(doc: PDFKit.PDFDocument) {
  const top = doc.page.margins.top;
  if (doc.y > top + 5) doc.addPage();
}

function safeText(value: unknown, fallback = "N/A") {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v: any) => safeText(v, "")).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function formatDate(value: unknown) {
  const d = typeof value === "string" || value instanceof Date ? new Date(value as any) : null;
  if (!d || Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function clampScore(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function addHeaderFooter(doc: PDFKit.PDFDocument, reportId: string, company: string) {
  let pageNumber = 0;

  // IMPORTANT:
  // PDFKit can recursively add pages if `doc.text()` inside this handler triggers
  // a page break (e.g., wrapping / not enough space). That causes `pageAdded` to
  // fire again and can lead to `Maximum call stack size exceeded`.
  // This guard prevents re-entrancy and stops that infinite loop.
  let isDrawing = false;

  const truncateToWidth = (text: string, maxWidth: number) => {
    const t = (text || "").trim();
    if (!t) return "";
    if (doc.widthOfString(t) <= maxWidth) return t;
    const ell = "…";
    let lo = 0;
    let hi = t.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const s = t.slice(0, mid).trimEnd() + ell;
      if (doc.widthOfString(s) <= maxWidth) lo = mid;
      else hi = mid - 1;
    }
    return t.slice(0, Math.max(0, lo)).trimEnd() + ell;
  };

  const draw = () => {
    if (isDrawing) return;
    isDrawing = true;
    try {
      pageNumber += 1;

      // Skip cover page header/footer
      if (pageNumber === 1) return;

      const { left, right, top, bottom } = doc.page.margins;
      const w = doc.page.width;
      const h = doc.page.height;

      // Header/Footer should NEVER change doc.x/doc.y for the main content flow,
      // otherwise PDFKit may think it is out of space and recursively add pages.
      const prevX = doc.x;
      const prevY = doc.y;

      // Header
      doc.save();
      const headerW = w - left - right;
      const leftTitle = truncateToWidth("AI BUSINESS GROWTH ANALYZER", headerW * 0.62);
      const rightCompany = truncateToWidth(company, headerW * 0.38);
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(GRAY_700)
        .text(leftTitle, left, top - 28, {
          width: headerW,
          align: "left",
          lineBreak: false,
          continued: false,
        });
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(GRAY_500)
        .text(rightCompany, left, top - 28, {
          width: headerW,
          align: "right",
          lineBreak: false,
          continued: false,
        });

      doc
        .moveTo(left, top - 10)
        .lineTo(w - right, top - 10)
        .lineWidth(1)
        .strokeColor(GRAY_200)
        .stroke();
      doc.restore();

      // Restore cursor
      doc.x = prevX;
      doc.y = prevY;

      // Footer
      // IMPORTANT: In PDFKit, any text drawn with a Y position BELOW
      // (page.height - margins.bottom) can trigger an automatic page break.
      // Your previous footer Y (h - bottom + …) was below that threshold,
      // which caused an extra page to be inserted that contained ONLY the
      // header/footer, and then the actual content started on the next page.
      //
      // Fix: draw footer INSIDE the safe content box, just above the bottom margin.
      doc.save();

      const contentBottomY = h - bottom; // max Y before PDFKit auto-adds a new page
      const footerRuleY = contentBottomY - 22;
      const footerTextY = contentBottomY - 16;

      doc
        .moveTo(left, footerRuleY)
        .lineTo(w - right, footerRuleY)
        .lineWidth(1)
        .strokeColor(GRAY_200)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(GRAY_500)
        .text(`Page ${pageNumber - 1}`, left, footerTextY, { align: "left", lineBreak: false });

      // doc
      //   .font("Helvetica")
      //   .fontSize(9)
      //   .fillColor(GRAY_500)
      //   .text(`Report ID: ${reportId}`, left, footerTextY, { width: w - left - right, align: "center", lineBreak: false });

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(GRAY_500)
        .text("CONFIDENTIAL", left, footerTextY, { width: w - left - right, align: "right", lineBreak: false });

      doc.restore();
      doc.restore();

      // Restore cursor
      doc.x = prevX;
      doc.y = prevY;
    } finally {
      isDrawing = false;
    }
  };

  doc.on("pageAdded", draw);
  draw();
}

function sectionTitle(doc: PDFKit.PDFDocument, n: string, title: string) {
  resetX(doc);
  ensureSpace(doc, 60);
  doc.moveDown(0.5);
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor(GRAY_900)
    .text(`${n}. ${title}`, doc.page.margins.left, doc.y, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right, align: "left" });
  doc
    .moveDown(0.25)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .lineWidth(2)
    .strokeColor(BRAND_BLUE)
    .stroke();
  doc.moveDown(0.6);
}

function paragraph(doc: PDFKit.PDFDocument, text: string) {
  resetX(doc);
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const h = doc.heightOfString(text || "", { width: w, lineGap: 2 });
  ensureSpace(doc, h + 18);
  doc.font("Helvetica").fontSize(11).fillColor(GRAY_900).text(text, doc.page.margins.left, doc.y, { lineGap: 2, width: w, align: "left" });
  doc.moveDown(0.4);
}

function bullets(doc: PDFKit.PDFDocument, items: string[], emptyMessage = "No data available.") {
  resetX(doc);
  const list = (items || []).filter(Boolean);
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  if (!list.length) {
    ensureSpace(doc, 24);
    doc.font("Helvetica").fontSize(11).fillColor(GRAY_500).text(emptyMessage, doc.page.margins.left, doc.y, { width: w, lineGap: 2, align: "left" });
    doc.moveDown(0.4);
    return;
  }

  doc.font("Helvetica").fontSize(11).fillColor(GRAY_900);
  list.forEach((it) => {
    const line = `• ${it}`;
    const h = doc.heightOfString(line, { width: w, indent: 12, lineGap: 2, align: "left" });
    ensureSpace(doc, h + 6);
    doc.text(line, doc.page.margins.left, doc.y, { indent: 12, lineGap: 2, width: w, align: "left" });
  });
  doc.moveDown(0.4);
}

function callout(doc: PDFKit.PDFDocument, title: string, body: string) {
  const x = doc.page.margins.left;
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const padding = 12;
  const innerW = w - padding * 2;

  const titleH = doc.heightOfString(title || "", { width: innerW, lineGap: 2 });
  const bodyH = doc.heightOfString(body || "", { width: innerW, lineGap: 2 });

  const boxH = padding + titleH + 6 + bodyH + padding;

  // Prevent overlap/misalignment near page bottom
  ensureSpace(doc, boxH + 10);

  const startY = doc.y;

  doc.save();
  doc.roundedRect(x, startY, w, boxH, 12).fill(BG_LIGHT);
  doc.restore();

  doc.y = startY + padding;

  doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_PURPLE).text(title, x + padding, doc.y, {
    width: innerW,
    lineGap: 2,
  });

  doc.moveDown(0.3);

  doc.font("Helvetica").fontSize(11).fillColor(GRAY_900).text(body, x + padding, doc.y, {
    width: innerW,
    lineGap: 2,
  });

  doc.y = startY + boxH;
  doc.moveDown(0.8);
  resetX(doc);
}

function keyMetricsBox(
  doc: PDFKit.PDFDocument,
  rows: { label: string; value: string }[],
  opts?: { labelWidth?: number },
) {
  resetX(doc);

  const labelW = opts?.labelWidth ?? 150;
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const paddingX = 12;
  const paddingY = 10;
  const gapY = 8;

  const x = doc.page.margins.left;
  const y = doc.y;

  // Measure row heights (labels rarely wrap, values often do)
  const availableValueW = w - paddingX * 2 - labelW - 10;

  const rowHeights = rows.map((r) => {
    const labelText = (r.label || "").trim();
    const valueText = (r.value || "").trim();

    const labelH = doc.heightOfString(labelText, { width: labelW, align: "left" });
    const valueH = doc.heightOfString(valueText, { width: availableValueW, align: "left" });

    // Keep a sensible minimum height
    return Math.max(18, Math.max(labelH, valueH));
  });

  const boxH =
    paddingY * 2 +
    rowHeights.reduce((sum, h) => sum + h, 0) +
    (rows.length > 0 ? (rows.length - 1) * gapY : 0);

  ensureSpace(doc, boxH + 16);

  // Background card
  doc.save();
  doc.roundedRect(x, y, w, boxH, 10).fillColor(GRAY_50).fill();
  doc.roundedRect(x, y, w, boxH, 10).lineWidth(1).strokeColor(GRAY_200).stroke();
  doc.restore();

  let cy = y + paddingY;

  rows.forEach((r, i) => {
    const label = (r.label || "").trim();
    const value = (r.value || "").trim();

    // ✅ Row label should be black (as requested)
    doc.font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(GRAY_900)
      .text(label, x + paddingX, cy, { width: labelW, align: "left" });

    doc.font("Helvetica")
      .fontSize(10)
      .fillColor(GRAY_900)
      .text(value, x + paddingX + labelW + 10, cy, {
        width: availableValueW,
        align: "left",
      });

    cy += rowHeights[i] + gapY;
  });

  doc.y = y + boxH + 12;
}


function drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: TableRow[], colWidths?: number[]) {
  const x = doc.page.margins.left;
  const yStart = doc.y;
  ensureSpace(doc, 28);
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const widths = colWidths && colWidths.length === headers.length
    ? colWidths
    : (() => {
      const equal = Math.floor(w / headers.length);
      return headers.map(() => equal);
    })();

  const rowPaddingY = 6;
  const cellPaddingX = 6;

  const drawRow = (cells: string[], y: number, isHeader: boolean, stripe: boolean) => {
    const rowHeight = Math.max(
      18,
      ...cells.map((c, idx) => doc.heightOfString(c, { width: widths[idx] - cellPaddingX * 2, align: "left" }) + rowPaddingY * 2),
    );

    // Page break
    const bottomLimit = contentBottom(doc) - 10;
    if (y + rowHeight > bottomLimit) {
      doc.addPage();
      return drawRow(cells, doc.y, isHeader, stripe);
    }

    // Background
    if (isHeader) {
      doc.save();
      doc.rect(x, y, w, rowHeight).fill(BRAND_BLUE);
      doc.restore();
    } else if (stripe) {
      doc.save();
      doc.rect(x, y, w, rowHeight).fill("#ffffff");
      doc.restore();
    } else {
      doc.save();
      doc.rect(x, y, w, rowHeight).fill(BG_LIGHT);
      doc.restore();
    }

    // Borders
    doc.save();
    doc.rect(x, y, w, rowHeight).strokeColor(GRAY_200).lineWidth(1).stroke();
    doc.restore();

    // Cells
    let cx = x;
    cells.forEach((c, idx) => {
      // vertical separators
      if (idx > 0) {
        doc.save();
        doc.moveTo(cx, y).lineTo(cx, y + rowHeight).strokeColor(GRAY_200).lineWidth(1).stroke();
        doc.restore();
      }

      doc
        .font(isHeader ? "Helvetica-Bold" : "Helvetica")
        .fontSize(10)
        .fillColor(isHeader ? "#ffffff" : GRAY_900)
        .text(c, cx + cellPaddingX, y + rowPaddingY, {
          width: widths[idx] - cellPaddingX * 2,
          align: "left",
          lineGap: 2,
        });

      cx += widths[idx];
    });

    doc.y = y + rowHeight;
    return rowHeight;
  };

  // Header
  drawRow(headers, yStart, true, false);

  // Rows
  rows.forEach((r, idx) => {
    const cells = r.map((c: any) => safeText(c, ""));
    drawRow(cells, doc.y, false, idx % 2 === 0);
  });

  doc.moveDown(0.8);
  resetX(doc);
}

function speedTestTable(speed: WebsiteSpeedTest | undefined) {
  const rows: TableRow[] = [];
  const add = (label: string, m: any) => {
    const lcpMs = m?.metrics?.lcpMs ?? m?.lcpMs;
    const cls = m?.metrics?.cls ?? m?.cls;
    const tbtMs = m?.metrics?.tbtMs ?? m?.tbtMs;

    rows.push([
      label,
      m?.performanceScore ?? "—",
      m?.seoScore ?? "—",
      typeof lcpMs === "number" ? `${Math.round(lcpMs)} ms` : "—",
      typeof cls === "number" ? Number(cls).toFixed(3) : "—",
      typeof tbtMs === "number" ? `${Math.round(tbtMs)} ms` : "—",
    ]);
  };
  add("Mobile", speed?.mobile);
  add("Desktop", speed?.desktop);
  return rows;
}


export async function generateBusinessGrowthPdfBuffer(report: BusinessGrowthReport): Promise<Buffer> {
  // Debug snapshot: confirms what the PDF generator actually receives.
  try {
    const repAny: any = report as any;
    const t = repAny?.websiteDigitalPresence?.technicalSEO;
    console.log("[AI-Growth][PDF] input snapshot", {
      reportId: repAny?.reportMetadata?.reportId,
      website: repAny?.reportMetadata?.website,
      hasTechnicalSEO: !!t,
      hasSpeedTest: !!t?.pageSpeed,
      psiPerfMobile: t?.pageSpeed?.mobile?.performanceScore ?? null,
      psiPerfDesktop: t?.pageSpeed?.desktop?.performanceScore ?? null,
      services_count: repAny?.servicesPositioning?.services?.length ?? 0,
      industries_count: repAny?.servicesPositioning?.industriesServed?.current?.length ?? 0,
      channels_count: repAny?.leadGeneration?.channels?.length ?? 0,
      leadMagnets_count: repAny?.leadGeneration?.leadMagnets?.length ?? 0,
      reputationPlatforms_count: repAny?.reputation?.platforms?.length ?? 0,
    });
  } catch { }


  const rep: any = report as any;

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: MARGINS,
        autoFirstPage: true,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const reportId = safeText(report.reportMetadata?.reportId, "BB-AI-REPORT");
      const companyName = safeText(report.reportMetadata?.companyName, "Company");
      const website = safeText(report.reportMetadata?.website, "");
      const analysisDate = formatDate(report.reportMetadata?.analysisDate);
      const overallScore = clampScore(report.reportMetadata?.overallScore);

      addHeaderFooter(doc, reportId, companyName);

      /* =========================
         COVER PAGE
      ========================= */
      doc.save();
      // Top accent bar
      doc.rect(0, 0, doc.page.width, 18).fill(BRAND_PURPLE);
      doc.restore();

      doc.moveDown(1.4);
      doc.font("Helvetica-Bold").fontSize(30).fillColor(GRAY_900).text("AI BUSINESS GROWTH", { align: "left" });
      doc.font("Helvetica-Bold").fontSize(30).fillColor(GRAY_900).text("ANALYZER REPORT", { align: "left" });

      doc.moveDown(1.2);
      doc.font("Helvetica-Bold").fontSize(14).fillColor(GRAY_900).text(companyName);
      doc.font("Helvetica").fontSize(11).fillColor(BRAND_BLUE).text(website);

      doc.moveDown(0.8);
      doc.font("Helvetica").fontSize(11).fillColor(GRAY_700).text(`Analysis Date: ${analysisDate}`);
      doc.font("Helvetica").fontSize(11).fillColor(GRAY_700).text(`Report ID: ${reportId}`);

      // Score badge
      const badgeX = doc.page.margins.left;
      const badgeY = doc.y + 18;
      doc.save();
      doc.roundedRect(badgeX, badgeY, 160, 64, 14).fill(BG_LIGHT);
      doc.restore();
      doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_PURPLE).text("Overall Score", badgeX + 14, badgeY + 12);
      doc.font("Helvetica-Bold").fontSize(28).fillColor(BRAND_CORAL).text(`${overallScore}/100`, badgeX + 14, badgeY + 30);

      addPageIfNotAtTop(doc);

      /* =========================
         1) EXECUTIVE SUMMARY
      ========================= */
      sectionTitle(doc, "1", "Executive Summary");

      const strengths = normalizeStringList(report.executiveSummary?.strengths);
      const weaknesses = normalizeStringList(report.executiveSummary?.weaknesses);
      const biggest = safeText((report as any).executiveSummary?.biggestOpportunity ?? (report as any).executiveSummary?.highPriorityRecommendations?.[0], "No single opportunity identified.");

      callout(doc, "Brutally Honest Snapshot", biggest);

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("✅ Key Strengths");
      bullets(doc, strengths, "No strengths detected.");

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("⚠ Critical Weaknesses");
      bullets(doc, weaknesses, "No weaknesses detected.");

      // Scores table
      const ss = report.reportMetadata?.subScores;
      drawTable(
        doc,
        ["Category", "Score / 100", "What it means"],
        [
          ["Website", ss?.website ?? "—", "Technical foundation & UX"],
          ["SEO", ss?.seo ?? "—", "Visibility & demand capture"],
          ["Reputation", ss?.reputation ?? "—", "Trust & social proof"],
          ["Lead Gen", ss?.leadGen ?? "—", "Acquisition channels & conversion"],
          ["Services", ss?.services ?? "—", "Offer clarity & positioning"],
          ["Cost Efficiency", ss?.costEfficiency ?? "—", "Margins & scalability"],
        ],
        [120, 90, 280],
      );

      // Top quick wins
      const quickWins = (report.executiveSummary?.quickWins || []).slice(0, 5);
      if (quickWins.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Top Immediate Actions (Next 90 Days)");
        doc.moveDown(0.4);
        quickWins.forEach((q, i) => {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_PURPLE).text(`${i + 1}. ${safeText(q.title, "Action")}`);
          doc.font("Helvetica").fontSize(10).fillColor(GRAY_700).text(
            `Impact: ${safeText(q.impact)}  •  Time: ${safeText(q.time)}  •  Cost: ${safeText(q.cost)}`,
          );
          paragraph(doc, safeText(q.details, ""));
        });
      }

      addPageIfNotAtTop(doc);

      /* =========================
         2) WEBSITE & DIGITAL PRESENCE
      ========================= */
      sectionTitle(doc, "2", "Website & Digital Presence Analysis");

      const t = report.websiteDigitalPresence?.technicalSEO;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Technical SEO Score: ${clampScore(t?.score)}/100`);
      doc.moveDown(0.3);
      bullets(doc, normalizeStringList((t as any)?.strengths), "No technical strengths detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Issues Found");
      bullets(doc, normalizeStringList(t?.issues), "No issues detected.");

      // Speed test table
      const speed = (t as any)?.pageSpeed as WebsiteSpeedTest | undefined;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Page Speed & Core Web Vitals (Real Test)");
      doc.moveDown(0.4);
      drawTable(doc, ["Strategy", "Perf", "SEO", "LCP", "CLS", "TBT"], speedTestTable(speed), [90, 60, 60, 95, 70, 80]);

      if (speed?.mobile?.opportunities?.length || speed?.desktop?.opportunities?.length) {
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Highest-Impact Speed Opportunities");
        const opps = [
          ...(speed?.mobile?.opportunities || []).map((o: any) => `Mobile: ${o.title}`),
          ...(speed?.desktop?.opportunities || []).map((o: any) => `Desktop: ${o.title}`),
        ].slice(0, 10);
        bullets(doc, opps, "No opportunities detected.");
      }

      const cq = report.websiteDigitalPresence?.contentQuality;
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "2.2", "Content Quality Assessment");
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Content Quality Score: ${clampScore(cq?.score)}/100`);
      bullets(doc, normalizeStringList(cq?.strengths), "No content strengths detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Gaps");
      bullets(doc, normalizeStringList((cq as any)?.gaps), "No gaps detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Recommendations");
      bullets(doc, normalizeStringList((cq as any)?.recommendations), "No recommendations available.");

      const ux = report.websiteDigitalPresence?.uxConversion;
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "2.3", "UX & Conversion Optimization");
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`UX/Conversion Score: ${clampScore(ux?.score)}/100`);
      bullets(doc, normalizeStringList(ux?.highlights), "No conversion positives detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Issues Holding Back Conversions");
      bullets(doc, normalizeStringList(ux?.issues), "No issues detected.");
      paragraph(doc, `Estimated Uplift: ${safeText(ux?.estimatedUplift, "N/A")}`);

      const gaps = normalizeStringList(report.websiteDigitalPresence?.contentGaps);
      if (gaps.length) {
        addPageIfNotAtTop(doc);
        sectionTitle(doc, "2.4", "Content Gaps");
        bullets(doc, gaps, "No gaps detected.");
      }

      /* =========================
         3) SEO & ORGANIC VISIBILITY
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "3", "SEO & Organic Visibility");

      const da = report.seoVisibility?.domainAuthority;
      const daScore = typeof da?.score === "number" ? clampScore(da.score) : null;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Domain Authority Score: ${daScore !== null ? `${daScore}/100` : "N/A"}`);
      if (da?.benchmark) {
        drawTable(
          doc,
          ["Benchmark", "Score"],
          [
            ["You", da.benchmark.you],
            ["Competitor A", da.benchmark.competitorA],
            ["Competitor B", da.benchmark.competitorB],
            ["Competitor C", da.benchmark.competitorC],
            ["Industry Avg", da.benchmark.industryAvg],
          ],
          [240, 120],
        );
      }
      paragraph(doc, safeText(da?.notes, ""));

      const backlinks = report.seoVisibility?.backlinks;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Backlinks");
      drawTable(
        doc,
        ["Metric", "Value"],
        [
          ["Total Backlinks", backlinks?.totalBacklinks ?? "N/A"],
          ["Referring Domains", backlinks?.referringDomains ?? "N/A"],
          ["Link Quality Score", backlinks?.linkQualityScore ?? "N/A"],
        ],
        [240, 120],
      );
      paragraph(doc, safeText(backlinks?.notes, ""));

      /* =========================
               4) REPUTATION/* =========================
               4) REPUTATION & SOCIAL PROOF
            ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "4", "Reputation & Social Proof Audit");

      const rep = report.reputation;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Overall Review Score: ${safeText((rep as any)?.reviewScore, "—")}/5`);
      doc.font("Helvetica").fontSize(10).fillColor(GRAY_500).text(
        "Based on publicly available review platforms detected during analysis.",
        { lineGap: 2 },
      );
      doc.moveDown(0.4);

      if ((rep as any)?.summaryTable?.length) {
        drawTable(
          doc,
          ["Platform", "Reviews", "Rating", "Benchmark", "Gap"],
          (rep as any).summaryTable.map((r: any) => [r.platform, r.reviews, r.rating, r.industryBenchmark, r.gap]),
          [140, 70, 70, 110, 110],
        );
      } else {
        paragraph(doc, "No review platform data was detected for this website/company.");
      }

      // paragraph(doc, `Total Reviews Found: ${safeText((rep as any)?.totalReviews, "—")} • Industry Standard: ${safeText((rep as any)?.industryStandardRange, "—")} • Your Gap: ${safeText((rep as any)?.yourGap, "—")}`);
      keyMetricsBox(doc, [
        { label: "Total Reviews Found", value: String((rep as any)?.totalReviews ?? "—") },
        { label: "Industry Standard", value: safeText((rep as any)?.industryStandardRange, "—") },
        { label: "Your Gap", value: safeText((rep as any)?.yourGap, "—") },
      ]);


      const themes = (rep as any)?.sentimentThemes;
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Positive Themes");
      bullets(doc, normalizeStringList(themes?.positive), "No positive themes detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Negative Themes");
      bullets(doc, normalizeStringList(themes?.negative), "No negative themes detected.");
      paragraph(doc, `Response Rate: ${safeText(themes?.responseRate, "N/A")} • Avg Response Time: ${safeText(themes?.averageResponseTime, "N/A")}`);

      /* =========================
         5) SERVICE OFFERINGS & MARKET POSITIONING
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "5", "Service Offerings & Market Positioning");

      const sp = report.servicesPositioning;

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Current Service Menu");
      if (sp?.services?.length) {
        drawTable(
          doc,
          ["Service", "Starting Price", "Target Market", "Description"],
          sp.services.map((s: any) => [s.name, s.startingPrice, s.targetMarket, s.description]),
          [130, 90, 120, 190],
        );
      } else {
        paragraph(doc, "No service list data was detected.");
      }

      if (sp?.serviceGaps?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Service Gaps vs Market");
        drawTable(
          doc,
          ["Service", "You", "Competitor A", "Competitor B", "Market Demand"],
          sp.serviceGaps.map((g: any) => [g.service, g.youOffer, g.competitorA, g.competitorB, g.marketDemand]),
          [120, 90, 90, 90, 120],
        );
      }

      const inds = sp?.industriesServed;
      if (inds) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Industries Served");
        bullets(doc, normalizeStringList(inds.current), "No industries detected.");
        paragraph(doc, safeText(inds.concentrationNote, ""));
        if (inds.highValueIndustries?.length) {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("High-Value Targets");
          drawTable(
            doc,
            ["Industry", "Why High Value", "Avg Deal Size", "Readiness"],
            inds.highValueIndustries.map((t: any) => [t.industry, t.whyHighValue, t.avgDealSize, t.readiness]),
            [110, 210, 90, 80],
          );
        }
      }

      const pos = sp?.positioning;
      if (pos) {
        callout(
          doc,
          "Positioning Snapshot",
          `Current: ${safeText(pos.currentStatement, "N/A")}\n\nCompetitors: ${safeText(pos.competitorComparison, "N/A")}\n\nDifferentiation: ${safeText(pos.differentiation, "N/A")}`,
        );
      }

      /* =========================
         6) LEAD GENERATION & ACQUISITION CHANNELS
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "6", "Lead Generation & Acquisition Channels");

      const lg = report.leadGeneration;

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Current Channels");
      if (lg?.channels?.length) {
        drawTable(
          doc,
          ["Channel", "Leads / Month", "Quality", "Status"],
          lg.channels.map((c: any) => [c.channel, c.leadsPerMonth, c.quality, c.status]),
          [150, 90, 90, 90],
        );
      } else {
        paragraph(doc, "No channel data was detected.");
      }

      if (lg?.missingHighROIChannels?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Missing High-ROI Channels");
        drawTable(
          doc,
          ["Channel", "Est. Leads", "Setup Time", "Monthly Cost", "Priority"],
          lg.missingHighROIChannels.map((c: any) => [c.channel, c.estimatedLeads, c.setupTime, c.monthlyCost, c.priority]),
          [140, 80, 80, 80, 80],
        );
      }

      const magnets = lg?.leadMagnets;
      if (Array.isArray(magnets) && magnets.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Lead Magnets");
        drawTable(
          doc,
          ["Title", "Funnel Stage", "Description", "Est. Conv."],
          magnets.map((m: any) => [
            safeText(m?.title, "—"),
            safeText(m?.funnelStage, "—"),
            safeText(m?.description, "—"),
            safeText(m?.estimatedConversionRate, "—"),
          ]),
          [140, 90, 210, 80],
        );
      } else {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Lead Magnets");
        paragraph(doc, "No lead magnets were detected from the available data sources.");
      }
      /* =========================
         7) COMPETITIVE ANALYSIS/* =========================
         7) COMPETITIVE ANALYSIS
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "7", "Competitive Analysis");

      const ca = report.competitiveAnalysis;

      if (ca?.competitors?.length) {
        ca.competitors.slice(0, 6).forEach((c, idx) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_PURPLE).text(`${idx + 1}. ${safeText(c.name, "Competitor")}`);
          paragraph(doc, `Location: ${safeText((c as any).location, "N/A")} • Team: ${safeText((c as any).teamSize, "N/A")} • Years: ${safeText((c as any).yearsInBusiness, "N/A")}`);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Services");
          bullets(doc, normalizeStringList((c as any).services), "No services detected.");
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Strengths vs You");
          bullets(doc, normalizeStringList((c as any).strengthsVsYou), "No strengths detected.");
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Your Advantages");
          bullets(doc, normalizeStringList((c as any).yourAdvantages), "No advantages detected.");
          paragraph(doc, `Market Overlap: ${safeText((c as any).marketOverlap, "N/A")}`);
          doc.moveDown(0.3);
        });
      } else {
        paragraph(doc, "No competitor data was detected.");
      }

      // Competitive matrix & positioning gap are not available unless you integrate a dedicated competitor-data source.
      // We render the positioning matrix when provided.
      if (Array.isArray(ca?.positioningMatrix) && ca.positioningMatrix.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Positioning Matrix");
        drawTable(
          doc,
          ["Dimension", "You", "Competitor A", "Competitor B", "Competitor C"],
          ca.positioningMatrix.map((m: any) => [
            safeText(m?.dimension, "—"),
            safeText(m?.you, "—"),
            safeText(m?.competitorA, "—"),
            safeText(m?.competitorB, "—"),
            safeText(m?.competitorC, "—"),
          ]),
          [140, 90, 90, 90, 90],
        );
      } else {
        paragraph(doc, "No positioning matrix data was provided.");
      }

      /* =========================
               8) COST OPTIMIZATION/* =========================
               8) COST OPTIMIZATION & PROFITABILITY
            ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "8", "Cost Optimization & Profitability");

      const co = report.costOptimization;

      // Estimated monthly spend
      if (Array.isArray(co?.estimatedMonthlySpend) && co.estimatedMonthlySpend.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Estimated Monthly Spend");
        drawTable(
          doc,
          ["Category", "Current", "Industry Avg", "Notes"],
          co.estimatedMonthlySpend.map((c: any) => [
            safeText(c?.category, "—"),
            safeText(c?.current, "—"),
            safeText(c?.industryAvg, "—"),
            safeText(c?.notes, ""),
          ]),
          [160, 90, 90, 170],
        );
      }

      // Waste areas
      if (Array.isArray(co?.wasteAreas) && co.wasteAreas.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Waste Areas");
        drawTable(
          doc,
          ["Area", "Cost/Month", "Fix", "Impact"],
          co.wasteAreas.map((w: any) => [
            safeText(w?.area, "—"),
            safeText(w?.costPerMonth, "—"),
            safeText(w?.fix, "—"),
            safeText(w?.impact, "—"),
          ]),
          [140, 80, 170, 120],
        );
      }

      // Automation opportunities
      if (Array.isArray(co?.automationOpportunities) && co.automationOpportunities.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Automation Opportunities");
        drawTable(
          doc,
          ["Opportunity", "Tool", "Est. Savings", "Effort"],
          co.automationOpportunities.map((a: any) => [
            safeText(a?.opportunity, "—"),
            safeText(a?.tool, "—"),
            safeText(a?.estimatedSavings, "—"),
            safeText(a?.effort, "—"),
          ]),
          [170, 90, 90, 80],
        );
      }

      paragraph(doc, safeText(co?.notes, ""));

      /* =========================
               9) TARGET MARKET/* =========================
               9) TARGET MARKET & CLIENT INTELLIGENCE
            ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "9", "Target Market & Client Segmentation");

      const tm = report.targetMarket;

      // Current target segments
      if (Array.isArray(tm?.currentTargetSegments) && tm.currentTargetSegments.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Current Target Segments");
        drawTable(
          doc,
          ["Segment", "Avg Budget", "Pain Points"],
          tm.currentTargetSegments.map((s: any) => [
            safeText(s?.segment, "—"),
            safeText(s?.avgBudget, "—"),
            normalizeStringList(s?.painPoints).join("; ") || "—",
          ]),
          [160, 90, 260],
        );
      } else {
        paragraph(doc, "No current target segments were provided.");
      }

      // Recommended segments
      if (Array.isArray(tm?.recommendedSegments) && tm.recommendedSegments.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Recommended Segments");
        drawTable(
          doc,
          ["Segment", "Why Fit", "Avg Budget", "Competition"],
          tm.recommendedSegments.map((s: any) => [
            safeText(s?.segment, "—"),
            safeText(s?.whyFit, "—"),
            safeText(s?.avgBudget, "—"),
            safeText(s?.competitionLevel, "—"),
          ]),
          [130, 190, 80, 90],
        );
      }

      // Positioning advice
      if (Array.isArray(tm?.positioningAdvice) && tm.positioningAdvice.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Positioning Advice");
        bullets(doc, normalizeStringList(tm.positioningAdvice), "—");
      }

      paragraph(doc, safeText(tm?.notes, ""));

      /* =========================
               10) FINANCIAL IMPACT/* =========================
               10) FINANCIAL IMPACT SUMMARY
            ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "10", "Financial Impact");

      const fi = report.financialImpact;

      paragraph(doc, safeText(fi?.notes, ""));

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Revenue & Profitability Summary");
      drawTable(
        doc,
        ["Current Revenue Estimate", "Improvement Potential", "Projected Increase"],
        [[safeText(fi?.currentRevenueEstimate, "—"), safeText(fi?.improvementPotential, "—"), safeText(fi?.projectedRevenueIncrease, "—")]],
        [180, 160, 160],
      );

      if (Array.isArray(fi?.profitabilityLevers) && fi.profitabilityLevers.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Profitability Levers");
        drawTable(
          doc,
          ["Lever", "Impact", "Effort"],
          fi.profitabilityLevers.map((p: any) => [
            safeText(p?.lever, "—"),
            safeText(p?.impact, "—"),
            safeText(p?.effort, "—"),
          ]),
          [180, 220, 100],
        );
      }

      sectionTitle(doc, "11", "90-Day Action Plan"); //sectionTitle(doc, "11", "90-Day Action Plan");

      const apAny = (report as any).actionPlan90Days as any;
      const weekByWeek: any[] = Array.isArray(apAny)
        ? apAny
        : Array.isArray(apAny?.weekByWeek)
          ? apAny.weekByWeek
          : [];

      if (weekByWeek.length) {
        weekByWeek.forEach((w: any, idx: number) => {
          // Support both shapes:
          // - Node schema: { week, focus, actions, expectedOutcome }
          // - Python/or legacy: { weekRange, title, actions, expectedOutcome }
          const weekLabel = safeText(w.week ?? w.weekRange, `Week ${idx + 1}`);
          const focusLabel = safeText(w.focus ?? w.title, "");
          doc.font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(BRAND_PURPLE)
            .text(`${idx + 1}. ${weekLabel}: ${focusLabel}`.trim());
          doc.moveDown(0.2);

          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Actions");
          bullets(doc, normalizeStringList(w.actions), "No actions listed.");

          if (w.expectedOutcome) {
            doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Expected Outcome");
            paragraph(doc, safeText(w.expectedOutcome, ""));
          }
          addPageIfNotAtTop(doc);
        });

        const kpis = Array.isArray(apAny?.kpisToTrack) ? apAny.kpisToTrack : [];
        if (kpis.length) {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("KPIs to Track");
          drawTable(
            doc,
            ["KPI", "Current", "Target"],
            kpis.map((k: any) => [safeText(k.kpi, ""), safeText(k.current, "N/A"), safeText(k.target, "N/A")]),
            [200, 150, 150],
          );
        }
      } else {
        paragraph(doc, "No 90-day action plan was generated for this report.");
      }

      /* =========================
         12) COMPETITIVE ADVANTAGES TO LEVERAGE
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "12", "Competitive Advantages to Leverage");

      const adv = report.competitiveAdvantages;

      if (Array.isArray(adv?.advantages) && adv.advantages.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Advantages");
        drawTable(
          doc,
          ["Advantage", "Why It Matters", "How To Leverage"],
          adv.advantages.map((a: any) => [
            safeText(a?.advantage, "—"),
            safeText(a?.whyItMatters, "—"),
            safeText(a?.howToLeverage, "—"),
          ]),
          [150, 170, 170],
        );
      } else {
        paragraph(doc, "No competitive advantages were identified from the available data sources.");
      }

      if (adv?.uniqueAngle) {
        callout(doc, "Unique Angle", safeText(adv.uniqueAngle, "—"));
      }

      paragraph(doc, safeText(adv?.notes, ""));

      sectionTitle(doc, "13", "Risk Assessment"); sectionTitle(doc, "13", "Risk Assessment");

      const risks = report.riskAssessment?.risks || [];
      if (risks.length) {
        risks.forEach((r: any, i: number) => {
          const title = safeText(r.risk ?? r.name, "Risk");
          doc.font("Helvetica-Bold")
            .fontSize(11)
            .fillColor(BRAND_PURPLE)
            .text(`${i + 1}. ${title}`);

          const sev = safeText(r.severity ?? r.priority, "N/A");
          const lik = safeText(r.likelihood, "N/A");
          paragraph(doc, `Severity: ${sev} • Likelihood: ${lik}`);

          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Mitigation");
          paragraph(doc, safeText(r.mitigation, "No mitigation provided."));

          if (r.notes) paragraph(doc, safeText(r.notes, ""));
        });
      } else {
        paragraph(doc, "No risks were listed in this report.");
      }
      /* =========================
         APPENDICES
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "A", "Appendix A: Keyword Opportunities");

      const kwTiers = report.appendices?.keywords || [];
      if (kwTiers.length) {
        kwTiers.forEach((tierObj) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(safeText(tierObj.tier, "Tier"));
          if (tierObj.keywords?.length) {
            drawTable(
              doc,
              ["Keyword", "Monthly Searches", "Difficulty", "Intent", "Current Rank"],
              tierObj.keywords.map((k: any) => [k.keyword, k.monthlySearches, k.difficulty, k.intent, k.currentRank]),
              [160, 90, 80, 90, 70],
            );
          } else {
            paragraph(doc, "No keywords listed in this tier.");
          }
          addPageIfNotAtTop(doc);
        });
      } else {
        paragraph(doc, "No keyword appendix data was generated.");
      }

      sectionTitle(doc, "B", "Appendix B: Data Sources & Confidence");
      const dataSources = report.appendices?.dataSources || [];
      if (dataSources.length) {
        drawTable(
          doc,
          ["Source", "What we used it for", "Confidence"],
          dataSources.map((s: any) => [safeText(s.source, ""), safeText(s.usedFor, ""), safeText(s.confidence, "")]),
          [140, 260, 90],
        );
      } else {
        paragraph(doc, "No data sources were recorded in this report output.");
      }

      addPageIfNotAtTop(doc);
      sectionTitle(doc, "C", "Appendix C: Data Gaps & How To Enable Tracking");
      const dataGaps = report.appendices?.dataGaps || [];
      if (dataGaps.length) {
        dataGaps.forEach((g: any, idx: number) => {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_PURPLE).text(`${idx + 1}. ${safeText(g.area, "Area")}`);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Missing");
          bullets(doc, normalizeStringList(g.missing), "No missing items listed.");
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("How to Enable");
          bullets(doc, normalizeStringList(g.howToEnable), "No setup steps listed.");
          addPageIfNotAtTop(doc);
        });
      } else {
        paragraph(doc, "No data gaps were recorded in this report output.");
      }

      addPageIfNotAtTop(doc);
      sectionTitle(doc, "D", "Appendix D: Priority Recommendations");

      const pr = report.executiveSummary?.highPriorityRecommendations;
      if (Array.isArray(pr) && pr.length) {
        bullets(doc, normalizeStringList(pr), "—");
      } else {
        paragraph(doc, "No priority recommendations were included in this report output.");
      }

      doc.end();
    } catch (e) {
      reject(e);
    }
  });

  function asArray<T>(v: any): T[] {
    return Array.isArray(v) ? (v as T[]) : [];
  }

}