import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { useState } from "react";
import { useRegion } from "@/hooks/use-region";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Globe,
  Zap,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Code,
  Bot,
  Monitor,
  Building,
  Calculator,
  Scale,
  Heart,
  Target,
  FileText,
  Gift,
  Copy,
} from "lucide-react";

const serviceCategories = [
  {
    id: "seo",
    title: "SEO Services",
    description: "Drive organic traffic with proven SEO strategies",
    icon: Search,
    href: "/services/seo",
    pricing: "Starting at $300",
    features: [
      "Link Building",
      "Local SEO",
      "Technical SEO Audit & Fixes",
      "Content Marketing & SEO Blogging",
      "E-Commerce SEO",
    ],
    metrics: "Average 150% increase in organic traffic",
    couponCode: "SEO50",
    discount: "50% OFF",
    discountDescription: "your first service",
  },
  {
    id: "web-development",
    title: "Website Design & Development",
    description: "Custom websites that turn visitors into lifelong customers",
    icon: Globe,
    href: "/services/web-development",
    pricing: "Starting at $500",
    features: ["WordPress", "Shopify", "BigCommerce", "Custom Coded"],
    metrics: "Average build time: 3 weeks",
    couponCode: "WEB20",
    discount: "20% OFF",
    discountDescription: "your first website project",
  },
  {
    id: "dedicated-resources",
    title: "Dedicated Resources",
    description:
      "Scale your agency with handpicked pros who integrate seamlessly",
    icon: Users,
    href: "/services/dedicated-resources",
    pricing: "Starting at $1,200/month",
    features: [
      "Graphic Designers",
      "Video Editors",
      "SEO Specialists",
      "Google Ads Experts",
      "Web Developers",
      "Full-Stack Developers",
      "Data Entry/Virtual Assistants/Social Media Managers",
    ],
    metrics: "Setup Cost: Free\nAverage 60% cost savings vs. in-house team",
    couponCode: "SETUP FREE",
    discount: "Free Setup Cost",
    discountDescription: "No setup fees",
  },

  {
    id: "google-ads",
    title: "Google Ads",
    description: "Maximize ROI with expert PPC campaign management",
    icon: TrendingUp,
    href: "/services/google-ads",
    pricing: "Starting at $400/project",
    features: [
      "Starter Package",
      "Growth Package",
      "Scale Package",
      "Campaign Management & Optimization",
    ],
    metrics: "Average ROAS: 2.5x",
    couponCode: "ADS15",
    discount: "15% OFF",
    discountDescription: "your first project",
  },
  {
    id: "ai-development",
    title: "AI Web Agents/AI Development",
    description:
      "Intelligent AI solutions to automate and enhance your business",
    icon: Bot,
    href: "/services/ai-development",
    pricing: "Starting at $2,000/project",
    features: [
      "AI Powered web app/Mobile app development",
      "AI Agentic Platform development",
      "AI Integration into existing platforms",
    ],
    metrics: "Average 40% efficiency increase",
    couponCode: "AI25",
    discount: "25% OFF",
    discountDescription: "your first AI project",
  },
  {
    id: "n8n-automations",
    title: "N8N Automations",
    description: "Streamline operations with intelligent automation solutions",
    icon: Zap,
    href: "/services/n8n-automations",
    pricing: "Coming Soon",
    features: [
      "HR workflows",
      "Email workflows",
      "Marketing Workflows",
      "Chat bot workflow & More coming soon..",
    ],
    metrics: "Coming Soon",
    couponCode: "",
    discount: "",
    discountDescription: "",
  },
];

const industriesWeServe = [
  {
    id: "digital-marketing",
    title: "Digital Marketing Agencies",
    description: "White-label services to scale your client offerings",
    icon: TrendingUp,
    href: "/industries/digital-marketing-agencies",
    services: [
      "SEO",
      "Google Ads",
      "Website Development",
      "Dedicated Resources",
    ],
    clientCount: "25+",
  },
];

