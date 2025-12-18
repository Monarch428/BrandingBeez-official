import express, { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { upload } from "../middleware/cloudinaryUpload";

import {
    insertPpcCaseStudyCardSchema,
    insertPpcCaseStudyDetailSchema,
} from "@shared/schema";
import { PpcCaseStudyDetailModel } from "server/models";

export function ppcCaseStudyAdminRouter(authenticateAdmin: RequestHandler) {
    const router = express.Router();

    router.get("/ppc-case-studies", authenticateAdmin, async (_req, res) => {
        try {
            const items = await storage.listPpcCaseStudyCards();
            res.json(items);
        } catch (error) {
            console.error("Failed to list PPC case study cards:", error);
            res.status(500).json({ message: "Failed to list PPC case studies" });
        }
    });

    router.get("/ppc-case-study/card/:slug", authenticateAdmin, async (req, res) => {
        try {
            const { slug } = req.params;
            const card = await storage.getPpcCaseStudyCardBySlug(slug);
            if (!card) return res.status(404).json({ message: "Card not found" });
            res.json(card);
        } catch (error) {
            console.error("Failed to get PPC case study card:", error);
            res.status(500).json({ message: "Failed to get PPC case study card" });
        }
    });

    router.get("/ppc-case-study/detail/:cardId", authenticateAdmin, async (req, res) => {
        try {
            const { cardId } = req.params;
            const detail = await storage.getPpcCaseStudyDetailByCardId(cardId);
            res.json(detail ?? null);
        } catch (error) {
            console.error("Failed to get PPC case study detail:", error);
            res.status(500).json({ message: "Failed to get PPC case study detail" });
        }
    });

    // optional: upload cover image (re-use existing Cloudinary middleware)
    router.post(
        "/ppc-case-study/upload-card-image",
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
                    return res.status(500).json({ message: "Upload completed but missing Cloudinary fields", debug: { imageUrl, publicId } });
                }

                return res.json({ imageUrl, publicId, originalName });
            } catch (error) {
                console.error("PPC case study card image upload failed:", error);
                return res.status(500).json({ message: "Failed to upload card image" });
            }
        }
    );

    router.post("/ppc-case-study/card", authenticateAdmin, async (req, res) => {
        try {
            const validated = insertPpcCaseStudyCardSchema.parse(req.body);
            const created = await storage.createPpcCaseStudyCard(validated as any);
            res.json(created);
        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
            console.error("Failed to create PPC case study card:", error);
            res.status(500).json({ message: "Failed to create PPC case study card" });
        }
    });

    router.put("/ppc-case-study/card/:slug", authenticateAdmin, async (req, res) => {
        try {
            const { slug } = req.params;
            const validated = insertPpcCaseStudyCardSchema.partial().parse(req.body);
            const updated = await storage.updatePpcCaseStudyCardBySlug(slug, validated as any);
            res.json(updated);
        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
            console.error("Failed to update PPC case study card:", error);
            res.status(500).json({ message: "Failed to update PPC case study card" });
        }
    });

    router.put(
        "/ppc-case-study/detail",
        authenticateAdmin,
        async (req, res) => {
            try {
                const { detailId } = req.query as { detailId?: string };

                if (!detailId) {
                    return res.status(400).json({ message: "detailId is required" });
                }

                const updated = await PpcCaseStudyDetailModel.findByIdAndUpdate(
                    detailId,
                    { $set: req.body },
                    { new: true }
                ).lean();

                if (!updated) return res.status(404).json({ message: "PPC case study detail not found" });

                return res.json(updated);
            } catch (error) {
                console.error("Failed to update PPC case study detail by detailId:", error);
                return res.status(500).json({ message: "Failed to update PPC case study detail" });
            }
        }
    );

    router.post("/ppc-case-study/detail", authenticateAdmin, async (req, res) => {
        try {
            const validated = insertPpcCaseStudyDetailSchema.parse(req.body);
            const upserted = await storage.upsertPpcCaseStudyDetail(validated as any);
            res.json(upserted);
        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
            console.error("Failed to upsert PPC case study detail:", error);
            res.status(500).json({ message: "Failed to save PPC case study detail" });
        }
    });

    router.delete("/ppc-case-study/:slug", authenticateAdmin, async (req, res) => {
        try {
            const { slug } = req.params;
            await storage.deletePpcCaseStudyCardBySlug(slug);
            res.json({ success: true });
        } catch (error) {
            console.error("Failed to delete PPC case study:", error);
            res.status(500).json({ message: "Failed to delete PPC case study" });
        }
    });

    return router;
}
