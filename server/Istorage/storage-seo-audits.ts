// src/server/storage-seo-audits.ts
import type { SeoAudit, InsertSeoAudit } from "@shared/schema";

export interface SeoAuditStorage {
  createSeoAudit(audit: InsertSeoAudit): Promise<SeoAudit>;
  getSeoAudit(id: number): Promise<SeoAudit | undefined>;
  getAuditsByClient(clientId: number): Promise<SeoAudit[]>;
  updateAuditData(
    id: number,
    data: any,
    score: number,
    recommendations: string,
  ): Promise<SeoAudit>;
}
