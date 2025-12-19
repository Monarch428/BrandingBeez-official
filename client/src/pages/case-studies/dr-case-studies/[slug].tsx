import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import * as LucideIcons from "lucide-react";
import { BookCallButtonWithModal } from "@/components/book-appoinment";

// ---------------- Types (mirror Web Slug style) ----------------
type ResultItem = {
  key: string;
  label: string;
  value: string;
  colorClass?: string;
};

type DedicatedResourceCaseStudyCard = {
  _id: string;
  slug: string;

  title: string;
  client: string;
  industry: string;
  description: string;

  results: ResultItem[];

  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";

  link?: string;
};

type HeroStat = { value: string; label: string; iconKey?: string };

type BulletItem = { iconKey: string; text: string };

type OverviewColumn = {
  iconKey: string;
  title: string;
  dotColorClass?: string;
  bullets: BulletItem[];
};

type StrategyColumn = {
  order: number;
  title: string;
  tagText?: string;
  bullets: BulletItem[];
};

type FeatureItem = {
  iconKey: string;
  title: string;
  description: string;
  color?: string;
};

type CtaBlock = {
  title: string;
  body: string;
  primaryText: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
};

type EvaluationCard = { iconKey: string; title: string; description: string };

type Testimonial = {
  quote: string;
  authorName: string;
  authorRole?: string;
  ratingText?: string;
};

type PartnershipMetric = { iconKey: string; label: string; value: string };

type BeforeAfterItem = { label: string; value: string };
type BeforeAfterBlock = {
  beforeTitle: string;
  afterTitle: string;
  beforeItems: BeforeAfterItem[];
  afterItems: BeforeAfterItem[];
};

type ChallengePoint = { iconKey: string; text: string };

type Showcase = {
  title: string;
  subtitle?: string;
  body?: string;

  liveUrl?: string;
  liveButtonText?: string;

  desktopImageUrl?: string;
  desktopImageAlt?: string;

  mobileImageUrl?: string;
  mobileImageAlt?: string;
};

type TeamMember = {
  name: string;
  role: string;
  imageUrl?: string;
};

type TeamStat = {
  label: string;
  value: string;
};

type DedicatedResourceCaseStudyDetail = {
  cardId: string;

  // Hero
  heroBadgeText: string;
  heroTitle: string;
  heroRatingText?: string;
  heroDescription: string;
  heroStats: HeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  // Showcase (device toggle like web)
  showcase: Showcase;

  // CTA blocks
  ctaTop: CtaBlock;
  ctaMid: CtaBlock;
  finalCta: CtaBlock;

  // Challenge
  challengeTitle: string;
  challengeSubtitle: string;
  challengePoints: ChallengePoint[];
  beforeAfter: BeforeAfterBlock;

  // Overview
  overviewTitle: string;
  overviewSubtitle?: string;
  overviewColumns: OverviewColumn[];

  // Strategy
  strategyTitle: string;
  strategySubtitle?: string;
  strategyColumns: StrategyColumn[];

  // Features
  featuresTitle: string;
  featuresSubtitle?: string;
  coreFeaturesTitle?: string;
  coreFeatures: FeatureItem[];
  technicalExcellenceTitle?: string;
  technicalExcellence: FeatureItem[];

  // Evaluation
  evaluationKicker?: string;
  evaluationTitle: string;
  evaluationCards: EvaluationCard[];

  // Feedback
  feedbackKicker?: string;
  testimonial: Testimonial;
  partnershipMetricsTitle?: string;
  partnershipMetrics: PartnershipMetric[];
  feedbackPrimaryCtaText?: string;
  feedbackPrimaryCtaHref?: string;

  // Team Involved (EXISTING backend fields)
  teamTitle: string;
  teamSubtitle?: string;
  teamBannerLeftText?: string;
  teamBannerStatusText?: string;
  teamMembers: TeamMember[];
  teamStats: TeamStat[];
};

type DedicatedResourceCombined = {
  card: DedicatedResourceCaseStudyCard;
  detail?: DedicatedResourceCaseStudyDetail;
};

// ---------------- Helpers ----------------
function IconByKey({
  iconKey,
  className,
  size = 20,
  fallbackKey = "CircleHelp",
}: {
  iconKey?: string;
  className?: string;
  size?: number;
  fallbackKey?: keyof typeof LucideIcons;
}) {
  const key = String(iconKey || "").trim();
  const Comp = (LucideIcons as any)[key] as React.ComponentType<any> | undefined;
  const Fallback = LucideIcons[fallbackKey] as any;

  if (!key) return Fallback ? <Fallback className={className} size={size} /> : null;
  if (!Comp) return Fallback ? <Fallback className={className} size={size} /> : null;

  return <Comp className={className} size={size} />;
}

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      return url;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "").trim();
      if (id) return `https://www.youtube.com/embed/${id}`;
      return url;
    }

    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
      return url;
    }

    return url;
  } catch {
    return url;
  }
}

