import type {
  SeoSetupLead,
  InsertSeoSetupLead,
} from "@shared/schema";

export interface SeoSetupLeadStorage {
  createSeoSetupLead(data: InsertSeoSetupLead): Promise<SeoSetupLead>;
  getAllSeoSetupLeads(): Promise<SeoSetupLead[]>;
  getSeoSetupLeadById(id: number): Promise<SeoSetupLead | null>;
  deleteSeoSetupLead(id: number): Promise<void>;
}