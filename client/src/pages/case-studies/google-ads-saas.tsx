import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Target, 
  TrendingUp, 
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  Zap,
  Globe
} from "lucide-react";

export default function GoogleAdsSaaSCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Section 1: Hero with Client Overview */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              Case Study: Google Ads Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TechFlow Analytics: 580% ROAS Achievement
            </h1>
            <p className="text-xl text-white/90 mb-8">
              How we transformed a struggling SaaS startup into a Google Ads success story with 
              data-driven campaigns and advanced targeting strategies
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">580%</div>
                <div className="text-sm text-white/80">ROAS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-white/80">CPA Reduction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">12K+</div>
                <div className="text-sm text-white/80">New Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">3 Months</div>
                <div className="text-sm text-white/80">To Profitability</div>
              </div>
            </div>

            <Button size="lg" className="bg-white text-brand-purple hite/90">
              Launch Your Google Ads Campaign
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
                  TechFlow Analytics was spending $15,000/month on Google Ads but getting only 2-3 qualified leads. 
                  Their CPA was $2,400 with a 0.6:1 ROAS, essentially burning money with broad targeting and poor landing pages.
                </p>
                <h3 className="text-xl font-bold text-brand-purple mb-4">Our Solution</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Advanced audience targeting and smart bidding strategies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Custom landing pages optimized for conversion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Comprehensive A/B testing and optimization</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">580%</div>
                    <div className="text-gray-600">ROAS</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <DollarSign className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">85%</div>
                    <div className="text-gray-600">CPA Reduction</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Users className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">12K+</div>
                    <div className="text-gray-600">New Users</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <BarChart3 className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">8.7%</div>
                    <div className="text-gray-600">Conversion Rate</div>
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
              "BrandingBeez saved our company. Within 90 days, they achieved a 580% ROAS and made us profitable."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="text-left">
                <div className="font-semibold text-brand-purple">Michael Chen</div>
                <div className="text-gray-600">CEO, TechFlow Analytics</div>
              </div>
            </div>
            <Button size="lg" className="bg-brand-purple rand-purple/90 text-white">
              Get Your Free Ads Audit
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
                Data-Driven Google Ads Strategy
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We completely restructured their campaigns with advanced targeting, 
                custom landing pages, and conversion optimization to maximize ROAS.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle>Advanced Targeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Custom intent audiences</li>
                    <li>• Competitor targeting</li>
                    <li>• Lookalike audiences</li>
                    <li>• Job title & company size targeting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle>Campaign Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Smart bidding strategies</li>
                    <li>• A/B testing all ad elements</li>
                    <li>• Negative keyword optimization</li>
                    <li>• Day-parting & geo-targeting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle>Landing Page CRO</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Custom landing pages per campaign</li>
                    <li>• Multi-step forms</li>
                    <li>• Social proof integration</li>
                    <li>• Mobile optimization</li>
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
              90-Day Transformation Timeline
            </h2>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-coral"></div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Week 1-2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Audit & Strategy</h3>
                    <p className="text-gray-600 mb-4">
                      Complete account audit, competitor analysis, keyword research, and audience development strategy.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Account Audit</Badge>
                      <Badge variant="outline">Keyword Research</Badge>
                      <Badge variant="outline">Audience Research</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Week 3-6
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Campaign Restructure</h3>
                    <p className="text-gray-600 mb-4">
                      Complete campaign restructure, custom landing page creation, and initial optimization setup.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Campaign Setup</Badge>
                      <Badge variant="outline">Landing Pages</Badge>
                      <Badge variant="outline">Tracking Setup</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Week 7-10
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Optimization & Testing</h3>
                    <p className="text-gray-600 mb-4">
                      Continuous A/B testing, bid optimization, audience refinement, and performance analysis.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">A/B Testing</Badge>
                      <Badge variant="outline">Bid Optimization</Badge>
                      <Badge variant="outline">Audience Refinement</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Week 11-12
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Scale & Automation</h3>
                    <p className="text-gray-600 mb-4">
                      Scaling successful campaigns, implementing automation rules, and establishing long-term strategy.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Campaign Scaling</Badge>
                      <Badge variant="outline">Automation</Badge>
                      <Badge variant="outline">Reporting</Badge>
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
                Exceptional Results in 90 Days
              </h2>
              <p className="text-xl text-gray-600">
                TechFlow Analytics transformed from losing money to achieving industry-leading ROAS
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">580%</div>
                  <div className="text-gray-600">ROAS</div>
                  <div className="text-sm text-gray-500 mt-1">Up from 60%</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                  <div className="text-gray-600">CPA Reduction</div>
                  <div className="text-sm text-gray-500 mt-1">$2,400 → $360</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">12,400</div>
                  <div className="text-gray-600">New Users</div>
                  <div className="text-sm text-gray-500 mt-1">In 90 days</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">8.7%</div>
                  <div className="text-gray-600">Conversion Rate</div>
                  <div className="text-sm text-gray-500 mt-1">Up from 0.3%</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-brand-purple mb-6">Additional Business Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Increased qualified leads by 650%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Reduced sales cycle length by 40%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Improved lead quality score by 85%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Expanded to 3 new geographic markets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Achieved breakeven within 3 months</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Scaled monthly revenue by 420%</span>
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
              "BrandingBeez saved our company. We were burning through cash with terrible Google Ads results. 
              Within 90 days, they not only made us profitable but achieved a 580% ROAS. 
              Our lead quality improved dramatically, and we're now scaling rapidly."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="text-left">
                <div className="font-semibold text-brand-purple">Michael Chen</div>
                <div className="text-gray-600">CEO, TechFlow Analytics</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Google Ads Performance?</h3>
              <p className="text-lg text-white/90 mb-6">
                Join TechFlow Analytics and hundreds of other businesses achieving exceptional ROAS with our Google Ads expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-brand-purple hite/90">
                  Get Your Free Ads Audit
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