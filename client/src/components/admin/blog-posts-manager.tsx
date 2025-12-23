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

type BlogCategory = "SEO" | "PPC" | "Web Development" | "App Development";

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

  // ✅ NEW: category for blog post (SEO / PPC / Web / App)
  category: BlogCategory;
}

type SectionType = "content" | "process";

type SectionLink = {
  id: string;
  label: string;
  url: string;

  // ✅ NEW: inline link formatting options
  bold?: boolean;
  italic?: boolean;
  fontSize?: "sm" | "base" | "lg" | "xl";
};

type ProcessStep = {
  id: string;
  title: string;
  description: string;

  /**
   * ✅ IMPORTANT UPDATE (as per your request):
   * Step "References" (list shown under step)
   */
  links?: SectionLink[];

  /**
   * ✅ IMPORTANT UPDATE:
   * Step "Inline Word Links" (auto link inside step description)
   */
  inlineLinks?: SectionLink[];
};

type SectionCTA = {
  enabled: boolean;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
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

  /**
   * ✅ IMPORTANT UPDATE (as per your request):
   * Section "References" (shown as list under section)
   */
  links: SectionLink[];

  /**
   * ✅ IMPORTANT UPDATE:
   * Section "Inline Word Links" (auto link inside section content)
   * This is SEPARATE from section links/references list.
   */
  inlineLinks: SectionLink[];
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

// "# Title ## Intro In the ... ### Tip 1 ..."
function normalizeAiMarkdown(raw: string) {
  let t = (raw || "").replace(/\r\n/g, "\n").trim();
  if (!t) return "";

  // Force headings to new lines when preceded by space
  t = t
    .replace(/(\s)(##\s+)/g, "\n## ")
    .replace(/(\s)(###\s+)/g, "\n### ")
    .replace(/(\s)(#\s+)/g, "\n# ");

  t = t.replace(/^(#{2,3}\s+[^\n]+)\s+(?=\S)/gm, "$1\n");

  // Normalize multiple blank lines
  t = t.replace(/\n{3,}/g, "\n\n").trim();

  return t;
}

function sanitizeUrl(u: string) {
  const url = (u || "").trim();
  if (!url) return "";
  if (url.startsWith("/")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return "";
}

/**
 * ✅ IMPORTANT UPDATE (as per your request):
 * Extract markdown links + bare URLs into "INLINE WORD LINKS" (NOT references list)
 * So inline linking is independent.
 */
function extractInlineLinksFromText(
  text: string,
): { cleaned: string; inlineLinks: SectionLink[] } {
  let cleaned = text || "";
  const links: SectionLink[] = [];

  // Markdown links: [Label](https://url)
  cleaned = cleaned.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, label, url) => {
      const safe = sanitizeUrl(url);
      if (safe)
        links.push({
          id: uid(),
          label: String(label || "").trim(),
          url: safe,
          fontSize: "base",
          bold: false,
          italic: false,
        });
      return String(label || "").trim();
    },
  );

  // Bare URLs
  cleaned = cleaned.replace(/(^|\s)(https?:\/\/[^\s)]+)(?=\s|$)/g, (m, pre, url) => {
    const safe = sanitizeUrl(url);
    if (safe)
      links.push({
        id: uid(),
        label: safe,
        url: safe,
        fontSize: "base",
        bold: false,
        italic: false,
      });
    return pre + safe;
  });

  // Unique
  const key = (l: SectionLink) =>
    `${(l.label || "").trim()}__${(l.url || "").trim()}`;
  const seen = new Set<string>();
  const unique = links.filter((l) => {
    const k = key(l);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return { cleaned: cleaned.trim(), inlineLinks: unique };
}

function defaultSection(type: SectionType): BlogSection {
  return {
    id: uid(),
    type,
    heading: "",
    subHeading: "",
    content: "",
    images: [],
    steps:
      type === "process"
        ? [
          {
            id: uid(),
            title: "Step 1",
            description: "",
            links: [],
            inlineLinks: [],
          },
        ]
        : [],
    cta: {
      enabled: false,
      heading: "",
      description: "",
      buttonText: "",
      buttonLink: "",
    },

    // ✅ separated: references list
    links: [],

    // ✅ separated: inline word links
    inlineLinks: [],
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

function normalizeLinkFromAny(l: any): SectionLink {
  return {
    id: l?.id || uid(),
    label: String(l?.label || ""),
    url: String(l?.url || ""),
    bold: !!l?.bold,
    italic: !!l?.italic,
    fontSize: (l?.fontSize as any) || "base",
  };
}

function tryParseStructuredContent(
  raw: string,
): { sections: BlogSection[]; tocOrder: string[] } | null {
  if (!isProbablyJson(raw)) return null;

  try {
    const parsed = JSON.parse(raw);

    if (parsed?.version === 1 && Array.isArray(parsed?.sections)) {
      const safeSections: BlogSection[] = parsed.sections.map((s: any) => {
        // Backward compatibility:
        // Old data may have "links" only (used for both inline + references earlier).
        // Now we keep both separated:
        // - references = s.links (as-is)
        // - inlineLinks = s.inlineLinks if exists else use s.links for inline also (so old posts still auto-link)
        const parsedLinks: SectionLink[] = Array.isArray(s?.links)
          ? s.links
            .map((l: any) => normalizeLinkFromAny(l))
            .filter((l: any) => l.label.trim() || l.url.trim())
          : [];

        const parsedInlineLinks: SectionLink[] = Array.isArray(s?.inlineLinks)
          ? s.inlineLinks
            .map((l: any) => normalizeLinkFromAny(l))
            .filter((l: any) => l.label.trim() || l.url.trim())
          : parsedLinks; // ✅ fallback for older saved content

        const steps: ProcessStep[] = Array.isArray(s?.steps)
          ? s.steps.map((st: any) => {
            const stLinks: SectionLink[] = Array.isArray(st?.links)
              ? st.links
                .map((l: any) => normalizeLinkFromAny(l))
                .filter((l: any) => l.label.trim() || l.url.trim())
              : [];

            const stInlineLinks: SectionLink[] = Array.isArray(st?.inlineLinks)
              ? st.inlineLinks
                .map((l: any) => normalizeLinkFromAny(l))
                .filter((l: any) => l.label.trim() || l.url.trim())
              : stLinks; // ✅ fallback for older saved content

            return {
              id: st?.id || uid(),
              title: String(st?.title || ""),
              description: String(st?.description || ""),
              links: stLinks,
              inlineLinks: stInlineLinks,
            };
          })
          : [];

        return {
          id: s?.id || uid(),
          type: s?.type === "process" ? "process" : "content",
          heading: String(s?.heading || ""),
          subHeading: String(s?.subHeading || ""),
          content: String(s?.content || ""),
          images: Array.isArray(s?.images) ? s.images.filter(Boolean) : [],

          // ✅ separated
          links: parsedLinks,
          inlineLinks: parsedInlineLinks,

          steps,
          cta: {
            enabled: !!s?.cta?.enabled,
            heading: String(s?.cta?.heading || ""),
            description: String(s?.cta?.description || ""),
            buttonText: String(s?.cta?.buttonText || ""),
            buttonLink: String(s?.cta?.buttonLink || ""),
          },
        };
      });

      return {
        sections: safeSections.length ? safeSections : [defaultSection("content")],
        tocOrder: Array.isArray(parsed?.tocOrder) ? parsed.tocOrder : [],
      };
    }
  } catch {
    // ignore
  }

  return null;
}

// ✅ AI content splitter (Markdown -> sections/process)
function splitAiContentToSections(raw: string): BlogSection[] {
  // ✅ IMPORTANT: if it’s structured JSON, parse it instead of splitting as markdown
  const structured = tryParseStructuredContent(raw);
  if (structured?.sections?.length) return structured.sections;

  const text = normalizeAiMarkdown(raw);
  if (!text) return [defaultSection("content")];

  // remove leading "# Title" line if present (we already store blog title separately)
  const lines = text.split("\n");
  if (lines[0]?.trim().startsWith("# ") && !lines[0]?.trim().startsWith("## ")) {
    lines.shift();
  }
  const cleaned = lines.join("\n").trim();
  if (!cleaned) return [defaultSection("content")];

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
    const ex = extractInlineLinksFromText(cleaned);
    s.content = ex.cleaned;
    s.inlineLinks = ex.inlineLinks; // ✅ inline only
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
    const secBase = defaultSection("content");
    secBase.heading = p.heading;

    // Try to extract a first sentence/short line as subHeading if body begins with something short
    const bodyLines = (p.body || "").split("\n").map((l) => l.trim());
    const firstNonEmptyIdx = bodyLines.findIndex((l) => !!l);
    if (firstNonEmptyIdx >= 0) {
      const firstLine = bodyLines[firstNonEmptyIdx];
      if (
        firstLine.length > 0 &&
        firstLine.length <= 140 &&
        !firstLine.startsWith("###") &&
        !firstLine.startsWith("-") &&
        !/^\d+\./.test(firstLine)
      ) {
        secBase.subHeading = firstLine;
        bodyLines.splice(firstNonEmptyIdx, 1);
      }
    }
    let body = bodyLines.join("\n").trim();

    // Detect "###" blocks (candidates for steps)
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
      const intro = body.slice(0, stepMatches[0].start).trim();

      const processSec = defaultSection("process");
      processSec.heading = secBase.heading;
      processSec.subHeading = secBase.subHeading;

      const introEx = extractInlineLinksFromText(intro);
      processSec.content = introEx.cleaned;
      processSec.inlineLinks = introEx.inlineLinks; // ✅ inline only
      processSec.links = []; // ✅ references empty by default

      processSec.steps = stepMatches.map((cur, i) => {
        const next = stepMatches[i + 1];
        const rawDesc = body.slice(cur.after, next ? next.start : body.length).trim();
        const ex = extractInlineLinksFromText(rawDesc);

        return {
          id: uid(),
          title: cur.title || `Step ${i + 1}`,
          description: ex.cleaned,
          inlineLinks: ex.inlineLinks, // ✅ inline only
          links: [], // ✅ references empty by default
        };
      });

      return processSec;
    }

    // normal section
    const ex = extractInlineLinksFromText(body);
    secBase.content = ex.cleaned;
    secBase.inlineLinks = ex.inlineLinks; // ✅ inline only
    secBase.links = []; // ✅ references empty by default

    return secBase;
  });

  return sections.length ? sections : [defaultSection("content")];
}

/**
 * ✅ Inline hyperlink feature (label -> url) inside the actual content text.
 * NOTE (your update):
 * - INLINE WORD LINKS use `inlineLinks`
 * - REFERENCES LIST uses `links`
 */
function escapeHtml(text: string) {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegExp(text: string) {
  return (text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyInlineLinksToHtml(html: string, links: SectionLink[]) {
  if (!html || !Array.isArray(links) || links.length === 0) return html;

  // Sort by label length desc, so "Facebook profile" matches before "Facebook"
  const valid = links
    .map((l) => ({
      label: (l.label || "").trim(),
      url: sanitizeUrl(l.url || ""),
      bold: !!l.bold,
      italic: !!l.italic,
      fontSize: (l.fontSize as any) || "base",
    }))
    .filter((l) => l.label && l.url)
    .sort((a, b) => b.label.length - a.label.length);

  if (!valid.length) return html;

  let out = html;

  // ✅ Avoid linking inside existing anchor tags by splitting on <a ...>...</a>
  const anchorRe = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
  const parts: { type: "anchor" | "text"; value: string }[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = anchorRe.exec(out))) {
    if (m.index > last) parts.push({ type: "text", value: out.slice(last, m.index) });
    parts.push({ type: "anchor", value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < out.length) parts.push({ type: "text", value: out.slice(last) });

  const linkifyTextChunk = (chunk: string) => {
    let c = chunk;

    for (const l of valid) {
      const label = l.label;
      const url = l.url;

      // Word boundary-ish matching that still works for multi-word labels:
      // Use negative/positive "not a letter/number/underscore" boundaries.
      const pattern = `(^|[^\\w])(${escapeRegExp(label)})(?=[^\\w]|$)`;
      const re = new RegExp(pattern, "g");

      const sizeClass =
        l.fontSize === "sm"
          ? "text-sm"
          : l.fontSize === "lg"
            ? "text-lg"
            : l.fontSize === "xl"
              ? "text-xl"
              : "text-base";

      const className = [
        "text-blue-600 underline hover:opacity-80",
        sizeClass,
        l.bold ? "font-bold" : "",
        l.italic ? "italic" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const attrs = url.startsWith("/")
        ? `href="${url}" class="${className}"`
        : `href="${url}" target="_blank" rel="noopener noreferrer" class="${className}"`;

      c = c.replace(re, `$1<a ${attrs}>$2</a>`);
    }

    return c;
  };

  out = parts
    .map((p) => (p.type === "anchor" ? p.value : linkifyTextChunk(p.value)))
    .join("");

  return out;
}

function renderTextWithInlineLinks(content: string, inlineLinks: SectionLink[]) {
  const raw = content || "";
  if (!raw.trim()) return "";

  // If HTML, keep as HTML and inject inline links carefully (not inside existing <a>)
  if (isProbablyHtml(raw)) {
    return applyInlineLinksToHtml(raw, inlineLinks);
  }

  // Otherwise treat as plain text => escape and convert newlines to <br/>
  const escaped = escapeHtml(raw).replace(/\n/g, "<br/>");
  return applyInlineLinksToHtml(escaped, inlineLinks);
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

    // ✅ NEW
    category: "SEO" as BlogCategory,
  });

  const [generateData, setGenerateData] = useState({
    title: "",
    keywords: "",
    category: "SEO" as BlogCategory,
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

  // =========================
  // ✅ References (Section)
  // =========================
  const addSectionReference = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
            ...s,
            links: [
              ...(s.links || []),
              { id: uid(), label: "", url: "", bold: false, italic: false, fontSize: "base" },
            ],
          }
          : s,
      ),
    );
  };

  const updateSectionReference = (sectionId: string, linkId: string, patch: Partial<SectionLink>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, links: (s.links || []).map((l) => (l.id === linkId ? { ...l, ...patch } : l)) },
      ),
    );
  };

  const removeSectionReference = (sectionId: string, linkId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : { ...s, links: (s.links || []).filter((l) => l.id !== linkId) },
      ),
    );
  };

  // =========================
  // ✅ Inline Word Links (Section)
  // =========================
  const addSectionInlineLink = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
            ...s,
            inlineLinks: [
              ...(s.inlineLinks || []),
              { id: uid(), label: "", url: "", bold: false, italic: false, fontSize: "base" },
            ],
          }
          : s,
      ),
    );
  };

  const updateSectionInlineLink = (
    sectionId: string,
    linkId: string,
    patch: Partial<SectionLink>,
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
            ...s,
            inlineLinks: (s.inlineLinks || []).map((l) =>
              l.id === linkId ? { ...l, ...patch } : l,
            ),
          },
      ),
    );
  };

  const removeSectionInlineLink = (sectionId: string, linkId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, inlineLinks: (s.inlineLinks || []).filter((l) => l.id !== linkId) },
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

      const aiRaw = String(data?.blog?.content || "");

      const structured = tryParseStructuredContent(aiRaw);

      if (structured?.sections?.length) {
        setSections(structured.sections);
        setTocOrder(Array.isArray(structured.tocOrder) ? structured.tocOrder : []);
      } else {
        const aiSections = splitAiContentToSections(aiRaw);

        // If AI returns "## Call to Action" block, make it CTA on last section automatically (nice UX)
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
      }

      setFormData((prev) => ({
        ...prev,
        title: data?.blog?.title || prev.title,
        subtitle: data?.blog?.subtitle || prev.subtitle,
        excerpt: data?.blog?.excerpt || prev.excerpt,
        slug: generateSlug(data?.blog?.title || prev.title || prev.slug),
        tags: Array.isArray(data?.blog?.tags) ? data.blog.tags.join(", ") : prev.tags,
        metaDescription: data?.blog?.metaDescription || prev.metaDescription,

        // ✅ NEW
        category: (data?.blog?.category as BlogCategory) || prev.category || "SEO",
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

      // ✅ NEW
      category: "SEO",
    });
    setSections([defaultSection("content")]);
    setTocOrder([]);
  };

  const resetGenerateForm = () => {
    setGenerateData({
      title: "",
      keywords: "",
      category: "SEO",
      targetAudience: "business owners",
    });
  };

  const parseContentToBuilder = (rawContent: string) => {
    // ✅ If JSON content is saved already, load it into builder
    const structured = tryParseStructuredContent(rawContent);
    if (structured?.sections?.length) {
      setSections(structured.sections);
      setTocOrder(Array.isArray(structured.tocOrder) ? structured.tocOrder : []);
      return;
    }

    // ✅ Legacy/plain => split like AI markdown
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

      // ✅ NEW
      category: ((post as any).category as BlogCategory) || "SEO",
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
          steps: [
            ...steps,
            {
              id: uid(),
              title: `Step ${steps.length + 1}`,
              description: "",
              links: [],
              inlineLinks: [],
            },
          ],
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
          steps: steps.length
            ? steps
            : [{ id: uid(), title: "Step 1", description: "", links: [], inlineLinks: [] }],
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
      prev.map((s) =>
        s.id === sectionId ? { ...s, images: s.images.filter((i) => i !== url) } : s,
      ),
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
          s.id === sectionId
            ? { ...s, images: Array.from(new Set([...(s.images || []), ...urls])) }
            : s,
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

      // references list
      if (Array.isArray(s.links) && s.links.some((l) => l.label.trim() || l.url.trim())) return true;

      // inline links
      if (
        Array.isArray(s.inlineLinks) &&
        s.inlineLinks.some((l) => l.label.trim() || l.url.trim())
      )
        return true;

      if (
        s.type === "process" &&
        (s.steps || []).some((st) => {
          if (st.title.trim() || st.description.trim()) return true;

          // step references list
          if (Array.isArray(st.links) && st.links.some((l) => l.label.trim() || l.url.trim()))
            return true;

          // step inline links
          if (
            Array.isArray(st.inlineLinks) &&
            st.inlineLinks.some((l) => l.label.trim() || l.url.trim())
          )
            return true;

          return false;
        })
      ) {
        return true;
      }

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

        // ✅ references list
        links: Array.isArray(s.links)
          ? s.links
            .map((l) => ({
              ...l,
              label: (l.label || "").trim(),
              url: (l.url || "").trim(),
              bold: !!l.bold,
              italic: !!l.italic,
              fontSize: (l.fontSize as any) || "base",
            }))
            .filter((l) => l.label || l.url)
          : [],

        // ✅ inline links
        inlineLinks: Array.isArray(s.inlineLinks)
          ? s.inlineLinks
            .map((l) => ({
              ...l,
              label: (l.label || "").trim(),
              url: (l.url || "").trim(),
              bold: !!l.bold,
              italic: !!l.italic,
              fontSize: (l.fontSize as any) || "base",
            }))
            .filter((l) => l.label || l.url)
          : [],

        steps: Array.isArray(s.steps)
          ? s.steps.map((st) => ({
            ...st,

            // ✅ step references list
            links: Array.isArray(st.links)
              ? st.links
                .map((l) => ({
                  ...l,
                  label: (l.label || "").trim(),
                  url: (l.url || "").trim(),
                  bold: !!l.bold,
                  italic: !!l.italic,
                  fontSize: (l.fontSize as any) || "base",
                }))
                .filter((l) => l.label || l.url)
              : [],

            // ✅ step inline links
            inlineLinks: Array.isArray(st.inlineLinks)
              ? st.inlineLinks
                .map((l) => ({
                  ...l,
                  label: (l.label || "").trim(),
                  url: (l.url || "").trim(),
                  bold: !!l.bold,
                  italic: !!l.italic,
                  fontSize: (l.fontSize as any) || "base",
                }))
                .filter((l) => l.label || l.url)
              : [],
          }))
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
                const secAnchor = sec.heading?.trim()
                  ? `sec-${slugify(sec.heading)}-${sIdx + 1}`
                  : undefined;

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
                          <div
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              // ✅ UPDATE: Use ONLY section inlineLinks for section content
                              __html: renderTextWithInlineLinks(sec.content, sec.inlineLinks || []),
                            }}
                          />
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
                                      <div
                                        className="text-gray-700 mt-1 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                          // ✅ UPDATE: DO NOT MERGE section links + step links.
                                          // Inline word links in step description use ONLY step.inlineLinks
                                          __html: renderTextWithInlineLinks(
                                            st.description,
                                            st.inlineLinks || [],
                                          ),
                                        }}
                                      />
                                    )}

                                    {Array.isArray(st.links) && st.links.length > 0 && (
                                      <div className="mt-2 border rounded-xl p-3 bg-gray-50">
                                        <div className="font-semibold mb-2 flex items-center gap-2">
                                          <LinkIcon className="w-4 h-4" />
                                          References
                                        </div>
                                        <ul className="list-disc pl-5 space-y-1">
                                          {st.links.map((l: any) => (
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
                            <div
                              dangerouslySetInnerHTML={{
                                // ✅ UPDATE: Use ONLY section inlineLinks for content section
                                __html: renderTextWithInlineLinks(sec.content, sec.inlineLinks || []),
                              }}
                            />
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
                      onValueChange={(value) =>
                        setGenerateData({ ...generateData, category: value as BlogCategory })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEO">SEO</SelectItem>
                        <SelectItem value="PPC">PPC</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="App Development">App Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="generate-audience">Target Audience</Label>
                    <Select
                      value={generateData.targetAudience}
                      onValueChange={(value) =>
                        setGenerateData({ ...generateData, targetAudience: value })
                      }
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
                  {editingPost
                    ? "Edit Blog Post"
                    : generatedBlog
                      ? "Review Generated Blog"
                      : "Create New Blog Post"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Top meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
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
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, category: v as BlogCategory }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEO">SEO</SelectItem>
                        <SelectItem value="PPC">PPC</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="App Development">App Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Short supporting line under the title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Input
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Used in cards / SEO snippets"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="AI, Business, Growth"
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
                          Add multiple content/process sections. Each section can have images, references, inline
                          word-links, optional CTA.
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

                                    {/* ✅ Step Inline Word Links (SEPARATE) */}
                                    <div className="mt-2 border rounded-xl p-3 bg-gray-50 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="font-semibold text-sm flex items-center gap-2">
                                          <LinkIcon className="w-4 h-4" />
                                          Step Inline Word Links (inside description)
                                        </div>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setSections((prev) =>
                                              prev.map((s) => {
                                                if (s.id !== sec.id) return s;
                                                return {
                                                  ...s,
                                                  steps: (s.steps || []).map((x) =>
                                                    x.id !== st.id
                                                      ? x
                                                      : {
                                                        ...x,
                                                        inlineLinks: [
                                                          ...(x.inlineLinks || []),
                                                          {
                                                            id: uid(),
                                                            label: "",
                                                            url: "",
                                                            bold: false,
                                                            italic: false,
                                                            fontSize: "base",
                                                          },
                                                        ],
                                                      },
                                                  ),
                                                };
                                              }),
                                            );
                                          }}
                                        >
                                          + Add Word Link
                                        </Button>
                                      </div>

                                      {Array.isArray(st.inlineLinks) &&
                                        st.inlineLinks.map((l: any) => (
                                          <div key={l.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
                                            <Input
                                              className="md:col-span-2"
                                              placeholder="Word / Phrase (e.g., BrandingBeez)"
                                              value={l.label}
                                              onChange={(e) => {
                                                const v = e.target.value;
                                                setSections((prev) =>
                                                  prev.map((s) => {
                                                    if (s.id !== sec.id) return s;
                                                    return {
                                                      ...s,
                                                      steps: (s.steps || []).map((x) => {
                                                        if (x.id !== st.id) return x;
                                                        return {
                                                          ...x,
                                                          inlineLinks: (x.inlineLinks || []).map((ln: any) =>
                                                            ln.id === l.id ? { ...ln, label: v } : ln,
                                                          ),
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                );
                                              }}
                                            />
                                            <Input
                                              className="md:col-span-2"
                                              placeholder="https://... or /internal"
                                              value={l.url}
                                              onChange={(e) => {
                                                const v = e.target.value;
                                                setSections((prev) =>
                                                  prev.map((s) => {
                                                    if (s.id !== sec.id) return s;
                                                    return {
                                                      ...s,
                                                      steps: (s.steps || []).map((x) => {
                                                        if (x.id !== st.id) return x;
                                                        return {
                                                          ...x,
                                                          inlineLinks: (x.inlineLinks || []).map((ln: any) =>
                                                            ln.id === l.id ? { ...ln, url: v } : ln,
                                                          ),
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                );
                                              }}
                                            />

                                            <Select
                                              value={l.fontSize || "base"}
                                              onValueChange={(v) => {
                                                setSections((prev) =>
                                                  prev.map((s) => {
                                                    if (s.id !== sec.id) return s;
                                                    return {
                                                      ...s,
                                                      steps: (s.steps || []).map((x) => {
                                                        if (x.id !== st.id) return x;
                                                        return {
                                                          ...x,
                                                          inlineLinks: (x.inlineLinks || []).map((ln: any) =>
                                                            ln.id === l.id ? { ...ln, fontSize: v } : ln,
                                                          ),
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                );
                                              }}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Size" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="sm">Small</SelectItem>
                                                <SelectItem value="base">Normal</SelectItem>
                                                <SelectItem value="lg">Large</SelectItem>
                                                <SelectItem value="xl">XL</SelectItem>
                                              </SelectContent>
                                            </Select>

                                            <label className="flex items-center gap-2 text-sm md:col-span-1">
                                              <input
                                                type="checkbox"
                                                checked={!!l.bold}
                                                onChange={(e) => {
                                                  const checked = e.target.checked;
                                                  setSections((prev) =>
                                                    prev.map((s) => {
                                                      if (s.id !== sec.id) return s;
                                                      return {
                                                        ...s,
                                                        steps: (s.steps || []).map((x) => {
                                                          if (x.id !== st.id) return x;
                                                          return {
                                                            ...x,
                                                            inlineLinks: (x.inlineLinks || []).map((ln: any) =>
                                                              ln.id === l.id ? { ...ln, bold: checked } : ln,
                                                            ),
                                                          };
                                                        }),
                                                      };
                                                    }),
                                                  );
                                                }}
                                              />
                                              Bold
                                            </label>

                                            <label className="flex items-center gap-2 text-sm md:col-span-1">
                                              <input
                                                type="checkbox"
                                                checked={!!l.italic}
                                                onChange={(e) => {
                                                  const checked = e.target.checked;
                                                  setSections((prev) =>
                                                    prev.map((s) => {
                                                      if (s.id !== sec.id) return s;
                                                      return {
                                                        ...s,
                                                        steps: (s.steps || []).map((x) => {
                                                          if (x.id !== st.id) return x;
                                                          return {
                                                            ...x,
                                                            inlineLinks: (x.inlineLinks || []).map((ln: any) =>
                                                              ln.id === l.id ? { ...ln, italic: checked } : ln,
                                                            ),
                                                          };
                                                        }),
                                                      };
                                                    }),
                                                  );
                                                }}
                                              />
                                              Italic
                                            </label>

                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="sm"
                                              className="md:col-span-1"
                                              onClick={() => {
                                                setSections((prev) =>
                                                  prev.map((s) => {
                                                    if (s.id !== sec.id) return s;
                                                    return {
                                                      ...s,
                                                      steps: (s.steps || []).map((x) => {
                                                        if (x.id !== st.id) return x;
                                                        return {
                                                          ...x,
                                                          inlineLinks: (x.inlineLinks || []).filter((ln: any) => ln.id !== l.id),
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                );
                                              }}
                                            >
                                              Remove
                                            </Button>
                                          </div>
                                        ))}
                                    </div>

                                    {/* ✅ Step References (SEPARATE) */}
                                    <div className="mt-2 border rounded-xl p-3 bg-gray-50 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="font-semibold text-sm flex items-center gap-2">
                                          <LinkIcon className="w-4 h-4" />
                                          Step References (list under step)
                                        </div>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setSections((prev) =>
                                              prev.map((s) => {
                                                if (s.id !== sec.id) return s;
                                                return {
                                                  ...s,
                                                  steps: (s.steps || []).map((x) =>
                                                    x.id !== st.id
                                                      ? x
                                                      : {
                                                        ...x,
                                                        links: [
                                                          ...(x.links || []),
                                                          {
                                                            id: uid(),
                                                            label: "",
                                                            url: "",
                                                            bold: false,
                                                            italic: false,
                                                            fontSize: "base",
                                                          },
                                                        ],
                                                      },
                                                  ),
                                                };
                                              }),
                                            );
                                          }}
                                        >
                                          + Add Reference
                                        </Button>
                                      </div>

                                      {Array.isArray(st.links) &&
                                        st.links.map((l: any) => (
                                          <div key={l.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                                            <Input
                                              className="md:col-span-2"
                                              placeholder="Label"
                                              value={l.label}
                                              onChange={(e) => {
                                                const v = e.target.value;
                                                setSections((prev) =>
                                                  prev.map((s) => {
                                                    if (s.id !== sec.id) return s;
                                                    return {
                                                      ...s,
                                                      steps: (s.steps || []).map((x) => {
                                                        if (x.id !== st.id) return x;
                                                        return {
                                                          ...x,
                                                          links: (x.links || []).map((ln: any) =>
                                                            ln.id === l.id ? { ...ln, label: v } : ln,
                                                          ),
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                );
                                              }}
                                            />
                                            <Input
                                              className="md:col-span-2"
                                              placeholder="https://..."
                                              value={l.url}
                                              onChange={(e) => {
                                                const v = e.target.value;
                                                setSections((prev) =>
                                                  prev.map((s) => {
                                                    if (s.id !== sec.id) return s;
                                                    return {
                                                      ...s,
                                                      steps: (s.steps || []).map((x) => {
                                                        if (x.id !== st.id) return x;
                                                        return {
                                                          ...x,
                                                          links: (x.links || []).map((ln: any) =>
                                                            ln.id === l.id ? { ...ln, url: v } : ln,
                                                          ),
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                );
                                              }}
                                            />
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="sm"
                                              onClick={() => {
                                                setSections((prev) =>
                                                  prev.map((s) => {
                                                    if (s.id !== sec.id) return s;
                                                    return {
                                                      ...s,
                                                      steps: (s.steps || []).map((x) => {
                                                        if (x.id !== st.id) return x;
                                                        return {
                                                          ...x,
                                                          links: (x.links || []).filter((ln: any) => ln.id !== l.id),
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                );
                                              }}
                                            >
                                              Remove
                                            </Button>
                                          </div>
                                        ))}
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

                          {/* ✅ Inline Word Links (Section) - SEPARATE */}
                          <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Inline Word Links (inside content)
                              </div>
                              <Button type="button" size="sm" variant="outline" onClick={() => addSectionInlineLink(sec.id)}>
                                + Add Word Link
                              </Button>
                            </div>

                            {(!sec.inlineLinks || sec.inlineLinks.length === 0) && (
                              <p className="text-sm text-gray-500">
                                Add inline word links (e.g., "Pradeep" → "/about-pradeep"). These will auto-link inside
                                the content text.
                              </p>
                            )}

                            <div className="space-y-2">
                              {(sec.inlineLinks || []).map((link) => (
                                <div key={link.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
                                  <Input
                                    className="md:col-span-2"
                                    placeholder="Word / Phrase (e.g., Pradeep)"
                                    value={link.label}
                                    onChange={(e) => updateSectionInlineLink(sec.id, link.id, { label: e.target.value })}
                                  />
                                  <Input
                                    className="md:col-span-2"
                                    placeholder="https://... or /internal"
                                    value={link.url}
                                    onChange={(e) => updateSectionInlineLink(sec.id, link.id, { url: e.target.value })}
                                  />

                                  <Select
                                    value={link.fontSize || "base"}
                                    onValueChange={(v) => updateSectionInlineLink(sec.id, link.id, { fontSize: v as any })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="sm">Small</SelectItem>
                                      <SelectItem value="base">Normal</SelectItem>
                                      <SelectItem value="lg">Large</SelectItem>
                                      <SelectItem value="xl">XL</SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <label className="flex items-center gap-2 text-sm md:col-span-1">
                                    <input
                                      type="checkbox"
                                      checked={!!link.bold}
                                      onChange={(e) => updateSectionInlineLink(sec.id, link.id, { bold: e.target.checked })}
                                    />
                                    Bold
                                  </label>

                                  <label className="flex items-center gap-2 text-sm md:col-span-1">
                                    <input
                                      type="checkbox"
                                      checked={!!link.italic}
                                      onChange={(e) => updateSectionInlineLink(sec.id, link.id, { italic: e.target.checked })}
                                    />
                                    Italic
                                  </label>

                                  <Button type="button" variant="destructive" size="sm" onClick={() => removeSectionInlineLink(sec.id, link.id)}>
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ✅ References (Section) - SEPARATE */}
                          <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Section References (list under section)
                              </div>
                              <Button type="button" size="sm" variant="outline" onClick={() => addSectionReference(sec.id)}>
                                + Add Reference
                              </Button>
                            </div>

                            {(!sec.links || sec.links.length === 0) && (
                              <p className="text-sm text-gray-500">
                                Add references for this section (sources, citations, external docs). These are shown as a
                                list under the section.
                              </p>
                            )}

                            <div className="space-y-2">
                              {(sec.links || []).map((link) => (
                                <div key={link.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                                  <Input
                                    className="md:col-span-2"
                                    placeholder="Label (e.g., Google Search Central)"
                                    value={link.label}
                                    onChange={(e) => updateSectionReference(sec.id, link.id, { label: e.target.value })}
                                  />
                                  <Input
                                    className="md:col-span-2"
                                    placeholder="https://example.com"
                                    value={link.url}
                                    onChange={(e) => updateSectionReference(sec.id, link.id, { url: e.target.value })}
                                  />
                                  <Button type="button" variant="destructive" size="sm" onClick={() => removeSectionReference(sec.id, link.id)}>
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
                                  onCheckedChange={(checked) =>
                                    updateSection(sec.id, { cta: { ...sec.cta, enabled: checked } })
                                  }
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
                                    onChange={(e) =>
                                      updateSection(sec.id, {
                                        cta: { ...sec.cta, heading: e.target.value },
                                      })
                                    }
                                    placeholder="e.g., Want us to do this for you?"
                                  />
                                </div>
                                <div>
                                  <Label>CTA Button Text</Label>
                                  <Input
                                    value={sec.cta.buttonText || ""}
                                    onChange={(e) =>
                                      updateSection(sec.id, {
                                        cta: { ...sec.cta, buttonText: e.target.value },
                                      })
                                    }
                                    placeholder="e.g., Book a Call"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>CTA Description</Label>
                                  <Textarea
                                    value={sec.cta.description || ""}
                                    onChange={(e) =>
                                      updateSection(sec.id, {
                                        cta: { ...sec.cta, description: e.target.value },
                                      })
                                    }
                                    rows={2}
                                    placeholder="Short supporting text..."
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>CTA Button Link</Label>
                                  <Input
                                    value={sec.cta.buttonLink || ""}
                                    onChange={(e) =>
                                      updateSection(sec.id, {
                                        cta: { ...sec.cta, buttonLink: e.target.value },
                                      })
                                    }
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
                        Content is saved as JSON in the <b>content</b> field (no DB/model changes).
                        <br />
                        ✅ Inline word links and References are saved separately.
                        <br />
                        ✅ Inline word links now support: <b>bold</b>, <i>italic</i>, and <span className="font-semibold">font size</span>.
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Author/SEO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={formData.readTime}
                      onChange={(e) =>
                        setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-bold">{post.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {(post as any).category || "SEO"}
                      </Badge>
                    </div>
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
                  <div>
                    <span className="font-semibold">Category:</span>{" "}
                    <Badge variant="outline" className="ml-2">
                      {(viewingPostData as any).category || "SEO"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <Badge variant={viewingPostData.isPublished ? "default" : "destructive"}>
                      {viewingPostData.isPublished ? "Published" : "Draft"}
                    </Badge>
                    {viewingPostData.isFeatured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(viewingPostData.createdAt).toLocaleDateString()}
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
