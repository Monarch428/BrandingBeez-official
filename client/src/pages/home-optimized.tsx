import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SchemaMarkup } from "@/components/schema-markup";
import { PerformanceOptimizer } from "@/components/performance-optimizer";
import { ContactFormOptimized } from "@/components/contact-form-optimized";
import { OptimizedCTAButton, PrimaryCTAButton, SecondaryCTAButton } from "@/components/cta-button-optimized";
import { LeadCaptureOptimized, SidebarLeadCapture } from "@/components/lead-capture-optimized";
import { InternalLinkingOptimized, BreadcrumbNavigation } from "@/components/internal-linking-optimized";
import { LocalSEOOptimized } from "@/components/local-seo-optimized";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import { 
  Search, 
  Code, 
  BarChart3, 
  Zap, 
  Target, 
  Shield, 
  Star, 
  Users, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Phone,
  Mail,
  Globe,
  Rocket,
  Heart,
  MessageCircle,
  Building
} from "lucide-react";

export default function HomeOptimized() {
  const { regionConfig } = useRegion();

  const services = [
    {
      icon: <Search className="w-8 h-8 text-brand-coral" />,
      title: "SEO Services",
      description: "Dominate search rankings with our proven SEO strategies",
      features: ["Keyword Research", "On-Page SEO", "Link Building", "Local SEO"],
      link: "/services/seo",
      badge: "Most Popular"
    },
    {
      icon: <Code className="w-8 h-8 text-brand-coral" />,
      title: "Web Development",
      description: "Custom websites that convert visitors into customers",
      features: ["Responsive Design", "Fast Loading", "SEO Optimized", "Mobile First"],
      link: "/services/web-development",
      badge: "Premium"
    },
    {
      icon: <Target className="w-8 h-8 text-brand-coral" />,
      title: "Google Ads",
      description: "Profitable PPC campaigns that drive qualified leads",
      features: ["Campaign Setup", "Keyword Research", "Ad Creation", "ROI Tracking"],
      link: "/services/google-ads",
      badge: "Results-Driven"
    },
    {
      icon: <Zap className="w-8 h-8 text-brand-coral" />,
      title: "Business Automation",
      description: "Streamline operations and save time with smart automation",
      features: ["Workflow Automation", "CRM Integration", "Email Marketing", "Analytics"],
      link: "/services/ai-development",
      badge: "Enterprise"
    }
  ];

  const caseStudies = [
    {
      client: "Urban Style Boutique",
      industry: "E-commerce",
      challenge: "Low organic traffic and poor conversion rates",
      solution: "Comprehensive SEO strategy and website optimization",
      results: {
        traffic: "+340%",
        conversions: "+278%",
        revenue: "+$450K"
      },
      timeline: "6 months",
      testimonial: "BrandingBeez transformed our online presence completely. We went from struggling to get noticed to dominating our local market."
    },
    {
      client: "Coastal Dining Group",
      industry: "Restaurant",
      challenge: "Multiple locations needed unified digital presence",
      solution: "Local SEO optimization and Google Ads management",
      results: {
        traffic: "+280%",
        conversions: "+195%",
        revenue: "+$320K"
      },
      timeline: "4 months",
      testimonial: "The team helped us connect with customers across all our locations. Our online orders increased by 195% in just 4 months."
    },
    {
      client: "CloudFlow Analytics",
      industry: "SaaS",
      challenge: "Needed to scale lead generation for B2B sales",
      solution: "Content marketing strategy and marketing automation",
      results: {
        traffic: "+420%",
        conversions: "+310%",
        revenue: "+$680K"
      },
      timeline: "8 months",
      testimonial: "They didn't just deliver results, they became true partners in our growth. Our pipeline has never been stronger."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Solutions",
      company: "TechStart Solutions",
      rating: 5,
      text: "Working with BrandingBeez was a game-changer for our agency. Their white-label services allowed us to scale rapidly without compromising quality.",
      image: "/api/placeholder/60/60"
    },
    {
      name: "Michael Chen",
      role: "Marketing Director, Growth Masters",
      company: "Growth Masters",
      rating: 5,
      text: "The team's expertise in SEO and automation saved us countless hours. We've been able to take on 40% more clients thanks to their support.",
      image: "/api/placeholder/60/60"
    },
    {
      name: "Jennifer Rodriguez",
      role: "Founder, Digital Boost Agency",
      company: "Digital Boost Agency",
      rating: 5,
      text: "BrandingBeez doesn't just deliver services, they become part of your team. The results speak for themselves - 300% revenue growth in 10 months.",
      image: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PerformanceOptimizer />
      <SchemaMarkup 
        type="Organization"
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BrandingBeez",
          "description": "White-label digital marketing services for agencies",
          "url": "https://brandingbeez.com",
          "logo": "https://brandingbeez.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": regionConfig.phone,
            "contactType": "customer service"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": regionConfig.code
          }
        }}
      />
      
      <Header />
      
      <main>
        {/* Hero Section with Optimized CTA */}
        <section className="relative bg-gradient-to-br from-brand-purple via-purple-600 to-brand-coral text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">
                    <Star className="w-3 h-3 mr-1" />
                    Trusted by 25+ Agencies Worldwide
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Scale Your Agency Without Hiring
                  </h1>
                  <p className="text-xl text-white/90 mb-8">
                    White-label digital services that help agencies deliver exceptional results to their clients. 
                    From SEO to web development, we handle the work so you can focus on growth.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <PrimaryCTAButton 
                    customText="Book Your Free Strategy Call"
                    customSubtext="Available today - Limited spots"
                    showOffer={true}
                  />
                  <SecondaryCTAButton 
                    customText="View Our Case Studies"
                    showOffer={false}
                  />
                </div>

                <div className="flex items-center gap-8 text-white/80">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span>100% White-Label</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>24hr Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>85% Satisfaction</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">Meet Your Dedicated Team</p>
                    <p className="text-sm opacity-80">Vetted professionals ready to scale your agency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Trusted by Leading Agencies Worldwide
              </h2>
              <p className="text-gray-600">
                25+ agencies across the globe trust us to deliver exceptional results for their clients
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center justify-center">
              {[
                { name: "Koala Digital", url: "koala-digital.com", location: "Australia" },
                { name: "Website Architect", url: "website-architect.co.uk", location: "UK" },
                { name: "AC Graphics Digital", url: "acgraphicsdigital.com", location: "Global" },
                { name: "Socialland", url: "socialland.co.uk", location: "UK" },
                { name: "Internet People", url: "internetpeople.net", location: "Global" },
                { name: "NewV Tech", url: "newvtech.com", location: "Global" },
                { name: "Einetter", url: "einetter.de", location: "Germany" },
                { name: "UZI Media", url: "uzimedia.com", location: "Global" },
                { name: "Smart Connecting", url: "smartconnecting.co.uk", location: "UK" },
                { name: "Trophy Outlet", url: "trophyoutlet.com", location: "Global" },
                { name: "Muse Digital", url: "musedigitalstrategies.com", location: "Global" },
                { name: "Focus Media", url: "focusmediamarketing.uk", location: "UK" }
              ].slice(0, 8).map((partner, i) => (
                <div key={i} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm  transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                      <Globe className="w-6 h-6 text-brand-coral" />
                    </div>
                    <p className="text-xs font-medium text-gray-900">{partner.name}</p>
                    <p className="text-xs text-gray-500">{partner.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section with Optimized CTAs */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Complete Digital Services Under Your Brand
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide end-to-end digital marketing services that you can offer to your clients 
                under your own brand. No one will know you're working with us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group  ">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-brand-coral/10 rounded-full group-rand-coral/20 transition-colors">
                      {service.icon}
                    </div>
                    <Badge className="mb-2 bg-brand-coral/10 text-brand-coral rand-coral/20">
                      {service.badge}
                    </Badge>
                    <CardTitle className="text-xl font-bold group-rand-coral transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">{service.description}</p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4">
                      <Link href={service.link}>
                        <Button className="w-full bg-gradient-to-r from-brand-coral to-pink-500 rand-coral-dark ink-600 text-white group">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2 group- " />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Real Results for Real Clients
              </h2>
              <p className="text-xl text-gray-600">
                See how we've helped agencies deliver exceptional results to their clients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <Card key={index} className=" transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{study.client}</CardTitle>
                      <Badge variant="outline">{study.industry}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{study.challenge}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-brand-coral mb-2">Solution</h4>
                      <p className="text-sm text-gray-700">{study.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-brand-coral mb-2">Results in {study.timeline}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="text-lg font-bold text-green-600">{study.results.traffic}</p>
                          <p className="text-xs text-gray-600">Traffic</p>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-lg font-bold text-blue-600">{study.results.conversions}</p>
                          <p className="text-xs text-gray-600">Conversions</p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <p className="text-lg font-bold text-purple-600">{study.results.revenue}</p>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>
                      </div>
                    </div>
                    
                    <blockquote className="border-l-4 border-brand-coral pl-4 italic text-gray-700 text-sm">
                      "{study.testimonial}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/case-studies">
                <Button size="lg" className="bg-brand-coral rand-coral-dark text-white">
                  View All Case Studies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Agency Owners Say About Us
              </h2>
              <p className="text-xl text-gray-600">
                Join 25+ agencies worldwide that trust us with their most important clients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="text-center  transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 mb-6 italic">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 bg-brand-coral/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-brand-coral" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Capture Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Scale Your Agency?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Get our exclusive "Agency Growth Blueprint" - the comprehensive guide that helps 
                  agencies scale with white-label services.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Proven strategies that work in 2024</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Step-by-step implementation guide</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Templates and tools worth $500+</span>
                  </div>
                </div>
              </div>
              
              <div>
                <LeadCaptureOptimized 
                  leadMagnet="seo-guide"
                  variant="inline"
                  title="Get Your Free Agency Growth Blueprint"
                  subtitle="Download the comprehensive agency growth blueprint"
                  showUrgency={true}
                  showSocialProof={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Optimized Form */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600">
                Book a free strategy call and discover how we can help you scale your agency
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <ContactFormOptimized 
                title="Get Your Free Strategy Call"
                subtitle="We'll show you exactly how to scale your agency with our white-label services"
                variant="default"
                showCoupon={true}
              />
            </div>
          </div>
        </section>

        {/* Internal Linking Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <InternalLinkingOptimized 
              currentPage="/"
              showRelatedContent={true}
              maxItems={6}
              variant="grid"
            />
          </div>
        </section>

        {/* Local SEO Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <LocalSEOOptimized 
              showLocations={true}
              showServiceAreas={true}
              showLocalReviews={true}
              variant="full"
            />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}