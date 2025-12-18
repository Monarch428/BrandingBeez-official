import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/components/ui/toaster";

import { SeoCaseStudyCardTab } from "./SeoCaseStudyCardTab";
import {
  SeoCaseStudyDetailTab,
  SeoCaseStudyHeroStat,
  SeoCaseStudyHighlight,
  SeoCaseStudyAboutStat,
  SeoCaseStudyInitialChallenge,
  SeoCaseStudyIssue,
  SeoCaseStudyKeywordRow,
  SeoCaseStudyTool,
  SeoCaseStudyTestimonial,
  SeoCaseStudyContactPoint,
  SeoCaseStudyPerformanceMetric,
  SeoCaseStudyKeywordMetric,
} from "./SeoCaseStudyDetailTab";

// ---------- Helper ----------
const slugifyTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// ✅ Required label helper (adds * visually)
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  );
}

// ---------- Types ----------
export type SeoCaseStudyCard = {
  _id: string; // Mongo id (FK for detail)
  id?: number; // optional numeric sequence
  slug: string;

  cardTitle: string;
  cardClient: string;
  cardIndustry: string;
  cardDescription: string;

  // optional small results for card grid
  cardResultsTraffic?: string;
  cardResultsKeywords?: string;
  cardResultsRevenue?: string;

  cardCoverImageUrl?: string;
  cardCoverImageAlt?: string;
  cardCoverFit?: "contain" | "cover";
  cardCoverImagePublicId?: string;

  createdAt: string;
  updatedAt: string;
};

export type SeoCaseStudyDetail = {
  cardId: string;

  // HERO
  heroBadgeText: string;
  heroCaseStudyLabel: string;
  heroClientName: string;
  heroRatingText?: string;
  heroHeadline: string;
  heroDescription: string;
  heroStats: SeoCaseStudyHeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;

  // VIDEO
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  // HIGHLIGHTS
  highlightsTitle: string;
  highlightsSubtitle: string;
  highlights: SeoCaseStudyHighlight[];

  // CTA 1
  cta1Title: string;
  cta1Body: string;
  cta1PrimaryCtaText: string;
  cta1PrimaryCtaHref?: string;

  // ABOUT
  aboutBadgeText: string;
  aboutLogoUrl?: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutStats: SeoCaseStudyAboutStat[];
  initialChallengesTitle: string;
  initialChallenges: SeoCaseStudyInitialChallenge[];

  // ISSUES
  issuesSectionTitle: string;
  issuesSectionSubtitle: string;
  issues: SeoCaseStudyIssue[];

  // KEYWORDS
  keywordPerformanceTitle: string;
  keywordPerformanceSubtitle: string;
  topKeywords: SeoCaseStudyKeywordRow[];

  // TOOLS
  toolsSectionTitle: string;
  toolsSectionSubtitle: string;
  tools: SeoCaseStudyTool[];

  // TESTIMONIALS + METRICS
  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  testimonials: SeoCaseStudyTestimonial[];
  contactData: SeoCaseStudyContactPoint[];
  performanceMetrics: SeoCaseStudyPerformanceMetric[];
  keywordMetrics: SeoCaseStudyKeywordMetric[];

  // CTA 2
  cta2Title: string;
  cta2Body: string;
  cta2PrimaryCtaText: string;
  cta2PrimaryCtaHref?: string;

  // BOTTOM CTA
  bottomCtaTitle: string;
  bottomCtaBody: string;
  bottomPrimaryCtaText: string;
  bottomPrimaryCtaHref?: string;
  bottomSecondaryCtaText?: string;
  bottomSecondaryCtaHref?: string;

  createdAt?: string;
  updatedAt?: string;
};

// server might return _id for detail
type SeoCaseStudyDetailDoc = SeoCaseStudyDetail & { _id?: string };

type FormState = Partial<SeoCaseStudyCard> &
  Partial<SeoCaseStudyDetailDoc> & {
    cardMongoId?: string;
    detailMongoId?: string;
  };

/**
 * ✅ DEFAULTS (admin sees sensible defaults, but can edit)
 * - headings defaulted
 * - iconKey defaulted
 * - CTA defaults
 */
