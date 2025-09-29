import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  TrendingUp, 
  ShoppingCart,
  Smartphone,
  CheckCircle
} from "lucide-react";

export default function WebDevelopmentEcommerceCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              Case Study: E-commerce Development
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Urban Style Boutique: 340% Revenue Growth
            </h1>
            <p className="text-xl text-white/90 mb-8">
              How we transformed a struggling fashion boutique into a thriving online empire with custom e-commerce development
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">340%</div>
                <div className="text-sm text-white/80">Revenue Growth</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">$2.8M</div>
                <div className="text-sm text-white/80">Annual Sales</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">185%</div>
                <div className="text-sm text-white/80">Mobile Traffic</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">45 Days</div>
                <div className="text-sm text-white/80">Development Time</div>
              </div>
            </div>

            <Button size="lg" className="bg-white text-brand-purple hite/90">
              Start Your E-commerce Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Challenge & Solution */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-brand-purple mb-6">The Challenge</h2>
                <p className="text-gray-600 mb-6">
                  Urban Style Boutique had an outdated e-commerce platform with poor mobile performance, 
                  manual inventory management, and limited growth capabilities. Mobile traffic was 78% 
                  but conversion was only 0.8%.
                </p>
                <h3 className="text-xl font-bold text-brand-purple mb-4">Our Solution</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Custom Shopify Plus development with mobile-first design</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Automated inventory management system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Technical SEO optimization and performance improvements</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">340%</div>
                    <div className="text-gray-600">Revenue Growth</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Smartphone className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">4.2%</div>
                    <div className="text-gray-600">Mobile Conversion</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <ShoppingCart className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">0</div>
                    <div className="text-gray-600">Overselling Issues</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                    <div className="text-2xl font-bold text-brand-purple mb-2">45</div>
                    <div className="text-gray-600">Day Timeline</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial & CTA */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl font-medium text-gray-900 mb-8">
              "BrandingBeez transformed our business. Our revenue tripled and we're now expanding internationally."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="text-left">
                <div className="font-semibold text-brand-purple">Sarah Mitchell</div>
                <div className="text-gray-600">CEO, Urban Style Boutique</div>
              </div>
            </div>
            <Button size="lg" className="bg-brand-purple rand-purple/90 text-white">
              Start Your E-commerce Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}