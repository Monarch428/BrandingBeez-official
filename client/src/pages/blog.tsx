import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { OptimizedImage } from "@/components/optimized-image";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  Globe,
} from "lucide-react";

// Blog post interface for type safety
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

import { getAllBlogPostsData } from "@/lib/blog-posts-map";

// Get static blog posts from mapping
const staticBlogPosts: BlogPost[] = getAllBlogPostsData();

export default function Blog() {
  const { regionConfig } = useRegion();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch blog posts from the API - with fallback to static posts
  const {
    data: databasePosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      console.log("🚀 Fetching published blog posts from /api/blog");

      try {
        const response = await fetch("/api/blog", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }

        const posts = await response.json();
        console.log("✅ Published blog posts received:", posts?.length || 0);

        // Ensure we return an array of published posts only
        const publishedPosts = Array.isArray(posts)
          ? posts.filter((post) => post.isPublished)
          : [];
        console.log("📋 Filtered published posts:", publishedPosts.length);

        return publishedPosts;
      } catch (error) {
        console.error("❌ Error fetching blog posts:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    retry: 2,
  });

  // Use database posts if available, otherwise use static posts
  const blogPosts = useMemo(() => {
    if (databasePosts && databasePosts.length > 0) {
      return databasePosts;
    }
    // Fallback to static posts if database is empty or failed
    return staticBlogPosts;
  }, [databasePosts]);

  const openCalendly = () => {
    window.open(regionConfig.calendlyUrl, "_blank");
  };

  // Use useMemo for memoizing categories to avoid recalculating on every render
  const categories = useMemo(() => {
    if (!blogPosts || !Array.isArray(blogPosts)) return [];

    const categoryMap = new Map();

    blogPosts.forEach((post: BlogPost) => {
      // Extract category from tags or use a default
      const postCategory =
        post.category ||
        (Array.isArray(post.tags) && post.tags.length > 0
          ? post.tags[0]
          : "General");

      // Count by category
      const existingCategory = categoryMap.get(postCategory.toLowerCase());
      if (existingCategory) {
        existingCategory.count += 1;
      } else {
        categoryMap.set(postCategory.toLowerCase(), {
          id: postCategory.toLowerCase(),
          name: postCategory,
          count: 1,
        });
      }

      // Count by tags
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          if (tag && typeof tag === "string") {
            const tagKey = tag.toLowerCase().trim();
            if (tagKey !== postCategory.toLowerCase()) {
              const existingTag = categoryMap.get(tagKey);
              if (existingTag) {
                existingTag.count += 1;
              } else {
                categoryMap.set(tagKey, {
                  id: tagKey,
                  name: tag.trim(),
                  count: 1,
                });
              }
            }
          }
        });
      }
    });

    // Add "All Posts" category
    const allPostsCategory = {
      id: "all",
      name: "All Posts",
      count: blogPosts.length,
    };

    // Convert Map to array and sort by count (descending) then name
    const sortedCategories = Array.from(categoryMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

    return [allPostsCategory, ...sortedCategories];
  }, [blogPosts]);

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    if (!blogPosts || !Array.isArray(blogPosts)) return [];

    return blogPosts.filter((post: BlogPost) => {
      // Category matching
      const postCategory =
        post.category ||
        (Array.isArray(post.tags) && post.tags.length > 0
          ? post.tags[0]
          : "General");
      const matchesCategory =
        selectedCategory === "all" ||
        postCategory.toLowerCase().includes(selectedCategory) ||
        (Array.isArray(post.tags) &&
          post.tags.some(
            (tag) =>
              typeof tag === "string" &&
              tag.toLowerCase().includes(selectedCategory),
          ));

      // Search matching
      const matchesSearch =
        searchQuery === "" ||
        (post.title &&
          post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.excerpt &&
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.subtitle &&
          post.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(post.tags) &&
          post.tags.some(
            (tag) =>
              typeof tag === "string" &&
              tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ));

      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  // Get featured post (prioritize isFeatured flag, fallback to first post)
  const featuredPost = useMemo(() => {
    if (!blogPosts || !Array.isArray(blogPosts) || blogPosts.length === 0)
      return null;

    // Look for a post marked as featured
    const markedFeatured = blogPosts.find((post: BlogPost) => post.isFeatured);
    if (markedFeatured) return markedFeatured;

    // Fallback to the first published post
    const firstPublished = blogPosts.find((post: BlogPost) => post.isPublished);
    return firstPublished || blogPosts[0];
  }, [blogPosts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Loading Articles...</p>
            <p className="text-sm text-gray-500 mt-2">
              Fetching latest blog posts
            </p>
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
      <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-6xl mx-auto text-center">
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
            className="bg-white text-brand-purple hover:bg-gray-100"
          >
            Get Free Strategy Session
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Featured Post */}
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
                    disableWebP={featuredPost.imageUrl.includes('Industry-Specific_Digital_Marketing_1.png') || featuredPost.imageUrl.includes('Blog_-_Ad_Fatigue_in_Digital_Marketing.png') || featuredPost.imageUrl.includes('hir.png') || featuredPost.imageUrl.includes('wls.png')}
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
                        featuredPost.publishedAt || featuredPost.createdAt,
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
                    <Button className="bg-brand-purple hover:bg-brand-purple/90">
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

      {/* Search and Filter */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "bg-brand-purple hover:bg-brand-purple/90"
                      : ""
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post: BlogPost) => {
              // Extract category for display
              const displayCategory =
                post.category ||
                (Array.isArray(post.tags) && post.tags.length > 0
                  ? post.tags[0]
                  : "Digital Marketing");

              // Format date safely
              const publishDate = post.publishedAt || post.createdAt;
              const formattedDate = publishDate
                ? new Date(publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recent";

              // Ensure required fields have fallbacks
              const postTitle = post.title || "Untitled Article";
              const postExcerpt =
                post.excerpt ||
                post.subtitle ||
                "Read this insightful article about digital marketing strategies and business growth.";
              const postAuthor = post.author || "BrandingBeez Team";
              const postReadTime = post.readTime || 5;
              const postImage = post.imageUrl || "";

              return (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <OptimizedImage
                    src={postImage}
                    alt={postTitle}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                    disableWebP={postImage.includes('Industry-Specific_Digital_Marketing_1.png') || postImage.includes('Blog_-_Ad_Fatigue_in_Digital_Marketing.png') || postImage.includes('hir.png') || postImage.includes('wls.png')}
                  />
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {displayCategory}
                    </Badge>
                    <CardTitle className="text-lg line-clamp-2 hover:text-brand-purple transition-colors">
                      {postTitle}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {postExcerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {postAuthor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {postReadTime} min
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full hover:bg-brand-purple hover:text-white transition-colors"
                      >
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPosts.length === 0 && blogPosts && blogPosts.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No articles found matching your criteria.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filters.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {(!blogPosts || blogPosts.length === 0) && !isLoading && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Expert Insights Available
                </h3>
                <p className="text-gray-500 mb-6">
                  Explore our collection of digital marketing insights and
                  strategies to grow your business.
                </p>
              </div>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredPosts.length} article
                {filteredPosts.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" &&
                  ` in ${categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              {(selectedCategory !== "all" || searchQuery) && (
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  View All Articles
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with Latest Insights
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Get expert digital marketing strategies delivered to your inbox
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white text-gray-900 border-0"
            />
            <Button
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold"
              onClick={openCalendly}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-brand-purple mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Growth Strategies</h3>
              <p className="text-gray-600">
                Proven tactics to scale your business
              </p>
            </div>
            <div className="text-center">
              <Target className="h-12 w-12 text-brand-coral mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Insights</h3>
              <p className="text-gray-600">
                Industry knowledge from our specialists
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-brand-purple mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Trends</h3>
              <p className="text-gray-600">Stay ahead of market changes</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Digital Strategy?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let our experts help you implement these insights for your business
          </p>
          <Button
            onClick={openCalendly}
            size="lg"
            className="bg-brand-purple hover:bg-brand-purple/90"
          >
            Get Free Strategy Session
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
