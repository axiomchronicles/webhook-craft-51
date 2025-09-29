import { motion } from 'framer-motion';
import { 
  Activity, 
  Webhook, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { KPICard } from '@/components/ui/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui';
import { mockKPIs, mockMetrics, mockDeliveries, statusColors } from '@/lib/mock-data';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function Dashboard() {
  const { openRightDrawer } = useUIStore();

  const recentDeliveries = mockDeliveries.slice(0, 5);
  
  const statusDistribution = [
    { name: 'Success', value: 92, color: 'hsl(var(--success))' },
    { name: 'Failed', value: 5, color: 'hsl(var(--destructive))' },
    { name: 'Pending', value: 2, color: 'hsl(var(--warning))' },
    { name: 'Retrying', value: 1, color: 'hsl(var(--primary))' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your webhook infrastructure and delivery performance
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          Create Endpoint
        </Button>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Endpoints"
          value={mockKPIs.totalEndpoints}
          trend={{ value: 12, direction: 'up' }}
          icon={Webhook}
        />
        <KPICard
          title="Deliveries Today"
          value={mockKPIs.deliveriesToday.toLocaleString()}
          trend={{ value: 8.3, direction: 'up' }}
          icon={Activity}
        />
        <KPICard
          title="Success Rate"
          value={`${mockKPIs.successRate}%`}
          trend={{ value: 0.2, direction: 'up' }}
          icon={CheckCircle}
        />
        <KPICard
          title="Avg Response Time"
          value={`${mockKPIs.avgResponseTime}ms`}
          trend={{ value: 5.1, direction: 'down' }}
          icon={Clock}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Volume Chart */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Delivery Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockMetrics.deliveryVolume}>
                <defs>
                  <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="label" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#deliveryGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Rate Chart */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Success Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMetrics.successRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="label" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[95, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Delivery Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {statusDistribution.map((status, index) => (
                <div key={status.name} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {status.name}: {status.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Deliveries */}
        <Card className="lg:col-span-2 hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              Recent Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDeliveries.map((delivery) => (
                <motion.div
                  key={delivery.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => openRightDrawer('inspector')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      delivery.status === 'success' ? 'bg-success' :
                      delivery.status === 'failed' ? 'bg-destructive' :
                      delivery.status === 'retrying' ? 'bg-warning' :
                      'bg-muted-foreground'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{delivery.endpointName}</p>
                      <p className="text-xs text-muted-foreground">{delivery.event}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary"
                      className={`status-indicator ${statusColors[delivery.status]}`}
                    >
                      {delivery.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {delivery.responseTime}ms
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                <XCircle className="w-4 h-4 text-destructive" />
                <div className="flex-1">
                  <p className="font-medium text-sm">High Error Rate</p>
                  <p className="text-xs text-muted-foreground">
                    User Management endpoint failing {'>'} 20% of requests
                  </p>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Slow Response Time</p>
                  <p className="text-xs text-muted-foreground">
                    Payment endpoint averaging {'>'} 5s response time
                  </p>
                </div>
                <Badge variant="secondary" className="status-indicator warning">
                  Warning
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {mockKPIs.activeEndpoints}
                </div>
                <div className="text-xs text-muted-foreground">Active Endpoints</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {mockKPIs.failedDeliveries}
                </div>
                <div className="text-xs text-muted-foreground">Failed Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {mockKPIs.pendingRetries}
                </div>
                <div className="text-xs text-muted-foreground">Pending Retries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {mockKPIs.alertsActive}
                </div>
                <div className="text-xs text-muted-foreground">Active Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}