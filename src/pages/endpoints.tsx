import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Webhook,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Play,
  Pause,
  Trash2,
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
import { useEndpoints } from '@/hooks/use-endpoints';
import { CreateEndpointDialog } from '@/components/endpoints/create-endpoint-dialog';
import { formatDistanceToNow } from 'date-fns';

export default function Endpoints() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { endpoints, isLoading, deleteEndpoint, toggleEndpointStatus } = useEndpoints();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredEndpoints = endpoints?.filter(endpoint => {
    const matchesSearch = endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || endpoint.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'paused':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const activeEndpoints = endpoints?.filter(e => e.status === 'active').length || 0;
  const avgSuccessRate = endpoints && endpoints.length > 0
    ? endpoints.reduce((acc, e) => {
        const rate = e.total_deliveries > 0 
          ? (e.successful_deliveries / e.total_deliveries) * 100 
          : 0;
        return acc + rate;
      }, 0) / endpoints.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Endpoints</h1>
          <p className="text-muted-foreground">
            Manage and monitor your webhook endpoints
          </p>
        </div>
        <CreateEndpointDialog />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{endpoints?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-2xl font-bold">{activeEndpoints}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-2xl font-bold">
                {avgSuccessRate.toFixed(1)}%
              </span>
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
                placeholder="Search endpoints..."
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
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                  Paused
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints Table */}
      {filteredEndpoints.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'No endpoints match your filters'
                : 'No endpoints configured yet. Create your first endpoint to start receiving webhooks.'}
            </p>
            {!searchQuery && statusFilter === 'all' && <CreateEndpointDialog />}
          </CardContent>
        </Card>
      ) : (
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle>Endpoint List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.map((endpoint) => {
                  const successRate = endpoint.total_deliveries > 0
                    ? Math.round((endpoint.successful_deliveries / endpoint.total_deliveries) * 100)
                    : 0;

                  return (
                    <motion.tr
                      key={endpoint.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-muted/30"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(endpoint.status)}
                          <div>
                            <p className="font-medium">{endpoint.name}</p>
                            <p className="text-xs text-muted-foreground">{endpoint.method}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm truncate max-w-xs">{endpoint.url}</span>
                          <a
                            href={endpoint.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          successRate >= 95 ? 'text-success' :
                          successRate >= 90 ? 'text-warning' :
                          'text-destructive'
                        }`}>
                          {successRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{endpoint.total_deliveries}</div>
                          <div className="text-xs text-muted-foreground">
                            {endpoint.successful_deliveries} success / {endpoint.failed_deliveries} failed
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {endpoint.last_triggered_at
                            ? formatDistanceToNow(new Date(endpoint.last_triggered_at), { addSuffix: true })
                            : 'Never'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() =>
                              toggleEndpointStatus.mutate({
                                id: endpoint.id,
                                status: endpoint.status === 'active' ? 'paused' : 'active',
                              })
                            }
                            disabled={toggleEndpointStatus.isPending}
                            title={endpoint.status === 'active' ? 'Pause' : 'Activate'}
                          >
                            {endpoint.status === 'active' ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Test Endpoint</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this endpoint?')) {
                                    deleteEndpoint.mutate(endpoint.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
