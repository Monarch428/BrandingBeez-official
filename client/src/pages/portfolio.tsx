import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Search,
  Globe,
  Users2,
  TrendingUp,
  Bot,
  Code,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Mark_Image from "../../public/images/Mark.png";
import Dani_Image from "../../public/images/Dani.png";
import Gemma_Image from "../../public/images/Gemma.png";
import { TestimonialCard } from "@/components/TestimonialCard";
import webArtLogo from "../../public/images/website-architect-logo.jpeg"


// Custom scrollbar styles
const scrollbarStyles = `
    .carousel-scroll {
        scroll-behavior: smooth !important;
    }
    
    .carousel-scroll::-webkit-scrollbar {
        height: 6px;
    }
    
    .carousel-scroll::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    
    .carousel-scroll::-webkit-scrollbar-thumb {
        background: #ff6b5b;
        border-radius: 10px;
        transition: background 0.3s ease;
    }
    
    .carousel-scroll::-webkit-scrollbar-thumb:hover {
        background: #ff5244;
    }
    
    /* Firefox */
    .carousel-scroll {
        scrollbar-width: thin;
        scrollbar-color: #ff6b5b #f1f1f1;
    }
`;

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
  serviceCategory?: string;

  // 🔥 new fields aligned with schema
  projectUrl?: string;
  projectUrlLabel?: string;
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
    { kpi: "0%", label: "Average ROI" },
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
      quote:
        "The ROI was immediate. We saw efficiency gains within the first week.",
      who: "AC Graphics",
      tag: "Manufacturing",
    },
    {
      quote:
        "BrandingBeez delivered exactly what they promised, on time and on budget.",
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

// Service categories matching your services page
const serviceCategories = [
  {
    id: "seo",
    title: "SEO Services",
    description: "Drive organic traffic with proven SEO strategies",
    icon: Search,
  },
  {
    id: "web-development",
    title: "Website Design & Development",
    description: "Custom websites that turn visitors into lifelong customers",
    icon: Globe,
  },
  {
    id: "dedicated-resources",
    title: "Dedicated Resources",
    description:
      "Scale your agency with handpicked pros who integrate seamlessly",
    icon: Users2,
  },
  {
    id: "google-ads",
    title: "Google Ads",
    description: "Maximize ROI with expert PPC campaign management",
    icon: TrendingUp,
  },
  {
    id: "ai-development",
    title: "AI Web Agents/AI Development",
    description: "Intelligent AI solutions to automate and enhance your business",
    icon: Bot,
  },
  {
    id: "custom-app-development",
    title: "Custom Web & Mobile App Development",
    description:
      "High-performance custom apps built for scalability and seamless user experience",
    icon: Code,
  },
];

// Helper function to group portfolio items by service category
function groupPortfolioItemsByService(items: PortfolioItem[]) {
  const grouped: { [key: string]: PortfolioItem[] } = {};

  items.forEach((item) => {
    const category = item.serviceCategory || "other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });

  // Return groups in the order of serviceCategories
  const ordered: {
    category: (typeof serviceCategories)[0] | null;
    items: PortfolioItem[];
  }[] = [];

  serviceCategories.forEach((cat) => {
    if (grouped[cat.id]) {
      ordered.push({ category: cat, items: grouped[cat.id] });
    }
  });

  // Add any items without a category at the end
  if (grouped["other"]) {
    ordered.push({ category: null, items: grouped["other"] });
  }

  return ordered;
}

// Calculate stats from portfolio items
function calculatePortfolioStats(items: PortfolioItem[]): PortfolioHeroStat[] {
  if (!items || items.length === 0) {
    return defaultContent.heroStats;
  }

  // Count ALL projects (not just active ones)
  const projectCount = items.length;

  // Helper function to parse numeric values from strings
  const parseNumericValue = (value: string): number => {
    if (!value) return 0;
    // Remove $ symbol, commas, and "K" suffix, keep decimals
    const cleaned = value.replace(/[$,K]/g, "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate total value (sum of totalValue)
  // Note: totalValue is already in thousands (e.g., "7.5K" means $7,500)
  let totalValueInThousands = 0;
  items.forEach((item) => {
    if (item.totalValue) {
      totalValueInThousands += parseNumericValue(item.totalValue);
    }
  });

  // Calculate average ROI
  let totalRoi = 0;
  let roiCount = 0;
  items.forEach((item) => {
    if (item.roi) {
      const roiValue = parseNumericValue(item.roi);
      if (roiValue > 0) {
        totalRoi += roiValue;
        roiCount++;
      }
    }
  });
  const averageRoi = roiCount > 0 ? Math.round(totalRoi / roiCount) : 0;

  // Format total value with proper decimal places
  const formattedTotalValue =
    totalValueInThousands > 0
      ? `$${totalValueInThousands.toFixed(1)}K`
      : "$0K";

  return [
    {
      kpi: `${projectCount}+`,
      label: "Projects Delivered",
    },
    {
      kpi: formattedTotalValue,
      label: "Total Value Created",
    },
    {
      kpi: `${averageRoi}%`,
      label: "Average ROI",
    },
  ];
}

// Save calculated stats to database
async function saveStatsToDatabase(
  stats: PortfolioHeroStat[],
): Promise<boolean> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("adminToken")
        : null;

    if (!token) {
      console.log("Not authenticated - skipping stats save");
      return false;
    }

    const response = await fetch("/api/admin/portfolio-content/stats", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ heroStats: stats }),
    });

    if (!response.ok) {
      console.error("Failed to save stats to database");
      return false;
    }

    console.log("Stats saved to database successfully");
    return true;
  } catch (error) {
    console.error("Error saving stats to database:", error);
    return false;
  }
}

  const testimonials = [
    {
      id: 1,
      name: "Mark Muse",
      company: "Partner",
      testimonial: "Brandingbeez understood not only the technical challenges but was also completely responsive throughout. They the provided framework, assets, and vision into a beautiful website tailored to a high-ticket offering, helping the end client stay competitive. The team stayed responsive and aware of the technical challenges, even with multiple change requests from the end client.",
      imageUrl: Mark_Image
    },
    {
      id: 2,
      name: "Daniel Fechete",
      company: "Creative Partner",
      testimonial: "Their attention to detail and interest in understanding our requirements perfectly stood out. Brandingbeez successfully designed the requested brochures, demonstrating a thorough understanding of the client's products and expectations. The detail-oriented team delivered the project on time and maintained constant communication through email, messaging apps, and virtual meetings.",
      imageUrl: Dani_Image
    },
    {
      id: 3,
      name: "Gemma Murphy",
      company: "Founder, Website Architect",
      testimonial: "Branding Beez have been a great help to my business. Before meeting Rale and her team, I was doing the sales, building the websites and handling all the tech and aftercare. Now I have the time to grow the business, working ON it, instead of constantly 'IN' it. So they've been a gamechanger for me and my business. Even taking my first holiday this year WITHOUT my laptop! Thanks so much!",
      imageUrl: Gemma_Image,
      logoUrl: webArtLogo
    }
  ];


