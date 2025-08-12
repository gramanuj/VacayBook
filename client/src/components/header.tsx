import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <Plane className="text-ocean-600 h-8 w-8" />
              <span className="text-2xl font-bold text-slate-800">VacationHub</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <a 
                href="#destinations" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                data-testid="nav-destinations"
              >
                Destinations
              </a>
              <a 
                href="#packages" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                data-testid="nav-packages"
              >
                Packages
              </a>
              <a 
                href="#activities" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                data-testid="nav-activities"
              >
                Activities
              </a>
              <a 
                href="#contact" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                data-testid="nav-contact"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
            <Button 
              className="bg-ocean-600 hover:bg-ocean-700 text-white px-4 py-2 font-medium"
              data-testid="button-sign-up"
            >
              Sign Up
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600"
              onClick={toggleMobileMenu}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4" data-testid="mobile-menu">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#destinations" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Destinations
              </a>
              <a 
                href="#packages" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Packages
              </a>
              <a 
                href="#activities" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Activities
              </a>
              <a 
                href="#contact" 
                className="text-slate-600 hover:text-ocean-600 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
