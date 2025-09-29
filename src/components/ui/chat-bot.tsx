import { useState, useRef, useEffect, useCallback } from 'react';
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
  Zap,
  Mic,
  MicOff,
  Command,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Settings,
  Code,
  BarChart3,
  AlertTriangle,
  Volume2,
  VolumeX,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
// import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CommandPalette } from './command-palette';
import { ReferencePanel } from './reference-panel';
import { useTheme } from '@/components/theme-provider';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isMarkdown?: boolean;
  reactions?: { type: 'like' | 'dislike'; count: number }[];
  metadata?: {
    command?: string;
    references?: Array<{
      title: string;
      url: string;
      type: 'page' | 'metric' | 'log';
    }>;
    cards?: Array<{
      title: string;
      value: string | number;
      change?: string;
      status?: 'success' | 'warning' | 'error';
    }>;
  };
}

interface Reference {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'metric' | 'log' | 'alert';
  url?: string;
  data?: any;
  icon: any;
  timestamp?: Date;
}

const SAMPLE_RESPONSES = [
  {
    content: "Your webhook infrastructure is running smoothly with **99.2% success rate**. Check [Dashboard](/dashboard) for real-time metrics.",
    metadata: {
      cards: [
        { title: "Success Rate", value: "99.2%", change: "+0.3%", status: "success" as const },
        { title: "Avg Response", value: "245ms", change: "-12ms", status: "success" as const },
        { title: "Active Endpoints", value: 24, status: "success" as const }
      ],
      references: [
        { title: "System Dashboard", url: "/dashboard", type: "page" as const },
        { title: "Performance Metrics", url: "/metrics", type: "metric" as const }
      ]
    }
  },
  {
    content: "I can help you troubleshoot delivery failures, restart services, or check system health. What would you like to do?",
    metadata: {
      command: "system diagnostics"
    }
  },
  {
    content: "**Alert Summary**: 2 warnings detected in the last hour. Check [Alerts page](/alerts) for details.",
    metadata: {
      references: [
        { title: "Active Alerts", url: "/alerts", type: "page" as const },
        { title: "Error Logs", url: "/console", type: "log" as const }
      ]
    }
  },
  {
    content: "I have complete access to your project: webhooks, team settings, logs, and configurations. Try using `/restart service` or `/health check`.",
    metadata: {
      command: "help"
    }
  }
];

const QUICK_SUGGESTIONS = [
  "Show system health",
  "Check failed deliveries", 
  "Restart webhook service",
  "Open performance dashboard",
  "View recent errors",
  "Test endpoint connectivity"
];

const DEVELOPER_COMMANDS = [
  "/restart service - Restart webhook processing",
  "/health check - Run system diagnostics", 
  "/logs tail - Stream real-time logs",
  "/deploy latest - Deploy new version",
  "/metrics show - Display key metrics",
  "/test webhook - Send test payload"
];

