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
import type { FeaturedClient, InsertFeaturedClient } from "@shared/schema";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  ExternalLink,
  Building
} from "lucide-react";

const servicePageOptions = [
  { value: "seo", label: "SEO Services" },
  { value: "web-development", label: "Web Development" },
  { value: "google-ads", label: "Google Ads" },
  { value: "ai-development", label: "AI Development" },
  { value: "digital-marketing-agencies", label: "Digital Marketing Agencies" }
];

export function FeaturedClientsManager() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingClient, setEditingClient] = useState<FeaturedClient | null>(null);
  const [formData, setFormData] = useState<Partial<InsertFeaturedClient>>({
    servicePage: "",
    name: "",
    logo: "",
    website: "",
    description: "",
    achievements: [],
    industry: "",
    timeframe: "",
    isActive: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery<FeaturedClient[]>({
    queryKey: ["/api/admin/featured-clients"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFeaturedClient) => {
      return apiRequest("/api/admin/featured-clients", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/featured-clients"] });
      resetForm();
      toast({ title: "Success", description: "Featured client created successfully" });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to create featured client";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({ title: "Please check your information", description: errorMessage, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertFeaturedClient> }) => {
      return apiRequest(`/api/admin/featured-clients/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/featured-clients"] });
      resetForm();
      toast({ title: "Success", description: "Featured client updated successfully" });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to update featured client";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({ title: "Please check your information", description: errorMessage, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/featured-clients/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/featured-clients"] });
      toast({ title: "Success", description: "Featured client deleted successfully" });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to delete featured client";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({ title: "Unable to delete", description: errorMessage, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      servicePage: "",
      name: "",
      logo: "",
      website: "",
      description: "",
      achievements: [],
      industry: "",
      timeframe: "",
      isActive: true
    });
    setIsEditing(false);
    setEditingClient(null);
  };

  const handleEdit = (client: FeaturedClient) => {
    setFormData(client);
    setEditingClient(client);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.servicePage || !formData.name || !formData.description) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const submitData = {
      ...formData,
      achievements: typeof formData.achievements === 'string' 
        ? formData.achievements.split('\n').filter(a => a.trim()) 
        : formData.achievements
    } as InsertFeaturedClient;

    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleAchievementsChange = (value: string) => {
    setFormData({ ...formData, achievements: value.split('\n').filter(a => a.trim()) });
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-purple">Featured Clients</h2>
          <p className="text-gray-600">Manage featured clients displayed on service pages</p>
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          className="bg-brand-coral rand-coral/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Featured Client
        </Button>
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingClient ? "Edit Featured Client" : "Add New Featured Client"}</CardTitle>
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
                  <Label htmlFor="name">Client Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Client Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., E-commerce, SaaS, Healthcare"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Project Timeframe *</Label>
                  <Input
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    placeholder="e.g., 6 months, 3 months"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the client and project"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="achievements">Achievements (one per line) *</Label>
                <Textarea
                  id="achievements"
                  value={Array.isArray(formData.achievements) ? formData.achievements.join('\n') : ''}
                  onChange={(e) => handleAchievementsChange(e.target.value)}
                  placeholder="300% increase in organic traffic&#10;Ranked #1 for 25+ keywords&#10;Generated $2.3M in revenue"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-brand-coral rand-coral/90">
                  {editingClient ? "Update Client" : "Create Client"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className=" transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {client.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{client.servicePage}</Badge>
                    <Badge variant="outline">{client.industry}</Badge>
                    <Badge variant="outline">{client.timeframe}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(client)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => deleteMutation.mutate(client.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{client.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Key Achievements:</h4>
                <ul className="space-y-1">
                  {Array.isArray(client.achievements) && client.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {client.website && (
                <div className="mt-4">
                  <a 
                    href={client.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-coral rand-coral/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No featured clients yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first featured client to showcase on your service pages.</p>
            <Button onClick={() => setIsEditing(true)} className="bg-brand-coral rand-coral/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Featured Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}