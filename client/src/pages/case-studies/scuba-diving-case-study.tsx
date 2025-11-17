import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import scubaCardImage from "@assets/targeted_element_1754118942775.png";
import scubaPerformanceImage from "@assets/by-the-shore-scuba-seo-success_1754118940974.png";
import {
  Search,
  TrendingUp,
  Target,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Globe,
  ExternalLink,
  LineChart,
  Zap,
  Shield,
  Eye,
  MousePointer,
  Quote,
  Calendar,
  Settings,
} from "lucide-react";

export default function ScubaDivingCaseStudy() {
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
                  By The Shore SCUBA Training
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  How we increased organic users by 31% and generated 360% more
                  phone inquiries for a local scuba training business in 6 months
                </p>
                <div className="flex flex-wrap gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>+31% Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span>+360% Phone Clicks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    <span>61 Top Rankings</span>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200/50 shadow-2xl bg-gradient-to-br from-white to-gray-50 p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white shadow-lg">
                    <img 
                      src={scubaPerformanceImage} 
                      alt="By The Shore SCUBA Search Console Performance - 411 clicks, 103K impressions"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                    <p className="text-sm font-semibold text-gray-800">Google Search Console</p>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-brand-coral/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                    <p className="text-sm font-bold text-white">411 Clicks • 103K Impressions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        

        {/* Key Results */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Measurable Results
                </h2>
                <p className="text-gray-600 text-lg">
                  Key metrics and achievements from this transformation
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center p-8 border-2 border-brand-coral/20 bg-brand-coral/5">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-coral mb-2">
                    31%
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Organic User Growth
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    From 1,361 to 1,781 users
                  </p>
                </Card>

                <Card className="text-center p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
                  <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-purple mb-2">
                    360%
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Phone Click Increase
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Lead generation boost
                  </p>
                </Card>

                <Card className="text-center p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
                  <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-purple mb-2">
                    61
                  </h3>
                  <p className="text-gray-700 font-medium">Top 1 Rankings</p>
                  <p className="text-sm text-gray-600 mt-2">
                    From 5 to 61 #1 positions
                  </p>
                </Card>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-coral rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-coral">
                    6 months
                  </h4>
                  <p className="text-gray-600">Project Duration</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-coral rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MousePointer className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-coral">43%</h4>
                  <p className="text-gray-600">Page View Growth</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-coral rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-coral">260%</h4>
                  <p className="text-gray-600">Form Click Increase</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-purple rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-brand-purple">95</h4>
                  <p className="text-gray-600">Mobile Page Speed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Client */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  About By The Shore SCUBA Instruction
                </h2>
                <p className="text-gray-600 text-lg">
                  Understanding our client's business and local SEO
                  transformation needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-blue-500 rounded-lg flex items-center justify-center">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        By The Shore SCUBA Instruction
                      </h3>
                      <h4 className="text-gray-600">
                        SCUBA Training & Certification
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        Small Business (B2C)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        Established diving instructor
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        SCUBA lessons & certification
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-brand-coral" />
                      <span className="text-gray-700">
                        Raleigh, NC & nearby areas
                      </span>
                    </div>
                  </div>
                </div>

                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-4 text-gray-900">
                    Business & Background
                  </h4>
                  <p className="text-gray-700 mb-4">
                    By The Shore SCUBA Instruction is a specialized diving
                    school offering SCUBA lessons, certification courses, and
                    dive training for adults aged 18-60 in Raleigh, NC and
                    surrounding areas. They serve adventure seekers, hobbyists,
                    and travelers interested in professional dive training.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Despite their quality instruction, the business struggled
                    with online visibility. Their website had broken links, weak
                    backlink profile, missing keyword targeting across landing
                    pages, and no structured form tracking to measure
                    conversions.
                  </p>
                  <p className="text-gray-700">
                    Their target audience includes adventure enthusiasts,
                    vacation divers, and locals seeking professional SCUBA
                    certification. They needed a comprehensive local SEO
                    strategy to capture high-intent search traffic for diving
                    lessons and certification courses in their market.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Results & Strategy */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Strategy Implementation
                  </h2>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            Technical SEO Fixes
                          </h3>
                          <p className="text-gray-600">
                            Fixed broken links, enhanced page speed (Mobile:
                            90→95, Desktop: 90→97), and setup structured data
                            tracking.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            Local Keyword Strategy
                          </h3>
                          <p className="text-gray-600">
                            Focused on location-specific keywords: "scuba
                            lessons raleigh nc", "scuba certification raleigh",
                            and "dive training".
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            Content Optimization
                          </h3>
                          <p className="text-gray-600">
                            Optimized headings and on-page content, aligned each
                            page with target keywords, and introduced FAQ
                            sections.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Measurable Results
                  </h2>

                  <div className="bg-white rounded-xl p-6 border-2 border-brand-coral/20">
                    <h3 className="font-bold text-lg mb-4 text-green-700">
                      6-Month Performance Summary
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Organic Users</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-coral">
                            +31%
                          </span>
                          <p className="text-sm text-gray-500">
                            1,361 → 1,781 users
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Top 1 Rankings</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-purple">
                            5 → 61
                          </span>
                          <p className="text-sm text-gray-500">
                            1,220% increase
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Phone Clicks</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-purple">
                            +360%
                          </span>
                          <p className="text-sm text-gray-500">
                            Direct inquiry boost
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Form Clicks</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-coral">
                            +260%
                          </span>
                          <p className="text-sm text-gray-500">
                            Booking inquiries
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Total Keywords Ranked
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-brand-coral">
                            10 → 271
                          </span>
                          <p className="text-sm text-gray-500">2,710% growth</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Page Views</span>
                        <div className="text-right">
                          <span className="font-bold text-brand-coral">
                            +43%
                          </span>
                          <p className="text-sm text-gray-500">
                            10,042 → 14,370 views
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

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-coral to-pink-500 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your SEO Performance?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Get the same results for your business. Let's discuss your SEO
                goals and create a strategy that delivers measurable growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral"
                >
                  <a
                    href="https://calendly.com/vignesh-velusamy/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Strategy Call
                    <Calendar className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-brand-coral transition-colors duration-200"
                >
                  <Link href="/services/seo">
                    View SEO Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
