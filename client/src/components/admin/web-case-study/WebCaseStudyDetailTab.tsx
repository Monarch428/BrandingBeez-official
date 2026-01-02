// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // ✅ Required label helper (adds *)
// function ReqLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <Label>
//       {children} <span className="text-red-500">*</span>
//     </Label>
//   );
// }

// // -------- Types --------
// export type WebHeroStat = { value: string; label: string; iconKey?: string };

// export type WebShowcase = {
//   title: string;
//   subtitle?: string;
//   body?: string;
//   liveUrl?: string;
//   liveButtonText?: string;

//   desktopImageUrl?: string;
//   desktopImageAlt?: string;
//   desktopImagePublicId?: string;

//   mobileImageUrl?: string;
//   mobileImageAlt?: string;
//   mobileImagePublicId?: string;
// };

// export type WebCtaBlock = {
//   title: string;
//   body: string;
//   primaryText: string;
//   primaryHref?: string;
//   secondaryText?: string;
//   secondaryHref?: string;
// };

// export type WebChallengePoint = { iconKey: string; text: string };

// export type WebBeforeAfterItem = { label: string; value: string };
// export type WebBeforeAfterBlock = {
//   beforeTitle: string;
//   afterTitle: string;
//   beforeItems: WebBeforeAfterItem[];
//   afterItems: WebBeforeAfterItem[];
// };

// export type WebOverviewColumn = {
//   iconKey: string;
//   title: string;
//   dotColorClass?: string;
//   bullets: { iconKey: string; text: string }[];
// };

// export type WebStrategyColumn = {
//   order: number;
//   title: string;
//   tagText?: string;
//   bullets: { iconKey: string; text: string }[];
// };

// export type WebFeatureItem = {
//   iconKey: string;
//   title: string;
//   description: string;
//   color?: string;
// };

// export type WebEvaluationCard = { iconKey: string; title: string; description: string };

// export type WebTestimonial = {
//   quote: string;
//   authorName: string;
//   authorRole?: string;
//   ratingText?: string;
// };

// export type WebPartnershipMetric = { iconKey: string; label: string; value: string };

// export type WebCaseStudyDetailTabValues = {
//   cardId?: string;

//   heroBadgeText?: string;
//   heroTitle?: string;
//   heroRatingText?: string;
//   heroDescription?: string;
//   heroStats?: WebHeroStat[];
//   heroPrimaryCtaText?: string;
//   heroPrimaryCtaHref?: string;
//   heroSecondaryCtaText?: string;
//   heroSecondaryCtaHref?: string;

//   heroVideoUrl?: string;
//   heroVideoPoster?: string;
//   heroVideoBadgeText?: string;

//   showcase?: WebShowcase;

//   ctaTop?: WebCtaBlock;

//   challengeTitle?: string;
//   challengeSubtitle?: string;
//   challengePoints?: WebChallengePoint[];
//   beforeAfter?: WebBeforeAfterBlock;

//   overviewTitle?: string;
//   overviewSubtitle?: string;
//   overviewColumns?: WebOverviewColumn[];

//   strategyTitle?: string;
//   strategySubtitle?: string;
//   strategyColumns?: WebStrategyColumn[];

//   featuresTitle?: string;
//   featuresSubtitle?: string;
//   coreFeaturesTitle?: string;
//   coreFeatures?: WebFeatureItem[];
//   technicalExcellenceTitle?: string;
//   technicalExcellence?: WebFeatureItem[];

//   ctaMid?: WebCtaBlock;

//   evaluationKicker?: string;
//   evaluationTitle?: string;
//   evaluationCards?: WebEvaluationCard[];

//   feedbackKicker?: string;
//   testimonial?: WebTestimonial;
//   partnershipMetricsTitle?: string;
//   partnershipMetrics?: WebPartnershipMetric[];
//   feedbackPrimaryCtaText?: string;
//   feedbackPrimaryCtaHref?: string;

//   finalCta?: WebCtaBlock;
// };

// type CardOption = { _id: string; slug: string; title: string; client: string; industry: string };

// function TextArea({
//   value,
//   onChange,
//   placeholder,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   return (
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full border rounded-md p-2 mt-1 min-h-[84px]"
//     />
//   );
// }

// function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
//   return (
//     <div className="space-y-0.5">
//       <div className="text-sm font-semibold text-brand-purple">{title}</div>
//       {subtitle ? <div className="text-xs text-gray-500">{subtitle}</div> : null}
//     </div>
//   );
// }

// // Small helper for bullets editor (used by overview + strategy)
// function BulletEditor({
//   bullets,
//   onChange,
//   addDefault = { iconKey: "CheckCircle2", text: "" },
// }: {
//   bullets: { iconKey: string; text: string }[];
//   onChange: (next: { iconKey: string; text: string }[]) => void;
//   addDefault?: { iconKey: string; text: string };
// }) {
//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <Label className="font-semibold">Bullets</Label>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={() => onChange([...(bullets || []), { ...addDefault }])}
//         >
//           Add Bullet
//         </Button>
//       </div>

//       {(bullets || []).map((b, bi) => (
//         <div key={bi} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//           <Input
//             className="md:col-span-3"
//             value={b.iconKey || ""}
//             onChange={(e) => {
//               const next = [...(bullets || [])];
//               next[bi] = { ...next[bi], iconKey: e.target.value };
//               onChange(next);
//             }}
//             placeholder="iconKey"
//           />
//           <Input
//             className="md:col-span-7"
//             value={b.text || ""}
//             onChange={(e) => {
//               const next = [...(bullets || [])];
//               next[bi] = { ...next[bi], text: e.target.value };
//               onChange(next);
//             }}
//             placeholder="Bullet text..."
//           />
//           <Button
//             className="md:col-span-2"
//             type="button"
//             variant="destructive"
//             size="sm"
//             onClick={() => onChange((bullets || []).filter((_, idx) => idx !== bi))}
//           >
//             Remove
//           </Button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export function WebCaseStudyDetailTab({
//   form,
//   onChange,
//   cardOptions,
// }: {
//   form: WebCaseStudyDetailTabValues;
//   onChange: (field: keyof WebCaseStudyDetailTabValues, value: any) => void;
//   cardOptions: CardOption[];
// }) {
//   // ✅ FIX: token was missing
//   const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

//   const heroStats = form.heroStats || [];
//   const challengePoints = form.challengePoints || [];
//   const overviewColumns = form.overviewColumns || [];
//   const strategyColumns = form.strategyColumns || [];
//   const coreFeatures = form.coreFeatures || [];
//   const technicalExcellence = form.technicalExcellence || [];
//   const evaluationCards = form.evaluationCards || [];
//   const partnershipMetrics = form.partnershipMetrics || [];

//   const showcase = form.showcase || ({} as any);
//   const ctaTop = form.ctaTop || ({} as any);
//   const beforeAfter = form.beforeAfter || ({} as any);
//   const ctaMid = form.ctaMid || ({} as any);
//   const testimonial = form.testimonial || ({} as any);
//   const finalCta = form.finalCta || ({} as any);

//   return (
//     <div className="space-y-5 mt-4">
//       <SectionTitle title="Detail Page Fields" subtitle="Controls the full /case-studies/:slug page content." />

//       {/* FK selector */}
//       <div className="border rounded-lg p-3 space-y-2 bg-white">
//         <SectionTitle title="Link Detail to Existing Web Case Study" subtitle="Pick which card this detail belongs to." />
//         <div>
//           <ReqLabel>Select Web Case Study</ReqLabel>
//           <select
//             value={form.cardId || ""}
//             onChange={(e) => onChange("cardId", e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
//           >
//             <option value="">-- Select a Card --</option>
//             {cardOptions.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.title} • {c.client} • ({c.slug})
//               </option>
//             ))}
//           </select>

//           {!form.cardId ? <div className="text-xs text-amber-600 mt-1">⚠️ Select a card first, then save detail.</div> : null}
//         </div>
//       </div>

//       {/* HERO */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Hero" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <ReqLabel>Hero Badge Text</ReqLabel>
//             <Input value={form.heroBadgeText || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} required />
//           </div>
//           <div>
//             <ReqLabel>Hero Title</ReqLabel>
//             <Input value={form.heroTitle || ""} onChange={(e) => onChange("heroTitle", e.target.value)} required />
//           </div>
//           <div>
//             <Label>Hero Rating Text</Label>
//             <Input value={form.heroRatingText || ""} onChange={(e) => onChange("heroRatingText", e.target.value)} />
//           </div>
//           <div>
//             <ReqLabel>Hero Primary CTA Text</ReqLabel>
//             <Input value={form.heroPrimaryCtaText || ""} onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)} required />
//           </div>
//           <div>
//             <Label>Hero Primary CTA Href</Label>
//             <Input value={form.heroPrimaryCtaHref || ""} onChange={(e) => onChange("heroPrimaryCtaHref", e.target.value)} />
//           </div>
//           <div>
//             <Label>Hero Secondary CTA Text</Label>
//             <Input value={form.heroSecondaryCtaText || ""} onChange={(e) => onChange("heroSecondaryCtaText", e.target.value)} />
//           </div>
//           <div>
//             <Label>Hero Secondary CTA Href</Label>
//             <Input value={form.heroSecondaryCtaHref || ""} onChange={(e) => onChange("heroSecondaryCtaHref", e.target.value)} />
//           </div>
//           <div>
//             <Label>Hero Video URL (optional)</Label>
//             <Input value={form.heroVideoUrl || ""} onChange={(e) => onChange("heroVideoUrl", e.target.value)} />
//           </div>
//           <div>
//             <Label>Hero Video Poster (optional)</Label>
//             <Input value={form.heroVideoPoster || ""} onChange={(e) => onChange("heroVideoPoster", e.target.value)} />
//           </div>
//           <div className="md:col-span-2">
//             <Label>Hero Video Badge Text</Label>
//             <Input value={form.heroVideoBadgeText || ""} onChange={(e) => onChange("heroVideoBadgeText", e.target.value)} />
//           </div>
//         </div>

