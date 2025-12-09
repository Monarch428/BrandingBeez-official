// src/server/storage-service-pages.ts
import type { ServicePage, InsertServicePage } from "@shared/schema";

export interface ServicePageStorage {
  createServicePage(page: InsertServicePage): Promise<ServicePage>;
  getServicePage(slug: string): Promise<ServicePage | undefined>;
  getAllServicePages(): Promise<ServicePage[]>;
  updateServicePage(
    id: number,
    data: Partial<InsertServicePage>,
  ): Promise<ServicePage>;
  deleteServicePage(id: number): Promise<void>;
}
