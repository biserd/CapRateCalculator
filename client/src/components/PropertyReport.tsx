import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { PropertyFormData } from "@/lib/validators";
import { formatCurrency, formatPercentage } from "@/lib/calculators";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#4B5563',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: '#6B7280',
  },
  value: {
    fontWeight: 'bold',
  },
});

interface PropertyReportProps {
  formData: PropertyFormData;
  results: {
    annualIncome: number;
    annualExpenses: number;
    noi: number;
    capRatePurchase: number;
    capRateMarket: number | null;
  };
}

export function PropertyReport({ formData, results }: PropertyReportProps) {
  const formatValue = (value: string | number | null) => {
    if (value === null || value === "") return "N/A";
    if (typeof value === "string") return value;
    return formatCurrency(value);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Property Analysis Report</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Postcode</Text>
            <Text style={styles.value}>{formData.postcode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Purchase Price</Text>
            <Text style={styles.value}>{formatValue(formData.purchasePrice)}</Text>
          </View>
          {formData.marketValue && (
            <View style={styles.row}>
              <Text style={styles.label}>Market Value</Text>
              <Text style={styles.value}>{formatValue(formData.marketValue)}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income & Expenses</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Rental Income</Text>
            <Text style={styles.value}>{formatValue(formData.monthlyRent)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Annual Income</Text>
            <Text style={styles.value}>{formatValue(results.annualIncome)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Annual Expenses</Text>
            <Text style={styles.value}>{formatValue(results.annualExpenses)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Net Operating Income (NOI)</Text>
            <Text style={styles.value}>{formatValue(results.noi)}</Text>
          </View>
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
        </View>
      </Page>
    </Document>
  );
}