const emptyForm: FormState = {
  // Card
  slug: "",
  cardTitle: "",
  cardClient: "",
  cardIndustry: "",
  cardDescription: "",
  cardResultsTraffic: "",
  cardResultsKeywords: "",
  cardResultsRevenue: "",
  cardCoverImageUrl: "",
  cardCoverImageAlt: "",
  cardCoverFit: "contain",
  cardCoverImagePublicId: "",

  // Detail FK
  cardId: "",
  detailMongoId: "",

  // HERO defaults
  heroBadgeText: "SEO Case Study",
  heroCaseStudyLabel: "Local SEO Growth",
  heroClientName: "",
  heroRatingText: "⭐⭐⭐⭐⭐ Rated 5.0 | Trusted by 25+ Clients",
  heroHeadline: "From Low Visibility → High Intent Leads",
  heroDescription: "",
  heroStats: [
    { value: "", label: "Organic Traffic", iconKey: "TrendingUp" },
    { value: "", label: "Top 3 Keywords", iconKey: "Search" },
    { value: "", label: "Lead Growth", iconKey: "Target" },
  ],
  heroPrimaryCtaText: "Book a Strategy Call",
  heroPrimaryCtaHref: "/book-appointment",
  heroVideoUrl: "",
  heroVideoPoster: "",
  heroVideoBadgeText: "Watch the results",

  // Highlights defaults
  highlightsTitle: "Key Wins",
  highlightsSubtitle: "What we improved fast",
  highlights: [
    { iconKey: "Rocket", title: "", description: "", subtext: "", colorClass: "text-green-600" },
    { iconKey: "BarChart3", title: "", description: "", subtext: "", colorClass: "text-blue-600" },
    { iconKey: "ShieldCheck", title: "", description: "", subtext: "", colorClass: "text-purple-600" },
  ],

  // CTA 1 defaults
  cta1Title: "Want results like this?",
  cta1Body: "",
  cta1PrimaryCtaText: "Get Free Audit",
  cta1PrimaryCtaHref: "/contact?service=seo",

  // About defaults
  aboutBadgeText: "About the Client",
  aboutLogoUrl: "",
  aboutTitle: "",
  aboutParagraph1: "",
  aboutParagraph2: "",
  aboutStats: [
    { iconKey: "Globe", label: "Service Area", value: "" },
    { iconKey: "Users", label: "Team Size", value: "" },
    { iconKey: "MapPin", label: "Location", value: "" },
  ],
  initialChallengesTitle: "Initial Challenges",
  initialChallenges: [{ order: 1, text: "" }],

  // Issues defaults
  issuesSectionTitle: "Issues We Fixed",
  issuesSectionSubtitle: "Technical, content, and local improvements",
  issues: [{ issue: "", severity: "High", action: "", result: "" }],

  // Keyword perf defaults
  keywordPerformanceTitle: "Keyword Performance",
  keywordPerformanceSubtitle: "Top movers",
  topKeywords: [{ keyword: "", position: 0, previousPosition: 0, volume: "" }],

  // Tools defaults
  toolsSectionTitle: "Tools We Used",
  toolsSectionSubtitle: "Stack and workflow",
  tools: [
    { iconKey: "Search", name: "Google Search Console", category: "Analytics", usage: "", colorClass: "text-blue-600" },
    { iconKey: "BarChart3", name: "GA4", category: "Analytics", usage: "", colorClass: "text-indigo-600" },
  ],

  // Testimonials + metrics defaults
  testimonialsSectionTitle: "Testimonials & Metrics",
  testimonialsSectionSubtitle: "Client feedback + KPI lift",
  testimonials: [{ name: "", role: "", company: "", imageUrl: "", quote: "", rating: 5 }],
  contactData: [{ month: "Jan", submissions: 0 }],
  performanceMetrics: [{ label: "CTR", value: "", change: "" }],
  keywordMetrics: [{ label: "Top 3", value: "", percentage: "" }],

  // CTA 2 defaults
  cta2Title: "Ready to grow?",
  cta2Body: "",
  cta2PrimaryCtaText: "Talk to Us",
  cta2PrimaryCtaHref: "/book-appointment",

  // Bottom CTA defaults
  bottomCtaTitle: "Let’s build your rankings",
  bottomCtaBody: "",
  bottomPrimaryCtaText: "Start Now",
  bottomPrimaryCtaHref: "/contact?service=seo",
  bottomSecondaryCtaText: "See Pricing",
  bottomSecondaryCtaHref: "/pricing-calculator?service=seo",
};

