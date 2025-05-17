
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIChat: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState<Array<{role: string, content: string}>>([
    {role: 'assistant', content: 'Hello! I\'m your AI Evaluator assistant. How can I help you today?'}
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message to chat
      setChatHistory(prev => [...prev, {role: 'user', content: message}]);
      
      // Simulate AI response (would be replaced with actual API call)
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: "I'm processing your question. In a real implementation, this would connect to an AI service."
        }]);
      }, 1000);
      
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-appDark p-4">
      <Card className="flex flex-col flex-grow w-full bg-appBlue border-appBorder shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center p-4 border-b border-appBorder">
          <div className="flex items-center">
            <Link to="/evaluate">
              <Button variant="ghost" size="sm" className="text-appText hover:text-appGreen mr-2">
                <ArrowLeft size={16} className="mr-1" />
                Back
              </Button>
            </Link>
            <CardTitle className="text-lg font-medium text-foreground">AI Evaluator Chat</CardTitle>
          </div>
          <ThemeToggle />
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 bg-appDark">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-appGreen text-primary-foreground ml-auto' 
                    : 'bg-appBlue text-foreground'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </CardContent>

        <div className="p-4 border-t border-appBorder bg-appBlue">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow bg-appDark text-foreground border-appBorder resize-none focus:ring-appGreen focus:border-appGreen"
              rows={2}
            />
            <Button 
              onClick={handleSendMessage}
              className="app-button bg-appBlue hover:bg-opacity-80 border border-appBorder text-appGreen h-auto"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
