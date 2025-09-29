import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  DollarSign,
  MousePointer,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  Users,
  Calendar,
  Globe,
  Zap,
  Settings,
  BarChart3,
  Eye,
  Clock,
} from "lucide-react";
import { Link } from "wouter";

export default function GoogleAdsCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main className="pt-0 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">
                Google Ads Success Story
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                TechStart Solutions
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                How we increased ROAS by 425% and reduced cost per lead by 68%
                in 6 months
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>425% ROAS Increase</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>68% Lower Cost Per Lead</span>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  <span>340% More Conversions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Screenshot Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Google Ads Performance Dashboard
              </h2>
              <p className="text-gray-600 text-lg">
                Real campaign data showing 425% ROAS increase and 68% lower cost per lead
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="aspect-video bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden p-4">
                  <div className="w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-purple-700 mb-2">
                        Analytics Screenshot Placeholder
                      </h3>
                      <p className="text-purple-600 mb-2">
                        Replace this section with Google Ads dashboard screenshot
                      </p>
                      <p className="text-sm text-purple-500">
                        Showing campaign performance: 425% ROAS improvement
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">TechStart Solutions</p>
                    <p className="text-white/90 text-xs">SaaS Technology Platform</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300 text-xs font-medium">6-Month Campaign Data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Highlights */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Campaign Highlights
                </h2>
                <p className="text-gray-600 text-lg">
                  Outstanding performance metrics achieved through strategic
                  optimization
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center p-8 border-2 border-green-200 bg-green-50">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-600 mb-2">
                    425%
                  </h3>
                  <p className="text-gray-700 font-medium">ROAS Improvement</p>
                  <p className="text-sm text-gray-600 mt-2">
                    From 2.1x to 11.0x return on ad spend
                  </p>
                </Card>

                <Card className="text-center p-8 border-2 border-blue-200 bg-blue-50">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">68%</h3>
                  <p className="text-gray-700 font-medium">
                    Lower Cost Per Lead
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    From $85 to $27 per qualified lead
                  </p>
                </Card>

                <Card className="text-center p-8 border-2 border-purple-200 bg-purple-50">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MousePointer className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-purple-600 mb-2">
                    340%
                  </h3>
                  <p className="text-gray-700 font-medium">More Conversions</p>
                  <p className="text-sm text-gray-600 mt-2">
                    From 120 to 528 monthly conversions
                  </p>
                </Card>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-orange-600">
                    6 months
                  </h4>
                  <p className="text-gray-600">Optimization Period</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-red-600">8.7%</h4>
                  <p className="text-gray-600">Click-Through Rate</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-teal-600">$1.2M</h4>
                  <p className="text-gray-600">Additional Revenue</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-indigo-600">12.4%</h4>
                  <p className="text-gray-600">Conversion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Client History */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  About TechStart Solutions
                </h2>
                <p className="text-gray-600 text-lg">
                  Understanding our client's business model and growth
                  challenges
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        TechStart Solutions
                      </h3>
                      <p className="text-gray-600">B2B Software & Consulting</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">75-150 employees</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Founded in 2019</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        Business automation software
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        Serving SMBs across North America
                      </span>
                    </div>
                  </div>
                </div>

                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-4 text-gray-900">
                    Company Background
                  </h4>
                  <p className="text-gray-700 mb-4">
                    TechStart Solutions is a growing B2B software company that
                    provides business automation and workflow optimization tools
                    for small and medium-sized businesses. Founded in 2019, they
                    had achieved initial success through word-of-mouth and
                    limited marketing efforts.
                  </p>
                  <p className="text-gray-700 mb-4">
                    However, they were struggling with inefficient Google Ads
                    campaigns that were draining their marketing budget with
                    poor results. Their previous agency was delivering a low
                    ROAS and extremely high cost-per-lead, making it difficult
                    to scale their customer acquisition.
                  </p>
                  <p className="text-gray-700">
                    They needed a complete Google Ads overhaul to drive
                    qualified leads cost-effectively and accelerate their growth
                    in the competitive business software market.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Problem Identification */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Campaign Challenges
                </h2>
                <p className="text-gray-600 text-lg">
                  Critical issues preventing profitable Google Ads performance
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="p-6 border-l-4 border-red-500">
                    <h3 className="font-bold text-lg mb-3 text-red-700">
                      Campaign Structure Issues
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Broad, unfocused keyword targeting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Poor campaign organization and grouping</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Lack of negative keyword strategy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Inconsistent bidding strategies</span>
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-6 border-l-4 border-orange-500">
                    <h3 className="font-bold text-lg mb-3 text-orange-700">
                      Ad Creative Problems
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>Generic, non-compelling ad copy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>Poor relevance between ads and keywords</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>Limited ad extensions usage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>No A/B testing of ad variations</span>
                      </li>
                    </ul>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 border-l-4 border-yellow-500">
                    <h3 className="font-bold text-lg mb-3 text-yellow-700">
                      Conversion & Tracking Issues
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>Poor landing page optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>Incomplete conversion tracking setup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>No audience segmentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>Limited remarketing campaigns</span>
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-6 border-l-4 border-purple-500">
                    <h3 className="font-bold text-lg mb-3 text-purple-700">
                      Performance Impact
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>High cost per lead ($85)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>Low ROAS (2.1x)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>Wasted ad spend on unqualified clicks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>Limited scalability due to poor efficiency</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Solutions & Results */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Strategic Solutions & Outcomes
                </h2>
                <p className="text-gray-600 text-lg">
                  Comprehensive campaign optimization and exceptional results
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Strategic Optimizations
                  </h3>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Campaign Restructuring
                          </h4>
                          <p className="text-gray-600">
                            Complete rebuild with focused ad groups, precise
                            keyword targeting, and strategic negative keywords.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <MousePointer className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Ad Creative Optimization
                          </h4>
                          <p className="text-gray-600">
                            High-converting ad copy with compelling CTAs,
                            relevant extensions, and continuous A/B testing.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Smart Bidding Implementation
                          </h4>
                          <p className="text-gray-600">
                            Advanced automated bidding strategies optimized for
                            conversion value and target ROAS.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Advanced Tracking & Analytics
                          </h4>
                          <p className="text-gray-600">
                            Comprehensive conversion tracking, audience
                            insights, and performance monitoring systems.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Performance Results
                  </h3>

                  <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                    <h4 className="font-bold text-lg mb-4 text-green-700">
                      6-Month Campaign Results
                    </h4>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Return on Ad Spend
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-green-600">
                            +425%
                          </span>
                          <p className="text-sm text-gray-500">
                            2.1x → 11.0x ROAS
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Cost Per Lead</span>
                        <div className="text-right">
                          <span className="font-bold text-blue-600">-68%</span>
                          <p className="text-sm text-gray-500">
                            $85 → $27 per lead
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Monthly Conversions
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-purple-600">
                            +340%
                          </span>
                          <p className="text-sm text-gray-500">
                            120 → 528 conversions
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Click-Through Rate
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-orange-600">
                            8.7%
                          </span>
                          <p className="text-sm text-gray-500">From 2.1% CTR</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Additional Revenue
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-red-600">$1.2M</span>
                          <p className="text-sm text-gray-500">
                            Attributed to campaigns
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Conversion Rate</span>
                        <div className="text-right">
                          <span className="font-bold text-teal-600">12.4%</span>
                          <p className="text-sm text-gray-500">
                            From 3.2% conversion rate
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Tools & Methods */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tools & Strategies
                </h2>
                <p className="text-gray-600 text-lg">
                  Professional tools and proven methodologies used for campaign
                  success
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                    <h3 className="font-bold text-lg">Google Ads Platform</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Search, Display, and YouTube campaigns</li>
                    <li>• Smart Bidding and automated strategies</li>
                    <li>• Advanced audience targeting</li>
                    <li>• Google Analytics 4 integration</li>
                    <li>• Conversion tracking and attribution</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <h3 className="font-bold text-lg">
                      Analytics & Optimization
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Google Tag Manager for tracking</li>
                    <li>• Data Studio for reporting</li>
                    <li>• Google Optimize for landing pages</li>
                    <li>• Keyword Planner for research</li>
                    <li>• SEMrush for competitive analysis</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-8 h-8 text-purple-600" />
                    <h3 className="font-bold text-lg">
                      Automation & Management
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Google Ads Scripts for automation</li>
                    <li>• Optmyzr for campaign optimization</li>
                    <li>• WordStream for performance insights</li>
                    <li>• Custom dashboard for monitoring</li>
                    <li>• Weekly performance reports</li>
                  </ul>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50">
                  <h3 className="font-bold text-xl mb-4 text-center">
                    Our Google Ads Optimization Process
                  </h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h4 className="font-bold mb-2">Account Audit</h4>
                      <p className="text-sm text-gray-600">
                        Comprehensive analysis of current performance and
                        opportunities
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h4 className="font-bold mb-2">Strategy Development</h4>
                      <p className="text-sm text-gray-600">
                        Custom campaign structure and targeting strategy
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h4 className="font-bold mb-2">Implementation</h4>
                      <p className="text-sm text-gray-600">
                        Campaign setup, ad creation, and tracking implementation
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <h4 className="font-bold mb-2">Optimize & Scale</h4>
                      <p className="text-sm text-gray-600">
                        Continuous testing and performance-driven optimization
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Testimonial & Results */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Client Success Story
                </h2>
                <p className="text-gray-600 text-lg">
                  Real feedback and visual proof of campaign performance
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Card className="p-8 relative">
                  <Quote className="w-12 h-12 text-green-200 absolute top-4 left-4" />
                  <div className="relative z-10">
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      "The transformation of our Google Ads performance has been
                      absolutely incredible. We went from struggling with high
                      costs and poor returns to having our most profitable
                      marketing channel. The ROAS improvement of 425% speaks for
                      itself."
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      "BrandingBeez didn't just optimize our campaigns – they
                      completely revolutionized our approach to digital
                      advertising. The level of detail, strategy, and ongoing
                      optimization has exceeded all our expectations. We're now
                      able to scale confidently."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">DT</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          David Thompson
                        </p>
                        <p className="text-gray-600">
                          Marketing Director, TechStart Solutions
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h4 className="font-bold text-lg mb-4">ROAS Performance</h4>
                    <div className="bg-gradient-to-r from-green-100 to-green-200 h-40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-green-700 font-bold">11.0x ROAS</p>
                        <p className="text-green-600 text-sm">
                          425% improvement from baseline
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="font-bold text-lg mb-4">Cost Efficiency</h4>
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 h-40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Target className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-blue-700 font-bold">
                          $27 Cost Per Lead
                        </p>
                        <p className="text-blue-600 text-sm">
                          68% reduction in lead acquisition cost
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Card className="p-8 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Transform Your Google Ads?
                  </h3>
                  <p className="text-lg mb-6 text-white/90">
                    Join successful businesses that have revolutionized their
                    advertising ROI with our proven Google Ads strategies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <Button
                        size="lg"
                        className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                      >
                        Get Your Google Ads Audit
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/services/google-ads">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-brand-purple"
                      >
                        View Google Ads Services
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
