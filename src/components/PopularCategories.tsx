
import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from '@/types';
import { stores } from '@/data/stores';

// Get unique categories from stores data
const getUniqueCategories = () => {
  const categories = stores.map(store => store.category);
  const uniqueCategories = [...new Set(categories)];
  return uniqueCategories;
};

// Count stores per category
const getCategoryCount = (category: string) => {
  return stores.filter(store => store.category === category).length;
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

const PopularCategories = () => {
  const uniqueCategories = getUniqueCategories();
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-fluid">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
          <Link to="/categories" className="text-deal font-medium hover:underline">
            View all categories
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {uniqueCategories.map((category) => (
            <Link 
              key={category}
              to={`/category/${category}`}
              className="bg-white rounded-lg shadow-soft p-4 text-center transition duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
              <h3 className="font-medium text-gray-900 mb-1">
                {formatCategoryName(category)}
              </h3>
              <p className="text-sm text-gray-500">
                {getCategoryCount(category)} {getCategoryCount(category) === 1 ? 'store' : 'stores'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
