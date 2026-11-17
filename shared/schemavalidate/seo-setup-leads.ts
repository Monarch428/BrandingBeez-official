import { z } from "zod";

export const seoSetupInquiryTypeEnum = z.enum([
  "seosetup",
  "medicalsetup",
]);

export const insertSeoSetupLeadSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  websiteUrl: z
    .string()
    .min(1, "Website URL is required")
    .url("Invalid website URL"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  inquiry_type: seoSetupInquiryTypeEnum.default("seosetup"),
});

export type InsertSeoSetupLead = z.infer<typeof insertSeoSetupLeadSchema>;

export interface SeoSetupLead extends InsertSeoSetupLead {
  id: number;
  createdAt: Date;
}