// server/generatebusinessGrowthPdf.ts
import PDFDocument from "pdfkit";

type QuickWin = {
  title: string;
  impact: string;
  time: string;
  cost: string;
  details: string;
};

type BusinessGrowthReport = {
  reportMetadata: {
    reportId: string;
    companyName: string;
    website: string;
    analysisDate: string; // ISO string
    overallScore: number;
    subScores?: Record<string, number | undefined>;
  };
  executiveSummary: {
    strengths: string[];
    weaknesses: string[];
    biggestOpportunity: string;
    quickWins: QuickWin[];
  };
  // your backend likely has more fields, but we only rely on these safely
};

function safeText(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function drawFooter(doc: PDFKit.PDFDocument, reportId: string) {
  const page = doc.page;
  const pageNum = doc.page.pageNumber;

  doc.save();
  doc.fontSize(9).fillColor("#6b7280");
  doc.text(
    `Page ${pageNum} | Report ID: ${reportId} | CONFIDENTIAL`,
    page.margins.left,
    page.height - page.margins.bottom + 10,
    {
      width: page.width - page.margins.left - page.margins.right,
      align: "center",
    },
  );
  doc.restore();
}

function sectionTitle(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.8);
  doc.fontSize(14).fillColor("#2563eb").font("Helvetica-Bold").text(text);
  doc.moveDown(0.3);
  doc.moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#e5e7eb")
    .stroke();
  doc.moveDown(0.6);
}

function bulletList(doc: PDFKit.PDFDocument, items: string[]) {
  doc.fontSize(11).fillColor("#111827").font("Helvetica");
  for (const item of items.filter(Boolean)) {
    doc.text(`• ${item}`, { indent: 10 });
    doc.moveDown(0.2);
  }
}

function keyValueRow(doc: PDFKit.PDFDocument, key: string, value: string) {
  doc.font("Helvetica-Bold").fillColor("#111827").text(`${key}: `, { continued: true });
  doc.font("Helvetica").fillColor("#111827").text(value);
}

export async function generateBusinessGrowthPdfBuffer(report: BusinessGrowthReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 54, left: 54, right: 54, bottom: 54 },
        autoFirstPage: true,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const reportId = safeText(report.reportMetadata?.reportId, "BB-REPORT");
      const companyName = safeText(report.reportMetadata?.companyName, "Company");
      const website = safeText(report.reportMetadata?.website, "");
      const analysisDate = report.reportMetadata?.analysisDate
        ? new Date(report.reportMetadata.analysisDate).toLocaleDateString()
        : "N/A";
      const score = typeof report.reportMetadata?.overallScore === "number" ? report.reportMetadata.overallScore : 0;

      /* =========================
         COVER PAGE (like your sample)
         Sample shows “BUSINESS GROWTH ANALYSIS” + branding + date + report id + score. :contentReference[oaicite:2]{index=2}
      ========================= */
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#ffffff");
      doc.fillColor("#111827");

      doc.font("Helvetica-Bold").fontSize(30).text("BUSINESS GROWTH", 54, 110);
      doc.font("Helvetica-Bold").fontSize(30).text("ANALYSIS", 54, 145);

      doc.moveDown(1.2);
      doc.font("Helvetica").fontSize(14).fillColor("#111827").text(companyName, 54, 210);
      if (website) {
        doc.fillColor("#2563eb").fontSize(11).text(website, { link: website, underline: true });
      }

      doc.fillColor("#111827").moveDown(1.0);
      doc.fontSize(11);
      keyValueRow(doc, "Analysis Date", analysisDate);
      keyValueRow(doc, "Report ID", reportId);

      doc.moveDown(0.7);
      doc.font("Helvetica-Bold").fontSize(16).fillColor("#111827").text(`Overall Score: ${score}/100`);

      // simple score bar
      const barX = 54;
      const barY = doc.y + 16;
      const barW = doc.page.width - 108;
      const barH = 10;
      const pct = Math.max(0, Math.min(100, score)) / 100;

      doc.roundedRect(barX, barY, barW, barH, 5).fill("#e5e7eb");
      doc.roundedRect(barX, barY, barW * pct, barH, 5).fill(score < 41 ? "#ef4444" : score < 66 ? "#f59e0b" : "#10b981");

      doc.moveDown(2.2);

      drawFooter(doc, reportId);

      /* =========================
         PAGE 2: Executive Summary
      ========================= */
      doc.addPage();
      sectionTitle(doc, "BUSINESS GROWTH ANALYSIS REPORT");

      keyValueRow(doc, "Company Analyzed", companyName);
      keyValueRow(doc, "Website", website || "N/A");
      keyValueRow(doc, "Analysis Date", analysisDate);
      keyValueRow(doc, "Report ID", reportId);

      doc.moveDown(0.8);
      doc.font("Helvetica-Bold").fontSize(13).fillColor("#111827").text("EXECUTIVE SUMMARY");
      doc.moveDown(0.6);

      doc.font("Helvetica-Bold").fontSize(12).text(`Overall Business Growth Score: ${score}/100`);
      doc.moveDown(0.6);

      const strengths = report.executiveSummary?.strengths ?? [];
      const weaknesses = report.executiveSummary?.weaknesses ?? [];
      const biggestOpportunity = safeText(report.executiveSummary?.biggestOpportunity, "");

      doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("✅ KEY STRENGTHS:");
      bulletList(doc, strengths.slice(0, 8));

      doc.moveDown(0.3);
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("⚠ CRITICAL WEAKNESSES:");
      bulletList(doc, weaknesses.slice(0, 8));

      if (biggestOpportunity) {
        doc.moveDown(0.4);
        doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("🚀 BIGGEST OPPORTUNITY:");
        doc.font("Helvetica").fontSize(11).fillColor("#111827").text(biggestOpportunity);
      }

      drawFooter(doc, reportId);

      /* =========================
         PAGE 3: Top actions (Quick Wins)
      ========================= */
      doc.addPage();
      sectionTitle(doc, "TOP IMMEDIATE ACTIONS (90-Day Plan)");

      const quickWins = report.executiveSummary?.quickWins ?? [];
      if (!quickWins.length) {
        doc.font("Helvetica").fontSize(11).fillColor("#111827").text("No quick wins were provided by the analysis engine.");
      } else {
        quickWins.slice(0, 8).forEach((q, idx) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(`${idx + 1}. ${safeText(q.title)}`);
          doc.font("Helvetica").fontSize(11).fillColor("#111827");
          doc.text(`Impact: ${safeText(q.impact)}`);
          doc.text(`Time: ${safeText(q.time)}`);
          doc.text(`Cost: ${safeText(q.cost)}`);
          if (q.details) doc.text(`Details: ${safeText(q.details)}`);
          doc.moveDown(0.6);
        });
      }

      drawFooter(doc, reportId);

      /* =========================
         (Optional) Sub-scores page
      ========================= */
      const subScores = report.reportMetadata?.subScores;
      if (subScores && Object.keys(subScores).length) {
        doc.addPage();
        sectionTitle(doc, "SUB-SCORE BREAKDOWN");

        doc.font("Helvetica").fontSize(11).fillColor("#111827");
        for (const [k, v] of Object.entries(subScores)) {
          if (typeof v !== "number") continue;
          doc.font("Helvetica-Bold").text(`${k}: `, { continued: true });
          doc.font("Helvetica").text(`${v}/100`);
          doc.moveDown(0.2);
        }

        drawFooter(doc, reportId);
      }

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
