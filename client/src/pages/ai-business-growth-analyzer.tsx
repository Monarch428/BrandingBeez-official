// client/src/pages/ai-business-growth-analyzer.tsx
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
  Download,
  RefreshCcw,
  Gauge,
  AlertTriangle,
  FileText,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import AgencyContactSection from "@/components/agency-contact-section";
import { Link } from "wouter";

interface FormState {
  companyName: string;
  website: string;
  location: string;
  industry: string; // Primary services industry
  targetMarket: string;
}

interface FormErrors {
  companyName?: string;
  website?: string;
  location?: string;
  industry?: string;
  targetMarket?: string;
}

interface LeadFormState {
  email: string;
  phone: string;
  consent: boolean;
}

interface LeadFormErrors {
  email?: string;
  phone?: string;
  consent?: string;
}

type Step = "capture" | "existing" | "analysis" | "summary" | "lead" | "success";
type StageState = "pending" | "active" | "complete";

const stepOrder: Step[] = ["capture", "existing", "analysis", "summary", "lead", "success"];

interface QuickWin {
  title: string;
  impact: string;
  time: string;
  cost: string;
  details: string;
}

type PageSpeedOpportunity = {
  title: string;
  score?: number;
  description?: string;
};

type PageSpeedDeviceResult = {
  performanceScore?: number; // 0-100
  accessibilityScore?: number;
  bestPracticesScore?: number;
  seoScore?: number;

  fcpMs?: number;
  lcpMs?: number;
  cls?: number;
  tbtMs?: number;
  speedIndexMs?: number;

  metrics?: {
    fcpMs?: number | null;
    lcpMs?: number | null;
    cls?: number | null;
    tbtMs?: number | null;
    speedIndexMs?: number | null;
  };

  opportunities?: PageSpeedOpportunity[];
};

interface BusinessGrowthReport {
  reportMetadata: {
    reportId: string;
    companyName: string;
    website: string;
    analysisDate: string;
    overallScore: number | null;
    subScores?: {
      website?: number | null;
      seo?: number | null;
      reputation?: number | null;
      leadGen?: number | null;
      services?: number | null;
      costEfficiency?: number | null;
    };
  };
  executiveSummary: {
    strengths: string[];
    weaknesses: string[];
    biggestOpportunity: string;
    quickWins: QuickWin[];
  };

  websiteDigitalPresence?: {
    technicalSEO?: {
      pageSpeed?: {
        mobile?: PageSpeedDeviceResult;
        desktop?: PageSpeedDeviceResult;
      };
    };
  };
}

const analysisStages = [
  { label: "Initialization", duration: 2, progress: 5, message: "Connecting to your website..." },
  { label: "Website Crawl", duration: 12, progress: 20, message: "Scanning website structure..." },
  { label: "SEO Analysis", duration: 10, progress: 40, message: "Analyzing SEO performance..." },
  { label: "Reputation Check", duration: 8, progress: 55, message: "Checking online reputation..." },
  { label: "Lead Gen Audit", duration: 10, progress: 70, message: "Auditing lead generation funnels..." },
  { label: "Cost Assessment", duration: 8, progress: 85, message: "Analyzing service delivery costs..." },
  { label: "Speed Test (Core Web Vitals)", duration: 10, progress: 95, message: "Running real speed test (PageSpeed + CWV)..." },
  { label: "Report Generation", duration: 5, progress: 99, message: "Compiling your report..." },
  { label: "Complete", duration: 1, progress: 100, message: "Analysis complete!" },
];

const teaserMessages = [
  "We found keyword opportunities you're missing...",
  "Your competitors may be outranking you on high-value terms...",
  "We identified untapped lead generation channels...",
  "We found potential cost savings in your delivery process...",
  "Your reputation score is strong, but review responses can improve trust...",
];

const disposableEmailDomains = ["mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com", "trashmail.com"];

function normalizeWebsiteUrl(url: string) {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const withProtocol = hasProtocol ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/$/, "");
}

function validateWebsite(url: string): string | undefined {
  if (!url.trim()) return "Please enter your website URL";
  const normalized = normalizeWebsiteUrl(url);
  const isValidFormat = /^https?:\/\/[^\s]+\.[^\s]+$/i.test(normalized);
  if (!isValidFormat) return "Please enter a valid URL (e.g., example.com)";
  return undefined;
}

function validateCompanyName(name: string): string | undefined {
  if (!name.trim()) return "Please enter your company name";
  if (name.trim().length < 2) return "Company name must be at least 2 characters";
  return undefined;
}

function validateLocation(location: string): string | undefined {
  if (!location?.trim()) return "Please enter your location (city / region)";
  if (location.trim().length < 2) return "Location must be at least 2 characters";
  return undefined;
}

function validatePrimaryServicesIndustry(industry: string): string | undefined {
  if (!industry?.trim()) return "Please enter your primary services industry";
  if (industry.trim().length < 2) return "Primary services industry must be at least 2 characters";
  return undefined;
}

