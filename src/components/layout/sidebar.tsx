import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Webhook, 
  Activity, 
  PlayCircle, 
  GitBranch,
  BarChart3,
  AlertTriangle,
  Users,
  Settings,
  Puzzle,
  FileText,
  CreditCard,
  Shield,
  Menu
} from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview and metrics'
  },
  {
    title: 'Endpoints',
    href: '/endpoints',
    icon: Webhook,
    description: 'Manage webhook endpoints'
  },
  {
    title: 'Deliveries',
    href: '/deliveries',
    icon: Activity,
    description: 'Monitor webhook deliveries'
  },
  {
    title: 'Simulator',
    href: '/simulator',
    icon: PlayCircle,
    description: 'Test webhooks locally'
  },
  {
    title: 'Pipelines',
    href: '/pipelines',
    icon: GitBranch,
    description: 'Transform and route data'
  },
  {
    title: 'Metrics',
    href: '/metrics',
    icon: BarChart3,
    description: 'Analytics and insights'
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: AlertTriangle,
    description: 'Monitoring and SLOs'
  },
  {
    title: 'Teams',
    href: '/teams',
    icon: Users,
    description: 'Manage team access'
  },
  {
    title: 'Integrations',
    href: '/integrations',
    icon: Puzzle,
    description: 'Connect external services'
  },
  {
    title: 'Audit',
    href: '/audit',
    icon: FileText,
    description: 'Security and compliance'
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: CreditCard,
    description: 'Usage and billing'
  },
  {
    title: 'Compliance',
    href: '/compliance',
    icon: Shield,
    description: 'GDPR and SOC2'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration'
  }
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' 
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      className="bg-card border-r border-border shadow-sm flex flex-col h-full"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center"
          >
            <Webhook className="w-4 h-4 text-primary-foreground" />
          </motion.div>
          
          <motion.div
            initial={false}
            animate={{ 
              opacity: sidebarCollapsed ? 0 : 1,
              width: sidebarCollapsed ? 0 : 'auto'
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <h1 className="font-bold text-foreground whitespace-nowrap">
              Webhooks Gateway
            </h1>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              Enterprise Admin
            </p>
          </motion.div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="ml-auto w-8 h-8 p-0"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  'hover:bg-muted/50',
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
              title={sidebarCollapsed ? `${item.title} - ${item.description}` : undefined}
            >
              <item.icon className={cn(
                'w-4 h-4 flex-shrink-0',
                isActive ? 'text-primary' : ''
              )} />
              
              <motion.span
                initial={false}
                animate={{ 
                  opacity: sidebarCollapsed ? 0 : 1,
                  width: sidebarCollapsed ? 0 : 'auto'
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.title}
              </motion.span>
              
              {isActive && !sidebarCollapsed && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="w-1 h-1 bg-primary rounded-full ml-auto"
                  transition={{ duration: 0.2 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Environment Indicator */}
      <div className="p-4 border-t border-border">
        <motion.div
          initial={false}
          animate={{ 
            opacity: sidebarCollapsed ? 0 : 1,
            height: sidebarCollapsed ? 0 : 'auto'
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="status-indicator success text-xs">
            Production Environment
          </div>
        </motion.div>
        
        {sidebarCollapsed && (
          <div className="w-3 h-3 bg-success rounded-full mx-auto" />
        )}
      </div>
    </motion.aside>
  );
}