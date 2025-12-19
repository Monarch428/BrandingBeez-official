import type { IStorage } from "../storage";
import { ensureConnection, getNextSequence } from "../helpers/db-helpers";

import { PpcCaseStudyCardModel } from "../model/casestudy/ppc/ppc-case-study-card";
import { PpcCaseStudyDetailModel } from "../model/casestudy/ppc/ppc-case-study-detail";

import type { PpcCaseStudyCard } from "../model/casestudy/ppc/ppc-case-study-card";
import type { PpcCaseStudyDetail } from "../model/casestudy/ppc/ppc-case-study-detail";

export type InsertPpcCaseStudyCard = Omit<PpcCaseStudyCard, "id" | "createdAt" | "updatedAt">;
export type InsertPpcCaseStudyDetail = Omit<PpcCaseStudyDetail, "createdAt" | "updatedAt">;

export type PpcCaseStudyCombined = {
  card: PpcCaseStudyCard;
  detail?: PpcCaseStudyDetail;
};

export const ppcCaseStudyStorage = {
  // ---------------- CARD ----------------
  async createPpcCaseStudyCard(payload: InsertPpcCaseStudyCard): Promise<PpcCaseStudyCard> {
    await ensureConnection();
    const id = await getNextSequence("ppc_case_study_cards");
    const created = await PpcCaseStudyCardModel.create({ id, ...payload });
    return created.toObject() as PpcCaseStudyCard;
  },

  async updatePpcCaseStudyCardBySlug(
    slug: string,
    data: Partial<InsertPpcCaseStudyCard>
  ): Promise<PpcCaseStudyCard> {
    await ensureConnection();
    const updated = await PpcCaseStudyCardModel.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true }
    ).lean<PpcCaseStudyCard>();

    if (!updated) throw new Error("PPC case study card not found");
    return updated;
  },

  async deletePpcCaseStudyCardBySlug(slug: string): Promise<void> {
    await ensureConnection();
    const card = await PpcCaseStudyCardModel.findOne({ slug }).lean<any>();
    if (card?._id) {
      await PpcCaseStudyDetailModel.deleteOne({ cardId: card._id });
    }
    await PpcCaseStudyCardModel.deleteOne({ slug });
  },

  async getPpcCaseStudyCardBySlug(slug: string): Promise<PpcCaseStudyCard | undefined> {
    await ensureConnection();
    const doc = await PpcCaseStudyCardModel.findOne({ slug }).lean<PpcCaseStudyCard>();
    return doc ?? undefined;
  },

  async listPpcCaseStudyCards(): Promise<PpcCaseStudyCard[]> {
    await ensureConnection();
    const docs = await PpcCaseStudyCardModel.find({}).sort({ id: 1 }).lean<PpcCaseStudyCard[]>();
    return docs ?? [];
  },

  // ---------------- DETAIL ----------------
  async upsertPpcCaseStudyDetail(payload: InsertPpcCaseStudyDetail): Promise<PpcCaseStudyDetail> {
    await ensureConnection();
    const updated = await PpcCaseStudyDetailModel.findOneAndUpdate(
      { cardId: payload.cardId },
      { $set: payload },
      { new: true, upsert: true }
    ).lean<PpcCaseStudyDetail>();

    if (!updated) throw new Error("Failed to upsert PPC case study detail");
    return updated;
  },

  async getPpcCaseStudyDetailByCardId(cardId: string): Promise<PpcCaseStudyDetail | undefined> {
    await ensureConnection();
    const doc = await PpcCaseStudyDetailModel.findOne({ cardId }).lean<PpcCaseStudyDetail>();
    return doc ?? undefined;
  },

  // ---------------- PUBLIC COMBINED ----------------
  async getPpcCaseStudyCombinedBySlug(slug: string): Promise<PpcCaseStudyCombined | undefined> {
    await ensureConnection();
    const card: any = await PpcCaseStudyCardModel.findOne({ slug }).lean<any>();
    if (!card) return undefined;

    const detail = await PpcCaseStudyDetailModel.findOne({ cardId: card._id }).lean<any>();

    return {
      card: card as PpcCaseStudyCard,
      detail: (detail as PpcCaseStudyDetail) ?? undefined,
    };
  },
} satisfies Pick<
  IStorage,
  | "createPpcCaseStudyCard"
  | "updatePpcCaseStudyCardBySlug"
  | "deletePpcCaseStudyCardBySlug"
  | "getPpcCaseStudyCardBySlug"
  | "listPpcCaseStudyCards"
  | "upsertPpcCaseStudyDetail"
  | "getPpcCaseStudyDetailByCardId"
  | "getPpcCaseStudyCombinedBySlug"
>;
