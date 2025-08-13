import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, MapPin, DollarSign, Wifi, Coffee, Monitor, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConferenceRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  description: string;
  amenities: string[];
  hourlyRate: number;
  imageUrl: string;
  isActive: boolean;
}

const amenityIcons: Record<string, any> = {
  "WiFi": Wifi,
  "Coffee Service": Coffee,
  "Projector": Monitor,
  "TV Display": Monitor,
  "Video Conferencing": Monitor,
  "Phone": Phone,
  "Conference Phone": Phone,
  "Whiteboard": Monitor,
  "Smart Board": Monitor,
};

export default function RoomDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: room, isLoading, error } = useQuery<ConferenceRoom>({
    queryKey: [`/api/conference-rooms/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm px-4 py-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Room not found</h2>
          <p className="text-gray-600 mb-4">The conference room you're looking for doesn't exist.</p>
          <Link to="/rooms">
            <Button data-testid="button-back-to-rooms">Back to Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <Link to="/rooms" className="mr-3" data-testid="button-back">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-room-name">
                {room.name}
              </h1>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span data-testid="text-room-location">{room.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Room Image */}
        <div className="relative">
          <img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-48 object-cover rounded-lg shadow-sm"
            data-testid="img-room-main"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-black/75 text-white border-0">
              <Users className="h-3 w-3 mr-1" />
              <span data-testid="badge-capacity">{room.capacity} people</span>
            </Badge>
          </div>
        </div>

        {/* Pricing */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hourly Rate</p>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600" data-testid="text-hourly-rate">
                    {room.hourlyRate / 100}
                  </span>
                  <span className="text-gray-600 ml-1">/hour</span>
                </div>
              </div>
              <Link to={`/book/${room.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-book-now">
                  Book Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed" data-testid="text-room-description">
              {room.description}
            </p>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {room.amenities.map((amenity, index) => {
                const IconComponent = amenityIcons[amenity] || Monitor;
                return (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                    data-testid={`amenity-${index}`}
                  >
                    <IconComponent className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-900 font-medium">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Room Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Room Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity</span>
                <span className="font-medium" data-testid="spec-capacity">{room.capacity} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium" data-testid="spec-location">{room.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hourly Rate</span>
                <span className="font-medium text-green-600" data-testid="spec-rate">
                  ${room.hourlyRate / 100}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge 
                  variant={room.isActive ? "default" : "secondary"}
                  data-testid="badge-status"
                >
                  {room.isActive ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book Button (Fixed at Bottom) */}
        <div className="fixed bottom-20 left-4 right-4">
          <Link to={`/book/${room.id}`}>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-medium shadow-lg"
              data-testid="button-book-room"
            >
              Book This Room
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}