import type { RequestHandler } from "express";

type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
};

export async function verifyTurnstileToken(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY || "";
  if (!secret) return { ok: false as const, reason: "TURNSTILE_SECRET_KEY is not set" };
  if (!token) return { ok: false as const, reason: "Missing turnstile token" };

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await resp.json()) as TurnstileVerifyResponse;

  if (!json.success) return { ok: false as const, reason: "Turnstile verification failed", details: json };
  return { ok: true as const, details: json };
}

export const requireTurnstile: RequestHandler = async (req, res, next) => {
  try {
    const token = (
      req.body?.turnstileToken ||
      req.body?.cfTurnstileToken ||
      req.body?.["cf-turnstile-response"] ||   // ✅ standard Turnstile field name
      req.headers?.["cf-turnstile-response"] || // (optional) if you ever send via header
      ""
    ).toString().trim();

    const ip =
      (req.headers["cf-connecting-ip"] as string) ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip;

    const result = await verifyTurnstileToken(token, ip);

    if (!result.ok) {
      const isDev = process.env.NODE_ENV !== "production";

      // Always log full details on server
      console.warn("Turnstile verify failed:", {
        reason: result.reason,
        details: (result as any).details,
      });

      return res.status(400).json({
        success: false,
        message: "Security verification failed. Please try again.",
        reason: result.reason,
        ...(isDev
          ? {
            turnstile: (result as any).details, 
          }
          : {}),
      });
    }

    (req as any).turnstile = result.details;
    next();
  } catch (e) {
    console.error("Turnstile middleware error:", e);
    return res.status(500).json({ success: false, message: "Security verification error" });
  }
};
