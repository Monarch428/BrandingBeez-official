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

import { WebCaseStudyCardTab } from "./WebCaseStudyCardTab";
import {
  WebCaseStudyDetailTab,
  WebHeroStat,
  WebShowcase,
  WebChallengePoint,
  WebBeforeAfterBlock,
  WebOverviewColumn,
  WebStrategyColumn,
  WebFeatureItem,
  WebEvaluationCard,
  WebTestimonial,
  WebPartnershipMetric,
  WebCtaBlock,
} from "./WebCaseStudyDetailTab";

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
export type WebCaseStudyCardResults = {
  performance: string;
  conversions: string;
  users: string;
};

export type WebCaseStudyCard = {
  _id: string; // Mongo id (FK for detail)
  id: number;  // numeric sequence (if you keep it)
  slug: string;

  title: string;
  client: string;
  industry: string;

  description: string;

  // ✅ matches your current UI (results.performance / conversions / users)
  results: WebCaseStudyCardResults;

  // ✅ image shown on card
  imageUrl?: string;
  imageAlt?: string;
  imageFit?: "contain" | "cover";

  // optional
  imagePublicId?: string;

  // optional (FE can build from slug too)
  link?: string;

  createdAt: string;
  updatedAt: string;
};

export type WebCaseStudyDetail = {
  cardId: string;

  heroBadgeText: string;
  heroTitle: string;
  heroRatingText?: string;
  heroDescription: string;
  heroStats: WebHeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  showcase: WebShowcase;

  ctaTop: WebCtaBlock;

  challengeTitle: string;
  challengeSubtitle: string;
  challengePoints: WebChallengePoint[];
  beforeAfter: WebBeforeAfterBlock;

  overviewTitle: string;
  overviewSubtitle?: string;
  overviewColumns: WebOverviewColumn[];

  strategyTitle: string;
  strategySubtitle?: string;
  strategyColumns: WebStrategyColumn[];

  featuresTitle: string;
  featuresSubtitle?: string;
  coreFeaturesTitle?: string;
  coreFeatures: WebFeatureItem[];
  technicalExcellenceTitle?: string;
  technicalExcellence: WebFeatureItem[];

  ctaMid: WebCtaBlock;

  evaluationKicker?: string;
  evaluationTitle: string;
  evaluationCards: WebEvaluationCard[];

  feedbackKicker?: string;
  testimonial: WebTestimonial;
  partnershipMetricsTitle?: string;
  partnershipMetrics: WebPartnershipMetric[];
  feedbackPrimaryCtaText?: string;
  feedbackPrimaryCtaHref?: string;

  finalCta: WebCtaBlock;

  createdAt?: string;
  updatedAt?: string;
};

type WebCaseStudyDetailDoc = WebCaseStudyDetail & { _id?: string };

