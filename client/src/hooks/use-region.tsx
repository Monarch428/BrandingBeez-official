import { useState, useEffect } from "react";

export type Region = "US" | "UK" | "DE";

export interface RegionConfig {
  code: Region;
  flag: string;
  name: string;
  timezone: string;
  calendlyUrl: string;
  phone: string;
  email: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  ctaButton: string;
  downloadButton: string;
  servicesTitle: string;
  caseStudiesTitle: string;
  contactFormTitle: string;
  contactFormSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  uniqueValue?: string;
}

const regionConfigs: Record<Region, RegionConfig> = {
  US: {
    code: "US",
    flag: "🇺🇸",
    name: "United States",
    timezone: "America/New_York",
    calendlyUrl: import.meta.env.VITE_CALENDLY_US_URL || "https://calendly.com/vignesh-velusamy/30min",
    phone: "+91 99524 62833",
    email: "info@brandingbeez.com",
    heroTitle: "Scale Your US Agency with White-Label Excellence",
    heroSubtitle: "Premium design, development, SEO, and AI solutions delivered to your US clients under your brand. Focus on growth while we handle delivery.",
    heroTagline: "🚀 Premium white-label services • 🎯 US market expertise • ⚡ Lightning-fast turnaround",
    ctaButton: "Book Free Strategy Call",
    downloadButton: "Download Pricing Guide",
    servicesTitle: "Complete White-Label Solutions for US Agencies",
    caseStudiesTitle: "Success Stories That Inspire",
    contactFormTitle: "Ready to Scale Your US Agency?",
    contactFormSubtitle: "Let's discuss how our white-label services can accelerate your growth",
    seoTitle: "White-Label Digital Agency Services - Scale Your US Business",
    seoDescription: "Professional white-label design, development, SEO, and AI services for US agencies. Trusted by 500+ businesses nationwide."
  },
  UK: {
    code: "UK",
    flag: "🇬🇧",
    name: "United Kingdom",
    timezone: "Europe/London",
    calendlyUrl: import.meta.env.VITE_CALENDLY_UK_URL || "https://calendly.com/vignesh-velusamy/30min",
    phone: "+44 20 3807 6174",
    email: "info@brandingbeez.co.uk",
    heroTitle: "Elevate Your UK Agency with Premium White-Label Services",
    heroSubtitle: "Brilliant design, development, SEO, and AI solutions delivered to your UK clients under your brand. Impress your clients whilst you focus on building your business.",
    heroTagline: "✨ Premium white-label solutions • 🎯 UK market expertise • ⚡ Rapid delivery",
    ctaButton: "Book Free Consultation",
    downloadButton: "Download Service Guide",
    servicesTitle: "Comprehensive White-Label Solutions for UK Agencies",
    caseStudiesTitle: "Remarkable Success Stories",
    contactFormTitle: "Ready to Elevate Your UK Agency?",
    contactFormSubtitle: "Let's chat about how our white-label services can accelerate your growth",
    seoTitle: "Premium White-Label Digital Services - UK Agency Growth",
    seoDescription: "Brilliant white-label design, development, SEO, and AI solutions for UK agencies. Trusted by leading British businesses."
  },
  DE: {
    code: "DE",
    flag: "🇩🇪",
    name: "Deutschland",
    timezone: "Europe/Berlin",
    calendlyUrl: import.meta.env.VITE_CALENDLY_DE_URL || "https://calendly.com/vignesh-velusamy/30min",
    phone: "+49 30 5557 4821",
    email: "hello@brandingbeez.de",
    heroTitle: "Premium White-Label Services für deutsche Agenturen",
    heroSubtitle: "Erstklassiges Design, Entwicklung, SEO und KI-Lösungen für Ihre deutschen Kunden unter Ihrer Marke. Deutsche Qualität, globale Effizienz.",
    heroTagline: "🏆 Premium White-Label Services • 💰 Wettbewerbsfähige Preise • ⚡ Schnelle Lieferung",
    ctaButton: "Kostenlose Beratung buchen",
    downloadButton: "Preisliste herunterladen",
    servicesTitle: "Komplette White-Label Lösungen für deutsche Agenturen",
    caseStudiesTitle: "Erfolgsgeschichten unserer Kunden",
    contactFormTitle: "Bereit für deutschen Qualitätsstandard?",
    contactFormSubtitle: "Lassen Sie uns besprechen, wie unsere White-Label Services Ihr Wachstum beschleunigen können",
    seoTitle: "Premium White-Label Services für deutsche Agenturen",
    seoDescription: "Erstklassige White-Label Design, Entwicklung, SEO und KI-Lösungen für deutsche Agenturen. Vertraut von führenden deutschen Unternehmen.",
    uniqueValue: "Premium White-Label Services für deutsche Agenturen"
  }
};

export function useRegion() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("US");
  
  useEffect(() => {
    // Try to detect user's region based on timezone or localStorage
    const savedRegion = localStorage.getItem("brandingbeez-region") as Region;
    if (savedRegion && regionConfigs[savedRegion]) {
      setSelectedRegion(savedRegion);
    } else {
      // Simple timezone-based detection
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes("Europe/London") || timezone.includes("Europe/Dublin")) {
        setSelectedRegion("UK");
      } else if (timezone.includes("Europe/Berlin") || timezone.includes("Europe/")) {
        setSelectedRegion("DE");
      } else {
        setSelectedRegion("US");
      }
    }
  }, []);
  
  const changeRegion = (region: Region) => {
    setSelectedRegion(region);
    localStorage.setItem("brandingbeez-region", region);
  };
  
  return {
    selectedRegion,
    changeRegion,
    regionConfig: regionConfigs[selectedRegion],
    allRegions: Object.values(regionConfigs)
  };
}
