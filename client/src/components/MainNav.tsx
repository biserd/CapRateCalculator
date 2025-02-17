import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Building2, Calculator, ChartBar, LineChart, 
  MapPin, PieChart, TrendingUp, GraduationCap 
} from "lucide-react";

export function MainNav() {
  const [location] = useLocation();

  const navItems = [
    {
      title: "Analysis Tools",
      items: [
        {
          title: "Cap Rate Calculator",
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
      ]
    },
    {
      title: "Investment Tools",
      items: [
        {
          title: "Location Analysis",
          href: "/location",
          icon: MapPin
        },
        {
          title: "Portfolio Dashboard",
          href: "/portfolio",
          icon: PieChart
        },
        {
          title: "Advanced Analysis",
          href: "/advanced",
          icon: TrendingUp
        }
      ]
    },
    {
      title: "Education",
      items: [
        {
          title: "Investment Guide",
          href: "/education",
          icon: GraduationCap
        }
      ]
    }
  ];

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map((section) => (
        <div key={section.title} className="relative group">
          <span className="text-sm font-medium text-muted-foreground cursor-default">
            {section.title}
          </span>
          <div className="absolute left-0 top-full pt-2 w-48 hidden group-hover:block z-50">
            <div className="bg-background rounded-md shadow-lg border p-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 text-sm rounded-sm hover:bg-accent",
                        location === item.href
                          ? "text-primary bg-accent"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}