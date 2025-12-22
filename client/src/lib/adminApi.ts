// lib/adminApi.ts
export async function adminApiRequest<T = any>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found. Please login again.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  // Only set content-type when we actually send a body
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({} as any));
    throw new Error(error?.message || "Admin API request failed");
  }

  // Handle empty responses safely (e.g., DELETE returns 204)
  const text = await response.text().catch(() => "");
  return (text ? (JSON.parse(text) as T) : ({} as T));
}