export function ChatBot() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  // ElevenLabs conversation hook (temporarily disabled to fix loading)
  const conversation = {
    startSession: async () => 'mock-session',
    endSession: async () => {},
    setVolume: async () => {},
    status: 'disconnected',
    isSpeaking: false
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [referencePanelOpen, setReferencePanelOpen] = useState(false);
  const [references, setReferences] = useState<Reference[]>([]);
  const [volume, setVolume] = useState(0.7);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 **Welcome to your AI Control Center!**\n\nI have complete access to your webhook infrastructure, team settings, and system logs. I can:\n\n• Navigate to any page or section\n• Execute system commands\n• Provide real-time insights\n• Troubleshoot issues instantly\n\nTry typing `/` for commands or ask me anything!",
      timestamp: new Date(),
      isMarkdown: true,
      suggestions: QUICK_SUGGESTIONS.slice(0, 3)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (content: string = inputValue) => {
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

    // Handle commands
    if (content.startsWith('/')) {
      handleCommand(content);
      return;
    }

    // Simulate intelligent bot response
    setTimeout(() => {
      const responseData = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseData.content,
        timestamp: new Date(),
        isMarkdown: true,
        metadata: responseData.metadata,
        suggestions: Math.random() > 0.6 ? QUICK_SUGGESTIONS.slice(0, 2) : undefined
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Add references if provided
      if (responseData.metadata?.references) {
        responseData.metadata.references.forEach((ref, index) => {
          setTimeout(() => {
            addReference({
              id: `ref-${Date.now()}-${index}`,
              title: ref.title,
              description: `Referenced from chatbot conversation`,
              type: ref.type as 'page' | 'metric' | 'log' | 'alert',
              url: ref.url,
              icon: ref.type === 'page' ? BarChart3 : AlertTriangle,
              timestamp: new Date()
            });
          }, index * 200);
        });
      }
      
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  }, [inputValue]);

  const handleCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase();
    let response = '';
    let metadata: any = {};

    switch (true) {
      case cmd.includes('restart'):
        response = '🔄 **Service Restart Initiated**\n\nWebhook processing service is restarting... This may take 30-60 seconds.';
        metadata.command = 'restart';
        break;
      case cmd.includes('health'):
        response = '✅ **System Health Check**\n\n• **API**: Healthy (99.9% uptime)\n• **Database**: Optimal performance\n• **Queue**: Processing normally\n• **Memory**: 67% utilized';
        metadata.cards = [
          { title: "API Health", value: "99.9%", status: "success" as const },
          { title: "Response Time", value: "234ms", status: "success" as const },
          { title: "Queue Size", value: 12, status: "success" as const }
        ];
        break;
        case cmd.includes('logs'):
        response = '📊 **Log Stream Started**\n\nReal-time logs are now streaming. Check [Console](/console) for full details.';
        metadata.references = [{ title: "Live Console", url: "/console", type: "log" as const }];
        break;
      case cmd.includes('deploy'):
        response = '🚀 **Deployment Started**\n\nDeploying latest version to production environment...';
        metadata.command = 'deploy';
        break;
      case cmd.includes('metrics'):
        response = '📈 **Key Metrics Overview**\n\nCheck [Dashboard](/dashboard) for detailed analytics.';
        metadata.references = [{ title: "Metrics Dashboard", url: "/metrics", type: "metric" as const }];
        break;
      case cmd.includes('test'):
        response = '🧪 **Test Webhook Sent**\n\nTest payload delivered successfully to endpoint.';
        metadata.command = 'test';
        break;
      default:
        response = `🤖 **Command Help**\n\nAvailable commands:\n${DEVELOPER_COMMANDS.map(c => `• \`${c}\``).join('\n')}`;
    }

    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: response,
      timestamp: new Date(),
      isMarkdown: true,
      metadata
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, systemMessage]);
      setIsTyping(false);
      
      toast({
        title: "Command Executed",
        description: `${command} completed successfully`,
        duration: 3000,
      });
    }, 500);
  }, [toast]);

  const addReference = useCallback((reference: Reference) => {
    setReferences(prev => [reference, ...prev.slice(0, 9)]); // Keep last 10 references
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    // Command palette shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandPaletteOpen(true);
    }
  }, [handleSendMessage]);

  const toggleVoice = useCallback(async () => {
    if (!isVoiceEnabled) {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsVoiceEnabled(true);
        toast({
          title: "Voice enabled",
          description: "You can now use voice commands",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "Voice access denied",
          description: "Please enable microphone access to use voice features",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      setIsVoiceEnabled(false);
      setIsListening(false);
    }
  }, [isVoiceEnabled, toast]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  }, [toast]);

  const reactToMessage = useCallback((messageId: string, reaction: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            reactions: [{ type: reaction, count: 1 }] 
          }
        : msg
    ));
  }, []);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: "🔄 **Chat Reset Complete**\n\nI'm your AI assistant with full system access. Ready to help with webhooks, monitoring, and infrastructure management.\n\nWhat can I help you with?",
        timestamp: new Date(),
        isMarkdown: true,
        suggestions: QUICK_SUGGESTIONS.slice(0, 3)
      }
    ]);
    setReferences([]);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Open chat with Cmd/Ctrl + J
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Close chat with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="h-16 w-16 rounded-full bg-gradient-to-r from-primary via-primary-hover to-primary-glow shadow-2xl hover:shadow-primary/25 transition-all duration-500 relative overflow-hidden group animate-glow-pulse"
              >
                <motion.div
                  animate={{ 
                    y: [0, -2, 0],
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative z-10"
                >
                  <Bot className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                
                {/* Multiple Pulse Effects */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/40"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6] 
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeOut" 
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary-glow/30"
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 0, 0.4] 
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.4
                  }}
                />
                
                {/* AI Indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-success to-accent rounded-full flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
                </motion.div>
                
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 rounded-full opacity-10"
                  style={{ backgroundImage: 'var(--pattern-circuit)' }}
                />
              </Button>
            </motion.div>
            
            {/* Keyboard Hint */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground bg-popover px-2 py-1 rounded border shadow-sm whitespace-nowrap"
            >
              Press ⌘J to open
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className={`shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
              isMinimized ? 'w-80 h-16' : 'w-[600px] h-[700px]'
            }`}>
              
              {/* Chat Background Pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{ 
                  backgroundImage: 'var(--pattern-circuit)',
                  backgroundColor: 'hsl(var(--chat-background))'
                }}
              />
              
              {/* Header */}
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border bg-gradient-to-r from-chat-background to-chat-pattern relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="relative"
                    animate={isTyping ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.6, repeat: isTyping ? Infinity : 0 }}
                  >
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow animate-glow-pulse">
                      <AvatarFallback>
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card"
                    />
                  </motion.div>
                  
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      AI Control Center
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        <Zap className="w-2.5 h-2.5 mr-1" />
                        LIVE
                      </Badge>
                    </h3>
                    {!isMinimized && (
                      <p className="text-xs text-muted-foreground">
                        Full system access • Voice enabled • ⌘K for commands
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReferencePanelOpen(!referencePanelOpen)}
                    className="h-8 w-8 p-0"
                    title="Toggle Reference Panel"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoice}
                    className="h-8 w-8 p-0"
                    title={isVoiceEnabled ? "Disable Voice" : "Enable Voice"}
                  >
                    {isVoiceEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-8 w-8 p-0"
                  >
                    {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetChat}
                    className="h-8 w-8 p-0"
                    title="Reset Chat"
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
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-[calc(700px-80px)] relative">
                  {/* Messages Area */}
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-chat-background to-chat-pattern"
                  >
                    <AnimatePresence mode="popLayout">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ type: "spring", damping: 25, stiffness: 400 }}
                          className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} group`}
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className={
                              message.type === 'bot' || message.type === 'system' 
                                ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground' 
                                : 'bg-chat-bubble-user text-chat-bubble-user-text'
                            }>
                              {message.type === 'bot' || message.type === 'system' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className={`flex flex-col max-w-[80%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                            <motion.div 
                              className={`rounded-2xl px-4 py-3 text-sm relative group ${
                                message.type === 'user' 
                                  ? 'bg-chat-bubble-user text-chat-bubble-user-text shadow-lg' 
                                  : message.type === 'system'
                                  ? 'bg-gradient-to-r from-accent/20 to-primary/20 text-foreground border border-primary/20'
                                  : 'bg-chat-bubble-bot text-chat-bubble-bot-text shadow-sm border border-border/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", damping: 25 }}
                            >
                              {message.isMarkdown ? (
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                  {message.content.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                  ))}
                                </div>
                              ) : (
                                message.content
                              )}
                              
                              {/* Message Actions */}
                              <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm"
                                  onClick={() => copyToClipboard(message.content)}
                                >
                                  <Copy className="w-2.5 h-2.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm"
                                  onClick={() => reactToMessage(message.id, 'like')}
                                >
                                  <ThumbsUp className="w-2.5 h-2.5" />
                                </Button>
                              </div>
                            </motion.div>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {message.metadata?.command && (
                                <Badge variant="outline" className="text-xs">
                                  <Code className="w-2 h-2 mr-1" />
                                  {message.metadata.command}
                                </Badge>
                              )}
                            </div>
                            
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                                {message.suggestions.map((suggestion, index) => (
                                  <motion.button
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors border border-primary/20"
                                  >
                                    {suggestion}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-chat-bubble-bot rounded-2xl px-4 py-3 border border-border/50">
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-primary rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-primary rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-primary rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-border bg-chat-input-bg">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message or use / for commands..."
                          className="pr-20 bg-background/50 backdrop-blur-sm border-border/50"
                          disabled={isTyping}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCommandPaletteOpen(true)}
                            className="h-6 w-6 p-0"
                            title="Open Command Palette (⌘K)"
                          >
                            <Command className="w-3 h-3" />
                          </Button>
                          {isVoiceEnabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 w-6 p-0 ${isListening ? 'text-destructive animate-pulse' : ''}`}
                              title="Voice Input"
                            >
                              <Mic className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        size="sm"
                        className="px-3 bg-gradient-to-r from-primary to-primary-hover"
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

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onExecuteCommand={(command, description) => {
          const commandMessage: Message = {
            id: Date.now().toString(),
            type: 'system',
            content: `✅ **${description}**\n\nCommand: \`${command}\``,
            timestamp: new Date(),
            isMarkdown: true,
            metadata: { command }
          };
          setMessages(prev => [...prev, commandMessage]);
          toast({
            title: "Command executed",
            description,
            duration: 2000,
          });
        }}
      />

      {/* Reference Panel */}
      <ReferencePanel
        isOpen={referencePanelOpen}
        onClose={() => setReferencePanelOpen(false)}
        references={references}
        onAddReference={addReference}
      />
    </>
  );
}