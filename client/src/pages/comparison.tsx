import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

export default function PropertyComparison() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ChartBar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Property Comparison</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Comparative Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Property comparison charts coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
