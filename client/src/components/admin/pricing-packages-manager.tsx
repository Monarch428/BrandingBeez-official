import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PricingPackage, InsertPricingPackage } from "@shared/schema";
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  Crown,
  Package
} from "lucide-react";

const servicePageOptions = [
  { value: "seo", label: "SEO Services" },
  { value: "web-development", label: "Web Development" },
  { value: "google-ads", label: "Google Ads" },
  { value: "ai-development", label: "AI Development" },
  { value: "digital-marketing-agencies", label: "Digital Marketing Agencies" }
];

export function PricingPackagesManager() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [formData, setFormData] = useState<Partial<InsertPricingPackage>>({
    servicePage: "",
    name: "",
    price: "",
    description: "",
    features: [],
    isPopular: false,
    orderIndex: 0,
    isActive: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading } = useQuery<PricingPackage[]>({
    queryKey: ["/api/admin/pricing-packages"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPricingPackage) => {
      return apiRequest("/api/admin/pricing-packages", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing-packages"] });
      resetForm();
      toast({ title: "Package created successfully!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPricingPackage> }) => {
      return apiRequest(`/api/admin/pricing-packages/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing-packages"] });
      resetForm();
      toast({ title: "Package updated successfully!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/pricing-packages/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing-packages"] });
      toast({ title: "Package deleted successfully!" });
    },
  });

  const resetForm = () => {
    setFormData({
      servicePage: "",
      name: "",
      price: "",
      description: "",
      features: [],
      isPopular: false,
      orderIndex: 0,
      isActive: true
    });
    setIsEditing(false);
    setEditingPackage(null);
  };

  const handleEdit = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setFormData({
      servicePage: pkg.servicePage,
      name: pkg.name,
      price: pkg.price,
      description: pkg.description || "",
      features: pkg.features || [],
      isPopular: pkg.isPopular,
      orderIndex: pkg.orderIndex,
      isActive: pkg.isActive
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.servicePage || !formData.name || !formData.price) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const submitData = {
      ...formData,
      features: formData.features?.filter(f => f.trim() !== "") || []
    } as InsertPricingPackage;

    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };



  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this pricing package?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFeaturesChange = (value: string) => {
    setFormData({ ...formData, features: value.split('\n').filter(f => f.trim()) });
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-purple">Pricing Packages</h2>
          <p className="text-gray-600">Manage pricing packages displayed on service pages</p>
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          className="bg-brand-coral rand-coral/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Package
        </Button>
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPackage ? "Edit Pricing Package" : "Add New Pricing Package"}</CardTitle>
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
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Starter, Professional, Enterprise"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="$1,500/month"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="orderIndex">Display Order</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
                  />
                  <Label htmlFor="isPopular">Mark as Popular</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the package"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="features">Features (one per line) *</Label>
                <Textarea
                  id="features"
                  value={Array.isArray(formData.features) ? formData.features.join('\n') : ''}
                  onChange={(e) => handleFeaturesChange(e.target.value)}
                  placeholder="Keyword Research & Analysis&#10;On-page SEO optimization&#10;Monthly performance reports&#10;24/7 support"
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-brand-coral rand-coral/90">
                  {editingPackage ? "Update Package" : "Create Package"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Packages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {packages
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((pkg) => (
          <Card key={pkg.id} className={` transition-shadow relative ${pkg.isPopular ? 'border-brand-coral border-2' : ''}`}>
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-brand-coral text-white flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {pkg.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{pkg.servicePage}</Badge>
                    <Badge variant="outline">Order: {pkg.orderIndex}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-brand-coral mb-2 flex items-center justify-center gap-1">
                  <DollarSign className="w-6 h-6" />
                  {pkg.price}
                </div>
                {pkg.description && (
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Features:</h4>
                <ul className="space-y-1">
                  {Array.isArray(pkg.features) && pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-brand-coral rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No pricing packages yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first pricing package to display on your service pages.</p>
            <Button onClick={() => setIsEditing(true)} className="bg-brand-coral rand-coral/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Pricing Package
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}