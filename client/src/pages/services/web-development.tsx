import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/optimized-image";
import greenParadiseImage from "@assets/green-paradise-landscaping-updated.png";
import socialLandImage from "@assets/img_three.png";
import landscapingImage from "@assets/img_two.png";
import beautyServiceImage from "@assets/img_one.png";

import { Link } from "wouter";
import {
  Code,
  ShoppingCart,
  Building,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Smartphone,
  Shield,
  Search,
  Clock,
  ExternalLink,
  Monitor,
  Database,
  Layers,
  TrendingUp,
  LineChart,
  Gift,
} from "lucide-react";

// Featured client data
const featuredClient = {
  name: "SocialLand Digital",
  logo: socialLandImage,
  website: "https://socialland.co.uk",
  description:
    "Our first UK white-label project - a professional, scalable WordPress website for a leading digital marketing agency that sparked a 2-year partnership.",
  achievements: [
    "Professional WordPress website with modern design",
    "Service-focused layouts highlighting agency capabilities",
    "Portfolio/Work section showcasing past projects",
    "Strategic contact forms and CTA placements",
    "2-year ongoing partnership with multiple client websites built",
  ],
  industry: "Digital Marketing Agency",
  timeframe: "Initial project + 2-year partnership",
};

const caseStudies = [
  {
    id: 1,
    title: "UK White-Label Partnership Success",
    client: "SocialLand Digital",
    industry: "Digital Marketing Agency",
    results: {
      performance: "2-year partnership",
      conversions: "Multiple client websites",
      users: "Dedicated resource team",
    },
    description:
      "Professional WordPress website that sparked ongoing partnership - our first UK white-label project with service-focused layouts and portfolio showcase.",
    image: socialLandImage,
    link: "/case-studies/socialland-website",
  },
  {
    id: 2,
    title: "Local Business Digital Transformation",
    client: "TS Landscaping NC",
    industry: "Landscaping & Outdoor Services",
    results: {
      performance: "Professional presence",
      conversions: "Lead capture system",
      users: "Local trust built",
    },
    description:
      "White-label WordPress website created through Whitney Hill partnership - transforming offline landscaping business into digital success.",
    image: landscapingImage,
    link: "/case-studies/ts-landscaping-website",
  },
  {
    id: 3,
    title: "48-Hour Landing Page Success",
    client: "Vellu Laser (AC Graphics)",
    industry: "Beauty & Skincare",
    results: {
      performance: "48-hour delivery",
      conversions: "High-converting design",
      users: "Long-term partnership",
    },
    description:
      "White-label landing page project delivered through AC Graphics Digital partnership - fast turnaround without compromising quality.",
    image: beautyServiceImage,
    link: "/case-studies/vellu-laser-landing-page",
  },
  {
    id: 4,
    title: "Complete Brand + Website Success",
    client: "Green Paradise (Mark)",
    industry: "Landscaping & Outdoor Living",
    results: {
      performance: "Complete brand identity",
      conversions: "Professional website",
      users: "White-label success",
    },
    description:
      "Full 360° digital launch combining nature-inspired branding with WordPress website development through Mark's white-label partnership.",
    image: greenParadiseImage,
    link: "/case-studies/green-paradise-branding-website",
  },
];

