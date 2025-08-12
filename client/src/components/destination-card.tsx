import { Link } from "wouter";
import type { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  return (
    <Link href={`/destination/${destination.id}`}>
      <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300" data-testid={`destination-card-${destination.id}`}>
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <img 
            src={destination.imageUrl} 
            alt={destination.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            data-testid={`img-destination-${destination.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold mb-2" data-testid={`text-destination-name-${destination.id}`}>
              {destination.name}
            </h3>
            <p className="text-sm opacity-90" data-testid={`text-destination-packages-${destination.id}`}>
              {destination.packageCount} packages available
            </p>
            <div className="flex items-center mt-2">
              <span className="text-sunset-400 font-semibold" data-testid={`text-destination-price-${destination.id}`}>
                {formatPrice(destination.priceFrom)}
              </span>
              <span className="text-sm ml-2 opacity-80">per person</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
