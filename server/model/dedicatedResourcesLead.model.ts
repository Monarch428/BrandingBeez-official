import mongoose, { Schema, type Model } from "mongoose";
import type { DedicatedResourcesLead } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface DedicatedResourcesLeadDocument
  extends mongoose.Document,
    DedicatedResourcesLead {}

const dedicatedResourcesLeadSchema = new Schema<DedicatedResourcesLeadDocument>(
  {
    id: numericIdField,
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    resourceType: { type: String, required: true },
    hiringLevel: String,
    multipleResources: Schema.Types.Mixed,
    additionalNotes: String,
  },
  {
    collection: "dedicated_resources_leads",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const DedicatedResourcesLeadModel =
  (models.DedicatedResourcesLead as Model<DedicatedResourcesLeadDocument>) ||
  model<DedicatedResourcesLeadDocument>("DedicatedResourcesLead", dedicatedResourcesLeadSchema);
