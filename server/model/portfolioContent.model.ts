import mongoose, { Schema, type Model } from "mongoose";
import type { PortfolioContent } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface PortfolioContentDocument extends mongoose.Document, PortfolioContent {}

const heroStatSchema = new Schema(
  {
    kpi: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const testimonialSchema = new Schema(
  {
    quote: { type: String, required: true },
    who: { type: String, required: true },
    tag: String,
  },
  { _id: false }
);

const portfolioContentSchema = new Schema<PortfolioContentDocument>(
  {
    id: numericIdField,
    heroTitle: { type: String, required: true },
    heroHighlight: String,
    heroSubtitle: String,
    heroDescription: String,
    heroStats: { type: [heroStatSchema], default: [] },
    heroPrimaryCtaText: String,
    heroPrimaryCtaHref: String,
    heroSecondaryCtaText: String,
    heroSecondaryCtaHref: String,
    testimonialsTitle: String,
    testimonialsSubtitle: String,
    testimonials: { type: [testimonialSchema], default: [] },
  },
  {
    collection: "portfolio_content",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const PortfolioContentModel =
  (models.PortfolioContent as Model<PortfolioContentDocument>) ||
  model<PortfolioContentDocument>("PortfolioContent", portfolioContentSchema);
