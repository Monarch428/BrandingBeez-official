import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import { OptimizedImage } from "@/components/optimized-image";
import { Link } from "wouter";
import {
  MousePointer,
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
  Phone,
  Quote,
  Calendar,
  Settings,
  PoundSterling,
  Heart,
  FileText,
} from "lucide-react";

export default function TheDogGuyCaseStudy() {
  const { regionConfig } = useRegion();
  const getCalendlyUrl = () => regionConfig.calendlyUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-brand-coral text-white mb-6 text-lg px-4 py-2">
                Featured Google Ads Success Story
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                The Dog Guy
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white-600">
                How we achieved 12.06% conversion rate and generated 192
                conversions with £20.35 CPA for a UK dog training business
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>12.06% Conversion Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>192 Total Conversions</span>
                </div>
                <div className="flex items-center gap-2">
                  <PoundSterling className="w-5 h-5" />
                  <span>£20.35 Average CPA</span>
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
              <p className="text-xl text-gray-600">
                UK dog training specialist helping pet owners with behavior and
                obedience training
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold mb-2">Industry</h3>
                <p className="text-gray-600">Dog Training Services</p>
              </Card>

              <Card className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Business Model</h3>
                <p className="text-gray-600">B2C Pet Services</p>
              </Card>

              <Card className="p-6 text-center">
                <Globe className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Market</h3>
                <p className="text-gray-600">United Kingdom</p>
              </Card>

              <Card className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Target Audience</h3>
                <p className="text-gray-600">Pet Owners Seeking Training</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  The Challenge
                </h2>
                <p className="text-xl text-gray-600">
                  The Dog Guy needed to optimize underperforming campaigns and
                  improve lead generation efficiency for their dog training
                  services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Underperforming Campaigns
                  </h3>
                  <p className="text-gray-600">
                    Poor campaign structure limiting lead generation potential
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PoundSterling className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Budget Constraints
                  </h3>
                  <p className="text-gray-600">
                    Limited daily budget versus competitive pet service CPCs
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Local Competition
                  </h3>
                  <p className="text-gray-600">
                    Competing in local dog training market with better-funded
                    competitors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategy Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Strategic Optimization Approach
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive campaign restructure focusing on local dog
                training services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">
                    Campaign Restructure
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cleaned up underperforming campaigns</li>
                  <li>• Consolidated ad groups by service type</li>
                  <li>• "Resi Dog Training" focused structure</li>
                  <li>• Improved account organization</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">
                    Keyword Optimization
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Refined match types for better targeting</li>
                  <li>• Added negative keywords to reduce waste</li>
                  <li>• Local-intent and high-converting phrases</li>
                  <li>• Dog training specific terminology</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Ad Copy Testing</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• A/B tested multiple RSA variations</li>
                  <li>• Unique CTA hooks for dog training</li>
                  <li>• Service-specific messaging</li>
                  <li>• Trust signals for pet owners</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">
                    Landing Page & Bidding
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fast loading and mobile-friendly UX</li>
                  <li>• Direct call buttons and form prioritization</li>
                  <li>• "Maximize Conversions" with budget caps</li>
                  <li>• Geo-focused around service locations</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Dashboard Image Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Google Ads Dashboard Results
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Real campaign data showing 12.06% conversion rate achievement
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <OptimizedImage
                src="/images/img_g3.png"
                alt="The Dog Guy Google Ads campaign performance showing 12.06% conversion rate and 192 total conversions"
                className="w-full h-auto rounded-lg shadow-xl border border-gray-200"
                fallbackSrc="/images/img_g3.png"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Outstanding Results
              </h2>
              <p className="text-xl text-gray-600">
                June 2025 performance showcasing significant improvement in lead
                generation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <Target className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <div className="text-3xl font-bold text-green-700 mb-2">
                  12.06%
                </div>
                <div className="text-gray-600">Best Conversion Rate</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <Users className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-blue-700 mb-2">192</div>
                <div className="text-gray-600">Total Conversions</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <PoundSterling className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  £20.35
                </div>
                <div className="text-gray-600">Average CPA</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <FileText className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <div className="text-3xl font-bold text-orange-700 mb-2">
                  191
                </div>
                <div className="text-gray-600">Lead Form Submissions</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">
                    Campaign Performance
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CPA Range:</span>
                    <span className="font-bold">£15.80 - £26.79</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spend:</span>
                    <span className="font-bold">£3,906.48</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaigns:</span>
                    <span className="font-bold">4 Active</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Impression Share</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Campaign:</span>
                    <span className="font-bold">36.36%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lost IS (Budget):</span>
                    <span className="font-bold">16.67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Budget:</span>
                    <span className="font-bold">£128</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Efficiency Metrics</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Optimization Score:</span>
                    <span className="font-bold">~65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Spend:</span>
                    <span className="font-bold">£3,968</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lead Quality:</span>
                    <span className="font-bold">High Intent</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Optimization Timeline
              </h2>
              <p className="text-xl text-gray-600">
                June 2025: Strategic improvements implemented over 15 days
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  June 1: Campaign Restructure
                </h3>
                <p className="text-gray-600">
                  Account cleanup and service-based ad consolidation
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  June 3-5: Ad Copy Testing
                </h3>
                <p className="text-gray-600">
                  RSA variations with unique CTAs for dog training services
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  10
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  June 10: Landing Page
                </h3>
                <p className="text-gray-600">
                  Call button implementation and mobile optimization
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  15
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  June 15: Final Optimization
                </h3>
                <p className="text-gray-600">
                  Negative keyword cleanup and performance review
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Testimonial */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Client Success Story
              </h2>
            </div>

            <Card className="p-8 border-brand-coral/20 bg-gradient-to-br from-brand-coral/5 to-pink-50">
              <div className="text-center">
                <Quote className="w-12 h-12 mx-auto mb-6 text-brand-coral" />
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "We saw a noticeable lift in inquiries after just two weeks of
                  optimizations. The team's approach to our dog training
                  campaigns was exactly what we needed."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-coral to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      The Dog Guy Team
                    </div>
                    <div className="text-brand-coral">
                      Dog Training Specialists
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Partnership Evolution */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Partnership Evolution
              </h2>
              <p className="text-xl text-gray-600">
                From one-time audit to ongoing monthly PPC management
                partnership
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Initial Audit</h3>
                <p className="text-gray-600">
                  Comprehensive campaign analysis and optimization
                  recommendations
                </p>
              </Card>

              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-gray-600">
                  12.06% conversion rate and 192 conversions demonstrated value
                </p>
              </Card>

              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Monthly Retainer</h3>
                <p className="text-gray-600">
                  Ongoing partnership with weekly check-ins and continuous
                  optimization
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-pink-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Pet Service Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get the same expert Google Ads optimization that achieved 12.06%
              conversion rates and 192 conversions for The Dog Guy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral"
                onClick={() => window.open(getCalendlyUrl(), "_blank")}
              >
                Book Your Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-brand-coral"
                asChild
              >
                <Link href="/services/google-ads">
                  View Google Ads Services
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
