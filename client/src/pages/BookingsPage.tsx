import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, MapPin, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: number;
  conferenceRoomId: number;
  organizerName: string;
  organizerEmail: string;
  purpose: string;
  attendeesCount: number;
  startTime: string;
  endTime: string;
  totalCost: number;
  status: string;
  notes?: string;
  createdAt: string;
  conferenceRoom?: {
    name: string;
    location: string;
  };
}

export default function BookingsPage() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm px-4 py-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">
                My Bookings
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link to="/rooms">
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-new-booking">
                New Booking
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 text-sm mb-6">
              Start by booking your first conference room
            </p>
            <Link to="/rooms">
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-browse-rooms">
                Browse Rooms
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="shadow-sm" data-testid={`card-booking-${booking.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900" data-testid={`text-booking-purpose-${booking.id}`}>
                        {booking.purpose}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span data-testid={`text-booking-room-${booking.id}`}>
                          {booking.conferenceRoom?.name || 'Conference Room'}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      className={getStatusColor(booking.status)}
                      data-testid={`badge-status-${booking.id}`}
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span data-testid={`text-booking-date-${booking.id}`}>
                          {formatDate(booking.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span data-testid={`text-booking-time-${booking.id}`}>
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Users className="h-3 w-3 mr-1" />
                        <span data-testid={`text-booking-attendees-${booking.id}`}>
                          {booking.attendeesCount} attendee{booking.attendeesCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-green-600 font-medium">
                        <span data-testid={`text-booking-cost-${booking.id}`}>
                          ${booking.totalCost / 100}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Notes:</strong> <span data-testid={`text-booking-notes-${booking.id}`}>{booking.notes}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Booked by <span className="font-medium" data-testid={`text-booking-organizer-${booking.id}`}>
                        {booking.organizerName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'confirmed' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-edit-${booking.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-cancel-${booking.id}`}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}