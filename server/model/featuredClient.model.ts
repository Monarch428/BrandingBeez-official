import mongoose, { Schema, type Model } from "mongoose";
import type { FeaturedClient } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface FeaturedClientDocument extends mongoose.Document, FeaturedClient {}

const featuredClientSchema = new Schema<FeaturedClientDocument>(
  {
    id: numericIdField,
    servicePage: { type: String, required: true },
    name: { type: String, required: true },
    logo: String,
    website: String,
    description: { type: String, required: true },
    achievements: { type: [String], default: [] },
    industry: { type: String, required: true },
    timeframe: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "featured_clients",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const FeaturedClientModel =
  (models.FeaturedClient as Model<FeaturedClientDocument>) ||
  model<FeaturedClientDocument>("FeaturedClient", featuredClientSchema);
