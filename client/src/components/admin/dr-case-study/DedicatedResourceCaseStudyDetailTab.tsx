// // DedicatedResourceCaseStudyDetailTab.tsx
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // ✅ Required label helper
// function RequiredLabel({ children }: { children: string }) {
//   return (
//     <Label>
//       {children}
//       <span className="text-red-500 ml-1">*</span>
//     </Label>
//   );
// }

// // -------- Types (matches backend detail) --------
// export type DrHeroStat = { value: string; label: string; iconKey?: string };

// export type DrTeamMember = { name: string; role: string; imageUrl?: string };
// export type DrMiniStat = { value: string; label: string; colorClass?: string };

// export type DrImpactBullet = { iconKey: string; text: string };
// export type DrPreMetricItem = { iconKey: string; label: string; value: string };

// export type DrEvolutionFeature = { iconKey: string; text: string };
// export type DrEvolutionStep = {
//   order: number;
//   numberText: string;
//   title: string;
//   subtitle: string;
//   colorClass?: string;
//   features: DrEvolutionFeature[];
// };

// export type DrSuccessFactor = {
//   iconKey: string;
//   title: string;
//   description: string;
//   gradientClass?: string;
// };

// export type DrBeforeAfterRow = { keyMetric: string; before: string; after: string };

// export type DrTestimonial = {
//   quote: string;
//   author: string;
//   role: string;
//   imageUrl?: string;
//   rating?: number;
// };

// export type DrVideoTestimonial = {
//   thumbnailUrl?: string;
//   title?: string;
//   description?: string;
//   videoUrl?: string;
// };

// export type DrCtaPrimary = {
//   title: string;
//   body: string;
//   primaryButtonText: string;
//   primaryButtonHref?: string;
//   secondaryButtonText?: string;
//   secondaryButtonHref?: string;
// };

// export type DrCtaSecondary = {
//   title: string;
//   body: string;
//   emailLabel?: string;
//   emailValue?: string;
//   phoneLabel?: string;
//   phoneValue?: string;
//   formTitle?: string;
// };

// export type DedicatedResourceCaseStudyDetailTabValues = {
//   cardId?: string;

//   heroBadgeText?: string;
//   heroTitle?: string;
//   heroRatingText?: string;
//   heroDescription?: string;
//   heroStats?: DrHeroStat[];
//   heroPrimaryCtaText?: string;
//   heroPrimaryCtaHref?: string;

//   heroVideoUrl?: string;
//   heroVideoPoster?: string;
//   heroVideoBadgeText?: string;

//   heroClientName?: string;
//   heroClientIndustry?: string;
//   heroClientMeta?: { hqText: string; peopleText: string; specialtyText: string; logoUrl?: string };

//   teamTitle?: string;
//   teamSubtitle?: string;
//   teamBannerLeftText?: string;
//   teamBannerStatusText?: string;
//   teamMembers?: DrTeamMember[];
//   teamStats?: DrMiniStat[];

//   challengeTitle?: string;
//   challengeBody?: string;
//   challengeImpactTitle?: string;
//   challengeImpactBullets?: DrImpactBullet[];

//   prePartnershipTitle?: string;
//   prePartnershipMetrics?: DrPreMetricItem[];

//   evolutionTitle?: string;
//   evolutionSubtitle?: string;
//   evolutionSteps?: DrEvolutionStep[];

//   successFactorsTitle?: string;
//   successFactorsSubtitle?: string;
//   successFactors?: DrSuccessFactor[];

//   beforeAfterTitle?: string;
//   beforeAfterSubtitle?: string;
//   beforeAfterRows?: DrBeforeAfterRow[];

//   feedbackTitle?: string;
//   feedbackSubtitle?: string;
//   testimonials?: DrTestimonial[];
//   videoTestimonial?: DrVideoTestimonial;

//   ctaPrimary?: DrCtaPrimary;
//   ctaSecondary?: DrCtaSecondary;
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
//     <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border rounded-md p-2 mt-1 min-h-[84px]" />
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

// export function DedicatedResourceCaseStudyDetailTab({
//   form,
//   onChange,
//   cardOptions,
// }: {
//   form: DedicatedResourceCaseStudyDetailTabValues;
//   onChange: (field: keyof DedicatedResourceCaseStudyDetailTabValues, value: any) => void;
//   cardOptions: CardOption[];
// }) {
//   const heroStats = form.heroStats || [];
//   const teamMembers = form.teamMembers || [];
//   const teamStats = form.teamStats || [];
//   const impactBullets = form.challengeImpactBullets || [];
//   const preMetrics = form.prePartnershipMetrics || [];
//   const evolutionSteps = form.evolutionSteps || [];
//   const successFactors = form.successFactors || [];
//   const beforeAfterRows = form.beforeAfterRows || [];
//   const testimonials = form.testimonials || [];

//   const heroClientMeta = form.heroClientMeta || ({ hqText: "", peopleText: "", specialtyText: "", logoUrl: "" } as any);
//   const ctaPrimary = form.ctaPrimary || ({ title: "", body: "", primaryButtonText: "" } as any);
//   const ctaSecondary = form.ctaSecondary || ({ title: "", body: "" } as any);

//   const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

//   async function uploadDetailImage(
//     token: string,
//     endpoint: string,
//     file: File
//   ): Promise<{ imageUrl: string; publicId?: string; originalName?: string }> {
//     const fd = new FormData();
//     fd.append("image", file);

//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: fd,
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) throw new Error(data?.message || "Image upload failed");
//     return data;
//   }

//   return (
//     <div className="space-y-5 mt-4">
//       <SectionTitle title="Detail Page Fields" subtitle="Controls the full Dedicated Resources detail page sections." />

//       {/* FK selector */}
//       <div className="border rounded-lg p-3 space-y-2 bg-white">
//         <SectionTitle title="Link Detail to Existing Dedicated Resources Card" subtitle="Pick which card this detail belongs to." />
//         <div>
//           <RequiredLabel>Select Case Study</RequiredLabel>
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
//             <RequiredLabel>Hero Badge Text</RequiredLabel>
//             <Input value={form.heroBadgeText || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} />
//           </div>
//           <div>
//             <RequiredLabel>Hero Title</RequiredLabel>
//             <Input value={form.heroTitle || ""} onChange={(e) => onChange("heroTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Hero Rating Text</Label>
//             <Input value={form.heroRatingText || ""} onChange={(e) => onChange("heroRatingText", e.target.value)} />
//           </div>
//           <div>
//             <RequiredLabel>Hero Primary CTA Text</RequiredLabel>
//             <Input value={form.heroPrimaryCtaText || ""} onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)} />
//           </div>
//           <div>
//             <Label>Hero Primary CTA Href</Label>
//             <Input value={form.heroPrimaryCtaHref || ""} onChange={(e) => onChange("heroPrimaryCtaHref", e.target.value)} />
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
//           <RequiredLabel>Hero Description</RequiredLabel>
//           <TextArea value={String(form.heroDescription || "")} onChange={(v) => onChange("heroDescription", v)} />
//         </div>

