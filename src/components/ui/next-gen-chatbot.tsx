import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  RotateCcw,
  Sparkles,
  Zap,
  Copy,
  ExternalLink,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  Filter,
  Command,
  Sidebar,
  Moon,
  Sun,
  Heart,
  ThumbsUp,
  Settings,
  Terminal,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  FileText,
  Expand,
  Download,
  Play,
  Pause,
  MoreHorizontal,
  Shield,
  Database,
  Globe,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  Info,
  Star,
  Bookmark,
  Share2,
  Eye,
  EyeOff,
  RefreshCw,
  Layers,
  GitBranch,
  Cloud,
  Server,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Key,
  Webhook,
  Package,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CommandPalette } from './command-palette';
import { ReferencePanel } from './reference-panel';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import { PROJECT_DATA, type ProjectData } from '@/lib/project-data';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: QuickAction[];
  references?: Reference[];
  reactions?: Reaction[];
  cardData?: CardData;
  metadata?: MessageMetadata;
  replyTo?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline';
}

interface Reference {
  id: string;
  title: string;
  url: string;
  type: 'page' | 'doc' | 'metric';
}

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface CardData {
  type: 'status' | 'metric' | 'table' | 'system_overview';
  title: string;
  data: any;
}

interface MessageMetadata {
  processingTime?: number;
  confidence?: number;
  source?: string;
  projectContext?: boolean;
}

interface ChatHistory {
  messages: Message[];
  timestamp: Date;
  title: string;
}

const DEVELOPER_RESPONSES = [
  {
    content: `Your **webhook infrastructure** is performing well! 

📊 **Current Status:**
- Success Rate: **99.2%** ↗️
- Active Endpoints: **47**  
- Avg Response Time: **142ms**

Need help with anything specific? Try:`,
    suggestions: ["Show failed deliveries", "Performance metrics", "Check endpoint health"],
    actions: [
      { id: 'metrics', label: 'View Metrics', icon: <BarChart3 className="w-3 h-3" /> },
      { id: 'console', label: 'Open Console', icon: <Terminal className="w-3 h-3" /> }
    ],
    references: [
      { id: '1', title: 'Metrics Dashboard', url: '/metrics', type: 'page' as const },
      { id: '2', title: 'System Console', url: '/console', type: 'page' as const }
    ]
  },
  {
    content: `I can help you troubleshoot delivery failures. Let me check your recent logs...

\`\`\`json
{
  "recent_failures": 12,
  "common_errors": [
    "timeout (8 occurrences)",
    "invalid_ssl (3 occurrences)", 
    "dns_resolution (1 occurrence)"
  ],
  "suggested_action": "Check endpoint SSL certificates"
}
\`\`\`

**Recommendation:** Navigate to [Settings > Endpoints](/endpoints) to update SSL configurations.`,
    actions: [
      { id: 'fix-ssl', label: 'Fix SSL Issues', variant: 'default' as const },
      { id: 'retry', label: 'Retry Failed', variant: 'outline' as const }
    ]
  },
  {
    content: `Based on your query, I've analyzed your **pipeline performance**:

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Throughput | 1,247/hr | 1,000/hr | ✅ Exceeds |  
| Error Rate | 0.8% | <2% | ✅ Good |
| Avg Latency | 142ms | <200ms | ✅ Good |

Everything looks healthy! Want me to set up **proactive monitoring**?`,
    cardData: {
      type: 'status' as const,
      title: 'System Health',
      data: { status: 'healthy', uptime: '99.9%' }
    }
  }
];

const QUICK_SUGGESTIONS = [
  "Show system status",
  "Recent alerts", 
  "Performance overview",
  "Failed deliveries",
  "Team permissions",
  "Endpoint configuration",
  "Deploy changes",
  "View logs",
  "Restart service",
  "Check database health",
  "API health check",
  "Memory usage",
  "Network diagnostics",
  "Security audit",
  "Backup status"
];

