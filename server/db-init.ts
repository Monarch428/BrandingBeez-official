import { connectToDatabase } from "./db";
import { storage } from "./storage";
import { ServicePageModel } from "./models";
import type {
  InsertCaseStudy,
  InsertCoupon,
  InsertFeaturedClient,
  InsertPricingPackage,
  InsertServicePage,
} from "@shared/schema";

export async function initializeDatabase() {
  try {
    await connectToDatabase();
    console.log("Initializing database with sample data...");

    const existingServicePages = await ServicePageModel.countDocuments();
    if (existingServicePages > 0) {
      console.log("Database already initialized, skipping...");
      return;
    }

    const couponData: InsertCoupon[] = [
      {
        code: "SEO50OFF",
        description: "50% OFF First Month of SEO Services",
        discountPercentage: 50,
        maxUses: null,
        isActive: true,
      },
      {
        code: "WEB50OFF",
        description: "50% OFF First Website Development Project",
        discountPercentage: 50,
        maxUses: null,
        isActive: true,
      },
      {
        code: "ADSFREE",
        description: "Free Google Ads Setup for First-Time Customers",
        discountPercentage: 100,
        maxUses: null,
        isActive: true,
      },
      {
        code: "TEAM30OFF",
        description: "30% OFF First Month of Dedicated Resources",
        discountPercentage: 30,
        maxUses: null,
        isActive: true,
      },
      {
        code: "AUTO25OFF",
        description: "25% OFF First N8N Automation Project",
        discountPercentage: 25,
        maxUses: null,
        isActive: true,
      },
      {
        code: "AI25OFF",
        description: "25% OFF First AI Agent or Software Building Project",
        discountPercentage: 25,
        maxUses: null,
        isActive: true,
      },
    ];

    for (const coupon of couponData) {
      await storage.createCoupon(coupon);
    }

    const servicePageData: InsertServicePage[] = [
      {
        slug: "seo",
        title: "SEO Services",
        subtitle: "Professional SEO services to boost your rankings",
        description: "Comprehensive SEO solutions for businesses",
        heroTitle: "Dominate Search Results",
        heroSubtitle: "Get more organic traffic with our proven SEO strategies",
        auditFormType: "seo",
        isActive: true,
      },
      {
        slug: "web-development",
        title: "Web Development",
        subtitle: "Custom websites that convert",
        description: "Professional web development services",
        heroTitle: "Beautiful, Fast Websites",
        heroSubtitle: "Custom web development that drives results",
        auditFormType: "website",
        isActive: true,
      },
      {
        slug: "google-ads",
        title: "Google Ads Management",
        subtitle: "PPC campaigns that deliver ROI",
        description: "Professional Google Ads management",
        heroTitle: "Maximize Your Ad Spend",
        heroSubtitle: "Get more leads with optimized Google Ads campaigns",
        auditFormType: "ads",
        isActive: true,
      },
      {
        slug: "ai-development",
        title: "AI Development",
        subtitle: "Custom AI solutions for your business",
        description: "AI agents and automation solutions",
        heroTitle: "Transform Your Business with AI",
        heroSubtitle: "Custom AI development and automation services",
        auditFormType: "automation",
        isActive: true,
      },
      {
        slug: "dedicated-resources",
        title: "Dedicated Resources",
        subtitle: "Your offshore development team",
        description: "Dedicated developers and specialists",
        heroTitle: "Scale Your Team",
        heroSubtitle: "Access top talent with our dedicated resources",
        auditFormType: "calculator",
        isActive: true,
      },
    ];

    for (const page of servicePageData) {
      await storage.createServicePage(page);
    }

    const featuredClientData: InsertFeaturedClient[] = [
      {
        servicePage: "seo",
        name: "Atlantic Foundation",
        logo: "/images/atlantic-foundation-logo.jpg",
        description: "BrandingBeez transformed our online presence completely",
        achievements: ["122 #1 rankings", "+49% traffic increase", "121% more leads"],
        industry: "Construction",
        timeframe: "6 months",
        isActive: true,
      },
      {
        servicePage: "google-ads",
        name: "Arlingsworth Solicitors",
        logo: "/images/arlingsworth-logo.jpg",
        description: "Exceptional Google Ads management with outstanding results",
        achievements: ["£6.51 lowest CPA", "18.95% conversion rate", "1,139+ total clicks"],
        industry: "Legal Services",
        timeframe: "3 months",
        isActive: true,
      },
      {
        servicePage: "web-development",
        name: "Social Land",
        logo: "/images/socialland-logo.jpeg",
        description: "Professional web development that exceeded our expectations",
        achievements: ["+85% faster performance", "10,000+ active users", "+200% engagement"],
        industry: "Social Media Platform",
        timeframe: "4 months",
        isActive: true,
      },
    ];

    for (const client of featuredClientData) {
      await storage.createFeaturedClient(client);
    }

    const pricingPackageData: InsertPricingPackage[] = [
      {
        servicePage: "seo",
        name: "Starter SEO",
        price: "$400/month",
        description: "Perfect for local businesses and startups",
        features: [
          "Basic audit + quick fixes",
          "10 primary keywords",
          "5 pages optimized",
          "Speed, mobile, meta fixes",
          "1 location GMB setup",
          "1 blog/month (1000 words)",
          "2 links/month (DA 30+)",
          "Basic competitor scan",
          "Monthly summary report",
        ],
        isPopular: false,
        orderIndex: 1,
        isActive: true,
      },
      {
        servicePage: "seo",
        name: "Growth SEO",
        price: "$650/month",
        description: "Ideal for growing companies",
        features: [
          "Full technical + on-page audit",
          "25 keywords + search intent grouping",
          "10 pages optimized",
          "Schema, redirects, crawl fixes",
          "3 locations + citation submission",
          "2 blogs/month (1000-1200 words)",
          "5 links/month (DA 40+)",
          "Deep 5-competitor analysis",
          "Monthly report + call",
        ],
        isPopular: true,
        orderIndex: 2,
        isActive: true,
      },
      {
        servicePage: "seo",
        name: "Pro SEO",
        price: "$1,200/month",
        description: "For e-commerce and enterprise websites",
        features: [
          "Deep crawl + custom technical plan",
          "50+ keywords + intent segmentation",
          "20 pages + conversion tracking",
          "Core Web Vitals, JavaScript SEO",
          "5+ locations, review strategy",
          "4 blogs/month (1500+ words)",
          "10 links/month (DA 50+)",
          "Full landscape + quarterly reports",
          "Dashboard + bi-weekly strategy calls",
        ],
        isPopular: false,
        orderIndex: 3,
        isActive: true,
      },
    ];

    for (const pkg of pricingPackageData) {
      await storage.createPricingPackage(pkg);
    }

    const caseStudyData: InsertCaseStudy[] = [
      {
        servicePage: "seo",
        title: "Atlantic Foundation Success",
        client: "Atlantic Foundation & Crawl Space Repair",
        industry: "Construction",
        results: {
          traffic: "+49%",
          keywords: "122 #1 rankings",
          revenue: "121% more leads",
        },
        description:
          "Transformed a local construction company's SEO from score 69 to 100 and dramatically increased lead generation.",
        imageUrl: "/images/seo-case-1.jpg",
        isActive: true,
      },
      {
        servicePage: "google-ads",
        title: "UK Legal Services Excellence",
        client: "Arlingsworth Solicitors",
        industry: "Legal Services",
        results: {
          cpa: "£6.51 lowest CPA",
          conversionRate: "18.95% conversion rate",
          clicks: "1,139+ total clicks",
        },
        description:
          "Achieved exceptional results for UK family law firm with Performance Max and Search campaigns optimization.",
        imageUrl: "/images/google-ads-case-1.jpg",
        isActive: true,
      },
      {
        servicePage: "web-development",
        title: "Social Land Platform",
        client: "Social Land",
        industry: "Social Media Platform",
        results: {
          performance: "+85% faster",
          users: "10,000+ active users",
          engagement: "+200% engagement",
        },
        description:
          "Built a comprehensive social media platform with real-time features and scalable architecture.",
        imageUrl: "/images/web-case-2.jpg",
        isActive: true,
      },
    ];

    for (const study of caseStudyData) {
      await storage.createCaseStudy(study);
    }

    console.log("Database initialized successfully with sample data!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
