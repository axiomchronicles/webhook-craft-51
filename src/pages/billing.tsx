import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const usageData = [
  { month: 'Jan', webhooks: 45000, cost: 125 },
  { month: 'Feb', webhooks: 52000, cost: 142 },
  { month: 'Mar', webhooks: 48000, cost: 135 },
  { month: 'Apr', webhooks: 61000, cost: 168 },
  { month: 'May', webhooks: 67000, cost: 185 },
  { month: 'Jun', webhooks: 71000, cost: 195 }
];

const mockInvoices = [
  {
    id: 'inv_2024_06',
    period: 'June 2024',
    amount: 195.00,
    status: 'paid',
    dueDate: new Date('2024-07-01'),
    paidDate: new Date('2024-06-28'),
    webhookCount: 71000
  },
  {
    id: 'inv_2024_05',
    period: 'May 2024',
    amount: 185.00,
    status: 'paid',
    dueDate: new Date('2024-06-01'),
    paidDate: new Date('2024-05-30'),
    webhookCount: 67000
  },
  {
    id: 'inv_2024_04',
    period: 'April 2024',
    amount: 168.00,
    status: 'paid',
    dueDate: new Date('2024-05-01'),
    paidDate: new Date('2024-04-29'),
    webhookCount: 61000
  }
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 29,
    webhooks: 10000,
    features: ['Basic webhooks', 'Email support', '99.9% uptime SLA']
  },
  {
    name: 'Professional',
    price: 99,
    webhooks: 50000,
    features: ['Advanced features', 'Priority support', 'Custom integrations', '99.95% uptime SLA'],
    current: true
  },
  {
    name: 'Enterprise',
    price: 299,
    webhooks: 200000,
    features: ['White-label solution', 'Dedicated support', 'Custom SLAs', 'Advanced security']
  }
];

export default function Billing() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  
  const currentUsage = {
    webhooksThisMonth: 23500,
    webhooksLimit: 50000,
    costThisMonth: 75.50,
    estimatedCost: 142.00
  };

  const usagePercentage = (currentUsage.webhooksThisMonth / currentUsage.webhooksLimit) * 100;

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
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CreditCard className="w-8 h-8 text-primary" />
            </motion.div>
            Billing & Usage
          </h1>
          <p className="text-muted-foreground">Manage your subscription, usage, and billing information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Invoices
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Billing Settings
          </Button>
        </div>
      </div>

      {/* Current Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{currentUsage.webhooksThisMonth.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Webhooks This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">${currentUsage.costThisMonth}</p>
                <p className="text-xs text-muted-foreground">Current Bill</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">${currentUsage.estimatedCost}</p>
                <p className="text-xs text-muted-foreground">Estimated Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{Math.round(usagePercentage)}%</p>
                <p className="text-xs text-muted-foreground">Plan Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan Usage</CardTitle>
              <CardDescription>
                Professional Plan - {currentUsage.webhooksLimit.toLocaleString()} webhooks/month
              </CardDescription>
            </div>
            <Badge 
              variant={usagePercentage > 90 ? "destructive" : usagePercentage > 75 ? "default" : "secondary"}
            >
              {Math.round(usagePercentage)}% Used
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress 
              value={usagePercentage} 
              className="w-full h-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentUsage.webhooksThisMonth.toLocaleString()} used</span>
              <span>{(currentUsage.webhooksLimit - currentUsage.webhooksThisMonth).toLocaleString()} remaining</span>
            </div>
            {usagePercentage > 80 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-warning" />
                <p className="text-sm">
                  You're approaching your monthly limit. Consider upgrading your plan to avoid overage charges.
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="invoices">Invoices & History</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage & Cost Trends</CardTitle>
              <CardDescription>
                6-month overview of webhook usage and associated costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
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
                    dataKey="webhooks" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Webhooks"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    name="Cost ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>
                Detailed cost breakdown by usage category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Invoice History
              </CardTitle>
              <CardDescription>
                Download and manage your billing invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{invoice.period}</h4>
                          <Badge 
                            variant={invoice.status === 'paid' ? 'default' : 'destructive'}
                            className="bg-success text-success-foreground"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Paid
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{invoice.webhookCount.toLocaleString()} webhooks</span>
                          <span>•</span>
                          <span>Paid {invoice.paidDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">${invoice.amount.toFixed(2)}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Plan</CardTitle>
              <CardDescription>
                Select the plan that best fits your webhook requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingTiers.map((tier) => (
                  <motion.div
                    key={tier.name}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`p-6 border rounded-xl ${
                      tier.current 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center mb-6">
                      {tier.current && (
                        <Badge className="mb-2">Current Plan</Badge>
                      )}
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">${tier.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Up to {tier.webhooks.toLocaleString()} webhooks
                      </p>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={tier.current ? "outline" : "default"}
                      disabled={tier.current}
                    >
                      {tier.current ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}