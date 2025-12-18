// ===============================
// SeoCaseStudyDetailTab.tsx
// ✅ FULL CODE (iconKey fields editable + section heading fields editable + keeps defaults from manager)
// ===============================

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ Types used by SEO slug page
export type SeoCaseStudyHeroStat = { value: string; label: string; iconKey?: string };

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
  // FK
  cardId?: string;

  // HERO
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

  // HIGHLIGHTS
  highlightsTitle?: string;
  highlightsSubtitle?: string;
  highlights?: SeoCaseStudyHighlight[];

  // CTA 1
  cta1Title?: string;
  cta1Body?: string;
  cta1PrimaryCtaText?: string;
  cta1PrimaryCtaHref?: string;

  // ABOUT
  aboutBadgeText?: string;
  aboutLogoUrl?: string;
  aboutTitle?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutStats?: SeoCaseStudyAboutStat[];
  initialChallengesTitle?: string;
  initialChallenges?: SeoCaseStudyInitialChallenge[];

  // ISSUES
  issuesSectionTitle?: string;
  issuesSectionSubtitle?: string;
  issues?: SeoCaseStudyIssue[];

  // KEYWORDS
  keywordPerformanceTitle?: string;
  keywordPerformanceSubtitle?: string;
  topKeywords?: SeoCaseStudyKeywordRow[];

  // TOOLS
  toolsSectionTitle?: string;
  toolsSectionSubtitle?: string;
  tools?: SeoCaseStudyTool[];

  // TESTIMONIALS + METRICS
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

  // BOTTOM CTA
  bottomCtaTitle?: string;
  bottomCtaBody?: string;
  bottomPrimaryCtaText?: string;
  bottomPrimaryCtaHref?: string;
  bottomSecondaryCtaText?: string;
  bottomSecondaryCtaHref?: string;
};

// dropdown option type
type CardOption = { _id: string; slug: string; cardTitle: string; cardClient: string; cardIndustry: string };

