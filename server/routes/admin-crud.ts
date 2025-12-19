// server/routes/admin-crud.ts
import type { Express, RequestHandler } from "express";
import {
  insertClientSchema,
  insertCaseStudySchema,
  insertPricingPackageSchema,
  insertServicePageSchema,
} from "@shared/schema";
import { storage } from "../storage";

export function registerAdminCrudRoutes(app: Express, authenticateAdmin: RequestHandler) {
  // Featured clients
  app.get("/api/admin/featured-clients", authenticateAdmin, async (_req, res) => {
    const clients = await storage.getAllClients();
    res.json(clients);
  });

  app.post("/api/admin/featured-clients", authenticateAdmin, async (req, res) => {
    const validatedData = insertClientSchema.parse(req.body);
    const client = await storage.createClient(validatedData);
    res.json({ success: true, client });
  });

  // Case studies CRUD
  app.get("/api/admin/case-studies", authenticateAdmin, async (_req, res) => {
    const caseStudies = await storage.getAllCaseStudies();
    res.json(caseStudies);
  });

  app.post("/api/admin/case-studies", authenticateAdmin, async (req, res) => {
    const validatedData = insertCaseStudySchema.parse(req.body);
    const caseStudy = await storage.createCaseStudy(validatedData);
    res.json({ success: true, caseStudy });
  });

  app.put("/api/admin/case-studies/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const validatedData = insertCaseStudySchema.partial().parse(req.body);
    const caseStudy = await storage.updateCaseStudy(id, validatedData);
    res.json({ success: true, caseStudy });
  });

  app.delete("/api/admin/case-studies/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteCaseStudy(id);
    res.json({ success: true });
  });

  // Pricing packages CRUD
  app.get("/api/admin/pricing-packages", authenticateAdmin, async (_req, res) => {
    const packages = await storage.getAllPricingPackages();
    res.json(packages);
  });

  app.post("/api/admin/pricing-packages", authenticateAdmin, async (req, res) => {
    const validatedData = insertPricingPackageSchema.parse(req.body);
    const package_ = await storage.createPricingPackage(validatedData);
    res.json({ success: true, package: package_ });
  });

  app.put("/api/admin/pricing-packages/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const validatedData = insertPricingPackageSchema.partial().parse(req.body);
    const package_ = await storage.updatePricingPackage(id, validatedData);
    res.json({ success: true, package: package_ });
  });

  app.delete("/api/admin/pricing-packages/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deletePricingPackage(id);
    res.json({ success: true });
  });

  // Service pages CRUD
  app.get("/api/admin/service-pages", authenticateAdmin, async (_req, res) => {
    const pages = await storage.getAllServicePages();
    res.json(pages);
  });

  app.post("/api/admin/service-pages", authenticateAdmin, async (req, res) => {
    const validatedData = insertServicePageSchema.parse(req.body);
    const page = await storage.createServicePage(validatedData);
    res.json({ success: true, page });
  });

  app.put("/api/admin/service-pages/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const validatedData = insertServicePageSchema.partial().parse(req.body);
    const page = await storage.updateServicePage(id, validatedData);
    res.json({ success: true, page });
  });

  app.delete("/api/admin/service-pages/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteServicePage(id);
    res.json({ success: true });
  });
}
