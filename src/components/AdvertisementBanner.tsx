
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdvertisementBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  textColor?: string;
  imageUrl?: string;
}

const AdvertisementBanner = ({
  title,
  description,
  ctaText,
  ctaLink,
  bgColor = "bg-deal",
  textColor = "text-white",
  imageUrl
}: AdvertisementBannerProps) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-soft ${bgColor} ${textColor}`}>
      <div className="container-fluid">
        <div className="py-8 px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-lg opacity-90 mb-6 max-w-xl">{description}</p>
            <Button
              variant="outline"
              className="border-2 border-current hover:bg-white/10 text-black"
              asChild
            >
              <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                {ctaText}
              </a>
            </Button>
          </div>
          
          {imageUrl && (
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-auto max-h-48 object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementBanner;
