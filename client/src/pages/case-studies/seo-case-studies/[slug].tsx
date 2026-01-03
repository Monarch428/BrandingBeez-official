import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import * as LucideIcons from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

import network_icon from "@assets/networkicon.png";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import { LazyYouTube } from "@/components/LazyYouTube";
import { Helmet } from "react-helmet";

/* ============================================================
   TYPES (API returns combined: { card, detail })
   ============================================================ */

interface HeroStat {
  value: string;
  label: string;
  iconKey?: string; // ✅ add for dynamic icon support (optional)
}
interface Highlight {
  iconKey: string;
  title: string;
  description: string;
  subtext?: string;
  colorClass?: string;
}
interface AboutStat {
  iconKey: string;
  label: string;
  value: string;
}
interface InitialChallenge {
  order: number;
  text: string;
}
interface Issue {
  issue: string;
  severity: "Critical" | "High" | "Medium";
  action: string;
  result: string;
}
interface KeywordRow {
  keyword: string;
  position: number;
  previousPosition: number;
  volume: string;
}
interface Tool {
  iconKey: string;
  name: string;
  category: string;
  usage: string;
  colorClass?: string;
}
interface Testimonial {
  name: string;
  role: string;
  company: string;
  imageUrl: string;
  quote: string;
  rating: number;
}
interface ContactPoint {
  month: string;
  submissions: number;
}
interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
}
interface KeywordMetric {
  label: string;
  value: string;
  percentage: string;
}

interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
}

export interface SeoCaseStudyCard {
  _id: string;
  slug: string;

  cardTitle: string;
  cardClient: string;
  cardIndustry: string;
  cardDescription: string;

  cardResultsTraffic: string;
  cardResultsKeywords: string;
  cardResultsRevenue: string;

  cardCoverImageUrl?: string;
  cardCoverImageAlt?: string;
  cardCoverFit?: "contain" | "cover";
}

export interface SeoCaseStudyDetail {
  cardId: string;

  heroBadgeText: string;
  heroCaseStudyLabel: string;
  heroClientName: string;
  heroRatingText: string;
  heroHeadline: string;
  heroDescription: string;
  heroStats: HeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  highlightsTitle: string;
  highlightsSubtitle: string;
  highlights: Highlight[];

  cta1Title: string;
  cta1Body: string;
  cta1PrimaryCtaText: string;
  cta1PrimaryCtaHref?: string;

  aboutBadgeText: string;
  aboutLogoUrl?: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutStats: AboutStat[];
  initialChallengesTitle: string;
  initialChallenges: InitialChallenge[];

  issuesSectionTitle: string;
  issuesSectionSubtitle: string;
  issues: Issue[];

  keywordPerformanceTitle: string;
  keywordPerformanceSubtitle: string;
  topKeywords: KeywordRow[];

  toolsSectionTitle: string;
  toolsSectionSubtitle: string;
  tools: Tool[];

  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  testimonials: Testimonial[];
  contactData: ContactPoint[];
  performanceMetrics: PerformanceMetric[];
  keywordMetrics: KeywordMetric[];

  cta2Title: string;
  cta2Body: string;
  cta2PrimaryCtaText: string;
  cta2PrimaryCtaHref?: string;

  bottomCtaTitle: string;
  bottomCtaBody: string;
  bottomPrimaryCtaText: string;
  bottomPrimaryCtaHref?: string;
  bottomSecondaryCtaText: string;
  bottomSecondaryCtaHref?: string;

  seo?: SeoMeta;
}

export type SeoCaseStudyCombined = {
  card: SeoCaseStudyCard;
  detail?: SeoCaseStudyDetail;
};

/* ========================
   Dynamic Lucide Icon Helper
   ======================== */

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

/* ========================
   ROUTE PAGE (Slug Detail)
   ======================== */

