
import { Link } from 'react-router-dom';

const categories = [
  { name: "Fashion", path: "/category/fashion" },
  { name: "Electronics", path: "/category/electronics" },
  { name: "Beauty", path: "/category/beauty" },
  { name: "Home", path: "/category/home" },
  { name: "Travel", path: "/category/travel" },
  { name: "Food", path: "/category/food" },
];

const popularStores = [
  { name: "Amazon", path: "/store/1" },
  { name: "Nike", path: "/store/2" },
  { name: "Apple", path: "/store/3" },
  { name: "Expedia", path: "/store/4" },
  { name: "Sephora", path: "/store/6" },
];

const aboutLinks = [
  { name: "About Us", path: "/about" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Contact Us", path: "/contact" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200/70 pt-12 pb-6">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="font-bold text-2xl text-deal">
              DealFinder
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Find the best deals, discounts, and coupons from your favorite stores. 
              Save money on every purchase.
            </p>
          </div>
          
          {/* Categories Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link 
                    to={category.path}
                    className="text-sm text-gray-600 hover:text-deal transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/all-categories"
                  className="text-sm text-deal font-medium hover:underline transition-colors duration-200"
                >
                  View all categories
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Stores Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Popular Stores</h3>
            <ul className="space-y-2.5">
              {popularStores.map((store) => (
                <li key={store.path}>
                  <Link 
                    to={store.path}
                    className="text-sm text-gray-600 hover:text-deal transition-colors duration-200"
                  >
                    {store.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/all-stores"
                  className="text-sm text-deal font-medium hover:underline transition-colors duration-200"
                >
                  View all stores
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">About</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm text-gray-600 hover:text-deal transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200/70 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} DealFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
