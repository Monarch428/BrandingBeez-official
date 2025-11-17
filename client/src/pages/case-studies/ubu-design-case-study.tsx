import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Target,
  Search,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  Users,
  Calendar,
  Globe,
  Zap,
  Settings,
  Eye,
  MousePointer,
  Award,
  ExternalLink,
  MapPin,
  Building,
  Clock,
  Compass,
  PenTool,
  Home,
} from "lucide-react";
import ubuDesignPerformanceImage from "@assets/ubu-design-seo-performance_1754120293127.png";
import { Link } from "wouter";

export default function UBUDesignCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white "> {/* text-gray-900 */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">
                  White-Label B2B Architecture SEO
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  UBU Design
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  How we transformed a UK architecture firm from zero organic
                  visibility to generating daily leads through strategic B2B SEO
                  in 90 days
                </p>
                <div className="flex flex-wrap gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>230 Total Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    <span>482 Organic Clicks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>50,900 Impressions</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:scale-105 transition-transform duration-300">
                  <img
                    src={ubuDesignPerformanceImage}
                    alt="UBU Design Google Search Console Performance showing 516 total clicks, 55.4K total impressions, and performance graphs"
                    className="w-full h-auto rounded-lg shadow-lg"
                    loading="lazy"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">Google Search Console</p>
                    <p className="text-sm opacity-80">
                      Real Performance Data
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Overview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Client Overview
                </h2>
                <p className="text-gray-600 text-lg">
                  Understanding the architectural design business context
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {/* Company Profile */}
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-8 h-8 text-brand-purple" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Company Profile
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Boutique UK architecture firm</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Specializes in commercial projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>B2B business model</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Premium design services</span>
                    </li>
                  </ul>
                </Card>

                {/* Target Audience */}
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-brand-coral" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Target Audience
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>UK developers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Commercial investors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Property owners</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Project decision-makers</span>
                    </li>
                  </ul>
                </Card>

                {/* Project Details */}
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-brand-purple" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Project Details
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Duration: May–July 2025</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>White-label partnership</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Through Gemma's Agency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>90-day transformation</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>


        {/* Before & After Metrics */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  From Zero to Generating Daily Leads
                </h2>
                <p className="text-gray-600 text-lg">
                  Complete transformation in organic search visibility
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="p-8 border-2 border-red-200">
                  <div className="text-center mb-6">
                    <h3 className="bg-red-100 text-red-800 mb-4 inline-block px-2 py-1 rounded text-sm font-medium">
                      Before (Pre-May 2025)
                    </h3>
                    <h4 className="text-2xl font-bold text-gray-900">
                      Baseline Performance
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">
                        Daily Organic Visitors
                      </span>
                      <span className="font-bold text-red-600">0-2</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">Keyword Rankings</span>
                      <span className="font-bold text-red-600">None</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">Organic Leads</span>
                      <span className="font-bold text-red-600">Negligible</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">
                        Local Search Visibility
                      </span>
                      <span className="font-bold text-red-600">Minimal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">
                        Technical SEO Status
                      </span>
                      <span className="font-bold text-red-600">Poor</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-2 border-green-200">
                  <div className="text-center mb-6">
                    <h3 className="bg-green-100 text-green-800 mb-4 inline-block px-2 py-1 rounded text-sm font-medium">
                      After (July 2025)
                    </h3>
                    <h4 className="text-2xl font-bold text-gray-900">
                      Transformed Performance
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Total Users</span>
                      <span className="font-bold text-green-600">230</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Organic Users</span>
                      <span className="font-bold text-green-600">
                        141 (61%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Daily Sessions</span>
                      <span className="font-bold text-green-600">5-8 peak</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Returning Users</span>
                      <span className="font-bold text-green-600">47</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Lead Generation</span>
                      <span className="font-bold text-green-600">
                        Daily Organic Leads
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Search Performance */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Search Console Performance
                </h2>
                <p className="text-gray-600 text-lg">
                  3-month search visibility and engagement results
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <MousePointer className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-purple mb-2">
                    482
                  </h3>
                  <p className="text-gray-600">Total Clicks (3 months)</p>
                </Card>

                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-coral mb-2">
                    50,900
                  </h3>
                  <p className="text-gray-600">Total Impressions</p>
                </Card>

                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-purple mb-2">
                    32.2
                  </h3>
                  <p className="text-gray-600">Average Position</p>
                </Card>
              </div>

              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Top Performing Pages
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Homepage</span>
                    <span className="font-bold text-brand-purple">
                      212 clicks
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">
                      "Mark Johnson" Team Page
                    </span>
                    <span className="font-bold text-brand-coral">
                      High engagement
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">"Syrenot House" Project</span>
                    <span className="font-bold text-brand-purple">
                      Featured project
                    </span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">
                    CTR: 0.9% | Average engagement: &gt;1 min for core pages
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Strategy & Implementation */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Strategy & Implementation
                </h2>
                <p className="text-gray-600 text-lg">
                  Comprehensive B2B architecture SEO approach
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Strategic Solutions Implemented
                  </h3>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                          <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Keyword Research & Targeting
                          </h4>
                          <p className="text-gray-600">
                            Focused on high-intent services, project names, and
                            location-based phrases for UK commercial
                            architecture market.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-8 bg-brand-coral rounded-lg flex items-center justify-center">
                          <PenTool className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Content Strategy & Optimization
                          </h4>
                          <p className="text-gray-600">
                            Produced/optimized project pages, news/blogs, and
                            architect profiles tailored to search demand.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Technical SEO Overhaul
                          </h4>
                          <p className="text-gray-600">
                            Improved site crawlability, fixed indexation
                            problems, optimized page speed & structure, added
                            schema markup.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-8 bg-brand-coral rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Link Building & Local SEO
                          </h4>
                          <p className="text-gray-600">
                            Secured project PR, local citations, industry
                            directories, enhanced Google Business Profile, and
                            local structured data.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Implementation Timeline
                  </h3>

                  <div className="space-y-6">
                    <Card className="p-6 border-l-4 border-brand-purple">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-brand-purple" />
                        <h4 className="font-bold text-brand-purple">
                          May 2025
                        </h4>
                      </div>
                      <h5 className="font-bold text-lg mb-2">
                        Technical Audit & Fixes
                      </h5>
                      <p className="text-gray-600">
                        Technical audit, issue triage, crawl/index fixes, and
                        platform optimizations completed.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-brand-coral">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-brand-coral" />
                        <h4 className="font-bold text-brand-coral">
                          June 2025
                        </h4>
                      </div>
                      <h5 className="font-bold text-lg mb-2">
                        Content Launch & Optimization
                      </h5>
                      <p className="text-gray-600">
                        Content/landing page launches and optimization, project
                        showcase pages development.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-brand-coral">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-brand-coral" />
                        <h4 className="font-bold text-brand-coral">
                          July 2025
                        </h4>
                      </div>
                      <h5 className="font-bold text-lg mb-2">
                        Link Building & Local SEO
                      </h5>
                      <p className="text-gray-600">
                        Link acquisition, local SEO implementation, structured
                        data roll-out, and performance optimization.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* White-Label Partnership */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  White-Label Partnership Excellence
                </h2>
                <p className="text-gray-600 text-lg">
                  Seamless collaboration behind the scenes
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    The Human Element
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-8 bg-brand-coral rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">
                          No Direct Client Contact
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Gemma acted as sole liaison, maintaining agency brand
                          integrity throughout the project.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-8 bg-brand-purple rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">
                          Agency-Branded Deliverables
                        </h4>
                        <p className="text-gray-600 text-sm">
                          All reporting and recommendations crafted with Gemma's
                          agency identity front and center.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-8 bg-brand-coral rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white " />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">
                          Seamless Client Experience
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Invisible teamwork ensured trust and made the agency
                          look seamless to UBU Design.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Project Team
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">SEO Strategist - Yuva</h3>
                        <p className="text-gray-600 text-sm">
                          Project lead for keyword strategy, technical SEO, and
                          overall delivery
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-brand-coral rounded-full flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Developer - Vishnu</h3>
                        <p className="text-gray-600 text-sm">
                          Managed all technical implementation and web
                          optimizations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-8 bg-brand-purple rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">
                          Client/Agency Lead - Gemma
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Point of contact, managed end-client communication,
                          agency brand standards
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Tools & Lessons */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                {/* Tools & Technology */}
                <Card className="p-8 h-full flex flex-col gap-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tools & Technology
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Analytics & Monitoring */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-brand-purple">
                        Analytics & Monitoring
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple shrink-0" />
                          <span>Google Analytics 4</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple shrink-0" />
                          <span>Google Search Console</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-purple shrink-0" />
                          <span>Looker Studio</span>
                        </li>
                      </ul>
                    </div>

                    {/* SEO Tools */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-brand-coral">
                        SEO Tools
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                          <span>Screaming Frog</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                          <span>SurferSEO</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                          <span>Google Business Profile</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Key Lessons Learned */}
                <Card className="p-8 h-full flex flex-col justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Key Lessons Learned
                  </h2>

                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-1 shrink-0" />
                      <p className="text-gray-700 leading-relaxed">
                        Start technical fixes ASAP; allocate more time for unexpected
                        web platform issues.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-1 shrink-0" />
                      <p className="text-gray-700 leading-relaxed">
                        Agile reporting is vital in white-label projects — ready-to-send,
                        branded dashboards prevent bottlenecks.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-1 shrink-0" />
                      <p className="text-gray-700 leading-relaxed">
                        Proactive partner support strengthens relationships while boosting
                        overall SEO impact and client retention.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>


        {/* Client Testimonial */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Agency Partner Feedback
              </h2>

              <Card className="p-8 bg-white shadow-lg">
                <div className="flex justify-center mb-6">
                  <Quote className="w-12 h-12 text-brand-purple" />
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "The team anticipated everything I needed to keep UBU
                  happy—reports were on time, delivered in our style, and the
                  SEO results speak for themselves."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Gemma</p>
                    <p className="text-gray-600">
                      Agency Partner & Project Lead
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Architecture Firm's Online Presence?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join UBU Design and 500+ other businesses that trust BrandingBeez
              for their SEO success. Get similar results for your B2B
              architecture practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() =>
                  window.open(
                    "https://calendly.com/vignesh-velusamy/30min",
                    "_blank",
                  )
                }
                className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
              >
                Book Your Free SEO Consultation
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple"
                asChild
              >
                <Link href="/case-studies">View More Case Studies</Link>
              </Button> */}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