function CtaButton({
  text,
  href,
  variant = "primary",
  rightIconKey,
}: {
  text: string;
  href?: string;
  variant?: "primary" | "secondary" | "hero";
  rightIconKey?: string;
}) {
  const [, setLocation] = useLocation();

  const cls =
    variant === "hero"
      ? "px-8 py-4 bg-[#ee4b64] text-white font-bold rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
      : variant === "secondary"
      ? "px-6 py-3 border border-white rounded-md text-white hover:bg-white/10 transition-colors inline-flex items-center gap-2"
      : "px-6 py-3 bg-white text-[#ee4962] rounded-md hover:bg-gray-100 transition-colors inline-flex items-center gap-2";

  return (
    <button
      className={cls}
      onClick={() => {
        if (!href) return;
        if (href.startsWith("/")) return setLocation(href);
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      {text}
      {rightIconKey ? <IconByKey iconKey={rightIconKey} className="w-4 h-4" size={18} /> : null}
      {variant === "hero" && !rightIconKey ? <IconByKey iconKey="ArrowRight" className="w-5 h-5" size={20} /> : null}
    </button>
  );
}

// ---------------- API -> Page Mapper (ONLY existing fields) ----------------
function starsFromRating(rating?: number): string | undefined {
  if (!rating || rating <= 0) return undefined;
  const n = Math.max(1, Math.min(5, Math.round(rating)));
  return "★★★★★".slice(0, n);
}

function mapApiToCombined(api: any): DedicatedResourceCombined | null {
  if (!api || !api.card) return null;

  const c = api.card;

  const card: DedicatedResourceCaseStudyCard = {
    _id: String(c._id ?? ""),
    slug: String(c.slug ?? ""),

    title: String(c.title ?? ""),
    client: String(c.client ?? ""),
    industry: String(c.industry ?? ""),
    description: String(c.description ?? ""),

    results: Array.isArray(c.results)
      ? c.results.map((r: any) => ({
          key: String(r.key ?? ""),
          label: String(r.label ?? ""),
          value: String(r.value ?? ""),
          colorClass: typeof r.valueClass === "string" ? r.valueClass : undefined,
        }))
      : [],

    coverImageUrl: typeof c.coverImageUrl === "string" ? c.coverImageUrl : undefined,
    coverImageAlt: typeof c.coverImageAlt === "string" ? c.coverImageAlt : undefined,
    coverFit: c.coverFit === "contain" || c.coverFit === "cover" ? c.coverFit : undefined,

    link: typeof c.link === "string" ? c.link : undefined,
  };

  const d = api.detail;
  if (!d) return { card };

  const heroStats: HeroStat[] = Array.isArray(d.heroStats)
    ? d.heroStats.map((s: any, idx: number) => ({
        value: String(s.value ?? ""),
        label: String(s.label ?? ""),
        iconKey: idx === 0 ? "TrendingUp" : idx === 1 ? "PiggyBank" : "Users",
      }))
    : [];

  const challengePoints: ChallengePoint[] = Array.isArray(d.challengeImpactBullets)
    ? d.challengeImpactBullets.map((b: any) => ({
        iconKey: "AlertCircle",
        text: String(b?.text ?? ""),
      }))
    : [];

  const strategyColumns: StrategyColumn[] = Array.isArray(d.evolutionSteps)
    ? d.evolutionSteps.map((s: any) => ({
        order: Number(s.order ?? 0) || 0,
        title: String(s.title ?? ""),
        bullets: Array.isArray(s.features) ? s.features.map((f: any) => ({ iconKey: "CheckCircle2", text: String(f ?? "") })) : [],
      }))
    : [];

  const coreFeatures: FeatureItem[] = Array.isArray(d.successFactors)
    ? d.successFactors.map((f: any, idx: number) => ({
        iconKey: idx % 2 === 0 ? "Sparkles" : "ShieldCheck",
        title: String(f.title ?? ""),
        description: String(f.description ?? ""),
      }))
    : [];

  const firstT = Array.isArray(d.testimonials) ? d.testimonials[0] : undefined;
  const testimonial: Testimonial = {
    quote: String(firstT?.quote ?? ""),
    authorName: String(firstT?.author ?? ""),
    authorRole: typeof firstT?.role === "string" ? firstT.role : undefined,
    ratingText:
      typeof firstT?.rating === "number"
        ? starsFromRating(firstT.rating)
        : typeof d.heroRatingText === "string"
        ? d.heroRatingText
        : undefined,
  };

  const partnershipMetrics: PartnershipMetric[] = Array.isArray(d.teamStats)
    ? d.teamStats.map((m: any, idx: number) => ({
        iconKey: idx === 0 ? "TrendingUp" : idx === 1 ? "Clock" : idx === 2 ? "PiggyBank" : "BarChart3",
        label: String(m.label ?? ""),
        value: String(m.value ?? ""),
      }))
    : [];

  // ---- Team Involved (correct mapping) ----
  const teamMembers: TeamMember[] = Array.isArray(d.teamMembers)
    ? d.teamMembers.map((m: any) => ({
        name: String(m?.name ?? ""),
        role: String(m?.role ?? ""),
        imageUrl: typeof m?.imageUrl === "string" ? m.imageUrl : undefined,
      }))
    : [];

  const teamStats: TeamStat[] = Array.isArray(d.teamStats)
    ? d.teamStats.map((s: any) => ({
        label: String(s?.label ?? ""),
        value: String(s?.value ?? ""),
      }))
    : [];

  const ctaTop: CtaBlock = {
    title: String(d.ctaPrimary?.title ?? ""),
    body: String(d.ctaPrimary?.body ?? ""),
    primaryText: String(d.heroPrimaryCtaText ?? "Book a Call"),
    primaryHref: typeof d.heroPrimaryCtaHref === "string" ? d.heroPrimaryCtaHref : undefined,
    secondaryText: "View Case Studies",
    secondaryHref: "/services/dedicated-resources#case-studies",
  };

  const ctaMid: CtaBlock = {
    title: String(d.ctaSecondary?.title ?? ""),
    body: String(d.ctaSecondary?.body ?? ""),
    primaryText: "Explore More",
    primaryHref: "/services/dedicated-resources#case-studies",
  };

  const finalCta: CtaBlock = {
    title: String(d.ctaPrimary?.title ?? ""),
    body: String(d.ctaPrimary?.body ?? ""),
    primaryText: String(d.heroPrimaryCtaText ?? "Book a Call"),
    primaryHref: typeof d.heroPrimaryCtaHref === "string" ? d.heroPrimaryCtaHref : undefined,
    secondaryText: "View Other Case Studies",
    secondaryHref: "/services/dedicated-resources#case-studies",
  };

  const detail: DedicatedResourceCaseStudyDetail = {
    cardId: String(d.cardId ?? ""),

    heroBadgeText: String(d.heroBadgeText ?? ""),
    heroTitle: String(d.heroTitle ?? ""),
    heroRatingText: typeof d.heroRatingText === "string" ? d.heroRatingText : undefined,
    heroDescription: String(d.heroDescription ?? ""),
    heroStats,
    heroPrimaryCtaText: String(d.heroPrimaryCtaText ?? ""),
    heroPrimaryCtaHref: typeof d.heroPrimaryCtaHref === "string" ? d.heroPrimaryCtaHref : undefined,
    heroSecondaryCtaText: undefined,
    heroSecondaryCtaHref: undefined,

    heroVideoUrl: typeof d.heroVideoUrl === "string" ? d.heroVideoUrl : undefined,
    heroVideoPoster: undefined,
    heroVideoBadgeText: typeof d.heroVideoBadgeText === "string" ? d.heroVideoBadgeText : undefined,

    showcase: {
      title: "",
      subtitle: "",
    },

    ctaTop,
    ctaMid,
    finalCta,

    challengeTitle: String(d.challengeTitle ?? ""),
    challengeSubtitle: String(d.challengeBody ?? ""),
    challengePoints,
    beforeAfter: {
      beforeTitle: String(d.beforeAfterTitle ?? "Before"),
      afterTitle: String(d.beforeAfterTitle ?? "After"),
      beforeItems: [],
      afterItems: [],
    },

    overviewTitle: "", // not used (kept for compatibility)
    overviewSubtitle: undefined,
    overviewColumns: [],

    strategyTitle: String(d.evolutionTitle ?? ""),
    strategySubtitle: typeof d.evolutionSubtitle === "string" ? d.evolutionSubtitle : undefined,
    strategyColumns,

    featuresTitle: String(d.successFactorsTitle ?? ""),
    featuresSubtitle: typeof d.successFactorsSubtitle === "string" ? d.successFactorsSubtitle : undefined,
    coreFeaturesTitle: "Success Factors",
    coreFeatures,
    technicalExcellenceTitle: "",
    technicalExcellence: [],

    evaluationKicker: undefined,
    evaluationTitle: "",
    evaluationCards: [],

    feedbackKicker: String(d.feedbackTitle ?? ""),
    testimonial,
    partnershipMetricsTitle: typeof d.feedbackSubtitle === "string" ? d.feedbackSubtitle : "Partnership Metrics",
    partnershipMetrics,
    feedbackPrimaryCtaText: String(d.heroPrimaryCtaText ?? "Book a Call"),
    feedbackPrimaryCtaHref: typeof d.heroPrimaryCtaHref === "string" ? d.heroPrimaryCtaHref : undefined,

    // Team Involved (EXISTING backend fields)
    teamTitle: String(d.teamTitle ?? ""),
    teamSubtitle: typeof d.teamSubtitle === "string" ? d.teamSubtitle : undefined,
    teamBannerLeftText: typeof d.teamBannerLeftText === "string" ? d.teamBannerLeftText : undefined,
    teamBannerStatusText: typeof d.teamBannerStatusText === "string" ? d.teamBannerStatusText : undefined,
    teamMembers,
    teamStats,
  };

  return { card, detail };
}

// ---------------- Page ----------------
export default function DedicatedResourceCaseStudySlugPage(props: any) {
  const [, setLocation] = useLocation();

  const route = useRoute("/dedicated-resource-case-study/:slug");
  const slugFromRoute = route[0] ? route[1]?.slug : undefined;
  const slugFromProps = props?.params?.slug;
  const slug = String(slugFromProps ?? slugFromRoute ?? "").trim();

  const [data, setData] = useState<DedicatedResourceCombined | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        if (!slug) {
          setError("Missing slug in URL.");
          return;
        }

        const res = await fetch(`/api/dedicated-resource-case-study/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Dedicated resource case study not found");
          throw new Error(`Failed to load Dedicated resource case study: ${res.status} ${res.statusText}`);
        }

        const apiJson = await res.json();
        const mapped = mapApiToCombined(apiJson);
        if (!mapped) throw new Error("Invalid API response: missing card");

        if (cancelled) return;
        setData(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unable to load Dedicated resource case study");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const card = data?.card;
  const detail = data?.detail;

  const heroStats = useMemo<HeroStat[]>(() => detail?.heroStats ?? [], [detail]);
  const challengePoints = useMemo(() => detail?.challengePoints ?? [], [detail]);
  const strategyColumns = useMemo(() => (detail?.strategyColumns ?? []).slice().sort((a, b) => a.order - b.order), [detail]);
  const coreFeatures = useMemo(() => detail?.coreFeatures ?? [], [detail]);
  const technicalExcellence = useMemo(() => detail?.technicalExcellence ?? [], [detail]);
  const evaluationCards = useMemo(() => detail?.evaluationCards ?? [], [detail]);
  const partnershipMetrics = useMemo(() => detail?.partnershipMetrics ?? [], [detail]);

  const teamMembers = useMemo(() => detail?.teamMembers ?? [], [detail]);
  const teamStats = useMemo(() => detail?.teamStats ?? [], [detail]);

  const showcase = detail?.showcase;
  const beforeAfter = detail?.beforeAfter;

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-gray-500">Loading Dedicated resource case study…</div>;
  }

  if (error || !card) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-red-500 font-semibold mb-2">{error ?? "Unable to load Dedicated resource case study"}</div>
        <button className="mt-2 px-5 py-2 rounded-lg bg-[#ee4962] text-white font-semibold" onClick={() => setLocation("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const hasDetail = Boolean(detail);
  const cardTop3 = Array.isArray(card.results) ? card.results.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO (same as web) ================= */}
      <section className="relative bg-gradient-to-r from-[#321a66]/90 to-[#ee4962]/90 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#ee4962]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="flex mb-6">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
                  <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-md">
                    <IconByKey iconKey="Award" className="w-3.5 h-3.5 text-white" size={14} />
                  </div>
                  <span className="text-white text-sm font-medium">{detail?.heroBadgeText ?? "Featured Dedicated Team Success"}</span>
                </div>
              </div>

              <h1 className="text-white mb-4 font-bold text-[42px] md:text-[56px] leading-tight">
                {detail?.heroTitle ?? card.title ?? card.client}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-white/90">{detail?.heroRatingText ?? "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by 25+ Agencies"}</span>
              </div>

              <p className="text-white/90 mb-12">{detail?.heroDescription ?? card.description}</p>

              {/* Stats (3) */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {(heroStats.length ? heroStats : cardTop3.map((r) => ({ value: r.value, label: r.label, iconKey: "TrendingUp" })))
                  .slice(0, 3)
                  .map((s, idx) => (
                    <div key={`${s.label}-${idx}`} className="backdrop-blur-[2px] bg-white rounded-lg p-4 text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-[#EE4962] rounded-lg mb-3">
                        <IconByKey iconKey={s.iconKey ?? "CheckCircle2"} className="w-5 h-5 text-white" size={20} />
                      </div>
                      <div className="text-sm mb-1 text-black font-semibold">{s.value}</div>
                      <p className="text-xs text-black/80">{s.label}</p>
                    </div>
                  ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <BookCallButtonWithModal
                  buttonLabel={detail?.heroPrimaryCtaText ?? "Hire Your Team"}
                  className="px-8 py-6 bg-[#ee4b64] text-white font-bold rounded-[8px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
                  buttonSize="lg"
                />
                <CtaButton
                  variant="secondary"
                  text={detail?.heroSecondaryCtaText ?? "View Other Dedicated Resources"}
                  href={detail?.heroSecondaryCtaHref ?? "/services/dedicated-resources#case-studies"}
                  rightIconKey="ArrowRight"
                />
              </div>
            </div>

            {/* Right: iframe video OR fallback image */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#ee4962]/20 to-[#321a66]/20 rounded-2xl blur-2xl"></div>

              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="aspect-video bg-gradient-to-br from-[#ee4962]/20 to-[#321a66]/20">
                  {detail?.heroVideoUrl ? (
                    <div className="relative w-full h-full">
                      <iframe
                        className="w-full h-full"
                        src={toEmbedUrl(detail.heroVideoUrl)}
                        title={detail?.heroVideoBadgeText ?? "Case Study Video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : card.coverImageUrl ? (
                    <img
                      src={card.coverImageUrl}
                      alt={card.coverImageAlt || card.title}
                      className={`w-full h-full ${(card.coverFit || "cover") === "cover" ? "object-cover" : "object-contain"}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/80 text-sm">Video / image not provided</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!hasDetail ? (
            <div className="mt-10 bg-white/10 border border-white/20 text-white rounded-xl p-4">
              Detail content not added yet for this Dedicated Resource case study. (Card data loaded ✅)
            </div>
          ) : null}
        </div>
      </section>

      {/* ================= Showcase (kept as-is; API doesn't provide showcase) ================= */}
      <WebsiteShowcaseSection showcase={showcase} fallbackTitle="Showcase" fallbackSubtitle={`Desktop & mobile snapshots for ${card.client}`} />

      {/* ================= Team Involved (NOW MAPPED + RENDERED) ================= */}
      {hasDetail && (detail?.teamTitle || teamMembers.length || teamStats.length) ? (
        <TeamInvolvedSection
          title={detail?.teamTitle ?? "The Team Involved"}
          subtitle={detail?.teamSubtitle ?? ""}
          bannerLeftText={detail?.teamBannerLeftText ?? ""}
          bannerStatusText={detail?.teamBannerStatusText ?? ""}
          members={teamMembers}
          stats={teamStats}
        />
      ) : null}

      {/* ================= CTA Top ================= */}
      <InlineCtaBand
        title={detail?.ctaTop?.title ?? "Need a Dedicated Team Like This?"}
        body={detail?.ctaTop?.body ?? "Book a free strategy call and see how an embedded team can plug into your workflow within days."}
        buttonText={detail?.ctaTop?.primaryText ?? "Book Strategy Call"}
        buttonHref={detail?.ctaTop?.primaryHref ?? "/contact?service=dedicated-resources"}
      />

      {/* ================= Challenge + Before/After ================= */}
      <ChallengeSection
        title={detail?.challengeTitle ?? "Partnership Challenge"}
        subtitle={detail?.challengeSubtitle ?? ""}
        points={challengePoints}
        beforeAfter={beforeAfter}
      />

      {/* ================= Strategy / Evolution ================= */}
      <StrategySection title={detail?.strategyTitle ?? "Partnership Evolution"} subtitle={detail?.strategySubtitle ?? ""} columns={strategyColumns} />

      {/* ================= Success Factors / Features ================= */}
      <FeaturesSection
        title={detail?.featuresTitle ?? "Success Factors"}
        subtitle={detail?.featuresSubtitle ?? ""}
        coreTitle={detail?.coreFeaturesTitle ?? "Core Success Drivers"}
        core={coreFeatures}
        techTitle={detail?.technicalExcellenceTitle ?? "Operational Excellence"}
        tech={technicalExcellence}
      />

      {/* ================= CTA Mid ================= */}
      <InlineCtaBand
        title={detail?.ctaMid?.title ?? "Want to scale without hiring headaches?"}
        body={detail?.ctaMid?.body ?? "We’ll map a team structure, SOP and timeline for your agency in one call."}
        buttonText={detail?.ctaMid?.primaryText ?? "Talk to Us"}
        buttonHref={detail?.ctaMid?.primaryHref ?? "/contact?service=dedicated-resources"}
      />

      {/* ================= Evaluation (only if cards exist) ================= */}
      {evaluationCards.length ? (
        <EvaluationSection kicker={detail?.evaluationKicker ?? "Why this partnership works"} title={detail?.evaluationTitle ?? "Partnership Evaluation"} cards={evaluationCards} />
      ) : null}

      {/* ================= Feedback ================= */}
      <FeedbackSection
        kicker={detail?.feedbackKicker ?? "Client Feedback"}
        quote={detail?.testimonial?.quote ?? ""}
        authorName={detail?.testimonial?.authorName ?? ""}
        authorRole={detail?.testimonial?.authorRole ?? ""}
        ratingText={detail?.testimonial?.ratingText ?? "⭐⭐⭐⭐⭐"}
        metricsTitle={detail?.partnershipMetricsTitle ?? "Partnership Metrics"}
        metrics={partnershipMetrics}
        primaryCtaText={detail?.feedbackPrimaryCtaText ?? "Start Your Partnership"}
        primaryCtaHref={detail?.feedbackPrimaryCtaHref ?? "/contact?service=dedicated-resources"}
      />

      {/* ================= Final CTA ================= */}
      <FinalCtaSection
        title={detail?.finalCta?.title ?? "Ready to Hire Your Dedicated Team?"}
        body={detail?.finalCta?.body ?? `Join ${card.client} and other agencies that scale with BrandingBeez dedicated resources.`}
        primaryText={detail?.finalCta?.primaryText ?? "Book Your Free Consultation"}
        primaryHref={detail?.finalCta?.primaryHref ?? "/contact?service=dedicated-resources"}
        secondaryText={detail?.finalCta?.secondaryText ?? "View Other Case Studies"}
        secondaryHref={detail?.finalCta?.secondaryHref ?? "/services/dedicated-resources#case-studies"}
      />
    </div>
  );
}

