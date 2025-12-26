// server/routes/ai-business-growth.ts
import type { Express } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import PDFDocument from "pdfkit";

import { generateBusinessGrowthAnalysis } from "../openai";
import { sendBusinessGrowthReportEmailWithDownload, sendContactNotification } from "../email-service";

interface QuickWin {
  title: string;
  impact?: string;
  time?: string;
  cost?: string;
  details?: string;
}

interface BusinessGrowthReport {
  reportMetadata: {
    reportId?: string;
    companyName?: string;
    website?: string;
    analysisDate?: string;
    overallScore?: number;
    subScores?: Record<string, number>;
  };
  executiveSummary: {
    strengths?: string[];
    weaknesses?: string[];
    biggestOpportunity?: string;
    quickWins?: QuickWin[];
  };
}

function slugify(value: string) {
  return (
    value
      ?.toLowerCase?.()
      ?.replace?.(/https?:\/\//g, "")
      ?.replace?.(/[^a-z0-9]+/g, "-")
      ?.replace?.(/(^-|-$)+/g, "")
      ?.replace?.(/--+/g, "-")
      ?.slice?.(0, 80) || "ai-business-growth-report"
  );
}

/**
 * Generates a nicer PDF buffer with cover + footer style similar to your sample.
 */
async function createBusinessGrowthPdf(analysis: BusinessGrowthReport): Promise<Buffer> {
  const metadata = analysis.reportMetadata || ({} as any);
  const summary = analysis.executiveSummary || ({} as any);

  const reportId = metadata.reportId || `BB-${Date.now()}`;
  const companyName = metadata.companyName || "Your business";
  const website = metadata.website || "N/A";
  const score = typeof metadata.overallScore === "number" ? metadata.overallScore : 0;

  const analysisDate = metadata.analysisDate
    ? new Date(metadata.analysisDate).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  const strengths = (summary.strengths || []).filter(Boolean);
  const weaknesses = (summary.weaknesses || []).filter(Boolean);
  const quickWins = (summary.quickWins || []).filter(Boolean);

  return await new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 54, left: 54, right: 54, bottom: 54 },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const addFooter = () => {
        const pageNum = (doc as any).page?.pageNumber || 1;
        const y = doc.page.height - doc.page.margins.bottom + 12;
        doc.save();
        doc.fontSize(9).fillColor("#6b7280");
        doc.text(`Page ${pageNum} | Report ID: ${reportId} | CONFIDENTIAL`, doc.page.margins.left, y, {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
          align: "center",
        });
        doc.restore();
      };

      const sectionTitle = (title: string) => {
        doc.moveDown(0.8);
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#2563eb").text(title);
        doc.moveDown(0.3);
        doc
          .moveTo(doc.page.margins.left, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .strokeColor("#e5e7eb")
          .stroke();
        doc.moveDown(0.6);
      };

      const bulletList = (items: string[]) => {
        doc.font("Helvetica").fontSize(11).fillColor("#111827");
        items.forEach((it) => {
          doc.text(`• ${it}`, { indent: 10 });
          doc.moveDown(0.2);
        });
      };

      /* =========================
         COVER PAGE
      ========================= */
      doc.font("Helvetica-Bold").fontSize(30).fillColor("#111827").text("BUSINESS GROWTH", 54, 110);
      doc.font("Helvetica-Bold").fontSize(30).text("ANALYSIS", 54, 145);

      doc.font("Helvetica").fontSize(14).fillColor("#111827").text(companyName, 54, 210);
      doc.moveDown(0.2);
      doc.font("Helvetica").fontSize(11).fillColor("#2563eb").text(website);

      doc.moveDown(1.0);
      doc.font("Helvetica").fontSize(11).fillColor("#111827");
      doc.text(`Analysis Date: ${analysisDate}`);
      doc.text(`Report ID: ${reportId}`);

      doc.moveDown(0.8);
      doc.font("Helvetica-Bold").fontSize(16).fillColor("#111827").text(`Overall Score: ${score}/100`);

      // Score bar
      const barX = 54;
      const barW = doc.page.width - 108;
      const barH = 10;
      const barY = doc.y + 14;
      const pct = Math.max(0, Math.min(100, score)) / 100;

      doc.roundedRect(barX, barY, barW, barH, 5).fill("#e5e7eb");
      doc
        .roundedRect(barX, barY, barW * pct, barH, 5)
        .fill(score < 41 ? "#ef4444" : score < 66 ? "#f59e0b" : "#10b981");

      addFooter();

      /* =========================
         PAGE 2 - SUMMARY
      ========================= */
      doc.addPage();
      sectionTitle("BUSINESS GROWTH ANALYSIS REPORT");

      doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("Report Details");
      doc.font("Helvetica").fontSize(11).fillColor("#111827");
      doc.text(`Company: ${companyName}`);
      doc.text(`Website: ${website}`);
      doc.text(`Analysis Date: ${analysisDate}`);
      doc.text(`Report ID: ${reportId}`);
      doc.moveDown(0.6);

      doc.font("Helvetica-Bold").fontSize(13).fillColor("#111827").text("EXECUTIVE SUMMARY");
      doc.moveDown(0.4);
      doc.font("Helvetica-Bold").fontSize(12).text(`Overall Business Growth Score: ${score}/100`);
      doc.moveDown(0.6);

      if (strengths.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("✅ KEY STRENGTHS:");
        bulletList(strengths.slice(0, 10));
        doc.moveDown(0.2);
      }

      if (weaknesses.length) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("⚠ CRITICAL WEAKNESSES:");
        bulletList(weaknesses.slice(0, 10));
        doc.moveDown(0.2);
      }

      if (summary.biggestOpportunity) {
        doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("🚀 BIGGEST OPPORTUNITY:");
        doc.font("Helvetica").fontSize(11).fillColor("#111827").text(String(summary.biggestOpportunity));
      }

      addFooter();

      /* =========================
         PAGE 3 - QUICK WINS
      ========================= */
      doc.addPage();
      sectionTitle("TOP IMMEDIATE ACTIONS (90-Day Plan)");

      if (!quickWins.length) {
        doc.font("Helvetica").fontSize(11).fillColor("#111827").text("No quick wins were provided by the analysis engine.");
      } else {
        quickWins.slice(0, 10).forEach((win: QuickWin, idx: number) => {
          doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(`${idx + 1}. ${win.title || "Quick win"}`);
          doc.font("Helvetica").fontSize(11).fillColor("#111827");
          if (win.impact) doc.text(`Impact: ${win.impact}`);
          if (win.time) doc.text(`Time: ${win.time}`);
          if (win.cost) doc.text(`Cost: ${win.cost}`);
          if (win.details) doc.text(`Details: ${win.details}`);
          doc.moveDown(0.6);
        });
      }

      addFooter();

      // Optional: sub scores
      if (metadata.subScores && Object.keys(metadata.subScores).length) {
        doc.addPage();
        sectionTitle("SUB-SCORE BREAKDOWN");

        doc.font("Helvetica").fontSize(11).fillColor("#111827");
        for (const [k, v] of Object.entries(metadata.subScores)) {
          if (typeof v !== "number") continue;
          doc.font("Helvetica-Bold").text(`${k}: `, { continued: true });
          doc.font("Helvetica").text(`${v}/100`);
          doc.moveDown(0.2);
        }

        addFooter();
      }

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Disk storage for generated PDFs (short-lived)
 * Render allows writing to the filesystem, but it’s ephemeral. Good for lead downloads.
 */
const REPORT_DIR = process.env.REPORT_DIR || path.join(process.cwd(), "tmp", "ai-growth-reports");
function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
}
function makeToken() {
  return crypto.randomBytes(18).toString("hex");
}
function getBaseUrl(req: any) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.get("host");
  return `${proto}://${host}`;
}

