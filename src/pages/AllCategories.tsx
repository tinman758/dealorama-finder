
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Star, Loader2 } from 'lucide-react';

const AllCategories = () => {
  const { categories, loading, error } = useCategories();
  const [showFeatured, setShowFeatured] = useState(false);
  
  // Get counts of stores per category
  const getCategoryStoreCount = (categorySlug: string) => {
    // This will be populated from the database in future improvements
    return Math.floor(Math.random() * 20) + 1; // Temporary random count until we implement actual count
  };
  
  // Get featured stores count per category
  const getFeaturedStoreCount = (categorySlug: string) => {
    // This will be populated from the database in future improvements
    return Math.floor(Math.random() * 5); // Temporary random count until we implement actual count
  };
  
  // Filter categories based on featured toggle
  const filteredCategories = showFeatured 
    ? categories.filter(category => getFeaturedStoreCount(category.slug) > 0)
    : categories;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">All Categories</h1>
            
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${showFeatured ? 'bg-amber-50 border-amber-200' : ''}`}
              onClick={() => setShowFeatured(!showFeatured)}
            >
              <Star className={`h-4 w-4 ${showFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
              Featured Stores Only
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load categories. Please try again later.</p>
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
              {/* Display filtered categories count */}
              <p className="text-gray-600 mb-6">
                Showing {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
              </p>
              
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No categories with featured stores found.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowFeatured(false)}
                  >
                    Show All Categories
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredCategories.map((category) => (
                    <Link 
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="bg-white rounded-lg shadow-soft p-6 text-center transition duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="text-4xl mb-4">{category.icon || '📦'}</div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          {getCategoryStoreCount(category.slug)} {getCategoryStoreCount(category.slug) === 1 ? 'store' : 'stores'}
                        </p>
                        {getFeaturedStoreCount(category.slug) > 0 && (
                          <p className="text-xs flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {getFeaturedStoreCount(category.slug)} featured
                          </p>
                        )}
                      </div>
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

export default AllCategories;