const pricingPackages = [
  {
    id: 1,
    name: "WordPress Starter",
    price: "$600",
    period: "one-time",
    description: "Perfect for small businesses and startups",
    features: [
      "Up to 5 pages",
      "Custom WordPress (Elementor)",
      "Mobile-friendly responsive",
      "Basic SEO (Meta, Alt Tags)",
      "Contact form + social media links",
      "Google Analytics setup",
      "1 round of revisions",
      "7 days delivery",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "WordPress Business",
    price: "$1,200",
    period: "one-time",
    description: "Ideal for growing businesses",
    features: [
      "Up to 10 pages",
      "Custom design (Elementor Pro)",
      "Mobile + speed optimized",
      "On-page SEO (titles, tags, alt)",
      "Contact + lead forms + chat",
      "Blog setup included",
      "Google Analytics & Search Console",
      "2 rounds of revisions",
      "10-12 days delivery",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "E-commerce Store",
    price: "$1,500",
    period: "one-time",
    description: "For online stores and e-commerce",
    features: [
      "Up to 10 pages + 10 products",
      "WooCommerce storefront design",
      "Mobile + checkout optimized",
      "Basic SEO for products + pages",
      "Payment gateway + shipping setup",
      "Coupons, upsells, shipping rules",
      "Contact + chat + cart forms",
      "2 rounds of revisions",
      "12-15 days delivery",
    ],
    popular: false,
  },
];

export default function WebDevelopment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      <main className="pb-0">
        {/* Featured Web Development Client Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  🏆 Featured UK White-Label Partnership
                </Badge>
                <h1 className="text-4xl font-bold mb-6">
                  SocialLand Digital
                </h1>
                <p className="text-xl text-gray-100 mb-8">
                  {featuredClient.description}
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                  <h2 className="text-xl font-bold mb-4">
                    Development Achievements in Initial project + 2-year partnership
                  </h2>
                  <ul className="space-y-2 text-gray-100">
                    {featuredClient.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Button
                    className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                    onClick={() =>
                      window.open(
                        "https://calendly.com/vignesh-velusamy/30min?month=2025-09",
                        "_blank",
                      )
                    }
                  >
                    Schedule a Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
                  <img
                    src={featuredClient.logo}
                    alt="Social Land Digital website homepage showing local digital marketing experts in Essex with service packages and team information"
                    className="w-full h-auto object-cover"
                    loading="eager"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white font-semibold text-sm">{featuredClient.name}</p>
                    <p className="text-white/90 text-xs">{featuredClient.industry}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300 text-xs font-medium">2-Year Partnership</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="bg-brand-coral text-white mb-6 inline-block px-4 py-2 rounded-full text-sm font-medium">
                🎯 Success Stories
              </h2>
              <h3 className="text-4xl font-bold text-brand-purple mb-6">
                Web Development Case Studies & Portfolio
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how we've helped businesses across industries build
                powerful web solutions that drive growth and success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {caseStudies.map((study) => (
                <Card
                  key={study.id}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="aspect-video rounded-t-lg overflow-hidden bg-gray-100">
                    <img
                      src={study.image}
                      alt={`${study.client} website case study showcasing ${study.industry.toLowerCase()}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Content */}
                  <CardContent className="flex flex-col flex-grow p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-2">
                      {study.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {study.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Performance</span>
                        <span className="font-bold text-green-600">
                          {study.results.performance}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversions</span>
                        <span className="font-bold text-blue-600">
                          {study.results.conversions}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Scale</span>
                        <span className="font-bold text-brand-coral">
                          {study.results.users}
                        </span>
                      </div>
                    </div>

                    {/* Button pinned to bottom */}
                    <div className="mt-auto pt-2">
                      <Button
                        className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white border-0"
                        asChild
                      >
                        <Link href={study.link || "/case-studies"}>
                          View Full Case Study
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </section>

        {/* Pricing Packages Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="bg-brand-purple text-white mb-6 inline-block px-4 py-2 rounded-full text-sm font-medium">
                💎 Web Development Packages
              </h2>
              <h3 className="text-4xl font-bold text-brand-purple mb-6">
                Choose Your Development Package
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional web development solutions designed for businesses
                of all sizes. All packages include modern design and mobile
                optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative flex flex-col h-full ${pkg.popular
                      ? 'border-2 border-brand-coral scale-105'
                      : 'border border-gray-200 hover:border-brand-coral/50'
                    } transition-all duration-300`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-brand-coral text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 flex-shrink-0">
                    <h4 className="text-2xl font-bold text-brand-purple">
                      {pkg.name}
                    </h4>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-brand-coral">
                        {pkg.price}
                      </span>
                      <span className="text-gray-600"> {pkg.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{pkg.description}</p>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow">
                    <ul className="space-y-3 mb-8 flex-grow">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-8 border-t border-gray-100">
                      <Link href="/contact" className="w-full">
                        <Button
                          className={`w-full py-6 px-8 font-bold text-lg transition-all duration-300 ${pkg.popular
                              ? "bg-brand-coral hover:bg-brand-coral/90 text-white"
                              : "bg-brand-purple hover:bg-brand-purple/90 text-white"
                            }`}
                        >
                          {pkg.id === 1
                            ? "Start Your Website"
                            : pkg.id === 2
                              ? "Get Business Website"
                              : "Launch Your Store"}
                          <Gift className="w-5 h-5 ml-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <h3 className="text-gray-600 mb-4">
                Need a custom solution? We offer tailored web development for enterprise clients.
              </h3>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                >
                  Contact Us for Custom Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter!</h2>
            <p className="text-xl mb-8 text-white/90">Join 1000+ marketers & agencies getting exclusive tips on SEO, AI, and growth strategies delivered straight to their inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral"
                onClick={() => window.open('/newsletter', '_blank')}
              >Subscribe Now</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
