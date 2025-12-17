import mongoose, { Schema, type Model } from "mongoose";
import type { SeoAudit } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface SeoAuditDocument extends mongoose.Document, SeoAudit {}

const seoAuditSchema = new Schema<SeoAuditDocument>(
  {
    id: numericIdField,
    clientId: { type: Number, required: true },
    websiteUrl: { type: String, required: true },
    auditData: Schema.Types.Mixed,
    score: Number,
    status: { type: String, default: "pending" },
    recommendations: String,
    createdAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { collection: "seo_audits", versionKey: false }
);

export const SeoAuditModel =
  (models.SeoAudit as Model<SeoAuditDocument>) ||
  model<SeoAuditDocument>("SeoAudit", seoAuditSchema);
