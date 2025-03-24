
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStores } from '@/hooks/useStores';
import { Star, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AllStores = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeatured, setShowFeatured] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch stores from the database
  const { stores, loading, error } = useStores({
    featured: showFeatured || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: searchTerm || undefined
  });
  
  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get unique categories from stores
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(['all']);
    stores.forEach(store => {
      if (store.category) {
        uniqueCategories.add(store.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [stores]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">All Stores</h1>
            
            <div className="flex flex-wrap gap-3">
              {/* Featured toggle */}
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${showFeatured ? 'bg-amber-50 border-amber-200' : ''}`}
                onClick={() => setShowFeatured(!showFeatured)}
              >
                <Star className={`h-4 w-4 ${showFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                Featured
              </Button>
              
              {/* Category filter dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    {selectedCategory === 'all' ? 'All Categories' : formatCategoryName(selectedCategory)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {categories.map(category => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategory === category}
                      onCheckedChange={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Categories' : formatCategoryName(category)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Display filtered stores count */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load stores. Please try again later.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Showing {stores.length} {stores.length === 1 ? 'store' : 'stores'}
              </p>
              
              {stores.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No stores match the selected filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowFeatured(false);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {stores.map((store) => (
                    <Link
                      key={store.id}
                      to={`/store/${store.id}`}
                      className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-soft hover:shadow-medium transition-all duration-300"
                    >
                      <div className="h-16 w-16 flex items-center justify-center mb-4 relative">
                        {store.featured && (
                          <div className="absolute -top-2 -right-2 text-amber-400">
                            <Star className="h-4 w-4 fill-amber-400" />
                          </div>
                        )}
                        <img
                          src={store.logo}
                          alt={store.name}
                          className="max-h-12 max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{store.name}</h3>
                      <p className="text-xs text-gray-600">{store.dealCount} deals available</p>
                      <span className="mt-2 text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {formatCategoryName(store.category)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllStores;
