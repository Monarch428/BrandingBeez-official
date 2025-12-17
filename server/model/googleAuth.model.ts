import mongoose, { Schema, type Model } from "mongoose";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface GoogleAuthDocument extends mongoose.Document {
  id: number;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
  calendarId?: string;
  createdAt: Date;
}

const googleAuthSchema = new Schema<GoogleAuthDocument>(
  {
    id: numericIdField,
    email: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiryDate: { type: Number, required: true },
    calendarId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "google_auth_tokens", versionKey: false }
);

export const GoogleAuthModel =
  (models.GoogleAuth as Model<GoogleAuthDocument>) ||
  model<GoogleAuthDocument>("GoogleAuth", googleAuthSchema);
