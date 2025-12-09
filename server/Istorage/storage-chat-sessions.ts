// src/server/storage-chat-sessions.ts
import type { ChatSession, InsertChatSession } from "@shared/schema";

export interface ChatStorage {
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSession(
    sessionId: string,
    messages: any[],
    recommendations?: any[],
  ): Promise<ChatSession>;
}
