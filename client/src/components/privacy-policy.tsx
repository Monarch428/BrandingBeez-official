import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";

export function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview", icon: <Shield className="w-4 h-4" /> },
    { id: "collection", title: "Data Collection", icon: <Eye className="w-4 h-4" /> },
    { id: "usage", title: "How We Use Data", icon: <Users className="w-4 h-4" /> },
    { id: "protection", title: "Data Protection", icon: <Lock className="w-4 h-4" /> },
    { id: "cookies", title: "Cookies & Tracking", icon: <Globe className="w-4 h-4" /> },
    { id: "rights", title: "Your Rights", icon: <CheckCircle className="w-4 h-4" /> },
    { id: "contact", title: "Contact Us", icon: <Mail className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="mb-4 bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Privacy Policy
              </Badge>

              {/* Responsive typography - no CLS risk */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Your Privacy Matters to Us
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                This Privacy Policy explains how BrandingBeez (“we”, “our”, or “us”) collects, uses,
                stores, and protects your personal information when you visit our website or use our services.
              </p>
            </div>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Policy Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                We are committed to protecting your personal data and handling it responsibly.
                This policy applies to all visitors, clients, and users of our website and services.
                By using our website or services, you agree to this Privacy Policy.
              </CardContent>
            </Card>
          </div>
        );

      case "collection":
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-brand-coral" />
              Information We Collect
            </h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Contact Details: Name, email address, phone number, company name",
                  "Business Information: Industry, company size, service requirements",
                  "Communication Data: Messages, emails, chat logs, support requests",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Technical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Website Usage: IP address, browser type, pages visited, time spent",
                  "Device Information: Device type, operating system, screen resolution",
                  "Analytics Data: Performance metrics, user interactions, conversion tracking",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case "usage":
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brand-coral" />
              How We Use Your Information
            </h2>

            {/* Responsive stack on mobile, no layout shifts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Users className="w-5 h-5 text-green-600" />
                    Service Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Provide requested services and customer support",
                    "Communicate about projects and service updates",
                    "Process payments and billing",
                    "Customize services to your needs",
                  ].map((item, i) => (
                    <p key={i} className="text-sm leading-relaxed">• {item}</p>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Business Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Improve our website and services",
                    "Analyze usage trends and performance",
                    "Prevent fraud and maintain security",
                    "Comply with legal and regulatory requirements",
                  ].map((item, i) => (
                    <p key={i} className="text-sm leading-relaxed">• {item}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "protection":
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-coral" />
              Data Protection & Security
            </h2>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Lock className="w-5 h-5 text-green-600" />
                  Security Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Industry-standard encryption for data at rest and in transit",
                  "Secure hosting environments",
                  "Access controls and authentication",
                  "Restricted data access",
                  "Secure backups and recovery procedures",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Data Breach Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 leading-relaxed">
                In the unlikely event of a data breach that poses a risk to your rights or privacy,
                we will investigate, mitigate, and notify affected users and authorities where required by law.
              </CardContent>
            </Card>
          </div>
        );

      case "cookies":
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-brand-coral" />
              Cookies & Tracking Technologies
            </h2>

            <div className="space-y-4">
              {[
                { title: "Essential Cookies", icon: Shield, text: "Required for website functionality, security, and performance." },
                { title: "Analytics Cookies", icon: Eye, text: "Used to analyze usage and performance (e.g., Google Analytics)." },
                { title: "Marketing Cookies", icon: Mail, text: "Used only with consent for advertising and remarketing." },
              ].map((c, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <c.icon className="w-5 h-5 text-blue-600" />
                      {c.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed">{c.text}</CardContent>
                </Card>
              ))}

              <Card>
                <CardContent className="text-sm p-4 leading-relaxed">
                  You can manage or withdraw cookie preferences via our consent banner or browser settings.
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "rights":
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-coral" />
              Your Privacy Rights
            </h2>

            <Card>
              <CardContent className="space-y-2 p-4">
                {[
                  "Right to access your personal data",
                  "Right to rectify inaccurate data",
                  "Right to erase data when no longer required",
                  "Right to data portability",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
                <p className="text-sm mt-2 leading-relaxed">We respond to privacy requests within 30 days.</p>
              </CardContent>
            </Card>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-brand-coral" />
              Contact Our Privacy Team
            </h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Mail className="w-5 h-5 text-brand-coral" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Email:</strong> info@brandingbeez.co.uk</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-sm p-4 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page.
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      {/* Responsive container padding — no CLS risk */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Reserve height for heading block to reduce micro-shifts */}
        <div className="text-center mb-8 min-h-[108px] sm:min-h-[120px]">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Your privacy is our priority.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Sticky only on lg+ to avoid mobile scroll jank */}
            <Card className="lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>

              {/* Mobile: 2-column buttons, Desktop: 1-column. No JS. */}
              <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:space-y-2 lg:gap-0">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === section.id ? "bg-brand-coral text-white" : ""
                      }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    <span className="ml-2 text-left truncate">{section.title}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card>
              {/* Responsive padding + reserve space to reduce CLS when switching sections */}
              <CardContent className="p-4 sm:p-6 lg:p-8 min-h-[520px] sm:min-h-[560px]">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
