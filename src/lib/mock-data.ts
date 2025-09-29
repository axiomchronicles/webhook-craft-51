// Mock data for the Webhooks Gateway admin interface

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  status: 'active' | 'inactive' | 'error';
  lastDelivery: string;
  successRate: number;
  createdAt: string;
  events: string[];
}

export interface Delivery {
  id: string;
  endpointId: string;
  endpointName: string;
  event: string;
  status: 'success' | 'failed' | 'pending' | 'retrying';
  timestamp: string;
  responseTime: number;
  responseCode?: number;
  retryCount: number;
  nextRetry?: string;
}

export interface MetricData {
  timestamp: string;
  value: number;
  label?: string;
}

// Generate mock endpoints
export const mockEndpoints: Endpoint[] = [
  {
    id: 'ep_1',
    name: 'Order Fulfillment',
    url: 'https://api.store.com/webhooks/orders',
    method: 'POST',
    status: 'active',
    lastDelivery: '2024-01-15T10:30:00Z',
    successRate: 98.5,
    createdAt: '2024-01-01T00:00:00Z',
    events: ['order.created', 'order.completed', 'order.cancelled']
  },
  {
    id: 'ep_2',
    name: 'Payment Processing',
    url: 'https://payments.example.com/api/hooks',
    method: 'POST',
    status: 'active',
    lastDelivery: '2024-01-15T10:25:00Z',
    successRate: 99.2,
    createdAt: '2024-01-02T00:00:00Z',
    events: ['payment.succeeded', 'payment.failed', 'payment.refunded']
  },
  {
    id: 'ep_3',
    name: 'User Management',
    url: 'https://auth.company.com/webhooks',
    method: 'POST',
    status: 'error',
    lastDelivery: '2024-01-15T09:45:00Z',
    successRate: 85.1,
    createdAt: '2024-01-03T00:00:00Z',
    events: ['user.created', 'user.updated', 'user.deleted']
  },
  {
    id: 'ep_4',
    name: 'Inventory Updates',
    url: 'https://inventory.warehouse.com/hooks',
    method: 'POST',
    status: 'inactive',
    lastDelivery: '2024-01-14T15:20:00Z',
    successRate: 96.8,
    createdAt: '2024-01-04T00:00:00Z',
    events: ['inventory.updated', 'stock.low', 'product.discontinued']
  }
];

// Generate mock deliveries
export const mockDeliveries: Delivery[] = [
  {
    id: 'dlv_1',
    endpointId: 'ep_1',
    endpointName: 'Order Fulfillment',
    event: 'order.completed',
    status: 'success',
    timestamp: '2024-01-15T10:30:00Z',
    responseTime: 245,
    responseCode: 200,
    retryCount: 0
  },
  {
    id: 'dlv_2',
    endpointId: 'ep_2',
    endpointName: 'Payment Processing',
    event: 'payment.succeeded',
    status: 'success',
    timestamp: '2024-01-15T10:25:00Z',
    responseTime: 156,
    responseCode: 200,
    retryCount: 0
  },
  {
    id: 'dlv_3',
    endpointId: 'ep_3',
    endpointName: 'User Management',
    event: 'user.created',
    status: 'failed',
    timestamp: '2024-01-15T10:20:00Z',
    responseTime: 30000,
    responseCode: 500,
    retryCount: 2,
    nextRetry: '2024-01-15T10:35:00Z'
  },
  {
    id: 'dlv_4',
    endpointId: 'ep_1',
    endpointName: 'Order Fulfillment',
    event: 'order.created',
    status: 'retrying',
    timestamp: '2024-01-15T10:15:00Z',
    responseTime: 5000,
    responseCode: 408,
    retryCount: 1,
    nextRetry: '2024-01-15T10:31:00Z'
  },
  {
    id: 'dlv_5',
    endpointId: 'ep_2',
    endpointName: 'Payment Processing',
    event: 'payment.failed',
    status: 'success',
    timestamp: '2024-01-15T10:10:00Z',
    responseTime: 189,
    responseCode: 200,
    retryCount: 0
  }
];

// Generate time-series data for charts
export const generateTimeSeriesData = (
  days: number = 7,
  baseValue: number = 100,
  volatility: number = 0.1
): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    const value = Math.round(baseValue * randomFactor);
    
    data.push({
      timestamp: timestamp.toISOString(),
      value,
      label: timestamp.toLocaleDateString()
    });
  }
  
  return data;
};

// Mock dashboard KPIs
export const mockKPIs = {
  totalEndpoints: 24,
  activeEndpoints: 21,
  deliveriesToday: 12847,
  successRate: 98.2,
  avgResponseTime: 245,
  failedDeliveries: 23,
  pendingRetries: 5,
  alertsActive: 2
};

// Mock metrics data
export const mockMetrics = {
  deliveryVolume: generateTimeSeriesData(30, 1000, 0.2),
  successRate: generateTimeSeriesData(30, 98, 0.05),
  responseTime: generateTimeSeriesData(30, 250, 0.3),
  errorRate: generateTimeSeriesData(30, 2, 0.5)
};

// Status color mapping
export const statusColors = {
  success: 'success',
  failed: 'destructive',
  pending: 'warning',
  retrying: 'warning',
  active: 'success',
  inactive: 'muted',
  error: 'destructive'
} as const;