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
} from "lucide-react";
// Using direct paths to screenshots for SEO results demonstration
// import atlanticFoundationImage from "@assets/atlantic-foundation-seo-portfolio_1754120022956.png";
import placeholderImage from "@assets/Screenshot 2025-07-30 191221_1754117459762.png";
import { Link } from "wouter";

export default function SEOCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-24 py-16 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">
                  Featured SEO Success Story
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Atlantic Foundation & Crawl Space Repair
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">How we increased organic users by 49% and secured #1 rankings for 122 foundation repair keywords in 6 months</p>
                <div className="flex flex-wrap gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>+49% User traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span>#1  Ranking for 122 High ranking keywords</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    <span>1,409 Keywords Ranking</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:scale-105 transition-transform duration-300">
                  <img
                    src={placeholderImage}
                    alt="Atlantic Foundation Google Search Console Performance Dashboard showing 1.82K total clicks, 1.33M total impressions, and performance graphs"
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

        

        {/* Section 1: Highlights (Infographic Style) */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Case Study Highlights
                </h2>
                <p className="text-gray-600 text-lg">
                  Key metrics and achievements from this transformation
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <Card className="text-center p-6 border-2 border-brand-coral/20 bg-brand-coral/5">
                  <div className="w-14 h-14 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-coral mb-1">+50%</h3>
                  <p className="text-gray-700 font-medium text-sm">
                    Traffic Growth
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Organic traffic increase
                  </p>
                </Card>

                <Card className="text-center p-6 border-2 border-brand-purple/20 bg-brand-purple/5">
                  <div className="w-14 h-14 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-purple mb-1">122%</h3>
                  <p className="text-gray-700 font-medium text-sm">Form submissions</p>
                  <p className="text-xs text-gray-600 mt-1">30 Average form submissions every month</p>
                </Card>

                <Card className="text-center p-6 border-2 border-brand-coral/20 bg-brand-coral/5">
                  <div className="w-14 h-14 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-coral mb-1">1409</h3>
                  <p className="text-gray-700 font-medium text-sm">
                    Keywords Ranking
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Top 10 positions
                  </p>
                </Card>

                <Card className="text-center p-6 border-2 border-brand-purple/20 bg-brand-purple/5">
                  <div className="w-14 h-14 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-purple mb-1">176%</h3>
                  <p className="text-gray-700 font-medium text-sm">Impression growth</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Search console data
                  </p>
                </Card>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-coral rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-coral">1 Year</h4>
                  <p className="text-gray-600">Campaign Duration</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-purple rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-purple">15</h4>
                  <p className="text-gray-600">Position Improvements</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-coral rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-coral">North Carolina</h4>
                  <p className="text-gray-600">Local SEO Focus</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-purple rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-purple">White-label</h4>
                  <p className="text-gray-600">Service Model</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Client History */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About Atlantic Foundation & Crawl Space Repair</h2>
                <p className="text-gray-600 text-lg">
                  Understanding our client's business and local SEO
                  transformation needs for commercial cleaning services
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-purple rounded-lg flex items-center justify-center">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Atlantic Cleaning
                      </h3>
                      <h4 className="text-gray-600">
                        Commercial Cleaning Services
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        Commercial cleaning company
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        4-month SEO campaign
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        Office & facility cleaning
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        London & Greater London
                      </span>
                    </div>
                  </div>
                </div>

                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-4 text-gray-900">
                    Business & Background
                  </h4>
                  <p className="text-gray-700 mb-4">Atlantic Foundation & Crawl Space Repair (atlantic-foundation.com) is a specialized contractor providing foundation stabilization, crawl space encapsulation, basement waterproofing, and structural repair services for homeowners across North Carolina. Based in Wendell, NC, they offer solutions like "The Stabilizor" system, moisture management, drainage fixes, and chimney stabilization—prioritizing fiberglass-free encapsulation and free homeowner evaluations</p>
                  <p className="text-gray-700 mb-4">Despite their technical expertise, Atlantic Foundation struggled with digital visibility. Key challenges included weak rankings for critical repair terms (e.g., "crawl space encapsulation," "foundation crack repair"), minimal localized content for NC homeowners, underdeveloped directory presence, and ineffective outreach to realtors/property managers.</p>
                  <p className="text-gray-700">Their primary audience is homeowners facing structural issues (foundation cracks, moisture damage, unstable chimneys). Secondary audiences include realtors (requiring paid evaluations) and property managers. The SEO campaign targeted foundation/crawl space repair keywords, NC-specific service areas, and homeowner/realtor-centric content.</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Problem Identification */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Challenges Identified
                </h2>
                <p className="text-gray-600 text-lg">
                  Critical issues preventing organic growth and local visibility
                  for Atlantic Cleaning
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:grid-rows-2">
                <Card className="p-6 border-l-4 border-brand-coral flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-brand-coral">
                    Technical SEO Issues
                  </h3>
                  <ul className="space-y-2 text-gray-700 flex-grow">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>Missing service-specific schema markup (foundation repair/crawl space encapsulation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>Critical mobile performance issues (LCP 4.2s, CLS 0.45 on key pages)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>Thin content on service pages (&lt;250 words on 60% of pages)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>Broken internal links between repair service pillars</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6 border-l-4 border-brand-purple flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-brand-purple">
                    Local Search Visibility Issues
                  </h3>
                  <ul className="space-y-2 text-gray-700 flex-grow">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>Only 12 local directory citations (industry avg: 45+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>Zero review acquisition system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>Service area pages not optimized for city searches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>No localized content clusters for NC regions</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6 border-l-4 border-brand-coral flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-brand-coral">
                    Content Strategy Gaps
                  </h3>
                  <ul className="space-y-2 text-gray-700 flex-grow">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>Zero content addressing homeowner concerns ("signs of foundation failure," "encapsulation costs")</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>No resources for realtors/property managers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>Service pages missing NC-specific terminology (e.g., "Raleigh foundation specialists")</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                      <span>Blog covered only 15% of top informational keywords</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6 border-l-4 border-brand-purple flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-brand-purple">
                    Partnership Challenges
                  </h3>
                  <ul className="space-y-2 text-gray-700 flex-grow">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>Required phased technical fixes to maintain site stability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>Needed rapid content production for 20+ service/location combinations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>Urgent citation cleanup for inaccurate business listings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                      <span>Required specialized reporting for home services KPI's</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Keyword Ranking Improvements */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Keyword Performance
              </h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Ranking Improvements Achieved
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Strategic keyword targeting delivered significant position
                improvements across high-value commercial cleaning search terms.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-brand-coral to-brand-purple text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">
                        Keyword
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Before
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        After
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Improvement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="ray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">crawl space storage</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">0</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          1
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-semibold">
                          +1 position
                        </span>
                      </td>
                    </tr>
                    <tr className="ray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        crawl space air conditioner
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          3
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-semibold">
                          +3 positions
                        </span>
                      </td>
                    </tr>
                    <tr className="ray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        foundation repair raleigh nc
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          2
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-semibold">
                          +3 positions
                        </span>
                      </td>
                    </tr>
                    <tr className="ray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        crawl space repair raleigh nc
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          3
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-semibold">
                          +3 positions
                        </span>
                      </td>
                    </tr>
                    <tr className="ray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        crawl space encapsulation raleigh nc
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          25
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          4
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-semibold">
                          +21 positions
                        </span>
                      </td>
                    </tr>
                    <tr className="ray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        raleigh crawl space repair
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          10
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          2
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-semibold">
                          +8 positions
                        </span>
                      </td>
                    </tr>
                    <tr className="ray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        crawl space drainage system
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          3
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-semibold">
                          +3 positions
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Solutions & Results */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Solutions & Results
                </h2>
                <p className="text-gray-600 text-lg">
                  Strategic approach and measurable outcomes
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
                        <div className="w-12 h-12 bg-brand-coral rounded-xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">
                            Technical SEO Overhaul
                          </h4>
                          <p className="text-gray-600">Executed comprehensive technical remediation including mobile performance optimization (LCP reduced from 4.2s to 1.8s), implementation of service-specific schema markup, 100% broken link resolution, and creation of location pages for 12 NC cities.</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-purple rounded-xl flex items-center justify-center flex-shrink-0">
                          <Target className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">
                            Content Strategy & Creation
                          </h4>
                          <p className="text-gray-600">Developed hyper-localized content targeting Raleigh homeowner pain points, including 25+ solution guides ("Foundation Crack Repair Costs," "Crawl Space Moisture Signs"), realtor-specific resources, and geo-optimized service pages with terms like "Raleigh foundation specialists."</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-purple rounded-xl flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">Local Authority Building</h4>
                          <p className="text-gray-600">
                            Deployed targeted citation campaign securing 35+ local directory listings, implemented automated review generation system, and acquired high-value backlinks through competitor gap analysis.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-coral rounded-xl flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">
                            Analytics & Optimization
                          </h4>
                          <p className="text-gray-600">Established continuous monitoring framework using GA4/Search Console data for rapid iteration, focusing on conversion path enhancement and keyword performance tracking.</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Measurable Results
                  </h3>

                  <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                    <h4 className="font-bold text-lg mb-4 text-green-700">
                      Q2 2025 Performance Summary
                    </h4>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">User Growth</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-coral">
                            +49.16%
                          </span>
                          <p className="text-sm text-gray-500">
                            5,476 → 8,168 users
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Session Growth</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-purple">
                            +9%
                          </span>
                          <p className="text-sm text-gray-500">
                            1,670 → 1,820 sessions
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Returning Users</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-purple">
                            2,453
                          </span>
                          <p className="text-sm text-gray-500">
                            Strong retention
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Avg. Engagement Time
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-brand-coral">
                            2m 18s
                          </span>
                          <p className="text-sm text-gray-500">
                            Per session
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Keyword Improvements
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-brand-purple">
                            122 top #1
                          </span>
                          <p className="text-sm text-gray-500">
                            Positions achieved
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Partnership Type</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-coral">
                            White Label
                          </span>
                          <p className="text-sm text-gray-500">
                            Partnership
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
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tools & Methodologies
                </h2>
                <p className="text-gray-600 text-lg">
                  Professional tools and proven strategies used in this project
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-8 h-8 text-purple-600" />
                    <h3 className="font-bold text-lg">SEO Analysis Tools</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• SEMrush/Ahrefs for keyword tracking & backlinks</li>
                    <li>• Google Search Console for performance monitoring</li>
                    <li>• GA4 for traffic analysis and conversion tracking</li>
                    <li>• Custom SEO tracker for ranking monitoring</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-8 h-8 text-brand-purple" />
                    <h3 className="font-bold text-lg">Analytics & Tracking</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Google Analytics 4 for traffic analysis</li>
                    <li>• Google Tag Manager for event tracking</li>
                    <li>• Hotjar for user behavior analysis</li>
                    <li>• Custom dashboard for ROI tracking</li>
                    <li>• Weekly performance reports</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-8 h-8 text-brand-coral" />
                    <h3 className="font-bold text-lg">
                      Content & Optimization
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Surfer SEO for content optimization</li>
                    <li>• Clearscope for content briefs</li>
                    <li>• Grammarly for content quality</li>
                    <li>• Canva for visual content creation</li>
                    <li>• WordPress with Yoast SEO</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Testimonials & Screenshots */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Client Testimonial & Results
                </h2>
                <p className="text-gray-600 text-lg">
                  Real feedback and visual proof of our success
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Card className="p-8 relative">
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-6">
                      <Quote className="w-8 h-8 text-brand-coral/40 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">The BrandingBeez team delivered transformative results for Atlantic Foundation through direct, hands-on SEO partnership. Their technical expertise and hyper-localized strategy achieved 49.16% organic user growth and 121.88% more contact submissions in just 6 months. The leap from 3 to 122 top #1 keyword rankings—especially for critical terms like 'foundation repair Raleigh NC'—fundamentally changed our lead generation pipeline.</p>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">What set them apart was the surgical approach to technical fixes and transparent communication. Yuva's strategic oversight combined with Gopal's rapid execution created a risk-managed rollout that eliminated downtime while boosting visibility. Their custom SEO trackers and visual progress reports made complex results instantly understandable for our team.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-purple rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">CW</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Carolina Web consultants</p>
                        <p className="text-gray-600">White-Label Partner Agency, US</p>
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
                    <h3 className="font-bold text-lg mb-4">
                      Q2 2025 Performance Highlights
                    </h3>
                    <div className="bg-gradient-to-r from-brand-coral/10 to-brand-coral/20 h-40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-brand-coral mx-auto mb-2" />
                        <p className="text-brand-coral font-bold">
                          +49.16% Organic Users
                        </p>
                        <p className="text-gray-600 text-sm">
                          5,476 → 8,168
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Contact Submissions</h3>
                    <div className="bg-gradient-to-r from-brand-purple/10 to-brand-purple/20 h-40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Target className="w-12 h-12 text-brand-purple mx-auto mb-2" />
                        <p className="text-brand-purple font-bold">
                          +121.88% Contact Forms
                        </p>
                        <p className="text-gray-600 text-sm">
                          Submission increase
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Keyword Success</h3>
                    <div className="bg-gradient-to-r from-green-100/50 to-green-200/50 h-40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Target className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-green-600 font-bold">
                          122 Top #1 Positions
                        </p>
                        <p className="text-gray-600 text-sm">
                          Keywords achieved
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Card className="p-8 bg-gradient-to-r from-brand-coral to-pink-500 text-white">
                  <h2 className="text-2xl font-bold mb-4">
                    Ready for Similar White-Label Success?
                  </h2>
                  <p className="text-lg mb-6 text-white/90">
                    Partner with us to deliver exceptional SEO results to your
                    clients through our proven white-label methodology.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <Button
                        size="lg"
                        className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral"
                      >
                        Start Your SEO Campaign
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-brand-coral"
                      onClick={() =>
                        window.open(
                          "https://calendly.com/vignesh-velusamy/30min",
                          "_blank",
                        )
                      }
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Strategy Call
                    </Button>
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
