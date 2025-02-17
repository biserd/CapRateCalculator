import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
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
  purchasePrice: numeric("purchase_price").notNull(),
  marketValue: numeric("market_value"),
  monthlyRent: numeric("monthly_rent").notNull(),
  monthlyHoa: numeric("monthly_hoa").notNull(),
  annualTaxes: numeric("annual_taxes").notNull(),
  annualInsurance: numeric("annual_insurance").notNull(),
  annualMaintenance: numeric("annual_maintenance").notNull(),
  managementFees: numeric("management_fees"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const propertyInsertSchema = createInsertSchema(properties)
  .omit({ id: true, createdAt: true });

export type InsertProperty = z.infer<typeof propertyInsertSchema>;
export type Property = typeof properties.$inferSelect;