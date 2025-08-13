import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Users, BarChart3, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/rooms", icon: Users, label: "Rooms" },
  { path: "/bookings", icon: CalendarCheck, label: "Bookings" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-lg transition-colors",
                "text-xs font-medium space-y-1 min-w-[60px]",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}