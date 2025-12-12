<!-- Our Service Backup from Home -->
<!--   {/* Services Section */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-[84%] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Heading */}
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Our Services
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                  White-label services designed to help US agencies deliver
                  faster, scale profitably, and retain clients longer.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 xl:gap-8 items-stretch">
                {services.map((service) => {
                  const Icon = service.icon;

                  return (
                    <Card
                      key={service.id}
                      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* HEADER */}
                      <CardHeader className="flex-shrink-0 pb-3 sm:pb-2">
                        {/* ICON + TITLE ROW */}
                        <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4 bg-brand-coral/10 rounded-lg px-3 py-2 group-hover:bg-brand-coral/20 transition-colors">
                          <Icon className="w-6 h-6 text-brand-coral-darker flex-shrink-0 mt-0.5 sm:mt-0" />
                          <CardTitle className="text-md sm:text-base md:text-md font-bold text-brand-purple leading-snug sm:leading-normal min-h-[36px] sm:min-h-[44px] flex items-center">
                            {service.title}
                          </CardTitle>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed line-clamp-3 sm:line-clamp-4 min-h-[54px] sm:min-h-[72px] md:min-h-[80px]">
                          {service.description}
                        </p>
                      </CardHeader>

                      {/* BODY */}
                      <CardContent className="pt-0 flex flex-col flex-1">
                        <div className="flex flex-col flex-1 space-y-4">
                          {/* PRICING with discount */}
                          {service.discountedPrice && service.originalPrice ? (
                            <div className="space-y-1">
                              {/* Discount badge */}
                              {service.discountLabel && (
                                <div className="inline-flex items-center rounded-full bg-brand-coral/10 px-3 py-1">
                                  <span className="text-[12px] font-bold uppercase tracking-wide text-brand-coral-darker">
                                    {service.discountLabel}
                                  </span>
                                </div>
                              )}

                              {/* Old vs new price */}
                              <div className="flex flex-wrap items-baseline gap-1 text-sm sm:text-base">
                                <span className="text-[11px] sm:text-xs text-gray-500 mr-1">
                                  Starting at
                                </span>

                                <span className="text-sm sm:text-base text-gray-400 line-through mr-1">
                                  {service.originalPrice}
                                  {service.billingUnit && (
                                    <span className="ml-0.5 text-[10px] sm:text-xs">
                                      {service.billingUnit}
                                    </span>
                                  )}
                                </span>

                                <span className="text-base sm:text-lg font-bold text-brand-coral-darker">
                                  {service.discountedPrice}
                                  {service.billingUnit && (
                                    <span className="ml-0.5 text-[10px] sm:text-xs font-medium text-brand-coral-darker/90">
                                      {service.billingUnit}
                                    </span>
                                  )}
                                </span>
                              </div>

                              {/* Extra note like “Average 150% increase…” */}
                              {service.extraNote && (
                                <p className="text-[14px] sm:text-sm text-gray-600">
                                  {service.extraNote}
                                </p>
                              )}
                            </div>
                          ) : (
                            // Fallback for services without discount (e.g., Dedicated Resources)
                            <div className="text-sm sm:text-base md:text-lg font-bold text-brand-coral-darker">
                              {service.pricing}
                            </div>
                          )}

                          {/* FEATURES */}
                          <ul className="space-y-1.5 sm:space-y-2 flex-1">
                            {service.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-xs sm:text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-brand-coral-darker mt-0.5 flex-shrink-0" />
                                <span className="leading-snug">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* BUTTON — STICKS TO BOTTOM */}
                          <div className="mt-4 sm:mt-6 pt-2 border-t border-gray-100">
                            <Link href={service.href}>
                              <Button className="w-full h-11 bg-gradient-to-r from-brand-coral to-brand-coral-dark hover:from-brand-coral-dark hover:to-brand-coral-darker text-white font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-lg">
                                <span className="leading-tight">
                                  Learn More
                                </span>
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>  -->

<!-- End of Our service -->

<!-- Service portfoilio old -->
 <!-- <section className="py-16 px-4 bg-white">

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Service Portfolio
              </h2>
              <p className="text-xl text-gray-700">
                Comprehensive digital solutions delivered under your brand
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.slice(0, 6).map((service) => {
                const Icon = service.icon;
                const hasCoupon = service.couponCode;
                return (
                  <Card key={service.id} className="relative overflow-hidden flex flex-col h-full">
                    {hasCoupon && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-brand-coral text-white text-xs font-bold animate-pulse">
                          {service.discount}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-brand-coral" />
                      </div>
                      <CardTitle className="text-xl font-bold text-brand-purple min-h-[3.5rem] flex items-center">
                        <h3>{service.title}</h3>
                      </CardTitle>
                      <p className="text-gray-700 min-h-[3rem] flex items-start">{service.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="text-2xl font-bold text-brand-purple">
                          {service.pricing}
                        </div>
                        {service.id === "dedicated-resources" ? (
                          <div className="space-y-2 min-h-[2.5rem]">
                            <div className="text-sm text-brand-coral font-semibold">
                              Average 60% cost savings vs. in-house team
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-brand-coral font-semibold min-h-[2.5rem] flex items-start">
                            {service.metrics}
                          </div>
                        )}
                        <ul className="space-y-2 flex-1 min-h-[8rem]">
                          {service.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6 space-y-6">
                        {service.id === "n8n-automations" ? (
                          <>
                            <div className="text-center py-3 mb-2">
                              <span className="text-brand-coral font-semibold text-lg">
                                Coming Soon
                              </span>
                            </div>
                            <Link href={service.href}>
                              <Button
                                variant="outline"
                                className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
                              >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </>
                        ) : hasCoupon ? (
  <div className="space-y-4">
    {!showCoupons[service.id] ? (
      <Button
        onClick={() => handleRevealCoupon(service.id)}
        className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors"
      >
        <Gift className="w-4 h-4 mr-2" />
        Get {service.discount} - {service.discountDescription}
      </Button>
    ) : (
      <div className="space-y-4">
        <div className="p-4 bg-brand-coral/10 border border-brand-coral/20 rounded-lg">
          <div className="text-sm font-medium text-brand-purple mb-3">
            Your coupon code:
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded border">
            <code className="font-mono text-sm font-bold text-brand-purple flex-1">
              {service.couponCode}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleCopyCoupon(service.couponCode, service.id)
              }
              className="h-8 px-3 text-xs border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
            >
              <Copy className="w-3 h-3 mr-1" />
              {couponCopied[service.id] ? "✓" : "Copy"}
            </Button>
          </div>
        </div>
        <Link
          href={`/contact?coupon=${service.couponCode}&service=${service.id}`}
        >
          <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors">
            Use Coupon in Contact Form
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )}

    <Link href={service.href}>
      <Button
        variant="outline"
        className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
      >
        Learn More
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  </div>
)
 : (
                          <Link href={service.href}>
                            <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white transition-colors">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>  -->

<!--  -->


<!-- Portflio Routes -->
 <!-- // Portfolio public routes
  app.get("/api/portfolio", publicContentRateLimit, async (req, res) => {
    try {
      const items = await storage.getPublicPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.get("/api/portfolio/content", publicContentRateLimit, async (req, res) => {
    try {
      const content = await storage.getPortfolioContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching portfolio content:", error);
      res.status(500).json({ message: "Failed to fetch portfolio content" });
    }
  });

  app.get("/api/portfolio/:slug", publicContentRateLimit, async (req, res) => {
    try {
      const slug = req.params.slug;
      const item = await storage.getPortfolioItemBySlug(slug);
      if (!item) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching portfolio item:", error);
      res.status(500).json({ message: "Failed to fetch portfolio item" });
    }
  });

  // Admin portfolio content routes
  app.get("/api/admin/portfolio-content", authenticateAdmin, async (req, res) => {
    try {
      const content = await storage.getPortfolioContent();
      res.json(content);
    } catch (error) {
      console.error("Failed to fetch portfolio content:", error);
      res.status(500).json({ message: "Failed to fetch portfolio content" });
    }
  });

  app.put("/api/admin/portfolio-content", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertPortfolioContentSchema.parse(req.body);
      const content = await storage.upsertPortfolioContent(validated);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Failed to update portfolio content:", error);
      res.status(500).json({ message: "Failed to update portfolio content" });
    }
  });

  // Update hero stats only
  app.put("/api/admin/portfolio-content/stats", authenticateAdmin, async (req, res) => {
    try {
      const { heroStats } = req.body;

      if (!Array.isArray(heroStats)) {
        return res.status(400).json({ message: "heroStats must be an array" });
      }

      // Get existing content and merge with new stats
      const existingContent = await storage.getPortfolioContent();
      const updatedContent = {
        ...existingContent,
        heroStats,
      };

      const validated = insertPortfolioContentSchema.parse(updatedContent);
      const content = await storage.upsertPortfolioContent(validated);
      res.json({ success: true, content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Failed to update portfolio stats:", error);
      res.status(500).json({ message: "Failed to update portfolio stats" });
    }
  });

  // Admin portfolio items routes
  app.get("/api/admin/portfolio-items", authenticateAdmin, async (req, res) => {
    try {
      const items = await storage.getAllPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error("Failed to fetch portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.post("/api/admin/portfolio-items", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validated);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Failed to create portfolio item:", error);
      res.status(500).json({ message: "Failed to create portfolio item" });
    }
  });

  app.put("/api/admin/portfolio-items/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertPortfolioItemSchema.partial().parse(req.body);
      const item = await storage.updatePortfolioItem(id, validated);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Failed to update portfolio item:", error);
      res.status(500).json({ message: "Failed to update portfolio item" });
    }
  });

  app.delete("/api/admin/portfolio-items/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePortfolioItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete portfolio item:", error);
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  }); -->

<!-- 
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
    serviceCategory: String,
  },
  {
    collection: "portfolio_items",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
); -->

<!-- End of Protfolio Routes -->

<!-- Full DB-storage file Sources -->
<!-- 

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
  Appointment,
  InsertAppointment,
  AppointmentStatus,
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
  AppointmentModel,
  GoogleAuthModel,
} from "./models";
import { connectToDatabase, getNextSequence } from "./db";

function toPlain<T>(doc: any): T {
  if (!doc) return doc;
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

  async getAllPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]> {
    await this.ensureConnection();
    const items = await PortfolioItemModel.find({ serviceCategory })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  }

  async getPublicPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]> {
    await this.ensureConnection();
    const items = await PortfolioItemModel.find({
      isActive: true,
      serviceCategory,
    })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean<PortfolioItem[]>();
    return items;
  }


  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    await this.ensureConnection();
    const id = await getNextSequence("appointments");
    const created = await AppointmentModel.create({
      id,
      status: "booked",
      ...appointment,
    });
    return toPlain<Appointment>(created);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    await this.ensureConnection();
    const appt = await AppointmentModel.findOne({ id }).lean<Appointment>();
    return appt ?? undefined;
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    await this.ensureConnection();
    const appts = await AppointmentModel.find({ date })
      .sort({ startTime: 1 })
      .lean<Appointment[]>();
    return appts;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    await this.ensureConnection();
    const appts = await AppointmentModel.find()
      .sort({ date: 1, startTime: 1 })
      .lean<Appointment[]>();
    return appts;
  }

  async getAppointmentsFiltered(params: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: AppointmentStatus;
    serviceType?: string;
    search?: string; // name / email / phone contains
  }): Promise<Appointment[]> {
    await this.ensureConnection();

    const { date, fromDate, toDate, status, serviceType, search } = params;
    const query: any = {};

    if (date) {
      query.date = date;
    } else if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = fromDate;
      if (toDate) query.date.$lte = toDate;
    }

    if (status) {
      query.status = status;
    }

    if (serviceType) {
      query.serviceType = { $regex: serviceType, $options: "i" };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { notes: regex },
      ];
    }

    const appts = await AppointmentModel.find(query)
      .sort({ date: 1, startTime: 1 })
      .lean<Appointment[]>();

    return appts;
  }

  async updateAppointmentStatus(
    id: number,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    await this.ensureConnection();
    const updated = await AppointmentModel.findOneAndUpdate(
      { id },
      { status },
      { new: true },
    ).lean<Appointment>();

    if (!updated) {
      throw new Error("Appointment not found");
    }

    return updated;
  }

  async saveGoogleAuthTokens(tokens: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    email: string;
    calendarId?: string;
  }) {
    await this.ensureConnection();
    const existing = await GoogleAuthModel.findOne();

    if (existing) {
      existing.accessToken = tokens.accessToken;
      existing.refreshToken = tokens.refreshToken;
      existing.expiryDate = tokens.expiryDate;
      existing.email = tokens.email;
      if (tokens.calendarId) {
        existing.calendarId = tokens.calendarId;
      }
      await existing.save();
      return toPlain(existing);
    }

    const id = await getNextSequence("google_auth_tokens");
    const created = await GoogleAuthModel.create({ id, ...tokens });
    return toPlain(created);
  }

  async getGoogleAuthTokens() {
    await this.ensureConnection();
    const row = await GoogleAuthModel.findOne().lean();
    return row ?? null;
  }

}

export const storage = new DatabaseStorage();
 -->
<!-- End of Full DB-storage file Sources  -->

