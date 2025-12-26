import React from 'react';
import stemstersLogo from '@/assets/stemsters-logo.png';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-3 sm:mb-4 animate-fade-in">
      <img 
        src={stemstersLogo} 
        alt="STEMsters Logo" 
        className="h-12 sm:h-16 w-auto"
      />
    </div>
  );
};

export default Logo;