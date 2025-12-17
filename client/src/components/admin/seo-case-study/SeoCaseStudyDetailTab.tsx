// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export type SeoCaseStudyHeroStat = { value: string; label: string };
// export type SeoCaseStudyHighlight = {
//   iconKey: string;
//   title: string;
//   description: string;
//   subtext?: string;
//   colorClass?: string;
// };
// export type SeoCaseStudyAboutStat = { iconKey: string; label: string; value: string };
// export type SeoCaseStudyInitialChallenge = { order: number; text: string };
// export type SeoCaseStudyIssue = {
//   issue: string;
//   severity: "Critical" | "High" | "Medium";
//   action: string;
//   result: string;
// };
// export type SeoCaseStudyKeywordRow = {
//   keyword: string;
//   position: number;
//   previousPosition: number;
//   volume: string;
// };
// export type SeoCaseStudyTool = {
//   iconKey: string;
//   name: string;
//   category: string;
//   usage: string;
//   colorClass?: string;
// };
// export type SeoCaseStudyTestimonial = {
//   name: string;
//   role: string;
//   company: string;
//   imageUrl: string;
//   quote: string;
//   rating: number;
// };
// export type SeoCaseStudyContactPoint = { month: string; submissions: number };
// export type SeoCaseStudyPerformanceMetric = { label: string; value: string; change: string };
// export type SeoCaseStudyKeywordMetric = { label: string; value: string; percentage: string };

// export type SeoCaseStudyDetailTabValues = {
//   // Hero
//   heroBadgeText?: string;
//   heroCaseStudyLabel?: string;
//   heroClientName?: string;
//   heroRatingText?: string;
//   heroHeadline?: string;
//   heroDescription?: string;
//   heroStats?: SeoCaseStudyHeroStat[];
//   heroPrimaryCtaText?: string;
//   heroPrimaryCtaHref?: string;
//   heroVideoUrl?: string;
//   heroVideoPoster?: string;
//   heroVideoBadgeText?: string;

//   // Highlights
//   highlightsTitle?: string;
//   highlightsSubtitle?: string;
//   highlights?: SeoCaseStudyHighlight[];

//   // CTA 1
//   cta1Title?: string;
//   cta1Body?: string;
//   cta1PrimaryCtaText?: string;
//   cta1PrimaryCtaHref?: string;

//   // About
//   aboutBadgeText?: string;
//   aboutLogoUrl?: string;
//   aboutTitle?: string;
//   aboutParagraph1?: string;
//   aboutParagraph2?: string;
//   aboutStats?: SeoCaseStudyAboutStat[];
//   initialChallengesTitle?: string;
//   initialChallenges?: SeoCaseStudyInitialChallenge[];

//   // Issues
//   issuesSectionTitle?: string;
//   issuesSectionSubtitle?: string;
//   issues?: SeoCaseStudyIssue[];

//   // Keyword performance
//   keywordPerformanceTitle?: string;
//   keywordPerformanceSubtitle?: string;
//   topKeywords?: SeoCaseStudyKeywordRow[];

//   // Tools
//   toolsSectionTitle?: string;
//   toolsSectionSubtitle?: string;
//   tools?: SeoCaseStudyTool[];

//   // Testimonials + Metrics
//   testimonialsSectionTitle?: string;
//   testimonialsSectionSubtitle?: string;
//   testimonials?: SeoCaseStudyTestimonial[];
//   contactData?: SeoCaseStudyContactPoint[];
//   performanceMetrics?: SeoCaseStudyPerformanceMetric[];
//   keywordMetrics?: SeoCaseStudyKeywordMetric[];

//   // CTA 2
//   cta2Title?: string;
//   cta2Body?: string;
//   cta2PrimaryCtaText?: string;
//   cta2PrimaryCtaHref?: string;

//   // Bottom CTA
//   bottomCtaTitle?: string;
//   bottomCtaBody?: string;
//   bottomPrimaryCtaText?: string;
//   bottomPrimaryCtaHref?: string;
//   bottomSecondaryCtaText?: string;
//   bottomSecondaryCtaHref?: string;
// };

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

// export function SeoCaseStudyDetailTab({
//   form,
//   onChange,

//   // Hero Stats
//   addHeroStat,
//   updateHeroStat,
//   removeHeroStat,

//   // Highlights
//   addHighlight,
//   updateHighlight,
//   removeHighlight,

//   // About Stats
//   addAboutStat,
//   updateAboutStat,
//   removeAboutStat,

//   // Initial challenges
//   addInitialChallenge,
//   updateInitialChallenge,
//   removeInitialChallenge,

//   // Issues
//   addIssue,
//   updateIssue,
//   removeIssue,

//   // Keywords
//   addKeyword,
//   updateKeyword,
//   removeKeyword,

//   // Tools
//   addTool,
//   updateTool,
//   removeTool,

//   // Testimonials
//   addTestimonial,
//   updateTestimonial,
//   removeTestimonial,

//   // Contact data
//   addContactPoint,
//   updateContactPoint,
//   removeContactPoint,

//   // Metrics
//   addPerformanceMetric,
//   updatePerformanceMetric,
//   removePerformanceMetric,

//   addKeywordMetric,
//   updateKeywordMetric,
//   removeKeywordMetric,
// }: {
//   form: SeoCaseStudyDetailTabValues;
//   onChange: (field: keyof SeoCaseStudyDetailTabValues, value: any) => void;

//   addHeroStat: () => void;
//   updateHeroStat: (index: number, field: keyof SeoCaseStudyHeroStat, value: any) => void;
//   removeHeroStat: (index: number) => void;

//   addHighlight: () => void;
//   updateHighlight: (index: number, field: keyof SeoCaseStudyHighlight, value: any) => void;
//   removeHighlight: (index: number) => void;

//   addAboutStat: () => void;
//   updateAboutStat: (index: number, field: keyof SeoCaseStudyAboutStat, value: any) => void;
//   removeAboutStat: (index: number) => void;

//   addInitialChallenge: () => void;
//   updateInitialChallenge: (
//     index: number,
//     field: keyof SeoCaseStudyInitialChallenge,
//     value: any,
//   ) => void;
//   removeInitialChallenge: (index: number) => void;

//   addIssue: () => void;
//   updateIssue: (index: number, field: keyof SeoCaseStudyIssue, value: any) => void;
//   removeIssue: (index: number) => void;

//   addKeyword: () => void;
//   updateKeyword: (index: number, field: keyof SeoCaseStudyKeywordRow, value: any) => void;
//   removeKeyword: (index: number) => void;

//   addTool: () => void;
//   updateTool: (index: number, field: keyof SeoCaseStudyTool, value: any) => void;
//   removeTool: (index: number) => void;

//   addTestimonial: () => void;
//   updateTestimonial: (index: number, field: keyof SeoCaseStudyTestimonial, value: any) => void;
//   removeTestimonial: (index: number) => void;

//   addContactPoint: () => void;
//   updateContactPoint: (index: number, field: keyof SeoCaseStudyContactPoint, value: any) => void;
//   removeContactPoint: (index: number) => void;

//   addPerformanceMetric: () => void;
//   updatePerformanceMetric: (index: number, field: keyof SeoCaseStudyPerformanceMetric, value: any) => void;
//   removePerformanceMetric: (index: number) => void;

