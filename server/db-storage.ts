import type { IStorage } from "./storage";
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
  InsertNewsletterSubscriber,
  NewsletterSubscriber,
  PortfolioItem,
  InsertPortfolioItem,
  PortfolioContent,
  InsertPortfolioContent,
  PricingPackage,
  SeoAudit,
  ServicePage,
  User,
} from "@shared/schema";
import {
  BlogPostModel,
  CaseStudyModel,
  ChatSessionModel,
  ClientModel,
  ContactModel,
  CouponModel,
  CouponUsageModel,
  DedicatedResourcesLeadModel,
  FeaturedClientModel,
  PricingPackageModel,
  SeoAuditModel,
  ServicePageModel,
  UserModel,
  NewsletterSubscriberModel,
  PortfolioItemModel,
  PortfolioContentModel,
} from "./models";
import { connectToDatabase, getNextSequence } from "./db";

function toPlain<T>(doc: any): T {
  if (!doc) {
    return doc;
  }
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj._id;
  return obj as T;
}

export class DatabaseStorage implements IStorage {
  private async ensureConnection(): Promise<void> {
    await connectToDatabase();
  }

  private defaultPortfolioContent(): InsertPortfolioContent {
    return {
      heroTitle: "Real AI Solutions We’ve Built",
      heroHighlight: "with Full Transparency",
      heroSubtitle:
        "Actual costs, timelines, tech stack, and ROI verified and documented. No fluff. Just results you can trust.",
      heroDescription:
        "We partner with founders and teams to ship automation and AI products that deliver measurable ROI in weeks, not months.",
      heroStats: [
        { kpi: "15+", label: "Projects Delivered" },
        { kpi: "$127K", label: "Total Value Created" },
        { kpi: "325%", label: "Average ROI" },
      ],
      heroPrimaryCtaText: "Explore Case Studies",
      heroPrimaryCtaHref: "/#case-studies",
      heroSecondaryCtaText: "Get an Estimate",
      heroSecondaryCtaHref: "/pricing-calculator",
      testimonialsTitle: "What Our Clients Say",
      testimonialsSubtitle:
        "Transparent pricing, predictable delivery, and partners who stay accountable end to end.",
      testimonials: [
        {
          quote:
            "The ROI was immediate. We saw efficiency gains within the first week.",
          who: "AC Graphics",
          tag: "Manufacturing",
        },
        {
          quote:
            "BrandingBeez delivered exactly what they promised, on time and on budget.",
          who: "Wellenpuls",
          tag: "HealthTech",
        },
        {
          quote: "Finally, an agency that shows you the real costs upfront.",
          who: "Digital Identity Client",
          tag: "SaaS Startup",
        },
      ],
    };
  }

