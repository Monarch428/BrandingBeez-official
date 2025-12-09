// src/server/db-featured-clients.ts
import type { IStorage } from "../storage";
import type { FeaturedClient, InsertFeaturedClient } from "@shared/schema";
import { FeaturedClientModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const featuredClientStorage = {
  async createFeaturedClient(
    client: InsertFeaturedClient,
  ): Promise<FeaturedClient> {
    await ensureConnection();
    const id = await getNextSequence("featured_clients");
    const created = await FeaturedClientModel.create({ id, ...client });
    return toPlain<FeaturedClient>(created);
  },

  async getFeaturedClientsByService(
    servicePage: string,
  ): Promise<FeaturedClient[]> {
    await ensureConnection();
    const clients = await FeaturedClientModel.find({
      servicePage,
      isActive: true,
    }).lean<FeaturedClient[]>();
    return clients;
  },

  async getAllFeaturedClients(): Promise<FeaturedClient[]> {
    await ensureConnection();
    const clients = await FeaturedClientModel.find({ isActive: true }).lean<FeaturedClient[]>();
    return clients;
  },

  async updateFeaturedClient(
    id: number,
    data: Partial<InsertFeaturedClient>,
  ): Promise<FeaturedClient> {
    await ensureConnection();
    const updated = await FeaturedClientModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<FeaturedClient>();

    if (!updated) {
      throw new Error("Featured client not found");
    }
    return updated;
  },

  async deleteFeaturedClient(id: number): Promise<void> {
    await ensureConnection();
    await FeaturedClientModel.deleteOne({ id });
  },
} satisfies Pick<
  IStorage,
  | "createFeaturedClient"
  | "getFeaturedClientsByService"
  | "getAllFeaturedClients"
  | "updateFeaturedClient"
  | "deleteFeaturedClient"
>;
