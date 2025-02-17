import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdvancedAnalysis() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analysis</h1>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Advanced analysis tools coming soon! Get deeper insights into your investment opportunities.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Financial Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will provide advanced analysis tools including:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
              <li>After-Repair Value (ARV) Calculator</li>
              <li>Fix-and-Flip Profit Projections</li>
              <li>Detailed Cash Flow Analysis with Vacancy Rates</li>
              <li>Tax Benefits Calculator</li>
              <li>Investment Strategy Optimization</li>
              <li>Risk Assessment Tools</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
