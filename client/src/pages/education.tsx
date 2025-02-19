
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "@/components/Metadata";

export default function Education() {
  return (
    <>
      <Metadata 
        title="Investment Education"
        description="Learn real estate investment fundamentals, strategies, and key metrics. Comprehensive guide for both beginners and experienced investors."
        keywords="real estate education, investment strategies, property analysis"
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Investment Education</h1>
          </div>

          <Tabs defaultValue="basics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basics">Investment Basics</TabsTrigger>
              <TabsTrigger value="formulas">Key Formulas</TabsTrigger>
              <TabsTrigger value="strategies">Investment Strategies</TabsTrigger>
              <TabsTrigger value="metrics">Risk Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="basics">
              <Card>
                <CardHeader>
                  <CardTitle>Real Estate Investment Fundamentals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Core Investment Concepts</h3>
                    <p className="text-muted-foreground">
                      Real estate investing involves generating returns through property ownership via two primary methods:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                      <li>Cash Flow: Regular income from rental payments</li>
                      <li>Appreciation: Increase in property value over time</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Income Components</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Rental Income: Primary source of cash flow</li>
                      <li>Additional Income: Parking, laundry, etc.</li>
                      <li>Tax Benefits: Depreciation and deductions</li>
                      <li>Equity Building: Through mortgage paydown</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Expense Categories</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Operating Expenses: Utilities, maintenance, insurance</li>
                      <li>Fixed Expenses: Property taxes, HOA fees</li>
                      <li>Capital Expenditures: Major repairs and improvements</li>
                      <li>Financing Costs: Mortgage payments and interest</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="formulas">
              <Card>
                <CardHeader>
                  <CardTitle>Essential Investment Formulas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Capitalization Rate (Cap Rate)</h3>
                    <div className="bg-secondary p-4 rounded-md">
                      <p className="font-mono">Cap Rate = (NOI / Property Value) × 100%</p>
                      <p className="font-mono mt-2">NOI = Annual Income - Operating Expenses</p>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      The Cap Rate indicates the potential return on investment, unaffected by financing. A higher cap rate typically suggests higher risk and potential return.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cash on Cash Return</h3>
                    <div className="bg-secondary p-4 rounded-md">
                      <p className="font-mono">CoC Return = (Annual Cash Flow / Total Cash Invested) × 100%</p>
                      <p className="font-mono mt-2">Annual Cash Flow = NOI - Debt Service</p>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      Cash on Cash Return measures the cash income earned on the cash invested in a property, considering financing.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Debt Service Coverage Ratio (DSCR)</h3>
                    <div className="bg-secondary p-4 rounded-md">
                      <p className="font-mono">DSCR = NOI / Annual Debt Service</p>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      DSCR measures the property's ability to cover its debt payments. A ratio above 1.25 is typically preferred by lenders.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Strategies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Value-Add Strategy</h3>
                    <p className="text-muted-foreground">
                      Purchase properties below market value and increase their worth through improvements:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                      <li>Renovations and upgrades</li>
                      <li>Operational efficiency improvements</li>
                      <li>Increasing rental income</li>
                      <li>Reducing operating expenses</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Buy and Hold</h3>
                    <p className="text-muted-foreground">
                      Long-term ownership strategy focusing on:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                      <li>Steady cash flow generation</li>
                      <li>Property appreciation</li>
                      <li>Equity building through mortgage paydown</li>
                      <li>Tax advantages</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Market Timing</h3>
                    <p className="text-muted-foreground">
                      Strategies for different market cycles:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                      <li>Buyer's Market: Focus on acquisitions</li>
                      <li>Seller's Market: Consider strategic dispositions</li>
                      <li>Balanced Market: Emphasis on operations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Market Risk Factors</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Economic conditions and employment trends</li>
                      <li>Supply and demand dynamics</li>
                      <li>Demographic shifts</li>
                      <li>Local market regulations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Property-Specific Risks</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Physical condition and age</li>
                      <li>Location and neighborhood factors</li>
                      <li>Tenant quality and vacancy risk</li>
                      <li>Operating expense volatility</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Risk Mitigation Strategies</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Thorough due diligence</li>
                      <li>Professional property management</li>
                      <li>Adequate insurance coverage</li>
                      <li>Conservative underwriting assumptions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
