// src/server/portfolio-router.ts
import express, { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { upload as cloudinaryUpload } from "../middleware/cloudinaryUpload";
import {
  insertPortfolioItemSchema,
  insertPortfolioContentSchema,
} from "@shared/schema";
import router from "server/routes/appointments";

export function createPortfolioRouter(
  authenticateAdmin: RequestHandler,
  publicContentRateLimit: RequestHandler,
) {
  const router = express.Router();

  // --- POST /api/upload/portfolio-image ---------------------------
  router.post(
    "/upload/portfolio-image",
    authenticateAdmin,
    (req: Request, res: Response) => {
      console.log("[upload-portfolio-image] Starting Cloudinary upload request");

      cloudinaryUpload.single("image")(req as any, res as any, (err: any) => {
        if (err) {
          console.error("[upload-portfolio-image] Multer/Cloudinary error:", err);
          return res
            .status(400)
            .json({ error: err.message || "Upload failed" });
        }

        if (!req.file) {
          console.warn("[upload-portfolio-image] No file provided in request");
          return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.file as Express.Multer.File & {
          path?: string; // Cloudinary URL
          filename?: string; // Cloudinary public ID
        };

        console.log("[upload-portfolio-image] Uploaded to Cloudinary:", {
          url: file.path,
          publicId: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        });

        const imageUrl = file.path;

        res.json({
          success: true,
          imageUrl, // use this in PortfolioItem.imageUrl
          filename: file.filename, // optional: store as publicId in `image` field
        });
      });
    },
  );

  // =================================================================
  // Public Portfolio Routes
  // =================================================================

  // --- GET /api/portfolio -----------------------------------------
  router.get(
    "/portfolio",
    publicContentRateLimit,
    async (req: Request, res: Response) => {
      try {
        const items = await storage.getPublicPortfolioItems();
        res.json(items);
      } catch (error) {
        console.error("Error fetching portfolio items:", error);
        res.status(500).json({ message: "Failed to fetch portfolio items" });
      }
    },
  );

  // --- GET /api/portfolio/content ---------------------------------
  router.get(
    "/portfolio/content",
    publicContentRateLimit,
    async (req: Request, res: Response) => {
      try {
        const content = await storage.getPortfolioContent();
        res.json(content);
      } catch (error) {
        console.error("Error fetching portfolio content:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch portfolio content" });
      }
    },
  );

  // --- GET /api/portfolio/:slug -----------------------------------
  router.get(
    "/portfolio/:slug",
    publicContentRateLimit,
    async (req: Request, res: Response) => {
      try {
        const slug = req.params.slug;
        const item = await storage.getPortfolioItemBySlug(slug);
        if (!item) {
          return res
            .status(404)
            .json({ message: "Portfolio item not found" });
        }
        res.json(item);
      } catch (error) {
        console.error("Error fetching portfolio item:", error);
        res.status(500).json({ message: "Failed to fetch portfolio item" });
      }
    },
  );

  // =================================================================
  // Admin Portfolio Content Routes
  // =================================================================

  // --- GET /api/admin/portfolio-content ---------------------------
  router.get(
    "/admin/portfolio-content",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const content = await storage.getPortfolioContent();
        res.json(content);
      } catch (error) {
        console.error("Failed to fetch portfolio content:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch portfolio content" });
      }
    },
  );

  // --- PUT /api/admin/portfolio-content ---------------------------
  router.put(
    "/admin/portfolio-content",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const validated = insertPortfolioContentSchema.parse(req.body);
        const content = await storage.upsertPortfolioContent(validated);
        res.json(content);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        console.error("Failed to update portfolio content:", error);
        res
          .status(500)
          .json({ message: "Failed to update portfolio content" });
      }
    },
  );

  // --- PUT /api/admin/portfolio-content/stats ---------------------
  // Update hero stats only
  router.put(
    "/admin/portfolio-content/stats",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const { heroStats } = req.body;

        if (!Array.isArray(heroStats)) {
          return res
            .status(400)
            .json({ message: "heroStats must be an array" });
        }

        const existingContent = await storage.getPortfolioContent();
        const updatedContent = {
          ...existingContent,
          heroStats,
        };

        const validated =
          insertPortfolioContentSchema.parse(updatedContent);
        const content = await storage.upsertPortfolioContent(validated);
        res.json({ success: true, content });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        console.error("Failed to update portfolio stats:", error);
        res
          .status(500)
          .json({ message: "Failed to update portfolio stats" });
      }
    },
  );

  // =================================================================
  // Admin Portfolio Items Routes
  // =================================================================

  // --- GET /api/admin/portfolio-items -----------------------------
  router.get(
    "/admin/portfolio-items",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const items = await storage.getAllPortfolioItems();
        res.json(items);
      } catch (error) {
        console.error("Failed to fetch portfolio items:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch portfolio items" });
      }
    },
  );

  // --- POST /api/admin/portfolio-items ----------------------------
  router.post(
    "/admin/portfolio-items",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const validated = insertPortfolioItemSchema.parse(req.body);
        const item = await storage.createPortfolioItem(validated);
        res.json(item);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        console.error("Failed to create portfolio item:", error);
        res
          .status(500)
          .json({ message: "Failed to create portfolio item" });
      }
    },
  );

  // --- PUT /api/admin/portfolio-items/:id -------------------------
  router.put(
    "/admin/portfolio-items/:id",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const validated = insertPortfolioItemSchema
          .partial()
          .parse(req.body);
        const item = await storage.updatePortfolioItem(id, validated);
        res.json(item);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        }
        console.error("Failed to update portfolio item:", error);
        res
          .status(500)
          .json({ message: "Failed to update portfolio item" });
      }
    },
  );

  // --- DELETE /api/admin/portfolio-items/:id ----------------------
  router.delete(
    "/admin/portfolio-items/:id",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deletePortfolioItem(id);
        res.json({ success: true });
      } catch (error) {
        console.error("Failed to delete portfolio item:", error);
        res
          .status(500)
          .json({ message: "Failed to delete portfolio item" });
      }
    },
  );

  return router;
}

export default router ;