import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Clock, 
  Mail, 
  FileText,
  CheckCircle,
  AlertCircle,
  Globe
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
    { id: "contact", title: "Contact Us", icon: <Mail className="w-4 h-4" /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="mb-4 bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                GDPR Compliant
              </Badge>
              <h2 className="text-2xl font-bold mb-4">Privacy Protection You Can Trust</h2>
              <p className="text-gray-600">
                At BrandingBeez, we take your privacy seriously. This policy explains how we collect, 
                use, and protect your personal information when you use our services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="w-5 h-5 text-green-600" />
                    Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    All personal data is encrypted using industry-standard AES-256 encryption 
                    and stored on secure servers with regular security audits.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    You have full control over your data including the right to access, 
                    modify, or delete your information at any time.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Last Updated: January 15, 2025</h3>
              <p className="text-blue-800 text-sm">
                This privacy policy is effective as of January 15, 2025. We may update this policy 
                from time to time, and we will notify you of any significant changes.
              </p>
            </div>
          </div>
        );

      case "collection":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Information We Collect</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Contact Details</p>
                      <p className="text-sm text-gray-600">Name, email address, phone number, company name</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Business Information</p>
                      <p className="text-sm text-gray-600">Industry, company size, service requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Communication Data</p>
                      <p className="text-sm text-gray-600">Messages, chat logs, support tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Website Usage</p>
                      <p className="text-sm text-gray-600">IP address, browser type, pages visited, time spent</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Device Information</p>
                      <p className="text-sm text-gray-600">Device type, operating system, screen resolution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Analytics Data</p>
                      <p className="text-sm text-gray-600">Performance metrics, user interactions, conversion tracking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "usage":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">How We Use Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-green-600" />
                    Service Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Provide requested services and support</p>
                  <p className="text-sm">• Process payments and billing</p>
                  <p className="text-sm">• Communicate about projects and updates</p>
                  <p className="text-sm">• Customize services to your needs</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Business Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Improve our services and website</p>
                  <p className="text-sm">• Analyze usage patterns and trends</p>
                  <p className="text-sm">• Prevent fraud and ensure security</p>
                  <p className="text-sm">• Comply with legal requirements</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="w-5 h-5 text-orange-600" />
                  Marketing Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  We may send you marketing communications about our services, but only if:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">• You have explicitly opted in to receive them</p>
                  <p className="text-sm">• You are an existing client and the communications relate to similar services</p>
                  <p className="text-sm">• We have a legitimate business interest and you haven't opted out</p>
                </div>
                <p className="text-sm text-orange-600 mt-3 font-medium">
                  You can unsubscribe from marketing emails at any time.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "protection":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Data Protection & Security</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="w-5 h-5 text-green-600" />
                    Technical Safeguards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">AES-256 encryption for data at rest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">TLS 1.3 encryption for data in transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Regular security audits and updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Multi-factor authentication</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Operational Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Access controls and permissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Employee training and background checks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Secure data centers and backups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Incident response procedures</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Data Breach Notification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  In the unlikely event of a data breach that poses a risk to your privacy, 
                  we will notify you within 72 hours and provide clear information about 
                  what happened and what steps we're taking to address it.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "cookies":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Cookies & Tracking Technologies</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Essential Cookies</CardTitle>
                  <Badge className="w-fit bg-green-100 text-green-800">Always Active</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    These cookies are necessary for the website to function properly and cannot be disabled.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">• Session management and security</p>
                    <p className="text-sm">• Form submission and error handling</p>
                    <p className="text-sm">• Load balancing and performance</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analytics Cookies</CardTitle>
                  <Badge className="w-fit bg-blue-100 text-blue-800">Configurable</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Help us understand how visitors interact with our website.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">• Google Analytics (anonymized data)</p>
                    <p className="text-sm">• Page views and user journey tracking</p>
                    <p className="text-sm">• Performance metrics and optimization</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Marketing Cookies</CardTitle>
                  <Badge className="w-fit bg-orange-100 text-orange-800">Optional</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Used to deliver personalized advertisements and track campaign effectiveness.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">• Retargeting and remarketing</p>
                    <p className="text-sm">• Social media integration</p>
                    <p className="text-sm">• Conversion tracking</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Cookie Management</h3>
              <p className="text-blue-800 text-sm mb-3">
                You can manage your cookie preferences at any time through our cookie consent banner 
                or by adjusting your browser settings.
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Simple cookie preference management
                  if (window.confirm('Would you like to disable non-essential cookies? Click OK to disable or Cancel to keep them enabled.')) {
                    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: false, marketing: false }));
                    alert('Cookie preferences updated. Non-essential cookies have been disabled.');
                  } else {
                    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: true, marketing: true }));
                    alert('Cookie preferences updated. All cookies remain enabled.');
                  }
                }}
              >
                Manage Cookie Preferences
              </Button>
            </div>
          </div>
        );

      case "rights":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Privacy Rights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5 text-green-600" />
                    Right to Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Request a copy of all personal data we hold about you, 
                    including how it's used and who it's shared with.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Right to Rectification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Request correction of any inaccurate or incomplete 
                    personal information we hold about you.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Right to Erasure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Request deletion of your personal data when it's no longer 
                    necessary or you withdraw consent.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="w-5 h-5 text-purple-600" />
                    Right to Portability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Receive your personal data in a structured, machine-readable 
                    format to transfer to another service.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Response Timeframes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">• Access requests: Within 30 days</p>
                <p className="text-sm">• Correction requests: Within 30 days</p>
                <p className="text-sm">• Deletion requests: Within 30 days</p>
                <p className="text-sm">• Urgent requests: Within 72 hours</p>
              </CardContent>
            </Card>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Our Privacy Team</h2>
            
            <div className="flex justify-center">
              <Card className="border-brand-coral max-w-md w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5 text-brand-coral" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm"><strong>Email:</strong> info@brandingbeez.co.uk</p>
                  <p className="text-sm"><strong>Response:</strong> Within 48 hours</p>
                  <p className="text-sm text-gray-600">
                    For all privacy-related inquiries, data requests, and general information.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Submit a Privacy Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  To submit privacy requests, please email us directly at info@brandingbeez.co.uk with your specific request details.
                </p>
                <Button 
                  className="bg-brand-coral hover:bg-brand-coral-dark text-white"
                  onClick={() => {
                    window.location.href = 'mailto:info@brandingbeez.co.uk?subject=Privacy Request&body=Please describe your privacy request here...';
                  }}
                >
                  Send Email Request
                </Button>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Additional Information</h3>
              <p className="text-blue-800 text-sm">
                For any questions about this privacy policy or our data practices, 
                please contact us at info@brandingbeez.co.uk. We're committed to 
                protecting your privacy and will respond to all inquiries promptly.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is our priority. Learn how we protect and use your information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeSection === section.id 
                        ? "bg-brand-coral text-white" 
                        : "ray-100"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    <span className="ml-2">{section.title}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}