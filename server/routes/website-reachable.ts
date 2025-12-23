import type { Express } from "express";

function normalizeWebsiteUrl(input: string) {
  const trimmed = (input || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal, redirect: "follow" });
    return res;
  } finally {
    clearTimeout(t);
  }
}

export function registerWebsiteReachableRoutes(app: Express) {
  app.post("/api/utils/website-reachable", async (req, res) => {
    const rawWebsite = req.body?.website;

    if (!rawWebsite || typeof rawWebsite !== "string") {
      return res.status(400).json({ ok: false, reachable: false, message: "Website is required" });
    }

    const website = normalizeWebsiteUrl(rawWebsite);
    try {
      // Some websites block HEAD; we try HEAD first, then GET fallback.
      const commonHeaders = {
        "User-Agent": "BrandingBeezBot/1.0 (+https://brandingbeez.com)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      };

      let r: Response | null = null;

      try {
        r = await fetchWithTimeout(website, { method: "HEAD", headers: commonHeaders }, 7000);
      } catch {
        r = null;
      }

      if (!r || r.status === 405 || r.status === 403) {
        // Fallback to GET (but don't download huge content)
        r = await fetchWithTimeout(
          website,
          {
            method: "GET",
            headers: {
              ...commonHeaders,
              Range: "bytes=0-2048", // just grab first 2KB if supported
            },
          },
          9000,
        );
      }

      const status = r.status;
      const reachable = status >= 200 && status < 500; // treat 4xx as reachable but blocked
      return res.json({
        ok: true,
        reachable,
        status,
        finalUrl: r.url,
        note: reachable
          ? "Website responded"
          : "No valid response (timeout/DNS/network failure)",
      });
    } catch (err: any) {
      const msg = err?.name === "AbortError" ? "Timeout" : (err?.message || "Unknown error");
      return res.json({ ok: true, reachable: false, status: null, message: msg });
    }
  });
}
