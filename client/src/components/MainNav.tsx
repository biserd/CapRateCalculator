import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Building2, Calculator, ChartBar, LineChart } from "lucide-react";

export function MainNav() {
  const [location] = useLocation();

  const navItems = [
    {
      title: "Cap Rate",
      href: "/",
      icon: Building2
    },
    {
      title: "Loan Calculator",
      href: "/loan-calculator",
      icon: Calculator
    },
    {
      title: "Property Comparison",
      href: "/comparison",
      icon: ChartBar
    },
    {
      title: "Market Analysis",
      href: "/market",
      icon: LineChart
    }
  ];

  return (
    <nav className="flex space-x-4 lg:space-x-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                location === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}
