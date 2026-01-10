// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
// import { Shield, Lock, CheckCircle, Clock, Star, Award, Plus, Minus, Gift, Copy } from "lucide-react";
// import PhoneInput from "react-phone-input-2";

// interface ContactFormData {
//   name: string;
//   email: string;
//   company: string;
//   phone: string;
//   service: string;
//   websiteDetails: {
//     platform: string;
//     tier: string;
//   };
//   dedicatedResourceDetails: {
//     roles: Array<{
//       type: string;
//       skillLevel: string;
//       quantity: number;
//     }>;
//   };
//   seoDetails: string[];
//   googleAdsDetails: string[];
//   n8nDetails: string[];
//   aiDetails: string[];
//   message: string;
//   region: string;
//   budget: string;
//   timeline: string;
//   referral: string;
//   couponCode: string;
// }

// const services = [
//   { value: "website-development", label: "Website Development" },
//   { value: "seo", label: "SEO / AIO Services" },
//   { value: "google-ads", label: "Google Ads" },
//   { value: "dedicated-resources", label: "Dedicated Resources" },
//   { value: "custom-app-development", label: "Custom Web & Mobile App Development" },
//   { value: "ai-development", label: "AI Web Agents/AI Development" },
//   { value: "other", label: "Other" }
// ];

// const websitePlatforms = [
//   { value: "wordpress", label: "WordPress" },
//   { value: "shopify", label: "Shopify" },
//   { value: "bigcommerce", label: "BigCommerce" },
//   { value: "custom-coded", label: "Custom Coded" }
// ];

// const websiteTiers = [
//   { value: "starter", label: "Starter" },
//   { value: "business", label: "Business" },
//   { value: "woocommerce", label: "WooCommerce", platform: "wordpress" },
//   { value: "advanced", label: "Advanced", platforms: ["shopify", "bigcommerce"] },
//   { value: "advanced-platform", label: "Advanced Platform", platform: "custom-coded" }
// ];

// const dedicatedResourceTypes = [
//   { value: "graphic-designer", label: "Graphic Designer", skillLevels: ["junior", "senior", "specialist"] },
//   { value: "video-editor", label: "Video Editor", skillLevels: ["junior", "senior", "specialist"] },
//   { value: "seo-specialist", label: "SEO Specialist", skillLevels: ["junior", "senior", "specialist"] },
//   { value: "google-ads-expert", label: "Google Ads Expert", skillLevels: ["senior", "specialist"] },
//   { value: "web-developer", label: "Web Developer", skillLevels: ["junior", "senior", "specialist"] },
//   { value: "full-stack-developer", label: "Full-Stack Developer", skillLevels: ["junior", "senior", "specialist"] },
//   { value: "others", label: "Others (Data Entry/Virtual Assistants/Social Media Managers)", skillLevels: ["junior", "senior"] }
// ];

// const seoTypes = [
//   { value: "link-building", label: "Link Building" },
//   { value: "local-seo", label: "Local SEO" },
//   { value: "technical-audit", label: "Technical SEO Audit & Fixes" },
//   { value: "content-marketing", label: "Content Marketing & SEO Blogging" },
//   { value: "ecommerce-seo", label: "E-Commerce SEO" }
// ];

// const googleAdsTiers = [
//   { value: "starter", label: "Starter Package" },
//   { value: "growth", label: "Growth Package" },
//   { value: "scale", label: "Scale Package" }
// ];

// const n8nTypes = [
//   { value: "crm-automation", label: "CRM automation workflows" },
//   { value: "email-marketing", label: "Email marketing automation" },
//   { value: "social-media", label: "Social media posting automation" },
//   { value: "lead-nurturing", label: "Lead nurturing sequences" },
//   { value: "data-sync", label: "Data synchronization between tools" },
//   { value: "business-process", label: "Custom business process automation" }
// ];

// const aiTypes = [
//   { value: "chatbots", label: "AI Chatbots" },
//   { value: "content-generation", label: "AI Content Generation" },
//   { value: "customer-support", label: "AI Customer Support" },
//   { value: "data-analysis", label: "AI Data Analysis" },
//   { value: "personalization", label: "AI Personalization" },
//   { value: "automation", label: "AI-Powered Automation" }
// ];

// const budgets = [
//   { value: "under-5k", label: "Under $5,000" },
//   { value: "5k-15k", label: "$5,000 - $15,000" },
//   { value: "15k-50k", label: "$15,000 - $50,000" },
//   { value: "50k-100k", label: "$50,000 - $100,000" },
//   { value: "over-100k", label: "Over $100,000" }
// ];

// const timelines = [
//   { value: "asap", label: "ASAP" },
//   { value: "1-month", label: "Within 1 Month" },
//   { value: "3-months", label: "Within 3 Months" },
//   { value: "6-months", label: "Within 6 Months" },
//   { value: "planning", label: "Still Planning" }
// ];

// const regions = [
//   { value: "us", label: "United States" },
//   { value: "uk", label: "United Kingdom" },
//   { value: "germany", label: "Germany" },
//   { value: "other", label: "Other" }
// ];

// export function ContactFormOptimized() {
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const { hash, search } = window.location;
//     const params = new URLSearchParams(search);
//     const couponFromUrl = params.get("coupon");

//     // Autofill coupon code if present in URL
//     if (couponFromUrl) {
//       setFormData(prev => ({
//         ...prev,
//         couponCode: couponFromUrl.toUpperCase(),
//       }));
//     }

//     // Smooth scroll to #contact-form with header offset
//     if (hash === "#contact-form") {
//       setTimeout(() => {
//         const formEl = document.getElementById("contact-form");
//         if (formEl) {
//           const headerOffset = 100; // adjust to match your fixed header height
//           const elementPosition = formEl.getBoundingClientRect().top + window.scrollY;
//           const offsetPosition = elementPosition - headerOffset;

//           window.scrollTo({
//             top: offsetPosition,
//             behavior: "smooth",
//           });
//         }
//       }, 150);
//     }
//   }, []);

//   const { toast } = useToast();
//   const [formData, setFormData] = useState<ContactFormData>({
//     name: '',
//     email: '',
//     company: '',
//     phone: '',
//     service: '',
//     websiteDetails: {
//       platform: '',
//       tier: ''
//     },
//     dedicatedResourceDetails: {
//       roles: []
//     },
//     seoDetails: [],
//     googleAdsDetails: [],
//     n8nDetails: [],
//     aiDetails: [],
//     message: '',
//     region: '',
//     budget: '',
//     timeline: '',
//     referral: '',
//     couponCode: ''
//   });

//   // Auto-fill coupon code from URL parameters
//   React.useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const couponFromUrl = urlParams.get('coupon');
//     const serviceFromUrl = urlParams.get('service');

