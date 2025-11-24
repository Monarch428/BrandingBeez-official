import { Card, CardContent } from "@/components/ui/card";
import { useRegion } from "@/hooks/use-region";
import { 
  Bot, 
  Brain, 
  Cog, 
  Palette, 
  Users, 
  Search, 
  Megaphone, 
  Globe 
} from "lucide-react";



const getLocalizedServices = (regionCode: string) => [
  {
    icon: Bot,
    title: regionCode === 'DE' ? "KI-Agenten Entwicklung" : "AI Agents Development",
    description: regionCode === 'DE' 
      ? "Maßgeschneiderte KI-Agenten und Chatbots zur Automatisierung von Kundeninteraktionen und Geschäftsprozessen."
      : "Custom AI agents and chatbots that automate customer interactions and streamline business processes."
  },
  {
    icon: Brain,
    title: regionCode === 'DE' ? "KI-gestützte Tools & Software" : "AI-Powered Tools & Software",
    description: regionCode === 'DE'
      ? "Intelligente Software-Lösungen mit maschinellem Lernen zur Steigerung der Produktivität und Entscheidungsfindung."
      : "Intelligent software solutions powered by machine learning to enhance productivity and decision-making."
  },
  {
    icon: Cog,
    title: regionCode === 'DE' ? "N8N Automatisierungslösungen" : "N8N Automation Solutions",
    description: regionCode === 'DE'
      ? "Workflow-Automatisierung und Integrationslösungen zur Verbindung Ihrer Tools und Optimierung der Abläufe."
      : "Workflow automation and integration solutions to connect your tools and streamline operations."
  },
  {
    icon: Palette,
    title: regionCode === 'DE' ? "Markenidentität" : "Branding",
    description: regionCode === 'DE'
      ? "Komplette Markenidentitätsentwicklung einschließlich Logos, Richtlinien und visueller Assets für Ihre Kunden."
      : "Complete brand identity development including logos, guidelines, and visual assets for your clients."
  },
  {
    icon: Users,
    title: regionCode === 'DE' ? "Dedizierte Ressourcen" : "Dedicated Resources",
    description: regionCode === 'DE'
      ? "Grafikdesigner, Webdesigner, Videobearbeiter, SEO-Spezialisten, Entwickler und persönliche Assistenten."
      : "Graphic designers, web designers, video editors, SEO specialists, developers, and personal assistants."
  },
  {
    icon: Search,
    title: "SEO",
    description: regionCode === 'DE'
      ? "Komplette Suchmaschinenoptimierung einschließlich technischer SEO, Content-Strategie und Linkaufbau."
      : "Complete search engine optimization services including technical SEO, content strategy, and link building."
  },
  {
    icon: Megaphone,
    title: "Google Ads",
    description: regionCode === 'DE'
      ? "Umfassendes Google Ads Management einschließlich Kampagnen-Setup, Optimierung und Performance-Tracking."
      : "Comprehensive Google Ads management including campaign setup, optimization, and performance tracking."
  },
  {
    icon: Globe,
    title: regionCode === 'DE' ? "Websites" : "Websites",
    description: regionCode === 'DE'
      ? "WordPress, Shopify, WooCommerce, BigCommerce & vollständige Custom-Development-Lösungen."
      : "WordPress, Shopify, WooCommerce, BigCommerce & full-stack custom development solutions."
  }
];

export function ServicesGrid() {
  const { regionConfig } = useRegion();
  const localizedServices = getLocalizedServices(regionConfig.code);
  
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-brand-wings/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {regionConfig.servicesTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {regionConfig.code === 'DE' 
              ? "Alles was Ihre Agentur zum Skalieren braucht, geliefert unter Ihrer Marke mit nahtloser Integration."
              : regionConfig.code === 'UK'
              ? "Everything your agency needs to scale, delivered under your brand with seamless integration."
              : "Everything your agency needs to scale, delivered under your brand with seamless integration."
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {localizedServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-brand-coral to-brand-purple rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <IconComponent className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
