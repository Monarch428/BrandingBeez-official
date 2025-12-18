import mongoose, { Schema, Model } from "mongoose";
import type { Document } from "mongoose";
import { numericIdField } from "../../../helpers/db-helpers";

export interface DedicatedResourceCaseStudyResultItem {
  key: string;    
  label: string;    
  value: string;      
  valueClass?: string; 
}

export interface DedicatedResourceCaseStudyCard {
  id: number;
  slug: string;

  // Card top content
  title: string;       
  description: string;
  industry: string;   
  client: string;   

  // Badge at top e.g. "+30 Months Onwards" / "Newly Onboarded"
  badgeText?: string;
  badgeClass?: string; 

  // Logo area
  logoUrl?: string;
  logoAlt?: string;

  // Category badge e.g. "Digital Marketing" / "Web Development" / "Google Ads"
  categoryLabel?: string;
  categoryClass?: string; 

  // KPI rows (your card shows 3)
  results: DedicatedResourceCaseStudyResultItem[];

  // Optional cover (if you ever want a background image)
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";

  createdAt: Date;
  updatedAt: Date;
}

export interface DedicatedResourceCaseStudyCardDocument
  extends Document,
    DedicatedResourceCaseStudyCard {}

const resultItemSchema = new Schema<DedicatedResourceCaseStudyResultItem>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    valueClass: String,
  },
  { _id: false }
);

const dedicatedResourceCaseStudyCardSchema = new Schema<DedicatedResourceCaseStudyCardDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },

    title: { type: String, required: true },
    description: { type: String, required: true },

    // kept for consistency with PPC/admin list filters
    client: { type: String, required: true },
    industry: { type: String, required: true },

    badgeText: String,
    badgeClass: String,

    logoUrl: String,
    logoAlt: String,

    categoryLabel: String,
    categoryClass: String,

    results: { type: [resultItemSchema], default: [] },

    coverImageUrl: String,
    coverImageAlt: String,
    coverFit: { type: String, enum: ["contain", "cover"], default: "contain" },
  },
  {
    collection: "dedicated_resource_case_study_cards",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const DedicatedResourceCaseStudyCardModel: Model<DedicatedResourceCaseStudyCardDocument> =
  (mongoose.models.DedicatedResourceCaseStudyCard as Model<DedicatedResourceCaseStudyCardDocument>) ||
  mongoose.model<DedicatedResourceCaseStudyCardDocument>(
    "DedicatedResourceCaseStudyCard",
    dedicatedResourceCaseStudyCardSchema
  );
