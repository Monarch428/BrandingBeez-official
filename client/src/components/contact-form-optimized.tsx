import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Lock, CheckCircle, Clock, Star, Award, Plus, Minus, Gift, Copy } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  websiteDetails: {
    platform: string;
    tier: string;
  };
  dedicatedResourceDetails: {
    roles: Array<{
      type: string;
      skillLevel: string;
      quantity: number;
    }>;
  };
  seoDetails: string[];
  googleAdsDetails: string[];
  n8nDetails: string[];
  aiDetails: string[];
  message: string;
  region: string;
  budget: string;
  timeline: string;
  referral: string;
  couponCode: string;
}

const services = [
  { value: "website-development", label: "Website Development" },
  { value: "seo", label: "SEO Services" },
  { value: "google-ads", label: "Google Ads" },
  { value: "dedicated-resources", label: "Dedicated Resources" },
  { value: "n8n-automations", label: "N8N Automations" },
  { value: "ai-development", label: "AI Web Agents/AI Development" },
  { value: "other", label: "Other" }
];

const websitePlatforms = [
  { value: "wordpress", label: "WordPress" },
  { value: "shopify", label: "Shopify" },
  { value: "bigcommerce", label: "BigCommerce" },
  { value: "custom-coded", label: "Custom Coded" }
];

const websiteTiers = [
  { value: "starter", label: "Starter" },
  { value: "business", label: "Business" },
  { value: "woocommerce", label: "WooCommerce", platform: "wordpress" },
  { value: "advanced", label: "Advanced", platforms: ["shopify", "bigcommerce"] },
  { value: "advanced-platform", label: "Advanced Platform", platform: "custom-coded" }
];

const dedicatedResourceTypes = [
  { value: "graphic-designer", label: "Graphic Designer", skillLevels: ["junior", "senior", "specialist"] },
  { value: "video-editor", label: "Video Editor", skillLevels: ["junior", "senior", "specialist"] },
  { value: "seo-specialist", label: "SEO Specialist", skillLevels: ["junior", "senior", "specialist"] },
  { value: "google-ads-expert", label: "Google Ads Expert", skillLevels: ["senior", "specialist"] },
  { value: "web-developer", label: "Web Developer", skillLevels: ["junior", "senior", "specialist"] },
  { value: "full-stack-developer", label: "Full-Stack Developer", skillLevels: ["junior", "senior", "specialist"] },
  { value: "others", label: "Others (Data Entry/Virtual Assistants/Social Media Managers)", skillLevels: ["junior", "senior"] }
];

const seoTypes = [
  { value: "link-building", label: "Link Building" },
  { value: "local-seo", label: "Local SEO" },
  { value: "technical-audit", label: "Technical SEO Audit & Fixes" },
  { value: "content-marketing", label: "Content Marketing & SEO Blogging" },
  { value: "ecommerce-seo", label: "E-Commerce SEO" }
];

const googleAdsTiers = [
  { value: "starter", label: "Starter Package" },
  { value: "growth", label: "Growth Package" },
  { value: "scale", label: "Scale Package" }
];

const n8nTypes = [
  { value: "crm-automation", label: "CRM automation workflows" },
  { value: "email-marketing", label: "Email marketing automation" },
  { value: "social-media", label: "Social media posting automation" },
  { value: "lead-nurturing", label: "Lead nurturing sequences" },
  { value: "data-sync", label: "Data synchronization between tools" },
  { value: "business-process", label: "Custom business process automation" }
];

const aiTypes = [
  { value: "chatbots", label: "AI Chatbots" },
  { value: "content-generation", label: "AI Content Generation" },
  { value: "customer-support", label: "AI Customer Support" },
  { value: "data-analysis", label: "AI Data Analysis" },
  { value: "personalization", label: "AI Personalization" },
  { value: "automation", label: "AI-Powered Automation" }
];

const budgets = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 - $15,000" },
  { value: "15k-50k", label: "$15,000 - $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "over-100k", label: "Over $100,000" }
];

const timelines = [
  { value: "asap", label: "ASAP" },
  { value: "1-month", label: "Within 1 Month" },
  { value: "3-months", label: "Within 3 Months" },
  { value: "6-months", label: "Within 6 Months" },
  { value: "planning", label: "Still Planning" }
];

const regions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "other", label: "Other" }
];

