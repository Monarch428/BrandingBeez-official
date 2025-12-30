// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { SchemaMarkup } from "@/components/schema-markup";
// import { TeamCollageBanner } from "@/components/team-collage-banner";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "wouter";
// import { useRegion } from "@/hooks/use-region";
// import { useState, useEffect } from "react";

// // Team member images
// import vigneshImage from "@assets/Vignesh Stroke_1753273695214.png";
// import rajeImage from "@assets/Raje Stroke_1753273695213.png";
// import charanImage from "@assets/Charan Stroke_1753273701283.png";
// import priyaImage from "@assets/Priya Stroke_1753273695213.png";
// import Mathavanimage from "../../public/images/Mathavan-team-member.png";
// import loguImage from "@assets/Logu_Stroke.png";
// import SatheshImage from "@assets/Sathish_Stroke.png";
// import azeezImage from "@assets/Azeez_Stroke.png";
// import nijuImage from "@assets/Niju Stroke_1753273695212.png";
// import rajaImage from "../../public/images/Raja-team-member.png";
// import pradeepImage from "../../public/images/Pradeep-team-member.png";
// import vishnuImage from "@assets/Vishnu Stroke_1753273695214.png";
// import yuvaImage from "@assets/Yuva Stroke_1753273695215.png";
// import gopalImage from "@assets/Gopal Stroke_1753273701284.png";
// import athiraImage from "@assets/Athira Stroke_1753273701280.png";
// import jithenImage from "../../public/images/Jithen-team-member.png";
// import {
//   MapPin,
//   Users,
//   Award,
//   Heart,
//   Linkedin,
//   Globe,
//   Building,
//   Target,
//   Zap,
//   Shield,
//   Handshake,
//   Calendar,
//   BookOpen,
// } from "lucide-react";
// import { Helmet } from "react-helmet";
// import { SEOHead } from "@/components/seo-head";
// import { AboutPageSchema } from "@/utils/all-schemas";

// const teamMembers = [
//   {
//     name: "Vignesh",
//     role: "Founder",
//     location: "India",
//     image: vigneshImage,
//     bio: "Visionary founder driving innovation in digital marketing",
//     linkedin:
//       "https://www.linkedin.com/in/vigneshwaran-velusamy?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["Strategic Vision", "Business Development", "Innovation"],
//   },
//   {
//     name: "Raje",
//     role: "CEO",
//     location: "India",
//     image: rajeImage,
//     bio: "Leading global operations and strategic partnerships",
//     linkedin:
//       "https://www.linkedin.com/in/raja-rajeswari?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["Leadership", "Operations", "Strategic Planning"],
//   },
//   {
//     name: "Charan",
//     role: "Chief Visionary Officer",
//     location: "India",
//     image: charanImage,
//     bio: "Shaping the future vision and strategic direction",
//     linkedin: "https://www.linkedin.com/company/brandingbeez-academy/", //https://www.linkedin.com/in/charan-brandingbeez
//     specialties: ["Strategic Vision", "Innovation", "Leadership"],
//   },
//   {
//     name: "Priya",
//     role: "Automation Specialist",
//     location: "India",
//     image: priyaImage,
//     bio: "Expert in workflow automation and process optimization",
//     linkedin:
//       "https://www.linkedin.com/in/vishnupriyaa-rajan?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["Automation", "Process Design", "Workflow Optimization"],
//   },
//   {
//     name: "Mathavan",
//     role: "AI Developer",
//     location: "India",
//     image: Mathavanimage,
//     bio: "Cutting-edge AI solutions and machine learning expert",
//     linkedin: "https://www.linkedin.com/in/mathavan-mukesh-7a53a3360",
//     specialties: [
//       "AI & Machine Learning Solutions",
//       "Generative AI & LLMs",
//       "Data Engineering & Automation",
//     ],
//   },
//   {
//     name: "Logu",
//     role: "Full-Stack Developer",
//     location: "India",
//     image: loguImage,
//     bio: "Full-stack development specialist with modern frameworks",
//     linkedin:
//       "https://www.linkedin.com/in/loguvan-lk?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["Full-Stack Development", "React", "Node.js"],
//   },
//   {
//     name: "Sathesh",
//     role: "Full-Stack Developer",
//     location: "India",
//     image: SatheshImage,
//     bio: "Full-stack development specialist with modern frameworks",
//     linkedin: "https://www.linkedin.com/in/satheshkumar-v/",
//     specialties: ["Full-Stack Development", "React", "Node.js"],
//   },
//   {
//     name: "Raja",
//     role: "AI Specialist",
//     location: "India",
//     image: rajaImage,
//     bio: "AI specialist with expertise in generative AI and NLP, Machine Learning",
//     linkedin:
//       "https://www.linkedin.com/in/rajakrishnank/",
//     specialties: ["Gen-AI", "NLP", "AI Solutions"],
//   },
//   {
//     name: "Pradeep",
//     role: "Full Stack Developer",
//     location: "India",
//     image: pradeepImage,
//     bio: "Full-stack development specialist with modern Web Technologies",
//     linkedin:
//       "https://www.linkedin.com/in/l-pradeep/",
//     specialties: ["Full-Stack Development", "MERN Stack", "API Development"],
//   },
//   {
//     name: "Azeez",
//     role: "Senior Graphic Designer",
//     location: "India",
//     image: azeezImage,
//     bio: "Senior designer specializing in advanced visual concepts",
//     linkedin:
//       "https://www.linkedin.com/in/abdul-azeez-a-57b9b2256?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["Advanced Design", "Creative Direction", "Brand Strategy"],
//   },
//   {
//     name: "Niju",
//     role: "Senior WordPress Developer",
//     location: "India",
//     image: nijuImage,
//     bio: "WordPress expert building scalable web solutions",
//     linkedin:
//       "https://www.linkedin.com/in/nijanthan-k-7b984721b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: [
//       "WordPress Development",
//       "Custom Themes",
//       "Plugin Development",
//     ],
//   },
//   {
//     name: "Yuva",
//     role: "SEO Specialist",
//     location: "India",
//     image: yuvaImage,
//     bio: "SEO expert driving organic growth and search visibility",
//     linkedin:
//       "https://www.linkedin.com/in/yuva-sankar-25294a267?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["SEO Strategy", "Technical SEO", "Content Optimization"],
//   },
//   {
//     name: "Gopal",
//     role: "Senior Google Ads & SEO Expert",
//     location: "India",
//     image: gopalImage,
//     bio: "Dual expertise in paid advertising and organic search optimization",
//     linkedin: "https://in.linkedin.com/in/gopala-krishnan-85214077",
//     specialties: ["Google Ads", "SEO", "PPC Management"],
//   },
//   {
//     name: "Vishnu",
//     role: "Senior WordPress Developer & UI/UX Designer",
//     location: "India",
//     image: vishnuImage,
//     bio: "Combining development skills with exceptional design expertise",
//     linkedin:
//       "https://www.linkedin.com/in/vishnupradeep-v-670681179?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: [
//       "WordPress Development",
//       "UI/UX Design",
//       "Frontend Development",
//     ],
//   },
//   {
//     name: "Athira",
//     role: "HR",
//     location: "India",
//     image: athiraImage,
//     bio: "Human resources specialist fostering team growth and culture",
//     linkedin:
//       "https://www.linkedin.com/in/athirasrihari?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["Human Resources", "Team Development", "Culture Building"],
//   },
//   {
//     name: "Jithendran",
//     role: "Video Editor",
//     location: "India",
//     image: jithenImage,
//     bio: "Creative video editor crafting engaging visual stories",
//     linkedin:
//       "https://www.linkedin.com/in/jithendran-natarajan-50976b187?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//     specialties: ["Video Editing", "Creative Storytelling", "Post-Production"],
//   },
// ];

