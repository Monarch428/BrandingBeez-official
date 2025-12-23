// import { useState } from "react";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { HomeTeamBanner } from "@/components/home-team-banner";
// import { SEOHead } from "@/components/seo-head";
// import { SchemaMarkup } from "@/components/schema-markup";
// import { ThankYouPopup } from "@/components/thank-you-popup";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useRegion } from "@/hooks/use-region";
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
// import { useToast } from "@/hooks/use-toast";
// import { Link } from "wouter";
// import {
//   CheckCircle,
//   ArrowRight,
//   Search,
//   Code,
//   BarChart3,
//   Zap,
//   Users,
//   Target,
//   Award,
//   Shield,
//   Handshake,
//   ChevronRight,
//   Play,
//   Download,
//   MapPin,
//   Phone,
//   Mail
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import brandingBeezLogo from "@assets/Logo_1751475462352.jpg";
// import bniLogo from "@assets/bni_1752907520728.jpg";
// import masterNetworksLogo from "@assets/mn_1752907520731.jpg";
// import h7NetworksLogo from "@assets/h7_1752907520730.jpg";

// // Partner Agency Logos
// import newVisionTechLogo from "@assets/IMG-20250719-WA0264_1752907768834.jpg";
// import carolinaWebLogo from "@assets/IMG-20250719-WA0270_1752907768835.jpg";
// import socialLandLogo from "@assets/IMG-20250719-WA0271_1752907768836.jpg";
// import focusEcommerceLogo from "@assets/IMG-20250719-WA0272_1752907768837.jpg";
// import smartConnectingLogo from "@assets/IMG-20250719-WA0273_1752907768839.jpg";
// import koalaDigitalLogo from "@assets/IMG-20250719-WA0274_1752907768841.jpg";
// import websiteArchitectLogo from "@assets/IMG-20250719-WA0275_1752907768843.jpg";
// import intrinsicLogo from "@assets/IMG-20250719-WA0276_1752907768844.jpg";
// import socialBrainLogo from "@assets/IMG-20250719-WA0277_1752907768845.jpg";
// import atlanticGrowthLogo from "@assets/atlantic-logo-new_1753433422794.jpg";
// import octupusLogo from "@assets/Octupus Logo_1753187134020.jpg";
// import { Helmet } from "react-helmet";
// import 'react-phone-input-2/lib/style.css';
// import PhoneInput from 'react-phone-input-2';

// export default function Home() {
//   const { regionConfig } = useRegion();
//   const { toast } = useToast();
//   const [showThankYouPopup, setShowThankYouPopup] = useState(false);

//   const openCalendly = () => {
//     // window.open('https://calendly.com/vignesh-velusamy/30min', '_blank');
//     window.open('/book-appointment', '_blank');
//   };

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     countryCode: '',
//     agencyName: '',
//     servicesInterested: '',
//     subServices: [] as string[],
//     message: ''
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => {
//       // Reset sub-services when main service changes
//       if (field === 'servicesInterested') {
//         return { ...prev, [field]: value, subServices: [] };
//       }
//       return { ...prev, [field]: value };
//     });
//   };

//   const handleSubServiceChange = (subService: string, checked: boolean) => {
//     setFormData(prev => ({
//       ...prev,
//       subServices: checked
//         ? [...prev.subServices, subService]
//         : prev.subServices.filter(s => s !== subService)
//     }));
//   };

//   const contactMutation = useMutation({
//     mutationFn: async (data: any) => {
//       return await apiRequest('/api/contacts', 'POST', data);
//     },
//     onSuccess: () => {
//       setShowThankYouPopup(true);
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         agencyName: '',
//         servicesInterested: '',
//         subServices: [],
//         message: ''
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to send message. Please try again.",
//         variant: "destructive",
//       });
//     }
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check if sub-services are selected when main service is chosen
//     if (formData.servicesInterested && formData.servicesInterested !== '' && formData.subServices.length === 0) {
//       toast({
//         title: "Please complete all fields",
//         description: "Please select at least one sub-service for your chosen service category.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Build comprehensive submission message
//     let comprehensiveMessage = `Home Page Contact Form Submission`;

//     if (formData.servicesInterested) {
//       comprehensiveMessage += `\n\n📋 SERVICES REQUESTED:`;
//       comprehensiveMessage += `\n• Primary Service: ${formData.servicesInterested}`;

//       if (formData.subServices.length > 0) {
//         comprehensiveMessage += `\n• Sub-services: ${formData.subServices.join(', ')}`;
//       }
//     }

//     if (formData.message) {
//       comprehensiveMessage += `\n\n💬 CUSTOMER MESSAGE:\n${formData.message}`;
//     }

//     comprehensiveMessage += `\n\n📍 REGION: ${regionConfig.name}`;

//     // Build submission data with comprehensive details
//     const submissionData = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone || '',
//       company: formData.agencyName || 'Not provided',
//       inquiry_type: 'home-contact-form',
//       message: comprehensiveMessage,
//       preferred_contact: 'email',
//       country: regionConfig.name,
//       topPriority: formData.servicesInterested || 'general-inquiry',
//       agencyName: formData.agencyName,
//       service: formData.servicesInterested,
//       servicesSelected: formData.subServices.length > 0 ? formData.subServices : undefined,
//       contactFormType: 'home-contact-form'
//     };

//     contactMutation.mutate(submissionData);
//   };

//   const services = [
//     {
//       id: 1,
//       title: "Search Engine Optimization",
//       description:
//         "Improve your website's visibility and drive organic traffic with our expert SEO services.",
//       pricing: "Starting at $500/month",
//       features: [
//         "Keyword research",
//         "On-page optimization",
//         "Link building",
//         "Content creation",
//       ],
//       href: "/services/seo",
//       icon: Search,
//     },
//     {
//       id: 2,
//       title: "PPC Advertising",
//       description:
//         "Reach your target audience and generate leads with our data-driven PPC advertising campaigns.",
//       pricing: "Starting at $400/month",
//       features: [
//         "Google Ads management",
//         "Keyword targeting",
//         "Ad copywriting",
//         "Conversion tracking",
//       ],
//       href: "/services/google-ads",
//       icon: Target,
//     },
//     {
//       id: 3,
//       title: "Web Development",
//       description:
//         "Build a professional and user-friendly website with our custom web development services.",
//       pricing: "Starting at $600",
//       features: [
//         "Website design",
//         "E-commerce development",
//         "Mobile-friendly design",
//         "Content management system",
//       ],
//       href: "/services/web-development",
//       icon: Code,
//     },
//     {
//       id: 4,
//       title: "AI Development",
//       description:
//         "Transform your business with custom AI solutions including chatbots, automation, and intelligent web agents.",
//       pricing: "Starting at $2,000/project",
//       features: [
//         "AI chatbots",
//         "Custom AI models",
//         "Process automation",
//         "AI integrations",
//       ],
//       href: "/services/ai-development",
//       icon: Zap,
//     },
//   ];

//   return (
//     <>
//       <Helmet>
//         <title>White Label Digital Services | Scale Your Agency Without Hiring</title>
//         <meta name="description" content="Scale your agency without hiring. Branding Beez offers white-label web development, SEO, PPC, and AI solutions trusted by 25+ global agencies." />
//         <link rel="canonical" href="https://brandingbeez.co.uk/" />
//         <meta name="robots" content="INDEX, FOLLOW" />
//       </Helmet>
//       <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
//         <SEOHead
//           title="White-Label Digital Agency Partner | Branding Beez"
//           description="Trusted by 25+ agencies. We provide white-label web development, SEO, PPC, and AI services to help agencies scale without hiring."
//           keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
//           canonicalUrl="https://brandingbeez.co.uk/"
//           ogType="website"
//         />
//         <SchemaMarkup type="localBusiness" />
//         <Header />
//         <main>
//           {/* Hero Section */}
//           <section className="bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral text-white py-12 sm:py-16 lg:py-20 px-4">
//             <div className="max-w-[84rem] mx-auto p-2">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//                 <div>
//                   <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
//                     <span className="text-sm font-semibold text-white">✓ Trusted by 25+ Agencies Worldwide</span>
//                   </div>
//                   <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
//                     Scale Your Agency
//                     <span className="text-brand-yellow"> Without Hiring</span>
//                   </h1>
//                   <p className="text-lg sm:text-lg lg:text-lg text-white/90 mb-8 lg:text-justify leading-relaxed">
//                     White-label digital services that help agencies hire expert teams for web development, PPC, and SEO.
//                     We handle the entire process so you can focus on growing your business and delivering results for your clients.
//                   </p>
//                   <h2 className="text-2xl sm:text-md lg:text-2xl font-semibold text-white/90 mb-8 leading-relaxed">
//                     A Team of 20+ Ready to Help
//                   </h2>

//                   {/* Key Benefits */}
//                   <div className="space-y-3 mb-8">
//                     <div className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-yellow" />
//                       <span className="text-md lg:text-md text-white">100% White-Label</span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-yellow" />
//                       <span className="text-md lg:text-md text-white">24hr Response Time</span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-yellow" />
//                       <span className="text-md lg:text-md text-white">85% Satisfaction Rate</span>
//                     </div>
//                   </div>

//                   {/* CTAs */}
//                   <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//                     <Button
//                       size="lg"
//                       className="bg-brand-coral hover:bg-brand-coral-dark text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
//                       asChild
//                     >
//                       <Link href="/onboarding-wizard">
//                         <span className="hidden sm:inline">Find Your Perfect Service</span>
//                         <span className="sm:hidden">Find Service</span>
//                         <ArrowRight className="ml-2 h-4 w-4" />
//                       </Link>
//                     </Button>
//                     <Button
//                       size="lg"
//                       className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
//                       onClick={openCalendly}
//                     >
//                       <span className="hidden sm:inline">Book Free Strategy Call</span>
//                       <span className="sm:hidden">Book Call</span>
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <HomeTeamBanner />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Services Section */}
//           <section className="py-14 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
//                 <p className="text-lg text-gray-700 max-w-3xl mx-auto">
//                   We offer a wide range of digital marketing services to help you grow your business.
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
//                 {services.map((service) => {
//                   const Icon = service.icon;

