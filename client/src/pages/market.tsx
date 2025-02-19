import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartIcon, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calculateCapRate, calculateNOI, formatCurrency, formatPercentage } from "@/lib/calculators";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarketHeatMap } from "@/components/MarketHeatMap";
import { Metadata } from "@/components/Metadata";

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

// Add NYC zip codes mapping for better data distribution
const nycZipCodes = {
  'Manhattan': ['10001', '10002', '10003', '10016', '10019', '10021', '10025'],
  'Brooklyn': ['11201', '11215', '11217', '11238', '11249'],
  'Queens': ['11101', '11106', '11354', '11375'],
  'Bronx': ['10451', '10452', '10453', '10456'],
  'Staten Island': ['10301', '10304', '10314']
};

// Add NYC zip code coordinates mapping
const nycZipCodeCoordinates: Record<string, [number, number]> = {
  // Manhattan
  '10001': [40.7503, -73.9965], // Chelsea
  '10002': [40.7168, -73.9861], // Lower East Side
  '10003': [40.7335, -73.9905], // East Village
  '10016': [40.7461, -73.9784], // Murray Hill
  '10019': [40.7641, -73.9866], // Midtown West
  '10021': [40.7695, -73.9633], // Upper East Side
  '10025': [40.7989, -73.9680], // Upper West Side
  // Brooklyn
  '11201': [40.6935, -73.9916], // Brooklyn Heights
  '11215': [40.6628, -73.9861], // Park Slope
  '11217': [40.6829, -73.9790], // Boerum Hill
  '11238': [40.6795, -73.9665], // Prospect Heights
  '11249': [40.7138, -73.9613], // Williamsburg
  // Queens
  '11101': [40.7505, -73.9393], // Long Island City
  '11106': [40.7621, -73.9320], // Astoria
  '11354': [40.7680, -73.8279], // Flushing
  '11375': [40.7210, -73.8458], // Forest Hills
  // Bronx
  '10451': [40.8200, -73.9256], // South Bronx
  '10452': [40.8405, -73.9234], // West Bronx
  '10453': [40.8518, -73.9120], // University Heights
  '10456': [40.8297, -73.9065], // Morrisania
  // Staten Island
  '10301': [40.6424, -74.0987], // St. George
  '10304': [40.6097, -74.0910], // Stapleton
  '10314': [40.6090, -74.1468]  // Bulls Head
};

// New York City coordinates (Manhattan)
const NYC_CENTER: [number, number] = [40.7128, -74.0060];

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

export default function MarketAnalysis() {
  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const marketAverages = calculateAverages(properties || []);
  const hasData = properties && properties.length > 0;

  // Transform property data for heat map
  const heatMapData: HeatMapDataPoint[] = properties ? properties.map((property, index) => {
    // If no coordinates are provided, distribute points across NYC zip codes
    const spread = 0.001; // Reduced spread for better clustering

    // Get all available zip codes
    const allZipCodes = Object.values(nycZipCodes).flat();

    // Use property's postcode if it matches NYC zip codes, otherwise use a random NYC zip code
    const zipCode = allZipCodes.includes(property.postcode)
      ? property.postcode
      : allZipCodes[index % allZipCodes.length];

    // Get base coordinates for the zip code
    const baseCoords = nycZipCodeCoordinates[zipCode] || NYC_CENTER;

    // Add some random spread around the base coordinates
    const lat = baseCoords[0] + (Math.random() - 0.5) * spread;
    const lng = baseCoords[1] + (Math.random() - 0.5) * spread;

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
    <>
      <Metadata 
        title="Market Analysis"
        description="Analyze real estate market trends, property values, and investment opportunities. Data-driven insights for your investment decisions."
        keywords="real estate market analysis, property trends, investment opportunities"
      />
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
    </>
  );
}