import React, { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { OptimizedImage } from "@/components/optimized-image";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  tags: string[];
  author: string;
  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  metaDescription?: string;
  metaTitle?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  category?: string;
}

export default function Blog() {
  const { regionConfig } = useRegion();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: databasePosts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      const posts = await response.json();
      return Array.isArray(posts) ? posts.filter((p) => p.isPublished) : [];
    },
    staleTime: 1000 * 60 * 15,
    retry: 2,
  });

  const blogPosts = useMemo(() => {
    return databasePosts.filter((post: BlogPost) => {
      if (!post.imageUrl) return true;
      return !post.imageUrl.includes("Blog_-_Ad_Fatigue_in_Digital_Marketing.png");
    });
  }, [databasePosts]);

  // ✅ Determine Featured Post
  const featuredPost = useMemo(() => {
    return blogPosts.find((post) => post.isFeatured) || null;
  }, [blogPosts]);

  const openCalendly = () => window.open(regionConfig.calendlyUrl, "_blank");

  const categories = useMemo(() => {
    const categoryMap = new Map();
    blogPosts.forEach((post: BlogPost) => {
      const cat = post.category || post.tags?.[0] || "General";
      categoryMap.set(cat.toLowerCase(), {
        id: cat.toLowerCase(),
        name: cat,
        count: (categoryMap.get(cat.toLowerCase())?.count || 0) + 1,
      });
    });
    return [
      { id: "all", name: "All Posts", count: blogPosts.length },
      ...Array.from(categoryMap.values()).sort((a, b) => b.count - a.count),
    ];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post: BlogPost) => {
      const postCategory = post.category || post.tags?.[0] || "General";
      const matchesCategory =
        selectedCategory === "all" ||
        postCategory.toLowerCase().includes(selectedCategory);
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Loading Articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="text-3xl">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Unable to load blog posts
            </h2>
            <p className="text-gray-600">
              {(error as Error)?.message || "Please try again in a moment."}
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-6xl mx-auto text-center p-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Digital Marketing <span className="text-yellow-300">Insights</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Stay ahead with expert strategies, trends, and actionable insights
            from our team
          </p>
          <Button
            onClick={openCalendly}
            size="lg"
            className="bg-white text-brand-purple hover:bg-brand-purple hover:text-white"
          >
            Get Free Strategy Session
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* ✅ Featured Post Section */}
      {featuredPost && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Article
            </h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <OptimizedImage
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                    fallbackSrc="/images/blog-featured-image.webp"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge variant="secondary" className="mb-4">
                    {featuredPost.category ||
                      (Array.isArray(featuredPost.tags) &&
                        featuredPost.tags.length > 0
                        ? featuredPost.tags[0]
                        : "Featured")}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author || "BrandingBeez Team"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(
                        featuredPost.publishedAt || featuredPost.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime || 5} min read
                    </div>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button className="bg-brand-purple hover:bg-brand-coral hover:text-white">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Search & Category Filter */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "bg-brand-purple hover:bg-brand-purple/90"
                      : "hover:border-brand-purple/40"
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post: BlogPost) => {
              const displayCategory = post.category || post.tags?.[0] || "Digital Marketing";
              const publishDate = post.publishedAt || post.createdAt;
              const formattedDate = publishDate
                ? new Date(publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : "Recent";

              return (
                <Card
                  key={post.id}
                  className="h-full flex flex-col overflow-hidden border hover:shadow-md transition-all duration-300"
                >
                  <OptimizedImage
                    src={post.imageUrl || ""}
                    alt={post.title || "Untitled"}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />

                  {/* Header */}
                  <CardHeader className="pb-3">
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl md:text-[22px] font-semibold leading-snug tracking-tight text-gray-900 hover:text-brand-purple transition-colors line-clamp-2">
                        {post.title || "Untitled Article"}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm md:text-[15px] text-gray-600 leading-relaxed line-clamp-2">
                      {post.excerpt || post.subtitle || "Insightful digital marketing article."}
                    </p>
                  </CardHeader>

                  {/* Body + CTA pinned to bottom */}
                  <CardContent className="flex-1 flex flex-col">
                    {/* Meta row */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray-500 mb-6">
                      <div className="inline-flex items-center gap-2.5 whitespace-nowrap">
                        <span className="hidden md:inline-block h-1 w-1 rounded-full bg-gray-300" />
                        <User className="h-4 w-4 opacity-70" />
                        <span className="truncate max-w-[140px]">
                          {post.author || "BrandingBeez Team"}
                        </span>
                      </div>


                      <div className="inline-flex items-center gap-2.5 whitespace-nowrap">
                        <span className="hidden md:inline-block h-1 w-1 rounded-full bg-gray-300" />
                        <Calendar className="h-4 w-4 opacity-70" />
                        <time dateTime={publishDate || undefined}>
                          {formattedDate}
                        </time>
                      </div>

                      <div className="inline-flex items-center gap-2.5 whitespace-nowrap">
                        <span className="hidden md:inline-block h-1 w-1 rounded-full bg-gray-300" />
                        <Clock className="h-4 w-4 opacity-70" />
                        <span>{post.readTime || 5} min</span>
                      </div>
                    </div>

                    {/* CTA pinned to bottom */}
                    <div className="mt-auto pt-4 border-t">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline"
                          className="w-full hover:bg-brand-purple hover:text-white transition-colors" >
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