//   addKeywordMetric: () => void;
//   updateKeywordMetric: (index: number, field: keyof SeoCaseStudyKeywordMetric, value: any) => void;
//   removeKeywordMetric: (index: number) => void;
// }) {
//   const heroStats = form.heroStats || [];
//   const highlights = form.highlights || [];
//   const aboutStats = form.aboutStats || [];
//   const initialChallenges = form.initialChallenges || [];
//   const issues = form.issues || [];
//   const topKeywords = form.topKeywords || [];
//   const tools = form.tools || [];
//   const testimonials = form.testimonials || [];
//   const contactData = form.contactData || [];
//   const performanceMetrics = form.performanceMetrics || [];
//   const keywordMetrics = form.keywordMetrics || [];

//   return (
//     <div className="space-y-5 mt-4">
//       <SectionTitle
//         title="Detail Page Fields"
//         subtitle="This section controls the full /case-studies/:slug page content."
//       />

//       {/* HERO */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Hero" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Hero Badge Text</Label>
//             <Input
//               value={form.heroBadgeText || ""}
//               onChange={(e) => onChange("heroBadgeText", e.target.value)}
//               placeholder="SEO Case Study"
//               required
//             />
//           </div>
//           <div>
//             <Label>Hero Case Study Label</Label>
//             <Input
//               value={form.heroCaseStudyLabel || ""}
//               onChange={(e) => onChange("heroCaseStudyLabel", e.target.value)}
//               placeholder="Local SEO Growth"
//               required
//             />
//           </div>
//           <div>
//             <Label>Hero Client Name</Label>
//             <Input
//               value={form.heroClientName || ""}
//               onChange={(e) => onChange("heroClientName", e.target.value)}
//               placeholder="Atlantic Foundation"
//               required
//             />
//           </div>
//           <div>
//             <Label>Hero Rating Text</Label>
//             <Input
//               value={form.heroRatingText || ""}
//               onChange={(e) => onChange("heroRatingText", e.target.value)}
//               placeholder="Rated 5/5 by the client"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <Label>Hero Headline</Label>
//           <Input
//             value={form.heroHeadline || ""}
//             onChange={(e) => onChange("heroHeadline", e.target.value)}
//             placeholder="From 69 SEO Score → 100 and 121% More Leads"
//             required
//           />
//         </div>

//         <div>
//           <Label>Hero Description</Label>
//           <TextArea
//             value={String(form.heroDescription || "")}
//             onChange={(v) => onChange("heroDescription", v)}
//             placeholder="Short hero description..."
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Hero Primary CTA Text</Label>
//             <Input
//               value={form.heroPrimaryCtaText || ""}
//               onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)}
//               placeholder="Book a Strategy Call"
//               required
//             />
//           </div>
//           <div>
//             <Label>Hero Primary CTA Href</Label>
//             <Input
//               value={form.heroPrimaryCtaHref || ""}
//               onChange={(e) => onChange("heroPrimaryCtaHref", e.target.value)}
//               placeholder="/contact"
//             />
//           </div>
//           <div>
//             <Label>Hero Video URL</Label>
//             <Input
//               value={form.heroVideoUrl || ""}
//               onChange={(e) => onChange("heroVideoUrl", e.target.value)}
//               placeholder="https://..."
//             />
//           </div>
//           <div>
//             <Label>Hero Video Poster</Label>
//             <Input
//               value={form.heroVideoPoster || ""}
//               onChange={(e) => onChange("heroVideoPoster", e.target.value)}
//               placeholder="https://..."
//             />
//           </div>
//           <div className="md:col-span-2">
//             <Label>Hero Video Badge Text</Label>
//             <Input
//               value={form.heroVideoBadgeText || ""}
//               onChange={(e) => onChange("heroVideoBadgeText", e.target.value)}
//               placeholder="Watch the results"
//             />
//           </div>
//         </div>

//         {/* HERO STATS */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Hero Stats</Label>
//             <Button type="button" variant="outline" size="sm" onClick={addHeroStat}>
//               Add Stat
//             </Button>
//           </div>

//           {heroStats.map((s, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-4"
//                 value={s.value}
//                 onChange={(e) => updateHeroStat(i, "value", e.target.value)}
//                 placeholder="+49%"
//               />
//               <Input
//                 className="md:col-span-6"
//                 value={s.label}
//                 onChange={(e) => updateHeroStat(i, "label", e.target.value)}
//                 placeholder="Organic Traffic"
//               />
//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 className="md:col-span-2"
//                 onClick={() => removeHeroStat(i)}
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* HIGHLIGHTS */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Highlights" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Highlights Title</Label>
//             <Input
//               value={form.highlightsTitle || ""}
//               onChange={(e) => onChange("highlightsTitle", e.target.value)}
//               placeholder="Key Wins"
//               required
//             />
//           </div>
//           <div>
//             <Label>Highlights Subtitle</Label>
//             <Input
//               value={form.highlightsSubtitle || ""}
//               onChange={(e) => onChange("highlightsSubtitle", e.target.value)}
//               placeholder="What we improved fast"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Highlight Cards</Label>
//           <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
//             Add Highlight
//           </Button>
//         </div>

//         {highlights.map((h, i) => (
//           <div key={i} className="border rounded-lg p-3 space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Icon Key</Label>
//                 <Input
//                   value={h.iconKey}
//                   onChange={(e) => updateHighlight(i, "iconKey", e.target.value)}
//                   placeholder="rocket / chart / badge"
//                 />
//               </div>
//               <div>
//                 <Label>Color Class</Label>
//                 <Input
//                   value={h.colorClass || ""}
//                   onChange={(e) => updateHighlight(i, "colorClass", e.target.value)}
//                   placeholder="text-green-600"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Title</Label>
//               <Input
//                 value={h.title}
//                 onChange={(e) => updateHighlight(i, "title", e.target.value)}
//                 placeholder="SEO Score Improved"
//               />
//             </div>

//             <div>
//               <Label>Description</Label>
//               <TextArea
//                 value={h.description}
//                 onChange={(v) => updateHighlight(i, "description", v)}
//                 placeholder="What happened..."
//               />
//             </div>

//             <div>
//               <Label>Subtext</Label>
//               <Input
//                 value={h.subtext || ""}
//                 onChange={(e) => updateHighlight(i, "subtext", e.target.value)}
//                 placeholder="Optional small note"
//               />
//             </div>

//             <Button type="button" variant="destructive" onClick={() => removeHighlight(i)}>
//               Remove Highlight
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* CTA 1 */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="CTA 1" />
//         <div>
//           <Label>CTA 1 Title</Label>
//           <Input
//             value={form.cta1Title || ""}
//             onChange={(e) => onChange("cta1Title", e.target.value)}
//             placeholder="Want results like this?"
//             required
//           />
//         </div>
//         <div>
//           <Label>CTA 1 Body</Label>
//           <TextArea
//             value={String(form.cta1Body || "")}
//             onChange={(v) => onChange("cta1Body", v)}
//             placeholder="CTA copy..."
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>CTA 1 Button Text</Label>
//             <Input
//               value={form.cta1PrimaryCtaText || ""}
//               onChange={(e) => onChange("cta1PrimaryCtaText", e.target.value)}
//               placeholder="Get Free Audit"
//               required
//             />
//           </div>
//           <div>
//             <Label>CTA 1 Button Link</Label>
//             <Input
//               value={form.cta1PrimaryCtaHref || ""}
//               onChange={(e) => onChange("cta1PrimaryCtaHref", e.target.value)}
//               placeholder="/seo-audit"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ABOUT */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="About Section" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>About Badge Text</Label>
//             <Input
//               value={form.aboutBadgeText || ""}
//               onChange={(e) => onChange("aboutBadgeText", e.target.value)}
//               placeholder="About the Client"
//               required
//             />
//           </div>
//           <div>
//             <Label>About Logo URL</Label>
//             <Input
//               value={form.aboutLogoUrl || ""}
//               onChange={(e) => onChange("aboutLogoUrl", e.target.value)}
//               placeholder="https://..."
//             />
//           </div>
//         </div>

