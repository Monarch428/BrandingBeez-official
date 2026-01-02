// import React, { useMemo, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useAppToast } from "@/components/ui/toaster";

// import { WebCaseStudyCardTab } from "./WebCaseStudyCardTab";
// import {
//   WebCaseStudyDetailTab,
//   WebHeroStat,
//   WebShowcase,
//   WebChallengePoint,
//   WebBeforeAfterBlock,
//   WebOverviewColumn,
//   WebStrategyColumn,
//   WebFeatureItem,
//   WebEvaluationCard,
//   WebTestimonial,
//   WebPartnershipMetric,
//   WebCtaBlock,
// } from "./WebCaseStudyDetailTab";

// // ---------- Helper ----------
// const slugifyTitle = (title: string) =>
//   title
//     .toLowerCase()
//     .trim()
//     .replace(/[\s_]+/g, "-")
//     .replace(/[^a-z0-9-]/g, "")
//     .replace(/-+/g, "-")
//     .replace(/^-|-$/g, "");

// // ✅ Required label helper (adds *)
// function ReqLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <Label>
//       {children} <span className="text-red-500">*</span>
//     </Label>
//   );
// }

// // ---------- Types ----------
// export type WebCaseStudyCardResults = {
//   performance: string;
//   conversions: string;
//   users: string;
// };

// export type WebCaseStudyCard = {
//   _id: string; // Mongo id (FK for detail)
//   id: number;  // numeric sequence (if you keep it)
//   slug: string;

//   title: string;
//   client: string;
//   industry: string;

//   description: string;

//   // ✅ matches your current UI (results.performance / conversions / users)
//   results: WebCaseStudyCardResults;

//   // ✅ image shown on card
//   imageUrl?: string;
//   imageAlt?: string;
//   imageFit?: "contain" | "cover";

//   // optional
//   imagePublicId?: string;

//   // optional (FE can build from slug too)
//   link?: string;

//   createdAt: string;
//   updatedAt: string;
// };

// export type WebCaseStudyDetail = {
//   cardId: string;

//   heroBadgeText: string;
//   heroTitle: string;
//   heroRatingText?: string;
//   heroDescription: string;
//   heroStats: WebHeroStat[];
//   heroPrimaryCtaText: string;
//   heroPrimaryCtaHref?: string;
//   heroSecondaryCtaText?: string;
//   heroSecondaryCtaHref?: string;

//   heroVideoUrl?: string;
//   heroVideoPoster?: string;
//   heroVideoBadgeText?: string;

//   showcase: WebShowcase;

//   ctaTop: WebCtaBlock;

//   challengeTitle: string;
//   challengeSubtitle: string;
//   challengePoints: WebChallengePoint[];
//   beforeAfter: WebBeforeAfterBlock;

//   overviewTitle: string;
//   overviewSubtitle?: string;
//   overviewColumns: WebOverviewColumn[];

//   strategyTitle: string;
//   strategySubtitle?: string;
//   strategyColumns: WebStrategyColumn[];

//   featuresTitle: string;
//   featuresSubtitle?: string;
//   coreFeaturesTitle?: string;
//   coreFeatures: WebFeatureItem[];
//   technicalExcellenceTitle?: string;
//   technicalExcellence: WebFeatureItem[];

//   ctaMid: WebCtaBlock;

//   evaluationKicker?: string;
//   evaluationTitle: string;
//   evaluationCards: WebEvaluationCard[];

//   feedbackKicker?: string;
//   testimonial: WebTestimonial;
//   partnershipMetricsTitle?: string;
//   partnershipMetrics: WebPartnershipMetric[];
//   feedbackPrimaryCtaText?: string;
//   feedbackPrimaryCtaHref?: string;

//   finalCta: WebCtaBlock;

//   createdAt?: string;
//   updatedAt?: string;
// };

// type WebCaseStudyDetailDoc = WebCaseStudyDetail & { _id?: string };

// type FormState = Partial<WebCaseStudyCard> &
//   Partial<WebCaseStudyDetailDoc> & {
//     cardMongoId?: string;
//     detailMongoId?: string;
//   };

// // ✅ DEFAULTS (admin sees defaults but can edit)
// const emptyForm: FormState = {
//   // Card
//   slug: "",
//   title: "",
//   client: "",
//   industry: "",
//   description: "",
//   results: { performance: "", conversions: "", users: "" },
//   imageUrl: "",
//   imageAlt: "",
//   imageFit: "cover",
//   imagePublicId: "",
//   link: "",

//   // Detail FK
//   cardId: "",
//   detailMongoId: "",

//   // Detail defaults (web case study style)
//   heroBadgeText: "Featured Website Success Story",
//   heroTitle: "",
//   heroRatingText: "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by Agencies",
//   heroDescription: "",
//   heroStats: [
//     { value: "", label: "", iconKey: "CheckCircle2" },
//     { value: "", label: "", iconKey: "TrendingUp" },
//     { value: "", label: "", iconKey: "Target" },
//   ],
//   heroPrimaryCtaText: "Get a Free Consultation",
//   heroPrimaryCtaHref: "/contact?service=website-development",
//   heroSecondaryCtaText: "View Portfolio",
//   heroSecondaryCtaHref: "/portfolio",
//   heroVideoUrl: "",
//   heroVideoPoster: "",
//   heroVideoBadgeText: "Project Video",

//   showcase: {
//     title: "Website Showcase",
//     subtitle: "",
//     body: "",
//     liveUrl: "",
//     liveButtonText: "View Live Website",
//     desktopImageUrl: "",
//     desktopImageAlt: "",
//     mobileImageUrl: "",
//     mobileImageAlt: "",
//   },

//   ctaTop: {
//     title: "Want a Website Like This?",
//     body: "",
//     primaryText: "Book a Call",
//     primaryHref: "/contact?service=website-development",
//     secondaryText: "Get Pricing",
//     secondaryHref: "/pricing-calculator?service=website-development",
//   },

