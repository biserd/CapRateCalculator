import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { LoanCalculatorData } from "@/lib/validators";
import { formatCurrency, formatPercentage } from "@/lib/calculators";

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
});

interface LoanReportProps {
  formData: LoanCalculatorData;
  results: {
    loanAmount: number;
    downPayment: number;
    monthlyPayment: number;
    monthlyCashFlow: number;
    annualCashFlow: number;
    cashOnCashReturn: number;
  };
}

export function LoanReport({ formData, results }: LoanReportProps) {
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
          <Text style={styles.title}>Loan Analysis Report</Text>
          <Text style={styles.subtitle}>Generated on {reportDate}</Text>
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Purchase Price</Text>
            <Text style={styles.value}>{formatCurrency(Number(formData.purchasePrice))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Down Payment Percentage</Text>
            <Text style={styles.value}>{formData.downPaymentPercent}%</Text>
          </View>
        </View>

        {/* Loan Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Interest Rate</Text>
            <Text style={styles.value}>{formData.interestRate}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Loan Term</Text>
            <Text style={styles.value}>{formData.loanTerm} years</Text>
          </View>
          <View style={styles.highlight}>
            <View style={styles.row}>
              <Text style={styles.label}>Loan Amount</Text>
              <Text style={styles.value}>{formatCurrency(results.loanAmount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Down Payment</Text>
              <Text style={styles.value}>{formatCurrency(results.downPayment)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Monthly Payment</Text>
              <Text style={styles.value}>{formatCurrency(results.monthlyPayment)}</Text>
            </View>
          </View>
        </View>

        {/* Cash Flow Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cash Flow Analysis</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Expected Monthly Rent</Text>
            <Text style={styles.value}>{formatCurrency(Number(formData.monthlyRent))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Expenses</Text>
            <Text style={styles.value}>{formatCurrency(Number(formData.monthlyExpenses))}</Text>
          </View>
          <View style={styles.highlight}>
            <View style={styles.row}>
              <Text style={styles.label}>Monthly Cash Flow</Text>
              <Text style={styles.value}>{formatCurrency(results.monthlyCashFlow)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Annual Cash Flow</Text>
              <Text style={styles.value}>{formatCurrency(results.annualCashFlow)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cash-on-Cash Return</Text>
              <Text style={styles.value}>{formatPercentage(results.cashOnCashReturn)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This report was generated using the Real Estate Investment Analysis Platform.
          The analysis is based on provided inputs and should not be considered as financial advice.
        </Text>
      </Page>
    </Document>
  );
}