//     if (couponFromUrl) {
//       setFormData(prev => ({ ...prev, couponCode: couponFromUrl }));
//     }
//     if (serviceFromUrl) {
//       setFormData(prev => ({ ...prev, service: serviceFromUrl }));
//     }
//   }, []);

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const contactMutation = useMutation({
//     mutationFn: async (data: ContactFormData) => {
//       // Build structured message with service details
//       let structuredMessage = data.message || 'Contact form submission';

//       // Add service selections
//       if (data.service) {
//         structuredMessage += `\n\n📋 PRIMARY SERVICE: ${services.find(s => s.value === data.service)?.label || data.service}`;
//       }

//       // Add website details
//       if (data.service === 'website-development' && data.websiteDetails.platform) {
//         structuredMessage += `\n\n🌐 WEBSITE DETAILS:`;
//         structuredMessage += `\n• Platform: ${websitePlatforms.find(p => p.value === data.websiteDetails.platform)?.label}`;
//         if (data.websiteDetails.tier) {
//           structuredMessage += `\n• Tier: ${websiteTiers.find(t => t.value === data.websiteDetails.tier)?.label}`;
//         }
//       }

//       // Add dedicated resources details
//       if (data.service === 'dedicated-resources' && data.dedicatedResourceDetails.roles.length > 0) {
//         structuredMessage += `\n\n👥 DEDICATED RESOURCES:`;
//         data.dedicatedResourceDetails.roles.forEach(role => {
//           if (role.type && role.skillLevel) {
//             const roleLabel = dedicatedResourceTypes.find(t => t.value === role.type)?.label;
//             structuredMessage += `\n• ${role.quantity}x ${roleLabel} (${role.skillLevel} level)`;
//           }
//         });
//       }

//       // Add SEO details
//       if (data.service === 'seo' && data.seoDetails.length > 0) {
//         structuredMessage += `\n\n🔍 SEO SERVICES:`;
//         data.seoDetails.forEach(detail => {
//           const seoLabel = seoTypes.find(t => t.value === detail)?.label;
//           structuredMessage += `\n• ${seoLabel}`;
//         });
//       }

//       // Add Google Ads details
//       if (data.service === 'google-ads' && data.googleAdsDetails.length > 0) {
//         structuredMessage += `\n\n🎯 GOOGLE ADS:`;
//         data.googleAdsDetails.forEach((detail: string) => {
//           const adsLabel = googleAdsTiers.find((t: any) => t.value === detail)?.label;
//           structuredMessage += `\n• ${adsLabel}`;
//         });
//       }

//       // Add Custom Web & Mobile App Development details
//       if (data.service === 'custom-app-development' && data.n8nDetails.length > 0) {
//         structuredMessage += `\n\n⚙️ Custom Web & Mobile App Development:`;
//         data.n8nDetails.forEach(detail => {
//           const n8nLabel = n8nTypes.find(t => t.value === detail)?.label;
//           structuredMessage += `\n• ${n8nLabel}`;
//         });
//       }

//       // Add AI details
//       if (data.service === 'ai-development' && data.aiDetails.length > 0) {
//         structuredMessage += `\n\n🤖 AI DEVELOPMENT:`;
//         data.aiDetails.forEach(detail => {
//           const aiLabel = aiTypes.find(t => t.value === detail)?.label;
//           structuredMessage += `\n• ${aiLabel}`;
//         });
//       }

//       // Add budget and timeline
//       if (data.budget) {
//         structuredMessage += `\n\n💰 BUDGET: ${budgets.find(b => b.value === data.budget)?.label || data.budget}`;
//       }

//       if (data.timeline) {
//         structuredMessage += `\n\n⏰ TIMELINE: ${timelines.find(t => t.value === data.timeline)?.label || data.timeline}`;
//       }

//       if (data.referral) {
//         structuredMessage += `\n\n📢 REFERRAL: ${data.referral}`;
//       }

//       // Transform the form data to match the API expected format
//       const submissionData = {
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         company: data.company,
//         inquiry_type: data.service,
//         message: structuredMessage,
//         preferred_contact: 'email',
//         country: data.region,
//         topPriority: data.service,
//         couponCode: data.couponCode || null,
//         servicesSelected: [data.service],
//         budget: data.budget,
//         timeline: data.timeline,
//         referralSource: data.referral,
//         serviceDetails: {
//           websiteDetails: data.websiteDetails,
//           dedicatedResourceDetails: data.dedicatedResourceDetails,
//           seoDetails: data.seoDetails,
//           googleAdsDetails: data.googleAdsDetails,
//           n8nDetails: data.n8nDetails,
//           aiDetails: data.aiDetails
//         }
//       };

//       return await apiRequest('/api/contacts', 'POST', submissionData);
//     },
//     onSuccess: () => {
//       toast({
//         title: "Message sent successfully!",
//         description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
//         duration: 5000,
//       });

//       // Reset form
//       setFormData({
//         name: '',
//         email: '',
//         company: '',
//         phone: '',
//         service: '',
//         websiteDetails: {
//           platform: '',
//           tier: ''
//         },
//         dedicatedResourceDetails: {
//           roles: []
//         },
//         seoDetails: [],
//         googleAdsDetails: [],
//         n8nDetails: [],
//         aiDetails: [],
//         message: '',
//         region: '',
//         budget: '',
//         timeline: '',
//         referral: '',
//         couponCode: ''
//       });

//       setErrors({});
//     },
//     onError: (error: any) => {
//       console.error('Contact form error:', error);

//       // Extract user-friendly message from server response
//       let errorMessage = "Please try again or contact us directly.";
//       if (error?.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error?.message) {
//         errorMessage = error.message;
//       }

//       toast({
//         title: "Please check your information",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   });

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!formData.company.trim()) {
//       newErrors.company = "Company name is required";
//     }

//     if (!formData.service) {
//       newErrors.service = "Please select a service";
//     }

//     // Message field is optional - no validation needed

//     if (!formData.region) {
//       newErrors.region = "Please select your region";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (validateForm()) {
//       contactMutation.mutate(formData);
//     }
//   };

//   const handleInputChange = (field: keyof ContactFormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const handleWebsiteDetailsChange = (field: keyof ContactFormData['websiteDetails'], value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       websiteDetails: { ...prev.websiteDetails, [field]: value }
//     }));
//   };

//   const handleResourceRoleAdd = () => {
//     setFormData(prev => ({
//       ...prev,
//       dedicatedResourceDetails: {
//         ...prev.dedicatedResourceDetails,
//         roles: [...prev.dedicatedResourceDetails.roles, { type: '', skillLevel: '', quantity: 1 }]
//       }
//     }));
//   };

//   const handleResourceRoleUpdate = (index: number, field: string, value: string | number) => {
//     setFormData(prev => ({
//       ...prev,
//       dedicatedResourceDetails: {
//         ...prev.dedicatedResourceDetails,
//         roles: prev.dedicatedResourceDetails.roles.map((role, i) =>
//           i === index ? { ...role, [field]: value } : role
//         )
//       }
//     }));
//   };

//   const handleResourceRoleRemove = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       dedicatedResourceDetails: {
//         ...prev.dedicatedResourceDetails,
//         roles: prev.dedicatedResourceDetails.roles.filter((_, i) => i !== index)
//       }
//     }));
//   };

//   const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: checked
//         ? [...(prev[field as keyof ContactFormData] as string[]), value]
//         : (prev[field as keyof ContactFormData] as string[]).filter(item => item !== value)
//     }));
//   };

//   const getAvailableTiers = () => {
//     if (!formData.websiteDetails.platform) return [];

//     return websiteTiers.filter(tier => {
//       if (tier.platform) return tier.platform === formData.websiteDetails.platform;
//       if (tier.platforms) return tier.platforms.includes(formData.websiteDetails.platform);
//       return true;
//     });
//   };

//   {/* <div>
//               <Label htmlFor="phone">Phone Number</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) => handleInputChange('phone', e.target.value)}
//                 placeholder="Enter your phone number"
//                 autoComplete="tel"
//               />
//   </div> */}

//   return (
//     <Card className="max-w-2xl mx-auto">
//       <CardContent className="p-8 relative" id="contact-form">
//         {formData.couponCode && (
//           <>
//             <div className="hidden md:flex absolute top-3 right-4 items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1 shadow-sm">
//               <Gift className="w-4 h-4 text-emerald-600" />
//               <span className="text-xs font-bold text-emerald-800">
//                 Coupon <span className="font-bold">{formData.couponCode}</span> applied
//               </span>
//             </div>

//             <div className="md:hidden mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2">
//               <Gift className="w-4 h-4 text-emerald-600" />
//               <div className="text-xs text-emerald-800">
//                 <span className="font-bold">Coupon {formData.couponCode}</span> will be applied to your project.
//               </div>
//             </div>
//           </>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6 p-2">
//           {/* Personal Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="name">Full Name *</Label>
//               <Input
//                 id="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 placeholder="Enter your full name"
//                 className={errors.name ? "border-red-500" : ""}
//                 autoComplete="name"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="email">Email Address *</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 placeholder="Enter your email address"
//                 className={errors.email ? "border-red-500" : ""}
//                 autoComplete="email"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="company">Company Name *</Label>
//               <Input
//                 id="company"
//                 type="text"
//                 value={formData.company}
//                 onChange={(e) => handleInputChange("company", e.target.value)}
//                 placeholder="Enter your company name"
//                 className={errors.company ? "border-red-500" : ""}
//                 autoComplete="organization"
//               />
//               {errors.company && (
//                 <p className="text-red-500 text-sm mt-1">{errors.company}</p>
//               )}
//             </div>

//             <div>
//               <Label
//                 htmlFor="phone"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Phone Number
//               </Label>

//               <PhoneInput
//                 country={"us"}
//                 value={formData.phone}
//                 onChange={(value) => handleInputChange("phone", value)}
//                 inputProps={{
//                   name: "phone",
//                   id: "phone",
//                   className:
//                     "w-full h-10 rounded-md border border-gray-300 pl-12 pr-3 text-gray-900 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral",
//                   required: false,
//                 }}
//                 containerClass="w-full"
//               />
//             </div>
//           </div>

//           {/* Project Details */}
//           <div>
//             <Label htmlFor="service">Service Needed *</Label>
//             <Select
//               value={formData.service}
//               onValueChange={(value) => handleInputChange("service", value)}
//             >
//               <SelectTrigger
//                 className={errors.service ? "border-red-500" : ""}
//               >
//                 <SelectValue placeholder="Select a service" />
//               </SelectTrigger>
//               <SelectContent>
//                 {services.map((service) => (
//                   <SelectItem key={service.value} value={service.value}>
//                     {service.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.service && (
//               <p className="text-red-500 text-sm mt-1">{errors.service}</p>
//             )}
//           </div>

//           {/* Website Development Details */}
//           {formData.service === "website-development" && (
//             <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 What are you specifically looking for in Website Development? *
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label>Platform</Label>
//                   <Select
//                     value={formData.websiteDetails.platform}
//                     onValueChange={(value) =>
//                       handleWebsiteDetailsChange("platform", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Choose platform..." />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {websitePlatforms.map((platform) => (
//                         <SelectItem key={platform.value} value={platform.value}>
//                           {platform.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {formData.websiteDetails.platform && (
//                   <div>
//                     <Label>Tier</Label>
//                     <Select
//                       value={formData.websiteDetails.tier}
//                       onValueChange={(value) =>
//                         handleWebsiteDetailsChange("tier", value)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Choose tier..." />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {getAvailableTiers().map((tier) => (
//                           <SelectItem key={tier.value} value={tier.value}>
//                             {tier.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <h4 className="font-medium text-gray-700">Selected:</h4>
//                 {formData.websiteDetails.platform && (
//                   <Badge variant="outline" className="mr-2">
//                     {
//                       websitePlatforms.find(
//                         (p) => p.value === formData.websiteDetails.platform
//                       )?.label
//                     }
//                     {formData.websiteDetails.tier &&
//                       ` - ${getAvailableTiers().find(
//                         (t) => t.value === formData.websiteDetails.tier
//                       )?.label
//                       }`}
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Dedicated Resources Details */}
//           {formData.service === "dedicated-resources" && (
//             <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 What are you specifically looking for in Dedicated Resource? *
//               </h3>

//               <div className="space-y-4">
//                 {formData.dedicatedResourceDetails.roles.map((role, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 rounded-lg p-4 space-y-3"
//                   >
//                     <div className="flex justify-between items-center">
//                       <h4 className="font-medium text-gray-700">
//                         Resource #{index + 1}
//                       </h4>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleResourceRoleRemove(index)}
//                         className="text-red-600"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </Button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                       <div>
//                         <Label>Role Type</Label>
//                         <Select
//                           value={role.type}
//                           onValueChange={(value) =>
//                             handleResourceRoleUpdate(index, "type", value)
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Choose role..." />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {dedicatedResourceTypes.map((type) => (
//                               <SelectItem key={type.value} value={type.value}>
//                                 {type.label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {role.type && (
//                         <div>
//                           <Label>Skill Level</Label>
//                           <Select
//                             value={role.skillLevel}
//                             onValueChange={(value) =>
//                               handleResourceRoleUpdate(
//                                 index,
//                                 "skillLevel",
//                                 value
//                               )
//                             }
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose level..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {dedicatedResourceTypes
//                                 .find((t) => t.value === role.type)
//                                 ?.skillLevels.map((level) => (
//                                   <SelectItem key={level} value={level}>
//                                     {level.charAt(0).toUpperCase() +
//                                       level.slice(1)}
//                                   </SelectItem>
//                                 ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}

//                       <div>
//                         <Label>Quantity</Label>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               handleResourceRoleUpdate(
//                                 index,
//                                 "quantity",
//                                 Math.max(1, role.quantity - 1)
//                               )
//                             }
//                           >
//                             <Minus className="w-4 h-4" />
//                           </Button>
//                           <Input
//                             type="number"
//                             min="1"
//                             value={role.quantity}
//                             onChange={(e) =>
//                               handleResourceRoleUpdate(
//                                 index,
//                                 "quantity",
//                                 parseInt(e.target.value) || 1
//                               )
//                             }
//                             className="text-center w-16"
//                           />
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               handleResourceRoleUpdate(
//                                 index,
//                                 "quantity",
//                                 role.quantity + 1
//                               )
//                             }
//                           >
//                             <Plus className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 <Button
//                   type="button"
//                   onClick={handleResourceRoleAdd}
//                   className="w-full bg-brand-coral text-white hover:bg-brand-coral-dark"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Another Resource
//                 </Button>

//                 {formData.dedicatedResourceDetails.roles.length > 0 && (
//                   <div className="space-y-2">
//                     <h4 className="font-medium text-gray-700">
//                       Selected Resources:
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {formData.dedicatedResourceDetails.roles.map(
//                         (role, index) =>
//                           role.type &&
//                           role.skillLevel && (
//                             <Badge key={index} variant="outline">
//                               {role.quantity}x{" "}
//                               {
//                                 dedicatedResourceTypes.find(
//                                   (t) => t.value === role.type
//                                 )?.label
//                               }{" "}
//                               ({role.skillLevel})
//                             </Badge>
//                           )
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* SEO Services Details */}
//           {formData.service === "seo" && (
//             <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 What are you specifically looking for in SEO Services? *
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {seoTypes.map((type) => (
//                   <div
//                     key={type.value}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={type.value}
//                       checked={formData.seoDetails.includes(type.value)}
//                       onCheckedChange={(checked) =>
//                         handleCheckboxChange(
//                           "seoDetails",
//                           type.value,
//                           checked as boolean
//                         )
//                       }
//                     />
//                     <Label
//                       htmlFor={type.value}
//                       className="text-sm font-normal cursor-pointer"
//                     >
//                       {type.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Google Ads Details */}
//           {formData.service === "google-ads" && (
//             <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 What are you specifically looking for in Google Ads? *
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {googleAdsTiers.map((tier) => (
//                   <div
//                     key={tier.value}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={tier.value}
//                       checked={formData.googleAdsDetails.includes(
//                         tier.value
//                       )}
//                       onCheckedChange={(checked) =>
//                         handleCheckboxChange(
//                           "googleAdsDetails",
//                           tier.value,
//                           checked as boolean
//                         )
//                       }
//                     />
//                     <Label
//                       htmlFor={tier.value}
//                       className="text-sm font-normal cursor-pointer"
//                     >
//                       {tier.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Custom Web & Mobile App Development Details */}
//           {formData.service === "custom-app-development" && (
//             <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 What are you specifically looking for in Custom Web & Mobile
//                 App Development? *
//               </h3>
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
//                 <p className="text-yellow-800 text-sm">
//                   Custom Web & Mobile App Development services will be
//                   available shortly. Select your areas of interest below.
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 gap-3">
//                 {n8nTypes.map((type) => (
//                   <div
//                     key={type.value}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={type.value}
//                       checked={formData.n8nDetails.includes(type.value)}
//                       onCheckedChange={(checked) =>
//                         handleCheckboxChange(
//                           "n8nDetails",
//                           type.value,
//                           checked as boolean
//                         )
//                       }
//                     />
//                     <Label
//                       htmlFor={type.value}
//                       className="text-sm font-normal cursor-pointer"
//                     >
//                       {type.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* AI Development Details */}
//           {formData.service === "ai-development" && (
//             <div className="border-2 border-purple-200 rounded-lg p-6 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 What are you specifically looking for in AI Web Agents/AI
//                 Development? *
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {aiTypes.map((type) => (
//                   <div
//                     key={type.value}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={type.value}
//                       checked={formData.aiDetails.includes(type.value)}
//                       onCheckedChange={(checked) =>
//                         handleCheckboxChange(
//                           "aiDetails",
//                           type.value,
//                           checked as boolean
//                         )
//                       }
//                     />
//                     <Label
//                       htmlFor={type.value}
//                       className="text-sm font-normal cursor-pointer"
//                     >
//                       {type.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="region">Your Region *</Label>
//               <Select
//                 value={formData.region}
//                 onValueChange={(value) => handleInputChange("region", value)}
//               >
//                 <SelectTrigger
//                   className={errors.region ? "border-red-500" : ""}
//                 >
//                   <SelectValue placeholder="Select your region" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {regions.map((region) => (
//                     <SelectItem key={region.value} value={region.value}>
//                       {region.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.region && (
//                 <p className="text-red-500 text-sm mt-1">{errors.region}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="budget">Project Budget</Label>
//               <Select
//                 value={formData.budget}
//                 onValueChange={(value) => handleInputChange("budget", value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select budget range" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {budgets.map((budget) => (
//                     <SelectItem key={budget.value} value={budget.value}>
//                       {budget.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="timeline">Timeline</Label>
//             <Select
//               value={formData.timeline}
//               onValueChange={(value) => handleInputChange("timeline", value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select timeline" />
//               </SelectTrigger>
//               <SelectContent>
//                 {timelines.map((timeline) => (
//                   <SelectItem key={timeline.value} value={timeline.value}>
//                     {timeline.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="message">Message (Optional)</Label>
//             <Textarea
//               id="message"
//               value={formData.message}
//               onChange={(e) =>
//                 handleInputChange("message", e.target.value)
//               }
//               placeholder="Tell us about your agency and goals... (Optional)"
//               className="min-h-[120px]"
//               rows={5}
//             />
//           </div>

//           <div>
//             <Label htmlFor="referral">How did you hear about us?</Label>
//             <Input
//               id="referral"
//               type="text"
//               value={formData.referral}
//               onChange={(e) =>
//                 handleInputChange("referral", e.target.value)
//               }
//               placeholder="Google, referral, social media, etc."
//             />
//           </div>

//           {/* Coupon Code Section */}
//           <div className="border-t pt-6">
//             <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
//               <Gift className="w-5 h-5 text-pink-600" />
//               Special Offer
//             </h3>
//             <div>
//               <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
//               <div className="flex gap-2">
//                 <Input
//                   id="couponCode"
//                   type="text"
//                   placeholder="Enter coupon code (e.g. SEO50, WEB20, ADS15)"
//                   value={formData.couponCode}
//                   onChange={(e) =>
//                     handleInputChange("couponCode", e.target.value)
//                   }
//                   className="flex-1"
//                 />
//                 {formData.couponCode && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleInputChange("couponCode", "")}
//                   >
//                     Clear
//                   </Button>
//                 )}
//               </div>
//               {formData.couponCode && (
//                 <p className="text-xs text-gray-500 mt-1">
//                   You can update or clear the code here. The applied coupon is
//                   shown at the top-right of this form.
//                 </p>
//               )}
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 lg:text-lg md:text-md sm:text-md"
//             disabled={contactMutation.isPending}
//           >
//             {contactMutation.isPending
//               ? "Sending..."
//               : "Schedule Free Consultation"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }


import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Minus, Gift } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import { ThankYouPopup } from "./thank-you-popup";

// ✅ Turnstile + disposable email util (as in your earlier version)
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { isDisposableEmail } from "@/utils/disposable-email";

// ✅ NEW: reusable UTM helpers (service)
import { initUtmCapture, getUtmParams } from "@/lib/tracking/utm";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;

  monthlyRevenue: string;
  biggestChallenge: string;

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

  // ✅ NEW: UTM tracking
  utm_campaign_name: string;
  utm_adgroup_name: string;
  utm_keyword: string;
  utm_location: string;
  utm_device: string;
}

/** ---------------------------
 *  OPTIONS (same structure)
 *  --------------------------- */
const services = [
  { value: "website-development", label: "Website Development" },
  { value: "seo", label: "SEO / AIO Services" },
  { value: "google-ads", label: "Google Ads" },
  { value: "dedicated-resources", label: "Dedicated Resources" },
  {
    value: "custom-app-ai-development",
    label: "Custom Web & Mobile Application Development (AI-Powered)",
  },
];

const websitePlatforms = [
  { value: "wordpress", label: "WordPress" },
  { value: "shopify", label: "Shopify" },
  { value: "bigcommerce", label: "BigCommerce" },
  { value: "custom-coded", label: "Custom Coded" },
];

const websiteTiers = [
  { value: "starter", label: "Starter" },
  { value: "business", label: "Business" },
  { value: "woocommerce", label: "WooCommerce", platform: "wordpress" },
  { value: "advanced", label: "Advanced", platforms: ["shopify", "bigcommerce"] },
  { value: "advanced-platform", label: "Advanced Platform", platform: "custom-coded" },
];

const dedicatedResourceTypes = [
  {
    value: "graphic-designer",
    label: "Graphic Designer",
    skillLevels: ["junior", "senior", "specialist"],
  },
  {
    value: "video-editor",
    label: "Video Editor",
    skillLevels: ["junior", "senior", "specialist"],
  },
  {
    value: "seo-specialist",
    label: "SEO Specialist",
    skillLevels: ["junior", "senior", "specialist"],
  },
  {
    value: "google-ads-expert",
    label: "Google Ads Expert",
    skillLevels: ["senior", "specialist"],
  },
  {
    value: "web-developer",
    label: "Web Developer",
    skillLevels: ["junior", "senior", "specialist"],
  },
  {
    value: "full-stack-developer",
    label: "Full-Stack Developer",
    skillLevels: ["junior", "senior", "specialist"],
  },
];

const seoTypes = [
  { value: "link-building", label: "Link Building" },
  { value: "local-seo", label: "Local SEO" },
  { value: "technical-audit", label: "Technical SEO Audit & Fixes" },
  { value: "content-marketing", label: "Content Marketing & SEO Blogging" },
  { value: "ecommerce-seo", label: "E-Commerce SEO" },
];

const googleAdsTiers = [
  { value: "starter", label: "Starter Package" },
  { value: "growth", label: "Growth Package" },
  { value: "scale", label: "Scale Package" },
];

const appScopeTypes = [
  { value: "mvp-mobile-app", label: "Prototype / MVP Mobile App" },
  { value: "full-scale-app", label: "Full-Scale Production App" },
  { value: "ios-android-native-hybrid", label: "iOS & Android App (Native/Hybrid)" },
  { value: "web-mobile-bundle", label: "Web + Mobile App Bundle" },
  { value: "redesign-rebuild-app", label: "Redesign / Rebuild Existing App" },
  { value: "maintenance-feature-updates", label: "Ongoing Maintenance & Feature Updates" },
];

const aiTypes = [
  { value: "ai-web-mobile-app", label: "AI Powered web app/Mobile app development" },
  { value: "ai-agentic-platform", label: "AI Agentic Platform development" },
  { value: "ai-integration-existing", label: "AI Integration into existing platforms" },
];

const budgets = [
  { value: "not-sure", label: "Not sure yet" },
  { value: "5k-15k", label: "$5K - $15K" },
  { value: "15k-30k", label: "$15K - $30K" },
  { value: "30k-50k", label: "$30K - $50K" },
  { value: "50k-plus", label: "$50K+" },
];

const timelines = [
  { value: "urgent-30", label: "Next 30 days (urgent)" },
  { value: "2-3-months", label: "2-3 months (planning ahead)" },
  { value: "exploring", label: "Just exploring options" },
];

const regions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "other", label: "Other" },
];

/** ✅ Required red star */
function RequiredMark() {
  return (
    <span className="ml-1 text-red-600 font-bold align-middle" aria-hidden="true">
      *
    </span>
  );
}

/** ✅ Field wrapper */
function FieldShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

/** ✅ DEFAULT form object (IMPORTANT for type safety when restoring drafts) */
const defaultFormData: ContactFormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  monthlyRevenue: "",
  biggestChallenge: "",
  websiteDetails: { platform: "", tier: "" },
  dedicatedResourceDetails: { roles: [] },
  seoDetails: [],
  googleAdsDetails: [],
  n8nDetails: [],
  aiDetails: [],
  message: "",
  region: "",
  budget: "",
  timeline: "",
  referral: "",
  couponCode: "",

  // ✅ NEW: UTM defaults
  utm_campaign_name: "",
  utm_adgroup_name: "",
  utm_keyword: "",
  utm_location: "",
  utm_device: "",
};

/** ✅ Ensure any restored data becomes a FULL ContactFormData (no undefined fields) */
function normalizeDraftFormData(raw: any): ContactFormData {
  const safe = raw && typeof raw === "object" ? raw : {};

  const websiteDetails =
    safe.websiteDetails && typeof safe.websiteDetails === "object"
      ? {
        platform:
          typeof safe.websiteDetails.platform === "string"
            ? safe.websiteDetails.platform
            : "",
        tier: typeof safe.websiteDetails.tier === "string" ? safe.websiteDetails.tier : "",
      }
      : { ...defaultFormData.websiteDetails };

  const rolesRaw = safe?.dedicatedResourceDetails?.roles;
  const roles = Array.isArray(rolesRaw)
    ? rolesRaw.map((r: any) => ({
      type: typeof r?.type === "string" ? r.type : "",
      skillLevel: typeof r?.skillLevel === "string" ? r.skillLevel : "",
      quantity: typeof r?.quantity === "number" && r.quantity >= 1 ? r.quantity : 1,
    }))
    : [];

  const dedicatedResourceDetails =
    safe.dedicatedResourceDetails && typeof safe.dedicatedResourceDetails === "object"
      ? { roles }
      : { roles: [] };

  const asString = (v: any) => (typeof v === "string" ? v : "");
  const asStringArray = (v: any) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);

  return {
    ...defaultFormData,
    ...safe,

    name: asString(safe.name),
    email: asString(safe.email),
    company: asString(safe.company),
    phone: asString(safe.phone),
    service: asString(safe.service),

    monthlyRevenue: asString(safe.monthlyRevenue),
    biggestChallenge: asString(safe.biggestChallenge),

    message: asString(safe.message),
    region: asString(safe.region),
    budget: asString(safe.budget),
    timeline: asString(safe.timeline),
    referral: asString(safe.referral),
    couponCode: asString(safe.couponCode),

    websiteDetails,
    dedicatedResourceDetails,

    seoDetails: asStringArray(safe.seoDetails),
    googleAdsDetails: asStringArray(safe.googleAdsDetails),
    n8nDetails: asStringArray(safe.n8nDetails),
    aiDetails: asStringArray(safe.aiDetails),

    utm_campaign_name: asString(safe.utm_campaign_name),
    utm_adgroup_name: asString(safe.utm_adgroup_name),
    utm_keyword: asString(safe.utm_keyword),
    utm_location: asString(safe.utm_location),
    utm_device: asString(safe.utm_device),
  };
}

export function ContactFormOptimized() {
  const { toast } = useToast();

  const TURNSTILE_SITE_KEY = (import.meta as any).env?.VITE_TURNSTILE_SITE_KEY as string;
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileError, setTurnstileError] = useState<string>("");

  const [formData, setFormData] = useState<ContactFormData>(defaultFormData);

  const [thankOpen, setThankOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ✅ UI tokens (easy to tweak)
  const fieldLabelClass = "text-sm font-semibold text-gray-900";
  const fieldHintClass = "text-xs text-gray-500 leading-relaxed";
  const errorTextClass = "text-xs text-red-600 font-medium";
  const inputBaseClass =
    "h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200";
  const selectTriggerClass =
    "h-12 rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200";
  const errorRingClass = "border-red-300 focus:border-red-400 focus:ring-red-200";

  // ---------------------------
  // ✅ UTM CAPTURE (service-based)
  // URL → sessionStorage → formData
  // ---------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    initUtmCapture();
    const utm = getUtmParams();

    setFormData((prev) => ({
      ...prev,
      utm_campaign_name: prev.utm_campaign_name || utm.utm_campaign_name || "",
      utm_adgroup_name: prev.utm_adgroup_name || utm.utm_adgroup_name || "",
      utm_keyword: prev.utm_keyword || utm.utm_keyword || "",
      utm_location: prev.utm_location || utm.utm_location || "",
      utm_device: prev.utm_device || utm.utm_device || "",
    }));
  }, []);

  // ---------------------------
  // ✅ SESSION STORAGE DRAFT
  // ---------------------------
  const DRAFT_KEY =
    typeof window !== "undefined"
      ? `bb_contact_form_draft::${window.location.pathname}`
      : "bb_contact_form_draft";

  const hydratedRef = useRef(false);

  const safeParseDraft = (
    raw: string | null
  ): { formData?: ContactFormData; step?: 1 | 2 | 3 } | null => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;

      const s = (parsed as any).step;
      const fd = (parsed as any).formData;

      const validStep = s === 1 || s === 2 || s === 3 ? (s as 1 | 2 | 3) : undefined;

      // ✅ note: fd can be partial; we normalize later
      const validFormData = fd && typeof fd === "object" ? (fd as any) : undefined;

      return { step: validStep, formData: validFormData };
    } catch {
      return null;
    }
  };

  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }, [DRAFT_KEY]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const draft = safeParseDraft(sessionStorage.getItem(DRAFT_KEY));

    // ✅ Restore draft safely (no undefined fields) + preserve captured UTMs
    if (draft?.formData) {
      setFormData((prev) => {
        const normalized = normalizeDraftFormData(draft.formData);

        // ✅ Preserve UTM from (1) normalized draft OR (2) current captured state OR (3) session UTMs
        const utm = getUtmParams();

        return {
          ...normalized,
          utm_campaign_name:
            normalized.utm_campaign_name || prev.utm_campaign_name || utm.utm_campaign_name || "",
          utm_adgroup_name:
            normalized.utm_adgroup_name || prev.utm_adgroup_name || utm.utm_adgroup_name || "",
          utm_keyword: normalized.utm_keyword || prev.utm_keyword || utm.utm_keyword || "",
          utm_location: normalized.utm_location || prev.utm_location || utm.utm_location || "",
          utm_device: normalized.utm_device || prev.utm_device || utm.utm_device || "",
        };
      });
    }

    if (draft?.step) setStep(draft.step);

    hydratedRef.current = true;

    return () => {
      clearDraft();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydratedRef.current) return;

    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          step,
          formData,
          savedAt: Date.now(),
        })
      );
    } catch {
      // ignore
    }
  }, [DRAFT_KEY, formData, step]);

  // ---------------------------
  // ✅ PROGRESS
  // ---------------------------
  const progressPercent = useMemo(() => {
    if (thankOpen) return 100;

    const isNonEmpty = (v: any) => (typeof v === "string" ? v.trim().length > 0 : !!v);

    const checks: boolean[] = [
      isNonEmpty(formData.name),
      isNonEmpty(formData.email),
      isNonEmpty(formData.company),
      isNonEmpty(formData.phone),
      isNonEmpty(formData.monthlyRevenue),
      isNonEmpty(formData.biggestChallenge),
      isNonEmpty(formData.service),
      isNonEmpty(formData.timeline),
      isNonEmpty(formData.region),
      !!turnstileToken,
    ];

    if (formData.service === "website-development") {
      checks.push(isNonEmpty(formData.websiteDetails.platform));
      checks.push(isNonEmpty(formData.websiteDetails.tier));
    }

    if (formData.service === "dedicated-resources") {
      const roles = formData.dedicatedResourceDetails.roles || [];
      const hasAtLeastOne = roles.length > 0;
      const allValid =
        hasAtLeastOne &&
        roles.every(
          (r) => isNonEmpty(r.type) && isNonEmpty(r.skillLevel) && (r.quantity || 0) >= 1
        );

      checks.push(hasAtLeastOne);
      checks.push(allValid);
    }

    if (formData.service === "seo") checks.push((formData.seoDetails || []).length > 0);
    if (formData.service === "google-ads") checks.push((formData.googleAdsDetails || []).length > 0);

    if (formData.service === "custom-app-ai-development") {
      checks.push((formData.n8nDetails || []).length > 0);
      checks.push((formData.aiDetails || []).length > 0);
    }

    const total = checks.length;
    const done = checks.filter(Boolean).length;

    const raw = Math.round((done / Math.max(1, total)) * 95);
    const stepCap = step === 1 ? 45 : step === 2 ? 80 : 95;

    return Math.min(stepCap, raw);
  }, [formData, step, thankOpen, turnstileToken]);

  const clearError = (path: string) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const clearErrorsByPrefix = (prefix: string) => {
    setErrors((prev) => {
      const next: Record<string, string> = {};
      for (const k of Object.keys(prev)) {
        if (!k.startsWith(prefix)) next[k] = prev[k];
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { hash, search } = window.location;
    const params = new URLSearchParams(search);
    const couponFromUrl = params.get("coupon");

    if (couponFromUrl) {
      setFormData((prev) => ({
        ...prev,
        couponCode: prev.couponCode || couponFromUrl.toUpperCase(),
      }));
      clearError("couponCode");
    }

    if (hash === "#contact-form") {
      setTimeout(() => {
        const formEl = document.getElementById("contact-form");
        if (formEl) {
          const headerOffset = 100;
          const elementPosition = formEl.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 150);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const couponFromUrl = urlParams.get("coupon");
    const serviceFromUrl = urlParams.get("service");

    setFormData((prev) => {
      let service = prev.service;
      if (serviceFromUrl && !prev.service) {
        if (serviceFromUrl === "custom-app-development" || serviceFromUrl === "ai-development") {
          service = "custom-app-ai-development";
        } else {
          service = serviceFromUrl;
        }
      }
      return {
        ...prev,
        couponCode: prev.couponCode || (couponFromUrl ? couponFromUrl.toUpperCase() : prev.couponCode),
        service,
      };
    });
  }, []);

  useEffect(() => {
    if (step !== 3) {
      setTurnstileToken("");
      setTurnstileError("");
      clearError("turnstile");
    }
  }, [step]);

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError("");
    clearError("turnstile");
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification expired. Please try again.");
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification failed. Please try again.");
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());

  const isLikelyValidPhone = (raw: string) => {
    const digits = (raw || "").replace(/\D/g, "");
    if (!digits) return false;
    return digits.length >= 10 && digits.length <= 16;
  };

  const validateStep = (targetStep: 1 | 2 | 3): boolean => {
    const newErrors: Record<string, string> = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const company = formData.company.trim();
    const phone = (formData.phone || "").trim();

    if (targetStep >= 1) {
      if (!name) newErrors.name = "Full name is required";

      if (!email) newErrors.email = "Email is required";
      else if (!isValidEmail(email)) newErrors.email = "Please enter a valid email address";
      else if (isDisposableEmail(email))
        newErrors.email = "Please use a business email (temporary emails are blocked)";

      if (!company) newErrors.company = "Website URL is required";

      // ✅ FIX: phone required at step 1 validation (this was your earlier issue)
      if (!phone) newErrors.phone = "Phone number is required";
      else if (!isLikelyValidPhone(phone)) newErrors.phone = "Please enter a valid phone number";
    }

    if (targetStep >= 2) {
      if (!formData.monthlyRevenue) newErrors.monthlyRevenue = "Please choose your monthly revenue range";
      if (!formData.biggestChallenge) newErrors.biggestChallenge = "Please choose your biggest challenge";
      if (!formData.service) newErrors.service = "Please select a service";
      if (!formData.timeline) newErrors.timeline = "Please choose when you need help";
    }

    if (targetStep >= 3) {
      if (!formData.region) newErrors.region = "Please select your region";
      if (!turnstileToken) newErrors.turnstile = "Please verify you are not a robot";

      if (formData.service === "website-development") {
        if (!formData.websiteDetails.platform) newErrors["websiteDetails.platform"] = "Please choose a platform";
        if (!formData.websiteDetails.tier) newErrors["websiteDetails.tier"] = "Please choose a tier";
      }

      if (formData.service === "dedicated-resources") {
        if (formData.dedicatedResourceDetails.roles.length === 0) {
          newErrors["dedicatedResourceDetails.roles"] = "Please add at least one resource";
        } else {
          formData.dedicatedResourceDetails.roles.forEach((r, idx) => {
            if (!r.type) newErrors[`dedicatedResourceDetails.roles.${idx}.type`] = "Select a role type";
            if (!r.skillLevel) newErrors[`dedicatedResourceDetails.roles.${idx}.skillLevel`] = "Select a skill level";
            if (!r.quantity || r.quantity < 1)
              newErrors[`dedicatedResourceDetails.roles.${idx}.quantity`] = "Quantity must be at least 1";
          });
        }
      }

      if (formData.service === "seo") {
        if (formData.seoDetails.length === 0) newErrors["seoDetails"] = "Please select at least one SEO service";
      }

      if (formData.service === "google-ads") {
        if (formData.googleAdsDetails.length === 0)
          newErrors["googleAdsDetails"] = "Please select at least one package";
      }

      if (formData.service === "custom-app-ai-development") {
        if (formData.n8nDetails.length === 0) newErrors["n8nDetails"] = "Please select at least one App Scope option";
        if (formData.aiDetails.length === 0) newErrors["aiDetails"] = "Please select at least one AI requirement";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      let structuredMessage = data.message || "Contact form submission";

      if (data.monthlyRevenue) structuredMessage += `\n\n💵 MONTHLY REVENUE: ${data.monthlyRevenue}`;
      if (data.biggestChallenge) structuredMessage += `\n\n🧩 BIGGEST CHALLENGE: ${data.biggestChallenge}`;

      if (data.service) {
        structuredMessage += `\n\n📋 PRIMARY SERVICE: ${services.find((s) => s.value === data.service)?.label || data.service
          }`;
      }

      if (data.service === "website-development" && data.websiteDetails.platform) {
        structuredMessage += `\n\n🌐 WEBSITE DETAILS:`;
        structuredMessage += `\n• Platform: ${websitePlatforms.find((p) => p.value === data.websiteDetails.platform)?.label
          }`;
        if (data.websiteDetails.tier) {
          structuredMessage += `\n• Tier: ${websiteTiers.find((t) => t.value === data.websiteDetails.tier)?.label
            }`;
        }
      }

      if (data.service === "dedicated-resources" && data.dedicatedResourceDetails.roles.length > 0) {
        structuredMessage += `\n\n👥 DEDICATED RESOURCES:`;
        data.dedicatedResourceDetails.roles.forEach((role) => {
          if (role.type && role.skillLevel) {
            const roleLabel = dedicatedResourceTypes.find((t) => t.value === role.type)?.label;
            structuredMessage += `\n• ${role.quantity}x ${roleLabel} (${role.skillLevel} level)`;
          }
        });
      }

      if (data.service === "seo" && data.seoDetails.length > 0) {
        structuredMessage += `\n\n🔍 SEO SERVICES:`;
        data.seoDetails.forEach((detail) => {
          const seoLabel = seoTypes.find((t) => t.value === detail)?.label;
          structuredMessage += `\n• ${seoLabel}`;
        });
      }

      if (data.service === "google-ads" && data.googleAdsDetails.length > 0) {
        structuredMessage += `\n\n🎯 GOOGLE ADS:`;
        data.googleAdsDetails.forEach((detail) => {
          const adsLabel = googleAdsTiers.find((t) => t.value === detail)?.label;
          structuredMessage += `\n• ${adsLabel}`;
        });
      }

      if (
        data.service === "custom-app-ai-development" &&
        (data.n8nDetails.length > 0 || data.aiDetails.length > 0)
      ) {
        structuredMessage += `\n\n⚙️ CUSTOM WEB & MOBILE APPLICATION DEVELOPMENT (AI-POWERED):`;

        if (data.n8nDetails.length > 0) {
          structuredMessage += `\n\n📱 App Scope:`;
          data.n8nDetails.forEach((detail) => {
            const label = appScopeTypes.find((t) => t.value === detail)?.label;
            structuredMessage += `\n• ${label}`;
          });
        }

        if (data.aiDetails.length > 0) {
          structuredMessage += `\n\n🤖 AI Features / Platform Requirements:`;
          data.aiDetails.forEach((detail) => {
            const label = aiTypes.find((t) => t.value === detail)?.label;
            structuredMessage += `\n• ${label}`;
          });
        }
      }

      if (data.budget) {
        structuredMessage += `\n\n💰 BUDGET: ${budgets.find((b) => b.value === data.budget)?.label || data.budget
          }`;
      }
      if (data.timeline) {
        structuredMessage += `\n\n⏰ TIMELINE: ${timelines.find((t) => t.value === data.timeline)?.label || data.timeline
          }`;
      }
      if (data.referral) structuredMessage += `\n\n📢 REFERRAL: ${data.referral}`;

      const submissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        inquiry_type: data.service,
        message: structuredMessage,
        preferred_contact: "email",
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
          aiDetails: data.aiDetails,
        },
        turnstileToken,

        // ✅ NEW: UTM tracking
        utm_campaign_name: data.utm_campaign_name,
        utm_adgroup_name: data.utm_adgroup_name,
        utm_keyword: data.utm_keyword,
        utm_location: data.utm_location,
        utm_device: data.utm_device,
      };

      return await apiRequest("/api/contacts", "POST", submissionData);
    },

    onSuccess: () => {
      setThankOpen(true);

      toast({
        title: "Message sent successfully!",
        description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
        duration: 3000,
      });

      clearDraft();
      setFormData(defaultFormData);

      setErrors({});
      setStep(1);

      setTurnstileToken("");
      setTurnstileError("");
    },

    onError: (error: any) => {
      console.error("Contact form error:", error);

      let errorMessage = "Please try again or contact us directly.";
      if (error?.response?.data?.message) errorMessage = error.response.data.message;
      else if (error?.message) errorMessage = error.message;

      toast({
        title: "Please check your information",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    contactMutation.mutate({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      referral: formData.referral.trim(),
      message: formData.message.trim(),
      couponCode: formData.couponCode.trim().toUpperCase(),
    });
  };

  const handleInputChange = (field: keyof ContactFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field as string);

    if (field === "email") clearError("email");

    if (field === "service") {
      clearErrorsByPrefix("websiteDetails.");
      clearErrorsByPrefix("dedicatedResourceDetails.");
      clearError("seoDetails");
      clearError("googleAdsDetails");
      clearError("n8nDetails");
      clearError("aiDetails");

      setFormData((prev) => ({
        ...prev,
        service: value,
        websiteDetails: { platform: "", tier: "" },
        dedicatedResourceDetails: { roles: [] },
        seoDetails: [],
        googleAdsDetails: [],
        n8nDetails: [],
        aiDetails: [],
      }));
    }

    if (field === "phone") clearError("phone");
  };

  const handleWebsiteDetailsChange = (
    field: keyof ContactFormData["websiteDetails"],
    value: string
  ) => {
    setFormData((prev) => {
      const next = { ...prev, websiteDetails: { ...prev.websiteDetails, [field]: value } };
      if (field === "platform") next.websiteDetails.tier = "";
      return next;
    });

    clearError(`websiteDetails.${field}`);
    if (field === "platform") clearError("websiteDetails.tier");
  };

  const handleResourceRoleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      dedicatedResourceDetails: {
        ...prev.dedicatedResourceDetails,
        roles: [...prev.dedicatedResourceDetails.roles, { type: "", skillLevel: "", quantity: 1 }],
      },
    }));
    clearError("dedicatedResourceDetails.roles");
  };

  const handleResourceRoleUpdate = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      dedicatedResourceDetails: {
        ...prev.dedicatedResourceDetails,
        roles: prev.dedicatedResourceDetails.roles.map((role, i) =>
          i === index ? { ...role, [field]: value } : role
        ),
      },
    }));
    clearError(`dedicatedResourceDetails.roles.${index}.${field}`);
    clearError("dedicatedResourceDetails.roles");
  };

  const handleResourceRoleRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dedicatedResourceDetails: {
        ...prev.dedicatedResourceDetails,
        roles: prev.dedicatedResourceDetails.roles.filter((_, i) => i !== index),
      },
    }));
    clearErrorsByPrefix(`dedicatedResourceDetails.roles.${index}.`);
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof ContactFormData] as string[]), value]
        : (prev[field as keyof ContactFormData] as string[]).filter((item) => item !== value),
    }));
    clearError(field);
  };

  const getAvailableTiers = () => {
    if (!formData.websiteDetails.platform) return [];
    return websiteTiers.filter((tier) => {
      if ((tier as any).platform) return (tier as any).platform === formData.websiteDetails.platform;
      if ((tier as any).platforms) return (tier as any).platforms.includes(formData.websiteDetails.platform);
      return true;
    });
  };

  const goNext = () => {
    if (step === 1) {
      if (!validateStep(1)) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!validateStep(2)) return;
      setStep(3);
      return;
    }
  };

  const goBack = () => setStep((prev) => (prev === 3 ? 2 : 1) as 1 | 2 | 3);

  const ProgressBar = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-gray-900">
          Step {step}:{" "}
          {step === 1
            ? "Contact Information"
            : step === 2
              ? "Help Us Understand Your Needs"
              : "Timeline & Final Details"}
        </div>
        <div className="text-xs text-gray-600">{progressPercent}%</div>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );

  return (
    <>
      <ThankYouPopup
        isOpen={thankOpen}
        onClose={() => setThankOpen(false)}
        title="Thank You! We Got Your Request ✅"
        message="We've received your details. Our team will reach out within 24 hours."
        formType="contact"
      />

      {/* ✅ Background like premium form section */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="absolute -bottom-24 left-12 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />
        </div>

        <Card className="max-w-3xl mx-auto rounded-2xl border border-gray-200/70 shadow-lg">
          <CardContent className="p-5 sm:p-8 relative" id="contact-form">
            {/* ✅ top header strip */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Request a Free Strategy Plan</h1>
                  <p className="text-sm text-gray-600">
                    Answer a few questions. Our team will reply with the best next step.
                  </p>
                </div>

                {formData.couponCode ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 shadow-sm">
                    <Gift className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800">
                      Coupon <span className="font-bold">{formData.couponCode}</span> applied
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Avg. response:</span> within 24 hours
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ✅ Hidden UTM fields */}
              <input type="hidden" name="utm_campaign_name" value={formData.utm_campaign_name} />
              <input type="hidden" name="utm_adgroup_name" value={formData.utm_adgroup_name} />
              <input type="hidden" name="utm_keyword" value={formData.utm_keyword} />
              <input type="hidden" name="utm_location" value={formData.utm_location} />
              <input type="hidden" name="utm_device" value={formData.utm_device} />

              <ProgressBar />

              {/* ---------------- STEP 1 ---------------- */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900">Let&apos;s Get Started</h2>
                    <p className={fieldHintClass}>
                      Fill the details below — we&apos;ll respond quickly with the best next step.
                    </p>
                  </div>

                  {/* FORM GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Full Name */}
                    <FieldShell>
                      <Label htmlFor="name" className={fieldLabelClass}>
                        Full Name <RequiredMark />
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className={`${inputBaseClass} ${errors.name ? errorRingClass : ""}`}
                        autoComplete="name"
                      />
                      {errors.name && <p className={errorTextClass}>{errors.name}</p>}
                    </FieldShell>

                    {/* Email */}
                    <FieldShell>
                      <Label htmlFor="email" className={fieldLabelClass}>
                        Email Address <RequiredMark />
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className={`${inputBaseClass} ${errors.email ? errorRingClass : ""}`}
                        autoComplete="email"
                      />
                      {errors.email && <p className={errorTextClass}>{errors.email}</p>}
                    </FieldShell>

                    {/* Company Website */}
                    <FieldShell>
                      <Label htmlFor="company" className={fieldLabelClass}>
                        Company Website URL <RequiredMark />
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className={`${inputBaseClass} ${errors.company ? errorRingClass : ""}`}
                        autoComplete="organization"
                      />
                      {errors.company && <p className={errorTextClass}>{errors.company}</p>}
                      <p className={fieldHintClass}>
                        We use this to understand your business and prepare accurate recommendations.
                      </p>
                    </FieldShell>

                    {/* Phone */}
                    <FieldShell>
                      <Label htmlFor="phone" className={fieldLabelClass}>
                        Phone Number <RequiredMark />
                      </Label>

                      <div
                        className={`rounded-xl border bg-white shadow-sm ${errors.phone ? "border-red-300" : "border-gray-200"
                          } focus-within:ring-2 focus-within:ring-purple-200 focus-within:border-purple-300`}
                      >
                        <PhoneInput
                          country={"us"}
                          value={formData.phone}
                          onChange={(value: string) => handleInputChange("phone", value)}
                          inputProps={{
                            name: "phone",
                            id: "phone",
                            required: true,
                            autoComplete: "tel",
                          }}
                          containerClass="w-full"
                          inputClass="!w-full !h-12 !border-0 !shadow-none !rounded-xl !pl-14 !pr-4 !text-gray-900 placeholder:!text-gray-400 focus:!ring-0"
                          buttonClass="!border-0 !bg-transparent !rounded-xl"
                          dropdownClass="!rounded-xl !z-[9999] !shadow-xl"
                        />
                      </div>

                      {errors.phone && <p className={errorTextClass}>{errors.phone}</p>}
                      <p className={fieldHintClass}>We&apos;ll only use this to contact you about your request.</p>
                    </FieldShell>
                  </div>

                  {/* Footer CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                      “No spam. We&apos;ll call you in next <span className="font-semibold">24 minutes</span>.”
                    </p>

                    <Button
                      type="button"
                      className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-sm hover:opacity-95"
                      onClick={goNext}
                    >
                      Continue →
                    </Button>
                  </div>
                </div>
              )}

              {/* ---------------- STEP 2 ---------------- */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900">Help Us Understand Your Needs</h2>
                    <p className={fieldHintClass}>This helps us route you to the right specialist.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FieldShell>
                      <Label htmlFor="monthlyRevenue" className={fieldLabelClass}>
                        Monthly revenue <RequiredMark />
                      </Label>
                      <Select value={formData.monthlyRevenue} onValueChange={(value) => handleInputChange("monthlyRevenue", value)}>
                        <SelectTrigger className={`${selectTriggerClass} ${errors.monthlyRevenue ? "border-red-300" : ""}`}>
                          <SelectValue placeholder="Select monthly revenue" />
                        </SelectTrigger>
                        <SelectContent>
                          {["$1K - $20K/month", "$20K - $50K/month", "$50K - $100K/month", "Over $100K/month"].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.monthlyRevenue && <p className={errorTextClass}>{errors.monthlyRevenue}</p>}
                    </FieldShell>

                    <FieldShell>
                      <Label htmlFor="biggestChallenge" className={fieldLabelClass}>
                        Biggest challenge <RequiredMark />
                      </Label>
                      <Select value={formData.biggestChallenge} onValueChange={(value) => handleInputChange("biggestChallenge", value)}>
                        <SelectTrigger className={`${selectTriggerClass} ${errors.biggestChallenge ? "border-red-300" : ""}`}>
                          <SelectValue placeholder="Select your biggest challenge" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Too many clients, not enough team",
                            "Want to add new services without hiring",
                            "Hiring is too slow/expensive",
                            "Delivery quality inconsistent",
                          ].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.biggestChallenge && <p className={errorTextClass}>{errors.biggestChallenge}</p>}
                    </FieldShell>

                    <FieldShell className="md:col-span-2">
                      <Label htmlFor="service" className={fieldLabelClass}>
                        Service needed <RequiredMark />
                      </Label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger className={`${selectTriggerClass} ${errors.service ? "border-red-300" : ""}`}>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.service && <p className={errorTextClass}>{errors.service}</p>}
                      <p className={fieldHintClass}>Choose the primary service. You can add details below.</p>
                    </FieldShell>
                  </div>

                  {/* Website Development Details */}
                  {formData.service === "website-development" && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-900">Website Development Details</h3>
                        <Badge className="bg-white text-purple-700 border border-purple-200">Required</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FieldShell>
                          <Label className={fieldLabelClass}>
                            Platform <RequiredMark />
                          </Label>
                          <Select value={formData.websiteDetails.platform} onValueChange={(value) => handleWebsiteDetailsChange("platform", value)}>
                            <SelectTrigger className={`${selectTriggerClass} ${errors["websiteDetails.platform"] ? "border-red-300" : ""}`}>
                              <SelectValue placeholder="Choose platform..." />
                            </SelectTrigger>
                            <SelectContent>
                              {websitePlatforms.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                  {p.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors["websiteDetails.platform"] && <p className={errorTextClass}>{errors["websiteDetails.platform"]}</p>}
                        </FieldShell>

                        <FieldShell>
                          <Label className={fieldLabelClass}>
                            Tier <RequiredMark />
                          </Label>
                          <Select
                            value={formData.websiteDetails.tier}
                            onValueChange={(value) => handleWebsiteDetailsChange("tier", value)}
                            disabled={!formData.websiteDetails.platform}
                          >
                            <SelectTrigger className={`${selectTriggerClass} ${errors["websiteDetails.tier"] ? "border-red-300" : ""}`}>
                              <SelectValue placeholder={formData.websiteDetails.platform ? "Choose tier..." : "Select platform first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableTiers().map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors["websiteDetails.tier"] && <p className={errorTextClass}>{errors["websiteDetails.tier"]}</p>}
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* Dedicated Resources Details */}
                  {formData.service === "dedicated-resources" && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 space-y-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-900">Dedicated Resource Details</h3>
                        <Badge className="bg-white text-purple-700 border border-purple-200">Required</Badge>
                      </div>

                      {errors["dedicatedResourceDetails.roles"] && (
                        <p className={errorTextClass}>{errors["dedicatedResourceDetails.roles"]}</p>
                      )}

                      <div className="space-y-4">
                        {formData.dedicatedResourceDetails.roles.map((role, index) => {
                          const typeErr = errors[`dedicatedResourceDetails.roles.${index}.type`];
                          const skillErr = errors[`dedicatedResourceDetails.roles.${index}.skillLevel`];
                          const qtyErr = errors[`dedicatedResourceDetails.roles.${index}.quantity`];

                          return (
                            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 space-y-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="font-semibold text-gray-900">Resource #{index + 1}</div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResourceRoleRemove(index)}
                                  className="text-red-600"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FieldShell>
                                  <Label className={fieldLabelClass}>
                                    Role Type <RequiredMark />
                                  </Label>
                                  <Select value={role.type} onValueChange={(value) => handleResourceRoleUpdate(index, "type", value)}>
                                    <SelectTrigger className={`${selectTriggerClass} ${typeErr ? "border-red-300" : ""}`}>
                                      <SelectValue placeholder="Choose role..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {dedicatedResourceTypes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                          {t.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {typeErr && <p className={errorTextClass}>{typeErr}</p>}
                                </FieldShell>

                                <FieldShell>
                                  <Label className={fieldLabelClass}>
                                    Skill Level <RequiredMark />
                                  </Label>
                                  <Select
                                    value={role.skillLevel}
                                    onValueChange={(value) => handleResourceRoleUpdate(index, "skillLevel", value)}
                                    disabled={!role.type}
                                  >
                                    <SelectTrigger className={`${selectTriggerClass} ${skillErr ? "border-red-300" : ""}`}>
                                      <SelectValue placeholder={role.type ? "Choose level..." : "Select role first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {dedicatedResourceTypes
                                        .find((t) => t.value === role.type)
                                        ?.skillLevels.map((level) => (
                                          <SelectItem key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  {skillErr && <p className={errorTextClass}>{skillErr}</p>}
                                </FieldShell>

                                <FieldShell>
                                  <Label className={fieldLabelClass}>
                                    Quantity <RequiredMark />
                                  </Label>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleResourceRoleUpdate(index, "quantity", Math.max(1, role.quantity - 1))}
                                      className="h-10 w-10 rounded-xl"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>

                                    <Input
                                      type="number"
                                      min="1"
                                      value={role.quantity}
                                      onChange={(e) => handleResourceRoleUpdate(index, "quantity", parseInt(e.target.value) || 1)}
                                      className={`${inputBaseClass} h-10 w-20 text-center ${qtyErr ? errorRingClass : ""}`}
                                    />

                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleResourceRoleUpdate(index, "quantity", role.quantity + 1)}
                                      className="h-10 w-10 rounded-xl"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  {qtyErr && <p className={errorTextClass}>{qtyErr}</p>}
                                </FieldShell>
                              </div>
                            </div>
                          );
                        })}

                        <Button
                          type="button"
                          onClick={handleResourceRoleAdd}
                          className="w-full h-12 rounded-xl bg-brand-coral text-white hover:bg-brand-coral-dark"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Resource
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* SEO Details */}
                  {formData.service === "seo" && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">SEO Services</h3>
                      {errors["seoDetails"] && <p className={errorTextClass}>{errors["seoDetails"]}</p>}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {seoTypes.map((type) => (
                          <div key={type.value} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                            <Checkbox
                              id={type.value}
                              checked={formData.seoDetails.includes(type.value)}
                              onCheckedChange={(checked) => handleCheckboxChange("seoDetails", type.value, checked as boolean)}
                            />
                            <Label htmlFor={type.value} className="text-sm font-medium cursor-pointer text-gray-800">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Ads */}
                  {formData.service === "google-ads" && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">Google Ads Package</h3>
                      {errors["googleAdsDetails"] && <p className={errorTextClass}>{errors["googleAdsDetails"]}</p>}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {googleAdsTiers.map((tier) => (
                          <div key={tier.value} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                            <Checkbox
                              id={tier.value}
                              checked={formData.googleAdsDetails.includes(tier.value)}
                              onCheckedChange={(checked) => handleCheckboxChange("googleAdsDetails", tier.value, checked as boolean)}
                            />
                            <Label htmlFor={tier.value} className="text-sm font-medium cursor-pointer text-gray-800">
                              {tier.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom app + AI */}
                  {formData.service === "custom-app-ai-development" && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 space-y-6">
                      <h3 className="text-lg font-bold text-gray-900">Custom App + AI Requirements</h3>

                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <p className="text-sm text-yellow-800">
                          Select both the <span className="font-semibold">app scope</span> and{" "}
                          <span className="font-semibold">AI features</span>.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            App Scope <RequiredMark />
                          </h4>
                          {errors["n8nDetails"] && <p className={errorTextClass}>{errors["n8nDetails"]}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {appScopeTypes.map((type) => (
                            <div key={type.value} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                              <Checkbox
                                id={type.value}
                                checked={formData.n8nDetails.includes(type.value)}
                                onCheckedChange={(checked) => handleCheckboxChange("n8nDetails", type.value, checked as boolean)}
                              />
                              <Label htmlFor={type.value} className="text-sm font-medium cursor-pointer text-gray-800">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            AI Features <RequiredMark />
                          </h4>
                          {errors["aiDetails"] && <p className={errorTextClass}>{errors["aiDetails"]}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {aiTypes.map((type) => (
                            <div key={type.value} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                              <Checkbox
                                id={type.value}
                                checked={formData.aiDetails.includes(type.value)}
                                onCheckedChange={(checked) => handleCheckboxChange("aiDetails", type.value, checked as boolean)}
                              />
                              <Label htmlFor={type.value} className="text-sm font-medium cursor-pointer text-gray-800">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FieldShell>
                      <Label htmlFor="timeline" className={fieldLabelClass}>
                        When do you need help? <RequiredMark />
                      </Label>
                      <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                        <SelectTrigger className={`${selectTriggerClass} ${errors.timeline ? "border-red-300" : ""}`}>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelines.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.timeline && <p className={errorTextClass}>{errors.timeline}</p>}
                    </FieldShell>

                    <FieldShell>
                      <Label htmlFor="budget" className={fieldLabelClass}>
                        Project budget <span className="text-gray-400 font-medium">(optional)</span>
                      </Label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets.map((b) => (
                            <SelectItem key={b.value} value={b.value}>
                              {b.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className={fieldHintClass}>Helps us prepare a realistic plan.</p>
                    </FieldShell>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Button type="button" variant="outline" onClick={goBack} className="h-12 rounded-xl">
                      ← Back
                    </Button>

                    <Button
                      type="button"
                      className="h-12 rounded-xl px-7 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-sm hover:opacity-95"
                      onClick={goNext}
                    >
                      Continue →
                    </Button>
                  </div>
                </div>
              )}

              {/* ---------------- STEP 3 ---------------- */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900">Almost Done</h2>
                    <p className={fieldHintClass}>Final details — then we’ll send your request to our team.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FieldShell>
                      <Label htmlFor="region" className={fieldLabelClass}>
                        Your Region <RequiredMark />
                      </Label>
                      <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                        <SelectTrigger className={`${selectTriggerClass} ${errors.region ? "border-red-300" : ""}`}>
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.region && <p className={errorTextClass}>{errors.region}</p>}
                    </FieldShell>

                    <FieldShell>
                      <Label htmlFor="message" className={fieldLabelClass}>
                        Message <span className="text-gray-400 font-medium">(optional)</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Anything else we should know?"
                        className="min-h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200 placeholder:text-gray-400"
                      />
                      <p className={fieldHintClass}>Share links, goals, or anything that helps us understand your needs.</p>
                    </FieldShell>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
                    <Label className={fieldLabelClass}>
                      Security Verification <RequiredMark />
                    </Label>

                    {TURNSTILE_SITE_KEY ? (
                      <TurnstileWidget
                        siteKey={TURNSTILE_SITE_KEY}
                        onToken={handleTurnstileToken}
                        onExpire={handleTurnstileExpire}
                        onError={handleTurnstileError}
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

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Button type="button" variant="outline" onClick={goBack} className="h-12 rounded-xl">
                      ← Back
                    </Button>

                    <Button
                      type="submit"
                      className="h-12 rounded-xl px-7 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-sm hover:opacity-95"
                      disabled={contactMutation.isPending || !turnstileToken}
                    >
                      {contactMutation.isPending ? "Sending..." : "Submit →"}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    By submitting this form, you agree to our{" "}
                    <a href="/privacy-policy" className="underline underline-offset-2 text-gray-700 hover:text-gray-900">
                      Privacy Policy
                    </a>{" "}
                    and consent to the processing of your personal data for the purpose of responding to your inquiry.
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