//   challengeTitle: "The Challenge",
//   challengeSubtitle: "",
//   challengePoints: [{ iconKey: "XCircle", text: "" }],
//   beforeAfter: {
//     beforeTitle: "Before",
//     afterTitle: "After",
//     beforeItems: [{ label: "", value: "" }],
//     afterItems: [{ label: "", value: "" }],
//   },

//   overviewTitle: "Project Overview",
//   overviewSubtitle: "",
//   overviewColumns: [
//     {
//       iconKey: "Building2",
//       title: "Client Profile",
//       dotColorClass: "bg-brand-coral",
//       bullets: [{ iconKey: "CheckCircle2", text: "" }],
//     },
//     {
//       iconKey: "Target",
//       title: "Project Goals",
//       dotColorClass: "bg-brand-purple",
//       bullets: [{ iconKey: "CheckCircle2", text: "" }],
//     },
//     {
//       iconKey: "Handshake",
//       title: "Partnership Impact",
//       dotColorClass: "bg-green-600",
//       bullets: [{ iconKey: "CheckCircle2", text: "" }],
//     },
//   ],

//   strategyTitle: "Website Development Strategy",
//   strategySubtitle: "",
//   strategyColumns: [
//     { order: 1, title: "Professional Design", tagText: "Visual Excellence", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
//     { order: 2, title: "Service Showcase", tagText: "Content Strategy", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
//     { order: 3, title: "Lead Capture System", tagText: "Lead Generation", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
//   ],

//   featuresTitle: "Website Features",
//   featuresSubtitle: "",
//   coreFeaturesTitle: "Core Features",
//   coreFeatures: [{ iconKey: "Palette", title: "", description: "", color: "#ee4962" }],
//   technicalExcellenceTitle: "Technical Excellence",
//   technicalExcellence: [{ iconKey: "Code", title: "", description: "", color: "#321a66" }],

//   ctaMid: {
//     title: "Ready to Build Yours?",
//     body: "",
//     primaryText: "Start Your Project",
//     primaryHref: "/contact?service=website-development",
//     secondaryText: "View Case Studies",
//     secondaryHref: "/case-studies",
//   },

//   evaluationKicker: "What makes this partnership successful?",
//   evaluationTitle: "Partnership Evaluation",
//   evaluationCards: [{ iconKey: "CheckCircle2", title: "", description: "" }],

//   feedbackKicker: "What Our Clients Say",
//   testimonial: { quote: "", authorName: "", authorRole: "", ratingText: "⭐⭐⭐⭐⭐" },
//   partnershipMetricsTitle: "Partnership Metrics",
//   partnershipMetrics: [{ iconKey: "Users", label: "", value: "" }],
//   feedbackPrimaryCtaText: "Work With Us",
//   feedbackPrimaryCtaHref: "/contact?service=website-development",

//   finalCta: {
//     title: "Let’s Build Something Great",
//     body: "",
//     primaryText: "Book a Call",
//     primaryHref: "/contact?service=website-development",
//     secondaryText: "See Portfolio",
//     secondaryHref: "/portfolio",
//   },
// };

// function normalizeDetailToForm(detail: WebCaseStudyDetailDoc): Partial<FormState> {
//   return {
//     detailMongoId: detail?._id || "",
//     cardId: detail.cardId,

//     heroBadgeText: detail.heroBadgeText || "",
//     heroTitle: detail.heroTitle || "",
//     heroRatingText: detail.heroRatingText || "",
//     heroDescription: detail.heroDescription || "",
//     heroStats: Array.isArray(detail.heroStats) ? detail.heroStats : [],
//     heroPrimaryCtaText: detail.heroPrimaryCtaText || "",
//     heroPrimaryCtaHref: detail.heroPrimaryCtaHref || "",
//     heroSecondaryCtaText: detail.heroSecondaryCtaText || "",
//     heroSecondaryCtaHref: detail.heroSecondaryCtaHref || "",

//     heroVideoUrl: detail.heroVideoUrl || "",
//     heroVideoPoster: detail.heroVideoPoster || "",
//     heroVideoBadgeText: detail.heroVideoBadgeText || "",

//     showcase: detail.showcase || (emptyForm.showcase as any),

//     ctaTop: detail.ctaTop || (emptyForm.ctaTop as any),

//     challengeTitle: detail.challengeTitle || "",
//     challengeSubtitle: detail.challengeSubtitle || "",
//     challengePoints: Array.isArray(detail.challengePoints) ? detail.challengePoints : [],
//     beforeAfter: detail.beforeAfter || (emptyForm.beforeAfter as any),

//     overviewTitle: detail.overviewTitle || "",
//     overviewSubtitle: detail.overviewSubtitle || "",
//     overviewColumns: Array.isArray(detail.overviewColumns) ? detail.overviewColumns : [],

//     strategyTitle: detail.strategyTitle || "",
//     strategySubtitle: detail.strategySubtitle || "",
//     strategyColumns: Array.isArray(detail.strategyColumns) ? detail.strategyColumns : [],

//     featuresTitle: detail.featuresTitle || "",
//     featuresSubtitle: detail.featuresSubtitle || "",
//     coreFeaturesTitle: detail.coreFeaturesTitle || "",
//     coreFeatures: Array.isArray(detail.coreFeatures) ? detail.coreFeatures : [],
//     technicalExcellenceTitle: detail.technicalExcellenceTitle || "",
//     technicalExcellence: Array.isArray(detail.technicalExcellence) ? detail.technicalExcellence : [],

//     ctaMid: detail.ctaMid || (emptyForm.ctaMid as any),

//     evaluationKicker: detail.evaluationKicker || "",
//     evaluationTitle: detail.evaluationTitle || "",
//     evaluationCards: Array.isArray(detail.evaluationCards) ? detail.evaluationCards : [],

