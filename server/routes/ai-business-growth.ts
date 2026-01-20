// server/routes/ai-business-growth.ts
import type { Express } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

import { mergeBusinessGrowthReport, type BusinessGrowthReport } from "../openai";
import { AiReportGeneratedModel } from "../models";

import {
  sendBusinessGrowthReportEmailWithDownload,
  sendContactNotification,
} from "../email-service";

import { generateBusinessGrowthPdfBuffer } from "../generateBusinessGrowthPdf";

// ✅ Python AI Engine
import { callPythonAiEngineAnalyze } from "../utils/pythonAiEngineClient";

/**
 * Normalize website URL (ensures https:// and no trailing slash).
 */
function normalizeWebsiteUrl(website: string): string {
  let url = website.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, "");
  return url;
}

/** Escape string for use inside a RegExp */
function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function makeToken() {
  return crypto.randomBytes(16).toString("hex");
}

const REPORT_DIR = path.join(process.cwd(), "tmp", "business-growth-reports");

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function getBaseUrl(req: any) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.get("host");
  return `${proto}://${host}`;
}

export function registerBusinessGrowthRoutes(app: Express) {
  /**
   * ✅ NEW: Check for latest stored AI report for a website (BEFORE running analysis)
   */
  app.post("/api/ai-business-growth/latest", async (req, res) => {
    try {
      const { website, companyName } = req.body || {};

      if (!website || typeof website !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Website is required" });
      }

      const normalizedWebsite = normalizeWebsiteUrl(website);

      const filter: any = { website: normalizedWebsite };
      if (companyName && typeof companyName === "string" && companyName.trim()) {
        const q = companyName.trim();
        filter.companyName = new RegExp(`^${escapeRegExp(q)}$`, "i");
      }

      const latest = await AiReportGeneratedModel.findOne(filter).sort({
        createdAt: -1,
      });

      if (!latest) {
        return res.json({ success: true, exists: false });
      }

      // Frontend expects "updatedAt" (we map it here)
      const updatedAt =
        (latest.reportGeneratedAt ? latest.reportGeneratedAt.toISOString() : null) ||
        (latest.createdAt ? latest.createdAt.toISOString() : null);

      return res.json({
        success: true,
        exists: true,
        analysisToken: latest.token,
        updatedAt,
        reportGeneratedAt: latest.reportGeneratedAt || null,
        hasPdf: !!latest.reportDownloadToken,
        downloadUrl: latest.reportDownloadToken
          ? `${getBaseUrl(req)}/api/ai-business-growth/report/${latest.reportDownloadToken}.pdf`
          : null,
      });
    } catch (err) {
      console.error("[AI-Growth] latest check failed", err);
      return res.status(500).json({
        success: false,
        message: "Failed to check existing report",
      });
    }
  });

  /**
   * ✅ Analyze route (calls Python AI Engine)
   * FIX: pass apiKey header to avoid 401 Unauthorized
   */
  app.post("/api/ai-business-growth/analyze", async (req, res) => {
    req.setTimeout(0);
    res.setTimeout(0);

    const { companyName, website, industry, email, name, reportType, criteria, forceNewAnalysis } =
      req.body || {};

    if (!website || typeof website !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Website is required" });
    }

    try {
      const baseUrl =
        process.env.AI_ENGINE_BASE_URL ||
        process.env.PY_AI_ENGINE_URL ||
        "http://127.0.0.1:8010";

      const apiKey =
        process.env.PY_AI_ENGINE_KEY ||
        process.env.AI_ENGINE_KEY ||
        process.env.AI_ENGINE_API_KEY ||
        "";

      const targetMarket =
        typeof req.body?.targetMarket === "string" ? req.body.targetMarket.trim() : "";

      const businessGoal =
        typeof req.body?.businessGoal === "string" ? req.body.businessGoal.trim() : "";

      // safe merge into criteria without breaking existing shape
      const mergedCriteria = {
        ...(criteria && typeof criteria === "object" ? criteria : {}),
        ...(targetMarket ? { targetMarket } : {}),
        ...(businessGoal ? { businessGoal } : {}),
      };

      const payload = {
        companyName: companyName || "Marketing Agency",
        website,
        // ✅ When true, Python engine will bypass its Mongo-based analysis cache and re-crawl.
        forceNewAnalysis: Boolean(forceNewAnalysis),
        estimationMode: Boolean(req.body.estimationMode),
        estimationInputs: req.body.estimationInputs || undefined,
        industry,
        email,
        name,
        reportType,
        // criteria,
        criteria: mergedCriteria,
      };

      const py = await callPythonAiEngineAnalyze({
        baseUrl,
        apiKey, // ✅ IMPORTANT (fixes 401)
        payload,
        timeoutMs: 180 * 60_000,
      });

      const analysis = py.reportJson;
      const analysisToken = py.token;

      const existing = await AiReportGeneratedModel.findOne({ token: analysisToken });

      if (!existing) {
        await AiReportGeneratedModel.create({
          token: analysisToken,
          analysis,
          website: analysis?.reportMetadata?.website || normalizeWebsiteUrl(website),
          companyName: analysis?.reportMetadata?.companyName || companyName,
          industry,
          email,
          name,
        });
      }

      return res.json({
        success: true,
        analysis,
        analysisToken,
        reportId: py.reportId,
        meta: py.meta || {},
      });
    } catch (err: any) {
      console.error("[AI-Growth] Python engine error", err);
      return res.status(500).json({
        success: false,
        message: err?.message || "Analysis failed",
      });
    }
  });

  /**
   * ✅ Generate PDF only (DB-only, NO email)
   * Uses analysisToken -> pulls analysis from DB -> generates PDF -> returns downloadUrl
   */
  app.post("/api/ai-business-growth/report/generate", async (req, res) => {
    const { analysisToken, website, companyName, industry } = req.body || {};

    try {
      if (!analysisToken || typeof analysisToken !== "string") {
        return res.status(400).json({
          success: false,
          message: "analysisToken is required",
        });
      }

      ensureReportDir();

      const storedReport = await AiReportGeneratedModel.findOne({ token: analysisToken });

      if (!storedReport || !storedReport.analysis) {
        return res.status(400).json({
          success: false,
          message: "Analysis not found for the given token. Please run analysis first.",
        });
      }

      const analysisSource = storedReport.analysis as any;
      const reportMetadata = analysisSource?.reportMetadata;

      const resolvedWebsite =
        reportMetadata?.website || storedReport.website || website || "Unknown";

      const resolvedCompany =
        reportMetadata?.companyName ||
        storedReport.companyName ||
        companyName ||
        "Unknown";

      // ✅ do NOT block on reachability here (analysis already exists)
      const normalizedReport = mergeBusinessGrowthReport(
        {
          companyName: resolvedCompany,
          website: resolvedWebsite,
          industry: industry || storedReport.industry,
        },
        analysisSource,
      );

      const pdfBuffer = await generateBusinessGrowthPdfBuffer(
        normalizedReport as BusinessGrowthReport,
      );

      const t = makeToken();
      const filePath = path.join(REPORT_DIR, `${t}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);

      storedReport.website = normalizeWebsiteUrl(resolvedWebsite);
      storedReport.companyName = resolvedCompany;
      storedReport.industry = industry || storedReport.industry;
      storedReport.reportDownloadToken = t;
      storedReport.reportGeneratedAt = new Date();
      await storedReport.save();

      const downloadUrl = `${getBaseUrl(req)}/api/ai-business-growth/report/${t}.pdf`;

      return res.json({
        success: true,
        downloadUrl,
        analysisToken: storedReport.token,
        reportDownloadToken: t,
        reportGeneratedAt: storedReport.reportGeneratedAt,
      });
    } catch (err: any) {
      console.error("[AI-Growth] PDF generation failed", err);
      return res.status(500).json({
        success: false,
        message: err?.message || "Failed to generate report PDF",
      });
    }
  });

  /**
   * ✅ Send Email only (separate from PDF generation)
   * - ensures PDF exists (generates if missing)
   * - sends mail with attachment + download link
   */
  app.post("/api/ai-business-growth/report/send-email", async (req, res) => {
    const { analysisToken, email, name } = req.body || {};

    if (!analysisToken || typeof analysisToken !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "analysisToken is required" });
    }
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "email is required" });
    }

    try {
      const storedReport = await AiReportGeneratedModel.findOne({ token: analysisToken });
      if (!storedReport || !storedReport.analysis) {
        return res.status(400).json({
          success: false,
          message: "Analysis not found for the given token. Please run analysis first.",
        });
      }

      ensureReportDir();

      const analysisSource = storedReport.analysis as any;
      const reportMetadata = analysisSource?.reportMetadata;

      const resolvedWebsite =
        reportMetadata?.website || storedReport.website || "Unknown";
      const resolvedCompany =
        reportMetadata?.companyName || storedReport.companyName || "Unknown";

      // ✅ Ensure PDF exists; if missing, generate once (NO analysis rerun)
      let pdfBuffer: Buffer;

      if (!storedReport.reportDownloadToken) {
        const normalizedReport = mergeBusinessGrowthReport(
          {
            companyName: resolvedCompany,
            website: resolvedWebsite,
            industry: storedReport.industry,
          },
          analysisSource,
        );

        pdfBuffer = await generateBusinessGrowthPdfBuffer(
          normalizedReport as BusinessGrowthReport,
        );

        const t = makeToken();
        const filePath = path.join(REPORT_DIR, `${t}.pdf`);
        fs.writeFileSync(filePath, pdfBuffer);

        storedReport.reportDownloadToken = t;
        storedReport.reportGeneratedAt = new Date();
        await storedReport.save();
      } else {
        const existingPath = path.join(
          REPORT_DIR,
          `${storedReport.reportDownloadToken}.pdf`,
        );

        if (fs.existsSync(existingPath)) {
          pdfBuffer = fs.readFileSync(existingPath);
        } else {
          // fallback regenerate if file missing
          const normalizedReport = mergeBusinessGrowthReport(
            {
              companyName: resolvedCompany,
              website: resolvedWebsite,
              industry: storedReport.industry,
            },
            analysisSource,
          );

          pdfBuffer = await generateBusinessGrowthPdfBuffer(
            normalizedReport as BusinessGrowthReport,
          );

          const t = makeToken();
          const filePath = path.join(REPORT_DIR, `${t}.pdf`);
          fs.writeFileSync(filePath, pdfBuffer);

          storedReport.reportDownloadToken = t;
          storedReport.reportGeneratedAt = new Date();
          await storedReport.save();
        }
      }

      const downloadUrl = `${getBaseUrl(req)}/api/ai-business-growth/report/${storedReport.reportDownloadToken}.pdf`;

      // ✅ This signature matches your email-service typing
      await sendBusinessGrowthReportEmailWithDownload({
        toEmail: email,
        toName: typeof name === "string" ? name : "",
        analysis: analysisSource,
        pdfBuffer,
        downloadUrl,
      });

      await sendContactNotification({
        name: typeof name === "string" ? name : "",
        email,
        company: storedReport.companyName || "Unknown",
        message: "AI Business Growth report emailed",
        submittedAt: new Date(),
      });

      // ✅ store contact info (NO null assignment -> fixes TS)
      storedReport.email = email;
      storedReport.name = typeof name === "string" ? name : undefined;
      await storedReport.save();

      return res.json({ success: true, message: "Email sent", downloadUrl });
    } catch (err: any) {
      console.error("[AI-Growth] Email sending failed", err);
      return res.status(500).json({
        success: false,
        message: err?.message || "Failed to send report email",
      });
    }
  });

  /**
   * ✅ Legacy endpoint (backward compatibility)
   * Now: only generates PDF (no email)
   */
  app.post("/api/ai-business-growth/report", async (req, res) => {
    const { analysisToken } = req.body || {};

    try {
      if (!analysisToken || typeof analysisToken !== "string") {
        return res.status(400).json({
          success: false,
          message: "analysisToken is required",
        });
      }

      const storedReport = await AiReportGeneratedModel.findOne({ token: analysisToken });

      if (!storedReport || !storedReport.analysis) {
        return res.status(400).json({
          success: false,
          message: "Analysis not found for the given token. Please run analysis first.",
        });
      }

      ensureReportDir();

      const analysisSource = storedReport.analysis as any;
      const reportMetadata = analysisSource?.reportMetadata;

      const resolvedWebsite =
        reportMetadata?.website || storedReport.website || "Unknown";
      const resolvedCompany =
        reportMetadata?.companyName || storedReport.companyName || "Unknown";

      const normalizedReport = mergeBusinessGrowthReport(
        {
          companyName: resolvedCompany,
          website: resolvedWebsite,
          industry: storedReport.industry,
        },
        analysisSource,
      );

      const pdfBuffer = await generateBusinessGrowthPdfBuffer(
        normalizedReport as BusinessGrowthReport,
      );

      const t = makeToken();
      const filePath = path.join(REPORT_DIR, `${t}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);

      storedReport.reportDownloadToken = t;
      storedReport.reportGeneratedAt = new Date();
      await storedReport.save();

      const downloadUrl = `${getBaseUrl(req)}/api/ai-business-growth/report/${t}.pdf`;
      return res.json({ success: true, downloadUrl, analysisToken: storedReport.token });
    } catch (err: any) {
      console.error("[AI-Growth] Legacy report generation failed", err);
      return res.status(500).json({
        success: false,
        message: err?.message || "Failed to generate report PDF",
      });
    }
  });

  /**
   * ✅ PDF download
   */
  app.get("/api/ai-business-growth/report/:token.pdf", async (req, res) => {
    const filePath = path.join(REPORT_DIR, `${req.params.token}.pdf`);
    if (!fs.existsSync(filePath)) return res.status(404).send("Report not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    return fs.createReadStream(filePath).pipe(res);
  });
}