<!-- IStorage Backup -->

<!-- 
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
  Appointment,
  InsertAppointment,
  AppointmentStatus,
} from "@shared/schema";

import { storage as dbStorage } from "./db-storage";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  deleteContact(id: number): Promise<void>;

  createClient(client: InsertClient): Promise<Client>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  updateClientStatus(id: number, status: string): Promise<Client>;

  createSeoAudit(audit: InsertSeoAudit): Promise<SeoAudit>;
  getSeoAudit(id: number): Promise<SeoAudit | undefined>;
  getAuditsByClient(clientId: number): Promise<SeoAudit[]>;
  updateAuditData(
    id: number,
    data: any,
    score: number,
    recommendations: string,
  ): Promise<SeoAudit>;

  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSession(
    sessionId: string,
    messages: any[],
    recommendations?: any[],
  ): Promise<ChatSession>;

  createFeaturedClient(client: InsertFeaturedClient): Promise<FeaturedClient>;
  getFeaturedClientsByService(servicePage: string): Promise<FeaturedClient[]>;
  getAllFeaturedClients(): Promise<FeaturedClient[]>;
  updateFeaturedClient(
    id: number,
    data: Partial<InsertFeaturedClient>,
  ): Promise<FeaturedClient>;
  deleteFeaturedClient(id: number): Promise<void>;

  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]>;
  getAllCaseStudies(): Promise<CaseStudy[]>;
  updateCaseStudy(
    id: number,
    data: Partial<InsertCaseStudy>,
  ): Promise<CaseStudy>;
  deleteCaseStudy(id: number): Promise<void>;

  createPricingPackage(pkg: InsertPricingPackage): Promise<PricingPackage>;
  getPricingPackagesByService(servicePage: string): Promise<PricingPackage[]>;
  getAllPricingPackages(): Promise<PricingPackage[]>;
  updatePricingPackage(
    id: number,
    data: Partial<InsertPricingPackage>,
  ): Promise<PricingPackage>;
  deletePricingPackage(id: number): Promise<void>;

  createServicePage(page: InsertServicePage): Promise<ServicePage>;
  getServicePage(slug: string): Promise<ServicePage | undefined>;
  getAllServicePages(): Promise<ServicePage[]>;
  updateServicePage(
    id: number,
    data: Partial<InsertServicePage>,
  ): Promise<ServicePage>;
  deleteServicePage(id: number): Promise<void>;

  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  getCoupon(code: string): Promise<Coupon | undefined>;
  validateCouponForEmail(
    code: string,
    email: string,
  ): Promise<{ valid: boolean; message: string; coupon?: Coupon }>;
  useCoupon(code: string, email: string): Promise<void>;
  getAllCoupons(): Promise<Coupon[]>;

  createDedicatedResourcesLead(
    lead: InsertDedicatedResourcesLead,
  ): Promise<DedicatedResourcesLead>;
  getAllDedicatedResourcesLeads(): Promise<DedicatedResourcesLead[]>;

  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;

  createNewsletterSubscriber(
    subscriber: InsertNewsletterSubscriber,
  ): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(
    email: string,
  ): Promise<NewsletterSubscriber | undefined>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  deleteNewsletterSubscriber(id: number): Promise<void>;

  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  getPublicPortfolioItems(): Promise<PortfolioItem[]>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined>;
  updatePortfolioItem(
    id: number,
    data: Partial<InsertPortfolioItem>,
  ): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<void>;

  getPortfolioContent(): Promise<PortfolioContent>;
  upsertPortfolioContent(
    data: InsertPortfolioContent,
  ): Promise<PortfolioContent>;

  getAllPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]>;

  getPublicPortfolioItemsByCategory(
    serviceCategory: string,
  ): Promise<PortfolioItem[]>;

  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(
    id: number,
    status: AppointmentStatus,
  ): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsFiltered(params: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: AppointmentStatus;
    serviceType?: string;
    search?: string;
  }): Promise<Appointment[]>;

  saveGoogleAuthTokens(tokens: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    email: string;
    calendarId?: string;
  }): Promise<any>;

  getGoogleAuthTokens(): Promise<any | null>;
}

// ✅ Hook the composed db-storage into this module
export const storage: IStorage = dbStorage;
 -->

<!-- End Of IStorage Backup -->

<!-- SharedSchema Backup -->

<!-- import { z } from "zod";

const jsonValueSchema: z.ZodType<unknown> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.lazy(() => jsonValueSchema)),
  z.record(z.lazy(() => jsonValueSchema)),
]);

// Users
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export interface User extends InsertUser {
  id: number;
}

// Contacts
export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  inquiry_type: z.string().min(1, "Inquiry type is required"),
  message: z.string().min(1, "Message is required"),
  preferred_contact: z.string().min(1, "Preferred contact is required"),
  agencyName: z.string().optional().nullable(),
  country: z.string().min(1, "Country is required"),
  topPriority: z.string().min(1, "Top priority is required"),
  couponCode: z.string().optional().nullable(),
  servicesSelected: z.array(z.string()).optional().nullable(),
  service: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  serviceDetails: jsonValueSchema.optional(),
  automationDetails: jsonValueSchema.optional(),
  dedicatedResourceDetails: jsonValueSchema.optional(),
  websiteDetails: jsonValueSchema.optional(),
  contactFormType: z.string().optional().nullable(),
}).passthrough(); // Allow additional fields

export type InsertContact = z.infer<typeof insertContactSchema>;
export interface Contact extends InsertContact {
  id: number;
  createdAt: Date;
  contactFormType: string;
}

