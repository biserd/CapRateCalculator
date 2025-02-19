import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function SharedReport() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const { isLoading, error } = useQuery({
    queryKey: ["/api/reports/share", id],
    queryFn: async () => {
      const response = await fetch(`/api/reports/share/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const report = await response.json();

      // Store the report data and redirect to calculator
      if (report?.propertyData?.formData) {
        sessionStorage.setItem('sharedReport', JSON.stringify(report.propertyData.formData));
        setLocation('/');
        toast({
          title: "Report Loaded",
          description: "The shared report data has been loaded into the calculator.",
        });
      }
      return report;
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

  return null;
}