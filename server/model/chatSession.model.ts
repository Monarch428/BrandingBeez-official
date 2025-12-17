import mongoose, { Schema, type Model } from "mongoose";
import type { ChatSession } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface ChatSessionDocument extends mongoose.Document, ChatSession {}

const chatSessionSchema = new Schema<ChatSessionDocument>(
  {
    id: numericIdField,
    sessionId: { type: String, required: true, unique: true },
    messages: { type: [Schema.Types.Mixed], default: [] },
    clientInfo: Schema.Types.Mixed,
    recommendations: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    collection: "chat_sessions",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const ChatSessionModel =
  (models.ChatSession as Model<ChatSessionDocument>) ||
  model<ChatSessionDocument>("ChatSession", chatSessionSchema);
