import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SchemaMarkup } from "@/components/schema-markup";
import { SEOHead } from "@/components/seo-head";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactFormOptimized } from "@/components/contact-form-optimized";
import { useRegion } from "@/hooks/use-region";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Headphones,
  Users,
  Building,
  Calendar,
  ExternalLink
} from "lucide-react";

export default function Contact() {
  const { regionConfig } = useRegion();

  const openCalendly = () => {
    window.open('https://calendly.com/vignesh-velusamy/30min', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SEOHead 
        title="Contact BrandingBeez - Get Your Free Consultation | White-Label Agency Partner"
        description="Ready to scale your agency? Contact our global team for white-label digital services. Free consultation, UK/US/Germany offices. Get started today with professional white-label solutions."
        keywords="contact white label agency, free consultation, digital marketing partnership, white label services contact, agency scaling solutions"
        canonicalUrl="https://brandingbeez.com/contact"
        ogType="website"
      />
      <SchemaMarkup type="webpage" data={{
        title: "Contact BrandingBeez - Get Your Free Consultation",
        description: "Ready to scale your agency? Contact our global team for white-label digital services. Free consultation available.",
        url: "https://brandingbeez.com/contact",
        breadcrumbs: [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://brandingbeez.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact",
            "item": "https://brandingbeez.com/contact"
          }
        ]
      }} />

      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-purple mb-6">
              Contact Our {regionConfig.code === 'DE' ? 'Deutsche' : 'Global'} Team
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {regionConfig.code === 'DE' 
                ? 'Bereit für deutsche Qualität? Sprechen Sie mit unserem Team.'
                : 'Ready to scale your agency? Let\'s talk about your project.'}
            </p>

            <div className="flex justify-center">
              <Button 
                onClick={openCalendly}
                size="lg" 
                className="bg-brand-coral hover:bg-brand-coral/90 text-white"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {regionConfig.ctaButton}
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="text-center h-full">
                <CardContent className="p-8 h-full flex flex-col justify-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-xl text-brand-purple mb-3">
                    {regionConfig.code === 'DE' ? 'E-Mail' : 'Email'}
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">{regionConfig.email}</p>
                  <p className="text-sm text-gray-500">
                    {regionConfig.code === 'DE' 
                      ? 'Antwort innerhalb von 24 Stunden'
                      : 'Response within 24 hours'}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center h-full">
                <CardContent className="p-8 h-full flex flex-col justify-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-8 h-8 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-xl text-brand-purple mb-3">
                    {regionConfig.code === 'DE' ? 'Termin buchen' : 'Book Call'}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    {regionConfig.code === 'DE' 
                      ? 'Kostenloses Strategiegespräch'
                      : 'Free strategy consultation'}
                  </p>
                  <Button 
                    onClick={openCalendly}
                    size="lg"
                    className="bg-brand-coral hover:bg-brand-coral/90 text-white"
                  >
                    {regionConfig.code === 'DE' ? 'Jetzt buchen' : 'Book Now'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                {regionConfig.code === 'DE' ? 'Projekt starten' : 'Start Your Project Today'}
              </h2>
              <p className="text-xl text-gray-600">
                {regionConfig.code === 'DE' 
                  ? 'Erzählen Sie uns von Ihrem Projekt und wir melden uns innerhalb von 4 Stunden'
                  : 'Tell us about your project and we\'ll get back to you within 4 hours'}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ContactFormOptimized />
            </div>
          </div>
        </section>



        {/* Alternative Contact Methods */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {regionConfig.code === 'DE' ? 'Weitere Kontaktmöglichkeiten' : 'Other Ways to Reach Us'}
              </h2>
              <p className="text-xl text-white/90">
                {regionConfig.code === 'DE' 
                  ? 'Wählen Sie die Methode, die am besten zu Ihnen passt'
                  : 'Choose the method that works best for you'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {regionConfig.code === 'DE' ? 'Verkaufsanfragen' : 'Sales Inquiries'}
                  </h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <p><strong>Email:</strong> raje@brandingbeez.co.uk</p>
                    <p><strong>Phone:</strong> +91 99524 62833</p>
                    <p><strong>
                      {regionConfig.code === 'DE' ? 'Ideal für:' : 'Best for:'}
                    </strong> {regionConfig.code === 'DE' ? 'Neue Projekte, Preisfragen' : 'New project discussions, pricing questions'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {regionConfig.code === 'DE' ? 'Karriere' : 'Careers'}
                  </h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <p><strong>Email:</strong> hr@brandingbeez.co.uk</p>
                    <p><strong>Phone:</strong> +91 99524 62833</p>
                    <p><strong>
                      {regionConfig.code === 'DE' ? 'Ideal für:' : 'Best for:'}
                    </strong> {regionConfig.code === 'DE' ? 'Stellenbewerbungen' : 'Job applications & career opportunities'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {regionConfig.code === 'DE' ? 'Partnerschaften' : 'Partnerships'}
                  </h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <p><strong>Email:</strong> info@brandingbeez.co.uk</p>
                    <p><strong>Phone:</strong> +91 99524 62833</p>
                    <p><strong>
                      {regionConfig.code === 'DE' ? 'Ideal für:' : 'Best for:'}
                    </strong> {regionConfig.code === 'DE' ? 'Agentur-Partnerschaften' : 'Agency partnerships'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}