// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   TrendingUp,
//   Target,
//   Search,
//   BarChart3,
//   CheckCircle,
//   ArrowRight,
//   Star,
//   Quote,
//   Users,
//   Calendar,
//   Globe,
//   Zap,
//   Settings,
//   Eye,
//   MousePointer,
//   Award,
//   ExternalLink,
//   MapPin,
//   Building,
//   Clock,
//   Shield,
//   Lightbulb,
//   FileText,
// } from "lucide-react";
// import citypatPerformanceImage from "@assets/citypat-seo-case-study_1754120721661.png";
// import { Link } from "wouter";
// import { Helmet } from "react-helmet";
// import { SEOHead } from "@/components/seo-head";
// import { SchemaMarkup } from "@/components/schema-markup";
// import { CitypatSchema } from "@/utils/all-schemas";
// import teamMem_1 from "../../../public/images/yuva-team-member.png";
// import teamMem_2 from "../../../public/images/vishnu-team-member.png";

// export default function CitypatCaseStudy() {
//   return (
//     <>
//       <Helmet>
//         <title>Citypat SEO Case Study | From Zero to 34K Impressions</title>
//         <meta name="description" content="Discover how Branding Beez powered Citypat’s SEO success — from zero visibility to daily organic clicks and local traffic growth across the UK." />
//         <link rel="canonical" href="https://brandingbeez.co.uk/case-studies/citypat-case-study" />
//         <meta name="robots" content="INDEX, FOLLOW" />
//       </Helmet>
//       <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
//         <SEOHead
//           title="Citypat x Branding Beez"
//           description="From zero visibility to 34K impressions — Citypat’s SEO growth through a white-label partnership with Branding Beez."
//           keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
//           canonicalUrl="https://brandingbeez.co.uk/case-studies/citypat-case-study"
//           ogType="website"
//         />
//         <SchemaMarkup type="custom" data={CitypatSchema} />
//         <Header />

//         <main className="pt-0">
//           {/* Hero Section */}
//           <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
//             <div className="max-w-7xl mx-auto">
//               <div className="grid lg:grid-cols-2 gap-12 items-center">
//                 <div>
//                   <div className="flex items-center justify-center">
//                     <Badge className="bg-brand-coral text-white mb-6 text-md px-4 py-1 font-medium">
//                       White-Label UK SEO Success Story
//                     </Badge>
//                   </div>
//                   <h1 className="text-4xl md:text-6xl font-bold mb-6">Citypat: From Zero to Daily Organic Traffic</h1>
//                   <p className="text-lg md:text-xl mb-8 opacity-90">
//                     How we transformed a UK electrical testing company from zero
//                     organic visibility to consistent daily traffic through
//                     white-label partnership with Gemma's agency
//                   </p>
//                   <div className="flex flex-wrap gap-6 text-lg">
//                     <div className="flex items-center gap-2">
//                       <MousePointer className="w-5 h-5" />
//                       <span>244 Organic Clicks</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Eye className="w-5 h-5" />
//                       <span>34.6K Impressions</span>
//                       {/* <span>34.6K Impressions</span> */}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Users className="w-5 h-5" />
//                       <span>88% Engagement</span>
//                       {/* <span>88.37% Engagement</span> */}
//                     </div>
//                   </div>

