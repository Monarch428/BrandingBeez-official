import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
import Mathavanimage from "../../public/images/Mathavan-team-member.png";
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
import {
  MapPin,
  Users,
  Award,
  Heart,
  Linkedin,
  Globe,
  Building,
  Target,
  Zap,
  Shield,
  Handshake,
  Calendar,
  BookOpen,
} from "lucide-react";

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
    linkedin: "#", //https://www.linkedin.com/in/charan-brandingbeez
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
    name: "Mathavan",
    role: "AI Developer",
    location: "India",
    image: Mathavanimage,
    bio: "Cutting-edge AI solutions and machine learning expert",
    linkedin: "https://www.linkedin.com/in/mathavan-mukesh-7a53a3360",
    specialties: [
      "AI & Machine Learning Solutions",
      "Generative AI & LLMs",
      "Data Engineering & Automation",
    ],
  },
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
    name: "Sathesh",
    role: "Full-Stack Developer",
    location: "India",
    image: SatheshImage,
    bio: "Full-stack development specialist with modern frameworks",
    linkedin: "https://www.linkedin.com/in/satheshkumar-v/",
    specialties: ["Full-Stack Development", "React", "Node.js"],
  },
  {
    name: "Raja",
    role: "AI Specialist",
    location: "India",
    image: rajaImage,
    bio: "AI specialist with expertise in generative AI and NLP, Machine Learning",
    linkedin:
      "https://www.linkedin.com/in/rajakrishnank/",
    specialties: ["Gen-AI", "NLP", "AI Solutions"],
  },
  {
    name: "Pradeep",
    role: "Full Stack Developer",
    location: "India",
    image: pradeepImage,
    bio: "Full-stack development specialist with modern Web Technologies",
    linkedin:
      "https://www.linkedin.com/in/l-pradeep/",
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
    name: "Athira",
    role: "HR",
    location: "India",
    image: athiraImage,
    bio: "Human resources specialist fostering team growth and culture",
    linkedin:
      "https://www.linkedin.com/in/athirasrihari?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    specialties: ["Human Resources", "Team Development", "Culture Building"],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SchemaMarkup
        type="webpage"
        data={{
          title: "About BrandingBeez - Your Trusted Digital Partner",
          description:
            "Meet the team behind BrandingBeez. Since 2020, we've been helping US businesses transform their digital presence with innovative solutions.",
          url: "https://brandingbeez.com/about",
          breadcrumbs: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://brandingbeez.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "About",
              item: "https://brandingbeez.com/about",
            },
          ],
        }}
      />
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Badge className="mb-4 bg-brand-coral text-white">
              About BrandingBeez
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Trusted White-labelling Digital Partner
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Since 2020, we've been helping US businesses transform their
              digital presence with innovative solutions, proven strategies, and
              unwavering commitment to success.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-coral" />
                <span>25+ Partner Agencies</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-coral" />
                <span>85% Satisfaction Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-coral" />
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
                      5 Years
                    </div>
                    <div className="text-sm text-gray-600">
                      Market Experience
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-brand-purple to-brand-coral rounded-2xl p-8 text-white text-center shadow-2xl">
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20">
                      <img
                        src={vigneshImage}
                        alt="Vignesh Waran - Founder & CEO"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Vignesh Waran</h3>
                    <p className="text-white/90 mb-4">Founder</p>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Our Mission</h4>
                      <p className="text-white/90 text-sm">
                        "We built BrandingBeez to solve the pain points we
                        experienced as agency owners - finding reliable partners
                        who understand quality and deadlines."
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Our Commitment</h4>
                      <p className="text-white/90 text-sm">
                        "Every partnership is built on transparency, quality,
                        and mutual success. Your growth is our success."
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="bg-white text-brand-purple border-white hover:bg-white/90"
                      asChild
                    >
                      <a
                        href="https://www.youtube.com/watch?v=J4RRz15Q73s"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch Our Story
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Collage Banner */}
        <TeamCollageBanner />

        {/* Team Details Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Meet Our Global Team
              </h2>

              {/* Inline team category titles */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-semibold text-gray-900">
                <h3 className="text-brand-purple">Leadership Team</h3>
                <span className="text-gray-400">|</span>
                <h3 className="text-brand-purple">Technical Experts</h3>
                <span className="text-gray-400">|</span>
                <h3 className="text-brand-purple">Support Team</h3>
                <span className="text-gray-400">|</span>
                <h3 className="text-brand-purple">Get to Know Our Team</h3>
              </div>
            </div>

            {/* Team Member Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <TeamMemberImage
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      name={member.name}
                    />

                    <h3 className="font-bold text-lg text-brand-purple mb-1">
                      {member.name === "Vignesh"
                        ? "Vignesh - Founder"
                        : member.name === "Raje"
                          ? "Raje - CEO"
                          : member.name === "Charan"
                            ? "Charan - Chief Visionary Officer"
                            : member.name === "Priya"
                              ? "Priya - Automation Specialist"
                              : member.name === "Theva"
                                ? "Theva - AI Developer"
                                : member.name === "Logu"
                                  ? "Logu - Full-Stack Developer"
                                  : member.name === "Mohan"
                                    ? "Mohan - Graphic Designer"
                                    : member.name === "Azeez"
                                      ? "Azeez - Senior Graphic Designer"
                                      : member.name === "Niju"
                                        ? "Niju - Senior WordPress Developer"
                                        : member.name === "Prabha"
                                          ? "Prabha - Senior WordPress Developer"
                                          : member.name === "Vishnu"
                                            ? "Vishnu - Senior WordPress Developer & UI/UX Designer"
                                            : member.name === "Yuva"
                                              ? "Yuva - SEO Specialist"
                                              : member.name === "Gopal"
                                                ? "Gopal - Senior Google Ads & SEO Expert"
                                                : member.name === "Athira"
                                                  ? "Athira - HR"
                                                  : member.name}
                    </h3>

                    <p className="text-brand-coral font-medium mb-2">{member.role}</p>

                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{member.location}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 flex-grow">{member.bio}</p>

                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {member.specialties.map((specialty, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white mt-auto"
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


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
        <section className="py-16 px-4 bg-white">
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

        {/* Company Culture Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Company Culture
              </h2>
              <p className="text-xl text-gray-600">
                Building a workplace where excellence thrives
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-purple mb-2">
                    Work Environment
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Collaborative, results-driven, continuous learning
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-purple mb-2">
                    Team Activities
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Weekly team building, quarterly offsites
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-purple mb-2">
                    Professional Development
                  </h3>
                  <p className="text-gray-600 text-sm">
                    $2,000 annual learning budget per employee
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-purple mb-2">
                    Benefits
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Health insurance, 401k, flexible work arrangements
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
              <Link href="/newsletter">
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
      <Footer />
    </div>
  );
}
