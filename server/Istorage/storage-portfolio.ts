// src/server/storage-portfolio.ts
import type {
  PortfolioItem,
  InsertPortfolioItem,
  PortfolioContent,
  InsertPortfolioContent,
} from "@shared/schema";

export interface PortfolioStorage {
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  getPublicPortfolioItems(): Promise<PortfolioItem[]>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined>;
  updatePortfolioItem(
    id: number,
    data: Partial<InsertPortfolioItem>,
  ): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<void>;

  getPortfolioContent(): Promise<PortfolioContent>;
  upsertPortfolioContent(
    data: InsertPortfolioContent,
  ): Promise<PortfolioContent>;

  getAllPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]>;

  getPublicPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]>;
}
