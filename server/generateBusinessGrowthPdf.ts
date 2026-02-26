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

function formatScenarioOutcomes(s: any): string {
  const raw =
    s?.outcomes ??
    s?.modeledOutcomes ??
    s?.modeled_outcomes ??
    s?.modelledOutcomes ??
    s?.modeledOutcome;

  if (Array.isArray(raw)) {
    const parts = raw
      .map((o: any) => {
        if (typeof o === "string") return o.trim();
        const label = safeText(o?.label ?? o?.metric ?? o?.name ?? "", "").trim();
        const value = safeText(o?.value ?? o?.amount ?? o?.result ?? "", "").trim();
        const combined = `${label}${label && value ? ": " : ""}${value}`.trim();
        return combined || "";
      })
      .filter(Boolean);
    return parts.join("\n") || "—";
  }

  if (typeof raw === "string") return raw.trim() || "—";

  if (raw && typeof raw === "object") {
    // Common shape: { summary: "...", items: [...] }
    const summary = typeof raw.summary === "string" ? raw.summary.trim() : "";
    if (summary) return summary;
    const items = Array.isArray((raw as any).items) ? (raw as any).items : null;
    if (items) {
      const parts = items.map((o: any) => safeText(o, "")).filter(Boolean);
      return parts.join("\n") || "—";
    }
  }

  return "—";
}

function isNotAvailableText(v: unknown) {
  const t = typeof v === "string" ? v.trim() : "";
  if (!t) return false;
  const lower = t.toLowerCase();
  return (
    lower.startsWith("not available:") ||
    lower.includes("requires an seo data provider api") ||
    lower.includes("requires backlink provider integration")
  );
}

function isEmptyLike(v: unknown) {
  if (v === null || v === undefined) return true;
  if (typeof v === "number") return !Number.isFinite(v);
  if (typeof v === "boolean") return false;
  const t = String(v).trim();
  if (!t) return true;
  const lower = t.toLowerCase();
  return (
    t === "—" ||
    t === "-" ||
    lower === "n/a" ||
    lower === "na" ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "not available" ||
    isNotAvailableText(t)
  );
}

function cleanTable(headers: string[], rows: TableRow[], opts?: { hideEmptyRows?: boolean; hideEmptyCols?: boolean }) {
  const hideEmptyRows = opts?.hideEmptyRows ?? false;
  const hideEmptyCols = opts?.hideEmptyCols ?? false;

  let h = [...headers];
  let r = rows.map((row) => row.map((c) => c));

  if (hideEmptyRows) {
    r = r.filter((row) => row.some((c) => !isEmptyLike(c)));
  }

  if (hideEmptyCols && h.length) {
    const keepIdx: number[] = [];
    for (let i = 0; i < h.length; i++) {
      const colHasData = r.some((row) => !isEmptyLike(row[i]));
      if (colHasData) keepIdx.push(i);
    }
    const finalIdx = keepIdx.length ? keepIdx : [0];
    h = finalIdx.map((i) => h[i]);
    r = r.map((row) => finalIdx.map((i) => row[i]));
  }

  return { headers: h, rows: r };
}

function fitColWidthsToTable(tableWidth: number, widths: number[]) {
  const w = Math.max(1, tableWidth);
  const raw = widths.map((x) => Math.max(30, Math.floor(Number(x) || 0)));
  const sum = raw.reduce((a, b) => a + b, 0) || 1;

  const scaled = raw.map((x) => Math.floor((x / sum) * w));
  let diff = w - scaled.reduce((a, b) => a + b, 0);

  if (diff !== 0) scaled[scaled.length - 1] = Math.max(30, scaled[scaled.length - 1] + diff);

  return scaled;
}

function formatUrlForDisplay(url: string, max = 80) {
  const u = safeText(url, "");
  if (!u) return "";
  if (u.length <= max) return u;
  return `${u.slice(0, Math.max(0, max - 1))}…`;
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

// Smaller heading used inside a section (e.g., “SEO Recommendations”).
// NOTE: Some patches referenced `subTitle()` but it didn't exist in this file,
// which caused TS compile errors.
function subTitle(doc: PDFKit.PDFDocument, title: string) {
  resetX(doc);
  ensureSpace(doc, 28);
  doc.moveDown(0.4);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(GRAY_900)
    .text(title, doc.page.margins.left, doc.y, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
      align: "left",
    });
  doc.moveDown(0.2);
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

  // Mentor style: if the model provides a "Bottom Line:" segment, we render it as a separate paragraph.
  const raw = (body || "").trim();
  const m = raw.match(/([\s\S]*?)(?:\n\n)?(?:The\s+Bottom\s+Line:|Bottom\s+Line:)([\s\S]*)/i);
  const pre = (m?.[1] || raw).trim();
  const bottom = (m?.[2] || "").trim();

  const titleH = doc.heightOfString(title || "", { width: innerW, lineGap: 2 });
  const preH = doc.heightOfString(pre || "", { width: innerW, lineGap: 2 });
  const bottomLabel = bottom ? "The Bottom Line:" : "";
  const bottomLabelH = bottom ? doc.heightOfString(bottomLabel, { width: innerW, lineGap: 2 }) : 0;
  const bottomH = bottom ? doc.heightOfString(bottom, { width: innerW, lineGap: 2 }) : 0;

  const boxH = padding + titleH + 6 + preH + (bottom ? (10 + bottomLabelH + 2 + bottomH) : 0) + padding;

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

  doc.font("Helvetica").fontSize(11).fillColor(GRAY_900).text(pre, x + padding, doc.y, {
    width: innerW,
    lineGap: 2,
  });

  if (bottom) {
    doc.moveDown(0.6);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_CORAL).text(bottomLabel, x + padding, doc.y, {
      width: innerW,
      lineGap: 2,
    });
    doc.moveDown(0.1);
    doc.font("Helvetica").fontSize(11).fillColor(GRAY_900).text(bottom, x + padding, doc.y, {
      width: innerW,
      lineGap: 2,
    });
  }

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


