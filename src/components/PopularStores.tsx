
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getFeaturedStores } from '../data/stores';

const PopularStores = () => {
  const popularStores = getFeaturedStores();
  
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container-fluid">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Stores</h2>
          <Link 
            to="/stores" 
            className="flex items-center text-deal font-medium hover:underline"
          >
            View all stores
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {popularStores.map((store, index) => (
            <Link 
              key={store.id}
              to={`/store/${store.id}`}
              className="animate-hover"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="h-16 w-16 flex items-center justify-center mb-4">
                  <img 
                    src={store.logo} 
                    alt={store.name} 
                    className="max-h-12 max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{store.name}</h3>
                <p className="text-xs text-gray-600">{store.dealCount} deals available</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularStores;
