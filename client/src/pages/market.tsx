import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartIcon, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calculateCapRate, calculateNOI, formatCurrency, formatPercentage } from "@/lib/calculators";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarketHeatMap } from "@/components/MarketHeatMap";

interface PropertyData {
  monthlyRent: string;
  monthlyHoa: string;
  annualTaxes: string;
  annualInsurance: string;
  annualMaintenance: string;
  managementFees: string;
  purchasePrice: string;
  latitude?: number;
  longitude?: number;
  postcode: string;
}

function calculateAverages(properties: PropertyData[]): { avgPurchasePrice: number; avgMonthlyRent: number; avgCapRate: number } | null {
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

interface HeatMapDataPoint {
  lat: number;
  lng: number;
  price: number;
  rent: number;
  capRate: number;
}

// Add NYC zip codes mapping for better data distribution
const nycZipCodes = {
  'Manhattan': ['10001', '10002', '10003', '10016', '10019', '10021', '10025'],
  'Brooklyn': ['11201', '11215', '11217', '11238', '11249'],
  'Queens': ['11101', '11106', '11354', '11375'],
  'Bronx': ['10451', '10452', '10453', '10456'],
  'Staten Island': ['10301', '10304', '10314']
};

// New York City coordinates (Manhattan)
const NYC_CENTER: [number, number] = [40.7128, -74.0060];

export default function MarketAnalysis() {
  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const marketAverages = calculateAverages(properties || []);
  const hasData = properties && properties.length > 0;

  // Transform property data for heat map
  const heatMapData: HeatMapDataPoint[] = properties ? properties.map((property, index) => {
    // If no coordinates are provided, distribute points across NYC zip codes
    const spread = 0.01; // About 1km spread

    // Use property's postcode if it matches NYC zip codes, otherwise distribute randomly
    let baseLat = NYC_CENTER[0];
    let baseLng = NYC_CENTER[1];


    const lat = baseLat + (Math.random() - 0.5) * spread;
    const lng = baseLng + (Math.random() - 0.5) * spread;

    const noi = calculateNOI(
      Number(property.monthlyRent) * 12,
      (Number(property.monthlyHoa) * 12) +
        Number(property.annualTaxes) +
        Number(property.annualInsurance) +
        Number(property.annualMaintenance) +
        Number(property.managementFees)
    );

    return {
      lat,
      lng,
      price: Number(property.purchasePrice),
      rent: Number(property.monthlyRent),
      capRate: calculateCapRate(noi, Number(property.purchasePrice))
    };
  }) : [];

  // Center map on NYC
  const center: [number, number] = NYC_CENTER;

  // Group properties by postcode for trend analysis
  interface TrendDataPoint {
    postcode: string;
    properties: { price: number; rent: number; capRate: number }[];
  }

  const trendData: TrendDataPoint[] = properties ? properties.reduce((acc: TrendDataPoint[], property: PropertyData) => {
    const existing = acc.find((item) => item.postcode === property.postcode);
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
  }, []) : [];

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-3 mb-6">
        <LineChartIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This analysis uses simulated data based on typical market ratios. Add properties using the Cap Rate Calculator to see your own market analysis.
        </AlertDescription>
      </Alert>

      {!hasData && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No property data available. Add properties using the Cap Rate Calculator to see market analysis.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {marketAverages && (
        <div className="grid gap-4 md:grid-cols-3">
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

      {hasData && (
        <div className="space-y-8">
          <MarketHeatMap
            center={center}
            zoom={13}
            dataPoints={heatMapData}
          />

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
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => `Postcode: ${label}`}
                    />
                    {trendData.map((data, index) => (
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
                      formatter={(value) => `${Number(value).toFixed(2)}%`}
                      labelFormatter={(label) => `Postcode: ${label}`}
                    />
                    {trendData.map((data, index) => (
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
      )}
    </div>
  );
}