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
  Clock,
  Zap,
  Building,
  Quote,
  MessageSquare,
  Calendar,
  DollarSign,
  Monitor,
} from "lucide-react";
import Niji from "../../../public/images/niju-team-member.png";

export default function KoalaDigitalCaseStudy() {
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
                  UK Digital Agency Success
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Koala Digital
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How a 2-person dedicated team scaled delivery, cut costs by
                  55%, and transformed a UK digital marketing agency's
                  operational efficiency.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">+150%</div>
                    <div className="text-sm text-white/80">Campaign Output</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">55%</div>
                    <div className="text-sm text-white/80">Cost Savings</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-brand-purple hover:bg-gray-100"
                    onClick={() =>
                      window.open(
                        "https://calendly.com/vignesh-velusamy/30min",
                        "_blank",
                      )
                    }
                  >
                    Start Your Team
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white p-1">
                    <img
                      src="/images/koala-digital-logo.jpeg"
                      alt="Koala Digital Agency Logo"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Digital Marketing Agency
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-4">Company Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-white/80" />
                    <span>United Kingdom Headquarters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>Carla (Founder & CEO)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-white/80" />
                    <span>SEO, Google Ads, WordPress Development</span>
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
                Team Performance Metrics
              </h2>
              <p className="text-gray-600 text-lg">
                Dashboard showing 150% campaign output increase and 55% cost savings with 2-person team
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Koala Digital Dedicated Team</h3>
                      <p className="text-white/90 text-sm">2-Person Specialist Partnership</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-300 text-sm font-medium">Active Partnership</span>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {/* Gopal - Google Ads Expert */}
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-3 border-green-500/20">
                        <picture>
                          <source srcSet="/images/gopal-team-member.webp" type="image/webp" />
                          <img
                            src="/images/gopal-team-member.png"
                            alt="Gopal - Google Ads Expert"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">Gopal</h4>
                      <p className="text-sm text-green-600 font-semibold mb-3">Google Ads Expert</p>

                      <ul className="text-xs text-gray-700 space-y-1 text-left inline-block">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>PPC Campaign Management</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Ad Creative Optimization</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Performance Analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>ROI Maximization</span>
                        </li>
                      </ul>
                    </div>

                    {/* Nijathan - Web Developer */}
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-3 border-green-500/20">
                        <picture>
                          <source srcSet="/images/niju-team-member.webp" type="image/webp" />
                          <img
                            src={Niji}
                            alt="Nijathan - Web Developer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">Nijathan</h4>
                      <p className="text-sm text-green-600 font-semibold mb-3">Web Developer</p>

                      <ul className="text-xs text-gray-700 space-y-1 text-left inline-block">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>WordPress Development</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Custom Theme Creation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Performance Optimization</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Mobile Responsiveness</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">150%</div>
                        <div className="text-xs text-gray-600">Campaign Output</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">2-3</div>
                        <div className="text-xs text-gray-600">Days Turnaround</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">55%</div>
                        <div className="text-xs text-gray-600">Cost Reduction</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">15-20</div>
                        <div className="text-xs text-gray-600">Monthly Campaigns</div>
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
                  The Challenge
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  As Koala Digital's client base grew, Carla faced mounting
                  pressure to scale creative output and delivery speed without
                  sacrificing quality. Managing multiple freelancers brought
                  unpredictable delays, inconsistent work, and high operational
                  overhead.
                </p>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 mb-6">
                  <Quote className="w-8 h-8 text-red-500 mb-4" />
                  <blockquote className="text-gray-700 italic">
                    "We had strong client demand but lacked the stability and
                    speed we needed to grow with confidence."
                  </blockquote>
                  <cite className="text-sm text-gray-600 mt-2 block">
                    — Carla, Founder & CEO, Koala Digital
                  </cite>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Unreliable freelancers with inconsistent availability
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Limited creative capacity constraining client growth
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Slow turnaround times affecting client satisfaction
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      High per-project costs eating into profit margins
                    </span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    Pre-Partnership Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Monthly Campaign Output
                      </span>
                      <span className="text-red-600 font-semibold">6-8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Task Turnaround</span>
                      <span className="text-red-600 font-semibold">
                        6-7 days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cost Per Project</span>
                      <span className="text-red-600 font-semibold">High</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Creative Quality</span>
                      <span className="text-red-600 font-semibold">
                        Inconsistent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Talent Retention</span>
                      <span className="text-red-600 font-semibold">
                        Low (Freelancer Churn)
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
            {/* Section Heading */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Dedicated Specialist Team
              </h2>
              <p className="text-xl text-gray-600">
                2-person team working as seamless extension of Koala Digital
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Gopal - Google Ads Expert */}
              <Card className="text-center transition-shadow hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-brand-coral" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gopal</h3>
                  <p className="text-brand-coral font-semibold mb-4">
                    Google Ads Expert
                  </p>

                  <ul className="text-sm text-gray-700 space-y-2 text-left inline-block">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>PPC Campaign Management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>Ad Creative Optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>Performance Analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>ROI Maximization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Nijathan - Web Developer */}
              <Card className="text-center transition-shadow hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Monitor className="w-8 h-8 text-brand-coral" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nijathan</h3>
                  <p className="text-brand-coral font-semibold mb-4">Web Developer</p>

                  <ul className="text-sm text-gray-700 space-y-2 text-left inline-block">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>WordPress Development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>Custom Theme Creation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>Performance Optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                      <span>Mobile Responsiveness</span>
                    </li>
                  </ul>
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
                Seamless Integration Workflow
              </h2>
              <p className="text-xl text-gray-600">
                Direct collaboration with no gatekeepers or delays
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Slack: Real-Time Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Carla chats directly with Gopal and Nijathan
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Live updates and instant feedback
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        No gatekeepers or communication delays
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Fast, flexible execution</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      Direct Access
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
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Trello: Central Task Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Tasks organized in collaborative Trello boards
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Daily updates and status tracking
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Full visibility into timelines and progress
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Unified documentation in one place
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

            <Card className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  What Makes This Collaboration Special
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Speed</h4>
                    <p className="text-sm text-gray-600">
                      Agile turnarounds (2–3 days vs 6–7)
                    </p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Cost Efficiency</h4>
                    <p className="text-sm text-gray-600">
                      ~55% savings compared to UK freelancers
                    </p>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Communication</h4>
                    <p className="text-sm text-gray-600">
                      Real-time, no layers
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Task Transparency</h4>
                    <p className="text-sm text-gray-600">
                      Live boards, full visibility
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Team Stability</h4>
                    <p className="text-sm text-gray-600">
                      Zero churn, fully trained resources
                    </p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Consistency</h4>
                    <p className="text-sm text-gray-600">
                      Always on-brand delivery
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-teal-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Transformational Results
              </h2>
              <p className="text-xl text-gray-600">
                Measurable impact through dedicated team partnership
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
                  <div className="text-gray-600">Campaign Output</div>
                  <div className="text-sm text-gray-500 mt-1">
                    15-20 monthly campaigns
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    2-3
                  </div>
                  <div className="text-gray-600">Days Turnaround</div>
                  <div className="text-sm text-gray-500 mt-1">
                    From 6-7 days
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    55%
                  </div>
                  <div className="text-gray-600">Cost Reduction</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Vs UK freelancers
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    0%
                  </div>
                  <div className="text-gray-600">Team Attrition</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Dedicated stability
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Before vs. After Impact
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">
                          Key Metric
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-red-600">
                          Before (Freelancer Model)
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-green-600">
                          After (Dedicated Team)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Monthly Campaign Output
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          6–8
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          15–20
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Average Task Turnaround
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          6–7 days
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          2–3 days
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Cost per Project
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          High
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          Reduced by ~55%
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Creative Quality
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          Inconsistent
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          Always on-brand
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Team Communication
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          Delayed, fragmented
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          Instant & real-time
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">
                          Talent Retention
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          Low (freelancer churn)
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          High (0% attrition)
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                    "Working directly with Gopal and Nijathan on Slack means we're
                    never out of sync. They understand the brief, the brand, and
                    the urgency. We're launching faster and serving clients
                    better."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">C</span>
                    </div>
                    <div>
                      <div className="font-semibold">Carla</div>
                      <div className="text-white/80 text-sm">
                        CEO, Koala Digital
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 mb-4 opacity-80" />
                  <blockquote className="text-lg font-light mb-6 leading-relaxed">
                    "I used to worry about consistency and capacity. Now I focus
                    on growth, knowing my delivery team is solid and reliable."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">C</span>
                    </div>
                    <div>
                      <div className="font-semibold">Carla</div>
                      <div className="text-white/80 text-sm">
                        Founder & CEO, Koala Digital
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
              Ready to Scale Like Koala Digital?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get your own dedicated team of specialists who work seamlessly as
              an extension of your agency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing-calculator">
                <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple">
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
