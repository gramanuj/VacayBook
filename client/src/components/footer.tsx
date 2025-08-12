import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="text-ocean-400 h-8 w-8" />
              <span className="text-2xl font-bold text-white" data-testid="footer-logo">
                VacationHub
              </span>
            </div>
            <p className="text-slate-400 mb-4" data-testid="footer-description">
              Creating unforgettable travel experiences for adventurers worldwide.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-ocean-400 transition-colors"
                data-testid="social-facebook"
                aria-label="Facebook"
              >
                <span className="text-xl">📘</span>
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-ocean-400 transition-colors"
                data-testid="social-twitter"
                aria-label="Twitter"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-ocean-400 transition-colors"
                data-testid="social-instagram"
                aria-label="Instagram"
              >
                <span className="text-xl">📷</span>
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-ocean-400 transition-colors"
                data-testid="social-youtube"
                aria-label="YouTube"
              >
                <span className="text-xl">📺</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4" data-testid="footer-destinations-title">
              Destinations
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-europe">
                  Europe
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-asia">
                  Asia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-americas">
                  Americas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-africa">
                  Africa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-oceania">
                  Oceania
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4" data-testid="footer-travel-types-title">
              Travel Types
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-beach">
                  Beach & Resort
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-adventure">
                  Adventure
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-cultural">
                  Cultural
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-luxury">
                  Luxury
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-family">
                  Family
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4" data-testid="footer-support-title">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-help">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ocean-400 transition-colors" data-testid="footer-link-insurance">
                  Travel Insurance
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center">
          <p className="text-slate-400" data-testid="footer-copyright">
            &copy; 2024 VacationHub. All rights reserved. | Designed with ❤️ for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
