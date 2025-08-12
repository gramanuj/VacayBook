import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, NY",
    initials: "SJ",
    rating: 5,
    content: "VacationHub made our Maldives honeymoon absolutely perfect. Every detail was taken care of, and the overwater villa exceeded our expectations!"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    location: "Denver, CO",
    initials: "MR",
    rating: 5,
    content: "The Swiss Alps adventure was incredible! The guides were knowledgeable and the accommodations were cozy. Highly recommend!"
  },
  {
    id: 3,
    name: "Emily Liu",
    location: "San Francisco, CA",
    initials: "EL",
    rating: 5,
    content: "Japan cultural journey was eye-opening. The ryokan stays and tea ceremonies were authentic and beautifully arranged."
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real experiences from thousands of satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-slate-50" data-testid={`testimonial-card-${testimonial.id}`}>
              <CardContent className="p-6">
                <div className="flex mb-4" data-testid={`rating-stars-${testimonial.id}`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-sunset-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-slate-700 mb-6 italic" data-testid={`testimonial-content-${testimonial.id}`}>
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-ocean-700 font-semibold" data-testid={`testimonial-initials-${testimonial.id}`}>
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800" data-testid={`testimonial-name-${testimonial.id}`}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500" data-testid={`testimonial-location-${testimonial.id}`}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
