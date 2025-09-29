// Comprehensive Project Data Model - Complete System Intelligence
export interface ProjectData {
  meta: {
    id: string;
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    lastUpdated: string;
    owner: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'developer' | 'viewer';
    };
  };
  
  infrastructure: {
    services: {
      webhookService: ServiceStatus;
      database: ServiceStatus;
      cache: ServiceStatus;
      monitoring: ServiceStatus;
      cdn: ServiceStatus;
      security: ServiceStatus;
    };
    deployment: {
      current: {
        version: string;
        deployedAt: string;
        deployedBy: string;
        status: 'success' | 'failed' | 'in-progress';
        rolloutPercentage: number;
      };
      history: DeploymentRecord[];
      pipeline: {
        stages: ('build' | 'test' | 'deploy' | 'verify')[];
        currentStage?: string;
        autoDeployment: boolean;
      };
    };
    scaling: {
      instances: number;
      targetInstances: number;
      autoScaling: boolean;
      cpu: { current: number; target: number; };
      memory: { current: number; target: number; };
    };
  };

  webhooks: {
    endpoints: WebhookEndpoint[];
    statistics: {
      totalRequests: number;
      successRate: number;
      averageResponseTime: number;
      errorRate: number;
      peakThroughput: number;
    };
    alerts: Alert[];
    integrations: Integration[];
  };

  team: {
    members: TeamMember[];
    roles: Role[];
    permissions: Permission[];
    activity: ActivityLog[];
  };

  security: {
    apiKeys: { id: string; name: string; permissions: string[]; lastUsed: string; }[];
    certificates: { domain: string; expiresAt: string; status: 'valid' | 'expiring' | 'expired'; }[];
    firewall: {
      rules: FirewallRule[];
      blockedIPs: string[];
      allowedOrigins: string[];
    };
    audit: AuditLog[];
  };

  monitoring: {
    metrics: {
      uptime: number;
      responseTime: MetricData[];
      throughput: MetricData[];
      errorRate: MetricData[];
      systemLoad: MetricData[];
    };
    alerts: {
      active: Alert[];
      resolved: Alert[];
      configuration: AlertConfig[];
    };
    logs: {
      application: LogEntry[];
      system: LogEntry[];
      security: LogEntry[];
    };
  };

  billing: {
    subscription: {
      plan: 'free' | 'pro' | 'enterprise';
      status: 'active' | 'expired' | 'canceled';
      renewalDate: string;
      usage: {
        requests: number;
        storage: number;
        bandwidth: number;
      };
      limits: {
        requests: number;
        storage: number;
        bandwidth: number;
      };
    };
    invoices: Invoice[];
    paymentMethods: PaymentMethod[];
  };

  configuration: {
    environment: Record<string, string>;
    features: {
      rateLimiting: boolean;
      caching: boolean;
      monitoring: boolean;
      alerting: boolean;
      backup: boolean;
    };
    integrations: {
      slack: boolean;
      discord: boolean;
      email: boolean;
      sms: boolean;
    };
  };
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  uptime: number;
  lastCheck: string;
  responseTime: number;
  version: string;
  instances: number;
}

interface DeploymentRecord {
  id: string;
  version: string;
  deployedAt: string;
  deployedBy: string;
  status: 'success' | 'failed' | 'rolled-back';
  duration: number;
  changes: string[];
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  status: 'active' | 'inactive' | 'error';
  lastTriggered: string;
  successRate: number;
  averageResponseTime: number;
  retryConfig: {
    attempts: number;
    backoff: 'linear' | 'exponential';
    delay: number;
  };
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'critical';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  source: string;
  metadata: Record<string, any>;
}

interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'notification' | 'storage' | 'analytics';
  status: 'connected' | 'disconnected' | 'error';
  configuration: Record<string, any>;
  lastSync: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata: Record<string, any>;
}

