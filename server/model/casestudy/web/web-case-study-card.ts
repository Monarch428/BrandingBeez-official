import mongoose, { Schema, type Model } from "mongoose";
import type { Document } from "mongoose";
import { numericIdField } from "../../../helpers/db-helpers";

// ✅ Keep results aligned with Zod + UI (users is optional)
export interface WebCaseStudyCardResults {
  performance: string;
  conversions: string;
  users?: string; // optional (matches insertWebCaseStudyCardSchema + UI)
}

export interface WebCaseStudyCard {
  id: number;
  slug: string;

  title: string;
  client: string;
  industry: string;

  description: string;

  results: WebCaseStudyCardResults;

  // ✅ image shown on card
  imageUrl?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";

  link?: string;

  // ✅ ordering for drag/reorder
  order: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface WebCaseStudyCardDocument extends Document, WebCaseStudyCard {}

const resultsSchema = new Schema<WebCaseStudyCardResults>(
  {
    performance: { type: String, required: true, trim: true },
    conversions: { type: String, required: true, trim: true },
    users: { type: String, required: false, trim: true }, // optional
  },
  { _id: false }
);

const webCaseStudyCardSchema = new Schema<WebCaseStudyCardDocument>(
  {
    id: numericIdField,

    slug: { type: String, required: true, unique: true, trim: true, index: true },

    title: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    results: { type: resultsSchema, required: true },

    imageUrl: { type: String, required: false, trim: true },
    imageAlt: { type: String, required: false, trim: true },
    imageFit: { type: String, enum: ["cover", "contain"], default: "cover" },

    link: { type: String, required: false, trim: true },

    // ✅ default 0, always numeric
    order: { type: Number, default: 0, min: 0, index: true },
  },
  {
    collection: "web_case_study_cards",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Helpful compound index for consistent sorting (order first)
webCaseStudyCardSchema.index({ order: 1, createdAt: -1 });

export const WebCaseStudyCardModel: Model<WebCaseStudyCardDocument> =
  (mongoose.models.WebCaseStudyCard as Model<WebCaseStudyCardDocument>) ||
  mongoose.model<WebCaseStudyCardDocument>("WebCaseStudyCard", webCaseStudyCardSchema);
