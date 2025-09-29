import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Activity, 
  Target,
  Zap,
  Users,
  Globe,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const deliveryVolumeData = [
  { time: '00:00', successful: 2400, failed: 240, retries: 120 },
  { time: '04:00', successful: 1398, failed: 210, retries: 90 },
  { time: '08:00', successful: 9800, failed: 290, retries: 200 },
  { time: '12:00', successful: 3908, failed: 190, retries: 150 },
  { time: '16:00', successful: 4800, failed: 320, retries: 180 },
  { time: '20:00', successful: 3800, failed: 250, retries: 140 },
];

const responseTimeData = [
  { time: '00:00', avg: 145, p95: 280, p99: 450 },
  { time: '04:00', avg: 120, p95: 240, p99: 380 },
  { time: '08:00', avg: 180, p95: 320, p99: 520 },
  { time: '12:00', avg: 165, p95: 290, p99: 480 },
  { time: '16:00', avg: 195, p95: 350, p99: 580 },
  { time: '20:00', avg: 155, p95: 270, p99: 420 },
];

const endpointDistribution = [
  { name: 'Payment Gateway', value: 4500, color: 'hsl(var(--primary))' },
  { name: 'User Service', value: 3200, color: 'hsl(var(--info))' },
  { name: 'Order Processing', value: 2800, color: 'hsl(var(--success))' },
  { name: 'Notifications', value: 2100, color: 'hsl(var(--warning))' },
  { name: 'Analytics', value: 1800, color: 'hsl(var(--destructive))' },
];

const errorBreakdown = [
  { category: 'Timeout', count: 145, percentage: 32 },
  { category: 'Connection Error', count: 98, percentage: 22 },
  { category: 'Rate Limited', count: 87, percentage: 19 },
  { category: 'Server Error', count: 76, percentage: 17 },
  { category: 'Invalid Payload', count: 45, percentage: 10 },
];

export default function Metrics() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('volume');

  const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className={`w-4 h-4 ${trend === 'up' ? 'text-success' : 'text-destructive'}`} />
              <span className={trend === 'up' ? 'text-success' : 'text-destructive'}>
                {change}
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
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
          <h1 className="text-3xl font-bold text-foreground">Metrics & Analytics</h1>
          <p className="text-muted-foreground">Monitor webhook performance and delivery insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Deliveries"
          value="12.4K"
          change="+12.5%"
          icon={Activity}
          trend="up"
        />
        <MetricCard
          title="Success Rate"
          value="98.7%"
          change="+0.3%"
          icon={Target}
          trend="up"
        />
        <MetricCard
          title="Avg Response Time"
          value="165ms"
          change="-8ms"
          icon={Clock}
          trend="up"
        />
        <MetricCard
          title="Active Endpoints"
          value="847"
          change="+23"
          icon={Globe}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Delivery Volume
                </CardTitle>
                <CardDescription>
                  Successful vs failed deliveries over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={deliveryVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="successful" 
                      stackId="1"
                      stroke="hsl(var(--success))" 
                      fill="hsl(var(--success))" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="failed" 
                      stackId="1"
                      stroke="hsl(var(--destructive))" 
                      fill="hsl(var(--destructive))" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Response Time Trends
                </CardTitle>
                <CardDescription>
                  Average, P95, and P99 response times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="p95" stroke="hsl(var(--warning))" strokeWidth={2} />
                    <Line type="monotone" dataKey="p99" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Endpoint Distribution
              </CardTitle>
              <CardDescription>
                Delivery volume breakdown by endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={endpointDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {endpointDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {endpointDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value.toLocaleString()}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed performance analysis over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avg" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Average"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="p95" 
                      stroke="hsl(var(--warning))" 
                      strokeWidth={2}
                      name="95th Percentile"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="p99" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      name="99th Percentile"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Current performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average</span>
                    <span className="font-bold text-primary">165ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">95th Percentile</span>
                    <span className="font-bold text-warning">290ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">99th Percentile</span>
                    <span className="font-bold text-destructive">480ms</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Performance Goals</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Avg < 200ms</span>
                        <span className="text-sm text-success">✓</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-success h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">P95 < 500ms</span>
                        <span className="text-sm text-success">✓</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-success h-2 rounded-full w-3/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Analysis</CardTitle>
              <CardDescription>
                Breakdown of error types and their frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorBreakdown.map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-destructive">
                        {error.category}
                      </Badge>
                      <div className="w-48 bg-muted rounded-full h-2">
                        <div 
                          className="bg-destructive h-2 rounded-full"
                          style={{ width: `${error.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{error.count}</p>
                      <p className="text-xs text-muted-foreground">{error.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Performance</CardTitle>
              <CardDescription>
                Individual endpoint metrics and health status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpointDistribution.map((endpoint, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-success/10 text-success">
                          Healthy
                        </Badge>
                        <h4 className="font-medium">{endpoint.name}</h4>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Deliveries</p>
                        <p className="font-medium">{endpoint.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-medium text-success">{Math.floor(98 + Math.random())}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Response</p>
                      <p className="font-medium">{Math.floor(120 + Math.random() * 100)}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Active</p>
                        <p className="font-medium">2 min ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}