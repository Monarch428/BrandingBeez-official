// shared/schema/pricing-packages.ts
import { z } from "zod";

export const insertPricingPackageSchema = z.object({
  servicePage: z.string().min(1),
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()),
  isPopular: z.boolean().optional(),
  orderIndex: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export type InsertPricingPackage = z.infer<typeof insertPricingPackageSchema>;

export interface PricingPackage extends InsertPricingPackage {
  id: number;
  isPopular: boolean;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
