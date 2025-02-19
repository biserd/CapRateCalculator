import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatPercentage, parseCurrency, formatInputCurrency } from "@/lib/calculators";
import { Metadata } from "@/components/Metadata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentTools } from "@/components/InvestmentTools";

const roiCalculatorSchema = z.object({
  // Property Details
  purchasePrice: z.string().min(1, "Purchase price is required"),
  renovationCosts: z.string(),
  monthlyRent: z.string().min(1, "Monthly rent is required"),
  monthlyExpenses: z.string(),
  propertyAppreciation: z.number().min(0).max(15),
  holdingPeriod: z.number().min(1).max(30),

  // Mortgage Details
  downPaymentPercent: z.number().min(0).max(100),
  interestRate: z.number().min(0).max(15),
  loanTerm: z.number().min(5).max(30),

  // Tax Details
  marginalTaxRate: z.number().min(0).max(50),
  propertyTaxRate: z.number().min(0).max(5),
  depreciationPeriod: z.number().default(27.5), // Standard residential depreciation period

  // Renovation Details
  renovationType: z.enum(["cosmetic", "moderate", "major"]),
  renovationDuration: z.number().min(1).max(12),
  rentIncrease: z.number().min(0).max(100),
});

type ROICalculatorData = z.infer<typeof roiCalculatorSchema>;

function calculateMortgagePayment(loanAmount: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = years * 12;
  return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
}

function calculateTaxBenefits(
  propertyValue: number, 
  mortgageInterest: number,
  propertyTaxes: number,
  depreciation: number,
  marginalTaxRate: number
): number {
  const totalDeductions = mortgageInterest + propertyTaxes + depreciation;
  return totalDeductions * (marginalTaxRate / 100);
}

function calculateRenovationROI(
  renovationType: string,
  renovationCost: number,
  rentIncrease: number,
  propertyValue: number
): number {
  const valueIncreaseFactors = {
    cosmetic: 1.5,
    moderate: 2.0,
    major: 2.5
  };

  const factor = valueIncreaseFactors[renovationType as keyof typeof valueIncreaseFactors];
  const valueIncrease = renovationCost * factor;
  const annualRentIncrease = rentIncrease * 12;

  return ((valueIncrease + annualRentIncrease) / renovationCost) * 100;
}

