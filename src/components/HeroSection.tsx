
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Headphones, Car, Plane } from 'lucide-react';
import { Button } from './ui/button';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="h-full w-full"
          style={{ 
            background: 'radial-gradient(circle at 30% 50%, rgba(14, 165, 233, 0.08), transparent 40%), radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.05), transparent 30%)' 
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl text-center px-4 sm:px-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          <span className="block">Save money with the</span>
          <span className="block text-deal">best deals and coupons</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Find exclusive promo codes, discounts, and offers from your favorite stores. 
          Save big on your next purchase with our verified deals.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto">
          <div className="flex h-14 rounded-full overflow-hidden shadow-md ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-gray-300">
            <input
              type="text"
              placeholder="Search stores, products, and coupons"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow pl-6 pr-4 py-3 focus:outline-none text-gray-700 bg-white"
              aria-label="Search deals"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-full aspect-square rounded-none bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Find amazing deals from thousands of stores</p>
        </form>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="text-sm text-gray-600 flex items-center mt-0.5 mr-1">Popular:</span>
          
          <button 
            onClick={() => navigate('/category/fashion')} 
            className="flex items-center gap-1.5 bg-[#FEF7CD] px-4 py-1.5 rounded-full text-gray-700 text-sm font-medium hover:shadow-md transition-all duration-200 animate-hover"
            aria-label="Fashion category"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Fashion</span>
          </button>
          
          <button 
            onClick={() => navigate('/category/electronics')} 
            className="flex items-center gap-1.5 bg-[#D3E4FD] px-4 py-1.5 rounded-full text-gray-700 text-sm font-medium hover:shadow-md transition-all duration-200 animate-hover"
            aria-label="Electronics category"
          >
            <Headphones className="h-3.5 w-3.5" />
            <span>Electronics</span>
          </button>
          
          <button 
            onClick={() => navigate('/category/food')} 
            className="flex items-center gap-1.5 bg-[#F2FCE2] px-4 py-1.5 rounded-full text-gray-700 text-sm font-medium hover:shadow-md transition-all duration-200 animate-hover"
            aria-label="Food category"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Food</span>
          </button>
          
          <button 
            onClick={() => navigate('/category/travel')} 
            className="flex items-center gap-1.5 bg-[#FFDEE2] px-4 py-1.5 rounded-full text-gray-700 text-sm font-medium hover:shadow-md transition-all duration-200 animate-hover"
            aria-label="Travel category"
          >
            <Plane className="h-3.5 w-3.5" />
            <span>Travel</span>
          </button>
          
          <button 
            onClick={() => navigate('/category/automotive')} 
            className="flex items-center gap-1.5 bg-[#E5DEFF] px-4 py-1.5 rounded-full text-gray-700 text-sm font-medium hover:shadow-md transition-all duration-200 animate-hover"
            aria-label="Automotive category"
          >
            <Car className="h-3.5 w-3.5" />
            <span>Automotive</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
