import { z } from "zod";

// ----- Card -----

const drResultItemSchema = z.object({
    key: z.string().min(1),
    label: z.string().min(1),
    value: z.string().min(1),
    valueClass: z.string().optional(),
});

export const insertDedicatedResourceCaseStudyCardSchema = z.object({
    slug: z.string().min(1),

    title: z.string().min(1),
    description: z.string().min(1),

    client: z.string().min(1),
    industry: z.string().min(1),

    badgeText: z.string().optional(),
    badgeClass: z.string().optional(),

    logoUrl: z.string().optional(),
    logoAlt: z.string().optional(),

    categoryLabel: z.string().optional(),
    categoryClass: z.string().optional(),

    results: z.array(drResultItemSchema).default([]),

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

const teamMemberSchema = z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    imageUrl: z.string().optional(),
});

const miniStatSchema = z.object({
    value: z.string().min(1),
    label: z.string().min(1),
    colorClass: z.string().optional(),
});

const impactBulletSchema = z.object({
    iconKey: z.string().min(1),
    text: z.string().min(1),
});

const preMetricSchema = z.object({
    iconKey: z.string().min(1),
    label: z.string().min(1),
    value: z.string().min(1),
});

const evolutionFeatureSchema = z.object({
    iconKey: z.string().min(1),
    text: z.string().min(1),
});

const evolutionStepSchema = z.object({
    order: z.number(),
    numberText: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    colorClass: z.string().optional(),
    features: z.array(evolutionFeatureSchema).default([]),
});

const successFactorSchema = z.object({
    iconKey: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    gradientClass: z.string().optional(),
});

const beforeAfterRowSchema = z.object({
    keyMetric: z.string().min(1),
    before: z.string().min(1),
    after: z.string().min(1),
});

const testimonialSchema = z.object({
    quote: z.string().min(1),
    author: z.string().min(1),
    role: z.string().min(1),
    imageUrl: z.string().optional(),
    rating: z.number().optional(),
});

const videoTestimonialSchema = z.object({
    thumbnailUrl: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
});

export const insertDedicatedResourceCaseStudyDetailSchema = z.object({
    cardId: z.string().min(1), // FK from card _id

    heroBadgeText: z.string().min(1),
    heroTitle: z.string().min(1),
    heroRatingText: z.string().optional(),
    heroDescription: z.string().min(1),
    heroStats: z.array(heroStatSchema).default([]),
    heroPrimaryCtaText: z.string().min(1),
    heroPrimaryCtaHref: z.string().optional(),

    heroVideoUrl: z.string().optional(),
    heroVideoPoster: z.string().optional(),
    heroVideoBadgeText: z.string().optional(),

    heroClientName: z.string().min(1),
    heroClientIndustry: z.string().min(1),
    heroClientMeta: z.object({
        hqText: z.string().min(1),
        peopleText: z.string().min(1),
        specialtyText: z.string().min(1),
        logoUrl: z.string().optional(),
    }),

    teamTitle: z.string().min(1),
    teamSubtitle: z.string().min(1),
    teamBannerLeftText: z.string().min(1),
    teamBannerStatusText: z.string().min(1),
    teamMembers: z.array(teamMemberSchema).default([]),
    teamStats: z.array(miniStatSchema).default([]),

    challengeTitle: z.string().min(1),
    challengeBody: z.string().min(1),
    challengeImpactTitle: z.string().min(1),
    challengeImpactBullets: z.array(impactBulletSchema).default([]),

    prePartnershipTitle: z.string().min(1),
    prePartnershipMetrics: z.array(preMetricSchema).default([]),

    evolutionTitle: z.string().min(1),
    evolutionSubtitle: z.string().min(1),
    evolutionSteps: z.array(evolutionStepSchema).default([]),

    successFactorsTitle: z.string().min(1),
    successFactorsSubtitle: z.string().min(1),
    successFactors: z.array(successFactorSchema).default([]),

    beforeAfterTitle: z.string().min(1),
    beforeAfterSubtitle: z.string().min(1),
    beforeAfterRows: z.array(beforeAfterRowSchema).default([]),

    feedbackTitle: z.string().min(1),
    feedbackSubtitle: z.string().min(1),
    testimonials: z.array(testimonialSchema).default([]),
    videoTestimonial: videoTestimonialSchema.optional(),

    ctaPrimary: z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        primaryButtonText: z.string().min(1),
        primaryButtonHref: z.string().optional(),
        secondaryButtonText: z.string().optional(),
        secondaryButtonHref: z.string().optional(),
    }),

    ctaSecondary: z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        emailLabel: z.string().optional(),
        emailValue: z.string().optional(),
        phoneLabel: z.string().optional(),
        phoneValue: z.string().optional(),
        formTitle: z.string().optional(),
    }),
});
