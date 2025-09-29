import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell,
  Globe,
  Palette,
  Key,
  Database,
  Webhook,
  Mail,
  Smartphone,
  Lock,
  Eye,
  Save,
  RefreshCw,
  Copy,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/theme-provider';

const mockApiKeys = [
  {
    id: 'key_prod_001',
    name: 'Production API Key',
    key: 'wh_prod_••••••••••••••••••••••••••••••••1a2b3c',
    created: new Date(Date.now() - 86400000 * 30),
    lastUsed: new Date(Date.now() - 3600000),
    permissions: ['read', 'write', 'delete']
  },
  {
    id: 'key_dev_002',
    name: 'Development Key',
    key: 'wh_dev_•••••••••••••••••••••••••••••••••4d5e6f',
    created: new Date(Date.now() - 86400000 * 15),
    lastUsed: new Date(Date.now() - 86400000),
    permissions: ['read', 'write']
  }
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  
  const [profile, setProfile] = useState({
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    title: 'Platform Engineer',
    company: 'TechCorp Inc.',
    timezone: 'America/New_York',
    language: 'en-US'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    desktopNotifications: true,
    weeklyReports: true,
    securityAlerts: true,
    maintenanceUpdates: false
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: 480, // minutes
    ipRestriction: false,
    apiRateLimit: 1000
  });

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    children: React.ReactNode; 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
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
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <SettingsIcon className="w-8 h-8 text-primary" />
            </motion.div>
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account, preferences, and system configuration</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <SettingCard
            icon={User}
            title="Profile Information"
            description="Update your personal information and preferences"
          >
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=200" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={profile.title}
                    onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                      <SelectItem value="Europe/Berlin">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </SettingCard>

          <SettingCard
            icon={Palette}
            title="Appearance"
            description="Customize the look and feel of your dashboard"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SettingCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SettingCard
            icon={Shield}
            title="Security Settings"
            description="Manage your account security and access controls"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch 
                  checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Rate Limit (requests/hour)</Label>
                  <Input
                    type="number"
                    value={security.apiRateLimit}
                    onChange={(e) => setSecurity(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">IP Address Restrictions</Label>
                  <p className="text-sm text-muted-foreground">Limit access to specific IP addresses</p>
                </div>
                <Switch 
                  checked={security.ipRestriction}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, ipRestriction: checked }))}
                />
              </div>

              {security.ipRestriction && (
                <div className="space-y-2">
                  <Label>Allowed IP Addresses</Label>
                  <Textarea 
                    placeholder="Enter IP addresses or ranges, one per line..."
                    className="min-h-20"
                  />
                </div>
              )}
            </div>
          </SettingCard>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <SettingCard
            icon={Bell}
            title="Notification Preferences"
            description="Choose how and when you want to be notified"
          >
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="text-base capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'emailAlerts' && 'Receive important alerts via email'}
                      {key === 'smsAlerts' && 'Get critical notifications via SMS'}
                      {key === 'desktopNotifications' && 'Show browser notifications'}
                      {key === 'weeklyReports' && 'Weekly usage and performance reports'}
                      {key === 'securityAlerts' && 'Security-related notifications'}
                      {key === 'maintenanceUpdates' && 'System maintenance notifications'}
                    </p>
                  </div>
                  <Switch 
                    checked={value as boolean}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </SettingCard>

          <SettingCard
            icon={Mail}
            title="Contact Methods"
            description="Update your contact information for notifications"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={profile.email} readOnly />
                <p className="text-xs text-muted-foreground">Primary email from profile</p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+1 (555) 123-4567" />
                <p className="text-xs text-muted-foreground">For SMS alerts</p>
              </div>
            </div>
          </SettingCard>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <SettingCard
            icon={Key}
            title="API Keys"
            description="Manage API keys for programmatic access"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  API keys allow external applications to access your webhook data
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Key
                </Button>
              </div>

              <div className="space-y-3">
                {mockApiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <div className="flex gap-1">
                            {apiKey.permissions.map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="font-mono text-sm bg-muted p-2 rounded flex items-center gap-2">
                          <code>{apiKey.key}</code>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>Created: {apiKey.created.toLocaleDateString()}</div>
                          <div>Last used: {apiKey.lastUsed.toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SettingCard>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <SettingCard
            icon={Webhook}
            title="Webhook Configuration"
            description="Global webhook settings and defaults"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Timeout (seconds)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Max Retry Attempts</Label>
                  <Input type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label>Retry Backoff Strategy</Label>
                  <Select defaultValue="exponential">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="exponential">Exponential</SelectItem>
                      <SelectItem value="fixed">Fixed Delay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rate Limit (per minute)</Label>
                  <Input type="number" defaultValue="100" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Webhook Signing</Label>
                    <p className="text-sm text-muted-foreground">Sign webhook payloads with HMAC-SHA256</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Include Timestamp Headers</Label>
                    <p className="text-sm text-muted-foreground">Add timestamp to webhook headers</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Payload Compression</Label>
                    <p className="text-sm text-muted-foreground">Compress large payloads with gzip</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </SettingCard>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SettingCard
            icon={Database}
            title="System Configuration"
            description="Advanced system settings and maintenance"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable webhook processing</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto-scaling</Label>
                    <p className="text-sm text-muted-foreground">Automatically scale resources based on load</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Health Check Monitoring</Label>
                    <p className="text-sm text-muted-foreground">Enable continuous health monitoring</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>System Status</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-center">
                    <div className="text-success font-medium">Healthy</div>
                    <div className="text-xs text-muted-foreground">All systems operational</div>
                  </div>
                  <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-center">
                    <div className="text-info font-medium">99.95%</div>
                    <div className="text-xs text-muted-foreground">Uptime (30 days)</div>
                  </div>
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-center">
                    <div className="text-warning font-medium">Normal</div>
                    <div className="text-xs text-muted-foreground">Load average</div>
                  </div>
                </div>
              </div>
            </div>
          </SettingCard>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}