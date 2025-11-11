import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Link, useLocation } from "wouter";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Star,
  Globe,
  ExternalLink,
  LineChart,
  Zap,
  Shield,
  Search,
  DollarSign,
  Gift
} from "lucide-react";

// Featured Google Ads client data
const featuredClient = {
  name: "Arlingsworth Solicitors",
  logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'%3E%3Crect width='150' height='60' fill='%23ff6b47'/%3E%3Ctext x='75' y='35' fill='white' font-family='Arial' font-size='14' text-anchor='middle'%3EBusiness%3C/text%3E%3C/svg%3E",
  website: "https://www.arlingsworth.com",
  description: "A UK-based law firm specializing in family law, probate, and divorce matters.",
  achievements: [
    "£6.51 cost per acquisition (lowest)",
    "18.95% best conversion rate",
    "8.76% top CTR",
    "1,139+ total clicks",
    "100+ conversions, 77.5 phone calls"
  ],
  industry: "Legal Services",
  timeframe: "30 days"
};

const caseStudies = [
  {
    id: 1,
    title: "UK Legal Services Excellence",
    client: "Arlingsworth Solicitors",
    industry: "Legal Services",
    results: {
      cpa: "£6.51 lowest CPA",
      conversionRate: "18.95% conversion rate",
      clicks: "1,139+ total clicks"
    },
    description: "Achieved exceptional results for UK family law firm with Performance Max and Search campaigns optimization.",
    link: "/case-studies/arlingsworth-solicitors-case-study"
  },
  {
    id: 2,
    title: "Waste Management Transformation",
    client: "JunksAway",
    industry: "Waste Management",
    results: {
      cpaReduction: "82% CPA reduction",
      conversions: "706 total conversions",
      roas: "1.28x ROAS achieved"
    },
    description: "Dramatically reduced CPA from $34.37 to $6.09 for US junk removal company through strategic campaign restructure.",
    link: "/case-studies/junksaway-case-study"
  },
  {
    id: 3,
    title: "Pet Services Success",
    client: "The Dog Guy",
    industry: "Dog Training",
    results: {
      conversionRate: "12.06% conversion rate",
      conversions: "192 total conversions",
      cpa: "£20.35 average CPA"
    },
    description: "Optimized underperforming campaigns for UK dog training business, transitioning from audit to monthly retainer.",
    link: "/case-studies/the-dog-guy-case-study"
  }
];

const pricingPackages = [
  {
    id: 1,
    name: "Starter",
    price: "$399",
    period: "/month + ad spend",
    description: "Perfect for small businesses starting with Google Ads",
    features: [
      "Ad spend range: $1,000 - $3,000",
      "Search Ads & Performance Max",
      "Remarketing campaigns",
      "Up to 2 target locations",
      "3 search ad sets",
      "Conversion tracking setup",
      "Monthly summary report",
      "Email support"
    ],
    popular: false
  },
  {
    id: 2,
    name: "Growth",
    price: "$799",
    period: "/month + ad spend",
    description: "Ideal for growing businesses",
    features: [
      "Ad spend range: $3,000 - $8,000",
      "Search, PMax, Display & Brand campaigns",
      "Up to 5 target locations",
      "5 search + 1 display creative",
      "Landing page optimization recommendations",
      "Audience segmentation",
      "Monthly competitor monitoring",
      "Detailed PDF reports",
      "2 monthly strategy calls"
    ],
    popular: true
  },
  {
    id: 3,
    name: "Scale",
    price: "$1,299",
    period: "/month + ad spend",
    description: "For large businesses and complex campaigns",
    features: [
      "Ad spend range: $8,000 - $15,000",
      "Full funnel ads: Search, Display, YouTube",
      "Shopping ads (if e-commerce)",
      "Nationwide or up to 10 locations",
      "Advanced audience segmentation",
      "A/B testing recommendations",
      "Bi-weekly competitor monitoring",
      "Advanced dashboard access",
      "3 strategy calls + priority support"
    ],
    popular: false
  }
];

