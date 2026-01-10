import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import * as LucideIcons from "lucide-react";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import { LazyYouTube } from "@/components/LazyYouTube";
import { Helmet } from "react-helmet";
import { SEO } from "@/hooks/SEO";
import BrandingBeezLoader from "@/components/BeeLoadingScreen";

// ---------------- Types ----------------
type WebCardResults = {
    performance: string;
    conversions: string;
    users: string;
};

type WebCaseStudyCard = {
    _id: string;
    slug: string;

    title: string;
    client: string;
    industry: string;
    description: string;

    results: WebCardResults;

    imageUrl?: string;
    imageAlt?: string;
    imageFit?: "contain" | "cover";

    link?: string;
};

type HeroStat = { value: string; label: string; iconKey?: string };

type ChallengePoint = { iconKey: string; text: string };

type BeforeAfterItem = { label: string; value: string };
type BeforeAfterBlock = {
    beforeTitle: string;
    afterTitle: string;
    beforeItems: BeforeAfterItem[];
    afterItems: BeforeAfterItem[];
};

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
    color?: string; // hex recommended
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

type SeoMeta = {
    metaTitle?: string;
    metaDescription?: string;
};

type WebCaseStudyDetail = {
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

    // Showcase
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

    seo?: SeoMeta;
};

type WebCaseStudyCombined = {
    card: WebCaseStudyCard;
    detail?: WebCaseStudyDetail;
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

        // Vimeo
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
            ? "w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#ee4b64] text-white font-bold rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
            : variant === "secondary"
                ? "w-full sm:w-auto px-5 sm:px-6 py-2 border border-white rounded-md text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
                : "w-full sm:w-auto px-5 sm:px-6 py-2 bg-white text-[#ee4962] rounded-md hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2";

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

// ---------------- Page ----------------
export default function WebCaseStudySlugPage(props: any) {
    const [, setLocation] = useLocation();

    const route = useRoute("/web-case-studies/:slug");
    const slugFromRoute = route[0] ? route[1]?.slug : undefined;
    const slugFromProps = props?.params?.slug;
    const slug = String(slugFromProps ?? slugFromRoute ?? "").trim();

    const [data, setData] = useState<WebCaseStudyCombined | null>(null);
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

                const res = await fetch(`/api/web-case-study/${encodeURIComponent(slug)}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Web case study not found");
                    throw new Error(`Failed to load Web case study: ${res.status} ${res.statusText}`);
                }

                const json = (await res.json()) as WebCaseStudyCombined;
                if (cancelled) return;
                setData(json);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Unable to load Web case study");
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
    const overviewColumns = useMemo(() => detail?.overviewColumns ?? [], [detail]);
    const strategyColumns = useMemo(
        () => (detail?.strategyColumns ?? []).slice().sort((a, b) => a.order - b.order),
        [detail],
    );
    const coreFeatures = useMemo(() => detail?.coreFeatures ?? [], [detail]);
    const technicalExcellence = useMemo(() => detail?.technicalExcellence ?? [], [detail]);
    const evaluationCards = useMemo(() => detail?.evaluationCards ?? [], [detail]);
    const partnershipMetrics = useMemo(() => detail?.partnershipMetrics ?? [], [detail]);

    const showcase = detail?.showcase;
    const beforeAfter = detail?.beforeAfter;

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center text-gray-500 px-4 text-center">
                <BrandingBeezLoader />
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
                <div className="text-red-500 font-semibold mb-2">{error ?? "Unable to load Web case study"}</div>
                <button
                    className="mt-2 w-full max-w-xs px-5 py-2 rounded-lg bg-[#ee4962] text-white font-semibold"
                    onClick={() => setLocation("/")}
                >
                    Go Home
                </button>
            </div>
        );
    }

    const hasDetail = Boolean(detail);

    const extractYouTubeId = (input?: string) => {
        const raw = (input || "").trim();
        if (!raw) return "";

        // already an ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

        try {
            const u = new URL(raw);
            if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
            if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";
        } catch {
            return "";
        }
        return "";
    };

    const seoTitle =
        detail?.seo?.metaTitle ||
        detail?.heroTitle ||
        card.title ||
        "Web Case Study";

    const seoDescription =
        detail?.seo?.metaDescription ||
        card.description ||
        "Detailed web development case study by BrandingBeez.";

    return (
        <>
            <SEO
                title={`${seoTitle} | BrandingBeez Case Study`}
                description={seoDescription}
            />

            {/* Open Graph (allowed separately) */}
            <Helmet>
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${seoTitle} | BrandingBeez`} />
                <meta property="og:description" content={seoDescription} />
            </Helmet>

            <div className="min-h-screen bg-white">
                {/* ================= HERO ================= */}
                {/* <section className="relative overflow-hidden text-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-coral" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 lg:py-20">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="flex justify-center mb-5 sm:mb-8">
                                <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
                                    <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-md">
                                        <IconByKey
                                            iconKey="Award"
                                            className="w-3.5 h-3.5 text-white"
                                            size={14}
                                        />
                                    </div>
                                    <span className="text-white text-xs sm:text-sm font-medium">
                                        {detail?.heroBadgeText ?? "Website Development Success Story"}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-white mb-3 sm:mb-6 font-bold text-3xl sm:text-4xl md:text-5xl xl:text-[56px] leading-tight break-words">
                                {detail?.heroTitle ?? card.title ?? card.client}
                            </h1>

                            <div className="flex justify-center items-center gap-2 mb-6 sm:mb-8">
                                <span className="text-white/90 text-sm sm:text-base">
                                    {detail?.heroRatingText ??
                                        "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by 25+ Agencies"}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                <BookCallButtonWithModal
                                    buttonLabel={
                                        detail?.heroPrimaryCtaText ?? "Book Free Consultation"
                                    }
                                    className="w-full sm:w-auto px-6 sm:px-8 py-6 sm:py-5 bg-[#ee4b64] text-white font-bold rounded-[10px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
                                    buttonSize="lg"
                                    defaultServiceType="Website Development"
                                />
                                <CtaButton
                                    variant="secondary"
                                    text={detail?.heroSecondaryCtaText ?? "Visit Live Website"}
                                    href={
                                        detail?.heroSecondaryCtaHref ??
                                        showcase?.liveUrl ??
                                        card.link
                                    }
                                    rightIconKey="ExternalLink"
                                />
                            </div>

                            {!hasDetail && (
                                <div className="mt-8 sm:mt-10 bg-white/10 border border-white/20 text-white rounded-xl p-4 text-sm sm:text-base">
                                    Detail content not added yet for this Web case study. (Card data
                                    loaded ✅)
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

                        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                            <div className="lg:col-span-6 min-w-0">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                                    Project Overview & Key Results
                                </h2>
                                <p className="text-gray-700 text-sm sm:text-base md:text-[17px] leading-relaxed mb-10 max-w-2xl">
                                    {detail?.heroDescription ?? card.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                                    {(heroStats.length
                                        ? heroStats
                                        : [
                                            { value: card.results?.performance, label: "Industry", iconKey: "Building2" },
                                            { value: card.results?.conversions, label: "Website Type", iconKey: "Calendar" },
                                            { value: card.results?.users, label: "Delivery Type", iconKey: "Award" },
                                        ]
                                    )
                                        .slice(0, 3)
                                        .map((s, idx) => (
                                            <div
                                                key={`${s.label}-${idx}`}
                                                className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EE4962] rounded-xl mb-4">
                                                    <IconByKey
                                                        iconKey={s.iconKey ?? "CheckCircle2"}
                                                        className="w-5 h-5 text-white"
                                                        size={20}
                                                    />
                                                </div>
                                                <div className="text-sm sm:text-base font-semibold text-gray-900 mb-1 break-words">
                                                    {s.value}
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600">{s.label}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="lg:col-span-6">
                                <div className="rounded-[28px] border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-md p-3 sm:p-4">
                                    <div className="rounded-2xl overflow-hidden">
                                        <div className="relative w-full aspect-[16/9] sm:aspect-[16/9.5] bg-black/5">
                                            {detail?.heroVideoUrl ? (
                                                <LazyYouTube
                                                    videoId={extractYouTubeId(detail.heroVideoUrl)}
                                                    aspectRatio="16/9"
                                                    thumbnailQuality="hqdefault"
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center px-6 py-20">
                                                    <div className="text-gray-900 font-semibold text-lg sm:text-xl">
                                                        Video Coming Soon
                                                    </div>
                                                    <div className="text-gray-600 text-sm mt-2 max-w-md">
                                                        We’re currently preparing the full case study walkthrough video.
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                <section className="relative overflow-hidden text-white">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-coral" />

                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-18 lg:py-22 text-center">

                        {/* Badge */}
                        <div className="mb-6 flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
                                <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-md">
                                    <IconByKey iconKey="Award" className="w-3.5 h-3.5 text-white" size={14} />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">
                                    {detail?.heroBadgeText ?? "Website Development Success Story"}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="mb-4 font-bold text-3xl sm:text-4xl md:text-5xl xl:text-[48px] leading-tight">
                            {detail?.heroTitle ?? card.title ?? card.client}
                        </h1>

                        {/* Rating */}
                        <p className="mb-6 text-white/90 text-sm sm:text-base">
                            {detail?.heroRatingText ?? "⭐⭐⭐⭐⭐ Rated 4.9 | Trusted by 25+ Agencies"}
                        </p>

                        {/* Description */}
                        <div className="px-6 sm:px-8 mb-4">
                            <p className="text-white text-sm sm:text-base leading-relaxed text-center">
                                {detail?.heroDescription ?? card.description}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="px-6 sm:px-8 pb-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                {(heroStats.length
                                    ? heroStats
                                    : [
                                        { value: card.results?.performance, label: "Industry", iconKey: "Building2" },
                                        { value: card.results?.conversions, label: "Website Type", iconKey: "Calendar" },
                                        { value: card.results?.users, label: "Delivery Type", iconKey: "Award" },
                                    ]
                                )
                                    .slice(0, 3)
                                    .map((s, idx) => (
                                        <div
                                            key={`${s.label}-${idx}`}
                                            className="rounded-2xl border bg-gray-50 p-5 hover:shadow-md transition"
                                        >
                                            <div className="inline-flex items-center justify-center w-11 h-11 bg-[#EE4962] rounded-xl mb-3">
                                                <IconByKey
                                                    iconKey={s.iconKey ?? "CheckCircle2"}
                                                    className="w-5 h-5 text-white"
                                                    size={20}
                                                />
                                            </div>
                                            <div className="font-semibold text-sm sm:text-base text-gray-700">
                                                {s.value}
                                            </div>
                                            <div className="text-gray-600 text-xs sm:text-sm mt-1">
                                                {s.label}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>


                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-5">
                            <BookCallButtonWithModal
                                buttonLabel={detail?.heroPrimaryCtaText ?? "Book Free Consultation"}
                                className="px-7 py-5 bg-[#ee4b64] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
                                buttonSize="lg"
                                defaultServiceType="Website Development"
                            />
                            <CtaButton
                                variant="secondary"
                                text={detail?.heroSecondaryCtaText ?? "Visit Live Website"}
                                href={detail?.heroSecondaryCtaHref ?? showcase?.liveUrl ?? card.link}
                                rightIconKey="ExternalLink"
                            />
                        </div>

                    </div>
                </section>


                {/* ================= Website Showcase ================= */}
                <WebsiteShowcaseSection
                    showcase={showcase}
                    fallbackTitle="Website Showcase"
                    fallbackSubtitle={`Live snapshots of the ${card.client} website we built`}
                />

                {/* ================= CTA 1 ================= */}
                <InlineCtaBand
                    title={detail?.ctaTop?.title ?? "Not sure where to start?"}
                    body={
                        detail?.ctaTop?.body ??
                        "Get a quick website review and see how a refreshed build can improve conversions, speed, and credibility."
                    }
                    buttonText={detail?.ctaTop?.primaryText ?? "Request a Strategy Consultation"}
                    buttonHref={detail?.ctaTop?.primaryHref ?? "/contact?service=website-development"}
                />

                {/* ================= Challenge ================= */}
                <ChallengeSection
                    title={detail?.challengeTitle ?? "The Challenge"}
                    subtitle={detail?.challengeSubtitle ?? ""}
                    points={challengePoints}
                    beforeAfter={beforeAfter}
                />

                {/* ================= Project Overview ================= */}
                <OverviewSection
                    title={detail?.overviewTitle ?? "Project Overview"}
                    subtitle={detail?.overviewSubtitle ?? ""}
                    columns={overviewColumns}
                />

                {/* ================= Strategy ================= */}
                <StrategySection
                    title={detail?.strategyTitle ?? "Website Development Strategy"}
                    subtitle={detail?.strategySubtitle ?? ""}
                    columns={strategyColumns}
                />

                {/* ================= Features ================= */}
                <FeaturesSection
                    title={detail?.featuresTitle ?? "Website Features & Solution"}
                    subtitle={detail?.featuresSubtitle ?? ""}
                    coreTitle={detail?.coreFeaturesTitle ?? "Core Features Delivered"}
                    core={coreFeatures}
                    techTitle={detail?.technicalExcellenceTitle ?? "Technical Excellence"}
                    tech={technicalExcellence}
                />

                {/* ================= CTA 2 ================= */}
                <InlineCtaBand
                    title={detail?.ctaMid?.title ?? "Want similar results for your agency or business website?"}
                    body={
                        detail?.ctaMid?.body ??
                        "Share your current website and goals, and we'll tell you if this white-label build model fits your niche, timeline, and tech stack."
                    }
                    buttonText={detail?.ctaMid?.primaryText ?? "Talk to the Development Team"}
                    buttonHref={detail?.ctaMid?.primaryHref ?? "/contact?service=website-development"}
                />

                {/* ================= Partnership Evaluation ================= */}
                <EvaluationSection
                    kicker={detail?.evaluationKicker ?? "What makes this partnership successful?"}
                    title={detail?.evaluationTitle ?? "Partnership Evaluation"}
                    cards={evaluationCards}
                />

                {/* ================= Client Feedback ================= */}
                <FeedbackSection
                    kicker={detail?.feedbackKicker ?? "What Our Clients Say"}
                    quote={detail?.testimonial?.quote ?? ""}
                    authorName={detail?.testimonial?.authorName ?? ""}
                    authorRole={detail?.testimonial?.authorRole ?? ""}
                    ratingText={detail?.testimonial?.ratingText ?? "⭐⭐⭐⭐⭐"}
                    metricsTitle={detail?.partnershipMetricsTitle ?? "Partnership Success"}
                    metrics={partnershipMetrics}
                    primaryCtaText={detail?.feedbackPrimaryCtaText ?? "Start Your Website Project"}
                    primaryCtaHref={detail?.feedbackPrimaryCtaHref ?? "/contact?service=website-development"}
                />

                {/* ================= Final CTA ================= */}
                <FinalCtaSection
                    title={detail?.finalCta?.title ?? "Ready to Build Your Professional Website?"}
                    body={
                        detail?.finalCta?.body ??
                        `Join ${card.client} and 100+ other agencies that trust BrandingBeez for their website development needs.`
                    }
                    primaryText={detail?.finalCta?.primaryText ?? "Book Your Free Consultation"}
                    primaryHref={detail?.finalCta?.primaryHref ?? "/contact?service=website-development"}
                    secondaryText={detail?.finalCta?.secondaryText ?? "View Other Website Services"}
                    secondaryHref={detail?.finalCta?.secondaryHref ?? "/services"}
                />
            </div>
        </>
    );
}

// ================= Sections =================
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
    const liveButtonText = showcase?.liveButtonText ?? "View Live Website";

    const imgDesktop = showcase?.desktopImageUrl;
    const imgMobile = showcase?.mobileImageUrl;

    const imgUrl = viewMode === "desktop" ? imgDesktop : imgMobile;
    const imgAlt =
        viewMode === "desktop"
            ? (showcase?.desktopImageAlt ?? "Desktop website screenshot")
            : (showcase?.mobileImageAlt ?? "Mobile website screenshot");

    return (
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-gray-900 mb-3 sm:mb-4 font-bold text-2xl sm:text-3xl md:text-[32px]">
                        {title}
                    </h2>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                        {subtitle}
                    </p>
                    {body ? (
                        <p className="text-gray-700 max-w-3xl mx-auto text-sm sm:text-base">
                            {body}
                        </p>
                    ) : null}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                    {/* toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#ee4962] rounded-lg">
                                <IconByKey
                                    iconKey={viewMode === "desktop" ? "Monitor" : "Smartphone"}
                                    className="w-5 h-5 text-white"
                                    size={20}
                                />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-bold text-sm sm:text-base">
                                    {viewMode === "desktop"
                                        ? "Desktop Experience"
                                        : "Mobile Experience"}
                                </h3>
                            </div>
                        </div>

                        <div className="inline-flex w-full sm:w-auto items-center bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode("desktop")}
                                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-md transition-all text-sm ${viewMode === "desktop"
                                    ? "bg-gradient-to-r from-[#321a66] to-[#ee4962] text-white"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <IconByKey iconKey="Monitor" className="w-4 h-4" size={16} />
                                Desktop
                            </button>
                            <button
                                onClick={() => setViewMode("mobile")}
                                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-md transition-all text-sm ${viewMode === "mobile"
                                    ? "bg-gradient-to-r from-[#321a66] to-[#ee4962] text-white"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <IconByKey
                                    iconKey="Smartphone"
                                    className="w-4 h-4"
                                    size={16}
                                />
                                Mobile
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                        {viewMode === "desktop"
                            ? "Clean, professional layout optimized for desktop users"
                            : "Responsive design optimized for mobile devices"}
                    </p>

                    {/* ✅ UPDATED: scroll image inside the container */}
                    <div
                        className={`bg-gray-100 border-2 border-gray-200 rounded-xl shadow-xl transition-all duration-300 ${viewMode === "mobile" ? "max-w-sm mx-auto" : ""
                            }`}
                    >
                        {/* Scroll viewport */}
                        <div className="relative h-[420px] sm:h-[480px] md:h-[520px] overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-xl">
                            {imgUrl ? (
                                <img
                                    src={imgUrl}
                                    alt={imgAlt}
                                    className="w-full h-auto block"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm px-4 text-center">
                                    Screenshot not provided
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live button */}
                {liveUrl ? (
                    <div className="flex justify-center mt-6 sm:mt-8">
                        <button
                            onClick={() => window.open(liveUrl, "_blank", "noopener,noreferrer")}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ee4962] text-white rounded-md hover:bg-[#d91045] transition-colors shadow-md hover:shadow-lg"
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

function InlineCtaBand({
    title,
    body,
    buttonText,
    buttonHref,
}: {
    title: string;
    body: string;
    buttonText: string;
    buttonHref?: string;
}) {
    const [, setLocation] = useLocation();

    return (
        <section className="bg-gradient-to-r from-[#391B66] to-[#E64761] py-8 sm:py-10 md:py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
                    <div className="flex-1 min-w-0">
                        <p className="text-white mb-2 sm:mb-3 text-lg sm:text-xl font-bold">{title}</p>
                        <p className="text-white/95 text-sm sm:text-base leading-relaxed">{body}</p>
                    </div>

                    <div className="md:flex-shrink-0">
                        <BookCallButtonWithModal
                            buttonLabel={buttonText ?? "Book Free Consultation"}
                            className="w-full md:w-auto px-6 py-3 bg-white text-[#ee4962] rounded-md hover:bg-gray-100 transition-colors"
                            buttonSize="lg"
                            defaultServiceType="Website Development"
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
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-gray-900 font-bold text-2xl sm:text-3xl md:text-[32px] mb-3 sm:mb-4">{title}</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base">{subtitle}</p>
                </div>

                {/* points */}
                {points.length ? (
                    <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-12 max-w-2xl mx-auto">
                        {points.map((p, idx) => (
                            <div key={idx} className="flex items-start sm:items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-[#ee4962] rounded-full flex-shrink-0 mt-0.5 sm:mt-0">
                                    <IconByKey iconKey={p.iconKey} className="w-5 h-5 text-white" size={20} />
                                </div>
                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{p.text}</p>
                            </div>
                        ))}
                    </div>
                ) : null}

                {/* before/after */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* BEFORE */}
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-3 mb-5 sm:mb-6">
                            <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full shrink-0">
                                <IconByKey iconKey="X" className="w-6 h-6 text-white" size={22} />
                            </div>
                            <h3 className="text-gray-900 font-bold text-xl sm:text-2xl break-words">
                                {beforeTitle}
                            </h3>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {beforeItems.length ? (
                                beforeItems.map((x, i) => (
                                    <div
                                        key={i}
                                        className={[
                                            "p-3 sm:p-0",
                                            i !== beforeItems.length - 1 ? "sm:pb-3 sm:border-b sm:border-red-200" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-4 min-w-0">
                                            <span className="text-gray-700 text-sm sm:text-base font-bold leading-snug break-words min-w-0">
                                                {x.label}
                                            </span>

                                            <span className="text-red-600 font-semibold text-sm sm:text-base break-words min-w-0 lg:text-right">
                                                {x.value}
                                            </span>
                                        </div>

                                        {i !== beforeItems.length - 1 ? (
                                            <div className="sm:hidden mt-3 h-px bg-red-200" />
                                        ) : null}
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-600">Before items not provided</div>
                            )}
                        </div>
                    </div>

                    {/* AFTER */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-3 mb-5 sm:mb-6">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full shrink-0">
                                <IconByKey iconKey="Check" className="w-6 h-6 text-white" size={22} />
                            </div>
                            <h3 className="text-gray-900 font-bold text-xl sm:text-2xl break-words">
                                {afterTitle}
                            </h3>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {afterItems.length ? (
                                afterItems.map((x, i) => (
                                    <div
                                        key={i}
                                        className={[
                                            "p-3 sm:p-0",
                                            i !== afterItems.length - 1 ? "sm:pb-3 sm:border-b sm:border-green-200" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-4 min-w-0">
                                            <span className="text-gray-700 text-sm sm:text-base font-bold leading-snug break-words min-w-0">
                                                {x.label}
                                            </span>

                                            <span className="text-green-600 font-semibold text-sm sm:text-base break-words min-w-0 lg:text-right">
                                                {x.value}
                                            </span>
                                        </div>

                                        {i !== afterItems.length - 1 ? (
                                            <div className="sm:hidden mt-3 h-px bg-green-200" />
                                        ) : null}
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

function OverviewSection({
    title,
    subtitle,
    columns,
}: {
    title: string;
    subtitle: string;
    columns: OverviewColumn[];
}) {
    return (
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-[rgb(50,26,102)] mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-[32px] font-bold">{title}</h2>
                    <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 relative">
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/3 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                    <div className="hidden md:block absolute top-0 bottom-0 left-2/3 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                    {(columns || []).map((col, idx) => (
                        <div
                            key={`${col.title}-${idx}`}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 transition-transform duration-300 hover:scale-[1.02] hover:shadow-md relative"
                        >
                            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${col.dotColorClass || "bg-[#ee4962]"}`}></div>

                            <div className="flex items-center gap-3 mb-5 sm:mb-6">
                                <div className="flex items-center justify-center w-8 h-8 bg-[#321a66] rounded-lg">
                                    <IconByKey iconKey={col.iconKey} className="w-5 h-5 text-white" size={20} />
                                </div>
                                <h3 className="text-gray-900 font-bold text-sm sm:text-base">{col.title}</h3>
                            </div>

                            <ul className="space-y-3 sm:space-y-4">
                                {(col.bullets || []).map((b, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <IconByKey iconKey={b.iconKey} className="w-4 h-4 text-[#ee4962] flex-shrink-0 mt-1" size={16} />
                                        <span className="text-gray-700 text-sm sm:text-base">{b.text}</span>
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

function StrategySection({
    title,
    subtitle,
    columns,
}: {
    title: string;
    subtitle: string;
    columns: StrategyColumn[];
}) {
    return (
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-gray-900 font-bold text-2xl sm:text-3xl md:text-[32px] mb-3 sm:mb-4">{title}</h2>
                    <p className="text-gray-700 max-w-3xl mx-auto text-sm sm:text-base">{subtitle}</p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                    {(columns || []).map((col, idx) => (
                        <div key={`${col.title}-${idx}`} className="relative border border-gray-200 rounded-lg p-5 sm:p-6">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-[rgb(50,26,102)] rounded-full flex-shrink-0">
                                    <span className="text-white font-bold text-base sm:text-[20px]">{col.order ?? idx + 1}</span>
                                </div>
                                <h3 className="text-gray-900 font-bold text-base sm:text-[20px] leading-snug">{col.title}</h3>
                            </div>

                            {col.tagText ? (
                                <div className="inline-block px-2 py-0.5 text-xs sm:text-sm bg-gradient-to-r from-[#321A66]/10 to-[#ee4962]/10 text-[#321A66] rounded-[5px] border border-[#ee4962]/20 mb-5 sm:mb-6">
                                    {col.tagText}
                                </div>
                            ) : null}

                            <ul className="space-y-2.5 sm:space-y-3">
                                {(col.bullets || []).map((b, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <IconByKey iconKey={b.iconKey} className="w-5 h-5 text-[#ee4962] flex-shrink-0 mt-0.5" size={18} />
                                        <span className="text-gray-700 text-sm sm:text-base">{b.text}</span>
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
        <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-gray-900 mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-[32px] font-bold">{title}</h2>
                    <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
                </div>

                {/* core */}
                <div className="mb-10 sm:mb-12">
                    <h3 className="text-[rgb(50,26,102)] mb-5 sm:mb-6 text-center font-bold text-base sm:text-[20px]">
                        {coreTitle}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {(core || []).map((f, idx) => (
                            <div
                                key={idx}
                                className={`border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 ${idx % 2 === 0
                                    ? "bg-gradient-to-br from-[#ee4962]/5 to-white"
                                    : "bg-gradient-to-br from-[#321a66]/5 to-white"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                                        style={{ backgroundColor: f.color || (idx % 2 === 0 ? "#ee4962" : "#321a66") }}
                                    >
                                        <IconByKey iconKey={f.iconKey} className="w-5 h-5 text-white" size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-gray-900 mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base break-words">
                                            {f.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{f.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* tech */}
                <div>
                    <h3 className="text-[rgb(50,26,102)] mb-5 sm:mb-6 text-center text-base sm:text-[20px] font-bold">
                        {techTitle}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {(tech || []).map((f, idx) => (
                            <div
                                key={idx}
                                className={`border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 ${idx % 2 === 0
                                    ? "bg-gradient-to-br from-[#ee4962]/5 to-white"
                                    : "bg-gradient-to-br from-[#321a66]/5 to-white"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                                        style={{ backgroundColor: f.color || (idx % 2 === 0 ? "#ee4962" : "#321a66") }}
                                    >
                                        <IconByKey iconKey={f.iconKey} className="w-5 h-5 text-white" size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-gray-900 mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base break-words">
                                            {f.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{f.description}</p>
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

function EvaluationSection({
    kicker,
    title,
    cards,
}: {
    kicker: string;
    title: string;
    cards: EvaluationCard[];
}) {
    return (
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 sm:mb-10 md:mb-12">
                    <p className="text-[#ee4962] mb-2 sm:mb-3 font-bold text-lg sm:text-2xl">{kicker}</p>
                    <h2 className="text-gray-900 font-bold text-xl sm:text-2xl md:text-[28px]">{title}</h2>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {(cards || []).map((c, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#321a66] rounded-lg mb-4">
                                <IconByKey iconKey={c.iconKey} className="w-6 h-6 text-white" size={22} />
                            </div>
                            <h3 className="text-gray-900 mb-2 sm:mb-3 font-semibold text-sm sm:text-base">{c.title}</h3>
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{c.description}</p>
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
        <section className="bg-gray-50 py-10 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <p className="text-black mb-2 font-bold text-base sm:text-[32px]">
                        {kicker}
                    </p>
                    <p className="text-gray-600 mt-2 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base">
                        See how this partnership created lasting value and set the foundation
                        for continued success.
                    </p>
                </div>

                {/* If you want 2 cols on tablet too, change lg:grid-cols-2 -> md:grid-cols-2 */}
                <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
                    {/* testimonial */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-5 sm:p-8 md:p-10 lg:p-12 relative">
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                            <div className="flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-[#321a66] to-[#ee4962] rounded-full">
                                <IconByKey
                                    iconKey="Quote"
                                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                                    size={26}
                                />
                            </div>
                        </div>

                        <blockquote className="text-center mb-6 sm:mb-8 mt-10 sm:mt-12">
                            <p className="text-gray-700 italic mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed break-words">
                                {quote ? `"${quote}"` : "“Testimonial not provided yet.”"}
                            </p>
                            <div className="text-gray-500 text-sm">{ratingText}</div>
                        </blockquote>

                        <div className="flex items-center justify-center gap-3 sm:gap-4 ">
                            <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-[#321a66] rounded-full">
                                <IconByKey
                                    iconKey="MessageCircle"
                                    className="w-6 h-6 text-white"
                                    size={22}
                                />
                            </div>
                            <div className="text-left min-w-0">
                                <div className="text-gray-900 font-semibold text-sm sm:text-base break-words">
                                    {authorName || "Client"}
                                </div>
                                <p className="text-gray-600 text-sm break-words">
                                    {authorRole || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* metrics */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-5 sm:p-8 md:p-10 lg:p-12">
                        <h3 className="text-gray-900 mb-6 sm:mb-8 text-center font-bold text-base sm:text-[20px]">
                            {metricsTitle}
                        </h3>

                        <div className="space-y-4 sm:space-y-6 mb-7 sm:mb-8">
                            {(metrics || []).map((m, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <IconByKey
                                            iconKey={m.iconKey}
                                            className="w-5 h-5 text-[#321a66] flex-shrink-0"
                                            size={18}
                                        />
                                        <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">
                                            {m.label}
                                        </span>
                                    </div>

                                    <span className="text-gray-700 text-sm sm:text-base break-words font-medium">
                                        {m.value}
                                    </span>
                                </div>
                            ))}

                            {!metrics?.length ? (
                                <div className="text-sm text-gray-500 text-center">
                                    Metrics not provided yet.
                                </div>
                            ) : null}
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
        <section className="relative bg-gradient-to-r from-[#ee4962] to-[#321a66] text-white py-10 sm:py-12 md:py-16 lg:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-white mb-4 sm:mb-6 font-bold text-xl sm:text-2xl md:text-[28px]">{title}</h2>
                <p className="text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">{body}</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                    <BookCallButtonWithModal
                        buttonLabel={primaryText ?? "Book Your Strategy Call"}
                        className="w-full sm:w-auto px-6 py-4 sm:py-5 bg-white text-[#ee4962] rounded-md hover:bg-gray-100 transition-colors"
                        buttonSize="lg"
                        defaultServiceType="Website Development"
                    />

                    <button
                        className="w-full sm:w-auto px-6 py-2 border border-white text-white rounded-md hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
                        onClick={() => {
                            if (!secondaryHref) return;
                            if (secondaryHref.startsWith("/")) return setLocation(secondaryHref);
                            window.open(secondaryHref, "_blank", "noopener,noreferrer");
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
