import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@material-tailwind/react";

export default function SharedReport() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const { isLoading, error, data: report } = useQuery({
    queryKey: ["/api/reports/share", id],
    queryFn: async () => {
      const response = await fetch(`/api/reports/share/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      return response.json();
    },
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 flex items-center justify-center">
            Loading shared property analysis...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 flex items-center justify-center">
            This shared report doesn't exist or has expired.
          </div>
        </div>
      </div>
    );
  }

  // Store the report data and redirect to calculator
  if (report?.propertyData) {
    sessionStorage.setItem('sharedReport', JSON.stringify({
      formData: report.propertyData.formData,
      aiInsights: report.propertyData.aiInsights
    }));
    setLocation('/');
    toast({
      title: "Report Loaded",
      description: "The shared report data has been loaded into the calculator.",
    });
  }


  return (
    <div>
      {report && report.propertyData && (
        <Card>
          <CardHeader>
            <CardTitle>AI Property Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Market Value Estimate</h3>
                <p className="text-muted-foreground">{report.propertyData.aiInsights.marketValueEstimate}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Confidence Score: {(report.propertyData.aiInsights.confidenceScore * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Key Factors</h3>
                <ul className="mt-2 space-y-1">
                  {report.propertyData.aiInsights.keyFactors.map((factor, i) => (
                    <li key={i} className="text-muted-foreground">• {factor}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Recommendations</h3>
                <ul className="mt-2 space-y-1">
                  {report.propertyData.aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="text-muted-foreground">• {rec}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Market Trends</h3>
                <p className="text-muted-foreground">{report.propertyData.aiInsights.marketTrends}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Risk Assessment</h3>
                <p className="text-muted-foreground">{report.propertyData.aiInsights.riskAssessment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}