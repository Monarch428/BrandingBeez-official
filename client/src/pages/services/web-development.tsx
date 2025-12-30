import React, { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import socialLandImage from "@assets/img_three.png";
import { Link } from "wouter";
import {
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Gift,
  ChevronDown,
  HelpCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { WebDevelopmentSchema } from "@/utils/all-schemas";
import { navigate } from "wouter/use-browser-location";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import AgencyContactSection from "@/components/agency-contact-section";
import { PhaseSliderSection, type PhaseItem } from "@/components/phase-slider-section";

export interface WebCaseStudyCardResults {
  performance: string;
  conversions: string;
  users: string;
}

export interface WebCaseStudyCard {
  id: number;
  slug?: string;

  title: string;
  client: string;
  industry: string;

  description: string;

  results: WebCaseStudyCardResults;

  // ✅ image shown on card (from backend)
  imageUrl?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";

  link?: string;
  status?: "draft" | "published";

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Featured client data
const featuredClient = {
  name: "SocialLand Digital",
  logo: socialLandImage,
  website: "https://socialland.co.uk",
  description:
    "Our first UK white-label project - a professional, scalable WordPress website for a leading digital marketing agency that sparked a 2-year partnership.",
  achievements: [
    "Professional WordPress website with modern design",
    "Service-focused layouts highlighting agency capabilities",
    "Portfolio/Work section showcasing past projects",
    "Strategic contact forms and CTA placements",
    "2-year ongoing partnership with multiple client websites built",
  ],
  industry: "Digital Marketing Agency",
  timeframe: "Initial project + 2-year partnership",
};

const pricingPackages = [
  {
    id: 1,
    name: "WordPress Starter",
    price: "$599", //"$750"
    period: "— one-time",
    description: "Perfect for small businesses and startups",
    features: [
      "Up to 5 pages",
      "Custom WordPress build (Elementor)",
      "Mobile-friendly responsive layout",
      "Basic SEO (meta, titles, alt tags)",
      "Contact form + social media links",
      "Google Analytics setup",
      "1 round of revisions",
      "7-day delivery",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "WordPress Business",
    price: "$1,200",
    period: "— one-time",
    description: "Ideal for growing businesses",
    features: [
      "Up to 10 pages",
      "Custom design with Elementor Pro",
      "Mobile + speed optimized",
      "On-page SEO (titles, tags, structured content)",
      "Lead forms + chat integration",
      "Blog setup included",
      "Google Analytics + Search Console",
      "2 revision rounds",
      "10–12 days delivery",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "E-commerce Store (WooCommerce)",
    price: "$1,500",
    period: "— one-time",
    description: "For online stores and e-commerce brands",
    features: [
      "Up to 10 pages + 10 products added",
      "Custom WooCommerce storefront design",
      "Mobile + checkout flow optimized",
      "Basic SEO for products + pages",
      "Payment gateway setup",
      "Shipping zones + rules",
      "Coupons, upsells & cart rules",
      "Contact + chat + cart forms",
      "2 rounds of revisions",
      "12–15 days delivery",
    ],
    popular: false,
  },
];

const webDevelopmentPhases: PhaseItem[] = [
  {
    id: 1,
    label: "Phase 1",
    title: "Project Scoping & Requirements",
    intro: "We align with your team on:",
    points: [
      "Client goals & target audience",
      "Website structure & functionality",
      "Platform selection (WordPress, custom build, web apps)",
    ],
    outcome: "This keeps delivery on-time and on-budget.",
  },
  {
    id: 2,
    label: "Phase 2",
    title: "Design & Development",
    intro: "Our team builds:",
    points: [
      "Conversion-focused designs",
      "Mobile-optimized layouts",
      "SEO-ready site structures",
      "Fast, scalable code",
    ],
    outcome: "All work is done white-label, following your agency’s standards.",
  },
  {
    id: 3,
    label: "Phase 3",
    title: "Quality Assurance & Revisions",
    intro: "We thoroughly test:",
    points: [
      "Responsiveness across devices",
      "Speed & performance",
      "Forms, tracking, and integrations",
      "Revisions handled with clear communication",
    ],
    outcome:
      "Revisions are handled efficiently with clear, structured feedback loops.",
  },
  {
    id: 4,
    label: "Phase 4",
    title: "Launch, Handover & Ongoing Support",
    intro: "Once approved:",
    points: [
      "We assist with smooth launch",
      "Provide handover documentation",
      "Support ongoing updates",
      "Partner on future builds",
    ],
    outcome:
      "Perfect for agencies needing reliable long-term development partners.",
  },
];

const faqs = [
  {
    question: "Do you work directly with our clients?",
    answer:
      "No. All communication remains between your agency and the client. We stay completely behind the scenes and operate as your in-house team.",
  },
  {
    question: "Is this fully white-label?",
    answer:
      "Yes. No BrandingBeez branding appears anywhere unless you explicitly request it. All deliverables, docs, and communication are under your agency brand.",
  },
  {
    question: "What platforms do you support?",
    answer:
      "We specialize in WordPress, WooCommerce, custom websites, and web applications. If you have a specific tech stack in mind, we can usually support that too.",
  },
  {
    question: "Can you handle multiple client websites at once?",
    answer:
      "Yes. Our team is structured to handle bulk workloads for agencies—multiple builds, ongoing changes, and retainers across several end clients.",
  },
  {
    question: "Do you offer ongoing website support or only one-time builds?",
    answer:
      "Both. We support one-off builds, continuous development, retainers, and long-term agency partnerships for ongoing maintenance and feature work.",
  },
  {
    question: "Can this replace freelance developers?",
    answer:
      "Yes. Many agencies partner with us to eliminate freelancer risk, capacity gaps, and delivery inconsistencies while gaining a stable technical team.",
  },
];

export default function WebDevelopment() {
  // 🔹 State & handlers ONLY for the process section
  const [currentPhase, setCurrentPhase] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const totalPhases = webDevelopmentPhases.length;
  const activePhase = webDevelopmentPhases[currentPhase];

  const goToPrevPhase = () => {
    setCurrentPhase((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextPhase = () => {
    setCurrentPhase((prev) => (prev < totalPhases - 1 ? prev + 1 : prev));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;

    if (deltaX > 50) {
      // swipe right -> previous
      goToPrevPhase();
    } else if (deltaX < -50) {
      // swipe left -> next
      goToNextPhase();
    }

    setTouchStartX(null);
  };

  const handleScrollToCaseStudies = () => {
    if (typeof document === "undefined") return;

    const section = document.getElementById("case-studies");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ======================
  // ✅ WEB CASE STUDIES (API)
  // ======================
  const [webCards, setWebCards] = useState<WebCaseStudyCard[]>([]);
  const [loadingWeb, setLoadingWeb] = useState(false);
  const [webError, setWebError] = useState<string | null>(null);

  // ✅ paginate: first 6, then next 6, ...
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ----------- Load WEB DEV -----------
  useEffect(() => {
    let cancelled = false;

    async function loadWeb() {
      try {
        setLoadingWeb(true);
        setWebError(null);

        const res = await fetch("/api/web-case-studies");
        if (!res.ok)
          throw new Error(
            `Failed to load Web case studies: ${res.status} ${res.statusText}`,
          );

        const data = (await res.json()) as WebCaseStudyCard[];
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setWebCards(list);

        // ✅ reset pagination whenever data loads
        setVisibleCount(PAGE_SIZE);
      } catch (err: any) {
        if (!cancelled) {
          setWebError(err?.message ?? "Unable to load Web case studies");
          setWebCards([]);
          setVisibleCount(PAGE_SIZE);
        }
      } finally {
        if (!cancelled) setLoadingWeb(false);
      }
    }

    loadWeb();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCardLink = (card: WebCaseStudyCard) => {
    if (card.link) return card.link;
    if (card.slug) return `/web-case-study/${card.slug}`;
    return "/web-development";
  };

  const getCardAlt = (card: WebCaseStudyCard) => {
    if (card.imageAlt) return card.imageAlt;
    const industry = (card.industry || "").toLowerCase();
    return `${card.client} website case study showcasing ${industry || "web development"}`;
  };

  const getObjectFitClass = (fit?: "cover" | "contain") => {
    return fit === "contain" ? "object-contain" : "object-cover";
  };

  const visibleWebCards = useMemo(
    () => webCards.slice(0, visibleCount),
    [webCards, visibleCount],
  );

  const canLoadMore = visibleCount < webCards.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, webCards.length));
  };

  return (
    <>
      <Helmet>
        <title>White-Label Web Development for Agencies | BrandingBeez</title>
        <meta
          name="description"
          content="We build agency-ready websites under your brand. White-label WordPress & custom web development — fast delivery, zero client exposure."
        />
        <link
          rel="canonical"
          href="https://brandingbeez.co.uk/services/web-development"
        />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="Build Powerful WordPress Websites"
          description="White-label web development for agencies and businesses. SEO-ready, mobile-optimized, and designed to scale."
          keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
          canonicalUrl="https://brandingbeez.co.uk/services/web-development"
          ogType="website"
        />
        <SchemaMarkup type="custom" data={WebDevelopmentSchema} />
        {/* <Header /> */}
        <main className="pb-0">
          {/* Featured Web Development Client Section */}
          <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-brand-purple via-brand-purple/95 to-brand-coral text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left: Copy + CTA */}
                <div className="max-w-2xl">
                  {/* Badge */}
                  {/* <div className="flex justify-center lg:justify-start">
                    <Badge className="inline-flex items-center justify-center rounded-full bg-brand-coral font-medium text-xs sm:text-sm text-white mb-6 px-4 py-1.5 backdrop-blur-sm shadow-sm">
                      Featured White-Label Website Partner for Agencies
                    </Badge>
                  </div> */}

                  {/* Heading */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
                    White-Label Website Development for Digital Agencies
                  </h1>

                  {/* Description */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100/90 mb-8 text-justify">
                    We build high-performing WordPress and custom websites under
                    your brand, so you can sell web development services without
                    hiring, managing, or delivering in-house. Trusted by agencies
                    across the US &amp; UK for fast turnaround, clean builds, and
                    fully white-labeled execution.
                  </p>

                  {/* Key Benefits */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-yellow" />
                      <span className="text-sm sm:text-base text-white">
                        100% White-Label Delivery
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-yellow" />
                      <span className="text-sm sm:text-base text-white">
                        24 Hours Start Time
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-yellow" />
                      <span className="text-sm sm:text-base text-white">
                        Dedicated Website Developer
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <BookCallButtonWithModal
                      buttonLabel="Schedule Consultation"
                      className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple font-semibold px-6 py-3 rounded-lg shadow-md w-full sm:w-auto justify-center"
                      buttonSize="lg"
                      defaultServiceType="Website Development"
                    />
                    {/* Secondary CTA */}
                    <Button
                      variant="outline"
                      onClick={handleScrollToCaseStudies}
                      className="border-white/70 text-white hover:bg-white hover:text-brand-purple text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 bg-white/10"
                    >
                      View Website Case Studies
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center text-white">
                    <div className="flex justify-end">
                      <img
                        src={Whitelabel_Image}
                        alt="White Label Delivery"
                        className="h-16 sm:h-18 md:h-20 w-auto object-contain"
                      />
                    </div>

                    <div className="flex justify-center px-0">
                      <img
                        src={Hours_24_Image}
                        alt="24 Hours Start Time"
                        className="h-18 sm:h-20 md:h-24 w-auto object-contain"
                      />
                    </div>

                    <div className="flex justify-start">
                      <img
                        src={WEB_Image}
                        alt="Dedicated SEO Resource"
                        className="h-16 sm:h-18 md:h-20 w-auto object-contain"
                      />
                    </div>
                  </div> */}
                </div>

                {/* Right: Achievements Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mt-8 lg:mt-0">
                  {/* VIDEO ALWAYS SHOWN */}
                  <div className="mb-0">
                    <div className="w-full h-52 md:h-76 lg:h-[350px] rounded-xl overflow-hidden shadow-lg">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/h2P606wR_Jk"
                        title="Website Design & Development for Agencies | BrandingBeez"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-10 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-white">
            <div className="max-w-6xl mx-auto">
              <PhaseSliderSection
                sectionId="web-development-process"
                heading="How the Web Development Process Works"
                subheading="A simple, transparent process built for agencies."
                phases={webDevelopmentPhases}
                badgeLabel="White-Label Web Development Process"
                sectionClassName="py-0 px-0"
                wrapperClassName="max-w-5xl mx-auto"
                cardHeightClass="min-h-[320px] sm:min-h-[360px] md:min-h-[380px]"
              />
            </div>
          </section>

          {/* Case Studies Section */}
          <section
            id="case-studies"
            className="
    bg-gray-50
    px-4 sm:px-6 lg:px-8
    py-12 sm:py-16 lg:py-20
  "
          >
            <div className="mx-auto max-w-7xl">
              {/* Header */}
              <div className="mx-auto max-w-4xl text-center mb-8 sm:mb-10 lg:mb-12">
                <h3
                  className="
          text-brand-purple font-bold
          text-2xl sm:text-3xl lg:text-4xl
          leading-tight sm:leading-tight
          mb-3 sm:mb-4
        "
                >
                  White-Label Website Case Studies &amp; Portfolio
                </h3>

                <p
                  className="
          text-gray-600
          text-sm sm:text-base lg:text-lg
          leading-relaxed
          mx-auto
        "
                >
                  See how agencies use our white-label web development team to deliver fast,
                  reliable websites for their clients without expanding internal teams.
                </p>
              </div>

              {/* ✅ Loading / Error / Empty */}
              {loadingWeb && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                </div>
              )}

              {!loadingWeb && webError && (
                <div className="mx-auto max-w-3xl mb-8">
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                    {webError}
                  </div>
                </div>
              )}

              {!loadingWeb && !webError && webCards.length === 0 && (
                <div className="text-center text-gray-600 py-10 text-sm sm:text-base">
                  No case studies found.
                </div>
              )}

              {/* ✅ Cards */}
              {!loadingWeb && !webError && webCards.length > 0 && (
                <>
                  <div
                    className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-5 sm:gap-6 lg:gap-8
            items-stretch
          "
                  >
                    {visibleWebCards.map((study) => (
                      <Card
                        key={study.id}
                        className="
                h-full flex flex-col
                overflow-hidden
                rounded-md
                shadow-md hover:shadow-xl
                transition-shadow duration-300
                bg-white
              "
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/9] w-full bg-gray-100">
                          <img
                            src={study.imageUrl || ""}
                            alt={getCardAlt(study)}
                            className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                              study.imageFit
                            )}`}
                            loading="lazy"
                          />
                        </div>

                        {/* Content */}
                        <CardContent
                          className="
                  flex flex-col flex-1
                  p-4 sm:p-5 lg:p-6
                "
                        >
                          <h3
                            className="
                    text-brand-purple font-bold
                    text-base sm:text-lg lg:text-xl
                    leading-snug
                    mb-2
                  "
                          >
                            {study.title}
                          </h3>

                          <p
                            className="
                    text-gray-600
                    text-sm sm:text-[15px] lg:text-base
                    leading-relaxed
                    mb-4
                    flex-1
                  "
                          >
                            {study.description}
                          </p>

                          {/* Metrics */}
                          <div className="space-y-2 mb-1 text-sm">
                            <div className="flex items-start justify-between gap-4">
                              <span className="text-gray-600 shrink-0">Cost</span>
                              <span className="font-bold text-brand-coral text-right">
                                {study.results?.performance}
                              </span>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                              <span className="text-gray-600 shrink-0">Delivery Time</span>
                              <span className="font-bold text-green-600 text-right">
                                {study.results?.conversions}
                              </span>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                              <span className="text-gray-600 shrink-0">Industry</span>
                              <span className="font-bold text-blue-600 text-right">
                                {study.industry}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-gray-100">
                            {study.status === "published" ? (
                              <Button
                                className="w-full bg-brand-coral hover:bg-brand-purple text-white border-0 rounded-md"
                                asChild
                              >
                                <Link href={getCardLink(study)}>
                                  View Full Case Study
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                              </Button>
                            ) : (
                              <div className="flex items-center justify-center gap-2 py-3 rounded-md bg-gray-50 text-gray-500 text-sm font-medium">
                                <Lock className="w-4 h-4" />
                                Details will be available soon
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* ✅ Load More */}
                  {canLoadMore && (
                    <div className="flex justify-center mt-8 sm:mt-10">
                      <Button
                        onClick={handleLoadMore}
                        className="
                bg-brand-purple hover:bg-brand-purple/90
                text-white
                rounded-xl
                px-6 sm:px-8
                py-5 sm:py-6
                text-sm sm:text-base
                shadow-md
              "
                      >
                        Load More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Pricing Packages Section */}
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                {/* <h2 className="bg-brand-purple text-white mb-4 sm:mb-6 inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                  White-Label Website Packages
                </h2> */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-purple mb-4 sm:mb-6">
                  Choose Your White-Label Website Development Package
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  Agency-ready website development packages you can resell under
                  your brand. No BrandingBeez logos. No client exposure. Full
                  delivery ownership stays with you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {pricingPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative flex flex-col h-full ${pkg.popular
                      ? "border-2 border-brand-coral md:scale-105"
                      : "border border-gray-200 hover:border-brand-coral/50"
                      } transition-all duration-300`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-brand-coral text-white px-4 py-1 text-xs sm:text-sm">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4 flex-shrink-0 px-4 sm:px-6 pt-6 sm:pt-8">
                      <h4 className="text-xl sm:text-2xl font-bold text-brand-purple">
                        {pkg.name}
                      </h4>
                      <div className="mt-4">
                        <span className="text-3xl sm:text-4xl font-bold text-brand-coral">
                          {pkg.price}
                        </span>
                        <span className="text-gray-600"> {pkg.period}</span>
                      </div>
                      <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        {pkg.description}
                      </p>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-grow px-4 sm:px-6 pb-6 sm:pb-8">
                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-gray-100">
                        <Link
                          href="/contact?service=website-development&/#contact-form"
                          className="w-full"
                        >
                          <Button
                            className={`w-full py-3 sm:py-4 px-6 sm:px-8 font-medium text-sm sm:text-md transition-all duration-300 ${pkg.popular
                              ? "bg-brand-coral hover:bg-brand-coral/90 text-white"
                              : "bg-brand-purple hover:bg-brand-purple/90 text-white"
                              }`}
                          >
                            {pkg.id === 1
                              ? "Start Your Website"
                              : pkg.id === 2
                                ? "Get Business Website"
                                : "Launch Your Store"}
                            <Gift className="w-5 h-5 ml-3" />
                          </Button>
                        </Link>

                        <BookCallButtonWithModal
                          buttonLabel="Schedule Consultation"
                          className="w-full h-11 px-4 font-medium text-sm border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-all duration-300"
                          buttonSize="lg"
                          buttonVariant="outline"
                          defaultServiceType="Website Development"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form Section (reusable component) */}
          <AgencyContactSection
            sectionId="contact-form"
            heading="Ready to Scale Your Agency?"
            subheading="Get a free consultation and discover how we can help you grow."
            inquiryType="service-wd-contact-form"
            contactFormType="service-wd-contact-form"
            submissionSourceLabel="Service Page Contact Form Submission"
          />

          {/* FAQ SECTION */}
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto grid gap-10 lg:gap-12 lg:grid-cols-[1.1fr,1fr] items-start">
              {/* Left – intro / highlight */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 px-4 py-2 mb-4">
                  <HelpCircle className="w-4 h-4 text-brand-purple" />
                  <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-brand-purple">
                    White-Label Web Development – FAQs
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-purple mb-4">
                  Answers to the questions agencies ask us most.
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6">
                  You keep client relationships and strategy. We handle the build,
                  QA, and tech completely under your brand.
                </p>

                <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white border-none shadow-lg">
                  <CardHeader className="pb-2">
                    <p className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-[0.16em]">
                      Why agencies choose BrandingBeez
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold mt-1">
                      Reliable delivery without freelancer risk.
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-2 text-sm text-white/90">
                    <p>✔ Fully white-label communication and branding.</p>
                    <p>✔ Built for agencies handling multiple client projects.</p>
                    <p>
                      ✔ Flexible engagement — one-off builds, retainers, or
                      long-term dedicated support.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right – FAQ accordion */}
              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={faq.question}
                      className="bg-white/90 border border-brand-purple/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full text-left px-4 sm:px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <span className="font-semibold text-sm sm:text-base text-brand-purple">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-brand-purple flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-3 text-sm text-gray-700 border-t border-gray-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Still have a question?{" "}</span>
                  <BookCallButtonWithModal
                    buttonLabel="Talk to Our Development Team"
                    className="w-fit h-10px-4 font-medium text-sm border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-all duration-300"
                    buttonSize="lg"
                    buttonVariant="outline"
                    defaultServiceType="Website Development"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Subscribe to Our Newsletter!
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-8 text-white/90">
                Join 1000+ marketers &amp; agencies getting exclusive tips on SEO,
                AI, and growth strategies delivered straight to their inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-brand-coral hover:bg-brand-purple hover:text-white"
                  onClick={() => navigate("/#newsletter")}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </section>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}
