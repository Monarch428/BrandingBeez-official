import { stat } from "fs";
import { z } from "zod";

// ----- Card -----
const resultItemSchema = z.object({
    key: z.string().min(1),
    label: z.string().min(1),
    value: z.string().min(1),
    colorClass: z.string().optional(),
});

export const reorderWebCaseStudiesSchema = z.object({
    items: z
        .array(
            z.object({
                id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ObjectId"),
                order: z.number().int().min(0),
            })
        )
        .min(1),
});

export const insertWebCaseStudyCardSchema = z.object({
    slug: z.string().min(1),

    title: z.string().min(1),
    client: z.string().min(1),
    industry: z.string().min(1),
    description: z.string().min(1),

    results: z.object({
        performance: z.string().min(1),
        conversions: z.string().min(1),
        users: z.string().min(1).optional(),
    }),

    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
    imageFit: z.enum(["cover", "contain"]).optional(),

    link: z.string().optional(),
    order: z.number().int().min(0).optional().default(0),
    status: z.enum(["draft", "published"]).optional().default("draft"),
});

// ----- Detail -----
const heroStatSchema = z.object({
    value: z.string().min(1),
    label: z.string().min(1),
    iconKey: z.string().optional(),
});

const ctaSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    primaryText: z.string().min(1),
    primaryHref: z.string().optional(),
    secondaryText: z.string().optional(),
    secondaryHref: z.string().optional(),
});

const showcaseSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    body: z.string().optional(),

    liveUrl: z.string().optional(),
    liveButtonText: z.string().optional(),

    desktopImageUrl: z.string().optional(),
    desktopImageAlt: z.string().optional(),
    desktopImagePublicId: z.string().optional(),

    mobileImageUrl: z.string().optional(),
    mobileImageAlt: z.string().optional(),
    mobileImagePublicId: z.string().optional(),
});

const challengePointSchema = z.object({
    iconKey: z.string().min(1),
    text: z.string().min(1),
});

const beforeAfterItemSchema = z.object({
    label: z.string().min(1),
    value: z.string().min(1),
});

const beforeAfterSchema = z.object({
    beforeTitle: z.string().min(1),
    afterTitle: z.string().min(1),
    beforeItems: z.array(beforeAfterItemSchema).default([]),
    afterItems: z.array(beforeAfterItemSchema).default([]),
});

const overviewBulletSchema = z.object({
    iconKey: z.string().min(1),
    text: z.string().min(1),
});

const overviewColumnSchema = z.object({
    iconKey: z.string().min(1),
    title: z.string().min(1),
    dotColorClass: z.string().optional(),
    bullets: z.array(overviewBulletSchema).default([]),
});

const strategyBulletSchema = z.object({
    iconKey: z.string().min(1),
    text: z.string().min(1),
});

const strategyColumnSchema = z.object({
    order: z.number(),
    title: z.string().min(1),
    tagText: z.string().optional(),
    bullets: z.array(strategyBulletSchema).default([]),
});

const featureItemSchema = z.object({
    iconKey: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    color: z.string().optional(),
});

const evaluationCardSchema = z.object({
    iconKey: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
});

const testimonialSchema = z.object({
    quote: z.string().min(1),
    authorName: z.string().min(1),
    authorRole: z.string().optional(),
    ratingText: z.string().optional(),
});

const partnershipMetricSchema = z.object({
    iconKey: z.string().min(1),
    label: z.string().min(1),
    value: z.string().min(1),
});

export const insertWebCaseStudyDetailSchema = z.object({
    cardId: z.string().min(1),

    heroBadgeText: z.string().min(1),
    heroTitle: z.string().min(1),
    heroRatingText: z.string().optional(),
    heroDescription: z.string().min(1),
    heroStats: z.array(heroStatSchema).default([]),
    heroPrimaryCtaText: z.string().min(1),
    heroPrimaryCtaHref: z.string().optional(),
    heroSecondaryCtaText: z.string().optional(),
    heroSecondaryCtaHref: z.string().optional(),

    heroVideoUrl: z.string().optional(),
    heroVideoPoster: z.string().optional(),
    heroVideoBadgeText: z.string().optional(),

    showcase: showcaseSchema,

    ctaTop: ctaSchema,

    challengeTitle: z.string().min(1),
    challengeSubtitle: z.string().min(1),
    challengePoints: z.array(challengePointSchema).default([]),
    beforeAfter: beforeAfterSchema,

    overviewTitle: z.string().min(1),
    overviewSubtitle: z.string().optional(),
    overviewColumns: z.array(overviewColumnSchema).default([]),

    strategyTitle: z.string().min(1),
    strategySubtitle: z.string().optional(),
    strategyColumns: z.array(strategyColumnSchema).default([]),

    featuresTitle: z.string().min(1),
    featuresSubtitle: z.string().optional(),
    coreFeaturesTitle: z.string().optional(),
    coreFeatures: z.array(featureItemSchema).default([]),
    technicalExcellenceTitle: z.string().optional(),
    technicalExcellence: z.array(featureItemSchema).default([]),

    ctaMid: ctaSchema,

    evaluationKicker: z.string().optional(),
    evaluationTitle: z.string().min(1),
    evaluationCards: z.array(evaluationCardSchema).default([]),

    feedbackKicker: z.string().optional(),
    testimonial: testimonialSchema,
    partnershipMetricsTitle: z.string().optional(),
    partnershipMetrics: z.array(partnershipMetricSchema).default([]),
    feedbackPrimaryCtaText: z.string().optional(),
    feedbackPrimaryCtaHref: z.string().optional(),

    finalCta: ctaSchema,
});
