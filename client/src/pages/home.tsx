import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CapRateCalculator from "@/components/CapRateCalculator";
import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { calculateCapRate, calculateNOI, formatCurrency, formatPercentage } from "@/lib/calculators";
import { Metadata } from "@/components/Metadata";

export default function Home() {
  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  // Calculate average metrics from properties
  const marketMetrics = properties?.length ? properties.reduce((acc: any, property: any) => {
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
      avgPrice: acc.avgPrice + Number(property.purchasePrice),
      avgRent: acc.avgRent + Number(property.monthlyRent),
      avgCapRate: acc.avgCapRate + capRate,
      count: acc.count + 1
    };
  }, { avgPrice: 0, avgRent: 0, avgCapRate: 0, count: 0 }) : null;

  const averages = marketMetrics ? {
    price: marketMetrics.avgPrice / marketMetrics.count,
    rent: marketMetrics.avgRent / marketMetrics.count,
    capRate: marketMetrics.avgCapRate / marketMetrics.count
  } : null;

  return (
    <>
      <Metadata 
        title="Real Estate Cap Rate Calculator"
        description="Calculate real estate investment returns with our professional cap rate calculator. Make informed investment decisions with accurate property analysis."
        keywords="cap rate calculator, real estate investment, ROI calculator, property analysis"
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Real Estate Cap Rate Calculator</h1>
          </div>

          {averages && (
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Average Property Price
                    </h3>
                    <p className="text-2xl font-bold">
                      {formatCurrency(averages.price)}
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
                      {formatCurrency(averages.rent)}
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
                      {formatPercentage(averages.capRate)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Property Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CapRateCalculator />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}