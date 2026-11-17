import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import * as LucideIcons from "lucide-react";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import { LazyYouTube } from "@/components/LazyYouTube";
import { Helmet } from "react-helmet";
import BrandingBeezLoader from "@/components/BeeLoadingScreen";
import { SEO } from "@/hooks/SEO";

/* =========================
   Types (match schema)
   ========================= */

type PpcResultItem = {
    key: string;
    label: string;
    value: string;
    colorClass?: string;
};

type PpcCaseStudyCard = {
    _id: string;
    slug: string;
    title: string;
    client: string;
    industry: string;
    description: string;
    results: PpcResultItem[];
    coverImageUrl?: string;
    coverImageAlt?: string;
    coverFit?: "contain" | "cover";
};

type HeroStat = { value: string; label: string; iconKey?: string };

type InfoCard = {
    iconKey: string;
    title: string;
    value: string;
    href?: string;
    colorClass?: string; // you store tailwind classes here
};

type SectionCard = {
    iconKey: string;
    title: string;
    description: string;
    colorClass?: string; // optional
};

type BulletSection = {
    iconKey: string;
    title: string;
    bullets: string[];
    colorClass?: string;
};

type DashboardStat = { iconKey: string; label: string; value: string };
type HighlightMetric = { label: string; value: string; subtext?: string };

type OutstandingCard = {
    iconKey: string;
    value: string;
    title: string;
    description: string;
    colorClass?: string;
};

type TimelineStep = {
    order: number;
    badgeText: string;
    title: string;
    description: string;
    colorClass?: string;
};

type ProcessStep = { order: number; title: string; description: string };

type PpcSeoMeta = {
    metaTitle?: string;
    metaDescription?: string;
};

type PpcCaseStudyDetail = {
    cardId: string;

    heroBadgeText: string;
    heroClientName: string;
    heroRatingText?: string;
    heroDescription: string;
    heroStats: HeroStat[];
    heroPrimaryCtaText: string;
    heroPrimaryCtaHref?: string;

    heroVideoUrl?: string;
    heroVideoPoster?: string;
    heroVideoBadgeText?: string;

    clientProfileTitle: string;
    clientProfileSubtitle: string;
    clientProfileCards: InfoCard[];

    challengeTitle: string;
    challengeSubtitle: string;
    challengeCards: SectionCard[];

    approachTitle: string;
    approachSubtitle: string;
    approachSections: BulletSection[];

    dashboardTitle: string;
    dashboardSubtitle: string;
    dashboardStats: DashboardStat[];
    dashboardHighlight: HighlightMetric;

    outstandingTitle: string;
    outstandingSubtitle: string;
    outstandingCards: OutstandingCard[];

    timelineTitle: string;
    timelineSteps: TimelineStep[];

    processTitle: string;
    processSubtitle: string;
    processSteps: ProcessStep[];

    midCtaTitle: string;
    midCtaBody: string;
    midPrimaryCtaText: string;
    midPrimaryCtaHref?: string;
    midSecondaryCtaText?: string;
    midSecondaryCtaHref?: string;

    bottomCtaTitle: string;
    bottomCtaBody: string;
    bottomPrimaryCtaText: string;
    bottomPrimaryCtaHref?: string;
    bottomSecondaryCtaText?: string;
    bottomSecondaryCtaHref?: string;

    seo?: PpcSeoMeta;
};

type PpcCaseStudyCombined = {
    card: PpcCaseStudyCard;
    detail?: PpcCaseStudyDetail;
};

/* =========================
   Helpers
   ========================= */

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

    const pick = (k: any) => (LucideIcons as any)[k] as React.ComponentType<any> | undefined;

    if (!key) {
        const Fallback = pick(fallbackKey);
        return Fallback ? <Fallback className={className} size={size} /> : null;
    }

    const Comp = pick(key);
    if (!Comp) {
        const Fallback = pick(fallbackKey);
        return Fallback ? <Fallback className={className} size={size} /> : null;
    }

    return <Comp className={className} size={size} />;
}

function extractYouTubeId(url?: string): string {
    if (!url) return "";
    try {
        const u = new URL(url);

        if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "").trim();
        if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";

        return "";
    } catch {
        return "";
    }
}