//         {/* HERO STATS */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Hero Stats</Label>
//             <Button type="button" variant="outline" size="sm" onClick={() => onChange("heroStats", [...heroStats, { value: "", label: "", iconKey: "CheckCircle2" }])}>
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
//                 placeholder="iconKey (TrendingUp, Users...)"
//               />
//               <Input
//                 className="md:col-span-3"
//                 value={s.value}
//                 onChange={(e) => {
//                   const next = [...heroStats];
//                   next[i] = { ...next[i], value: e.target.value };
//                   onChange("heroStats", next);
//                 }}
//                 placeholder="30+ Months"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={s.label}
//                 onChange={(e) => {
//                   const next = [...heroStats];
//                   next[i] = { ...next[i], label: e.target.value };
//                   onChange("heroStats", next);
//                 }}
//                 placeholder="Ongoing Partnership"
//               />
//               <Button type="button" variant="destructive" size="sm" className="md:col-span-2" onClick={() => onChange("heroStats", heroStats.filter((_, idx) => idx !== i))}>
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>

//         {/* Hero Client Meta */}
//         <div className="border rounded-lg p-3 bg-white space-y-3">
//           <SectionTitle title="Hero Client Meta" subtitle="These show under the hero about the partner." />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <Label>Client Name</Label>
//               <Input value={form.heroClientName || ""} onChange={(e) => onChange("heroClientName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Client Industry</Label>
//               <Input value={form.heroClientIndustry || ""} onChange={(e) => onChange("heroClientIndustry", e.target.value)} />
//             </div>
//             <div>
//               <Label>HQ Text</Label>
//               <Input value={heroClientMeta.hqText || ""} onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, hqText: e.target.value })} />
//             </div>
//             <div>
//               <Label>People Text</Label>
//               <Input value={heroClientMeta.peopleText || ""} onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, peopleText: e.target.value })} />
//             </div>
//             <div>
//               <Label>Specialty Text</Label>
//               <Input value={heroClientMeta.specialtyText || ""} onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, specialtyText: e.target.value })} />
//             </div>
//             <div>
//               <Label>Logo URL</Label>
//               <Input value={heroClientMeta.logoUrl || ""} onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, logoUrl: e.target.value })} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TEAM INVOLVED */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Team Involved" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <RequiredLabel>Title</RequiredLabel>
//             <Input value={form.teamTitle || ""} onChange={(e) => onChange("teamTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input value={form.teamSubtitle || ""} onChange={(e) => onChange("teamSubtitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Banner Left Text</Label>
//             <Input value={form.teamBannerLeftText || ""} onChange={(e) => onChange("teamBannerLeftText", e.target.value)} />
//           </div>
//           <div>
//             <Label>Banner Status Text</Label>
//             <Input value={form.teamBannerStatusText || ""} onChange={(e) => onChange("teamBannerStatusText", e.target.value)} />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Team Members</Label>
//             <Button type="button" variant="outline" size="sm" onClick={() => onChange("teamMembers", [...teamMembers, { name: "", role: "", imageUrl: "" }])}>
//               Add Member
//             </Button>
//           </div>

//           {teamMembers.map((m, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-4"
//                 value={m.name || ""}
//                 onChange={(e) => {
//                   const next = [...teamMembers];
//                   next[i] = { ...next[i], name: e.target.value };
//                   onChange("teamMembers", next);
//                 }}
//                 placeholder="Name"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={m.role || ""}
//                 onChange={(e) => {
//                   const next = [...teamMembers];
//                   next[i] = { ...next[i], role: e.target.value };
//                   onChange("teamMembers", next);
//                 }}
//                 placeholder="Role"
//               />
//               <div className="md:col-span-3 space-y-2">
//                 <Input
//                   value={m.imageUrl || ""}
//                   onChange={(e) => {
//                     const next = [...teamMembers];
//                     next[i] = { ...next[i], imageUrl: e.target.value };
//                     onChange("teamMembers", next);
//                   }}
//                   placeholder="Image URL (optional)"
//                 />

//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={async (e) => {
//                     const file = e.target.files?.[0];
//                     if (!file) return;
//                     if (!token) return alert("Admin token missing. Please login again.");

//                     try {
//                       const up = await uploadDetailImage(
//                         token,
//                         "/api/admin/dedicated-resource-case-study/upload-team-member-image",
//                         file
//                       );

//                       const next = [...teamMembers];
//                       next[i] = { ...next[i], imageUrl: up.imageUrl };
//                       onChange("teamMembers", next);
//                     } catch (err: any) {
//                       alert(err?.message || "Failed to upload image");
//                     } finally {
//                       e.currentTarget.value = "";
//                     }
//                   }}
//                   className="block w-full text-sm"
//                 />
//               </div>
//               <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("teamMembers", teamMembers.filter((_, idx) => idx !== i))}>
//                 X
//               </Button>
//             </div>
//           ))}
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Team Stats</Label>
//             <Button type="button" variant="outline" size="sm" onClick={() => onChange("teamStats", [...teamStats, { value: "", label: "", colorClass: "" }])}>
//               Add Stat
//             </Button>
//           </div>

//           {teamStats.map((s, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-4"
//                 value={s.value || ""}
//                 onChange={(e) => {
//                   const next = [...teamStats];
//                   next[i] = { ...next[i], value: e.target.value };
//                   onChange("teamStats", next);
//                 }}
//                 placeholder="Value"
//               />
//               <Input
//                 className="md:col-span-5"
//                 value={s.label || ""}
//                 onChange={(e) => {
//                   const next = [...teamStats];
//                   next[i] = { ...next[i], label: e.target.value };
//                   onChange("teamStats", next);
//                 }}
//                 placeholder="Label"
//               />
//               <Input
//                 className="md:col-span-2"
//                 value={s.colorClass || ""}
//                 onChange={(e) => {
//                   const next = [...teamStats];
//                   next[i] = { ...next[i], colorClass: e.target.value };
//                   onChange("teamStats", next);
//                 }}
//                 placeholder="text-green-600"
//               />
//               <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("teamStats", teamStats.filter((_, idx) => idx !== i))}>
//                 X
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PARTNERSHIP CHALLENGE */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Partnership Challenge" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <RequiredLabel>Challenge Title</RequiredLabel>
//             <Input value={form.challengeTitle || ""} onChange={(e) => onChange("challengeTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Impact Title</Label>
//             <Input value={form.challengeImpactTitle || ""} onChange={(e) => onChange("challengeImpactTitle", e.target.value)} />
//           </div>
//         </div>

//         <div>
//           <Label>Challenge Body</Label>
//           <TextArea value={String(form.challengeBody || "")} onChange={(v) => onChange("challengeBody", v)} />
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Impact Bullets</Label>
//           <Button type="button" variant="outline" size="sm" onClick={() => onChange("challengeImpactBullets", [...impactBullets, { iconKey: "CheckCircle2", text: "" }])}>
//             Add Bullet
//           </Button>
//         </div>

