import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SchemaMarkup } from "@/components/schema-markup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useRegion } from "@/hooks/use-region";
import {
  Bot,
  Brain,
  Zap,
  MessageSquare,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Users,
  TrendingUp,
  Code,
  Cpu,
  Database,
  Sparkles,
  Target,
  Building,
  Scale,
  FileText,
  Heart,
  Calculator,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { AIDevelopmentSchema } from "@/utils/all-schemas";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AgencyContactSection from "@/components/agency-contact-section";

const aiServices = [
  {
    id: "chatbots",
    title: "AI Chatbots",
    description:
      "Intelligent conversational AI that handles customer inquiries 24/7",
    icon: MessageSquare,
    features: [
      "Natural language processing",
      "Multi-language support",
      "Integration with existing systems",
      "Custom training on your data",
      "Analytics and reporting",
    ],
    pricing: "Starting at $2,500",
    timeline: "2-4 weeks",
  },
  {
    id: "content-generation",
    title: "AI Content Generation",
    description:
      "Automated content creation for blogs, social media, and marketing",
    icon: Brain,
    features: [
      "SEO-optimized content",
      "Brand voice consistency",
      "Multi-format content",
      "Automated publishing",
      "Performance tracking",
    ],
    pricing: "Starting at $1,800",
    timeline: "1-3 weeks",
  },
  {
    id: "customer-support",
    title: "AI Customer Support",
    description: "Intelligent support systems that resolve issues instantly",
    icon: Shield,
    features: [
      "Ticket classification",
      "Automated responses",
      "Escalation management",
      "Knowledge base integration",
      "Sentiment analysis",
    ],
    pricing: "Starting at $3,200",
    timeline: "3-5 weeks",
  },
  {
    id: "data-analysis",
    title: "AI Data Analysis",
    description: "Transform raw data into actionable business insights",
    icon: BarChart3,
    features: [
      "Predictive analytics",
      "Pattern recognition",
      "Automated reporting",
      "Real-time dashboards",
      "Custom algorithms",
    ],
    pricing: "Starting at $4,000",
    timeline: "4-6 weeks",
  },
  {
    id: "personalization",
    title: "AI Personalization",
    description: "Deliver personalized experiences at scale",
    icon: Users,
    features: [
      "User behavior analysis",
      "Dynamic content delivery",
      "Recommendation engines",
      "A/B testing automation",
      "Conversion optimization",
    ],
    pricing: "Starting at $3,500",
    timeline: "3-5 weeks",
  },
  {
    id: "automation",
    title: "AI-Powered Automation",
    description: "Intelligent workflow automation that learns and adapts",
    icon: Zap,
    features: [
      "Process optimization",
      "Decision automation",
      "Error detection",
      "Workflow learning",
      "Performance monitoring",
    ],
    pricing: "Starting at $2,800",
    timeline: "2-4 weeks",
  },
];

const pricingTiers = [
  {
    id: "starter",
    name: "AI Starter",
    price: "$2,000",
    period: "/project",
    description: "Perfect for small businesses getting started with AI",
    features: [
      "Basic AI chatbot implementation",
      "Up to 1,000 interactions/month",
      "Email support",
      "Basic analytics",
      "1 revision round",
      "30-day support",
    ],
    popular: false,
  },
  {
    id: "business",
    name: "AI Business",
    price: "$5,500",
    period: "/project",
    description: "Comprehensive AI solutions for growing businesses",
    features: [
      "Advanced AI implementation",
      "Up to 10,000 interactions/month",
      "Priority support",
      "Advanced analytics & reporting",
      "3 revision rounds",
      "90-day support",
      "Custom integrations",
      "Training & documentation",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "AI Enterprise",
    price: "$12,000+",
    period: "/project",
    description: "Custom AI solutions for large organizations",
    features: [
      "Fully custom AI solutions",
      "Unlimited interactions",
      "24/7 dedicated support",
      "Advanced analytics suite",
      "Unlimited revisions",
      "1-year support & maintenance",
      "Custom integrations & APIs",
      "Team training & workshops",
      "Performance guarantees",
    ],
    popular: false,
  },
];

const caseStudies = [
  {
    id: "ecommerce-ai",
    title: "E-commerce AI Assistant",
    client: "TechGear Plus",
    industry: "E-commerce",
    challenge: "High customer service volume and low conversion rates",
    solution:
      "Implemented AI chatbot with product recommendations and instant support",
    results: [
      "85% reduction in support tickets",
      "340% increase in conversion rate",
      "24/7 customer support coverage",
      "$180K+ additional revenue in 6 months",
    ],
    timeline: "4 weeks",
    image: "/api/placeholder/400/300",
  },
  {
    id: "content-automation",
    title: "Content Generation AI",
    client: "Digital Marketing Pro",
    industry: "Marketing Agency",
    challenge: "Scaling content production for multiple clients",
    solution: "Custom AI content generation system with brand voice training",
    results: [
      "500% increase in content output",
      "60% reduction in content creation time",
      "Consistent brand voice across all content",
      "95% client satisfaction rate",
    ],
    timeline: "3 weeks",
    image: "/api/placeholder/400/300",
  },
  {
    id: "data-insights",
    title: "Predictive Analytics AI",
    client: "RetailFlow Analytics",
    industry: "Retail",
    challenge: "Difficulty predicting inventory needs and customer trends",
    solution:
      "AI-powered predictive analytics dashboard with real-time insights",
    results: [
      "40% reduction in inventory waste",
      "25% increase in sales forecast accuracy",
      "Real-time trend identification",
      "$320K+ cost savings annually",
    ],
    timeline: "6 weeks",
    image: "/api/placeholder/400/300",
  },
];

// Questionnaire config
const industries = [
  "Digital Marketing Agency",
  "Real Estate",
  "E-commerce",
  "Property Management",
  "Law Firm",
  "Telecoms",
  "Other",
];

const companySizes = [
  "Solo / Freelancer (1-2 people)",
  "Small team (3-10 people)",
  "Growing business (11-50 people)",
  "Established company (51-200 people)",
  "Enterprise (200+ people)",
];

const toolsOptions = [
  "We use multiple disconnected tools (CRM, project management, etc.)",
  "We have a custom platform but it's outdated",
  "We're mostly using spreadsheets and manual processes",
  "We have good systems, but they don't talk to each other",
  "We're starting from scratch",
];

const automationPriorities = [
  "Automating repetitive tasks (content, reports, admin)",
  "Improving customer/client communication (chatbots, automated responses)",
  "Better data insights (analytics, forecasting, recommendations)",
  "Reducing manual errors (document processing, data entry)",
  "Scaling operations without hiring more people",
];

const budgetRanges = [
  "£25K - £50K",
  "£50K - £100K",
  "£100K - £200K",
  "£200K+",
  "Not sure yet (help me understand costs)",
];

const timelines = [
  "ASAP (within 3 months)",
  "3-6 months",
  "6-12 months",
  "Just exploring options",
];

const painPointsByIndustry: Record<string, string[]> = {
  "Digital Marketing Agency": [
    "Too much time spent on repetitive content creation",
    "Can't scale client delivery without hiring more people",
    "Losing clients due to slow response times",
    "Struggling to prove ROI to clients",
    "Team spending hours on manual reporting",
  ],
  "Property Management": [
    "High tenant turnover (vacancies, onboarding)",
    "Maintenance requests taking too long to resolve",
    "Spending hours on tenant screening",
    "Missed rent collection / late payments",
    "Can't scale beyond current portfolio size",
  ],
  default: [
    "Too much time spent on repetitive manual work",
    "Systems are disconnected and hard to manage",
    "Struggling to get useful insights from data",
    "Customer / client communication is slow or inconsistent",
    "Hard to scale operations without adding more headcount",
  ],
};

export default function AIDevelopment() {
  const { regionConfig } = useRegion();

  const redirectToContact = () => {
    window.location.href = "/contact?service=AI Development";
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Development & AI Web Agents",
    description:
      "Professional AI development services including chatbots, automation, and intelligent web agents for businesses.",
    provider: {
      "@type": "Organization",
      name: "BrandingBeez",
      url: "https://brandingbeez.com",
    },
    areaServed: ["United States", "United Kingdom", "Germany"],
    serviceType: "AI Development",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "2000",
      highPrice: "12000",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    industry: "",
    industryOther: "",
    companySize: "",
    painPoint: "",
    tools: [] as string[],
    desiredOutcome: "",
    automationPriority: [] as string[],
    budgetRange: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 9;

  const currentPainPoints =
    painPointsByIndustry[formData.industry] || painPointsByIndustry.default;

  const toggleArrayValue = (field: "tools" | "automationPriority", value: string, limit?: number) => {
    setFormData((prev) => {
      const current = prev[field];
      const exists = current.includes(value);
      let next = current;

      if (exists) {
        next = current.filter((v) => v !== value);
      } else {
        if (limit && current.length >= limit) {
          return prev; // don't add beyond limit
        }
        next = [...current, value];
      }

      return { ...prev, [field]: next };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("company", formData.company);
      formPayload.append("service", "ai-development-questionnaire");
      formPayload.append("questionnaire", JSON.stringify(formData));
      if (attachment) {
        formPayload.append("questionFile", attachment);
      }
      const res = await fetch("/api/contacts", {
        method: "POST",
        body: formPayload,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Submission failed", err || res.statusText);
        alert("Sorry — we couldn't submit your questionnaire. Please try again or email us directly.");
        return;
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <>
      <Helmet>
        <title>AI Development & Web Agents Services | Branding Beez 2025</title>
        <meta
          name="description"
          content="Build intelligent AI systems — from chatbots to multi-agent platforms. Automate workflows, personalize experiences & drive growth with expert AI developers."
        />
        <link
          rel="canonical"
          href="https://brandingbeez.co.uk/services/ai-development"
        />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="Transform Your Business with AI Web Agents"
          description="Build intelligent, automated AI systems — from chatbots to enterprise AI platforms. Free AI strategy consultation."
          keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
          canonicalUrl="https://brandingbeez.co.uk/services/ai-development"
          ogType="website"
        />
        <SchemaMarkup type="custom" data={AIDevelopmentSchema} />
        {/* <SchemaMarkup type="service" data={schemaData} /> */}
        {/* <Header /> */}
        <main>
          {/* Hero Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      🤖 AI Solutions
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30">
                      Enterprise Ready
                    </Badge>
                  </div>

                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    AI Web Agents & AI Development
                  </h1>

                  <p className="text-xl mb-8 text-white/90 leading-relaxed">
                    Transform your business with intelligent AI solutions and
                    custom platforms. From autonomous business process agents to
                    industry-specific AI platforms, we build scalable AI systems
                    that automate processes, enhance customer experiences, and
                    drive measurable growth. Specializing in multi-agent workflows
                    and vertical AI solutions.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-white text-brand-purple hover:bg-brand-coral hover:text-white font-bold"
                      asChild
                    >
                      <Link href="/contact">
                        Get AI Consultation
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <img
                          src="/images/octupus-logo.jpg"
                          alt="Octupus AI Logo"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Featured AI Client
                      </h2>
                      <Badge className="bg-brand-purple text-white">
                        Active Project
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-white font-semibold">
                            Octupus.ai
                          </h2>
                          <br />
                          <span className="text-white/80 text-sm">
                            AI Platform Implementation
                          </span>
                        </div>
                        <Badge className="bg-green-600 text-white font-bold">
                          Live
                        </Badge>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-white text-2xl font-bold">
                          85%
                        </div>
                        <div className="text-white/80 text-sm">
                          Reduction in Support Tickets
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-white text-2xl font-bold">
                          24/7
                        </div>
                        <div className="text-white/80 text-sm">
                          Customer Support Coverage
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <a
                          href="https://octupus.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-brand-purple font-bold ellow-200 text-sm flex items-center gap-2 justify-center transition-colors"
                        >
                          🌐 Visit Octupus.ai
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Capabilities Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-brand-purple mb-6">
                  Our Technical Capabilities
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Advanced AI expertise with proven frameworks and methodologies
                  for building scalable, intelligent systems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className=" ">
                  <CardHeader>
                    <Brain className="w-12 h-12 text-brand-coral mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      AI/ML Expertise
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• GenAI</li>
                      <li>• Data Analytics</li>
                      <li>• Predictive Analytics</li>
                      <li>• Custom Model Training</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className=" ">
                  <CardHeader>
                    <Cpu className="w-12 h-12 text-brand-coral mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      Agent Architecture
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Multi-agent systems</li>
                      <li>• Single-agent flows</li>
                      <li>• Use case optimization</li>
                      <li>• Workflow orchestration</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className=" ">
                  <CardHeader>
                    <Code className="w-12 h-12 text-brand-coral mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      Development Approach
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Prompt engineering for speed</li>
                      <li>• Fine-tuning for accuracy</li>
                      <li>• Domain specificity</li>
                      <li>• Flexible implementation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className=" ">
                  <CardHeader>
                    <Zap className="w-12 h-12 text-brand-coral mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      Autonomous Systems
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Business process agents</li>
                      <li>• Multi-agent workflows</li>
                      <li>• Intelligent automation</li>
                      <li>• Self-optimizing systems</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* AI Services Grid */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-purple mb-6">
                  AI Solutions We Develop
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Custom AI implementations designed to solve your specific
                  business challenges and unlock new opportunities.
                </p>
              </div>

              {/* Featured Case Study - PatentScanner */}
              <Card className="mb-12 border-2 border-brand-coral shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="bg-brand-coral text-white font-bold mb-2 inline-block px-4 py-2 rounded-full text-sm">
                        🎯 AI Development Case Study
                      </h3>
                      <h3 className="text-3xl font-bold text-white">
                        PatentScanner.co.uk
                      </h3>
                      <p className="text-white/90 mt-2">
                        UK Patent Screening Platform with AI-Powered Analysis
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Challenge
                        </h4>
                        <p className="text-gray-600">
                          UK innovators needed a comprehensive platform to search
                          patent databases, manage applications, and analyze
                          patent text for novelty and potential conflicts.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          AI Solution
                        </h4>
                        <p className="text-gray-600">
                          Built intelligent patent analysis system with
                          multi-database search, automated filing management, and
                          AI-powered text analysis for patent novelty detection.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <Code className="w-5 h-5" />
                          Technical Implementation
                        </h4>
                        <p className="text-gray-600">
                          Full-stack AI platform with natural language processing
                          for patent text analysis and automated conflict
                          detection across UK patent databases.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Platform Features
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-100 text-blue-800">
                              Patent Search
                            </Badge>
                            <span className="text-gray-700">
                              Multi-database UK patent search
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-800">
                              Application Filing
                            </Badge>
                            <span className="text-gray-700">
                              Document management & status tracking
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-purple-100 text-purple-800">
                              AI Analysis
                            </Badge>
                            <span className="text-gray-700">
                              Automated novelty & conflict detection
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-wings/20 p-6 rounded-xl">
                        <h4 className="font-semibold text-brand-purple mb-3">
                          Key Capabilities:
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              AI-powered patent text analysis
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              Prior art identification system
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              Automated conflict detection
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              End-to-end patent workflow
                            </span>
                          </li>
                        </ul>

                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <a
                            href="https://patentscanner.co.uk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-coral rand-coral/80 font-semibold flex items-center gap-2 justify-center transition-colors"
                          >
                            🌐 Visit PatentScanner.co.uk
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Platform Portfolio - Featured Octupus AI */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-purple mb-6">
                  Our Platform Portfolio
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Industry-specific AI platforms delivering vertical intelligence
                  and specialized automation.
                </p>
              </div>

              {/* Featured Platform - Octupus AI */}
              <Card className="mb-12 border-2 border-brand-coral shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <img
                        src="/images/octupus-logo.jpg"
                        alt="Octupus AI Logo"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="bg-brand-coral text-white font-semibold mb-2 inline-block px-4 py-2 rounded-full text-sm">
                        🚀 Featured Platform
                      </h3>
                      <h3 className="text-3xl font-bold text-white">
                        Octupus AI - UK Telecoms AI Platform
                      </h3>
                      <p className="text-white/90 mt-2">
                        Industry-specific AI platform for automated social media
                        content creation
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Challenge
                        </h4>
                        <p className="text-gray-600">
                          UK telecoms companies struggled with generic social
                          media tools that didn't understand industry terminology,
                          regulations, or customer concerns.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Solution
                        </h4>
                        <p className="text-gray-600">
                          Built industry-specific AI platform for automated social
                          media content creation across Instagram, Facebook, and
                          LinkedIn with telecoms expertise.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Partnership
                        </h4>
                        <p className="text-gray-600">
                          Developed with UK partners including connect-it.co for
                          local market expertise and industry connections.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Results & Status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-800">
                              Beta Testing
                            </Badge>
                            <span className="text-gray-700">
                              Currently in beta with telecoms-specific content
                              generation
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-100 text-blue-800">
                              Smart Scheduling
                            </Badge>
                            <span className="text-gray-700">
                              Automated posting with regulatory compliance
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-purple-100 text-purple-800">
                              Active Onboarding
                            </Badge>
                            <span className="text-gray-700">
                              UK telecoms companies joining beta program
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-wings/20 p-6 rounded-xl">
                        <h4 className="font-semibold text-brand-purple mb-3">
                          Key Features:
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              Telecoms-specific content generation
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              Regulatory compliance awareness
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              Multi-platform automation
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">
                              Industry terminology understanding
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Industry Verticals */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-purple mb-6">
                  Proven Industry Verticals
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Custom AI solutions tailored to sector regulations, workflows,
                  and industry-specific intelligence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  { name: "Real Estate", icon: Building, status: "Active" },
                  {
                    name: "Property Management",
                    icon: Shield,
                    status: "Platform Development",
                  },
                  { name: "Law Firms", icon: Scale, status: "Active" },
                  {
                    name: "Compliance",
                    icon: FileText,
                    status: "Platform Development",
                  },
                  { name: "Healthcare", icon: Heart, status: "Active" },
                  { name: "Accounting", icon: Calculator, status: "Active" },
                  { name: "Telecoms", icon: Bot, status: "Beta Platform" },
                ].map((industry, index) => {
                  const Icon = industry.icon;
                  return (
                    <Card key={index} className=" ">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-6 h-6 text-brand-coral" />
                        </div>
                        <h3 className="font-bold text-brand-purple mb-2">
                          {industry.name}
                        </h3>
                        <Badge
                          variant={
                            industry.status.includes("Platform")
                              ? "default"
                              : "outline"
                          }
                          className={
                            industry.status.includes("Platform")
                              ? "bg-brand-coral text-white"
                              : "border-brand-purple text-brand-purple"
                          }
                        >
                          {industry.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Implementation Process Section */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-purple mb-6">
                  Implementation Process
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Structured approach to AI development with flexible engagement
                  models and comprehensive support.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="text-center  ">
                  <CardHeader>
                    <Clock className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      Timeline
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">3-6 months average</p>
                    <p className="text-sm text-gray-500">project duration</p>
                  </CardContent>
                </Card>

                <Card className="text-center  ">
                  <CardHeader>
                    <Zap className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      MVP Approach
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">Rapid prototyping</p>
                    <p className="text-sm text-gray-500">
                      iterative development available
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center  ">
                  <CardHeader>
                    <Shield className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      Support
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">30 days free bug fixes</p>
                    <p className="text-sm text-gray-500">
                      + ongoing monthly maintenance
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center  ">
                  <CardHeader>
                    <Target className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-purple">
                      Flexibility
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">MVP to full-scale</p>
                    <p className="text-sm text-gray-500">
                      solutions based on requirements
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Team & Technical Stack */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-purple mb-6">
                  Our Development Team & Stack
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Expert team with proven AI frameworks and full-stack
                  capabilities for end-to-end AI solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Team Composition */}
                <Card className="p-8">
                  <CardHeader>
                    <h3 className="text-2xl font-bold text-brand-purple mb-6 flex items-center gap-3">
                      <Users className="w-8 h-8 text-brand-coral" />
                      Development Team
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                          <Brain className="w-6 h-6 text-brand-coral" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-purple">
                            AI Developers
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Machine Learning & AI Specialists
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                          <Code className="w-6 h-6 text-brand-coral" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-purple">
                            Full-Stack Developers
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Frontend & Backend Integration Experts
                          </p>
                        </div>
                      </div>

                      <div className="bg-brand-wings/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-brand-purple mb-2">
                          DevOps & Infrastructure:
                        </h4>
                        <ul className="space-y-1 text-gray-600 text-sm">
                          <li>• Full deployment and DevOps</li>
                          <li>• CI/CD pipeline setup</li>
                          <li>• Monitoring and scaling</li>
                          <li>• Client or end-to-end hosting</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Stack */}
                <Card className="p-8">
                  <CardHeader>
                    <h3 className="text-2xl font-bold text-brand-purple mb-6 flex items-center gap-3">
                      <Cpu className="w-8 h-8 text-brand-coral" />
                      Technical Stack
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3">
                          Preferred AI Frameworks:
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Badge className="bg-brand-coral text-white justify-center py-2">
                            PyTorch
                          </Badge>
                          <Badge className="bg-brand-coral text-white justify-center py-2">
                            LangChain
                          </Badge>
                          <Badge className="bg-brand-coral text-white justify-center py-2">
                            TensorFlow
                          </Badge>
                          <Badge className="bg-brand-coral text-white justify-center py-2">
                            Python AI
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-brand-purple mb-3">
                          Infrastructure & Deployment:
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 text-sm">
                              Client infrastructure deployment
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 text-sm">
                              End-to-end hosting solutions
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 text-sm">
                              Cloud-native architecture
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 text-sm">
                              Scalable AI model deployment
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* === AI PROJECT SCOPING QUESTIONNAIRE (REPLACES PRICING SECTION) === */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-brand-purple mb-4">
                  AI Project Scoping Questionnaire
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Instead of generic pricing, answer these quick questions and
                  we'll prepare a{" "}
                  <span className="font-semibold text-brand-coral">
                    custom AI scoping report
                  </span>{" "}
                  tailored to your business.
                </p>
              </div>

              <Card className="shadow-xl">
                <CardHeader className="border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Step {step} of {totalSteps}
                      </p>
                      <h3 className="text-xl font-semibold text-brand-purple">
                        {step === 1 && "Industry Selection"}
                        {step === 2 && "Company Size"}
                        {step === 3 && "Primary Pain Point"}
                        {step === 4 && "Current Tools & Systems"}
                        {step === 5 && "Desired Outcome (12 Months)"}
                        {step === 6 && "Automation Priority"}
                        {step === 7 && "Budget Range"}
                        {step === 8 && "Timeline"}
                        {step === 9 && "Contact Information"}
                      </h3>
                    </div>
                    <div className="w-40">
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-coral to-brand-purple transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-right text-gray-500">
                        {Math.round(progress)}% complete
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-7 w-7 text-green-500" />
                      </div>
                      <h4 className="text-2xl font-semibold text-brand-purple mb-2">
                        Thank you! 🎉
                      </h4>
                      <p className="text-gray-600 max-w-md mx-auto">
                        We&apos;ve received your details. Our team will review
                        your answers and prepare a tailored AI scoping report
                        based on your industry, challenges, and goals.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* STEP CONTENTS */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            What industry are you in?
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {industries.map((ind) => (
                              <button
                                key={ind}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    industry: ind,
                                  }))
                                }
                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${
                                  formData.industry === ind
                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                }`}
                              >
                                {ind === "Digital Marketing Agency" && "📈 "}
                                {ind === "Real Estate" && "🏡 "}
                                {ind === "E-commerce" && "🛒 "}
                                {ind === "Property Management" && "🏢 "}
                                {ind === "Law Firm" && "⚖️ "}
                                {ind === "Telecoms" && "📡 "}
                                {ind === "Other" && "✨ "}
                                {ind}
                              </button>
                            ))}
                          </div>

                          {formData.industry === "Other" && (
                            <div className="mt-4">
                              <Label
                                htmlFor="industryOther"
                                className="text-sm text-gray-700"
                              >
                                Please specify your industry
                              </Label>
                              <Input
                                id="industryOther"
                                value={formData.industryOther}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    industryOther: e.target.value,
                                  }))
                                }
                                placeholder="e.g. Manufacturing, Education, Hospitality"
                                className="mt-2"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            How big is your company?
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {companySizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    companySize: size,
                                  }))
                                }
                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${
                                  formData.companySize === size
                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            {formData.industry === "Digital Marketing Agency"
                              ? "What's your biggest operational bottleneck?"
                              : formData.industry === "Property Management"
                              ? "What's costing you the most time/money?"
                              : "What's your biggest operational bottleneck right now?"}
                          </Label>
                          <p className="text-xs text-gray-500 mb-1">
                            Options are tailored based on your industry selection.
                          </p>
                          <div className="space-y-2">
                            {currentPainPoints.map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    painPoint: p,
                                  }))
                                }
                                className={`w-full text-left border rounded-xl px-4 py-3 text-sm transition-all ${
                                  formData.painPoint === p
                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            What tools are you currently using?
                          </Label>
                          <p className="text-xs text-gray-500 mb-1">
                            Select all that apply.
                          </p>
                          <div className="space-y-2">
                            {toolsOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleArrayValue("tools", opt)}
                                className={`w-full flex items-start gap-2 border rounded-xl px-4 py-3 text-sm transition-all ${
                                  formData.tools.includes(opt)
                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                }`}
                              >
                                <span className="mt-0.5">
                                  {formData.tools.includes(opt) ? "✅" : "⬜"}
                                </span>
                                <span>{opt}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 5 && (
                        <div className="space-y-4">
                          <Label
                            htmlFor="desiredOutcome"
                            className="text-base font-medium text-gray-800"
                          >
                            What would success look like in 12 months?
                          </Label>
                          <p className="text-xs text-gray-500">
                            2–3 sentences. For example: &quot;Reduce support
                            tickets by 50%, automate reporting, and handle
                            twice as many clients without increasing headcount.&quot;
                          </p>
                          <Textarea
                            id="desiredOutcome"
                            value={formData.desiredOutcome}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                desiredOutcome: e.target.value,
                              }))
                            }
                            placeholder="Tell us what 'great' looks like for you in 12 months..."
                            className="mt-2 min-h-[140px]"
                          />
                        </div>
                      )}

                      {step === 6 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            Which of these would have the biggest impact on your
                            business?
                          </Label>
                          <p className="text-xs text-gray-500 mb-1">
                            Select up to 3 priorities.
                          </p>
                          <div className="space-y-2">
                            {automationPriorities.map((opt) => {
                              const selected =
                                formData.automationPriority.includes(opt);
                              const reachedLimit =
                                formData.automationPriority.length >= 3 &&
                                !selected;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() =>
                                    toggleArrayValue(
                                      "automationPriority",
                                      opt,
                                      3
                                    )
                                  }
                                  className={`w-full flex items-start gap-2 border rounded-xl px-4 py-3 text-sm transition-all ${
                                    selected
                                      ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                      : reachedLimit
                                      ? "border-gray-200 opacity-60 cursor-not-allowed"
                                      : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="mt-0.5">
                                    {selected ? "✅" : "⬜"}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {step === 7 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            What&apos;s your investment range for a custom AI
                            solution?
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {budgetRanges.map((range) => (
                              <button
                                key={range}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    budgetRange: range,
                                  }))
                                }
                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${
                                  formData.budgetRange === range
                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                }`}
                              >
                                {range}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 8 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            When do you need this live?
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {timelines.map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    timeline: t,
                                  }))
                                }
                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${
                                  formData.timeline === t
                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 9 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-gray-800">
                            Where should we send your custom AI scoping report?
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name" className="text-sm text-gray-700">Name</Label>
                              <Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" className="mt-1" required />
                            </div>
                            <div>
                              <Label htmlFor="company" className="text-sm text-gray-700">Company name</Label>
                              <Input id="company" value={formData.company} onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))} placeholder="Your company" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
                              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} placeholder="you@example.com" className="mt-1" required />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-sm text-gray-700">Phone (optional)</Label>
                              <Input id="phone" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+44 ..." className="mt-1" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="questionFile" className="text-sm text-gray-700">Attach questionnaire (optional)</Label>
                            <input
                              id="questionFile"
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={step === 1}
                          onClick={handlePrev}
                          className="border-gray-300 text-gray-700"
                        >
                          Back
                        </Button>

                        {step < totalSteps ? (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold"
                          >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Sending..." : "Submit & Get My AI Scope"}
                          </Button>
                        )}
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-purple mb-6">
                  AI Technologies We Use
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Cutting-edge AI frameworks and technologies to build robust,
                  scalable solutions.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  { name: "OpenAI GPT", icon: Brain },
                  { name: "TensorFlow", icon: Cpu },
                  { name: "PyTorch", icon: Code },
                  { name: "LangChain", icon: Database },
                  { name: "Hugging Face", icon: Sparkles },
                  { name: "AutoML", icon: Zap },
                ].map((tech, index) => {
                  const Icon = tech.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-3 group- transition-shadow">
                        <Icon className="w-8 h-8 text-brand-coral" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {tech.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

{/* Contact Form Section (now a reusable component) */}
<AgencyContactSection
            sectionId="contact-form"
            heading="Ready to Scale Your Agency?"
            subheading="Get a free consultation and discover how we can help you grow."
            inquiryType="service-aid-contact-form"
            contactFormType="service-aid-contact-form"
            submissionSourceLabel="Service Page Contact Form Submission"
          />

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Stay Ahead in the AI Revolution{" "}
              </h2>
              <p className="text-xl mb-8 text-white/90">
                From multi-agent systems to industry-specific AI solutions, we
                turn your vision into intelligent automation. Get your free AI
                strategy consultation today.
              </p>
              <div className="flex flex-row gap-4 justify-center">
                <Button
                  onClick={redirectToContact}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md px-8 bg-white text-brand-coral hover:bg-gray-100 font-extrabold"
                >
                  Join Free
                </Button>
              </div>
            </div>
          </section>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}
