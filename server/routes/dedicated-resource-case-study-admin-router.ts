import express, { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { upload } from "../middleware/cloudinaryUpload";

import {
  insertDedicatedResourceCaseStudyCardSchema,
  insertDedicatedResourceCaseStudyDetailSchema,
} from "@shared/schema";

import { DedicatedResourceCaseStudyDetailModel } from "server/models";

export function dedicatedResourceCaseStudyAdminRouter(authenticateAdmin: RequestHandler) {
  const router = express.Router();

  router.get("/dedicated-resource-case-studies", authenticateAdmin, async (_req, res) => {
    try {
      const items = await storage.listDedicatedResourceCaseStudyCards();
      res.json(items);
    } catch (error) {
      console.error("Failed to list Dedicated Resources case study cards:", error);
      res.status(500).json({ message: "Failed to list Dedicated Resources case studies" });
    }
  });

  router.get("/dedicated-resource-case-study/card/:slug", authenticateAdmin, async (req, res) => {
    try {
      const { slug } = req.params;
      const card = await storage.getDedicatedResourceCaseStudyCardBySlug(slug);
      if (!card) return res.status(404).json({ message: "Card not found" });
      res.json(card);
    } catch (error) {
      console.error("Failed to get Dedicated Resources case study card:", error);
      res.status(500).json({ message: "Failed to get Dedicated Resources case study card" });
    }
  });

  router.get("/dedicated-resource-case-study/detail/:cardId", authenticateAdmin, async (req, res) => {
    try {
      const { cardId } = req.params;
      const detail = await storage.getDedicatedResourceCaseStudyDetailByCardId(cardId);
      res.json(detail ?? null);
    } catch (error) {
      console.error("Failed to get Dedicated Resources case study detail:", error);
      res.status(500).json({ message: "Failed to get Dedicated Resources case study detail" });
    }
  });

  // upload cover image (re-use Cloudinary middleware)
  router.post(
    "/dedicated-resource-case-study/upload-card-image",
    authenticateAdmin,
    (req, res, next) => {
      upload.single("image")(req as any, res as any, (err: any) => {
        if (err) {
          console.error("❌ Multer/Cloudinary upload error:", err);
          return res.status(400).json({ message: err?.message || "Image upload failed", code: err?.code });
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const file: any = req.file;
        if (!file) return res.status(400).json({ message: "No image uploaded" });

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
        console.error("Dedicated Resources case study card image upload failed:", error);
        return res.status(500).json({ message: "Failed to upload card image" });
      }
    }
  );

  router.post("/dedicated-resource-case-study/card", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertDedicatedResourceCaseStudyCardSchema.parse(req.body);
      const created = await storage.createDedicatedResourceCaseStudyCard(validated as any);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
      console.error("Failed to create Dedicated Resources case study card:", error);
      res.status(500).json({ message: "Failed to create Dedicated Resources case study card" });
    }
  });

  router.put("/dedicated-resource-case-study/card/:slug", authenticateAdmin, async (req, res) => {
    try {
      const { slug } = req.params;
      const validated = insertDedicatedResourceCaseStudyCardSchema.partial().parse(req.body);
      const updated = await storage.updateDedicatedResourceCaseStudyCardBySlug(slug, validated as any);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
      console.error("Failed to update Dedicated Resources case study card:", error);
      res.status(500).json({ message: "Failed to update Dedicated Resources case study card" });
    }
  });

  // update detail by detailId (same as your PPC router)
  router.put("/dedicated-resource-case-study/detail", authenticateAdmin, async (req, res) => {
    try {
      const { detailId } = req.query as { detailId?: string };

      if (!detailId) return res.status(400).json({ message: "detailId is required" });

      const updated = await DedicatedResourceCaseStudyDetailModel.findByIdAndUpdate(
        detailId,
        { $set: req.body },
        { new: true }
      ).lean();

      if (!updated) return res.status(404).json({ message: "Dedicated Resources case study detail not found" });

      return res.json(updated);
    } catch (error) {
      console.error("Failed to update Dedicated Resources case study detail by detailId:", error);
      return res.status(500).json({ message: "Failed to update Dedicated Resources case study detail" });
    }
  });

  router.post("/dedicated-resource-case-study/detail", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertDedicatedResourceCaseStudyDetailSchema.parse(req.body);
      const upserted = await storage.upsertDedicatedResourceCaseStudyDetail(validated as any);
      res.json(upserted);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
      console.error("Failed to upsert Dedicated Resources case study detail:", error);
      res.status(500).json({ message: "Failed to save Dedicated Resources case study detail" });
    }
  });

  router.delete("/dedicated-resource-case-study/:slug", authenticateAdmin, async (req, res) => {
    try {
      const { slug } = req.params;
      await storage.deleteDedicatedResourceCaseStudyCardBySlug(slug);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete Dedicated Resources case study:", error);
      res.status(500).json({ message: "Failed to delete Dedicated Resources case study" });
    }
  });

  // upload TEAM MEMBER image
  router.post(
    "/dedicated-resource-case-study/upload-team-member-image",
    authenticateAdmin,
    (req, res, next) => {
      upload.single("image")(req as any, res as any, (err: any) => {
        if (err) {
          console.error("❌ Team member image upload error:", err);
          return res.status(400).json({ message: err?.message || "Image upload failed", code: err?.code });
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const file: any = req.file;
        if (!file) return res.status(400).json({ message: "No image uploaded" });

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
        console.error("Team member image upload failed:", error);
        return res.status(500).json({ message: "Failed to upload team member image" });
      }
    }
  );

  // upload TESTIMONIAL image
  router.post(
    "/dedicated-resource-case-study/upload-testimonial-image",
    authenticateAdmin,
    (req, res, next) => {
      upload.single("image")(req as any, res as any, (err: any) => {
        if (err) {
          console.error("❌ Testimonial image upload error:", err);
          return res.status(400).json({ message: err?.message || "Image upload failed", code: err?.code });
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const file: any = req.file;
        if (!file) return res.status(400).json({ message: "No image uploaded" });

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
        console.error("Testimonial image upload failed:", error);
        return res.status(500).json({ message: "Failed to upload testimonial image" });
      }
    }
  );

  return router;
}
