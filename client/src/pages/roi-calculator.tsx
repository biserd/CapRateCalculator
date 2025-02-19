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

const roiCalculatorSchema = z.object({
  purchasePrice: z.string().min(1, "Purchase price is required"),
  renovationCosts: z.string(),
  monthlyRent: z.string().min(1, "Monthly rent is required"),
  monthlyExpenses: z.string(),
  propertyAppreciation: z.number().min(0).max(15),
  holdingPeriod: z.number().min(1).max(30),
});

type ROICalculatorData = z.infer<typeof roiCalculatorSchema>;

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
        title="Real Estate ROI Calculator"
        description="Calculate your potential return on investment for real estate properties. Analyze cash flow, appreciation, and total returns."
        keywords="roi calculator, real estate investment, property returns, cash flow analysis"
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">ROI Calculator</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
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
                </form>
              </Form>

              <Separator className="my-6" />

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
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
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Projected Future Value</span>
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
              </div>
            </CardContent>
          </Card>
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

  const totalInvestment = purchasePrice + renovationCosts;
  const annualCashFlow = (monthlyRent - monthlyExpenses) * 12;
  const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;

  const futureValue = totalInvestment * Math.pow(1 + propertyAppreciation / 100, holdingPeriod);
  const totalReturn = (futureValue - totalInvestment) + (annualCashFlow * holdingPeriod);
  const totalROI = (totalReturn / totalInvestment) * 100;

  return {
    totalInvestment,
    annualCashFlow,
    cashOnCashReturn,
    futureValue,
    totalReturn,
    totalROI
  };
}