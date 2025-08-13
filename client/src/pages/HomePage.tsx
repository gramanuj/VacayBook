import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardData {
  summary: {
    totalRevenue: number;
    totalBookings: number;
    totalHours: number;
    averageOccupancyRate: number;
  };
  roomStats: Array<{
    id: number;
    name: string;
    totalBookings: number;
    totalHours: number;
    revenue: number;
    occupancyRate: number;
  }>;
}

export default function HomePage() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/analytics/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">
            Conference Rooms
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage and book meeting spaces
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/rooms">
            <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700" data-testid="button-browse-rooms">
              <div className="flex flex-col items-center">
                <Users className="h-6 w-6 mb-1" />
                <span className="text-sm">Browse Rooms</span>
              </div>
            </Button>
          </Link>
          <Link to="/bookings">
            <Button variant="outline" className="w-full h-16" data-testid="button-my-bookings">
              <div className="flex flex-col items-center">
                <Calendar className="h-6 w-6 mb-1" />
                <span className="text-sm">My Bookings</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        {dashboardData && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                      <p className="text-lg font-bold text-blue-900" data-testid="stat-total-bookings">
                        {dashboardData.summary.totalBookings}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm text-green-600 font-medium">Hours Booked</p>
                      <p className="text-lg font-bold text-green-900" data-testid="stat-total-hours">
                        {dashboardData.summary.totalHours}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm text-purple-600 font-medium">Occupancy</p>
                      <p className="text-lg font-bold text-purple-900" data-testid="stat-occupancy-rate">
                        {Math.round(dashboardData.summary.averageOccupancyRate)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-orange-600" />
                    <div className="ml-3">
                      <p className="text-sm text-orange-600 font-medium">Revenue</p>
                      <p className="text-lg font-bold text-orange-900" data-testid="stat-revenue">
                        ${(dashboardData.summary.totalRevenue / 100).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Link to="/analytics" className="block">
              <Button variant="outline" className="w-full" data-testid="button-view-analytics">
                View Detailed Analytics
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}