// DedicatedResourceCaseStudyCardTab.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppToast } from "@/components/ui/toaster";

// ✅ Required label helper
function RequiredLabel({ children }: { children: string }) {
  return (
    <Label>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  );
}

export type DedicatedResourceCaseStudyCardTabValues = {
  slug?: string;

  title?: string;
  client?: string;
  industry?: string;
  description?: string;

  badgeText?: string;
  badgeClass?: string;

  logoUrl?: string;
  logoAlt?: string;

  categoryLabel?: string;
  categoryClass?: string;

  results?: { key?: string; label?: string; value?: string; valueClass?: string }[];

  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";
  coverImagePublicId?: string;

  link?: string;
};

export function DedicatedResourceCaseStudyCardTab({
  form,
  onChange,
}: {
  form: DedicatedResourceCaseStudyCardTabValues;
  onChange: (field: keyof DedicatedResourceCaseStudyCardTabValues, value: any) => void;
}) {
  const fit = form.coverFit || "cover";
  const results = Array.isArray(form.results) ? form.results : [];
  const [uploading, setUploading] = useState(false);

  const { success, error: toastError } = useAppToast();
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const uploadCoverImage = async (file: File) => {
    if (!token) {
      toastError("Admin token missing. Please login again.", "Auth");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/admin/dedicated-resource-case-study/upload-card-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok || !data?.imageUrl) {
        console.error("Upload failed:", res.status, text);
        throw new Error(data?.message || `Upload failed (${res.status})`);
      }

      onChange("coverImageUrl", data.imageUrl);
      if (data.publicId) onChange("coverImagePublicId", data.publicId);
      if (!form.coverImageAlt) onChange("coverImageAlt", file.name);

      success("Card image uploaded successfully.", "Upload");
    } catch (err: any) {
      console.error(err);
      toastError(err?.message || "Image upload failed.", "Error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-brand-purple">Dedicated Resources Grid Card Fields</div>
        <div className="text-xs text-gray-500">This section controls what shows in the Dedicated Resources case studies grid.</div>
      </div>

      <div>
        <RequiredLabel>White Label Partner</RequiredLabel>
        <Input value={form.client || ""} onChange={(e) => onChange("client", e.target.value)} placeholder="SocialLand Digital" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <RequiredLabel>Industry</RequiredLabel>
          <Input value={form.industry || ""} onChange={(e) => onChange("industry", e.target.value)} placeholder="Digital Marketing Agency" required />
        </div>

        <div>
          <RequiredLabel>Short Description</RequiredLabel>
          <Input
            value={form.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="6-person dedicated team with UK agency achieving seamless collaboration..."
            required
          />
        </div>
      </div>

      {/* Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Top Badge Text</Label>
          <Input value={form.badgeText || ""} onChange={(e) => onChange("badgeText", e.target.value)} placeholder="+30 Months Onwards" />
        </div>
        <div>
          <Label>Top Badge Class (Tailwind)</Label>
          <Input value={form.badgeClass || ""} onChange={(e) => onChange("badgeClass", e.target.value)} placeholder="bg-brand-coral text-white" />
        </div>
      </div>

      {/* Logo + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Logo URL (optional)</Label>
          <Input value={form.logoUrl || ""} onChange={(e) => onChange("logoUrl", e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <Label>Logo Alt</Label>
          <Input value={form.logoAlt || ""} onChange={(e) => onChange("logoAlt", e.target.value)} placeholder="SocialLand logo" />
        </div>

        <div>
          <Label>Category Label</Label>
          <Input value={form.categoryLabel || ""} onChange={(e) => onChange("categoryLabel", e.target.value)} placeholder="Digital Marketing" />
        </div>
        <div>
          <Label>Category Class (Tailwind)</Label>
          <Input
            value={form.categoryClass || ""}
            onChange={(e) => onChange("categoryClass", e.target.value)}
            placeholder="bg-purple-100 text-purple-800 border border-purple-200"
          />
        </div>
      </div>

      {/* KPI Results */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">KPI Results (Card)</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange("results", [...results, { key: "", label: "", value: "", valueClass: "" }])}>
            Add KPI
          </Button>
        </div>

        {results.length === 0 ? <div className="text-xs text-amber-600">Add at least 1 KPI.</div> : null}

        {results.map((r, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input
              className="md:col-span-2"
              value={r.key || ""}
              onChange={(e) => {
                const next = [...results];
                next[i] = { ...next[i], key: e.target.value };
                onChange("results", next);
              }}
              placeholder="key"
            />
            <Input
              className="md:col-span-4"
              value={r.label || ""}
              onChange={(e) => {
                const next = [...results];
                next[i] = { ...next[i], label: e.target.value };
                onChange("results", next);
              }}
              placeholder="Label (Project Output)"
            />
            <Input
              className="md:col-span-3"
              value={r.value || ""}
              onChange={(e) => {
                const next = [...results];
                next[i] = { ...next[i], value: e.target.value };
                onChange("results", next);
              }}
              placeholder="Value (+150%)"
            />
            <Input
              className="md:col-span-2"
              value={r.valueClass || ""}
              onChange={(e) => {
                const next = [...results];
                next[i] = { ...next[i], valueClass: e.target.value };
                onChange("results", next);
              }}
              placeholder="text-green-600"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="md:col-span-1"
              onClick={() => onChange("results", results.filter((_, idx) => idx !== i))}
            >
              X
            </Button>
          </div>
        ))}
      </div>

      {/* Link */}
      <div>
        <Label>Link (optional)</Label>
        <Input value={form.link || ""} onChange={(e) => onChange("link", e.target.value)} placeholder="/dedicated-resources/social-land (or leave empty and build from slug)" />
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <Label>Card Cover Image (Choose local file → upload to Cloudinary)</Label>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            await uploadCoverImage(file);
          }}
          className="mt-1"
        />

        {uploading ? <div className="text-xs text-gray-500">Uploading to Cloudinary...</div> : null}

        {form.coverImageUrl ? (
          <>
            <div className="text-xs text-gray-600 break-all">{form.coverImageUrl}</div>
            <Button
              type="button"
              variant="outline"
              className="mt-1"
              onClick={() => {
                onChange("coverImageUrl", "");
                onChange("coverImagePublicId", "");
              }}
            >
              Remove Image
            </Button>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Cover Image Alt</Label>
          <Input value={form.coverImageAlt || ""} onChange={(e) => onChange("coverImageAlt", e.target.value)} placeholder="Team collaboration" />
        </div>

        <div>
          <Label>Cover Image Fit</Label>
          <select
            value={fit}
            onChange={(e) => onChange("coverFit", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
          >
            <option value="cover">cover</option>
            <option value="contain">contain</option>
          </select>
        </div>
      </div>

      {form.coverImageUrl ? (
        <div className="border rounded-lg p-2 bg-white">
          <div className="text-xs text-gray-500 mb-2">Preview</div>
          <div className="aspect-video overflow-hidden rounded border">
            <img src={form.coverImageUrl} alt={form.coverImageAlt || "Preview"} className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"}`} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
