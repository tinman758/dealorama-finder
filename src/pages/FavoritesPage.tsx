import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { Deal } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';
import { deals as staticDeals, favorites as staticFavorites } from '@/data/staticData';

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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get user's favorite deal IDs from static data
        const userFavorites = staticFavorites.filter(fav => fav.userId === user.id);
        
        if (userFavorites.length === 0) {
          setFavoriteDeals([]);
          setIsLoadingFavorites(false);
          return;
        }
        
        // Get the actual deal data
        const favoriteDealsIds = userFavorites.map(fav => fav.dealId);
        const favoriteDealsData = staticDeals.filter(deal => favoriteDealsIds.includes(deal.id));
        
        setFavoriteDeals(favoriteDealsData);
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
    }
  }, [user]);

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
