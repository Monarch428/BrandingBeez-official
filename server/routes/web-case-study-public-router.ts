// import express, { Request, Response, RequestHandler } from "express";
// import { storage } from "../storage";

// export function webCaseStudyPublicRouter(publicContentRateLimit: RequestHandler) {
//   const router = express.Router();

//   // List cards
//   router.get(
//     "/web-case-studies",
//     publicContentRateLimit,
//     async (_req: Request, res: Response) => {
//       try {
//         const items = await storage.listWebCaseStudyCards();
//         res.json(items);
//       } catch (error) {
//         console.error("Error fetching Website case studies list:", error);
//         res
//           .status(500)
//           .json({ message: "Failed to fetch Website case studies list" });
//       }
//     }
//   );

//   // Combined by slug (card + detail)
//   router.get(
//     "/web-case-study/:slug",
//     publicContentRateLimit,
//     async (req: Request, res: Response) => {
//       try {
//         const { slug } = req.params;
//         const combined = await storage.getWebCaseStudyCombinedBySlug(slug);

//         if (!combined)
//           return res.status(404).json({ message: "Website case study not found" });

//         res.json(combined);
//       } catch (error) {
//         console.error("Error fetching Website case study:", error);
//         res.status(500).json({ message: "Failed to fetch Website case study" });
//       }
//     }
//   );

//   return router;
// }


import express, { Request, Response, RequestHandler } from "express";
import { storage } from "../storage";

type CacheEntry<T> = {
  data: T;
  time: number;
};

// ============================
// 🔥 CACHE CONFIG (MODULE SCOPE)
// ============================
const LIST_TTL = 5 * 60 * 1000;   // 5 minutes
const DETAIL_TTL = 5 * 60 * 1000; // 5 minutes

let listCache: CacheEntry<any[]> | null = null;
const detailCache = new Map<string, CacheEntry<any>>();

// ============================
// 🔥 WRITE-THROUGH REFRESH
// ============================
export async function refreshWebCaseStudyCache() {
  const items = await storage.listWebCaseStudyCards();

  listCache = {
    data: items,
    time: Date.now(),
  };

  // Details depend on cards → clear and lazy-reload
  detailCache.clear();
}

// ============================
// 🌐 PUBLIC ROUTER
// ============================
export function webCaseStudyPublicRouter(
  publicContentRateLimit: RequestHandler
) {
  const router = express.Router();

  // ============================
  // 📌 LIST CARDS (PUBLIC)
  // ============================
  router.get(
    "/web-case-studies",
    publicContentRateLimit,
    async (_req: Request, res: Response) => {
      try {
        const now = Date.now();

        // 🔥 Serve from cache
        if (listCache && now - listCache.time < LIST_TTL) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=300, stale-while-revalidate=60"
          );
          return res.json(listCache.data);
        }

        // 🐢 Fetch from DB
        const items = await storage.listWebCaseStudyCards();

        // 🔥 Update cache
        listCache = {
          data: items,
          time: now,
        };

        res.setHeader(
          "Cache-Control",
          "public, max-age=300, stale-while-revalidate=60"
        );

        res.json(items);
      } catch (error) {
        console.error("Error fetching Website case studies list:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch Website case studies list" });
      }
    }
  );

  // ============================
  // 📌 DETAIL BY SLUG (PUBLIC)
  // ============================
  router.get(
    "/web-case-study/:slug",
    publicContentRateLimit,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        const now = Date.now();

        const cached = detailCache.get(slug);

        // 🔥 Serve from cache
        if (cached && now - cached.time < DETAIL_TTL) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=300, stale-while-revalidate=60"
          );
          return res.json(cached.data);
        }

        // 🐢 Fetch from DB
        const combined = await storage.getWebCaseStudyCombinedBySlug(slug);

        if (!combined) {
          return res
            .status(404)
            .json({ message: "Website case study not found" });
        }

        // 🔥 Update detail cache
        detailCache.set(slug, {
          data: combined,
          time: now,
        });

        res.setHeader(
          "Cache-Control",
          "public, max-age=300, stale-while-revalidate=60"
        );

        res.json(combined);
      } catch (error) {
        console.error("Error fetching Website case study:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch Website case study" });
      }
    }
  );

  return router;
}

