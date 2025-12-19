import mongoose, { Schema, Model } from "mongoose";
import type { Document } from "mongoose";
import { numericIdField } from "../../../helpers/db-helpers";

export interface PpcCaseStudyResultItem {
  key: string;   // e.g. "cpa" | "conversionRate" | "clicks" | "roas" ...
  label: string; // e.g. "Lowest CPA"
  value: string; // e.g. "£6.5 Lowest CPA"
  colorClass?: string; // optional UI hint
}

export interface PpcCaseStudyCard {
  id: number;
  slug: string;

  title: string;
  client: string;
  industry: string;
  description: string;

  // ✅ flexible results (supports different shapes per study)
  results: PpcCaseStudyResultItem[];

  // Optional cover
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";

  createdAt: Date;
  updatedAt: Date;
}

export interface PpcCaseStudyCardDocument extends Document, PpcCaseStudyCard {}

const resultItemSchema = new Schema<PpcCaseStudyResultItem>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    colorClass: String,
  },
  { _id: false }
);

const ppcCaseStudyCardSchema = new Schema<PpcCaseStudyCardDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },

    title: { type: String, required: true },
    client: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },

    results: { type: [resultItemSchema], default: [] },

    coverImageUrl: String,
    coverImageAlt: String,
    coverFit: {
      type: String,
      enum: ["contain", "cover"],
      default: "contain",
    },
  },
  {
    collection: "ppc_case_study_cards",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const PpcCaseStudyCardModel: Model<PpcCaseStudyCardDocument> =
  (mongoose.models.PpcCaseStudyCard as Model<PpcCaseStudyCardDocument>) ||
  mongoose.model<PpcCaseStudyCardDocument>("PpcCaseStudyCard", ppcCaseStudyCardSchema);