type FormState = Partial<WebCaseStudyCard> &
  Partial<WebCaseStudyDetailDoc> & {
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
  results: { performance: "", conversions: "", users: "" },
  imageUrl: "",
  imageAlt: "",
  imageFit: "cover",
  imagePublicId: "",
  link: "",

  // Detail FK
  cardId: "",
  detailMongoId: "",

  // Detail defaults (web case study style)
  heroBadgeText: "Featured Website Success Story",
  heroTitle: "",
  heroRatingText: "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by Agencies",
  heroDescription: "",
  heroStats: [
    { value: "", label: "", iconKey: "CheckCircle2" },
    { value: "", label: "", iconKey: "TrendingUp" },
    { value: "", label: "", iconKey: "Target" },
  ],
  heroPrimaryCtaText: "Get a Free Consultation",
  heroPrimaryCtaHref: "/contact?service=website-development",
  heroSecondaryCtaText: "View Portfolio",
  heroSecondaryCtaHref: "/portfolio",
  heroVideoUrl: "",
  heroVideoPoster: "",
  heroVideoBadgeText: "Project Video",

  showcase: {
    title: "Website Showcase",
    subtitle: "",
    body: "",
    liveUrl: "",
    liveButtonText: "View Live Website",
    desktopImageUrl: "",
    desktopImageAlt: "",
    mobileImageUrl: "",
    mobileImageAlt: "",
  },

  ctaTop: {
    title: "Want a Website Like This?",
    body: "",
    primaryText: "Book a Call",
    primaryHref: "/contact?service=website-development",
    secondaryText: "Get Pricing",
    secondaryHref: "/pricing-calculator?service=website-development",
  },

  challengeTitle: "The Challenge",
  challengeSubtitle: "",
  challengePoints: [{ iconKey: "XCircle", text: "" }],
  beforeAfter: {
    beforeTitle: "Before",
    afterTitle: "After",
    beforeItems: [{ label: "", value: "" }],
    afterItems: [{ label: "", value: "" }],
  },

  overviewTitle: "Project Overview",
  overviewSubtitle: "",
  overviewColumns: [
    {
      iconKey: "Building2",
      title: "Client Profile",
      dotColorClass: "bg-brand-coral",
      bullets: [{ iconKey: "CheckCircle2", text: "" }],
    },
    {
      iconKey: "Target",
      title: "Project Goals",
      dotColorClass: "bg-brand-purple",
      bullets: [{ iconKey: "CheckCircle2", text: "" }],
    },
    {
      iconKey: "Handshake",
      title: "Partnership Impact",
      dotColorClass: "bg-green-600",
      bullets: [{ iconKey: "CheckCircle2", text: "" }],
    },
  ],

  strategyTitle: "Website Development Strategy",
  strategySubtitle: "",
  strategyColumns: [
    { order: 1, title: "Professional Design", tagText: "Visual Excellence", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
    { order: 2, title: "Service Showcase", tagText: "Content Strategy", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
    { order: 3, title: "Lead Capture System", tagText: "Lead Generation", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
  ],

  featuresTitle: "Website Features",
  featuresSubtitle: "",
  coreFeaturesTitle: "Core Features",
  coreFeatures: [{ iconKey: "Palette", title: "", description: "", color: "#ee4962" }],
  technicalExcellenceTitle: "Technical Excellence",
  technicalExcellence: [{ iconKey: "Code", title: "", description: "", color: "#321a66" }],

  ctaMid: {
    title: "Ready to Build Yours?",
    body: "",
    primaryText: "Start Your Project",
    primaryHref: "/contact?service=website-development",
    secondaryText: "View Case Studies",
    secondaryHref: "/case-studies",
  },

  evaluationKicker: "What makes this partnership successful?",
  evaluationTitle: "Partnership Evaluation",
  evaluationCards: [{ iconKey: "CheckCircle2", title: "", description: "" }],

  feedbackKicker: "What Our Clients Say",
  testimonial: { quote: "", authorName: "", authorRole: "", ratingText: "⭐⭐⭐⭐⭐" },
  partnershipMetricsTitle: "Partnership Metrics",
  partnershipMetrics: [{ iconKey: "Users", label: "", value: "" }],
  feedbackPrimaryCtaText: "Work With Us",
  feedbackPrimaryCtaHref: "/contact?service=website-development",

  finalCta: {
    title: "Let’s Build Something Great",
    body: "",
    primaryText: "Book a Call",
    primaryHref: "/contact?service=website-development",
    secondaryText: "See Portfolio",
    secondaryHref: "/portfolio",
  },
};

function normalizeDetailToForm(detail: WebCaseStudyDetailDoc): Partial<FormState> {
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
    heroSecondaryCtaText: detail.heroSecondaryCtaText || "",
    heroSecondaryCtaHref: detail.heroSecondaryCtaHref || "",

    heroVideoUrl: detail.heroVideoUrl || "",
    heroVideoPoster: detail.heroVideoPoster || "",
    heroVideoBadgeText: detail.heroVideoBadgeText || "",

    showcase: detail.showcase || (emptyForm.showcase as any),

    ctaTop: detail.ctaTop || (emptyForm.ctaTop as any),

    challengeTitle: detail.challengeTitle || "",
    challengeSubtitle: detail.challengeSubtitle || "",
    challengePoints: Array.isArray(detail.challengePoints) ? detail.challengePoints : [],
    beforeAfter: detail.beforeAfter || (emptyForm.beforeAfter as any),

    overviewTitle: detail.overviewTitle || "",
    overviewSubtitle: detail.overviewSubtitle || "",
    overviewColumns: Array.isArray(detail.overviewColumns) ? detail.overviewColumns : [],

    strategyTitle: detail.strategyTitle || "",
    strategySubtitle: detail.strategySubtitle || "",
    strategyColumns: Array.isArray(detail.strategyColumns) ? detail.strategyColumns : [],

    featuresTitle: detail.featuresTitle || "",
    featuresSubtitle: detail.featuresSubtitle || "",
    coreFeaturesTitle: detail.coreFeaturesTitle || "",
    coreFeatures: Array.isArray(detail.coreFeatures) ? detail.coreFeatures : [],
    technicalExcellenceTitle: detail.technicalExcellenceTitle || "",
    technicalExcellence: Array.isArray(detail.technicalExcellence) ? detail.technicalExcellence : [],

    ctaMid: detail.ctaMid || (emptyForm.ctaMid as any),

    evaluationKicker: detail.evaluationKicker || "",
    evaluationTitle: detail.evaluationTitle || "",
    evaluationCards: Array.isArray(detail.evaluationCards) ? detail.evaluationCards : [],

    feedbackKicker: detail.feedbackKicker || "",
    testimonial: detail.testimonial || (emptyForm.testimonial as any),
    partnershipMetricsTitle: detail.partnershipMetricsTitle || "",
    partnershipMetrics: Array.isArray(detail.partnershipMetrics) ? detail.partnershipMetrics : [],
    feedbackPrimaryCtaText: detail.feedbackPrimaryCtaText || "",
    feedbackPrimaryCtaHref: detail.feedbackPrimaryCtaHref || "",

    finalCta: detail.finalCta || (emptyForm.finalCta as any),
  };
}

export function WebCaseStudiesManager() {
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
  const { data: cards = [], isLoading, error } = useQuery<WebCaseStudyCard[]>({
    queryKey: ["/api/admin/web-case-studies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/web-case-studies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch Web case studies");
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
  const fetchDetailByCardId = async (cardId: string): Promise<WebCaseStudyDetailDoc | null> => {
    if (!token) throw new Error("Admin token missing. Please login again.");
    if (!cardId) return null;

    const endpoints = [
      `/api/admin/web-case-study/detail/${cardId}`,
      `/api/admin/web-case-study/detail?cardId=${encodeURIComponent(cardId)}`,
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
        return data as WebCaseStudyDetailDoc;
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

      const r = form.results as any;
      if (!r?.performance || !r?.conversions || !r?.users) {
        throw new Error("Results fields are required (performance, conversions, users).");
      }

      const payload = {
        slug,
        title: String(form.title || "").trim(),
        client: String(form.client || "").trim(),
        industry: String(form.industry || "").trim(),
        description: String(form.description || "").trim(),

        results: {
          performance: String(r.performance || "").trim(),
          conversions: String(r.conversions || "").trim(),
          users: String(r.users || "").trim(),
        },

        imageUrl: form.imageUrl || undefined,
        imageAlt: form.imageAlt || undefined,
        imageFit: (form.imageFit || "cover") as "contain" | "cover",
        imagePublicId: form.imagePublicId || undefined,

        link: form.link || undefined,
      };

      const url = editingSlug
        ? `/api/admin/web-case-study/card/${encodeURIComponent(slug)}`
        : "/api/admin/web-case-study/card";
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

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/web-case-studies"] });
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

      // minimal required checks (you can add more later)
      const required: Array<[keyof WebCaseStudyDetail, string]> = [
        ["heroBadgeText", "Hero Badge Text is required"],
        ["heroTitle", "Hero Title is required"],
        ["heroDescription", "Hero Description is required"],
        ["heroPrimaryCtaText", "Hero Primary CTA Text is required"],
        ["challengeTitle", "Challenge Title is required"],
        ["challengeSubtitle", "Challenge Subtitle is required"],
        ["overviewTitle", "Overview Title is required"],
        ["strategyTitle", "Strategy Title is required"],
        ["featuresTitle", "Features Title is required"],
        ["evaluationTitle", "Evaluation Title is required"],
      ];

      for (const [key, msg] of required) {
        const v = (form as any)[key];
        if (typeof v !== "string" || !String(v).trim()) throw new Error(msg);
      }

      const payload: WebCaseStudyDetail = {
        cardId: finalCardId,

        heroBadgeText: String(form.heroBadgeText || "").trim(),
        heroTitle: String(form.heroTitle || "").trim(),
        heroRatingText: form.heroRatingText ? String(form.heroRatingText).trim() : undefined,
        heroDescription: String(form.heroDescription || "").trim(),
        heroStats: (form.heroStats || []) as any,
        heroPrimaryCtaText: String(form.heroPrimaryCtaText || "").trim(),
        heroPrimaryCtaHref: form.heroPrimaryCtaHref || undefined,
        heroSecondaryCtaText: form.heroSecondaryCtaText || undefined,
        heroSecondaryCtaHref: form.heroSecondaryCtaHref || undefined,

        heroVideoUrl: form.heroVideoUrl || undefined,
        heroVideoPoster: form.heroVideoPoster || undefined,
        heroVideoBadgeText: form.heroVideoBadgeText || undefined,

        showcase: (form.showcase || emptyForm.showcase) as any,
        ctaTop: (form.ctaTop || emptyForm.ctaTop) as any,

        challengeTitle: String(form.challengeTitle || "").trim(),
        challengeSubtitle: String(form.challengeSubtitle || "").trim(),
        challengePoints: (form.challengePoints || []) as any,
        beforeAfter: (form.beforeAfter || emptyForm.beforeAfter) as any,

        overviewTitle: String(form.overviewTitle || "").trim(),
        overviewSubtitle: form.overviewSubtitle || undefined,
        overviewColumns: (form.overviewColumns || []) as any,

        strategyTitle: String(form.strategyTitle || "").trim(),
        strategySubtitle: form.strategySubtitle || undefined,
        strategyColumns: (form.strategyColumns || []) as any,

        featuresTitle: String(form.featuresTitle || "").trim(),
        featuresSubtitle: form.featuresSubtitle || undefined,
        coreFeaturesTitle: form.coreFeaturesTitle || undefined,
        coreFeatures: (form.coreFeatures || []) as any,
        technicalExcellenceTitle: form.technicalExcellenceTitle || undefined,
        technicalExcellence: (form.technicalExcellence || []) as any,

        ctaMid: (form.ctaMid || emptyForm.ctaMid) as any,

        evaluationKicker: form.evaluationKicker || undefined,
        evaluationTitle: String(form.evaluationTitle || "").trim(),
        evaluationCards: (form.evaluationCards || []) as any,

        feedbackKicker: form.feedbackKicker || undefined,
        testimonial: (form.testimonial || emptyForm.testimonial) as any,
        partnershipMetricsTitle: form.partnershipMetricsTitle || undefined,
        partnershipMetrics: (form.partnershipMetrics || []) as any,
        feedbackPrimaryCtaText: form.feedbackPrimaryCtaText || undefined,
        feedbackPrimaryCtaHref: form.feedbackPrimaryCtaHref || undefined,

        finalCta: (form.finalCta || emptyForm.finalCta) as any,
      };

      const isEdit = Boolean(String(form.detailMongoId || "").trim());
      const endpoints = isEdit
        ? [
            `/api/admin/web-case-study/detail/${encodeURIComponent(String(form.detailMongoId))}`,
            `/api/admin/web-case-study/detail?detailId=${encodeURIComponent(String(form.detailMongoId))}`,
          ]
        : ["/api/admin/web-case-study/detail"];

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
    if (!confirm("Delete this Web case study?")) return;

    try {
      const res = await fetch(`/api/admin/web-case-study/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to delete");

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/web-case-studies"] });
      success("Web case study deleted.", "Deleted");
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
          results: p.results || { performance: "", conversions: "", users: "" },
          imageUrl: p.imageUrl || "",
          imageAlt: p.imageAlt || "",
          imageFit: (p.imageFit || "cover") as any,
          imagePublicId: p.imagePublicId || "",
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
        <h2 className="text-2xl font-bold text-brand-purple">Website Design & Development Case Studies</h2>
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
          <Card><CardContent className="p-6 text-red-600">Failed to load Web case studies</CardContent></Card>
        ) : cards.length === 0 ? (
          <Card><CardContent className="p-6 text-gray-600">No Web case studies yet.</CardContent></Card>
        ) : (
          cards.map((it: any) => (
            <Card key={it._id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {it.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it.imageAlt || it.title}
                      className={`w-full h-full ${(it.imageFit || "cover") === "cover" ? "object-cover" : "object-contain"}`}
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
                    /case-studies/{it.slug} • {it.client}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    Performance: {it?.results?.performance} • Conversions: {it?.results?.conversions} • Scale: {it?.results?.users}
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
              {editingSlug ? "Edit Web Case Study" : "Add Web Case Study"}
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
                  placeholder="socialland-website"
                  required
                />
              </div>

              <div>
                <ReqLabel>Card Title (Web Grid)</ReqLabel>
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
                  placeholder="UK White-Label Partnership Success"
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
                <WebCaseStudyCardTab
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
                <WebCaseStudyDetailTab
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