// ✅ Required label helper (adds * visually)
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-md p-2 mt-1 min-h-[84px]"
      required={required}
      aria-required={required ? "true" : "false"}
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

  addHeroStat,
  updateHeroStat,
  removeHeroStat,

  addHighlight,
  updateHighlight,
  removeHighlight,

  addAboutStat,
  updateAboutStat,
  removeAboutStat,

  addInitialChallenge,
  updateInitialChallenge,
  removeInitialChallenge,

  addIssue,
  updateIssue,
  removeIssue,

  addKeyword,
  updateKeyword,
  removeKeyword,

  addTool,
  updateTool,
  removeTool,

  addTestimonial,
  updateTestimonial,
  removeTestimonial,

  addContactPoint,
  updateContactPoint,
  removeContactPoint,

  addPerformanceMetric,
  updatePerformanceMetric,
  removePerformanceMetric,

  addKeywordMetric,
  updateKeywordMetric,
  removeKeywordMetric,
}: {
  form: SeoCaseStudyDetailTabValues;
  onChange: (field: keyof SeoCaseStudyDetailTabValues, value: any) => void;
  cardOptions: CardOption[];

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
  updateInitialChallenge: (index: number, field: keyof SeoCaseStudyInitialChallenge, value: any) => void;
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
      <SectionTitle title="Detail Page Fields" subtitle="This controls the full /case-studies/:slug page content." />

      {/* FK selector */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <SectionTitle title="Link Detail to Existing SEO Case Study" subtitle="Pick which card this detail belongs to." />

        <div>
          <RequiredLabel>Select SEO Case Study</RequiredLabel>
          <select
            value={form.cardId || ""}
            onChange={(e) => onChange("cardId", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
            required
          >
            <option value="">-- Select a Card --</option>
            {cardOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.cardTitle} • {c.cardClient} • ({c.slug})
              </option>
            ))}
          </select>

          {!form.cardId ? <div className="text-xs text-amber-600 mt-1">⚠️ Select a card first, then save detail.</div> : null}
        </div>
      </div>

      {/* HERO */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Hero" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>Hero Badge Text</RequiredLabel>
            <Input value={form.heroBadgeText || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} required />
          </div>
          <div>
            <RequiredLabel>Hero Case Study Label</RequiredLabel>
            <Input value={form.heroCaseStudyLabel || ""} onChange={(e) => onChange("heroCaseStudyLabel", e.target.value)} required />
          </div>
          <div>
            <RequiredLabel>Hero Client Name</RequiredLabel>
            <Input value={form.heroClientName || ""} onChange={(e) => onChange("heroClientName", e.target.value)} required />
          </div>
          <div>
            <Label>Hero Rating Text</Label>
            <Input value={form.heroRatingText || ""} onChange={(e) => onChange("heroRatingText", e.target.value)} />
          </div>
        </div>

        <div>
          <RequiredLabel>Hero Headline</RequiredLabel>
          <Input value={form.heroHeadline || ""} onChange={(e) => onChange("heroHeadline", e.target.value)} required />
        </div>

        <div>
          <RequiredLabel>Hero Description</RequiredLabel>
          <TextArea value={String(form.heroDescription || "")} onChange={(v) => onChange("heroDescription", v)} placeholder="Hero paragraph..." required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>Hero Primary CTA Text</RequiredLabel>
            <Input value={form.heroPrimaryCtaText || ""} onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)} required />
          </div>
          <div>
            <Label>Hero Primary CTA Href</Label>
            <Input value={form.heroPrimaryCtaHref || ""} onChange={(e) => onChange("heroPrimaryCtaHref", e.target.value)} placeholder="/contact" />
          </div>
          <div>
            <Label>Hero Video URL (iframe)</Label>
            <Input value={form.heroVideoUrl || ""} onChange={(e) => onChange("heroVideoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          <div>
            <Label>Hero Video Poster</Label>
            <Input value={form.heroVideoPoster || ""} onChange={(e) => onChange("heroVideoPoster", e.target.value)} placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <Label>Hero Video Badge Text</Label>
            <Input value={form.heroVideoBadgeText || ""} onChange={(e) => onChange("heroVideoBadgeText", e.target.value)} placeholder="Watch the results" />
          </div>
        </div>

        {/* HERO STATS (✅ iconKey editable) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Hero Stats</Label>
            <Button type="button" variant="outline" size="sm" onClick={addHeroStat}>
              Add Stat
            </Button>
          </div>

          {heroStats.map((s, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input className="md:col-span-3" value={s.iconKey || ""} onChange={(e) => updateHeroStat(i, "iconKey", e.target.value)} placeholder="iconKey (TrendingUp, Search...)" />
              <Input className="md:col-span-3" value={s.value} onChange={(e) => updateHeroStat(i, "value", e.target.value)} placeholder="+121%" />
              <Input className="md:col-span-4" value={s.label} onChange={(e) => updateHeroStat(i, "label", e.target.value)} placeholder="Lead Growth" />
              <Button type="button" variant="destructive" size="sm" className="md:col-span-2" onClick={() => removeHeroStat(i)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Highlights Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>Highlights Title</RequiredLabel>
            <Input value={form.highlightsTitle || ""} onChange={(e) => onChange("highlightsTitle", e.target.value)} required />
          </div>
          <div>
            <RequiredLabel>Highlights Subtitle</RequiredLabel>
            <Input value={form.highlightsSubtitle || ""} onChange={(e) => onChange("highlightsSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Highlights</Label>
          <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
            Add Highlight
          </Button>
        </div>

        {highlights.map((h, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Icon Key</Label>
                <Input value={h.iconKey} onChange={(e) => updateHighlight(i, "iconKey", e.target.value)} placeholder="Rocket / BarChart3 / ShieldCheck..." />
              </div>
              <div>
                <Label>Color Class</Label>
                <Input value={h.colorClass || ""} onChange={(e) => updateHighlight(i, "colorClass", e.target.value)} placeholder="text-green-600" />
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input value={h.title} onChange={(e) => updateHighlight(i, "title", e.target.value)} placeholder="SEO Score: 69 → 100" />
            </div>

            <div>
              <Label>Description</Label>
              <TextArea value={h.description} onChange={(v) => updateHighlight(i, "description", v)} placeholder="What improved..." />
            </div>

            <div>
              <Label>Subtext</Label>
              <Input value={h.subtext || ""} onChange={(e) => updateHighlight(i, "subtext", e.target.value)} placeholder="Optional" />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeHighlight(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* CTA 1 */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="CTA Section 1" />
        <div>
          <RequiredLabel>CTA 1 Title</RequiredLabel>
          <Input value={form.cta1Title || ""} onChange={(e) => onChange("cta1Title", e.target.value)} required />
        </div>
        <div>
          <RequiredLabel>CTA 1 Body</RequiredLabel>
          <TextArea value={String(form.cta1Body || "")} onChange={(v) => onChange("cta1Body", v)} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <RequiredLabel>CTA 1 Primary CTA Text</RequiredLabel>
            <Input value={form.cta1PrimaryCtaText || ""} onChange={(e) => onChange("cta1PrimaryCtaText", e.target.value)} required />
          </div>
          <div>
            <Label>CTA 1 Primary CTA Href</Label>
            <Input value={form.cta1PrimaryCtaHref || ""} onChange={(e) => onChange("cta1PrimaryCtaHref", e.target.value)} placeholder="/seo-audit" />
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="About Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>About Badge Text</RequiredLabel>
            <Input value={form.aboutBadgeText || ""} onChange={(e) => onChange("aboutBadgeText", e.target.value)} required />
          </div>
          <div>
            <Label>About Logo URL</Label>
            <Input value={form.aboutLogoUrl || ""} onChange={(e) => onChange("aboutLogoUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div>
          <RequiredLabel>About Title</RequiredLabel>
          <Input value={form.aboutTitle || ""} onChange={(e) => onChange("aboutTitle", e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>About Paragraph 1</RequiredLabel>
            <TextArea value={String(form.aboutParagraph1 || "")} onChange={(v) => onChange("aboutParagraph1", v)} required />
          </div>
          <div>
            <RequiredLabel>About Paragraph 2</RequiredLabel>
            <TextArea value={String(form.aboutParagraph2 || "")} onChange={(v) => onChange("aboutParagraph2", v)} required />
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
              <Input className="md:col-span-3" value={a.iconKey} onChange={(e) => updateAboutStat(i, "iconKey", e.target.value)} placeholder="Globe / Users / MapPin" />
              <Input className="md:col-span-4" value={a.label} onChange={(e) => updateAboutStat(i, "label", e.target.value)} placeholder="Label" />
              <Input className="md:col-span-3" value={a.value} onChange={(e) => updateAboutStat(i, "value", e.target.value)} placeholder="Value" />
              <Button type="button" variant="destructive" size="sm" className="md:col-span-2" onClick={() => removeAboutStat(i)}>
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
            <RequiredLabel>Initial Challenges Title</RequiredLabel>
            <Input value={form.initialChallengesTitle || ""} onChange={(e) => onChange("initialChallengesTitle", e.target.value)} required />
          </div>

          {initialChallenges.map((c, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <Input className="md:col-span-2" type="number" value={Number(c.order || 0)} onChange={(e) => updateInitialChallenge(i, "order", Number(e.target.value))} />
              <Input className="md:col-span-8" value={c.text} onChange={(e) => updateInitialChallenge(i, "text", e.target.value)} placeholder="Challenge text..." />
              <Button type="button" variant="destructive" size="sm" className="md:col-span-2" onClick={() => removeInitialChallenge(i)}>
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
            <RequiredLabel>Issues Section Title</RequiredLabel>
            <Input value={form.issuesSectionTitle || ""} onChange={(e) => onChange("issuesSectionTitle", e.target.value)} required />
          </div>
          <div>
            <RequiredLabel>Issues Section Subtitle</RequiredLabel>
            <Input value={form.issuesSectionSubtitle || ""} onChange={(e) => onChange("issuesSectionSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Issues</Label>
          <Button type="button" variant="outline" size="sm" onClick={addIssue}>
            Add Issue
          </Button>
        </div>

        {issues.map((x, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Issue</Label>
                <Input value={x.issue} onChange={(e) => updateIssue(i, "issue", e.target.value)} />
              </div>
              <div>
                <Label>Severity</Label>
                <select
                  value={x.severity}
                  onChange={(e) => updateIssue(i, "severity", e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Action</Label>
              <TextArea value={x.action} onChange={(v) => updateIssue(i, "action", v)} />
            </div>

            <div>
              <Label>Result</Label>
              <TextArea value={x.result} onChange={(v) => updateIssue(i, "result", v)} />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeIssue(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* KEYWORDS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Keyword Performance Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>Keyword Performance Title</RequiredLabel>
            <Input value={form.keywordPerformanceTitle || ""} onChange={(e) => onChange("keywordPerformanceTitle", e.target.value)} required />
          </div>
          <div>
            <RequiredLabel>Keyword Performance Subtitle</RequiredLabel>
            <Input value={form.keywordPerformanceSubtitle || ""} onChange={(e) => onChange("keywordPerformanceSubtitle", e.target.value)} required />
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
            <Input className="md:col-span-4" value={k.keyword} onChange={(e) => updateKeyword(i, "keyword", e.target.value)} placeholder="Keyword" />
            <Input className="md:col-span-2" type="number" value={Number(k.position || 0)} onChange={(e) => updateKeyword(i, "position", Number(e.target.value))} placeholder="Pos" />
            <Input className="md:col-span-2" type="number" value={Number(k.previousPosition || 0)} onChange={(e) => updateKeyword(i, "previousPosition", Number(e.target.value))} placeholder="Prev" />
            <Input className="md:col-span-2" value={k.volume} onChange={(e) => updateKeyword(i, "volume", e.target.value)} placeholder="Volume" />
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => removeKeyword(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* TOOLS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Tools Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>Tools Title</RequiredLabel>
            <Input value={form.toolsSectionTitle || ""} onChange={(e) => onChange("toolsSectionTitle", e.target.value)} required />
          </div>
          <div>
            <RequiredLabel>Tools Subtitle</RequiredLabel>
            <Input value={form.toolsSectionSubtitle || ""} onChange={(e) => onChange("toolsSectionSubtitle", e.target.value)} required />
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
                <Input value={t.iconKey} onChange={(e) => updateTool(i, "iconKey", e.target.value)} placeholder="Search / BarChart3..." />
              </div>
              <div>
                <Label>Color Class</Label>
                <Input value={t.colorClass || ""} onChange={(e) => updateTool(i, "colorClass", e.target.value)} placeholder="text-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Name</Label>
                <Input value={t.name} onChange={(e) => updateTool(i, "name", e.target.value)} placeholder="Google Search Console" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={t.category} onChange={(e) => updateTool(i, "category", e.target.value)} placeholder="Analytics" />
              </div>
            </div>

            <div>
              <Label>Usage</Label>
              <TextArea value={t.usage} onChange={(v) => updateTool(i, "usage", v)} placeholder="How we used it..." />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeTool(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS + METRICS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Testimonials & Metrics Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <RequiredLabel>Testimonials Title</RequiredLabel>
            <Input value={form.testimonialsSectionTitle || ""} onChange={(e) => onChange("testimonialsSectionTitle", e.target.value)} required />
          </div>
          <div>
            <RequiredLabel>Testimonials Subtitle</RequiredLabel>
            <Input value={form.testimonialsSectionSubtitle || ""} onChange={(e) => onChange("testimonialsSectionSubtitle", e.target.value)} required />
          </div>
        </div>

        {/* Testimonials */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Testimonials</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
            Add Testimonial
          </Button>
        </div>

        {testimonials.map((x, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Name</Label>
                <Input value={x.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={x.role} onChange={(e) => updateTestimonial(i, "role", e.target.value)} />
              </div>
              <div>
                <Label>Company</Label>
                <Input value={x.company} onChange={(e) => updateTestimonial(i, "company", e.target.value)} />
              </div>
              <div>
                <Label>Rating</Label>
                <Input type="number" value={Number(x.rating || 0)} onChange={(e) => updateTestimonial(i, "rating", Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Testimonial Image (Choose local file → upload)</Label>

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const token =
                    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

                  if (!token) {
                    alert("Admin token missing. Please login again.");
                    return;
                  }

                  try {
                    const fd = new FormData();
                    fd.append("image", file);

                    const res = await fetch("/api/admin/seo-case-study/upload-testimonial-image", {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                      body: fd,
                    });

                    const text = await res.text();
                    let data: any = {};
                    try {
                      data = JSON.parse(text);
                    } catch {
                      data = {};
                    }

                    if (!res.ok || !data?.imageUrl) {
                      console.error("Testimonial upload failed:", res.status, text);
                      throw new Error(data?.message || `Upload failed (${res.status})`);
                    }

                    // ✅ set imageUrl into testimonial
                    updateTestimonial(i, "imageUrl", data.imageUrl);
                  } catch (err: any) {
                    console.error(err);
                    alert(err?.message || "Image upload failed");
                  } finally {
                    // allow re-selecting same file
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
                className="mt-1"
              />

              {x.imageUrl ? (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={x.imageUrl}
                    alt={x.name || "Testimonial"}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div className="text-xs text-gray-600 break-all">{x.imageUrl}</div>
                </div>
              ) : null}
            </div>

            <div>
              <Label>Quote</Label>
              <TextArea value={x.quote} onChange={(v) => updateTestimonial(i, "quote", v)} />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeTestimonial(i)}>
              Remove
            </Button>
          </div>
        ))}

        {/* Contact Data */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Contact Data (Chart)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addContactPoint}>
            Add Month
          </Button>
        </div>

        {contactData.map((x, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-6" value={x.month} onChange={(e) => updateContactPoint(i, "month", e.target.value)} placeholder="Jan" />
            <Input className="md:col-span-4" type="number" value={Number(x.submissions || 0)} onChange={(e) => updateContactPoint(i, "submissions", Number(e.target.value))} placeholder="Submissions" />
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => removeContactPoint(i)}>
              Remove
            </Button>
          </div>
        ))}

        {/* Performance Metrics */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Performance Metrics</Label>
          <Button type="button" variant="outline" size="sm" onClick={addPerformanceMetric}>
            Add Metric
          </Button>
        </div>

        {performanceMetrics.map((x, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-4" value={x.label} onChange={(e) => updatePerformanceMetric(i, "label", e.target.value)} placeholder="CTR" />
            <Input className="md:col-span-4" value={x.value} onChange={(e) => updatePerformanceMetric(i, "value", e.target.value)} placeholder="4.2%" />
            <Input className="md:col-span-2" value={x.change} onChange={(e) => updatePerformanceMetric(i, "change", e.target.value)} placeholder="+12%" />
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => removePerformanceMetric(i)}>
              Remove
            </Button>
          </div>
        ))}

        {/* Keyword Metrics */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Keyword Metrics</Label>
          <Button type="button" variant="outline" size="sm" onClick={addKeywordMetric}>
            Add Metric
          </Button>
        </div>

        {keywordMetrics.map((x, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-4" value={x.label} onChange={(e) => updateKeywordMetric(i, "label", e.target.value)} placeholder="Top 3" />
            <Input className="md:col-span-4" value={x.value} onChange={(e) => updateKeywordMetric(i, "value", e.target.value)} placeholder="18" />
            <Input className="md:col-span-2" value={x.percentage} onChange={(e) => updateKeywordMetric(i, "percentage", e.target.value)} placeholder="35%" />
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => removeKeywordMetric(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* CTA 2 */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="CTA Section 2" />
        <div>
          <RequiredLabel>CTA 2 Title</RequiredLabel>
          <Input value={form.cta2Title || ""} onChange={(e) => onChange("cta2Title", e.target.value)} required />
        </div>
        <div>
          <RequiredLabel>CTA 2 Body</RequiredLabel>
          <TextArea value={String(form.cta2Body || "")} onChange={(v) => onChange("cta2Body", v)} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <RequiredLabel>CTA 2 Primary CTA Text</RequiredLabel>
            <Input value={form.cta2PrimaryCtaText || ""} onChange={(e) => onChange("cta2PrimaryCtaText", e.target.value)} required />
          </div>
          <div>
            <Label>CTA 2 Primary CTA Href</Label>
            <Input value={form.cta2PrimaryCtaHref || ""} onChange={(e) => onChange("cta2PrimaryCtaHref", e.target.value)} placeholder="/contact" />
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Bottom CTA Section" />
        <div>
          <RequiredLabel>Bottom CTA Title</RequiredLabel>
          <Input value={form.bottomCtaTitle || ""} onChange={(e) => onChange("bottomCtaTitle", e.target.value)} required />
        </div>
        <div>
          <RequiredLabel>Bottom CTA Body</RequiredLabel>
          <TextArea value={String(form.bottomCtaBody || "")} onChange={(v) => onChange("bottomCtaBody", v)} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <RequiredLabel>Bottom Primary CTA Text</RequiredLabel>
            <Input value={form.bottomPrimaryCtaText || ""} onChange={(e) => onChange("bottomPrimaryCtaText", e.target.value)} required />
          </div>
          <div>
            <Label>Bottom Primary CTA Href</Label>
            <Input value={form.bottomPrimaryCtaHref || ""} onChange={(e) => onChange("bottomPrimaryCtaHref", e.target.value)} placeholder="/contact" />
          </div>
          <div>
            <Label>Bottom Secondary CTA Text</Label>
            <Input value={form.bottomSecondaryCtaText || ""} onChange={(e) => onChange("bottomSecondaryCtaText", e.target.value)} />
          </div>
          <div>
            <Label>Bottom Secondary CTA Href</Label>
            <Input value={form.bottomSecondaryCtaHref || ""} onChange={(e) => onChange("bottomSecondaryCtaHref", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
