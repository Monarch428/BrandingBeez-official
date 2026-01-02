// DedicatedResourceCaseStudiesManager.tsx
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

import { DedicatedResourceCaseStudyCardTab } from "./DedicatedResourceCaseStudyCardTab";
import {
  DedicatedResourceCaseStudyDetailTab,
  DrHeroStat,
  DrTeamMember,
  DrMiniStat,
  DrImpactBullet,
  DrPreMetricItem,
  DrEvolutionStep,
  DrSuccessFactor,
  DrBeforeAfterRow,
  DrTestimonial,
  DrVideoTestimonial,
  DrCtaPrimary,
  DrCtaSecondary,
  DrSeoMeta,
} from "./DedicatedResourceCaseStudyDetailTab";

// ---------- Helper ----------
const slugifyTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// ✅ Required label helper
function RequiredLabel({ children }: { children: string }) {
  return (
    <Label>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  );
}

// ---------- Types (Card) ----------
export type DedicatedResourceCaseStudyResultItem = {
  key: string;
  label: string;
  value: string;
  valueClass?: string; // UI hint like "text-green-600"
};

export type DedicatedResourceCaseStudyCard = {
  _id: string; // Mongo id (FK for detail)
  id: number; // numeric sequence
  slug: string;

  // card header
  title: string; // "Social Land"
  client: string; // "SocialLand Digital"
  industry: string; // "Digital Marketing Agency"
  description: string;

  badgeText?: string;
  badgeClass?: string;

  logoUrl?: string;
  logoAlt?: string;

  categoryLabel?: string;
  categoryClass?: string;

  // KPI rows (3 in UI, but keep flexible)
  results: DedicatedResourceCaseStudyResultItem[];

  // optional cover
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";
  coverImagePublicId?: string;

  // optional link (FE can build from slug)
  link?: string;

  createdAt: string;
  updatedAt: string;
};

// ---------- Types (Detail) ----------
export type DedicatedResourceCaseStudyDetail = {
  cardId: string;

  // HERO
  heroBadgeText: string;
  heroTitle: string;
  heroRatingText?: string;
  heroDescription: string;
  heroStats: DrHeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  heroClientName: string;
  heroClientIndustry: string;
  heroClientMeta: {
    hqText: string;
    peopleText: string;
    specialtyText: string;
    logoUrl?: string;
  };

  // TEAM INVOLVED
  teamTitle: string;
  teamSubtitle: string;
  teamBannerLeftText: string;
  teamBannerStatusText: string;
  teamMembers: DrTeamMember[];
  teamStats: DrMiniStat[];

  // PARTNERSHIP CHALLENGE
  challengeTitle: string;
  challengeBody: string;
  challengeImpactTitle: string;
  challengeImpactBullets: DrImpactBullet[];

  prePartnershipTitle: string;
  prePartnershipMetrics: DrPreMetricItem[];

  // PARTNERSHIP EVOLUTION
  evolutionTitle: string;
  evolutionSubtitle: string;
  evolutionSteps: DrEvolutionStep[];

  // SUCCESS FACTORS
  successFactorsTitle: string;
  successFactorsSubtitle: string;
  successFactors: DrSuccessFactor[];

  // BEFORE / AFTER
  beforeAfterTitle: string;
  beforeAfterSubtitle: string;
  beforeAfterRows: DrBeforeAfterRow[];

  // CLIENT FEEDBACK
  feedbackTitle: string;
  feedbackSubtitle: string;
  testimonials: DrTestimonial[];
  videoTestimonial?: DrVideoTestimonial;

  // CTA blocks
  ctaPrimary: DrCtaPrimary;
  ctaSecondary: DrCtaSecondary;

  seo?: DrSeoMeta;

  createdAt?: string;
  updatedAt?: string;
};

type DedicatedResourceCaseStudyDetailDoc = DedicatedResourceCaseStudyDetail & { _id?: string };

type FormState = Partial<DedicatedResourceCaseStudyCard> &
  Partial<DedicatedResourceCaseStudyDetailDoc> & {
    cardMongoId?: string;
    detailMongoId?: string;
  };