  private normalizePortfolioContent(
    content: PortfolioContent,
  ): PortfolioContent {
    return {
      ...content,
      heroStats: content.heroStats ?? [],
      testimonials: content.testimonials ?? [],
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    await this.ensureConnection();
    const user = await UserModel.findOne({ id }).lean<User>();
    return user ?? undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureConnection();
    const user = await UserModel.findOne({ username }).lean<User>();
    return user ?? undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.ensureConnection();
    const id = await getNextSequence("users");
    const created = await UserModel.create({ id, ...user });
    return toPlain<User>(created);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    await this.ensureConnection();
    const id = await getNextSequence("contacts");
    const created = await ContactModel.create({ id, ...contact });
    return toPlain<Contact>(created);
  }

  async getAllContacts(): Promise<Contact[]> {
    await this.ensureConnection();
    const contacts = await ContactModel.find().sort({ createdAt: -1 }).lean<Contact[]>();
    return contacts;
  }

  async deleteContact(id: number): Promise<void> {
    await this.ensureConnection();
    await ContactModel.deleteOne({ id });
  }

  // Client management
  async createClient(client: InsertClient): Promise<Client> {
    await this.ensureConnection();
    const id = await getNextSequence("clients");
    const created = await ClientModel.create({ id, ...client });
    return toPlain<Client>(created);
  }

  async getClient(id: number): Promise<Client | undefined> {
    await this.ensureConnection();
    const client = await ClientModel.findOne({ id }).lean<Client>();
    return client ?? undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    await this.ensureConnection();
    const client = await ClientModel.findOne({ email }).lean<Client>();
    return client ?? undefined;
  }

  async getAllClients(): Promise<Client[]> {
    await this.ensureConnection();
    const clients = await ClientModel.find().sort({ createdAt: -1 }).lean<Client[]>();
    return clients;
  }

  async updateClientStatus(id: number, status: string): Promise<Client> {
    await this.ensureConnection();
    const updated = await ClientModel.findOneAndUpdate(
      { id },
      { status },
      { new: true },
    ).lean<Client>();
    if (!updated) {
      throw new Error("Client not found");
    }
    return updated;
  }

  // SEO Audit management
  async createSeoAudit(audit: InsertSeoAudit): Promise<SeoAudit> {
    await this.ensureConnection();
    const id = await getNextSequence("seo_audits");
    const created = await SeoAuditModel.create({ id, ...audit });
    return toPlain<SeoAudit>(created);
  }

  async getSeoAudit(id: number): Promise<SeoAudit | undefined> {
    await this.ensureConnection();
    const audit = await SeoAuditModel.findOne({ id }).lean<SeoAudit>();
    return audit ?? undefined;
  }

  async getAuditsByClient(clientId: number): Promise<SeoAudit[]> {
    await this.ensureConnection();
    const audits = await SeoAuditModel.find({ clientId }).lean<SeoAudit[]>();
    return audits;
  }

  async updateAuditData(
    id: number,
    data: any,
    score: number,
    recommendations: string,
  ): Promise<SeoAudit> {
    await this.ensureConnection();
    const updated = await SeoAuditModel.findOneAndUpdate(
      { id },
      {
        auditData: data,
        score,
        recommendations,
        status: "completed",
        completedAt: new Date(),
      },
      { new: true },
    ).lean<SeoAudit>();
    if (!updated) {
      throw new Error("SEO audit not found");
    }
    return updated;
  }

  // Chat sessions
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    await this.ensureConnection();
    const id = await getNextSequence("chat_sessions");
    const created = await ChatSessionModel.create({ id, ...session });
    return toPlain<ChatSession>(created);
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    await this.ensureConnection();
    const session = await ChatSessionModel.findOne({ sessionId }).lean<ChatSession>();
    return session ?? undefined;
  }

  async updateChatSession(
    sessionId: string,
    messages: any[],
    recommendations?: any[],
  ): Promise<ChatSession> {
    await this.ensureConnection();
    const updateData: Record<string, unknown> = {
      messages,
      updatedAt: new Date(),
    };
    if (recommendations) {
      updateData.recommendations = recommendations;
    }
    const updated = await ChatSessionModel.findOneAndUpdate(
      { sessionId },
      updateData,
      { new: true },
    ).lean<ChatSession>();
    if (!updated) {
      throw new Error("Chat session not found");
    }
    return updated;
  }

  // Featured Clients
  async createFeaturedClient(client: InsertFeaturedClient): Promise<FeaturedClient> {
    await this.ensureConnection();
    const id = await getNextSequence("featured_clients");
    const created = await FeaturedClientModel.create({ id, ...client });
    return toPlain<FeaturedClient>(created);
  }

  async getFeaturedClientsByService(servicePage: string): Promise<FeaturedClient[]> {
    await this.ensureConnection();
    const clients = await FeaturedClientModel.find({
      servicePage,
      isActive: true,
    }).lean<FeaturedClient[]>();
    return clients;
  }

  async getAllFeaturedClients(): Promise<FeaturedClient[]> {
    await this.ensureConnection();
    const clients = await FeaturedClientModel.find({ isActive: true }).lean<FeaturedClient[]>();
    return clients;
  }

