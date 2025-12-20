// server/routes/uploads.ts
import type { Express, RequestHandler } from "express";
import { upload as cloudinaryUpload } from "../middleware/cloudinaryUpload";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

export function registerUploadRoutes(app: Express, authenticateAdmin: RequestHandler) {
  app.post("/api/upload/image", authenticateAdmin, (req, res) => {
    cloudinaryUpload.single("image")(req as any, res as any, (err: any) => {
      if (err) return res.status(400).json({ error: err.message || "Upload failed" });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const file = req.file as Express.Multer.File & { path?: string; filename?: string };

      res.json({
        success: true,
        imageUrl: file.path,
        filename: file.filename,
      });
    });
  });

  app.post("/api/upload/portfolio-image", authenticateAdmin, (req, res) => {
    cloudinaryUpload.single("image")(req as any, res as any, (err: any) => {
      if (err) return res.status(400).json({ error: err.message || "Upload failed" });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const file = req.file as Express.Multer.File & { path?: string; filename?: string };

      res.json({
        success: true,
        imageUrl: file.path,
        filename: file.filename,
      });
    });
  });

  // Mock object upload URL
  app.post("/api/objects/upload", async (_req, res) => {
    const uploadURL = `https://storage.googleapis.com/bucket/uploads/${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    res.json({ uploadURL });
  });
}
