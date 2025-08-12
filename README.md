# VacationHub - Travel Booking Platform

A modern, responsive vacation booking web application built with React and Express.js that allows users to browse destinations, search vacation packages, and make bookings.

## 🌟 Features

- **Beautiful Hero Section** with search functionality
- **Featured Destinations** with pricing and detailed information  
- **Advanced Package Filtering** by price range, duration, and type
- **Detailed Package Views** with comprehensive information
- **Complete Booking System** with form validation
- **Popular Activities** showcase
- **Customer Testimonials** section
- **Responsive Design** that works on all devices

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **RESTful API** design
- **In-memory storage** (easily replaceable with database)
- **Zod** for request validation
- **Session support** ready for authentication

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vacationhub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   └── storage.ts        # Data storage interface
├── shared/               # Shared types and schemas
│   └── schema.ts        # Data models and validation
└── components.json      # shadcn/ui configuration
```

## 🎯 Key Features

### Search & Filter
- Search vacation packages by destination
- Filter by price range, duration, and package type
- Real-time results with responsive design

### Package Management
- Browse featured destinations
- View detailed package information
- See included activities and amenities
- Compare different vacation options

### Booking System
- Complete booking forms with validation
- Traveler information collection
- Special requirements handling
- Booking confirmation workflow

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

The application uses:
- **Vite** for bundling and development
- **Tailwind CSS** for styling with custom design tokens
- **TypeScript** for type safety
- **ESLint** for code quality

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

This project is ready for deployment on platforms like:
- Replit Deployments
- Vercel
- Netlify
- Railway
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)