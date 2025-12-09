// src/server/db-dedicated-resources.ts
import type { IStorage } from "../storage";
import type { DedicatedResourcesLead, InsertDedicatedResourcesLead } from "@shared/schema";
import { DedicatedResourcesLeadModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const dedicatedResourcesStorage = {
  async createDedicatedResourcesLead(
    lead: InsertDedicatedResourcesLead,
  ): Promise<DedicatedResourcesLead> {
    await ensureConnection();
    const id = await getNextSequence("dedicated_resources_leads");
    const created = await DedicatedResourcesLeadModel.create({ id, ...lead });
    return toPlain<DedicatedResourcesLead>(created);
  },

  async getAllDedicatedResourcesLeads(): Promise<DedicatedResourcesLead[]> {
    await ensureConnection();
    const leads = await DedicatedResourcesLeadModel.find()
      .sort({ createdAt: -1 })
      .lean<DedicatedResourcesLead[]>();
    return leads;
  },
} satisfies Pick<
  IStorage,
  "createDedicatedResourcesLead" | "getAllDedicatedResourcesLeads"
>;