export function ContactFormOptimized() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    websiteDetails: {
      platform: '',
      tier: ''
    },
    dedicatedResourceDetails: {
      roles: []
    },
    seoDetails: [],
    googleAdsDetails: [],
    n8nDetails: [],
    aiDetails: [],
    message: '',
    region: '',
    budget: '',
    timeline: '',
    referral: '',
    couponCode: ''
  });

  // Auto-fill coupon code from URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const couponFromUrl = urlParams.get('coupon');
    const serviceFromUrl = urlParams.get('service');
    
    if (couponFromUrl) {
      setFormData(prev => ({ ...prev, couponCode: couponFromUrl }));
    }
    if (serviceFromUrl) {
      setFormData(prev => ({ ...prev, service: serviceFromUrl }));
    }
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // Build structured message with service details
      let structuredMessage = data.message || 'Contact form submission';
      
      // Add service selections
      if (data.service) {
        structuredMessage += `\n\n📋 PRIMARY SERVICE: ${services.find(s => s.value === data.service)?.label || data.service}`;
      }
      
      // Add website details
      if (data.service === 'website-development' && data.websiteDetails.platform) {
        structuredMessage += `\n\n🌐 WEBSITE DETAILS:`;
        structuredMessage += `\n• Platform: ${websitePlatforms.find(p => p.value === data.websiteDetails.platform)?.label}`;
        if (data.websiteDetails.tier) {
          structuredMessage += `\n• Tier: ${websiteTiers.find(t => t.value === data.websiteDetails.tier)?.label}`;
        }
      }
      
      // Add dedicated resources details
      if (data.service === 'dedicated-resources' && data.dedicatedResourceDetails.roles.length > 0) {
        structuredMessage += `\n\n👥 DEDICATED RESOURCES:`;
        data.dedicatedResourceDetails.roles.forEach(role => {
          if (role.type && role.skillLevel) {
            const roleLabel = dedicatedResourceTypes.find(t => t.value === role.type)?.label;
            structuredMessage += `\n• ${role.quantity}x ${roleLabel} (${role.skillLevel} level)`;
          }
        });
      }
      
      // Add SEO details
      if (data.service === 'seo' && data.seoDetails.length > 0) {
        structuredMessage += `\n\n🔍 SEO SERVICES:`;
        data.seoDetails.forEach(detail => {
          const seoLabel = seoTypes.find(t => t.value === detail)?.label;
          structuredMessage += `\n• ${seoLabel}`;
        });
      }
      
      // Add Google Ads details
      if (data.service === 'google-ads' && data.googleAdsDetails.length > 0) {
        structuredMessage += `\n\n🎯 GOOGLE ADS:`;
        data.googleAdsDetails.forEach((detail: string) => {
          const adsLabel = googleAdsTiers.find((t: any) => t.value === detail)?.label;
          structuredMessage += `\n• ${adsLabel}`;
        });
      }
      
      // Add N8N automation details
      if (data.service === 'n8n-automations' && data.n8nDetails.length > 0) {
        structuredMessage += `\n\n⚙️ N8N AUTOMATIONS:`;
        data.n8nDetails.forEach(detail => {
          const n8nLabel = n8nTypes.find(t => t.value === detail)?.label;
          structuredMessage += `\n• ${n8nLabel}`;
        });
      }
      
      // Add AI details
      if (data.service === 'ai-development' && data.aiDetails.length > 0) {
        structuredMessage += `\n\n🤖 AI DEVELOPMENT:`;
        data.aiDetails.forEach(detail => {
          const aiLabel = aiTypes.find(t => t.value === detail)?.label;
          structuredMessage += `\n• ${aiLabel}`;
        });
      }
      
      // Add budget and timeline
      if (data.budget) {
        structuredMessage += `\n\n💰 BUDGET: ${budgets.find(b => b.value === data.budget)?.label || data.budget}`;
      }
      
      if (data.timeline) {
        structuredMessage += `\n\n⏰ TIMELINE: ${timelines.find(t => t.value === data.timeline)?.label || data.timeline}`;
      }
      
      if (data.referral) {
        structuredMessage += `\n\n📢 REFERRAL: ${data.referral}`;
      }

      // Transform the form data to match the API expected format
      const submissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        inquiry_type: data.service,
        message: structuredMessage,
        preferred_contact: 'email',
        country: data.region,
        topPriority: data.service,
        couponCode: data.couponCode || null,
        servicesSelected: [data.service],
        budget: data.budget,
        timeline: data.timeline,
        referralSource: data.referral,
        serviceDetails: {
          websiteDetails: data.websiteDetails,
          dedicatedResourceDetails: data.dedicatedResourceDetails,
          seoDetails: data.seoDetails,
          googleAdsDetails: data.googleAdsDetails,
          n8nDetails: data.n8nDetails,
          aiDetails: data.aiDetails
        }
      };

      return await apiRequest('/api/contacts', 'POST', submissionData);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        websiteDetails: {
          platform: '',
          tier: ''
        },
        dedicatedResourceDetails: {
          roles: []
        },
        seoDetails: [],
        googleAdsDetails: [],
        n8nDetails: [],
        aiDetails: [],
        message: '',
        region: '',
        budget: '',
        timeline: '',
        referral: '',
        couponCode: ''
      });
      
      setErrors({});
    },
    onError: (error: any) => {
      console.error('Contact form error:', error);
      
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    // Message field is optional - no validation needed

    if (!formData.region) {
      newErrors.region = "Please select your region";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      contactMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleWebsiteDetailsChange = (field: keyof ContactFormData['websiteDetails'], value: string) => {
    setFormData(prev => ({
      ...prev,
      websiteDetails: { ...prev.websiteDetails, [field]: value }
    }));
  };

  const handleResourceRoleAdd = () => {
    setFormData(prev => ({
      ...prev,
      dedicatedResourceDetails: {
        ...prev.dedicatedResourceDetails,
        roles: [...prev.dedicatedResourceDetails.roles, { type: '', skillLevel: '', quantity: 1 }]
      }
    }));
  };

  const handleResourceRoleUpdate = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      dedicatedResourceDetails: {
        ...prev.dedicatedResourceDetails,
        roles: prev.dedicatedResourceDetails.roles.map((role, i) => 
          i === index ? { ...role, [field]: value } : role
        )
      }
    }));
  };

  const handleResourceRoleRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dedicatedResourceDetails: {
        ...prev.dedicatedResourceDetails,
        roles: prev.dedicatedResourceDetails.roles.filter((_, i) => i !== index)
      }
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof ContactFormData] as string[]), value]
        : (prev[field as keyof ContactFormData] as string[]).filter(item => item !== value)
    }));
  };

  const getAvailableTiers = () => {
    if (!formData.websiteDetails.platform) return [];
    
    return websiteTiers.filter(tier => {
      if (tier.platform) return tier.platform === formData.websiteDetails.platform;
      if (tier.platforms) return tier.platforms.includes(formData.websiteDetails.platform);
      return true;
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">


        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
                autoComplete="name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? 'border-red-500' : ''}
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter your company name"
                className={errors.company ? 'border-red-500' : ''}
                autoComplete="organization"
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Project Details */}
          <div>
            <Label htmlFor="service">Service Needed *</Label>
            <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
              <SelectTrigger className={errors.service ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
          </div>

          {/* Website Development Details */}
          {formData.service === 'website-development' && (
            <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What are you specifically looking for in Website Development? *</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Platform</Label>
                  <Select value={formData.websiteDetails.platform} onValueChange={(value) => handleWebsiteDetailsChange('platform', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose platform..." />
                    </SelectTrigger>
                    <SelectContent>
                      {websitePlatforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.websiteDetails.platform && (
                  <div>
                    <Label>Tier</Label>
                    <Select value={formData.websiteDetails.tier} onValueChange={(value) => handleWebsiteDetailsChange('tier', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose tier..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTiers().map(tier => (
                          <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Selected:</h4>
                {formData.websiteDetails.platform && (
                  <Badge variant="outline" className="mr-2">
                    {websitePlatforms.find(p => p.value === formData.websiteDetails.platform)?.label}
                    {formData.websiteDetails.tier && ` - ${getAvailableTiers().find(t => t.value === formData.websiteDetails.tier)?.label}`}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Dedicated Resources Details */}
          {formData.service === 'dedicated-resources' && (
            <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What are you specifically looking for in Dedicated Resource? *</h3>
              
              <div className="space-y-4">
                {formData.dedicatedResourceDetails.roles.map((role, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">Resource #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleResourceRoleRemove(index)}
                        className="text-red-600 ed-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Role Type</Label>
                        <Select value={role.type} onValueChange={(value) => handleResourceRoleUpdate(index, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose role..." />
                          </SelectTrigger>
                          <SelectContent>
                            {dedicatedResourceTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {role.type && (
                        <div>
                          <Label>Skill Level</Label>
                          <Select value={role.skillLevel} onValueChange={(value) => handleResourceRoleUpdate(index, 'skillLevel', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose level..." />
                            </SelectTrigger>
                            <SelectContent>
                              {dedicatedResourceTypes.find(t => t.value === role.type)?.skillLevels.map(level => (
                                <SelectItem key={level} value={level}>
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Quantity</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleResourceRoleUpdate(index, 'quantity', Math.max(1, role.quantity - 1))}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={role.quantity}
                            onChange={(e) => handleResourceRoleUpdate(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="text-center w-16"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleResourceRoleUpdate(index, 'quantity', role.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResourceRoleAdd}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Resource
                </Button>

                {formData.dedicatedResourceDetails.roles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Selected Resources:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.dedicatedResourceDetails.roles.map((role, index) => (
                        role.type && role.skillLevel && (
                          <Badge key={index} variant="outline">
                            {role.quantity}x {dedicatedResourceTypes.find(t => t.value === role.type)?.label} ({role.skillLevel})
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Services Details */}
          {formData.service === 'seo' && (
            <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What are you specifically looking for in SEO Services? *</h3>
              <div className="grid grid-cols-1 gap-3">
                {seoTypes.map(type => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={formData.seoDetails.includes(type.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('seoDetails', type.value, checked as boolean)}
                    />
                    <Label htmlFor={type.value} className="text-sm font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Ads Details */}
          {formData.service === 'google-ads' && (
            <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What are you specifically looking for in Google Ads? *</h3>
              <div className="grid grid-cols-1 gap-3">
                {googleAdsTiers.map(tier => (
                  <div key={tier.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={tier.value}
                      checked={formData.googleAdsDetails.includes(tier.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('googleAdsDetails', tier.value, checked as boolean)}
                    />
                    <Label htmlFor={tier.value} className="text-sm font-normal cursor-pointer">
                      {tier.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* N8N Automations Details */}
          {formData.service === 'n8n-automations' && (
            <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What are you specifically looking for in N8N Automations? *</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Coming Soon!</strong> N8N automation services will be available shortly. Select your areas of interest below.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {n8nTypes.map(type => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={formData.n8nDetails.includes(type.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('n8nDetails', type.value, checked as boolean)}
                    />
                    <Label htmlFor={type.value} className="text-sm font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Development Details */}
          {formData.service === 'ai-development' && (
            <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What are you specifically looking for in AI Web Agents/AI Development? *</h3>
              <div className="grid grid-cols-1 gap-3">
                {aiTypes.map(type => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={formData.aiDetails.includes(type.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('aiDetails', type.value, checked as boolean)}
                    />
                    <Label htmlFor={type.value} className="text-sm font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Your Region *</Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
            </div>

            <div>
              <Label htmlFor="budget">Project Budget</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map(budget => (
                    <SelectItem key={budget.value} value={budget.value}>
                      {budget.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map(timeline => (
                  <SelectItem key={timeline.value} value={timeline.value}>
                    {timeline.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your agency and goals... (Optional)"
              className="min-h-[120px]"
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="referral">How did you hear about us?</Label>
            <Input
              id="referral"
              type="text"
              value={formData.referral}
              onChange={(e) => handleInputChange('referral', e.target.value)}
              placeholder="Google, referral, social media, etc."
            />
          </div>

          {/* Coupon Code Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-600" />
              Special Offer
            </h3>
            <div>
              <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="couponCode"
                  type="text"
                  placeholder="Enter coupon code (e.g. SEO50, WEB20, ADS15)"
                  value={formData.couponCode}
                  onChange={(e) => handleInputChange('couponCode', e.target.value)}
                  className="flex-1"
                />
                {formData.couponCode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('couponCode', '')}
                  >
                    Clear
                  </Button>
                )}
              </div>
              {formData.couponCode && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Coupon code "{formData.couponCode}" will be applied to your project
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 urple-700 ink-700 text-white font-semibold py-4 text-lg"
            disabled={contactMutation.isPending}
          >
            {contactMutation.isPending ? "Sending..." : "Schedule Free Consultation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}