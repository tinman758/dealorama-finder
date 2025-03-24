
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearchDeals } from '@/hooks/useSearch';
import { Deal } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Use the search hook
  const { deals: results, loading } = useSearchDeals(query);

  useEffect(() => {
    // Focus the input when search is opened
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/deal/${id}`);
    if (onClose) onClose();
  };

  return (
    <div className={`relative w-full ${isMobile ? 'px-3' : ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={isMobile ? "Search..." : "Search for deals, stores, and coupons..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`w-full pl-10 pr-10 py-3 ${isMobile ? 'my-2' : ''} rounded-lg border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-deal/40 
                       bg-white/80 backdrop-blur-sm transition-all duration-200`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 rounded-full hover:bg-gray-100 
                         transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isFocused && query.length > 1 && (
        <div className={`absolute top-full left-0 right-0 ${isMobile ? 'mt-3' : 'mt-2'} bg-white rounded-lg 
                        shadow-medium border border-gray-100 overflow-hidden z-10
                        animate-scale-in origin-top`}>
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((deal) => (
                <li key={deal.id}>
                  <button
                    onClick={() => handleResultClick(deal.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 
                             transition-colors duration-200 flex items-start"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{deal.title}</p>
                      <p className="text-sm text-gray-500 truncate">{deal.description}</p>
                    </div>
                    <span className="deal-badge ml-2">{deal.discount}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
          
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={handleSubmit}
              className="w-full text-center text-sm text-deal font-medium hover:underline"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