// const offices = [
//   {
//     city: "Chennai",
//     state: "TN",
//     address: "Anna Salai, T Nagar",
//     zipCode: "600017",
//     phone: "+91 99524 62833",
//     type: "Headquarters",
//   },
// ];

// const values = [
//   {
//     icon: Target,
//     title: "Results-Driven",
//     description:
//       "Every strategy is designed to deliver measurable business outcomes",
//   },
//   {
//     icon: Shield,
//     title: "Transparency",
//     description: "Clear communication and honest reporting in everything we do",
//   },
//   {
//     icon: Zap,
//     title: "Innovation",
//     description:
//       "Cutting-edge solutions that keep our clients ahead of the curve",
//   },
//   {
//     icon: Heart,
//     title: "Partnership",
//     description:
//       "We succeed when our clients succeed - true partnership approach",
//   },
// ];

// // Enhanced Image Component with error handling
// const TeamMemberImage = ({
//   src,
//   alt,
//   name,
// }: {
//   src: string | null;
//   alt: string;
//   name: string;
// }) => {
//   const [imageError, setImageError] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);


//   const handleImageError = () => {
//     console.warn(`Failed to load image for ${name}`);
//     setImageError(true);
//     setImageLoaded(true);
//   };

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//     setImageError(false);
//   };

//   return (
//     <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-brand-coral/20 relative">
//       {src && !imageError && (
//         <img
//           src={src}
//           alt={alt}
//           className="w-full h-full object-cover"
//           loading="lazy"
//           onError={handleImageError}
//           onLoad={handleImageLoad}
//           style={{ display: imageLoaded && !imageError ? "block" : "none" }}
//         />
//       )}

//       {/* Loading state */}
//       {!imageLoaded && src && !imageError && (
//         <div className="w-full h-full bg-gradient-to-br from-brand-coral/5 to-brand-purple/5 flex items-center justify-center">
//           <div className="w-6 h-6 border-2 border-brand-coral/30 border-t-brand-coral rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* Fallback state */}
//       {(imageError || !src || (imageLoaded && imageError)) && (
//         <div className="w-full h-full bg-gradient-to-br from-brand-coral/10 to-brand-purple/10 flex items-center justify-center">
//           <Users className="w-12 h-12 text-brand-coral" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default function About() {
//   const { regionConfig } = useRegion();
//   const [showVideo, setShowVideo] = useState(false);


//   return (
//     <>
//       <Helmet>
//         <title>About Branding Beez | Trusted White-Label Digital Partner</title>
//         <meta name="description" content="Discover Branding Beez — your trusted white-label digital partner helping agencies scale since 2020. 25+ partners, 99% satisfaction, and global delivery." />
//         <link rel="canonical" href="https://brandingbeez.co.uk/about" />
//         <meta name="robots" content="INDEX, FOLLOW" />
//       </Helmet>
//       <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
//         <SEOHead
//           title="About Branding Beez — Your White-Label Growth Partner"
//           description="Founded by agency owners to help others scale — trusted by 25+ global partners since 2020."
//           keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
//           canonicalUrl="https://brandingbeez.co.uk/about"
//           ogType="website"
//         />
//         <SchemaMarkup type="custom" data={AboutPageSchema} />
//         <Header />
//         <main className="pt-16">
//           {/* Hero Section */}
//           <section className="py-16 px-4">
//             <div className="max-w-7xl mx-auto text-center">
//               <Badge className="mb-4 bg-brand-coral text-white">
//                 About BrandingBeez
//               </Badge>
//               <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//                 Your Trusted White-labelling Digital Partner
//               </h1>
//               <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
//                 Since 2020, we've been helping US businesses transform their
//                 digital presence with innovative solutions, proven strategies, and
//                 unwavering commitment to success.
//               </p>
//               <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <Users className="w-4 h-4 text-brand-coral" />
//                   <span>25+ Partner Agencies</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Award className="w-4 h-4 text-brand-coral" />
//                   <span>85% Satisfaction Rate</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Globe className="w-4 h-4 text-brand-coral" />
//                   <span>Global Reach</span>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Company Story */}
//           <section className="py-16 px-4 bg-white">
//             <div className="max-w-7xl mx-auto">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                 <div>
//                   <h2 className="text-3xl font-bold mb-6 text-gray-900">
//                     Founded by Agency Owners, For Agency Owners
//                   </h2>
//                   <div className="space-y-6 text-gray-600">
//                     <p className="text-lg">
//                       Started in 2020 by former digital agency owners who
//                       understood the challenges of scaling quality services. After
//                       struggling with unreliable freelancers and expensive
//                       in-house teams, we created the white-label solution we
//                       wished existed.
//                     </p>
//                     <p>
//                       Today, we partner with 25+ agencies worldwide with premium
//                       services that help them grow without compromise. Our deep
//                       understanding of agency operations, combined with
//                       cutting-edge technology and proven methodologies, has helped
//                       agencies achieve sustainable growth.
//                     </p>
//                     <p>
//                       We specialize in the unique challenges agencies face - from
//                       maintaining quality at scale to managing client
//                       expectations, from technical delivery to transparent
//                       communication that builds trust.
//                     </p>
//                   </div>
//                   <div className="mt-8 grid grid-cols-2 gap-4">
//                     <div className="text-center p-4 bg-brand-wings/50 rounded-lg">
//                       <div className="text-2xl font-bold text-brand-coral">
//                         $5M+
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         Revenue Generated
//                       </div>
//                     </div>
//                     <div className="text-center p-4 bg-brand-wings/50 rounded-lg">
//                       <div className="text-2xl font-bold text-brand-coral">
//                         5 Years
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         Market Experience
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-center">
//                   <div className="bg-gradient-to-br from-brand-purple to-brand-coral rounded-2xl p-8 text-white text-center shadow-2xl w-full max-w-md">

