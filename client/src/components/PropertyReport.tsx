import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { PropertyFormData } from "@/lib/validators";
import { formatCurrency, formatPercentage } from "@/lib/calculators";

interface PropertyReportProps {
  formData: PropertyFormData;
  results: {
    annualIncome: number;
    annualExpenses: number;
    noi: number;
    capRatePurchase: number;
    capRateMarket: number | null;
  };
  comparableProperties?: Array<{
    purchasePrice: number;
    monthlyRent: number;
    capRate: number;
  }>;
  riskScores?: {
    marketRisk: number;
    financialRisk: number;
    propertyCondition: number;
    locationRisk: number;
    tenantRisk: number;
  };
  overallRiskScore?: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottom: '1 solid #e5e5e5',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#6B7280',
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  riskSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  riskScore: {
    fontSize: 12,
    marginBottom: 3,
  },
  riskDescription: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 5,
  },
});

export function PropertyReport({ formData, results, comparableProperties, riskScores, overallRiskScore }: PropertyReportProps) {
  const formatValue = (value: string | number | null) => {
    if (value === null || value === "") return "N/A";
    if (typeof value === "string") return value;
    return formatCurrency(value);
  };

  const calculateAverageCapRate = () => {
    if (!comparableProperties?.length) return null;
    const total = comparableProperties.reduce((sum, prop) => sum + prop.capRate, 0);
    return total / comparableProperties.length;
  };

  const averageCapRate = calculateAverageCapRate();
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Property Analysis Report</Text>
          <Text style={styles.subtitle}>Generated on {reportDate}</Text>
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Property Location (Postcode)</Text>
            <Text style={styles.value}>{formData.postcode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Purchase Price</Text>
            <Text style={styles.value}>{formatValue(formData.purchasePrice)}</Text>
          </View>
          {formData.marketValue && (
            <View style={styles.row}>
              <Text style={styles.label}>Current Market Value</Text>
              <Text style={styles.value}>{formatValue(formData.marketValue)}</Text>
            </View>
          )}
        </View>

        {/* Financial Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Analysis</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Rental Income</Text>
            <Text style={styles.value}>{formatValue(formData.monthlyRent)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Annual Rental Income</Text>
            <Text style={styles.value}>{formatValue(results.annualIncome)}</Text>
          </View>
          <View style={styles.highlight}>
            <View style={styles.row}>
              <Text style={styles.label}>Net Operating Income (NOI)</Text>
              <Text style={styles.value}>{formatValue(results.noi)}</Text>
            </View>
          </View>
        </View>

        {/* Operating Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operating Expenses</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly HOA Fees</Text>
            <Text style={styles.value}>{formatValue(formData.monthlyHoa)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Annual Property Taxes</Text>
            <Text style={styles.value}>{formatValue(formData.annualTaxes)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Annual Insurance</Text>
            <Text style={styles.value}>{formatValue(formData.annualInsurance)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Annual Maintenance</Text>
            <Text style={styles.value}>{formatValue(formData.annualMaintenance)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Management Fees</Text>
            <Text style={styles.value}>{formatValue(formData.managementFees)}</Text>
          </View>
          <View style={styles.highlight}>
            <View style={styles.row}>
              <Text style={styles.label}>Total Annual Expenses</Text>
              <Text style={styles.value}>{formatValue(results.annualExpenses)}</Text>
            </View>
          </View>
        </View>

        {/* Investment Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Performance</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Cap Rate (Purchase Price)</Text>
            <Text style={styles.value}>
              {results.capRatePurchase ? formatPercentage(results.capRatePurchase) : 'N/A'}
            </Text>
          </View>
          {results.capRateMarket !== null && (
            <View style={styles.row}>
              <Text style={styles.label}>Cap Rate (Market Value)</Text>
              <Text style={styles.value}>{formatPercentage(results.capRateMarket)}</Text>
            </View>
          )}
          {averageCapRate !== null && (
            <View style={styles.highlight}>
              <View style={styles.row}>
                <Text style={styles.label}>Average Market Cap Rate</Text>
                <Text style={styles.value}>{formatPercentage(averageCapRate)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Market Comparison */}
        {comparableProperties && comparableProperties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Comparison</Text>
            {comparableProperties.map((prop, index) => (
              <View key={index} style={[styles.row, { marginBottom: 15 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Comparable Property {index + 1}</Text>
                  <Text>Price: {formatValue(prop.purchasePrice)}</Text>
                  <Text>Monthly Rent: {formatValue(prop.monthlyRent)}</Text>
                  <Text>Cap Rate: {formatPercentage(prop.capRate)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Risk Analysis */}
        {riskScores && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Analysis</Text>

            <View style={styles.riskSection}>
              <Text style={styles.riskTitle}>
                Overall Risk Score: {overallRiskScore?.toFixed(1)}
                {overallRiskScore && ` - ${
                  overallRiskScore <= 3 ? "Low Risk" :
                  overallRiskScore <= 6 ? "Moderate Risk" :
                  "High Risk"
                }`}
              </Text>
              <Text style={styles.riskDescription}>
                {overallRiskScore && (
                  overallRiskScore <= 3 ? "Favorable conditions with minimal concerns" :
                  overallRiskScore <= 6 ? "Some concerns present but manageable" :
                  "Significant concerns that need careful consideration"
                )}
              </Text>
            </View>

            <View style={styles.riskSection}>
              <Text style={styles.riskTitle}>Risk Factors Breakdown:</Text>
              {Object.entries(riskScores).map(([key, value]) => (
                <View key={key}>
                  <Text style={styles.riskScore}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}: {value.toFixed(1)} - {
                      value <= 3 ? "Low Risk" :
                      value <= 6 ? "Moderate Risk" :
                      "High Risk"
                    }
                  </Text>
                  <Text style={styles.riskDescription}>
                    {
                      key === "marketRisk" ? "Market volatility and trends analysis" :
                      key === "financialRisk" ? "Cash flow stability and financial metrics" :
                      key === "propertyCondition" ? "Property maintenance and repair needs" :
                      key === "locationRisk" ? "Neighborhood and economic factors" :
                      "Tenant quality and rental market conditions"
                    }
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          This report was generated using the Real Estate Investment Analysis Platform.
          The analysis is based on provided inputs and should not be considered as financial advice.
        </Text>
      </Page>
    </Document>
  );
}