import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import * as LucideIcons from "lucide-react";
import { Helmet } from "react-helmet";

import BrandingBeezLoader from "@/components/BeeLoadingScreen";
import { SEO } from "@/hooks/SEO";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { BookCallButtonWithModal } from "@/components/book-appoinment";

/* ============================================================
   TYPES (matches your Mongo schema)
   ============================================================ */

type DrHeroStat = { value: string; label: string; iconKey?: string };
type DrTeamMember = { name: string; role: string; imageUrl?: string };
type DrMiniStat = { value: string; label: string; colorClass?: string };

type DrPreMetricItem = { iconKey: string; label: string; value: string };

type DrEvolutionFeature = { iconKey: string; text: string };
type DrEvolutionStep = {
  order: number;
  numberText: string;
  title: string;
  subtitle: string;
  colorClass?: string;
  features: DrEvolutionFeature[];
};

type DrSuccessFactor = {
  iconKey: string;
  title: string;
  description: string;
  gradientClass?: string; // "from-[#391B66] to-[#E64761]"
};

type DrBeforeAfterRow = { keyMetric: string; before: string; after: string };

type DrTestimonial = {
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
  rating?: number;
};

type DrVideoTestimonial = {
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
};

type DedicatedResourceSeoMeta = {
  metaTitle?: string;
  metaDescription?: string;
};

export type DedicatedResourceCaseStudyDetail = {
  cardId: string;

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

  teamTitle: string;
  teamSubtitle: string;
  teamBannerLeftText: string;
  teamBannerStatusText: string;
  teamMembers: DrTeamMember[];
  teamStats: DrMiniStat[];

  challengeTitle: string;
  challengeBody: string;
  challengeImpactTitle: string;
  challengeImpactBullets: { iconKey: string; text: string }[];

  prePartnershipTitle: string;
  prePartnershipMetrics: DrPreMetricItem[];

  evolutionTitle: string;
  evolutionSubtitle: string;
  evolutionSteps: DrEvolutionStep[];

  successFactorsTitle: string;
  successFactorsSubtitle: string;
  successFactors: DrSuccessFactor[];

  beforeAfterTitle: string;
  beforeAfterSubtitle: string;
  beforeAfterRows: DrBeforeAfterRow[];

  feedbackTitle: string;
  feedbackSubtitle: string;
  testimonials: DrTestimonial[];
  videoTestimonial?: DrVideoTestimonial;

  ctaPrimary: {
    title: string;
    body: string;
    primaryButtonText: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
  };

  ctaSecondary: {
    title: string;
    body: string;
    emailLabel?: string;
    emailValue?: string;
    phoneLabel?: string;
    phoneValue?: string;
    formTitle?: string;
  };

  seo?: DedicatedResourceSeoMeta;
};

export type DedicatedResourceCombined = {
  card: any; // you already have card schema elsewhere (slug, cover, etc.)
  detail?: DedicatedResourceCaseStudyDetail;
};

/* ========================
   Dynamic Lucide Icon Helper (TS FIXED)
   ======================== */

type LucideIconKey = keyof typeof LucideIcons;

type IconByKeyProps = {
  iconKey?: string;
  className?: string;
  size?: number;
  fallbackKey?: LucideIconKey;
};

type IconRenderer = (props: IconByKeyProps) => React.ReactNode;

function IconByKey({
  iconKey,
  className,
  size = 20,
  fallbackKey = "CircleHelp",
}: IconByKeyProps) {
  const key = String(iconKey || "").trim();

  const Comp = (LucideIcons as Record<string, unknown>)[key] as
    | React.ComponentType<{ className?: string; size?: number }>
    | undefined;

  const Fallback = LucideIcons[fallbackKey] as unknown as
    | React.ComponentType<{ className?: string; size?: number }>
    | undefined;

  if (!key || !Comp) return Fallback ? <Fallback className={className} size={size} /> : null;
  return <Comp className={className} size={size} />;
}

/* ============================================================
   PAGE
   ============================================================ */

export default function DedicatedResourceCaseStudyPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<{ slug: string }>("/dedicated-resource-case-studies/:slug");
  const slug = params?.slug;

  const [combined, setCombined] = useState<DedicatedResourceCombined | null>(null);
  const [detail, setDetail] = useState<DedicatedResourceCaseStudyDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cleanSlug = (slug || "").trim();

    if (!match || !cleanSlug) {
      setError("Slug missing in URL");
      setLoading(false);
      setCombined(null);
      setDetail(null);
      return;
    }

    let cancelled = false;

    async function fetchCaseStudy() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/dedicated-resource-case-study/${encodeURIComponent(cleanSlug)}`);

        if (res.status === 404) throw new Error("Case study not found (404)");
        if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

        const data = (await res.json()) as DedicatedResourceCombined;
        if (cancelled) return;

        if (!data?.card) throw new Error("Invalid API response: missing card");
        if (!data?.detail) throw new Error("Missing detail for this case study");

        setCombined(data);
        setDetail(data.detail);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Unable to load case study");
          setCombined(null);
          setDetail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCaseStudy();
    return () => {
      cancelled = true;
    };
  }, [match, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <BrandingBeezLoader />
      </div>
    );
  }

  if (error || !detail || !combined?.card) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-red-500 font-semibold mb-2">{error ?? "Case study not found"}</div>
        <button
          className="mt-2 px-5 py-2 rounded-lg bg-[#ee4962] text-white font-semibold"
          onClick={() => setLocation("/dedicated-resource-case-studies")}
        >
          Back to Case Studies
        </button>
      </div>
    );
  }

  const metaTitle = detail.seo?.metaTitle || detail.heroTitle || detail.heroClientName || "Case Study";

  return (
    <>
      <SEO
        title={`${metaTitle} | BrandingBeez Dedicated Resource Case Study`}
        description={detail.seo?.metaDescription || detail.heroDescription}
      />

      <Helmet>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${metaTitle} | BrandingBeez`} />
        <meta
          property="og:description"
          content={detail.seo?.metaDescription || detail.heroDescription}
        />
      </Helmet>

      <Hero detail={detail} IconRenderer={IconByKey} />
      <TeamInvolved detail={detail} />
      <PartnershipChallenge detail={detail} IconRenderer={IconByKey} />
      <PartnershipEvolution detail={detail} IconRenderer={IconByKey} />
      <SuccessFactors detail={detail} IconRenderer={IconByKey} />
      <BeforeAfter detail={detail} />
      <ClientFeedback detail={detail} />
      <CTASection variant="primary" detail={detail} />
      <CTASection variant="secondary" detail={detail} />
    </>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */

