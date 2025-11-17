import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Target,
  Smartphone,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  Users,
  Calendar,
  Layout,
  Code,
  Settings,
  Eye,
  MousePointer,
  Award,
  ExternalLink,
  MapPin,
  Building,
  Clock,
  Monitor,
  Palette,
  Search,
} from "lucide-react";
import { Link } from "wouter";

export default function SocialLandWebsiteCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              Website Development Success Story
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              SocialLand Digital: First UK Partnership Success
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Our first UK white-label project that sparked a 2-year partnership
              - delivering a professional, scalable WordPress website for a
              leading digital marketing agency
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Globe className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">UK Partnership</div>
                <div className="text-sm text-white/80">First White-Label</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">2-Year</div>
                <div className="text-sm text-white/80">Ongoing Partnership</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">Agency Growth</div>
                <div className="text-sm text-white/80">Digital Marketing</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-brand-purple ray-100"
                onClick={() =>
                  window.open(
                    "https://calendly.com/vignesh-velusamy/30min",
                    "_blank",
                  )
                }
              >
                Start Your Website
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white text-brand-purple hite lue-600"
                onClick={() =>
                  window.open("https://socialland.co.uk/", "_blank")
                }
              >
                Visit Live Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Website Snapshots Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Website Showcase
              </h2>
              <p className="text-gray-600 text-lg">
                Live snapshots of the SocialLand website we built
              </p>
            </div>

            <div className="grid lg:grid-cols-1 gap-12 mb-12">
              {/* Desktop View */}
              <Card className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Monitor className="w-6 h-6 text-brand-coral" />
                    <h3 className="text-xl font-bold">Desktop Experience</h3>
                  </div>
                  <p className="text-gray-600">
                    Clean, professional layout optimized for desktop users
                  </p>
                </div>

                <div className="aspect-video bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
                  <img
                    src="/images/social-land-homepage.png"
                    alt="SocialLand website homepage showing purple gradient design with 'Your Local Digital Marketing Experts in Essex' heading and comprehensive service offerings"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Card>

            </div>

            {/* Live Website Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() =>
                  window.open("https://socialland.co.uk/", "_blank")
                }
                className="bg-brand-coral hover:bg-brand-coral-dark"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Live Website at SocialLand.co.uk
              </Button>
            </div>
          </div>
        </section>

        {/* Client Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Project Overview
                </h2>
                <p className="text-gray-600 text-lg">
                  Understanding SocialLand's digital marketing agency needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-8 h-8 text-brand-coral" />
                    <h3 className="text-xl font-bold text-gray-900">Client Profile</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Digital marketing agency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>UK-based operations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Multiple service offerings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Professional brand focus</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-8 h-8 text-brand-purple" />
                    <h3 className="text-xl font-bold text-gray-900">Project Goals</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Professional agency website</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Scalable architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Service showcase platform</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple" />
                      <span>Client acquisition tool</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8 text-brand-coral" />
                    <h3 className="text-xl font-bold text-gray-900">Partnership Impact</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>First UK white-label project</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>2-year ongoing partnership</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Multiple client websites built</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-coral" />
                      <span>Dedicated resource team setup</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features & Solutions */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Website Features & Solutions
                </h2>
                <p className="text-gray-600 text-lg">
                  Clean, modern, and mobile-friendly WordPress website
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Core Features Delivered
                  </h3>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-8 bg-brand-coral rounded-lg flex items-center justify-center">
                          <Layout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Service-Focused Layouts
                          </h4>
                          <p className="text-gray-600">
                            Dedicated sections highlighting SocialLand's digital
                            marketing services with clear value propositions and
                            service descriptions.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Portfolio/Work Section
                          </h4>
                          <p className="text-gray-600">
                            Comprehensive showcase of past work and client success stories to
                            demonstrate agency capabilities and build trust.
                          </p>
                          <br className="hidden lg:block" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-8  bg-brand-purple rounded-lg flex items-center justify-center">
                          <MousePointer className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Contact Forms & CTA Placements
                          </h4>
                          <p className="text-gray-600">
                            Strategic placement of contact forms and
                            call-to-action buttons throughout the site to
                            maximize lead generation and conversions.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Technical Excellence
                  </h3>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-8  bg-brand-coral rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Speed Optimization
                          </h4>
                          <p className="text-gray-600">
                            Optimized loading times with compressed images,
                            minified code, and efficient caching strategies for
                            superior user experience.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-8  bg-brand-purple rounded-lg flex items-center justify-center">
                          <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Clarity & Agency Credibility
                          </h4>
                          <p className="text-gray-600">
                            Clear messaging, professional design elements, and
                            credibility indicators that position SocialLand as a
                            trusted agency partner.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-8  bg-brand-coral rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            Mobile-First Design
                          </h4>
                          <p className="text-gray-600">
                            Responsive design ensuring perfect functionality and
                            appearance across all devices, from smartphones to
                            desktop computers.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Evolution */}
        {/* <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Partnership Evolution
                </h2>
                <p className="text-gray-600 text-lg">
                  From first project to 2-year strategic partnership
                </p>
              </div>

              <div className="space-y-8">
                <Card className="p-8 border-l-4 border-brand-coral">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-coral rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Initial Project Success
                      </h3>
                      <p className="text-gray-600">
                        First UK white-label website project for SocialLand
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-13">
                    Delivered a professional, scalable WordPress website that
                    exceeded expectations. The clean, modern design focused on
                    speed, clarity, and agency credibility, establishing
                    BrandingBeez as a trusted development partner.
                  </p>
                </Card>

                <Card className="p-8 border-l-4 border-brand-purple">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Partnership Expansion
                      </h3>
                      <p className="text-gray-600">
                        Multiple client websites built for SocialLand's clients
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-13">
                    The initial success led to SocialLand partnering with us for
                    their client website projects, expanding our collaboration
                    beyond their own brand to include multiple client deliveries
                    under their agency umbrella.
                  </p>
                </Card>

                <Card className="p-8 border-l-4 border-brand-coral">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-coral rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Dedicated Resource Team
                      </h3>
                      <p className="text-gray-600">
                        Long-term strategic partnership with dedicated support
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-13">
                    Based on consistent results and trust, we established a
                    dedicated resource team specifically for SocialLand's UK
                    projects, ensuring streamlined communication and consistent
                    quality across all deliverables.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section> */}
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Partnership Evolution
              </h2>
              <p className="text-gray-600 text-lg">
                From first project to 2-year strategic partnership
              </p>
            </div>

            {/* Make all cards appear in a single responsive row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card className="p-8 border border-gray-200 rounded-xl flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-brand-coral rounded-full flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Initial Project Success
                    </h3>
                    <p className="text-gray-600 text-sm">
                      First UK white-label website project for SocialLand
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed tracking-normal text-left flex-grow">
                  Delivered a professional, scalable WordPress website that exceeded
                  expectations. The clean, modern design focused on speed, clarity, and
                  agency credibility — establishing BrandingBeez as a trusted development
                  partner.
                </p>
              </Card>

              {/* Card 2 */}
              <Card className="p-8 border border-gray-200 rounded-xl flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Partnership Expansion
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Multiple client websites built for SocialLand's clients
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed tracking-normal text-left flex-grow">
                  The initial success led to SocialLand partnering with us for their client
                  website projects — expanding collaboration beyond their own brand to
                  include multiple client deliveries under their agency umbrella.
                </p>
              </Card>

              {/* Card 3 */}
              <Card className="p-8 border border-gray-200 rounded-xl flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-brand-coral rounded-full flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Dedicated Resource Team
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Long-term strategic partnership with dedicated support
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed tracking-normal text-left flex-grow">
                  Based on consistent results and trust, we established a dedicated resource
                  team specifically for SocialLand's UK projects — ensuring streamlined
                  communication and consistent quality across all deliverables.
                </p>
              </Card>
            </div>



          </div>
        </section>

        {/* Client Testimonial */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Client Feedback
              </h2>

              <Card className="p-8 bg-white shadow-lg">
                <div className="flex justify-center mb-6">
                  <Quote className="w-12 h-12 text-brand-coral" />
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "BrandingBeez delivered exactly what we needed - a
                  professional website that represents our agency perfectly. The
                  partnership that followed has been invaluable to our growth."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Joe</p>
                    <p className="text-gray-600">Founder, SocialLand Digital</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your Professional Website?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join SocialLand and 100+ other agencies that trust BrandingBeez
              for their website development needs. Get a modern, scalable
              website that grows your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() =>
                  window.open(
                    "https://calendly.com/vignesh-velusamy/30min",
                    "_blank",
                  )
                }
                className="bg-white text-brand-coral hover:bg-gray-100"
              >
                Book Your Free Website Consultation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
