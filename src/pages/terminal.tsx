import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Copy, Trash2, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CommandOutput {
  id: number;
  command: string;
  output: string[];
  timestamp: Date;
  type: 'success' | 'error' | 'info';
}

const mockCommands = {
  help: {
    output: [
      'Available commands:',
      '  help              Show this help message',
      '  clear             Clear terminal history',
      '  status            Show system status',
      '  list              List webhook endpoints',
      '  test <endpoint>   Test a webhook endpoint',
      '  logs              Show recent delivery logs',
      '  config            Show configuration',
      '  version           Show version information',
      '  exit              Exit terminal session'
    ],
    type: 'info' as const
  },
  status: {
    output: [
      'System Status: ✅ All systems operational',
      'Active Endpoints: 847',
      'Deliveries (24h): 12,437',
      'Success Rate: 98.7%',
      'Avg Response Time: 165ms',
      'Last Check: ' + new Date().toLocaleTimeString()
    ],
    type: 'success' as const
  },
  list: {
    output: [
      'Active Webhook Endpoints:',
      '  1. Payment Gateway      https://api.example.com/webhooks/payments',
      '  2. User Service         https://api.example.com/webhooks/users',
      '  3. Order Processing     https://api.example.com/webhooks/orders',
      '  4. Notification Service https://api.example.com/webhooks/notifications',
      '  5. Analytics Tracker    https://api.example.com/webhooks/analytics'
    ],
    type: 'info' as const
  },
  logs: {
    output: [
      '[2024-01-25 10:30:15] SUCCESS - Webhook delivered to payment-gateway (200ms)',
      '[2024-01-25 10:30:12] SUCCESS - Webhook delivered to user-service (145ms)',
      '[2024-01-25 10:30:08] RETRY   - Webhook to order-processing (timeout)',
      '[2024-01-25 10:30:05] SUCCESS - Webhook delivered to notifications (89ms)',
      '[2024-01-25 10:30:01] ERROR   - Failed to deliver to analytics (500)',
    ],
    type: 'info' as const
  },
  config: {
    output: [
      'Current Configuration:',
      '  Environment: production',
      '  Region: us-east-1',
      '  Max Retries: 3',
      '  Retry Interval: 30s',
      '  Timeout: 30s',
      '  Rate Limit: 1000/min',
      '  Security: TLS 1.3, mTLS enabled'
    ],
    type: 'info' as const
  },
  version: {
    output: [
      'Webhooks Gateway v2.4.1',
      'Build: 20240125-abc123f',
      'Node.js: v18.17.0',
      'Platform: linux-x64',
      'Uptime: 15d 7h 23m'
    ],
    type: 'info' as const
  }
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    const timestamp = new Date();
    setCommandHistory(prev => [...prev.slice(-49), command]); // Keep last 50 commands
    setHistoryIndex(-1);

    // Add command to history immediately
    const commandEntry: CommandOutput = {
      id: Date.now(),
      command,
      output: [],
      timestamp,
      type: 'info'
    };

    setHistory(prev => [...prev, commandEntry]);
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const [cmd, ...args] = command.toLowerCase().split(' ');
    let response: { output: string[]; type: 'success' | 'error' | 'info' };

    if (cmd === 'clear') {
      setHistory([]);
      setIsTyping(false);
      return;
    }

    if (cmd in mockCommands) {
      response = mockCommands[cmd as keyof typeof mockCommands];
    } else if (cmd === 'test' && args.length > 0) {
      response = {
        output: [
          `Testing endpoint: ${args[0]}`,
          'Sending test webhook...',
          '✅ Success! Response: 200 OK (142ms)',
          'Headers: {"content-type": "application/json"}',
          'Body: {"status": "received", "id": "wh_test_123"}'
        ],
        type: 'success'
      };
    } else {
      response = {
        output: [`Command not found: ${cmd}`, 'Type "help" for available commands'],
        type: 'error'
      };
    }

    // Simulate typing animation
    for (let i = 0; i < response.output.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setHistory(prev => 
        prev.map(entry => 
          entry.id === commandEntry.id 
            ? { ...entry, output: response.output.slice(0, i + 1), type: response.type }
            : entry
        )
      );
    }

    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      executeCommand(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  const copyContent = () => {
    const content = history
      .map(entry => `$ ${entry.command}\n${entry.output.join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TerminalIcon className="w-8 h-8" />
            Terminal
          </h1>
          <p className="text-muted-foreground">Interactive command-line interface for webhook management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyContent} disabled={history.length === 0}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Output
          </Button>
          <Button variant="outline" size="sm" onClick={clearTerminal} disabled={history.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Terminal Card */}
      <Card className="bg-black/95 border-primary/20 shadow-2xl backdrop-blur-sm">
        <CardHeader className="border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <CardTitle className="text-green-400 font-mono text-sm">
                webhooks@gateway:~$
              </CardTitle>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary">
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={terminalRef}
            className="h-96 overflow-y-auto p-4 font-mono text-sm bg-gradient-to-br from-black/90 to-gray-900/90"
          >
            {/* Welcome Message */}
            {history.length === 0 && (
              <div className="text-green-400 mb-4">
                <p>Welcome to Webhooks Gateway Terminal v2.4.1</p>
                <p className="text-gray-400">Type "help" for available commands</p>
                <br />
              </div>
            )}

            {/* Command History */}
            <AnimatePresence>
              {history.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">$</span>
                    <span className="text-white">{entry.command}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="ml-4">
                    {entry.output.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${
                          entry.type === 'error' 
                            ? 'text-red-400' 
                            : entry.type === 'success' 
                            ? 'text-green-400' 
                            : 'text-gray-300'
                        }`}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-yellow-400"
              >
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-200"></div>
                </div>
                <span className="text-sm">Processing...</span>
              </motion.div>
            )}

            {/* Command Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="flex-1 bg-transparent text-white outline-none font-mono placeholder-gray-500"
                placeholder="Enter command..."
                autoComplete="off"
                spellCheck={false}
              />
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-4 bg-green-400"
              />
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Quick Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Commands</CardTitle>
          <CardDescription>Click to execute common commands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['status', 'list', 'logs', 'config', 'help'].map((cmd) => (
              <Button
                key={cmd}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(cmd);
                  executeCommand(cmd);
                  setInput('');
                }}
                disabled={isTyping}
                className="font-mono"
              >
                {cmd}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}