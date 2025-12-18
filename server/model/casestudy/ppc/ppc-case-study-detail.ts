import mongoose, { Schema, Model, Types } from "mongoose";
import type { Document } from "mongoose";

// ---------- Sub types ----------
export interface PpcHeroStat {
  value: string;
  label: string;
  iconKey?: string;
}

export interface PpcInfoCard {
  iconKey: string;
  title: string;
  value: string;
  href?: string;
  colorClass?: string;
}

export interface PpcSectionCard {
  iconKey: string;
  title: string;
  description: string;
  colorClass?: string;
}

export interface PpcBulletSection {
  iconKey: string;
  title: string;
  bullets: string[];
  colorClass?: string;
}

export interface PpcDashboardStat {
  iconKey: string;
  label: string;
  value: string;
}

export interface PpcHighlightMetric {
  label: string;
  value: string;
  subtext?: string;
}

export interface PpcOutstandingResultCard {
  iconKey: string;
  value: string;
  title: string;
  description: string;
  colorClass?: string;
}

export interface PpcTimelineStep {
  order: number;
  badgeText: string; // "Month 1-2"
  title: string;
  description: string;
  colorClass?: string;
}

export interface PpcProcessStep {
  order: number;
  title: string;
  description: string;
}

// ---------- Main ----------
export interface PpcCaseStudyDetail {
  cardId: Types.ObjectId; // ✅ FK to PpcCaseStudyCard

  // Hero
  heroBadgeText: string;               // "Featured Google Ads Success Story"
  heroClientName: string;              // "Arlingsworth Solicitors"
  heroRatingText?: string;             // "⭐⭐⭐⭐⭐ Rated 4.9 | ..."
  heroDescription: string;
  heroStats: PpcHeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  // Client Profile
  clientProfileTitle: string;
  clientProfileSubtitle: string;
  clientProfileCards: PpcInfoCard[];

  // Challenge
  challengeTitle: string;
  challengeSubtitle: string;
  challengeCards: PpcSectionCard[];

  // Strategic Approach
  approachTitle: string;
  approachSubtitle: string;
  approachSections: PpcBulletSection[];

  // Dashboard section
  dashboardTitle: string;
  dashboardSubtitle: string;
  dashboardStats: PpcDashboardStat[];
  dashboardHighlight: PpcHighlightMetric; // CPA highlight etc.

  // Outstanding results
  outstandingTitle: string;
  outstandingSubtitle: string;
  outstandingCards: PpcOutstandingResultCard[];

  // Timeline
  timelineTitle: string;
  timelineSteps: PpcTimelineStep[];

  // Proven process
  processTitle: string;
  processSubtitle: string;
  processSteps: PpcProcessStep[];

  // CTA blocks
  midCtaTitle: string;
  midCtaBody: string;
  midPrimaryCtaText: string;
  midPrimaryCtaHref?: string;
  midSecondaryCtaText?: string;
  midSecondaryCtaHref?: string;

