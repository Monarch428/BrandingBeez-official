import mongoose, { Schema, type Model } from "mongoose";
import type { Contact } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface ContactDocument extends mongoose.Document, Contact {}

const contactSchema = new Schema<ContactDocument>(
  {
    id: numericIdField,
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    inquiry_type: { type: String, required: true },
    message: { type: String, required: true },
    preferred_contact: { type: String, required: true },
    agencyName: String,
    country: { type: String, required: true },
    topPriority: { type: String, required: true },
    couponCode: String,
    servicesSelected: { type: [String], default: [] },
    budget: String,
    timeline: String,
    referralSource: String,
    serviceDetails: Schema.Types.Mixed,
    automationDetails: Schema.Types.Mixed,
    dedicatedResourceDetails: Schema.Types.Mixed,
    websiteDetails: Schema.Types.Mixed,
    contactFormType: { type: String, default: "contact-form" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "contacts", versionKey: false }
);

export const ContactModel =
  (models.Contact as Model<ContactDocument>) ||
  model<ContactDocument>("Contact", contactSchema);
