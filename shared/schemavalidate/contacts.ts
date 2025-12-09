// shared/schema/contacts.ts
import { z } from "zod";
import { jsonValueSchema } from "./json";

export const insertContactSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    inquiry_type: z.string().min(1, "Inquiry type is required"),
    message: z.string().min(1, "Message is required"),
    preferred_contact: z.string().min(1, "Preferred contact is required"),
    agencyName: z.string().optional().nullable(),
    country: z.string().min(1, "Country is required"),
    topPriority: z.string().min(1, "Top priority is required"),
    couponCode: z.string().optional().nullable(),
    servicesSelected: z.array(z.string()).optional().nullable(),
    service: z.string().optional().nullable(),
    budget: z.string().optional().nullable(),
    timeline: z.string().optional().nullable(),
    referralSource: z.string().optional().nullable(),
    serviceDetails: jsonValueSchema.optional(),
    automationDetails: jsonValueSchema.optional(),
    dedicatedResourceDetails: jsonValueSchema.optional(),
    websiteDetails: jsonValueSchema.optional(),
    contactFormType: z.string().optional().nullable(),
  })
  .passthrough(); // Allow additional fields

export type InsertContact = z.infer<typeof insertContactSchema>;

export interface Contact extends InsertContact {
  id: number;
  createdAt: Date;
  contactFormType: string;
}
