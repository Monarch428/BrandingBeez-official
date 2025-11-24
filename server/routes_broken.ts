import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertClientSchema, insertSeoAuditSchema, insertChatSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to save contact information" 
        });
      }
    }
  });

  // Get all contacts endpoint (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to retrieve contacts" 
      });
    }
  });

  // Client management routes
  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.json({ success: true, client });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create client" });
      }
    }
  });

  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve clients" });
    }
  });

  // SEO Audit routes
  app.post("/api/seo-audits", async (req, res) => {
    try {
      const auditData = insertSeoAuditSchema.parse(req.body);
      const audit = await storage.createSeoAudit(auditData);
      
      // Simulate audit processing
      setTimeout(async () => {
        try {
          const mockAuditData = {
            pageSpeed: Math.floor(Math.random() * 40) + 60,
            seoScore: Math.floor(Math.random() * 30) + 70,
            mobileFriendly: Math.random() > 0.3,
            httpsEnabled: Math.random() > 0.2,
            metaTags: Math.floor(Math.random() * 5) + 5,
            headingStructure: Math.random() > 0.4,
            imageOptimization: Math.floor(Math.random() * 40) + 60
          };
          
          const overallScore = Math.floor(
            (mockAuditData.pageSpeed + mockAuditData.seoScore + mockAuditData.imageOptimization) / 3
          );
          
          const recommendations = [
            "Optimize images to improve page loading speed",
            "Add meta descriptions to all pages",
            "Improve heading structure (H1, H2, H3)",
            "Enable HTTPS across all pages",
            "Optimize for mobile devices"
          ].slice(0, Math.floor(Math.random() * 3) + 2).join(". ");
          
          await storage.updateAuditData(audit.id, mockAuditData, overallScore, recommendations);
        } catch (error) {
          console.error("Error processing SEO audit:", error);
        }
      }, 3000);
      
      res.json({ success: true, audit });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create SEO audit" });
      }
    }
  });

  app.get("/api/seo-audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.getSeoAudit(id);
      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }
      res.json(audit);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve audit" });
    }
  });

  // Chat session routes
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json({ success: true, session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create chat session" });
      }
    }
  });

  app.get("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve chat session" });
    }
  });

  app.post("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const { message } = req.body;
      
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      const messages = session.messages || [];
      messages.push({
        id: Date.now(),
        type: "user",
        content: message,
        timestamp: new Date()
      });
      
      // Simple AI response logic
      const aiResponse = generateAIResponse(message);
      messages.push({
        id: Date.now() + 1,
        type: "bot",
        content: aiResponse.content,
        recommendations: aiResponse.recommendations,
        timestamp: new Date()
      });
      
      const updatedSession = await storage.updateChatSession(sessionId, messages, aiResponse.recommendations);
      res.json({ success: true, session: updatedSession });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateAIResponse(userMessage: string) {
  const message = userMessage.toLowerCase();
  
  if (message.includes("seo") || message.includes("search") || message.includes("ranking")) {
    return {
      content: "Great! SEO is one of our most popular services. We offer comprehensive SEO packages starting at $1,500/month that include keyword research, technical SEO, content optimization, and monthly reporting. Would you like to know more about our SEO packages or get a free SEO audit?",
      recommendations: ["seo-services", "free-seo-audit"]
    };
  }
  
  if (message.includes("website") || message.includes("web") || message.includes("development")) {
    return {
      content: "We specialize in custom website development! Our team creates responsive, conversion-focused websites using the latest technologies. We offer both WordPress and custom development solutions starting at $7,500. Would you like to see our portfolio or discuss your specific requirements?",
      recommendations: ["web-development", "portfolio"]
    };
  }
  
  if (message.includes("dedicated") || message.includes("team") || message.includes("resources")) {
    return {
      content: "Our dedicated resources service is perfect for agencies looking to scale! You get vetted professionals who work exclusively for your business at $1,200/month per resource. This includes developers, designers, and digital marketers. Would you like to learn more about our dedicated team options?",
      recommendations: ["dedicated-resources", "team-consultation"]
    };
  }
  
  if (message.includes("price") || message.includes("cost") || message.includes("budget")) {
    return {
      content: "Our pricing is transparent and competitive! Here's a quick overview: SEO services start at $1,500/month, Website development from $7,500, Dedicated resources at $1,200/month per person, and Google Ads management at $1,000/month. Would you like detailed pricing for any specific service?",
      recommendations: ["pricing-consultation", "custom-quote"]
    };
  }
  
  return {
    content: "Hello! I'm here to help you find the perfect digital solution for your business. We offer SEO services, website development, dedicated resources, Google Ads management, and more. What specific challenge or goal would you like to discuss?",
    recommendations: ["all-services", "consultation"]
  };
}

  // Content Management API Routes
  app.get('/api/admin/featured-clients', async (req, res) => {
    try {
      const clients = await storage.getAllFeaturedClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch featured clients' });
    }
  });

  app.post('/api/admin/featured-clients', async (req, res) => {
    try {
      const client = await storage.createFeaturedClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create featured client' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
