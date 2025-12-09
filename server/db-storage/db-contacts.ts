// src/server/db-contacts.ts
import type { IStorage } from "../storage";
import type { Contact, InsertContact } from "@shared/schema";
import { ContactModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const contactStorage = {
  async createContact(contact: InsertContact): Promise<Contact> {
    await ensureConnection();
    const id = await getNextSequence("contacts");
    const created = await ContactModel.create({ id, ...contact });
    return toPlain<Contact>(created);
  },

  async getAllContacts(): Promise<Contact[]> {
    await ensureConnection();
    const contacts = await ContactModel.find()
      .sort({ createdAt: -1 })
      .lean<Contact[]>();
    return contacts;
  },

  async deleteContact(id: number): Promise<void> {
    await ensureConnection();
    await ContactModel.deleteOne({ id });
  },
} satisfies Pick<IStorage, "createContact" | "getAllContacts" | "deleteContact">;
