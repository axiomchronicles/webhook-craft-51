import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: LucideIcon;
  className?: string;
  loading?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  className,
  loading = false 
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('kpi-card hover-glow', className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="kpi-label">{title}</p>
          <div className="flex items-end gap-2">
            {loading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : (
              <p className="kpi-value">{value}</p>
            )}
            
            {trend && !loading && (
              <span className={cn(
                'kpi-trend',
                trend.direction === 'up' ? 'positive' : 'negative'
              )}>
                {trend.direction === 'up' ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </motion.div>
  );
}