  async updateFeaturedClient(
    id: number,
    data: Partial<InsertFeaturedClient>,
  ): Promise<FeaturedClient> {
    await this.ensureConnection();
    const updated = await FeaturedClientModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<FeaturedClient>();
    if (!updated) {
      throw new Error("Featured client not found");
    }
    return updated;
  }

  async deleteFeaturedClient(id: number): Promise<void> {
    await this.ensureConnection();
    await FeaturedClientModel.deleteOne({ id });
  }

  // Case Studies
  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    await this.ensureConnection();
    const id = await getNextSequence("case_studies");
    const created = await CaseStudyModel.create({ id, ...caseStudy });
    return toPlain<CaseStudy>(created);
  }

  async getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]> {
    await this.ensureConnection();
    const studies = await CaseStudyModel.find({ servicePage, isActive: true }).lean<CaseStudy[]>();
    return studies;
  }

  async getAllCaseStudies(): Promise<CaseStudy[]> {
    await this.ensureConnection();
    const studies = await CaseStudyModel.find({ isActive: true }).lean<CaseStudy[]>();
    return studies;
  }

  async updateCaseStudy(
    id: number,
    data: Partial<InsertCaseStudy>,
  ): Promise<CaseStudy> {
    await this.ensureConnection();
    const updated = await CaseStudyModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<CaseStudy>();
    if (!updated) {
      throw new Error("Case study not found");
    }
    return updated;
  }

  async deleteCaseStudy(id: number): Promise<void> {
    await this.ensureConnection();
    await CaseStudyModel.deleteOne({ id });
  }

  // Pricing Packages
  async createPricingPackage(pkg: InsertPricingPackage): Promise<PricingPackage> {
    await this.ensureConnection();
    const id = await getNextSequence("pricing_packages");
    const created = await PricingPackageModel.create({ id, ...pkg });
    return toPlain<PricingPackage>(created);
  }

  async getPricingPackagesByService(servicePage: string): Promise<PricingPackage[]> {
    await this.ensureConnection();
    const packages = await PricingPackageModel.find({
      servicePage,
      isActive: true,
    })
      .sort({ orderIndex: 1 })
      .lean<PricingPackage[]>();
    return packages;
  }

  async getAllPricingPackages(): Promise<PricingPackage[]> {
    await this.ensureConnection();
    const packages = await PricingPackageModel.find({ isActive: true })
      .sort({ orderIndex: 1 })
      .lean<PricingPackage[]>();
    return packages;
  }

  async updatePricingPackage(
    id: number,
    data: Partial<InsertPricingPackage>,
  ): Promise<PricingPackage> {
    await this.ensureConnection();
    const updated = await PricingPackageModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<PricingPackage>();
    if (!updated) {
      throw new Error("Pricing package not found");
    }
    return updated;
  }

  async deletePricingPackage(id: number): Promise<void> {
    await this.ensureConnection();
    await PricingPackageModel.deleteOne({ id });
  }

  // Service Pages
  async createServicePage(page: InsertServicePage): Promise<ServicePage> {
    await this.ensureConnection();
    const id = await getNextSequence("service_pages");
    const created = await ServicePageModel.create({ id, ...page });
    return toPlain<ServicePage>(created);
  }

  async getServicePage(slug: string): Promise<ServicePage | undefined> {
    await this.ensureConnection();
    const page = await ServicePageModel.findOne({ slug, isActive: true }).lean<ServicePage>();
    return page ?? undefined;
  }

  async getAllServicePages(): Promise<ServicePage[]> {
    await this.ensureConnection();
    const pages = await ServicePageModel.find({ isActive: true }).lean<ServicePage[]>();
    return pages;
  }

  async updateServicePage(
    id: number,
    data: Partial<InsertServicePage>,
  ): Promise<ServicePage> {
    await this.ensureConnection();
    const updated = await ServicePageModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<ServicePage>();
    if (!updated) {
      throw new Error("Service page not found");
    }
    return updated;
  }

  async deleteServicePage(id: number): Promise<void> {
    await this.ensureConnection();
    await ServicePageModel.deleteOne({ id });
  }

  // Coupon Management
  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    await this.ensureConnection();
    const id = await getNextSequence("coupons");
    const created = await CouponModel.create({ id, ...coupon });
    return toPlain<Coupon>(created);
  }

  async getCoupon(code: string): Promise<Coupon | undefined> {
    await this.ensureConnection();
    const coupon = await CouponModel.findOne({ code }).lean<Coupon>();
    return coupon ?? undefined;
  }

  async validateCouponForEmail(
    code: string,
    email: string,
  ): Promise<{ valid: boolean; message: string; coupon?: Coupon }> {
    await this.ensureConnection();
    const coupon = await this.getCoupon(code);

    if (!coupon) {
      return { valid: false, message: "Coupon code not found" };
    }

    if (!coupon.isActive) {
      return { valid: false, message: "Coupon is no longer active" };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return { valid: false, message: "Coupon has expired" };
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, message: "Coupon usage limit reached" };
    }

    const existingUsage = await CouponUsageModel.findOne({
      couponId: coupon.id,
      email,
    }).lean<CouponUsage>();

    if (existingUsage) {
      return { valid: false, message: "You have already used this coupon code" };
    }

    return { valid: true, message: "Coupon is valid", coupon };
  }

  async useCoupon(code: string, email: string): Promise<void> {
    await this.ensureConnection();
    const coupon = await this.getCoupon(code);
    if (!coupon) {
      return;
    }

    const usageId = await getNextSequence("coupon_usage");
    await CouponUsageModel.create({
      id: usageId,
      couponId: coupon.id,
      email,
    });

    await CouponModel.updateOne({ id: coupon.id }, { $inc: { currentUses: 1 } });
  }

  async getAllCoupons(): Promise<Coupon[]> {
    await this.ensureConnection();
    const coupons = await CouponModel.find().lean<Coupon[]>();
    return coupons;
  }

  // Dedicated Resources Leads
  async createDedicatedResourcesLead(
    lead: InsertDedicatedResourcesLead,
  ): Promise<DedicatedResourcesLead> {
    await this.ensureConnection();
    const id = await getNextSequence("dedicated_resources_leads");
    const created = await DedicatedResourcesLeadModel.create({ id, ...lead });
    return toPlain<DedicatedResourcesLead>(created);
  }

  async getAllDedicatedResourcesLeads(): Promise<DedicatedResourcesLead[]> {
    await this.ensureConnection();
    const leads = await DedicatedResourcesLeadModel.find()
      .sort({ createdAt: -1 })
      .lean<DedicatedResourcesLead[]>();
    return leads;
  }

  // Blog Posts
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    await this.ensureConnection();
    const id = await getNextSequence("blog_posts");
    const created = await BlogPostModel.create({ id, ...post });
    return toPlain<BlogPost>(created);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    await this.ensureConnection();
    const posts = await BlogPostModel.find().sort({ createdAt: -1 }).lean<BlogPost[]>();
    return posts;
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    await this.ensureConnection();
    const post = await BlogPostModel.findOne({ slug, isPublished: true }).lean<BlogPost>();
    return post ?? undefined;
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    await this.ensureConnection();
    const posts = await BlogPostModel.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean<BlogPost[]>();
    return posts;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    await this.ensureConnection();
    const posts = await BlogPostModel.find({ isPublished: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .lean<BlogPost[]>();
    return posts;
  }

  async updateBlogPost(
    id: number,
    data: Partial<InsertBlogPost>,
  ): Promise<BlogPost> {
    await this.ensureConnection();
    const updated = await BlogPostModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<BlogPost>();
    if (!updated) {
      throw new Error("Blog post not found");
    }
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await this.ensureConnection();
    await BlogPostModel.deleteOne({ id });
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    await this.ensureConnection();
    const post = await BlogPostModel.findOne({ id }).lean<BlogPost>();
    return post ?? undefined;
  }

  // Newsletter subscribers
  async createNewsletterSubscriber(
    subscriber: InsertNewsletterSubscriber,
  ): Promise<NewsletterSubscriber> {
    await this.ensureConnection();
    const id = await getNextSequence("newsletter_subscribers");
    const created = await NewsletterSubscriberModel.create({ id, ...subscriber });
    return toPlain<NewsletterSubscriber>(created);
  }

  async getNewsletterSubscriberByEmail(
    email: string,
  ): Promise<NewsletterSubscriber | undefined> {
    await this.ensureConnection();
    const subscriber = await NewsletterSubscriberModel.findOne({ email }).lean<NewsletterSubscriber>();
    return subscriber ?? undefined;
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    await this.ensureConnection();
    const subscribers = await NewsletterSubscriberModel.find().sort({ subscribedAt: -1 }).lean<NewsletterSubscriber[]>();
    return subscribers;
  }

  async deleteNewsletterSubscriber(id: number): Promise<void> {
    await this.ensureConnection();
    await NewsletterSubscriberModel.deleteOne({ id });
  }

  // Portfolio Items
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    await this.ensureConnection();
    const id = await getNextSequence("portfolio_items");
    const created = await PortfolioItemModel.create({ id, ...item });
    return toPlain<PortfolioItem>(created);
  }

  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    await this.ensureConnection();
    const items = await PortfolioItemModel.find().sort({ orderIndex: 1, createdAt: -1 }).lean<PortfolioItem[]>();
    return items;
  }

  async getPublicPortfolioItems(): Promise<PortfolioItem[]> {
    await this.ensureConnection();
    const items = await PortfolioItemModel.find({ isActive: true })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    await this.ensureConnection();
    const items = await PortfolioItemModel.find({ isActive: true, isFeatured: true })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  }

  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
    await this.ensureConnection();
    const item = await PortfolioItemModel.findOne({ slug, isActive: true }).lean<PortfolioItem>();
    return item ?? undefined;
  }

  async updatePortfolioItem(
    id: number,
    data: Partial<InsertPortfolioItem>,
  ): Promise<PortfolioItem> {
    await this.ensureConnection();
    const updated = await PortfolioItemModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<PortfolioItem>();
    if (!updated) {
      throw new Error("Portfolio item not found");
    }
    return updated;
  }

  async deletePortfolioItem(id: number): Promise<void> {
    await this.ensureConnection();
    await PortfolioItemModel.deleteOne({ id });
  }

  async getPortfolioContent(): Promise<PortfolioContent> {
    await this.ensureConnection();
    let content = await PortfolioContentModel.findOne().lean<PortfolioContent>();

    if (!content) {
      const id = await getNextSequence("portfolio_content");
      const defaults = this.defaultPortfolioContent();
      const created = await PortfolioContentModel.create({
        id,
        ...defaults,
      });
      return this.normalizePortfolioContent(toPlain<PortfolioContent>(created));
    }

    return this.normalizePortfolioContent(content);
  }

  async upsertPortfolioContent(
    data: InsertPortfolioContent,
  ): Promise<PortfolioContent> {
    await this.ensureConnection();
    const payload = {
      ...data,
      heroStats: data.heroStats ?? [],
      testimonials: data.testimonials ?? [],
    };

    const existing = await PortfolioContentModel.findOne();
    if (!existing) {
      const id = await getNextSequence("portfolio_content");
      const created = await PortfolioContentModel.create({
        id,
        ...payload,
      });
      return this.normalizePortfolioContent(toPlain<PortfolioContent>(created));
    }

    const updated = await PortfolioContentModel.findOneAndUpdate(
      { id: existing.get("id") },
      payload,
      { new: true },
    ).lean<PortfolioContent>();

    if (!updated) {
      throw new Error("Failed to update portfolio content");
    }

    return this.normalizePortfolioContent(updated);
  }
}

export const storage = new DatabaseStorage();