//     feedbackKicker: detail.feedbackKicker || "",
//     testimonial: detail.testimonial || (emptyForm.testimonial as any),
//     partnershipMetricsTitle: detail.partnershipMetricsTitle || "",
//     partnershipMetrics: Array.isArray(detail.partnershipMetrics) ? detail.partnershipMetrics : [],
//     feedbackPrimaryCtaText: detail.feedbackPrimaryCtaText || "",
//     feedbackPrimaryCtaHref: detail.feedbackPrimaryCtaHref || "",

//     finalCta: detail.finalCta || (emptyForm.finalCta as any),
//   };
// }

// export function WebCaseStudiesManager() {
//   const [form, setForm] = useState<FormState>(emptyForm);
//   const [editingSlug, setEditingSlug] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [slugTouched, setSlugTouched] = useState(false);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<"card" | "detail">("card");

//   const { success, error: toastError } = useAppToast();
//   const queryClient = useQueryClient();
//   const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

//   // ✅ LIST cards for admin
//   const { data: cards = [], isLoading, error } = useQuery<WebCaseStudyCard[]>({
//     queryKey: ["/api/admin/web-case-studies"],
//     queryFn: async () => {
//       const res = await fetch("/api/admin/web-case-studies", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch Web case studies");
//       return res.json();
//     },
//     enabled: Boolean(token),
//   });

//   const cardOptions = useMemo(() => {
//     return (cards || []).map((c: any) => ({
//       _id: c._id,
//       slug: c.slug,
//       title: c.title,
//       client: c.client,
//       industry: c.industry,
//     }));
//   }, [cards]);

//   const handleChange = (field: keyof FormState, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const closeDialog = () => {
//     setDialogOpen(false);
//     setLoading(false);
//     setDetailLoading(false);
//   };

//   // ✅ detail fetch by cardId (try multiple endpoint styles)
//   const fetchDetailByCardId = async (cardId: string): Promise<WebCaseStudyDetailDoc | null> => {
//     if (!token) throw new Error("Admin token missing. Please login again.");
//     if (!cardId) return null;

//     const endpoints = [
//       `/api/admin/web-case-study/detail/${cardId}`,
//       `/api/admin/web-case-study/detail?cardId=${encodeURIComponent(cardId)}`,
//     ];

//     for (const url of endpoints) {
//       try {
//         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.status === 404) continue;
//         if (!res.ok) {
//           const t = await res.text().catch(() => "");
//           throw new Error(t || `Failed to fetch detail (${res.status})`);
//         }
//         const data = await res.json().catch(() => null);
//         if (!data) continue;
//         return data as WebCaseStudyDetailDoc;
//       } catch {
//         continue;
//       }
//     }
//     return null;
//   };

//   const openAdd = () => {
//     setEditingSlug(null);
//     setForm(emptyForm);
//     setSlugTouched(false);
//     setActiveTab("card");
//     setDialogOpen(true);
//   };

//   const openEdit = async (slug: string) => {
//     const it: any = (cards || []).find((x: any) => x.slug === slug);
//     if (!it) return;

//     setEditingSlug(slug);
//     setSlugTouched(true);
//     setActiveTab("card");
//     setDialogOpen(true);

//     // 1) load card immediately
//     setForm({
//       ...emptyForm,
//       ...it,
//       cardMongoId: it._id,
//       cardId: it._id,
//       detailMongoId: "",
//     });

//     // 2) fetch detail and merge
//     try {
//       setDetailLoading(true);
//       const detail = await fetchDetailByCardId(String(it._id));
//       if (detail) {
//         setForm((p) => ({ ...p, ...normalizeDetailToForm(detail) }));
//       } else {
//         setForm((p) => ({ ...p, cardId: String(it._id), detailMongoId: "" }));
//       }
//     } catch (err: any) {
//       console.error(err);
//       toastError(err?.message || "Failed to load detail for edit.", "Detail");
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // ---------- SAVE CARD ----------
//   const saveCard = async () => {
//     setLoading(true);
//     try {
//       if (!token) throw new Error("Admin token missing. Please login again.");

//       const slug = String(form.slug || "").trim();
//       if (!slug) throw new Error("Slug is required");
//       if (!form.title) throw new Error("Title is required");
//       if (!form.client) throw new Error("Client is required");
//       if (!form.industry) throw new Error("Industry is required");
//       if (!form.description) throw new Error("Description is required");

//       const r = form.results as any;
//       if (!r?.performance || !r?.conversions || !r?.users) {
//         throw new Error("Results fields are required (performance, conversions, users).");
//       }

//       const payload = {
//         slug,
//         title: String(form.title || "").trim(),
//         client: String(form.client || "").trim(),
//         industry: String(form.industry || "").trim(),
//         description: String(form.description || "").trim(),

//         results: {
//           performance: String(r.performance || "").trim(),
//           conversions: String(r.conversions || "").trim(),
//           users: String(r.users || "").trim(),
//         },

//         imageUrl: form.imageUrl || undefined,
//         imageAlt: form.imageAlt || undefined,
//         imageFit: (form.imageFit || "cover") as "contain" | "cover",
//         imagePublicId: form.imagePublicId || undefined,

//         link: form.link || undefined,
//       };

//       const url = editingSlug
//         ? `/api/admin/web-case-study/card/${encodeURIComponent(slug)}`
//         : "/api/admin/web-case-study/card";
//       const method = editingSlug ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.message || "Failed to save card");

//       const mongoId = data?._id || form.cardMongoId || form.cardId;
//       if (mongoId) setForm((p) => ({ ...p, cardMongoId: mongoId, cardId: mongoId }));

//       await queryClient.invalidateQueries({ queryKey: ["/api/admin/web-case-studies"] });
//       if (!editingSlug) setEditingSlug(slug);

//       success("Card saved successfully.", "Card");

