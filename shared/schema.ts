import { pgTable, text, serial, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  postcode: text("postcode").notNull(),
  purchasePrice: numeric("purchase_price"),
  marketValue: numeric("market_value"),
  monthlyRent: numeric("monthly_rent"),
  monthlyHoa: numeric("monthly_hoa"),
  annualTaxes: numeric("annual_taxes"),
  annualInsurance: numeric("annual_insurance"),
  annualMaintenance: numeric("annual_maintenance"),
  managementFees: numeric("management_fees"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const propertyInsertSchema = createInsertSchema(properties)
  .omit({ id: true, createdAt: true });

export type InsertProperty = z.infer<typeof propertyInsertSchema>;
export type Property = typeof properties.$inferSelect;

export const sharedReports = pgTable("shared_reports", {
  id: serial("id").primaryKey(),
  shareId: text("share_id").notNull().unique(),
  propertyData: json("property_data").notNull(),
  aiInsights: json("ai_insights"), // Added aiInsights field
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const sharedReportInsertSchema = createInsertSchema(sharedReports)
  .omit({ id: true, createdAt: true });

export type InsertSharedReport = z.infer<typeof sharedReportInsertSchema>;
export type SharedReport = typeof sharedReports.$inferSelect;

export const propertyData = pgTable('property_data', {
  id: serial('id').primaryKey(),
  formData: json('form_data'),
  aiInsights: json('ai_insights'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});