
import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import AdvertisementBanner from './AdvertisementBanner';

// Types for the ad data
interface AdItem {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  imageUrl?: string;
}

interface AdsCarouselProps {
  ads: AdItem[];
}

const AdsCarousel: React.FC<AdsCarouselProps> = ({ ads }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative rounded-xl overflow-hidden">
      <Carousel 
        className="w-full" 
        opts={{
          loop: true,
          align: "start",
        }}
        onSelect={(api) => {
          // Fix: Properly access the selectedScrollSnap method from the carousel API
          if (api) {
            setActiveIndex(api.selectedScrollSnap());
          }
        }}
      >
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <AdvertisementBanner
                title={ad.title}
                description={ad.description}
                ctaText={ad.ctaText}
                ctaLink={ad.ctaLink}
                bgColor={ad.bgColor}
                imageUrl={ad.imageUrl}
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
