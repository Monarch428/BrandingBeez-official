import { Button } from "@/components/ui/button";
import { useRegion } from "@/hooks/use-region";
import { Calendar, Download } from "lucide-react";



export function HeroSection() {
  const { regionConfig } = useRegion();

  const openCalendly = () => {
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: regionConfig.calendlyUrl });
    } else {
      window.open(regionConfig.calendlyUrl, '_blank');
    }
  };

  const downloadGuide = () => {
    // TODO: Implement service guide download
    const link = document.createElement('a');
    link.href = '/service-guide.pdf'; // This would be a real PDF file
    link.download = 'BrandingBeez-Service-Guide.pdf';
    link.click();
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-coral/5 overflow-hidden">
      {/* Optimized background elements */}
      <div className="absolute inset-0 gpu-accelerated">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-yellow/15 rounded-full reduce-blur animate-float optimize-animations"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-brand-coral/8 rounded-full reduce-blur animate-float optimize-animations" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-brand-purple/8 rounded-full reduce-blur animate-float optimize-animations" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative container mx-auto px-4 pt-1 sm:pt-6 md:pt-12 lg:pt-20 pb-4 sm:pb-6 md:pb-8 lg:pb-12">
        <div className="max-w-4xl mx-auto text-center">
          {regionConfig.uniqueValue && (
            <div className="inline-block bg-gradient-to-r from-brand-coral to-brand-purple text-white px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3 md:mb-4 lg:mb-6 shadow-lg gpu-accelerated">
              {regionConfig.uniqueValue}
            </div>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight">
            {regionConfig.heroTitle.split(' ').slice(0, -2).join(' ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-coral to-brand-purple"> {regionConfig.heroTitle.split(' ').slice(-2).join(' ')}</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed max-w-3xl mx-auto px-2 sm:px-4 md:px-0">
            {regionConfig.heroSubtitle}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-4 mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 text-brand-purple font-medium text-xs sm:text-sm md:text-base">
            {regionConfig.heroTagline.split(' • ').map((item, index) => (
              <span key={index} className="flex items-center">
                <span>{item}</span>
                {index < regionConfig.heroTagline.split(' • ').length - 1 && (
                  <span className="hidden md:block ml-4 text-brand-coral">•</span>
                )}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16 px-2 sm:px-4 md:px-0">
            <Button 
              onClick={openCalendly}
              size="lg" 
              className="bg-brand-coral hover:bg-brand-coral-dark text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-lg w-full sm:w-auto"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {regionConfig.ctaButton}
            </Button>
            <Button 
              onClick={downloadGuide}
              variant="outline" 
              size="lg"
              className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm sm:text-base md:text-lg w-full sm:w-auto"
            >
              <Download className="mr-2 h-5 w-5" />
              {regionConfig.downloadButton}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center px-4 sm:px-0">
            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-brand-coral/10">
              <div className="text-2xl sm:text-3xl font-bold text-brand-coral mb-1 sm:mb-2">25+</div>
              <div className="text-gray-600 text-sm sm:text-base">{regionConfig.code === 'DE' ? 'Partner-Agenturen' : 'Partner Agencies'}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-brand-purple/10">
              <div className="text-2xl sm:text-3xl font-bold text-brand-purple mb-1 sm:mb-2">85%</div>
              <div className="text-gray-600 text-sm sm:text-base">{regionConfig.code === 'DE' ? 'Kundenzufriedenheit' : 'Client Satisfaction'}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-brand-yellow/20">
              <div className="text-2xl sm:text-3xl font-bold text-brand-yellow-dark mb-1 sm:mb-2">24hr</div>
              <div className="text-gray-600 text-sm sm:text-base">{regionConfig.code === 'DE' ? 'Antwortzeit' : 'Response Time'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
