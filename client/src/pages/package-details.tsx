import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookingModal from "@/components/booking-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, MapPin, Check, ArrowLeft } from "lucide-react";
import type { Package, Destination } from "@shared/schema";

export default function PackageDetails() {
  const [, params] = useRoute("/package/:id");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const packageId = params?.id || "";

  const { data: package_, isLoading: packageLoading } = useQuery<Package>({
    queryKey: ["/api/packages", packageId],
    queryFn: async () => {
      const response = await fetch(`/api/packages/${packageId}`);
      if (!response.ok) {
        throw new Error("Package not found");
      }
      return response.json();
    },
  });

  const { data: destination } = useQuery<Destination>({
    queryKey: ["/api/destinations", package_?.destinationId],
    queryFn: async () => {
      if (!package_?.destinationId) return null;
      const response = await fetch(`/api/destinations/${package_.destinationId}`);
      if (!response.ok) {
        throw new Error("Destination not found");
      }
      return response.json();
    },
    enabled: !!package_?.destinationId,
  });

  const { data: relatedPackages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages", { destinationId: package_?.destinationId }],
    queryFn: async () => {
      if (!package_?.destinationId) return [];
      const response = await fetch(`/api/packages?destinationId=${package_.destinationId}`);
      return response.json();
    },
    enabled: !!package_?.destinationId,
  });

  if (packageLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-96 bg-slate-200 rounded-2xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-slate-200 rounded" />
                <div className="h-32 bg-slate-200 rounded" />
                <div className="h-48 bg-slate-200 rounded" />
              </div>
              <div className="h-96 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!package_) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Package Not Found</h1>
          <p className="text-xl text-slate-600 mb-8">
            The vacation package you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button className="bg-ocean-600 hover:bg-ocean-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={package_.imageUrl}
            alt={package_.title}
            className="w-full h-full object-cover"
            data-testid="img-package-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-4 bg-coral-500 text-white">
              {package_.type}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-package-title">
              {package_.title}
            </h1>
            {destination && (
              <div className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                <span data-testid="text-destination-name">{destination.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">About This Package</h2>
                <p className="text-slate-600 text-lg leading-relaxed" data-testid="text-package-description">
                  {package_.description}
                </p>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {package_.included.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3" data-testid={`included-item-${index}`}>
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Activities & Experiences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {package_.activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3" data-testid={`activity-item-${index}`}>
                      <div className="w-2 h-2 bg-ocean-600 rounded-full flex-shrink-0" />
                      <span className="text-slate-700">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Package Features</h2>
                <div className="flex flex-wrap gap-3">
                  {package_.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="px-4 py-2" data-testid={`feature-badge-${index}`}>
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-ocean-600" data-testid="text-package-price">
                      {formatPrice(package_.price)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-sunset-400 fill-current" />
                      <span className="font-semibold" data-testid="text-package-rating">{package_.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-500">per person</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3" data-testid="info-duration">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{package_.duration} days</span>
                  </div>
                  <div className="flex items-center space-x-3" data-testid="info-max-guests">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Up to {package_.maxGuests} guests</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-ocean-600 hover:bg-ocean-700 text-white py-4 text-lg mb-4"
                  data-testid="button-book-now"
                >
                  Book Now
                </Button>

                <Link href={`/booking/${package_.id}`}>
                  <Button 
                    variant="outline"
                    className="w-full border-ocean-600 text-ocean-600 hover:bg-ocean-50 py-4"
                    data-testid="button-view-booking-details"
                  >
                    View Booking Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Packages */}
        {relatedPackages.length > 1 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Other Packages in {destination?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages
                .filter(pkg => pkg.id !== package_.id)
                .slice(0, 3)
                .map((relatedPkg) => (
                  <Link key={relatedPkg.id} href={`/package/${relatedPkg.id}`}>
                    <Card className="group cursor-pointer hover:shadow-xl transition-shadow duration-300" data-testid={`related-package-${relatedPkg.id}`}>
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={relatedPkg.imageUrl}
                          alt={relatedPkg.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-coral-500 text-white">
                            {relatedPkg.type}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {relatedPkg.title}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {relatedPkg.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-ocean-600">
                            {formatPrice(relatedPkg.price)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-sunset-400 fill-current" />
                            <span className="text-sm font-semibold">{relatedPkg.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        packageId={package_.id}
      />
    </div>
  );
}
