import type { Request, Response } from "express";
import { storage } from "../storage";
import { insertSeoSetupLeadSchema } from "@shared/schema";

/**
 * Create SEO Setup Lead
 */
export const createSeoSetupLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = insertSeoSetupLeadSchema.parse(req.body);

    const lead = await storage.createSeoSetupLead(payload);

    res.status(201).json({
      success: true,
      data: lead,
      message: "SEO setup lead created successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.message || "Invalid request data",
    });
  }
};

/**
 * Get all SEO Setup Leads
 */
export const getAllSeoSetupLeads = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const leads = await storage.getAllSeoSetupLeads();

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch SEO setup leads",
    });
  }
};

/**
 * Get SEO Setup Lead by ID
 */
export const getSeoSetupLeadById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Invalid id",
      });
      return;
    }

    const lead = await storage.getSeoSetupLeadById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "SEO setup lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch SEO setup lead",
    });
  }
};

/**
 * Delete SEO Setup Lead
 */
export const deleteSeoSetupLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Invalid id",
      });
      return;
    }

    await storage.deleteSeoSetupLead(id);

    res.status(200).json({
      success: true,
      message: "SEO setup lead deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete SEO setup lead",
    });
  }
};