function drawTable(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: TableRow[],
  colWidths?: number[],
  opts?: { hideEmptyRows?: boolean; hideEmptyCols?: boolean },
) {
  const cleaned = cleanTable(headers, rows, opts);
  const H = cleaned.headers;
  const R = cleaned.rows;

  if (!H.length || (opts?.hideEmptyRows && !R.length)) {
    return;
  }

  const x = doc.page.margins.left;
  ensureSpace(doc, 28);
  const yStart = doc.y;
  const tableW = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const baseWidths =
    colWidths && colWidths.length === headers.length
      ? colWidths
      : H.map(() => Math.floor(tableW / Math.max(1, H.length)));

  // Scale widths to fit exactly inside the table box (prevents overflow/overlap)
  let widths = fitColWidthsToTable(tableW, baseWidths);

  // If we removed columns, re-fit to new column count
  if (widths.length !== H.length) {
    widths = fitColWidthsToTable(tableW, H.map(() => Math.floor(tableW / Math.max(1, H.length))));
  }

  const rowPaddingY = 6;
  const cellPaddingX = 6;

  const drawRow = (cells: string[], y: number, isHeader: boolean, stripe: boolean) => {
    const rowHeight = Math.max(
      18,
      ...cells.map((c, idx) =>
        doc.heightOfString(c, { width: widths[idx] - cellPaddingX * 2, align: "left" }) + rowPaddingY * 2,
      ),
    );

    const bottomLimit = contentBottom(doc) - 10;
    if (y + rowHeight > bottomLimit) {
      doc.addPage();
      // Repeat header row when a table continues on a new page
      if (!isHeader) {
        drawRow(H.map((h) => safeText(h, "")), doc.y, true, false);
      }
      return drawRow(cells, doc.y, isHeader, stripe);
    }

    if (isHeader) {
      doc.save();
      doc.rect(x, y, tableW, rowHeight).fill(BRAND_BLUE);
      doc.restore();
    } else if (stripe) {
      doc.save();
      doc.rect(x, y, tableW, rowHeight).fill("#ffffff");
      doc.restore();
    } else {
      doc.save();
      doc.rect(x, y, tableW, rowHeight).fill(BG_LIGHT);
      doc.restore();
    }

    doc.save();
    doc.rect(x, y, tableW, rowHeight).strokeColor(GRAY_200).lineWidth(1).stroke();
    doc.restore();

    let cx = x;
    cells.forEach((c, idx) => {
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

  drawRow(H.map((h) => safeText(h, "")), yStart, true, false);

  R.forEach((r, idx) => {
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

      const overview = safeText((report as any).executiveSummary?.overview, "");
      if (overview) {
        callout(doc, "Executive Overview", overview);
      }

      const strengths = normalizeStringList(report.executiveSummary?.strengths);
      const weaknesses = normalizeStringList(report.executiveSummary?.weaknesses);
      const mentorSnapshot = safeText((report as any).executiveSummary?.mentorSnapshot, "");
      if (mentorSnapshot && mentorSnapshot !== "N/A") {
        callout(doc, "Mentor Snapshot", mentorSnapshot);
      }

      const biggest = safeText((report as any).executiveSummary?.biggestOpportunity ?? (report as any).executiveSummary?.highPriorityRecommendations?.[0], "No single opportunity identified.");
      if (biggest && biggest !== "N/A") {
        callout(doc, "Biggest Opportunity", biggest);
      }

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

      // Top immediate actions (map from highPriorityRecommendations instead of quickWins)
      const immediate = (report.executiveSummary?.highPriorityRecommendations as any) || [];
      const immediateList = Array.isArray(immediate)
        ? immediate
        : typeof immediate === "string"
          ? [immediate]
          : [];

      const immediateStrings = immediateList
        .map((it: any) => {
          // Support both string[] and object[] shapes
          if (typeof it === "string") return it;
          const t = safeText(it?.title ?? it?.recommendation ?? it?.name, "");
          const d = safeText(it?.details ?? it?.description ?? it?.why, "");
          return [t, d].filter(Boolean).join(" — ");
        })
        .map((x: string) => x.trim())
        .filter((x: string) => x && !isNotAvailableText(x))
        .slice(0, 8);

      if (immediateStrings.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Top Immediate Actions (Next 90 Days)");
        doc.moveDown(0.3);
        bullets(doc, immediateStrings, "—");
      }

      addPageIfNotAtTop(doc);

      /* =========================
         2) WEBSITE & DIGITAL PRESENCE
      ========================= */
      sectionTitle(doc, "2", "Website & Digital Presence Analysis");

      const wdMentor = safeText((report as any)?.websiteDigitalPresence?.mentorNotes, "");
      if (wdMentor && wdMentor !== "N/A") {
        callout(doc, "Mentor Notes", wdMentor);
      }

      const t = report.websiteDigitalPresence?.technicalSEO;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Technical SEO Score: ${clampScore(t?.score)}/100`);
      doc.moveDown(0.3);

      // Optional: show how the score was computed (when available from the engine)
      const techBreakdown = (t as any)?.breakdown as Record<string, number> | undefined;
      if (techBreakdown && typeof techBreakdown === "object") {
        const rows = Object.entries(techBreakdown)
          .map(([k, v]) => [String(k).replace(/_/g, " ").toUpperCase(), String(v)])
          .slice(0, 8);
        if (rows.length) {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Score Breakdown");
          drawTable(doc, ["Component", "Points"], rows, [200, 80]);
        }
      }

      bullets(doc, normalizeStringList((t as any)?.strengths), "No technical strengths detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Issues Found");
      bullets(doc, normalizeStringList(t?.issues), "No issues detected.");

      // Speed test table
      const speed = (t as any)?.pageSpeed as WebsiteSpeedTest | undefined;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Page Speed & Core Web Vitals (Real Test)");
      doc.moveDown(0.4);
      drawTable(doc, ["Strategy", "Perf", "SEO", "LCP", "CLS", "TBT"], speedTestTable(speed), [90, 60, 60, 95, 70, 80]);

      // Some runs also include a derived/normalized speed performance object
      const speedPerf = (report as any)?.websiteDigitalPresence?.speedPerformance;
      if (speedPerf && typeof speedPerf === "object") {
        const spScore = (speedPerf as any)?.score;
        const spNotes = safeText((speedPerf as any)?.notes, "");
        if (spScore !== undefined || spNotes) {
          callout(
            doc,
            "Speed Performance (Derived)",
            `${spScore !== undefined ? `Score: ${clampScore(spScore)}/100` : ""}${spNotes ? `\n${spNotes}` : ""}`.trim(),
          );
        }
      }

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

      // Optional richer UI/UX micro-audit (Python engine)
      const uxAny: any = ux as any;
      const uxDetails: any = uxAny?.details;
      if (uxDetails && typeof uxDetails === "object" && Object.keys(uxDetails).length) {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("UI/UX Micro-Audit (Homepage)");

        const perf = uxDetails.performance || {};
        const acc = uxDetails.accessibility || {};
        const mob = uxDetails.mobile || {};

        // Small metrics table (best-effort)
        drawTable(
          doc,
          ["Metric", "Value"],
          [
            ["Page Size (KB)", safeText(perf.page_size_kb, "—")],
            ["Scripts", safeText(perf.scripts_count, "—")],
            ["Stylesheets", safeText(perf.stylesheets_count, "—")],
            ["Images", safeText(perf.images_count, "—")],
            ["Images missing ALT", safeText(acc.images_without_alt, "—")],
            ["H1 Count", safeText((acc.heading_structure || {}).h1, "—")],
            ["Has Viewport Meta", safeText(mob.has_viewport, "—")],
          ],
          [220, 240],
        );

        const recs = normalizeStringList(uxAny?.recommendations);
        if (recs.length) {
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Top UX Fixes");
          bullets(doc, recs, "—");
        }
      }


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

      const seoMentor = safeText((report as any)?.seoVisibility?.mentorNotes, "");
      if (seoMentor && seoMentor !== "N/A") {
        callout(doc, "Mentor Notes", seoMentor);
      }

      const da = report.seoVisibility?.domainAuthority;
      const daScore = typeof da?.score === "number" ? clampScore(da.score) : null;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Domain Authority Score: ${daScore !== null ? `${daScore}/100` : "N/A"}`);
      const daSource = (da as any)?.source as string | undefined;
      if (daSource) {
        doc.font("Helvetica").fontSize(10).fillColor(GRAY_600).text(`Source: ${daSource}`);
      }
      const daMentor = safeText((da as any)?.mentorNotes, "");
      if (daMentor && !isNotAvailableText(daMentor) && daMentor !== "N/A") {
        callout(doc, "Mentor Notes", daMentor);
      }
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
      const daNotes = safeText(da?.notes, "");
      if (daNotes && !isNotAvailableText(daNotes) && daNotes !== "N/A") paragraph(doc, daNotes);

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
      const blMentor = safeText((backlinks as any)?.mentorNotes, "");
      if (blMentor && !isNotAvailableText(blMentor) && blMentor !== "N/A") {
        callout(doc, "Mentor Notes", blMentor);
      }
      const blNotes = safeText(backlinks?.notes, "");
      if (blNotes && !isNotAvailableText(blNotes) && blNotes !== "N/A") paragraph(doc, blNotes);

      // Google Search Console (optional)
      const gsc = (report.seoVisibility as any)?.searchConsole;
      if (gsc && (gsc?.totals || (gsc?.topQueries && gsc.topQueries.length) || (gsc?.topPages && gsc.topPages.length))) {
        doc.moveDown(0.8);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Google Search Console");
        const range = gsc?.dateRange ? `${safeText(gsc.dateRange.start, "")} to ${safeText(gsc.dateRange.end, "")}` : "";
        if (range || gsc?.property) {
          paragraph(
            doc,
            `${gsc?.property ? `Property: ${safeText(gsc.property, "")}` : ""}${gsc?.property && range ? " • " : ""}${range ? `Date range: ${range}` : ""}`,
          );
        }

        if (gsc?.totals) {
          drawTable(
            doc,
            ["Metric", "Value"],
            [
              ["Clicks", gsc.totals.clicks ?? "N/A"],
              ["Impressions", gsc.totals.impressions ?? "N/A"],
              ["CTR", gsc.totals.ctr != null ? `${Math.round(gsc.totals.ctr * 1000) / 10}%` : "N/A"],
              ["Avg Position", gsc.totals.position != null ? `${Math.round(gsc.totals.position * 10) / 10}` : "N/A"],
            ],
            [240, 120],
          );
        }

        if (gsc?.topQueries?.length) {
          doc.moveDown(0.4);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Top Queries");
          drawTable(
            doc,
            ["Query", "Clicks", "Impr.", "CTR", "Pos"],
            gsc.topQueries.slice(0, 10).map((r: any) => [
              safeText(r.query, "N/A"),
              r.clicks ?? "N/A",
              r.impressions ?? "N/A",
              r.ctr != null ? `${Math.round(r.ctr * 1000) / 10}%` : "N/A",
              r.position != null ? `${Math.round(r.position * 10) / 10}` : "N/A",
            ]),
            [220, 60, 60, 50, 50],
          );
        }

        if (gsc?.topPages?.length) {
          doc.moveDown(0.4);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Top Pages");
          drawTable(
            doc,
            ["Page", "Clicks", "Impr.", "CTR", "Pos"],
            gsc.topPages.slice(0, 10).map((r: any) => [
              safeText(r.page, "N/A"),
              r.clicks ?? "N/A",
              r.impressions ?? "N/A",
              r.ctr != null ? `${Math.round(r.ctr * 1000) / 10}%` : "N/A",
              r.position != null ? `${Math.round(r.position * 10) / 10}` : "N/A",
            ]),
            [220, 60, 60, 50, 50],
          );
        }
      }

      /* =========================
               4) REPUTATION/* =========================
               4) REPUTATION & SOCIAL PROOF
            ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "4", "Reputation & Social Proof Audit");

      const repMentor = safeText((report as any)?.reputation?.mentorNotes, "");
      if (repMentor && repMentor !== "N/A") {
        callout(doc, "Mentor Notes", repMentor);
      }

      const rep = report.reputation;
      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(`Overall Review Score: ${safeText((rep as any)?.reviewScore, "—")}/5`);
      doc.font("Helvetica").fontSize(10).fillColor(GRAY_500).text(
        "Based on publicly available review platforms detected during analysis.",
        { lineGap: 2 },
      );
      doc.moveDown(0.4);

      const summaryRaw = (rep as any)?.summaryTable;
      const summary = Array.isArray(summaryRaw)
        ? summaryRaw.filter((r: any) => {
            const n = Number(r?.reviews ?? r?.reviewCount ?? r?.count ?? 0);
            return Number.isFinite(n) && n > 0;
          })
        : [];

      if (summary.length) {
        drawTable(
          doc,
          ["Platform", "Reviews", "Rating", "Benchmark", "Gap"],
          summary.map((r: any) => [r.platform, r.reviews, r.rating, r.industryBenchmark, r.gap]),
          [140, 70, 70, 110, 110],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      }

      // paragraph(doc, `Total Reviews Found: ${safeText((rep as any)?.totalReviews, "—")} • Industry Standard: ${safeText((rep as any)?.industryStandardRange, "—")} • Your Gap: ${safeText((rep as any)?.yourGap, "—")}`);
      keyMetricsBox(doc, [
        { label: "Total Reviews Found", value: String((rep as any)?.totalReviews ?? "—") },
        { label: "Industry Standard", value: safeText((rep as any)?.industryStandardRange, "—") },
        { label: "Your Gap", value: safeText((rep as any)?.yourGap, "—") },
      ]);


      const themes = (rep as any)?.sentimentThemes;
      resetX(doc);
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Positive Themes", { align: "left" });
      bullets(doc, normalizeStringList(themes?.positive), "No positive themes detected.");
      doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Negative Themes");
      bullets(doc, normalizeStringList(themes?.negative), "No negative themes detected.");
      paragraph(doc, `Response Rate: ${safeText(themes?.responseRate, "N/A")} • Avg Response Time: ${safeText(themes?.averageResponseTime, "N/A")}`);

      // Improvement suggestions (only when provided)
      const repSuggestionsMain = (report as any)?.reputation?.improvementSuggestions;
      const repSugList = normalizeStringList(repSuggestionsMain);
      if (repSugList.length) {
        doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Improvement Suggestions");
        bullets(doc, repSugList.slice(0, 14), "—");
      }


      /* =========================
         5) SERVICE OFFERINGS & MARKET POSITIONING
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "5", "Service Offerings & Market Positioning");

      const spMentor = safeText((report as any)?.servicesPositioning?.mentorNotes, "");
      if (spMentor && spMentor !== "N/A") {
        callout(doc, "Mentor Notes", spMentor);
      }

      const sp = report.servicesPositioning;

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Current Service Menu");
      if (sp?.services?.length) {
        drawTable(
          doc,
          ["Service", "Starting Price", "Target Market", "Description"],
          sp.services.map((s: any) => [s.name, s.startingPrice, s.targetMarket, s.description]),
          [130, 90, 120, 190],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      } else {
        paragraph(doc, "No service list data was detected.");
      }

      if (sp?.serviceGaps?.length) {
        // Hide this table entirely when "You" and competitor columns have no usable data
        const meaningful = sp.serviceGaps.filter((g: any) => {
          const you = g?.youOffer;
          const a = g?.competitorA;
          const b = g?.competitorB;
          const service = g?.service;
          const demand = g?.marketDemand;
          return !(
            isEmptyLike(service) ||
            (isEmptyLike(you) && isEmptyLike(a) && isEmptyLike(b) && isEmptyLike(demand))
          );
        });

        if (meaningful.length) {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Service Gaps vs Market");
          drawTable(
            doc,
            ["Service", "You", "Competitor A", "Competitor B", "Market Demand"],
            meaningful.map((g: any) => [g.service, g.youOffer, g.competitorA, g.competitorB, g.marketDemand]),
            [120, 90, 90, 90, 120],
            { hideEmptyRows: true, hideEmptyCols: true },
          );
        }
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
        const current = safeText(pos.currentStatement, "N/A");
        const comp = safeText(pos.competitorComparison, "N/A");
        const diff = safeText(pos.differentiation, "N/A");

        const parts: string[] = [];
        if (!isEmptyLike(current) && current !== "N/A") parts.push(`Current: ${current}`);
        if (!isEmptyLike(comp) && comp !== "N/A") parts.push(`Competitors: ${comp}`);
        if (!isEmptyLike(diff) && diff !== "N/A") parts.push(`Differentiation: ${diff}`);

        if (parts.length) {
          callout(doc, "Positioning Snapshot", parts.join("\n\n"));
        }
      }

      /* =========================
         6) LEAD GENERATION & ACQUISITION CHANNELS
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "6", "Lead Generation & Acquisition Channels");

      const lgMentor = safeText((report as any)?.leadGeneration?.mentorNotes, "");
      if (lgMentor && lgMentor !== "N/A") {
        callout(doc, "Mentor Notes", lgMentor);
      }

      const lg = report.leadGeneration;

      doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Current Channels");
      if (lg?.channels?.length) {
        drawTable(
          doc,
          ["Channel", "Leads / Month", "Quality", "Status"],
          lg.channels.map((c: any) => [c.channel, c.leadsPerMonth, c.quality, c.status]),
          [150, 90, 90, 90],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      } else {
        paragraph(doc, "No channel data was detected.");
      }

      if (lg?.missingHighROIChannels?.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Missing High-ROI Channels");
        drawTable(
          doc,
          ["Channel", "Est. Leads", "Setup Time", "Monthly Cost", "Priority"],
          lg.missingHighROIChannels.map((c: any) => [
              safeText(c.channel, "—"),
              safeText(c.estimatedLeads ?? c.potentialLeads ?? c.leads, "—"),
              safeText(c.setupTime, "—"),
              safeText(c.monthlyCost, "—"),
              safeText(c.priority, "—"),
            ]),
          [140, 80, 80, 80, 80],
          { hideEmptyRows: true, hideEmptyCols: true },
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
          { hideEmptyRows: true, hideEmptyCols: true },
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

      const caMentor = safeText((report as any)?.competitiveAnalysis?.mentorNotes, "");
      if (caMentor && caMentor !== "N/A") {
        callout(doc, "Mentor Notes", caMentor);
      }

      const ca = report.competitiveAnalysis;

      if (ca?.competitors?.length) {
        ca.competitors.slice(0, 6).forEach((c, idx) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_PURPLE).text(`${idx + 1}. ${safeText(c.name, "Competitor")}`);

          // Backward-compatible rendering:
          // - If competitor came from Google Places mapping, show rating/address/phone.
          // - Else, keep supporting the older fields (location/team/years/services...).
          const addr = safeText((c as any).formattedAddress || (c as any).address || (c as any).location, "N/A");
          const rating = (c as any).rating;
          const reviews = (c as any).userRatingsTotal;
          const phone = safeText((c as any).internationalPhoneNumber || (c as any).phone, "N/A");
          const website = safeText((c as any).website, "N/A");
          const team = safeText((c as any).teamSize, "N/A");
          const years = safeText((c as any).yearsInBusiness, "N/A");

          const metaParts: string[] = [];
          if (addr && addr !== "N/A") metaParts.push(`Location: ${addr}`);
          if (typeof rating === "number") metaParts.push(`Rating: ${rating.toFixed(1)}${typeof reviews === "number" ? ` (${reviews})` : ""}`);
          if (website && website !== "N/A") metaParts.push(`Website: ${website}`);
          if (phone && phone !== "N/A") metaParts.push(`Phone: ${phone}`);
          if (team && team !== "N/A") metaParts.push(`Team: ${team}`);
          if (years && years !== "N/A") metaParts.push(`Years: ${years}`);
          paragraph(doc, metaParts.length ? metaParts.join(" • ") : "N/A");

          // Prefer explicit competitive analysis fields if they exist.
          const services = normalizeStringList((c as any).services);
          if (services.length) {
            doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Services");
            bullets(doc, services, "No services detected.");
          }

          const strengthsVsYou = normalizeStringList((c as any).strengthsVsYou);
          const yourAdvantages = normalizeStringList((c as any).yourAdvantages);
          if (strengthsVsYou.length) {
            doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Strengths vs You");
            bullets(doc, strengthsVsYou, "No strengths detected.");
          }
          if (yourAdvantages.length) {
            doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Your Advantages");
            bullets(doc, yourAdvantages, "No advantages detected.");
          }

          // If mapped from Places, show a couple of recent reviews (optional).
          const topReviews = Array.isArray((c as any).topReviews) ? (c as any).topReviews : [];
          if (topReviews.length) {
            doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY_900).text("Recent Reviews (sample)");
            const rvLines = topReviews
              .slice(0, 2)
              .map((r: any) => {
                const a = safeText(r?.author_name, "Anonymous");
                const rt = typeof r?.rating === "number" ? `${r.rating}/5` : "—";
                const when = safeText(r?.relative_time_description, "");
                const txt = safeText(r?.text, "").replace(/\s+/g, " ").trim();
                const short = txt.length > 140 ? `${txt.slice(0, 140)}…` : txt;
                return `${a} (${rt}${when ? `, ${when}` : ""}): ${short || "—"}`;
              })
              .filter(Boolean);
            bullets(doc, rvLines, "No reviews available.");
          }

          const overlap = safeText((c as any).marketOverlap, "");
          if (overlap) paragraph(doc, `Market Overlap: ${overlap}`);
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

      const coMentor = safeText((report as any)?.costOptimization?.mentorNotes, "");
      if (coMentor && coMentor !== "N/A") {
        callout(doc, "Mentor Notes", coMentor);
      }

      const co = report.costOptimization;

      // Estimation Mode meta (optional)
      const coAny: any = co as any;
      if (coAny?.estimationDisclaimer) {
        callout(doc, "Estimation Mode Disclaimer", safeText(coAny.estimationDisclaimer, ""));
      }
      if (typeof coAny?.confidenceScore === "number") {
        paragraph(doc, `Confidence Score: ${coAny.confidenceScore}/100`);
      }
      if (Array.isArray(coAny?.scenarios) && coAny.scenarios.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Scenarios");
        drawTable(
          doc,
          ["Scenario", "Suggestion", "Modeled Outcomes"],
          coAny.scenarios.map((s: any) => [
            safeText(s?.name, "—"),
            normalizeStringList(s?.assumptions).join("; ") || "—",
            formatScenarioOutcomes(s),
          ]),
          [90, 210, 220],
        );
      }

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
              safeText(a?.opportunity ?? a?.process ?? a?.title ?? a?.name, "—"),
              safeText(a?.tool ?? a?.tools ?? a?.recommendedTool, "—"),
              safeText(a?.estimatedSavings ?? a?.costSaved ?? a?.savings, "—"),
              safeText(a?.effort ?? a?.timeSavedPerMonth ?? a?.time ?? a?.difficulty, "—"),
            ]),
          [170, 90, 90, 80],
        );
      }

      
      // Python AI Engine schema compatibility: opportunities[]
      if (Array.isArray((coAny as any)?.opportunities) && (coAny as any).opportunities.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Opportunities");
        drawTable(
          doc,
          ["Opportunity", "Description", "Impact", "Effort"],
          (coAny as any).opportunities.map((o: any) => [
            safeText(o?.title || o?.opportunity || o?.name, "—"),
            safeText(o?.description || o?.details || o?.why, "—"),
            safeText(o?.impact || o?.savings || o?.estimatedSavings, "—"),
            safeText(o?.effort || o?.difficulty || o?.time, "—"),
          ]),
          [140, 200, 90, 90],
        );
      }

paragraph(doc, safeText(co?.notes, ""));

      /* =========================
               9) TARGET MARKET/* =========================
               9) TARGET MARKET & CLIENT INTELLIGENCE
            ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "9", "Target Market & Client Segmentation");

      const tmMentor = safeText((report as any)?.targetMarket?.mentorNotes, "");
      if (tmMentor && tmMentor !== "N/A") {
        callout(doc, "Mentor Notes", tmMentor);
      }

      const tm = report.targetMarket;

      // Estimation Mode meta (optional)
      const tmAny: any = tm as any;
      if (tmAny?.estimationDisclaimer) {
        callout(doc, "Estimation Mode Disclaimer", safeText(tmAny.estimationDisclaimer, ""));
      }
      if (typeof tmAny?.confidenceScore === "number") {
        paragraph(doc, `Confidence Score: ${tmAny.confidenceScore}/100`);
      }
      if (Array.isArray(tmAny?.scenarios) && tmAny.scenarios.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Scenarios");
        drawTable(
          doc,
          ["Scenario", "Suggestion", "Modeled Outcomes"],
          tmAny.scenarios.map((s: any) => [
            safeText(s?.name, "—"),
            normalizeStringList(s?.assumptions).join("; ") || "—",
            Array.isArray(s?.outcomes)
              ? s.outcomes
                .map((o: any) => `${safeText(o?.label, "")} : ${safeText(o?.value, "")}`.replace(" :", ":").trim())
                .filter(Boolean)
                .join("\n") || "—"
              : "—",
          ]),
          [90, 210, 220],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      }

      // Current target segments (Node schema) OR segments[] (Python AI Engine schema)
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
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      } else if (Array.isArray((tmAny as any)?.segments) && (tmAny as any).segments.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Detected Segments");
        drawTable(
          doc,
          ["Segment", "Pain Points", "Budget/Notes"],
          (tmAny as any).segments.map((s: any) => [
            safeText(s?.segment || s?.name, "—"),
            normalizeStringList(s?.painPoints || s?.pains || s?.problems).join("; ") || "—",
            safeText(s?.avgBudget || s?.budget || s?.notes, "—"),
          ]),
          [160, 240, 110],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      } else {
        paragraph(doc, "No target segments were provided.");
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

      // Estimation Mode meta (optional)
      const fiAny: any = fi as any;
      if (fiAny?.estimationDisclaimer) {
        callout(doc, "Estimation Mode Disclaimer", safeText(fiAny.estimationDisclaimer, ""));
      }
      if (typeof fiAny?.confidenceScore === "number") {
        paragraph(doc, `Confidence Score: ${fiAny.confidenceScore}/100`);
      }
      if (Array.isArray(fiAny?.scenarios) && fiAny.scenarios.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Scenarios");
        drawTable(
          doc,
          ["Scenario", "Suggestion", "Modeled Outcomes"],
          fiAny.scenarios.map((s: any) => [
            safeText(s?.name, "—"),
            normalizeStringList(s?.assumptions).join("; ") || "—",
            Array.isArray(s?.outcomes)
              ? s.outcomes
                .map((o: any) => `${safeText(o?.label, "")} : ${safeText(o?.value, "")}`.replace(" :", ":").trim())
                .filter(Boolean)
                .join("\n") || "—"
              : "—",
          ]),
          [90, 210, 220],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      }

      paragraph(doc, safeText(fi?.notes, ""));

            const revA = safeText(fi?.currentRevenueEstimate, "—");
      const revB = safeText(fi?.improvementPotential, "—");
      const revC = safeText(fi?.projectedRevenueIncrease, "—");

      const hasRevSummary = !isEmptyLike(revA) || !isEmptyLike(revB) || !isEmptyLike(revC);

      if (hasRevSummary) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Revenue & Profitability Summary");
        drawTable(
          doc,
          ["Current Revenue Estimate", "Improvement Potential", "Projected Increase"],
          [[revA, revB, revC]],
          [180, 160, 160],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      }

      // Python AI Engine schema compatibility: revenueTable[]
      if (Array.isArray((fiAny as any)?.revenueTable) && (fiAny as any).revenueTable.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Revenue Table");
        drawTable(
          doc,
          ["Metric", "Value"],
          (fiAny as any).revenueTable.map((r: any) => [
            safeText(r?.label || r?.metric || r?.name, "—"),
            safeText(r?.value || r?.amount, "—"),
          ]),
          [220, 260],
          { hideEmptyRows: true, hideEmptyCols: true },
        );
      }


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

      sectionTitle(doc, "11", "90-Day Action Plan");

      const apMentor = safeText((report as any)?.actionPlan90Days?.mentorNotes, "");
      if (apMentor && apMentor !== "N/A") {
        callout(doc, "Mentor Notes", apMentor);
      } //sectionTitle(doc, "11", "90-Day Action Plan");

      // const apMentor = safeText((report as any)?.actionPlan90Days?.mentorNotes, "");
      // if (apMentor && apMentor !== "N/A") {
      //   callout(doc, "Mentor Notes", apMentor);
      // }

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

      const advMentor = safeText((report as any)?.competitiveAdvantages?.mentorNotes, "");
      if (advMentor && advMentor !== "N/A") {
        callout(doc, "Mentor Notes", advMentor);
      }

      const adv = report.competitiveAdvantages;

      const advItems = Array.isArray((adv as any)?.advantages) ? (adv as any).advantages : [];
      if (advItems.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Advantages");

        // Support both object[] and string[]
        const isObjectShape = typeof advItems[0] === "object" && advItems[0] !== null;

        if (isObjectShape) {
          drawTable(
            doc,
            ["Advantage", "Why It Matters", "How To Leverage"],
            advItems.map((a: any) => [
              safeText(a?.advantage ?? a?.title ?? a?.name, "—"),
              safeText(a?.whyItMatters ?? a?.why ?? a?.value, "—"),
              safeText(a?.howToLeverage ?? a?.how ?? a?.action, "—"),
            ]),
            [150, 170, 170],
            { hideEmptyRows: true, hideEmptyCols: true },
          );
        } else {
          bullets(doc, normalizeStringList(advItems).slice(0, 20), "—");
        }
      }

      if (adv?.uniqueAngle) {
        callout(doc, "Unique Angle", safeText(adv.uniqueAngle, "—"));
      }


      sectionTitle(doc, "13", "Risk Assessment");

      const riskMentor = safeText((report as any)?.riskAssessment?.mentorNotes, "");
      if (riskMentor && riskMentor !== "N/A") {
        callout(doc, "Mentor Notes", riskMentor);
      } //sectionTitle(doc, "13", "Risk Assessment");

      // const riskMentor = safeText((report as any)?.riskAssessment?.mentorNotes, "");
      // if (riskMentor && riskMentor !== "N/A") {
      //   callout(doc, "Mentor Notes", riskMentor);
      // }

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
      sectionTitle(doc, "A", "Appendix A: Evidence & Crawl Snapshot");

      // Evidence (screenshots / crawl list / timestamps)
      // const evidence = report.appendices?.evidence || {};
      // const pagesCrawled = Array.isArray(report.appendices?.pagesCrawled) ? report.appendices.pagesCrawled : [];
      // const psiAt = evidence?.pagespeed?.fetchedAt || report.pagespeed?.fetchedAt;
      const appendices = (report as any)?.appendices || {};
      const evidence = appendices?.evidence || {};
      const pagesCrawled = Array.isArray(appendices?.pagesCrawled) ? appendices.pagesCrawled : [];

      const psiAt =
        evidence?.pagespeed?.fetchedAt ||
        (report as any)?.pagespeed?.fetchedAt;


      if (psiAt) {
        callout(doc, "PageSpeed Snapshot", `Fetched at: ${safeText(psiAt, "—")}`);
      }

      // Page Registry (key pages + counts)
      const pageRegistry = evidence?.pageRegistry;
      if (pageRegistry && typeof pageRegistry === "object") {
        const counts = (pageRegistry as any)?.counts;
        if (counts && typeof counts === "object") {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Crawl Registry Summary");
          drawTable(
            doc,
            ["Merged", "Links", "Crawl", "Sitemap", "Service Candidates"],
            [[
              safeText((counts as any)?.merged, "—"),
              safeText((counts as any)?.links, "—"),
              safeText((counts as any)?.crawl, "—"),
              safeText((counts as any)?.sitemap, "—"),
              safeText((counts as any)?.service_candidates, "—"),
            ]],
            [70, 70, 70, 70, 130],
          );
        }

        const pages = (pageRegistry as any)?.pages;
        if (pages && typeof pages === "object") {
          const keyRows: TableRow[] = [];
          const labels: Record<string, string> = {
            home: "Home",
            about: "About",
            contact: "Contact",
            services: "Services",
            pricing: "Pricing",
            faq: "FAQ",
            blog: "Blog",
            proof: "Case Studies/Proof",
          };
          for (const k of Object.keys(labels)) {
            const node = (pages as any)[k];
            if (!node) continue;
            const primary = node?.primary || node?.url || "—";
            const present = node?.present;
            const presentText = typeof present === "boolean" ? (present ? "Yes" : "No") : "—";
            keyRows.push([labels[k], presentText, formatUrlForDisplay(safeText(primary, "—"), 85)]);
          }
          if (keyRows.length) {
            doc.moveDown(0.5);
            doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Key Pages Detected");
            drawTable(doc, ["Page", "Present", "Primary URL"], keyRows, [120, 70, 300]);
          }
        }
      }

      // Extraction snapshot (how links/content were collected)
      const extraction = evidence?.extraction;
      if (extraction && typeof extraction === "object") {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Extraction Snapshot");
        const le = (extraction as any)?.linksEngine || {};
        drawTable(
          doc,
          ["Signal", "Value"],
          [
            ["Site Type", safeText((extraction as any)?.siteType, "—")],
            ["Playwright Enabled", safeText(le?.playwrightEnabled, "—")],
            ["Selenium Enabled", safeText(le?.seleniumEnabled, "—")],
            ["Content Pages Used Playwright", safeText((extraction as any)?.contentPagesUsedPlaywright, "—")],
          ],
          [200, 290],
        );
      }

      if (pagesCrawled.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Pages crawled (sample)");
        bullets(doc, pagesCrawled.slice(0, 25), "—");
      } else {
        paragraph(doc, "No crawl list was captured.");
      }

      // Screenshots (base64 PNGs)
      try {
        const shots = evidence?.screenshots?.screenshots || evidence?.screenshots || {};
        const desktopB64 = shots?.desktop?.b64 || shots?.desktop;
        const mobileB64 = shots?.mobile?.b64 || shots?.mobile;

        if (desktopB64) {
          addPageIfNotAtTop(doc);
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Desktop screenshot");
          const buf = Buffer.from(desktopB64, "base64");
          doc.image(buf, { fit: [520, 300], align: "center" });
        }
        if (mobileB64) {
          addPageIfNotAtTop(doc);
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Mobile screenshot");
          const buf = Buffer.from(mobileB64, "base64");
          doc.image(buf, { fit: [320, 520], align: "center" });
        }
      } catch (e) {
        paragraph(doc, "Screenshots were not available for this run.");
      }

      // Appendix B: only render when at least one tier has keyword data
      const kwTiers = report.appendices?.keywords || [];
      const kwHasData = Array.isArray(kwTiers) && kwTiers.some((t: any) => Array.isArray(t?.keywords) && t.keywords.length);

      if (kwHasData) {
        addPageIfNotAtTop(doc);
        sectionTitle(doc, "B", "Appendix B: Keyword Opportunities");

        kwTiers.forEach((tierObj: any) => {
          const kws = Array.isArray(tierObj?.keywords) ? tierObj.keywords : [];
          if (!kws.length) return;

          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(safeText(tierObj.tier, "Tier"));
          drawTable(
            doc,
            ["Keyword", "Monthly Searches", "Difficulty", "Intent", "Current Rank"],
            kws.map((k: any) => [k.keyword, k.monthlySearches, k.difficulty, k.intent, k.currentRank]),
            [160, 90, 80, 90, 70],
            { hideEmptyRows: true, hideEmptyCols: true },
          );
          addPageIfNotAtTop(doc);
        });
      }

      sectionTitle(doc, "C", "Appendix C: Data Sources & Confidence");
      const dataSources = report.appendices?.dataSources || [];
      if (dataSources.length) {
        drawTable(
          doc,
          ["Source", "What we used it for", "Confidence"],
          dataSources.map((s: any) => [safeText(s.source, ""), safeText(s.usedFor ?? s.use, ""), safeText(s.confidence, "")]),
          [140, 260, 90],
        );
      } else {
        paragraph(doc, "No data sources were recorded in this report output.");
      }

      addPageIfNotAtTop(doc);
      sectionTitle(doc, "E", "Appendix E: Priority Recommendations");

      const pr = report.executiveSummary?.highPriorityRecommendations;
      if (Array.isArray(pr) && pr.length) {
        bullets(doc, normalizeStringList(pr), "—");
      } else {
        paragraph(doc, "No priority recommendations were included in this report output.");
      }

      /* =========================
         APPENDIX F: On-Page + Lighthouse SEO (detailed)
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "F", "Appendix F: On-Page SEO & Lighthouse Signals");

      const onPage = (report as any)?.seoVisibility?.onPage;
      const lighthouseSeo = (report as any)?.seoVisibility?.lighthouse;

      if (onPage && typeof onPage === "object") {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("On-Page SEO Checks");

        const rows: TableRow[] = [];
        // Render common keys if present; otherwise show whatever is available.
        const candidates: { key: string; label: string }[] = [
          { key: "titleTags", label: "Title Tags" },
          { key: "metaDescriptions", label: "Meta Descriptions" },
          { key: "headings", label: "Headings (H1/H2)" },
          { key: "canonicals", label: "Canonical Tags" },
          { key: "indexability", label: "Indexability" },
          { key: "structuredData", label: "Structured Data" },
          { key: "internalLinking", label: "Internal Linking" },
        ];

        for (const c of candidates) {
          const v = (onPage as any)[c.key];
          if (!v) continue;
          if (typeof v === "string") rows.push([c.label, v]);
          else if (Array.isArray(v)) rows.push([c.label, v.slice(0, 6).map((x) => safeText(x, "")).filter(Boolean).join("; ")]);
          else if (typeof v === "object") {
            const summary = [
              safeText((v as any).status, ""),
              safeText((v as any).notes, ""),
              safeText((v as any).issue, ""),
            ]
              .filter(Boolean)
              .join(" — ");
            rows.push([c.label, summary || safeText(JSON.stringify(v), "—")]);
          } else {
            rows.push([c.label, safeText(v, "—")]);
          }
        }

        // If nothing matched, fallback to key/value dump (limited)
        if (!rows.length) {
          const entries = Object.entries(onPage).slice(0, 12);
          for (const [k, v] of entries) rows.push([k, safeText(v, "—")]);
        }

        drawTable(doc, ["Area", "Findings (condensed)"], rows, [160, 330]);
      } else {
        paragraph(doc, "No on-page SEO audit details were included in this report output.");
      }

      if (lighthouseSeo && typeof lighthouseSeo === "object") {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Lighthouse SEO Signals");
        const lhRows: TableRow[] = [];
        const score = (lighthouseSeo as any).score;
        if (score !== undefined) lhRows.push(["SEO Score", `${clampScore(score)}/100`]);
        const audits = (lighthouseSeo as any).audits;
        if (Array.isArray(audits) && audits.length) {
          lhRows.push(["Top audits (sample)", audits.slice(0, 8).map((a: any) => safeText(a?.title ?? a, "")).filter(Boolean).join("; ")]);
        }
        if ((lighthouseSeo as any).notes) lhRows.push(["Notes", safeText((lighthouseSeo as any).notes, "—")]);
        if (!lhRows.length) {
          const entries = Object.entries(lighthouseSeo).slice(0, 10);
          for (const [k, v] of entries) lhRows.push([k, safeText(v, "—")]);
        }
        drawTable(doc, ["Metric", "Value"], lhRows, [160, 330]);
      }

      /* =========================
         APPENDIX G: SERP snapshots (DataForSEO)
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "G", "Appendix G: SERP Snapshots (Organic)");

      const serpTiers = (report as any)?.appendices?.serp;
      if (Array.isArray(serpTiers) && serpTiers.length) {
        serpTiers.forEach((tier: any, idx: number) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(safeText(tier?.tier, `SERP Tier ${idx + 1}`));
          const items = Array.isArray(tier?.items) ? tier.items : [];
          if (!items.length) {
            paragraph(doc, "No SERP snapshot items were provided.");
            return;
          }
          // Executive-friendly: show keyword + found position + top 5 URLs only
          const rows: TableRow[] = items.slice(0, 20).map((it: any) => {
            const urls = Array.isArray(it?.topUrls) ? it.topUrls.slice(0, 5).map((u: string) => formatUrlForDisplay(u, 70)).join("\n") : "—";
            return [
              safeText(it?.keyword, "—"),
              safeText(it?.foundPosition, "Not found"),
              safeText(it?.checkedDepth, "—"),
              urls,
            ];
          });
          drawTable(doc, ["Keyword", "Position", "Depth", "Top URLs (sample)"], rows, [140, 80, 60, 210]);
        });
      } else {
        paragraph(doc, "No SERP snapshot appendix data was generated.");
      }

      /* =========================
         APPENDIX H: Backlink profile (DataForSEO - detailed)
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "H", "Appendix H: Backlink Profile (Detailed)");

      const backlinkTiers = (report as any)?.appendices?.backlinks;
      if (Array.isArray(backlinkTiers) && backlinkTiers.length) {
        backlinkTiers.forEach((tier: any, idx: number) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text(safeText(tier?.tier, `Backlinks Tier ${idx + 1}`));
          const items = Array.isArray(tier?.items) ? tier.items : [];

          if (!items.length) {
            paragraph(doc, "No items were provided for this backlinks tier.");
            addPageIfNotAtTop(doc);
            return;
          }

          const tierName = safeText(tier?.tier, "").toLowerCase();

          // Summary tier
          if (tierName.includes("summary")) {
            const s = items[0] || {};
            drawTable(
              doc,
              ["Backlinks", "Ref. Domains", "Broken", "Domain Rank", "Spam Score"],
              [[s.backlinks, s.referring_domains, s.broken_backlinks, s.domain_rank, s.spam_score ?? "—"]],
              [90, 110, 80, 90, 90],
            );
            addPageIfNotAtTop(doc);
            return;
          }

          // Referring domains
          if (tierName.includes("referring")) {
            const rows: TableRow[] = items.slice(0, 40).map((d: any) => [
              safeText(d?.domain, "—"),
              safeText(d?.backlinks, "—"),
              safeText(d?.rank ?? d?.domain_rank, "—"),
              safeText(d?.first_seen ?? d?.firstSeen, "—"),
            ]);
            drawTable(doc, ["Domain", "Backlinks", "Rank"], rows.map((r) => [r[0], r[1], r[2]]), [260, 110, 100], { hideEmptyRows: true, hideEmptyCols: true });
            addPageIfNotAtTop(doc);
            return;
          }

          // Anchors
          if (tierName.includes("anchor")) {
            const rows: TableRow[] = items.slice(0, 40).map((a: any) => [
              safeText(a?.anchor, "—"),
              safeText(a?.backlinks, "—"),
              safeText(a?.referring_domains ?? a?.refDomains, "—"),
            ]);
            drawTable(doc, ["Anchor", "Backlinks", "Ref. Domains"], rows, [250, 90, 110]);
            addPageIfNotAtTop(doc);
            return;
          }

          // Top linked pages
          if (tierName.includes("linked page") || tierName.includes("top linked")) {
            const rows: TableRow[] = items.slice(0, 30).map((p: any) => [
              formatUrlForDisplay(safeText(p?.page ?? p?.url, "—"), 80),
              safeText(p?.backlinks, "—"),
              safeText(p?.referring_domains ?? p?.refDomains, "—"),
            ]);
            drawTable(doc, ["Page", "Backlinks", "Ref. Domains"], rows, [260, 90, 110], { hideEmptyRows: true, hideEmptyCols: true });
            addPageIfNotAtTop(doc);
            return;
          }

          // Sample backlinks
          if (tierName.includes("sample")) {
            const rows: TableRow[] = items.slice(0, 25).map((b: any) => [
              // DataForSEO backlinks commonly use referring_domain/referring_page
              safeText(b?.referring_domain ?? b?.refDomain ?? b?.source_domain ?? b?.domain ?? "—", "—"),
              formatUrlForDisplay(safeText(b?.referring_page ?? b?.refPage ?? b?.source_url ?? b?.sourceUrl, "—"), 60),
              formatUrlForDisplay(safeText(b?.target_url ?? b?.targetUrl ?? b?.target, "—"), 60),
              safeText(b?.anchor ?? b?.anchor_text ?? "—", "—"),
            ]);
            drawTable(doc, ["Domain", "Source URL", "Target URL", "Anchor"], rows, [120, 150, 150, 80], { hideEmptyRows: true, hideEmptyCols: true });
            addPageIfNotAtTop(doc);
            return;
          }

          // Fallback: key/value dump (limited)
          const rows: TableRow[] = items.slice(0, 20).map((x: any) => [safeText(x?.name ?? x?.key ?? "Item", "Item"), safeText(x?.value ?? JSON.stringify(x), "—")]);
          drawTable(doc, ["Item", "Value"], rows, [200, 290]);
        });
      } else {
        paragraph(doc, "No backlinks appendix data was generated.");
      }

      /* =========================
         APPENDIX I: Local presence + compliance
      ========================= */
      addPageIfNotAtTop(doc);
      sectionTitle(doc, "I", "Appendix I: Local Presence & Compliance");

      const googlePlaces = (report as any)?.reputation?.googlePlaces;
      const repSuggestions = (report as any)?.reputation?.improvementSuggestions;
      const repBundle = (report as any)?.reputation?.reputationBundle;
      const compliance = (report as any)?.riskAssessment?.compliance;

      if (googlePlaces && typeof googlePlaces === "object") {
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Google Business Profile Signals");
        const rows: TableRow[] = [];
        const name = (googlePlaces as any)?.name;
        if (name) rows.push(["Name", safeText(name, "—")]);
        if ((googlePlaces as any)?.rating !== undefined) rows.push(["Rating", safeText((googlePlaces as any)?.rating, "—")]);
        if ((googlePlaces as any)?.user_ratings_total !== undefined) rows.push(["Total Reviews", safeText((googlePlaces as any)?.user_ratings_total, "—")]);
        if ((googlePlaces as any)?.types) rows.push(["Categories", normalizeStringList((googlePlaces as any)?.types).slice(0, 6).join(", ") || "—"]);
        if ((googlePlaces as any)?.address) rows.push(["Address", safeText((googlePlaces as any)?.address, "—")]);
        if ((googlePlaces as any)?.website) rows.push(["Website", formatUrlForDisplay(safeText((googlePlaces as any)?.website, "—"), 90)]);
        if (!rows.length) {
          const entries = Object.entries(googlePlaces).slice(0, 10);
          for (const [k, v] of entries) rows.push([k, safeText(v, "—")]);
        }
        drawTable(doc, ["Field", "Value"], rows, [160, 330]);
      } else {
        paragraph(doc, "No Google Business Profile signals were included in this report output.");
      }

      if (repSuggestions) {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Reputation Improvement Suggestions");
        const list = normalizeStringList(repSuggestions);
        if (list.length) bullets(doc, list.slice(0, 18), "—");
        else paragraph(doc, safeText(repSuggestions, "No suggestions were provided."));
      }

      // Condensed bundle metadata (avoid printing long raw reviews)
      if (repBundle && typeof repBundle === "object") {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Reputation Data Bundle (Metadata)");
        const rows: TableRow[] = [];
        if ((repBundle as any)?.mode) rows.push(["Mode", safeText((repBundle as any)?.mode, "—")]);
        const sources = (repBundle as any)?.sources;
        if (sources && typeof sources === "object") {
          rows.push(["Sources", Object.keys(sources).slice(0, 10).join(", ") || "—"]);
        }
        const errors = (repBundle as any)?.errors;
        if (errors && typeof errors === "object") {
          const errKeys = Object.keys(errors);
          if (errKeys.length) {
            rows.push([
              "Errors",
              errKeys
                .map((k) => {
                  const v = (errors as any)[k];
                  return `${k}: ${v ? safeText(v, "") : "none"}`;
                })
                .slice(0, 8)
                .join("; "),
            ]);
          }
        }
        if (rows.length) drawTable(doc, ["Field", "Value"], rows, [160, 330]);
      }

      if (compliance) {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(GRAY_900).text("Compliance & Policy Checks");
        const list = normalizeStringList(compliance);
        if (list.length) bullets(doc, list.slice(0, 18), "—");
        else paragraph(doc, safeText(compliance, "No compliance notes were provided."));
      } else {
        paragraph(doc, "No compliance notes were included in this report output.");
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