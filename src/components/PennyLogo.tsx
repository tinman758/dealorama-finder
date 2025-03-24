
import React from 'react';
import { Link } from 'react-router-dom';

interface PennyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

const PennyLogo: React.FC<PennyLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
    xxl: 'h-16'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Only navigate to home if not already on home page
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center focus-ring rounded-md ${className}`}
      onClick={handleClick}
    >
      <img 
        src="/lovable-uploads/6087497a-9952-44a6-a323-e9cb8bbaa18c.png"
        alt="Penny Pinch"
        className={`${sizeClasses[size]} w-auto`}
      />
    </Link>
  );
};

export default PennyLogo;