//         <div>
//           <ReqLabel>Hero Description</ReqLabel>
//           <TextArea value={String(form.heroDescription || "")} onChange={(v) => onChange("heroDescription", v)} />
//         </div>

//         {/* HERO STATS */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Hero Stats</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => onChange("heroStats", [...heroStats, { value: "", label: "", iconKey: "CheckCircle2" }])}
//             >
//               Add Stat
//             </Button>
//           </div>

//           {heroStats.map((s, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-3"
//                 value={s.iconKey || ""}
//                 onChange={(e) => {
//                   const next = [...heroStats];
//                   next[i] = { ...next[i], iconKey: e.target.value };
//                   onChange("heroStats", next);
//                 }}
//                 placeholder="iconKey (TrendingUp, CheckCircle2...)"
//               />
//               <Input
//                 className="md:col-span-3"
//                 value={s.value}
//                 onChange={(e) => {
//                   const next = [...heroStats];
//                   next[i] = { ...next[i], value: e.target.value };
//                   onChange("heroStats", next);
//                 }}
//                 placeholder="48hrs"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={s.label}
//                 onChange={(e) => {
//                   const next = [...heroStats];
//                   next[i] = { ...next[i], label: e.target.value };
//                   onChange("heroStats", next);
//                 }}
//                 placeholder="Delivery Time"
//               />
//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 className="md:col-span-2"
//                 onClick={() => onChange("heroStats", heroStats.filter((_, idx) => idx !== i))}
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* SHOWCASE */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Website Showcase" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Title</ReqLabel>
//             <Input value={showcase.title || ""} onChange={(e) => onChange("showcase", { ...showcase, title: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input value={showcase.subtitle || ""} onChange={(e) => onChange("showcase", { ...showcase, subtitle: e.target.value })} />
//           </div>
//         </div>

//         <div>
//           <Label>Body</Label>
//           <TextArea value={showcase.body || ""} onChange={(v) => onChange("showcase", { ...showcase, body: v })} />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <Label>Live URL</Label>
//             <Input value={showcase.liveUrl || ""} onChange={(e) => onChange("showcase", { ...showcase, liveUrl: e.target.value })} />
//           </div>
//           <div>
//             <Label>Live Button Text</Label>
//             <Input value={showcase.liveButtonText || ""} onChange={(e) => onChange("showcase", { ...showcase, liveButtonText: e.target.value })} />
//           </div>

//           {/* ✅ Desktop upload */}
//           <div className="md:col-span-1">
//             <Label>Desktop Image (upload from device)</Label>
//             <input
//               type="file"
//               accept="image/*"
//               className="mt-1"
//               onChange={async (e) => {
//                 const file = e.target.files?.[0];
//                 if (!file) return;
//                 if (!token) return alert("Admin token missing. Please login again.");

//                 try {
//                   const fd = new FormData();
//                   fd.append("image", file);

//                   const res = await fetch("/api/admin/web-case-study/upload-showcase-image", {
//                     method: "POST",
//                     headers: { Authorization: `Bearer ${token}` },
//                     body: fd,
//                   });

//                   const data = await res.json().catch(() => ({}));
//                   if (!res.ok) throw new Error(data?.message || "Upload failed");

//                   onChange("showcase", {
//                     ...showcase,
//                     desktopImageUrl: data.imageUrl,
//                     desktopImagePublicId: data.publicId,
//                     desktopImageAlt: file.name,
//                   });
//                 } catch (err: any) {
//                   console.error(err);
//                   alert(err?.message || "Desktop image upload failed");
//                 }
//               }}
//             />

//             {showcase.desktopImageUrl ? (
//               <div className="mt-2 space-y-2">
//                 <img src={showcase.desktopImageUrl} className="rounded-lg border w-full max-w-md" />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() =>
//                     onChange("showcase", {
//                       ...showcase,
//                       desktopImageUrl: "",
//                       desktopImagePublicId: "",
//                       desktopImageAlt: "",
//                     })
//                   }
//                 >
//                   Remove Desktop Image
//                 </Button>
//               </div>
//             ) : null}
//           </div>

//           {/* ✅ Mobile upload */}
//           <div className="md:col-span-1">
//             <Label>Mobile Image (upload from device)</Label>
//             <input
//               type="file"
//               accept="image/*"
//               className="mt-1"
//               onChange={async (e) => {
//                 const file = e.target.files?.[0];
//                 if (!file) return;
//                 if (!token) return alert("Admin token missing. Please login again.");

//                 try {
//                   const fd = new FormData();
//                   fd.append("image", file);

//                   const res = await fetch("/api/admin/web-case-study/upload-showcase-image", {
//                     method: "POST",
//                     headers: { Authorization: `Bearer ${token}` },
//                     body: fd,
//                   });

//                   const data = await res.json().catch(() => ({}));
//                   if (!res.ok) throw new Error(data?.message || "Upload failed");

//                   onChange("showcase", {
//                     ...showcase,
//                     mobileImageUrl: data.imageUrl,
//                     mobileImagePublicId: data.publicId,
//                     mobileImageAlt: file.name,
//                   });
//                 } catch (err: any) {
//                   console.error(err);
//                   alert(err?.message || "Mobile image upload failed");
//                 }
//               }}
//             />

//             {showcase.mobileImageUrl ? (
//               <div className="mt-2 space-y-2">
//                 <img src={showcase.mobileImageUrl} className="rounded-lg border w-48 mx-auto" />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() =>
//                     onChange("showcase", {
//                       ...showcase,
//                       mobileImageUrl: "",
//                       mobileImagePublicId: "",
//                       mobileImageAlt: "",
//                     })
//                   }
//                 >
//                   Remove Mobile Image
//                 </Button>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>

//       {/* CTA TOP */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Top CTA" />
//         <div>
//           <ReqLabel>Title</ReqLabel>
//           <Input value={ctaTop.title || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, title: e.target.value })} required />
//         </div>
//         <div>
//           <ReqLabel>Body</ReqLabel>
//           <TextArea value={ctaTop.body || ""} onChange={(v) => onChange("ctaTop", { ...ctaTop, body: v })} />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Primary Text</ReqLabel>
//             <Input value={ctaTop.primaryText || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, primaryText: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Primary Href</Label>
//             <Input value={ctaTop.primaryHref || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, primaryHref: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Text</Label>
//             <Input value={ctaTop.secondaryText || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, secondaryText: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Href</Label>
//             <Input value={ctaTop.secondaryHref || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, secondaryHref: e.target.value })} />
//           </div>
//         </div>
//       </div>

//       {/* Challenge */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Challenge" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Challenge Title</ReqLabel>
//             <Input value={form.challengeTitle || ""} onChange={(e) => onChange("challengeTitle", e.target.value)} required />
//           </div>
//           <div>
//             <ReqLabel>Challenge Subtitle</ReqLabel>
//             <Input value={form.challengeSubtitle || ""} onChange={(e) => onChange("challengeSubtitle", e.target.value)} required />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Challenge Points</Label>
//           <Button type="button" variant="outline" size="sm" onClick={() => onChange("challengePoints", [...challengePoints, { iconKey: "XCircle", text: "" }])}>
//             Add Point
//           </Button>
//         </div>

//         {challengePoints.map((p, i) => (
//           <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//             <Input
//               className="md:col-span-3"
//               value={p.iconKey}
//               onChange={(e) => {
//                 const next = [...challengePoints];
//                 next[i] = { ...next[i], iconKey: e.target.value };
//                 onChange("challengePoints", next);
//               }}
//               placeholder="iconKey"
//             />
//             <Input
//               className="md:col-span-7"
//               value={p.text}
//               onChange={(e) => {
//                 const next = [...challengePoints];
//                 next[i] = { ...next[i], text: e.target.value };
//                 onChange("challengePoints", next);
//               }}
//               placeholder="Point text..."
//             />
//             <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => onChange("challengePoints", challengePoints.filter((_, idx) => idx !== i))}>
//               Remove
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* ✅ Before/After (was only “supported in payload” before) */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Before / After" subtitle="Editable comparison rows shown on detail page if your FE renders it." />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Before Title</ReqLabel>
//             <Input
//               value={beforeAfter.beforeTitle || ""}
//               onChange={(e) => onChange("beforeAfter", { ...beforeAfter, beforeTitle: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <ReqLabel>After Title</ReqLabel>
//             <Input
//               value={beforeAfter.afterTitle || ""}
//               onChange={(e) => onChange("beforeAfter", { ...beforeAfter, afterTitle: e.target.value })}
//               required
//             />
//           </div>
//         </div>

//         {/* Before Items */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Before Items</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() =>
//                 onChange("beforeAfter", {
//                   ...beforeAfter,
//                   beforeItems: [...(beforeAfter.beforeItems || []), { label: "", value: "" }],
//                 })
//               }
//             >
//               Add Before Item
//             </Button>
//           </div>

