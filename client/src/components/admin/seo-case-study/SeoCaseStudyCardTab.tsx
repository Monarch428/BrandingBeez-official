import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppToast } from "@/components/ui/toaster";

export type SeoCaseStudyCardTabValues = {
  slug?: string;

  cardTitle?: string;
  cardClient?: string;
  cardIndustry?: string;
  cardDescription?: string;

  cardResultsTraffic?: string;
  cardResultsKeywords?: string;
  cardResultsRevenue?: string;

  cardCoverImageUrl?: string;
  cardCoverImageAlt?: string;
  cardCoverFit?: "contain" | "cover";

  // ✅ optional (recommended) to store Cloudinary public_id
  cardCoverImagePublicId?: string;
};

export function SeoCaseStudyCardTab({
  form,
  onChange,
}: {
  form: SeoCaseStudyCardTabValues;
  onChange: (field: keyof SeoCaseStudyCardTabValues, value: any) => void;
}) {
  const fit = form.cardCoverFit || "contain";
  const [uploading, setUploading] = useState(false);

  const { success, error: toastError } = useAppToast();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-brand-purple">
          SEO Grid Card Fields
        </div>
        <div className="text-xs text-gray-500">
          This section controls what shows in the SEO page case studies grid.
        </div>
      </div>

      <div>
        <Label>Card Client</Label>
        <Input
          value={form.cardClient || ""}
          onChange={(e) => onChange("cardClient", e.target.value)}
          placeholder="Atlantic Foundation & Crawl Space Repair"
          required
        />
      </div>

      <div>
        <Label>Card Industry</Label>
        <Input
          value={form.cardIndustry || ""}
          onChange={(e) => onChange("cardIndustry", e.target.value)}
          placeholder="Construction"
          required
        />
      </div>

      <div>
        <Label>Card Description</Label>
        <textarea
          value={form.cardDescription || ""}
          onChange={(e) => onChange("cardDescription", e.target.value)}
          placeholder="Short summary shown on the SEO grid card..."
          className="w-full border rounded-md p-2 mt-1 min-h-[84px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label>Organic Traffic</Label>
          <Input
            value={form.cardResultsTraffic || ""}
            onChange={(e) => onChange("cardResultsTraffic", e.target.value)}
            placeholder="+49%"
            required
          />
        </div>
        <div>
          <Label>Keywords Ranking</Label>
          <Input
            value={form.cardResultsKeywords || ""}
            onChange={(e) => onChange("cardResultsKeywords", e.target.value)}
            placeholder="122 #1 rankings"
            required
          />
        </div>
        <div>
          <Label>Revenue Impact</Label>
          <Input
            value={form.cardResultsRevenue || ""}
            onChange={(e) => onChange("cardResultsRevenue", e.target.value)}
            placeholder="121% more leads"
            required
          />
        </div>
      </div>

      {/* ✅ Local file -> Cloudinary upload */}
      <div className="space-y-2">
        <Label>Card Cover Image (Choose local file → upload to Cloudinary)</Label>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // ✅ guard: admin token
            if (!token) {
              toastError("Admin token missing. Please login again.", "Auth");
              return;
            }

            try {
              setUploading(true);

              const fd = new FormData();
              fd.append("image", file);

              // ✅ do NOT set Content-Type manually for FormData
              const headers: Record<string, string> = {
                Authorization: `Bearer ${token}`,
              };

              const res = await fetch(
                "/api/admin/seo-case-study/upload-card-image",
                {
                  method: "POST",
                  headers,
                  body: fd,
                }
              );

              // ✅ better error parsing
              const text = await res.text();
              let data: any = {};
              try {
                data = JSON.parse(text);
              } catch {
                data = {};
              }

              if (!res.ok || !data?.imageUrl) {
                console.error("Upload failed response:", res.status, text);
                throw new Error(
                  data?.message || `Upload failed (${res.status})`
                );
              }

              // ✅ store in form
              onChange("cardCoverImageUrl", data.imageUrl);

              // optional store public id
              if (data.publicId) {
                onChange("cardCoverImagePublicId", data.publicId);
              }

              // ✅ set alt if empty
              if (!form.cardCoverImageAlt) {
                onChange("cardCoverImageAlt", file.name);
              }

              success("Card image uploaded successfully.", "Upload");
            } catch (err) {
              console.error(err);
              toastError(
                (err as Error).message || "Image upload failed.",
                "Error"
              );
            } finally {
              setUploading(false);
            }
          }}
          className="mt-1"
        />

        {uploading ? (
          <div className="text-xs text-gray-500">Uploading to Cloudinary...</div>
        ) : null}

        {form.cardCoverImageUrl ? (
          <div className="text-xs text-gray-600 break-all">
            {form.cardCoverImageUrl}
          </div>
        ) : null}

        {form.cardCoverImageUrl ? (
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={() => {
              onChange("cardCoverImageUrl", "");
              onChange("cardCoverImagePublicId", "");
            }}
          >
            Remove Image
          </Button>
        ) : null}
      </div>

      <div>
        <Label>Card Cover Image Alt</Label>
        <Input
          value={form.cardCoverImageAlt || ""}
          onChange={(e) => onChange("cardCoverImageAlt", e.target.value)}
          placeholder="Atlantic Foundation Search Console results"
        />
      </div>

      <div>
        <Label>Card Cover Fit</Label>
        <select
          value={fit}
          onChange={(e) => onChange("cardCoverFit", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
        >
          <option value="contain">contain</option>
          <option value="cover">cover</option>
        </select>
      </div>

      {form.cardCoverImageUrl ? (
        <div className="border rounded-lg p-2 bg-white">
          <div className="text-xs text-gray-500 mb-2">Preview</div>
          <div className="aspect-video overflow-hidden rounded border">
            <img
              src={form.cardCoverImageUrl}
              alt={form.cardCoverImageAlt || "Preview"}
              className={`w-full h-full ${
                fit === "cover" ? "object-cover" : "object-contain"
              }`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
