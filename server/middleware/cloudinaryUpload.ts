// middleware/cloudinaryUpload.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "brandingbeez/uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // You can add transformation defaults here if you like
    // transformation: [{ quality: "auto", fetch_format: "auto" }],
  }),
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