//                     {/* VIDEO ALWAYS SHOWN */}
//                     <div className="mb-0">
//                       <div className="w-full h-52 md:h-64 rounded-xl overflow-hidden shadow-lg">
//                         <iframe
//                           className="w-full h-full"
//                           src="https://www.youtube.com/embed/J4RRz15Q73s?autoplay=0&mute=1"
//                           title="Founder Video — Our Story"
//                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                           allowFullScreen
//                         />
//                       </div>
//                     </div>

//                     {/* DETAILS */}
//                     {/* <div className="space-y-4 text-left">
//                       <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
//                         <h4 className="font-semibold mb-2">Our Mission</h4>
//                         <p className="text-white/90 text-sm">
//                           "We built BrandingBeez to solve the pain points we experienced as agency owners — finding reliable partners who understand quality and deadlines."
//                         </p>
//                       </div>

//                       <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
//                         <h4 className="font-semibold mb-2">Our Commitment</h4>
//                         <p className="text-white/90 text-sm">
//                           "Every partnership is built on transparency, quality, and mutual success. Your growth is our success."
//                         </p>
//                       </div>
//                     </div> */}
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Team Collage Banner */}
//           <TeamCollageBanner />

//           {/* Team Details Section */}
//           <section className="py-16 px-4 bg-white">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold mb-6 text-gray-900">
//                   Meet Our Global Team
//                 </h2>

//                 {/* Inline team category titles */}
//                 <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-semibold text-gray-900">
//                   <h3 className="text-brand-purple">Leadership Team</h3>
//                   <span className="text-gray-400">|</span>
//                   <h3 className="text-brand-purple">Technical Experts</h3>
//                   <span className="text-gray-400">|</span>
//                   <h3 className="text-brand-purple">Support Team</h3>
//                   <span className="text-gray-400">|</span>
//                   <h3 className="text-brand-purple">Get to Know Our Team</h3>
//                 </div>
//               </div>

//               {/* Team Member Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {teamMembers.map((member, index) => (
//                   <Card key={index} className="h-full">
//                     <CardContent className="p-6 text-center h-full flex flex-col">
//                       <TeamMemberImage
//                         src={member.image}
//                         alt={`${member.name} - ${member.role}`}
//                         name={member.name}
//                       />

//                       <h3 className="font-bold text-lg text-brand-purple mb-1">
//                         {member.name === "Vignesh"
//                           ? "Vignesh - Founder"
//                           : member.name === "Raje"
//                             ? "Raje - CEO"
//                             : member.name === "Charan"
//                               ? "Charan - Chief Visionary Officer"
//                               : member.name === "Priya"
//                                 ? "Priya - Automation Specialist"
//                                 : member.name === "Theva"
//                                   ? "Theva - AI Developer"
//                                   : member.name === "Logu"
//                                     ? "Logu - Full-Stack Developer"
//                                     : member.name === "Mohan"
//                                       ? "Mohan - Graphic Designer"
//                                       : member.name === "Azeez"
//                                         ? "Azeez - Senior Graphic Designer"
//                                         : member.name === "Niju"
//                                           ? "Niju - Senior WordPress Developer"
//                                           : member.name === "Prabha"
//                                             ? "Prabha - Senior WordPress Developer"
//                                             : member.name === "Vishnu"
//                                               ? "Vishnu - Senior WordPress Developer & UI/UX Designer"
//                                               : member.name === "Yuva"
//                                                 ? "Yuva - SEO Specialist"
//                                                 : member.name === "Gopal"
//                                                   ? "Gopal - Senior Google Ads & SEO Expert"
//                                                   : member.name === "Athira"
//                                                     ? "Athira - HR"
//                                                     : member.name}
//                       </h3>

//                       <p className="text-brand-coral font-medium mb-2">{member.role}</p>

//                       <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-3">
//                         <MapPin className="w-4 h-4" />
//                         <span>{member.location}</span>
//                       </div>

//                       <p className="text-sm text-gray-600 mb-4 flex-grow">{member.bio}</p>

//                       <div className="flex flex-wrap gap-1 justify-center mb-4">
//                         {member.specialties.map((specialty, i) => (
//                           <Badge key={i} variant="secondary" className="text-xs">
//                             {specialty}
//                           </Badge>
//                         ))}
//                       </div>

