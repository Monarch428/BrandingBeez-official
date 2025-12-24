import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { BookCallButtonWithModal } from "@/components/book-appoinment";

interface FormState {
  firstName: string;
  lastName: string;
  website: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  website?: string;
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

type Step = "capture" | "analysis" | "summary" | "lead" | "success";
type StageState = "pending" | "active" | "complete";

interface QuickWin {
  title: string;
  impact: string;
  time: string;
  cost: string;
  details: string;
}

interface BusinessGrowthReport {
  reportMetadata: {
    reportId: string;
    companyName: string;
    website: string;
    analysisDate: string;
    overallScore: number;
    subScores?: {
      website?: number;
      seo?: number;
      reputation?: number;
      leadGen?: number;
      services?: number;
      costEfficiency?: number;
    };
  };
  executiveSummary: {
    strengths: string[];
    weaknesses: string[];
    biggestOpportunity: string;
    quickWins: QuickWin[];
  };
  // NOTE: your backend returns a lot more, but we only need these for UI
}

const analysisStages = [
  { label: "Initialization", duration: 2, progress: 5, message: "Connecting to your website..." },
  { label: "Website Crawl", duration: 15, progress: 15, message: "Scanning website structure..." },
  { label: "SEO Analysis", duration: 10, progress: 35, message: "Analyzing SEO performance..." },
  { label: "Reputation Check", duration: 8, progress: 55, message: "Checking online reputation..." },
  { label: "Lead Gen Audit", duration: 12, progress: 70, message: "Auditing lead generation funnels..." },
  { label: "Cost Assessment", duration: 8, progress: 90, message: "Analyzing service delivery costs..." },
  { label: "Report Generation", duration: 5, progress: 98, message: "Generating your report..." },
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

function validateName(name: string, field: "firstName" | "lastName"): string | undefined {
  if (!name.trim()) return `Please enter your ${field === "firstName" ? "first" : "last"} name`;
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s-]+$/.test(name.trim())) return "Please use only letters";
  return undefined;
}

function validateWebsite(url: string): string | undefined {
  if (!url.trim()) return "Please enter your website URL";
  const normalized = normalizeWebsiteUrl(url);
  const isValidFormat = /^https?:\/\/[^\s]+\.[^\s]+$/i.test(normalized);
  if (!isValidFormat) return "Please enter a valid URL (e.g., example.com)";
  return undefined;
}

/**
 * Reachability check should be "best effort", NOT a hard gate.
 * - It can fail for valid sites (HEAD blocked, WAF, geo blocks, redirects, etc.)
 * - Add a timeout so UI doesn't hang for ~16s.
 */