//           {(beforeAfter.beforeItems || []).map((it: any, i: number) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-5"
//                 value={it.label || ""}
//                 onChange={(e) => {
//                   const next = [...(beforeAfter.beforeItems || [])];
//                   next[i] = { ...next[i], label: e.target.value };
//                   onChange("beforeAfter", { ...beforeAfter, beforeItems: next });
//                 }}
//                 placeholder="Label (e.g., Website)"
//               />
//               <Input
//                 className="md:col-span-5"
//                 value={it.value || ""}
//                 onChange={(e) => {
//                   const next = [...(beforeAfter.beforeItems || [])];
//                   next[i] = { ...next[i], value: e.target.value };
//                   onChange("beforeAfter", { ...beforeAfter, beforeItems: next });
//                 }}
//                 placeholder="Value (e.g., None)"
//               />
//               <Button
//                 className="md:col-span-2"
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 onClick={() =>
//                   onChange("beforeAfter", {
//                     ...beforeAfter,
//                     beforeItems: (beforeAfter.beforeItems || []).filter((_: any, idx: number) => idx !== i),
//                   })
//                 }
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>

//         {/* After Items */}
//         <div className="space-y-2 pt-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">After Items</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() =>
//                 onChange("beforeAfter", {
//                   ...beforeAfter,
//                   afterItems: [...(beforeAfter.afterItems || []), { label: "", value: "" }],
//                 })
//               }
//             >
//               Add After Item
//             </Button>
//           </div>

//           {(beforeAfter.afterItems || []).map((it: any, i: number) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-5"
//                 value={it.label || ""}
//                 onChange={(e) => {
//                   const next = [...(beforeAfter.afterItems || [])];
//                   next[i] = { ...next[i], label: e.target.value };
//                   onChange("beforeAfter", { ...beforeAfter, afterItems: next });
//                 }}
//                 placeholder="Label (e.g., Brand)"
//               />
//               <Input
//                 className="md:col-span-5"
//                 value={it.value || ""}
//                 onChange={(e) => {
//                   const next = [...(beforeAfter.afterItems || [])];
//                   next[i] = { ...next[i], value: e.target.value };
//                   onChange("beforeAfter", { ...beforeAfter, afterItems: next });
//                 }}
//                 placeholder="Value (e.g., Professional)"
//               />
//               <Button
//                 className="md:col-span-2"
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 onClick={() =>
//                   onChange("beforeAfter", {
//                     ...beforeAfter,
//                     afterItems: (beforeAfter.afterItems || []).filter((_: any, idx: number) => idx !== i),
//                   })
//                 }
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Overview */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Overview" subtitle="Columns/cards section like PPC pattern." />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Overview Title</ReqLabel>
//             <Input value={form.overviewTitle || ""} onChange={(e) => onChange("overviewTitle", e.target.value)} required />
//           </div>
//           <div>
//             <Label>Overview Subtitle</Label>
//             <Input value={form.overviewSubtitle || ""} onChange={(e) => onChange("overviewSubtitle", e.target.value)} />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Overview Columns</Label>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               onChange("overviewColumns", [
//                 ...overviewColumns,
//                 { iconKey: "Building2", title: "", dotColorClass: "bg-brand-coral", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
//               ])
//             }
//           >
//             Add Column
//           </Button>
//         </div>

//         {overviewColumns.map((c, i) => (
//           <div key={i} className="border rounded-lg p-3 space-y-3 bg-white">
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-semibold text-gray-800">Column #{i + 1}</div>
//               <Button type="button" variant="destructive" size="sm" onClick={() => onChange("overviewColumns", overviewColumns.filter((_, idx) => idx !== i))}>
//                 Remove Column
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <div>
//                 <Label>iconKey</Label>
//                 <Input
//                   value={c.iconKey || ""}
//                   onChange={(e) => {
//                     const next = [...overviewColumns];
//                     next[i] = { ...next[i], iconKey: e.target.value };
//                     onChange("overviewColumns", next);
//                   }}
//                 />
//               </div>
//               <div>
//                 <Label>Title</Label>
//                 <Input
//                   value={c.title || ""}
//                   onChange={(e) => {
//                     const next = [...overviewColumns];
//                     next[i] = { ...next[i], title: e.target.value };
//                     onChange("overviewColumns", next);
//                   }}
//                 />
//               </div>
//               <div>
//                 <Label>dotColorClass</Label>
//                 <Input
//                   value={c.dotColorClass || ""}
//                   onChange={(e) => {
//                     const next = [...overviewColumns];
//                     next[i] = { ...next[i], dotColorClass: e.target.value };
//                     onChange("overviewColumns", next);
//                   }}
//                   placeholder="bg-brand-coral"
//                 />
//               </div>
//             </div>

//             <BulletEditor
//               bullets={c.bullets || []}
//               onChange={(bul) => {
//                 const next = [...overviewColumns];
//                 next[i] = { ...next[i], bullets: bul };
//                 onChange("overviewColumns", next);
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* ✅ Strategy */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Strategy" subtitle="3-column strategy section (with order + tagText) like PPC." />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Strategy Title</ReqLabel>
//             <Input value={form.strategyTitle || ""} onChange={(e) => onChange("strategyTitle", e.target.value)} required />
//           </div>
//           <div>
//             <Label>Strategy Subtitle</Label>
//             <Input value={form.strategySubtitle || ""} onChange={(e) => onChange("strategySubtitle", e.target.value)} />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Strategy Columns</Label>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               onChange("strategyColumns", [
//                 ...strategyColumns,
//                 { order: strategyColumns.length + 1, title: "", tagText: "", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
//               ])
//             }
//           >
//             Add Strategy Column
//           </Button>
//         </div>

//         {strategyColumns.map((c, i) => (
//           <div key={i} className="border rounded-lg p-3 space-y-3 bg-white">
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-semibold text-gray-800">Strategy #{i + 1}</div>
//               <Button type="button" variant="destructive" size="sm" onClick={() => onChange("strategyColumns", strategyColumns.filter((_, idx) => idx !== i))}>
//                 Remove
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <div>
//                 <Label>order</Label>
//                 <Input
//                   type="number"
//                   value={String(c.order ?? i + 1)}
//                   onChange={(e) => {
//                     const next = [...strategyColumns];
//                     next[i] = { ...next[i], order: Number(e.target.value || 0) };
//                     onChange("strategyColumns", next);
//                   }}
//                 />
//               </div>
//               <div>
//                 <Label>title</Label>
//                 <Input
//                   value={c.title || ""}
//                   onChange={(e) => {
//                     const next = [...strategyColumns];
//                     next[i] = { ...next[i], title: e.target.value };
//                     onChange("strategyColumns", next);
//                   }}
//                 />
//               </div>
//               <div>
//                 <Label>tagText</Label>
//                 <Input
//                   value={c.tagText || ""}
//                   onChange={(e) => {
//                     const next = [...strategyColumns];
//                     next[i] = { ...next[i], tagText: e.target.value };
//                     onChange("strategyColumns", next);
//                   }}
//                   placeholder="Speed & Quality"
//                 />
//               </div>
//             </div>

//             <BulletEditor
//               bullets={c.bullets || []}
//               onChange={(bul) => {
//                 const next = [...strategyColumns];
//                 next[i] = { ...next[i], bullets: bul };
//                 onChange("strategyColumns", next);
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* ✅ Features */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Features" subtitle="Core Features + Technical Excellence lists." />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Features Title</ReqLabel>
//             <Input value={form.featuresTitle || ""} onChange={(e) => onChange("featuresTitle", e.target.value)} required />
//           </div>
//           <div>
//             <Label>Features Subtitle</Label>
//             <Input value={form.featuresSubtitle || ""} onChange={(e) => onChange("featuresSubtitle", e.target.value)} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <Label>Core Features Title</Label>
//             <Input value={form.coreFeaturesTitle || ""} onChange={(e) => onChange("coreFeaturesTitle", e.target.value)} placeholder="Core Features" />
//           </div>
//           <div>
//             <Label>Technical Excellence Title</Label>
//             <Input value={form.technicalExcellenceTitle || ""} onChange={(e) => onChange("technicalExcellenceTitle", e.target.value)} placeholder="Technical Excellence" />
//           </div>
//         </div>

//         {/* Core Features */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Core Features</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => onChange("coreFeatures", [...coreFeatures, { iconKey: "Palette", title: "", description: "", color: "#ee4962" }])}
//             >
//               Add Core Feature
//             </Button>
//           </div>

//           {coreFeatures.map((f, i) => (
//             <div key={i} className="border rounded-lg p-3 space-y-2 bg-white">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-semibold text-gray-800">Core Feature #{i + 1}</div>
//                 <Button type="button" variant="destructive" size="sm" onClick={() => onChange("coreFeatures", coreFeatures.filter((_, idx) => idx !== i))}>
//                   Remove
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                 <div>
//                   <Label>iconKey</Label>
//                   <Input
//                     value={f.iconKey || ""}
//                     onChange={(e) => {
//                       const next = [...coreFeatures];
//                       next[i] = { ...next[i], iconKey: e.target.value };
//                       onChange("coreFeatures", next);
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <Label>title</Label>
//                   <Input
//                     value={f.title || ""}
//                     onChange={(e) => {
//                       const next = [...coreFeatures];
//                       next[i] = { ...next[i], title: e.target.value };
//                       onChange("coreFeatures", next);
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <Label>color (optional)</Label>
//                   <Input
//                     value={f.color || ""}
//                     onChange={(e) => {
//                       const next = [...coreFeatures];
//                       next[i] = { ...next[i], color: e.target.value };
//                       onChange("coreFeatures", next);
//                     }}
//                     placeholder="#ee4962"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>description</Label>
//                 <TextArea
//                   value={f.description || ""}
//                   onChange={(v) => {
//                     const next = [...coreFeatures];
//                     next[i] = { ...next[i], description: v };
//                     onChange("coreFeatures", next);
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Technical Excellence */}
//         <div className="space-y-2 pt-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Technical Excellence</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() =>
//                 onChange("technicalExcellence", [...technicalExcellence, { iconKey: "Code", title: "", description: "", color: "#321a66" }])
//               }
//             >
//               Add Technical Feature
//             </Button>
//           </div>

//           {technicalExcellence.map((f, i) => (
//             <div key={i} className="border rounded-lg p-3 space-y-2 bg-white">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-semibold text-gray-800">Technical Feature #{i + 1}</div>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => onChange("technicalExcellence", technicalExcellence.filter((_, idx) => idx !== i))}
//                 >
//                   Remove
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                 <div>
//                   <Label>iconKey</Label>
//                   <Input
//                     value={f.iconKey || ""}
//                     onChange={(e) => {
//                       const next = [...technicalExcellence];
//                       next[i] = { ...next[i], iconKey: e.target.value };
//                       onChange("technicalExcellence", next);
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <Label>title</Label>
//                   <Input
//                     value={f.title || ""}
//                     onChange={(e) => {
//                       const next = [...technicalExcellence];
//                       next[i] = { ...next[i], title: e.target.value };
//                       onChange("technicalExcellence", next);
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <Label>color (optional)</Label>
//                   <Input
//                     value={f.color || ""}
//                     onChange={(e) => {
//                       const next = [...technicalExcellence];
//                       next[i] = { ...next[i], color: e.target.value };
//                       onChange("technicalExcellence", next);
//                     }}
//                     placeholder="#321a66"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>description</Label>
//                 <TextArea
//                   value={f.description || ""}
//                   onChange={(v) => {
//                     const next = [...technicalExcellence];
//                     next[i] = { ...next[i], description: v };
//                     onChange("technicalExcellence", next);
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Mid CTA */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Mid CTA" subtitle="CTA between Strategy/Features and Results." />

//         <div>
//           <ReqLabel>Title</ReqLabel>
//           <Input value={ctaMid.title || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, title: e.target.value })} required />
//         </div>

//         <div>
//           <ReqLabel>Body</ReqLabel>
//           <TextArea value={ctaMid.body || ""} onChange={(v) => onChange("ctaMid", { ...ctaMid, body: v })} />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Primary Text</ReqLabel>
//             <Input value={ctaMid.primaryText || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, primaryText: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Primary Href</Label>
//             <Input value={ctaMid.primaryHref || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, primaryHref: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Text</Label>
//             <Input value={ctaMid.secondaryText || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, secondaryText: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Href</Label>
//             <Input value={ctaMid.secondaryHref || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, secondaryHref: e.target.value })} />
//           </div>
//         </div>
//       </div>

//       {/* ✅ Evaluation */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Evaluation / Results" subtitle="Cards shown in Results section." />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <Label>Evaluation Kicker</Label>
//             <Input value={form.evaluationKicker || ""} onChange={(e) => onChange("evaluationKicker", e.target.value)} />
//           </div>
//           <div>
//             <ReqLabel>Evaluation Title</ReqLabel>
//             <Input value={form.evaluationTitle || ""} onChange={(e) => onChange("evaluationTitle", e.target.value)} required />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Evaluation Cards</Label>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => onChange("evaluationCards", [...evaluationCards, { iconKey: "CheckCircle2", title: "", description: "" }])}
//           >
//             Add Card
//           </Button>
//         </div>

//         {evaluationCards.map((c, i) => (
//           <div key={i} className="border rounded-lg p-3 space-y-2 bg-white">
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-semibold text-gray-800">Card #{i + 1}</div>
//               <Button type="button" variant="destructive" size="sm" onClick={() => onChange("evaluationCards", evaluationCards.filter((_, idx) => idx !== i))}>
//                 Remove
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <div>
//                 <Label>iconKey</Label>
//                 <Input
//                   value={c.iconKey || ""}
//                   onChange={(e) => {
//                     const next = [...evaluationCards];
//                     next[i] = { ...next[i], iconKey: e.target.value };
//                     onChange("evaluationCards", next);
//                   }}
//                 />
//               </div>
//               <div>
//                 <Label>title</Label>
//                 <Input
//                   value={c.title || ""}
//                   onChange={(e) => {
//                     const next = [...evaluationCards];
//                     next[i] = { ...next[i], title: e.target.value };
//                     onChange("evaluationCards", next);
//                   }}
//                 />
//               </div>
//               <div className="md:col-span-3">
//                 <Label>description</Label>
//                 <TextArea
//                   value={c.description || ""}
//                   onChange={(v) => {
//                     const next = [...evaluationCards];
//                     next[i] = { ...next[i], description: v };
//                     onChange("evaluationCards", next);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ✅ Feedback */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Feedback" subtitle="Testimonial + partnership metrics + CTA." />

//         <div>
//           <Label>Feedback Kicker</Label>
//           <Input value={form.feedbackKicker || ""} onChange={(e) => onChange("feedbackKicker", e.target.value)} />
//         </div>

//         <div className="border rounded-lg p-3 bg-white space-y-2">
//           <div className="text-sm font-semibold text-gray-800">Testimonial</div>

//           <div>
//             <ReqLabel>Quote</ReqLabel>
//             <TextArea value={testimonial.quote || ""} onChange={(v) => onChange("testimonial", { ...testimonial, quote: v })} />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//             <div>
//               <ReqLabel>Author Name</ReqLabel>
//               <Input value={testimonial.authorName || ""} onChange={(e) => onChange("testimonial", { ...testimonial, authorName: e.target.value })} required />
//             </div>
//             <div>
//               <Label>Author Role</Label>
//               <Input value={testimonial.authorRole || ""} onChange={(e) => onChange("testimonial", { ...testimonial, authorRole: e.target.value })} />
//             </div>
//             <div>
//               <Label>Rating Text</Label>
//               <Input value={testimonial.ratingText || ""} onChange={(e) => onChange("testimonial", { ...testimonial, ratingText: e.target.value })} placeholder="⭐⭐⭐⭐⭐" />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <Label>Partnership Metrics Title</Label>
//             <Input value={form.partnershipMetricsTitle || ""} onChange={(e) => onChange("partnershipMetricsTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Feedback Primary CTA Text</Label>
//             <Input value={form.feedbackPrimaryCtaText || ""} onChange={(e) => onChange("feedbackPrimaryCtaText", e.target.value)} />
//           </div>
//           <div>
//             <Label>Feedback Primary CTA Href</Label>
//             <Input value={form.feedbackPrimaryCtaHref || ""} onChange={(e) => onChange("feedbackPrimaryCtaHref", e.target.value)} />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Partnership Metrics</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => onChange("partnershipMetrics", [...partnershipMetrics, { iconKey: "Users", label: "", value: "" }])}
//             >
//               Add Metric
//             </Button>
//           </div>

//           {partnershipMetrics.map((m, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-3"
//                 value={m.iconKey || ""}
//                 onChange={(e) => {
//                   const next = [...partnershipMetrics];
//                   next[i] = { ...next[i], iconKey: e.target.value };
//                   onChange("partnershipMetrics", next);
//                 }}
//                 placeholder="iconKey"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={m.label || ""}
//                 onChange={(e) => {
//                   const next = [...partnershipMetrics];
//                   next[i] = { ...next[i], label: e.target.value };
//                   onChange("partnershipMetrics", next);
//                 }}
//                 placeholder="Label"
//               />
//               <Input
//                 className="md:col-span-3"
//                 value={m.value || ""}
//                 onChange={(e) => {
//                   const next = [...partnershipMetrics];
//                   next[i] = { ...next[i], value: e.target.value };
//                   onChange("partnershipMetrics", next);
//                 }}
//                 placeholder="Value"
//               />
//               <Button
//                 className="md:col-span-2"
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => onChange("partnershipMetrics", partnershipMetrics.filter((_, idx) => idx !== i))}
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Final CTA */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Final CTA" />