function Hero({
  detail,
  IconRenderer,
}: {
  detail: DedicatedResourceCaseStudyDetail;
  IconRenderer: IconRenderer;
}) {
  const stats = detail.heroStats ?? [];
  const s1 = stats[0];
  const s2 = stats[1];
  const s3 = stats[2];

  return (
    <section
      className="relative py-20 flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #391B66, #E64761)" }}
    >
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-[#ee4962] text-white px-4 py-2 rounded-full mb-6">
                <IconRenderer iconKey="Award" className="w-4 h-4" size={16} />
                <span className="text-sm">{detail.heroBadgeText}</span>
              </div>

              <h1 className="mb-4 text-white text-5xl">{detail.heroTitle}</h1>

              {detail.heroRatingText ? (
                <div className="flex items-center gap-2 mb-4 text-white/90">
                  <span className="text-[16px]">{detail.heroRatingText}</span>
                </div>
              ) : null}

              <p className="text-xl text-white/90 mb-8 leading-relaxed">{detail.heroDescription}</p>

              {/* 3 stats cards */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[s1, s2, s3].filter(Boolean).map((st, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-lg">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                      style={{ backgroundColor: "#E64761" }}
                    >
                      <IconRenderer iconKey={st!.iconKey} className="w-5 h-5 text-white" size={20} />
                    </div>
                    <h3 className="mb-0 text-sm" style={{ color: "#391B66" }}>
                      {st!.value}
                    </h3>
                    <p className="text-xs text-gray-500">{st!.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <BookCallButtonWithModal
                buttonLabel={detail.heroPrimaryCtaText}
                className="px-8 py-4 bg-[#ee4b64] text-white font-bold rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
                buttonSize="lg"
                defaultServiceType="Dedicated Team / White Label"
              />
            </div>

            {/* Right */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black/20">
                <div className="relative aspect-video">
                  <video className="w-full h-full object-cover" controls poster={detail.heroVideoPoster}>
                    {detail.heroVideoUrl ? <source src={detail.heroVideoUrl} type="video/mp4" /> : null}
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  {detail.heroClientMeta?.logoUrl ? (
                    <ImageWithFallback
                      src={detail.heroClientMeta.logoUrl}
                      alt={`${detail.heroClientName} logo`}
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No Logo
                    </div>
                  )}

                  <div>
                    <h3 className="mb-0" style={{ color: "#391B66" }}>
                      {detail.heroClientName}
                    </h3>
                    <p className="text-sm mb-0" style={{ color: "#E64761" }}>
                      {detail.heroClientIndustry}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <MetaRow iconKey="Building2" text={detail.heroClientMeta.hqText} />
                  <MetaRow iconKey="Users" text={detail.heroClientMeta.peopleText} />
                  <MetaRow iconKey="Target" text={detail.heroClientMeta.specialtyText} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function MetaRow({ iconKey, text }: { iconKey: string; text: string }) {
  const Comp = (LucideIcons as Record<string, unknown>)[iconKey] as
    | React.ComponentType<{ className?: string; size?: number }>
    | undefined;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#E64761" }}
      >
        {Comp ? <Comp className="w-4 h-4 text-white" size={16} /> : null}
      </div>
      <p className="text-sm mb-0" style={{ color: "#391B66" }}>
        {text}
      </p>
    </div>
  );
}

function TeamInvolved({ detail }: { detail: DedicatedResourceCaseStudyDetail }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold text-black">{detail.teamTitle}</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">{detail.teamSubtitle}</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="relative bg-gradient-to-r from-[#321a66] to-[#ee4962] h-[68px] flex items-center justify-between px-6">
              <p className="text-sm text-white/90">{detail.teamBannerLeftText}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-sm text-green-300">{detail.teamBannerStatusText}</p>
              </div>
            </div>

            <div className="relative py-8 px-6">
              <div className="flex flex-wrap justify-center items-center gap-12">
                {(detail.teamMembers ?? []).map((m, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-gray-100">
                      {m.imageUrl ? (
                        <ImageWithFallback src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1 text-center">{m.name}</p>
                    <p className="text-xs text-[#ee4962] text-center">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-gray-200 py-6 px-6">
              <div className="flex flex-wrap justify-center items-center gap-12">
                {(detail.teamStats ?? []).map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <p className={`text-2xl font-bold ${s.colorClass ?? "text-[#391B66]"} mb-1`}>{s.value}</p>
                    <p className="text-xs text-gray-600 text-center">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function PartnershipChallenge({
  detail,
  IconRenderer,
}: {
  detail: DedicatedResourceCaseStudyDetail;
  IconRenderer: IconRenderer;
}) {
  const steps = (detail.evolutionSteps ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 rounded-2xl p-8 -mt-12" style={{ backgroundColor: "#F8F8FF" }}>
            <div>
              <h1 className="mb-6 text-4xl font-bold" style={{ color: "#391B66" }}>
                {detail.challengeTitle}
              </h1>
              <p className="text-lg text-neutral-600 mb-8 text-[15px]">{detail.challengeBody}</p>

              <div className="space-y-4">
                <p className="mb-4" style={{ color: "#391B66" }}>
                  {detail.challengeImpactTitle}
                </p>

                {(detail.challengeImpactBullets ?? []).map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#ee4962" }}>
                      <IconRenderer iconKey={b.iconKey} className="w-5 h-5 text-white" size={20} />
                    </div>
                    <p className="text-neutral-600 text-sm pt-2">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-[20px] shadow-lg overflow-hidden h-full">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFE7EC" }}>
                      <IconRenderer iconKey="TrendingDown" className="w-7 h-7" size={28} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: "#2E005E" }}>
                      {detail.prePartnershipTitle}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {(detail.prePartnershipMetrics ?? []).map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFE7EC" }}>
                            <IconRenderer iconKey={m.iconKey} className="w-6 h-6" size={24} />
                          </div>
                          <span className="text-gray-700 text-sm font-medium">{m.label}</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl -z-10 opacity-20" style={{ background: "#ee4962" }} />
            </div>
          </div>

          {/* Evolution header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: "#391B66" }}>
              {detail.evolutionTitle}
            </h2>
            <p className="text-xl text-center text-neutral-600 max-w-3xl mx-auto">
              {detail.evolutionSubtitle}
            </p>
          </div>

          {/* Evolution cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border-2 border-neutral-200 transition-all hover:border-[#ee4962] hover:shadow-xl h-full flex flex-col">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4"
                  style={{ backgroundColor: step.colorClass ? undefined : index === 0 ? "#391B66" : index === 1 ? "#ee4962" : "#7C3AED" }}
                >
                  {step.numberText}
                </div>

                <h3 className="mb-2 text-xl font-bold" style={{ color: "#391B66" }}>
                  {step.title}
                </h3>

                <p className="text-sm font-semibold mb-6" style={{ color: "#ee4962" }}>
                  {step.subtitle}
                </p>

                <div className="space-y-4 flex-grow">
                  {(step.features ?? []).map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#391B66" }}>
                        <IconRenderer iconKey={f.iconKey} className="w-4 h-4 text-white" size={16} />
                      </div>
                      <p className="text-neutral-700 text-sm leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA mini block */}
          <div className="mt-16 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(to right, #321a66, #ee4962)" }}>
            <div className="text-center px-6 py-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Need a Dedicated Team Like {detail.heroClientName}?
              </h2>
              <p className="text-xl text-white/90 mx-auto mb-8 leading-7 max-w-3xl">
                Book a free strategy call and see how an embedded team could plug into your agency workflow within days.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <BookCallButtonWithModal
                  buttonLabel="Book Your Strategy Call"
                  className="bg-white rounded-md px-6 py-3 font-medium text-sm transition-all hover:shadow-lg"
                  buttonSize="default"
                  defaultServiceType="Dedicated Team / White Label"
                />
                <button className="border border-white text-white rounded-md px-6 py-3 font-medium text-sm transition-all hover:bg-white/10">
                  Get Team Pricing
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function PartnershipEvolution({
  detail,
  IconRenderer,
}: {
  detail: DedicatedResourceCaseStudyDetail;
  IconRenderer: IconRenderer;
}) {
  const stats = detail.heroStats ?? [];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-6 font-bold text-3xl" style={{ color: "#391B66" }}>
              Transformational Results
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Measurable impact through dedicated team partnership
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.slice(0, 4).map((s, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border-2 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#ee496220" }}>
                  <IconRenderer iconKey={s.iconKey} className="w-4 h-4" size={16} />
                </div>
                <div className="font-bold mb-1" style={{ color: "#391B66", fontSize: "24px" }}>
                  {s.value}
                </div>
                <h3 className="text-xs font-semibold mb-1" style={{ color: "#391B66" }}>
                  {s.label}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function SuccessFactors({
  detail,
  IconRenderer,
}: {
  detail: DedicatedResourceCaseStudyDetail;
  IconRenderer: IconRenderer;
}) {
  const factors = detail.successFactors ?? [];

  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#391B66" }}>
              {detail.successFactorsTitle}
            </h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">
              {detail.successFactorsSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factors.map((f, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${f.gradientClass ?? "from-[#391B66] to-[#E64761]"}`}>
                  <IconRenderer iconKey={f.iconKey} className="w-6 h-6 text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#391B66" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ detail }: { detail: DedicatedResourceCaseStudyDetail }) {
  const rows = detail.beforeAfterRows ?? [];

  return (
    <section className="py-24 bg-[rgb(250,250,250)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="mb-4 font-bold text-3xl" style={{ color: "#ee4962" }}>
              {detail.beforeAfterTitle}
            </h3>
            <p className="text-neutral-600">{detail.beforeAfterSubtitle}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-pink-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#391B66" }}>
                    <th className="text-left px-6 py-4 text-white font-semibold">Key Metric</th>
                    <th className="text-left px-6 py-4 text-white font-semibold">Before</th>
                    <th className="text-left px-6 py-4 text-white font-semibold">After</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className={idx !== rows.length - 1 ? "border-b border-pink-200" : ""}>
                      <td className="px-6 py-4 font-semibold text-black">{r.keyMetric}</td>
                      <td className="px-6 py-4 text-[rgb(238,73,98)]">{r.before}</td>
                      <td className="px-6 py-4 font-semibold text-black">{r.after}</td>
                    </tr>
                  ))}
                  {rows.length === 0 ? (
                    <tr>
                      <td className="px-6 py-6 text-sm text-gray-500" colSpan={3}>
                        No Before/After rows added yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ClientFeedback({ detail }: { detail: DedicatedResourceCaseStudyDetail }) {
  const testimonials = detail.testimonials ?? [];
  const primary = testimonials[0];
  const vt = detail.videoTestimonial;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-6 font-bold" style={{ color: "#391B66", fontSize: "2.5rem" }}>
              {detail.feedbackTitle}
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">{detail.feedbackSubtitle}</p>
          </div>

          {/* Primary testimonial */}
          <div className="mb-10">
            <div className="bg-white p-8 rounded-2xl border border-pink-200 relative hover:shadow-xl transition-shadow flex items-center gap-8">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#ee4962" }}>
                <LucideIcons.Quote className="w-6 h-6 text-white" />
              </div>

              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                {primary?.imageUrl ? (
                  <ImageWithFallback src={primary.imageUrl} alt={primary.author} className="w-full h-full object-cover" />
                ) : null}
              </div>

              <div className="flex-1">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: primary?.rating ?? 0 }).map((_, i) => (
                    <LucideIcons.Star
                      key={i}
                      className="w-5 h-5"
                      style={{ fill: "#ee4962", color: "#ee4962" }}
                    />
                  ))}
                </div>

                <p className="text-neutral-700 mb-4 leading-relaxed">
                  {primary ? `“${primary.quote}”` : "No testimonial added yet."}
                </p>

                {primary ? (
                  <div>
                    <div style={{ color: "#391B66" }}>{primary.author}</div>
                    <div style={{ color: "#ee4962" }}>{primary.role}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Video block */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#391B66" }}>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto relative">
                <img
                  src={
                    vt?.thumbnailUrl ||
                    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=700&fit=crop"
                  }
                  alt="Video testimonial"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(57, 27, 102, 0.5), transparent)" }} />
                <button
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "#ee4962" }}
                  onClick={() => {
                    if (vt?.videoUrl) window.open(vt.videoUrl, "_blank");
                  }}
                >
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                </button>
              </div>

              <div className="p-10 lg:p-12 flex flex-col justify-center">
                <LucideIcons.Quote className="w-12 h-12 mb-6" style={{ color: "#ee4962" }} />
                <h3 className="text-white mb-4">{vt?.title || "Watch the Full Story"}</h3>
                <p className="text-neutral-300 mb-6">
                  {vt?.description ||
                    "See how our partnership transformed operations from the perspective of their leadership team."}
                </p>
                <button
                  className="inline-flex items-center gap-2"
                  style={{ color: "#ee4962" }}
                  onClick={() => {
                    if (vt?.videoUrl) window.open(vt.videoUrl, "_blank");
                  }}
                >
                  <span>Play Video</span>
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-current border-b-4 border-b-transparent ml-0.5" />
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function CTASection({
  variant = "primary",
  detail,
}: {
  variant?: "primary" | "secondary";
  detail: DedicatedResourceCaseStudyDetail;
}) {
  if (variant === "primary") {
    return (
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(to bottom right, #391B66, #E64761)" }}>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="mb-6 font-bold text-[24px]">{detail.ctaPrimary.title}</h2>
            <p className="text-xl mb-8 text-pink-50 max-w-2xl mx-auto">{detail.ctaPrimary.body}</p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-lg hover:bg-pink-50 transition-colors"
                style={{ color: "#391B66" }}
                onClick={() => {
                  if (detail.ctaPrimary.primaryButtonHref) window.location.assign(detail.ctaPrimary.primaryButtonHref);
                }}
              >
                {detail.ctaPrimary.primaryButtonText}
                <LucideIcons.ArrowRight className="w-5 h-5" />
              </button>

              {detail.ctaPrimary.secondaryButtonText ? (
                <button
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white rounded-lg border-2 border-white hover:bg-white hover:text-[#391B66] transition-colors"
                  onClick={() => {
                    if (detail.ctaPrimary.secondaryButtonHref) window.location.assign(detail.ctaPrimary.secondaryButtonHref);
                  }}
                >
                  {detail.ctaPrimary.secondaryButtonText}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#391B66" }}>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="mb-6 font-bold text-[24px]">{detail.ctaSecondary.title}</h2>
              <p className="text-xl text-neutral-300 mb-8">{detail.ctaSecondary.body}</p>

              <div className="space-y-4">
                {detail.ctaSecondary.emailValue ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#ee4962" }}>
                      <LucideIcons.Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-neutral-400">{detail.ctaSecondary.emailLabel || "Email Us"}</div>
                      <div className="text-white">{detail.ctaSecondary.emailValue}</div>
                    </div>
                  </div>
                ) : null}

                {detail.ctaSecondary.phoneValue ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#ee4962" }}>
                      <LucideIcons.Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-neutral-400">{detail.ctaSecondary.phoneLabel || "Call Us"}</div>
                      <div className="text-white">{detail.ctaSecondary.phoneValue}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl">
              <h3 className="mb-6 text-center" style={{ color: "#391B66" }}>
                {detail.ctaSecondary.formTitle || "Schedule Strategy Call"}
              </h3>

              <BookCallButtonWithModal
                buttonLabel="Schedule Strategy Call"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-lg transition-colors bg-[#ee4962]"
                buttonSize="lg"
                defaultServiceType="Dedicated Team / White Label"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
