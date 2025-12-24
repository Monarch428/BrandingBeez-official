// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useAppToast } from "@/components/ui/toaster";

// // ✅ Required label helper (adds *)
// function ReqLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <Label>
//       {children} <span className="text-red-500">*</span>
//     </Label>
//   );
// }

// export type WebCaseStudyCardTabValues = {
//   slug?: string;

//   title?: string;
//   client?: string;
//   industry?: string;
//   description?: string;

//   results?: {
//     performance?: string;
//     conversions?: string;
//     users?: string;
//   };

//   imageUrl?: string;
//   imageAlt?: string;
//   imageFit?: "contain" | "cover";

//   imagePublicId?: string;

//   link?: string;
// };

// export function WebCaseStudyCardTab({
//   form,
//   onChange,
// }: {
//   form: WebCaseStudyCardTabValues;
//   onChange: (field: keyof WebCaseStudyCardTabValues, value: any) => void;
// }) {
//   const fit = form.imageFit || "cover";
//   const results = form.results || {};
//   const [uploading, setUploading] = useState(false);

//   const { success, error: toastError } = useAppToast();
//   const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

//   return (
//     <div className="space-y-4 mt-4">
//       <div className="space-y-0.5">
//         <div className="text-sm font-semibold text-brand-purple">Web Case Study Grid Card Fields</div>
//         <div className="text-xs text-gray-500">This section controls what shows in the Website case studies grid.</div>
//       </div>

//       <div>
//         <ReqLabel>Client</ReqLabel>
//         <Input
//           value={form.client || ""}
//           onChange={(e) => onChange("client", e.target.value)}
//           placeholder="SocialLand Digital"
//           required
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <div>
//           <ReqLabel>Industry</ReqLabel>
//           <Input
//             value={form.industry || ""}
//             onChange={(e) => onChange("industry", e.target.value)}
//             placeholder="Digital Marketing Agency"
//             required
//           />
//         </div>

//         <div>
//           <ReqLabel>Short Description</ReqLabel>
//           <Input
//             value={form.description || ""}
//             onChange={(e) => onChange("description", e.target.value)}
//             placeholder="Short summary shown on the Web grid card..."
//             required
//           />
//         </div>
//       </div>

//       {/* RESULTS (fixed object like your static code) */}
//       <div className="border rounded-lg p-3 space-y-2 bg-white">
//         <ReqLabel>Results (Card)</ReqLabel>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//           <div>
//             <ReqLabel>Industry</ReqLabel>
//             <Input
//               value={results.performance || ""}
//               onChange={(e) =>
//                 onChange("results", { ...results, performance: e.target.value })
//               }
//               placeholder="2-year partnership"
//               required
//             />
//           </div>

//           <div>
//             <ReqLabel>Website Type</ReqLabel>
//             <Input
//               value={results.conversions || ""}
//               onChange={(e) =>
//                 onChange("results", { ...results, conversions: e.target.value })
//               }
//               placeholder="Lead capture system"
//               required
//             />
//           </div>

//           <div>
//             <ReqLabel>Delivery Type</ReqLabel>
//             <Input
//               value={results.users || ""}
//               onChange={(e) =>
//                 onChange("results", { ...results, users: e.target.value })
//               }
//               placeholder="Dedicated resource team"
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* Link (optional) */}
//       <div>
//         <Label>Link (optional)</Label>
//         <Input
//           value={form.link || ""}
//           onChange={(e) => onChange("link", e.target.value)}
//           placeholder="/case-studies/socialland-website (or leave empty and build from slug)"
//         />
//       </div>

//       {/* Image Upload (same style as PPC) */}
//       <div className="space-y-2">
//         <Label>Card Image (Choose local file → upload to Cloudinary)</Label>

//         <input
//           type="file"
//           accept="image/*"
//           disabled={uploading}
//           onChange={async (e) => {
//             const file = e.target.files?.[0];
//             if (!file) return;

//             if (!token) {
//               toastError("Admin token missing. Please login again.", "Auth");
//               return;
//             }

//             try {
//               setUploading(true);

//               const fd = new FormData();
//               fd.append("image", file);