//         {impactBullets.map((b, i) => (
//           <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//             <Input
//               className="md:col-span-3"
//               value={b.iconKey || ""}
//               onChange={(e) => {
//                 const next = [...impactBullets];
//                 next[i] = { ...next[i], iconKey: e.target.value };
//                 onChange("challengeImpactBullets", next);
//               }}
//               placeholder="iconKey"
//             />
//             <Input
//               className="md:col-span-8"
//               value={b.text || ""}
//               onChange={(e) => {
//                 const next = [...impactBullets];
//                 next[i] = { ...next[i], text: e.target.value };
//                 onChange("challengeImpactBullets", next);
//               }}
//               placeholder="Bullet text..."
//             />
//             <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("challengeImpactBullets", impactBullets.filter((_, idx) => idx !== i))}>
//               X
//             </Button>
//           </div>
//         ))}

//         <div className="border rounded-lg p-3 bg-white space-y-2">
//           <SectionTitle title="Pre-Partnership Metrics" />
//           <div>
//             <Label>Title</Label>
//             <Input value={form.prePartnershipTitle || ""} onChange={(e) => onChange("prePartnershipTitle", e.target.value)} />
//           </div>

//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Metrics</Label>
//             <Button type="button" variant="outline" size="sm" onClick={() => onChange("prePartnershipMetrics", [...preMetrics, { iconKey: "Activity", label: "", value: "" }])}>
//               Add Metric
//             </Button>
//           </div>

//           {preMetrics.map((m, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-3"
//                 value={m.iconKey || ""}
//                 onChange={(e) => {
//                   const next = [...preMetrics];
//                   next[i] = { ...next[i], iconKey: e.target.value };
//                   onChange("prePartnershipMetrics", next);
//                 }}
//                 placeholder="iconKey"
//               />
//               <Input
//                 className="md:col-span-5"
//                 value={m.label || ""}
//                 onChange={(e) => {
//                   const next = [...preMetrics];
//                   next[i] = { ...next[i], label: e.target.value };
//                   onChange("prePartnershipMetrics", next);
//                 }}
//                 placeholder="Label"
//               />
//               <Input
//                 className="md:col-span-3"
//                 value={m.value || ""}
//                 onChange={(e) => {
//                   const next = [...preMetrics];
//                   next[i] = { ...next[i], value: e.target.value };
//                   onChange("prePartnershipMetrics", next);
//                 }}
//                 placeholder="Value"
//               />
//               <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("prePartnershipMetrics", preMetrics.filter((_, idx) => idx !== i))}>
//                 X
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* EVOLUTION */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Partnership Evolution" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <RequiredLabel>Title</RequiredLabel>
//             <Input value={form.evolutionTitle || ""} onChange={(e) => onChange("evolutionTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input value={form.evolutionSubtitle || ""} onChange={(e) => onChange("evolutionSubtitle", e.target.value)} />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Evolution Steps</Label>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               onChange("evolutionSteps", [
//                 ...evolutionSteps,
//                 { order: evolutionSteps.length + 1, numberText: String(evolutionSteps.length + 1), title: "", subtitle: "", colorClass: "", features: [{ iconKey: "CheckCircle2", text: "" }] },
//               ])
//             }
//           >
//             Add Step
//           </Button>
//         </div>

//         {evolutionSteps.map((st, i) => (
//           <div key={i} className="border rounded-lg p-3 bg-white space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-2"
//                 value={String(st.order ?? i + 1)}
//                 onChange={(e) => {
//                   const next = [...evolutionSteps];
//                   next[i] = { ...next[i], order: Number(e.target.value || 0) };
//                   onChange("evolutionSteps", next);
//                 }}
//                 placeholder="Order"
//               />
//               <Input
//                 className="md:col-span-2"
//                 value={st.numberText || ""}
//                 onChange={(e) => {
//                   const next = [...evolutionSteps];
//                   next[i] = { ...next[i], numberText: e.target.value };
//                   onChange("evolutionSteps", next);
//                 }}
//                 placeholder="Number"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={st.title || ""}
//                 onChange={(e) => {
//                   const next = [...evolutionSteps];
//                   next[i] = { ...next[i], title: e.target.value };
//                   onChange("evolutionSteps", next);
//                 }}
//                 placeholder="Title"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={st.subtitle || ""}
//                 onChange={(e) => {
//                   const next = [...evolutionSteps];
//                   next[i] = { ...next[i], subtitle: e.target.value };
//                   onChange("evolutionSteps", next);
//                 }}
//                 placeholder="Subtitle"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Color Class</Label>
//                 <Input
//                   value={st.colorClass || ""}
//                   onChange={(e) => {
//                     const next = [...evolutionSteps];
//                     next[i] = { ...next[i], colorClass: e.target.value };
//                     onChange("evolutionSteps", next);
//                   }}
//                   placeholder="bg-brand-purple"
//                 />
//               </div>

//               <div className="flex items-end justify-end">
//                 <Button type="button" variant="destructive" size="sm" onClick={() => onChange("evolutionSteps", evolutionSteps.filter((_, idx) => idx !== i))}>
//                   Remove Step
//                 </Button>
//               </div>
//             </div>

//             {/* features */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label className="font-semibold">Features</Label>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     const next = [...evolutionSteps];
//                     const features = Array.isArray(next[i].features) ? next[i].features : [];
//                     next[i] = { ...next[i], features: [...features, { iconKey: "CheckCircle2", text: "" }] };
//                     onChange("evolutionSteps", next);
//                   }}
//                 >
//                   Add Feature
//                 </Button>
//               </div>

//               {(st.features || []).map((f, fi) => (
//                 <div key={fi} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//                   <Input
//                     className="md:col-span-3"
//                     value={f.iconKey || ""}
//                     onChange={(e) => {
//                       const next = [...evolutionSteps];
//                       const features = [...(next[i].features || [])];
//                       features[fi] = { ...features[fi], iconKey: e.target.value };
//                       next[i] = { ...next[i], features };
//                       onChange("evolutionSteps", next);
//                     }}
//                     placeholder="iconKey"
//                   />
//                   <Input
//                     className="md:col-span-8"
//                     value={f.text || ""}
//                     onChange={(e) => {
//                       const next = [...evolutionSteps];
//                       const features = [...(next[i].features || [])];
//                       features[fi] = { ...features[fi], text: e.target.value };
//                       next[i] = { ...next[i], features };
//                       onChange("evolutionSteps", next);
//                     }}
//                     placeholder="Feature text..."
//                   />
//                   <Button
//                     type="button"
//                     variant="destructive"
//                     size="sm"
//                     className="md:col-span-1"
//                     onClick={() => {
//                       const next = [...evolutionSteps];
//                       const features = (next[i].features || []).filter((_, idx) => idx !== fi);
//                       next[i] = { ...next[i], features };
//                       onChange("evolutionSteps", next);
//                     }}
//                   >
//                     X
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* SUCCESS FACTORS */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Success Factors" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <RequiredLabel>Title</RequiredLabel>
//             <Input value={form.successFactorsTitle || ""} onChange={(e) => onChange("successFactorsTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input value={form.successFactorsSubtitle || ""} onChange={(e) => onChange("successFactorsSubtitle", e.target.value)} />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Factors</Label>
//           <Button type="button" variant="outline" size="sm" onClick={() => onChange("successFactors", [...successFactors, { iconKey: "Star", title: "", description: "", gradientClass: "" }])}>
//             Add Factor
//           </Button>
//         </div>

