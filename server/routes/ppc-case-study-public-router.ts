import express, { Request, Response, RequestHandler } from "express";
import { storage } from "../storage";

export function ppcCaseStudyPublicRouter(publicContentRateLimit: RequestHandler) {
  const router = express.Router();

  // list page
  router.get("/ppc-case-studies", publicContentRateLimit, async (_req: Request, res: Response) => {
    try {
      const items = await storage.listPpcCaseStudyCards();
      res.json(items);
    } catch (error) {
      console.error("Error fetching PPC case studies list:", error);
      res.status(500).json({ message: "Failed to fetch PPC case studies list" });
    }
  });

  // detail page (card + detail)
  router.get("/ppc-case-study/:slug", publicContentRateLimit, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const combined = await storage.getPpcCaseStudyCombinedBySlug(slug);

      if (!combined) return res.status(404).json({ message: "PPC case study not found" });

      res.json(combined);
    } catch (error) {
      console.error("Error fetching PPC case study:", error);
      res.status(500).json({ message: "Failed to fetch PPC case study" });
    }
  });

  return router;
}
