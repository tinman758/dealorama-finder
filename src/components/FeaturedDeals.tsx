
import React from 'react';
import DealCard from './DealCard';
import { Link } from 'react-router-dom';
import { useDeals } from '@/hooks/useDeals';
import { Loader2 } from 'lucide-react';

const FeaturedDeals = () => {
  const { deals: allFeaturedDeals, loading } = useDeals({ featured: true, limit: 12 });

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Deals</h2>
          
          <Link to="/deals" className="text-sm font-medium text-deal hover:underline">
            View All Deals &rarr;
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allFeaturedDeals.slice(0, 8).map(deal => (
              <DealCard key={deal.id} deal={deal} featured={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDeals;
