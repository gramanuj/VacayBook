import { type Destination, type InsertDestination, type Package, type InsertPackage, type Activity, type InsertActivity, type Booking, type InsertBooking, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Destinations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Packages
  getPackages(filters?: { priceMin?: number; priceMax?: number; duration?: string; type?: string; destinationId?: string }): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(packageData: InsertPackage): Promise<Package>;
  searchPackages(query: string): Promise<Package[]>;

  // Activities
  getActivities(): Promise<Activity[]>;
  getActivity(id: string): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private destinations: Map<string, Destination>;
  private packages: Map<string, Package>;
  private activities: Map<string, Activity>;
  private bookings: Map<string, Booking>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.destinations = new Map();
    this.packages = new Map();
    this.activities = new Map();
    this.bookings = new Map();
    this.contacts = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed destinations
    const destinationsData: InsertDestination[] = [
      {
        name: "Santorini, Greece",
        country: "Greece",
        description: "Stunning white-washed buildings and blue domes overlooking the Aegean Sea",
        imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600",
        packageCount: 12,
        priceFrom: 129900,
        featured: 1
      },
      {
        name: "Maldives",
        country: "Maldives",
        description: "Tropical paradise with overwater bungalows and crystal clear lagoons",
        imageUrl: "https://images.unsplash.com/photo-1540202404-d0c7fe46a087?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600",
        packageCount: 8,
        priceFrom: 259900,
        featured: 1
      },
      {
        name: "Bali, Indonesia",
        country: "Indonesia",
        description: "Rice terraces and tropical landscapes with lush greenery",
        imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600",
        packageCount: 15,
        priceFrom: 89900,
        featured: 1
      },
      {
        name: "Swiss Alps",
        country: "Switzerland",
        description: "Snow-capped peaks and alpine lakes with breathtaking mountain scenery",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600",
        packageCount: 10,
        priceFrom: 159900,
        featured: 1
      },
      {
        name: "Tokyo, Japan",
        country: "Japan",
        description: "Modern cityscape with traditional elements and vibrant culture",
        imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600",
        packageCount: 18,
        priceFrom: 119900,
        featured: 1
      },
      {
        name: "Iceland",
        country: "Iceland",
        description: "Northern Lights and dramatic landscapes with geysers and waterfalls",
        imageUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600",
        packageCount: 7,
        priceFrom: 179900,
        featured: 1
      }
    ];

    destinationsData.forEach(dest => {
      const destination: Destination = { ...dest, id: randomUUID() };
      this.destinations.set(destination.id, destination);
    });

    // Seed packages
    const packagesData: Omit<InsertPackage, 'destinationId'>[] = [
      {
        title: "Maldives Paradise Escape",
        description: "7 days in an overwater villa with private beach access, spa treatments, and gourmet dining experiences.",
        imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        price: 259900,
        duration: 7,
        maxGuests: 4,
        rating: "4.9",
        type: "Beach & Resort",
        features: ["5-star resort", "All-inclusive", "Spa included"],
        included: ["Overwater villa", "All meals", "Spa treatments", "Airport transfers"],
        activities: ["Snorkeling", "Sunset cruise", "Spa treatments", "Beach activities"]
      },
      {
        title: "Swiss Alps Adventure",
        description: "10 days of hiking, skiing, and mountain adventures with cozy chalet accommodations and local cuisine.",
        imageUrl: "https://pixabay.com/get/g056172b517d33478a5fdd350557b8dda7036ff34ea3fa4121937ff3ca34eb1587f0c9edafd81105c8deec56bae2c9bb9a4a240578c4410284a90eb60b0e465f1_1280.jpg",
        price: 189900,
        duration: 10,
        maxGuests: 8,
        rating: "4.8",
        type: "Adventure",
        features: ["Mountain lodge", "Guided tours", "Equipment included"],
        included: ["Chalet accommodation", "Breakfast & dinner", "Ski equipment", "Mountain guides"],
        activities: ["Skiing", "Hiking", "Mountain climbing", "Photography tours"]
      },
      {
        title: "Japan Cultural Journey",
        description: "12 days exploring ancient temples, traditional ryokans, tea ceremonies, and authentic Japanese experiences.",
        imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        price: 219900,
        duration: 12,
        maxGuests: 6,
        rating: "4.9",
        type: "Cultural",
        features: ["Traditional ryokan", "Cultural guide", "Authentic meals"],
        included: ["Ryokan stays", "Traditional meals", "Temple visits", "Cultural activities"],
        activities: ["Tea ceremony", "Temple visits", "Sake tasting", "Traditional arts"]
      },
      {
        title: "Santorini Luxury Getaway",
        description: "5 days in a cliffside villa with infinity pool, wine tastings, and sunset sailing experiences.",
        imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        price: 149900,
        duration: 5,
        maxGuests: 2,
        rating: "4.9",
        type: "Luxury",
        features: ["Cliffside villa", "Infinity pool", "Wine tastings"],
        included: ["Luxury villa", "Private transfers", "Wine tours", "Sunset cruise"],
        activities: ["Wine tasting", "Sunset sailing", "Photography", "Local tours"]
      },
      {
        title: "Bali Wellness Retreat",
        description: "8 days of yoga, meditation, spa treatments in tropical paradise with organic cuisine.",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        price: 129900,
        duration: 8,
        maxGuests: 6,
        rating: "4.8",
        type: "Luxury",
        features: ["Wellness resort", "Spa treatments", "Yoga classes"],
        included: ["Resort accommodation", "All meals", "Spa treatments", "Yoga sessions"],
        activities: ["Yoga", "Meditation", "Spa treatments", "Cultural tours"]
      },
      {
        title: "Iceland Northern Lights",
        description: "6 days chasing the Aurora Borealis with glacier tours, hot springs, and dramatic landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        price: 199900,
        duration: 6,
        maxGuests: 4,
        rating: "4.7",
        type: "Adventure",
        features: ["Northern lights tours", "Glacier walks", "Hot springs"],
        included: ["Hotel accommodation", "All tours", "Winter gear", "Expert guides"],
        activities: ["Northern lights viewing", "Glacier walking", "Hot springs", "Photography"]
      }
    ];

    const destinationIds = Array.from(this.destinations.keys());
    packagesData.forEach((pkg, index) => {
      const destinationId = destinationIds[index % destinationIds.length];
      const packageData: Package = {
        ...pkg,
        id: randomUUID(),
        destinationId
      };
      this.packages.set(packageData.id, packageData);
    });

    // Seed activities
    const activitiesData: InsertActivity[] = [
      {
        name: "Scuba Diving",
        description: "Explore underwater worlds with colorful coral reefs and marine life",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Water Sports"
      },
      {
        name: "Mountain Hiking",
        description: "Conquer scenic peaks and enjoy breathtaking alpine views",
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Adventure"
      },
      {
        name: "Wildlife Safari",
        description: "Meet incredible animals in their natural habitat",
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Wildlife"
      },
      {
        name: "Food Tours",
        description: "Taste authentic local flavors and culinary traditions",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Cultural"
      }
    ];

    activitiesData.forEach(activity => {
      const activityData: Activity = { ...activity, id: randomUUID() };
      this.activities.set(activityData.id, activityData);
    });
  }

  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const newDestination: Destination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }

  async getPackages(filters?: { priceMin?: number; priceMax?: number; duration?: string; type?: string; destinationId?: string }): Promise<Package[]> {
    let packages = Array.from(this.packages.values());

    if (filters) {
      if (filters.priceMin) {
        packages = packages.filter(pkg => pkg.price >= filters.priceMin!);
      }
      if (filters.priceMax) {
        packages = packages.filter(pkg => pkg.price <= filters.priceMax!);
      }
      if (filters.type) {
        packages = packages.filter(pkg => pkg.type === filters.type);
      }
      if (filters.destinationId) {
        packages = packages.filter(pkg => pkg.destinationId === filters.destinationId);
      }
      if (filters.duration) {
        if (filters.duration === "1-3 days") {
          packages = packages.filter(pkg => pkg.duration >= 1 && pkg.duration <= 3);
        } else if (filters.duration === "4-7 days") {
          packages = packages.filter(pkg => pkg.duration >= 4 && pkg.duration <= 7);
        } else if (filters.duration === "1-2 weeks") {
          packages = packages.filter(pkg => pkg.duration >= 8 && pkg.duration <= 14);
        } else if (filters.duration === "2+ weeks") {
          packages = packages.filter(pkg => pkg.duration > 14);
        }
      }
    }

    return packages;
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(packageData: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const newPackage: Package = { ...packageData, id };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  async searchPackages(query: string): Promise<Package[]> {
    const packages = Array.from(this.packages.values());
    const destinations = Array.from(this.destinations.values());
    const lowercaseQuery = query.toLowerCase();

    return packages.filter(pkg => {
      const destination = destinations.find(d => d.id === pkg.destinationId);
      return (
        pkg.title.toLowerCase().includes(lowercaseQuery) ||
        pkg.description.toLowerCase().includes(lowercaseQuery) ||
        pkg.type.toLowerCase().includes(lowercaseQuery) ||
        (destination && destination.name.toLowerCase().includes(lowercaseQuery)) ||
        (destination && destination.country.toLowerCase().includes(lowercaseQuery))
      );
    });
  }

  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const newBooking: Booking = {
      ...booking,
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const newContact: Contact = {
      ...contact,
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export const storage = new MemStorage();
