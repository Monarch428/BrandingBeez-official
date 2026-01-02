import { z } from "zod";

// ---------- SUB SCHEMAS ----------
const heroStatSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const highlightSchema = z.object({
  iconKey: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  subtext: z.string().optional(),
  colorClass: z.string().optional(),
});

const aboutStatSchema = z.object({
  iconKey: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
});

const initialChallengeSchema = z.object({
  order: z.number(),
  text: z.string().min(1),
});

const issueSchema = z.object({
  issue: z.string().min(1),
  severity: z.enum(["Critical", "High", "Medium"]),
  action: z.string().min(1),
  result: z.string().min(1),
});

const keywordRowSchema = z.object({
  keyword: z.string().min(1),
  position: z.number(),
  previousPosition: z.number(),
  volume: z.string().min(1),
});

const toolSchema = z.object({
  iconKey: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  usage: z.string().min(1),
  colorClass: z.string().optional(),
});

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  imageUrl: z.string().min(1),
  quote: z.string().min(1),
  rating: z.number(),
});

const contactPointSchema = z.object({
  month: z.string().min(1),
  submissions: z.number(),
});

const performanceMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  change: z.string().min(1),
});

const keywordMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  percentage: z.string().min(1),
});

// ---------- ✅ CARD SCHEMA ----------
export const insertSeoCaseStudyCardSchema = z.object({
  slug: z.string().min(1),

  cardTitle: z.string().min(1),
  cardClient: z.string().min(1),
  cardIndustry: z.string().min(1),
  cardDescription: z.string().min(1),

  cardResultsTraffic: z.string().min(1),
  cardResultsKeywords: z.string().min(1),
  cardResultsRevenue: z.string().min(1),

  cardCoverImageUrl: z.string().optional(),
  cardCoverImageAlt: z.string().optional(),
  cardCoverFit: z.enum(["contain", "cover"]).optional(),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});

const seoMetaSchema = z.object({
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

// ---------- ✅ DETAIL SCHEMA (FK required) ----------
export const insertSeoCaseStudyDetailSchema = z.object({
  cardId: z.string().min(1), // FK comes from card create response

  heroBadgeText: z.string().min(1),
  heroCaseStudyLabel: z.string().min(1),
  heroClientName: z.string().min(1),
  heroRatingText: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroDescription: z.string().min(1),
  heroStats: z.array(heroStatSchema).default([]),
  heroPrimaryCtaText: z.string().min(1),
  heroPrimaryCtaHref: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroVideoPoster: z.string().optional(),
  heroVideoBadgeText: z.string().optional(),

  highlightsTitle: z.string().min(1),
  highlightsSubtitle: z.string().min(1),
  highlights: z.array(highlightSchema).default([]),

  cta1Title: z.string().min(1),
  cta1Body: z.string().min(1),
  cta1PrimaryCtaText: z.string().min(1),
  cta1PrimaryCtaHref: z.string().optional(),

  aboutBadgeText: z.string().min(1),
  aboutLogoUrl: z.string().optional(),
  aboutTitle: z.string().min(1),
  aboutParagraph1: z.string().min(1),
  aboutParagraph2: z.string().min(1),
  aboutStats: z.array(aboutStatSchema).default([]),
  initialChallengesTitle: z.string().min(1),
  initialChallenges: z.array(initialChallengeSchema).default([]),

  issuesSectionTitle: z.string().min(1),
  issuesSectionSubtitle: z.string().min(1),
  issues: z.array(issueSchema).default([]),

  keywordPerformanceTitle: z.string().min(1),
  keywordPerformanceSubtitle: z.string().min(1),
  topKeywords: z.array(keywordRowSchema).default([]),

  toolsSectionTitle: z.string().min(1),
  toolsSectionSubtitle: z.string().min(1),
  tools: z.array(toolSchema).default([]),

  testimonialsSectionTitle: z.string().min(1),
  testimonialsSectionSubtitle: z.string().min(1),
  testimonials: z.array(testimonialSchema).default([]),
  contactData: z.array(contactPointSchema).default([]),
  performanceMetrics: z.array(performanceMetricSchema).default([]),
  keywordMetrics: z.array(keywordMetricSchema).default([]),

  cta2Title: z.string().min(1),
  cta2Body: z.string().min(1),
  cta2PrimaryCtaText: z.string().min(1),
  cta2PrimaryCtaHref: z.string().optional(),

  bottomCtaTitle: z.string().min(1),
  bottomCtaBody: z.string().min(1),
  bottomPrimaryCtaText: z.string().min(1),
  bottomPrimaryCtaHref: z.string().optional(),
  bottomSecondaryCtaText: z.string().min(1),
  bottomSecondaryCtaHref: z.string().optional(),

  seo: seoMetaSchema.optional(),
});
