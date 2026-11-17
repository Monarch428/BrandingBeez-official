// server/routes/ai-business-growth.ts
import type { Express } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

import { mergeBusinessGrowthReport, type BusinessGrowthReport } from "../openai";
import { AiReportGeneratedModel, SearchConsoleConnectionModel } from "../models";

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
const REPORT_FILE_TTL_MS = Number(process.env.BUSINESS_GROWTH_PDF_TTL_HOURS || 24) * 60 * 60 * 1000;
const PDF_TOKEN_RE = /^[a-f0-9]{32}$/i;
const ANALYSIS_PROGRESS_ID_RE = /^[a-zA-Z0-9_-]{8,100}$/;
const GSC_OWNER_COOKIE = "bb_gsc_owner";
const GSC_STATE_COOKIE = "bb_gsc_oauth_state";
const GSC_SCOPE = "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/webmasters.readonly";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GSC_SITES_URL = "https://searchconsole.googleapis.com/webmasters/v3/sites";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

type AnalysisProgress = {
  phase: "queued" | "validating" | "python" | "normalizing" | "saving" | "complete" | "error";
  progress: number;
  message: string;
  updatedAt: string;
};

const analysisProgress = new Map<string, AnalysisProgress>();
const analysisProgressListeners = new Map<string, Set<(event: AnalysisProgress) => void>>();

function validProgressId(value: unknown): value is string {
  return typeof value === "string" && ANALYSIS_PROGRESS_ID_RE.test(value);
}

function publishAnalysisProgress(id: string | undefined, event: Omit<AnalysisProgress, "updatedAt">) {
  if (!id) return;
  const next: AnalysisProgress = { ...event, updatedAt: new Date().toISOString() };
  analysisProgress.set(id, next);
  for (const listener of analysisProgressListeners.get(id) || []) listener(next);

  if (next.phase === "complete" || next.phase === "error") {
    setTimeout(() => analysisProgress.delete(id), 10 * 60 * 1000).unref?.();
  }
}

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
  // PDFs are a cache, not permanent storage. Mongo records expire after 12h;
  // retain files slightly longer for email/download retries without accumulating
  // sensitive report data indefinitely.
  const cutoff = Date.now() - REPORT_FILE_TTL_MS;
  for (const name of fs.readdirSync(REPORT_DIR)) {
    if (!PDF_TOKEN_RE.test(name.replace(/\.pdf$/i, "")) || !name.endsWith(".pdf")) continue;
    const candidate = path.join(REPORT_DIR, name);
    try {
      if (fs.statSync(candidate).mtimeMs < cutoff) fs.unlinkSync(candidate);
    } catch {
      // Another request/cleanup can race us; it is safe to ignore.
    }
  }
}

function getBaseUrl(req: any) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.get("host");
  return `${proto}://${host}`;
}

function parseCookies(header: unknown): Record<string, string> {
  if (typeof header !== "string") return {};
  return header.split(";").reduce<Record<string, string>>((cookies, item) => {
    const separator = item.indexOf("=");
    if (separator < 0) return cookies;
    const key = item.slice(0, separator).trim();
    const value = item.slice(separator + 1).trim();
    if (!key) return cookies;
    try { cookies[key] = decodeURIComponent(value); } catch { cookies[key] = value; }
    return cookies;
  }, {});
}

function cookieOptions(req: any, maxAge: number) {
  return { httpOnly: true, sameSite: "lax" as const, secure: req.secure || process.env.NODE_ENV === "production", path: "/", maxAge };
}

function gscEncryptionKey(): Buffer | null {
  const raw = process.env.GSC_TOKEN_ENCRYPTION_KEY;
  return raw && raw.trim() ? crypto.createHash("sha256").update(raw).digest() : null;
}

