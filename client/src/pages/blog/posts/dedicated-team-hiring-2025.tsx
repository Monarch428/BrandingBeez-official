
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
  Users,
  Target
} from "lucide-react";

export const blogPostData = {
  id: 3,
  slug: "dedicated-team-hiring-2025",
  title: "How To Hire a Dedicated Team And Build a High-Performing Workforce in 2025",
  subtitle: "Complete guide to building dedicated offshore teams",
  excerpt: "Learn how to hire a dedicated team — from software developers to SEO specialists — and build a high-performing workforce in 2025. Discover the benefits, hiring process, and success tips for businesses of all sizes.",
  imageUrl: "/enhanced-operational-efficiency.webp",
  tags: ["Dedicated Teams", "Workforce Management", "Hiring", "Remote Teams"],
  author: "Workforce Strategy Team",
  readTime: 8,
  isPublished: true,
  isFeatured: false,
  metaDescription: "Learn how to hire a dedicated team — from software developers to SEO specialists — and build a high-performing workforce in 2025. Discover the benefits, hiring process, and success tips for businesses of all sizes.",
  metaTitle: "How To Hire a Dedicated Team And Build a High-Performing Workforce in 2025 | BrandingBeez",
  createdAt: "2025-01-25T00:00:00Z",
  updatedAt: "2025-01-25T00:00:00Z",
  publishedAt: "2025-01-25T00:00:00Z",
  category: "Business Growth"
};

export default function DedicatedTeamHiringBlog() {
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
      <title>{blogPostData.metaTitle}</title>
      <meta name="description" content={blogPostData.metaDescription} />
      
      <Header />
      
      <section className="py-8 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            <Users className="w-4 h-4 mr-2" />
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

      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
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
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3" />
                Dedicated Teams: A Fresh Look
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Big projects can be exciting — but also overwhelming. Tight deadlines, heavy workloads, and limited resources can leave your internal staff stretched thin. Instead of overloading your team, you can hire a dedicated team — professionals who work exclusively on your project, just like an extension of your in-house staff but without the overhead costs.
              </p>
            </section>

            {/* Continue with more content... */}
            
            <div className="bg-gradient-to-r from-brand-purple to-brand-coral p-8 rounded-lg text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Dedicated Team?</h3>
              <p className="text-lg mb-6">
                Contact BrandingBeez today to explore our dedicated team solutions. 
                From software developers to SEO specialists, we'll help you build the perfect workforce for your project.
              </p>
              <Button 
                onClick={openCalendly}
                size="lg"
                className="bg-white text-brand-purple hover:bg-gray-100"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
}
