import mongoose, { Schema, Model } from "mongoose";
import type { Document } from "mongoose";
import { numericIdField } from "../../../helpers/db-helpers";

// ------------------- Types -------------------
export interface SeoCaseStudyCard {
  id: number;
  slug: string;

  cardTitle: string;
  cardClient: string;
  cardIndustry: string;
  cardDescription: string;

  cardResultsTraffic: string;
  cardResultsKeywords: string;
  cardResultsRevenue: string;

  cardCoverImageUrl?: string;
  cardCoverImageAlt?: string;
  cardCoverFit?: "contain" | "cover";

  createdAt: Date;
  updatedAt: Date;
}

export interface SeoCaseStudyCardDocument extends Document, SeoCaseStudyCard {}

// ------------------- Schema -------------------
const seoCaseStudyCardSchema = new Schema<SeoCaseStudyCardDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },

    cardTitle: { type: String, required: true },
    cardClient: { type: String, required: true },
    cardIndustry: { type: String, required: true },
    cardDescription: { type: String, required: true },

    cardResultsTraffic: { type: String, required: true },
    cardResultsKeywords: { type: String, required: true },
    cardResultsRevenue: { type: String, required: true },

    cardCoverImageUrl: String,
    cardCoverImageAlt: String,
    cardCoverFit: {
      type: String,
      enum: ["contain", "cover"],
      default: "contain",
    },
  },
  {
    collection: "seo_case_study_cards",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const SeoCaseStudyCardModel: Model<SeoCaseStudyCardDocument> =
  (mongoose.models.SeoCaseStudyCard as Model<SeoCaseStudyCardDocument>) ||
  mongoose.model<SeoCaseStudyCardDocument>("SeoCaseStudyCard", seoCaseStudyCardSchema);
