import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, List, ChevronDown } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [priceRange, setPriceRange] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const handleFilterChange = (filterType: string, value: string) => {
    const filters: any = {};
    
    if (filterType === "priceRange") {
      setPriceRange(value);
      if (value === "Under $1,000") {
        filters.priceMax = 100000;
      } else if (value === "$1,000 - $2,000") {
        filters.priceMin = 100000;
        filters.priceMax = 200000;
      } else if (value === "$2,000 - $5,000") {
        filters.priceMin = 200000;
        filters.priceMax = 500000;
      } else if (value === "Over $5,000") {
        filters.priceMin = 500000;
      }
    } else if (filterType === "duration") {
      setDuration(value);
      if (value !== "all") {
        filters.duration = value;
      }
    } else if (filterType === "type") {
      setType(value);
      if (value !== "all") {
        filters.type = value;
      }
    }

    // Include existing filters
    if (priceRange && filterType !== "priceRange" && priceRange !== "all") {
      if (priceRange === "Under $1,000") {
        filters.priceMax = 100000;
      } else if (priceRange === "$1,000 - $2,000") {
        filters.priceMin = 100000;
        filters.priceMax = 200000;
      } else if (priceRange === "$2,000 - $5,000") {
        filters.priceMin = 200000;
        filters.priceMax = 500000;
      } else if (priceRange === "Over $5,000") {
        filters.priceMin = 500000;
      }
    }
    
    if (duration && filterType !== "duration" && duration !== "all") {
      filters.duration = duration;
    }
    
    if (type && filterType !== "type" && type !== "all") {
      filters.type = type;
    }

    onFilterChange(filters);
  };

  return (
    <div className="mb-12">
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <Select onValueChange={(value) => handleFilterChange("priceRange", value)} value={priceRange}>
                <SelectTrigger className="w-40" data-testid="select-price-range">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="Under $1,000">Under $1,000</SelectItem>
                  <SelectItem value="$1,000 - $2,000">$1,000 - $2,000</SelectItem>
                  <SelectItem value="$2,000 - $5,000">$2,000 - $5,000</SelectItem>
                  <SelectItem value="Over $5,000">Over $5,000</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("duration", value)} value={duration}>
                <SelectTrigger className="w-32" data-testid="select-duration">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="1-3 days">1-3 days</SelectItem>
                  <SelectItem value="4-7 days">4-7 days</SelectItem>
                  <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                  <SelectItem value="2+ weeks">2+ weeks</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("type", value)} value={type}>
                <SelectTrigger className="w-40" data-testid="select-type">
                  <SelectValue placeholder="Package Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Beach & Resort">Beach & Resort</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="p-2"
                data-testid="button-grid-view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="p-2"
                data-testid="button-list-view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
