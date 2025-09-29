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
  Zap,
  Building,
  Quote
} from "lucide-react";

export default function TechForwardSolutionsCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  SaaS Platform Success Story
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  TechForward Solutions
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How our 12-person dedicated development team built an enterprise SaaS platform 
                  that scaled from concept to $45M ARR and successful IPO.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">850%</div>
                    <div className="text-sm text-white/80">User Growth</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">$45M</div>
                    <div className="text-sm text-white/80">ARR Achieved</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-green-600 hite/90">
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Link href="/case-studies">
                    <Button size="lg" variant="outline" className="border-white text-white hite reen-600">
                      View More Case Studies
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">TF</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    SaaS Platform
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>12-person dedicated development team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-white/80" />
                    <span>24-month development timeline</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-white/80" />
                    <span>Enterprise-grade SaaS platform</span>
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
                  TechForward Solutions, a growing B2B technology company, needed to build a comprehensive 
                  enterprise SaaS platform to compete with industry leaders. Their internal team lacked the 
                  specialized skills and capacity to develop such a complex system within their ambitious timeline.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Limited in-house development expertise for enterprise-scale applications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Aggressive 18-month timeline to launch and compete in the market</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Need for scalable architecture supporting millions of users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">Complex integrations with existing enterprise systems</span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Initial Situation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Development Capacity</span>
                      <span className="text-red-600 font-semibold">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Market Position</span>
                      <span className="text-red-600 font-semibold">Behind Leaders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Timeline Pressure</span>
                      <span className="text-red-600 font-semibold">High</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Internal Team Size</span>
                      <span className="text-red-600 font-semibold">4 Developers</span>
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
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Dedicated Team Composition</h2>
              <p className="text-xl text-gray-600">Carefully assembled 12-person team with specialized expertise</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Full-Stack Developers</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">4</p>
                  <p className="text-sm text-gray-600">Senior Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Building className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Backend Specialists</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">3</p>
                  <p className="text-sm text-gray-600">Lead Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">UI/UX Designers</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">2</p>
                  <p className="text-sm text-gray-600">Senior Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">DevOps Engineers</h3>
                  <p className="text-2xl font-bold text-brand-coral mb-1">2</p>
                  <p className="text-sm text-gray-600">Specialist Level</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">QA Engineers</h3>
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
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Implementation Process</h2>
              <p className="text-xl text-gray-600">Structured development approach delivering results at every milestone</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">Discovery & Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Architecture design & tech stack selection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">User research & competitor analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Development roadmap creation</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">Months 1-2</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">Core Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">MVP development & testing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Core features implementation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Integration with third-party systems</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-orange-100 text-orange-800">Months 3-12</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">Launch & Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Production deployment & monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Performance optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Feature expansion & scaling</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800">Months 13-24</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-teal-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Exceptional Results</h2>
              <p className="text-xl text-gray-600">Measurable business impact delivered within 24 months</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">850%</div>
                  <div className="text-gray-600">User Growth</div>
                  <div className="text-sm text-gray-500 mt-1">From 50K to 475K users</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$45M</div>
                  <div className="text-gray-600">ARR Achieved</div>
                  <div className="text-sm text-gray-500 mt-1">Within 18 months</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                  <div className="text-sm text-gray-500 mt-1">Enterprise-grade reliability</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">6 Months</div>
                  <div className="text-gray-600">Early Delivery</div>
                  <div className="text-sm text-gray-500 mt-1">Ahead of schedule</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Impact Highlights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Successful IPO valuation of $2.8 billion</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Market leadership position in enterprise SaaS</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Fortune 500 client acquisition rate of 85%</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Platform serves 2.3M+ enterprise users daily</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">ROI Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Investment</span>
                        <span className="font-semibold">$3.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue Generated</span>
                        <span className="font-semibold">$45M</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total ROI</span>
                          <span className="font-bold text-green-600">1,306%</span>
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
            <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardContent className="p-12">
                <Quote className="w-12 h-12 mx-auto mb-6 opacity-80" />
                <blockquote className="text-2xl font-light mb-8 leading-relaxed">
                  "BrandingBeez didn't just deliver a product – they delivered our future. Their dedicated team became an extension of our company, 
                  understanding our vision and executing it flawlessly. The platform they built became the foundation of our IPO success."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">MS</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Michael Stevens</div>
                    <div className="text-white/80">CEO & Founder, TechForward Solutions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Business?</h2>
            <p className="text-xl text-white/90 mb-8">
              Get your own dedicated development team and achieve exceptional results like TechForward Solutions.
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