function validateTargetMarketField(targetMarket: string): string | undefined {
  if (!targetMarket?.trim()) return "Please enter your target market";
  if (targetMarket.trim().length < 2) return "Target market must be at least 2 characters";
  return undefined;
}

function validateEmail(email: string) {
  if (!email.trim()) return "Please enter your email address";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain && disposableEmailDomains.includes(domain)) return "Please use a business or personal email";
  return undefined;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}${
    digits.length > 11 ? ` ${digits.slice(11)}` : ""
  }`;
}

function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "Please enter your phone number";
  if (digits.length < 10) return "Phone number must be at least 10 digits";
  return undefined;
}

function getMetric(device: PageSpeedDeviceResult | undefined, key: keyof NonNullable<PageSpeedDeviceResult["metrics"]> | keyof PageSpeedDeviceResult) {
  if (!device) return null;
  // prefer nested metrics if present
  if (device.metrics && key in device.metrics) return (device.metrics as any)[key] ?? null;
  return (device as any)[key] ?? null;
}

function formatMs(v: any) {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  if (n < 1000) return `${Math.round(n)}ms`;
  return `${(n / 1000).toFixed(2)}s`;
}

function StageItem({ label, state, message }: { label: string; state: StageState; message: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border p-3",
        state === "complete" && "bg-emerald-50 border-emerald-200",
        state === "active" && "bg-primary/5 border-primary/20",
        state === "pending" && "bg-white border-gray-200",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border",
            state === "complete" && "bg-emerald-600 border-emerald-600 text-white",
            state === "active" && "bg-primary border-primary text-white",
            state === "pending" && "bg-white border-gray-200 text-gray-400",
          )}
        >
          {state === "complete" ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">•</span>}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-600">{message}</p>
        </div>
      </div>
      {state === "active" && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
    </div>
  );
}

function ReportCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl bg-white border shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const safe = Number.isFinite(score) ? score : 0;
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3">
      <Gauge className="w-5 h-5 text-primary" />
      <div>
        <p className="text-xs text-gray-500">Overall Score</p>
        <p className="text-lg font-bold text-gray-900">{safe}/100</p>
      </div>
    </div>
  );
}

/**
 * ✅ FIXED: This function was corrupted in your pasted file.
 * It must ONLY call /api/utils/website-reachable with { website }.
 */
async function checkWebsiteReachableViaBackendBestEffort(
  website: string,
  timeoutMs = 6000,
): Promise<{ ok: boolean; reachable?: boolean; timedOut?: boolean }> {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("/api/utils/website-reachable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ website }),
    });

    const data = await res.json().catch(() => ({}));
    // expected: { ok:true, reachable:true/false }
    return {
      ok: Boolean(data?.ok ?? res.ok),
      reachable: data?.reachable,
      timedOut: false,
    };
  } catch {
    return { ok: false, timedOut: true };
  } finally {
    window.clearTimeout(t);
  }
}

async function checkLatestReportBestEffort(
  website: string,
  companyName: string,
  timeoutMs = 8000,
): Promise<{
  ok: boolean;
  exists: boolean;
  downloadUrl?: string | null;
  analysisToken?: string | null;
  updatedAt?: string | null;
  message?: string | null;
}> {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("/api/ai-business-growth/latest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ website, companyName }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, exists: false, message: data?.message || "Failed to check existing report" };

    return {
      ok: true,
      exists: Boolean(data?.exists),
      downloadUrl: data?.downloadUrl ?? null,
      analysisToken: data?.analysisToken ?? null,
      updatedAt: data?.updatedAt ?? null,
      message: data?.message ?? null,
    };
  } catch {
    return { ok: false, exists: false };
  } finally {
    window.clearTimeout(t);
  }
}

export default function AIBusinessGrowthAnalyzerPage() {
  const companyNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<Step>("capture");

  const [formState, setFormState] = useState<FormState>({
    companyName: "",
    website: "",
    location: "",
    industry: "",
    targetMarket: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing report checks
  const [latestCheckLoading, setLatestCheckLoading] = useState(false);
  const [latestCheckMessage, setLatestCheckMessage] = useState<string | null>(null);
  const [latestExists, setLatestExists] = useState(false);
  const [latestDownloadUrl, setLatestDownloadUrl] = useState<string | null>(null);
  const [latestAnalysisToken, setLatestAnalysisToken] = useState<string | null>(null);
  const [latestUpdatedAt, setLatestUpdatedAt] = useState<string | null>(null);

  const [existingPdfError, setExistingPdfError] = useState<string | null>(null);
  const [isGeneratingExistingPdf, setIsGeneratingExistingPdf] = useState(false);

  // Analysis
  const [isAnalyzingBackend, setIsAnalyzingBackend] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<BusinessGrowthReport | null>(null);
  const [analysisToken, setAnalysisToken] = useState<string | null>(null);
  const [lastAnalyzedWebsite, setLastAnalyzedWebsite] = useState<string | null>(null);

  // Progress simulation UI
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Ready to start");
  const [stageStates, setStageStates] = useState<StageState[]>(Array(analysisStages.length - 1).fill("pending"));
  const [teaserIndex, setTeaserIndex] = useState(0);

  // Report generation
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportDownloadUrl, setReportDownloadUrl] = useState<string>("");

  // Lead capture
  const [leadForm, setLeadForm] = useState<LeadFormState>({ email: "", phone: "", consent: false });
  const [leadErrors, setLeadErrors] = useState<LeadFormErrors>({});
  const [leadSubmitError, setLeadSubmitError] = useState<string | null>(null);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  // Email send status
  const [isSendingReportEmail, setIsSendingReportEmail] = useState(false);
  const [reportEmailStatus, setReportEmailStatus] = useState<string | null>(null);

  // Optional: track source (wizard)
  const analysisSource = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("source");
    } catch {
      return null;
    }
  }, []);

  const progressPercentage = useMemo(() => Math.max(0, Math.min(100, progress)), [progress]);

  const analysisDate = useMemo(() => {
    const d = analysisData?.reportMetadata?.analysisDate;
    if (!d) return "";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }, [analysisData?.reportMetadata?.analysisDate]);

  const score = useMemo(() => {
    const raw = analysisData?.reportMetadata?.overallScore;
    const n = raw === null || raw === undefined ? 0 : Number(raw);
    return Number.isFinite(n) ? n : 0;
  }, [analysisData?.reportMetadata?.overallScore]);

  const pageSpeedMobile = useMemo(
    () => analysisData?.websiteDigitalPresence?.technicalSEO?.pageSpeed?.mobile,
    [analysisData],
  );
  const pageSpeedDesktop = useMemo(
    () => analysisData?.websiteDigitalPresence?.technicalSEO?.pageSpeed?.desktop,
    [analysisData],
  );

  const summaryStrengths = useMemo(() => analysisData?.executiveSummary?.strengths ?? [], [analysisData]);
  const summaryWeaknesses = useMemo(() => analysisData?.executiveSummary?.weaknesses ?? [], [analysisData]);
  const biggestOpportunity = useMemo(() => analysisData?.executiveSummary?.biggestOpportunity ?? "", [analysisData]);

  const reportPreview = useMemo(
    () => [
      { title: "Website", description: "Structure, UX, technical score insights" },
      { title: "SEO", description: "On-page + technical SEO signals" },
      { title: "Reputation", description: "Review footprint & trust signals" },
      { title: "Lead Gen", description: "Funnels + conversion opportunities" },
    ],
    [],
  );

  // Rotate teaser messages during analysis
  useEffect(() => {
    if (step !== "analysis") return;
    const t = window.setInterval(() => setTeaserIndex((p) => (p + 1) % teaserMessages.length), 3500);
    return () => window.clearInterval(t);
  }, [step]);

  // Progress stage simulation during analysis
  useEffect(() => {
    if (step !== "analysis") return;

    let cancelled = false;
    setProgress(0);
    setStatusMessage(analysisStages[0].message);
    setStageStates(Array(analysisStages.length - 1).fill("pending"));

    const run = async () => {
      for (let i = 0; i < analysisStages.length; i++) {
        if (cancelled) return;

        const current = analysisStages[i];

        // Update states for non-terminal stages
        if (i < analysisStages.length - 1) {
          setStageStates((prev) => {
            const next = [...prev];
            for (let k = 0; k < next.length; k++) {
              if (k < i) next[k] = "complete";
              else if (k === i) next[k] = "active";
              else next[k] = "pending";
            }
            return next;
          });
        } else {
          // final stage
          setStageStates((prev) => prev.map((s) => (s === "complete" ? s : "complete")));
        }

        setStatusMessage(current.message);
        setProgress(current.progress);

        await new Promise((r) => setTimeout(r, current.duration * 600));
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [step]);

  const handleInputChange = (key: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const runAnalysis = async (normalizedWebsite: string, opts?: { forceNewAnalysis?: boolean }) => {
    setIsAnalyzingBackend(true);
    setAnalysisError(null);
    setAnalysisData(null);
    setReportDownloadUrl("");
    setReportError(null);
    setExistingPdfError(null);

    setLastAnalyzedWebsite(normalizedWebsite);

    try {
      const response = await fetch("/api/ai-business-growth/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ✅ only the 5 inputs we want from frontend
          companyName: formState.companyName.trim(),
          website: normalizedWebsite,
          location: formState.location.trim(),
          industry: formState.industry.trim(),
          targetMarket: formState.targetMarket.trim(),

          // frontend can request forceNewAnalysis; backend should set estimationMode true by default
          forceNewAnalysis: Boolean(opts?.forceNewAnalysis),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload?.code === "WEBSITE_NOT_REACHABLE") {
          const msg = payload?.message || "Website is not reachable. Please enter a correct URL and try again.";
          setErrors((prev) => ({ ...(prev as FormErrors), website: msg }));
          setStep("capture");
          throw new Error(msg);
        }
        throw new Error(payload?.message || "Unable to generate analysis");
      }

      if (!payload?.analysis) throw new Error(payload?.message || "Unable to generate analysis");

      setAnalysisData(payload.analysis as BusinessGrowthReport);
      if (payload?.analysisToken) setAnalysisToken(String(payload.analysisToken));

      // Once backend analysis is ready, go to summary screen
      setStep("summary");
    } catch (error) {
      console.error("Business growth analysis failed", error);
      setAnalysisError((prev) => prev || "We couldn't generate the live analysis. Please try again.");
      setAnalysisData(null);
      setStep("summary");
    } finally {
      setIsAnalyzingBackend(false);
    }
  };

  // ✅ Create PDF from a stored token (no analysis)
  const generatePdfFromStoredToken = async (token: string, autoOpen = true) => {
    setExistingPdfError(null);
    setIsGeneratingExistingPdf(true);

    try {
      const res = await fetch("/api/ai-business-growth/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisToken: token,
          website: normalizeWebsiteUrl(formState.website),
          companyName: formState.companyName.trim(),
          industry: formState.industry.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success || !data?.downloadUrl) {
        throw new Error(data?.message || "Failed to generate PDF from stored analysis");
      }

      const url = String(data.downloadUrl);
      setReportDownloadUrl(url);
      setAnalysisToken(token);

      setLeadId("lead-" + Math.random().toString(36).slice(2, 8));
      setStep("success");
      if (autoOpen) window.open(url, "_blank");
    } catch (e) {
      console.error("Generate stored PDF failed", e);
      setExistingPdfError("Could not generate the PDF from stored analysis. Please try again or run a new analysis.");
    } finally {
      setIsGeneratingExistingPdf(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {
      companyName: validateCompanyName(formState.companyName),
      website: validateWebsite(formState.website),
      location: validateLocation(formState.location),
      industry: validatePrimaryServicesIndustry(formState.industry),
      targetMarket: validateTargetMarketField(formState.targetMarket),
    };

    const hasErrors = Object.values(nextErrors).some(Boolean);
    setErrors(nextErrors);
    if (hasErrors) {
      // focus first field
      if (nextErrors.companyName) companyNameRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    const normalizedUrl = normalizeWebsiteUrl(formState.website);

    // 1) Reachability check
    const reachability = await checkWebsiteReachableViaBackendBestEffort(normalizedUrl, 8000);
    if (!reachability.ok || reachability.timedOut || reachability.reachable !== true) {
      setIsSubmitting(false);
      setErrors((prev) => ({
        ...(prev as FormErrors),
        website: "Website is not reachable. Please enter a correct URL (reachable website) and try again.",
      }));
      return;
    }

    // 2) Check latest stored report BEFORE analysis
    setLatestCheckLoading(true);
    setLatestCheckMessage(null);
    setLatestExists(false);
    setLatestDownloadUrl(null);
    setLatestAnalysisToken(null);
    setLatestUpdatedAt(null);

    try {
      const latest = await checkLatestReportBestEffort(normalizedUrl, formState.companyName.trim(), 9000);

      if (latest.ok && latest.exists) {
        setLatestExists(true);
        setLatestDownloadUrl(latest.downloadUrl || null);
        setLatestAnalysisToken(latest.analysisToken || null);
        setLatestUpdatedAt(latest.updatedAt || null);
        setLatestCheckMessage(latest.message || null);

        setIsSubmitting(false);
        setLatestCheckLoading(false);
        setStep("existing");
        return;
      }
    } catch {
      // ignore check failures and proceed
    } finally {
      setLatestCheckLoading(false);
    }

    // 3) Proceed analysis
    setIsSubmitting(false);
    setStep("analysis");
    void runAnalysis(normalizedUrl, { forceNewAnalysis: true });
  };

  const handleLeadChange = (field: keyof LeadFormState, value: string | boolean) => {
    const nextValue = field === "phone" && typeof value === "string" ? formatPhone(value) : value;
    setLeadForm((prev) => ({ ...prev, [field]: nextValue } as LeadFormState));
    setLeadErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // generate report using analysisToken (no re-analyze)
  const generateReport = async () => {
    setIsGeneratingReport(true);
    setReportError(null);
    setReportDownloadUrl("");

    try {
      const websiteForReport = analysisData?.reportMetadata?.website || lastAnalyzedWebsite || normalizeWebsiteUrl(formState.website);
      const companyForReport = analysisData?.reportMetadata?.companyName || formState.companyName.trim();

      const body: any = {
        analysisToken,
        website: websiteForReport,
        companyName: companyForReport,
        industry: formState.industry.trim(),
      };

      const res = await fetch("/api/ai-business-growth/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success || !data?.downloadUrl) throw new Error(data?.message || "Failed to generate report");

      setReportDownloadUrl(String(data.downloadUrl));
    } catch (e) {
      console.error("Report generation failed", e);
      setReportError("Report generation failed. You can retry, or book a call and we’ll send it manually.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const sendReportEmail = async () => {
    setReportEmailStatus(null);

    if (!analysisToken) {
      setReportEmailStatus("Please generate the PDF first (or run a new analysis).");
      return;
    }
    if (!leadForm.email) {
      setReportEmailStatus("Please enter your email in the lead form to send the report.");
      return;
    }

    setIsSendingReportEmail(true);
    try {
      const res = await fetch("/api/ai-business-growth/report/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisToken,
          email: leadForm.email,
          name: undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to send email");
      setReportEmailStatus("Report email sent successfully.");
    } catch (e) {
      console.error("Send report email failed", e);
      setReportEmailStatus("Email sending failed. Please retry or book a call and we’ll send it manually.");
    } finally {
      setIsSendingReportEmail(false);
    }
  };

  const handleLeadSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    const nextLeadErrors: LeadFormErrors = {
      email: validateEmail(leadForm.email),
      phone: validatePhone(leadForm.phone),
      consent: leadForm.consent ? undefined : "Please agree to our privacy policy to continue",
    };

    const hasLeadErrors = Object.values(nextLeadErrors).some(Boolean);
    setLeadErrors(nextLeadErrors);
    if (hasLeadErrors) {
      if (nextLeadErrors.email) emailRef.current?.focus();
      return;
    }

    setIsLeadSubmitting(true);
    setLeadSubmitError(null);

    try {
      setLeadId("lead-" + Math.random().toString(36).slice(2, 8));
      setStep("success");

      if (!analysisData && !analysisToken) {
        setReportError("We couldn't generate your report because analysis data was missing. Please go back and run analysis again.");
      } else {
        void generateReport();
      }
    } catch (error) {
      console.error("Failed to submit lead", error);
      setLeadSubmitError("We couldn't sync with the AI engine right now. Our team will follow up manually.");
      setStep("success");
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  // ✅ Existing page action: Download or Generate from stored analysis (no lead required)
  const handleDownloadOrGenerateExisting = async () => {
    setExistingPdfError(null);
    setReportError(null);

    if (latestDownloadUrl) {
      setReportDownloadUrl(latestDownloadUrl);
      setLeadId("lead-" + Math.random().toString(36).slice(2, 8));
      setStep("success");
      window.open(latestDownloadUrl, "_blank");
      return;
    }

    if (latestAnalysisToken) {
      await generatePdfFromStoredToken(latestAnalysisToken, true);
      return;
    }

    setExistingPdfError("We found a previous record but no usable report token exists. Please run a new analysis.");
  };

  // ✅ Existing page action: user chooses "Run new analysis"
  const handleRunNewAnalysis = () => {
    setLatestExists(false);
    setLatestDownloadUrl(null);
    setLatestAnalysisToken(null);
    setLatestUpdatedAt(null);
    setLatestCheckMessage(null);

    setStep("analysis");
    void runAnalysis(normalizeWebsiteUrl(formState.website), { forceNewAnalysis: true });
  };

  const canDownload = Boolean(reportDownloadUrl);
  const stepIndex = stepOrder.indexOf(step);
  const previousStep = stepIndex > 0 ? stepOrder[stepIndex - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30 text-gray-900">
      <main className="pt-16 pb-16">
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/onboarding-wizard">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Find Service
                </Link>
              </Button>
            </div>

            <section className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-brand-purple to-brand-coral">
              <div className="px-6 py-8 sm:px-10 sm:py-10">
                <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
                  <div className="max-w-3xl">
                    <p className="text-sm uppercase tracking-widest text-white/90 font-semibold">BrandingBeez AI Agent</p>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 text-white">
                      AI Business Growth Analyzer
                    </h1>

                    <p className="text-base sm:text-lg text-white/90 mt-3 max-w-2xl">
                      Get a growth diagnosis for your agency. Quick insights now, full playbook gated for qualified leads.
                    </p>

                    {analysisSource === "service-wizard" && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-4 py-2 text-sm font-semibold mt-4 border border-white/20">
                        <Sparkles className="w-4 h-4" />
                        <span>Came from Find Service wizard</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-white/15 border border-white/20 rounded-full px-5 py-3 backdrop-blur-sm">
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white">100% Free. No credit card.</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
              <Card className="border border-gray-200/80 shadow-sm bg-white rounded-2xl overflow-hidden">
                <CardHeader className="space-y-4 pb-5 border-b border-gray-100 bg-gradient-to-r from-white via-slate-50 to-rose-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Start your analysis</CardTitle>
                        <CardDescription>Low-friction entry, guided progress, and instant value delivery.</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">6-step guided flow</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-700 bg-white/80 border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                    {["Initial Data", "Existing Report", "Analysis", "Summary", "Lead Capture", "Success"].map((label, index) => {
                      const currentIndex = stepOrder.indexOf(step);
                      const positionState = index < currentIndex ? "complete" : index === currentIndex ? "active" : "upcoming";
                      return (
                        <div key={label} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold",
                              positionState === "complete" && "border-emerald-500 bg-emerald-50 text-emerald-600",
                              positionState === "active" && "border-primary bg-primary/10 text-primary",
                              positionState === "upcoming" && "border-gray-200 text-gray-400",
                            )}
                          >
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{label}</span>
                          {index < 4 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                        </div>
                      );
                    })}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {previousStep && (
                    <div>
                      <Button type="button" variant="ghost" onClick={() => setStep(previousStep)} className="px-2">
                        ← Back
                      </Button>
                    </div>
                  )}

                  {/* CAPTURE */}
                  {step === "capture" && (
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Company Name</label>
                        <Input
                          ref={companyNameRef}
                          placeholder="BrandingBeez"
                          value={formState.companyName}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          onFocus={() => setErrors((prev) => ({ ...(prev as FormErrors), companyName: undefined }))}
                          aria-invalid={Boolean(errors.companyName)}
                          aria-describedby="companyNameError"
                        />
                        {errors.companyName && (
                          <p id="companyNameError" className="text-sm text-red-500">
                            {errors.companyName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Company Website URL</label>
                        <Input
                          placeholder="https://youragency.com"
                          value={formState.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          onFocus={() => setErrors((prev) => ({ ...(prev as FormErrors), website: undefined }))}
                          aria-invalid={Boolean(errors.website)}
                          aria-describedby="websiteError"
                        />
                        <p className="text-xs text-gray-500">We’ll analyze this and auto-fix prefixes.</p>
                        {errors.website && (
                          <p id="websiteError" className="text-sm text-red-500">
                            {errors.website}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Location</label>
                        <Input
                          placeholder="e.g., London, UK"
                          value={formState.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          onFocus={() => setErrors((prev) => ({ ...(prev as FormErrors), location: undefined }))}
                          aria-invalid={Boolean(errors.location)}
                          aria-describedby="locationError"
                        />
                        {errors.location && (
                          <p id="locationError" className="text-sm text-red-500">
                            {errors.location}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Primary Services Industry</label>
                        <Input
                          placeholder="e.g., SEO / Web Design / Google Ads"
                          value={formState.industry}
                          onChange={(e) => handleInputChange("industry", e.target.value)}
                          onFocus={() => setErrors((prev) => ({ ...(prev as FormErrors), industry: undefined }))}
                          aria-invalid={Boolean(errors.industry)}
                          aria-describedby="industryError"
                        />
                        {errors.industry && (
                          <p id="industryError" className="text-sm text-red-500">
                            {errors.industry}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-800">Target Market</label>
                        <Input
                          placeholder="e.g., Local businesses in the UK / US e-commerce brands"
                          value={formState.targetMarket}
                          onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                          onFocus={() => setErrors((prev) => ({ ...(prev as FormErrors), targetMarket: undefined }))}
                          aria-invalid={Boolean(errors.targetMarket)}
                          aria-describedby="targetMarketError"
                        />
                        {errors.targetMarket && (
                          <p id="targetMarketError" className="text-sm text-red-500">
                            {errors.targetMarket}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-3">
                        <Button type="submit" disabled={isSubmitting || latestCheckLoading} className="h-12 text-base font-semibold">
                          {isSubmitting || latestCheckLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" /> Validating...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Start Free Analysis <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </Button>

                        {latestCheckMessage && (
                          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            <span>{latestCheckMessage}</span>
                          </div>
                        )}
                      </div>
                    </form>
                  )}

                  {/* EXISTING REPORT */}
                  {step === "existing" && (
                    <div className="p-5 rounded-xl border bg-white space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">We found your latest saved report</p>
                          <p className="text-sm text-gray-600 mt-1">
                            A previous analysis already exists for <b>{normalizeWebsiteUrl(formState.website)}</b>.
                            Choose what you want to do next:
                          </p>
                          {latestUpdatedAt && (
                            <p className="text-xs text-gray-500 mt-2">Last updated: {new Date(latestUpdatedAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>

                      {existingPdfError && (
                        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">{existingPdfError}</div>
                      )}

                      <div className="flex flex-col md:flex-row gap-3">
                        <Button
                          type="button"
                          className="h-11"
                          onClick={() => void handleDownloadOrGenerateExisting()}
                          disabled={isGeneratingExistingPdf || (!latestDownloadUrl && !latestAnalysisToken)}
                        >
                          {isGeneratingExistingPdf ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {latestDownloadUrl ? "Opening..." : "Generating PDF..."}
                            </span>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              {latestDownloadUrl ? "Download latest PDF" : "Generate PDF from saved analysis"}
                            </>
                          )}
                        </Button>

                        <Button type="button" variant="outline" className="h-11" onClick={handleRunNewAnalysis}>
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Start new analysis
                        </Button>

                        <Button type="button" variant="secondary" className="h-11" onClick={() => setStep("capture")}>
                          Back
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ANALYSIS */}
                  {step === "analysis" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="bg-gradient-to-r from-primary/10 to-emerald-50 rounded-xl p-4 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-700">Analysis Progress</p>
                            <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
                          </div>

                          <div className="w-full bg-gray-100 rounded-full h-3 mt-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-primary to-emerald-500 transition-all duration-700"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>

                          <p className="mt-3 text-sm text-gray-700">
                            <span className="font-semibold">{statusMessage}</span>
                          </p>

                          <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                            <Globe2 className="w-4 h-4" />
                            <span>{normalizeWebsiteUrl(formState.website)}</span>
                          </div>

                          {progress >= 100 && isAnalyzingBackend && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Finalizing speed test + compiling results…</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {analysisStages.slice(0, -1).map((stage, idx) => (
                            <StageItem key={stage.label} label={stage.label} state={stageStates[idx] ?? "pending"} message={stage.message} />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white border shadow-sm">
                          <p className="text-sm font-semibold text-gray-800">Live findings</p>
                          <p className="mt-2 text-sm text-gray-600">{teaserMessages[teaserIndex]}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <Target className="w-4 h-4" />
                            <span>Updating every few seconds</span>
                          </div>
                        </div>

                        <ReportCard title="Full SEO Deep Dive" description="Technical fixes + ranking roadmap" />
                        <ReportCard title="Lead Gen Playbook" description="Funnels, CRO fixes, and channel expansion" />
                        <ReportCard title="Cost Savings Plan" description="Margin unlocks & delivery efficiency" />
                      </div>
                    </div>
                  )}

                  {/* SUMMARY */}
                  {step === "summary" && (
                    <div className="space-y-5">
                      {!analysisData ? (
                        <div className="p-5 rounded-xl border bg-white">
                          <p className="font-semibold text-gray-900">Something went wrong</p>
                          <p className="text-sm text-gray-600 mt-1">{analysisError ?? "We couldn't load your analysis result."}</p>
                          <div className="mt-4 flex gap-2">
                            <Button
                              type="button"
                              onClick={() => {
                                setStep("analysis");
                                void runAnalysis(lastAnalyzedWebsite || normalizeWebsiteUrl(formState.website));
                              }}
                            >
                              Retry analysis
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setStep("capture")}>
                              Back
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                            <div>
                              <p className="text-sm text-gray-500">Analysis date: {analysisDate}</p>
                              <h2 className="text-2xl font-bold mt-1">Your Growth Snapshot</h2>
                              <p className="text-gray-600 mt-2 max-w-2xl">
                                We analyzed your website and generated an executive summary. The full report is available after a quick lead capture.
                              </p>
                            </div>
                            <ScoreGauge score={score} />
                          </div>

                          {(pageSpeedMobile || pageSpeedDesktop) && (
                            <div className="p-4 rounded-xl border bg-white">
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                  <Gauge className="w-4 h-4 text-primary" />
                                  Speed Test Snapshot
                                </p>
                                <Badge className="bg-primary/10 text-primary border-primary/20">Real Test (PageSpeed)</Badge>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {pageSpeedMobile && (
                                  <div className="p-3 rounded-lg border bg-gray-50">
                                    <p className="text-sm font-semibold text-gray-900">Mobile</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Performance: <b>{pageSpeedMobile.performanceScore ?? "—"}</b>/100
                                    </p>
                                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                                      <div>FCP: {formatMs(getMetric(pageSpeedMobile, "fcpMs"))} · LCP: {formatMs(getMetric(pageSpeedMobile, "lcpMs"))}</div>
                                      <div>TBT: {formatMs(getMetric(pageSpeedMobile, "tbtMs"))} · CLS: {getMetric(pageSpeedMobile, "cls") ?? "—"}</div>
                                    </div>
                                  </div>
                                )}

                                {pageSpeedDesktop && (
                                  <div className="p-3 rounded-lg border bg-gray-50">
                                    <p className="text-sm font-semibold text-gray-900">Desktop</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Performance: <b>{pageSpeedDesktop.performanceScore ?? "—"}</b>/100
                                    </p>
                                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                                      <div>FCP: {formatMs(getMetric(pageSpeedDesktop, "fcpMs"))} · LCP: {formatMs(getMetric(pageSpeedDesktop, "lcpMs"))}</div>
                                      <div>TBT: {formatMs(getMetric(pageSpeedDesktop, "tbtMs"))} · CLS: {getMetric(pageSpeedDesktop, "cls") ?? "—"}</div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-gray-500 mt-3">Full opportunities & fixes are included in the PDF report.</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border bg-white">
                              <p className="font-semibold text-gray-900">Strengths</p>
                              <ul className="mt-2 space-y-2 text-sm text-gray-700 list-disc pl-5">
                                {summaryStrengths.slice(0, 5).map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-4 rounded-xl border bg-white">
                              <p className="font-semibold text-gray-900">Risks / Weaknesses</p>
                              <ul className="mt-2 space-y-2 text-sm text-gray-700 list-disc pl-5">
                                {summaryWeaknesses.slice(0, 5).map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border bg-white">
                            <p className="font-semibold text-gray-900">Biggest opportunity</p>
                            <p className="mt-2 text-sm text-gray-700">{biggestOpportunity || "Opportunity insights are being finalized."}</p>
                          </div>

                          <div className="p-4 rounded-xl border bg-white">
                            <p className="font-semibold text-gray-900">Sub-score breakdown</p>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {reportPreview.map((item) => (
                                <div key={item.title} className="p-3 rounded-lg border bg-gray-50">
                                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-3">
                            <Button type="button" className="h-12 text-base font-semibold" onClick={() => setStep("lead")}>
                              Unlock Full Report <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <BookCallButtonWithModal />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* LEAD */}
                  {step === "lead" && (
                    <form className="space-y-4" onSubmit={handleLeadSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-800">Email</label>
                          <Input
                            ref={emailRef}
                            placeholder="you@company.com"
                            value={leadForm.email}
                            onChange={(e) => handleLeadChange("email", e.target.value)}
                            aria-invalid={Boolean(leadErrors.email)}
                          />
                          {leadErrors.email && <p className="text-sm text-red-500">{leadErrors.email}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-800">Phone</label>
                          <Input
                            placeholder="(987) 654-3210"
                            value={leadForm.phone}
                            onChange={(e) => handleLeadChange("phone", e.target.value)}
                            aria-invalid={Boolean(leadErrors.phone)}
                          />
                          {leadErrors.phone && <p className="text-sm text-red-500">{leadErrors.phone}</p>}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox checked={leadForm.consent} onCheckedChange={(v) => handleLeadChange("consent", Boolean(v))} />
                        <div>
                          <p className="text-sm text-gray-700">I agree to be contacted about my report and accept the privacy policy.</p>
                          {leadErrors.consent && <p className="text-sm text-red-500 mt-1">{leadErrors.consent}</p>}
                        </div>
                      </div>

                      {leadSubmitError && <p className="text-sm text-amber-700">{leadSubmitError}</p>}

                      <Button type="submit" disabled={isLeadSubmitting} className="h-12 text-base font-semibold w-full md:w-auto">
                        {isLeadSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                          </span>
                        ) : (
                          "Unlock & Continue"
                        )}
                      </Button>
                    </form>
                  )}

                  {/* SUCCESS */}
                  {step === "success" && (
                    <div className="p-6 rounded-xl border bg-white space-y-3">
                      <p className="text-sm text-gray-500">Lead ID: {leadId}</p>

                      <h3 className="text-2xl font-bold text-gray-900">Your report is ready.</h3>

                      <p className="text-gray-600">
                        {leadForm.email ? (
                          <>
                            You can download the PDF now. If needed, you can also send it to <b>{leadForm.email}</b>.
                          </>
                        ) : (
                          <>You can download the PDF now. If you want it by email, enter your email in the lead step.</>
                        )}
                      </p>

                      {isGeneratingReport && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating PDF…</span>
                        </div>
                      )}

                      {reportError && (
                        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">{reportError}</div>
                      )}

                      {reportEmailStatus && (
                        <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 text-sm">{reportEmailStatus}</div>
                      )}

                      <div className="flex flex-col md:flex-row gap-3 pt-2">
                        <Button
                          type="button"
                          disabled={!canDownload}
                          onClick={() => {
                            if (!reportDownloadUrl) return;
                            window.location.href = reportDownloadUrl;
                          }}
                          className="h-11"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSendingReportEmail || !analysisToken || !leadForm.email}
                          onClick={() => void sendReportEmail()}
                          className="h-11"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send to Email
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          disabled={isGeneratingReport || (!analysisToken && !analysisData)}
                          onClick={() => void generateReport()}
                          className="h-11"
                        >
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Re-generate PDF
                        </Button>

                        <BookCallButtonWithModal />

                        <Button type="button" variant="secondary" onClick={() => setStep("capture")} className="h-11">
                          Run another analysis
                        </Button>
                      </div>

                      {!canDownload && !isGeneratingReport && !reportError && (
                        <p className="text-xs text-gray-500">If the download is still disabled, the report endpoint might not be deployed yet.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="bg-white/90 border border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">What you get</CardTitle>
                    <CardDescription>Immediate value + full playbook after qualification</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>Executive summary & quick wins</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>Sub-score breakdown (SEO, reputation, lead gen)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>Optional call to review the report</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 border border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Website validation</CardTitle>
                    <CardDescription>Analysis runs only for reachable websites</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>We verify the website from the server before running the AI analysis.</p>
                    <p className="text-gray-500">If the site is unreachable, we stop and ask you to enter a correct URL.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <AgencyContactSection
              heading="Ready to turn these insights into growth?"
              subheading="Share your goals and we’ll map the next steps to scale your agency."
              inquiryType="ai-business-growth-analyzer"
              contactFormType="ai-business-growth-analyzer"
              submissionSourceLabel="AI Business Growth Analyzer Contact Form Submission"
              thankYouTitle="Thanks for reaching out!"
              thankYouMessage="We’ve received your request and will follow up soon with next steps tailored to your analysis."
              thankYouFormType="ai-growth-analyzer"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
