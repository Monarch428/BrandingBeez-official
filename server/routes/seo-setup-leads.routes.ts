import { Router } from "express";
import {
  createSeoSetupLead,
  getAllSeoSetupLeads,
  getSeoSetupLeadById,
  deleteSeoSetupLead,
} from "../controllers/seo-setup-leads.controller";
import { buildAdminAuth } from "./_admin-auth";
import { publicContentRateLimit } from "../security";

const { authenticateAdmin } = buildAdminAuth();

const router = Router();

router.post(
  "/create",
  createSeoSetupLead
);

router.get("/list", authenticateAdmin, getAllSeoSetupLeads);
router.get("/view/:id", authenticateAdmin, getSeoSetupLeadById);
router.delete("/delete/:id", authenticateAdmin, deleteSeoSetupLead);

export default router;