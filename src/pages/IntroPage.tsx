
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';

const IntroPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-appDark p-4 sm:p-8 animate-fadeIn">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="text-center mb-8 sm:mb-12">
        <h1 className={`text-4xl sm:text-6xl font-bold text-appGreen mb-4 tracking-tighter relative ${isMobile ? 'px-2' : ''}`}>
          <span className="relative inline-block">
            OpenE
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-appGreen opacity-50 rounded-full"></span>
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-foreground max-w-2xl mx-auto px-4">
          Evaluation solution for computer literacy subject
        </p>
      </div>
      
      <div className="relative mt-6 sm:mt-8">
        <Button 
          asChild
          className="app-button bg-appBlue hover:bg-opacity-80 border border-appBorder text-appGreen text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300"
        >
          <Link to="/evaluate">
            Get Started <ChevronRight className="ml-2" />
          </Link>
        </Button>
        <div className="absolute -bottom-10 sm:-bottom-12 left-0 right-0 text-foreground text-xs sm:text-sm opacity-70 text-center">
          Analyze and evaluate computer science concepts
        </div>
      </div>
      
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center">
        <div className="text-foreground text-xs sm:text-sm opacity-70">
          © 2025 OpenE - All rights reserved
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
