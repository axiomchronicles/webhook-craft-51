import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const SAMPLE_RESPONSES = [
  "I can help you with webhook endpoints, deliveries, and system monitoring. What would you like to know?",
  "Your system is currently processing 1,247 webhooks per hour with a 99.2% success rate. Would you like details on any specific endpoint?",
  "I can assist with troubleshooting delivery failures, setting up alerts, or configuring new endpoints. How can I help?",
  "Based on your recent activity, I notice some endpoints have slower response times. Would you like me to analyze the performance metrics?",
  "I have access to all your webhook data, team settings, and system configurations. Ask me anything about your infrastructure!"
];

const QUICK_SUGGESTIONS = [
  "Show me failed deliveries",
  "What's my success rate?",
  "Help with endpoint setup",
  "System health status",
  "Recent alerts",
  "Performance metrics"
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your webhook assistant. I have complete knowledge of your system, endpoints, deliveries, and team settings. How can I help you today?",
      timestamp: new Date(),
      suggestions: QUICK_SUGGESTIONS.slice(0, 3)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)],
        timestamp: new Date(),
        suggestions: Math.random() > 0.5 ? QUICK_SUGGESTIONS.slice(0, 2) : undefined
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: "Chat reset! I'm ready to help you with your webhook infrastructure again. What would you like to know?",
        timestamp: new Date(),
        suggestions: QUICK_SUGGESTIONS.slice(0, 3)
      }
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary-hover shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              
              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Notification Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-2 h-2 text-success-foreground" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className={`shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm transition-all duration-300 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-primary to-primary-hover">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      Webhook Assistant
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="w-2.5 h-2.5 mr-1" />
                        AI
                      </Badge>
                    </h3>
                    {!isMinimized && (
                      <p className="text-xs text-muted-foreground">
                        Always online • Responds instantly
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetChat}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 px-4 py-2">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className={message.type === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                              {message.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className={`flex flex-col max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-2xl px-4 py-2 text-sm ${
                              message.type === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-foreground'
                            }`}>
                              {message.content}
                            </div>
                            
                            <span className="text-xs text-muted-foreground mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                                {message.suggestions.map((suggestion, index) => (
                                  <motion.button
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                                  >
                                    {suggestion}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-2xl px-4 py-2">
                            <motion.div
                              className="flex space-x-1"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your webhooks, deliveries, or system..."
                        className="flex-1"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        size="sm"
                        className="px-3"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}