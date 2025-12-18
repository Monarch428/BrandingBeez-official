import type { IStorage } from "../storage";
import { ensureConnection, getNextSequence } from "../helpers/db-helpers";

import { DedicatedResourceCaseStudyCardModel } from "../model/casestudy/dr/dedicated-resource-case-study-card";
import { DedicatedResourceCaseStudyDetailModel } from "../model/casestudy/dr/dedicated-resource-case-study-detail";

import type { DedicatedResourceCaseStudyCard } from "../model/casestudy/dr/dedicated-resource-case-study-card";
import type { DedicatedResourceCaseStudyDetail } from "../model/casestudy/dr/dedicated-resource-case-study-detail";

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

export const dedicatedResourceCaseStudyStorage = {
  // ---------------- CARD ----------------
  async createDedicatedResourceCaseStudyCard(
    payload: InsertDedicatedResourceCaseStudyCard
  ): Promise<DedicatedResourceCaseStudyCard> {
    await ensureConnection();
    const id = await getNextSequence("dedicated_resource_case_study_cards");
    const created = await DedicatedResourceCaseStudyCardModel.create({ id, ...payload });
    return created.toObject() as DedicatedResourceCaseStudyCard;
  },

  async updateDedicatedResourceCaseStudyCardBySlug(
    slug: string,
    data: Partial<InsertDedicatedResourceCaseStudyCard>
  ): Promise<DedicatedResourceCaseStudyCard> {
    await ensureConnection();
    const updated = await DedicatedResourceCaseStudyCardModel.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true }
    ).lean<DedicatedResourceCaseStudyCard>();

    if (!updated) throw new Error("Dedicated resources case study card not found");
    return updated;
  },

  async deleteDedicatedResourceCaseStudyCardBySlug(slug: string): Promise<void> {
    await ensureConnection();
    const card = await DedicatedResourceCaseStudyCardModel.findOne({ slug }).lean<any>();
    if (card?._id) {
      await DedicatedResourceCaseStudyDetailModel.deleteOne({ cardId: card._id });
    }
    await DedicatedResourceCaseStudyCardModel.deleteOne({ slug });
  },

  async getDedicatedResourceCaseStudyCardBySlug(
    slug: string
  ): Promise<DedicatedResourceCaseStudyCard | undefined> {
    await ensureConnection();
    const doc = await DedicatedResourceCaseStudyCardModel.findOne({ slug }).lean<DedicatedResourceCaseStudyCard>();
    return doc ?? undefined;
  },

  async listDedicatedResourceCaseStudyCards(): Promise<DedicatedResourceCaseStudyCard[]> {
    await ensureConnection();
    const docs = await DedicatedResourceCaseStudyCardModel.find({})
      .sort({ id: 1 })
      .lean<DedicatedResourceCaseStudyCard[]>();
    return docs ?? [];
  },

  // ---------------- DETAIL ----------------
  async upsertDedicatedResourceCaseStudyDetail(
    payload: InsertDedicatedResourceCaseStudyDetail
  ): Promise<DedicatedResourceCaseStudyDetail> {
    await ensureConnection();
    const updated = await DedicatedResourceCaseStudyDetailModel.findOneAndUpdate(
      { cardId: payload.cardId },
      { $set: payload },
      { new: true, upsert: true }
    ).lean<DedicatedResourceCaseStudyDetail>();

    if (!updated) throw new Error("Failed to upsert Dedicated Resources case study detail");
    return updated;
  },

  async getDedicatedResourceCaseStudyDetailByCardId(
    cardId: string
  ): Promise<DedicatedResourceCaseStudyDetail | undefined> {
    await ensureConnection();
    const doc = await DedicatedResourceCaseStudyDetailModel.findOne({ cardId }).lean<DedicatedResourceCaseStudyDetail>();
    return doc ?? undefined;
  },

  // ---------------- PUBLIC COMBINED ----------------
  async getDedicatedResourceCaseStudyCombinedBySlug(
    slug: string
  ): Promise<DedicatedResourceCaseStudyCombined | undefined> {
    await ensureConnection();
    const card: any = await DedicatedResourceCaseStudyCardModel.findOne({ slug }).lean<any>();
    if (!card) return undefined;

    const detail = await DedicatedResourceCaseStudyDetailModel.findOne({ cardId: card._id }).lean<any>();

    return {
      card: card as DedicatedResourceCaseStudyCard,
      detail: (detail as DedicatedResourceCaseStudyDetail) ?? undefined,
    };
  },
} satisfies Pick<
  IStorage,
  | "createDedicatedResourceCaseStudyCard"
  | "updateDedicatedResourceCaseStudyCardBySlug"
  | "deleteDedicatedResourceCaseStudyCardBySlug"
  | "getDedicatedResourceCaseStudyCardBySlug"
  | "listDedicatedResourceCaseStudyCards"
  | "upsertDedicatedResourceCaseStudyDetail"
  | "getDedicatedResourceCaseStudyDetailByCardId"
  | "getDedicatedResourceCaseStudyCombinedBySlug"
>;