// ✅ DEFAULTS (admin sees defaults but can edit)
const emptyForm: FormState = {
  // Card
  slug: "",
  title: "",
  client: "",
  industry: "",
  description: "",

  badgeText: "+30 Months Onwards",
  badgeClass: "bg-brand-coral text-white",

  logoUrl: "",
  logoAlt: "",

  categoryLabel: "Digital Marketing",
  categoryClass: "bg-purple-100 text-purple-800 border border-purple-200",

  results: [
    { key: "projectOutput", label: "Project Output", value: "+150%", valueClass: "text-green-600" },
    { key: "costSavings", label: "Cost Savings", value: "60%", valueClass: "text-blue-600" },
    { key: "teamSize", label: "Team Size", value: "6 People", valueClass: "text-brand-purple" },
  ],

  coverImageUrl: "",
  coverImageAlt: "",
  coverFit: "cover",
  coverImagePublicId: "",
  link: "",

  // Detail FK
  cardId: "",
  detailMongoId: "",

  // HERO defaults
  heroBadgeText: "Featured Dedicated Resources Success Story",
  heroTitle: "",
  heroRatingText: "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by Agencies",
  heroDescription: "",
  heroStats: [
    { value: "30+ Months", label: "Ongoing Partnership", iconKey: "TrendingUp" },
    { value: "6 People", label: "Dedicated Team", iconKey: "Users" },
    { value: "60%+", label: "Cost Savings", iconKey: "PiggyBank" },
  ],
  heroPrimaryCtaText: "Get a Dedicated Team",
  heroPrimaryCtaHref: "/contact?service=dedicated-resources",

  heroVideoUrl: "",
  heroVideoPoster: "",
  heroVideoBadgeText: "Partnership Video",

  heroClientName: "",
  heroClientIndustry: "",
  heroClientMeta: { hqText: "", peopleText: "", specialtyText: "", logoUrl: "" },

  // TEAM INVOLVED
  teamTitle: "Team Involved",
  teamSubtitle: "Roles and specialists assigned to this partnership.",
  teamBannerLeftText: "Dedicated Partnership Team",
  teamBannerStatusText: "Active Partnership",
  teamMembers: [{ name: "", role: "", imageUrl: "" }],
  teamStats: [
    { value: "6", label: "Team Size", colorClass: "text-brand-purple" },
    { value: "30+ Months", label: "Duration", colorClass: "text-brand-coral" },
    { value: "150%", label: "Output", colorClass: "text-green-600" },
  ],

  // PARTNERSHIP CHALLENGE
  challengeTitle: "Partnership Challenge",
  challengeBody: "",
  challengeImpactTitle: "Partnership Impact",
  challengeImpactBullets: [{ iconKey: "CheckCircle2", text: "" }],

  prePartnershipTitle: "Pre-Partnership Metrics",
  prePartnershipMetrics: [{ iconKey: "Activity", label: "", value: "" }],

  // EVOLUTION
  evolutionTitle: "Partnership Evolution",
  evolutionSubtitle: "How the collaboration scaled over time.",
  evolutionSteps: [
    {
      order: 1,
      numberText: "1",
      title: "Onboarding",
      subtitle: "Setup processes and tools",
      colorClass: "bg-brand-purple",
      features: [{ iconKey: "CheckCircle2", text: "" }],
    },
  ],

  // SUCCESS FACTORS
  successFactorsTitle: "Success Factors",
  successFactorsSubtitle: "",
  successFactors: [{ iconKey: "Star", title: "", description: "", gradientClass: "from-[#391B66] to-[#E64761]" }],

  // BEFORE/AFTER
  beforeAfterTitle: "Before & After",
  beforeAfterSubtitle: "",
  beforeAfterRows: [{ keyMetric: "Delivery Time", before: "", after: "" }],

  // FEEDBACK
  feedbackTitle: "Client Feedback",
  feedbackSubtitle: "",
  testimonials: [{ quote: "", author: "", role: "", imageUrl: "", rating: 5 }],
  videoTestimonial: { thumbnailUrl: "", title: "", description: "", videoUrl: "" },

  // CTAs
  ctaPrimary: {
    title: "Ready to scale with a dedicated team?",
    body: "",
    primaryButtonText: "Book a Call",
    primaryButtonHref: "/book-appointment",
    secondaryButtonText: "View Pricing",
    secondaryButtonHref: "/pricing-calculator?service=dedicated-resources",
  },
  ctaSecondary: {
    title: "Talk to us",
    body: "",
    emailLabel: "Email",
    emailValue: "info@brandingbeez.co.uk",
    phoneLabel: "Phone",
    phoneValue: "",
    formTitle: "Get a Dedicated Resources Quote",
  },

  seo: {
    metaTitle: "",
    metaDescription: "",
  },

};

