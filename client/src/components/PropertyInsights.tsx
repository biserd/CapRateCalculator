
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [shouldGenerate, setShouldGenerate] = useState(false);

  const { data: insights, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/properties/insights', propertyDetails],
    queryFn: async () => {
      if (isLoading) return null;
      const response = await fetch('/api/properties/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch property insights');
      }

      return response.json();
    },
    enabled: shouldGenerate,
    retry: false,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate property insights. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateInsights = () => {
    setShouldGenerate(true);
    refetch();
  };

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

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Property Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Unable to generate AI insights at this time. This could be due to service limitations or high demand.
              Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Property Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-muted-foreground">Click the button below to generate AI insights for this property.</p>
            <Button onClick={handleGenerateInsights} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate AI Insights"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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

          <div className="flex justify-center pt-4">
            <Button onClick={handleGenerateInsights}>Regenerate Insights</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
