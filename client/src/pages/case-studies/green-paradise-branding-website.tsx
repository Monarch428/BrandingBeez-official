import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import greenParadiseImage from "@assets/green-paradise-landscaping-updated.png";
import {
  ArrowRight,
  CheckCircle,
  Leaf,
  Palette,
  Globe,
  Target,
  Clock,
  TrendingUp,
  Users,
  Award,
  Building,
  Monitor,
  Smartphone,
  Search,
  Code,
  Star,
  Quote,
  ExternalLink,
  MessageSquare,
  Video,
  Zap,
  Phone,
  Mail,
  Eye,
  Shield,
  Camera,
  Sparkles,
} from "lucide-react";

export default function GreenParadiseBrandingWebsiteCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  🌿 Complete Brand + Website Development Success
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Green Paradise: Full 360° Digital Launch
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How we delivered complete branding and website development through white-label partnership with Mark, transforming a landscaping business with professional identity and digital presence.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">360°</div>
                    <div className="text-sm text-white/80">Complete Solution</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-white/80">Brand + Website</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-brand-purple hover:bg-white/90"
                    onClick={() =>
                      window.open(
                        "https://calendly.com/vignesh-velusamy/30min",
                        "_blank",
                      )
                    }
                  >
                    Start Your Brand Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white p-2">
                    <div className="w-full h-full bg-green-600 rounded-lg flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Landscaping & Gardening
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-white/80" />
                    <span>Local Landscaping Business</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>Complete Brand Identity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-white/80" />
                    <span>Professional WordPress Site</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand & Website Showcase Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Complete Brand Identity + WordPress Website
              </h2>
              <p className="text-gray-600 text-lg">
                Professional branding with logo design, color palette, and custom WordPress website
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="aspect-video bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
                  <img
                    src={greenParadiseImage}
                    alt="Green Paradise Landscaping - Brand and Website Development"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">Green Paradise Landscaping</p>
                    <p className="text-white/90 text-xs">Complete Brand Identity + WordPress Website</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300 text-xs font-medium">Live Brand & Website</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-brand-purple mb-6">
                  The Challenge
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  Green Paradise needed a complete digital transformation - from no brand identity to a professional online presence that would attract customers and build trust in their landscaping services.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      No brand identity or professional logo design
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Complete absence of digital presence and website
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Need for cohesive brand strategy and visual identity
                    </span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    <h3 className="text-red-700">Pre-Project Situation</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Brand Identity</span>
                      <span className="text-red-600 font-semibold">None</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Logo Design</span>
                      <span className="text-red-600 font-semibold">Missing</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Website</span>
                      <span className="text-red-600 font-semibold">No Online Presence</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Professional Image</span>
                      <span className="text-red-600 font-semibold">Undeveloped</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Strategy Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Complete Brand + Website Development Strategy
              </h2>
              <p className="text-xl text-gray-600">
                360° solution covering brand identity, visual design, and professional website development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">Brand Identity Design</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Professional logo design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Brand color palette</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Visual brand guidelines</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800">
                      Brand Foundation
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">WordPress Development</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Custom WordPress theme</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Responsive design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-green-500" />
                      <span className="text-sm">SEO optimization</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      Technical Excellence
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">White-Label Partnership</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Seamless collaboration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Quality delivery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Complete solution</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-purple-100 text-purple-800">
                      Partnership Success
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Project Results
              </h2>
              <p className="text-xl text-gray-600">
                Complete digital transformation with professional brand identity and website
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600">Brand Identity</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Complete transformation
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    Pro
                  </div>
                  <div className="text-gray-600">WordPress Site</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Custom developed
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    360°
                  </div>
                  <div className="text-gray-600">Solution</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Brand + Website
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    Perfect
                  </div>
                  <div className="text-gray-600">Partnership</div>
                  <div className="text-sm text-gray-500 mt-1">
                    White-label success
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Quote className="w-12 h-12 text-green-500 mb-4" />
                    <blockquote className="text-lg text-gray-700 mb-4">
                      "BrandingBeez delivered everything we needed for Green Paradise - from the logo design to the complete WordPress website. The brand identity is professional, the website is beautiful, and our client was thrilled with the results. This is exactly why we continue to work with them."
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">M</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Mark</div>
                        <div className="text-gray-600">White-Label Partner</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-bold text-green-700 mb-4">
                        Complete Success
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Brand Design</span>
                          <span className="text-green-600 font-semibold">Professional</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Website Development</span>
                          <span className="text-green-600 font-semibold">Custom WordPress</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Client Satisfaction</span>
                          <span className="text-green-600 font-semibold">Excellent</span>
                        </div>
                      </div>
                      <Link href="/contact">
                        <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">
                          Start Your Brand Project
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready for Complete Brand + Website Development?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join agencies like Mark who trust BrandingBeez for complete digital transformation solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral">
                  Start Your Brand Project
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