import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FreeSEOAudit } from "@/components/free-seo-audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Smartphone,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";

const benefits = [
  {
    icon: Search,
    title: "Complete SEO Analysis",
    description: "Get a comprehensive audit of your website's SEO performance, including technical issues and optimization opportunities."
  },
  {
    icon: TrendingUp,
    title: "Performance Insights",
    description: "Understand your site's page speed, mobile compatibility, and overall user experience metrics."
  },
  {
    icon: Shield,
    title: "Security Assessment",
    description: "Check your website's security features, HTTPS implementation, and potential vulnerabilities."
  },
  {
    icon: Smartphone,
    title: "Mobile Optimization",
    description: "Ensure your website performs perfectly on mobile devices and meets Google's mobile-first indexing requirements."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechFlow Agency",
    content: "The SEO audit revealed critical issues we didn't know existed. After implementing their recommendations, our organic traffic increased by 180% in 3 months.",
    rating: 5
  },
  {
    name: "Mike Chen",
    company: "Digital Dynamics",
    content: "BrandingBeez's audit was incredibly detailed and actionable. The recommendations were easy to understand and implement.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    company: "Growth Marketing Co.",
    content: "Best free SEO audit I've ever received. The insights helped us improve our search rankings significantly.",
    rating: 5
  }
];

export default function SEOAudit() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main className="pt-16 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-green-100 text-green-800 mb-6">
              ✨ 100% Free • No Credit Card Required
            </Badge>
            <h1 className="text-5xl font-bold text-brand-purple mb-6">
              Free SEO Audit & Analysis
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get a comprehensive analysis of your website's SEO performance. 
              Discover optimization opportunities and receive actionable recommendations to improve your search rankings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Instant results in 3 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Detailed performance metrics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Actionable recommendations</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Audit Form */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <FreeSEOAudit />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                What You'll Discover
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our comprehensive SEO audit covers all critical aspects of your website's search engine optimization performance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center  ">
                    <CardHeader>
                      <div className="w-16 h-16 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-brand-coral" />
                      </div>
                      <CardTitle className="text-lg font-bold text-brand-purple">
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Trusted by 500+ Businesses
              </h2>
              <p className="text-gray-600">See what our clients say about our SEO audits</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className=" ">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                    <div className="font-semibold text-brand-purple">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Boost Your SEO?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Don't let SEO issues hold back your website's potential. Get your free audit today and start improving your search rankings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-coral hover:bg-gray-100 hover:text-brand-coral">
                Get Your Free Audit Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-coral">
                View SEO Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}