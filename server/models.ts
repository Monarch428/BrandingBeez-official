import mongoose, { Schema, type Model } from "mongoose";
import type {
  BlogPost,
  CaseStudy,
  ChatSession,
  Client,
  Contact,
  Coupon,
  CouponUsage,
  DedicatedResourcesLead,
  FeaturedClient,
  InsertBlogPost,
  InsertCaseStudy,
  InsertChatSession,
  InsertClient,
  InsertContact,
  InsertCoupon,
  InsertCouponUsage,
  InsertDedicatedResourcesLead,
  InsertFeaturedClient,
  InsertPricingPackage,
  InsertSeoAudit,
  InsertServicePage,
  InsertUser,
  NewsletterSubscriber,
  PricingPackage,
  SeoAudit,
  ServicePage,
  User,
  PortfolioItem,
  InsertPortfolioItem,
  PortfolioContent,
  InsertPortfolioContent,
} from "@shared/schema";

const { model, models } = mongoose;

// Helper to reuse numeric ID definition
const numericIdField = {
  type: Number,
  required: true,
  unique: true,
};

// Counter schema for auto-increment support
interface CounterDocument extends mongoose.Document {
  collection: string;
  seq: number;
}
const counterSchema = new Schema<CounterDocument>(
  {
    collection: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { collection: "counters", versionKey: false },
);
export const CounterModel =
  (models.Counter as Model<CounterDocument>) ||
  model<CounterDocument>("Counter", counterSchema);

interface UserDocument extends mongoose.Document, User {}
const userSchema = new Schema<UserDocument>(
  {
    id: numericIdField,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users", versionKey: false },
);
export const UserModel =
  (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);

interface ContactDocument extends mongoose.Document, Contact {}
const contactSchema = new Schema<ContactDocument>(
  {
    id: numericIdField,
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    inquiry_type: { type: String, required: true },
    message: { type: String, required: true },
    preferred_contact: { type: String, required: true },
    agencyName: String,
    country: { type: String, required: true },
    topPriority: { type: String, required: true },
    couponCode: String,
    servicesSelected: { type: [String], default: [] },
    budget: String,
    timeline: String,
    referralSource: String,
    serviceDetails: Schema.Types.Mixed,
    automationDetails: Schema.Types.Mixed,
    dedicatedResourceDetails: Schema.Types.Mixed,
    websiteDetails: Schema.Types.Mixed,
    contactFormType: { type: String, default: "contact-form" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "contacts", versionKey: false },
);
export const ContactModel =
  (models.Contact as Model<ContactDocument>) ||
  model<ContactDocument>("Contact", contactSchema);

interface ClientDocument extends mongoose.Document, Client {}
const clientSchema = new Schema<ClientDocument>(
  {
    id: numericIdField,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    company: String,
    phone: String,
    website: String,
    status: { type: String, default: "pending" },
    region: { type: String, default: "US" },
  },
  {
    collection: "clients",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const ClientModel =
  (models.Client as Model<ClientDocument>) ||
  model<ClientDocument>("Client", clientSchema);

interface SeoAuditDocument extends mongoose.Document, SeoAudit {}
const seoAuditSchema = new Schema<SeoAuditDocument>(
  {
    id: numericIdField,
    clientId: { type: Number, required: true },
    websiteUrl: { type: String, required: true },
    auditData: Schema.Types.Mixed,
    score: Number,
    status: { type: String, default: "pending" },
    recommendations: String,
    createdAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { collection: "seo_audits", versionKey: false },
);
export const SeoAuditModel =
  (models.SeoAudit as Model<SeoAuditDocument>) ||
  model<SeoAuditDocument>("SeoAudit", seoAuditSchema);

interface ChatSessionDocument extends mongoose.Document, ChatSession {}
const chatSessionSchema = new Schema<ChatSessionDocument>(
  {
    id: numericIdField,
    sessionId: { type: String, required: true, unique: true },
    messages: { type: [Schema.Types.Mixed], default: [] },
    clientInfo: Schema.Types.Mixed,
    recommendations: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    collection: "chat_sessions",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const ChatSessionModel =
  (models.ChatSession as Model<ChatSessionDocument>) ||
  model<ChatSessionDocument>("ChatSession", chatSessionSchema);

interface FeaturedClientDocument extends mongoose.Document, FeaturedClient {}
const featuredClientSchema = new Schema<FeaturedClientDocument>(
  {
    id: numericIdField,
    servicePage: { type: String, required: true },
    name: { type: String, required: true },
    logo: String,
    website: String,
    description: { type: String, required: true },
    achievements: { type: [String], default: [] },
    industry: { type: String, required: true },
    timeframe: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "featured_clients",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const FeaturedClientModel =
  (models.FeaturedClient as Model<FeaturedClientDocument>) ||
  model<FeaturedClientDocument>("FeaturedClient", featuredClientSchema);

interface CaseStudyDocument extends mongoose.Document, CaseStudy {}
const caseStudySchema = new Schema<CaseStudyDocument>(
  {
    id: numericIdField,
    servicePage: { type: String, required: true },
    title: { type: String, required: true },
    client: { type: String, required: true },
    industry: { type: String, required: true },
    results: Schema.Types.Mixed,
    description: String,
    imageUrl: String,
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "case_studies",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const CaseStudyModel =
  (models.CaseStudy as Model<CaseStudyDocument>) ||
  model<CaseStudyDocument>("CaseStudy", caseStudySchema);

interface PricingPackageDocument extends mongoose.Document, PricingPackage {}
const pricingPackageSchema = new Schema<PricingPackageDocument>(
  {
    id: numericIdField,
    servicePage: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: String,
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "pricing_packages",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const PricingPackageModel =
  (models.PricingPackage as Model<PricingPackageDocument>) ||
  model<PricingPackageDocument>("PricingPackage", pricingPackageSchema);

interface ServicePageDocument extends mongoose.Document, ServicePage {}
const servicePageSchema = new Schema<ServicePageDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    heroTitle: String,
    heroSubtitle: String,
    auditFormType: String,
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "service_pages",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const ServicePageModel =
  (models.ServicePage as Model<ServicePageDocument>) ||
  model<ServicePageDocument>("ServicePage", servicePageSchema);

interface CouponDocument extends mongoose.Document, Coupon {}
const couponSchema = new Schema<CouponDocument>(
  {
    id: numericIdField,
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    maxUses: { type: Number, default: null },
    currentUses: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "coupons", versionKey: false },
);
export const CouponModel =
  (models.Coupon as Model<CouponDocument>) ||
  model<CouponDocument>("Coupon", couponSchema);

interface CouponUsageDocument extends mongoose.Document, CouponUsage {}
const couponUsageSchema = new Schema<CouponUsageDocument>(
  {
    id: numericIdField,
    couponId: { type: Number, required: true },
    email: { type: String, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { collection: "coupon_usage", versionKey: false },
);
export const CouponUsageModel =
  (models.CouponUsage as Model<CouponUsageDocument>) ||
  model<CouponUsageDocument>("CouponUsage", couponUsageSchema);

interface DedicatedResourcesLeadDocument
  extends mongoose.Document,
    DedicatedResourcesLead {}
const dedicatedResourcesLeadSchema = new Schema<DedicatedResourcesLeadDocument>(
  {
    id: numericIdField,
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    resourceType: { type: String, required: true },
    hiringLevel: String,
    multipleResources: Schema.Types.Mixed,
    additionalNotes: String,
  },
  {
    collection: "dedicated_resources_leads",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const DedicatedResourcesLeadModel =
  (models.DedicatedResourcesLead as Model<DedicatedResourcesLeadDocument>) ||
  model<DedicatedResourcesLeadDocument>(
    "DedicatedResourcesLead",
    dedicatedResourcesLeadSchema,
  );

interface BlogPostDocument extends mongoose.Document, BlogPost {}
const blogPostSchema = new Schema<BlogPostDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    excerpt: String,
    content: { type: String, required: true },
    imageUrl: String,
    tags: { type: [String], default: [] },
    author: { type: String, default: "BrandingBeez Team" },
    readTime: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    metaDescription: String,
    metaTitle: String,
  },
  {
    collection: "blog_posts",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const BlogPostModel =
  (models.BlogPost as Model<BlogPostDocument>) ||
  model<BlogPostDocument>("BlogPost", blogPostSchema);

interface NewsletterSubscriberDocument
  extends mongoose.Document,
    NewsletterSubscriber {}
const newsletterSubscriberSchema = new Schema<NewsletterSubscriberDocument>(
  {
    id: numericIdField,
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { collection: "newsletter_subscribers", versionKey: false },
);
export const NewsletterSubscriberModel =
  (models.NewsletterSubscriber as Model<NewsletterSubscriberDocument>) ||
  model<NewsletterSubscriberDocument>(
    "NewsletterSubscriber",
    newsletterSubscriberSchema,
  );

interface PortfolioItemDocument extends mongoose.Document, PortfolioItem {}
const portfolioItemSchema = new Schema<PortfolioItemDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    industry: { type: String, required: true },
    client: String,
    badge: String,
    investment: String,
    totalValue: String,
    roi: String,
    description: String,
    features: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    timeline: String,
    imageUrl: String,
    image: String,
    isFeatured: { type: Boolean, default: false },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "portfolio_items",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const PortfolioItemModel =
  (models.PortfolioItem as Model<PortfolioItemDocument>) ||
  model<PortfolioItemDocument>("PortfolioItem", portfolioItemSchema);

interface PortfolioContentDocument
  extends mongoose.Document,
    PortfolioContent {}
const portfolioContentSchema = new Schema<PortfolioContentDocument>(
  {
    id: numericIdField,
    heroTitle: { type: String, required: true },
    heroHighlight: String,
    heroSubtitle: String,
    heroDescription: String,
    heroStats: {
      type: [
        new Schema(
          {
            kpi: { type: String, required: true },
            label: { type: String, required: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    heroPrimaryCtaText: String,
    heroPrimaryCtaHref: String,
    heroSecondaryCtaText: String,
    heroSecondaryCtaHref: String,
    testimonialsTitle: String,
    testimonialsSubtitle: String,
    testimonials: {
      type: [
        new Schema(
          {
            quote: { type: String, required: true },
            who: { type: String, required: true },
            tag: String,
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  {
    collection: "portfolio_content",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);
export const PortfolioContentModel =
  (models.PortfolioContent as Model<PortfolioContentDocument>) ||
  model<PortfolioContentDocument>("PortfolioContent", portfolioContentSchema);

export type {
  BlogPostDocument,
  CaseStudyDocument,
  ChatSessionDocument,
  ClientDocument,
  ContactDocument,
  CouponDocument,
  CouponUsageDocument,
  DedicatedResourcesLeadDocument,
  FeaturedClientDocument,
  PricingPackageDocument,
  SeoAuditDocument,
  ServicePageDocument,
  UserDocument,
  NewsletterSubscriberDocument,
  PortfolioItemDocument,
  PortfolioContentDocument,
};

export type {
  InsertBlogPost as BlogPostInput,
  InsertCaseStudy as CaseStudyInput,
  InsertChatSession as ChatSessionInput,
  InsertClient as ClientInput,
  InsertContact as ContactInput,
  InsertCoupon as CouponInput,
  InsertCouponUsage as CouponUsageInput,
  InsertDedicatedResourcesLead as DedicatedResourcesLeadInput,
  InsertFeaturedClient as FeaturedClientInput,
  InsertPricingPackage as PricingPackageInput,
  InsertSeoAudit as SeoAuditInput,
  InsertServicePage as ServicePageInput,
  InsertUser as UserInput,
  InsertPortfolioItem as PortfolioItemInput,
  InsertPortfolioContent as PortfolioContentInput,
};
