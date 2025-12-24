import type { Express } from "express";
import { generateBusinessGrowthAnalysis } from "../openai";
import { sendBusinessGrowthReportEmail, sendContactNotification } from "../email-service";

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

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/--+/g, "-")
    .slice(0, 80) || "ai-business-growth-report";
}

function createBusinessGrowthPdf(analysis: BusinessGrowthReport) {
  const metadata = analysis.reportMetadata || {};
  const summary = analysis.executiveSummary || {};

  const companyName = metadata.companyName || "Your business";
  const website = metadata.website || "N/A";
  const score = typeof metadata.overallScore === "number" ? `${metadata.overallScore}/100` : "N/A";
  const analysisDate = metadata.analysisDate
    ? new Date(metadata.analysisDate).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  const strengths = summary.strengths?.slice(0, 3) || [];
  const weaknesses = summary.weaknesses?.slice(0, 3) || [];
  const quickWins = summary.quickWins?.slice(0, 3) || [];

  const contentLines: string[] = [];
  contentLines.push("BT");
  contentLines.push("/F1 22 Tf");
  contentLines.push("1 0 0 1 64 760 Tm");
  contentLines.push(`(${escapePdfText("AI Business Growth Report")}) Tj`);
  contentLines.push("/F1 12 Tf");
  contentLines.push("0 -28 Td");
  contentLines.push(`(${escapePdfText(`Company: ${companyName}`)}) Tj`);
  contentLines.push("0 -18 Td");
  contentLines.push(`(${escapePdfText(`Website: ${website}`)}) Tj`);
  contentLines.push("0 -18 Td");
  contentLines.push(`(${escapePdfText(`Score: ${score}`)}) Tj`);
  contentLines.push("0 -18 Td");
  contentLines.push(`(${escapePdfText(`Analysis date: ${analysisDate}`)}) Tj`);

  if (summary.biggestOpportunity) {
    contentLines.push("0 -26 Td");
    contentLines.push(`(${escapePdfText("Biggest Opportunity:")}) Tj`);
    contentLines.push("0 -18 Td");
    contentLines.push(`(${escapePdfText(summary.biggestOpportunity)}) Tj`);
  }

  if (strengths.length) {
    contentLines.push("0 -26 Td");
    contentLines.push(`(${escapePdfText("Top strengths:")}) Tj`);
    strengths.forEach((item) => {
      contentLines.push("0 -16 Td");
      contentLines.push(`(${escapePdfText(`• ${item}`)}) Tj`);
    });
  }

  if (weaknesses.length) {
    contentLines.push("0 -24 Td");
    contentLines.push(`(${escapePdfText("Key risks:")}) Tj`);
    weaknesses.forEach((item) => {
      contentLines.push("0 -16 Td");
      contentLines.push(`(${escapePdfText(`• ${item}`)}) Tj`);
    });
  }

  if (quickWins.length) {
    contentLines.push("0 -24 Td");
    contentLines.push(`(${escapePdfText("Quick wins:")}) Tj`);
    quickWins.forEach((win) => {
      const pieces = [win.title, win.impact, win.time].filter(Boolean).join(" • ");
      contentLines.push("0 -16 Td");
      contentLines.push(`(${escapePdfText(`• ${pieces}`)}) Tj`);
    });
  }

  contentLines.push("ET");

  const contentStream = contentLines.join("\n") + "\n";
  const contentLength = Buffer.byteLength(contentStream, "utf8");

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Count 1 /Kids [3 0 R] >>");
  objects.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  );
  objects.push(`<< /Length ${contentLength} >>\nstream\n${contentStream}endstream`);
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  let offset = pdf.length;
  const xrefLines = ["0000000000 65535 f \n"];

  objects.forEach((obj, index) => {
    const objStr = `${index + 1} 0 obj\n${obj}\nendobj\n`;
    pdf += objStr;
    xrefLines.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
    offset += objStr.length;
  });

  const xrefStart = offset;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += xrefLines.join("");
  pdf += "trailer\n";
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += "startxref\n";
  pdf += `${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

export function registerBusinessGrowthRoutes(app: Express) {
  app.post("/api/ai-business-growth/analyze", async (req, res) => {
    const { companyName, website, industry, contact } = req.body || {};

    if (!website || typeof website !== "string") {
      return res.status(400).json({ success: false, message: "Website is required" });
    }

    try {
      const analysis = await generateBusinessGrowthAnalysis({
        companyName: companyName || "Marketing Agency",
        website,
        industry,
      });

      let pdfBuffer: Buffer | undefined;
      try {
        pdfBuffer = createBusinessGrowthPdf(analysis as BusinessGrowthReport);
      } catch (pdfError) {
        console.error("Failed to generate AI growth PDF", pdfError);
      }

      if (contact?.email) {
        try {
          await sendBusinessGrowthReportEmail({
            toEmail: contact.email,
            toName: contact.name || companyName || "there",
            analysis: analysis as BusinessGrowthReport,
            pdfBuffer,
          });
        } catch (emailError) {
          console.error("Failed to send AI growth report email", emailError);
        }
      }

      if (contact?.email && contact?.name) {
        try {
          await sendContactNotification({
            name: contact.name,
            email: contact.email,
            company: companyName || undefined,
            phone: contact.phone,
            message: `AI BUSINESS GROWTH ANALYZER: ${website} | Score ${analysis.reportMetadata.overallScore}/100`,
            submittedAt: new Date(),
          });
        } catch (error) {
          console.error("Failed to send notification for business growth analysis", error);
        }
      }

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("Business growth analysis route error:", error);
      res.status(500).json({ success: false, message: "Failed to generate analysis" });
    }
  });

  app.post("/api/ai-business-growth/report", async (req, res) => {
    const { analysis } = req.body || {};

    if (!analysis?.reportMetadata) {
      return res.status(400).json({ success: false, message: "Analysis data is required for PDF generation" });
    }

    try {
      const pdfBuffer = createBusinessGrowthPdf(analysis as BusinessGrowthReport);
      const filename = slugify(
        analysis.reportMetadata.website || analysis.reportMetadata.companyName || "ai-business-growth-report",
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Business growth PDF generation failed", error);
      res.status(500).json({ success: false, message: "Failed to generate report PDF" });
    }
  });
}
