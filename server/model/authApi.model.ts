import mongoose, { Schema, type Model } from "mongoose";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface GoogleApiAuthDocument extends mongoose.Document {
  id: number;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
  createdAt: Date;
}

const googleAuthApiSchema = new Schema<GoogleApiAuthDocument>(
  {
    id: numericIdField,
    email: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiryDate: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "auth_api_tokens", versionKey: false },
);

export const GoogleApiAuthModel =
  (models.GoogleApiAuth as Model<GoogleApiAuthDocument>) ||
  model<GoogleApiAuthDocument>("GoogleApiAuth", googleAuthApiSchema);