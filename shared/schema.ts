import { pgTable, text, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const conferenceRooms = pgTable("conference_rooms", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  amenities: text("amenities").array().default([]),
  hourlyRate: integer("hourly_rate").notNull(), // Rate in cents per hour
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  roomId: integer("room_id").references(() => conferenceRooms.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  organizerName: text("organizer_name").notNull(),
  organizerEmail: text("organizer_email").notNull(),
  organizerPhone: text("organizer_phone"),
  attendeeCount: integer("attendee_count").notNull(),
  startDate: text("start_date").notNull(), // YYYY-MM-DD format
  endDate: text("end_date").notNull(), // YYYY-MM-DD format
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  totalAmount: integer("total_amount").notNull(), // Amount in cents
  status: text("status").default("confirmed"), // confirmed, cancelled, completed
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookingEquipment = pgTable("booking_equipment", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  equipmentName: text("equipment_name").notNull(),
  quantity: integer("quantity").default(1),
});

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const conferenceRoomsRelations = relations(conferenceRooms, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  room: one(conferenceRooms, {
    fields: [bookings.roomId],
    references: [conferenceRooms.id],
  }),
  equipment: many(bookingEquipment),
}));

export const bookingEquipmentRelations = relations(bookingEquipment, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingEquipment.bookingId],
    references: [bookings.id],
  }),
}));

// Insert schemas
export const insertConferenceRoomSchema = createInsertSchema(conferenceRooms).omit({ 
  id: true, 
  createdAt: true 
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertBookingEquipmentSchema = createInsertSchema(bookingEquipment).omit({ 
  id: true 
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type ConferenceRoom = typeof conferenceRooms.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type BookingEquipment = typeof bookingEquipment.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertConferenceRoom = z.infer<typeof insertConferenceRoomSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertBookingEquipment = z.infer<typeof insertBookingEquipmentSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Extended types for API responses
export type BookingWithDetails = Booking & {
  room: ConferenceRoom;
  equipment: BookingEquipment[];
};

export type RoomWithBookings = ConferenceRoom & {
  bookings: Booking[];
};

// Analytics types
export type RoomUsageStats = {
  roomId: number;
  roomName: string;
  totalBookings: number;
  totalHours: number;
  totalRevenue: number;
  utilizationRate: number;
  averageOccupancy: number;
};

export type BookingTrends = {
  date: string;
  bookingCount: number;
  revenue: number;
  totalHours: number;
};

export type PopularTimeSlots = {
  hour: number;
  bookingCount: number;
  utilization: number;
};