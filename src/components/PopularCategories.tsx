
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Tv, 
  Home, 
  ShoppingCart, 
  Plane, 
  Package, 
  DollarSign,
  Shirt
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

// Map of category slugs to icons
const categoryIcons: Record<string, React.ReactNode> = {
  'electronics': <Tv className="h-5 w-5" />,
  'fashion': <Shirt className="h-5 w-5" />,
  'home': <Home className="h-5 w-5" />,
  'travel': <Plane className="h-5 w-5" />,
  'food': <ShoppingCart className="h-5 w-5" />,
  'beauty': <Package className="h-5 w-5" />,
  'general': <ShoppingBag className="h-5 w-5" />,
  'finance': <DollarSign className="h-5 w-5" />
};

const getIconForCategory = (slug: string) => {
  return categoryIcons[slug] || <ShoppingBag className="h-5 w-5" />;
};

const PopularCategories = () => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular Categories</h2>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  // Take up to 8 categories
  const displayCategories = categories.slice(0, 8);
  
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Categories</h2>
          <Link to="/all-categories" className="text-sm font-medium text-deal hover:underline">
            View All Categories &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayCategories.map(category => (
            <Link 
              key={category.id} 
              to={`/category/${category.slug}`}
              className="flex items-center p-4 bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow"
            >
              <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-3 text-gray-700">
                {getIconForCategory(category.slug)}
              </span>
              <span className="font-medium text-gray-900">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
