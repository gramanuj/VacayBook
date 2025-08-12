import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import DestinationCard from "@/components/destination-card";
import PackageCard from "@/components/package-card";
import ActivityCard from "@/components/activity-card";
import FilterBar from "@/components/filter-bar";
import BookingModal from "@/components/booking-modal";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Shield, Headphones, Tags, Heart, Star } from "lucide-react";
import type { Destination, Package, Activity } from "@shared/schema";

interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  duration?: string;
  type?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");

  const { data: destinations = [], isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages", searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchFilters.priceMin) params.append('priceMin', searchFilters.priceMin.toString());
      if (searchFilters.priceMax) params.append('priceMax', searchFilters.priceMax.toString());
      if (searchFilters.duration) params.append('duration', searchFilters.duration);
      if (searchFilters.type) params.append('type', searchFilters.type);
      
      const response = await fetch(`/api/packages?${params.toString()}`);
      return response.json();
    },
  });

  const { data: searchResults = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/packages/search?q=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const handleSearch = (query: string, destination: string, checkin: string, checkout: string) => {
    setSearchQuery(query || destination);
  };

  const handleFilterChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleBookPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setIsBookingModalOpen(true);
  };

  const displayPackages = searchQuery.trim() ? searchResults : packages;
  const featuredDestinations = destinations.filter(dest => dest.featured);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative hero-bg h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/40" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Dream <span className="text-sunset-400">Vacation</span><br />
            Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 max-w-2xl mx-auto">
            Discover breathtaking destinations, luxury accommodations, and unforgettable experiences tailored just for you.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore our handpicked selection of the world's most stunning vacation destinations
            </p>
          </div>

          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 h-64 rounded-2xl mb-4" />
                  <div className="h-4 bg-slate-200 rounded mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  data-testid={`destination-card-${destination.id}`}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-4 text-lg"
              data-testid="button-view-all-destinations"
            >
              View All Destinations
            </Button>
          </div>
        </div>
      </section>

      {/* Vacation Packages */}
      <section id="packages" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Popular Vacation Packages
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Carefully curated packages combining the best accommodations, activities, and experiences
            </p>
          </div>

          <FilterBar onFilterChange={handleFilterChange} />

          {packagesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="bg-slate-200 h-48" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-200 rounded mb-2" />
                    <div className="h-4 bg-slate-200 rounded mb-4 w-2/3" />
                    <div className="h-16 bg-slate-200 rounded mb-4" />
                    <div className="flex gap-3">
                      <div className="h-10 bg-slate-200 rounded flex-1" />
                      <div className="h-10 bg-slate-200 rounded flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
              {displayPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onBook={handleBookPackage}
                  data-testid={`package-card-${pkg.id}`}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-4 text-lg"
              data-testid="button-load-more-packages"
            >
              Load More Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Travel Activities */}
      <section id="activities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Popular Activities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover exciting experiences and unforgettable adventures around the world
            </p>
          </div>

          {activitiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 h-48 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  data-testid={`activity-card-${activity.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Why Choose VacationHub?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We make planning your dream vacation effortless with our expertise and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="feature-trusted">
              <div className="bg-ocean-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-ocean-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Trusted & Secure</h3>
              <p className="text-slate-600">
                Your bookings are protected with industry-leading security and our satisfaction guarantee.
              </p>
            </div>
            <div className="text-center" data-testid="feature-support">
              <div className="bg-sunset-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-sunset-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">24/7 Support</h3>
              <p className="text-slate-600">
                Our expert travel consultants are available around the clock to assist you.
              </p>
            </div>
            <div className="text-center" data-testid="feature-prices">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tags className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Best Prices</h3>
              <p className="text-slate-600">
                We guarantee competitive pricing with exclusive deals and package discounts.
              </p>
            </div>
            <div className="text-center" data-testid="feature-personalized">
              <div className="bg-coral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-coral-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Personalized</h3>
              <p className="text-slate-600">
                Every trip is tailored to your preferences, interests, and travel style.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Let our travel experts help you plan the perfect vacation. Get in touch for personalized recommendations and exclusive deals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-ocean-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📞</span>
                  </div>
                  <span className="text-slate-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-ocean-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✉️</span>
                  </div>
                  <span className="text-slate-300">hello@vacationhub.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-ocean-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🕐</span>
                  </div>
                  <span className="text-slate-300">24/7 Customer Support</span>
                </div>
              </div>
            </div>
            <Card className="bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Get a Free Consultation</h3>
                <form className="space-y-4" data-testid="form-contact">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      data-testid="input-contact-name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      data-testid="input-contact-email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Dream Destination</label>
                    <input
                      type="text"
                      placeholder="Where would you like to go?"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      data-testid="input-contact-destination"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your ideal vacation..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      data-testid="textarea-contact-message"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-ocean-600 hover:bg-ocean-700 text-white py-3"
                    data-testid="button-send-message"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        packageId={selectedPackageId}
      />
    </div>
  );
}
