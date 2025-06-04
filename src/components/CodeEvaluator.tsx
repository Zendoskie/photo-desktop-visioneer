
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Sparkles, Volume2, Settings } from 'lucide-react';
import { motion } from "framer-motion";
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
      setRating('Excellent');
      setJustification('The answer correctly addressed the main points and used appropriate language.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">🌟 Visioneer</h1>

      <Tabs defaultValue="evaluate" className="mb-6">
        <TabsList className="bg-gray-700 rounded-xl p-1">
          <TabsTrigger value="evaluate" onClick={() => navigate('/evaluate')}>Evaluate</TabsTrigger>
          <TabsTrigger value="enumeration" onClick={() => navigate('/enumeration')}>Enumeration</TabsTrigger>
          <TabsTrigger value="analytics" onClick={() => navigate('/analytics')}>Analytics</TabsTrigger>
          <TabsTrigger value="chat" onClick={() => navigate('/ai-chat')}>AI Chat</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800 shadow-xl rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">🔍 Step 1: Enter Inputs</h2>
              <div>
                <label className="block text-sm mb-1">Question</label>
                <div className="relative">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question here..."
                    className="pr-20 bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startSpeechRecognition('query')}
                      className={`h-6 w-6 ${activeField === 'query' && isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Mic size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTextToSpeech(query)}
                      className="h-6 w-6 text-gray-400 hover:text-white"
                    >
                      <Volume2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Answer</label>
                <div className="relative">
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="pr-20 bg-gray-700 border-gray-600 text-white min-h-32"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startSpeechRecognition('answer')}
                      className={`h-6 w-6 ${activeField === 'answer' && isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Mic size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTextToSpeech(answer)}
                      className="h-6 w-6 text-gray-400 hover:text-white"
                    >
                      <Volume2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleAIDetector} className="border-gray-600 text-white hover:bg-gray-700">
                  <Settings size={16} className="mr-2" />
                  AI Detector
                </Button>
                <Button variant="outline" onClick={handleClear} className="border-gray-600 text-white hover:bg-gray-700">
                  Clear
                </Button>
                <Button onClick={handleSubmit} className="bg-teal-500 text-white hover:bg-teal-600">
                  <Sparkles size={16} className="mr-2" />
                  ✅ Evaluate Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gray-800 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Evaluation Results</h2>
              {submitted ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Rating:</span>
                    <Badge className="ml-2 bg-green-500 hover:bg-green-600">{rating}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Justification:</span>
                    <p className="text-gray-200 mt-1">
                      {justification}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 italic">Not evaluated yet...</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeEvaluator;