//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white mt-auto"
//                         asChild
//                       >
//                         <a
//                           href={member.linkedin}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <Linkedin className="w-4 h-4 mr-1" />
//                           Connect
//                         </a>
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </section>


//           {/* Mission & Vision */}
//           <section className="py-16 px-4">
//             <div className="max-w-7xl mx-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                 <Card className="bg-brand-purple text-white">
//                   <CardContent className="p-8">
//                     <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
//                     <p className="text-lg">
//                       To empower digital agencies with premium white-label
//                       services that scale their business while maintaining
//                       exceptional quality standards.
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card className="bg-brand-coral text-white">
//                   <CardContent className="p-8">
//                     <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
//                     <p className="text-lg">
//                       To become the most trusted white-label partner for ambitious
//                       agencies worldwide.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </section>

//           {/* Core Values */}
//           <section className="py-16 px-4 bg-white">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold mb-4 text-gray-900">
//                   Core Values
//                 </h2>
//                 <p className="text-xl text-gray-600">
//                   The principles that guide everything we do
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <Shield className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Quality First
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       We never compromise on deliverable quality
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <Target className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Transparency
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Open communication and honest reporting
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <Handshake className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Partnership
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Your success is our success
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <Zap className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Innovation
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Staying ahead of industry trends and technology
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </section>

//           {/* Company Culture Section */}
//           <section className="py-16 px-4">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl font-bold mb-4 text-gray-900">
//                   Company Culture
//                 </h2>
//                 <p className="text-xl text-gray-600">
//                   Building a workplace where excellence thrives
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <Users className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Work Environment
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Collaborative, results-driven, continuous learning
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <Calendar className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Team Activities
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Weekly team building, quarterly offsites
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <BookOpen className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Professional Development
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       $2,000 annual learning budget per employee
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="text-center  transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
//                       <Heart className="w-6 h-6 text-brand-coral" />
//                     </div>
//                     <h3 className="font-bold text-lg text-brand-purple mb-2">
//                       Benefits
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Health insurance, 401k, flexible work arrangements
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </section>

//           {/* CTA Section */}
//           <section className="py-16 px-4 bg-brand-purple text-white">
//             <div className="max-w-4xl mx-auto text-center">
//               <h2 className="text-3xl font-bold mb-4">
//                 Subscribe to BrandingBeez Insights
//               </h2>
//               <p className="text-xl mb-8 text-gray-200">
//                 Get the latest SEO, AI, and growth tips in your inbox.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link href="/#newsletter">
//                   <Button
//                     size="lg"
//                     className="bg-brand-coral hover:bg-brand-coral/90 text-white"
//                   >
//                     Subscribe Now
//                   </Button>
//                 </Link>
//                 <Link href="/services">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="border-white text-white bg-transparent hover:bg-white hover:text-brand-purple hover:border-brand-purple"
//                   >
//                     View Our Services
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


// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { SchemaMarkup } from "@/components/schema-markup";
import { TeamCollageBanner } from "@/components/team-collage-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useRegion } from "@/hooks/use-region";
import { useState, useEffect } from "react";

