import { WebCaseStudyCard, WebCaseStudyCardModel, WebCaseStudyDetail, WebCaseStudyDetailModel } from "server/models";
import type { IStorage } from "../storage";
import { ensureConnection, getNextSequence } from "../helpers/db-helpers";

export type InsertWebCaseStudyCard = Omit<WebCaseStudyCard, "id" | "createdAt" | "updatedAt">;
export type InsertWebCaseStudyDetail = Omit<WebCaseStudyDetail, "createdAt" | "updatedAt">;

export type WebCaseStudyCombined = {
    card: WebCaseStudyCard;
    detail?: WebCaseStudyDetail;
};

export const webCaseStudyStorage = {
    // ---------------- CARD ----------------
    async createWebCaseStudyCard(payload: InsertWebCaseStudyCard): Promise<WebCaseStudyCard> {
        await ensureConnection();
        const id = await getNextSequence("web_case_study_cards");
        const created = await WebCaseStudyCardModel.create({ id, ...payload });
        return created.toObject() as WebCaseStudyCard;
    },

    async updateWebCaseStudyCardBySlug(
        slug: string,
        data: Partial<InsertWebCaseStudyCard>
    ): Promise<WebCaseStudyCard> {
        await ensureConnection();
        const updated = await WebCaseStudyCardModel.findOneAndUpdate(
            { slug },
            { $set: data },
            { new: true }
        ).lean<WebCaseStudyCard>();

        if (!updated) throw new Error("Website case study card not found");
        return updated;
    },

    async deleteWebCaseStudyCardBySlug(slug: string): Promise<void> {
        await ensureConnection();
        const card: any = await WebCaseStudyCardModel.findOne({ slug }).lean<any>();
        if (card?._id) {
            await WebCaseStudyDetailModel.deleteOne({ cardId: card._id });
        }
        await WebCaseStudyCardModel.deleteOne({ slug });
    },

    async getWebCaseStudyCardBySlug(slug: string): Promise<WebCaseStudyCard | undefined> {
        await ensureConnection();
        const doc = await WebCaseStudyCardModel.findOne({ slug }).lean<WebCaseStudyCard>();
        return doc ?? undefined;
    },

    async listWebCaseStudyCards(): Promise<WebCaseStudyCard[]> {
        await ensureConnection();
        const docs = await WebCaseStudyCardModel.find({}).sort({ id: 1 }).lean<WebCaseStudyCard[]>();
        return docs ?? [];
    },

    // ---------------- DETAIL ----------------
    async upsertWebCaseStudyDetail(payload: InsertWebCaseStudyDetail): Promise<WebCaseStudyDetail> {
        await ensureConnection();
        const updated = await WebCaseStudyDetailModel.findOneAndUpdate(
            { cardId: payload.cardId as any },
            { $set: payload },
            { new: true, upsert: true }
        ).lean<WebCaseStudyDetail>();

        if (!updated) throw new Error("Failed to upsert Website case study detail");
        return updated;
    },

    async getWebCaseStudyDetailByCardId(cardId: string): Promise<WebCaseStudyDetail | undefined> {
        await ensureConnection();
        const doc = await WebCaseStudyDetailModel.findOne({ cardId }).lean<WebCaseStudyDetail>();
        return doc ?? undefined;
    },

    // ---------------- PUBLIC COMBINED ----------------
    async getWebCaseStudyCombinedBySlug(slug: string): Promise<WebCaseStudyCombined | undefined> {
        await ensureConnection();
        const card: any = await WebCaseStudyCardModel.findOne({ slug }).lean<any>();
        if (!card) return undefined;

        const detail = await WebCaseStudyDetailModel.findOne({ cardId: card._id }).lean<any>();

        return {
            card: card as WebCaseStudyCard,
            detail: (detail as WebCaseStudyDetail) ?? undefined,
        };
    },
} satisfies Pick<
    IStorage,
    | "createWebCaseStudyCard"
    | "updateWebCaseStudyCardBySlug"
    | "deleteWebCaseStudyCardBySlug"
    | "getWebCaseStudyCardBySlug"
    | "listWebCaseStudyCards"
    | "upsertWebCaseStudyDetail"
    | "getWebCaseStudyDetailByCardId"
    | "getWebCaseStudyCombinedBySlug"
>;