export default function GoogleAds() {
  const [, setLocation] = useLocation();
  
  const navigateToPricingCalculator = () => {
    setLocation('/pricing-calculator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SEOHead 
        title="White-Label Google Ads Services | £6.51 CPA | Expert PPC for Agencies"
        description="Professional white-label Google Ads management for agencies. Proven results with £6.51 CPA and 18.95% conversion rates. Performance Max, Search, and Shopping campaigns delivered under your brand."
        keywords="white label Google Ads, PPC services for agencies, white label pay per click, Google Ads management, Performance Max campaigns, Search campaigns"
        canonicalUrl="https://brandingbeez.com/services/google-ads"
        ogType="service"
      />
      <SchemaMarkup type="service" data={{
        name: "White-Label Google Ads Services",
        description: "Performance-focused Google Ads campaigns with conversion optimization and detailed reporting delivered under your agency's brand.",
        serviceType: "Pay-Per-Click Advertising",
        hasOfferCatalog: {
          name: "Google Ads Service Offerings",
          itemListElement: [
            {
              name: "Performance Max Campaigns",
              description: "AI-powered campaigns across all Google properties"
            },
            {
              name: "Search Campaigns",
              description: "Targeted search advertising with keyword optimization"
            },
            {
              name: "Shopping Campaigns",
              description: "E-commerce focused product advertising"
            }
          ]
        }
      }} />
      <Header />
      <main className="pt-0">
        {/* Featured Google Ads Client Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-6">
                  🏆 Featured Google Ads Client of the Month
                </Badge>
                <h1 className="text-4xl font-bold mb-6">
                  Arlingsworth Solicitors
                </h1>
                <p className="text-xl text-gray-100 mb-8">
                  {featuredClient.description}
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                  <h2 className="text-xl font-bold mb-4">Google Ads Results in 30 days</h2>
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
                  <Button className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple" asChild>
                    <Link href="/contact">
                      Start Your Campaign
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple"
                    asChild
                  >
                    <a href={featuredClient.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Card className="bg-white/95 backdrop-blur-sm border border-white/20 p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-white">AS</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {featuredClient.industry}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{featuredClient.name}</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <img 
                      src="/attached_assets/Time_series(2025.05.01-2025.05.31)_1753339120036.png" 
                      alt="Arlingsworth Solicitors Google Ads performance dashboard showing impressions, clicks, conversions, and cost metrics"
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-600 text-center">
                    Live Google Ads dashboard showing 30-day performance metrics including 24.8K impressions, 839 clicks, 100 conversions, and £20.66 cost per conversion.
                  </p>
                </Card>
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
                Google Ads Case Studies & Results
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how we've helped businesses across industries achieve exceptional ROI with strategic Google Ads campaigns and data-driven optimization.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <Card key={study.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {index === 0 ? (
                    /* Arlingsworth Solicitors with uploaded image */
                    (<div className="aspect-video rounded-t-lg overflow-hidden bg-white border-b border-gray-200">
                      <picture>
                        <source srcSet="/images/img_g1.png" type="image/png" />
                        <img
                          src="/images/img_g1.png"
                          alt="Arlingsworth Solicitors Google Ads case study showing campaign performance and results"
                          className="w-full h-full object-contain bg-white p-2"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      </picture>
                      <div className="w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center" style={{ display: 'none' }}>
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="w-8 h-8 text-brand-coral" />
                          </div>
                          <h4 className="text-lg font-bold text-brand-purple mb-2">{study.client}</h4>
                          <p className="text-sm font-medium text-gray-700">{study.industry}</p>
                        </div>
                      </div>
                    </div>)
                  ) : index === 1 ? (
                    /* Junksaway with uploaded image */
                    (<div className="aspect-video rounded-t-lg overflow-hidden bg-white border-b border-gray-200">
                      <picture>
                        <source srcSet="/images/img_g2.png" type="image/png" />
                        <img
                          src="/images/img_g2.png"
                          alt="Junksaway Google Ads case study showing campaign performance and results"
                          className="w-full h-full object-contain bg-white p-2"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      </picture>
                      <div className="w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center" style={{ display: 'none' }}>
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="w-8 h-8 text-brand-coral" />
                          </div>
                          <h4 className="text-lg font-bold text-brand-purple mb-2">{study.client}</h4>
                          <p className="text-sm font-medium text-gray-700">{study.industry}</p>
                        </div>
                      </div>
                    </div>)
                  ) : index === 2 ? (
                    /* The Dog Guy with uploaded image */
                    (<div className="aspect-video rounded-t-lg overflow-hidden bg-white border-b border-gray-200">
                      <picture>
                        <source srcSet="/images/img_g3.png" type="image/png" />
                        <img
                          src="/images/img_g3.png"
                          alt="The Dog Guy Google Ads case study showing campaign performance and results"
                          className="w-full h-full object-contain bg-white p-2"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      </picture>
                      <div className="w-full h-full bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 flex items-center justify-center" style={{ display: 'none' }}>
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="w-8 h-8 text-brand-coral" />
                          </div>
                          <h4 className="text-lg font-bold text-brand-purple mb-2">{study.client}</h4>
                          <p className="text-sm font-medium text-gray-700">{study.industry}</p>
                        </div>
                      </div>
                    </div>)
                  ) : (
                    /* Placeholder for other case studies */
                    (<div className="aspect-video bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 rounded-t-lg overflow-hidden flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-coral/20"></div>
                      <div className="relative z-10 text-center p-6">
                        <div className="w-16 h-16 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="w-8 h-8 text-brand-coral" />
                        </div>
                        <h4 className="text-lg font-bold text-brand-purple mb-2">{study.client}</h4>
                        <p className="text-sm font-medium text-gray-700">{study.industry}</p>
                      </div>
                    </div>)
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-brand-purple mb-2">
                      {study.client}
                    </h3>
                    <p className="text-gray-600 mb-4">{study.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {study.results.cpa && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Best CPA</span>
                          <span className="font-bold text-green-600">{study.results.cpa}</span>
                        </div>
                      )}
                      {study.results.conversionRate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversion Rate</span>
                          <span className="font-bold text-blue-600">{study.results.conversionRate}</span>
                        </div>
                      )}
                      {study.results.clicks && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Clicks</span>
                          <span className="font-bold text-brand-coral">{study.results.clicks}</span>
                        </div>
                      )}
                      {study.results.cpaReduction && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">CPA Reduction</span>
                          <span className="font-bold text-green-600">{study.results.cpaReduction}</span>
                        </div>
                      )}
                      {study.results.conversions && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversions</span>
                          <span className="font-bold text-blue-600">{study.results.conversions}</span>
                        </div>
                      )}
                      {study.results.roas && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">ROAS</span>
                          <span className="font-bold text-purple-600">{study.results.roas}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-brand-coral rand-coral/90 text-white group- "
                      asChild
                    >
                      <Link href={study.link}>
                        View Full Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
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
                💎 Google Ads Management Packages
              </h2>
              <h3 className="text-4xl font-bold text-brand-purple mb-6">
                Choose Your Google Ads Package
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional Google Ads management designed to maximize your return on investment. All packages include setup, optimization, and detailed reporting.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPackages.map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className={`relative flex flex-col h-full ${
                    pkg.popular 
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
                      <span className="text-4xl font-bold text-brand-coral">{pkg.price}</span>
                      <span className="text-gray-600">{pkg.period}</span>
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
                      <div className="space-y-6">
                        <Button 
                          className={`w-full py-6 px-8 font-bold text-lg transition-all duration-300 ${
                            pkg.popular 
                              ? 'bg-brand-coral hover:bg-brand-coral/90 text-white' 
                              : 'bg-brand-purple hover:bg-brand-purple/90 text-white'
                          }`}
                        >
                          {pkg.id === 1 ? 'Start Google Ads Campaign' : pkg.id === 2 ? 'Launch Growth Campaign' : 'Begin Premium Management'}
                          <Gift className="w-5 h-5 ml-3" />
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="w-full py-5 px-8 font-semibold text-lg border-3 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-all duration-300"
                          asChild
                        >
                          <Link href="/pricing-calculator">
                            View Google Ads Details
                            <ArrowRight className="w-5 h-5 ml-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Managing large ad spends? Contact us for enterprise-level Google Ads management.
              </p>
              <Button 
                variant="outline" 
                className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                onClick={() => window.open("https://calendly.com/vignesh-velusamy/30min", "_blank")}
              >
                Contact Us for Enterprise Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Google Ads Tips That Drive ROI</h2>
            <p className="text-xl mb-8 text-white/90">Get expert tips, campaign strategies, and real case studies to boost your ROI—delivered straight to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral"
                onClick={() => window.open('/newsletter', '_blank')}
              >
                Subscribe Free
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}