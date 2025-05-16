import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, HelpCircle, PanelLeft, PanelRight, Volume2, MessageCircle, Mic, Settings, Code } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

  useEffect(() => {
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
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden p-2 md:p-4 gap-2 md:gap-4 bg-appDark">
      {/* Mobile Panel Toggles */}
      <div className="flex justify-between gap-2 md:hidden p-2 bg-appBlue/80 dark:bg-appBlue/20 rounded-md border border-appBorder">
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

      {/* Left Panel: Input Console */}
      <div className={`${showLeftPanel ? 'flex' : 'hidden'} md:flex ${showRightPanel && !isMobile ? 'md:w-1/2' : 'md:w-full'}`}>
        <Card className="flex flex-col h-full w-full bg-card border-appBorder shadow-lg">
          <CardHeader className="py-4 px-4 border-b border-appBorder">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Code size={20} className="text-appGreen mr-2" />
                <CardTitle className="text-lg font-semibold text-appText">Input Console</CardTitle>
              </div>
              <div className="flex items-center gap-1">
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
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 space-y-4">
            <div>
              <Label htmlFor="query-input" className="text-appText text-sm font-medium mb-1 block">Question</Label>
              <div className="relative">
                <Textarea
                  id="query-input"
                  placeholder="Enter your question..."
                  className="h-32 bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300 w-full"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startSpeechRecognition('query')} className={`text-appText h-7 w-7 ${activeField === 'query' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}>
                    <Mic size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleTextToSpeech(query)} className="text-appText h-7 w-7 hover:text-appGreen">
                    <Volume2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col">
              <Label htmlFor="answer-input" className="text-appText text-sm font-medium mb-1 block">Answer</Label>
              <div className="relative flex-grow">
                <Textarea
                  id="answer-input"
                  placeholder="Enter your answer..."
                  className="h-full w-full bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startSpeechRecognition('answer')} className={`text-appText h-7 w-7 ${activeField === 'answer' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}>
                    <Mic size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleTextToSpeech(answer)} className="text-appText h-7 w-7 hover:text-appGreen">
                    <Volume2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-appBorder">
            <div className="flex gap-2 w-full">
              <Button onClick={handleClear} variant="outline" className="flex-1 border-appBorder text-appText hover:bg-appText/10 hover:text-appGreen">
                <X size={16} className="mr-2" />
                Clear
              </Button>
              <Button onClick={handleAIDetector} variant="outline" className="flex-1 border-appBorder text-appText hover:bg-appText/10 hover:text-appGreen">
                <Settings size={16} className="mr-2" />
                AI Detector
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-appGreen hover:bg-appGreen/90 text-primary-foreground">
                <Check size={16} className="mr-2"/> Evaluate
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Panel: Evaluation Results */}
      <div className={`${showRightPanel ? 'flex' : 'hidden'} md:flex ${showLeftPanel && !isMobile ? 'md:w-1/2' : 'md:w-full'}`}>
        <Card className="flex flex-col h-full w-full bg-card border-appBorder shadow-lg">
          <CardHeader className="py-4 px-4 border-b border-appBorder">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle size={20} className="text-appGreen mr-2" />
                <CardTitle className="text-lg font-semibold text-appText">Evaluation Results</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/ai-chat')} className="text-appText hover:text-appGreen">
                <MessageCircle size={16} className="mr-1" />
                AI Chat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4 space-y-4">
            <div>
              <Label className="text-appText text-sm font-medium mb-1 block">Rating</Label>
              <div className="bg-input border border-border p-3 rounded-md min-h-[40px]">
                <span className="text-foreground text-sm">{submitted ? rating : "Not evaluated"}</span>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col">
              <Label className="text-appText text-sm font-medium mb-1 block">Justification</Label>
              <div className="bg-input border border-border p-3 rounded-md h-full overflow-y-auto min-h-[100px]">
                <span className="text-foreground text-sm whitespace-pre-wrap">{submitted ? justification : "No justification provided"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default CodeEvaluator;
