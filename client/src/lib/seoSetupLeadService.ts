export interface CreateSeoSetupLeadPayload {
  fullName: string;
  websiteUrl: string;
  email: string;
}

export interface SeoSetupLead {
  _id?: string;
  id?: string | number;
  fullName: string;
  websiteUrl: string;
  email: string;
  createdAt?: string;
}

export interface GetAllSeoSetupLeadsResponse {
  message?: string;
  data?: SeoSetupLead[];
  leads?: SeoSetupLead[];
}

export interface GetSeoSetupLeadByIdResponse {
  message?: string;
  data?: SeoSetupLead;
  lead?: SeoSetupLead;
}

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    "";

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createSeoSetupLead(payload: CreateSeoSetupLeadPayload) {
  const requestBody = {
    fullName: payload.fullName,
    websiteUrl: payload.websiteUrl,
    email: payload.email,
    inquiry_type: "seosetup" as const,
  };

  const res = await fetch("/api/seo-setup-leads/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    console.error("Failed to create SEO setup lead, body:", data);
    throw new Error(data?.message || "Failed to create SEO setup lead");
  }

  return data;
}

export async function fetchSeoSetupLeads(): Promise<SeoSetupLead[]> {
  const res = await fetch("/api/seo-setup-leads/list", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const msg =
      body?.message || `Failed to load SEO setup leads (HTTP ${res.status})`;

    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }

  return (body?.data || body?.leads || []) as SeoSetupLead[];
}

export async function fetchSeoSetupLeadById(
  id: string,
): Promise<SeoSetupLead> {
  const res = await fetch(
    `/api/seo-setup-leads/view/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const msg =
      body?.message || `Failed to load SEO setup lead (HTTP ${res.status})`;

    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }

  return (body?.data || body?.lead || body) as SeoSetupLead;
}

export async function deleteSeoSetupLead(id: string) {
  const res = await fetch(
    `/api/seo-setup-leads/delete/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete SEO setup lead");
  }

  return data;
}