// src/server/storage-pricing-packages.ts
import type { PricingPackage, InsertPricingPackage } from "@shared/schema";

export interface PricingStorage {
  createPricingPackage(pkg: InsertPricingPackage): Promise<PricingPackage>;
  getPricingPackagesByService(servicePage: string): Promise<PricingPackage[]>;
  getAllPricingPackages(): Promise<PricingPackage[]>;
  updatePricingPackage(
    id: number,
    data: Partial<InsertPricingPackage>,
  ): Promise<PricingPackage>;
  deletePricingPackage(id: number): Promise<void>;
}
