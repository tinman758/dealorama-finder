
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

  return (
    <Link to="/" className={`flex items-center focus-ring rounded-md ${className}`}>
      <img 
        src="/lovable-uploads/6087497a-9952-44a6-a323-e9cb8bbaa18c.png"
        alt="Penny Pinch"
        className={`${sizeClasses[size]} w-auto`}
      />
    </Link>
  );
};

export default PennyLogo;
