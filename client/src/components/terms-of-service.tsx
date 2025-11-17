import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Shield, 
  CreditCard, 
  Users, 
  AlertTriangle, 
  Scale,
  Clock,
  CheckCircle,
  XCircle,
  Mail
} from "lucide-react";

export function TermsOfService() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview", icon: <FileText className="w-4 h-4" /> },
    { id: "services", title: "Our Services", icon: <Users className="w-4 h-4" /> },
    { id: "payment", title: "Payment Terms", icon: <CreditCard className="w-4 h-4" /> },
    { id: "responsibilities", title: "Responsibilities", icon: <Shield className="w-4 h-4" /> },
    { id: "intellectual", title: "Intellectual Property", icon: <Scale className="w-4 h-4" /> },
    { id: "limitation", title: "Limitations", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "termination", title: "Termination", icon: <XCircle className="w-4 h-4" /> },
    { id: "contact", title: "Contact", icon: <Mail className="w-4 h-4" /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                <FileText className="w-3 h-3 mr-1" />
                Last Updated: January 15, 2025
              </Badge>
              <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
              <p className="text-gray-600">
                These terms govern your use of BrandingBeez services. By using our services, 
                you agree to be bound by these terms.
              </p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Please read these terms carefully before using our services. 
                If you do not agree with any part of these terms, you may not use our services.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    What You Get
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Professional white-label services</p>
                  <p className="text-sm">• Dedicated account management</p>
                  <p className="text-sm">• 24/7 customer support</p>
                  <p className="text-sm">• Regular progress reports</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    What We Expect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Timely payment of invoices</p>
                  <p className="text-sm">• Accurate project information</p>
                  <p className="text-sm">• Professional communication</p>
                  <p className="text-sm">• Compliance with our policies</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Agreement Formation</h3>
              <p className="text-blue-800 text-sm">
                By submitting a service request, making a payment, or using our services, 
                you enter into a binding agreement with BrandingBeez under these terms.
              </p>
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Services</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">White-Label Digital Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    BrandingBeez provides comprehensive digital marketing and development services 
                    that agencies can offer to their clients under their own brand.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Included Services:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Search Engine Optimization (SEO)</li>
                        <li>• Website Design & Development</li>
                        <li>• Google Ads Management</li>
                        <li>• Business Process Automation</li>
                        <li>• Content Creation & Marketing</li>
                        <li>• Analytics & Reporting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Service Standards:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Professional quality deliverables</li>
                        <li>• Timely project completion</li>
                        <li>• Regular progress updates</li>
                        <li>• Dedicated account management</li>
                        <li>• Revision rounds as agreed</li>
                        <li>• Post-delivery support</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Levels & Guarantees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm"><strong>Response Time:</strong> Within 24 hours for all inquiries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm"><strong>Project Updates:</strong> Weekly progress reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm"><strong>Quality Assurance:</strong> All work reviewed before delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm"><strong>Revision Policy:</strong> Up to 3 revision rounds included</span>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Service Availability:</strong> Our services are available Monday-Friday, 
                  9 AM - 6 PM in your local timezone. Emergency support is available 24/7 
                  for critical issues.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Terms & Conditions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Payment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Project-Based Services:</p>
                    <p className="text-sm text-gray-600">50% upfront, 50% upon completion</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Monthly Retainers:</p>
                    <p className="text-sm text-gray-600">Payment due monthly in advance</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Hourly Services:</p>
                    <p className="text-sm text-gray-600">Invoiced monthly, due within 15 days</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Standard Terms:</p>
                    <p className="text-sm text-gray-600">Net 15 days from invoice date</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Late Payment Fee:</p>
                    <p className="text-sm text-gray-600">1.5% per month on overdue amounts</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Currency:</p>
                    <p className="text-sm text-gray-600">USD, EUR, or GBP as agreed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accepted Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-brand-coral" />
                    <p className="font-medium text-sm">Credit Cards</p>
                    <p className="text-xs text-gray-600">Visa, MasterCard, Amex</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-brand-coral" />
                    <p className="font-medium text-sm">Bank Transfer</p>
                    <p className="text-xs text-gray-600">Wire transfer, ACH</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-brand-coral" />
                    <p className="font-medium text-sm">Digital Payments</p>
                    <p className="text-xs text-gray-600">PayPal, Wise, Razorpay</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Refund Policy:</strong> Refunds are available within 30 days for 
                unused retainer services. Custom development work is non-refundable once 
                development begins.
              </AlertDescription>
            </Alert>
          </div>
        );

      case "responsibilities":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Client & Service Provider Responsibilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    Your Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Project Information</p>
                    <p className="text-xs text-gray-600">Provide accurate, complete project details and requirements</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Timely Communication</p>
                    <p className="text-xs text-gray-600">Respond to requests within 48 hours during business days</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Access & Credentials</p>
                    <p className="text-xs text-gray-600">Provide necessary access to platforms and systems</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Content & Assets</p>
                    <p className="text-xs text-gray-600">Supply required content, images, and brand materials</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Feedback & Approval</p>
                    <p className="text-xs text-gray-600">Review deliverables and provide feedback promptly</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                    Our Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Quality Delivery</p>
                    <p className="text-xs text-gray-600">Deliver professional, high-quality work as specified</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Timeline Adherence</p>
                    <p className="text-xs text-gray-600">Meet agreed deadlines and milestone dates</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Regular Updates</p>
                    <p className="text-xs text-gray-600">Provide weekly progress reports and status updates</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Professional Support</p>
                    <p className="text-xs text-gray-600">Maintain professional communication and support</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Confidentiality</p>
                    <p className="text-xs text-gray-600">Protect your business information and client data</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Delays & Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Common Delay Causes:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Late feedback or approval from client</li>
                    <li>• Missing or incomplete project requirements</li>
                    <li>• Third-party dependencies or integrations</li>
                    <li>• Scope changes or additional requests</li>
                    <li>• Technical issues beyond our control</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Resolution Process:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Immediate notification of any delays</li>
                    <li>• Revised timeline and mitigation plan</li>
                    <li>• Regular updates until resolution</li>
                    <li>• Compensation for delays caused by us</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "intellectual":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Intellectual Property Rights</h2>
            
            <div className="space-y-4">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Work Product Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    Upon full payment, you own all custom work created specifically for your project:
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">• Custom website designs and code</p>
                    <p className="text-sm">• Marketing content and copy</p>
                    <p className="text-sm">• Logos and brand assets (if created)</p>
                    <p className="text-sm">• Campaign strategies and documentation</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scale className="w-5 h-5 text-blue-600" />
                    Retained Rights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    BrandingBeez retains ownership of:
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">• Proprietary tools and methodologies</p>
                    <p className="text-sm">• Template designs and frameworks</p>
                    <p className="text-sm">• Knowledge and expertise gained</p>
                    <p className="text-sm">• Case studies and portfolio usage rights</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Third-Party Assets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    Some projects may include third-party components:
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">• Stock photos and graphics (separate licensing)</p>
                    <p className="text-sm">• Software plugins and themes</p>
                    <p className="text-sm">• API integrations and services</p>
                    <p className="text-sm">• Open-source components (various licenses)</p>
                  </div>
                  <p className="text-sm text-orange-600 mt-3">
                    <strong>Note:</strong> You are responsible for ongoing licensing fees for third-party assets.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Portfolio Usage:</strong> We may use non-confidential aspects of your 
                project in our portfolio and marketing materials unless you specifically 
                opt out in writing.
              </AlertDescription>
            </Alert>
          </div>
        );

      case "limitation":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Limitation of Liability</h2>
            
            <Alert className="border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>Important Legal Notice:</strong> Please read this section carefully as it 
                limits our liability and your legal remedies.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Disclaimers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Performance Results</p>
                    <p className="text-xs text-gray-600">
                      While we strive for excellent results, we cannot guarantee specific 
                      outcomes like search rankings, conversion rates, or revenue increases.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Third-Party Services</p>
                    <p className="text-xs text-gray-600">
                      We are not responsible for issues with third-party platforms, 
                      APIs, or services beyond our control.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Technical Issues</p>
                    <p className="text-xs text-gray-600">
                      Technology inherently involves risks. We cannot guarantee 
                      100% uptime or complete absence of technical issues.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Liability Limitations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Maximum Liability</p>
                    <p className="text-xs text-gray-600">
                      Our total liability for any claim shall not exceed the amount 
                      paid by you for the specific service in question.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Excluded Damages</p>
                    <p className="text-xs text-gray-600">
                      We are not liable for indirect, incidental, special, 
                      consequential, or punitive damages.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Time Limit</p>
                    <p className="text-xs text-gray-600">
                      Any claims must be brought within one year of the 
                      incident giving rise to the claim.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Indemnification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    You agree to indemnify and hold BrandingBeez harmless from any claims arising from:
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">• Your use of our services</p>
                    <p className="text-sm">• Your violation of these terms</p>
                    <p className="text-sm">• Your violation of any third-party rights</p>
                    <p className="text-sm">• Content you provide that infringes on rights</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "termination":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Termination & Cancellation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    By You (Client)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Project-Based Services</p>
                    <p className="text-xs text-gray-600">
                      Cancel anytime with 7 days written notice. 
                      Pay for work completed to date.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Monthly Retainers</p>
                    <p className="text-xs text-gray-600">
                      Cancel with 30 days written notice. 
                      No refund for current month.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Annual Contracts</p>
                    <p className="text-xs text-gray-600">
                      Early termination fee may apply. 
                      See specific contract terms.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                    By Us (BrandingBeez)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Non-Payment</p>
                    <p className="text-xs text-gray-600">
                      Services suspended after 30 days overdue. 
                      Terminated after 60 days.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Breach of Terms</p>
                    <p className="text-xs text-gray-600">
                      Immediate termination for serious violations. 
                      30 days notice for minor breaches.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">Business Reasons</p>
                    <p className="text-xs text-gray-600">
                      60 days notice for business reasons. 
                      Refund unused portions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post-Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Data & File Transfer:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• All project files delivered within 30 days</li>
                    <li>• Access credentials transferred securely</li>
                    <li>• Documentation and passwords provided</li>
                    <li>• Transition support for 30 days (if needed)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ongoing Obligations:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Payment of outstanding invoices</li>
                    <li>• Confidentiality obligations continue</li>
                    <li>• Intellectual property rights respected</li>
                    <li>• Return of any confidential materials</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Notice Requirement:</strong> All termination notices must be sent via 
                email to info@brandingbeez.co.uk and confirmed via certified mail to be valid.
              </AlertDescription>
            </Alert>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Legal & Business Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-brand-coral">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scale className="w-5 h-5 text-brand-coral" />
                    Legal Department
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm"><strong>Email:</strong> info@brandingbeez.co.uk</p>
                  <p className="text-sm"><strong>Response:</strong> Within 48 hours</p>
                  <p className="text-sm text-gray-600">
                    For all legal inquiries, contract questions, and terms of service matters.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5 text-blue-500" />
                    General Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm"><strong>Email:</strong> info@brandingbeez.co.uk</p>
                  <p className="text-sm"><strong>Response:</strong> Within 48 hours</p>
                  <p className="text-sm text-gray-600">
                    For general inquiries, support, and business communications.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Resolution Process:</h4>
                  <ol className="space-y-1 text-sm text-gray-600">
                    <li>1. Direct negotiation between parties (30 days)</li>
                    <li>2. Mediation with neutral third party (60 days)</li>
                    <li>3. Binding arbitration if mediation fails</li>
                    <li>4. Arbitration conducted under AAA Commercial Rules</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Governing Law:</h4>
                  <p className="text-sm text-gray-600">
                    These terms are governed by the laws of New York State, 
                    without regard to conflict of law principles.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Changes to Terms</h3>
              <p className="text-gray-700 text-sm">
                We may update these terms from time to time. We'll notify you of any 
                material changes via email at least 30 days before they take effect. 
                Continued use of our services constitutes acceptance of updated terms.
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Clear terms for a transparent partnership. Understanding our mutual commitments.
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