// src/server/db-chat-sessions.ts
import type { IStorage } from "../storage";
import type { ChatSession, InsertChatSession } from "@shared/schema";
import { ChatSessionModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const chatStorage = {
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    await ensureConnection();
    const id = await getNextSequence("chat_sessions");
    const created = await ChatSessionModel.create({ id, ...session });
    return toPlain<ChatSession>(created);
  },

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    await ensureConnection();
    const session = await ChatSessionModel.findOne({ sessionId }).lean<ChatSession>();
    return session ?? undefined;
  },

  async updateChatSession(
    sessionId: string,
    messages: any[],
    recommendations?: any[],
  ): Promise<ChatSession> {
    await ensureConnection();
    const updateData: Record<string, unknown> = {
      messages,
      updatedAt: new Date(),
    };
    if (recommendations) {
      updateData.recommendations = recommendations;
    }

    const updated = await ChatSessionModel.findOneAndUpdate(
      { sessionId },
      updateData,
      { new: true },
    ).lean<ChatSession>();

    if (!updated) {
      throw new Error("Chat session not found");
    }
    return updated;
  },
} satisfies Pick<
  IStorage,
  "createChatSession" | "getChatSession" | "updateChatSession"
>;