//                   <div className="mt-8">
//                     <Button
//                       onClick={() =>
//                         // window.open("https://calendly.com/vignesh-velusamy/30min","_blank",)
//                         window.open("https://calendar.app.google/Y8XZq71qtvPRhktH9", "_blank",)
//                       }
//                       size="lg"
//                       variant="outline"
//                       className="bg-transparent border-white text-white hover:bg-white hover:text-brand-coral"                    >
//                       Start Your SEO Growth Today
//                       <ArrowRight className="w-5 h-5 ml-2" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:scale-105 transition-transform duration-300">
//                     <img
//                       src={citypatPerformanceImage}
//                       alt="Citypat Google Search Console Performance showing 244 total clicks, 34.6K total impressions, and performance graphs"
//                       className="w-full h-auto rounded-lg shadow-lg"
//                       loading="lazy"
//                     />
//                     <div className="mt-4 text-center">
//                       <p className="text-lg font-semibold">Google Search Console</p>
//                       <p className="text-sm opacity-80">
//                         Real Performance Data
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Client Profile */}
//           <section className="py-16 bg-white">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                   Client Profile
//                 </h2>
//                 <p className="text-gray-600 text-lg">
//                   Understanding the business challenge
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8 mb-12">
//                 <Card className="p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
//                   <div className="flex items-center gap-4 mb-6">
//                     <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center">
//                       <Building className="w-8 h-8 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">
//                         Company Details
//                       </h3>
//                       <p className="text-gray-600">
//                         Electrical Safety Specialists
//                       </p>
//                     </div>
//                   </div>
//                   <ul className="space-y-3 text-gray-700">
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
//                       <span>
//                         <strong>Industry:</strong> Electrical Safety/Testing &
//                         Compliance
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
//                       <span>
//                         <strong>Location:</strong> UK-based
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
//                       <span>
//                         <strong>Business Model:</strong> B2B and B2C
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
//                       <span>
//                         <strong>Target:</strong> Facilities managers, landlords,
//                         business owners
//                       </span>
//                     </li>
//                   </ul>
//                 </Card>

//                 <Card className="p-8 border-2 border-brand-coral/20 bg-brand-coral/5">
//                   <div className="flex items-center gap-4 mb-6">
//                     <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center">
//                       <TrendingUp className="w-8 h-8 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">
//                         Pre-SEO Baseline
//                       </h3>
//                       <p className="text-gray-600">Before January 2025</p>
//                     </div>
//                   </div>
//                   <ul className="space-y-3 text-gray-700">
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
//                       <span>Virtually no trackable organic sessions</span>
//                     </li>
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
//                       <span>No significant keyword rankings</span>
//                     </li>
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
//                       <span>No measurable organic conversions</span>
//                     </li>
//                     <li className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
//                       <span>Minimal local search visibility</span>
//                     </li>
//                   </ul>
//                 </Card>
//               </div>
//             </div>
//           </section>

