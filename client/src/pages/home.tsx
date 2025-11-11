import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HomeTeamBanner } from "@/components/home-team-banner";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegion } from "@/hooks/use-region";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  CheckCircle,
  ArrowRight,
  Search,
  Code,
  BarChart3,
  Zap,
  Users,
  Target,
  Award,
  Shield,
  Handshake,
  ChevronRight,
  Play,
  Download,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import brandingBeezLogo from "@assets/Logo_1751475462352.jpg";
import bniLogo from "@assets/bni_1752907520728.jpg";
import masterNetworksLogo from "@assets/mn_1752907520731.jpg";
import h7NetworksLogo from "@assets/h7_1752907520730.jpg";

// Partner Agency Logos
import newVisionTechLogo from "@assets/IMG-20250719-WA0264_1752907768834.jpg";
import carolinaWebLogo from "@assets/IMG-20250719-WA0270_1752907768835.jpg";
import socialLandLogo from "@assets/IMG-20250719-WA0271_1752907768836.jpg";
import focusEcommerceLogo from "@assets/IMG-20250719-WA0272_1752907768837.jpg";
import smartConnectingLogo from "@assets/IMG-20250719-WA0273_1752907768839.jpg";
import koalaDigitalLogo from "@assets/IMG-20250719-WA0274_1752907768841.jpg";
import websiteArchitectLogo from "@assets/IMG-20250719-WA0275_1752907768843.jpg";
import intrinsicLogo from "@assets/IMG-20250719-WA0276_1752907768844.jpg";
import socialBrainLogo from "@assets/IMG-20250719-WA0277_1752907768845.jpg";
import atlanticGrowthLogo from "@assets/atlantic-logo-new_1753433422794.jpg";
import octupusLogo from "@assets/Octupus Logo_1753187134020.jpg";

