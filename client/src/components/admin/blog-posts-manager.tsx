// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Trash2,
//   Edit3,
//   Plus,
//   Eye,
//   Upload,
//   Wand2,
//   Loader2,
//   Globe,
//   X,
// } from "lucide-react";
// import { apiRequest } from "@/lib/queryClient";
// import { ObjectUploader } from "./object-uploader";

// interface BlogPost {
//   id: number;
//   slug: string;
//   title: string;
//   subtitle?: string;
//   excerpt?: string;
//   content: string;
//   imageUrl?: string;
//   tags?: string[];
//   author: string;
//   readTime: number;
//   isPublished: boolean;
//   isFeatured: boolean;
//   metaDescription?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export function BlogPostsManager() {
//   const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
//   const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
//   const [generatedBlog, setGeneratedBlog] = useState<any>(null);
//   const [showBlogPreview, setShowBlogPreview] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false); // ✅ for Cloudinary upload state

//   const [formData, setFormData] = useState({
//     slug: "",
//     title: "",
//     subtitle: "",
//     excerpt: "",
//     content: "",
//     imageUrl: "",
//     tags: "",
//     author: "BrandingBeez Team",
//     readTime: 5,
//     isPublished: false,
//     isFeatured: false,
//     metaDescription: "",
//     metaTitle: "",
//   });

//   const [generateData, setGenerateData] = useState({
//     title: "",
//     keywords: "",
//     category: "Digital Marketing",
//     targetAudience: "business owners",
//   });

//   const queryClient = useQueryClient();

//   const {
//     data: blogPosts = [],
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["/api/admin/blog-posts"],
//     queryFn: async () => {
//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch("/api/admin/blog-posts", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch blog posts: ${response.status}`);
//       }

//       return response.json();
//     },
//   });

//   // Query for viewing individual blog post
//   const { data: viewingPostData, isLoading: isLoadingViewPost } = useQuery({
//     queryKey: ["/api/admin/blog-posts", viewingPost?.id],
//     queryFn: async () => {
//       if (!viewingPost?.id) return null;

//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch(`/api/admin/blog-posts/${viewingPost.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch blog post: ${response.status}`);
//       }

//       return response.json();
//     },
//     enabled: !!viewingPost?.id && isViewDialogOpen,
//   });

//   const generateBlogMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch("/api/admin/generate-single-blog", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: data.title,
//           keywords: data.keywords
//             .split(",")
//             .map((k: string) => k.trim())
//             .filter(Boolean),
//           category: data.category,
//           targetAudience: data.targetAudience,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to generate blog: ${response.status} - ${errorText}`,
//         );
//       }

//       return response.json();
//     },
//     onSuccess: (data: any) => {
//       setGeneratedBlog(data.blog);
//       setIsGenerateDialogOpen(false);
//       setIsDialogOpen(true);
//     },
//   });

//   const createMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch("/api/admin/blog-posts", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to create blog post: ${response.status} - ${errorText}`,
//         );
//       }

