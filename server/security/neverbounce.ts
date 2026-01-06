type NeverBounceResponse = {
  result: string;
  flags?: string[];
  suggested_correction?: string;
};

export async function verifyEmailWithNeverBounce(email: string) {
  const apiKey = process.env.NEVERBOUNCE_API_KEY || "";
  if (!apiKey) return { ok: false as const, reason: "NEVERBOUNCE_API_KEY not set" };

  const url = new URL("https://api.neverbounce.com/v4/single/check");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("email", email);

  const resp = await fetch(url.toString(), { method: "GET" });
  if (!resp.ok) return { ok: false as const, reason: `NeverBounce HTTP ${resp.status}` };

  const data = (await resp.json()) as NeverBounceResponse;

  const bad = new Set(["invalid", "disposable"]);
  if (bad.has(data.result)) return { ok: true as const, allow: false as const, data };

  return { ok: true as const, allow: true as const, data };
}
