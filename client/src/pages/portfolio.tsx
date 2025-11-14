import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";

type PortfolioItem = {
    id: number;
    slug: string;
    title: string;
    industry: string;
    client?: string;
    badge?: string;
    investment?: string;
    totalValue?: string;
    roi?: string;
    description?: string;
    features?: string[];
    techStack?: string[];
    timeline?: string;
    imageUrl?: string;
    image?: string;
    isFeatured: boolean;
    orderIndex: number;
    isActive: boolean;
};

type PortfolioHeroStat = {
    kpi: string;
    label: string;
};

type PortfolioTestimonial = {
    quote: string;
    who: string;
    tag?: string;
};

type PortfolioContent = {
    heroTitle: string;
    heroHighlight?: string;
    heroSubtitle?: string;
    heroDescription?: string;
    heroStats: PortfolioHeroStat[];
    heroPrimaryCtaText?: string;
    heroPrimaryCtaHref?: string;
    heroSecondaryCtaText?: string;
    heroSecondaryCtaHref?: string;
    testimonialsTitle?: string;
    testimonialsSubtitle?: string;
    testimonials: PortfolioTestimonial[];
};

const defaultContent: PortfolioContent = {
    heroTitle: "Real AI Solutions We’ve Built",
    heroHighlight: "with Full Transparency",
    heroSubtitle:
        "Actual costs, timelines, tech stack, and ROI verified and documented. No fluff. Just results you can trust.",
    heroDescription:
        "We partner with founders and teams to ship automation and AI products that deliver measurable ROI in weeks, not months.",
    heroStats: [
        { kpi: "15+", label: "Projects Delivered" },
        { kpi: "$127K", label: "Total Value Created" },
        { kpi: "325%", label: "Average ROI" },
    ],
    heroPrimaryCtaText: "Explore Case Studies",
    heroPrimaryCtaHref: "/case-studies",
    heroSecondaryCtaText: "Get an Estimate",
    heroSecondaryCtaHref: "/pricing-calculator",
    testimonialsTitle: "What Our Clients Say",
    testimonialsSubtitle:
        "Transparent pricing, predictable delivery, and partners who stay accountable end to end.",
    testimonials: [
        {
            quote: "The ROI was immediate. We saw efficiency gains within the first week.",
            who: "AC Graphics",
            tag: "Manufacturing",
        },
        {
            quote: "BrandingBeez delivered exactly what they promised, on time and on budget.",
            who: "Wellenpuls",
            tag: "HealthTech",
        },
        {
            quote: "Finally, an agency that shows you the real costs upfront.",
            who: "Digital Identity Client",
            tag: "SaaS Startup",
        },
    ],
};