interface FirewallRule {
  id: string;
  name: string;
  type: 'allow' | 'deny';
  source: string;
  target: string;
  port?: number;
  protocol: 'tcp' | 'udp' | 'http' | 'https';
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

interface MetricData {
  timestamp: string;
  value: number;
  unit: string;
}

interface AlertConfig {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  notifications: string[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  source: string;
  metadata: Record<string, any>;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidAt?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

// Mock project data generator
export const generateMockProjectData = (): ProjectData => {
  return {
    meta: {
      id: "proj_webhook_gateway_001",
      name: "Enterprise Webhook Gateway",
      version: "v2.4.1",
      environment: "production",
      lastUpdated: new Date().toISOString(),
      owner: {
        id: "user_001",
        name: "Alex Richardson",
        email: "alex@company.com",
        role: "admin"
      }
    },

    infrastructure: {
      services: {
        webhookService: {
          name: "Webhook Service",
          status: "healthy",
          uptime: 99.94,
          lastCheck: new Date().toISOString(),
          responseTime: 142,
          version: "v2.4.1",
          instances: 3
        },
        database: {
          name: "PostgreSQL Cluster",
          status: "healthy",
          uptime: 99.99,
          lastCheck: new Date().toISOString(),
          responseTime: 12,
          version: "v14.2",
          instances: 2
        },
        cache: {
          name: "Redis Cache",
          status: "healthy",
          uptime: 99.95,
          lastCheck: new Date().toISOString(),
          responseTime: 3,
          version: "v7.0",
          instances: 2
        },
        monitoring: {
          name: "Monitoring Stack",
          status: "healthy",
          uptime: 99.92,
          lastCheck: new Date().toISOString(),
          responseTime: 89,
          version: "v2.1",
          instances: 1
        },
        cdn: {
          name: "CloudFlare CDN",
          status: "healthy",
          uptime: 99.98,
          lastCheck: new Date().toISOString(),
          responseTime: 45,
          version: "latest",
          instances: 1
        },
        security: {
          name: "Security Gateway",
          status: "healthy",
          uptime: 99.97,
          lastCheck: new Date().toISOString(),
          responseTime: 23,
          version: "v1.8",
          instances: 2
        }
      },
      deployment: {
        current: {
          version: "v2.4.1",
          deployedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          deployedBy: "alex@company.com",
          status: "success",
          rolloutPercentage: 100
        },
        history: [
          {
            id: "deploy_001",
            version: "v2.4.1",
            deployedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            deployedBy: "alex@company.com",
            status: "success",
            duration: 180,
            changes: ["SSL improvements", "Bug fixes", "Performance optimizations"]
          }
        ],
        pipeline: {
          stages: ["build", "test", "deploy", "verify"],
          autoDeployment: true
        }
      },
      scaling: {
        instances: 3,
        targetInstances: 3,
        autoScaling: true,
        cpu: { current: 45, target: 70 },
        memory: { current: 67, target: 80 }
      }
    },

    webhooks: {
      endpoints: [
        {
          id: "webhook_stripe_001",
          name: "Stripe Payment Webhook",
          url: "/webhooks/stripe",
          method: "POST",
          status: "active",
          lastTriggered: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          successRate: 99.7,
          averageResponseTime: 89,
          retryConfig: {
            attempts: 3,
            backoff: "exponential",
            delay: 1000
          }
        },
        {
          id: "webhook_github_001",
          name: "GitHub Repository Webhook",
          url: "/webhooks/github",
          method: "POST",
          status: "active",
          lastTriggered: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          successRate: 98.9,
          averageResponseTime: 156,
          retryConfig: {
            attempts: 2,
            backoff: "linear",
            delay: 2000
          }
        }
      ],
      statistics: {
        totalRequests: 1247856,
        successRate: 99.2,
        averageResponseTime: 142,
        errorRate: 0.8,
        peakThroughput: 1850
      },
      alerts: [
        {
          id: "alert_001",
          type: "warning",
          title: "SSL Certificate Expiring",
          description: "SSL certificate for api.legacy-partner.com expires in 7 days",
          severity: "medium",
          status: "active",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          source: "security-monitor",
          metadata: { domain: "api.legacy-partner.com", expiresIn: "7 days" }
        }
      ],
      integrations: [
        {
          id: "int_stripe_001",
          name: "Stripe Payments",
          type: "payment",
          status: "connected",
          configuration: { apiVersion: "2022-11-15", webhookVersion: "v1" },
          lastSync: new Date().toISOString()
        }
      ]
    },

    team: {
      members: [
        {
          id: "user_001",
          name: "Alex Richardson",
          email: "alex@company.com",
          role: "Admin",
          status: "active",
          lastActive: new Date().toISOString(),
          permissions: ["admin", "deploy", "configure", "monitor"]
        },
        {
          id: "user_002",
          name: "Sarah Chen",
          email: "sarah@company.com",
          role: "Developer",
          status: "active",
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          permissions: ["develop", "monitor", "debug"]
        }
      ],
      roles: [
        {
          id: "role_admin",
          name: "Admin",
          permissions: ["admin", "deploy", "configure", "monitor", "develop", "debug"],
          description: "Full system access"
        }
      ],
      permissions: [
        { id: "perm_admin", name: "Admin Access", resource: "system", action: "manage" },
        { id: "perm_deploy", name: "Deploy", resource: "deployment", action: "execute" }
      ],
      activity: [
        {
          id: "activity_001",
          userId: "user_001",
          action: "deployment.create",
          resource: "v2.4.1",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: { version: "v2.4.1", duration: "3m" }
        }
      ]
    },

    security: {
      apiKeys: [
        {
          id: "key_001",
          name: "Production API Key",
          permissions: ["webhooks.read", "webhooks.write"],
          lastUsed: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        }
      ],
      certificates: [
        {
          domain: "api.company.com",
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          status: "valid"
        },
        {
          domain: "api.legacy-partner.com",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "expiring"
        }
      ],
      firewall: {
        rules: [
          {
            id: "rule_001",
            name: "Allow HTTP/HTTPS",
            type: "allow",
            source: "0.0.0.0/0",
            target: "webhook-service",
            port: 443,
            protocol: "https"
          }
        ],
        blockedIPs: ["192.168.1.100", "10.0.0.5"],
        allowedOrigins: ["https://app.company.com", "https://dashboard.company.com"]
      },
      audit: [
        {
          id: "audit_001",
          userId: "user_001",
          action: "login",
          resource: "dashboard",
          result: "success",
          timestamp: new Date().toISOString(),
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0..."
        }
      ]
    },

    monitoring: {
      metrics: {
        uptime: 99.94,
        responseTime: [
          { timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), value: 142, unit: "ms" },
          { timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), value: 138, unit: "ms" },
          { timestamp: new Date().toISOString(), value: 145, unit: "ms" }
        ],
        throughput: [
          { timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), value: 1247, unit: "req/hr" },
          { timestamp: new Date().toISOString(), value: 1289, unit: "req/hr" }
        ],
        errorRate: [
          { timestamp: new Date().toISOString(), value: 0.8, unit: "%" }
        ],
        systemLoad: [
          { timestamp: new Date().toISOString(), value: 45, unit: "%" }
        ]
      },
      alerts: {
        active: [],
        resolved: [],
        configuration: [
          {
            id: "alert_config_001",
            name: "High Error Rate",
            condition: "error_rate > 5%",
            threshold: 5,
            enabled: true,
            notifications: ["email", "slack"]
          }
        ]
      },
      logs: {
        application: [
          {
            id: "log_001",
            timestamp: new Date().toISOString(),
            level: "info",
            message: "Webhook processed successfully",
            source: "webhook-service",
            metadata: { endpoint: "/webhooks/stripe", duration: "89ms" }
          }
        ],
        system: [],
        security: []
      }
    },

    billing: {
      subscription: {
        plan: "pro",
        status: "active",
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          requests: 1247856,
          storage: 45.2,
          bandwidth: 120.5
        },
        limits: {
          requests: 2000000,
          storage: 100,
          bandwidth: 500
        }
      },
      invoices: [
        {
          id: "inv_001",
          amount: 299,
          currency: "USD",
          status: "paid",
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      paymentMethods: [
        {
          id: "pm_001",
          type: "card",
          last4: "4242",
          expiryDate: "12/2025",
          isDefault: true
        }
      ]
    },

    configuration: {
      environment: {
        NODE_ENV: "production",
        API_BASE_URL: "https://api.company.com",
        DATABASE_URL: "postgresql://...",
        REDIS_URL: "redis://..."
      },
      features: {
        rateLimiting: true,
        caching: true,
        monitoring: true,
        alerting: true,
        backup: true
      },
      integrations: {
        slack: true,
        discord: false,
        email: true,
        sms: true
      }
    }
  };
};

// Global project data instance
export const PROJECT_DATA = generateMockProjectData();