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
  DollarSign,
  Globe,
  ShoppingCart,
  Quote
} from "lucide-react";

export default function EcoCommerceGlobalCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  E-commerce Expansion Success
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  EcoCommerce Global
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How our 6-person dedicated team scaled a sustainable e-commerce platform 
                  from local market to 15 international markets with 420% sales growth.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">420%</div>
                    <div className="text-sm text-white/80">Sales Growth</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-white/80">Countries</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-orange-600 hite/90">
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Link href="/case-studies">
                    <Button size="lg" variant="outline" className="border-white text-white hite range-600">
                      View More Case Studies
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">EC</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    E-commerce Platform
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>6-person dedicated e-commerce team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-white/80" />
                    <span>18-month expansion timeline</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-white/80" />
                    <span>Multi-market platform scaling</span>
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
                <h2 className="text-3xl font-bold text-brand-purple mb-6">The Challenge</h2>
                <p className="text-lg text-gray-600 mb-6">
                  EcoCommerce Global had built a successful sustainable products marketplace in their home market 
                  but faced significant technical and operational challenges when expanding internationally. Their 
                  existing platform couldn't handle multi-currency, multi-language, and complex international logistics.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Single-market platform architecture limiting international expansion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Complex international shipping and tax calculation requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Multi-currency payment processing and localization needs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Limited internal development resources for complex platform overhaul</span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Pre-Expansion Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Market Reach</span>
                      <span className="text-red-600 font-semibold">1 Country</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Platform Scalability</span>
                      <span className="text-red-600 font-semibold">Limited</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">International Features</span>
                      <span className="text-red-600 font-semibold">None</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Development Team</span>
                      <span className="text-red-600 font-semibold">3 Developers</span>
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
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Dedicated E-commerce Team</h2>
              <p className="text-xl text-gray-600">Specialized 6-person team focused on international e-commerce scaling</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">E-commerce Developers</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">2</p>
                  <p className="text-sm text-gray-600">Senior Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Full-Stack Developer</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Lead Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">UI/UX Designer</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Senior Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">SEO Specialist</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Specialist Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">QA Engineer</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">1</p>
                  <p className="text-sm text-gray-600">Senior Level</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Implementation Process Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">International Expansion Process</h2>
              <p className="text-xl text-gray-600">Systematic approach to scaling across multiple international markets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">Platform Restructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Multi-market architecture design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">International payment gateway setup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Multi-currency & tax system</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">Months 1-4</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">Market Launch</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Localization & language support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Regional SEO optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Phased market rollout</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-orange-100 text-orange-800">Months 5-12</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">Optimization & Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Performance optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Advanced analytics implementation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Continuous market expansion</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800">Months 13-18</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Outstanding Results</h2>
              <p className="text-xl text-gray-600">Successful international expansion with measurable business growth</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">420%</div>
                  <div className="text-gray-600">Sales Growth</div>
                  <div className="text-sm text-gray-500 mt-1">Across all markets</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                  <div className="text-gray-600">Countries</div>
                  <div className="text-sm text-gray-500 mt-1">Successfully launched</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">$8.2M</div>
                  <div className="text-gray-600">Annual Revenue</div>
                  <div className="text-sm text-gray-500 mt-1">International markets</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">65%</div>
                  <div className="text-gray-600">Conversion Rate</div>
                  <div className="text-sm text-gray-500 mt-1">Average improvement</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-orange-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">International Success Metrics</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Market leader in sustainable e-commerce across 5 countries</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>250K+ international customers acquired</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Multi-language platform serving 8 languages</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>98.5% international payment success rate</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Expansion ROI</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Investment</span>
                        <span className="font-semibold">$1.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">International Revenue</span>
                        <span className="font-semibold">$8.2M</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Expansion ROI</span>
                          <span className="font-bold text-orange-600">356%</span>
                        </div>
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
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardContent className="p-12">
                <Quote className="w-12 h-12 mx-auto mb-6 opacity-80" />
                <blockquote className="text-2xl font-light mb-8 leading-relaxed">
                  "The BrandingBeez team transformed our single-market business into a global e-commerce powerhouse. 
                  Their dedicated team understood both the technical complexities and market nuances needed for international success."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">ER</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Elena Rodriguez</div>
                    <div className="text-white/80">Founder & CEO, EcoCommerce Global</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Scale Internationally?</h2>
            <p className="text-xl text-white/90 mb-8">
              Get your own dedicated e-commerce team and expand to global markets like EcoCommerce Global.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-purple hite/90">
                Get Your Team Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/services/dedicated-resources">
                <Button size="lg" variant="outline" className="border-white text-white hite rand-purple">
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