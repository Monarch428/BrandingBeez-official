import mongoose, { Schema, Model } from "mongoose";
import type { Document, Types } from "mongoose";

export type WebHeroStat = { value: string; label: string; iconKey?: string };

export type WebShowcase = {
    title: string;
    subtitle?: string;
    body?: string;

    liveUrl?: string;
    liveButtonText?: string;

    desktopImageUrl?: string;
    desktopImageAlt?: string;
    desktopImagePublicId?: string;

    mobileImageUrl?: string;
    mobileImageAlt?: string;
    mobileImagePublicId?: string;
};

export type WebCtaBlock = {
    title: string;
    body: string;
    primaryText: string;
    primaryHref?: string;
    secondaryText?: string;
    secondaryHref?: string;
};

export type WebChallengePoint = { iconKey: string; text: string };

export type WebBeforeAfterItem = { label: string; value: string };
export type WebBeforeAfterBlock = {
    beforeTitle: string;
    afterTitle: string;
    beforeItems: WebBeforeAfterItem[];
    afterItems: WebBeforeAfterItem[];
};

export type WebOverviewColumn = {
    iconKey: string;        // e.g. Building, Target, Handshake
    title: string;          // Client Profile / Project Goals / Partnership Impact
    dotColorClass?: string; // optional UI hint
    bullets: { iconKey: string; text: string }[];
};

export type WebStrategyColumn = {
    order: number;          // 1,2,3
    title: string;          // Professional Design / Service Showcase / Lead Capture System
    tagText?: string;       // Visual Excellence / Content Strategy / Lead Generation
    bullets: { iconKey: string; text: string }[];
};

export type WebFeatureItem = {
    iconKey: string;        // Palette, Smartphone...
    title: string;
    description: string;
    color?: string;         // like your current design uses '#ee4962' / '#321a66'
};

export type WebEvaluationCard = {
    iconKey: string;        // CheckCircle / TrendingUp / Users
    title: string;
    description: string;
};

export type WebTestimonial = {
    quote: string;
    authorName: string;
    authorRole?: string;
    ratingText?: string;
};

export type WebPartnershipMetric = { iconKey: string; label: string; value: string };

export interface WebCaseStudyDetail {
    cardId: Types.ObjectId | string;

    // HERO
    heroBadgeText: string;
    heroTitle: string;
    heroRatingText?: string;
    heroDescription: string;
    heroStats: WebHeroStat[];
    heroPrimaryCtaText: string;
    heroPrimaryCtaHref?: string;
    heroSecondaryCtaText?: string;
    heroSecondaryCtaHref?: string;

    // optional video (if later you want like PPC)
    heroVideoUrl?: string;
    heroVideoPoster?: string;
    heroVideoBadgeText?: string;

    // WEBSITE SHOWCASE
    showcase: WebShowcase;

    // CTA 1 (CallToActionFirst)
    ctaTop: WebCtaBlock;

    // THE CHALLENGE
    challengeTitle: string;
    challengeSubtitle: string;
    challengePoints: WebChallengePoint[];
    beforeAfter: WebBeforeAfterBlock;

    // PROJECT OVERVIEW (3 columns)
    overviewTitle: string;
    overviewSubtitle?: string;
    overviewColumns: WebOverviewColumn[];

    // WEBSITE DEVELOPMENT STRATEGY (3 columns)
    strategyTitle: string;
    strategySubtitle?: string;
    strategyColumns: WebStrategyColumn[];

    // FEATURES
    featuresTitle: string;
    featuresSubtitle?: string;
    coreFeaturesTitle?: string;
    coreFeatures: WebFeatureItem[];
    technicalExcellenceTitle?: string;
    technicalExcellence: WebFeatureItem[];

    // CTA 2 (CallToAction)
    ctaMid: WebCtaBlock;

    // PARTNERSHIP EVALUATION
    evaluationKicker?: string; // "What makes this partnership successful?"
    evaluationTitle: string;
    evaluationCards: WebEvaluationCard[];

    // CLIENT FEEDBACK
    feedbackKicker?: string; // "What Our Clients Say"
    testimonial: WebTestimonial;
    partnershipMetricsTitle?: string;
    partnershipMetrics: WebPartnershipMetric[];
    feedbackPrimaryCtaText?: string;
    feedbackPrimaryCtaHref?: string;

    // FINAL CTA
    finalCta: WebCtaBlock;

    createdAt: Date;
    updatedAt: Date;
}

export interface WebCaseStudyDetailDocument extends Document, WebCaseStudyDetail { }

const heroStatSchema = new Schema<WebHeroStat>(
    { value: String, label: String, iconKey: String },
    { _id: false }
);

const showcaseSchema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: String,
        body: String,

        liveUrl: String,
        liveButtonText: String,

        desktopImageUrl: String,
        desktopImageAlt: String,
        desktopImagePublicId: String,

        mobileImageUrl: String,
        mobileImageAlt: String,
        mobileImagePublicId: String,
    },
    { _id: false }
);

