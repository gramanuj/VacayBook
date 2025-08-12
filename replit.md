# VacationHub Travel Platform

## Overview

VacationHub is a modern travel booking platform built with React and Express.js that allows users to browse destinations, search vacation packages, and make bookings. The application features a responsive design with shadcn/ui components, real-time search functionality, and a comprehensive booking system for travel packages.

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
- **RESTful API** design with dedicated routes for destinations, packages, activities, bookings, and contacts
- **In-memory storage** implementation with an interface-based design for easy database migration
- **Form validation** using Zod schemas shared between client and server
- **Session-based architecture** ready with connect-pg-simple for PostgreSQL sessions

### Data Layer
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- **Shared schema definitions** using Drizzle schema with Zod validation
- **Database migrations** managed through Drizzle Kit
- **Neon Database** as the PostgreSQL provider

### Component Architecture
- **Modular component design** with separate components for destinations, packages, activities, and bookings
- **Form handling** with React Hook Form and Zod resolvers
- **Modal system** for booking interactions
- **Responsive design** with mobile-first approach
- **Toast notifications** for user feedback

### State Management
- **TanStack Query** for server state with automatic caching and invalidation
- **React Hook Form** for form state management
- **Local component state** for UI interactions and modal states

### API Design
- **RESTful endpoints** following standard HTTP conventions
- **Filtering and search** capabilities for packages
- **Error handling** with consistent error responses
- **Request/response logging** for debugging and monitoring

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