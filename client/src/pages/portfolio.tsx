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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import Mark_Image from "../../public/images/Mark.png";
import Dani_Image from "../../public/images/Dani.png";
import Gemma_Image from "../../public/images/Gemma.png";
import { TestimonialCard } from "@/components/TestimonialCard";
import webArtLogo from "../../public/images/website-architect-logo.jpeg";
import mdmLogo from "../../public/images/MDM Logo.png";
import nvtLogo from "../../public/images/NVT Logo.png";
import { AgencyContactFormModal } from "@/components/contact-form-popup";

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

    /* Inner case-study scroll inside card */
    .case-study-scroll {
        max-height: 260px;
        overflow-y: auto;
        padding-right: 6px;
        scroll-behavior: smooth;
    }

    .case-study-scroll::-webkit-scrollbar {
        width: 6px;
    }

    .case-study-scroll::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 999px;
    }

    .case-study-scroll::-webkit-scrollbar-thumb {
        background: #c4b5fd;
        border-radius: 999px;
    }

    .case-study-scroll::-webkit-scrollbar-thumb:hover {
        background: #a78bfa;
    }

    .case-study-scroll {
        scrollbar-width: thin;
        scrollbar-color: #a78bfa #f3f4f6;
    }
`;

// ---- Types matching schema ----------------------------------------

type CaseStudyStat = {
  label: string;
  value: string;
};

type SeoDetails = {
  seoOverview?: string;
  clientChallenge?: string;
  primarySeoGoal?: string;
  seoSummaryImage?: string;
  seoFocusAreas?: string[];
  seoStrategySummary?: string;
  seoToolsUsed?: string[];
  seoDeliverables?: string[];
  stats?: CaseStudyStat[];
};

type GoogleAdsDetails = {
  googleAdsSummaryImage?: string;
  industry?: string;
  timeline?: string;
  campaignOverview?: string;

  googleAdsClientChallenge?: string;
  primaryCampaignGoal?: string;
  campaignType?: string;

  platforms?: string[];
  monthlyAdSpend?: string;

  googleAdsStrategySummary?: string;

  targetLocations?: string[];
  trackingAndAnalytics?: string[];
  stats?: CaseStudyStat[];
};

type PortfolioItem = {
  id: number;
  slug: string;
  title: string;
  subTitle: string;
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

  // Key service selector
  serviceCategory?: string;

  // 🔗 Live site / app / download link
  projectUrl?: string;
  projectUrlLabel?: string;

  // 🔥 SEO Case Study Fields
  seoDetails?: SeoDetails;

  // 🔥 Google Ads Case Study Fields
  googleAdsDetails?: GoogleAdsDetails;
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
  heroTitle: "Our Work With Agencies Around the World",
  heroHighlight: "with Full Transparency",
  heroSubtitle:
    "Actual costs, timelines, tech stack, and ROI verified and documented. No fluff. Just results you can trust.",
  heroDescription:
    "We operate as the backend production team for partners in the UK, US, Germany, and beyond. Each case study outlines our process, tools, timelines, and the results achieved.",
  heroStats: [
    { kpi: "", label: "Projects Delivered" },
    { kpi: "", label: "Total Value Created" },
    { kpi: "", label: "Average ROI" },
  ],
  heroPrimaryCtaText: "Explore Case Studies",
  heroPrimaryCtaHref: "/#case-studies",
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

  const ordered: {
    category: (typeof serviceCategories)[0] | null;
    items: PortfolioItem[];
  }[] = [];

  serviceCategories.forEach((cat) => {
    if (grouped[cat.id]) {
      ordered.push({ category: cat, items: grouped[cat.id] });
    }
  });

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

  const projectCount = items.length;

  const parseNumericValue = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.replace(/[$,K]/g, "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  let totalValueInThousands = 0;
  items.forEach((item) => {
    if (item.totalValue) {
      totalValueInThousands += parseNumericValue(item.totalValue);
    }
  });

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

  // 🔹 Popup form control
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedServiceForForm, setSelectedServiceForForm] = useState<
    string | undefined
  >(undefined);

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
            const stats = calculatePortfolioStats(itemsArray);
            setCalculatedStats(stats);
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
                heroTitle: contentData.heroTitle || defaultContent.heroTitle,
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
  const gridItems = useMemo(() => items, [items]);

  // ✅ Force section order (SEO 3rd, Google Ads 4th) — NO useMemo needed
  const SERVICE_ORDER = [
    "dedicated-resources",
    "web-development",
    "seo",
    "google-ads",
    "ai-development",
    "custom-app-development",
    "other",
  ];

  const orderedGroups = groupPortfolioItemsByService(gridItems)
    .slice()
    .sort((a, b) => {
      const aId = a.category?.id ?? "other";
      const bId = b.category?.id ?? "other";

      const aIndex = SERVICE_ORDER.indexOf(aId);
      const bIndex = SERVICE_ORDER.indexOf(bId);

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

  useEffect(() => {
    // No longer need to reset featured expanded state
  }, [featured?.id]);

  const heroContent = content ?? defaultContent;
  const heroStats = calculatedStats;
  const testimonials =
    heroContent.testimonials && heroContent.testimonials.length > 0
      ? heroContent.testimonials
      : defaultContent.testimonials;
  const testimonialsTitle =
    heroContent.testimonialsTitle || defaultContent.testimonialsTitle;
  const testimonialsSubtitle =
    heroContent.testimonialsSubtitle || defaultContent.testimonialsSubtitle;
  const primaryCtaText =
    heroContent.heroPrimaryCtaText || defaultContent.heroPrimaryCtaText || "";
  const primaryCtaHref =
    heroContent.heroPrimaryCtaHref || defaultContent.heroPrimaryCtaHref || "/";
  const secondaryCtaText =
    heroContent.heroSecondaryCtaText ||
    defaultContent.heroSecondaryCtaText ||
    "";
  const secondaryCtaHref =
    heroContent.heroSecondaryCtaHref ||
    defaultContent.heroSecondaryCtaHref ||
    "/pricing-calculator";

  const testimonial_clients = [
    {
      id: 1,
      name: "Mark Muse",
      company: "Founder, Muse Digital Media",
      testimonial:
        "Brandingbeez understood not only the technical challenges but was also completely responsive throughout. They the provided framework, assets, and vision into a beautiful website tailored to a high-ticket offering, helping the end client stay competitive. The team stayed responsive and aware of the technical challenges, even with multiple change requests from the end client.",
      imageUrl: Mark_Image,
      logoUrl: mdmLogo,
    },
    {
      id: 2,
      name: "Daniel Fechete",
      company: "COO, New Vision Tech",
      testimonial:
        "Their attention to detail and interest in understanding our requirements perfectly stood out. Brandingbeez successfully designed the requested brochures, demonstrating a thorough understanding of the client's products and expectations. The detail-oriented team delivered the project on time and maintained constant communication through email, messaging apps, and virtual meetings.",
      imageUrl: Dani_Image,
      logoUrl: nvtLogo,
    },
    {
      id: 3,
      name: "Gemma Murphy",
      company: "Founder, Website Architect",
      testimonial:
        "Branding Beez have been a great help to my business. Before meeting Raje and her team, I was doing the sales, building the websites and handling all the tech and aftercare. Now I have the time to grow the business, working ON it, instead of constantly 'IN' it. So they've been a gamechanger for me and my business. Even taking my first holiday this year WITHOUT my laptop! Thanks so much!",
      imageUrl: Gemma_Image,
      logoUrl: webArtLogo,
    },
  ];

  // 🔹 Map category → form "Services Interested In" value
  const mapCategoryToServiceLabel = (category?: string): string => {
    switch (category) {
      case "web-development":
        return "Website Development";
      case "dedicated-resources":
        return "Dedicated Resource";
      case "seo":
        return "SEO Services";
      case "google-ads":
        return "PPC/Google Ads";
      case "custom-app-development":
      case "ai-development":
        return "Custom Web & Mobile Application Development (AI-Powered)";
      default:
        return "Website Development";
    }
  };

  // 🔹 Map category → button label text
  const getCategoryCtaText = (categoryId: string, title: string): string => {
    switch (categoryId) {
      case "web-development":
        return "White label your client Website";
      case "seo":
        return "White label your site SEO/AIO";
      case "dedicated-resources":
        return "White label your Dedicated Team";
      case "google-ads":
        return "White label your client Google Ads";
      case "custom-app-development":
        return "White label your client App Development";
      default:
        return `White label your ${title}`;
    }
  };

  const openFormForCategory = (category?: string) => {
    const mapped = mapCategoryToServiceLabel(category);
    setSelectedServiceForForm(mapped);
    setIsFormOpen(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        {/* HERO */}
        <section className="text-white py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral border-b border-white/10">
          <div className="max-w-7xl mx-auto p-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {heroContent.heroTitle}
              </h1>
              {(heroContent.heroSubtitle || heroContent.heroDescription) && (
                <div className="text-lg sm:text-xl text-white/90 mt-4 space-y-3">
                  {heroContent.heroDescription && (
                    <p className="text-base sm:text-lg text-white/80">
                      {heroContent.heroDescription}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                Each one details the problem, approach, stack, timeline, cost,
                and business impact.
              </p>
            </div>

            {/* Section Navigation */}
            {!loading && gridItems.length > 0 && (
              <div className="mb-12 p-6 bg-gradient-to-r from-brand-purple/5 to-brand-coral/5 rounded-xl border border-brand-purple/10">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                  Browse by Service
                </h3>
                <div className="flex flex-wrap gap-3">
                  {orderedGroups
                    .filter((group) => group.category)
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
                        <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          {group.items.length}
                        </span>
                      </a>
                    ))}
                </div>
              </div>
            )}

            {/* Grid grouped by service category */}
            {loading ? (
              <div className="text-center text-gray-600 py-8">Loading...</div>
            ) : (
              <div className="space-y-12">
                {orderedGroups.map((group) => (
                  <div key={group.category?.id || "other"}>
                    {/* Section Header */}
                    {group.category && (
                      <div
                        id={`section-${group.category?.id || "other"}`}
                        className="mb-8 scroll-mt-20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4">
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

                        {[
                          "dedicated-resources",
                          "web-development",
                          "seo",
                          "google-ads",
                          "custom-app-development",
                        ].includes(group.category.id) && (
                            <Button
                              className="self-start md:self-auto"
                              onClick={() => openFormForCategory(group.category.id)}
                            >
                              {getCategoryCtaText(
                                group.category.id,
                                group.category.title,
                              )}
                            </Button>
                          )}
                      </div>
                    )}

                    {/* Portfolio Carousel */}
                    <div className="relative">
                      <div
                        id={`carousel-${group.category?.id || "other"}`}
                        className="carousel-scroll flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x snap-mandatory"
                      >
                        {group.items.map((item) => {
                          const isExpanded = expandedItems[item.id] || false;

                          const effectiveDescription =
                            item.seoDetails?.seoOverview ||
                            item.googleAdsDetails?.campaignOverview ||
                            item.description;

                          const seoStats = item.seoDetails?.stats || [];
                          const googleAdsStats = item.googleAdsDetails?.stats || [];

                          const isGoogleAds = item.serviceCategory === "google-ads";

                          return (
                            <div
                              key={item.id}
                              className="
                                  flex-shrink-0 
                                  w-[88%] 
                                  sm:w-[75%] 
                                  md:w-[calc(50%-12px)] 
                                  lg:w-[calc(33.333%-16px)] 
                                  snap-center 
                                  md:snap-start
                                  first:ml-3 
                                  last:mr-3 
                                  sm:first:ml-4 
                                  sm:last:mr-4 
                                  md:first:ml-0 
                                  md:last:mr-0
                                "
                            >
                              <Card className="relative overflow-hidden h-full flex flex-col shadow-sm border hover:shadow-md transition-all duration-300 bg-white rounded-xl">
                                {/* Image */}
                                <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
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

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-5 sm:p-6 gap-4">
                                  {/* Badge + external link */}
                                  <div className="flex items-center justify-between gap-3">
                                    <span
                                      className="
  inline-flex items-center
  px-3 py-1.5
  text-xs md:text-sm
  font-bold
  text-brand-purple
  bg-brand-purple/10
  border border-brand-coral
  border-l-4 border-l-brand-coral
  rounded-md ">
                                      {item.badge ||
                                        (item.serviceCategory === "seo"
                                          ? "SEO Case Study"
                                          : item.serviceCategory === "google-ads"
                                            ? "Google Ads Case Study"
                                            : "Case Study")}
                                    </span>

                                    {item.projectUrl && (
                                      <a
                                        href={item.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm font-bold text-brand-coral hover:underline"
                                      >
                                        {item.projectUrlLabel || "View Website"}
                                        <ArrowRight className="h-4 w-4" />
                                      </a>
                                    )}
                                  </div>

                                  {/* Title + industry */}
                                  <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
                                      {item.title}
                                    </h3>
                                    <h4 className="text-md md:text-lg font-medium text-gray-800 leading-snug mb-1 line-clamp-2">
                                      {item.subTitle}
                                    </h4>
                                    <p className="text-sm md:text-base text-gray-600 font-medium">
                                      {item.industry}
                                    </p>
                                  </div>

                                  {/* Short description */}
                                  {effectiveDescription && (
                                    <p
                                      className={`text-gray-700 text-sm md:text-base leading-relaxed transition-all ${isExpanded ? "" : "line-clamp-2"
                                        }`}
                                    >
                                      {effectiveDescription}
                                    </p>
                                  )}

                                  {/* KPI chips */}
                                  {(seoStats.length > 0 ||
                                    googleAdsStats.length > 0) && (
                                      <div className="flex flex-wrap gap-2">
                                        {(seoStats.length > 0 ? seoStats : googleAdsStats)
                                          .slice(0, 3)
                                          .map((stat, idx) => (
                                            <span
                                              key={`${stat.label}-${idx}`}
                                              className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs md:text-sm font-medium text-gray-800 border border-gray-100"
                                            >
                                              <span className="mr-1 text-brand-purple font-semibold">
                                                {stat.value}
                                              </span>
                                              <span className="text-gray-600">
                                                {stat.label}
                                              </span>
                                            </span>
                                          ))}
                                      </div>
                                    )}

                                  {/* Stats grid - full width, centered content */}
                                  <div
                                    className={`w-full p-4 bg-gray-50 rounded-lg border border-gray-100 ${isGoogleAds
                                      ? "grid grid-cols-3 gap-3 justify-items-center text-center"
                                      : "grid grid-cols-2 gap-3 justify-items-center text-center"
                                      }`}
                                  >
                                    {/* Investment */}
                                    <div className="text-center">
                                      <div className="font-bold text-brand-purple text-base md:text-lg">
                                        {item.investment || "-"}
                                      </div>
                                      <div className="text-gray-500 text-xs md:text-sm mt-0.5">
                                        Investment
                                      </div>
                                    </div>

                                    {/* Value */}
                                    <div className="text-center">
                                      <div className="font-bold text-brand-purple text-base md:text-lg">
                                        {item.totalValue || "-"}
                                      </div>
                                      <div className="text-gray-500 text-xs md:text-sm mt-0.5">
                                        Value
                                      </div>
                                    </div>

                                    {/* ROI / Monthly Ad Spend – ONLY FOR GOOGLE ADS */}
                                    {isGoogleAds && (
                                      <div className="text-center">
                                        <div className="font-bold text-brand-coral text-base md:text-lg">
                                          {item.roi ||
                                            item.googleAdsDetails?.monthlyAdSpend ||
                                            "-"}
                                        </div>
                                        <div className="text-gray-500 text-xs md:text-sm mt-0.5">
                                          {item.roi ? "ROI" : "Monthly Ad Spend"}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Expanded details with INNER SCROLLBAR */}
                                  {isExpanded && (
                                    <div className="case-study-scroll mt-3 pt-3 border-t border-gray-200 space-y-4 bg-gray-50/60 rounded-md">
                                      {/* SEO Case Study – only for SEO service category */}
                                      {item.serviceCategory === "seo" && item.seoDetails && (
                                        <div className="space-y-3 px-2 pt-1">
                                          <div className="font-bold text-sm md:text-base text-gray-900 uppercase tracking-wide">
                                            SEO Case Study Snapshot
                                          </div>

                                          {item.seoDetails.clientChallenge && (
                                            <p className="text-sm text-gray-600">
                                              <span className="font-bold">
                                                Client Challenge:
                                              </span>{" "}
                                              {item.seoDetails.clientChallenge}
                                            </p>
                                          )}

                                          {item.seoDetails.primarySeoGoal && (
                                            <p className="text-sm text-gray-600">
                                              <span className="font-bold">
                                                Primary SEO Goal:
                                              </span>{" "}
                                              {item.seoDetails.primarySeoGoal}
                                            </p>
                                          )}

                                          {item.seoDetails.seoStrategySummary && (
                                            <p className="text-sm text-gray-600">
                                              <span className="font-bold">
                                                Strategy:
                                              </span>{" "}
                                              {item.seoDetails.seoStrategySummary}
                                            </p>
                                          )}

                                          {item.seoDetails.seoFocusAreas &&
                                            item.seoDetails.seoFocusAreas.length > 0 && (
                                              <div>
                                                <div className="text-sm font-bold text-gray-700 mb-1">
                                                  SEO Focus Areas
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {item.seoDetails.seoFocusAreas.map(
                                                    (fa, idx) => (
                                                      <span
                                                        key={idx}
                                                        className="inline-flex items-center rounded-full bg-brand-purple/5 text-brand-purple px-2.5 py-0.5 text-xs md:text-sm font-medium"
                                                      >
                                                        {fa}
                                                      </span>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      )}

                                      {/* Google Ads Case Study – only for Google Ads service category */}
                                      {item.serviceCategory === "google-ads" &&
                                        item.googleAdsDetails && (
                                          <div className="space-y-3 px-2 pt-1">
                                            <div className="font-bold text-sm md:text-base text-gray-900 uppercase tracking-wide">
                                              Google Ads Case Study Snapshot
                                            </div>

                                            {item.googleAdsDetails.googleAdsClientChallenge && (
                                              <p className="text-sm text-gray-600">
                                                <span className="font-bold">
                                                  Client Challenge:
                                                </span>{" "}
                                                {item.googleAdsDetails.googleAdsClientChallenge}
                                              </p>
                                            )}

                                            {item.googleAdsDetails.primaryCampaignGoal && (
                                              <p className="text-sm text-gray-600">
                                                <span className="font-bold">
                                                  Primary Goal:
                                                </span>{" "}
                                                {item.googleAdsDetails.primaryCampaignGoal}
                                              </p>
                                            )}

                                            {item.googleAdsDetails.campaignType && (
                                              <p className="text-sm text-gray-600">
                                                <span className="font-bold">
                                                  Campaign Type:
                                                </span>{" "}
                                                {item.googleAdsDetails.campaignType}
                                              </p>
                                            )}

                                            {item.googleAdsDetails.platforms &&
                                              item.googleAdsDetails.platforms.length > 0 && (
                                                <div>
                                                  <div className="text-sm font-bold text-gray-700 mb-1">
                                                    Platforms
                                                  </div>
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {item.googleAdsDetails.platforms.map(
                                                      (p, idx) => (
                                                        <span
                                                          key={idx}
                                                          className="inline-flex items-center rounded-full bg-brand-purple/5 text-brand-purple px-2.5 py-0.5 text-xs md:text-sm font-medium"
                                                        >
                                                          {p}
                                                        </span>
                                                      ),
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                          </div>
                                        )}

                                      {/* Tech Stack */}
                                      {item.techStack && item.techStack.length > 0 && (
                                        <div className="px-2">
                                          <div className="font-bold text-sm md:text-base text-gray-900 uppercase tracking-wide mb-1">
                                            Technology Stack
                                          </div>
                                          <div className="flex flex-wrap gap-1.5">
                                            {item.techStack.map((tech, idx) => (
                                              <span
                                                key={idx}
                                                className="inline-flex items-center rounded-full bg-white text-brand-purple px-2.5 py-0.5 text-xs md:text-sm font-medium border border-brand-purple/20"
                                              >
                                                {tech}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Timeline */}
                                      {item.timeline && (
                                        <div className="px-2">
                                          <div className="font-bold text-sm md:text-base text-gray-900 uppercase tracking-wide mb-1">
                                            Delivery Timeline
                                          </div>
                                          <div className="text-sm text-gray-700">
                                            {item.timeline}
                                          </div>
                                        </div>
                                      )}

                                      {/* Features */}
                                      {item.features && item.features.length > 0 && (
                                        <div className="px-2 pb-2">
                                          <div className="font-bold text-sm md:text-base text-gray-900 uppercase tracking-wide mb-1">
                                            Key Features
                                          </div>
                                          <ul className="space-y-2">
                                            {item.features.map((feature, idx) => (
                                              <li
                                                key={idx}
                                                className="flex items-start gap-2 text-sm md:text-base text-gray-700"
                                              >
                                                <CheckCircle className="h-4 w-4 text-brand-purple mt-1 flex-shrink-0" />
                                                <span>{feature}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Action Buttons – only the Show/Close details now */}
                                  <div className="flex flex-col gap-2 mt-auto pt-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-sm md:text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
                                      onClick={() => {
                                        const areAllExpanded = group.items.every(
                                          (i) => expandedItems[i.id],
                                        );

                                        if (areAllExpanded) {
                                          const collapsed: { [key: number]: boolean } =
                                            {};
                                          group.items.forEach((i) => {
                                            collapsed[i.id] = false;
                                          });
                                          setExpandedItems(collapsed);
                                        } else {
                                          const expanded: { [key: number]: boolean } =
                                            {};
                                          group.items.forEach((i) => {
                                            expanded[i.id] = true;
                                          });
                                          setExpandedItems(expanded);
                                        }
                                      }}
                                    >
                                      {group.items.every((i) => expandedItems[i.id])
                                        ? "Close All Details"
                                        : "Show All Details"}
                                      <span className="ml-2">
                                        {group.items.every((i) => expandedItems[i.id])
                                          ? "▲"
                                          : "▼"}
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          );
                        })}
                      </div>

                      {/* Carousel Arrows - md+ only */}
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
                        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-16 z-20 
             p-0 bg-transparent shadow-none hover:shadow-none"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-12 h-12 lg:w-14 lg:h-14 text-brand-purple hover:text-brand-coral transition-colors" />
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
                        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-16 z-20 
             p-0 bg-transparent shadow-none hover:shadow-none"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-12 h-12 lg:w-14 lg:h-14 text-brand-purple hover:text-brand-coral transition-colors" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials – Card + Screenshot Style */}
        <section className="bg-gray-50 py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Heading Button */}
            <div className="flex justify-center mb-6">
              <span className="text-black text-3xl sm:text-3xl lg:text-4xl font-bold">
                What Our Clients Say
              </span>
            </div>

            {/* Subheading */}
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-[18px]">
              Agencies and brands trust BrandingBeez to deliver high-impact,
              white-label solutions with care, speed, and attention to detail.
            </p>

            {/* --- MOBILE SLIDER (ONLY ≤ 480px) --- */}
            <div className="hidden max-[480px]:flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4">
              {testimonial_clients.map((t) => (
                <div key={t.id} className="min-w-[85%] snap-center">
                  <TestimonialCard
                    name={t.name}
                    company={t.company}
                    testimonial={t.testimonial}
                    imageUrl={t.imageUrl}
                    logoUrl={t.logoUrl}
                  />
                </div>
              ))}
            </div>

            {/* --- TABLET + DESKTOP GRID ( > 480px ) --- */}
            <div className="grid max-[480px]:hidden grid-cols-1 md:grid-cols-3 gap-6 text-justify">
              {testimonial_clients.map((t) => (
                <TestimonialCard
                  key={t.id}
                  name={t.name}
                  company={t.company}
                  testimonial={t.testimonial}
                  imageUrl={t.imageUrl}
                  logoUrl={t.logoUrl}
                />
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section id="estimate" className="py-16 px-4 bg-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get transparent timelines, costs, and ROI projections no surprises,
              no fluff.
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

      <AgencyContactFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        heading="Schedule Strategy Call"
        inquiryType="portfolio-case-study"
        contactFormType="portfolio-case-study"
        submissionSourceLabel="Portfolio Case Study CTA"
        thankYouTitle="Thank you! We’ve logged your interest."
        thankYouMessage="Our team will review your case study interest and get back to you within 24 hours with next steps and ideas tailored to your agency."
        thankYouFormType="strategy"
        prefillService={selectedServiceForForm}
      />

      <Footer />
    </>
  );
}

