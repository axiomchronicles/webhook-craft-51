import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Plus, 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock,
  Target,
  Activity,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const mockAlerts = [
  {
    id: 1,
    name: 'High Error Rate',
    description: 'Alert when error rate exceeds 5% in 5 minutes',
    status: 'active',
    severity: 'critical',
    condition: 'error_rate > 5%',
    lastTriggered: '2 hours ago',
    triggerCount: 3
  },
  {
    id: 2,
    name: 'Response Time SLA Breach',
    description: 'P95 response time exceeds 1 second',
    status: 'active',
    severity: 'warning',
    condition: 'p95_response_time > 1000ms',
    lastTriggered: '6 hours ago',
    triggerCount: 1
  },
  {
    id: 3,
    name: 'Webhook Endpoint Down',
    description: 'Endpoint returning 5xx errors for 2+ minutes',
    status: 'paused',
    severity: 'critical',
    condition: 'status_5xx_rate > 50%',
    lastTriggered: '1 day ago',
    triggerCount: 8
  }
];

const mockIncidents = [
  {
    id: 1,
    title: 'Payment Service Degradation',
    severity: 'critical',
    status: 'active',
    startTime: new Date(Date.now() - 3600000),
    affectedServices: ['payment-gateway', 'checkout-api'],
    description: 'High latency and timeout rates detected'
  },
  {
    id: 2,
    title: 'Rate Limit Threshold Reached',
    severity: 'warning',
    status: 'resolved',
    startTime: new Date(Date.now() - 7200000),
    resolvedTime: new Date(Date.now() - 1800000),
    affectedServices: ['user-service'],
    description: 'Temporary spike in traffic caused rate limiting'
  }
];

export default function Alerts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  const severityColors = {
    critical: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const AlertCard = ({ alert }: { alert: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${severityColors[alert.severity as keyof typeof severityColors]}`} />
                <CardTitle className="text-lg">{alert.name}</CardTitle>
                <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                  {alert.status}
                </Badge>
              </div>
              <CardDescription>{alert.description}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {alert.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm font-mono bg-muted p-2 rounded">
            {alert.condition}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Last Triggered</p>
              <p className="font-medium">{alert.lastTriggered}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Trigger Count</p>
              <p className="font-medium">{alert.triggerCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & SLOs</h1>
          <p className="text-muted-foreground">Monitor system health and service level objectives</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Alert Rule</DialogTitle>
                <DialogDescription>
                  Set up monitoring and notifications for your webhook system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Alert Name</Label>
                  <Input placeholder="Enter alert name..." />
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Textarea placeholder="error_rate > 5%" />
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create Alert</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">99.2%</p>
                <p className="text-xs text-muted-foreground">SLO Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Incidents Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
          <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
          <TabsTrigger value="slos">Service Level Objectives</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alert rules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          {mockIncidents.map((incident) => (
            <Card key={incident.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${severityColors[incident.severity as keyof typeof severityColors]}`} />
                    <div>
                      <h4 className="font-medium">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                    </div>
                  </div>
                  <Badge variant={incident.status === 'active' ? 'destructive' : 'secondary'}>
                    {incident.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Started</p>
                    <p className="font-medium">{incident.startTime.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {incident.status === 'resolved' 
                        ? `${Math.floor((incident.resolvedTime!.getTime() - incident.startTime.getTime()) / 60000)}m`
                        : `${Math.floor((Date.now() - incident.startTime.getTime()) / 60000)}m`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Affected Services</p>
                    <p className="font-medium">{incident.affectedServices.length} services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="slos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability SLO</CardTitle>
                <CardDescription>99.9% uptime target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current: 99.95%</span>
                    <span className="text-success">Above target</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full w-full"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Error budget: 98.5% remaining
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time SLO</CardTitle>
                <CardDescription>P95 under 500ms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current: 290ms</span>
                    <span className="text-success">Within target</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full w-3/5"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Error budget: 85% remaining
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}