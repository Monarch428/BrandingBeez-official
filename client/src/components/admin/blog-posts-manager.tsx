import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit3, Plus, Eye, Upload, Wand2, Loader2, Globe, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "./object-uploader";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  author: string;
  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export function BlogPostsManager() {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [showBlogPreview, setShowBlogPreview] = useState(false); // Added state for preview

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    subtitle: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    tags: "",
    author: "BrandingBeez Team",
    readTime: 5,
    isPublished: false,
    isFeatured: false,
    metaDescription: "",
    metaTitle: ""
  });

  const [generateData, setGenerateData] = useState({
    title: "",
    keywords: "",
    category: "Digital Marketing",
    targetAudience: "business owners"
  });

  const queryClient = useQueryClient();

  const { data: blogPosts = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/blog-posts'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/admin/blog-posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`);
      }

      return response.json();
    },
  });

  // Query for viewing individual blog post
  const { data: viewingPostData, isLoading: isLoadingViewPost } = useQuery({
    queryKey: ['/api/admin/blog-posts', viewingPost?.id],
    queryFn: async () => {
      if (!viewingPost?.id) return null;

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/admin/blog-posts/${viewingPost.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blog post: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!viewingPost?.id && isViewDialogOpen,
  });

  const generateBlogMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/admin/generate-single-blog', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          keywords: data.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
          category: data.category,
          targetAudience: data.targetAudience
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate blog: ${response.status} - ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      setGeneratedBlog(data.blog);
      setIsGenerateDialogOpen(false);
      setIsDialogOpen(true);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/admin/blog-posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create blog post: ${response.status} - ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      setIsDialogOpen(false);
      resetForm();
      setGeneratedBlog(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/admin/blog-posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update blog post: ${response.status} - ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      setIsDialogOpen(false);
      resetForm();
      setEditingPost(null);
      setGeneratedBlog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/admin/blog-posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete blog post: ${response.status} - ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      tags: "",
      author: "BrandingBeez Team",
      readTime: 5,
      isPublished: false,
      isFeatured: false,
      metaDescription: "",
      metaTitle: ""
    });
  };

  const resetGenerateForm = () => {
    setGenerateData({
      title: "",
      keywords: "",
      category: "Digital Marketing",
      targetAudience: "business owners"
    });
  };

  const handleView = (post: BlogPost) => {
    setViewingPost(post);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle || "",
      excerpt: post.excerpt || "",
      content: post.content,
      imageUrl: post.imageUrl || "",
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : "",
      author: post.author,
      readTime: post.readTime,
      isPublished: post.isPublished,
      isFeatured: post.isFeatured,
      metaDescription: post.metaDescription || "",
      metaTitle: (post as any).metaTitle || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }

    // Process tags to ensure they are sent as arrays
    const processedFormData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
    };

    console.log('Submitting form data:', processedFormData);

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: processedFormData });
    } else {
      createMutation.mutate(processedFormData);
    }
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateBlogMutation.mutate(generateData);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleViewLive = (post: BlogPost) => {
    // Navigate to the live blog post
    window.open(`/blog/${post.slug}`, '_blank');
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts Management</h2>
        <div className="flex gap-2">
          {/* AI Blog Generator Dialog */}
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetGenerateForm}>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Blog with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Blog with AI</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleGenerateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="generate-title">Blog Topic/Title *</Label>
                  <Input
                    id="generate-title"
                    value={generateData.title}
                    onChange={(e) => setGenerateData({ ...generateData, title: e.target.value })}
                    placeholder="e.g., How to Improve SEO Rankings in 2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="generate-keywords">Target Keywords *</Label>
                  <Input
                    id="generate-keywords"
                    value={generateData.keywords}
                    onChange={(e) => setGenerateData({ ...generateData, keywords: e.target.value })}
                    placeholder="e.g., SEO rankings, search engine optimization, organic traffic"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="generate-category">Category</Label>
                    <Select value={generateData.category} onValueChange={(value) => setGenerateData({ ...generateData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEO">SEO</SelectItem>
                        <SelectItem value="Google Ads">Google Ads</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="AI & Technology">AI & Technology</SelectItem>
                        <SelectItem value="Industry Marketing">Industry Marketing</SelectItem>
                        <SelectItem value="Business Growth">Business Growth</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="generate-audience">Target Audience</Label>
                    <Select value={generateData.targetAudience} onValueChange={(value) => setGenerateData({ ...generateData, targetAudience: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business owners">Business Owners</SelectItem>
                        <SelectItem value="small business owners">Small Business Owners</SelectItem>
                        <SelectItem value="digital marketers">Digital Marketers</SelectItem>
                        <SelectItem value="website owners">Website Owners</SelectItem>
                        <SelectItem value="agency owners">Agency Owners</SelectItem>
                        <SelectItem value="e-commerce businesses">E-commerce Businesses</SelectItem>
                        <SelectItem value="content creators">Content Creators</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={generateBlogMutation.isPending}>
                    {generateBlogMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Blog
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsGenerateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Test Blog Creation Button */}
          {/* <Button 
            variant="outline" 
            onClick={() => {
              const testBlogData = {
                slug: "test-blog-post-2025",
                title: "Test Blog Post: Digital Marketing Trends for 2025",
                subtitle: "A comprehensive guide to upcoming digital marketing strategies",
                excerpt: "Discover the latest digital marketing trends that will shape 2025, including AI integration, personalization strategies, and advanced analytics.",
                content: `# Test Blog Post: Digital Marketing Trends for 2025

## Introduction

Digital marketing is evolving rapidly, and 2025 promises to be a year of significant transformation. In this comprehensive guide, we'll explore the key trends that will shape the digital marketing landscape.

## Key Trends for 2025

### 1. AI-Powered Personalization
Artificial intelligence will continue to revolutionize how we approach customer personalization. Advanced machine learning algorithms will enable marketers to create hyper-personalized experiences at scale.

### 2. Voice Search Optimization
With the growing adoption of smart speakers and voice assistants, optimizing for voice search will become crucial for businesses looking to maintain their competitive edge.

### 3. Interactive Content
Interactive content such as quizzes, polls, and augmented reality experiences will drive higher engagement rates and provide valuable customer insights.

## Best Practices for Implementation

1. **Data-Driven Decision Making**: Use analytics to guide your marketing strategies
2. **Cross-Channel Integration**: Ensure consistent messaging across all platforms
3. **Customer-Centric Approach**: Put your audience's needs at the center of your campaigns

## Conclusion

The digital marketing landscape in 2025 will be characterized by increased personalization, advanced technology integration, and a focus on customer experience. Businesses that adapt to these trends will be well-positioned for success.

Ready to transform your digital marketing strategy? Contact BrandingBeez today to learn how we can help you stay ahead of the curve.`,
                imageUrl: "/ai-software-development.webp",
                tags: "digital marketing, 2025 trends, AI, voice search, personalization",
                author: "BrandingBeez Team",
                readTime: 8,
                isPublished: true,
                isFeatured: true,
                metaDescription: "Discover the top digital marketing trends for 2025 including AI personalization, voice search optimization, and interactive content strategies.",
                metaTitle: "Digital Marketing Trends 2025: AI, Voice Search & Personalization"
              };

              setFormData(testBlogData);
              setEditingPost(null);
              setGeneratedBlog(null);
              setShowBlogPreview(false);
              setIsDialogOpen(true);
            }}
          >
            Create Test Blog
          </Button> */}
        

          {/* Manual Blog Creation Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingPost(null); setGeneratedBlog(null); setShowBlogPreview(false); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Edit Blog Post" : generatedBlog ? "Review Generated Blog" : "Create New Blog Post"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({
                          ...formData,
                          title,
                          slug: generateSlug(title)
                        });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Featured Image</Label>
                  <div className="space-y-3">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData({ ...formData, imageUrl: url });
                        console.log('Setting image URL:', url);
                      }}
                      placeholder="https://example.com/image.jpg or upload below"
                    />

                    {formData.imageUrl && (
                      <div className="relative">
                        <img 
                          src={formData.imageUrl} 
                          alt="Featured image preview" 
                          className="max-h-40 max-w-full object-contain rounded-lg border"
                          onError={(e) => {
                            console.error('Image failed to load:', formData.imageUrl);
                            e.currentTarget.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', formData.imageUrl);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg">
                      <ObjectUploader 
                        onUpload={(url) => {
                          console.log('Setting image URL:', url);
                          setFormData({ ...formData, imageUrl: url });
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="AI, Business, Growth"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="SEO optimized title (60 chars max)"
                      maxLength={60}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    rows={2}
                    placeholder="SEO meta description (160 chars max)"
                    maxLength={160}
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => {
                        console.log('Setting published:', checked);
                        setFormData({ ...formData, isPublished: checked });
                      }}
                    />
                    <Label htmlFor="isPublished" className="cursor-pointer">
                      Published {formData.isPublished ? '✓' : '✗'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => {
                        console.log('Setting featured:', checked);
                        setFormData({ ...formData, isFeatured: checked });
                      }}
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">
                      Featured {formData.isFeatured ? '✓' : '✗'}
                    </Label>
                  </div>
                </div>

                {/* Display generated blog preview if available and form is being used for generated blog */}
                {generatedBlog && (
                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2">Generated Content Preview:</h3>
                    <h4 className="text-md font-semibold mb-1">Title: {generatedBlog.title}</h4>
                    {generatedBlog.subtitle && <p className="text-sm text-gray-700 mb-1">Subtitle: {generatedBlog.subtitle}</p>}
                    {generatedBlog.excerpt && <p className="text-sm text-gray-700 mb-1">Excerpt: {generatedBlog.excerpt}</p>}
                    <div className="text-sm text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: generatedBlog.content }} />
                    {generatedBlog.tags && generatedBlog.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {generatedBlog.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {generatedBlog.metaDescription && <p className="text-sm text-gray-700 mt-2">Meta Description: {generatedBlog.metaDescription}</p>}
                  </div>
                )}


                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingPost ? "Update" : generatedBlog ? "Save Generated Blog" : "Create Blog Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                      setEditingPost(null);
                      setGeneratedBlog(null);
                      setShowBlogPreview(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {(blogPosts as BlogPost[]).map((post: BlogPost) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {post.title}
                    {post.isFeatured && <Badge variant="secondary">Featured</Badge>}
                    {!post.isPublished && <Badge variant="destructive">Draft</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    /{post.slug} • {post.author} • {post.readTime} min read
                  </p>
                  {post.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{post.subtitle}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(post)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(post.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
              )}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(blogPosts as BlogPost[]).length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No blog posts found. Create your first blog post to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Blog Post Viewer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Blog Post Preview
            </DialogTitle>
          </DialogHeader>

          {isLoadingViewPost ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              Loading blog post...
            </div>
          ) : viewingPostData ? (
            <div className="space-y-6">
              {/* Blog Post Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">ID:</span> {viewingPostData.id}
                  </div>
                  <div>
                    <span className="font-semibold">Slug:</span> /{viewingPostData.slug}
                  </div>
                  <div>
                    <span className="font-semibold">Author:</span> {viewingPostData.author}
                  </div>
                  <div>
                    <span className="font-semibold">Read Time:</span> {viewingPostData.readTime} min
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <Badge variant={viewingPostData.isPublished ? "default" : "destructive"}>
                      {viewingPostData.isPublished ? "Published" : "Draft"}
                    </Badge>
                    {viewingPostData.isFeatured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span> {new Date(viewingPostData.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Blog Post Content */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{viewingPostData.title}</h1>

                {viewingPostData.subtitle && (
                  <h2 className="text-xl text-gray-600">{viewingPostData.subtitle}</h2>
                )}

                {viewingPostData.imageUrl && (
                  <img 
                    src={viewingPostData.imageUrl} 
                    alt={viewingPostData.title}
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                )}

                {viewingPostData.excerpt && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Excerpt:</h3>
                    <p className="text-gray-700">{viewingPostData.excerpt}</p>
                  </div>
                )}

                {viewingPostData.metaDescription && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Meta Description:</h3>
                    <p className="text-gray-700">{viewingPostData.metaDescription}</p>
                  </div>
                )}

                {Array.isArray(viewingPostData.tags) && viewingPostData.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Tags:</h3>
                    <div className="flex gap-2 flex-wrap">
                      {viewingPostData.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Content:</h3>
                  <div 
                    className="prose prose-lg max-w-none"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {viewingPostData.content}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(viewingPostData)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleViewLive(viewingPostData)}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  View Live
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Blog post not found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}