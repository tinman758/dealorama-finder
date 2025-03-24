
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import PennyLogo from './PennyLogo';
import { useCategories } from '@/hooks/useCategories';
import { useStores } from '@/hooks/useStores';

const aboutLinks = [
  { name: "About Us", path: "/about" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Contact Us", path: "/contact" },
];

const socialLinks = [
  { icon: Facebook, path: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, path: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, path: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, path: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, path: "https://youtube.com", label: "YouTube" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { categories } = useCategories();
  const { stores } = useStores({ featured: true, limit: 5 });
  
  // Get up to 6 categories for the footer
  const footerCategories = categories.slice(0, 6);
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200/70 pt-12 pb-6">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <PennyLogo size="xl" className="mb-4" />
            <p className="mt-4 text-sm text-gray-600">
              Find the best deals, discounts, and coupons from your favorite stores. 
              Save money on every purchase.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-penny-blue transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          {/* Categories Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {footerCategories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/category/${category.slug}`}
                    className="text-sm text-gray-600 hover:text-penny-blue transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/all-categories"
                  className="text-sm text-penny-blue font-medium hover:underline transition-colors duration-200"
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
              {stores.map((store) => (
                <li key={store.id}>
                  <Link 
                    to={`/store/${store.id}`}
                    className="text-sm text-gray-600 hover:text-penny-blue transition-colors duration-200"
                  >
                    {store.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/all-stores"
                  className="text-sm text-penny-blue font-medium hover:underline transition-colors duration-200"
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
                    className="text-sm text-gray-600 hover:text-penny-blue transition-colors duration-200"
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
            &copy; {currentYear} Penny Pinch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
