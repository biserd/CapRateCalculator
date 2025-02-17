import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanCalculatorSchema, type LoanCalculatorData } from "@/lib/validators";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { calculateMonthlyMortgage, calculateCashOnCashReturn, formatCurrency, formatPercentage, parseCurrency, formatInputCurrency } from "@/lib/calculators";

export default function LoanCalculator() {
  const form = useForm<LoanCalculatorData>({
    resolver: zodResolver(loanCalculatorSchema),
    defaultValues: {
      purchasePrice: "",
      downPaymentPercent: "20",
      interestRate: "6.5",
      loanTerm: "30",
      monthlyRent: "",
      monthlyExpenses: "",
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Loan Calculator</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mortgage Analysis</CardTitle>
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
                    name="downPaymentPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Down Payment %</FormLabel>
                        <FormControl>
                          <Input placeholder="20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate %</FormLabel>
                        <FormControl>
                          <Input placeholder="6.5" {...field} />
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
                          <Input placeholder="30" {...field} />
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
                        <FormLabel className="flex items-center gap-2">
                          Monthly Expenses
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Include taxes, insurance, HOA, maintenance, etc.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
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
                </div>
              </form>
            </Form>

            <Separator className="my-6" />

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loan Amount</span>
                      <span className="font-medium">{formatCurrency(results.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Down Payment</span>
                      <span className="font-medium">{formatCurrency(results.downPayment)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Monthly Payment</span>
                      <span>{formatCurrency(results.monthlyPayment)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Cash Flow</span>
                      <span className="font-medium">{formatCurrency(results.monthlyCashFlow)}</span>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function calculateResults(formValues: LoanCalculatorData) {
  const purchasePrice = Number(formValues.purchasePrice) || 0;
  const downPaymentPercent = Number(formValues.downPaymentPercent) || 0;
  const interestRate = Number(formValues.interestRate) || 0;
  const loanTerm = Number(formValues.loanTerm) || 30;
  const monthlyRent = Number(formValues.monthlyRent) || 0;
  const monthlyExpenses = Number(formValues.monthlyExpenses) || 0;

  const downPayment = (purchasePrice * downPaymentPercent) / 100;
  const loanAmount = purchasePrice - downPayment;
  const monthlyPayment = calculateMonthlyMortgage(loanAmount, interestRate, loanTerm);

  const monthlyCashFlow = monthlyRent - monthlyPayment - monthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashReturn = calculateCashOnCashReturn(annualCashFlow, downPayment);

  return {
    loanAmount,
    downPayment,
    monthlyPayment,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn
  };
}