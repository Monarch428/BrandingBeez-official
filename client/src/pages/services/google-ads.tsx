import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import as_Logo from "../../../public/images/AS.png";
import { Link, useLocation } from "wouter";
import {
  TrendingUp,
  Target,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  ExternalLink,
  LineChart,
  Zap,
  Shield,
  Search,
  DollarSign,
  Gift,
  Calendar,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { navigate } from "wouter/use-browser-location";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import AgencyContactSection from "@/components/agency-contact-section";
import { PhaseSliderSection, type PhaseItem } from "@/components/phase-slider-section";
import Whitelabel_Image from "../../../public/images/1OO_WHITE-LABEL.png";
import Hours_24_Image from "../../../public/images/24 hour Start time.png";
import PPC_Image from "../../../public/images/DEDICATED PPC SPECIALIST.png"


// Featured Google Ads client data
const featuredClient = {
  name: "Arlingsworth Solicitors",
  logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'%3E%3Crect width='150' height='60' fill='%23ff6b47'/%3E%3Ctext x='75' y='35' fill='white' font-family='Arial' font-size='14' text-anchor='middle'%3EBusiness%3C/text%3E%3C/svg%3E",
  website: "https://www.arlingsworth.com",
  description: "A UK-based law firm specializing in family law, probate, and divorce matters.",
  achievements: [
    "£6.5 cost per acquisition (lowest)",
    "19% best conversion rate",
    // "18.95% best conversion rate",
    "9% top CTR",
    // "8.76% top CTR",
    "1,139+ total clicks",
    "100+ conversions, 78 phone calls"
  ],
  industry: "Legal Services",
  timeframe: "30 days"
};

const caseStudies = [
  {
    id: 1,
    title: "UK Legal Services Excellence",
    client:
      // "Arlingsworth Solicitors",
      "Arlingsworth Solicitors – UK Law Firm",
    industry: "Legal Services",
    results: {
      cpa: "£6.5 Lowest CPA",
      // cpa: "£6.51 lowest CPA",
      conversionRate: "19% Conversion Rate",
      // conversionRate: "18.95% conversion rate",
      clicks: "1,139+ Total Clicks in 30 days"
    },
    description: "Achieved exceptional results for UK family law firm with Performance Max and Search campaigns optimization.",
    link: "/case-studies/arlingsworth-solicitors-case-study"
  },
  {
    id: 2,
    title: "Waste Management Transformation",
    client: "JunksAway",
    industry: "Waste Management",
    results: {
      cpaReduction: "82% CPA reduction",
      conversions: "706 Total Conversions",
      roas: "1.28x ROAS achieved"
    },
    description: "Dramatically reduced CPA from $34 to $6 for US junk removal company through strategic campaign restructure.",
    // description: "Dramatically reduced CPA from $34.37 to $6.09 for US junk removal company through strategic campaign restructure.",
    link: "/case-studies/junksaway-case-study"
  },
  {
    id: 3,
    title: "Pet Services Success",
    client: "The Dog Guy",
    industry: "Dog Training",
    results: {
      conversionRate: "12% Conversion Rate",
      // conversionRate: "12.06% Conversion Rate",
      conversions: "192 Total Leads",
      cpa: "£20 Average CPA"
      // cpa: "£20.35 Average CPA"
    },
    description: "Optimized underperforming campaigns for UK dog training business, transitioning from audit to monthly retainer.",
    link: "/case-studies/the-dog-guy-case-study"
  }
];

// const pricingPackages = [
//   {
//     id: 1,
//     name: "Starter",
//     price: "$800",
//     period: "/month",
//     period1: "+ ad spend",
//     description: "Perfect for small businesses starting with Google Ads",
//     features: [
//       "Ad spend range: $2,500 - $5,000",
//       "Search Ads & Performance Max",
//       "Remarketing campaigns",
//       "Up to 2 target locations",
//       "3 search ad sets",
//       "Conversion tracking setup",
//       "Monthly summary report",
//       "Email support"
//     ],
//     popular: false
//   },
//   {
//     id: 2,
//     name: "Growth",
//     price: "$1200",
//     period: "/month",
//     period1: "+ ad spend",
//     description: "Ideal for growing businesses",
//     features: [
//       "Ad spend range: $6,000 - $8,500",
//       "Search, PMax, Display & Brand campaigns",
//       "Up to 5 target locations",
//       "5 search + 1 display creative",
//       "Landing page optimization recommendations",
//       "Audience segmentation",
//       "Monthly competitor monitoring",
//       "Detailed PDF reports",
//       "2 monthly strategy calls"
//     ],
//     popular: true
//   },
//   {
//     id: 3,
//     name: "Scale",
//     price: "$1,500",
//     period: "/month",
//     period1: "+ ad spend",
//     description: "For large businesses and complex campaigns",
//     features: [
//       "Ad spend range: $8,500 - $15,000",
//       "Full funnel ads: Search, Display, YouTube",
//       "Shopping ads (if e-commerce)",
//       "Nationwide or up to 10 locations",
//       "Advanced audience segmentation",
//       "A/B testing recommendations",
//       "Bi-weekly competitor monitoring",
//       "Advanced dashboard access",
//       "3 strategy calls + priority support"
//     ],
//     popular: false
//   }
// ];

const pricingPackages = [
  {
    id: 1,
    name: "Starter",
    price: "$399", //"$500"
    period: "/month",
    period1: "+ ad spend",
    description: "Perfect for small businesses starting with Google Ads",
    features: [
      "Ad spend range: $2,500 – $5,000",
      "Search Ads & Performance Max",
      "Remarketing campaigns",
      "Up to 2 target locations",
      "3 search ad sets",
      "Conversion tracking setup",
      "Landing page recommendations",
      "Monthly summary report",
      "Email support"
    ],
    popular: false
  },
  {
    id: 2,
    name: "Growth (Most Popular)",
    price: "$999", //"$1,200"
    period: "/month",
    period1: "+ ad spend",
    description: "Ideal for growing businesses improving ROI",
    features: [
      "Ad spend range: $5,000 – $10,000",
      "Search, Performance Max, Display & Brand campaigns",
      "Up to 5 target locations",
      "5 search ads + 1 display creative",
      "Landing page optimization recommendations",
      "Audience segmentation",
      "Monthly competitor monitoring",
      "Detailed PDF reports",
      "2 monthly strategy calls"
    ],
    popular: true
  },
  {
    id: 3,
    name: "Scale (Premium Management)",
    price: "$1,999",
    period: "/month",
    period1: "+ ad spend",
    description: "For large businesses & complex, high-budget campaigns",
    features: [
      "Ad spend range: $10,000 – $25,000+",
      "Full-funnel ads: Search, Display, YouTube, Shopping (for e-commerce)",
      "Nationwide targeting or up to 10 locations",
      "Advanced audience segmentation",
      "A/B testing recommendations",
      "Bi-weekly competitor monitoring",
      "Advanced dashboard access",
      "3 strategy calls + priority support",
      "CRO guidance for landing pages"
    ],
    popular: false
  }
];

const googleAdsPhases: PhaseItem[] = [
  {
    id: 1,
    label: "Phase 1",
    title: "Account Audit & Opportunity Review",
    intro: "We analyze existing performance and opportunities across:",
    points: [
      "Current Google Ads account structure",
      "Client goals, budget, and target locations",
      "Competitors & search landscape",
      "Conversion paths and tracking setup",
    ],
    outcome:
      "You get a clear, agency-ready view of what’s working, what’s wasted, and where to scale.",
  },
  {
    id: 2,
    label: "Phase 2",
    title: "Campaign Build or Restructure",
    intro: "We create or rebuild campaigns using:",
    points: [
      "Clean, logical account and campaign structure",
      "High-intent keyword targeting & match types",
      "Conversion-focused ad copy & extensions",
      "Proper tracking for calls, forms, and sales",
    ],
    outcome:
      "Your campaigns are built to convert from Day 1, not just generate clicks.",
  },
  {
    id: 3,
    label: "Phase 3",
    title: "Ongoing Optimization & Scaling",
    intro: "We continuously:",
    points: [
      "Optimize bids and budgets toward CPA/ROAS goals",
      "Add negative keywords to cut wasted spend",
      "Improve Quality Scores and ad relevance",
      "Test ad variations, audiences, and funnels",
    ],
    outcome:
      "Performance improves month after month with lower CPA and stronger ROI.",
  },
  {
    id: 4,
    label: "Phase 4",
    title: "White-Label Reporting & Strategy",
    intro: "You receive:",
    points: [
      "Clear monthly reports branded to your agency",
      "Performance insights & next-step recommendations",
      "Optional strategy calls you can attend — or stay behind the scenes",
    ],
    outcome:
      "You look like the strategic PPC partner to your client, while we handle the heavy lifting.",
  },
];

// 🔹 FAQ content
const faqs = [
  {
    question: "Do you work directly with our clients?",
    answer:
      "No. We operate 100% behind the scenes. All communication, reporting, and strategy are delivered under your agency’s brand only.",
  },
  {
    question: "Is reporting white-label?",
    answer:
      "Yes. Reports can be fully branded with your agency logo, name, and messaging. You can present them to clients as if they came from your internal team.",
  },
  {
    question: "Do you manage Google Ads campaigns for US businesses?",
    answer:
      "Yes. We specialize in US-focused Google Ads campaigns across legal, home services, e-commerce, and local service industries.",
  },
  {
    question: "Can we scale campaigns across multiple client accounts?",
    answer:
      "Absolutely. Our team is built to support agencies managing multiple Google Ads accounts simultaneously, without performance drops.",
  },
  {
    question:
      "Do you offer NDAs for agency partnerships?",
    answer:
      "Yes. We’re happy to sign NDAs and confidentiality agreements to protect your clients and your business relationships.",
  },
];

export default function GoogleAds() {
  const [, setLocation] = useLocation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const navigateToPricingCalculator = () => {
    setLocation('/pricing-calculator');
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
        <title>White-Label Google Ads Management for Agencies | BrandingBeez</title>
        <meta name="description" content="White-label Google Ads management for agencies. Scale PPC services with expert strategy, lower CPAs & branded reporting. Trusted by US & UK agencies." />
        <link rel="canonical" href="https://brandingbeez.co.uk/services/google-ads" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="White-Label Google Ads Services | £6.51 CPA | Expert PPC for Agencies"
          description="Professional white-label Google Ads management for agencies. Proven results with £6.51 CPA and 18.95% conversion rates. Performance Max, Search, and Shopping campaigns delivered under your brand."
          keywords="white label Google Ads, PPC services for agencies, white label pay per click, Google Ads management, Performance Max campaigns, Search campaigns"
          canonicalUrl="https://brandingbeez.com/services/google-ads"
          ogType="service"
        />
        <SchemaMarkup type="service" data={{
          name: "White-Label Google Ads Services",
          description: "Performance-focused Google Ads campaigns with conversion optimization and detailed reporting delivered under your agency's brand.",
          serviceType: "Pay-Per-Click Advertising",
          hasOfferCatalog: {
            name: "Google Ads Service Offerings",
            itemListElement: [
              {
                name: "Performance Max Campaigns",
                description: "AI-powered campaigns across all Google properties"
              },
              {
                name: "Search Campaigns",
                description: "Targeted search advertising with keyword optimization"
              },
              {
                name: "Shopping Campaigns",
                description: "E-commerce focused product advertising"
              }
            ]
          }
        }} />
        <Header />
        <main className="pt-0">

          {/* Featured Google Ads Client Section */}
          <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-brand-purple via-brand-purple/95 to-brand-coral text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Main Content */}
                <div className="max-w-3xl">
                  {/* Badge */}
                  {/* <div className="flex items-center justify-center">
                    <div className="inline-flex items-center rounded-full bg-brand-coral px-4 py-1.5 mb-6 shadow-sm backdrop-blur-sm">
                      <span className="text-xs sm:text-sm font-medium tracking-wide">
                        Featured Google Ads Client of the Month
                      </span>
                    </div>
                  </div> */}

                  {/* Heading */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
                    White-Label Google Ads Management for Agencies
                  </h1>

                  {/* Paragraphs */}
                  <p className="text-base sm:text-lg md:text-xl text-gray-100/90 mb-4">
                    Scale your agency’s PPC services with a dedicated white-label Google Ads team.
                    We manage strategy, setup, optimization, and reporting fully under your brand.
                  </p>

                  <p className="text-base sm:text-lg md:text-xl text-gray-100/85 mb-8">
                    Trusted by UK &amp; US agencies to deliver profitable Google Ads campaigns for law firms,
                    local services, e-commerce brands, and high-intent leads.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <Button
                      className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple font-semibold px-6 py-3 rounded-lg shadow-md flex items-center justify-center"
                      asChild
                    >
                      <Link href="/contact?service=google-ads&/#contact-form">
                        <span>Start Your Campaign</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>

                    {/* Secondary CTA */}
                    <Button
                      variant="outline"
                      onClick={handleScrollToCaseStudies}
                      className="border-white/70 text-white hover:bg-white hover:text-brand-purple text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 bg-white/10"
                    >
                      View PPC Case Studies
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Small Trust Strip */}
                  {/* <div className="mt-6 flex flex-wrap gap-3 text-xs sm:text-sm text-gray-100/90">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      100% White-Label Delivery
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      US &amp; UK Market Experience
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      No Direct Client Contact
                    </span>
                  </div> */}
                  <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center text-white">
                    {/* Left */}
                    <div className="flex justify-end">
                      <img
                        src={Whitelabel_Image}
                        alt="White Label Delivery"
                        className="h-16 sm:h-18 md:h-20 w-auto object-contain"
                      />
                    </div>

                    {/* Center (slightly bigger) */}
                    <div className="flex justify-center px-0">
                      <img
                        src={Hours_24_Image}
                        alt="24 Hours Start Time"
                        className="h-18 sm:h-20 md:h-24 w-auto object-contain"
                      />
                    </div>

                    {/* Right */}
                    <div className="flex justify-start">
                      <img
                        src={PPC_Image}
                        alt="Dedicated SEO Resource"
                        className="h-16 sm:h-18 md:h-20 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Results Card */}
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mt-8 lg:mt-0">
                    {/* VIDEO ALWAYS SHOWN */}
                    <div className="mb-0">
                      <div className="w-full h-52 md:h-76 lg:h-[350px] rounded-xl overflow-hidden shadow-lg">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/8CRaG4x_IXA?rel=0&modestbranding=1"
                          title="PPC / Google Ads Overview"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* <Card className="bg-white/95 backdrop-blur-sm border border-white/20 p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                          <img src={as_Logo} alt="AS Logo" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {featuredClient.industry}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{featuredClient.name}</h3>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <img
                        src="/attached_assets/Time_series(2025.05.01-2025.05.31)_1753339120036.png"
                        alt="Arlingsworth Solicitors Google Ads performance dashboard showing impressions, clicks, conversions, and cost metrics"
                        className="w-full rounded-lg shadow-sm"
                      />
                    </div>

                    <p className="text-xs text-gray-600 text-center">
                      Live Google Ads dashboard showing 30-day performance metrics including 24.8K impressions, 839 clicks, 100 conversions, and £20.66 cost per conversion.
                    </p>
                  </Card> */}

          <section className="py-16 px-4 bg-gray-50">

            <PhaseSliderSection
              sectionId="google-ads-process"
              heading="How the Google Ads Process Works"
              subheading="A simple, transparent process built for agencies."
              phases={googleAdsPhases}
            />
          </section>

          {/* WHY AGENCIES CHOOSE OUR WHITE-LABEL PPC */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              {/* Heading */}
              <div className="text-center mb-10">
                {/* <span className="inline-flex items-center rounded-full bg-brand-coral px-4 py-1 text-s sm:text-sm font-medium tracking-wide text-white">
                  Why Agencies Choose Our White-Label PPC
                </span> */}
                <h2 className="mt-4 text-4xl font-bold text-brand-purple">
                  Why Agencies Partner With BrandingBeez for Google Ads
                </h2>
                <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
                  We don’t act like vendors we operate as your in-house paid media team,
                  fully behind the scenes under your brand.
                </p>
              </div>

              {/* Content Card */}
              <Card className="bg-gray-50 border border-brand-purple/10 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="grid gap-6 md:grid-cols-[1.2fr,0.9fr] items-start">
                    {/* Left – bullets */}
                    <div>
                      <ul className="space-y-3 text-sm sm:text-base text-gray-800">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-brand-coral flex-shrink-0" />
                          <span>Google Ads managed under your agency name</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-brand-coral flex-shrink-0" />
                          <span>No client-facing branding or credit taken</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-brand-coral flex-shrink-0" />
                          <span>US-focused strategy, targeting &amp; messaging</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-brand-coral flex-shrink-0" />
                          <span>
                            Proven performance across legal, home services &amp; local businesses
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-brand-coral flex-shrink-0" />
                          <span>
                            Direct access to PPC specialists — not account managers only
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Right – emphasis block */}
                    <div className="rounded-2xl bg-gradient-to-r from-brand-purple to-brand-coral text-white p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80 mb-2">
                          White-Label Advantage
                        </p>
                        <p className="text-base sm:text-lg font-semibold leading-relaxed">
                          You keep the client. <br className="hidden sm:block" />
                          We do the execution.
                        </p>
                      </div>
                      <p className="mt-4 text-sm text-white/90">
                        From audits to scaling, every campaign is built, optimized, and reported
                        under your agency brand — while our team handles the heavy lifting.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Case Studies Section */}
          <section id="case-studies" className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                {/* <h2 className="bg-brand-coral text-white mb-6 inline-block px-4 py-2 rounded-full text-sm font-medium">
                  Featured White-Label Google Ads Success
                </h2> */}
                <h3 className="text-4xl font-bold text-brand-purple mb-6">
                  Google Ads Case Studies & Results
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  See how we've helped businesses across industries achieve exceptional ROI with strategic Google Ads campaigns and data-driven optimization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study, index) => (
                  <Card
                    key={study.id}
                    className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {index === 0 ? (
                      /* Arlingsworth Solicitors with uploaded image */
                      <div className="aspect-video rounded-t-lg overflow-hidden bg-white border-b border-gray-200">
                        <picture>
                          <source srcSet="/images/img_g1.png" type="image/png" />
                          <img
                            src="/images/img_g1.png"
                            alt="Arlingsworth Solicitors Google Ads case study showing campaign performance and results"
                            className="w-full h-full object-contain bg-white p-2"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        </picture>
                        <div
                          className="w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center"
                          style={{ display: "none" }}
                        >
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                              <DollarSign className="w-8 h-8 text-brand-coral" />
                            </div>
                            <h4 className="text-lg font-bold text-brand-purple mb-2">
                              {study.client}
                            </h4>
                            <p className="text-sm font-medium text-gray-700">
                              {study.industry}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : index === 1 ? (
                      /* Junksaway with uploaded image */
                      <div className="aspect-video rounded-t-lg overflow-hidden bg-white border-b border-gray-200">
                        <picture>
                          <source srcSet="/images/img_g2.png" type="image/png" />
                          <img
                            src="/images/img_g2.png"
                            alt="Junksaway Google Ads case study showing campaign performance and results"
                            className="w-full h-full object-contain bg-white p-2"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        </picture>
                        <div
                          className="w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center"
                          style={{ display: "none" }}
                        >
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                              <DollarSign className="w-8 h-8 text-brand-coral" />
                            </div>
                            <h4 className="text-lg font-bold text-brand-purple mb-2">
                              {study.client}
                            </h4>
                            <p className="text-sm font-medium text-gray-700">
                              {study.industry}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : index === 2 ? (
                      /* The Dog Guy with uploaded image */
                      <div className="aspect-video rounded-t-lg overflow-hidden bg-white border-b border-gray-200">
                        <picture>
                          <source srcSet="/images/img_g3.png" type="image/png" />
                          <img
                            src="/images/img_g3.png"
                            alt="The Dog Guy Google Ads case study showing campaign performance and results"
                            className="w-full h-full object-contain bg-white p-2"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        </picture>
                        <div
                          className="w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center"
                          style={{ display: "none" }}
                        >
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                              <DollarSign className="w-8 h-8 text-brand-coral" />
                            </div>
                            <h4 className="text-lg font-bold text-brand-purple mb-2">
                              {study.client}
                            </h4>
                            <p className="text-sm font-medium text-gray-700">
                              {study.industry}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Placeholder for other case studies */
                      <div className="aspect-video bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 rounded-t-lg overflow-hidden flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-coral/20"></div>
                        <div className="relative z-10 text-center p-6">
                          <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="w-8 h-8 text-brand-coral" />
                          </div>
                          <h4 className="text-lg font-bold text-brand-purple mb-2">
                            {study.client}
                          </h4>
                          <p className="text-sm font-medium text-gray-700">
                            {study.industry}
                          </p>
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-brand-purple mb-2">
                        {study.client}
                      </h3>
                      <p className="text-gray-600 mb-4">{study.description}</p>

                      <div className="space-y-2 mb-4">
                        {study.results.cpa && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Best CPA</span>
                            <span className="font-bold text-green-600">
                              {study.results.cpa}
                            </span>
                          </div>
                        )}
                        {study.results.conversionRate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Conversion Rate</span>
                            <span className="font-bold text-blue-600">
                              {study.results.conversionRate}
                            </span>
                          </div>
                        )}
                        {study.results.clicks && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Clicks</span>
                            <span className="font-bold text-brand-coral">
                              {study.results.clicks}
                            </span>
                          </div>
                        )}
                        {study.results.cpaReduction && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CPA Reduction</span>
                            <span className="font-bold text-green-600">
                              {study.results.cpaReduction}
                            </span>
                          </div>
                        )}
                        {study.results.conversions && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Conversions</span>
                            <span className="font-bold text-blue-600">
                              {study.results.conversions}
                            </span>
                          </div>
                        )}
                        {study.results.roas && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">ROAS</span>
                            <span className="font-bold text-purple-600">
                              {study.results.roas}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom-aligned button */}
                      <div className="mt-auto pt-4 border-t border-gray-200">
                        <Button
                          className="w-full bg-brand-coral hover:bg-brand-purple text-white"
                          asChild
                        >
                          <Link href={study.link}>
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

          {/* PROBLEMS WE SOLVE FOR AGENCIES */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Heading */}
              <div className="text-center mb-10">
                {/* <span className="inline-flex items-center rounded-full bg-brand-coral px-4 py-1 text-s sm:text-sm font-medium tracking-wide text-white">
                  Problems We Solve for Agencies
                </span> */}
                <h2 className="mt-4 text-4xl font-bold text-brand-purple">
                  Common Google Ads Challenges Agencies Face
                </h2>
                <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
                  Agencies come to us when Google Ads become hard to scale, hard to
                  control, and risky to sell to end clients.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 items-start">
                {/* Left – challenges */}
                <Card className="border border-brand-purple/10 shadow-sm bg-gray-50">
                  <CardHeader className="pb-3">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-purple/80">
                      Challenges We Hear Every Week
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-brand-purple">
                      Agencies come to us when:
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-2 pb-6 px-6">
                    <ul className="space-y-3 text-sm sm:text-base text-gray-800">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-coral flex-shrink-0" />
                        <span>Google Ads accounts burn spend without conversions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-coral flex-shrink-0" />
                        <span>CPA keeps rising month after month</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-coral flex-shrink-0" />
                        <span>In-house teams are stretched too thin</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-coral flex-shrink-0" />
                        <span>Freelancers are unreliable or inconsistent</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-coral flex-shrink-0" />
                        <span>Scaling PPC services becomes risky</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Right – how we fix it */}
                <Card className="border-none shadow-lg bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                  <CardHeader className="pb-3">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/80">
                      How We Fix It
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                      A performance-first, agency-first PPC approach.
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-2 pb-6 px-6">
                    <ul className="space-y-3 text-sm sm:text-base text-white/90">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                        <span>Conversion-focused keyword &amp; intent mapping</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                        <span>Clean account structure (Search, PMAX, Display)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                        <span>Landing-page-aligned ad copy that matches messaging</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                        <span>Aggressive negative keyword control to cut waste</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                        <span>Constant bid &amp; audience optimization for CPA/ROAS</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* FINAL CTA – before pricing */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-5xl mx-auto text-center">
              {/* <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs sm:text-sm font-medium tracking-[0.18em]">
                Ready to Scale Your PPC Offering
              </span> */}

              <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight">
                Ready to Scale Your Agency’s PPC Offering?
              </h2>

              <p className="mt-4 text-base sm:text-lg text-white/90 max-w-3xl mx-auto">
                Stop hiring, training, and managing Google Ads internally.
                Let our white-label PPC team handle strategy, build, and optimization
                while you stay front-facing with your clients.
              </p>

              <p className="mt-3 text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
                We run the campaigns under your brand at scale, with clear reporting and
                agency-first communication so you can confidently sell and grow.
              </p>

              <div className="mt-8 flex justify-center">
                {/* <Button
                  size="lg"
                  className="bg-brand-purple text-brand-white hover:bg-gray-100 hover:text-brand-purple flex items-center gap-2"
                  onClick={() =>
                    window.open("/book-appointment", "_blank")
                  }
                >
                  Book a Free White-Label PPC Strategy Call
                  <ArrowRight className="w-4 h-4" />
                </Button> */}
                <BookCallButtonWithModal
                  buttonLabel=" Book a Free White-Label PPC Strategy Call"
                  className="bg-brand-purple text-brand-white hover:bg-gray-100 hover:text-brand-purple flex items-center gap-2"
                  buttonSize="lg"
                  defaultServiceType="Google Ads"
                />
              </div>
            </div>
          </section>

          {/* Google Ads Management Packages Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                {/* <h2 className="bg-brand-purple text-white mb-6 inline-block px-4 py-2 rounded-full text-sm font-medium">
                  💎 Google Ads Management Packages
                </h2> */}
                <h3 className="text-4xl font-bold text-brand-purple mb-4">
                  Choose Your Google Ads Package
                </h3>
                {/* <p className="text-xl text-gray-900/80 max-w-3xl mx-auto">
                    Professional Google Ads management designed to maximize your return on investment.
                    All packages include setup, optimization, and detailed reporting.
                  </p> */}
                <p className="text-xl text-gray-900/80 max-w-5xl mx-auto">
                  Professional Google Ads management designed to maximize ROI with setup, ongoing optimization,
                  detailed performance reporting, and fully white-label, agency-first communication.
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative flex flex-col h-full transition-all duration-300 ${pkg.popular
                      ? "border-2 border-brand-coral shadow-sm scale-[1.02]"
                      : "border border-brand-purple/20 hover:border-brand-purple/40 hover:shadow-sm"
                      }`}
                  >
                    {/* Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-brand-coral text-white px-4 py-1 rounded-full shadow-sm">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    {/* Card Header */}
                    <CardHeader className="text-center pb-4 flex-shrink-0">
                      <h4 className="text-2xl font-bold text-brand-purple">{pkg.name}</h4>

                      <div className="mt-4 flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-extrabold text-brand-coral">{pkg.price}</span>
                        <span className="text-gray-900/70">{pkg.period} <strong className="text-brand-coral font-medium">{pkg.period1}</strong></span>
                      </div>

                      <p className="text-gray-900/80 mt-2">{pkg.description}</p>
                    </CardHeader>

                    {/* Card Content */}
                    <CardContent className="flex flex-col flex-grow">
                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-brand-coral mt-0.5 flex-shrink-0" />
                            <span className="text-gray-900 text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Bottom Buttons — always aligned */}
                      <div className="mt-auto pt-8 border-t border-brand-purple/10">
                        <div className="flex flex-col gap-4">

                          {/* Primary Button */}
                          <Button
                            asChild
                            className={`w-full h-11 px-4 font-medium text-sm transition-all duration-300 ${pkg.popular
                              ? "bg-brand-coral hover:bg-brand-coral/90 text-white"
                              : "bg-brand-purple hover:bg-brand-purple/90 text-white"
                              }`}
                          >
                            <Link href="/contact?service=google-ads&/#contact-form">
                              {pkg.id === 1
                                ? "Start Google Ads Campaign"
                                : pkg.id === 2
                                  ? "Launch Growth Campaign"
                                  : "Begin Premium Management"}
                              <Gift className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>

                          {/* Schedule Call Button */}
                          <BookCallButtonWithModal
                            buttonLabel="Schedule Consultation"
                            className="w-full h-11 px-4 font-medium text-sm border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-all duration-300"
                            buttonSize="lg"
                            buttonVariant="outline"
                            defaultServiceType="Google Ads"
                          />
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                ))}
              </div>

              {/* ✅ Trust micro-copy under pricing */}
              <div className="mt-10 text-center text-sm text-gray-800">
                <p className="max-w-3xl mx-auto leading-relaxed">
                  ✔️ No long-term contracts &nbsp;•&nbsp;
                  ✔️ Scales with your client base &nbsp;•&nbsp;
                  ✔️ NDA available for all agency partners
                </p>
              </div>

              {/* Footer CTA */}
              {/* <div className="text-center mt-12">
                <p className="text-gray-900/80 mb-4">
                  Managing large ad spends? Contact us for enterprise-level Google Ads management.
                </p>
                <Button
                  variant="outline"
                  className="border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                  onClick={() =>
                    // window.open("https://calendly.com/vignesh-velusamy/30min", "_blank")
                    window.open("/book-appointment", "_blank")
                  }
                >
                  Contact Us for Enterprise Pricing
                </Button>
              </div> */}
            </div>
          </section>

          {/* WHAT AGENCIES GET – after pricing */}
          <section className="py-16 px-4 bg-grey-50">
            <div className="max-w-7xl mx-auto">
              {/* Heading */}
              <div className="text-center mb-12">
                {/* <span className="inline-flex items-center rounded-full bg-brand-coral px-4 py-1 text-s sm:text-sm font-medium tracking-[0.18em] text-white">
                  What Agencies Get
                </span> */}
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-brand-purple">
                  What’s Included in Our White-Label Google Ads Management
                </h2>
                <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
                  Everything you need to offer fully managed Google Ads to your clients
                  delivered by our team, under your brand, with clear accountability.
                </p>
              </div>

              {/* Gradient Content Card */}
              <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white shadow-lg border-none">
                <CardContent className="p-8 sm:p-10">
                  <div className="grid gap-8 md:grid-cols-2 items-start">
                    {/* Left Column */}
                    <div>
                      <ul className="space-y-4 text-sm sm:text-base">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Account setup from scratch or full rebuild of existing accounts
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Conversion tracking configuration for calls, forms, and purchases
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Search, Performance Max &amp; Display campaigns tailored to your client’s goals
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Right Column */}
                    <div>
                      <ul className="space-y-4 text-sm sm:text-base">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Landing page optimization recommendations to improve conversion rates
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Monthly performance reporting, fully branded for your agency
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Strategy calls you can join with your client or stay behind the scenes while we handle it
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Form Section (now a reusable component) */}
          <AgencyContactSection
            sectionId="contact-form"
            heading="Ready to Scale Your Agency?"
            subheading="Get a free consultation and discover how we can help you grow."
            inquiryType="service-g-ads-contact-form"
            contactFormType="service-g-ads-contact-form"
            submissionSourceLabel="Service Page Contact Form Submission"
          />

          {/* 🔹 NEW FAQ SECTION – before final CTA */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.1fr,1fr] items-start">
              {/* Left – intro / highlight */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 px-4 py-2 mb-4">
                  <HelpCircle className="w-4 h-4 text-brand-purple" />
                  <span className="text-s font-bold tracking-wide uppercase text-brand-purple">
                    White-Label PPC – FAQs
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                  Answers to the questions agencies ask us most.
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  You keep client relationships and strategy. We handle the
                  build, QA, and tech completely under your brand.
                </p>

                <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white border-none shadow-lg">
                  <CardHeader className="pb-2">
                    <p className="text-sm font-medium text-white/80 uppercase tracking-[0.16em]">
                      Why agencies choose BrandingBeez
                    </p>
                    <h3 className="text-xl font-bold mt-1">
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
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
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
                        <div className="px-4 pb-6 pt-4 text-sm text-gray-700 border-t border-gray-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Still have a question?{" "}</span>
                  {/* <a
                    href="/book-appiontment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-coral text-white mb- inline-block px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Book a quick call with our team
                  </a> */}
                  {/* <Button
                    variant="outline"
                    className="w-fit h-10px-4 font-medium text-sm border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-all duration-300"
                  >
                    Book a quick call with our team
                    <Calendar className="w-4 h-4 ml-2" />
                  </Button> */}
                  <BookCallButtonWithModal
                    buttonLabel="Talk to our PPC team"
                    className="w-fit h-10px-4 font-medium text-sm border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-all duration-300"
                    buttonSize="lg"
                    buttonVariant="outline"
                    defaultServiceType="Google Ads"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ✅ INDUSTRIES WE MANAGE GOOGLE ADS FOR */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {/* Heading */}
              <div className="text-center mb-12">
                {/* <span className="inline-flex items-center rounded-full bg-brand-coral px-4 py-1 text-s sm:text-sm font-medium tracking-[0.18em] text-white">
                  Industries We Manage Google Ads For
                </span> */}

                <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-brand-purple">
                  Industries We Manage White-Label Google Ads For
                </h2>

                <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
                  Our white-label PPC team has proven experience managing high-intent Google Ads
                  campaigns across competitive industries worldwide.
                </p>
              </div>

              {/* Unified Gradient Card with Tick Points */}
              <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white shadow-lg border-none rounded-2xl">
                <CardContent className="p-8 sm:p-10">
                  <div className="grid gap-8 md:grid-cols-2 items-start">
                    {/* Left Column */}
                    <div>
                      <ul className="space-y-4 text-sm sm:text-base">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Law Firms &amp; Legal Services
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Home Services (HVAC, plumbing, roofing, construction, foundations)
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Local Businesses &amp; Multi-Location Brands
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Right Column */}
                    <div>
                      <ul className="space-y-4 text-sm sm:text-base">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            E-commerce Stores (Search, Shopping &amp; Performance Max)
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            Healthcare &amp; Professional Services
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-white flex-shrink-0 drop-shadow-md" />
                          <span className="text-white/95 font-medium">
                            B2B Services &amp; Lead Generation Businesses
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>


                </CardContent>
              </Card>
              <p className="mt-8 text-m sm:text-base text-black/85 max-w-3xl mx-auto text-center leading-relaxed">
                We tailor ad strategy, keyword intent, bidding models, and landing-page alignment
                based on industry behavior not generic ad templates.
              </p>
            </div>
          </section>

          {/* ✅ QUICK TRUST STRIP – just before final CTA */}
          <section className="py-10 px-4 bg-gray-50 border-t border-b border-brand-purple/10">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex items-center justify-center">
                <h3 className="text-3xl sm:text-3xl font-bold px-4 py-1 rounded-full tracking-[0.18em] text-brand-purple mb-4">
                  Why Agencies Trust BrandingBeez
                </h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {[
                  "100% White-Label Delivery",
                  "US & UK Market Experience",
                  "No Client Contact Ever",
                  "Proven Results Across Competitive Niches",
                  "Scalable Team, No Freelancer Risk",
                ].map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-brand-purple/10 shadow-sm text-sm sm:text-base text-gray-800"
                  >
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Google Ads Tips That Drive ROI</h2>
              <p className="text-xl mb-8 text-white/90">Get expert tips, campaign strategies, and real case studies to boost your ROI delivered straight to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-brand-coral hover:bg-brand-purple hover:text-white"
                  onClick={() => navigate('/#newsletter')}
                >
                  Subscribe Free
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}