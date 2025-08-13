import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <main className="pb-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailsPage />} />
              <Route path="/book/:roomId" element={<BookingPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;