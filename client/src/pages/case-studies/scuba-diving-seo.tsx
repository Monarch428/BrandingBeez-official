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
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

export default function ScubaDivingSEOCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">
                Tourism SEO Success Story
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Scuba Diving Adventures
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                How we increased local tourism bookings by 320% and revenue by $850K through targeted local SEO
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>320% Traffic Increase</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>$850K Revenue Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>95+ Local Rankings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Case Study Highlights</h2>
                <p className="text-gray-600 text-lg">Key metrics and achievements from this local SEO transformation</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center p-8 border-2 border-blue-200 bg-blue-50">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">320%</h3>
                  <p className="text-gray-700 font-medium">Local Traffic Increase</p>
                  <p className="text-sm text-gray-600 mt-2">From 8K to 33K monthly visitors</p>
                </Card>
                
                <Card className="text-center p-8 border-2 border-green-200 bg-green-50">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-600 mb-2">$850K</h3>
                  <p className="text-gray-700 font-medium">Revenue Increase</p>
                  <p className="text-sm text-gray-600 mt-2">Direct attribution from organic search</p>
                </Card>
                
                <Card className="text-center p-8 border-2 border-teal-200 bg-teal-50">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-teal-600 mb-2">95+</h3>
                  <p className="text-gray-700 font-medium">Local Rankings</p>
                  <p className="text-sm text-gray-600 mt-2">Keywords ranking in top 3 locally</p>
                </Card>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-orange-600">7 months</h4>
                  <p className="text-gray-600">Project Duration</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MousePointer className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-red-600">8.5%</h4>
                  <p className="text-gray-600">Booking Conversion Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-purple-600">180%</h4>
                  <p className="text-gray-600">Booking Increase</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-indigo-600">5 locations</h4>
                  <p className="text-gray-600">Multi-location Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge & Solution Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
                  <p className="text-gray-700 mb-6">
                    Scuba Diving Adventures operated five diving centers across popular tourist destinations but struggled with online visibility. Despite offering premium diving experiences, they were losing customers to competitors who dominated local search results.
                  </p>
                  
                  <div className="space-y-4">
                    <Card className="p-4 border-l-4 border-red-500">
                      <h4 className="font-bold text-red-700 mb-2">Poor Local Visibility</h4>
                      <p className="text-gray-600">Ranking page 3+ for local diving keywords</p>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-700 mb-2">Inconsistent NAP</h4>
                      <p className="text-gray-600">Name, address, phone inconsistencies across platforms</p>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-yellow-500">
                      <h4 className="font-bold text-yellow-700 mb-2">Limited Content</h4>
                      <p className="text-gray-600">Minimal location-specific content and reviews</p>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
                  <p className="text-gray-700 mb-6">
                    We implemented a comprehensive local SEO strategy focusing on multi-location optimization, Google My Business management, and location-specific content creation.
                  </p>
                  
                  <div className="space-y-4">
                    <Card className="p-4 border-l-4 border-green-500">
                      <h4 className="font-bold text-green-700 mb-2">Local SEO Optimization</h4>
                      <p className="text-gray-600">Multi-location GMB setup and citation building</p>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-700 mb-2">Content Strategy</h4>
                      <p className="text-gray-600">Location-specific landing pages and dive guides</p>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-700 mb-2">Review Management</h4>
                      <p className="text-gray-600">Systematic review acquisition and response strategy</p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Measurable Results</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">7-Month Performance Summary</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Local Traffic</span>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">+320%</span>
                        <p className="text-sm text-gray-500">8K → 33K visitors/month</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Online Bookings</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">+180%</span>
                        <p className="text-sm text-gray-500">Triple booking rate</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Revenue Growth</span>
                      <div className="text-right">
                        <span className="font-bold text-purple-600">$850K</span>
                        <p className="text-sm text-gray-500">Additional annual revenue</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Google Reviews</span>
                      <div className="text-right">
                        <span className="font-bold text-yellow-600">4.8/5</span>
                        <p className="text-sm text-gray-500">450+ reviews</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Local Rankings</span>
                      <div className="text-right">
                        <span className="font-bold text-teal-600">95+ top 3</span>
                        <p className="text-sm text-gray-500">Local keyword positions</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Conversion Rate</span>
                      <div className="text-right">
                        <span className="font-bold text-red-600">8.5%</span>
                        <p className="text-sm text-gray-500">Booking conversion rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-16 h-16 mx-auto mb-6 opacity-20" />
              <blockquote className="text-2xl font-medium mb-6">
                "BrandingBeez transformed our online presence completely. We went from being invisible in local search to dominating our markets. The ROI has been incredible - we've tripled our online bookings and our revenue has increased by $850K in just 7 months."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">Maria Santos</p>
                  <p className="opacity-90">Owner, Scuba Diving Adventures</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Dominate Your Local Market?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join hundreds of businesses that trust BrandingBeez for local SEO success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-teal-500 lue-600 eal-600 text-white">
                  Start Your Local SEO Campaign
                </Button>
                <Link href="/case-studies">
                  <Button size="lg" variant="outline" className="border-blue-500 text-blue-500 lue-50">
                    View More Case Studies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}