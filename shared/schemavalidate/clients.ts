// shared/schema/clients.ts
import { z } from "zod";

export const insertClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  region: z.string().optional(),
});

export type InsertClient = z.infer<typeof insertClientSchema>;

export interface Client extends InsertClient {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
