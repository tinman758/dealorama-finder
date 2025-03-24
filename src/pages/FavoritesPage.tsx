
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';

const FavoritesPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [favoriteDeals, setFavoriteDeals] = useState<Deal[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        setIsLoadingFavorites(true);
        
        // First get favorite deal IDs - explicitly specify user_id column to avoid ambiguity
        const { data: favoriteData, error: favoriteError } = await supabase
          .from('favorites')
          .select('deal_id')
          .eq('user_id', user.id);
          
        if (favoriteError) throw favoriteError;
        
        if (!favoriteData || favoriteData.length === 0) {
          setFavoriteDeals([]);
          setIsLoadingFavorites(false);
          return;
        }
        
        // Get the actual deal data from the deals table
        const dealIds = favoriteData.map(fav => fav.deal_id);
        
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('*')
          .in('id', dealIds);
          
        if (dealsError) throw dealsError;
        
        // Map the database columns to our interface properties
        const mappedDeals = (dealsData || []).map(deal => ({
          id: deal.id,
          title: deal.title,
          description: deal.description,
          code: deal.code || undefined,
          discount: deal.discount,
          expiryDate: deal.expiry_date || undefined,
          storeId: deal.store_id,
          verified: deal.verified || false,
          featured: deal.featured || false,
          url: deal.url,
          image: deal.image || undefined,
          category: deal.category,
          usedCount: deal.used_count || 0,
          type: deal.type as 'code' | 'link' | 'product' || 'code',
          price: deal.price || undefined,
          originalPrice: deal.original_price || undefined,
          productImage: deal.product_image || undefined
        }));
        
        setFavoriteDeals(mappedDeals);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast({
          title: "Error",
          description: "Failed to load your favorite deals",
          variant: "destructive"
        });
      } finally {
        setIsLoadingFavorites(false);
      }
    };
    
    if (user) {
      fetchFavorites();
      
      // Set up realtime subscription for favorites - explicitly specify favorites table
      const channel = supabase
        .channel('favorites-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'favorites',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            // Refetch favorites when there's a change
            fetchFavorites();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);

  const handleFavoriteToggle = (dealId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      // Deal was removed from favorites - remove it from the state
      setFavoriteDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
    }
  };

  if (isLoading || isLoadingFavorites) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-16rem)]">
          <div className="w-16 h-16 border-4 border-t-deal rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        
        {favoriteDeals.length > 0 ? (
          <>
            <div className="mb-6 text-gray-600">
              You have {favoriteDeals.length} saved {favoriteDeals.length === 1 ? 'deal' : 'deals'}.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {favoriteDeals.map(deal => (
                <DealCard 
                  key={deal.id} 
                  deal={deal} 
                  initiallyFavorited={true}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Saved Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
                <p className="mt-4 text-muted-foreground">You haven't saved any deals yet.</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Click the heart icon on any deal to save it for later.
                </p>
                <Button asChild>
                  <Link to="/deals" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Browse Deals
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FavoritesPage;
