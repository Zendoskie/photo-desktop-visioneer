
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, HelpCircle, Volume2, MessageCircle, Mic, Settings, Code, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

const CodeEvaluator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState('');
  const [justification, setJustification] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<'query' | 'answer' | null>(null);
  const navigate = useNavigate();

  // Speech recognition setup
  const startSpeechRecognition = (field: 'query' | 'answer') => {
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
    if (answer.trim()) {
      alert("AI Detection Result: This appears to be " + (answer.length > 200 ? "87% likely to be AI-generated content." : "92% likely to be human-written content."));
    }
  };

  return (
    <div className="h-full w-full p-4 space-y-6 bg-appDark">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Code size={24} className="text-appGreen mr-3" />
          <h1 className="text-2xl font-bold text-appText">Code Evaluator</h1>
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
                      <h3 className="text-appGreen text-base font-medium mb-1">Additional Features</h3>
                      <p>- Use the AI Detector button to analyze if text is AI-generated</p>
                      <p>- Use the speaker buttons for text-to-speech functionality</p>
                      <p>- Navigate to AI Chat for more detailed assistance</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Question Input - Left Column */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-card border-appBorder shadow-lg">
            <CardHeader className="py-3 px-4 border-b border-appBorder">
              <CardTitle className="text-lg font-semibold text-appText">Question</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-60px)]">
              <div className="relative h-full">
                <Textarea
                  placeholder="Enter your question..."
                  className="h-full bg-input text-foreground text-sm border-border resize-none focus:ring-appGreen focus:border-appGreen transition-all duration-300 w-full"
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
            </CardContent>
          </Card>
        </div>

        {/* Answer Input - Middle Column */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-card border-appBorder shadow-lg">
            <CardHeader className="py-3 px-4 border-b border-appBorder">
              <CardTitle className="text-lg font-semibold text-appText">Answer</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-120px)]">
              <div className="relative h-full">
                <Textarea
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

        {/* Results - Right Column */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-card border-appBorder shadow-lg">
            <CardHeader className="py-3 px-4 border-b border-appBorder">
              <CardTitle className="text-lg font-semibold text-appText">Evaluation Results</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 h-[calc(100%-60px)] overflow-y-auto">
              <div>
                <Label className="text-appText text-sm font-medium mb-2 block">Rating</Label>
                <div className="bg-input border border-border p-3 rounded-md min-h-[40px]">
                  <span className="text-foreground text-sm">{submitted ? rating : "Not evaluated"}</span>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col">
                <Label className="text-appText text-sm font-medium mb-2 block">Justification</Label>
                <div className="bg-input border border-border p-3 rounded-md flex-grow overflow-y-auto min-h-[100px]">
                  <span className="text-foreground text-sm whitespace-pre-wrap">{submitted ? justification : "No justification provided"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeEvaluator;