export function registerBusinessGrowthRoutes(app: Express) {
  /**
   * Analyze route should just return analysis
   * (Email + PDF handled in /report step after lead submit).
   */
  app.post("/api/ai-business-growth/analyze", async (req, res) => {
    const { companyName, website, industry } = req.body || {};

    if (!website || typeof website !== "string") {
      return res.status(400).json({ success: false, message: "Website is required" });
    }

    try {
      const analysis = await generateBusinessGrowthAnalysis({
        companyName: companyName || "Marketing Agency",
        website,
        industry,
      });

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("Business growth analysis route error:", error);
      res.status(500).json({ success: false, message: "Failed to generate analysis" });
    }
  });

  /**
   * NEW: Generate PDF + email + return downloadUrl
   * Request: { analysis, email, name? }
   */
  app.post("/api/ai-business-growth/report", async (req, res) => {
    const { analysis, email, name } = req.body || {};

    if (!analysis?.reportMetadata) {
      return res.status(400).json({ success: false, message: "Analysis data is required for PDF generation" });
    }
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
      ensureReportDir();

      // Generate PDF buffer
      const pdfBuffer = await createBusinessGrowthPdf(analysis as BusinessGrowthReport);

      // Store with token
      const t = makeToken();
      const filePath = path.join(REPORT_DIR, `${t}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);

      const downloadUrl = `/api/ai-business-growth/report/${t}.pdf`;
      const absoluteDownloadUrl = `${getBaseUrl(req)}${downloadUrl}`;

      // ✅ Send email with PDF + download link
      try {
        await sendBusinessGrowthReportEmailWithDownload({
          toEmail: email,
          toName: name || analysis?.reportMetadata?.companyName || "there",
          analysis: analysis as BusinessGrowthReport,
          pdfBuffer,
          downloadUrl: absoluteDownloadUrl,
        });
      } catch (emailError) {
        console.error("Failed to send AI growth report email", emailError);
        // Still allow download even if email fails
      }

      // Optional: notify admin (like you already do)
      if (email && name) {
        try {
          await sendContactNotification({
            name,
            email,
            company: analysis?.reportMetadata?.companyName || undefined,
            phone: undefined,
            message: `AI BUSINESS GROWTH ANALYZER: ${analysis?.reportMetadata?.website} | Score ${analysis?.reportMetadata?.overallScore}/100`,
            submittedAt: new Date(),
          });
        } catch (err) {
          console.error("Failed to send contact notification for report", err);
        }
      }

      return res.json({
        success: true,
        downloadUrl,
      });
    } catch (error) {
      console.error("Business growth PDF/email failed", error);
      return res.status(500).json({ success: false, message: "Failed to generate or send report" });
    }
  });

  /**
   * NEW: Download by token (the frontend uses this URL)
   */
  app.get("/api/ai-business-growth/report/:token.pdf", async (req, res) => {
    try {
      const token = String(req.params.token || "");
      if (!token) return res.status(400).json({ success: false, message: "Invalid token" });

      ensureReportDir();

      const filePath = path.join(REPORT_DIR, `${token}.pdf`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Report not found or expired" });
      }

      const filename = slugify("business-growth-report") + ".pdf";
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.sendFile(filePath);
    } catch (e) {
      console.error("Report download failed", e);
      return res.status(500).json({ success: false, message: "Failed to download report" });
    }
  });
}
