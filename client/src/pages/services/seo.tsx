import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import analyticsScreenshot from "@assets/Screenshot 2025-07-30 191221_1754117092308.png";
import atlanticSearchConsole from "@assets/Screenshot 2025-07-30 192158_1754056297030.png";
import scubaSearchResults from "@assets/by-the-shore-scuba-seo-success_1754118377812.png";
import statPlanningResults from "@assets/stat-planning-seo-portfolio_1754117447634.png";
import ubuDesignResults from "@assets/ubu-design-seo-performance_1754117447634.png";
import griffinGroupAnalytics from "@assets/Screenshot 2025-07-30 191221_1754117459762.png";
import citypatResults from "@assets/citypat-seo-case-study_1754117494248.png";
import {
  Search,
  TrendingUp,
  Target,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Globe,
  ExternalLink,
  LineChart,
  Zap,
  Shield,
  Gift,
  Calendar
} from "lucide-react";
import { Helmet } from "react-helmet";
import { navigate } from "wouter/use-browser-location";

// Featured SEO Client Data
const featuredClient = {
  name: "Griffin Group Property Development",
  logo: "", // No logo needed, will use text placeholder
  website: "https://griffingroup.co.uk",
  description: "A premier UK property development company specializing in residential and commercial development projects across Essex, delivering exceptional SEO results through our white-label partnership with Social Land.",
  achievements: [
    "16% increase in organic sessions in Q2 2025",
    // "16.24% increase in organic sessions in Q2 2025",
    "12% increase in organic users",
    // "12.02% increase in organic users",
    "7 position improvements on average for key keywords",
    "Enhanced visibility for Essex property searches",
    "Strong white-label partnership collaboration with Social Land"
  ],
  industry: "Property Development & Investment",
  timeframe: "Q2 2025"
};

const caseStudies = [
  {
    id: 1,
    title: "Atlantic Foundation Success",
    client: "Atlantic Foundation & Crawl Space Repair",
    industry: "Construction",
    results: {
      traffic: "+49%",
      keywords: "122 #1 rankings",
      revenue: "121% more leads"
    },
    description: "Transformed a local construction company's SEO from score 69 to 100 and dramatically increased lead generation.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23ff6b47'/%3E%3Ctext x='200' y='125' fill='white' font-family='Arial' font-size='16' text-anchor='middle'%3EAtlantic Foundation%3C/text%3E%3C/svg%3E",
    slug: "seo-case-study"
  },
  {
    id: 2,
    title: "Scuba Diving Adventure Growth",
    client: "By The Shore SCUBA Instruction",
    industry: "SCUBA Training",
    results: {
      traffic: "+31%",
      keywords: "61 top rankings",
      revenue: "360% phone clicks"
    },
    description: "Helped a diving company dominate local search results and dramatically increase booking inquiries.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%238b5cf6'/%3E%3Ctext x='200' y='125' fill='white' font-family='Arial' font-size='16' text-anchor='middle'%3EScuba Diving%3C/text%3E%3C/svg%3E",
    slug: "scuba-diving-case-study"
  },
  {
    id: 3,
    title: "STAT Planning Breakthrough",
    client: "STAT Planning",
    industry: "Town & Local Planning Consultancy",
    results: {
      traffic: "+453%",
      keywords: "5 top rankings",
      revenue: "+720% impressions"
    },
    description: "Transformed a local planning consultancy's online visibility with 453% click increase and major keyword ranking improvements in just one month.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23ff6b47'/%3E%3Ctext x='200' y='125' fill='white' font-family='Arial' font-size='16' text-anchor='middle'%3ESTAT Planning%3C/text%3E%3C/svg%3E",
    slug: "stat-planning-case-study"
  },
  {
    id: 4,
    title: "UBU Design Authority",
    client: "UBU Design",
    industry: "Architecture & Design",
    results: {
      traffic: "230 total users",
      keywords: "482 clicks",
      revenue: "50,900 impressions"
    },
    description: "Transformed a UK architecture firm from zero organic visibility to generating daily leads through strategic B2B SEO.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%238b5cf6'/%3E%3Ctext x='200' y='125' fill='white' font-family='Arial' font-size='16' text-anchor='middle'%3EUBU Design%3C/text%3E%3C/svg%3E",
    slug: "ubu-design-case-study"
  },
  {
    id: 5,
    title: "Citypat Electrical Safety Success",
    client: "Citypat",
    industry: "Electrical Safety & Compliance",
    results: {
      traffic: "244 clicks",
      keywords: "34.6K impressions",
      revenue: "88.37% engagement"
    },
    description: "Transformed a UK electrical testing company from zero organic visibility to consistent daily traffic through white-label partnership with Gemma's agency.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23ff6b47'/%3E%3Ctext x='200' y='125' fill='white' font-family='Arial' font-size='16' text-anchor='middle'%3ECitypat%3C/text%3E%3C/svg%3E",
    slug: "citypat-case-study"
  },
  {
    id: 6,
    title: "Griffin Group Property Development Success",
    client: "Griffin Group",
    industry: "Property Development & Investment",
    results: {
      traffic: "+16.24% sessions",
      keywords: "7 position improvements",
      revenue: "12.02% user growth"
    },
    description: "Transformed a UK property development firm through strategic local SEO, achieving double-digit growth in organic users and major SERP position improvements in just 3 months.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%238b5cf6'/%3E%3Ctext x='200' y='125' fill='white' font-family='Arial' font-size='16' text-anchor='middle'%3EGriffin Group%3C/text%3E%3C/svg%3E",
    slug: "griffin-group-case-study"
  }
];

const pricingPackages = [
  {
    id: 1,
    name: "Starter SEO",
    price: "$500",
    period: "/month",
    description: "Perfect for local businesses and startups",
    features: [
      "Basic audit + quick fixes",
      "10 primary keywords",
      "5 pages optimized",
      "Speed, mobile, meta fixes",
      "1 location GMB setup",
      "1 blog/month (1000 words)",
      "2 links/month (DA 30+)",
      "Basic competitor scan",
      "Monthly summary report"
    ],
    popular: false
  },
  {
    id: 2,
    name: "Growth SEO",
    price: "$650",
    period: "/month",
    description: "Ideal for growing companies",
    features: [
      "Full technical + on-page audit",
      "25 keywords + search intent grouping",
      "10 pages optimized",
      "Schema, redirects, crawl fixes",
      "3 locations + citation submission",
      "2 blogs/month (1000-1200 words)",
      "5 links/month (DA 40+)",
      "Deep 5-competitor analysis",
      "Monthly report + call"
    ],
    popular: true
  },
  {
    id: 3,
    name: "Pro SEO",
    price: "$1,200",
    period: "/month",
    description: "For e-commerce and enterprise websites",
    features: [
      "Deep crawl + custom technical plan",
      "50+ keywords + intent segmentation",
      "20 pages + conversion tracking",
      "Core Web Vitals, JavaScript SEO",
      "5+ locations, review strategy",
      "4 blogs/month (1500+ words)",
      "10 links/month (DA 50+)",
      "Full landscape + quarterly reports",
      "Dashboard + bi-weekly strategy calls"
    ],
    popular: false
  }
];

