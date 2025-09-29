import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Command, 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  Monitor,
  Globe,
  TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { ThemeToggle } from '@/components/theme-toggle';
import { CommandSearch } from '@/components/ui/command-search';

const breadcrumbMap: Record<string, string[]> = {
  '/': ['Dashboard'],
  '/endpoints': ['Endpoints'],
  '/deliveries': ['Deliveries'],
  '/simulator': ['Simulator'],
  '/pipelines': ['Pipelines'],
  '/metrics': ['Metrics'],
  '/alerts': ['Alerts'],
  '/teams': ['Teams'],
  '/integrations': ['Integrations'],
  '/audit': ['Audit'],
  '/billing': ['Billing'],
  '/compliance': ['Compliance'],
  '/settings': ['Settings'],
};

export function TopBar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { environment, setEnvironment, openRightDrawer } = useUIStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const breadcrumbs = breadcrumbMap[location.pathname] || ['Dashboard'];

  const environmentColors = {
    production: 'success',
    staging: 'warning', 
    development: 'info'
  } as const;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Breadcrumbs */}
        <div className="flex items-center gap-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-muted-foreground">/</span>
                  )}
                  <span className={index === breadcrumbs.length - 1 
                    ? 'font-medium text-foreground' 
                    : 'text-muted-foreground'
                  }>
                    {crumb}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints, deliveries... ⌘K"
              className="pl-10 pr-4 bg-muted/50 border-border cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
              readOnly
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 inline-flex items-center rounded border border-border px-1 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center gap-3">
          {/* Environment Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {environment === 'production' && <Globe className="w-4 h-4" />}
                {environment === 'staging' && <TestTube className="w-4 h-4" />}
                {environment === 'development' && <Monitor className="w-4 h-4" />}
                <Badge variant="secondary" className={`status-indicator ${environmentColors[environment]}`}>
                  {environment}
                </Badge>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEnvironment('production')}>
                <Globe className="w-4 h-4 mr-2" />
                Production
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEnvironment('staging')}>
                <TestTube className="w-4 h-4 mr-2" />
                Staging
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEnvironment('development')}>
                <Monitor className="w-4 h-4 mr-2" />
                Development
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Command Palette Trigger */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => setIsSearchOpen(true)}
          >
            <Command className="w-4 h-4" />
            <span className="hidden sm:inline">Commands</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center"
            >
              <span className="text-[8px] font-bold text-destructive-foreground">3</span>
            </motion.span>
          </Button>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => openRightDrawer('settings')}
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );

  // Add keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}