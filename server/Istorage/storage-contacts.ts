// src/server/storage-contacts.ts
import type { Contact, InsertContact } from "@shared/schema";

export interface ContactStorage {
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  deleteContact(id: number): Promise<void>;
}
