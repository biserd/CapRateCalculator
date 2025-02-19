import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "@/components/Metadata";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Education() {
  return (
    <>
      <Metadata 
        title="Real Estate Investment Education"
        description="Learn real estate investment fundamentals, strategies, and key metrics. Comprehensive guide for both beginners and experienced investors."
        keywords="real estate education, investment strategies, property analysis"
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Real Estate Investment Education</h1>
          </div>

          <Tabs defaultValue="basics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="basics">Fundamentals</TabsTrigger>
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="basics">
              <Card>
                <CardHeader>
                  <CardTitle>Real Estate Investment Fundamentals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible defaultValue="core-concepts" className="w-full">
                    <AccordionItem value="core-concepts">
                      <AccordionTrigger>Core Investment Concepts</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Cash Flow Generation</h4>
                            <p className="text-muted-foreground">Regular income streams from:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Monthly rental payments</li>
                              <li>Additional service fees</li>
                              <li>Parking revenue</li>
                              <li>Property amenities</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Property Appreciation</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Market value growth over time</li>
                              <li>Neighborhood development impact</li>
                              <li>Property improvements</li>
                              <li>Market demand factors</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="market-dynamics">
                      <AccordionTrigger>Market Dynamics</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Supply and Demand</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Population growth trends</li>
                              <li>Local economic indicators</li>
                              <li>Development pipeline</li>
                              <li>Market absorption rates</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Location Analysis</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Neighborhood demographics</li>
                              <li>Infrastructure development</li>
                              <li>Employment centers</li>
                              <li>Amenity proximity</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="financing">
                      <AccordionTrigger>Investment Financing</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Financing Options</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Conventional mortgages</li>
                              <li>Commercial loans</li>
                              <li>Private lending</li>
                              <li>Joint ventures</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Leverage Considerations</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Debt service coverage</li>
                              <li>Interest rate impact</li>
                              <li>Loan-to-value ratios</li>
                              <li>Refinancing strategies</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card>
                <CardHeader>
                  <CardTitle>Essential Investment Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible defaultValue="returns" className="w-full">
                    <AccordionItem value="returns">
                      <AccordionTrigger>Return Metrics</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Capitalization Rate</h4>
                            <p className="text-muted-foreground mt-2">Cap Rate = (NOI / Property Value) × 100%</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Measures property's unleveraged yield</li>
                              <li>Useful for comparing different properties</li>
                              <li>Indicates market risk perception</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Cash on Cash Return</h4>
                            <p className="text-muted-foreground mt-2">CoC Return = (Annual Cash Flow / Total Cash Invested) × 100%</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Measures actual cash yield on investment</li>
                              <li>Accounts for leverage effects</li>
                              <li>Important for cash flow planning</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="operating">
                      <AccordionTrigger>Operating Metrics</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Net Operating Income (NOI)</h4>
                            <p className="text-muted-foreground mt-2">NOI = Total Revenue - Operating Expenses</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Key metric for property valuation</li>
                              <li>Excludes debt service</li>
                              <li>Used in multiple calculations</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Operating Expense Ratio</h4>
                            <p className="text-muted-foreground mt-2">OER = (Operating Expenses / Effective Gross Income) × 100%</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Measures operational efficiency</li>
                              <li>Benchmark for property management</li>
                              <li>Industry comparisons</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Strategies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible defaultValue="value-add" className="w-full">
                    <AccordionItem value="value-add">
                      <AccordionTrigger>Value-Add Strategy</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">Property improvements to increase value and income:</p>
                          <div>
                            <h4 className="font-semibold">Physical Improvements</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Unit renovations</li>
                              <li>Common area upgrades</li>
                              <li>Energy efficiency improvements</li>
                              <li>Amenity additions</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Operational Improvements</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Management optimization</li>
                              <li>Expense reduction</li>
                              <li>Revenue enhancement</li>
                              <li>Marketing improvements</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="buy-hold">
                      <AccordionTrigger>Buy and Hold Strategy</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">Long-term ownership benefits:</p>
                          <div>
                            <h4 className="font-semibold">Income Benefits</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Steady cash flow</li>
                              <li>Rent appreciation</li>
                              <li>Tax advantages</li>
                              <li>Equity building</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Market Position</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Market cycle navigation</li>
                              <li>Portfolio diversification</li>
                              <li>Appreciation capture</li>
                              <li>Inflation hedge</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis & Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible defaultValue="market-risk" className="w-full">
                    <AccordionItem value="market-risk">
                      <AccordionTrigger>Market Risk Factors</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Economic Factors</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Interest rate changes</li>
                              <li>Employment trends</li>
                              <li>Economic cycles</li>
                              <li>Demographic shifts</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Market Conditions</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Supply/demand balance</li>
                              <li>Competitive properties</li>
                              <li>Regulatory changes</li>
                              <li>Market liquidity</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="property-risk">
                      <AccordionTrigger>Property-Specific Risks</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Physical Risks</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Property condition</li>
                              <li>Environmental issues</li>
                              <li>Construction quality</li>
                              <li>Infrastructure age</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Operational Risks</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Tenant quality</li>
                              <li>Management effectiveness</li>
                              <li>Expense control</li>
                              <li>Revenue stability</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Investment Tools</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Cap Rate Calculator</li>
                        <li>Cash Flow Analysis Tools</li>
                        <li>Market Analysis Reports</li>
                        <li>Property Comparison Tools</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Recommended Reading</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Real Estate Investment Analysis</li>
                        <li>Property Valuation Methods</li>
                        <li>Risk Management Strategies</li>
                        <li>Market Research Techniques</li>
                      </ul>
                    </div>
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