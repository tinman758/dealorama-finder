
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
      <div className="flex items-center">
        <div className="bg-penny-blue text-white font-bold rounded-md p-1 mr-2">
          <span className="text-xl">PP</span>
        </div>
        <span className="font-semibold text-gray-800 text-lg">PennyPinch</span>
      </div>
    </Link>
  );
};

export default PennyLogo;
