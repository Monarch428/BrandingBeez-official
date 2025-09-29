import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ServicePage, InsertServicePage } from "@shared/schema";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  Settings,
  ExternalLink
} from "lucide-react";

const auditFormTypes = [
  { value: "seo", label: "SEO Audit Form" },
  { value: "website", label: "Website Security Audit" },
  { value: "ads", label: "Google Ads Audit" },
  { value: "calculator", label: "Pricing Calculator" },
  { value: "automation", label: "Automation Suggestions" }
];

export function ServicePagesManager() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<ServicePage | null>(null);
  const [formData, setFormData] = useState<Partial<InsertServicePage>>({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    heroTitle: "",
    heroSubtitle: "",
    auditFormType: "",
    isActive: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery<ServicePage[]>({
    queryKey: ["/api/admin/service-pages"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertServicePage) => {
      return apiRequest("/api/admin/service-pages", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/service-pages"] });
      resetForm();
      toast({ title: "Success", description: "Service page created successfully" });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to create service page";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({ title: "Please check your information", description: errorMessage, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertServicePage> }) => {
      return apiRequest(`/api/admin/service-pages/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/service-pages"] });
      resetForm();
      toast({ title: "Success", description: "Service page updated successfully" });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to update service page";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/service-pages/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/service-pages"] });
      toast({ title: "Success", description: "Service page deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: "Failed to delete service page", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      heroTitle: "",
      heroSubtitle: "",
      auditFormType: "",
      isActive: true
    });
    setIsEditing(false);
    setEditingPage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.title) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const submitData = formData as InsertServicePage;
    
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (page: ServicePage) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      subtitle: page.subtitle || "",
      description: page.description || "",
      heroTitle: page.heroTitle || "",
      heroSubtitle: page.heroSubtitle || "",
      auditFormType: page.auditFormType || "",
      isActive: page.isActive
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this service page?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-purple">Service Pages</h2>
          <p className="text-gray-600">Manage service page content and settings</p>
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          className="bg-brand-coral rand-coral/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service Page
        </Button>
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPage ? "Edit Service Page" : "Add New Service Page"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Page Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="web-development"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">URL: /services/{formData.slug}</p>
                </div>
                <div>
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Web Development Services"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subtitle">Page Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Professional web development for modern businesses"
                />
              </div>

              <div>
                <Label htmlFor="description">Page Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the service"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heroTitle">Hero Section Title</Label>
                  <Input
                    id="heroTitle"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    placeholder="Custom Website Development"
                  />
                </div>
                <div>
                  <Label htmlFor="auditFormType">Audit Form Type</Label>
                  <Select
                    value={formData.auditFormType}
                    onValueChange={(value) => setFormData({ ...formData, auditFormType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit form type" />
                    </SelectTrigger>
                    <SelectContent>
                      {auditFormTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="heroSubtitle">Hero Section Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Build responsive, high-performing websites that convert visitors into customers"
                  rows={2}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-brand-coral rand-coral/90">
                  {editingPage ? "Update Service Page" : "Create Service Page"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pages.map((page) => (
          <Card key={page.id} className=" transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {page.title}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>/services/{page.slug}</Badge>
                    {page.auditFormType && (
                      <Badge variant="outline">{page.auditFormType} audit</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(page.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {page.subtitle && (
                <p className="text-gray-600 mb-3">{page.subtitle}</p>
              )}
              
              {page.description && (
                <p className="text-sm text-gray-500 mb-4">{page.description}</p>
              )}

              <div className="space-y-2">
                {page.heroTitle && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Hero Title:</span>
                    <p className="text-sm">{page.heroTitle}</p>
                  </div>
                )}
                
                {page.heroSubtitle && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Hero Subtitle:</span>
                    <p className="text-sm">{page.heroSubtitle}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <a 
                  href={`/services/${page.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-coral rand-coral/80 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Page
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No service pages yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first service page to manage your website content.</p>
            <Button onClick={() => setIsEditing(true)} className="bg-brand-coral rand-coral/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Service Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}