function encryptGscToken(token: string): string {
  const key = gscEncryptionKey();
  if (!key) throw new Error("GSC_TOKEN_ENCRYPTION_KEY is not configured");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`;
}

function decryptGscToken(payload: string): string {
  const key = gscEncryptionKey();
  if (!key) throw new Error("GSC_TOKEN_ENCRYPTION_KEY is not configured");
  const [ivValue, tagValue, encryptedValue] = String(payload || "").split(".");
  if (!ivValue || !tagValue || !encryptedValue) throw new Error("Invalid encrypted Search Console token");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8");
}

async function refreshGscAccessToken(refreshToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured");
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const body: any = await response.json().catch(() => ({}));
  if (!response.ok || !body.access_token) throw new Error(body.error_description || "Google could not refresh the Search Console connection");
  return { accessToken: String(body.access_token), expiryDate: Date.now() + Number(body.expires_in || 3600) * 1000 };
}

async function gscProperties(accessToken: string) {
  const response = await fetch(GSC_SITES_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
  const body: any = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || "Google Search Console properties could not be loaded");
  return (Array.isArray(body.siteEntry) ? body.siteEntry : [])
    .filter((site: any) => typeof site?.siteUrl === "string")
    .map((site: any) => ({ siteUrl: site.siteUrl, permissionLevel: site.permissionLevel }));
}

async function gscAccountEmail(accessToken: string): Promise<string | undefined> {
  const response = await fetch(GOOGLE_USERINFO_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
  const body: any = await response.json().catch(() => ({}));
  return response.ok && typeof body.email === "string" ? body.email : undefined;
}

function frontendOrigin(req: any): string {
  if (process.env.FRONTEND_ORIGIN) return process.env.FRONTEND_ORIGIN.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "production" && req.hostname === "127.0.0.1") return "http://127.0.0.1:5173";
  return getBaseUrl(req);
}

async function resolveGscConnection(req: any, connectionId: unknown) {
  const ownerId = parseCookies(req.headers.cookie)[GSC_OWNER_COOKIE];
  const requestedId = typeof connectionId === "string" ? connectionId.trim() : "";
  // A connection is optional. If a visitor has already connected one in this
  // browser, use their latest selected property even if an older frontend
  // bundle does not yet send searchConsoleConnectionId.
  if (!ownerId) {
    if (requestedId) throw new Error("Your Search Console session is no longer available. Please reconnect it.");
    return null;
  }
  const connection = requestedId
    ? await SearchConsoleConnectionModel.findOne({ _id: requestedId, ownerId })
    : await SearchConsoleConnectionModel.findOne({ ownerId, selectedProperty: { $exists: true, $ne: "" } }).sort({ updatedAt: -1 });
  if (!connection || !connection.selectedProperty) {
    if (requestedId) throw new Error("The selected Search Console connection is unavailable.");
    return null;
  }
  // Refresh immediately before a long analysis. This avoids handing the Python
  // engine an access token that expires between dispatch and the GSC stage.
  const refreshed = await refreshGscAccessToken(decryptGscToken(connection.refreshTokenCiphertext));
  const accessToken = refreshed.accessToken;
  connection.accessTokenCiphertext = encryptGscToken(accessToken);
  connection.expiryDate = refreshed.expiryDate;
  await connection.save();
  return { accessToken, property: connection.selectedProperty };
}

function toOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function toOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const normalized = String(value)
    .replace(/,/g, "")
    .replace(/[₹$£€]/g, "")
    .replace(/%/g, "")
    .replace(/\/\s*(mo|month|yr|year)\b/gi, "")
    .replace(/\bper\s+(mo|month|yr|year)\b/gi, "")
    .trim();
  if (!normalized) return null;
  const lower = normalized.toLowerCase();
  const suffixMatch = lower.match(/^(-?\d+(?:\.\d+)?)(?:\s*)(k|m|l|lac|lakh|cr|crore)$/i);
  if (suffixMatch) {
    const base = Number(suffixMatch[1]);
    if (!Number.isFinite(base)) return null;
    const suffix = suffixMatch[2].toLowerCase();
    if (suffix === "k") return base * 1_000;
    if (suffix === "m") return base * 1_000_000;
    if (suffix === "l" || suffix === "lac" || suffix === "lakh") return base * 100_000;
    if (suffix === "cr" || suffix === "crore") return base * 10_000_000;
  }
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
    qualifiedLeadsPerMonth: toOptionalNumber(source.qualifiedLeadsPerMonth ?? source.qualifiedLeads),
    closeRate: toOptionalNumber(source.closeRate),
    avgDealValue: toOptionalNumber(source.avgDealValue),
    currentTrafficPerMonth: toOptionalNumber(source.currentTrafficPerMonth),
    teamSize: toOptionalNumber(source.teamSize),
    monthlyRecurringRevenue: toOptionalNumber(source.monthlyRecurringRevenue),

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
    monthlyRevenueRange: toOptionalString(source.monthlyRevenueRange),
    qualifiedLeadsPerMonthRange: toOptionalString(source.qualifiedLeadsPerMonthRange),
    monthlyPayrollCostRange: toOptionalString(source.monthlyPayrollCostRange),
    monthlyToolsCostRange: toOptionalString(source.monthlyToolsCostRange),
    monthlyOverheadCostRange: toOptionalString(source.monthlyOverheadCostRange),
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

  const matches = [
    ...text
      .toLowerCase()
      .replace(/[₹$£€]/g, "")
      .matchAll(/(\d+(?:\.\d+)?)\s*(k|m|l|lac|lakh|cr|crore)?/g),
  ];
  if (!matches.length) return null;

  const numbers = matches
    .map((match) => {
      const base = Number(match[1]);
      if (!Number.isFinite(base)) return null;
      const suffix = match[2];
      if (suffix === "k") return base * 1_000;
      if (suffix === "m") return base * 1_000_000;
      if (suffix === "l" || suffix === "lac" || suffix === "lakh") return base * 100_000;
      if (suffix === "cr" || suffix === "crore") return base * 10_000_000;
      return base;
    })
    .filter((item): item is number => item !== null);

  if (!numbers.length) return null;
  if (numbers.length === 1) return numbers[0];
  return (numbers[0] + numbers[1]) / 2;
}

function shouldPreferDerivedFinancialValue(
  field: keyof OptionalBusinessInputs,
  explicitValue: unknown,
  derivedValue: unknown,
): boolean {
  const explicitNumber = toOptionalNumber(explicitValue);
  const derivedNumber = toOptionalNumber(derivedValue);
  if (derivedNumber === null) return false;
  if (explicitNumber === null) return true;
  if ((field === "monthlyRevenue" || field === "monthlyRecurringRevenue") && explicitNumber > 0) {
    return false;
  }

  const monetaryLikeFields = new Set<string>([
    "monthlyRevenue",
    "monthlyAdSpend",
    "avgDealValue",
    "monthlyPayrollCost",
    "monthlyToolsCost",
    "monthlyOverheadCost",
    "monthlyRecurringRevenue",
  ]);

  if (field === "closeRate") {
    return explicitNumber > 1 && derivedNumber > 0 && derivedNumber <= 1;
  }

  if (field === "teamSize") {
    return explicitNumber < 1 && derivedNumber >= 1;
  }

  if (monetaryLikeFields.has(String(field))) {
    return explicitNumber > 0 && explicitNumber < 1000 && derivedNumber >= 1000;
  }

  return false;
}

function stabilizeSuspiciousFinancialInputs(
  inputs: OptionalBusinessInputs,
  derived: OptionalBusinessInputs,
): OptionalBusinessInputs {
  const out: OptionalBusinessInputs = { ...inputs };

  const numeric = (value: unknown) => toOptionalNumber(value);
  const ratio = (value: unknown) => {
    const parsed = numeric(value);
    if (parsed === null) return null;
    return parsed > 1 ? parsed / 100 : parsed;
  };

  const useDerivedIfSuspicious = (field: keyof OptionalBusinessInputs) => {
    if (shouldPreferDerivedFinancialValue(field, out[field], derived[field])) {
      (out as any)[field] = derived[field];
    }
  };

  useDerivedIfSuspicious("monthlyRevenue");
  useDerivedIfSuspicious("monthlyAdSpend");
  useDerivedIfSuspicious("avgDealValue");
  useDerivedIfSuspicious("monthlyPayrollCost");
  useDerivedIfSuspicious("monthlyToolsCost");
  useDerivedIfSuspicious("monthlyOverheadCost");
  useDerivedIfSuspicious("monthlyRecurringRevenue");
  useDerivedIfSuspicious("teamSize");

  const leads = numeric(out.monthlyLeads ?? out.qualifiedLeadsPerMonth ?? out.qualifiedLeads);
  const closeRate = ratio(out.closeRate);
  const avgDeal = numeric(out.avgDealValue);
  const currentRevenue = numeric(out.monthlyRevenue ?? out.monthlyRecurringRevenue);

  if (currentRevenue === null && leads && closeRate && avgDeal) {
    const modeledRevenue = leads * closeRate * avgDeal;
    if (modeledRevenue >= 1000) {
      out.monthlyRevenue = modeledRevenue;
      if (out.monthlyRecurringRevenue == null || (numeric(out.monthlyRecurringRevenue) ?? 0) < 1000) {
        out.monthlyRecurringRevenue = modeledRevenue;
      }
    }
  }

  const stabilizedRevenue = numeric(out.monthlyRevenue ?? out.monthlyRecurringRevenue);
  if (stabilizedRevenue && stabilizedRevenue >= 1000) {
    const payroll = numeric(out.monthlyPayrollCost);
    const tools = numeric(out.monthlyToolsCost);
    const overhead = numeric(out.monthlyOverheadCost);

    if (payroll !== null && payroll > 0 && payroll < 1000 && numeric(derived.monthlyPayrollCost) == null) {
      out.monthlyPayrollCost = Math.round(stabilizedRevenue * 0.5);
    }
    if (tools !== null && tools > 0 && tools < 1000 && numeric(derived.monthlyToolsCost) == null) {
      out.monthlyToolsCost = Math.max(1500, Math.round(stabilizedRevenue * 0.04));
    }
    if (overhead !== null && overhead > 0 && overhead < 1000 && numeric(derived.monthlyOverheadCost) == null) {
      out.monthlyOverheadCost = Math.max(3000, Math.round(stabilizedRevenue * 0.1));
    }
  }

  if (out.qualifiedLeadsPerMonth == null && out.qualifiedLeads != null) {
    out.qualifiedLeadsPerMonth = out.qualifiedLeads;
  }
  if (out.qualifiedLeads == null && out.qualifiedLeadsPerMonth != null) {
    out.qualifiedLeads = out.qualifiedLeadsPerMonth;
  }

  return compactOptionalBusinessInputs(out);
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
    monthlyRevenue: extractApproxNumberFromText(inputs.monthlyRevenueRange),
    currentTrafficPerMonth: extractApproxNumberFromText(inputs.currentTrafficPerMonthRange),
    qualifiedLeadsPerMonth: extractApproxNumberFromText(inputs.qualifiedLeadsPerMonthRange),
    monthlyPayrollCost: extractApproxNumberFromText(inputs.monthlyPayrollCostRange),
    monthlyToolsCost: extractApproxNumberFromText(inputs.monthlyToolsCostRange),
    monthlyOverheadCost: extractApproxNumberFromText(inputs.monthlyOverheadCostRange),
    countriesServed: toStringArray(inputs.primaryRegion),
    additionalContext: extraNotes.length > 0 ? extraNotes.join("\n") : null,
  });
}

function deepMergeReportPreservingAnalysis(base: any, overlay: any): any {
  if (Array.isArray(base) || Array.isArray(overlay)) {
    return Array.isArray(overlay) ? overlay : Array.isArray(base) ? base : [];
  }

  if (base && typeof base === "object" && overlay && typeof overlay === "object") {
    const output: Record<string, any> = { ...base };
    for (const [key, value] of Object.entries(overlay)) {
      if (value === undefined) continue;
      output[key] = key in output ? deepMergeReportPreservingAnalysis(output[key], value) : value;
    }
    return output;
  }

  return overlay !== undefined ? overlay : base;
}


function normalizeServiceRowsForStoredReport(report: any): any[] {
  const candidates: any[] = [];
  const push = (item: any) => {
    if (item === null || item === undefined) return;
    if (typeof item === "string") {
      const name = item.trim();
      if (name) candidates.push({ name, service: name, description: `Detected service offering: ${name}` });
      return;
    }
    if (typeof item === "object") {
      const name = String(item.name ?? item.service ?? item.title ?? item.label ?? item.keyword ?? "").trim();
      if (name) candidates.push({ ...item, name, service: item.service ?? name });
    }
  };
  const pushList = (value: any) => {
    if (Array.isArray(value)) value.forEach(push);
    else if (value && typeof value === "object") Object.values(value).forEach(push);
  };

  pushList(report?.servicesPositioning?.services);
  pushList(report?.servicesPositioning?.mappedServices);
  pushList(report?.servicesPositioning?.detectedServices);
  pushList(report?.servicesPositioning?.serviceList);
  pushList(report?.servicesSignals?.services);
  pushList(report?.serviceSignals);
  pushList(report?.marketDemand?.services);
  pushList(report?.meta?.businessProfile?.serviceNames);
  pushList(report?.reportMetadata?.scoreMeta?.businessProfile?.serviceNames);
  pushList(report?.websiteDigitalPresence?.websiteKeywordAnalysis?.keywordCandidates);

  const seen = new Set<string>();
  return candidates.filter((item) => {
    const key = String(item.name ?? item.service ?? "").trim().toLowerCase().replace(/\s+/g, " ");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    item.targetMarket = item.targetMarket ?? report?.meta?.businessProfile?.targetMarket ?? report?.reportMetadata?.scoreMeta?.businessProfile?.targetMarket ?? report?.targetMarket;
    return true;
  });
}

function normalizeReputationForStoredReport(report: any): void {
  const rep = report?.reputation;
  if (!rep || typeof rep !== "object") return;
  const rating = rep.reviewScore ?? rep.rating ?? rep.googleRating ?? rep.averageRating;
  const reviews = rep.totalReviews ?? rep.reviewCount ?? rep.googleReviewCount;
  if ((rep.rating == null || rep.rating === "N/A") && rating != null) rep.rating = rating;
  if ((rep.reviewCount == null || rep.reviewCount === "N/A") && reviews != null) rep.reviewCount = reviews;
  if (Array.isArray(rep.summaryTable)) {
    rep.summaryTable = rep.summaryTable.map((row: any) => {
      if (String(row?.platform ?? "").toLowerCase() !== "google") return row;
      return {
        ...row,
        rating: row?.rating === "N/A" || row?.rating == null ? rating : row.rating,
        totalReviews: row?.totalReviews || row?.reviewCount || reviews,
      };
    });
  }
}

function normalizeStoredReportForPdf(report: any): any {
  if (!report || typeof report !== "object") return report;
  const services = normalizeServiceRowsForStoredReport(report);
  if (services.length) {
    report.servicesPositioning = report.servicesPositioning && typeof report.servicesPositioning === "object"
      ? report.servicesPositioning
      : {};
    if (!Array.isArray(report.servicesPositioning.services) || report.servicesPositioning.services.length === 0) {
      report.servicesPositioning.services = services;
    }
    if (!Array.isArray(report.servicesPositioning.mappedServices) || report.servicesPositioning.mappedServices.length === 0) {
      report.servicesPositioning.mappedServices = services;
    }
    if (!report.servicesPositioning.currentServiceMenu) {
      report.servicesPositioning.currentServiceMenu = services.map((s) => s.name).join(", ");
    }
  }
  normalizeReputationForStoredReport(report);
  return report;
}

function hasMeaningfulPipelineValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (typeof value === "string") {
    const text = value.trim().toLowerCase();
    return !!text && !text.startsWith("not available") && !text.includes("currently unavailable");
  }
  if (Array.isArray(value)) return value.some((item) => hasMeaningfulPipelineValue(item));
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).some((item) => hasMeaningfulPipelineValue(item));
  return false;
}

function requirePipelineSection(source: any, keys: string[], label: string): Record<string, any> {
  for (const key of keys) {
    const section = source?.[key];
    if (section && typeof section === "object" && hasMeaningfulPipelineValue(section)) {
      return section as Record<string, any>;
    }
  }
  throw new Error(`Missing pipeline data: ${label}`);
}

function firstMeaningfulValue<T = any>(...values: T[]): T | null {
  for (const value of values) {
    if (hasMeaningfulPipelineValue(value)) {
      return value;
    }
  }
  return null;
}

function findFinancialTableValue(section: any, metrics: string[]): string | null {
  const rows = Array.isArray(section?.revenue_table)
    ? section.revenue_table
    : Array.isArray(section?.revenueTable)
      ? section.revenueTable
      : [];

  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const metric = typeof row.metric === "string" ? row.metric.trim().toLowerCase() : "";
    if (!metric) continue;
    if (metrics.some((candidate) => metric === candidate.trim().toLowerCase())) {
      const value = firstMeaningfulValue(row.value, row.amount);
      return value === null ? null : String(value);
    }
  }

  return null;
}

function hydratePipelineSectionsForPdf(source: any) {
  const competitiveSource = requirePipelineSection(source, ["competitive_analysis", "competitiveAnalysis"], "competitive_analysis");
  const costSource = requirePipelineSection(source, ["cost_optimization", "costOptimization"], "cost_optimization");
  const segmentationSource = requirePipelineSection(source, ["segmentation", "targetMarket"], "segmentation");
  const financialSource = requirePipelineSection(source, ["financial_impact", "financialImpact"], "financial_impact");

  const competitiveAnalysis =
    source?.competitiveAnalysis && hasMeaningfulPipelineValue(source.competitiveAnalysis)
      ? source.competitiveAnalysis
      : {
          mentorNotes: competitiveSource.summary ?? competitiveSource.notes ?? null,
          notes: competitiveSource.notes ?? null,
          competitors: competitiveSource.competitors ?? [],
          positioningMatrix: competitiveSource.positioning_matrix ?? [],
          opportunities: competitiveSource.opportunities ?? [],
          threats: competitiveSource.threats ?? [],
        };
  const costOptimization =
    source?.costOptimization && hasMeaningfulPipelineValue(source.costOptimization)
      ? source.costOptimization
      : {
          mentorNotes: costSource.summary ?? costSource.notes ?? null,
          notes: costSource.notes ?? null,
          estimatedMonthlySpend: costSource.estimated_monthly_spend ?? [],
          wasteAreas: costSource.waste_areas ?? [],
          automationOpportunities: costSource.automation_opportunities ?? [],
          opportunities: costSource.opportunities ?? [],
          actionCandidates: costSource.action_candidates ?? [],
          confidenceScore: costSource.confidence_score ?? null,
          estimationDisclaimer: costSource.estimation_disclaimer ?? null,
        };
  const segmentation =
    source?.targetMarket && hasMeaningfulPipelineValue(source.targetMarket)
      ? source.targetMarket
      : {
          mentorNotes: segmentationSource.summary ?? segmentationSource.notes ?? null,
          notes: segmentationSource.notes ?? null,
          segments: segmentationSource.segments ?? [],
          currentTargetSegments: segmentationSource.current_target_segments ?? segmentationSource.segments ?? [],
          detectedSegments: segmentationSource.detected_segments ?? segmentationSource.segments ?? [],
          recommendedSegments: segmentationSource.recommended_segments ?? [],
          positioningAdvice: segmentationSource.positioning_advice ?? null,
          actionCandidates: segmentationSource.action_candidates ?? [],
          confidenceScore: segmentationSource.confidence_score ?? null,
          estimationDisclaimer: segmentationSource.estimation_disclaimer ?? null,
        };
  const existingFinancialImpact =
    source?.financialImpact && typeof source.financialImpact === "object"
      ? source.financialImpact
      : {};
  const currentRevenueEstimate =
    firstMeaningfulValue(
      findFinancialTableValue(financialSource, ["Current Revenue Estimate", "Current Monthly Revenue"]),
      typeof financialSource.current_revenue_estimate === "string" ? financialSource.current_revenue_estimate : null,
      findFinancialTableValue(existingFinancialImpact, ["Current Revenue Estimate", "Current Monthly Revenue"]),
      existingFinancialImpact.currentRevenueEstimate,
      financialSource.current_revenue_estimate,
    ) ?? null;
  const financialImpact =
    {
      ...existingFinancialImpact,
      mentorNotes: firstMeaningfulValue(existingFinancialImpact.mentorNotes, financialSource.summary, financialSource.notes),
      summary: firstMeaningfulValue(existingFinancialImpact.summary, financialSource.summary, financialSource.notes),
      notes: firstMeaningfulValue(existingFinancialImpact.notes, financialSource.notes),
      revenueTable: firstMeaningfulValue(financialSource.revenue_table, existingFinancialImpact.revenueTable) ?? [],
      financialLevers:
        firstMeaningfulValue(
          financialSource.financial_levers,
          financialSource.profitability_levers,
          existingFinancialImpact.financialLevers,
          existingFinancialImpact.profitabilityLevers,
        ) ?? [],
      profitabilityLevers:
        firstMeaningfulValue(
          financialSource.profitability_levers,
          financialSource.financial_levers,
          existingFinancialImpact.profitabilityLevers,
          existingFinancialImpact.financialLevers,
        ) ?? [],
      revenueOpportunities:
        firstMeaningfulValue(
          financialSource.revenue_opportunities,
          financialSource.profitability_levers,
          existingFinancialImpact.revenueOpportunities,
          existingFinancialImpact.profitabilityLevers,
        ) ?? [],
      actionCandidates: firstMeaningfulValue(financialSource.action_candidates, existingFinancialImpact.actionCandidates) ?? [],
      currentRevenueEstimate,
      projectedRevenue: firstMeaningfulValue(financialSource.projected_revenue, existingFinancialImpact.projectedRevenue),
      annualGrowth: firstMeaningfulValue(financialSource.annual_growth, existingFinancialImpact.annualGrowth),
      improvementPotential: firstMeaningfulValue(financialSource.improvement_potential, existingFinancialImpact.improvementPotential),
      projectedRevenueIncrease: firstMeaningfulValue(financialSource.projected_revenue_increase, existingFinancialImpact.projectedRevenueIncrease),
      confidenceScore: firstMeaningfulValue(financialSource.confidence_score, existingFinancialImpact.confidenceScore),
      estimationDisclaimer: firstMeaningfulValue(financialSource.estimation_disclaimer, existingFinancialImpact.estimationDisclaimer),
    };

  return {
    ...(source || {}),
    competitive_analysis: competitiveSource,
    cost_optimization: costSource,
    segmentation: segmentationSource,
    financial_impact: financialSource,
    competitiveAnalysis,
    costOptimization,
    targetMarket: segmentation,
    financialImpact,
    sections: {
      ...(source?.sections && typeof source.sections === "object" ? source.sections : {}),
      section7: competitiveAnalysis,
      section8: costOptimization,
      section9: segmentation,
      section10: financialImpact,
      "7": competitiveAnalysis,
      "8": costOptimization,
      "9": segmentation,
      "10": financialImpact,
    },
  };
}

function buildNormalizedReportForPdf(args: {
  companyName: string;
  website: string;
  industry?: string;
  analysisSource: any;
}): BusinessGrowthReport {
  const hydratedAnalysisSource = hydratePipelineSectionsForPdf(args.analysisSource);
  const merged = mergeBusinessGrowthReport(
    {
      companyName: args.companyName,
      website: args.website,
      industry: args.industry,
    },
    hydratedAnalysisSource,
  );

  return normalizeStoredReportForPdf(
    deepMergeReportPreservingAnalysis(merged, hydratedAnalysisSource),
  ) as BusinessGrowthReport;
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
  // Search Console is intentionally an opt-in, customer-owned connection.
  // A shared .env refresh token must never be used for reports requested by
  // unrelated visitors.
  app.get("/api/ai-business-growth/search-console/status", async (req, res) => {
    const ownerId = parseCookies(req.headers.cookie)[GSC_OWNER_COOKIE];
    const configured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GSC_TOKEN_ENCRYPTION_KEY);
    if (!ownerId) return res.json({ configured, connections: [] });
    const connections = await SearchConsoleConnectionModel.find({ ownerId }).sort({ updatedAt: -1 }).lean();
    return res.json({
      configured,
      connections: connections.map((connection) => ({
        id: String(connection._id),
        email: connection.email || null,
        selectedProperty: connection.selectedProperty || null,
        properties: connection.properties || [],
        updatedAt: connection.updatedAt,
      })),
    });
  });

  app.get("/api/ai-business-growth/search-console/connect", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const encryptionKey = process.env.GSC_TOKEN_ENCRYPTION_KEY;
    if (!clientId || !clientSecret || !encryptionKey) {
      return res.status(503).send("Search Console connection is not configured on this server.");
    }
    // Reuse the browser-scoped owner id so one visitor can connect more than
    // one Google account without hiding their prior connections.
    const ownerId = parseCookies(req.headers.cookie)[GSC_OWNER_COOKIE] || crypto.randomBytes(24).toString("base64url");
    const state = crypto.randomBytes(32).toString("base64url");
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || `${getBaseUrl(req)}/api/ai-business-growth/search-console/callback`;
    res.cookie(GSC_OWNER_COOKIE, ownerId, cookieOptions(req, 30 * 24 * 60 * 60 * 1000));
    res.cookie(GSC_STATE_COOKIE, state, cookieOptions(req, 10 * 60 * 1000));
    const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authorizeUrl.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: GSC_SCOPE,
      access_type: "offline",
      prompt: "consent",
      state,
    }).toString();
    return res.redirect(authorizeUrl.toString());
  });

  app.get("/api/ai-business-growth/search-console/callback", async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const ownerId = cookies[GSC_OWNER_COOKIE];
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || `${getBaseUrl(req)}/api/ai-business-growth/search-console/callback`;
    const targetOrigin = frontendOrigin(req);
    const fail = (message: string) => res.status(400).type("html").send(`<!doctype html><title>Connection failed</title><p>Google Search Console could not be connected. You can close this window and try again.</p><script>window.opener?.postMessage({type:'bb-gsc-connected',ok:false,message:${JSON.stringify(message)}},${JSON.stringify(targetOrigin)});</script>`);
    if (!code || !ownerId || !state || state !== cookies[GSC_STATE_COOKIE]) return fail("The connection request expired. Please close this window and try again.");
    try {
      const response = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID || "", client_secret: process.env.GOOGLE_CLIENT_SECRET || "", code, redirect_uri: redirectUri, grant_type: "authorization_code" }),
      });
      const tokenPayload: any = await response.json().catch(() => ({}));
      if (!response.ok || !tokenPayload.access_token || !tokenPayload.refresh_token) throw new Error(tokenPayload.error_description || "Google did not return a reusable connection token");
      const properties = await gscProperties(String(tokenPayload.access_token));
      const email = await gscAccountEmail(String(tokenPayload.access_token));
      const connection = await SearchConsoleConnectionModel.create({
        ownerId,
        ...(email ? { email } : {}),
        accessTokenCiphertext: encryptGscToken(String(tokenPayload.access_token)),
        refreshTokenCiphertext: encryptGscToken(String(tokenPayload.refresh_token)),
        expiryDate: Date.now() + Number(tokenPayload.expires_in || 3600) * 1000,
        properties,
        selectedProperty: properties[0]?.siteUrl,
      });
      res.clearCookie(GSC_STATE_COOKIE, { path: "/" });
      return res.type("html").send(`<!doctype html><title>Search Console connected</title><p>Google Search Console connected. You can close this window.</p><script>window.opener?.postMessage({type:'bb-gsc-connected',ok:true,connectionId:${JSON.stringify(String(connection._id))}},${JSON.stringify(targetOrigin)});window.close();</script>`);
    } catch (error: any) {
      console.error("[AI-Growth] Search Console OAuth callback failed", error);
      return fail(error?.message || "Unable to connect Search Console.");
    }
  });

  app.post("/api/ai-business-growth/search-console/select", async (req, res) => {
    const ownerId = parseCookies(req.headers.cookie)[GSC_OWNER_COOKIE];
    const connectionId = typeof req.body?.connectionId === "string" ? req.body.connectionId : "";
    const property = typeof req.body?.property === "string" ? req.body.property.trim() : "";
    if (!ownerId || !connectionId || !property) return res.status(400).json({ success: false, message: "A connected property is required." });
    const connection = await SearchConsoleConnectionModel.findOne({ _id: connectionId, ownerId });
    if (!connection || !connection.properties.some((entry) => entry.siteUrl === property)) return res.status(404).json({ success: false, message: "Search Console property not found." });
    connection.selectedProperty = property;
    await connection.save();
    return res.json({ success: true, connection: { id: String(connection._id), selectedProperty: property } });
  });

  // The analysis itself is a long-running HTTP request.  This companion SSE
  // channel reports real backend milestones; it never invents a percentage
  // based on elapsed time.
  app.get("/api/ai-business-growth/progress/:requestId", (req, res) => {
    const requestId = req.params.requestId;
    if (!validProgressId(requestId)) return res.status(400).json({ message: "Invalid analysis request id" });

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const send = (event: AnalysisProgress) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
      (res as any).flush?.();
    };
    const listeners = analysisProgressListeners.get(requestId) || new Set();
    listeners.add(send);
    analysisProgressListeners.set(requestId, listeners);
    send(analysisProgress.get(requestId) || {
      phase: "queued",
      progress: 0,
      message: "Waiting for analysis to start…",
      updatedAt: new Date().toISOString(),
    });

    const heartbeat = setInterval(() => res.write(": keep-alive\n\n"), 15_000);
    req.on("close", () => {
      clearInterval(heartbeat);
      const activeListeners = analysisProgressListeners.get(requestId);
      activeListeners?.delete(send);
      if (activeListeners?.size === 0) analysisProgressListeners.delete(requestId);
    });
  });

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
      businessGoal,
      businessInputs,
      optionalBusinessInputs,
      estimationInputs,
      criteria,
      includeSections8to10,
      forceNewAnalysis,
      requestId,
      searchConsoleConnectionId,
    } = req.body || {};
    const progressId = validProgressId(requestId) ? requestId : undefined;
    publishAnalysisProgress(progressId, {
      phase: "validating",
      progress: 8,
      message: "Validating the report request and preparing your business context…",
    });

    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      publishAnalysisProgress(progressId, { phase: "error", progress: 0, message: "A company name is required to begin analysis." });
      return res.status(400).json({ success: false, message: "Company name is required" });
    }

    if (!website || typeof website !== "string" || !website.trim()) {
      publishAnalysisProgress(progressId, { phase: "error", progress: 0, message: "A website is required to begin analysis." });
      return res.status(400).json({ success: false, message: "Website is required" });
    }

    if (!location || typeof location !== "string" || !location.trim()) {
      publishAnalysisProgress(progressId, { phase: "error", progress: 0, message: "A location is required to begin analysis." });
      return res.status(400).json({ success: false, message: "Location is required" });
    }

    if (!industry || typeof industry !== "string" || !industry.trim()) {
      publishAnalysisProgress(progressId, { phase: "error", progress: 0, message: "A primary service or industry is required to begin analysis." });
      return res.status(400).json({ success: false, message: "Primary services industry is required" });
    }

    if (!targetMarket || typeof targetMarket !== "string" || !targetMarket.trim()) {
      publishAnalysisProgress(progressId, { phase: "error", progress: 0, message: "A target market is required to begin analysis." });
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
      const normalizedBusinessGoal = toOptionalString(businessGoal);
      const searchConsole = await resolveGscConnection(req, searchConsoleConnectionId);

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
      const mergedOptionalInputs = {
        ...legacyDerivedOptionalInputs,
        ...explicitOptionalInputs,
      } as OptionalBusinessInputs;
      for (const field of [
        "monthlyRevenue",
        "monthlyAdSpend",
        "avgDealValue",
        "monthlyPayrollCost",
        "monthlyToolsCost",
        "monthlyOverheadCost",
        "monthlyRecurringRevenue",
        "teamSize",
        "closeRate",
      ] as Array<keyof OptionalBusinessInputs>) {
        if (shouldPreferDerivedFinancialValue(field, explicitOptionalInputs[field], legacyDerivedOptionalInputs[field])) {
          (mergedOptionalInputs as any)[field] = legacyDerivedOptionalInputs[field];
        }
      }
      const sanitizedOptionalInputs = stabilizeSuspiciousFinancialInputs(
        mergedOptionalInputs,
        legacyDerivedOptionalInputs,
      );
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
        ...(normalizedBusinessGoal ? { businessGoal: normalizedBusinessGoal } : {}),
      };

      const payload: AnalyzeRequestPayload = {
        requestContractVersion: "business_growth_v3",
        companyName: companyName.trim(),
        website: normalizedWebsite,
        forceNewAnalysis: Boolean(forceNewAnalysis),
        // Only enable estimation mode when the user actually provided financial
        // inputs. Without real data the model guesses from near-zero signals and
        // produces nonsense values like "₹2/mo current revenue".
        estimationMode: includeOptionalInputs || includeLegacyEstimationInputs,
        location: location.trim(),
        industry: industry.trim(),
        targetMarket: normalizedTargetMarket,
        primaryTargetMarket: normalizedTargetMarket,
        ...(normalizedBusinessGoal ? { businessGoal: normalizedBusinessGoal } : {}),
        languageCode: "en",
        reportType: "full",
        ...(typeof includeSections8to10 === "boolean"
          ? { includeSections8to10 }
          : { includeSections8to10: true }),
        criteria: {
          ...mergedCriteria,
          language_code: "en",
        },
        ...(searchConsole
          ? {
              // Ephemeral internal hand-off only. It is never returned to the
              // browser or saved inside the final report document.
              searchConsoleAccessToken: searchConsole.accessToken,
              searchConsoleProperty: searchConsole.property,
            }
          : {}),
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

      publishAnalysisProgress(progressId, {
        phase: "python",
        progress: 20,
        message: "Python AI engine is collecting website, market, and business-model evidence…",
      });
      console.info(`[AI-Growth] Dispatching analysis to Python engine for ${normalizedWebsite}`);
      const py = await callPythonAiEngineAnalyze({
        baseUrl,
        apiKey,
        payload,
        timeoutMs: 180 * 60_000,
      });
      console.info(`[AI-Growth] Python engine completed analysis for ${normalizedWebsite}`);
      publishAnalysisProgress(progressId, {
        phase: "normalizing",
        progress: 72,
        message: "AI analysis received. Validating scores, recommendations, and financial assumptions…",
      });

      if (!py || py.ok !== true) {
        throw new Error(`Python engine returned failure: ${JSON.stringify(py)}`);
      }

      const analysis = {
        ...(py.reportJson || {}),
        meta: {
          ...((py.reportJson && py.reportJson.meta) || {}),
          ...((py.meta && typeof py.meta === "object") ? py.meta : {}),
        },
      };
      const analysisToken = py.token;

      publishAnalysisProgress(progressId, {
        phase: "saving",
        progress: 88,
        message: "Preparing your report for download and securely saving the analysis…",
      });
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

      publishAnalysisProgress(progressId, {
        phase: "complete",
        progress: 100,
        message: "Analysis complete. Your growth report is ready.",
      });
      return res.json({
        success: true,
        analysis,
        analysisToken,
        reportId: py.reportId,
        meta: py.meta || {},
      });
    } catch (err: any) {
      console.error("[AI-Growth] Python engine error", err);
      publishAnalysisProgress(progressId, {
        phase: "error",
        progress: 0,
        message: err?.message || "The analysis could not be completed.",
      });
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

      const normalizedReport = buildNormalizedReportForPdf({
        companyName: resolvedCompany,
        website: resolvedWebsite,
        industry: industry || storedReport.industry,
        analysisSource,
      });
      console.log("Sections:", (normalizedReport as any).sections);
      console.log("Section 10:", (normalizedReport as any).financial_impact);

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
        const normalizedReport = buildNormalizedReportForPdf({
          companyName: resolvedCompany,
          website: resolvedWebsite,
          industry: storedReport.industry,
          analysisSource,
        });
        console.log("Sections:", (normalizedReport as any).sections);
        console.log("Section 10:", (normalizedReport as any).financial_impact);

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
          const normalizedReport = buildNormalizedReportForPdf({
            companyName: resolvedCompany,
            website: resolvedWebsite,
            industry: storedReport.industry,
            analysisSource,
          });
          console.log("Sections:", (normalizedReport as any).sections);
          console.log("Section 10:", (normalizedReport as any).financial_impact);

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

      const normalizedReport = buildNormalizedReportForPdf({
        companyName: resolvedCompany,
        website: resolvedWebsite,
        industry: storedReport.industry,
        analysisSource,
      });
      console.log("Sections:", (normalizedReport as any).sections);
      console.log("Section 10:", (normalizedReport as any).financial_impact);

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
    const token = String(req.params.token || "");
    if (!PDF_TOKEN_RE.test(token)) return res.status(404).send("Report not found");
    ensureReportDir();
    const filePath = path.join(REPORT_DIR, `${token}.pdf`);
    if (!fs.existsSync(filePath)) return res.status(404).send("Report not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Disposition", "inline");
    return fs.createReadStream(filePath).pipe(res);
  });
}
