import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";

const getLocalizedCaseStudies = (regionCode: string) => [
  {
    industry: regionCode === 'DE' ? "E-Commerce" : "E-commerce",
    title: regionCode === 'DE' ? "Digital Marketing Agentur" : "Digital Marketing Agency",
    challenge: regionCode === 'DE' 
      ? "Benötigte Skalierung der E-Commerce-Entwicklungsdienstleistungen ohne interne Entwickler einzustellen."
      : "Needed to scale e-commerce development services without hiring in-house developers.",
    solution: regionCode === 'DE'
      ? "White-Label Shopify-Entwicklung und SEO-Optimierungsdienstleistungen."
      : "White-label Shopify development and SEO optimization services.",
    results: [
      { label: regionCode === 'DE' ? "+150% Umsatz" : "+150% Revenue", type: "success" },
      { label: regionCode === 'DE' ? "12 Neue Kunden" : "12 New Clients", type: "info" }
    ]
  },
  {
    industry: regionCode === 'DE' ? "Technologie" : "Technology",
    title: regionCode === 'DE' ? "Tech-Beratungsunternehmen" : "Tech Consulting Firm",
    challenge: regionCode === 'DE'
      ? "Kunden verlangten KI-Automatisierungslösungen jenseits ihrer Expertise."
      : "Clients demanded AI automation solutions beyond their expertise.",
    solution: regionCode === 'DE'
      ? "KI-Agenten-Entwicklung und N8N-Automatisierungsimplementierung."
      : "AI agents development and N8N automation implementation.",
    results: [
      { label: regionCode === 'DE' ? "8 KI-Projekte" : "8 AI Projects", type: "success" },
      { label: regionCode === 'DE' ? "€180K Umsatz" : "$200K Revenue", type: "info" }
    ]
  },
  {
    industry: regionCode === 'DE' ? "Gesundheitswesen" : "Healthcare",
    title: regionCode === 'DE' ? "Healthcare Marketing Agentur" : "Healthcare Marketing Agency",
    challenge: regionCode === 'DE'
      ? "Überwältigt mit Design-Anfragen und Google Ads Management."
      : "Overwhelmed with design requests and Google Ads management.",
    solution: regionCode === 'DE'
      ? "Dediziertes Design-Team und Google Ads Spezialisten."
      : "Dedicated design team and Google Ads specialists.",
    results: [
      { label: regionCode === 'DE' ? "50% Zeit gespart" : "50% Time Saved", type: "success" },
      { label: "+85% ROAS", type: "info" }
    ]
  }
];

export function CaseStudies() {
  const { regionConfig } = useRegion();

  return (
    <section id="case-studies" className="py-20 bg-gradient-to-br from-white to-brand-wings/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {regionConfig.caseStudiesTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {regionConfig.code === 'DE' 
              ? "Echte Ergebnisse von Agenturen, die uns vertrauen, außergewöhnliche Arbeit unter ihrer Marke zu liefern."
              : "Real results from agencies that trust us to deliver exceptional work under their brand."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getLocalizedCaseStudies(regionConfig.code).map((study, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-gradient-to-r from-brand-coral to-brand-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                    {study.industry}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">{study.title}</h3>

                <div className="space-y-4 mb-6 flex-grow">
                  <div>
                    <h4 className="font-medium text-brand-purple mb-1">
                      {regionConfig.code === 'DE' ? 'Herausforderung' : 'Challenge'}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{study.challenge}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-brand-purple mb-1">
                      {regionConfig.code === 'DE' ? 'Lösung' : 'Solution'}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{study.solution}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-brand-purple mb-2">
                      {regionConfig.code === 'DE' ? 'Ergebnisse' : 'Results'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {study.results.map((result, resultIndex) => (
                        <Badge 
                          key={resultIndex}
                          className={result.type === 'success' 
                            ? 'bg-brand-yellow text-brand-purple' 
                            : 'bg-brand-coral text-white'
                          }
                        >
                          {result.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}