
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="w-16 h-16 border-4 border-t-deal rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      
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
            <p className="text-sm text-muted-foreground">
              Click the heart icon on any deal to save it for later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesPage;
