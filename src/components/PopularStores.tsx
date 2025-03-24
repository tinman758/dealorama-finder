
import React from 'react';
import { Link } from 'react-router-dom';
import { useStores } from '@/hooks/useStores';
import { Loader2 } from 'lucide-react';

const PopularStores = () => {
  const { stores: featuredStores, loading } = useStores({ featured: true, limit: 8 });

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular Stores</h2>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Stores</h2>
          <Link to="/all-stores" className="text-sm font-medium text-deal hover:underline">
            View All Stores &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredStores.map(store => (
            <Link key={store.id} to={`/store/${store.id}`} className="group">
              <div className="bg-white rounded-lg shadow-soft p-4 h-full hover:shadow-medium transition-shadow flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-3 rounded-full flex items-center justify-center overflow-hidden bg-white border border-gray-100">
                  <img 
                    src={store.logo} 
                    alt={store.name} 
                    className="w-14 h-14 object-contain p-1" 
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-deal transition-colors">
                  {store.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {store.dealCount} deals available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularStores;
