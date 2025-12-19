// ===============================
// PpcCaseStudyDetailTab.tsx
// ===============================
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

// ---------- Types used by PPC SLUG page ----------
export type PpcHeroStat = { value: string; label: string; iconKey?: string };

export type PpcInfoCard = {
  iconKey: string;
  title: string;
  value: string;
  href?: string;
  colorClass?: string;
};

export type PpcSectionCard = {
  iconKey: string;
  title: string;
  description: string;
  colorClass?: string;
};

export type PpcBulletSection = {
  iconKey: string;
  title: string;
  bullets: string[];
  colorClass?: string;
};

export type PpcDashboardStat = { iconKey: string; label: string; value: string };
export type PpcHighlightMetric = { label: string; value: string; subtext?: string };

export type PpcOutstandingCard = {
  iconKey: string;
  value: string;
  title: string;
  description: string;
  colorClass?: string;
};

export type PpcTimelineStep = {
  order: number;
  badgeText: string;
  title: string;
  description: string;
  colorClass?: string;
};

export type PpcProcessStep = { order: number; title: string; description: string };

export type PpcCaseStudyDetailTabValues = {
  cardId?: string;

  heroBadgeText?: string;
  heroClientName?: string;
  heroRatingText?: string;
  heroDescription?: string;
  heroStats?: PpcHeroStat[];
  heroPrimaryCtaText?: string;
  heroPrimaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  clientProfileTitle?: string;
  clientProfileSubtitle?: string;
  clientProfileCards?: PpcInfoCard[];

  challengeTitle?: string;
  challengeSubtitle?: string;
  challengeCards?: PpcSectionCard[];

  approachTitle?: string;
  approachSubtitle?: string;
  approachSections?: PpcBulletSection[];

  dashboardTitle?: string;
  dashboardSubtitle?: string;
  dashboardStats?: PpcDashboardStat[];
  dashboardHighlight?: PpcHighlightMetric;

  outstandingTitle?: string;
  outstandingSubtitle?: string;
  outstandingCards?: PpcOutstandingCard[];

  timelineTitle?: string;
  timelineSteps?: PpcTimelineStep[];

  processTitle?: string;
  processSubtitle?: string;
  processSteps?: PpcProcessStep[];

  midCtaTitle?: string;
  midCtaBody?: string;
  midPrimaryCtaText?: string;
  midPrimaryCtaHref?: string;
  midSecondaryCtaText?: string;
  midSecondaryCtaHref?: string;

  bottomCtaTitle?: string;
  bottomCtaBody?: string;
  bottomPrimaryCtaText?: string;
  bottomPrimaryCtaHref?: string;
  bottomSecondaryCtaText?: string;
  bottomSecondaryCtaHref?: string;
};

// dropdown option type
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

