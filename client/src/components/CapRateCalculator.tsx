import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema, type PropertyFormData } from "@/lib/validators";
import { calculateCapRate, calculateNOI, formatCurrency, formatPercentage, parseCurrency, formatInputCurrency } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, FileDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PropertyReport } from "./PropertyReport";
import { RiskScoreVisualization } from "./RiskScoreVisualization";
import { calculateRiskScores, calculateOverallRiskScore } from "@/lib/riskCalculator";

export default function CapRateCalculator() {
  const queryClient = useQueryClient();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      postcode: "",
      purchasePrice: "",
      marketValue: "",
      monthlyRent: "",
      monthlyHoa: "",
      annualTaxes: "",
      annualInsurance: "",
      annualMaintenance: "",
      managementFees: ""
    }
  });

  const { watch } = form;
  const formValues = watch();
  const postcode = watch("postcode");

  // Fetch comparable properties
  const { data: comparableProperties } = useQuery({
    queryKey: ["/api/properties/postcode", postcode],
    enabled: Boolean(postcode),
  });

  // Mutation for saving property
  const saveMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      await apiRequest("POST", "/api/properties", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties/postcode", postcode] });
    }
  });

  // Automatically save when form values change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && Object.values(value).some(v => v !== "")) {
        const isValid = propertyFormSchema.safeParse(value).success;
        if (isValid) {
          saveMutation.mutate(value as PropertyFormData);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, saveMutation]);

  const results = calculateResults(formValues);
  const riskScores = calculateRiskScores(formValues, comparableProperties);
  const overallRiskScore = calculateOverallRiskScore(riskScores);

  function onReset() {
    form.reset();
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field: any) => {
    const formatted = formatInputCurrency(e.target.value);
    field.onChange(parseCurrency(formatted));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Property Details</h2>
        <PDFDownloadLink 
          document={
            <PropertyReport 
              formData={formValues} 
              results={results} 
              comparableProperties={comparableProperties?.map((property: any) => ({
                purchasePrice: Number(property.purchasePrice),
                monthlyRent: Number(property.monthlyRent),
                capRate: calculateCapRate(
                  calculateNOI(
                    Number(property.monthlyRent) * 12,
                    (Number(property.monthlyHoa) * 12) +
                      Number(property.annualTaxes) +
                      Number(property.annualInsurance) +
                      Number(property.annualMaintenance) +
                      Number(property.managementFees)
                  ),
                  Number(property.purchasePrice)
                )
              }))}
              riskScores={riskScores}
              overallRiskScore={overallRiskScore}
            />
          }
          fileName={`property-analysis-${formValues.postcode}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading || !formValues.postcode} variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              {loading ? "Generating PDF..." : "Export PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="marketValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Market Value
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Optional: Current market value if different from purchase price</TooltipContent>
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
            <FormField
              control={form.control}
              name="monthlyRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rental Income</FormLabel>
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
              name="monthlyHoa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly HOA Fees</FormLabel>
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
              name="annualTaxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Property Taxes</FormLabel>
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
              name="annualInsurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Insurance Cost</FormLabel>
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
              name="annualMaintenance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Maintenance Costs</FormLabel>
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
              name="managementFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Property Management Fees
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Optional: Annual property management fees</TooltipContent>
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
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onReset}>Reset</Button>
          </div>
        </form>
      </Form>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual Rental Income</span>
                <span className="font-medium">{formatCurrency(results.annualIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual Expenses</span>
                <span className="font-medium">{formatCurrency(results.annualExpenses)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Net Operating Income</span>
                <span>{formatCurrency(results.noi)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cap Rate (Purchase Price)</span>
                <span className="font-medium">{formatPercentage(results.capRatePurchase)}</span>
              </div>
              {results.capRateMarket !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cap Rate (Market Value)</span>
                  <span className="font-medium">{formatPercentage(results.capRateMarket)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {comparableProperties && comparableProperties.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Comparable Properties</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {comparableProperties.map((property: any) => (
              <Card key={property.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase Price</span>
                      <span className="font-medium">{formatCurrency(Number(property.purchasePrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent</span>
                      <span className="font-medium">{formatCurrency(Number(property.monthlyRent))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cap Rate</span>
                      <span className="font-medium">
                        {formatPercentage(calculateCapRate(
                          calculateNOI(
                            Number(property.monthlyRent) * 12,
                            (Number(property.monthlyHoa) * 12) +
                              Number(property.annualTaxes) +
                              Number(property.annualInsurance) +
                              Number(property.annualMaintenance) +
                              Number(property.managementFees)
                          ),
                          Number(property.purchasePrice)
                        ))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8">
        <RiskScoreVisualization
          riskScores={riskScores}
          overallScore={overallRiskScore}
        />
      </div>
    </div>
  );
}

function calculateResults(formValues: PropertyFormData) {
  const purchasePrice = Number(formValues.purchasePrice) || 0;
  const marketValue = Number(formValues.marketValue) || 0;
  const monthlyRent = Number(formValues.monthlyRent) || 0;
  const monthlyHoa = Number(formValues.monthlyHoa) || 0;
  const annualTaxes = Number(formValues.annualTaxes) || 0;
  const annualInsurance = Number(formValues.annualInsurance) || 0;
  const annualMaintenance = Number(formValues.annualMaintenance) || 0;
  const managementFees = Number(formValues.managementFees) || 0;

  const annualIncome = monthlyRent * 12;
  const annualExpenses = (monthlyHoa * 12) + annualTaxes + annualInsurance + annualMaintenance + managementFees;
  const noi = calculateNOI(annualIncome, annualExpenses);
  const capRatePurchase = calculateCapRate(noi, purchasePrice);
  const capRateMarket = marketValue ? calculateCapRate(noi, marketValue) : null;

  return {
    annualIncome,
    annualExpenses,
    noi,
    capRatePurchase,
    capRateMarket
  };
}