//               // ✅ web endpoint
//               const res = await fetch("/api/admin/web-case-study/upload-card-image", {
//                 method: "POST",
//                 headers: { Authorization: `Bearer ${token}` },
//                 body: fd,
//               });

//               const text = await res.text();
//               let data: any = {};
//               try {
//                 data = JSON.parse(text);
//               } catch {}

//               if (!res.ok || !data?.imageUrl) {
//                 console.error("Upload failed:", res.status, text);
//                 throw new Error(data?.message || `Upload failed (${res.status})`);
//               }

//               onChange("imageUrl", data.imageUrl);
//               if (data.publicId) onChange("imagePublicId", data.publicId);
//               if (!form.imageAlt) onChange("imageAlt", file.name);

//               success("Card image uploaded successfully.", "Upload");
//             } catch (err: any) {
//               console.error(err);
//               toastError(err?.message || "Image upload failed.", "Error");
//             } finally {
//               setUploading(false);
//             }
//           }}
//           className="mt-1"
//         />

//         {uploading ? <div className="text-xs text-gray-500">Uploading to Cloudinary...</div> : null}

//         {form.imageUrl ? (
//           <>
//             <div className="text-xs text-gray-600 break-all">{form.imageUrl}</div>
//             <Button
//               type="button"
//               variant="outline"
//               className="mt-1"
//               onClick={() => {
//                 onChange("imageUrl", "");
//                 onChange("imagePublicId", "");
//               }}
//             >
//               Remove Image
//             </Button>
//           </>
//         ) : null}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <div>
//           <Label>Image Alt</Label>
//           <Input
//             value={form.imageAlt || ""}
//             onChange={(e) => onChange("imageAlt", e.target.value)}
//             placeholder="Website screenshot"
//           />
//         </div>

//         <div>
//           <Label>Image Fit</Label>
//           <select
//             value={fit}
//             onChange={(e) => onChange("imageFit", e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white"
//           >
//             <option value="cover">cover</option>
//             <option value="contain">contain</option>
//           </select>
//         </div>
//       </div>

//       {form.imageUrl ? (
//         <div className="border rounded-lg p-2 bg-white">
//           <div className="text-xs text-gray-500 mb-2">Preview</div>
//           <div className="aspect-video overflow-hidden rounded border">
//             <img
//               src={form.imageUrl}
//               alt={form.imageAlt || "Preview"}
//               className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
//             />
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }











import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppToast } from "@/components/ui/toaster";

// ✅ Required label helper (adds *)
function ReqLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

type FieldErrors = Record<string, string>;

export type WebCaseStudyCardTabValues = {
  slug?: string;

  title?: string;
  client?: string;
  industry?: string;
  description?: string;

  results?: {
    performance?: string;
    conversions?: string;
    // users?: string | null;
  };

  imageUrl?: string;
  imageAlt?: string;
  imageFit?: "contain" | "cover";

  imagePublicId?: string;

  link?: string;

  order?: number;
};

