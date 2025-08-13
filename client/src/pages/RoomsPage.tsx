import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Users, MapPin, DollarSign, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { data: rooms = [], isLoading } = useQuery<ConferenceRoom[]>({
    queryKey: ["/api/conference-rooms"],
  });

  const filteredAndSortedRooms = rooms
    .filter((room) => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           room.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCapacity = capacityFilter === "" || 
        (capacityFilter === "small" && room.capacity <= 6) ||
        (capacityFilter === "medium" && room.capacity > 6 && room.capacity <= 15) ||
        (capacityFilter === "large" && room.capacity > 15);
      
      return matchesSearch && matchesCapacity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "capacity":
          return a.capacity - b.capacity;
        case "price":
          return a.hourlyRate - b.hourlyRate;
        default:
          return a.name.localeCompare(b.name);
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">
            Conference Rooms
          </h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search rooms or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger className="flex-1" data-testid="select-capacity">
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sizes</SelectItem>
                <SelectItem value="small">Small (≤6)</SelectItem>
                <SelectItem value="medium">Medium (7-15)</SelectItem>
                <SelectItem value="large">Large (16+)</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="capacity">Capacity</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600" data-testid="text-results-count">
            {filteredAndSortedRooms.length} room{filteredAndSortedRooms.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="space-y-4">
          {filteredAndSortedRooms.map((room) => (
            <Link key={room.id} to={`/rooms/${room.id}`}>
              <Card className="hover:shadow-md transition-shadow" data-testid={`card-room-${room.id}`}>
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Room Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover rounded-l-lg"
                        data-testid={`img-room-${room.id}`}
                      />
                    </div>
                    
                    {/* Room Details */}
                    <div className="flex-1 p-3 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate" data-testid={`text-room-name-${room.id}`}>
                            {room.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate" data-testid={`text-room-location-${room.id}`}>
                              {room.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <DollarSign className="h-3 w-3" />
                            <span data-testid={`text-room-price-${room.id}`}>
                              {room.hourlyRate / 100}/hr
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Capacity and Amenities */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-3 w-3 mr-1" />
                          <span data-testid={`text-room-capacity-${room.id}`}>
                            {room.capacity} people
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 2).map((amenity) => (
                            <Badge
                              key={amenity}
                              variant="secondary"
                              className="text-xs px-1.5 py-0.5"
                              data-testid={`badge-amenity-${room.id}`}
                            >
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0.5"
                              data-testid={`badge-more-amenities-${room.id}`}
                            >
                              +{room.amenities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredAndSortedRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No rooms found</h3>
            <p className="text-gray-600 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}