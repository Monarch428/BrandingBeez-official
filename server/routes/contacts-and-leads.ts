// server/routes/contacts-and-leads.ts
import type { Express, RequestHandler } from "express";
import type { Request } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { z } from "zod";

import { storage } from "../storage";
import { contactRateLimit, formRateLimit, validateContactForm, spamDetection } from "../security";
import { insertContactSchema, insertClientSchema, insertDedicatedResourcesLeadSchema } from "@shared/schema";
import { sendContactNotification, sendEmailViaGmail, sendQuestionnaireToAdmin } from "../email-service";

const contactFilesDir = path.resolve(process.cwd(), "uploads", "contact_files");

const contactStorage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    try {
      if (!fs.existsSync(contactFilesDir)) fs.mkdirSync(contactFilesDir, { recursive: true });
      cb(null, contactFilesDir);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (_req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const contactUpload = multer({
  storage: contactStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Allowed: pdf, doc, docx, txt"), false);
  },
});

export function registerContactsAndLeadsRoutes(app: Express, authenticateAdmin: RequestHandler) {
  // Contact form submission endpoint (enhanced security) + optional file "questionFile"
  app.post("/api/contacts", contactRateLimit, contactUpload.single("questionFile"), async (req, res) => {
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
        dedicatedResourceDetails,
        seoDetails,
        googleAdsDetails,
        n8nDetails,
        aiDetails,
        automationDetails,
      } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Please provide your name and email address.",
        });
      }

      let formType = "contact-form";
      if (service === "automation-pricing" || automationDetails) formType = "automation-pricing";
      else if (dedicatedResourceDetails && dedicatedResourceDetails.roles) formType = "dedicated-resources";
      else if (seoDetails && seoDetails.length > 0) formType = "seo-audit";
      else if (googleAdsDetails && googleAdsDetails.length > 0) formType = "google-ads-audit";
      else if (service && !message) formType = "service-selection";

      let fullMessage = message || `${formType.replace(/-/g, " ").toUpperCase()} submission`;

      if (service) fullMessage += `\n\n📋 PRIMARY SERVICE: ${service.replace(/-/g, " ").toUpperCase()}`;

      if (dedicatedResourceDetails?.roles?.length) {
        fullMessage += `\n\n👥 DEDICATED RESOURCES REQUESTED:`;
        dedicatedResourceDetails.roles.forEach((role: any) => {
          fullMessage += `\n• ${role.type || "Professional"}: ${role.level || "standard"} level (${role.hours || 40}hrs/week)`;
        });
      }

      if (seoDetails?.length) fullMessage += `\n\n🔍 SEO SERVICES REQUESTED:\n• ${seoDetails.join("\n• ")}`;
      if (googleAdsDetails?.length) fullMessage += `\n\n🎯 GOOGLE ADS SERVICES:\n• ${googleAdsDetails.join("\n• ")}`;
      if (n8nDetails?.length) fullMessage += `\n\n⚙️ N8N AUTOMATIONS:\n• ${n8nDetails.join("\n• ")}`;
      if (aiDetails?.length) fullMessage += `\n\n🤖 AI DEVELOPMENT:\n• ${aiDetails.join("\n• ")}`;

      if (automationDetails) {
        fullMessage += `\n\n🔧 AUTOMATION ANALYSIS:`;
        fullMessage += `\n• Industry: ${automationDetails.industry || "Not specified"}`;
        fullMessage += `\n• Business Size: ${automationDetails.businessSize || "Not specified"}`;
        fullMessage += `\n• Process Complexity: ${automationDetails.processComplexity || "Not specified"}`;
        fullMessage += `\n• Manual Hours/Week: ${automationDetails.manualHours || "Not specified"}`;
        fullMessage += `\n• Team Size: ${automationDetails.teamSize || "Not specified"}`;
        fullMessage += `\n• Current Error Rate: ${automationDetails.currentErrorRate || "Not specified"}%`;
      }

      if (budget) fullMessage += `\n\n💰 BUDGET: ${budget}`;
      if (timeline) fullMessage += `\n\n⏰ TIMELINE: ${timeline}`;
      if (referral) fullMessage += `\n\n📢 REFERRAL SOURCE: ${referral}`;

      const contactData: any = {
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

      if ((req as any).file) {
        contactData.attachmentPath = (req as any).file.path;
        contactData.attachmentFilename = (req as any).file.filename;
        contactData.attachmentOriginalName = (req as any).file.originalname;
      }

      const validatedData = insertContactSchema.parse(contactData);
      const contact = await storage.createContact(validatedData);

      // Notify
      try {
        await sendContactNotification({
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || undefined,
          phone: validatedData.phone || undefined,
          message: validatedData.message,
          submittedAt: new Date(),
        });
      } catch {}

      // Questionnaire email (if provided)
      if (req.body?.questionnaire) {
        try {
          const fileInfo = req.file
            ? { path: req.file.path, originalname: req.file.originalname, mimetype: req.file.mimetype }
            : undefined;

          await sendQuestionnaireToAdmin({
            name: validatedData.name,
            email: validatedData.email,
            company: validatedData.company || undefined,
            phone: validatedData.phone || undefined,
            questionnaire: req.body.questionnaire,
            submittedAt: new Date(),
            file: fileInfo,
          } as any);
        } catch {}
      }

      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Serve uploaded contact files
  app.get("/uploads/contact_files/:filename", async (req, res) => {
    const filePath = path.join(contactFilesDir, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
    res.sendFile(filePath);
  });

  // Get all contacts (admin)
  app.get("/api/contacts", authenticateAdmin, async (_req, res) => {
    const contacts = await storage.getAllContacts();
    res.json(contacts);
  });

  // Delete contact (admin)
  app.delete("/api/contacts/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteContact(id);
    res.json({ success: true });
  });

  // Lead capture
  app.post("/api/lead-capture", formRateLimit, validateContactForm, spamDetection, async (req, res) => {
    const { email, name, company, service, phone, leadMagnet } = req.body;

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

    try {
      await sendContactNotification({
        name: lead.name,
        email: lead.email,
        company: lead.company || undefined,
        phone: lead.phone || undefined,
        message: `LEAD CAPTURE: ${lead.message}`,
        submittedAt: new Date(),
      });
    } catch {}

    res.json({ success: true, lead, message: "Lead magnet will be sent to your email shortly" });
  });

  // Client submission
  app.post("/api/clients", async (req, res) => {
    const validatedData = insertClientSchema.parse(req.body);
    const client = await storage.createClient(validatedData);
    res.json({ success: true, client });
  });

  // Dedicated Resources Leads
  app.post("/api/dedicated-resources-leads", formRateLimit, validateContactForm, spamDetection, async (req, res) => {
    try {
      const validatedData = insertDedicatedResourcesLeadSchema.parse(req.body);
      const lead = await storage.createDedicatedResourcesLead(validatedData);

      try {
        await sendContactNotification({
          name: validatedData.fullName,
          email: validatedData.email,
          company: undefined,
          phone: undefined,
          message: `DEDICATED RESOURCES LEAD: ${validatedData.resourceType}. Additional Notes: ${
            validatedData.additionalNotes || "None"
          }`,
          submittedAt: new Date(),
        });
      } catch {}

      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Validation error", errors: error.errors });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/dedicated-resources-leads", authenticateAdmin, async (_req, res) => {
    const leads = await storage.getAllDedicatedResourcesLeads();
    res.json(leads);
  });

  // Legacy contact endpoint (/api/contact)
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: "All fields are required" });

    try {
      await sendEmailViaGmail({ name, email, message, submittedAt: new Date() });
    } catch {}

    res.status(200).json({ message: "Message received successfully!" });
  });
}
