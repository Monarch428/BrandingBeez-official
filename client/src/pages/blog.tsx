import React, { useState, useMemo } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { OptimizedImage } from "@/components/optimized-image";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { getAllBlogPostsData } from "@/lib/blog-posts-map";

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

const staticBlogPosts: BlogPost[] = getAllBlogPostsData();

export default function Blog() {
  const { regionConfig } = useRegion();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: databasePosts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) throw new Error("Failed to fetch");
        const posts = await response.json();
        return Array.isArray(posts) ? posts.filter((p) => p.isPublished) : [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 15,
    retry: 2,
  });

  const blogPosts = useMemo(() => {
    let allPosts = databasePosts?.length ? databasePosts : staticBlogPosts;
    return allPosts.filter(
      (post: BlogPost) =>
        !post.imageUrl.includes("Blog_-_Ad_Fatigue_in_Digital_Marketing.png")
    );
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
                    disableWebP={
                      featuredPost.imageUrl.includes(
                        "Industry-Specific_Digital_Marketing_1.png"
                      ) ||
                      featuredPost.imageUrl.includes(
                        "Blog_-_Ad_Fatigue_in_Digital_Marketing.png"
                      ) ||
                      featuredPost.imageUrl.includes("hir.png") ||
                      featuredPost.imageUrl.includes("wls.png")
                    }
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

      {/* Search & Category Filter */}
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

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post: BlogPost) => {
              const displayCategory =
                post.category || post.tags?.[0] || "Digital Marketing";
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
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <OptimizedImage
                    src={post.imageUrl || ""}
                    alt={post.title || "Untitled"}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {displayCategory}
                    </Badge>
                    <CardTitle className="text-lg line-clamp-2 hover:text-brand-purple transition-colors">
                      {post.title || "Untitled Article"}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt ||
                        post.subtitle ||
                        "Insightful digital marketing article."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author || "BrandingBeez Team"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime || 5} min
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
