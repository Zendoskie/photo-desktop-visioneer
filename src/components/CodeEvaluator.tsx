
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const CodeEvaluator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (query.trim()) {
      setSubmitted(true);
    }
  };
  
  const handleClear = () => {
    setQuery('');
    setAnswer('');
    setSubmitted(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Panel - Input Console */}
      <div className="w-1/2 border-r border-appBorder p-4 flex flex-col">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
          <span className="text-appText text-sm font-medium ml-2">Input Console</span>
        </div>
        
        <div className="flex flex-col flex-grow">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Question</label>
          </div>
          <Textarea 
            placeholder="Enter your question..."
            className="flex-none h-24 bg-appBlue text-white text-sm border-appBorder resize-none mb-4 focus:ring-appGreen focus:border-appGreen shadow-[0_0_15px_rgba(9,247,160,0.1)] transition-all duration-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Answer</label>
          </div>
          <Textarea 
            placeholder=""
            className="flex-grow bg-appBlue text-white text-sm border-appBorder mb-4 resize-none focus:ring-appGreen focus:border-appGreen shadow-[0_0_15px_rgba(9,247,160,0.1)] transition-all duration-300"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          
          <div className="flex gap-2 mt-auto">
            <Button 
              onClick={handleClear}
              className="app-button flex-1 bg-appBlue hover:bg-opacity-80 border border-appBorder text-appText hover:text-appGreen transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <X size={16} />
              Clear
            </Button>
            <Button 
              onClick={handleSubmit}
              className="app-button flex-1 bg-appBlue hover:bg-opacity-80 border border-appBorder text-appGreen transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-appGreen">✓</span> Evaluate
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Evaluation Results */}
      <div className="w-1/2 p-4 flex flex-col">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-appGreen rounded-full mr-1.5 opacity-70"></div>
          <span className="text-appText text-sm font-medium ml-2">Evaluation Results</span>
        </div>
        
        <div className="mb-4">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Rating</label>
          </div>
          <div className="bg-appBlue border border-appBorder p-3 rounded-md shadow-[0_0_15px_rgba(9,247,160,0.05)]">
            <span className="text-appText text-sm">Not evaluated</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Justification</label>
          </div>
          <div className="bg-appBlue border border-appBorder p-3 rounded-md h-full shadow-[0_0_15px_rgba(9,247,160,0.05)]">
            <span className="text-appText text-sm">No justification provided</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEvaluator;
