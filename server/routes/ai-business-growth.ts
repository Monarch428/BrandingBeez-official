// server/routes/ai-business-growth.ts
import type { Express } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
// import PDFDocument from "pdfkit";

import { mergeBusinessGrowthReport, type BusinessGrowthReport } from "../openai";
import { AiReportGeneratedModel } from "../models";
import { sendBusinessGrowthReportEmailWithDownload, sendContactNotification } from "../email-service";
import { generateBusinessGrowthPdfBuffer } from "../generateBusinessGrowthPdf";

/**
 * Normalize website URL (ensures https:// and no trailing slash).
 */
function normalizeWebsiteUrl(website: string): string {
  let url = website.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, "");
  return url;
}

/**
 * Strict reachability check:
 * - makes sure it can actually load the website
 * - catches typos early
 */
async function checkWebsiteReachableStrict(website: string) {
  const url = normalizeWebsiteUrl(website);

  // Prefer global fetch (Node 18+). Fallback to undici if needed.
  const fetchFn: any = (globalThis as any).fetch;
  if (!fetchFn) {
    throw new Error(
      "Global fetch is not available. Use Node 18+ (recommended) or polyfill fetch in your server runtime.",
    );
  }

  try {
    const resp = await fetchFn(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BrandingBeezAI/1.0; +https://brandingbeez.co.uk)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const ok = resp && resp.status >= 200 && resp.status < 400;
    return { reachable: !!ok, httpStatus: resp?.status ?? null, finalUrl: resp?.url ?? url };
  } catch (err) {
    return { reachable: false, httpStatus: null, finalUrl: url };
  }
}

/**
 * Make a short token for DB + download URLs.
 */
function makeToken() {
  return crypto.randomBytes(16).toString("hex");
}

const REPORT_DIR = path.join(process.cwd(), "tmp", "business-growth-reports");

/**
 * Ensure report dir exists.
 */
function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function getBaseUrl(req: any) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.get("host");
  return `${proto}://${host}`;
}

/**
 * Call the Python AI Engine (crawl + LLM + report JSON + Mongo save).
 * Configure:
 *   PY_AI_ENGINE_URL="http://127.0.0.1:8010"  (no trailing slash)
 *   PY_AI_ENGINE_KEY="optional-shared-secret"
 */
