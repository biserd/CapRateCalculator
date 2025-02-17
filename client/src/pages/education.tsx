import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Education() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Investment Education</h1>
        </div>

        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basics">Investment Basics</TabsTrigger>
            <TabsTrigger value="strategies">Investment Strategies</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="financing">Financing Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <Card>
              <CardHeader>
                <CardTitle>Real Estate Investment Basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is Real Estate Investing?</h3>
                  <p className="text-muted-foreground">
                    Real estate investing involves the purchase, ownership, management, rental, and/or sale of real estate for profit.
                    There are several ways to invest in real estate, including buying rental properties, fix-and-flip projects,
                    and real estate investment trusts (REITs).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Types of Real Estate Investments</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Residential Properties</li>
                    <li>Commercial Properties</li>
                    <li>Industrial Properties</li>
                    <li>Land Development</li>
                    <li>REITs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
                  <p className="text-muted-foreground">
                    Before making your first investment, it's important to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                    <li>Understand your financial goals</li>
                    <li>Research your target market</li>
                    <li>Build a strong team (realtor, lender, inspector)</li>
                    <li>Learn about financing options</li>
                    <li>Understand the risks involved</li>
                  </ul>
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
                  <h3 className="text-lg font-semibold mb-2">Buy and Hold</h3>
                  <p className="text-muted-foreground">
                    This strategy involves purchasing properties and holding them for an extended period,
                    generating income through rental payments while the property appreciates in value.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Fix and Flip</h3>
                  <p className="text-muted-foreground">
                    Investors purchase properties that need repairs or updates, renovate them,
                    and then sell them for a profit. Success depends on accurate renovation cost estimates
                    and understanding market values.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">BRRRR Strategy</h3>
                  <p className="text-muted-foreground">
                    Buy, Rehab, Rent, Refinance, Repeat - A method of building a real estate portfolio
                    using the same capital multiple times.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cap Rate</h3>
                  <p className="text-muted-foreground">
                    The capitalization rate is the ratio of a property's net operating income (NOI)
                    to its market value. It helps investors compare different properties and assess
                    their potential returns.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Cash on Cash Return</h3>
                  <p className="text-muted-foreground">
                    This metric measures the ratio of annual pre-tax cash flow to the total amount of
                    cash invested, giving investors a clear picture of their actual return on investment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">ROI</h3>
                  <p className="text-muted-foreground">
                    Return on Investment calculates the efficiency of an investment by dividing the
                    net profit by the total cost of the investment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financing">
            <Card>
              <CardHeader>
                <CardTitle>Financing Your Investments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Traditional Mortgages</h3>
                  <p className="text-muted-foreground">
                    Conventional loans typically require a 20-25% down payment for investment properties.
                    These loans often offer the best interest rates but have strict qualification requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Hard Money Loans</h3>
                  <p className="text-muted-foreground">
                    Short-term loans from private lenders, typically used for fix-and-flip projects.
                    They have higher interest rates but more flexible requirements and faster funding.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Creative Financing</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Seller Financing</li>
                    <li>Private Money Lenders</li>
                    <li>Home Equity Lines of Credit (HELOC)</li>
                    <li>Partnership Structures</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