//         <div>
//           <Label>About Title</Label>
//           <Input
//             value={form.aboutTitle || ""}
//             onChange={(e) => onChange("aboutTitle", e.target.value)}
//             placeholder="Atlantic Foundation & Crawl Space Repair"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>About Paragraph 1</Label>
//             <TextArea
//               value={String(form.aboutParagraph1 || "")}
//               onChange={(v) => onChange("aboutParagraph1", v)}
//               placeholder="Paragraph 1..."
//             />
//           </div>
//           <div>
//             <Label>About Paragraph 2</Label>
//             <TextArea
//               value={String(form.aboutParagraph2 || "")}
//               onChange={(v) => onChange("aboutParagraph2", v)}
//               placeholder="Paragraph 2..."
//             />
//           </div>
//         </div>

//         {/* About Stats */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">About Stats</Label>
//             <Button type="button" variant="outline" size="sm" onClick={addAboutStat}>
//               Add About Stat
//             </Button>
//           </div>

//           {aboutStats.map((a, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-3"
//                 value={a.iconKey}
//                 onChange={(e) => updateAboutStat(i, "iconKey", e.target.value)}
//                 placeholder="iconKey"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={a.label}
//                 onChange={(e) => updateAboutStat(i, "label", e.target.value)}
//                 placeholder="Label"
//               />
//               <Input
//                 className="md:col-span-3"
//                 value={a.value}
//                 onChange={(e) => updateAboutStat(i, "value", e.target.value)}
//                 placeholder="Value"
//               />
//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 className="md:col-span-2"
//                 onClick={() => removeAboutStat(i)}
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>

//         {/* Initial Challenges */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Initial Challenges</Label>
//             <Button type="button" variant="outline" size="sm" onClick={addInitialChallenge}>
//               Add Challenge
//             </Button>
//           </div>

//           <div>
//             <Label>Initial Challenges Title</Label>
//             <Input
//               value={form.initialChallengesTitle || ""}
//               onChange={(e) => onChange("initialChallengesTitle", e.target.value)}
//               placeholder="Initial challenges"
//               required
//             />
//           </div>

//           {initialChallenges.map((c, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-2"
//                 type="number"
//                 value={Number(c.order || 0)}
//                 onChange={(e) => updateInitialChallenge(i, "order", Number(e.target.value))}
//                 placeholder="Order"
//               />
//               <Input
//                 className="md:col-span-8"
//                 value={c.text}
//                 onChange={(e) => updateInitialChallenge(i, "text", e.target.value)}
//                 placeholder="Challenge text..."
//               />
//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 className="md:col-span-2"
//                 onClick={() => removeInitialChallenge(i)}
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ISSUES */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Issues Section" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Issues Title</Label>
//             <Input
//               value={form.issuesSectionTitle || ""}
//               onChange={(e) => onChange("issuesSectionTitle", e.target.value)}
//               placeholder="Issues we fixed"
//               required
//             />
//           </div>
//           <div>
//             <Label>Issues Subtitle</Label>
//             <Input
//               value={form.issuesSectionSubtitle || ""}
//               onChange={(e) => onChange("issuesSectionSubtitle", e.target.value)}
//               placeholder="Technical + content + local"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Issues</Label>
//           <Button type="button" variant="outline" size="sm" onClick={addIssue}>
//             Add Issue
//           </Button>
//         </div>

//         {issues.map((it, i) => (
//           <div key={i} className="border rounded-lg p-3 space-y-2">
//             <div>
//               <Label>Issue</Label>
//               <Input
//                 value={it.issue}
//                 onChange={(e) => updateIssue(i, "issue", e.target.value)}
//                 placeholder="Slow page speed / Missing H1 / etc"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Severity</Label>
//                 <select
//                   value={it.severity}
//                   onChange={(e) => updateIssue(i, "severity", e.target.value)}
//                   className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
//                 >
//                   <option value="Critical">Critical</option>
//                   <option value="High">High</option>
//                   <option value="Medium">Medium</option>
//                 </select>
//               </div>
//               <div>
//                 <Label>Action</Label>
//                 <Input
//                   value={it.action}
//                   onChange={(e) => updateIssue(i, "action", e.target.value)}
//                   placeholder="What you did"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Result</Label>
//               <Input
//                 value={it.result}
//                 onChange={(e) => updateIssue(i, "result", e.target.value)}
//                 placeholder="What improved"
//               />
//             </div>

//             <Button type="button" variant="destructive" onClick={() => removeIssue(i)}>
//               Remove Issue
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* KEYWORDS */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Keyword Performance" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Keyword Performance Title</Label>
//             <Input
//               value={form.keywordPerformanceTitle || ""}
//               onChange={(e) => onChange("keywordPerformanceTitle", e.target.value)}
//               placeholder="Keyword performance"
//               required
//             />
//           </div>
//           <div>
//             <Label>Keyword Performance Subtitle</Label>
//             <Input
//               value={form.keywordPerformanceSubtitle || ""}
//               onChange={(e) => onChange("keywordPerformanceSubtitle", e.target.value)}
//               placeholder="Top movers"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Top Keywords</Label>
//           <Button type="button" variant="outline" size="sm" onClick={addKeyword}>
//             Add Keyword
//           </Button>
//         </div>

//         {topKeywords.map((k, i) => (
//           <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//             <Input
//               className="md:col-span-5"
//               value={k.keyword}
//               onChange={(e) => updateKeyword(i, "keyword", e.target.value)}
//               placeholder="keyword"
//             />
//             <Input
//               className="md:col-span-2"
//               type="number"
//               value={Number(k.position || 0)}
//               onChange={(e) => updateKeyword(i, "position", Number(e.target.value))}
//               placeholder="pos"
//             />
//             <Input
//               className="md:col-span-2"
//               type="number"
//               value={Number(k.previousPosition || 0)}
//               onChange={(e) => updateKeyword(i, "previousPosition", Number(e.target.value))}
//               placeholder="prev"
//             />
//             <Input
//               className="md:col-span-2"
//               value={k.volume}
//               onChange={(e) => updateKeyword(i, "volume", e.target.value)}
//               placeholder="volume"
//             />
//             <Button
//               type="button"
//               variant="destructive"
//               size="sm"
//               className="md:col-span-1"
//               onClick={() => removeKeyword(i)}
//             >
//               X
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* TOOLS */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Tools" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Tools Section Title</Label>
//             <Input
//               value={form.toolsSectionTitle || ""}
//               onChange={(e) => onChange("toolsSectionTitle", e.target.value)}
//               placeholder="Tools we used"
//               required
//             />
//           </div>
//           <div>
//             <Label>Tools Section Subtitle</Label>
//             <Input
//               value={form.toolsSectionSubtitle || ""}
//               onChange={(e) => onChange("toolsSectionSubtitle", e.target.value)}
//               placeholder="Stack"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Tools</Label>
//           <Button type="button" variant="outline" size="sm" onClick={addTool}>
//             Add Tool
//           </Button>
//         </div>

