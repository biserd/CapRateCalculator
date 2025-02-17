import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { InfoIcon } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskScore {
  marketRisk: number;
  financialRisk: number;
  propertyCondition: number;
  locationRisk: number;
  tenantRisk: number;
}

interface RiskScoreVisualizationProps {
  riskScores: RiskScore;
  overallScore: number;
}

const riskDescriptions = {
  marketRisk: "Measures market volatility, price trends, and supply/demand dynamics",
  financialRisk: "Evaluates cash flow stability, debt service coverage, and financial leverage",
  propertyCondition: "Assesses property age, maintenance needs, and potential repair costs",
  locationRisk: "Analyzes neighborhood trends, crime rates, and economic factors",
  tenantRisk: "Considers tenant quality, vacancy rates, and rental market conditions"
};

export function RiskScoreVisualization({ riskScores, overallScore }: RiskScoreVisualizationProps) {
  const data = [
    { subject: 'Market Risk', value: riskScores.marketRisk },
    { subject: 'Financial Risk', value: riskScores.financialRisk },
    { subject: 'Property Condition', value: riskScores.propertyCondition },
    { subject: 'Location Risk', value: riskScores.locationRisk },
    { subject: 'Tenant Risk', value: riskScores.tenantRisk },
  ];

  const getRiskLevel = (score: number) => {
    if (score <= 3) return "Low Risk";
    if (score <= 6) return "Moderate Risk";
    return "High Risk";
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return "text-green-600";
    if (score <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Property Risk Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Overall Risk Score:</span>
            <span className={`text-lg font-bold ${getRiskColor(overallScore)}`}>
              {overallScore.toFixed(1)} - {getRiskLevel(overallScore)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                  name="Risk Score"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Risk Factors Breakdown</h3>
            {Object.entries(riskScores).map(([key, value]) => {
              const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
              const description = riskDescriptions[key as keyof RiskScore];
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formattedKey}</span>
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{description}</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                    <span className={`font-semibold ${getRiskColor(value)}`}>
                      {value.toFixed(1)} - {getRiskLevel(value)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
