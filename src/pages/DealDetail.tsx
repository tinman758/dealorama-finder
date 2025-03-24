
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Check, ExternalLink, Clock, ArrowLeft } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';
import { getDealById, getDealsForStore } from '@/data/deals';
import { getStoreById } from '@/data/stores';
import { Deal } from '@/types';

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const dealData = getDealById(id);
      if (dealData) {
        setDeal(dealData);
        
        // Get related deals from same store
        const storeDeals = getDealsForStore(dealData.storeId)
          .filter(d => d.id !== id)
          .slice(0, 3);
          
        setRelatedDeals(storeDeals);
      }
      
      // Simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [id]);
  
  const store = deal ? getStoreById(deal.storeId) : null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 container-fluid animate-pulse">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 h-10 w-40 mb-6 rounded"></div>
            <div className="bg-gray-200 h-8 w-3/4 mb-4 rounded"></div>
            <div className="bg-gray-200 h-8 w-1/2 mb-8 rounded"></div>
            <div className="bg-white shadow-soft rounded-lg p-8 mb-8">
              <div className="bg-gray-200 h-12 w-full mb-6 rounded"></div>
              <div className="bg-gray-200 h-24 w-full mb-8 rounded"></div>
              <div className="bg-gray-200 h-12 w-full rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 container-fluid">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Deal Not Found</h1>
            <p className="text-gray-600 mb-8">The deal you're looking for doesn't exist or has expired.</p>
            <Link to="/" className="deal-button inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formattedDate = deal.expiryDate 
    ? new Date(deal.expiryDate).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }) 
    : null;
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      <main className="flex-grow py-12 sm:py-16 container-fluid">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-deal">Home</Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              {store && (
                <>
                  <li>
                    <Link to={`/store/${store.id}`} className="hover:text-deal">{store.name}</Link>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                </>
              )}
              <li className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                {deal.title}
              </li>
            </ol>
          </nav>
          
          {/* Deal Title */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{deal.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3">
              {deal.verified && (
                <span className="inline-flex items-center text-sm text-green-600 font-medium">
                  <Check className="h-4 w-4 mr-1" />
                  Verified Deal
                </span>
              )}
              
              {formattedDate && (
                <span className="inline-flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Expires {formattedDate}
                </span>
              )}
              
              {deal.usedCount && (
                <span className="text-sm text-gray-600">
                  Used {deal.usedCount.toLocaleString()} times
                </span>
              )}
            </div>
          </div>
          
          {/* Deal Card */}
          <div className="bg-white shadow-medium rounded-lg overflow-hidden mb-10 animate-scale-in">
            {/* Store Header */}
            {store && (
              <div className="p-6 flex items-center border-b border-gray-100">
                <div className="flex items-center">
                  <img 
                    src={store.logo} 
                    alt={store.name} 
                    className="h-10 w-10 rounded-full bg-white p-1 border border-gray-100 object-contain" 
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{store.name}</h3>
                    <Link 
                      to={`/store/${store.id}`}
                      className="text-sm text-deal hover:underline"
                    >
                      View all {store.dealCount} deals
                    </Link>
                  </div>
                </div>
                <span className="ml-auto deal-badge text-base font-medium px-3 py-1">{deal.discount}</span>
              </div>
            )}
            
            {/* Deal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                {deal.description}
              </p>
              
              {/* Deal Action */}
              {deal.code ? (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Copy this code and use it at checkout:</p>
                  <div className="flex rounded-md overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 flex-grow p-3 font-mono text-gray-900 text-center">
                      {deal.code}
                    </div>
                    <button
                      onClick={() => copyCode(deal.code!)}
                      className="bg-deal hover:bg-deal-hover text-white font-medium px-4 flex items-center transition-colors focus:outline-none"
                    >
                      {copied ? (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-5 w-5 mr-2" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Click the button below to get this deal:</p>
                </div>
              )}
              
              <a 
                href={deal.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="deal-button w-full flex items-center justify-center"
              >
                <span>{deal.code ? "Go to Store" : "Get Deal"}</span>
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                {deal.code 
                  ? "Don't forget to apply the code at checkout to get your discount."
                  : "This special deal will be automatically applied at checkout."}
              </p>
            </div>
          </div>
          
          {/* Related Deals */}
          {relatedDeals.length > 0 && (
            <div className="my-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Deals</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDeals.map(relatedDeal => (
                  <DealCard key={relatedDeal.id} deal={relatedDeal} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DealDetail;
