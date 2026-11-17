import mongoose, { Schema, type Model } from "mongoose";

/**
 * A customer-authorised Search Console connection. Tokens are encrypted before
 * they reach this collection; the browser only ever receives the connection id
 * and properties it is allowed to select.
 */
export interface SearchConsoleConnectionDocument extends mongoose.Document {
  ownerId: string;
  email?: string;
  accessTokenCiphertext: string;
  refreshTokenCiphertext: string;
  expiryDate: number;
  properties: Array<{ siteUrl: string; permissionLevel?: string }>;
  selectedProperty?: string;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema(
  {
    siteUrl: { type: String, required: true },
    permissionLevel: { type: String, required: false },
  },
  { _id: false },
);

const searchConsoleConnectionSchema = new Schema<SearchConsoleConnectionDocument>(
  {
    ownerId: { type: String, required: true, index: true },
    email: { type: String, required: false },
    accessTokenCiphertext: { type: String, required: true },
    refreshTokenCiphertext: { type: String, required: true },
    expiryDate: { type: Number, required: true },
    properties: { type: [propertySchema], default: [] },
    selectedProperty: { type: String, required: false },
  },
  { collection: "search_console_connections", timestamps: true, versionKey: false },
);

searchConsoleConnectionSchema.index({ ownerId: 1, updatedAt: -1 });

export const SearchConsoleConnectionModel =
  (mongoose.models.SearchConsoleConnection as Model<SearchConsoleConnectionDocument>) ||
  mongoose.model<SearchConsoleConnectionDocument>("SearchConsoleConnection", searchConsoleConnectionSchema);
