import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PortfolioDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Portfolio management features coming soon! Track your entire real estate investment portfolio in one place.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Investment Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This dashboard will provide comprehensive portfolio management including:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
              <li>Total portfolio value and ROI tracking</li>
              <li>Property performance comparisons</li>
              <li>Investment goal progress</li>
              <li>Cash flow summaries</li>
              <li>Risk analysis and diversification metrics</li>
              <li>Portfolio optimization recommendations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
