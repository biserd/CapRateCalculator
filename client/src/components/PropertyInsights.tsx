import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyDetails {
  purchasePrice: number;
  monthlyRent: number;
  location: string;
  propertyType: string;
  squareFootage: number;
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
  propertyCondition: string;
}

interface ValuationInsights {
  marketValueEstimate: string;
  confidenceScore: number;
  keyFactors: string[];
  recommendations: string[];
  marketTrends: string;
  riskAssessment: string;
  comparableProperties: string;
}

export function PropertyInsights({ propertyDetails }: { propertyDetails: PropertyDetails }) {
  const { toast } = useToast();
  
  const { data: insights, isLoading, error } = useQuery<ValuationInsights>({
    queryKey: ['/api/properties/insights', propertyDetails],
    queryFn: async () => {
      const response = await fetch('/api/properties/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyDetails),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch property insights');
      }
      
      return response.json();
    },
    enabled: Boolean(propertyDetails),
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate property insights. Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Property Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Property Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Market Value Estimate</h3>
            <p className="text-muted-foreground">{insights.marketValueEstimate}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Confidence Score: {(insights.confidenceScore * 100).toFixed(1)}%
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Key Factors</h3>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              {insights.keyFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Investment Recommendations</h3>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              {insights.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Market Trends</h3>
            <p className="text-muted-foreground">{insights.marketTrends}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Risk Assessment</h3>
            <p className="text-muted-foreground">{insights.riskAssessment}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Comparable Properties</h3>
            <p className="text-muted-foreground">{insights.comparableProperties}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