function normalizeDetailToForm(detail: SeoCaseStudyDetailDoc): Partial<FormState> {
  return {
    detailMongoId: detail?._id || "",
    cardId: detail.cardId,

    heroBadgeText: detail.heroBadgeText || "",
    heroCaseStudyLabel: detail.heroCaseStudyLabel || "",
    heroClientName: detail.heroClientName || "",
    heroRatingText: detail.heroRatingText || "",
    heroHeadline: detail.heroHeadline || "",
    heroDescription: detail.heroDescription || "",
    heroStats: Array.isArray(detail.heroStats) ? detail.heroStats : [],
    heroPrimaryCtaText: detail.heroPrimaryCtaText || "",
    heroPrimaryCtaHref: detail.heroPrimaryCtaHref || "",
    heroVideoUrl: detail.heroVideoUrl || "",
    heroVideoPoster: detail.heroVideoPoster || "",
    heroVideoBadgeText: detail.heroVideoBadgeText || "",

    highlightsTitle: detail.highlightsTitle || "",
    highlightsSubtitle: detail.highlightsSubtitle || "",
    highlights: Array.isArray(detail.highlights) ? detail.highlights : [],

    cta1Title: detail.cta1Title || "",
    cta1Body: detail.cta1Body || "",
    cta1PrimaryCtaText: detail.cta1PrimaryCtaText || "",
    cta1PrimaryCtaHref: detail.cta1PrimaryCtaHref || "",

    aboutBadgeText: detail.aboutBadgeText || "",
    aboutLogoUrl: detail.aboutLogoUrl || "",
    aboutTitle: detail.aboutTitle || "",
    aboutParagraph1: detail.aboutParagraph1 || "",
    aboutParagraph2: detail.aboutParagraph2 || "",
    aboutStats: Array.isArray(detail.aboutStats) ? detail.aboutStats : [],
    initialChallengesTitle: detail.initialChallengesTitle || "",
    initialChallenges: Array.isArray(detail.initialChallenges) ? detail.initialChallenges : [],

    issuesSectionTitle: detail.issuesSectionTitle || "",
    issuesSectionSubtitle: detail.issuesSectionSubtitle || "",
    issues: Array.isArray(detail.issues) ? detail.issues : [],

    keywordPerformanceTitle: detail.keywordPerformanceTitle || "",
    keywordPerformanceSubtitle: detail.keywordPerformanceSubtitle || "",
    topKeywords: Array.isArray(detail.topKeywords) ? detail.topKeywords : [],

    toolsSectionTitle: detail.toolsSectionTitle || "",
    toolsSectionSubtitle: detail.toolsSectionSubtitle || "",
    tools: Array.isArray(detail.tools) ? detail.tools : [],

    testimonialsSectionTitle: detail.testimonialsSectionTitle || "",
    testimonialsSectionSubtitle: detail.testimonialsSectionSubtitle || "",
    testimonials: Array.isArray(detail.testimonials) ? detail.testimonials : [],
    contactData: Array.isArray(detail.contactData) ? detail.contactData : [],
    performanceMetrics: Array.isArray(detail.performanceMetrics) ? detail.performanceMetrics : [],
    keywordMetrics: Array.isArray(detail.keywordMetrics) ? detail.keywordMetrics : [],

    cta2Title: detail.cta2Title || "",
    cta2Body: detail.cta2Body || "",
    cta2PrimaryCtaText: detail.cta2PrimaryCtaText || "",
    cta2PrimaryCtaHref: detail.cta2PrimaryCtaHref || "",

    bottomCtaTitle: detail.bottomCtaTitle || "",
    bottomCtaBody: detail.bottomCtaBody || "",
    bottomPrimaryCtaText: detail.bottomPrimaryCtaText || "",
    bottomPrimaryCtaHref: detail.bottomPrimaryCtaHref || "",
    bottomSecondaryCtaText: detail.bottomSecondaryCtaText || "",
    bottomSecondaryCtaHref: detail.bottomSecondaryCtaHref || "",
  };
}

