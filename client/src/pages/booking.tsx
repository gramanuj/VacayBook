import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, MapPin, ArrowLeft, Check } from "lucide-react";
import type { Package, Destination, InsertBooking } from "@shared/schema";
import { Link } from "wouter";

export default function Booking() {
  const [, params] = useRoute("/booking/:packageId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const packageId = params?.packageId || "";

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
      return response.json();
    },
    enabled: !!package_?.destinationId,
  });

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      packageId,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      travelDate: "",
      travelers: 1,
      specialRequests: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      return apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your vacation booking.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error submitting your booking request.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    bookingMutation.mutate(data);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  if (packageLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-96 bg-slate-200 rounded" />
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Package Not Found</h1>
          <p className="text-xl text-slate-600 mb-8">
            The vacation package you're trying to book doesn't exist.
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/package/${packageId}`}>
          <Button variant="ghost" className="mb-6" data-testid="button-back-package">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Package Details
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Book Your Vacation
          </h1>
          <p className="text-xl text-slate-600">
            Complete the form below to request your booking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Booking Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-booking">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="travelDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travel Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-travel-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="travelers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Travelers</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger data-testid="select-travelers">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 person</SelectItem>
                              <SelectItem value="2">2 people</SelectItem>
                              <SelectItem value="3">3 people</SelectItem>
                              <SelectItem value="4">4 people</SelectItem>
                              <SelectItem value="5">5 people</SelectItem>
                              <SelectItem value="6">6+ people</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Any special requirements or preferences..."
                            data-testid="textarea-special-requests"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4">
                    <Link href={`/package/${packageId}`} className="flex-1">
                      <Button type="button" variant="outline" className="w-full" data-testid="button-cancel">
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-ocean-600 hover:bg-ocean-700"
                      disabled={bookingMutation.isPending}
                      data-testid="button-submit-booking"
                    >
                      {bookingMutation.isPending ? "Submitting..." : "Submit Booking Request"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Package Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={package_.imageUrl}
                    alt={package_.title}
                    className="w-full h-full object-cover"
                    data-testid="img-package-summary"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-coral-500 text-white">
                      {package_.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-sunset-400 fill-current" />
                      <span className="text-sm font-semibold" data-testid="text-summary-rating">{package_.rating}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2" data-testid="text-summary-title">
                  {package_.title}
                </h3>
                {destination && (
                  <div className="flex items-center text-slate-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span data-testid="text-summary-destination">{destination.name}</span>
                  </div>
                )}

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-2" data-testid="info-summary-duration">
                    <Calendar className="w-4 h-4" />
                    <span>{package_.duration} days</span>
                  </div>
                  <div className="flex items-center space-x-2" data-testid="info-summary-max-guests">
                    <Users className="w-4 h-4" />
                    <span>Up to {package_.maxGuests} guests</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-800">Total Price</span>
                    <span className="text-2xl font-bold text-ocean-600" data-testid="text-summary-price">
                      {formatPrice(package_.price)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">per person</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-4">What's Included</h4>
                <div className="space-y-2">
                  {package_.included.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-start space-x-2" data-testid={`summary-included-${index}`}>
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                  {package_.included.length > 4 && (
                    <p className="text-sm text-slate-500 ml-6">
                      +{package_.included.length - 4} more included
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-ocean-50 border-ocean-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-ocean-800 mb-2">Booking Process</h4>
                <div className="space-y-2 text-sm text-ocean-700">
                  <p>1. Submit your booking request</p>
                  <p>2. We'll contact you within 24 hours</p>
                  <p>3. Confirm details and complete payment</p>
                  <p>4. Receive your confirmation and travel documents</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
