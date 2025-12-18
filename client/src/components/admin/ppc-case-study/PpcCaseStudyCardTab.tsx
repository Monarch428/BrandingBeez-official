import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppToast } from "@/components/ui/toaster";
import type { PpcResultItem } from "./PpcCaseStudiesManager";

// ✅ Required label helper (adds *)
function ReqLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

export type PpcCaseStudyCardTabValues = {
  slug?: string;

  title?: string;
  client?: string;
  industry?: string;
  description?: string;

  results?: PpcResultItem[];

  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";

  coverImagePublicId?: string;
};

export function PpcCaseStudyCardTab({
  form,
  onChange,
  addResult,
  updateResult,
  removeResult,
}: {
  form: PpcCaseStudyCardTabValues;
  onChange: (field: keyof PpcCaseStudyCardTabValues, value: any) => void;

  addResult: () => void;
  updateResult: (index: number, field: keyof PpcResultItem, value: any) => void;
  removeResult: (index: number) => void;
}) {
  const fit = form.coverFit || "contain";
  const results = form.results || [];
  const [uploading, setUploading] = useState(false);

  const { success, error: toastError } = useAppToast();
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-brand-purple">
          PPC Grid Card Fields
        </div>
        <div className="text-xs text-gray-500">
          This section controls what shows in the PPC case studies grid.
        </div>
      </div>

      <div>
        <ReqLabel>Client</ReqLabel>
        <Input
          value={form.client || ""}
          onChange={(e) => onChange("client", e.target.value)}
          placeholder="Arlingsworth Solicitors – UK Law Firm"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <ReqLabel>Industry</ReqLabel>
          <Input
            value={form.industry || ""}
            onChange={(e) => onChange("industry", e.target.value)}
            placeholder="Legal Services"
            required
          />
        </div>

        <div>
          <ReqLabel>Short Description</ReqLabel>
          <Input
            value={form.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Short summary shown on the PPC grid card..."
            required
          />
        </div>
      </div>

      {/* RESULTS (dynamic fields like your static object) */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <div className="flex items-center justify-between">
          <ReqLabel>Results (Card)</ReqLabel>
          <Button type="button" variant="outline" size="sm" onClick={addResult}>
            Add Result
          </Button>
        </div>

        {results.length === 0 ? (
          <div className="text-xs text-amber-600">
            ⚠️ Add at least 1 result item (ex: CPA, Conversion Rate, Clicks).
          </div>
        ) : null}

        {results.map((r, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input
              className="md:col-span-2"
              value={r.key}
              onChange={(e) => updateResult(i, "key", e.target.value)}
              placeholder="cpa"
            />
            <Input
              className="md:col-span-4"
              value={r.label}
              onChange={(e) => updateResult(i, "label", e.target.value)}
              placeholder="Lowest CPA"
            />
            <Input
              className="md:col-span-4"
              value={r.value}
              onChange={(e) => updateResult(i, "value", e.target.value)}
              placeholder="£6.5"
            />
            <Button
              className="md:col-span-2"
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeResult(i)}
            >
              Remove
            </Button>

            <Input
              className="md:col-span-12"
              value={r.colorClass || ""}
              onChange={(e) => updateResult(i, "colorClass", e.target.value)}
              placeholder="Optional: Tailwind colorClass e.g. text-green-600"
            />
          </div>
        ))}
      </div>

      {/* Image Upload (same as SEO) */}
      <div className="space-y-2">
        <Label>Card Cover Image (Choose local file → upload to Cloudinary)</Label>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!token) {
              toastError("Admin token missing. Please login again.", "Auth");
              return;
            }

            try {
              setUploading(true);

              const fd = new FormData();
              fd.append("image", file);

              const res = await fetch("/api/admin/ppc-case-study/upload-card-image", {
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
          <Label>Card Cover Image Alt</Label>
          <Input
            value={form.coverImageAlt || ""}
            onChange={(e) => onChange("coverImageAlt", e.target.value)}
            placeholder="Dashboard screenshot"
          />
        </div>

        <div>
          <Label>Card Cover Fit</Label>
          <select
            value={fit}
            onChange={(e) => onChange("coverFit", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
          >
            <option value="contain">contain</option>
            <option value="cover">cover</option>
          </select>
        </div>
      </div>

      {form.coverImageUrl ? (
        <div className="border rounded-lg p-2 bg-white">
          <div className="text-xs text-gray-500 mb-2">Preview</div>
          <div className="aspect-video overflow-hidden rounded border">
            <img
              src={form.coverImageUrl}
              alt={form.coverImageAlt || "Preview"}
              className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
