import React from "react";
import * as LucideIcons from "lucide-react";

type Props = {
  name?: string | null;
  className?: string;
  fallback?: keyof typeof LucideIcons;
};

const DEFAULT_FALLBACK: keyof typeof LucideIcons = "HelpCircle";

function toPascalCase(input: string) {
  return input
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

export function DynamicLucideIcon({ name, className, fallback }: Props) {
  const safeFallback = (fallback || DEFAULT_FALLBACK) as keyof typeof LucideIcons;

  const raw = String(name || "").trim();
  const key1 = raw as keyof typeof LucideIcons;
  const key2 = toPascalCase(raw) as keyof typeof LucideIcons;

  const Icon =
    (LucideIcons as any)[key1] ||
    (LucideIcons as any)[key2] ||
    (LucideIcons as any)[safeFallback] ||
    (LucideIcons as any)[DEFAULT_FALLBACK];

  return Icon ? <Icon className={className} /> : null;
}