export default function SEOServices() {
  const regionConfig = useRegion();

  const openCalendly = () => {
    window.open('https://zcmp.in/JzHy', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>White-Label SEO Services | SEO Packages for Agencies</title>
        <meta name="description" content="Scale your agency with Branding Beez’s white-label SEO: local SEO, technical audits, content & reporting. Packages from $400/month." />
        <link rel="canonical" href="https://brandingbeez.co.uk/services/seo" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="White-Label SEO Services for Agencies Worldwide | BrandingBeez"
          description="Grow your agency globally with white-label SEO services from BrandingBeez. Scalable packages, proven case studies, and expert support tailored for worldwide clients."
          keywords="white label SEO, SEO services for agencies, white label search engine optimization, technical SEO, content optimization, link building services"
          canonicalUrl="https://brandingbeez.co.uk/services/seo"
          ogType="service"
        />
        <SchemaMarkup type="service" data={{
          name: "White-Label SEO Services",
          description: "Comprehensive search engine optimization services delivered under your agency's brand including technical SEO, content optimization, and link building.",
          serviceType: "Search Engine Optimization",
          hasOfferCatalog: {
            name: "SEO Service Offerings",
            itemListElement: [
              {
                name: "Technical SEO Audit",
                description: "Comprehensive technical analysis and optimization"
              },
              {
                name: "Content Optimization",
                description: "SEO-focused content creation and optimization"
              },
              {
                name: "Link Building",
                description: "High-quality backlink acquisition strategies"
              }
            ]
          }
        }} />
        <Header />
        <main>
          {/* Featured SEO Client Section */}
          <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-7xl mx-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center justify-center rounded-full font-medium">
                    <Badge className="w-fit bg-brand-coral text-white text-md mb-6 px-4 py-1">
                      Featured White-Label Success via Social Land
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-xl md:text-3xl lg:text-5xl font-bold mb-6">
                    Griffin Group Property Development
                  </h1>
                  <p className="text-xl text-gray-100 mb-8">
                    {featuredClient.description}
                  </p>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                    <h2 className="text-xl font-bold mb-4">SEO Achievements in Q2 2025</h2>
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
                    <Link href="/contact?service=seo#contact-form">
                      <Button className="bg-white text-brand-purple hover:bg-brand-coral hover:text-white">
                        Subscribe Free
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button asChild className="text-white hover:bg-white hover:text-brand-purple">
                      <a href={featuredClient.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden p-4">
                    <img
                      src={analyticsScreenshot}
                      alt="Griffin Group Google Analytics Results - User acquisition data showing organic search traffic growth"
                      className="w-full h-full object-contain bg-white rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-brand-purple to-brand-coral rounded-2xl flex items-center justify-center';

                        const textCenter = document.createElement('div');
                        textCenter.className = 'text-center text-white p-8';

                        const iconDiv = document.createElement('div');
                        iconDiv.className = 'text-4xl font-bold mb-2';
                        iconDiv.textContent = '📊';

                        const titleDiv = document.createElement('div');
                        titleDiv.className = 'text-lg font-semibold mb-1';
                        titleDiv.textContent = 'Google Analytics Results';

                        const sessionDiv = document.createElement('div');
                        sessionDiv.className = 'text-sm opacity-90';
                        // sessionDiv.textContent = '16.24% session growth';
                        sessionDiv.textContent = '16% session growth';

                        const userDiv = document.createElement('div');
                        userDiv.className = 'text-sm opacity-90';
                        userDiv.textContent = '12% user growth';
                        // userDiv.textContent = '12.02% user growth';

                        textCenter.appendChild(iconDiv);
                        textCenter.appendChild(titleDiv);
                        textCenter.appendChild(sessionDiv);
                        textCenter.appendChild(userDiv);
                        fallbackDiv.appendChild(textCenter);
                        target.parentElement!.appendChild(fallbackDiv);
                      }}
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-white font-semibold text-sm">{featuredClient.name}</p>
                      <p className="text-white/90 text-xs">{featuredClient.industry}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <p className="text-green-300 text-xs font-medium">Live Analytics Data</p>
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
                  SEO Case Studies & Portfolio
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover how we've helped businesses across industries achieve remarkable SEO results and dominate their markets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study) => (
                  <Card key={study.id} className="flex flex-col h-full">
                    {study.id === 1 ? (
                      <div className="aspect-video bg-white rounded-t-lg overflow-hidden border-b border-gray-200 p-2">
                        <img
                          src={atlanticSearchConsole}
                          alt="Atlantic Foundation Google Search Console Performance Results"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center';

                            const textCenter = document.createElement('div');
                            textCenter.className = 'text-center';

                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'w-16 h-16 text-brand-coral mx-auto mb-2';
                            iconDiv.textContent = '📊';

                            const industryP = document.createElement('p');
                            industryP.className = 'text-sm font-medium text-gray-600';
                            industryP.textContent = study.industry;

                            textCenter.appendChild(iconDiv);
                            textCenter.appendChild(industryP);
                            fallbackDiv.appendChild(textCenter);
                            target.parentElement!.appendChild(fallbackDiv);
                          }}
                        />
                      </div>
                    ) : study.id === 2 ? (
                      <div className="aspect-video bg-white rounded-t-lg overflow-hidden border-b border-gray-200 p-2">
                        <img
                          src={scubaSearchResults}
                          alt="By The Shore Scuba Google Search Console Performance Results"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center';

                            const textCenter = document.createElement('div');
                            textCenter.className = 'text-center';

                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'w-16 h-16 text-brand-coral mx-auto mb-2';
                            iconDiv.textContent = '📊';

                            const industryP = document.createElement('p');
                            industryP.className = 'text-sm font-medium text-gray-600';
                            industryP.textContent = study.industry;

                            textCenter.appendChild(iconDiv);
                            textCenter.appendChild(industryP);
                            fallbackDiv.appendChild(textCenter);
                            target.parentElement!.appendChild(fallbackDiv);
                          }}
                        />
                      </div>
                    ) : study.id === 3 ? (
                      <div className="aspect-video bg-white rounded-t-lg overflow-hidden border-b border-gray-200 p-2">
                        <img
                          src={statPlanningResults}
                          alt="Stat Planning Google Search Console Performance - 218 clicks, 4.41K impressions"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center';

                            const textCenter = document.createElement('div');
                            textCenter.className = 'text-center';

                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'w-16 h-16 text-brand-coral mx-auto mb-2';
                            iconDiv.textContent = '📊';

                            const industryP = document.createElement('p');
                            industryP.className = 'text-sm font-medium text-gray-600';
                            industryP.textContent = study.industry;

                            textCenter.appendChild(iconDiv);
                            textCenter.appendChild(industryP);
                            fallbackDiv.appendChild(textCenter);
                            target.parentElement!.appendChild(fallbackDiv);
                          }}
                        />
                      </div>
                    ) : study.id === 4 ? (
                      <div className="aspect-video bg-white rounded-t-lg overflow-hidden border-b border-gray-200 p-2">
                        <img
                          src={ubuDesignResults}
                          alt="UBU Design Google Search Console Performance - 516 clicks, 55.4K impressions"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center';

                            const textCenter = document.createElement('div');
                            textCenter.className = 'text-center';

                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'w-16 h-16 text-brand-coral mx-auto mb-2';
                            iconDiv.textContent = '📊';

                            const industryP = document.createElement('p');
                            industryP.className = 'text-sm font-medium text-gray-600';
                            industryP.textContent = study.industry;

                            textCenter.appendChild(iconDiv);
                            textCenter.appendChild(industryP);
                            fallbackDiv.appendChild(textCenter);
                            target.parentElement!.appendChild(fallbackDiv);
                          }}
                        />
                      </div>
                    ) : study.id === 5 ? (
                      <div className="aspect-video bg-white rounded-t-lg overflow-hidden border-b border-gray-200 p-2">
                        <img
                          src={citypatResults}
                          alt="CityPat Google Search Console Performance - 244 clicks, 34.6K impressions"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center';

                            const textCenter = document.createElement('div');
                            textCenter.className = 'text-center';

                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'w-16 h-16 text-brand-coral mx-auto mb-2';
                            iconDiv.textContent = '📊';

                            const industryP = document.createElement('p');
                            industryP.className = 'text-sm font-medium text-gray-600';
                            industryP.textContent = study.industry;

                            textCenter.appendChild(iconDiv);
                            textCenter.appendChild(industryP);
                            fallbackDiv.appendChild(textCenter);
                            target.parentElement!.appendChild(fallbackDiv);
                          }}
                        />
                      </div>
                    ) : study.id === 6 ? (
                      <div className="aspect-video bg-white rounded-t-lg overflow-hidden border-b border-gray-200 p-2">
                        <img
                          src={griffinGroupAnalytics}
                          alt="Griffin Group Google Analytics User Acquisition Data"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center';

                            const textCenter = document.createElement('div');
                            textCenter.className = 'text-center';

                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'w-16 h-16 text-brand-coral mx-auto mb-2';
                            iconDiv.textContent = '📊';

                            const industryP = document.createElement('p');
                            industryP.className = 'text-sm font-medium text-gray-600';
                            industryP.textContent = study.industry;

                            textCenter.appendChild(iconDiv);
                            textCenter.appendChild(industryP);
                            fallbackDiv.appendChild(textCenter);
                            target.parentElement!.appendChild(fallbackDiv);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 rounded-t-lg flex items-center justify-center">
                        <div className="text-center">
                          <LineChart className="w-16 h-16 text-brand-coral mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-600">{study.industry}</p>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6 flex flex-col h-full">
                      <h3 className="text-xl font-bold text-brand-purple mb-2">
                        {study.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow">{study.description}</p>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Organic Traffic</span>
                          <span className="font-bold text-green-600">{study.results.traffic}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Keywords Ranking</span>
                          <span className="font-bold text-blue-600">{study.results.keywords}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Revenue Impact</span>
                          <span className="font-bold text-brand-coral">{study.results.revenue}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Link href={study.id === 1 ? "/case-studies/seo-case-study" : study.id === 2 ? "/case-studies/scuba-diving-case-study" : study.id === 3 ? "/case-studies/stat-planning-case-study" : study.id === 4 ? "/case-studies/ubu-design-case-study" : study.id === 5 ? "/case-studies/citypat-case-study" : "/case-studies/griffin-group-case-study"}>
                          <Button className="w-full bg-brand-coral hover:bg-brand-purple text-white">
                            View Full Case Study
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* AI SEARCH OPTIMIZATION (AIO) OVERVIEW SECTION */}
          <section className="py-20 px-6 bg-gradient-to-br from-[#2B0A3D] via-[#4D1A59] to-[#8A2E70] text-white">
            <div className="max-w-7xl mx-auto">

              {/* SECTION HEADER */}
              <div className="text-center mb-12">
                <h2 className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  🚀 NEW: AI Search Optimization (AIO)
                </h2>
                <h3 className="text-4xl font-bold mb-4">Rank Inside AI Search Results</h3>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  AI Search Optimization (AIO) is how we help your brand show up inside
                  AI-generated answers across Google SGE, Perplexity, Copilot, and ChatGPT
                  — not just in traditional blue links.
                </p>
              </div>

              {/* 3 EXPLANATION CARDS – NOT PACKAGES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* AIO FOR LOCAL & EARLY-STAGE BRANDS */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-7 backdrop-blur-xl shadow-xl">
                  <h4 className="text-2xl font-bold mb-3">AIO for Local & Early-Stage Brands</h4>
                  <p className="text-white/90 text-sm leading-relaxed mb-5">
                    For businesses who’ve never thought about AI search before. We focus on making
                    sure AI tools can clearly understand who you are, what you do, and where you operate.
                  </p>
                  <ul className="space-y-2 text-white/90 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Clarify your brand, service, and location entities for AI engines.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Shape key pages so they’re easy for AI to quote as an answer.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Lay the foundation for appearing in local AI search results.</span>
                    </li>
                  </ul>
                </div>

                {/* AIO FOR GROWING COMPANIES */}
                <div className="rounded-2xl bg-white/20 border border-brand-yellow/80 p-7 shadow-2xl backdrop-blur-xl scale-[1.02]">
                  <h4 className="text-2xl font-bold mb-3">AIO for Growing Companies & Agencies</h4>
                  <p className="text-white/90 text-sm leading-relaxed mb-5">
                    For brands that already get SEO traffic and now want to be seen repeatedly
                    inside AI answer summaries, comparison blocks, and conversational searches.
                  </p>
                  <ul className="space-y-2 text-white/90 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Build topic clusters so AI treats you as an authority, not just a result.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Re-structure key pages for answer extraction and rich AI snippets.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Align schema, internal links, and content with AI-first intent.</span>
                    </li>
                  </ul>
                </div>

                {/* AIO FOR ENTERPRISE & E-COMMERCE */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-7 backdrop-blur-xl shadow-xl">
                  <h4 className="text-2xl font-bold mb-3">AIO for Enterprise & E-Commerce</h4>
                  <p className="text-white/90 text-sm leading-relaxed mb-5">
                    For teams managing multiple locations, products, or service lines who need
                    AI visibility at scale across markets, categories, and brand experiences.
                  </p>
                  <ul className="space-y-2 text-white/90 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Align technical SEO, Core Web Vitals, and AIO signals together.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Design full topic graphs and entity networks across products & regions.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 mt-0.5" />
                      <span>Track AI surfacing across SGE, Perplexity, Copilot & ChatGPT Search.</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* BOTTOM CTA */}
              <div className="text-center mt-14">
                <Link href="/services/ai-search-optimization">
                  <Button
                    className="bg-brand-coral text-white font-bold px-8 py-4 hover:bg-brand-purple hover:text-white"
                  >
                    Explore Full AIO Service
                  </Button>
                </Link>
              </div>

            </div>
          </section>



          {/* Pricing Packages Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="bg-brand-purple text-white mb-6 inline-block px-4 py-2 rounded-full text-sm font-medium">
                  💎 White-Label SEO Packages
                </h2>
                <h3 className="text-4xl font-bold text-brand-purple mb-4">
                  Choose Your SEO Package
                </h3>
                <p className="text-xl text-gray-900/80 max-w-3xl mx-auto">
                  Scalable SEO solutions designed for agencies and businesses of all sizes. All packages include white-label reporting.
                </p>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={[
                      "relative flex flex-col h-full transition-all duration-300",
                      pkg.popular
                        ? "border-2 border-brand-coral shadow-sm scale-[1.02]"
                        : "border border-brand-purple/20 hover:border-brand-purple/40 hover:shadow-sm",
                    ].join(" ")}
                  >
                    {/* Popular badge */}
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-brand-coral text-white px-4 py-1 rounded-full">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    {/* Header */}
                    <CardHeader className="text-center pb-4 flex-shrink-0">
                      <h4 className="text-2xl font-bold text-brand-purple">{pkg.name}</h4>

                      <div className="mt-4 flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-extrabold text-brand-coral">
                          {pkg.price}
                        </span>
                        <span className="text-gray-900/70">{pkg.period}</span>
                      </div>

                      <p className="text-gray-900/80 mt-2">{pkg.description}</p>
                    </CardHeader>

                    {/* Features */}
                    <CardContent className="flex flex-col flex-grow">
                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-brand-coral mt-0.5 flex-shrink-0" />
                            <span className="text-gray-900 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Actions */}
                      <div className="mt-auto pt-8 border-t border-brand-purple/10">
                        <div className="flex flex-col gap-4">
                          <Link href="/contact?service=seo#contact-form">
                            <Button
                              asChild
                              className={[
                                "w-full h-11 px-4 text-sm font-medium",
                                "transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2",
                                pkg.popular
                                  ? "bg-brand-coral hover:bg-brand-coral text-white"
                                  : "bg-brand-purple hover:bg-brand-purple text-white",
                              ].join(" ")}
                            >
                              <Link href="/contact?service=seo#contact-form">
                                Get Started with SEO
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </Link>

                          <Link href="/onboarding-wizard">
                            <Button
                              variant="outline"
                              className="w-full h-11 px-4 font-medium text-sm border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-all duration-300"
                            >
                              Schedule Consultation
                              <Calendar className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Footer CTA */}
              {/* <div className="text-center mt-12">
                <p className="text-gray-900/80 mb-4">
                  Need a custom solution? We offer tailored SEO strategies for enterprise clients.
                </p>
                <Link href="/contact?service=seo#contact-form">
                  <Button
                    variant="outline"
                    className="border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                  >
                    Contact Us for Custom Pricing
                  </Button>
                </Link>
              </div> */}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay on Top of SEO Trends</h2>
              <p className="text-xl mb-8 text-white/90">Join marketers & agencies getting expert tips, ranking strategies, and SEO case studies from BrandingBeez—straight to your inbox.</p>
              <div className="flex flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-brand-coral hover:bg-brand-purple hover:text-white font-semibold"
                  onClick={() => navigate('/#newsletter')}
                >Subscribe for Free</Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}






// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { SEOHead } from "@/components/seo-head";
// import { SchemaMarkup } from "@/components/schema-markup";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "wouter";
// import analyticsScreenshot from "@assets/Screenshot 2025-07-30 191221_1754117092308.png";
// import atlanticSearchConsole from "@assets/Screenshot 2025-07-30 192158_1754056297030.png";
// import scubaSearchResults from "@assets/by-the-shore-scuba-seo-success_1754118377812.png";
// import statPlanningResults from "@assets/stat-planning-seo-portfolio_1754117447634.png";
// import ubuDesignResults from "@assets/ubu-design-seo-performance_1754117447634.png";
// import griffinGroupAnalytics from "@assets/Screenshot 2025-07-30 191221_1754117459762.png";
// import citypatResults from "@assets/citypat-seo-case-study_1754117494248.png";
// import {
//   TrendingUp,
//   Target,
//   Users,
//   CheckCircle,
//   ArrowRight,
//   Star,
//   ExternalLink,
//   LineChart,
//   Zap,
//   Shield,
//   Calendar,
//   Calculator,
//   ArrowUp,
// } from "lucide-react";
// import { Helmet } from "react-helmet";
// import { navigate } from "wouter/use-browser-location";
// import { useState, useRef, useEffect } from "react";
// import type React from "react";

// // === SEO DATA ===
// const featuredClient = {
//   name: "Griffin Group Property Development",
//   logo: "",
//   website: "https://griffingroup.co.uk",
//   description:
//     "A premier UK property development company specializing in residential and commercial development projects across Essex, delivering exceptional SEO results through our white-label partnership with Social Land.",
//   achievements: [
//     "16.24% increase in organic sessions in Q2 2025",
//     "12.02% increase in organic users",
//     "7 position improvements on average for key keywords",
//     "Enhanced visibility for Essex property searches",
//     "Strong white-label partnership collaboration with Social Land",
//   ],
//   industry: "Property Development & Investment",
//   timeframe: "Q2 2025",
// };

// const caseStudies = [
//   {
//     id: 1,
//     title: "Atlantic Foundation Success",
//     client: "Atlantic Foundation & Crawl Space Repair",
//     industry: "Construction",
//     results: {
//       traffic: "+49%",
//       keywords: "122 #1 rankings",
//       revenue: "121% more leads",
//     },
//     description:
//       "Transformed a local construction company's SEO from score 69 to 100 and dramatically increased lead generation.",
//     slug: "seo-case-study",
//   },
//   {
//     id: 2,
//     title: "Scuba Diving Adventure Growth",
//     client: "By The Shore SCUBA Instruction",
//     industry: "SCUBA Training",
//     results: {
//       traffic: "+31%",
//       keywords: "61 top rankings",
//       revenue: "360% phone clicks",
//     },
//     description:
//       "Helped a diving company dominate local search results and dramatically increase booking inquiries.",
//     slug: "scuba-diving-case-study",
//   },
//   {
//     id: 3,
//     title: "STAT Planning Breakthrough",
//     client: "STAT Planning",
//     industry: "Town & Local Planning Consultancy",
//     results: {
//       traffic: "+453%",
//       keywords: "5 top rankings",
//       revenue: "+720% impressions",
//     },
//     description:
//       "Transformed a local planning consultancy's online visibility with 453% click increase and major keyword ranking improvements in just one month.",
//     slug: "stat-planning-case-study",
//   },
//   {
//     id: 4,
//     title: "UBU Design Authority",
//     client: "UBU Design",
//     industry: "Architecture & Design",
//     results: {
//       traffic: "230 total users",
//       keywords: "482 clicks",
//       revenue: "50,900 impressions",
//     },
//     description:
//       "Transformed a UK architecture firm from zero organic visibility to generating daily leads through strategic B2B SEO.",
//     slug: "ubu-design-case-study",
//   },
//   {
//     id: 5,
//     title: "Citypat Electrical Safety Success",
//     client: "Citypat",
//     industry: "Electrical Safety & Compliance",
//     results: {
//       traffic: "244 clicks",
//       keywords: "34.6K impressions",
//       revenue: "88.37% engagement",
//     },
//     description:
//       "Transformed a UK electrical testing company from zero organic visibility to consistent daily traffic through white-label partnership with Gemma's agency.",
//     slug: "citypat-case-study",
//   },
//   {
//     id: 6,
//     title: "Griffin Group Property Development Success",
//     client: "Griffin Group",
//     industry: "Property Development & Investment",
//     results: {
//       traffic: "+16.24% sessions",
//       keywords: "7 position improvements",
//       revenue: "12.02% user growth",
//     },
//     description:
//       "Transformed a UK property development firm through strategic local SEO, achieving double-digit growth in organic users and major SERP position improvements in just 3 months.",
//     slug: "griffin-group-case-study",
//   },
// ];