export default function ROICalculator() {
  const form = useForm<ROICalculatorData>({
    resolver: zodResolver(roiCalculatorSchema),
    defaultValues: {
      purchasePrice: "",
      renovationCosts: "",
      monthlyRent: "",
      monthlyExpenses: "",
      propertyAppreciation: 3,
      holdingPeriod: 5,
      downPaymentPercent: 20,
      interestRate: 6.5,
      loanTerm: 30,
      marginalTaxRate: 25,
      propertyTaxRate: 1.2,
      depreciationPeriod: 27.5,
      renovationType: "cosmetic",
      renovationDuration: 3,
      rentIncrease: 10,
    }
  });

  const { watch } = form;
  const formValues = watch();

  const results = calculateResults(formValues);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field: any) => {
    const formatted = formatInputCurrency(e.target.value);
    field.onChange(parseCurrency(formatted));
  };

  return (
    <>
      <Metadata 
        title="Advanced ROI Calculator"
        description="Calculate detailed return on investment for real estate properties including mortgage amortization, tax benefits, and renovation ROI."
        keywords="roi calculator, real estate investment, property returns, mortgage calculator, tax benefits, renovation roi"
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Advanced ROI Calculator</h1>
          </div>

          <Tabs defaultValue="property">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="property">Property Details</TabsTrigger>
              <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
              <TabsTrigger value="tax">Tax Benefits</TabsTrigger>
              <TabsTrigger value="renovation">Renovation ROI</TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form className="space-y-6">
                    <TabsContent value="property">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="purchasePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purchase Price</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="$0.00" 
                                  {...field}
                                  value={field.value ? formatInputCurrency(field.value) : ''}
                                  onBlur={(e) => handleBlur(e, field)}
                                  onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="renovationCosts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Renovation Costs</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="$0.00" 
                                  {...field}
                                  value={field.value ? formatInputCurrency(field.value) : ''}
                                  onBlur={(e) => handleBlur(e, field)}
                                  onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="monthlyRent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expected Monthly Rent</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="$0.00" 
                                  {...field}
                                  value={field.value ? formatInputCurrency(field.value) : ''}
                                  onBlur={(e) => handleBlur(e, field)}
                                  onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="monthlyExpenses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Expenses</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="$0.00" 
                                  {...field}
                                  value={field.value ? formatInputCurrency(field.value) : ''}
                                  onBlur={(e) => handleBlur(e, field)}
                                  onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="propertyAppreciation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Appreciation Rate (%)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={15}
                                    min={0}
                                    step={0.1}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value}%
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Typical range: 2-5% annually
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="holdingPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Holding Period (Years)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={30}
                                    min={1}
                                    step={1}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value} {field.value === 1 ? 'year' : 'years'}
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Typical investment horizon: 5-10 years
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="mortgage">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="downPaymentPercent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Down Payment (%)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={100}
                                    min={0}
                                    step={1}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value}%
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Typical range: 20-25%
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="interestRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interest Rate (%)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={15}
                                    min={0}
                                    step={0.125}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value}%
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="loanTerm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Term (Years)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={30}
                                    min={5}
                                    step={5}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value} years
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="tax">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="marginalTaxRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marginal Tax Rate (%)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={50}
                                    min={0}
                                    step={1}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value}%
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="propertyTaxRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Tax Rate (%)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={5}
                                    min={0}
                                    step={0.1}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value}%
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="renovation">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="renovationCosts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Renovation Budget</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="$0.00" 
                                  {...field}
                                  value={field.value ? formatInputCurrency(field.value) : ''}
                                  onBlur={(e) => handleBlur(e, field)}
                                  onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="renovationType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Renovation Type</FormLabel>
                              <FormControl>
                                <select
                                  className="w-full p-2 border rounded"
                                  {...field}
                                >
                                  <option value="cosmetic">Cosmetic (Paint, Fixtures)</option>
                                  <option value="moderate">Moderate (Kitchen, Bath)</option>
                                  <option value="major">Major (Addition, Complete Remodel)</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="rentIncrease"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expected Rent Increase (%)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={([value]) => field.onChange(value)}
                                    max={100}
                                    min={0}
                                    step={1}
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value}%
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </form>
                </Form>

                <Separator className="my-6" />

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Investment</span>
                          <span className="font-medium">{formatCurrency(results.totalInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Cash Flow</span>
                          <span className="font-medium">{formatCurrency(results.annualCashFlow)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Cash-on-Cash Return</span>
                          <span>{formatPercentage(results.cashOnCashReturn)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Future Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Projected Value</span>
                          <span className="font-medium">{formatCurrency(results.futureValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Return</span>
                          <span className="font-medium">{formatCurrency(results.totalReturn)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total ROI</span>
                          <span>{formatPercentage(results.totalROI)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Mortgage Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loan Amount</span>
                          <span className="font-medium">
                            {formatCurrency(results.loanAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly Payment</span>
                          <span className="font-medium">
                            {formatCurrency(results.monthlyMortgage)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Interest</span>
                          <span className="font-medium">
                            {formatCurrency(results.totalInterest)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Property Tax</span>
                          <span className="font-medium">
                            {formatCurrency(results.annualPropertyTax)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Depreciation</span>
                          <span className="font-medium">
                            {formatCurrency(results.annualDepreciation)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total Tax Savings</span>
                          <span>{formatCurrency(results.totalTaxSavings)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {Number(formValues.renovationCosts) > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Renovation Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Value Added</span>
                            <span className="font-medium">
                              {formatCurrency(results.renovationValueAdd)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Additional Annual Rent</span>
                            <span className="font-medium">
                              {formatCurrency(results.additionalAnnualRent)}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Renovation ROI</span>
                            <span>{formatPercentage(results.renovationROI)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </Tabs>
          <InvestmentTools />
        </div>
      </div>
    </>
  );
}

function calculateResults(formValues: ROICalculatorData) {
  const purchasePrice = Number(formValues.purchasePrice) || 0;
  const renovationCosts = Number(formValues.renovationCosts) || 0;
  const monthlyRent = Number(formValues.monthlyRent) || 0;
  const monthlyExpenses = Number(formValues.monthlyExpenses) || 0;
  const propertyAppreciation = formValues.propertyAppreciation;
  const holdingPeriod = formValues.holdingPeriod;

  // Calculate loan details
  const downPayment = purchasePrice * (formValues.downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgage = calculateMortgagePayment(loanAmount, formValues.interestRate, formValues.loanTerm);
  const totalMortgagePayments = monthlyMortgage * formValues.loanTerm * 12;
  const totalInterest = totalMortgagePayments - loanAmount;

  // Calculate tax benefits
  const annualPropertyTax = purchasePrice * (formValues.propertyTaxRate / 100);
  const annualDepreciation = purchasePrice / formValues.depreciationPeriod;
  const firstYearInterest = loanAmount * (formValues.interestRate / 100); // Simplified
  const totalTaxSavings = calculateTaxBenefits(
    purchasePrice,
    firstYearInterest,
    annualPropertyTax,
    annualDepreciation,
    formValues.marginalTaxRate
  );

  // Calculate renovation benefits
  const renovationValueAdd = renovationCosts > 0 ? renovationCosts * 1.5 : 0; // Simplified
  const additionalAnnualRent = monthlyRent * (formValues.rentIncrease / 100) * 12;
  const renovationROI = renovationCosts > 0 ?
    calculateRenovationROI(
      formValues.renovationType,
      renovationCosts,
      formValues.rentIncrease,
      purchasePrice
    ) : 0;

  const totalInvestment = downPayment + renovationCosts;
  const annualCashFlow = (monthlyRent - monthlyExpenses - monthlyMortgage) * 12;
  const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;

  const futureValue = (purchasePrice + renovationValueAdd) * 
    Math.pow(1 + propertyAppreciation / 100, holdingPeriod);
  const totalReturn = (futureValue - totalInvestment) + 
    (annualCashFlow * holdingPeriod) +
    (totalTaxSavings * holdingPeriod);
  const totalROI = (totalReturn / totalInvestment) * 100;

  return {
    totalInvestment,
    annualCashFlow,
    cashOnCashReturn,
    futureValue,
    totalReturn,
    totalROI,
    loanAmount,
    monthlyMortgage,
    totalInterest,
    annualPropertyTax,
    annualDepreciation,
    totalTaxSavings,
    renovationValueAdd,
    additionalAnnualRent,
    renovationROI
  };
}