// Team member images
import vigneshImage from "@assets/Vignesh Stroke_1753273695214.png";
import rajeImage from "@assets/Raje Stroke_1753273695213.png";
import charanImage from "@assets/Charan Stroke_1753273701283.png";
import priyaImage from "@assets/Priya Stroke_1753273695213.png";
// import Mathavanimage from "../../public/images/Mathavan-team-member.png";
import loguImage from "@assets/Logu_Stroke.png";
import SatheshImage from "@assets/Sathish_Stroke.png";
import azeezImage from "@assets/Azeez_Stroke.png";
import nijuImage from "@assets/Niju Stroke_1753273695212.png";
import rajaImage from "../../public/images/Raja-team-member.png";
import pradeepImage from "../../public/images/Pradeep-team-member.png";
import vishnuImage from "@assets/Vishnu Stroke_1753273695214.png";
import yuvaImage from "@assets/Yuva Stroke_1753273695215.png";
import gopalImage from "@assets/Gopal Stroke_1753273701284.png";
import athiraImage from "@assets/Athira Stroke_1753273701280.png";
import jithenImage from "../../public/images/Jithen-team-member.png";
import pranavImage from "../../public/images/Pranav-team-member.png";
import ken from "../../public/images/Ken.png";
import matt from "../../public/images/Matt.png";
import phillip from "../../public/images/Phillip.png";
import teamImage from "../../public/images/Team.png";
import learnImage from "../../public/images/work.png";
import playImage from "../../public/images/play.png";
import {
  MapPin,
  Users,
  Award,
  Heart,
  Linkedin,
  Globe,
  Target,
  Zap,
  Shield,
  Handshake,
  Calendar,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { AboutPageSchema } from "@/utils/all-schemas";
import { LazyYouTube } from "@/components/LazyYouTube";

const teamMembers = [
  {
    name: "Vignesh",
    role: "Founder",
    location: "India",
    image: vigneshImage,
    bio: "Visionary founder driving innovation in digital marketing",
    linkedin:
      "https://www.linkedin.com/in/vigneshwaran-velusamy?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Strategic Vision", "Business Development", "Innovation"],
  },
  {
    name: "Raje",
    role: "CEO",
    location: "India",
    image: rajeImage,
    bio: "Leading global operations and strategic partnerships",
    linkedin:
      "https://www.linkedin.com/in/raja-rajeswari?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Leadership", "Operations", "Strategic Planning"],
  },
  {
    name: "Charan",
    role: "Chief Visionary Officer",
    location: "India",
    image: charanImage,
    bio: "Shaping the future vision and strategic direction",
    linkedin: "https://www.linkedin.com/company/brandingbeez-academy/", //https://www.linkedin.com/in/charan-brandingbeez
    specialties: ["Strategic Vision", "Innovation", "Leadership"],
  },
  {
    name: "Priya",
    role: "Automation Specialist",
    location: "India",
    image: priyaImage,
    bio: "Expert in workflow automation and process optimization",
    linkedin:
      "https://www.linkedin.com/in/vishnupriyaa-rajan?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Automation", "Process Design", "Workflow Optimization"],
  },
  {
    name: "Athira",
    role: "HR",
    location: "India",
    image: athiraImage,
    bio: "Human resources specialist fostering team growth and culture",
    linkedin:
      "https://www.linkedin.com/in/athirasrihari?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Human Resources", "Team Development", "Culture Building"],
  },
  // {
  //   name: "Mathavan",
  //   role: "AI Developer",
  //   location: "India",
  //   image: Mathavanimage,
  //   bio: "Cutting-edge AI solutions and machine learning expert",
  //   linkedin: "https://www.linkedin.com/in/mathavan-mukesh-7a53a3360",
  //   specialties: [
  //     "AI & Machine Learning Solutions",
  //     "Generative AI & LLMs",
  //     "Data Engineering & Automation",
  //   ],
  // },
  {
    name: "Logu",
    role: "Full-Stack Developer",
    location: "India",
    image: loguImage,
    bio: "Full-stack development specialist with modern frameworks",
    linkedin:
      "https://www.linkedin.com/in/loguvan-lk?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Full-Stack Development", "React", "Node.js"],
  },
  {
    name: "Raja",
    role: "AI Specialist",
    location: "India",
    image: rajaImage,
    bio: "AI specialist with expertise in generative AI and NLP, Machine Learning",
    linkedin: "https://www.linkedin.com/in/rajakrishnank/",
    specialties: ["Gen-AI", "NLP", "AI Solutions"],
  },
  {
    name: "Sathesh",
    role: "Full-Stack Developer",
    location: "India",
    image: SatheshImage,
    bio: "Full-stack development specialist with modern frameworks",
    linkedin: "https://www.linkedin.com/in/satheshkumar-v/",
    specialties: ["Full-Stack Development", "React", "Node.js"],
  },
  {
    name: "Pradeep",
    role: "Full Stack Developer",
    location: "India",
    image: pradeepImage,
    bio: "Full-stack development specialist with modern Web Technologies",
    linkedin: "https://www.linkedin.com/in/l-pradeep/",
    specialties: ["Full-Stack Development", "MERN Stack", "API Development"],
  },
  {
    name: "Azeez",
    role: "Senior Graphic Designer",
    location: "India",
    image: azeezImage,
    bio: "Senior designer specializing in advanced visual concepts",
    linkedin:
      "https://www.linkedin.com/in/abdul-azeez-a-57b9b2256?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Advanced Design", "Creative Direction", "Brand Strategy"],
  },
  {
    name: "Niju",
    role: "Senior WordPress Developer",
    location: "India",
    image: nijuImage,
    bio: "WordPress expert building scalable web solutions",
    linkedin:
      "https://www.linkedin.com/in/nijanthan-k-7b984721b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: [
      "WordPress Development",
      "Custom Themes",
      "Plugin Development",
    ],
  },
  {
    name: "Yuva",
    role: "SEO Specialist",
    location: "India",
    image: yuvaImage,
    bio: "SEO expert driving organic growth and search visibility",
    linkedin:
      "https://www.linkedin.com/in/yuva-sankar-25294a267?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["SEO Strategy", "Technical SEO", "Content Optimization"],
  },
  {
    name: "Gopal",
    role: "Senior Google Ads & SEO Expert",
    location: "India",
    image: gopalImage,
    bio: "Dual expertise in paid advertising and organic search optimization",
    linkedin: "https://in.linkedin.com/in/gopala-krishnan-85214077",
    specialties: ["Google Ads", "SEO", "PPC Management"],
  },
  {
    name: "Jithendran",
    role: "Video Editor",
    location: "India",
    image: jithenImage,
    bio: "Creative video editor crafting engaging visual stories",
    linkedin:
      "https://www.linkedin.com/in/jithendran-natarajan-50976b187?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Video Editing", "Creative Storytelling", "Post-Production"],
  },
  {
    name: "Vishnu",
    role: "Senior WordPress Developer & UI/UX Designer",
    location: "India",
    image: vishnuImage,
    bio: "Combining development skills with exceptional design expertise",
    linkedin:
      "https://www.linkedin.com/in/vishnupradeep-v-670681179?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: [
      "WordPress Development",
      "UI/UX Design",
      "Frontend Development",
    ],
  },
  {
    name: "Pranavkumar",
    role: "Content Manager",
    location: "India",
    image: pranavImage,
    bio: "Content manager driving strategic content initiatives",
    linkedin:
      "https://www.linkedin.com/in/pranavkumar8481?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Strategy", "Content Creation", "Editorial Management"],
  },
];

const offices = [
  {
    city: "Chennai",
    state: "TN",
    address: "Anna Salai, T Nagar",
    zipCode: "600017",
    phone: "+91 99524 62833",
    type: "Headquarters",
  },
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Every strategy is designed to deliver measurable business outcomes",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Clear communication and honest reporting in everything we do",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "Cutting-edge solutions that keep our clients ahead of the curve",
  },
  {
    icon: Heart,
    title: "Partnership",
    description:
      "We succeed when our clients succeed - true partnership approach",
  },
];

// ✅ Regional Partners type + data
type RegionalPartnersMember = {
  name: string;
  title: string;
  location: string;
  role: string;
  expertise: string[];
  contact: string;
  image?: string;
};