// // === Combined SEO + AEO Packages (for both SEO & AIO) ===
// const seoAeoPackages = [
//   {
//     id: "foundation",
//     name: "Foundation SEO + AEO Package",
//     label: "Package 1",
//     price: "£450",
//     period: "/month",
//     idealFor:
//       "Local businesses, small websites, and early-stage SEO clients who need fast wins.",
//     hoursSummary: "60 hours / month",
//     hoursBreakdown: [
//       "12 hrs Technical SEO",
//       "14 hrs On-Page SEO",
//       "16 hrs Content Writing",
//       "12 hrs Backlink Building",
//       "4 hrs AEO",
//       "2 hrs Reporting & Strategy",
//     ],
//     sections: [
//       {
//         title: "Technical SEO — 12 hours",
//         bullets: [
//           "Full technical audit (advanced + deep scan)",
//           "Fix indexing & crawl issues",
//           "Mobile optimization fixes",
//           "Improve page speed (CSS/JS minify, cache setup)",
//           "URL structure improvements",
//           "Image optimization",
//           "404, 301, canonical fixes",
//           "Core Web Vitals basic improvements",
//           "Internal crawl path cleanup",
//         ],
//       },
//       {
//         title: "On-Page SEO — 14 hours",
//         bullets: [
//           "Optimize 12–15 pages",
//           "Rewrite metadata across all important pages",
//           "Full internal linking restructure",
//           "Add FAQ sections to 6–8 pages",
//           "Keyword-to-page mapping",
//           "NLP keyword optimization",
//           "Improve header structure (H1–H3)",
//           "Add schema to essential pages",
//         ],
//       },
//       {
//         title: "Content Creation — 16 hours",
//         bullets: [
//           "4 SEO blogs (1000–1200 words each)",
//           "1 landing page full rewrite (high conversion focus)",
//           "Add Q&A blocks to 6+ pages",
//           "Add PAA block content (People Also Ask)",
//           "Optimize content for SGE / AI Overview",
//           "Add entity-based content improvements",
//         ],
//       },
//       {
//         title: "Backlink Building — 12 hours",
//         bullets: [
//           "25 backlinks (DA 20–40 mix)",
//           "5 niche/local citations",
//           "2 contextual niche edits",
//           "Competitor backlink replication for 5–10 URLs",
//           "Anchor-text optimization plan",
//           "Toxic link check + disavow recommendations",
//         ],
//       },
//       {
//         title: "AEO (Answer Engine Optimization) — 4 hours",
//         bullets: [
//           "Snippet optimization for 10–15 keywords",
//           "FAQ schema implementation",
//           "PAA question blocks",
//           "Voice-search formatted answers",
//           "Question-intent optimization",
//         ],
//       },
//       {
//         title: "Reporting & Strategy — 2 hours",
//         bullets: [
//           "Monthly white-label report",
//           "Ranking movement + visibility tracking",
//           "Next-month roadmap",
//         ],
//       },
//     ],
//     partnerNote: "Partner price: £450 (60 hours/month)",
//   },
//   {
//     id: "growth",
//     name: "Growth SEO + AEO Package",
//     label: "Package 2",
//     price: "£700",
//     period: "/month",
//     idealFor:
//       "Growing websites, e-commerce companies, multi-service businesses, and medium-competition niches.",
//     hoursSummary: "90 hours / month",
//     hoursBreakdown: [
//       "18 hrs Technical SEO",
//       "20 hrs On-Page SEO",
//       "24 hrs Content Writing",
//       "20 hrs Backlink Building",
//       "6 hrs AEO",
//       "2 hrs Reporting",
//     ],
//     sections: [
//       {
//         title: "Technical SEO — 18 hours",
//         bullets: [
//           "Full technical audit (advanced level)",
//           "Indexing & crawl optimization",
//           "Core Web Vitals improvement (LCP, CLS, INP)",
//           "Broken link fixes (404/301/302)",
//           "URL structure optimization",
//           "Resolve duplicate content/canonical issues",
//           "Advanced image optimization",
//           "Schema validation + fixes",
//           "JS/CSS render-blocking fixes",
//           "Improve site architecture",
//         ],
//       },
//       {
//         title: "On-Page SEO — 20 hours",
//         bullets: [
//           "Optimize 20–25 pages",
//           "Rewrite metadata for all key pages",
//           "Improve header structure & semantic markup",
//           "Add FAQ blocks across 10+ pages",
//           "Conversion-focused content improvements",
//           "Add schema types (FAQ, How-To, Product, Article)",
//           "Full internal linking silo setup",
//           "Keyword mapping for 30–35 keywords",
//           "Improve content readability & engagement",
//         ],
//       },
//       {
//         title: "Content Creation — 24 hours",
//         bullets: [
//           "6 SEO blogs (1200–1500 words each)",
//           "1 long-form guide (2000–2500 words)",
//           "2 landing page rewrites",
//           "Add question–answer clusters to blogs",
//           "PAA content pack for 15–20 keywords",
//           "Content rewrites for SGE/AI Overview readiness",
//           "Entity-based content improvements",
//           "30-day content plan build-out",
//         ],
//       },
//       {
//         title: "Backlink Building — 20 hours",
//         bullets: [
//           "35 backlinks total",
//           "20 DA 30–60 authority links",
//           "10 niche edits",
//           "5 citations and directory placements",
//           "Competitor backlink reverse engineering",
//           "Anchor text optimisation",
//           "Disavow review + toxic link cleanup",
//           "Internal link boosting strategy",
//         ],
//       },
//       {
//         title: "AEO (Answer Engine Optimization) — 6 hours",
//         bullets: [
//           "Snippet optimization for 25–30 keywords",
//           "Page-level SGE-focused rewrites",
//           "FAQ & How-To schema implementation",
//           "Conversational query optimisation",
//           "Answer Blocks across main landing pages",
//           "Optimize entities for answer visibility",
//         ],
//       },
//       {
//         title: "Reporting & Strategy — 2 hours",
//         bullets: [
//           "Detailed monthly white-label report",
//           "Rank movement + keyword tracking",
//           "Competitor tracking updates",
//           "Next 30-day strategy roadmap",
//         ],
//       },
//     ],
//     partnerNote: "Partner price: £700 (90 hours/month)",
//     highlight: "Most popular",
//   },
//   {
//     id: "advanced",
//     name: "Advanced SEO + AEO Domination Package",
//     label: "Package 3",
//     price: "£1,100",
//     period: "/month",
//     idealFor:
//       "National brands, SaaS, e-commerce, competitive industries, and multi-location companies.",
//     hoursSummary: "140 hours / month",
//     hoursBreakdown: [
//       "30 hrs Technical SEO",
//       "30 hrs On-Page SEO",
//       "35 hrs Content Writing",
//       "30 hrs Backlink Building",
//       "12 hrs AEO",
//       "3 hrs Reporting & Strategy",
//     ],
//     sections: [
//       {
//         title: "Technical SEO — 30 hours",
//         bullets: [
//           "Full advanced crawl audit (Screaming Frog + GSC + log files)",
//           "Deep indexing management",
//           "Core Web Vitals optimisation (LCP, CLS, FID/INP fixes)",
//           "Full site architecture restructuring",
//           "Internal crawl depth optimisation",
//           "Repair JS rendering issues",
//           "Zero duplicate content assurance",
//           "Canonical setup across large sites",
//           "Schema markup expansion (FAQ, How-To, Product, Article, Organization, Breadcrumb)",
//           "Speed optimisation (compress, minify, lazy load)",
//           "Error cleanup (404, 500, redirect chains)",
//         ],
//       },
//       {
//         title: "On-Page SEO — 30 hours",
//         bullets: [
//           "Optimization of 40–50 pages",
//           "Semantic SEO implementation",
//           "Full internal linking silo structure across the website",
//           "Add FAQ blocks to every important service/product page",
//           "Rewrite metadata for all core pages",
//           "A/B test metadata for higher CTR",
//           "Improve H1–H4 structure, readability & engagement",
//           "CRO improvements for top landing pages",
//           "Entity-based on-page optimization",
//           "Keyword mapping for 60–80 keywords",
//         ],
//       },
//       {
//         title: "Content Creation — 35 hours",
//         bullets: [
//           "8 SEO blogs (1500–1800 words, authoritative style)",
//           "2 long-form guides (2500–3000 words)",
//           "Rewrite 3–4 landing pages for conversion + ranking",
//           "Create 20–30 Q&A blocks for AEO",
//           "Add People Also Ask content expansion to blogs",
//           "Create full topic clusters around main service/product areas",
//           "Build 60-day content calendar",
//           "Rewrite outdated / low-performing content",
//         ],
//       },
//       {
//         title: "Backlink Building — 30 hours",
//         bullets: [
//           "50 backlinks total",
//           "30 DA 40–70 authority links",
//           "15 contextual niche edits",
//           "5 PR/brand mentions",
//           "Competitor backlink gap coverage for top 3 competitors",
//           "Manual outreach for high-authority websites",
//           "Anchor text diversification + optimisation",
//           "Press release distribution (if required)",
//           "Link velocity control & strategy",
//         ],
//       },
//       {
//         title: "AEO (Answer Engine Optimization) — 12 hours",
//         bullets: [
//           "Answer engine optimization for 50–70 keywords",
//           "Optimize top-level pages for Google SGE + AI Overviews",
//           "Create answer-friendly content sections",
//           "Build a full site-wide Q&A knowledge hub",
//           "Entity optimization (schema + content alignment)",
//           "Voice search scripts for common questions",
//           "Conversational query coverage across clusters",
//           "Featured Snippet takeover strategy",
//           "Knowledge Graph alignment (brand/entity relationships)",
//         ],
//       },
//       {
//         title: "Reporting & Strategy — 3 hours",
//         bullets: [
//           "Advanced monthly report",
//           "Competitor movement insights",
//           "Keyword battle plan",
//           "New opportunity discovery",
//           "Month-by-month roadmap",
//         ],
//       },
//     ],
//     partnerNote: "Partner price: £1,100 (140 hours/month)",
//   },
// ];

