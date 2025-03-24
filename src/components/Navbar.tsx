
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User } from 'lucide-react';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';

const categories = [
  { name: "Fashion", path: "/category/fashion" },
  { name: "Electronics", path: "/category/electronics" },
  { name: "Beauty", path: "/category/beauty" },
  { name: "Home", path: "/category/home" },
  { name: "Travel", path: "/category/travel" },
  { name: "Food", path: "/category/food" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-blur-light border-b border-gray-200/50">
      <div className="container-fluid h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-bold text-2xl text-deal transition-all duration-300 transform hover:scale-[1.02]"
        >
          DealFinder
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="text-sm font-medium text-gray-700 hover:text-deal transition-colors duration-200 focus-ring rounded-md px-2 py-1"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Search, Auth, and Mobile Menu Buttons */}
        <div className="flex items-center gap-2">
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-700" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-deal hover:bg-deal-hover text-white" size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
          
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-ring"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-ring"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <div className="container-fluid py-3 bg-blur-light animate-slide-down border-b border-gray-200/50">
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden container-fluid py-4 bg-blur-light animate-slide-down border-b border-gray-200/50">
          <nav className="flex flex-col space-y-3">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-base font-medium text-gray-700 hover:text-deal transition-colors duration-200 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            {/* Mobile Auth Links */}
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 mt-4">
              <Link 
                to="/login"
                className="text-base font-medium text-gray-700 hover:text-deal transition-colors duration-200 py-1 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Login
              </Link>
              <Link 
                to="/signup"
                className="text-base font-medium bg-deal text-white px-4 py-2 rounded-md hover:bg-deal-hover transition-colors duration-200 flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
