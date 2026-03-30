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
import {
  callPythonAiEngineAnalyze,
  type AnalyzeRequestPayload,
  type LegacyEstimationInputs,
  type OptionalBusinessInputs,
} from "../utils/pythonAiEngineClient";

function normalizeWebsiteUrl(website: string): string {
  let url = website.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, "");
  return url;
}

function toDomain(website: string): string {
  try {
    const url = new URL(normalizeWebsiteUrl(website));
    return url.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

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

function toOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function toOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const normalized = String(value).replace(/,/g, "").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizePairArray<K extends string, V extends string>(
  value: unknown,
  keyName: K,
  valueName: V,
): Array<{ [P in K | V]: string }> {
  if (!Array.isArray(value)) return [] as Array<{ [P in K | V]: string }>;

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const raw = item as Record<string, unknown>;
      const k = toOptionalString(raw[keyName]);
      const v = toOptionalString(raw[valueName]);
      if (!k && !v) return null;
      return {
        [keyName]: k || "",
        [valueName]: v || "",
      } as { [P in K | V]: string };
    })
    .filter((item): item is { [P in K | V]: string } => Boolean(item));
}

function sanitizeOptionalBusinessInputs(raw: unknown): OptionalBusinessInputs {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    currency: toOptionalString(source.currency),
    monthlyRevenue: toOptionalNumber(source.monthlyRevenue),
    monthlyAdSpend: toOptionalNumber(source.monthlyAdSpend),
    monthlyToolsCost: toOptionalNumber(source.monthlyToolsCost),
    monthlyPayrollCost: toOptionalNumber(source.monthlyPayrollCost),
    monthlyOverheadCost: toOptionalNumber(source.monthlyOverheadCost),
    monthlyLeads: toOptionalNumber(source.monthlyLeads),
    qualifiedLeads: toOptionalNumber(source.qualifiedLeads),
    closeRate: toOptionalNumber(source.closeRate),
    avgDealValue: toOptionalNumber(source.avgDealValue),
    currentTrafficPerMonth: toOptionalNumber(source.currentTrafficPerMonth),

    countriesServed: toStringArray(source.countriesServed),
    customerSegments: toStringArray(source.customerSegments),
    painPoints: toStringArray(source.painPoints),
    segmentBudgets: toStringArray(source.segmentBudgets),

    revenueByService: normalizePairArray(source.revenueByService, "service", "amount"),
    revenueByChannel: normalizePairArray(source.revenueByChannel, "channel", "amount"),

    grossMargin: toOptionalNumber(source.grossMargin),
    retentionRate: toOptionalNumber(source.retentionRate),
    churnRate: toOptionalNumber(source.churnRate),
    salesCycleDays: toOptionalNumber(source.salesCycleDays),

    additionalContext: toOptionalString(source.additionalContext),
  };
}

function sanitizeLegacyEstimationInputs(raw: unknown): LegacyEstimationInputs {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    monthlyAdSpendRange: toOptionalString(source.monthlyAdSpendRange),
    toolsStackEstimate: toOptionalString(source.toolsStackEstimate),
    teamSizeRange: toOptionalString(source.teamSizeRange),
    idealCustomer: toOptionalString(source.idealCustomer),
    primaryRegion: toOptionalString(source.primaryRegion),
    avgDealValueRange: toOptionalString(source.avgDealValueRange),
    leadsPerMonthRange: toOptionalString(source.leadsPerMonthRange),
    closeRateRange: toOptionalString(source.closeRateRange),
    currentTrafficPerMonthRange: toOptionalString(source.currentTrafficPerMonthRange),
  };
}

function hasAnyLegacyEstimationInput(inputs: LegacyEstimationInputs): boolean {
  return Object.values(inputs).some((value) => typeof value === "string" && value.trim().length > 0);
}

function compactOptionalBusinessInputs(inputs: OptionalBusinessInputs): OptionalBusinessInputs {
  return Object.fromEntries(
    Object.entries(inputs).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim().length > 0;
      return true;
    }),
  ) as OptionalBusinessInputs;
}

function extractApproxNumberFromText(value: string | null | undefined): number | null {
  const text = value?.trim();
  if (!text) return null;

  const matches = [...text.toLowerCase().matchAll(/(\d+(?:\.\d+)?)\s*([km])?/g)];
  if (!matches.length) return null;

  const numbers = matches
    .map((match) => {
      const base = Number(match[1]);
      if (!Number.isFinite(base)) return null;
      const suffix = match[2];
      if (suffix === "k") return base * 1_000;
      if (suffix === "m") return base * 1_000_000;
      return base;
    })
    .filter((item): item is number => item !== null);

  if (!numbers.length) return null;
  if (numbers.length === 1) return numbers[0];
  return (numbers[0] + numbers[1]) / 2;
}

function deriveOptionalBusinessInputsFromLegacy(
  inputs: LegacyEstimationInputs,
): OptionalBusinessInputs {
  const extraNotes = [
    inputs.toolsStackEstimate ? `Tools stack estimate: ${inputs.toolsStackEstimate}` : null,
    inputs.teamSizeRange ? `Team size range: ${inputs.teamSizeRange}` : null,
    inputs.idealCustomer ? `Ideal customer: ${inputs.idealCustomer}` : null,
  ].filter((item): item is string => Boolean(item));

  return compactOptionalBusinessInputs({
    monthlyAdSpend: extractApproxNumberFromText(inputs.monthlyAdSpendRange),
    avgDealValue: extractApproxNumberFromText(inputs.avgDealValueRange),
    monthlyLeads: extractApproxNumberFromText(inputs.leadsPerMonthRange),
    closeRate: extractApproxNumberFromText(inputs.closeRateRange),
    currentTrafficPerMonth: extractApproxNumberFromText(inputs.currentTrafficPerMonthRange),
    countriesServed: toStringArray(inputs.primaryRegion),
    additionalContext: extraNotes.length > 0 ? extraNotes.join("\n") : null,
  });
}

