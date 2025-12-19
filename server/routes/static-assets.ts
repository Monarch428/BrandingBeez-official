// server/routes/static-assets.ts
import type { Express, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

export function registerStaticRoutes(app: Express) {
  // Placeholder
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const w = parseInt(width);
    const h = parseInt(height);

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
      <rect width='${w}' height='${h}' fill='#8b5cf6'/>
      <text x='${w / 2}' y='${h / 2}' fill='white' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle'>Placeholder</text>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  });

  // Serve static files from client/public
  app.use("/images", (req: Request, res: Response) => {
    const imagePath = path.join(process.cwd(), "client/public/images", req.path);
    if (fs.existsSync(imagePath)) return res.sendFile(imagePath);
    return res.redirect(`/api/placeholder/400/300`);
  });

  app.use("/upload_image", (req: Request, res: Response) => {
    const uploadPath = path.join(process.cwd(), "client/public/upload_image", req.path);
    if (fs.existsSync(uploadPath)) return res.sendFile(uploadPath);
    return res.redirect(`/api/placeholder/400/300`);
  });
}
