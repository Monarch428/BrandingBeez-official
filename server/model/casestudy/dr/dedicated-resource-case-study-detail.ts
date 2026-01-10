import mongoose, { Schema, Model, Types } from "mongoose";
import type { Document } from "mongoose";

// ---------- sub types ----------
export interface DrHeroStat {
  value: string;     // "150+ Projects"
  label: string;     // "Output Increase"
  iconKey?: string;  // maps to lucide icon in UI
}

export interface DrTeamMember {
  name: string;
  role: string;
  imageUrl?: string;
}

export interface DrMiniStat {
  value: string;
  label: string;
  colorClass?: string;
}

export interface DrChallengeItem {
  iconKey: string;
  title: string;
  description: string;
  colorClass?: string;
}

export interface DrPreMetricItem {
  iconKey: string;
  label: string;
  value: string;
}

export interface DrEvolutionFeature {
  iconKey: string;
  text: string;
}

export interface DrEvolutionStep {
  order: number;
  numberText: string;        // "1" | "2" | "3"
  title: string;
  subtitle: string;
  colorClass?: string;
  features: DrEvolutionFeature[];
}

export interface DrSuccessFactor {
  iconKey: string;
  title: string;
  description: string;
  gradientClass?: string; // "from-[#391B66] to-[#E64761]"
}

export interface DrBeforeAfterRow {
  keyMetric: string;
  before: string;
  after: string;
}

export interface DrTestimonial {
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
  rating?: number;
}

export interface DrVideoTestimonial {
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
}

export interface DedicatedResourceSeoMeta {
  metaTitle?: string;
  metaDescription?: string;
}

// ---------- main ----------
export interface DedicatedResourceCaseStudyDetail {
  cardId: Types.ObjectId; // FK to DedicatedResourceCaseStudyCard

  // HERO (Hero.tsx)
  heroBadgeText: string;       // "Featured Borderless Team Success"
  heroTitle: string;           // "SocialLand Digital: First UK Partnership Success"
  heroRatingText?: string;     // "⭐⭐⭐⭐⭐ Rated 4.9 ..."
  heroDescription: string;

  heroStats: DrHeroStat[];
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref?: string;

  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoBadgeText?: string;

  // client banner inside hero
  heroClientName: string;
  heroClientIndustry: string;
  heroClientMeta: {
    hqText: string;
    peopleText: string;
    specialtyText: string;
    logoUrl?: string;
  };

  // TEAM INVOLVED (TeamInvolved.tsx)
  teamTitle: string;
  teamSubtitle: string;
  teamBannerLeftText: string;   // "5-Person Specialist Partnership"
  teamBannerStatusText: string; // "Active Partnership"
  teamMembers: DrTeamMember[];
  teamStats: DrMiniStat[];

  // PARTNERSHIP CHALLENGE (PartnershipChallenge.tsx)
  challengeTitle: string;
  challengeBody: string;
  challengeImpactTitle: string; // "Partnership Impact"
  challengeImpactBullets: { iconKey: string; text: string }[];

  prePartnershipTitle: string; // "Pre-Partnership Metrics"
  prePartnershipMetrics: DrPreMetricItem[];

  // PARTNERSHIP EVOLUTION (PartnershipEvolution.tsx section inside same file)
  evolutionTitle: string;
  evolutionSubtitle: string;
  evolutionSteps: DrEvolutionStep[];

  // SUCCESS FACTORS (SuccessFactors.tsx)
  successFactorsTitle: string;
  successFactorsSubtitle: string;
  successFactors: DrSuccessFactor[];

  // BEFORE/AFTER (BeforeAfter.tsx)
  beforeAfterTitle: string;
  beforeAfterSubtitle: string;
  beforeAfterRows: DrBeforeAfterRow[];

  // CLIENT FEEDBACK (ClientFeedback.tsx)
  feedbackTitle: string;
  feedbackSubtitle: string;
  testimonials: DrTestimonial[];
  videoTestimonial?: DrVideoTestimonial;

  // CTA blocks (CTASection.tsx)
  ctaPrimary: {
    title: string;
    body: string;
    primaryButtonText: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
  };

  ctaSecondary: {
    title: string;
    body: string;
    emailLabel?: string;
    emailValue?: string;
    phoneLabel?: string;
    phoneValue?: string;
    formTitle?: string;
  };

  seo?: DedicatedResourceSeoMeta;

  createdAt: Date;
  updatedAt: Date;
}

export interface DedicatedResourceCaseStudyDetailDocument
  extends Document,
  DedicatedResourceCaseStudyDetail { }

// ---------- sub schemas ----------
const heroStatSchema = new Schema<DrHeroStat>(
  { value: { type: String, required: true }, label: { type: String, required: true }, iconKey: String },
  { _id: false }
);

const teamMemberSchema = new Schema<DrTeamMember>(
  { name: { type: String, required: true }, role: { type: String, required: true }, imageUrl: String },
  { _id: false }
);

const miniStatSchema = new Schema<DrMiniStat>(
  { value: { type: String, required: true }, label: { type: String, required: true }, colorClass: String },
  { _id: false }
);

