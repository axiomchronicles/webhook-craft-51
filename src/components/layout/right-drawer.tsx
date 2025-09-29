import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui';

export function RightDrawer() {
  const { rightDrawerOpen, rightDrawerContent, closeRightDrawer } = useUIStore();

  return (
    <AnimatePresence>
      {rightDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={closeRightDrawer}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">
                {rightDrawerContent === 'inspector' && 'Delivery Inspector'}
                {rightDrawerContent === 'settings' && 'Settings'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeRightDrawer}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {rightDrawerContent === 'inspector' && (
                <div className="space-y-4">
                  <div className="kpi-card">
                    <h3 className="font-medium mb-2">Delivery Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono">dlv_abc123</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="status-indicator success">Success</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Endpoint:</span>
                        <span>/api/webhooks/orders</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="kpi-card">
                    <h3 className="font-medium mb-2">Headers</h3>
                    <div className="space-y-1 text-xs font-mono">
                      <div>Content-Type: application/json</div>
                      <div>X-Webhook-ID: wh_abc123</div>
                      <div>X-Signature: sha256=abc...</div>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <h3 className="font-medium mb-2">Payload</h3>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`{
  "event": "order.completed",
  "data": {
    "id": "order_123",
    "amount": 99.99,
    "status": "completed"
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

              {rightDrawerContent === 'settings' && (
                <div className="space-y-4">
                  <div className="kpi-card">
                    <h3 className="font-medium mb-2">Appearance</h3>
                    <div className="space-y-2">
                      <label className="text-sm">Theme</label>
                      <select className="w-full p-2 border border-border rounded bg-background">
                        <option>Dark</option>
                        <option>Light</option>
                        <option>System</option>
                      </select>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <h3 className="font-medium mb-2">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked />
                        Email alerts for failures
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked />
                        Slack notifications
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" />
                        SMS for critical alerts
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}