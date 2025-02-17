import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MainNav } from "@/components/MainNav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LoanCalculator from "@/pages/loan-calculator";
import PropertyComparison from "@/pages/comparison";
import MarketAnalysis from "@/pages/market";

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
        <Route path="/loan-calculator" component={LoanCalculator} />
        <Route path="/comparison" component={PropertyComparison} />
        <Route path="/market" component={MarketAnalysis} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;