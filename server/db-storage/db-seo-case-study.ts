import type { IStorage } from "../storage";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

import { SeoCaseStudyCardModel } from "../model/casestudy/seo-case-study-card";
import { SeoCaseStudyDetailModel } from "../model/casestudy/seo-case-study-detail";

import type { SeoCaseStudyCard } from "../model/casestudy/seo-case-study-card";
import type { SeoCaseStudyDetail } from "../model/casestudy/seo-case-study-detail";

export type InsertSeoCaseStudyCard = Omit<SeoCaseStudyCard, "id" | "createdAt" | "updatedAt">;
export type InsertSeoCaseStudyDetail = Omit<SeoCaseStudyDetail, "createdAt" | "updatedAt">;

// ✅ Public combined type for detail page
export type SeoCaseStudyCombined = {
  card: SeoCaseStudyCard;
  detail?: SeoCaseStudyDetail;
};

export const seoCaseStudyStorage = {
  // ---------------- CARD ----------------
  async createSeoCaseStudyCard(payload: InsertSeoCaseStudyCard): Promise<SeoCaseStudyCard> {
    await ensureConnection();
    const id = await getNextSequence("seo_case_study_cards");
    const created = await SeoCaseStudyCardModel.create({ id, ...payload });
    return toPlain<SeoCaseStudyCard>(created);
  },

  async updateSeoCaseStudyCardBySlug(
    slug: string,
    data: Partial<InsertSeoCaseStudyCard>
  ): Promise<SeoCaseStudyCard> {
    await ensureConnection();
    const updated = await SeoCaseStudyCardModel.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true }
    ).lean<SeoCaseStudyCard>();

    if (!updated) throw new Error("SEO case study card not found");
    return updated;
  },

  async deleteSeoCaseStudyCardBySlug(slug: string): Promise<void> {
    await ensureConnection();
    const card = await SeoCaseStudyCardModel.findOne({ slug }).lean<any>();
    if (card?._id) {
      await SeoCaseStudyDetailModel.deleteOne({ cardId: card._id });
    }
    await SeoCaseStudyCardModel.deleteOne({ slug });
  },

  async getSeoCaseStudyCardBySlug(slug: string): Promise<SeoCaseStudyCard | undefined> {
    await ensureConnection();
    const doc = await SeoCaseStudyCardModel.findOne({ slug }).lean<SeoCaseStudyCard>();
    return doc ?? undefined;
  },

  async listSeoCaseStudyCards(): Promise<SeoCaseStudyCard[]> {
    await ensureConnection();
    const docs = await SeoCaseStudyCardModel.find({})
      .sort({ id: 1 })
      .lean<SeoCaseStudyCard[]>();

    return docs ?? [];
  },

  // ---------------- DETAIL ----------------
  async upsertSeoCaseStudyDetail(payload: InsertSeoCaseStudyDetail): Promise<SeoCaseStudyDetail> {
    await ensureConnection();
    const updated = await SeoCaseStudyDetailModel.findOneAndUpdate(
      { cardId: payload.cardId },
      { $set: payload },
      { new: true, upsert: true }
    ).lean<SeoCaseStudyDetail>();

    if (!updated) throw new Error("Failed to upsert SEO case study detail");
    return updated;
  },

  async getSeoCaseStudyDetailByCardId(cardId: string): Promise<SeoCaseStudyDetail | undefined> {
    await ensureConnection();
    const doc = await SeoCaseStudyDetailModel.findOne({ cardId }).lean<SeoCaseStudyDetail>();
    return doc ?? undefined;
  },

  // ---------------- PUBLIC COMBINED ----------------
  async getSeoCaseStudyCombinedBySlug(slug: string): Promise<SeoCaseStudyCombined | undefined> {
    await ensureConnection();
    const card: any = await SeoCaseStudyCardModel.findOne({ slug }).lean<any>();
    if (!card) return undefined;

    const detail = await SeoCaseStudyDetailModel.findOne({ cardId: card._id }).lean<any>();

    return {
      card: card as SeoCaseStudyCard,
      detail: (detail as SeoCaseStudyDetail) ?? undefined,
    };
  },
} satisfies Pick<
  IStorage,
  | "createSeoCaseStudyCard"
  | "updateSeoCaseStudyCardBySlug"
  | "deleteSeoCaseStudyCardBySlug"
  | "getSeoCaseStudyCardBySlug"
  | "listSeoCaseStudyCards"
  | "upsertSeoCaseStudyDetail"
  | "getSeoCaseStudyDetailByCardId"
  | "getSeoCaseStudyCombinedBySlug"
>;
