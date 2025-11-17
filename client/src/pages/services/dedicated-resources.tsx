import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRight,
  Star,
  Award,
  Target,
  Zap,
  Handshake,
  Building,
  Calculator,
} from "lucide-react";
import socialLandLogo from "@assets/WhatsApp Image 2025-07-19 at 12.02.39_1754111968432.jpeg";
import koalaDigitalLogo from "@assets/WhatsApp Image 2025-07-19 at 12.02.40_1754112106610.jpeg";
import websiteArchitectLogo from "@assets/WhatsApp Image 2025-07-19 at 12.02.41_1754112106613.jpeg";

export default function DedicatedResources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  Featured Success: Social Land
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Dedicated Development Teams
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Access top-tier developers, designers, and specialists without
                  the overhead. Our dedicated teams integrate seamlessly with
                  your workflow.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">150%</div>
                    <div className="text-sm text-white/80">Output Increase</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">60%</div>
                    <div className="text-sm text-white/80">Cost Savings</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing-calculator">
                    <Button
                      size="lg"
                      className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                    >
                      Get Team Quote
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                    <img
                      src={socialLandLogo}
                      alt="Social Land Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Digital Marketing Agency
                  </Badge>
                </div>
                <p className="text-xl font-bold mb-4">
                  Social Land Success Story
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-white/80" />
                    <span>United Kingdom Headquarters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>6-person embedded team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-white/80" />
                    <span>25+ projects monthly (from 10-12)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-white/80" />
                    <span>3-4 day turnaround (from 8-10)</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/case-studies/social-land">
                    <Button
                      size="sm"
                      className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple w-full"
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

        {/* Available Resources Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Available Dedicated Resources</h2>
              <p className="text-xl text-gray-600">
                Choose from our specialized professionals across skill levels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 1 - Graphic Designer */}
              <Card className="transition-shadow">
                <div className="flex flex-row items-center gap-2 m-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-purple">Graphic Designer</h3>
                </div>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Visual design experts for all your branding needs
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Junior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Senior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Creative Director</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 2 - Video Editor */}
              <Card className="transition-shadow">
                <div className="flex flex-row items-center gap-2 m-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-purple">Video Editor</h3>
                </div>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Professional video editing and motion graphics
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Junior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Senior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Production Lead</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 3 - SEO Specialist */}
              <Card className="transition-shadow">
                <div className="flex flex-row items-center gap-2 m-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-purple">SEO Specialist</h3>
                </div>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Organic search optimization experts
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Junior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Senior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Specialist</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 4 - Google Ads Expert */}
              <Card className="transition-shadow">
                <div className="flex flex-row items-center gap-2 m-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-purple">Google Ads Expert</h3>
                </div>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    PPC campaign management professionals
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Senior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Specialist</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 5 - Web Developer */}
              <Card className="transition-shadow">
                <div className="flex flex-row items-center gap-2 m-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-purple">Web Developer</h3>
                </div>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Frontend and WordPress development experts
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Junior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Senior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">E-comm Specialist</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 6 - Full-Stack Developer */}
              <Card className="transition-shadow">
                <div className="flex flex-row items-center gap-2 m-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-purple">Full-Stack Developer</h3>
                </div>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Complete web application development
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Junior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Senior Level</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Lead/Manager</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 7 - Others */}
              <Card className="transition-shadow">
                <div className="flex flex-row items-center gap-2 m-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-purple">Others</h3>
                </div>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Administrative and social media support
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Data Entry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Virtual Assistants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">Social Media Managers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

          </div>
        </section>

        {/* Pricing Calculator CTA */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-brand-purple to-brand-coral p-8 rounded-2xl text-white">
              <h2 className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Calculator className="w-4 h-4" />
                Free Pricing Calculator
              </h2>
              <h3 className="text-3xl font-bold mb-4">
                Get Instant Pricing for Your Team
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Calculate exact costs based on your requirements. Select
                resource types, skill levels, and team size with automatic
                volume discounts.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">10%</div>
                  <div className="text-sm text-white/80">Volume Discount</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">60%</div>
                  <div className="text-sm text-white/80">Cost Savings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">24hr</div>
                  <div className="text-sm text-white/80">Quick Setup</div>
                </div>
              </div>
              <Link href="/pricing-calculator">
                <Button
                  size="lg"
                  className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple px-8 py-3"
                >
                  Calculate Your Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Dedicated Team Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Real results from companies that transformed their operations
                with our dedicated teams
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {/* Social Land - Digital Marketing Agency Success */}
              <Card className="relative bg-white h-full flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand-coral text-white">Featured Success</Badge>
                </div>

                <CardContent className="p-8 pt-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">Digital Marketing</Badge>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                      <img src={socialLandLogo} alt="Social Land Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">Social Land</h3>
                  <p className="text-gray-600 mb-4">
                    6-person dedicated team with UK agency achieving seamless borderless collaboration
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Project Output</span>
                      <span className="text-lg font-bold text-green-600">+150%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cost Savings</span>
                      <span className="text-lg font-bold text-blue-600">60%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Size</span>
                      <span className="text-lg font-bold text-brand-purple">6 People</span>
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
              <Card className="bg-white h-full flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <Badge className="bg-green-100 text-green-800 border-green-200">Digital Marketing</Badge>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                      <img src={koalaDigitalLogo} alt="Koala Digital Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">Koala Digital</h3>
                  <p className="text-gray-600 mb-4">
                    2-person specialized team transformed UK agency delivery with 55% cost savings
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Campaign Output</span>
                      <span className="text-lg font-bold text-green-600">+150%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cost Reduction</span>
                      <span className="text-lg font-bold text-blue-600">55%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Size</span>
                      <span className="text-lg font-bold text-brand-purple">2 People</span>
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
              <Card className="bg-white h-full flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">Web Development</Badge>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                      <img src={websiteArchitectLogo} alt="Website Architect Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">Website Architect</h3>
                  <p className="text-gray-600 mb-4">
                    3-person team transformed solo founder from overworked to empowered growth
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Output</span>
                      <span className="text-lg font-bold text-green-600">+200%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">New Services</span>
                      <span className="text-lg font-bold text-blue-600">SEO Added</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Size</span>
                      <span className="text-lg font-bold text-brand-purple">3 People</span>
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
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Team Packages
              </h2>
              <p className="text-xl text-gray-600">
                Flexible pricing for teams of all sizes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Individual Resources */}
              <Card
                className={[
                  "relative flex flex-col h-full transition-all duration-300",
                  "border border-brand-purple/20 hover:border-brand-purple/40 hover:shadow-sm",
                ].join(" ")}
              >
                {/* Header */}
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <h3 className="text-xl font-bold text-brand-purple">Individual Resources</h3>
                  <div className="mt-4">
                    <div className="text-3xl font-extrabold text-brand-coral">From $800</div>
                    <div className="text-gray-900/70">/month per resource</div>
                  </div>
                </CardHeader>

                {/* Features */}
                <CardContent className="flex flex-col flex-grow">
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Junior to Senior levels available
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        11 specialist roles available
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Direct communication
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Weekly progress reports
                      </span>
                    </li>
                  </ul>

                  {/* Actions */}
                  <div className="mt-auto pt-8 border-t border-brand-purple/10">
                    <div className="flex flex-col gap-4">
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
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand-coral text-white px-4 py-1 rounded-full">
                    Most Popular
                  </Badge>
                </div>

                {/* Header */}
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <h3 className="text-xl font-bold text-brand-purple">
                    Small Team (2–4 People)
                  </h3>
                  <div className="mt-4">
                    <div className="text-3xl font-extrabold text-brand-coral">5–10% Off</div>
                    <div className="text-gray-900/70">Team discount applied</div>
                  </div>
                </CardHeader>

                {/* Features */}
                <CardContent className="flex flex-col flex-grow">
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Mix of developers, designers & specialists
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Team coordination included
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Daily standups & sprints
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Volume pricing benefits
                      </span>
                    </li>
                  </ul>

                  {/* Actions */}
                  <div className="mt-auto pt-8 border-t border-brand-purple/10">
                    <div className="flex flex-col gap-4">
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
                {/* Header */}
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <h3 className="text-xl font-bold text-brand-purple">
                    Large Team (5+ People)
                  </h3>
                  <div className="mt-4">
                    <div className="text-3xl font-extrabold text-brand-coral">
                      15–20% Off
                    </div>
                    <div className="text-gray-900/70">Maximum team discount</div>
                  </div>
                </CardHeader>

                {/* Features */}
                <CardContent className="flex flex-col flex-grow">
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Full-scale development teams
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Technical lead & project manager
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Best volume pricing available
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">
                        Priority support & dedicated account manager
                      </span>
                    </li>
                  </ul>

                  {/* Actions */}
                  <div className="mt-auto pt-8 border-t border-brand-purple/10">
                    <div className="flex flex-col gap-4">
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

        {/* CTA Section */}
        <section className="py-16 px-4 bg-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your Dream Team?
            </h2>
            <p className="text-xl text-white/90 mb-8">Subscribe for expert tips on hiring, managing, and scaling with dedicated developers and designers—straight from BrandingBeez.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-purple bg-[#ee4977]"
                onClick={() => window.open('/newsletter', '_blank')}
              >Subscribe Now</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}