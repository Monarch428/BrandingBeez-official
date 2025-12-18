import type { WebCaseStudyCard } from "../model/casestudy/web/web-case-study-card";
import type { WebCaseStudyDetail } from "../model/casestudy/web/web-case-study-detail";

export type InsertWebCaseStudyCard = Omit<WebCaseStudyCard, "id" | "createdAt" | "updatedAt">;
export type InsertWebCaseStudyDetail = Omit<WebCaseStudyDetail, "createdAt" | "updatedAt">;

export type WebCaseStudyCombined = { card: WebCaseStudyCard; detail?: WebCaseStudyDetail };

export interface WebCaseStudyStorage {
  // Card
  createWebCaseStudyCard(payload: InsertWebCaseStudyCard): Promise<WebCaseStudyCard>;
  updateWebCaseStudyCardBySlug(
    slug: string,
    data: Partial<InsertWebCaseStudyCard>
  ): Promise<WebCaseStudyCard>;
  deleteWebCaseStudyCardBySlug(slug: string): Promise<void>;
  getWebCaseStudyCardBySlug(slug: string): Promise<WebCaseStudyCard | undefined>;
  listWebCaseStudyCards(): Promise<WebCaseStudyCard[]>;

  // Detail
  upsertWebCaseStudyDetail(payload: InsertWebCaseStudyDetail): Promise<WebCaseStudyDetail>;
  getWebCaseStudyDetailByCardId(cardId: string): Promise<WebCaseStudyDetail | undefined>;

  // Public combined
  getWebCaseStudyCombinedBySlug(slug: string): Promise<WebCaseStudyCombined | undefined>;
}
