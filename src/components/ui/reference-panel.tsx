import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  FileText, 
  BarChart3, 
  Terminal, 
  Settings,
  Database,
  Users,
  Monitor,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ReferenceItem {
  id: string;
  title: string;
  type: 'page' | 'metric' | 'log' | 'doc';
  url: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
  value?: string;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated?: Date;
}

interface ReferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  references: ReferenceItem[];
  title?: string;
}

const TYPE_ICONS = {
  page: <Monitor className="w-4 h-4" />,
  metric: <BarChart3 className="w-4 h-4" />,
  log: <Terminal className="w-4 h-4" />,
  doc: <FileText className="w-4 h-4" />
};

const STATUS_STYLES = {
  healthy: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive'
};

const TREND_ICONS = {
  up: <TrendingUp className="w-3 h-3 text-success" />,
  down: <TrendingUp className="w-3 h-3 text-destructive rotate-180" />,
  stable: <Activity className="w-3 h-3 text-muted-foreground" />
};

// Sample reference data
const SAMPLE_REFERENCES: ReferenceItem[] = [
  {
    id: '1',
    title: 'Webhook Endpoints',
    type: 'page',
    url: '/endpoints',
    description: 'Manage and monitor webhook endpoints',
    status: 'healthy'
  },
  {
    id: '2',
    title: 'Success Rate',
    type: 'metric',
    url: '/metrics',
    value: '99.2%',
    trend: 'up',
    status: 'healthy',
    lastUpdated: new Date()
  },
  {
    id: '3',
    title: 'System Logs',
    type: 'log',
    url: '/console',
    description: 'Real-time system and error logs',
    lastUpdated: new Date()
  },
  {
    id: '4',
    title: 'Failed Deliveries',
    type: 'metric',
    url: '/deliveries?status=failed',
    value: '12',
    trend: 'down',
    status: 'warning',
    lastUpdated: new Date()
  },
  {
    id: '5',
    title: 'Team Settings',
    type: 'page',
    url: '/teams',
    description: 'Manage team members and permissions',
    status: 'healthy'
  },
  {
    id: '6',
    title: 'API Documentation',
    type: 'doc',
    url: '/docs/api',
    description: 'Complete API reference and examples'
  }
];

export function ReferencePanel({ 
  isOpen, 
  onClose, 
  references = SAMPLE_REFERENCES,
  title = "Related References" 
}: ReferencePanelProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pages' | 'metrics' | 'logs'>('all');

  const filteredReferences = references.filter(ref => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pages') return ref.type === 'page' || ref.type === 'doc';
    if (selectedTab === 'metrics') return ref.type === 'metric';
    if (selectedTab === 'logs') return ref.type === 'log';
    return true;
  });

  const handleReferenceClick = (reference: ReferenceItem) => {
    window.open(reference.url, '_blank');
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 shadow-2xl"
        >
          <Card className="h-full rounded-none border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-1 mt-3">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pages', label: 'Pages' },
                  { key: 'metrics', label: 'Metrics' },
                  { key: 'logs', label: 'Logs' }
                ].map((tab) => (
                  <Button
                    key={tab.key}
                    variant={selectedTab === tab.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedTab(tab.key as any)}
                    className="text-xs h-7 px-3"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full px-4">
                <div className="space-y-3 pb-4">
                  {filteredReferences.map((reference, index) => (
                    <motion.div
                      key={reference.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleReferenceClick(reference)}
                      className="group cursor-pointer"
                    >
                      <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/20 border">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-1.5 rounded-md bg-muted">
                                {TYPE_ICONS[reference.type]}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                                    {reference.title}
                                  </h3>
                                  {reference.status && (
                                    <Badge 
                                      variant="secondary"
                                      className={`text-xs ${STATUS_STYLES[reference.status]}`}
                                    >
                                      {reference.status}
                                    </Badge>
                                  )}
                                </div>
                                
                                {reference.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {reference.description}
                                  </p>
                                )}
                                
                                {reference.value && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="font-mono text-sm font-semibold">
                                      {reference.value}
                                    </span>
                                    {reference.trend && TREND_ICONS[reference.trend]}
                                  </div>
                                )}
                                
                                {reference.lastUpdated && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {formatLastUpdated(reference.lastUpdated)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {filteredReferences.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No references found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="p-4 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Click any item to open in new tab
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}