import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  Copy,
  ExternalLink,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  Filter,
  Command,
  Sidebar,
  Moon,
  Sun,
  Heart,
  ThumbsUp,
  Settings,
  Terminal,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  FileText,
  Expand,
  Download,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CommandPalette } from './command-palette';
import { ReferencePanel } from './reference-panel';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: QuickAction[];
  references?: Reference[];
  reactions?: Reaction[];
  cardData?: CardData;
  metadata?: MessageMetadata;
  replyTo?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline';
}

interface Reference {
  id: string;
  title: string;
  url: string;
  type: 'page' | 'doc' | 'metric';
}

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface CardData {
  type: 'status' | 'metric' | 'table';
  title: string;
  data: any;
}

interface MessageMetadata {
  processingTime?: number;
  confidence?: number;
  source?: string;
}

interface ChatHistory {
  messages: Message[];
  timestamp: Date;
  title: string;
}

const DEVELOPER_RESPONSES = [
  {
    content: `Your **webhook infrastructure** is performing well! 

📊 **Current Status:**
- Success Rate: **99.2%** ↗️
- Active Endpoints: **47**  
- Avg Response Time: **142ms**

Need help with anything specific? Try:`,
    suggestions: ["Show failed deliveries", "Performance metrics", "Check endpoint health"],
    actions: [
      { id: 'metrics', label: 'View Metrics', icon: <BarChart3 className="w-3 h-3" /> },
      { id: 'console', label: 'Open Console', icon: <Terminal className="w-3 h-3" /> }
    ],
    references: [
      { id: '1', title: 'Metrics Dashboard', url: '/metrics', type: 'page' as const },
      { id: '2', title: 'System Console', url: '/console', type: 'page' as const }
    ]
  },
  {
    content: `I can help you troubleshoot delivery failures. Let me check your recent logs...

\`\`\`json
{
  "recent_failures": 12,
  "common_errors": [
    "timeout (8 occurrences)",
    "invalid_ssl (3 occurrences)", 
    "dns_resolution (1 occurrence)"
  ],
  "suggested_action": "Check endpoint SSL certificates"
}
\`\`\`

**Recommendation:** Navigate to [Settings > Endpoints](/endpoints) to update SSL configurations.`,
    actions: [
      { id: 'fix-ssl', label: 'Fix SSL Issues', variant: 'default' as const },
      { id: 'retry', label: 'Retry Failed', variant: 'outline' as const }
    ]
  },
  {
    content: `Based on your query, I've analyzed your **pipeline performance**:

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Throughput | 1,247/hr | 1,000/hr | ✅ Exceeds |  
| Error Rate | 0.8% | <2% | ✅ Good |
| Avg Latency | 142ms | <200ms | ✅ Good |

Everything looks healthy! Want me to set up **proactive monitoring**?`,
    cardData: {
      type: 'status' as const,
      title: 'System Health',
      data: { status: 'healthy', uptime: '99.9%' }
    }
  }
];

const QUICK_SUGGESTIONS = [
  "Show system status",
  "Recent alerts", 
  "Performance overview",
  "Failed deliveries",
  "Team permissions",
  "Endpoint configuration",
  "Deploy changes",
  "View logs",
  "Restart service",
  "Check database health"
];

