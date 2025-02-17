import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CapRateCalculator from "@/components/CapRateCalculator";
import { Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Cap Rate Calculator</h1>
        </div>
        
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
  );
}