//       // ✅ close popup after successful submission
//       closeDialog();
//     } catch (err: any) {
//       console.error(err);
//       toastError(err?.message || "Failed to save card.", "Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- SAVE DETAIL ----------
//   const saveDetail = async () => {
//     setLoading(true);
//     try {
//       if (!token) throw new Error("Admin token missing. Please login again.");

//       const finalCardId = String(form.cardId || form.cardMongoId || "").trim();
//       if (!finalCardId) throw new Error("Please select a Card (cardId) first.");

//       // minimal required checks (you can add more later)
//       const required: Array<[keyof WebCaseStudyDetail, string]> = [
//         ["heroBadgeText", "Hero Badge Text is required"],
//         ["heroTitle", "Hero Title is required"],
//         ["heroDescription", "Hero Description is required"],
//         ["heroPrimaryCtaText", "Hero Primary CTA Text is required"],
//         ["challengeTitle", "Challenge Title is required"],
//         ["challengeSubtitle", "Challenge Subtitle is required"],
//         ["overviewTitle", "Overview Title is required"],
//         ["strategyTitle", "Strategy Title is required"],
//         ["featuresTitle", "Features Title is required"],
//         ["evaluationTitle", "Evaluation Title is required"],
//       ];

//       for (const [key, msg] of required) {
//         const v = (form as any)[key];
//         if (typeof v !== "string" || !String(v).trim()) throw new Error(msg);
//       }

//       const payload: WebCaseStudyDetail = {
//         cardId: finalCardId,

//         heroBadgeText: String(form.heroBadgeText || "").trim(),
//         heroTitle: String(form.heroTitle || "").trim(),
//         heroRatingText: form.heroRatingText ? String(form.heroRatingText).trim() : undefined,
//         heroDescription: String(form.heroDescription || "").trim(),
//         heroStats: (form.heroStats || []) as any,
//         heroPrimaryCtaText: String(form.heroPrimaryCtaText || "").trim(),
//         heroPrimaryCtaHref: form.heroPrimaryCtaHref || undefined,
//         heroSecondaryCtaText: form.heroSecondaryCtaText || undefined,
//         heroSecondaryCtaHref: form.heroSecondaryCtaHref || undefined,

//         heroVideoUrl: form.heroVideoUrl || undefined,
//         heroVideoPoster: form.heroVideoPoster || undefined,
//         heroVideoBadgeText: form.heroVideoBadgeText || undefined,

//         showcase: (form.showcase || emptyForm.showcase) as any,
//         ctaTop: (form.ctaTop || emptyForm.ctaTop) as any,

//         challengeTitle: String(form.challengeTitle || "").trim(),
//         challengeSubtitle: String(form.challengeSubtitle || "").trim(),
//         challengePoints: (form.challengePoints || []) as any,
//         beforeAfter: (form.beforeAfter || emptyForm.beforeAfter) as any,

//         overviewTitle: String(form.overviewTitle || "").trim(),
//         overviewSubtitle: form.overviewSubtitle || undefined,
//         overviewColumns: (form.overviewColumns || []) as any,

//         strategyTitle: String(form.strategyTitle || "").trim(),
//         strategySubtitle: form.strategySubtitle || undefined,
//         strategyColumns: (form.strategyColumns || []) as any,

//         featuresTitle: String(form.featuresTitle || "").trim(),
//         featuresSubtitle: form.featuresSubtitle || undefined,
//         coreFeaturesTitle: form.coreFeaturesTitle || undefined,
//         coreFeatures: (form.coreFeatures || []) as any,
//         technicalExcellenceTitle: form.technicalExcellenceTitle || undefined,
//         technicalExcellence: (form.technicalExcellence || []) as any,

//         ctaMid: (form.ctaMid || emptyForm.ctaMid) as any,

//         evaluationKicker: form.evaluationKicker || undefined,
//         evaluationTitle: String(form.evaluationTitle || "").trim(),
//         evaluationCards: (form.evaluationCards || []) as any,

//         feedbackKicker: form.feedbackKicker || undefined,
//         testimonial: (form.testimonial || emptyForm.testimonial) as any,
//         partnershipMetricsTitle: form.partnershipMetricsTitle || undefined,
//         partnershipMetrics: (form.partnershipMetrics || []) as any,
//         feedbackPrimaryCtaText: form.feedbackPrimaryCtaText || undefined,
//         feedbackPrimaryCtaHref: form.feedbackPrimaryCtaHref || undefined,

//         finalCta: (form.finalCta || emptyForm.finalCta) as any,
//       };

//       const isEdit = Boolean(String(form.detailMongoId || "").trim());
//       const endpoints = isEdit
//         ? [
//             `/api/admin/web-case-study/detail/${encodeURIComponent(String(form.detailMongoId))}`,
//             `/api/admin/web-case-study/detail?detailId=${encodeURIComponent(String(form.detailMongoId))}`,
//           ]
//         : ["/api/admin/web-case-study/detail"];

//       const method = isEdit ? "PUT" : "POST";

//       let saved: any = null;
//       let lastErr: any = null;

//       for (const url of endpoints) {
//         try {
//           const res = await fetch(url, {
//             method,
//             headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//             body: JSON.stringify(payload),
//           });

//           const data = await res.json().catch(() => ({}));
//           if (!res.ok) throw new Error(data?.message || "Failed to save detail");
//           saved = data;
//           break;
//         } catch (e) {
//           lastErr = e;
//           continue;
//         }
//       }

//       if (!saved) throw lastErr || new Error("Failed to save detail");

//       const newDetailId = saved?._id || saved?.detailId;
//       if (newDetailId) {
//         setForm((p) => ({ ...p, detailMongoId: String(newDetailId) }));
//       } else if (!form.detailMongoId) {
//         try {
//           const d = await fetchDetailByCardId(finalCardId);
//           if (d?._id) setForm((p) => ({ ...p, detailMongoId: String(d._id) }));
//         } catch {}
//       }