//                   return (
//                     <Card
//                       key={service.id}
//                       className="group border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-full"
//                     >
//                       {/* Header */}
//                       <CardHeader className="flex-shrink-0">
//                         <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-coral/20 transition-colors">
//                           <Icon className="w-6 h-6 text-brand-coral-darker" />
//                         </div>

//                         <CardTitle className="text-xl font-bold text-brand-purple min-h-[3.5rem] flex items-center">
//                           <h3>{service.title}</h3>
//                         </CardTitle>

//                         {/* FIXED */}
//                         <p className="text-gray-700 min-h-[3rem] leading-relaxed text-left line-clamp-4">
//                           {service.description}
//                         </p>
//                       </CardHeader>

//                       {/* Body + Button */}
//                       <CardContent className="pt-0 flex flex-col flex-1">
//                         <div className="flex flex-col flex-1 space-y-4">
//                           <div className="text-lg font-bold text-brand-coral-darker">
//                             {service.pricing}
//                           </div>

//                           <ul className="space-y-2 flex-1">
//                             {service.features.map((feature, index) => (
//                               <li key={index} className="flex items-center gap-2 text-sm">
//                                 <CheckCircle className="w-4 h-4 text-brand-coral-darker mt-0.5 flex-shrink-0" />
//                                 <span>{feature}</span>
//                               </li>
//                             ))}
//                           </ul>

//                           {/* FORCE BUTTON TO BOTTOM */}
//                           <div className="mt-auto pt-4">
//                             <Link href={service.href}>
//                               <Button className="w-full h-11 bg-gradient-to-r from-brand-coral to-brand-coral-dark hover:from-brand-coral-dark hover:to-brand-coral-darker text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg whitespace-nowrap">
//                                 <span className="leading-tight text-white text-md">Learn More</span>
//                                 <ArrowRight className="w-4 h-4" />
//                               </Button>
//                             </Link>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             </div>
//           </section>


//           {/* Partner Agencies Section - Rebuilt */}
//           {/* <section className="py-16 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">Partner Agencies</h2>
//                 <p className="text-lg text-gray-700 max-w-3xl mx-auto">
//                   Trusted by leading agencies worldwide who rely on our expert teams to deliver exceptional results for their clients.
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={socialLandLogo}
//                     alt="Social Land"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">Social Land</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={websiteArchitectLogo}
//                     alt="Website Architect"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">Website Architect</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={focusEcommerceLogo}
//                     alt="Focus E-commerce"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">Focus E-commerce</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={smartConnectingLogo}
//                     alt="Koala Digital"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">Koala Digital</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={newVisionTechLogo}
//                     alt="New Vision Tech"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">New Vision Tech</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={carolinaWebLogo}
//                     alt="Carolina Web"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">Carolina Web</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={intrinsicLogo}
//                     alt="Intrinsic"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">Intrinsic</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200">
//                   <img
//                     src={socialBrainLogo}
//                     alt="Social Brain"
//                     className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[150px]"
//                     loading="eager"
//                   />
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">Social Brain</p>
//                 </div>
//               </div>
//             </div>
//           </section> */}

//           <section className="py-16 bg-gray-50 overflow-hidden">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                   <span className="text-5xl font-extrabold text-brand-coral">25+ </span>
//                   <span className="text-gray-800">Partner Agencies</span>
//                 </h2>

//                 <p className="text-lg text-gray-700 max-w-3xl mx-auto">
//                   Trusted by leading agencies worldwide who rely on our expert teams to deliver exceptional results for their clients.
//                 </p>
//               </div>

//               {/* ---- MARQUEE CAROUSEL ---- */}
//               <div className="relative w-full flex overflow-x-hidden">
//                 <div className="flex animate-marquee whitespace-nowrap gap-6">
//                   {[...Array(2)].map((_, i) => (
//                     <div key={i} className="flex gap-6">

//                       {/* CARD LIST - SAME AS YOUR CODE */}
//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={socialLandLogo} alt="Social Land" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">Social Land</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={websiteArchitectLogo} alt="Website Architect" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">Website Architect</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={focusEcommerceLogo} alt="Focus E-commerce" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">Focus E-commerce</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={smartConnectingLogo} alt="Koala Digital" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">Koala Digital</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={newVisionTechLogo} alt="New Vision Tech" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">New Vision Tech</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={carolinaWebLogo} alt="Carolina Web" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">Carolina Web</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={intrinsicLogo} alt="Intrinsic" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">Intrinsic</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[150px] md:w-[180px]">
//                         <img src={socialBrainLogo} alt="Social Brain" className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain" />
//                         <p className="text-xs sm:text-sm font-medium text-gray-900">Social Brain</p>
//                       </div>

