import type { PpcCaseStudyCard } from "../model/casestudy/ppc/ppc-case-study-card";
import type { PpcCaseStudyDetail } from "../model/casestudy/ppc/ppc-case-study-detail";

export type InsertPpcCaseStudyCard = Omit<PpcCaseStudyCard, "id" | "createdAt" | "updatedAt">;
export type InsertPpcCaseStudyDetail = Omit<PpcCaseStudyDetail, "createdAt" | "updatedAt">;

export type PpcCaseStudyCombined = { card: PpcCaseStudyCard; detail?: PpcCaseStudyDetail };

export interface PpcCaseStudyStorage {
  createPpcCaseStudyCard(payload: InsertPpcCaseStudyCard): Promise<PpcCaseStudyCard>;
  updatePpcCaseStudyCardBySlug(slug: string, data: Partial<InsertPpcCaseStudyCard>): Promise<PpcCaseStudyCard>;
  deletePpcCaseStudyCardBySlug(slug: string): Promise<void>;
  getPpcCaseStudyCardBySlug(slug: string): Promise<PpcCaseStudyCard | undefined>;
  listPpcCaseStudyCards(): Promise<PpcCaseStudyCard[]>;

  upsertPpcCaseStudyDetail(payload: InsertPpcCaseStudyDetail): Promise<PpcCaseStudyDetail>;
  getPpcCaseStudyDetailByCardId(cardId: string): Promise<PpcCaseStudyDetail | undefined>;

  getPpcCaseStudyCombinedBySlug(slug: string): Promise<PpcCaseStudyCombined | undefined>;
}
