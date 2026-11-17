import mongoose, { Schema, type Model } from "mongoose";
import type { SeoSetupLead } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface SeoSetupLeadDocument
  extends mongoose.Document,
    SeoSetupLead {}

const seoSetupLeadSchema = new Schema<SeoSetupLeadDocument>(
  {
    id: numericIdField,
    fullName: { type: String, required: true, trim: true },
    websiteUrl: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    inquiry_type: {
      type: String,
      enum: ["seosetup", "medicalsetup"],
      required: true,
      default: "seosetup",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "seo_setup_leads",
    versionKey: false,
  }
);

export const SeoSetupLeadModel =
  (models.SeoSetupLead as Model<SeoSetupLeadDocument>) ||
  model<SeoSetupLeadDocument>("SeoSetupLead", seoSetupLeadSchema);