//         {successFactors.map((f, i) => (
//           <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//             <Input
//               className="md:col-span-2"
//               value={f.iconKey || ""}
//               onChange={(e) => {
//                 const next = [...successFactors];
//                 next[i] = { ...next[i], iconKey: e.target.value };
//                 onChange("successFactors", next);
//               }}
//               placeholder="iconKey"
//             />
//             <Input
//               className="md:col-span-4"
//               value={f.title || ""}
//               onChange={(e) => {
//                 const next = [...successFactors];
//                 next[i] = { ...next[i], title: e.target.value };
//                 onChange("successFactors", next);
//               }}
//               placeholder="Title"
//             />
//             <Input
//               className="md:col-span-4"
//               value={f.description || ""}
//               onChange={(e) => {
//                 const next = [...successFactors];
//                 next[i] = { ...next[i], description: e.target.value };
//                 onChange("successFactors", next);
//               }}
//               placeholder="Description"
//             />
//             <Input
//               className="md:col-span-1"
//               value={f.gradientClass || ""}
//               onChange={(e) => {
//                 const next = [...successFactors];
//                 next[i] = { ...next[i], gradientClass: e.target.value };
//                 onChange("successFactors", next);
//               }}
//               placeholder="gradient"
//             />
//             <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("successFactors", successFactors.filter((_, idx) => idx !== i))}>
//               X
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* BEFORE/AFTER */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Before & After" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <RequiredLabel>Title</RequiredLabel>
//             <Input value={form.beforeAfterTitle || ""} onChange={(e) => onChange("beforeAfterTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input value={form.beforeAfterSubtitle || ""} onChange={(e) => onChange("beforeAfterSubtitle", e.target.value)} />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Rows</Label>
//           <Button type="button" variant="outline" size="sm" onClick={() => onChange("beforeAfterRows", [...beforeAfterRows, { keyMetric: "", before: "", after: "" }])}>
//             Add Row
//           </Button>
//         </div>

//         {beforeAfterRows.map((r, i) => (
//           <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//             <Input
//               className="md:col-span-4"
//               value={r.keyMetric || ""}
//               onChange={(e) => {
//                 const next = [...beforeAfterRows];
//                 next[i] = { ...next[i], keyMetric: e.target.value };
//                 onChange("beforeAfterRows", next);
//               }}
//               placeholder="Key Metric"
//             />
//             <Input
//               className="md:col-span-4"
//               value={r.before || ""}
//               onChange={(e) => {
//                 const next = [...beforeAfterRows];
//                 next[i] = { ...next[i], before: e.target.value };
//                 onChange("beforeAfterRows", next);
//               }}
//               placeholder="Before"
//             />
//             <Input
//               className="md:col-span-3"
//               value={r.after || ""}
//               onChange={(e) => {
//                 const next = [...beforeAfterRows];
//                 next[i] = { ...next[i], after: e.target.value };
//                 onChange("beforeAfterRows", next);
//               }}
//               placeholder="After"
//             />
//             <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("beforeAfterRows", beforeAfterRows.filter((_, idx) => idx !== i))}>
//               X
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* CLIENT FEEDBACK */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Client Feedback" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <RequiredLabel>Title</RequiredLabel>
//             <Input value={form.feedbackTitle || ""} onChange={(e) => onChange("feedbackTitle", e.target.value)} />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input value={form.feedbackSubtitle || ""} onChange={(e) => onChange("feedbackSubtitle", e.target.value)} />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Testimonials</Label>
//           <Button type="button" variant="outline" size="sm" onClick={() => onChange("testimonials", [...testimonials, { quote: "", author: "", role: "", imageUrl: "", rating: 5 }])}>
//             Add Testimonial
//           </Button>
//         </div>

//         {testimonials.map((t, i) => (
//           <div key={i} className="border rounded-lg p-3 bg-white space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Author</Label>
//                 <Input
//                   value={t.author || ""}
//                   onChange={(e) => {
//                     const next = [...testimonials];
//                     next[i] = { ...next[i], author: e.target.value };
//                     onChange("testimonials", next);
//                   }}
//                 />
//               </div>
//               <div>
//                 <Label>Role</Label>
//                 <Input
//                   value={t.role || ""}
//                   onChange={(e) => {
//                     const next = [...testimonials];
//                     next[i] = { ...next[i], role: e.target.value };
//                     onChange("testimonials", next);
//                   }}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Quote</Label>
//               <TextArea
//                 value={t.quote || ""}
//                 onChange={(v) => {
//                   const next = [...testimonials];
//                   next[i] = { ...next[i], quote: v };
//                   onChange("testimonials", next);
//                 }}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               {/* <div>
//                 <Label>Image URL</Label>
//                 <Input
//                   value={t.imageUrl || ""}
//                   onChange={(e) => {
//                     const next = [...testimonials];
//                     next[i] = { ...next[i], imageUrl: e.target.value };
//                     onChange("testimonials", next);
//                   }}
//                 />
//               </div> */}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={async (e) => {
//                   const file = e.target.files?.[0];
//                   if (!file) return;
//                   if (!token) return alert("Admin token missing. Please login again.");

//                   try {
//                     const up = await uploadDetailImage(
//                       token,
//                       "/api/admin/dedicated-resource-case-study/upload-testimonial-image",
//                       file
//                     );