// // === AIO SCHEMA ===
// const AiSearchOptimizationSchema = {
//   "@context": "https://schema.org",
//   "@type": "Service",
//   name: "AI Search Optimization (AIO)",
//   description:
//     "AI Search Optimization (AIO) services to rank brands inside AI-generated results like Google SGE, Perplexity, Copilot & ChatGPT Search.",
//   provider: {
//     "@type": "Organization",
//     name: "Branding Beez",
//     url: "https://brandingbeez.co.uk",
//   },
//   serviceType: "AI Search Optimization",
//   areaServed: {
//     "@type": "Place",
//     name: "Global",
//   },
// };

// export default function SEOAndAiSearchServices() {
//   // AIO Questionnaire state (currently kept for future use)
//   const [submitted, setSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     projectBrief: "",
//     website: "",
//     goals: "",
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//   });
//   const [attachment, setAttachment] = useState<File | null>(null);

//   // Combined SEO + AEO packages state
//   const [activePackageId, setActivePackageId] = useState<string>("growth");
//   const pricingSectionRef = useRef<HTMLDivElement | null>(null);
//   const pricingDetailRef = useRef<HTMLDivElement | null>(null);
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   const activePackage =
//     seoAeoPackages.find((pkg) => pkg.id === activePackageId) ??
//     seoAeoPackages[1];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       let res: Response;

//       if (attachment) {
//         const form = new FormData();
//         form.append("name", formData.name);
//         form.append("email", formData.email);
//         form.append("phone", formData.phone);
//         form.append("company", formData.company);
//         form.append("service", "ai-search-questionnaire");
//         form.append(
//           "questionnaire",
//           JSON.stringify({
//             projectBrief: formData.projectBrief,
//             website: formData.website,
//             goals: formData.goals,
//           }),
//         );
//         form.append("questionFile", attachment, attachment.name);

//         res = await fetch("/api/contacts", {
//           method: "POST",
//           body: form,
//         });
//       } else {
//         const payload = {
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           company: formData.company,
//           service: "ai-search-questionnaire",
//           questionnaire: {
//             projectBrief: formData.projectBrief,
//             website: formData.website,
//             goals: formData.goals,
//           },
//         };

//         res = await fetch("/api/contacts", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!res.ok) {
//         const err = await res.json().catch(() => null);
//         console.error("AI questionnaire submit failed", err || res.statusText);
//         alert("Submission failed. Please try again or email us directly.");
//         return;
//       }

//       setSubmitted(true);
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("Submission failed. Please check your connection and try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const scrollToSection = (id: string) => {
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const scrollToPackageDetail = () => {
//     if (pricingDetailRef.current) {
//       pricingDetailRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   const scrollToPricingTop = () => {
//     if (pricingSectionRef.current) {
//       pricingSectionRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     } else {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!pricingDetailRef.current) return;
//       const rect = pricingDetailRef.current.getBoundingClientRect();
//       const viewportHeight = window.innerHeight;
//       const shouldShow = rect.top < viewportHeight - 80;
//       setShowScrollTop(shouldShow);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>SEO & AI Search Optimization (AIO) Services | Branding Beez</title>
//         <meta
//           name="description"
//           content="Scale your agency with white-label SEO and AI Search Optimization (AIO). Rank in Google, SGE, Perplexity, Copilot & ChatGPT Search from one integrated service page."
//         />
//         <link
//           rel="canonical"
//           href="https://brandingbeez.co.uk/services/seo"
//         />
//         <meta name="robots" content="INDEX, FOLLOW" />
//       </Helmet>

//       <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
//         <SEOHead
//           title="White-Label SEO & AI Search Optimization (AIO) | BrandingBeez"
//           description="Grow your agency with white-label SEO and AI Search Optimization (AIO). Scalable packages, proven case studies, and expert support to rank in both Google and AI answer engines."
//           keywords="white label SEO, SEO services for agencies, AI search optimization, AIO, Google SGE optimization, Perplexity SEO, ChatGPT search visibility"
//           canonicalUrl="https://brandingbeez.co.uk/services/seo"
//           ogType="service"
//         />
//         {/* Both services as structured data */}
//         <SchemaMarkup
//           type="service"
//           data={{
//             name: "White-Label SEO Services",
//             description:
//               "Comprehensive search engine optimization services delivered under your agency's brand including technical SEO, content optimization, and link building.",
//             serviceType: "Search Engine Optimization",
//             hasOfferCatalog: {
//               name: "SEO Service Offerings",
//               itemListElement: [
//                 {
//                   name: "Technical SEO Audit",
//                   description: "Comprehensive technical analysis and optimization",
//                 },
//                 {
//                   name: "Content Optimization",
//                   description: "SEO-focused content creation and optimization",
//                 },
//                 {
//                   name: "Link Building",
//                   description: "High-quality backlink acquisition strategies",
//                 },
//               ],
//             },
//           }}
//         />
//         <SchemaMarkup type="custom" data={AiSearchOptimizationSchema} />

//         <Header />

//         <main>
//           {/* TOP SERVICE & PRICING SWITCHER */}
//           <section className="border-b bg-white/70 backdrop-blur-md sticky top-[64px] z-30">
//             <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
//               <div className="text-xs md:text-sm text-gray-600">
//                 Sections on this page:
//                 <span className="font-semibold text-brand-purple ml-2">
//                   SEO Services
//                 </span>
//                 ,{" "}
//                 <span className="font-semibold text-brand-coral">
//                   AI Search Optimization (AIO)
//                 </span>{" "}
//                 &{" "}
//                 <span className="font-semibold text-slate-800">
//                   SEO + AEO Pricing
//                 </span>
//               </div>
//               <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 text-xs md:text-sm">
//                 <button
//                   type="button"
//                   onClick={() => scrollToSection("seo-section")}
//                   className="px-4 py-1 rounded-full font-medium text-brand-purple bg-white shadow-sm"
//                 >
//                   SEO Services
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => scrollToSection("aio-section")}
//                   className="px-4 py-1 rounded-full font-medium text-gray-600 hover:text-brand-coral hover:bg-white/80"
//                 >
//                   AIO / AEO Overview
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => scrollToSection("pricing-section")}
//                   className="px-4 py-1 rounded-full font-medium text-gray-600 hover:text-brand-purple hover:bg-white/80"
//                 >
//                   Pricing
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* ===================== SEO SECTION ===================== */}
//           <section
//             id="seo-section"
//             className="pt-8 sm:pt-10 lg:pt-12"
//           >
//             {/* Label chip */}
//             <div className="max-w-7xl mx-auto px-4 mb-4">
//               <Badge className="bg-brand-purple/10 text-brand-purple border-brand-purple/20">
//                 SEO SERVICES
//               </Badge>
//             </div>

//             {/* Featured SEO Client Section */}
//             <section className="py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white max-w-full mx-auto">
//               <div className="p-2 sm:p-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                   <div>
//                     <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
//                       White-Label SEO
//                     </p>
//                     <Badge className="bg-white/20 text-white border-white/30 mb-4 sm:mb-6">
//                       🏆 Featured SEO Success via Social Land
//                     </Badge>
//                     <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
//                       Griffin Group Property Development – SEO Growth
//                     </h1>
//                     <p className="text-lg sm:text-xl text-gray-100 mb-6 sm:mb-8">
//                       {featuredClient.description}
//                     </p>

//                     <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 border border-white/20">
//                       <h2 className="text-lg sm:text-xl font-bold mb-4">
//                         SEO Achievements in Q2 2025
//                       </h2>
//                       <ul className="space-y-2 text-gray-100 text-sm sm:text-base">
//                         {featuredClient.achievements.map((achievement, index) => (
//                           <li key={index} className="flex items-center gap-2">
//                             <CheckCircle className="w-5 h-5 text-white" />
//                             <span>{achievement}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4 items-center">
//                       <Link href="/contact?service=seo#contact-form">
//                         <Button className="bg-white text-brand-purple hover:bg-brand-coral hover:text-white w-full sm:w-auto">
//                           Start SEO Project
//                           <ArrowRight className="w-4 h-4 ml-2" />
//                         </Button>
//                       </Link>
//                       <Button
//                         asChild
//                         className="text-white hover:bg-white hover:text-brand-purple w-full sm:w-auto"
//                       >
//                         <a
//                           href={featuredClient.website}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           Visit Website
//                           <ExternalLink className="w-4 h-4 ml-2" />
//                         </a>
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <div className="aspect-video bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden p-4">
//                       <img
//                         src={analyticsScreenshot}
//                         alt="Griffin Group Google Analytics Results - User acquisition data showing organic search traffic growth"
//                         className="w-full h-full object-contain bg-white rounded-lg"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.style.display = "none";
//                           const fallbackDiv = document.createElement("div");
//                           fallbackDiv.className =
//                             "w-full h-full bg-gradient-to-br from-brand-purple to-brand-coral rounded-2xl flex items-center justify-center";

