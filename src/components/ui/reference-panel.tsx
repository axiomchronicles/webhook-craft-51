import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  BarChart3, 
  Terminal, 
  AlertTriangle, 
  Settings,
  ChevronRight,
  Database,
  Activity,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface ReferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  references: Reference[];
  onAddReference: (reference: Reference) => void;
}

export function ReferencePanel({ isOpen, onClose, references, onAddReference }: ReferencePanelProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredReferences = references.filter(ref => {
    if (activeTab === 'all') return true;
    return ref.type === activeTab;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-primary/10 text-primary';
      case 'metric': return 'bg-success/10 text-success';
      case 'log': return 'bg-warning/10 text-warning';
      case 'alert': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const mockReferences: Reference[] = [
    {
      id: '1',
      title: 'System Health Dashboard',
      description: 'Real-time system metrics and performance indicators',
      type: 'page',
      url: '/dashboard',
      icon: BarChart3,
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Webhook Success Rate',
      description: '99.2% success rate over the last 24 hours',
      type: 'metric',
      data: { value: 99.2, unit: '%', trend: '+0.3%' },
      icon: Activity,
      timestamp: new Date()
    },
    {
      id: '3',
      title: 'Recent Error Logs',
      description: 'Connection timeout in webhook delivery service',
      type: 'log',
      url: '/console',
      icon: Terminal,
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '4',
      title: 'High Response Time Alert',
      description: 'Average response time exceeded 2s threshold',
      type: 'alert',
      url: '/alerts',
      icon: AlertTriangle,
      timestamp: new Date(Date.now() - 900000)
    }
  ];

  const allReferences = [...references, ...mockReferences];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card-header">
                <div>
                  <h3 className="font-semibold text-lg">References</h3>
                  <p className="text-sm text-muted-foreground">
                    Related pages, metrics, and logs
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="p-4 border-b border-border">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="page" className="text-xs">Pages</TabsTrigger>
                    <TabsTrigger value="metric" className="text-xs">Metrics</TabsTrigger>
                    <TabsTrigger value="log" className="text-xs">Logs</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredReferences.map((reference, index) => (
                      <motion.div
                        key={reference.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${getTypeColor(reference.type)}`}>
                                  <reference.icon className="w-4 h-4" />
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm truncate">
                                      {reference.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {reference.description}
                                    </p>
                                  </div>
                                  
                                  {reference.url && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(reference.url, '_blank');
                                      }}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                  <Badge variant="secondary" className={`text-xs ${getTypeColor(reference.type)}`}>
                                    {reference.type}
                                  </Badge>
                                  
                                  {reference.timestamp && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {reference.timestamp.toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  )}
                                </div>

                                {reference.data && (
                                  <div className="mt-2 p-2 bg-muted/50 rounded-md">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Current Value</span>
                                      <span className="font-medium">
                                        {reference.data.value}
                                        {reference.data.unit}
                                        {reference.data.trend && (
                                          <span className="text-success ml-1">
                                            {reference.data.trend}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredReferences.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Database className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No {activeTab === 'all' ? '' : activeTab} references yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        References will appear as you interact with the chatbot
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              <div className="p-4 border-t border-border bg-muted/20">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.open('/dashboard', '_blank')}
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.open('/console', '_blank')}
                  >
                    <Terminal className="w-3 h-3 mr-1" />
                    Console
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}