import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { PropertyReport } from "@/components/PropertyReport";
import { PDFViewer } from "@react-pdf/renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "@/components/Metadata";

export default function SharedReport() {
  const { id } = useParams();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["/api/reports/share", id],
    enabled: Boolean(id),
  });

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
          <PDFViewer style={{ width: '100%', height: '90vh' }}>
            <PropertyReport {...report.propertyData} />
          </PDFViewer>
        </div>
      </div>
    </>
  );
}
