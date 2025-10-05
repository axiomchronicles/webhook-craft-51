import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/store/ui';
import { useDeliveries } from '@/hooks/use-deliveries';
import { formatDistanceToNow } from 'date-fns';

export default function Deliveries() {
  const { openRightDrawer } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { deliveries, isLoading, retryDelivery } = useDeliveries();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredDeliveries = deliveries?.filter(delivery => {
    const matchesSearch = delivery.endpoints?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         delivery.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'retrying':
        return <RefreshCw className="w-4 h-4 text-warning animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'retrying':
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const totalDeliveries = deliveries?.length || 0;
  const successfulDeliveries = deliveries?.filter(d => d.status === 'success').length || 0;
  const failedDeliveries = deliveries?.filter(d => d.status === 'failed').length || 0;
  const retryingDeliveries = deliveries?.filter(d => d.status === 'retrying').length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Deliveries</h1>
          <p className="text-muted-foreground">
            Monitor webhook delivery status and performance
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{totalDeliveries}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-2xl font-bold">{successfulDeliveries}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <span className="text-2xl font-bold">{failedDeliveries}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Retrying
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-warning" />
              <span className="text-2xl font-bold">{retryingDeliveries}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search deliveries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('success')}>
                  Success
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                  Failed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('retrying')}>
                  Retrying
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      {filteredDeliveries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Timer className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'No deliveries match your filters'
                : 'No deliveries yet. Webhooks will appear here once received.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <motion.tr
                    key={delivery.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-muted/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(delivery.status)}
                        <Badge variant={getStatusVariant(delivery.status)}>
                          {delivery.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{delivery.endpoints?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                          {delivery.endpoints?.url || 'N/A'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {delivery.response_time_ms && (
                          <span className={`font-medium text-sm ${
                            delivery.response_time_ms < 1000 ? 'text-success' :
                            delivery.response_time_ms < 5000 ? 'text-warning' :
                            'text-destructive'
                          }`}>
                            {delivery.response_time_ms}ms
                          </span>
                        )}
                        {delivery.response_status && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              delivery.response_status >= 200 && delivery.response_status < 300 
                                ? 'text-success' 
                                : 'text-destructive'
                            }`}
                          >
                            {delivery.response_status}
                          </Badge>
                        )}
                        {delivery.error_message && (
                          <span className="text-xs text-destructive truncate max-w-xs">
                            {delivery.error_message}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{delivery.attempt_count} / {delivery.max_attempts}</span>
                        {delivery.next_retry_at && (
                          <Badge variant="outline" className="text-xs">
                            Next: {formatDistanceToNow(new Date(delivery.next_retry_at), { addSuffix: true })}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(delivery.created_at), { addSuffix: true })}
                        </span>
                        {delivery.completed_at && (
                          <span className="text-xs text-muted-foreground">
                            Completed: {formatDistanceToNow(new Date(delivery.completed_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {(delivery.status === 'failed' || delivery.status === 'retrying') && 
                         delivery.attempt_count < delivery.max_attempts && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => retryDelivery.mutate(delivery.id)}
                            disabled={retryDelivery.isPending}
                            title="Retry Now"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => openRightDrawer('inspector')}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
