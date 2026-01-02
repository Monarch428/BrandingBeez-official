import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import * as LucideIcons from "lucide-react";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import { LazyYouTube } from "@/components/LazyYouTube";
import { Helmet } from "react-helmet";

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
    colorClass?: string;
};

type SectionCard = {
    iconKey: string;
    title: string;
    description: string;
    colorClass?: string;
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
}

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

// ✅ Dynamic Lucide icon renderer
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

    if (!key) {
        const Fallback = LucideIcons[fallbackKey] as any;
        return Fallback ? <Fallback className={className} size={size} /> : null;
    }

    const Comp = (LucideIcons as any)[key] as React.ComponentType<any> | undefined;

    if (!Comp) {
        const Fallback = LucideIcons[fallbackKey] as any;
        return Fallback ? <Fallback className={className} size={size} /> : null;
    }

    return <Comp className={className} size={size} />;
}

// ---------- iframe helper (supports youtube watch links) ----------
function toEmbedUrl(url: string): string {
    try {
        const u = new URL(url);

        // YouTube
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

        // Vimeo basic
        if (u.hostname.includes("vimeo.com")) {
            const id = u.pathname.split("/").filter(Boolean).pop();
            if (id) return `https://player.vimeo.com/video/${id}`;
            return url;
        }

        // default: assume already embeddable
        return url;
    } catch {
        return url;
    }
}