//         <div>
//           <ReqLabel>Title</ReqLabel>
//           <Input value={finalCta.title || ""} onChange={(e) => onChange("finalCta", { ...finalCta, title: e.target.value })} required />
//         </div>
//         <div>
//           <ReqLabel>Body</ReqLabel>
//           <TextArea value={finalCta.body || ""} onChange={(v) => onChange("finalCta", { ...finalCta, body: v })} />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <ReqLabel>Primary Text</ReqLabel>
//             <Input value={finalCta.primaryText || ""} onChange={(e) => onChange("finalCta", { ...finalCta, primaryText: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Primary Href</Label>
//             <Input value={finalCta.primaryHref || ""} onChange={(e) => onChange("finalCta", { ...finalCta, primaryHref: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Text</Label>
//             <Input value={finalCta.secondaryText || ""} onChange={(e) => onChange("finalCta", { ...finalCta, secondaryText: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Href</Label>
//             <Input value={finalCta.secondaryHref || ""} onChange={(e) => onChange("finalCta", { ...finalCta, secondaryHref: e.target.value })} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }













import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldErrors = Record<string, string>;

// ✅ Required label helper (adds *)
function ReqLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

// -------- Types --------
export type WebHeroStat = { value: string; label: string; iconKey?: string };

export type WebShowcase = {
  title: string;
  subtitle?: string;
  body?: string;
  liveUrl?: string;
  liveButtonText?: string;

  desktopImageUrl?: string;
  desktopImageAlt?: string;
  desktopImagePublicId?: string;

  mobileImageUrl?: string;
  mobileImageAlt?: string;
  mobileImagePublicId?: string;
};

export type WebCtaBlock = {
  title: string;
  body: string;
  primaryText: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
};

export type WebChallengePoint = { iconKey: string; text: string };

export type WebBeforeAfterItem = { label: string; value: string };
export type WebBeforeAfterBlock = {
  beforeTitle: string;
  afterTitle: string;
  beforeItems: WebBeforeAfterItem[];
  afterItems: WebBeforeAfterItem[];
};

export type WebOverviewColumn = {
  iconKey: string;
  title: string;
  dotColorClass?: string;
  bullets: { iconKey: string; text: string }[];
};

export type WebStrategyColumn = {
  order: number;
  title: string;
  tagText?: string;
  bullets: { iconKey: string; text: string }[];
};