function hasAnyOptionalBusinessInput(inputs: OptionalBusinessInputs): boolean {
  return Object.values(inputs).some((value) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  });
}

export function registerBusinessGrowthRoutes(app: Express) {
  app.post("/api/ai-business-growth/latest", async (req, res) => {
    try {
      const { website, companyName } = req.body || {};

      if (!website || typeof website !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Website is required" });
      }

      const normalizedWebsite = normalizeWebsiteUrl(website);
      const domain = toDomain(normalizedWebsite);

      const filter: any = domain ? { domain } : { website: normalizedWebsite };
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

  app.post("/api/ai-business-growth/analyze", async (req, res) => {
    req.setTimeout(0);
    res.setTimeout(0);

    const {
      companyName,
      website,
      location,
      industry,
      targetMarket,
      businessInputs,
      optionalBusinessInputs,
      estimationInputs,
      criteria,
      includeSections8to10,
      forceNewAnalysis,
    } = req.body || {};

    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      return res.status(400).json({ success: false, message: "Company name is required" });
    }

    if (!website || typeof website !== "string" || !website.trim()) {
      return res.status(400).json({ success: false, message: "Website is required" });
    }

    if (!location || typeof location !== "string" || !location.trim()) {
      return res.status(400).json({ success: false, message: "Location is required" });
    }

    if (!industry || typeof industry !== "string" || !industry.trim()) {
      return res.status(400).json({ success: false, message: "Primary services industry is required" });
    }

    if (!targetMarket || typeof targetMarket !== "string" || !targetMarket.trim()) {
      return res.status(400).json({ success: false, message: "Target market is required" });
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

      const normalizedWebsite = normalizeWebsiteUrl(website);
      const normalizedTargetMarket = targetMarket.trim();

      const sanitizedLegacyEstimationInputs = sanitizeLegacyEstimationInputs(estimationInputs);
      const includeLegacyEstimationInputs = hasAnyLegacyEstimationInput(
        sanitizedLegacyEstimationInputs,
      );

      const explicitOptionalInputs = compactOptionalBusinessInputs(
        sanitizeOptionalBusinessInputs(businessInputs ?? optionalBusinessInputs),
      );
      const legacyDerivedOptionalInputs = deriveOptionalBusinessInputsFromLegacy(
        sanitizedLegacyEstimationInputs,
      );
      const sanitizedOptionalInputs = {
        ...legacyDerivedOptionalInputs,
        ...explicitOptionalInputs,
      } as OptionalBusinessInputs;
      const includeOptionalInputs = hasAnyOptionalBusinessInput(sanitizedOptionalInputs);

      const DEFAULT_CRITERIA = {
        location: location.trim(),
        primaryService: industry.trim(),
        competitors: [],
        keywords: [],
        contentMaxPages: 8,
        siteMaxPages: 8,
        placesMaxResults: 5,
        placesMaxReviews: 5,
        competitorMaxCompetitors: 6,
        competitorMaxPages: 6,
      };

      const mergedCriteria = {
        ...DEFAULT_CRITERIA,
        ...(criteria && typeof criteria === "object" ? criteria : {}),
        location: location.trim(),
        primaryService: industry.trim(),
      };

      const payload: AnalyzeRequestPayload = {
        companyName: companyName.trim(),
        website: normalizedWebsite,
        forceNewAnalysis: Boolean(forceNewAnalysis),
        estimationMode: true,
        location: location.trim(),
        industry: industry.trim(),
        targetMarket: normalizedTargetMarket,
        primaryTargetMarket: normalizedTargetMarket,
        languageCode: "en",
        reportType: "full",
        ...(typeof includeSections8to10 === "boolean"
          ? { includeSections8to10 }
          : {}),
        criteria: {
          ...mergedCriteria,
          language_code: "en",
        },
        ...(includeLegacyEstimationInputs
          ? {
              estimationInputs: sanitizedLegacyEstimationInputs,
            }
          : {}),
        ...(includeOptionalInputs
          ? {
              optionalBusinessInputs: sanitizedOptionalInputs,
              businessInputs: sanitizedOptionalInputs,
            }
          : {}),
      };

      const py = await callPythonAiEngineAnalyze({
        baseUrl,
        apiKey,
        payload,
        timeoutMs: 180 * 60_000,
      });

      if (!py || py.ok !== true) {
        throw new Error(`Python engine returned failure: ${JSON.stringify(py)}`);
      }

      const analysis = py.reportJson;
      const analysisToken = py.token;

      const existing = await AiReportGeneratedModel.findOne({ token: analysisToken });

      if (!existing) {
        const resolvedWebsite =
          analysis?.reportMetadata?.website || normalizeWebsiteUrl(website);

        await AiReportGeneratedModel.create({
          token: analysisToken,
          analysis,
          website: resolvedWebsite,
          domain: toDomain(resolvedWebsite),
          companyName: analysis?.reportMetadata?.companyName || companyName.trim(),
          industry: industry.trim(),
          location: location.trim(),
          targetMarket: normalizedTargetMarket,
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
      storedReport.domain = toDomain(storedReport.website);
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

      storedReport.website = normalizeWebsiteUrl(resolvedWebsite);
      storedReport.domain = toDomain(storedReport.website);
      await storedReport.save();

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

  app.get("/api/ai-business-growth/report/:token.pdf", async (req, res) => {
    const filePath = path.join(REPORT_DIR, `${req.params.token}.pdf`);
    if (!fs.existsSync(filePath)) return res.status(404).send("Report not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    return fs.createReadStream(filePath).pipe(res);
  });
}