function normalizeDetailToForm(detail: DedicatedResourceCaseStudyDetailDoc): Partial<FormState> {
  return {
    detailMongoId: detail?._id || "",
    cardId: detail.cardId,

    heroBadgeText: detail.heroBadgeText || "",
    heroTitle: detail.heroTitle || "",
    heroRatingText: detail.heroRatingText || "",
    heroDescription: detail.heroDescription || "",
    heroStats: Array.isArray(detail.heroStats) ? detail.heroStats : [],
    heroPrimaryCtaText: detail.heroPrimaryCtaText || "",
    heroPrimaryCtaHref: detail.heroPrimaryCtaHref || "",

    heroVideoUrl: detail.heroVideoUrl || "",
    heroVideoPoster: detail.heroVideoPoster || "",
    heroVideoBadgeText: detail.heroVideoBadgeText || "",

    heroClientName: detail.heroClientName || "",
    heroClientIndustry: detail.heroClientIndustry || "",
    heroClientMeta: detail.heroClientMeta || (emptyForm.heroClientMeta as any),

    teamTitle: detail.teamTitle || "",
    teamSubtitle: detail.teamSubtitle || "",
    teamBannerLeftText: detail.teamBannerLeftText || "",
    teamBannerStatusText: detail.teamBannerStatusText || "",
    teamMembers: Array.isArray(detail.teamMembers) ? detail.teamMembers : [],
    teamStats: Array.isArray(detail.teamStats) ? detail.teamStats : [],

    challengeTitle: detail.challengeTitle || "",
    challengeBody: detail.challengeBody || "",
    challengeImpactTitle: detail.challengeImpactTitle || "",
    challengeImpactBullets: Array.isArray(detail.challengeImpactBullets) ? detail.challengeImpactBullets : [],

    prePartnershipTitle: detail.prePartnershipTitle || "",
    prePartnershipMetrics: Array.isArray(detail.prePartnershipMetrics) ? detail.prePartnershipMetrics : [],

    evolutionTitle: detail.evolutionTitle || "",
    evolutionSubtitle: detail.evolutionSubtitle || "",
    evolutionSteps: Array.isArray(detail.evolutionSteps) ? detail.evolutionSteps : [],

    successFactorsTitle: detail.successFactorsTitle || "",
    successFactorsSubtitle: detail.successFactorsSubtitle || "",
    successFactors: Array.isArray(detail.successFactors) ? detail.successFactors : [],

    beforeAfterTitle: detail.beforeAfterTitle || "",
    beforeAfterSubtitle: detail.beforeAfterSubtitle || "",
    beforeAfterRows: Array.isArray(detail.beforeAfterRows) ? detail.beforeAfterRows : [],

    feedbackTitle: detail.feedbackTitle || "",
    feedbackSubtitle: detail.feedbackSubtitle || "",
    testimonials: Array.isArray(detail.testimonials) ? detail.testimonials : [],
    videoTestimonial: detail.videoTestimonial || (emptyForm.videoTestimonial as any),

    ctaPrimary: detail.ctaPrimary || (emptyForm.ctaPrimary as any),
    ctaSecondary: detail.ctaSecondary || (emptyForm.ctaSecondary as any),

    seo: detail.seo || {},
  };
}