// Clients
export const insertClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  region: z.string().optional(),
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export interface Client extends InsertClient {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// SEO Audits
export const insertSeoAuditSchema = z.object({
  websiteUrl: z.string().min(1),
  clientId: z.number().int(),
  status: z.string().optional(),
});
export type InsertSeoAudit = z.infer<typeof insertSeoAuditSchema>;
export interface SeoAudit {
  id: number;
  clientId: number;
  websiteUrl: string;
  auditData?: unknown;
  score?: number | null;
  status: string;
  recommendations?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
}

// Chat Sessions
export const insertChatSessionSchema = z.object({
  sessionId: z.string().min(1),
  clientInfo: jsonValueSchema.optional(),
});
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export interface ChatSession extends InsertChatSession {
  id: number;
  messages: unknown[];
  recommendations?: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

// Featured Clients
export const insertFeaturedClientSchema = z.object({
  servicePage: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().optional(),
  website: z.string().optional(),
  description: z.string().min(1),
  achievements: z.array(z.string()),
  industry: z.string().min(1),
  timeframe: z.string().min(1),
  isActive: z.boolean().optional(),
});
export type InsertFeaturedClient = z.infer<typeof insertFeaturedClientSchema>;
export interface FeaturedClient extends InsertFeaturedClient {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Case Studies
export const insertCaseStudySchema = z.object({
  servicePage: z.string().min(1),
  title: z.string().min(1),
  client: z.string().min(1),
  industry: z.string().min(1),
  results: jsonValueSchema,
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export interface CaseStudy extends InsertCaseStudy {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const insertPortfolioItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  industry: z.string().min(1),
  client: z.string().optional(),
  badge: z.string().optional(),
  investment: z.string().optional(),
  totalValue: z.string().optional(),
  roi: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  imageUrl: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  orderIndex: z.number().int().optional(),
  isActive: z.boolean().optional(),
  serviceCategory: z.string().optional(),
});
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export interface PortfolioItem extends InsertPortfolioItem {
  id: number;
  isFeatured: boolean;
  orderIndex: number;
  isActive: boolean;
  serviceCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const heroStatSchema = z.object({
  kpi: z.string().min(1),
  label: z.string().min(1),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  who: z.string().min(1),
  tag: z.string().optional(),
});

export const insertPortfolioContentSchema = z.object({
  heroTitle: z.string().min(1),
  heroHighlight: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroStats: z.array(heroStatSchema).optional(),
  heroPrimaryCtaText: z.string().optional(),
  heroPrimaryCtaHref: z.string().optional(),
  heroSecondaryCtaText: z.string().optional(),
  heroSecondaryCtaHref: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  testimonialsSubtitle: z.string().optional(),
  testimonials: z.array(testimonialSchema).optional(),
});
export type InsertPortfolioContent = z.infer<typeof insertPortfolioContentSchema>;
export interface PortfolioContent extends InsertPortfolioContent {
  id: number;
  heroStats: z.infer<typeof heroStatSchema>[];
  testimonials: z.infer<typeof testimonialSchema>[];
  createdAt: Date;
  updatedAt: Date;
}

// Pricing Packages
export const insertPricingPackageSchema = z.object({
  servicePage: z.string().min(1),
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()),
  isPopular: z.boolean().optional(),
  orderIndex: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type InsertPricingPackage = z.infer<typeof insertPricingPackageSchema>;
export interface PricingPackage extends InsertPricingPackage {
  id: number;
  isPopular: boolean;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service Pages
export const insertServicePageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  auditFormType: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type InsertServicePage = z.infer<typeof insertServicePageSchema>;
export interface ServicePage extends InsertServicePage {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Coupons
export const insertCouponSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  discountPercentage: z.number().int().min(0),
  maxUses: z.number().int().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().optional(),
});
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export interface Coupon extends Omit<InsertCoupon, "expiresAt"> {
  id: number;
  maxUses: number | null;
  currentUses: number;
  expiresAt?: Date | null;
  createdAt: Date;
}

// Coupon Usage
export const insertCouponUsageSchema = z.object({
  couponId: z.number().int(),
  email: z.string().email(),
});
export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;
export interface CouponUsage extends InsertCouponUsage {
  id: number;
  usedAt: Date;
}

// Dedicated Resources Leads
export const insertDedicatedResourcesLeadSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  resourceType: z.string().min(1),
  hiringLevel: z.string().optional(),
  multipleResources: jsonValueSchema.optional(),
  additionalNotes: z.string().optional(),
});
export type InsertDedicatedResourcesLead = z.infer<
  typeof insertDedicatedResourcesLeadSchema
>;
export interface DedicatedResourcesLead
  extends InsertDedicatedResourcesLead {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Posts
export const insertBlogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  readTime: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaDescription: z.string().optional(),
  metaTitle: z.string().optional(),
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export interface BlogPost extends InsertBlogPost {
  id: number;
  tags?: string[];
  author: string;
  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter Subscribers
export const insertNewsletterSubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});
export type InsertNewsletterSubscriber = z.infer<
  typeof insertNewsletterSubscriberSchema
>;
export interface NewsletterSubscriber extends InsertNewsletterSubscriber {
  id: number;
  subscribedAt: Date;
}

export type AppointmentStatus = "booked" | "cancelled" | "completed";

export interface Appointment {
  id: number;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;      // now potentially comma-separated list
  notes?: string;

  date: string;              // YYYY-MM-DD
  startTime: string;         // HH:mm
  endTime: string;           // HH:mm

  meetingLink?: string;

  // NEW: guests
  guestEmails?: string[];    // extra attendees (if any)

  status: AppointmentStatus;

  createdAt: Date;
  updatedAt?: Date;
}

export type InsertAppointment = Omit<
  Appointment,
  "id" | "status" | "createdAt" | "updatedAt"
>;

 -->

<!-- End of SharedSchema -->

db.getCollection("portfolio_items").insertMany([
  {
    _id: ObjectId("6915af858bce42ae65cb93cb"),
    id: 1,
    slug: "ac-graphics-arm",
    title: "AC Graphics CRM",
    industry: "Manufacturing",
    client: "Mathew",
    badge: "Phase-Based Implementation",
    investment: "$2.3K",
    totalValue: "$7.5K",
    roi: "226%",
    description: "Custom CRM system with lead automation, pipeline tracking, and quote generation.",
    features: [
      "Lead automation",
      "Pipeline tracking",
      "Quote generation",
      "Client management"
    ],
    techStack: [
      "Typescript",
      "MongoDB"
    ],
    timeline: "2 months Phase 1, scalable",
    imageUrl: "/upload_image/portfolio_images/ac-graphics-1763030982614-320181973.jpg",
    isFeatured: true,
    orderIndex: 1,
    isActive: true,
    createdAt: ISODate("2025-11-13T10:14:29.994Z"),
    updatedAt: ISODate("2025-11-17T09:38:34.569Z"),
    image: "/upload_image/portfolio_images/ac-graphics-1763030982614-320181973.jpg",
    serviceCategory: "custom-app-development"
  },

  {
    _id: ObjectId("6915b6e58bce42ae65cb9407"),
    id: 2,
    slug: "myvkard",
    title: "MyVKard",
    industry: "SaaS Startup",
    client: "MyVKard",
    badge: "Rapid MVP Development",
    investment: "$2.3k",
    totalValue: "$12k",
    roi: "422%",
    description: "NFC-enabled digital identity platform with payment processing and customer dashboard.",
    features: [
      "NFC integration",
      "Payment processing",
      "Profile builder",
      "QR code generation"
    ],
    techStack: [
      "React JS Vite",
      "Node.js",
      "Stripe API",
      "NFC Protocols"
    ],
    timeline: "7 weeks from concept to launch",
    imageUrl: "/upload_image/portfolio_images/myvkard-nfc1-1763030755477-346132474.png",
    isFeatured: true,
    orderIndex: 2,
    isActive: true,
    createdAt: ISODate("2025-11-13T10:45:57.634Z"),
    updatedAt: ISODate("2025-11-17T09:38:18.668Z"),
    image: "/upload_image/portfolio_images/myvkard-nfc1-1763030755477-346132474.png",
    serviceCategory: "custom-app-development"
  },

  {
    _id: ObjectId("6915b79a8bce42ae65cb940d"),
    id: 3,
    slug: "wellenplus-health-app",
    title: "Wellenpuls Health App",
    industry: "HealthTech",
    client: "Wellenpuls Health App",
    badge: "Hardware Integration",
    investment: "$1.3K",
    totalValue: "$10K",
    roi: "669%",
    description: "Mobile health application with Bluetooth hardware integration and AI-powered insights.",
    features: [
      "Bluetooth connectivity",
      "AI health coach",
      "Progress tracking",
      "Personalized insights"
    ],
    techStack: [
      "React Native",
      "Bluetooth APIs",
      "AI Integration"
    ],
    timeline: "6 weeks mobile development",
    imageUrl: "/upload_image/portfolio_images/wellenpuls-app-1763030959964-27829571.png",
    isFeatured: true,
    orderIndex: 3,
    isActive: true,
    createdAt: ISODate("2025-11-13T10:48:58.210Z"),
    updatedAt: ISODate("2025-11-17T09:38:08.127Z"),
    image: "/upload_image/portfolio_images/wellenpuls-app-1763030959964-27829571.png",
    serviceCategory: "custom-app-development"
  },

  {
    _id: ObjectId("6915bdc08bce42ae65cb945b"),
    id: 4,
    slug: "octupus-ai",
    title: "Octupus.ai – AI Agent Platform",
    industry: "Telecom Industry",
    client: "Octupus.ai",
    badge: "AI Agent Featured Platform",
    investment: "$6.9K",
    totalValue: "$24K",
    roi: "247%",
    description: "Multi-agent AI platform with human-in-the-loop review, tool orchestration, and workflow automation.",
    features: [],
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Express",
      "PostgreSQL",
      "OpenAI",
      "GPT-4",
      "LinkedIn API",
      "Facebook API",
      "Instagram API",
      "AWS",
      "Docker",
      "Redis"
    ],
    timeline: "6 weeks",
    imageUrl: "/upload_image/portfolio_images/octupus-1763032358282-852385614.png",
    isFeatured: true,
    orderIndex: 0,
    isActive: true,
    createdAt: ISODate("2025-11-13T11:15:12.536Z"),
    updatedAt: ISODate("2025-11-17T09:52:40.773Z"),
    image: "/upload_image/portfolio_images/octupus-1763032358282-852385614.png",
    serviceCategory: "custom-app-development"
  }
])



<section className="py-20 px-6 bg-gradient-to-br from-[#2B0A3D] via-[#4D1A59] to-[#8A2E70] text-white">
            <div className="max-w-7xl mx-auto">

              {/* SECTION HEADER */}
              <div className="text-center mb-12">
                <h2 className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  🚀 NEW: AI Search Optimization (AIO)
                </h2>
                <h3 className="text-4xl font-bold mb-4">Rank Inside AI Search Results</h3>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Get your brand ranked in Google SGE, Perplexity, Copilot, ChatGPT Search
                  — the future of search visibility.
                </p>
              </div>

              {/* 3 PACKAGE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* STARTER AIO */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-7 backdrop-blur-xl shadow-xl">
                  <h4 className="text-2xl font-bold mb-2">Starter AIO</h4>
                  <p className="text-3xl font-extrabold text-brand-yellow mb-4">$650 <span className="text-lg text-white/90">/mo</span></p>
                  <ul className="space-y-2 text-white/90 mb-6">
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> AIO baseline audit</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 10 AI-intent keywords</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 5 pages AI-formatted</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Basic schema + entity setup</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 1 AIO blog / month</li>
                  </ul>
                  <Link href="/services/ai-search-optimization">
                    <Button className="w-full bg-white text-brand-purple hover:bg-brand-coral hover:text-white">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* GROWTH AIO */}
                <div className="rounded-2xl bg-white/20 border-2 border-brand-yellow p-7 shadow-2xl backdrop-blur-xl scale-[1.03]">
                  <Badge className="bg-brand-yellow text-black mb-3 px-3 py-1">Most Popular</Badge>
                  <h4 className="text-2xl font-bold mb-2">Growth AIO</     h4>
                  <p className="text-3xl font-extrabold text-brand-yellow mb-4">$900 <span className="text-lg text-white/90">/mo</span></p>
                  <ul className="space-y-2 text-white/90 mb-6">
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Full semantic AIO audit</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 25 AI-intent keywords</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 10 pages rewritten</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Enhanced schema & topic graph</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 2 blogs + 5 links / month</li>
                  </ul>
                  <Link href="/services/ai-search-optimization">
                    <Button className="w-full bg-brand-purple text-white hover:bg-brand-coral hover:text-white">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* PRO AIO */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-7 backdrop-blur-xl shadow-xl">
                  <h4 className="text-2xl font-bold mb-2">Pro AIO</h4>
                  <p className="text-3xl font-extrabold text-brand-yellow mb-4">$1,200 <span className="text-lg text-white/90">/mo</span></p>
                  <ul className="space-y-2 text-white/90 mb-6">
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Deep AIO crawl</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 50+ AI-intent keywords</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 20 predictive-optimized pages</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Advanced schema + topic clusters</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 4 blogs + 10 links / month</li>
                  </ul>
                  <Link href="/services/ai-search-optimization">
                    <Button className="w-full bg-white text-brand-purple hover:bg-brand-coral hover:text-white">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

              </div>

              {/* BOTTOM CTA */}
              <div className="text-center mt-14">
                <Link href="/services/ai-search-optimization">
                  <Button className="bg-brand-coral text-white font-bold px-8 py-4 hover:bg-brand-purple hover:text-white">
                    Explore Full AIO Service
                    {/* <ArrowRight className="ml-2 w-4 h-4" /> */}
                  </Button>
                </Link>
              </div>

            </div>
          </section>







          -------------------------------------------------------------------------

          // import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Slider } from '@/components/ui/slider';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import { Calculator, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight, Trophy, AlertCircle, Plus, Send } from 'lucide-react';
// import { useMutation } from '@tanstack/react-query';
// import { apiRequest } from '@/lib/queryClient';
// import { useToast } from '@/hooks/use-toast';
// import { Header } from '@/components/header';
// import { Footer } from '@/components/footer';
// import { SEOHead } from '@/components/seo-head';
// import { SchemaMarkup } from '@/components/schema-markup';
// import { Breadcrumbs } from '@/components/breadcrumbs';
// import { Helmet } from 'react-helmet';

// interface PricingResult {
//   service: string;
//   monthlyPrice: number;
//   setupFee: number;
//   features: string[];
//   teamDiscount?: number;
//   savings?: number;
//   isProjectBased?: boolean;
// }

// export default function PricingCalculator() {
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [currentStep, setCurrentStep] = useState<number>(1);

//   // Contact form modal state
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [contactForm, setContactForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     website: ''
//   });

//   const { toast } = useToast();

//   // Helper function to extract domain from various URL formats
//   const extractDomain = (url: string): string => {
//     if (!url) return '';

//     // Remove common prefixes and clean up the URL
//     let cleanUrl = url.trim().toLowerCase();

//     // Remove protocol if present
//     cleanUrl = cleanUrl.replace(/^https?:\/\//, '');

//     // Remove www. if present
//     cleanUrl = cleanUrl.replace(/^www\./, '');

//     // Remove trailing slash and paths
//     cleanUrl = cleanUrl.split('/')[0];

//     // Remove port numbers if present
//     cleanUrl = cleanUrl.split(':')[0];

//     return cleanUrl;
//   };

//   // Contact form submission mutation
//   const contactMutation = useMutation({
//     mutationFn: async (data: any) => {
//       return await apiRequest("/api/contacts", "POST", data);
//     },
//     onSuccess: () => {
//       toast({
//         title: "Quote Request Submitted!",
//         description: "Thank you for your interest. We'll contact you within 24 hours with a detailed proposal.",
//         duration: 5000,
//       });

//       // Reset and close modal
//       setContactForm({ name: '', email: '', phone: '', website: '' });
//       setShowContactModal(false);

//       // Redirect to Calendly after a brief delay
//       setTimeout(() => {
//         window.open("https://calendly.com/vignesh-velusamy/30min", "_blank");
//       }, 1000);
//     },
//     onError: (error: any) => {
//       console.error('Contact form error:', error);

//       let errorMessage = "Please try again or contact us directly.";
//       if (error?.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error?.message) {
//         errorMessage = error.message;
//       }

//       toast({
//         title: "Please check your information",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   });

//   // Handle contact form submission
//   const handleContactSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!contactForm.name || !contactForm.email) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in your name and email address.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Build comprehensive message with all pricing calculator details
//     let comprehensiveMessage = `Pricing Calculator Quote Request for ${selectedService}`;

//     if (pricing) {
//       comprehensiveMessage += `\n\n📋 SERVICE DETAILS:`;
//       comprehensiveMessage += `\n• Service: ${pricing.service}`;
//       comprehensiveMessage += `\n• Monthly Price: $${pricing.monthlyPrice.toLocaleString()}`;
//       if (pricing.setupFee > 0) {
//         comprehensiveMessage += `\n• Setup Fee: $${pricing.setupFee.toLocaleString()}`;
//       }
//       if (pricing.teamDiscount) {
//         comprehensiveMessage += `\n• Team Discount: ${pricing.teamDiscount}%`;
//       }
//       if (pricing.savings) {
//         comprehensiveMessage += `\n• Annual Savings: $${pricing.savings.toLocaleString()}`;
//       }

//       if (pricing.features && pricing.features.length > 0) {
//         comprehensiveMessage += `\n\n✨ INCLUDED FEATURES:`;
//         pricing.features.forEach(feature => {
//           comprehensiveMessage += `\n• ${feature}`;
//         });
//       }
//     }

//     // Add dedicated team selections if any
//     if (Object.keys(selectedTeam).length > 0) {
//       comprehensiveMessage += `\n\n👥 DEDICATED TEAM SELECTED:`;
//       Object.entries(selectedTeam).forEach(([resource, levels]) => {
//         Object.entries(levels).forEach(([level, count]) => {
//           if (count > 0) {
//             comprehensiveMessage += `\n• ${count}x ${resource.replace(/-/g, ' ')} (${level} level)`;
//           }
//         });
//       });
//     }

//     // Add Google Ads client count if specified
//     if (selectedService === 'google-ads' && clients.length > 0) {
//       comprehensiveMessage += `\n\n🎯 GOOGLE ADS DETAILS:`;
//       comprehensiveMessage += `\n• Number of client accounts: ${clients.length}`;
//     }

//     // Add SEO client count if specified
//     if (selectedService === 'seo' && seoClients.length > 0) {
//       comprehensiveMessage += `\n\n🔍 SEO DETAILS:`;
//       comprehensiveMessage += `\n• Number of client websites: ${seoClients.length}`;
//     }

//     // Prepare detailed submission data with pricing calculator selections
//     const submissionData = {
//       name: contactForm.name,
//       email: contactForm.email,
//       phone: contactForm.phone || '',
//       company: contactForm.website ? extractDomain(contactForm.website) : '',
//       inquiry_type: 'pricing-calculator',
//       message: comprehensiveMessage,
//       preferred_contact: 'email',
//       country: 'US',
//       topPriority: selectedService,
//       couponCode: null,
//       service: selectedService,
//       serviceDetails: {
//         service: selectedService,
//         pricing: pricing,
//         dedicatedTeam: selectedTeam,
//         googleAdsClients: clients,
//         seoClients: seoClients,
//         calculatorData: {
//           totalMonthlyPrice: pricing?.monthlyPrice || 0,
//           setupFee: pricing?.setupFee || 0,
//           teamDiscount: pricing?.teamDiscount || 0,
//           savings: pricing?.savings || 0,
//           features: pricing?.features || []
//         }
//       }
//     };

//     contactMutation.mutate(submissionData);
//   };

//   // Dedicated Resources State - Multi-team builder
//   const [selectedTeam, setSelectedTeam] = useState<Record<string, Record<string, number>>>({});
//   const [activeResourceType, setActiveResourceType] = useState<string>('');

//   // Google Ads State - Individual client management
//   const [clients, setClients] = useState<Array<{
//     id: string;
//     name: string;
//     website: string;
//     monthlyAdSpend: number;
//     campaigns: number;
//     campaignTypes: string[];
//     industry: string;
//     customIndustry: string;
//   }>>([]);
//   const [showAddClient, setShowAddClient] = useState(false);
//   const [newClient, setNewClient] = useState({
//     name: '',
//     website: '',
//     monthlyAdSpend: 2000,
//     campaigns: 1,
//     campaignTypes: [] as string[],
//     industry: '',
//     customIndustry: ''
//   });

//   // SEO State - Individual client management
//   const [seoClients, setSeoClients] = useState<Array<{
//     id: string;
//     name: string;
//     website: string;
//     targetKeywords: number;
//     competitionLevel: string;
//     industry: string;
//     customIndustry: string;
//     currentRanking: string;
//     competitors: string[];
//   }>>([]);
//   const [showAddSeoClient, setShowAddSeoClient] = useState(false);
//   const [newSeoClient, setNewSeoClient] = useState({
//     name: '',
//     website: '',
//     targetKeywords: 10,
//     competitionLevel: 'medium',
//     industry: '',
//     customIndustry: '',
//     currentRanking: 'page-2-3',
//     competitors: ['', '', '']
//   });

//   // SEO State
//   const [websiteCount, setWebsiteCount] = useState<number>(1);
//   const [businessType, setBusinessType] = useState<string>('');
//   const [currentRankings, setCurrentRankings] = useState<string>('');
//   const [targetKeywords, setTargetKeywords] = useState<number>(20);
//   const [contentNeeds, setContentNeeds] = useState<string[]>([]);

//   // Web Development State
//   const [websiteType, setWebsiteType] = useState<string>('');
//   const [websiteComplexity, setWebsiteComplexity] = useState<string>('');
//   const [integrations, setIntegrations] = useState<string[]>([]);
//   const [designRequirements, setDesignRequirements] = useState<string>('');
//   const [maintenanceNeeds, setMaintenanceNeeds] = useState<string>('');

//   // E-commerce specific state
//   const [ecommercePlatform, setEcommercePlatform] = useState<string>('');
//   const [productCount, setProductCount] = useState<number>(50);
//   const [productPageFeatures, setProductPageFeatures] = useState<string[]>([]);

//   // AI Development State
//   const [aiProjectType, setAiProjectType] = useState<string>('');
//   const [aiComplexity, setAiComplexity] = useState<string>('');
//   const [aiIntegrations, setAiIntegrations] = useState<string[]>([]);
//   const [dataVolume, setDataVolume] = useState<string>('');
//   const [customModels, setCustomModels] = useState<boolean>(false);
//   const [maintenanceSupport, setMaintenanceSupport] = useState<string>('');

//   // Available resource types from Google Doc pricing structure
//   const resourceTypes = [
//     'Graphic Designer',
//     'Video Editor',
//     'SEO Specialist',
//     'Google Ads Expert',
//     'Web Developer',
//     'Full Stack Developer',
//     'Social Media Manager',
//     'AI Developer',
//     'Virtual Assistant'
//   ];

//   // Skill levels available for each resource type - all resources have all skill levels
//   const getSkillLevelsForResource = (resourceType: string) => {
//     return ['junior', 'mid', 'senior'];
//   };

//   // Pricing data matching Google Docs pricing structure
//   const dedicatedResourcesPricing = {
//     junior: {
//       'Graphic Designer': 1000,
//       'Video Editor': 1000,
//       'SEO Specialist': 1000,
//       'Google Ads Expert': 1200,
//       'Web Developer': 1000,
//       'Full Stack Developer': 1200,
//       'Social Media Manager': 1000,
//       'AI Developer': 800,
//       'Virtual Assistant': 800
//     },
//     mid: {
//       'Graphic Designer': 1200,
//       'Video Editor': 1400,
//       'SEO Specialist': 1800,
//       'Google Ads Expert': 2000,
//       'Web Developer': 1800,
//       'Full Stack Developer': 2000,
//       'Social Media Manager': 1400,
//       'AI Developer': 1000,
//       'Virtual Assistant': 1000
//     },
//     senior: {
//       'Graphic Designer': 2000,
//       'Video Editor': 2200,
//       'SEO Specialist': 2800,
//       'Google Ads Expert': 3000,
//       'Web Developer': 2800,
//       'Full Stack Developer': 3500,
//       'Social Media Manager': 2200,
//       'AI Developer': 1400,
//       'Virtual Assistant': 1500
//     }
//   };

//   const googleAdsPricing = {
//     starter: { price: 399, minSpend: 1000, maxSpend: 3000 },
//     growth: { price: 799, minSpend: 3000, maxSpend: 8000 },
//     scale: { price: 1299, minSpend: 8000, maxSpend: 15000 }
//   };

//   const seoPricing = {
//     starter: 400,
//     growth: 650,
//     pro: 1200
//   };

//   const webDevelopmentPricing = {
//     'wordpress-starter': 600,
//     'wordpress-business': 1200,
//     'wordpress-ecommerce': 1500,
//     'shopify-starter': 750,
//     'shopify-business': 1499,
//     'shopify-advanced': 2499,
//     'bigcommerce-starter': 850,
//     'bigcommerce-business': 1600,
//     'bigcommerce-advanced': 2799,
//     'full-stack-site': 999,
//     'custom-business': 2499,
//     'custom-advanced': 4999
//   };

//   // Team builder helper functions
//   const addResourceToTeam = (resourceType: string, skillLevel: string, count: number) => {
//     setSelectedTeam(prev => ({
//       ...prev,
//       [resourceType]: {
//         ...prev[resourceType],
//         [skillLevel]: (prev[resourceType]?.[skillLevel] || 0) + count
//       }
//     }));
//   };

//   const updateResourceCount = (resourceType: string, skillLevel: string, count: number) => {
//     if (count <= 0) {
//       removeResourceFromTeam(resourceType, skillLevel);
//       return;
//     }
//     setSelectedTeam(prev => ({
//       ...prev,
//       [resourceType]: {
//         ...prev[resourceType],
//         [skillLevel]: count
//       }
//     }));
//   };

//   const removeResourceFromTeam = (resourceType: string, skillLevel: string) => {
//     setSelectedTeam(prev => {
//       const newTeam = { ...prev };
//       if (newTeam[resourceType]) {
//         delete newTeam[resourceType][skillLevel];
//         if (Object.keys(newTeam[resourceType]).length === 0) {
//           delete newTeam[resourceType];
//         }
//       }
//       return newTeam;
//     });
//   };

//   // Calculate total team size for discounts
//   const getTotalTeamSize = (): number => {
//     return Object.values(selectedTeam).reduce((total, skillLevels) =>
//       total + Object.values(skillLevels).reduce((sum, count) => sum + count, 0), 0
//     );
//   };

//   // Team discount calculation
//   const getTeamDiscount = (size: number): number => {
//     if (size >= 8) return 20;
//     if (size >= 5) return 15;
//     if (size >= 3) return 10;
//     if (size >= 2) return 5;
//     return 0;
//   };

//   // Client management functions
//   const addClient = () => {
//     if (!newClient.name.trim()) return;

//     const client = {
//       id: Date.now().toString(),
//       name: newClient.name,
//       website: newClient.website,
//       monthlyAdSpend: newClient.monthlyAdSpend,
//       campaigns: newClient.campaigns,
//       campaignTypes: [...newClient.campaignTypes],
//       industry: newClient.industry === 'other' ? newClient.customIndustry : newClient.industry,
//       customIndustry: newClient.customIndustry
//     };

//     setClients(prev => [...prev, client]);
//     setNewClient({
//       name: '',
//       website: '',
//       monthlyAdSpend: 2000,
//       campaigns: 1,
//       campaignTypes: [],
//       industry: '',
//       customIndustry: ''
//     });
//     setShowAddClient(false);
//   };

//   const removeClient = (clientId: string) => {
//     setClients(prev => prev.filter(c => c.id !== clientId));
//   };

//   const updateClient = (clientId: string, updates: Partial<typeof newClient>) => {
//     setClients(prev => prev.map(c =>
//       c.id === clientId ? { ...c, ...updates } : c
//     ));
//   };

//   // Calculate price for individual client based on their specific needs
//   const calculateClientPrice = (client: typeof clients[0]): number => {
//     let basePrice = 0;
//     if (client.monthlyAdSpend <= 3000) {
//       basePrice = googleAdsPricing.starter.price;
//     } else if (client.monthlyAdSpend <= 8000) {
//       basePrice = googleAdsPricing.growth.price;
//     } else {
//       basePrice = googleAdsPricing.scale.price;
//     }

//     // Campaign scaling: Each additional campaign adds 15% of base price
//     let scaledPrice = basePrice;
//     if (client.campaigns > 1) {
//       scaledPrice += (client.campaigns - 1) * (basePrice * 0.15);
//     }

//     // Complexity bonus for multiple campaign types
//     if (client.campaignTypes.length > 3) {
//       scaledPrice += scaledPrice * 0.1; // 10% bonus for high complexity
//     }

//     return Math.round(scaledPrice);
//   };

//   // SEO Client management functions
//   const addSeoClient = () => {
//     if (!newSeoClient.name.trim()) return;

//     const client = {
//       id: Date.now().toString(),
//       name: newSeoClient.name,
//       website: newSeoClient.website,
//       targetKeywords: newSeoClient.targetKeywords,
//       competitionLevel: newSeoClient.competitionLevel,
//       industry: newSeoClient.industry === 'other' ? newSeoClient.customIndustry : newSeoClient.industry,
//       customIndustry: newSeoClient.customIndustry,
//       currentRanking: newSeoClient.currentRanking,
//       competitors: newSeoClient.competitors.filter(c => c.trim() !== '')
//     };

//     setSeoClients(prev => [...prev, client]);
//     setNewSeoClient({
//       name: '',
//       website: '',
//       targetKeywords: 10,
//       competitionLevel: 'medium',
//       industry: '',
//       customIndustry: '',
//       currentRanking: 'page-2-3',
//       competitors: ['', '', '']
//     });
//     setShowAddSeoClient(false);
//   };

//   const removeSeoClient = (clientId: string) => {
//     setSeoClients(prev => prev.filter(c => c.id !== clientId));
//   };

//   // Calculate price for individual SEO client based on their specific needs
//   const calculateSeoClientPrice = (client: typeof seoClients[0]): number => {
//     // Base pricing based on keyword count
//     let basePrice = 0;
//     if (client.targetKeywords <= 15) {
//       basePrice = seoPricing.starter;
//     } else if (client.targetKeywords <= 30) {
//       basePrice = seoPricing.growth;
//     } else {
//       basePrice = seoPricing.pro;
//     }

//     // Competition level multiplier
//     let competitionMultiplier = 1;
//     if (client.competitionLevel === 'high') {
//       competitionMultiplier = 1.3;
//     } else if (client.competitionLevel === 'very-high') {
//       competitionMultiplier = 1.5;
//     } else if (client.competitionLevel === 'low') {
//       competitionMultiplier = 0.8;
//     }

//     // Current ranking adjustment (easier to improve from page 1 = lower cost)
//     let rankingMultiplier = 1;
//     if (client.currentRanking === 'not-ranking') {
//       rankingMultiplier = 1.2; // More work needed
//     } else if (client.currentRanking === 'page-1') {
//       rankingMultiplier = 0.9; // Already ranking well
//     }

//     return Math.round(basePrice * competitionMultiplier * rankingMultiplier);
//   };

//   const calculatePricing = (): PricingResult | null => {
//     if (!selectedService) return null;

//     let result: PricingResult = {
//       service: selectedService,
//       monthlyPrice: 0,
//       setupFee: 0,
//       features: [],
//       teamDiscount: 0,
//       savings: 0
//     };

//     switch (selectedService) {
//       case 'dedicated-resources':
//         if (Object.keys(selectedTeam).length === 0) return null;

//         let totalPrice = 0;
//         const features: string[] = [];
//         const totalTeamSize = getTotalTeamSize();
//         const discount = getTeamDiscount(totalTeamSize);

//         // Calculate price for each resource type and skill level
//         Object.entries(selectedTeam).forEach(([resourceType, skillLevels]) => {
//           Object.entries(skillLevels).forEach(([skillLevel, count]) => {
//             const price = dedicatedResourcesPricing[skillLevel as keyof typeof dedicatedResourcesPricing][resourceType as keyof typeof dedicatedResourcesPricing.junior] || 1500;
//             const discountedPrice = price * (1 - discount / 100);
//             totalPrice += discountedPrice * count;

//             features.push(`${count} ${skillLevel} ${resourceType}${count > 1 ? 's' : ''}`);
//           });
//         });

//         // Check if dedicated manager is needed
//         const needsDedicatedManager = totalPrice > 5000 || totalTeamSize > 6;
//         const managerFeatures = needsDedicatedManager ? ['Dedicated account manager included'] : [];

//         result = {
//           service: 'Dedicated Resources Team',
//           monthlyPrice: Math.round(totalPrice),
//           setupFee: 0,
//           features: [
//             ...features,
//             'Full-time dedicated resources',
//             'Your agency branding',
//             'Direct communication access',
//             'Monthly performance reports',
//             ...managerFeatures
//           ],
//           teamDiscount: discount,
//           savings: discount > 0 ? Math.round(totalPrice * discount / (100 - discount)) : 0
//         };
//         break;

//       case 'google-ads':
//         if (clients.length === 0) return null;

//         // Calculate total price across all clients
//         const totalMonthlyPrice = clients.reduce((total, client) => {
//           return total + calculateClientPrice(client);
//         }, 0);

//         const totalCampaigns = clients.reduce((total, client) => total + client.campaigns, 0);
//         const totalAdSpend = clients.reduce((total, client) => total + client.monthlyAdSpend, 0);
//         const allCampaignTypes = Array.from(new Set(clients.flatMap(c => c.campaignTypes)));
//         const allIndustries = Array.from(new Set(clients.map(c => c.industry).filter(Boolean)));

//         result = {
//           service: 'Google Ads Management',
//           monthlyPrice: totalMonthlyPrice,
//           setupFee: 0,
//           features: [
//             `Managing ${clients.length} client${clients.length > 1 ? 's' : ''} with ${totalCampaigns} total campaigns`,
//             `Total ad spend: $${totalAdSpend.toLocaleString()}/month across all clients`,
//             `Campaign types: ${allCampaignTypes.join(', ') || 'Not specified'}`,
//             `Industries: ${allIndustries.join(', ') || 'Not specified'}`,
//             'Individual client optimization strategies',
//             'Conversion tracking setup for each client',
//             'Monthly performance reports per client',
//             'Dedicated ads specialist',
//             'Ongoing optimization & A/B testing'
//           ],
//           teamDiscount: 0,
//           savings: 0
//         };
//         break;

//       case 'seo':
//         if (seoClients.length === 0) return null;

//         // Calculate total price across all SEO clients
//         const totalSeoPrice = seoClients.reduce((total, client) => {
//           return total + calculateSeoClientPrice(client);
//         }, 0);

//         const totalKeywords = seoClients.reduce((total, client) => total + client.targetKeywords, 0);
//         const allSeoIndustries = Array.from(new Set(seoClients.map(c => c.industry).filter(Boolean)));
//         const competitionLevels = Array.from(new Set(seoClients.map(c => c.competitionLevel)));

//         result = {
//           service: 'SEO Services',
//           monthlyPrice: totalSeoPrice,
//           setupFee: 0,
//           features: [
//             `Managing ${seoClients.length} website${seoClients.length > 1 ? 's' : ''} with ${totalKeywords} total keywords`,
//             `Industries: ${allSeoIndustries.join(', ') || 'Not specified'}`,
//             `Competition levels: ${competitionLevels.join(', ')}`,
//             'Individual website audit and optimization',
//             'Custom keyword research per client',
//             'Technical SEO fixes for each site',
//             'Content strategy per client',
//             'Monthly ranking reports per website',
//             'Dedicated SEO specialist',
//             'Link building campaigns'
//           ],
//           teamDiscount: 0,
//           savings: 0
//         };
//         break;

//       case 'web-development':
//         if (!websiteType) return null;

//         let webPrice = webDevelopmentPricing[websiteType as keyof typeof webDevelopmentPricing] || 600;
//         let webFeatures: string[] = [];

//         // E-commerce pricing and features
//         if (websiteType === 'ecommerce-store' && ecommercePlatform) {
//           // Base pricing by platform
//           const platformPricing = {
//             shopify: 1500,
//             woocommerce: 1200,
//             bigcommerce: 1800
//           };
//           webPrice = platformPricing[ecommercePlatform as keyof typeof platformPricing] || 1500;

//           // Product setup cost (additional fee based on product count)
//           const productSetupFee = Math.floor(productCount / 50) * 200; // $200 per 50 products
//           webPrice += productSetupFee;

//           // Feature complexity bonus
//           const featureBonus = productPageFeatures.length * 100; // $100 per feature
//           webPrice += featureBonus;

//           // Integration complexity bonus
//           const integrationBonus = integrations.length * 150; // $150 per integration
//           webPrice += integrationBonus;

//           webFeatures = [
//             `${ecommercePlatform.charAt(0).toUpperCase() + ecommercePlatform.slice(1)} store setup`,
//             `${productCount} products added and configured`,
//             'Mobile-optimized checkout process',
//             'Payment gateway integration',
//             'Inventory management system',
//             'Order management dashboard'
//           ];

//           // Add selected product page features
//           if (productPageFeatures.length > 0) {
//             webFeatures.push(`Product features: ${productPageFeatures.join(', ')}`);
//           }

//           // Add selected integrations
//           if (integrations.length > 0) {
//             webFeatures.push(`Integrations: ${integrations.join(', ')}`);
//           }

//           // Add design requirements pricing for e-commerce
//           if (designRequirements) {
//             const designMultiplier = {
//               custom: 1.25,
//               premium: 1.5,
//               luxury: 2.0
//             };
//             const multiplier = designMultiplier[designRequirements as keyof typeof designMultiplier] || 1;
//             if (multiplier > 1) {
//               webPrice *= multiplier;
//               webFeatures.push(`${designRequirements.charAt(0).toUpperCase() + designRequirements.slice(1)} design (+${Math.round((multiplier - 1) * 100)}%)`);
//             }
//           }

//           // Add maintenance needs pricing for e-commerce
//           if (maintenanceNeeds) {
//             const maintenanceAddons = {
//               none: { cost: 0, label: '' },
//               basic: { cost: 300, label: 'Basic e-commerce maintenance - 6 months (+$300)' },
//               standard: { cost: 600, label: 'Standard e-commerce maintenance - 6 months (+$600)' },
//               premium: { cost: 1000, label: 'Premium e-commerce support - 6 months (+$1,000)' }
//             };
//             const addon = maintenanceAddons[maintenanceNeeds as keyof typeof maintenanceAddons];
//             if (addon && addon.cost > 0) {
//               webPrice += addon.cost;
//               webFeatures.push(addon.label);
//             }
//           }

//           webFeatures.push('Training and documentation');
//           webFeatures.push('6 months support included');

//         } else {
//           // Non-e-commerce websites
//           webFeatures = websiteType.includes('wordpress') ? [
//             'Custom WordPress design',
//             'Mobile-friendly responsive',
//             'Basic SEO optimization',
//             'Contact forms + social links',
//             'Google Analytics setup',
//             'Training included'
//           ] : [
//             'Custom development',
//             'Modern tech stack',
//             'Database integration',
//             'API development',
//             'Performance optimization',
//             '6 months support'
//           ];

//           // Add complexity bonuses for non-e-commerce
//           if (websiteComplexity) {
//             const complexityMultiplier = {
//               simple: 1,
//               medium: 1.3,
//               complex: 1.6
//             };
//             webPrice *= complexityMultiplier[websiteComplexity as keyof typeof complexityMultiplier] || 1;
//           }

//           // Add integration bonuses
//           webPrice += integrations.length * 100;

//           if (integrations.length > 0) {
//             webFeatures.push(`Integrations: ${integrations.join(', ')}`);
//           }

//           // Add design requirements pricing
//           if (designRequirements) {
//             const designMultiplier = {
//               custom: 1.25,
//               premium: 1.5,
//               luxury: 2.0
//             };
//             const multiplier = designMultiplier[designRequirements as keyof typeof designMultiplier] || 1;
//             if (multiplier > 1) {
//               webPrice *= multiplier;
//               webFeatures.push(`${designRequirements.charAt(0).toUpperCase() + designRequirements.slice(1)} design (+${Math.round((multiplier - 1) * 100)}%)`);
//             }
//           }

//           // Add maintenance needs pricing
//           if (maintenanceNeeds) {
//             const maintenanceAddons = {
//               none: { cost: 0, label: '' },
//               basic: { cost: 200, label: 'Basic maintenance - 6 months (+$200)' },
//               standard: { cost: 500, label: 'Standard maintenance - 6 months (+$500)' },
//               premium: { cost: 800, label: 'Premium maintenance - 6 months (+$800)' }
//             };
//             const addon = maintenanceAddons[maintenanceNeeds as keyof typeof maintenanceAddons];
//             if (addon && addon.cost > 0) {
//               webPrice += addon.cost;
//               webFeatures.push(addon.label);
//             }
//           }
//         }

//         result = {
//           service: websiteType === 'ecommerce-store' ? `${ecommercePlatform?.charAt(0).toUpperCase()}${ecommercePlatform?.slice(1)} E-commerce Store` : 'Web Development',
//           monthlyPrice: Math.round(webPrice),
//           setupFee: 0,
//           features: webFeatures,
//           teamDiscount: 0,
//           savings: 0
//         };
//         break;

//       case 'ai-development':
//         if (!aiProjectType || !aiComplexity) return null;

//         let aiPrice = 0;
//         let aiFeatures: string[] = [];

//         // Base pricing by project type
//         const aiProjectPricing = {
//           'ai-web-app': 7000,
//           'ai-mobile-app': 9000,
//           'chatbot': 3000,
//           'ai-agent': 5000,
//           'automation-workflow': 4000,
//           'custom-ai-model': 8000,
//           'data-analysis': 3500,
//           'ai-integration': 2500
//         };

//         aiPrice = aiProjectPricing[aiProjectType as keyof typeof aiProjectPricing] || 3000;

//         // Complexity multipliers
//         const aiComplexityMultiplier = {
//           simple: 1,
//           medium: 1.5,
//           complex: 2.2,
//           enterprise: 3.0
//         };

//         aiPrice *= aiComplexityMultiplier[aiComplexity as keyof typeof aiComplexityMultiplier] || 1;

//         // Add integration costs based on complexity
//         if (aiIntegrations.length > 0) {
//           const integrationMultiplier = {
//             simple: 300,
//             medium: 500,
//             complex: 750,
//             enterprise: 1000
//           };

//           const integrationCost = aiIntegrations.length * (integrationMultiplier[aiComplexity as keyof typeof integrationMultiplier] || 500);
//           aiPrice += integrationCost;
//           aiFeatures.push(`${aiIntegrations.length} Integrations: ${aiIntegrations.join(', ')} (+$${integrationCost.toLocaleString()})`);
//         }

//         // Data volume adjustments with complexity-aware multipliers
//         if (dataVolume) {
//           const dataVolumeMultipliers = {
//             small: { multiplier: 1, cost: 0, label: 'Standard data processing' },
//             medium: { multiplier: 1.15, cost: 500, label: 'Medium-scale data processing (+15% + $500)' },
//             large: { multiplier: 1.3, cost: 1200, label: 'Large dataset optimization (+30% + $1,200)' },
//             enterprise: { multiplier: 1.6, cost: 2500, label: 'Enterprise-scale infrastructure (+60% + $2,500)' }
//           };

//           const volumeConfig = dataVolumeMultipliers[dataVolume as keyof typeof dataVolumeMultipliers];
//           if (volumeConfig && dataVolume !== 'small') {
//             aiPrice *= volumeConfig.multiplier;
//             aiPrice += volumeConfig.cost;
//             aiFeatures.push(volumeConfig.label);
//           }
//         }

//         // Custom models premium with project-type specific adjustments
//         if (customModels) {
//           const customModelMultiplier = {
//             'ai-web-app': 1.3,
//             'ai-mobile-app': 1.4,
//             'chatbot': 1.5,
//             'ai-agent': 1.4,
//             'automation-workflow': 1.2,
//             'custom-ai-model': 1.0, // Already includes custom model in base price
//             'data-analysis': 1.6,
//             'ai-integration': 1.3
//           };

//           const multiplier = customModelMultiplier[aiProjectType as keyof typeof customModelMultiplier] || 1.4;
//           if (aiProjectType !== 'custom-ai-model') {
//             aiPrice *= multiplier;
//             aiFeatures.push(`Custom AI model training (+${Math.round((multiplier - 1) * 100)}%)`);
//           }
//         }

//         // Base features
//         aiFeatures.unshift(
//           `${aiProjectType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} development`,
//           `${aiComplexity.charAt(0).toUpperCase() + aiComplexity.slice(1)} complexity implementation`,
//           'AI testing and optimization',
//           'Documentation and training',
//           'Initial deployment support'
//         );

//         // Maintenance support pricing adjustments
//         if (maintenanceSupport === 'ongoing') {
//           aiPrice += Math.round(aiPrice * 0.15); // 15% for standard 6-month support
//           aiFeatures.push('6 months ongoing support included (+15%)');
//         } else if (maintenanceSupport === 'premium') {
//           aiPrice += Math.round(aiPrice * 0.25) + 1000; // 25% + $1000 for premium 12-month support
//           aiFeatures.push('12 months premium support + priority access (+25% + $1,000)');
//         }

//         result = {
//           service: 'AI Development',
//           monthlyPrice: Math.round(aiPrice),
//           setupFee: 0,
//           features: aiFeatures,
//           teamDiscount: 0,
//           savings: 0,
//           isProjectBased: true
//         };
//         break;
//     }

//     return result;
//   };

//   const pricing = calculatePricing();

//   return (
//     <>
//       <Helmet>
//         <title>Pricing Calculator | Instant Service Pricing — Branding Beez</title>
//         <meta name="description" content="Get instant, transparent pricing for Branding Beez services. Configure your package, view discounts, and request a team quote — no hidden fees." />
//         <link rel="canonical" href="https://brandingbeez.co.uk/pricing-calculator" />
//         <meta name="robots" content="INDEX, FOLLOW" />
//       </Helmet>
//       <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
//         <SEOHead
//           title="Pricing Calculator | White-Label Services Cost Estimator | BrandingBeez"
//           description="Calculate costs for white-label digital marketing services. Get instant pricing for SEO, Google Ads, web development, dedicated resources, and AI solutions. Free estimates with team discounts."
//           keywords="white label pricing calculator, digital marketing cost estimator, SEO pricing, Google Ads cost, web development pricing, dedicated team cost calculator"
//           canonicalUrl="https://brandingbeez.com/pricing-calculator"
//           ogType="webapp"
//         />
//         <SchemaMarkup type="service" data={{
//           name: "White-Label Services Pricing Calculator",
//           description: "Interactive pricing calculator for white-label digital marketing services including SEO, Google Ads, web development, and dedicated resources.",
//           serviceType: "Pricing Calculator Tool",
//           hasOfferCatalog: {
//             name: "Service Pricing Options",
//             itemListElement: [
//               {
//                 name: "SEO Services Pricing",
//                 description: "Custom SEO pricing based on keywords, competition, and scope"
//               },
//               {
//                 name: "Google Ads Management Pricing",
//                 description: "Performance-based Google Ads pricing with campaign complexity factors"
//               },
//               {
//                 name: "Dedicated Resources Pricing",
//                 description: "Professional team member pricing with skill level and team size discounts"
//               }
//             ]
//           }
//         }} />
//         <Header />

//         {/* Hero Section */}
//         <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
//           <div className="max-w-4xl mx-auto text-center p-6">
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
//               <Calculator className="w-10 h-10 sm:w-12 sm:h-12" />
//               <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
//                 Pricing Calculator
//               </h1>
//             </div>
//             <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
//               Get instant pricing for all our services. No hidden fees, transparent pricing based on your specific needs.
//             </p>
//             <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
//               💰 Up to 20% team discounts available
//             </Badge>
//           </div>
//         </section>

//         {/* Calculator */}
//         <section className="py-12 sm:py-16 px-4">
//           <div className="max-w-6xl mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//               {/* Configuration Panel */}
//               <Card className="border-2 border-brand-coral/20">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <DollarSign className="w-5 h-5 text-brand-coral" />
//                     <h2>Configure Your Service</h2>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {/* Service Selection */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">Select Service</label>
//                     <Select value={selectedService} onValueChange={setSelectedService}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Choose a service..." />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="dedicated-resources">Dedicated Resources</SelectItem>
//                         <SelectItem value="google-ads">Google Ads Management</SelectItem>
//                         <SelectItem value="seo">SEO Services</SelectItem>
//                         <SelectItem value="web-development">Web Development</SelectItem>
//                         <SelectItem value="ai-development">AI Development</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Multi-Service Team Builder */}
//                   {selectedService === 'dedicated-resources' && (
//                     <div className="space-y-6">
//                       <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
//                         <h3 className="font-semibold text-blue-900">Build Your Custom Team</h3>
//                         <p className="text-sm text-blue-700">Choose any combination of professionals you need. Add multiple skill levels and quantities for each type.</p>
//                       </div>

//                       {/* Quick Examples */}
//                       <div className="p-3 bg-gray-50 rounded-lg text-center">
//                         <p className="text-sm text-gray-600">
//                           <strong>Examples:</strong> 1 Graphic Designer + 2 Full Stack Developers | 1 SEO Specialist + 1 Social Media Manager + 1 Virtual Assistant | Any combination you need!
//                         </p>
//                       </div>

//                       {/* Professional Selection Grid */}
//                       <div className="space-y-4">
//                         <h4 className="font-medium text-gray-900">Choose Your Professionals:</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                           {resourceTypes.map((resourceType) => (
//                             <div key={resourceType} className="p-3 sm:p-4 border rounded-lg hover:border-brand-coral transition-colors">
//                               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
//                                 <h5 className="font-medium text-gray-900 text-sm sm:text-base">{resourceType}</h5>
//                                 <Button
//                                   type="button"
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => setActiveResourceType(activeResourceType === resourceType ? '' : resourceType)}
//                                   className={`text-xs sm:text-sm touch-manipulation ${activeResourceType === resourceType ? 'border-brand-coral text-brand-coral' : ''}`}
//                                 >
//                                   {activeResourceType === resourceType ? 'Cancel' : 'Add to Team'}
//                                 </Button>
//                               </div>

//                               {/* Show current team members for this type */}
//                               {selectedTeam[resourceType] && (
//                                 <div className="space-y-1 mb-3">
//                                   {Object.entries(selectedTeam[resourceType]).map(([skillLevel, count]) => (
//                                     <div key={skillLevel} className="flex items-center justify-between text-xs sm:text-sm bg-green-50 px-2 py-1 rounded">
//                                       <span>{count} × {skillLevel} level</span>
//                                       <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => removeResourceFromTeam(resourceType, skillLevel)}
//                                         className="h-6 px-2 text-red-600 hover:text-red-800 text-xs touch-manipulation"
//                                       >
//                                         Remove
//                                       </Button>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}

//                               {/* Skill level selection for active resource */}
//                               {activeResourceType === resourceType && (
//                                 <div className="space-y-3 mt-3 p-3 bg-gray-50 rounded">
//                                   {getSkillLevelsForResource(resourceType).map((skillLevel) => (
//                                     <div key={skillLevel} className="flex items-center justify-between">
//                                       <div className="flex-1">
//                                         <div className="font-medium capitalize">{skillLevel} Level</div>
//                                         <div className="text-sm text-gray-600">
//                                           ${dedicatedResourcesPricing[skillLevel as keyof typeof dedicatedResourcesPricing][resourceType as keyof typeof dedicatedResourcesPricing.junior]?.toLocaleString()}/month
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2">
//                                         <Button
//                                           type="button"
//                                           variant="outline"
//                                           size="sm"
//                                           onClick={() => {
//                                             const currentCount = selectedTeam[resourceType]?.[skillLevel] || 0;
//                                             if (currentCount > 0) {
//                                               updateResourceCount(resourceType, skillLevel, currentCount - 1);
//                                             }
//                                           }}
//                                           className="w-8 h-8 p-0"
//                                         >
//                                           -
//                                         </Button>
//                                         <span className="w-8 text-center">{selectedTeam[resourceType]?.[skillLevel] || 0}</span>
//                                         <Button
//                                           type="button"
//                                           variant="outline"
//                                           size="sm"
//                                           onClick={() => {
//                                             const currentCount = selectedTeam[resourceType]?.[skillLevel] || 0;
//                                             updateResourceCount(resourceType, skillLevel, currentCount + 1);
//                                           }}
//                                           className="w-8 h-8 p-0"
//                                         >
//                                           +
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>



//                       {/* Selected Team Summary */}
//                       {Object.keys(selectedTeam).length > 0 && (
//                         <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
//                           <h4 className="font-semibold text-green-900 flex items-center gap-2">
//                             <Users className="w-4 h-4" />
//                             Your Multi-Professional Team ({getTotalTeamSize()} people total)
//                           </h4>

//                           <div className="grid grid-cols-1 gap-3">
//                             {Object.entries(selectedTeam).map(([resourceType, skillLevels]) => (
//                               <div key={resourceType} className="p-3 bg-white rounded-lg border border-green-200">
//                                 <div className="font-medium text-gray-900 mb-2 flex items-center gap-2">
//                                   <div className="w-2 h-2 bg-brand-coral rounded-full"></div>
//                                   {resourceType}
//                                 </div>
//                                 <div className="space-y-1">
//                                   {Object.entries(skillLevels).map(([skillLevel, count]) => (
//                                     <div key={`${resourceType}-${skillLevel}`} className="flex items-center justify-between text-sm">
//                                       <span className="text-gray-700">
//                                         {count} × {skillLevel} level
//                                         <span className="text-green-600 font-medium ml-2">
//                                           (${(dedicatedResourcesPricing[skillLevel as keyof typeof dedicatedResourcesPricing][resourceType as keyof typeof dedicatedResourcesPricing.junior] * count || 0).toLocaleString()}/month)
//                                         </span>
//                                       </span>
//                                       <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => removeResourceFromTeam(resourceType, skillLevel)}
//                                         className="text-red-600 ed-800 h-6 px-2"
//                                       >
//                                         ×
//                                       </Button>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>

//                           {getTotalTeamSize() >= 2 && (
//                             <div className="text-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-300">
//                               <div className="text-lg font-bold text-green-700">
//                                 🎉 Team Discount: {getTeamDiscount(getTotalTeamSize())}% OFF
//                               </div>
//                               <div className="text-sm text-green-600">
//                                 Save on your multi-professional team!
//                               </div>
//                             </div>
//                           )}

//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setSelectedTeam({})}
//                             className="w-full text-red-600 ed-800 border-red-200 hover:border-red-300"
//                           >
//                             Clear Entire Team
//                           </Button>
//                         </div>
//                       )}




//                     </div>
//                   )}

//                   {/* Google Ads Options - Individual Client Management */}
//                   {selectedService === 'google-ads' && (
//                     <div className="space-y-6">
//                       <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
//                         <h3 className="font-semibold text-blue-900">Individual Client Management</h3>
//                         <p className="text-sm text-blue-700">Add each client with their specific budget, campaigns, and requirements for accurate pricing.</p>
//                       </div>

//                       {/* Client List */}
//                       {clients.length > 0 && (
//                         <div className="space-y-4">
//                           <h4 className="font-medium text-gray-900">Your Clients ({clients.length})</h4>
//                           {clients.map((client) => (
//                             <div key={client.id} className="p-4 border rounded-lg bg-gray-50">
//                               <div className="flex items-start justify-between mb-3">
//                                 <div className="flex-1">
//                                   <h5 className="font-medium text-gray-900">{client.name}</h5>
//                                   <div className="text-sm text-gray-600 space-y-1">
//                                     <div>Ad Spend: ${client.monthlyAdSpend.toLocaleString()}/month</div>
//                                     <div>Campaigns: {client.campaigns}</div>
//                                     <div>Types: {client.campaignTypes.join(', ') || 'Not specified'}</div>
//                                     <div>Industry: {client.industry || 'Not specified'}</div>
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                   <div className="text-right">
//                                     <div className="font-semibold text-green-600">
//                                       ${calculateClientPrice(client).toLocaleString()}/month
//                                     </div>
//                                   </div>
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => removeClient(client.id)}
//                                     className="text-red-600 ed-800"
//                                   >
//                                     Remove
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Add New Client */}
//                       {!showAddClient ? (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => setShowAddClient(true)}
//                           className="w-full border-dashed border-2 border-gray-300 hover:border-brand-coral rand-coral"
//                         >
//                           <Plus className="w-4 h-4 mr-2" />
//                           Add Client
//                         </Button>
//                       ) : (
//                         <div className="p-4 border rounded-lg bg-white space-y-4">
//                           <h4 className="font-medium text-gray-900">Add New Client</h4>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Client Name</label>
//                             <input
//                               type="text"
//                               value={newClient.name}
//                               onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
//                               placeholder="Enter client name..."
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-transparent"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">
//                               Monthly Ad Spend: ${newClient.monthlyAdSpend.toLocaleString()}
//                             </label>
//                             <Slider
//                               value={[newClient.monthlyAdSpend]}
//                               onValueChange={(value) => setNewClient(prev => ({ ...prev, monthlyAdSpend: value[0] }))}
//                               max={50000}
//                               min={1000}
//                               step={500}
//                               className="w-full"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">
//                               Number of Campaigns: {newClient.campaigns}
//                             </label>
//                             <Slider
//                               value={[newClient.campaigns]}
//                               onValueChange={(value) => setNewClient(prev => ({ ...prev, campaigns: value[0] }))}
//                               max={10}
//                               min={1}
//                               step={1}
//                               className="w-full"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Campaign Types (select multiple)</label>
//                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                               {['Search', 'Display', 'Shopping', 'Video', 'Performance Max', 'App'].map((type) => (
//                                 <Button
//                                   key={type}
//                                   type="button"
//                                   variant={newClient.campaignTypes.includes(type) ? "default" : "outline"}
//                                   size="sm"
//                                   onClick={() => {
//                                     if (newClient.campaignTypes.includes(type)) {
//                                       setNewClient(prev => ({
//                                         ...prev,
//                                         campaignTypes: prev.campaignTypes.filter(t => t !== type)
//                                       }));
//                                     } else {
//                                       setNewClient(prev => ({
//                                         ...prev,
//                                         campaignTypes: [...prev.campaignTypes, type]
//                                       }));
//                                     }
//                                   }}
//                                 >
//                                   {type}
//                                 </Button>
//                               ))}
//                             </div>
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Industry</label>
//                             <Select value={newClient.industry} onValueChange={(value) => setNewClient(prev => ({ ...prev, industry: value }))}>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Choose industry..." />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="ecommerce">E-commerce</SelectItem>
//                                 <SelectItem value="healthcare">Healthcare</SelectItem>
//                                 <SelectItem value="finance">Finance</SelectItem>
//                                 <SelectItem value="realestate">Real Estate</SelectItem>
//                                 <SelectItem value="saas">SaaS/Software</SelectItem>
//                                 <SelectItem value="local">Local Services</SelectItem>
//                                 <SelectItem value="education">Education</SelectItem>
//                                 <SelectItem value="automotive">Automotive</SelectItem>
//                                 <SelectItem value="other">Others</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           {/* Custom Industry Input for Google Ads */}
//                           {newClient.industry === 'other' && (
//                             <div className="space-y-2">
//                               <label className="text-sm font-medium text-gray-700">Specify Industry</label>
//                               <input
//                                 type="text"
//                                 value={newClient.customIndustry}
//                                 onChange={(e) => setNewClient(prev => ({ ...prev, customIndustry: e.target.value }))}
//                                 placeholder="Enter industry name..."
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-transparent"
//                               />
//                             </div>
//                           )}

//                           {/* Website Field for Google Ads */}
//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Client Website</label>
//                             <input
//                               type="text"
//                               value={newClient.website}
//                               onChange={(e) => setNewClient(prev => ({ ...prev, website: e.target.value }))}
//                               placeholder="https://clientwebsite.com"
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-transparent"
//                             />
//                           </div>

//                           <div className="flex gap-2">
//                             <Button
//                               type="button"
//                               onClick={addClient}
//                               className="flex-1 bg-brand-coral rand-coral-dark text-white"
//                             >
//                               Add Client
//                             </Button>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               onClick={() => setShowAddClient(false)}
//                               className="px-4"
//                             >
//                               Cancel
//                             </Button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* SEO Options - Individual Client Management */}
//                   {selectedService === 'seo' && (
//                     <div className="space-y-6">
//                       <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
//                         <h3 className="font-semibold text-green-900">Individual Website Management</h3>
//                         <p className="text-sm text-green-700">Add each website with their specific keywords, competition level, and current rankings for accurate SEO pricing.</p>
//                       </div>

//                       {/* SEO Client List */}
//                       {seoClients.length > 0 && (
//                         <div className="space-y-4">
//                           <h4 className="font-medium text-gray-900">Your SEO Clients ({seoClients.length})</h4>
//                           {seoClients.map((client) => (
//                             <div key={client.id} className="p-4 border rounded-lg bg-gray-50">
//                               <div className="flex items-start justify-between mb-3">
//                                 <div className="flex-1">
//                                   <h5 className="font-medium text-gray-900">{client.name}</h5>
//                                   <div className="text-sm text-gray-600 space-y-1">
//                                     <div>Website: {client.website}</div>
//                                     <div>Keywords: {client.targetKeywords}</div>
//                                     <div>Competition: {client.competitionLevel}</div>
//                                     <div>Current Ranking: {client.currentRanking.replace('-', ' ')}</div>
//                                     <div>Industry: {client.industry || 'Not specified'}</div>
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                   <div className="text-right">
//                                     <div className="font-semibold text-green-600">
//                                       ${calculateSeoClientPrice(client).toLocaleString()}/month
//                                     </div>
//                                   </div>
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => removeSeoClient(client.id)}
//                                     className="text-red-600 ed-800"
//                                   >
//                                     Remove
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Add New SEO Client */}
//                       {!showAddSeoClient ? (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => setShowAddSeoClient(true)}
//                           className="w-full border-dashed border-2 border-gray-300 hover:border-green-600 reen-600"
//                         >
//                           <Plus className="w-4 h-4 mr-2" />
//                           Add Website for SEO
//                         </Button>
//                       ) : (
//                         <div className="p-4 border rounded-lg bg-white space-y-4">
//                           <h4 className="font-medium text-gray-900">Add New SEO Client</h4>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Client/Business Name</label>
//                             <input
//                               type="text"
//                               value={newSeoClient.name}
//                               onChange={(e) => setNewSeoClient(prev => ({ ...prev, name: e.target.value }))}
//                               placeholder="Enter client name..."
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Website URL</label>
//                             <input
//                               type="text"
//                               value={newSeoClient.website}
//                               onChange={(e) => setNewSeoClient(prev => ({ ...prev, website: e.target.value }))}
//                               placeholder="https://example.com"
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">
//                               Target Keywords: {newSeoClient.targetKeywords}
//                             </label>
//                             <Slider
//                               value={[newSeoClient.targetKeywords]}
//                               onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, targetKeywords: value[0] }))}
//                               max={100}
//                               min={5}
//                               step={5}
//                               className="w-full"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Competition Level</label>
//                             <Select value={newSeoClient.competitionLevel} onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, competitionLevel: value }))}>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Choose competition level..." />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="low">Low Competition</SelectItem>
//                                 <SelectItem value="medium">Medium Competition</SelectItem>
//                                 <SelectItem value="high">High Competition</SelectItem>
//                                 <SelectItem value="very-high">Very High Competition</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Current Search Rankings</label>
//                             <Select value={newSeoClient.currentRanking} onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, currentRanking: value }))}>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Current ranking status..." />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="not-ranking">Not ranking / New website</SelectItem>
//                                 <SelectItem value="page-2-3">Page 2-3 for main keywords</SelectItem>
//                                 <SelectItem value="page-1">Page 1 for some keywords</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Industry</label>
//                             <Select value={newSeoClient.industry} onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, industry: value }))}>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Choose industry..." />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="local">Local Business</SelectItem>
//                                 <SelectItem value="ecommerce">E-commerce</SelectItem>
//                                 <SelectItem value="saas">SaaS/Software</SelectItem>
//                                 <SelectItem value="healthcare">Healthcare</SelectItem>
//                                 <SelectItem value="finance">Finance</SelectItem>
//                                 <SelectItem value="realestate">Real Estate</SelectItem>
//                                 <SelectItem value="education">Education</SelectItem>
//                                 <SelectItem value="automotive">Automotive</SelectItem>
//                                 <SelectItem value="other">Others</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           {/* Custom Industry Input for SEO */}
//                           {newSeoClient.industry === 'other' && (
//                             <div className="space-y-2">
//                               <label className="text-sm font-medium text-gray-700">Specify Industry</label>
//                               <input
//                                 type="text"
//                                 value={newSeoClient.customIndustry}
//                                 onChange={(e) => setNewSeoClient(prev => ({ ...prev, customIndustry: e.target.value }))}
//                                 placeholder="Enter industry name..."
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                               />
//                             </div>
//                           )}