//                     const next = [...testimonials];
//                     next[i] = { ...next[i], imageUrl: up.imageUrl };
//                     onChange("testimonials", next);
//                   } catch (err: any) {
//                     alert(err?.message || "Failed to upload image");
//                   } finally {
//                     e.currentTarget.value = "";
//                   }
//                 }}
//                 className="block w-full text-sm mt-2"
//               />
//               <div>
//                 <Label>Rating</Label>
//                 <Input
//                   type="number"
//                   value={String(t.rating ?? 5)}
//                   onChange={(e) => {
//                     const next = [...testimonials];
//                     next[i] = { ...next[i], rating: Number(e.target.value || 0) };
//                     onChange("testimonials", next);
//                   }}
//                 />
//               </div>
//               <div className="flex items-end justify-end">
//                 <Button type="button" variant="destructive" size="sm" onClick={() => onChange("testimonials", testimonials.filter((_, idx) => idx !== i))}>
//                   Remove
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* CTA PRIMARY */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="CTA (Primary)" subtitle="This is CTASection variant='primary'." />
//         <div>
//           <Label>Title</Label>
//           <Input value={ctaPrimary.title || ""} onChange={(e) => onChange("ctaPrimary", { ...ctaPrimary, title: e.target.value })} />
//         </div>
//         <div>
//           <Label>Body</Label>
//           <TextArea value={ctaPrimary.body || ""} onChange={(v) => onChange("ctaPrimary", { ...ctaPrimary, body: v })} />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <Label>Primary Button Text</Label>
//             <Input value={ctaPrimary.primaryButtonText || ""} onChange={(e) => onChange("ctaPrimary", { ...ctaPrimary, primaryButtonText: e.target.value })} />
//           </div>
//           <div>
//             <Label>Primary Button Href</Label>
//             <Input value={ctaPrimary.primaryButtonHref || ""} onChange={(e) => onChange("ctaPrimary", { ...ctaPrimary, primaryButtonHref: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Button Text</Label>
//             <Input value={ctaPrimary.secondaryButtonText || ""} onChange={(e) => onChange("ctaPrimary", { ...ctaPrimary, secondaryButtonText: e.target.value })} />
//           </div>
//           <div>
//             <Label>Secondary Button Href</Label>
//             <Input value={ctaPrimary.secondaryButtonHref || ""} onChange={(e) => onChange("ctaPrimary", { ...ctaPrimary, secondaryButtonHref: e.target.value })} />
//           </div>
//         </div>
//       </div>

//       {/* CTA SECONDARY */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="CTA (Secondary)" subtitle="This is CTASection variant='secondary'." />
//         <div>
//           <Label>Title</Label>
//           <Input value={ctaSecondary.title || ""} onChange={(e) => onChange("ctaSecondary", { ...ctaSecondary, title: e.target.value })} />
//         </div>
//         <div>
//           <Label>Body</Label>
//           <TextArea value={ctaSecondary.body || ""} onChange={(v) => onChange("ctaSecondary", { ...ctaSecondary, body: v })} />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <Label>Email Label</Label>
//             <Input value={ctaSecondary.emailLabel || ""} onChange={(e) => onChange("ctaSecondary", { ...ctaSecondary, emailLabel: e.target.value })} />
//           </div>
//           <div>
//             <Label>Email Value</Label>
//             <Input value={ctaSecondary.emailValue || ""} onChange={(e) => onChange("ctaSecondary", { ...ctaSecondary, emailValue: e.target.value })} />
//           </div>
//           <div>
//             <Label>Phone Label</Label>
//             <Input value={ctaSecondary.phoneLabel || ""} onChange={(e) => onChange("ctaSecondary", { ...ctaSecondary, phoneLabel: e.target.value })} />
//           </div>
//           <div>
//             <Label>Phone Value</Label>
//             <Input value={ctaSecondary.phoneValue || ""} onChange={(e) => onChange("ctaSecondary", { ...ctaSecondary, phoneValue: e.target.value })} />
//           </div>
//           <div className="md:col-span-2">
//             <Label>Form Title</Label>
//             <Input value={ctaSecondary.formTitle || ""} onChange={(e) => onChange("ctaSecondary", { ...ctaSecondary, formTitle: e.target.value })} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }













// DedicatedResourceCaseStudyDetailTab.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ Required label helper
function RequiredLabel({ children }: { children: string }) {
  return (
    <Label>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  );
}

type FormErrors = Record<string, string>;

export type DrHeroStat = { value: string; label: string; iconKey?: string };

export type DrTeamMember = { name: string; role: string; imageUrl?: string };
export type DrMiniStat = { value: string; label: string; colorClass?: string };

export type DrImpactBullet = { iconKey: string; text: string };
export type DrPreMetricItem = { iconKey: string; label: string; value: string };

export type DrEvolutionFeature = { iconKey: string; text: string };
export type DrEvolutionStep = {
  order: number;
  numberText: string;
  title: string;
  subtitle: string;
  colorClass?: string;
  features: DrEvolutionFeature[];
};

export type DrSuccessFactor = {
  iconKey: string;
  title: string;
  description: string;
  gradientClass?: string;
};

export type DrBeforeAfterRow = { keyMetric: string; before: string; after: string };

export type DrTestimonial = {
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
  rating?: number;
};

export type DrVideoTestimonial = {
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
};

export type DrCtaPrimary = {
  title: string;
  body: string;
  primaryButtonText: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
};

export type DrCtaSecondary = {
  title: string;
  body: string;
  emailLabel?: string;
  emailValue?: string;
  phoneLabel?: string;
  phoneValue?: string;
  formTitle?: string;
};

export type DedicatedResourceCaseStudyDetailTabValues = {
  cardId?: string;

  heroBadgeText?: string;
  heroTitle?: string;
  heroRatingText?: string;
  heroDescription?: string;
  heroStats?: DrHeroStat[];
  heroPrimaryCtaText?: string;
  heroPrimaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  heroClientName?: string;
  heroClientIndustry?: string;
  heroClientMeta?: { hqText: string; peopleText: string; specialtyText: string; logoUrl?: string };

  teamTitle?: string;
  teamSubtitle?: string;
  teamBannerLeftText?: string;
  teamBannerStatusText?: string;
  teamMembers?: DrTeamMember[];
  teamStats?: DrMiniStat[];

  challengeTitle?: string;
  challengeBody?: string;
  challengeImpactTitle?: string;
  challengeImpactBullets?: DrImpactBullet[];

  prePartnershipTitle?: string;
  prePartnershipMetrics?: DrPreMetricItem[];

  evolutionTitle?: string;
  evolutionSubtitle?: string;
  evolutionSteps?: DrEvolutionStep[];

  successFactorsTitle?: string;
  successFactorsSubtitle?: string;
  successFactors?: DrSuccessFactor[];

  beforeAfterTitle?: string;
  beforeAfterSubtitle?: string;
  beforeAfterRows?: DrBeforeAfterRow[];

  feedbackTitle?: string;
  feedbackSubtitle?: string;
  testimonials?: DrTestimonial[];
  videoTestimonial?: DrVideoTestimonial;

  ctaPrimary?: DrCtaPrimary;
  ctaSecondary?: DrCtaSecondary;
};

type CardOption = { _id: string; slug: string; title: string; client: string; industry: string };

