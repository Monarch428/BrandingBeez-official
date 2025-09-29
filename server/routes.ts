import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import path from "path";
import fs from "fs";
import newsletterRoutes from "./routes/newsletter";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | string[] | undefined;
        name: string | string[] | undefined;
      };
      file?: {
        filename: string;
        originalname: string;
        mimetype: string;
        size: number;
        path: string;
      };
    }
  }
}
import { storage } from "./db-storage";
import {
  analyzeSEOAudit,
  analyzeWebsiteSEO,
  analyzeWebsiteSecurity,
  calculatePricing,
  analyzeGoogleAds,
  analyzeAutomation,
  generateAIResponse,
} from "./openai";
import {
  securityHeaders,
  apiRateLimit,
  formRateLimit,
  contactRateLimit,
  publicContentRateLimit,
  spamDetection,
  validateContactForm,
  corsOptions,
  securityLogger,
  hidePoweredBy,
} from "./security";

import {
  insertContactSchema,
  insertClientSchema,
  insertSeoAuditSchema,
  insertChatSessionSchema,
  insertDedicatedResourcesLeadSchema,
  insertFeaturedClientSchema,
  insertCaseStudySchema,
  insertPricingPackageSchema,
  insertServicePageSchema,
} from "@shared/schema";
import { z } from "zod";
import { sendContactNotification, sendEmailViaGmail } from "./email-service";
import { notificationService } from "./notification-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply security middleware
  app.use(hidePoweredBy);
  app.use(securityLogger);
  app.use(securityHeaders());
  app.use(cors(corsOptions));

  // Apply rate limiting to all API routes
  app.use("/api/", apiRateLimit);

  // Simple admin credentials
  const ADMIN_EMAIL = "info@brandingbeez.co.uk";
  const ADMIN_PASSWORD = "Vignesh@95";

  // Authentication middleware for admin routes
  const authenticateAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        authenticated: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    // Simple token validation (in production, use proper JWT)
    if (
      token !==
      Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString("base64")
    ) {
      return res.status(401).json({
        authenticated: false,
        message: "Invalid credentials",
      });
    }

    req.user = { id: "admin", name: "Admin User" };
    next();
  };

  // Admin login endpoint
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = Buffer.from(`${email}:${password}`).toString("base64");
      res.json({
        authenticated: true,
        token,
        user: {
          id: "admin",
          name: "Admin User",
          email: email,
        },
      });
    } else {
      res.status(401).json({
        authenticated: false,
        message: "Invalid email or password",
      });
    }
  });
  app.use("/api/newsletter", newsletterRoutes);

  // Database health check endpoint
  app.get("/api/health/database", async (req, res) => {
    try {
      const { db } = await import("./db");

      // Test basic database connectivity
      const result = await db.execute("SELECT 1 as health_check");

      // Test blog_posts table specifically
      const blogCount = await storage.getAllBlogPosts();
      const publishedCount = await storage.getPublishedBlogPosts();

      res.json({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        stats: {
          totalBlogPosts: blogCount.length,
          publishedBlogPosts: publishedCount.length,
          healthCheck: result?.[0]?.health_check === 1 ? "passed" : "failed",
        },
      });
    } catch (error) {
      console.error("Database health check failed:", error);
      res.status(500).json({
        status: "unhealthy",
        database: "disconnected",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Auth check endpoint
  app.get("/api/auth/check", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        authenticated: false,
        user: null,
      });
    }

    const token = authHeader.split(" ")[1];

    if (
      token ===
      Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString("base64")
    ) {
      res.json({
        authenticated: true,
        user: {
          id: "admin",
          name: "Admin User",
          email: ADMIN_EMAIL,
        },
      });
    } else {
      res.json({
        authenticated: false,
        user: null,
      });
    }
  });

  // Placeholder image endpoint to prevent 404 errors
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    // Return SVG placeholder instead of external redirect
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
      <rect width='${width}' height='${height}' fill='#8b5cf6'/>
      <text x='${parseInt(width) / 2}' y='${parseInt(height) / 2}' fill='white' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle'>Placeholder</text>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  });

  // Contact form submission endpoint (with enhanced security)
  app.post("/api/contacts", contactRateLimit, async (req, res) => {
    try {
      const {
        name,
        email,
        company,
        phone,
        service,
        message,
        region,
        budget,
        timeline,
        referral,
        couponCode,
        websiteDetails,
        dedicatedResourceDetails,
        seoDetails,
        googleAdsDetails,
        n8nDetails,
        aiDetails,
        automationDetails,
      } = req.body;

      // Basic validation for required fields
      if (!name || !email) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Please provide your name and email address.",
        });
      }

      // Determine form type based on submitted data
      let formType = "contact-form";
      if (service === "automation-pricing" || automationDetails) {
        formType = "automation-pricing";
      } else if (dedicatedResourceDetails && dedicatedResourceDetails.roles) {
        formType = "dedicated-resources";
      } else if (seoDetails && seoDetails.length > 0) {
        formType = "seo-audit";
      } else if (googleAdsDetails && googleAdsDetails.length > 0) {
        formType = "google-ads-audit";
      } else if (service && !message) {
        formType = "service-selection";
      }

      // Build comprehensive message from form data
      let fullMessage =
        message || `${formType.replace(/-/g, " ").toUpperCase()} submission`;

      // Add service selection if provided
      if (service) {
        fullMessage += `\n\n📋 PRIMARY SERVICE: ${service.replace(/-/g, " ").toUpperCase()}`;
      }

      if (
        dedicatedResourceDetails &&
        dedicatedResourceDetails.roles &&
        dedicatedResourceDetails.roles.length > 0
      ) {
        fullMessage += `\n\n👥 DEDICATED RESOURCES REQUESTED:`;
        dedicatedResourceDetails.roles.forEach((role: any) => {
          fullMessage += `\n• ${role.type || "Professional"}: ${role.level || "standard"} level (${role.hours || 40}hrs/week)`;
        });
      }

      if (seoDetails && seoDetails.length > 0) {
        fullMessage += `\n\n🔍 SEO SERVICES REQUESTED:\n• ${seoDetails.join("\n• ")}`;
      }

      if (googleAdsDetails && googleAdsDetails.length > 0) {
        fullMessage += `\n\n🎯 GOOGLE ADS SERVICES:\n• ${googleAdsDetails.join("\n• ")}`;
      }

      if (n8nDetails && n8nDetails.length > 0) {
        fullMessage += `\n\n⚙️ N8N AUTOMATIONS:\n• ${n8nDetails.join("\n• ")}`;
      }

      if (aiDetails && aiDetails.length > 0) {
        fullMessage += `\n\n🤖 AI DEVELOPMENT:\n• ${aiDetails.join("\n• ")}`;
      }

      if (automationDetails) {
        fullMessage += `\n\n🔧 AUTOMATION ANALYSIS:`;
        fullMessage += `\n• Industry: ${automationDetails.industry || "Not specified"}`;
        fullMessage += `\n• Business Size: ${automationDetails.businessSize || "Not specified"}`;
        fullMessage += `\n• Process Complexity: ${automationDetails.processComplexity || "Not specified"}`;
        fullMessage += `\n• Manual Hours/Week: ${automationDetails.manualHours || "Not specified"}`;
        fullMessage += `\n• Team Size: ${automationDetails.teamSize || "Not specified"}`;
        fullMessage += `\n• Current Error Rate: ${automationDetails.currentErrorRate || "Not specified"}%`;

        if (automationDetails.calculatedSavings) {
          const savings = automationDetails.calculatedSavings;
          fullMessage += `\n\n💰 CALCULATED SAVINGS:`;
          fullMessage += `\n• Monthly: $${savings.monthly?.toLocaleString() || "Not calculated"}`;
          fullMessage += `\n• Annual: $${savings.annual?.toLocaleString() || "Not calculated"}`;
          fullMessage += `\n• Percentage: ${savings.percentage || "Not calculated"}%`;
          fullMessage += `\n• Traditional Cost: $${savings.traditionalCost?.toLocaleString() || "Not calculated"}/month`;
          fullMessage += `\n• Automated Cost: $${savings.automatedCost?.toLocaleString() || "Not calculated"}/month`;
        }
      }

      if (budget) {
        fullMessage += `\n\n💰 BUDGET: ${budget}`;
      }

      if (timeline) {
        fullMessage += `\n\n⏰ TIMELINE: ${timeline}`;
      }

      if (referral) {
        fullMessage += `\n\n📢 REFERRAL SOURCE: ${referral}`;
      }

      // Transform to match database schema
      const contactData = {
        name,
        email,
        phone: phone || "",
        company: company || "",
        inquiry_type: formType,
        message: fullMessage,
        preferred_contact: "email",
        agencyName: company,
        country: region || "US",
        topPriority: service || formType,
        couponCode: couponCode || null,
      };

      const validatedData = insertContactSchema.parse(contactData);
      const contact = await storage.createContact(validatedData);

      // Send email notification
      try {
        await sendContactNotification({
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || undefined,
          phone: validatedData.phone || undefined,
          message: validatedData.message,
          submittedAt: new Date(),
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the form submission if email fails
      }

      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Contact creation error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", authenticateAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Get recent notifications (admin only)
  app.get("/api/notifications", authenticateAdmin, async (req, res) => {
    try {
      const notifications = notificationService.getNotifications();
      const unreadCount = notificationService.getUnreadCount();
      res.json({
        notifications,
        unreadCount,
        total: notifications.length,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read (admin only)
  app.post(
    "/api/notifications/:id/read",
    authenticateAdmin,
    async (req, res) => {
      try {
        const { id } = req.params;
        notificationService.markAsRead(id);
        res.json({ success: true });
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        res
          .status(500)
          .json({ message: "Failed to mark notification as read" });
      }
    },
  );

  // Mark all notifications as read (admin only)
  app.post(
    "/api/notifications/read-all",
    authenticateAdmin,
    async (req, res) => {
      try {
        notificationService.markAllAsRead();
        res.json({ success: true });
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        res
          .status(500)
          .json({ message: "Failed to mark all notifications as read" });
      }
    },
  );

  // Lead capture form endpoint (with form security)
  app.post(
    "/api/lead-capture",
    formRateLimit,
    validateContactForm,
    spamDetection,
    async (req, res) => {
      try {
        const { email, name, company, service, phone, leadMagnet } = req.body;

        // Create lead in database using contact schema
        const lead = await storage.createContact({
          name,
          email,
          inquiry_type: service || "lead-capture",
          message: `Lead magnet request: ${leadMagnet}. Company: ${company}`,
          preferred_contact: "email",
          country: "US",
          topPriority: leadMagnet,
          phone,
          company,
        });

        // Send email notification for lead capture
        try {
          await sendContactNotification({
            name: lead.name,
            email: lead.email,
            company: lead.company || undefined,
            phone: lead.phone || undefined,
            message: `LEAD CAPTURE: ${lead.message}`,
            submittedAt: new Date(),
          });
        } catch (emailError) {
          console.error("Lead capture email notification failed:", emailError);
        }

        res.json({
          success: true,
          lead,
          message: "Lead magnet will be sent to your email shortly",
        });
      } catch (error) {
        console.error("Error creating lead:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to capture lead" });
      }
    },
  );

  // Client submission endpoint
  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.json({ success: true, client });
    } catch (error) {
      console.error("Client creation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dedicated Resources Leads endpoint
  app.post(
    "/api/dedicated-resources-leads",
    formRateLimit,
    validateContactForm,
    spamDetection,
    async (req, res) => {
      try {
        const validatedData = insertDedicatedResourcesLeadSchema.parse(
          req.body,
        );
        const lead = await storage.createDedicatedResourcesLead(validatedData);

        // Send email notification for dedicated resources lead
        try {
          await sendContactNotification({
            name: validatedData.fullName,
            email: validatedData.email,
            company: undefined,
            phone: undefined,
            message: `DEDICATED RESOURCES LEAD: ${validatedData.resourceType}. Additional Notes: ${validatedData.additionalNotes || "None"}`,
            submittedAt: new Date(),
          });
        } catch (emailError) {
          console.error(
            "Dedicated resources lead email notification failed:",
            emailError,
          );
        }

        res.json({ success: true, lead });
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({
            message: "Validation error",
            errors: error.errors,
          });
        } else {
          console.error("Dedicated resources lead creation error:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    },
  );

  // Get all dedicated resources leads (for admin purposes)
  app.get(
    "/api/dedicated-resources-leads",
    authenticateAdmin,
    async (req, res) => {
      try {
        const leads = await storage.getAllDedicatedResourcesLeads();
        res.json(leads);
      } catch (error) {
        console.error("Failed to fetch dedicated resources leads:", error);
        res.status(500).json({ message: "Failed to fetch leads" });
      }
    },
  );

  // Admin dashboard basic routes (protected)
  app.get(
    "/api/admin/featured-clients",
    authenticateAdmin,
    async (req, res) => {
      try {
        const clients = await storage.getAllClients();
        res.json(clients);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch clients" });
      }
    },
  );

  app.post(
    "/api/admin/featured-clients",
    authenticateAdmin,
    async (req, res) => {
      try {
        const validatedData = insertClientSchema.parse(req.body);
        const client = await storage.createClient(validatedData);
        res.json({ success: true, client });
      } catch (error) {
        res.status(500).json({ message: "Failed to create client" });
      }
    },
  );

  // Admin case studies endpoints
  app.get("/api/admin/case-studies", authenticateAdmin, async (req, res) => {
    try {
      const caseStudies = await storage.getAllCaseStudies();
      res.json(caseStudies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case studies" });
    }
  });

  app.post("/api/admin/case-studies", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.parse(req.body);
      const caseStudy = await storage.createCaseStudy(validatedData);
      res.json({ success: true, caseStudy });
    } catch (error) {
      res.status(500).json({ message: "Failed to create case study" });
    }
  });

  app.put(
    "/api/admin/case-studies/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const validatedData = insertCaseStudySchema.partial().parse(req.body);
        const caseStudy = await storage.updateCaseStudy(id, validatedData);
        res.json({ success: true, caseStudy });
      } catch (error) {
        res.status(500).json({ message: "Failed to update case study" });
      }
    },
  );

  app.delete(
    "/api/admin/case-studies/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteCaseStudy(id);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete case study" });
      }
    },
  );

  // Admin pricing packages endpoints
  app.get(
    "/api/admin/pricing-packages",
    authenticateAdmin,
    async (req, res) => {
      try {
        const packages = await storage.getAllPricingPackages();
        res.json(packages);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch pricing packages" });
      }
    },
  );

  app.post(
    "/api/admin/pricing-packages",
    authenticateAdmin,
    async (req, res) => {
      try {
        const validatedData = insertPricingPackageSchema.parse(req.body);
        const package_ = await storage.createPricingPackage(validatedData);
        res.json({ success: true, package: package_ });
      } catch (error) {
        res.status(500).json({ message: "Failed to create pricing package" });
      }
    },
  );

  app.put(
    "/api/admin/pricing-packages/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const validatedData = insertPricingPackageSchema
          .partial()
          .parse(req.body);
        const package_ = await storage.updatePricingPackage(id, validatedData);
        res.json({ success: true, package: package_ });
      } catch (error) {
        res.status(500).json({ message: "Failed to update pricing package" });
      }
    },
  );

  app.delete(
    "/api/admin/pricing-packages/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deletePricingPackage(id);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete pricing package" });
      }
    },
  );

  // Admin service pages endpoints
  app.get("/api/admin/service-pages", authenticateAdmin, async (req, res) => {
    try {
      const pages = await storage.getAllServicePages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service pages" });
    }
  });

  app.post("/api/admin/service-pages", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertServicePageSchema.parse(req.body);
      const page = await storage.createServicePage(validatedData);
      res.json({ success: true, page });
    } catch (error) {
      res.status(500).json({ message: "Failed to create service page" });
    }
  });

  app.put(
    "/api/admin/service-pages/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const validatedData = insertServicePageSchema.partial().parse(req.body);
        const page = await storage.updateServicePage(id, validatedData);
        res.json({ success: true, page });
      } catch (error) {
        res.status(500).json({ message: "Failed to update service page" });
      }
    },
  );

  app.delete(
    "/api/admin/service-pages/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteServicePage(id);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete service page" });
      }
    },
  );

  // Coupon API endpoints
  app.get("/api/coupons/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const coupon = await storage.getCoupon(code);
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupon" });
    }
  });

  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, email } = req.body;
      if (!code || !email) {
        return res.status(400).json({ error: "Code and email are required" });
      }

      const validation = await storage.validateCouponForEmail(code, email);
      res.json(validation);
    } catch (error) {
      res.status(500).json({ error: "Failed to validate coupon" });
    }
  });

  app.post("/api/coupons/use", async (req, res) => {
    try {
      const { code, email } = req.body;
      if (!code || !email) {
        return res.status(400).json({ error: "Code and email are required" });
      }

      const validation = await storage.validateCouponForEmail(code, email);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }

      await storage.useCoupon(code, email);
      res.json({ success: true, message: "Coupon used successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to use coupon" });
    }
  });

  // Secure Audit API Endpoints - All AI processing happens server-side

  // Pricing Calculator endpoint
  app.post("/api/pricing-calculator", async (req, res) => {
    try {
      const pricingResult = await calculatePricing(req.body);
      res.json(pricingResult);
    } catch (error) {
      console.error("Pricing calculation error:", error);
      res.status(500).json({ message: "Failed to calculate pricing" });
    }
  });

  // SEO Audit endpoint (OLD ROUTE - redirecting to new)
  app.post("/api/seo-audit", async (req, res) => {
    try {
      const { websiteUrl } = req.body;
      const auditResult = await analyzeSEOAudit(websiteUrl);

      // Create client if needed
      const client = await storage.createClient({
        name: req.body.name || "Anonymous User",
        email: req.body.email || "anonymous@audit.com",
        company: req.body.company || "Website Audit",
        phone: req.body.phone || "",
        website: req.body.websiteUrl || "",
        region: "US",
      });

      // Store audit results
      const audit = await storage.createSeoAudit({
        websiteUrl,
        clientId: client.id,
        status: "completed",
      });

      // Update with results
      const updatedAudit = await storage.updateAuditData(
        audit.id,
        auditResult.auditData,
        auditResult.score,
        auditResult.recommendations,
      );

      res.json({ success: true, audit: updatedAudit });
    } catch (error) {
      console.error("SEO Audit error:", error);
      res.status(500).json({ message: "Failed to analyze website" });
    }
  });

  // SEO Audits - NEW ENDPOINTS (matching client expectations)
  app.post("/api/seo-audits", async (req, res) => {
    try {
      const { websiteUrl, clientId, email, name, company } = req.body;

      // Create audit record first
      const audit = await storage.createSeoAudit({
        websiteUrl,
        clientId: clientId || 1,
        status: "processing",
      });

      // Analyze with AI
      const auditResult = await analyzeSEOAudit(websiteUrl);

      // Update with results
      const updatedAudit = await storage.updateAuditData(
        audit.id,
        auditResult.auditData,
        auditResult.score,
        auditResult.recommendations,
      );

      // Send email notification for SEO audit request
      if (email && name) {
        try {
          await sendContactNotification({
            name: name,
            email: email,
            company: company || undefined,
            phone: undefined,
            message: `SEO AUDIT REQUEST: Website ${websiteUrl}. Audit Score: ${auditResult.score}/100`,
            submittedAt: new Date(),
          });
        } catch (emailError) {
          console.error("SEO audit email notification failed:", emailError);
        }
      }

      res.json({ success: true, audit: updatedAudit });
    } catch (error) {
      console.error("SEO Audit error:", error);
      res.status(500).json({ message: "Failed to analyze website" });
    }
  });

  // New SEO Analyzer endpoint (comprehensive analysis)
  app.post("/api/seo-analyzer", async (req, res) => {
    try {
      const { websiteUrl, email, name, company } = req.body;

      // Perform comprehensive SEO analysis
      const analysis = await analyzeWebsiteSEO(websiteUrl);

      // Send email notification for SEO analysis request
      if (email && name) {
        try {
          await sendContactNotification({
            name: name,
            email: email,
            company: company || undefined,
            phone: undefined,
            message: `SEO ANALYSIS REQUEST: Website ${websiteUrl}. Analysis completed with score: ${analysis.overallScore}/100`,
            submittedAt: new Date(),
          });
        } catch (emailError) {
          console.error("SEO analysis email notification failed:", emailError);
        }
      }

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("SEO Analysis error:", error);
      res
        .status(500)
        .json({ message: "Failed to analyze website. Please try again." });
    }
  });

  // Download SEO Report endpoint
  app.post("/api/seo-analyzer/download", async (req, res) => {
    try {
      const { analysis, websiteUrl } = req.body;

      // Generate PDF report (simplified for now)
      const reportData = {
        website: websiteUrl,
        generatedAt: new Date().toISOString(),
        overallScore: analysis.overallScore,
        summary: `Comprehensive SEO analysis for ${websiteUrl} showing an overall score of ${analysis.overallScore}/100.`,
        recommendations: analysis.recommendations,
        metrics: analysis.metrics,
      };

      // For now, return JSON that can be saved as a file
      // In production, you'd use a PDF library like puppeteer or jsPDF
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="seo-analysis-${websiteUrl.replace(/[^a-zA-Z0-9]/g, "-")}.json"`,
      );
      res.json(reportData);
    } catch (error) {
      console.error("Report download error:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Get SEO Audit by ID
  app.get("/api/seo-audits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const audit = await storage.getSeoAudit(parseInt(id));
      res.json(audit);
    } catch (error) {
      console.error("Failed to fetch audit:", error);
      res.status(500).json({ message: "Failed to fetch audit" });
    }
  });

  // Website Security Audit endpoint
  app.post("/api/website-audit", async (req, res) => {
    try {
      const { websiteUrl } = req.body;
      const auditResult = await analyzeWebsiteSecurity(websiteUrl);
      res.json({ success: true, audit: auditResult });
    } catch (error) {
      console.error("Website audit error:", error);
      res.status(500).json({ message: "Failed to analyze website security" });
    }
  });

  // Google Ads Audit endpoint
  app.post("/api/google-ads-audit", async (req, res) => {
    try {
      const {
        monthlySpend,
        industry,
        currentCTR,
        currentCPC,
        goals,
        email,
        name,
        company,
      } = req.body;

      const auditResult = await analyzeGoogleAds({
        monthlySpend,
        industry,
        currentCTR: currentCTR || 2.5,
        currentCPC: currentCPC || 3.5,
        goals: goals || [],
      });

      // Send email notification for Google Ads audit request
      if (email && name) {
        try {
          await sendContactNotification({
            name: name,
            email: email,
            company: company || undefined,
            phone: undefined,
            message: `GOOGLE ADS AUDIT REQUEST: Monthly Spend: $${monthlySpend}, Industry: ${industry}, Current Performance: CTR ${currentCTR}%, CPC $${currentCPC}`,
            submittedAt: new Date(),
          });
        } catch (emailError) {
          console.error(
            "Google Ads audit email notification failed:",
            emailError,
          );
        }
      }

      res.json({ success: true, audit: auditResult });
    } catch (error) {
      console.error("Google Ads audit error:", error);
      res.status(500).json({ message: "Failed to analyze Google Ads account" });
    }
  });

  // Automation Analysis endpoint
  app.post("/api/automation-analysis", async (req, res) => {
    try {
      const auditResult = await analyzeAutomation(req.body);
      res.json({ success: true, audit: auditResult });
    } catch (error) {
      console.error("Automation analysis error:", error);
      res.status(500).json({ message: "Failed to analyze automation needs" });
    }
  });

  // Google Ads Audit endpoint (DUPLICATE REMOVED)

  // Business Automation Analysis endpoint (DUPLICATE REMOVED)

  // Chat Session Management
  app.get("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      let session = await storage.getChatSession(sessionId);

      if (!session) {
        const newSession = await storage.createChatSession({
          sessionId,
          clientInfo: {},
        });
        return res.json({ success: true, session: newSession });
      }

      res.json({ success: true, session });
    } catch (error) {
      console.error("Failed to get chat session:", error);
      res.status(500).json({ message: "Failed to get chat session" });
    }
  });

  // Document Analysis endpoint
  app.post("/api/chat/analyze", async (req, res) => {
    try {
      const { fileData, sessionId, clientInfo } = req.body;

      if (!fileData || !fileData.content) {
        return res.status(400).json({
          success: false,
          message: "No file data provided",
        });
      }

      // Analyze document with OpenAI
      const analysis = await generateAIResponse(
        `Please analyze this document: ${fileData.content}`,
        sessionId || "",
      );

      // Get or create chat session for context
      let chatSession = sessionId
        ? await storage.getChatSession(sessionId)
        : null;

      if (!chatSession) {
        const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        chatSession = await storage.createChatSession({
          sessionId: newSessionId,
          clientInfo: clientInfo || {},
        });
      }

      // Add analysis to chat history
      const existingMessages = Array.isArray(chatSession.messages)
        ? chatSession.messages
        : [];
      const analysisMessage = {
        id: Date.now(),
        type: "analysis" as const,
        content: `📄 **Document Analysis: ${fileData.fileName}**\n\n${analysis.content}`,
        recommendations: analysis.recommendations || [],
        timestamp: new Date(),
        documentAnalysis: analysis,
      };

      const updatedMessages = [...existingMessages, analysisMessage];

      await storage.updateChatSession(
        chatSession.sessionId,
        updatedMessages,
        analysis.recommendations || [],
      );

      // Send email notification for document analysis
      if (clientInfo?.leadInfo?.email && clientInfo?.leadInfo?.name) {
        try {
          await sendContactNotification({
            name: clientInfo.leadInfo.name,
            email: clientInfo.leadInfo.email,
            company: clientInfo.company || undefined,
            phone: undefined,
            message: `DOCUMENT ANALYSIS REQUEST: ${fileData.fileName} (${fileData.type}). Analysis completed with ${analysis.recommendations?.length || 0} recommendations.`,
            submittedAt: new Date(),
          });
        } catch (emailError) {
          console.error(
            "Document analysis email notification failed:",
            emailError,
          );
        }
      }

      res.json({
        success: true,
        analysis,
        session: chatSession,
        message: analysisMessage,
      });
    } catch (error) {
      console.error("Document analysis error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to analyze document. Please try again.",
      });
    }
  });

  // AI Chat endpoint for intelligent conversations
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, clientInfo } = req.body;

      // Get or create chat session
      let chatSession = sessionId
        ? await storage.getChatSession(sessionId)
        : null;

      if (!chatSession) {
        const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        chatSession = await storage.createChatSession({
          sessionId: newSessionId,
          clientInfo: clientInfo || {},
        });
      }

      // Generate AI response based on user message and website context
      const contextWithLeadInfo = {
        ...chatSession,
        leadInfo: clientInfo?.leadInfo || {},
        messages: chatSession.messages || [],
      };
      const aiResponse = await generateAIResponse(message, contextWithLeadInfo);

      // Update clientInfo with any extracted information from the AI response
      if (clientInfo?.leadInfo) {
        const updatedClientInfo = {
          ...clientInfo,
          leadInfo: {
            ...clientInfo.leadInfo,
            // AI will have extracted any new information and included it in the response
          },
        };
      }

      // Update chat session with new messages
      const existingMessages = Array.isArray(chatSession.messages)
        ? chatSession.messages
        : [];
      const updatedMessages = [
        ...existingMessages,
        {
          id: Date.now(),
          type: "user" as const,
          content: message,
          timestamp: new Date(),
        },
        {
          id: Date.now() + 1,
          type: "bot" as const,
          content: aiResponse.content,
          recommendations: aiResponse.recommendations,
          timestamp: new Date(),
        },
      ];

      // Update client info with extracted information (if available)
      const updatedClientInfo = {
        ...clientInfo,
        leadInfo: {
          ...clientInfo?.leadInfo,
          // Store any newly extracted information
          name:
            (aiResponse as any).extractedName ||
            clientInfo?.leadInfo?.name ||
            "",
          email:
            (aiResponse as any).extractedEmail ||
            clientInfo?.leadInfo?.email ||
            "",
          challenge:
            (aiResponse as any).extractedChallenge ||
            clientInfo?.leadInfo?.challenge ||
            "",
        },
      };

      const updatedSession = await storage.updateChatSession(
        chatSession.sessionId,
        updatedMessages,
        aiResponse.recommendations,
      );

      // Send email summary for meaningful conversations (3+ user messages)
      const userMessages = updatedMessages.filter(
        (msg: any) => msg.type === "user",
      );
      if (userMessages.length >= 3) {
      }

      res.json({
        success: true,
        session: updatedSession,
        response: aiResponse,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Blog Management API Routes
  app.get("/api/admin/blog-posts", authenticateAdmin, async (req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog-posts", authenticateAdmin, async (req, res) => {
    try {
      const {
        slug,
        title,
        subtitle,
        excerpt,
        content,
        imageUrl,
        tags,
        author,
        readTime,
        isPublished,
        isFeatured,
        metaDescription,
        metaTitle,
      } = req.body;

      // Process tags to ensure they are stored as arrays
      let processedTags = [];
      if (Array.isArray(tags)) {
        processedTags = tags;
      } else if (typeof tags === "string" && tags.trim()) {
        processedTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      const blogPost = await storage.createBlogPost({
        slug,
        title,
        subtitle,
        excerpt,
        content,
        imageUrl,
        tags: processedTags,
        author,
        readTime: parseInt(readTime) || 5,
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
        metaDescription,
        metaTitle,
      });

      res.json(blogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog-posts/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Updating blog post:", id, req.body);

      // Validate and filter only the fields we want to update
      const {
        slug,
        title,
        subtitle,
        excerpt,
        content,
        imageUrl,
        tags,
        author,
        readTime,
        isPublished,
        isFeatured,
        metaDescription,
        metaTitle,
      } = req.body;

      // Process tags to ensure they are stored as arrays
      let processedTags = [];
      if (Array.isArray(tags)) {
        processedTags = tags;
      } else if (typeof tags === "string" && tags.trim()) {
        processedTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      const updateData = {
        slug,
        title,
        subtitle,
        excerpt,
        content,
        imageUrl,
        tags: processedTags,
        author,
        readTime: parseInt(readTime) || 5,
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
        metaDescription,
        metaTitle,
      };

      const blogPost = await storage.updateBlogPost(id, updateData);
      console.log("Blog post updated successfully:", blogPost);
      res.json(blogPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res
        .status(500)
        .json({
          message: "Failed to update blog post",
          error: (error as Error).message,
        });
    }
  });

  app.delete(
    "/api/admin/blog-posts/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteBlogPost(id);
        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({ message: "Failed to delete blog post" });
      }
    },
  );

  // Public blog routes
  app.get("/api/blog", publicContentRateLimit, async (req, res) => {
    try {
      console.log("\n=== BLOG API DEBUG START ===");
      console.log(
        "🚀 Blog API endpoint called - Environment:",
        process.env.NODE_ENV || "development",
      );
      console.log(
        "📊 Database connection status:",
        process.env.DATABASE_URL ? "URL Present" : "URL Missing",
      );
      console.log(
        "🌐 Request origin:",
        req.get("origin") || "No origin header",
      );
      console.log("🔍 Request headers:", req.headers);
      console.log("🔗 Request URL:", req.url);
      console.log("🔗 Request method:", req.method);

      // Test database connection first
      console.log("🔄 Testing database connection...");
      const { db } = await import("./db");
      const dbTest = await db.execute("SELECT 1 as test");
      console.log("✅ Database connection test result:", dbTest);

      // Force fresh data from database - no caching
      console.log("🔄 Calling storage.getPublishedBlogPosts()...");
      const blogPosts = await storage.getPublishedBlogPosts();
      console.log(`✅ Raw blog posts from storage: ${blogPosts.length} posts`);

      if (blogPosts.length === 0) {
        console.log("⚠️ No published blog posts found - checking all posts...");
        const allPosts = await storage.getAllBlogPosts();
        console.log(`📊 Total posts in database: ${allPosts.length}`);
        allPosts.forEach((post, index) => {
          console.log(
            `📄 All Post ${index + 1}: ID=${post.id}, Title="${post.title}", Published=${post.isPublished}, Featured=${post.isFeatured}`,
          );
        });
      }

      // Log each published post for debugging
      blogPosts.forEach((post, index) => {
        console.log(
          `📋 Published Post ${index + 1}: ID=${post.id}, Title="${post.title}", Slug="${post.slug}", Published=${post.isPublished}, Created=${post.createdAt}`,
        );
      });

      // Ensure we return properly formatted data with comprehensive validation
      const formattedPosts = blogPosts.map((post, index) => {
        console.log(`🔧 Formatting post ${index + 1}: ${post.title}`);

        let formattedTags = [];
        if (Array.isArray(post.tags)) {
          formattedTags = post.tags;
        } else if (typeof post.tags === "string") {
          try {
            formattedTags = JSON.parse(post.tags);
          } catch {
            formattedTags = post.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);
          }
        } else {
          formattedTags = [];
        }

        const formatted = {
          ...post,
          tags: formattedTags,
          imageUrl: post.imageUrl || "/images/Industry-Specific_Digital_Marketing_1.png",
          excerpt: post.excerpt || post.title || "No excerpt available",
          readTime: post.readTime || 5,
        };

        console.log(
          `✅ Formatted post ${index + 1}:`,
          JSON.stringify(
            {
              id: formatted.id,
              title: formatted.title,
              slug: formatted.slug,
              isPublished: formatted.isPublished,
              imageUrl: formatted.imageUrl,
              tagsCount: formatted.tags.length,
            },
            null,
            2,
          ),
        );

        return formatted;
      });

      console.log(
        `📤 Returning ${formattedPosts.length} formatted blog posts to client`,
      );
      console.log(
        "📋 Final response preview:",
        formattedPosts
          .slice(0, 2)
          .map((p) => ({ id: p.id, title: p.title, slug: p.slug })),
      );

      // Set strong no-cache headers for both dev and production
      res.setHeader(
        "Cache-Control",
        "no-cache, no-store, must-revalidate, private",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Access-Control-Allow-Origin", "*");

      console.log("=== BLOG API DEBUG END ===\n");
      res.json(formattedPosts);
    } catch (error) {
      console.error("\n=== BLOG API ERROR ===");
      console.error("❌ Error fetching published blog posts:", error);
      console.error("❌ Error stack:", (error as Error).stack);
      console.error("❌ Error name:", (error as Error).name);
      console.error("❌ Error message:", (error as Error).message);
      console.error("❌ Environment details:", {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDevelopmentUrl: !!process.env.DATABASE_URL_DEVELOPMENT,
        hasProductionUrl: !!process.env.DATABASE_URL_PRODUCTION,
        timestamp: new Date().toISOString(),
      });
      console.error("=== BLOG API ERROR END ===\n");

      res.status(500).json({
        message: "Failed to fetch blog posts",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
        endpoint: "/api/blog",
        environment: process.env.NODE_ENV || "development",
      });
    }
  });

  app.get("/api/blog/featured", publicContentRateLimit, async (req, res) => {
    try {
      const featuredPosts = await storage.getFeaturedBlogPosts();
      res.json(featuredPosts);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  app.get("/api/blog/:slug", publicContentRateLimit, async (req, res) => {
    try {
      const slug = req.params.slug;
      const blogPost = await storage.getBlogPost(slug);

      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get individual blog post by ID (admin access)
  app.get("/api/admin/blog-posts/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blogPost = await storage.getBlogPostById(id);

      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post by ID:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Delete contact endpoint
  app.delete("/api/contacts/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContact(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Object storage for image uploads
  app.post("/api/objects/upload", async (req, res) => {
    try {
      // Mock implementation for now - in production would use proper object storage
      const uploadURL = `https://storage.googleapis.com/bucket/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  // Update pricing package
  app.put(
    "/api/admin/pricing-packages/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const updatedPackage = await storage.updatePricingPackage(id, req.body);
        res.json(updatedPackage);
      } catch (error) {
        console.error("Error updating pricing package:", error);
        res.status(500).json({ message: "Failed to update pricing package" });
      }
    },
  );

  // Delete pricing package
  app.delete(
    "/api/admin/pricing-packages/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deletePricingPackage(id);
        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting pricing package:", error);
        res.status(500).json({ message: "Failed to delete pricing package" });
      }
    },
  );

  // Update case study
  app.put(
    "/api/admin/case-studies/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const updatedCaseStudy = await storage.updateCaseStudy(id, req.body);
        res.json(updatedCaseStudy);
      } catch (error) {
        console.error("Error updating case study:", error);
        res.status(500).json({ message: "Failed to update case study" });
      }
    },
  );

  // Delete case study
  app.delete(
    "/api/admin/case-studies/:id",
    authenticateAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteCaseStudy(id);
        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting case study:", error);
        res.status(500).json({ message: "Failed to delete case study" });
      }
    },
  );

  // Single blog generation endpoint
  app.post(
    "/api/admin/generate-single-blog",
    authenticateAdmin,
    async (req, res) => {
      try {
        const { title, keywords, category, targetAudience } = req.body;

        if (
          !title ||
          !keywords ||
          !Array.isArray(keywords) ||
          keywords.length === 0
        ) {
          return res.status(400).json({
            message: "Title and keywords are required",
          });
        }

        // Import the blog generator
        const { generateSingleBlog } = await import("./blog-generator");

        // Generate single blog
        const blogContent = await generateSingleBlog({
          title,
          keywords,
          category,
          targetAudience,
        });

        res.json({
          success: true,
          blog: blogContent,
          message: "Blog generated successfully",
        });
      } catch (error) {
        console.error("Error generating single blog:", error);
        res.status(500).json({ message: "Failed to generate blog" });
      }
    },
  );

  // Blog generation endpoints
  app.post("/api/admin/generate-blogs", authenticateAdmin, async (req, res) => {
    try {
      const { count = 120 } = req.body;

      // Import the blog generator
      const { generateMonthlyBlogs } = await import("./blog-generator");

      // Start generation in background
      generateMonthlyBlogs(count).catch((error) => {
        console.error("Blog generation failed:", error);
      });

      res.json({
        success: true,
        message: `Started generating ${count} blogs. Check server logs for progress.`,
      });
    } catch (error) {
      console.error("Error starting blog generation:", error);
      res.status(500).json({ message: "Failed to start blog generation" });
    }
  });

  app.post(
    "/api/admin/generate-daily-blogs",
    authenticateAdmin,
    async (req, res) => {
      try {
        const { scheduleDailyBlogGeneration } = await import(
          "./blog-generator"
        );

        // Start daily generation
        scheduleDailyBlogGeneration().catch((error) => {
          console.error("Daily blog generation failed:", error);
        });

        res.json({
          success: true,
          message:
            "Started daily blog generation schedule (4 blogs/day for 30 days)",
        });
      } catch (error) {
        console.error("Error starting daily blog generation:", error);
        res.status(500).json({ message: "Failed to start daily generation" });
      }
    },
  );

  // File upload endpoint for blog images
  app.post("/api/upload/image", authenticateAdmin, async (req, res) => {
    try {
      const multer = require("multer");
      const path = require("path");
      const fs = require("fs");

      // Configure multer for file uploads
      const storage = multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = path.join(__dirname, "../client/public/images");
          // Ensure directory exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          // Generate unique filename with timestamp
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const name = file.originalname
            .replace(ext, "")
            .replace(/[^a-zA-Z0-9]/g, "-")
            .toLowerCase();
          cb(null, `${name}-${uniqueSuffix}${ext}`);
        },
      });

      const upload = multer({
        storage: storage,
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB limit
        },
        fileFilter: (req: any, file: any, cb: any) => {
          // Check if file is an image
          if (file.mimetype.startsWith("image/")) {
            cb(null, true);
          } else {
            cb(new Error("Only image files are allowed!"), false);
          }
        },
      });

      upload.single("image")(req, res, (err: any) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        // Return the URL path that can be used in the frontend
        const imageUrl = `/images/${req.file.filename}`;
        res.json({
          success: true,
          imageUrl: imageUrl,
          filename: req.file.filename,
        });
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;

      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Here you would typically save the contact message to a database
      // and potentially send a confirmation email.
      // For this example, we'll just log it and send a success response.

      console.log("Received contact message:", { name, email, message });

      // Simulate sending an email
      try {
        const contactSubmission = {
          name,
          email,
          message,
          submittedAt: new Date(),
        };
        await sendEmailViaGmail(contactSubmission);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Continue even if email fails
      }

      res.status(200).json({ message: "Message received successfully!" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
  });

  // Add route logging middleware for debugging
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(
      `${req.method} ${req.originalUrl} - ${new Date().toISOString()}`,
    );
    next();
  });

  // Serve static files from client/public
  app.use("/images", (req: Request, res: Response, next: NextFunction) => {
    // Try to serve from client/public/images first
    const imagePath = path.join(process.cwd(), "client/public/images", req.path);

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      // If file doesn't exist, return placeholder
      res.redirect(`/api/placeholder/400/300`);
    }
  });

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Environment check endpoint
  app.get("/api/environment", (req: Request, res: Response) => {
    res.json({
      environment: process.env.NODE_ENV || "development",
      isProduction: process.env.NODE_ENV === "production",
      isDevelopment: process.env.NODE_ENV !== "production",
    });
  });

  // 404 handler moved to server/index.ts to be registered after static file serving

  const httpServer = createServer(app);
  return httpServer;
}
