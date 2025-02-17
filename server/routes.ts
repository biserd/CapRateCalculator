import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { propertyInsertSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}