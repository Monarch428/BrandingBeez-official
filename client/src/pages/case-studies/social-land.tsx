import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  Calendar,
  Monitor,
  MessageSquare,
  Zap,
  Building,
  Quote,
  Video,
  Clock,
} from "lucide-react";

export default function SocialLandCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      <main className="pt-0">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  Featured Borderless Team Success
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  SocialLand Digital: First UK Partnership Success
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How a 6-person dedicated team revolutionized a UK digital
                  marketing agency with seamless borderless collaboration, 150%
                  more project output, and 60% cost savings.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">+150%</div>
                    <div className="text-sm text-white/80">Project Output</div>
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
                      className="bg-white text-brand-purple hover:bg-gray-100"
                    >
                      Start Your Team
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white p-1">
                    <img
                      src="/images/socialland-logo.jpeg"
                      alt="Social Land Digital Agency Logo"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    Digital Marketing Agency
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-4">Client Profile</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-white/80" />
                    <span>United Kingdom Headquarters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>
                      Joe (CEO), George (COO), Sophie & Sarika (Account
                      Managers)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-white/80" />
                    <span>Digital Marketing & Branding Specialist</span>
                  </div>
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
                Website Showcase
              </h2>
              <p className="text-gray-600 text-lg">
                Project management metrics showing 150% project output increase and 60% cost savings
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-purple to-brand-coral text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Desktop Experience</h3>
                      <p className="text-white/90 text-sm">6-Person Specialist Partnership</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-300 text-sm font-medium">Active Partnership</span>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Priya - Graphic Designer */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-3 border-brand-coral/20">
                        <picture>
                          <source srcSet="/images/priya-team-member.webp" type="image/webp" />
                          <img
                            src="/images/priya-team-member.png"
                            alt="Priya - Graphic Designer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Priya</h4>
                      <p className="text-xs text-brand-coral">Virtual assistant</p>
                    </div>

                    {/* Azeez - Web Developer */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-3 border-brand-coral/20">
                        <picture>
                          <source srcSet="/images/azeez-team-member.webp" type="image/webp" />
                          <img
                            src="/images/azeez-team-member.png"
                            alt="Azeez - Web Developer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Azeez</h4>
                      <p className="text-xs text-brand-coral">Senior Graphic designer</p>
                    </div>

                    {/* Niju - Video Editor */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-3 border-brand-coral/20">
                        <picture>
                          <source srcSet="/images/niju-team-member.webp" type="image/webp" />
                          <img
                            src="/images/niju-team-member.png"
                            alt="Niju - Video Editor"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Niju</h4>
                      <p className="text-xs text-brand-coral">Wordpress developer</p>
                    </div>

                    {/* Raje - SEO Specialist */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-3 border-brand-coral/20">
                        <picture>
                          <source srcSet="/images/raje-team-member.webp" type="image/webp" />
                          <img
                            src="/images/raje-team-member.png"
                            alt="Raje - SEO Specialist"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Raje</h4>
                      <p className="text-xs text-brand-coral">Manager</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">150%</div>
                        <div className="text-xs text-gray-600">Output Increase</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">3-4</div>
                        <div className="text-xs text-gray-600">Days Turnaround</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">60%</div>
                        <div className="text-xs text-gray-600">Cost Savings</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">25+</div>
                        <div className="text-xs text-gray-600">Monthly Projects</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-brand-purple mb-6">
                  Project Overview
                </h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Project Goals
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Social Land, a thriving UK digital marketing agency led by Joe
                  and George, wanted to scale operations, deliver more projects,
                  and boost creativity without losing their personal touch or
                  compromising quality. They needed a solution that felt like
                  one unified team.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
                  Partnership Impact
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Limited capacity for growing client demands while
                      maintaining quality
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      High costs and unreliability with freelancer model and
                      staff turnover
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Need for consistent brand delivery across all client
                      projects
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Desire to scale without losing personal agency feel and
                      client relationships
                    </span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    Pre-Partnership Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Monthly Projects</span>
                      <span className="text-red-600 font-semibold">10-12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Task Turnaround</span>
                      <span className="text-red-600 font-semibold">
                        8-10 days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Staff Turnover</span>
                      <span className="text-red-600 font-semibold">High</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Project Visibility</span>
                      <span className="text-red-600 font-semibold">
                        Moderate
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Composition Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Website Features & Solutions
              </h2>
              <h3 className="text-xl text-gray-600 mb-4">
                Core Features Delivered
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                6-person specialized team seamlessly integrated with UK
                leadership
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Service-Focused Layouts
                  </h4>
                  <p className="text-2xl font-bold text-brand-coral mb-1">2</p>
                  <p className="text-sm text-gray-600">Creative Specialists</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Portfolio/Work Section
                  </h4>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Full-Stack</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Video className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Contact Forms & CTA Placements
                  </h4>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Motion Graphics</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Technical Excellence
                  </h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">PPC Expert</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Speed Optimization
                  </h4>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Organic Growth</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Clarity & Agency Credibility
                  </h4>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Dedicated Coordinator</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Implementation Process Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Partnership Evolution
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Revolutionary approach to cross-border teamwork that feels like
                one office
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mb-6">
                Mobile-First Design
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">Initial Project Success</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Persistent Discord video rooms
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Direct leadership-to-specialist communication
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Instant interaction as the norm
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-purple-100 text-purple-800">
                      Real-Time Connection
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">Partnership Expansion</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Sophie & Sarika work directly with team
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Pooled expertise on every brief
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Rapid client feedback implementation
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      Collaborative Excellence
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">Dedicated Resource Team</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Collaborative Asana management
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Daily video scrums</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Agile pivots for new opportunities
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800">
                      Transparent Workflow
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Client Feedback
              </h2>
              <p className="text-xl text-gray-600">
                Measurable transformation through borderless team collaboration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    150%
                  </div>
                  <div className="text-gray-600">Project Output</div>
                  <div className="text-sm text-gray-500 mt-1">
                    25+ monthly projects
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    3-4
                  </div>
                  <div className="text-gray-600">Days Turnaround</div>
                  <div className="text-sm text-gray-500 mt-1">
                    From 8-10 days
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    60%
                  </div>
                  <div className="text-gray-600">Cost Savings</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Vs previous model
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    Low
                  </div>
                  <div className="text-gray-600">Team Turnover</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Dedicated stability
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-purple-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Partnership Success Factors
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Video-connected, real-time team integration</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Instant on-call problem solving huddles</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Transparent, live Asana project boards</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Agile, predictable daily work cycles</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      What Makes It Special
                    </h4>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Direct Access:</span> UK
                        leadership chats directly with specialists no
                        gatekeepers
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">
                          Brand Consistency:
                        </span>{" "}
                        Shared playbooks and workflows
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Time Zone Magic:</span>{" "}
                        Assets delivered by UK morning
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 mb-4 opacity-80" />
                  <blockquote className="text-lg font-light mb-6 leading-relaxed">
                    "Video standups every morning and our always-open Discord
                    room mean nothing is lost in translation. Sophie, Sarika,
                    and the whole team are plugged in, proactive, and perfectly
                    aligned with our vision."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">G</span>
                    </div>
                    <div>
                      <div className="font-semibold">George</div>
                      <div className="text-white/80 text-sm">
                        COO, Social Land
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 mb-4 opacity-80" />
                  <blockquote className="text-lg font-light mb-6 leading-relaxed">
                    "Having Sophie and Sarika work directly with your creative
                    experts lets us offer our clients more—faster and
                    smoother—than we ever could before. It's the agency's dream,
                    realized."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">J</span>
                    </div>
                    <div>
                      <div className="font-semibold">Joe</div>
                      <div className="text-white/80 text-sm">
                        CEO, Social Land
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your Professional Website?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Experience seamless collaboration like Social Land with your own
              dedicated team that feels like one office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing-calculator">
                <Button size="lg" className="bg-white text-brand-purple hover:bg-white/90 hover:text-brand-purple">
                  Build Your Dedicated Team
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple"
                >
                  View Our Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
