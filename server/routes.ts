import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { propertyInsertSchema, sharedReportInsertSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/properties", async (req, res) => {
    try {
      const parsed = propertyInsertSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: fromZodError(parsed.error).message
        });
      }

      const property = await storage.createProperty(parsed.data);
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.get("/api/properties/postcode/:postcode", async (req, res) => {
    try {
      const properties = await storage.getPropertiesByPostcode(req.params.postcode);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Share report endpoint
  app.post("/api/reports/share", async (req, res) => {
    try {
      const report = await storage.createSharedReport({
        propertyData: req.body.propertyData,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      res.json({ shareId: report.shareId });
    } catch (error) {
      console.error('Error creating shared report:', error);
      res.status(500).json({ message: "Failed to create shared report" });
    }
  });

  // Get shared report endpoint
  app.get("/api/reports/share/:shareId", async (req, res) => {
    try {
      const report = await storage.getSharedReport(req.params.shareId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Check if report has expired
      if (report.expiresAt && new Date(report.expiresAt) < new Date()) {
        return res.status(410).json({ message: "Report has expired" });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shared report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}