//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["/api/admin/blog-posts"],
//       });
//       setIsDialogOpen(false);
//       resetForm();
//       setGeneratedBlog(null);
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: async ({ id, data }: { id: number; data: any }) => {
//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch(`/api/admin/blog-posts/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to update blog post: ${response.status} - ${errorText}`,
//         );
//       }

//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["/api/admin/blog-posts"],
//       });
//       setIsDialogOpen(false);
//       resetForm();
//       setEditingPost(null);
//       setGeneratedBlog(null);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (id: number) => {
//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch(`/api/admin/blog-posts/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to delete blog post: ${response.status} - ${errorText}`,
//         );
//       }

//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["/api/admin/blog-posts"],
//       });
//     },
//   });

//   const resetForm = () => {
//     setFormData({
//       slug: "",
//       title: "",
//       subtitle: "",
//       excerpt: "",
//       content: "",
//       imageUrl: "",
//       tags: "",
//       author: "BrandingBeez Team",
//       readTime: 5,
//       isPublished: false,
//       isFeatured: false,
//       metaDescription: "",
//       metaTitle: "",
//     });
//   };

//   const resetGenerateForm = () => {
//     setGenerateData({
//       title: "",
//       keywords: "",
//       category: "Digital Marketing",
//       targetAudience: "business owners",
//     });
//   };

//   const handleView = (post: BlogPost) => {
//     setViewingPost(post);
//     setIsViewDialogOpen(true);
//   };

//   const handleEdit = (post: BlogPost) => {
//     setEditingPost(post);
//     setFormData({
//       slug: post.slug,
//       title: post.title,
//       subtitle: post.subtitle || "",
//       excerpt: post.excerpt || "",
//       content: post.content,
//       imageUrl: post.imageUrl || "",
//       tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
//       author: post.author,
//       readTime: post.readTime,
//       isPublished: post.isPublished,
//       isFeatured: post.isFeatured,
//       metaDescription: post.metaDescription || "",
//       metaTitle: (post as any).metaTitle || "",
//     });
//     setIsDialogOpen(true);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       alert("Title is required");
//       return;
//     }

//     if (!formData.content.trim()) {
//       alert("Content is required");
//       return;
//     }

//     const processedFormData = {
//       ...formData,
//       tags: formData.tags
//         ? formData.tags
//             .split(",")
//             .map((tag) => tag.trim())
//             .filter((tag) => tag.length > 0)
//         : [],
//     };

//     console.log("Submitting form data:", processedFormData);

//     if (editingPost) {
//       updateMutation.mutate({ id: editingPost.id, data: processedFormData });
//     } else {
//       createMutation.mutate(processedFormData);
//     }
//   };

//   const handleGenerateSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     generateBlogMutation.mutate(generateData);
//   };

//   const generateSlug = (title: string) => {
//     return title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   };

//   const handleViewLive = (post: BlogPost) => {
//     window.open(`/blog/${post.slug}`, "_blank");
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-8">Loading blog posts...</div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Blog Posts Management</h2>
//         <div className="flex gap-2">
//           {/* AI Blog Generator Dialog */}
//           <Dialog
//             open={isGenerateDialogOpen}
//             onOpenChange={setIsGenerateDialogOpen}
//           >
//             <DialogTrigger asChild>
//               <Button variant="outline" onClick={resetGenerateForm}>
//                 <Wand2 className="w-4 h-4 mr-2" />
//                 Generate Blog with AI
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl">
//               <DialogHeader>
//                 <DialogTitle>Generate Blog with AI</DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleGenerateSubmit} className="space-y-4">
//                 <div>
//                   <Label htmlFor="generate-title">Blog Topic/Title *</Label>
//                   <Input
//                     id="generate-title"
//                     value={generateData.title}
//                     onChange={(e) =>
//                       setGenerateData({
//                         ...generateData,
//                         title: e.target.value,
//                       })
//                     }
//                     placeholder="e.g., How to Improve SEO Rankings in 2025"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="generate-keywords">Target Keywords *</Label>
//                   <Input
//                     id="generate-keywords"
//                     value={generateData.keywords}
//                     onChange={(e) =>
//                       setGenerateData({
//                         ...generateData,
//                         keywords: e.target.value,
//                       })
//                     }
//                     placeholder="e.g., SEO rankings, search engine optimization, organic traffic"
//                     required
//                   />
//                   <p className="text-sm text-gray-500 mt-1">
//                     Separate keywords with commas
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="generate-category">Category</Label>
//                     <Select
//                       value={generateData.category}
//                       onValueChange={(value) =>
//                         setGenerateData({ ...generateData, category: value })
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="SEO">SEO</SelectItem>
//                         <SelectItem value="Google Ads">Google Ads</SelectItem>
//                         <SelectItem value="Web Development">
//                           Web Development
//                         </SelectItem>
//                         <SelectItem value="AI & Technology">
//                           AI & Technology
//                         </SelectItem>
//                         <SelectItem value="Industry Marketing">
//                           Industry Marketing
//                         </SelectItem>
//                         <SelectItem value="Business Growth">
//                           Business Growth
//                         </SelectItem>
//                         <SelectItem value="Digital Marketing">
//                           Digital Marketing
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label htmlFor="generate-audience">Target Audience</Label>
//                     <Select
//                       value={generateData.targetAudience}
//                       onValueChange={(value) =>
//                         setGenerateData({
//                           ...generateData,
//                           targetAudience: value,
//                         })
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="business owners">
//                           Business Owners
//                         </SelectItem>
//                         <SelectItem value="small business owners">
//                           Small Business Owners
//                         </SelectItem>
//                         <SelectItem value="digital marketers">
//                           Digital Marketers
//                         </SelectItem>
//                         <SelectItem value="website owners">
//                           Website Owners
//                         </SelectItem>
//                         <SelectItem value="agency owners">
//                           Agency Owners
//                         </SelectItem>
//                         <SelectItem value="e-commerce businesses">
//                           E-commerce Businesses
//                         </SelectItem>
//                         <SelectItem value="content creators">
//                           Content Creators
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button
//                     type="submit"
//                     disabled={generateBlogMutation.isPending}
//                   >
//                     {generateBlogMutation.isPending ? (
//                       <>
//                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <Wand2 className="w-4 h-4 mr-2" />
//                         Generate Blog
//                       </>
//                     )}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setIsGenerateDialogOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           </Dialog>

//           {/* Manual Blog Creation Dialog */}
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 onClick={() => {
//                   resetForm();
//                   setEditingPost(null);
//                   setGeneratedBlog(null);
//                   setShowBlogPreview(false);
//                 }}
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Blog Post
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>
//                   {editingPost
//                     ? "Edit Blog Post"
//                     : generatedBlog
//                     ? "Review Generated Blog"
//                     : "Create New Blog Post"}
//                 </DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="title">Title *</Label>
//                     <Input
//                       id="title"
//                       value={formData.title}
//                       onChange={(e) => {
//                         const title = e.target.value;
//                         setFormData((prev) => ({
//                           ...prev,
//                           title,
//                           slug: generateSlug(title),
//                         }));
//                       }}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="slug">Slug *</Label>
//                     <Input
//                       id="slug"
//                       value={formData.slug}
//                       onChange={(e) =>
//                         setFormData({ ...formData, slug: e.target.value })
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="subtitle">Subtitle</Label>
//                   <Input
//                     id="subtitle"
//                     value={formData.subtitle}
//                     onChange={(e) =>
//                       setFormData({ ...formData, subtitle: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="excerpt">Excerpt</Label>
//                   <Textarea
//                     id="excerpt"
//                     value={formData.excerpt}
//                     onChange={(e) =>
//                       setFormData({ ...formData, excerpt: e.target.value })
//                     }
//                     rows={3}
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="imageUrl">Featured Image</Label>
//                   <div className="space-y-3">
//                     <Input
//                       id="imageUrl"
//                       value={formData.imageUrl}
//                       onChange={(e) => {
//                         const url = e.target.value;
//                         setFormData((prev) => ({ ...prev, imageUrl: url }));
//                         console.log("Setting image URL:", url);
//                       }}
//                       placeholder="https://example.com/image.jpg or upload below"
//                     />

//                     {formData.imageUrl && (
//                       <div className="relative">
//                         <img
//                           src={formData.imageUrl}
//                           alt="Featured image preview"
//                           className="max-h-40 max-w-full object-contain rounded-lg border"
//                           onError={(e) => {
//                             console.error(
//                               "Image failed to load:",
//                               formData.imageUrl,
//                             );
//                             (e.currentTarget as HTMLImageElement).style.display =
//                               "none";
//                           }}
//                           onLoad={() => {
//                             console.log(
//                               "Image loaded successfully:",
//                               formData.imageUrl,
//                             );
//                           }}
//                         />
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="sm"
//                           className="absolute top-2 right-2"
//                           onClick={() =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               imageUrl: "",
//                             }))
//                           }
//                         >
//                           <X className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     )}

//                     {/* ✅ Cloudinary file upload (same pattern as portfolio) */}
//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium">
//                         Upload Image (Cloudinary)
//                       </Label>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         disabled={uploadingImage}
//                         onChange={async (e) => {
//                           const file = e.target.files?.[0];
//                           if (!file) return;

//                           const token = localStorage.getItem("adminToken");
//                           if (!token) {
//                             alert("No authentication token found");
//                             return;
//                           }

//                           try {
//                             setUploadingImage(true);
//                             const form = new FormData();
//                             // must match backend: cloudinaryUpload.single("image")
//                             form.append("image", file);

//                             const res = await fetch("/api/upload/image", {
//                               method: "POST",
//                               headers: {
//                                 Authorization: `Bearer ${token}`,
//                               },
//                               body: form,
//                             });

//                             const data = await res.json();
//                             if (!res.ok || !data?.imageUrl) {
//                               throw new Error(
//                                 data?.error || "Upload failed",
//                               );
//                             }

//                             setFormData((prev) => ({
//                               ...prev,
//                               imageUrl: data.imageUrl,
//                             }));
//                             console.log(
//                               "Cloudinary image URL set:",
//                               data.imageUrl,
//                             );
//                           } catch (err) {
//                             console.error(err);
//                             alert((err as Error).message);
//                           } finally {
//                             setUploadingImage(false);
//                             // reset input value so same file can be re-selected if needed
//                             e.target.value = "";
//                           }
//                         }}
//                         className="mt-1"
//                       />
//                       {uploadingImage && (
//                         <div className="text-xs text-gray-500">
//                           Uploading to Cloudinary...
//                         </div>
//                       )}
//                     </div>

//                     {/* Existing ObjectUploader (will also work if it posts to /api/upload/image) */}
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg">
//                       <ObjectUploader
//                         onUpload={(url) => {
//                           console.log("Setting image URL from ObjectUploader:", url);
//                           setFormData((prev) => ({ ...prev, imageUrl: url }));
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="content">Content *</Label>
//                   <Textarea
//                     id="content"
//                     value={formData.content}
//                     onChange={(e) =>
//                       setFormData({ ...formData, content: e.target.value })
//                     }
//                     rows={15}
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="tags">Tags (comma-separated)</Label>
//                     <Input
//                       id="tags"
//                       value={formData.tags}
//                       onChange={(e) =>
//                         setFormData({ ...formData, tags: e.target.value })
//                       }
//                       placeholder="AI, Business, Growth"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="author">Author</Label>
//                     <Input
//                       id="author"
//                       value={formData.author}
//                       onChange={(e) =>
//                         setFormData({ ...formData, author: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="readTime">Read Time (minutes)</Label>
//                     <Input
//                       id="readTime"
//                       type="number"
//                       value={formData.readTime}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           readTime: parseInt(e.target.value) || 5,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
//                     <Input
//                       id="metaTitle"
//                       value={formData.metaTitle}
//                       onChange={(e) =>
//                         setFormData({ ...formData, metaTitle: e.target.value })
//                       }
//                       placeholder="SEO optimized title (60 chars max)"
//                       maxLength={60}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="metaDescription">Meta Description</Label>
//                   <Textarea
//                     id="metaDescription"
//                     value={formData.metaDescription}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         metaDescription: e.target.value,
//                       })
//                     }
//                     rows={2}
//                     placeholder="SEO meta description (160 chars max)"
//                     maxLength={160}
//                   />
//                 </div>

//                 <div className="flex gap-6">
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="isPublished"
//                       checked={formData.isPublished}
//                       onCheckedChange={(checked) => {
//                         console.log("Setting published:", checked);
//                         setFormData({ ...formData, isPublished: checked });
//                       }}
//                     />
//                     <Label
//                       htmlFor="isPublished"
//                       className="cursor-pointer"
//                     >
//                       Published {formData.isPublished ? "✓" : "✗"}
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="isFeatured"
//                       checked={formData.isFeatured}
//                       onCheckedChange={(checked) => {
//                         console.log("Setting featured:", checked);
//                         setFormData({ ...formData, isFeatured: checked });
//                       }}
//                     />
//                     <Label
//                       htmlFor="isFeatured"
//                       className="cursor-pointer"
//                     >
//                       Featured {formData.isFeatured ? "✓" : "✗"}
//                     </Label>
//                   </div>
//                 </div>

//                 {/* Generated blog preview */}
//                 {generatedBlog && (
//                   <div className="border p-4 rounded-md bg-gray-50">
//                     <h3 className="text-lg font-semibold mb-2">
//                       Generated Content Preview:
//                     </h3>
//                     <h4 className="text-md font-semibold mb-1">
//                       Title: {generatedBlog.title}
//                     </h4>
//                     {generatedBlog.subtitle && (
//                       <p className="text-sm text-gray-700 mb-1">
//                         Subtitle: {generatedBlog.subtitle}
//                       </p>
//                     )}
//                     {generatedBlog.excerpt && (
//                       <p className="text-sm text-gray-700 mb-1">
//                         Excerpt: {generatedBlog.excerpt}
//                       </p>
//                     )}
//                     <div
//                       className="text-sm text-gray-700 mb-1"
//                       dangerouslySetInnerHTML={{
//                         __html: generatedBlog.content,
//                       }}
//                     />
//                     {generatedBlog.tags &&
//                       generatedBlog.tags.length > 0 && (
//                         <div className="flex gap-1 flex-wrap mt-2">
//                           {generatedBlog.tags.map(
//                             (tag: string, index: number) => (
//                               <Badge
//                                 key={index}
//                                 variant="outline"
//                                 className="text-xs"
//                               >
//                                 {tag}
//                               </Badge>
//                             ),
//                           )}
//                         </div>
//                       )}
//                     {generatedBlog.metaDescription && (
//                       <p className="text-sm text-gray-700 mt-2">
//                         Meta Description: {generatedBlog.metaDescription}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex gap-2">
//                   <Button
//                     type="submit"
//                     disabled={
//                       createMutation.isPending || updateMutation.isPending
//                     }
//                   >
//                     {editingPost
//                       ? "Update"
//                       : generatedBlog
//                       ? "Save Generated Blog"
//                       : "Create Blog Post"}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setIsDialogOpen(false);
//                       resetForm();
//                       setEditingPost(null);
//                       setGeneratedBlog(null);
//                       setShowBlogPreview(false);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         {(blogPosts as BlogPost[]).map((post: BlogPost) => (
//           <Card key={post.id}>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <CardTitle className="flex justify-between items-center gap-2">
//                     {post.title}
//                     {post.isFeatured && (
//                       <Badge variant="secondary">Featured</Badge>
//                     )}
//                     {!post.isPublished && (
//                       <Badge variant="destructive">Draft</Badge>
//                     )}
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleView(post)}
//                       >
//                         <Eye className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEdit(post)}
//                       >
//                         <Edit3 className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => deleteMutation.mutate(post.id)}
//                         disabled={deleteMutation.isPending}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     /{post.slug} • {post.author} • {post.readTime} min read
//                   </p>
//                   {post.subtitle && (
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {post.subtitle}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {post.excerpt && (
//                 <p className="text-sm text-muted-foreground mb-3">
//                   {post.excerpt}
//                 </p>
//               )}
//               {Array.isArray(post.tags) && post.tags.length > 0 && (
//                 <div className="flex gap-1 flex-wrap">
//                   {post.tags.map((tag, index) => (
//                     <Badge key={index} variant="outline" className="text-xs">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {(blogPosts as BlogPost[]).length === 0 && (
//         <Card>
//           <CardContent className="py-8 text-center">
//             <p className="text-muted-foreground">
//               No blog posts found. Create your first blog post to get started.
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {/* Blog Post Viewer Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Eye className="w-5 h-5" />
//               Blog Post Preview
//             </DialogTitle>
//           </DialogHeader>

//           {isLoadingViewPost ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="w-6 h-6 animate-spin" />
//               Loading blog post...
//             </div>
//           ) : viewingPostData ? (
//             <div className="space-y-6">
//               {/* Blog Post Metadata */}
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <span className="font-semibold">ID:</span>{" "}
//                     {viewingPostData.id}
//                   </div>
//                   <div>
//                     <span className="font-semibold">Slug:</span> /
//                     {viewingPostData.slug}
//                   </div>
//                   <div>
//                     <span className="font-semibold">Author:</span>{" "}
//                     {viewingPostData.author}
//                   </div>
//                   <div>
//                     <span className="font-semibold">Read Time:</span>{" "}
//                     {viewingPostData.readTime} min
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="font-semibold">Status:</span>
//                     <Badge
//                       variant={
//                         viewingPostData.isPublished ? "default" : "destructive"
//                       }
//                     >
//                       {viewingPostData.isPublished ? "Published" : "Draft"}
//                     </Badge>
//                     {viewingPostData.isFeatured && (
//                       <Badge variant="secondary">Featured</Badge>
//                     )}
//                   </div>
//                   <div>
//                     <span className="font-semibold">Created:</span>{" "}
//                     {new Date(
//                       viewingPostData.createdAt,
//                     ).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>

//               {/* Blog Post Content */}
//               <div className="space-y-4">
//                 <h1 className="text-3xl font-bold">
//                   {viewingPostData.title}
//                 </h1>

//                 {viewingPostData.subtitle && (
//                   <h2 className="text-xl text-gray-600">
//                     {viewingPostData.subtitle}
//                   </h2>
//                 )}

//                 {viewingPostData.imageUrl && (
//                   <img
//                     src={viewingPostData.imageUrl}
//                     alt={viewingPostData.title}
//                     className="w-full max-h-64 object-cover rounded-lg"
//                   />
//                 )}

//                 {viewingPostData.excerpt && (
//                   <div className="bg-blue-50 p-4 rounded-lg">
//                     <h3 className="font-semibold mb-2">Excerpt:</h3>
//                     <p className="text-gray-700">
//                       {viewingPostData.excerpt}
//                     </p>
//                   </div>
//                 )}

//                 {viewingPostData.metaDescription && (
//                   <div className="bg-green-50 p-4 rounded-lg">
//                     <h3 className="font-semibold mb-2">Meta Description:</h3>
//                     <p className="text-gray-700">
//                       {viewingPostData.metaDescription}
//                     </p>
//                   </div>
//                 )}

//                 {Array.isArray(viewingPostData.tags) &&
//                   viewingPostData.tags.length > 0 && (
//                     <div>
//                       <h3 className="font-semibold mb-2">Tags:</h3>
//                       <div className="flex gap-2 flex-wrap">
//                         {viewingPostData.tags.map(
//                           (tag: string, index: number) => (
//                             <Badge key={index} variant="outline">
//                               {tag}
//                             </Badge>
//                           ),
//                         )}
//                       </div>
//                     </div>
//                   )}

//                 <div className="border-t pt-4">
//                   <h3 className="font-semibold mb-4">Content:</h3>
//                   <div
//                     className="prose prose-lg max-w-none"
//                     style={{ whiteSpace: "pre-wrap" }}
//                   >
//                     {viewingPostData.content}
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-2 pt-4 border-t">
//                 <Button
//                   variant="outline"
//                   onClick={() => handleEdit(viewingPostData)}
//                 >
//                   <Edit3 className="w-4 h-4 mr-2" />
//                   Edit Post
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => handleViewLive(viewingPostData)}
//                 >
//                   <Globe className="w-4 h-4 mr-2" />
//                   View Live
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsViewDialogOpen(false)}
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Blog post not found</p>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }










import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Edit3,
  Plus,
  Eye,
  Wand2,
  Loader2,
  Globe,
  X,
  GripVertical,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { ObjectUploader } from "./object-uploader";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string; // JSON string for structured content OR legacy string
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

type SectionType = "content" | "process";

type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

type SectionCTA = {
  enabled: boolean;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

type SectionLink = {
  id: string;
  label: string;
  url: string;
};

type BlogSection = {
  id: string;
  type: SectionType;
  heading: string;
  subHeading: string;
  content: string;
  images: string[];
  steps: ProcessStep[];
  cta: SectionCTA;
  links: SectionLink[];
};

type TocItem = {
  id: string;
  label: string;
  anchor: string;
};

type StructuredBlogContentV1 = {
  version: 1;
  sections: BlogSection[];
  tocOrder: string[];
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? (crypto as any).randomUUID()
    : `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;

const slugify = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const isProbablyJson = (value: string) => {
  const v = (value || "").trim();
  if (!v) return false;
  if (!(v.startsWith("{") || v.startsWith("["))) return false;
  try {
    JSON.parse(v);
    return true;
  } catch {
    return false;
  }
};

const isProbablyHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value || "");

function defaultSection(type: SectionType): BlogSection {
  return {
    id: uid(),
    type,
    heading: "",
    subHeading: "",
    content: "",
    images: [],
    steps: type === "process" ? [{ id: uid(), title: "Step 1", description: "" }] : [],
    cta: {
      enabled: false,
      heading: "",
      description: "",
      buttonText: "",
      buttonLink: "",
    },
    links: [],
  };
}

function extractTocItemsFromSections(sections: BlogSection[]): TocItem[] {
  const items: TocItem[] = [];

  sections.forEach((sec, sIdx) => {
    const h = sec.heading?.trim();
    if (h) {
      const anchor = `sec-${slugify(h)}-${sIdx + 1}`;
      items.push({ id: `sec:${sec.id}`, label: h, anchor });
    }

    if (sec.type === "process" && Array.isArray(sec.steps)) {
      sec.steps.forEach((st, stIdx) => {
        const t = st.title?.trim();
        if (t) {
          const anchor = `step-${slugify(t)}-${sIdx + 1}-${stIdx + 1}`;
          items.push({ id: `step:${sec.id}:${st.id}`, label: t, anchor });
        }
      });
    }
  });

  return items;
}

function syncTocOrder(prevOrder: string[], items: TocItem[]): string[] {
  const set = new Set(items.map((i) => i.id));
  const kept = prevOrder.filter((id) => set.has(id));
  const missing = items.map((i) => i.id).filter((id) => !kept.includes(id));
  return [...kept, ...missing];
}

async function uploadImagesToCloudinary(files: File[], token: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.imageUrl) {
      throw new Error(data?.error || "Upload failed");
    }
    urls.push(data.imageUrl);
  }
  return urls;
}

/**
 * ✅ AI content splitter
 * Handles content like:
 *  # Title
 *  ## Section
 *  ### Sub / Step / 1. Tip
 *
 * Rules:
 * - Split by "## " => sections
 * - Within a section, if it contains many "### " and they look like steps (1., Step, Tip),
 *   convert section to type "process" and map those as steps.
 * - Any remaining text becomes section.content
 */
function splitAiContentToSections(raw: string): BlogSection[] {
  const text = (raw || "").replace(/\r\n/g, "\n").trim();
  if (!text) return [defaultSection("content")];

  // remove leading "# Title" line if present (we already store blog title separately)
  const lines = text.split("\n");
  if (lines[0]?.trim().startsWith("# ") && !lines[0]?.trim().startsWith("## ")) {
    lines.shift();
  }
  const cleaned = lines.join("\n").trim();

  // Split into blocks by "## "
  const parts: { heading: string; body: string }[] = [];
  const re = /^##\s+(.+)$/gm;

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let lastHeading = "";
  let lastHeadingStart = -1;

  // find first "##"
  const first = re.exec(cleaned);
  if (!first) {
    // no "##" — keep as single section content
    const s = defaultSection("content");
    s.content = cleaned;
    return [s];
  }

  // reset and iterate to gather ranges
  re.lastIndex = 0;
  while ((match = re.exec(cleaned))) {
    const heading = (match[1] || "").trim();
    const start = match.index;
    if (lastHeadingStart >= 0) {
      const body = cleaned.slice(lastIndex, start).trim();
      parts.push({ heading: lastHeading, body });
    }
    lastHeading = heading;
    lastHeadingStart = start;
    // body begins after this heading line
    const afterLineIdx = cleaned.indexOf("\n", re.lastIndex);
    lastIndex = afterLineIdx === -1 ? cleaned.length : afterLineIdx + 1;
  }
  // push last
  const lastBody = cleaned.slice(lastIndex).trim();
  parts.push({ heading: lastHeading, body: lastBody });

  const sections: BlogSection[] = parts.map((p) => {
    const sec = defaultSection("content");
    sec.heading = p.heading;

    // Try to extract a first sentence/short line as subHeading if body begins with something short
    const bodyLines = (p.body || "").split("\n").map((l) => l.trim());
    const firstNonEmptyIdx = bodyLines.findIndex((l) => !!l);
    if (firstNonEmptyIdx >= 0) {
      const firstLine = bodyLines[firstNonEmptyIdx];
      // if it looks like a short subtitle and NOT a list or markdown heading
      if (
        firstLine.length > 0 &&
        firstLine.length <= 120 &&
        !firstLine.startsWith("###") &&
        !firstLine.startsWith("-") &&
        !/^\d+\./.test(firstLine)
      ) {
        // keep it as subHeading and remove from content
        sec.subHeading = firstLine;
        bodyLines.splice(firstNonEmptyIdx, 1);
      }
    }
    let body = bodyLines.join("\n").trim();

    // Detect "###" blocks (candidates for steps)
    const stepBlocks: { title: string; desc: string }[] = [];
    const stepRe = /^###\s+(.+)$/gm;

    const stepMatches: { title: string; start: number; after: number }[] = [];
    let sm: RegExpExecArray | null;
    while ((sm = stepRe.exec(body))) {
      const title = (sm[1] || "").trim();
      const start = sm.index;
      const afterLineIdx = body.indexOf("\n", stepRe.lastIndex);
      const after = afterLineIdx === -1 ? body.length : afterLineIdx + 1;
      stepMatches.push({ title, start, after });
    }

    if (stepMatches.length >= 2) {
      // classify as "process" if step titles look like tips/steps/numbered
      const looksLikeStep = (t: string) =>
        /^(\d+[\.\)]\s*|step\s*\d+|tip\s*\d+|actionable|checklist)/i.test(t);

      const score = stepMatches.reduce((acc, s) => acc + (looksLikeStep(s.title) ? 1 : 0), 0);
      if (score >= 1) {
        // build step blocks
        for (let i = 0; i < stepMatches.length; i++) {
          const cur = stepMatches[i];
          const next = stepMatches[i + 1];
          const desc = body.slice(cur.after, next ? next.start : body.length).trim();
          stepBlocks.push({ title: cur.title, desc });
        }

        // remove all step content from body (keep intro before first step)
        const intro = body.slice(0, stepMatches[0].start).trim();

        const processSec = defaultSection("process");
        processSec.heading = sec.heading;
        processSec.subHeading = sec.subHeading;
        processSec.content = intro; // optional intro above steps
        processSec.steps = stepBlocks.map((b, i) => ({
          id: uid(),
          title: b.title || `Step ${i + 1}`,
          description: b.desc,
        }));
        return processSec;
      }
    }

    // normal section
    sec.content = body;
    return sec;
  });

  return sections.length ? sections : [defaultSection("content")];
}

export function BlogPostsManager() {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  // Builder states
  const [sections, setSections] = useState<BlogSection[]>([defaultSection("content")]);
  const [tocOrder, setTocOrder] = useState<string[]>([]);
  const [tocDraggingId, setTocDraggingId] = useState<string | null>(null);
  const [uploadingSectionImagesId, setUploadingSectionImagesId] = useState<string | null>(null);

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
    metaTitle: "",
  });

  const [generateData, setGenerateData] = useState({
    title: "",
    keywords: "",
    category: "Digital Marketing",
    targetAudience: "business owners",
  });

  const queryClient = useQueryClient();

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["/api/admin/blog-posts"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api/admin/blog-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch blog posts: ${response.status}`);
      return response.json();
    },
  });

  const { data: viewingPostData, isLoading: isLoadingViewPost } = useQuery({
    queryKey: ["/api/admin/blog-posts", viewingPost?.id],
    queryFn: async () => {
      if (!viewingPost?.id) return null;

      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`/api/admin/blog-posts/${viewingPost.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch blog post: ${response.status}`);
      return response.json();
    },
    enabled: !!viewingPost?.id && isViewDialogOpen,
  });

  const tocItems = useMemo(() => extractTocItemsFromSections(sections), [sections]);

  useEffect(() => {
    setTocOrder((prev) => syncTocOrder(prev, tocItems));
  }, [tocItems]);

  // Links handlers
  const addSectionLink = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, links: [...(s.links || []), { id: uid(), label: "", url: "" }] }
          : s,
      ),
    );
  };

  const updateSectionLink = (sectionId: string, linkId: string, patch: Partial<SectionLink>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, links: (s.links || []).map((l) => (l.id === linkId ? { ...l, ...patch } : l)) },
      ),
    );
  };

  const removeSectionLink = (sectionId: string, linkId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : { ...s, links: (s.links || []).filter((l) => l.id !== linkId) },
      ),
    );
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const generateBlogMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api/admin/generate-single-blog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          keywords: data.keywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean),
          category: data.category,
          targetAudience: data.targetAudience,
        }),
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

      // ✅ Split AI content into builder sections (instead of 1 big textarea)
      const aiRaw = String(data?.blog?.content || "");
      const aiSections = splitAiContentToSections(aiRaw);

      // If AI returns "## Call to Action" block, make it CTA on last section automatically (nice UX)
      // We'll only do a light auto-detect without forcing
      const last = aiSections[aiSections.length - 1];
      if (last?.heading?.toLowerCase().includes("call to action")) {
        last.cta = {
          enabled: true,
          heading: last.heading || "Call to Action",
          description: last.content?.slice(0, 400) || "",
          buttonText: "Contact Us",
          buttonLink: "/contact",
        };
        last.content = "";
        last.heading = "Call to Action";
      }

      setSections(aiSections.length ? aiSections : [defaultSection("content")]);
      setTocOrder([]);

      setFormData((prev) => ({
        ...prev,
        title: data?.blog?.title || prev.title,
        subtitle: data?.blog?.subtitle || prev.subtitle,
        excerpt: data?.blog?.excerpt || prev.excerpt,
        slug: generateSlug(data?.blog?.title || prev.title || prev.slug),
        tags: Array.isArray(data?.blog?.tags) ? data.blog.tags.join(", ") : prev.tags,
        metaDescription: data?.blog?.metaDescription || prev.metaDescription,
      }));

      setIsDialogOpen(true);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create blog post: ${res.status} - ${errorText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setIsDialogOpen(false);
      resetForm();
      setGeneratedBlog(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update blog post: ${res.status} - ${errorText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingPost(null);
      setGeneratedBlog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete blog post: ${res.status} - ${errorText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
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
      metaTitle: "",
    });
    setSections([defaultSection("content")]);
    setTocOrder([]);
  };

  const resetGenerateForm = () => {
    setGenerateData({
      title: "",
      keywords: "",
      category: "Digital Marketing",
      targetAudience: "business owners",
    });
  };

  const parseContentToBuilder = (rawContent: string) => {
    if (isProbablyJson(rawContent)) {
      try {
        const parsed = JSON.parse(rawContent);
        if (parsed?.version === 1 && Array.isArray(parsed?.sections)) {
          const safeSections: BlogSection[] = parsed.sections.map((s: any) => ({
            id: s?.id || uid(),
            type: s?.type === "process" ? "process" : "content",
            heading: s?.heading || "",
            subHeading: s?.subHeading || "",
            content: s?.content || "",
            images: Array.isArray(s?.images) ? s.images.filter(Boolean) : [],
            steps: Array.isArray(s?.steps)
              ? s.steps.map((st: any) => ({
                id: st?.id || uid(),
                title: st?.title || "",
                description: st?.description || "",
              }))
              : [],
            cta: {
              enabled: !!s?.cta?.enabled,
              heading: s?.cta?.heading || "",
              description: s?.cta?.description || "",
              buttonText: s?.cta?.buttonText || "",
              buttonLink: s?.cta?.buttonLink || "",
            },
            links: Array.isArray(s?.links)
              ? s.links
                .map((l: any) => ({
                  id: l?.id || uid(),
                  label: String(l?.label || ""),
                  url: String(l?.url || ""),
                }))
                .filter((l: any) => l.label.trim() || l.url.trim())
              : [],
          }));

          setSections(safeSections.length ? safeSections : [defaultSection("content")]);
          setTocOrder(Array.isArray(parsed?.tocOrder) ? parsed.tocOrder : []);
          return;
        }
      } catch {
        // fallthrough
      }
    }

    // ✅ Legacy plain string => split it like AI content (best UX)
    const legacySections = splitAiContentToSections(rawContent || "");
    setSections(legacySections.length ? legacySections : [defaultSection("content")]);
    setTocOrder([]);
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
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      author: post.author,
      readTime: post.readTime,
      isPublished: post.isPublished,
      isFeatured: post.isFeatured,
      metaDescription: post.metaDescription || "",
      metaTitle: (post as any).metaTitle || "",
    });

    parseContentToBuilder(post.content);
    setIsDialogOpen(true);
  };

  const handleView = (post: BlogPost) => {
    setViewingPost(post);
    setIsViewDialogOpen(true);
  };

  const handleViewLive = (post: BlogPost) => {
    window.open(`/blog/${post.slug}`, "_blank", "noopener,noreferrer");
  };

  // Section ops
  const addSection = (type: SectionType) => setSections((prev) => [...prev, defaultSection(type)]);

  const removeSection = (sectionId: string) => {
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== sectionId);
      return next.length ? next : [defaultSection("content")];
    });
  };

  const moveSection = (sectionId: string, dir: "up" | "down") => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx < 0) return prev;
      const next = [...prev];
      const swapWith = dir === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  const updateSection = (sectionId: string, patch: Partial<BlogSection>) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)));
  };

  const addStep = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const steps = Array.isArray(s.steps) ? s.steps : [];
        return {
          ...s,
          steps: [...steps, { id: uid(), title: `Step ${steps.length + 1}`, description: "" }],
        };
      }),
    );
  };

  const removeStep = (sectionId: string, stepId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const steps = (s.steps || []).filter((st) => st.id !== stepId);
        return {
          ...s,
          steps: steps.length ? steps : [{ id: uid(), title: "Step 1", description: "" }],
        };
      }),
    );
  };

  const updateStep = (sectionId: string, stepId: string, patch: Partial<ProcessStep>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          steps: (s.steps || []).map((st) => (st.id === stepId ? { ...st, ...patch } : st)),
        };
      }),
    );
  };

  const removeSectionImage = (sectionId: string, url: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, images: s.images.filter((i) => i !== url) } : s)),
    );
  };

  const handleSectionImagesUpload = async (sectionId: string, files: FileList | null) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("No authentication token found");
      return;
    }
    const fileArr = files ? Array.from(files) : [];
    if (!fileArr.length) return;

    try {
      setUploadingSectionImagesId(sectionId);
      const urls = await uploadImagesToCloudinary(fileArr, token);

      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, images: Array.from(new Set([...(s.images || []), ...urls])) } : s,
        ),
      );
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "Failed to upload images");
    } finally {
      setUploadingSectionImagesId(null);
    }
  };

  // TOC drag
  const orderedTocItems = useMemo(() => {
    const map = new Map(tocItems.map((i) => [i.id, i]));
    return tocOrder.map((id) => map.get(id)).filter(Boolean) as TocItem[];
  }, [tocItems, tocOrder]);

  const onTocDragStart = (id: string) => setTocDraggingId(id);

  const onTocDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onTocDrop = (targetId: string) => {
    if (!tocDraggingId || tocDraggingId === targetId) {
      setTocDraggingId(null);
      return;
    }
    setTocOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(tocDraggingId);
      const to = next.indexOf(targetId);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, tocDraggingId);
      return next;
    });
    setTocDraggingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    const hasAnything = sections.some((s) => {
      if (s.heading.trim()) return true;
      if (s.subHeading.trim()) return true;
      if (s.content.trim()) return true;
      if (Array.isArray(s.images) && s.images.length) return true;
      if (Array.isArray(s.links) && s.links.some((l) => l.label.trim() || l.url.trim())) return true;
      if (s.type === "process" && (s.steps || []).some((st) => st.title.trim() || st.description.trim()))
        return true;
      return false;
    });

    if (!hasAnything) {
      alert("Please add at least one section with content.");
      return;
    }

    const structured: StructuredBlogContentV1 = {
      version: 1,
      sections: sections.map((s) => ({
        ...s,
        links: Array.isArray(s.links)
          ? s.links
            .map((l) => ({ ...l, label: (l.label || "").trim(), url: (l.url || "").trim() }))
            .filter((l) => l.label || l.url)
          : [],
      })),
      tocOrder: syncTocOrder(tocOrder, tocItems),
    };

    const processedFormData = {
      ...formData,
      content: JSON.stringify(structured),
      tags: formData.tags
        ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
        : [],
    };

    if (editingPost) updateMutation.mutate({ id: editingPost.id, data: processedFormData });
    else createMutation.mutate(processedFormData);
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateBlogMutation.mutate(generateData);
  };

  const renderStructuredPreview = (rawContent: string) => {
    if (isProbablyJson(rawContent)) {
      try {
        const parsed = JSON.parse(rawContent) as StructuredBlogContentV1;
        if (parsed?.version === 1 && Array.isArray(parsed?.sections)) {
          const secs = parsed.sections as BlogSection[];
          const toc = extractTocItemsFromSections(secs);
          const order = syncTocOrder(Array.isArray(parsed.tocOrder) ? parsed.tocOrder : [], toc);
          const map = new Map(toc.map((i) => [i.id, i]));
          const ordered = order.map((id) => map.get(id)).filter(Boolean) as TocItem[];

          return (
            <div className="space-y-10">
              {ordered.length > 0 && (
                <div className="border rounded-xl p-5 bg-gray-50">
                  <div className="font-semibold mb-3 flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Table of Contents
                  </div>
                  <ul className="space-y-2">
                    {ordered.map((i) => (
                      <li key={i.id} className="text-sm">
                        <a className="text-blue-600 hover:underline" href={`#${i.anchor}`}>
                          {i.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {secs.map((sec, sIdx) => {
                const secAnchor = sec.heading?.trim() ? `sec-${slugify(sec.heading)}-${sIdx + 1}` : undefined;

                return (
                  <div key={sec.id} className="space-y-4">
                    {sec.heading?.trim() && (
                      <h2 id={secAnchor} className="text-2xl font-bold tracking-tight">
                        {sec.heading}
                      </h2>
                    )}
                    {sec.subHeading?.trim() && (
                      <p className="text-base text-gray-600 leading-relaxed">{sec.subHeading}</p>
                    )}

                    {sec.type === "process" ? (
                      <div className="space-y-3">
                        {sec.content?.trim() && (
                          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{sec.content}</div>
                        )}

                        <div className="grid gap-3">
                          {(sec.steps || []).map((st, stIdx) => {
                            const stepAnchor = st.title?.trim()
                              ? `step-${slugify(st.title)}-${sIdx + 1}-${stIdx + 1}`
                              : undefined;

                            return (
                              <div key={st.id} className="border rounded-xl p-4 bg-white">
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5">
                                    <Badge variant="secondary">Step {stIdx + 1}</Badge>
                                  </div>
                                  <div className="flex-1">
                                    {st.title?.trim() && (
                                      <div id={stepAnchor} className="font-semibold">
                                        {st.title}
                                      </div>
                                    )}
                                    {st.description?.trim() && (
                                      <div className="text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                                        {st.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <>
                        {sec.content?.trim() && (
                          <div className="prose prose-lg max-w-none leading-relaxed">
                            {isProbablyHtml(sec.content) ? (
                              <div dangerouslySetInnerHTML={{ __html: sec.content }} />
                            ) : (
                              <div style={{ whiteSpace: "pre-wrap" }}>{sec.content}</div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {Array.isArray(sec.images) && sec.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {sec.images.map((url) => (
                          <img
                            key={url}
                            src={url}
                            alt="Section"
                            className="w-full h-40 object-cover rounded-xl border"
                          />
                        ))}
                      </div>
                    )}

                    {Array.isArray(sec.links) && sec.links.length > 0 && (
                      <div className="border rounded-xl p-4 bg-gray-50">
                        <div className="font-semibold mb-2 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          References
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                          {sec.links.map((l) => (
                            <li key={l.id} className="text-sm">
                              <a
                                href={l.url}
                                target={l.url?.startsWith("/") ? "_self" : "_blank"}
                                rel="noreferrer noopener"
                                className="text-blue-600 hover:underline break-all"
                              >
                                {l.label?.trim() || l.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {sec.cta?.enabled && (
                      <div className="border rounded-xl p-5 bg-gradient-to-r from-gray-50 to-white">
                        {sec.cta.heading?.trim() && (
                          <div className="text-lg font-semibold">{sec.cta.heading}</div>
                        )}
                        {sec.cta.description?.trim() && (
                          <div className="text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                            {sec.cta.description}
                          </div>
                        )}
                        {sec.cta.buttonText?.trim() && sec.cta.buttonLink?.trim() && (
                          <div className="mt-3">
                            <a
                              href={sec.cta.buttonLink}
                              target={sec.cta.buttonLink.startsWith("/") ? "_self" : "_blank"}
                              rel="noreferrer noopener"
                              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                            >
                              {sec.cta.buttonText}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
      } catch {
        // fallthrough
      }
    }

    // fallback (legacy)
    return (
      <div className="prose prose-lg max-w-none" style={{ whiteSpace: "pre-wrap" }}>
        {rawContent}
      </div>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-sm text-muted-foreground">
            Create structured blogs with headings, steps, images, references, CTA and draggable TOC.
          </p>
        </div>

        <div className="flex gap-2">
          {/* AI Generator */}
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetGenerateForm}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="generate-category">Category</Label>
                    <Select
                      value={generateData.category}
                      onValueChange={(value) => setGenerateData({ ...generateData, category: value })}
                    >
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
                    <Select
                      value={generateData.targetAudience}
                      onValueChange={(value) => setGenerateData({ ...generateData, targetAudience: value })}
                    >
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
                        Generate
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Create/Edit */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingPost(null);
                  setGeneratedBlog(null);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Blog Post
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Edit Blog Post" : generatedBlog ? "Review Generated Blog" : "Create New Blog Post"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Top meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title,
                          slug: generateSlug(title),
                        }));
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Short supporting line under the title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Input
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Used in cards / SEO snippets"
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <Card className="border">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Featured Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg or upload below"
                    />

                    {formData.imageUrl && (
                      <div className="relative">
                        <img
                          src={formData.imageUrl}
                          alt="Featured preview"
                          className="w-full max-h-64 object-cover rounded-xl border"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Upload Image (Cloudinary)</Label>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const token = localStorage.getItem("adminToken");
                          if (!token) {
                            alert("No authentication token found");
                            return;
                          }

                          try {
                            setUploadingImage(true);
                            const form = new FormData();
                            form.append("image", file);

                            const res = await fetch("/api/upload/image", {
                              method: "POST",
                              headers: { Authorization: `Bearer ${token}` },
                              body: form,
                            });

                            const data = await res.json();
                            if (!res.ok || !data?.imageUrl) throw new Error(data?.error || "Upload failed");

                            setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
                          } catch (err) {
                            console.error(err);
                            alert((err as Error).message);
                          } finally {
                            setUploadingImage(false);
                            e.target.value = "";
                          }
                        }}
                        className="mt-1"
                      />
                      {uploadingImage && <div className="text-xs text-gray-500">Uploading...</div>}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl">
                      <ObjectUploader onUpload={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))} />
                    </div>
                  </CardContent>
                </Card>

                {/* Builder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Sections */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold flex items-center gap-2">
                          <AlignLeft className="w-4 h-4" />
                          Blog Content Sections
                        </div>
                        <div className="text-sm text-gray-500">
                          Add multiple content/process sections. Each section can have images, references, optional CTA.
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" onClick={() => addSection("content")}>
                          <Plus className="w-4 h-4 mr-2" />
                          Content Section
                        </Button>
                        <Button type="button" variant="outline" onClick={() => addSection("process")}>
                          <Plus className="w-4 h-4 mr-2" />
                          Process Section
                        </Button>
                      </div>
                    </div>

                    {sections.map((sec, idx) => (
                      <Card key={sec.id} className="border rounded-2xl">
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{sec.type === "process" ? "Process" : "Content"}</Badge>
                              <div className="font-semibold">
                                Section {idx + 1}
                                {sec.heading?.trim() ? ` — ${sec.heading}` : ""}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => moveSection(sec.id, "up")}
                                disabled={idx === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => moveSection(sec.id, "down")}
                                disabled={idx === sections.length - 1}
                              >
                                ↓
                              </Button>
                              <Button type="button" size="sm" variant="destructive" onClick={() => removeSection(sec.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Heading</Label>
                              <Input
                                value={sec.heading}
                                onChange={(e) => updateSection(sec.id, { heading: e.target.value })}
                                placeholder="Section heading"
                              />
                            </div>
                            <div>
                              <Label>SubHeading</Label>
                              <Input
                                value={sec.subHeading}
                                onChange={(e) => updateSection(sec.id, { subHeading: e.target.value })}
                                placeholder="Section subheading"
                              />
                            </div>
                          </div>

                          {sec.type === "content" ? (
                            <div>
                              <Label>Content</Label>
                              <Textarea
                                value={sec.content}
                                onChange={(e) => updateSection(sec.id, { content: e.target.value })}
                                rows={7}
                                placeholder="Write content here..."
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                AI content with HTML is supported and will render in preview.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Process Steps</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addStep(sec.id)}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Step
                                </Button>
                              </div>

                              <div className="space-y-3">
                                {(sec.steps || []).map((st, stIdx) => (
                                  <div key={st.id} className="border rounded-xl p-3 space-y-2 bg-white">
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium">Step {stIdx + 1}</div>
                                      <Button type="button" variant="destructive" size="sm" onClick={() => removeStep(sec.id, st.id)}>
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <Label>Step Title</Label>
                                        <Input
                                          value={st.title}
                                          onChange={(e) => updateStep(sec.id, st.id, { title: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Step Description</Label>
                                        <Input
                                          value={st.description}
                                          onChange={(e) => updateStep(sec.id, st.id, { description: e.target.value })}
                                          placeholder="Short description"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Images */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Images (single / multiple)</Label>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <ImageIcon className="w-4 h-4" />
                                Upload per section
                              </div>
                            </div>

                            <div className="flex gap-2 items-center">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={uploadingSectionImagesId === sec.id}
                                onChange={(e) => {
                                  handleSectionImagesUpload(sec.id, e.target.files);
                                  e.currentTarget.value = "";
                                }}
                              />
                              {uploadingSectionImagesId === sec.id && (
                                <span className="text-xs text-gray-500">Uploading...</span>
                              )}
                            </div>

                            {sec.images?.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {sec.images.map((url) => (
                                  <div key={url} className="relative">
                                    <img src={url} alt="Section" className="w-full h-28 object-cover rounded-xl border" />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute top-2 right-2"
                                      onClick={() => removeSectionImage(sec.id, url)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* References */}
                          <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Hyperlinks / References (Optional)
                              </div>
                              <Button type="button" size="sm" variant="outline" onClick={() => addSectionLink(sec.id)}>
                                + Add Link
                              </Button>
                            </div>

                            {(!sec.links || sec.links.length === 0) && (
                              <p className="text-sm text-gray-500">
                                Add reference links for this section (sources, citations, internal pages).
                              </p>
                            )}

                            <div className="space-y-2">
                              {(sec.links || []).map((link) => (
                                <div key={link.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                                  <Input
                                    className="md:col-span-2"
                                    placeholder="Label (e.g., Google Search Central)"
                                    value={link.label}
                                    onChange={(e) => updateSectionLink(sec.id, link.id, { label: e.target.value })}
                                  />
                                  <Input
                                    className="md:col-span-2"
                                    placeholder="https://example.com"
                                    value={link.url}
                                    onChange={(e) => updateSectionLink(sec.id, link.id, { url: e.target.value })}
                                  />
                                  <Button type="button" variant="destructive" size="sm" onClick={() => removeSectionLink(sec.id, link.id)}>
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">CTA (Optional)</div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={sec.cta.enabled}
                                  onCheckedChange={(checked) => updateSection(sec.id, { cta: { ...sec.cta, enabled: checked } })}
                                />
                                <span className="text-sm text-gray-600">{sec.cta.enabled ? "Enabled" : "Disabled"}</span>
                              </div>
                            </div>

                            {sec.cta.enabled && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>CTA Heading</Label>
                                  <Input
                                    value={sec.cta.heading || ""}
                                    onChange={(e) => updateSection(sec.id, { cta: { ...sec.cta, heading: e.target.value } })}
                                    placeholder="e.g., Want us to do this for you?"
                                  />
                                </div>
                                <div>
                                  <Label>CTA Button Text</Label>
                                  <Input
                                    value={sec.cta.buttonText || ""}
                                    onChange={(e) => updateSection(sec.id, { cta: { ...sec.cta, buttonText: e.target.value } })}
                                    placeholder="e.g., Book a Call"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>CTA Description</Label>
                                  <Textarea
                                    value={sec.cta.description || ""}
                                    onChange={(e) => updateSection(sec.id, { cta: { ...sec.cta, description: e.target.value } })}
                                    rows={2}
                                    placeholder="Short supporting text..."
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>CTA Button Link</Label>
                                  <Input
                                    value={sec.cta.buttonLink || ""}
                                    onChange={(e) => updateSection(sec.id, { cta: { ...sec.cta, buttonLink: e.target.value } })}
                                    placeholder="https://... or /contact"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* TOC */}
                  <div className="space-y-3">
                    <Card className="border rounded-2xl sticky top-4">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ListChecks className="w-4 h-4" />
                          Table of Contents
                        </CardTitle>
                        <p className="text-xs text-gray-500">Auto from headings + step titles. Drag to reorder.</p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {orderedTocItems.length === 0 ? (
                          <div className="text-sm text-gray-500">Add headings or step titles to generate TOC.</div>
                        ) : (
                          <div className="space-y-2">
                            {orderedTocItems.map((item) => (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={() => onTocDragStart(item.id)}
                                onDragOver={onTocDragOver}
                                onDrop={() => onTocDrop(item.id)}
                                className={`flex items-center gap-2 border rounded-xl px-3 py-2 bg-white cursor-move ${tocDraggingId === item.id ? "opacity-60" : ""
                                  }`}
                                title="Drag to reorder"
                              >
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                <div className="text-sm font-medium line-clamp-2">{item.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border rounded-2xl">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Save Format</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-gray-600">
                        Content is saved as JSON in the <b>content</b> field (no DB/model changes). Legacy text posts are auto-split into sections when you edit.
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Tags/Author/SEO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Publish switches */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                    />
                    <Label htmlFor="isPublished" className="cursor-pointer">
                      Published {formData.isPublished ? "✓" : "✗"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">
                      Featured {formData.isFeatured ? "✓" : "✗"}
                    </Label>
                  </div>
                </div>

                {/* Actions */}
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

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(blogPosts as BlogPost[]).map((post: BlogPost) => (
          <Card key={post.id} className="rounded-2xl">
            <CardHeader>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-bold">{post.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {post.isFeatured && <Badge variant="secondary">Featured</Badge>}
                      {!post.isPublished && <Badge variant="destructive">Draft</Badge>}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    /{post.slug} • {post.author} • {post.readTime} min read
                  </p>

                  {post.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.subtitle}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(post)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
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
              {post.excerpt && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.excerpt}</p>}
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
        <Card className="rounded-2xl">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No blog posts found. Create your first blog post to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* Viewer */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Blog Post Preview
            </DialogTitle>
          </DialogHeader>

          {isLoadingViewPost ? (
            <div className="flex justify-center py-8 gap-2 items-center">
              <Loader2 className="w-6 h-6 animate-spin" />
              Loading blog post...
            </div>
          ) : viewingPostData ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
                    {viewingPostData.isFeatured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span> {new Date(viewingPostData.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">{viewingPostData.title}</h1>

                {viewingPostData.subtitle && (
                  <p className="text-lg text-gray-600 leading-relaxed">{viewingPostData.subtitle}</p>
                )}

                {viewingPostData.imageUrl && (
                  <img
                    src={viewingPostData.imageUrl}
                    alt={viewingPostData.title}
                    className="w-full max-h-72 object-cover rounded-2xl border"
                  />
                )}

                {viewingPostData.excerpt && (
                  <div className="bg-blue-50 p-4 rounded-2xl">
                    <h3 className="font-semibold mb-2">Excerpt</h3>
                    <p className="text-gray-700 leading-relaxed">{viewingPostData.excerpt}</p>
                  </div>
                )}

                {viewingPostData.metaDescription && (
                  <div className="bg-green-50 p-4 rounded-2xl">
                    <h3 className="font-semibold mb-2">Meta Description</h3>
                    <p className="text-gray-700 leading-relaxed">{viewingPostData.metaDescription}</p>
                  </div>
                )}

                {Array.isArray(viewingPostData.tags) && viewingPostData.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex gap-2 flex-wrap">
                      {viewingPostData.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Content</h3>
                  {renderStructuredPreview(viewingPostData.content)}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => handleEdit(viewingPostData)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Post
                </Button>
                <Button variant="outline" onClick={() => handleViewLive(viewingPostData)}>
                  <Globe className="w-4 h-4 mr-2" />
                  View Live
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
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

