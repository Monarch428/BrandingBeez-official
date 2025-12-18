import mongoose, { Schema, Model, Types } from "mongoose";
import type { Document } from "mongoose";

// --------- Types ---------
export interface SeoCaseStudyHeroStat {
  value: string;
  label: string;
}

export interface SeoCaseStudyHighlight {
  iconKey: string;
  title: string;
  description: string;
  subtext?: string;
  colorClass?: string;
}

export interface SeoCaseStudyAboutStat {
  iconKey: string;
  label: string;
  value: string;
}

export interface SeoCaseStudyInitialChallenge {
  order: number;
  text: string;
}

export interface SeoCaseStudyIssue {
  issue: string;
  severity: "Critical" | "High" | "Medium";
  action: string;
  result: string;
}

export interface SeoCaseStudyKeywordRow {
  keyword: string;
  position: number;
  previousPosition: number;
  volume: string;
}

export interface SeoCaseStudyTool {
  iconKey: string;
  name: string;
  category: string;
  usage: string;
  colorClass?: string;
}

export interface SeoCaseStudyTestimonial {
  name: string;
  role: string;
  company: string;
  imageUrl: string;
  quote: string;
  rating: number;
}

export interface SeoCaseStudyContactPoint {
  month: string;
  submissions: number;
}

export interface SeoCaseStudyPerformanceMetric {
  label: string;
  value: string;
  change: string;
}

export interface SeoCaseStudyKeywordMetric {
  label: string;
  value: string;
  percentage: string;
}

// --------- Main Detail Type ---------
export interface SeoCaseStudyDetail {
  cardId: Types.ObjectId; // ✅ FK to SeoCaseStudyCard

  // Hero
  heroBadgeText: string;
  heroCaseStudyLabel: string;
  heroClientName: string;
  heroRatingText: string;
  heroHeadline: string;
  heroDescription: string;
  heroStats: SeoCaseStudyHeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  // Highlights
  highlightsTitle: string;
  highlightsSubtitle: string;
  highlights: SeoCaseStudyHighlight[];

  // CTA 1
  cta1Title: string;
  cta1Body: string;
  cta1PrimaryCtaText: string;
  cta1PrimaryCtaHref?: string;

  // About
  aboutBadgeText: string;
  aboutLogoUrl?: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutStats: SeoCaseStudyAboutStat[];
  initialChallengesTitle: string;
  initialChallenges: SeoCaseStudyInitialChallenge[];

  // Issues
  issuesSectionTitle: string;
  issuesSectionSubtitle: string;
  issues: SeoCaseStudyIssue[];

  // Keyword performance
  keywordPerformanceTitle: string;
  keywordPerformanceSubtitle: string;
  topKeywords: SeoCaseStudyKeywordRow[];

  // Tools
  toolsSectionTitle: string;
  toolsSectionSubtitle: string;
  tools: SeoCaseStudyTool[];

  // Testimonials + Metrics
  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  testimonials: SeoCaseStudyTestimonial[];
  contactData: SeoCaseStudyContactPoint[];
  performanceMetrics: SeoCaseStudyPerformanceMetric[];
  keywordMetrics: SeoCaseStudyKeywordMetric[];

  // CTA 2
  cta2Title: string;
  cta2Body: string;
  cta2PrimaryCtaText: string;
  cta2PrimaryCtaHref?: string;

  // Bottom CTA
  bottomCtaTitle: string;
  bottomCtaBody: string;
  bottomPrimaryCtaText: string;
  bottomPrimaryCtaHref?: string;
  bottomSecondaryCtaText: string;
  bottomSecondaryCtaHref?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface SeoCaseStudyDetailDocument extends Document, SeoCaseStudyDetail {}

// --------- Sub-schemas ---------
const heroStatSchema = new Schema<SeoCaseStudyHeroStat>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const highlightSchema = new Schema<SeoCaseStudyHighlight>(
  {
    iconKey: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    subtext: String,
    colorClass: String,
  },
  { _id: false }
);

const aboutStatSchema = new Schema<SeoCaseStudyAboutStat>(
  {
    iconKey: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const initialChallengeSchema = new Schema<SeoCaseStudyInitialChallenge>(
  {
    order: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const issueSchema = new Schema<SeoCaseStudyIssue>(
  {
    issue: { type: String, required: true },
    severity: {
      type: String,
      enum: ["Critical", "High", "Medium"],
      required: true,
    },
    action: { type: String, required: true },
    result: { type: String, required: true },
  },
  { _id: false }
);

const keywordRowSchema = new Schema<SeoCaseStudyKeywordRow>(
  {
    keyword: { type: String, required: true },
    position: { type: Number, required: true },
    previousPosition: { type: Number, required: true },
    volume: { type: String, required: true },
  },
  { _id: false }
);

const toolSchema = new Schema<SeoCaseStudyTool>(
  {
    iconKey: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    usage: { type: String, required: true },
    colorClass: String,
  },
  { _id: false }
);

const testimonialSchema = new Schema<SeoCaseStudyTestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    imageUrl: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { _id: false }
);

const contactPointSchema = new Schema<SeoCaseStudyContactPoint>(
  {
    month: { type: String, required: true },
    submissions: { type: Number, required: true },
  },
  { _id: false }
);

const performanceMetricSchema = new Schema<SeoCaseStudyPerformanceMetric>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    change: { type: String, required: true },
  },
  { _id: false }
);

const keywordMetricSchema = new Schema<SeoCaseStudyKeywordMetric>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    percentage: { type: String, required: true },
  },
  { _id: false }
);

