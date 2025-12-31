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

const MARGINS = { top: 54, left: 54, right: 54, bottom: 54 };

function safeText(value: unknown, fallback = "N/A") {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => safeText(v, "")).filter(Boolean);
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
    doc.save();
    doc
      .moveTo(left, h - bottom + 16)
      .lineTo(w - right, h - bottom + 16)
      .lineWidth(1)
      .strokeColor(GRAY_200)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(GRAY_500)
      .text(`Page ${pageNumber - 1}`, left, h - bottom + 24, { align: "left", lineBreak: false });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(GRAY_500)
      .text(`Report ID: ${reportId}`, left, h - bottom + 24, { width: w - left - right, align: "center", lineBreak: false });

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(GRAY_500)
      .text("CONFIDENTIAL", left, h - bottom + 24, { width: w - left - right, align: "right", lineBreak: false });

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
  doc.moveDown(0.5);
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor(GRAY_900)
    .text(`${n}. ${title}`);
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
  doc.font("Helvetica").fontSize(11).fillColor(GRAY_900).text(text, { lineGap: 2 });
  doc.moveDown(0.4);
}

function bullets(doc: PDFKit.PDFDocument, items: string[], emptyMessage = "No data available.") {
  const list = (items || []).filter(Boolean);
  if (!list.length) {
    doc.font("Helvetica").fontSize(11).fillColor(GRAY_500).text(emptyMessage);
    doc.moveDown(0.4);
    return;
  }

  doc.font("Helvetica").fontSize(11).fillColor(GRAY_900);
  list.forEach((it) => {
    doc.text(`• ${it}`, { indent: 10, lineGap: 2 });
  });
  doc.moveDown(0.4);
}

function callout(doc: PDFKit.PDFDocument, title: string, body: string) {
  const x = doc.page.margins.left;
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const startY = doc.y;

  const padding = 12;
  const boxH = 10 + padding * 2 + 40; // will be adjusted by text flow (approx)
  doc.save();
  doc.roundedRect(x, startY, w, boxH, 12).fill(BG_LIGHT);
  doc.restore();

  doc.y = startY + padding;
  doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_PURPLE).text(title, x + padding, doc.y, { width: w - padding * 2 });
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(11).fillColor(GRAY_900).text(body, x + padding, doc.y, { width: w - padding * 2, lineGap: 2 });
  doc.moveDown(0.8);
}

function drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: TableRow[], colWidths?: number[]) {
  const x = doc.page.margins.left;
  const yStart = doc.y;
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
    const bottomLimit = doc.page.height - doc.page.margins.bottom - 40;
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
    const cells = r.map((c) => safeText(c, ""));
    drawRow(cells, doc.y, false, idx % 2 === 0);
  });

  doc.moveDown(0.8);
}

function speedTestTable(speed: WebsiteSpeedTest | undefined) {
  const rows: TableRow[] = [];
  const add = (label: string, m: any) => {
    rows.push([
      label,
      m?.performanceScore ?? "—",
      m?.seoScore ?? "—",
      m?.metrics?.lcpMs ? `${Math.round(m.metrics.lcpMs)} ms` : "—",
      typeof m?.metrics?.cls === "number" ? m.metrics.cls.toFixed(3) : "—",
      m?.metrics?.tbtMs ? `${Math.round(m.metrics.tbtMs)} ms` : "—",
    ]);
  };
  add("Mobile", speed?.mobile);
  add("Desktop", speed?.desktop);
  return rows;
}

