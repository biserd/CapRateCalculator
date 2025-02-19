import { properties, type Property, type InsertProperty, sharedReports, type SharedReport, type InsertSharedReport } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  createProperty(property: InsertProperty): Promise<Property>;
  getPropertiesByPostcode(postcode: string): Promise<Property[]>;
  getAllProperties(): Promise<Property[]>;
  createSharedReport(data: Omit<InsertSharedReport, "shareId">): Promise<SharedReport>;
  getSharedReport(shareId: string): Promise<SharedReport | undefined>;
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

  async createSharedReport(data: Omit<InsertSharedReport, "shareId">): Promise<SharedReport> {
    try {
      const shareId = nanoid(10); // Generate a unique 10-character ID
      const [created] = await db.insert(sharedReports)
        .values({ ...data, shareId })
        .returning();
      return created;
    } catch (error) {
      console.error('Error creating shared report:', error);
      throw new Error('Failed to create shared report');
    }
  }

  async getSharedReport(shareId: string): Promise<SharedReport | undefined> {
    try {
      const [report] = await db
        .select()
        .from(sharedReports)
        .where(eq(sharedReports.shareId, shareId));
      return report;
    } catch (error) {
      console.error('Error fetching shared report:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();