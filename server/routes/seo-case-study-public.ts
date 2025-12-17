import express, { Request, Response, RequestHandler } from "express";
import { storage } from "../storage";

export function seoCaseStudyPublicRouter(publicContentRateLimit: RequestHandler) {
  const router = express.Router();

  router.get(
    "/seo-case-studies",
    publicContentRateLimit,
    async (_req: Request, res: Response) => {
      try {
        const items = await storage.listSeoCaseStudyCards();
        res.json(items);
      } catch (error) {
        console.error("Error fetching SEO case studies list:", error);
        res.status(500).json({ message: "Failed to fetch SEO case studies list" });
      }
    }
  );

  router.get(
    "/seo-case-study/:slug",
    publicContentRateLimit,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        const combined = await storage.getSeoCaseStudyCombinedBySlug(slug);

        if (!combined) {
          return res.status(404).json({ message: "SEO case study not found" });
        }

        res.json(combined);
      } catch (error) {
        console.error("Error fetching SEO case study:", error);
        res.status(500).json({ message: "Failed to fetch SEO case study" });
      }
    }
  );

  return router;
}