export function WebCaseStudyCardTab({
  form,
  onChange,
  errors = {},
}: {
  form: WebCaseStudyCardTabValues;
  onChange: (field: keyof WebCaseStudyCardTabValues, value: any) => void;
  errors?: FieldErrors;
}) {
  const fit = form.imageFit || "cover";
  const results = form.results || {};
  const [uploading, setUploading] = useState(false);

  const { success, error: toastError } = useAppToast();
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const errClass = (key: string) => (errors?.[key] ? "border-red-500 focus-visible:ring-red-500" : "");
  const errText = (key: string) => (errors?.[key] ? <div className="text-xs text-red-600 mt-1">{errors[key]}</div> : null);

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-brand-purple">Web Case Study Grid Card Fields</div>
        <div className="text-xs text-gray-500">This section controls what shows in the Website case studies grid.</div>
      </div>

      {/* ✅ NEW: Order */}
      <div>
        <ReqLabel>Order</ReqLabel>
        <Input
          data-field="order"
          type="number"
          min={0}
          step={1}
          className={errClass("order")}
          value={
            form.order === undefined || form.order === null
              ? ""
              : String(form.order)
          }
          onChange={(e) => {
            const raw = e.target.value;

            // allow empty value
            if (raw === "") {
              onChange("order", undefined);
              return;
            }

            const n = Number(raw);
            onChange("order", Number.isFinite(n) ? Math.max(0, Math.floor(n)) : undefined);
          }}
          placeholder="Optional"
        />

        {errText("order")}
      </div>

      <div>
        <ReqLabel>Client</ReqLabel>
        <Input data-field="client" className={errClass("client")} value={form.client || ""} onChange={(e) => onChange("client", e.target.value)} placeholder="SocialLand Digital" required />
        {errText("client")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <ReqLabel>Short Description</ReqLabel>
          <Input data-field="description" className={errClass("description")} value={form.description || ""} onChange={(e) => onChange("description", e.target.value)} placeholder="Short summary shown on the Web grid card..." required />
          {errText("description")}
        </div>
      </div>

      {/* RESULTS */}
      <div className="border rounded-lg p-3 space-y-2 bg-white">
        <ReqLabel>Results (Card)</ReqLabel>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <ReqLabel>Cost</ReqLabel>
            <Input
              data-field="results.performance"
              className={errClass("results.performance")}
              value={results.performance || ""}
              onChange={(e) => onChange("results", { ...results, performance: e.target.value })}
              placeholder="2-year partnership"
              required
            />
            {errText("results.performance")}
          </div>

          <div>
            <ReqLabel>Delivery Time</ReqLabel>
            <Input
              data-field="results.conversions"
              className={errClass("results.conversions")}
              value={results.conversions || ""}
              onChange={(e) => onChange("results", { ...results, conversions: e.target.value })}
              placeholder="Lead capture system"
              required
            />
            {errText("results.conversions")}
          </div>

          <div>
            <ReqLabel>Industry</ReqLabel>
            <Input
              data-field="industry"
              className={errClass("industry")}
              value={form.industry || ""}
              onChange={(e) => onChange("industry", e.target.value)}
              placeholder="Digital Marketing Agency"
              required
            />
            {errText("industry")}
          </div>
        </div>
      </div>

      {/* Link (optional) */}
      <div>
        <Label>Link (optional)</Label>
        <Input value={form.link || ""} onChange={(e) => onChange("link", e.target.value)} placeholder="/case-studies/socialland-website (or leave empty and build from slug)" />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Card Image (Choose local file → upload to Cloudinary)</Label>

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

              const res = await fetch("/api/admin/web-case-study/upload-card-image", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
              });

              const text = await res.text();
              let data: any = {};
              try {
                data = JSON.parse(text);
              } catch { }

              if (!res.ok || !data?.imageUrl) {
                console.error("Upload failed:", res.status, text);
                throw new Error(data?.message || `Upload failed (${res.status})`);
              }

              onChange("imageUrl", data.imageUrl);
              if (data.publicId) onChange("imagePublicId", data.publicId);
              if (!form.imageAlt) onChange("imageAlt", file.name);

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

        {form.imageUrl ? (
          <>
            <div className="text-xs text-gray-600 break-all">{form.imageUrl}</div>
            <Button
              type="button"
              variant="outline"
              className="mt-1"
              onClick={() => {
                onChange("imageUrl", "");
                onChange("imagePublicId", "");
              }}
            >
              Remove Image
            </Button>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Image Alt</Label>
          <Input value={form.imageAlt || ""} onChange={(e) => onChange("imageAlt", e.target.value)} placeholder="Website screenshot" />
        </div>

        <div>
          <Label>Image Fit</Label>
          <select value={fit} onChange={(e) => onChange("imageFit", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white">
            <option value="cover">cover</option>
            <option value="contain">contain</option>
          </select>
        </div>
      </div>

      {form.imageUrl ? (
        <div className="border rounded-lg p-2 bg-white">
          <div className="text-xs text-gray-500 mb-2">Preview</div>
          <div className="aspect-video overflow-hidden rounded border">
            <img src={form.imageUrl} alt={form.imageAlt || "Preview"} className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"}`} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
