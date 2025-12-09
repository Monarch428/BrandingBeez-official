// src/server/storage-featured-clients.ts
import type { FeaturedClient, InsertFeaturedClient } from "@shared/schema";

export interface FeaturedClientStorage {
  createFeaturedClient(client: InsertFeaturedClient): Promise<FeaturedClient>;
  getFeaturedClientsByService(servicePage: string): Promise<FeaturedClient[]>;
  getAllFeaturedClients(): Promise<FeaturedClient[]>;
  updateFeaturedClient(
    id: number,
    data: Partial<InsertFeaturedClient>,
  ): Promise<FeaturedClient>;
  deleteFeaturedClient(id: number): Promise<void>;
}
