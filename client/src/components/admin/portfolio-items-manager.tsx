import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type PortfolioItem = {
  id: number;
  slug: string;
  title: string;
  industry: string;
  client?: string;
  badge?: string;
  investment?: string;
  totalValue?: string;
  roi?: string;
  description?: string;
  features?: string[];
  techStack?: string[];
  timeline?: string;
  imageUrl?: string;
  image?: string;
  isFeatured: boolean;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type PortfolioHeroStat = {
  kpi: string;
  label: string;
};

type PortfolioTestimonial = {
  quote: string;
  who: string;
  tag?: string;
};

type PortfolioContent = {
  heroTitle: string;
  heroHighlight?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroStats: PortfolioHeroStat[];
  heroPrimaryCtaText?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaHref?: string;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials: PortfolioTestimonial[];
};

const emptyForm: Partial<PortfolioItem> = {
  slug: "",
  title: "",
  industry: "",
  client: "",
  badge: "",
  investment: "",
  totalValue: "",
  roi: "",
  description: "",
  features: [],
  techStack: [],
  timeline: "",
  imageUrl: "",
  image: "",
  isFeatured: false,
  isActive: true,
  orderIndex: 0,
};

const emptyContent: PortfolioContent = {
  heroTitle: "",
  heroHighlight: "",
  heroSubtitle: "",
  heroDescription: "",
  heroStats: [],
  heroPrimaryCtaText: "",
  heroPrimaryCtaHref: "",
  heroSecondaryCtaText: "",
  heroSecondaryCtaHref: "",
  testimonialsTitle: "",
  testimonialsSubtitle: "",
  testimonials: [],
};

export function PortfolioItemsManager() {
  const [form, setForm] = useState<Partial<PortfolioItem>>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [contentForm, setContentForm] = useState<PortfolioContent>(emptyContent);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const { data: items = [], isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/admin/portfolio-items"],
    queryFn: async () => {
      const res = await fetch("/api/admin/portfolio-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch portfolio items");
      return res.json();
    },
    enabled: Boolean(token),
  });

  const { data: contentData, isLoading: contentLoading, error: contentError } = useQuery<PortfolioContent>({
    queryKey: ["/api/admin/portfolio-content"],
    queryFn: async () => {
      const res = await fetch("/api/admin/portfolio-content", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch portfolio content");
      return res.json();
    },
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (!editingId) return;
    const it = items.find((i) => i.id === editingId);
    if (it) {
      setForm({
        ...it,
        features: it.features || [],
        techStack: it.techStack || [],
      });
    }
  }, [editingId]);

  useEffect(() => {
    if (contentData) {
      setContentForm({
        heroTitle: contentData.heroTitle || "",
        heroHighlight: contentData.heroHighlight || "",
        heroSubtitle: contentData.heroSubtitle || "",
        heroDescription: contentData.heroDescription || "",
        heroStats: Array.isArray(contentData.heroStats) ? contentData.heroStats : [],
        heroPrimaryCtaText: contentData.heroPrimaryCtaText || "",
        heroPrimaryCtaHref: contentData.heroPrimaryCtaHref || "",
        heroSecondaryCtaText: contentData.heroSecondaryCtaText || "",
        heroSecondaryCtaHref: contentData.heroSecondaryCtaHref || "",
        testimonialsTitle: contentData.testimonialsTitle || "",
        testimonialsSubtitle: contentData.testimonialsSubtitle || "",
        testimonials: Array.isArray(contentData.testimonials) ? contentData.testimonials : [],
      });
    } else if (!contentLoading && !contentError) {
      setContentForm(emptyContent);
    }
  }, [contentData, contentLoading, contentError]);

  const handleChange = (field: keyof PortfolioItem, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (field: keyof PortfolioContent, value: any) => {
    setContentForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateHeroStat = (index: number, field: keyof PortfolioHeroStat, value: string) => {
    setContentForm((prev) => {
      const stats = [...(prev.heroStats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, heroStats: stats };
    });
  };

  const addHeroStat = () => {
    setContentForm((prev) => ({
      ...prev,
      heroStats: [...(prev.heroStats || []), { kpi: "", label: "" }],
    }));
  };

  const removeHeroStat = (index: number) => {
    setContentForm((prev) => ({
      ...prev,
      heroStats: prev.heroStats.filter((_, i) => i !== index),
    }));
  };

  const updateTestimonial = (
    index: number,
    field: keyof PortfolioTestimonial,
    value: string,
  ) => {
    setContentForm((prev) => {
      const testimonials = [...(prev.testimonials || [])];
      testimonials[index] = { ...testimonials[index], [field]: value };
      return { ...prev, testimonials };
    });
  };

  const addTestimonial = () => {
    setContentForm((prev) => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), { quote: "", who: "", tag: "" }],
    }));
  };

  const removeTestimonial = (index: number) => {
    setContentForm((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        industry: form.industry,
        client: form.client,
        badge: form.badge,
        investment: form.investment,
        totalValue: form.totalValue,
        roi: form.roi,
        description: form.description,
        features: Array.isArray(form.features)
          ? form.features
          : String(form.features || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        techStack: Array.isArray(form.techStack)
          ? form.techStack
          : String(form.techStack || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        timeline: form.timeline,
        imageUrl: form.imageUrl,
        image: form.image || form.imageUrl,
        isFeatured: Boolean(form.isFeatured),
        orderIndex: Number(form.orderIndex || 0),
        isActive: form.isActive !== false,
      };

      const url = editingId
        ? `/api/admin/portfolio-items/${editingId}`
        : "/api/admin/portfolio-items";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save portfolio item");
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio-items"] });
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this portfolio item?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio-items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete portfolio item");
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio-items"] });
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContent(true);
    try {
      const payload = {
        ...contentForm,
        heroStats: (contentForm.heroStats || [])
          .map((stat) => ({
            kpi: stat.kpi?.trim() || "",
            label: stat.label?.trim() || "",
          }))
          .filter((stat) => stat.kpi || stat.label),
        testimonials: (contentForm.testimonials || [])
          .map((t) => ({
            quote: t.quote?.trim() || "",
            who: t.who?.trim() || "",
            tag: t.tag?.trim() || undefined,
          }))
          .filter((t) => t.quote && t.who),
      };

      const res = await fetch("/api/admin/portfolio-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update portfolio content");
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio-content"] });
      setContentForm({
        heroTitle: data.heroTitle || "",
        heroHighlight: data.heroHighlight || "",
        heroSubtitle: data.heroSubtitle || "",
        heroDescription: data.heroDescription || "",
        heroStats: Array.isArray(data.heroStats) ? data.heroStats : [],
        heroPrimaryCtaText: data.heroPrimaryCtaText || "",
        heroPrimaryCtaHref: data.heroPrimaryCtaHref || "",
        heroSecondaryCtaText: data.heroSecondaryCtaText || "",
        heroSecondaryCtaHref: data.heroSecondaryCtaHref || "",
        testimonialsTitle: data.testimonialsTitle || "",
        testimonialsSubtitle: data.testimonialsSubtitle || "",
        testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
      });
      setContentDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setSavingContent(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-brand-purple">Portfolio Items</h2>
        <Badge>{items.length} items</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage the hero copy, CTAs, stats, and testimonials that appear on the public portfolio page.
          </p>
          <Button onClick={() => setContentDialogOpen(true)}>
            {contentData ? "Edit Portfolio Page Content" : "Add Portfolio Page Content"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {contentData ? "Edit Portfolio Page Content" : "Add Portfolio Page Content"}
            </DialogTitle>
          </DialogHeader>
          {contentLoading ? (
            <div className="py-6 text-center text-gray-600">Loading content...</div>
          ) : contentError ? (
            <div className="py-6 text-center text-red-600">Failed to load portfolio content.</div>
          ) : (
            <form className="space-y-4" onSubmit={handleSaveContent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Hero Title</Label>
                  <Input
                    value={contentForm.heroTitle}
                    onChange={(e) => handleContentChange("heroTitle", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Hero Highlight</Label>
                  <Input
                    value={contentForm.heroHighlight || ""}
                    onChange={(e) => handleContentChange("heroHighlight", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Hero Subtitle</Label>
                  <textarea
                    value={contentForm.heroSubtitle || ""}
                    onChange={(e) => handleContentChange("heroSubtitle", e.target.value)}
                    className="w-full border rounded-md p-2 mt-1 min-h-[72px]"
                  />
                </div>
                <div>
                  <Label>Hero Description</Label>
                  <textarea
                    value={contentForm.heroDescription || ""}
                    onChange={(e) => handleContentChange("heroDescription", e.target.value)}
                    className="w-full border rounded-md p-2 mt-1 min-h-[72px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Primary CTA Text</Label>
                  <Input
                    value={contentForm.heroPrimaryCtaText || ""}
                    onChange={(e) => handleContentChange("heroPrimaryCtaText", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Primary CTA Link</Label>
                  <Input
                    value={contentForm.heroPrimaryCtaHref || ""}
                    onChange={(e) => handleContentChange("heroPrimaryCtaHref", e.target.value)}
                    placeholder="/#case-studies"
                  />
                </div>
                <div>
                  <Label>Secondary CTA Text</Label>
                  <Input
                    value={contentForm.heroSecondaryCtaText || ""}
                    onChange={(e) => handleContentChange("heroSecondaryCtaText", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Secondary CTA Link</Label>
                  <Input
                    value={contentForm.heroSecondaryCtaHref || ""}
                    onChange={(e) => handleContentChange("heroSecondaryCtaHref", e.target.value)}
                    placeholder="/pricing-calculator"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Hero Stats</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addHeroStat}>
                    Add Stat
                  </Button>
                </div>
                {(contentForm.heroStats || []).map((stat, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <Input
                      className="md:col-span-3"
                      placeholder="KPI (e.g. 15+)"
                      value={stat.kpi}
                      onChange={(e) => updateHeroStat(index, "kpi", e.target.value)}
                    />
                    <Input
                      className="md:col-span-8"
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => updateHeroStat(index, "label", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeHeroStat(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {(contentForm.heroStats || []).length === 0 && (
                  <p className="text-sm text-gray-500">No stats yet. Add one to highlight key metrics.</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">Testimonials</Label>
                {(contentForm.testimonials || []).map((testimonial, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <textarea
                      className="w-full border rounded-md p-2 min-h-[72px]"
                      placeholder="Quote"
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Who"
                        value={testimonial.who}
                        onChange={(e) => updateTestimonial(index, "who", e.target.value)}
                      />
                      <Input
                        placeholder="Tag / Industry"
                        value={testimonial.tag || ""}
                        onChange={(e) => updateTestimonial(index, "tag", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestimonial(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTestimonial}>
                  Add Testimonial
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Testimonials Title</Label>
                  <Input
                    value={contentForm.testimonialsTitle || ""}
                    onChange={(e) => handleContentChange("testimonialsTitle", e.target.value)}
                    placeholder="What Our Clients Say"
                  />
                </div>
                <div>
                  <Label>Testimonials Subtitle</Label>
                  <textarea
                    value={contentForm.testimonialsSubtitle || ""}
                    onChange={(e) => handleContentChange("testimonialsSubtitle", e.target.value)}
                    className="w-full border rounded-md p-2 mt-1 min-h-[72px]"
                  />
                </div>
              </div>

              <Button type="submit" className="bg-brand-purple" disabled={savingContent}>
                {savingContent ? "Saving..." : "Save Portfolio Content"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Portfolio Item" : "Add Portfolio Item"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug || ""}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="octupus-ai"
                  required
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Octupus.ai – AI Agent Platform"
                  required
                />
              </div>
              <div>
                <Label>Industry</Label>
                <Input
                  value={form.industry || ""}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  placeholder="HealthTech / SaaS / Manufacturing"
                  required
                />
              </div>
              <div>
                <Label>Client</Label>
                <Input
                  value={form.client || ""}
                  onChange={(e) => handleChange("client", e.target.value)}
                  placeholder="AC Graphics"
                />
              </div>
              <div>
                <Label>Badge</Label>
                <Input
                  value={form.badge || ""}
                  onChange={(e) => handleChange("badge", e.target.value)}
                  placeholder="Featured Case Study"
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Short summary about this portfolio item"
                  className="w-full border rounded-md p-2 mt-1 min-h-[96px]"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Investment</Label>
                  <Input
                    value={form.investment || ""}
                    onChange={(e) => handleChange("investment", e.target.value)}
                    placeholder="$6.9K"
                  />
                </div>
                <div>
                  <Label>Total Value</Label>
                  <Input
                    value={form.totalValue || ""}
                    onChange={(e) => handleChange("totalValue", e.target.value)}
                    placeholder="$24K"
                  />
                </div>
                <div>
                  <Label>ROI</Label>
                  <Input
                    value={form.roi || ""}
                    onChange={(e) => handleChange("roi", e.target.value)}
                    placeholder="247%"
                  />
                </div>
              </div>
              <div>
                <Label>Timeline</Label>
                <Input
                  value={form.timeline || ""}
                  onChange={(e) => handleChange("timeline", e.target.value)}
                  placeholder="6 weeks"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={form.imageUrl || ""}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="/images/octupus.png"
                />
              </div>
              <div>
                <Label>Image (optional, stored value)</Label>
                <Input
                  value={form.image || ""}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="Same as Image URL unless set differently"
                />
              </div>
              <div>
                <Label>Upload Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const formData = new FormData();
                      formData.append("image", file);
                      const res = await fetch("/api/upload/portfolio-image", {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                      });
                      const data = await res.json();
                      if (!res.ok || !data?.imageUrl) {
                        throw new Error(data?.error || "Upload failed");
                      }
                      handleChange("imageUrl", data.imageUrl);
                    } catch (err) {
                      alert((err as Error).message);
                    }
                  }}
                  className="mt-1"
                />
                {form.imageUrl && (
                  <div className="mt-2 text-sm text-gray-600 break-all">{form.imageUrl}</div>
                )}
              </div>
              <div>
                <Label>Features (comma separated)</Label>
                <Input
                  value={Array.isArray(form.features) ? form.features.join(", ") : (form.features as any) || ""}
                  onChange={(e) => handleChange("features", e.target.value)}
                  placeholder="Lead automation, Pipeline tracking"
                />
              </div>
              <div>
                <Label>Tech Stack (comma separated)</Label>
                <Input
                  value={Array.isArray(form.techStack) ? form.techStack.join(", ") : (form.techStack as any) || ""}
                  onChange={(e) => handleChange("techStack", e.target.value)}
                  placeholder="React, Node.js, Stripe"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={Boolean(form.isFeatured)}
                    onCheckedChange={(v) => handleChange("isFeatured", v)}
                    id="featured"
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isActive !== false}
                    onCheckedChange={(v) => handleChange("isActive", v)}
                    id="active"
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <div>
                <Label>Order Index</Label>
                <Input
                  type="number"
                  value={Number(form.orderIndex || 0)}
                  onChange={(e) => handleChange("orderIndex", Number(e.target.value))}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-brand-purple" disabled={loading}>
                  {editingId ? (loading ? "Saving..." : "Save Changes") : loading ? "Creating..." : "Create Item"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <Card><CardContent className="p-6">Loading...</CardContent></Card>
          ) : error ? (
            <Card><CardContent className="p-6 text-red-600">Failed to load items</CardContent></Card>
          ) : items.length === 0 ? (
            <Card><CardContent className="p-6 text-gray-600">No portfolio items yet.</CardContent></Card>
          ) : (
            items.map((it) => (
              <Card key={it.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {it.imageUrl ? (
                      <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-brand-purple">{it.title}</div>
                      {it.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                      {it.isActive ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      /portfolio/{it.slug} • {it.industry} • Order {it.orderIndex}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingId(it.id)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(it.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


