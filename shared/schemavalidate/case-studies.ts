// shared/schema/case-studies.ts
import { z } from "zod";
import { jsonValueSchema } from "./json";

export const insertCaseStudySchema = z.object({
  servicePage: z.string().min(1),
  title: z.string().min(1),
  client: z.string().min(1),
  industry: z.string().min(1),
  results: jsonValueSchema,
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;

export interface CaseStudy extends InsertCaseStudy {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
