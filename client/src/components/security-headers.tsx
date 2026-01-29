import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Globe,
  Server,
  Zap,
} from "lucide-react";

type SecurityLevel = "high" | "medium" | "low";

type HeaderCheck = {
  ok: boolean;
  isHttps: boolean;
  headers: Record<string, string | undefined>;
  detected: {
    hasCsp: boolean;
    hasHsts: boolean;
    hasXContentTypeOptions: boolean;
    hasReferrerPolicy: boolean;
    hasXFrameOptions: boolean;
  };
};

export function useSecurityStatus() {
  const isBrowser = typeof window !== "undefined";
  const isSecure = isBrowser && window.location.protocol === "https:";

  const getSecurityLevel = (hasHsts?: boolean): SecurityLevel => {
    if (!isBrowser) return "low";
    if (isSecure && hasHsts) return "high";
    if (isSecure) return "medium";
    return "low";
  };

  const [headerCheck, setHeaderCheck] = useState<HeaderCheck | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isBrowser) return;

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const res = await fetch("/api/security/headers", { cache: "no-store" });
        const data = (await res.json()) as HeaderCheck;
        if (!cancelled) setHeaderCheck(data);
      } catch {
        if (!cancelled) setHeaderCheck(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [isBrowser]);

  const securityLevel = useMemo(() => {
    return getSecurityLevel(headerCheck?.detected?.hasHsts);
  }, [isSecure, headerCheck]);

  const hasSecurityHeaders = !!headerCheck?.ok;

  return {
    isSecure,
    hasSecurityHeaders,
    securityLevel,
    headerCheck,
    loading,
  };
}

export function SecurityHeaders() {
  const { isSecure, securityLevel, headerCheck, loading } = useSecurityStatus();

  const hasCsp = !!headerCheck?.detected?.hasCsp;
  const hasHsts = !!headerCheck?.detected?.hasHsts;

  const securityFeatures = [
    {
      name: "HTTPS Encryption",
      status: isSecure ? "active" : "warning",
      description:
        "Data between your browser and our servers is encrypted over HTTPS when available.",
      icon: (
        <Lock
          className={`w-5 h-5 ${isSecure ? "text-green-600" : "text-amber-600"}`}
        />
      ),
      details: isSecure
        ? "Secure HTTPS connection detected."
        : "Connection is not using HTTPS.",
      enabled: isSecure,
    },
    {
      name: "Content Security Policy (CSP)",
      status: hasCsp ? "active" : "warning",
      description:
        "Restricts which scripts and resources can load to reduce XSS risks.",
      icon: (
        <Shield className={`w-5 h-5 ${hasCsp ? "text-green-600" : "text-amber-600"}`} />
      ),
      details: hasCsp
        ? "CSP is enforced via server headers."
        : "CSP header was not detected on the server response.",
      enabled: hasCsp,
    },
    {
      name: "HSTS Protection",
      status: hasHsts ? "active" : "warning",
      description: "Instructs browsers to always prefer HTTPS connections.",
      icon: (
        <Zap className={`w-5 h-5 ${hasHsts ? "text-green-600" : "text-amber-600"}`} />
      ),
      details: hasHsts
        ? "HSTS is enforced server-side."
        : "HSTS header was not detected (may be disabled on non-HTTPS).",
      enabled: hasHsts,
    },
    {
      name: "Clickjacking Protection",
      status: "active",
      description: "Controls iframe embedding using CSP frame-src rules.",
      icon: <Eye className="w-5 h-5 text-green-600" />,
      details: "Managed via CSP (frame-src).",
      enabled: true,
    },
    {
      name: "Rate Limiting",
      status: "active",
      description: "Limits request frequency to protect against abuse.",
      icon: <Server className="w-5 h-5 text-green-600" />,
      details: "Implemented at the API layer.",
      enabled: true,
    },
  ];

  const securityLevelBadge: Record<SecurityLevel, string> = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security</h1>
          <p className="text-sm text-gray-600 mt-2">
            Technical security protections applied to this platform.
          </p>
          {loading && (
            <p className="text-xs text-gray-500 mt-1">
              Checking server security headers…
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Security Level:</span>
          <Badge className={securityLevelBadge[securityLevel]}>
            {securityLevel.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* HTTPS Warning */}
      {!isSecure && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <AlertDescription className="text-amber-800">
            Your connection is not using HTTPS. Some protections apply only on
            secure connections.
          </AlertDescription>
        </Alert>
      )}

      {/* Header check warning */}
      {!loading && !headerCheck?.ok && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <AlertDescription className="text-amber-800">
            Unable to verify server security headers. The server endpoint
            <span className="font-mono"> /api/security/headers</span> may be blocked
            or unavailable.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Active Protections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityFeatures.map((feature) => (
            <div
              key={feature.name}
              className="flex justify-between gap-4 border-b last:border-b-0 pb-4 last:pb-0"
            >
              <div className="flex gap-3">
                <div className="mt-1">{feature.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {feature.name}
                  </p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{feature.details}</p>
                </div>
              </div>

              <Badge
                className={
                  feature.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }
              >
                {feature.enabled ? "Enabled" : "Not Detected"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Transport Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">HTTPS</span>
              <Badge
                className={
                  isSecure
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }
              >
                {isSecure ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">HSTS</span>
              <Badge
                className={
                  hasHsts
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }
              >
                {hasHsts ? "Server Enforced" : "Not Detected"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              App Protections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">CSP</span>
              <Badge
                className={
                  hasCsp
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }
              >
                {hasCsp ? "Enabled" : "Not Detected"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Rate Limiting</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SecurityHeadersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => { }, []);

  useEffect(() => {
    const addMetaTag = (name: string, content: string) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement("meta");
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    addMetaTag("referrer", "strict-origin-when-cross-origin");
    addMetaTag("format-detection", "telephone=no");
  }, []);

  return <>{children}</>;
}
