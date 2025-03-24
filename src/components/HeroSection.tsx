
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

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

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          <span className="block">Save money with the</span>
          <span className="block text-deal">best deals and coupons</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Find exclusive promo codes, discounts, and offers from your favorite stores. 
          Save big on your next purchase with our verified deals.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto">
          <div className="relative flex shadow-soft rounded-lg overflow-hidden ring-1 ring-gray-200">
            <input
              type="text"
              placeholder="Search for deals, coupons, and stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow py-3 px-4 sm:py-4 sm:px-6 focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-deal text-white font-medium px-4 sm:px-6 transition-colors duration-200 hover:bg-deal-hover focus:outline-none focus:ring-2 focus:ring-deal/50 focus:ring-offset-2"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
          <span>Popular searches:</span>
          <button onClick={() => navigate('/category/fashion')} className="text-deal hover:underline">Fashion</button>
          <button onClick={() => navigate('/category/electronics')} className="text-deal hover:underline">Electronics</button>
          <button onClick={() => navigate('/category/food')} className="text-deal hover:underline">Food</button>
          <button onClick={() => navigate('/category/travel')} className="text-deal hover:underline">Travel</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
