// src/server/db-service-pages.ts
import type { IStorage } from "../storage";
import type { ServicePage, InsertServicePage } from "@shared/schema";
import { ServicePageModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const servicePageStorage = {
  async createServicePage(page: InsertServicePage): Promise<ServicePage> {
    await ensureConnection();
    const id = await getNextSequence("service_pages");
    const created = await ServicePageModel.create({ id, ...page });
    return toPlain<ServicePage>(created);
  },

  async getServicePage(slug: string): Promise<ServicePage | undefined> {
    await ensureConnection();
    const page = await ServicePageModel.findOne({
      slug,
      isActive: true,
    }).lean<ServicePage>();
    return page ?? undefined;
  },

  async getAllServicePages(): Promise<ServicePage[]> {
    await ensureConnection();
    const pages = await ServicePageModel.find({ isActive: true }).lean<ServicePage[]>();
    return pages;
  },

  async updateServicePage(
    id: number,
    data: Partial<InsertServicePage>,
  ): Promise<ServicePage> {
    await ensureConnection();
    const updated = await ServicePageModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<ServicePage>();

    if (!updated) {
      throw new Error("Service page not found");
    }
    return updated;
  },

  async deleteServicePage(id: number): Promise<void> {
    await ensureConnection();
    await ServicePageModel.deleteOne({ id });
  },
} satisfies Pick<
  IStorage,
  | "createServicePage"
  | "getServicePage"
  | "getAllServicePages"
  | "updateServicePage"
  | "deleteServicePage"
>;
