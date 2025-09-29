import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRegion } from "@/hooks/use-region";
import { 
  Gift, 
  Shield, 
  Clock, 
  CheckCircle, 
  Star, 
  Download,
  Mail,
  Phone,
  Zap,
  Award,
  TrendingUp,
  Users,
  Target
} from "lucide-react";

interface LeadCaptureData {
  email: string;
  name: string;
  company: string;
  service: string;
  phone?: string;
  leadMagnet?: string;
}

interface LeadCaptureOptimizedProps {
  variant?: "popup" | "inline" | "sidebar" | "footer";
  leadMagnet?: "seo-guide" | "automation-checklist" | "pricing-calculator" | "strategy-template";
  showMinimalForm?: boolean;
  showProgressiveFields?: boolean;
  showSocialProof?: boolean;
  showUrgency?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

const leadMagnets = {
  "seo-guide": {
    title: "Free SEO Strategy Guide",
    subtitle: "27-page comprehensive guide used by 500+ agencies",
    icon: <TrendingUp className="w-5 h-5" />,
    benefits: [
      "Proven SEO strategies that work in 2024",
      "Step-by-step implementation checklist",
      "Case studies from real client results",
      "Tools and resources worth $500+"
    ]
  },
  "automation-checklist": {
    title: "Business Automation Checklist",
    subtitle: "Save 20+ hours per week with these automation workflows",
    icon: <Zap className="w-5 h-5" />,
    benefits: [
      "20+ automation workflows for agencies",
      "ROI calculator for each automation",
      "Implementation timeline and costs",
      "Tool recommendations and setup guides"
    ]
  },
  "pricing-calculator": {
    title: "Agency Pricing Calculator",
    subtitle: "Price your services profitably with our proven formula",
    icon: <Target className="w-5 h-5" />,
    benefits: [
      "Profit margin calculator for all services",
      "Competitive pricing analysis",
      "Package bundling strategies",
      "Client value proposition templates"
    ]
  },
  "strategy-template": {
    title: "White-Label Strategy Template",
    subtitle: "Complete client strategy template used by top agencies",
    icon: <Award className="w-5 h-5" />,
    benefits: [
      "90-day implementation roadmap",
      "Client presentation templates",
      "ROI tracking spreadsheets",
      "Upselling and retention strategies"
    ]
  }
};

const services = [
  { value: "web-development", label: "Web Development" },
  { value: "seo", label: "SEO Services" },
  { value: "google-ads", label: "Google Ads" },
  { value: "ai-development", label: "AI Development" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "other", label: "Other" }
];

export function LeadCaptureOptimized({
  variant = "inline",
  leadMagnet = "seo-guide",
  showMinimalForm = false,
  showProgressiveFields = true,
  showSocialProof = true,
  showUrgency = true,
  title,
  subtitle,
  className = ""
}: LeadCaptureOptimizedProps) {
  const { toast } = useToast();
  const { regionConfig } = useRegion();
  const [formData, setFormData] = useState<LeadCaptureData>({
    email: '',
    name: '',
    company: '',
    service: '',
    phone: '',
    leadMagnet
  });
  const [step, setStep] = useState(1);
  const [showProgressiveForm, setShowProgressiveForm] = useState(false);

  const magnet = leadMagnets[leadMagnet];

  const leadCaptureMutation = useMutation({
    mutationFn: async (data: LeadCaptureData) => {
      // This section is specifically for the newsletter subscription, other forms use the general /api/lead-capture
      if (data.leadMagnet === "Newsletter Subscription") {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            inquiry_type: 'newsletter-contact-form',
            message: `Newsletter Subscription\n\nSubscribed to newsletter with company: ${formData.company || 'Not provided'}`,
            preferred_contact: 'email',
            country: 'US',
            topPriority: 'newsletter-subscription',
            contactFormType: 'newsletter-contact-form'
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to subscribe to newsletter');
        }
        return await response.json();
      } else {
        return await apiRequest('/api/lead-capture', 'POST', data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success! Check your email",
        description: `Your ${magnet.title} is on its way. Check your inbox in the next few minutes.`,
        duration: 7000,
      });

      // Reset form
      setFormData({
        email: '',
        name: '',
        company: '',
        service: '',
        phone: '',
        leadMagnet
      });
      setStep(1);
      setShowProgressiveForm(false);
    },
    onError: (error: any) => {
      // Extract user-friendly message from server response
      let errorMessage = "Please try again or contact us directly.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Please check your information",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1 && !showMinimalForm) {
      // Progressive profiling - show more fields after email
      setShowProgressiveForm(true);
      setStep(2);
      return;
    }

    // Set leadMagnet for newsletter specifically if it's a newsletter form
    const dataToSend = { ...formData };
    if (leadMagnet === "seo-guide" && variant === "footer") { // Assuming footer variant is for pricing calculator based on usage in FooterLeadCapture
        dataToSend.leadMagnet = "pricing-calculator";
    } else if (leadMagnet === "automation-checklist" && variant === "sidebar") { // Assuming sidebar variant is for automation checklist
        dataToSend.leadMagnet = "automation-checklist";
    } else if (leadMagnet === "seo-guide" && variant === "popup") { // Assuming popup variant is for SEO guide
        dataToSend.leadMagnet = "seo-guide";
    } else if (leadMagnet === "strategy-template" && variant === "inline") { // Assuming inline variant could be for strategy template or default
        dataToSend.leadMagnet = "strategy-template";
    } else if (leadMagnet === "pricing-calculator" && !title && !subtitle) { // For cases where leadMagnet might be implicitly pricing calculator
        dataToSend.leadMagnet = "pricing-calculator";
    }
    
    // If it's a newsletter subscription, explicitly set leadMagnet to identify it
    if (title && title.toLowerCase().includes("newsletter")) {
      dataToSend.leadMagnet = "Newsletter Subscription";
    }


    leadCaptureMutation.mutate(dataToSend);
  };

  const handleInputChange = (field: keyof LeadCaptureData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "popup":
        return "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4";
      case "sidebar":
        return "sticky top-4 max-w-sm";
      case "footer":
        return "bg-gray-50 border-t";
      default:
        return "";
    }
  };

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      <Card className="max-w-lg mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          {/* Lead Magnet Icon */}
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-brand-coral to-pink-500 rounded-full text-white w-fit">
            {magnet.icon}
          </div>

