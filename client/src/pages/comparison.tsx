import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatPercentage, calculateCapRate, calculateNOI } from "@/lib/calculators";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Property } from "@shared/schema";

export default function PropertyComparison() {
  // Fetch all properties for comparison
  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const hasData = properties && properties.length > 0;

  // Transform property data for charts
  const chartData = properties?.map((property) => {
    const noi = calculateNOI(
      Number(property.monthlyRent) * 12,
      (Number(property.monthlyHoa) * 12) +
        Number(property.annualTaxes) +
        Number(property.annualInsurance) +
        Number(property.annualMaintenance) +
        Number(property.managementFees)
    );
    const capRate = calculateCapRate(noi, Number(property.purchasePrice));

    return {
      postcode: property.postcode,
      purchasePrice: Number(property.purchasePrice),
      monthlyRent: Number(property.monthlyRent),
      capRate,
      noi
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ChartBar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Property Comparison</h1>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Compare your properties' performance. Add properties using the Cap Rate Calculator to see the comparison.
          </AlertDescription>
        </Alert>

        {!hasData && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>No property data available. Add properties using the Cap Rate Calculator to see comparisons.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {hasData && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Price Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="postcode" />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Postcode: ${label}`}
                      />
                      <Bar
                        dataKey="purchasePrice"
                        fill="hsl(var(--primary))"
                        name="Purchase Price"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cap Rate Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="postcode" />
                      <YAxis
                        tickFormatter={(value) => `${value.toFixed(2)}%`}
                      />
                      <Tooltip
                        formatter={(value: number) => `${value.toFixed(2)}%`}
                        labelFormatter={(label) => `Postcode: ${label}`}
                      />
                      <Bar
                        dataKey="capRate"
                        fill="hsl(var(--primary))"
                        name="Cap Rate"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Rental Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="postcode" />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Postcode: ${label}`}
                      />
                      <Bar
                        dataKey="monthlyRent"
                        fill="hsl(var(--primary))"
                        name="Monthly Rent"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}