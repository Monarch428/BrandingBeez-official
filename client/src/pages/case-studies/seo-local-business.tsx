import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Search, 
  TrendingUp, 
  MapPin,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  Star,
  Phone
} from "lucide-react";

export default function SEOLocalBusinessCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Section 1: Hero with Client Overview */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              Case Study: Local SEO Success
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Coastal Dental Group: 450% Lead Increase
            </h1>
            <p className="text-xl text-white/90 mb-8">
              How we transformed a struggling dental practice into the #1 ranked dental clinic 
              in their city through strategic local SEO optimization
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">450%</div>
                <div className="text-sm text-white/80">Lead Increase</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">#1</div>
                <div className="text-sm text-white/80">Google Ranking</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">380%</div>
                <div className="text-sm text-white/80">Organic Traffic</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">6 Months</div>
                <div className="text-sm text-white/80">To Page 1</div>
              </div>
            </div>

            <Button size="lg" className="bg-white text-brand-purple hite/90">
              Boost Your Local Rankings
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Challenge & Solution */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-brand-purple mb-6">The Challenge</h2>
                <p className="text-gray-600 mb-6">
                  Coastal Dental Group was invisible online despite 25 years of excellent service. 
                  They ranked on page 3+ for local searches, had inconsistent listings across directories, 
                  and only 8 Google reviews compared to competitors with 200+.
                </p>
                <h3 className="text-xl font-bold text-brand-purple mb-4">Our Solution</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Complete local SEO overhaul with technical optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Google Business Profile optimization and citation building</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Strategic review generation and reputation management</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">450%</div>
                    <div className="text-gray-600">Lead Increase</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Search className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">#1</div>
                    <div className="text-gray-600">Google Ranking</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Users className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">380%</div>
                    <div className="text-gray-600">Organic Traffic</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Star className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">4.9</div>
                    <div className="text-gray-600">Google Rating</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial & CTA */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl font-medium text-gray-900 mb-8">
              "BrandingBeez transformed our practice. We became the #1 dental practice in Newport Beach."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="text-left">
                <div className="font-semibold text-brand-purple">Dr. Jennifer Martinez</div>
                <div className="text-gray-600">Owner, Coastal Dental Group</div>
              </div>
            </div>
            <Button size="lg" className="bg-brand-purple rand-purple/90 text-white">
              Get Your Free SEO Audit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Comprehensive Local SEO Strategy
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We implemented a complete local SEO overhaul including technical optimization, 
                content strategy, and reputation management to dominate local search results.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle>Technical SEO Overhaul</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Complete website restructure</li>
                    <li>• Schema markup implementation</li>
                    <li>• Core Web Vitals optimization</li>
                    <li>• Mobile-first indexing prep</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle>Local Listings Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Google Business Profile optimization</li>
                    <li>• 50+ directory submissions</li>
                    <li>• NAP consistency across web</li>
                    <li>• Local citation building</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle>Reputation Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Review generation campaigns</li>
                    <li>• Review response management</li>
                    <li>• Patient testimonial collection</li>
                    <li>• Crisis reputation monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Implementation Timeline */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-purple mb-12 text-center">
              6-Month SEO Implementation Plan
            </h2>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-coral"></div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Month 1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Foundation & Technical SEO</h3>
                    <p className="text-gray-600 mb-4">
                      Complete website audit, technical fixes, Google Business Profile optimization, and initial keyword research.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Technical Audit</Badge>
                      <Badge variant="outline">GBP Setup</Badge>
                      <Badge variant="outline">Keyword Research</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Month 2-3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Content & On-Page Optimization</h3>
                    <p className="text-gray-600 mb-4">
                      Local content creation, service page optimization, schema markup implementation, and citation building.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Content Creation</Badge>
                      <Badge variant="outline">On-Page SEO</Badge>
                      <Badge variant="outline">Citations</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Month 4-5
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Review Generation & Link Building</h3>
                    <p className="text-gray-600 mb-4">
                      Aggressive review campaign, local link building, partnership development, and community engagement.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Review Campaign</Badge>
                      <Badge variant="outline">Link Building</Badge>
                      <Badge variant="outline">Partnerships</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Month 6
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Optimization & Scaling</h3>
                    <p className="text-gray-600 mb-4">
                      Performance analysis, advanced optimization, competitive expansion, and long-term strategy implementation.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Performance Analysis</Badge>
                      <Badge variant="outline">Advanced Optimization</Badge>
                      <Badge variant="outline">Scaling Strategy</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Results & Impact */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Dominant Local Search Results
              </h2>
              <p className="text-xl text-gray-600">
                Coastal Dental Group became the #1 ranked dental practice in Newport Beach
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">450%</div>
                  <div className="text-gray-600">Lead Increase</div>
                  <div className="text-sm text-gray-500 mt-1">From 8 to 44 monthly</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">#1</div>
                  <div className="text-gray-600">Google Ranking</div>
                  <div className="text-sm text-gray-500 mt-1">For 23 local keywords</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">380%</div>
                  <div className="text-gray-600">Organic Traffic</div>
                  <div className="text-sm text-gray-500 mt-1">Monthly website visits</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">4.9</div>
                  <div className="text-gray-600">Google Rating</div>
                  <div className="text-sm text-gray-500 mt-1">From 187 reviews</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-brand-purple mb-6">Additional Business Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Increased new patient appointments by 520%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Expanded service area to 3 neighboring cities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Reduced patient acquisition cost by 67%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Increased practice revenue by 340%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Hired 3 additional dental hygienists</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Extended hours to meet demand</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Testimonial & Next Steps */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl font-medium text-gray-900 mb-8">
              "BrandingBeez completely transformed our practice. We went from being invisible online 
              to ranking #1 for dental searches in our area. Our patient flow has increased dramatically, 
              and we're now the go-to dental practice in Newport Beach."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="text-left">
                <div className="font-semibold text-brand-purple">Dr. Jennifer Martinez</div>
                <div className="text-gray-600">Owner, Coastal Dental Group</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Dominate Local Search Results?</h3>
              <p className="text-lg text-white/90 mb-6">
                Join Coastal Dental Group and hundreds of other local businesses achieving #1 rankings with our proven SEO strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-brand-purple hite/90">
                  Get Your Free SEO Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hite rand-purple">
                  View More Case Studies
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