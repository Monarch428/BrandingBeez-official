import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star } from "lucide-react";

// ✅ Turnstile widget (same one as your contact form)
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

interface CustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedService: string;
  confidence: number;
  // ✅ New: callback to let parent show ThankYouPopup
  onSuccessSubmit: () => void;
}

const allServices = [
  "Dedicated Resources",
  "SEO Services",
  "Web Development",
  "Google Ads",
  "AI Development",
];

export function CustomQuoteModal({
  isOpen,
  onClose,
  recommendedService,
  confidence,
  onSuccessSubmit,
}: CustomQuoteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyWebsite: "",
    additionalServices: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // ✅ Turnstile env + state
  const TURNSTILE_SITE_KEY = (import.meta as any).env?.VITE_TURNSTILE_SITE_KEY as
    | string
    | undefined;

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileError, setTurnstileError] = useState<string>("");

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError("");
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification expired. Please try again.");
  }, []);

  const handleTurnstileFail = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification failed. Please try again.");
  }, []);

  // ✅ Reset Turnstile when modal closes/opens (fresh verification each time)
  useEffect(() => {
    if (!isOpen) {
      setTurnstileToken("");
      setTurnstileError("");
    }
  }, [isOpen]);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const formattedMessage = `CUSTOM QUOTE REQUEST FROM SURVEY

📋 PRIMARY RECOMMENDED SERVICE: ${recommendedService} (${confidence}% confidence match)

${data.additionalServices.length > 0
          ? `
🎯 ADDITIONAL SERVICES OF INTEREST:
${data.additionalServices.map((service) => `• ${service}`).join("\n")}
`
          : ""
        }

🌐 COMPANY WEBSITE: ${data.companyWebsite}

This lead came from the "Find Your Service" survey and requested a custom quote.`;

      return apiRequest("/api/contacts", "POST", {
        name: data.name,
        email: data.email,
        company: data.companyWebsite,
        service: recommendedService,
        message: formattedMessage,
        preferred_contact: "email",
        country: "US",
        topPriority: recommendedService,
        contactFormType: "survey-custom-quote",
        servicesSelected: [recommendedService, ...data.additionalServices],

        // ✅ include turnstile token
        turnstileToken,
      });
    },
    onSuccess: () => {
      toast({
        title: "Quote Request Submitted!",
        description: "We'll get back to you within 24 hours with a custom quote.",
      });

      // ✅ Tell parent to show ThankYouPopup
      onSuccessSubmit();

      // ✅ Close the quote form modal
      onClose();

      // ✅ reset form + errors + captcha
      setFormData({
        name: "",
        email: "",
        companyWebsite: "",
        additionalServices: [],
      });
      setErrors({});
      setTurnstileToken("");
      setTurnstileError("");
    },
    onError: (error: any) => {
      console.error("Quote submission error:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        additionalServices: [...prev.additionalServices, service],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        additionalServices: prev.additionalServices.filter((s) => s !== service),
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.companyWebsite.trim()) {
      newErrors.companyWebsite = "Company website is required";
    } else if (!formData.companyWebsite.includes(".")) {
      newErrors.companyWebsite = "Please enter a valid website URL";
    }

    // ✅ Turnstile required
    if (!TURNSTILE_SITE_KEY) {
      newErrors.turnstile = "Captcha not configured (missing site key)";
    } else if (!turnstileToken) {
      newErrors.turnstile = "Please verify you are not a robot";
    }

    setErrors(newErrors);

    // Show small helper text for captcha area too
    if (newErrors.turnstile) setTurnstileError(newErrors.turnstile);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      submitMutation.mutate(formData);
    } else {
      if (!turnstileToken) {
        toast({
          title: "Captcha required",
          description: "Please complete the security verification.",
          variant: "destructive",
        });
      }
    }
  };

  const availableServices = allServices.filter(
    (service) => service !== recommendedService
  );

  return (
    <>
      {/* Quote Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Star className="w-6 h-6 text-yellow-500" />
              Get Quote
            </DialogTitle>
            <DialogDescription>
              Based on your survey answers, we'll create a personalized quote for
              your business needs.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recommended Service Card */}
            <Card className="border-2 border-green-500 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-700">
                    Your Perfect Match
                  </h3>
                  <Badge variant="secondary" className="ml-auto">
                    {confidence}% Confidence
                  </Badge>
                </div>
                <p className="text-green-800 font-medium">{recommendedService}</p>
                <p className="text-sm text-green-600 mt-1">
                  Based on your survey responses, this service is the best fit
                  for your business goals.
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="companyWebsite">Company Website *</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) =>
                    handleInputChange("companyWebsite", e.target.value)
                  }
                  placeholder="https://yourcompany.com"
                  className={errors.companyWebsite ? "border-red-500" : ""}
                />
                {errors.companyWebsite && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyWebsite}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                Interested in Other Services?
              </h3>
              <p className="text-sm text-gray-600">
                Select any additional services you might be interested in
                learning about.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableServices.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.additionalServices.includes(service)}
                      onCheckedChange={(checked) =>
                        handleServiceToggle(service, !!checked)
                      }
                    />
                    <Label
                      htmlFor={service}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Turnstile */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Security Verification{" "}
                <span className="text-red-500 font-bold">*</span>
              </Label>

              {TURNSTILE_SITE_KEY ? (
                <TurnstileWidget
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={handleTurnstileToken}
                  onExpire={handleTurnstileExpire}
                  onError={handleTurnstileFail}
                />
              ) : (
                <p className="text-sm text-red-600">
                  Turnstile site key missing. Set{" "}
                  <b>VITE_TURNSTILE_SITE_KEY</b>.
                </p>
              )}

              {turnstileError && (
                <p className="text-xs text-red-600 font-medium">
                  {turnstileError}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={submitMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-brand-coral-darker to-pink-600 hover:from-brand-coral-dark hover:to-pink-700 text-white font-semibold"
                disabled={submitMutation.isPending || !turnstileToken}
              >
                {submitMutation.isPending ? "Submitting..." : "Get Custom Quote"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