// Enhanced AI Intelligence System - Google Wiz Style Responses
const getIntelligentResponse = (input: string, projectData: ProjectData): any => {
  const lowerInput = input.toLowerCase();
  
  // System health & status queries
  if (lowerInput.includes('status') || lowerInput.includes('health') || lowerInput.includes('overview')) {
    const services = projectData.infrastructure.services;
    const healthyServices = Object.values(services).filter(s => s.status === 'healthy').length;
    const totalServices = Object.values(services).length;
    
    return {
      content: `**🟢 System Health: OPTIMAL**

\`\`\`json
{
  "overall_status": "healthy",
  "services": "${healthyServices}/${totalServices} operational",
  "uptime": "${projectData.infrastructure.services.webhookService.uptime}%",
  "response_time": "${projectData.webhooks.statistics.averageResponseTime}ms",
  "success_rate": "${projectData.webhooks.statistics.successRate}%",
  "active_alerts": ${projectData.webhooks.alerts.length},
  "deployment": "${projectData.infrastructure.deployment.current.version}",
  "environment": "${projectData.meta.environment}"
}
\`\`\`

**📊 Key Metrics:**
• **Throughput:** ${projectData.webhooks.statistics.totalRequests.toLocaleString()} total requests
• **Peak Performance:** ${projectData.webhooks.statistics.peakThroughput}/hr at optimal load
• **Error Rate:** ${projectData.webhooks.statistics.errorRate}% (well below 2% target)
• **Team Activity:** ${projectData.team.members.filter(m => m.status === 'active').length} active members

**🎯 System Insights:**
${healthyServices === totalServices ? '✅ All core services operational' : '⚠️ Some services need attention'}
${projectData.webhooks.alerts.length > 0 ? `⚡ ${projectData.webhooks.alerts.length} active alerts require review` : '✅ No active alerts'}
${projectData.infrastructure.scaling.autoScaling ? '🔄 Auto-scaling enabled and optimized' : '📌 Manual scaling configuration'}

**Next Actions:**`,
      suggestions: [
        "View detailed metrics",
        "Check service dependencies", 
        "Analyze performance trends",
        "Review security status"
      ],
      actions: [
        { id: 'metrics', label: 'Full Dashboard', icon: <BarChart3 className="w-3 h-3" /> },
        { id: 'alerts', label: 'Alert Center', icon: <AlertCircle className="w-3 h-3" /> },
        { id: 'optimize', label: 'Optimize Performance', icon: <TrendingUp className="w-3 h-3" /> }
      ],
      cardData: {
        type: 'system_overview',
        title: 'Live System Overview',
        data: {
          services: healthyServices,
          total: totalServices,
          uptime: projectData.infrastructure.services.webhookService.uptime,
          responseTime: projectData.webhooks.statistics.averageResponseTime,
          successRate: projectData.webhooks.statistics.successRate
        }
      }
    };
  }

  // Performance & metrics analysis
  if (lowerInput.includes('performance') || lowerInput.includes('metrics') || lowerInput.includes('analytics')) {
    return {
      content: `**📈 Performance Analytics - Deep Dive**

| **Category** | **Current** | **Target** | **Trend** | **Status** |
|--------------|-------------|------------|-----------|------------|
| **Throughput** | ${projectData.webhooks.statistics.totalRequests.toLocaleString()}/total | 2M/month | 📈 +24% | 🟢 Excellent |
| **Response Time** | ${projectData.webhooks.statistics.averageResponseTime}ms avg | <200ms | 📉 -15ms | 🟢 Optimal |
| **Success Rate** | ${projectData.webhooks.statistics.successRate}% | >98% | 📈 +0.5% | 🟢 Target Met |
| **Error Rate** | ${projectData.webhooks.statistics.errorRate}% | <2% | 📉 -0.3% | 🟢 Improved |

**🔍 Performance Insights:**
• **Peak Traffic:** ${projectData.webhooks.statistics.peakThroughput} req/hr during business hours
• **Fastest Endpoint:** \`${projectData.webhooks.endpoints[0].url}\` (${projectData.webhooks.endpoints[0].averageResponseTime}ms avg)
• **Resource Usage:** CPU ${projectData.infrastructure.scaling.cpu.current}%, Memory ${projectData.infrastructure.scaling.memory.current}%
• **Scaling Status:** ${projectData.infrastructure.scaling.instances} instances, auto-scaling ${projectData.infrastructure.scaling.autoScaling ? 'enabled' : 'disabled'}

**🎯 Optimization Opportunities:**
1. **Cache Hit Rate:** Implement Redis caching for frequent queries
2. **Database Performance:** Consider read replicas for heavy read operations  
3. **CDN Usage:** Optimize static asset delivery through CloudFlare
4. **Connection Pooling:** Fine-tune database connection limits

**📊 Advanced Metrics:**
\`\`\`json
{
  "infrastructure": {
    "cpu_utilization": "${projectData.infrastructure.scaling.cpu.current}%",
    "memory_usage": "${projectData.infrastructure.scaling.memory.current}%", 
    "disk_io": "normal",
    "network_bandwidth": "optimal"
  },
  "business_impact": {
    "revenue_requests": "89%",
    "critical_path_latency": "${projectData.webhooks.statistics.averageResponseTime}ms",
    "user_satisfaction": "98.2%"
  }
}
\`\`\``,
      suggestions: [
        "Optimize database queries",
        "Scale infrastructure",
        "Configure caching strategy",
        "Set performance alerts"
      ],
      actions: [
        { id: 'auto-optimize', label: 'Auto-Optimize', variant: 'default' as const },
        { id: 'scale-up', label: 'Scale Resources', variant: 'outline' as const }
      ]
    };
  }

  // Security & compliance queries
  if (lowerInput.includes('security') || lowerInput.includes('audit') || lowerInput.includes('compliance')) {
    const expiringSoon = projectData.security.certificates.filter(cert => cert.status === 'expiring');
    
    return {
      content: `**🔒 Security & Compliance Overview**

**🛡️ Security Posture: ${expiringSoon.length > 0 ? 'ATTENTION NEEDED' : 'STRONG'}**

\`\`\`yaml
SECURITY_STATUS:
  overall: ${expiringSoon.length > 0 ? 'warning' : 'healthy'}
  certificates: ${projectData.security.certificates.filter(c => c.status === 'valid').length}/${projectData.security.certificates.length} valid
  api_keys: ${projectData.security.apiKeys.length} active
  firewall_rules: ${projectData.security.firewall.rules.length} configured
  blocked_ips: ${projectData.security.firewall.blockedIPs.length}
  audit_events: ${projectData.security.audit.length} recent
\`\`\`

**🔐 Certificate Management:**
${projectData.security.certificates.map(cert => 
  `• **${cert.domain}**: ${cert.status === 'expiring' ? '⚠️' : '✅'} ${
    cert.status === 'expiring' ? 'Expires in 7 days - ACTION REQUIRED' : 'Valid'
  }`
).join('\n')}

**🔑 API Security:**
• **Active Keys:** ${projectData.security.apiKeys.length} with scope-limited permissions
• **Access Control:** Role-based permissions enforced
• **Rate Limiting:** ${projectData.configuration.features.rateLimiting ? 'Enabled' : 'Disabled'}
• **Request Validation:** Input sanitization active

**🚨 Security Recommendations:**
${expiringSoon.length > 0 ? '1. **URGENT:** Renew SSL certificates expiring soon\n' : ''}2. **Enable 2FA:** Multi-factor authentication for all admin accounts
3. **Audit Logs:** Regular security audit log reviews
4. **Penetration Testing:** Schedule quarterly security assessments
5. **Backup Encryption:** Ensure all backups are encrypted at rest

**📋 Compliance Status:**
• **GDPR:** Data processing compliant
• **SOC 2:** Type II controls implemented  
• **PCI DSS:** Payment processing secured
• **HIPAA:** Healthcare data protection ready`,
      suggestions: [
        "Renew SSL certificates",
        "Review API permissions", 
        "Run security scan",
        "Update firewall rules"
      ],
      actions: [
        { id: 'renew-ssl', label: 'Renew Certificates', variant: 'default' as const },
        { id: 'security-scan', label: 'Security Scan', variant: 'outline' as const }
      ]
    };
  }

  // Team & collaboration queries
  if (lowerInput.includes('team') || lowerInput.includes('users') || lowerInput.includes('members')) {
    return {
      content: `**👥 Team & Access Management**

**📊 Team Overview:**
• **Active Members:** ${projectData.team.members.filter(m => m.status === 'active').length}/${projectData.team.members.length}
• **Roles Configured:** ${projectData.team.roles.length} with granular permissions
• **Recent Activity:** ${projectData.team.activity.length} actions in last 24h

**👤 Team Members:**
${projectData.team.members.map(member => 
  `• **${member.name}** (${member.email})\n  └ Role: ${member.role} | Status: ${member.status === 'active' ? '🟢' : '🔴'} | Last Active: ${new Date(member.lastActive).toLocaleDateString()}`
).join('\n\n')}

**🔐 Permission Matrix:**
\`\`\`json
{
  "admin_permissions": ["deploy", "configure", "monitor", "manage_users"],
  "developer_permissions": ["develop", "monitor", "debug"],
  "viewer_permissions": ["monitor", "view_logs"]
}
\`\`\`

**📈 Activity Summary:**
• **Deployments:** ${projectData.team.activity.filter(a => a.action.includes('deployment')).length} this month
• **Configuration Changes:** ${projectData.team.activity.filter(a => a.action.includes('config')).length} recent
• **Monitoring Access:** ${projectData.team.activity.filter(a => a.action.includes('monitor')).length} views

**🎯 Team Insights:**
• All team members have appropriate access levels
• No dormant accounts detected
• Permission reviews up to date
• Collaborative workflows optimized`,
      suggestions: [
        "Add team member",
        "Review permissions",
        "View activity logs", 
        "Configure notifications"
      ],
      actions: [
        { id: 'invite-member', label: 'Invite Member', variant: 'default' as const },
        { id: 'audit-access', label: 'Audit Access', variant: 'outline' as const }
      ]
    };
  }

  // Deployment & infrastructure queries  
  if (lowerInput.includes('deploy') || lowerInput.includes('release') || lowerInput.includes('infrastructure')) {
    return {
      content: `**🚀 Deployment & Infrastructure Status**

**📦 Current Deployment:**
\`\`\`bash
✅ ${projectData.infrastructure.deployment.current.version}
   Environment: ${projectData.meta.environment}
   Deployed: ${new Date(projectData.infrastructure.deployment.current.deployedAt).toLocaleString()}
   By: ${projectData.infrastructure.deployment.current.deployedBy}
   Rollout: ${projectData.infrastructure.deployment.current.rolloutPercentage}% complete
   Status: ${projectData.infrastructure.deployment.current.status}
\`\`\`

**🏗️ Infrastructure Health:**
| **Service** | **Status** | **Uptime** | **Response** | **Instances** |
|-------------|------------|------------|--------------|---------------|
${Object.entries(projectData.infrastructure.services).map(([key, service]) => 
  `| ${service.name} | ${service.status === 'healthy' ? '🟢' : '🔴'} ${service.status} | ${service.uptime}% | ${service.responseTime}ms | ${service.instances} |`
).join('\n')}

**⚙️ Auto-Scaling Configuration:**
• **Current Instances:** ${projectData.infrastructure.scaling.instances}
• **Target Instances:** ${projectData.infrastructure.scaling.targetInstances}  
• **CPU Threshold:** ${projectData.infrastructure.scaling.cpu.target}% (current: ${projectData.infrastructure.scaling.cpu.current}%)
• **Memory Threshold:** ${projectData.infrastructure.scaling.memory.target}% (current: ${projectData.infrastructure.scaling.memory.current}%)
• **Auto-Scaling:** ${projectData.infrastructure.scaling.autoScaling ? '✅ Enabled' : '❌ Disabled'}

**📈 Deployment Pipeline:**
\`\`\`mermaid
graph LR
    A[Build] --> B[Test] --> C[Deploy] --> D[Verify]
    C -->|Auto| E[Production]
\`\`\`

**🎯 Infrastructure Insights:**
• All services running optimally
• Resource utilization within target ranges
• Auto-scaling triggers configured appropriately
• Pipeline automation fully functional

**🔄 Available Actions:**
• Deploy latest staging changes
• Rollback to previous version  
• Scale infrastructure manually
• Configure deployment windows`,
      suggestions: [
        "Deploy to production",
        "View pipeline status", 
        "Scale resources",
        "Configure auto-deploy"
      ],
      actions: [
        { id: 'deploy-now', label: 'Deploy Latest', variant: 'default' as const },
        { id: 'view-pipeline', label: 'View Pipeline', variant: 'outline' as const }
      ]
    };
  }

  // Default fallback with project context
  return {
    content: `I have complete access to your **${projectData.meta.name}** project running **${projectData.meta.version}** in **${projectData.meta.environment}**.

**🎯 What I can help you with:**

**📊 Monitoring & Analytics**
• Real-time system health & performance metrics
• Alert management and incident response
• Usage analytics and optimization insights

**🔧 Infrastructure Management**  
• Deployment automation and rollback capabilities
• Auto-scaling configuration and resource optimization
• Service health monitoring and troubleshooting

**👥 Team & Security**
• User access management and permissions
• Security audit and compliance monitoring
• API key management and certificate renewal

**⚡ Quick Commands:**
• \`/status\` - Complete system overview
• \`/deploy\` - Deployment management
• \`/security\` - Security posture review
• \`/team\` - Team access and activity

Ask me anything about your project - I have full visibility into all systems, metrics, configurations, and can take actions on your behalf!`,
    suggestions: [
      "Show system status",
      "Performance analysis",
      "Security review", 
      "Team management",
      "Deploy latest changes",
      "View recent alerts"
    ]
  };
};

