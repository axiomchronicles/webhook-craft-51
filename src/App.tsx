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
import { lazy, Suspense } from "react";

const Simulator = lazy(() => import("./pages/simulator"));
const Pipelines = lazy(() => import("./pages/pipelines"));
const Metrics = lazy(() => import("./pages/metrics"));
const Terminal = lazy(() => import("./pages/terminal"));
const ConsoleComponent = lazy(() => import("./pages/console"));
const Alerts = lazy(() => import("./pages/alerts"));
const Teams = lazy(() => import("./pages/teams"));

const queryClient = new QueryClient();

import { ThemeProvider } from "./components/theme-provider";
const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
            <Route path="simulator" element={<Suspense fallback={<div>Loading...</div>}><Simulator /></Suspense>} />
            <Route path="pipelines" element={<Suspense fallback={<div>Loading...</div>}><Pipelines /></Suspense>} />
            <Route path="metrics" element={<Suspense fallback={<div>Loading...</div>}><Metrics /></Suspense>} />
            <Route path="terminal" element={<Suspense fallback={<div>Loading...</div>}><Terminal /></Suspense>} />
            <Route path="console" element={<Suspense fallback={<div>Loading...</div>}><ConsoleComponent /></Suspense>} />
            <Route path="alerts" element={<Suspense fallback={<div>Loading...</div>}><Alerts /></Suspense>} />
            <Route path="teams" element={<Suspense fallback={<div>Loading...</div>}><Teams /></Suspense>} />
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
</ThemeProvider>
);

export default App;
