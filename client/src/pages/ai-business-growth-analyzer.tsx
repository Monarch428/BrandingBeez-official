import { useEffect, useMemo, useRef, useState } from "react";
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

// type Step = "capture" | "analysis" | "summary";
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
  "We found 47 keyword opportunities you're missing...",
  "Your competitors are outranking you on 23 high-value terms...",
  "We identified 3 untapped lead generation channels...",
  "We found $42K in potential cost savings...",
  "Your reputation score is strong, but 6 reviews need replies...",
];

const disposableEmailDomains = [
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "trashmail.com",
];

const domainSuggestions: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "hotnail.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "yaho.com": "yahoo.com",
};

const strengths = [
  "Strong SEO momentum (87/100)",
  "Great reputation score (4.7★)",
  "Solid client retention signals",
];

const weaknesses = [
  "Limited lead gen diversity (3/10)",
  "High cost structure vs. peers",
  "Missing key directory coverage",
];

const quickActions = [
  {
    title: "Claim Clutch profile",
    detail: "2hrs, $0, 25-40 leads/yr",
  },
  {
    title: "Hire remote SDR in TX vs NYC",
    detail: "Save ~$35K/year",
  },
  {
    title: "Launch free ROI calculator",
    detail: "3x lead conversion potential",
  },
];

