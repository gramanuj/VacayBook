import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all destinations
  app.get("/api/destinations", async (_req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });

  // Get destination by ID
  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destination" });
    }
  });

  // Get all packages with optional filters
  app.get("/api/packages", async (req, res) => {
    try {
      const { priceMin, priceMax, duration, type, destinationId } = req.query;
      
      const filters: any = {};
      if (priceMin) filters.priceMin = parseInt(priceMin as string);
      if (priceMax) filters.priceMax = parseInt(priceMax as string);
      if (duration) filters.duration = duration as string;
      if (type) filters.type = type as string;
      if (destinationId) filters.destinationId = destinationId as string;

      const packages = await storage.getPackages(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  // Search packages
  app.get("/api/packages/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const packages = await storage.searchPackages(q);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to search packages" });
    }
  });

  // Get package by ID
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const package_ = await storage.getPackage(req.params.id);
      if (!package_) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(package_);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch package" });
    }
  });

  // Get all activities
  app.get("/api/activities", async (_req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ error: "Invalid booking data", details: error });
      } else {
        res.status(500).json({ error: "Failed to create booking" });
      }
    }
  });

  // Create contact
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ error: "Invalid contact data", details: error });
      } else {
        res.status(500).json({ error: "Failed to create contact" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
