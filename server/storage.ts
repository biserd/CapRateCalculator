import { properties, type Property, type InsertProperty } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createProperty(property: InsertProperty): Promise<Property>;
  getPropertiesByPostcode(postcode: string): Promise<Property[]>;
  getAllProperties(): Promise<Property[]>;
}

export class DatabaseStorage implements IStorage {
  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db.insert(properties).values(property).returning();
    return created;
  }

  async getPropertiesByPostcode(postcode: string): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.postcode, postcode))
      .orderBy(desc(properties.createdAt));
  }

  async getAllProperties(): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));
  }
}

export const storage = new DatabaseStorage();