export function DedicatedResourceCaseStudiesManager() {
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
  const { data: cards = [], isLoading, error } = useQuery<DedicatedResourceCaseStudyCard[]>({
    queryKey: ["/api/admin/dedicated-resource-case-studies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dedicated-resource-case-studies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch Dedicated Resources case studies");
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
  const fetchDetailByCardId = async (cardId: string): Promise<DedicatedResourceCaseStudyDetailDoc | null> => {
    if (!token) throw new Error("Admin token missing. Please login again.");
    if (!cardId) return null;

    const endpoints = [
      `/api/admin/dedicated-resource-case-study/detail/${cardId}`,
      `/api/admin/dedicated-resource-case-study/detail?cardId=${encodeURIComponent(cardId)}`,
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
        return data as DedicatedResourceCaseStudyDetailDoc;
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

      const results = Array.isArray(form.results) ? form.results : [];
      if (results.length < 1) throw new Error("At least 1 KPI result is required");

      const payload = {
        slug,
        title: String(form.title || "").trim(),
        client: String(form.client || "").trim(),
        industry: String(form.industry || "").trim(),
        description: String(form.description || "").trim(),

        badgeText: form.badgeText ? String(form.badgeText).trim() : undefined,
        badgeClass: form.badgeClass ? String(form.badgeClass).trim() : undefined,

        logoUrl: form.logoUrl || undefined,
        logoAlt: form.logoAlt || undefined,

        categoryLabel: form.categoryLabel ? String(form.categoryLabel).trim() : undefined,
        categoryClass: form.categoryClass ? String(form.categoryClass).trim() : undefined,

        results: results.map((r: any) => ({
          key: String(r.key || "").trim(),
          label: String(r.label || "").trim(),
          value: String(r.value || "").trim(),
          valueClass: r.valueClass ? String(r.valueClass).trim() : undefined,
        })),

        coverImageUrl: form.coverImageUrl || undefined,
        coverImageAlt: form.coverImageAlt || undefined,
        coverFit: (form.coverFit || "cover") as "contain" | "cover",
        coverImagePublicId: form.coverImagePublicId || undefined,

        link: form.link || undefined,
      };

      const url = editingSlug
        ? `/api/admin/dedicated-resource-case-study/card/${encodeURIComponent(slug)}`
        : "/api/admin/dedicated-resource-case-study/card";
      const method = editingSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to save card");

      const mongoId = data?._id || form.cardMongoId || form.cardId;
      if (mongoId) setForm((p) => ({ ...p, cardMongoId: mongoId, cardId: mongoId }));

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/dedicated-resource-case-studies"] });
      if (!editingSlug) setEditingSlug(slug);

      success("Card saved successfully.", "Card");

      // ✅ CLOSE POPUP AFTER SUCCESS
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

      const required: Array<[keyof DedicatedResourceCaseStudyDetail, string]> = [
        ["heroBadgeText", "Hero Badge Text is required"],
        ["heroTitle", "Hero Title is required"],
        ["heroDescription", "Hero Description is required"],
        ["heroPrimaryCtaText", "Hero Primary CTA Text is required"],

        ["teamTitle", "Team Title is required"],
        ["challengeTitle", "Challenge Title is required"],
        ["evolutionTitle", "Evolution Title is required"],
        ["successFactorsTitle", "Success Factors Title is required"],
        ["beforeAfterTitle", "Before/After Title is required"],
        ["feedbackTitle", "Feedback Title is required"],
      ];

      for (const [key, msg] of required) {
        const v = (form as any)[key];
        if (typeof v !== "string" || !String(v).trim()) throw new Error(msg);
      }

      const payload: DedicatedResourceCaseStudyDetail = {
        cardId: finalCardId,

        heroBadgeText: String(form.heroBadgeText || "").trim(),
        heroTitle: String(form.heroTitle || "").trim(),
        heroRatingText: form.heroRatingText ? String(form.heroRatingText).trim() : undefined,
        heroDescription: String(form.heroDescription || "").trim(),
        heroStats: (form.heroStats || []) as any,
        heroPrimaryCtaText: String(form.heroPrimaryCtaText || "").trim(),
        heroPrimaryCtaHref: form.heroPrimaryCtaHref || undefined,

        heroVideoUrl: form.heroVideoUrl || undefined,
        heroVideoPoster: form.heroVideoPoster || undefined,
        heroVideoBadgeText: form.heroVideoBadgeText || undefined,

        heroClientName: String(form.heroClientName || "").trim(),
        heroClientIndustry: String(form.heroClientIndustry || "").trim(),
        heroClientMeta: (form.heroClientMeta || emptyForm.heroClientMeta) as any,

        teamTitle: String(form.teamTitle || "").trim(),
        teamSubtitle: String(form.teamSubtitle || "").trim(),
        teamBannerLeftText: String(form.teamBannerLeftText || "").trim(),
        teamBannerStatusText: String(form.teamBannerStatusText || "").trim(),
        teamMembers: (form.teamMembers || []) as any,
        teamStats: (form.teamStats || []) as any,

        challengeTitle: String(form.challengeTitle || "").trim(),
        challengeBody: String(form.challengeBody || "").trim(),
        challengeImpactTitle: String(form.challengeImpactTitle || "").trim(),
        challengeImpactBullets: (form.challengeImpactBullets || []) as any,

        prePartnershipTitle: String(form.prePartnershipTitle || "").trim(),
        prePartnershipMetrics: (form.prePartnershipMetrics || []) as any,

        evolutionTitle: String(form.evolutionTitle || "").trim(),
        evolutionSubtitle: String(form.evolutionSubtitle || "").trim(),
        evolutionSteps: (form.evolutionSteps || []) as any,

        successFactorsTitle: String(form.successFactorsTitle || "").trim(),
        successFactorsSubtitle: String(form.successFactorsSubtitle || "").trim(),
        successFactors: (form.successFactors || []) as any,

        beforeAfterTitle: String(form.beforeAfterTitle || "").trim(),
        beforeAfterSubtitle: String(form.beforeAfterSubtitle || "").trim(),
        beforeAfterRows: (form.beforeAfterRows || []) as any,

        feedbackTitle: String(form.feedbackTitle || "").trim(),
        feedbackSubtitle: String(form.feedbackSubtitle || "").trim(),
        testimonials: (form.testimonials || []) as any,
        videoTestimonial: (form.videoTestimonial || undefined) as any,

        ctaPrimary: (form.ctaPrimary || emptyForm.ctaPrimary) as any,
        ctaSecondary: (form.ctaSecondary || emptyForm.ctaSecondary) as any,

        seo:
          form.seo?.metaTitle || form.seo?.metaDescription
            ? {
              metaTitle: String(form.seo?.metaTitle || "").trim(),
              metaDescription: String(form.seo?.metaDescription || "").trim(),
            }
            : undefined,
      };

      const isEdit = Boolean(String(form.detailMongoId || "").trim());
      const endpoints = isEdit
        ? [
          `/api/admin/dedicated-resource-case-study/detail?detailId=${encodeURIComponent(String(form.detailMongoId))}`,
          `/api/admin/dedicated-resource-case-study/detail/${encodeURIComponent(String(form.detailMongoId))}`,
        ]
        : ["/api/admin/dedicated-resource-case-study/detail"];

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
        } catch { }
      }

      success(isEdit ? "Detail updated successfully." : "Detail saved successfully.", "Detail");

      // ✅ CLOSE POPUP AFTER SUCCESS
      closeDialog();
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to save detail.", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this Dedicated Resources case study?")) return;

    try {
      const res = await fetch(`/api/admin/dedicated-resource-case-study/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to delete");

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/dedicated-resource-case-studies"] });
      success("Dedicated Resources case study deleted.", "Deleted");
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
          badgeText: p.badgeText || "",
          badgeClass: p.badgeClass || "",
          logoUrl: p.logoUrl || "",
          logoAlt: p.logoAlt || "",
          categoryLabel: p.categoryLabel || "",
          categoryClass: p.categoryClass || "",
          results: (p.results as any) || [],
          coverImageUrl: p.coverImageUrl || "",
          coverImageAlt: p.coverImageAlt || "",
          coverFit: (p.coverFit || "cover") as any,
          coverImagePublicId: p.coverImagePublicId || "",
          link: p.link || "",

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
        <h2 className="text-2xl font-bold text-brand-purple">Dedicated Resources Case Studies</h2>
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
            <CardContent className="p-6 text-red-600">Failed to load Dedicated Resources case studies</CardContent>
          </Card>
        ) : cards.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-gray-600">No Dedicated Resources case studies yet.</CardContent>
          </Card>
        ) : (
          cards.map((it: any) => (
            <Card key={it._id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {it.coverImageUrl ? (
                    <img
                      src={it.coverImageUrl}
                      alt={it.coverImageAlt || it.title}
                      className={`w-full h-full ${(it.coverFit || "cover") === "cover" ? "object-cover" : "object-contain"}`}
                    />
                  ) : it.logoUrl ? (
                    <img src={it.logoUrl} alt={it.logoAlt || it.title} className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-xs text-gray-400">No Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-brand-purple">{it.title}</div>
                    {it.categoryLabel ? <Badge variant="secondary">{it.categoryLabel}</Badge> : null}
                  </div>

                  <div className="text-sm text-gray-600">
                    /dedicated-resources/{it.slug} • {it.client}
                  </div>

                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{it.description}</div>

                  <div className="text-xs text-gray-500 mt-1">
                    {(it.results || [])
                      .slice(0, 3)
                      .map((r: any) => `${r.label}: ${r.value}`)
                      .join(" • ")}
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
            <DialogTitle>{editingSlug ? "Edit Dedicated Resources Case Study" : "Add Dedicated Resources Case Study"}</DialogTitle>
          </DialogHeader>

          {detailLoading ? <div className="text-sm text-gray-600 mb-2">Loading detail data...</div> : null}

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
                  placeholder="social-land"
                  required
                />
              </div>

              <div>
                <RequiredLabel>Card Title (Grid)</RequiredLabel>
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
                  placeholder="Social Land"
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
                <DedicatedResourceCaseStudyCardTab
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
                <DedicatedResourceCaseStudyDetailTab
                  form={form}
                  onChange={(field, value) => {
                    if (field === "cardId") {
                      handleDetailCardSelect(String(value || ""));
                      return;
                    }
                    handleChange(field as any, value);
                  }}
                  cardOptions={cardOptions}
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
