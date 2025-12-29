import express, { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { upload } from "../middleware/cloudinaryUpload";
import {
    insertWebCaseStudyCardSchema,
    insertWebCaseStudyDetailSchema,
    reorderWebCaseStudiesSchema,
} from "@shared/schema";
import { WebCaseStudyCardModel, WebCaseStudyDetailModel } from "server/models";
import mongoose from "mongoose";


export function webCaseStudyAdminRouter(authenticateAdmin: RequestHandler) {
    const router = express.Router();

    router.get("/web-case-studies", authenticateAdmin, async (_req, res) => {
        try {
            const items = await storage.listWebCaseStudyCards();
            res.json(items);
        } catch (error) {
            console.error("Failed to list Website case study cards:", error);
            res.status(500).json({ message: "Failed to list Website case studies" });
        }
    });

    router.get("/web-case-study/card/:slug", authenticateAdmin, async (req, res) => {
        try {
            const { slug } = req.params;
            const card = await storage.getWebCaseStudyCardBySlug(slug);
            if (!card) return res.status(404).json({ message: "Card not found" });
            res.json(card);
        } catch (error) {
            console.error("Failed to get Website case study card:", error);
            res.status(500).json({ message: "Failed to get Website case study card" });
        }
    });

    router.get("/web-case-study/detail/:cardId", authenticateAdmin, async (req, res) => {
        try {
            const { cardId } = req.params;
            const detail = await storage.getWebCaseStudyDetailByCardId(cardId);
            res.json(detail ?? null);
        } catch (error) {
            console.error("Failed to get Website case study detail:", error);
            res.status(500).json({ message: "Failed to get Website case study detail" });
        }
    });

    router.post(
        "/web-case-study/upload-card-image",
        authenticateAdmin,
        upload.single("image"),
        async (req: Request, res: Response) => {
            try {
                const file: any = (req as any).file;
                if (!file) return res.status(400).json({ message: "No image uploaded" });

                return res.json({
                    imageUrl: file.path || file.secure_url,
                    publicId: file.filename || file.public_id,
                    originalName: file.originalname,
                });
            } catch (err) {
                console.error("Web card image upload failed:", err);
                return res.status(500).json({ message: "Web card image upload failed" });
            }
        }
    );

    router.post("/web-case-study/card", authenticateAdmin, async (req, res) => {
        try {
            const validated = insertWebCaseStudyCardSchema.parse(req.body);
            const created = await storage.createWebCaseStudyCard(validated as any);
            res.json(created);
        } catch (error) {
            if (error instanceof z.ZodError)
                return res.status(400).json({ message: "Validation error", errors: error.errors });
            console.error("Failed to create Website case study card:", error);
            res.status(500).json({ message: "Failed to create Website case study card" });
        }
    });

    router.put("/web-case-study/card/:slug", authenticateAdmin, async (req, res) => {
        try {
            const { slug } = req.params;
            const validated = insertWebCaseStudyCardSchema.partial().parse(req.body);
            const updated = await storage.updateWebCaseStudyCardBySlug(slug, validated as any);
            res.json(updated);
        } catch (error) {
            if (error instanceof z.ZodError)
                return res.status(400).json({ message: "Validation error", errors: error.errors });
            console.error("Failed to update Website case study card:", error);
            res.status(500).json({ message: "Failed to update Website case study card" });
        }
    });

    router.post(
        "/web-case-study/upload-showcase-image",
        authenticateAdmin,
        (req, res, next) => {
            upload.single("image")(req as any, res as any, (err: any) => {
                if (err) return res.status(400).json({ message: err.message });
                next();
            });
        },
        async (req: Request, res: Response) => {
            try {
                const file: any = req.file;
                if (!file) return res.status(400).json({ message: "No image uploaded" });

                return res.json({
                    imageUrl: file.path,
                    publicId: file.filename,
                    originalName: file.originalname,
                });
            } catch (e) {
                console.error(e);
                res.status(500).json({ message: "Showcase image upload failed" });
            }
        }
    );

    router.put("/web-case-study/detail", authenticateAdmin, async (req, res) => {
        try {
            const { detailId } = req.query as { detailId?: string };
            if (!detailId) return res.status(400).json({ message: "detailId is required" });

            const updated = await WebCaseStudyDetailModel.findByIdAndUpdate(
                detailId,
                { $set: req.body },
                { new: true }
            ).lean();

            if (!updated) return res.status(404).json({ message: "Website case study detail not found" });
            return res.json(updated);
        } catch (error) {
            console.error("Failed to update Website case study detail by detailId:", error);
            return res.status(500).json({ message: "Failed to update Website case study detail" });
        }
    });

    router.post("/web-case-study/detail", authenticateAdmin, async (req, res) => {
        try {
            const validated = insertWebCaseStudyDetailSchema.parse(req.body);
            const upserted = await storage.upsertWebCaseStudyDetail(validated as any);
            res.json(upserted);
        } catch (error) {
            if (error instanceof z.ZodError)
                return res.status(400).json({ message: "Validation error", errors: error.errors });
            console.error("Failed to upsert Website case study detail:", error);
            res.status(500).json({ message: "Failed to save Website case study detail" });
        }
    });

    router.delete("/web-case-study/:slug", authenticateAdmin, async (req, res) => {
        try {
            const { slug } = req.params;
            await storage.deleteWebCaseStudyCardBySlug(slug);
            res.json({ success: true });
        } catch (error) {
            console.error("Failed to delete Website case study:", error);
            res.status(500).json({ message: "Failed to delete Website case study" });
        }
    });

    router.patch("/web-case-studies/reorder", authenticateAdmin, async (req, res) => {
        try {
            const validated = reorderWebCaseStudiesSchema.parse(req.body);

            const ops = validated.items.map((it) => ({
                updateOne: {
                    filter: { _id: new mongoose.Types.ObjectId(it.id) },
                    update: { $set: { order: it.order } },
                },
            }));

            await WebCaseStudyCardModel.bulkWrite(ops, { ordered: false });

            return res.json({ success: true });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: "Validation error", errors: error.errors });
            }
            console.error("Failed to reorder web case studies:", error);
            return res.status(500).json({ message: "Failed to reorder web case studies" });
        }
    });

    // Add this ABOVE the "/web-case-study/detail/:cardId" route (or anywhere, it won't conflict)
    router.get("/web-case-study/detail", authenticateAdmin, async (req, res) => {
        try {
            const { cardId } = req.query as { cardId?: string };
            if (!cardId) return res.status(400).json({ message: "cardId is required" });

            const detail = await storage.getWebCaseStudyDetailByCardId(cardId);
            return res.json(detail ?? null);
        } catch (error) {
            console.error("Failed to get Website case study detail:", error);
            return res.status(500).json({ message: "Failed to get Website case study detail" });
        }
    });

    return router;
}