export type WebFeatureItem = {
  iconKey: string;
  title: string;
  description: string;
  color?: string;
};

export type WebEvaluationCard = { iconKey: string; title: string; description: string };

export type WebTestimonial = {
  quote: string;
  authorName: string;
  authorRole?: string;
  ratingText?: string;
};

export type WebPartnershipMetric = { iconKey: string; label: string; value: string };

export type WebCaseStudyDetailTabValues = {
  cardId?: string;

  heroBadgeText?: string;
  heroTitle?: string;
  heroRatingText?: string;
  heroDescription?: string;
  heroStats?: WebHeroStat[];
  heroPrimaryCtaText?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  showcase?: WebShowcase;

  ctaTop?: WebCtaBlock;

  challengeTitle?: string;
  challengeSubtitle?: string;
  challengePoints?: WebChallengePoint[];
  beforeAfter?: WebBeforeAfterBlock;

  overviewTitle?: string;
  overviewSubtitle?: string;
  overviewColumns?: WebOverviewColumn[];

  strategyTitle?: string;
  strategySubtitle?: string;
  strategyColumns?: WebStrategyColumn[];

  featuresTitle?: string;
  featuresSubtitle?: string;
  coreFeaturesTitle?: string;
  coreFeatures?: WebFeatureItem[];
  technicalExcellenceTitle?: string;
  technicalExcellence?: WebFeatureItem[];

  ctaMid?: WebCtaBlock;

  evaluationKicker?: string;
  evaluationTitle?: string;
  evaluationCards?: WebEvaluationCard[];

  feedbackKicker?: string;
  testimonial?: WebTestimonial;
  partnershipMetricsTitle?: string;
  partnershipMetrics?: WebPartnershipMetric[];
  feedbackPrimaryCtaText?: string;
  feedbackPrimaryCtaHref?: string;

  finalCta?: WebCtaBlock;
};

type CardOption = { _id: string; slug: string; title: string; client: string; industry: string };

