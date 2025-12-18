import express, { Request, Response, RequestHandler } from "express";
import { storage } from "../storage";

export function dedicatedResourceCaseStudyPublicRouter(publicContentRateLimit: RequestHandler) {
    const router = express.Router();

    // list page
    router.get(
        "/dedicated-resource-case-studies",
        publicContentRateLimit,
        async (_req: Request, res: Response) => {
            try {
                const items = await storage.listDedicatedResourceCaseStudyCards();
                res.json(items);
            }
            catch (error) {
                console.error("Error fetching Dedicated Resources case studies list:", error);
                res.status(500).json({ message: "Failed to fetch Dedicated Resources case studies list" });
            }
        }
    );

    // detail page (card + detail)
    router.get(
        "/dedicated-resource-case-study/:slug",
        publicContentRateLimit,
        async (req: Request, res: Response) => {
            try {
                const { slug } = req.params;
                const combined = await storage.getDedicatedResourceCaseStudyCombinedBySlug(slug);

                if (!combined) return res.status(404).json({ message: "Dedicated Resources case study not found" });

                res.json(combined);
            }
            catch (error) {
                console.error("Error fetching Dedicated Resources case study:", error);
                res.status(500).json({ message: "Failed to fetch Dedicated Resources case study" });
            }
        }
    );

    return router;
}
