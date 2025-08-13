# Conference Room Booking Mobile App

## Overview

A mobile-first conference room booking application built with React and Express.js that allows users to browse available conference rooms, make bookings, and view analytics. The application features 8 conference rooms with varying capacities (4-25 people), mobile-optimized interface with bottom navigation, comprehensive booking functionality, and detailed analytics dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the client-side application
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and API caching
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with dedicated routes for conference rooms, bookings, and analytics
- **PostgreSQL database** with full CRUD operations for rooms and bookings
- **Form validation** using Zod schemas shared between client and server
- **Analytics endpoints** for dashboard data, room statistics, and usage insights

### Data Layer
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- **8 pre-seeded conference rooms** with capacities ranging from 4-25 people
- **Sample bookings** with realistic data for testing and demonstration
- **Shared schema definitions** using Drizzle schema with Zod validation
- **Database migrations** managed through Drizzle Kit
- **Real-time data** with no mock or placeholder content

### Mobile App Features
- **Bottom navigation** with Home, Rooms, Bookings, and Analytics tabs
- **Room browsing** with search by name/location and capacity filtering (Small ≤6, Medium 7-15, Large 16+)
- **Detailed room pages** showing amenities, pricing, capacity, and high-quality images
- **Booking form** with organizer details, meeting purpose, date/time selection, and cost calculation
- **Bookings management** displaying all user bookings with status tracking
- **Analytics dashboard** with room performance, popular times, and usage insights
- **Mobile-optimized UI** with touch-friendly controls and responsive design

### Component Architecture
- **5 main pages**: HomePage, RoomsPage, RoomDetailsPage, BookingPage, BookingsPage, AnalyticsPage
- **Mobile navigation** component with active state indicators
- **Form handling** with React Hook Form and comprehensive validation
- **Real-time cost calculation** based on hourly rates and duration
- **Toast notifications** for booking confirmations and errors

### API Design
- **GET /api/conference-rooms** - List all available rooms with filtering
- **GET /api/conference-rooms/:id** - Get specific room details
- **POST /api/bookings** - Create new booking with validation
- **GET /api/bookings** - List user bookings with room details
- **GET /api/analytics/dashboard** - Analytics data for insights

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless** - Neon PostgreSQL database driver
- **drizzle-orm** and **drizzle-kit** - Type-safe ORM and migration tools
- **@tanstack/react-query** - Server state management
- **react-hook-form** and **@hookform/resolvers** - Form handling
- **wouter** - Lightweight React router

### UI and Styling
- **@radix-ui/* components** - Accessible UI primitives (dialogs, forms, navigation, etc.)
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **lucide-react** - Icon library

### Validation and Utilities
- **zod** - Schema validation
- **drizzle-zod** - Integration between Drizzle and Zod
- **date-fns** - Date manipulation utilities
- **clsx** and **tailwind-merge** - Conditional CSS class handling

### Development Tools
- **vite** - Build tool and development server
- **typescript** - Type safety
- **@replit/vite-plugin-runtime-error-modal** - Development error handling
- **@replit/vite-plugin-cartographer** - Replit-specific development features