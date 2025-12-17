import mongoose, { Schema, type Model } from "mongoose";
import type { PortfolioItem } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface PortfolioItemDocument extends mongoose.Document, PortfolioItem {}

const statSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const portfolioItemSchema = new Schema<PortfolioItemDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subTitle: String,
    industry: { type: String, required: true },
    client: String,
    badge: String,
    investment: String,
    totalValue: String,
    roi: String,
    description: String,
    features: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    timeline: String,
    imageUrl: String,
    image: String,
    isFeatured: { type: Boolean, default: false },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    projectUrl: String,
    projectUrlLabel: String,
    serviceCategory: String,

    seoDetails: {
      seoOverview: String,
      clientChallenge: String,
      primarySeoGoal: String,
      seoSummaryImage: String,

      seoFocusAreas: { type: [String], default: [] },
      seoStrategySummary: String,
      seoToolsUsed: { type: [String], default: [] },
      seoDeliverables: { type: [String], default: [] },

      stats: [statSchema],
    },

    googleAdsDetails: {
      googleAdsSummaryImage: String,
      industry: String,
      timeline: String,
      campaignOverview: String,

      googleAdsClientChallenge: String,
      primaryCampaignGoal: String,
      campaignType: String,

      platforms: { type: [String], default: [] },
      monthlyAdSpend: String,

      googleAdsStrategySummary: String,

      targetLocations: { type: [String], default: [] },
      trackingAndAnalytics: { type: [String], default: [] },

      stats: [statSchema],
    },
  },
  {
    collection: "portfolio_items",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const PortfolioItemModel =
  (models.PortfolioItem as Model<PortfolioItemDocument>) ||
  model<PortfolioItemDocument>("PortfolioItem", portfolioItemSchema);
