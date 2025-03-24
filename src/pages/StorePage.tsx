import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Globe, MapPin, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';
import { useDeals } from '@/hooks/useDeals';
import { useStore } from '@/hooks/useStores';
import { Deal } from '@/types';

const StorePage = () => {
  const { id } = useParams<{ id: string }>();
  const { store, loading: storeLoading } = id ? useStore(id) : { store: null, loading: false };
  const { deals: storeDeals, loading: dealsLoading } = useDeals({ storeId: id });
  
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleDeals, setVisibleDeals] = useState(8);
  
  useEffect(() => {
    if (!storeLoading && !dealsLoading) {
      setDeals(storeDeals);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [storeDeals, storeLoading, dealsLoading]);
  
  if (loading || storeLoading || dealsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 container-fluid animate-pulse">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-200 h-16 w-36 mb-6 rounded"></div>
            <div className="bg-gray-200 h-8 w-1/2 mb-4 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white h-64 rounded-lg shadow-soft"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 container-fluid">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Store Not Found</h1>
            <p className="text-gray-600 mb-8">The store you're looking for doesn't exist.</p>
            <Link to="/" className="deal-button inline-flex items-center">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      <main className="flex-grow py-12 sm:py-16 container-fluid">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-10">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-deal">Home</Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <Link to="/stores" className="hover:text-deal">Stores</Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="font-medium text-gray-900">
                {store.name}
              </li>
            </ol>
          </nav>
          
          <div className="mb-8 flex items-center">
            <div className="bg-white p-6 rounded-lg shadow-soft mr-6">
              <img 
                src={store.logo} 
                alt={store.name} 
                className="h-20 w-20 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
              <p className="text-gray-600">
                {store.dealCount} active deals and coupons
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="mr-2 h-5 w-5 text-deal" />
              About {store.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700 mb-4">{store.description}</p>
                
                <div className="flex items-center mb-3">
                  {store.storeType === 'online' ? (
                    <Globe className="h-5 w-5 text-deal mr-2" />
                  ) : store.storeType === 'local' ? (
                    <MapPin className="h-5 w-5 text-deal mr-2" />
                  ) : (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-deal mr-1" />
                      <span className="mx-1">/</span>
                      <MapPin className="h-5 w-5 text-deal ml-1 mr-2" />
                    </div>
                  )}
                  <span className="text-gray-700">
                    {store.storeType === 'online' ? 'Online Store' : 
                     store.storeType === 'local' ? 'Local Store' : 
                     'Online & Local Store'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-deal mr-2" />
                  <span className="text-gray-700">Country: {store.country}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center md:justify-end">
                <a 
                  href={store.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="deal-button"
                >
                  Visit Store
                </a>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Deals</h2>
            
            {deals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {deals.slice(0, visibleDeals).map(deal => (
                    <div key={deal.id} className="animate-slide-in" style={{ animationDelay: `${parseInt(deal.id) * 50}ms` }}>
                      <DealCard deal={deal} />
                    </div>
                  ))}
                </div>
                
                {visibleDeals < deals.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setVisibleDeals(prevCount => Math.min(prevCount + 8, deals.length))}
                      className="deal-button mx-auto"
                    >
                      Load More Deals
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No Active Deals</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no active deals for this store.
                </p>
                <Link to="/" className="deal-button inline-flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Browse Other Deals
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;