          {/* Urgency Badge */}
          {showUrgency && (
            <Badge variant="destructive" className="mx-auto mb-3 animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              Limited Time Offer
            </Badge>
          )}

          {/* Title */}
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {title || magnet.title}
          </CardTitle>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm">
            {subtitle || magnet.subtitle}
          </p>

          {/* Social Proof */}
          {showSocialProof && (
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>3,200+ Downloads</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Benefits List */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">What You'll Get:</h3>
            <ul className="space-y-2">
              {magnet.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lead Capture Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Email (Always shown) */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-1"
                autoComplete="email"
              />
            </div>

            {/* Progressive Fields (Step 2) */}
            {(showProgressiveForm || showMinimalForm === false) && (
              <>
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="mt-1"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your Agency"
                    required
                    className="mt-1"
                    autoComplete="organization"
                  />
                </div>

                <div>
                  <Label htmlFor="service" className="text-sm font-medium">
                    Primary Service Interest
                  </Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your main interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 99524 62833"
                    className="mt-1"
                    autoComplete="tel"
                  />
                </div>
              </>
            )}

            {/* CTA Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-coral to-pink-500 rand-coral-dark ink-600 text-white font-semibold py-3 text-lg rounded-full shadow-lg  "
              disabled={leadCaptureMutation.isPending}
            >
              {leadCaptureMutation.isPending ? (
                "Sending..."
              ) : step === 1 && !showMinimalForm ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Get Free Access Now
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download {magnet.title}
                </>
              )}
            </Button>

            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>No Spam</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-3 h-3" />
                <span>Always Free</span>
              </div>
            </div>

            {/* Additional Value Prop */}
            <div className="text-center mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Bonus:</strong> Get a free 15-minute consultation call with our experts
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Preset lead capture components
export function PopupLeadCapture(props: Partial<LeadCaptureOptimizedProps>) {
  return (
    <LeadCaptureOptimized
      variant="popup"
      leadMagnet="seo-guide"
      showMinimalForm={false}
      showProgressiveFields={true}
      showSocialProof={true}
      showUrgency={true}
      {...props}
    />
  );
}

export function SidebarLeadCapture(props: Partial<LeadCaptureOptimizedProps>) {
  return (
    <LeadCaptureOptimized
      variant="sidebar"
      leadMagnet="automation-checklist"
      showMinimalForm={true}
      showProgressiveFields={false}
      showSocialProof={true}
      showUrgency={false}
      {...props}
    />
  );
}

export function FooterLeadCapture(props: Partial<LeadCaptureOptimizedProps>) {
  return (
    <LeadCaptureOptimized
      variant="footer"
      leadMagnet="pricing-calculator"
      showMinimalForm={false}
      showProgressiveFields={true}
      showSocialProof={true}
      showUrgency={true}
      {...props}
    />
  );
}