//                           {/* Competitor Upload Fields */}
//                           <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Top 3 Competitors (Optional)</label>
//                             <div className="space-y-2">
//                               {newSeoClient.competitors.map((competitor, index) => (
//                                 <input
//                                   key={index}
//                                   type="text"
//                                   value={competitor}
//                                   onChange={(e) => {
//                                     const newCompetitors = [...newSeoClient.competitors];
//                                     newCompetitors[index] = e.target.value;
//                                     setNewSeoClient(prev => ({ ...prev, competitors: newCompetitors }));
//                                   }}
//                                   placeholder={`Competitor ${index + 1} website URL`}
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                 />
//                               ))}
//                             </div>
//                           </div>

//                           <div className="flex gap-2">
//                             <Button
//                               type="button"
//                               onClick={addSeoClient}
//                               className="flex-1 bg-green-600 reen-700 text-white"
//                             >
//                               Add Website
//                             </Button>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               onClick={() => setShowAddSeoClient(false)}
//                               className="px-4"
//                             >
//                               Cancel
//                             </Button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Web Development Options */}
//                   {selectedService === 'web-development' && (
//                     <div className="space-y-6">
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">1. What type of website do you need?</label>
//                         <Select value={websiteType} onValueChange={setWebsiteType}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Choose website type..." />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="wordpress-starter">WordPress Starter</SelectItem>
//                             <SelectItem value="wordpress-business">WordPress Business</SelectItem>
//                             <SelectItem value="ecommerce-store">E-commerce Store</SelectItem>
//                             <SelectItem value="full-stack-site">Full Stack Site</SelectItem>
//                             <SelectItem value="custom-advanced">Custom Advanced</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {/* E-commerce Platform Selection */}
//                       {websiteType === 'ecommerce-store' && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">2. Which e-commerce platform?</label>
//                           <Select value={ecommercePlatform} onValueChange={setEcommercePlatform}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose platform..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="shopify">Shopify</SelectItem>
//                               <SelectItem value="woocommerce">WooCommerce</SelectItem>
//                               <SelectItem value="bigcommerce">BigCommerce</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}

