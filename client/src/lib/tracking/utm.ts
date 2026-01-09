// src/lib/tracking/utm.ts
export type UtmParams = {
  utm_campaign_name?: string;
  utm_adgroup_name?: string;
  utm_keyword?: string;
  utm_location?: string;
  utm_device?: string;
};

const UTM_KEY = "bb_utm_params";

const safeParse = (raw: string | null) => {
  if (!raw) return {};
  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
};

export const getUtmFromUrl = (search?: string): UtmParams => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(search ?? window.location.search);
  const read = (k: string) => (params.get(k) || "").trim();

  return {
    utm_campaign_name: read("utm_campaign_name") || undefined,
    utm_adgroup_name: read("utm_adgroup_name") || undefined,
    utm_keyword: read("utm_keyword") || undefined,
    utm_location: read("utm_location") || undefined,
    utm_device: read("utm_device") || undefined,
  };
};

export const getStoredUtm = (): UtmParams => {
  if (typeof window === "undefined") return {};
  return safeParse(sessionStorage.getItem(UTM_KEY)) as UtmParams;
};

export const storeUtm = (utm: UtmParams): UtmParams => {
  if (typeof window === "undefined") return utm;

  const existing = getStoredUtm();

  const merged: UtmParams = {
    ...existing,
    ...Object.fromEntries(
      Object.entries(utm).filter(([, v]) => typeof v === "string" && v.trim().length > 0),
    ),
  };

  try {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }

  return merged;
};

export const initUtmCapture = (): UtmParams => {
  // URL → sessionStorage merge → return merged
  const fromUrl = getUtmFromUrl();
  return storeUtm(fromUrl);
};

export const getUtmParams = (): UtmParams => {
  // Prefer stored UTMs; fallback to URL
  if (typeof window === "undefined") return {};
  const stored = getStoredUtm();
  return Object.keys(stored).length ? stored : getUtmFromUrl();
};