//                           const textCenter = document.createElement("div");
//                           textCenter.className = "text-center text-white p-8";

//                           const iconDiv = document.createElement("div");
//                           iconDiv.className = "text-4xl font-bold mb-2";
//                           iconDiv.textContent = "📊";

//                           const titleDiv = document.createElement("div");
//                           titleDiv.className = "text-lg font-semibold mb-1";
//                           titleDiv.textContent = "Google Analytics Results";

//                           const sessionDiv = document.createElement("div");
//                           sessionDiv.className = "text-sm opacity-90";
//                           sessionDiv.textContent = "16.24% session growth";

//                           const userDiv = document.createElement("div");
//                           userDiv.className = "text-sm opacity-90";
//                           userDiv.textContent = "12.02% user growth";

//                           textCenter.appendChild(iconDiv);
//                           textCenter.appendChild(titleDiv);
//                           textCenter.appendChild(sessionDiv);
//                           textCenter.appendChild(userDiv);
//                           fallbackDiv.appendChild(textCenter);
//                           target.parentElement!.appendChild(fallbackDiv);
//                         }}
//                       />
//                       <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
//                         <p className="text-white font-semibold text-sm">
//                           {featuredClient.name}
//                         </p>
//                         <p className="text-white/90 text-xs">
//                           {featuredClient.industry}
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                           <p className="text-green-300 text-xs font-medium">
//                             Live Analytics Data
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* SEO Case Studies Section */}
//             <section className="py-16 px-4 bg-gray-50">
//               <div className="max-w-7xl mx-auto">
//                 <div className="text-center mb-12">
//                   <h2 className="bg-brand-coral text-white mb-6 inline-block px-4 py-2 rounded-full text-sm font-medium">
//                     🎯 SEO Success Stories
//                   </h2>
//                   <h3 className="text-4xl font-bold text-brand-purple mb-6">
//                     SEO Case Studies & Portfolio
//                   </h3>
//                   <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//                     Discover how we've helped businesses across industries achieve
//                     remarkable SEO results and dominate their markets.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                   {caseStudies.map((study) => (
//                     <Card key={study.id} className="flex flex-col h-full">
//                       {/* Image logic */}
//                       <div className="aspect-video bg-white rounded-t-lg overflow-hidden border-b border-gray-200 p-2">
//                         {study.id === 1 ? (
//                           <img
//                             src={atlanticSearchConsole}
//                             alt="Atlantic Foundation Google Search Console Performance Results"
//                             className="w-full h-full object-contain rounded"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.style.display = "none";
//                               const fallbackDiv = document.createElement("div");
//                               fallbackDiv.className =
//                                 "w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center";

//                               const textCenter = document.createElement("div");
//                               textCenter.className = "text-center";

//                               const iconDiv = document.createElement("div");
//                               iconDiv.className = "w-16 h-16 mx-auto mb-2";
//                               iconDiv.textContent = "📊";

//                               const industryP = document.createElement("p");
//                               industryP.className =
//                                 "text-sm font-medium text-gray-600";
//                               industryP.textContent = study.industry;

//                               textCenter.appendChild(iconDiv);
//                               textCenter.appendChild(industryP);
//                               fallbackDiv.appendChild(textCenter);
//                               target.parentElement!.appendChild(fallbackDiv);
//                             }}
//                           />
//                         ) : study.id === 2 ? (
//                           <img
//                             src={scubaSearchResults}
//                             alt="By The Shore Scuba Google Search Console Performance Results"
//                             className="w-full h-full object-contain rounded"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.style.display = "none";
//                               const fallbackDiv = document.createElement("div");
//                               fallbackDiv.className =
//                                 "w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center";

//                               const textCenter = document.createElement("div");
//                               textCenter.className = "text-center";

//                               const iconDiv = document.createElement("div");
//                               iconDiv.className = "w-16 h-16 mx-auto mb-2";
//                               iconDiv.textContent = "📊";

//                               const industryP = document.createElement("p");
//                               industryP.className =
//                                 "text-sm font-medium text-gray-600";
//                               industryP.textContent = study.industry;

//                               textCenter.appendChild(iconDiv);
//                               textCenter.appendChild(industryP);
//                               fallbackDiv.appendChild(textCenter);
//                               target.parentElement!.appendChild(fallbackDiv);
//                             }}
//                           />
//                         ) : study.id === 3 ? (
//                           <img
//                             src={statPlanningResults}
//                             alt="Stat Planning Google Search Console Performance - 218 clicks, 4.41K impressions"
//                             className="w-full h-full object-contain rounded"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.style.display = "none";
//                               const fallbackDiv = document.createElement("div");
//                               fallbackDiv.className =
//                                 "w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center";

//                               const textCenter = document.createElement("div");
//                               textCenter.className = "text-center";

//                               const iconDiv = document.createElement("div");
//                               iconDiv.className = "w-16 h-16 mx-auto mb-2";
//                               iconDiv.textContent = "📊";

//                               const industryP = document.createElement("p");
//                               industryP.className =
//                                 "text-sm font-medium text-gray-600";
//                               industryP.textContent = study.industry;

//                               textCenter.appendChild(iconDiv);
//                               textCenter.appendChild(industryP);
//                               fallbackDiv.appendChild(textCenter);
//                               target.parentElement!.appendChild(fallbackDiv);
//                             }}
//                           />
//                         ) : study.id === 4 ? (
//                           <img
//                             src={ubuDesignResults}
//                             alt="UBU Design Google Search Console Performance - 516 clicks, 55.4K impressions"
//                             className="w-full h-full object-contain rounded"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.style.display = "none";
//                               const fallbackDiv = document.createElement("div");
//                               fallbackDiv.className =
//                                 "w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center";

//                               const textCenter = document.createElement("div");
//                               textCenter.className = "text-center";

//                               const iconDiv = document.createElement("div");
//                               iconDiv.className = "w-16 h-16 mx-auto mb-2";
//                               iconDiv.textContent = "📊";

//                               const industryP = document.createElement("p");
//                               industryP.className =
//                                 "text-sm font-medium text-gray-600";
//                               industryP.textContent = study.industry;

//                               textCenter.appendChild(iconDiv);
//                               textCenter.appendChild(industryP);
//                               fallbackDiv.appendChild(textCenter);
//                               target.parentElement!.appendChild(fallbackDiv);
//                             }}
//                           />
//                         ) : study.id === 5 ? (
//                           <img
//                             src={citypatResults}
//                             alt="CityPat Google Search Console Performance - 244 clicks, 34.6K impressions"
//                             className="w-full h-full object-contain rounded"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.style.display = "none";
//                               const fallbackDiv = document.createElement("div");
//                               fallbackDiv.className =
//                                 "w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center";

//                               const textCenter = document.createElement("div");
//                               textCenter.className = "text-center";

//                               const iconDiv = document.createElement("div");
//                               iconDiv.className = "w-16 h-16 mx-auto mb-2";
//                               iconDiv.textContent = "📊";

//                               const industryP = document.createElement("p");
//                               industryP.className =
//                                 "text-sm font-medium text-gray-600";
//                               industryP.textContent = study.industry;

//                               textCenter.appendChild(iconDiv);
//                               textCenter.appendChild(industryP);
//                               fallbackDiv.appendChild(textCenter);
//                               target.parentElement!.appendChild(fallbackDiv);
//                             }}
//                           />
//                         ) : study.id === 6 ? (
//                           <img
//                             src={griffinGroupAnalytics}
//                             alt="Griffin Group Google Analytics User Acquisition Data"
//                             className="w-full h-full object-contain rounded"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.style.display = "none";
//                               const fallbackDiv = document.createElement("div");
//                               fallbackDiv.className =
//                                 "w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center";

//                               const textCenter = document.createElement("div");
//                               textCenter.className = "text-center";

//                               const iconDiv = document.createElement("div");
//                               iconDiv.className = "w-16 h-16 mx-auto mb-2";
//                               iconDiv.textContent = "📊";

//                               const industryP = document.createElement("p");
//                               industryP.className =
//                                 "text-sm font-medium text-gray-600";
//                               industryP.textContent = study.industry;

//                               textCenter.appendChild(iconDiv);
//                               textCenter.appendChild(industryP);
//                               fallbackDiv.appendChild(textCenter);
//                               target.parentElement!.appendChild(fallbackDiv);
//                             }}
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 rounded-t-lg flex items-center justify-center">
//                             <div className="text-center">
//                               <LineChart className="w-16 h-16 text-brand-coral mx-auto mb-2" />
//                               <p className="text-sm font-medium text-gray-600">
//                                 {study.industry}
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       <CardContent className="p-6 flex flex-col h-full">
//                         <h3 className="text-xl font-bold text-brand-purple mb-2">
//                           {study.title}
//                         </h3>
//                         <p className="text-gray-600 mb-4 flex-grow">
//                           {study.description}
//                         </p>

