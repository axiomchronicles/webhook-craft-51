import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/app-shell";
import Dashboard from "./pages/dashboard";
import Endpoints from "./pages/endpoints";
import Deliveries from "./pages/deliveries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="endpoints" element={<Endpoints />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="simulator" element={<div className="p-6"><h1 className="text-2xl font-bold">Simulator</h1><p className="text-muted-foreground">Webhook testing and simulation tools</p></div>} />
            <Route path="pipelines" element={<div className="p-6"><h1 className="text-2xl font-bold">Pipelines</h1><p className="text-muted-foreground">Data transformation and routing</p></div>} />
            <Route path="metrics" element={<div className="p-6"><h1 className="text-2xl font-bold">Metrics</h1><p className="text-muted-foreground">Analytics and performance insights</p></div>} />
            <Route path="alerts" element={<div className="p-6"><h1 className="text-2xl font-bold">Alerts</h1><p className="text-muted-foreground">Monitoring and SLO management</p></div>} />
            <Route path="teams" element={<div className="p-6"><h1 className="text-2xl font-bold">Teams</h1><p className="text-muted-foreground">Team access and permissions</p></div>} />
            <Route path="integrations" element={<div className="p-6"><h1 className="text-2xl font-bold">Integrations</h1><p className="text-muted-foreground">External service connections</p></div>} />
            <Route path="audit" element={<div className="p-6"><h1 className="text-2xl font-bold">Audit</h1><p className="text-muted-foreground">Security and compliance logs</p></div>} />
            <Route path="billing" element={<div className="p-6"><h1 className="text-2xl font-bold">Billing</h1><p className="text-muted-foreground">Usage and billing management</p></div>} />
            <Route path="compliance" element={<div className="p-6"><h1 className="text-2xl font-bold">Compliance</h1><p className="text-muted-foreground">GDPR and SOC2 tools</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">System configuration</p></div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
