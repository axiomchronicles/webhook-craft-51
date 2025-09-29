import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Zap, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  Database, 
  AlertTriangle,
  Users,
  Monitor,
  FileText,
  Search,
  Command,
  ChevronRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface CommandAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'system' | 'navigation' | 'analytics' | 'deploy';
  keywords: string[];
  action: () => void;
  shortcut?: string;
  badge?: string;
  requiresConfirmation?: boolean;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS: CommandAction[] = [
  {
    id: 'restart-service',
    title: 'Restart Service',
    description: 'Restart the webhook processing service',
    icon: <RefreshCw className="w-4 h-4" />,
    category: 'system',
    keywords: ['restart', 'service', 'reset', 'reboot'],
    action: () => console.log('Restarting service...'),
    shortcut: '⌘ R S',
    requiresConfirmation: true,
    badge: 'System'
  },
  {
    id: 'view-logs',
    title: 'View System Logs',
    description: 'Open real-time system logs',
    icon: <Terminal className="w-4 h-4" />,
    category: 'system',
    keywords: ['logs', 'console', 'debug', 'terminal'],
    action: () => window.open('/console', '_blank'),
    shortcut: '⌘ L'
  },
  {
    id: 'metrics',
    title: 'Performance Metrics',
    description: 'View system performance and analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    category: 'analytics',
    keywords: ['metrics', 'performance', 'analytics', 'stats'],
    action: () => window.open('/metrics', '_blank'),
    shortcut: '⌘ M'
  },
  {
    id: 'settings',
    title: 'System Settings',
    description: 'Configure system preferences',
    icon: <Settings className="w-4 h-4" />,
    category: 'navigation',
    keywords: ['settings', 'config', 'preferences'],
    action: () => window.open('/settings', '_blank')
  },
  {
    id: 'database',
    title: 'Database Status',
    description: 'Check database connectivity and health',
    icon: <Database className="w-4 h-4" />,
    category: 'system',
    keywords: ['database', 'db', 'health', 'status'],
    action: () => console.log('Checking database status...'),
    badge: 'Health'
  },
  {
    id: 'alerts',
    title: 'System Alerts',
    description: 'View active alerts and notifications',
    icon: <AlertTriangle className="w-4 h-4" />,
    category: 'system',
    keywords: ['alerts', 'warnings', 'notifications'],
    action: () => window.open('/alerts', '_blank')
  },
  {
    id: 'teams',
    title: 'Team Management',
    description: 'Manage team members and permissions',
    icon: <Users className="w-4 h-4" />,
    category: 'navigation',
    keywords: ['teams', 'users', 'permissions', 'members'],
    action: () => window.open('/teams', '_blank')
  },
  {
    id: 'deploy',
    title: 'Deploy Changes',
    description: 'Deploy pending configuration changes',
    icon: <Zap className="w-4 h-4" />,
    category: 'deploy',
    keywords: ['deploy', 'release', 'push', 'live'],
    action: () => console.log('Deploying changes...'),
    shortcut: '⌘ D',
    requiresConfirmation: true,
    badge: 'Deploy'
  }
];

const CATEGORY_COLORS = {
  system: 'bg-primary/10 text-primary',
  navigation: 'bg-accent/10 text-accent',
  analytics: 'bg-warning/10 text-warning',
  deploy: 'bg-destructive/10 text-destructive'
};

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState(COMMANDS);
  const { toast } = useToast();

  const filterCommands = useCallback((searchQuery: string) => {
    if (!searchQuery) {
      return COMMANDS;
    }
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return COMMANDS.filter(command =>
      command.title.toLowerCase().includes(lowercaseQuery) ||
      command.description.toLowerCase().includes(lowercaseQuery) ||
      command.keywords.some(keyword => keyword.includes(lowercaseQuery))
    );
  }, []);

  useEffect(() => {
    const filtered = filterCommands(query);
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [query, filterCommands]);

  const executeCommand = useCallback((command: CommandAction) => {
    if (command.requiresConfirmation) {
      toast({
        title: "Confirm Action",
        description: `Are you sure you want to ${command.title.toLowerCase()}?`,
      });
    } else {
      command.action();
      toast({
        title: "Command Executed",
        description: command.title,
      });
    }
    onClose();
  }, [toast, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, executeCommand, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Command className="w-4 h-4" />
            Command Palette
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-2">
            <AnimatePresence>
              {filteredCommands.map((command, index) => (
                <motion.div
                  key={command.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => executeCommand(command)}
                  className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${index === selectedIndex 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`
                      p-2 rounded-md 
                      ${CATEGORY_COLORS[command.category]}
                    `}>
                      {command.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{command.title}</h3>
                        {command.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {command.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {command.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {command.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {command.shortcut}
                      </Badge>
                    )}
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredCommands.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No commands found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-4 py-2 border-t bg-muted/30">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Use ↑↓ to navigate</span>
            <span>⏎ to select • ⎋ to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}