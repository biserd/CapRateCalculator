import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { PropertyReport } from "@/components/PropertyReport";
import { PDFViewer } from "@react-pdf/renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "@/components/Metadata";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";

export default function SharedReport() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: report, isLoading, error } = useQuery({
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

  const handleEditReport = () => {
    // Store the report data in sessionStorage for home page to access
    if (report?.propertyData?.formData) {
      sessionStorage.setItem('sharedReport', JSON.stringify(report.propertyData.formData));
      setLocation('/');
      toast({
        title: "Report Loaded",
        description: "The shared report data has been loaded into the calculator.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Loading Report...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                Loading shared property analysis...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Report Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                This shared report doesn't exist or has expired.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Metadata
        title="Shared Property Analysis Report"
        description="View a shared property analysis report with detailed financial metrics and market comparisons."
        keywords="property analysis, shared report, real estate investment"
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-end">
            <Button onClick={handleEditReport} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit in Calculator
            </Button>
          </div>
          <PDFViewer style={{ width: '100%', height: '90vh' }}>
            <PropertyReport {...report.propertyData} />
          </PDFViewer>
        </div>
      </div>
    </>
  );
}