const ctaSchema = new Schema<WebCtaBlock>(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        primaryText: { type: String, required: true },
        primaryHref: String,
        secondaryText: String,
        secondaryHref: String,
    },
    { _id: false }
);

const challengePointSchema = new Schema<WebChallengePoint>(
    { iconKey: { type: String, required: true }, text: { type: String, required: true } },
    { _id: false }
);

const beforeAfterItemSchema = new Schema<WebBeforeAfterItem>(
    { label: { type: String, required: true }, value: { type: String, required: true } },
    { _id: false }
);

const beforeAfterSchema = new Schema<WebBeforeAfterBlock>(
    {
        beforeTitle: { type: String, required: true },
        afterTitle: { type: String, required: true },
        beforeItems: { type: [beforeAfterItemSchema], default: [] },
        afterItems: { type: [beforeAfterItemSchema], default: [] },
    },
    { _id: false }
);

const overviewBulletSchema = new Schema<{ iconKey: string; text: string }>(
    { iconKey: { type: String, required: true }, text: { type: String, required: true } },
    { _id: false }
);

const overviewColumnSchema = new Schema<WebOverviewColumn>(
    {
        iconKey: { type: String, required: true },
        title: { type: String, required: true },
        dotColorClass: String,
        bullets: { type: [overviewBulletSchema], default: [] },
    },
    { _id: false }
);

const strategyBulletSchema = new Schema<{ iconKey: string; text: string }>(
    { iconKey: { type: String, required: true }, text: { type: String, required: true } },
    { _id: false }
);

const strategyColumnSchema = new Schema<WebStrategyColumn>(
    {
        order: { type: Number, required: true },
        title: { type: String, required: true },
        tagText: String,
        bullets: { type: [strategyBulletSchema], default: [] },
    },
    { _id: false }
);

const featureItemSchema = new Schema<WebFeatureItem>(
    {
        iconKey: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        color: String,
    },
    { _id: false }
);

const evaluationCardSchema = new Schema<WebEvaluationCard>(
    {
        iconKey: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false }
);

const testimonialSchema = new Schema<WebTestimonial>(
    {
        quote: { type: String, required: true },
        authorName: { type: String, required: true },
        authorRole: String,
        ratingText: String,
    },
    { _id: false }
);

const partnershipMetricSchema = new Schema<WebPartnershipMetric>(
    {
        iconKey: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String, required: true },
    },
    { _id: false }
);

const webCaseStudyDetailSchema = new Schema<WebCaseStudyDetailDocument>(
    {
        cardId: { type: Schema.Types.ObjectId, required: true, index: true },

        heroBadgeText: { type: String, required: true },
        heroTitle: { type: String, required: true },
        heroRatingText: String,
        heroDescription: { type: String, required: true },
        heroStats: { type: [heroStatSchema], default: [] },
        heroPrimaryCtaText: { type: String, required: true },
        heroPrimaryCtaHref: String,
        heroSecondaryCtaText: String,
        heroSecondaryCtaHref: String,

        heroVideoUrl: String,
        heroVideoPoster: String,
        heroVideoBadgeText: String,

        showcase: { type: showcaseSchema, required: true },

        ctaTop: { type: ctaSchema, required: true },

        challengeTitle: { type: String, required: true },
        challengeSubtitle: { type: String, required: true },
        challengePoints: { type: [challengePointSchema], default: [] },
        beforeAfter: { type: beforeAfterSchema, required: true },

        overviewTitle: { type: String, required: true },
        overviewSubtitle: String,
        overviewColumns: { type: [overviewColumnSchema], default: [] },

        strategyTitle: { type: String, required: true },
        strategySubtitle: String,
        strategyColumns: { type: [strategyColumnSchema], default: [] },

        featuresTitle: { type: String, required: true },
        featuresSubtitle: String,
        coreFeaturesTitle: String,
        coreFeatures: { type: [featureItemSchema], default: [] },
        technicalExcellenceTitle: String,
        technicalExcellence: { type: [featureItemSchema], default: [] },

        ctaMid: { type: ctaSchema, required: true },

        evaluationKicker: String,
        evaluationTitle: { type: String, required: true },
        evaluationCards: { type: [evaluationCardSchema], default: [] },

        feedbackKicker: String,
        testimonial: { type: testimonialSchema, required: true },
        partnershipMetricsTitle: String,
        partnershipMetrics: { type: [partnershipMetricSchema], default: [] },
        feedbackPrimaryCtaText: String,
        feedbackPrimaryCtaHref: String,

        finalCta: { type: ctaSchema, required: true },
    },
    {
        collection: "web_case_study_details",
        versionKey: false,
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    }
);

export const WebCaseStudyDetailModel: Model<WebCaseStudyDetailDocument> =
    (mongoose.models.WebCaseStudyDetail as Model<WebCaseStudyDetailDocument>) ||
    mongoose.model<WebCaseStudyDetailDocument>("WebCaseStudyDetail", webCaseStudyDetailSchema);
