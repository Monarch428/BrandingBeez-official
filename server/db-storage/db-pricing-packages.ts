// src/server/db-pricing-packages.ts
import type { IStorage } from "../storage";
import type { PricingPackage, InsertPricingPackage } from "@shared/schema";
import { PricingPackageModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const pricingStorage = {
  async createPricingPackage(
    pkg: InsertPricingPackage,
  ): Promise<PricingPackage> {
    await ensureConnection();
    const id = await getNextSequence("pricing_packages");
    const created = await PricingPackageModel.create({ id, ...pkg });
    return toPlain<PricingPackage>(created);
  },

  async getPricingPackagesByService(
    servicePage: string,
  ): Promise<PricingPackage[]> {
    await ensureConnection();
    const packages = await PricingPackageModel.find({
      servicePage,
      isActive: true,
    })
      .sort({ orderIndex: 1 })
      .lean<PricingPackage[]>();
    return packages;
  },

  async getAllPricingPackages(): Promise<PricingPackage[]> {
    await ensureConnection();
    const packages = await PricingPackageModel.find({ isActive: true })
      .sort({ orderIndex: 1 })
      .lean<PricingPackage[]>();
    return packages;
  },

  async updatePricingPackage(
    id: number,
    data: Partial<InsertPricingPackage>,
  ): Promise<PricingPackage> {
    await ensureConnection();
    const updated = await PricingPackageModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<PricingPackage>();

    if (!updated) {
      throw new Error("Pricing package not found");
    }
    return updated;
  },

  async deletePricingPackage(id: number): Promise<void> {
    await ensureConnection();
    await PricingPackageModel.deleteOne({ id });
  },
} satisfies Pick<
  IStorage,
  | "createPricingPackage"
  | "getPricingPackagesByService"
  | "getAllPricingPackages"
  | "updatePricingPackage"
  | "deletePricingPackage"
>;
