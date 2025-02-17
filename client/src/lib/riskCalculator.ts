interface PropertyData {
  purchasePrice: number;
  marketValue?: number;
  monthlyRent: number;
  monthlyHoa: number;
  annualTaxes: number;
  annualInsurance: number;
  annualMaintenance: number;
  managementFees: number;
  postcode: string;
}

interface RiskScores {
  marketRisk: number;
  financialRisk: number;
  propertyCondition: number;
  locationRisk: number;
  tenantRisk: number;
}

export function calculateRiskScores(propertyData: PropertyData, comparableProperties?: any[]): RiskScores {
  // Market Risk calculation
  const marketRisk = calculateMarketRisk(propertyData, comparableProperties);
  
  // Financial Risk calculation
  const financialRisk = calculateFinancialRisk(propertyData);
  
  // Property Condition Risk (based on maintenance costs)
  const propertyCondition = calculatePropertyConditionRisk(propertyData);
  
  // Location Risk (placeholder - would typically use actual location data)
  const locationRisk = 5; // Moderate risk as default
  
  // Tenant Risk calculation
  const tenantRisk = calculateTenantRisk(propertyData);

  return {
    marketRisk,
    financialRisk,
    propertyCondition,
    locationRisk,
    tenantRisk
  };
}

function calculateMarketRisk(propertyData: PropertyData, comparableProperties?: any[]): number {
  if (!comparableProperties?.length) return 5; // Default moderate risk
  
  const averagePrice = comparableProperties.reduce((sum, prop) => 
    sum + Number(prop.purchasePrice), 0) / comparableProperties.length;
  
  const priceVariance = Math.abs(Number(propertyData.purchasePrice) - averagePrice) / averagePrice;
  
  // Convert variance to risk score (0-10)
  return Math.min(10, Math.max(1, priceVariance * 10));
}

function calculateFinancialRisk(propertyData: PropertyData): number {
  const monthlyIncome = Number(propertyData.monthlyRent);
  const monthlyExpenses = 
    Number(propertyData.monthlyHoa) + 
    Number(propertyData.annualTaxes) / 12 + 
    Number(propertyData.annualInsurance) / 12 + 
    Number(propertyData.annualMaintenance) / 12 + 
    Number(propertyData.managementFees) / 12;
  
  const dscr = monthlyIncome / monthlyExpenses;
  
  // Convert DSCR to risk score (0-10)
  if (dscr >= 2) return 1; // Very low risk
  if (dscr >= 1.5) return 3;
  if (dscr >= 1.25) return 5;
  if (dscr >= 1) return 7;
  return 10; // High risk
}

function calculatePropertyConditionRisk(propertyData: PropertyData): number {
  const maintenanceRatio = 
    Number(propertyData.annualMaintenance) / Number(propertyData.purchasePrice);
  
  // Convert maintenance ratio to risk score (0-10)
  return Math.min(10, Math.max(1, maintenanceRatio * 1000));
}

function calculateTenantRisk(propertyData: PropertyData): number {
  const rentToPrice = 
    (Number(propertyData.monthlyRent) * 12) / Number(propertyData.purchasePrice);
  
  // Convert rent-to-price ratio to risk score (0-10)
  if (rentToPrice >= 0.1) return 3; // Low risk - good rental yield
  if (rentToPrice >= 0.07) return 5;
  if (rentToPrice >= 0.05) return 7;
  return 9; // High risk - poor rental yield
}

export function calculateOverallRiskScore(riskScores: RiskScores): number {
  const weights = {
    marketRisk: 0.25,
    financialRisk: 0.3,
    propertyCondition: 0.15,
    locationRisk: 0.15,
    tenantRisk: 0.15
  };

  return Object.entries(riskScores).reduce(
    (score, [key, value]) => score + value * weights[key as keyof typeof weights],
    0
  );
}
