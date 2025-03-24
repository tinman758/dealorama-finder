
import React, { useState, useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import AdvertisementBanner from './AdvertisementBanner';
import { supabase } from '@/integrations/supabase/client';

// Types for the ad data
interface AdItem {
  id: string;
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
  bg_color?: string;
  image_url?: string;
}

interface AdsCarouselProps {
  ads?: AdItem[]; // Make ads optional to support both prop-based and database-based usage
}

const AdsCarousel: React.FC<AdsCarouselProps> = ({ ads: propAds }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dbAds, setDbAds] = useState<AdItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use either the provided ads or fetch from the database
  const ads = propAds || dbAds;

  // Fetch ads from the database if no ads were provided via props
  useEffect(() => {
    if (!propAds) {
      const fetchAds = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('advertisements')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

          if (error) {
            throw error;
          }

          // Map database fields to component prop format
          const formattedAds = data.map(ad => ({
            id: ad.id,
            title: ad.title,
            description: ad.description,
            cta_text: ad.cta_text,
            cta_link: ad.cta_link,
            bg_color: ad.bg_color,
            image_url: ad.image_url
          }));
          
          setDbAds(formattedAds);
        } catch (err) {
          console.error('Error fetching advertisements:', err);
          setError('Failed to load advertisements');
        } finally {
          setLoading(false);
        }
      };

      fetchAds();
    }
  }, [propAds]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    // Cleanup
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Don't render anything if there are no ads to display
  if (loading) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="animate-pulse">Loading advertisements...</div>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return null; // Don't show anything on error
  }

  if (!ads || ads.length === 0) {
    return null; // Don't show anything if no ads
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      <Carousel 
        className="w-full" 
        opts={{
          loop: true,
          align: "start",
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <AdvertisementBanner
                title={ad.title}
                description={ad.description}
                ctaText={ad.cta_text}
                ctaLink={ad.cta_link}
                bgColor={ad.bg_color}
                imageUrl={ad.image_url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Modern, subtle navigation buttons */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/80 backdrop-blur-sm border-none shadow-md text-gray-800 hover:bg-white hover:scale-105 transition-all" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/80 backdrop-blur-sm border-none shadow-md text-gray-800 hover:bg-white hover:scale-105 transition-all" />
        
        {/* Pagination indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 z-10">
          {ads.map((_, index) => (
            <span
              key={index}
              className={`block transition-all duration-300 ${
                activeIndex === index
                  ? "w-6 h-2 bg-white rounded-full"
                  : "w-2 h-2 bg-white/60 rounded-full"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default AdsCarousel;
