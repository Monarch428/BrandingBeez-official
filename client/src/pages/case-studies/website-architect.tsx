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
  Globe,
  Star,
  TrendingDown,
} from "lucide-react";

export default function WebsiteArchitectCaseStudy() {
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
                  Solo Founder Success Story
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Website Architect
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How a 3-person dedicated team transformed a solo founder from
                  overworked to empowered, scaling from 1-2 to 5-6 websites
                  monthly while adding SEO services.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">+200%</div>
                    <div className="text-sm text-white/80">Monthly Output</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">NEW</div>
                    <div className="text-sm text-white/80">SEO Services</div>
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
                      src="/images/website-architect-logo.jpeg" 
                      alt="Website Architect Logo"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    Web Development Agency
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
                    <span>Gemma (Founder & Solo Entrepreneur)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-white/80" />
                    <span>https://website-architect.co.uk/</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-white/80" />
                    <span>Custom WordPress Websites</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-brand-purple mb-6">
                  The Solo Founder Challenge
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  When we first met Gemma through BNI, she was running Website
                  Architect completely on her own. As a solo entrepreneur, she
                  wore all the hats—sales, development, delivery, and support.
                  This all-in-one approach began to limit her growth potential.
                </p>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 mb-6">
                  <Quote className="w-8 h-8 text-red-500 mb-4" />
                  <blockquote className="text-gray-700 italic">
                    "Before meeting Raje and her team, I was doing the sales,
                    building the websites and handling all the tech and
                    aftercare."
                  </blockquote>
                  <cite className="text-sm text-gray-600 mt-2 block">
                    — Gemma, Founder, Website Architect
                  </cite>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-600">
                      Overloaded and stretched thin across all business
                      functions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-600">
                      No time to focus on sales or business development
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-600">
                      Slow delivery cycles due to solo workload constraints
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-600">
                      Inability to scale up or offer additional services
                    </span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    Pre-Partnership Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Websites Per Month</span>
                      <span className="text-red-600 font-semibold">1-2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">SEO Services</span>
                      <span className="text-red-600 font-semibold">None</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Time for Sales & Strategy
                      </span>
                      <span className="text-red-600 font-semibold">
                        Very Limited
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Speed & Quality</span>
                      <span className="text-red-600 font-semibold">
                        Inconsistent (Solo)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Business Growth</span>
                      <span className="text-red-600 font-semibold">Linear</span>
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
                Dedicated Growth Team
              </h2>
              <p className="text-xl text-gray-600">2-person specialist team working as Gemma's extended delivery and marketing arm</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-3 border-brand-coral/20">
                    <picture>
                      <source srcSet="/images/vishnu-team-member.webp" type="image/webp" />
                      <img
                        src="/images/vishnu-team-member.png"
                        alt="Vishnu - WordPress Developer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Vishnu
                  </h3>
                  <p className="text-brand-coral font-semibold mb-3">
                    WordPress Developer
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Custom WordPress Development</li>
                    <li>• Theme Customization</li>
                    <li>• Performance Optimization</li>
                    <li>• Technical Implementation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-3 border-brand-coral/20">
                    <picture>
                      <source srcSet="/images/yuva-team-member.webp" type="image/webp" />
                      <img
                        src="/images/yuva-team-member.png"
                        alt="Yuva - SEO Specialist"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Yuva
                  </h3>
                  <p className="text-brand-coral font-semibold mb-3">
                    SEO Specialist
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• SEO Strategy Development</li>
                    <li>• Content Optimization</li>
                    <li>• Technical SEO Audits</li>
                    <li>• Performance Monitoring</li>
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
                From Project Help to Dedicated Partnership
              </h2>
              <p className="text-xl text-gray-600">
                Seamless integration that evolved from project support to full
                team extension
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
                    Daily Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        WhatsApp for instant updates and feedback
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Constant access for urgent inputs and revisions
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        File sharing and real-time collaboration
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Direct team access without barriers
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      Instant Access
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
                    Task & Project Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Trello boards for each client project
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Daily task updates and progress tracking
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Weekly sync meetings for alignment
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Complete project transparency
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800">
                      Organized Workflow
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Partnership Evolution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Built on Trust</h4>
                    <p className="text-sm text-gray-600">
                      More than service provider true growth partners
                    </p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Team-as-a-Service</h4>
                    <p className="text-sm text-gray-600">
                      Dedicated delivery plus marketing & BD support
                    </p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Genuine Culture Fit</h4>
                    <p className="text-sm text-gray-600">
                      Seamless communication and shared values
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Exponential Growth Results
              </h2>
              <p className="text-xl text-gray-600">
                From overworked solo founder to empowered business owner
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    5-6
                  </div>
                  <div className="text-gray-600">Websites/Month</div>
                  <div className="text-sm text-gray-500 mt-1">
                    From 1-2 monthly
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                  <div className="text-gray-600">SEO Clients</div>
                  <div className="text-sm text-gray-500 mt-1">
                    New service added
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    FULL
                  </div>
                  <div className="text-gray-600">Sales Focus</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Time for growth
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    EXP
                  </div>
                  <div className="text-gray-600">Growth Rate</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Exponential scaling
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-orange-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Transformation Metrics
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">
                          Metric
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-red-600">
                          Before
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-green-600">
                          After
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Websites delivered per month
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          1–2
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          5–6
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          SEO Services Offered
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          None
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          Now handling 4 SEO clients
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Time for Sales & Strategy
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          Very limited
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          Now focuses fully on growth
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Speed & Quality
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          Inconsistent (solo)
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          Fast, professional, scalable
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">
                          Business Growth
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          Linear
                        </td>
                        <td className="py-3 px-4 text-center text-green-600 font-semibold">
                          Exponential (in just months)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Standout Wins
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>
                        Helped Gemma upsell SEO services by showing ROI to web
                        clients
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>
                        Enabled doubling project throughput without hiring
                        locally
                      </span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>
                        Allowed her to step back from operations and take real
                        time off
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>
                        Gained dedicated team support for business development
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardContent className="p-12 text-center">
                <Quote className="w-12 h-12 mx-auto mb-6 opacity-80" />
                <blockquote className="text-xl font-light mb-8 leading-relaxed">
                  "Branding Beez have been a great help to my business. Before
                  meeting Raje and her team, I was doing the sales, building the
                  websites and handling all the tech and aftercare. Now I have
                  the time to grow the business, working 'ON' it, instead of
                  constantly 'IN' it. So they've been a gamechanger for me and
                  my business. Even taking my first holiday this year WITHOUT my
                  laptop! Thanks so much!"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">G</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-semibold">Gemma</div>
                    <div className="text-white/80">
                      Founder, Website Architect
                    </div>
                    <div className="text-white/60 text-sm">
                      https://website-architect.co.uk/
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Solo Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Stop working IN your business and start working ON it with your
              own dedicated team that scales with you.
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
