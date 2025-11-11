import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle,
  Leaf,
  Globe,
  Users,
  Target,
  Clock,
  TrendingUp,
  Phone,
  Mail,
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
  Zap,
} from "lucide-react";
// Image imported directly in the component

export default function TSLandscapingCaseStudy() {
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
                  🌿 Website Development Case Study
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  TS Landscaping NC: From Offline to Online Success
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  How a white-label partnership with Whitney Hill transformed a local landscaping business with a professional website that captures leads and builds trust with customers.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-white/80">Professional Presence</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">48hrs</div>
                    <div className="text-sm text-white/80">Delivery Time</div>
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
                    Start Your Website
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
                    Landscaping Services
                  </Badge>
                </div>
                <p className="text-xl font-bold mb-4">Company Overview</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-white/80" />
                    <span>North Carolina Based</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/80" />
                    <span>Local Landscaping Specialist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-white/80" />
                    <span>Residential & Commercial</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Website Screenshot Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Professional Website Development - Raleigh, NC
              </h2>
              <p className="text-gray-600 text-lg">
                Clean, professional design that showcases landscaping services and captures leads
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden relative">
                  {/* Actual TS Landscaping Website Screenshot */}
                  <picture>
                    <source srcSet="/images/ts-landscaping-full-website.webp" type="image/webp" />
                    <img
                      src="/images/ts-landscaping-full-website.png"
                      alt="Twins Solutions Landscaping website featuring modern home with professional landscaping design, large scale landscaping services in Raleigh NC"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  </picture>
                  {/* Fallback placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center" style={{ display: 'none' }}>
                    <div className="text-center">
                      <Monitor className="w-16 h-16 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Twins Solutions Landscaping</p>
                    </div>
                  </div>
                  
                  {/* Overlay info */}
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">Twins Solutions Landscaping</p>
                    <p className="text-white/90 text-xs">Professional Website Development - Raleigh, NC</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300 text-xs font-medium">Live Website</p>
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
                  TS Landscaping NC was a thriving local business with no digital presence. 
                  They needed a professional website to showcase their services and capture leads online.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      No online presence to showcase landscaping portfolio
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Missing digital lead capture system
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <span className="text-gray-600">
                      Competitors had established online presence
                    </span>
                  </li>
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    <h3 className="text-red-700">Pre-Website Situation</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Online Presence</span>
                      <span className="text-red-600 font-semibold">None</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Lead Generation</span>
                      <span className="text-red-600 font-semibold">Word of Mouth Only</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Professional Image</span>
                      <span className="text-red-600 font-semibold">Limited</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Service Showcase</span>
                      <span className="text-red-600 font-semibold">Not Available</span>
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
                Website Development Strategy
              </h2>
              <p className="text-xl text-gray-600">
                Professional website solution delivered through white-label partnership
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
                    <h3 className="text-xl font-bold text-gray-900">Professional Design</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Clean, modern layout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Mobile responsive design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-green-500" />
                      <span className="text-sm">WordPress development</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800">
                      Visual Excellence
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
                    <h3 className="text-xl font-bold text-gray-900">Service Showcase</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Portfolio gallery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Service descriptions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Customer testimonials</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      Content Strategy
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
                    <h3 className="text-xl font-bold text-gray-900">Lead Capture System</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Contact forms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Quote request system</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Local SEO optimization</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Badge className="bg-purple-100 text-purple-800">
                      Lead Generation
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
                Professional website delivered on time with all requirements met
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
                    Fast turnaround
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600">Professional</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Online presence
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    Lead
                  </div>
                  <div className="text-gray-600">Capture System</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Active & working
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    Happy
                  </div>
                  <div className="text-gray-600">Client Partnership</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Whitney Hill satisfied
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
                      "BrandingBeez delivered exactly what we needed for our client. The website was professional, 
                      fast to load, and perfectly captured the landscaping business's services. The 48-hour delivery 
                      was impressive and helped us maintain our client relationship."
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">WH</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Whitney Hill</div>
                        <div className="text-gray-600">White-Label Partner</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-bold text-green-700 mb-4">
                        Partnership Success
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Delivery</span>
                          <span className="text-green-600 font-semibold">On Time</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Quality</span>
                          <span className="text-green-600 font-semibold">Professional</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Communication</span>
                          <span className="text-green-600 font-semibold">Excellent</span>
                        </div>
                      </div>
                      <Link href="/contact">
                        <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">
                          Start Your Website Project
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
              Ready to Launch Your Professional Website?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join hundreds of agencies and businesses that trust BrandingBeez for their website development needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral">
                  Start Your Website Project
                </Button>
              </Link>
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