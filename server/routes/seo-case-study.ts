import express, { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "../storage";

import {
  insertSeoCaseStudyCardSchema,
  insertSeoCaseStudyDetailSchema,
} from "@shared/schema";

import { upload } from "../middleware/cloudinaryUpload";

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
        console.error("Failed to list SEO case study cards:", error);
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
        console.error("Failed to get SEO case study card:", error);
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
        console.error("Failed to get SEO case study detail:", error);
        res.status(500).json({ message: "Failed to get SEO case study detail" });
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
          console.error("❌ Multer/Cloudinary upload error:", err);
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
        console.error("SEO case study card image upload failed:", error);
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
        console.error("Failed to create SEO case study card:", error);
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
        console.error("Failed to update SEO case study card:", error);
        res.status(500).json({ message: "Failed to update SEO case study card" });
      }
    }
  );

  // ✅ UPSERT DETAIL (FK = cardId)
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
        console.error("Failed to upsert SEO case study detail:", error);
        res.status(500).json({ message: "Failed to save SEO case study detail" });
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
        console.error("Failed to delete SEO case study:", error);
        res.status(500).json({ message: "Failed to delete SEO case study" });
      }
    }
  );

  return router;
}
