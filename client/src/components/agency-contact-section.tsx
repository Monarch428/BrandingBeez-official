import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ThankYouPopup } from "@/components/thank-you-popup";
import { useRegion } from "@/hooks/use-region";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PhoneInput, { CountryData } from "react-phone-input-2";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/* ===========================
   ✅ Google Ads Conversion
   - Fires ONLY after successful form submission (onSuccess)
   - CSP-safe (no inline script)
=========================== */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const triggerGoogleAdsConversion = (redirectUrl?: string) => {
  if (typeof window === "undefined") return;

  if (!window.gtag) {
    console.warn("[Google Ads] gtag not loaded; conversion not sent yet.");
    return;
  }

  const callback = () => {
    if (redirectUrl) window.location.href = redirectUrl;
  };

  window.gtag("event", "conversion", {
    send_to: "AW-17781107849/nR9PCImFxdcbEInZ2J5C",
    event_callback: callback,
  });
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  agencyName: string;
  servicesInterested: string;
  subServices: string[];
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  servicesInterested?: string;
  subServices?: string;
};

// ✅ Phone placeholders per country (extend as needed)
const phonePlaceholders: Record<string, string> = {
  us: "(201) 555-0123",
  gb: "07123 456789",
  in: "98765 43210",
  au: "0400 000 000",
};

interface AgencyContactSectionProps {
  sectionId?: string;
  heading?: string;
  subheading?: string;
  inquiryType?: string;
  contactFormType?: string;
  submissionSourceLabel?: string;
  thankYouTitle?: string;
  thankYouMessage?: string;
  thankYouFormType?: string;
}