//                       {/* Product Count for E-commerce */}
//                       {websiteType === 'ecommerce-store' && ecommercePlatform && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">3. How many products to add? ({productCount} products)</label>
//                           <Slider
//                             value={[productCount]}
//                             onValueChange={(value) => setProductCount(value[0])}
//                             max={500}
//                             min={10}
//                             step={10}
//                             className="w-full"
//                           />
//                         </div>
//                       )}

//                       {/* Product Page Features for E-commerce */}
//                       {websiteType === 'ecommerce-store' && ecommercePlatform && productCount > 0 && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">4. Product page features (select multiple)</label>
//                           <div className="grid grid-cols-2 gap-2">
//                             {[
//                               'Image Zoom',
//                               'Product Videos',
//                               'Size Guide',
//                               'Related Products',
//                               'Quick View',
//                               'Wishlist',
//                               'Compare Products',
//                               'Product Variants',
//                               'Inventory Tracking'
//                             ].map((feature) => (
//                               <Button
//                                 key={feature}
//                                 variant={productPageFeatures.includes(feature) ? "default" : "outline"}
//                                 size="sm"
//                                 onClick={() => {
//                                   if (productPageFeatures.includes(feature)) {
//                                     setProductPageFeatures(productPageFeatures.filter(f => f !== feature));
//                                   } else {
//                                     setProductPageFeatures([...productPageFeatures, feature]);
//                                   }
//                                 }}
//                               >
//                                 {feature}
//                               </Button>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Website Complexity for non-ecommerce */}
//                       {websiteType && websiteType !== 'ecommerce-store' && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">2. Website complexity</label>
//                           <Select value={websiteComplexity} onValueChange={setWebsiteComplexity}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose complexity..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {websiteType === 'wordpress-starter' && (
//                                 <>
//                                   <SelectItem value="simple">Basic Business (5-7 pages, contact forms)</SelectItem>
//                                   <SelectItem value="medium">Professional (10-15 pages, blog, gallery)</SelectItem>
//                                   <SelectItem value="complex">Advanced (20+ pages, membership, custom features)</SelectItem>
//                                 </>
//                               )}
//                               {websiteType === 'wordpress-business' && (
//                                 <>
//                                   <SelectItem value="simple">Standard Business (10-15 pages, SEO optimized)</SelectItem>
//                                   <SelectItem value="medium">Multi-service (20-30 pages, booking system)</SelectItem>
//                                   <SelectItem value="complex">Enterprise (40+ pages, multi-language, advanced CMS)</SelectItem>
//                                 </>
//                               )}
//                               {websiteType === 'full-stack-site' && (
//                                 <>
//                                   <SelectItem value="simple">Basic Full Stack (React/Node.js, REST API)</SelectItem>
//                                   <SelectItem value="medium">Advanced Full Stack (Next.js, Database, Auth)</SelectItem>
//                                   <SelectItem value="complex">Enterprise Full Stack (Microservices, Cloud deployment)</SelectItem>
//                                 </>
//                               )}
//                               {websiteType === 'custom-basic' && (
//                                 <>
//                                   <SelectItem value="simple">Simple App (Landing page, basic functionality)</SelectItem>
//                                   <SelectItem value="medium">Web Application (User auth, database, API)</SelectItem>
//                                   <SelectItem value="complex">Complex Platform (Multi-user, advanced features)</SelectItem>
//                                 </>
//                               )}
//                               {websiteType === 'custom-advanced' && (
//                                 <>
//                                   <SelectItem value="simple">Advanced Web App (Real-time features, integrations)</SelectItem>
//                                   <SelectItem value="medium">Enterprise Platform (Scalable architecture, admin panels)</SelectItem>
//                                   <SelectItem value="complex">Custom Software (AI/ML, complex algorithms, microservices)</SelectItem>
//                                 </>
//                               )}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}

