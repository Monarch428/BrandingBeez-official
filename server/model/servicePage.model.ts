import mongoose, { Schema, type Model } from "mongoose";
import type { ServicePage } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface ServicePageDocument extends mongoose.Document, ServicePage {}

const servicePageSchema = new Schema<ServicePageDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    heroTitle: String,
    heroSubtitle: String,
    auditFormType: String,
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "service_pages",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const ServicePageModel =
  (models.ServicePage as Model<ServicePageDocument>) ||
  model<ServicePageDocument>("ServicePage", servicePageSchema);
