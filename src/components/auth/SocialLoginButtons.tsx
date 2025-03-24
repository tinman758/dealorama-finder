
import React from 'react';

interface SocialLoginButtonsProps {
  action: 'login' | 'signup';
}

// Empty component since we're removing all social login functionality
const SocialLoginButtons = ({ action }: SocialLoginButtonsProps) => {
  return null;
};

export default SocialLoginButtons;
