import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  Code,
  Shield,
  Zap
} from "lucide-react";

export default function DedicatedResourcesFintechCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Section 1: Hero with Client Overview */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              Case Study: Dedicated Development Team
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              PayFlow Systems: 8-Person Team Success
            </h1>
            <p className="text-xl text-white/90 mb-8">
              How a dedicated full-stack development team helped a fintech startup 
              scale from MVP to Series A with enterprise-grade infrastructure
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-white/80">Team Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">70%</div>
                <div className="text-sm text-white/80">Cost Savings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">$12M</div>
                <div className="text-sm text-white/80">Series A Raised</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">18 Months</div>
                <div className="text-sm text-white/80">Partnership</div>
              </div>
            </div>

            <Button size="lg" className="bg-white text-brand-purple hite/90">
              Build Your Dedicated Team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Analytics Screenshot Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Development Team Performance Metrics
              </h2>
              <p className="text-gray-600 text-lg">
                Project dashboard showing team productivity and milestone achievements
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="aspect-video bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden p-4">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border-2 border-dashed border-indigo-300 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-indigo-700 mb-2">
                        Team Performance Dashboard Placeholder
                      </h3>
                      <p className="text-indigo-600 mb-2">
                        Replace this section with project management dashboard
                      </p>
                      <p className="text-sm text-indigo-500">
                        Showing team metrics: 8 developers, 70% cost savings, $12M Series A
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">PayFlow Systems</p>
                    <p className="text-white/90 text-xs">Fintech Startup - Dedicated Team</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300 text-xs font-medium">18-Month Partnership Data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Challenge & Business Context */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-brand-purple mb-6">
                  The Challenge: Scaling Technical Capabilities
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    PayFlow Systems, a promising fintech startup focused on B2B payment processing, 
                    had a solid MVP but needed to rapidly scale their technical infrastructure to handle 
                    enterprise clients and meet strict financial compliance requirements.
                  </p>
                  <p>
                    Their founding team lacked the specialized skills needed for enterprise fintech development: 
                    security specialists, DevOps engineers, and compliance experts. Hiring in-house would cost 
                    $1.2M+ annually and take 6+ months.
                  </p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Security & Compliance Gaps</h4>
                      <p className="text-gray-600">SOC 2, PCI DSS, and GDPR compliance requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Code className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Technical Debt</h4>
                      <p className="text-gray-600">MVP architecture couldn't handle enterprise scale</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Time Pressure</h4>
                      <p className="text-gray-600">6-month deadline for Series A milestones</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-brand-purple mb-6">Client Background</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-semibold">Fintech (B2B Payments)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage:</span>
                    <span className="font-semibold">Series A Startup</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size:</span>
                    <span className="font-semibold">12 employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-semibold">$200K ARR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Duration:</span>
                    <span className="font-semibold">18 months ongoing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Team Composition & Roles */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Custom 8-Person Development Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We assembled a specialized team combining senior developers, security experts, 
                and DevOps professionals to meet PayFlow's unique fintech requirements.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg">Full-Stack Developers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-3">3 Senior Developers</div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• React/Node.js experts</li>
                    <li>• Microservices architecture</li>
                    <li>• API development</li>
                    <li>• Database optimization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg">Security Specialists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-3">2 Security Engineers</div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• SOC 2 compliance</li>
                    <li>• PCI DSS implementation</li>
                    <li>• Penetration testing</li>
                    <li>• Security auditing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg">DevOps Engineers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-3">2 DevOps Experts</div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• AWS infrastructure</li>
                    <li>• CI/CD pipelines</li>
                    <li>• Kubernetes orchestration</li>
                    <li>• Monitoring & logging</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg">Project Manager</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-3">1 Senior PM</div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Agile methodology</li>
                    <li>• Stakeholder communication</li>
                    <li>• Risk management</li>
                    <li>• Delivery coordination</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Implementation Process & Methodology */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-purple mb-12 text-center">
              18-Month Development Journey
            </h2>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-coral"></div>
              
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Q1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Foundation & Security</h3>
                    <p className="text-gray-600 mb-4">
                      Complete system architecture redesign, security framework implementation, and compliance groundwork.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Technical Deliverables:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Microservices architecture</li>
                          <li>• Security framework</li>
                          <li>• Database redesign</li>
                          <li>• API gateway setup</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Compliance Achievements:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• SOC 2 Type I preparation</li>
                          <li>• PCI DSS Level 1 planning</li>
                          <li>• GDPR compliance audit</li>
                          <li>• Security policies documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Q2-Q3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Core Platform Development</h3>
                    <p className="text-gray-600 mb-4">
                      Enterprise-grade payment processing platform with advanced features and scalable infrastructure.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Platform Features:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Multi-currency processing</li>
                          <li>• Real-time fraud detection</li>
                          <li>• Advanced reporting dashboard</li>
                          <li>• White-label client portals</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Infrastructure:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Auto-scaling AWS deployment</li>
                          <li>• 99.99% uptime achievement</li>
                          <li>• Global CDN implementation</li>
                          <li>• Disaster recovery setup</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    Q4-Q6
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-purple mb-2">Enterprise Features & Optimization</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced enterprise features, performance optimization, and Series A preparation milestones.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Enterprise Features:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Custom API integrations</li>
                          <li>• Advanced analytics engine</li>
                          <li>• Enterprise security controls</li>
                          <li>• Bulk processing capabilities</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Milestones Achieved:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• SOC 2 Type II certification</li>
                          <li>• 10M+ transactions processed</li>
                          <li>• 50+ enterprise clients onboarded</li>
                          <li>• Series A funding secured</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Technical Achievements & Business Impact */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Transformational Business Results
              </h2>
              <p className="text-xl text-gray-600">
                PayFlow Systems evolved from startup to industry leader with enterprise-grade infrastructure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">$12M</div>
                  <div className="text-gray-600">Series A Raised</div>
                  <div className="text-sm text-gray-500 mt-1">18-month timeline</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">2,400%</div>
                  <div className="text-gray-600">Revenue Growth</div>
                  <div className="text-sm text-gray-500 mt-1">$200K to $5M ARR</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">70%</div>
                  <div className="text-gray-600">Cost Savings</div>
                  <div className="text-sm text-gray-500 mt-1">vs in-house hiring</div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">99.99%</div>
                  <div className="text-gray-600">Uptime</div>
                  <div className="text-sm text-gray-500 mt-1">Enterprise SLA</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8">
                <h3 className="text-xl font-bold text-brand-purple mb-6">Technical Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Processed 10M+ transactions successfully</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Achieved SOC 2 Type II certification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Zero security incidents in 18 months</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Sub-100ms API response times</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Auto-scaling to 10x traffic spikes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <h3 className="text-xl font-bold text-brand-purple mb-6">Business Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Onboarded 50+ enterprise clients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Expanded to 12 international markets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Hired 25 additional employees</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Became market leader in B2B payments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Preparing for Series B funding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Long-term Partnership & Testimonial */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl font-medium text-gray-900 mb-8">
              "BrandingBeez didn't just provide developers - they became our technical co-founders. 
              Their dedicated team helped us scale from a simple MVP to an enterprise-grade platform 
              that secured our Series A. We couldn't have achieved this growth without their expertise."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="text-left">
                <div className="font-semibold text-brand-purple">David Kim</div>
                <div className="text-gray-600">CTO & Co-founder, PayFlow Systems</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-brand-purple mb-4">Ongoing Partnership</h3>
              <p className="text-gray-600 mb-4">
                18 months later, our dedicated team continues to support PayFlow Systems as they scale 
                towards their Series B and international expansion. The partnership has evolved into 
                a strategic technology alliance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-brand-purple">Current Team</div>
                  <div className="text-gray-600">12 dedicated resources</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-brand-purple">Next Phase</div>
                  <div className="text-gray-600">Series B preparation</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-brand-purple">Expansion</div>
                  <div className="text-gray-600">5 new markets</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Scale Your Startup?</h3>
              <p className="text-lg text-white/90 mb-6">
                Join PayFlow Systems and hundreds of other startups that have achieved rapid growth 
                with our dedicated development teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-brand-purple ray-100 rand-purple">
                  Build Your Dedicated Team
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hite rand-purple">
                  Calculate Your Savings
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