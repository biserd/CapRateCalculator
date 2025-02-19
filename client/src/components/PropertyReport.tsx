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
  aiInsights?: {
    marketValueEstimate: string;
    keyFactors: string[];
    recommendations: string[];
    marketTrends: string;
    riskAssessment: string;
  };
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
    marginTop: 10,
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#f9fafb',
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  riskScore: {
    fontSize: 12,
    marginBottom: 5,
    color: '#1f2937',
  },
  riskDescription: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 8,
    paddingLeft: 10,
  },
  riskItem: {
    marginBottom: 12,
  },
  riskCategoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#4B5563',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 2,
  }
});

export function PropertyReport({ formData, results, comparableProperties, riskScores, overallRiskScore, aiInsights }: PropertyReportProps) {
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
            <Text style={styles.sectionTitle}>Property Risk Analysis</Text>

            <View style={styles.riskSection}>
              <Text style={styles.riskCategoryTitle}>Overall Risk Assessment</Text>
              <Text style={styles.riskScore}>
                Score: {overallRiskScore?.toFixed(1)} - {
                  overallRiskScore && overallRiskScore <= 3 ? "Low Risk" :
                  overallRiskScore && overallRiskScore <= 6 ? "Moderate Risk" :
                  "High Risk"
                }
              </Text>
              <Text style={styles.riskDescription}>
                {overallRiskScore && overallRiskScore <= 3 ? 
                  "This property shows favorable conditions with minimal concerns, indicating a stable investment opportunity with strong fundamentals." :
                overallRiskScore && overallRiskScore <= 6 ?
                  "The property has some manageable concerns that require monitoring. Consider implementing risk management strategies." :
                  "This investment presents significant risks that need careful consideration and substantial risk mitigation strategies."
                }
              </Text>
            </View>

            <View style={styles.riskSection}>
              <Text style={styles.riskCategoryTitle}>Risk Factors Breakdown</Text>
              {Object.entries(riskScores).map(([key, value]) => (
                <View key={key} style={styles.riskItem}>
                  <Text style={styles.riskScore}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}: {value.toFixed(1)} - {
                      value <= 3 ? "Low Risk" :
                      value <= 6 ? "Moderate Risk" :
                      "High Risk"
                    }
                  </Text>
                  <Text style={styles.riskDescription}>
                    {key === "marketRisk" && 
                      "Evaluates market stability, price trends, and supply/demand balance in the area. " +
                      (value <= 3 ? "Current market conditions are stable and favorable." :
                       value <= 6 ? "Some market uncertainty exists but remains within acceptable range." :
                       "High market volatility or unfavorable trends detected.")
                    }
                    {key === "financialRisk" && 
                      "Assesses the property's financial performance metrics. " +
                      (value <= 3 ? "Strong financial indicators with good cash flow potential." :
                       value <= 6 ? "Acceptable financial performance with some areas needing attention." :
                       "Significant financial concerns requiring immediate attention.")
                    }
                    {key === "propertyCondition" && 
                      "Examines the physical state and maintenance requirements. " +
                      (value <= 3 ? "Property is well-maintained with minimal repair needs." :
                       value <= 6 ? "Some maintenance or updates may be required." :
                       "Substantial repairs or renovations likely needed.")
                    }
                    {key === "locationRisk" && 
                      "Considers neighborhood factors and economic indicators. " +
                      (value <= 3 ? "Prime location with strong economic fundamentals." :
                       value <= 6 ? "Acceptable location with some areas of concern." :
                       "Location presents significant challenges or risks.")
                    }
                    {key === "tenantRisk" && 
                      "Analyzes rental market conditions and tenant quality. " +
                      (value <= 3 ? "Strong rental demand with quality tenant potential." :
                       value <= 6 ? "Average rental market conditions." :
                       "Challenging rental market or tenant concerns.")
                    }
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {aiInsights && (
              <View style={styles.section}>
                <Text style={styles.heading}>AI Property Insights</Text>
                <View style={styles.content}>
                  <Text style={styles.subheading}>Market Value Estimate</Text>
                  <Text style={styles.text}>{aiInsights.marketValueEstimate}</Text>

                  <Text style={styles.subheading}>Key Factors</Text>
                  {aiInsights.keyFactors.map((factor: string, index: number) => (
                    <Text key={index} style={styles.text}>• {factor}</Text>
                  ))}

                  <Text style={styles.subheading}>Recommendations</Text>
                  {aiInsights.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={styles.text}>• {rec}</Text>
                  ))}

                  <Text style={styles.subheading}>Market Trends</Text>
                  <Text style={styles.text}>{aiInsights.marketTrends}</Text>

                  <Text style={styles.subheading}>Risk Assessment</Text>
                  <Text style={styles.text}>{aiInsights.riskAssessment}</Text>
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