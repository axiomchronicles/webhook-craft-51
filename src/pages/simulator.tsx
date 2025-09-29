import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Code, 
  Clock, 
  Zap,
  CheckCircle,
  XCircle,
  Activity,
  Copy,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export default function Simulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [requestCount, setRequestCount] = useState(10);
  const [interval, setInterval] = useState(1000);
  const [payload, setPayload] = useState('{\n  "event": "user.created",\n  "data": {\n    "id": "user_123",\n    "email": "john@example.com",\n    "name": "John Doe"\n  }\n}');
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  const mockEndpoints = [
    { id: 'ep1', name: 'Payment Gateway', url: 'https://api.example.com/webhooks/payments' },
    { id: 'ep2', name: 'User Service', url: 'https://api.example.com/webhooks/users' },
    { id: 'ep3', name: 'Order Processing', url: 'https://api.example.com/webhooks/orders' },
  ];

  const mockResults = [
    { id: 1, status: 'success', responseTime: 145, timestamp: new Date(), statusCode: 200 },
    { id: 2, status: 'success', responseTime: 203, timestamp: new Date(), statusCode: 200 },
    { id: 3, status: 'failed', responseTime: 5000, timestamp: new Date(), statusCode: 500 },
    { id: 4, status: 'success', responseTime: 167, timestamp: new Date(), statusCode: 201 },
  ];

  const handleStart = () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    
    // Simulate webhook sending
    let completed = 0;
    const timer = setInterval(() => {
      completed++;
      setProgress((completed / requestCount) * 100);
      
      // Add mock result
      const newResult = {
        id: completed,
        status: Math.random() > 0.2 ? 'success' : 'failed',
        responseTime: Math.floor(Math.random() * 1000) + 50,
        timestamp: new Date(),
        statusCode: Math.random() > 0.2 ? 200 : 500,
      };
      
      setResults(prev => [newResult, ...prev]);
      
      if (completed >= requestCount) {
        clearInterval(timer);
        setIsRunning(false);
      }
    }, interval);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setResults([]);
    setProgress(0);
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const avgResponseTime = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Webhook Simulator</h1>
          <p className="text-muted-foreground">Test webhook endpoints with realistic payloads and load patterns</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Advanced Config
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Test Configuration
              </CardTitle>
              <CardDescription>
                Configure your webhook simulation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Endpoint</Label>
                <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select endpoint to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEndpoints.map(endpoint => (
                      <SelectItem key={endpoint.id} value={endpoint.id}>
                        {endpoint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Request Count</Label>
                  <Input
                    type="number"
                    value={requestCount}
                    onChange={(e) => setRequestCount(parseInt(e.target.value))}
                    min={1}
                    max={1000}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interval (ms)</Label>
                  <Input
                    type="number"
                    value={interval}
                    onChange={(e) => setInterval(parseInt(e.target.value))}
                    min={100}
                    max={10000}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Request Payload</Label>
                <Textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                  placeholder="Enter JSON payload..."
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  onClick={handleStart}
                  disabled={isRunning || !selectedEndpoint}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Test
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!isRunning}
                  variant="outline"
                >
                  <Pause className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-success">{successCount}</p>
                      <p className="text-xs text-muted-foreground">Successful</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="text-2xl font-bold text-destructive">{failedCount}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-info" />
                    <div>
                      <p className="text-2xl font-bold text-info">{avgResponseTime}ms</p>
                      <p className="text-xs text-muted-foreground">Avg Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" />
                    <div>
                      <p className="text-2xl font-bold text-warning">{results.length}</p>
                      <p className="text-xs text-muted-foreground">Total Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Test Results
                </CardTitle>
                <CardDescription>
                  Real-time results from your webhook simulation
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">No Results Yet</h3>
                  <p className="text-muted-foreground">Configure your test and click "Start Test" to begin</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.statusCode}
                        </Badge>
                        <div className="text-sm">
                          <p className="font-medium">Request #{result.id}</p>
                          <p className="text-muted-foreground text-xs">
                            {result.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.responseTime}ms
                        </Badge>
                        {result.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}