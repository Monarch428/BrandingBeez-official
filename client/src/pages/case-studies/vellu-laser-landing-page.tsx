import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Clock,
  Target,
  Globe,
  Users,
  TrendingUp,
  Heart,
  Award,
  Timer,
  Building,
  Monitor,
  Smartphone,
  Search,
  Palette,
  Code,
  Star,
  Quote,
  ExternalLink,
  MessageSquare,
  Video,
  Phone,
  Mail,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
// Import the Vellu Laser screenshot
import velluScreenshot from "@assets/vellu-laser-screenshot.png";

// Smart Image Component with advanced features
function SmartImage({ 
  src, 
  alt, 
  className = "", 
  fallbackTitle = "Image", 
  fallbackDescription = "Unable to load image" 
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  // Normalize image path - handle relative paths and try WebP
  const normalizeImagePath = (path: string) => {
    // If it's already a processed import, use it directly
    if (path.startsWith('/') || path.startsWith('http') || path.includes('?')) {
      return path;
    }
    return path;
  };

  const handleLoad = () => {
    setImageState('loaded');
  };

  const handleError = () => {
    // Try WebP version if original fails and isn't already WebP
    if (!currentSrc.includes('.webp') && imageState !== 'error') {
      const webpSrc = currentSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (webpSrc !== currentSrc) {
        setCurrentSrc(webpSrc);
        return;
      }
    }
    setImageState('error');
  };

  if (imageState === 'loading') {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 ${className}`}>
        <div className="text-center p-8">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-pink-700 mb-2">Loading Image...</h3>
          <p className="text-pink-600 text-sm">Please wait while we load the content</p>
        </div>
      </div>
    );
  }

  if (imageState === 'error') {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 ${className}`}>
        <div className="text-center p-8">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">{fallbackTitle}</h3>
          <p className="text-red-600 text-sm mb-4">{fallbackDescription}</p>
          <p className="text-xs text-red-500">Image optimization in progress</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={normalizeImagePath(currentSrc)}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
}

export default function VelluLaserLandingPageCaseStudy() {
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
                  ⚡ High-Converting Landing Page Success
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Vellu Laser: 48-Hour Landing Page Delivery
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How we strengthened a long-term white-label partnership with AC Graphics Digital by delivering a conversion-focused landing page in record time.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">48hrs</div>
                    <div className="text-sm text-white/80">Delivery Time</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">High</div>
                    <div className="text-sm text-white/80">Conversion Focus</div>
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
                    Start Your Landing Page
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white p-2">
                    <div className="w-full h-full bg-pink-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                    Beauty & Wellness
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-4">Company Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-white/80" />
                    <span>Laser Beauty Services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>Premium Beauty Treatments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-white/80" />
                    <span>High-End Client Base</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Landing Page Screenshot Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                High-Converting Landing Page
              </h2>
              <p className="text-gray-600 text-lg">
                Conversion-focused design that captures leads and drives bookings for premium beauty services
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="aspect-video bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
                  <img
                    src={velluScreenshot}
                    alt="Vellu Laser Beauty Landing Page - High-converting design featuring laser hair removal services with modern UI and clear call-to-action buttons"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">Vellu Laser Beauty</p>
                    <p className="text-white/90 text-xs">High-Converting Landing Page</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <p className="text-pink-300 text-xs font-medium">Live Landing Page</p>
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
                  AC Graphics Digital needed a high-converting landing page for their client Vellu Laser with extremely tight deadlines and specific conversion requirements.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Extremely tight 48-hour deadline requirement
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Need for high-converting design for premium services
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Maintaining long-term partnership trust and quality
                    </span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    <h3 className="text-red-700">Project Requirements</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Timeline</span>
                      <span className="text-red-600 font-semibold">48 Hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Conversion Focus</span>
                      <span className="text-red-600 font-semibold">High Priority</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Design Quality</span>
                      <span className="text-red-600 font-semibold">Premium</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Partnership Stakes</span>
                      <span className="text-red-600 font-semibold">Long-term</span>
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
                Landing Page Development Strategy
              </h2>
              <p className="text-xl text-gray-600">
                Fast-track development process focused on conversions and quality
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
                    <h3 className="text-xl font-bold text-gray-900">Rapid Design Process</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">24-hour design phase</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Premium beauty aesthetic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Mobile-first approach</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-pink-100 text-pink-800">
                      Speed & Quality
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
                    <h3 className="text-xl font-bold text-gray-900">Conversion Optimization</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Strategic CTA placement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Trust signals integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Social proof elements</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      High Converting
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
                    <h3 className="text-xl font-bold text-gray-900">Partnership Excellence</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Real-time communication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Quality assurance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">On-time delivery</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-purple-100 text-purple-800">
                      Trust Building
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
                Exceptional delivery that strengthened partnership and delivered results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    48hrs
                  </div>
                  <div className="text-gray-600">Delivery Time</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Exactly on time
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-pink-600" />
                  </div>
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    High
                  </div>
                  <div className="text-gray-600">Conversion Rate</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Optimized design
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    Premium
                  </div>
                  <div className="text-gray-600">Quality Delivered</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Exceeded expectations
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    Strong
                  </div>
                  <div className="text-gray-600">Partnership</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Long-term trust
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-pink-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Quote className="w-12 h-12 text-pink-500 mb-4" />
                    <blockquote className="text-lg text-gray-700 mb-4">
                      "BrandingBeez once again proved why they're our go-to white-label partner. The Vellu Laser landing page was delivered exactly on time with exceptional quality. The conversion-focused design exceeded our client's expectations and strengthened our long-term friendship."
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">AC</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">AC Graphics Digital</div>
                        <div className="text-gray-600">Long-term White-Label Partner</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-pink-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-bold text-pink-700 mb-4">
                        Partnership Excellence
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Timeline</span>
                          <span className="text-pink-600 font-semibold">Perfect</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Quality</span>
                          <span className="text-pink-600 font-semibold">Premium</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Conversion Focus</span>
                          <span className="text-pink-600 font-semibold">High</span>
                        </div>
                      </div>
                      <Link href="/contact">
                        <Button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white">
                          Start Your Landing Page
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
              Need a High-Converting Landing Page Fast?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join agencies like AC Graphics Digital who trust BrandingBeez for rapid, high-quality landing page development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral">
                Start Your Landing Page
              </Button>
              {/* <Link href="/case-studies">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-brand-coral">
                  View More Case Studies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link> */}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}