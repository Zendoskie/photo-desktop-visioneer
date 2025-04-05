
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const IntroPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-appDark p-8 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-appGreen mb-4 tracking-tighter relative">
          <span className="relative inline-block">
            KompyuThink
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-appGreen opacity-50 rounded-full"></span>
          </span>
        </h1>
        <p className="text-xl text-appText max-w-2xl mx-auto">
          Evaluation solution for computer literacy subject
        </p>
      </div>
      
      <div className="relative mt-8">
        <Button 
          asChild
          className="app-button bg-appBlue hover:bg-opacity-80 border border-appBorder text-appGreen text-lg px-8 py-6 transition-all duration-300"
        >
          <Link to="/evaluate">
            Get Started <ChevronRight className="ml-2" />
          </Link>
        </Button>
        <div className="absolute -bottom-12 left-0 right-0 text-appText text-sm opacity-70 text-center">
          Analyze and evaluate computer science concepts
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="text-appText text-sm opacity-70">
          © 2025 KompyuThink - All rights reserved
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
