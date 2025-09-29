import { db } from "./db";
import {
  users, contacts, clients, seoAudits, chatSessions, featuredClients,
  caseStudies, pricingPackages, servicePages, coupons, couponUsage,
  dedicatedResourcesLeads, blogPosts
} from "@shared/schema";
import type { IStorage } from "./storage";
import type {
  User, Contact, Client, SeoAudit, ChatSession, FeaturedClient,
  CaseStudy, PricingPackage, ServicePage, Coupon, CouponUsage,
  DedicatedResourcesLead, BlogPost, InsertUser, InsertContact, InsertClient,
  InsertSeoAudit, InsertChatSession, InsertFeaturedClient,
  InsertCaseStudy, InsertPricingPackage, InsertServicePage,
  InsertCoupon, InsertCouponUsage, InsertDedicatedResourcesLead, InsertBlogPost
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  // Client management
  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async getClient(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
    return result[0];
  }

  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async updateClientStatus(id: number, status: string): Promise<Client> {
    const result = await db.update(clients)
      .set({ status, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }

  // SEO Audit management
  async createSeoAudit(audit: InsertSeoAudit): Promise<SeoAudit> {
    const result = await db.insert(seoAudits).values(audit).returning();
    return result[0];
  }

  async getSeoAudit(id: number): Promise<SeoAudit | undefined> {
    const result = await db.select().from(seoAudits).where(eq(seoAudits.id, id)).limit(1);
    return result[0];
  }

  async getAuditsByClient(clientId: number): Promise<SeoAudit[]> {
    return await db.select().from(seoAudits).where(eq(seoAudits.clientId, clientId));
  }

  async updateAuditData(id: number, data: any, score: number, recommendations: string): Promise<SeoAudit> {
    const result = await db.update(seoAudits)
      .set({
        auditData: data,
        score,
        recommendations,
        status: "completed",
        completedAt: new Date()
      })
      .where(eq(seoAudits.id, id))
      .returning();
    return result[0];
  }

  // Chat sessions
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const result = await db.insert(chatSessions).values(session).returning();
    return result[0];
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    const result = await db.select().from(chatSessions).where(eq(chatSessions.sessionId, sessionId)).limit(1);
    return result[0];
  }

  async updateChatSession(sessionId: string, messages: any[], recommendations?: any[]): Promise<ChatSession> {
    const updateData: any = { messages, updatedAt: new Date() };
    if (recommendations) {
      updateData.recommendations = recommendations;
    }

    const result = await db.update(chatSessions)
      .set(updateData)
      .where(eq(chatSessions.sessionId, sessionId))
      .returning();
    return result[0];
  }

  // Featured Clients
  async createFeaturedClient(client: InsertFeaturedClient): Promise<FeaturedClient> {
    const result = await db.insert(featuredClients).values(client).returning();
    return result[0];
  }

  async getFeaturedClientsByService(servicePage: string): Promise<FeaturedClient[]> {
    return await db.select().from(featuredClients)
      .where(and(eq(featuredClients.servicePage, servicePage), eq(featuredClients.isActive, true)));
  }

  async getAllFeaturedClients(): Promise<FeaturedClient[]> {
    return await db.select().from(featuredClients).where(eq(featuredClients.isActive, true));
  }

  async updateFeaturedClient(id: number, data: Partial<InsertFeaturedClient>): Promise<FeaturedClient> {
    const result = await db.update(featuredClients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(featuredClients.id, id))
      .returning();
    return result[0];
  }

  async deleteFeaturedClient(id: number): Promise<void> {
    await db.delete(featuredClients).where(eq(featuredClients.id, id));
  }

  // Case Studies
  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const result = await db.insert(caseStudies).values(caseStudy).returning();
    return result[0];
  }

  async getCaseStudiesByService(servicePage: string): Promise<CaseStudy[]> {
    return await db.select().from(caseStudies)
      .where(and(eq(caseStudies.servicePage, servicePage), eq(caseStudies.isActive, true)));
  }

  async getAllCaseStudies(): Promise<CaseStudy[]> {
    return await db.select().from(caseStudies).where(eq(caseStudies.isActive, true));
  }

  async updateCaseStudy(id: number, data: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const result = await db.update(caseStudies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(caseStudies.id, id))
      .returning();
    return result[0];
  }

  async deleteCaseStudy(id: number): Promise<void> {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  }

  // Pricing Packages
  async createPricingPackage(package_: InsertPricingPackage): Promise<PricingPackage> {
    const result = await db.insert(pricingPackages).values(package_).returning();
    return result[0];
  }

  async getPricingPackagesByService(servicePage: string): Promise<PricingPackage[]> {
    return await db.select().from(pricingPackages)
      .where(and(eq(pricingPackages.servicePage, servicePage), eq(pricingPackages.isActive, true)))
      .orderBy(pricingPackages.orderIndex);
  }

  async getAllPricingPackages(): Promise<PricingPackage[]> {
    return await db.select().from(pricingPackages)
      .where(eq(pricingPackages.isActive, true))
      .orderBy(pricingPackages.orderIndex);
  }

  async updatePricingPackage(id: number, data: Partial<InsertPricingPackage>): Promise<PricingPackage> {
    const result = await db.update(pricingPackages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pricingPackages.id, id))
      .returning();
    return result[0];
  }

  async deletePricingPackage(id: number): Promise<void> {
    await db.delete(pricingPackages).where(eq(pricingPackages.id, id));
  }

  // Service Pages
  async createServicePage(page: InsertServicePage): Promise<ServicePage> {
    const result = await db.insert(servicePages).values(page).returning();
    return result[0];
  }

  async getServicePage(slug: string): Promise<ServicePage | undefined> {
    const result = await db.select().from(servicePages)
      .where(and(eq(servicePages.slug, slug), eq(servicePages.isActive, true)))
      .limit(1);
    return result[0];
  }

  async getAllServicePages(): Promise<ServicePage[]> {
    return await db.select().from(servicePages).where(eq(servicePages.isActive, true));
  }

  async updateServicePage(id: number, data: Partial<InsertServicePage>): Promise<ServicePage> {
    const result = await db.update(servicePages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(servicePages.id, id))
      .returning();
    return result[0];
  }

  async deleteServicePage(id: number): Promise<void> {
    await db.delete(servicePages).where(eq(servicePages.id, id));
  }

  // Coupon management
  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const result = await db.insert(coupons).values(coupon).returning();
    return result[0];
  }

  async getCoupon(code: string): Promise<Coupon | undefined> {
    const result = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    return result[0];
  }

  async validateCouponForEmail(code: string, email: string): Promise<{ valid: boolean; message: string; coupon?: Coupon }> {
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

    if (coupon.maxUses && (coupon.currentUses ?? 0) >= coupon.maxUses) {
      return { valid: false, message: "Coupon usage limit reached" };
    }

    // Check if this email has already used this coupon
    const existingUsage = await db.select().from(couponUsage)
      .where(and(eq(couponUsage.couponId, coupon.id), eq(couponUsage.email, email)))
      .limit(1);

    if (existingUsage.length > 0) {
      return { valid: false, message: "You have already used this coupon code" };
    }

    return { valid: true, message: "Coupon is valid", coupon };
  }

  async useCoupon(code: string, email: string): Promise<void> {
    const coupon = await this.getCoupon(code);
    if (!coupon) return;

    // Record usage
    await db.insert(couponUsage).values({
      couponId: coupon.id,
      email: email
    });

    // Update coupon usage count
    await db.update(coupons)
      .set({ currentUses: (coupon.currentUses ?? 0) + 1 })
      .where(eq(coupons.id, coupon.id));
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons);
  }

  // Dedicated Resources Leads
  async createDedicatedResourcesLead(lead: InsertDedicatedResourcesLead): Promise<DedicatedResourcesLead> {
    const result = await db.insert(dedicatedResourcesLeads).values(lead).returning();
    return result[0];
  }

  async getAllDedicatedResourcesLeads(): Promise<DedicatedResourcesLead[]> {
    return await db.select().from(dedicatedResourcesLeads).orderBy(desc(dedicatedResourcesLeads.createdAt));
  }

  // Blog Posts
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      const result = await db.insert(blogPosts).values(post).returning();
      return result[0];
    } catch (error: any) {
      // Handle missing meta_title column gracefully
      if (error.code === '42703' && error.message.includes('meta_title')) {
        console.log('Creating blog post without meta_title column');
        const { metaTitle, ...postWithoutMetaTitle } = post;
        const result = await db.insert(blogPosts).values(postWithoutMetaTitle).returning();
        return result[0];
      }
      throw error;
    }
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error: any) {
      // Handle missing meta_title column gracefully
      if (error.code === '42703' && error.message.includes('meta_title')) {
        console.log('Fetching blog posts without meta_title column');
        return await db.select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          subtitle: blogPosts.subtitle,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          imageUrl: blogPosts.imageUrl,
          tags: blogPosts.tags,
          author: blogPosts.author,
          readTime: blogPosts.readTime,
          isPublished: blogPosts.isPublished,
          isFeatured: blogPosts.isFeatured,
          metaDescription: blogPosts.metaDescription,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        }).from(blogPosts).orderBy(desc(blogPosts.createdAt));
      }
      throw error;
    }
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts)
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)))
        .limit(1);
      return result[0];
    } catch (error: any) {
      // Handle missing meta_title column gracefully
      if (error.code === '42703' && error.message.includes('meta_title')) {
        console.log('Fetching blog post by slug without meta_title column');
        const result = await db.select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          subtitle: blogPosts.subtitle,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          imageUrl: blogPosts.imageUrl,
          tags: blogPosts.tags,
          author: blogPosts.author,
          readTime: blogPosts.readTime,
          isPublished: blogPosts.isPublished,
          isFeatured: blogPosts.isFeatured,
          metaDescription: blogPosts.metaDescription,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        }).from(blogPosts)
          .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)))
          .limit(1);
        return result[0];
      }
      throw error;
    }
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    try {
      console.log('\n=== DB STORAGE getPublishedBlogPosts START ===');
      console.log('🔍 Fetching published blog posts from database...');
      console.log('🔗 Database connection status:', !!db);

      const posts = await db.select().from(blogPosts)
        .where(eq(blogPosts.isPublished, true))
        .orderBy(desc(blogPosts.createdAt));

      console.log(`📊 SQL query executed successfully - Found ${posts.length} published posts`);

      if (posts.length === 0) {
        console.log('⚠️ No published posts found - checking total count...');
        const totalCount = await db.select().from(blogPosts);
        console.log(`📊 Total posts in database: ${totalCount.length}`);

        const publishedCount = await db.select().from(blogPosts)
          .where(eq(blogPosts.isPublished, true));
        console.log(`📊 Published posts count: ${publishedCount.length}`);

        // Sample a few posts to check their status
        const samplePosts = await db.select({
          id: blogPosts.id,
          title: blogPosts.title,
          isPublished: blogPosts.isPublished,
          createdAt: blogPosts.createdAt
        }).from(blogPosts).limit(5);

        console.log('📋 Sample posts from database:', samplePosts);
      } else {
        console.log('✅ Published posts found:', posts.map(p => ({
          id: p.id,
          title: p.title,
          isPublished: p.isPublished,
          slug: p.slug
        })));
      }

      console.log('=== DB STORAGE getPublishedBlogPosts END ===\n');
      return posts;
    } catch (error: any) {
      console.error('\n=== DB STORAGE ERROR ===');
      console.error('❌ Error in getPublishedBlogPosts:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);

      // Handle missing meta_title column gracefully
      if (error.code === '42703' && error.message.includes('meta_title')) {
        console.log('🔧 Trying fallback query without meta_title column');
        const posts = await db.select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          subtitle: blogPosts.subtitle,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          imageUrl: blogPosts.imageUrl,
          tags: blogPosts.tags,
          author: blogPosts.author,
          readTime: blogPosts.readTime,
          isPublished: blogPosts.isPublished,
          isFeatured: blogPosts.isFeatured,
          metaDescription: blogPosts.metaDescription,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        }).from(blogPosts)
          .where(eq(blogPosts.isPublished, true))
          .orderBy(desc(blogPosts.createdAt));

        console.log(`✅ Fallback query successful - Found ${posts.length} published posts`);
        console.log('=== DB STORAGE ERROR RESOLVED ===\n');
        return posts;
      }

      console.error('=== DB STORAGE ERROR END ===\n');
      throw error;
    }
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts)
        .where(and(eq(blogPosts.isPublished, true), eq(blogPosts.isFeatured, true)))
        .orderBy(desc(blogPosts.createdAt));
    } catch (error: any) {
      // Handle missing meta_title column gracefully
      if (error.code === '42703' && error.message.includes('meta_title')) {
        console.log('Fetching featured blog posts without meta_title column');
        return await db.select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          subtitle: blogPosts.subtitle,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          imageUrl: blogPosts.imageUrl,
          tags: blogPosts.tags,
          author: blogPosts.author,
          readTime: blogPosts.readTime,
          isPublished: blogPosts.isPublished,
          isFeatured: blogPosts.isFeatured,
          metaDescription: blogPosts.metaDescription,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        }).from(blogPosts)
          .where(and(eq(blogPosts.isPublished, true), eq(blogPosts.isFeatured, true)))
          .orderBy(desc(blogPosts.createdAt));
      }
      throw error;
    }
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    try {
      const result = await db.update(blogPosts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning();
      return result[0];
    } catch (error: any) {
      // Handle missing meta_title column gracefully
      if (error.code === '42703' && error.message.includes('meta_title')) {
        console.log('Updating blog post without meta_title column');
        const { metaTitle, ...dataWithoutMetaTitle } = data;
        const result = await db.update(blogPosts)
          .set({ ...dataWithoutMetaTitle, updatedAt: new Date() })
          .where(eq(blogPosts.id, id))
          .returning();
        return result[0];
      }
      throw error;
    }
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return result[0];
    } catch (error: any) {
      // Handle missing meta_title column gracefully
      if (error.code === '42703' && error.message.includes('meta_title')) {
        console.log('Fetching blog post by ID without meta_title column');
        const result = await db.select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          subtitle: blogPosts.subtitle,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          imageUrl: blogPosts.imageUrl,
          tags: blogPosts.tags,
          author: blogPosts.author,
          readTime: blogPosts.readTime,
          isPublished: blogPosts.isPublished,
          isFeatured: blogPosts.isFeatured,
          metaDescription: blogPosts.metaDescription,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        }).from(blogPosts).where(eq(blogPosts.id, id));
        return result[0];
      }
      throw error;
    }
  }

  // Contact Management
  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

}

// Export storage instance
export const storage = new DatabaseStorage();