export function NextGenChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 **Welcome to your AI Control Center!**\n\nI'm your intelligent webhook assistant with complete system access. I can help you monitor, troubleshoot, and manage your entire infrastructure.\n\n**What I can do:**\n- 🔍 Analyze system performance\n- 🚀 Execute commands and deployments  \n- 📊 Provide real-time insights\n- ⚡ Navigate you to relevant pages\n- 🛠️ Troubleshoot issues proactively\n\nTry a command like `/status` or ask me anything!",
      timestamp: new Date(),
      suggestions: QUICK_SUGGESTIONS.slice(0, 4)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowCommandPalette(true);
            break;
          case 'j':
            e.preventDefault();
            setIsOpen(!isOpen);
            break;
          case 'f':
            e.preventDefault();
            if (isOpen) setShowSearch(!showSearch);
            break;
        }
      }
      
      if (e.key === 'Escape' && isOpen) {
        if (showCommandPalette) setShowCommandPalette(false);
        else if (showReferencePanel) setShowReferencePanel(false);
        else if (showSearch) setShowSearch(false);
        else setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showCommandPalette, showReferencePanel, showSearch]);

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

    // Handle commands
    if (content.startsWith('/')) {
      handleCommand(content);
      return;
    }

    // Simulate AI response
    setTimeout(() => {
      const response = DEVELOPER_RESPONSES[Math.floor(Math.random() * DEVELOPER_RESPONSES.length)];
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actions: response.actions?.map(action => ({
          ...action,
          action: () => handleQuickAction(action.id)
        })),
        references: response.references,
        cardData: response.cardData,
        metadata: {
          processingTime: 145 + Math.random() * 100,
          confidence: 0.85 + Math.random() * 0.1
        }
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      if (response.references) {
        setShowReferencePanel(true);
      }
    }, 800 + Math.random() * 1200);
  };

  const handleCommand = (command: string) => {
    setIsTyping(false);
    
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: `Executing command: \`${command}\``,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
      
      switch (command.toLowerCase()) {
        case '/status':
          executeStatusCommand();
          break;
        case '/deploy':
          executeDeployCommand();
          break;
        case '/logs':
          window.open('/console', '_blank');
          break;
        case '/metrics':
          window.open('/metrics', '_blank');
          break;
        default:
          toast({
            title: "Unknown Command",
            description: `Command ${command} not recognized. Try /status, /deploy, /logs, or /metrics`,
          });
      }
    }, 500);
  };

  const executeStatusCommand = () => {
    const statusResponse: Message = {
      id: (Date.now() + 2).toString(),
      type: 'bot',
      content: `**System Status Report** 📊

\`\`\`json
{
  "status": "healthy",
  "uptime": "99.94%",
  "active_endpoints": 47,
  "success_rate": "99.2%",
  "avg_response_time": "142ms",
  "last_deployment": "2 hours ago"
}
\`\`\`

All systems operational! 🟢`,
      timestamp: new Date(),
      cardData: {
        type: 'status',
        title: 'Live System Status',
        data: { status: 'healthy', endpoints: 47, uptime: '99.94%' }
      }
    };
    
    setMessages(prev => [...prev, statusResponse]);
  };

  const executeDeployCommand = () => {
    const deployResponse: Message = {
      id: (Date.now() + 3).toString(),
      type: 'bot',
      content: `**Deployment Initiated** 🚀

\`\`\`bash
> git pull origin main
> npm run build
> docker build -t webhook-service:latest .
> kubectl apply -f deployment.yaml
\`\`\`

**Status:** Deploying to production...
**ETA:** ~3 minutes

I'll notify you when deployment completes.`,
      timestamp: new Date(),
      actions: [
        { 
          id: 'watch-deploy',
          label: 'Watch Progress',
          icon: <Play className="w-3 h-3" />,
          action: () => window.open('/deployments', '_blank')
        }
      ]
    };
    
    setMessages(prev => [...prev, deployResponse]);
    
    // Simulate deployment completion
    setTimeout(() => {
      toast({
        title: "Deployment Complete! 🎉",
        description: "Your changes are now live in production.",
      });
    }, 8000);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'metrics':
        window.open('/metrics', '_blank');
        break;
      case 'console':
        window.open('/console', '_blank');
        break;
      case 'fix-ssl':
        toast({
          title: "SSL Fix Initiated",
          description: "Updating SSL certificates for failing endpoints...",
        });
        break;
      case 'retry':
        toast({
          title: "Retrying Failed Deliveries",
          description: "12 deliveries queued for retry.",
        });
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        
        if (existing) {
          return {
            ...msg,
            reactions: reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1, userReacted: true }]
          };
        }
      }
      return msg;
    }));
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice Off" : "Voice On",
      description: isListening ? "Voice input disabled" : "Voice input enabled",
    });
  };

  const resetChat = () => {
    // Save current chat to history
    if (messages.length > 1) {
      const newHistory: ChatHistory = {
        messages: [...messages],
        timestamp: new Date(),
        title: `Chat ${new Date().toLocaleString()}`
      };
      setChatHistory(prev => [newHistory, ...prev].slice(0, 10));
    }

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

  const filteredMessages = messages.filter(msg => 
    !searchQuery || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 group ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={`
          ${message.type === 'bot' 
            ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground' 
            : message.type === 'system'
            ? 'bg-warning/20 text-warning'
            : 'bg-muted'
          }
        `}>
          {message.type === 'bot' ? (
            <Bot className="w-4 h-4" />
          ) : message.type === 'system' ? (
            <Terminal className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[85%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
        {/* Message Content */}
        <div className={`
          relative rounded-2xl px-4 py-3 text-sm
          ${message.type === 'user' 
            ? 'bg-chat-bubble-user text-chat-bubble-user-foreground' 
            : message.type === 'system'
            ? 'bg-warning/10 text-warning border border-warning/20'
            : 'bg-chat-bubble-bot text-chat-bubble-bot-foreground border border-border'
          }
        `}>
          <ReactMarkdown
            components={{
              code({node, className, children, ...props}: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return !isInline && match ? (
                  <Card className="relative mt-3 overflow-hidden border border-border/50 bg-muted/30">
                    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/30">
                      <div className="flex items-center gap-2">
                        <Code className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{match[1]}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/50"
                        onClick={() => copyToClipboard(String(children))}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="relative">
                      <SyntaxHighlighter
                        style={isDarkMode ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        className="text-sm !bg-transparent !p-4"
                        customStyle={{
                          background: 'transparent',
                          margin: 0,
                          padding: '1rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.5'
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  </Card>
                ) : (
                  <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-xs font-mono border border-primary/20" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
          
          {/* Message Actions */}
          <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(message.content)}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => addReaction(message.id, '👍')}
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.metadata?.processingTime && (
            <Badge variant="outline" className="text-xs">
              {Math.round(message.metadata.processingTime)}ms
            </Badge>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => addReaction(message.id, reaction.emoji)}
                className={`
                  text-xs px-2 py-1 rounded-full transition-colors
                  ${reaction.userReacted 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted hover:bg-muted/80'
                  }
                `}
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {message.actions && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.action}
                className="h-7 text-xs"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {message.suggestions && (
          <div className="flex flex-wrap gap-2 mt-2 max-w-full">
            {message.suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSendMessage(suggestion)}
                className="text-xs px-3 py-1 bg-chat-quick-reply text-foreground rounded-full hover:bg-chat-quick-reply-hover transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        )}

        {/* Card Data */}
        {message.cardData && (
          <Card className="mt-2 max-w-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{message.cardData.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {message.cardData.type === 'status' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {message.cardData.data.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Uptime</span>
                    <span className="text-xs font-mono">{message.cardData.data.uptime}</span>
                  </div>
                  {message.cardData.data.endpoints && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Endpoints</span>
                      <span className="text-xs font-mono">{message.cardData.data.endpoints}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );

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
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
              
              {/* Notification Indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-2 h-2 text-success-foreground" />
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 ${
              isExpanded 
                ? 'inset-4 max-w-none' 
                : isMinimized 
                ? 'bottom-6 right-6 w-80 h-16'
                : 'bottom-6 right-6 w-[90vw] max-w-[42rem] h-[85vh] max-h-[42rem] sm:w-[32rem] md:w-[36rem] lg:w-[40rem]'
            }`}
          >
            <Card className={`
              h-full shadow-2xl border-2 border-primary/20 overflow-hidden
              transition-all duration-300 bg-card/95 backdrop-blur-sm
              ${isExpanded ? 'rounded-xl' : 'rounded-2xl'}
            `}>
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
                      linear-gradient(45deg, transparent 30%, hsl(var(--primary) / 0.05) 50%, transparent 70%)
                    `,
                    animation: 'gradient-shift 8s ease-in-out infinite'
                  }}
                />
              </div>

              {/* Header */}
              <div className="relative flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow">
                      <AvatarFallback>
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card shadow-md" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      AI Control Center
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/20 to-accent/20">
                        <Zap className="w-2.5 h-2.5 mr-1" />
                        Pro
                      </Badge>
                    </h3>
                    {!isMinimized && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        Online • Real-time responses
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Header Controls */}
                <div className="flex items-center gap-1">
                  {!isMinimized && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                        className="h-8 w-8 p-0"
                      >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSearch(!showSearch)}
                        className="h-8 w-8 p-0"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCommandPalette(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Command className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReferencePanel(!showReferencePanel)}
                        className="h-8 w-8 p-0"
                      >
                        <Sidebar className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-4 mx-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetChat}
                        className="h-8 w-8 p-0"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 w-8 p-0"
                  >
                    <Expand className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Search Bar */}
                  <AnimatePresence>
                    {showSearch && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-3 border-b border-border bg-muted/30"
                      >
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-8"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 px-4 py-4">
                    <div className="space-y-6">
                      {filteredMessages.map(renderMessage)}
                      
                      {/* Typing Indicator */}
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
                          <div className="bg-chat-bubble-bot border border-border rounded-2xl px-4 py-3">
                            <motion.div className="flex space-x-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-muted-foreground rounded-full"
                                  animate={{ y: [0, -8, 0] }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t border-border bg-gradient-to-r from-background/50 to-muted/30">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Ask me anything about your system, or try /status, /deploy, /logs..."
                          className="min-h-[2.5rem] max-h-32 resize-none"
                          rows={1}
                          disabled={isTyping}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleVoice}
                              className={`h-7 w-7 p-0 ${isListening ? 'bg-destructive/10 text-destructive' : ''}`}
                            >
                              {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsMuted(!isMuted)}
                              className={`h-7 w-7 p-0 ${isMuted ? 'bg-muted text-muted-foreground' : ''}`}
                            >
                              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘K</kbd>
                            <span>for commands</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-200"
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
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
      />

      {/* Reference Panel */}
      <ReferencePanel 
        isOpen={showReferencePanel} 
        onClose={() => setShowReferencePanel(false)}
        references={messages
          .filter(msg => msg.references)
          .flatMap(msg => msg.references || [])
          .map(ref => ({
            ...ref,
            type: ref.type as 'page' | 'metric' | 'log' | 'doc'
          }))
        }
      />
    </>
  );
}