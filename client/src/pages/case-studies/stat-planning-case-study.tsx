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
} from "lucide-react";
import { Link } from "wouter";
import statPlanningPerformanceImage from "@assets/stat-planning-seo-portfolio_1754119546976.png";

export default function StatPlanningCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">
                  B2B Local SEO Success Story
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  STAT Planning
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  How we achieved 453% click increase and transformed local
                  search visibility for a town planning consultancy in just one
                  month
                </p>
                <div className="flex flex-wrap gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>453% Click Increase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span>720% More Impressions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    <span>5 Top Rankings</span>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200/50 shadow-2xl bg-gradient-to-br from-white to-gray-50 p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white shadow-lg">
                    <img 
                      src={statPlanningPerformanceImage} 
                      alt="STAT Planning Google Search Console Performance - 218 clicks, 4.41K impressions"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                    <p className="text-sm font-semibold text-gray-800">Google Search Console</p>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-brand-coral/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                    <p className="text-sm font-bold text-white">218 Clicks • 4.41K Impressions</p>
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
                  Understanding the business and market context
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-8 h-8 text-brand-coral" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Company Profile
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Boutique planning consultancy</li>
                    <li>• Less than 10 employees</li>
                    <li>• B2B business model</li>
                    <li>• Serves Nottinghamshire & East Midlands</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-brand-purple" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Target Audience
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Private individuals</li>
                    <li>• Professional firms</li>
                    <li>• Corporate clients</li>
                    <li>• Public sector entities</li>
                    <li>• Energy & infrastructure</li>
                    <li>• Community organisations</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-brand-coral" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Project Details
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Project start: May 2025</li>
                    <li>• Ongoing website retainer</li>
                    <li>• Partnership through Gemma (Web Partner)</li>
                    <li>• SEO added in Month 1</li>
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
                  Dramatic Results in 30 Days
                </h2>
                <p className="text-gray-600 text-lg">
                  Comparing baseline May metrics to June results
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="p-8 border-2 border-red-200">
                  <div className="text-center mb-6">
                    <h3 className="bg-red-100 text-red-800 mb-4 inline-block px-2 py-1 rounded text-sm font-medium">
                      Before (May 2025)
                    </h3>
                    <h4 className="text-2xl font-bold text-gray-900">
                      Baseline Performance
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">Organic Clicks</span>
                      <span className="font-bold text-red-600">17</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">Impressions</span>
                      <span className="font-bold text-red-600">229</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">CTR</span>
                      <span className="font-bold text-red-600">7.4%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">Average Position</span>
                      <span className="font-bold text-red-600">53</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-600">Keywords Indexed</span>
                      <span className="font-bold text-red-600">4</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-2 border-green-200">
                  <div className="text-center mb-6">
                    <h3 className="bg-green-100 text-green-800 mb-4 inline-block px-2 py-1 rounded text-sm font-medium">
                      After (June 2025)
                    </h3>
                    <h4 className="text-2xl font-bold text-gray-900">
                      Transformed Performance
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Organic Clicks</span>
                      <span className="font-bold text-green-600">
                        94 (+453%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Impressions</span>
                      <span className="font-bold text-green-600">
                        1,880 (+720%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">CTR</span>
                      <span className="font-bold text-green-600">5.0%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Average Position</span>
                      <span className="font-bold text-green-600">
                        35.7 (Improved)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-gray-600">Top Rankings</span>
                      <span className="font-bold text-green-600">
                        5 Major Improvements
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Keyword Ranking Results */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Keyword Ranking Improvements
                </h2>
                <p className="text-gray-600 text-lg">
                  Significant position improvements for high-value local search
                  terms
                </p>
              </div>

              <Card className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-4 font-bold text-gray-900">
                          Keyword
                        </th>
                        <th className="text-center py-4 px-4 font-bold text-gray-900">
                          Before
                        </th>
                        <th className="text-center py-4 px-4 font-bold text-gray-900">
                          After
                        </th>
                        <th className="text-center py-4 px-4 font-bold text-gray-900">
                          Improvement
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-4 px-4 font-medium">
                          land development consultants nottingham
                        </td>
                        <td className="py-4 px-4 text-center text-red-600 font-bold">
                          91
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          60
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          +31 positions
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-4 px-4 font-medium">
                          detailed planning
                        </td>
                        <td className="py-4 px-4 text-center text-red-600 font-bold">
                          54
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          15
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          +39 positions
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-4 px-4 font-medium">stat's</td>
                        <td className="py-4 px-4 text-center text-red-600 font-bold">
                          87
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          10
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          +77 positions
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-4 px-4 font-medium">
                          town planning consultants nottingham
                        </td>
                        <td className="py-4 px-4 text-center text-red-600 font-bold">
                          63
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          25
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          +38 positions
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-medium">
                          local planning consultants nottingham
                        </td>
                        <td className="py-4 px-4 text-center text-red-600 font-bold">
                          53
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          12
                        </td>
                        <td className="py-4 px-4 text-center text-green-600 font-bold">
                          +41 positions
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                  Comprehensive approach targeting local B2B search visibility
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
                        <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center">
                          <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Keyword Research & Targeting
                          </h4>
                          <p className="text-gray-600">
                            Focused on high-intent, geo-targeted terms like
                            "land development consultants Nottingham" and "local
                            planning consultants Nottingham".
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Technical SEO Overhaul
                          </h4>
                          <p className="text-gray-600">
                            Refreshed XML sitemap, cleaned robots.txt, added
                            OpenGraph tags, fixed crawl errors, and improved
                            mobile site speed to 70/90 scores.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Content Strategy & Optimization
                          </h4>
                          <p className="text-gray-600">
                            Updated meta titles & descriptions for 15 key pages,
                            improved H1/H2 structure, and added keyword-rich
                            content aligned to user intent.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Local SEO Implementation
                          </h4>
                          <p className="text-gray-600">
                            Set up Google Business Profile, embedded
                            geo-keywords, implemented schema markup including
                            LocalBusiness and team Person schemas.
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
                    <Card className="p-6 border-l-4 border-brand-coral">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-brand-coral" />
                        <h4 className="font-bold text-brand-coral">
                          May 1-10, 2025
                        </h4>
                      </div>
                      <h5 className="font-bold text-lg mb-2">
                        Technical & Content Audit
                      </h5>
                      <p className="text-gray-600">
                        Comprehensive audit of existing technical SEO issues and
                        content structure completed.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-brand-purple">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-brand-purple" />
                        <h4 className="font-bold text-brand-purple">
                          May 15-31, 2025
                        </h4>
                      </div>
                      <h5 className="font-bold text-lg mb-2">
                        Keyword Mapping & Implementation
                      </h5>
                      <p className="text-gray-600">
                        Strategic keyword research and mapping completed with
                        initial implementation phase.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-brand-coral">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-brand-coral" />
                        <h4 className="font-bold text-brand-coral">
                          June 1-15, 2025
                        </h4>
                      </div>
                      <h5 className="font-bold text-lg mb-2">
                        On-Page Updates & Technical Fixes
                      </h5>
                      <p className="text-gray-600">
                        All on-page optimizations implemented, sitemap and
                        robots.txt updates submitted to Search Console.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-brand-purple">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-brand-purple" />
                        <h4 className="font-bold text-brand-purple">
                          June 30, 2025
                        </h4>
                      </div>
                      <h5 className="font-bold text-lg mb-2">
                        Results Analysis
                      </h5>
                      <p className="text-gray-600">
                        Comprehensive reporting completed showing 453% increase
                        in clicks and significant ranking improvements.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools & Team */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Tools & Technology Stack
                  </h2>
                  <Card className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-lg mb-3">
                          Analytics & Monitoring
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Google Search Console</li>
                          <li>• Google Analytics 4</li>
                          <li>• PageSpeed Insights</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-3">SEO Tools</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Semrush</li>
                          <li>• Ahrefs</li>
                          <li>• Moz Pro</li>
                          <li>• Screaming Frog</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Project Team
                  </h2>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-coral rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">SEO Lead - BrandingBeez</h3>
                          <p className="text-gray-600 text-sm">
                            Strategy & implementation oversight
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">Client Liaison - Gemma</h3>
                          <p className="text-gray-600 text-sm">
                            Web Partner & Project Owner
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="font-bold text-blue-800 mb-2">
                          Communication Flow
                        </h2>
                        <p className="text-blue-700 text-sm">
                          Weekly updates via Slack + Monthly summary reports
                          with collaborative decision-making process
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Learnings */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Key Learnings & Success Factors
                </h2>
                <p className="text-gray-600 text-lg">
                  Insights gained from this successful B2B local SEO
                  transformation
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="p-8 border-2 border-green-200">
                  <div className="text-center mb-6">
                    <h3 className="bg-green-100 text-green-800 mb-4 inline-block px-2 py-1 rounded text-sm font-medium">
                      Unexpected Wins
                    </h3>
                    <h4 className="text-2xl font-bold text-gray-900">
                      What Exceeded Expectations
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-1" />
                      <p className="text-gray-700">
                        Schema markup improved visibility faster than expected,
                        with immediate ranking improvements
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-1" />
                      <p className="text-gray-700">
                        Local keywords surged with just on-page fixes, even
                        before backlink building commenced
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-1" />
                      <p className="text-gray-700">
                        B2B local search responded exceptionally well to
                        geo-targeted content optimization
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-2 border-blue-200">
                  <div className="text-center mb-6">
                    <h3 className="bg-blue-100 text-blue-800 mb-4 inline-block px-2 py-1 rounded text-sm font-medium">
                      Future Optimizations
                    </h3>
                    <h4 className="text-2xl font-bold text-gray-900">
                      Areas for Enhancement
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-brand-purple mt-1" />
                      <p className="text-gray-700">
                        Start link-building activities sooner to accelerate
                        domain authority growth
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-brand-purple mt-1" />
                      <p className="text-gray-700">
                        Implement conversion tracking earlier to measure
                        business impact beyond rankings
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-brand-purple mt-1" />
                      <p className="text-gray-700">
                        Use live keyword dashboard from Day 1 for real-time
                        performance monitoring
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Local Search Results?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join STAT Planning and 500+ other businesses that trust
              BrandingBeez for their SEO success. Get similar results for your
              B2B consultancy.
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
                className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral"
              >
                Book Your Free SEO Consultation
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-brand-coral transition-colors duration-200"
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
