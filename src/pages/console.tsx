import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MonitorSpeaker, 
  Play, 
  Pause, 
  Search, 
  Filter, 
  Download, 
  Copy,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Clear
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface LogEntry {
  id: number;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  service: string;
  message: string;
  details?: any;
  traceId?: string;
}

const logLevels = {
  info: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Info },
  warn: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: AlertCircle },
  error: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
  success: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle }
};

const services = ['webhook-gateway', 'payment-service', 'user-service', 'notification-service', 'analytics'];

const generateMockLog = (id: number): LogEntry => {
  const levels = ['info', 'warn', 'error', 'success'] as const;
  const level = levels[Math.floor(Math.random() * levels.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  
  const messages = {
    info: [
      'Webhook delivered successfully',
      'Processing incoming request',
      'Database connection established',
      'Cache updated',
      'Rate limit check passed'
    ],
    warn: [
      'Retry attempt initiated',
      'Rate limit approaching',
      'Slow query detected',
      'Memory usage high',
      'Connection pool exhausted'
    ],
    error: [
      'Webhook delivery failed',
      'Database connection lost',
      'Authentication failed',
      'Service timeout',
      'Invalid payload format'
    ],
    success: [
      'Payment processed successfully',
      'User registration completed',
      'Email notification sent',
      'Webhook endpoint validated',
      'Pipeline execution completed'
    ]
  };

  return {
    id,
    timestamp: new Date(),
    level,
    service,
    message: messages[level][Math.floor(Math.random() * messages[level].length)],
    traceId: `trace_${Math.random().toString(36).substr(2, 9)}`,
    details: level === 'error' ? { 
      statusCode: 500,
      endpoint: 'https://api.example.com/webhook',
      error: 'Connection timeout after 30s'
    } : undefined
  };
};

export default function Console() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsRef = useRef<HTMLDivElement>(null);

  // Generate initial logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 20 }, (_, i) => generateMockLog(i + 1));
    setLogs(initialLogs);
  }, []);

  // Streaming logs simulation
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newLog = generateMockLog(Date.now());
      setLogs(prev => [...prev.slice(-199), newLog]); // Keep last 200 logs
    }, Math.random() * 2000 + 1000); // Random interval between 1-3 seconds

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.traceId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(log => log.service === selectedService);
    }

    setFilteredLogs(filtered);
  }, [logs, searchQuery, selectedLevel, selectedService]);

  // Auto scroll
  useEffect(() => {
    if (autoScroll && logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const handleClear = () => {
    setLogs([]);
    setFilteredLogs([]);
  };

  const handleExport = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      service: log.service,
      message: log.message,
      traceId: log.traceId,
      details: log.details
    }));
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLogs = () => {
    const content = filteredLogs
      .map(log => `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()} ${log.service}: ${log.message}`)
      .join('\n');
    navigator.clipboard.writeText(content);
  };

  const LogEntryComponent = ({ log }: { log: LogEntry }) => {
    const levelConfig = logLevels[log.level];
    const IconComponent = levelConfig.icon;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-3 rounded-lg border border-border/50 ${levelConfig.bg} hover:bg-muted/50 transition-colors`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-1 rounded ${levelConfig.bg}`}>
            <IconComponent className={`w-4 h-4 ${levelConfig.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {log.service}
              </Badge>
              <Badge variant="secondary" className={`text-xs ${levelConfig.color}`}>
                {log.level.toUpperCase()}
              </Badge>
              {showTimestamps && (
                <span className="text-xs text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              )}
              {log.traceId && (
                <Badge variant="outline" className="text-xs font-mono">
                  {log.traceId}
                </Badge>
              )}
            </div>
            
            <p className="text-sm font-mono break-words">{log.message}</p>
            
            {log.details && (
              <details className="mt-2">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Show details
                </summary>
                <pre className="mt-1 text-xs bg-muted/50 p-2 rounded border overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>
    );
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
            <MonitorSpeaker className="w-8 h-8" />
            Live Console
          </h1>
          <p className="text-muted-foreground">Real-time application logs and system events</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isStreaming ? "default" : "outline"}
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={copyLogs} disabled={filteredLogs.length === 0}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredLogs.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Clear className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs, services, trace IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map(service => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timestamps"
                  checked={showTimestamps}
                  onCheckedChange={setShowTimestamps}
                />
                <label htmlFor="timestamps" className="text-sm">Timestamps</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoscroll"
                  checked={autoScroll}
                  onCheckedChange={setAutoScroll}
                />
                <label htmlFor="autoscroll" className="text-sm">Auto-scroll</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{logs.filter(l => l.level === 'info').length}</p>
                <p className="text-xs text-muted-foreground">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{logs.filter(l => l.level === 'warn').length}</p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-2xl font-bold">{logs.filter(l => l.level === 'error').length}</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{logs.length}</p>
                <p className="text-xs text-muted-foreground">Total Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Display */}
      <Card className="bg-black/95 border-primary/20">
        <CardHeader className="border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <CardTitle className="text-green-400 font-mono text-sm">
                console.log()
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isStreaming && (
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Live</span>
                </div>
              )}
              <Badge variant="outline" className="text-xs">
                {filteredLogs.length} entries
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={logsRef}
            className="h-96 overflow-y-auto p-4 space-y-2 bg-gradient-to-br from-black/90 to-gray-900/90"
          >
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MonitorSpeaker className="w-12 h-12 mx-auto mb-4" />
                <p>No logs match your current filters</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredLogs.map((log) => (
                  <div key={log.id} className="group">
                    <LogEntryComponent log={log} />
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}