async function checkWebsiteReachableViaBackendBestEffort(website: string, timeoutMs = 6000): Promise<{
  ok: boolean;
  reachable?: boolean;
  timedOut?: boolean;
}> {
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

function ScoreGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color =
    clampedScore <= 40 ? "#ef4444" : clampedScore <= 65 ? "#f59e0b" : clampedScore <= 85 ? "#2563eb" : "#10b981";
  const gradient = `conic-gradient(${color} ${clampedScore * 3.6}deg, #e5e7eb 0deg)`;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full" style={{ background: gradient }} />
      <div className="absolute inset-2 bg-white rounded-full shadow-inner flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900">{clampedScore}</span>
        <span className="text-sm text-gray-500">/100</span>
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

export default function AIBusinessGrowthAnalyzerPage() {
  const [step, setStep] = useState<Step>("capture");
  const [formState, setFormState] = useState<FormState>({ firstName: "", lastName: "", website: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [leadForm, setLeadForm] = useState<LeadFormState>({ email: "", phone: "", consent: false });
  const [leadErrors, setLeadErrors] = useState<LeadFormErrors>({});
  const [leadSubmitError, setLeadSubmitError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageStates, setStageStates] = useState<StageState[]>(analysisStages.map((_, idx) => (idx === 0 ? "active" : "pending")));
  const [statusMessage, setStatusMessage] = useState(analysisStages[0].message);
  const [teaserIndex, setTeaserIndex] = useState(0);

  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [leadId, setLeadId] = useState("demo-lead-123");

  const [analysisData, setAnalysisData] = useState<BusinessGrowthReport | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzingBackend, setIsAnalyzingBackend] = useState(false);

  const [lastAnalyzedWebsite, setLastAnalyzedWebsite] = useState<string>("");
  const [analysisSource, setAnalysisSource] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const firstNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const websiteParam = params.get("website");
    const sourceParam = params.get("source");

    if (websiteParam) {
      setFormState((prev) => ({ ...prev, website: normalizeWebsiteUrl(websiteParam) }));
    }
    if (sourceParam) {
      setAnalysisSource(sourceParam);
    }
  }, []);

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (step === "lead") emailRef.current?.focus();
  }, [step]);

  // analysis animation
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

  // move to summary only when animation is complete AND backend is done
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
  const summaryQuickWins = report?.executiveSummary.quickWins ?? [];
  const biggestOpportunity = report?.executiveSummary.biggestOpportunity ?? "";
  const analysisDate = report?.reportMetadata.analysisDate ? new Date(report.reportMetadata.analysisDate).toLocaleDateString() : "N/A";
  const score = report?.reportMetadata.overallScore ?? 0;

  const reportPreview = useMemo(() => {
    const subScores = report?.reportMetadata.subScores;
    if (!subScores) return [];
    const items: { title: string; description: string }[] = [];
    if (subScores.website !== undefined) items.push({ title: "Website & UX", description: `Website score: ${subScores.website}/100` });
    if (subScores.seo !== undefined) items.push({ title: "SEO Visibility", description: `SEO score: ${subScores.seo}/100` });
    if (subScores.reputation !== undefined) items.push({ title: "Reputation", description: `Reputation score: ${subScores.reputation}/100` });
    if (subScores.leadGen !== undefined) items.push({ title: "Lead Generation", description: `Lead gen score: ${subScores.leadGen}/100` });
    if (subScores.services !== undefined) items.push({ title: "Services & Positioning", description: `Services score: ${subScores.services}/100` });
    if (subScores.costEfficiency !== undefined) items.push({ title: "Cost Efficiency", description: `Efficiency score: ${subScores.costEfficiency}/100` });
    return items;
  }, [report]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const runAnalysis = async (websiteUrl: string) => {
    setIsAnalyzingBackend(true);
    setAnalysisError(null);
    setAnalysisData(null);

    const normalizedWebsite = normalizeWebsiteUrl(websiteUrl);
    setLastAnalyzedWebsite(normalizedWebsite);

    try {
      const response = await fetch("/api/ai-business-growth/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: `${formState.firstName} ${formState.lastName}`.trim() || "Marketing Agency",
          website: normalizedWebsite,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.analysis) {
        throw new Error(payload?.message || "Unable to generate analysis");
      }

      setAnalysisData(payload.analysis as BusinessGrowthReport);
    } catch (error) {
      console.error("Business growth analysis failed", error);
      setAnalysisError("We couldn't generate the live analysis. Please try again.");
      setAnalysisData(null);
    } finally {
      setIsAnalyzingBackend(false);
    }
  };

  /**
   * ✅ FIX:
   * Reachability check is now:
   * - best-effort
   * - timed out (6s)
   * - never blocks the analysis (only shows a warning)
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {
      firstName: validateName(formState.firstName, "firstName"),
      lastName: validateName(formState.lastName, "lastName"),
      website: validateWebsite(formState.website),
    };

    const hasErrors = Object.values(nextErrors).some(Boolean);
    setErrors(nextErrors);
    if (hasErrors) return;

    setIsSubmitting(true);

    const normalizedUrl = normalizeWebsiteUrl(formState.website);

    // best-effort check
    const reachability = await checkWebsiteReachableViaBackendBestEffort(normalizedUrl, 6000);

    // If backend explicitly says "reachable:false", show a warning,
    // BUT DO NOT block. Many valid sites will be flagged false.
    if (reachability.ok && reachability.reachable === false) {
      setErrors((prev) => ({
        ...prev,
        website:
          "We couldn't verify this website from the server (some sites block automated checks). We'll continue anyway.",
      }));
    } else if (reachability.ok && reachability.timedOut) {
      setErrors((prev) => ({
        ...prev,
        website: "Website verification timed out. We'll continue anyway.",
      }));
    }

    setIsSubmitting(false);
    setStep("analysis");
    void runAnalysis(normalizedUrl);
  };

  const handleLeadChange = (field: keyof LeadFormState, value: string | boolean) => {
    const nextValue = field === "phone" && typeof value === "string" ? formatPhone(value) : value;
    setLeadForm((prev) => ({ ...prev, [field]: nextValue } as LeadFormState));
    setLeadErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "email" && typeof value === "string") setEmailSuggestion(getEmailSuggestion(value));
  };

  const submitLeadToBackend = async (websiteUrl: string) => {
    const normalizedWebsite = normalizeWebsiteUrl(websiteUrl);

    const response = await fetch("/api/ai-business-growth/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: `${formState.firstName} ${formState.lastName}`.trim() || "Marketing Agency",
        website: normalizedWebsite,
        contact: {
          name: `${formState.firstName} ${formState.lastName}`.trim() || undefined,
          email: leadForm.email.trim(),
          phone: typeof leadForm.phone === "string" ? leadForm.phone.trim() : undefined,
        },
      }),
    });

    if (!response.ok) throw new Error("Unable to submit lead to AI analyzer");

    const payload = await response.json();
    if (payload?.analysis && !analysisData) {
      setAnalysisData(payload.analysis as BusinessGrowthReport);
      setLastAnalyzedWebsite(payload.analysis.reportMetadata.website || normalizedWebsite);
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

    const websiteForSubmission = lastAnalyzedWebsite || normalizeWebsiteUrl(formState.website);

    try {
      await submitLeadToBackend(websiteForSubmission);
      setLeadId("lead-" + Math.random().toString(36).slice(2, 8));
      setStep("success");
    } catch (error) {
      console.error("Failed to submit lead to backend", error);
      setLeadSubmitError("We couldn't sync with the AI engine right now. Our team will follow up manually.");
      setStep("success");
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-rose-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        <header className="flex items-start justify-between gap-4 flex-col lg:flex-row">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">BrandingBeez AI Agent</p>
            <h1 className="text-3xl lg:text-4xl font-bold mt-2">AI Business Growth Analyzer</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl">
              Get a growth diagnosis for your agency. Quick insights now, full playbook gated for qualified leads.
            </p>

            {analysisSource === "service-wizard" && (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold mt-3">
                <Sparkles className="w-4 h-4" />
                <span>Came from Find Service wizard</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white shadow-sm border rounded-full px-4 py-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold">100% Free. No credit card.</span>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <Card className="border border-gray-100 shadow-xl bg-white/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Start your analysis
              </CardTitle>
              <CardDescription>Low-friction entry, guided progress, and instant value delivery.</CardDescription>

              <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
                {["Initial Data", "Analysis", "Summary", "Lead Capture", "Success"].map((label, index) => {
                  const stepOrder: Step[] = ["capture", "analysis", "summary", "lead", "success"];
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
                      {index < 2 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                    </div>
                  );
                })}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === "capture" && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">First Name</label>
                    <Input
                      ref={firstNameRef}
                      placeholder="Alex"
                      value={formState.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      onFocus={() => setErrors((prev) => ({ ...prev, firstName: undefined }))}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby="firstNameError"
                    />
                    {errors.firstName && (
                      <p id="firstNameError" className="text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Last Name</label>
                    <Input
                      placeholder="Jordan"
                      value={formState.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      onFocus={() => setErrors((prev) => ({ ...prev, lastName: undefined }))}
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby="lastNameError"
                    />
                    {errors.lastName && (
                      <p id="lastNameError" className="text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-800">Company Website URL</label>
                    <Input
                      placeholder="https://youragency.com"
                      value={formState.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      onFocus={() => setErrors((prev) => ({ ...prev, website: undefined }))}
                      aria-invalid={Boolean(errors.website)}
                      aria-describedby="websiteError"
                    />
                    <p className="text-xs text-gray-500">We’ll analyze this and auto-fix prefixes.</p>
                    {errors.website && (
                      <p id="websiteError" className={cn("text-sm", errors.website.includes("continue anyway") ? "text-amber-600" : "text-red-500")}>
                        {errors.website}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-3">
                    <Button type="submit" disabled={isSubmitting} className="h-12 text-base font-semibold">
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Validating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Start Free Analysis <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {step === "analysis" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-gradient-to-r from-primary/10 to-emerald-50 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">Analysis Progress</p>
                        <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-3 mt-3 overflow-hidden">
                        <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-primary to-emerald-500 transition-all duration-700" style={{ width: `${progressPercentage}%` }} />
                      </div>

                      <p className="mt-3 text-sm text-gray-700">
                        <span className="font-semibold">{statusMessage}</span>
                      </p>

                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                        <Globe2 className="w-4 h-4" />
                        <span>{normalizeWebsiteUrl(formState.website)}</span>
                      </div>
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

              {step === "summary" && (
                <div className="space-y-5">
                  {/* ✅ Hard-guard: if analysisData missing, show retry UI instead of crashing */}
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
                      <p className="text-sm text-gray-700">
                        I agree to be contacted about my report and accept the privacy policy.
                      </p>
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

              {step === "success" && (
                <div className="p-6 rounded-xl border bg-white space-y-3">
                  <p className="text-sm text-gray-500">Lead ID: {leadId}</p>
                  <h3 className="text-2xl font-bold text-gray-900">Success! Your report is being prepared.</h3>
                  <p className="text-gray-600">
                    We’ve captured your details. Our team can follow up with the full playbook and next-step recommendations.
                  </p>

                  <div className="flex flex-col md:flex-row gap-3 pt-2">
                    <BookCallButtonWithModal />
                    <Button type="button" variant="secondary" onClick={() => setStep("capture")}>
                      Run another analysis
                    </Button>
                  </div>
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
                <CardTitle className="text-base">Why reachability can be “false”</CardTitle>
                <CardDescription>Even when the URL is correct</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <p>Some sites block automated checks (HEAD), use Cloudflare/WAF, or geo-restrict server probes.</p>
                <p className="text-gray-500">We now treat verification as a warning and continue the analysis.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
