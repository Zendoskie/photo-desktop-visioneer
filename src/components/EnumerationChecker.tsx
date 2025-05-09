
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, HelpCircle, PanelLeft, PanelRight, Volume2, Eye, EyeOff, MessageCircle, Mic } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const EnumerationChecker: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [expectedAnswer, setExpectedAnswer] = useState('');
  const [showExpectedAnswer, setShowExpectedAnswer] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<'question' | 'answer' | 'expectedAnswer' | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Speech recognition setup
  const startSpeechRecognition = (field: 'question' | 'answer' | 'expectedAnswer') => {
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
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (field === 'question') {
          setQuestion(transcript);
        } else if (field === 'answer') {
          setAnswer(transcript);
        } else if (field === 'expectedAnswer') {
          setExpectedAnswer(transcript);
        }
      };
      
      recognition.onerror = (event) => {
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
    if (question.trim() && answer.trim() && expectedAnswer.trim()) {
      setSubmitted(true);
      // Simple scoring logic (would be replaced with actual comparison)
      const correct = answer.toLowerCase().includes(expectedAnswer.toLowerCase()) ? 1 : 0;
      setScore({
        correct: correct,
        wrong: correct === 0 ? 1 : 0,
        total: 1
      });
    }
  };
  
  const handleClear = () => {
    setQuestion('');
    setAnswer('');
    setExpectedAnswer('');
    setSubmitted(false);
    setScore({ correct: 0, wrong: 0, total: 0 });
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

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
      <div className="flex justify-between gap-2 md:hidden p-2 bg-appBlue border-b border-appBorder">
        <div className="flex">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLeftPanel}
            className={`${showLeftPanel ? 'bg-appBlue/50 text-appGreen' : 'text-appText'}`}
          >
            <PanelLeft size={16} className="mr-1" />
            Input
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleRightPanel}
            className={`${showRightPanel ? 'bg-appBlue/50 text-appGreen' : 'text-appText'}`}
          >
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
                  <SheetTitle className="text-appGreen">How to Use Enumeration Checker</SheetTitle>
                  <SheetDescription className="text-foreground">
                    <div className="space-y-4 mt-4">
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 1: Input Expected Answer</h3>
                        <p>Type the expected answer that will be used to check the submitted answer.</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 2: Input Your Question</h3>
                        <p>Type your enumeration question in the Question field.</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 3: Provide Answer</h3>
                        <p>Type your answer or solution in the Answer field.</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-base font-medium mb-1">Step 4: Check</h3>
                        <p>Click the Check button to verify if the answer matches the expected answer.</p>
                      </div>
                      <div className="pt-4 border-t border-appBorder mt-4">
                        <p className="text-appGreen">Keyboard Shortcuts:</p>
                        <p>Press Ctrl+Enter to quickly check your answer.</p>
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
          <div className="flex justify-between items-center mb-1">
            <label className="text-appText text-xs font-medium">Expected Answer</label>
            <div className="flex items-center">
              <Label htmlFor="show-expected" className="mr-2 text-xs">
                {showExpectedAnswer ? "Hide" : "Show"}
              </Label>
              <Switch 
                id="show-expected" 
                checked={showExpectedAnswer} 
                onCheckedChange={setShowExpectedAnswer}
              />
            </div>
          </div>
          <div className="relative mb-4">
            <Textarea 
              placeholder="Enter the expected answer..."
              className="flex-none h-16 bg-appBlue text-foreground text-sm border-appBorder resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300"
              value={expectedAnswer}
              onChange={(e) => setExpectedAnswer(e.target.value)}
              style={{ 
                color: showExpectedAnswer ? "inherit" : "transparent", 
                textShadow: showExpectedAnswer ? "none" : "0 0 5px rgba(0,0,0,0.5)" 
              }}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => startSpeechRecognition('expectedAnswer')}
                className={`text-appText ${activeField === 'expectedAnswer' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}
              >
                <Mic size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleTextToSpeech(expectedAnswer)}
                className="text-appText hover:text-appGreen"
              >
                <Volume2 size={16} />
              </Button>
            </div>
          </div>
          
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Question</label>
          </div>
          <div className="relative mb-4">
            <Textarea 
              placeholder="Enter your enumeration question..."
              className="flex-none h-24 bg-appBlue text-foreground text-sm border-appBorder resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => startSpeechRecognition('question')}
                className={`text-appText ${activeField === 'question' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}
              >
                <Mic size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleTextToSpeech(question)}
                className="text-appText hover:text-appGreen"
              >
                <Volume2 size={16} />
              </Button>
            </div>
          </div>
          
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Answer</label>
          </div>
          <div className="relative mb-4 flex-grow">
            <Textarea 
              placeholder="Enter your answer..."
              className="h-full w-full bg-appBlue text-foreground text-sm border-appBorder resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => startSpeechRecognition('answer')}
                className={`text-appText ${activeField === 'answer' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}
              >
                <Mic size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleTextToSpeech(answer)}
                className="text-appText hover:text-appGreen"
              >
                <Volume2 size={16} />
              </Button>
            </div>
          </div>
          
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
              <span className="text-appGreen">✓</span> Check
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`${showRightPanel ? 'flex' : 'hidden'} md:flex flex-col ${showLeftPanel && !isMobile ? 'md:w-1/2' : 'md:w-full'} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-appGreen rounded-full mr-1.5 opacity-70"></div>
            <span className="text-appText text-sm font-medium ml-2">Check Results</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/ai-chat')}
            className="text-appText hover:text-appGreen"
          >
            <MessageCircle size={16} className="mr-1" />
            AI Chat
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Score</label>
          </div>
          <div className="bg-appBlue border border-appBorder p-3 rounded-md">
            {submitted ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-foreground text-sm">Correct:</span>
                  <span className="text-appGreen font-mono">{score.correct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground text-sm">Wrong:</span>
                  <span className="text-destructive font-mono">{score.wrong}</span>
                </div>
                <div className="flex justify-between border-t border-appBorder pt-2 mt-2">
                  <span className="text-foreground text-sm font-medium">Total Score:</span>
                  <span className="text-foreground font-mono font-medium">{score.correct}/{score.total}</span>
                </div>
              </div>
            ) : (
              <span className="text-foreground text-sm">Not checked yet</span>
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="mb-1">
            <label className="text-appText text-xs font-medium">Results</label>
          </div>
          <div className="bg-appBlue border border-appBorder p-3 rounded-md h-full overflow-y-auto">
            {submitted ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-appGreen text-sm font-medium mb-1">Expected Answer:</h3>
                  <p className="text-foreground text-sm bg-appBlue/50 p-2 rounded">{expectedAnswer}</p>
                </div>
                <div>
                  <h3 className="text-appGreen text-sm font-medium mb-1">Your Answer:</h3>
                  <p className="text-foreground text-sm bg-appBlue/50 p-2 rounded">{answer}</p>
                </div>
                <div>
                  <h3 className="text-appGreen text-sm font-medium mb-1">Assessment:</h3>
                  <p className={`text-sm p-2 rounded ${score.correct > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {score.correct > 0 ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-foreground text-sm">Submit your answer to see results</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnumerationChecker;
