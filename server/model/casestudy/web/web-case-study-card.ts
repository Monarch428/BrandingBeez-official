import mongoose, { Schema, Model } from "mongoose";
import type { Document } from "mongoose";
import { numericIdField } from "../../../helpers/db-helpers";

export interface WebCaseStudyCardResults {
  performance: string;
  conversions: string;
  users: string | null;
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
  order: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WebCaseStudyCardDocument extends Document, WebCaseStudyCard { }

const resultsSchema = new Schema<WebCaseStudyCardResults>(
  {
    performance: { type: String, required: true },
    conversions: { type: String, required: true },
    users: { type: String, required: true },
  },
  { _id: false }
);

const webCaseStudyCardSchema = new Schema<WebCaseStudyCardDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },

    title: { type: String, required: true },
    client: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },

    results: { type: resultsSchema, required: true },

    imageUrl: String,
    imageAlt: String,
    imageFit: { type: String, enum: ["cover", "contain"], default: "cover" },

    link: String,

    order: { type: Number, required: true, default: 0 },
  },
  {
    collection: "web_case_study_cards",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const WebCaseStudyCardModel: Model<WebCaseStudyCardDocument> =
  (mongoose.models.WebCaseStudyCard as Model<WebCaseStudyCardDocument>) ||
  mongoose.model<WebCaseStudyCardDocument>("WebCaseStudyCard", webCaseStudyCardSchema);
