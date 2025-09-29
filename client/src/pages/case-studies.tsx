import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Code, Target, Zap } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudies() {
  const caseStudies = [
    {
      id: 1,
      image: "/attached_assets/img c1.png",
      industry: "Construction",
      client: "Atlantic Foundation",
      title: "Atlantic Foundation & Crawl Space Repair",
      description:
        "How we increased organic users by 49% and generated 121% more leads for a construction company through comprehensive local SEO strategy.",
      results: {
        "User Growth": "49%",
        "More Leads": "121%",
        "Time to Results": "6 months",
      },
      link: "/case-studies/seo-case-study",
    },
    {
      id: 2,
      image: "/attached_assets/img c2.png",
      industry: "Local Business",
      client: "By The Shore SCUBA Instruction",
      title: "By The Shore SCUBA Instruction",
      description:
        "How we increased organic users by 31% and generated 360% more phone inquiries for a local scuba training business through local SEO optimization.",
      results: {
        "User Growth": "31%",
        "Phone Clicks": "360%",
        "Time to Results": "6 months",
      },
      link: "/case-studies/scuba-diving-case-study",
    },
    {
      id: 3,
      image: "/images/case-studies/eco-style.webp",
      industry: "E-commerce",
      client: "EcoStyle Fashion",
      title: "EcoStyle Fashion",
      description:
        "Complete e-commerce transformation that boosted online sales by 285% for a sustainable fashion brand with custom React development.",
      results: {
        "Sales Increase": "285%",
        "Page Load Time": "3.2s",
        "Mobile Conversion": "67%",
      },
      link: "/case-studies/web-development",
    },
    {
      id: 4,
      image: "/images/case-studies/financeflow.webp",
      industry: "Financial Software",
      client: "FinanceFlow Pro",
      title: "FinanceFlow Pro",
      description:
        "Optimized Google Ads campaigns that reduced cost-per-acquisition by 60% and increased ROAS to 480% for a financial software company.",
      results: {
        "Lower CPA": "60%",
        "ROAS": "480%",
        "Optimization Time": "4 months",
      },
      link: "/case-studies/google-ads",
    },
    {
      id: 5,
      image: "/images/case-studies/medcare.webp",
      industry: "Healthcare",
      client: "MedCare Systems",
      title: "MedCare Systems",
      description:
        "Business process automation that saved 40 hours per week and reduced operational costs by $180K annually for a healthcare provider.",
      results: {
        "Time Saved/Week": "40hrs",
        "Annual Savings": "$180K",
        "Implementation": "6 weeks",
      },
      link: "/case-studies/dedicated-resources-fintech",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />

      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Success Stories
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Real results for real businesses. See how we've helped companies
                achieve their digital goals.
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study) => (
                  <Card
                    key={study.id}
                    className="group  border-gray-200 shadow-sm ransition-all duration-300 flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-48 object-cover group- ransform group-oup-scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group- opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {study.industry}
                        </Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{study.client}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group- ext-brand-purple transition-colors min-h-[3rem] flex items-center">
                        {study.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {study.description}
                      </p>

                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {Object.entries(study.results).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-sm font-bold text-brand-coral">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <Link href={study.link}>
                          <Button className="w-full h-11 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors">
                            View Case Study
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Let's discuss how we can help you achieve similar results for
                your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-brand-purple ray-100"
                >
                  <Link href="/contact">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-brand-purple hite/10"
                >
                  <Link href="/services">Explore Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}