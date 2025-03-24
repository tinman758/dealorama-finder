
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';
import { getDealsForCategory } from '@/data/deals';
import { getStoresByCategory } from '@/data/stores';
import { Deal, Store } from '@/types';

const categories = {
  fashion: "Fashion",
  electronics: "Electronics",
  beauty: "Beauty",
  home: "Home",
  travel: "Travel",
  food: "Food",
  general: "General",
};

type SortOption = 'newest' | 'popular' | 'expiring';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleDeals, setVisibleDeals] = useState(8);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  
  const categoryName = category && category in categories 
    ? categories[category as keyof typeof categories] 
    : "All Categories";

  useEffect(() => {
    if (category) {
      setLoading(true);
      
      // Get category deals and stores
      const categoryDeals = getDealsForCategory(category);
      const categoryStores = getStoresByCategory(category);
      
      // Sort deals based on the selected option
      let sortedDeals = [...categoryDeals];
      
      if (sortBy === 'popular') {
        sortedDeals.sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0));
      } else if (sortBy === 'expiring') {
        sortedDeals.sort((a, b) => {
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        });
      } else {
        // 'newest' - no need to sort as we assume the data is already in newest first order
      }
      
      setDeals(sortedDeals);
      setStores(categoryStores);
      
      // Reset visible deals count when category changes
      setVisibleDeals(8);
      
      // Simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [category, sortBy]);
  
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setSortMenuOpen(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 container-fluid animate-pulse">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-200 h-10 w-40 mb-6 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white h-64 rounded-lg shadow-soft"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!category || !(category in categories)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 container-fluid">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
            <Link to="/" className="deal-button inline-flex items-center">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const featuredStores = stores.filter(store => store.featured);
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      <main className="flex-grow py-12 container-fluid">
        <div className="max-w-7xl mx-auto">
          {/* Category Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName} Deals & Coupons</h1>
            <p className="text-gray-600">
              Find the best {categoryName.toLowerCase()} deals, discounts, and promo codes from top stores.
            </p>
          </div>
          
          {/* Featured Stores Section */}
          {featuredStores.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Featured {categoryName} Stores</h2>
                {stores.length > 4 && (
                  <Link 
                    to="#" 
                    className="text-deal flex items-center text-sm font-medium hover:underline"
                  >
                    View all stores <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {featuredStores.slice(0, 4).map(store => (
                  <Link 
                    key={store.id} 
                    to={`/store/${store.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-soft transition-all duration-300 hover:shadow-medium">
                      <div className="h-16 w-16 flex items-center justify-center mb-4">
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="max-h-12 max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{store.name}</h3>
                      <p className="text-xs text-gray-600">{store.dealCount} deals available</p>
                      {store.storeType && (
                        <span className="mt-2 inline-flex items-center text-xs text-gray-500">
                          {store.storeType === 'online' ? 'Online Store' : 
                           store.storeType === 'local' ? 'Local Store' : 'Online & Local Store'}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          
          {/* Filters and Sort */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* All Category Stores */}
            {stores.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Popular Stores:</span>
                {stores.slice(0, 5).map((store) => (
                  <Link
                    key={store.id}
                    to={`/store/${store.id}`}
                    className="inline-flex items-center bg-white border border-gray-200 rounded-full 
                              px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 
                              transition-colors duration-200"
                  >
                    <img 
                      src={store.logo} 
                      alt={store.name} 
                      className="h-4 w-4 mr-1 object-contain" 
                    />
                    {store.name}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Sort Options */}
            <div className="flex items-center relative">
              <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
              <div className="relative">
                <button
                  onClick={() => setSortMenuOpen(!sortMenuOpen)}
                  className="flex items-center justify-between bg-white border border-gray-200 
                            rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 
                            transition-colors duration-200 min-w-[120px]"
                >
                  <span>
                    {sortBy === 'popular' && 'Most Popular'}
                    {sortBy === 'newest' && 'Newest'}
                    {sortBy === 'expiring' && 'Expiring Soon'}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                {sortMenuOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 
                                rounded-md shadow-medium overflow-hidden z-10">
                    <button
                      onClick={() => handleSortChange('popular')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 
                                transition-colors duration-200 ${sortBy === 'popular' ? 'font-medium text-deal' : 'text-gray-700'}`}
                    >
                      Most Popular
                    </button>
                    <button
                      onClick={() => handleSortChange('newest')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 
                                transition-colors duration-200 ${sortBy === 'newest' ? 'font-medium text-deal' : 'text-gray-700'}`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => handleSortChange('expiring')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 
                                transition-colors duration-200 ${sortBy === 'expiring' ? 'font-medium text-deal' : 'text-gray-700'}`}
                    >
                      Expiring Soon
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Deals Grid Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top {categoryName} Deals & Coupons</h2>
          </div>
          
          {/* Deals Grid */}
          {deals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {deals.slice(0, visibleDeals).map(deal => (
                  <div key={deal.id} className="animate-slide-in" style={{ animationDelay: `${parseInt(deal.id) * 50}ms` }}>
                    <DealCard deal={deal} />
                  </div>
                ))}
              </div>
              
              {visibleDeals < deals.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setVisibleDeals(prevCount => Math.min(prevCount + 8, deals.length))}
                    className="deal-button mx-auto"
                  >
                    Load More Deals
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No deals found</h2>
              <p className="text-gray-600">
                There are currently no deals available in this category.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
