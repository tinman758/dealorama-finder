
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { categories, loading } = useCategories();

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    // Basic sanitization - in a real app, use a library like DOMPurify
    return input.replace(/[<>]/g, '');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize input on change
    setSearchQuery(sanitizeInput(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSearching) return;
    
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setIsSearching(true);
      
      // Limit search query length for security
      const limitedQuery = trimmedQuery.slice(0, 100);
      
      // Use encodeURIComponent for proper URL encoding
      navigate(`/search?q=${encodeURIComponent(limitedQuery)}`);
      
      // Reset state after navigation
      setIsSearching(false);
    }
  };

  // Get the first 5 categories for the popular section
  const popularCategories = categories.slice(0, 5);

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
              onChange={handleSearchChange}
              className="flex-grow pl-6 pr-4 py-3 focus:outline-none text-gray-700 bg-white"
              aria-label="Search deals"
              maxLength={100}
              autoComplete="off"
              spellCheck="false"
              aria-autocomplete="list"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-full aspect-square rounded-none bg-[#1769E8] hover:bg-[#1252BC] text-white transition-colors duration-200"
              aria-label="Search"
              disabled={isSearching || !searchQuery.trim()}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="text-sm text-gray-600 flex items-center mt-0.5 mr-1">Popular:</span>
          
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            popularCategories.map((category) => (
              <button 
                key={category.id}
                onClick={() => navigate(`/category/${category.slug}`)} 
                className={`flex items-center gap-1.5 bg-[${category.icon ? category.icon : '#F2FCE2'}] px-4 py-1.5 rounded-full text-gray-700 text-sm font-medium hover:shadow-md transition-all duration-200 animate-hover`}
                aria-label={`${category.name} category`}
              >
                <span>{category.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
