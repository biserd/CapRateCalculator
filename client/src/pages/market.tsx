import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as LineChartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calculateCapRate, calculateNOI, formatCurrency, formatPercentage } from "@/lib/calculators";

function calculateAverages(properties: any[]) {
  if (!properties?.length) return null;

  const totals = properties.reduce((acc, property) => {
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
      purchasePrice: acc.purchasePrice + Number(property.purchasePrice),
      monthlyRent: acc.monthlyRent + Number(property.monthlyRent),
      capRate: acc.capRate + capRate,
      count: acc.count + 1
    };
  }, { purchasePrice: 0, monthlyRent: 0, capRate: 0, count: 0 });

  return {
    avgPurchasePrice: totals.purchasePrice / totals.count,
    avgMonthlyRent: totals.monthlyRent / totals.count,
    avgCapRate: totals.capRate / totals.count
  };
}

export default function MarketAnalysis() {
  // Fetch all properties for market analysis
  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const marketAverages = calculateAverages(properties);

  // Group properties by postcode for trend analysis
  const trendData = properties?.reduce((acc: any, property: any) => {
    const existing = acc.find((item: any) => item.postcode === property.postcode);
    const noi = calculateNOI(
      Number(property.monthlyRent) * 12,
      (Number(property.monthlyHoa) * 12) +
        Number(property.annualTaxes) +
        Number(property.annualInsurance) +
        Number(property.annualMaintenance) +
        Number(property.managementFees)
    );
    const capRate = calculateCapRate(noi, Number(property.purchasePrice));

    if (existing) {
      existing.properties.push({
        price: Number(property.purchasePrice),
        rent: Number(property.monthlyRent),
        capRate
      });
    } else {
      acc.push({
        postcode: property.postcode,
        properties: [{
          price: Number(property.purchasePrice),
          rent: Number(property.monthlyRent),
          capRate
        }]
      });
    }
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <LineChartIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
        </div>

        {marketAverages && (
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Average Purchase Price
                  </h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(marketAverages.avgPurchasePrice)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Average Monthly Rent
                  </h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(marketAverages.avgMonthlyRent)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Average Cap Rate
                  </h3>
                  <p className="text-2xl font-bold">
                    {formatPercentage(marketAverages.avgCapRate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends by Postcode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="postcode" />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(value)}
                      labelFormatter={(label) => `Postcode: ${label}`}
                    />
                    {trendData.map((data: any, index: number) => (
                      <Line
                        key={index}
                        type="monotone"
                        dataKey="properties[0].price"
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        name={`Price (${data.postcode})`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cap Rate Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="postcode" />
                    <YAxis
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                    />
                    <Tooltip
                      formatter={(value: any) => `${Number(value).toFixed(2)}%`}
                      labelFormatter={(label) => `Postcode: ${label}`}
                    />
                    {trendData.map((data: any, index: number) => (
                      <Line
                        key={index}
                        type="monotone"
                        dataKey="properties[0].capRate"
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        name={`Cap Rate (${data.postcode})`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}