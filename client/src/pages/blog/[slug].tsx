import React, { useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  author?: string;
  readTime?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  metaDescription?: string;
  metaTitle?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  category?: string;
}

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
        <p className="text-lg font-semibold">Loading Article...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we load the blog post</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default function DynamicBlogPost() {
  const [location] = useLocation();
  const slug = location.replace(/^\/blog\/?/, "").split("?")[0];

  const {
    data: blogPost,
    isLoading,
    isError,
    error,
  } = useQuery<BlogPost | null>({
    queryKey: ["blog-post", slug],
    enabled: !!slug,
    queryFn: async () => {
      if (!slug) {
        throw new Error("Missing blog slug");
      }

      const res = await fetch(`/api/blog/${slug}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.status === 404) {
        return null;
      }

      if (!res.ok) {
        const message = await res.text();
        throw new Error(
          message || `Failed to load article (status ${res.status})`,
        );
      }

      const data = await res.json();
      return data as BlogPost;
    },
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });

  const htmlContent = useMemo(() => {
    const rawContent = blogPost?.content?.trim();
    if (!rawContent) return "";

    // If the content already contains HTML tags, trust it and return as-is
    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(rawContent);
    if (hasHtmlTags) return rawContent;

    // Normalize newlines
    let normalized = rawContent.replace(/\r\n/g, "\n");

    // 1) Turn any occurrence of heading markers (inline or at line start)
    //    into paragraph breaks so heading text becomes its own paragraph.
    //    e.g. "Success ## Introduction" -> "Success\n\nIntroduction"
    normalized = normalized.replace(/#{1,6}\s*/g, "\n\n");

    // 2) Remove any remaining leading # (defensive) at the start of lines
    normalized = normalized.replace(/^\s*#{1,6}\s*/gm, "");

    // Split into paragraphs on one-or-more blank lines
    const paragraphs = normalized
      .split(/\n\s*\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        // Preserve single line breaks inside a paragraph as <br/>
        const withLineBreaks = p.replace(/\n/g, "<br/>");

        // Inline formatting: bold and italic
        const withFormatting = withLineBreaks
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>");

        return `<p>${withFormatting}</p>`;
      })
      .join("");

    return paragraphs;
  }, [blogPost?.content]);

  const publishDate = blogPost?.publishedAt || blogPost?.createdAt;
  const formattedPublishDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recent";
  const author = blogPost?.author || "BrandingBeez Team";
  const readTime = blogPost?.readTime || 5;

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unable to load blog post
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {(error as Error)?.message || "Please try again later."}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Button onClick={() => (window.location.href = "/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Share article
  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({ title: blogPost.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO */}
      <title>{blogPost.metaTitle || `${blogPost.title} | BrandingBeez`}</title>
      <meta name="description" content={blogPost.metaDescription || blogPost.excerpt || ""} />
      <meta name="keywords" content={Array.isArray(blogPost.tags) ? blogPost.tags.join(", ") : ""} />
      <meta property="og:title" content={blogPost.metaTitle || blogPost.title} />
      <meta property="og:description" content={blogPost.metaDescription || blogPost.excerpt || ""} />
      <meta property="og:image" content={blogPost.imageUrl || "/api/placeholder/800/600"} />
      <meta property="article:author" content={author} />
      <meta property="article:published_time" content={publishDate} />

      <Header />

      {/* Article Header */}
      <section className="py-8 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => (window.location.href = "/blog")}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-6 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{blogPost.title}</h1>
          {blogPost.subtitle && <h2 className="text-xl md:text-2xl text-white/90 mb-6">{blogPost.subtitle}</h2>}

          <div className="flex flex-wrap items-center gap-6 text-white/90 mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formattedPublishDate}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {readTime} min read
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
          {blogPost.imageUrl && (
            <div className="mb-12">
              <img
                src={blogPost.imageUrl}
                alt={blogPost.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          )}

          {blogPost.excerpt && (
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-brand-coral rounded-r-lg">
              <h3 className="font-semibold text-brand-purple mb-2">Article Summary:</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{blogPost.excerpt}</p>
            </div>
          )}

          {Array.isArray(blogPost.tags) && blogPost.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-brand-purple">Topics Covered:</h3>
              <div className="flex gap-2 flex-wrap">
                {blogPost.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-brand-coral border-brand-coral">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify"
            style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: "18px" }}
            dangerouslySetInnerHTML={{
              __html: htmlContent,
            }}
          />

          <div className="mt-16 p-8 bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              Contact our expert team to discuss how we can help grow your business with proven digital marketing strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => window.open("https://calendly.com/brandingbeez/30min", "_blank")}
                size="lg"
                className="bg-white text-brand-purple hover:bg-gray-100"
              >
                Get Free Consultation
              </Button>
              <p className="text-lg">
                📞 Call us at{" "}
                <a href="tel:+919952462833" className="text-white underline font-semibold">
                  +91 99524 62833
                </a>
              </p>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