export async function generateBusinessGrowthPdfBuffer(report: BusinessGrowthReport): Promise<Buffer> {
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

      doc.moveDown(5.2);
      doc.font("Helvetica").fontSize(10).fillColor(GRAY_500).text(
        "Generated by BrandingBeez • This report is an automated analysis and should be reviewed with a strategist before making major decisions.",
        { align: "left", lineGap: 2 },
      );

      doc.addPage();

      /* =========================
         1) EXECUTIVE SUMMARY
      ========================= */
      sectionTitle(doc, "1", "Executive Summary");

      const strengths = normalizeStringList(report.executiveSummary?.strengths);
      const weaknesses = normalizeStringList(report.executiveSummary?.weaknesses);
      const biggest = safeText(report.executiveSummary?.biggestOpportunity, "No single opportunity identified.");

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

      doc.addPage();

      /* =========================
         2) WEBSITE & DIGITAL PRESENCE
      ========================= */
      sectionTitle(doc, "2", "Website & Digital Presence Analysis");

      const t = report.websiteDigitalPresence?.technicalSEO;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Technical SEO Score: ${clampScore(t?.score)}/100`);
      doc.moveDown(0.3);
      bullets(doc, normalizeStringList(t?.strengths), "No technical strengths detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Issues Found");
      bullets(doc, normalizeStringList(t?.issues), "No issues detected.");

      // Speed test table
      const speed = t?.pageSpeed as WebsiteSpeedTest | undefined;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Page Speed & Core Web Vitals (Real Test)");
      doc.font("Helvetica").fontSize(10).fillColor(GRAY_500).text(
        "Source: Google PageSpeed Insights (Mobile + Desktop). If any values show '—', the test couldn't be fetched at runtime.",
      );
      doc.moveDown(0.4);
      drawTable(doc, ["Strategy", "Perf", "SEO", "LCP", "CLS", "TBT"], speedTestTable(speed), [90, 60, 60, 95, 70, 80]);

      if (speed?.mobile?.opportunities?.length || speed?.desktop?.opportunities?.length) {
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Highest-Impact Speed Opportunities");
        const opps = [
          ...(speed?.mobile?.opportunities || []).map((o) => `Mobile: ${o.title}`),
          ...(speed?.desktop?.opportunities || []).map((o) => `Desktop: ${o.title}`),
        ].slice(0, 10);
        bullets(doc, opps, "No opportunities detected.");
      }

      const cq = report.websiteDigitalPresence?.contentQuality;
      doc.addPage();
      sectionTitle(doc, "2.2", "Content Quality Assessment");
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Content Quality Score: ${clampScore(cq?.score)}/100`);
      bullets(doc, normalizeStringList(cq?.strengths), "No content strengths detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Gaps");
      bullets(doc, normalizeStringList(cq?.gaps), "No gaps detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Recommendations");
      bullets(doc, normalizeStringList(cq?.recommendations), "No recommendations available.");

      const ux = report.websiteDigitalPresence?.uxConversion;
      doc.addPage();
      sectionTitle(doc, "2.3", "UX & Conversion Optimization");
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`UX/Conversion Score: ${clampScore(ux?.score)}/100`);
      bullets(doc, normalizeStringList(ux?.highlights), "No conversion positives detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Issues Holding Back Conversions");
      bullets(doc, normalizeStringList(ux?.issues), "No issues detected.");
      paragraph(doc, `Estimated Uplift: ${safeText(ux?.estimatedUplift, "N/A")}`);

      const gaps = normalizeStringList(report.websiteDigitalPresence?.contentGaps);
      if (gaps.length) {
        doc.addPage();
        sectionTitle(doc, "2.4", "Content Gaps");
        bullets(doc, gaps, "No gaps detected.");
      }

      /* =========================
         3) SEO & ORGANIC VISIBILITY
      ========================= */
      doc.addPage();
      sectionTitle(doc, "3", "SEO & Organic Visibility");

      const da = report.seoVisibility?.domainAuthority;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Domain Authority Score: ${clampScore(da?.score)}/100`);
      if (da?.benchmark) {
        drawTable(
          doc,
          ["Benchmark", "Score"],
          [
            ["You", da.benchmark.you],
            ["Competitor A", da.benchmark.competitorA],
            ["Competitor B", da.benchmark.competitorB],
            ["Competitor C", da.benchmark.competitorC],
            ["Industry Avg", da.benchmark.industryAverage],
          ],
          [240, 120],
        );
      }
      paragraph(doc, safeText(da?.rationale, ""));

      const backlinks = report.seoVisibility?.backlinkProfile;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Backlink Profile");
      drawTable(
        doc,
        ["Metric", "Value"],
        [
          ["Total Backlinks", backlinks?.totalBacklinks],
          ["Referring Domains", backlinks?.referringDomains],
          ["Average DA/DR of Links", backlinks?.averageDA],
        ],
        [240, 120],
      );
      bullets(doc, normalizeStringList(backlinks?.issues), "No backlink issues detected.");

      /* =========================
         FINISH
      ========================= */
      doc.addPage();
      sectionTitle(doc, "13", "Risk Assessment & Next Steps");
      paragraph(
        doc,
        "This report is designed to be actionable. If you want BrandingBeez to help implement the highest-ROI opportunities, book a strategy call and we’ll map the plan into deliverables, timelines, and owners.",
      );

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}