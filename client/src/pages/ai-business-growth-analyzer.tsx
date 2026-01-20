// client/src/pages/ai-business-growth-analyzer.tsx
import { useEffect, useMemo, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock4,
  Globe2,
  Loader2,
  Lock,
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
import { Textarea } from "@/components/ui/textarea";
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
  industry?: string;
  targetMarket?: string;
  businessGoal?: string;
  reportType?: "quick" | "full";
  location?: string;
  primaryService?: string;
  competitorWebsites?: string; // comma separated
  targetKeywords?: string; // comma separated
  contentMaxPages?: string; // numeric string for deep crawl pages
  placesMaxResults?: string; // numeric string
  placesMaxReviews?: string; // numeric string
  competitorMaxCompetitors?: string; // numeric string
  competitorMaxPages?: string; // numeric string
  dataforseoLocationCode?: string; // numeric string
  dataforseoLanguageCode?: string; // e.g. en

  // --- Estimation Mode (optional) ---
  estimationMode?: boolean;
  monthlyAdSpendRange?: string;
  toolsStackEstimate?: string;
  teamSizeRange?: string;
  idealCustomer?: string;
  primaryRegion?: string;
  avgDealValueRange?: string;
  leadsPerMonthRange?: string;
  closeRateRange?: string;
  currentTrafficPerMonthRange?: string;
}

interface FormErrors {
  companyName?: string;
  website?: string;
  industry?: string;
  targetMarket?: string;
  businessGoal?: string;
  reportType?: "quick" | "full";
  location?: string;
  primaryService?: string;
  competitorWebsites?: string;
  targetKeywords?: string;
  contentMaxPages?: string;
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

/**
 * ✅ NEW step:
 * existing = user has a previous report stored, ask download/generate or run new analysis
 */
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
  { label: "Website Crawl", duration: 15, progress: 15, message: "Scanning website structure..." },
  { label: "SEO Analysis", duration: 10, progress: 35, message: "Analyzing SEO performance..." },
  { label: "Reputation Check", duration: 8, progress: 55, message: "Checking online reputation..." },
  { label: "Lead Gen Audit", duration: 12, progress: 70, message: "Auditing lead generation funnels..." },
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

const domainSuggestions: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "hotnail.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "yaho.com": "yahoo.com",
};

function normalizeWebsiteUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const withProtocol = hasProtocol ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/$/, "");
}

function validateEmail(email: string) {
  if (!email.trim()) return "Please enter your email address";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain && disposableEmailDomains.includes(domain)) return "Please use a business or personal email";
  return undefined;
}

function validateCompanyName(name: string): string | undefined {
  if (!name.trim()) return "Please enter your company name";
  if (name.trim().length < 2) return "Company name must be at least 2 characters";
  if (!/^[a-zA-Z0-9\s&.'-]+$/.test(name.trim())) return "Please use a valid company name";
  return undefined;
}

function getEmailSuggestion(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain && domainSuggestions[domain]) {
    return `${email.split("@")[0]}@${domainSuggestions[domain]}`;
  }
  return "";
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
  if (!/^\+?[0-9\s().-]{10,}$/.test(phone)) return "Please enter a valid phone number";
  return undefined;
}

function validateWebsite(url: string): string | undefined {
  if (!url.trim()) return "Please enter your website URL";
  const normalized = normalizeWebsiteUrl(url);
  const isValidFormat = /^https?:\/\/[^\s]+\.[^\s]+$/i.test(normalized);
  if (!isValidFormat) return "Please enter a valid URL (e.g., example.com)";
  return undefined;
}

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
      body: JSON.stringify({ website }),
      signal: controller.signal,
    });

    if (!res.ok) return { ok: false };

    const data = await res.json();
    return { ok: true, reachable: Boolean(data?.reachable) };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError";
    if (aborted) return { ok: true, timedOut: true };
    return { ok: false };
  } finally {
    window.clearTimeout(t);
  }
}

/**
 * ✅ check if we already have latest AI report data in DB (previous run)
 */
