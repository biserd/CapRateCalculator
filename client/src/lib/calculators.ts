export function calculateNOI(annualIncome: number, annualExpenses: number): number {
  return annualIncome - annualExpenses;
}

export function calculateCapRate(noi: number, propertyValue: number): number {
  if (propertyValue === 0) return 0;
  return (noi / propertyValue) * 100;
}

export function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 1200; // Convert annual rate to monthly decimal
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) return principal / numberOfPayments;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

export function calculateCashOnCashReturn(
  annualCashFlow: number,
  totalInvestment: number
): number {
  if (totalInvestment === 0) return 0;
  return (annualCashFlow / totalInvestment) * 100;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number | null): string {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function parseCurrency(value: string): string {
  // Remove all non-numeric characters except decimal point
  return value.replace(/[^0-9.]/g, '');
}

export function formatInputCurrency(value: string): string {
  if (!value) return '';

  // Parse the number from the string, removing any existing formatting
  const number = Number(parseCurrency(value));
  if (isNaN(number)) return '';

  // Format the number as currency with no decimal places for whole numbers
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}