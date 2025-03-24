
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
  bgColor = "bg-gradient-to-r from-deal to-blue-600",
  textColor = "text-white",
  imageUrl
}: AdvertisementBannerProps) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-xl ${imageUrl ? 'h-[340px] md:h-[380px]' : 'h-[300px]'} w-full`} 
      style={{ background: bgColor.startsWith('bg-') ? undefined : bgColor }}
    >
      {imageUrl && (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 max-w-2xl">
        <div className={`${textColor}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-md">{description}</p>
          
          <Button
            className="group bg-white text-deal-dark hover:bg-white/90 font-medium rounded-full px-6 py-6 h-auto flex items-center gap-2 shadow-lg transform transition-all duration-300 hover:scale-105"
            asChild
          >
            <a href={ctaLink} target="_blank" rel="noopener noreferrer">
              {ctaText}
              <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
      
      {/* Modern decorative element */}
      <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm" />
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5 backdrop-blur-sm" />
    </div>
  );
};

export default AdvertisementBanner;
