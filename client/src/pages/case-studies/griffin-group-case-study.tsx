import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import griffinAnalyticsImage from "@assets/Screenshot 2025-07-30 191221_1754121534935.png";
import { Link } from "wouter";
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
  Building,
  MapPin,
  Search,
  Calendar,
  Settings,
  Eye,
  Quote,
  Home,
  Award,
} from "lucide-react";

export default function GriffinGroupCaseStudy() {
  const { regionConfig } = useRegion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-20 py-16 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">
                  Featured SEO Success Story via Social Land Partnership
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Griffin Group Property Development
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  How we achieved 16.24% session growth and 7-position SERP
                  improvements for a UK property development firm in just 3
                  months through strategic local SEO
                </p>
                <div className="flex flex-wrap gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>+16.24% Sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>+12.02% Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span>7 Position Improvements</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
                  <img
                    src={griffinAnalyticsImage}
                    alt="Griffin Group Google Analytics showing user acquisition data with organic search, direct traffic, and referral channels over April-May 2025"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">Google Analytics Dashboard</p>
                    <p className="text-white/90 text-xs">Real Performance Data - April-May 2025</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300 text-xs font-medium">User Acquisition Growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Profile */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Client Profile
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Griffin Group is a mid-sized UK property development,
                investment, and construction firm serving both B2B and B2C
                markets across Essex and Southeast England.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-xl flex items-center justify-center">
                    <Building className="w-8 h-8 text-brand-coral" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Griffin Group
                    </h3>
                    <p className="text-gray-600">griffingroup.co.uk</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-brand-coral" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Industry
                      </div>
                      <div className="text-gray-600">
                        Property Development & Investment
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-brand-coral" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Location
                      </div>
                      <div className="text-gray-600">
                        Essex & Southeast England
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-purple/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-purple" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Partnership
                      </div>
                      <div className="text-gray-600">
                        Social Land (White-Label SEO)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-coral/5 to-brand-purple/5 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-brand-coral" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Target Audience
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-brand-coral" />
                    <span>Individual property buyers and sellers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-brand-coral" />
                    <span>Real estate investors and developers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-brand-coral" />
                    <span>Commercial property developers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-brand-coral" />
                    <span>Local councils and stakeholders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before & After Metrics */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-brand-coral text-white mb-4">
                Performance Transformation
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                3-Month SEO Results (Q2 2025)
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Strategic local SEO implementation delivered measurable
                improvements across all key metrics within just three months.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center  transition-shadow">
                <div className="w-14 h-14 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-brand-coral" />
                </div>
                <div className="text-2xl font-bold text-brand-coral mb-1">
                  +12.02%
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  User Growth
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  5,984 → 6,703 users
                </div>
              </Card>

              <Card className="p-6 text-center  transition-shadow">
                <div className="w-14 h-14 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-7 h-7 text-brand-coral" />
                </div>
                <div className="text-2xl font-bold text-brand-coral mb-1">
                  +16.24%
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  Session Growth
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  6,200 → 7,206 sessions
                </div>
              </Card>

              <Card className="p-6 text-center  transition-shadow">
                <div className="w-14 h-14 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-brand-coral" />
                </div>
                <div className="text-2xl font-bold text-brand-coral mb-1">
                  2,453
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  Returning Users
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Increased from Q1
                </div>
              </Card>

              <Card className="p-6 text-center  transition-shadow">
                <div className="w-14 h-14 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-7 h-7 text-brand-coral" />
                </div>
                <div className="text-2xl font-bold text-brand-coral mb-1">
                  2m 18s
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  Avg Engagement
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Per user improvement
                </div>
              </Card>
            </div>

            {/* Keyword Rankings Table */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Keyword Position Improvements
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Keyword
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Jan Position
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Jun Position
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium">
                        estate agents grays thurrock
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">
                        12
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        7
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        +5 positions
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium">
                        estate agents hornchurch
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">
                        29
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        22
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        +7 positions
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium">
                        house sale grays
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">
                        21
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        19
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        +2 positions
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">rosebery road</td>
                      <td className="py-4 px-4 text-center text-gray-500">
                        New
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        22
                      </td>
                      <td className="py-4 px-4 text-center text-brand-coral font-bold">
                        New ranking
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Strategy & Implementation */}
        <section className="py-16 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-brand-coral text-white mb-4">
                SEO Strategy
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Comprehensive Local SEO Implementation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our strategic approach focused on technical optimization, local
                search visibility, and targeted content development for the
                property development industry.
              </p>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8  transition-shadow">
                <div className="w-10 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Keyword Research & Targeting
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>High-intent local property and agent terms</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>"estate agents in Essex" optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>"homes for sale Grays" targeting</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Local development-specific queries</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8  transition-shadow">
                <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <Settings className="w-6 h-6 text-brand-purple" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Technical SEO Fixes
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Implemented proper schema markup</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Fixed duplicate metadata issues</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Enhanced internal linking structure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Mobile Core Web Vitals optimization</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8  transition-shadow">
                <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-brand-coral" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Content Strategy
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Refreshed property listings and area pages</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Development-specific landing pages</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Location-specific service guides</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Enhanced city/town content targeting</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8  transition-shadow">
                <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-brand-purple" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Local SEO Optimization
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Google Business Profile optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Local business directory submissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Map visibility and citation accuracy</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Local press and PR outreach</span>
                  </div>
                </div>
              </Card>
            </div> */}

            {/* <div className="grid md:grid-cols-2 gap-8 mb-12 items-center text-center">
              <Card className="p-8 transition-shadow flex flex-col items-center">
                <div className="flex items-center justify-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center shrink-0">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Keyword Research & Targeting
                  </h4>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>High-intent local property and agent terms</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>"estate agents in Essex" optimization</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>"homes for sale Grays" targeting</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Local development-specific queries</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow flex flex-col items-center text-center">
                <div className="flex items-center justify-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center shrink-0">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Technical SEO Fixes
                  </h4>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Implemented proper schema markup</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Fixed duplicate metadata issues</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Enhanced internal linking structure</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Mobile Core Web Vitals optimization</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow flex flex-col items-center text-center">
                <div className="flex items-center justify-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Content Strategy
                  </h4>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Refreshed property listings and area pages</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Development-specific landing pages</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Location-specific service guides</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Enhanced city/town content targeting</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow flex flex-col items-center text-center">
                <div className="flex items-center justify-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Local SEO Optimization
                  </h4>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Google Business Profile optimization</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Local business directory submissions</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Map visibility and citation accuracy</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Local press and PR outreach</span>
                  </div>
                </div>
              </Card>
            </div> */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center shrink-0">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 leading-tight">
                    Keyword Research & Targeting
                  </h4>
                </div>

                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>High-intent local property and agent terms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>"estate agents in Essex" optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>"homes for sale Grays" targeting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Local development-specific queries</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center shrink-0">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 leading-tight">
                    Technical SEO Fixes
                  </h4>
                </div>

                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Implemented proper schema markup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Fixed duplicate metadata issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Enhanced internal linking structure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Mobile Core Web Vitals optimization</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 leading-tight">
                    Content Strategy
                  </h4>
                </div>

                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Refreshed property listings and area pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Development-specific landing pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Location-specific service guides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Enhanced city/town content targeting</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 leading-tight">
                    Local SEO Optimization
                  </h4>
                </div>

                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Google Business Profile optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Local business directory submissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Map visibility and citation accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Local press and PR outreach</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Process & Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-brand-coral text-white mb-4">
                Project Timeline
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                3-Month Implementation Process
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Structured monthly phases with weekly check-ins delivered
                measurable improvements through disciplined technical work,
                transparent progress tracking, and agile pivot capabilities.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-brand-coral/20"></div>

              <div className="space-y-12">
                <div className="flex items-center gap-8">
                  <div className="flex-1 text-right">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        January 2025: Foundation
                      </h4>
                      <p className="text-gray-600">
                        Baseline audit, technical assessment, and initial
                        critical fixes implementation
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center z-10">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1"></div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex-1"></div>
                  <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center z-10">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Feb-Mar 2025: Optimization
                      </h4>
                      <p className="text-gray-600">
                        Content refresh, schema implementation, breadcrumbs, and
                        local content development
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex-1 text-right">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Apr-May 2025: Growth
                      </h4>
                      <p className="text-gray-600">
                        Link building campaigns, mobile performance
                        improvements, and rank monitoring
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center z-10">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1"></div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex-1"></div>
                  <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center z-10">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        June 2025: Results
                      </h4>
                      <p className="text-gray-600">
                        Local SEO consolidation, advanced engagement tracking,
                        and performance measurement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team & Partnership */}
        <section className="py-16 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-brand-coral text-white mb-4">
                Team & Partnership
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                White-Label Success Through Social Land
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                This SEO campaign originated as a retainer project assigned by
                Social Land, with their account team acting as the go-between
                for all communications and approvals. The partnership evolved
                rapidly from initial audit to a predictable monthly cadence of
                updates and KPI reviews.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-8 text-center  transition-shadow">
                <div className="w-16 h-16 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-brand-coral" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Yuva</h3>
                <h4 className="text-gray-600 mb-4">SEO Strategist</h4>
                <p className="text-sm text-gray-500">
                  Strategy development, technical audits, and project leadership
                </p>
              </Card>

              <Card className="p-8 text-center  transition-shadow">
                <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-brand-purple" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Vishnu</h3>
                <h4 className="text-gray-600 mb-4">Developer</h4>
                <p className="text-sm text-gray-500">
                  Technical implementation, schema markup, and site optimization
                </p>
              </Card>

              <Card className="p-8 text-center  transition-shadow">
                <div className="w-16 h-16 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-brand-coral" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Social Land
                </h3>
                <h4 className="text-gray-600 mb-4">Agency Partner</h4>
                <p className="text-sm text-gray-500">
                  Client relationship management, reporting, and delivery
                  coordination
                </p>
              </Card>
            </div>

            {/* The Human Element */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                What Made Collaboration Work
              </h3>

              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed max-w-6xl mx-auto">
                  Frequent, clear reporting enabled Social Land and Griffin Group to align on
                  priorities and pivot fast when analytics revealed new opportunities.
                  Success was driven by a mix of disciplined technical work, transparent
                  progress logs, and proactive content ideation tailored to local search intent.
                </p>

                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {/* Communication Structure */}
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-brand-purple mb-4">
                      Communication Structure
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center justify-start gap-3">
                        <CheckCircle className="w-4 h-4 text-brand-purple" />
                        <span>Weekly check-ins for priority alignment</span>
                      </div>
                      <div className="flex items-center justify-start gap-3">
                        <CheckCircle className="w-4 h-4 text-brand-purple" />
                        <span>Monthly executive summaries</span>
                      </div>
                      <div className="flex items-center justify-start gap-3">
                        <CheckCircle className="w-4 h-4 text-brand-purple" />
                        <span>Real-time reporting dashboards</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Success Factors */}
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-brand-coral mb-4">
                      Key Success Factors
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center justify-start gap-3">
                        <CheckCircle className="w-4 h-4 text-brand-coral" />
                        <span>Proactive documentation approach</span>
                      </div>
                      <div className="flex items-center justify-start gap-3">
                        <CheckCircle className="w-4 h-4 text-brand-coral" />
                        <span>Ready-to-send branded dashboards</span>
                      </div>
                      <div className="flex items-center justify-start gap-3">
                        <CheckCircle className="w-4 h-4 text-brand-coral" />
                        <span>Step-by-step change logs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Innovation & Tools */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-brand-purple text-white mb-4">
                Innovation & Tools
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Advanced SEO Implementation
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cutting-edge tools and innovative approaches delivered
                measurable results for Griffin Group's property development
                business.
              </p>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8  transition-shadow">
                <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-brand-purple" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Tools & Technology
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Google Analytics & Search Console</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Screaming Frog technical audits</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>SurferSEO content optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Looker Studio reporting dashboards</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8  transition-shadow">
                <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-brand-coral" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Key Innovations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Auto-updating Looker dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Split-testing property page templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Granular local content targeting</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Phased technical sprint methodology</span>
                  </div>
                </div>
              </Card>
            </div> */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-8 bg-brand-purple rounded-lg flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Tools & Technology
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Google Analytics & Search Console</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Screaming Frog technical audits</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>SurferSEO content optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-purple" />
                    <span>Looker Studio reporting dashboards</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-8 bg-brand-coral rounded-lg flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Key Innovations
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Auto-updating Looker dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Split-testing property page templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Granular local content targeting</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-coral" />
                    <span>Phased technical sprint methodology</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Challenges & Solutions */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Challenges Overcome
              </h3>

              <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                {/* Main Challenges */}
                <div className="flex flex-col items-center text-center">
                  <h4 className="text-lg font-bold text-brand-coral mb-4">
                    Main Challenges
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-start gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-brand-coral rounded-full"></div>
                      <span>Deeply inconsistent metadata across site</span>
                    </div>
                    <div className="flex items-center justify-start gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-brand-coral rounded-full"></div>
                      <span>Weak mobile Core Web Vitals performance</span>
                    </div>
                    <div className="flex items-center justify-start gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-brand-coral rounded-full"></div>
                      <span>Overlapping search intent for town/area names</span>
                    </div>
                  </div>
                </div>

                {/* Solutions Implemented */}
                <div className="flex flex-col items-center text-center">
                  <h4 className="text-lg font-bold text-brand-purple mb-4">
                    Solutions Implemented
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-start gap-3 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Rapid systemic templating for metadata</span>
                    </div>
                    <div className="flex items-center justify-start gap-3 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Staged rollouts minimizing site risk</span>
                    </div>
                    <div className="flex items-center justify-start gap-3 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Granular content targeting strategy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Learned & Future Optimizations */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-brand-purple text-white mb-4">
                Lessons Learned
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Continuous Improvement Insights
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Key learnings from the Griffin Group campaign that inform our
                ongoing optimization approach and future client success
                strategies.
              </p>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8  transition-shadow">
                <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-brand-coral" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  What We'd Do Differently
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                    <span>
                      Initiate mobile performance improvements at the audit
                      phase to accelerate Core Web Vitals gains
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                    <span>
                      Prepare location landing page templates in advance for
                      smoother rollout
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-8  transition-shadow">
                <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Unexpected Challenges
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                    <span>
                      High duplicate metadata revealed only after in-depth
                      crawl—required rapid, systemic templating
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                    <span>
                      Town/area names had confusing overlapping search
                      intent—solved with granular content targeting
                    </span>
                  </div>
                </div>
              </Card>
            </div> */}

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    What We'd Do Differently
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                    <span>
                      Initiate mobile performance improvements at the audit phase to
                      accelerate Core Web Vitals gains
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                    <span>
                      Prepare location landing page templates in advance for smoother rollout
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-8 transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-brand-purple" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Unexpected Challenges
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                    <span>
                      High duplicate metadata revealed only after in-depth crawl—required
                      rapid, systemic templating
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-brand-purple rounded-full mt-2"></div>
                    <span>
                      Town/area names had confusing overlapping search intent—solved with
                      granular content targeting
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial & Agency Feedback */}
        <section className="py-16 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Quote className="w-12 h-12 text-brand-coral mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
              "Social Land valued the proactive documentation—ready-to-send
              branded dashboards and step-by-step changelogs were crucial for
              their client-facing updates. The clarity of deliverables and
              ability to pivot technical strategy based on rapid audit findings
              made this partnership exceptional."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="font-bold text-gray-900">
                  Social Land Account Manager
                </div>
                <div className="text-gray-600">
                  White-Label Partnership Feedback
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Campaign Summary
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                In just three months, the Griffin Group saw double-digit growth
                in organic users and sessions, major improvements in local SERP
                positions, and healthier engagement metrics—all driven by
                focused technical audits, sharp local SEO, and a structured,
                communicative retainer relationship via Social Land. This
                retainer-based model enabled rapid scaling of wins, agile
                mitigation of technical and content pain points, and set the
                stage for Griffin Group's next phase of digital growth.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Property Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can help you achieve similar double-digit
              growth and SERP improvements for your property development
              business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-brand-coral border-white hover:bg-brand-coral hover:text-white"
              >
                <a
                  href={regionConfig.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Book Your SEO Strategy Call
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-brand-coral"
              >
                <Link
                  href="/services/seo"
                  className="flex items-center justify-center gap-2"
                > <ArrowRight className="h-4 w-4" />
                  <span>Explore SEO Services</span>
                </Link>
              </Button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
