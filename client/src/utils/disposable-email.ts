export const DISPOSABLE_EMAIL_DOMAINS = new Set<string>([
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.com",
  "yopmail.com",
  "getnada.com",
  "mohmal.com",
  "dispostable.com",
  "trashmail.com",
]);

export function getEmailDomain(email: string): string {
  const v = (email || "").trim().toLowerCase();
  const at = v.lastIndexOf("@");
  if (at === -1) return "";
  return v.slice(at + 1);
}

export function isDisposableEmail(email: string): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