const regionalPartners: RegionalPartnersMember[] = [
  {
    name: "Ken",
    title: "Business Partner - United States",
    location: "Nationwide USA Coverage",
    role: "Ken represents BrandingBeez across the United States, connecting with local businesses and forums to bring AI automation solutions to American SMBs.",
    expertise: [
      "US market AI adoption strategies",
      "Local business development and networking",
      "SMB outreach and community engagement",
      "Regional compliance and business practices",
    ],
    contact: "Reach Ken for US-based projects and consultations",
    image: ken,
  },
  {
    name: "Matt",
    title: "Business Partner - Miami/Southeast",
    location: "Miami, Florida & Southeast Region",
    role: "Matt focuses on the vibrant Miami business ecosystem and Southeast markets, specializing in connecting with local entrepreneurs and established businesses.",
    expertise: [
      "Southeast US market penetration",
      "Miami startup and SMB ecosystem",
      "Local networking and business development",
      "Regional market insights and opportunities",
    ],
    contact: "Connect with Matt for Southeast US projects",
    image: matt,
  },
  {
    name: "Phillip Einetter",
    title: "Business Partner - Germany/Europe",
    location: "Germany & European Markets",
    role: "Philip brings BrandingBeez AI solutions to German and European businesses, navigating GDPR compliance and regional business practices.",
    expertise: [
      "European market AI regulations (GDPR compliance)",
      "German business culture and practices",
      "EU-wide business development",
      "Multi-language project coordination",
    ],
    contact: "Contact Philip for European projects and consultations",
    image: phillip,
  },
];

// Enhanced Image Component with error handling
const TeamMemberImage = ({
  src,
  alt,
  name,
}: {
  src: string | null;
  alt: string;
  name: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.warn(`Failed to load image for ${name}`);
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-brand-coral/20 relative">
      {src && !imageError && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded && !imageError ? "block" : "none" }}
        />
      )}

      {/* Loading state */}
      {!imageLoaded && src && !imageError && (
        <div className="w-full h-full bg-gradient-to-br from-brand-coral/5 to-brand-purple/5 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand-coral/30 border-t-brand-coral rounded-full animate-spin"></div>
        </div>
      )}

      {/* Fallback state */}
      {(imageError || !src || (imageLoaded && imageError)) && (
        <div className="w-full h-full bg-gradient-to-br from-brand-coral/10 to-brand-purple/10 flex items-center justify-center">
          <Users className="w-12 h-12 text-brand-coral" />
        </div>
      )}
    </div>
  );
};

