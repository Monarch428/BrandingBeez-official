// src/server/storage-case-studies.ts
import type { CaseStudy, InsertCaseStudy } from "@shared/schema";

export interface CaseStudyStorage {
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]>;
  getAllCaseStudies(): Promise<CaseStudy[]>;
  updateCaseStudy(
    id: number,
    data: Partial<InsertCaseStudy>,
  ): Promise<CaseStudy>;
  deleteCaseStudy(id: number): Promise<void>;
}
