// shared/schema/chat-sessions.ts
import { z } from "zod";
import { jsonValueSchema } from "./json";

export const insertChatSessionSchema = z.object({
  sessionId: z.string().min(1),
  clientInfo: jsonValueSchema.optional(),
});

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;

export interface ChatSession extends InsertChatSession {
  id: number;
  messages: unknown[];
  recommendations?: unknown[];
  createdAt: Date;
  updatedAt: Date;
}