//         {tools.map((t, i) => (
//           <div key={i} className="border rounded-lg p-3 space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Icon Key</Label>
//                 <Input
//                   value={t.iconKey}
//                   onChange={(e) => updateTool(i, "iconKey", e.target.value)}
//                   placeholder="gsc / ga4 / ahrefs"
//                 />
//               </div>
//               <div>
//                 <Label>Color Class</Label>
//                 <Input
//                   value={t.colorClass || ""}
//                   onChange={(e) => updateTool(i, "colorClass", e.target.value)}
//                   placeholder="text-blue-600"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Name</Label>
//                 <Input
//                   value={t.name}
//                   onChange={(e) => updateTool(i, "name", e.target.value)}
//                   placeholder="Google Search Console"
//                 />
//               </div>
//               <div>
//                 <Label>Category</Label>
//                 <Input
//                   value={t.category}
//                   onChange={(e) => updateTool(i, "category", e.target.value)}
//                   placeholder="Analytics"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Usage</Label>
//               <Input
//                 value={t.usage}
//                 onChange={(e) => updateTool(i, "usage", e.target.value)}
//                 placeholder="Monitored query performance"
//               />
//             </div>

//             <Button type="button" variant="destructive" onClick={() => removeTool(i)}>
//               Remove Tool
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* TESTIMONIALS + METRICS */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Testimonials & Metrics" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Testimonials Title</Label>
//             <Input
//               value={form.testimonialsSectionTitle || ""}
//               onChange={(e) => onChange("testimonialsSectionTitle", e.target.value)}
//               placeholder="What the client said"
//               required
//             />
//           </div>
//           <div>
//             <Label>Testimonials Subtitle</Label>
//             <Input
//               value={form.testimonialsSectionSubtitle || ""}
//               onChange={(e) => onChange("testimonialsSectionSubtitle", e.target.value)}
//               placeholder="Feedback + KPI lift"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Label className="font-semibold">Testimonials</Label>
//           <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
//             Add Testimonial
//           </Button>
//         </div>

//         {testimonials.map((t, i) => (
//           <div key={i} className="border rounded-lg p-3 space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Name</Label>
//                 <Input
//                   value={t.name}
//                   onChange={(e) => updateTestimonial(i, "name", e.target.value)}
//                   placeholder="John"
//                 />
//               </div>
//               <div>
//                 <Label>Rating</Label>
//                 <Input
//                   type="number"
//                   value={Number(t.rating || 5)}
//                   onChange={(e) => updateTestimonial(i, "rating", Number(e.target.value))}
//                   placeholder="5"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>Role</Label>
//                 <Input
//                   value={t.role}
//                   onChange={(e) => updateTestimonial(i, "role", e.target.value)}
//                   placeholder="Owner"
//                 />
//               </div>
//               <div>
//                 <Label>Company</Label>
//                 <Input
//                   value={t.company}
//                   onChange={(e) => updateTestimonial(i, "company", e.target.value)}
//                   placeholder="Atlantic Foundation"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Image URL</Label>
//               <Input
//                 value={t.imageUrl}
//                 onChange={(e) => updateTestimonial(i, "imageUrl", e.target.value)}
//                 placeholder="https://..."
//               />
//             </div>

//             <div>
//               <Label>Quote</Label>
//               <TextArea
//                 value={t.quote}
//                 onChange={(v) => updateTestimonial(i, "quote", v)}
//                 placeholder="Client quote..."
//               />
//             </div>

//             <Button type="button" variant="destructive" onClick={() => removeTestimonial(i)}>
//               Remove Testimonial
//             </Button>
//           </div>
//         ))}

//         {/* Contact Data */}
//         <div className="pt-2 space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Contact Data (Chart)</Label>
//             <Button type="button" variant="outline" size="sm" onClick={addContactPoint}>
//               Add Point
//             </Button>
//           </div>

//           {contactData.map((p, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-7"
//                 value={p.month}
//                 onChange={(e) => updateContactPoint(i, "month", e.target.value)}
//                 placeholder="Jan"
//               />
//               <Input
//                 className="md:col-span-4"
//                 type="number"
//                 value={Number(p.submissions || 0)}
//                 onChange={(e) => updateContactPoint(i, "submissions", Number(e.target.value))}
//                 placeholder="submissions"
//               />
//               <Button
//                 className="md:col-span-1"
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => removeContactPoint(i)}
//               >
//                 X
//               </Button>
//             </div>
//           ))}
//         </div>

//         {/* Performance Metrics */}
//         <div className="pt-2 space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Performance Metrics</Label>
//             <Button type="button" variant="outline" size="sm" onClick={addPerformanceMetric}>
//               Add Metric
//             </Button>
//           </div>

//           {performanceMetrics.map((m, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-4"
//                 value={m.label}
//                 onChange={(e) => updatePerformanceMetric(i, "label", e.target.value)}
//                 placeholder="CTR"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={m.value}
//                 onChange={(e) => updatePerformanceMetric(i, "value", e.target.value)}
//                 placeholder="1.21%"
//               />
//               <Input
//                 className="md:col-span-3"
//                 value={m.change}
//                 onChange={(e) => updatePerformanceMetric(i, "change", e.target.value)}
//                 placeholder="+12%"
//               />
//               <Button
//                 className="md:col-span-1"
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => removePerformanceMetric(i)}
//               >
//                 X
//               </Button>
//             </div>
//           ))}
//         </div>

//         {/* Keyword Metrics */}
//         <div className="pt-2 space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="font-semibold">Keyword Metrics</Label>
//             <Button type="button" variant="outline" size="sm" onClick={addKeywordMetric}>
//               Add Metric
//             </Button>
//           </div>

//           {keywordMetrics.map((m, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
//               <Input
//                 className="md:col-span-4"
//                 value={m.label}
//                 onChange={(e) => updateKeywordMetric(i, "label", e.target.value)}
//                 placeholder="Top 3"
//               />
//               <Input
//                 className="md:col-span-4"
//                 value={m.value}
//                 onChange={(e) => updateKeywordMetric(i, "value", e.target.value)}
//                 placeholder="22"
//               />
//               <Input
//                 className="md:col-span-3"
//                 value={m.percentage}
//                 onChange={(e) => updateKeywordMetric(i, "percentage", e.target.value)}
//                 placeholder="18%"
//               />
//               <Button
//                 className="md:col-span-1"
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => removeKeywordMetric(i)}
//               >
//                 X
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CTA 2 */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="CTA 2" />
//         <div>
//           <Label>CTA 2 Title</Label>
//           <Input
//             value={form.cta2Title || ""}
//             onChange={(e) => onChange("cta2Title", e.target.value)}
//             placeholder="Ready to grow?"
//             required
//           />
//         </div>
//         <div>
//           <Label>CTA 2 Body</Label>
//           <TextArea
//             value={String(form.cta2Body || "")}
//             onChange={(v) => onChange("cta2Body", v)}
//             placeholder="CTA copy..."
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>CTA 2 Button Text</Label>
//             <Input
//               value={form.cta2PrimaryCtaText || ""}
//               onChange={(e) => onChange("cta2PrimaryCtaText", e.target.value)}
//               placeholder="Talk to Us"
//               required
//             />
//           </div>
//           <div>
//             <Label>CTA 2 Button Link</Label>
//             <Input
//               value={form.cta2PrimaryCtaHref || ""}
//               onChange={(e) => onChange("cta2PrimaryCtaHref", e.target.value)}
//               placeholder="/contact"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Bottom CTA */}
//       <div className="border rounded-lg p-3 space-y-3">
//         <SectionTitle title="Bottom CTA" />
//         <div>
//           <Label>Bottom CTA Title</Label>
//           <Input
//             value={form.bottomCtaTitle || ""}
//             onChange={(e) => onChange("bottomCtaTitle", e.target.value)}
//             placeholder="Let’s build your rankings"
//             required
//           />
//         </div>
//         <div>
//           <Label>Bottom CTA Body</Label>
//           <TextArea
//             value={String(form.bottomCtaBody || "")}
//             onChange={(v) => onChange("bottomCtaBody", v)}
//             placeholder="CTA copy..."
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <Label>Bottom Primary CTA Text</Label>
//             <Input
//               value={form.bottomPrimaryCtaText || ""}
//               onChange={(e) => onChange("bottomPrimaryCtaText", e.target.value)}
//               placeholder="Start Now"
//               required
//             />
//           </div>
//           <div>
//             <Label>Bottom Primary CTA Link</Label>
//             <Input
//               value={form.bottomPrimaryCtaHref || ""}
//               onChange={(e) => onChange("bottomPrimaryCtaHref", e.target.value)}
//               placeholder="/contact"
//             />
//           </div>
//           <div>
//             <Label>Bottom Secondary CTA Text</Label>
//             <Input
//               value={form.bottomSecondaryCtaText || ""}
//               onChange={(e) => onChange("bottomSecondaryCtaText", e.target.value)}
//               placeholder="See Pricing"
//               required
//             />
//           </div>
//           <div>
//             <Label>Bottom Secondary CTA Link</Label>
//             <Input
//               value={form.bottomSecondaryCtaHref || ""}
//               onChange={(e) => onChange("bottomSecondaryCtaHref", e.target.value)}
//               placeholder="/pricing"
//             />
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

