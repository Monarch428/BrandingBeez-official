import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function WebCaseStudyDetailTab({
  form,
  onChange,
  cardOptions,
}: {
  form: WebCaseStudyDetailTabValues;
  onChange: (field: keyof WebCaseStudyDetailTabValues, value: any) => void;
  cardOptions: CardOption[];
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

  return (
    <div className="space-y-5 mt-4">
      <SectionTitle title="Detail Page Fields" subtitle="Controls the full /case-studies/:slug page content." />

      {/* FK selector */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <SectionTitle title="Link Detail to Existing Web Case Study" subtitle="Pick which card this detail belongs to." />
        <div>
          <ReqLabel>Select Web Case Study</ReqLabel>
          <select
            value={form.cardId || ""}
            onChange={(e) => onChange("cardId", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
          >
            <option value="">-- Select a Card --</option>
            {cardOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} • {c.client} • ({c.slug})
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
            <ReqLabel>Hero Badge Text</ReqLabel>
            <Input value={form.heroBadgeText || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} required />
          </div>
          <div>
            <ReqLabel>Hero Title</ReqLabel>
            <Input value={form.heroTitle || ""} onChange={(e) => onChange("heroTitle", e.target.value)} required />
          </div>
          <div>
            <Label>Hero Rating Text</Label>
            <Input value={form.heroRatingText || ""} onChange={(e) => onChange("heroRatingText", e.target.value)} />
          </div>
          <div>
            <ReqLabel>Hero Primary CTA Text</ReqLabel>
            <Input value={form.heroPrimaryCtaText || ""} onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)} required />
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
          <TextArea value={String(form.heroDescription || "")} onChange={(v) => onChange("heroDescription", v)}/>
        </div>

        {/* HERO STATS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">Hero Stats</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange("heroStats", [...heroStats, { value: "", label: "", iconKey: "CheckCircle2" }])}
            >
              Add Stat
            </Button>
          </div>

          {heroStats.map((s, i) => (
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
              <Input
                className="md:col-span-3"
                value={s.value}
                onChange={(e) => {
                  const next = [...heroStats];
                  next[i] = { ...next[i], value: e.target.value };
                  onChange("heroStats", next);
                }}
                placeholder="48-hour delivery"
              />
              <Input
                className="md:col-span-4"
                value={s.label}
                onChange={(e) => {
                  const next = [...heroStats];
                  next[i] = { ...next[i], label: e.target.value };
                  onChange("heroStats", next);
                }}
                placeholder="Turnaround"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="md:col-span-2"
                onClick={() => onChange("heroStats", heroStats.filter((_, idx) => idx !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* SHOWCASE */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Website Showcase" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Title</ReqLabel>
            <Input value={showcase.title || ""} onChange={(e) => onChange("showcase", { ...showcase, title: e.target.value })} required />
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
          <Input value={ctaTop.title || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, title: e.target.value })} required />
        </div>
        <div>
          <ReqLabel>Body</ReqLabel>
          <TextArea value={ctaTop.body || ""} onChange={(v) => onChange("ctaTop", { ...ctaTop, body: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Primary Text</ReqLabel>
            <Input value={ctaTop.primaryText || ""} onChange={(e) => onChange("ctaTop", { ...ctaTop, primaryText: e.target.value })} required />
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

      {/* Challenge Points quick editor */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Challenge" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Challenge Title</ReqLabel>
            <Input value={form.challengeTitle || ""} onChange={(e) => onChange("challengeTitle", e.target.value)} required />
          </div>
          <div>
            <ReqLabel>Challenge Subtitle</ReqLabel>
            <Input value={form.challengeSubtitle || ""} onChange={(e) => onChange("challengeSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Challenge Points</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange("challengePoints", [...challengePoints, { iconKey: "XCircle", text: "" }])}>
            Add Point
          </Button>
        </div>

        {challengePoints.map((p, i) => (
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
            <Input
              className="md:col-span-7"
              value={p.text}
              onChange={(e) => {
                const next = [...challengePoints];
                next[i] = { ...next[i], text: e.target.value };
                onChange("challengePoints", next);
              }}
              placeholder="Point text..."
            />
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => onChange("challengePoints", challengePoints.filter((_, idx) => idx !== i))}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="border rounded-lg p-3 text-xs text-gray-500">
        Note: The remaining sections (Before/After, Overview Columns, Strategy Columns, Features, Evaluation, Feedback, Final CTA)
        are supported in payload and defaults, but you can expand the editor UI further exactly like PPC tab patterns.
      </div>

      {/* Final CTA quick */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Final CTA" />
        <div>
          <ReqLabel>Title</ReqLabel>
          <Input value={finalCta.title || ""} onChange={(e) => onChange("finalCta", { ...finalCta, title: e.target.value })} required />
        </div>
        <div>
          <ReqLabel>Body</ReqLabel>
          <TextArea value={finalCta.body || ""} onChange={(v) => onChange("finalCta", { ...finalCta, body: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Primary Text</ReqLabel>
            <Input value={finalCta.primaryText || ""} onChange={(e) => onChange("finalCta", { ...finalCta, primaryText: e.target.value })} required />
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
