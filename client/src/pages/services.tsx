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
        <section className="text-white py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral">
          <div className="max-w-7xl mx-auto p-6">
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
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "junior-graphic"
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
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "mid-graphic"
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
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Complete Service Portfolio
              </h2>
              <p className="text-base md:text-lg text-gray-700 mt-2">
                Comprehensive digital solutions delivered under your brand
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch auto-rows-fr">
              {serviceCategories.slice(0, 6).map((service) => {
                const Icon = service.icon;
                const hasCoupon = service.couponCode;

                return (
                  <Card
                    key={service.id}
                    className="relative overflow-hidden h-full flex flex-col p-6 shadow-sm border"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-brand-coral/10 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-brand-coral" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-brand-purple leading-snug line-clamp-2">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mt-1 leading-snug line-clamp-2">
                      {service.description}
                    </p>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      {/* Pricing and inline discount */}
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <div className="text-xl font-semibold text-brand-purple">
                          {service.pricing}
                        </div>

                        {service.discount && (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-brand-coral text-white text-xs font-bold animate-pulse">
                            {service.discount}
                          </span>
                        )}
                      </div>

                      {service.id === "dedicated-resources" ? (
                        <div className="text-xs text-brand-coral font-semibold mt-2">
                          Average 60% cost savings vs. in-house team
                        </div>
                      ) : (
                        <div className="text-xs text-brand-coral font-semibold mt-2 leading-snug">
                          {service.metrics}
                        </div>
                      )}

                      <ul className="mt-3 space-y-2">
                        {service.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm leading-tight"
                          >
                            <CheckCircle className="w-4 h-4 text-brand-coral mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Actions */}
                      <div className="mt-auto pt-5">
                        {service.id === "n8n-automations" ? (
                          <>
                            <div className="text-center py-2">
                              <span className="text-brand-coral font-semibold">
                                Coming Soon
                              </span>
                            </div>
                            <Link href={service.href}>
                              <Button
                                variant="outline"
                                className="w-full h-10 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
                              >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </>
                        ) : hasCoupon ? (
                          <div className="flex flex-col gap-4 mt-4">
                            {!showCoupons[service.id] ? (
                              <Button
                                onClick={() => handleRevealCoupon(service.id)}
                                className="w-full h-10 bg-brand-coral hover:bg-brand-coral/90 text-white font-medium"
                              >
                                <Gift className="w-4 h-4 mr-2" />
                                Get {service.discount} –{" "}
                                {service.discountDescription}
                              </Button>
                            ) : (
                              <div className="flex flex-col gap-4">
                                <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-lg">
                                  <div className="text-xs font-medium text-brand-purple mb-2">
                                    Your coupon code:
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                    <code className="font-mono text-sm font-bold text-brand-purple flex-1">
                                      {service.couponCode}
                                    </code>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleCopyCoupon(
                                          service.couponCode,
                                          service.id
                                        )
                                      }
                                      className="h-8 px-3 text-xs border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white"
                                    >
                                      <Copy className="w-3 h-3 mr-1" />
                                      {couponCopied[service.id] ? "✓" : "Copy"}
                                    </Button>
                                  </div>
                                </div>

                                <Link
                                  href={`/contact?coupon=${service.couponCode}&service=${service.id}`}
                                >
                                  <Button className="w-full h-10 bg-brand-coral hover:bg-brand-coral/90 text-white font-medium">
                                    Use Coupon in Contact Form
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                              </div>
                            )}

                            <Link href={service.href}>
                              <Button
                                variant="outline"
                                className="w-full h-10 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white"
                              >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Link href={service.href}>
                            <Button className="w-full h-10 bg-brand-coral hover:bg-brand-coral/90 text-white font-medium">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO Special Offer Section - Enhanced Design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral py-20 px-4">
          {/* Soft glow & pattern */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-1/3 -right-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-10 left-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            {/* subtle grid pattern */}
            <svg className="absolute inset-0 h-full w-full opacity-10" aria-hidden="true">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-6xl">
            {/* Top badge */}
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-300" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Limited time offer
                </span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-300" />
              </span>
            </div>

            {/* Headline & copy */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
                This Month Only: <span className="text-yellow-300">50% OFF</span> Any SEO Service
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-white/90">
                Supercharge your clients’ growth with our
                <span className="font-semibold text-yellow-300"> white-label, results driven SEO</span> done by senior experts, delivered under your brand.
              </p>
            </div>

            {/* Services chips */}
            <div className="mb-12">
              <h3 className="mb-6 text-center text-lg md:text-xl font-semibold text-white/90">
                Choose any SEO service and get <span className="text-yellow-300">50% off</span>:
              </h3>

              <div className="mx-auto grid max-w-4xl grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Local SEO",
                  "Ecommerce SEO",
                  "Technical SEO",
                  "Link Building",
                  "Content SEO",
                  "…and more",
                ].map((label) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/15 bg-white/10 p-4 text-center text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/15"
                  >
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-xl bg-yellow-400 px-8 font-bold text-brand-purple shadow-md transition-all hover:translate-y-[-1px] hover:bg-yellow-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-300"
                aria-label="Claim 50% discount now"
              >
                <Link href="/contact?coupon=SEO50&service=seo">
                  <span className="mr-2">🚀 Claim 50% Discount Now</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Link href="/services/seo" aria-label="View SEO case studies">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-2 border-white/70 bg-white/10 px-8 font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-brand-purple focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
                >
                  📊 View SEO Case Studies
                </Button>
              </Link>
            </div>

            {/* Footer note */}
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-white/85">
                ⏰ Offer expires in <span className="font-bold text-yellow-300">7 days</span> ·
                <span className="font-bold text-yellow-300"> New clients only</span> ·
                <span className="font-bold text-yellow-300"> No setup fees</span>
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
                  className="bg-brand-coral hover:bg-white hover:text-brand-purple text-white px-8 py-4 font-semibold transition-all duration-300"
                >
                  Subscribe to Our Newsletter!
                </Button>
              </Link>
              <Link href="/pricing-calculator">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-purple text-brand-purple hover:bg-brand-coral hover:text-white bg-white px-8 py-4 font-semibold transition-all duration-300"
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