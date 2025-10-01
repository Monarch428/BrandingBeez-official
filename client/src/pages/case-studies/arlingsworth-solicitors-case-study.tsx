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
  Scale,
} from "lucide-react";

export default function ArlingsworthSolicitorsCaseStudy() {
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
                Arlingsworth Solicitors
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white-600">
                How we achieved £6.51 CPA and 18.95% conversion rate for a UK
                law firm, generating 100+ conversions and 77+ phone calls
                monthly
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <PoundSterling className="w-5 h-5" />
                  <span>£6.51 Lowest CPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>18.95% Conversion Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>77+ Phone Calls</span>
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
                UK family law firm serving clients across probate, divorce, and
                legal services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center">
                <Globe className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Website</h3>
                <a
                  href="https://www.arlingsworth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 flex items-center justify-center gap-1"
                >
                  arlingsworth.com <ExternalLink className="w-3 h-3" />
                </a>
              </Card>

              <Card className="p-6 text-center">
                <Scale className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Industry</h3>
                <p className="text-gray-600">Legal Services (Family Law)</p>
              </Card>

              <Card className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Business Model</h3>
                <p className="text-gray-600">B2C Legal Services</p>
              </Card>

              <Card className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold mb-2">Target Market</h3>
                <p className="text-gray-600">UK Adults (30-60)</p>
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
                  Arlingsworth Solicitors needed to generate high-quality leads
                  for their family law services while maintaining cost
                  efficiency in a competitive legal market.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PoundSterling className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    High Competition
                  </h3>
                  <p className="text-gray-600">
                    Legal services face intense competition with rising costs
                    per click
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quality Leads</h3>
                  <p className="text-gray-600">
                    Need for high-intent leads that convert to actual legal
                    consultations
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    ROI Optimization
                  </h3>
                  <p className="text-gray-600">
                    Maximizing return on ad spend while scaling lead generation
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
                Our Strategic Approach
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive Google Ads optimization focused on legal industry
                best practices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Campaign Structure</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Segregated Search and Performance Max campaigns</li>
                  <li>
                    • Service-specific ad groups for family law specialties
                  </li>
                  <li>• Geographic targeting for UK legal services</li>
                  <li>• Device-specific bid adjustments</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Ad Copy & Testing</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Responsive Search Ads with regular A/B testing</li>
                  <li>• Legal service-specific messaging</li>
                  <li>• Trust signals and credentials highlighting</li>
                  <li>• Call-to-action optimization for consultations</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Keyword Strategy</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • Legal service-specific keywords (broad, phrase, exact)
                  </li>
                  <li>• Negative keyword optimization</li>
                  <li>• Intent-based keyword targeting</li>
                  <li>• Location-based legal service terms</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Bidding & Budget</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Maximize Conversions bidding strategy</li>
                  <li>• Daily budget optimization (£117.22 average)</li>
                  <li>• Performance-based budget allocation</li>
                  <li>• CPA-focused optimization</li>
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
                Real performance data from our Google Ads campaigns
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <OptimizedImage
                src="/images/img_g1.png"
                alt="Arlingsworth Solicitors Google Ads campaign performance showing £6.51 CPA and 18.95% conversion rate"
                className="w-full h-auto rounded-lg shadow-xl border border-gray-200"
                fallbackSrc="/images/img_g1.png"
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
                Delivering exceptional performance across all key metrics in May
                2025
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <PoundSterling className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <div className="text-3xl font-bold text-green-700 mb-2">
                  £6.51
                </div>
                <div className="text-gray-600">Lowest CPA (PMax)</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <Target className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  18.95%
                </div>
                <div className="text-gray-600">Best Conversion Rate</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <MousePointer className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  8.76%
                </div>
                <div className="text-gray-600">Top CTR</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <Users className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <div className="text-3xl font-bold text-orange-700 mb-2">
                  100+
                </div>
                <div className="text-gray-600">Total Conversions</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Phone Conversions</h3>
                </div>
                <div className="text-2xl font-bold text-brand-coral mb-2">
                  77.5 Calls
                </div>
                <p className="text-gray-600">
                  Direct phone inquiries from Search campaigns
                </p>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">
                    Campaign Performance
                  </h3>
                </div>
                <div className="text-2xl font-bold text-brand-coral mb-2">
                  1,139+
                </div>
                <p className="text-gray-600">
                  Total clicks generated across all campaigns
                </p>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Visibility</h3>
                </div>
                <div className="text-2xl font-bold text-brand-coral mb-2">
                  56,116+
                </div>
                <p className="text-gray-600">
                  Total impressions across Search and PMax
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Proven Process
              </h2>
              <p className="text-xl text-gray-600">
                Structured approach delivering consistent results for legal
                services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Campaign Setup</h3>
                <p className="text-gray-600">
                  Structured Search and Performance Max campaigns with legal
                  industry targeting
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Testing & Optimization
                </h3>
                <p className="text-gray-600">
                  A/B testing RSAs, negative keyword implementation, and bid
                  strategy optimization
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Performance Tracking
                </h3>
                <p className="text-gray-600">
                  GTM conversion tracking for phone clicks, form fills, and
                  engagement metrics
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Weekly Reporting</h3>
                <p className="text-gray-600">
                  Comprehensive insights, dashboard updates, and strategy
                  adjustments
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-pink-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Achieve Similar Results?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get the same expert Google Ads management that delivered £6.51 CPA
              and 18.95% conversion rates for Arlingsworth Solicitors
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
