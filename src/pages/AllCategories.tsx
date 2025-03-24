import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { stores } from '@/data/stores';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

// Get unique categories from stores data
const getUniqueCategories = () => {
  const categories = stores.map(store => store.category);
  const uniqueCategories = [...new Set(categories)];
  return uniqueCategories;
};

// Count stores per category
const getCategoryCount = (category: string, featuredOnly: boolean = false) => {
  if (featuredOnly) {
    return stores.filter(store => store.category === category && store.featured).length;
  }
  return stores.filter(store => store.category === category).length;
};

// Get featured stores count per category
const getFeaturedStoreCount = (category: string) => {
  return stores.filter(store => store.category === category && store.featured).length;
};

// Get icon based on category name
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'electronics':
      return '🖥️';
    case 'fashion':
      return '👕';
    case 'beauty':
      return '💄';
    case 'food':
      return '🍔';
    case 'travel':
      return '✈️';
    case 'home':
      return '🏠';
    case 'general':
      return '🛒';
    default:
      return '📦';
  }
};

// Capitalize first letter of each word
const formatCategoryName = (category: string) => {
  return category.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AllCategories = () => {
  const uniqueCategories = getUniqueCategories();
  const [showFeatured, setShowFeatured] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(uniqueCategories);
  
  // Apply filter when featured toggle changes
  useEffect(() => {
    if (showFeatured) {
      // Only keep categories that have featured stores
      setFilteredCategories(uniqueCategories.filter(category => 
        getFeaturedStoreCount(category) > 0
      ));
    } else {
      setFilteredCategories(uniqueCategories);
    }
  }, [showFeatured]);
  
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
                  key={category}
                  to={`/category/${category}`}
                  className="bg-white rounded-lg shadow-soft p-6 text-center transition duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{getCategoryIcon(category)}</div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {formatCategoryName(category)}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      {getCategoryCount(category)} {getCategoryCount(category) === 1 ? 'store' : 'stores'}
                    </p>
                    {getFeaturedStoreCount(category) > 0 && (
                      <p className="text-xs flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {getFeaturedStoreCount(category)} featured
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllCategories;