//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Dedicated Resources Section */}
//           <section className="py-12 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
//             <div className="max-w-5xl mx-auto text-center">

//               <Badge className="bg-white/20 text-white border-white/30 mb-8 mx-auto">
//                 🔥 Most Sought-After Service
//               </Badge>

//               <h2 className="text-4xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
//                 Dedicated Resources for US Agencies
//               </h2>

//               <p className="text-lg sm:text-md lg:text-lg text-gray-100 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed">
//                 Scale your agency with handpicked pros who integrate seamlessly
//               </p>

//               {/* UPDATED GLASSMORPH CARD */}
//               <div
//                 className="
//         bg-[rgba(40,20,50,0.6)]
//         backdrop-blur-xl
//         rounded-2xl
//         p-6 sm:p-8 lg:p-10
//         mb-8 sm:mb-10 lg:mb-12
//         border border-white/10
//         shadow-[0px_8px_32px_rgba(0,0,0,0.3)]
//         max-w-3xl mx-auto
//       "
//               >
//                 <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-white">
//                   Starting  @ $1200/month
//                 </div>

//                 <div className="text-base sm:text-md lg:text-lg text-gray-200 mb-2 sm:mb-3">
//                   Team Discounts: Up to 20% Off
//                 </div>

//                 <div className="text-sm sm:text-base lg:text-lg text-gray-200 mb-6 sm:mb-8">
//                   Average 60% cost savings vs. in-house team
//                 </div>

//                 <ul className="space-y-2 sm:space-y-3 text-left text-gray-100 mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
//                   <li className="flex items-center gap-2 sm:gap-3">
//                     <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
//                     <span className="text-sm sm:text-base">Graphic Designers</span>
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
//                     <span className="text-base">Video Editors</span>
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
//                     <span className="text-base">SEO Specialists</span>
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
//                     <span className="text-base">Google Ads Experts</span>
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
//                     <span className="text-base">Web Developers</span>
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
//                     <span className="text-base">Full-Stack Developers</span>
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
//                     <span className="text-base">Data Entry/Virtual Assistants/Social Media Managers</span>
//                   </li>
//                 </ul>

//                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
//                   <Button
//                     className="bg-brand-coral hover:bg-white hover:text-brand-purple text-white text-base lg:text-md sm:text-md px-6 sm:px-8 py-3 sm:py-4 font-semibold touch-manipulation group"
//                     asChild
//                   >
//                     <Link href="/contact?coupon=SETUP FREE&service=dedicated-resources&promo=setup-free">
//                       Free Setup Cost
//                       <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-white group-hover:text-brand-purple transition-colors duration-300" />
//                     </Link>
//                   </Button>

//                   <Button
//                     variant="outline"
//                     className="border-white text-white hover:bg-white hover:text-brand-purple bg-transparent text-base sm:text-md px-6 sm:px-8 py-3 sm:py-4 touch-manipulation"
//                     asChild
//                   >
//                     <Link href="/services/dedicated-resources">Learn More</Link>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Contact Form Section */}
//           <section className="py-16 px-4 bg-white">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center mb-8 sm:mb-10 lg:mb-12">
//                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
//                   Ready to Scale Your Agency?
//                 </h2>
//                 <p className="text-lg sm:text-md text-gray-700 px-4 sm:px-0">
//                   Get a free consultation and discover how we can help you grow
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
//                 {/* Left Column - Strategy Call Agenda */}
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                       What to Expect in Your 30-Minute Strategy Call
//                     </h3>
//                     <ul className="space-y-4">
//                       <li className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
//                         <div>
//                           <span className="font-semibold text-gray-900">Business Discovery</span>
//                           <p className="text-gray-700 text-sm mt-1">Understanding your current agency setup, services, and target market</p>
//                         </div>
//                       </li>
//                       <li className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
//                         <div>
//                           <span className="font-semibold text-gray-900">Challenge Identification</span>
//                           <p className="text-gray-700 text-sm mt-1">Pinpointing specific pain points and growth bottlenecks you're facing</p>
//                         </div>
//                       </li>
//                       <li className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
//                         <div>
//                           <span className="font-semibold text-gray-900">Collaboration Opportunities</span>
//                           <p className="text-gray-700 text-sm mt-1">Exploring how our services can complement your existing offerings</p>
//                         </div>
//                       </li>
//                       <li className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
//                         <div>
//                           <span className="font-semibold text-gray-900">Resource Assessment</span>
//                           <p className="text-gray-700 text-sm mt-1">Determining what type of support would best accelerate your growth</p>
//                         </div>
//                       </li>
//                       <li className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
//                         <div>
//                           <span className="font-semibold text-gray-900">Partnership Benefits</span>
//                           <p className="text-gray-700 text-sm mt-1">Discussing mutual opportunities for long-term collaboration</p>
//                         </div>
//                       </li>
//                       <li className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></div>
//                         <div>
//                           <span className="font-semibold text-gray-900">Next Steps</span>
//                           <p className="text-gray-700 text-sm mt-1">Outlining a clear action plan if there's a good fit between our businesses</p>
//                         </div>
//                       </li>
//                     </ul>
//                     <div className="mt-6 pt-2 border-t border-purple-200">
//                       <p className="text-sm text-gray-700 italic">
//                         This call is designed to be a genuine business-to-business conversation focused on mutual growth and partnership opportunities.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column - Contact Form */}
//                 <div>
//                   <Card className="shadow-xl">
//                     <CardHeader>
//                       <CardTitle className="text-center font-bold text-gray-900">Schedule Strategy Call</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
//                             <Input
//                               id="name"
//                               type="text"
//                               required
//                               value={formData.name}
//                               onChange={(e) => handleInputChange('name', e.target.value)}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
//                             <Input
//                               id="email"
//                               type="email"
//                               required
//                               value={formData.email}
//                               onChange={(e) => handleInputChange('email', e.target.value)}
//                             />
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {/* <div>
//                             <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
//                             <Input
//                               id="phone"
//                               type="tel"
//                               value={formData.phone}
//                               onChange={(e) => handleInputChange('phone', e.target.value)}
//                             />
//                           </div> */}
//                           <div>
//                             <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>

//                             <PhoneInput
//                               country="us"
//                               value={formData.phone}
//                               onChange={(value) => handleInputChange('phone', value)}
//                               inputProps={{
//                                 name: "phone",
//                                 className:
//                                   "w-full h-10 rounded-md border border-gray-300 pl-12 pr-3 text-gray-900 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral",
//                               }}
//                               containerClass="w-full"
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="agencyName" className="text-sm font-medium text-gray-700">Agency Name</Label>
//                             <Input
//                               id="agencyName"
//                               type="text"
//                               value={formData.agencyName}
//                               onChange={(e) => handleInputChange('agencyName', e.target.value)}
//                             />
//                           </div>
//                         </div>
//                         <div>
//                           <Label htmlFor="servicesInterested" className="text-sm font-medium text-gray-700">Services Interested In</Label>
//                           <Select value={formData.servicesInterested} onValueChange={(value) => handleInputChange('servicesInterested', value)}>
//                             <SelectTrigger aria-label="Select services interested in">
//                               <SelectValue placeholder="Select services" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="SEO Services">SEO Services</SelectItem>
//                               <SelectItem value="PPC/Google Ads">PPC/Google Ads</SelectItem>
//                               <SelectItem value="Website Development">Website Development</SelectItem>
//                               <SelectItem value="AI Web Agents/AI Development">AI Web Agents/AI Development</SelectItem>
//                               <SelectItem value="Dedicated Resource">Dedicated Resource</SelectItem>
//                               <SelectItem value="N8N Automations">N8N Automations (Coming Soon)</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         {/* Step 2: Sub-Service Selection */}
//                         {formData.servicesInterested && (
//                           <div className="space-y-4">
//                             <Label className="text-sm font-medium text-gray-700">
//                               What are you specifically looking for in {formData.servicesInterested}? *
//                             </Label>
//                             <div className="grid grid-cols-1 gap-3">