// Small, reusable local card (no external imports)
function StudyCard({ cs }: { cs: PortfolioItem }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all">
            {/* Image (uniform ratio) */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                <img
                    src={cs.imageUrl || "/images/industry-digital-marketing.png"}
                    alt={cs.title}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-6">
                {/* Badge + Title */}
                <div className="mb-2">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-brand-purple/10 text-brand-purple">
                        {cs.badge || "Case Study"}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {cs.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{cs.industry}</p>

                {/* Description */}
                <p className="mt-3 text-gray-700 leading-relaxed line-clamp-3">
                    {cs.description}
                </p>

                {/* Stats row */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg border border-gray-200 p-3 text-center">
                        <div className="font-semibold text-brand-purple">{cs.investment || "-"}</div>
                        <div className="text-gray-500">Investment</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 text-center">
                        <div className="font-semibold text-brand-purple">{cs.totalValue || "-"}</div>
                        <div className="text-gray-500">Value</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 text-center">
                        <div className="font-semibold text-brand-coral">{cs.roi || "-"}</div>
                        <div className="text-gray-500">ROI</div>
                    </div>
                </div>

                {/* Tech + Timeline */}
                <div className="mt-4 text-sm text-gray-600">
                    <div>
                        <span className="font-semibold text-gray-800">Tech:</span>{" "}
                        {(cs.techStack || []).join(", ")}
                    </div>
                    <div className="mt-1">
                        <span className="font-semibold text-gray-800">Timeline:</span>{" "}
                        {cs.timeline || "-"}
                    </div>
                </div>

                {/* CTA pinned to bottom */}
                <div className="mt-auto pt-5 border-t border-gray-100">
                    <Button
                        variant="outline"
                        className="w-full h-11 text-sm font-medium border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ? "Hide Details" : "Read Full Case Study"}
                        <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </Button>
                </div>
            </div>

            {expanded && (
                <div className="border-t border-gray-200 bg-brand-wings/20 px-6 py-5 space-y-4 text-sm text-gray-700">
                    {/* {cs.client && (
                        <div>
                            <span className="font-semibold text-gray-900">Client:</span> {cs.client}
                        </div>
                    )} */}
                    {cs.description && <p className="leading-relaxed">{cs.description}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="font-semibold text-gray-900 mb-2">Key Features</div>
                            <div className="space-y-2">
                                {(cs.features && cs.features.length > 0 ? cs.features : ["Details coming soon"]).map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-gray-700">
                                        <CheckCircle className="h-4 w-4 text-brand-purple mt-0.5" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                            <div className="font-semibold text-gray-900 mb-2">Tech Stack</div>
                            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-medium">
                                {(cs.techStack && cs.techStack.length > 0 ? cs.techStack : ["Tech stack not disclosed"]).map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center rounded-full bg-brand-purple text-white px-3 py-1"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    {cs.timeline && (
                        <div>
                            <span className="font-semibold text-gray-900">Delivery Timeline:</span> {cs.timeline}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<PortfolioContent | null>(null);
    const [featuredExpanded, setFeaturedExpanded] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const [itemsRes, contentRes] = await Promise.all([
                    fetch("/api/portfolio", { headers: { "Cache-Control": "no-cache" } }),
                    fetch("/api/portfolio/content", { headers: { "Cache-Control": "no-cache" } }),
                ]);

                try {
                    const itemsData = await itemsRes.json();
                    if (!cancelled) {
                        setItems(Array.isArray(itemsData) ? itemsData : []);
                    }
                } catch (itemsError) {
                    console.error("Failed to parse portfolio items", itemsError);
                    if (!cancelled) {
                        setItems([]);
                    }
                }

                if (!cancelled) {
                    if (contentRes.ok) {
                        try {
                            const contentData = await contentRes.json();
                            setContent({
                                heroTitle: contentData.heroTitle || defaultContent.heroTitle,
                                heroHighlight: contentData.heroHighlight || "",
                                heroSubtitle: contentData.heroSubtitle || "",
                                heroDescription: contentData.heroDescription || "",
                                heroStats: Array.isArray(contentData.heroStats)
                                    ? contentData.heroStats
                                    : [],
                                heroPrimaryCtaText:
                                    contentData.heroPrimaryCtaText || defaultContent.heroPrimaryCtaText,
                                heroPrimaryCtaHref:
                                    contentData.heroPrimaryCtaHref || defaultContent.heroPrimaryCtaHref,
                                heroSecondaryCtaText:
                                    contentData.heroSecondaryCtaText || defaultContent.heroSecondaryCtaText,
                                heroSecondaryCtaHref:
                                    contentData.heroSecondaryCtaHref || defaultContent.heroSecondaryCtaHref,
                                testimonialsTitle:
                                    contentData.testimonialsTitle || defaultContent.testimonialsTitle,
                                testimonialsSubtitle:
                                    contentData.testimonialsSubtitle || defaultContent.testimonialsSubtitle,
                                testimonials: Array.isArray(contentData.testimonials)
                                    ? contentData.testimonials
                                    : [],
                            });
                        } catch (contentError) {
                            console.error("Failed to parse portfolio content", contentError);
                            setContent(null);
                        }
                    } else {
                        setContent(null);
                    }
                }
            } catch (error) {
                console.error("Failed to load portfolio data", error);
                if (!cancelled) {
                    setItems([]);
                    setContent(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, []);

    const featured = useMemo(
        () => items.find((i) => i.isFeatured) || items[0],
        [items]
    );
    const gridItems = useMemo(
        () => items.filter((i) => !featured || i.id !== featured.id),
        [items, featured]
    );

    useEffect(() => {
        setFeaturedExpanded(false);
    }, [featured?.id]);

    const heroContent = content ?? defaultContent;
    const heroStats =
        heroContent.heroStats && heroContent.heroStats.length > 0
            ? heroContent.heroStats
            : defaultContent.heroStats;
    const testimonials =
        heroContent.testimonials && heroContent.testimonials.length > 0
            ? heroContent.testimonials
            : defaultContent.testimonials;
    const testimonialsTitle = heroContent.testimonialsTitle || defaultContent.testimonialsTitle;
    const testimonialsSubtitle =
        heroContent.testimonialsSubtitle || defaultContent.testimonialsSubtitle;
    const primaryCtaText = heroContent.heroPrimaryCtaText || defaultContent.heroPrimaryCtaText || "";
    const primaryCtaHref = heroContent.heroPrimaryCtaHref || defaultContent.heroPrimaryCtaHref || "/";
    const secondaryCtaText =
        heroContent.heroSecondaryCtaText || defaultContent.heroSecondaryCtaText || "";
    const secondaryCtaHref =
        heroContent.heroSecondaryCtaHref || defaultContent.heroSecondaryCtaHref || "/pricing-calculator";

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
                {/* HERO (same palette & feel as your Services hero) */}
                <section className="text-white py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral border-b border-white/10">
                    <div className="max-w-7xl mx-auto p-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                {heroContent.heroTitle}
                                {heroContent.heroHighlight && (
                                    <>
                                        {" "}
                                        <span className="font-extrabold">{heroContent.heroHighlight}</span>
                                    </>
                                )}
                            </h1>
                            {(heroContent.heroSubtitle || heroContent.heroDescription) && (
                                <div className="text-lg sm:text-xl text-white/90 mt-4 space-y-3">
                                    {heroContent.heroSubtitle && <p>{heroContent.heroSubtitle}</p>}
                                    {heroContent.heroDescription && (
                                        <p className="text-base sm:text-lg text-white/80">
                                            {heroContent.heroDescription}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Stats (glassy) */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                {heroStats.map((s, i) => (
                                    <div
                                        key={`${s.kpi}-${s.label}-${i}`}
                                        className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-6 text-center"
                                    >
                                        <div className="text-3xl font-bold mb-1">{s.kpi}</div>
                                        <div className="text-sm text-white/80">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                {primaryCtaText && (
                                    <Link href={primaryCtaHref}>
                                        <Button className="bg-white text-brand-purple hover:bg-brand-purple hover:text-white">
                                            {primaryCtaText}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                                {secondaryCtaText && (
                                    <Link href={secondaryCtaHref}>
                                        <Button
                                            variant="outline"
                                            className="border-2 border-white bg-transparent text-white hover:bg-brand-purple hover:text-white hover:border-brand-purple"
                                        >
                                            {secondaryCtaText}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CASE STUDIES */}
                <section id="case-studies" className="py-12 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Transparent, Documented Case Studies
                            </h2>
                            <p className="text-base md:text-lg text-gray-700 mt-2">
                                Each one details the problem, approach, stack, timeline, cost, and business impact.
                            </p>
                        </div>

                        {/* Featured (simple wide card) */}
                        {featured && (
                            <div className="mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full">
                                        <img
                                            src={featured.imageUrl || "/images/industry-digital-marketing.png"}
                                            alt={`Featured: ${featured.title}`}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="p-8 lg:p-10 flex flex-col">
                                        <span className="inline-flex w-fit items-center rounded-full bg-brand-purple/10 text-brand-purple px-3 py-1 text-xs font-semibold">
                                            {featured.badge || "Featured Case Study"}
                                        </span>
                                        <h3 className="mt-3 text-3xl font-bold text-gray-900">
                                            {featured.title}
                                        </h3>
                                        {/* {featured.client && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                Client: <span className="font-semibold text-gray-900">{featured.client}</span>
                                            </p>
                                        )} */}
                                        <p className="mt-3 text-gray-700 leading-relaxed">
                                            {featured.description || ""}
                                        </p>

                                        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                                            <div className="rounded-lg border border-gray-200 p-3 text-center">
                                                <div className="font-semibold text-brand-purple">{featured.investment || "-"}</div>
                                                <div className="text-gray-500">Investment</div>
                                            </div>
                                            <div className="rounded-lg border border-gray-200 p-3 text-center">
                                                <div className="font-semibold text-brand-purple">{featured.totalValue || "-"}</div>
                                                <div className="text-gray-500">Value</div>
                                            </div>
                                            <div className="rounded-lg border border-gray-200 p-3 text-center">
                                                <div className="font-semibold text-brand-coral">{featured.roi || "-"}</div>
                                                <div className="text-gray-500">ROI</div>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6">
                                            <Button
                                                variant="outline"
                                                className="w-full h-11 text-sm font-medium border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
                                                onClick={() => setFeaturedExpanded((prev) => !prev)}
                                            >
                                                {featuredExpanded ? "Hide Details" : "Read Full Case Study"}
                                                <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${featuredExpanded ? "rotate-90" : ""}`} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {featuredExpanded && (
                                    <div className="border-t border-gray-200 bg-brand-wings/30 px-8 lg:px-10 py-6 space-y-4 text-sm text-gray-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="font-semibold text-gray-900 mb-2">Key Features</div>
                                                <div className="space-y-2">
                                                    {(featured.features && featured.features.length > 0 ? featured.features : ["Details coming soon"]).map((feature, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 text-gray-700">
                                                            <CheckCircle className="h-4 w-4 text-brand-purple mt-0.5" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 mb-2">Tech Stack</div>
                                                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-medium">
                                                    {(featured.techStack && featured.techStack.length > 0 ? featured.techStack : ["Tech stack not disclosed"]).map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center rounded-full bg-brand-purple text-white px-3 py-1"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {featured.timeline && (
                                            <div>
                                                <span className="font-semibold text-gray-900">Delivery Timeline:</span> {featured.timeline}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {loading ? (
                                <div className="col-span-2 text-center text-gray-600">Loading...</div>
                            ) : (
                                gridItems.map((cs) => <StudyCard key={cs.id} cs={cs} />)
                            )}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="border-y border-gray-100 bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
                            {testimonialsTitle}
                        </h2>
                        {testimonialsSubtitle && (
                            <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
                                {testimonialsSubtitle}
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {testimonials.map((t, idx) => (
                                <div key={`${t.who}-${idx}`} className="rounded-lg border border-gray-200 bg-white p-6">
                                    <p className="text-gray-700 mb-4">“{t.quote}”</p>
                                    <div className="font-bold text-gray-900">{t.who}</div>
                                    {t.tag && <div className="text-sm text-gray-500">{t.tag}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BOTTOM CTA (same style as your CTA section) */}
                <section id="estimate" className="py-16 px-4 bg-brand-purple text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Get transparent timelines, costs, and ROI projections — no surprises, no fluff.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link href="/pricing-calculator">
                                <Button className="bg-brand-coral hover:bg-white hover:text-brand-purple text-white px-8 py-4 font-bold transition-all duration-300">
                                    Get Your Project Estimate
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>

                            <Link href="/contact?service=AI%20Solutions">
                                <Button
                                    variant="outline"
                                    className="border-2 border-brand-purple text-brand-purple hover:bg-brand-coral hover:text-white bg-white px-8 py-4 font-bold transition-all duration-300"
                                >
                                    <Users className="mr-2 h-5 w-5" />
                                    Join Our Community
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
