import express, { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "../storage";

import {
  insertSeoCaseStudyCardSchema,
  insertSeoCaseStudyDetailSchema,
} from "@shared/schema";

import { upload } from "../middleware/cloudinaryUpload";
import { SeoCaseStudyDetailModel } from "server/models";

// ✅ safer logger for Node 24 (avoids util.inspect crash)
function logError(prefix: string, err: unknown) {
  if (err instanceof Error) {
    console.error(prefix, err.message);
    if (err.stack) console.error(err.stack);
    return;
  }
  try {
    console.error(prefix, String(err));
  } catch {
    console.error(prefix, "Unknown error");
  }
}

export function seoCaseStudyAdminRouter(authenticateAdmin: RequestHandler) {
  const router = express.Router();

  // ✅ LIST cards for admin manager
  router.get(
    "/seo-case-studies",
    authenticateAdmin,
    async (_req: Request, res: Response) => {
      try {
        const items = await storage.listSeoCaseStudyCards();
        res.json(items);
      } catch (error) {
        logError("Failed to list SEO case study cards:", error);
        res.status(500).json({ message: "Failed to list SEO case studies" });
      }
    }
  );

  // ✅ GET single card by slug (helps frontend fetch _id for FK)
  router.get(
    "/seo-case-study/card/:slug",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        const card = await storage.getSeoCaseStudyCardBySlug(slug);
        if (!card) return res.status(404).json({ message: "Card not found" });
        res.json(card);
      } catch (error) {
        logError("Failed to get SEO case study card:", error);
        res.status(500).json({ message: "Failed to get SEO case study card" });
      }
    }
  );

  // ✅ GET detail by cardId (so edit loads existing detail)
  router.get(
    "/seo-case-study/detail/:cardId",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const { cardId } = req.params;
        const detail = await storage.getSeoCaseStudyDetailByCardId(cardId);
        res.json(detail ?? null);
      } catch (error) {
        logError("Failed to get SEO case study detail:", error);
        res.status(500).json({ message: "Failed to get SEO case study detail" });
      }
    }
  );

  // ✅ GET detail by query (?cardId=...)
  router.get(
    "/seo-case-study/detail",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const cardId = String(req.query.cardId || "").trim();
        if (!cardId) {
          return res.status(400).json({ message: "cardId query param is required" });
        }

        const detail = await storage.getSeoCaseStudyDetailByCardId(cardId);
        return res.json(detail ?? null);
      } catch (error) {
        logError("Failed to get SEO case study detail (query):", error);
        return res.status(500).json({ message: "Failed to get SEO case study detail" });
      }
    }
  );

  // ✅ UPLOAD CARD IMAGE (Local → Cloudinary)
  router.post(
    "/seo-case-study/upload-card-image",
    authenticateAdmin,
    (req, res, next) => {
      upload.single("image")(req as any, res as any, (err: any) => {
        if (err) {
          logError("❌ Multer/Cloudinary upload error:", err);
          return res.status(400).json({
            message: err?.message || "Image upload failed",
            code: err?.code,
          });
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const file: any = req.file;

        if (!file) {
          return res.status(400).json({ message: "No image uploaded" });
        }

        const imageUrl = file.path;
        const publicId = file.filename;
        const originalName = file.originalname;

        if (!imageUrl || !publicId) {
          return res.status(500).json({
            message: "Upload completed but missing Cloudinary fields",
            debug: { imageUrl, publicId },
          });
        }

        return res.json({ imageUrl, publicId, originalName });
      } catch (error) {
        logError("SEO case study card image upload failed:", error);
        return res.status(500).json({ message: "Failed to upload card image" });
      }
    }
  );

  // ✅ CREATE CARD (slug is HERE)
  router.post(
    "/seo-case-study/card",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const validated = insertSeoCaseStudyCardSchema.parse(req.body);
        const created = await storage.createSeoCaseStudyCard(validated);
        res.json(created);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        logError("Failed to create SEO case study card:", error);
        res.status(500).json({ message: "Failed to create SEO case study card" });
      }
    }
  );

  // ✅ UPDATE CARD BY SLUG
  router.put(
    "/seo-case-study/card/:slug",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        const validated = insertSeoCaseStudyCardSchema.partial().parse(req.body);
        const updated = await storage.updateSeoCaseStudyCardBySlug(slug, validated);
        res.json(updated);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        logError("Failed to update SEO case study card:", error);
        res.status(500).json({ message: "Failed to update SEO case study card" });
      }
    }
  );

  router.post(
    "/seo-case-study/upload-testimonial-image",
    authenticateAdmin,
    (req, res, next) => {
      upload.single("image")(req as any, res as any, (err: any) => {
        if (err) {
          return res.status(400).json({
            message: err?.message || "Image upload failed",
            code: err?.code,
          });
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const file: any = req.file;

        if (!file) return res.status(400).json({ message: "No image uploaded" });

        const imageUrl = file.path;      // Cloudinary secure_url (depends on your middleware)
        const publicId = file.filename;  // Cloudinary public_id
        const originalName = file.originalname;

        if (!imageUrl || !publicId) {
          return res.status(500).json({
            message: "Upload completed but missing Cloudinary fields",
            debug: { imageUrl, publicId },
          });
        }

        return res.json({ imageUrl, publicId, originalName });
      } catch (error) {
        return res.status(500).json({ message: "Failed to upload testimonial image" });
      }
    }
  );

  // ✅ UPSERT DETAIL (FK = cardId)  (Create or overwrite by cardId)
  router.post(
    "/seo-case-study/detail",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const validated = insertSeoCaseStudyDetailSchema.parse(req.body);
        const upserted = await storage.upsertSeoCaseStudyDetail(validated as any);
        res.json(upserted);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        logError("Failed to upsert SEO case study detail:", error);
        res.status(500).json({ message: "Failed to save SEO case study detail" });
      }
    }
  );

  // ✅ UPDATE detail by detailId (Mongo _id) — PARAM ROUTE (FIXES YOUR 404)
  router.put(
    "/seo-case-study/detail/:detailId",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const detailId = String(req.params.detailId || "").trim();
        if (!detailId) return res.status(400).json({ message: "detailId is required" });

        const validated = insertSeoCaseStudyDetailSchema.parse(req.body);

        const updated = await SeoCaseStudyDetailModel.findByIdAndUpdate(
          detailId,
          { $set: validated },
          { new: true }
        ).lean();

        if (!updated) return res.status(404).json({ message: "Detail not found" });

        res.json(updated);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        logError("Failed to update SEO case study detail (param):", error);
        res.status(500).json({ message: "Failed to update SEO case study detail" });
      }
    }
  );

  // ✅ UPDATE detail by detailId (Mongo _id) — QUERY ROUTE (kept for compatibility)
  router.put(
    "/seo-case-study/detail",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const detailId = String(req.query.detailId || "").trim();
        if (!detailId) return res.status(400).json({ message: "detailId is required" });

        const validated = insertSeoCaseStudyDetailSchema.parse(req.body);

        const updated = await SeoCaseStudyDetailModel.findByIdAndUpdate(
          detailId,
          { $set: validated },
          { new: true }
        ).lean();

        if (!updated) return res.status(404).json({ message: "Detail not found" });

        res.json(updated);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        logError("Failed to update SEO case study detail (query):", error);
        res.status(500).json({ message: "Failed to update SEO case study detail" });
      }
    }
  );

  // ✅ DELETE card (also deletes detail)
  router.delete(
    "/seo-case-study/:slug",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        await storage.deleteSeoCaseStudyCardBySlug(slug);
        res.json({ success: true });
      } catch (error) {
        logError("Failed to delete SEO case study:", error);
        res.status(500).json({ message: "Failed to delete SEO case study" });
      }
    }
  );

  return router;
}
