import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export default function LoanCalculator() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Loan Calculator</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mortgage Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loan calculator coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