//       success(isEdit ? "Detail updated successfully." : "Detail saved successfully.", "Detail");

//       // ✅ close popup after successful submission
//       closeDialog();
//     } catch (err: any) {
//       console.error(err);
//       toastError(err?.message || "Failed to save detail.", "Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (slug: string) => {
//     if (!confirm("Delete this Web case study?")) return;

//     try {
//       const res = await fetch(`/api/admin/web-case-study/${encodeURIComponent(slug)}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.message || "Failed to delete");

//       await queryClient.invalidateQueries({ queryKey: ["/api/admin/web-case-studies"] });
//       success("Web case study deleted.", "Deleted");
//     } catch (err: any) {
//       console.error(err);
//       toastError(err?.message || "Failed to delete.", "Error");
//     }
//   };

//   // ✅ when selecting cardId in detail tab, auto-load existing detail (if any)
//   const handleDetailCardSelect = async (cardId: string) => {
//     handleChange("cardId", cardId);
//     handleChange("detailMongoId", "");

//     if (!cardId) return;

//     try {
//       setDetailLoading(true);
//       const detail = await fetchDetailByCardId(cardId);

//       if (detail) {
//         setForm((p) => ({ ...p, ...normalizeDetailToForm(detail) }));
//         success("Loaded existing detail for this card.", "Detail");
//       } else {
//         // keep card fields, clear detail fields
//         setForm((p) => ({
//           ...emptyForm,
//           ...p,
//           cardId,
//           cardMongoId: p.cardMongoId || cardId,
//           slug: p.slug || "",
//           title: p.title || "",
//           client: p.client || "",
//           industry: p.industry || "",
//           description: p.description || "",
//           results: p.results || { performance: "", conversions: "", users: "" },
//           imageUrl: p.imageUrl || "",
//           imageAlt: p.imageAlt || "",
//           imageFit: (p.imageFit || "cover") as any,
//           imagePublicId: p.imagePublicId || "",
//           link: p.link || "",
//           detailMongoId: "",
//         }));
//       }
//     } catch (err: any) {
//       console.error(err);
//       toastError(err?.message || "Failed to load detail for selected card.", "Detail");
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <h2 className="text-2xl font-bold text-brand-purple">Website Design & Development Case Studies</h2>
//         <div className="flex items-center gap-3">
//           <Badge>{cards.length} items</Badge>
//           <Button className="bg-brand-purple" onClick={openAdd}>
//             + Add Case Study
//           </Button>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="space-y-4">
//         {isLoading ? (
//           <Card><CardContent className="p-6">Loading...</CardContent></Card>
//         ) : error ? (
//           <Card><CardContent className="p-6 text-red-600">Failed to load Web case studies</CardContent></Card>
//         ) : cards.length === 0 ? (
//           <Card><CardContent className="p-6 text-gray-600">No Web case studies yet.</CardContent></Card>
//         ) : (
//           cards.map((it: any) => (
//             <Card key={it._id} className="hover:shadow-sm transition-shadow">
//               <CardContent className="p-4 flex gap-4 items-center">
//                 <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
//                   {it.imageUrl ? (
//                     <img
//                       src={it.imageUrl}
//                       alt={it.imageAlt || it.title}
//                       className={`w-full h-full ${(it.imageFit || "cover") === "cover" ? "object-cover" : "object-contain"}`}
//                     />
//                   ) : (
//                     <div className="text-xs text-gray-400">No Image</div>
//                   )}
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <div className="font-semibold text-brand-purple">{it.title}</div>
//                     <Badge variant="secondary">{it.industry}</Badge>
//                   </div>

//                   <div className="text-sm text-gray-600">
//                     /case-studies/{it.slug} • {it.client}
//                   </div>

//                   <div className="text-xs text-gray-500 mt-1">
//                     Industry: {it?.results?.performance} • Website Type: {it?.results?.conversions} • Delivery Type: {it?.results?.users}
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button variant="outline" onClick={() => openEdit(it.slug)}>Edit</Button>
//                   <Button variant="destructive" onClick={() => handleDelete(it.slug)}>Delete</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>

//       {/* POPUP FORM */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {editingSlug ? "Edit Web Case Study" : "Add Web Case Study"}
//             </DialogTitle>
//           </DialogHeader>

//           {detailLoading ? (
//             <div className="text-sm text-gray-600 mb-2">Loading detail data...</div>
//           ) : null}

//           <div className="space-y-4">
//             {/* Slug + Title */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <ReqLabel>Slug</ReqLabel>
//                 <Input
//                   value={form.slug || ""}
//                   onChange={(e) => {
//                     setSlugTouched(true);
//                     handleChange("slug", e.target.value);
//                   }}
//                   placeholder="socialland-website"
//                   required
//                 />
//               </div>

//               <div>
//                 <ReqLabel>Card Title (Web Grid)</ReqLabel>
//                 <Input
//                   value={form.title || ""}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     handleChange("title", val);

//                     if (!editingSlug && !slugTouched) {
//                       const auto = slugifyTitle(val);
//                       setForm((p) => ({ ...p, slug: auto }));
//                     }
//                   }}
//                   placeholder="UK White-Label Partnership Success"
//                   required
//                 />
//               </div>
//             </div>

//             <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
//               <TabsList className="w-full bg-gray-100">
//                 <TabsTrigger
//                   value="card"
//                   className="flex-1 text-gray-600 data-[state=active]:bg-brand-coral data-[state=active]:text-white data-[state=active]:shadow transition-all"
//                 >
//                   Card Section
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="detail"
//                   className="flex-1 text-gray-600 data-[state=active]:bg-brand-coral data-[state=active]:text-white data-[state=active]:shadow transition-all"
//                 >
//                   Detail Page
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="card">
//                 <WebCaseStudyCardTab
//                   form={form}
//                   onChange={(field, value) => handleChange(field as any, value)}
//                 />