const impactBulletSchema = new Schema<{ iconKey: string; text: string }>(
  { iconKey: { type: String, required: true }, text: { type: String, required: true } },
  { _id: false }
);

const preMetricSchema = new Schema<DrPreMetricItem>(
  { iconKey: { type: String, required: true }, label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const evolutionFeatureSchema = new Schema<DrEvolutionFeature>(
  { iconKey: { type: String, required: true }, text: { type: String, required: true } },
  { _id: false }
);

const evolutionStepSchema = new Schema<DrEvolutionStep>(
  {
    order: { type: Number, required: true },
    numberText: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    colorClass: String,
    features: { type: [evolutionFeatureSchema], default: [] },
  },
  { _id: false }
);

const successFactorSchema = new Schema<DrSuccessFactor>(
  {
    iconKey: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    gradientClass: String,
  },
  { _id: false }
);

const beforeAfterRowSchema = new Schema<DrBeforeAfterRow>(
  {
    keyMetric: { type: String, required: true },
    before: { type: String, required: true },
    after: { type: String, required: true },
  },
  { _id: false }
);

const testimonialSchema = new Schema<DrTestimonial>(
  {
    quote: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, required: true },
    imageUrl: String,
    rating: Number,
  },
  { _id: false }
);

const videoTestimonialSchema = new Schema<DrVideoTestimonial>(
  { thumbnailUrl: String, title: String, description: String, videoUrl: String },
  { _id: false }
);

const seoMetaSchema = new Schema(
  {
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
  },
  { _id: false }
);

// ---------- main schema ----------
const dedicatedResourceCaseStudyDetailSchema = new Schema<DedicatedResourceCaseStudyDetailDocument>(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "DedicatedResourceCaseStudyCard",
      required: true,
      unique: true,
      index: true,
    },

    heroBadgeText: { type: String, required: true },
    heroTitle: { type: String, required: true },
    heroRatingText: String,
    heroDescription: { type: String, required: true },

    heroStats: { type: [heroStatSchema], default: [] },
    heroPrimaryCtaText: { type: String, required: true },
    heroPrimaryCtaHref: String,

    heroVideoUrl: String,
    heroVideoPoster: String,
    heroVideoBadgeText: String,

    heroClientName: { type: String, required: true },
    heroClientIndustry: { type: String, required: true },
    heroClientMeta: {
      hqText: { type: String, required: true },
      peopleText: { type: String, required: true },
      specialtyText: { type: String, required: true },
      logoUrl: String,
    },

    teamTitle: { type: String, required: true },
    teamSubtitle: { type: String, required: true },
    teamBannerLeftText: { type: String, required: true },
    teamBannerStatusText: { type: String, required: true },
    teamMembers: { type: [teamMemberSchema], default: [] },
    teamStats: { type: [miniStatSchema], default: [] },

    challengeTitle: { type: String, required: true },
    challengeBody: { type: String, required: true },
    challengeImpactTitle: { type: String, required: true },
    challengeImpactBullets: { type: [impactBulletSchema], default: [] },

    prePartnershipTitle: { type: String, required: true },
    prePartnershipMetrics: { type: [preMetricSchema], default: [] },

    evolutionTitle: { type: String, required: true },
    evolutionSubtitle: { type: String, required: true },
    evolutionSteps: { type: [evolutionStepSchema], default: [] },

    successFactorsTitle: { type: String, required: true },
    successFactorsSubtitle: { type: String, required: true },
    successFactors: { type: [successFactorSchema], default: [] },

    beforeAfterTitle: { type: String, required: true },
    beforeAfterSubtitle: { type: String, required: true },
    beforeAfterRows: { type: [beforeAfterRowSchema], default: [] },

    feedbackTitle: { type: String, required: true },
    feedbackSubtitle: { type: String, required: true },
    testimonials: { type: [testimonialSchema], default: [] },
    videoTestimonial: { type: videoTestimonialSchema, required: false },

    ctaPrimary: {
      title: { type: String, required: true },
      body: { type: String, required: true },
      primaryButtonText: { type: String, required: true },
      primaryButtonHref: String,
      secondaryButtonText: String,
      secondaryButtonHref: String,
    },

    ctaSecondary: {
      title: { type: String, required: true },
      body: { type: String, required: true },
      emailLabel: String,
      emailValue: String,
      phoneLabel: String,
      phoneValue: String,
      formTitle: String,
    },

    seo: { type: seoMetaSchema },
  },
  {
    collection: "dedicated_resource_case_study_details",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const DedicatedResourceCaseStudyDetailModel: Model<DedicatedResourceCaseStudyDetailDocument> =
  (mongoose.models.DedicatedResourceCaseStudyDetail as Model<DedicatedResourceCaseStudyDetailDocument>) ||
  mongoose.model<DedicatedResourceCaseStudyDetailDocument>(
    "DedicatedResourceCaseStudyDetail",
    dedicatedResourceCaseStudyDetailSchema
  );
