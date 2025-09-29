import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Settings,
  Lock,
  FileCheck,
  UserCheck,
  Database,
  Globe,
  Clock,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const complianceFrameworks = [
  {
    id: 'gdpr',
    name: 'GDPR',
    description: 'General Data Protection Regulation',
    status: 'compliant',
    score: 98,
    lastAudit: new Date(Date.now() - 86400000 * 15),
    requirements: [
      { name: 'Data Encryption', status: 'compliant', description: 'All PII encrypted at rest and in transit' },
      { name: 'Right to Deletion', status: 'compliant', description: 'Automated data deletion processes' },
      { name: 'Data Processing Records', status: 'compliant', description: 'Complete audit trail of data processing' },
      { name: 'Consent Management', status: 'warning', description: 'Some consent flows need updates' }
    ]
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    description: 'Service Organization Control 2',
    status: 'compliant',
    score: 95,
    lastAudit: new Date(Date.now() - 86400000 * 90),
    requirements: [
      { name: 'Security Controls', status: 'compliant', description: 'Multi-layered security implementation' },
      { name: 'Availability', status: 'compliant', description: '99.95% uptime SLA maintained' },
      { name: 'Processing Integrity', status: 'compliant', description: 'Data validation and error handling' },
      { name: 'Confidentiality', status: 'compliant', description: 'Access controls and encryption' },
      { name: 'Privacy', status: 'warning', description: 'Privacy controls partially implemented' }
    ]
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Information Security Management',
    status: 'in_progress',
    score: 78,
    lastAudit: new Date(Date.now() - 86400000 * 180),
    requirements: [
      { name: 'Risk Assessment', status: 'compliant', description: 'Annual risk assessments completed' },
      { name: 'Security Policies', status: 'compliant', description: 'Comprehensive policy framework' },
      { name: 'Incident Response', status: 'warning', description: 'Response times need improvement' },
      { name: 'Business Continuity', status: 'non_compliant', description: 'DR plan requires updates' }
    ]
  }
];

const dataRetentionPolicies = [
  {
    type: 'Webhook Payloads',
    retention: '90 days',
    location: 'US-East',
    encryption: true,
    piiRedaction: true,
    status: 'active'
  },
  {
    type: 'Audit Logs',
    retention: '7 years',
    location: 'Multi-region',
    encryption: true,
    piiRedaction: false,
    status: 'active'
  },
  {
    type: 'User Sessions',
    retention: '30 days',
    location: 'US-East',
    encryption: true,
    piiRedaction: true,
    status: 'active'
  }
];

export default function Compliance() {
  const [selectedFramework, setSelectedFramework] = useState('gdpr');
  const [dataExportInProgress, setDataExportInProgress] = useState(false);
  
  const statusColors = {
    compliant: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    non_compliant: 'text-destructive bg-destructive/10 border-destructive/20',
    in_progress: 'text-info bg-info/10 border-info/20'
  };

  const statusIcons = {
    compliant: CheckCircle,
    warning: AlertTriangle,
    non_compliant: XCircle,
    in_progress: Clock
  };

  const currentFramework = complianceFrameworks.find(f => f.id === selectedFramework);

  const ComplianceCard = ({ framework }: { framework: any }) => {
    const StatusIcon = statusIcons[framework.status as keyof typeof statusIcons];
    
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`cursor-pointer transition-all border ${statusColors[framework.status as keyof typeof statusColors]}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: framework.status === 'compliant' ? [0, 5, -5, 0] : 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 bg-background rounded-lg"
                >
                  <StatusIcon className="w-6 h-6" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg">{framework.name}</CardTitle>
                  <CardDescription>{framework.description}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{framework.score}%</div>
                <div className="text-xs text-muted-foreground">Compliance</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Progress value={framework.score} className="h-2" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Last audit: {framework.lastAudit.toLocaleDateString()}</span>
              <Badge variant={framework.status === 'compliant' ? 'default' : 'secondary'}>
                {framework.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedFramework(framework.id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

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
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            Compliance Center
          </h1>
          <p className="text-muted-foreground">GDPR, SOC 2, and security compliance management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Compliance Settings
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">97%</p>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Active Frameworks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Action Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-muted-foreground">Days to Audit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="frameworks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="frameworks">Compliance Frameworks</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
          <TabsTrigger value="requests">Data Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceFrameworks.map((framework) => (
              <ComplianceCard key={framework.id} framework={framework} />
            ))}
          </div>

          {/* Framework Details */}
          {currentFramework && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {currentFramework.name} Requirements
                </CardTitle>
                <CardDescription>
                  Detailed compliance status for {currentFramework.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentFramework.requirements.map((req, index) => {
                    const StatusIcon = statusIcons[req.status as keyof typeof statusIcons];
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 border rounded-lg ${statusColors[req.status as keyof typeof statusColors]}`}
                      >
                        <div className="flex items-start gap-3">
                          <StatusIcon className="w-5 h-5 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium">{req.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                          </div>
                          <Badge variant="outline" className="bg-background">
                            {req.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy Controls
              </CardTitle>
              <CardDescription>
                Configure data privacy and protection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">PII Auto-Detection</Label>
                    <p className="text-sm text-muted-foreground">Automatically detect and redact personal information</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Data Anonymization</Label>
                    <p className="text-sm text-muted-foreground">Anonymize sensitive data in logs and reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Consent Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track and manage user consent preferences</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Cross-Border Transfers</Label>
                    <p className="text-sm text-muted-foreground">Enable data transfers to approved regions only</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Retention Policies
              </CardTitle>
              <CardDescription>
                Manage how long different types of data are stored
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRetentionPolicies.map((policy, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{policy.type}</h4>
                          <Badge variant="outline">{policy.retention}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {policy.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {policy.encryption ? 'Encrypted' : 'Not encrypted'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {policy.piiRedaction ? 'PII Redacted' : 'PII Visible'}
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-success" />
                            {policy.status}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Data Subject Requests
              </CardTitle>
              <CardDescription>
                Handle GDPR data access, portability, and deletion requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-info/10 border border-info/20 rounded-lg text-center">
                  <h3 className="font-medium">Data Access Requests</h3>
                  <p className="text-2xl font-bold mt-2">12</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg text-center">
                  <h3 className="font-medium">Data Portability</h3>
                  <p className="text-2xl font-bold mt-2">3</p>
                  <p className="text-sm text-muted-foreground">In progress</p>
                </div>
                
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                  <h3 className="font-medium">Data Deletion</h3>
                  <p className="text-2xl font-bold mt-2">7</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Request Data Export</Label>
                <Textarea
                  placeholder="Enter user email or ID to generate data export..."
                  className="min-h-20"
                />
                <Button 
                  className="w-full"
                  disabled={dataExportInProgress}
                  onClick={() => {
                    setDataExportInProgress(true);
                    setTimeout(() => setDataExportInProgress(false), 3000);
                  }}
                >
                  {dataExportInProgress ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating Export...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Data Export
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}