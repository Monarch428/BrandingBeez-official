// middleware/cloudinaryUpload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "svg",
];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const isSvg = file.mimetype === "image/svg+xml";

    return {
      folder: "brandingbeez/uploads",

      allowed_formats: ALLOWED_EXTENSIONS,

      resource_type: "image",

      ...(isSvg
        ? {}
        : {
            transformation: [
              {
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          }),
    };
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Only SVG, PNG, JPG, JPEG, WebP, and AVIF images are allowed."
      )
    );
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});