function buildSeoFallbackFromCard(card: SeoCaseStudyCard): SeoCaseStudyDetail {
  return {
    cardId: card._id,

    heroBadgeText: "SEO Case Study",
    heroCaseStudyLabel: card.cardIndustry,
    heroClientName: card.cardClient,
    heroRatingText: "Rated 5/5 by the client",
    heroHeadline: card.cardTitle,
    heroDescription: card.cardDescription,
    heroStats: [
      { value: card.cardResultsTraffic, label: "Traffic", iconKey: "TrendingUp" },
      { value: card.cardResultsRevenue, label: "Leads / Revenue", iconKey: "DollarSign" },
      { value: card.cardResultsKeywords, label: "Keywords", iconKey: "Award" },
    ],
    heroPrimaryCtaText: "Contact Us",
    heroPrimaryCtaHref: "/contact",

    highlightsTitle: "Highlights",
    highlightsSubtitle: "Key wins",
    highlights: [],

    cta1Title: "Want results like this?",
    cta1Body: "Book a strategy call and we’ll map your growth plan.",
    cta1PrimaryCtaText: "Book a Call",
    cta1PrimaryCtaHref: "/contact",

    aboutBadgeText: "About the client",
    aboutLogoUrl: "",
    aboutTitle: card.cardClient,
    aboutParagraph1: card.cardDescription,
    aboutParagraph2: "",
    aboutStats: [],
    initialChallengesTitle: "Initial Challenges",
    initialChallenges: [],

    issuesSectionTitle: "Issues",
    issuesSectionSubtitle: "",
    issues: [],

    keywordPerformanceTitle: "Keyword Performance",
    keywordPerformanceSubtitle: "",
    topKeywords: [],

    toolsSectionTitle: "Tools",
    toolsSectionSubtitle: "",
    tools: [],

    testimonialsSectionTitle: "Testimonials",
    testimonialsSectionSubtitle: "",
    testimonials: [],
    contactData: [],
    performanceMetrics: [],
    keywordMetrics: [],

    cta2Title: "Ready to grow?",
    cta2Body: "Let’s improve your rankings and leads.",
    cta2PrimaryCtaText: "Talk to Us",
    cta2PrimaryCtaHref: "/contact",

    bottomCtaTitle: "Let’s build your rankings",
    bottomCtaBody: "Get a free SEO audit and a clear plan.",
    bottomPrimaryCtaText: "Get Free Audit",
    bottomPrimaryCtaHref: "/seo-audit",
    bottomSecondaryCtaText: "See Pricing",
    bottomSecondaryCtaHref: "/pricing",

    seo: {},
  };
}

export function SeoCaseStudyPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<{ slug: string }>("/seo-case-study/:slug");
  const slug = params?.slug;

  const [combined, setCombined] = useState<SeoCaseStudyCombined | null>(null);
  const [seo, setSeo] = useState<SeoCaseStudyDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cleanSlug = (slug || "").trim();

    if (!match || !cleanSlug) {
      setError("Slug missing in URL");
      setLoading(false);
      setCombined(null);
      setSeo(null);
      return;
    }

    let cancelled = false;

    async function fetchSeoCaseStudy() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/seo-case-study/${encodeURIComponent(cleanSlug)}`);

        if (res.status === 404) {
          throw new Error("Case study not found (404)");
        }
        if (!res.ok) {
          throw new Error(`Failed to load case study: ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as SeoCaseStudyCombined;

        if (cancelled) return;

        setCombined(data);

        if (data?.card) {
          const resolvedSeo = data.detail ? data.detail : buildSeoFallbackFromCard(data.card);
          setSeo(resolvedSeo);
        } else {
          setSeo(null);
          throw new Error("Invalid API response: missing card data");
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Unable to load case study");
          setCombined(null);
          setSeo(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSeoCaseStudy();
    return () => {
      cancelled = true;
    };
  }, [match, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading case study…
      </div>
    );
  }

  if (error || !seo || !combined?.card) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-red-500 font-semibold mb-2">{error ?? "Case study not found"}</div>
        <button
          className="mt-2 px-5 py-2 rounded-lg bg-[#ee4962] text-white font-semibold"
          onClick={() => setLocation("/seo-case-studies")}
        >
          Back to Case Studies
        </button>
      </div>
    );
  }

  const seoTitle =
    seo.seo?.metaTitle ||
    seo.heroHeadline ||
    seo.heroClientName ||
    "SEO Case Study";

  return (
    <>
      <Helmet>
        <title>{seoTitle} | BrandingBeez</title>
        <meta
          name="description"
          content={
            seo.seo?.metaDescription ||
            "Detailed SEO case study by BrandingBeez."
          }
        />
      </Helmet>
      
      <HeroSection seo={seo} />
      <CaseStudyHighlights seo={seo} />
      <CTASection seo={seo} />
      <AboutSection seo={seo} />
      <ChallengesIdentified seo={seo} />
      <KeywordPerformanceSection seo={seo} />
      <CTASection2 seo={seo} />
      <ToolsMethodologiesSection seo={seo} />
      <ClientTestimonialsSection seo={seo} />
    </>
  );
}

