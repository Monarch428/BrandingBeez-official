import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  Trash2,
  Building,
} from "lucide-react";
import { useRegion } from "@/hooks/use-region";

export default function JunksAwayCaseStudy() {
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6">JunksAway</h1>
              <p className="text-xl md:text-2xl mb-8 text-white-600">How we reduced CPA by 82% from $34.37 to $6.09 and generated 706 conversions in one month for a UK waste management company</p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span>$6.09 CPA (82% Reduction)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>706 Total Conversions</span>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  <span>10,573+ Clicks</span>
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
                US waste management company serving homeowners, renters, and
                businesses nationwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center">
                <Trash2 className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Industry</h3>
                <p className="text-gray-600">Waste Management / Junk Removal</p>
              </Card>

              <Card className="p-6 text-center">
                <Building className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Business Model</h3>
                <p className="text-gray-600">B2C & B2B Services</p>
              </Card>

              <Card className="p-6 text-center">
                <Globe className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Market</h3>
                <p className="text-gray-600">United Kingdom</p>
              </Card>

              <Card className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold mb-2">Target Audience</h3>
                <p className="text-gray-600">Adults 25-60, Property Owners</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Before/After Comparison */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dramatic Performance Improvement
              </h2>
              <p className="text-xl text-gray-600">
                June 2025 results showcasing the power of strategic campaign
                optimization
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Before */}
              <Card className="p-8 border-red-200 bg-red-50/50">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-red-700 mb-2">
                    Before Optimization
                  </h3>
                  <p className="text-red-600">High costs, limited efficiency</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-gray-700">Search Campaign CPA</span>
                    <span className="font-bold text-red-600">$34.37</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-gray-700">Campaign Structure</span>
                    <span className="font-bold text-red-600">Inefficient</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-gray-700">Budget Allocation</span>
                    <span className="font-bold text-red-600">Suboptimal</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Impression Share Loss</span>
                    <span className="font-bold text-red-600">~45%</span>
                  </div>
                </div>
              </Card>

              {/* After */}
              <Card className="p-8 border-green-200 bg-green-50/50">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    After Optimization
                  </h3>
                  <p className="text-green-600">Maximum efficiency achieved</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-700">Performance Max CPA</span>
                    <span className="font-bold text-green-600">$6.09</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-700">Total Conversions</span>
                    <span className="font-bold text-green-600">706</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-700">Budget Efficiency</span>
                    <span className="font-bold text-green-600">Optimized</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">CPA Reduction</span>
                    <span className="font-bold text-green-600">82%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Strategy Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Strategic Transformation
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive approach focusing on campaign structure and
                Performance Max optimization
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
                  <li>• Split between Search and Performance Max campaigns</li>
                  <li>
                    • Service-specific targeting for junk removal services
                  </li>
                  <li>• Geographic optimization for US markets</li>
                  <li>• Budget reallocation based on performance</li>
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
                  <li>• Intent-based keywords like "junk removal near me"</li>
                  <li>• Waste collection and disposal terms</li>
                  <li>• Local service area targeting</li>
                  <li>• Negative keyword implementation</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Ad Copy Testing</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• RSA format for dynamic content testing</li>
                  <li>• Service-specific messaging variations</li>
                  <li>• Local business trust signals</li>
                  <li>• Clear call-to-action optimization</li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Bidding Strategy</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Maximize Conversions for both campaigns</li>
                  <li>• Performance-based budget allocation</li>
                  <li>• CPA-focused optimization goals</li>
                  <li>• Audience refinement and geo-targeting</li>
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
                Live performance data showing 82% CPA reduction achievement
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <OptimizedImage
                src="/images/img_g2.png"
                alt="JunksAway Google Ads campaign performance showing $6.09 CPA and 706 total conversions"
                className="w-full h-auto rounded-lg shadow-xl border border-gray-200"
                fallbackSrc="/images/img_g2.png"
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
                Exceptional Results
              </h2>
              <p className="text-xl text-gray-600">
                June 2025 performance delivering outstanding ROI and lead
                generation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <div className="text-3xl font-bold text-green-700 mb-2">
                  $6.09
                </div>
                <div className="text-gray-600">Lowest CPA (PMax)</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <Target className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-blue-700 mb-2">706</div>
                <div className="text-gray-600">Total Conversions</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <MousePointer className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  10,573+
                </div>
                <div className="text-gray-600">Total Clicks</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <div className="text-3xl font-bold text-orange-700 mb-2">
                  82%
                </div>
                <div className="text-gray-600">CPA Reduction</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">
                    Performance Max Results
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversions:</span>
                    <span className="font-bold">444</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-bold">5.59%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spend:</span>
                    <span className="font-bold">$2,703</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">
                    Search Campaign Results
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversions:</span>
                    <span className="font-bold">262</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-bold">8.61%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average CPA:</span>
                    <span className="font-bold">$16.58</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-brand-coral" />
                  <h3 className="text-xl font-semibold">Overall Performance</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spend:</span>
                    <span className="font-bold">$123,708</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impressions:</span>
                    <span className="font-bold">274,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROAS:</span>
                    <span className="font-bold">1.28x</span>
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
                Project Timeline
              </h2>
              <p className="text-xl text-gray-600">
                June 2025: From setup to outstanding results in 30 days
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Week 1: Campaign Setup
                </h3>
                <p className="text-gray-600">
                  Structured campaign architecture with Search and Performance
                  Max separation
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Week 2: Testing Phase
                </h3>
                <p className="text-gray-600">
                  RSA and PMax audience testing with initial performance
                  optimization
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Week 3: Optimization
                </h3>
                <p className="text-gray-600">
                  Cost efficiency tracking and budget reallocation toward PMax
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Week 4: Results</h3>
                <p className="text-gray-600">
                  Final performance review and 82% CPA reduction achievement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Insights */}
        <section className="py-16 px-4 bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Key Success Insights
              </h2>
              <p className="text-xl text-gray-600">
                Strategic lessons learned from this remarkable transformation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-green-200 bg-green-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-green-800">
                    What Worked
                  </h3>
                </div>
                <ul className="space-y-2 text-green-700">
                  <li>
                    • Performance Max significantly outperformed expectations
                  </li>
                  <li>
                    • Campaign structure optimization drove efficiency gains
                  </li>
                  <li>
                    • Maximize Conversions bidding strategy delivered results
                  </li>
                  <li>• Geographic targeting refinement improved relevance</li>
                </ul>
              </Card>

              <Card className="p-8 border-blue-200 bg-blue-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-blue-800">
                    Key Innovation
                  </h3>
                </div>
                <ul className="space-y-2 text-blue-700">
                  <li>• Leveraged Performance Max for 82% CPA reduction</li>
                  <li>• Agile budget reallocation based on performance data</li>
                  <li>• Simultaneous Search and PMax testing approach</li>
                  <li>• Rapid scaling capabilities demonstrated</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-pink-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Scale Your Waste Management Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get the same expert Google Ads optimization that reduced CPA by
              82% and generated 706 conversions for JunksAway
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
