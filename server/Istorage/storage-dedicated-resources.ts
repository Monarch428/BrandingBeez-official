// src/server/storage-dedicated-resources.ts
import type {
  DedicatedResourcesLead,
  InsertDedicatedResourcesLead,
} from "@shared/schema";

export interface DedicatedResourcesStorage {
  createDedicatedResourcesLead(
    lead: InsertDedicatedResourcesLead,
  ): Promise<DedicatedResourcesLead>;
  getAllDedicatedResourcesLeads(): Promise<DedicatedResourcesLead[]>;
}
