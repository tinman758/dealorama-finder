
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, ExternalLink, Tag } from 'lucide-react';
import { Deal } from '../types';
import { getStoreById } from '../data/stores';
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface DealCardProps {
  deal: Deal;
  featured?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ deal, featured = false }) => {
  const store = getStoreById(deal.storeId);
  const [copied, setCopied] = useState(false);
  
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
    if (deal.code && !e.currentTarget.matches('.deal-code-btn, .deal-code-btn *')) {
      e.preventDefault();
      document.getElementById(`deal-code-${deal.id}`)?.click();
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
      <Link 
        to={`/deal/${deal.id}`} 
        className="block flex-grow" 
        onClick={handleDealClick}
      >
        {/* Product Image for Product Deals */}
        {isProductDeal && deal.productImage && (
          <div className="relative w-full overflow-hidden bg-gray-50 h-36">
            <div className="w-full h-full flex items-center justify-center p-2">
              <img 
                src={deal.productImage} 
                alt={deal.title} 
                className="max-h-full max-w-full object-contain" 
              />
              <div className="absolute top-2 left-2 bg-deal text-white text-xs font-bold px-2 py-1 rounded">
                {deal.discount}
              </div>
            </div>
          </div>
        )}
        
        <div className="p-5 flex-grow flex flex-col">
          {/* Store Logo */}
          {store && (
            <div className="flex items-center mb-4">
              <img 
                src={store.logo} 
                alt={store.name} 
                className="h-8 w-8 rounded-full object-contain bg-white p-1 border border-gray-100" 
              />
              <span className="ml-2 text-sm font-medium text-gray-700">{store.name}</span>
              
              {deal.verified && (
                <span className="ml-auto flex items-center text-xs text-green-600 font-medium">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Verified
                </span>
              )}
            </div>
          )}
          
          {/* Deal Content */}
          <div className="mb-4 flex-grow">
            <div className="flex mb-2">
              {!isProductDeal && <span className="deal-badge">{deal.discount}</span>}
              {formattedDate && (
                <span className={`text-xs text-gray-500 ${!isProductDeal ? 'ml-auto' : ''}`}>
                  Expires {formattedDate}
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-900 mb-1 truncate-2-lines">
              {deal.title}
            </h3>
            <p className="text-sm text-gray-600 truncate-3-lines">
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
          {deal.usedCount && (
            <div className="text-xs text-gray-500 mb-4">
              Used {deal.usedCount.toLocaleString()} times
            </div>
          )}
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-deal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      
      {/* Deal Code, Link, or Product Button */}
      <div className="mt-auto border-t border-gray-100 w-full">
        {deal.code ? (
          <button
            id={`deal-code-${deal.id}`}
            className="deal-code-btn flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-gray-50"
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
          <div className="p-4">
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
          <div className="p-4">
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
