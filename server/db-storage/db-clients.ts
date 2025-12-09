// src/server/db-clients.ts
import type { IStorage } from "../storage";
import type { Client, InsertClient } from "@shared/schema";
import { ClientModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const clientStorage = {
  async createClient(client: InsertClient): Promise<Client> {
    await ensureConnection();
    const id = await getNextSequence("clients");
    const created = await ClientModel.create({ id, ...client });
    return toPlain<Client>(created);
  },

  async getClient(id: number): Promise<Client | undefined> {
    await ensureConnection();
    const client = await ClientModel.findOne({ id }).lean<Client>();
    return client ?? undefined;
  },

  async getClientByEmail(email: string): Promise<Client | undefined> {
    await ensureConnection();
    const client = await ClientModel.findOne({ email }).lean<Client>();
    return client ?? undefined;
  },

  async getAllClients(): Promise<Client[]> {
    await ensureConnection();
    const clients = await ClientModel.find()
      .sort({ createdAt: -1 })
      .lean<Client[]>();
    return clients;
  },

  async updateClientStatus(id: number, status: string): Promise<Client> {
    await ensureConnection();
    const updated = await ClientModel.findOneAndUpdate(
      { id },
      { status },
      { new: true },
    ).lean<Client>();

    if (!updated) {
      throw new Error("Client not found");
    }
    return updated;
  },
} satisfies Pick<
  IStorage,
  "createClient" | "getClient" | "getClientByEmail" | "getAllClients" | "updateClientStatus"
>;
