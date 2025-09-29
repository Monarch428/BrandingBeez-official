import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  inquiry_type: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  preferred_contact: text("preferred_contact").notNull(),
  agencyName: text("agency_name"),
  country: text("country").notNull(),
  topPriority: text("top_priority").notNull(),
  couponCode: text("coupon_code"),
  // Service Selection Details
  servicesSelected: jsonb("services_selected"), // Array of selected services
  budget: text("budget"), // Budget range selected
  timeline: text("timeline"), // Project timeline
  referralSource: text("referral_source"), // How they found us
  // Service-specific details stored as JSON
  serviceDetails: jsonb("service_details"), // Detailed selections for each service
  automationDetails: jsonb("automation_details"), // Automation calculator results
  dedicatedResourceDetails: jsonb("dedicated_resource_details"), // Team builder selections
  websiteDetails: jsonb("website_details"), // Website development specifics
  contactFormType: varchar("contact_form_type", { length: 100 }).default(
    "contact-form",
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  maxUses: integer("max_uses").default(1),
  currentUses: integer("current_uses").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const couponUsage = pgTable("coupon_usage", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(() => coupons.id),
  email: text("email").notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  company: text("company"),
  phone: text("phone"),
  website: text("website"),
  status: text("status").default("pending"),
  region: text("region").default("US"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoAudits = pgTable("seo_audits", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  websiteUrl: text("website_url").notNull(),
  auditData: jsonb("audit_data"),
  score: integer("score"),
  status: text("status").default("pending"),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  messages: jsonb("messages").default([]),
  clientInfo: jsonb("client_info"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content Management Tables
export const featuredClients = pgTable("featured_clients", {
  id: serial("id").primaryKey(),
  servicePage: varchar("service_page", { length: 100 }).notNull(), // 'seo', 'web-development', etc.
  name: varchar("name", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 500 }),
  website: varchar("website", { length: 500 }),
  description: text("description").notNull(),
  achievements: jsonb("achievements").notNull(), // array of strings
  industry: varchar("industry", { length: 100 }).notNull(),
  timeframe: varchar("timeframe", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  servicePage: varchar("service_page", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  client: varchar("client", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  results: jsonb("results").notNull(), // object with metrics
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pricingPackages = pgTable("pricing_packages", {
  id: serial("id").primaryKey(),
  servicePage: varchar("service_page", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: varchar("price", { length: 100 }).notNull(),
  description: text("description"),
  features: jsonb("features").notNull(), // array of strings
  isPopular: boolean("is_popular").default(false),
  orderIndex: integer("order_index").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const servicePages = pgTable("service_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).unique().notNull(), // 'seo', 'web-development', etc.
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),
  heroTitle: varchar("hero_title", { length: 255 }),
  heroSubtitle: varchar("hero_subtitle", { length: 500 }),
  auditFormType: varchar("audit_form_type", { length: 50 }), // 'seo', 'website', 'ads', 'calculator', 'automation'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dedicated Resources Leads table
export const dedicatedResourcesLeads = pgTable("dedicated_resources_leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  resourceType: varchar("resource_type", { length: 100 }).notNull(),
  hiringLevel: varchar("hiring_level", { length: 100 }),
  multipleResources: jsonb("multiple_resources"), // For multiple resource selections
  additionalNotes: text("additional_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  tags: jsonb("tags"), // array of strings
  author: varchar("author", { length: 100 }).default("BrandingBeez Team"),
  readTime: integer("read_time").default(5), // in minutes
  isPublished: boolean("is_published").default(true),
  isFeatured: boolean("is_featured").default(false),
  metaDescription: text("meta_description"),
  metaTitle: varchar("meta_title", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts, {
  servicesSelected: z.array(z.string()).optional(),
  serviceDetails: z.any().optional(),
  automationDetails: z.any().optional(),
  dedicatedResourceDetails: z.any().optional(),
  websiteDetails: z.any().optional(),
}).pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  inquiry_type: true,
  message: true,
  preferred_contact: true,
  agencyName: true,
  country: true,
  topPriority: true,
  couponCode: true,
  servicesSelected: true,
  budget: true,
  timeline: true,
  referralSource: true,
  serviceDetails: true,
  automationDetails: true,
  dedicatedResourceDetails: true,
  websiteDetails: true,
});

export const insertCouponSchema = createInsertSchema(coupons).pick({
  code: true,
  description: true,
  discountPercentage: true,
  maxUses: true,
  isActive: true,
  expiresAt: true,
});

export const insertCouponUsageSchema = createInsertSchema(couponUsage).pick({
  couponId: true,
  email: true,
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  email: true,
  company: true,
  phone: true,
  website: true,
  region: true,
});

export const insertSeoAuditSchema = createInsertSchema(seoAudits).pick({
  websiteUrl: true,
  clientId: true,
  status: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  sessionId: true,
  clientInfo: true,
});

export const insertFeaturedClientSchema = createInsertSchema(
  featuredClients,
).pick({
  servicePage: true,
  name: true,
  logo: true,
  website: true,
  description: true,
  achievements: true,
  industry: true,
  timeframe: true,
  isActive: true,
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).pick({
  servicePage: true,
  title: true,
  client: true,
  industry: true,
  results: true,
  description: true,
  imageUrl: true,
  isActive: true,
});

export const insertPricingPackageSchema = createInsertSchema(
  pricingPackages,
).pick({
  servicePage: true,
  name: true,
  price: true,
  description: true,
  features: true,
  isPopular: true,
  orderIndex: true,
  isActive: true,
});

export const insertServicePageSchema = createInsertSchema(servicePages).pick({
  slug: true,
  title: true,
  subtitle: true,
  description: true,
  heroTitle: true,
  heroSubtitle: true,
  auditFormType: true,
  isActive: true,
});

export const insertDedicatedResourcesLeadSchema = createInsertSchema(
  dedicatedResourcesLeads,
).pick({
  fullName: true,
  email: true,
  resourceType: true,
  hiringLevel: true,
  multipleResources: true,
  additionalNotes: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  tags: z.array(z.string()).optional(),
}).pick({
  slug: true,
  title: true,
  subtitle: true,
  excerpt: true,
  content: true,
  imageUrl: true,
  tags: true,
  author: true,
  readTime: true,
  isPublished: true,
  isFeatured: true,
  metaDescription: true,
  metaTitle: true,
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertSeoAudit = z.infer<typeof insertSeoAuditSchema>;
export type SeoAudit = typeof seoAudits.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertFeaturedClient = z.infer<typeof insertFeaturedClientSchema>;
export type FeaturedClient = typeof featuredClients.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertPricingPackage = z.infer<typeof insertPricingPackageSchema>;
export type PricingPackage = typeof pricingPackages.$inferSelect;
export type InsertServicePage = z.infer<typeof insertServicePageSchema>;
export type ServicePage = typeof servicePages.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;
export type CouponUsage = typeof couponUsage.$inferSelect;
export type InsertDedicatedResourcesLead = z.infer<
  typeof insertDedicatedResourcesLeadSchema
>;
export type DedicatedResourcesLead =
  typeof dedicatedResourcesLeads.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
