// src/server/db-case-studies.ts
import type { IStorage } from "../storage";
import type { CaseStudy, InsertCaseStudy } from "@shared/schema";
import { CaseStudyModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const caseStudyStorage = {
  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    await ensureConnection();
    const id = await getNextSequence("case_studies");
    const created = await CaseStudyModel.create({ id, ...caseStudy });
    return toPlain<CaseStudy>(created);
  },

  async getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]> {
    await ensureConnection();
    const studies = await CaseStudyModel.find({
      servicePage,
      isActive: true,
    }).lean<CaseStudy[]>();
    return studies;
  },

  async getAllCaseStudies(): Promise<CaseStudy[]> {
    await ensureConnection();
    const studies = await CaseStudyModel.find({ isActive: true }).lean<CaseStudy[]>();
    return studies;
  },

  async updateCaseStudy(
    id: number,
    data: Partial<InsertCaseStudy>,
  ): Promise<CaseStudy> {
    await ensureConnection();
    const updated = await CaseStudyModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<CaseStudy>();

    if (!updated) {
      throw new Error("Case study not found");
    }
    return updated;
  },

  async deleteCaseStudy(id: number): Promise<void> {
    await ensureConnection();
    await CaseStudyModel.deleteOne({ id });
  },
} satisfies Pick<
  IStorage,
  | "createCaseStudy"
  | "getCaseStudiesByService"
  | "getAllCaseStudies"
  | "updateCaseStudy"
  | "deleteCaseStudy"
>;
