import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users } from "lucide-react";
import type { Package } from "@shared/schema";

interface PackageCardProps {
  package: Package;
  onBook: (packageId: string) => void;
}

export default function PackageCard({ package: pkg, onBook }: PackageCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Beach & Resort":
        return "bg-coral-500";
      case "Adventure":
        return "bg-emerald-500";
      case "Cultural":
        return "bg-purple-500";
      case "Luxury":
        return "bg-sunset-500";
      case "Family":
        return "bg-ocean-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" data-testid={`package-card-${pkg.id}`}>
      <div className="relative">
        <img 
          src={pkg.imageUrl} 
          alt={pkg.title}
          className="w-full h-48 object-cover"
          data-testid={`img-package-${pkg.id}`}
        />
        <div className="absolute top-4 left-4">
          <Badge className={`${getTypeColor(pkg.type)} text-white`} data-testid={`badge-package-type-${pkg.id}`}>
            {pkg.type}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-1">
            <Star className="h-4 w-4 text-sunset-400 fill-current" />
            <span className="text-sm font-semibold" data-testid={`text-package-rating-${pkg.id}`}>{pkg.rating}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-800" data-testid={`text-package-title-${pkg.id}`}>
            {pkg.title}
          </h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-ocean-600" data-testid={`text-package-price-${pkg.id}`}>
              {formatPrice(pkg.price)}
            </span>
            <p className="text-sm text-slate-500">per person</p>
          </div>
        </div>
        <p className="text-slate-600 mb-4" data-testid={`text-package-description-${pkg.id}`}>
          {pkg.description}
        </p>
        <div className="flex items-center space-x-4 mb-4 text-sm text-slate-500">
          <div className="flex items-center space-x-1" data-testid={`info-package-duration-${pkg.id}`}>
            <Clock className="h-4 w-4" />
            <span>{pkg.duration} days</span>
          </div>
          <div className="flex items-center space-x-1" data-testid={`info-package-max-guests-${pkg.id}`}>
            <Users className="h-4 w-4" />
            <span>2-{pkg.maxGuests} people</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs" data-testid={`feature-${pkg.id}-${index}`}>
              {feature}
            </Badge>
          ))}
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => onBook(pkg.id)}
            className="flex-1 bg-ocean-600 hover:bg-ocean-700 text-white py-3 font-semibold"
            data-testid={`button-book-package-${pkg.id}`}
          >
            Book Now
          </Button>
          <Link href={`/package/${pkg.id}`} className="flex-1">
            <Button 
              variant="outline"
              className="w-full border-ocean-600 text-ocean-600 hover:bg-ocean-50 py-3 font-semibold"
              data-testid={`button-view-details-${pkg.id}`}
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