//                 <div className="flex gap-3 pt-4">
//                   <Button type="button" className="bg-brand-purple" disabled={loading} onClick={saveCard}>
//                     {loading ? "Saving..." : "Save Card"}
//                   </Button>
//                   <Button type="button" variant="outline" onClick={closeDialog} disabled={loading}>
//                     Close
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="detail">
//                 <WebCaseStudyDetailTab
//                   form={form}
//                   onChange={(field, value) => {
//                     if (field === "cardId") {
//                       handleDetailCardSelect(String(value || ""));
//                       return;
//                     }
//                     handleChange(field as any, value);
//                   }}
//                   cardOptions={cardOptions}
//                 />

//                 <div className="flex gap-3 pt-4">
//                   <Button type="button" className="bg-brand-purple" disabled={loading || detailLoading} onClick={saveDetail}>
//                     {loading ? "Saving..." : form.detailMongoId ? "Update Detail" : "Save Detail"}
//                   </Button>
//                   <Button type="button" variant="outline" onClick={closeDialog} disabled={loading}>
//                     Close
//                   </Button>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }












import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/components/ui/toaster";
import { GripVertical } from "lucide-react";

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

export type WebCaseStudyCardResults = {
  performance: string;
  conversions: string;
  // users: string | null;
};

export type WebCaseStudyCard = {
  _id: string;
  id: number;
  slug: string;

  title: string;
  client: string;
  industry: string;

  description: string;

  results: WebCaseStudyCardResults;

  imageUrl?: string;
  imageAlt?: string;
  imageFit?: "contain" | "cover";

  imagePublicId?: string;

  link?: string;

  /** ✅ NEW */
  order?: number;
  status?: "draft" | "published";

  createdAt: string;
  updatedAt: string;
};

export type WebSeoMeta = {
  metaTitle?: string;
  metaDescription?: string;
};

type WebCaseStudyDetail = {
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

  seo?: WebSeoMeta;
  
  createdAt?: string;
  updatedAt?: string;
};

type WebCaseStudyDetailDoc = WebCaseStudyDetail & { _id?: string };

type FormState = Partial<WebCaseStudyCard> &
  Partial<WebCaseStudyDetailDoc> & {
    cardMongoId?: string;
    detailMongoId?: string;
  };

// ✅ UI error map: key like "heroStats.0.value" => "Required"
type FieldErrors = Record<string, string>;

const isBlank = (v: any) => typeof v !== "string" || v.trim().length === 0;

const setIfBlank = (errs: FieldErrors, key: string, msg = "This field is required") => {
  if (!errs[key]) errs[key] = msg;
};

const zodPathToKey = (path: Array<string | number> | undefined) => {
  if (!Array.isArray(path)) return "";
  return path.map(String).join(".");
};

const scrollToField = (fieldKey: string) => {
  if (!fieldKey) return;

  const el = document.querySelector<HTMLElement>(`[data-field="${CSS.escape(fieldKey)}"]`);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    try {
      (el as any).focus?.();
    } catch { }
  }, 150);
};

const firstErrorKey = (errs: FieldErrors) => Object.keys(errs)[0] || "";

// ✅ DEFAULTS (admin sees defaults but can edit)
const emptyForm: FormState = {
  // Card
  slug: "",
  title: "",
  client: "",
  industry: "",
  description: "",
  results: { performance: "", conversions: "" }, //, users: "" 
  imageUrl: "",
  imageAlt: "",
  imageFit: "cover",
  imagePublicId: "",
  link: "",

  /** ✅ NEW */
  order: 0,
  status: "draft",

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
    secondaryText: "View Other Case Studies",
    secondaryHref: "/services/web-development#case-studies",
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
    seo: detail.seo || {},
  };
}

// ---------- CLIENT-SIDE VALIDATION (matches backend paths) ----------
const validateCardForm = (form: FormState): FieldErrors => {
  const errs: FieldErrors = {};

  if (isBlank(form.slug)) setIfBlank(errs, "slug");
  if (isBlank(form.title)) setIfBlank(errs, "title");
  if (isBlank(form.client)) setIfBlank(errs, "client");
  if (isBlank(form.industry)) setIfBlank(errs, "industry");
  if (isBlank(form.description)) setIfBlank(errs, "description");

  // ✅ order required and must be >= 0
  const ord = Number((form as any).order);
  if (!Number.isFinite(ord) || ord < 0) {
    errs["order"] = "Order must be a number (0 or greater)";
  }

  const r: any = form.results || {};
  if (isBlank(r.performance)) setIfBlank(errs, "results.performance");
  if (isBlank(r.conversions)) setIfBlank(errs, "results.conversions");
  // if (isBlank(r.users)) setIfBlank(errs, "results.users");

  return errs;
};

const validateDetailForm = (form: FormState): FieldErrors => {
  const errs: FieldErrors = {};

  if (isBlank(String(form.cardId || form.cardMongoId || ""))) setIfBlank(errs, "cardId", "Please select a card");

  if (isBlank(form.heroBadgeText)) setIfBlank(errs, "heroBadgeText");
  if (isBlank(form.heroTitle)) setIfBlank(errs, "heroTitle");
  if (isBlank(form.heroDescription)) setIfBlank(errs, "heroDescription");
  if (isBlank(form.heroPrimaryCtaText)) setIfBlank(errs, "heroPrimaryCtaText");

  if (isBlank(form.challengeTitle)) setIfBlank(errs, "challengeTitle");
  if (isBlank(form.challengeSubtitle)) setIfBlank(errs, "challengeSubtitle");

  if (isBlank(form.overviewTitle)) setIfBlank(errs, "overviewTitle");
  if (isBlank(form.strategyTitle)) setIfBlank(errs, "strategyTitle");
  if (isBlank(form.featuresTitle)) setIfBlank(errs, "featuresTitle");
  if (isBlank(form.evaluationTitle)) setIfBlank(errs, "evaluationTitle");

  return errs;
};

