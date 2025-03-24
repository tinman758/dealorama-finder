
import React from 'react';
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
  return (
    <Carousel className="relative">
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
      <CarouselPrevious className="left-2 lg:left-4" />
      <CarouselNext className="right-2 lg:right-4" />
    </Carousel>
  );
};

export default AdsCarousel;
