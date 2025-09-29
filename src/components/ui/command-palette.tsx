import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandSeparator 
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Terminal, 
  Zap, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  Database,
  Webhook,
  Users,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Search,
  Code
} from 'lucide-react';

interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  keywords: string[];
  category: 'navigation' | 'actions' | 'system';
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string, description: string) => void;
}

export function CommandPalette({ isOpen, onClose, onExecuteCommand }: CommandPaletteProps) {
  const [value, setValue] = useState('');

  const commands: CommandAction[] = [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      label: 'Open Dashboard',
      description: 'View system overview and key metrics',
      icon: BarChart3,
      keywords: ['dashboard', 'overview', 'metrics', 'home'],
      category: 'navigation',
      shortcut: '⌘D',
      action: () => {
        window.location.href = '/dashboard';
        onExecuteCommand('/dashboard', 'Navigated to Dashboard');
      }
    },
    {
      id: 'nav-webhooks',
      label: 'View Webhooks',
      description: 'Manage webhook endpoints and deliveries',
      icon: Webhook,
      keywords: ['webhooks', 'endpoints', 'deliveries'],
      category: 'navigation',
      shortcut: '⌘W',
      action: () => {
        window.location.href = '/endpoints';
        onExecuteCommand('/endpoints', 'Opened Webhooks page');
      }
    },
    {
      id: 'nav-console',
      label: 'Open Console',
      description: 'View real-time logs and system events',
      icon: Terminal,
      keywords: ['console', 'logs', 'terminal', 'events'],
      category: 'navigation',
      shortcut: '⌘K',
      action: () => {
        window.location.href = '/console';
        onExecuteCommand('/console', 'Opened Console');
      }
    },
    {
      id: 'nav-alerts',
      label: 'View Alerts',
      description: 'Check system alerts and notifications',
      icon: AlertTriangle,
      keywords: ['alerts', 'notifications', 'warnings', 'errors'],
      category: 'navigation',
      action: () => {
        window.location.href = '/alerts';
        onExecuteCommand('/alerts', 'Opened Alerts page');
      }
    },
    {
      id: 'nav-settings',
      label: 'Open Settings',
      description: 'Configure system and user preferences',
      icon: Settings,
      keywords: ['settings', 'config', 'preferences'],
      category: 'navigation',
      shortcut: '⌘,',
      action: () => {
        window.location.href = '/settings';
        onExecuteCommand('/settings', 'Opened Settings');
      }
    },

    // System Actions
    {
      id: 'action-restart',
      label: 'Restart Service',
      description: 'Restart the webhook processing service',
      icon: RotateCcw,
      keywords: ['restart', 'reboot', 'service', 'reload'],
      category: 'system',
      action: () => {
        onExecuteCommand('restart service', 'Service restart initiated');
      }
    },
    {
      id: 'action-logs',
      label: 'Tail Logs',
      description: 'Stream real-time application logs',
      icon: FileText,
      keywords: ['logs', 'tail', 'stream', 'monitor'],
      category: 'system',
      action: () => {
        onExecuteCommand('tail logs', 'Started log streaming');
      }
    },
    {
      id: 'action-deploy',
      label: 'Deploy Latest',
      description: 'Deploy the latest version to production',
      icon: Zap,
      keywords: ['deploy', 'release', 'production', 'update'],
      category: 'system',
      action: () => {
        onExecuteCommand('deploy latest', 'Deployment started');
      }
    },
    {
      id: 'action-health',
      label: 'Health Check',
      description: 'Run comprehensive system health check',
      icon: Database,
      keywords: ['health', 'check', 'status', 'diagnostics'],
      category: 'system',
      action: () => {
        onExecuteCommand('health check', 'Running health diagnostics');
      }
    },

    // Quick Actions
    {
      id: 'action-test-webhook',
      label: 'Test Webhook',
      description: 'Send a test webhook to verify connectivity',
      icon: Play,
      keywords: ['test', 'webhook', 'verify', 'ping'],
      category: 'actions',
      action: () => {
        onExecuteCommand('test webhook', 'Test webhook sent');
      }
    },
    {
      id: 'action-pause-processing',
      label: 'Pause Processing',
      description: 'Temporarily pause webhook processing',
      icon: Pause,
      keywords: ['pause', 'stop', 'halt', 'processing'],
      category: 'actions',
      action: () => {
        onExecuteCommand('pause processing', 'Webhook processing paused');
      }
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(value.toLowerCase()) ||
    command.description.toLowerCase().includes(value.toLowerCase()) ||
    command.keywords.some(keyword => keyword.includes(value.toLowerCase()))
  );

  const groupedCommands = {
    navigation: filteredCommands.filter(cmd => cmd.category === 'navigation'),
    actions: filteredCommands.filter(cmd => cmd.category === 'actions'),
    system: filteredCommands.filter(cmd => cmd.category === 'system')
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier) {
        const command = commands.find(cmd => {
          if (!cmd.shortcut) return false;
          const key = cmd.shortcut.slice(-1);
          return e.key.toLowerCase() === key.toLowerCase();
        });

        if (command && !isOpen) {
          e.preventDefault();
          command.action();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [commands, isOpen]);

  const handleCommandSelect = useCallback((commandId: string) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (command) {
      command.action();
      onClose();
    }
  }, [commands, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl">
        <Command className="rounded-lg border-0 shadow-2xl">
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder="Type a command or search..."
              value={value}
              onValueChange={setValue}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
            />
            <Badge variant="secondary" className="ml-2 text-xs">
              ⌘K
            </Badge>
          </div>

          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No commands found for "{value}"
            </CommandEmpty>

            <AnimatePresence mode="wait">
              {groupedCommands.navigation.length > 0 && (
                <CommandGroup heading="Navigation" className="p-2">
                  {groupedCommands.navigation.map((command, index) => (
                    <motion.div
                      key={command.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CommandItem
                        value={command.id}
                        onSelect={() => handleCommandSelect(command.id)}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent rounded-md group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <command.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{command.label}</div>
                          <div className="text-xs text-muted-foreground">{command.description}</div>
                        </div>
                        {command.shortcut && (
                          <Badge variant="outline" className="text-xs">
                            {command.shortcut}
                          </Badge>
                        )}
                      </CommandItem>
                    </motion.div>
                  ))}
                </CommandGroup>
              )}

              {groupedCommands.navigation.length > 0 && (groupedCommands.actions.length > 0 || groupedCommands.system.length > 0) && (
                <CommandSeparator />
              )}

              {groupedCommands.actions.length > 0 && (
                <CommandGroup heading="Quick Actions" className="p-2">
                  {groupedCommands.actions.map((command, index) => (
                    <motion.div
                      key={command.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CommandItem
                        value={command.id}
                        onSelect={() => handleCommandSelect(command.id)}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent rounded-md group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent/20 group-hover:bg-accent/30 transition-colors">
                          <command.icon className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{command.label}</div>
                          <div className="text-xs text-muted-foreground">{command.description}</div>
                        </div>
                      </CommandItem>
                    </motion.div>
                  ))}
                </CommandGroup>
              )}

              {groupedCommands.actions.length > 0 && groupedCommands.system.length > 0 && (
                <CommandSeparator />
              )}

              {groupedCommands.system.length > 0 && (
                <CommandGroup heading="System Actions" className="p-2">
                  {groupedCommands.system.map((command, index) => (
                    <motion.div
                      key={command.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CommandItem
                        value={command.id}
                        onSelect={() => handleCommandSelect(command.id)}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent rounded-md group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-warning/20 group-hover:bg-warning/30 transition-colors">
                          <command.icon className="w-4 h-4 text-warning-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{command.label}</div>
                          <div className="text-xs text-muted-foreground">{command.description}</div>
                        </div>
                      </CommandItem>
                    </motion.div>
                  ))}
                </CommandGroup>
              )}
            </AnimatePresence>
          </CommandList>

          <div className="border-t p-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, ↵ to select, Esc to close</span>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">⌘K</Badge>
                <span>to toggle</span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}