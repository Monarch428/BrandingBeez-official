import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/optimized-image";
import greenParadiseImage from "@assets/green-paradise-landscaping-updated.png";
import socialLandImage from "@assets/img_three.png";
import landscapingImage from "@assets/img_two.png";
import beautyServiceImage from "@assets/img_one.png";

import { Link } from "wouter";
import {
  Code,
  ShoppingCart,
  Building,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Smartphone,
  Shield,
  Search,
  Clock,
  ExternalLink,
  Monitor,
  Database,
  Layers,
  TrendingUp,
  LineChart,
  Gift,
  Calendar,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { WebDevelopmentSchema } from "@/utils/all-schemas";
import { navigate } from "wouter/use-browser-location";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import AgencyContactSection from "@/components/agency-contact-section";
import { PhaseSliderSection, type PhaseItem } from "@/components/phase-slider-section";

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

const caseStudies = [
  {
    id: 1,
    title: "UK White-Label Partnership Success",
    client: "SocialLand Digital",
    industry: "Digital Marketing Agency",
    results: {
      performance: "2-year partnership",
      conversions: "Multiple client websites",
      users: "Dedicated resource team",
    },
    description:
      // "Professional WordPress website that sparked ongoing partnership - our first UK white-label project with service-focused layouts and portfolio showcase.",
      "Professional white-label WordPress website that led to an ongoing agency partnership, supporting multiple client websites under their brand.",
    image: socialLandImage,
    link: "/case-studies/socialland-website",
  },
  {
    id: 2,
    title: "Local Business Digital Transformation",
    client: "TS Landscaping NC",
    industry: "Landscaping & Outdoor Services",
    results: {
      performance: "Professional presence",
      conversions: "Lead capture system",
      users: "Local trust built",
    },
    description:
      "White-label WordPress website created through Whitney Hill partnership - transforming offline landscaping business into digital success.",
    image: landscapingImage,
    link: "/case-studies/ts-landscaping-website",
  },
  {
    id: 3,
    title: "48-Hour Landing Page Success",
    client: "Vellu Laser (AC Graphics)",
    industry: "Beauty & Skincare",
    results: {
      performance: "48-hour delivery",
      conversions: "High-converting design",
      users: "Long-term partnership",
    },
    description:
      "White-label landing page project delivered through AC Graphics Digital partnership - fast turnaround without compromising quality.",
    image: beautyServiceImage,
    link: "/case-studies/vellu-laser-landing-page",
  },
  {
    id: 4,
    title: "Complete Brand + Website Success",
    client: "Green Paradise (Mark)",
    industry: "Landscaping & Outdoor Living",
    results: {
      performance: "Complete brand identity",
      conversions: "Professional website",
      users: "White-label success",
    },
    description:
      "Full 360° digital launch combining nature-inspired branding with WordPress website development through Mark's white-label partnership.",
    image: greenParadiseImage,
    link: "/case-studies/green-paradise-branding-website",
  },
];

// const pricingPackages = [
//   {
//     id: 1,
//     name: "WordPress Starter",
//     price: "$600",
//     period: "one-time",
//     description: "Perfect for small businesses and startups",
//     features: [
//       "Up to 5 pages",
//       "Custom WordPress (Elementor)",
//       "Mobile-friendly responsive",
//       "Basic SEO (Meta, Alt Tags)",
//       "Contact form + social media links",
//       "Google Analytics setup",
//       "1 round of revisions",
//       "7 days delivery",
//     ],
//     popular: false,
//   },
//   {
//     id: 2,
//     name: "WordPress Business",
//     price: "$1,200",
//     period: "one-time",
//     description: "Ideal for growing businesses",
//     features: [
//       "Up to 10 pages",
//       "Custom design (Elementor Pro)",
//       "Mobile + speed optimized",
//       "On-page SEO (titles, tags, alt)",
//       "Contact + lead forms + chat",
//       "Blog setup included",
//       "Google Analytics & Search Console",
//       "2 rounds of revisions",
//       "10-12 days delivery",
//     ],
//     popular: true,
//   },
//   {
//     id: 3,
//     name: "E-commerce Store",
//     price: "$1,500",
//     period: "one-time",
//     description: "For online stores and e-commerce",
//     features: [
//       "Up to 10 pages + 10 products",
//       "WooCommerce storefront design",
//       "Mobile + checkout optimized",
//       "Basic SEO for products + pages",
//       "Payment gateway + shipping setup",
//       "Coupons, upsells, shipping rules",
//       "Contact + chat + cart forms",
//       "2 rounds of revisions",
//       "12-15 days delivery",
//     ],
//     popular: false,
//   },
// ];

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

// 🔹 New: process phases for web development (same style as dedicated team)
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
    outcome:
      "All work is done white-label, following your agency’s standards.",
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

// 🔹 FAQ content
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
    question:
      "Do you offer ongoing website support or only one-time builds?",
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
    setCurrentPhase((prev) =>
      prev < totalPhases - 1 ? prev + 1 : prev,
    );
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
        <Header />
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
          <section id="case-studies" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                {/* <h2 className="bg-brand-coral text-white mb-4 sm:mb-6 inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                  🎯 Success Stories
                </h2> */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-purple mb-4 sm:mb-6">
                  White-Label Website Case Studies &amp; Portfolio
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  See how agencies use our white-label web development team to
                  deliver fast, reliable websites for their clients without
                  expanding internal teams.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                {caseStudies.map((study) => (
                  <Card
                    key={study.id}
                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="aspect-video rounded-t-lg overflow-hidden bg-gray-100">
                      <img
                        src={study.image}
                        alt={`${study.client} website case study showcasing ${study.industry.toLowerCase()}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Content */}
                    <CardContent className="flex flex-col flex-grow p-5 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-brand-purple mb-2">
                        {study.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow text-sm sm:text-base">
                        {study.description}
                      </p>

                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Performance</span>
                          <span className="font-bold text-green-600">
                            {study.results.performance}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conversions</span>
                          <span className="font-bold text-blue-600">
                            {study.results.conversions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scale</span>
                          <span className="font-bold text-brand-coral">
                            {study.results.users}
                          </span>
                        </div>
                      </div>

                      {/* Button pinned to bottom */}
                      <div className="mt-auto pt-2">
                        <Button
                          className="w-full bg-brand-coral hover:bg-brand-purple text-white border-0"
                          asChild
                        >
                          <Link href={study.link || "/case-studies"}>
                            View Full Case Study
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
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
                        onClick={() =>
                          setOpenFaqIndex(isOpen ? null : index)
                        }
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
        <Footer />
      </div >
    </>
  );

}