//                       {/* Integrations for E-commerce */}
//                       {websiteType === 'ecommerce-store' && productPageFeatures.length > 0 && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">5. Required integrations (select multiple)</label>
//                           <div className="grid grid-cols-2 gap-2">
//                             {['Google Analytics'].map((integration) => (
//                               <Button
//                                 key={integration}
//                                 variant={integrations.includes(integration) ? "default" : "outline"}
//                                 size="sm"
//                                 onClick={() => {
//                                   if (integrations.includes(integration)) {
//                                     setIntegrations(integrations.filter(i => i !== integration));
//                                   } else {
//                                     setIntegrations([...integrations, integration]);
//                                   }
//                                 }}
//                               >
//                                 {integration}
//                               </Button>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Integrations for Non-E-commerce */}
//                       {websiteType !== 'ecommerce-store' && websiteComplexity && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">3. Required integrations (select multiple)</label>
//                           <div className="grid grid-cols-2 gap-2">
//                             {['Google Analytics'].map((integration) => (
//                               <Button
//                                 key={integration}
//                                 variant={integrations.includes(integration) ? "default" : "outline"}
//                                 size="sm"
//                                 onClick={() => {
//                                   if (integrations.includes(integration)) {
//                                     setIntegrations(integrations.filter(i => i !== integration));
//                                   } else {
//                                     setIntegrations([...integrations, integration]);
//                                   }
//                                 }}
//                               >
//                                 {integration}
//                               </Button>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Design Requirements */}
//                       {websiteComplexity && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">
//                             {websiteType === 'ecommerce-store' ? '6. Design requirements' : '4. Design requirements'}
//                           </label>
//                           <Select value={designRequirements} onValueChange={setDesignRequirements}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose design level..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="custom">Custom design</SelectItem>
//                               <SelectItem value="premium">Premium custom design</SelectItem>
//                               <SelectItem value="luxury">Luxury design</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}

