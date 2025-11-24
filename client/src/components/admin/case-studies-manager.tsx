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
import type { CaseStudy, InsertCaseStudy } from "@shared/schema";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  Building
} from "lucide-react";

const servicePageOptions = [
  { value: "seo", label: "SEO Services" },
  { value: "web-development", label: "Web Development" },
  { value: "google-ads", label: "Google Ads" },
  { value: "ai-development", label: "AI Development" },
  { value: "digital-marketing-agencies", label: "Digital Marketing Agencies" }
];

export function CaseStudiesManager() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [formData, setFormData] = useState<Partial<InsertCaseStudy>>({
    servicePage: "",
    title: "",
    client: "",
    industry: "",
    results: {},
    description: "",
    imageUrl: "",
    isActive: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: caseStudies = [], isLoading } = useQuery<CaseStudy[]>({
    queryKey: ["/api/admin/case-studies"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCaseStudy) => {
      return apiRequest("/api/admin/case-studies", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/case-studies"] });
      resetForm();
      toast({ title: "Case study created successfully!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCaseStudy> }) => {
      return apiRequest(`/api/admin/case-studies/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/case-studies"] });
      resetForm();
      toast({ title: "Case study updated successfully!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/case-studies/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/case-studies"] });
      toast({ title: "Case study deleted successfully!" });
    },
  });

  const resetForm = () => {
    setFormData({
      servicePage: "",
      title: "",
      client: "",
      industry: "",
      results: {},
      description: "",
      imageUrl: "",
      isActive: true
    });
    setIsEditing(false);
    setEditingCaseStudy(null);
  };

  const handleEdit = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setFormData({
      servicePage: caseStudy.servicePage,
      title: caseStudy.title,
      client: caseStudy.client,
      industry: caseStudy.industry,
      results: caseStudy.results || {},
      description: caseStudy.description,
      imageUrl: caseStudy.imageUrl || "",
      isActive: caseStudy.isActive
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.servicePage || !formData.title || !formData.client) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const submitData = formData as InsertCaseStudy;

    if (editingCaseStudy) {
      updateMutation.mutate({ id: editingCaseStudy.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading case studies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-purple">Case Studies</h2>
          <p className="text-gray-600">Manage case studies displayed on service pages</p>
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          className="bg-brand-coral hover:bg-brand-coral/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Case Study
        </Button>
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCaseStudy ? "Edit Case Study" : "Create New Case Study"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servicePage">Service Page *</Label>
                  <Select
                    value={formData.servicePage}
                    onValueChange={(value) => setFormData({ ...formData, servicePage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service page" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicePageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., E-commerce Platform Launch"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g., Fashion Forward Store"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., E-commerce, Healthcare"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the project and approach"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/images/case-study.jpg"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-brand-coral hover:bg-brand-coral/90">
                  {editingCaseStudy ? "Update Case Study" : "Create Case Study"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Case Studies List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {caseStudies.map((caseStudy) => (
          <Card key={caseStudy.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {caseStudy.title}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{caseStudy.servicePage}</Badge>
                    <Badge variant="outline">{caseStudy.industry}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(caseStudy)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(caseStudy.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{caseStudy.client}</span>
                </div>
                
                <p className="text-gray-600 text-sm">{caseStudy.description}</p>
                
                {caseStudy.results && Object.keys(caseStudy.results).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Results:
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {Object.entries(caseStudy.results as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {caseStudies.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No case studies yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first case study to showcase your work.</p>
            <Button onClick={() => setIsEditing(true)} className="bg-brand-coral hover:bg-brand-coral/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Case Study
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}