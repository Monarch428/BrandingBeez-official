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

// Featured SEO Client Data
const featuredClient = {
  name: "Griffin Group Property Development",
  logo: "", // No logo needed, will use text placeholder
  website: "https://griffingroup.co.uk",
  description: "A premier UK property development company specializing in residential and commercial development projects across Essex, delivering exceptional SEO results through our white-label partnership with Social Land.",
  achievements: [
    "16.24% increase in organic sessions in Q2 2025",
    "12.02% increase in organic users",
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
    price: "$400",
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
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  🏆 Featured White-Label Success via Social Land
                </Badge>
                <h1 className="text-4xl font-bold mb-6">
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
                  <Link href="/contact?service=SEO Services">
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
                      sessionDiv.textContent = '16.24% session growth';

                      const userDiv = document.createElement('div');
                      userDiv.className = 'text-sm opacity-90';
                      userDiv.textContent = '12.02% user growth';

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
                        <Link href="/contact?service=SEO Services">
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
                            <Link href={`/contact?service=${encodeURIComponent("SEO Services")}`}>
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
            <div className="text-center mt-12">
              <p className="text-gray-900/80 mb-4">
                Need a custom solution? We offer tailored SEO strategies for enterprise clients.
              </p>
              <Link href="/contact?service=SEO Services">
                <Button
                  variant="outline"
                  className="border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                >
                  Contact Us for Custom Pricing
                </Button>
              </Link>
            </div>
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
                onClick={() => window.open('/newsletter', '_blank')}
              >Subscribe for Free</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}