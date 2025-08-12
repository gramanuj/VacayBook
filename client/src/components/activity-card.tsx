import type { Activity } from "@shared/schema";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="group cursor-pointer" data-testid={`activity-card-${activity.id}`}>
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <img 
          src={activity.imageUrl} 
          alt={activity.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          data-testid={`img-activity-${activity.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold mb-1" data-testid={`text-activity-name-${activity.id}`}>
            {activity.name}
          </h3>
          <p className="text-sm opacity-90" data-testid={`text-activity-description-${activity.id}`}>
            {activity.description}
          </p>
        </div>
      </div>
    </div>
  );
}
