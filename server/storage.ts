import {
  users,
  contacts,
  clients,
  seoAudits,
  chatSessions,
  featuredClients,
  caseStudies,
  pricingPackages,
  servicePages,
  coupons,
  couponUsage,
  dedicatedResourcesLeads,
  blogPosts,
  type User,
  type Contact,
  type Client,
  type SeoAudit,
  type ChatSession,
  type FeaturedClient,
  type CaseStudy,
  type PricingPackage,
  type ServicePage,
  type Coupon,
  type CouponUsage,
  type InsertUser,
  type InsertContact,
  type InsertClient,
  type InsertSeoAudit,
  type InsertChatSession,
  type InsertFeaturedClient,
  type InsertCaseStudy,
  type InsertPricingPackage,
  type InsertServicePage,
  type InsertCoupon,
  type InsertCouponUsage,
  type InsertDedicatedResourcesLead,
  type DedicatedResourcesLead,
  type InsertBlogPost,
  type BlogPost
} from "@shared/schema";

import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;

  // Client management
  createClient(client: InsertClient): Promise<Client>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  updateClientStatus(id: number, status: string): Promise<Client>;

  // SEO Audit management
  createSeoAudit(audit: InsertSeoAudit): Promise<SeoAudit>;
  getSeoAudit(id: number): Promise<SeoAudit | undefined>;
  getAuditsByClient(clientId: number): Promise<SeoAudit[]>;
  updateAuditData(id: number, data: any, score: number, recommendations: string): Promise<SeoAudit>;

  // Chat sessions
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSession(sessionId: string, messages: any[], recommendations?: any[]): Promise<ChatSession>;

  // Content Management
  // Featured Clients
  createFeaturedClient(client: InsertFeaturedClient): Promise<FeaturedClient>;
  getFeaturedClientsByService(servicePage: string): Promise<FeaturedClient[]>;
  getAllFeaturedClients(): Promise<FeaturedClient[]>;
  updateFeaturedClient(id: number, data: Partial<InsertFeaturedClient>): Promise<FeaturedClient>;
  deleteFeaturedClient(id: number): Promise<void>;

  // Case Studies
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]>;
  getAllCaseStudies(): Promise<CaseStudy[]>;
  updateCaseStudy(id: number, data: Partial<InsertCaseStudy>): Promise<CaseStudy>;
  deleteCaseStudy(id: number): Promise<void>;

  // Pricing Packages
  createPricingPackage(pkg: InsertPricingPackage): Promise<PricingPackage>;
  getPricingPackagesByService(servicePage: string): Promise<PricingPackage[]>;
  getAllPricingPackages(): Promise<PricingPackage[]>;
  updatePricingPackage(id: number, data: Partial<InsertPricingPackage>): Promise<PricingPackage>;
  deletePricingPackage(id: number): Promise<void>;

  // Service Pages
  createServicePage(page: InsertServicePage): Promise<ServicePage>;
  getServicePage(slug: string): Promise<ServicePage | undefined>;
  getAllServicePages(): Promise<ServicePage[]>;
  updateServicePage(id: number, data: Partial<InsertServicePage>): Promise<ServicePage>;
  deleteServicePage(id: number): Promise<void>;

  // Blog Posts
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;

  // Contact Management
  deleteContact(id: number): Promise<void>;

  // Case Studies
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]>;
  getAllCaseStudies(): Promise<CaseStudy[]>;
  updateCaseStudy(id: number, data: Partial<InsertCaseStudy>): Promise<CaseStudy>;
  deleteCaseStudy(id: number): Promise<void>;

  // Pricing Packages
  createPricingPackage(pricingPackage: InsertPricingPackage): Promise<PricingPackage>;
  getPricingPackagesByService(servicePage: string): Promise<PricingPackage[]>;
  getAllPricingPackages(): Promise<PricingPackage[]>;
  updatePricingPackage(id: number, data: Partial<InsertPricingPackage>): Promise<PricingPackage>;
  deletePricingPackage(id: number): Promise<void>;

  // Service Pages
  createServicePage(page: InsertServicePage): Promise<ServicePage>;
  getServicePage(slug: string): Promise<ServicePage | undefined>;
  getAllServicePages(): Promise<ServicePage[]>;
  updateServicePage(id: number, data: Partial<InsertServicePage>): Promise<ServicePage>;
  deleteServicePage(id: number): Promise<void>;

  // Coupon Management
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  getCoupon(code: string): Promise<Coupon | undefined>;
  validateCouponForEmail(code: string, email: string): Promise<{ valid: boolean; message: string; coupon?: Coupon }>;
  useCoupon(code: string, email: string): Promise<void>;
  getAllCoupons(): Promise<Coupon[]>;

  // Dedicated Resources Leads
  createDedicatedResourcesLead(lead: InsertDedicatedResourcesLead): Promise<DedicatedResourcesLead>;
  getAllDedicatedResourcesLeads(): Promise<DedicatedResourcesLead[]>;

  // Blog Posts
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private clients: Map<number, Client>;
  private seoAudits: Map<number, SeoAudit>;
  private chatSessions: Map<string, ChatSession>;
  private featuredClients: Map<number, FeaturedClient>;
  private caseStudies: Map<number, CaseStudy>;
  private pricingPackages: Map<number, PricingPackage>;
  private servicePages: Map<number, ServicePage>;
  private coupons: Map<string, Coupon>;
  private couponUsages: Map<number, CouponUsage>;
  private dedicatedResourcesLeads: Map<number, DedicatedResourcesLead>;
  private blogPosts: Map<number, BlogPost>;
  private currentUserId: number;
  private currentContactId: number;
  private currentClientId: number;
  private currentAuditId: number;
  private currentFeaturedClientId: number;
  private currentCaseStudyId: number;
  private currentPricingPackageId: number;
  private currentServicePageId: number;
  private currentCouponUsageId: number;
  private currentDedicatedResourcesLeadId: number;
  private currentBlogPostId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.clients = new Map();
    this.seoAudits = new Map();
    this.chatSessions = new Map();
    this.coupons = new Map();
    this.couponUsages = new Map();
    this.featuredClients = new Map();
    this.caseStudies = new Map();
    this.pricingPackages = new Map();
    this.servicePages = new Map();
    this.dedicatedResourcesLeads = new Map();
    this.blogPosts = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentClientId = 1;
    this.currentAuditId = 1;
    this.currentFeaturedClientId = 1;
    this.currentCaseStudyId = 1;
    this.currentPricingPackageId = 1;
    this.currentServicePageId = 1;
    this.currentCouponUsageId = 1;
    this.currentDedicatedResourcesLeadId = 1;
    this.currentBlogPostId = 1;

    // Initialize default coupons
    this.initializeDefaultCoupons();
    // Initialize with sample data
    this.seedSampleData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      id,
      name: insertContact.name,
      email: insertContact.email,
      phone: insertContact.phone || null,
      company: insertContact.company || null,
      inquiry_type: insertContact.inquiry_type,
      message: insertContact.message,
      preferred_contact: insertContact.preferred_contact,
      agencyName: insertContact.agencyName || null,
      country: insertContact.country,
      topPriority: insertContact.topPriority,
      couponCode: insertContact.couponCode || null,
      // Enhanced service details
      servicesSelected: insertContact.servicesSelected || null,
      budget: insertContact.budget || null,
      timeline: insertContact.timeline || null,
      referralSource: insertContact.referralSource || null,
      serviceDetails: insertContact.serviceDetails || null,
      automationDetails: insertContact.automationDetails || null,
      dedicatedResourceDetails: insertContact.dedicatedResourceDetails || null,
      websiteDetails: insertContact.websiteDetails || null,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Client management methods
  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const client: Client = {
      id,
      name: insertClient.name,
      email: insertClient.email,
      company: insertClient.company || null,
      phone: insertClient.phone || null,
      website: insertClient.website || null,
      status: "pending",
      region: insertClient.region || "US",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.set(id, client);
    return client;
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (client) => client.email === email
    );
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateClientStatus(id: number, status: string): Promise<Client> {
    const client = this.clients.get(id);
    if (!client) {
      throw new Error("Client not found");
    }
    client.status = status;
    client.updatedAt = new Date();
    this.clients.set(id, client);
    return client;
  }

  // SEO Audit management methods
  async createSeoAudit(insertAudit: InsertSeoAudit): Promise<SeoAudit> {
    const id = this.currentAuditId++;
    const audit: SeoAudit = {
      id,
      clientId: insertAudit.clientId || null,
      websiteUrl: insertAudit.websiteUrl,
      auditData: null,
      score: null,
      status: "pending",
      recommendations: null,
      createdAt: new Date(),
      completedAt: null
    };
    this.seoAudits.set(id, audit);
    return audit;
  }

  async getSeoAudit(id: number): Promise<SeoAudit | undefined> {
    return this.seoAudits.get(id);
  }

  async getAuditsByClient(clientId: number): Promise<SeoAudit[]> {
    return Array.from(this.seoAudits.values()).filter(
      (audit) => audit.clientId === clientId
    );
  }

  async updateAuditData(id: number, data: any, score: number, recommendations: string): Promise<SeoAudit> {
    const audit = this.seoAudits.get(id);
    if (!audit) {
      throw new Error("Audit not found");
    }
    audit.auditData = data;
    audit.score = score;
    audit.recommendations = recommendations;
    audit.status = "completed";
    audit.completedAt = new Date();
    this.seoAudits.set(id, audit);
    return audit;
  }

  // Chat session methods
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const session: ChatSession = {
      id: 0, // Not used in memory storage
      sessionId: insertSession.sessionId,
      messages: [],
      clientInfo: insertSession.clientInfo || null,
      recommendations: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.chatSessions.set(insertSession.sessionId, session);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async updateChatSession(sessionId: string, messages: any[], recommendations?: any[]): Promise<ChatSession> {
    const session = this.chatSessions.get(sessionId);
    if (!session) {
      throw new Error("Chat session not found");
    }
    session.messages = messages;
    if (recommendations) {
      session.recommendations = recommendations;
    }
    session.updatedAt = new Date();
    this.chatSessions.set(sessionId, session);
    return session;
  }

  // Featured Clients
  async createFeaturedClient(insertClient: InsertFeaturedClient): Promise<FeaturedClient> {
    const id = this.currentFeaturedClientId++;
    const client: FeaturedClient = {
      ...insertClient,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.featuredClients.set(id, client);
    return client;
  }

  async getFeaturedClientsByService(servicePage: string): Promise<FeaturedClient[]> {
    return Array.from(this.featuredClients.values())
      .filter(client => client.servicePage === servicePage && client.isActive);
  }

  async getAllFeaturedClients(): Promise<FeaturedClient[]> {
    return Array.from(this.featuredClients.values())
      .filter(client => client.isActive);
  }

  async updateFeaturedClient(id: number, data: Partial<InsertFeaturedClient>): Promise<FeaturedClient> {
    const client = this.featuredClients.get(id);
    if (!client) {
      throw new Error("Featured client not found");
    }
    const updated = { ...client, ...data, updatedAt: new Date() };
    this.featuredClients.set(id, updated);
    return updated;
  }

  async deleteFeaturedClient(id: number): Promise<void> {
    this.featuredClients.delete(id);
  }

  // Case Studies
  async createCaseStudy(insertCaseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const id = this.currentCaseStudyId++;
    const caseStudy: CaseStudy = {
      ...insertCaseStudy,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.caseStudies.set(id, caseStudy);
    return caseStudy;
  }

  async getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]> {
    return Array.from(this.caseStudies.values())
      .filter(caseStudy => caseStudy.servicePage === servicePage && caseStudy.isActive);
  }

  async getAllCaseStudies(): Promise<CaseStudy[]> {
    return Array.from(this.caseStudies.values())
      .filter(caseStudy => caseStudy.isActive);
  }

  async updateCaseStudy(id: number, data: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const existingCaseStudy = this.caseStudies.get(id);
    if (!existingCaseStudy) {
      throw new Error("Case study not found");
    }

    const updatedCaseStudy: CaseStudy = {
      ...existingCaseStudy,
      ...data,
      updatedAt: new Date()
    };

    this.caseStudies.set(id, updatedCaseStudy);
    return updatedCaseStudy;
  }

  async deleteCaseStudy(id: number): Promise<void> {
    if (!this.caseStudies.has(id)) {
      throw new Error("Case study not found");
    }
    this.caseStudies.delete(id);
  }

  // Pricing Packages
  async createPricingPackage(insertPackage: InsertPricingPackage): Promise<PricingPackage> {
    const id = this.currentPricingPackageId++;
    const package_: PricingPackage = {
      ...insertPackage,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pricingPackages.set(id, package_);
    return package_;
  }

  async getPricingPackagesByService(servicePage: string): Promise<PricingPackage[]> {
    return Array.from(this.pricingPackages.values())
      .filter(pkg => pkg.servicePage === servicePage && pkg.isActive)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getAllPricingPackages(): Promise<PricingPackage[]> {
    return Array.from(this.pricingPackages.values())
      .filter(pkg => pkg.isActive)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async updatePricingPackage(id: number, data: Partial<InsertPricingPackage>): Promise<PricingPackage> {
    const existingPackage = this.pricingPackages.get(id);
    if (!existingPackage) {
      throw new Error("Pricing package not found");
    }

    const updatedPackage: PricingPackage = {
      ...existingPackage,
      ...data,
      updatedAt: new Date()
    };

    this.pricingPackages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePricingPackage(id: number): Promise<void> {
    if (!this.pricingPackages.has(id)) {
      throw new Error("Pricing package not found");
    }
    this.pricingPackages.delete(id);
  }

  // Service Pages
  async createServicePage(insertPage: InsertServicePage): Promise<ServicePage> {
    const id = this.currentServicePageId++;
    const page: ServicePage = {
      ...insertPage,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.servicePages.set(id, page);
    return page;
  }

  async getServicePage(slug: string): Promise<ServicePage | undefined> {
    return Array.from(this.servicePages.values())
      .find(page => page.slug === slug && page.isActive);
  }

  async getAllServicePages(): Promise<ServicePage[]> {
    return Array.from(this.servicePages.values())
      .filter(page => page.isActive);
  }

  async updateServicePage(id: number, data: Partial<InsertServicePage>): Promise<ServicePage> {
    const existingPage = this.servicePages.get(id);
    if (!existingPage) {
      throw new Error("Service page not found");
    }

    const updatedPage: ServicePage = {
      ...existingPage,
      ...data,
      updatedAt: new Date()
    };

    this.servicePages.set(id, updatedPage);
    return updatedPage;
  }

  async deleteServicePage(id: number): Promise<void> {
    if (!this.servicePages.has(id)) {
      throw new Error("Service page not found");
    }
    this.servicePages.delete(id);
  }

  // Initialize default coupons
  initializeDefaultCoupons() {
    const coupons = [
      {
        id: 1,
        code: "SEO50OFF",
        description: "50% OFF First Month of SEO Services",
        discountPercentage: 50,
        maxUses: null,
        currentUses: 0,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null
      },
      {
        id: 2,
        code: "WEB50OFF",
        description: "50% OFF First Website Development Project",
        discountPercentage: 50,
        maxUses: null,
        currentUses: 0,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null
      },
      {
        id: 3,
        code: "ADSFREE",
        description: "Free Google Ads Setup for First-Time Customers",
        discountPercentage: 100,
        maxUses: null,
        currentUses: 0,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null
      },
      {
        id: 4,
        code: "TEAM30OFF",
        description: "30% OFF First Month of Dedicated Resources",
        discountPercentage: 30,
        maxUses: null,
        currentUses: 0,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null
      },
      {
        id: 5,
        code: "AUTO25OFF",
        description: "25% OFF First N8N Automation Project",
        discountPercentage: 25,
        maxUses: null,
        currentUses: 0,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null
      },
      {
        id: 6,
        code: "AI25OFF",
        description: "25% OFF First AI Agent or Software Building Project",
        discountPercentage: 25,
        maxUses: null,
        currentUses: 0,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null
      }
    ];

    coupons.forEach(coupon => {
      this.coupons.set(coupon.code, coupon);
    });
  }

  // Coupon management methods
  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const coupon: Coupon = {
      id: this.coupons.size + 1,
      code: insertCoupon.code,
      description: insertCoupon.description,
      discountPercentage: insertCoupon.discountPercentage,
      maxUses: insertCoupon.maxUses || null,
      currentUses: 0,
      isActive: insertCoupon.isActive ?? true,
      createdAt: new Date(),
      expiresAt: insertCoupon.expiresAt || null
    };
    this.coupons.set(insertCoupon.code, coupon);
    return coupon;
  }

  async getCoupon(code: string): Promise<Coupon | undefined> {
    return this.coupons.get(code);
  }

  async validateCouponForEmail(code: string, email: string): Promise<{ valid: boolean; message: string; coupon?: Coupon }> {
    const coupon = this.coupons.get(code);

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

    // Check if this email has already used this coupon
    const hasUsed = Array.from(this.couponUsages.values()).some(
      usage => usage.email === email && this.coupons.get(code)?.id === usage.couponId
    );

    if (hasUsed) {
      return { valid: false, message: "You have already used this coupon code" };
    }

    return { valid: true, message: "Coupon is valid", coupon };
  }

  async useCoupon(code: string, email: string): Promise<void> {
    const coupon = this.coupons.get(code);
    if (!coupon) return;

    // Record usage
    const usage: CouponUsage = {
      id: this.currentCouponUsageId++,
      couponId: coupon.id,
      email: email,
      usedAt: new Date()
    };
    this.couponUsages.set(usage.id, usage);

    // Update coupon usage count
    coupon.currentUses++;
    this.coupons.set(code, coupon);
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return Array.from(this.coupons.values());
  }

  // Dedicated Resources Leads
  async createDedicatedResourcesLead(lead: InsertDedicatedResourcesLead): Promise<DedicatedResourcesLead> {
    const newLead: DedicatedResourcesLead = {
      id: this.currentDedicatedResourcesLeadId++,
      ...lead,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dedicatedResourcesLeads.set(newLead.id, newLead);
    return newLead;
  }

  async getAllDedicatedResourcesLeads(): Promise<DedicatedResourcesLead[]> {
    return Array.from(this.dedicatedResourcesLeads.values());
  }

  // Blog Posts
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) {
      throw new Error("Blog post not found");
    }

    const updatedPost: BlogPost = {
      ...existingPost,
      ...data,
      updatedAt: new Date()
    };

    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }

  async getBlogPost(slug: string) {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getPublishedBlogPosts() {
    return Array.from(this.blogPosts.values()).filter(post => post.isPublished);
  }

  async getFeaturedBlogPosts() {
    return Array.from(this.blogPosts.values()).filter(post => post.isPublished && post.isFeatured).slice(0, 3);
  }

  private seedSampleData() {
    // Add featured clients first
    this.featuredClients.set(1, {
      id: 1,
      servicePage: "seo",
      name: "Atlantic Foundation",
      logo: "/images/atlantic-foundation-logo.jpg",
      industry: "Construction",
      testimonial: "BrandingBeez transformed our online presence completely",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.featuredClients.set(2, {
      id: 2,
      servicePage: "google-ads",
      name: "Arlingsworth Solicitors",
      logo: "/images/arlingsworth-logo.jpg",
      industry: "Legal Services",
      testimonial: "Exceptional Google Ads management with outstanding results",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.featuredClients.set(3, {
      id: 3,
      servicePage: "web-development",
      name: "Social Land",
      logo: "/images/socialland-logo.jpeg",
      industry: "Social Media Platform",
      testimonial: "Professional web development that exceeded our expectations",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add comprehensive service pages
    this.servicePages.set(1, {
      id: 1,
      slug: "seo",
      title: "SEO Services",
      subtitle: "Professional SEO services to boost your rankings",
      description: "Comprehensive SEO solutions for businesses",
      heroTitle: "Dominate Search Results",
      heroSubtitle: "Get more organic traffic with our proven SEO strategies",
      auditFormType: "seo",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.servicePages.set(2, {
      id: 2,
      slug: "web-development",
      title: "Web Development",
      subtitle: "Custom websites that convert",
      description: "Professional web development services",
      heroTitle: "Beautiful, Fast Websites",
      heroSubtitle: "Custom web development that drives results",
      auditFormType: "website",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.servicePages.set(3, {
      id: 3,
      slug: "google-ads",
      title: "Google Ads Management",
      subtitle: "PPC campaigns that deliver ROI",
      description: "Professional Google Ads management",
      heroTitle: "Maximize Your Ad Spend",
      heroSubtitle: "Get more leads with optimized Google Ads campaigns",
      auditFormType: "ads",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.servicePages.set(4, {
      id: 4,
      slug: "ai-development",
      title: "AI Development",
      subtitle: "Custom AI solutions for your business",
      description: "AI agents and automation solutions",
      heroTitle: "Transform Your Business with AI",
      heroSubtitle: "Custom AI development and automation services",
      auditFormType: "automation",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.servicePages.set(5, {
      id: 5,
      slug: "dedicated-resources",
      title: "Dedicated Resources",
      subtitle: "Your offshore development team",
      description: "Dedicated developers and specialists",
      heroTitle: "Scale Your Team",
      heroSubtitle: "Access top talent with our dedicated resources",
      auditFormType: "calculator",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add comprehensive SEO pricing packages
    this.pricingPackages.set(1, {
      id: 1,
      servicePage: "seo",
      name: "Starter SEO",
      price: "$400/month",
      description: "Perfect for local businesses and startups",
      features: [
        "Basic audit + quick fixes",
        "10 primary keywords",
        "5 pages optimized",
        "Speed, mobile, meta fixes",
        "1 location GMB setup",
        "1 blog/month (1000 words)",
        "2 links/month (DA 30+)",
        "Basic competitor scan",
        "Monthly summary report"
      ],
      isPopular: false,
      orderIndex: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.pricingPackages.set(2, {
      id: 2,
      servicePage: "seo",
      name: "Growth SEO",
      price: "$650/month",
      description: "Ideal for growing companies",
      features: [
        "Full technical + on-page audit",
        "25 keywords + search intent grouping",
        "10 pages optimized",
        "Schema, redirects, crawl fixes",
        "3 locations + citation submission",
        "2 blogs/month (1000-1200 words)",
        "5 links/month (DA 40+)",
        "Deep 5-competitor analysis",
        "Monthly report + call"
      ],
      isPopular: true,
      orderIndex: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.pricingPackages.set(3, {
      id: 3,
      servicePage: "seo",
      name: "Pro SEO",
      price: "$1,200/month",
      description: "For e-commerce and enterprise websites",
      features: [
        "Deep crawl + custom technical plan",
        "50+ keywords + intent segmentation",
        "20 pages + conversion tracking",
        "Core Web Vitals, JavaScript SEO",
        "5+ locations, review strategy",
        "4 blogs/month (1500+ words)",
        "10 links/month (DA 50+)",
        "Full landscape + quarterly reports",
        "Dashboard + bi-weekly strategy calls"
      ],
      isPopular: false,
      orderIndex: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Google Ads pricing packages
    this.pricingPackages.set(4, {
      id: 4,
      servicePage: "google-ads",
      name: "Starter",
      price: "$399/month + ad spend",
      description: "Perfect for small businesses starting with Google Ads",
      features: [
        "Ad spend range: $1,000 - $3,000",
        "Search Ads & Performance Max",
        "Remarketing campaigns",
        "Up to 2 target locations",
        "3 search ad sets",
        "Conversion tracking setup",
        "Monthly summary report",
        "Email support"
      ],
      isPopular: false,
      orderIndex: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.pricingPackages.set(5, {
      id: 5,
      servicePage: "google-ads",
      name: "Growth",
      price: "$799/month + ad spend",
      description: "Ideal for growing businesses",
      features: [
        "Ad spend range: $3,000 - $8,000",
        "Search, PMax, Display & Brand campaigns",
        "Up to 5 target locations",
        "5 search + 1 display creative",
        "Landing page optimization recommendations",
        "Audience segmentation",
        "Monthly competitor monitoring",
        "Detailed PDF reports",
        "2 monthly strategy calls"
      ],
      isPopular: true,
      orderIndex: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.pricingPackages.set(6, {
      id: 6,
      servicePage: "google-ads",
      name: "Scale",
      price: "$1,299/month + ad spend",
      description: "For large businesses and complex campaigns",
      features: [
        "Ad spend range: $8,000 - $15,000",
        "Full funnel ads: Search, Display, YouTube",
        "Shopping ads (if e-commerce)",
        "Nationwide or up to 10 locations",
        "Advanced audience segmentation",
        "A/B testing recommendations",
        "Bi-weekly competitor monitoring",
        "Advanced dashboard access"
      ],
      isPopular: false,
      orderIndex: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Web Development pricing packages
    this.pricingPackages.set(7, {
      id: 7,
      servicePage: "web-development",
      name: "Basic Website",
      price: "$2,999",
      description: "Simple business website",
      features: [
        "5 pages",
        "Mobile responsive",
        "Contact form",
        "Basic SEO",
        "1 year hosting"
      ],
      isPopular: false,
      orderIndex: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.pricingPackages.set(8, {
      id: 8,
      servicePage: "web-development",
      name: "Professional Website",
      price: "$5,999",
      description: "Advanced business website",
      features: [
        "10 pages",
        "Custom design",
        "CMS integration",
        "E-commerce ready",
        "Advanced SEO",
        "2 years hosting"
      ],
      isPopular: true,
      orderIndex: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.pricingPackages.set(9, {
      id: 9,
      servicePage: "web-development",
      name: "Enterprise Website",
      price: "$12,999",
      description: "Custom enterprise solution",
      features: [
        "Unlimited pages",
        "Custom functionality",
        "API integrations",
        "Performance optimization",
        "Priority support",
        "3 years hosting"
      ],
      isPopular: false,
      orderIndex: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // SEO Case Studies
    this.caseStudies.set(1, {
      id: 1,
      servicePage: "seo",
      title: "Atlantic Foundation Success",
      client: "Atlantic Foundation & Crawl Space Repair",
      industry: "Construction",
      results: { traffic: "+49%", keywords: "122 #1 rankings", revenue: "121% more leads" },
      description: "Transformed a local construction company's SEO from score 69 to 100 and dramatically increased lead generation.",
      imageUrl: "/images/seo-case-1.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(2, {
      id: 2,
      servicePage: "seo",
      title: "Scuba Diving Adventure Growth",
      client: "By The Shore SCUBA Instruction",
      industry: "SCUBA Training",
      results: { traffic: "+31%", keywords: "61 top rankings", revenue: "360% phone clicks" },
      description: "Helped a diving company dominate local search results and dramatically increase booking inquiries.",
      imageUrl: "/images/seo-case-2.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(3, {
      id: 3,
      servicePage: "seo",
      title: "STAT Planning Breakthrough",
      client: "STAT Planning",
      industry: "Town & Local Planning Consultancy",
      results: { traffic: "+453%", keywords: "5 top rankings", revenue: "+720% impressions" },
      description: "Transformed a local planning consultancy's online visibility with 453% click increase and major keyword ranking improvements in just one month.",
      imageUrl: "/images/seo-case-3.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(4, {
      id: 4,
      servicePage: "seo",
      title: "UBU Design Authority",
      client: "UBU Design",
      industry: "Architecture & Design",
      results: { traffic: "230 total users", keywords: "482 clicks", revenue: "50,900 impressions" },
      description: "Transformed a UK architecture firm from zero organic visibility to generating daily leads through strategic B2B SEO.",
      imageUrl: "/images/seo-case-4.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(5, {
      id: 5,
      servicePage: "seo",
      title: "Citypat Electrical Safety Success",
      client: "Citypat",
      industry: "Electrical Safety",
      results: { traffic: "+380%", keywords: "25 top rankings", revenue: "+250% leads" },
      description: "Electrical safety company achieves dominant search presence and significant lead increase.",
      imageUrl: "/images/seo-case-5.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Google Ads Case Studies
    this.caseStudies.set(6, {
      id: 6,
      servicePage: "google-ads",
      title: "UK Legal Services Excellence",
      client: "Arlingsworth Solicitors",
      industry: "Legal Services",
      results: { cpa: "£6.51 lowest CPA", conversionRate: "18.95% conversion rate", clicks: "1,139+ total clicks" },
      description: "Achieved exceptional results for UK family law firm with Performance Max and Search campaigns optimization.",
      imageUrl: "/images/google-ads-case-1.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(7, {
      id: 7,
      servicePage: "google-ads",
      title: "Waste Management Transformation",
      client: "JunksAway",
      industry: "Waste Management",
      results: { cpaReduction: "82% CPA reduction", conversions: "706 total conversions", roas: "1.28x ROAS achieved" },
      description: "Dramatically reduced CPA from $34.37 to $6.09 for US junk removal company through strategic campaign restructure.",
      imageUrl: "/images/google-ads-case-2.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(8, {
      id: 8,
      servicePage: "google-ads",
      title: "Pet Services Success",
      client: "The Dog Guy",
      industry: "Dog Training",
      results: { conversionRate: "12.06% conversion rate", conversions: "192 total conversions", cpa: "£20.35 average CPA" },
      description: "Optimized underperforming campaigns for UK dog training business, transitioning from audit to monthly retainer.",
      imageUrl: "/images/google-ads-case-3.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Web Development Case Studies
    this.caseStudies.set(9, {
      id: 9,
      servicePage: "web-development",
      title: "E-commerce Website Redesign",
      client: "Fashion Forward",
      industry: "E-commerce",
      results: { conversions: "+320%", revenue: "+450%", speed: "2.1s load time" },
      description: "Complete e-commerce website redesign that tripled conversions",
      imageUrl: "/images/web-case-1.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(10, {
      id: 10,
      servicePage: "web-development",
      title: "Social Land Platform",
      client: "Social Land",
      industry: "Social Media Platform",
      results: { performance: "+85% faster", users: "10,000+ active users", engagement: "+200% engagement" },
      description: "Built a comprehensive social media platform with real-time features and scalable architecture.",
      imageUrl: "/images/web-case-2.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.caseStudies.set(11, {
      id: 11,
      servicePage: "web-development",
      title: "TS Landscaping Website",
      client: "TS Landscaping",
      industry: "Landscaping Services",
      results: { leads: "+180% more leads", traffic: "+220% traffic", conversion: "15% conversion rate" },
      description: "Modern landscaping website with portfolio showcase and lead generation optimization.",
      imageUrl: "/images/web-case-3.jpg",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update counters
    this.currentFeaturedClientId = 4;
    this.currentServicePageId = 6;
    this.currentPricingPackageId = 10;
    this.currentCaseStudyId = 12;
    this.currentBlogPostId = 2; // Assuming we add at least one blog post initially for testing
  }
}

import { DatabaseStorage } from "./db-storage";

export const storage = new DatabaseStorage();