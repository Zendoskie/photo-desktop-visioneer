
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';

const CodeEvaluator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (query.trim()) {
      setSubmitted(true);
    }
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
            className="flex-none h-24 bg-appBlue text-white text-sm border-appBorder resize-none mb-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Answer</label>
          </div>
          <Textarea 
            placeholder=""
            className="flex-grow bg-appBlue text-white text-sm border-appBorder mb-4 resize-none"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          
          <Button 
            onClick={handleSubmit}
            className={cn(
              "app-button mt-auto w-full bg-appBlue hover:bg-opacity-80 border border-appBorder text-appGreen",
              "flex items-center justify-center gap-2"
            )}
          >
            <span className="text-appGreen">✓</span> Evaluate
          </Button>
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
          <div className="bg-appBlue border border-appBorder p-3 rounded-md">
            <span className="text-appText text-sm">Not evaluated</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Justification</label>
          </div>
          <div className="bg-appBlue border border-appBorder p-3 rounded-md h-full">
            <span className="text-appText text-sm">No justification provided</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEvaluator;
