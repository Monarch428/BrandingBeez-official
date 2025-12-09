// shared/schema/dedicated-resources.ts
import { z } from "zod";
import { jsonValueSchema } from "./json";

export const insertDedicatedResourcesLeadSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  resourceType: z.string().min(1),
  hiringLevel: z.string().optional(),
  multipleResources: jsonValueSchema.optional(),
  additionalNotes: z.string().optional(),
});

export type InsertDedicatedResourcesLead = z.infer<
  typeof insertDedicatedResourcesLeadSchema
>;

export interface DedicatedResourcesLead extends InsertDedicatedResourcesLead {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
