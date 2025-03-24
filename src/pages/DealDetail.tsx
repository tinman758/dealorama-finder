
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Copy, ExternalLink, Heart, Tag, Clock, ArrowLeftCircle, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDeal } from '@/hooks/useDeals';
import { useStore } from '@/hooks/useStores';
import { useDeals } from '@/hooks/useDeals';
import DealCard from '@/components/DealCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { deal, loading: dealLoading, error } = useDeal(id || '');
  const { store, loading: storeLoading } = useStore(deal?.storeId || '');
  const { deals: relatedDeals, loading: relatedLoading } = useDeals({ 
    storeId: deal?.storeId,
    limit: 4
  });
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && deal) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('deal_id', deal.id)
            .single();
            
          if (!error && data) {
            setIsFavorited(true);
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [user, deal]);
  
  const copyCode = () => {
    if (deal?.code) {
      navigator.clipboard.writeText(deal.code);
      setCopied(true);
      toast({
        title: "Success",
        description: "Code copied to clipboard!",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };
  
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive"
      });
      return;
    }
    
    if (!deal) return;
    
    setIsToggling(true);
    
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('deal_id', deal.id);
          
        if (error) throw error;
        
        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: "Deal has been removed from your favorites"
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, deal_id: deal.id });
          
        if (error) throw error;
        
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: "Deal has been added to your favorites"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };
  
  const expiryDate = deal?.expiryDate 
    ? new Date(deal.expiryDate).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }) 
    : null;
  
  const isProductDeal = deal?.type === 'product';
  
  if (dealLoading || storeLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-24 w-full mb-6" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !deal) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Deal Not Found</h2>
          <p className="text-gray-600 mb-8">The deal you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/deals">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse All Deals
            </Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/deals" className="inline-flex items-center text-sm text-gray-600 hover:text-deal">
              <ArrowLeftCircle className="mr-1 h-4 w-4" />
              Back to all deals
            </Link>
          </div>
          
          {/* Main Deal Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              {/* Store information */}
              {store && (
                <div className="flex items-center mb-6">
                  <img 
                    src={store.logo} 
                    alt={store.name} 
                    className="h-10 w-10 rounded-full object-contain bg-white p-1 border border-gray-100" 
                  />
                  <div className="ml-3">
                    <Link 
                      to={`/store/${store.id}`}
                      className="font-medium text-gray-900 hover:text-deal"
                    >
                      {store.name}
                    </Link>
                    <div className="text-sm text-gray-500">{store.category}</div>
                  </div>
                  
                  {deal.verified && (
                    <span className="ml-auto flex items-center text-green-600 text-sm">
                      <Check className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              )}
              
              {/* Deal Badge */}
              <div className="inline-block bg-deal/10 text-deal font-medium px-3 py-1 rounded-full text-sm mb-4">
                {deal.discount}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{deal.title}</h1>
              
              <div className="prose max-w-none text-gray-600 mb-6">
                <p>{deal.description}</p>
              </div>
              
              {/* Product Price (for product deals) */}
              {isProductDeal && deal.price && (
                <div className="mb-6 flex items-baseline">
                  <span className="text-3xl font-bold text-deal">{deal.price}</span>
                  {deal.originalPrice && (
                    <span className="ml-3 text-xl text-gray-500 line-through">{deal.originalPrice}</span>
                  )}
                </div>
              )}
              
              {/* Expiry Information */}
              {expiryDate && (
                <div className="flex items-center text-sm text-gray-600 mb-6">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Expires on {expiryDate}</span>
                </div>
              )}
              
              {/* Deal Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {deal.code ? (
                  <Button 
                    size="lg"
                    className="flex-1"
                    onClick={copyCode}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-5 w-5" />
                        {deal.code}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    className="flex-1"
                    asChild
                  >
                    <a 
                      href={deal.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {isProductDeal ? (
                        <>
                          <Tag className="mr-2 h-5 w-5" />
                          Buy Now
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Get Deal
                        </>
                      )}
                    </a>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 ${isFavorited ? 'bg-red-50 border-red-200' : ''}`}
                  onClick={toggleFavorite}
                  disabled={isToggling}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* More Deals from Store */}
          {store && relatedDeals.length > 1 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">More Deals from {store.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedDeals
                  .filter(relatedDeal => relatedDeal.id !== deal.id)
                  .slice(0, 3)
                  .map(relatedDeal => (
                    <DealCard key={relatedDeal.id} deal={relatedDeal} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DealDetail;