function TextArea({
  value,
  onChange,
  placeholder,
  fieldKey,
  errors,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  fieldKey?: string;
  errors?: FieldErrors;
}) {
  const hasErr = fieldKey ? Boolean(errors?.[fieldKey]) : false;
  return (
    <>
      <textarea
        data-field={fieldKey}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-md p-2 mt-1 min-h-[84px] ${hasErr ? "border-red-500 focus-visible:ring-red-500" : ""}`}
      />
      {fieldKey && errors?.[fieldKey] ? <div className="text-xs text-red-600 mt-1">{errors[fieldKey]}</div> : null}
    </>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-sm font-semibold text-brand-purple">{title}</div>
      {subtitle ? <div className="text-xs text-gray-500">{subtitle}</div> : null}
    </div>
  );
}

// Small helper for bullets editor (used by overview + strategy)
function BulletEditor({
  bullets,
  onChange,
  addDefault = { iconKey: "CheckCircle2", text: "" },
  baseKey,
  errors,
}: {
  bullets: { iconKey: string; text: string }[];
  onChange: (next: { iconKey: string; text: string }[]) => void;
  addDefault?: { iconKey: string; text: string };
  baseKey: string; // ex: "overviewColumns.0.bullets"
  errors?: FieldErrors;
}) {
  const errClass = (key: string) => (errors?.[key] ? "border-red-500 focus-visible:ring-red-500" : "");
  const errText = (key: string) => (errors?.[key] ? <div className="text-xs text-red-600 mt-1">{errors[key]}</div> : null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-semibold">Bullets</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...(bullets || []), { ...addDefault }])}>
          Add Bullet
        </Button>
      </div>

      {(bullets || []).map((b, bi) => {
        const textKey = `${baseKey}.${bi}.text`;
        return (
          <div key={bi} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input
              className="md:col-span-3"
              value={b.iconKey || ""}
              onChange={(e) => {
                const next = [...(bullets || [])];
                next[bi] = { ...next[bi], iconKey: e.target.value };
                onChange(next);
              }}
              placeholder="iconKey"
            />
            <div className="md:col-span-7">
              <Input
                data-field={textKey}
                className={errClass(textKey)}
                value={b.text || ""}
                onChange={(e) => {
                  const next = [...(bullets || [])];
                  next[bi] = { ...next[bi], text: e.target.value };
                  onChange(next);
                }}
                placeholder="Bullet text..."
              />
              {errText(textKey)}
            </div>
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => onChange((bullets || []).filter((_, idx) => idx !== bi))}>
              Remove
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function WebCaseStudyDetailTab({
  form,
  onChange,
  cardOptions,
  errors = {},
}: {
  form: WebCaseStudyDetailTabValues;
  onChange: (field: keyof WebCaseStudyDetailTabValues, value: any) => void;
  cardOptions: CardOption[];
  errors?: FieldErrors;
}) {
  // ✅ FIX: token was missing
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const heroStats = form.heroStats || [];
  const challengePoints = form.challengePoints || [];
  const overviewColumns = form.overviewColumns || [];
  const strategyColumns = form.strategyColumns || [];
  const coreFeatures = form.coreFeatures || [];
  const technicalExcellence = form.technicalExcellence || [];
  const evaluationCards = form.evaluationCards || [];
  const partnershipMetrics = form.partnershipMetrics || [];

  const showcase = form.showcase || ({} as any);
  const ctaTop = form.ctaTop || ({} as any);
  const beforeAfter = form.beforeAfter || ({} as any);
  const ctaMid = form.ctaMid || ({} as any);
  const testimonial = form.testimonial || ({} as any);
  const finalCta = form.finalCta || ({} as any);

  const errClass = (key: string) => (errors?.[key] ? "border-red-500 focus-visible:ring-red-500" : "");
  const errText = (key: string) => (errors?.[key] ? <div className="text-xs text-red-600 mt-1">{errors[key]}</div> : null);

  return (
    <div className="space-y-5 mt-4">
      <SectionTitle title="Detail Page Fields" subtitle="Controls the full /case-studies/:slug page content." />

      {/* FK selector */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <SectionTitle title="Link Detail to Existing Web Case Study" subtitle="Pick which card this detail belongs to." />
        <div>
          <ReqLabel>Select Web Case Study</ReqLabel>
          <select
            data-field="cardId"
            value={form.cardId || ""}
            onChange={(e) => onChange("cardId", e.target.value)}
            className={`w-full border border-gray-300 rounded-md p-2 mt-1 bg-white ${errors?.["cardId"] ? "border-red-500" : ""}`}
          >
            <option value="">-- Select a Card --</option>
            {cardOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} • {c.client} • ({c.slug})
              </option>
            ))}
          </select>

          {errText("cardId")}
          {!form.cardId ? <div className="text-xs text-amber-600 mt-1">⚠️ Select a card first, then save detail.</div> : null}
        </div>
      </div>

      {/* HERO */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Hero" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ReqLabel>Hero Badge Text</ReqLabel>
            <Input data-field="heroBadgeText" className={errClass("heroBadgeText")} value={form.heroBadgeText || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} required />
            {errText("heroBadgeText")}
          </div>
          <div>
            <ReqLabel>Hero Title</ReqLabel>
            <Input data-field="heroTitle" className={errClass("heroTitle")} value={form.heroTitle || ""} onChange={(e) => onChange("heroTitle", e.target.value)} required />
            {errText("heroTitle")}
          </div>
          <div>
            <Label>Hero Rating Text</Label>
            <Input value={form.heroRatingText || ""} onChange={(e) => onChange("heroRatingText", e.target.value)} />
          </div>
          <div>
            <ReqLabel>Hero Primary CTA Text</ReqLabel>
            <Input data-field="heroPrimaryCtaText" className={errClass("heroPrimaryCtaText")} value={form.heroPrimaryCtaText || ""} onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)} required />
            {errText("heroPrimaryCtaText")}
          </div>
          <div>
            <Label>Hero Primary CTA Href</Label>
            <Input value={form.heroPrimaryCtaHref || ""} onChange={(e) => onChange("heroPrimaryCtaHref", e.target.value)} />
          </div>
          <div>
            <Label>Hero Secondary CTA Text</Label>
            <Input value={form.heroSecondaryCtaText || ""} onChange={(e) => onChange("heroSecondaryCtaText", e.target.value)} />
          </div>
          <div>
            <Label>Hero Secondary CTA Href</Label>
            <Input value={form.heroSecondaryCtaHref || ""} onChange={(e) => onChange("heroSecondaryCtaHref", e.target.value)} />
          </div>
          <div>
            <Label>Hero Video URL (optional)</Label>
            <Input value={form.heroVideoUrl || ""} onChange={(e) => onChange("heroVideoUrl", e.target.value)} />
          </div>
          <div>
            <Label>Hero Video Poster (optional)</Label>
            <Input value={form.heroVideoPoster || ""} onChange={(e) => onChange("heroVideoPoster", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Hero Video Badge Text</Label>
            <Input value={form.heroVideoBadgeText || ""} onChange={(e) => onChange("heroVideoBadgeText", e.target.value)} />
          </div>
        </div>

        <div>
          <ReqLabel>Hero Description</ReqLabel>
          <TextArea value={String(form.heroDescription || "")} onChange={(v) => onChange("heroDescription", v)} fieldKey="heroDescription" errors={errors} />
        </div>

        {/* HERO STATS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Hero Stats</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("heroStats", [...heroStats, { value: "", label: "", iconKey: "CheckCircle2" }])}>
              Add Stat
            </Button>
          </div>

          {heroStats.map((s, i) => {
            const valueKey = `heroStats.${i}.value`;
            const labelKey = `heroStats.${i}.label`;

            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <Input
                  className="md:col-span-3"
                  value={s.iconKey || ""}
                  onChange={(e) => {
                    const next = [...heroStats];
                    next[i] = { ...next[i], iconKey: e.target.value };
                    onChange("heroStats", next);
                  }}
                  placeholder="iconKey (TrendingUp, CheckCircle2...)"
                />

                <div className="md:col-span-3">
                  <Input
                    data-field={valueKey}
                    className={errClass(valueKey)}
                    value={s.value}
                    onChange={(e) => {
                      const next = [...heroStats];
                      next[i] = { ...next[i], value: e.target.value };
                      onChange("heroStats", next);
                    }}
                    placeholder="48hrs"
                  />
                  {errText(valueKey)}
                </div>

                <div className="md:col-span-4">
                  <Input
                    data-field={labelKey}
                    className={errClass(labelKey)}
                    value={s.label}
                    onChange={(e) => {
                      const next = [...heroStats];
                      next[i] = { ...next[i], label: e.target.value };
                      onChange("heroStats", next);
                    }}
                    placeholder="Delivery Time"
                  />
                  {errText(labelKey)}
                </div>

                <Button type="button" variant="destructive" size="sm" className="md:col-span-2" onClick={() => onChange("heroStats", heroStats.filter((_, idx) => idx !== i))}>
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SHOWCASE */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Website Showcase" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Title</ReqLabel>
            <Input data-field="showcase.title" className={errClass("showcase.title")} value={showcase.title || ""} onChange={(e) => onChange("showcase", { ...showcase, title: e.target.value })} required />
            {errText("showcase.title")}
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={showcase.subtitle || ""} onChange={(e) => onChange("showcase", { ...showcase, subtitle: e.target.value })} />
          </div>
        </div>

        <div>
          <Label>Body</Label>
          <TextArea value={showcase.body || ""} onChange={(v) => onChange("showcase", { ...showcase, body: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>Live URL</Label>
            <Input value={showcase.liveUrl || ""} onChange={(e) => onChange("showcase", { ...showcase, liveUrl: e.target.value })} />
          </div>
          <div>
            <Label>Live Button Text</Label>
            <Input value={showcase.liveButtonText || ""} onChange={(e) => onChange("showcase", { ...showcase, liveButtonText: e.target.value })} />
          </div>

          {/* ✅ Desktop upload */}
          <div className="md:col-span-1">
            <Label>Desktop Image (upload from device)</Label>
            <input
              type="file"
              accept="image/*"
              className="mt-1"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!token) return alert("Admin token missing. Please login again.");

                try {
                  const fd = new FormData();
                  fd.append("image", file);

                  const res = await fetch("/api/admin/web-case-study/upload-showcase-image", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                  });

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) throw new Error(data?.message || "Upload failed");

                  onChange("showcase", {
                    ...showcase,
                    desktopImageUrl: data.imageUrl,
                    desktopImagePublicId: data.publicId,
                    desktopImageAlt: file.name,
                  });
                } catch (err: any) {
                  console.error(err);
                  alert(err?.message || "Desktop image upload failed");
                }
              }}
            />

            {showcase.desktopImageUrl ? (
              <div className="mt-2 space-y-2">
                <img src={showcase.desktopImageUrl} className="rounded-lg border w-full max-w-md" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onChange("showcase", {
                      ...showcase,
                      desktopImageUrl: "",
                      desktopImagePublicId: "",
                      desktopImageAlt: "",
                    })
                  }
                >
                  Remove Desktop Image
                </Button>
              </div>
            ) : null}
          </div>

          {/* ✅ Mobile upload */}
          <div className="md:col-span-1">
            <Label>Mobile Image (upload from device)</Label>
            <input
              type="file"
              accept="image/*"
              className="mt-1"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!token) return alert("Admin token missing. Please login again.");

                try {
                  const fd = new FormData();
                  fd.append("image", file);

                  const res = await fetch("/api/admin/web-case-study/upload-showcase-image", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                  });

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) throw new Error(data?.message || "Upload failed");

                  onChange("showcase", {
                    ...showcase,
                    mobileImageUrl: data.imageUrl,
                    mobileImagePublicId: data.publicId,
                    mobileImageAlt: file.name,
                  });
                } catch (err: any) {
                  console.error(err);
                  alert(err?.message || "Mobile image upload failed");
                }
              }}
            />

            {showcase.mobileImageUrl ? (
              <div className="mt-2 space-y-2">
                <img src={showcase.mobileImageUrl} className="rounded-lg border w-48 mx-auto" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onChange("showcase", {
                      ...showcase,
                      mobileImageUrl: "",
                      mobileImagePublicId: "",
                      mobileImageAlt: "",
                    })
                  }
                >
                  Remove Mobile Image
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* CTA TOP */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Top CTA" />
        <div>
          <ReqLabel>Title</ReqLabel>
          <Input data-field="ctaTop.title" className={errClass("ctaTop.title")} value={ctaTop.title || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, title: e.target.value })} required />
          {errText("ctaTop.title")}
        </div>
        <div>
          <ReqLabel>Body</ReqLabel>
          <TextArea value={ctaTop.body || ""} onChange={(v) => onChange("ctaTop", { ...ctaTop, body: v })} fieldKey="ctaTop.body" errors={errors} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Primary Text</ReqLabel>
            <Input data-field="ctaTop.primaryText" className={errClass("ctaTop.primaryText")} value={ctaTop.primaryText || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, primaryText: e.target.value })} required />
            {errText("ctaTop.primaryText")}
          </div>
          <div>
            <Label>Primary Href</Label>
            <Input value={ctaTop.primaryHref || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, primaryHref: e.target.value })} />
          </div>
          <div>
            <Label>Secondary Text</Label>
            <Input value={ctaTop.secondaryText || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, secondaryText: e.target.value })} />
          </div>
          <div>
            <Label>Secondary Href</Label>
            <Input value={ctaTop.secondaryHref || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, secondaryHref: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Challenge" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Challenge Title</ReqLabel>
            <Input data-field="challengeTitle" className={errClass("challengeTitle")} value={form.challengeTitle || ""} onChange={(e) => onChange("challengeTitle", e.target.value)} required />
            {errText("challengeTitle")}
          </div>
          <div>
            <ReqLabel>Challenge Subtitle</ReqLabel>
            <Input data-field="challengeSubtitle" className={errClass("challengeSubtitle")} value={form.challengeSubtitle || ""} onChange={(e) => onChange("challengeSubtitle", e.target.value)} required />
            {errText("challengeSubtitle")}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Challenge Points</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange("challengePoints", [...challengePoints, { iconKey: "XCircle", text: "" }])}>
            Add Point
          </Button>
        </div>

        {challengePoints.map((p, i) => {
          const textKey = `challengePoints.${i}.text`;
          return (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-3"
                value={p.iconKey}
                onChange={(e) => {
                  const next = [...challengePoints];
                  next[i] = { ...next[i], iconKey: e.target.value };
                  onChange("challengePoints", next);
                }}
                placeholder="iconKey"
              />
              <div className="md:col-span-7">
                <Input
                  data-field={textKey}
                  className={errClass(textKey)}
                  value={p.text}
                  onChange={(e) => {
                    const next = [...challengePoints];
                    next[i] = { ...next[i], text: e.target.value };
                    onChange("challengePoints", next);
                  }}
                  placeholder="Point text..."
                />
                {errText(textKey)}
              </div>
              <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => onChange("challengePoints", challengePoints.filter((_, idx) => idx !== i))}>
                Remove
              </Button>
            </div>
          );
        })}
      </div>

      {/* Before/After */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Before / After" subtitle="Editable comparison rows shown on detail page if your FE renders it." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Before Title</ReqLabel>
            <Input data-field="beforeAfter.beforeTitle" className={errClass("beforeAfter.beforeTitle")} value={beforeAfter.beforeTitle || ""} onChange={(e) => onChange("beforeAfter", { ...beforeAfter, beforeTitle: e.target.value })} required />
            {errText("beforeAfter.beforeTitle")}
          </div>
          <div>
            <ReqLabel>After Title</ReqLabel>
            <Input data-field="beforeAfter.afterTitle" className={errClass("beforeAfter.afterTitle")} value={beforeAfter.afterTitle || ""} onChange={(e) => onChange("beforeAfter", { ...beforeAfter, afterTitle: e.target.value })} required />
            {errText("beforeAfter.afterTitle")}
          </div>
        </div>

        {/* Before Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Before Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("beforeAfter", { ...beforeAfter, beforeItems: [...(beforeAfter.beforeItems || []), { label: "", value: "" }] })}>
              Add Before Item
            </Button>
          </div>

          {(beforeAfter.beforeItems || []).map((it: any, i: number) => {
            const labelKey = `beforeAfter.beforeItems.${i}.label`;
            const valueKey = `beforeAfter.beforeItems.${i}.value`;
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-5">
                  <Input
                    data-field={labelKey}
                    className={errClass(labelKey)}
                    value={it.label || ""}
                    onChange={(e) => {
                      const next = [...(beforeAfter.beforeItems || [])];
                      next[i] = { ...next[i], label: e.target.value };
                      onChange("beforeAfter", { ...beforeAfter, beforeItems: next });
                    }}
                    placeholder="Label (e.g., Website)"
                  />
                  {errText(labelKey)}
                </div>
                <div className="md:col-span-5">
                  <Input
                    data-field={valueKey}
                    className={errClass(valueKey)}
                    value={it.value || ""}
                    onChange={(e) => {
                      const next = [...(beforeAfter.beforeItems || [])];
                      next[i] = { ...next[i], value: e.target.value };
                      onChange("beforeAfter", { ...beforeAfter, beforeItems: next });
                    }}
                    placeholder="Value (e.g., None)"
                  />
                  {errText(valueKey)}
                </div>
                <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => onChange("beforeAfter", { ...beforeAfter, beforeItems: (beforeAfter.beforeItems || []).filter((_: any, idx: number) => idx !== i) })}>
                  Remove
                </Button>
              </div>
            );
          })}
        </div>

        {/* After Items */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">After Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("beforeAfter", { ...beforeAfter, afterItems: [...(beforeAfter.afterItems || []), { label: "", value: "" }] })}>
              Add After Item
            </Button>
          </div>

          {(beforeAfter.afterItems || []).map((it: any, i: number) => {
            const labelKey = `beforeAfter.afterItems.${i}.label`;
            const valueKey = `beforeAfter.afterItems.${i}.value`;
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-5">
                  <Input
                    data-field={labelKey}
                    className={errClass(labelKey)}
                    value={it.label || ""}
                    onChange={(e) => {
                      const next = [...(beforeAfter.afterItems || [])];
                      next[i] = { ...next[i], label: e.target.value };
                      onChange("beforeAfter", { ...beforeAfter, afterItems: next });
                    }}
                    placeholder="Label (e.g., Brand)"
                  />
                  {errText(labelKey)}
                </div>
                <div className="md:col-span-5">
                  <Input
                    data-field={valueKey}
                    className={errClass(valueKey)}
                    value={it.value || ""}
                    onChange={(e) => {
                      const next = [...(beforeAfter.afterItems || [])];
                      next[i] = { ...next[i], value: e.target.value };
                      onChange("beforeAfter", { ...beforeAfter, afterItems: next });
                    }}
                    placeholder="Value (e.g., Professional)"
                  />
                  {errText(valueKey)}
                </div>
                <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => onChange("beforeAfter", { ...beforeAfter, afterItems: (beforeAfter.afterItems || []).filter((_: any, idx: number) => idx !== i) })}>
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Overview" subtitle="Columns/cards section like PPC pattern." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Overview Title</ReqLabel>
            <Input data-field="overviewTitle" className={errClass("overviewTitle")} value={form.overviewTitle || ""} onChange={(e) => onChange("overviewTitle", e.target.value)} required />
            {errText("overviewTitle")}
          </div>
          <div>
            <Label>Overview Subtitle</Label>
            <Input value={form.overviewSubtitle || ""} onChange={(e) => onChange("overviewSubtitle", e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Overview Columns</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange("overviewColumns", [
                ...overviewColumns,
                { iconKey: "Building2", title: "", dotColorClass: "bg-brand-coral", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
              ])
            }
          >
            Add Column
          </Button>
        </div>

        {overviewColumns.map((c, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">Column #{i + 1}</div>
              <Button type="button" variant="destructive" size="sm" onClick={() => onChange("overviewColumns", overviewColumns.filter((_, idx) => idx !== i))}>
                Remove Column
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label>iconKey</Label>
                <Input
                  value={c.iconKey || ""}
                  onChange={(e) => {
                    const next = [...overviewColumns];
                    next[i] = { ...next[i], iconKey: e.target.value };
                    onChange("overviewColumns", next);
                  }}
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={c.title || ""}
                  onChange={(e) => {
                    const next = [...overviewColumns];
                    next[i] = { ...next[i], title: e.target.value };
                    onChange("overviewColumns", next);
                  }}
                />
              </div>
              <div>
                <Label>dotColorClass</Label>
                <Input
                  value={c.dotColorClass || ""}
                  onChange={(e) => {
                    const next = [...overviewColumns];
                    next[i] = { ...next[i], dotColorClass: e.target.value };
                    onChange("overviewColumns", next);
                  }}
                  placeholder="bg-brand-coral"
                />
              </div>
            </div>

            <BulletEditor bullets={c.bullets || []} onChange={(bul) => {
              const next = [...overviewColumns];
              next[i] = { ...next[i], bullets: bul };
              onChange("overviewColumns", next);
            }} baseKey={`overviewColumns.${i}.bullets`} errors={errors} />
          </div>
        ))}
      </div>

      {/* Strategy */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Strategy" subtitle="3-column strategy section (with order + tagText) like PPC." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Strategy Title</ReqLabel>
            <Input data-field="strategyTitle" className={errClass("strategyTitle")} value={form.strategyTitle || ""} onChange={(e) => onChange("strategyTitle", e.target.value)} required />
            {errText("strategyTitle")}
          </div>
          <div>
            <Label>Strategy Subtitle</Label>
            <Input value={form.strategySubtitle || ""} onChange={(e) => onChange("strategySubtitle", e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Strategy Columns</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange("strategyColumns", [
                ...strategyColumns,
                { order: strategyColumns.length + 1, title: "", tagText: "", bullets: [{ iconKey: "CheckCircle2", text: "" }] },
              ])
            }
          >
            Add Strategy Column
          </Button>
        </div>

        {strategyColumns.map((c, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">Strategy #{i + 1}</div>
              <Button type="button" variant="destructive" size="sm" onClick={() => onChange("strategyColumns", strategyColumns.filter((_, idx) => idx !== i))}>
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label>order</Label>
                <Input
                  type="number"
                  value={String(c.order ?? i + 1)}
                  onChange={(e) => {
                    const next = [...strategyColumns];
                    next[i] = { ...next[i], order: Number(e.target.value || 0) };
                    onChange("strategyColumns", next);
                  }}
                />
              </div>
              <div>
                <Label>title</Label>
                <Input
                  value={c.title || ""}
                  onChange={(e) => {
                    const next = [...strategyColumns];
                    next[i] = { ...next[i], title: e.target.value };
                    onChange("strategyColumns", next);
                  }}
                />
              </div>
              <div>
                <Label>tagText</Label>
                <Input
                  value={c.tagText || ""}
                  onChange={(e) => {
                    const next = [...strategyColumns];
                    next[i] = { ...next[i], tagText: e.target.value };
                    onChange("strategyColumns", next);
                  }}
                  placeholder="Speed & Quality"
                />
              </div>
            </div>

            <BulletEditor bullets={c.bullets || []} onChange={(bul) => {
              const next = [...strategyColumns];
              next[i] = { ...next[i], bullets: bul };
              onChange("strategyColumns", next);
            }} baseKey={`strategyColumns.${i}.bullets`} errors={errors} />
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Features" subtitle="Core Features + Technical Excellence lists." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Features Title</ReqLabel>
            <Input data-field="featuresTitle" className={errClass("featuresTitle")} value={form.featuresTitle || ""} onChange={(e) => onChange("featuresTitle", e.target.value)} required />
            {errText("featuresTitle")}
          </div>
          <div>
            <Label>Features Subtitle</Label>
            <Input value={form.featuresSubtitle || ""} onChange={(e) => onChange("featuresSubtitle", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>Core Features Title</Label>
            <Input value={form.coreFeaturesTitle || ""} onChange={(e) => onChange("coreFeaturesTitle", e.target.value)} placeholder="Core Features" />
          </div>
          <div>
            <Label>Technical Excellence Title</Label>
            <Input value={form.technicalExcellenceTitle || ""} onChange={(e) => onChange("technicalExcellenceTitle", e.target.value)} placeholder="Technical Excellence" />
          </div>
        </div>

        {/* Core Features */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Core Features</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("coreFeatures", [...coreFeatures, { iconKey: "Palette", title: "", description: "", color: "#ee4962" }])}>
              Add Core Feature
            </Button>
          </div>

          {coreFeatures.map((f, i) => {
            const titleKey = `coreFeatures.${i}.title`;
            const descKey = `coreFeatures.${i}.description`;

            return (
              <div key={i} className="border rounded-lg p-3 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-800">Core Feature #{i + 1}</div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => onChange("coreFeatures", coreFeatures.filter((_, idx) => idx !== i))}>
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <Label>iconKey</Label>
                    <Input
                      value={f.iconKey || ""}
                      onChange={(e) => {
                        const next = [...coreFeatures];
                        next[i] = { ...next[i], iconKey: e.target.value };
                        onChange("coreFeatures", next);
                      }}
                    />
                  </div>
                  <div>
                    <Label>title</Label>
                    <Input
                      data-field={titleKey}
                      className={errClass(titleKey)}
                      value={f.title || ""}
                      onChange={(e) => {
                        const next = [...coreFeatures];
                        next[i] = { ...next[i], title: e.target.value };
                        onChange("coreFeatures", next);
                      }}
                    />
                    {errText(titleKey)}
                  </div>
                  <div>
                    <Label>color (optional)</Label>
                    <Input
                      value={f.color || ""}
                      onChange={(e) => {
                        const next = [...coreFeatures];
                        next[i] = { ...next[i], color: e.target.value };
                        onChange("coreFeatures", next);
                      }}
                      placeholder="#ee4962"
                    />
                  </div>
                </div>

                <div>
                  <Label>description</Label>
                  <TextArea
                    value={f.description || ""}
                    onChange={(v) => {
                      const next = [...coreFeatures];
                      next[i] = { ...next[i], description: v };
                      onChange("coreFeatures", next);
                    }}
                    fieldKey={descKey}
                    errors={errors}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Excellence */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Technical Excellence</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("technicalExcellence", [...technicalExcellence, { iconKey: "Code", title: "", description: "", color: "#321a66" }])}>
              Add Technical Feature
            </Button>
          </div>

          {technicalExcellence.map((f, i) => {
            const titleKey = `technicalExcellence.${i}.title`;
            const descKey = `technicalExcellence.${i}.description`;

            return (
              <div key={i} className="border rounded-lg p-3 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-800">Technical Feature #{i + 1}</div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => onChange("technicalExcellence", technicalExcellence.filter((_, idx) => idx !== i))}>
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <Label>iconKey</Label>
                    <Input
                      value={f.iconKey || ""}
                      onChange={(e) => {
                        const next = [...technicalExcellence];
                        next[i] = { ...next[i], iconKey: e.target.value };
                        onChange("technicalExcellence", next);
                      }}
                    />
                  </div>
                  <div>
                    <Label>title</Label>
                    <Input
                      data-field={titleKey}
                      className={errClass(titleKey)}
                      value={f.title || ""}
                      onChange={(e) => {
                        const next = [...technicalExcellence];
                        next[i] = { ...next[i], title: e.target.value };
                        onChange("technicalExcellence", next);
                      }}
                    />
                    {errText(titleKey)}
                  </div>
                  <div>
                    <Label>color (optional)</Label>
                    <Input
                      value={f.color || ""}
                      onChange={(e) => {
                        const next = [...technicalExcellence];
                        next[i] = { ...next[i], color: e.target.value };
                        onChange("technicalExcellence", next);
                      }}
                      placeholder="#321a66"
                    />
                  </div>
                </div>

                <div>
                  <Label>description</Label>
                  <TextArea
                    value={f.description || ""}
                    onChange={(v) => {
                      const next = [...technicalExcellence];
                      next[i] = { ...next[i], description: v };
                      onChange("technicalExcellence", next);
                    }}
                    fieldKey={descKey}
                    errors={errors}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mid CTA */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Mid CTA" subtitle="CTA between Strategy/Features and Results." />

        <div>
          <ReqLabel>Title</ReqLabel>
          <Input data-field="ctaMid.title" className={errClass("ctaMid.title")} value={ctaMid.title || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, title: e.target.value })} required />
          {errText("ctaMid.title")}
        </div>

        <div>
          <ReqLabel>Body</ReqLabel>
          <TextArea value={ctaMid.body || ""} onChange={(v) => onChange("ctaMid", { ...ctaMid, body: v })} fieldKey="ctaMid.body" errors={errors} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Primary Text</ReqLabel>
            <Input data-field="ctaMid.primaryText" className={errClass("ctaMid.primaryText")} value={ctaMid.primaryText || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, primaryText: e.target.value })} required />
            {errText("ctaMid.primaryText")}
          </div>
          <div>
            <Label>Primary Href</Label>
            <Input value={ctaMid.primaryHref || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, primaryHref: e.target.value })} />
          </div>
          <div>
            <Label>Secondary Text</Label>
            <Input value={ctaMid.secondaryText || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, secondaryText: e.target.value })} />
          </div>
          <div>
            <Label>Secondary Href</Label>
            <Input value={ctaMid.secondaryHref || ""} onChange={(e) => onChange("ctaMid", { ...ctaMid, secondaryHref: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Evaluation */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Evaluation / Results" subtitle="Cards shown in Results section." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>Evaluation Kicker</Label>
            <Input value={form.evaluationKicker || ""} onChange={(e) => onChange("evaluationKicker", e.target.value)} />
          </div>
          <div>
            <ReqLabel>Evaluation Title</ReqLabel>
            <Input data-field="evaluationTitle" className={errClass("evaluationTitle")} value={form.evaluationTitle || ""} onChange={(e) => onChange("evaluationTitle", e.target.value)} required />
            {errText("evaluationTitle")}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Evaluation Cards</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange("evaluationCards", [...evaluationCards, { iconKey: "CheckCircle2", title: "", description: "" }])}>
            Add Card
          </Button>
        </div>

        {evaluationCards.map((c, i) => {
          const titleKey = `evaluationCards.${i}.title`;
          const descKey = `evaluationCards.${i}.description`;

          return (
            <div key={i} className="border rounded-lg p-3 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-800">Card #{i + 1}</div>
                <Button type="button" variant="destructive" size="sm" onClick={() => onChange("evaluationCards", evaluationCards.filter((_, idx) => idx !== i))}>
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <Label>iconKey</Label>
                  <Input
                    value={c.iconKey || ""}
                    onChange={(e) => {
                      const next = [...evaluationCards];
                      next[i] = { ...next[i], iconKey: e.target.value };
                      onChange("evaluationCards", next);
                    }}
                  />
                </div>
                <div>
                  <Label>title</Label>
                  <Input
                    data-field={titleKey}
                    className={errClass(titleKey)}
                    value={c.title || ""}
                    onChange={(e) => {
                      const next = [...evaluationCards];
                      next[i] = { ...next[i], title: e.target.value };
                      onChange("evaluationCards", next);
                    }}
                  />
                  {errText(titleKey)}
                </div>
                <div className="md:col-span-3">
                  <Label>description</Label>
                  <TextArea
                    value={c.description || ""}
                    onChange={(v) => {
                      const next = [...evaluationCards];
                      next[i] = { ...next[i], description: v };
                      onChange("evaluationCards", next);
                    }}
                    fieldKey={descKey}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Feedback" subtitle="Testimonial + partnership metrics + CTA." />

        <div>
          <Label>Feedback Kicker</Label>
          <Input value={form.feedbackKicker || ""} onChange={(e) => onChange("feedbackKicker", e.target.value)} />
        </div>

        <div className="border rounded-lg p-3 bg-white space-y-2">
          <div className="text-sm font-semibold text-gray-800">Testimonial</div>

          <div>
            <ReqLabel>Quote</ReqLabel>
            <TextArea value={testimonial.quote || ""} onChange={(v) => onChange("testimonial", { ...testimonial, quote: v })} fieldKey="testimonial.quote" errors={errors} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <ReqLabel>Author Name</ReqLabel>
              <Input data-field="testimonial.authorName" className={errClass("testimonial.authorName")} value={testimonial.authorName || ""} onChange={(e) => onChange("testimonial", { ...testimonial, authorName: e.target.value })} required />
              {errText("testimonial.authorName")}
            </div>
            <div>
              <Label>Author Role</Label>
              <Input value={testimonial.authorRole || ""} onChange={(e) => onChange("testimonial", { ...testimonial, authorRole: e.target.value })} />
            </div>
            <div>
              <Label>Rating Text</Label>
              <Input value={testimonial.ratingText || ""} onChange={(e) => onChange("testimonial", { ...testimonial, ratingText: e.target.value })} placeholder="⭐⭐⭐⭐⭐" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>Partnership Metrics Title</Label>
            <Input value={form.partnershipMetricsTitle || ""} onChange={(e) => onChange("partnershipMetricsTitle", e.target.value)} />
          </div>
          <div>
            <Label>Feedback Primary CTA Text</Label>
            <Input value={form.feedbackPrimaryCtaText || ""} onChange={(e) => onChange("feedbackPrimaryCtaText", e.target.value)} />
          </div>
          <div>
            <Label>Feedback Primary CTA Href</Label>
            <Input value={form.feedbackPrimaryCtaHref || ""} onChange={(e) => onChange("feedbackPrimaryCtaHref", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Partnership Metrics</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("partnershipMetrics", [...partnershipMetrics, { iconKey: "Users", label: "", value: "" }])}>
              Add Metric
            </Button>
          </div>

          {partnershipMetrics.map((m, i) => {
            const labelKey = `partnershipMetrics.${i}.label`;
            const valueKey = `partnershipMetrics.${i}.value`;
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <Input
                  className="md:col-span-3"
                  value={m.iconKey || ""}
                  onChange={(e) => {
                    const next = [...partnershipMetrics];
                    next[i] = { ...next[i], iconKey: e.target.value };
                    onChange("partnershipMetrics", next);
                  }}
                  placeholder="iconKey"
                />
                <div className="md:col-span-4">
                  <Input
                    data-field={labelKey}
                    className={errClass(labelKey)}
                    value={m.label || ""}
                    onChange={(e) => {
                      const next = [...partnershipMetrics];
                      next[i] = { ...next[i], label: e.target.value };
                      onChange("partnershipMetrics", next);
                    }}
                    placeholder="Label"
                  />
                  {errText(labelKey)}
                </div>
                <div className="md:col-span-3">
                  <Input
                    data-field={valueKey}
                    className={errClass(valueKey)}
                    value={m.value || ""}
                    onChange={(e) => {
                      const next = [...partnershipMetrics];
                      next[i] = { ...next[i], value: e.target.value };
                      onChange("partnershipMetrics", next);
                    }}
                    placeholder="Value"
                  />
                  {errText(valueKey)}
                </div>
                <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => onChange("partnershipMetrics", partnershipMetrics.filter((_, idx) => idx !== i))}>
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final CTA */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Final CTA" />

        <div>
          <ReqLabel>Title</ReqLabel>
          <Input data-field="finalCta.title" className={errClass("finalCta.title")} value={finalCta.title || ""} onChange={(e) => onChange("finalCta", { ...finalCta, title: e.target.value })} required />
          {errText("finalCta.title")}
        </div>
        <div>
          <ReqLabel>Body</ReqLabel>
          <TextArea value={finalCta.body || ""} onChange={(v) => onChange("finalCta", { ...finalCta, body: v })} fieldKey="finalCta.body" errors={errors} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Primary Text</ReqLabel>
            <Input data-field="finalCta.primaryText" className={errClass("finalCta.primaryText")} value={finalCta.primaryText || ""} onChange={(e) => onChange("finalCta", { ...finalCta, primaryText: e.target.value })} required />
            {errText("finalCta.primaryText")}
          </div>
          <div>
            <Label>Primary Href</Label>
            <Input value={finalCta.primaryHref || ""} onChange={(e) => onChange("finalCta", { ...finalCta, primaryHref: e.target.value })} />
          </div>
          <div>
            <Label>Secondary Text</Label>
            <Input value={finalCta.secondaryText || ""} onChange={(e) => onChange("finalCta", { ...finalCta, secondaryText: e.target.value })} />
          </div>
          <div>
            <Label>Secondary Href</Label>
            <Input value={finalCta.secondaryHref || ""} onChange={(e) => onChange("finalCta", { ...finalCta, secondaryHref: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
