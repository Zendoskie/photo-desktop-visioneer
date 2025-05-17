import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, HelpCircle, PanelLeft, PanelRight, Volume2, Eye, EyeOff, MessageCircle, Mic, Check, Code } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden p-2 md:p-4 gap-2 md:gap-4 bg-appDark">
      {/* Mobile Panel Toggles - Adjusted to match CodeEvaluator style */}
      <div className="flex justify-between gap-2 md:hidden p-2 bg-appBlue/80 dark:bg-appBlue/20 rounded-md border border-appBorder">
        <div className="flex">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLeftPanel}
            className={`${showLeftPanel ? 'bg-appBlue/50 text-appGreen' : 'text-appText'} hover:text-appGreen`}
          >
            <PanelLeft size={16} className="mr-1" />
            Input
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleRightPanel}
            className={`${showRightPanel ? 'bg-appBlue/50 text-appGreen' : 'text-appText'} hover:text-appGreen`}
          >
            Results
            <PanelRight size={16} className="ml-1" />
          </Button>
        </div>
        <ThemeToggle />
      </div>

      {/* Left Panel - Input Console */}
      <div className={`${showLeftPanel ? 'flex' : 'hidden'} md:flex flex-col ${showRightPanel && !isMobile ? 'md:w-1/2' : 'md:w-full'}`}>
        <Card className="flex flex-col flex-grow bg-card border-appBorder shadow-lg">
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
                            <p className="text-appGreen font-medium">Keyboard Shortcuts:</p>
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
          </CardHeader>
          
          <CardContent className="flex flex-col flex-grow p-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="expectedAnswer" className="text-appText text-sm font-medium">Expected Answer</Label>
                <div className="flex items-center">
                  <Label htmlFor="show-expected" className="mr-2 text-xs text-muted-foreground">
                    {showExpectedAnswer ? "Hide" : "Show"}
                  </Label>
                  <Switch 
                    id="show-expected" 
                    checked={showExpectedAnswer} 
                    onCheckedChange={setShowExpectedAnswer}
                    className="data-[state=checked]:bg-appGreen data-[state=unchecked]:bg-input"
                  />
                </div>
              </div>
              <div className="relative">
                <Textarea 
                  id="expectedAnswer"
                  placeholder="Enter the expected answer..."
                  className="flex-none h-20 bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300 w-full"
                  value={expectedAnswer}
                  onChange={(e) => setExpectedAnswer(e.target.value)}
                  style={{ 
                    color: showExpectedAnswer ? "inherit" : "transparent", 
                    textShadow: showExpectedAnswer ? "none" : "0 0 8px rgba(128,128,128,0.5)" 
                  }}
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => startSpeechRecognition('expectedAnswer')}
                    className={`h-7 w-7 text-appText ${activeField === 'expectedAnswer' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}
                  >
                    <Mic size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleTextToSpeech(expectedAnswer)}
                    className="h-7 w-7 text-appText hover:text-appGreen"
                  >
                    <Volume2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="question" className="text-appText text-sm font-medium mb-1 block">Question</Label>
              <div className="relative">
                <Textarea 
                  id="question"
                  placeholder="Enter your enumeration question..."
                  className="flex-none h-28 bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300 w-full"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => startSpeechRecognition('question')}
                    className={`h-7 w-7 text-appText ${activeField === 'question' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}
                  >
                    <Mic size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleTextToSpeech(question)}
                    className="h-7 w-7 text-appText hover:text-appGreen"
                  >
                    <Volume2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col">
              <Label htmlFor="answer" className="text-appText text-sm font-medium mb-1 block">Answer</Label>
              <div className="relative flex-grow">
                <Textarea 
                  id="answer"
                  placeholder="Enter your answer..."
                  className="h-full w-full bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => startSpeechRecognition('answer')}
                    className={`h-7 w-7 text-appText ${activeField === 'answer' && isListening ? 'text-red-500 animate-pulse' : 'hover:text-appGreen'}`}
                  >
                    <Mic size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleTextToSpeech(answer)}
                    className="h-7 w-7 text-appText hover:text-appGreen"
                  >
                    <Volume2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-appBorder">
            <div className="flex gap-2 w-full">
              <Button 
                onClick={handleClear}
                variant="outline"
                className="flex-1 border-appBorder text-appText hover:bg-appText/10 hover:text-appGreen"
              >
                <X size={16} className="mr-2" />
                Clear
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-appGreen hover:bg-appGreen/90 text-primary-foreground"
              >
                <Check size={16} className="mr-2" />
                Check
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Panel - Check Results */}
      <div className={`${showRightPanel ? 'flex' : 'hidden'} md:flex flex-col ${showLeftPanel && !isMobile ? 'md:w-1/2' : 'md:w-full'}`}>
        <Card className="flex flex-col flex-grow bg-card border-appBorder shadow-lg">
          <CardHeader className="py-4 px-4 border-b border-appBorder">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check size={20} className="text-appGreen mr-2" /> {/* Changed icon */}
                <CardTitle className="text-lg font-semibold text-appText">Check Results</CardTitle>
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
          </CardHeader>
          
          <CardContent className="p-4 space-y-4 flex-grow flex flex-col">
            <div>
              <Label className="text-appText text-sm font-medium mb-1 block">Score</Label> {/* Label style updated */}
              <div className="bg-input border border-border p-3 rounded-md min-h-[40px]"> {/* Background and border updated */}
                {submitted ? (
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground">Correct:</span>
                      <span className="text-green-500 font-mono">{score.correct}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Wrong:</span>
                      <span className="text-red-500 font-mono">{score.wrong}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2"> {/* Border updated */}
                      <span className="text-foreground font-medium">Total Score:</span>
                      <span className="text-foreground font-mono font-medium">{score.correct}/{score.total}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Not checked yet</span>
                )}
              </div>
            </div>
            
            <div className="flex-grow flex flex-col">
              <Label className="text-appText text-sm font-medium mb-1 block">Details</Label> {/* Label style updated */}
              <div className="bg-input border border-border p-3 rounded-md h-full overflow-y-auto text-sm"> {/* Background and border updated */}
                {submitted ? (
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-appGreen text-xs font-semibold mb-1">EXPECTED ANSWER:</h3> {/* Text color updated */}
                      <p className="text-foreground bg-muted/30 p-2 rounded text-xs leading-relaxed">{expectedAnswer || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-appGreen text-xs font-semibold mb-1">YOUR ANSWER:</h3> {/* Text color updated */}
                      <p className="text-foreground bg-muted/30 p-2 rounded text-xs leading-relaxed">{answer || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-appGreen text-xs font-semibold mb-1">ASSESSMENT:</h3> {/* Text color updated */}
                      <p className={`text-xs p-2 rounded font-medium ${score.correct > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {score.correct > 0 ? '✓ CORRECT ANSWER' : '✗ INCORRECT ANSWER'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Submit your answer to see detailed results.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnumerationChecker;