function sortByOrder<T extends { order: number }>(arr: T[]) {
    return [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/* =========================
   Page
   ========================= */

export default function PpcCaseStudySlugPage(props: any) {
    const [, setLocation] = useLocation();

    const route = useRoute("/ppc-case-study/:slug");
    const slugFromRoute = route[0] ? route[1]?.slug : undefined;
    const slugFromProps = props?.params?.slug;
    const slug = (slugFromProps ?? slugFromRoute ?? "").trim();

    const [data, setData] = useState<PpcCaseStudyCombined | null>(null);
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

                const res = await fetch(`/api/ppc-case-study/${encodeURIComponent(slug)}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("PPC case study not found");
                    throw new Error(`Failed to load PPC case study: ${res.status} ${res.statusText}`);
                }

                const json = (await res.json()) as PpcCaseStudyCombined;
                if (cancelled) return;
                setData(json);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Unable to load PPC case study");
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

    const heroStats = useMemo(() => detail?.heroStats ?? [], [detail]);
    const results = useMemo(() => card?.results ?? [], [card]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
                <BrandingBeezLoader />
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
                <div className="text-red-500 font-semibold mb-2">{error ?? "Unable to load PPC case study"}</div>
                <button
                    className="mt-2 px-5 py-2 rounded-lg bg-[#ee4962] text-white font-semibold"
                    onClick={() => setLocation("/")}
                >
                    Go Home
                </button>
            </div>
        );
    }

    const hasDetail = Boolean(detail);

    const seoTitle =
        detail?.seo?.metaTitle || detail?.heroClientName || card.client || "Google Ads Case Study";

    return (
        <>
            <SEO
                title={`${seoTitle} | BrandingBeez Case Study`}
                description={detail?.seo?.metaDescription || detail?.heroDescription || card.description}
            />

            <Helmet>
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${seoTitle} | BrandingBeez`} />
                <meta
                    property="og:description"
                    content={detail?.seo?.metaDescription || detail?.heroDescription || card.description}
                />
            </Helmet>

            <div className="min-h-screen bg-white">
                {/* HERO */}
                <section className="relative bg-gradient-to-r from-brand-purple to-brand-coral py-[113px] px-[32px]">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="px-[0px] py-[18px] mx-[0px] my-[-130px]">
                                <div className="inline-flex bg-[#ee4962] text-white px-[24px] py-[3px] rounded-full items-center gap-2">
                                    <IconByKey iconKey="Award" size={20} className="text-white" />
                                    {detail?.heroBadgeText ?? "Featured Google Ads Success Story"}
                                </div>

                                <h1 className="text-white mb-[24px] text-[36px] font-bold mt-[19px] mr-[0px] ml-[0px]">
                                    {detail?.heroClientName ?? card.client}
                                </h1>

                                <div className="flex items-center gap-2 mb-4 text-white/90">
                                    <span className="text-xl text-[16px]">
                                        {detail?.heroRatingText ?? "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by 25+ Agencies"}
                                    </span>
                                </div>

                                <p className="text-white text-xl mb-8">{detail?.heroDescription ?? card.description}</p>

                                {/* hero stats (fallback from card results) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-[24px] mt-[51px] max-w-3xl">
                                    {(heroStats.length
                                        ? heroStats
                                        : results.slice(0, 3).map((r) => ({
                                            value: r.value,
                                            label: r.label,
                                            iconKey: "CheckCircle2",
                                        }))
                                    )
                                        .slice(0, 3)
                                        .map((s, idx) => (
                                            <div
                                                key={`${s.label}-${idx}`}
                                                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="w-12 h-12 bg-[#ee4962] rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <IconByKey
                                                        iconKey={s.iconKey ?? (idx === 1 ? "TrendingUp" : "CheckCircle2")}
                                                        className="text-white"
                                                        size={20}
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-900 mb-1 font-bold text-[16px]">{s.value}</div>
                                                    <div className="text-gray-600 text-sm">{s.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <BookCallButtonWithModal
                                    buttonLabel={detail?.heroPrimaryCtaText ?? "Book a Free Strategy Call"}
                                    className="px-8 py-4 bg-[#ee4b64] text-white font-bold rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
                                    buttonSize="lg"
                                    defaultServiceType="Google Ads"
                                />
                            </div>

                            {/* VIDEO */}
                            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl self-start -mt-8">
                                {detail?.heroVideoUrl ? (
                                    <LazyYouTube
                                        videoId={extractYouTubeId(detail.heroVideoUrl)}
                                        className="w-full h-full"
                                        thumbnailQuality="hqdefault"
                                        aspectRatio="16/9"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                                        Video not provided
                                    </div>
                                )}
                            </div>
                        </div>

                        {!hasDetail ? (
                            <div className="mt-10 bg-white/10 border border-white/20 text-white rounded-xl p-4">
                                Detail content not added yet for this PPC case study. (Card data loaded ✅)
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* CLIENT PROFILE */}
                <section className="py-20 px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-center mb-4 text-gray-900 text-[24px] font-bold">
                            {detail?.clientProfileTitle ?? "Client Profile"}
                        </h2>
                        <p className="text-center text-gray-600 text-xl mb-12 max-w-3xl mx-auto">
                            {detail?.clientProfileSubtitle ?? ""}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(detail?.clientProfileCards ?? []).map((c, idx) => {
                                const wrapper =
                                    c.colorClass ??
                                    "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400";

                                return (
                                    <div
                                        key={`${c.title}-${idx}`}
                                        className={`group relative bg-gradient-to-br rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${wrapper}`}
                                    >
                                        <div className="relative flex items-start gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-[#321a66] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                                                <IconByKey iconKey={c.iconKey} className="text-white" size={26} />
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <h3 className="text-gray-900 mb-1">{c.title}</h3>
                                                {c.href ? (
                                                    <a
                                                        href={c.href}
                                                        target={c.href.startsWith("/") ? "_self" : "_blank"}
                                                        rel="noreferrer"
                                                        className="text-blue-700 hover:text-blue-900 transition-colors"
                                                    >
                                                        {c.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-purple-800">{c.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CHALLENGE */}
                <section className="py-20 px-8 bg-[rgb(245,245,245)]">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-center mb-4 text-gray-900 text-[24px] font-bold">
                            {detail?.challengeTitle ?? "The Challenge"}
                        </h2>
                        <p className="text-center text-gray-600 text-xl mb-16 max-w-3xl mx-auto">
                            {detail?.challengeSubtitle ?? ""}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {(detail?.challengeCards ?? []).map((x, idx) => {
                                const borderClass = x.colorClass ?? "border-red-500";
                                return (
                                    <div
                                        key={`${x.title}-${idx}`}
                                        className={`group relative bg-white border-l-4 ${borderClass} rounded-r-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-[#ee4962] to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                                <IconByKey iconKey={x.iconKey} className="text-white" size={36} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-gray-900 mb-3">{x.title}</h3>
                                                <p className="text-gray-600">{x.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* APPROACH */}
                <section className="py-20 px-8 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-center mb-4 text-gray-900 text-[24px] font-bold">
                            {detail?.approachTitle ?? "Our Strategic Approach"}
                        </h2>
                        <p className="text-center text-gray-600 text-xl mb-16 max-w-3xl mx-auto">
                            {detail?.approachSubtitle ?? ""}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {(detail?.approachSections ?? []).map((sec, idx) => (
                                <div
                                    key={`${sec.title}-${idx}`}
                                    className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm"
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#ee4962] to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                            <IconByKey iconKey={sec.iconKey} className="text-white" size={22} />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="text-gray-900">{sec.title}</h3>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 text-gray-600">
                                        {sec.bullets.map((b, i) => (
                                            <li key={`${idx}-${i}`} className="flex items-center gap-3">
                                                <IconByKey iconKey="ArrowRight" className="text-[#ee4962] flex-shrink-0" size={16} />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* DASHBOARD */}
                <DashboardSection detail={detail} />

                {/* ✅ OUTSTANDING RESULTS (MISSING BEFORE) */}
                <OutstandingResultsSection detail={detail} />

                {/* ✅ TIMELINE (MISSING BEFORE) */}
                <TimelineSection detail={detail} />

                {/* ✅ PROCESS (MISSING BEFORE) */}
                <ProvenProcessSection detail={detail} />

                {/* ✅ MID CTA (MISSING BEFORE) */}
                {/* <MidCtaSection detail={detail} /> */}

                {/* BOTTOM CTA */}
                <BottomCtaSection detail={detail} />
            </div>
        </>
    );
}

/* =========================
   Sections
   ========================= */

function DashboardSection({ detail }: { detail?: PpcCaseStudyDetail }) {
    const stats = detail?.dashboardStats ?? [];
    const highlight = detail?.dashboardHighlight;

    return (
        <section className="py-20 px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center mb-4 text-gray-900 font-bold text-[24px]">
                    {detail?.dashboardTitle ?? "Google Ads Dashboard Results"}
                </h2>
                <p className="text-center text-gray-600 text-xl mb-12">{detail?.dashboardSubtitle ?? ""}</p>

                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        {stats.slice(0, 4).map((s, idx) => (
                            <div key={`${s.label}-${idx}`} className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="mb-2">
                                    <IconByKey iconKey={s.iconKey} className="mx-auto text-[#321a66]" size={32} />
                                </div>
                                <div className="text-gray-900 mb-1">{s.label}</div>
                                <div className="text-gray-600">{s.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                        <div className="text-gray-900 mb-2">{highlight?.label ?? "Average Cost Per Acquisition"}</div>
                        <div className="text-5xl text-[#ee4962] mb-4 font-bold">{highlight?.value ?? "—"}</div>
                        <div className="text-gray-600">{highlight?.subtext ?? ""}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function OutstandingResultsSection({ detail }: { detail?: PpcCaseStudyDetail }) {
    const cards = detail?.outstandingCards ?? [];
    if (!detail?.outstandingTitle && cards.length === 0) return null;

    return (
        <section className="py-20 px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center mb-4 text-gray-900 font-bold text-[24px]">
                    {detail?.outstandingTitle ?? "Outstanding Results"}
                </h2>
                <p className="text-center text-gray-600 text-xl mb-16">
                    {detail?.outstandingSubtitle ?? ""}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cards.map((c, idx) => {
                        const box = c.colorClass ?? "bg-white border-2 border-gray-200";
                        return (
                            <div key={`${c.title}-${idx}`} className={`${box} rounded-lg p-8 text-center`}>
                                <div className="w-16 h-16 bg-[#ee4962] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IconByKey iconKey={c.iconKey} className="text-white" size={32} />
                                </div>
                                <div className="text-5xl text-gray-900 mb-2 text-[36px] font-bold">{c.value}</div>
                                <div className="text-gray-900 mb-2">{c.title}</div>
                                <p className="text-gray-600">{c.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function TimelineSection({ detail }: { detail?: PpcCaseStudyDetail }) {
    const steps = detail?.timelineSteps ? sortByOrder(detail.timelineSteps) : [];
    if (!detail?.timelineTitle && steps.length === 0) return null;

    return (
        <section className="py-20 px-8 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-center mb-10 text-gray-900 font-bold text-[24px]">
                    {detail?.timelineTitle ?? "Campaign Timeline"}
                </h2>

                <div className="relative py-6">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -translate-y-1/2" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {steps.slice(0, 4).map((s, idx) => {
                            const isTop = idx % 2 === 0;
                            const nodeClass =
                                s.colorClass ?? "from-[#FF6A88] to-[#FF99AC]";

                            return (
                                <div key={`${s.title}-${idx}`} className="flex flex-col items-center">
                                    {isTop ? (
                                        <>
                                            <div className="bg-white rounded-[24px] p-6 shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
                                                <div className={`inline-block bg-gradient-to-r ${nodeClass} text-white px-4 py-2 rounded-full mb-4 shadow-md`}>
                                                    {s.badgeText}
                                                </div>
                                                <h3 className="text-gray-900 mb-2">{s.title}</h3>
                                                <p className="text-gray-600 text-sm">{s.description}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${nodeClass} border-4 border-white shadow-lg relative z-10`} />
                                        </>
                                    ) : (
                                        <>
                                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${nodeClass} border-4 border-white shadow-lg mb-8 relative z-10`} />
                                            <div className="bg-white rounded-[24px] p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                                <div className={`inline-block bg-gradient-to-r ${nodeClass} text-white px-4 py-2 rounded-full mb-4 shadow-md`}>
                                                    {s.badgeText}
                                                </div>
                                                <h3 className="text-gray-900 mb-2">{s.title}</h3>
                                                <p className="text-gray-600 text-sm">{s.description}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProvenProcessSection({ detail }: { detail?: PpcCaseStudyDetail }) {
    const steps = detail?.processSteps ? sortByOrder(detail.processSteps) : [];
    if (!detail?.processTitle && steps.length === 0) return null;

    return (
        <section className="py-20 px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center mb-6 text-gray-900 font-bold text-[24px]">
                    {detail?.processTitle ?? "Our Proven Process"}
                </h2>
                <p className="text-center text-gray-600 text-xl mb-16 max-w-3xl mx-auto">
                    {detail?.processSubtitle ?? ""}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.slice(0, 4).map((s, idx) => (
                        <div key={`${s.title}-${idx}`} className="text-center relative">
                            <div className="w-16 h-16 bg-[#ee4962] text-white rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                                <span className="text-2xl">{s.order ?? idx + 1}</span>
                            </div>

                            {idx < steps.length - 1 ? (
                                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%+2rem)] h-0.5 bg-gradient-to-r from-[#ee4962] to-[#ee4962] opacity-30" />
                            ) : null}

                            <h3 className="text-gray-900 mb-3">{s.title}</h3>
                            <p className="text-gray-600">{s.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// function MidCtaSection({ detail }: { detail?: PpcCaseStudyDetail }) {
//     if (!detail?.midCtaTitle && !detail?.midCtaBody) return null;

//     return (
//         <section className="py-[27px] px-[32px] bg-gradient-to-r from-[#321a66] to-[#ee4962]">
//             <div className="max-w-4xl mx-auto text-center">
//                 <h2 className="text-white mb-6 font-bold">{detail?.midCtaTitle ?? "Ready to Achieve Similar Results?"}</h2>
//                 <p className="text-white text-xl mb-8">{detail?.midCtaBody ?? ""}</p>

//                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                     <BookCallButtonWithModal
//                         buttonLabel={detail?.midPrimaryCtaText ?? "Book a Strategy Consultation"}
//                         className="bg-white text-[#ee4962] px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
//                         buttonSize="lg"
//                         defaultServiceType="Google Ads"
//                     />

//                     {detail?.midSecondaryCtaText ? (
//                         <button
//                             className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-md hover:bg-white hover:text-[#ee4962] transition-colors"
//                             onClick={() => {
//                                 const href = detail?.midSecondaryCtaHref;
//                                 if (!href) return;
//                                 if (href.startsWith("/")) window.location.assign(href);
//                                 else window.open(href, "_blank", "noopener,noreferrer");
//                             }}
//                         >
//                             {detail.midSecondaryCtaText}
//                         </button>
//                     ) : null}
//                 </div>
//             </div>
//         </section>
//     );
// }

function BottomCtaSection({ detail }: { detail?: PpcCaseStudyDetail }) {
    return (
        <section className="py-[36px] px-[32px] bg-gradient-to-r from-[#ee4962] to-[#ee4962]">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-white mb-6 font-bold">
                    {detail?.bottomCtaTitle ?? "Ready to Achieve Similar Results?"}
                </h2>
                <p className="text-white text-xl mb-8">{detail?.bottomCtaBody ?? ""}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <BookCallButtonWithModal
                        buttonLabel={detail?.bottomPrimaryCtaText ?? "Book Your Strategy Call"}
                        className="bg-white hover:bg-white/30 text-brand-coral border border-white/30 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base"
                        buttonSize="lg"
                        defaultServiceType="Google Ads"
                    />

                    {detail?.bottomSecondaryCtaText ? (
                        <button
                            className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-md hover:bg-white hover:text-[#ee4962] transition-colors"
                            onClick={() => {
                                const href = detail?.bottomSecondaryCtaHref;
                                if (!href) return;
                                if (href.startsWith("/")) window.location.assign(href);
                                else window.open(href, "_blank", "noopener,noreferrer");
                            }}
                        >
                            {detail.bottomSecondaryCtaText}
                        </button>
                    ) : (
                        <button className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-md hover:bg-gray-100 hover:text-[#ee4962] transition-colors">
                            Get Started Today
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
