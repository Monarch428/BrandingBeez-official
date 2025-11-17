import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  Smartphone,
  Zap,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  Users,
  Calendar,
  Globe,
  TrendingUp,
  Settings,
  Eye,
  MousePointer,
  Clock,
} from "lucide-react";
import { Link } from "wouter";

export default function WebDevelopmentCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main className="pt-0 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-6 text-lg px-4 py-2">
                Web Development Success Story
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                E-Commerce Plus
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Complete platform rebuild that increased conversions by 280% and
                revenue by 150%
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>280% Conversion Increase</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>150% Revenue Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>70% Faster Load Times</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Screenshot Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Website Performance Analytics
              </h2>
              <p className="text-gray-600 text-lg">
                Real performance data showing 280% conversion increase and 150% revenue growth
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="aspect-video bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden p-4">
                  <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-dashed border-green-300 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-green-700 mb-2">
                        Analytics Screenshot Placeholder
                      </h3>
                      <p className="text-green-600 mb-2">
                        Replace this section with website analytics screenshot
                      </p>
                      <p className="text-sm text-green-500">
                        Showing e-commerce performance: 280% conversion increase
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">E-Commerce Plus</p>
                    <p className="text-white/90 text-xs">E-Commerce Platform</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300 text-xs font-medium">Website Performance Data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Highlights */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Project Highlights
                </h2>
                <p className="text-gray-600 text-lg">
                  Key achievements from this e-commerce transformation
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center p-8 border-2 border-blue-200 bg-blue-50">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">
                    280%
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Conversion Rate Increase
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    From 1.2% to 4.5% conversion rate
                  </p>
                </Card>

                <Card className="text-center p-8 border-2 border-green-200 bg-green-50">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-600 mb-2">
                    150%
                  </h3>
                  <p className="text-gray-700 font-medium">Revenue Growth</p>
                  <p className="text-sm text-gray-600 mt-2">
                    $3.2M additional annual revenue
                  </p>
                </Card>

                <Card className="text-center p-8 border-2 border-purple-200 bg-purple-50">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-purple-600 mb-2">
                    70%
                  </h3>
                  <p className="text-gray-700 font-medium">Faster Load Times</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Page load speed: 6.2s → 1.8s
                  </p>
                </Card>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-orange-600">
                    12 weeks
                  </h4>
                  <p className="text-gray-600">Development Time</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-red-600">95%</h4>
                  <p className="text-gray-600">Mobile Performance Score</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-teal-600">45%</h4>
                  <p className="text-gray-600">Lower Bounce Rate</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MousePointer className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-2xl text-indigo-600">85%</h4>
                  <p className="text-gray-600">User Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Client History */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  About E-Commerce Plus
                </h2>
                <p className="text-gray-600 text-lg">
                  Understanding our client's business and growth objectives
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        E-Commerce Plus
                      </h3>
                      <p className="text-gray-600">
                        Fashion & Lifestyle E-commerce
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">25-50 employees</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Founded in 2015</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">
                        Fashion and lifestyle products
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">
                        Serving customers nationwide
                      </span>
                    </div>
                  </div>
                </div>

                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-4 text-gray-900">
                    Company Background
                  </h4>
                  <p className="text-gray-700 mb-4">
                    E-Commerce Plus is a mid-sized fashion and lifestyle
                    retailer that has been serving customers online since 2015.
                    Starting as a small boutique, they had grown to carry over
                    500 brands and 10,000+ products across fashion, accessories,
                    and home goods.
                  </p>
                  <p className="text-gray-700 mb-4">
                    However, their original website was built on an outdated
                    platform that couldn't handle their growth. With increasing
                    traffic and inventory, they were experiencing frequent
                    downtime, slow load speeds, and a poor mobile experience
                    that was costing them sales.
                  </p>
                  <p className="text-gray-700">
                    They needed a complete platform overhaul to support their
                    ambitious growth plans and provide a seamless shopping
                    experience across all devices.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Problem Identification */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Technical Challenges
                </h2>
                <p className="text-gray-600 text-lg">
                  Critical issues affecting user experience and business growth
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="p-6 border-l-4 border-red-500">
                    <h3 className="font-bold text-lg mb-3 text-red-700">
                      Performance Issues
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Average page load time: 6.2 seconds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Poor mobile performance (30/100 score)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Frequent site crashes during peak traffic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Unoptimized image loading</span>
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-6 border-l-4 border-orange-500">
                    <h3 className="font-bold text-lg mb-3 text-orange-700">
                      User Experience Problems
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>Confusing navigation and product discovery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>Complicated checkout process (7 steps)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>Poor search functionality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>No product filtering or sorting options</span>
                      </li>
                    </ul>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 border-l-4 border-yellow-500">
                    <h3 className="font-bold text-lg mb-3 text-yellow-700">
                      Mobile & Responsive Issues
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>Non-responsive design (mobile unfriendly)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>Broken layout on tablets and phones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>Difficult mobile checkout process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>No touch-optimized interactions</span>
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-6 border-l-4 border-purple-500">
                    <h3 className="font-bold text-lg mb-3 text-purple-700">
                      Business Impact
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>High cart abandonment rate (78%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>Low conversion rate (1.2%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>Lost sales during peak seasons</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>Poor customer satisfaction scores</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Solutions & Results */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Development Solutions
                </h2>
                <p className="text-gray-600 text-lg">
                  Modern technology stack and user-centered design approach
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Technical Solutions Delivered
                  </h3>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Modern Tech Stack
                          </h4>
                          <p className="text-gray-600">
                            Next.js, React, TypeScript, and Shopify Plus for
                            scalable, high-performance e-commerce.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Mobile-First Design
                          </h4>
                          <p className="text-gray-600">
                            Completely responsive design optimized for mobile
                            commerce and touch interactions.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Performance Optimization
                          </h4>
                          <p className="text-gray-600">
                            Advanced caching, CDN integration, and optimized
                            images for lightning-fast load times.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Streamlined UX
                          </h4>
                          <p className="text-gray-600">
                            Simplified 3-step checkout, advanced search, and
                            intuitive product discovery features.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Performance Results
                  </h3>

                  <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                    <h4 className="font-bold text-lg mb-4 text-blue-700">
                      12-Week Development Results
                    </h4>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Conversion Rate</span>
                        <div className="text-right">
                          <span className="font-bold text-green-600">
                            +280%
                          </span>
                          <p className="text-sm text-gray-500">1.2% → 4.5%</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Page Load Speed</span>
                        <div className="text-right">
                          <span className="font-bold text-blue-600">-70%</span>
                          <p className="text-sm text-gray-500">6.2s → 1.8s</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Mobile Performance
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-purple-600">
                            95/100
                          </span>
                          <p className="text-sm text-gray-500">From 30/100</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Cart Abandonment</span>
                        <div className="text-right">
                          <span className="font-bold text-orange-600">
                            -45%
                          </span>
                          <p className="text-sm text-gray-500">78% → 33%</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Annual Revenue</span>
                        <div className="text-right">
                          <span className="font-bold text-red-600">+150%</span>
                          <p className="text-sm text-gray-500">
                            $3.2M additional
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">User Satisfaction</span>
                        <div className="text-right">
                          <span className="font-bold text-teal-600">85%</span>
                          <p className="text-sm text-gray-500">
                            4.2/5 average rating
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

        {/* Section 5: Tools & Technologies */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Technology Stack & Tools
                </h2>
                <p className="text-gray-600 text-lg">
                  Modern development tools and frameworks used in this project
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Code className="w-8 h-8 text-blue-600" />
                    <h3 className="font-bold text-lg">Frontend Development</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Next.js 13 with App Router</li>
                    <li>• React 18 with TypeScript</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Framer Motion for animations</li>
                    <li>• React Query for state management</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-8 h-8 text-green-600" />
                    <h3 className="font-bold text-lg">
                      Backend & Infrastructure
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Shopify Plus for e-commerce</li>
                    <li>• Vercel for hosting & deployment</li>
                    <li>• Cloudflare CDN for performance</li>
                    <li>• Stripe for payment processing</li>
                    <li>• MongoDB for custom data</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                    <h3 className="font-bold text-lg">
                      Performance & Analytics
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Google Analytics 4</li>
                    <li>• Hotjar for user behavior</li>
                    <li>• Lighthouse for performance</li>
                    <li>• Sentry for error tracking</li>
                    <li>• GTMetrix for speed testing</li>
                  </ul>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
                  <h3 className="font-bold text-xl mb-4 text-center">
                    Our Development Process
                  </h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h4 className="font-bold mb-2">Discovery & Planning</h4>
                      <p className="text-sm text-gray-600">
                        Requirements analysis and technical architecture
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h4 className="font-bold mb-2">Design & Prototyping</h4>
                      <p className="text-sm text-gray-600">
                        User experience design and interactive prototypes
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h4 className="font-bold mb-2">Development & Testing</h4>
                      <p className="text-sm text-gray-600">
                        Agile development with continuous testing
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <h4 className="font-bold mb-2">Launch & Optimization</h4>
                      <p className="text-sm text-gray-600">
                        Deployment, monitoring, and performance tuning
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Testimonials & Results */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Client Success Story
                </h2>
                <p className="text-gray-600 text-lg">
                  Testimonial and visual proof of transformation results
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Card className="p-8 relative">
                  <Quote className="w-12 h-12 text-blue-200 absolute top-4 left-4" />
                  <div className="relative z-10">
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      "The new website has completely transformed our business.
                      We went from a clunky, slow platform that was driving
                      customers away to a beautiful, fast, and intuitive
                      e-commerce experience that converts incredibly well."
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      "The team at BrandingBeez didn't just build us a website –
                      they built us a revenue-generating machine. Our conversion
                      rates have nearly tripled, and we're seeing 150% more
                      revenue. The ROI has been phenomenal."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">MW</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Michael Wilson
                        </p>
                        <p className="text-gray-600">
                          Founder, E-Commerce Plus
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h4 className="font-bold text-lg mb-4">
                      Before vs After Performance
                    </h4>
                    <div className="bg-gradient-to-r from-red-100 to-green-100 h-40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-2">
                          <div className="text-red-600">
                            <p className="font-bold">Before</p>
                            <p className="text-sm">1.2% conversion</p>
                          </div>
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                          <div className="text-green-600">
                            <p className="font-bold">After</p>
                            <p className="text-sm">4.5% conversion</p>
                          </div>
                        </div>
                        <p className="text-gray-700 font-bold">
                          280% Improvement
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="font-bold text-lg mb-4">
                      Mobile Performance Score
                    </h4>
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 h-40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-blue-700 font-bold">
                          95/100 Performance Score
                        </p>
                        <p className="text-blue-600 text-sm">
                          Mobile-optimized and lightning fast
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Card className="p-8 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Transform Your E-commerce?
                  </h3>
                  <p className="text-lg mb-6 text-white/90">
                    Join successful businesses that have revolutionized their
                    online presence with our custom development solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <Button
                        size="lg"
                        className="bg-white text-brand-purple ray-100"
                      >
                        Start Your Development Project
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/services/web-development">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-brand-purple"
                      >
                        View Our Development Services
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
