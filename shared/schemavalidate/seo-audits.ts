// shared/schema/seo-audits.ts
import { z } from "zod";

export const insertSeoAuditSchema = z.object({
  websiteUrl: z.string().min(1),
  clientId: z.number().int(),
  status: z.string().optional(),
});

export type InsertSeoAudit = z.infer<typeof insertSeoAuditSchema>;

export interface SeoAudit {
  id: number;
  clientId: number;
  websiteUrl: string;
  auditData?: unknown;
  score?: number | null;
  status: string;
  recommendations?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
}
