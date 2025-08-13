import { 
  conferenceRooms, bookings, bookingEquipment, users,
  type ConferenceRoom, type Booking, type BookingEquipment, type User,
  type InsertConferenceRoom, type InsertBooking, type InsertBookingEquipment, type InsertUser,
  type BookingWithDetails, type RoomWithBookings, type RoomUsageStats, type BookingTrends, type PopularTimeSlots
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, sql, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Conference Rooms
  getConferenceRooms(): Promise<ConferenceRoom[]>;
  getActiveConferenceRooms(): Promise<ConferenceRoom[]>;
  getConferenceRoom(id: number): Promise<ConferenceRoom | null>;
  createConferenceRoom(room: InsertConferenceRoom): Promise<ConferenceRoom>;
  updateConferenceRoom(id: number, room: Partial<InsertConferenceRoom>): Promise<ConferenceRoom | null>;
  
  // Bookings
  getBookings(): Promise<BookingWithDetails[]>;
  getBookingsByRoom(roomId: number): Promise<Booking[]>;
  getBookingsByDateRange(startDate: string, endDate: string): Promise<BookingWithDetails[]>;
  getBooking(id: number): Promise<BookingWithDetails | null>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | null>;
  cancelBooking(id: number): Promise<Booking | null>;
  checkRoomAvailability(roomId: number, startDate: string, endDate: string, startTime: string, endTime: string, excludeBookingId?: number): Promise<boolean>;
  
  // Analytics
  getRoomUsageStats(startDate?: string, endDate?: string): Promise<RoomUsageStats[]>;
  getBookingTrends(startDate: string, endDate: string): Promise<BookingTrends[]>;
  getPopularTimeSlots(): Promise<PopularTimeSlots[]>;
  getTotalRevenue(startDate?: string, endDate?: string): Promise<number>;
  getOccupancyRate(roomId?: number, startDate?: string, endDate?: string): Promise<number>;
  
  // Users (for future authentication)
  getUser(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getConferenceRooms(): Promise<ConferenceRoom[]> {
    return await db.select().from(conferenceRooms).orderBy(asc(conferenceRooms.name));
  }

  async getActiveConferenceRooms(): Promise<ConferenceRoom[]> {
    return await db.select()
      .from(conferenceRooms)
      .where(eq(conferenceRooms.isActive, true))
      .orderBy(asc(conferenceRooms.name));
  }

  async getConferenceRoom(id: number): Promise<ConferenceRoom | null> {
    const [room] = await db.select()
      .from(conferenceRooms)
      .where(eq(conferenceRooms.id, id));
    return room || null;
  }

  async createConferenceRoom(room: InsertConferenceRoom): Promise<ConferenceRoom> {
    const [newRoom] = await db.insert(conferenceRooms)
      .values(room)
      .returning();
    return newRoom;
  }

  async updateConferenceRoom(id: number, room: Partial<InsertConferenceRoom>): Promise<ConferenceRoom | null> {
    const [updatedRoom] = await db.update(conferenceRooms)
      .set(room)
      .where(eq(conferenceRooms.id, id))
      .returning();
    return updatedRoom || null;
  }

  async getBookings(): Promise<BookingWithDetails[]> {
    const result = await db.select()
      .from(bookings)
      .leftJoin(conferenceRooms, eq(bookings.roomId, conferenceRooms.id))
      .leftJoin(bookingEquipment, eq(bookings.id, bookingEquipment.bookingId))
      .orderBy(desc(bookings.createdAt));

    // Group by booking and collect equipment
    const bookingsMap = new Map<number, BookingWithDetails>();
    
    for (const row of result) {
      if (!row.bookings || !row.conference_rooms) continue;
      
      const bookingId = row.bookings.id;
      if (!bookingsMap.has(bookingId)) {
        bookingsMap.set(bookingId, {
          ...row.bookings,
          room: row.conference_rooms,
          equipment: []
        });
      }
      
      if (row.booking_equipment) {
        bookingsMap.get(bookingId)!.equipment.push(row.booking_equipment);
      }
    }
    
    return Array.from(bookingsMap.values());
  }

  async getBookingsByRoom(roomId: number): Promise<Booking[]> {
    return await db.select()
      .from(bookings)
      .where(eq(bookings.roomId, roomId))
      .orderBy(desc(bookings.startDate), desc(bookings.startTime));
  }

  async getBookingsByDateRange(startDate: string, endDate: string): Promise<BookingWithDetails[]> {
    const result = await db.select()
      .from(bookings)
      .leftJoin(conferenceRooms, eq(bookings.roomId, conferenceRooms.id))
      .leftJoin(bookingEquipment, eq(bookings.id, bookingEquipment.bookingId))
      .where(
        and(
          gte(bookings.startDate, startDate),
          lte(bookings.endDate, endDate)
        )
      )
      .orderBy(asc(bookings.startDate), asc(bookings.startTime));

    // Group by booking and collect equipment
    const bookingsMap = new Map<number, BookingWithDetails>();
    
    for (const row of result) {
      if (!row.bookings || !row.conference_rooms) continue;
      
      const bookingId = row.bookings.id;
      if (!bookingsMap.has(bookingId)) {
        bookingsMap.set(bookingId, {
          ...row.bookings,
          room: row.conference_rooms,
          equipment: []
        });
      }
      
      if (row.booking_equipment) {
        bookingsMap.get(bookingId)!.equipment.push(row.booking_equipment);
      }
    }
    
    return Array.from(bookingsMap.values());
  }

  async getBooking(id: number): Promise<BookingWithDetails | null> {
    const result = await db.select()
      .from(bookings)
      .leftJoin(conferenceRooms, eq(bookings.roomId, conferenceRooms.id))
      .leftJoin(bookingEquipment, eq(bookings.id, bookingEquipment.bookingId))
      .where(eq(bookings.id, id));

    if (result.length === 0 || !result[0].bookings || !result[0].conference_rooms) {
      return null;
    }

    const booking: BookingWithDetails = {
      ...result[0].bookings,
      room: result[0].conference_rooms,
      equipment: result.filter(r => r.booking_equipment).map(r => r.booking_equipment!)
    };

    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | null> {
    const [updatedBooking] = await db.update(bookings)
      .set({ ...booking, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || null;
  }

  async cancelBooking(id: number): Promise<Booking | null> {
    const [cancelledBooking] = await db.update(bookings)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return cancelledBooking || null;
  }

  async checkRoomAvailability(
    roomId: number, 
    startDate: string, 
    endDate: string, 
    startTime: string, 
    endTime: string,
    excludeBookingId?: number
  ): Promise<boolean> {
    const conflicts = await db.select()
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, roomId),
          eq(bookings.status, "confirmed"),
          excludeBookingId ? sql`${bookings.id} != ${excludeBookingId}` : sql`1=1`,
          // Check for date overlap and time overlap
          sql`
            (${bookings.startDate} <= ${endDate} AND ${bookings.endDate} >= ${startDate}) AND
            (${bookings.startTime} < ${endTime} AND ${bookings.endTime} > ${startTime})
          `
        )
      );

    return conflicts.length === 0;
  }

  async getRoomUsageStats(startDate?: string, endDate?: string): Promise<RoomUsageStats[]> {
    let dateFilter = sql`1=1`;
    if (startDate && endDate) {
      dateFilter = and(
        gte(bookings.startDate, startDate),
        lte(bookings.endDate, endDate)
      );
    }

    const stats = await db.select({
      roomId: conferenceRooms.id,
      roomName: conferenceRooms.name,
      capacity: conferenceRooms.capacity,
      totalBookings: sql<number>`COUNT(${bookings.id})::int`,
      totalHours: sql<number>`
        COALESCE(SUM(
          EXTRACT(EPOCH FROM (
            TO_TIMESTAMP(${bookings.endDate} || ' ' || ${bookings.endTime}, 'YYYY-MM-DD HH24:MI') -
            TO_TIMESTAMP(${bookings.startDate} || ' ' || ${bookings.startTime}, 'YYYY-MM-DD HH24:MI')
          )) / 3600
        ), 0)::int
      `,
      totalRevenue: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)::int`,
      averageOccupancy: sql<number>`
        CASE 
          WHEN COUNT(${bookings.id}) > 0 
          THEN ROUND(AVG(${bookings.attendeeCount})::numeric, 1)::int
          ELSE 0 
        END
      `
    })
    .from(conferenceRooms)
    .leftJoin(bookings, and(
      eq(conferenceRooms.id, bookings.roomId),
      eq(bookings.status, "confirmed"),
      dateFilter
    ))
    .groupBy(conferenceRooms.id, conferenceRooms.name, conferenceRooms.capacity)
    .orderBy(asc(conferenceRooms.name));

    return stats.map(stat => ({
      ...stat,
      utilizationRate: stat.totalHours > 0 ? Math.round((stat.totalHours / (24 * 7)) * 100) : 0 // Assuming weekly calculation
    }));
  }

  async getBookingTrends(startDate: string, endDate: string): Promise<BookingTrends[]> {
    const trends = await db.select({
      date: bookings.startDate,
      bookingCount: sql<number>`COUNT(*)::int`,
      revenue: sql<number>`SUM(${bookings.totalAmount})::int`,
      totalHours: sql<number>`
        SUM(
          EXTRACT(EPOCH FROM (
            TO_TIMESTAMP(${bookings.endDate} || ' ' || ${bookings.endTime}, 'YYYY-MM-DD HH24:MI') -
            TO_TIMESTAMP(${bookings.startDate} || ' ' || ${bookings.startTime}, 'YYYY-MM-DD HH24:MI')
          )) / 3600
        )::int
      `
    })
    .from(bookings)
    .where(
      and(
        gte(bookings.startDate, startDate),
        lte(bookings.endDate, endDate),
        eq(bookings.status, "confirmed")
      )
    )
    .groupBy(bookings.startDate)
    .orderBy(asc(bookings.startDate));

    return trends;
  }

  async getPopularTimeSlots(): Promise<PopularTimeSlots[]> {
    const timeSlots = await db.select({
      hour: sql<number>`EXTRACT(HOUR FROM TO_TIME(${bookings.startTime}, 'HH24:MI'))::int`,
      bookingCount: sql<number>`COUNT(*)::int`
    })
    .from(bookings)
    .where(eq(bookings.status, "confirmed"))
    .groupBy(sql`EXTRACT(HOUR FROM TO_TIME(${bookings.startTime}, 'HH24:MI'))`)
    .orderBy(sql`EXTRACT(HOUR FROM TO_TIME(${bookings.startTime}, 'HH24:MI'))`);

    const totalBookings = timeSlots.reduce((sum, slot) => sum + slot.bookingCount, 0);

    return timeSlots.map(slot => ({
      ...slot,
      utilization: totalBookings > 0 ? Math.round((slot.bookingCount / totalBookings) * 100) : 0
    }));
  }

  async getTotalRevenue(startDate?: string, endDate?: string): Promise<number> {
    let dateFilter = sql`1=1`;
    if (startDate && endDate) {
      dateFilter = and(
        gte(bookings.startDate, startDate),
        lte(bookings.endDate, endDate)
      );
    }

    const [result] = await db.select({
      totalRevenue: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)::int`
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "confirmed"),
        dateFilter
      )
    );

    return result.totalRevenue;
  }

  async getOccupancyRate(roomId?: number, startDate?: string, endDate?: string): Promise<number> {
    let roomFilter = sql`1=1`;
    let dateFilter = sql`1=1`;
    
    if (roomId) {
      roomFilter = eq(bookings.roomId, roomId);
    }
    
    if (startDate && endDate) {
      dateFilter = and(
        gte(bookings.startDate, startDate),
        lte(bookings.endDate, endDate)
      );
    }

    const [result] = await db.select({
      averageOccupancy: sql<number>`
        CASE 
          WHEN COUNT(${bookings.id}) > 0 
          THEN ROUND(AVG(CAST(${bookings.attendeeCount} AS FLOAT) / ${conferenceRooms.capacity}) * 100, 1)
          ELSE 0 
        END
      `
    })
    .from(bookings)
    .leftJoin(conferenceRooms, eq(bookings.roomId, conferenceRooms.id))
    .where(
      and(
        eq(bookings.status, "confirmed"),
        roomFilter,
        dateFilter
      )
    );

    return result.averageOccupancy || 0;
  }

  async getUser(id: number): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, id));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email));
    return user || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users)
      .values(user)
      .returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();