
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, HelpCircle, Volume2, MessageCircle, Mic, Check, Code, Eye, EyeOff } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<'question' | 'answer' | 'expectedAnswer' | null>(null);
  const navigate = useNavigate();
  
  const startSpeechRecognition = (field: 'question' | 'answer' | 'expectedAnswer') => {
    setActiveField(field);
    setIsListening(true);
    
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

  return (
    <div className="h-full w-full p-4 space-y-6 bg-appDark">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Code size={24} className="text-appGreen mr-3" />
          <h1 className="text-2xl font-bold text-appText">Enumeration Checker</h1>
        </div>
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-appText hover:text-appGreen">
                <HelpCircle size={16} className="mr-2" />
                Help
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
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="sm" onClick={() => navigate('/ai-chat')} className="text-appText hover:text-appGreen">
            <MessageCircle size={16} className="mr-2" />
            AI Chat
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content - New Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left Side - Inputs */}
        <div className="space-y-4">
          {/* Expected Answer */}
          <Card className="bg-card border-appBorder shadow-lg">
            <CardHeader className="py-3 px-4 border-b border-appBorder">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-appText">Expected Answer</CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-expected" className="text-xs text-muted-foreground">
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
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative">
                <Textarea 
                  placeholder="Enter the expected answer..."
                  className="h-24 bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300 w-full"
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
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="bg-card border-appBorder shadow-lg">
            <CardHeader className="py-3 px-4 border-b border-appBorder">
              <CardTitle className="text-lg font-semibold text-appText">Question</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative">
                <Textarea 
                  placeholder="Enter your enumeration question..."
                  className="h-32 bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300 w-full"
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
            </CardContent>
          </Card>

          {/* Answer */}
          <Card className="bg-card border-appBorder shadow-lg flex-grow">
            <CardHeader className="py-3 px-4 border-b border-appBorder">
              <CardTitle className="text-lg font-semibold text-appText">Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[200px]">
              <div className="relative h-full">
                <Textarea 
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
        
        {/* Right Side - Results */}
        <div>
          <Card className="h-full bg-card border-appBorder shadow-lg">
            <CardHeader className="py-3 px-4 border-b border-appBorder">
              <CardTitle className="text-lg font-semibold text-appText">Check Results</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 h-[calc(100%-60px)] overflow-y-auto">
              <div>
                <Label className="text-appText text-sm font-medium mb-2 block">Score</Label>
                <div className="bg-input border border-border p-3 rounded-md min-h-[40px]">
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
                      <div className="flex justify-between border-t border-border pt-2 mt-2">
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
                <Label className="text-appText text-sm font-medium mb-2 block">Details</Label>
                <div className="bg-input border border-border p-3 rounded-md flex-grow overflow-y-auto text-sm">
                  {submitted ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-appGreen text-xs font-semibold mb-1">EXPECTED ANSWER:</h3>
                        <p className="text-foreground bg-muted/30 p-2 rounded text-xs leading-relaxed">{expectedAnswer || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-xs font-semibold mb-1">YOUR ANSWER:</h3>
                        <p className="text-foreground bg-muted/30 p-2 rounded text-xs leading-relaxed">{answer || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-appGreen text-xs font-semibold mb-1">ASSESSMENT:</h3>
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
    </div>
  );
};

export default EnumerationChecker;