//                       {/* Maintenance Needs */}
//                       {websiteComplexity && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">
//                             {websiteType === 'ecommerce-store' ? '7. Ongoing maintenance needs' : '5. Ongoing maintenance needs'}
//                           </label>
//                           <Select value={maintenanceNeeds} onValueChange={setMaintenanceNeeds}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose maintenance level..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="none">No maintenance</SelectItem>
//                               <SelectItem value="basic">Basic (6 months - Security updates only)</SelectItem>
//                               <SelectItem value="standard">Standard (6 months - Updates + content)</SelectItem>
//                               <SelectItem value="premium">Premium (6 months - Full management)</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* AI Development Options */}
//                   {selectedService === 'ai-development' && (
//                     <div className="space-y-6">
//                       <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
//                         <h3 className="font-semibold text-purple-900">Custom AI Product Development</h3>
//                         <p className="text-sm text-purple-700">We build full-custom AI powered products for web & mobile platforms. Configure your project based on requirements and complexity.</p>
//                       </div>

//                       {/* Project Type */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">1. AI Project Type</label>
//                         <Select value={aiProjectType} onValueChange={setAiProjectType}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Choose project type..." />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="ai-web-app">AI-Powered Web Application</SelectItem>
//                             <SelectItem value="ai-mobile-app">AI-Powered Mobile Application</SelectItem>
//                             <SelectItem value="chatbot">AI Chatbot</SelectItem>
//                             <SelectItem value="ai-agent">AI Agent/Assistant</SelectItem>
//                             <SelectItem value="automation-workflow">Automation Workflow</SelectItem>
//                             <SelectItem value="custom-ai-model">Custom AI Model</SelectItem>
//                             <SelectItem value="data-analysis">Data Analysis & Insights</SelectItem>
//                             <SelectItem value="ai-integration">AI API Integration</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {/* Complexity Level */}
//                       {aiProjectType && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">2. Project Complexity</label>
//                           <Select value={aiComplexity} onValueChange={setAiComplexity}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose complexity level..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="simple">Simple (Basic functionality, 1-2 features)</SelectItem>
//                               <SelectItem value="medium">Medium (Advanced features, 3-5 integrations) +50%</SelectItem>
//                               <SelectItem value="complex">Complex (Multi-system integration, custom logic) +120%</SelectItem>
//                               <SelectItem value="enterprise">Enterprise (Custom architecture, scalability) +200%</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           {aiComplexity && (
//                             <div className="text-xs text-gray-500 mt-1">
//                               {aiComplexity === 'simple' && 'Perfect for MVP or proof-of-concept projects with core AI functionality.'}
//                               {aiComplexity === 'medium' && 'Includes advanced AI features, multiple data sources, and third-party integrations.'}
//                               {aiComplexity === 'complex' && 'Multi-system architecture with custom AI workflows and complex business logic.'}
//                               {aiComplexity === 'enterprise' && 'Full-scale enterprise solution with high availability, security, and scalability.'}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* Integrations */}
//                       {aiComplexity && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">3. Required Integrations</label>
//                           <p className="text-xs text-gray-500 mb-2">
//                             Available integrations based on {aiComplexity} complexity level
//                           </p>
//                           <div className="flex flex-wrap gap-2">
//                             {(() => {
//                               let availableIntegrations = ['OpenAI API', 'Custom Database'];

