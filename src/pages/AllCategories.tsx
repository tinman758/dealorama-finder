
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

const AllCategories = () => {
  const uniqueCategories = getUniqueCategories();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-fluid">
          <h1 className="text-3xl font-bold mb-8">All Categories</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {uniqueCategories.map((category) => (
              <Link 
                key={category}
                to={`/category/${category}`}
                className="bg-white rounded-lg shadow-soft p-6 text-center transition duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{getCategoryIcon(category)}</div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {formatCategoryName(category)}
                </h3>
                <p className="text-sm text-gray-500">
                  {getCategoryCount(category)} {getCategoryCount(category) === 1 ? 'store' : 'stores'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllCategories;