// --------- Main Schema ---------
const seoCaseStudyDetailSchema = new Schema<SeoCaseStudyDetailDocument>(
  {
    // ✅ FK
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "SeoCaseStudyCard",
      required: true,
      unique: true, // ✅ one detail per card
      index: true,
    },

    // Hero
    heroBadgeText: { type: String, required: true },
    heroCaseStudyLabel: { type: String, required: true },
    heroClientName: { type: String, required: true },
    heroRatingText: { type: String, required: true },
    heroHeadline: { type: String, required: true },
    heroDescription: { type: String, required: true },
    heroStats: { type: [heroStatSchema], default: [] },
    heroPrimaryCtaText: { type: String, required: true },
    heroPrimaryCtaHref: String,
    heroVideoUrl: String,
    heroVideoPoster: String,
    heroVideoBadgeText: String,

    // Highlights
    highlightsTitle: { type: String, required: true },
    highlightsSubtitle: { type: String, required: true },
    highlights: { type: [highlightSchema], default: [] },

    // CTA 1
    cta1Title: { type: String, required: true },
    cta1Body: { type: String, required: true },
    cta1PrimaryCtaText: { type: String, required: true },
    cta1PrimaryCtaHref: String,

    // About
    aboutBadgeText: { type: String, required: true },
    aboutLogoUrl: String,
    aboutTitle: { type: String, required: true },
    aboutParagraph1: { type: String, required: true },
    aboutParagraph2: { type: String, required: true },
    aboutStats: { type: [aboutStatSchema], default: [] },
    initialChallengesTitle: { type: String, required: true },
    initialChallenges: { type: [initialChallengeSchema], default: [] },

    // Issues
    issuesSectionTitle: { type: String, required: true },
    issuesSectionSubtitle: { type: String, required: true },
    issues: { type: [issueSchema], default: [] },

    // Keyword performance
    keywordPerformanceTitle: { type: String, required: true },
    keywordPerformanceSubtitle: { type: String, required: true },
    topKeywords: { type: [keywordRowSchema], default: [] },

    // Tools
    toolsSectionTitle: { type: String, required: true },
    toolsSectionSubtitle: { type: String, required: true },
    tools: { type: [toolSchema], default: [] },

    // Testimonials + Metrics
    testimonialsSectionTitle: { type: String, required: true },
    testimonialsSectionSubtitle: { type: String, required: true },
    testimonials: { type: [testimonialSchema], default: [] },
    contactData: { type: [contactPointSchema], default: [] },
    performanceMetrics: { type: [performanceMetricSchema], default: [] },
    keywordMetrics: { type: [keywordMetricSchema], default: [] },

    // CTA 2
    cta2Title: { type: String, required: true },
    cta2Body: { type: String, required: true },
    cta2PrimaryCtaText: { type: String, required: true },
    cta2PrimaryCtaHref: String,

    // Bottom CTA
    bottomCtaTitle: { type: String, required: true },
    bottomCtaBody: { type: String, required: true },
    bottomPrimaryCtaText: { type: String, required: true },
    bottomPrimaryCtaHref: String,
    bottomSecondaryCtaText: { type: String, required: true },
    bottomSecondaryCtaHref: String,
  },
  {
    collection: "seo_case_study_details",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const SeoCaseStudyDetailModel: Model<SeoCaseStudyDetailDocument> =
  (mongoose.models.SeoCaseStudyDetail as Model<SeoCaseStudyDetailDocument>) ||
  mongoose.model<SeoCaseStudyDetailDocument>("SeoCaseStudyDetail", seoCaseStudyDetailSchema);
