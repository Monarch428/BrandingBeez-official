import type {
  BlogPost,
  CaseStudy,
  ChatSession,
  Client,
  Contact,
  Coupon,
  DedicatedResourcesLead,
  FeaturedClient,
  InsertBlogPost,
  InsertCaseStudy,
  InsertChatSession,
  InsertClient,
  InsertContact,
  InsertCoupon,
  InsertDedicatedResourcesLead,
  InsertFeaturedClient,
  InsertPricingPackage,
  InsertSeoAudit,
  InsertServicePage,
  InsertUser,
  InsertNewsletterSubscriber,
  InsertPortfolioItem,
  InsertPortfolioContent,
  NewsletterSubscriber,
  PortfolioItem,
  PortfolioContent,
  PricingPackage,
  SeoAudit,
  ServicePage,
  User,
} from "@shared/schema";
import { DatabaseStorage } from "./db-storage";

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
}

export const storage: IStorage = new DatabaseStorage();