const AgencyContactSection: React.FC<AgencyContactSectionProps> = ({
  sectionId = "contact-form",
  heading = "Ready to Scale Your Agency?",
  subheading = "Get a free consultation and discover how we can help you grow.",
  inquiryType = "home-contact-form",
  contactFormType = "home-contact-form",
  submissionSourceLabel = "Home Page Contact Form Submission",
  thankYouTitle = "Thank You for Submitting!",
  thankYouMessage = "We've received your strategy request and will get back to you within 24 hours to discuss how we can help scale your agency.",
  thankYouFormType = "strategy",
}) => {
  const { regionConfig } = useRegion();
  const { toast } = useToast();

  // 🌍 Auto-detect country for phone input
  const [countryCode, setCountryCode] = useState<string>("us");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      const region = locale.split("-")[1]?.toLowerCase();
      if (region) {
        setCountryCode(region);
      }
    } catch {
    }
  }, []);

  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    agencyName: "",
    servicesInterested: "",
    subServices: [],
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => {
      if (field === "servicesInterested") {
        return { ...prev, [field]: value, subServices: [] };
      }
      return { ...prev, [field]: value };
    });

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubServiceChange = (subService: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      subServices: checked
        ? [...prev.subServices, subService]
        : prev.subServices.filter((s) => s !== subService),
    }));
    setErrors((prev) => ({ ...prev, subServices: undefined }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else {
      const phoneNumber = parsePhoneNumberFromString(`+${formData.phone}`);
      if (!phoneNumber || !phoneNumber.isValid()) {
        newErrors.phone = "Enter a valid phone number.";
      }
    }

    // Service
    if (!formData.servicesInterested) {
      newErrors.servicesInterested = "Select a service.";
    }

    // Sub-services
    if (formData.servicesInterested && formData.subServices.length === 0) {
      newErrors.subServices = "Select at least one option.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/contacts", "POST", data);
    },
    onSuccess: () => {
      // ✅ Fire Google Ads conversion only after successful submission
      triggerGoogleAdsConversion();

      setShowThankYouPopup(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        countryCode: "",
        agencyName: "",
        servicesInterested: "",
        subServices: [],
        message: "",
      });
      setErrors({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the highlighted errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    let comprehensiveMessage = submissionSourceLabel;

    if (formData.servicesInterested) {
      comprehensiveMessage += `\n\n📋 SERVICES REQUESTED:\n• Primary Service: ${formData.servicesInterested}`;
      if (formData.subServices.length > 0) {
        comprehensiveMessage += `\n• Sub-services: ${formData.subServices.join(
          ", "
        )}`;
      }
    }

    if (formData.message) {
      comprehensiveMessage += `\n\n💬 CUSTOMER MESSAGE:\n${formData.message}`;
    }

    comprehensiveMessage += `\n\n📍 REGION: ${regionConfig.name}`;

    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      company: formData.agencyName || "Not provided",
      inquiry_type: inquiryType,
      message: comprehensiveMessage,
      preferred_contact: "email",
      country: regionConfig.name,
      topPriority: formData.servicesInterested || "general-inquiry",
      agencyName: formData.agencyName,
      service: formData.servicesInterested,
      servicesSelected:
        formData.subServices.length > 0 ? formData.subServices : undefined,
      contactFormType,
      phoneCountry: formData.countryCode || countryCode,
    };

    contactMutation.mutate(submissionData);
  };

  return (
    <section
      id={sectionId}
      className="py-14 sm:py-16 px-4 sm:px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            {heading}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 px-2 sm:px-0 max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Strategy Call Agenda */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-xl border border-purple-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                What to Expect in Your 30-Minute Strategy Call
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    title: "Business Discovery",
                    desc: "Understanding your agency model, services, and growth goals",
                  },
                  {
                    title: "Challenge Identification",
                    desc: "Identifying delivery bottlenecks and scaling challenges",
                  },
                  {
                    title: "Collaboration Opportunities",
                    desc: "Exploring where our white-label services fit your offering",
                  },
                  {
                    title: "Resource Assessment",
                    desc: "Recommending the right talent and service mix",
                  },
                  {
                    title: "Partnership Benefits",
                    desc: "Aligning for long-term, white-label collaboration",
                  },
                  {
                    title: "Next Steps",
                    desc: "Clear action plan if there’s a strong mutual fit",
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {item.title}
                      </span>
                      <p className="text-gray-700 text-xs sm:text-sm mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-2 border-t border-purple-200">
                <p className="text-xs sm:text-sm text-gray-700 italic">
                  This call is a genuine B2B discussion focused on partnership and growth.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-center font-bold text-gray-900 text-lg sm:text-xl">
                  Schedule Strategy Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone *
                      </Label>

                      <PhoneInput
                        country={countryCode as any}
                        value={formData.phone}
                        onChange={(value, data: CountryData) => {
                          if (data?.countryCode) {
                            const cc = data.countryCode.toLowerCase();
                            setCountryCode(cc);
                            handleInputChange("countryCode", cc);
                          }
                          handleInputChange("phone", value);
                        }}
                        inputProps={{
                          name: "phone",
                          className:
                            "w-full h-10 rounded-md border border-gray-300 pl-12 pr-3 text-gray-900 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral",
                          placeholder:
                            phonePlaceholders[countryCode] ||
                            "Enter your phone number",
                        }}
                        containerClass="w-full"
                        isValid={(value: string) => {
                          if (!value) return true;
                          const phoneNumber =
                            parsePhoneNumberFromString(`+${value}`);
                          return phoneNumber ? phoneNumber.isValid() : "";
                        }}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="agencyName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Agency Name
                      </Label>
                      <Input
                        id="agencyName"
                        type="text"
                        value={formData.agencyName}
                        onChange={(e) =>
                          handleInputChange("agencyName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="servicesInterested"
                      className="text-sm font-medium text-gray-700"
                    >
                      Services Interested In *
                    </Label>
                    <Select
                      value={formData.servicesInterested}
                      onValueChange={(value) =>
                        handleInputChange("servicesInterested", value)
                      }
                    >
                      <SelectTrigger aria-label="Select services interested in">
                        <SelectValue placeholder="Select services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEO Services">
                          SEO/AIO Services
                        </SelectItem>
                        <SelectItem value="PPC/Google Ads">
                          PPC/Google Ads
                        </SelectItem>
                        <SelectItem value="Website Development">
                          Website Development
                        </SelectItem>
                        <SelectItem value="Custom Web & Mobile Application Development (AI-Powered)">
                          Custom Web & Mobile Application Development (AI-Powered)
                        </SelectItem>
                        <SelectItem value="Dedicated Resource">
                          Dedicated Resource
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.servicesInterested && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.servicesInterested}
                      </p>
                    )}
                  </div>

                  {/* Sub-Service Selection */}
                  {formData.servicesInterested && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        What are you specifically looking for in{" "}
                        {formData.servicesInterested}
                        ? *
                      </Label>
                      <div className="grid grid-cols-1 gap-3">
                        {/* SEO Services Options */}
                        {formData.servicesInterested === "SEO Services" && (
                          <>
                            {[
                              "Link building",
                              "Local SEO",
                              "Technical SEO audit & fixes",
                              "Content marketing & SEO Blogging",
                              "E-Commerce SEO",
                            ].map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={option}
                                  checked={formData.subServices.includes(
                                    option
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleSubServiceChange(option, !!checked)
                                  }
                                />
                                <Label
                                  htmlFor={option}
                                  className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </>
                        )}

                        {/* PPC/Google Ads Options */}
                        {formData.servicesInterested === "PPC/Google Ads" && (
                          <>
                            {[
                              "Starter Package",
                              "Growth Package",
                              "Scale Package",
                            ].map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={option}
                                  checked={formData.subServices.includes(
                                    option
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleSubServiceChange(option, !!checked)
                                  }
                                />
                                <Label
                                  htmlFor={option}
                                  className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </>
                        )}

                        {/* Website Development Options */}
                        {formData.servicesInterested ===
                          "Website Development" && (
                            <>
                              {[
                                "WordPress",
                                "Shopify",
                                "BigCommerce",
                                "Custom Coded",
                              ].map((option) => (
                                <div
                                  key={option}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={option}
                                    checked={formData.subServices.includes(
                                      option
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleSubServiceChange(option, !!checked)
                                    }
                                  />
                                  <Label
                                    htmlFor={option}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </>
                          )}

                        {/* Dedicated Resource Options */}
                        {formData.servicesInterested ===
                          "Dedicated Resource" && (
                            <>
                              {[
                                "Graphic Designer",
                                "Video Editor",
                                "SEO Specialist",
                                "Google Ads Expert",
                                "Web Developer",
                                "Full-Stack Developer",
                                "Others (Data Entry/Virtual Assistants/Social Media Managers)",
                              ].map((option) => (
                                <div
                                  key={option}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={option}
                                    checked={formData.subServices.includes(
                                      option
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleSubServiceChange(option, !!checked)
                                    }
                                  />
                                  <Label
                                    htmlFor={option}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </>
                          )}

                        {/* Custom Web & Mobile Application Development (AI-Powered) Options */}
                        {formData.servicesInterested ===
                          "Custom Web & Mobile Application Development (AI-Powered)" && (
                            <>
                              {[
                                "AI Powered web app/Mobile app development",
                                "AI Agentic Platform development",
                                "AI Integration into existing platforms",
                                "Prototype / MVP Mobile App",
                                "Full-Scale Production App",
                                "iOS & Android App (Native/Hybrid)",
                                "Web + Mobile App Bundle",
                                "Redesign / Rebuild Existing App",
                                "Ongoing Maintenance & Feature Updates",
                              ].map((option) => (
                                <div
                                  key={option}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={option}
                                    checked={formData.subServices.includes(
                                      option
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleSubServiceChange(option, !!checked)
                                    }
                                  />
                                  <Label
                                    htmlFor={option}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </>
                          )}
                      </div>
                      {errors.subServices && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.subServices}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Tell us about your agency and goals..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full font-bold py-3 text-white bg-gradient-to-r from-brand-coral-dark to-brand-coral-darker hover:from-brand-coral hover:to-brand-coral-dark shadow-lg text-sm sm:text-base"
                  >
                    {contactMutation.isPending
                      ? "Submitting..."
                      : "Schedule Strategy Call"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <ThankYouPopup
          isOpen={showThankYouPopup}
          onClose={() => setShowThankYouPopup(false)}
          title={thankYouTitle}
          message={thankYouMessage}
          formType={thankYouFormType}
        />
      </div>
    </section>
  );
};

export default AgencyContactSection;
