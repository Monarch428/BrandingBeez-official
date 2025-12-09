// shared/schema/featured-clients.ts
import { z } from "zod";

export const insertFeaturedClientSchema = z.object({
  servicePage: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().optional(),
  website: z.string().optional(),
  description: z.string().min(1),
  achievements: z.array(z.string()),
  industry: z.string().min(1),
  timeframe: z.string().min(1),
  isActive: z.boolean().optional(),
});

export type InsertFeaturedClient = z.infer<typeof insertFeaturedClientSchema>;

export interface FeaturedClient extends InsertFeaturedClient {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
