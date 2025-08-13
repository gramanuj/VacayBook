import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Clock, DollarSign, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  popularTimes: Array<{
    hour: number;
    bookings: number;
  }>;
}

export default function AnalyticsPage() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/analytics/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm px-4 py-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Conference room usage insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {dashboardData && (
        <div className="p-4 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                    <p className="text-xl font-bold text-blue-900" data-testid="stat-total-bookings">
                      {dashboardData.summary.totalBookings}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-600 font-medium">Hours Booked</p>
                    <p className="text-xl font-bold text-green-900" data-testid="stat-total-hours">
                      {dashboardData.summary.totalHours}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-purple-600 font-medium">Avg. Occupancy</p>
                    <p className="text-xl font-bold text-purple-900" data-testid="stat-occupancy">
                      {Math.round(dashboardData.summary.averageOccupancyRate)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-600 font-medium">Total Revenue</p>
                    <p className="text-xl font-bold text-orange-900" data-testid="stat-revenue">
                      ${Math.round(dashboardData.summary.totalRevenue / 100)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Room Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.roomStats
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`room-stat-${room.id}`}>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900" data-testid={`room-name-${room.id}`}>
                          {room.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="mr-4" data-testid={`room-bookings-${room.id}`}>
                            {room.totalBookings} bookings
                          </span>
                          <span data-testid={`room-hours-${room.id}`}>
                            {room.totalHours}h total
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600" data-testid={`room-revenue-${room.id}`}>
                          ${Math.round(room.revenue / 100)}
                        </div>
                        <div className="text-sm text-gray-500" data-testid={`room-occupancy-${room.id}`}>
                          {Math.round(room.occupancyRate)}% occupied
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Booking Times */}
          {dashboardData.popularTimes && dashboardData.popularTimes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Booking Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.popularTimes.map((timeSlot, index) => (
                    <div key={timeSlot.hour} className="flex items-center" data-testid={`time-slot-${timeSlot.hour}`}>
                      <div className="w-12 text-sm text-gray-600" data-testid={`time-label-${timeSlot.hour}`}>
                        {formatHour(timeSlot.hour)}
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (timeSlot.bookings / Math.max(...dashboardData.popularTimes.map(t => t.bookings))) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-8 text-sm text-gray-900 text-right" data-testid={`booking-count-${timeSlot.hour}`}>
                        {timeSlot.bookings}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-900">
                    Average occupancy rate is {Math.round(dashboardData.summary.averageOccupancyRate)}%
                  </span>
                </div>
                
                {dashboardData.roomStats.length > 0 && (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Users className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-green-900">
                      Most popular room: {dashboardData.roomStats
                        .sort((a, b) => b.totalBookings - a.totalBookings)[0]?.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-purple-900">
                    Total of {dashboardData.summary.totalHours} hours booked across all rooms
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}