export default function Home() {
  const { regionConfig } = useRegion();
  const { toast } = useToast();

  const openCalendly = () => {
    window.open('https://calendly.com/vignesh-velusamy/30min', '_blank');
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agencyName: '',
    servicesInterested: '',
    subServices: [] as string[],
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      // Reset sub-services when main service changes
      if (field === 'servicesInterested') {
        return { ...prev, [field]: value, subServices: [] };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubServiceChange = (subService: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subServices: checked
        ? [...prev.subServices, subService]
        : prev.subServices.filter(s => s !== subService)
    }));
  };

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/contacts', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        agencyName: '',
        servicesInterested: '',
        subServices: [],
        message: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if sub-services are selected when main service is chosen
    if (formData.servicesInterested && formData.servicesInterested !== '' && formData.subServices.length === 0) {
      toast({
        title: "Please complete all fields",
        description: "Please select at least one sub-service for your chosen service category.",
        variant: "destructive",
      });
      return;
    }

    // Build comprehensive submission message
    let comprehensiveMessage = `Home Page Contact Form Submission`;

    if (formData.servicesInterested) {
      comprehensiveMessage += `\n\n📋 SERVICES REQUESTED:`;
      comprehensiveMessage += `\n• Primary Service: ${formData.servicesInterested}`;

      if (formData.subServices.length > 0) {
        comprehensiveMessage += `\n• Sub-services: ${formData.subServices.join(', ')}`;
      }
    }

    if (formData.message) {
      comprehensiveMessage += `\n\n💬 CUSTOMER MESSAGE:\n${formData.message}`;
    }

    comprehensiveMessage += `\n\n📍 REGION: ${regionConfig.name}`;

    // Build submission data with comprehensive details
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      company: formData.agencyName || 'Not provided',
      inquiry_type: 'home-contact-form',
      message: comprehensiveMessage,
      preferred_contact: 'email',
      country: regionConfig.name,
      topPriority: formData.servicesInterested || 'general-inquiry',
      agencyName: formData.agencyName,
      couponCode: null,
      service: formData.servicesInterested,
      servicesSelected: formData.subServices.length > 0 ? formData.subServices.join(', ') : null,
      contactFormType: 'home-contact-form'
    };

    contactMutation.mutate(submissionData);
  };

  const services = [
    {
      id: 1,
      title: "Search Engine Optimization",
      description:
        "Improve your website's visibility and drive organic traffic with our expert SEO services.",
      pricing: "Starting at $500/month",
      features: [
        "Keyword research",
        "On-page optimization",
        "Link building",
        "Content creation",
      ],
      href: "/services/seo",
      icon: Search,
    },
    {
      id: 2,
      title: "PPC Advertising",
      description:
        "Reach your target audience and generate leads with our data-driven PPC advertising campaigns.",
      pricing: "Starting at $400/month",
      features: [
        "Google Ads management",
        "Keyword targeting",
        "Ad copywriting",
        "Conversion tracking",
      ],
      href: "/services/google-ads",
      icon: Target,
    },
    {
      id: 3,
      title: "Web Development",
      description:
        "Build a professional and user-friendly website with our custom web development services.",
      pricing: "Starting at $600",
      features: [
        "Website design",
        "E-commerce development",
        "Mobile-friendly design",
        "Content management system",
      ],
      href: "/services/web-development",
      icon: Code,
    },
    {
      id: 4,
      title: "AI Development",
      description:
        "Transform your business with custom AI solutions including chatbots, automation, and intelligent web agents.",
      pricing: "Starting at $2,000/project",
      features: [
        "AI chatbots",
        "Custom AI models",
        "Process automation",
        "AI integrations",
      ],
      href: "/services/ai-development",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SEOHead
        title="White Label Digital Services | Scale Your Agency Without Hiring"
        description="Boost your agency growth with white-label SEO, PPC & web development services. Scale without hiring in-house teams. Trusted by 25+ agencies worldwide."
        keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
        canonicalUrl="https://brandingbeez.co.uk/"
        ogType="website"
      />
      <SchemaMarkup type="localBusiness" />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral text-white py-12 sm:py-16 lg:py-20 px-4">
          <div className="max-w-[84rem] mx-auto p-6">            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-sm font-semibold text-white">✓ Trusted by 25+ Agencies Worldwide</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Scale Your Agency
                <span className="text-brand-yellow"> Without Hiring</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                White-label digital services that help agencies hire expert teams for web development, PPC, and SEO.
                We handle the entire process so you can focus on growing your business and delivering results for your clients.
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 mb-8 leading-relaxed">
                A Team of 20+ Ready to Help
              </h2>

              {/* Key Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-yellow" />
                  <span className="text-lg text-white">100% White-Label</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-yellow" />
                  <span className="text-lg text-white">24hr Response Time</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-yellow" />
                  <span className="text-lg text-white">85% Satisfaction Rate</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-brand-coral hover:bg-brand-coral-dark text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
                  asChild
                >
                  <Link href="/onboarding-wizard">
                    <span className="hidden sm:inline">Find Your Perfect Service</span>
                    <span className="sm:hidden">Find Service</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
                  onClick={openCalendly}
                >
                  <span className="hidden sm:inline">Book Free Strategy Call</span>
                  <span className="sm:hidden">Book Call</span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <HomeTeamBanner />
            </div>
          </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                We offer a wide range of digital marketing services to help you grow your business.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={service.id}
                    className="group border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-full"
                  >
                    <CardHeader className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-coral/20 transition-colors">
                        <Icon className="w-6 h-6 text-brand-coral-darker" />
                      </div>
                      <CardTitle className="text-xl font-bold text-brand-purple min-h-[3.5rem] flex items-center">
                        <h3>{service.title}</h3>
                      </CardTitle>
                      <p className="text-gray-700 min-h-[3rem] flex items-start">{service.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="text-lg font-bold text-brand-coral-darker">
                          {service.pricing}
                        </div>
                        <ul className="space-y-2 flex-1">
                          {service.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-brand-coral-darker mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto pt-4">
                          <Link href={service.href}>
                            <Button className="w-full min-h-11 bg-gradient-to-r from-brand-coral to-brand-coral-dark hover:from-brand-coral-dark hover:to-brand-coral-darker text-white font-bold text-sm sm:text-base py-3 px-4 flex items-center justify-center gap-2 shadow-lg">
                              <span className="flex-1 text-center leading-tight text-white">
                                Learn More
                              </span>
                              <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partner Agencies Section - Rebuilt */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Partner Agencies</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Trusted by leading agencies worldwide who rely on our expert teams to deliver exceptional results for their clients.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={socialLandLogo}
                  alt="Social Land"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Social Land</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={websiteArchitectLogo}
                  alt="Website Architect"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Website Architect</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={focusEcommerceLogo}
                  alt="Focus E-commerce"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Focus E-commerce</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={smartConnectingLogo}
                  alt="Koala Digital"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Koala Digital</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={newVisionTechLogo}
                  alt="New Vision Tech"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">New Vision Tech</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={carolinaWebLogo}
                  alt="Carolina Web"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Carolina Web</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={intrinsicLogo}
                  alt="Intrinsic"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Intrinsic</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
                <img
                  src={socialBrainLogo}
                  alt="Social Brain"
                  className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
                  loading="eager"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Social Brain</p>
              </div>



            </div>
          </div>
        </section>



        {/* Dedicated Resources Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-8 mx-auto">
              🔥 Most Sought-After Service
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
              Dedicated Resources for US Agencies
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed">
              Scale your agency with handpicked pros who integrate seamlessly
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 lg:mb-12 border border-white/20 max-w-3xl mx-auto">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">Starting at $400/month</div>
              <div className="text-base sm:text-lg lg:text-xl text-gray-200 mb-2 sm:mb-3">Team Discounts: Up to 20% Off</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-200 mb-6 sm:mb-8">Average 60% cost savings vs. in-house team</div>

              <ul className="space-y-2 sm:space-y-3 text-left text-gray-100 mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <li className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base">Graphic Designers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base">Video Editors</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base">SEO Specialists</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base">Google Ads Experts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base">Web Developers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base">Full-Stack Developers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base">Data Entry/Virtual Assistants/Social Media Managers</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold touch-manipulation"
                  asChild
                >
                  <Link href="/contact?coupon=SETUP FREE&service=dedicated-resources&promo=setup-free">
                    Free Setup Cost
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-white" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-brand-purple bg-transparent text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 touch-manipulation"
                  asChild
                >
                  <Link href="/services/dedicated-resources">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Ready to Scale Your Agency?
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 px-4 sm:px-0">
                Get a free consultation and discover how we can help you grow
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Strategy Call Agenda */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    What to Expect in Your 30-Minute Strategy Call
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Business Discovery</span>
                        <p className="text-gray-700 text-sm mt-1">Understanding your current agency setup, services, and target market</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Challenge Identification</span>
                        <p className="text-gray-700 text-sm mt-1">Pinpointing specific pain points and growth bottlenecks you're facing</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Collaboration Opportunities</span>
                        <p className="text-gray-700 text-sm mt-1">Exploring how our services can complement your existing offerings</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Resource Assessment</span>
                        <p className="text-gray-700 text-sm mt-1">Determining what type of support would best accelerate your growth</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Partnership Benefits</span>
                        <p className="text-gray-700 text-sm mt-1">Discussing mutual opportunities for long-term collaboration</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Next Steps</span>
                        <p className="text-gray-700 text-sm mt-1">Outlining a clear action plan if there's a good fit between our businesses</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-purple-200">
                    <p className="text-sm text-gray-700 italic">
                      This call is designed to be a genuine business-to-business conversation focused on mutual growth and partnership opportunities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div>
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-center text-gray-900">Schedule Strategy Call</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                          <Input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="agencyName" className="text-sm font-medium text-gray-700">Agency Name</Label>
                          <Input
                            id="agencyName"
                            type="text"
                            value={formData.agencyName}
                            onChange={(e) => handleInputChange('agencyName', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="servicesInterested" className="text-sm font-medium text-gray-700">Services Interested In</Label>
                        <Select value={formData.servicesInterested} onValueChange={(value) => handleInputChange('servicesInterested', value)}>
                          <SelectTrigger aria-label="Select services interested in">
                            <SelectValue placeholder="Select services" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SEO Services">SEO Services</SelectItem>
                            <SelectItem value="PPC/Google Ads">PPC/Google Ads</SelectItem>
                            <SelectItem value="Website Development">Website Development</SelectItem>
                            <SelectItem value="AI Web Agents/AI Development">AI Web Agents/AI Development</SelectItem>
                            <SelectItem value="Dedicated Resource">Dedicated Resource</SelectItem>
                            <SelectItem value="N8N Automations">N8N Automations (Coming Soon)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Step 2: Sub-Service Selection */}
                      {formData.servicesInterested && (
                        <div className="space-y-4">
                          <Label className="text-sm font-medium text-gray-700">
                            What are you specifically looking for in {formData.servicesInterested}? *
                          </Label>
                          <div className="grid grid-cols-1 gap-3">

                            {/* SEO Services Options */}
                            {formData.servicesInterested === 'SEO Services' && (
                              <>
                                {[
                                  'Link building',
                                  'Local SEO',
                                  'Technical SEO audit & fixes',
                                  'Content marketing & SEO Blogging',
                                  'E-Commerce SEO'
                                ].map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={option}
                                      checked={formData.subServices.includes(option)}
                                      onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                    />
                                    <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </>
                            )}

                            {/* PPC/Google Ads Options */}
                            {formData.servicesInterested === 'PPC/Google Ads' && (
                              <>
                                {[
                                  'Starter Package',
                                  'Growth Package',
                                  'Scale Package'
                                ].map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={option}
                                      checked={formData.subServices.includes(option)}
                                      onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                    />
                                    <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </>
                            )}

                            {/* Website Development Options */}
                            {formData.servicesInterested === 'Website Development' && (
                              <>
                                {[
                                  'WordPress',
                                  'Shopify',
                                  'BigCommerce',
                                  'Custom Coded'
                                ].map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={option}
                                      checked={formData.subServices.includes(option)}
                                      onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                    />
                                    <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </>
                            )}


                            {/* Dedicated Resource Options */}
                            {formData.servicesInterested === 'Dedicated Resource' && (
                              <>
                                {[
                                  'Graphic Designer',
                                  'Video Editor',
                                  'SEO Specialist',
                                  'Google Ads Expert',
                                  'Web Developer',
                                  'Full-Stack Developer',
                                  'Others (Data Entry/Virtual Assistants/Social Media Managers)'
                                ].map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={option}
                                      checked={formData.subServices.includes(option)}
                                      onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                    />
                                    <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </>
                            )}

                            {/* AI Web Agents/AI Development Options */}
                            {formData.servicesInterested === 'AI Web Agents/AI Development' && (
                              <>
                                {[
                                  'AI Powered web app/Mobile app development',
                                  'AI Agentic Platform development',
                                  'AI Integration into existing platforms'
                                ].map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={option}
                                      checked={formData.subServices.includes(option)}
                                      onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                    />
                                    <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </>
                            )}

                            {/* N8N Automations Options */}
                            {formData.servicesInterested === 'N8N Automations (Coming Soon)' && (
                              <div className="text-center py-4">
                                <p className="text-gray-500 font-medium">Coming Soon!</p>
                                <p className="text-sm text-gray-400">We're working on bringing you the best N8N automation solutions.</p>
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell us about your agency and goals..."
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="w-full font-bold py-3 text-white bg-gradient-to-r from-brand-coral-dark to-brand-coral-darker hover:from-brand-coral-darker hover:to-brand-purple shadow-lg"
                      >
                        {contactMutation.isPending ? 'Submitting...' : 'Submit Form'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter!</h2>
              <p className="text-xl text-white/90 mb-8">Join 1000+ marketers & agencies getting exclusive tips on SEO, AI, and growth strategies delivered straight to their inbox.</p>
              <Button
                size="lg"
                className="bg-white text-brand-purple hover:bg-white/90 px-8 py-4"
                asChild
              >
                <Link href="/newsletter">
                  Subscribe Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}