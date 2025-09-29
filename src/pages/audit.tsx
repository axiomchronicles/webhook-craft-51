import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Shield,
  Clock,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockAuditLogs = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 300000),
    action: 'Webhook Endpoint Created',
    user: { name: 'Sarah Chen', email: 'sarah@company.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100' },
    resource: '/api/webhooks/payment-gateway',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success',
    details: { endpoint_url: 'https://api.example.com/webhooks/payments', method: 'POST' }
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 600000),
    action: 'API Key Generated',
    user: { name: 'Marcus Johnson', email: 'marcus@company.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    resource: 'api_key_prod_*****',
    ip: '10.0.0.50',
    userAgent: 'curl/7.68.0',
    status: 'success',
    details: { key_type: 'production', permissions: ['read', 'write'] }
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 900000),
    action: 'Failed Login Attempt',
    user: { name: 'Unknown User', email: 'attacker@malicious.com', avatar: null },
    resource: '/auth/login',
    ip: '203.0.113.1',
    userAgent: 'Python-requests/2.28.1',
    status: 'failed',
    details: { reason: 'Invalid credentials', attempts: 5 }
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 1800000),
    action: 'Team Member Invited',
    user: { name: 'Elena Rodriguez', email: 'elena@company.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    resource: 'team_invite',
    ip: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success',
    details: { invited_email: 'newdev@company.com', role: 'developer' }
  }
];

const mockComplianceReports = [
  {
    id: 1,
    name: 'SOC 2 Type II Audit',
    type: 'SOC2',
    status: 'completed',
    generatedDate: new Date(Date.now() - 86400000 * 7),
    validUntil: new Date(Date.now() + 86400000 * 358),
    findings: { critical: 0, high: 1, medium: 3, low: 5 }
  },
  {
    id: 2,
    name: 'GDPR Compliance Check',
    type: 'GDPR',
    status: 'in_progress',
    generatedDate: new Date(Date.now() - 86400000 * 2),
    validUntil: null,
    findings: { critical: 0, high: 0, medium: 2, low: 1 }
  },
  {
    id: 3,
    name: 'Security Assessment',
    type: 'Security',
    status: 'completed',
    generatedDate: new Date(Date.now() - 86400000 * 30),
    validUntil: new Date(Date.now() + 86400000 * 335),
    findings: { critical: 0, high: 0, medium: 1, low: 8 }
  }
];

export default function Audit() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  const statusColors = {
    success: 'text-success',
    failed: 'text-destructive',
    warning: 'text-warning'
  };

  const statusIcons = {
    success: CheckCircle,
    failed: XCircle,
    warning: AlertCircle
  };

  const complianceStatusColors = {
    completed: 'bg-success',
    in_progress: 'bg-warning',
    failed: 'bg-destructive'
  };

  const AuditLogRow = ({ log }: { log: any }) => {
    const StatusIcon = statusIcons[log.status as keyof typeof statusIcons];
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="w-8 h-8">
              <AvatarImage src={log.user.avatar} alt={log.user.name} />
              <AvatarFallback>
                {log.user.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{log.action}</h4>
                <StatusIcon className={`w-4 h-4 ${statusColors[log.status as keyof typeof statusColors]}`} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {log.user.name} ({log.user.email})
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.timestamp.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {log.ip}
                </div>
              </div>
              
              <div className="mt-2 text-sm">
                <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                  {log.resource}
                </span>
              </div>
              
              {log.details && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    View Details
                  </summary>
                  <pre className="mt-1 text-xs bg-muted/50 p-2 rounded border overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  };

  const ComplianceReportCard = ({ report }: { report: any }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{report.name}</CardTitle>
            <CardDescription>Type: {report.type}</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`text-white ${complianceStatusColors[report.status as keyof typeof complianceStatusColors]}`}
          >
            {report.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Generated</p>
            <p className="font-medium">{report.generatedDate.toLocaleDateString()}</p>
          </div>
          {report.validUntil && (
            <div>
              <p className="text-muted-foreground">Valid Until</p>
              <p className="font-medium">{report.validUntil.toLocaleDateString()}</p>
            </div>
          )}
        </div>
        
        {report.findings && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Findings Summary</p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="text-destructive font-bold">{report.findings.critical}</div>
                <div className="text-muted-foreground">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-orange-500 font-bold">{report.findings.high}</div>
                <div className="text-muted-foreground">High</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-500 font-bold">{report.findings.medium}</div>
                <div className="text-muted-foreground">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-blue-500 font-bold">{report.findings.low}</div>
                <div className="text-muted-foreground">Low</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View Report
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FileText className="w-8 h-8 text-primary" />
            </motion.div>
            Audit & Compliance
          </h1>
          <p className="text-muted-foreground">Security logs, compliance reports, and audit trails</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockAuditLogs.length}K</p>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-xs text-muted-foreground">Compliance Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Security Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-muted-foreground">Days Retention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search audit logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp">Time</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <div className="space-y-4">
            {mockAuditLogs.map((log) => (
              <AuditLogRow key={log.id} log={log} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockComplianceReports.map((report) => (
              <ComplianceReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Dashboard</CardTitle>
              <CardDescription>
                Real-time security monitoring and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-success" />
                    <span className="font-medium">No Active Threats</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    System is secure with no detected threats
                  </p>
                </div>
                
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <span className="font-medium">Rate Limiting Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unusual traffic patterns detected
                  </p>
                </div>
                
                <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-info" />
                    <span className="font-medium">Monitoring Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All security sensors operational
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}