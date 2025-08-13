import { Router, type Express } from "express";
import { storage } from "./storage";
import { insertBookingSchema, insertConferenceRoomSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Conference Rooms Routes
router.get("/api/conference-rooms", async (req, res) => {
  try {
    const rooms = await storage.getActiveConferenceRooms();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching conference rooms:", error);
    res.status(500).json({ error: "Failed to fetch conference rooms" });
  }
});

router.get("/api/conference-rooms/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid room ID" });
    }
    
    const room = await storage.getConferenceRoom(id);
    if (!room) {
      return res.status(404).json({ error: "Conference room not found" });
    }
    
    res.json(room);
  } catch (error) {
    console.error("Error fetching conference room:", error);
    res.status(500).json({ error: "Failed to fetch conference room" });
  }
});

router.post("/api/conference-rooms", async (req, res) => {
  try {
    const validatedRoom = insertConferenceRoomSchema.parse(req.body);
    const room = await storage.createConferenceRoom(validatedRoom);
    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating conference room:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid room data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create conference room" });
  }
});

// Bookings Routes
router.get("/api/bookings", async (req, res) => {
  try {
    const { startDate, endDate, roomId } = req.query;
    
    let bookings;
    if (startDate && endDate) {
      bookings = await storage.getBookingsByDateRange(
        startDate as string, 
        endDate as string
      );
    } else if (roomId) {
      const id = parseInt(roomId as string);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
      bookings = await storage.getBookingsByRoom(id);
    } else {
      bookings = await storage.getBookings();
    }
    
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/api/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }
    
    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

router.post("/api/bookings", async (req, res) => {
  try {
    const validatedBooking = insertBookingSchema.parse(req.body);
    
    // Check room availability
    const isAvailable = await storage.checkRoomAvailability(
      validatedBooking.roomId,
      validatedBooking.startDate,
      validatedBooking.endDate,
      validatedBooking.startTime,
      validatedBooking.endTime
    );
    
    if (!isAvailable) {
      return res.status(400).json({ 
        error: "Room is not available for the requested time slot" 
      });
    }
    
    const booking = await storage.createBooking(validatedBooking);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid booking data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.put("/api/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }
    
    const updateData = req.body;
    
    // If updating time/date, check availability
    if (updateData.roomId || updateData.startDate || updateData.endDate || 
        updateData.startTime || updateData.endTime) {
      const currentBooking = await storage.getBooking(id);
      if (!currentBooking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      const roomId = updateData.roomId || currentBooking.roomId;
      const startDate = updateData.startDate || currentBooking.startDate;
      const endDate = updateData.endDate || currentBooking.endDate;
      const startTime = updateData.startTime || currentBooking.startTime;
      const endTime = updateData.endTime || currentBooking.endTime;
      
      const isAvailable = await storage.checkRoomAvailability(
        roomId, startDate, endDate, startTime, endTime, id
      );
      
      if (!isAvailable) {
        return res.status(400).json({ 
          error: "Room is not available for the requested time slot" 
        });
      }
    }
    
    const booking = await storage.updateBooking(id, updateData);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

router.delete("/api/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }
    
    const booking = await storage.cancelBooking(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Room Availability Check
router.post("/api/rooms/check-availability", async (req, res) => {
  try {
    const { roomId, startDate, endDate, startTime, endTime, excludeBookingId } = req.body;
    
    if (!roomId || !startDate || !endDate || !startTime || !endTime) {
      return res.status(400).json({ 
        error: "Missing required fields: roomId, startDate, endDate, startTime, endTime" 
      });
    }
    
    const isAvailable = await storage.checkRoomAvailability(
      roomId, startDate, endDate, startTime, endTime, excludeBookingId
    );
    
    res.json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking room availability:", error);
    res.status(500).json({ error: "Failed to check room availability" });
  }
});

// Analytics Routes
router.get("/api/analytics/room-usage", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await storage.getRoomUsageStats(
      startDate as string, 
      endDate as string
    );
    res.json(stats);
  } catch (error) {
    console.error("Error fetching room usage stats:", error);
    res.status(500).json({ error: "Failed to fetch room usage statistics" });
  }
});

router.get("/api/analytics/booking-trends", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: "Start date and end date are required" 
      });
    }
    
    const trends = await storage.getBookingTrends(
      startDate as string, 
      endDate as string
    );
    res.json(trends);
  } catch (error) {
    console.error("Error fetching booking trends:", error);
    res.status(500).json({ error: "Failed to fetch booking trends" });
  }
});

router.get("/api/analytics/popular-times", async (req, res) => {
  try {
    const timeSlots = await storage.getPopularTimeSlots();
    res.json(timeSlots);
  } catch (error) {
    console.error("Error fetching popular time slots:", error);
    res.status(500).json({ error: "Failed to fetch popular time slots" });
  }
});

router.get("/api/analytics/revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const revenue = await storage.getTotalRevenue(
      startDate as string, 
      endDate as string
    );
    res.json({ totalRevenue: revenue });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ error: "Failed to fetch revenue data" });
  }
});

router.get("/api/analytics/occupancy", async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.query;
    const occupancyRate = await storage.getOccupancyRate(
      roomId ? parseInt(roomId as string) : undefined,
      startDate as string, 
      endDate as string
    );
    res.json({ occupancyRate });
  } catch (error) {
    console.error("Error fetching occupancy rate:", error);
    res.status(500).json({ error: "Failed to fetch occupancy rate" });
  }
});

// Dashboard summary endpoint
router.get("/api/analytics/dashboard", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const [
      roomStats,
      totalRevenue,
      occupancyRate,
      popularTimes
    ] = await Promise.all([
      storage.getRoomUsageStats(startDate as string, endDate as string),
      storage.getTotalRevenue(startDate as string, endDate as string),
      storage.getOccupancyRate(undefined, startDate as string, endDate as string),
      storage.getPopularTimeSlots()
    ]);
    
    const totalBookings = roomStats.reduce((sum, room) => sum + room.totalBookings, 0);
    const totalHours = roomStats.reduce((sum, room) => sum + room.totalHours, 0);
    
    res.json({
      summary: {
        totalRevenue,
        totalBookings,
        totalHours,
        averageOccupancyRate: occupancyRate
      },
      roomStats,
      popularTimes: popularTimes.slice(0, 5) // Top 5 popular times
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export async function registerRoutes(app: Express) {
  app.use(router);
  return app;
}