//                               {/* SEO Services Options */}
//                               {formData.servicesInterested === 'SEO Services' && (
//                                 <>
//                                   {[
//                                     'Link building',
//                                     'Local SEO',
//                                     'Technical SEO audit & fixes',
//                                     'Content marketing & SEO Blogging',
//                                     'E-Commerce SEO'
//                                   ].map((option) => (
//                                     <div key={option} className="flex items-center space-x-2">
//                                       <Checkbox
//                                         id={option}
//                                         checked={formData.subServices.includes(option)}
//                                         onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
//                                       />
//                                       <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
//                                         {option}
//                                       </Label>
//                                     </div>
//                                   ))}
//                                 </>
//                               )}

//                               {/* PPC/Google Ads Options */}
//                               {formData.servicesInterested === 'PPC/Google Ads' && (
//                                 <>
//                                   {[
//                                     'Starter Package',
//                                     'Growth Package',
//                                     'Scale Package'
//                                   ].map((option) => (
//                                     <div key={option} className="flex items-center space-x-2">
//                                       <Checkbox
//                                         id={option}
//                                         checked={formData.subServices.includes(option)}
//                                         onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
//                                       />
//                                       <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
//                                         {option}
//                                       </Label>
//                                     </div>
//                                   ))}
//                                 </>
//                               )}

//                               {/* Website Development Options */}
//                               {formData.servicesInterested === 'Website Development' && (
//                                 <>
//                                   {[
//                                     'WordPress',
//                                     'Shopify',
//                                     'BigCommerce',
//                                     'Custom Coded'
//                                   ].map((option) => (
//                                     <div key={option} className="flex items-center space-x-2">
//                                       <Checkbox
//                                         id={option}
//                                         checked={formData.subServices.includes(option)}
//                                         onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
//                                       />
//                                       <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
//                                         {option}
//                                       </Label>
//                                     </div>
//                                   ))}
//                                 </>
//                               )}


//                               {/* Dedicated Resource Options */}
//                               {formData.servicesInterested === 'Dedicated Resource' && (
//                                 <>
//                                   {[
//                                     'Graphic Designer',
//                                     'Video Editor',
//                                     'SEO Specialist',
//                                     'Google Ads Expert',
//                                     'Web Developer',
//                                     'Full-Stack Developer',
//                                     'Others (Data Entry/Virtual Assistants/Social Media Managers)'
//                                   ].map((option) => (
//                                     <div key={option} className="flex items-center space-x-2">
//                                       <Checkbox
//                                         id={option}
//                                         checked={formData.subServices.includes(option)}
//                                         onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
//                                       />
//                                       <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
//                                         {option}
//                                       </Label>
//                                     </div>
//                                   ))}
//                                 </>
//                               )}

//                               {/* AI Web Agents/AI Development Options */}
//                               {formData.servicesInterested === 'AI Web Agents/AI Development' && (
//                                 <>
//                                   {[
//                                     'AI Powered web app/Mobile app development',
//                                     'AI Agentic Platform development',
//                                     'AI Integration into existing platforms'
//                                   ].map((option) => (
//                                     <div key={option} className="flex items-center space-x-2">
//                                       <Checkbox
//                                         id={option}
//                                         checked={formData.subServices.includes(option)}
//                                         onCheckedChange={(checked) => handleSubServiceChange(option, !!checked)}
//                                       />
//                                       <Label htmlFor={option} className="text-sm font-medium text-gray-700 cursor-pointer">
//                                         {option}
//                                       </Label>
//                                     </div>
//                                   ))}
//                                 </>
//                               )}

//                               {/* N8N Automations Options */}
//                               {formData.servicesInterested === 'N8N Automations (Coming Soon)' && (
//                                 <div className="text-center py-4">
//                                   <p className="text-gray-500 font-medium">Coming Soon!</p>
//                                   <p className="text-sm text-gray-400">We're working on bringing you the best N8N automation solutions.</p>
//                                 </div>
//                               )}

//                             </div>
//                           </div>
//                         )}

//                         <div>
//                           <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
//                           <Textarea
//                             id="message"
//                             rows={4}
//                             value={formData.message}
//                             onChange={(e) => handleInputChange('message', e.target.value)}
//                             placeholder="Tell us about your agency and goals..."
//                           />
//                         </div>
//                         <Button
//                           type="submit"
//                           disabled={contactMutation.isPending}
//                           className="w-full font-bold py-3 text-white bg-gradient-to-r from-brand-coral-dark to-brand-coral-darker hover:from-brand-coral hover:to-brand-coral-dark shadow-lg"
//                         >
//                           {contactMutation.isPending ? 'Submitting...' : 'Submit Form'}
//                         </Button>
//                       </form>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </div>
//             <ThankYouPopup
//               isOpen={showThankYouPopup}
//               onClose={() => setShowThankYouPopup(false)}
//               title="Thank You for Submitting!"
//               message="We've received your strategy request and will get back to you within 24 hours to discuss how we can help scale your agency."
//               formType="strategy"
//             />
//           </section>

//           {/* CTA Section */}
//           <section className="py-12 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter!</h2>
//                 <p className="text-lg text-white/90 mb-8">Join 1000+ marketers & agencies getting exclusive tips on SEO, AI, and growth strategies delivered straight to their inbox.</p>
//                 <Button
//                   size="lg"
//                   className="bg-white text-md text-brand-purple hover:bg-white/90 px-8 py-4"
//                   asChild
//                 >
//                   <Link href="/newsletter">
//                     Subscribe Free
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </section>
//         </main>
//         <Footer />
//       </div>
//     </>
//   );
// }
// ✅ Regional Partners type + data
// type RegionalPartnersMember = {
//   name: string;
//   title: string;
//   location: string;
//   role: string;
//   expertise: string[];
//   contact: string;
//   image?: string;
// };