export function PpcCaseStudyDetailTab({
  form,
  onChange,
  cardOptions,

  addHeroStat,
  updateHeroStat,
  removeHeroStat,

  addClientProfileCard,
  updateClientProfileCard,
  removeClientProfileCard,

  addChallengeCard,
  updateChallengeCard,
  removeChallengeCard,

  addApproachSection,
  updateApproachSection,
  removeApproachSection,
  addApproachBullet,
  updateApproachBullet,
  removeApproachBullet,

  addDashboardStat,
  updateDashboardStat,
  removeDashboardStat,

  addOutstandingCard,
  updateOutstandingCard,
  removeOutstandingCard,

  addTimelineStep,
  updateTimelineStep,
  removeTimelineStep,

  addProcessStep,
  updateProcessStep,
  removeProcessStep,
}: {
  form: PpcCaseStudyDetailTabValues;
  onChange: (field: keyof PpcCaseStudyDetailTabValues, value: any) => void;
  cardOptions: CardOption[];

  addHeroStat: () => void;
  updateHeroStat: (index: number, field: keyof PpcHeroStat, value: any) => void;
  removeHeroStat: (index: number) => void;

  addClientProfileCard: () => void;
  updateClientProfileCard: (index: number, field: keyof PpcInfoCard, value: any) => void;
  removeClientProfileCard: (index: number) => void;

  addChallengeCard: () => void;
  updateChallengeCard: (index: number, field: keyof PpcSectionCard, value: any) => void;
  removeChallengeCard: (index: number) => void;

  addApproachSection: () => void;
  updateApproachSection: (index: number, field: keyof PpcBulletSection, value: any) => void;
  removeApproachSection: (index: number) => void;
  addApproachBullet: (sectionIndex: number) => void;
  updateApproachBullet: (sectionIndex: number, bulletIndex: number, value: string) => void;
  removeApproachBullet: (sectionIndex: number, bulletIndex: number) => void;

  addDashboardStat: () => void;
  updateDashboardStat: (index: number, field: keyof PpcDashboardStat, value: any) => void;
  removeDashboardStat: (index: number) => void;

  addOutstandingCard: () => void;
  updateOutstandingCard: (index: number, field: keyof PpcOutstandingCard, value: any) => void;
  removeOutstandingCard: (index: number) => void;

  addTimelineStep: () => void;
  updateTimelineStep: (index: number, field: keyof PpcTimelineStep, value: any) => void;
  removeTimelineStep: (index: number) => void;

  addProcessStep: () => void;
  updateProcessStep: (index: number, field: keyof PpcProcessStep, value: any) => void;
  removeProcessStep: (index: number) => void;
}) {
  const heroStats = form.heroStats || [];
  const clientProfileCards = form.clientProfileCards || [];
  const challengeCards = form.challengeCards || [];
  const approachSections = form.approachSections || [];
  const dashboardStats = form.dashboardStats || [];
  const outstandingCards = form.outstandingCards || [];
  const timelineSteps = form.timelineSteps || [];
  const processSteps = form.processSteps || [];

  return (
    <div className="space-y-5 mt-4">
      <SectionTitle title="Detail Page Fields" subtitle="This controls the full /ppc-case-study/:slug page content." />

      {/* FK selector */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <SectionTitle title="Link Detail to Existing PPC Case Study" subtitle="Pick which card this detail belongs to." />

        <div>
          <ReqLabel>Select PPC Case Study</ReqLabel>
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

          {!form.cardId ? (
            <div className="text-xs text-amber-600 mt-1">⚠️ Select a card first, then save detail.</div>
          ) : null}
        </div>
      </div>

      {/* HERO */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Hero" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ReqLabel>Hero Badge Text</ReqLabel>
            <Input
              value={form.heroBadgeText || ""}
              onChange={(e) => onChange("heroBadgeText", e.target.value)}
              placeholder="Featured Google Ads Success Story"
              required
            />
          </div>
          <div>
            <ReqLabel>Hero Client Name</ReqLabel>
            <Input
              value={form.heroClientName || ""}
              onChange={(e) => onChange("heroClientName", e.target.value)}
              placeholder="Arlingsworth Solicitors"
              required
            />
          </div>
          <div>
            <Label>Hero Rating Text</Label>
            <Input
              value={form.heroRatingText || ""}
              onChange={(e) => onChange("heroRatingText", e.target.value)}
              placeholder="⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by 25+ Agencies"
            />
          </div>
          <div>
            <ReqLabel>Hero Primary CTA Text</ReqLabel>
            <Input
              value={form.heroPrimaryCtaText || ""}
              onChange={(e) => onChange("heroPrimaryCtaText", e.target.value)}
              placeholder="Schedule a Free Consultation"
              required
            />
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
            <Label>Hero Video Poster (optional)</Label>
            <Input value={form.heroVideoPoster || ""} onChange={(e) => onChange("heroVideoPoster", e.target.value)} placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <Label>Hero Video Badge Text</Label>
            <Input value={form.heroVideoBadgeText || ""} onChange={(e) => onChange("heroVideoBadgeText", e.target.value)} placeholder="Case Study Video" />
          </div>
        </div>

        <div>
          <ReqLabel>Hero Description</ReqLabel>
          <TextArea value={String(form.heroDescription || "")} onChange={(v) => onChange("heroDescription", v)} placeholder="Hero paragraph..." />
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
                className="md:col-span-3"
                value={s.iconKey || ""}
                onChange={(e) => updateHeroStat(i, "iconKey", e.target.value)}
                placeholder="iconKey (TrendingUp, CheckCircle2...)"
              />
              <Input className="md:col-span-3" value={s.value} onChange={(e) => updateHeroStat(i, "value", e.target.value)} placeholder="£6.5" />
              <Input className="md:col-span-4" value={s.label} onChange={(e) => updateHeroStat(i, "label", e.target.value)} placeholder="Lowest CPA" />
              <Button type="button" variant="destructive" size="sm" className="md:col-span-2" onClick={() => removeHeroStat(i)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* CLIENT PROFILE */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Client Profile Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ReqLabel>Client Profile Title</ReqLabel>
            <Input value={form.clientProfileTitle || ""} onChange={(e) => onChange("clientProfileTitle", e.target.value)} required />
          </div>
          <div>
            <ReqLabel>Client Profile Subtitle</ReqLabel>
            <Input value={form.clientProfileSubtitle || ""} onChange={(e) => onChange("clientProfileSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Client Profile Cards</Label>
          <Button type="button" variant="outline" size="sm" onClick={addClientProfileCard}>
            Add Card
          </Button>
        </div>

        {clientProfileCards.map((c, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Icon Key</Label>
                <Input value={c.iconKey} onChange={(e) => updateClientProfileCard(i, "iconKey", e.target.value)} placeholder="Globe / MapPin / Building..." />
              </div>
              <div>
                <Label>Color Class</Label>
                <Input value={c.colorClass || ""} onChange={(e) => updateClientProfileCard(i, "colorClass", e.target.value)} placeholder="from-blue-50 to-blue-100 border-blue-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Title</Label>
                <Input value={c.title} onChange={(e) => updateClientProfileCard(i, "title", e.target.value)} placeholder="Location" />
              </div>
              <div>
                <Label>Value</Label>
                <Input value={c.value} onChange={(e) => updateClientProfileCard(i, "value", e.target.value)} placeholder="United Kingdom" />
              </div>
            </div>

            <div>
              <Label>Href (optional)</Label>
              <Input value={c.href || ""} onChange={(e) => updateClientProfileCard(i, "href", e.target.value)} placeholder="https://..." />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeClientProfileCard(i)}>
              Remove Card
            </Button>
          </div>
        ))}
      </div>

      {/* CHALLENGE */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="The Challenge Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <Label className="font-semibold">Challenge Cards</Label>
          <Button type="button" variant="outline" size="sm" onClick={addChallengeCard}>
            Add Card
          </Button>
        </div>

        {challengeCards.map((c, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Icon Key</Label>
                <Input value={c.iconKey} onChange={(e) => updateChallengeCard(i, "iconKey", e.target.value)} />
              </div>
              <div>
                <Label>Color Class</Label>
                <Input value={c.colorClass || ""} onChange={(e) => updateChallengeCard(i, "colorClass", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={c.title} onChange={(e) => updateChallengeCard(i, "title", e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <TextArea value={c.description} onChange={(v) => updateChallengeCard(i, "description", v)} />
            </div>
            <Button type="button" variant="destructive" onClick={() => removeChallengeCard(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* APPROACH */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Strategic Approach Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ReqLabel>Approach Title</ReqLabel>
            <Input value={form.approachTitle || ""} onChange={(e) => onChange("approachTitle", e.target.value)} required />
          </div>
          <div>
            <ReqLabel>Approach Subtitle</ReqLabel>
            <Input value={form.approachSubtitle || ""} onChange={(e) => onChange("approachSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Approach Sections</Label>
          <Button type="button" variant="outline" size="sm" onClick={addApproachSection}>
            Add Section
          </Button>
        </div>

        {approachSections.map((sec, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Icon Key</Label>
                <Input value={sec.iconKey} onChange={(e) => updateApproachSection(i, "iconKey", e.target.value)} />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={sec.title} onChange={(e) => updateApproachSection(i, "title", e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Color Class</Label>
              <Input value={sec.colorClass || ""} onChange={(e) => updateApproachSection(i, "colorClass", e.target.value)} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="font-semibold">Bullets</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addApproachBullet(i)}>
                Add Bullet
              </Button>
            </div>

            {(sec.bullets || []).map((b, bi) => (
              <div key={bi} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <Input
                  className="md:col-span-10"
                  value={b}
                  onChange={(e) => updateApproachBullet(i, bi, e.target.value)}
                  placeholder="Bullet text..."
                />
                <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => removeApproachBullet(i, bi)}>
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" variant="destructive" onClick={() => removeApproachSection(i)}>
              Remove Section
            </Button>
          </div>
        ))}
      </div>

      {/* DASHBOARD */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Dashboard Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ReqLabel>Dashboard Title</ReqLabel>
            <Input value={form.dashboardTitle || ""} onChange={(e) => onChange("dashboardTitle", e.target.value)} required />
          </div>
          <div>
            <ReqLabel>Dashboard Subtitle</ReqLabel>
            <Input value={form.dashboardSubtitle || ""} onChange={(e) => onChange("dashboardSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Dashboard Stats</Label>
          <Button type="button" variant="outline" size="sm" onClick={addDashboardStat}>
            Add Stat
          </Button>
        </div>

        {dashboardStats.map((s, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-3" value={s.iconKey} onChange={(e) => updateDashboardStat(i, "iconKey", e.target.value)} placeholder="BarChart3" />
            <Input className="md:col-span-4" value={s.label} onChange={(e) => updateDashboardStat(i, "label", e.target.value)} placeholder="Clicks" />
            <Input className="md:col-span-3" value={s.value} onChange={(e) => updateDashboardStat(i, "value", e.target.value)} placeholder="1,139+" />
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => removeDashboardStat(i)}>
              Remove
            </Button>
          </div>
        ))}

        <div className="border rounded-lg p-3 space-y-2 bg-white">
          <SectionTitle title="Dashboard Highlight Metric" subtitle="The big metric card under the stats." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label>Label</Label>
              <Input value={form.dashboardHighlight?.label || ""} onChange={(e) => onChange("dashboardHighlight", { ...(form.dashboardHighlight || {}), label: e.target.value })} />
            </div>
            <div>
              <Label>Value</Label>
              <Input value={form.dashboardHighlight?.value || ""} onChange={(e) => onChange("dashboardHighlight", { ...(form.dashboardHighlight || {}), value: e.target.value })} />
            </div>
            <div>
              <Label>Subtext</Label>
              <Input value={form.dashboardHighlight?.subtext || ""} onChange={(e) => onChange("dashboardHighlight", { ...(form.dashboardHighlight || {}), subtext: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* OUTSTANDING */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Outstanding Results Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ReqLabel>Outstanding Title</ReqLabel>
            <Input value={form.outstandingTitle || ""} onChange={(e) => onChange("outstandingTitle", e.target.value)} required />
          </div>
          <div>
            <ReqLabel>Outstanding Subtitle</ReqLabel>
            <Input value={form.outstandingSubtitle || ""} onChange={(e) => onChange("outstandingSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Outstanding Cards</Label>
          <Button type="button" variant="outline" size="sm" onClick={addOutstandingCard}>
            Add Card
          </Button>
        </div>

        {outstandingCards.map((c, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Icon Key</Label>
                <Input value={c.iconKey} onChange={(e) => updateOutstandingCard(i, "iconKey", e.target.value)} />
              </div>
              <div>
                <Label>Value</Label>
                <Input value={c.value} onChange={(e) => updateOutstandingCard(i, "value", e.target.value)} placeholder="82%" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Title</Label>
                <Input value={c.title} onChange={(e) => updateOutstandingCard(i, "title", e.target.value)} />
              </div>
              <div>
                <Label>Color Class</Label>
                <Input value={c.colorClass || ""} onChange={(e) => updateOutstandingCard(i, "colorClass", e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <TextArea value={c.description} onChange={(v) => updateOutstandingCard(i, "description", v)} />
            </div>

            <Button type="button" variant="destructive" onClick={() => removeOutstandingCard(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Timeline Section" />

        <div>
          <ReqLabel>Timeline Title</ReqLabel>
          <Input value={form.timelineTitle || ""} onChange={(e) => onChange("timelineTitle", e.target.value)} required />
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Timeline Steps</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTimelineStep}>
            Add Step
          </Button>
        </div>

        {timelineSteps.map((t, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div>
                <Label>Order</Label>
                <Input type="number" value={Number(t.order || 0)} onChange={(e) => updateTimelineStep(i, "order", Number(e.target.value))} />
              </div>
              <div>
                <Label>Badge Text</Label>
                <Input value={t.badgeText} onChange={(e) => updateTimelineStep(i, "badgeText", e.target.value)} />
              </div>
              <div>
                <Label>Color Class (optional)</Label>
                <Input value={t.colorClass || ""} onChange={(e) => updateTimelineStep(i, "colorClass", e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="destructive" className="w-full" onClick={() => removeTimelineStep(i)}>
                  Remove
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input value={t.title} onChange={(e) => updateTimelineStep(i, "title", e.target.value)} />
            </div>

            <div>
              <Label>Description</Label>
              <TextArea value={t.description} onChange={(v) => updateTimelineStep(i, "description", v)} />
            </div>
          </div>
        ))}
      </div>

      {/* PROCESS */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Process Section" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ReqLabel>Process Title</ReqLabel>
            <Input value={form.processTitle || ""} onChange={(e) => onChange("processTitle", e.target.value)} required />
          </div>
          <div>
            <ReqLabel>Process Subtitle</ReqLabel>
            <Input value={form.processSubtitle || ""} onChange={(e) => onChange("processSubtitle", e.target.value)} required />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-semibold">Process Steps</Label>
          <Button type="button" variant="outline" size="sm" onClick={addProcessStep}>
            Add Step
          </Button>
        </div>

        {processSteps.map((p, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-2" type="number" value={Number(p.order || 0)} onChange={(e) => updateProcessStep(i, "order", Number(e.target.value))} />
            <Input className="md:col-span-4" value={p.title} onChange={(e) => updateProcessStep(i, "title", e.target.value)} placeholder="Audit" />
            <Input className="md:col-span-4" value={p.description} onChange={(e) => updateProcessStep(i, "description", e.target.value)} placeholder="What happens in this step" />
            <Button className="md:col-span-2" type="button" variant="destructive" size="sm" onClick={() => removeProcessStep(i)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* MID CTA */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Mid CTA Section" />
        <div>
          <ReqLabel>Mid CTA Title</ReqLabel>
          <Input value={form.midCtaTitle || ""} onChange={(e) => onChange("midCtaTitle", e.target.value)} required />
        </div>
        <div>
          <ReqLabel>Mid CTA Body</ReqLabel>
          <TextArea value={String(form.midCtaBody || "")} onChange={(v) => onChange("midCtaBody", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Mid Primary CTA Text</ReqLabel>
            <Input value={form.midPrimaryCtaText || ""} onChange={(e) => onChange("midPrimaryCtaText", e.target.value)} required />
          </div>
          <div>
            <Label>Mid Primary CTA Href</Label>
            <Input value={form.midPrimaryCtaHref || ""} onChange={(e) => onChange("midPrimaryCtaHref", e.target.value)} />
          </div>
          <div>
            <Label>Mid Secondary CTA Text</Label>
            <Input value={form.midSecondaryCtaText || ""} onChange={(e) => onChange("midSecondaryCtaText", e.target.value)} />
          </div>
          <div>
            <Label>Mid Secondary CTA Href</Label>
            <Input value={form.midSecondaryCtaHref || ""} onChange={(e) => onChange("midSecondaryCtaHref", e.target.value)} />
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="border rounded-lg p-3 space-y-3">
        <SectionTitle title="Bottom CTA Section" />
        <div>
          <ReqLabel>Bottom CTA Title</ReqLabel>
          <Input value={form.bottomCtaTitle || ""} onChange={(e) => onChange("bottomCtaTitle", e.target.value)} required />
        </div>
        <div>
          <ReqLabel>Bottom CTA Body</ReqLabel>
          <TextArea value={String(form.bottomCtaBody || "")} onChange={(v) => onChange("bottomCtaBody", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ReqLabel>Bottom Primary CTA Text</ReqLabel>
            <Input value={form.bottomPrimaryCtaText || ""} onChange={(e) => onChange("bottomPrimaryCtaText", e.target.value)} required />
          </div>
          <div>
            <Label>Bottom Primary CTA Href</Label>
            <Input value={form.bottomPrimaryCtaHref || ""} onChange={(e) => onChange("bottomPrimaryCtaHref", e.target.value)} />
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