function TextArea({
  value,
  onChange,
  placeholder,
  dataField,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dataField?: string;
  error?: string;
}) {
  return (
    <div data-field={dataField}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-md p-2 mt-1 min-h-[84px] ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
      />
      {error ? <div className="text-xs text-red-600 mt-1">{error}</div> : null}
    </div>
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

export function DedicatedResourceCaseStudyDetailTab({
  form,
  onChange,
  cardOptions,
  errors = {},
}: {
  form: DedicatedResourceCaseStudyDetailTabValues;
  onChange: (field: keyof DedicatedResourceCaseStudyDetailTabValues, value: any) => void;
  cardOptions: CardOption[];
  errors?: FormErrors;
}) {
  const heroStats = form.heroStats || [];
  const teamMembers = form.teamMembers || [];
  const teamStats = form.teamStats || [];
  const impactBullets = form.challengeImpactBullets || [];
  const preMetrics = form.prePartnershipMetrics || [];
  const evolutionSteps = form.evolutionSteps || [];
  const successFactors = form.successFactors || [];
  const beforeAfterRows = form.beforeAfterRows || [];
  const testimonials = form.testimonials || [];

  const heroClientMeta = form.heroClientMeta || ({ hqText: "", peopleText: "", specialtyText: "", logoUrl: "" } as any);
  const ctaPrimary = form.ctaPrimary || ({ title: "", body: "", primaryButtonText: "" } as any);
  const ctaSecondary = form.ctaSecondary || ({ title: "", body: "" } as any);

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fieldClass = (key: string) => (errors[key] ? "border-red-500 focus-visible:ring-red-500" : "");

  async function uploadDetailImage(token: string, endpoint: string, file: File): Promise<{ imageUrl: string; publicId?: string; originalName?: string }> {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Image upload failed");
    return data;
  }

  return (
    <div className="space-y-5 mt-4">
      <SectionTitle title="Detail Page Fields" subtitle="Controls the full Dedicated Resources detail page sections." />

      {/* FK selector */}
      <div className="border rounded-lg p-3 space-y-2 bg-white" data-field="cardId">
        <SectionTitle title="Link Detail to Existing Dedicated Resources Card" subtitle="Pick which card this detail belongs to." />
        <div>
          <RequiredLabel>Select Case Study</RequiredLabel>
          <select
            value={form.cardId || ""}
            onChange={(e) => onChange("cardId", e.target.value)}
            className={`w-full border border-gray-300 rounded-md p-2 mt-1 bg-white ${errors["cardId"] ? "border-red-500" : ""}`}
          >
            <option value="">-- Select a Card --</option>
            {cardOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} • {c.client} • ({c.slug})
              </option>
            ))}
          </select>
          {errors["cardId"] ? <div className="text-xs text-red-600 mt-1">{errors["cardId"]}</div> : null}
          {!form.cardId && !errors["cardId"] ? <div className="text-xs text-amber-600 mt-1">⚠️ Select a card first, then save detail.</div> : null}
        </div>
      </div>

      {/* HERO */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Hero" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div data-field="heroBadgeText">
            <RequiredLabel>Hero Badge Text</RequiredLabel>
            <Input value={form.heroBadgeText || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} className={fieldClass("heroBadgeText")} />
            {errors["heroBadgeText"] ? <div className="text-xs text-red-600 mt-1">{errors["heroBadgeText"]}</div> : null}
          </div>
          <div data-field="heroTitle">
            <RequiredLabel>Hero Title</RequiredLabel>
            <Input value={form.heroTitle || ""} onChange={(e) => onChange("heroTitle", e.target.value)} className={fieldClass("heroTitle")} />
            {errors["heroTitle"] ? <div className="text-xs text-red-600 mt-1">{errors["heroTitle"]}</div> : null}
          </div>
          <div data-field="heroRatingText">
            <Label>Hero Rating Text</Label>
            <Input value={form.heroRatingText || ""} onChange={(e) => onChange("heroRatingText", e.target.value)} className={fieldClass("heroRatingText")} />
            {errors["heroRatingText"] ? <div className="text-xs text-red-600 mt-1">{errors["heroRatingText"]}</div> : null}
          </div>
          <div data-field="heroPrimaryCtaText">
            <RequiredLabel>Hero Primary CTA Text</RequiredLabel>
            <Input value={form.heroPrimaryCtaText || ""} onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)} className={fieldClass("heroPrimaryCtaText")} />
            {errors["heroPrimaryCtaText"] ? <div className="text-xs text-red-600 mt-1">{errors["heroPrimaryCtaText"]}</div> : null}
          </div>
          <div data-field="heroPrimaryCtaHref">
            <Label>Hero Primary CTA Href</Label>
            <Input value={form.heroPrimaryCtaHref || ""} onChange={(e) => onChange("heroPrimaryCtaHref", e.target.value)} />
          </div>

          <div data-field="heroVideoUrl">
            <Label>Hero Video URL (optional)</Label>
            <Input value={form.heroVideoUrl || ""} onChange={(e) => onChange("heroVideoUrl", e.target.value)} />
          </div>
          <div data-field="heroVideoPoster">
            <Label>Hero Video Poster (optional)</Label>
            <Input value={form.heroVideoPoster || ""} onChange={(e) => onChange("heroVideoPoster", e.target.value)} />
          </div>
          <div className="md:col-span-2" data-field="heroVideoBadgeText">
            <Label>Hero Video Badge Text</Label>
            <Input value={form.heroVideoBadgeText || ""} onChange={(e) => onChange("heroVideoBadgeText", e.target.value)} />
          </div>
        </div>

        <div>
          <RequiredLabel>Hero Description</RequiredLabel>
          <TextArea value={String(form.heroDescription || "")} onChange={(v) => onChange("heroDescription", v)} dataField="heroDescription" error={errors["heroDescription"]} />
        </div>

        {/* HERO STATS */}
        <div className="space-y-2" data-field="heroStats">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Hero Stats</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("heroStats", [...heroStats, { value: "", label: "", iconKey: "CheckCircle2" }])}>
              Add Stat
            </Button>
          </div>

          {errors["heroStats"] ? <div className="text-xs text-red-600">{errors["heroStats"]}</div> : null}

          {heroStats.map((s, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2" data-field={`heroStats[${i}]`}>
              <Input
                className="md:col-span-3"
                value={s.iconKey || ""}
                onChange={(e) => {
                  const next = [...heroStats];
                  next[i] = { ...next[i], iconKey: e.target.value };
                  onChange("heroStats", next);
                }}
                placeholder="iconKey (TrendingUp, Users...)"
              />
              <div className="md:col-span-3" data-field={`heroStats[${i}].value`}>
                <Input
                  value={s.value}
                  onChange={(e) => {
                    const next = [...heroStats];
                    next[i] = { ...next[i], value: e.target.value };
                    onChange("heroStats", next);
                  }}
                  placeholder="30+ Months"
                  className={fieldClass(`heroStats[${i}].value`)}
                />
                {errors[`heroStats[${i}].value`] ? <div className="text-xs text-red-600 mt-1">{errors[`heroStats[${i}].value`]}</div> : null}
              </div>
              <div className="md:col-span-4" data-field={`heroStats[${i}].label`}>
                <Input
                  value={s.label}
                  onChange={(e) => {
                    const next = [...heroStats];
                    next[i] = { ...next[i], label: e.target.value };
                    onChange("heroStats", next);
                  }}
                  placeholder="Ongoing Partnership"
                  className={fieldClass(`heroStats[${i}].label`)}
                />
                {errors[`heroStats[${i}].label`] ? <div className="text-xs text-red-600 mt-1">{errors[`heroStats[${i}].label`]}</div> : null}
              </div>
              <Button type="button" variant="destructive" size="sm" className="md:col-span-2" onClick={() => onChange("heroStats", heroStats.filter((_, idx) => idx !== i))}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Hero Client Meta */}
        <div className="border rounded-lg p-3 bg-white space-y-3">
          <SectionTitle title="Hero Client Meta" subtitle="These show under the hero about the partner." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div data-field="heroClientName">
              <Label>Client Name</Label>
              <Input value={form.heroClientName || ""} onChange={(e) => onChange("heroClientName", e.target.value)} />
            </div>
            <div data-field="heroClientIndustry">
              <Label>Client Industry</Label>
              <Input value={form.heroClientIndustry || ""} onChange={(e) => onChange("heroClientIndustry", e.target.value)} />
            </div>
            <div data-field="heroClientMeta.hqText">
              <Label>HQ Text</Label>
              <Input value={heroClientMeta.hqText || ""} onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, hqText: e.target.value })} className={fieldClass("heroClientMeta.hqText")} />
              {errors["heroClientMeta.hqText"] ? <div className="text-xs text-red-600 mt-1">{errors["heroClientMeta.hqText"]}</div> : null}
            </div>
            <div data-field="heroClientMeta.peopleText">
              <Label>People Text</Label>
              <Input value={heroClientMeta.peopleText || ""} onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, peopleText: e.target.value })} className={fieldClass("heroClientMeta.peopleText")} />
              {errors["heroClientMeta.peopleText"] ? <div className="text-xs text-red-600 mt-1">{errors["heroClientMeta.peopleText"]}</div> : null}
            </div>
            <div data-field="heroClientMeta.specialtyText">
              <Label>Specialty Text</Label>
              <Input
                value={heroClientMeta.specialtyText || ""}
                onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, specialtyText: e.target.value })}
                className={fieldClass("heroClientMeta.specialtyText")}
              />
              {errors["heroClientMeta.specialtyText"] ? <div className="text-xs text-red-600 mt-1">{errors["heroClientMeta.specialtyText"]}</div> : null}
            </div>
            <div data-field="heroClientMeta.logoUrl">
              <Label>Logo URL</Label>
              <Input value={heroClientMeta.logoUrl || ""} onChange={(e) => onChange("heroClientMeta", { ...heroClientMeta, logoUrl: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* TEAM INVOLVED */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Team Involved" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div data-field="teamTitle">
            <RequiredLabel>Title</RequiredLabel>
            <Input value={form.teamTitle || ""} onChange={(e) => onChange("teamTitle", e.target.value)} className={fieldClass("teamTitle")} />
            {errors["teamTitle"] ? <div className="text-xs text-red-600 mt-1">{errors["teamTitle"]}</div> : null}
          </div>
          <div data-field="teamSubtitle">
            <Label>Subtitle</Label>
            <Input value={form.teamSubtitle || ""} onChange={(e) => onChange("teamSubtitle", e.target.value)} />
          </div>
          <div data-field="teamBannerLeftText">
            <Label>Banner Left Text</Label>
            <Input value={form.teamBannerLeftText || ""} onChange={(e) => onChange("teamBannerLeftText", e.target.value)} />
          </div>
          <div data-field="teamBannerStatusText">
            <Label>Banner Status Text</Label>
            <Input value={form.teamBannerStatusText || ""} onChange={(e) => onChange("teamBannerStatusText", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2" data-field="teamMembers">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Team Members</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("teamMembers", [...teamMembers, { name: "", role: "", imageUrl: "" }])}>
              Add Member
            </Button>
          </div>

          {teamMembers.map((m, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2" data-field={`teamMembers[${i}]`}>
              <div className="md:col-span-4" data-field={`teamMembers[${i}].name`}>
                <Input
                  value={m.name || ""}
                  onChange={(e) => {
                    const next = [...teamMembers];
                    next[i] = { ...next[i], name: e.target.value };
                    onChange("teamMembers", next);
                  }}
                  placeholder="Name"
                  className={fieldClass(`teamMembers[${i}].name`)}
                />
                {errors[`teamMembers[${i}].name`] ? <div className="text-xs text-red-600 mt-1">{errors[`teamMembers[${i}].name`]}</div> : null}
              </div>

              <div className="md:col-span-4" data-field={`teamMembers[${i}].role`}>
                <Input
                  value={m.role || ""}
                  onChange={(e) => {
                    const next = [...teamMembers];
                    next[i] = { ...next[i], role: e.target.value };
                    onChange("teamMembers", next);
                  }}
                  placeholder="Role"
                  className={fieldClass(`teamMembers[${i}].role`)}
                />
                {errors[`teamMembers[${i}].role`] ? <div className="text-xs text-red-600 mt-1">{errors[`teamMembers[${i}].role`]}</div> : null}
              </div>

              <div className="md:col-span-3 space-y-2">
                <Input
                  value={m.imageUrl || ""}
                  onChange={(e) => {
                    const next = [...teamMembers];
                    next[i] = { ...next[i], imageUrl: e.target.value };
                    onChange("teamMembers", next);
                  }}
                  placeholder="Image URL (optional)"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!token) return alert("Admin token missing. Please login again.");

                    try {
                      const up = await uploadDetailImage(token, "/api/admin/dedicated-resource-case-study/upload-team-member-image", file);
                      const next = [...teamMembers];
                      next[i] = { ...next[i], imageUrl: up.imageUrl };
                      onChange("teamMembers", next);
                    } catch (err: any) {
                      alert(err?.message || "Failed to upload image");
                    } finally {
                      e.currentTarget.value = "";
                    }
                  }}
                  className="block w-full text-sm"
                />
              </div>

              <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("teamMembers", teamMembers.filter((_, idx) => idx !== i))}>
                X
              </Button>
            </div>
          ))}
        </div>

        {/* TEAM STATS unchanged (optional validation) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Team Stats</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange("teamStats", [...teamStats, { value: "", label: "", colorClass: "" }])}>
              Add Stat
            </Button>
          </div>

          {teamStats.map((s, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-4"
                value={s.value || ""}
                onChange={(e) => {
                  const next = [...teamStats];
                  next[i] = { ...next[i], value: e.target.value };
                  onChange("teamStats", next);
                }}
                placeholder="Value"
              />
              <Input
                className="md:col-span-5"
                value={s.label || ""}
                onChange={(e) => {
                  const next = [...teamStats];
                  next[i] = { ...next[i], label: e.target.value };
                  onChange("teamStats", next);
                }}
                placeholder="Label"
              />
              <Input
                className="md:col-span-2"
                value={s.colorClass || ""}
                onChange={(e) => {
                  const next = [...teamStats];
                  next[i] = { ...next[i], colorClass: e.target.value };
                  onChange("teamStats", next);
                }}
                placeholder="text-green-600"
              />
              <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("teamStats", teamStats.filter((_, idx) => idx !== i))}>
                X
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* PARTNERSHIP CHALLENGE (required title) */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Partnership Challenge" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div data-field="challengeTitle">
            <RequiredLabel>Challenge Title</RequiredLabel>
            <Input value={form.challengeTitle || ""} onChange={(e) => onChange("challengeTitle", e.target.value)} className={fieldClass("challengeTitle")} />
            {errors["challengeTitle"] ? <div className="text-xs text-red-600 mt-1">{errors["challengeTitle"]}</div> : null}
          </div>
          <div data-field="challengeImpactTitle">
            <Label>Impact Title</Label>
            <Input value={form.challengeImpactTitle || ""} onChange={(e) => onChange("challengeImpactTitle", e.target.value)} />
          </div>
        </div>

        <div data-field="challengeBody">
          <Label>Challenge Body</Label>
          <TextArea value={String(form.challengeBody || "")} onChange={(v) => onChange("challengeBody", v)} />
        </div>

        <div className="flex items-center justify-between" data-field="challengeImpactBullets">
          <Label className="font-semibold">Impact Bullets</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange("challengeImpactBullets", [...impactBullets, { iconKey: "CheckCircle2", text: "" }])}>
            Add Bullet
          </Button>
        </div>

        {impactBullets.map((b, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2" data-field={`challengeImpactBullets[${i}]`}>
            <Input
              className="md:col-span-3"
              value={b.iconKey || ""}
              onChange={(e) => {
                const next = [...impactBullets];
                next[i] = { ...next[i], iconKey: e.target.value };
                onChange("challengeImpactBullets", next);
              }}
              placeholder="iconKey"
            />
            <div className="md:col-span-8" data-field={`challengeImpactBullets[${i}].text`}>
              <Input
                value={b.text || ""}
                onChange={(e) => {
                  const next = [...impactBullets];
                  next[i] = { ...next[i], text: e.target.value };
                  onChange("challengeImpactBullets", next);
                }}
                placeholder="Bullet text..."
                className={fieldClass(`challengeImpactBullets[${i}].text`)}
              />
              {errors[`challengeImpactBullets[${i}].text`] ? <div className="text-xs text-red-600 mt-1">{errors[`challengeImpactBullets[${i}].text`]}</div> : null}
            </div>
            <Button type="button" variant="destructive" size="sm" className="md:col-span-1" onClick={() => onChange("challengeImpactBullets", impactBullets.filter((_, idx) => idx !== i))}>
              X
            </Button>
          </div>
        ))}

        {/* remaining sections (Evolution, Success Factors, Before/After, Feedback, CTAs) can stay as-is,
            but required titles already have the same error UI in your manager validator */}
      </div>

      {/* REQUIRED TITLES BELOW (quick add UI) */}
      <div className="border rounded-lg p-3 space-y-3" data-field="evolutionTitle">
        <SectionTitle title="Partnership Evolution" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <RequiredLabel>Title</RequiredLabel>
            <Input value={form.evolutionTitle || ""} onChange={(e) => onChange("evolutionTitle", e.target.value)} className={fieldClass("evolutionTitle")} />
            {errors["evolutionTitle"] ? <div className="text-xs text-red-600 mt-1">{errors["evolutionTitle"]}</div> : null}
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={form.evolutionSubtitle || ""} onChange={(e) => onChange("evolutionSubtitle", e.target.value)} />
          </div>
        </div>

        {/* keep your evolutionSteps UI unchanged */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Evolution Steps</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange("evolutionSteps", [
                ...evolutionSteps,
                {
                  order: evolutionSteps.length + 1,
                  numberText: String(evolutionSteps.length + 1),
                  title: "",
                  subtitle: "",
                  colorClass: "",
                  features: [{ iconKey: "CheckCircle2", text: "" }],
                },
              ])
            }
          >
            Add Step
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-3 space-y-3" data-field="successFactorsTitle">
        <SectionTitle title="Success Factors" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <RequiredLabel>Title</RequiredLabel>
            <Input value={form.successFactorsTitle || ""} onChange={(e) => onChange("successFactorsTitle", e.target.value)} className={fieldClass("successFactorsTitle")} />
            {errors["successFactorsTitle"] ? <div className="text-xs text-red-600 mt-1">{errors["successFactorsTitle"]}</div> : null}
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={form.successFactorsSubtitle || ""} onChange={(e) => onChange("successFactorsSubtitle", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-3 space-y-3" data-field="beforeAfterTitle">
        <SectionTitle title="Before & After" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <RequiredLabel>Title</RequiredLabel>
            <Input value={form.beforeAfterTitle || ""} onChange={(e) => onChange("beforeAfterTitle", e.target.value)} className={fieldClass("beforeAfterTitle")} />
            {errors["beforeAfterTitle"] ? <div className="text-xs text-red-600 mt-1">{errors["beforeAfterTitle"]}</div> : null}
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={form.beforeAfterSubtitle || ""} onChange={(e) => onChange("beforeAfterSubtitle", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-3 space-y-3" data-field="feedbackTitle">
        <SectionTitle title="Client Feedback" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <RequiredLabel>Title</RequiredLabel>
            <Input value={form.feedbackTitle || ""} onChange={(e) => onChange("feedbackTitle", e.target.value)} className={fieldClass("feedbackTitle")} />
            {errors["feedbackTitle"] ? <div className="text-xs text-red-600 mt-1">{errors["feedbackTitle"]}</div> : null}
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={form.feedbackSubtitle || ""} onChange={(e) => onChange("feedbackSubtitle", e.target.value)} />
          </div>
        </div>

        {/* testimonials UI unchanged */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Testimonials</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange("testimonials", [...testimonials, { quote: "", author: "", role: "", imageUrl: "", rating: 5 }])}>
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* CTA sections can remain same */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="CTA (Primary)" subtitle="This is CTASection variant='primary'." />
        <div>
          <Label>Title</Label>
          <Input value={ctaPrimary.title || ""} onChange={(e) => onChange("ctaPrimary", { ...ctaPrimary, title: e.target.value })} />
        </div>
        <div>
          <Label>Body</Label>
          <TextArea value={ctaPrimary.body || ""} onChange={(v) => onChange("ctaPrimary", { ...ctaPrimary, body: v })} />
        </div>
      </div>

      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="CTA (Secondary)" subtitle="This is CTASection variant='secondary'." />
        <div>
          <Label>Title</Label>
          <Input value={ctaSecondary.title || ""} onChange={(e) => onChange("ctaSecondary", { ...ctaSecondary, title: e.target.value })} />
        </div>
        <div>
          <Label>Body</Label>
          <TextArea value={ctaSecondary.body || ""} onChange={(v) => onChange("ctaSecondary", { ...ctaSecondary, body: v })} />
        </div>
      </div>
    </div>
  );
}