const mapBackendErrorsToFieldErrors = (data: any): FieldErrors => {
  const errs: FieldErrors = {};
  const list: any[] = Array.isArray(data?.errors) ? data.errors : [];
  for (const e of list) {
    const key = zodPathToKey(e?.path);
    if (!key) continue;
    errs[key] = String(e?.message || "Invalid value");
  }
  return errs;
};

// ---------- DND helpers ----------
const moveItem = <T,>(arr: T[], from: number, to: number) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export function WebCaseStudiesManager() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "detail">("card");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // ✅ Always-on drag reorder states
  const [draftOrders, setDraftOrders] = useState<WebCaseStudyCard[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const { success, error: toastError } = useAppToast();
  const queryClient = useQueryClient();
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

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

  // ✅ Always keep local list sorted by order
  useEffect(() => {
    const sorted = [...cards].sort(
      (a, b) =>
        (a?.order ?? 0) - (b?.order ?? 0) ||
        (b?.createdAt || "").localeCompare(a?.createdAt || "")
    );
    setDraftOrders(sorted);
  }, [cards]);

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
    setFieldErrors({});
  };

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
    setFieldErrors({});
  };

  const openEdit = async (slug: string) => {
    const it: any = (cards || []).find((x: any) => x.slug === slug);
    if (!it) return;

    setEditingSlug(slug);
    setSlugTouched(true);
    setActiveTab("card");
    setDialogOpen(true);
    setFieldErrors({});

    setForm({
      ...emptyForm,
      ...it,
      cardMongoId: it._id,
      cardId: it._id,
      detailMongoId: "",
      order: Number.isFinite(it?.order) ? it.order : 0,
    });

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

      const localErrs = validateCardForm(form);
      if (Object.keys(localErrs).length) {
        setFieldErrors(localErrs);
        setActiveTab("card");
        scrollToField(firstErrorKey(localErrs));
        toastError("Please fill the required fields.", "Validation");
        return;
      }

      const slug = String(form.slug || "").trim();
      const r = form.results as any;

      const payload = {
        slug,
        title: String(form.title || "").trim(),
        client: String(form.client || "").trim(),
        industry: String(form.industry || "").trim(),
        description: String(form.description || "").trim(),

        results: {
          performance: String(r.performance || "").trim(),
          conversions: String(r.conversions || "").trim(),
          // users: String(r.users || "").trim(),
        },

        imageUrl: form.imageUrl || undefined,
        imageAlt: form.imageAlt || undefined,
        imageFit: (form.imageFit || "cover") as "contain" | "cover",
        imagePublicId: form.imagePublicId || undefined,

        link: form.link || undefined,

        order: Math.max(0, Math.floor(Number(form.order ?? 0))),
        status: form.status === "published" ? "published" : "draft",
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
      if (!res.ok) {
        const backendErrs = mapBackendErrorsToFieldErrors(data);
        if (Object.keys(backendErrs).length) {
          setFieldErrors(backendErrs);
          setActiveTab("card");
          scrollToField(firstErrorKey(backendErrs));
          toastError("Please fix the highlighted fields.", "Validation");
          return;
        }
        throw new Error(data?.message || "Failed to save card");
      }

      setFieldErrors({});

      const mongoId = data?._id || form.cardMongoId || form.cardId;
      if (mongoId) setForm((p) => ({ ...p, cardMongoId: mongoId, cardId: mongoId }));

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/web-case-studies"] });
      if (!editingSlug) setEditingSlug(slug);

      success("Card saved successfully.", "Card");
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

      const localErrs = validateDetailForm(form);
      if (Object.keys(localErrs).length) {
        setFieldErrors(localErrs);
        setActiveTab("detail");
        scrollToField(firstErrorKey(localErrs));
        toastError("Please fill the required fields.", "Validation");
        return;
      }

      const finalCardId = String(form.cardId || form.cardMongoId || "").trim();
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

        seo: form.seo?.metaTitle || form.seo?.metaDescription
          ? {
            metaTitle: form.seo?.metaTitle?.trim() || undefined,
            metaDescription: form.seo?.metaDescription?.trim() || undefined,
          }
          : undefined,
      };

      const isEdit = Boolean(String(form.detailMongoId || "").trim());
      const cardId = String(form.cardId || form.cardMongoId).trim();
      if (!cardId) throw new Error("cardId missing");

      const endpoints = isEdit
        ? [`/api/admin/web-case-study/detail/${encodeURIComponent(String(finalCardId))}`]
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
          if (!res.ok) {
            const backendErrs = mapBackendErrorsToFieldErrors(data);
            if (Object.keys(backendErrs).length) {
              setFieldErrors(backendErrs);
              setActiveTab("detail");
              scrollToField(firstErrorKey(backendErrs));
              toastError("Please fix the highlighted fields.", "Validation");
              return;
            }
            throw new Error(data?.message || "Failed to save detail");
          }

          saved = data;
          break;
        } catch (e) {
          lastErr = e;
          continue;
        }
      }

      if (!saved) throw lastErr || new Error("Failed to save detail");

      setFieldErrors({});
      success(isEdit ? "Detail updated successfully." : "Detail saved successfully.", "Detail");
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

  const handleDetailCardSelect = async (cardId: string) => {
    handleChange("cardId", cardId);
    handleChange("detailMongoId", "");
    setFieldErrors((p) => {
      const next = { ...p };
      delete next["cardId"];
      return next;
    });

    if (!cardId) return;

    try {
      setDetailLoading(true);
      const detail = await fetchDetailByCardId(cardId);

      if (detail) {
        setForm((p) => ({ ...p, ...normalizeDetailToForm(detail) }));
        success("Loaded existing detail for this card.", "Detail");
      } else {
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
          results: p.results || { performance: "", conversions: "" }, //, users: "" 
          imageUrl: p.imageUrl || "",
          imageAlt: p.imageAlt || "",
          imageFit: (p.imageFit || "cover") as any,
          imagePublicId: p.imagePublicId || "",
          link: p.link || "",
          detailMongoId: "",
          order: Number.isFinite(p.order as any) ? (p.order as number) : 0,
          status: p.status === "published" ? "published" : "draft",
        }));
      }
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to load detail for selected card.", "Detail");
    } finally {
      setDetailLoading(false);
    }
  };

  // ✅ auto-save order after drop (no button)
  const saveReorder = async (nextList: WebCaseStudyCard[]) => {
    try {
      if (!token) throw new Error("Admin token missing. Please login again.");
      setSavingOrder(true);

      const items = nextList.map((c, index) => ({
        id: c._id,
        order: index,
      }));

      const res = await fetch("/api/admin/web-case-studies/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update order");

      await queryClient.invalidateQueries({ queryKey: ["/api/admin/web-case-studies"] });
      success("Order updated.", "Reorder");
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Failed to update order.", "Reorder");
    } finally {
      setSavingOrder(false);
    }
  };

  // ✅ Always-on Drag handlers
  const onDragStart = (id: string) => (e: React.DragEvent) => {
    setDraggingId(id);
    try {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
    } catch { }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = "move";
    } catch { }
  };

  const onDrop = (targetId: string) => async (e: React.DragEvent) => {
    e.preventDefault();

    const fromId =
      draggingId ||
      (() => {
        try {
          return e.dataTransfer.getData("text/plain");
        } catch {
          return "";
        }
      })();

    if (!fromId || fromId === targetId) return;

    const from = draftOrders.findIndex((x) => x._id === fromId);
    const to = draftOrders.findIndex((x) => x._id === targetId);
    if (from < 0 || to < 0) return;

    const next = moveItem(draftOrders, from, to);
    setDraftOrders(next);
    setDraggingId(null);

    await saveReorder(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-brand-purple">Website Design & Development Case Studies</h2>

        <div className="flex items-center gap-3">
          <Badge>{cards.length} items</Badge>
          {savingOrder ? <Badge variant="secondary">Saving order...</Badge> : null}

          {/* ✅ Keep only Add button (no reorder button) */}
          <Button className="bg-brand-purple" onClick={openAdd} disabled={savingOrder}>
            + Add Case Study
          </Button>
        </div>
      </div>

      {/* LIST (Always draggable) */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading...</CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-red-600">Failed to load Web case studies</CardContent>
          </Card>
        ) : draftOrders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-gray-600">No Web case studies yet.</CardContent>
          </Card>
        ) : (
          draftOrders.map((it: any, idx: number) => (
            <Card
              key={it._id}
              className={`transition-shadow ${draggingId === it._id ? "ring-2 ring-brand-coral shadow-md" : "hover:shadow-sm"
                } ${savingOrder ? "opacity-90" : ""}`}
              draggable
              onDragStart={onDragStart(it._id)}
              onDragOver={onDragOver}
              onDrop={onDrop(it._id)}
            >
              <CardContent className="p-4 flex gap-4 items-center">
                {/* ✅ Drag handle always */}
                <div
                  className="flex items-center gap-2 text-gray-500 select-none cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-5 w-5" />
                  <Badge className="bg-gray-900 text-white">#{idx}</Badge>
                </div>

                <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {it.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it.imageAlt || it.title}
                      className={`w-full h-full ${(it.imageFit || "cover") === "cover" ? "object-cover" : "object-contain"
                        }`}
                    />
                  ) : (
                    <div className="text-xs text-gray-400">No Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-brand-purple">{it.title}</div>
                    <Badge variant="secondary">{it.industry}</Badge>
                    <Badge className="bg-gray-900 text-white">Order: {Number.isFinite(it.order) ? it.order : 0}</Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    /case-studies/{it.slug} • {it.client}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    Industry: {it?.results?.performance} • Website Type: {it?.results?.conversions} • Delivery Type:{" "}
                    {it?.results?.users}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => openEdit(it.slug)} disabled={savingOrder}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(it.slug)} disabled={savingOrder}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* POPUP FORM */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setFieldErrors({});
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSlug ? "Edit Web Case Study" : "Add Web Case Study"}</DialogTitle>
          </DialogHeader>

          {detailLoading ? <div className="text-sm text-gray-600 mb-2">Loading detail data...</div> : null}

          <div className="space-y-4">
            {/* Slug + Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ReqLabel>Slug</ReqLabel>
                <Input
                  data-field="slug"
                  className={fieldErrors["slug"] ? "border-red-500 focus-visible:ring-red-500" : ""}
                  value={form.slug || ""}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n["slug"];
                      return n;
                    });
                    handleChange("slug", e.target.value);
                  }}
                  placeholder="socialland-website"
                  required
                />
                {fieldErrors["slug"] ? <div className="text-xs text-red-600 mt-1">{fieldErrors["slug"]}</div> : null}
              </div>

              <div>
                <ReqLabel>Card Title (Web Grid)</ReqLabel>
                <Input
                  data-field="title"
                  className={fieldErrors["title"] ? "border-red-500 focus-visible:ring-red-500" : ""}
                  value={form.title || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n["title"];
                      return n;
                    });
                    handleChange("title", val);

                    if (!editingSlug && !slugTouched) {
                      const auto = slugifyTitle(val);
                      setForm((p) => ({ ...p, slug: auto }));
                    }
                  }}
                  placeholder="UK White-Label Partnership Success"
                  required
                />
                {fieldErrors["title"] ? <div className="text-xs text-red-600 mt-1">{fieldErrors["title"]}</div> : null}
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
                <WebCaseStudyCardTab form={form} errors={fieldErrors} onChange={(field, value) => handleChange(field as any, value)} />

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
                  errors={fieldErrors}
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
