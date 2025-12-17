import type { SeoCaseStudyCard } from "../model/casestudy/seo-case-study-card";
import type { SeoCaseStudyDetail } from "../model/casestudy/seo-case-study-detail";

export type InsertSeoCaseStudyCard = Omit<SeoCaseStudyCard, "id" | "createdAt" | "updatedAt">;
export type InsertSeoCaseStudyDetail = Omit<SeoCaseStudyDetail, "createdAt" | "updatedAt">;

export type SeoCaseStudyCombined = {
  card: SeoCaseStudyCard;
  detail?: SeoCaseStudyDetail;
};

export interface SeoCaseStudyStorage {
  // Card
  createSeoCaseStudyCard(payload: InsertSeoCaseStudyCard): Promise<SeoCaseStudyCard>;
  updateSeoCaseStudyCardBySlug(slug: string, data: Partial<InsertSeoCaseStudyCard>): Promise<SeoCaseStudyCard>;
  deleteSeoCaseStudyCardBySlug(slug: string): Promise<void>;
  getSeoCaseStudyCardBySlug(slug: string): Promise<SeoCaseStudyCard | undefined>;
  listSeoCaseStudyCards(): Promise<SeoCaseStudyCard[]>;

  // Detail (FK)
  upsertSeoCaseStudyDetail(payload: InsertSeoCaseStudyDetail): Promise<SeoCaseStudyDetail>;
  getSeoCaseStudyDetailByCardId(cardId: string): Promise<SeoCaseStudyDetail | undefined>;

  // Public combined
  getSeoCaseStudyCombinedBySlug(slug: string): Promise<SeoCaseStudyCombined | undefined>;
}
