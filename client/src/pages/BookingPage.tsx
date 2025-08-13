import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertBookingSchema } from "@shared/schema";

interface ConferenceRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  hourlyRate: number;
  imageUrl: string;
}

const bookingFormSchema = insertBookingSchema
  .omit({ 
    conferenceRoomId: true,
    startTime: true,
    endTime: true,
    totalCost: true,
  })
  .extend({
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  });

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: room, isLoading: roomLoading } = useQuery<ConferenceRoom>({
    queryKey: [`/api/conference-rooms/${roomId}`],
    enabled: !!roomId,
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      organizerName: "",
      organizerEmail: "",
      purpose: "",
      attendeesCount: 1,
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const startDateTime = new Date(`${data.date}T${data.startTime}:00`);
      const endDateTime = new Date(`${data.date}T${data.endTime}:00`);
      
      const hours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      const totalCost = Math.ceil(hours * (room?.hourlyRate || 0));

      const bookingData = {
        conferenceRoomId: parseInt(roomId!),
        organizerName: data.organizerName,
        organizerEmail: data.organizerEmail,
        purpose: data.purpose,
        attendeesCount: data.attendeesCount,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalCost,
        notes: data.notes,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create booking");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your conference room has been successfully booked.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      navigate("/bookings");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  const calculateCost = () => {
    const date = form.watch("date");
    const startTime = form.watch("startTime");
    const endTime = form.watch("endTime");

    if (date && startTime && endTime && room) {
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);
      
      if (endDateTime > startDateTime) {
        const hours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
        return Math.ceil(hours * room.hourlyRate);
      }
    }
    
    return 0;
  };

  const estimatedCost = calculateCost();

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm px-4 py-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Room not found</h2>
          <Link to="/rooms">
            <Button>Back to Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <Link to={`/rooms/${roomId}`} className="mr-3" data-testid="button-back">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900" data-testid="page-title">
                Book Room
              </h1>
              <p className="text-sm text-gray-600" data-testid="text-room-name">
                {room.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Room Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <img
                src={room.imageUrl}
                alt={room.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
                data-testid="img-room-thumbnail"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900" data-testid="text-booking-room-name">
                  {room.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  <span data-testid="text-room-capacity">Up to {room.capacity} people</span>
                  <span className="mx-2">•</span>
                  <DollarSign className="h-3 w-3 mr-1" />
                  <span data-testid="text-room-rate">${room.hourlyRate / 100}/hr</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Organizer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="organizerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                          data-testid="input-organizer-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="organizerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your@email.com" 
                          {...field}
                          data-testid="input-organizer-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Meeting Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meeting Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Purpose *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Team standup, Client presentation" 
                          {...field}
                          data-testid="input-meeting-purpose"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attendeesCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Attendees *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          max={room.capacity}
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          data-testid="input-attendees-count"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          min={today}
                          {...field}
                          data-testid="input-meeting-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time *</FormLabel>
                        <FormControl>
                          <Input 
                            type="time"
                            {...field}
                            data-testid="input-start-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time *</FormLabel>
                        <FormControl>
                          <Input 
                            type="time"
                            {...field}
                            data-testid="input-end-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requirements or notes..."
                          rows={3}
                          {...field}
                          data-testid="input-meeting-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Cost Summary */}
            {estimatedCost > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Estimated Total</p>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600" data-testid="text-estimated-cost">
                          {estimatedCost / 100}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                disabled={createBookingMutation.isPending}
                data-testid="button-confirm-booking"
              >
                {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}