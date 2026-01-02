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
    const cells = r.map((c) => safeText(c, ""));
    drawRow(cells, doc.y, false, idx % 2 === 0);
  });

  doc.moveDown(0.8);
  resetX(doc);
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

      addPageIfNotAtTop(doc);

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

      addPageIfNotAtTop(doc);

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
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "2.2", "Content Quality Assessment");
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Content Quality Score: ${clampScore(cq?.score)}/100`);
      bullets(doc, normalizeStringList(cq?.strengths), "No content strengths detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Gaps");
      bullets(doc, normalizeStringList(cq?.gaps), "No gaps detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Recommendations");
      bullets(doc, normalizeStringList(cq?.recommendations), "No recommendations available.");

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
         4) REPUTATION & SOCIAL PROOF
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "4", "Reputation & Social Proof Audit");

      const rep = report.reputation;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Overall Review Score: ${safeText(rep?.reviewScore, "—")}/5`);
      doc.font("Helvetica").fontSize(10).fillColor(GRAY_500).text(
        "Based on publicly available review platforms detected during analysis.",
        { lineGap: 2 },
      );
      doc.moveDown(0.4);

      if (rep?.summaryTable?.length) {
        drawTable(
          doc,
          ["Platform", "Reviews", "Rating", "Benchmark", "Gap"],
          rep.summaryTable.map((r) => [r.platform, r.reviews, r.rating, r.industryBenchmark, r.gap]),
          [140, 70, 70, 110, 110],
        );
      } else {
        paragraph(doc, "No review platform data was detected for this website/company.");
      }

      paragraph(doc, `Total Reviews Found: ${safeText(rep?.totalReviews, "—")} • Industry Standard: ${safeText(rep?.industryStandardRange, "—")} • Your Gap: ${safeText(rep?.yourGap, "—")}`);

      const themes = rep?.sentimentThemes;
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
          sp.services.map((s) => [s.name, s.startingPrice, s.targetMarket, s.description]),
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
          sp.serviceGaps.map((g) => [g.service, g.youOffer, g.competitorA, g.competitorB, g.marketDemand]),
          [120, 90, 90, 90, 120],
        );
      }

      const inds = sp?.industriesServed;
      if (inds) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Industries Served");
        bullets(doc, normalizeStringList(inds.current), "No industries detected.");
        paragraph(doc, safeText(inds.concentrationNote, ""));
        if (inds.highValueTargets?.length) {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("High-Value Targets");
          drawTable(
            doc,
            ["Industry", "Why High Value", "Avg Deal Size", "Readiness"],
            inds.highValueTargets.map((t) => [t.industry, t.whyHighValue, t.avgDealSize, t.readiness]),
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
          lg.channels.map((c) => [c.channel, c.leadsPerMonth, c.quality, c.status]),
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
          lg.missingHighROIChannels.map((c) => [c.channel, c.estimatedLeads, c.setupTime, c.monthlyCost, c.priority]),
          [140, 80, 80, 80, 80],
        );
      }

      const magnets = lg?.leadMagnets;
      if (magnets) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Lead Magnets");
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Currently Detected");
        bullets(doc, normalizeStringList(magnets.current), "No current lead magnets detected.");

        if (magnets.recommendations?.length) {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Recommended Lead Magnets");
          drawTable(
            doc,
            ["Name", "Format", "Target Audience", "Est. Conversion"],
            magnets.recommendations.map((r) => [r.name, r.format, r.targetAudience, r.estimatedConversion]),
            [160, 90, 160, 80],
          );
        }
      }

      if (lg?.directoryOptimization?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Directory & Profile Optimization");
        drawTable(
          doc,
          ["Directory", "Listed", "Optimized", "Reviews", "Action Needed"],
          lg.directoryOptimization.map((d) => [d.directory, d.listed, d.optimized, d.reviews, d.actionNeeded]),
          [130, 60, 70, 60, 200],
        );
      }

      /* =========================
         7) COMPETITIVE ANALYSIS
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "7", "Competitive Analysis");

      const ca = report.competitiveAnalysis;

      if (ca?.competitors?.length) {
        ca.competitors.slice(0, 6).forEach((c, idx) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_PURPLE).text(`${idx + 1}. ${safeText(c.name, "Competitor")}`);
          paragraph(doc, `Location: ${safeText(c.location, "N/A")} • Team: ${safeText(c.teamSize, "N/A")} • Years: ${safeText(c.yearsInBusiness, "N/A")}`);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Services");
          bullets(doc, normalizeStringList(c.services), "No services detected.");
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Strengths vs You");
          bullets(doc, normalizeStringList(c.strengthsVsYou), "No strengths detected.");
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Your Advantages");
          bullets(doc, normalizeStringList(c.yourAdvantages), "No advantages detected.");
          paragraph(doc, `Market Overlap: ${safeText(c.marketOverlap, "N/A")}`);
          doc.moveDown(0.3);
        });
      } else {
        paragraph(doc, "No competitor data was detected.");
      }

      if (ca?.competitiveMatrix?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Competitive Matrix");
        drawTable(
          doc,
          ["Factor", "You", "Comp A", "Comp B", "Comp C", "Winner"],
          ca.competitiveMatrix.map((m) => [m.factor, m.you, m.compA, m.compB, m.compC, m.winner]),
          [120, 70, 70, 70, 70, 70],
        );
      }

      if (ca?.positioningGap) {
        callout(
          doc,
          "Positioning Gap",
          `Price: ${safeText(ca.positioningGap.pricePositioning, "N/A")}\nQuality: ${safeText(ca.positioningGap.qualityPositioning, "N/A")}\nVisibility: ${safeText(ca.positioningGap.visibility, "N/A")}\nDifferentiation: ${safeText(ca.positioningGap.differentiation, "N/A")}\n\nRecommendation: ${safeText(ca.positioningGap.recommendation, "N/A")}`,
        );
      }

      /* =========================
         8) COST OPTIMIZATION & PROFITABILITY
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "8", "Cost Optimization & Profitability");

      const co = report.costOptimization;

      if (co?.estimatedCostStructure?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Estimated Cost Structure");
        drawTable(
          doc,
          ["Category", "Monthly", "Annual", "% of Total"],
          co.estimatedCostStructure.map((c) => [c.category, c.monthly, c.annual, c.percentOfTotal]),
          [180, 100, 100, 80],
        );
      }

      if (co?.revenueEstimate) {
        callout(
          doc,
          "Revenue Estimate",
          `Estimated Range: ${safeText(co.revenueEstimate.estimatedRange, "N/A")}\nRevenue/Employee: ${safeText(co.revenueEstimate.revenuePerEmployee, "N/A")}\nBenchmark: ${safeText(co.revenueEstimate.industryBenchmark, "N/A")}\nGap: ${safeText(co.revenueEstimate.gapAnalysis, "N/A")}`,
        );
      }

      if (co?.costSavingOpportunities?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Cost-Saving Opportunities");
        co.costSavingOpportunities.forEach((o, i) => {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_PURPLE).text(`${i + 1}. ${safeText(o.opportunity, "Opportunity")}`);
          doc.font("Helvetica").fontSize(10).fillColor(GRAY_700).text(
            `Current: ${safeText(o.currentCost)} • Potential Savings: ${safeText(o.potentialSavings)} • Difficulty: ${safeText(o.implementationDifficulty)}`,
          );
          paragraph(doc, safeText(o.details, ""));
        });
      }

      const pa = co?.pricingAnalysis;
      if (pa) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Pricing & Packaging Analysis");
        paragraph(doc, `Positioning: ${safeText(pa.positioning, "N/A")}`);
        if (pa.serviceComparisons?.length) {
          drawTable(
            doc,
            ["Service", "Your Price", "Market Range", "Positioning", "Recommendation"],
            pa.serviceComparisons.map((s) => [s.service, s.yourPrice, s.marketRange, s.positioning, s.recommendation]),
            [120, 80, 80, 90, 140],
          );
        }
        bullets(doc, [pa.overallRecommendation, pa.premiumTierOpportunity, pa.packagingOptimization].filter(Boolean) as string[], "No pricing recommendations available.");
      }

      /* =========================
         9) TARGET MARKET & CLIENT INTELLIGENCE
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "9", "Target Market & Client Intelligence");

      const tm = report.targetMarket;

      const cp = tm?.currentClientProfile;
      if (cp) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Current Client Profile");
        drawTable(
          doc,
          ["Geo Mix (US)", "Geo Mix (UK)", "Geo Mix (Other)"],
          [[cp.geographicMix?.us, cp.geographicMix?.uk, cp.geographicMix?.other]],
          [170, 170, 170],
        );
        drawTable(
          doc,
          ["Client Size", "Share"],
          [
            ["Small", cp.clientSize?.small],
            ["Medium", cp.clientSize?.medium],
            ["Large", cp.clientSize?.large],
          ],
          [180, 160],
        );
        if (cp.industries?.length) {
          drawTable(
            doc,
            ["Industry", "Concentration"],
            cp.industries.map((i) => [i.industry, i.concentration]),
            [220, 160],
          );
        }
      }

      const geo = tm?.geographicExpansion;
      if (geo) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Geographic Expansion");
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Current Strong Presence");
        bullets(doc, normalizeStringList(geo.currentStrongPresence), "No strong presence markets detected.");

        if (geo.underpenetratedMarkets?.length) {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Underpenetrated Markets");
          drawTable(
            doc,
            ["Region", "Reason", "Opportunity", "Entry Plan"],
            geo.underpenetratedMarkets.map((m) => [m.region, m.reason, m.estimatedOpportunity, m.entryPlan]),
            [90, 150, 120, 150],
          );
        }
      }

      const icp = tm?.idealClientProfile;
      if (icp) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Ideal Client Profile (ICP)");
        paragraph(doc, `Industry: ${safeText(icp.industry, "N/A")} • Size: ${safeText(icp.companySize, "N/A")} • Revenue: ${safeText(icp.revenueRange, "N/A")} • Budget: ${safeText(icp.budget, "N/A")}`);
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Pain Points");
        bullets(doc, normalizeStringList(icp.painPoints), "No pain points detected.");
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Decision Makers");
        bullets(doc, normalizeStringList(icp.decisionMakers), "No decision makers detected.");
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Where to Find Them");
        bullets(doc, normalizeStringList(icp.whereToFind), "No channels detected.");
      }

      /* =========================
         10) FINANCIAL IMPACT SUMMARY
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "10", "Financial Impact Summary");

      const fi = report.financialImpact;

      if (fi?.revenueOpportunities?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Revenue Opportunities");
        drawTable(
          doc,
          ["Opportunity", "Monthly", "Annual", "Confidence", "Effort"],
          fi.revenueOpportunities.map((r) => [r.opportunity, r.monthlyImpact, r.annualImpact, r.confidence, r.effort]),
          [150, 70, 70, 80, 80],
        );
      }

      if (fi?.costSavings?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Cost Savings");
        drawTable(
          doc,
          ["Initiative", "Annual Savings", "Implementation Cost", "Net Savings"],
          fi.costSavings.map((c) => [c.initiative, c.annualSavings, c.implementationCost, c.netSavings]),
          [170, 90, 90, 90],
        );
      }

      if (fi?.netImpact) {
        callout(
          doc,
          "Net Impact (Modeled)",
          `Revenue Growth: ${safeText(fi.netImpact.revenueGrowth, "N/A")}\nCost Savings: ${safeText(fi.netImpact.costSavings, "N/A")}\nTotal Impact: ${safeText(fi.netImpact.totalImpact, "N/A")}\nInvestment Needed: ${safeText(fi.netImpact.investmentNeeded, "N/A")}\nExpected Return: ${safeText(fi.netImpact.expectedReturn, "N/A")} • ROI: ${safeText(fi.netImpact.roi, "N/A")}`,
        );
      }

      if (fi?.scenarios?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Scenarios");
        drawTable(
          doc,
          ["Scenario", "Implementation", "Impact"],
          fi.scenarios.map((s) => [s.scenario, s.implementationLevel, s.impact]),
          [150, 140, 200],
        );
      }

      /* =========================
         11) 90-DAY ACTION PLAN
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "11", "90-Day Action Plan");

      const ap = report.actionPlan90Days || [];
      if (ap.length) {
        ap.forEach((phaseObj, idx) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_PURPLE).text(`${idx + 1}. ${safeText(phaseObj.phase, "Phase")}`);
          doc.moveDown(0.2);
          (phaseObj.weeks || []).forEach((wk) => {
            doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text(`${safeText(wk.week, "Week")}`);
            bullets(doc, normalizeStringList(wk.tasks), "No tasks listed.");
          });
          if (phaseObj.expectedImpact?.length) {
            doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Expected Impact");
            drawTable(
              doc,
              ["Metric", "Improvement"],
              phaseObj.expectedImpact.map((m) => [m.metric, m.improvement]),
              [220, 220],
            );
          }
          addPageIfNotAtTop(doc);
        });
      } else {
        paragraph(doc, "No 90-day action plan was generated for this report.");
      }

      /* =========================
         12) COMPETITIVE ADVANTAGES TO LEVERAGE
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "12", "Competitive Advantages to Leverage");

      const adv = report.competitiveAdvantages;
      if (adv?.hiddenStrengths?.length) {
        adv.hiddenStrengths.forEach((s, i) => {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_PURPLE).text(`${i + 1}. ${safeText(s.strength, "Strength")}`);
          paragraph(doc, `Evidence: ${safeText(s.evidence, "N/A")}`);
          paragraph(doc, `Why it matters: ${safeText(s.whyItMatters, "N/A")}`);
          paragraph(doc, `How to leverage: ${safeText(s.howToLeverage, "N/A")}`);
        });
      } else {
        paragraph(doc, "No competitive advantages were detected.");
      }
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Prerequisites");
      bullets(doc, normalizeStringList(adv?.prerequisites), "No prerequisites listed.");

      /* =========================
         13) RISK ASSESSMENT
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "13", "Risk Assessment");

      const risks = report.riskAssessment?.risks || [];
      if (risks.length) {
        risks.forEach((r, i) => {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_PURPLE).text(`${i + 1}. ${safeText(r.name, "Risk")} (${safeText(r.priority, "Priority")})`);
          paragraph(doc, safeText(r.description, ""));
          paragraph(doc, `Impact: ${safeText(r.impact, "N/A")} • Likelihood: ${safeText(r.likelihood, "N/A")} • Timeline: ${safeText(r.timeline, "N/A")}`);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Mitigation");
          bullets(doc, normalizeStringList(r.mitigation), "No mitigations listed.");
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
              tierObj.keywords.map((k) => [k.keyword, k.monthlySearches, k.difficulty, k.intent, k.currentRank]),
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

      sectionTitle(doc, "B", "Appendix B: Review Collection Templates");
      const templates = report.appendices?.reviewTemplates || [];
      if (templates.length) {
        templates.forEach((t, i) => {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_PURPLE).text(`${i + 1}. ${safeText(t.name, "Template")}`);
          paragraph(doc, `Subject: ${safeText(t.subject, "")}`);
          callout(doc, "Email / Message Body", safeText(t.body, ""));
        });
      } else {
        paragraph(doc, "No review templates were generated.");
      }

      addPageIfNotAtTop(doc);
      sectionTitle(doc, "C", "Appendix C: Case Study Template");
      const cs = report.appendices?.caseStudyTemplate;
      if (cs) {
        drawTable(
          doc,
          ["Field", "Value"],
          [
            ["Title", cs.title],
            ["Industry", cs.industry],
            ["Services", cs.services],
            ["Duration", cs.duration],
            ["Budget", cs.budget],
          ],
          [140, 320],
        );
        callout(doc, "Challenge", safeText(cs.challenge, ""));
        callout(doc, "Solution", safeText(cs.solution, ""));
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Results");
        bullets(doc, normalizeStringList(cs.results), "No results listed.");
        callout(doc, "Client Quote", safeText(cs.clientQuote, ""));
        callout(doc, "Call To Action", safeText(cs.cta, ""));
      } else {
        paragraph(doc, "No case study template was generated.");
      }

      addPageIfNotAtTop(doc);
      sectionTitle(doc, "D", "Appendix D: Final Recommendations");
      const fr = report.appendices?.finalRecommendations;
      if (fr?.topActions?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("If You Only Do 5 Things (Highest ROI)");
        fr.topActions.slice(0, 5).forEach((a, i) => {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_PURPLE).text(`${i + 1}. ${safeText(a.action, "Action")}`);
          paragraph(doc, `Impact: ${safeText(a.impact, "N/A")} • Effort: ${safeText(a.effort, "N/A")}`);
          paragraph(doc, `Why: ${safeText(a.rationale, "N/A")}`);
        });
      } else {
        paragraph(doc, "No top actions were generated.");
      }

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Next Steps");
      bullets(doc, normalizeStringList(fr?.nextSteps), "No next steps listed.");


      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}