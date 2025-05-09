import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, HelpCircle, PanelLeft, PanelRight, Volume2, MessageCircle, Mic } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
const CodeEvaluator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState('');
  const [justification, setJustification] = useState('');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<'query' | 'answer' | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Speech recognition setup
  const startSpeechRecognition = (field: 'query' | 'answer') => {
    setActiveField(field);
    setIsListening(true);

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = () => {
        console.log('Speech recognition started');
      };
      recognition.onresult = event => {
        const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
        if (field === 'query') {
          setQuery(transcript);
        } else if (field === 'answer') {
          setAnswer(transcript);
        }
      };
      recognition.onerror = event => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setActiveField(null);
      };
      recognition.start();

      // Stop recognition after 10 seconds
      setTimeout(() => {
        recognition.stop();
      }, 10000);
    } else {
      alert('Speech recognition is not supported in your browser');
      setIsListening(false);
      setActiveField(null);
    }
  };
  const handleSubmit = () => {
    if (query.trim() && answer.trim()) {
      setSubmitted(true);
      // Simulate evaluation results
      setRating('4/5 - Above Average');
      setJustification('The answer demonstrates good understanding of the core concepts and provides clear explanations. However, it could benefit from more specific examples to illustrate the points made.');
    }
  };
  const handleClear = () => {
    setQuery('');
    setAnswer('');
    setSubmitted(false);
    setRating('');
    setJustification('');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };
  const handleTextToSpeech = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  const handleAIDetector = () => {
    // Simulate AI detection
    if (answer.trim()) {
      alert("AI Detection Result: This appears to be " + (answer.length > 200 ? "87% likely to be AI-generated content." : "92% likely to be human-written content."));
    }
  };
  React.useEffect(() => {
    if (isMobile) {
      setShowLeftPanel(true);
      setShowRightPanel(false);
    } else {
      setShowLeftPanel(true);
      setShowRightPanel(true);
    }
  }, [isMobile]);
  const toggleLeftPanel = () => {
    if (isMobile) {
      setShowLeftPanel(true);
      setShowRightPanel(false);
    } else {
      setShowLeftPanel(!showLeftPanel);
    }
  };
  const toggleRightPanel = () => {
    if (isMobile) {
      setShowLeftPanel(false);
      setShowRightPanel(true);
    } else {
      setShowRightPanel(!showRightPanel);
    }
  };
  return <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
      <div className="flex justify-between gap-2 md:hidden p-2 bg-appBlue border-b border-appBorder">
        <div className="flex">
          <Button variant="ghost" size="sm" onClick={toggleLeftPanel} className={`${showLeftPanel ? 'bg-appBlue/50 text-appGreen' : 'text-appText'}`}>
            <PanelLeft size={16} className="mr-1" />
            Input
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleRightPanel} className={`${showRightPanel ? 'bg-appBlue/50 text-appGreen' : 'text-appText'}`}>
            Results
            <PanelRight size={16} className="ml-1" />
          </Button>
        </div>
        <ThemeToggle />
      </div>

      <div className={`${showLeftPanel ? 'flex' : 'hidden'} md:flex flex-col ${showRightPanel && !isMobile ? 'md:w-1/2' : 'md:w-full'} border-r border-appBorder p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
            <span className="text-appText text-sm font-medium ml-2">Input Console</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-appText hover:text-appGreen">
                  <HelpCircle size={16} className="mr-1" />
                  How to Use
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-appBlue border-appBorder">
                <SheetHeader>
                  <SheetTitle className="text-appGreen">How to Use the Evaluator</SheetTitle>
                  <SheetDescription className="text-foreground">
                    <div className="space-y-4 mt-4">
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 1: Input Your Question</h3>
                        <p>Type your question in the Question field or use the microphone button for speech-to-text.</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 2: Provide Your Answer</h3>
                        <p>Type your answer in the Answer field or use the microphone button for speech-to-text.</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 3: Evaluate</h3>
                        <p>Click the Evaluate button to submit your answer for evaluation.</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 4: Review Results</h3>
                        <p>Check the evaluation results in the right panel for feedback on your answer.</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Additional Features</h3>
                        <p>- Use the AI Detector button to analyze if text is AI-generated</p>
                        <p>- Use the speaker buttons for text-to-speech functionality</p>
                        <p>- Navigate to AI Chat for more detailed assistance</p>
                      </div>
                      <div className="pt-4 border-t border-appBorder mt-4">
                        
                        
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Question</label>
          </div>
          <div className="relative mb-4">
            <Textarea placeholder="Enter your question..." className="flex-none h-24 bg-appBlue text-foreground text-sm border-appBorder resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => startSpeechRecognition('query')} className={`text-appText ${activeField === 'query' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}>
                <Mic size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleTextToSpeech(query)} className="text-appText hover:text-appGreen">
                <Volume2 size={16} />
              </Button>
            </div>
          </div>
          
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Answer</label>
          </div>
          <div className="relative flex-grow">
            <Textarea placeholder="" className="h-full w-full bg-appBlue text-foreground text-sm border-appBorder mb-4 resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300" value={answer} onChange={e => setAnswer(e.target.value)} />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => startSpeechRecognition('answer')} className={`text-appText ${activeField === 'answer' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}>
                <Mic size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleTextToSpeech(answer)} className="text-appText hover:text-appGreen">
                <Volume2 size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-auto">
            <Button onClick={handleClear} className="app-button flex-1 bg-appBlue hover:bg-opacity-80 border border-appBorder text-appText hover:text-appGreen transition-colors duration-300 flex items-center justify-center gap-2">
              <X size={16} />
              Clear
            </Button>
            <Button onClick={handleAIDetector} className="app-button flex-1 bg-appBlue hover:bg-opacity-80 border border-appBorder text-appText hover:text-appGreen transition-colors duration-300">
              AI Detector
            </Button>
            <Button onClick={handleSubmit} className="app-button flex-1 bg-appBlue hover:bg-opacity-80 border border-appBorder text-appGreen transition-colors duration-300 flex items-center justify-center gap-2">
              <span className="text-appGreen">✓</span> Evaluate
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`${showRightPanel ? 'flex' : 'hidden'} md:flex flex-col ${showLeftPanel && !isMobile ? 'md:w-1/2' : 'md:w-full'} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-appGreen rounded-full mr-1.5 opacity-70"></div>
            <span className="text-appText text-sm font-medium ml-2">Evaluation Results</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/ai-chat')} className="text-appText hover:text-appGreen">
            <MessageCircle size={16} className="mr-1" />
            AI Chat
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Rating</label>
          </div>
          <div className="bg-appBlue border border-appBorder p-3 rounded-md">
            <span className="text-foreground text-sm">{submitted ? rating : "Not evaluated"}</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Justification</label>
          </div>
          <div className="bg-appBlue border border-appBorder p-3 rounded-md h-full overflow-y-auto">
            <span className="text-foreground text-sm">{submitted ? justification : "No justification provided"}</span>
          </div>
        </div>
      </div>
    </div>;
};
export default CodeEvaluator;