// ✅ Types
export type SeoCaseStudyHeroStat = { value: string; label: string };
export type SeoCaseStudyHighlight = {
  iconKey: string;
  title: string;
  description: string;
  subtext?: string;
  colorClass?: string;
};
export type SeoCaseStudyAboutStat = { iconKey: string; label: string; value: string };
export type SeoCaseStudyInitialChallenge = { order: number; text: string };
export type SeoCaseStudyIssue = {
  issue: string;
  severity: "Critical" | "High" | "Medium";
  action: string;
  result: string;
};
export type SeoCaseStudyKeywordRow = {
  keyword: string;
  position: number;
  previousPosition: number;
  volume: string;
};
export type SeoCaseStudyTool = {
  iconKey: string;
  name: string;
  category: string;
  usage: string;
  colorClass?: string;
};
export type SeoCaseStudyTestimonial = {
  name: string;
  role: string;
  company: string;
  imageUrl: string;
  quote: string;
  rating: number;
};
export type SeoCaseStudyContactPoint = { month: string; submissions: number };
export type SeoCaseStudyPerformanceMetric = { label: string; value: string; change: string };
export type SeoCaseStudyKeywordMetric = { label: string; value: string; percentage: string };

export type SeoCaseStudyDetailTabValues = {
  // ✅ FK
  cardId?: string;

  // Hero
  heroBadgeText?: string;
  heroCaseStudyLabel?: string;
  heroClientName?: string;
  heroRatingText?: string;
  heroHeadline?: string;
  heroDescription?: string;
  heroStats?: SeoCaseStudyHeroStat[];
  heroPrimaryCtaText?: string;
  heroPrimaryCtaHref?: string;
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  // Highlights
  highlightsTitle?: string;
  highlightsSubtitle?: string;
  highlights?: SeoCaseStudyHighlight[];

  // CTA 1
  cta1Title?: string;
  cta1Body?: string;
  cta1PrimaryCtaText?: string;
  cta1PrimaryCtaHref?: string;

  // About
  aboutBadgeText?: string;
  aboutLogoUrl?: string;
  aboutTitle?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutStats?: SeoCaseStudyAboutStat[];
  initialChallengesTitle?: string;
  initialChallenges?: SeoCaseStudyInitialChallenge[];

  // Issues
  issuesSectionTitle?: string;
  issuesSectionSubtitle?: string;
  issues?: SeoCaseStudyIssue[];

  // Keyword performance
  keywordPerformanceTitle?: string;
  keywordPerformanceSubtitle?: string;
  topKeywords?: SeoCaseStudyKeywordRow[];

  // Tools
  toolsSectionTitle?: string;
  toolsSectionSubtitle?: string;
  tools?: SeoCaseStudyTool[];

  // Testimonials + Metrics
  testimonialsSectionTitle?: string;
  testimonialsSectionSubtitle?: string;
  testimonials?: SeoCaseStudyTestimonial[];
  contactData?: SeoCaseStudyContactPoint[];
  performanceMetrics?: SeoCaseStudyPerformanceMetric[];
  keywordMetrics?: SeoCaseStudyKeywordMetric[];

  // CTA 2
  cta2Title?: string;
  cta2Body?: string;
  cta2PrimaryCtaText?: string;
  cta2PrimaryCtaHref?: string;

  // Bottom CTA
  bottomCtaTitle?: string;
  bottomCtaBody?: string;
  bottomPrimaryCtaText?: string;
  bottomPrimaryCtaHref?: string;
  bottomSecondaryCtaText?: string;
  bottomSecondaryCtaHref?: string;
};

// ✅ dropdown option type
type CardOption = {
  _id: string;
  slug: string;
  cardTitle: string;
  cardClient: string;
  cardIndustry: string;
};

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-md p-2 mt-1 min-h-[84px]"
    />
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

