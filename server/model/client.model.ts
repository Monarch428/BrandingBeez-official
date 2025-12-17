import mongoose, { Schema, type Model } from "mongoose";
import type { Client } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface ClientDocument extends mongoose.Document, Client {}

const clientSchema = new Schema<ClientDocument>(
  {
    id: numericIdField,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    company: String,
    phone: String,
    website: String,
    status: { type: String, default: "pending" },
    region: { type: String, default: "US" },
  },
  {
    collection: "clients",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const ClientModel =
  (models.Client as Model<ClientDocument>) ||
  model<ClientDocument>("Client", clientSchema);