// const regionalPartners: RegionalPartnersMember[] = [
//   {
//     name: "Ken",
//     title: "Business Partner - United States",
//     location: "Nationwide USA Coverage",
//     role: "Ken represents BrandingBeez across the United States, connecting with local businesses and forums to bring AI automation solutions to American SMBs.",
//     expertise: [
//       "US market AI adoption strategies",
//       "Local business development and networking",
//       "SMB outreach and community engagement",
//       "Regional compliance and business practices",
//     ],
//     contact: "Reach Ken for US-based projects and consultations",
//     image: ken,
//   },
//   {
//     name: "Matt",
//     title: "Business Partner - Miami/Southeast",
//     location: "Miami, Florida & Southeast Region",
//     role: "Matt focuses on the vibrant Miami business ecosystem and Southeast markets, specializing in connecting with local entrepreneurs and established businesses.",
//     expertise: [
//       "Southeast US market penetration",
//       "Miami startup and SMB ecosystem",
//       "Local networking and business development",
//       "Regional market insights and opportunities",
//     ],
//     contact: "Connect with Matt for Southeast US projects",
//     image: matt,
//   },
//   {
//     name: "Phillip Einetter",
//     title: "Business Partner - Germany/Europe",
//     location: "Germany & European Markets",
//     role: "Philip brings BrandingBeez AI solutions to German and European businesses, navigating GDPR compliance and regional business practices.",
//     expertise: [
//       "European market AI regulations (GDPR compliance)",
//       "German business culture and practices",
//       "EU-wide business development",
//       "Multi-language project coordination",
//     ],
//     contact: "Contact Philip for European projects & consultations",
//     image: phillip,
//   },
// ];












import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HomeTeamBanner } from "@/components/home-team-banner";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { ThankYouPopup } from "@/components/thank-you-popup";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  CheckCircle,
  ArrowRight,
  Search,
  Code,
  Zap,
  Target,
  Award,
  Users,
  Check,
  Shield,
  X,
} from "lucide-react";

import brandingBeezLogo from "@assets/Logo_1751475462352.jpg";
import bniLogo from "@assets/bni_1752907520728.jpg";
import masterNetworksLogo from "@assets/mn_1752907520731.jpg";
import h7NetworksLogo from "@assets/h7_1752907520730.jpg";
import webArtLogo from "../../public/images/website-architect-logo.jpeg";
import mdmLogo from "../../public/images/MDM Logo.png";
import nvtLogo from "../../public/images/NVT Logo.png";

