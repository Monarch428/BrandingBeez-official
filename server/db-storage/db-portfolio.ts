// src/server/db-portfolio.ts
import type { IStorage } from "../storage";
import type {
  PortfolioItem,
  InsertPortfolioItem,
  PortfolioContent,
  InsertPortfolioContent,
} from "@shared/schema";
import {
  PortfolioItemModel,
  PortfolioContentModel,
} from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

function defaultPortfolioContent(): InsertPortfolioContent {
  return {
    heroTitle: "Real AI Solutions We’ve Built",
    heroHighlight: "with Full Transparency",
    heroSubtitle:
      "Actual costs, timelines, tech stack, and ROI verified and documented. No fluff. Just results you can trust.",
    heroDescription:
      "We partner with founders and teams to ship automation and AI products that deliver measurable ROI in weeks, not months.",
    heroStats: [
      { kpi: "15+", label: "Projects Delivered" },
      { kpi: "$127K", label: "Total Value Created" },
      { kpi: "325%", label: "Average ROI" },
    ],
    heroPrimaryCtaText: "Explore Case Studies",
    heroPrimaryCtaHref: "/#case-studies",
    heroSecondaryCtaText: "Get an Estimate",
    heroSecondaryCtaHref: "/pricing-calculator",
    testimonialsTitle: "What Our Clients Say",
    testimonialsSubtitle:
      "Transparent pricing, predictable delivery, and partners who stay accountable end to end.",
    testimonials: [
      {
        quote:
          "The ROI was immediate. We saw efficiency gains within the first week.",
        who: "AC Graphics",
        tag: "Manufacturing",
      },
      {
        quote:
          "BrandingBeez delivered exactly what they promised, on time and on budget.",
        who: "Wellenpuls",
        tag: "HealthTech",
      },
      {
        quote: "Finally, an agency that shows you the real costs upfront.",
        who: "Digital Identity Client",
        tag: "SaaS Startup",
      },
    ],
  };
}

function normalizePortfolioContent(
  content: PortfolioContent,
): PortfolioContent {
  return {
    ...content,
    heroStats: content.heroStats ?? [],
    testimonials: content.testimonials ?? [],
  };
}

export const portfolioStorage = {
  async createPortfolioItem(
    item: InsertPortfolioItem,
  ): Promise<PortfolioItem> {
    await ensureConnection();
    const id = await getNextSequence("portfolio_items");
    const created = await PortfolioItemModel.create({ id, ...item });
    return toPlain<PortfolioItem>(created);
  },

  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    await ensureConnection();
    const items = await PortfolioItemModel.find()
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  },

  async getPublicPortfolioItems(): Promise<PortfolioItem[]> {
    await ensureConnection();
    const items = await PortfolioItemModel.find({ isActive: true })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  },

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    await ensureConnection();
    const items = await PortfolioItemModel.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  },

  async getPortfolioItemBySlug(
    slug: string,
  ): Promise<PortfolioItem | undefined> {
    await ensureConnection();
    const item = await PortfolioItemModel.findOne({
      slug,
      isActive: true,
    }).lean<PortfolioItem>();
    return item ?? undefined;
  },

  async updatePortfolioItem(
    id: number,
    data: Partial<InsertPortfolioItem>,
  ): Promise<PortfolioItem> {
    await ensureConnection();
    const updated = await PortfolioItemModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<PortfolioItem>();

    if (!updated) {
      throw new Error("Portfolio item not found");
    }
    return updated;
  },

  async deletePortfolioItem(id: number): Promise<void> {
    await ensureConnection();
    await PortfolioItemModel.deleteOne({ id });
  },

  async getPortfolioContent(): Promise<PortfolioContent> {
    await ensureConnection();
    let content = await PortfolioContentModel.findOne().lean<PortfolioContent>();

    if (!content) {
      const id = await getNextSequence("portfolio_content");
      const defaults = defaultPortfolioContent();
      const created = await PortfolioContentModel.create({
        id,
        ...defaults,
      });
      return normalizePortfolioContent(
        toPlain<PortfolioContent>(created),
      );
    }

    return normalizePortfolioContent(content);
  },

  async upsertPortfolioContent(
    data: InsertPortfolioContent,
  ): Promise<PortfolioContent> {
    await ensureConnection();
    const payload = {
      ...data,
      heroStats: data.heroStats ?? [],
      testimonials: data.testimonials ?? [],
    };

    const existing = await PortfolioContentModel.findOne();
    if (!existing) {
      const id = await getNextSequence("portfolio_content");
      const created = await PortfolioContentModel.create({
        id,
        ...payload,
      });
      return normalizePortfolioContent(
        toPlain<PortfolioContent>(created),
      );
    }

    const updated = await PortfolioContentModel.findOneAndUpdate(
      { id: existing.get("id") },
      payload,
      { new: true },
    ).lean<PortfolioContent>();

    if (!updated) {
      throw new Error("Failed to update portfolio content");
    }

    return normalizePortfolioContent(updated);
  },

  async getAllPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]> {
    await ensureConnection();
    const items = await PortfolioItemModel.find({ serviceCategory })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  },

  async getPublicPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]> {
    await ensureConnection();
    const items = await PortfolioItemModel.find({
      isActive: true,
      serviceCategory,
    })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  },
} satisfies Pick<
  IStorage,
  | "createPortfolioItem"
  | "getAllPortfolioItems"
  | "getPublicPortfolioItems"
  | "getFeaturedPortfolioItems"
  | "getPortfolioItemBySlug"
  | "updatePortfolioItem"
  | "deletePortfolioItem"
  | "getPortfolioContent"
  | "upsertPortfolioContent"
  | "getAllPortfolioItemsByCategory"
  | "getPublicPortfolioItemsByCategory"
>;
