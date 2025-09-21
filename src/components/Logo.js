"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const Logo = ({ 
  className = "h-20 lg:h-25 w-auto", 
  useScrollAnimation = false,
  backgroundType = "white" 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!useScrollAnimation) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [useScrollAnimation]);

  // Determine which logo to show
  const getLogoSrc = () => {
    if (!useScrollAnimation) {
      // Static logo based on background type
      return backgroundType === "glass" ? "/mfq58683-em0giqm.png" : "/mfq58683-em0giqm.png";
    }
    
    // Animated logo based on scroll
    return isScrolled ? "/mfq58683-em0giqm.png" : "/mfq58683-em0giqm.png";
  };

  return (
    <div className="flex-shrink-0">
      <Image
        src={getLogoSrc()}
        alt="Logo"
        width={411}
        height={100}
        className={`${className} transition-all duration-300`}
      />
    </div>
  );
};

export default Logo;