async function callPythonAiEngineAnalyze(input: {
  companyName: string;
  website: string;
  industry?: string;
  email?: string;
  name?: string;
  reportType?: "quick" | "full";
  criteria?: Record<string, any>;
}) {
  const base = (process.env.PY_AI_ENGINE_URL || "").replace(/\/$/, "");
  if (!base) {
    throw new Error("PY_AI_ENGINE_URL is not configured");
  }

  // Prefer global fetch (Node 18+). Fallback to undici if needed.
  const fetchFn: any = (globalThis as any).fetch;
  if (!fetchFn) {
    throw new Error(
      "Global fetch is not available. Use Node 18+ (recommended) or polyfill fetch in your server runtime.",
    );
  }

  const resp = await fetchFn(`${base}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.PY_AI_ENGINE_KEY ? { "X-AI-ENGINE-KEY": process.env.PY_AI_ENGINE_KEY } : {}),
    },
    body: JSON.stringify(input),
  });

  const text = await resp.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // keep raw text
  }

  if (!resp.ok) {
    const msg = data?.detail || data?.message || text || `Python AI Engine error (${resp.status})`;
    const err: any = new Error(msg);
    err.status = resp.status;
    err.payload = data || text;
    throw err;
  }

  return data as {
    ok: boolean;
    token: string;
    reportId: string;
    reportJson: BusinessGrowthReport;
    meta?: Record<string, any>;
  };
}

export function registerBusinessGrowthRoutes(app: Express) {
  /**
   * Analyze route: calls Python AI Engine which performs crawl + criteria checks + LLM report generation
   * and persists the report JSON into Mongo. Node returns { analysis, analysisToken } to the frontend.
   */
  app.post("/api/ai-business-growth/analyze", async (req, res) => {
    const { companyName, website, industry, email, name, reportType, criteria } = req.body || {};

    if (!website || typeof website !== "string") {
      return res.status(400).json({ success: false, message: "Website is required" });
    }

    try {
      const py = await callPythonAiEngineAnalyze({
        companyName: companyName || "Marketing Agency",
        website,
        industry,
        email,
        name,
        reportType,
        criteria,
      });

      const analysis = py.reportJson;
      const analysisToken = py.token;

      // Safety net: if Python DB write failed for any reason, persist from Node as fallback.
      // (Normally Python already saved it with the same token.)
      try {
        const existing = await AiReportGeneratedModel.findOne({ token: analysisToken });
        if (!existing) {
          await AiReportGeneratedModel.create({
            token: analysisToken,
            analysis,
            website: analysis?.reportMetadata?.website || website,
            companyName: analysis?.reportMetadata?.companyName || companyName,
            industry,
            email,
            name,
          });
        }
      } catch (dbError) {
        console.error("[AI-Growth] Node fallback persist failed", dbError);
      }

      return res.json({ success: true, analysis, analysisToken, reportId: py.reportId, meta: py.meta || {} });
    } catch (err: any) {
      console.error("[AI-Growth] Python engine error", err);

      const msg = err?.payload?.detail || err?.message || "Failed to generate analysis. Please try again.";
      return res.status(err?.status || 500).json({
        success: false,
        message: msg,
        code: err?.code || "PY_AI_ENGINE_ERROR",
        details: err?.payload || null,
      });
    }
  });

  /**
   * Generate PDF + email + return downloadUrl
   * Request: { analysisToken, email, name? }  (analysis optional fallback)
   */
  app.post("/api/ai-business-growth/report", async (req, res) => {
    const { analysis, analysisToken, email, name, website, companyName, industry } = req.body || {};

    const storedReport =
      analysisToken && typeof analysisToken === "string"
        ? await AiReportGeneratedModel.findOne({ token: analysisToken })
        : null;

    const analysisSource = storedReport?.analysis || analysis;
    const reportMetadata = (analysisSource as any)?.reportMetadata;
    const resolvedWebsite = reportMetadata?.website || storedReport?.website || website;

    if (!analysisSource) {
      return res.status(400).json({
        success: false,
        message: "Missing analysis data. Provide analysisToken (recommended) or analysis payload.",
      });
    }

    if (!resolvedWebsite || typeof resolvedWebsite !== "string") {
      return res.status(400).json({ success: false, message: "Website is required for PDF generation" });
    }

    // Optional strict check (keeps your old behavior)
    const reach = await checkWebsiteReachableStrict(resolvedWebsite);
    if (!reach.reachable) {
      return res.status(400).json({
        success: false,
        code: "WEBSITE_NOT_REACHABLE",
        message: "Website is not reachable. Please enter a correct URL and try again.",
        details: reach,
      });
    }

    try {
      ensureReportDir();

      // ✅ FIX: mergeBusinessGrowthReport expects (input, reportPartial)
      const normalizedReport = mergeBusinessGrowthReport(
        {
          companyName:
            reportMetadata?.companyName ||
            storedReport?.companyName ||
            (typeof companyName === "string" ? companyName : "") ||
            "Unknown",
          website: resolvedWebsite,
          industry:
            (typeof industry === "string" ? industry : undefined) ||
            storedReport?.industry ||
            undefined,
        },
        analysisSource as any,
      );

      // Generate PDF buffer
      const pdfBuffer = await generateBusinessGrowthPdfBuffer(normalizedReport as BusinessGrowthReport);

      // Store PDF with download token
      const t = makeToken();
      const filePath = path.join(REPORT_DIR, `${t}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);

      // Persist download token/email/name into the existing report doc
      if (storedReport) {
        storedReport.email = email;
        storedReport.name = name;
        storedReport.reportDownloadToken = t;
        storedReport.reportGeneratedAt = new Date();
        await storedReport.save();
      }

      // Build download url
      const baseUrl = getBaseUrl(req);
      const downloadUrl = `${baseUrl}/api/ai-business-growth/report/${t}.pdf`;

      // Send email (optional)
      if (email && typeof email === "string") {
        try {
          await sendBusinessGrowthReportEmailWithDownload({
            toEmail: email,
            toName: typeof name === "string" && name.trim() ? name.trim() : "Client",
            analysis: normalizedReport,
            pdfBuffer,
            downloadUrl,
          });

          // Internal notification (optional)
          await sendContactNotification({
            name,
            email,
            phone: (req.body || {}).phone,
            company: companyName,
            message: `AI Business Growth report generated. Download: ${downloadUrl}`,
            submittedAt: new Date(),
          });
        } catch (mailErr) {
          console.error("Failed to send business growth report email", mailErr);
          // still return success (PDF is generated)
        }
      }

      return res.json({
        success: true,
        downloadUrl,
        reportDownloadToken: t,
        analysisToken: analysisToken || storedReport?.token || null,
      });
    } catch (err: any) {
      console.error("Failed to generate AI growth PDF", err);
      return res.status(500).json({
        success: false,
        message: "Failed to generate report PDF.",
        details: err?.message || String(err),
      });
    }
  });

  /**
   * Download PDF by token
   */
  app.get("/api/ai-business-growth/report/:token.pdf", async (req, res) => {
    const { token } = req.params || {};
    if (!token) return res.status(400).send("Missing token");

    const filePath = path.join(REPORT_DIR, `${token}.pdf`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Report not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="business-growth-report-${token}.pdf"`);
    return fs.createReadStream(filePath).pipe(res);
  });
}
