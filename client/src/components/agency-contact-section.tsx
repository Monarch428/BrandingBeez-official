import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
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

// ✅ Turnstile widget (same one you used in ContactFormOptimized)
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

// ✅ Lazy-load heavy phone input library (reduces initial JS)
const PhoneInput = lazy(() => import("react-phone-input-2"));

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

  // ✅ UTM hidden fields
  utm_campaign_name: string;
  utm_adgroup_name: string;
  utm_keyword: string;
  utm_location: string;
  utm_device: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  servicesInterested?: string;
  subServices?: string;
  turnstile?: string;
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

/* ===========================
   ✅ Small UI helpers (same style vibe as your ContactFormOptimized)
=========================== */
const RequiredMark = () => <span className="text-red-500 font-bold"> *</span>;

const FieldShell: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => <div className={`space-y-1.5 ${className}`}>{children}</div>;

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

  // ✅ Turnstile env
  const TURNSTILE_SITE_KEY = (import.meta as any).env?.VITE_TURNSTILE_SITE_KEY as
    | string
    | undefined;

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileError, setTurnstileError] = useState<string>("");

  // ✅ Default country always US + persist user selection
  const DEFAULT_COUNTRY = "us";
  const COUNTRY_STORAGE_KEY = "bb_phone_country";

  // ✅ UTM session storage key
  const UTM_KEY = "bb_utm_params";

  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (saved && typeof saved === "string") {
      setCountryCode(saved);
    } else {
      setCountryCode(DEFAULT_COUNTRY);
    }
  }, []);

  const setCountryPersisted = (cc: string) => {
    setCountryCode(cc);
    if (typeof window !== "undefined") {
      localStorage.setItem(COUNTRY_STORAGE_KEY, cc);
    }
  };

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

    // ✅ UTM defaults
    utm_campaign_name: "",
    utm_adgroup_name: "",
    utm_keyword: "",
    utm_location: "",
    utm_device: "",
  });

  // ---------------------------
  // ✅ UTM CAPTURE (URL → sessionStorage → formData)
  // ---------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const read = (k: string) => (params.get(k) || "").trim();

    const utmFromUrl = {
      utm_campaign_name: read("utm_campaign_name"),
      utm_adgroup_name: read("utm_adgroup_name"),
      utm_keyword: read("utm_keyword"),
      utm_location: read("utm_location"),
      utm_device: read("utm_device"),
    };

    let stored: any = {};
    try {
      const raw = sessionStorage.getItem(UTM_KEY);
      stored = raw ? JSON.parse(raw) : {};
    } catch {
      stored = {};
    }

    const merged = {
      ...stored,
      ...Object.fromEntries(
        Object.entries(utmFromUrl).filter(([, v]) => typeof v === "string" && v.length > 0),
      ),
    };

    try {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }

    setFormData((prev) => ({
      ...prev,
      utm_campaign_name: prev.utm_campaign_name || merged.utm_campaign_name || "",
      utm_adgroup_name: prev.utm_adgroup_name || merged.utm_adgroup_name || "",
      utm_keyword: prev.utm_keyword || merged.utm_keyword || "",
      utm_location: prev.utm_location || merged.utm_location || "",
      utm_device: prev.utm_device || merged.utm_device || "",
    }));
  }, []);

  const [errors, setErrors] = useState<FormErrors>({});

  // ✅ UI tokens
  const fieldLabelClass = "text-sm font-semibold text-gray-900";
  const fieldHintClass = "text-xs text-gray-500 leading-relaxed";
  const errorTextClass = "text-xs text-red-600 font-medium";
  const inputBaseClass =
    "h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200";
  const selectTriggerClass =
    "h-12 rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200";
  const errorRingClass = "border-red-300 focus:border-red-400 focus:ring-red-200";

  const clearError = (key: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => {
      if (field === "servicesInterested") {
        return { ...prev, [field]: value, subServices: [] };
      }
      return { ...prev, [field]: value };
    });

    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "servicesInterested") setErrors((prev) => ({ ...prev, subServices: undefined }));
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

  // ✅ Lazy-load libphonenumber-js only when needed (reduces initial JS)
  const isValidPhone = async (phone: string) => {
    if (!phone) return false;
    try {
      const { parsePhoneNumberFromString } = await import("libphonenumber-js");
      const parsed = parsePhoneNumberFromString(`+${phone}`);
      return parsed?.isValid() ?? false;
    } catch {
      return false;
    }
  };

  const validateForm = async () => {
    const newErrors: FormErrors = {};

    // Name
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters.";

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = "Enter a valid email address.";

    // Phone
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    else {
      const ok = await isValidPhone(formData.phone);
      if (!ok) newErrors.phone = "Enter a valid phone number.";
    }

    // Service
    if (!formData.servicesInterested) newErrors.servicesInterested = "Select a service.";

    // Sub-services
    if (formData.servicesInterested && formData.subServices.length === 0) {
      newErrors.subServices = "Select at least one option.";
    }

    // Turnstile
    if (!TURNSTILE_SITE_KEY) {
      newErrors.turnstile = "Turnstile site key missing. Set VITE_TURNSTILE_SITE_KEY.";
    } else if (!turnstileToken) {
      newErrors.turnstile = "Please verify you are not a robot.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // ✅ Turnstile handlers (same behavior)
  // ---------------------------
  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError("");
    clearError("turnstile");
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification expired. Please try again.");
  }, []);

  const handleTurnstileFail = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification failed. Please try again.");
  }, []);

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/contacts", "POST", data);
    },
    onSuccess: () => {
      // ✅ Fire conversion only after success
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

        utm_campaign_name: "",
        utm_adgroup_name: "",
        utm_keyword: "",
        utm_location: "",
        utm_device: "",
      });

      setErrors({});
      setTurnstileToken("");
      setTurnstileError("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) {
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
        comprehensiveMessage += `\n• Sub-services: ${formData.subServices.join(", ")}`;
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
      servicesSelected: formData.subServices.length > 0 ? formData.subServices : undefined,
      contactFormType,
      phoneCountry: formData.countryCode || countryCode,

      // ✅ Turnstile token (send to backend)
      turnstileToken,

      // ✅ UTM tracking fields
      utm_campaign_name: formData.utm_campaign_name,
      utm_adgroup_name: formData.utm_adgroup_name,
      utm_keyword: formData.utm_keyword,
      utm_location: formData.utm_location,
      utm_device: formData.utm_device,
    };

    contactMutation.mutate(submissionData);
  };

  const subServiceError = errors.subServices;

  return (
    <section id={sectionId} className="py-14 sm:py-16 px-4 sm:px-6 bg-white">
      {/* ✅ Premium background blobs like your contact form */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="absolute -bottom-24 left-12 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />
        </div>

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
            {/* ✅ Right Column - Contact Form */}
            <div className="order-1 lg:order-2">
              <Card className="rounded-2xl border border-gray-200/70 shadow-lg overflow-hidden">
                <CardTitle className="text-center font-bold text-gray-900 text-lg sm:text-xl mt-4">
                  Schedule Strategy Call
                </CardTitle>

                <CardContent className="p-5 sm:p-8 !pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ✅ Hidden UTM fields */}
                    <input type="hidden" name="utm_campaign_name" value={formData.utm_campaign_name} />
                    <input type="hidden" name="utm_adgroup_name" value={formData.utm_adgroup_name} />
                    <input type="hidden" name="utm_keyword" value={formData.utm_keyword} />
                    <input type="hidden" name="utm_location" value={formData.utm_location} />
                    <input type="hidden" name="utm_device" value={formData.utm_device} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <FieldShell>
                        <Label htmlFor="name" className={fieldLabelClass}>
                          Name <RequiredMark />
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={`${inputBaseClass} ${errors.name ? errorRingClass : ""}`}
                          placeholder="Enter your full name"
                          autoComplete="name"
                        />
                        {errors.name && <p className={errorTextClass}>{errors.name}</p>}
                      </FieldShell>

                      <FieldShell>
                        <Label htmlFor="email" className={fieldLabelClass}>
                          Email <RequiredMark />
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`${inputBaseClass} ${errors.email ? errorRingClass : ""}`}
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                        {errors.email && <p className={errorTextClass}>{errors.email}</p>}
                      </FieldShell>

                      <FieldShell>
                        <Label htmlFor="phone" className={fieldLabelClass}>
                          Phone <RequiredMark />
                        </Label>

                        <Suspense
                          fallback={<div className="w-full h-12 rounded-xl bg-gray-100 border border-gray-200" />}
                        >
                          <div
                            className={`rounded-xl border bg-white shadow-sm ${errors.phone ? "border-red-300" : "border-gray-200"
                              } focus-within:ring-2 focus-within:ring-purple-200 focus-within:border-purple-300`}
                          >
                            <PhoneInput
                              country={countryCode as any}
                              value={formData.phone}
                              onChange={(value: string, data: any) => {
                                if (data?.countryCode) {
                                  const cc = String(data.countryCode).toLowerCase();
                                  setCountryPersisted(cc);
                                  handleInputChange("countryCode", cc);
                                }
                                handleInputChange("phone", value);
                              }}
                              inputProps={{
                                name: "phone",
                                id: "phone",
                                autoComplete: "tel",
                                placeholder: phonePlaceholders[countryCode] || "Enter your phone number",
                              }}
                              containerClass="w-full"
                              inputClass="!w-full !h-12 !border-0 !shadow-none !rounded-xl !pl-14 !pr-4 !text-gray-900 placeholder:!text-gray-400 focus:!ring-0"
                              buttonClass="!border-0 !bg-transparent !rounded-xl"
                              dropdownClass="!rounded-xl !z-[9999] !shadow-xl"
                            />
                          </div>
                        </Suspense>

                        {errors.phone && <p className={errorTextClass}>{errors.phone}</p>}
                        <p className={fieldHintClass}>We’ll only use this to contact you about your request.</p>
                      </FieldShell>

                      <FieldShell>
                        <Label htmlFor="agencyName" className={fieldLabelClass}>
                          Agency Name <span className="text-gray-400 font-medium">(optional)</span>
                        </Label>
                        <Input
                          id="agencyName"
                          type="text"
                          value={formData.agencyName}
                          onChange={(e) => handleInputChange("agencyName", e.target.value)}
                          className={inputBaseClass}
                          placeholder="Your agency name"
                          autoComplete="organization"
                        />
                      </FieldShell>

                      <FieldShell className="md:col-span-2">
                        <Label htmlFor="servicesInterested" className={fieldLabelClass}>
                          Services Interested In <RequiredMark />
                        </Label>
                        <Select
                          value={formData.servicesInterested}
                          onValueChange={(value) => handleInputChange("servicesInterested", value)}
                        >
                          <SelectTrigger
                            aria-label="Select services interested in"
                            className={`${selectTriggerClass} ${errors.servicesInterested ? "border-red-300" : ""
                              }`}
                          >
                            <SelectValue placeholder="Select services" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SEO Services">SEO/AIO Services</SelectItem>
                            <SelectItem value="PPC/Google Ads">PPC/Google Ads</SelectItem>
                            <SelectItem value="Website Development">Website Development</SelectItem>
                            <SelectItem value="Custom Web & Mobile Application Development (AI-Powered)">
                              Custom Web & Mobile Application Development (AI-Powered)
                            </SelectItem>
                            <SelectItem value="Dedicated Resource">Dedicated Resource</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.servicesInterested && (
                          <p className={errorTextClass}>{errors.servicesInterested}</p>
                        )}
                        <p className={fieldHintClass}>
                          Choose the primary service. Then select what you’re specifically looking for.
                        </p>
                      </FieldShell>
                    </div>

                    {/* Sub-Service Selection */}
                    {formData.servicesInterested && (
                      <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <Label className="text-sm font-semibold text-gray-900">
                            What are you specifically looking for in {formData.servicesInterested}? <RequiredMark />
                          </Label>
                          {subServiceError && <p className={errorTextClass}>{subServiceError}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {formData.servicesInterested === "SEO Services" &&
                            [
                              "Link building",
                              "Local SEO",
                              "Technical SEO audit & fixes",
                              "Content marketing & SEO Blogging",
                              "E-Commerce SEO",
                            ].map((option) => (
                              <div
                                key={option}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                              >
                                <Checkbox
                                  id={option}
                                  checked={formData.subServices.includes(option)}
                                  onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                />
                                <Label htmlFor={option} className="text-sm font-medium cursor-pointer text-gray-800">
                                  {option}
                                </Label>
                              </div>
                            ))}

                          {formData.servicesInterested === "PPC/Google Ads" &&
                            ["Starter Package", "Growth Package", "Scale Package"].map((option) => (
                              <div
                                key={option}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                              >
                                <Checkbox
                                  id={option}
                                  checked={formData.subServices.includes(option)}
                                  onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                />
                                <Label htmlFor={option} className="text-sm font-medium cursor-pointer text-gray-800">
                                  {option}
                                </Label>
                              </div>
                            ))}

                          {formData.servicesInterested === "Website Development" &&
                            ["WordPress", "Shopify", "BigCommerce", "Custom Coded"].map((option) => (
                              <div
                                key={option}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                              >
                                <Checkbox
                                  id={option}
                                  checked={formData.subServices.includes(option)}
                                  onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                />
                                <Label htmlFor={option} className="text-sm font-medium cursor-pointer text-gray-800">
                                  {option}
                                </Label>
                              </div>
                            ))}

                          {formData.servicesInterested === "Dedicated Resource" &&
                            [
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
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                              >
                                <Checkbox
                                  id={option}
                                  checked={formData.subServices.includes(option)}
                                  onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                />
                                <Label htmlFor={option} className="text-sm font-medium cursor-pointer text-gray-800">
                                  {option}
                                </Label>
                              </div>
                            ))}

                          {formData.servicesInterested ===
                            "Custom Web & Mobile Application Development (AI-Powered)" &&
                            [
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
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                              >
                                <Checkbox
                                  id={option}
                                  checked={formData.subServices.includes(option)}
                                  onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
                                />
                                <Label htmlFor={option} className="text-sm font-medium cursor-pointer text-gray-800">
                                  {option}
                                </Label>
                              </div>
                            ))}
                        </div>

                        {subServiceError && <p className={errorTextClass}>{subServiceError}</p>}
                      </div>
                    )}

                    <FieldShell>
                      <Label htmlFor="message" className={fieldLabelClass}>
                        Message <span className="text-gray-400 font-medium">(optional)</span>
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us about your agency and goals..."
                        className="min-h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200 placeholder:text-gray-400"
                      />
                      <p className={fieldHintClass}>
                        Share links, goals, or anything that helps us understand your needs.
                      </p>
                    </FieldShell>

                    {/* ✅ Turnstile block (same style) */}
                    <div className="space-y-3">
                      <Label className={fieldLabelClass}>
                        Security Verification <RequiredMark />
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
                          Turnstile site key missing. Set <b>VITE_TURNSTILE_SITE_KEY</b>.
                        </p>
                      )}

                      {(errors.turnstile || turnstileError) && (
                        <p className={errorTextClass}>{errors.turnstile || turnstileError}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending || !turnstileToken}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-sm hover:opacity-95"
                    >
                      {contactMutation.isPending ? "Submitting..." : "Schedule Strategy Call →"}
                    </Button>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      By submitting this form, you agree to our{" "}
                      <a
                        href="/privacy-policy"
                        className="underline underline-offset-2 text-gray-700 hover:text-gray-900"
                      >
                        Privacy Policy
                      </a>{" "}
                      and consent to the processing of your personal data for the purpose of responding to your inquiry.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* ✅ Left Column - Strategy Call Agenda */}
            <div className="order-2 lg:order-1 space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-2xl border border-purple-100 shadow-sm">
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
                      title: "Delivery & Workflow Alignment",
                      desc: "Defining communication, timelines, and quality benchmarks",
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
                        <p className="text-gray-700 text-xs sm:text-sm mt-1">{item.desc}</p>
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
          </div>

          <ThankYouPopup
            isOpen={showThankYouPopup}
            onClose={() => setShowThankYouPopup(false)}
            title={thankYouTitle}
            message={thankYouMessage}
            formType={thankYouFormType}
          />
        </div>
      </div>
    </section>
  );
};

export default AgencyContactSection;
