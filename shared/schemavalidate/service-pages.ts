// shared/schema/service-pages.ts
import { z } from "zod";

export const insertServicePageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  auditFormType: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type InsertServicePage = z.infer<typeof insertServicePageSchema>;

export interface ServicePage extends InsertServicePage {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
