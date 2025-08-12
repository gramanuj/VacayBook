import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string, destination: string, checkin: string, checkout: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch("", destination, checkin, checkout);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} data-testid="form-search">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-2">Where to?</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Destination"
                className="pl-10 pr-4 py-3 border-slate-300 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                data-testid="input-destination"
              />
            </div>
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-2">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="date"
                className="pl-10 pr-4 py-3 border-slate-300 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                data-testid="input-checkin"
              />
            </div>
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-2">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="date"
                className="pl-10 pr-4 py-3 border-slate-300 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                data-testid="input-checkout"
              />
            </div>
          </div>
          <Button 
            type="submit"
            className="bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-3 font-semibold flex items-center justify-center space-x-2"
            data-testid="button-search"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
