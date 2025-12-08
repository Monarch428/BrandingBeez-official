// routes/upload.ts
import express, { Request, Response } from "express";
import { upload } from "../middleware/cloudinaryUpload";

const router = express.Router();

// POST /api/upload/image   (if mounted with app.use("/api/upload", router))
router.post(
  "/image",
  upload.single("file"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      // CloudinaryStorage puts the URL in file.path
      // and the public ID in file.filename
      const file = req.file as Express.Multer.File & {
        path?: string;
        filename?: string;
      };

      return res.json({
        success: true,
        url: file.path,        // Cloudinary URL
        publicId: file.filename, // Cloudinary public ID
      });
    } catch (error) {
      console.error("Error in /image upload route:", error);
      return res.status(500).json({ success: false, message: "Upload failed" });
    }
  },
);

export default router;
