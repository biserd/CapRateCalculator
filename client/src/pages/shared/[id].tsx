import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

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

  useEffect(() => {
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
  }, [report, setLocation, toast]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="h-96 flex items-center justify-center">
          Loading calculator...
        </div>
      </div>
    </div>
  );
}