export function NextGenChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 **Welcome to your AI Control Center!**\n\nI'm your intelligent webhook assistant with complete system access. I can help you monitor, troubleshoot, and manage your entire infrastructure.\n\n**What I can do:**\n- 🔍 Analyze system performance & health checks\n- 🚀 Execute commands and deployments seamlessly\n- 📊 Provide real-time insights & analytics\n- ⚡ Navigate you to relevant pages instantly\n- 🛠️ Troubleshoot issues proactively\n- 📋 Generate detailed reports & summaries\n- 🔧 Manage configurations & settings\n\n**Quick Commands:**\n- `/status` - System health overview\n- `/deploy` - Initiate deployment\n- `/logs` - View system logs\n- `/metrics` - Performance analytics\n\nTry asking me anything or select a suggestion below!",
      timestamp: new Date(),
      suggestions: QUICK_SUGGESTIONS.slice(0, 6)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowCommandPalette(true);
            break;
          case 'j':
            e.preventDefault();
            setIsOpen(!isOpen);
            break;
          case 'f':
            e.preventDefault();
            if (isOpen) setShowSearch(!showSearch);
            break;
        }
      }
      
      if (e.key === 'Escape' && isOpen) {
        if (showCommandPalette) setShowCommandPalette(false);
        else if (showReferencePanel) setShowReferencePanel(false);
        else if (showSearch) setShowSearch(false);
        else setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showCommandPalette, showReferencePanel, showSearch]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Hide welcome suggestions after first message
    setShowWelcome(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user', 
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Handle commands
    if (content.startsWith('/')) {
      handleCommand(content);
      return;
    }

    // Simulate AI response with enhanced logic
    setTimeout(() => {
      const response = getIntelligentResponse(content.trim(), PROJECT_DATA);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actions: response.actions?.map(action => ({
          ...action,
          action: () => handleQuickAction(action.id)
        })),
        references: response.references,
        cardData: response.cardData,
        metadata: {
          processingTime: 145 + Math.random() * 100,
          confidence: 0.85 + Math.random() * 0.1,
          source: 'AI Assistant',
          projectContext: true
        }
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      if (response.references) {
        setShowReferencePanel(true);
      }
    }, 800 + Math.random() * 1200);
  };

  const handleCommand = (command: string) => {
    setIsTyping(false);
    
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: `Executing command: \`${command}\``,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
      
      switch (command.toLowerCase()) {
        case '/status':
          executeStatusCommand();
          break;
        case '/deploy':
          executeDeployCommand();
          break;
        case '/logs':
          window.open('/console', '_blank');
          break;
        case '/metrics':
          window.open('/metrics', '_blank');
          break;
        default:
          toast({
            title: "Unknown Command",
            description: `Command ${command} not recognized. Try /status, /deploy, /logs, or /metrics`,
          });
      }
    }, 500);
  };

  const executeStatusCommand = () => {
    const statusResponse: Message = {
      id: (Date.now() + 2).toString(),
      type: 'bot',
      content: `**System Status Report** 📊

\`\`\`json
{
  "status": "healthy",
  "uptime": "99.94%",
  "active_endpoints": 47,
  "success_rate": "99.2%",
  "avg_response_time": "142ms",
  "last_deployment": "2 hours ago"
}
\`\`\`

All systems operational! 🟢`,
      timestamp: new Date(),
      cardData: {
        type: 'status',
        title: 'Live System Status',
        data: { status: 'healthy', endpoints: 47, uptime: '99.94%' }
      }
    };
    
    setMessages(prev => [...prev, statusResponse]);
  };

  const executeDeployCommand = () => {
    const deployResponse: Message = {
      id: (Date.now() + 3).toString(),
      type: 'bot',
      content: `**Deployment Initiated** 🚀

\`\`\`bash
> git pull origin main
> npm run build
> docker build -t webhook-service:latest .
> kubectl apply -f deployment.yaml
\`\`\`

**Status:** Deploying to production...
**ETA:** ~3 minutes

I'll notify you when deployment completes.`,
      timestamp: new Date(),
      actions: [
        { 
          id: 'watch-deploy',
          label: 'Watch Progress',
          icon: <Play className="w-3 h-3" />,
          action: () => window.open('/deployments', '_blank')
        }
      ]
    };
    
    setMessages(prev => [...prev, deployResponse]);
    
    // Simulate deployment completion
    setTimeout(() => {
      toast({
        title: "Deployment Complete! 🎉",
        description: "Your changes are now live in production.",
      });
    }, 8000);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'metrics':
        window.open('/metrics', '_blank');
        break;
      case 'console':
        window.open('/console', '_blank');
        break;
      case 'fix-ssl':
        toast({
          title: "SSL Fix Initiated",
          description: "Updating SSL certificates for failing endpoints...",
        });
        break;
      case 'retry':
        toast({
          title: "Retrying Failed Deliveries",
          description: "12 deliveries queued for retry.",
        });
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        
        if (existing) {
          return {
            ...msg,
            reactions: reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1, userReacted: true }]
          };
        }
      }
      return msg;
    }));
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice Off" : "Voice On",
      description: isListening ? "Voice input disabled" : "Voice input enabled",
    });
  };

  const resetChat = () => {
    // Save current chat to history
    if (messages.length > 1) {
      const newHistory: ChatHistory = {
        messages: [...messages],
        timestamp: new Date(),
        title: `Chat ${new Date().toLocaleString()}`
      };
      setChatHistory(prev => [newHistory, ...prev].slice(0, 10));
    }

    setMessages([
      {
        id: '1',
        type: 'bot',
        content: "Chat reset! I'm ready to help you with your webhook infrastructure again. What would you like to know?",
        timestamp: new Date(),
        suggestions: QUICK_SUGGESTIONS.slice(0, 3)
      }
    ]);
  };

  const filteredMessages = messages.filter(msg => 
    !searchQuery || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 group ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Enhanced Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="w-9 h-9 ring-2 ring-background shadow-sm">
          <AvatarFallback className={`
            ${message.type === 'bot' 
              ? 'bg-gradient-to-br from-primary via-primary-hover to-primary-glow text-primary-foreground shadow-inner' 
              : message.type === 'system'
              ? 'bg-gradient-to-br from-warning/20 to-warning/10 text-warning border border-warning/30'
              : 'bg-gradient-to-br from-muted to-muted/50 text-muted-foreground'
            }
          `}>
            {message.type === 'bot' ? (
              <Bot className="w-4 h-4" />
            ) : message.type === 'system' ? (
              <Terminal className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </AvatarFallback>
        </Avatar>
        
        {/* Status indicator for bot */}
        {message.type === 'bot' && (
          <div className="w-3 h-3 bg-success rounded-full border-2 border-background -mt-2 ml-6 shadow-sm animate-pulse" />
        )}
      </div>
      
      <div className={`flex flex-col max-w-[82%] min-w-0 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
        {/* Message header with metadata */}
        <div className={`flex items-center gap-2 mb-1 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs font-medium text-foreground">
            {message.type === 'bot' ? 'AI Assistant' : message.type === 'system' ? 'System' : 'You'}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.metadata?.confidence && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {Math.round(message.metadata.confidence * 100)}% confidence
            </Badge>
          )}
        </div>

        {/* Enhanced Message Content */}
        <div className={`
          relative rounded-2xl px-5 py-4 text-sm shadow-sm border transition-all duration-200 hover:shadow-md
          ${message.type === 'user' 
            ? 'bg-gradient-to-br from-primary to-primary-hover text-primary-foreground border-primary/20 shadow-primary/10' 
            : message.type === 'system'
            ? 'bg-gradient-to-br from-warning/5 to-warning/10 text-warning border-warning/20 shadow-warning/5'
            : 'bg-gradient-to-br from-card to-card/50 text-card-foreground border-border/50 shadow-card/5'
          }
        `}>
          <ReactMarkdown
            components={{
              code({node, className, children, ...props}: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return !isInline && match ? (
                  <Card className="relative mt-3 overflow-hidden border border-border/50 bg-muted/30">
                    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/30">
                      <div className="flex items-center gap-2">
                        <Code className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{match[1]}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-background/50"
                        onClick={() => copyToClipboard(String(children))}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="relative">
                      <SyntaxHighlighter
                        style={isDarkMode ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        className="text-sm !bg-transparent !p-4"
                        customStyle={{
                          background: 'transparent',
                          margin: 0,
                          padding: '1rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.5'
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  </Card>
                ) : (
                  <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-xs font-mono border border-primary/20" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
          
          {/* Enhanced Message Actions */}
          <div className="absolute -right-14 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="flex flex-col gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-primary/10"
                onClick={() => copyToClipboard(message.content)}
                title="Copy message"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-success/10"
                onClick={() => addReaction(message.id, '👍')}
                title="Like message"
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-muted"
                onClick={() => {}}
                title="More actions"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Metadata */}
        <div className="flex items-center gap-3 mt-2">
          {message.metadata?.processingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <Badge variant="outline" className="text-xs bg-muted/30">
                {Math.round(message.metadata.processingTime)}ms
              </Badge>
            </div>
          )}
          {message.metadata?.source && (
            <Badge variant="secondary" className="text-xs">
              {message.metadata.source}
            </Badge>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => addReaction(message.id, reaction.emoji)}
                className={`
                  text-xs px-2 py-1 rounded-full transition-colors
                  ${reaction.userReacted 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted hover:bg-muted/80'
                  }
                `}
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {message.actions && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.action}
                className="h-7 text-xs"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Enhanced Suggestions */}
        {message.suggestions && showWelcome && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-full">
            {message.suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                onClick={() => handleSendMessage(suggestion)}
                className="group text-xs px-4 py-2 bg-gradient-to-r from-chat-quick-reply to-chat-quick-reply-hover text-foreground rounded-full border border-border/30 hover:border-primary/40 hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                {suggestion}
              </motion.button>
            ))}
          </div>
        )}

        {/* Contextual suggestions for ongoing conversation */}
        {message.suggestions && !showWelcome && message.type === 'bot' && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-full">
            {message.suggestions.slice(0, 3).map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSendMessage(suggestion)}
                className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-200"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        )}

        {/* Enhanced Card Data with rich visualizations */}
        {message.cardData && (
          <Card className="mt-3 max-w-md border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/80">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {message.cardData.type === 'system_overview' && <Activity className="w-4 h-4 text-primary" />}
                {message.cardData.type === 'status' && <CheckCircle className="w-4 h-4 text-success" />}
                {message.cardData.type === 'metric' && <BarChart3 className="w-4 h-4 text-primary" />}
                {message.cardData.title}
                <Badge variant="outline" className="text-xs ml-auto">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {(message.cardData.type === 'status' || message.cardData.type === 'system_overview') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Status
                        </span>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Healthy
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Uptime
                        </span>
                        <span className="text-sm font-mono font-semibold text-success">
                          {message.cardData.data.uptime}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {message.cardData.data.services !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Server className="w-3 h-3" />
                            Services
                          </span>
                          <span className="text-sm font-mono font-semibold">
                            {message.cardData.data.services}/{message.cardData.data.total}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Gauge className="w-3 h-3" />
                          Response
                        </span>
                        <span className="text-sm font-mono font-semibold text-primary">
                          {message.cardData.data.responseTime}ms
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress indicators */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-semibold text-success">{message.cardData.data.successRate}%</span>
                      </div>
                      <Progress value={message.cardData.data.successRate} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">System Load</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                  
                  {/* Quick actions in card */}
                  <div className="pt-3 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-xs text-muted-foreground">Last updated: Just now</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs hover:bg-primary/10">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
              
              {/* Notification Indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-2 h-2 text-success-foreground" />
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 ${
              isExpanded 
                ? 'inset-4 max-w-none' 
                : isMinimized 
                ? 'bottom-6 right-6 w-80 h-16'
                : 'bottom-6 right-6 w-[90vw] max-w-[42rem] h-[85vh] max-h-[42rem] sm:w-[32rem] md:w-[36rem] lg:w-[40rem]'
            }`}
          >
            <Card className={`
              h-full shadow-2xl border-2 border-primary/20 overflow-hidden
              transition-all duration-300 bg-card/95 backdrop-blur-sm
              ${isExpanded ? 'rounded-xl' : 'rounded-2xl'}
            `}>
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
                      linear-gradient(45deg, transparent 30%, hsl(var(--primary) / 0.05) 50%, transparent 70%)
                    `,
                    animation: 'gradient-shift 8s ease-in-out infinite'
                  }}
                />
              </div>

              {/* Enhanced Header with persistent controls */}
              <div className="relative flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow shadow-lg ring-2 ring-primary/20">
                      <AvatarFallback>
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card shadow-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      AI Control Center
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
                        <Zap className="w-2.5 h-2.5 mr-1" />
                        Enterprise
                      </Badge>
                    </h3>
                    {!isMinimized && (
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span>Online</span>
                        </div>
                        <Separator orientation="vertical" className="h-3" />
                        <span>Full Project Access</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>{PROJECT_DATA.meta.version}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Always visible header controls */}
                <div className="flex items-center gap-1">
                  {!isMinimized && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        title="Toggle theme"
                      >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSearch(!showSearch)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        title="Search conversations"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCommandPalette(true)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        title="Command palette (⌘K)"
                      >
                        <Command className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReferencePanel(!showReferencePanel)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        title="Reference panel"
                      >
                        <Sidebar className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-4 mx-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetChat}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        title="Reset conversation"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    title={isExpanded ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    <Expand className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    title={isMinimized ? "Maximize" : "Minimize"}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  
                  {/* Always visible close button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive ml-1"
                    title="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Enhanced Search Bar */}
                  <AnimatePresence>
                    {showSearch && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 border-b border-border bg-gradient-to-r from-muted/20 to-muted/10"
                      >
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search conversations, commands, or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-9 bg-background/50 border-border/50 focus:border-primary/50"
                          />
                          {searchQuery && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Quick Actions Bar */}
                  {showQuickActions && messages.length <= 1 && (
                    <div className="p-3 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Quick Actions</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "System Health", icon: <CheckCircle className="w-3 h-3" />, command: "/status" },
                          { label: "View Logs", icon: <FileText className="w-3 h-3" />, command: "/logs" },
                          { label: "Deploy", icon: <Play className="w-3 h-3" />, command: "/deploy" },
                          { label: "Metrics", icon: <BarChart3 className="w-3 h-3" />, command: "/metrics" }
                        ].map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendMessage(action.command)}
                            className="h-7 text-xs hover:bg-primary/10 hover:border-primary/30"
                          >
                            {action.icon}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Messages Area */}
                  <ScrollArea className="flex-1 px-4 py-4">
                    <div className="space-y-6">
                      {filteredMessages.map(renderMessage)}
                      
                      {/* Enhanced Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4"
                        >
                          <div className="flex-shrink-0">
                            <Avatar className="w-9 h-9 ring-2 ring-background shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl px-5 py-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">AI Assistant</span>
                              <span className="text-xs text-muted-foreground">is thinking...</span>
                            </div>
                            <motion.div className="flex space-x-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-primary/60 rounded-full"
                                  animate={{ y: [0, -8, 0] }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Enhanced Input Area */}
                  <div className="p-4 border-t border-border bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <Textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={isTyping ? "AI is responding..." : "Ask me anything about your system, or try /status, /deploy, /logs..."}
                          className="min-h-[2.5rem] max-h-32 resize-none bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                          rows={1}
                          disabled={isTyping}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleVoice}
                              className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                                isListening ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'hover:bg-primary/10'
                              }`}
                            >
                              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsMuted(!isMuted)}
                              className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                                isMuted ? 'bg-muted text-muted-foreground' : 'hover:bg-primary/10'
                              }`}
                            >
                              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                            <Separator orientation="vertical" className="h-4 mx-1" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => inputRef.current?.focus()}
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Command className="w-3 h-3 mr-1" />
                              Focus
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <kbd className="px-2 py-1 bg-muted/50 rounded text-xs border border-border/30">⌘K</kbd>
                              <span>commands</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <kbd className="px-2 py-1 bg-muted/50 rounded text-xs border border-border/30">↵</kbd>
                              <span>send</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        size="sm"
                        className="h-11 w-11 p-0 rounded-full bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isTyping ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
      />

      {/* Reference Panel */}
      <ReferencePanel 
        isOpen={showReferencePanel} 
        onClose={() => setShowReferencePanel(false)}
        references={messages
          .filter(msg => msg.references)
          .flatMap(msg => msg.references || [])
          .map(ref => ({
            ...ref,
            type: ref.type as 'page' | 'metric' | 'log' | 'doc'
          }))
        }
      />
    </>
  );
}