//           {/* Strategy & Implementation */}
//           <section className="py-16 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                   Strategy & Implementation
//                 </h2>
//                 <p className="text-gray-600 text-lg">
//                   Comprehensive SEO approach for electrical testing services
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {[
//                   {
//                     icon: <Search className="w-6 h-6 text-brand-purple" />,
//                     color: "bg-brand-purple/10",
//                     title: "Keyword Research",
//                     desc: `Identified target phrases for "PAT testing", city/region
//             modifiers, and service-specific queries relevant to UK
//             business compliance.`,
//                   },
//                   {
//                     icon: <FileText className="w-6 h-6 text-brand-coral" />,
//                     color: "bg-brand-coral/10",
//                     title: "Content Strategy",
//                     desc: `Created/optimized high-intent landing pages (PAT testing
//             services, about, contact, FAQs) to match user search demand.`,
//                   },
//                   {
//                     icon: <Settings className="w-6 h-6 text-brand-purple" />,
//                     color: "bg-brand-purple/10",
//                     title: "Technical SEO",
//                     desc: `Improved URL structures, optimized metadata, implemented
//             schema, addressed crawl/indexation issues, and ensured mobile
//             usability.`,
//                   },
//                   {
//                     icon: <Globe className="w-6 h-6 text-brand-coral" />,
//                     color: "bg-brand-coral/10",
//                     title: "Link Building",
//                     desc: `Local business citations, directory listings, and outreach for
//             trade/industry mentions to build domain authority.`,
//                   },
//                   {
//                     icon: <MapPin className="w-6 h-6 text-brand-purple" />,
//                     color: "bg-brand-purple/10",
//                     title: "Local SEO",
//                     desc: `Enhanced Google Business Profile, optimized service location
//             keywords, added NAP schema for local visibility.`,
//                   },
//                   {
//                     icon: <Users className="w-6 h-6 text-brand-coral" />,
//                     color: "bg-brand-coral/10",
//                     title: "White-Label Partnership",
//                     desc: `Seamless collaboration with Gemma's agency, providing
//             client-ready reports and maintaining agency branding
//             throughout.`,
//                   },
//                 ].map((item, i) => (
//                   <Card key={i} className="p-6 transition-shadow hover:shadow-lg">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div
//                         className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}
//                       >
//                         {item.icon}
//                       </div>
//                       <h3 className="text-xl font-bold text-gray-900">
//                         {item.title}
//                       </h3>
//                     </div>
//                     <p className="text-gray-600">{item.desc}</p>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </section>


//           {/* Results Section */}
//           <section className="py-16 bg-white">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                   Results (Jan 17 – Jul 17, 2025)
//                 </h2>
//                 <p className="text-gray-600 text-lg">
//                   6-month transformation from zero to consistent organic growth
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//                 <Card className="text-center p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
//                   <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
//                     <MousePointer className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="text-3xl font-bold text-brand-purple mb-2">244</div>
//                   <div className="text-gray-600 font-medium">
//                     Total Organic Clicks
//                   </div>
//                   <div className="text-sm text-gray-500 mt-1">
//                     Google Search Console
//                   </div>
//                 </Card>

//                 <Card className="text-center p-8 border-2 border-brand-coral/20 bg-brand-coral/5">
//                   <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Eye className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="text-3xl font-bold text-brand-coral mb-2">
//                     34.6K
//                   </div>
//                   <div className="text-gray-600 font-medium">
//                     Total Impressions
//                   </div>
//                   <div className="text-sm text-gray-500 mt-1">6-month period</div>
//                 </Card>

//                 <Card className="text-center p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
//                   <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Target className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="text-3xl font-bold text-brand-purple mb-2">
//                     0.7%
//                   </div>
//                   <div className="text-gray-600 font-medium">CTR Average</div>
//                   <div className="text-sm text-gray-500 mt-1">Position 56.7</div>
//                 </Card>

//                 <Card className="text-center p-8 border-2 border-brand-coral/20 bg-brand-coral/5">
//                   <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Users className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="text-3xl font-bold text-brand-coral mb-2">
//                     88%
//                   </div>
//                   <div className="text-gray-600 font-medium">Engagement Rate</div>
//                   <div className="text-sm text-gray-500 mt-1">
//                     342 engaged sessions
//                   </div>
//                 </Card>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8">
//                 <Card className="p-8">
//                   <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
//                     <BarChart3 className="w-6 h-6 text-brand-purple" />
//                     Traffic & Engagement
//                   </h3>
//                   <ul className="space-y-3 text-gray-700">
//                     <li className="flex justify-between">
//                       <span>Total Sessions (All Channels):</span>
//                       <strong>387</strong>
//                     </li>
//                     <li className="flex justify-between">
//                       <span>Organic Search Sessions:</span>
//                       <strong>169</strong>
//                     </li>
//                     <li className="flex justify-between">
//                       <span>Average Engagement Time:</span>
//                       <strong>58s (Organic)</strong>
//                     </li>
//                     <li className="flex justify-between">
//                       <span>Homepage Performance:</span>
//                       <strong>204 clicks, 27,971 impressions</strong>
//                     </li>
//                   </ul>
//                 </Card>

//                 <Card className="p-8">
//                   <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
//                     <Award className="w-6 h-6 text-brand-coral" />
//                     Key Achievements
//                   </h3>
//                   <ul className="space-y-3 text-gray-700">
//                     <li className="flex items-start gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0 mt-0.5" />
//                       <span>Transformed from zero to daily organic traffic</span>
//                     </li>
//                     <li className="flex items-start gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0 mt-0.5" />
//                       <span>
//                         Generated first organic enquiries within 3 months
//                       </span>
//                     </li>
//                     <li className="flex items-start gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0 mt-0.5" />
//                       <span>Established strong local search presence</span>
//                     </li>
//                     <li className="flex items-start gap-3">
//                       <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0 mt-0.5" />
//                       <span>Built foundation for long-term growth</span>
//                     </li>
//                   </ul>
//                 </Card>
//               </div>
//             </div>
//           </section>

//           {/* Team Section */}
//           <section className="py-16 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                   Project Team
//                 </h2>
//                 <p className="text-gray-600 text-lg">
//                   Expert specialists delivering white-label excellence
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-3 gap-8">
//                 {/* Yuva - bg-gradient-to-br from-brand-purple to-brand-coral */}
//                 <Card className="text-center p-8">
//                   <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden p-[3px]">
//                     <img
//                       src={teamMem_1}
//                       alt="Yuva-Team-member"
//                       className="w-full h-full rounded-full object-cover"
//                     />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2">Yuva</h3>
//                   <h4 className="text-gray-600 mb-4">SEO Strategist</h4>
//                   <p className="text-sm text-gray-500">
//                     Led campaign development, technical audit, and ongoing optimization
//                     strategy
//                   </p>
//                 </Card>

//                 {/* Vishnu -  bg-gradient-to-br from-brand-coral to-brand-purple*/}
//                 <Card className="text-center p-8">
//                   <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden p-[3px]">
//                     <img
//                       src={teamMem_2}
//                       alt="Vishnu-Team-Member"
//                       className="w-full h-full rounded-full object-cover"
//                     />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2">Vishnu</h3>
//                   <h4 className="text-gray-600 mb-4">Developer</h4>
//                   <p className="text-sm text-gray-500">
//                     Delivered site upgrades, bug fixes, and tracked technical deliverables
//                   </p>
//                 </Card>

//                 {/* Gemma */}
//                 <Card className="text-center p-8">
//                   <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-coral rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden p-[3px]">
//                     <span className="text-white font-bold text-xl">G</span>
//                   </div>
//                   <h3 className="text-xl font-bold mb-2">Gemma</h3>
//                   <h4 className="text-gray-600 mb-4">Agency Partner</h4>
//                   <p className="text-sm text-gray-500">
//                     White-label agency lead, managed delivery and client communication
//                   </p>
//                 </Card>
//               </div>

//             </div>
//           </section>

//           {/* White-Label Process */}
//           <section className="py-16 bg-white">
//             <div className="max-w-7xl mx-auto px-4">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                   The White-Label Partnership
//                 </h2>
//                 <p className="text-gray-600 text-lg">
//                   Seamless collaboration that strengthens agency relationships
//                 </p>
//               </div>

//               <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
//                 <div className="flex items-start gap-4 mb-6">
//                   <Quote className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="text-gray-700 text-lg leading-relaxed mb-4">
//                       "This project was executed under a white-label framework
//                       with Gemma. Gemma acted as the sole liaison, ensuring all
//                       client-facing communication and materials were
//                       agency-branded and ready to present directly to Citypat."
//                     </p>
//                     <p className="text-gray-700 leading-relaxed">
//                       "Our team worked in the background, adapting to Gemma's
//                       reporting schedule and documentation needs, offering
//                       added-value support for pre-emptive client questions, and
//                       turning complex SEO strategies into actionable,
//                       client-facing updates she could deliver confidently."
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-6 mt-8">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <Shield className="w-8 h-8 text-white" />
//                     </div>
//                     <h4 className="font-bold mb-2">Agency-Branded</h4>
//                     <p className="text-sm text-gray-600">
//                       All materials ready for direct client presentation
//                     </p>
//                   </div>
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <Users className="w-8 h-8 text-white" />
//                     </div>
//                     <h4 className="font-bold mb-2">Seamless Support</h4>
//                     <p className="text-sm text-gray-600">
//                       Background expertise with responsive client support
//                     </p>
//                   </div>
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <Award className="w-8 h-8 text-white" />
//                     </div>
//                     <h4 className="font-bold mb-2">Strengthened Reputation</h4>
//                     <p className="text-sm text-gray-600">
//                       Enhanced both agency and partnership credibility
//                     </p>
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           </section>

//           {/* CTA Section */}
//           <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
//             <div className="max-w-4xl mx-auto text-center px-4">
//               <h2 className="text-3xl md:text-4xl font-bold mb-6">
//                 Ready to Transform Your SEO Results?
//               </h2>
//               <p className="text-xl mb-8 opacity-90">
//                 See how we can help your business achieve similar organic growth
//                 through our proven SEO strategies
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Button
//                   size="lg"
//                   onClick={() =>
//                     // window.open("https://calendly.com/vignesh-velusamy/30min","_blank",)
//                     window.open("https://calendar.app.google/Y8XZq71qtvPRhktH9", "_blank",)
//                   }
//                   className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
//                 > <Calendar className="w-5 h-5 mr-2" />
//                   Book Your Free SEO Consultation
//                 </Button>
//                 <Link href="/services/seo">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple"
//                   >
//                     View Other SEO Services <ArrowRight className="w-5 h-5 ml-2" />
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </section>
//         </main>

//         <Footer />
//       </div>
//     </>
//   );
// }












import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Search,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  Users,
  Calendar,
  Globe,
  Zap,
  Settings,
  Eye,
  MousePointer,
  Award,
  ExternalLink,
  MapPin,
  Building,
  Clock,
  Shield,
  Lightbulb,
  FileText,
} from "lucide-react";
import citypatPerformanceImage from "@assets/citypat-seo-case-study_1754120721661.png";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { CitypatSchema } from "@/utils/all-schemas";
import teamMem_1 from "../../../public/images/yuva-team-member.png";
import teamMem_2 from "../../../public/images/vishnu-team-member.png";

export default function CitypatCaseStudy() {
  return (
    <>
      <Helmet>
        <title>Citypat SEO Case Study | From Zero to 34K Impressions</title>
        <meta
          name="description"
          content="Discover how Branding Beez powered Citypat’s SEO success — from zero visibility to daily organic clicks and local traffic growth across the UK."
        />
        <link
          rel="canonical"
          href="https://brandingbeez.co.uk/case-studies/citypat-case-study"
        />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="Citypat x Branding Beez"
          description="From zero visibility to 34K impressions — Citypat’s SEO growth through a white-label partnership with Branding Beez."
          keywords="white label digital marketing, white label SEO, PAT testing SEO case study, UK SEO, white label Google Ads, agency SEO services"
          canonicalUrl="https://brandingbeez.co.uk/case-studies/citypat-case-study"
          ogType="website"
        />
        <SchemaMarkup type="custom" data={CitypatSchema} />
        <Header />

        <main className="pt-0">
          {/* Hero Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center justify-center">
                    <Badge className="bg-brand-coral text-white mb-6 text-md px-4 py-1 font-medium">
                      White-Label UK SEO Success Story
                    </Badge>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Citypat: From Zero to Daily Organic Traffic
                  </h1>

                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    How we transformed a UK electrical testing company from zero
                    organic visibility to consistent daily traffic through
                    white-label partnership with Gemma&apos;s agency
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-5 h-5" />
                      <span>244 Organic Clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span>34.6K Impressions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>88% Engagement</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={() =>
                        window.open(
                          "https://calendar.app.google/Y8XZq71qtvPRhktH9",
                          "_blank",
                        )
                      }
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-brand-coral"
                    >
                      Start Your SEO Growth Today
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:scale-105 transition-transform duration-300">
                    <img
                      src={citypatPerformanceImage}
                      alt="Citypat Google Search Console Performance showing 244 total clicks, 34.6K total impressions, and performance graphs"
                      className="w-full h-auto rounded-lg shadow-lg"
                      loading="lazy"
                    />
                    <div className="mt-4 text-center">
                      <p className="text-lg font-semibold">Google Search Console</p>
                      <p className="text-sm opacity-80">Real Performance Data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Client Profile */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Client Profile
                </h2>
                <p className="text-gray-600 text-lg">
                  Understanding the business challenge
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Company Details */}
                <Card className="p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Company Details
                      </h3>
                      <p className="text-gray-600">Electrical Safety Specialists</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-purple" />
                      <span>
                        <strong>Industry:</strong> Electrical Safety/Testing &
                        Compliance
                      </span>
                    </li>

                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-purple" />
                      <span>
                        <strong>Location:</strong> UK-based
                      </span>
                    </li>

                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-purple" />
                      <span>
                        <strong>Business Model:</strong> B2B and B2C
                      </span>
                    </li>

                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-purple" />
                      <span>
                        <strong>Target:</strong> Facilities managers, landlords,
                        business owners
                      </span>
                    </li>
                  </ul>
                </Card>

                {/* Baseline */}
                <Card className="p-8 border-2 border-brand-coral/20 bg-brand-coral/5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Pre-SEO Baseline
                      </h3>
                      <p className="text-gray-600">Before January 2025</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral" />
                      <span>Virtually no trackable organic sessions</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral" />
                      <span>No significant keyword rankings</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral" />
                      <span>No measurable organic conversions</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral" />
                      <span>Minimal local search visibility</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>

          {/* Strategy & Implementation */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Strategy & Implementation
                </h2>
                <p className="text-gray-600 text-lg">
                  Comprehensive SEO approach for electrical testing services
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Search className="w-6 h-6 text-brand-purple" />,
                    title: "Keyword Research",
                    color: "bg-brand-purple/10",
                    desc: `Identified target phrases for PAT testing, regional modifiers, and compliance-driven keywords.`,
                  },
                  {
                    icon: <FileText className="w-6 h-6 text-brand-coral" />,
                    title: "Content Strategy",
                    color: "bg-brand-coral/10",
                    desc: `Created and optimized high-intent landing pages for services, FAQs, and location-based PAT testing.`,
                  },
                  {
                    icon: <Settings className="w-6 h-6 text-brand-purple" />,
                    title: "Technical SEO",
                    color: "bg-brand-purple/10",
                    desc: `Fixed crawlability issues, optimized mobile performance, and implemented schema across core pages.`,
                  },
                  {
                    icon: <Globe className="w-6 h-6 text-brand-coral" />,
                    title: "Link Building",
                    color: "bg-brand-coral/10",
                    desc: `Built local directories, gained citations, and distributed compliance-related articles.`,
                  },
                  {
                    icon: <MapPin className="w-6 h-6 text-brand-purple" />,
                    title: "Local SEO",
                    color: "bg-brand-purple/10",
                    desc: `Boosted Google Business Profile visibility and optimized for UK city-specific searches.`,
                  },
                  {
                    icon: <Users className="w-6 h-6 text-brand-coral" />,
                    title: "White-Label Delivery",
                    color: "bg-brand-coral/10",
                    desc: `Seamless delivery for Gemma's agency, with fully branded reports and communications.`,
                  },
                ].map((item, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{item.desc}</p>
                  </Card>
                ))}
              </div>

              {/* ⭐ Added Key Learnings CTA Block Here */}
              <div className="mt-12 max-w-3xl mx-auto">
                <Card className="p-6 md:p-8 bg-gray-50 border-dashed border-2 border-brand-coral/30">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Want similar results for your UK service business?
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base">
                        Share your website and location — we’ll tell you if
                        this exact strategy will work for your niche and timeline.
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-brand-coral text-white hover:bg-brand-coral/90"
                      onClick={() =>
                        window.open(
                          "https://calendar.app.google/Y8XZq71qtvPRhktH9",
                          "_blank",
                        )
                      }
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Talk to the SEO Team
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Results (Jan 17 – Jul 17, 2025)
                </h2>
                <p className="text-gray-600 text-lg">
                  6-month transformation from zero to consistent organic growth
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Cards */}
                <Card className="text-center p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
                  <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <MousePointer className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-brand-purple mb-2">
                    244
                  </div>
                  <p className="text-gray-600 font-medium">Total Organic Clicks</p>
                  <p className="text-sm text-gray-500 mt-1">Google Search Console</p>
                </Card>

                <Card className="text-center p-8 border-2 border-brand-coral/20 bg-brand-coral/5">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    34.6K
                  </div>
                  <p className="text-gray-600 font-medium">Total Impressions</p>
                  <p className="text-sm text-gray-500 mt-1">6-month period</p>
                </Card>

                <Card className="text-center p-8 border-2 border-brand-purple/20 bg-brand-purple/5">
                  <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-brand-purple mb-2">
                    0.7%
                  </div>
                  <p className="text-gray-600 font-medium">CTR Average</p>
                  <p className="text-sm text-gray-500 mt-1">Position 56.7</p>
                </Card>

                <Card className="text-center p-8 border-2 border-brand-coral/20 bg-brand-coral/5">
                  <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    88%
                  </div>
                  <p className="text-gray-600 font-medium">Engagement Rate</p>
                  <p className="text-sm text-gray-500 mt-1">342 engaged sessions</p>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-brand-purple" />
                    Traffic & Engagement
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex justify-between">
                      <span>Total Sessions:</span>
                      <strong>387</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Organic Sessions:</span>
                      <strong>169</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Avg Engagement Time:</span>
                      <strong>58s</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Homepage:</span>
                      <strong>204 clicks, 27,971 impressions</strong>
                    </li>
                  </ul>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <Award className="w-6 h-6 text-brand-coral" />
                    Key Achievements
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-0.5" />
                      <span>Transformed from zero to daily organic traffic</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-0.5" />
                      <span>Generated first organic enquiries within 3 months</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-0.5" />
                      <span>Strong local search presence established</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-coral mt-0.5" />
                      <span>Long-term SEO foundation created</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Project Team
                </h2>
                <p className="text-gray-600 text-lg">
                  Expert specialists delivering white-label excellence
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Yuva */}
                <Card className="text-center p-8">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden p-[3px]">
                    <img
                      src={teamMem_1}
                      alt="Yuva-Team-member"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Yuva</h3>
                  <h4 className="text-gray-600 mb-4">SEO Strategist</h4>
                  <p className="text-sm text-gray-500">
                    Led campaign development, technical audit, and optimization
                    execution
                  </p>
                </Card>

                {/* Vishnu */}
                <Card className="text-center p-8">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden p-[3px]">
                    <img
                      src={teamMem_2}
                      alt="Vishnu-Team-member"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Vishnu</h3>
                  <h4 className="text-gray-600 mb-4">Developer</h4>
                  <p className="text-sm text-gray-500">
                    Ensured technical site improvements and resolved SEO-impacting
                    issues
                  </p>
                </Card>

                {/* Gemma */}
                <Card className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-coral rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden p-[3px]">
                    <span className="text-white font-bold text-xl">G</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gemma</h3>
                  <h4 className="text-gray-600 mb-4">Agency Partner</h4>
                  <p className="text-sm text-gray-500">
                    Managed client communication and white-label delivery
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* White-Label Process */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  The White-Label Partnership
                </h2>
                <p className="text-gray-600 text-lg">
                  Seamless collaboration that strengthens agency relationships
                </p>
              </div>

              <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <div className="flex items-start gap-4 mb-6">
                  <Quote className="w-8 h-8 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-700 text-lg mb-4">
                      "This project was executed under a white-label framework
                      with Gemma. Gemma acted as the sole liaison, ensuring all
                      client facing communication and materials were
                      agency branded and ready to present directly to Citypat."
                    </p>
                    <p className="text-gray-700">
                      "Our team worked silently in the background anticipating
                      queries, preparing client-facing reports, and enabling
                      Gemma to deliver flawless communication with complete
                      confidence."
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold mb-2">Agency-Branded</h4>
                    <p className="text-sm text-gray-600">
                      All materials ready for direct client presentation
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold mb-2">Seamless Support</h4>
                    <p className="text-sm text-gray-600">
                      White-glove execution for Gemma’s agency needs
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold mb-2">Stronger Reputation</h4>
                    <p className="text-sm text-gray-600">
                      Enhanced both agency and client trust
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your SEO Results?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                See how we can help your business achieve similar organic
                growth through our proven SEO strategies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                  onClick={() =>
                    window.open(
                      "https://calendar.app.google/Y8XZq71qtvPRhktH9",
                      "_blank",
                    )
                  }
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Your Free SEO Consultation
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-brand-coral transition-colors duration-200"
                >
                  <Link href="/services/seo">
                    View Other SEO Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
