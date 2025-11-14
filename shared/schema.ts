import { z } from "zod";

const jsonValueSchema: z.ZodType<unknown> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.lazy(() => jsonValueSchema)),
  z.record(z.lazy(() => jsonValueSchema)),
]);

// Users
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export interface User extends InsertUser {
  id: number;
}

// Contacts
export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  inquiry_type: z.string().min(1),
  message: z.string().min(1),
  preferred_contact: z.string().min(1),
  agencyName: z.string().optional(),
  country: z.string().min(1),
  topPriority: z.string().min(1),
  couponCode: z.string().optional(),
  servicesSelected: z.array(z.string()).optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  referralSource: z.string().optional(),
  serviceDetails: jsonValueSchema.optional(),
  automationDetails: jsonValueSchema.optional(),
  dedicatedResourceDetails: jsonValueSchema.optional(),
  websiteDetails: jsonValueSchema.optional(),
  contactFormType: z.string().optional(),
});
export type InsertContact = z.infer<typeof insertContactSchema>;
export interface Contact extends InsertContact {
  id: number;
  createdAt: Date;
  contactFormType: string;
}

// Clients
export const insertClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  region: z.string().optional(),
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export interface Client extends InsertClient {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// SEO Audits
export const insertSeoAuditSchema = z.object({
  websiteUrl: z.string().min(1),
  clientId: z.number().int(),
  status: z.string().optional(),
});
export type InsertSeoAudit = z.infer<typeof insertSeoAuditSchema>;
export interface SeoAudit {
  id: number;
  clientId: number;
  websiteUrl: string;
  auditData?: unknown;
  score?: number | null;
  status: string;
  recommendations?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
}

// Chat Sessions
export const insertChatSessionSchema = z.object({
  sessionId: z.string().min(1),
  clientInfo: jsonValueSchema.optional(),
});
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export interface ChatSession extends InsertChatSession {
  id: number;
  messages: unknown[];
  recommendations?: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

// Featured Clients
export const insertFeaturedClientSchema = z.object({
  servicePage: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().optional(),
  website: z.string().optional(),
  description: z.string().min(1),
  achievements: z.array(z.string()),
  industry: z.string().min(1),
  timeframe: z.string().min(1),
  isActive: z.boolean().optional(),
});
export type InsertFeaturedClient = z.infer<typeof insertFeaturedClientSchema>;
export interface FeaturedClient extends InsertFeaturedClient {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Case Studies
export const insertCaseStudySchema = z.object({
  servicePage: z.string().min(1),
  title: z.string().min(1),
  client: z.string().min(1),
  industry: z.string().min(1),
  results: jsonValueSchema,
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export interface CaseStudy extends InsertCaseStudy {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const insertPortfolioItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  industry: z.string().min(1),
  client: z.string().optional(),
  badge: z.string().optional(),
  investment: z.string().optional(),
  totalValue: z.string().optional(),
  roi: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  imageUrl: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  orderIndex: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export interface PortfolioItem extends InsertPortfolioItem {
  id: number;
  isFeatured: boolean;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroStatSchema = z.object({
  kpi: z.string().min(1),
  label: z.string().min(1),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  who: z.string().min(1),
  tag: z.string().optional(),
});

export const insertPortfolioContentSchema = z.object({
  heroTitle: z.string().min(1),
  heroHighlight: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroStats: z.array(heroStatSchema).optional(),
  heroPrimaryCtaText: z.string().optional(),
  heroPrimaryCtaHref: z.string().optional(),
  heroSecondaryCtaText: z.string().optional(),
  heroSecondaryCtaHref: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  testimonialsSubtitle: z.string().optional(),
  testimonials: z.array(testimonialSchema).optional(),
});
export type InsertPortfolioContent = z.infer<typeof insertPortfolioContentSchema>;
export interface PortfolioContent extends InsertPortfolioContent {
  id: number;
  heroStats: z.infer<typeof heroStatSchema>[];
  testimonials: z.infer<typeof testimonialSchema>[];
  createdAt: Date;
  updatedAt: Date;
}

// Pricing Packages
export const insertPricingPackageSchema = z.object({
  servicePage: z.string().min(1),
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()),
  isPopular: z.boolean().optional(),
  orderIndex: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type InsertPricingPackage = z.infer<typeof insertPricingPackageSchema>;
export interface PricingPackage extends InsertPricingPackage {
  id: number;
  isPopular: boolean;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service Pages
export const insertServicePageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  auditFormType: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type InsertServicePage = z.infer<typeof insertServicePageSchema>;
export interface ServicePage extends InsertServicePage {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Coupons
export const insertCouponSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  discountPercentage: z.number().int().min(0),
  maxUses: z.number().int().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().optional(),
});
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export interface Coupon extends Omit<InsertCoupon, "expiresAt"> {
  id: number;
  maxUses: number | null;
  currentUses: number;
  expiresAt?: Date | null;
  createdAt: Date;
}

// Coupon Usage
export const insertCouponUsageSchema = z.object({
  couponId: z.number().int(),
  email: z.string().email(),
});
export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;
export interface CouponUsage extends InsertCouponUsage {
  id: number;
  usedAt: Date;
}

// Dedicated Resources Leads
export const insertDedicatedResourcesLeadSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  resourceType: z.string().min(1),
  hiringLevel: z.string().optional(),
  multipleResources: jsonValueSchema.optional(),
  additionalNotes: z.string().optional(),
});
export type InsertDedicatedResourcesLead = z.infer<
  typeof insertDedicatedResourcesLeadSchema
>;
export interface DedicatedResourcesLead
  extends InsertDedicatedResourcesLead {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Posts
export const insertBlogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  readTime: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaDescription: z.string().optional(),
  metaTitle: z.string().optional(),
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export interface BlogPost extends InsertBlogPost {
  id: number;
  tags?: string[];
  author: string;
  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter Subscribers
export const insertNewsletterSubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});
export type InsertNewsletterSubscriber = z.infer<
  typeof insertNewsletterSubscriberSchema
>;
export interface NewsletterSubscriber extends InsertNewsletterSubscriber {
  id: number;
  subscribedAt: Date;
}
