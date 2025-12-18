import { DedicatedResourceCaseStudyCard, DedicatedResourceCaseStudyDetail } from "server/models";

export type InsertDedicatedResourceCaseStudyCard = Omit<
  DedicatedResourceCaseStudyCard,
  "id" | "createdAt" | "updatedAt"
>;

export type InsertDedicatedResourceCaseStudyDetail = Omit<
  DedicatedResourceCaseStudyDetail,
  "createdAt" | "updatedAt"
>;

export type DedicatedResourceCaseStudyCombined = {
  card: DedicatedResourceCaseStudyCard;
  detail?: DedicatedResourceCaseStudyDetail;
};

export interface DedicatedResourceCaseStudyStorage {
  createDedicatedResourceCaseStudyCard(
    payload: InsertDedicatedResourceCaseStudyCard
  ): Promise<DedicatedResourceCaseStudyCard>;

  updateDedicatedResourceCaseStudyCardBySlug(
    slug: string,
    data: Partial<InsertDedicatedResourceCaseStudyCard>
  ): Promise<DedicatedResourceCaseStudyCard>;

  deleteDedicatedResourceCaseStudyCardBySlug(slug: string): Promise<void>;

  getDedicatedResourceCaseStudyCardBySlug(
    slug: string
  ): Promise<DedicatedResourceCaseStudyCard | undefined>;

  listDedicatedResourceCaseStudyCards(): Promise<DedicatedResourceCaseStudyCard[]>;

  upsertDedicatedResourceCaseStudyDetail(
    payload: InsertDedicatedResourceCaseStudyDetail
  ): Promise<DedicatedResourceCaseStudyDetail>;

  getDedicatedResourceCaseStudyDetailByCardId(
    cardId: string
  ): Promise<DedicatedResourceCaseStudyDetail | undefined>;

  getDedicatedResourceCaseStudyCombinedBySlug(
    slug: string
  ): Promise<DedicatedResourceCaseStudyCombined | undefined>;
}
