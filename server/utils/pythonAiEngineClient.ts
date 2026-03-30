// server/utils/pythonAiEngineClient.ts
import { Agent, fetch as undiciFetch } from "undici";

export type OptionalBusinessInputs = {
  currency?: string | null;
  monthlyRevenue?: number | null;
  monthlyAdSpend?: number | null;
  monthlyToolsCost?: number | null;
  monthlyPayrollCost?: number | null;
  monthlyOverheadCost?: number | null;
  monthlyLeads?: number | null;
  qualifiedLeads?: number | null;
  closeRate?: number | null;
  avgDealValue?: number | null;
  currentTrafficPerMonth?: number | null;

  countriesServed?: string[];
  customerSegments?: string[];
  painPoints?: string[];
  segmentBudgets?: string[];

  revenueByService?: Array<{ service: string; amount: string }>;
  revenueByChannel?: Array<{ channel: string; amount: string }>;

  grossMargin?: number | null;
  retentionRate?: number | null;
  churnRate?: number | null;
  salesCycleDays?: number | null;

  additionalContext?: string | null;
};

export type LegacyEstimationInputs = {
  monthlyAdSpendRange?: string | null;
  toolsStackEstimate?: string | null;
  teamSizeRange?: string | null;
  idealCustomer?: string | null;
  primaryRegion?: string | null;
  avgDealValueRange?: string | null;
  leadsPerMonthRange?: string | null;
  closeRateRange?: string | null;
  currentTrafficPerMonthRange?: string | null;
};

export type AnalyzeRequestPayload = {
  companyName: string;
  website: string;
  forceNewAnalysis?: boolean;
  estimationMode?: boolean;
  location?: string;
  industry?: string;
  targetMarket?: string;
  primaryTargetMarket?: string;
  languageCode?: string;
  reportType?: "quick" | "full" | string;
  criteria?: Record<string, any>;
  optionalBusinessInputs?: OptionalBusinessInputs;
  estimationInputs?: LegacyEstimationInputs;
  businessInputs?: OptionalBusinessInputs;
  includeSections8to10?: boolean;
  [key: string]: any;
};

export type AnalyzePayload = AnalyzeRequestPayload;

function normalizeBaseUrl(raw: string) {
  let b = (raw || "").trim().replace(/\/+$/, "");
  if (b.endsWith("/api")) b = b.slice(0, -4);
  return b;
}

const PY_ENGINE_DISPATCHER = new Agent({
  connect: { timeout: 60_000 },
  headersTimeout: 0,
  bodyTimeout: 0,
});

export async function callPythonAiEngineAnalyze(opts: {
  baseUrl: string;
  apiKey?: string;
  payload: AnalyzeRequestPayload;
  timeoutMs?: number;
}) {
  const baseUrl = normalizeBaseUrl(opts.baseUrl);
  if (!baseUrl) throw new Error("AI_ENGINE_BASE_URL is missing");

  const url = `${baseUrl}/api/analyze`;

  const maxWait =
    typeof opts.timeoutMs === "number" && opts.timeoutMs > 0
      ? opts.timeoutMs
      : 30 * 60_000;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), maxWait);

  try {
    const resp = await undiciFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(opts.apiKey ? { "X-AI-ENGINE-KEY": opts.apiKey } : {}),
      },
      body: JSON.stringify(opts.payload || {}),
      dispatcher: PY_ENGINE_DISPATCHER,
      signal: ac.signal,
    });

    const text = await resp.text().catch(() => "");

    if (!resp.ok) {
      throw new Error(`Python engine HTTP ${resp.status}: ${text}`);
    }

    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timer);
  }
}
