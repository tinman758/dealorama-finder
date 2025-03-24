
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Heart, Settings, Key, LayoutDashboard } from 'lucide-react';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import PennyLogo from './PennyLogo';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useCategories } from '@/hooks/useCategories';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { categories } = useCategories();
  const location = useLocation();
  
  // Check if we're in the admin section by checking if the path starts with '/admin'
  const isAdminSection = location.pathname.startsWith('/admin');

  // Get the first 6 categories for the navbar
  const navbarCategories = categories.slice(0, 6);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-blur-light border-b border-gray-200/50">
      <div className="container-fluid h-16 flex items-center justify-between">
        {/* Logo */}
        <PennyLogo size={isMobile ? "md" : "lg"} />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navbarCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="text-sm font-medium text-gray-700 hover:text-penny-blue transition-colors duration-200 focus-ring rounded-md px-2 py-1"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Search, Auth, and Mobile Menu Buttons */}
        <div className="flex items-center gap-2">
          {/* Auth Buttons or User Profile */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-white hover:border-penny-blue transition-all">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                    <AvatarFallback className="bg-penny-blue text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.user_metadata?.name || user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="cursor-pointer flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/security" className="cursor-pointer flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      <span>Change Password</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/settings" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer flex items-center text-penny-blue">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button className="bg-penny-blue hover:bg-deal-hover text-white" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-penny-blue hover:bg-deal-hover text-white" size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          
          {/* Only show search icon if not in admin section */}
          {!isAdminSection && (
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-ring"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>
          )}
          
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

      {/* Search Dropdown - Only show if not in admin section */}
      {isSearchOpen && !isAdminSection && (
        <div className="container-fluid py-3 bg-blur-light animate-slide-down border-b border-gray-200/50">
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden container-fluid py-4 bg-blur-light animate-slide-down border-b border-gray-200/50">
          <nav className="flex flex-col space-y-3">
            {navbarCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-base font-medium text-gray-700 hover:text-penny-blue transition-colors duration-200 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            {/* Mobile Auth Links */}
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 mt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-9 w-9 border-2 border-white">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                      <AvatarFallback className="bg-penny-blue text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.user_metadata?.name || user.email}</span>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</span>
                    </div>
                  </div>
                  <Link 
                    to="/account"
                    className="text-base font-medium text-gray-700 hover:text-penny-blue flex items-center gap-2 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                  <Link 
                    to="/favorites"
                    className="text-base font-medium text-gray-700 hover:text-penny-blue flex items-center gap-2 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>
                  <Link 
                    to="/account/settings"
                    className="text-base font-medium text-gray-700 hover:text-penny-blue flex items-center gap-2 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin"
                      className="text-base font-medium text-penny-blue hover:text-penny-blue flex items-center gap-2 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-base font-medium bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-base font-medium bg-penny-blue text-white px-4 py-2 rounded-md hover:bg-deal-hover transition-colors duration-200 flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    className="text-base font-medium bg-penny-blue text-white px-4 py-2 rounded-md hover:bg-deal-hover transition-colors duration-200 flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
