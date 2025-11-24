import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ExternalLink, 
  ChevronRight, 
  Star,
  Clock,
  Users,
  TrendingUp,
  Target,
  Zap,
  Code,
  Search,
  BarChart3,
  Smartphone,
  Globe,
  Settings,
  CheckCircle
} from "lucide-react";

interface InternalLinkItem {
  title: string;
  href: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  isExternal?: boolean;
  priority?: "high" | "medium" | "low";
  metrics?: {
    readTime?: string;
    difficulty?: string;
    rating?: number;
  };
}

interface InternalLinkingProps {
  currentPage: string;
  showRelatedContent?: boolean;
  showServiceLinks?: boolean;
  showIndustryLinks?: boolean;
  showResourceLinks?: boolean;
  maxItems?: number;
  variant?: "sidebar" | "footer" | "inline" | "grid";
  className?: string;
}

const serviceLinks: InternalLinkItem[] = [
  {
    title: "SEO Services",
    href: "/services/seo",
    description: "Comprehensive SEO strategies to improve your search rankings",
    category: "Services",
    icon: <Search className="w-4 h-4" />,
    priority: "high",
    metrics: { readTime: "8 min", difficulty: "Intermediate", rating: 4.9 }
  },
  {
    title: "Web Development",
    href: "/services/web-development",
    description: "Custom websites and web applications built for performance",
    category: "Services",
    icon: <Code className="w-4 h-4" />,
    priority: "high",
    metrics: { readTime: "12 min", difficulty: "Advanced", rating: 4.8 }
  },
  {
    title: "Google Ads Management",
    href: "/services/google-ads",
    description: "Profitable PPC campaigns that drive qualified leads",
    category: "Services",
    icon: <Target className="w-4 h-4" />,
    priority: "high",
    metrics: { readTime: "6 min", difficulty: "Intermediate", rating: 4.9 }
  },
  {
    title: "Business Automation",
    href: "/services/ai-development",
    description: "Streamline operations and save time with smart automation",
    category: "Services",
    icon: <Zap className="w-4 h-4" />,
    priority: "high",
    metrics: { readTime: "10 min", difficulty: "Advanced", rating: 4.7 }
  },
  {
    title: "Mobile App Development",
    href: "/services/mobile-development",
    description: "Native and cross-platform mobile applications",
    category: "Services",
    icon: <Smartphone className="w-4 h-4" />,
    priority: "medium",
    metrics: { readTime: "15 min", difficulty: "Advanced", rating: 4.8 }
  },
  {
    title: "Digital Marketing",
    href: "/services/digital-marketing",
    description: "Complete digital marketing strategies for growth",
    category: "Services",
    icon: <TrendingUp className="w-4 h-4" />,
    priority: "medium",
    metrics: { readTime: "9 min", difficulty: "Intermediate", rating: 4.6 }
  }
];

const industryLinks: InternalLinkItem[] = [
  {
    title: "Digital Marketing Agencies",
    href: "/industries/digital-marketing-agencies",
    description: "White-label solutions for marketing agencies",
    category: "Industries",
    icon: <BarChart3 className="w-4 h-4" />,
    priority: "high",
    metrics: { readTime: "7 min", difficulty: "Beginner", rating: 4.8 }
  },
  {
    title: "E-commerce Businesses",
    href: "/industries/ecommerce",
    description: "Specialized services for online retailers",
    category: "Industries",
    icon: <Globe className="w-4 h-4" />,
    priority: "medium",
    metrics: { readTime: "11 min", difficulty: "Intermediate", rating: 4.7 }
  },
  {
    title: "SaaS Companies",
    href: "/industries/saas",
    description: "Growth strategies for software companies",
    category: "Industries",
    icon: <Settings className="w-4 h-4" />,
    priority: "medium",
    metrics: { readTime: "13 min", difficulty: "Advanced", rating: 4.9 }
  }
];

const resourceLinks: InternalLinkItem[] = [
  {
    title: "Case Studies",
    href: "/case-studies",
    description: "Real results from our client partnerships",
    category: "Resources",
    icon: <CheckCircle className="w-4 h-4" />,
    priority: "high",
    metrics: { readTime: "5 min", difficulty: "Beginner", rating: 4.9 }
  },
  {
    title: "About Our Team",
    href: "/about",
    description: "Meet the experts behind your success",
    category: "Resources",
    icon: <Users className="w-4 h-4" />,
    priority: "medium",
    metrics: { readTime: "4 min", difficulty: "Beginner", rating: 4.6 }
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch for your free consultation",
    category: "Resources",
    icon: <ExternalLink className="w-4 h-4" />,
    priority: "high",
    metrics: { readTime: "2 min", difficulty: "Beginner", rating: 4.8 }
  }
];

