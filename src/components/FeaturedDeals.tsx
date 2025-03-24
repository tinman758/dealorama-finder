
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import DealCard from './DealCard';
import { getFeaturedDeals } from '../data/deals';

const FeaturedDeals = () => {
  const [visibleDeals, setVisibleDeals] = useState(4);
  const featuredDeals = getFeaturedDeals();
  
  // Ensure at least one product deal is shown in the featured section
  const hasProductDeal = featuredDeals.slice(0, visibleDeals).some(deal => deal.type === 'product');
  
  // If no product deal in visible deals, replace the last visible deal with a product deal
  let displayDeals = [...featuredDeals.slice(0, visibleDeals)];
  
  if (!hasProductDeal) {
    const productDeal = featuredDeals.find(deal => deal.type === 'product');
    if (productDeal) {
      displayDeals[displayDeals.length - 1] = productDeal;
    }
  }
  
  return (
    <section className="py-12 sm:py-16">
      <div className="container-fluid">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Deals</h2>
          <Link 
            to="/deals" 
            className="flex items-center text-deal font-medium hover:underline"
          >
            View all deals
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayDeals.map(deal => (
            <div key={deal.id} className="animate-slide-in" style={{ animationDelay: `${parseInt(deal.id) * 100}ms` }}>
              <DealCard deal={deal} featured={true} />
            </div>
          ))}
        </div>
        
        {visibleDeals < featuredDeals.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleDeals(prevCount => Math.min(prevCount + 4, featuredDeals.length))}
              className="deal-button mx-auto"
            >
              Show More Deals
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDeals;
