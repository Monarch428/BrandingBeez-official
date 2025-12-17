import mongoose, { Schema, type Model } from "mongoose";
import type { CaseStudy } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface CaseStudyDocument extends mongoose.Document, CaseStudy {}

const caseStudySchema = new Schema<CaseStudyDocument>(
  {
    id: numericIdField,
    servicePage: { type: String, required: true },
    title: { type: String, required: true },
    client: { type: String, required: true },
    industry: { type: String, required: true },
    results: Schema.Types.Mixed,
    description: String,
    imageUrl: String,
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "case_studies",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const CaseStudyModel =
  (models.CaseStudy as Model<CaseStudyDocument>) ||
  model<CaseStudyDocument>("CaseStudy", caseStudySchema);