export function InternalLinkingOptimized({
  currentPage,
  showRelatedContent = true,
  showServiceLinks = true,
  showIndustryLinks = true,
  showResourceLinks = true,
  maxItems = 6,
  variant = "grid",
  className = ""
}: InternalLinkingProps) {
  
  const getAllLinks = (): InternalLinkItem[] => {
    let allLinks: InternalLinkItem[] = [];
    
    if (showServiceLinks) allLinks = [...allLinks, ...serviceLinks];
    if (showIndustryLinks) allLinks = [...allLinks, ...industryLinks];
    if (showResourceLinks) allLinks = [...allLinks, ...resourceLinks];
    
    // Filter out current page
    allLinks = allLinks.filter(link => link.href !== currentPage);
    
    // Sort by priority and rating
    allLinks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || 'medium'];
      const bPriority = priorityOrder[b.priority || 'medium'];
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      return (b.metrics?.rating || 0) - (a.metrics?.rating || 0);
    });
    
    return allLinks.slice(0, maxItems);
  };

  const getRelatedContent = (): InternalLinkItem[] => {
    // Smart related content based on current page
    const relatedMap: Record<string, string[]> = {
      "/services/seo": ["/services/web-development", "/services/google-ads", "/case-studies"],
      "/services/web-development": ["/services/seo", "/services/mobile-development", "/industries/ecommerce"],
      "/services/google-ads": ["/services/seo", "/services/digital-marketing", "/industries/digital-marketing-agencies"],
      "/services/ai-development": ["/services/web-development", "/services/dedicated-resources", "/about"],
      "/industries/digital-marketing-agencies": ["/services/seo", "/services/google-ads", "/services/digital-marketing"],
      "/": ["/services/seo", "/services/web-development", "/services/google-ads", "/case-studies"]
    };
    
    const relatedHrefs = relatedMap[currentPage] || [];
    const allLinks = getAllLinks();
    
    return allLinks.filter(link => relatedHrefs.includes(link.href));
  };

  const renderLinkCard = (link: InternalLinkItem, index: number) => (
    <Card key={index} className="group  ">
      <CardContent className="p-4">
        <Link href={link.href}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-coral/10 rounded-lg group-rand-coral/20 transition-colors">
              {link.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 group-rand-coral transition-colors truncate">
                  {link.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {link.category}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {link.description}
              </p>
              
              {link.metrics && (
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {link.metrics.readTime}
                  </div>
                  {link.metrics.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {link.metrics.rating}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 group- " />
                    Learn More
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );

  const renderCompactLink = (link: InternalLinkItem, index: number) => (
    <Link key={index} href={link.href} className="group">
      <div className="flex items-center gap-3 p-3 rounded-lg ray-50 transition-colors">
        <div className="p-1 bg-brand-coral/10 rounded">
          {link.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 group-rand-coral transition-colors truncate">
            {link.title}
          </h4>
          <p className="text-sm text-gray-600 truncate">
            {link.description}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-rand-coral group- " />
      </div>
    </Link>
  );

  const links = showRelatedContent ? getRelatedContent() : getAllLinks();
  
  if (links.length === 0) return null;

  return (
    <div className={`${className}`}>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {showRelatedContent ? "Related Content" : "Explore Our Services"}
        </h2>
        <p className="text-gray-600">
          {showRelatedContent 
            ? "Continue your journey with these related resources"
            : "Discover how we can help grow your business"
          }
        </p>
      </div>

      {/* Links Grid/List */}
      {variant === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map(renderLinkCard)}
        </div>
      ) : variant === "sidebar" ? (
        <div className="space-y-2">
          {links.map(renderCompactLink)}
        </div>
      ) : variant === "inline" ? (
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <Link key={index} href={link.href}>
              <Button variant="outline" size="sm" className="group">
                {link.icon}
                <span className="ml-2">{link.title}</span>
                <ArrowRight className="w-3 h-3 ml-1 group- " />
              </Button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {links.map(renderCompactLink)}
        </div>
      )}

      {/* View All Link */}
      {showRelatedContent && (
        <div className="mt-6 text-center">
          <Link href="/services">
            <Button variant="outline" className="group">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2 group- " />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Breadcrumb Navigation Component
interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNavigation({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
      <Link href="/" className="rand-coral transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link href={item.href} className="rand-coral transition-colors">
              {item.title}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.title}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Contextual CTA Component
interface ContextualCTAProps {
  currentPage: string;
  className?: string;
}

export function ContextualCTA({ currentPage, className = "" }: ContextualCTAProps) {
  const getContextualCTA = () => {
    switch (currentPage) {
      case "/services/seo":
        return {
          title: "Ready to Improve Your SEO?",
          subtitle: "Get a free SEO audit and strategy consultation",
          ctaText: "Get Free SEO Audit",
          ctaLink: "/contact"
        };
      case "/services/web-development":
        return {
          title: "Need a New Website?",
          subtitle: "Let's discuss your web development project",
          ctaText: "Start Your Project",
          ctaLink: "/contact"
        };
      case "/services/google-ads":
        return {
          title: "Launch Your Google Ads Campaign",
          subtitle: "Get profitable PPC campaigns that drive results",
          ctaText: "Schedule Strategy Call",
          ctaLink: "/contact"
        };
      default:
        return {
          title: "Ready to Grow Your Business?",
          subtitle: "Let's discuss how we can help you succeed",
          ctaText: "Get Started",
          ctaLink: "/contact"
        };
    }
  };

  const cta = getContextualCTA();

  return (
    <div className={`bg-gradient-to-r from-brand-purple to-purple-600 text-white p-6 rounded-lg ${className}`}>
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">{cta.title}</h3>
        <p className="text-white/90 mb-4">{cta.subtitle}</p>
        <Link href={cta.ctaLink}>
          <Button className="bg-white text-brand-purple ray-100">
            {cta.ctaText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}