//                         <div className="space-y-2 mb-6 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Organic Traffic</span>
//                             <span className="font-bold text-green-600">
//                               {study.results.traffic}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Keywords Ranking</span>
//                             <span className="font-bold text-blue-600">
//                               {study.results.keywords}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Revenue Impact</span>
//                             <span className="font-bold text-brand-coral">
//                               {study.results.revenue}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="mt-auto">
//                           <Link
//                             href={
//                               study.id === 1
//                                 ? "/case-studies/seo-case-study"
//                                 : study.id === 2
//                                   ? "/case-studies/scuba-diving-case-study"
//                                   : study.id === 3
//                                     ? "/case-studies/stat-planning-case-study"
//                                     : study.id === 4
//                                       ? "/case-studies/ubu-design-case-study"
//                                       : study.id === 5
//                                         ? "/case-studies/citypat-case-study"
//                                         : "/case-studies/griffin-group-case-study"
//                             }
//                           >
//                             <Button className="w-full bg-brand-coral hover:bg-brand-purple text-white">
//                               View Full Case Study
//                               <ArrowRight className="w-4 h-4 ml-2" />
//                             </Button>
//                           </Link>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             </section>
//           </section>

//           {/* ===================== FULL AIO SECTION ===================== */}
//           <section
//             id="aio-section"
//             className="pt-14 bg-gray-50"
//           >
//             <div className="max-w-7xl mx-auto px-4 mb-4">
//               <Badge className="bg-brand-coral/10 text-brand-coral border-brand-coral/30">
//                 AI SEARCH OPTIMIZATION (AIO)
//               </Badge>
//             </div>

//             {/* AIO Hero Section */}
//             <section className="pt-16 pb-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
//               <div className="max-w-7xl mx-auto">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                   <div>
//                     <Badge className="bg-white/20 text-white border-white/30 mb-6 flex items-center gap-2 w-fit font-bold">
//                       <Zap className="w-4 h-4" />
//                       AI Search Optimization (AIO)
//                     </Badge>

//                     <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
//                       Get Ranked Inside <span className="underline">AI Answers</span>,
//                       Not Just Blue Links
//                     </h1>

//                     <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
//                       Position your brand inside AI-generated results across{" "}
//                       <span className="font-semibold">
//                         Google SGE, Perplexity, Copilot & ChatGPT Search
//                       </span>
//                       . Structured AIO packages for local brands, fast-growing companies,
//                       and enterprise teams.
//                     </p>

//                     <div className="grid grid-cols-2 gap-4 mb-8">
//                       <div className="bg-white/10 rounded-lg p-4">
//                         <div className="text-sm text-white/70 mb-1">
//                           AI Platforms Covered
//                         </div>
//                         <div className="text-lg font-semibold leading-snug">
//                           SGE • Perplexity • Copilot • ChatGPT
//                         </div>
//                       </div>
//                       <div className="bg-white/10 rounded-lg p-4">
//                         <div className="text-sm text-white/70 mb-1">Ideal For</div>
//                         <div className="text-lg font-semibold leading-snug">
//                           Local, Growth & Enterprise Brands
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4">
//                       <Link href="/pricing-calculator">
//                         <Button
//                           className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
//                           size="lg"
//                         >
//                           Get AIO Pricing
//                           <ArrowRight className="w-5 h-5 ml-2" />
//                         </Button>
//                       </Link>
//                       <Button
//                         size="lg"
//                         className="border-white text-white hover:border-white px-8"
//                         asChild
//                       >
//                         <a
//                           href="https://calendar.app.google/Y8XZq71qtvPRhktH9"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           Book AIO Strategy Call
//                           <ArrowRight className="ml-2 h-4 w-4" />
//                         </a>
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Right Side: AIO Snapshot */}
//                   <div className="bg-[rgba(40,20,50,0.6)] backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0px_8px_32px_rgba(0,0,0,0.3)]">
//                     <p className="text-xl font-bold mb-4">
//                       What AIO Actually Optimizes For:
//                     </p>

//                     <div className="space-y-4 mb-6">
//                       <div className="flex items-start gap-3">
//                         <Shield className="w-5 h-5 text-white/80 mt-0.5" />
//                         <div>
//                           <p className="font-semibold text-base">
//                             Entity Recognition
//                           </p>
//                           <p className="text-sm md:text-base text-white/80 leading-relaxed">
//                             Structured brand, service, and location entities that AI
//                             engines can reliably understand.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <TrendingUp className="w-5 h-5 text-white/80 mt-0.5" />
//                         <div>
//                           <p className="font-semibold text-base">
//                             AI Answer Extraction
//                           </p>
//                           <p className="text-sm md:text-base text-white/80 leading-relaxed">
//                             Page structures, blocks, and schemas built to be “quoted” by
//                             AI as the best answer.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <Users className="w-5 h-5 text-white/80 mt-0.5" />
//                         <div>
//                           <p className="font-semibold text-base">
//                             Conversational Keywords
//                           </p>
//                           <p className="text-sm md:text-base text-white/80 leading-relaxed">
//                             Real questions people ask AI tools—and your brand appearing
//                             in the responses.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
//                       <div className="bg-white/10 rounded-lg p-4">
//                         <div className="text-xs md:text-sm text-white/70 uppercase tracking-wide">
//                           Measured By
//                         </div>
//                         <div className="mt-2 space-y-1 leading-relaxed">
//                           <p>• SGE impressions</p>
//                           <p>• Entity recognition score</p>
//                           <p>• AI answer frequency</p>
//                         </div>
//                       </div>
//                       <div className="bg-white/10 rounded-lg p-4">
//                         <div className="text-xs md:text-sm text-white/70 uppercase tracking-wide">
//                           For AI-First Brands
//                         </div>
//                         <div className="mt-2 space-y-1 leading-relaxed">
//                           <p>• Local businesses</p>
//                           <p>• Scaling SaaS & agencies</p>
//                           <p>• E-commerce & enterprise</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Who AIO Is For */}
//             <section className="py-16 px-4 bg-white">
//               <div className="max-w-7xl mx-auto">
//                 <div className="text-center mb-12">
//                   <h2 className="text-3xl font-bold text-brand-purple mb-4">
//                     Who Is AI Search Optimization For?
//                   </h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                   <Card className="h-full">
//                     <CardContent className="p-6">
//                       <Badge className="mb-4 bg-purple-50 text-brand-purple border-purple-100">
//                         Starter AIO
//                       </Badge>
//                       <h3 className="text-xl font-bold text-gray-900 mb-2">
//                         Local Businesses & Early-Stage Brands
//                       </h3>
//                       <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
//                         Get AI engines to correctly recognize who you are, what you do,
//                         and where you operate.
//                       </p>
//                       <ul className="space-y-2 text-sm md:text-base text-gray-700">
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>Establish entity & schema foundations</span>
//                         </li>
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>Optimize 5 key service/location pages</span>
//                         </li>
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>Capture early SGE visibility</span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="h-full border-brand-coral/60 border-2 shadow-sm scale-[1.02]">
//                     <CardContent className="p-6">
//                       <Badge className="mb-4 bg-brand-coral text-white">
//                         Growth AIO (Most Popular)
//                       </Badge>
//                       <h3 className="text-xl font-bold text-gray-900 mb-2">
//                         Growing Companies & Agencies
//                       </h3>
//                       <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
//                         Grow topic authority and secure repeated inclusion inside AI
//                         answer summaries and snippets.
//                       </p>
//                       <ul className="space-y-2 text-sm md:text-base text-gray-700">
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>AI topic graph & internal linking</span>
//                         </li>
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>10 pages rewritten for AI extraction</span>
//                         </li>
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>Multi-location & competitor mapping</span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="h-full">
//                     <CardContent className="p-6">
//                       <Badge className="mb-4 bg-slate-900 text-white">
//                         Pro AIO
//                       </Badge>
//                       <h3 className="text-xl font-bold text-gray-900 mb-2">
//                         E-Commerce & Enterprise Teams
//                       </h3>
//                       <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
//                         Dominate AI-driven ecosystems with advanced technical work, topic
//                         clusters, and predictive ranking.
//                       </p>
//                       <ul className="space-y-2 text-sm md:text-base text-gray-700">
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>20+ pages with predictive ranking signals</span>
//                         </li>
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>Core Web Vitals, JS SEO & semantic upgrades</span>
//                         </li>
//                         <li className="flex gap-2">
//                           <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                           <span>Dedicated dashboard & strategy calls</span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </section>

