import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Puzzle, 
  Plus, 
  Settings, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Slack,
  Mail,
  MessageSquare,
  Database,
  Cloud,
  Shield,
  Activity,
  Bell,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const integrationCategories = [
  {
    id: 'communication',
    name: 'Communication',
    icon: MessageSquare,
    description: 'Team communication and notifications',
    integrations: [
      {
        id: 'slack',
        name: 'Slack',
        icon: Slack,
        description: 'Send webhook notifications to Slack channels',
        status: 'connected',
        config: { channels: 3, lastSync: '2 minutes ago' }
      },
      {
        id: 'email',
        name: 'Email Notifications',
        icon: Mail,
        description: 'Email alerts and delivery reports',
        status: 'connected',
        config: { templates: 5, lastSent: '1 hour ago' }
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        icon: MessageSquare,
        description: 'Microsoft Teams webhook notifications',
        status: 'available'
      }
    ]
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Analytics',
    icon: Activity,
    description: 'Performance monitoring and observability',
    integrations: [
      {
        id: 'datadog',
        name: 'Datadog',
        icon: Activity,
        description: 'APM and infrastructure monitoring',
        status: 'connected',
        config: { metrics: 25, dashboards: 4 }
      },
      {
        id: 'newrelic',
        name: 'New Relic',
        icon: Zap,
        description: 'Application performance monitoring',
        status: 'available'
      },
      {
        id: 'grafana',
        name: 'Grafana',
        icon: Activity,
        description: 'Custom dashboards and alerting',
        status: 'available'
      }
    ]
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    icon: Shield,
    description: 'Security scanning and compliance tools',
    integrations: [
      {
        id: 'vault',
        name: 'HashiCorp Vault',
        icon: Shield,
        description: 'Secrets management and encryption',
        status: 'connected',
        config: { secrets: 12, policies: 8 }
      },
      {
        id: 'okta',
        name: 'Okta',
        icon: Shield,
        description: 'Identity and access management',
        status: 'available'
      }
    ]
  },
  {
    id: 'storage',
    name: 'Data & Storage',
    icon: Database,
    description: 'Data storage and backup solutions',
    integrations: [
      {
        id: 'aws-s3',
        name: 'AWS S3',
        icon: Cloud,
        description: 'Object storage for webhook payloads',
        status: 'connected',
        config: { buckets: 3, objects: 15420 }
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        icon: Database,
        description: 'Primary database for webhook data',
        status: 'connected',
        config: { connections: 25, queries: 1240 }
      }
    ]
  }
];

export default function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState('communication');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const statusColors = {
    connected: 'bg-success',
    available: 'bg-muted-foreground',
    error: 'bg-destructive'
  };

  const statusIcons = {
    connected: CheckCircle,
    available: Clock,
    error: XCircle
  };

  const IntegrationCard = ({ integration }: { integration: any }) => {
    const StatusIcon = statusIcons[integration.status as keyof typeof statusIcons];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="p-2 bg-primary/10 rounded-lg"
                >
                  <integration.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {integration.name}
                    <Badge 
                      variant="outline" 
                      className={`text-white ${statusColors[integration.status as keyof typeof statusColors]}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {integration.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">{integration.description}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {integration.config && (
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-3 rounded-lg">
                {Object.entries(integration.config).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="font-medium">{value as string}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              {integration.status === 'connected' ? (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedIntegration(integration);
                      setIsConfiguring(true);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1">
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const currentCategory = integrationCategories.find(cat => cat.id === selectedCategory);
  const filteredIntegrations = currentCategory?.integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Puzzle className="w-8 h-8 text-primary" />
            </motion.div>
            Integrations
          </h1>
          <p className="text-muted-foreground">Connect external services and enhance your webhook workflow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Code className="w-4 h-4 mr-2" />
            API Keys
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Browse Marketplace
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Events Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">99.8%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Navigation */}
            <div className="lg:w-64 space-y-2">
              <h3 className="font-medium mb-3">Categories</h3>
              {integrationCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  whileHover={{ x: selectedCategory === category.id ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <category.icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs opacity-70">{category.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Search */}
              <div className="mb-6">
                <Input
                  placeholder={`Search ${currentCategory?.name.toLowerCase()} integrations...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {/* Integration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIntegrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIntegration?.icon && <selectedIntegration.icon className="w-5 h-5" />}
              Configure {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              Manage settings and preferences for this integration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Connected</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Sync</Label>
                <p className="text-sm text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts to this integration</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Error Reporting</Label>
                  <p className="text-sm text-muted-foreground">Report errors and failures</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Save Changes</Button>
              <Button variant="outline" onClick={() => setIsConfiguring(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}