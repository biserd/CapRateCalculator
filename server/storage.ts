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
    try {
      // Filter out undefined values and empty strings
      const cleanedProperty = Object.fromEntries(
        Object.entries(property).filter(([_, value]) => value !== undefined && value !== "")
      ) as InsertProperty;

      // Convert string numbers to actual numbers for the database
      const numberFields = ['purchasePrice', 'marketValue', 'monthlyRent', 'monthlyHoa', 
                          'annualTaxes', 'annualInsurance', 'annualMaintenance', 'managementFees'];

      const formattedProperty = Object.fromEntries(
        Object.entries(cleanedProperty).map(([key, value]) => {
          if (numberFields.includes(key) && value !== undefined && value !== "") {
            return [key, Number(value)];
          }
          return [key, value];
        })
      ) as InsertProperty;

      const [created] = await db.insert(properties)
        .values(formattedProperty)
        .returning();

      return created;
    } catch (error) {
      console.error('Error creating property:', error);
      throw new Error('Failed to create property');
    }
  }

  async getPropertiesByPostcode(postcode: string): Promise<Property[]> {
    try {
      return await db
        .select()
        .from(properties)
        .where(eq(properties.postcode, postcode))
        .orderBy(desc(properties.createdAt));
    } catch (error) {
      console.error('Error fetching properties by postcode:', error);
      return [];
    }
  }

  async getAllProperties(): Promise<Property[]> {
    try {
      return await db
        .select()
        .from(properties)
        .orderBy(desc(properties.createdAt));
    } catch (error) {
      console.error('Error fetching all properties:', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();