/* ========================
   Sections
   ======================== */

function HeroSection({ seo }: { seo: SeoCaseStudyDetail }) {
  const stats = seo.heroStats ?? [];
  const stat1 = stats[0] ?? { value: "340%", label: "Traffic Increase", iconKey: "TrendingUp" };
  const stat2 = stats[1] ?? { value: "$152K", label: "Revenue Growth", iconKey: "DollarSign" };
  const stat3 = stats[2] ?? { value: "#1", label: "Ranking Keywords", iconKey: "Award" };

  const extractYouTubeId = (input?: string) => {
    const raw = (input || "").trim();
    if (!raw) return "";

    // already an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

    try {
      const u = new URL(raw);

      // youtu.be/<id>
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }

      // youtube.com/watch?v=<id>
      if (u.searchParams.get("v")) {
        return u.searchParams.get("v") || "";
      }

      // youtube.com/embed/<id>
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/embed/")[1];
      }
    } catch {
      return "";
    }

    return "";
  };

  const youTubeId = extractYouTubeId(seo.heroVideoUrl) || "";

  return (
    <section className="relative bg-gradient-to-r from-brand-purple to-brand-coral text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ee4962] text-white px-4 py-2 rounded-full mb-6">
              <IconByKey iconKey="TrendingUp" className="w-4 h-4" size={16} />
              <span className="text-sm">{seo.heroBadgeText}</span>
            </div>

            <h2 className="text-3xl mb-4">{seo.heroCaseStudyLabel}</h2>
            <div className="text-5xl sm:text-6xl mb-4 font-semibold">{seo.heroClientName}</div>

            <div className="flex items-center gap-2 mb-4 text-white/90">
              <span className="text-xl">{seo.heroRatingText}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-6">{seo.heroHeadline}</h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">{seo.heroDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard iconKey={stat1.iconKey || "TrendingUp"} value={stat1.value} label={stat1.label} />
              <StatCard iconKey={stat2.iconKey || "DollarSign"} value={stat2.value} label={stat2.label} />
              <StatCard iconKey={stat3.iconKey || "Award"} value={stat3.value} label={stat3.label} />
            </div>

            <BookCallButtonWithModal
              buttonLabel={seo?.heroPrimaryCtaText ?? "Book Your Strategy Call"}
              className="px-8 py-4 bg-[#ee4b64] text-white font-bold rounded-[8px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
              buttonSize="lg"
              defaultServiceType="SEO / AIO Services"
            />
          </div>

          {/* Right Video (LazyYouTube) */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mt-8 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <LazyYouTube
                videoId={youTubeId}
                aspectRatio="16/9"
                thumbnailQuality="hqdefault"
                className="w-full"
              />

              {/* <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 z-10">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {seo.heroVideoBadgeText ?? "Case Study Video"}
              </div> */}
            </div>

            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-fuchsia-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  iconKey,
  value,
  label,
}: {
  iconKey: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2">
        <IconByKey iconKey={iconKey} className="w-5 h-5 text-[#ee4962]" size={20} />
      </div>
      <div className="text-3xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function CaseStudyHighlights({ seo }: { seo: SeoCaseStudyDetail }) {
  const highlights = seo.highlights ?? [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{seo.highlightsTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{seo.highlightsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => {
            const bgClass =
              highlight.colorClass?.includes("bg-") || highlight.colorClass?.includes("bg[")
                ? highlight.colorClass
                : "bg-[#ee4962]";

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center flex flex-col items-center"
              >
                <div className={`flex p-4 rounded-full ${bgClass} mb-3`}>
                  <IconByKey iconKey={highlight.iconKey} className="w-6 h-6 text-white" size={24} />
                </div>

                <div className="text-2xl font-bold mb-1 text-gray-900">{highlight.title}</div>
                <div className="text-gray-900 mb-1">{highlight.description}</div>

                {highlight.subtext && <p className="text-gray-500 text-sm">{highlight.subtext}</p>}
              </div>
            );
          })}

          {highlights.length === 0 ? (
            <div className="text-sm text-gray-500 col-span-full text-center">No highlights added yet.</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CTASection({ seo }: { seo: SeoCaseStudyDetail }) {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#391B66] to-[#E64761]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-white mb-2 font-bold text-xl">{seo.cta1Title}</h2>
            <p className="text-white/90 text-lg">{seo.cta1Body}</p>
          </div>

          <div className="flex-shrink-0">
            <BookCallButtonWithModal
              buttonLabel={seo?.cta1PrimaryCtaText ?? "Request a Consultation Call"}
              className="px-8 py-4 bg-[#ee4b64] text-white font-bold rounded-[8px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
              buttonSize="lg"
              defaultServiceType="SEO / AIO Services"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ seo }: { seo: SeoCaseStudyDetail }) {
  const aboutStats = seo.aboutStats ?? [];
  const challenges = seo.initialChallenges ?? [];

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-block bg-[#ee4962] text-white px-4 py-1 rounded-full text-sm mb-4">
              {seo.aboutBadgeText}
            </div>

            <div className="mb-6">
              {seo.aboutLogoUrl ? (
                <ImageWithFallback
                  src={seo.aboutLogoUrl}
                  alt={`${seo.heroClientName} logo`}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <div className="h-16 flex items-center text-sm text-gray-400">Logo not provided</div>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4">{seo.aboutTitle}</h2>
            <p className="text-gray-600 mb-4">{seo.aboutParagraph1}</p>
            <p className="text-gray-600 mb-8">{seo.aboutParagraph2}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {aboutStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <IconByKey iconKey={stat.iconKey} className="w-5 h-5 text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">{stat.label}</div>
                    <div className="text-gray-600 text-sm">{stat.value}</div>
                  </div>
                </div>
              ))}

              {aboutStats.length === 0 ? <div className="text-sm text-gray-500">No about stats added yet.</div> : null}
            </div>
          </div>

          <div className="bg-[#ee4962] rounded-2xl p-8 text-white">
            <h3 className="text-white text-xl font-semibold mb-6">{seo.initialChallengesTitle}</h3>

            <ul className="space-y-4">
              {challenges
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <li key={item.order} className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">{item.order}</span>
                    </div>
                    <span className="leading-relaxed">{item.text}</span>
                  </li>
                ))}

              {challenges.length === 0 ? <li className="text-white/80 text-sm">No challenges added yet.</li> : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChallengesIdentified({ seo }: { seo: SeoCaseStudyDetail }) {
  const issues = seo.issues ?? [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">{seo.issuesSectionTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{seo.issuesSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {issues.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h3 className="text-[#ee4962] font-semibold mb-4">{item.issue}</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      <span className="text-sm text-gray-900 font-medium">Our Action Plan</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-3.5">{item.action}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 flex items-start gap-2">
                    <CheckIcon />
                    <div>
                      <div className="text-sm text-green-900 font-medium">Result</div>
                      <div className="text-sm text-green-700">{item.result}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Severity: <span className="font-semibold">{item.severity}</span>
                </div>
              </div>
            </div>
          ))}

          {issues.length === 0 ? (
            <div className="text-sm text-gray-500 col-span-full text-center">No issues added yet.</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeywordPerformanceSection({ seo }: { seo: SeoCaseStudyDetail }) {
  const topKeywords = seo.topKeywords ?? [];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[rgba(231,231,231,0.22)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{seo.keywordPerformanceTitle}</h2>
          <p className="text-[#ee4962] max-w-2xl mx-auto">{seo.keywordPerformanceSubtitle}</p>
        </div>

        <div className="bg-white rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <IconByKey iconKey="Award" className="w-6 h-6 text-[#EE4962]" size={24} />
            <h3 className="text-gray-900 font-bold text-base">Top Performing Keywords</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-[#ee4962]">Keyword</th>
                  <th className="text-center py-3 px-2 text-[#ee4962]">Current</th>
                  <th className="text-center py-3 px-2 text-[#ee4962]">Previous</th>
                  <th className="text-center py-3 px-2 text-[#ee4962]">Improvement</th>
                  <th className="text-right py-3 px-2 text-[#ee4962]">Volume</th>
                </tr>
              </thead>
              <tbody>
                {topKeywords.map((kw, index) => (
                  <tr key={index} className={index !== topKeywords.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="py-4 px-2 text-gray-900">{kw.keyword}</td>
                    <td className="text-center py-4 px-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 text-green-600 font-semibold">
                        {kw.position}
                      </span>
                    </td>
                    <td className="text-center py-4 px-2 text-gray-700">{kw.previousPosition}</td>
                    <td className="text-center py-4 px-2">
                      <span className="text-green-600">+{kw.previousPosition - kw.position} positions</span>
                    </td>
                    <td className="text-right py-4 px-2 text-gray-700">{kw.volume}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {topKeywords.length === 0 ? <div className="text-sm text-gray-500 pt-4">No keywords added yet.</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection2({ seo }: { seo: SeoCaseStudyDetail }) {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#391B66] to-[#E64761]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-white">
            <h2 className="mb-2 text-white text-xl font-semibold">{seo.cta2Title}</h2>
            <p className="text-white/90 text-base">{seo.cta2Body}</p>
          </div>
          <div className="flex-shrink-0">
            <BookCallButtonWithModal
              buttonLabel={seo?.cta2PrimaryCtaText ?? "Book Your Strategy Call"}
              className="bg-white text-[#391B66] font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
              buttonSize="lg"
              defaultServiceType="SEO / AIO Services"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsMethodologiesSection({ seo }: { seo: SeoCaseStudyDetail }) {
  const tools = seo.tools ?? [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">{seo.toolsSectionTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{seo.toolsSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                  <ImageWithFallback
                    src={network_icon as any}
                    alt={`${tool.name} logo`}
                    className="w-6 h-6 object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{tool.name}</h4>
                  <div className="text-sm text-gray-500 mb-2">{tool.category}</div>
                  <p className="text-sm text-gray-600">{tool.usage}</p>
                </div>

                <IconByKey iconKey={tool.iconKey} className="w-5 h-5 opacity-60 text-gray-500" size={20} />
              </div>
            </div>
          ))}

          {tools.length === 0 ? (
            <div className="text-sm text-gray-500 col-span-full text-center">No tools added yet.</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ClientTestimonialsSection({ seo }: { seo: SeoCaseStudyDetail }) {
  const testimonials = seo.testimonials ?? [];
  const primary = testimonials[0];

  const contactData = seo.contactData ?? [];
  const performanceMetrics = seo.performanceMetrics ?? [];
  const keywordMetrics = seo.keywordMetrics ?? [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#391B66] to-[#E64761] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white text-2xl font-bold">
            {seo.testimonialsSectionTitle}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base">
            {seo.testimonialsSectionSubtitle}
          </p>
        </div>

        {/* Testimonial Card (Centered) */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 hover:bg-white/15 transition-colors">
            {primary ? (
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left quote */}
                <div className="flex-1">
                  <IconByKey iconKey="Quote" className="w-10 h-10 text-blue-400 mb-4" size={40} />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconByKey
                        key={i}
                        iconKey="Star"
                        size={20}
                        className={`w-5 h-5 ${i < (primary.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/25"
                          }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-200 mb-6 leading-relaxed">
                    &quot;{primary.quote}&quot;
                  </p>
                </div>

                {/* Right author */}
                <div className="flex items-center gap-4 md:flex-col md:items-start md:justify-center md:min-w-[220px] pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/20 md:pl-8 w-full md:w-auto">
                  <ImageWithFallback
                    src={primary.imageUrl}
                    alt={primary.name}
                    className="w-14 h-14 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="text-white font-semibold">{primary.name}</div>
                    <div className="text-sm text-gray-300">{primary.role}</div>
                    <div className="text-sm text-blue-400">{primary.company}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/80 text-sm">No testimonial added yet.</div>
            )}
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 max-w-7xl mx-auto">
          {/* Performance Highlights */}
          <div className="bg-white rounded-xl p-6 text-gray-900 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-900 font-semibold mb-6">
              Q2 2025 Performance Highlights
            </h3>

            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-start gap-4">
                  <span className="text-gray-700 text-sm">{metric.label}</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{metric.value}</div>
                    <div className="text-green-600 text-xs">{metric.change}</div>
                  </div>
                </div>
              ))}

              {performanceMetrics.length === 0 ? (
                <div className="text-sm text-gray-500">No performance metrics yet.</div>
              ) : null}
            </div>
          </div>

          {/* Contact Submissions Chart */}
          <div className="bg-white rounded-xl p-6 text-gray-900 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-900 font-semibold mb-6">Contact Submissions</h3>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="submissions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Optional summary (only if you have data) */}
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {contactData.reduce((sum, row) => sum + (row.submissions || 0), 0)}
              </div>
              <div className="text-sm text-[#ee4962]">total submissions</div>
            </div>
          </div>

          {/* Keyword Success */}
          <div className="bg-white rounded-xl p-6 text-gray-900 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-900 font-semibold mb-6">Keyword Success</h3>

            <div className="space-y-4">
              {keywordMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-gray-700 text-sm">{metric.label}</span>
                    <span className="text-gray-500 text-sm">{metric.percentage}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-[#ee4962] text-2xl font-bold">{metric.value}</span>
                    <span className="text-gray-600 text-sm">keywords</span>
                  </div>

                  {index < keywordMetrics.length - 1 ? (
                    <div className="border-t border-gray-200 pt-2" />
                  ) : null}
                </div>
              ))}

              {keywordMetrics.length === 0 ? (
                <div className="text-sm text-gray-500">No keyword metrics yet.</div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-[#ee4962] rounded-xl p-8">
          <h3 className="mb-4 text-white text-xl font-bold">{seo.bottomCtaTitle}</h3>
          <p className="text-white mb-6 max-w-2xl mx-auto">{seo.bottomCtaBody}</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              className="bg-white text-[#ee4962] px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => {
                if (seo.bottomPrimaryCtaHref) window.location.assign(seo.bottomPrimaryCtaHref);
              }}
            >
              {seo.bottomPrimaryCtaText}
            </button>

            <button
              className="bg-white text-[#ee4962] px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => {
                if (seo.bottomSecondaryCtaHref) window.location.assign(seo.bottomSecondaryCtaHref);
              }}
            >
              {seo.bottomSecondaryCtaText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