//               {/* Measurement & Process Section */}
//             <section className="py-16 px-4 bg-gray-50">
//               <div className="max-w-5xl mx-auto">
//                 <div className="text-center mb-10">
//                   <h2 className="text-3xl font-bold text-brand-purple mb-4">
//                     How We Measure AIO Success
//                   </h2>
//                   <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//                     Every package comes with clear measurement frameworks—so you’re not
//                     guessing whether AI sees your brand or not.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                   <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 md:p-8">
//                     <div className="flex items-center gap-3 mb-4">
//                       <Target className="w-7 h-7 text-brand-purple" />
//                       <h3 className="text-xl font-semibold text-gray-900">
//                         Entity & Schema
//                       </h3>
//                     </div>
//                     <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
//                       We track how AI engines understand and map your brand, services,
//                       and locations as structured entities.
//                     </p>
//                     <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>Entity recognition score (NLP)</span>
//                       </li>
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>Schema coverage & indexing</span>
//                       </li>
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>Entity relationship graph growth</span>
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 md:p-8">
//                     <div className="flex items-center gap-3 mb-4">
//                       <TrendingUp className="w-7 h-7 text-brand-purple" />
//                       <h3 className="text-xl font-semibold text-gray-900">
//                         AI Visibility
//                       </h3>
//                     </div>
//                     <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
//                       We don’t just track traditional SEO—we monitor AI-first surfaces
//                       directly where users actually see answers.
//                     </p>
//                     <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>SGE impressions & answer blocks</span>
//                       </li>
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>Perplexity / Copilot visibility</span>
//                       </li>
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>Conversational search impressions</span>
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 md:p-8">
//                     <div className="flex items-center gap-3 mb-4">
//                       <Calculator className="w-7 h-7 text-brand-purple" />
//                       <h3 className="text-xl font-semibold text-gray-900">
//                         Content & Clusters
//                       </h3>
//                     </div>
//                     <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
//                       Topic authority is earned with structured content, supporting
//                       pages, and smart internal linking patterns.
//                     </p>
//                     <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>Cluster authority dominance</span>
//                       </li>
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>AI snippet inclusion rate</span>
//                       </li>
//                       <li className="flex gap-2">
//                         <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
//                         <span>AIO content gap closures</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Combined SEO + AEO Packages Section */}
//             <section
//               id="pricing-section"
//               className="py-16 px-4 bg-white"
//             >
//               <div
//                 className="max-w-7xl mx-auto"
//                 ref={pricingSectionRef}
//               >
//                 <div className="text-center mb-8 md:mb-10">
//                   <h2 className="text-3xl font-bold text-brand-purple mb-4">
//                     SEO + Answer Engine Optimization (AEO) Packages
//                   </h2>
//                   <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
//                     One combined framework that covers traditional SEO ranking and modern
//                     AI & answer engine visibility. Choose a package by effort level, then
//                     view the full breakdown below.
//                   </p>

//                   {/* SEO vs AIO legend */}
//                   <div className="flex items-center justify-center gap-3 mt-6">
//                     <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-3 py-1">
//                       <span className="w-2 h-2 rounded-full bg-brand-purple" />
//                       <span className="text-xs font-medium text-brand-purple">
//                         SEO Work
//                       </span>
//                     </div>
//                     <div className="inline-flex items-center gap-2 rounded-full border border-brand-coral/20 bg-brand-coral/5 px-3 py-1">
//                       <span className="w-2 h-2 rounded-full bg-brand-coral" />
//                       <span className="text-xs font-medium text-brand-coral">
//                         AIO / AEO Work
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Package selector cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
//                   {seoAeoPackages.map((pkg) => {
//                     const isActive = pkg.id === activePackageId;
//                     return (
//                       <Card
//                         key={pkg.id}
//                         className={[
//                           "relative flex flex-col h-full cursor-pointer transition-all duration-300",
//                           isActive
//                             ? "border-2 border-brand-coral shadow-md bg-white"
//                             : "border border-brand-purple/10 hover:border-brand-purple/40 hover:shadow-sm bg-white",
//                         ].join(" ")}
//                         onClick={() => setActivePackageId(pkg.id)}
//                       >
//                         {pkg.highlight && (
//                           <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//                             <Badge className="bg-brand-coral text-white px-4 py-1 rounded-full flex items-center gap-1">
//                               <Star className="w-4 h-4" />
//                               {pkg.highlight}
//                             </Badge>
//                           </div>
//                         )}

//                         <CardHeader className="text-center pb-3 pt-6 flex-shrink-0">
//                           <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
//                             {pkg.label}
//                           </p>
//                           <CardTitle className="text-xl font-bold text-brand-purple">
//                             {pkg.name}
//                           </CardTitle>
//                           <div className="mt-4 flex items-baseline justify-center gap-2">
//                             <span className="text-3xl font-extrabold text-brand-coral">
//                               {pkg.price}
//                             </span>
//                             <span className="text-gray-600 text-sm">
//                               {pkg.period}
//                             </span>
//                           </div>
//                           <p className="text-xs font-medium text-gray-500 mt-1">
//                             {pkg.hoursSummary}
//                           </p>

//                           {/* small SEO vs AIO chips on each card */}
//                           <div className="flex items-center justify-center gap-2 mt-2">
//                             <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-purple/5 text-brand-purple border border-brand-purple/20">
//                               SEO Tasks
//                             </span>
//                             <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-coral/5 text-brand-coral border border-brand-coral/20">
//                               AIO / AEO Tasks
//                             </span>
//                           </div>
//                         </CardHeader>

//                         <CardContent className="flex flex-col flex-grow px-5 pb-5">
//                           <p className="text-sm text-gray-700 mb-4">
//                             {pkg.idealFor}
//                           </p>
//                           <ul className="space-y-1.5 text-xs text-gray-700 mb-5">
//                             {pkg.hoursBreakdown.map((line, idx) => (
//                               <li
//                                 key={idx}
//                                 className="flex gap-2"
//                               >
//                                 <CheckCircle className="w-3.5 h-3.5 text-brand-purple mt-[2px]" />
//                                 <span>{line}</span>
//                               </li>
//                             ))}
//                           </ul>

//                           <div className="mt-auto pt-3 border-t border-gray-200 space-y-2">
//                             <p className="text-[11px] text-gray-500">
//                               {pkg.partnerNote}
//                             </p>
//                             <Button
//                               className={[
//                                 "w-full h-10 text-sm font-semibold",
//                                 isActive
//                                   ? "bg-brand-coral hover:bg-brand-coral/90 text-white"
//                                   : "bg-white text-brand-purple border border-brand-purple hover:bg-brand-purple hover:text-white",
//                               ].join(" ")}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setActivePackageId(pkg.id);
//                                 scrollToPackageDetail();
//                               }}
//                             >
//                               {isActive
//                                 ? "Currently Viewing Breakdown"
//                                 : "View Full Breakdown"}
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </div>

//                 {/* Detail panel for active package */}
//                 <div
//                   className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8"
//                   ref={pricingDetailRef}
//                 >
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//                     <div>
//                       <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
//                         Full Breakdown
//                       </p>
//                       <h3 className="text-2xl md:text-3xl font-bold text-brand-purple">
//                         {activePackage.name}
//                       </h3>
//                       <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl">
//                         {activePackage.idealFor}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <div className="flex items-baseline justify-end gap-2">
//                         <span className="text-3xl font-extrabold text-brand-coral">
//                           {activePackage.price}
//                         </span>
//                         <span className="text-gray-600 text-sm">
//                           {activePackage.period}
//                         </span>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {activePackage.hoursSummary} • {activePackage.partnerNote}
//                       </p>
//                       {/* IMPORTANT: service=seo so contact form selects SEO / AIO Services */}
//                       <Link href="/contact?service=seo#contact-form">
//                         <Button className="mt-3 bg-brand-purple hover:bg-brand-purple/90 text-white text-sm">
//                           Start with this package
//                           <ArrowRight className="w-4 h-4 ml-2" />
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {activePackage.sections.map((section) => {
//                       const isAeoSection =
//                         section.title.toLowerCase().includes("aeo") ||
//                         section.title.toLowerCase().includes("answer engine");

//                       return (
//                         <div
//                           key={section.title}
//                           className="border border-gray-100 rounded-xl p-5"
//                         >
//                           <div className="flex items-center justify-between mb-1.5">
//                             <h4 className="text-base font-semibold text-brand-purple">
//                               {section.title}
//                             </h4>

//                             {/* SEO vs AIO badge per block */}
//                             <Badge
//                               className={
//                                 "text-[10px] font-semibold px-2 py-0.5 rounded-full " +
//                                 (isAeoSection
//                                   ? "bg-brand-coral/10 text-brand-coral border border-brand-coral/30"
//                                   : "bg-brand-purple/10 text-brand-purple border border-brand-purple/30")
//                               }
//                             >
//                               {isAeoSection ? "AIO / AEO" : "SEO"}
//                             </Badge>
//                           </div>

//                           <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
//                             {section.bullets.map((item) => (
//                               <li
//                                 key={item}
//                                 className="flex gap-2"
//                               >
//                                 <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5 flex-shrink-0" />
//                                 <span>{item}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* AIO CTA Section */}
//             <section className="py-16 px-4 bg-gradient-to-r from-[#CF4163] to-[#552265] text-white">
//               <div className="max-w-4xl mx-auto text-center">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-4">
//                   Ready to Get Your Brand Quoted by AI?
//                 </h2>
//                 <p className="text-xl text-white/90 mb-8 leading-relaxed">
//                   Choose an AIO package or talk to us about a custom AI search roadmap.
//                   We’ll help your brand move from “indexed” to “answer-worthy.”
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <Button
//                     size="lg"
//                     className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple px-8"
//                     asChild
//                   >
//                     <a
//                       href="https://calendar.app.google/Y8XZq71qtvPRhktH9"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       Book AIO Strategy Call
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </a>
//                   </Button>

//                   <div className="flex flex-row gap-4 justify-center">
//                     <Button
//                       size="lg"
//                       className="bg-white text-brand-coral hover:bg-brand-purple hover:text-white font-semibold"
//                       onClick={() => navigate("/#newsletter")}
//                     >
//                       Subscribe for Free
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </section>

//           {/* Floating back-to-packages button */}
//           {/* {showScrollTop && (
//             <button
//               type="button"
//               onClick={scrollToPricingTop}
//               className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-brand-purple text-white px-4 py-2 shadow-lg hover:bg-brand-coral transition-colors text-sm"
//             >
//               <ArrowUp className="w-4 h-4" />
//               Back to Packages
//             </button>
//           )} */}
//         </main>

//         <Footer />
//       </div>
//     </>
//   );
// }

