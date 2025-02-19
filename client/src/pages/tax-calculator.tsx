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

const taxCalculatorSchema = z.object({
  assessedValue: z.string().min(1, "Assessed value is required"),
  taxRate: z.number().min(0).max(5),
  annualIncrease: z.number().min(0).max(10),
  yearsToProject: z.number().min(1).max(30),
});

type TaxCalculatorData = z.infer<typeof taxCalculatorSchema>;

export default function TaxCalculator() {
  const form = useForm<TaxCalculatorData>({
    resolver: zodResolver(taxCalculatorSchema),
    defaultValues: {
      assessedValue: "",
      taxRate: 1.2,
      annualIncrease: 2,
      yearsToProject: 5,
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
        title="Property Tax Calculator"
        description="Calculate and project your property tax payments. Plan your real estate investment expenses with our comprehensive tax calculator."
        keywords="property tax calculator, real estate taxes, tax estimation, property expenses"
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Property Tax Calculator</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="assessedValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Assessed Value</FormLabel>
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
                      name="taxRate"
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
                          <FormDescription>
                            Typical range: 0.5-2.5% annually
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="annualIncrease"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Assessment Increase (%)</FormLabel>
                          <FormControl>
                            <div className="flex flex-col space-y-2">
                              <Slider
                                value={[field.value]}
                                onValueChange={([value]) => field.onChange(value)}
                                max={10}
                                min={0}
                                step={0.1}
                              />
                              <div className="text-sm text-muted-foreground">
                                {field.value}%
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Average annual increase in property assessment
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearsToProject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years to Project</FormLabel>
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
                            Project tax payments over time
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
                        <span className="text-muted-foreground">Annual Tax Payment (Year 1)</span>
                        <span className="font-medium">{formatCurrency(results.firstYearTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Tax Payment</span>
                        <span className="font-medium">{formatCurrency(results.monthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Effective Tax Rate</span>
                        <span>{formatPercentage(results.effectiveTaxRate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Final Year Tax Payment</span>
                        <span className="font-medium">{formatCurrency(results.finalYearTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Tax Over Period</span>
                        <span className="font-medium">{formatCurrency(results.totalTaxPaid)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Average Annual Increase</span>
                        <span>{formatPercentage(results.averageAnnualIncrease)}</span>
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

function calculateResults(formValues: TaxCalculatorData) {
  const assessedValue = Number(formValues.assessedValue) || 0;
  const taxRate = formValues.taxRate;
  const annualIncrease = formValues.annualIncrease;
  const yearsToProject = formValues.yearsToProject;

  const firstYearTax = (assessedValue * taxRate) / 100;
  const monthlyPayment = firstYearTax / 12;
  const effectiveTaxRate = taxRate;

  // Calculate final year tax with compound annual increase
  const finalAssessedValue = assessedValue * Math.pow(1 + annualIncrease / 100, yearsToProject - 1);
  const finalYearTax = (finalAssessedValue * taxRate) / 100;

  // Calculate total tax paid over the period
  let totalTaxPaid = 0;
  for (let year = 0; year < yearsToProject; year++) {
    const yearAssessedValue = assessedValue * Math.pow(1 + annualIncrease / 100, year);
    totalTaxPaid += (yearAssessedValue * taxRate) / 100;
  }

  const averageAnnualIncrease = annualIncrease;

  return {
    firstYearTax,
    monthlyPayment,
    effectiveTaxRate,
    finalYearTax,
    totalTaxPaid,
    averageAnnualIncrease
  };
}
