export const DISPOSABLE_DOMAINS = new Set<string>([
  "10minutemail.com",
  "10minutemail.net",
  "10mail.org",
  "20minutemail.com",
  "30minutemail.com",

  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "guerrillamail.de",
  "grr.la",

  "mailinator.com",
  "maildrop.cc",
  "mailnesia.com",
  "emailondeck.com",
  "fakeinbox.com",

  "tempmail.com",
  "tempmail.org",
  "temp-mail.org",
  "temp-mail.io",
  "tempmailo.com",

  "yopmail.com",
  "getnada.com",
  "mohmal.com",
  "dispostable.com",
  "trashmail.com",
  "spamgourmet.com",
  "sharklasers.com",
  "mail.tm",
  "dropmail.me $0.0800/sms",
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
  return DISPOSABLE_DOMAINS.has(domain);
}
