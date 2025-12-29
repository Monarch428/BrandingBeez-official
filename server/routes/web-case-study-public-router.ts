import express, { Request, Response, RequestHandler } from "express";
import { storage } from "../storage";

export function webCaseStudyPublicRouter(publicContentRateLimit: RequestHandler) {
  const router = express.Router();

  // List cards
  router.get(
    "/web-case-studies",
    publicContentRateLimit,
    async (_req: Request, res: Response) => {
      try {
        const items = await storage.listWebCaseStudyCards();
        res.json(items);
      } catch (error) {
        console.error("Error fetching Website case studies list:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch Website case studies list" });
      }
    }
  );

  // Combined by slug (card + detail)
  router.get(
    "/web-case-study/:slug",
    publicContentRateLimit,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        const combined = await storage.getWebCaseStudyCombinedBySlug(slug);

        if (!combined)
          return res.status(404).json({ message: "Website case study not found" });

        res.json(combined);
      } catch (error) {
        console.error("Error fetching Website case study:", error);
        res.status(500).json({ message: "Failed to fetch Website case study" });
      }
    }
  );

  return router;
}