export default function About() {
  const { regionConfig } = useRegion();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <Helmet>
        <title>About Branding Beez | Trusted White-Label Digital Partner</title>
        <meta
          name="description"
          content="Discover Branding Beez — your trusted white-label digital partner helping agencies scale since 2020. 25+ partners, 99% satisfaction, and global delivery."
        />
        <link rel="canonical" href="https://brandingbeez.co.uk/about" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="About Branding Beez — Your White-Label Growth Partner"
          description="Founded by agency owners to help others scale — trusted by 25+ global partners since 2020."
          keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
          canonicalUrl="https://brandingbeez.co.uk/about"
          ogType="website"
        />
        <SchemaMarkup type="custom" data={AboutPageSchema} />
        {/* <Header /> */}
        <main>
          {/* Hero Section */}
          <section className="py-16 px-4 bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral">
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-center">
                <Badge className="mb-4 bg-brand-coral text-md font-medium px-4 py-1 text-white">
                  About BrandingBeez
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Your Trusted White-labelling Digital Partner
              </h1>
              <p className="text-xl text-gray-50 max-w-3xl mx-auto mb-8">
                Since 2020, we've been helping US businesses transform their
                digital presence with innovative solutions, proven strategies, and
                unwavering commitment to success.
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white" />
                  <span>25+ Partner Agencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-white" />
                  <span>85% Satisfaction Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white" />
                  <span>Global Reach</span>
                </div>
              </div>
            </div>
          </section>

          {/* Company Story */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    Founded by Agency Owners, For Agency Owners
                  </h2>
                  <div className="space-y-6 text-gray-600">
                    <p className="text-lg">
                      Started in 2020 by former digital agency owners who
                      understood the challenges of scaling quality services. After
                      struggling with unreliable freelancers and expensive
                      in-house teams, we created the white-label solution we
                      wished existed.
                    </p>
                    <p>
                      Today, we partner with 25+ agencies worldwide with premium
                      services that help them grow without compromise. Our deep
                      understanding of agency operations, combined with
                      cutting-edge technology and proven methodologies, has helped
                      agencies achieve sustainable growth.
                    </p>
                    <p>
                      We specialize in the unique challenges agencies face - from
                      maintaining quality at scale to managing client
                      expectations, from technical delivery to transparent
                      communication that builds trust.
                    </p>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-brand-wings/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-coral">
                        $5M+
                      </div>
                      <div className="text-sm text-gray-600">
                        Revenue Generated
                      </div>
                    </div>
                    <div className="text-center p-4 bg-brand-wings/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-coral">
                        6 Years
                      </div>
                      <div className="text-sm text-gray-600">
                        Market Experience
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-brand-purple to-brand-coral   rounded-2xl p-3 md:p-4 text-white text-center shadow-2xl w-full max-w-2xl">
                    {/* VIDEO ALWAYS SHOWN */}
                    <div className="mb-0">
                    {/* <div className="w-full h-40 sm:h-30 md:h-76 lg:h-[330px] rounded-xl overflow-hidden shadow-lg"> */}
                        {/* <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/J4RRz15Q73s?autoplay=0&mute=1"
                          title="Founder Video — Our Story"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        /> */}
                        <LazyYouTube videoId="J4RRz15Q73s" />
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 🌍 Regional Business Partners Section */}
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple/15 bg-brand-purple/5 px-4 py-1.5 text-xs sm:text-sm font-bold text-brand-coral mb-4">
                  <Globe size={16} className="animate-pulse" />
                  <span>Global Team, Local Expertise</span>
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-brand-purple text-balance mb-4">
                  Regional partners growing BrandingBeez in key markets worldwide
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                  From the US to Europe, our local partners help agencies win
                  projects, communicate faster, and close deals with confidence
                  backed by a single global delivery team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12 items-stretch">
                {regionalPartners.map((partner, index) => (
                  <Card
                    key={index}
                    className="h-full flex border border-brand-purple/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                  >
                    <CardContent className="p-5 sm:p-6 flex flex-col h-full w-full">
                      <div className="flex flex-col flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={
                                partner.image
                                  ? partner.image
                                  : `/professional-business-partner-headshot-.jpg?height=400&width=400&query=professional business partner headshot ${partner.name}`
                              }
                              alt={partner.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex flex-col leading-tight">
                            <h3 className="font-semibold text-sm sm:text-base md:text-lg text-brand-purple">
                              {partner.name}
                            </h3>
                            <p className="text-xs md:text-sm text-brand-coral font-medium">
                              {partner.title}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] md:text-xs text-gray-500 mt-1">
                              <MapPin size={12} />
                              <span>{partner.location}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed md:min-h-[72px]">
                          {partner.role}
                        </p>

                        <div>
                          <p className="text-xs font-bold text-gray-700 mb-2">
                            Key expertise
                          </p>
                          <ul className="space-y-1">
                            {partner.expertise.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs md:text-sm text-gray-600"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-coral" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 mt-4 border-t border-gray-100">
                        <p className="text-xs md:text-sm text-brand-coral font-medium">
                          {partner.contact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-brand-purple/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-bold text-xl sm:text-xl lg:text-2xl text-brand-purple mb-2 text-center">
                  Global Partnership Benefits
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
                  One strong delivery team supported by local partners who
                  understand their markets and customers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      icon: Globe,
                      text: "24/7 support across all major time zones",
                    },
                    {
                      icon: MapPin,
                      text: "Local partners who understand regional needs",
                    },
                    {
                      icon: Award,
                      text: "Consistent quality from our global team",
                    },
                    {
                      icon: Users,
                      text: "Solutions tailored to local cultures",
                    },
                    {
                      icon: TrendingUp,
                      text: "Compliance support for US & EU clients (GDPR, HIPAA, SOC-aligned workflows)",
                    },
                    {
                      icon: Heart,
                      text: "Stronger relationships through local presence",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-wings/60 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brand-coral/10 flex items-center justify-center flex-shrink-0">
                        <benefit.icon size={24} className="text-brand-coral" />
                      </div>
                      <p className="text-sm text-gray-700">{benefit.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Team Collage Banner */}
          <TeamCollageBanner />

          {/* Company Culture Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Company Culture
                </h2>
                <p className="text-lg md:text-xl text-gray-600">
                  Building a workplace where excellence thrives
                </p>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* CARD TEMPLATE (Repeat for all 3) */}
                {/* Work Environment */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-[0_63px_63px_rgba(0,0,0,0.04)] overflow-hidden">

                  {/* Image */}
                  <img
                    src={teamImage}
                    alt="Collaborative work environment"
                    className="w-full aspect-[4/3] object-cover pt-2"
                  />

                  {/* CONTENT + ICON */}
                  <div className="px-6 py-6 flex items-start justify-between">

                    {/* LEFT: Title + Description */}
                    <div className="max-w-[80%]">
                      <h3 className="text-lg md:text-xl font-semibold text-[#59168B]">
                        Work Environment
                      </h3>
                      <p className="text-sm md:text-base text-[#4A5565] mt-1 leading-relaxed">
                        Collaborative, results-driven, continuous learning
                      </p>
                    </div>

                    {/* RIGHT: Icon */}
                    <div className="w-12 h-12 rounded-full bg-[#F6339A] flex items-center justify-center shadow-lg shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Team Activities */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-[0_63px_63px_rgba(0,0,0,0.04)] overflow-hidden">
                  <img
                    src={playImage}
                    alt="Team activities"
                    className="w-full aspect-[4/3] object-cover pt-2"
                  />
                  <div className="px-6 py-6 flex items-start justify-between">
                    <div className="max-w-[80%]">
                      <h3 className="text-lg md:text-xl font-semibold text-[#59168B]">
                        Team Activities
                      </h3>
                      <p className="text-sm md:text-base text-[#4A5565] mt-1 leading-relaxed">
                        Weekly team building, quarterly offsites
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#F6339A] flex items-center justify-center shadow-lg shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Professional Development */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-[0_63px_63px_rgba(0,0,0,0.04)] overflow-hidden">
                  <img
                    src={learnImage}
                    alt="Professional development"
                    className="w-full aspect-[4/3] object-cover pt-2"
                  />
                  <div className="px-6 py-6 flex items-start justify-between">
                    <div className="max-w-[80%]">
                      <h3 className="text-lg md:text-xl font-semibold text-[#59168B]">
                        Professional Development
                      </h3>
                      <p className="text-sm md:text-base text-[#4A5565] mt-1 leading-relaxed">
                        $5,000 annual learning budget per employee
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#F6339A] flex items-center justify-center shadow-lg shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* Team Details Section */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl xl:max-w-[80%] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  Meet Our Global Team
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-3 text-base md:text-lg font-semibold text-gray-900">
                  <h3 className="text-brand-purple">Leadership Team</h3>
                  <span className="text-gray-400 hidden sm:inline">|</span>
                  <h3 className="text-brand-purple">Technical Experts</h3>
                  <span className="text-gray-400 hidden sm:inline">|</span>
                  <h3 className="text-brand-purple">Support Team</h3>
                  <span className="text-gray-400 hidden sm:inline">|</span>
                  <h3 className="text-brand-purple">Get to Know Our Team</h3>
                </div>
              </div>

              {/* ✅ 5 in a row on xl, nicely responsive below */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {teamMembers.map((member, index) => (
                  <Card
                    key={index}
                    className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-150"
                  >
                    <CardContent className="p-5 text-center flex flex-col h-full">
                      <div className="mb-4 flex justify-center">
                        <TeamMemberImage
                          src={member.image}
                          alt={`${member.name} - ${member.role}`}
                          name={member.name}
                        />
                      </div>

                      {/* Name / Title – normalized sizes */}
                      <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1 leading-snug line-clamp-2">
                        {member.name === "Vignesh"
                          ? "Vignesh – Founder"
                          : member.name === "Raje"
                            ? "Raje – CEO"
                            : member.name === "Charan"
                              ? "Charan – Chief Visionary Officer"
                              : member.name === "Priya"
                                ? "Priya – Automation Specialist"
                                : member.name === "Theva"
                                  ? "Theva – AI Developer"
                                  : member.name === "Logu"
                                    ? "Logu – Full-Stack Developer"
                                    : member.name === "Mohan"
                                      ? "Mohan – Graphic Designer"
                                      : member.name === "Azeez"
                                        ? "Azeez – Senior Graphic Designer"
                                        : member.name === "Niju"
                                          ? "Niju – Senior WordPress Developer"
                                          : member.name === "Prabha"
                                            ? "Prabha – Senior WordPress Developer"
                                            : member.name === "Vishnu"
                                              ? "Vishnu – Sr. WP Developer & UI/UX"
                                              : member.name === "Yuva"
                                                ? "Yuva – SEO Specialist"
                                                : member.name === "Gopal"
                                                  ? "Gopal – Sr. Google Ads & SEO Expert"
                                                  : member.name === "Athira"
                                                    ? "Athira – HR"
                                                    : member.name}
                      </h3>

                      <p className="text-brand-coral text-xs md:text-sm font-medium mb-2">
                        {member.role}
                      </p>

                      {/* Location */}
                      <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-gray-600 mb-3">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{member.location}</span>
                      </div>

                      {/* Bio – clamp so all cards stay equal height */}
                      <p className="text-xs md:text-sm text-gray-600 mb-3 flex-grow line-clamp-3">
                        {member.bio}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                        {member.specialties.map((specialty, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px] md:text-[11px] px-2 py-0.5"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      {/* Button pinned to bottom via mt-auto on wrapper */}
                      <div className="mt-auto pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white w-full justify-center"
                          asChild
                        >
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="w-4 h-4 mr-1" />
                            Connect
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* 🌍 Regional Business Partners Section */}
          {/* <section className="py-20 px-4 md:px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-coral/10 text-brand-coral rounded-full text-xs md:text-sm font-medium mb-4">
                  <Globe size={16} className="animate-pulse" />
                  <span>Global Team, Local Expertise</span>
                </div>
                <h2 className="font-bold text-3xl lg:text-4xl text-brand-purple text-balance mb-4">
                  Regional partners growing BrandingBeez in key markets worldwide
                </h2>
                <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                  From the US to Europe, our local business partners help agencies and businesses
                  adopt AI, automation, and performance marketing — with on-ground context and support.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-14">
                {regionalPartners.map((partner, index) => (
                  <Card
                    key={index}
                    className="h-full border border-brand-purple/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={
                              partner.image
                                ? partner.image
                                : `/professional-business-partner-headshot-.jpg?height=400&width=400&query=professional business partner headshot ${partner.name}`
                            }
                            alt={partner.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-base md:text-lg text-brand-purple">
                            {partner.name}
                          </h3>
                          <p className="text-xs md:text-sm text-brand-coral font-medium">
                            {partner.title}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] md:text-xs text-gray-500 mt-1">
                            <MapPin size={12} />
                            <span>{partner.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {partner.role}
                      </p>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Key expertise
                        </p>
                        <ul className="space-y-1">
                          {partner.expertise.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs md:text-sm text-gray-600"
                            >
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-coral" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <p className="text-xs md:text-sm text-brand-coral font-medium">
                          {partner.contact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-brand-purple/10 rounded-2xl p-8 shadow-sm">
                <h3 className="font-bold text-xl text-brand-purple mb-2 text-center">
                  Global Partnership Benefits
                </h3>
                <p className="text-sm text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                  One core delivery team, amplified by regional partners who understand local markets,
                  regulations, and business cultures.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Globe,
                      text: "24/7 Coverage: Time zone coverage across US, Europe, and Asia",
                    },
                    {
                      icon: MapPin,
                      text: "Local Expertise: Regional partners understand local business practices",
                    },
                    {
                      icon: Award,
                      text: "Global Standards: Consistent technical quality from our core team",
                    },
                    {
                      icon: Users,
                      text: "Cultural Fit: Solutions adapted to regional business cultures",
                    },
                    {
                      icon: TrendingUp,
                      text: "Compliance: Guidance for GDPR, HIPAA, and regional regulations",
                    },
                    {
                      icon: Heart,
                      text: "Warmer Relationships: Local networking and community access",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-wings/60 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-coral/10 flex items-center justify-center flex-shrink-0">
                        <benefit.icon size={20} className="text-brand-coral" />
                      </div>
                      <p className="text-sm text-gray-700">{benefit.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section> */}

          {/* Mission & Vision */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Card className="bg-brand-purple text-white">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-lg">
                      To empower digital agencies with premium white-label
                      services that scale their business while maintaining
                      exceptional quality standards.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-brand-coral text-white">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                    <p className="text-lg">
                      To become the most trusted white-label partner for ambitious
                      agencies worldwide.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Core Values
                </h2>
                <p className="text-xl text-gray-600">
                  The principles that guide everything we do
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="text-center  transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-brand-coral" />
                    </div>
                    <h3 className="font-bold text-lg text-brand-purple mb-2">
                      Quality First
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We never compromise on deliverable quality
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center  transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-brand-coral" />
                    </div>
                    <h3 className="font-bold text-lg text-brand-purple mb-2">
                      Transparency
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Open communication and honest reporting
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center  transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Handshake className="w-6 h-6 text-brand-coral" />
                    </div>
                    <h3 className="font-bold text-lg text-brand-purple mb-2">
                      Partnership
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Your success is our success
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center  transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-brand-coral" />
                    </div>
                    <h3 className="font-bold text-lg text-brand-purple mb-2">
                      Innovation
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Staying ahead of industry trends and technology
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-brand-purple text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Subscribe to BrandingBeez Insights
              </h2>
              <p className="text-xl mb-8 text-gray-200">
                Get the latest SEO, AI, and growth tips in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#newsletter">
                  <Button
                    size="lg"
                    className="bg-brand-coral hover:bg-brand-coral/90 text-white"
                  >
                    Subscribe Now
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white bg-transparent hover:bg-white hover:text-brand-purple hover:border-brand-purple"
                  >
                    View Our Services
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}
