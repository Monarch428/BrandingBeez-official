import { z } from "zod";

// ----- Card -----
const resultItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  colorClass: z.string().optional(),
});

export const insertPpcCaseStudyCardSchema = z.object({
  slug: z.string().min(1),

  title: z.string().min(1),
  client: z.string().min(1),
  industry: z.string().min(1),
  description: z.string().min(1),

  results: z.array(resultItemSchema).default([]),

  coverImageUrl: z.string().optional(),
  coverImageAlt: z.string().optional(),
  coverFit: z.enum(["contain", "cover"]).optional(),
});

// ----- Detail -----
const heroStatSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  iconKey: z.string().optional(),
});

const infoCardSchema = z.object({
  iconKey: z.string().min(1),
  title: z.string().min(1),
  value: z.string().min(1),
  href: z.string().optional(),
  colorClass: z.string().optional(),
});

const sectionCardSchema = z.object({
  iconKey: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  colorClass: z.string().optional(),
});

const bulletSectionSchema = z.object({
  iconKey: z.string().min(1),
  title: z.string().min(1),
  bullets: z.array(z.string().min(1)).default([]),
  colorClass: z.string().optional(),
});

const dashboardStatSchema = z.object({
  iconKey: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
});

const highlightMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  subtext: z.string().optional(),
});

const outstandingCardSchema = z.object({
  iconKey: z.string().min(1),
  value: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  colorClass: z.string().optional(),
});

const timelineStepSchema = z.object({
  order: z.number(),
  badgeText: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  colorClass: z.string().optional(),
});

const processStepSchema = z.object({
  order: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
});

const ppcSeoMetaSchema = z.object({
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const insertPpcCaseStudyDetailSchema = z.object({
  cardId: z.string().min(1), // FK from card _id

  heroBadgeText: z.string().min(1),
  heroClientName: z.string().min(1),
  heroRatingText: z.string().optional(),
  heroDescription: z.string().min(1),
  heroStats: z.array(heroStatSchema).default([]),
  heroPrimaryCtaText: z.string().min(1),
  heroPrimaryCtaHref: z.string().optional(),

  heroVideoUrl: z.string().optional(),
  heroVideoPoster: z.string().optional(),
  heroVideoBadgeText: z.string().optional(),

  clientProfileTitle: z.string().min(1),
  clientProfileSubtitle: z.string().min(1),
  clientProfileCards: z.array(infoCardSchema).default([]),

  challengeTitle: z.string().min(1),
  challengeSubtitle: z.string().min(1),
  challengeCards: z.array(sectionCardSchema).default([]),

  approachTitle: z.string().min(1),
  approachSubtitle: z.string().min(1),
  approachSections: z.array(bulletSectionSchema).default([]),

  dashboardTitle: z.string().min(1),
  dashboardSubtitle: z.string().min(1),
  dashboardStats: z.array(dashboardStatSchema).default([]),
  dashboardHighlight: highlightMetricSchema,

  outstandingTitle: z.string().min(1),
  outstandingSubtitle: z.string().min(1),
  outstandingCards: z.array(outstandingCardSchema).default([]),

  timelineTitle: z.string().min(1),
  timelineSteps: z.array(timelineStepSchema).default([]),

  processTitle: z.string().min(1),
  processSubtitle: z.string().min(1),
  processSteps: z.array(processStepSchema).default([]),

  midCtaTitle: z.string().min(1),
  midCtaBody: z.string().min(1),
  midPrimaryCtaText: z.string().min(1),
  midPrimaryCtaHref: z.string().optional(),
  midSecondaryCtaText: z.string().optional(),
  midSecondaryCtaHref: z.string().optional(),

  bottomCtaTitle: z.string().min(1),
  bottomCtaBody: z.string().min(1),
  bottomPrimaryCtaText: z.string().min(1),
  bottomPrimaryCtaHref: z.string().optional(),
  bottomSecondaryCtaText: z.string().optional(),
  bottomSecondaryCtaHref: z.string().optional(),

  seo: ppcSeoMetaSchema.optional(),
});
