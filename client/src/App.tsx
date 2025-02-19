import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { MainNav } from "@/components/MainNav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ROICalculator from "@/pages/roi-calculator";
import TaxCalculator from "@/pages/tax-calculator";
import LoanCalculator from "@/pages/loan-calculator";
import PropertyComparison from "@/pages/comparison";
import MarketAnalysis from "@/pages/market";
import LocationAnalysis from "@/pages/location";
import PortfolioDashboard from "@/pages/portfolio";
import AdvancedAnalysis from "@/pages/advanced";
import Education from "@/pages/education";
import SharedReport from "@/pages/shared/[id]";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/roi-calculator" component={ROICalculator} />
        <Route path="/tax-calculator" component={TaxCalculator} />
        <Route path="/loan-calculator" component={LoanCalculator} />
        <Route path="/comparison" component={PropertyComparison} />
        <Route path="/market" component={MarketAnalysis} />
        <Route path="/location" component={LocationAnalysis} />
        <Route path="/portfolio" component={PortfolioDashboard} />
        <Route path="/advanced" component={AdvancedAnalysis} />
        <Route path="/education" component={Education} />
        <Route path="/shared/:id" component={SharedReport} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;