export function SeoCaseStudyDetailTab({
  form,
  onChange,
  cardOptions,

  // Hero Stats
  addHeroStat,
  updateHeroStat,
  removeHeroStat,

  // Highlights
  addHighlight,
  updateHighlight,
  removeHighlight,

  // About Stats
  addAboutStat,
  updateAboutStat,
  removeAboutStat,

  // Initial challenges
  addInitialChallenge,
  updateInitialChallenge,
  removeInitialChallenge,

  // Issues
  addIssue,
  updateIssue,
  removeIssue,

  // Keywords
  addKeyword,
  updateKeyword,
  removeKeyword,

  // Tools
  addTool,
  updateTool,
  removeTool,

  // Testimonials
  addTestimonial,
  updateTestimonial,
  removeTestimonial,

  // Contact data
  addContactPoint,
  updateContactPoint,
  removeContactPoint,

  // Metrics
  addPerformanceMetric,
  updatePerformanceMetric,
  removePerformanceMetric,

  addKeywordMetric,
  updateKeywordMetric,
  removeKeywordMetric,
}: {
  form: SeoCaseStudyDetailTabValues;
  onChange: (field: keyof SeoCaseStudyDetailTabValues, value: any) => void;

  cardOptions: CardOption[]; // ✅

  addHeroStat: () => void;
  updateHeroStat: (index: number, field: keyof SeoCaseStudyHeroStat, value: any) => void;
  removeHeroStat: (index: number) => void;

  addHighlight: () => void;
  updateHighlight: (index: number, field: keyof SeoCaseStudyHighlight, value: any) => void;
  removeHighlight: (index: number) => void;

  addAboutStat: () => void;
  updateAboutStat: (index: number, field: keyof SeoCaseStudyAboutStat, value: any) => void;
  removeAboutStat: (index: number) => void;

  addInitialChallenge: () => void;
  updateInitialChallenge: (
    index: number,
    field: keyof SeoCaseStudyInitialChallenge,
    value: any
  ) => void;
  removeInitialChallenge: (index: number) => void;

  addIssue: () => void;
  updateIssue: (index: number, field: keyof SeoCaseStudyIssue, value: any) => void;
  removeIssue: (index: number) => void;

  addKeyword: () => void;
  updateKeyword: (index: number, field: keyof SeoCaseStudyKeywordRow, value: any) => void;
  removeKeyword: (index: number) => void;

  addTool: () => void;
  updateTool: (index: number, field: keyof SeoCaseStudyTool, value: any) => void;
  removeTool: (index: number) => void;

  addTestimonial: () => void;
  updateTestimonial: (index: number, field: keyof SeoCaseStudyTestimonial, value: any) => void;
  removeTestimonial: (index: number) => void;

  addContactPoint: () => void;
  updateContactPoint: (index: number, field: keyof SeoCaseStudyContactPoint, value: any) => void;
  removeContactPoint: (index: number) => void;

  addPerformanceMetric: () => void;
  updatePerformanceMetric: (index: number, field: keyof SeoCaseStudyPerformanceMetric, value: any) => void;
  removePerformanceMetric: (index: number) => void;

  addKeywordMetric: () => void;
  updateKeywordMetric: (index: number, field: keyof SeoCaseStudyKeywordMetric, value: any) => void;
  removeKeywordMetric: (index: number) => void;
}) {
  const heroStats = form.heroStats || [];
  const highlights = form.highlights || [];
  const aboutStats = form.aboutStats || [];
  const initialChallenges = form.initialChallenges || [];
  const issues = form.issues || [];
  const topKeywords = form.topKeywords || [];
  const tools = form.tools || [];
  const testimonials = form.testimonials || [];
  const contactData = form.contactData || [];
  const performanceMetrics = form.performanceMetrics || [];
  const keywordMetrics = form.keywordMetrics || [];

  return (
    <div className="space-y-5 mt-4">
      <SectionTitle
        title="Detail Page Fields"
        subtitle="This section controls the full /case-studies/:slug page content."
      />

      {/* ✅ FK selector */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <SectionTitle title="Link Detail to Existing Case Study" subtitle="Pick which Case study to this detail belongs to." />

        <div>
          <Label>Select Seo Case Study</Label>
          <select
            value={form.cardId || ""}
            onChange={(e) => onChange("cardId", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
          >
            <option value="">-- Select a Card --</option>
            {cardOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.cardTitle} • {c.cardClient} • ({c.slug})
              </option>
            ))}
          </select>

          {!form.cardId ? (
            <div className="text-xs text-amber-600 mt-1">
              ⚠️ Select a card first, then save detail.
            </div>
          ) : null}
        </div>
      </div>

      {/* HERO */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Hero" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Hero Badge Text</Label>
            <Input
              value={form.heroBadgeText || ""}
              onChange={(e) => onChange("heroBadgeText", e.target.value)}
              placeholder="SEO Case Study"
              required
            />
          </div>
          <div>
            <Label>Hero Case Study Label</Label>
            <Input
              value={form.heroCaseStudyLabel || ""}
              onChange={(e) => onChange("heroCaseStudyLabel", e.target.value)}
              placeholder="Local SEO Growth"
              required
            />
          </div>
          <div>
            <Label>Hero Client Name</Label>
            <Input
              value={form.heroClientName || ""}
              onChange={(e) => onChange("heroClientName", e.target.value)}
              placeholder="Atlantic Foundation"
              required
            />
          </div>
          <div>
            <Label>Hero Rating Text</Label>
            <Input
              value={form.heroRatingText || ""}
              onChange={(e) => onChange("heroRatingText", e.target.value)}
              placeholder="Rated 5/5 by the client"
              required
            />
          </div>
        </div>

        <div>
          <Label>Hero Headline</Label>
          <Input
            value={form.heroHeadline || ""}
            onChange={(e) => onChange("heroHeadline", e.target.value)}
            placeholder="From 69 SEO Score → 100 and 121% More Leads"
            required
          />
        </div>

        <div>
          <Label>Hero Description</Label>
          <TextArea
            value={String(form.heroDescription || "")}
            onChange={(v) => onChange("heroDescription", v)}
            placeholder="Short hero description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Hero Primary CTA Text</Label>
            <Input
              value={form.heroPrimaryCtaText || ""}
              onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)}
              placeholder="Book a Strategy Call"
              required
            />
          </div>
          <div>
            <Label>Hero Primary CTA Href</Label>
            <Input
              value={form.heroPrimaryCtaHref || ""}
              onChange={(e) => onChange("heroPrimaryCtaHref", e.target.value)}
              placeholder="/contact"
            />
          </div>
          <div>
            <Label>Hero Video URL</Label>
            <Input
              value={form.heroVideoUrl || ""}
              onChange={(e) => onChange("heroVideoUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Hero Video Poster</Label>
            <Input
              value={form.heroVideoPoster || ""}
              onChange={(e) => onChange("heroVideoPoster", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2">
            <Label>Hero Video Badge Text</Label>
            <Input
              value={form.heroVideoBadgeText || ""}
              onChange={(e) => onChange("heroVideoBadgeText", e.target.value)}
              placeholder="Watch the results"
            />
          </div>
        </div>

        {/* HERO STATS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Hero Stats</Label>
            <Button type="button" variant="outline" size="sm" onClick={addHeroStat}>
              Add Stat
            </Button>
          </div>

          {heroStats.map((s, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-4"
                value={s.value}
                onChange={(e) => updateHeroStat(i, "value", e.target.value)}
                placeholder="+49%"
              />
              <Input
                className="md:col-span-6"
                value={s.label}
                onChange={(e) => updateHeroStat(i, "label", e.target.value)}
                placeholder="Organic Traffic"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="md:col-span-2"
                onClick={() => removeHeroStat(i)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Highlights" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Highlights Title</Label>
            <Input
              value={form.highlightsTitle || ""}
              onChange={(e) => onChange("highlightsTitle", e.target.value)}
              placeholder="Key Wins"
              required
            />
          </div>
          <div>
            <Label>Highlights Subtitle</Label>
            <Input
              value={form.highlightsSubtitle || ""}
              onChange={(e) => onChange("highlightsSubtitle", e.target.value)}
              placeholder="What we improved fast"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Highlight Cards</Label>
          <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
            Add Highlight
          </Button>
        </div>

        {highlights.map((h, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Icon Key</Label>
                <Input
                  value={h.iconKey}
                  onChange={(e) => updateHighlight(i, "iconKey", e.target.value)}
                  placeholder="rocket / chart / badge"
                />
              </div>
              <div>
                <Label>Color Class</Label>
                <Input
                  value={h.colorClass || ""}
                  onChange={(e) => updateHighlight(i, "colorClass", e.target.value)}
                  placeholder="text-green-600"
                />
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={h.title}
                onChange={(e) => updateHighlight(i, "title", e.target.value)}
                placeholder="SEO Score Improved"
              />
            </div>

            <div>
              <Label>Description</Label>
              <TextArea
                value={h.description}
                onChange={(v) => updateHighlight(i, "description", v)}
                placeholder="What happened..."
              />
            </div>

            <div>
              <Label>Subtext</Label>
              <Input
                value={h.subtext || ""}
                onChange={(e) => updateHighlight(i, "subtext", e.target.value)}
                placeholder="Optional small note"
              />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeHighlight(i)}>
              Remove Highlight
            </Button>
          </div>
        ))}
      </div>

      {/* CTA 1 */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="CTA 1" />
        <div>
          <Label>CTA 1 Title</Label>
          <Input
            value={form.cta1Title || ""}
            onChange={(e) => onChange("cta1Title", e.target.value)}
            placeholder="Want results like this?"
            required
          />
        </div>
        <div>
          <Label>CTA 1 Body</Label>
          <TextArea
            value={String(form.cta1Body || "")}
            onChange={(v) => onChange("cta1Body", v)}
            placeholder="CTA copy..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>CTA 1 Button Text</Label>
            <Input
              value={form.cta1PrimaryCtaText || ""}
              onChange={(e) => onChange("cta1PrimaryCtaText", e.target.value)}
              placeholder="Get Free Audit"
              required
            />
          </div>
          <div>
            <Label>CTA 1 Button Link</Label>
            <Input
              value={form.cta1PrimaryCtaHref || ""}
              onChange={(e) => onChange("cta1PrimaryCtaHref", e.target.value)}
              placeholder="/seo-audit"
            />
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="About Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>About Badge Text</Label>
            <Input
              value={form.aboutBadgeText || ""}
              onChange={(e) => onChange("aboutBadgeText", e.target.value)}
              placeholder="About the Client"
              required
            />
          </div>
          <div>
            <Label>About Logo URL</Label>
            <Input
              value={form.aboutLogoUrl || ""}
              onChange={(e) => onChange("aboutLogoUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <Label>About Title</Label>
          <Input
            value={form.aboutTitle || ""}
            onChange={(e) => onChange("aboutTitle", e.target.value)}
            placeholder="Atlantic Foundation & Crawl Space Repair"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>About Paragraph 1</Label>
            <TextArea
              value={String(form.aboutParagraph1 || "")}
              onChange={(v) => onChange("aboutParagraph1", v)}
              placeholder="Paragraph 1..."
            />
          </div>
          <div>
            <Label>About Paragraph 2</Label>
            <TextArea
              value={String(form.aboutParagraph2 || "")}
              onChange={(v) => onChange("aboutParagraph2", v)}
              placeholder="Paragraph 2..."
            />
          </div>
        </div>

        {/* About Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">About Stats</Label>
            <Button type="button" variant="outline" size="sm" onClick={addAboutStat}>
              Add About Stat
            </Button>
          </div>

          {aboutStats.map((a, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-3"
                value={a.iconKey}
                onChange={(e) => updateAboutStat(i, "iconKey", e.target.value)}
                placeholder="iconKey"
              />
              <Input
                className="md:col-span-4"
                value={a.label}
                onChange={(e) => updateAboutStat(i, "label", e.target.value)}
                placeholder="Label"
              />
              <Input
                className="md:col-span-3"
                value={a.value}
                onChange={(e) => updateAboutStat(i, "value", e.target.value)}
                placeholder="Value"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="md:col-span-2"
                onClick={() => removeAboutStat(i)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Initial Challenges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Initial Challenges</Label>
            <Button type="button" variant="outline" size="sm" onClick={addInitialChallenge}>
              Add Challenge
            </Button>
          </div>

          <div>
            <Label>Initial Challenges Title</Label>
            <Input
              value={form.initialChallengesTitle || ""}
              onChange={(e) => onChange("initialChallengesTitle", e.target.value)}
              placeholder="Initial challenges"
              required
            />
          </div>

          {initialChallenges.map((c, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-2"
                type="number"
                value={Number(c.order || 0)}
                onChange={(e) => updateInitialChallenge(i, "order", Number(e.target.value))}
                placeholder="Order"
              />
              <Input
                className="md:col-span-8"
                value={c.text}
                onChange={(e) => updateInitialChallenge(i, "text", e.target.value)}
                placeholder="Challenge text..."
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="md:col-span-2"
                onClick={() => removeInitialChallenge(i)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ISSUES */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Issues Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Issues Title</Label>
            <Input
              value={form.issuesSectionTitle || ""}
              onChange={(e) => onChange("issuesSectionTitle", e.target.value)}
              placeholder="Issues we fixed"
              required
            />
          </div>
          <div>
            <Label>Issues Subtitle</Label>
            <Input
              value={form.issuesSectionSubtitle || ""}
              onChange={(e) => onChange("issuesSectionSubtitle", e.target.value)}
              placeholder="Technical + content + local"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Issues</Label>
          <Button type="button" variant="outline" size="sm" onClick={addIssue}>
            Add Issue
          </Button>
        </div>

        {issues.map((it, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div>
              <Label>Issue</Label>
              <Input
                value={it.issue}
                onChange={(e) => updateIssue(i, "issue", e.target.value)}
                placeholder="Slow page speed / Missing H1 / etc"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Severity</Label>
                <select
                  value={it.severity}
                  onChange={(e) => updateIssue(i, "severity", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
              <div>
                <Label>Action</Label>
                <Input
                  value={it.action}
                  onChange={(e) => updateIssue(i, "action", e.target.value)}
                  placeholder="What you did"
                />
              </div>
            </div>

            <div>
              <Label>Result</Label>
              <Input
                value={it.result}
                onChange={(e) => updateIssue(i, "result", e.target.value)}
                placeholder="What improved"
              />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeIssue(i)}>
              Remove Issue
            </Button>
          </div>
        ))}
      </div>

      {/* KEYWORDS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Keyword Performance" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Keyword Performance Title</Label>
            <Input
              value={form.keywordPerformanceTitle || ""}
              onChange={(e) => onChange("keywordPerformanceTitle", e.target.value)}
              placeholder="Keyword performance"
              required
            />
          </div>
          <div>
            <Label>Keyword Performance Subtitle</Label>
            <Input
              value={form.keywordPerformanceSubtitle || ""}
              onChange={(e) => onChange("keywordPerformanceSubtitle", e.target.value)}
              placeholder="Top movers"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Top Keywords</Label>
          <Button type="button" variant="outline" size="sm" onClick={addKeyword}>
            Add Keyword
          </Button>
        </div>

        {topKeywords.map((k, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input
              className="md:col-span-5"
              value={k.keyword}
              onChange={(e) => updateKeyword(i, "keyword", e.target.value)}
              placeholder="keyword"
            />
            <Input
              className="md:col-span-2"
              type="number"
              value={Number(k.position || 0)}
              onChange={(e) => updateKeyword(i, "position", Number(e.target.value))}
              placeholder="pos"
            />
            <Input
              className="md:col-span-2"
              type="number"
              value={Number(k.previousPosition || 0)}
              onChange={(e) => updateKeyword(i, "previousPosition", Number(e.target.value))}
              placeholder="prev"
            />
            <Input
              className="md:col-span-2"
              value={k.volume}
              onChange={(e) => updateKeyword(i, "volume", e.target.value)}
              placeholder="volume"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="md:col-span-1"
              onClick={() => removeKeyword(i)}
            >
              X
            </Button>
          </div>
        ))}
      </div>

      {/* TOOLS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Tools" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Tools Section Title</Label>
            <Input
              value={form.toolsSectionTitle || ""}
              onChange={(e) => onChange("toolsSectionTitle", e.target.value)}
              placeholder="Tools we used"
              required
            />
          </div>
          <div>
            <Label>Tools Section Subtitle</Label>
            <Input
              value={form.toolsSectionSubtitle || ""}
              onChange={(e) => onChange("toolsSectionSubtitle", e.target.value)}
              placeholder="Stack"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Tools</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTool}>
            Add Tool
          </Button>
        </div>

        {tools.map((t, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Icon Key</Label>
                <Input
                  value={t.iconKey}
                  onChange={(e) => updateTool(i, "iconKey", e.target.value)}
                  placeholder="gsc / ga4 / ahrefs"
                />
              </div>
              <div>
                <Label>Color Class</Label>
                <Input
                  value={t.colorClass || ""}
                  onChange={(e) => updateTool(i, "colorClass", e.target.value)}
                  placeholder="text-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={t.name}
                  onChange={(e) => updateTool(i, "name", e.target.value)}
                  placeholder="Google Search Console"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={t.category}
                  onChange={(e) => updateTool(i, "category", e.target.value)}
                  placeholder="Analytics"
                />
              </div>
            </div>

            <div>
              <Label>Usage</Label>
              <Input
                value={t.usage}
                onChange={(e) => updateTool(i, "usage", e.target.value)}
                placeholder="Monitored query performance"
              />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeTool(i)}>
              Remove Tool
            </Button>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS + METRICS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Testimonials & Metrics" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Testimonials Title</Label>
            <Input
              value={form.testimonialsSectionTitle || ""}
              onChange={(e) => onChange("testimonialsSectionTitle", e.target.value)}
              placeholder="What the client said"
              required
            />
          </div>
          <div>
            <Label>Testimonials Subtitle</Label>
            <Input
              value={form.testimonialsSectionSubtitle || ""}
              onChange={(e) => onChange("testimonialsSectionSubtitle", e.target.value)}
              placeholder="Feedback + KPI lift"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Testimonials</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
            Add Testimonial
          </Button>
        </div>

        {testimonials.map((t, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={t.name}
                  onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label>Rating</Label>
                <Input
                  type="number"
                  value={Number(t.rating || 5)}
                  onChange={(e) => updateTestimonial(i, "rating", Number(e.target.value))}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Role</Label>
                <Input
                  value={t.role}
                  onChange={(e) => updateTestimonial(i, "role", e.target.value)}
                  placeholder="Owner"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={t.company}
                  onChange={(e) => updateTestimonial(i, "company", e.target.value)}
                  placeholder="Atlantic Foundation"
                />
              </div>
            </div>

            <div>
              <Label>Image URL</Label>
              <Input
                value={t.imageUrl}
                onChange={(e) => updateTestimonial(i, "imageUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Quote</Label>
              <TextArea
                value={t.quote}
                onChange={(v) => updateTestimonial(i, "quote", v)}
                placeholder="Client quote..."
              />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeTestimonial(i)}>
              Remove Testimonial
            </Button>
          </div>
        ))}

        {/* Contact Data */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Contact Data (Chart)</Label>
            <Button type="button" variant="outline" size="sm" onClick={addContactPoint}>
              Add Point
            </Button>
          </div>

          {contactData.map((p, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-7"
                value={p.month}
                onChange={(e) => updateContactPoint(i, "month", e.target.value)}
                placeholder="Jan"
              />
              <Input
                className="md:col-span-4"
                type="number"
                value={Number(p.submissions || 0)}
                onChange={(e) => updateContactPoint(i, "submissions", Number(e.target.value))}
                placeholder="submissions"
              />
              <Button
                className="md:col-span-1"
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeContactPoint(i)}
              >
                X
              </Button>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Performance Metrics</Label>
            <Button type="button" variant="outline" size="sm" onClick={addPerformanceMetric}>
              Add Metric
            </Button>
          </div>

          {performanceMetrics.map((m, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-4"
                value={m.label}
                onChange={(e) => updatePerformanceMetric(i, "label", e.target.value)}
                placeholder="CTR"
              />
              <Input
                className="md:col-span-4"
                value={m.value}
                onChange={(e) => updatePerformanceMetric(i, "value", e.target.value)}
                placeholder="1.21%"
              />
              <Input
                className="md:col-span-3"
                value={m.change}
                onChange={(e) => updatePerformanceMetric(i, "change", e.target.value)}
                placeholder="+12%"
              />
              <Button
                className="md:col-span-1"
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removePerformanceMetric(i)}
              >
                X
              </Button>
            </div>
          ))}
        </div>

        {/* Keyword Metrics */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Keyword Metrics</Label>
            <Button type="button" variant="outline" size="sm" onClick={addKeywordMetric}>
              Add Metric
            </Button>
          </div>

          {keywordMetrics.map((m, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input
                className="md:col-span-4"
                value={m.label}
                onChange={(e) => updateKeywordMetric(i, "label", e.target.value)}
                placeholder="Top 3"
              />
              <Input
                className="md:col-span-4"
                value={m.value}
                onChange={(e) => updateKeywordMetric(i, "value", e.target.value)}
                placeholder="22"
              />
              <Input
                className="md:col-span-3"
                value={m.percentage}
                onChange={(e) => updateKeywordMetric(i, "percentage", e.target.value)}
                placeholder="18%"
              />
              <Button
                className="md:col-span-1"
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeKeywordMetric(i)}
              >
                X
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA 2 */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="CTA 2" />
        <div>
          <Label>CTA 2 Title</Label>
          <Input
            value={form.cta2Title || ""}
            onChange={(e) => onChange("cta2Title", e.target.value)}
            placeholder="Ready to grow?"
            required
          />
        </div>
        <div>
          <Label>CTA 2 Body</Label>
          <TextArea
            value={String(form.cta2Body || "")}
            onChange={(v) => onChange("cta2Body", v)}
            placeholder="CTA copy..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>CTA 2 Button Text</Label>
            <Input
              value={form.cta2PrimaryCtaText || ""}
              onChange={(e) => onChange("cta2PrimaryCtaText", e.target.value)}
              placeholder="Talk to Us"
              required
            />
          </div>
          <div>
            <Label>CTA 2 Button Link</Label>
            <Input
              value={form.cta2PrimaryCtaHref || ""}
              onChange={(e) => onChange("cta2PrimaryCtaHref", e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Bottom CTA" />
        <div>
          <Label>Bottom CTA Title</Label>
          <Input
            value={form.bottomCtaTitle || ""}
            onChange={(e) => onChange("bottomCtaTitle", e.target.value)}
            placeholder="Let’s build your rankings"
            required
          />
        </div>
        <div>
          <Label>Bottom CTA Body</Label>
          <TextArea
            value={String(form.bottomCtaBody || "")}
            onChange={(v) => onChange("bottomCtaBody", v)}
            placeholder="CTA copy..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Bottom Primary CTA Text</Label>
            <Input
              value={form.bottomPrimaryCtaText || ""}
              onChange={(e) => onChange("bottomPrimaryCtaText", e.target.value)}
              placeholder="Start Now"
              required
            />
          </div>
          <div>
            <Label>Bottom Primary CTA Link</Label>
            <Input
              value={form.bottomPrimaryCtaHref || ""}
              onChange={(e) => onChange("bottomPrimaryCtaHref", e.target.value)}
              placeholder="/contact"
            />
          </div>
          <div>
            <Label>Bottom Secondary CTA Text</Label>
            <Input
              value={form.bottomSecondaryCtaText || ""}
              onChange={(e) => onChange("bottomSecondaryCtaText", e.target.value)}
              placeholder="See Pricing"
              required
            />
          </div>
          <div>
            <Label>Bottom Secondary CTA Link</Label>
            <Input
              value={form.bottomSecondaryCtaHref || ""}
              onChange={(e) => onChange("bottomSecondaryCtaHref", e.target.value)}
              placeholder="/pricing"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
