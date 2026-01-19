// server/utils/pythonAiEngineClient.ts
// ✅ Guaranteed long-running client using undici.fetch + Agent.
// Avoids Node global fetch default 5min headers timeout.

import { Agent, fetch as undiciFetch } from "undici";

export type AnalyzePayload = Record<string, any>;

function normalizeBaseUrl(raw: string) {
  let b = (raw || "").trim().replace(/\/+$/, "");
  if (b.endsWith("/api")) b = b.slice(0, -4);
  return b;
}

// ✅ Single shared dispatcher (reuse connections)
const PY_ENGINE_DISPATCHER = new Agent({
  connect: { timeout: 60_000 },
  headersTimeout: 0, // disable headers timeout (fix)
  bodyTimeout: 0,    // disable body timeout
});

export async function callPythonAiEngineAnalyze(opts: {
  baseUrl: string;
  apiKey?: string;
  payload: AnalyzePayload;
  timeoutMs?: number; // AbortController overall max time
}) {
  const baseUrl = normalizeBaseUrl(opts.baseUrl);
  if (!baseUrl) throw new Error("AI_ENGINE_BASE_URL is missing");

  const url = `${baseUrl}/api/analyze`;

  // Keep a high max wait (don’t hang forever)
  const maxWait =
    typeof opts.timeoutMs === "number" && opts.timeoutMs > 0
      ? opts.timeoutMs
      : 30 * 60_000; // 30 mins

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
