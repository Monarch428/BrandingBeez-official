// src/server/storage-clients.ts
import type { Client, InsertClient } from "@shared/schema";

export interface ClientStorage {
  createClient(client: InsertClient): Promise<Client>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  updateClientStatus(id: number, status: string): Promise<Client>;
}
