import mongoose, { Schema, type Model } from "mongoose";

export interface AiReportGeneratedDocument extends mongoose.Document {
  token: string;
  analysis: Record<string, unknown>;
  website?: string;
  companyName?: string;
  industry?: string;
  email?: string;
  name?: string;
  reportDownloadToken?: string;
  createdAt: Date;
  reportGeneratedAt?: Date;
}

const aiReportGeneratedSchema = new Schema<AiReportGeneratedDocument>(
  {
    token: { type: String, required: true, unique: true, index: true },
    analysis: { type: Schema.Types.Mixed, required: true },
    website: String,
    companyName: String,
    industry: String,
    email: String,
    name: String,
    reportDownloadToken: String,
    reportGeneratedAt: Date,
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 12 },
  },
  { collection: "AI report generated", versionKey: false }
);

export const AiReportGeneratedModel =
  (mongoose.models.AiReportGenerated as Model<AiReportGeneratedDocument>) ||
  mongoose.model<AiReportGeneratedDocument>("AiReportGenerated", aiReportGeneratedSchema);