export function SeoCaseStudiesManager() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "detail">("card");

  const { success, error: toastError } = useAppToast();
  const queryClient = useQueryClient();

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // ✅ LIST cards for admin
  const {
    data: cards = [],
    isLoading,
    error,
  } = useQuery<SeoCaseStudyCard[]>({
    queryKey: ["/api/admin/seo-case-studies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/seo-case-studies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch SEO case studies");
      return res.json();
    },
    enabled: Boolean(token),
  });

  const cardOptions = useMemo(() => {
    return (cards || []).map((c: any) => ({
      _id: c._id,
      slug: c.slug,
      cardTitle: c.cardTitle,
      cardClient: c.cardClient,
      cardIndustry: c.cardIndustry,
    }));
  }, [cards]);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setLoading(false);
    setDetailLoading(false);
  };

  // ✅ detail fetch by cardId (try multiple endpoint styles)
  const fetchDetailByCardId = async (cardId: string): Promise<SeoCaseStudyDetailDoc | null> => {
    if (!token) throw new Error("Admin token missing. Please login again.");
    if (!cardId) return null;

    const endpoints = [
      `/api/admin/seo-case-study/detail/${cardId}`,
      `/api/admin/seo-case-study/detail?cardId=${encodeURIComponent(cardId)}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 404) continue;
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed to fetch detail (${res.status})`);
        }
        const data = await res.json().catch(() => null);
        if (!data) continue;
        return data as SeoCaseStudyDetailDoc;
      } catch {
        continue;
      }
    }
    return null;
  };

  const openAdd = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setActiveTab("card");
    setDialogOpen(true);
  };

  const openEdit = async (slug: string) => {
    const it: any = (cards || []).find((x: any) => x.slug === slug);
    if (!it) return;

    setEditingSlug(slug);
    setSlugTouched(true);
    setActiveTab("card");
    setDialogOpen(true);

    // 1) load card immediately
    setForm({
      ...emptyForm,
      ...it,
      cardMongoId: it._id,
      cardId: it._id,
      detailMongoId: "",
    });

    // 2) fetch detail and merge
    try {
      setDetailLoading(true);
      const detail = await fetchDetailByCardId(String(it._id));
      if (detail) {
        // ✅ important: emptyForm first -> keeps defaults if DB missing fields
        setForm((p) => ({ ...emptyForm, ...p, ...normalizeDetailToForm(detail) }));
      } else {
        setForm((p) => ({ ...p, cardId: String(it._id), detailMongoId: "" }));
      }
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to load detail for edit.", "Detail");
    } finally {
      setDetailLoading(false);
    }
  };

  // ---------- DETAIL array handlers (✅ set default iconKey / defaults) ----------
  const addHeroStat = () =>
    handleChange("heroStats", [
      ...(form.heroStats || []),
      { value: "", label: "", iconKey: "TrendingUp" },
    ]);

  const updateHeroStat = (index: number, field: keyof SeoCaseStudyHeroStat, value: any) => {
    const next = [...(form.heroStats || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("heroStats", next);
  };

  const removeHeroStat = (index: number) =>
    handleChange("heroStats", (form.heroStats || []).filter((_, i) => i !== index));

  const addHighlight = () =>
    handleChange("highlights", [
      ...(form.highlights || []),
      { iconKey: "Rocket", title: "", description: "", subtext: "", colorClass: "text-green-600" },
    ]);

  const updateHighlight = (index: number, field: keyof SeoCaseStudyHighlight, value: any) => {
    const next = [...(form.highlights || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("highlights", next);
  };

  const removeHighlight = (index: number) =>
    handleChange("highlights", (form.highlights || []).filter((_, i) => i !== index));

  const addAboutStat = () =>
    handleChange("aboutStats", [
      ...(form.aboutStats || []),
      { iconKey: "Globe", label: "", value: "" },
    ]);

  const updateAboutStat = (index: number, field: keyof SeoCaseStudyAboutStat, value: any) => {
    const next = [...(form.aboutStats || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("aboutStats", next);
  };

  const removeAboutStat = (index: number) =>
    handleChange("aboutStats", (form.aboutStats || []).filter((_, i) => i !== index));

  const addInitialChallenge = () =>
    handleChange("initialChallenges", [
      ...(form.initialChallenges || []),
      { order: (form.initialChallenges || []).length + 1, text: "" },
    ]);

  const updateInitialChallenge = (index: number, field: keyof SeoCaseStudyInitialChallenge, value: any) => {
    const next = [...(form.initialChallenges || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("initialChallenges", next);
  };

  const removeInitialChallenge = (index: number) =>
    handleChange("initialChallenges", (form.initialChallenges || []).filter((_, i) => i !== index));

  const addIssue = () =>
    handleChange("issues", [
      ...(form.issues || []),
      { issue: "", severity: "High", action: "", result: "" },
    ]);

  const updateIssue = (index: number, field: keyof SeoCaseStudyIssue, value: any) => {
    const next = [...(form.issues || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("issues", next);
  };

  const removeIssue = (index: number) =>
    handleChange("issues", (form.issues || []).filter((_, i) => i !== index));

  const addKeyword = () =>
    handleChange("topKeywords", [
      ...(form.topKeywords || []),
      { keyword: "", position: 0, previousPosition: 0, volume: "" },
    ]);

  const updateKeyword = (index: number, field: keyof SeoCaseStudyKeywordRow, value: any) => {
    const next = [...(form.topKeywords || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("topKeywords", next);
  };

  const removeKeyword = (index: number) =>
    handleChange("topKeywords", (form.topKeywords || []).filter((_, i) => i !== index));

  const addTool = () =>
    handleChange("tools", [
      ...(form.tools || []),
      { iconKey: "Search", name: "", category: "", usage: "", colorClass: "text-blue-600" },
    ]);

  const updateTool = (index: number, field: keyof SeoCaseStudyTool, value: any) => {
    const next = [...(form.tools || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("tools", next);
  };

  const removeTool = (index: number) =>
    handleChange("tools", (form.tools || []).filter((_, i) => i !== index));

  const addTestimonial = () =>
    handleChange("testimonials", [
      ...(form.testimonials || []),
      { name: "", role: "", company: "", imageUrl: "", quote: "", rating: 5 },
    ]);

  const updateTestimonial = (index: number, field: keyof SeoCaseStudyTestimonial, value: any) => {
    const next = [...(form.testimonials || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("testimonials", next);
  };

  const removeTestimonial = (index: number) =>
    handleChange("testimonials", (form.testimonials || []).filter((_, i) => i !== index));

  const addContactPoint = () =>
    handleChange("contactData", [
      ...(form.contactData || []),
      { month: "", submissions: 0 },
    ]);

  const updateContactPoint = (index: number, field: keyof SeoCaseStudyContactPoint, value: any) => {
    const next = [...(form.contactData || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("contactData", next);
  };

  const removeContactPoint = (index: number) =>
    handleChange("contactData", (form.contactData || []).filter((_, i) => i !== index));

  const addPerformanceMetric = () =>
    handleChange("performanceMetrics", [
      ...(form.performanceMetrics || []),
      { label: "", value: "", change: "" },
    ]);

  const updatePerformanceMetric = (index: number, field: keyof SeoCaseStudyPerformanceMetric, value: any) => {
    const next = [...(form.performanceMetrics || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("performanceMetrics", next);
  };

  const removePerformanceMetric = (index: number) =>
    handleChange("performanceMetrics", (form.performanceMetrics || []).filter((_, i) => i !== index));

  const addKeywordMetric = () =>
    handleChange("keywordMetrics", [
      ...(form.keywordMetrics || []),
      { label: "", value: "", percentage: "" },
    ]);

  const updateKeywordMetric = (index: number, field: keyof SeoCaseStudyKeywordMetric, value: any) => {
    const next = [...(form.keywordMetrics || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("keywordMetrics", next);
  };

  const removeKeywordMetric = (index: number) =>
    handleChange("keywordMetrics", (form.keywordMetrics || []).filter((_, i) => i !== index));

  // ---------- SAVE CARD ----------
  const saveCard = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("Admin token missing. Please login again.");

      const slug = String(form.slug || "").trim();
      if (!slug) throw new Error("Slug is required");
      if (!form.cardTitle) throw new Error("Title is required");
      if (!form.cardClient) throw new Error("Client is required");
      if (!form.cardIndustry) throw new Error("Industry is required");
      if (!form.cardDescription) throw new Error("Description is required");

      const payload = {
        slug,
        cardTitle: String(form.cardTitle || "").trim(),
        cardClient: String(form.cardClient || "").trim(),
        cardIndustry: String(form.cardIndustry || "").trim(),
        cardDescription: String(form.cardDescription || "").trim(),

        cardResultsTraffic: form.cardResultsTraffic ? String(form.cardResultsTraffic) : undefined,
        cardResultsKeywords: form.cardResultsKeywords ? String(form.cardResultsKeywords) : undefined,
        cardResultsRevenue: form.cardResultsRevenue ? String(form.cardResultsRevenue) : undefined,

        cardCoverImageUrl: form.cardCoverImageUrl || undefined,
        cardCoverImageAlt: form.cardCoverImageAlt || undefined,
        cardCoverFit: (form.cardCoverFit || "contain") as "contain" | "cover",
        cardCoverImagePublicId: form.cardCoverImagePublicId || undefined,
      };

      const url = editingSlug
        ? `/api/admin/seo-case-study/card/${encodeURIComponent(slug)}`
        : "/api/admin/seo-case-study/card";
      const method = editingSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to save card");

      const mongoId = data?._id || form.cardMongoId || form.cardId;
      if (mongoId) {
        setForm((p) => ({ ...p, cardMongoId: mongoId, cardId: mongoId }));
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-case-studies"] });
      if (!editingSlug) setEditingSlug(slug);

      success("Card saved successfully.", "Card");

      // ✅ close popup after success
      closeDialog();
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to save card.", "Error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- SAVE DETAIL ----------
  const saveDetail = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("Admin token missing. Please login again.");

      const finalCardId = String(form.cardId || form.cardMongoId || "").trim();
      if (!finalCardId) throw new Error("Please select a Card (cardId) first.");

      // required fields (same idea like PPC)
      const required: Array<[keyof SeoCaseStudyDetail, string]> = [
        ["heroBadgeText", "Hero Badge Text is required"],
        ["heroCaseStudyLabel", "Hero Case Study Label is required"],
        ["heroClientName", "Hero Client Name is required"],
        ["heroHeadline", "Hero Headline is required"],
        ["heroDescription", "Hero Description is required"],
        ["heroPrimaryCtaText", "Hero Primary CTA Text is required"],

        ["highlightsTitle", "Highlights Title is required"],
        ["highlightsSubtitle", "Highlights Subtitle is required"],

        ["cta1Title", "CTA 1 Title is required"],
        ["cta1Body", "CTA 1 Body is required"],
        ["cta1PrimaryCtaText", "CTA 1 Primary CTA text is required"],

        ["aboutBadgeText", "About Badge Text is required"],
        ["aboutTitle", "About Title is required"],
        ["aboutParagraph1", "About Paragraph 1 is required"],
        ["aboutParagraph2", "About Paragraph 2 is required"],
        ["initialChallengesTitle", "Initial Challenges Title is required"],

        ["issuesSectionTitle", "Issues Section Title is required"],
        ["issuesSectionSubtitle", "Issues Section Subtitle is required"],

        ["keywordPerformanceTitle", "Keyword Performance Title is required"],
        ["keywordPerformanceSubtitle", "Keyword Performance Subtitle is required"],

        ["toolsSectionTitle", "Tools Section Title is required"],
        ["toolsSectionSubtitle", "Tools Section Subtitle is required"],

        ["testimonialsSectionTitle", "Testimonials Title is required"],
        ["testimonialsSectionSubtitle", "Testimonials Subtitle is required"],

        ["cta2Title", "CTA 2 Title is required"],
        ["cta2Body", "CTA 2 Body is required"],
        ["cta2PrimaryCtaText", "CTA 2 Primary CTA text is required"],

        ["bottomCtaTitle", "Bottom CTA Title is required"],
        ["bottomCtaBody", "Bottom CTA Body is required"],
        ["bottomPrimaryCtaText", "Bottom Primary CTA text is required"],
      ];

      for (const [key, msg] of required) {
        const v = (form as any)[key];
        if (typeof v !== "string" || !String(v).trim()) throw new Error(msg);
      }

      const payload: SeoCaseStudyDetail = {
        cardId: finalCardId,

        heroBadgeText: String(form.heroBadgeText || "").trim(),
        heroCaseStudyLabel: String(form.heroCaseStudyLabel || "").trim(),
        heroClientName: String(form.heroClientName || "").trim(),
        heroRatingText: form.heroRatingText ? String(form.heroRatingText).trim() : undefined,
        heroHeadline: String(form.heroHeadline || "").trim(),
        heroDescription: String(form.heroDescription || "").trim(),
        heroStats: (form.heroStats || []) as any,
        heroPrimaryCtaText: String(form.heroPrimaryCtaText || "").trim(),
        heroPrimaryCtaHref: form.heroPrimaryCtaHref || undefined,

        heroVideoUrl: form.heroVideoUrl || undefined,
        heroVideoPoster: form.heroVideoPoster || undefined,
        heroVideoBadgeText: form.heroVideoBadgeText || undefined,

        highlightsTitle: String(form.highlightsTitle || "").trim(),
        highlightsSubtitle: String(form.highlightsSubtitle || "").trim(),
        highlights: (form.highlights || []) as any,

        cta1Title: String(form.cta1Title || "").trim(),
        cta1Body: String(form.cta1Body || "").trim(),
        cta1PrimaryCtaText: String(form.cta1PrimaryCtaText || "").trim(),
        cta1PrimaryCtaHref: form.cta1PrimaryCtaHref || undefined,

        aboutBadgeText: String(form.aboutBadgeText || "").trim(),
        aboutLogoUrl: form.aboutLogoUrl || undefined,
        aboutTitle: String(form.aboutTitle || "").trim(),
        aboutParagraph1: String(form.aboutParagraph1 || "").trim(),
        aboutParagraph2: String(form.aboutParagraph2 || "").trim(),
        aboutStats: (form.aboutStats || []) as any,
        initialChallengesTitle: String(form.initialChallengesTitle || "").trim(),
        initialChallenges: (form.initialChallenges || []) as any,

        issuesSectionTitle: String(form.issuesSectionTitle || "").trim(),
        issuesSectionSubtitle: String(form.issuesSectionSubtitle || "").trim(),
        issues: (form.issues || []) as any,

        keywordPerformanceTitle: String(form.keywordPerformanceTitle || "").trim(),
        keywordPerformanceSubtitle: String(form.keywordPerformanceSubtitle || "").trim(),
        topKeywords: (form.topKeywords || []) as any,

        toolsSectionTitle: String(form.toolsSectionTitle || "").trim(),
        toolsSectionSubtitle: String(form.toolsSectionSubtitle || "").trim(),
        tools: (form.tools || []) as any,

        testimonialsSectionTitle: String(form.testimonialsSectionTitle || "").trim(),
        testimonialsSectionSubtitle: String(form.testimonialsSectionSubtitle || "").trim(),
        testimonials: (form.testimonials || []) as any,
        contactData: (form.contactData || []) as any,
        performanceMetrics: (form.performanceMetrics || []) as any,
        keywordMetrics: (form.keywordMetrics || []) as any,

        cta2Title: String(form.cta2Title || "").trim(),
        cta2Body: String(form.cta2Body || "").trim(),
        cta2PrimaryCtaText: String(form.cta2PrimaryCtaText || "").trim(),
        cta2PrimaryCtaHref: form.cta2PrimaryCtaHref || undefined,

        bottomCtaTitle: String(form.bottomCtaTitle || "").trim(),
        bottomCtaBody: String(form.bottomCtaBody || "").trim(),
        bottomPrimaryCtaText: String(form.bottomPrimaryCtaText || "").trim(),
        bottomPrimaryCtaHref: form.bottomPrimaryCtaHref || undefined,
        bottomSecondaryCtaText: form.bottomSecondaryCtaText || undefined,
        bottomSecondaryCtaHref: form.bottomSecondaryCtaHref || undefined,
      };

      const isEdit = Boolean(String(form.detailMongoId || "").trim());
      const endpoints = isEdit
        ? [
            `/api/admin/seo-case-study/detail/${encodeURIComponent(String(form.detailMongoId))}`,
            `/api/admin/seo-case-study/detail?detailId=${encodeURIComponent(String(form.detailMongoId))}`,
          ]
        : ["/api/admin/seo-case-study/detail"];

      const method = isEdit ? "PUT" : "POST";

      let saved: any = null;
      let lastErr: any = null;

      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message || "Failed to save detail");
          saved = data;
          break;
        } catch (e) {
          lastErr = e;
          continue;
        }
      }

      if (!saved) throw lastErr || new Error("Failed to save detail");

      const newDetailId = saved?._id || saved?.detailId;
      if (newDetailId) {
        setForm((p) => ({ ...p, detailMongoId: String(newDetailId) }));
      } else if (!form.detailMongoId) {
        try {
          const d = await fetchDetailByCardId(finalCardId);
          if (d?._id) setForm((p) => ({ ...p, detailMongoId: String(d._id) }));
        } catch {}
      }

      success(isEdit ? "Detail updated successfully." : "Detail saved successfully.", "Detail");

      // ✅ close popup after success
      closeDialog();
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to save detail.", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this SEO case study?")) return;

    try {
      const res = await fetch(`/api/admin/seo-case-study/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to delete");

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-case-studies"] });
      success("SEO case study deleted.", "Deleted");
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to delete.", "Error");
    }
  };

  // ✅ when selecting cardId in detail tab, auto-load existing detail (if any)
  const handleDetailCardSelect = async (cardId: string) => {
    handleChange("cardId", cardId);
    handleChange("detailMongoId", "");

    if (!cardId) return;

    try {
      setDetailLoading(true);
      const detail = await fetchDetailByCardId(cardId);

      if (detail) {
        setForm((p) => ({ ...emptyForm, ...p, ...normalizeDetailToForm(detail) }));
        success("Loaded existing detail for this card.", "Detail");
      } else {
        // keep card fields, reset detail fields to defaults
        setForm((p) => ({
          ...emptyForm,
          ...p,
          cardId,
          cardMongoId: p.cardMongoId || cardId,
          slug: p.slug || "",
          cardTitle: p.cardTitle || "",
          cardClient: p.cardClient || "",
          cardIndustry: p.cardIndustry || "",
          cardDescription: p.cardDescription || "",
          cardResultsTraffic: p.cardResultsTraffic || "",
          cardResultsKeywords: p.cardResultsKeywords || "",
          cardResultsRevenue: p.cardResultsRevenue || "",
          cardCoverImageUrl: p.cardCoverImageUrl || "",
          cardCoverImageAlt: p.cardCoverImageAlt || "",
          cardCoverFit: (p.cardCoverFit || "contain") as any,
          cardCoverImagePublicId: p.cardCoverImagePublicId || "",
          detailMongoId: "",
        }));
      }
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to load detail for selected card.", "Detail");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-brand-purple">SEO Case Studies</h2>
        <div className="flex items-center gap-3">
          <Badge>{cards.length} items</Badge>
          <Button className="bg-brand-purple" onClick={openAdd}>
            + Add Case Study
          </Button>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading...</CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-red-600">Failed to load SEO case studies</CardContent>
          </Card>
        ) : cards.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-gray-600">No SEO case studies yet.</CardContent>
          </Card>
        ) : (
          cards.map((it: any) => (
            <Card key={it._id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {it.cardCoverImageUrl ? (
                    <img
                      src={it.cardCoverImageUrl}
                      alt={it.cardCoverImageAlt || it.cardTitle}
                      className={`w-full h-full ${(it.cardCoverFit || "contain") === "cover" ? "object-cover" : "object-contain"}`}
                    />
                  ) : (
                    <div className="text-xs text-gray-400">No Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-brand-purple">{it.cardTitle}</div>
                    <Badge variant="secondary">{it.cardIndustry}</Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    /case-studies/{it.slug} • {it.cardClient}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {(it.cardResultsTraffic ? `Traffic: ${it.cardResultsTraffic}` : "")}
                    {it.cardResultsKeywords ? ` • Keywords: ${it.cardResultsKeywords}` : ""}
                    {it.cardResultsRevenue ? ` • Leads/Revenue: ${it.cardResultsRevenue}` : ""}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => openEdit(it.slug)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(it.slug)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* POPUP FORM */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSlug ? "Edit SEO Case Study" : "Add SEO Case Study"}</DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="text-sm text-gray-600 mb-2">Loading detail data...</div>
          ) : null}

          <div className="space-y-4">
            {/* Slug + Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <RequiredLabel>Slug</RequiredLabel>
                <Input
                  value={form.slug || ""}
                  onChange={(e) => {
                    setSlugTouched(true);
                    handleChange("slug", e.target.value);
                  }}
                  placeholder="atlantic-foundation-seo-case-study"
                  required
                />
              </div>

              <div>
                <RequiredLabel>Card Title (SEO Grid)</RequiredLabel>
                <Input
                  value={form.cardTitle || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("cardTitle", val);

                    if (!editingSlug && !slugTouched) {
                      const auto = slugifyTitle(val);
                      setForm((p) => ({ ...p, slug: auto }));
                    }
                  }}
                  placeholder="Atlantic Foundation: SEO Growth"
                  required
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="w-full bg-gray-100">
                <TabsTrigger
                  value="card"
                  className="flex-1 text-gray-600 data-[state=active]:bg-brand-coral data-[state=active]:text-white data-[state=active]:shadow transition-all"
                >
                  Card Section
                </TabsTrigger>
                <TabsTrigger
                  value="detail"
                  className="flex-1 text-gray-600 data-[state=active]:bg-brand-coral data-[state=active]:text-white data-[state=active]:shadow transition-all"
                >
                  Detail Page
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card">
                <SeoCaseStudyCardTab
                  form={form}
                  onChange={(field, value) => handleChange(field as any, value)}
                />

                <div className="flex gap-3 pt-4">
                  <Button type="button" className="bg-brand-purple" disabled={loading} onClick={saveCard}>
                    {loading ? "Saving..." : "Save Card"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog} disabled={loading}>
                    Close
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="detail">
                <SeoCaseStudyDetailTab
                  form={form}
                  onChange={(field, value) => {
                    if (field === "cardId") {
                      handleDetailCardSelect(String(value || ""));
                      return;
                    }
                    handleChange(field as any, value);
                  }}
                  cardOptions={cardOptions}
                  // arrays
                  addHeroStat={addHeroStat}
                  updateHeroStat={updateHeroStat}
                  removeHeroStat={removeHeroStat}
                  addHighlight={addHighlight}
                  updateHighlight={updateHighlight}
                  removeHighlight={removeHighlight}
                  addAboutStat={addAboutStat}
                  updateAboutStat={updateAboutStat}
                  removeAboutStat={removeAboutStat}
                  addInitialChallenge={addInitialChallenge}
                  updateInitialChallenge={updateInitialChallenge}
                  removeInitialChallenge={removeInitialChallenge}
                  addIssue={addIssue}
                  updateIssue={updateIssue}
                  removeIssue={removeIssue}
                  addKeyword={addKeyword}
                  updateKeyword={updateKeyword}
                  removeKeyword={removeKeyword}
                  addTool={addTool}
                  updateTool={updateTool}
                  removeTool={removeTool}
                  addTestimonial={addTestimonial}
                  updateTestimonial={updateTestimonial}
                  removeTestimonial={removeTestimonial}
                  addContactPoint={addContactPoint}
                  updateContactPoint={updateContactPoint}
                  removeContactPoint={removeContactPoint}
                  addPerformanceMetric={addPerformanceMetric}
                  updatePerformanceMetric={updatePerformanceMetric}
                  removePerformanceMetric={removePerformanceMetric}
                  addKeywordMetric={addKeywordMetric}
                  updateKeywordMetric={updateKeywordMetric}
                  removeKeywordMetric={removeKeywordMetric}
                />

                <div className="flex gap-3 pt-4">
                  <Button type="button" className="bg-brand-purple" disabled={loading || detailLoading} onClick={saveDetail}>
                    {loading ? "Saving..." : form.detailMongoId ? "Update Detail" : "Save Detail"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog} disabled={loading}>
                    Close
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
