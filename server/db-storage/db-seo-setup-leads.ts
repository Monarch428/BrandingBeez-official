import type { IStorage } from "../storage";
import type {
  SeoSetupLead,
  InsertSeoSetupLead,
} from "@shared/schema";
import { SeoSetupLeadModel } from "../models";
import {
  ensureConnection,
  getNextSequence,
  toPlain,
} from "../helpers/db-helpers";

export const seoSetupLeadStorage = {
  async createSeoSetupLead(
    data: InsertSeoSetupLead
  ): Promise<SeoSetupLead> {
    await ensureConnection();

    const id = await getNextSequence("seo_setup_leads");

    const created = await SeoSetupLeadModel.create({
      id,
      ...data,
    });

    return toPlain<SeoSetupLead>(created);
  },

  async getAllSeoSetupLeads(): Promise<SeoSetupLead[]> {
    await ensureConnection();

    const leads = await SeoSetupLeadModel.find()
      .sort({ createdAt: -1 })
      .lean<SeoSetupLead[]>();

    return leads;
  },

  async getSeoSetupLeadById(id: number): Promise<SeoSetupLead | null> {
    await ensureConnection();

    const lead = await SeoSetupLeadModel.findOne({ id }).lean<SeoSetupLead | null>();

    return lead;
  },

  async deleteSeoSetupLead(id: number): Promise<void> {
    await ensureConnection();

    await SeoSetupLeadModel.deleteOne({ id });
  },
} satisfies Pick<
  IStorage,
  | "createSeoSetupLead"
  | "getAllSeoSetupLeads"
  | "getSeoSetupLeadById"
  | "deleteSeoSetupLead"
>;