//                               if (aiComplexity === 'medium' || aiComplexity === 'complex' || aiComplexity === 'enterprise') {
//                                 availableIntegrations.push('CRM System', 'Email Service', 'Payment Gateway', 'Analytics');
//                               }

//                               if (aiComplexity === 'complex' || aiComplexity === 'enterprise') {
//                                 availableIntegrations.push('Web APIs', 'Mobile App', 'Third-party Services');
//                               }

//                               if (aiComplexity === 'enterprise') {
//                                 availableIntegrations.push('Enterprise Systems', 'Advanced Security', 'Multi-tenant Architecture');
//                               }

//                               return availableIntegrations;
//                             })().map((integration) => (
//                               <Button
//                                 key={integration}
//                                 variant={aiIntegrations.includes(integration) ? "default" : "outline"}
//                                 size="sm"
//                                 onClick={() => {
//                                   if (aiIntegrations.includes(integration)) {
//                                     setAiIntegrations(aiIntegrations.filter(i => i !== integration));
//                                   } else {
//                                     setAiIntegrations([...aiIntegrations, integration]);
//                                   }
//                                 }}
//                               >
//                                 {integration}
//                               </Button>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Data Volume */}
//                       {aiIntegrations.length > 0 && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">4. Expected Data Volume</label>
//                           <Select value={dataVolume} onValueChange={setDataVolume}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose data volume..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="small">Small (&lt; 10k records/month)</SelectItem>
//                               <SelectItem value="medium">Medium (10k - 100k records/month)</SelectItem>
//                               <SelectItem value="large">Large (100k - 1M records/month)</SelectItem>
//                               <SelectItem value="enterprise">Enterprise (&gt; 1M records/month)</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}

//                       {/* Custom Models */}
//                       {dataVolume && (
//                         <div className="space-y-2">
//                           <label className="flex items-center gap-2">
//                             <input
//                               type="checkbox"
//                               checked={customModels}
//                               onChange={(e) => setCustomModels(e.target.checked)}
//                               className="rounded border-gray-300"
//                             />
//                             <span className="text-sm font-medium text-gray-700">5. Require custom AI model training</span>
//                           </label>
//                           <p className="text-xs text-gray-500">Custom models provide better accuracy but require additional development time and costs.</p>
//                         </div>
//                       )}

//                       {/* Maintenance Support */}
//                       {(dataVolume || customModels) && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700">6. Ongoing Support</label>
//                           <Select value={maintenanceSupport} onValueChange={setMaintenanceSupport}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose support level..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="basic">Basic (Documentation only)</SelectItem>
//                               <SelectItem value="ongoing">Standard (6 months support)</SelectItem>
//                               <SelectItem value="premium">Premium (12 months + priority support)</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Pricing Disclaimer */}
//                   {selectedService && (
//                     <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                       <div className="flex items-start gap-2">
//                         <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//                         <div>
//                           <h4 className="font-medium text-blue-900">Pricing Disclaimer</h4>
//                           <p className="text-sm text-blue-700">
//                             Prices shown are estimates and not final. Actual pricing may vary based on specific requirements,
//                             project complexity, and additional services needed. Please contact us for a detailed quote.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Results Panel */}
//               {pricing && (
//                 <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Calculator className="w-5 h-5 text-green-600" />
//                       Your Custom Quote
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="text-center">
//                       <div className="text-3xl font-bold text-green-600">
//                         ${pricing.monthlyPrice.toLocaleString()}
//                         {(selectedService === 'web-development' || selectedService === 'ai-development') ? ' project' : (pricing.monthlyPrice > 0 ? '/month' : '')}
//                       </div>
//                       {pricing.setupFee > 0 && (
//                         <div className="text-lg text-gray-600">
//                           + ${pricing.setupFee.toLocaleString()} setup fee
//                         </div>
//                       )}
//                       <div className="text-sm text-gray-500 mt-1">{pricing.service}</div>
//                     </div>

//                     {(pricing.teamDiscount || 0) > 0 && (
//                       <div className="bg-green-100 p-3 rounded-lg">
//                         <div className="flex items-center gap-2">
//                           <Trophy className="w-4 h-4 text-green-600" />
//                           <span className="font-medium text-green-800">
//                             Team Discount: {pricing.teamDiscount || 0}% off
//                           </span>
//                         </div>
//                         <div className="text-sm text-green-700">
//                           You save ${pricing.savings?.toLocaleString()} per month!
//                         </div>
//                       </div>
//                     )}

//                     {/* Google Ads Individual Client Pricing Breakdown */}
//                     {selectedService === 'google-ads' && clients.length > 0 && (
//                       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                         <h4 className="font-semibold text-blue-900 mb-3">Individual Client Pricing:</h4>
//                         <div className="space-y-3">
//                           {clients.map((client) => (
//                             <div key={client.id} className="bg-white p-3 rounded border border-blue-200">
//                               <div className="flex justify-between items-start mb-2">
//                                 <div className="flex-1">
//                                   <div className="font-medium text-gray-900">{client.name}</div>
//                                   <div className="text-sm text-gray-600">
//                                     ${client.monthlyAdSpend.toLocaleString()}/month • {client.campaigns} campaigns
//                                   </div>
//                                 </div>
//                                 <div className="font-semibold text-blue-600">
//                                   ${calculateClientPrice(client).toLocaleString()}/month
//                                 </div>
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {client.campaignTypes.length > 0 && `Types: ${client.campaignTypes.join(', ')}`}
//                                 {client.campaignTypes.length > 3 && ' (+10% complexity bonus)'}
//                               </div>
//                             </div>
//                           ))}
//                           <div className="border-t border-blue-300 pt-3 flex justify-between font-semibold text-blue-900">
//                             <span>Total Monthly Price:</span>
//                             <span>${pricing.monthlyPrice.toLocaleString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* SEO Individual Client Pricing Breakdown */}
//                     {selectedService === 'seo' && seoClients.length > 0 && (
//                       <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                         <h4 className="font-semibold text-green-900 mb-3">Individual Website Pricing:</h4>
//                         <div className="space-y-3">
//                           {seoClients.map((client) => (
//                             <div key={client.id} className="bg-white p-3 rounded border border-green-200">
//                               <div className="flex justify-between items-start mb-2">
//                                 <div className="flex-1">
//                                   <div className="font-medium text-gray-900">{client.name}</div>
//                                   <div className="text-sm text-gray-600">
//                                     {client.targetKeywords} keywords • {client.competitionLevel} competition
//                                   </div>
//                                 </div>
//                                 <div className="font-semibold text-green-600">
//                                   ${calculateSeoClientPrice(client).toLocaleString()}/month
//                                 </div>
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 Current ranking: {client.currentRanking.replace('-', ' ')}
//                                 {client.website && ` • ${client.website}`}
//                               </div>
//                             </div>
//                           ))}
//                           <div className="border-t border-green-300 pt-3 flex justify-between font-semibold text-green-900">
//                             <span>Total Monthly Price:</span>
//                             <span>${pricing.monthlyPrice.toLocaleString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="space-y-3">
//                       <h4 className="font-semibold text-gray-900">What's Included:</h4>
//                       <ul className="space-y-2">
//                         {pricing.features.map((feature, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                             <span className="text-sm text-gray-700">{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <Button
//                       onClick={() => setShowContactModal(true)}
//                       className="w-full bg-gradient-to-r from-brand-coral to-pink-500 rand-coral/90 ink-500/90 text-white"
//                       size="lg"
//                     >
//                       Get Started
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Contact Modal */}
//         <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Get Quote</DialogTitle>
//               <DialogDescription>
//                 Share your details to receive a personalized proposal based on your pricing calculator selections.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleContactSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="name">Full Name *</Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={contactForm.name}
//                     onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
//                     placeholder="Enter your name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="email">Email Address *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={contactForm.email}
//                     onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     type="tel"
//                     value={contactForm.phone}
//                     onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="website">Website URL</Label>
//                   <Input
//                     id="website"
//                     type="text"
//                     value={contactForm.website}
//                     onChange={(e) => setContactForm(prev => ({ ...prev, website: e.target.value }))}
//                     placeholder="Enter your website URL"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Enter your domain (e.g., yoursite.com, www.yoursite.com, or https://yoursite.com)
//                   </p>
//                 </div>
//               </div>

//               {/* Quote Summary */}
//               {pricing && (
//                 <div className="bg-gray-50 p-4 rounded-lg border">
//                   <h4 className="font-semibold text-gray-900 mb-3">Your Quote Summary:</h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Service:</span>
//                       <span className="font-medium">{pricing.service}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Monthly Price:</span>
//                       <span className="font-medium">${pricing.monthlyPrice.toLocaleString()}</span>
//                     </div>
//                     {pricing.setupFee > 0 && (
//                       <div className="flex justify-between">
//                         <span>Setup Fee:</span>
//                         <span className="font-medium">${pricing.setupFee.toLocaleString()}</span>
//                       </div>
//                     )}
//                     {pricing.teamDiscount && (
//                       <div className="flex justify-between text-green-600">
//                         <span>Team Discount:</span>
//                         <span className="font-medium">-{pricing.teamDiscount}%</span>
//                       </div>
//                     )}
//                     {pricing.savings && (
//                       <div className="flex justify-between text-green-600">
//                         <span>Annual Savings:</span>
//                         <span className="font-medium">${pricing.savings.toLocaleString()}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="flex gap-3 pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setShowContactModal(false)}
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={contactMutation.isPending}
//                   className="flex-1 bg-gradient-to-r from-brand-coral to-pink-500"
//                 >
//                   <Send className="w-4 h-4 mr-2" />
//                   {contactMutation.isPending ? "Sending..." : "Get Quote"}
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>

//         <Footer />
//       </div>
//     </>
//   );
// }