  bottomCtaTitle: string;
  bottomCtaBody: string;
  bottomPrimaryCtaText: string;
  bottomPrimaryCtaHref?: string;
  bottomSecondaryCtaText?: string;
  bottomSecondaryCtaHref?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface PpcCaseStudyDetailDocument extends Document, PpcCaseStudyDetail {}

// ---------- Sub schemas ----------
const heroStatSchema = new Schema<PpcHeroStat>(
  { value: { type: String, required: true }, label: { type: String, required: true }, iconKey: String },
  { _id: false }
);

const infoCardSchema = new Schema<PpcInfoCard>(
  {
    iconKey: { type: String, required: true },
    title: { type: String, required: true },
    value: { type: String, required: true },
    href: String,
    colorClass: String,
  },
  { _id: false }
);

const sectionCardSchema = new Schema<PpcSectionCard>(
  {
    iconKey: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    colorClass: String,
  },
  { _id: false }
);

const bulletSectionSchema = new Schema<PpcBulletSection>(
  {
    iconKey: { type: String, required: true },
    title: { type: String, required: true },
    bullets: { type: [String], default: [] },
    colorClass: String,
  },
  { _id: false }
);

const dashboardStatSchema = new Schema<PpcDashboardStat>(
  { iconKey: { type: String, required: true }, label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const highlightMetricSchema = new Schema<PpcHighlightMetric>(
  { label: { type: String, required: true }, value: { type: String, required: true }, subtext: String },
  { _id: false }
);

const outstandingCardSchema = new Schema<PpcOutstandingResultCard>(
  {
    iconKey: { type: String, required: true },
    value: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    colorClass: String,
  },
  { _id: false }
);

const timelineStepSchema = new Schema<PpcTimelineStep>(
  {
    order: { type: Number, required: true },
    badgeText: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    colorClass: String,
  },
  { _id: false }
);

const processStepSchema = new Schema<PpcProcessStep>(
  { order: { type: Number, required: true }, title: { type: String, required: true }, description: { type: String, required: true } },
  { _id: false }
);

// ---------- Main schema ----------
const ppcCaseStudyDetailSchema = new Schema<PpcCaseStudyDetailDocument>(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "PpcCaseStudyCard",
      required: true,
      unique: true, // ✅ one detail per card
      index: true,
    },

    heroBadgeText: { type: String, required: true },
    heroClientName: { type: String, required: true },
    heroRatingText: String,
    heroDescription: { type: String, required: true },
    heroStats: { type: [heroStatSchema], default: [] },
    heroPrimaryCtaText: { type: String, required: true },
    heroPrimaryCtaHref: String,

    heroVideoUrl: String,
    heroVideoPoster: String,
    heroVideoBadgeText: String,

    clientProfileTitle: { type: String, required: true },
    clientProfileSubtitle: { type: String, required: true },
    clientProfileCards: { type: [infoCardSchema], default: [] },

    challengeTitle: { type: String, required: true },
    challengeSubtitle: { type: String, required: true },
    challengeCards: { type: [sectionCardSchema], default: [] },

    approachTitle: { type: String, required: true },
    approachSubtitle: { type: String, required: true },
    approachSections: { type: [bulletSectionSchema], default: [] },

    dashboardTitle: { type: String, required: true },
    dashboardSubtitle: { type: String, required: true },
    dashboardStats: { type: [dashboardStatSchema], default: [] },
    dashboardHighlight: { type: highlightMetricSchema, required: true },

    outstandingTitle: { type: String, required: true },
    outstandingSubtitle: { type: String, required: true },
    outstandingCards: { type: [outstandingCardSchema], default: [] },

    timelineTitle: { type: String, required: true },
    timelineSteps: { type: [timelineStepSchema], default: [] },

    processTitle: { type: String, required: true },
    processSubtitle: { type: String, required: true },
    processSteps: { type: [processStepSchema], default: [] },

    midCtaTitle: { type: String, required: true },
    midCtaBody: { type: String, required: true },
    midPrimaryCtaText: { type: String, required: true },
    midPrimaryCtaHref: String,
    midSecondaryCtaText: String,
    midSecondaryCtaHref: String,

    bottomCtaTitle: { type: String, required: true },
    bottomCtaBody: { type: String, required: true },
    bottomPrimaryCtaText: { type: String, required: true },
    bottomPrimaryCtaHref: String,
    bottomSecondaryCtaText: String,
    bottomSecondaryCtaHref: String,
  },
  {
    collection: "ppc_case_study_details",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const PpcCaseStudyDetailModel: Model<PpcCaseStudyDetailDocument> =
  (mongoose.models.PpcCaseStudyDetail as Model<PpcCaseStudyDetailDocument>) ||
  mongoose.model<PpcCaseStudyDetailDocument>("PpcCaseStudyDetail", ppcCaseStudyDetailSchema);