export default function Services() {
  const { regionConfig } = useRegion();
  const { toast } = useToast();
  const [showCoupons, setShowCoupons] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [couponCopied, setCouponCopied] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    additionalNotes: "",
  });

  // Form submission mutation
  const submitLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/contacts", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description:
          "Your request has been submitted. We'll contact you within 24 hours.",
      });
      // Reset form
      setFormData({ fullName: "", email: "", additionalNotes: "" });
      setSelectedService("");
      setSelectedLevel("");
      // Redirect to Calendly
      setTimeout(() => {
        window.open("https://calendly.com/vignesh-velusamy/30min", "_blank");
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !selectedService) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in your name, email, and select a resource type.",
        variant: "destructive",
      });
      return;
    }

    if (selectedService !== "multiple" && !selectedLevel) {
      toast({
        title: "Missing Selection",
        description: "Please select your preferred hiring level.",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      name: formData.fullName,
      email: formData.email,
      phone: "", // Optional field
      company: "", // Optional field
      inquiry_type: "dedicated-resources",
      message: formData.additionalNotes || `Request for ${selectedService} at ${selectedLevel} level`,
      preferred_contact: "email",
      country: "US",
      topPriority: "dedicated-resources",
      couponCode: null,
      // Add service-specific details
      serviceDetails: {
        dedicatedResourceDetails: {
          roles: [{
            type: selectedService,
            skillLevel: selectedLevel || "standard",
            quantity: 1
          }]
        }
      }
    };

    submitLeadMutation.mutate(submissionData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRevealCoupon = (serviceId: string) => {
    setShowCoupons((prev) => ({ ...prev, [serviceId]: true }));
  };

  const handleCopyCoupon = async (code: string, serviceId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCouponCopied((prev) => ({ ...prev, [serviceId]: true }));
      setTimeout(
        () => setCouponCopied((prev) => ({ ...prev, [serviceId]: false })),
        2000,
      );
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCouponCopied((prev) => ({ ...prev, [serviceId]: true }));
      setTimeout(
        () => setCouponCopied((prev) => ({ ...prev, [serviceId]: false })),
        2000,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SEOHead
        title="White-Label Digital Marketing Services | SEO, PPC & Web Design"
        description="Scale your agency with white-label SEO, PPC, Google Ads, and web design services. Flexible plans, expert support, and seamless client delivery."
        keywords="white label digital marketing, white label services, SEO services, Google Ads management, web development, digital marketing agency services"
        canonicalUrl="https://brandingbeez.co.uk/services"
        ogType="website"
      />
      <SchemaMarkup type="service" data={{
        name: "White-Label Digital Marketing Services",
        description: "Comprehensive digital marketing services delivered under your agency's brand including SEO, Google Ads, web development, and AI solutions.",
        serviceType: "Digital Marketing Services",
        hasOfferCatalog: {
          name: "Digital Marketing Service Portfolio",
          itemListElement: [
            {
              name: "SEO Services",
              description: "Technical SEO, content optimization, and link building"
            },
            {
              name: "Google Ads Management",
              description: "Performance Max, Search, and Shopping campaigns"
            },
            {
              name: "Web Development",
              description: "WordPress, Shopify, and custom website development"
            },
            {
              name: "AI Integration",
              description: "ChatGPT, automation, and AI-powered solutions"
            }
          ]
        }
      }} />
      <Header />
      <main>
        {/* Hero Section with Dual Forms */}
        <section className="pt-6 sm:pt-8 pb-12 sm:pb-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side - Dedicated Resources Form */}
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-4 sm:mb-6 text-xs sm:text-sm">
                  🔥 Most Sought-After Service
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                  Dedicated Resources for US & UK Marketing & IT Companies
                </h1>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100 mb-6 sm:mb-8 leading-relaxed">
                  Boost your capacity effortlessly with expert professionals who
                  seamlessly extend your team.
                </h2>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                  <div className="text-3xl font-bold mb-2">
                    Starting at $400/month
                  </div>
                  <div className="text-lg text-gray-200 mb-4">
                    Per dedicated professional • Team discounts available
                  </div>

                  <ul className="space-y-3 text-gray-100">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>160+ Hours per Month of Dedicated Time</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>
                        Team discounts up to 20% when you hire 8+ people
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>
                        Direct communication and full project transparency
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>
                        Specialized talent matched to your agency's unique needs
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>
                        Up to 60% more cost-effective than in-house hiring
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-brand-purple bg-transparent"
                    asChild
                  >
                    <Link href="/services/dedicated-resources">
                      Learn More Details
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Side - Call Booking Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Subscribe Free
                </h3>
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      What type of dedicated resource do you need?
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                      onChange={(e) => {
                        setSelectedService(e.target.value);
                        setSelectedLevel(""); // Reset level when service changes
                      }}
                    >
                      <option value="" className="text-gray-900">
                        Select resource type...
                      </option>
                      <option
                        value="graphic-designer"
                        className="text-gray-900"
                      >
                        Graphic Designer
                      </option>
                      <option value="video-editor" className="text-gray-900">
                        Video Editor
                      </option>
                      <option value="seo-specialist" className="text-gray-900">
                        SEO Specialist
                      </option>
                      <option
                        value="google-ads-expert"
                        className="text-gray-900"
                      >
                        Google Ads Expert
                      </option>
                      <option value="web-developer" className="text-gray-900">
                        Web Developer
                      </option>
                      <option
                        value="fullstack-developer"
                        className="text-gray-900"
                      >
                        Full Stack Developer
                      </option>
                      <option value="others" className="text-gray-900">
                        Others (Data Entry/Virtual Assistants/Social Media
                        Managers)
                      </option>
                    </select>
                  </div>

                  {/* Conditional Hiring Level Options */}
                  {selectedService === "graphic-designer" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Select hiring level for Graphic Designer
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                            selectedLevel === "junior-graphic"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="graphic-level"
                              value="junior-graphic"
                              checked={selectedLevel === "junior-graphic"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Junior Graphic Designer
                              </div>
                              <div className="text-gray-300 text-sm">
                                1+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $400/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                            selectedLevel === "mid-graphic"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="graphic-level"
                              value="mid-graphic"
                              checked={selectedLevel === "mid-graphic"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Senior Graphic Designer
                              </div>
                              <div className="text-gray-300 text-sm">
                                3+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $1,200/month
                          </div>
                        </label>

                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "director-graphic"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="graphic-level"
                              value="director-graphic"
                              checked={selectedLevel === "director-graphic"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Creative Director
                              </div>
                              <div className="text-gray-300 text-sm">
                                8+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $2,000/month
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedService === "video-editor" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Select hiring level for Video Editor
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "junior-video"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="video-level"
                              value="junior-video"
                              checked={selectedLevel === "junior-video"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Junior Video Editor
                              </div>
                              <div className="text-gray-300 text-sm">
                                2+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $400/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "senior-video"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="video-level"
                              value="senior-video"
                              checked={selectedLevel === "senior-video"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Senior Video Editor
                              </div>
                              <div className="text-gray-300 text-sm">
                                4+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $1,400/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "lead-video"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="video-level"
                              value="lead-video"
                              checked={selectedLevel === "lead-video"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Video Production Lead
                              </div>
                              <div className="text-gray-300 text-sm">
                                6+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $2,200/month
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedService === "seo-specialist" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Select hiring level for SEO Specialist
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "junior-seo"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="seo-level"
                              value="junior-seo"
                              checked={selectedLevel === "junior-seo"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Junior SEO candidate
                              </div>
                              <div className="text-gray-300 text-sm">
                                2+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $400/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "senior-seo"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="seo-level"
                              value="senior-seo"
                              checked={selectedLevel === "senior-seo"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                SEO Specialist
                              </div>
                              <div className="text-gray-300 text-sm">
                                3+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $1,800/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "specialist-seo"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="seo-level"
                              value="specialist-seo"
                              checked={selectedLevel === "specialist-seo"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Senior SEO Specialist
                              </div>
                              <div className="text-gray-300 text-sm">
                                5+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $2,800/month
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedService === "google-ads-expert" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Select hiring level for Google Ads Expert
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "senior-ads"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="ads-level"
                              value="senior-ads"
                              checked={selectedLevel === "senior-ads"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Junior Google Ads Candidate
                              </div>
                              <div className="text-gray-300 text-sm">
                                2+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $1,200/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "mid-ads"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="ads-level"
                              value="mid-ads"
                              checked={selectedLevel === "mid-ads"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Google Ads Specialist
                              </div>
                              <div className="text-gray-300 text-sm">
                                3+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $2,000/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "specialist-ads"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="ads-level"
                              value="specialist-ads"
                              checked={selectedLevel === "specialist-ads"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Senior Google Ads Expert
                              </div>
                              <div className="text-gray-300 text-sm">
                                5+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $3,000/month
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedService === "web-developer" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Select hiring level for Web Developer
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "junior-web"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="web-level"
                              value="junior-web"
                              checked={selectedLevel === "junior-web"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Junior Web Developer
                              </div>
                              <div className="text-gray-300 text-sm">
                                2+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $400/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "senior-web"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="web-level"
                              value="senior-web"
                              checked={selectedLevel === "senior-web"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Senior Web Developer
                              </div>
                              <div className="text-gray-300 text-sm">
                                3+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $1,800/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "ecomm-web"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="web-level"
                              value="ecomm-web"
                              checked={selectedLevel === "ecomm-web"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Web development Manager
                              </div>
                              <div className="text-gray-300 text-sm">
                                5+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $2,800/month
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedService === "fullstack-developer" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Select hiring level for Full Stack Developer
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "junior-fullstack"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="fullstack-level"
                              value="junior-fullstack"
                              checked={selectedLevel === "junior-fullstack"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Junior Full Stack Developer
                              </div>
                              <div className="text-gray-300 text-sm">
                                2+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $1,200/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "senior-fullstack"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="fullstack-level"
                              value="senior-fullstack"
                              checked={selectedLevel === "senior-fullstack"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Senior Full Stack Developer
                              </div>
                              <div className="text-gray-300 text-sm">
                                3+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $2,000/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "lead-fullstack"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="fullstack-level"
                              value="lead-fullstack"
                              checked={selectedLevel === "lead-fullstack"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Production lead
                              </div>
                              <div className="text-gray-300 text-sm">
                                5+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $3,500/month
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedService === "others" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Select type for Data Entry/Virtual Assistants/Social
                        Media Managers
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "data-entry"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="others-level"
                              value="data-entry"
                              checked={selectedLevel === "data-entry"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Data Entry/Virtual Assistant
                              </div>
                              <div className="text-gray-300 text-sm">
                                2+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $400/month
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                            ${selectedLevel === "social-media"
                              ? "bg-white/20 border-white/50"
                              : "bg-white/10 border-white/20 hover:bg-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="others-level"
                              value="social-media"
                              checked={selectedLevel === "social-media"}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="text-white bg-white/20 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">
                                Social Media Manager
                              </div>
                              <div className="text-gray-300 text-sm">
                                2+ Years experience
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-bold">
                            $1200/month
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedService === "multiple" && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Which resources do you need? (Check all that apply)
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded bg-white/20 border-white/30"
                            />
                            <span className="text-white text-sm">
                              Graphic Designer
                            </span>
                          </div>
                          <span className="text-white text-sm font-semibold">
                            From $400/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded bg-white/20 border-white/30"
                            />
                            <span className="text-white text-sm">
                              Video Editor
                            </span>
                          </div>
                          <span className="text-white text-sm font-semibold">
                            From $400/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded bg-white/20 border-white/30"
                            />
                            <span className="text-white text-sm">
                              SEO Specialist
                            </span>
                          </div>
                          <span className="text-white text-sm font-semibold">
                            From $400/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded bg-white/20 border-white/30"
                            />
                            <span className="text-white text-sm">
                              Google Ads Expert
                            </span>
                          </div>
                          <span className="text-white text-sm font-semibold">
                            From $1,200/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded bg-white/20 border-white/30"
                            />
                            <span className="text-white text-sm">
                              Web Developer
                            </span>
                          </div>
                          <span className="text-white text-sm font-semibold">
                            From $400/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded bg-white/20 border-white/30"
                            />
                            <span className="text-white text-sm">
                              Full Stack Developer
                            </span>
                          </div>
                          <span className="text-white text-sm font-semibold">
                            From $1,200/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded bg-white/20 border-white/30"
                            />
                            <span className="text-white text-sm">
                              Data Entry/Virtual Assistants/Social Media
                              Managers
                            </span>
                          </div>
                          <span className="text-white text-sm font-semibold">
                            From $700/mo
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Notes Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Additional Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        handleInputChange("additionalNotes", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                      placeholder="Tell us about your project requirements, timeline, or specific needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitLeadMutation.isPending}
                    className="w-full bg-white text-brand-purple ray-100 py-3 disabled:opacity-50 ml-[0px] mr-[0px] mt-[13px] mb-[13px]"
                  >
                    {submitLeadMutation.isPending
                      ? "Processing..."
                      : "Subscribe Free"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-sm text-gray-300 text-center">
                    We'll confirm your appointment within 24 hours
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Service Portfolio
              </h2>
              <p className="text-xl text-gray-700">
                Comprehensive digital solutions delivered under your brand
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.slice(0, 6).map((service) => {
                const Icon = service.icon;
                const hasCoupon = service.couponCode;
                return (
                  <Card key={service.id} className="relative overflow-hidden flex flex-col h-full">
                    {hasCoupon && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-brand-coral text-white text-xs font-bold animate-pulse">
                          {service.discount}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-brand-coral" />
                      </div>
                      <CardTitle className="text-xl font-bold text-brand-purple min-h-[3.5rem] flex items-center">
                        <h3>{service.title}</h3>
                      </CardTitle>
                      <p className="text-gray-700 min-h-[3rem] flex items-start">{service.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="text-2xl font-bold text-brand-purple">
                          {service.pricing}
                        </div>
                        {service.id === "dedicated-resources" ? (
                          <div className="space-y-2 min-h-[2.5rem]">
                            <div className="text-sm text-brand-coral font-semibold">
                              Average 60% cost savings vs. in-house team
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-brand-coral font-semibold min-h-[2.5rem] flex items-start">
                            {service.metrics}
                          </div>
                        )}
                        <ul className="space-y-2 flex-1 min-h-[8rem]">
                          {service.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fixed button container at bottom */}
                      <div className="mt-auto pt-6 space-y-6">
                        {service.id === "n8n-automations" ? (
                          <>
                            <div className="text-center py-3 mb-2">
                              <span className="text-brand-coral font-semibold text-lg">
                                Coming Soon
                              </span>
                            </div>
                            <Link href={service.href}>
                              <Button
                                variant="outline"
                                className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
                              >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </>
                        ) : hasCoupon ? (
  <div className="space-y-4">
    {!showCoupons[service.id] ? (
      <Button
        onClick={() => handleRevealCoupon(service.id)}
        className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors"
      >
        <Gift className="w-4 h-4 mr-2" />
        Get {service.discount} - {service.discountDescription}
      </Button>
    ) : (
      <div className="space-y-4">
        <div className="p-4 bg-brand-coral/10 border border-brand-coral/20 rounded-lg">
          <div className="text-sm font-medium text-brand-purple mb-3">
            Your coupon code:
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded border">
            <code className="font-mono text-sm font-bold text-brand-purple flex-1">
              {service.couponCode}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleCopyCoupon(service.couponCode, service.id)
              }
              className="h-8 px-3 text-xs border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
            >
              <Copy className="w-3 h-3 mr-1" />
              {couponCopied[service.id] ? "✓" : "Copy"}
            </Button>
          </div>
        </div>
        <Link
          href={`/contact?coupon=${service.couponCode}&service=${service.id}`}
        >
          <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors">
            Use Coupon in Contact Form
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )}

    <Link href={service.href}>
      <Button
        variant="outline"
        className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
      >
        Learn More
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  </div>
)
 : (
                          <Link href={service.href}>
                            <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white transition-colors">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO Special Offer Section - Enhanced Design */}
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-brand-purple via-brand-coral to-brand-purple">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full blur-lg"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-12 h-12 bg-white rounded-full blur-lg"></div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Special Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-2xl">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                  Limited Time Offer
                </h2>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center mb-12">
              <div className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight">
                <h3 className="block text-2xl md:text-3xl font-semibold text-yellow-300 mb-2">
                  This Month's Special: 50% OFF Any SEO Service!
                </h3>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
                Supercharge your clients' results for half the price—all with
                our
                <span className="font-bold text-yellow-300">
                  {" "}
                  industry-leading, fully white-label SEO solutions
                </span>
              </p>
            </div>

            {/* SEO Services Grid */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-white mb-8">
                For a limited time, get 50% off any of our expert SEO services:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-whover:bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                  <div className="text-white font-semibold">Local SEO</div>
                </div>
                <div className="bg-whover:bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                  <div className="text-white font-semibold">Ecommerce SEO</div>
                </div>
                <div className="bg-whover:bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                  <div className="text-white font-semibold">Technical SEO</div>
                </div>
                <div className="bg-whover:bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                  <div className="text-white font-semibold">Link Building</div>
                </div>
                <div className="bg-whover:bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                  <div className="text-white font-semibold">Content SEO</div>
                </div>
                <div className="bg-whover:bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                  <div className="text-white font-semibold">& More</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-300 text-brand-purple font-bold text-lg px-10 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Link href="/contact?coupon=SEO50&service=seo">
                  🚀 Claim 50% Discount Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Link href="/services/seo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-brand-purple font-semibold text-lg px-10 py-6 rounded-2xl backdrop-blur-md bg-white/10 shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  📊 View SEO Case Studies
                </Button>
              </Link>
            </div>

            {/* Urgency Footer */}
            <div className="text-center mt-8">
              <p className="text-white/90 font-semibold">
                ⏰ Offer expires in{" "}
                <span className="text-yellow-300 font-bold">7 days</span> |
                <span className="text-yellow-300 font-bold">
                  {" "}
                  New clients only
                </span>{" "}
                |
                <span className="text-yellow-300 font-bold"> No setup fees</span>
              </p>
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="py-16 px-4 bg-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-gray-200">Get weekly insights, case studies, and proven strategies delivered to your inbox. Join 2,500+ marketing professionals who trust our expertise.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/newsletter">
                <Button
                  size="lg"
                  className="bg-brand-coral hover:bg-brand-coral/90 text-white px-8 py-4 font-semibold transition-all duration-300"
                >
                  Subscribe to Our Newsletter!
                </Button>
              </Link>
              <Link href="/pricing-calculator">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white bg-white px-8 py-4 font-semibold transition-all duration-300"
                >
                  View Pricing Calculator
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