export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [calculatedStats, setCalculatedStats] = useState<PortfolioHeroStat[]>(
    defaultContent.heroStats,
  );
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  // Inject custom scrollbar styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [itemsRes, contentRes] = await Promise.all([
          fetch("/api/portfolio", { headers: { "Cache-Control": "no-cache" } }),
          fetch("/api/portfolio/content", {
            headers: { "Cache-Control": "no-cache" },
          }),
        ]);

        try {
          const itemsData = await itemsRes.json();
          if (!cancelled) {
            const itemsArray = Array.isArray(itemsData) ? itemsData : [];
            setItems(itemsArray);
            // Calculate stats from items
            const stats = calculatePortfolioStats(itemsArray);
            setCalculatedStats(stats);
            // Save stats to database if authenticated
            await saveStatsToDatabase(stats);
          }
        } catch (itemsError) {
          console.error("Failed to parse portfolio items", itemsError);
          if (!cancelled) {
            setItems([]);
            setCalculatedStats(defaultContent.heroStats);
          }
        }

        if (!cancelled) {
          if (contentRes.ok) {
            try {
              const contentData = await contentRes.json();
              setContent({
                heroTitle:
                  contentData.heroTitle || defaultContent.heroTitle,
                heroHighlight: contentData.heroHighlight || "",
                heroSubtitle: contentData.heroSubtitle || "",
                heroDescription: contentData.heroDescription || "",
                heroStats: Array.isArray(contentData.heroStats)
                  ? contentData.heroStats
                  : [],
                heroPrimaryCtaText:
                  contentData.heroPrimaryCtaText ||
                  defaultContent.heroPrimaryCtaText,
                heroPrimaryCtaHref:
                  contentData.heroPrimaryCtaHref ||
                  defaultContent.heroPrimaryCtaHref,
                heroSecondaryCtaText:
                  contentData.heroSecondaryCtaText ||
                  defaultContent.heroSecondaryCtaText,
                heroSecondaryCtaHref:
                  contentData.heroSecondaryCtaHref ||
                  defaultContent.heroSecondaryCtaHref,
                testimonialsTitle:
                  contentData.testimonialsTitle ||
                  defaultContent.testimonialsTitle,
                testimonialsSubtitle:
                  contentData.testimonialsSubtitle ||
                  defaultContent.testimonialsSubtitle,
                testimonials: Array.isArray(contentData.testimonials)
                  ? contentData.testimonials
                  : [],
              });
            } catch (contentError) {
              console.error(
                "Failed to parse portfolio content",
                contentError,
              );
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
          setCalculatedStats(defaultContent.heroStats);
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
    [items],
  );
  // Don't filter out featured from gridItems - include all items for section grouping
  const gridItems = useMemo(() => items, [items]);

  useEffect(() => {
    // No longer need to reset featured expanded state
  }, [featured?.id]);

  const heroContent = content ?? defaultContent;
  // Use calculated stats from portfolio items instead of static content
  const heroStats = calculatedStats;
  const testimonials =
    heroContent.testimonials && heroContent.testimonials.length > 0
      ? heroContent.testimonials
      : defaultContent.testimonials;
  const testimonialsTitle =
    heroContent.testimonialsTitle || defaultContent.testimonialsTitle;
  const testimonialsSubtitle =
    heroContent.testimonialsSubtitle ||
    defaultContent.testimonialsSubtitle;
  const primaryCtaText =
    heroContent.heroPrimaryCtaText ||
    defaultContent.heroPrimaryCtaText ||
    "";
  const primaryCtaHref =
    heroContent.heroPrimaryCtaHref ||
    defaultContent.heroPrimaryCtaHref ||
    "/";
  const secondaryCtaText =
    heroContent.heroSecondaryCtaText ||
    defaultContent.heroSecondaryCtaText ||
    "";
  const secondaryCtaHref =
    heroContent.heroSecondaryCtaHref ||
    defaultContent.heroSecondaryCtaHref ||
    "/pricing-calculator";

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
                    <span className="font-extrabold">
                      {heroContent.heroHighlight}
                    </span>
                  </>
                )}
              </h1>
              {(heroContent.heroSubtitle ||
                heroContent.heroDescription) && (
                <div className="text-lg sm:text-xl text-white/90 mt-4 space-y-3">
                  {heroContent.heroSubtitle && (
                    <p>{heroContent.heroSubtitle}</p>
                  )}
                  {heroContent.heroDescription && (
                    <p className="text-base sm:text-lg text-white/80">
                      {heroContent.heroDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Stats (glassy) */}
              {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {heroStats.map((s, i) => (
                  <div
                    key={`${s.kpi}-${s.label}-${i}`}
                    className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-6 text-center"
                  >
                    <div className="text-3xl font-bold mb-1">{s.kpi}</div>
                    <div className="text-sm text-white/80">{s.label}</div>
                  </div>
                ))}
              </div> */}

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* {primaryCtaText && (
                  <Link href={primaryCtaHref}>
                    <Button className="bg-white text-brand-purple hover:bg-brand-purple hover:text-white">
                      {primaryCtaText}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )} */}
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Transparent, Documented Case Studies
              </h2>
              <p className="text-base md:text-lg text-gray-700 mt-2">
                Each one details the problem, approach, stack, timeline,
                cost, and business impact.
              </p>
            </div>

            {/* Section Navigation */}
            {!loading && gridItems.length > 0 && (
              <div className="mb-12 p-6 bg-gradient-to-r from-brand-purple/5 to-brand-coral/5 rounded-xl border border-brand-purple/10">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Browse by Service
                </h3>
                <div className="flex flex-wrap gap-3">
                  {groupPortfolioItemsByService(gridItems)
                    .filter((group) => group.category) // Only show groups with categories
                    .map((group) => (
                      <a
                        key={group.category?.id}
                        href={`#section-${group.category?.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-brand-purple hover:text-brand-purple transition-all duration-200 text-gray-700 hover:shadow-md cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(
                            `section-${group.category?.id}`,
                          );
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                      >
                        {group.category?.icon && (
                          <group.category.icon className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {group.category?.title}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          {group.items.length}
                        </span>
                      </a>
                    ))}
                </div>
              </div>
            )}

            {/* Featured (simple wide card) */}
            {/* {featured && featured.serviceCategory && (
              <div className="mb-12 p-6 bg-blue-50 border-l-4 border-brand-purple rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Featured Project:</span> This item will be displayed in the <strong>{serviceCategories.find(c => c.id === featured.serviceCategory)?.title}</strong> section below
                </p>
              </div>
            )} */}

            {/* Grid grouped by service category */}
            {loading ? (
              <div className="text-center text-gray-600 py-8">
                Loading...
              </div>
            ) : (
              <div className="space-y-12">
                {groupPortfolioItemsByService(gridItems).map(
                  (group, groupIndex) => (
                    <div key={group.category?.id || "other"}>
                      {/* Section Header */}
                      {group.category && (
                        <div
                          id={`section-${group.category?.id || "other"}`}
                          className="mb-8 scroll-mt-20"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            {group.category.icon && (
                              <div className="p-3 rounded-lg bg-brand-purple/10">
                                <group.category.icon className="w-8 h-8 text-brand-purple" />
                              </div>
                            )}
                            <div>
                              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {group.category.title}
                              </h2>
                              <p className="text-gray-600 mt-1">
                                {group.category.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Portfolio Carousel */}
                      <div className="relative">
                        <div
                          id={`carousel-${group.category?.id || "other"}`}
                          className="carousel-scroll flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory"
                        >
                          {group.items.map((item) => {
                            const isExpanded =
                              expandedItems[item.id] || false;
                            return (
                              <div
                                key={item.id}
                                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
                              >
                                <Card className="relative overflow-hidden h-full flex flex-col shadow-sm border hover:shadow-md transition-all duration-300 bg-white">
                                  {/* Featured Badge */}
                                  {/* {item.isFeatured && (
                                    <div className="absolute top-3 right-3 z-10">
                                      <div className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                                        <Star className="w-3 h-3 fill-current" />
                                        Featured
                                      </div>
                                    </div>
                                  )} */}

                                  {/* Image Section - Full Width at Top */}
                                  <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
                                    <img
                                      src={
                                        item.imageUrl ||
                                        "/images/industry-digital-marketing.png"
                                      }
                                      alt={item.title}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                  </div>

                                  {/* Card Content - Scrollable Section */}
                                  <div className="flex flex-col flex-1 p-5">
                                    {/* Badge */}
                                    <div className="mb-3">
                                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-brand-purple/10 text-brand-purple">
                                        {item.badge || "Case Study"}
                                      </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
                                      {item.title}
                                    </h3>

                                    {/* Industry */}
                                    <p className="text-xs text-gray-600 mb-3 font-medium">
                                      {item.industry}
                                    </p>

                                    {/* Description - Collapsible */}
                                    <p
                                      className={`text-gray-700 text-sm leading-relaxed mb-4 transition-all ${
                                        isExpanded ? "" : "line-clamp-2"
                                      }`}
                                    >
                                      {item.description}
                                    </p>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                                      <div className="text-center">
                                        <div className="font-bold text-brand-purple text-sm">
                                          {item.investment || "-"}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-0.5">
                                          Investment
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <div className="font-bold text-brand-purple text-sm">
                                          {item.totalValue || "-"}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-0.5">
                                          Value
                                        </div>
                                      </div>
                                      {item.serviceCategory ===
                                        "google-ads" && (
                                        <div className="text-center">
                                          <div className="font-bold text-brand-coral text-sm">
                                            {item.roi || "-"}
                                          </div>
                                          <div className="text-gray-500 text-xs mt-0.5">
                                            ROI
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Expandable Details Section */}
                                    {isExpanded && (
                                      <div className="space-y-4 mb-4 pb-4 border-b border-gray-200">
                                        {/* Tech Stack */}
                                        {item.techStack &&
                                          item.techStack.length > 0 && (
                                            <div>
                                              <div className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2">
                                                Technology Stack
                                              </div>
                                              <div className="flex flex-wrap gap-2">
                                                {item.techStack.map(
                                                  (tech, idx) => (
                                                    <span
                                                      key={idx}
                                                      className="inline-flex items-center rounded-full bg-brand-purple/10 text-brand-purple px-2.5 py-1 text-xs font-medium"
                                                    >
                                                      {tech}
                                                    </span>
                                                  ),
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {/* Timeline */}
                                        {item.timeline && (
                                          <div>
                                            <div className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2">
                                              Delivery Timeline
                                            </div>
                                            <div className="text-gray-700 text-sm">
                                              {item.timeline}
                                            </div>
                                          </div>
                                        )}

                                        {/* Features */}
                                        {item.features &&
                                          item.features.length > 0 && (
                                            <div>
                                              <div className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2">
                                                Key Features
                                              </div>
                                              <ul className="space-y-2">
                                                {item.features.map(
                                                  (feature, idx) => (
                                                    <li
                                                      key={idx}
                                                      className="flex items-start gap-2 text-gray-700 text-sm"
                                                    >
                                                      <CheckCircle className="h-4 w-4 text-brand-purple mt-0.5 flex-shrink-0" />
                                                      <span>{feature}</span>
                                                    </li>
                                                  ),
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 mt-auto pt-2">
                                      {/* Toggle all in section button */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                                        onClick={() => {
                                          const areAllExpanded =
                                            group.items.every(
                                              (i) => expandedItems[i.id],
                                            );

                                          if (areAllExpanded) {
                                            // collapse all
                                            const collapsed: {
                                              [key: number]: boolean;
                                            } = {};
                                            group.items.forEach((i) => {
                                              collapsed[i.id] = false;
                                            });
                                            setExpandedItems(collapsed);
                                          } else {
                                            // expand all
                                            const expanded: {
                                              [key: number]: boolean;
                                            } = {};
                                            group.items.forEach((i) => {
                                              expanded[i.id] = true;
                                            });
                                            setExpandedItems(expanded);
                                          }
                                        }}
                                      >
                                        {group.items.every(
                                          (i) => expandedItems[i.id],
                                        )
                                          ? "Close All Details"
                                          : "Show All Details"}
                                        <span className="ml-2">
                                          {group.items.every(
                                            (i) => expandedItems[i.id],
                                          )
                                            ? "▲"
                                            : "▼"}
                                        </span>
                                      </Button>

                                      {/* 🔗 NEW: External project link button */}
                                      {item.projectUrl && (
                                        <Button
                                          size="sm"
                                          className="w-full h-9 text-xs font-semibold bg-brand-purple text-white hover:bg-brand-purple/90 transition-all"
                                          asChild
                                        >
                                          <a
                                            href={item.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {item.projectUrlLabel ||
                                              "View Project"}
                                            <ArrowRight className="ml-2 h-3 w-3" />
                                          </a>
                                        </Button>
                                      )}

                                      {/* View Case Study Button 
                                      <Button 
                                        className="w-full h-9 text-xs font-semibold bg-brand-purple text-white hover:bg-brand-purple/90 transition-all"
                                        asChild
                                      >
                                        <Link href={`/portfolio/${item.slug}`}>
                                          View Case Study
                                          <ArrowRight className="ml-2 h-3 w-3" />
                                        </Link>
                                      </Button> */}
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => {
                            const carousel = document.getElementById(
                              `carousel-${group.category?.id || "other"}`,
                            );
                            if (carousel) {
                              carousel.scrollBy({
                                left: -400,
                                behavior: "smooth",
                              });
                            }
                          }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-20 
             p-0 bg-transparent shadow-none hover:shadow-none"
                          aria-label="Scroll left"
                        >
                          <ChevronLeft className="w-14 h-14 text-brand-purple hover:text-brand-coral transition-colors" />
                        </button>

                        <button
                          onClick={() => {
                            const carousel = document.getElementById(
                              `carousel-${group.category?.id || "other"}`,
                            );
                            if (carousel) {
                              carousel.scrollBy({
                                left: 400,
                                behavior: "smooth",
                              });
                            }
                          }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-20 
             p-0 bg-transparent shadow-none hover:shadow-none"
                          aria-label="Scroll right"
                        >
                          <ChevronRight className="w-14 h-14 text-brand-purple hover:text-brand-coral transition-colors" />
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </section>

          {/* Testimonials – Card + Screenshot Style */}
          <section className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Heading Button */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 bg-brand-coral text-white font-medium px-6 py-2 rounded-full shadow-lg">
                  {/* <span className="w-2 h-2 bg-white rounded-full"></span> */}
                  <span>What Our Clients Say</span>
                </div>
              </div>

              {/* Subheading Text */}
              <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-[18px]">
                Agencies and brands trust BrandingBeez to deliver high-impact, white-label solutions with care, speed, and attention to detail.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    name={testimonial.name}
                    company={testimonial.company}
                    testimonial={testimonial.testimonial}
                    imageUrl={testimonial.imageUrl}
                    logoUrl={testimonial.logoUrl}
                  />
                ))}
              </div>
            </div>
          </section

        {/* BOTTOM CTA (same style as your CTA section) */}
        <section
          id="estimate"
          className="py-16 px-4 bg-brand-purple text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get transparent timelines, costs, and ROI projections no
              surprises, no fluff.
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
