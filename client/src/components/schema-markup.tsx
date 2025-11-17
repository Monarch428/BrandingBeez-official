import { useEffect } from 'react';

interface LocalBusinessSchema {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
  sameAs: string[];
  priceRange: string;
  paymentAccepted: string[];
  currenciesAccepted: string[];
  areaServed: string[];
}

interface ServiceSchema {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  serviceType: string;
  areaServed: string[];
  hasOfferCatalog: {
    name: string;
    itemListElement: Array<{
      name: string;
      description: string;
      url: string;
    }>;
  };
}

interface SchemaMarkupProps {
  type: 'localBusiness' | 'service' | 'webpage' | 'organization';
  data?: any;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  useEffect(() => {
    let schema: any = {};

    switch (type) {
      case 'localBusiness':
        schema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "BrandingBeez",
          "description": "White-label digital marketing agency providing SEO, web development, Google Ads, and AI solutions to agencies worldwide.",
          "url": "https://brandingbeez.com",
          "telephone": "+44-20-8144-6811",
          "email": "info@brandingbeez.co.uk",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Vintage House, 37 Albert Embankment",
            "addressLocality": "London",
            "addressRegion": "England",
            "postalCode": "SE1 7TL",
            "addressCountry": "GB"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 51.4944,
            "longitude": -0.1219
          },
          "openingHours": [
            "Mo-Fr 09:00-18:00"
          ],
          "sameAs": [
            "https://www.linkedin.com/company/brandingbeez",
            "https://www.instagram.com/brandingbeez",
            "https://www.facebook.com/brandingbeez"
          ],
          "priceRange": "$$",
          "paymentAccepted": ["Credit Card", "Debit Card", "Bank Transfer"],
          "currenciesAccepted": ["GBP", "USD", "EUR"],
          "areaServed": [
            {
              "@type": "Country",
              "name": "United Kingdom"
            },
            {
              "@type": "Country", 
              "name": "United States"
            },
            {
              "@type": "Country",
              "name": "Germany"
            }
          ],
          "serviceType": "Digital Marketing Agency",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "White-Label Digital Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "SEO Services",
                  "description": "Comprehensive search engine optimization including technical SEO, content optimization, and link building."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Google Ads Management",
                  "description": "Performance-focused Google Ads campaigns with conversion optimization and reporting."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Website Development",
                  "description": "Custom website development on WordPress, Shopify, and custom platforms."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Dedicated Resources",
                  "description": "Skilled professionals including developers, designers, and marketers working exclusively for your agency."
                }
              }
            ]
          },
          ...data
        };
        break;

      case 'service':
        schema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Digital Marketing Services",
          "provider": {
            "@type": "Organization",
            "name": "BrandingBeez",
            "url": "https://brandingbeez.com"
          },
          "areaServed": [
            {
              "@type": "Country",
              "name": "United Kingdom"
            },
            {
              "@type": "Country",
              "name": "United States"
            },
            {
              "@type": "Country",
              "name": "Germany"
            }
          ],
          ...data
        };
        break;

      case 'organization':
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BrandingBeez",
          "alternateName": "BrandingBeez Agency",
          "url": "https://brandingbeez.com",
          "logo": "https://brandingbeez.com/logo.png",
          "description": "Leading white-label digital marketing agency serving agencies across the US, UK, and Germany with comprehensive SEO, development, and marketing solutions.",
          "foundingDate": "2020",
          "founders": [
            {
              "@type": "Person",
              "name": "Vignesh Velusamy"
            }
          ],
          "numberOfEmployees": "50-100",
          "slogan": "Your White-Label Growth Engine",
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+44-20-8144-6811",
              "contactType": "customer service",
              "email": "info@brandingbeez.co.uk",
              "areaServed": ["GB", "US", "DE"],
              "availableLanguage": ["English", "German"]
            }
          ],
          "sameAs": [
            "https://www.linkedin.com/company/brandingbeez",
            "https://www.instagram.com/brandingbeez",
            "https://www.facebook.com/brandingbeez"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Vintage House, 37 Albert Embankment", 
            "addressLocality": "London",
            "addressRegion": "England",
            "postalCode": "SE1 7TL",
            "addressCountry": "GB"
          },
          ...data
        };
        break;

      case 'webpage':
        schema = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": data?.title || "BrandingBeez - White-Label Digital Marketing Agency",
          "description": data?.description || "Professional white-label digital marketing services for agencies",
          "url": data?.url || "https://brandingbeez.com",
          "isPartOf": {
            "@type": "WebSite",
            "name": "BrandingBeez",
            "url": "https://brandingbeez.com"
          },
          "breadcrumb": data?.breadcrumbs ? {
            "@type": "BreadcrumbList",
            "itemListElement": data.breadcrumbs
          } : undefined,
          ...data
        };
        break;
    }

    // Remove existing schema markup
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new schema markup
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

  }, [type, data]);

  return null;
}