function CtaButton({
    text,
    href,
    variant = "primary",
}: {
    text: string;
    href?: string;
    variant?: "primary" | "secondary" | "hero";
}) {
    const [, setLocation] = useLocation();

    const cls =
        variant === "hero"
            ? "px-8 py-4 bg-[#ee4b64] text-white font-bold rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
            : variant === "secondary"
                ? "bg-transparent text-white border-2 border-white px-8 py-3 rounded-md hover:bg-white hover:text-[#ee4962] transition-colors"
                : "bg-white text-[#ee4962] px-8 py-3 rounded-md hover:bg-gray-100 transition-colors";

    return (
        <button
            className={cls}
            onClick={() => {
                if (href && href.startsWith("/")) return setLocation(href);
                if (href) return window.open(href, "_blank", "noopener,noreferrer");
            }}
        >
            {text}
            {variant === "hero" ? <IconByKey iconKey="ArrowRight" className="w-5 h-5" size={20} /> : null}
        </button>
    );
}

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
                Loading PPC case study…
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

    const heroCtaClass =
        "px-8 py-4 bg-[#ee4b64] text-white font-bold rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2";

    function extractYouTubeId(url?: string): string {
        if (!url) return "";
        try {
            const u = new URL(url);

            if (u.hostname.includes("youtu.be")) {
                return u.pathname.replace("/", "");
            }

            if (u.hostname.includes("youtube.com")) {
                return u.searchParams.get("v") || "";
            }

            return "";
        } catch {
            return "";
        }
    }

    return (
        <>
            <Helmet>
                <title>
                    {`${detail?.seo?.metaTitle} | Google Ads Case Study | BrandingBeez`}
                </title>

                <meta
                    name="description"
                    content={
                        detail?.seo?.metaDescription ||
                        detail?.heroDescription ||
                        card.description
                    }
                />
            </Helmet>

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-brand-purple to-brand-coral py-[113px] px-[32px]">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
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

                                <p className="text-white text-xl mb-8">
                                    {detail?.heroDescription ?? card.description}
                                </p>

                                {/* Hero Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-[24px] mt-[51px] mr-[0px] ml-[0px] px-[0px] py-[-127px] max-w-3xl pt-[0px] pr-[0px] pb-[-85px] pl-[0px]">
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
                                                    <div className="text-gray-900 mb-1 font-bold text-[16px]">
                                                        {s.value}
                                                    </div>
                                                    <div className="text-gray-600 text-sm">{s.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* <CtaButton
                variant="hero"
                text={detail?.heroPrimaryCtaText ?? "Schedule a Free Consultation"}
                href={detail?.heroPrimaryCtaHref ?? "/contact"}
              /> */}
                                <BookCallButtonWithModal
                                    buttonLabel={detail?.heroPrimaryCtaText ?? "Book a Free Strategy Call"}
                                    className={heroCtaClass ?? "bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"}
                                    buttonSize="lg"
                                    defaultServiceType="Google Ads"
                                />
                            </div>

                            {/* Right Video */}
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

                {/* Client Profile */}
                <section className="py-20 px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-center mb-4 text-gray-900 text-[24px] font-bold">
                            {detail?.clientProfileTitle ?? "Client Profile"}
                        </h2>
                        <p className="text-center text-gray-600 text-xl mb-12 max-w-3xl mx-auto">
                            {detail?.clientProfileSubtitle ?? ""}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(detail?.clientProfileCards ?? []).map((c, idx) => (
                                <div
                                    key={`${c.title}-${idx}`}
                                    className={`group relative bg-gradient-to-br rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${c.colorClass ?? "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400"
                                        }`}
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
                            ))}
                        </div>
                    </div>
                </section>

                {/* Challenge */}
                <section className="py-20 px-8 bg-[rgb(245,245,245)]">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-center mb-4 text-gray-900 text-[24px] font-bold">
                            {detail?.challengeTitle ?? "The Challenge"}
                        </h2>
                        <p className="text-center text-gray-600 text-xl mb-16 max-w-3xl mx-auto">
                            {detail?.challengeSubtitle ?? ""}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {(detail?.challengeCards ?? []).map((x, idx) => (
                                <div
                                    key={`${x.title}-${idx}`}
                                    className="group relative bg-white border-l-4 border-red-500 rounded-r-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                            <IconByKey iconKey={x.iconKey} className="text-white" size={36} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-gray-900 mb-3">{x.title}</h3>
                                            <p className="text-gray-600">{x.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Approach */}
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
                                <div key={`${sec.title}-${idx}`} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
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

                {/* Dashboard */}
                <DashboardSection detail={detail} />

                {/* Bottom CTA */}
                <section className="py-[36px] px-[32px] bg-gradient-to-r from-[#ee4962] to-[#ee4962]">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-white mb-6 font-bold">
                            {detail?.bottomCtaTitle ?? "Ready to Achieve Similar Results?"}
                        </h2>
                        <p className="text-white text-xl mb-8">{detail?.bottomCtaBody ?? ""}</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {/* <CtaButton
                            variant="primary"
                            text={detail?.bottomPrimaryCtaText ?? "Book Your Strategy Call"}
                            href={detail?.bottomPrimaryCtaHref ?? "/contact"}
                        /> */}
                            <BookCallButtonWithModal
                                buttonLabel={detail?.heroPrimaryCtaText ?? "Book Your Strategy Call"}
                                className="bg-white hover:bg-white/30 text-brand-coral border border-white/30 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base"
                                buttonSize="lg"
                                defaultServiceType="Google Ads"
                            />
                            {detail?.bottomSecondaryCtaText ? (
                                <CtaButton
                                    variant="secondary"
                                    text={detail.bottomSecondaryCtaText}
                                    href={detail?.bottomSecondaryCtaHref ?? "/contact?service=google-ads"}
                                />
                            ) : (
                                <button className="bg-[rgba(255,255,255,0)] text-[rgb(255,255,255)] border-2 border-white px-8 py-3 rounded-md hover:bg-gray-100 hover:text-[#ee4962] transition-colors">
                                    Get Started Today
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

function DashboardSection({ detail }: { detail?: PpcCaseStudyDetail }) {
    return (
        <section className="py-20 px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center mb-4 text-gray-900 font-bold text-[24px]">
                    {detail?.dashboardTitle ?? "Google Ads Dashboard Results"}
                </h2>
                <p className="text-center text-gray-600 text-xl mb-12">
                    {detail?.dashboardSubtitle ?? ""}
                </p>

                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        {(detail?.dashboardStats ?? []).slice(0, 4).map((s, idx) => (
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
                        <div className="text-gray-900 mb-2">
                            {detail?.dashboardHighlight?.label ?? "Average Cost Per Acquisition"}
                        </div>
                        <div className="text-5xl text-[#ee4962] mb-4 font-bold">
                            {detail?.dashboardHighlight?.value ?? "—"}
                        </div>
                        <div className="text-gray-600">{detail?.dashboardHighlight?.subtext ?? ""}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