const reportPreview = [
  { title: "SEO Deep Dive", description: "Technical fixes + ranking roadmap" },
  { title: "Cost Savings Plan", description: "Margin unlocks & team efficiency" },
  { title: "Lead Gen Audit", description: "Channel mix, funnels, CRO fixes" },
];

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
  return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}${digits.length > 11 ? ` ${digits.slice(11)}` : ""}`;
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

async function checkWebsiteReachable(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok || response.type === "opaque";
  } catch (error) {
    clearTimeout(timeout);
    console.error("Website reachability check failed", error);
    return false;
  }
}

function ScoreGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color = clampedScore <= 40 ? "#ef4444" : clampedScore <= 65 ? "#f59e0b" : clampedScore <= 85 ? "#2563eb" : "#10b981";
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
        {state === "complete" ? <CheckCircle2 className="w-5 h-5" /> : state === "active" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Clock4 className="w-5 h-5" />}
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageStates, setStageStates] = useState<StageState[]>(analysisStages.map((_, idx) => (idx === 0 ? "active" : "pending")));
  const [statusMessage, setStatusMessage] = useState(analysisStages[0].message);
  const [teaserIndex, setTeaserIndex] = useState(0);
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [leadId, setLeadId] = useState("demo-lead-123");
  const emailRef = useRef<HTMLInputElement | null>(null);
  const firstNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

    useEffect(() => {
    if (step === "lead") {
      emailRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (step !== "analysis") return;

    setProgress(analysisStages[0].progress);
    setCurrentStage(0);
    setStatusMessage(analysisStages[0].message);
    setStageStates(analysisStages.map((_, idx) => (idx === 0 ? "active" : "pending")));

    const timers: NodeJS.Timeout[] = [];
    let accumulated = 0;

    analysisStages.forEach((stage, index) => {
      const delay = accumulated * 1000;
      timers.push(
        setTimeout(() => {
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
      setTimeout(() => {
        setStageStates(Array(analysisStages.length).fill("complete"));
        setStatusMessage("Analysis complete!");
        setProgress(100);
      }, accumulated * 1000),
    );

    timers.push(
      setTimeout(() => {
        setStep("summary");
      }, (accumulated + 1) * 1000),
    );

    return () => timers.forEach(clearTimeout);
  }, [step]);

  useEffect(() => {
    if (step !== "analysis") return;
    const interval = setInterval(() => {
      setTeaserIndex((prev) => (prev + 1) % teaserMessages.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [step]);

  const progressPercentage = useMemo(() => Math.min(100, Math.max(progress, (currentStage / (analysisStages.length - 1)) * 100)), [progress, currentStage]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nameErrors: FormErrors = {
      firstName: validateName(formState.firstName, "firstName"),
      lastName: validateName(formState.lastName, "lastName"),
      website: validateWebsite(formState.website),
    };

    const hasErrors = Object.values(nameErrors).some(Boolean);
    setErrors(nameErrors);
    if (hasErrors) return;

    setIsSubmitting(true);
    const normalizedUrl = normalizeWebsiteUrl(formState.website);
    const reachable = await checkWebsiteReachable(normalizedUrl);

    if (!reachable) {
      setErrors((prev) => ({ ...prev, website: "We couldn't reach this website. Please check the URL." }));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setStep("analysis");
  };

    const handleLeadChange = (field: keyof LeadFormState, value: string | boolean) => {
    const nextValue = field === "phone" && typeof value === "string" ? formatPhone(value) : value;
    setLeadForm((prev) => ({ ...prev, [field]: nextValue } as LeadFormState));
    setLeadErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "email" && typeof value === "string") {
      setEmailSuggestion(getEmailSuggestion(value));
    }
  };

  const handleLeadSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const leadFormErrors: LeadFormErrors = {
      email: validateEmail(leadForm.email),
      phone: validatePhone(leadForm.phone),
      consent: leadForm.consent ? undefined : "Please agree to our privacy policy to continue",
    };

    const hasLeadErrors = Object.values(leadFormErrors).some(Boolean);
    setLeadErrors(leadFormErrors);
    if (hasLeadErrors) return;

    setIsLeadSubmitting(true);
    setTimeout(() => {
      setIsLeadSubmitting(false);
      setLeadId("lead-" + Math.random().toString(36).slice(2, 8));
      setStep("success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-rose-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        <header className="flex items-start justify-between gap-4 flex-col lg:flex-row">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">BrandingBeez AI Agent</p>
            <h1 className="text-3xl lg:text-4xl font-bold mt-2">AI Business Growth Analyzer</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl">
              Get a comprehensive growth diagnosis for your digital marketing agency. Quick insights now, full report gated for
              qualified leads.
            </p>
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
                    <p className="text-xs text-gray-500">We'll analyze this and auto-fix prefixes.</p>
                    {errors.website && (
                      <p id="websiteError" className="text-sm text-red-500">
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
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100">
                        ��� 100% Free. No credit card.
                      </Badge>
                      <span>Auto-focus enabled • Enter key submits</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className="border-dashed border-gray-300">
                      ⭐⭐⭐⭐⭐ 4.9/5 from 200+ agencies
                    </Badge>
                    <Badge variant="outline" className="border-dashed border-gray-300">
                      Real-time validation
                    </Badge>
                    <Badge variant="outline" className="border-dashed border-gray-300">
                      Privacy-first data handling
                    </Badge>
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
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-primary to-emerald-500 transition-all duration-700"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" /> {statusMessage}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {analysisStages.map((stage, idx) => (
                        <StageItem
                          key={stage.label}
                          label={stage.label}
                          message={stage.message}
                          state={stageStates[idx]}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-white border shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe2 className="w-4 h-4 text-primary" />
                        <p className="text-sm font-semibold text-gray-800">Live findings</p>
                      </div>
                      <p className="text-base text-gray-700 min-h-[48px] transition-opacity">
                        {teaserMessages[teaserIndex]}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">This usually takes 60-90 seconds...</p>
                    </div>

                    <div className="p-4 rounded-xl bg-primary text-white shadow-md space-y-2">
                      <p className="text-sm font-semibold">No back button during analysis</p>
                      <p className="text-sm text-white/80">
                        If you close the tab, we keep analyzing. Cached results for 24 hours when you return.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === "summary" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <ScoreGauge score={73} />
                      <div className="space-y-2">
                        <p className="text-sm text-emerald-600 font-semibold">✓ Analysis Complete</p>
                        <h2 className="text-2xl font-bold">Your Business Growth Score</h2>
                        <p className="text-gray-600 max-w-xl">
                          A quick snapshot of where you stand before unlocking the full 28-page report.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Strengths surfaced</Badge>
                          <Badge className="bg-amber-50 text-amber-700 border-amber-100">Weak spots flagged</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white border shadow-sm space-y-3">
                        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Strengths
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {strengths.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-white border shadow-sm space-y-3">
                        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <Target className="w-4 h-4 text-amber-500" /> Weaknesses
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {weaknesses.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-amber-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                      <p className="text-sm font-semibold text-amber-700">��� Biggest Opportunity</p>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">Add Clutch/DesignRush = +$42K ARR</h3>
                      <p className="text-sm text-gray-700 mt-1">Simple profile claim to unlock new high-intent leads.</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-base font-semibold text-gray-900">Top 3 Immediate Actions</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {quickActions.map((action, idx) => (
                          <div key={action.title} className="p-4 rounded-xl bg-white border shadow-sm space-y-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <p className="font-semibold text-gray-900">{action.title}</p>
                            <p className="text-sm text-gray-600">{action.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white border shadow-sm space-y-3">
                      <p className="text-sm font-semibold text-gray-900">Your Full Report Includes</p>
                      <div className="space-y-3">
                        {reportPreview.map((item) => (
                          <ReportCard key={item.title} title={item.title} description={item.description} />
                        ))}
                        <div className="text-sm text-gray-600">+ 5 more detailed sections...</div>
                      </div>
                     <Button className="w-full h-12 text-base font-semibold" onClick={() => setStep("lead")}>
                        Unlock Full 28-Page Report
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full h-12 text-base font-semibold text-primary"
                        onClick={() => setStep("lead")}
                      >
                        Book Your Strategy Call
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {step === "lead" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                        <div>
                          <p className="text-sm uppercase tracking-wider text-primary font-semibold">Get Your Complete Business Growth Analysis</p>
                          <h2 className="text-2xl font-bold mt-2">Unlock your 28-page report instantly</h2>
                          <p className="text-gray-600 max-w-2xl mt-2">
                            Revenue growth opportunities, cost savings, and a 90-day plan tailored to your agency. Join 2,000+ agencies who already use this report.
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">This analysis expires in 24 hours</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {["Complete SEO gap analysis", "Competitor benchmarking", "$42K in identified cost savings", "90-day action plan", "Revenue growth opportunities", "Join 2,000+ agencies"].map((benefit) => (
                          <div key={benefit} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <form className="mt-6 space-y-4" onSubmit={handleLeadSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-800">Email Address</label>
                            <Input
                              ref={emailRef}
                              placeholder="you@company.com"
                              value={leadForm.email}
                              onChange={(e) => handleLeadChange("email", e.target.value)}
                              aria-invalid={Boolean(leadErrors.email)}
                              aria-describedby="emailError"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleLeadSubmit();
                              }}
                            />
                            {emailSuggestion && !leadErrors.email && (
                              <p className="text-xs text-amber-600">
                                Did you mean
                                <button
                                  type="button"
                                  className="underline font-semibold ml-1"
                                  onClick={() => setLeadForm((prev) => ({ ...prev, email: emailSuggestion }))}
                                >
                                  {emailSuggestion}
                                </button>
                                ?
                              </p>
                            )}
                            {leadErrors.email && (
                              <p id="emailError" className="text-sm text-red-500">{leadErrors.email}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-800">Phone Number</label>
                            <Input
                              placeholder="(555) 123-4567"
                              value={leadForm.phone}
                              onChange={(e) => handleLeadChange("phone", e.target.value)}
                              aria-invalid={Boolean(leadErrors.phone)}
                              aria-describedby="phoneError"
                              inputMode="tel"
                            />
                            {leadErrors.phone && (
                              <p id="phoneError" className="text-sm text-red-500">{leadErrors.phone}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="privacy"
                            checked={leadForm.consent}
                            onCheckedChange={(checked) => handleLeadChange("consent", Boolean(checked))}
                          />
                          <label htmlFor="privacy" className="text-sm text-gray-700 leading-tight">
                            I agree to the
                            <a href="/privacy-policy" target="_blank" rel="noreferrer" className="underline text-primary ml-1">
                              privacy policy
                            </a>
                          </label>
                        </div>
                        {leadErrors.consent && <p className="text-sm text-red-500">{leadErrors.consent}</p>}

                        <div className="flex flex-col gap-3">
                          <Button type="submit" className="h-12 text-base font-semibold" disabled={isLeadSubmitting}>
                            {isLeadSubmitting ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Preparing Your Report...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">Get My Free Report <ArrowRight className="w-4 h-4" /></span>
                            )}
                          </Button>
                          <p className="text-xs text-gray-600 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> We'll never spam you.
                          </p>
                          <p className="text-sm text-gray-700">⚡ Instant download + emailed copy</p>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-white to-emerald-50 border border-primary/20 shadow-sm space-y-3">
                      <p className="text-sm font-semibold text-gray-800">Report value recap</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> Your score: 73/100
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> Potential revenue increase: $42K
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> Cost savings identified: $35K
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> Implementation time: 90 days
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border shadow-sm space-y-2 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">Why we ask for this</p>
                      <p>We email your PDF and personalize your booking link. No spam. Opt-out anytime.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 text-emerald-600 font-semibold text-lg">
                        <CheckCircle2 className="w-6 h-6" /> Success! Your report is ready
                      </div>
                      <p className="text-gray-800 mt-2 text-lg">Hi {formState.firstName || "there"},</p>
                      <p className="text-gray-600 mt-1">Your complete Business Growth Analysis has been sent to:</p>
                      <p className="font-semibold text-gray-900">{leadForm.email || "your email"}</p>

                      <div className="mt-6 p-5 rounded-xl border bg-gradient-to-r from-primary/10 to-emerald-50">
                        <Button
                          className="w-full h-12 text-base font-semibold"
                          onClick={() => window.open("https://storage.example.com/report.pdf", "_blank")}
                        >
                          📥 Download Report (PDF)
                        </Button>
                        <p className="text-xs text-gray-600 mt-2">Download event tracked for CRM • Lead ID: {leadId}</p>
                      </div>

                      <div className="mt-6 space-y-2">
                        <p className="font-semibold text-gray-900">Quick Recap:</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Your score: 73/100</li>
                          <li>• Potential revenue increase: $42K</li>
                          <li>• Cost savings identified: $35K</li>
                          <li>• Implementation time: 90 days</li>
                        </ul>
                      </div>

                      <div className="mt-6 pt-6 border-t space-y-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">READY TO IMPLEMENT THIS PLAN?</p>
                          <p className="text-gray-700">Book a free 30-minute strategy call and we'll help you execute these opportunities.</p>
                        </div>
                        <Button
                          className="w-full h-12 text-base font-semibold"
                          onClick={() => {
                            const params = new URLSearchParams({
                              name: `${formState.firstName} ${formState.lastName}`.trim() || "Guest",
                              email: leadForm.email,
                              phone: leadForm.phone,
                              source: "ai-analyzer",
                              score: "73",
                              lead_id: leadId,
                              utm_source: "tool",
                              utm_medium: "ai-report",
                              utm_campaign: "lead-gen",
                            });
                            window.open(`https://brandingbeez.co.uk/book-call?${params.toString()}`, "_blank");
                          }}
                        >
                          📞 Book Your Strategy Call
                        </Button>
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>Limited slots available</span>
                          <span>⭐⭐⭐⭐⭐ Rated 4.9/5</span>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-gray-500 underline"
                          onClick={() => alert("No problem! We'll send you a reminder in 3 days.")}
                        >
                          Maybe Later
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-white border shadow-sm space-y-3 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">Next steps</p>
                      <p>We've sent a confirmation email with your download link. Re-open anytime from your inbox.</p>
                      <p>Want SMS copy? Reply to the email, and we'll text you the link.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-white to-emerald-50 border border-primary/20 space-y-3 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">Tracking events</p>
                      <ul className="space-y-1 list-disc pl-4">
                        <li>Report download logged</li>
                        <li>Booking intent tracked</li>
                        <li>Lead added to nurture sequence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Why agencies love this flow</CardTitle>
                <CardDescription>Real-time value with high-intent lead capture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Entry friction: LOW</p>
                    <p>Name + website only, instant validation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Value delivery: HIGH</p>
                    <p>Real-time analysis status + teaser insights.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Conversion mechanism</p>
                    <p>Summary upfront, gated report + strong CTA.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Progress Stages</CardTitle>
                <CardDescription>Transparent timing to set expectations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                {analysisStages.map((stage) => (
                  <div key={stage.label} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{stage.label}</p>
                      <p className="text-xs text-gray-500">{stage.message}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{stage.duration}s</p>
                      <p className="text-xs text-gray-500">{stage.progress}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Lead Capture Ready</CardTitle>
                <CardDescription>Design anticipates email/phone gate + booking CTA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span>Full report gated behind email & phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarClockIcon />
                  <span>Hard CTA for strategy call booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Prepared for PDF download confirmation flow</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M15 14.5 12.75 16 11 14" />
    </svg>
  );
}

