// src/server/db-seo-audits.ts
import type { IStorage } from "../storage";
import type { SeoAudit, InsertSeoAudit } from "@shared/schema";
import { SeoAuditModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const seoAuditStorage = {
  async createSeoAudit(audit: InsertSeoAudit): Promise<SeoAudit> {
    await ensureConnection();
    const id = await getNextSequence("seo_audits");
    const created = await SeoAuditModel.create({ id, ...audit });
    return toPlain<SeoAudit>(created);
  },

  async getSeoAudit(id: number): Promise<SeoAudit | undefined> {
    await ensureConnection();
    const audit = await SeoAuditModel.findOne({ id }).lean<SeoAudit>();
    return audit ?? undefined;
  },

  async getAuditsByClient(clientId: number): Promise<SeoAudit[]> {
    await ensureConnection();
    const audits = await SeoAuditModel.find({ clientId }).lean<SeoAudit[]>();
    return audits;
  },

  async updateAuditData(
    id: number,
    data: any,
    score: number,
    recommendations: string,
  ): Promise<SeoAudit> {
    await ensureConnection();
    const updated = await SeoAuditModel.findOneAndUpdate(
      { id },
      {
        auditData: data,
        score,
        recommendations,
        status: "completed",
        completedAt: new Date(),
      },
      { new: true },
    ).lean<SeoAudit>();

    if (!updated) {
      throw new Error("SEO audit not found");
    }
    return updated;
  },
} satisfies Pick<
  IStorage,
  "createSeoAudit" | "getSeoAudit" | "getAuditsByClient" | "updateAuditData"
>;
