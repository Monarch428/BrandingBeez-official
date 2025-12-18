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

import { PpcCaseStudyCardTab } from "./PpcCaseStudyCardTab";
import {
  PpcCaseStudyDetailTab,
  PpcHeroStat,
  PpcInfoCard,
  PpcSectionCard,
  PpcBulletSection,
  PpcDashboardStat,
  PpcHighlightMetric,
  PpcOutstandingCard,
  PpcTimelineStep,
  PpcProcessStep,
} from "./PpcCaseStudyDetailTab";

// ---------- Helper ----------
const slugifyTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// ✅ Required label helper (adds *)
function ReqLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

// ---------- Types ----------
export type PpcResultItem = {
  key: string;
  label: string;
  value: string;
  colorClass?: string;
};

export type PpcCaseStudyCard = {
  _id: string; // Mongo id (FK for detail)
  id: number;  // numeric sequence (if you keep it)
  slug: string;

  title: string;
  client: string;
  industry: string;
  description: string;

  results: PpcResultItem[];

  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";

  // optional
  coverImagePublicId?: string;

  createdAt: string;
  updatedAt: string;
};

export type PpcCaseStudyDetail = {
  cardId: string; // FK

  heroBadgeText: string;
  heroClientName: string;
  heroRatingText?: string;
  heroDescription: string;
  heroStats: PpcHeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;

  // ✅ iframe video URL
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  clientProfileTitle: string;
  clientProfileSubtitle: string;
  clientProfileCards: PpcInfoCard[];

  challengeTitle: string;
  challengeSubtitle: string;
  challengeCards: PpcSectionCard[];

  approachTitle: string;
  approachSubtitle: string;
  approachSections: PpcBulletSection[];

  dashboardTitle: string;
  dashboardSubtitle: string;
  dashboardStats: PpcDashboardStat[];
  dashboardHighlight: PpcHighlightMetric;

  outstandingTitle: string;
  outstandingSubtitle: string;
  outstandingCards: PpcOutstandingCard[];

  timelineTitle: string;
  timelineSteps: PpcTimelineStep[];

  processTitle: string;
  processSubtitle: string;
  processSteps: PpcProcessStep[];

  midCtaTitle: string;
  midCtaBody: string;
  midPrimaryCtaText: string;
  midPrimaryCtaHref?: string;
  midSecondaryCtaText?: string;
  midSecondaryCtaHref?: string;

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
type PpcCaseStudyDetailDoc = PpcCaseStudyDetail & { _id?: string };

type FormState = Partial<PpcCaseStudyCard> &
  Partial<PpcCaseStudyDetailDoc> & {
    cardMongoId?: string;
    detailMongoId?: string;
  };

/**
 * ✅ DEFAULTS (so admin sees sensible defaults, but can edit)
 * - headings defaulted
 * - some icons defaulted
 * - CTA defaults
 */
const emptyForm: FormState = {
  // Card
  slug: "",
  title: "",
  client: "",
  industry: "",
  description: "",
  results: [],
  coverImageUrl: "",
  coverImageAlt: "",
  coverFit: "contain",
  coverImagePublicId: "",

  // Detail FK
  cardId: "",
  detailMongoId: "",

  // Detail defaults
  heroBadgeText: "Featured Google Ads Success Story",
  heroClientName: "",
  heroRatingText: "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by 25+ Agencies",
  heroDescription: "",
  heroStats: [
    { value: "", label: "", iconKey: "CheckCircle2" },
    { value: "", label: "", iconKey: "TrendingUp" },
    { value: "", label: "", iconKey: "Target" },
  ],
  heroPrimaryCtaText: "Schedule a Free Consultation",
  heroPrimaryCtaHref: "/book-appointment",
  heroVideoUrl: "",
  heroVideoPoster: "",
  heroVideoBadgeText: "Case Study Video",

  clientProfileTitle: "Client Profile",
  clientProfileSubtitle: "",
  clientProfileCards: [
    { iconKey: "Globe", title: "Website", value: "", href: "", colorClass: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400" },
    { iconKey: "MapPin", title: "Location", value: "", href: "", colorClass: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400" },
    { iconKey: "Building", title: "Industry", value: "", href: "", colorClass: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400" },
    { iconKey: "Users", title: "Team Size", value: "", href: "", colorClass: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400" },
  ],

  challengeTitle: "The Challenge",
  challengeSubtitle: "",
  challengeCards: [
    { iconKey: "XCircle", title: "", description: "", colorClass: "" },
    { iconKey: "Shield", title: "", description: "", colorClass: "" },
    { iconKey: "Search", title: "", description: "", colorClass: "" },
  ],

  approachTitle: "Our Strategic Approach",
  approachSubtitle: "",
  approachSections: [
    { iconKey: "Search", title: "", bullets: [""], colorClass: "" },
    { iconKey: "Settings", title: "", bullets: [""], colorClass: "" },
  ],

  dashboardTitle: "Google Ads Dashboard Results",
  dashboardSubtitle: "",
  dashboardStats: [
    { iconKey: "BarChart3", label: "Clicks", value: "" },
    { iconKey: "MousePointerClick", label: "CTR", value: "" },
    { iconKey: "TrendingUp", label: "Conversions", value: "" },
    { iconKey: "Target", label: "CPA", value: "" },
  ],
  dashboardHighlight: { label: "Average Cost Per Acquisition", value: "", subtext: "" },

  outstandingTitle: "Outstanding Results",
  outstandingSubtitle: "",
  outstandingCards: [
    { iconKey: "TrendingUp", value: "", title: "", description: "", colorClass: "" },
    { iconKey: "BarChart3", value: "", title: "", description: "", colorClass: "" },
    { iconKey: "Target", value: "", title: "", description: "", colorClass: "" },
    { iconKey: "CheckCircle2", value: "", title: "", description: "", colorClass: "" },
  ],

  timelineTitle: "Campaign Timeline",
  timelineSteps: [
    { order: 1, badgeText: "Week 1", title: "", description: "", colorClass: "" },
    { order: 2, badgeText: "Week 2", title: "", description: "", colorClass: "" },
    { order: 3, badgeText: "Week 3", title: "", description: "", colorClass: "" },
    { order: 4, badgeText: "Week 4", title: "", description: "", colorClass: "" },
  ],

  processTitle: "Our Proven Process",
  processSubtitle: "",
  processSteps: [
    { order: 1, title: "Audit", description: "" },
    { order: 2, title: "Build", description: "" },
    { order: 3, title: "Launch", description: "" },
    { order: 4, title: "Optimize", description: "" },
  ],

  midCtaTitle: "Ready to Achieve Similar Results?",
  midCtaBody: "",
  midPrimaryCtaText: "Book a Strategy Consultation",
  midPrimaryCtaHref: "/book-appointment",
  midSecondaryCtaText: "",
  midSecondaryCtaHref: "",

  bottomCtaTitle: "Ready to Achieve Similar Results?",
  bottomCtaBody: "",
  bottomPrimaryCtaText: "Book Your Strategy Call",
  bottomPrimaryCtaHref: "/book-appointment",
  bottomSecondaryCtaText: "",
  bottomSecondaryCtaHref: "",
};

function normalizeDetailToForm(detail: PpcCaseStudyDetailDoc): Partial<FormState> {
  return {
    detailMongoId: detail?._id || "",
    cardId: detail.cardId,

    heroBadgeText: detail.heroBadgeText || "",
    heroClientName: detail.heroClientName || "",
    heroRatingText: detail.heroRatingText || "",
    heroDescription: detail.heroDescription || "",
    heroStats: Array.isArray(detail.heroStats) ? detail.heroStats : [],
    heroPrimaryCtaText: detail.heroPrimaryCtaText || "",
    heroPrimaryCtaHref: detail.heroPrimaryCtaHref || "",
    heroVideoUrl: detail.heroVideoUrl || "",
    heroVideoPoster: detail.heroVideoPoster || "",
    heroVideoBadgeText: detail.heroVideoBadgeText || "",

    clientProfileTitle: detail.clientProfileTitle || "",
    clientProfileSubtitle: detail.clientProfileSubtitle || "",
    clientProfileCards: Array.isArray(detail.clientProfileCards) ? detail.clientProfileCards : [],

    challengeTitle: detail.challengeTitle || "",
    challengeSubtitle: detail.challengeSubtitle || "",
    challengeCards: Array.isArray(detail.challengeCards) ? detail.challengeCards : [],

    approachTitle: detail.approachTitle || "",
    approachSubtitle: detail.approachSubtitle || "",
    approachSections: Array.isArray(detail.approachSections) ? detail.approachSections : [],

    dashboardTitle: detail.dashboardTitle || "",
    dashboardSubtitle: detail.dashboardSubtitle || "",
    dashboardStats: Array.isArray(detail.dashboardStats) ? detail.dashboardStats : [],
    dashboardHighlight: detail.dashboardHighlight || { label: "", value: "", subtext: "" },

    outstandingTitle: detail.outstandingTitle || "",
    outstandingSubtitle: detail.outstandingSubtitle || "",
    outstandingCards: Array.isArray(detail.outstandingCards) ? detail.outstandingCards : [],

    timelineTitle: detail.timelineTitle || "",
    timelineSteps: Array.isArray(detail.timelineSteps) ? detail.timelineSteps : [],

    processTitle: detail.processTitle || "",
    processSubtitle: detail.processSubtitle || "",
    processSteps: Array.isArray(detail.processSteps) ? detail.processSteps : [],

    midCtaTitle: detail.midCtaTitle || "",
    midCtaBody: detail.midCtaBody || "",
    midPrimaryCtaText: detail.midPrimaryCtaText || "",
    midPrimaryCtaHref: detail.midPrimaryCtaHref || "",
    midSecondaryCtaText: detail.midSecondaryCtaText || "",
    midSecondaryCtaHref: detail.midSecondaryCtaHref || "",

    bottomCtaTitle: detail.bottomCtaTitle || "",
    bottomCtaBody: detail.bottomCtaBody || "",
    bottomPrimaryCtaText: detail.bottomPrimaryCtaText || "",
    bottomPrimaryCtaHref: detail.bottomPrimaryCtaHref || "",
    bottomSecondaryCtaText: detail.bottomSecondaryCtaText || "",
    bottomSecondaryCtaHref: detail.bottomSecondaryCtaHref || "",
  };
}

export function PpcCaseStudiesManager() {
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
  } = useQuery<PpcCaseStudyCard[]>({
    queryKey: ["/api/admin/ppc-case-studies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/ppc-case-studies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch PPC case studies");
      return res.json();
    },
    enabled: Boolean(token),
  });

  const cardOptions = useMemo(() => {
    return (cards || []).map((c: any) => ({
      _id: c._id,
      slug: c.slug,
      title: c.title,
      client: c.client,
      industry: c.industry,
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
  const fetchDetailByCardId = async (cardId: string): Promise<PpcCaseStudyDetailDoc | null> => {
    if (!token) throw new Error("Admin token missing. Please login again.");
    if (!cardId) return null;

    const endpoints = [
      `/api/admin/ppc-case-study/detail/${cardId}`,
      `/api/admin/ppc-case-study/detail?cardId=${encodeURIComponent(cardId)}`,
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
        return data as PpcCaseStudyDetailDoc;
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
        setForm((p) => ({ ...p, ...normalizeDetailToForm(detail) }));
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

  // ---------- CARD helpers ----------
  const addResult = () =>
    handleChange("results", [
      ...(form.results || []),
      { key: `r${(form.results || []).length + 1}`, label: "", value: "", colorClass: "" },
    ]);

  const updateResult = (index: number, field: keyof PpcResultItem, value: any) => {
    const next = [...(form.results || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("results", next);
  };

  const removeResult = (index: number) =>
    handleChange("results", (form.results || []).filter((_, i) => i !== index));

  // ---------- DETAIL array handlers (✅ set default iconKey / defaults) ----------
  const addHeroStat = () =>
    handleChange("heroStats", [
      ...(form.heroStats || []),
      { value: "", label: "", iconKey: "CheckCircle2" },
    ]);

  const updateHeroStat = (index: number, field: keyof PpcHeroStat, value: any) => {
    const next = [...(form.heroStats || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("heroStats", next);
  };

  const removeHeroStat = (index: number) =>
    handleChange("heroStats", (form.heroStats || []).filter((_, i) => i !== index));

  const addClientProfileCard = () =>
    handleChange("clientProfileCards", [
      ...(form.clientProfileCards || []),
      { iconKey: "Globe", title: "", value: "", href: "", colorClass: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400" },
    ]);

  const updateClientProfileCard = (index: number, field: keyof PpcInfoCard, value: any) => {
    const next = [...(form.clientProfileCards || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("clientProfileCards", next);
  };

  const removeClientProfileCard = (index: number) =>
    handleChange("clientProfileCards", (form.clientProfileCards || []).filter((_, i) => i !== index));

  const addChallengeCard = () =>
    handleChange("challengeCards", [
      ...(form.challengeCards || []),
      { iconKey: "XCircle", title: "", description: "", colorClass: "" },
    ]);

  const updateChallengeCard = (index: number, field: keyof PpcSectionCard, value: any) => {
    const next = [...(form.challengeCards || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("challengeCards", next);
  };

  const removeChallengeCard = (index: number) =>
    handleChange("challengeCards", (form.challengeCards || []).filter((_, i) => i !== index));

  const addApproachSection = () =>
    handleChange("approachSections", [
      ...(form.approachSections || []),
      { iconKey: "Search", title: "", bullets: [""], colorClass: "" },
    ]);

  const updateApproachSection = (index: number, field: keyof PpcBulletSection, value: any) => {
    const next = [...(form.approachSections || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("approachSections", next);
  };

  const removeApproachSection = (index: number) =>
    handleChange("approachSections", (form.approachSections || []).filter((_, i) => i !== index));

  const addApproachBullet = (sectionIndex: number) => {
    const next = [...(form.approachSections || [])];
    const sec = next[sectionIndex] as any;
    sec.bullets = [...(sec.bullets || []), ""];
    next[sectionIndex] = sec;
    handleChange("approachSections", next);
  };

  const updateApproachBullet = (sectionIndex: number, bulletIndex: number, value: string) => {
    const next = [...(form.approachSections || [])];
    const sec = next[sectionIndex] as any;
    const bullets = [...(sec.bullets || [])];
    bullets[bulletIndex] = value;
    sec.bullets = bullets;
    next[sectionIndex] = sec;
    handleChange("approachSections", next);
  };

  const removeApproachBullet = (sectionIndex: number, bulletIndex: number) => {
    const next = [...(form.approachSections || [])];
    const sec = next[sectionIndex] as any;
    sec.bullets = (sec.bullets || []).filter((_: any, i: number) => i !== bulletIndex);
    next[sectionIndex] = sec;
    handleChange("approachSections", next);
  };

  const addDashboardStat = () =>
    handleChange("dashboardStats", [
      ...(form.dashboardStats || []),
      { iconKey: "BarChart3", label: "", value: "" },
    ]);

  const updateDashboardStat = (index: number, field: keyof PpcDashboardStat, value: any) => {
    const next = [...(form.dashboardStats || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("dashboardStats", next);
  };

  const removeDashboardStat = (index: number) =>
    handleChange("dashboardStats", (form.dashboardStats || []).filter((_, i) => i !== index));

  const addOutstandingCard = () =>
    handleChange("outstandingCards", [
      ...(form.outstandingCards || []),
      { iconKey: "TrendingUp", value: "", title: "", description: "", colorClass: "" },
    ]);

  const updateOutstandingCard = (index: number, field: keyof PpcOutstandingCard, value: any) => {
    const next = [...(form.outstandingCards || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("outstandingCards", next);
  };

  const removeOutstandingCard = (index: number) =>
    handleChange("outstandingCards", (form.outstandingCards || []).filter((_, i) => i !== index));

  const addTimelineStep = () =>
    handleChange("timelineSteps", [
      ...(form.timelineSteps || []),
      { order: (form.timelineSteps || []).length + 1, badgeText: "", title: "", description: "", colorClass: "" },
    ]);

  const updateTimelineStep = (index: number, field: keyof PpcTimelineStep, value: any) => {
    const next = [...(form.timelineSteps || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("timelineSteps", next);
  };

  const removeTimelineStep = (index: number) =>
    handleChange("timelineSteps", (form.timelineSteps || []).filter((_, i) => i !== index));

  const addProcessStep = () =>
    handleChange("processSteps", [
      ...(form.processSteps || []),
      { order: (form.processSteps || []).length + 1, title: "", description: "" },
    ]);

  const updateProcessStep = (index: number, field: keyof PpcProcessStep, value: any) => {
    const next = [...(form.processSteps || [])];
    next[index] = { ...(next[index] as any), [field]: value };
    handleChange("processSteps", next);
  };

  const removeProcessStep = (index: number) =>
    handleChange("processSteps", (form.processSteps || []).filter((_, i) => i !== index));

  // ---------- SAVE CARD ----------
  const saveCard = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("Admin token missing. Please login again.");

      const slug = String(form.slug || "").trim();
      if (!slug) throw new Error("Slug is required");
      if (!form.title) throw new Error("Title is required");
      if (!form.client) throw new Error("Client is required");
      if (!form.industry) throw new Error("Industry is required");
      if (!form.description) throw new Error("Description is required");
      if (!Array.isArray(form.results) || form.results.length === 0) {
        throw new Error("At least 1 Result item is required");
      }

      const payload = {
        slug,
        title: String(form.title || "").trim(),
        client: String(form.client || "").trim(),
        industry: String(form.industry || "").trim(),
        description: String(form.description || "").trim(),
        results: (form.results || []).map((r: any) => ({
          key: String(r.key || "").trim(),
          label: String(r.label || "").trim(),
          value: String(r.value || "").trim(),
          colorClass: r.colorClass ? String(r.colorClass) : undefined,
        })),
        coverImageUrl: form.coverImageUrl || undefined,
        coverImageAlt: form.coverImageAlt || undefined,
        coverFit: (form.coverFit || "contain") as "contain" | "cover",
        coverImagePublicId: form.coverImagePublicId || undefined,
      };

      const url = editingSlug
        ? `/api/admin/ppc-case-study/card/${encodeURIComponent(slug)}`
        : "/api/admin/ppc-case-study/card";
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

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/ppc-case-studies"] });
      if (!editingSlug) setEditingSlug(slug);

      success("Card saved successfully.", "Card");

      // ✅ close popup after successful submission
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

      const required: Array<[keyof PpcCaseStudyDetail, string]> = [
        ["heroBadgeText", "Hero Badge Text is required"],
        ["heroClientName", "Hero Client Name is required"],
        ["heroDescription", "Hero Description is required"],
        ["heroPrimaryCtaText", "Hero Primary CTA Text is required"],

        ["clientProfileTitle", "Client Profile Title is required"],
        ["clientProfileSubtitle", "Client Profile Subtitle is required"],
        ["challengeTitle", "Challenge Title is required"],
        ["challengeSubtitle", "Challenge Subtitle is required"],
        ["approachTitle", "Approach Title is required"],
        ["approachSubtitle", "Approach Subtitle is required"],
        ["dashboardTitle", "Dashboard Title is required"],
        ["dashboardSubtitle", "Dashboard Subtitle is required"],
        ["outstandingTitle", "Outstanding Title is required"],
        ["outstandingSubtitle", "Outstanding Subtitle is required"],
        ["timelineTitle", "Timeline Title is required"],
        ["processTitle", "Process Title is required"],
        ["processSubtitle", "Process Subtitle is required"],
        ["midCtaTitle", "Mid CTA Title is required"],
        ["midCtaBody", "Mid CTA Body is required"],
        ["midPrimaryCtaText", "Mid Primary CTA text is required"],
        ["bottomCtaTitle", "Bottom CTA Title is required"],
        ["bottomCtaBody", "Bottom CTA Body is required"],
        ["bottomPrimaryCtaText", "Bottom Primary CTA text is required"],
      ];

      for (const [key, msg] of required) {
        const v = (form as any)[key];
        if (typeof v !== "string" || !String(v).trim()) throw new Error(msg);
      }

      const payload: PpcCaseStudyDetail = {
        cardId: finalCardId,

        heroBadgeText: String(form.heroBadgeText || "").trim(),
        heroClientName: String(form.heroClientName || "").trim(),
        heroRatingText: form.heroRatingText ? String(form.heroRatingText).trim() : undefined,
        heroDescription: String(form.heroDescription || "").trim(),
        heroStats: (form.heroStats || []) as any,
        heroPrimaryCtaText: String(form.heroPrimaryCtaText || "").trim(),
        heroPrimaryCtaHref: form.heroPrimaryCtaHref || undefined,
        heroVideoUrl: form.heroVideoUrl || undefined, // ✅ iframe url
        heroVideoPoster: form.heroVideoPoster || undefined,
        heroVideoBadgeText: form.heroVideoBadgeText || undefined,

        clientProfileTitle: String(form.clientProfileTitle || "").trim(),
        clientProfileSubtitle: String(form.clientProfileSubtitle || "").trim(),
        clientProfileCards: (form.clientProfileCards || []) as any,

        challengeTitle: String(form.challengeTitle || "").trim(),
        challengeSubtitle: String(form.challengeSubtitle || "").trim(),
        challengeCards: (form.challengeCards || []) as any,

        approachTitle: String(form.approachTitle || "").trim(),
        approachSubtitle: String(form.approachSubtitle || "").trim(),
        approachSections: (form.approachSections || []) as any,

        dashboardTitle: String(form.dashboardTitle || "").trim(),
        dashboardSubtitle: String(form.dashboardSubtitle || "").trim(),
        dashboardStats: (form.dashboardStats || []) as any,
        dashboardHighlight: (form.dashboardHighlight || { label: "", value: "", subtext: "" }) as any,

        outstandingTitle: String(form.outstandingTitle || "").trim(),
        outstandingSubtitle: String(form.outstandingSubtitle || "").trim(),
        outstandingCards: (form.outstandingCards || []) as any,

        timelineTitle: String(form.timelineTitle || "").trim(),
        timelineSteps: (form.timelineSteps || []) as any,

        processTitle: String(form.processTitle || "").trim(),
        processSubtitle: String(form.processSubtitle || "").trim(),
        processSteps: (form.processSteps || []) as any,

        midCtaTitle: String(form.midCtaTitle || "").trim(),
        midCtaBody: String(form.midCtaBody || "").trim(),
        midPrimaryCtaText: String(form.midPrimaryCtaText || "").trim(),
        midPrimaryCtaHref: form.midPrimaryCtaHref || undefined,
        midSecondaryCtaText: form.midSecondaryCtaText || undefined,
        midSecondaryCtaHref: form.midSecondaryCtaHref || undefined,

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
            `/api/admin/ppc-case-study/detail/${encodeURIComponent(String(form.detailMongoId))}`,
            `/api/admin/ppc-case-study/detail?detailId=${encodeURIComponent(String(form.detailMongoId))}`,
          ]
        : ["/api/admin/ppc-case-study/detail"];

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

      // ✅ close popup after successful submission
      closeDialog();
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to save detail.", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this PPC case study?")) return;

    try {
      const res = await fetch(`/api/admin/ppc-case-study/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to delete");

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/ppc-case-studies"] });
      success("PPC case study deleted.", "Deleted");
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
        setForm((p) => ({ ...p, ...normalizeDetailToForm(detail) }));
        success("Loaded existing detail for this card.", "Detail");
      } else {
        // keep card fields, clear detail fields
        setForm((p) => ({
          ...emptyForm,
          ...p,
          cardId,
          cardMongoId: p.cardMongoId || cardId,
          slug: p.slug || "",
          title: p.title || "",
          client: p.client || "",
          industry: p.industry || "",
          description: p.description || "",
          results: p.results || [],
          coverImageUrl: p.coverImageUrl || "",
          coverImageAlt: p.coverImageAlt || "",
          coverFit: (p.coverFit || "contain") as any,
          coverImagePublicId: p.coverImagePublicId || "",
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
        <h2 className="text-2xl font-bold text-brand-purple">PPC / Google Ads Case Studies</h2>
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
          <Card><CardContent className="p-6">Loading...</CardContent></Card>
        ) : error ? (
          <Card><CardContent className="p-6 text-red-600">Failed to load PPC case studies</CardContent></Card>
        ) : cards.length === 0 ? (
          <Card><CardContent className="p-6 text-gray-600">No PPC case studies yet.</CardContent></Card>
        ) : (
          cards.map((it: any) => (
            <Card key={it._id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {it.coverImageUrl ? (
                    <img
                      src={it.coverImageUrl}
                      alt={it.coverImageAlt || it.title}
                      className={`w-full h-full ${(it.coverFit || "contain") === "cover" ? "object-cover" : "object-contain"}`}
                    />
                  ) : (
                    <div className="text-xs text-gray-400">No Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-brand-purple">{it.title}</div>
                    <Badge variant="secondary">{it.industry}</Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    /ppc-case-study/{it.slug} • {it.client}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {(it.results || []).slice(0, 3).map((r: any) => `${r.label}: ${r.value}`).join(" • ")}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => openEdit(it.slug)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(it.slug)}>Delete</Button>
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
            <DialogTitle>
              {editingSlug ? "Edit PPC Case Study" : "Add PPC Case Study"}
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="text-sm text-gray-600 mb-2">Loading detail data...</div>
          ) : null}

          <div className="space-y-4">
            {/* Slug + Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ReqLabel>Slug</ReqLabel>
                <Input
                  value={form.slug || ""}
                  onChange={(e) => {
                    setSlugTouched(true);
                    handleChange("slug", e.target.value);
                  }}
                  placeholder="arlingsworth-solicitors-case-study"
                  required
                />
              </div>

              <div>
                <ReqLabel>Card Title (PPC Grid)</ReqLabel>
                <Input
                  value={form.title || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("title", val);

                    if (!editingSlug && !slugTouched) {
                      const auto = slugifyTitle(val);
                      setForm((p) => ({ ...p, slug: auto }));
                    }
                  }}
                  placeholder="UK Legal Services Excellence"
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
                <PpcCaseStudyCardTab
                  form={form}
                  onChange={(field, value) => handleChange(field as any, value)}
                  addResult={addResult}
                  updateResult={updateResult}
                  removeResult={removeResult}
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
                <PpcCaseStudyDetailTab
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

                  addClientProfileCard={addClientProfileCard}
                  updateClientProfileCard={updateClientProfileCard}
                  removeClientProfileCard={removeClientProfileCard}

                  addChallengeCard={addChallengeCard}
                  updateChallengeCard={updateChallengeCard}
                  removeChallengeCard={removeChallengeCard}

                  addApproachSection={addApproachSection}
                  updateApproachSection={updateApproachSection}
                  removeApproachSection={removeApproachSection}
                  addApproachBullet={addApproachBullet}
                  updateApproachBullet={updateApproachBullet}
                  removeApproachBullet={removeApproachBullet}

                  addDashboardStat={addDashboardStat}
                  updateDashboardStat={updateDashboardStat}
                  removeDashboardStat={removeDashboardStat}

                  addOutstandingCard={addOutstandingCard}
                  updateOutstandingCard={updateOutstandingCard}
                  removeOutstandingCard={removeOutstandingCard}

                  addTimelineStep={addTimelineStep}
                  updateTimelineStep={updateTimelineStep}
                  removeTimelineStep={removeTimelineStep}

                  addProcessStep={addProcessStep}
                  updateProcessStep={updateProcessStep}
                  removeProcessStep={removeProcessStep}
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
