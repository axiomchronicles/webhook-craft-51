import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command,
  FileText,
  Activity,
  Settings,
  Users,
  Webhook,
  Terminal,
  AlertTriangle,
  BarChart3,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: any;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Dashboard Overview',
    description: 'View system metrics and KPIs',
    url: '/',
    category: 'Page',
    icon: BarChart3
  },
  {
    id: '2',
    title: 'API Endpoints',
    description: 'Manage webhook endpoints',
    url: '/endpoints',
    category: 'Page', 
    icon: Webhook
  },
  {
    id: '3',
    title: 'Alert Rules',
    description: 'Configure monitoring alerts',
    url: '/alerts',
    category: 'Page',
    icon: AlertTriangle
  },
  {
    id: '4',
    title: 'User Management',
    description: 'Manage team members and permissions',
    url: '/teams',
    category: 'Page',
    icon: Users
  },
  {
    id: '5',
    title: 'Terminal Console',
    description: 'Access command line interface',
    url: '/terminal',
    category: 'Tool',
    icon: Terminal
  },
  {
    id: '6',
    title: 'Recent Deliveries',
    description: 'View webhook delivery logs',
    url: '/deliveries',
    category: 'Data',
    icon: Activity
  },
  {
    id: '7',
    title: 'System Settings',
    description: 'Configure application preferences',
    url: '/settings',
    category: 'Settings', 
    icon: Settings
  }
];

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults(mockSearchResults.slice(0, 6));
    } else {
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); 
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        navigate(results[selectedIndex].url);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const categoryColors = {
    Page: 'bg-primary/10 text-primary',
    Tool: 'bg-success/10 text-success', 
    Data: 'bg-warning/10 text-warning',
    Settings: 'bg-muted/10 text-muted-foreground'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, commands, and more..."
              className="border-0 focus-visible:ring-0 text-base bg-transparent"
            />
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-medium">ESC</kbd>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            <AnimatePresence>
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => {
                    const Icon = result.icon;
                    const isSelected = index === selectedIndex;
                    
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => {
                          navigate(result.url);
                          onClose();
                        }}
                      >
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-primary/20' : 'bg-muted/50'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm truncate">
                              {result.title}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${categoryColors[result.category as keyof typeof categoryColors]}`}
                            >
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </p>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1"
                          >
                            <kbd className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-xs">
                              ↵
                            </kbd>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try different keywords or check spelling
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded">↵</kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Command className="w-3 h-3" />
              <span>Quick Search</span>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}