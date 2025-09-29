
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/optimized-image";
import { 
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Search,
  Target,
  TrendingUp,
  Users,
  Globe,
  BarChart3,
  Zap,
  CheckCircle
} from "lucide-react";

export const blogPostData = {
  id: 2,
  slug: "white-label-seo-ppc-2025",
  title: "White Label SEO & PPC Explained: The 2025 Solution to Scale Your Agency Globally",
  subtitle: "Learn how white label services can help your agency scale globally",
  excerpt: "Discover how white label SEO and PPC services can help your agency scale globally in 2025. Learn about cost savings, dedicated expertise, and local SEO strategies for business growth.",
  imageUrl: "/seo-ppc-blog.webp",
  tags: ["White Label", "SEO", "PPC", "Agency Growth", "Digital Marketing"],
  author: "Digital Marketing Team",
  readTime: 10,
  isPublished: true,
  isFeatured: false,
  metaDescription: "Discover how white label SEO and PPC services can help your agency scale globally in 2025. Learn about cost savings, dedicated expertise, and local SEO strategies for business growth.",
  metaTitle: "White Label SEO & PPC Explained: The 2025 Solution to Scale Your Agency Globally | BrandingBeez",
  createdAt: "2025-01-20T00:00:00Z",
  updatedAt: "2025-01-20T00:00:00Z",
  publishedAt: "2025-01-20T00:00:00Z",
  category: "Digital Marketing"
};

export default function WhiteLabelSEOPPCBlog() {
  const { regionConfig } = useRegion();
  
  const openCalendly = () => {
    window.open(regionConfig.calendlyUrl, '_blank');
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPostData.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Head */}
      <title>{blogPostData.metaTitle}</title>
      <meta 
        name="description" 
        content={blogPostData.metaDescription} 
      />
      
      <Header />
      
      {/* Article Header */}
      <section className="py-8 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            <Search className="w-4 h-4 mr-2" />
            {blogPostData.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {blogPostData.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/90 mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {blogPostData.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(blogPostData.publishedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {blogPostData.readTime} min read
            </div>
          </div>
          
          <Button 
            onClick={shareArticle}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-brand-purple bg-transparent"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
          </Button>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-12">
            <OptimizedImage
              src={blogPostData.imageUrl}
              alt={blogPostData.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              width={800}
              height={400}
              loading="lazy"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-3" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In today's competitive digital marketing landscape, agencies worldwide are seeking smarter ways to grow their offerings without the burden and costs of expanding internal teams. White label SEO and PPC services have emerged as a game-changing solution, allowing agencies to provide expert services under their own brand while outsourcing the actual work to trusted partners.
              </p>
            </section>

            {/* Continue with more content sections... */}
            
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-brand-purple to-brand-coral p-8 rounded-lg text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Scale Your Agency with White Label Services?</h3>
              <p className="text-lg mb-6">
                Contact BrandingBeez today to explore our comprehensive white label SEO and PPC solutions. 
                Let's help you grow your agency without limits.
              </p>
              <Button 
                onClick={openCalendly}
                size="lg"
                className="bg-white text-brand-purple hover:bg-gray-100"
              >
                Get Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
}
