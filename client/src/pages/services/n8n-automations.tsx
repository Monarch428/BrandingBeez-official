
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Zap,
  Mail,
  Users,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Clock,
  Building,
  Workflow,
  Bot,
  Settings,
  TrendingUp
} from "lucide-react";

export default function N8NAutomations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SEOHead 
        title="N8N Automation Services - Coming Soon | BrandingBeez"
        description="Advanced N8N automation services for streamlining business workflows. HR workflows, email automation, marketing workflows, and chatbot solutions coming soon."
        keywords="N8N automation, workflow automation, business process automation, email workflows, HR automation"
        canonicalUrl="https://brandingbeez.com/services/n8n-automations"
        ogType="service"
      />
      <SchemaMarkup type="service" data={{
        name: "N8N Automation Services",
        description: "Advanced workflow automation using N8N to streamline business processes and increase efficiency.",
        serviceType: "Business Process Automation"
      }} />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              🚀 Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              N8N Automation Services
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Streamline your operations with intelligent automation solutions. From HR workflows to marketing automation, we're preparing comprehensive N8N services to transform your business processes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-brand-purple hover:bg-gray-100"
                onClick={() => window.open("https://calendly.com/vignesh-velusamy/30min", "_blank")}
              >
                Get Early Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-purple"
                asChild
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Coming Soon Services */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                Automation Services in Development
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're building comprehensive automation solutions to help businesses streamline their workflows and increase efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-purple">HR Workflows</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Automate onboarding, performance reviews, and employee lifecycle management
                  </p>
                  <Badge className="mt-4 bg-yellow-100 text-yellow-800">
                    In Development
                  </Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Mail className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-purple">Email Workflows</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Intelligent email automation, follow-ups, and customer journey management
                  </p>
                  <Badge className="mt-4 bg-yellow-100 text-yellow-800">
                    In Development
                  </Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-purple">Marketing Workflows</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Lead nurturing, social media automation, and campaign management
                  </p>
                  <Badge className="mt-4 bg-yellow-100 text-yellow-800">
                    In Development
                  </Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-purple">Chatbot Workflows</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Intelligent customer support bots and automated response systems
                  </p>
                  <Badge className="mt-4 bg-yellow-100 text-yellow-800">
                    In Development
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Early Access Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-brand-purple mb-4">
              Be Among the First
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our early access list to be notified when N8N automation services launch. Get special pricing and priority onboarding.
            </p>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-brand-coral mx-auto mb-2" />
                  <h3 className="font-bold text-brand-purple">Early Access</h3>
                  <p className="text-gray-600 text-sm">Priority onboarding when we launch</p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-brand-coral mx-auto mb-2" />
                  <h3 className="font-bold text-brand-purple">Special Pricing</h3>
                  <p className="text-gray-600 text-sm">Exclusive discounts for early adopters</p>
                </div>
                <div className="text-center">
                  <Settings className="w-8 h-8 text-brand-coral mx-auto mb-2" />
                  <h3 className="font-bold text-brand-purple">Custom Solutions</h3>
                  <p className="text-gray-600 text-sm">Tailored automation for your needs</p>
                </div>
              </div>
              
              <Button
                size="lg"
                className="bg-brand-coral hover:bg-brand-coral/90 text-white"
                onClick={() => window.open("https://calendly.com/vignesh-velusamy/30min", "_blank")}
              >
                Join Early Access List
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated on Automation Trends</h2>
            <p className="text-xl mb-8 text-white/90">
              Get expert tips on business automation, workflow optimization, and AI integration delivered to your inbox.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-brand-coral hover:bg-gray-100"
              onClick={() => window.open('https://zcmp.in/JzHy', '_blank')}
            >
              Subscribe for Updates
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