// ================= Sections (same as web) =================
function WebsiteShowcaseSection({
  showcase,
  fallbackTitle,
  fallbackSubtitle,
}: {
  showcase?: Showcase;
  fallbackTitle: string;
  fallbackSubtitle: string;
}) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const title = showcase?.title ?? fallbackTitle;
  const subtitle = showcase?.subtitle ?? fallbackSubtitle;
  const body = showcase?.body ?? "";

  const liveUrl = showcase?.liveUrl;
  const liveButtonText = showcase?.liveButtonText ?? "View Live";

  const imgDesktop = showcase?.desktopImageUrl;
  const imgMobile = showcase?.mobileImageUrl;

  const imgUrl = viewMode === "desktop" ? imgDesktop : imgMobile;
  const imgAlt =
    viewMode === "desktop" ? (showcase?.desktopImageAlt ?? "Desktop screenshot") : (showcase?.mobileImageAlt ?? "Mobile screenshot");

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4 font-bold text-[32px]">{title}</h2>
          <p className="text-gray-600 mb-4">{subtitle}</p>
          {body ? <p className="text-gray-700 max-w-3xl mx-auto">{body}</p> : null}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[#ee4962] rounded-lg">
                <IconByKey iconKey={viewMode === "desktop" ? "Monitor" : "Smartphone"} className="w-5 h-5 text-white" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900">{viewMode === "desktop" ? "Desktop View" : "Mobile View"}</h3>
              </div>
            </div>

            <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode("desktop")}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
                  viewMode === "desktop" ? "bg-gradient-to-r from-[#321a66] to-[#ee4962] text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconByKey iconKey="Monitor" className="w-4 h-4" size={16} />
                Desktop
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
                  viewMode === "mobile" ? "bg-gradient-to-r from-[#321a66] to-[#ee4962] text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconByKey iconKey="Smartphone" className="w-4 h-4" size={16} />
                Mobile
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {viewMode === "desktop" ? "Clean layout optimized for desktop experience" : "Responsive design optimized for mobile devices"}
          </p>

          <div
            className={`bg-gray-100 border-2 border-gray-200 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
              viewMode === "mobile" ? "max-w-sm mx-auto" : ""
            }`}
          >
            {imgUrl ? (
              <img src={imgUrl} alt={imgAlt} className="w-full h-auto" loading="lazy" />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center text-gray-500 text-sm">Screenshot not provided</div>
            )}
          </div>
        </div>

        {liveUrl ? (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.open(liveUrl, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ee4962] text-white rounded-md hover:bg-[#d91045] transition-colors shadow-md hover:shadow-lg"
            >
              <IconByKey iconKey="ExternalLink" className="w-4 h-4" size={16} />
              {liveButtonText}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InlineCtaBand({ title, body, buttonText }: { title: string; body: string; buttonText: string; buttonHref?: string }) {
  return (
    <section className="bg-gradient-to-r from-[#391B66] to-[#E64761] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <p className="text-white mb-3 text-[20px] font-bold">{title}</p>
            <p className="text-white">{body}</p>
          </div>

          <div className="md:flex-shrink-0">
            <BookCallButtonWithModal
              buttonLabel={buttonText ?? "Book Free Consultation"}
              className="w-full md:w-auto px-6 py-3 bg-white text-[#ee4962] rounded-md hover:bg-gray-100 transition-colors"
              buttonSize="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChallengeSection({
  title,
  subtitle,
  points,
  beforeAfter,
}: {
  title: string;
  subtitle: string;
  points: ChallengePoint[];
  beforeAfter?: BeforeAfterBlock;
}) {
  const beforeTitle = beforeAfter?.beforeTitle ?? "Before";
  const afterTitle = beforeAfter?.afterTitle ?? "After";
  const beforeItems = beforeAfter?.beforeItems ?? [];
  const afterItems = beforeAfter?.afterItems ?? [];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 font-bold text-[32px] mb-4">{title}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {points.length ? (
          <div className="space-y-4 mb-12 max-w-2xl mx-auto">
            {points.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-[#ee4962] rounded-full">
                  <IconByKey iconKey={p.iconKey} className="w-5 h-5 text-white" size={20} />
                </div>
                <p className="text-gray-700">{p.text}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full">
                <IconByKey iconKey="X" className="w-6 h-6 text-white" size={22} />
              </div>
              <h3 className="text-gray-900 font-bold text-[24px]">{beforeTitle}</h3>
            </div>

            <div className="space-y-4">
              {beforeItems.length ? (
                beforeItems.map((x, i) => (
                  <div key={i} className={`flex items-center justify-between ${i !== beforeItems.length - 1 ? "pb-3 border-b border-red-200" : ""}`}>
                    <span className="text-gray-700">{x.label}</span>
                    <span className="text-red-600 font-semibold">{x.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-600">Before items not provided</div>
              )}
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
                <IconByKey iconKey="Check" className="w-6 h-6 text-white" size={22} />
              </div>
              <h3 className="text-gray-900 font-bold text-[24px]">{afterTitle}</h3>
            </div>

            <div className="space-y-4">
              {afterItems.length ? (
                afterItems.map((x, i) => (
                  <div key={i} className={`flex items-center justify-between ${i !== afterItems.length - 1 ? "pb-3 border-b border-green-200" : ""}`}>
                    <span className="text-gray-700">{x.label}</span>
                    <span className="text-green-600 font-semibold">{x.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-600">After items not provided</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StrategySection({ title, subtitle, columns }: { title: string; subtitle: string; columns: StrategyColumn[] }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 font-bold text-[32px] mb-4">{title}</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(columns || []).map((col, idx) => (
            <div key={`${col.title}-${idx}`} className="relative border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 bg-[rgb(50,26,102)] rounded-full flex-shrink-0">
                  <span className="text-white font-bold text-[20px]">{col.order ?? idx + 1}</span>
                </div>
                <h3 className="text-gray-900 font-bold text-[20px]">{col.title}</h3>
              </div>

              {col.tagText ? (
                <div className="inline-block px-2 py-0.5 text-sm bg-gradient-to-r from-[#321A66]/10 to-[#ee4962]/10 text-[#321A66] rounded-[5px] border border-[#ee4962]/20 mb-6">
                  {col.tagText}
                </div>
              ) : null}

              <ul className="space-y-3">
                {(col.bullets || []).map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <IconByKey iconKey={b.iconKey} className="w-5 h-5 text-[#ee4962] flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-700">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({
  title,
  subtitle,
  coreTitle,
  core,
  techTitle,
  tech,
}: {
  title: string;
  subtitle: string;
  coreTitle: string;
  core: FeatureItem[];
  techTitle: string;
  tech: FeatureItem[];
}) {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4 text-[32px] font-bold">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="mb-12">
          <h3 className="text-[rgb(50,26,102)] mb-6 text-center font-bold text-[20px]">{coreTitle}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {(core || []).map((f, idx) => (
              <div
                key={idx}
                className={`border border-gray-200 rounded-lg shadow-sm p-6 ${
                  idx % 2 === 0 ? "bg-gradient-to-br from-[#ee4962]/5 to-white" : "bg-gradient-to-br from-[#321a66]/5 to-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: f.color || (idx % 2 === 0 ? "#ee4962" : "#321a66") }}
                  >
                    <IconByKey iconKey={f.iconKey} className="w-5 h-5 text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2 font-semibold">{f.title}</h4>
                    <p className="text-gray-600">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[rgb(50,26,102)] mb-6 text-center text-[20px] font-bold">{techTitle}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {(tech || []).map((f, idx) => (
              <div
                key={idx}
                className={`border border-gray-200 rounded-lg shadow-sm p-6 ${
                  idx % 2 === 0 ? "bg-gradient-to-br from-[#ee4962]/5 to-white" : "bg-gradient-to-br from-[#321a66]/5 to-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: f.color || (idx % 2 === 0 ? "#ee4962" : "#321a66") }}
                  >
                    <IconByKey iconKey={f.iconKey} className="w-5 h-5 text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2 font-semibold">{f.title}</h4>
                    <p className="text-gray-600">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EvaluationSection({ kicker, title, cards }: { kicker: string; title: string; cards: EvaluationCard[] }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-[#ee4962] mb-3 font-bold text-[24px]">{kicker}</p>
          <h2 className="text-gray-900 font-bold text-[28px]">{title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(cards || []).map((c, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-[#321a66] rounded-lg mb-4">
                <IconByKey iconKey={c.iconKey} className="w-6 h-6 text-white" size={22} />
              </div>
              <h3 className="text-gray-900 mb-3 font-semibold">{c.title}</h3>
              <p className="text-gray-700 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedbackSection({
  kicker,
  quote,
  authorName,
  authorRole,
  ratingText,
  metricsTitle,
  metrics,
  primaryCtaText,
  primaryCtaHref,
}: {
  kicker: string;
  quote: string;
  authorName: string;
  authorRole: string;
  ratingText: string;
  metricsTitle: string;
  metrics: PartnershipMetric[];
  primaryCtaText: string;
  primaryCtaHref?: string;
}) {
  const [, setLocation] = useLocation();

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#ee4962] mb-2 font-bold text-[20px]">{kicker}</p>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">See how this partnership created lasting value and set the foundation for continued success.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8 md:p-12 relative">
            <div className="absolute top-6 left-6">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#321a66] to-[#ee4962] rounded-full">
                <IconByKey iconKey="Quote" className="w-7 h-7 text-white" size={26} />
              </div>
            </div>

            <blockquote className="text-center mb-8 mt-8">
              <p className="text-gray-700 italic mb-4">{quote ? `"${quote}"` : "“Testimonial not provided yet.”"}</p>
              <div className="text-gray-500 text-sm">{ratingText}</div>
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#321a66] rounded-full">
                <IconByKey iconKey="MessageCircle" className="w-6 h-6 text-white" size={22} />
              </div>
              <div className="text-left">
                <div className="text-gray-900 font-semibold">{authorName || "Client"}</div>
                <p className="text-gray-600">{authorRole || "—"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8 md:p-12">
            <h3 className="text-gray-900 mb-8 text-center font-bold text-[20px]">{metricsTitle}</h3>

            <div className="space-y-6 mb-8">
              {(metrics || []).map((m, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconByKey iconKey={m.iconKey} className="w-5 h-5 text-[#321a66]" size={18} />
                    <span className="text-gray-700">{m.label}</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{m.value}</span>
                </div>
              ))}
              {!metrics?.length ? <div className="text-sm text-gray-500 text-center">Metrics not provided yet.</div> : null}
            </div>

            <div className="text-center">
              <button
                className="w-full px-6 py-3 bg-[#E64761] text-white rounded-md hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (!primaryCtaHref) return;
                  if (primaryCtaHref.startsWith("/")) return setLocation(primaryCtaHref);
                  window.open(primaryCtaHref, "_blank", "noopener,noreferrer");
                }}
              >
                {primaryCtaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection({
  title,
  body,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: {
  title: string;
  body: string;
  primaryText: string;
  primaryHref?: string;
  secondaryText: string;
  secondaryHref?: string;
}) {
  const [, setLocation] = useLocation();

  return (
    <section className="relative bg-gradient-to-r from-[#ee4962] to-[#321a66] text-white py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-white mb-6 font-bold text-[20px]">{title}</h2>
        <p className="text-white/90 mb-8 max-w-3xl mx-auto">{body}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <BookCallButtonWithModal
            buttonLabel={primaryText ?? "Book Your Strategy Call"}
            className="px-6 py-6 bg-white text-[#ee4962] rounded-md hover:bg-gray-100 transition-colors min-w-[254px]"
            buttonSize="lg"
          />

          <button
            className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10 transition-colors inline-flex items-center gap-2 min-w-[292px]"
            onClick={() => {
              if (!secondaryHref) return;
              if (secondaryHref.startsWith("/")) return setLocation(secondaryHref);
              window.open(secondaryHref, "noopener,noreferrer");
            }}
          >
            {secondaryText}
            <IconByKey iconKey="ArrowRight" className="w-4 h-4" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TeamInvolvedSection({
  title,
  subtitle,
  bannerLeftText,
  bannerStatusText,
  members,
  stats,
}: {
  title: string;
  subtitle: string;
  bannerLeftText: string;
  bannerStatusText: string;
  members: { name: string; role: string; imageUrl?: string }[];
  stats: { label: string; value: string }[];
}) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-gray-900 font-bold text-[32px] mb-3">{title}</h2>
          {subtitle ? <p className="text-gray-600 max-w-3xl mx-auto">{subtitle}</p> : null}
        </div>

        {bannerLeftText || bannerStatusText ? (
          <div className="mb-10 rounded-xl border border-gray-200 bg-gradient-to-r from-[#321a66]/5 to-[#ee4962]/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-gray-900 font-semibold">{bannerLeftText}</div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ee4962]/30 bg-white">
              <span className="w-2 h-2 rounded-full bg-[#ee4962]" />
              <span className="text-sm text-gray-800">{bannerStatusText}</span>
            </div>
          </div>
        ) : null}

        {members?.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {members.map((m, idx) => (
              <div key={`${m.name}-${idx}`} className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <IconByKey iconKey="User" className="w-6 h-6" size={22} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-gray-900 font-semibold truncate">{m.name}</div>
                    <div className="text-gray-600 text-sm truncate">{m.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {stats?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, idx) => (
              <div key={`${s.label}-${idx}`} className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
                <div className="text-[#321a66] font-bold text-[22px]">{s.value}</div>
                <div className="text-gray-700 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
