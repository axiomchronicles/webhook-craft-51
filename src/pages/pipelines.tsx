import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  GitBranch, 
  Play, 
  Pause, 
  Settings, 
  Code2, 
  Layers,
  ArrowRight,
  Filter,
  Shuffle,
  Database,
  Send,
  Edit,
  Trash2,
  Copy,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const mockPipelines = [
  {
    id: 1,
    name: 'Payment Processing Pipeline',
    description: 'Process payment webhooks with fraud detection and notifications',
    status: 'active',
    nodes: 5,
    lastRun: '2 minutes ago',
    successRate: 98.5,
    throughput: '1.2K/hour',
    created: '2024-01-15'
  },
  {
    id: 2,
    name: 'User Onboarding Flow',
    description: 'Welcome email sequence and account setup automation',
    status: 'paused',
    nodes: 3,
    lastRun: '1 hour ago',
    successRate: 100,
    throughput: '450/hour',
    created: '2024-01-20'
  },
  {
    id: 3,
    name: 'Order Fulfillment Chain',
    description: 'Inventory checks, shipping labels, and customer notifications',
    status: 'active',
    nodes: 7,
    lastRun: '5 minutes ago',
    successRate: 95.2,
    throughput: '800/hour',
    created: '2024-01-25'
  }
];

const nodeTypes = [
  { type: 'filter', icon: Filter, name: 'Filter', description: 'Filter events based on conditions' },
  { type: 'transform', icon: Shuffle, name: 'Transform', description: 'Modify payload structure' },
  { type: 'database', icon: Database, name: 'Database', description: 'Store or query data' },
  { type: 'webhook', icon: Send, name: 'Webhook', description: 'Send HTTP requests' },
];

export default function Pipelines() {
  const [selectedPipeline, setSelectedPipeline] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const PipelineCard = ({ pipeline }: { pipeline: any }) => (
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
              <CardTitle className="text-lg">{pipeline.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {pipeline.description}
              </CardDescription>
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
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
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
          <div className="flex items-center justify-between">
            <Badge 
              variant={pipeline.status === 'active' ? 'default' : 'secondary'}
              className={pipeline.status === 'active' ? 'bg-success' : ''}
            >
              {pipeline.status}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {pipeline.nodes} nodes
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Success Rate</p>
              <p className="font-medium text-success">{pipeline.successRate}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Throughput</p>
              <p className="font-medium">{pipeline.throughput}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Last run: {pipeline.lastRun}
            </span>
            <Button 
              size="sm" 
              variant={pipeline.status === 'active' ? 'outline' : 'default'}
            >
              {pipeline.status === 'active' ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PipelineBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Builder</CardTitle>
          <CardDescription>
            Drag and drop components to build your webhook processing pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Node Types Palette */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {nodeTypes.map((nodeType) => (
              <motion.div
                key={nodeType.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <nodeType.icon className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{nodeType.name}</p>
                    <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Canvas Area */}
          <div className="min-h-96 border-2 border-dashed border-border rounded-lg bg-muted/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <GitBranch className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">Start Building</h3>
                <p className="text-muted-foreground">Drag components here to create your pipeline</p>
              </div>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add First Node
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
          <h1 className="text-3xl font-bold text-foreground">Pipelines</h1>
          <p className="text-muted-foreground">Build and manage webhook processing workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Code2 className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Pipeline
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Pipeline</DialogTitle>
                <DialogDescription>
                  Set up a new webhook processing pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Pipeline Name</Label>
                  <Input placeholder="Enter pipeline name..." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what this pipeline does..." />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create & Build</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockPipelines.length}</p>
                <p className="text-xs text-muted-foreground">Active Pipelines</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-muted-foreground">Total Nodes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">2.4K</p>
                <p className="text-xs text-muted-foreground">Executions Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">97.8%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="pipelines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipelines">My Pipelines</TabsTrigger>
          <TabsTrigger value="builder">Pipeline Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPipelines.map((pipeline) => (
              <PipelineCard key={pipeline.id} pipeline={pipeline} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <PipelineBuilder />
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>E-commerce Order Processing</CardTitle>
                <CardDescription>
                  Complete order fulfillment pipeline with inventory checks and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">7 nodes</Badge>
                  <Button size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Registration Flow</CardTitle>
                <CardDescription>
                  Welcome emails, account verification, and onboarding sequence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">4 nodes</Badge>
                  <Button size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}