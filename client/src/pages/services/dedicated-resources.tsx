import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingCalculator } from "@/components/pricing-calculator";
import { CaseStudies } from "@/components/case-studies";
import { Link } from "wouter";
import {
  Users,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Award,
  Target,
  Zap,
  Handshake,
  Building,
  Calculator,
  Calendar,
  ExternalLink,
} from "lucide-react";
import socialLandLogo from "@assets/WhatsApp Image 2025-07-19 at 12.02.39_1754111968432.jpeg";
import koalaDigitalLogo from "@assets/WhatsApp Image 2025-07-19 at 12.02.40_1754112106610.jpeg";
import websiteArchitectLogo from "@assets/WhatsApp Image 2025-07-19 at 12.02.41_1754112106613.jpeg";
import fsbLogo from "../../../public/images/FSE-Digital-Logo.jpg";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { DedicatedResourcesSchema } from "@/utils/all-schemas";
import { navigate } from "wouter/use-browser-location";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import AgencyContactSection from "@/components/agency-contact-section";
import { PhaseSliderSection } from "@/components/phase-slider-section";

export default function DedicatedResources() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const phases = [
    {
      id: 1,
      label: "Phase 1",
      title: "Discovery & Team Planning",
      intro: "We understand your:",
      points: [
        "Workload",
        "Bottlenecks",
        "Service mix",
        "Delivery challenges",
        "Expected monthly output",
      ],
      outcome:
        "You receive a recommended team structure + transparent pricing.",
    },
    {
      id: 2,
      label: "Phase 2",
      title: "Hiring & Setup (7–14 Days)",
      intro: "We handle:",
      points: [
        "Shortlisting",
        "Interviews with your team",
        "Skill tests",
        "Background checks",
        "Tools + access setup",
      ],
      outcome: "You choose the final candidates.",
    },
    {
      id: 3,
      label: "Phase 3",
      title: "Integration (Week 1–2)",
      intro: "Your dedicated team gets aligned with:",
      points: [
        "Your tools",
        "Your processes",
        "Your brand style",
        "Your communication style",
        "Your project management workflow",
      ],
      outcome: "You treat them exactly like your internal team.",
    },
    {
      id: 4,
      label: "Phase 4",
      title: "Active Delivery",
      intro: "Your team runs:",
      points: [
        "Daily standups",
        "Weekly sprints",
        "Monthly output reviews",
        "Performance and KPI monitoring",
      ],
      // extraIntro: "You get:",
      // extraPoints: [
      //   "Direct communication",
      //   "Daily/weekly reports",
      //   "Priority delivery",
      //   "End-to-end accountability",
      // ],
      outcome: "You get a predictable, accountable delivery engine.",
    },
    {
      id: 5,
      label: "Phase 5",
      title: "Scaling & Continuous Improvement",
      intro: "As your workload grows, you can:",
      points: [
        "Add more roles",
        "Upgrade to senior specialists",
        "Add a technical lead / project manager",
        "Improve output with process optimisation",
      ],
      outcome:
        "Your dedicated team evolves with your growth instead of holding it back.",
    },
  ];

  const totalPhases = phases.length;

  const goToNextPhase = () => {
    setCurrentPhase((prev) => (prev + 1 < totalPhases ? prev + 1 : prev));
  };

  const goToPrevPhase = () => {
    setCurrentPhase((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;

    // Swipe threshold
    if (diff > 50 && currentPhase < totalPhases - 1) {
      // swipe left -> next
      goToNextPhase();
    } else if (diff < -50 && currentPhase > 0) {
      // swipe right -> prev
      goToPrevPhase();
    }

    setTouchStartX(null);
  };

  const activePhase = phases[currentPhase];

  const handleScrollToCaseStudies = () => {
    if (typeof document === "undefined") return; // safety for SSR

    const section = document.getElementById("case-studies");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleHireClick = () => {
    navigate("/pricing-calculator?service=dedicated-resources");
  };

  return (
    <>
      <Helmet>
        <title>Dedicated White-Label Teams for Agencies | BrandingBeez</title>
        <meta
          name="description"
          content="Hire dedicated white-label developers, designers, SEO & PPC specialists. Scale delivery, cut costs, and stay in control — no hiring risk."
        />
        <link
          rel="canonical"
          href="https://brandingbeez.co.uk/services/dedicated-resources"
        />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="Dedicated Development Teams — Scale Faster with Branding Beez"
          description="Embed top-tier developers & specialists, cut costs by 60%, and boost output by 150%"
          keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
          canonicalUrl="https://brandingbeez.co.uk/services/dedicated-resources"
          ogType="website"
        />
        <SchemaMarkup type="custom" data={DedicatedResourcesSchema} />
        <Header />
        <main>
          {/* Hero Section */}
          <section className="pt-20 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 sm:mb-6 leading-tight">
                    White-Label Dedicated Teams for Digital Marketing Agencies
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-xl">
                    Hire fully embedded developers, designers, and marketers who
                    work under your brand, inside your workflow, with your clients
                    staying yours.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                    <div className="bg-white/10 rounded-lg p-4 sm:p-5 text-center">
                      <div className="text-xl sm:text-2xl font-bold">Upto 150%</div>
                      <div className="text-xs sm:text-sm text-white/80">
                        Output Increase
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 sm:p-5 text-center">
                      <div className="text-xl sm:text-2xl font-bold">60%</div>
                      <div className="text-xs sm:text-sm text-white/80">
                        Cost Savings
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link href="/pricing-calculator?service=dedicated-resources">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-white font-medium text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                      >
                        Hire Your Team
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>

                    {/* Secondary CTA */}
                    <Button
                      variant="outline"
                      onClick={handleScrollToCaseStudies}
                      className="border-white/70 text-white hover:bg-white hover:text-brand-purple text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 bg-white/10"
                    >
                      View SEO Case Studies
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 mt-8 lg:mt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm mx-auto sm:mx-0">
                      <img
                        src={socialLandLogo}
                        alt="Social Land Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex justify-center sm:justify-end">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Digital Marketing Agency
                      </Badge>
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
                    Social Land Success Story
                  </p>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-white/80 flex-shrink-0" />
                      <span>United Kingdom Headquarters</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-white/80 flex-shrink-0" />
                      <span>6-person embedded team</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-white/80 flex-shrink-0" />
                      <span>25+ projects monthly (from 10-12)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-white/80 flex-shrink-0" />
                      <span>3-4 day turnaround (from 8-10)</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/case-studies/social-land">
                      <Button
                        size="sm"
                        className="w-full bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                      >
                        View Full Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NEW – How the Dedicated Team Setup Works (Phase Slider) */}
          <section className="py-12 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              <PhaseSliderSection
                sectionId="dedicated-team-process"
                heading="How the Dedicated Team Setup Works"
                subheading="A simple, transparent process built for agencies."
                phases={phases}
                badgeLabel="Process Overview"
                sectionClassName="py-0 px-0"
                wrapperClassName="max-w-5xl mx-auto"
                cardHeightClass="min-h-[320px] sm:min-h-[360px] md:min-h-[380px]"
              />

              {/* What's Included – static block under phases */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Card 1 — What's Included */}
                <Card className="bg-gray-50 border-dashed border-2 border-brand-purple/20 h-full">
                  <CardHeader className="pb-3 px-4 sm:px-6">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-purple">
                      What’s Included in Every Dedicated Team
                    </h3>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Daily standups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Weekly reports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>End-to-end task ownership</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Internal Slack/Teams integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Strict QA processes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Dedicated account manager</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Card 2 — Benefits You Get */}
                <Card className="bg-gray-50 border-dashed border-2 border-brand-purple/20 h-full">
                  <CardHeader className="pb-3 px-4 sm:px-6">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-purple">
                      Benefits You Get
                    </h3>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Direct communication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Daily/weekly reports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Priority delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>End-to-end accountability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Workflow optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-brand-purple flex-shrink-0" />
                        <span>Confidentiality &amp; data-security compliance</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Available Resources Section */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-purple mb-3 sm:mb-4">
                  Available Dedicated Resources
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose from our specialized professionals across skill levels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* 1 - Graphic Designer */}
                <Card className="transition-shadow h-full flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-row items-center gap-2 m-4">
                      <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-purple">
                        Graphic Designer
                      </h3>
                    </div>

                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Visual design experts for all your branding needs
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Junior Level</span>
                            <span className="text-xs text-gray-500">
                              1+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Senior Level</span>
                            <span className="text-xs text-gray-500">
                              2+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Creative Director</span>
                            <span className="text-xs text-gray-500">
                              5+ years experience
                            </span>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  {/* Button */}
                  <div className="flex justify-end p-4 mt-auto">
                    <Button onClick={handleHireClick} className="bg-brand-purple text-white hover:bg-brand-purple/90">
                      Hire Your Team
                    </Button>
                  </div>
                </Card>

                {/* 2 - Video Editor */}
                <Card className="transition-shadow h-full flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-row items-center gap-2 m-4">
                      <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-purple">
                        Video Editor
                      </h3>
                    </div>

                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Professional video editing and motion graphics
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Junior Level</span>
                            <span className="text-xs text-gray-500">
                              1+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Senior Level</span>
                            <span className="text-xs text-gray-500">
                              2+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Production Lead</span>
                            <span className="text-xs text-gray-500">
                              5+ years experience
                            </span>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  {/* Button */}
                  <div className="flex justify-end p-4 mt-auto">
                    <Button onClick={handleHireClick} className="bg-brand-purple text-white hover:bg-brand-purple/90">
                      Hire Your Team
                    </Button>
                  </div>
                </Card>

                {/* 3 - SEO Specialist */}
                <Card className="relative border-2 border-brand-purple/40 shadow-lg shadow-brand-purple/10 transition-shadow h-full flex flex-col">
                  <span className="absolute top-3 right-3 rounded-full bg-brand-coral text-white text-xs font-semibold px-3 py-1">
                    Most in demand
                  </span>

                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-row items-center gap-2 m-4">
                      <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-purple">
                        SEO Specialist
                      </h3>
                    </div>

                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Organic search optimization experts
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Junior Level</span>
                            <span className="text-xs text-gray-500">
                              1+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Senior Level</span>
                            <span className="text-xs text-gray-500">
                              2+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Specialist</span>
                            <span className="text-xs text-gray-500">
                              5+ years experience
                            </span>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  {/* Button */}
                  <div className="flex justify-end p-4 mt-auto">
                    <Button onClick={handleHireClick} className="bg-brand-purple text-white hover:bg-brand-purple/90">
                      Hire Your Team
                    </Button>
                  </div>
                </Card>

                {/* 4 - Google Ads Expert */}
                <Card className="relative border-2 border-brand-purple/40 shadow-lg shadow-brand-purple/10 transition-shadow h-full flex flex-col">
                  <span className="absolute top-3 right-3 rounded-full bg-brand-coral text-white text-xs font-semibold px-3 py-1">
                    Most in demand
                  </span>

                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-row items-center gap-2 m-4">
                      <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-purple">
                        Google Ads Expert
                      </h3>
                    </div>

                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        PPC campaign management professionals
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Senior Level</span>
                            <span className="text-xs text-gray-500">
                              2+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Specialist</span>
                            <span className="text-xs text-gray-500">
                              5+ years experience
                            </span>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  {/* Button */}
                  <div className="flex justify-end p-4 mt-auto">
                    <Button onClick={handleHireClick} className="bg-brand-purple text-white hover:bg-brand-purple/90">
                      Hire Your Team
                    </Button>
                  </div>
                </Card>

                {/* 5 - Web Developer */}
                <Card className="relative border-2 border-brand-purple/40 shadow-lg shadow-brand-purple/10 transition-shadow h-full flex flex-col">
                  <span className="absolute top-3 right-3 rounded-full bg-brand-coral text-white text-xs font-semibold px-3 py-1">
                    Most in demand
                  </span>

                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-row items-center gap-2 m-4">
                      <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-purple">
                        Web Developer
                      </h3>
                    </div>

                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Frontend and WordPress development experts
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Junior Level</span>
                            <span className="text-xs text-gray-500">
                              1+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Senior Level</span>
                            <span className="text-xs text-gray-500">
                              2+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">E-comm Specialist</span>
                            <span className="text-xs text-gray-500">
                              5+ years experience
                            </span>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  {/* Button */}
                  <div className="flex justify-end p-4 mt-auto">
                    <Button onClick={handleHireClick} className="bg-brand-purple text-white hover:bg-brand-purple/90">
                      Hire Your Team
                    </Button>
                  </div>
                </Card>

                {/* 6 - Full-Stack Developer */}
                <Card className="border border-brand-purple/40 shadow-lg shadow-brand-purple/10 transition-shadow h-full flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-row items-center gap-2 m-4">
                      <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-purple">
                        Full-Stack Developer
                      </h3>
                    </div>

                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Complete web application development
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Junior Level</span>
                            <span className="text-xs text-gray-500">
                              1+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Senior Level</span>
                            <span className="text-xs text-gray-500">
                              2+ years experience
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                          <div className="text-sm leading-tight">
                            <span className="font-medium block">Lead / Manager</span>
                            <span className="text-xs text-gray-500">
                              5+ years experience
                            </span>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  {/* Button */}
                  <div className="flex justify-end p-4 mt-auto">
                    <Button onClick={handleHireClick} className="bg-brand-purple text-white hover:bg-brand-purple/90">
                      Hire Your Team
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Mid-page CTA Strip – Dedicated Team Plan Review */}
          <section className="py-8 sm:py-10 bg-brand-wings/40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="w-full md:w-2/3">
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-brand-coral uppercase tracking-wide">
                    Not Sure What Type of Team You Need?
                  </p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">
                    We’ll analyse your:
                  </h3>
                  <div className="mt-3">
                    {/* 2x2 bullet grid */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm md:text-base text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-brand-coral font-bold">•</span>
                        <span>Current workload</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-coral font-bold">•</span>
                        <span>Service bottlenecks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-coral font-bold">•</span>
                        <span>Monthly delivery targets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-coral font-bold">•</span>
                        <span>Internal capacity</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="w-full md:w-auto flex justify-start md:justify-end">
                  <BookCallButtonWithModal
                    buttonLabel="Book Free Team Planning Call"
                    className="w-full md:w-auto whitespace-nowrap bg-brand-coral text-white hover:bg-brand-coral/90"
                    buttonSize="lg"
                    defaultServiceType="Dedicated Resources"
                  />
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-800 mt-4 font-medium text-left">
                And recommend a lean, efficient team structure that gets results
                from Month 1.
              </p>
            </div>
          </section>

          {/* Pricing Calculator CTA */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-brand-purple to-brand-coral p-6 sm:p-8 rounded-2xl text-white">
                <h2 className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6">
                  <Calculator className="w-4 h-4" />
                  Free Pricing Calculator
                </h2>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                  Get Instant Pricing for Your Team
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Calculate exact costs based on your requirements. Select
                  resource types, skill levels, and team size with automatic
                  volume discounts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-xl sm:text-2xl font-bold">10%</div>
                    <div className="text-xs sm:text-sm text-white/80">
                      Volume Discount
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-xl sm:text-2xl font-bold">60%</div>
                    <div className="text-xs sm:text-sm text-white/80">
                      Cost Savings
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-xl sm:text-2xl font-bold">24hr</div>
                    <div className="text-xs sm:text-sm text-white/80">
                      Quick Setup
                    </div>
                  </div>
                </div>
                <Link href="/pricing-calculator?service=dedicated-resources">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple px-8 py-3"
                  >
                    Calculate Your Pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Success Stories Section */}
          <section
            id="case-studies"
            className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-purple mb-3 sm:mb-4">
                  Dedicated Team Success Stories
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Real results from companies that transformed their operations with our
                  dedicated teams
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                {/* Social Land - Digital Marketing Agency Success */}
                <Card className="relative bg-white h-full flex flex-col">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-coral text-white">+30 Months Onwards</Badge>
                  </div>

                  <CardContent className="p-6 sm:p-8 pt-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                        <img
                          src={socialLandLogo}
                          alt="Social Land Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Digital Marketing
                      </Badge>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Social Land
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      6-person dedicated team with UK agency achieving seamless borderless
                      collaboration
                    </p>

                    <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 text-sm sm:text-base">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Project Output</span>
                        <span className="text-lg font-bold text-green-600">+150%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Cost Savings</span>
                        <span className="text-lg font-bold text-blue-600">60%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span className="text-lg font-bold text-brand-purple">
                          6 People
                        </span>
                      </div>
                    </div>

                    {/* Pinned CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link href="/case-studies/social-land">
                        <Button className="w-full h-11 bg-brand-coral hover:bg-brand-coral/90">
                          View Full Case Study
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Koala Digital - Digital Marketing Agency */}
                <Card className="relative bg-white h-full flex flex-col">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-coral text-white">+24 Months Onwards</Badge>
                  </div>

                  <CardContent className="p-6 sm:p-8 pt-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                        <img
                          src={koalaDigitalLogo}
                          alt="Koala Digital Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Digital Marketing
                      </Badge>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Koala Digital
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      2-person specialized team transformed UK agency delivery with 55%
                      cost savings
                    </p>

                    <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 text-sm sm:text-base">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Campaign Output</span>
                        <span className="text-lg font-bold text-green-600">+150%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Cost Reduction</span>
                        <span className="text-lg font-bold text-blue-600">55%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span className="text-lg font-bold text-brand-purple">
                          2 People
                        </span>
                      </div>
                    </div>

                    {/* Pinned CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link href="/case-studies/koala-digital">
                        <Button className="w-full h-11 bg-brand-coral hover:bg-brand-coral/90">
                          View Full Case Study
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Website Architect - Web Development Agency */}
                <Card className="relative bg-white h-full flex flex-col">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-coral text-white">+12 Months Onwards</Badge>
                  </div>

                  <CardContent className="p-6 sm:p-8 pt-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                        <img
                          src={websiteArchitectLogo}
                          alt="Website Architect Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Web Development
                      </Badge>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Website Architect
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      3-person team transformed solo founder from overworked to empowered
                      growth
                    </p>

                    <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 text-sm sm:text-base">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Monthly Output</span>
                        <span className="text-lg font-bold text-green-600">+200%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">New Services</span>
                        <span className="text-lg font-bold text-blue-600">SEO Added</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span className="text-lg font-bold text-brand-purple">
                          3 People
                        </span>
                      </div>
                    </div>

                    {/* Pinned CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link href="/case-studies/website-architect">
                        <Button className="w-full h-11 bg-brand-coral hover:bg-brand-coral/90">
                          View Full Case Study
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* FSE Digital - Google Ads Specialist */}
                <Card className="relative bg-white h-full flex flex-col md:col-span-2 lg:col-span-1">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-600 text-white">Newly Onboarded</Badge>
                  </div>

                  <CardContent className="p-6 sm:p-8 pt-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                        <img
                          src={fsbLogo}
                          alt="FSE Digital Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Google Ads
                      </Badge>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      FSE Digital
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      1-person dedicated Google Ads specialist supporting K Agency with
                      full-time white-label campaign delivery.
                    </p>

                    <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 text-sm sm:text-base">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Delivery Output</span>
                        <span className="text-lg font-bold text-green-600">+100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Hiring Overhead</span>
                        <span className="text-lg font-bold text-blue-600">0%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span className="text-lg font-bold text-brand-purple">
                          1 Person
                        </span>
                      </div>
                    </div>

                    {/* Pinned CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link href="/case-studies/fse-digital">
                        <Button className="w-full h-11 bg-brand-coral hover:bg-brand-coral/90">
                          View Full Case Study
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* In-section CTA – “Help me choose my team” */}
            <div className="mt-10 sm:mt-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-0">
              <Card className="p-5 sm:p-6 md:p-8 bg-gray-50 border-dashed border-2 border-brand-coral/30">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                  <div className="w-full md:w-2/3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      Not sure which package or mix is right for you?
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base">
                      Share your current workload, target services, and internal team size
                      we&apos;ll recommend the right dedicated team structure in a short
                      call.
                    </p>
                  </div>
                  <div className="w-full md:w-auto flex justify-start md:justify-end">
                    <BookCallButtonWithModal
                      buttonLabel="Talk to the Team Planning Desk"
                      className="w-full md:w-auto bg-brand-coral text-white hover:bg-brand-coral/90"
                      buttonSize="lg"
                      defaultServiceType="Dedicated Resources"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </section>


          {/* Pricing Section */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-purple mb-3 sm:mb-4">
                  Team Packages
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Flexible pricing for teams of all sizes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* Individual Resources */}
                <Card
                  className={[
                    "relative flex flex-col h-full transition-all duration-300",
                    "border border-brand-purple/20 hover:border-brand-purple/40 hover:shadow-sm",
                  ].join(" ")}
                >
                  <CardHeader className="text-center pb-4 flex-shrink-0 px-4 pt-6">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-purple">
                      Individual Resources
                    </h3>
                    <div className="mt-3 sm:mt-4">
                      <div className="text-2xl sm:text-3xl font-extrabold text-brand-coral">
                        {/* From $1200 */}
                        From $1,199
                      </div>
                      <div className="text-sm text-gray-900/70">
                        /month per resource
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow px-5 pb-6">
                    <ul className="space-y-3 mb-6 sm:mb-8 flex-grow text-sm sm:text-base">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Junior to Senior levels available
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          11 specialist roles available
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Direct communication
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Weekly progress reports
                        </span>
                      </li>
                    </ul>

                    <div className="mt-auto pt-6 sm:pt-8 border-t border-brand-purple/10">
                      <div className="flex flex-col gap-3">
                        <Link href="/pricing-calculator">
                          <Button className="w-full h-11 px-4 text-sm font-medium bg-brand-coral hover:bg-brand-coral text-white transition-all duration-300">
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Small Team (2-4 People) */}
                <Card
                  className={[
                    "relative flex flex-col h-full transition-all duration-300",
                    "border-2 border-brand-coral shadow-sm scale-[1.02]",
                  ].join(" ")}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-coral text-white px-4 py-1 rounded-full text-xs sm:text-sm">
                      Most Popular
                    </Badge>
                  </div>

                  <CardHeader className="text-center pb-4 flex-shrink-0 px-4 pt-8">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-purple">
                      Small Team (2–4 People)
                    </h3>
                    <div className="mt-3 sm:mt-4">
                      <div className="text-2xl sm:text-3xl font-extrabold text-brand-coral">
                        10% Off
                      </div>
                      <div className="text-sm text-gray-900/70">
                        Team discount applied
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow px-5 pb-6">
                    <ul className="space-y-3 mb-6 sm:mb-8 flex-grow text-sm sm:text-base">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Mix of developers, designers &amp; specialists
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Team coordination included
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Daily standups &amp; sprints
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Volume pricing benefits
                        </span>
                      </li>
                    </ul>

                    <div className="mt-auto pt-6 sm:pt-8 border-t border-brand-purple/10">
                      <div className="flex flex-col gap-3">
                        <Link href="/pricing-calculator">
                          <Button className="w-full h-11 px-4 text-sm font-medium bg-brand-coral hover:bg-brand-coral text-white transition-all duration-300">
                            Build Your Team
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Large Team (5+ People) */}
                <Card
                  className={[
                    "relative flex flex-col h-full transition-all duration-300",
                    "border border-brand-purple/20 hover:border-brand-purple/40 hover:shadow-sm",
                  ].join(" ")}
                >
                  <CardHeader className="text-center pb-4 flex-shrink-0 px-4 pt-6">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-purple">
                      Large Team (5+ People)
                    </h3>
                    <div className="mt-3 sm:mt-4">
                      <div className="text-2xl sm:text-3xl font-extrabold text-brand-coral">
                        20% Off
                      </div>
                      <div className="text-sm text-gray-900/70">
                        Maximum team discount
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow px-5 pb-6">
                    <ul className="space-y-3 mb-6 sm:mb-8 flex-grow text-sm sm:text-base">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Full-scale development teams
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Technical lead &amp; project manager
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Best volume pricing available
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 leading-relaxed">
                          Priority support &amp; dedicated account manager
                        </span>
                      </li>
                    </ul>

                    <div className="mt-auto pt-6 sm:pt-8 border-t border-brand-purple/10">
                      <div className="flex flex-col gap-3">
                        <Link href="/pricing-calculator">
                          <Button className="w-full h-11 px-4 text-sm font-medium bg-brand-coral hover:bg-brand-coral text-white transition-all duration-300">
                            Scale Your Team
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact Form Section (reusable component) */}
          <AgencyContactSection
            sectionId="contact-form"
            heading="Ready to Scale Your Agency?"
            subheading="Get a free consultation and discover how we can help you grow."
            inquiryType="service-dr-contact-form"
            contactFormType="service-dr-contact-form"
            submissionSourceLabel="Service Page Contact Form Submission"
          />

          {/* CTA Section */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-brand-purple text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Build Your Dream Team?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
                Subscribe for expert tips on hiring, managing, and scaling with
                dedicated developers and designers straight from BrandingBeez.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-white hover:bg-white hover:text-brand-purple bg-[#ee4977]"
                  onClick={() => navigate("/#newsletter")}
                >
                  Subscribe Now
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
