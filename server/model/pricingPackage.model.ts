import mongoose, { Schema, type Model } from "mongoose";
import type { PricingPackage } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface PricingPackageDocument extends mongoose.Document, PricingPackage {}

const pricingPackageSchema = new Schema<PricingPackageDocument>(
  {
    id: numericIdField,
    servicePage: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: String,
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "pricing_packages",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const PricingPackageModel =
  (models.PricingPackage as Model<PricingPackageDocument>) ||
  model<PricingPackageDocument>("PricingPackage", pricingPackageSchema);
