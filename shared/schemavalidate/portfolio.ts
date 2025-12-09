// shared/schema/portfolio.ts
import { z } from "zod";

// Reusable metric stat schema (SEO / Google Ads)
const metricStatSchema = z.object({
    label: z.string().min(1),
    value: z.string().min(1),
});

// 🔥 SEO details Zod schema
const seoDetailsSchema = z.object({
    seoOverview: z.string().optional(),
    clientChallenge: z.string().optional(),
    primarySeoGoal: z.string().optional(),
    seoSummaryImage: z.string().optional(),
    seoFocusAreas: z.array(z.string()).optional(),
    seoStrategySummary: z.string().optional(),
    seoToolsUsed: z.array(z.string()).optional(),
    seoDeliverables: z.array(z.string()).optional(),
    stats: z.array(metricStatSchema).optional(),
});

// 🔥 Google Ads details Zod schema
const googleAdsDetailsSchema = z.object({
    googleAdsSummaryImage: z.string().optional(),
    industry: z.string().optional(),
    timeline: z.string().optional(),
    campaignOverview: z.string().optional(),
    googleAdsClientChallenge: z.string().optional(),
    primaryCampaignGoal: z.string().optional(),
    campaignType: z.string().optional(),
    platforms: z.array(z.string()).optional(),
    monthlyAdSpend: z.string().optional(),
    googleAdsStrategySummary: z.string().optional(),
    targetLocations: z.array(z.string()).optional(),
    trackingAndAnalytics: z.array(z.string()).optional(),
    stats: z.array(metricStatSchema).optional(),
});

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

    // 🔗 New link fields
    projectUrl: z.string().optional(),
    projectUrlLabel: z.string().optional(),

    // Key service selector
    serviceCategory: z.string().optional(),

    // 🔥 Nested case-study detail objects
    seoDetails: seoDetailsSchema.optional(),
    googleAdsDetails: googleAdsDetailsSchema.optional(),
});
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;

// TS interfaces for nested details (useful across backend & frontend if you share)
export type MetricStat = z.infer<typeof metricStatSchema>;
export type SeoDetails = z.infer<typeof seoDetailsSchema>;
export type GoogleAdsDetails = z.infer<typeof googleAdsDetailsSchema>;

export interface PortfolioItem extends InsertPortfolioItem {
    id: number;
    isFeatured: boolean;
    orderIndex: number;
    isActive: boolean;
    serviceCategory?: string;
    createdAt: Date;
    updatedAt: Date;

    projectUrl?: string;
    projectUrlLabel?: string;
    seoDetails?: SeoDetails;
    googleAdsDetails?: GoogleAdsDetails;
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
export type InsertPortfolioContent = z.infer<
    typeof insertPortfolioContentSchema
>;
export interface PortfolioContent extends InsertPortfolioContent {
    id: number;
    heroStats: z.infer<typeof heroStatSchema>[];
    testimonials: z.infer<typeof testimonialSchema>[];
    createdAt: Date;
    updatedAt: Date;
}