import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Copy, ExternalLink, Heart, Tag } from 'lucide-react';
import { Deal } from '../types';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStores';
import { Skeleton } from '@/components/ui/skeleton';
import { favorites as staticFavorites } from '@/data/staticData';

interface DealCardProps {
  deal: Deal;
  featured?: boolean;
  onFavoriteToggle?: (dealId: string, isFavorited: boolean) => void;
  initiallyFavorited?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  featured = false, 
  onFavoriteToggle,
  initiallyFavorited = false
}) => {
  const { store, loading: storeLoading } = useStore(deal.storeId);
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if deal is favorited when component mounts
  useEffect(() => {
    const checkFavoriteStatus = () => {
      if (user) {
        // Check if this deal is in the user's favorites
        const isFavorite = staticFavorites.some(
          fav => fav.userId === user.id && fav.dealId === deal.id
        );
        
        setIsFavorited(isFavorite);
      }
    };
    
    if (!initiallyFavorited) {
      checkFavoriteStatus();
    } else {
      setIsFavorited(true);
    }
  }, [user, deal.id, initiallyFavorited]);
  
  const formattedDate = deal.expiryDate 
    ? new Date(deal.expiryDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }) 
    : null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Success",
      description: "Code copied to clipboard!",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDealClick = (e: React.MouseEvent) => {
    // If this is a code deal and we're clicking the card (not the code button),
    // prevent navigation and show the code
    if (deal.code && !e.currentTarget.matches('.deal-code-btn, .deal-code-btn *, .favorite-btn, .favorite-btn *')) {
      e.preventDefault();
      document.getElementById(`deal-code-${deal.id}`)?.click();
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a static app, we just toggle the UI state without persisting changes
      setIsFavorited(!isFavorited);
      
      if (isFavorited) {
        toast({
          title: "Removed from favorites",
          description: "Deal has been removed from your favorites"
        });
      } else {
        toast({
          title: "Added to favorites",
          description: "Deal has been added to your favorites"
        });
      }
      
      // Notify parent if callback is provided
      if (onFavoriteToggle) {
        onFavoriteToggle(deal.id, !isFavorited);
      }
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if this is a product-type deal
  const isProductDeal = deal.type === 'product';

  return (
    <div 
      className={`
        group relative overflow-hidden rounded-lg bg-white border border-gray-100 
        transition-all duration-300 hover:shadow-glossy ${featured ? 'shadow-medium' : 'shadow-soft'}
        flex flex-col h-full
      `}
    >
      {/* Favorite button */}
      <button
        className="favorite-btn absolute top-3 right-3 z-20 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
        onClick={toggleFavorite}
        disabled={isLoading}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={`h-5 w-5 ${
            isFavorited 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-400 hover:text-gray-600'
          } ${isLoading ? 'opacity-50' : ''}`} 
        />
      </button>
      
      <Link 
        to={`/deal/${deal.id}`} 
        className="block flex-grow" 
        onClick={handleDealClick}
      >
        <div className="p-4 flex-grow flex flex-col">
          {/* Store Logo */}
          {storeLoading ? (
            <div className="flex items-center mb-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="ml-2 h-4 w-24" />
            </div>
          ) : store ? (
            <div className="flex items-center mb-3">
              <img 
                src={store.logo} 
                alt={store.name} 
                className="h-7 w-7 rounded-full object-contain bg-white p-1 border border-gray-100" 
              />
              <span className="ml-2 text-sm font-medium text-gray-700">{store.name}</span>
              
              {/* Verified badge - moved to the left side for better spacing */}
              {deal.verified && (
                <span className="ml-2 flex items-center text-xs text-green-600 font-medium">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Verified
                </span>
              )}
            </div>
          ) : null}
          
          {/* Deal Content */}
          <div className="mb-3 flex-grow">
            <div className="flex mb-1.5">
              <span className="deal-badge">{deal.discount}</span>
              {formattedDate && (
                <span className="text-xs text-gray-500 ml-auto">
                  Expires {formattedDate}
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-900 mb-1 truncate-2-lines">
              {deal.title}
            </h3>
            <p className="text-sm text-gray-600 truncate-2-lines">
              {deal.description}
            </p>
            
            {/* Product Price Display */}
            {isProductDeal && deal.price && (
              <div className="mt-2 flex items-baseline">
                <span className="text-lg font-bold text-deal">{deal.price}</span>
                {deal.originalPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                )}
              </div>
            )}
          </div>
          
          {/* Used Count */}
          {deal.usedCount ? (
            <div className="text-xs text-gray-500 mb-2">
              Used {deal.usedCount.toLocaleString()} times
            </div>
          ) : null}
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-deal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      
      {/* Deal Code, Link, or Product Button */}
      <div className="mt-auto border-t border-gray-100 w-full">
        {deal.code ? (
          <button
            id={`deal-code-${deal.id}`}
            className="deal-code-btn flex items-center justify-between w-full p-3 text-left transition-colors hover:bg-gray-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copyCode(deal.code!);
            }}
          >
            <div className="text-gray-600 font-medium">
              <span className="text-xs uppercase mr-1">CODE:</span>
              <span className="font-mono">{deal.code}</span>
            </div>
            <div className="flex items-center text-xs font-medium text-deal">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  <span>Copy</span>
                </>
              )}
            </div>
          </button>
        ) : isProductDeal ? (
          <div className="p-3">
            <a 
              href={deal.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="deal-button w-full flex items-center justify-center"
            >
              <span>Buy Now</span>
              <Tag className="h-4 w-4 ml-1" />
            </a>
          </div>
        ) : (
          <div className="p-3">
            <a 
              href={deal.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="deal-button w-full flex items-center justify-center"
            >
              <span>Get Deal</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCard;
