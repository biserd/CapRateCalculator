import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function MarketAnalysis() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <LineChart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Market analysis dashboard coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
