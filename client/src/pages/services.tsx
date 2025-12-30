// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
// import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useRegion } from "@/hooks/use-region";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Globe,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Code,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AgencyContactSection from "@/components/agency-contact-section";

const serviceCategories = [
  {
    id: "seo",
    title: "SEO Services",
    // description: "Drive organic traffic with proven SEO strategies",
    description: "White-label SEO services built for US agencies managing multiple clients.",
    usDescription: "This offer is available exclusively for digital marketing agencies and white-label partners in the US.",
    icon: Search,
    href: "/services/seo",
    pricing: "Starting at $399",
    features: [
      "Link Building",
      "Local SEO",
      "Technical SEO Audit & Fixes",
      "Content Marketing & SEO Blogging",
      "E-Commerce SEO",
    ],
    metrics: "Average 150% increase in organic traffic",
    couponCode: "SEO50",
    discount: "20% OFF",
    discountDescription: "your first service",
    ctaLabel: "SEO Services",
    learnMoreText: "Learn about SEO Services",
  },
  {
    id: "dedicated-resources",
    title: "Dedicated Resources",
    description:
      "Scale your agency with handpicked pros who integrate seamlessly",
    icon: Users,
    href: "/services/dedicated-resources",
    pricing: "Starting at $1,199/month",
    features: [
      "Graphic Designers",
      "Video Editors",
      "SEO Specialists",
      "Google Ads Experts",
      "Web Developers",
      "Full-Stack Developers",
    ],
    metrics: "Average 60% cost savings vs. in-house team",
    // 🔴 No coupon fields here anymore
    // couponCode: undefined,
    // discount: undefined,
    // discountDescription: undefined,
    ctaLabel: "Dedicated Resources",
    learnMoreText: "Learn about Dedicated Resources",
  },
  {
    id: "web-development",
    title: "Website Design & Development",
    description: "Custom websites that turn visitors into lifelong customers",
    icon: Globe,
    href: "/services/web-development",
    pricing: "Starting at $599",
    features: ["WordPress", "Shopify", "BigCommerce", "Custom Coded"],
    metrics: "Average build time: 3 weeks",
    couponCode: "WEB20",
    discount: "20% OFF",
    discountDescription: "your first website project",
    ctaLabel: "Website Development",
    learnMoreText: "Learn about Website Development",
  },
  {
    id: "google-ads",
    title: "Google Ads",
    description: "Maximize ROI with expert PPC campaign management",
    icon: TrendingUp,
    href: "/services/google-ads",
    pricing: "Starting at $399/project",
    features: [
      "Starter Package",
      "Growth Package",
      "Scale Package",
      "Campaign Management & Optimization",
    ],
    metrics: "Average ROAS: 2.5x",
    couponCode: "ADS15",
    discount: "20% OFF",
    discountDescription: "your first project",
    ctaLabel: "PPC/Google Ads",
    learnMoreText: "Learn about PPC Services",
  },
  // {
  //   id: "ai-development",
  //   title: "AI Web Agents/AI Development",
  //   description:
  //     "Intelligent AI solutions to automate and enhance your business",
  //   icon: Bot,
  //   href: "/services/ai-development",
  //   pricing: "Starting at $4,000/project",
  //   features: [
  //     "AI Powered web app/Mobile app development",
  //     "AI Agentic Platform development",
  //     "AI Integration into existing platforms",
  //   ],
  //   metrics: "Average 40% efficiency increase",
  //   couponCode: "AI25",
  //   discount: "25% OFF",
  //   discountDescription: "your first AI project",
  // },
  // {
  //   id: "custom-app-development",
  //   title: "Custom Web & Mobile App Development",
  //   description:
  //     "High-performance custom apps built for scalability and seamless user experience",
  //   icon: Code,
  //   href: "/services/custom-app-development",
  //   pricing: "Starting at $3,500/project",
  //   features: [
  //     "Custom Web Application Development",
  //     "iOS & Android Mobile App Development",
  //     "Full-Stack Web Applications",
  //     "UI/UX Design & Prototyping",
  //     "API Development & Integrations",
  //     "Maintenance & Support",
  //   ],
  //   metrics: "Average delivery time: 4–8 weeks",
  //   couponCode: "APP20",
  //   discount: "20% OFF",
  //   discountDescription: "your first app project",
  // },
  {
    id: "custom-app-development",
    title: "Custom Web & Mobile Application Development (AI-Powered)",
    description:
      "High-performance applications built for scalability, automation, and seamless user experience.",
    icon: Code,
    href: "/services/custom-app-development",
    pricing: "Starting at $2,799/project",
    features: [
      // "Custom web application development",
      "Full-stack development",
      "iOS & Android mobile app development",
      "AI-powered enhancements & integrations",
      "AI agentic platform development",
      // "UI/UX design & prototyping",
      // "API development & system integrations",
      // "Maintenance & support",
    ],
    metrics: "Average delivery time: 4–8 weeks",
    couponCode: "APP20",
    discount: "20% OFF",
    discountDescription: "your AI-powered app project",
    ctaLabel: "Custom Apps(AI Powered)",
    learnMoreText: "Learn about Custom App Development",
  }
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
        // window.open("https://calendly.com/vignesh-velusamy/30min", "_blank");
        window.open("/book-appointment", "_blank");
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

  // Extract numeric base price from strings like "Starting at $1,200/month"
  const parseBasePrice = (pricing: string): number | null => {
    const match = pricing.match(/(\d[\d,]*)/);
    if (!match) return null;
    const numeric = match[1].replace(/,/g, "");
    const value = Number(numeric);
    return Number.isFinite(value) ? value : null;
  };

  // Extract percentage from strings like "50% OFF"
  const parseDiscountPercent = (discount?: string): number | null => {
    if (!discount) return null;
    const match = discount.match(/(\d+)\s*%/);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
  };

  // Format discounted price & keep suffix (/month, /project, etc.)
  const formatDiscountedLabel = (pricing: string, discountedPrice: number): string => {
    const suffix = pricing.replace(/^[^\d]*\d[\d,]*/, "").trim(); // part after the number
    const formatted = discountedPrice.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
    return `$${formatted}${suffix ? `${suffix}` : ""}`;
  };

  return (
    <>
      <Helmet>
        <title>Dedicated Resources & White-Label Services | Branding Beez</title>
        <meta name="description" content="Hire expert SEO, web, PPC & AI professionals from Branding Beez. Scale your agency with dedicated teams, 60% cost savings & full transparency." />
        <link rel="canonical" href="https://brandingbeez.co.uk/services" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="White-Label Services for US Agencies | Dedicated Resources & Development"
          description="Scale your US digital agency with white-label services, dedicated offshore resources, web & mobile development, SEO and Google Ads — without hiring US staff."
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
        {/* <Header /> */}
        <main>
          {/* Hero Section with Dual Forms */}
          <section className="text-white py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral">
            <div className="max-w-7xl mx-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left Side - Dedicated Resources Form */}
                <div>
                  {/* <div className="flex items-center justify-center">
                    <Badge className="bg-brand-coral text-white mb-4 sm:mb-6 text-md font-medium px-4 py-1">
                      Most Sought-After Service
                    </Badge>
                  </div> */}
                  <h1 className="text-2xl sm:text-2xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                    Dedicated White-Label Resources for US Digital Marketing Agencies
                  </h1>
                  {/* US & UK Marketing & */}
                  <h2 className="text-lg sm:text-lg lg:text-xl font-semibold text-gray-100 mb-6 sm:mb-8 leading-relaxed">
                    Hire proven offshore experts who plug directly into your agency
                    without the cost, risk, or delay of US hiring.
                  </h2>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/20">
                    <div className="text-2xl font-bold mb-2 text-yellow-200">
                      <span className="text-white text-2xl">Starting at</span> $1,199 per<span className="text-white text-xl"> resource / month
                      </span>
                    </div>
                    <div className="text-md font-medium text-gray-200 mb-4">
                      No recruitment fees | No long-term contracts | Team discounts available
                    </div>

                    <ul className="space-y-3 text-gray-100">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>160+ dedicated hours to your projects</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                        <span>
                          ⁠Fluent in English with good communication
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                        <span>
                          Direct communication & Full-time project transparency
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                        <span>
                          ⁠Specialists experienced in US Projects & clients
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                        <span>
                          ⁠Team discount of up to 20% when you hire 5 resources or more
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                        <span>
                          ⁠Save 60,000$+ a year on every resource
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
                <div className="bg-[rgba(40,20,50,0.6)] backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0px_8px_32px_rgba(0,0,0,0.3)]">
                  <h3 className="text-2xl font-bold mb-6 text-yellow-200">
                    {/* Subscribe Free */} Book Your Dedicated Resource
                  </h3>
                  <form onSubmit={handleSubmitLead} className="space-y-4 flex flex-col h-full">
                    <div className="space-y-4 max-h-[55vh] overflow-y-auto p-2 scrollbar-thin">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                          onChange={(e) => handleInputChange("email", e.target.value)}
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
                            setSelectedLevel("");
                          }}
                        >
                          <option value="" className="text-gray-900">
                            Select resource type...
                          </option>
                          <option value="graphic-designer" className="text-gray-900">
                            Graphic Designer
                          </option>
                          <option value="video-editor" className="text-gray-900">
                            Video Editor
                          </option>
                          <option value="seo-specialist" className="text-gray-900">
                            SEO Specialist
                          </option>
                          <option value="google-ads-expert" className="text-gray-900">
                            Google Ads Expert
                          </option>
                          <option value="web-developer" className="text-gray-900">
                            Web Developer
                          </option>
                          <option value="fullstack-developer" className="text-gray-900">
                            Full Stack Developer
                          </option>
                          <option value="ai-developer" className="text-gray-900">
                            AI Developer
                          </option>
                          {/* <option value="others" className="text-gray-900">
          Others (Data Entry/Virtual Assistants/Social Media
          Managers)
        </option> */}
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
                              {/* Junior Graphic Designer = 1200 */}
                              <div className="text-white font-bold">$1,200/month</div>
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
                              {/* Mid Graphic Designer = 1400 */}
                              <div className="text-white font-bold">$1,400/month</div>
                            </label>

                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "director-graphic"
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
                              {/* Senior Graphic (Creative Director) = 1800 */}
                              <div className="text-white font-bold">$1,800/month</div>
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
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "junior-video"
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
                              {/* Junior Video Editor = 1200 */}
                              <div className="text-white font-bold">$1,200/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "senior-video"
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
                              {/* Mid Video Editor = 1500 */}
                              <div className="text-white font-bold">$1,500/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "lead-video"
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
                              {/* Senior Video Editor = 2400 */}
                              <div className="text-white font-bold">$2,400/month</div>
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
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "junior-seo"
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
                              {/* Junior SEO = 1200 */}
                              <div className="text-white font-bold">$1,200/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "senior-seo"
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
                              {/* Mid SEO = 1800 */}
                              <div className="text-white font-bold">$1,800/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "specialist-seo"
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
                              {/* Senior SEO = 2600 */}
                              <div className="text-white font-bold">$2,600/month</div>
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
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "senior-ads"
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
                              {/* Junior Google Ads = 1400 */}
                              <div className="text-white font-bold">$1,400/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "mid-ads"
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
                              {/* Mid Google Ads = 2200 */}
                              <div className="text-white font-bold">$2,200/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "specialist-ads"
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
                              {/* Senior Google Ads = 3000 */}
                              <div className="text-white font-bold">$3,000/month</div>
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
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "junior-web"
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
                              {/* Junior Web Dev = 1200 */}
                              <div className="text-white font-bold">$1,200/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "senior-web"
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
                              {/* Mid Web Dev = 1800 */}
                              <div className="text-white font-bold">$1,800/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "ecomm-web"
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
                              {/* Senior Web Dev = 2800 */}
                              <div className="text-white font-bold">$2,800/month</div>
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
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "junior-fullstack"
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
                              {/* Junior Full Stack = 1500 */}
                              <div className="text-white font-bold">$1,500/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "senior-fullstack"
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
                              {/* Mid Full Stack = 2200 */}
                              <div className="text-white font-bold">$2,200/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "lead-fullstack"
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
                              {/* Senior Full Stack = 3600 */}
                              <div className="text-white font-bold">$3,600/month</div>
                            </label>
                          </div>
                        </div>
                      )}

                      {selectedService === "ai-developer" && (
                        <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Select hiring level for AI Developer
                          </label>
                          <div className="space-y-3">
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "junior-ai"
                                ? "bg-white/20 border-white/50"
                                : "bg-white/10 border-white/20 hover:bg-white/15"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="ai-level"
                                  value="junior-ai"
                                  checked={selectedLevel === "junior-ai"}
                                  onChange={(e) => setSelectedLevel(e.target.value)}
                                  className="text-white bg-white/20 border-white/30"
                                />
                                <div>
                                  <div className="text-white font-semibold">
                                    Junior AI Developer
                                  </div>
                                  <div className="text-gray-300 text-sm">
                                    2+ Years experience
                                  </div>
                                </div>
                              </div>
                              {/* junior.AI Developer = 1200 */}
                              <div className="text-white font-bold">$1,200/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "mid-ai"
                                ? "bg-white/20 border-white/50"
                                : "bg-white/10 border-white/20 hover:bg-white/15"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="ai-level"
                                  value="mid-ai"
                                  checked={selectedLevel === "mid-ai"}
                                  onChange={(e) => setSelectedLevel(e.target.value)}
                                  className="text-white bg-white/20 border-white/30"
                                />
                                <div>
                                  <div className="text-white font-semibold">
                                    Mid-level AI Developer
                                  </div>
                                  <div className="text-gray-300 text-sm">
                                    3+ Years experience
                                  </div>
                                </div>
                              </div>
                              {/* mid.AI Developer = 1600 */}
                              <div className="text-white font-bold">$1,600/month</div>
                            </label>
                            <label
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedLevel === "senior-ai"
                                ? "bg-white/20 border-white/50"
                                : "bg-white/10 border-white/20 hover:bg-white/15"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="ai-level"
                                  value="senior-ai"
                                  checked={selectedLevel === "senior-ai"}
                                  onChange={(e) => setSelectedLevel(e.target.value)}
                                  className="text-white bg-white/20 border-white/30"
                                />
                                <div>
                                  <div className="text-white font-semibold">
                                    Senior AI Developer
                                  </div>
                                  <div className="text-gray-300 text-sm">
                                    5+ Years experience
                                  </div>
                                </div>
                              </div>
                              {/* senior.AI Developer = 2200 */}
                              <div className="text-white font-bold">$2,200/month</div>
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
                                <span className="text-white text-sm">Graphic Designer</span>
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
                                <span className="text-white text-sm">Video Editor</span>
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
                                <span className="text-white text-sm">SEO Specialist</span>
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
                                <span className="text-white text-sm">Google Ads Expert</span>
                              </div>
                              <span className="text-white text-sm font-semibold">
                                From $1,400/mo
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  className="rounded bg-white/20 border-white/30"
                                />
                                <span className="text-white text-sm">Web Developer</span>
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
                                <span className="text-white text-sm">Full Stack Developer</span>
                              </div>
                              <span className="text-white text-sm font-semibold">
                                From $1,500/mo
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  className="rounded bg-white/20 border-white/30"
                                />
                                <span className="text-white text-sm">AI Developer</span>
                              </div>
                              {/* junior.AI Developer = 1200 */}
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
                    </div>

                    <Button
                      type="submit"
                      disabled={submitLeadMutation.isPending}
                      className="w-full bg-white text-brand-purple text-md font-bold ray-100 py-3 disabled:opacity-50 ml-[0px] mr-[0px] mt-[13px] mb-[13px]"
                    >
                      {submitLeadMutation.isPending ? "Processing..." : "Book Now"}
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
          <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gray-100">
            <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header Section */}
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Complete Service Portfolio
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-2 max-w-2xl mx-auto">
                  Comprehensive digital solutions delivered under your brand
                </p>
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                {serviceCategories.slice(0, 6).map((service) => {
                  const Icon = service.icon;
                  const hasCoupon = !!service.couponCode && service.id !== "dedicated-resources";

                  // 🔢 Calculate discounted price if coupon exists
                  const basePrice = hasCoupon ? parseBasePrice(service.pricing) : null;
                  const discountPercent = hasCoupon ? parseDiscountPercent(service.discount) : null;
                  const discountedPrice =
                    basePrice != null && discountPercent != null
                      ? Math.round(basePrice * (1 - discountPercent / 100))
                      : null;

                  const discountedLabel =
                    discountedPrice != null ? formatDiscountedLabel(service.pricing, discountedPrice) : null;

                  return (
                    <Card
                      key={service.id}
                      className="
              relative overflow-hidden flex flex-col h-full
              rounded-2xl border bg-white
              shadow-sm hover:shadow-md transition-shadow
              p-4 sm:p-5 md:p-6
            "
                    >
                      {/* 🔥 Badge - Only for Dedicated Resources */}
                      {service.id === "dedicated-resources" && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-brand-coral text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                            Recommended
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-brand-coral/10 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-brand-coral" />
                        </div>

                        <h3 className="text-base sm:text-lg md:text-lg font-bold text-brand-purple leading-snug line-clamp-2">
                          {service.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm md:text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>

                      {/* Content */}
                      <div className="flex-1 flex flex-col mt-4">
                        {/* Pricing */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-lg sm:text-xl font-extrabold text-brand-purple leading-tight">
                            {service.pricing}
                          </div>

                          {/* Optional: show discounted label (if you use it in UI) */}
                          {/* {discountedLabel && (
                            <span className="text-[11px] sm:text-xs font-bold text-brand-coral bg-brand-coral/10 px-2 py-1 rounded-full whitespace-nowrap">
                              {discountedLabel}
                            </span>
                          )} */}
                        </div>

                        {/* Metrics / Savings */}
                        <div className="text-xs sm:text-sm text-brand-coral font-semibold mt-2 leading-snug">
                          {service.id === "dedicated-resources"
                            ? "Average 60% cost savings vs. in-house team"
                            : service.metrics}
                        </div>

                        {/* Features */}
                        <ul className="mt-4 space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs sm:text-sm leading-snug">
                              <CheckCircle className="w-4 h-4 text-brand-coral mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Actions */}
                        <div className="mt-auto pt-5">
                          <div className="flex flex-col gap-3">
                            {/* Primary CTA → Contact form */}
                            <Link href={`/contact?service=${service.id}#contact-form`}>
                              <Button className="w-full h-10 sm:h-11 bg-brand-coral hover:bg-brand-coral/90 text-white font-medium text-sm sm:text-base">
                                <span className="truncate">Get Started with {service.ctaLabel}</span>
                                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                              </Button>
                            </Link>

                            {/* Secondary CTA → Learn more (short + accessible) */}
                            <Link href={service.href} aria-label={`Learn more about ${service.title}`}>
                              <Button
                                variant="outline"
                                className="w-full h-10 sm:h-11 text-center border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white font-semibold text-sm sm:text-base"
                              >
                                <span className="min-w-0 flex-1 truncate text-center">
                                  {service.learnMoreText}
                                </span>
                                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>


          {/* SEO Special Offer Section - Enhanced Design */}
          {/* <section className="relative overflow-hidden bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral py-20 px-4">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute top-1/3 -right-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-10 left-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
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
              <div className="mb-8 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md shadow-sm">
                  <span className="h-2 w-2 animate-shimmer rounded-full bg-yellow-300" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Limited time offer
                  </span>
                  <span className="h-2 w-2 animate-shimmer rounded-full bg-yellow-300" />
                </span>
              </div>

              <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
                  This Month Only: <span className="text-yellow-300">50% OFF</span> Any SEO Service
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-white/90">
                  Supercharge your clients’ growth with our
                  <span className="font-semibold text-yellow-300"> white-label, results driven SEO</span> done by senior experts, delivered under your brand.
                </p>
              </div>

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

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="group h-12 rounded-xl bg-yellow-400 px-8 font-bold text-brand-purple shadow-md transition-all hover:translate-y-[-1px] hover:bg-yellow-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-300"
                  aria-label="Claim 50% discount now"
                >
                  <Link href="/contact?coupon=SEO50&service=seo#contact-form">
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

              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-white/85">
                  ⏰ Offer expires in <span className="font-bold text-yellow-300">7 days</span> ·
                  <span className="font-bold text-yellow-300"> New clients only</span> ·
                  <span className="font-bold text-yellow-300"> No setup fees</span>
                </p>
              </div>
            </div>
          </section> */}

          {/* Contact Form Section (now a reusable component) */}
          <AgencyContactSection
            sectionId="contact-form"
            heading="Ready to Scale Your Agency?"
            subheading="Get a free consultation and discover how we can help you grow."
            inquiryType="service-contact-form"
            contactFormType="service-contact-form"
            submissionSourceLabel="Service Page Contact Form Submission"
          />

          {/* CTA Section */}
          <section className="py-16 px-4 bg-brand-purple text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 text-gray-200">Get weekly insights, case studies, and proven strategies delivered to your inbox. Join 2,500+ marketing professionals who trust our expertise.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/#newsletter">
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
        {/* <Footer /> */}
      </div>
    </>
  );
}