// Partner Agency Logos
import newVisionTechLogo from "@assets/IMG-20250719-WA0264_1752907768834.jpg";
import carolinaWebLogo from "@assets/IMG-20250719-WA0270_1752907768835.jpg";
import socialLandLogo from "@assets/IMG-20250719-WA0271_1752907768836.jpg";
import focusEcommerceLogo from "@assets/IMG-20250719-WA0272_1752907768837.jpg";
import smartConnectingLogo from "@assets/IMG-20250719-WA0273_1752907768839.jpg";
import koalaDigitalLogo from "@assets/IMG-20250719-WA0274_1752907768841.jpg";
import websiteArchitectLogo from "@assets/IMG-20250719-WA0275_1752907768843.jpg";
import intrinsicLogo from "@assets/IMG-20250719-WA0276_1752907768844.jpg";
import socialBrainLogo from "@assets/IMG-20250719-WA0277_1752907768845.jpg";
import atlanticGrowthLogo from "@assets/atlantic-logo-new_1753433422794.jpg";
import octupusLogo from "@assets/Octupus Logo_1753187134020.jpg";
import fsbLogo from "../../public/images/FSE-Digital-Logo.jpg";
import museLogo from "../../public/images/Muse_Logo_Blue.png";
import { Helmet } from "react-helmet";
import "react-phone-input-2/lib/style.css";
import ken from "../../public/images/Ken.png";
import matt from "../../public/images/Matt.png";
import phillip from "../../public/images/Phillip.png";
import {
  AppointmentCalendar,
  BookCallButtonWithModal,
} from "@/components/book-appoinment";
import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
import Mark_Image from "../../public/images/Mark.png";
import Dani_Image from "../../public/images/Dani.png";
import Gemma_Image from "../../public/images/Gemma.png";
import AgencyContactSection from "@/components/agency-contact-section";
import { TestimonialCard } from "@/components/TestimonialCard";
import ChristmasEffects from "@/components/FestiveSnowOverlay";
import { navigate } from "wouter/use-browser-location";
import PortfolioCtaSection from "@/components/portfolioimagecta";

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScrollToSection = () => {
      const { hash } = window.location;

      const targetId =
        hash === "#newsletter"
          ? "newsletter"
          : hash === "#book-appointment"
            ? "book-appointment"
            : null;

      if (!targetId) return;

      requestAnimationFrame(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const headerOffset = 100;
          const elementPosition =
            targetEl.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    };

    setTimeout(handleScrollToSection, 50);
  }, []);

  const who_service = [
    {
      label: "SEO",
      href: "/services/seo",
    },
    {
      label: "PPC/Google Ads",
      href: "/services/google-ads",
    },
    {
      label: "Dedicated ongoing resources",
      href: "/services/dedicated-resources",
    },
    {
      label: "Websites Design & Development",
      href: "/services/web-development",
    },
    {
      label: "Custome Web & Mobile apps (Powered by AI)",
      href: "/services/custom-app-development",
    },
  ];

  const benefits = [
    "Faster delivery without compromising quality",
    "Predictable, scalable fulfillment",
    "A white-label team they can trust long-term",
  ];

  // Newsletter CTA state (for home page CTA section)
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [showNewsletterThankYou, setShowNewsletterThankYou] = useState(false);

  const handleNewsletterSubscribe = async () => {
    if (!newsletterName.trim() || !newsletterEmail.trim()) {
      setNewsletterStatus("❌ Please enter both name and email");
      return;
    }

    setNewsletterLoading(true);
    setNewsletterStatus("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newsletterName, email: newsletterEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setShowNewsletterThankYou(true);
        setNewsletterName("");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setNewsletterStatus("❌ Server error. Try again later.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const services = [
    {
      id: 1,
      title: "SEO Services",
      description:
        "White-label SEO services built for US agencies managing multiple clients.",
      pricing: "Starting at $399/month",
      originalPrice: "$500",
      discountedPrice: "$399",
      discountLabel: "20% OFF",
      billingUnit: "/month",
      extraNote: "Average 150% increase in organic traffic",
      features: [
        "White-label SEO reporting",
        "On-page & technical SEO",
        "Content & keyword strategy",
        "Backlink strategy for competitive niches",
      ],
      href: "/services/seo",
      icon: Search,
    },
    {
      id: 2,
      title: "PPC Advertising",
      description:
        "Maximize ROI with expert PPC campaign management for your agency clients.",
      pricing: "Starting at $399/project",
      originalPrice: "$399",
      discountedPrice: "$400",
      discountLabel: "20% OFF",
      billingUnit: "/project",
      extraNote: "Best for agencies managing multiple client accounts",
      features: [
        "Google Ads account setup & audit",
        "Keyword & audience targeting",
        "Conversion & call tracking setup",
        "Weekly optimization & reporting",
      ],
      href: "/services/google-ads",
      icon: Target,
    },
    {
      id: 4,
      title: "Website Design & Development",
      description:
        "Custom websites that turn visitors into lifelong customers for your agency clients.",
      pricing: "Starting at $599/project",
      originalPrice: "$599",
      discountedPrice: "$600",
      discountLabel: "20% OFF",
      billingUnit: "/project",
      extraNote: "Ideal for landing pages, service sites & local businesses",
      features: [
        "Conversion-focused UX & copy structure",
        "Responsive & mobile-first design",
        "CMS integration (WordPress/Headless)",
        "Speed & core web vitals optimization",
      ],
      href: "/services/web-development",
      icon: Code,
    },
    {
      id: 5,
      title: "Custom App Development",
      description:
        "High-performance applications built for scalability, automation, and seamless user experience.",
      pricing: "Starting at $2,799/project",
      originalPrice: "$2,799",
      discountedPrice: "$2,800",
      discountLabel: "20% OFF",
      billingUnit: "/project",
      extraNote: "Perfect for portals, SaaS, internal tools & AI workflows",
      features: [
        "Custom Web Application Development",
        "iOS & Android Mobile App Development",
        "AI & automation flows integration",
        "UI/UX Design & prototyping",
      ],
      href: "/services/custom-app-development",
      icon: Zap,
    },
  ];

  const stats = [
    { number: "6+", label: "Years Experience", icon: Award },
    { number: "20+", label: "In-house Specialists", icon: Users },
    { number: "100%", label: "White-Label", icon: Shield },
  ];

  const problems = [
    "The high cost and risk of full-time hiring in the US",
    "Inconsistent freelancers and unreliable contractors",
    "Overloaded internal teams causing delivery bottlenecks",
    "Limited scalability when client demand spikes",
    "Tight deadlines that threaten quality and reputation",
  ];

  const solutions = [
    "Dedicated, full-time white-label resources assigned to your agency",
    "Reliable delivery fully aligned with your workflows and standards",
    "Scalable capacity that grows or shrinks with client demand",
    "Consistent quality, on-time delivery, and strict confidentiality",
  ];

  const testimonials = [
    {
      id: 1,
      name: "Mark Muse",
      company: "Founder, Muse Digital Media",
      testimonial:
        "Brandingbeez understood not only the technical challenges but was also completely responsive throughout. They the provided framework, assets, and vision into a beautiful website tailored to a high-ticket offering, helping the end client stay competitive. The team stayed responsive and aware of the technical challenges, even with multiple change requests from the end client.",
      imageUrl: Mark_Image,
      logoUrl: mdmLogo,
    },
    {
      id: 2,
      name: "Daniel Fechete",
      company: "COO, New Vision Tech",
      testimonial:
        "Their attention to detail and interest in understanding our requirements perfectly stood out. Brandingbeez successfully designed the requested brochures, demonstrating a thorough understanding of the client's products and expectations. The detail-oriented team delivered the project on time and maintained constant communication through email, messaging apps, and virtual meetings.",
      imageUrl: Dani_Image,
      logoUrl: nvtLogo,
    },
    {
      id: 3,
      name: "Gemma Murphy",
      company: "Founder, Website Architect",
      testimonial:
        "Branding Beez have been a great help to my business. Before meeting Raje and her team, I was doing the sales, building the websites and handling all the tech and aftercare. Now I have the time to grow the business, working ON it, instead of constantly 'IN' it. So they've been a gamechanger for me and my business. Even taking my first holiday this year WITHOUT my laptop! Thanks so much!",
      imageUrl: Gemma_Image,
      logoUrl: webArtLogo,
    },
  ];

  // 🎄 Only show snowfall in December (month index 11)
  // const isChristmasSeason = new Date().getMonth() === 11;

  return (
    <>
      {/* {isChristmasSeason && (
        <ChristmasEffects
          showOnMobile={true}
          showSnow={true}
          showGlow={true}
          showLights={false}
          showEmojiSnow={true}
        />
      )} */}

      <Helmet>
        <title>
          White Label Digital Services | Scale Your Agency Without Hiring
        </title>
        <meta
          name="description"
          content="Scale your agency without hiring. Branding Beez offers white-label web development, SEO, PPC, and AI solutions trusted by 25+ global agencies."
        />
        <link rel="canonical" href="https://brandingbeez.co.uk/" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="Hire Dedicated White-Label Teams for US Agencies | BrandingBeez"
          description="Hire dedicated developers, designers, SEO and PPC experts under your brand. Trusted white-label partner for US agencies."
          keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
          canonicalUrl="https://brandingbeez.co.uk/"
          ogType="website"
        />
        <SchemaMarkup type="localBusiness" />
        <Header />

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral text-white py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                {/* Left: Copy */}
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-5 sm:mb-6">
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      ✓ Trusted by 25+ Agencies Worldwide
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    Scale Your Agency
                    <span className="text-brand-yellow">
                      {" "}
                      Without Hiring Full-Time Staff
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 text-left leading-relaxed">
                    White-label delivery teams for US digital agencies offering
                    dedicated resources, websites, SEO, PPC, and AI-powered
                    development under your brand.
                  </p>

                  <h2 className="text-base sm:text-lg lg:text-xl font-medium text-white/90 mb-6 sm:mb-8 leading-snug">
                    A Dedicated 20+ Person Delivery Team Built for Agencies
                  </h2>

                  {/* Key Benefits */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-yellow" />
                      <span className="text-sm sm:text-base text-white">
                        100% White-Label Delivery
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-yellow" />
                      <span className="text-sm sm:text-base text-white">
                        US-Timezone Overlap &amp; 24-Hour Turnaround
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-yellow" />
                      <span className="text-sm sm:text-base text-white">
                        Save Up to 60% vs In-House Hiring
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      size="lg"
                      className="bg-brand-coral hover:bg-brand-coral-dark text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
                      asChild
                    >
                      <Link href="/onboarding-wizard">
                        <span className="hidden sm:inline">
                          Hire Dedicated Resources
                        </span>
                        <span className="sm:hidden">Hire Resources</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <BookCallButtonWithModal
                      buttonLabel="Book a Free Strategy Call"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
                      buttonSize="lg"
                    />
                  </div>
                </div>

                {/* Right: HomeTeamBanner (hidden <= 480px) */}
                <div className="relative max-[480px]:hidden mt-8 lg:mt-0">
                  <HomeTeamBanner />
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Our Services
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                  White-label services designed to help US agencies deliver
                  faster, scale profitably, and retain clients longer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
                {services.map((service) => {
                  const Icon = service.icon;

                  return (
                    <Card
                      key={service.id}
                      className="group border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-full"
                    >
                      {/* HEADER */}
                      <CardHeader className="flex-shrink-0">
                        {/* ICON + TITLE ROW */}
                        <div className="flex items-center gap-3 mb-3 sm:mb-4 bg-brand-coral/10 rounded-lg px-3 py-2 group-hover:bg-brand-coral/20 transition-colors">
                          <Icon className="w-6 h-6 text-brand-coral-darker flex-shrink-0" />
                          <CardTitle className="text-base sm:text-lg font-bold text-brand-purple min-h-[56px] flex items-center">
                            {service.title}
                          </CardTitle>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-4 min-h-[80px]">
                          {service.description}
                        </p>
                      </CardHeader>

                      {/* BODY */}
                      <CardContent className="pt-0 flex flex-col flex-1">
                        <div className="flex flex-col flex-1 space-y-4">
                          {/* PRICING */}
                          <div className="text-base sm:text-lg font-bold text-brand-coral-darker">
                            {service.pricing}
                          </div>

                          {/* FEATURES */}
                          <ul className="space-y-2 flex-1">
                            {service.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-xs sm:text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-brand-coral-darker mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* BUTTON — STICKS TO BOTTOM */}
                          <div className="mt-auto pt-4">
                            <Link href={service.href}>
                              <Button className="w-full h-11 bg-gradient-to-r from-brand-coral to-brand-coral-dark hover:from-brand-coral-dark hover:to-brand-coral-darker text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg whitespace-nowrap">
                                <span className="leading-tight text-white text-sm sm:text-base">
                                  Learn More
                                </span>
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Our Portfolio Section (with Slider) */}
          {/* <section className="bg-gradient-to-br from-pink-50 via-white to-blue-50 py-10 sm:py-14 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
                  Our Portfolio’s
                </h2>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                  Explore our collection of beautifully crafted, performance-driven projects
                  built for top digital agencies and brands across the globe.
                </p>
              </div>

              <div className="-mx-4 sm:-mx-6 md:mx-0">
                <PortfolioCtaSection />
              </div>
            </div>
          </section>


          {/* Who We Work With Section */}
          <section className="bg-[rgb(255,255,255)] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-10 sm:mb-14 md:mb-16">
                {/* <div className="flex items-center gap-2 bg-brand-coral text-white px-6 py-2 rounded-full mb-6 sm:mb-8 mx-auto w-fit">
                  <span className="font-medium">Who We Work With</span>
                </div> */}

                <h1 className="mb-4 sm:mb-6 text-black max-w-3xl text-center mx-auto font-bold text-2xl sm:text-3xl lg:text-4xl">
                  Built for Growing Digital Marketing Agencies
                </h1>

                <p className="text-slate-700 leading-relaxed max-w-2xl text-center mx-auto text-sm sm:text-base">
                  We specialize in supporting US and UK digital marketing
                  agencies that want to grow revenue, expand service offerings,
                  and take on more clients without increasing payroll or
                  overhead.
                </p>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Services Section */}
                <div className="px-0">
                  <h3 className="text-[rgba(0,0,0,0.82)] mb-5 sm:mb-8 flex items-center gap-3 font-bold">
                    If your agency needs to deliver:
                  </h3>

                  <div className="space-y-4">
                    {who_service.map((service, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(service.href)}
                        className="group flex items-center gap-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-5 hover:border-[#FF5A5F] transition-all hover:bg-white/30 shadow-lg cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-brand-coral flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Check
                            className="w-4 h-4 text-white"
                            strokeWidth={2.5}
                          />
                        </div>
                        <span className="text-black">{service.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 sm:mt-8 p-6 bg-brand-coral rounded-xl">
                    <p className="text-[rgb(255,255,255)] italic">
                      Under your brand, while a reliable partner handles
                      execution BrandingBeez is built for you.
                    </p>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-gradient-to-tl from-brand-purple via-brand-purple/90 to-brand-coral rounded-2xl p-6 sm:p-8 md:px-[32px] md:py-[70px]">
                  <h3 className="text-white mb-5 sm:mb-8 uppercase font-medium tracking-wider">
                    Our agency partners come to us when they want:
                  </h3>

                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 border border-white/20 hover:bg-white/20 transition-all"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-coral flex items-center justify-center mt-0.5">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-white leading-relaxed text-sm sm:text-base">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partner Agencies Marquee */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-coral">
                    25+{" "}
                  </span>
                  <span className="text-gray-800">Partner Agencies</span>
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                  Trusted by leading agencies worldwide who rely on our expert
                  teams to deliver exceptional results for their clients.
                </p>
              </div>

              {/* ---- MARQUEE CAROUSEL ---- */}
              <div className="relative w-full flex overflow-x-hidden">
                <div className="flex animate-marquee whitespace-nowrap gap-4 sm:gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-4 sm:gap-6">
                      {[
                        { logo: socialLandLogo, name: "Social Land" },
                        {
                          logo: websiteArchitectLogo,
                          name: "Website Architect",
                        },
                        {
                          logo: focusEcommerceLogo,
                          name: "Focus E-commerce",
                        },
                        { logo: smartConnectingLogo, name: "Koala Digital" },
                        { logo: newVisionTechLogo, name: "New Vision Tech" },
                        { logo: carolinaWebLogo, name: "Carolina Web" },
                        { logo: intrinsicLogo, name: "Intrinsic" },
                        { logo: socialBrainLogo, name: "Social Brain" },
                        { logo: fsbLogo, name: "FSE Digital" },
                        { logo: museLogo, name: "MUSE Digital Media" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-200 flex-shrink-0 w-[140px] sm:w-[150px] md:w-[180px]"
                        >
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="h-10 sm:h-12 md:h-16 w-auto mx-auto mb-2 sm:mb-3 object-contain"
                          />
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA BUTTON */}
              <div className="mt-10 sm:mt-12 text-center">
                <BookCallButtonWithModal
                  buttonLabel="Become Our next Partner"
                  className="bg-brand-purple hover:bg-brand-coral-light backdrop-blur-sm text-white border-white/30 px-6 sm:px-8 py-2 sm:py-2 text-sm sm:text-base touch-manipulation"
                  buttonSize="default"
                />
              </div>
            </div>
          </section>

          {/* Problems We Solve (Why Agencies Choose Us) */}
          <section className="bg-white py-12 sm:py-16 md:py-20 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6">
                {/* <button className="bg-brand-coral text-white font-medium px-6 py-2 rounded-full mb-6 inline-flex items-center gap-2">
                  Problems We Solve
                </button> */}
                <h1 className="text-black text-2xl sm:text-2xl lg:text-4xl mb-4 font-bold">
                  Scale Faster Without the Usual Agency Headaches
                </h1>
                <p className="text-gray-600 max-w-xl mx-auto text-lg">
                  Most agencies hit the same growth roadblocks. We help you skip
                  them entirely.
                </p>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Problems Section */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                      <h2 className="text-red-600 font-medium">The Problems</h2>
                    </div>
                    <p className="text-gray-700">
                      Agencies work with us because they&apos;re tired of:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {problems.map((problem, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-300 transition-colors shadow-sm"
                      >
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-4 h-4 text-red-600" />
                          </div>
                          <p className="text-gray-700 text-sm">{problem}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solutions Section */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-white font-medium">The Solution</h2>
                    </div>
                    <p className="text-white/90">
                      We&apos;ve designed our model to remove those bottlenecks
                      from your agency.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {solutions.map((solution, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors shadow-sm"
                      >
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Zap className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-gray-700 text-sm">{solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4">
                    <p className="text-gray-700 text-sm">
                      You focus on sales, strategy, and client relationships. We
                      make sure delivery never slows you down.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dedicated Resources Section */}
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-5xl mx-auto text-center">
              <Badge className="bg-white/20 text-white text-sm sm:text-md font-medium border-white/30 mb-6 sm:mb-8 px-4 py-2 mx-auto">
                🔥 Most Sought-After Service
              </Badge>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 sm:mb-7 leading-tight">
                Dedicated Resources for US Agencies
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-gray-100 mb-7 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed">
                Scale your agency with handpicked pros who integrate seamlessly
                into your workflows and client delivery.
              </p>

              <div className="bg-[rgba(40,20,50,0.6)] backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 lg:mb-12 border border-white/10 shadow-[0px_8px_32px_rgba(0,0,0,0.3)] max-w-3xl mx-auto">

                {/* PRICING */}
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-yellow-200">
                  <span className="text-lg sm:text-xl lg:text-2xl text-white">
                    Starting at{" "}
                  </span>$1,199 per
                  <span className="text-lg sm:text-xl lg:text-2xl text-white"> resource / month</span>
                </div>

                <p className="mb-1 font-medium">
                  Cancel anytime | No long-term contracts | Fully white-label
                </p>

                <div className="text-sm sm:text-base lg:text-lg text-gray-200 mb-2 sm:mb-3">
                  Team Discounts: Up to 20% Off
                </div>

                <div className="text-xs sm:text-sm lg:text-base text-gray-200 mb-6 sm:mb-8">
                  Average 60% cost savings vs. in-house team
                </div>

                {/* ROLES */}
                <div className="flex items-center justify-center">
                  {/* <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left text-gray-100 mb-6 sm:mb-8">
                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <span className="text-sm sm:text-base">Graphic Designers</span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <span className="text-sm sm:text-base">Video Editors</span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <span className="text-sm sm:text-base">SEO Specialists</span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <span className="text-sm sm:text-base">Google Ads Experts</span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <span className="text-sm sm:text-base">Web Developers</span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <span className="text-sm sm:text-base">Full-Stack Developers</span>
                    </li>
                  </ul> */}
                  {/* NEW VALUE POINTS SECTION */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left text-gray-100 mb-6 sm:mb-8">
                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Direct communication & full-time project transparency
                      </span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Fluent in English with good communication
                      </span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        160+ dedicated hours to your projects
                      </span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Specialists experienced in US projects & clients
                      </span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Team discount of up to 20% when you hire 5+ resources
                      </span>
                    </li>

                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Save $60,000+ a year on every resource
                      </span>
                    </li>
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                  <Button
                    className="bg-brand-coral hover:bg-white hover:text-brand-purple text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 font-semibold touch-manipulation group"
                    asChild
                  >
                    <Link href="/contact?service=dedicated-resources&#contact-form">
                      Get Dedicated Resources
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-white group-hover:text-brand-purple transition-colors duration-300" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-brand-purple bg-transparent text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 touch-manipulation"
                    asChild
                  >
                    <Link href="/services/dedicated-resources">Learn More</Link>
                  </Button>
                </div>
              </div>

            </div>
          </section>

          {/* Contact Form Section (reusable component) */}
          <AgencyContactSection
            sectionId="contact-form"
            heading="Ready to Scale Your Agency?"
            subheading="See exactly how agencies like yours reduce costs, scale delivery, and win more clients without hiring."
            inquiryType="home-contact-form"
            contactFormType="home-contact-form"
            submissionSourceLabel="Home Page Contact Form Submission"
          />

          {/* Book Appointment Section */}
          <section
            id="book-appointment"
            className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-900"
          >
            <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
              <div className="text-center max-w-3xl mx-auto">
                {/* <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-coral/10 text-brand-coral text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] mb-3 font-bold">
                  Book a free strategy call
                </p> */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  Ready to see what BrandingBeez can do for you?
                </h2>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                  Pick an available slot with our lead consultant and we&apos;ll
                  walk through your website, ads or AI idea live on the call.&nbsp;
                  <span>
                    Agencies typically book this call to evaluate dedicated
                    resources, pricing, and delivery timelines.
                  </span>
                </p>
              </div>

              <AppointmentCalendar
                defaultServiceType="Website / SEO / AI strategy"
                consultantName="Raja Rajeshwari"
                consultantTitle="CEO, BrandingBeez"
                consultantImage={RajeStroke}
              />
            </div>
          </section>

          {/* Testimonials – Card + Screenshot Style */}
          <section className="bg-gray-50 py-12 sm:py-16 md:py-20 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Heading Button */}
              <div className="flex justify-center mb-6">
                {/* <div className="inline-flex items-center gap-2 bg-brand-coral text-white font-medium px-6 py-2 rounded-full shadow-lg"> */}
                <span className="text-black text-3xl sm:text-3xl lg:text-4xl font-bold">What Our Clients Say</span>
                {/* </div> */}
              </div>

              {/* Subheading */}
              <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-[18px]">
                Agencies and brands trust BrandingBeez to deliver high-impact,
                white-label solutions with care, speed, and attention to detail.
              </p>

              {/* --- MOBILE SLIDER (ONLY ≤ 480px) --- */}
              <div className="hidden max-[480px]:flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="min-w-[85%] snap-center">
                    <TestimonialCard
                      name={t.name}
                      company={t.company}
                      testimonial={t.testimonial}
                      imageUrl={t.imageUrl}
                      logoUrl={t.logoUrl}
                    />
                  </div>
                ))}
              </div>

              {/* --- TABLET + DESKTOP GRID ( > 480px ) --- */}
              <div className="grid max-[480px]:hidden grid-cols-1 md:grid-cols-3 gap-6 text-justify">
                {testimonials.map((t) => (
                  <TestimonialCard
                    key={t.id}
                    name={t.name}
                    company={t.company}
                    testimonial={t.testimonial}
                    imageUrl={t.imageUrl}
                    logoUrl={t.logoUrl}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter CTA Section */}
          <section
            id="newsletter"
            className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#CF4163] to-[#552265] text-white"
          >
            <div className="max-w-6xl mx-auto">
              {/* HEADER */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  Subscribe to Our Newsletter!
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto">
                  Join 1000+ marketers &amp; agencies getting exclusive tips on
                  SEO, AI, and growth strategies.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                {/* CONTENT */}
                <div className="w-full lg:w-[500px] mb-2 lg:mb-0 space-y-3 text-justify">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-left sm:text-center md:text-left">
                    Weekly 1-Minute Agency Growth Insights
                  </h3>

                  <p className="text-sm text-gray-100 leading-normal">
                    Get actionable tips, pricing tricks, automation tactics,
                    fast client-winning strategies, proposal hacks, AI
                    workflows, and real stories from growing agencies all
                    delivered in simple 1-minute reads to help you scale smarter
                    every week.
                  </p>
                </div>

                {/* FORM */}
                <div className="w-full lg:w-[800px] bg-white/10 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-white/10 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-center mb-1">
                    Subscribe Free
                  </h3>
                  <p className="text-gray-200 text-center text-xs sm:text-sm mb-4">
                    Join 3,000+ agency owners no spam.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNewsletterSubscribe();
                    }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    <input
                      type="text"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="flex-1 px-3 py-2 rounded-lg bg-white/25 text-white placeholder-gray-200 border border-white/30 focus:border-white/60 focus:ring-1 focus:ring-white/40 transition-all text-sm"
                    />

                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="flex-1 px-3 py-2 rounded-lg bg-white/25 text-white placeholder-gray-200 border border-white/30 focus:border-white/60 focus:ring-1 focus:ring-white/40 transition-all text-sm"
                    />

                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className={`px-4 py-2 rounded-lg bg-white text-brand-purple font-bold text-sm hover:bg-brand-coral hover:text-white transition-all whitespace-nowrap ${newsletterLoading
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      {newsletterLoading ? "Subscribing..." : "Subscribe"}
                    </button>
                  </form>

                  {newsletterStatus && (
                    <p className="text-xs text-gray-200 text-center mt-3">
                      {newsletterStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <ThankYouPopup
              isOpen={showNewsletterThankYou}
              onClose={() => setShowNewsletterThankYou(false)}
              title="Thanks for Subscribing!"
              message="You're all set! Check your email for exclusive agency growth tips and strategies. Welcome to the 3,000+ agency owners in our community!"
              formType="newsletter"
            />
          </section>

          {/* HomeTeamBanner at bottom for screens ≤ 480px also hidden */}
          <section className="py-12 sm:py-14 bg-gradient-to-t from-[#CF4163] to-[#552265] hidden max-[480px]:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <HomeTeamBanner />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