async function checkLatestReportBestEffort(
  website: string,
  companyName: string,
  timeoutMs = 9000,
): Promise<{
  ok: boolean;
  exists?: boolean;
  downloadUrl?: string;
  analysisToken?: string;
  updatedAt?: string;
  message?: string;
}> {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("/api/ai-business-growth/latest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website, companyName }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, message: data?.message || "Latest report check failed" };
    }

    return {
      ok: true,
      exists: Boolean(data?.exists),
      downloadUrl: data?.downloadUrl ? String(data.downloadUrl) : undefined,
      analysisToken: data?.analysisToken ? String(data.analysisToken) : undefined,
      updatedAt: data?.updatedAt ? String(data.updatedAt) : undefined,
      message: data?.message ? String(data.message) : undefined,
    };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError";
    if (aborted) return { ok: false, message: "Latest report check timed out" };
    return { ok: false, message: "Latest report check failed" };
  } finally {
    window.clearTimeout(t);
  }
}

function ScoreGauge({ score }: { score: number | null | undefined }) {
  const numeric = typeof score === "number" && Number.isFinite(score) ? score : null;
  const clampedScore = numeric === null ? null : Math.max(0, Math.min(100, Math.round(numeric)));
  const color =
    clampedScore === null
      ? "#94a3b8"
      : clampedScore <= 40
        ? "#ef4444"
        : clampedScore <= 65
          ? "#f59e0b"
          : clampedScore <= 85
            ? "#2563eb"
            : "#10b981";
  const gradient =
    clampedScore === null
      ? `conic-gradient(${color} 0deg, #e5e7eb 0deg)`
      : `conic-gradient(${color} ${clampedScore * 3.6}deg, #e5e7eb 0deg)`;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full" style={{ background: gradient }} />
      <div className="absolute inset-2 bg-white rounded-full shadow-inner flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900">{clampedScore === null ? "N/A" : clampedScore}</span>
        <span className="text-sm text-gray-500">{clampedScore === null ? "" : "/100"}</span>
      </div>
    </div>
  );
}

function StageItem({ label, state, message }: { label: string; state: StageState; message: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-white/60">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-2",
          state === "complete" && "border-emerald-500 bg-emerald-50 text-emerald-600",
          state === "active" && "border-primary bg-primary/10 text-primary",
          state === "pending" && "border-dashed border-gray-200 text-gray-400",
        )}
      >
        {state === "complete" ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : state === "active" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Clock4 className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          {label}
          {state === "active" && <Badge className="bg-primary/10 text-primary">In progress</Badge>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
    </div>
  );
}

function ReportCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative p-4 border rounded-xl bg-white shadow-sm hover:-translate-y-1 transition-transform">
      <div className="absolute inset-0 rounded-xl border-2 border-dashed border-gray-200" />
      <div className="relative flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0">
              Locked
            </Badge>
          </p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function formatMs(ms?: number) {
  if (ms === undefined || ms === null) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

function getMetric(obj: PageSpeedDeviceResult | undefined, key: keyof NonNullable<PageSpeedDeviceResult["metrics"]>) {
  const flat = (obj as any)?.[key];
  if (flat !== undefined && flat !== null) return flat as number;
  const nested = obj?.metrics?.[key];
  if (nested !== undefined && nested !== null) return nested as number;
  return undefined;
}

export default function AIBusinessGrowthAnalyzerPage() {
  const [step, setStep] = useState<Step>("capture");
  const [formState, setFormState] = useState<FormState>({
    companyName: "",
    website: "",
    industry: "",
    targetMarket: "",
    businessGoal: "",
    reportType: "full",
    location: "",
    primaryService: "",
    competitorWebsites: "",
    targetKeywords: "",
    contentMaxPages: "8",
    placesMaxResults: "5",
    placesMaxReviews: "5",
    competitorMaxCompetitors: "6",
    competitorMaxPages: "6",
    dataforseoLocationCode: "",
    dataforseoLanguageCode: "en",

    // Estimation Mode
    estimationMode: false,
    monthlyAdSpendRange: "",
    toolsStackEstimate: "",
    teamSizeRange: "",
    idealCustomer: "",
    primaryRegion: "",
    avgDealValueRange: "",
    leadsPerMonthRange: "",
    closeRateRange: "",
    currentTrafficPerMonthRange: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [leadForm, setLeadForm] = useState<LeadFormState>({
    email: "",
    phone: "",
    consent: false,
  });
  const [leadErrors, setLeadErrors] = useState<LeadFormErrors>({});
  const [leadSubmitError, setLeadSubmitError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageStates, setStageStates] = useState<StageState[]>(
    analysisStages.map((_, idx) => (idx === 0 ? "active" : "pending")),
  );
  const [statusMessage, setStatusMessage] = useState(analysisStages[0].message);
  const [teaserIndex, setTeaserIndex] = useState(0);

  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [leadId, setLeadId] = useState("");

  const [analysisData, setAnalysisData] = useState<BusinessGrowthReport | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzingBackend, setIsAnalyzingBackend] = useState(false);
  const [analysisToken, setAnalysisToken] = useState<string | null>(null);

  const [lastAnalyzedWebsite, setLastAnalyzedWebsite] = useState<string>("");

  const [analysisSource, setAnalysisSource] = useState<string | null>(null);

  const [reportDownloadUrl, setReportDownloadUrl] = useState<string>("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const [isSendingReportEmail, setIsSendingReportEmail] = useState(false);
  const [reportEmailStatus, setReportEmailStatus] = useState<string | null>(null);

  // ✅ latest report check state
  const [latestCheckLoading, setLatestCheckLoading] = useState(false);
  const [latestExists, setLatestExists] = useState(false);
  const [latestDownloadUrl, setLatestDownloadUrl] = useState<string | null>(null);
  const [latestAnalysisToken, setLatestAnalysisToken] = useState<string | null>(null);
  const [latestUpdatedAt, setLatestUpdatedAt] = useState<string | null>(null);
  const [latestCheckMessage, setLatestCheckMessage] = useState<string | null>(null);

  // ✅ NEW: generating PDF from existing stored analysis (on existing step)
  const [isGeneratingExistingPdf, setIsGeneratingExistingPdf] = useState(false);
  const [existingPdfError, setExistingPdfError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const companyNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const websiteParam = params.get("website");
    const sourceParam = params.get("source");

    if (websiteParam) {
      setFormState((prev) => ({
        ...prev,
        website: normalizeWebsiteUrl(websiteParam),
      }));
    }
    if (sourceParam) setAnalysisSource(sourceParam);
  }, []);

  useEffect(() => {
    companyNameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (step === "lead") emailRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (step !== "analysis") return;

    setProgress(analysisStages[0].progress);
    setCurrentStage(0);
    setStatusMessage(analysisStages[0].message);
    setStageStates(analysisStages.map((_, idx) => (idx === 0 ? "active" : "pending")));

    const timers: number[] = [];
    let accumulated = 0;

    analysisStages.forEach((stage, index) => {
      const delay = accumulated * 1000;
      timers.push(
        window.setTimeout(() => {
          setCurrentStage(index);
          setStatusMessage(stage.message);
          setProgress(stage.progress);
          setStageStates((prev) =>
            prev.map((state, idx) => {
              if (idx < index) return "complete";
              if (idx === index) return "active";
              return state === "complete" ? "complete" : "pending";
            }),
          );
        }, delay),
      );
      accumulated += stage.duration;
    });

    timers.push(
      window.setTimeout(() => {
        setStageStates(Array(analysisStages.length).fill("complete"));
        setStatusMessage("Analysis complete!");
        setProgress(100);
      }, accumulated * 1000),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [step]);

  useEffect(() => {
    if (step !== "analysis") return;
    const interval = window.setInterval(() => setTeaserIndex((prev) => (prev + 1) % teaserMessages.length), 9000);
    return () => window.clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== "analysis") return;
    if (progress < 100) return;
    if (isAnalyzingBackend) return;
    setStep("summary");
  }, [step, progress, isAnalyzingBackend]);

  const progressPercentage = useMemo(
    () => Math.min(100, Math.max(progress, (currentStage / (analysisStages.length - 1)) * 100)),
    [progress, currentStage],
  );

  const report = analysisData;
  const summaryStrengths = report?.executiveSummary.strengths ?? [];
  const summaryWeaknesses = report?.executiveSummary.weaknesses ?? [];
  const biggestOpportunity = report?.executiveSummary.biggestOpportunity ?? "";
  const analysisDate = report?.reportMetadata.analysisDate ? new Date(report.reportMetadata.analysisDate).toLocaleDateString() : "N/A";
  const score = report?.reportMetadata.overallScore ?? null;

  const reportPreview = useMemo(() => {
    const subScores = report?.reportMetadata.subScores;
    if (!subScores) return [];
    const items: { title: string; description: string }[] = [];
    if (typeof subScores.website === "number") items.push({ title: "Website & UX", description: `Website score: ${subScores.website}/100` });
    if (typeof subScores.seo === "number") items.push({ title: "SEO Visibility", description: `SEO score: ${subScores.seo}/100` });
    if (typeof subScores.reputation === "number") items.push({ title: "Reputation", description: `Reputation score: ${subScores.reputation}/100` });
    if (typeof subScores.leadGen === "number") items.push({ title: "Lead Generation", description: `Lead gen score: ${subScores.leadGen}/100` });
    if (typeof subScores.services === "number") items.push({ title: "Services & Positioning", description: `Services score: ${subScores.services}/100` });
    if (typeof subScores.costEfficiency === "number") items.push({ title: "Cost Efficiency", description: `Efficiency score: ${subScores.costEfficiency}/100` });
    return items;
  }, [report]);

  const pageSpeedMobile = report?.websiteDigitalPresence?.technicalSEO?.pageSpeed?.mobile;
  const pageSpeedDesktop = report?.websiteDigitalPresence?.technicalSEO?.pageSpeed?.desktop;

  // const handleInputChange = (field: keyof FormState, value: string) => {
  //   setFormState((prev) => ({ ...prev, [field]: value }));
  //   setErrors((prev) => ({ ...prev, [field]: undefined }));
  // };
  const handleInputChange = (field: keyof FormState, value: FormState[keyof FormState]) => {
  setFormState((prev) => ({ ...prev, [field]: value }));

  // FormErrors does not track every FormState field (eg, estimation inputs), so cast safely.
  setErrors((prev) => ({ ...prev, [field as keyof FormErrors]: undefined }));
};

const runAnalysis = async (websiteUrl: string, opts?: { forceNewAnalysis?: boolean }) => {
    setIsAnalyzingBackend(true);
    setAnalysisError(null);
    setAnalysisData(null);
    setAnalysisToken(null);

    const normalizedWebsite = normalizeWebsiteUrl(websiteUrl);
    setLastAnalyzedWebsite(normalizedWebsite);

    try {
      const response = await fetch("/api/ai-business-growth/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forceNewAnalysis: Boolean(opts?.forceNewAnalysis),
          companyName: formState.companyName.trim(),
          website: normalizedWebsite,
          industry: formState.industry?.trim() || undefined,
          targetMarket: formState.targetMarket?.trim() || undefined,
          businessGoal: formState.businessGoal?.trim() || undefined,
          reportType: formState.reportType || "full",
          estimationMode: Boolean(formState.estimationMode),
          estimationInputs: Boolean(formState.estimationMode)
            ? {
                monthlyAdSpendRange: formState.monthlyAdSpendRange?.trim() || undefined,
                toolsStackEstimate: formState.toolsStackEstimate?.trim() || undefined,
                teamSizeRange: formState.teamSizeRange?.trim() || undefined,
                idealCustomer: formState.idealCustomer?.trim() || undefined,
                primaryRegion: formState.primaryRegion?.trim() || undefined,
                avgDealValueRange: formState.avgDealValueRange?.trim() || undefined,
                leadsPerMonthRange: formState.leadsPerMonthRange?.trim() || undefined,
                closeRateRange: formState.closeRateRange?.trim() || undefined,
                currentTrafficPerMonthRange: formState.currentTrafficPerMonthRange?.trim() || undefined,
              }
            : undefined,
          criteria: {
            location: formState.location?.trim() || undefined,
            primaryService: formState.primaryService?.trim() || undefined,
            competitors: (formState.competitorWebsites || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            keywords: (formState.targetKeywords || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            // UI field is contentMaxPages; backend prefers siteMaxPages.
            // Send both for compatibility.
            contentMaxPages: Number(formState.contentMaxPages || 8) || 8,
            siteMaxPages: Number(formState.contentMaxPages || 8) || 8,
            placesMaxResults: Number(formState.placesMaxResults || 5) || 5,
            placesMaxReviews: Number(formState.placesMaxReviews || 5) || 5,
            competitorMaxPages: Number(formState.competitorMaxPages || 6) || 6,
            competitorMaxCompetitors: Number(formState.competitorMaxCompetitors || 6) || 6,
            dataforseoLocationCode: formState.dataforseoLocationCode?.trim() || undefined,
            dataforseoLanguageCode: formState.dataforseoLanguageCode?.trim() || undefined,
          },
        }),
      });

      const payload = await response.json();

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
    } catch (error) {
      console.error("Business growth analysis failed", error);
      setAnalysisError((prev) => prev || "We couldn't generate the live analysis. Please try again.");
      setAnalysisData(null);
    } finally {
      setIsAnalyzingBackend(false);
    }
  };

  function validateLocation(location: string): string | undefined {
    if (!location?.trim()) return "Please enter your location (city / region)";
    if (location.trim().length < 2) return "Location must be at least 2 characters";
    return undefined;
  }

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
          industry: formState.industry?.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success || !data?.downloadUrl) {
        throw new Error(data?.message || "Failed to generate PDF from stored analysis");
      }

      const url = String(data.downloadUrl);
      setReportDownloadUrl(url);
      setAnalysisToken(token); // keep token for later email sending

      // Move to success and optionally auto-open PDF
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
      location: validateLocation(formState.location || ""),
    };

    const hasErrors = Object.values(nextErrors).some(Boolean);
    setErrors(nextErrors);
    if (hasErrors) return;

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

        // ✅ important: stop here — do NOT start analysis
        setIsSubmitting(false);
        setLatestCheckLoading(false);
        setStep("existing");
        return;
      }
    } catch {
      // ignore check failures and proceed to analysis
    } finally {
      setLatestCheckLoading(false);
    }

    // 3) No stored report: proceed analysis
    setIsSubmitting(false);
    setStep("analysis");
    void runAnalysis(normalizedUrl);
  };

  const handleLeadChange = (field: keyof LeadFormState, value: string | boolean) => {
    const nextValue = field === "phone" && typeof value === "string" ? formatPhone(value) : value;
    setLeadForm((prev) => ({ ...prev, [field]: nextValue }) as LeadFormState);
    setLeadErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "email" && typeof value === "string") setEmailSuggestion(getEmailSuggestion(value));
  };

  // generate report using analysisToken (no re-analyze)
  const generateReport = async () => {
    setIsGeneratingReport(true);
    setReportError(null);
    setReportDownloadUrl("");

    try {
      const websiteForReport =
        analysisData?.reportMetadata?.website || lastAnalyzedWebsite || normalizeWebsiteUrl(formState.website);

      const companyForReport = analysisData?.reportMetadata?.companyName || formState.companyName.trim();

      const body: any = {
        analysisToken,
        website: websiteForReport,
        companyName: companyForReport,
        industry: formState.industry?.trim() || undefined,
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
    if (hasLeadErrors) return;

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
    // void runAnalysis(normalizeWebsiteUrl(formState.website));
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
                          aria-invalid={Boolean((errors as any).companyName)}
                          aria-describedby="companyNameError"
                        />
                        {(errors as any).companyName && (
                          <p id="companyNameError" className="text-sm text-red-500">
                            {(errors as any).companyName}
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
                          aria-invalid={Boolean((errors as any).website)}
                          aria-describedby="websiteError"
                        />
                        <p className="text-xs text-gray-500">We’ll analyze this and auto-fix prefixes.</p>
                        {(errors as any).website && (
                          <p id="websiteError" className="text-sm text-red-500">
                            {(errors as any).website}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Location (required)</label>
                        <Input
                          placeholder="e.g., London, UK"
                          value={formState.location || ""}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          onFocus={() => setErrors((prev) => ({ ...(prev as FormErrors), location: undefined }))}
                          aria-invalid={Boolean((errors as any).location)}
                          aria-describedby="locationError"
                        />
                        {(errors as any).location && (
                          <p id="locationError" className="text-sm text-red-500">
                            {(errors as any).location}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">Used to fetch Google reviews & local competitors for reputation scoring.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Primary Service (recommended)</label>
                        <Input
                          placeholder="e.g., SEO Agency / Web Development / Google Ads"
                          value={formState.primaryService || ""}
                          onChange={(e) => handleInputChange("primaryService", e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Helps detect service pages, competitors, and better action plan recommendations.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Industry (optional)</label>
                        <Input placeholder="e.g., Marketing, SaaS, E-commerce" value={formState.industry || ""} onChange={(e) => handleInputChange("industry", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Target Market (optional)</label>
                        <Input placeholder="e.g., US agencies, Local businesses" value={formState.targetMarket || ""} onChange={(e) => handleInputChange("targetMarket", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Competitor Websites (optional)</label>
                        <Input placeholder="e.g., competitor1.com, competitor2.co.uk" value={formState.competitorWebsites || ""} onChange={(e) => handleInputChange("competitorWebsites", e.target.value)} />
                        <p className="text-xs text-gray-500">If provided, Competitive Analysis will include these even without SERP APIs.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Target Keywords (optional)</label>
                        <Input placeholder="e.g., seo london, website design agency, google ads management" value={formState.targetKeywords || ""} onChange={(e) => handleInputChange("targetKeywords", e.target.value)} />
                        <p className="text-xs text-gray-500">Improves keyword/competitor context when Search Console is not connected.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Deep Crawl Pages (optional)</label>
                        <Input type="number" min={3} max={20} placeholder="8" value={formState.contentMaxPages || ""} onChange={(e) => handleInputChange("contentMaxPages", e.target.value)} />
                        <p className="text-xs text-gray-500">Higher value gives deeper services & UX insights (slightly slower).</p>
                      </div>

                       <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Business Goal (optional)</label>
                        <Textarea
                          placeholder="Tell us your primary goal (more leads, better SEO, higher conversions, etc.)"
                          value={formState.businessGoal || ""}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange("businessGoal", e.target.value)}
                          className="min-h-[96px]"
                        />
                      </div>

                      {/* Estimation Mode toggle */}
                      <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={Boolean(formState.estimationMode)}
                            onCheckedChange={(v) => handleInputChange("estimationMode", Boolean(v))}
                          />
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">Estimation Mode (optional)</p>
                            <p className="text-xs text-gray-700">
                              Enables scenario-based estimates for Sections 8–10 (Cost, Target Market, Financial Impact). No private data is required,
                              but adding a few ranges improves accuracy.
                            </p>
                          </div>
                        </div>

                        {formState.estimationMode && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Monthly ad spend (range)</label>
                              <Input
                                placeholder="e.g., 0-500, 500-2000, 2000+"
                                value={formState.monthlyAdSpendRange || ""}
                                onChange={(e) => handleInputChange("monthlyAdSpendRange", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Team size (range)</label>
                              <Input
                                placeholder="e.g., 1-2, 3-5, 6-10"
                                value={formState.teamSizeRange || ""}
                                onChange={(e) => handleInputChange("teamSizeRange", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <label className="text-xs font-semibold text-gray-800">Tools stack estimate / list (optional)</label>
                              <Input
                                placeholder="e.g., SEMrush, HubSpot, Zapier (or Low/Medium/High)"
                                value={formState.toolsStackEstimate || ""}
                                onChange={(e) => handleInputChange("toolsStackEstimate", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Ideal customer (optional)</label>
                              <Input
                                placeholder="e.g., SMEs, ecommerce brands, local services"
                                value={formState.idealCustomer || ""}
                                onChange={(e) => handleInputChange("idealCustomer", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Primary region (optional)</label>
                              <Input
                                placeholder="e.g., UK, US, India, Global"
                                value={formState.primaryRegion || ""}
                                onChange={(e) => handleInputChange("primaryRegion", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Avg deal value (range, optional)</label>
                              <Input
                                placeholder="e.g., 500-1000, 1000-3000, 3000+"
                                value={formState.avgDealValueRange || ""}
                                onChange={(e) => handleInputChange("avgDealValueRange", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Leads/month (range, optional)</label>
                              <Input
                                placeholder="e.g., 5-10, 10-30, 30+"
                                value={formState.leadsPerMonthRange || ""}
                                onChange={(e) => handleInputChange("leadsPerMonthRange", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Close rate (range, optional)</label>
                              <Input
                                placeholder="e.g., 5-10%, 10-20%"
                                value={formState.closeRateRange || ""}
                                onChange={(e) => handleInputChange("closeRateRange", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-800">Current traffic/month (range, optional)</label>
                              <Input
                                placeholder="e.g., 0-1k, 1k-5k, 5k+"
                                value={formState.currentTrafficPerMonthRange || ""}
                                onChange={(e) => handleInputChange("currentTrafficPerMonthRange", e.target.value)}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-700">
                                <span className="font-semibold">Disclaimer:</span> Estimation Mode outputs are directional models (not audited financials). For higher accuracy,
                                connect Ads/Analytics/CRM or provide exact spend + revenue ranges.
                              </p>
                            </div>
                          </div>
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

                  {/* ✅ EXISTING REPORT CHOICE */}
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
                        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
                          {existingPdfError}
                        </div>
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

                      {!latestDownloadUrl && latestAnalysisToken && (
                        <div className="text-xs text-gray-500">
                          This will generate a new PDF using the stored DB analysis (no crawling, no new analysis).
                        </div>
                      )}
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
                          {emailSuggestion && (
                            <p className="text-xs text-amber-700">
                              Did you mean <span className="font-semibold">{emailSuggestion}</span>?
                            </p>
                          )}
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
                        {leadForm.email
                          ? (
                            <>You can download the PDF now. If needed, you can also send it to <b>{leadForm.email}</b>.</>
                          )
                          : (
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
